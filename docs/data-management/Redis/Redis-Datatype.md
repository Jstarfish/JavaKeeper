---
title: Redis 数据类型篇
date: 2022-08-25
tags: 
 - Redis
categories: Redis
---

> 一提到 Redis，我们的脑子里马上就会出现一个词：“快。”
>
> 数据库这么多，为啥 Redis 能有这么突出的表现呢？一方面，这是因为它是内存数据库，所有操作都在内存上完成，内存的访问速度本身就很快。另一方面，这要归功于它的数据结构。
>
> 这是因为，键值对是按一定的数据结构来组织的，操作键值对最终就是对数据结构进行增删改查操作，所以高效的数据结构是 Redis 快速处理数据的基础。



我们都知道 Redis 是个 KV 数据库，那 KV 结构的数据在 Redis 中是如何存储的呢？

### 一、KV 如何存储？

为了实现从键到值的快速访问，Redis 使用了一个哈希表来保存所有键值对。一个哈希表，其实就是一个数组，数组的每个元素称为一个哈希桶。类似我们的 HashMap

看到这里，你可能会问了：“如果值是集合类型的话，作为数组元素的哈希桶怎么来保存呢？”

其实，**哈希桶中的元素保存的并不是值本身，而是指向具体值的指针**。这也就是说，不管值是 String，还是集合类型，哈希桶中的元素都是指向它们的指针。

在下图中，可以看到，哈希桶中的 entry 元素中保存了 `*key` 和  `*value` 指针，分别指向了实际的键和值，这样一来，即使值是一个集合，也可以通过 `*value` 指针被查找到。

![redis-kv](https://img.starfish.ink/redis/redis-kv.jpg)

因为这个哈希表保存了所有的键值对，所以，也把它称为**全局哈希表**。哈希表的最大好处很明显，就是让我们可以用 $O(1)$ 的时间复杂度来快速查找到键值对——我们只需要计算键的哈希值，就可以知道它所对应的哈希桶位置，然后就可以访问相应的 entry 元素。

```c
struct redisObject {
    unsigned type:4;      // 类型
    unsigned encoding:4;  // 编码
    unsigned lru:LRU_BITS; // 对象最后一次被访问的时间
    int refcount;					//引用计数
    void *ptr;						//指向实际值的指针
};
```

你看，这个查找过程主要依赖于哈希计算，和数据量的多少并没有直接关系。也就是说，不管哈希表里有 10 万个键还是 100 万个键，我们只需要一次计算就能找到相应的键。但是，如果你只是了解了哈希表的 $O(1)$ 复杂度和快速查找特性，那么，当你往 Redis 中写入大量数据后，就可能发现操作有时候会突然变慢了。这其实是因为你忽略了一个潜在的风险点，那就是哈希表的冲突问题和 rehash 可能带来的操作阻塞。

### 为什么哈希表操作变慢了？

当你往哈希表中写入更多数据时，哈希冲突是不可避免的问题。这里的哈希冲突，也就是指，两个 key 的哈希值和哈希桶计算对应关系时，正好落在了同一个哈希桶中。毕竟，哈希桶的个数通常要少于 key 的数量，这也就是说，难免会有一些 key 的哈希值对应到了同一个哈希桶中。

Redis 解决哈希冲突的方式，就是<mark>链式哈希</mark>。和 JDK7 中的 HahsMap 类似，链式哈希也很容易理解，**就是指同一个哈希桶中的多个元素用一个链表来保存，它们之间依次用指针连接**。

如下图所示：哈希桶 6 上就有 3 个连着的 entry，也叫作哈希冲突链。

![redis-kv-conflict](https://img.starfish.ink/redis/redis-kv-conflict.jpg)

但是，这里依然存在一个问题，哈希冲突链上的元素只能通过指针逐一查找再操作。如果哈希表里写入的数据越来越多，哈希冲突可能也会越来越多，这就会导致某些哈希冲突链过长，进而导致这个链上的元素查找耗时长，效率降低。对于追求“快”的 Redis 来说，这是不太能接受的。

所以，Redis 会对哈希表做 rehash 操作。rehash 也就是增加现有的哈希桶数量，让逐渐增多的 entry 元素能在更多的桶之间分散保存，减少单个桶中的元素数量，从而减少单个桶中的冲突。那具体怎么做呢？

其实，为了使 rehash 操作更高效，Redis 默认使用了两个全局哈希表：哈希表 1 和哈希表 2。

```c
struct dict {
    dictType *type;

    dictEntry **ht_table[2];
    unsigned long ht_used[2];

    long rehashidx; /* rehashing not in progress if rehashidx == -1 */

    /* Keep small vars at end for optimal (minimal) struct padding */
    int16_t pauserehash; /* If >0 rehashing is paused (<0 indicates coding error) */
    signed char ht_size_exp[2]; /* exponent of size. (size = 1<<exp) */
};
```

一开始，当你刚插入数据时，默认使用哈希表 1，此时的哈希表 2 并没有被分配空间。随着数据逐步增多，Redis 开始执行 rehash，这个过程分为三步：

1. 给哈希表 2 分配更大的空间，例如是当前哈希表 1 大小的两倍；
2. 把哈希表 1 中的数据重新映射并拷贝到哈希表 2 中；
3. 释放哈希表 1 的空间。

到此，我们就可以从哈希表 1 切换到哈希表 2，用增大的哈希表 2 保存更多数据，而原来的哈希表 1 留作下一次 rehash 扩容备用。这个过程看似简单，但是第二步涉及大量的数据拷贝，如果一次性把哈希表 1 中的数据都迁移完，会造成 Redis 线程阻塞，无法服务其他请求。此时，Redis 就无法快速访问数据了。为了避免这个问题，Redis 采用了<mark>渐进式 rehash</mark>。

简单来说就是在第二步拷贝数据时，Redis 仍然正常处理客户端请求，每处理一个请求时，从哈希表 1 中的第一个索引位置开始，顺带着将这个索引位置上的所有 entries 拷贝到哈希表 2 中；等处理下一个请求时，再顺带拷贝哈希表 1 中的下一个索引位置的 entries。如下图所示：

![redis-rehash](https://img.starfish.ink/redis/redis-rehash.jpg)

渐进式 rehash 这样就巧妙地把一次性大量拷贝的开销，分摊到了多次处理请求的过程中，避免了耗时操作，保证了数据的快速访问。

好了，到这里，你应该就能理解，Redis 的键和值是怎么通过哈希表组织的了。对于 String 类型来说，找到哈希桶就能直接增删改查了，所以，哈希表的 $O(1)$ 操作复杂度也就是它的复杂度了。但是，对于集合类型来说，即使找到哈希桶了，还要在集合中再进一步操作。

所以集合的操作效率又与集合的底层数据结构有关，接下来我们再说 Redis 的底层数据结构~



## 一、Redis 的五种基本数据类型和其数据结构

由于 Redis 是基于标准 C 写的，只有最基础的数据类型，因此 Redis 为了满足对外使用的 5 种基本数据类型，开发了属于自己**独有的一套基础数据结构**，使用这些数据结构来实现 5 种数据类型。

**Redis** 有 5 种基础数据类型，它们分别是：**string(字符串)**、**list(列表)**、**hash(字典)**、**set(集合)** 和 **zset(有序集合)**。

Redis 底层的数据结构包括：**简单动态数组SDS、链表、字典、跳跃链表、整数集合、快速列表、压缩列表、对象。**

Redis 为了平衡空间和时间效率，针对 value 的具体类型在底层会采用不同的数据结构来实现，其中哈希表和压缩列表是复用比较多的数据结构，如下图展示了对外数据类型和底层数据结构之间的映射关系：

![](https://img.starfish.ink/redis/redis-data-type.png)

下面我们具体看下各种数据类型的底层实现和操作。

> 安装好 Redis，我们可以使用 `redis-cli` 来对 Redis 进行命令行的操作，当然 Redis 官方也提供了在线的调试器，你也可以在里面敲入命令进行操作：http://try.redis.io/#run

### 1、String（字符串）

String 是 Redis 最基本的类型，你可以理解成与 Memcached 一模一样的类型，一个 key 对应一个 value。

String 类型是二进制安全的。意思是 Redis 的 String 可以包含任何数据。比如 jpg 图片或者序列化的对象 。

Redis 的字符串是动态字符串，是可以修改的字符串，**内部结构实现上类似于 Java 的 ArrayList**，采用预分配冗余空间的方式来减少内存的频繁分配，如图中所示，内部为当前字符串实际分配的空间 capacity 一般要高于实际字符串长度 len。当字符串长度小于 1M 时，扩容都是加倍现有的空间，如果超过 1M，扩容时一次只会多扩 1M 的空间。需要注意的是字符串最大长度为 512M。 

![](https://img.starfish.ink/redis/redis-string-length.jpg)



Redis 没有直接使用 C 语言传统的字符串表示（以空字符结尾的字符数组，以下简称 C 字符串）， 而是自己构建了一种名为简单动态字符串（simple dynamic string，SDS）的抽象类型， 并将 SDS 用作 Redis 的默认字符串表示。

根据传统， C 语言使用长度为 `N+1` 的字符数组来表示长度为 `N` 的字符串， 并且字符数组的最后一个元素总是空字符 `'\0'` 。

比如说， 下图就展示了一个值为 `"Redis"` 的 C 字符串：

![](https://img.starfish.ink/redis/c-string.jpg)

C 语言使用的这种简单的字符串表示方式， 并不能满足 Redis 对字符串在安全性、效率、以及功能方面的要求

[下面说明 SDS 比 C 字符串更适用于 Redis 的原因](http://redisbook.com/preview/sds/different_between_sds_and_c_string.html "SDS 与 C 字符串的区别")：

- **常数复杂度获取字符串长度**

  因为 C 字符串并不记录自身的长度信息， 所以为了获取一个 C 字符串的长度， 程序必须遍历整个字符串，对遇到的每个字符进行计数， 直到遇到代表字符串结尾的空字符为止， 这个操作的复杂度为 $O(N)$

  和 C 字符串不同， 因为 SDS 在 `len` 属性中记录了 SDS 本身的长度， 所以获取一个 SDS 长度的复杂度仅为 $O(1)$

  举个例子， 对于下图所示的 SDS 来说， 程序只要访问 SDS 的 `len` 属性， 就可以立即知道 SDS 的长度为 `5` 字节：

  ![](https://img.starfish.ink/redis/redis-sds.jpg)

  通过使用 SDS 而不是 C 字符串， Redis 将获取字符串长度所需的复杂度从 $O(N)$ 降低到了 $O(1)$ ， 这确保了获取字符串长度的工作不会成为 Redis 的性能瓶颈

- **缓冲区溢出/内存泄漏**

  跟上述问题原因一样，如果执行拼接 or 缩短字符串的操作，操作不当就很容易造成上述问题；

- **减少修改字符串带来的内存分配次数**

  因为 C 字符串并不记录自身的长度， 所以对于一个包含了 `N` 个字符的 C 字符串来说， 这个 C 字符串的底层实现总是一个 `N+1` 个字符长的数组（额外的一个字符空间用于保存空字符）。

  因为 C 字符串的长度和底层数组的长度之间存在着这种关联性， 所以每次增长或者缩短一个 C 字符串， 程序都总要对保存这个 C 字符串的数组进行一次内存重分配操作：

  - 如果程序执行的是增长字符串的操作， 比如拼接操作（append）， 那么在执行这个操作之前， 程序需要先通过内存重分配来扩展底层数组的空间大小 —— 如果忘了这一步就会产生缓冲区溢出。
  - 如果程序执行的是缩短字符串的操作， 比如截断操作（trim）， 那么在执行这个操作之后， 程序需要通过内存重分配来释放字符串不再使用的那部分空间 —— 如果忘了这一步就会产生内存泄漏。

  为了避免 C 字符串的这种缺陷， SDS 通过未使用空间解除了字符串长度和底层数组长度之间的关联： 在 SDS 中， `buf` 数组的长度不一定就是字符数量加一， 数组里面可以包含未使用的字节， 而这些字节的数量就由 SDS 的 `free` 属性记录。

  通过未使用空间， SDS 实现了空间预分配和惰性空间释放两种优化策略。

- **二进制安全**

  因为 C 语言中的字符串必须符合某种编码（比如 ASCII），并且除了字符串的末尾之外， 字符串里面不能包含空字符， 否则最先被程序读入的空字符将被误认为是字符串结尾 —— 这些限制使得 C 字符串只能保存文本数据， 而不能保存像图片、音频、视频、压缩文件这样的二进制数据

> 字符串对象的编码可以使 int、raw 或者 embstr，
>
> 当存储的值为整数，且值的大小可以用 long 类型表示时，使用 int 编码。
>
> 如果字符串对象保存的事一个字符串值，并且这个字符串的长度 <= 44 字节，采用 embstr 编码，否则使用 raw。
>
> 可以通过 `TYPE KEY_NAME` 查看 key 所存储的值的类型验证下。

### 2、List（列表）

**Redis 的列表相当于 Java 语言里面的 LinkedList，注意它是链表而不是数组。这意味着 list 的插入和删除操作非常快，时间复杂度为 O(1)，但是索引定位很慢，时间复杂度为 O(n)**

当列表弹出了最后一个元素之后，该数据结构自动被删除，内存被回收。

![](../../../../picBed/img/20201116153913.gif)

Redis 的列表结构常用来做异步队列使用。将需要延后处理的任务结构体序列化成字符串塞进 Redis 的列表，另一个线程从这个列表中轮询数据进行处理

**右边进左边出：队列** 

```shell
> rpush books python java golang 
(integer) 3 
\> llen books
 (integer) 3 
\> lpop books
 "python" 
\> lpop books
 "java" 
\> lpop books 
"golang" 
\> lpop books 
(nil)
```

**右边进右边出：栈** 

```shell
> rpush books python java golang
 (integer) 3
 \> rpop books 
"golang" 
\> rpop books 
"java" 
\> rpop books 
"python"
 \> rpop books
 (nil)
```



#### [列表的实现](http://redisbook.com/preview/adlist/implementation.html)

列表这种数据类型支持存储一组数据。这种数据类型对应两种实现方法，一种是压缩列表（ziplist），另一种是双向循环链表。

当列表中存储的数据量比较小的时候，列表就可以采用压缩列表的方式实现。具体需要同时满足下面两个条件：

- 列表中保存的单个数据（有可能是字符串类型的）小于 64 字节；
- 列表中数据个数少于 512 个。

>听到“压缩”两个字，直观的反应就是节省内存。之所以说这种存储结构节省内存，是相较于数组的存储思路而言的。我们知道，数组要求每个元素的大小相同，如果我们要存储不同长度的字符串，那我们就需要用最大长度的字符串大小作为元素的大小（假设是 20 个字节）。那当我们存储小于 20 个字节长度的字符串的时候，便会浪费部分存储空间。听起来有点儿拗口，我画个图解释一下。
>
>![img](https://static001.geekbang.org/resource/image/2e/69/2e2f2e5a2fe25d26dc2fc04cfe88f869.jpg)
>
>压缩列表这种存储结构，一方面比较节省内存，另一方面可以支持不同类型数据的存储。而且，因为数据存储在一片连续的内存空间，通过键来获取值为列表类型的数据，读取的效率也非常高。

当列表中存储的数据量比较大的时候，也就是不能同时满足刚刚讲的两个条件的时候，列表就要通过双向循环链表来实现了。

Redis 的这种双向链表的实现方式，非常值得借鉴。它额外定义一个 list 结构体，来组织链表的首、尾指针，还有长度等信息。这样，在使用的时候就会非常方便。

我们可以从 [源码](https://github.com/redis/redis/blob/unstable/src/adlist.h "redis源码") 的 `adlist.h/listNode` 来看到对其的定义：

```c
/* Node, List, and Iterator are the only data structures used currently. */

typedef struct listNode {
    struct listNode *prev; // 前置节点
    struct listNode *next; // 后置节点
    void *value;           // 节点的值
} listNode;

typedef struct listIter {
    listNode *next;
    int direction;
} listIter;

typedef struct list {
    listNode *head;		// 表头节点
    listNode *tail;		// 表尾节点
    void *(*dup)(void *ptr);	// 节点值复制函数
    void (*free)(void *ptr);	// 节点值释放函数
    int (*match)(void *ptr, void *key);	// 节点值对比函数
    unsigned long len;	// 链表所包含的节点数量
} list;
```



### 3、Hash（字典）

Redis hash 是一个键值对集合。KV 模式不变，但 V 又是一个键值对。

字典类型也有两种实现方式。一种是我们刚刚讲到的压缩列表，另一种是散列表。

同样，只有当存储的数据量比较小的情况下，Redis 才使用压缩列表来实现字典类型。具体需要满足两个条件：

- 字典中保存的键和值的大小都要小于 64 字节；
- 字典中键值对的个数要小于 512 个。

当不能同时满足上面两个条件的时候，Redis 就使用散列表来实现字典类型。Redis 使用 `MurmurHash2` 这种运行速度快、随机性好的哈希算法作为哈希函数。对于哈希冲突问题，Redis 使用链表法来解决。除此之外，Redis 还支持散列表的动态扩容、缩容。当数据动态增加之后，散列表的装载因子会不停地变大。为了避免散列表性能的下降，当装载因子大于 1 的时候，Redis 会触发扩容，将散列表扩大为原来大小的 2 倍左右（具体值需要计算才能得到，如果感兴趣，你可以去[阅读源码](https://github.com/redis/redis/blob/unstable/src/dict.c)）。

Redis 的字典相当于 Java 语言里面的 HashMap，它是无序字典， 内部实现结构上同 Java 的 HashMap 也是一致的，同样的**数组 + 链表**二维结构。第一维 hash 的数组位置碰撞时，就会将碰撞的元素使用链表串接起来。 

不同的是，Redis 的字典的值只能是字符串，另外它们 rehash 的方式不一样，因为 Java 的 HashMap 在字典很大时，rehash 是个耗时的操作，需要一次性全部 rehash。

扩容缩容要做大量的数据搬移和哈希值的重新计算，所以比较耗时。针对这个问题，Redis 使用我们在散列表讲的渐进式扩容缩容策略，将数据的搬移分批进行，避免了大量数据一次性搬移导致的服务停顿。

渐进式 rehash 会在 rehash 的同时，保留新旧两个 hash 结构，查询时会同时查询两个 hash 结构，然后在后续的定时任务中以及 hash 操作指令中，循序渐进地将旧 hash 的内容一点点迁移到新的 hash 结构中。当搬迁完成了，就会使用新的 hash 结构取而代之。

当 hash 移除了最后一个元素之后，该数据结构自动被删除，内存被回收。



#### [字典的实现](http://redisbook.com/preview/dict/datastruct.html "字典的实现")

Redis 字典源码由 `dict.h/dictht` 结构定义：

```c
typedef struct dictEntry {
    void *key;
    union {
        void *val;
        uint64_t u64;
        int64_t s64;
        double d;
    } v;
    struct dictEntry *next;
} dictEntry;

/* This is our hash table structure. Every dictionary has two of this as we
 * implement incremental rehashing, for the old to the new table. */
typedef struct dictht {
    dictEntry **table; 		// 哈希表数组
    unsigned long size;		// 哈希表大小
    unsigned long sizemask;	// 哈希表大小掩码，用于计算索引值,总是等于 size - 1
    unsigned long used;		// 该哈希表已有节点的数量
} dictht;

typedef struct dict {
    dictType *type;	 // 类型特定函数
    void *privdata; // 私有数据 
    dictht ht[2];	// 哈希表
	long rehashidx; /* rehashing not in progress if rehashidx == -1 */
    unsigned long iterators; /* number of iterators currently running */
} dict;
```



### 4、Set（集合）

集合这种数据类型用来存储一组不重复的数据。这种数据类型也有两种实现方法，一种是基于有序数组，另一种是基于散列表。当要存储的数据，同时满足下面这样两个条件的时候，Redis 就采用有序数组，来实现集合这种数据类型。

- 存储的数据都是整数；
- 存储的数据元素个数不超过 512 个。

当不能同时满足这两个条件的时候，Redis 就使用散列表来存储集合中的数据。

Redis 的 Set 是 String 类型的无序集合。它是通过 HashTable 实现的， 相当于 Java 语言里面的 HashSet，它内部的键值对是无序的唯一的。它的内部实现相当于一个特殊的字典，字典中所有的 value 都是一个值 `NULL`。 

当集合中最后一个元素移除之后，数据结构自动删除，内存被回收。



### 5、zset(sorted set：有序集合)

zset 和 set 一样也是 String 类型元素的集合，且不允许重复的成员。不同的是每个元素都会关联一个 double 类型的分数。

Redis 正是通过分数来为集合中的成员进行从小到大的排序。zset 的成员是唯一的，但分数(score)却可以重复。

它类似于 Java 的 SortedSet 和 HashMap 的结合体，一方面它是一个 set，保证了内部 value 的唯一性，另一方面它可以给每个 value 赋予一个 score，代表这个 value 的排序权重。它的内部实现用的是一种叫做「**跳跃列表**」的数据结构。 

zset 中最后一个 value 被移除后，数据结构自动删除，内存被回收。

实际上，跟 Redis 的其他数据类型一样，有序集合也并不仅仅只有跳表这一种实现方式。当数据量比较小的时候，Redis 会用压缩列表来实现有序集合。具体点说就是，使用压缩列表来实现有序集合的前提，有这样两个：

- 所有数据的大小都要小于 64 字节；
- 元素个数要小于 128 个。



为什么 Redis 要用跳表来实现有序集合，而不是红黑树？

Redis 中的有序集合是通过跳表来实现的，严格点讲，其实还用到了散列表。不过散列表我们后面才会讲到，所以我们现在暂且忽略这部分。如果你去查看 Redis 的开发手册，就会发现，Redis 中的有序集合支持的核心操作主要有下面这几个：

- 插入一个数据；
- 删除一个数据；
- 查找一个数据；
- 按照区间查找数据（比如查找值在[100, 356]之间的数据）；
- 迭代输出有序序列。

其中，插入、删除、查找以及迭代输出有序序列这几个操作，红黑树也可以完成，时间复杂度跟跳表是一样的。但是，按照区间来查找数据这个操作，红黑树的效率没有跳表高。对于按照区间查找数据这个操作，跳表可以做到 $O(logn)$ 的时间复杂度定位区间的起点，然后在原始链表中顺序往后遍历就可以了。这样做非常高效。当然，Redis 之所以用跳表来实现有序集合，还有其他原因，比如，跳表更容易代码实现。虽然跳表的实现也不简单，但比起红黑树来说还是好懂、好写多了，而简单就意味着可读性好，不容易出错。还有，跳表更加灵活，它可以通过改变索引构建策略，有效平衡执行效率和内存消耗。不过，跳表也不能完全替代红黑树。因为红黑树比跳表的出现要早一些，很多编程语言中的 Map 类型都是通过红黑树来实现的。我们做业务开发的时候，直接拿来用就可以了，不用费劲自己去实现一个红黑树，但是跳表并没有一个现成的实现，所以在开发中，如果你想使用跳表，必须要自己实现。



## 二、其他数据类型

### bitmaps

#####  ☆☆位图：

在我们平时开发过程中，会有一些 bool 型数据需要存取，比如用户一年的签到记录，签了是 1，没签是 0，要记录 365 天。如果使用普通的 key/value，每个用户要记录 365 个，当用户上亿的时候，需要的存储空间是惊人的。

为了解决这个问题，Redis 提供了位图数据结构，这样每天的签到记录只占据一个位，365 天就是 365 个位，46 个字节 (一个稍长一点的字符串) 就可以完全容纳下，这就大大节约了存储空间。

![img](../../../../picBed/img/20201116155417.gif)



位图不是特殊的数据结构，它的内容其实就是普通的字符串，也就是 byte 数组。我们可以使用普通的 get/set 直接获取和设置整个位图的内容，也可以使用位图操作 getbit/setbit 等将 byte 数组看成「位数组」来处理

Redis 的位数组是自动扩展，如果设置了某个偏移位置超出了现有的内容范围，就会自动将位数组进行零扩充。 

![](../../../../picBed/img/20201116155452.gif)

接下来我们使用 redis-cli 设置第一个字符，也就是位数组的前 8 位，我们只需要设置值为 1 的位，如上图所示，h 字符只有 1/2/4 位需要设置，e 字符只有 9/10/13/15 位需要设置。值得注意的是位数组的顺序和字符的位顺序是相反的。

```sh
127.0.0.1:6379> setbit s 1 1
(integer) 0
127.0.0.1:6379> setbit s 2 1
(integer) 0
127.0.0.1:6379> setbit s 4 1
(integer) 0
127.0.0.1:6379> setbit s 9 1
(integer) 0
127.0.0.1:6379> setbit s 10 1
(integer) 0
127.0.0.1:6379> setbit s 13 1
(integer) 0
127.0.0.1:6379> setbit s 15 1
(integer) 0
127.0.0.1:6379> get s
"he"
```

上面这个例子可以理解为「零存整取」，同样我们还也可以「零存零取」，「整存零取」。「零存」就是使用 setbit 对位值进行逐个设置，「整存」就是使用字符串一次性填充所有位数组，覆盖掉旧值。

bitcount 和 bitop,  bitpos, bitfield 都是操作位图的指令。



### HyperLogLog

Redis 在 2.8.9 版本添加了 HyperLogLog 结构。

场景：可以用来统计站点的UV...

Redis HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。但是会有误差。

| 命令    | 用法                                       | 描述                                      |
| ------- | ------------------------------------------ | ----------------------------------------- |
| pfadd   | [PFADD key element [element ...]           | 添加指定元素到 HyperLogLog 中             |
| pfcount | [PFCOUNT key [key ...]                     | 返回给定 HyperLogLog 的基数估算值。       |
| pfmerge | [PFMERGE destkey sourcekey [sourcekey ...] | 将多个 HyperLogLog 合并为一个 HyperLogLog |

```java
public class JedisTest {
  public static void main(String[] args) {
    Jedis jedis = new Jedis();
    for (int i = 0; i < 100000; i++) {
      jedis.pfadd("codehole", "user" + i);
    }
    long total = jedis.pfcount("codehole");
    System.out.printf("%d %d\n", 100000, total);
    jedis.close();
  }
}
```

[HyperLogLog图解](http://content.research.neustar.biz/blog/hll.html )



### Geo



## 三、Redis常见数据类型和命令查阅：

[Redis命令中心](http://www.redis.cn/commands.html)

[Redis 命令参考](http://redisdoc.com/ )

#### Key（键）常用命令

| 命令         | 用法                   | 描述                                                         | 示例                                                         |
| ------------ | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **DEL**      | DEL key [key ...]      | 删除给定的一个或多个 key。 不存在的 key 会被忽略             |                                                              |
| DUMP         | DUMP key               | 序列化给定 key ，并返回被序列化的值，使用 RESTORE 命令可以将这个值反序列化为 Redis 键 |                                                              |
| EXISTS       | EXISTS key             | 检查给定 key 是否存在                                        |                                                              |
| **EXPIRE**   | EXPIRE key seconds     | 为给定 key 设置生存时间，当 key 过期时(生存时间为 0 )，它会被自动删除 |                                                              |
| **PERSIST**  | PERSIST key            | 移除 key 的过期时间，key 将持久保持。                        |                                                              |
| **EXPIREAT** | EXPIREAT key timestamp | EXPIREAT 的作用和 EXPIRE 类似，都用于为 key 设置生存时间。 不同在于 EXPIREAT 命令接受的时间参数是 UNIX 时间戳(unix timestamp) | EXPIREAT cache 1355292000     # 这个 key 将在 2012.12.12 过期 |
| **KEYS**     | KEYS pattern           | 查找所有符合给定模式 pattern 的 key                          | KEYS *  # 匹配数据库内所有 key                               |
| MOVE         | MOVE key db            | 将当前数据库的 key 移动到给定的数据库 db 当中如果当前数据库(源数据库)和给定数据库(目标数据库)有相同名字的给定 key ，或者 key 不存在于当前数据库，那么 MOVE 没有任何效果。 因此，也可以利用这一特性，将 MOVE 当作锁(locking)原语(primitive) | MOVE song 1                          # 将 song 移动到数据库 1 |
| **TTL**      | TTL key                | 以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)当 key 不存在时，返回 -2 。当 key 存在但没有设置剩余生存时间时，返回 -1 。否则，以秒为单位，返回 key 的剩余生存时间 |                                                              |
| PTTL         | PTTL key               | 以毫秒为单位返回 key 的剩余的过期时间。                      |                                                              |
| **TYPE**     | TYPE key               | 返回 key 所储存的值的类型                                    |                                                              |
| RENAME       | RENAME key newkey      | 将 key 改名为 newkey 。当 key 和 newkey 相同，或者 key 不存在时，返回一个错误。当 newkey 已经存在时， RENAME 命令将覆盖旧值 |                                                              |



#### String （字符串）常用命令

| 命令        | 用法                                                  | 描述                                                         | 示例                                                         |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **SET**     | SET key value [EX seconds] [PX milliseconds] [NX\|XX] | 将字符串值 value 关联到 key 。如果 key 已经持有其他值， SET 就覆写旧值，无视类型 | SET key "value"                                              |
| **MSET**    | MSET key value [key value ...]                        | 同时设置一个或多个 key-value 对。如果某个给定 key 已经存在，那么 MSET 会用新值覆盖原来的旧值，如果这不是你所希望的效果，请考虑使用 MSETNX 命令：它只会在所有给定 key 都不存在的情况下进行设置操作 | MSET date "2012.3.30" time "11:00 a.m." weather "sunny"      |
| **SETNX**   | SETNX key value                                       | 将 key 的值设为 value ，当且仅当 key 不存在。若给定的 key 已经存在，则 SETNX 不做任何动作 SETNX 是『SET if Not eXists』(如果不存在，则 SET)的简写 |                                                              |
| MSETNX      | MSETNX key value [key value ...]                      | 同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在。即使只有一个给定 key 已存在， MSETNX 也会拒绝执行所有给定 key 的设置操作 |                                                              |
| SETRANGE    | SETRANGE key offset value                             | 用 value 参数覆写(overwrite)给定 key 所储存的字符串值，从偏移量 offset 开始。不存在的 key 当作空白字符串处理 |                                                              |
| SETBIT      | SETBIT key offset value                               | 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)     | GETBIT bit 100   # bit 默认被初始化为 0                      |
| SETEX       | SETEX key seconds value                               | 将值 value 关联到 key ，并将 key 的生存时间设为 seconds (以秒为单位)。如果 key 已经存在， SETEX 命令将覆写旧值。 |                                                              |
| PSETEX      | PSETEX key milliseconds value                         | 这个命令和 SETEX 命令相似，但它以毫秒为单位设置 key 的生存时间，而不是像 SETEX 命令那样，以秒为单位 |                                                              |
| STRLEN      | STRLEN key                                            | 返回 key 所储存的字符串值的长度。当 key 储存的不是字符串值时，返回一个错误 |                                                              |
| **GET**     | GET key                                               | 返回 key 所关联的字符串值。如果 key 不存在那么返回特殊值 nil |                                                              |
| **MGET**    | MGET key [key ...]                                    | 返回所有(一个或多个)给定 key 的值。如果给定的 key 里面，有某个 key 不存在，那么这个 key 返回特殊值 nil 。因此，该命令永不失败 |                                                              |
| GETRANGE    | GETRANGE key start end                                | 返回 key 中字符串值的子字符串，字符串的截取范围由 start 和 end 两个偏移量决定(包括 start 和 end 在内)。负数偏移量表示从字符串最后开始计数， -1 表示最后一个字符， -2 表示倒数第二个，以此类推。 | GETRANGE greeting 0 4                                        |
| GETSET      | GETSET key value                                      | 将给定 key 的值设为 value ，并返回 key 的旧值(old value)。当 key 存在但不是字符串类型时，返回一个错误。 |                                                              |
| GETBIT      | GETBIT key offset                                     | 对 key 所储存的字符串值，获取指定偏移量上的位(bit)。当 offset 比字符串值的长度大，或者 key 不存在时，返回 0 |                                                              |
| **APPEND**  | APPEND key value                                      | 如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。如果 key 不存在， APPEND 就简单地将给定 key 设为 value ，就像执行 SET key value 一样 |                                                              |
| **DECR**    | DECR key                                              | 将 key 中储存的数字值减一。如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 DECR 操作 | redis> SET failure_times 10OK redis> DECR failure_times(integer) 9 |
| **DECRBY**  | DECRBY key decrement                                  | 将 key 所储存的值减去减量 decrement                          |                                                              |
| **INCR**    | INCR key                                              | 将 key 中储存的数字值增一。如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCR 操作 |                                                              |
| **INCRBY**  | INCRBY key increment                                  | 将 key 所储存的值加上增量 increment                          |                                                              |
| INCRBYFLOAT | INCRBYFLOAT key increment                             | 为 key 中所储存的值加上浮点数增量 increment                  | INCRBYFLOAT mykey 0.1                                        |
| BITCOUNT    | BITCOUNT key [start] [end]                            | 计算给定字符串中，被设置为 1 的比特位的数量                  |                                                              |
| BITOP       | BITOP operation destkey key [key ...]                 | 对一个或多个保存二进制位的字符串 key 进行位元操作，并将结果保存到 destkey 上。 |                                                              |



#### List（列表）常用命令

| 命令       | 用法                                  | 描述                                                         | 示例                                          |
| ---------- | ------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| **LPUSH**  | LPUSH key value [value ...]           | 将一个或多个值 value 插入到列表 key 的表头如果有多个 value 值，那么各个 value 值按从左到右的顺序依次插入到表头 | 正着进反着出                                  |
| LPUSHX     | LPUSHX key value                      | 将值 value 插入到列表 key 的表头，当且仅当 key 存在并且是一个列表。和 LPUSH 命令相反，当 key 不存在时， LPUSHX 命令什么也不做 |                                               |
| **RPUSH**  | RPUSH key value [value ...]           | 将一个或多个值 value 插入到列表 key 的表尾(最右边)           | 怎么进怎么出                                  |
| RPUSHX     | RPUSHX key value                      | 将值 value 插入到列表 key 的表尾，当且仅当 key 存在并且是一个列表。和 RPUSH 命令相反，当 key 不存在时， RPUSHX 命令什么也不做。 |                                               |
| **LPOP**   | LPOP key                              | 移除并返回列表 key 的头元素。                                |                                               |
| **BLPOP**  | BLPOP key [key ...] timeout           | 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止 |                                               |
| **RPOP**   | RPOP key                              | 移除并返回列表 key 的尾元素。                                |                                               |
| **BRPOP**  | BRPOP key [key ...] timeout           | 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |                                               |
| BRPOPLPUSH | BRPOPLPUSH source destination timeout | 从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它； 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。 |                                               |
| RPOPLPUSH  | RPOPLPUSH source destinationb         | 命令 RPOPLPUSH 在一个原子时间内，执行以下两个动作：将列表 source 中的最后一个元素(尾元素)弹出，并返回给客户端。将 source 弹出的元素插入到列表 destination ，作为 destination 列表的的头元素 | RPOPLPUSH list01 list02                       |
| **LSET**   | LSET key index value                  | 将列表 key 下标为 index 的元素的值设置为 value               |                                               |
| **LLEN**   | LLEN key                              | 返回列表 key 的长度。如果 key 不存在，则 key 被解释为一个空列表，返回 0 .如果 key 不是列表类型，返回一个错误 |                                               |
| **LINDEX** | LINDEX key index                      | 返回列表 key 中，下标为 index 的元素。下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。相当于 Java 链表的`get(int index)`方法，它需要对链表进行遍历，性能随着参数`index`增大而变差。 |                                               |
| **LRANGE** | LRANGE key start stop                 | 返回列表 key 中指定区间内的元素，区间以偏移量 start 和 stop 指定 |                                               |
| LREM       | LREM key count value                  | 根据参数 count 的值，移除列表中与参数 value 相等的元素       |                                               |
| LTRIM      | LTRIM key start stop                  | 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除 |                                               |
| LINSERT    | LINSERT key BEFORE\|AFTER pivot value | 将值 value 插入到列表 key 当中，位于值 pivot 之前或之后。当 pivot 不存在于列表 key 时，不执行任何操作。当 key 不存在时， key 被视为空列表，不执行任何操作。如果 key 不是列表类型，返回一个错误。 | LINSERT list01 before c++ c#(在c++之前加上C#) |

#### **Hash**（哈希表）常用命令

| 命令         | 用法                                           | 描述                                                         | 示例 |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------ | ---- |
| **HSET**     | HSET key field value                           | 将哈希表 key 中的域 field 的值设为 value 。如果 key 不存在，一个新的哈希表被创建并进行 HSET 操作。如果域 field 已经存在于哈希表中，旧值将被覆盖。 |      |
| **HMSET**    | HMSET key field value [field value ...]        | 同时将多个 field-value (域-值)对设置到哈希表 key 中。此命令会覆盖哈希表中已存在的域。 |      |
| **HSETNX**   | HSETNX key field value                         | 将哈希表 key 中的域 field 的值设置为 value ，当且仅当域 field 不存在。若域 field 已经存在，该操作无效 |      |
| **HGET**     | HGET key field                                 | 返回哈希表 key 中给定域 field 的值                           |      |
| **HMGET**    | HMGET key field [field ...]                    | 返回哈希表 key 中，一个或多个给定域的值。                    |      |
| **HGETALL**  | HGETALL key                                    | 返回哈希表 key 中，所有的域和值。在返回值里，紧跟每个域名(field name)之后是域的值(value)，所以返回值的长度是哈希表大小的两倍 |      |
| HDEL         | HDEL key field [field ...]                     | 删除哈希表 key 中的一个或多个指定域，不存在的域将被忽略      |      |
| HEXISTS      | HEXISTS key field                              | 查看哈希表 key 中，给定域 field 是否存在                     |      |
| HLEN         | HLEN key                                       | 返回哈希表 key 中域的数量                                    |      |
| **HKEYS**    | HKEYS key                                      | 返回哈希表 key 中的所有域                                    |      |
| **HVALS**    | HVALS key                                      | 返回哈希表 key 中所有域的值                                  |      |
| HSTRLEN      | HSTRLEN key field                              | 返回哈希表 key 中，与给定域 field 相关联的值的字符串长度（string length）。如果给定的键或者域不存在，那么命令返回 0 |      |
| HINCRBY      | HINCRBY key field increment                    | 为哈希表 key 中的域 field 的值加上增量 increment             |      |
| HINCRBYFLOAT | HINCRBYFLOAT key field increment               | 为哈希表 key 中的域 field 加上浮点数增量 increment           |      |
| HSCAN        | HSCAN key cursor [MATCH pattern] [COUNT count] | 迭代哈希表中的键值对。                                       |      |



#### Set（集合）常用命令

| 命令          | 用法                                           | 描述                                                         | 示例 |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------ | ---- |
| **SADD**      | SADD key member [member ...]                   | 将一个或多个 member 元素加入到集合 key 当中，已经存在于集合的 member 元素将被忽略。假如 key 不存在，则创建一个只包含 member 元素作成员的集合。当 key 不是集合类型时，返回一个错误 |      |
| **SCARD**     | SCARD key                                      | 返回集合 key 的基数(集合中元素的数量)。                      |      |
| **SDIFF**     | SDIFF key [key ...]                            | 返回一个集合的全部成员，该集合是所有给定集合之间的差集。不存在的 key 被视为空集。 | 差集 |
| SDIFFSTORE    | SDIFFSTORE destination key [key ...]           | 这个命令的作用和 SDIFF 类似，但它将结果保存到 destination 集合，而不是简单地返回结果集。如果 destination 集合已经存在，则将其覆盖。destination 可以是 key 本身。 |      |
| **SINTER**    | SINTER key [key ...]                           | 返回一个集合的全部成员，该集合是所有给定集合的交集。不存在的 key 被视为空集。当给定集合当中有一个空集时，结果也为空集(根据集合运算定律) | 交集 |
| SINTERSTORE   | SINTERSTORE destination key [key ...]          | 这个命令类似于 SINTER 命令，但它将结果保存到 destination 集合，而不是简单地返回结果集。如果 destination 集合已经存在，则将其覆盖。destination 可以是 key 本身 |      |
| **SUNION**    | SUNION key [key ...]                           | 返回一个集合的全部成员，该集合是所有给定集合的并集。不存在的 key 被视为空集 | 并集 |
| SUNIONSTORE   | SUNIONSTORE destination key [key ...]          | 这个命令类似于 SUNION 命令，但它将结果保存到 destination 集合，而不是简单地返回结果集。如果 destination 已经存在，则将其覆盖。destination 可以是 key 本身 |      |
| **SMEMBERS**  | SMEMBERS key                                   | 返回集合 key 中的所有成员。不存在的 key 被视为空集合         |      |
| SRANDMEMBER   | SRANDMEMBER key [count]                        | 如果命令执行时，只提供了 key 参数，那么返回集合中的一个随机元素 |      |
| **SISMEMBER** | SISMEMBER key member                           | 判断 member 元素是否集合 key 的成员                          |      |
| SMOVE         | SMOVE source destination member                | 将 member 元素从 source 集合移动到 destination 集合。        |      |
| SPOP          | SPOP key                                       | 移除并返回集合中的一个随机元素。如果只想获取一个随机元素，但不想该元素从集合中被移除的话，可以使用 SRANDMEMBER 命令。 |      |
| **SREM**      | SREM key member [member ...]                   | 移除集合 key 中的一个或多个 member 元素，不存在的 member 元素会被忽略。当 key 不是集合类型，返回一个错误 |      |
| SSCAN         | SSCAN key cursor [MATCH pattern] [COUNT count] | 迭代集合中的元素                                             |      |



#### SortedSet（有序集合）常用命令

| 命令             | 用法                                                         | 描述                                                         | 示例 |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| **ZADD**         | ZADD key score1 member1 [score2 member2]                     | 向有序集合添加一个或多个成员，或者更新已存在成员的分数       |      |
| **ZCARD**        | ZCARD key                                                    | 返回有序集 key 的基数。                                      |      |
| **ZCOUNT**       | ZCOUNT key min max                                           | 返回有序集 key 中， score 值在 min 和 max 之间(默认包括 score 值等于 min 或 max )的成员的数量。关于参数 min 和 max 的详细使用方法，请参考 ZRANGEBYSCORE 命令。 |      |
| **ZRANGE**       | ZRANGE key start stop [WITHSCORES]                           | 返回有序集 key 中，指定区间内的成员。其中成员的位置按 score 值递增(从小到大)来排序 |      |
| **ZREVRANGE**    | ZREVRANGE key start stop [WITHSCORES]                        | 返回有序集 key 中，指定区间内的成员。其中成员的位置按 score 值递减(从大到小)来排列。具有相同 score 值的成员按字典序的逆序(reverse lexicographical order)排列。除了成员按 score 值递减的次序排列这一点外， ZREVRANGE 命令的其他方面和 ZRANGE 命令一样。 |      |
| ZREVRANGEBYSCORE | ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count] | 返回有序集 key 中， score 值介于 max 和 min 之间(默认包括等于 max 或 min )的所有的成员。有序集成员按 score 值递减(从大到小)的次序排列。 |      |
| ZREVRANK         | ZREVRANK key member                                          | 返回有序集 key 中成员 member 的排名。其中有序集成员按 score 值递减(从大到小)排序。排名以 0 为底，也就是说， score 值最大的成员排名为 0 。使用 ZRANK 命令可以获得成员按 score 值递增(从小到大)排列的排名。 |      |
| ZSCORE           | ZSCORE key member                                            | 返回有序集 key 中，成员 member 的 score 值。如果 member 元素不是有序集 key 的成员，或 key 不存在，返回 nil 。 |      |
| ZRANGEBYSCORE    | ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]  | 返回有序集 key 中，所有 score 值介于 min 和 max 之间(包括等于 min 或 max )的成员。有序集成员按 score 值递增(从小到大)次序排列。 |      |
| ZRANK            | ZRANK key member                                             | 返回有序集 key 中成员 member 的排名。其中有序集成员按 score 值递增(从小到大)顺序排列。 |      |
| **ZINCRBY**      | ZINCRBY key increment member                                 | 为有序集 key 的成员 member 的 score 值加上增量 increment     |      |
| ZREM             | ZREM key member [member ...]                                 | 移除有序集 key 中的一个或多个成员，不存在的成员将被忽略。当 key 存在但不是有序集类型时，返回一个错误。 |      |
| ZREMRANGEBYRANK  | ZREMRANGEBYRANK key start stop                               | 移除有序集 key 中，指定排名(rank)区间内的所有成员            |      |
| ZREMRANGEBYSCORE | ZREMRANGEBYSCORE key min max                                 | 移除有序集 key 中，所有 score 值介于 min 和 max 之间(包括等于 min 或 max )的成员。 |      |
| ZUNIONSTORE      | ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM\|MIN\|MAX] | 计算给定的一个或多个有序集的并集，其中给定 key 的数量必须以 numkeys 参数指定，并将该并集(结果集)储存到 destination 。默认情况下，结果集中某个成员的 score 值是所有给定集下该成员 score 值之 和 。 |      |
| ZINTERSTORE      | ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM\|MIN\|MAX] | 计算给定的一个或多个有序集的交集，其中给定 key 的数量必须以 numkeys 参数指定，并将该交集(结果集)储存到 destination 。默认情况下，结果集中某个成员的 score 值是所有给定集下该成员 score 值之和. |      |
| ZSCAN            | ZSCAN key cursor [MATCH pattern] [COUNT count]               | 迭代有序集合中的元素（包括元素成员和元素分值）               |      |
| ZRANGEBYLEX      | ZRANGEBYLEX key min max [LIMIT offset count]                 | 当有序集合的所有成员都具有相同的分值时，有序集合的元素会根据成员的字典序（lexicographical ordering）来进行排序，而这个命令则可以返回给定的有序集合键 key 中，值介于 min 和 max 之间的成员。 |      |
| ZLEXCOUNT        | ZLEXCOUNT key min max                                        | 对于一个所有成员的分值都相同的有序集合键 key 来说，这个命令会返回该集合中，成员介于 min 和 max 范围内的元素数量。这个命令的 min 参数和 max 参数的意义和 ZRANGEBYLEX 命令的 min 参数和 max 参数的意义一样 |      |
| ZREMRANGEBYLEX   | ZREMRANGEBYLEX key min max                                   | 对于一个所有成员的分值都相同的有序集合键 key 来说，这个命令会移除该集合中，成员介于 min 和 max 范围内的所有元素。这个命令的 min 参数和 max 参数的意义和 ZRANGEBYLEX 命令的 min 参数和 max 参数的意义一样 |      |







