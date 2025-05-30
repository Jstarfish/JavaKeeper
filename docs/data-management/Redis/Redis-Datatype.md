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

## 一、KV 如何存储？

为了实现从键到值的快速访问，Redis 使用了一个哈希表来保存所有键值对。一个哈希表，其实就是一个数组，数组的每个元素称为一个哈希桶。类似我们的 HashMap

看到这里，你可能会问了：“如果值是集合类型的话，作为数组元素的哈希桶怎么来保存呢？”

其实，**哈希桶中的元素保存的并不是值本身，而是指向具体值的指针**。这也就是说，不管值是 String，还是集合类型，哈希桶中的元素都是指向它们的指针。

在下图中，可以看到，哈希桶中的 entry 元素中保存了 `*key` 和  `*value` 指针，分别指向了实际的键和值，这样一来，即使值是一个集合，也可以通过 `*value` 指针被查找到。

![](https://img.starfish.ink/redis/redis-kv.png)

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

![](https://img.starfish.ink/redis/1*gsGJWchCH4V3BukF9xkHpA.jpeg)

但是，这里依然存在一个问题，哈希冲突链上的元素只能通过指针逐一查找再操作。如果哈希表里写入的数据越来越多，哈希冲突可能也会越来越多，这就会导致某些哈希冲突链过长，进而导致这个链上的元素查找耗时长，效率降低。对于追求“快”的 Redis 来说，这是不太能接受的。

所以，Redis 会对哈希表做 rehash 操作。rehash 也就是增加现有的哈希桶数量，让逐渐增多的 entry 元素能在更多的桶之间分散保存，减少单个桶中的元素数量，从而减少单个桶中的冲突。那具体怎么做呢？

![img](https://img.starfish.ink/redis/1*2alok5x1yuMJ3Z0V2RK--w.jpeg)

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

简单来说就是在第二步拷贝数据时，Redis 仍然正常处理客户端请求，每处理一个请求时，从哈希表 1 中的第一个索引位置开始，顺带着将这个索引位置上的所有 entries 拷贝到哈希表 2 中；等处理下一个请求时，再顺带拷贝哈希表 1 中的下一个索引位置的 entries。

渐进式 rehash 这样就巧妙地把一次性大量拷贝的开销，分摊到了多次处理请求的过程中，避免了耗时操作，保证了数据的快速访问。

好了，到这里，你应该就能理解，Redis 的键和值是怎么通过哈希表组织的了。对于 String 类型来说，找到哈希桶就能直接增删改查了，所以，哈希表的 $O(1)$ 操作复杂度也就是它的复杂度了。但是，对于集合类型来说，即使找到哈希桶了，还要在集合中再进一步操作。

所以集合的操作效率又与集合的底层数据结构有关，接下来我们再说 Redis 的底层数据结构~



## 一、Redis 的五种基本数据类型和其数据结构

![](https://img.starfish.ink/redis/redis-data-type.drawio.png)

由于 Redis 是基于标准 C 写的，只有最基础的数据类型，因此 Redis 为了满足对外使用的 5 种基本数据类型，开发了属于自己**独有的一套基础数据结构**。

**Redis** 有 5 种基础数据类型，它们分别是：**string(字符串)**、**list(列表)**、**hash(字典)**、**set(集合)** 和 **zset(有序集合)**。

Redis 底层的数据结构包括：**简单动态数组SDS、链表、字典、跳跃链表、整数集合、快速列表、压缩列表、对象。**

Redis 为了平衡空间和时间效率，针对 value 的具体类型在底层会采用不同的数据结构来实现，其中哈希表和压缩列表是复用比较多的数据结构，如下图展示了对外数据类型和底层数据结构之间的映射关系：

![](https://img.starfish.ink/redis/redis-data-types.png)

下面我们具体看下各种数据类型的底层实现和操作。

> 安装好 Redis，我们可以使用 `redis-cli` 来对 Redis 进行命令行的操作，当然 Redis 官方也提供了在线的调试器，你也可以在里面敲入命令进行操作：http://try.redis.io/#run



### 1、String（字符串）

String 类型是二进制安全的。意思是 Redis 的 String 可以包含任何数据。比如 jpg 图片或者序列化的对象 。

Redis 的字符串是动态字符串，是可以修改的字符串，**内部结构实现上类似于 Java 的 ArrayList**，采用预分配冗余空间的方式来减少内存的频繁分配，内部为当前字符串实际分配的空间 capacity 一般要高于实际字符串长度 len。当字符串长度小于 1M 时，扩容都是加倍现有的空间，如果超过 1M，扩容时一次只会多扩 1M 的空间。需要注意的是字符串最大长度为 512M。 

Redis 没有直接使用 C 语言传统的字符串表示（以空字符结尾的字符数组，以下简称 C 字符串）， 而是自己构建了一种名为简单动态字符串（simple dynamic string，SDS）的抽象类型， 并将 SDS 用作 Redis 的默认字符串表示。

根据传统， C 语言使用长度为 `N+1` 的字符数组来表示长度为 `N` 的字符串， 并且字符数组的最后一个元素总是空字符 `'\0'` 。

比如说， 下图就展示了一个值为 `"Redis"` 的 C 字符串：

![](https://img.starfish.ink/redis/c-string.png)

C 语言使用的这种简单的字符串表示方式， 并不能满足 Redis 对字符串在安全性、效率、以及功能方面的要求

[下面说明 SDS 比 C 字符串更适用于 Redis 的原因](http://redisbook.com/preview/sds/different_between_sds_and_c_string.html "SDS 与 C 字符串的区别")：

- **常数复杂度获取字符串长度**

  因为 C 字符串并不记录自身的长度信息， 所以为了获取一个 C 字符串的长度， 程序必须遍历整个字符串，对遇到的每个字符进行计数， 直到遇到代表字符串结尾的空字符为止， 这个操作的复杂度为 $O(N)$

  和 C 字符串不同， 因为 SDS 在 `len` 属性中记录了 SDS 本身的长度， 所以获取一个 SDS 长度的复杂度仅为 $O(1)$

  举个例子， 对于下图所示的 SDS 来说， 程序只要访问 SDS 的 `len` 属性， 就可以立即知道 SDS 的长度为 `5` 字节：

  ![](https://img.starfish.ink/redis/redis-sds.png)

  > **len**：当前字符串的长度（不包括末尾的 null 字符）。这使得 Redis 不需要在每次操作时都遍历整个字符串来获取其长度。
  >
  > **alloc**：当前为字符串分配的总空间（包括字符串数据和额外的内存空间）。由于 Redis 使用的是动态分配内存，因此可以避免频繁的内存分配和释放。
  >
  > **buf**：实际的字符串数据部分，存储字符串的字符数组。Redis 通过这个区域存储字符串的内容。
  >
  > ```c
  > struct sdshdr {
  >     int len;        // 当前字符串的长度
  >     int alloc;      // 为字符串分配的空间, 2.X 版本用一个 free 表示当前字符串缓冲区中未使用的内存量
  >     unsigned char buf[];  // 字符串数据
  > };
  > ```

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

- **SDS 如何保证二进制安全**：

  - **不依赖于 null 字符**：**二进制安全**意味着 SDS 字符串可以包含任何数据，包括 null 字节。传统的 C 字符串依赖于 null 字符（'\0'）来表示字符串的结束，但 Redis 的 SDS 不依赖于 null 字符来确定字符串的结束位置。
  - **动态扩展**：SDS 会根据需要动态地扩展其内部缓冲区。Redis 会使用 `alloc` 字段来记录已分配的内存大小。当你向 SDS 中追加数据时，Redis 会确保分配足够的内存，而不需要担心数据的终止符。
  - **不需要二次编码**：二进制数据直接存储在 SDS 的 `buf` 区域内，不需要进行任何编码或转换。因此，Redis 可以原样存储任意二进制数据。

  > C 语言中的字符串必须符合某种编码（比如 ASCII），并且除了字符串的末尾之外， 字符串里面不能包含空字符， 否则最先被程序读入的空字符将被误认为是字符串结尾 —— 这些限制使得 C 字符串只能保存文本数据， 而不能保存像图片、音频、视频、压缩文件这样的二进制数据

- **编码方式**：
  - **int**：当值可以用整数表示时，Redis 会使用整数编码。这样可以节省内存，并且在执行数值操作时更高效。
  - **embstr**：这是一种特殊的编码方式，用于存储短字符串。当字符串的长度小于或等于 44 字节时，Redis 会使用 embstr 编码。只读，修改后自动转为 raw。这种编码方式将字符串直接存储在 Redis 对象的内部，这样可以减少内存分配和内存拷贝的次数，提高性能。
  - **raw**：当字符串值不是整数时，Redis 会使用 raw 编码。raw 编码就是简单地将字符串存储为字节序列。Redis 会根据客户端发送的字节序列来存储字符串，因此可以存储任何类型的数据，包括二进制数据。

> 可以通过 `TYPE KEY_NAME` 查看 key 所存储的值的类型验证下。

### 2、List（列表）

**Redis 的列表相当于 Java 语言里面的 LinkedList，注意它是链表而不是数组。这意味着 list 的插入和删除操作非常快，时间复杂度为 O(1)，但是索引定位很慢，时间复杂度为 O(n)**

当列表弹出了最后一个元素之后，该数据结构自动被删除，内存被回收。

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

从 Redis 3.2 版本开始，列表的底层实现由压缩列表组成的快速列表（quicklist）所取代。

- 快速列表由多个 ziplist 节点组成，每个节点使用指针连接，形成一个链表。
- 这种方式结合了压缩列表的内存效率和小元素的快速访问，以及双向链表的灵活性。

>听到“压缩”两个字，直观的反应就是节省内存。之所以说这种存储结构节省内存，是相较于数组的存储思路而言的。
>
>它并不是基础数据结构，而是 Redis 自己设计的一种数据存储结构。它有点儿类似数组，通过一片连续的内存空间，来存储数据。不过，它跟数组不同的一点是，它允许存储的数据大小不同。听到“压缩”两个字，直观的反应就是节省内存。之所以说这种存储结构节省内存，是相较于数组的存储思路而言的。我们知道，数组要求每个元素的大小相同，如果我们要存储不同长度的字符串，那我们就需要用最大长度的字符串大小作为元素的大小（假设是 20 个字节）。那当我们存储小于 20 个字节长度的字符串的时候，便会浪费部分存储空间。压缩列表这种存储结构，一方面比较节省内存，另一方面可以支持不同类型数据的存储。而且，因为数据存储在一片连续的内存空间，通过键来获取值为列表类型的数据，读取的效率也非常高。当列表中存储的数据量比较大的时候，也就是不能同时满足刚刚讲的两个条件的时候，列表就要通过双向循环链表来实现了。

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

#### 1. **Redis Hash 的实现**

Redis 使用的是 **哈希表（Hash Table）** 来存储 `Hash` 类型的数据。每个 `Hash` 对象都由一个或多个字段（field）和相应的值（value）组成。

在 Redis 中，哈希表的数据结构是通过 **`dict`（字典）** 来实现的，`dict` 的结构包括键和值，其中每个键都是哈希表中的字段（field），而值是字段的值。

哈希表的基本实现如下：

- **哈希表**：采用 **开地址法** 来处理哈希冲突。每个 `Hash` 存储为一个哈希表，哈希表根据一定的哈希算法将键映射到一个位置。
- **动态扩展**：当哈希表存储的元素数量达到一定的阈值时，Redis 会自动进行 **rehash（重哈希）** 操作，重新分配内存并调整哈希表的大小。

Redis 字典由 **嵌套的三层结构** 构成，采用链地址法处理哈希冲突：

```c
// 哈希表结构
typedef struct dictht {
    dictEntry **table;       // 二维数组（哈希桶）
    unsigned long size;      // 总槽位数（2^n 对齐）
    unsigned long sizemask;  // 槽位掩码（size-1）
    unsigned long used;      // 已用槽位数量
} dictht;

// 字典结构
typedef struct dict {
    dictType *type;          // 类型特定函数（实现多态）
    void *privdata;          // 私有数据
    dictht ht[2];            // 双哈希表（用于渐进式rehash）
    long rehashidx;          // rehash进度标记（-1表示未进行）
} dict;

// 哈希节点结构
typedef struct dictEntry {
    void *key;               // 键（SDS字符串）
    union {
        void *val;           // 值（Redis对象）
        uint64_t u64;
        int64_t s64;
    } v;
    struct dictEntry *next;  // 链地址法指针
} dictEntry;
```

#### 2. **Redis Hash 的内部结构**

Redis 中的 `Hash` 是由 **哈希表** 和 **ziplist** 两种不同的数据结构实现的，具体使用哪一种结构取决于哈希表中键值对的数量和大小。

2.1 **哈希表（Hash Table）**

- 哈希表是 Redis 中实现字典（`dict`）的基础数据结构，使用 **哈希冲突解决方法**（例如链地址法或开地址法）来存储键值对。
- 每个哈希表由两个数组组成：**键数组（key array）** 和 **值数组（value array）**，它们通过哈希算法映射到表中的相应位置。

2.2 **Ziplist（压缩列表）**

- **ziplist** 是一种内存高效的列表数据结构，在 Redis 中用于存储小型的 `Hash`，当哈希表中的元素个数较少时，Redis 会使用 `ziplist` 来节省内存。
- Ziplist 是连续内存块，采用压缩存储。它适用于存储小量数据，避免哈希表内存开销。

2.3 **切换机制**

> - 字典中保存的键和值的大小都要小于 64 字节；
> - 字典中键值对的个数要小于 512 个。

当 Redis 中 `Hash` 的元素数量较小时，会使用 `ziplist`；当元素数量增多时，会切换到使用哈希表的方式。

- **小型 Hash**：当哈希表的字段数量很少时，Redis 会使用 `ziplist` 来存储 `Hash`，因为它可以节省内存。
- **大型 Hash**：当字段数量较多时，Redis 会将 `ziplist` 转换为 `哈希表` 来优化性能和内存管理。

#### 3. Rehash（重哈希）

**Rehash** 是 Redis 用来扩展哈希表的一种机制。随着 `Hash` 中元素数量的增加，哈希表的负载因子（load factor）会逐渐增大，最终可能会导致哈希冲突增多，降低查询效率。为了解决这个问题，Redis 会在哈希表负载因子达到一定阈值时，执行 **rehash** 操作，即扩展哈希表。

3.1 **Rehash 的过程**

- **扩展哈希表**：Redis 会将哈希表的大小翻倍，并将现有的数据重新映射到新的哈希表中。扩展哈希表的目的是减少哈希冲突，提高查找效率。

- **渐进式 rehash（Incremental Rehash）**：Redis 在执行重哈希时，并不会一次性将所有数据都重新映射到新的哈希表中，这样可以避免大量的阻塞操作。Redis 会分阶段地逐步迁移哈希表中的元素。这一过程通过增量的方式进行，逐步从旧哈希表中取出元素，放入新哈希表。

  这种增量迁移的方式保证了 **rehash** 操作不会一次性占用过多的 CPU 时间，避免了阻塞。

3.2 **Rehash 的触发条件**

Redis 会在以下情况下触发 rehash 操作：

- 当哈希表的元素数量超过哈希表容量的负载因子阈值时（例如，默认阈值为 1），Redis 会开始进行 rehash 操作。
- 当哈希表的空间变得非常紧张，Redis 会执行扩展操作。

扩容就会涉及到键值对的迁移。具体来说，迁移操作会在以下两种情况下进行：

1. **Lazy Rehashing（懒惰重哈希）：** Redis 采用了懒惰重哈希的策略，即在进行哈希表扩容时，并不会立即将所有键值对都重新散列到新的存储桶中。而是在有需要的时候，例如进行读取操作时，才会将相应的键值对从旧存储桶迁移到新存储桶中。这种方式避免了一次性大规模的迁移操作，减少了扩容期间的阻塞时间。
2. **Redis 事件循环（Event Loop）：** Redis 会在事件循环中定期执行一些任务，包括一些与哈希表相关的操作。在事件循环中，Redis会检查是否有需要进行迁移的键值对，并将它们从旧存储桶迁移到新存储桶中。这样可以保证在系统负载较轻的时候进行迁移，减少对服务性能的影响。



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

集合这种数据类型用来存储一组不重复的数据。这种数据类型也有两种实现方法，一种是基于整数集合，另一种是基于散列表。当要存储的数据，同时满足下面这样两个条件的时候，Redis 就采用整数集合（intset），来实现集合这种数据类型。

- 存储的数据都是整数；
- 存储的数据元素个数不超过 512 个。

当不能同时满足这两个条件的时候，Redis 就使用散列表来存储集合中的数据。

Redis 的 Set 是 String 类型的无序集合。它是通过 HashTable 实现的， 相当于 Java 语言里面的 HashSet，它内部的键值对是无序的唯一的。它的内部实现相当于一个特殊的字典，字典中所有的 value 都是一个值 `NULL`。 

当集合中最后一个元素移除之后，数据结构自动删除，内存被回收。

```c
// 定义整数集合结构
typedef struct intset {
    uint32_t encoding;  // 编码方式
    uint32_t length;    // 集合长度
    int8_t contents[];  // 元素数组
} intset;

// 定义哈希表节点结构
typedef struct dictEntry {
    void *key;              // 键
    union {
        void *val;          // 值
        uint64_t u64;
        int64_t s64;
        double d;
    } v;
    struct dictEntry *next; // 指向下一个节点的指针
} dictEntry;

// 定义哈希表结构
typedef struct dictht {
    dictEntry **table;      // 存储桶数组
    unsigned long size;     // 存储桶数量
    unsigned long sizemask; // 存储桶数量掩码
    unsigned long used;     // 已使用存储桶数量
} dictht;

// 定义集合结构
typedef struct {
    uint32_t encoding; // 编码方式
    dictht *ht;        // 哈希表
    intset *is;        // 整数集合
} set;
```



### 5、Zset(sorted set：有序集合)

zset 和 set 一样也是 String 类型元素的集合，且不允许重复的成员。不同的是每个元素都会关联一个 double 类型的分数。

Redis 正是通过分数来为集合中的成员进行从小到大的排序。zset 的成员是唯一的，但分数(score)却可以重复。

它类似于 Java 的 SortedSet 和 HashMap 的结合体，一方面它是一个 set，保证了内部 value 的唯一性，另一方面它可以给每个 value 赋予一个 score，代表这个 value 的排序权重。它的内部实现用的是一种叫做「**跳跃列表**」的数据结构。 

zset 中最后一个 value 被移除后，数据结构自动删除，内存被回收。

实际上，跟 Redis 的其他数据类型一样，有序集合也并不仅仅只有跳表这一种实现方式。当数据量比较小的时候，Redis 会用压缩列表来实现有序集合。具体点说就是，使用压缩列表来实现有序集合的前提，有这样两个：

- 所有数据的大小都要小于 64 字节；
- 元素个数要小于 128 个。



> **为什么 Redis 要用跳表来实现有序集合，而不是红黑树？**
>
> Redis 中的有序集合是通过跳表来实现的，严格点讲，其实还用到了散列表。不过散列表我们后面才会讲到，所以我们现在暂且忽略这部分。如果你去查看 Redis 的开发手册，就会发现，Redis 中的有序集合支持的核心操作主要有下面这几个：
>
> - 插入一个数据；
> - 删除一个数据；
> - 查找一个数据；
> - 按照区间查找数据（比如查找值在[100, 356]之间的数据）；
> - 迭代输出有序序列。
>
> 其中，插入、删除、查找以及迭代输出有序序列这几个操作，红黑树也可以完成，时间复杂度跟跳表是一样的。但是，按照区间来查找数据这个操作，红黑树的效率没有跳表高。对于按照区间查找数据这个操作，跳表可以做到 $O(logn)$ 的时间复杂度定位区间的起点，然后在原始链表中顺序往后遍历就可以了。这样做非常高效。当然，Redis 之所以用跳表来实现有序集合，还有其他原因，比如，跳表更容易代码实现。虽然跳表的实现也不简单，但比起红黑树来说还是好懂、好写多了，而简单就意味着可读性好，不容易出错。还有，跳表更加灵活，它可以通过改变索引构建策略，有效平衡执行效率和内存消耗。不过，跳表也不能完全替代红黑树。因为红黑树比跳表的出现要早一些，很多编程语言中的 Map 类型都是通过红黑树来实现的。我们做业务开发的时候，直接拿来用就可以了，不用费劲自己去实现一个红黑树，但是跳表并没有一个现成的实现，所以在开发中，如果你想使用跳表，必须要自己实现。



## 二、其他数据类型

### Bitmap

Redis 的 Bitmap 数据结构是一种基于 String 类型的位数组，它允许用户将字符串当作位向量来使用，并对这些位执行位操作。Bitmap 并不是 Redis 中的一个独立数据类型，而是通过在 String 类型上定义的一组位操作命令来实现的。由于 Redis 的 String 类型是二进制安全的，最大长度可以达到 512 MB，因此可以表示最多 $2^{32}$​ 个不同的位。

Bitmap 在 Redis 中的使用场景包括但不限于：

1. **集合表示**：当集合的成员对应于整数 0 到 N 时，Bitmap 可以高效地表示这种集合。
2. **对象权限**：每个位代表一个特定的权限，类似于文件系统存储权限的方式。
3. **签到系统**：记录用户在特定时间段内的签到状态。
4. **用户在线状态**：跟踪大量用户的在线或离线状态。

Bitmap 操作的基本命令包括：

- `SETBIT key offset value`：设置或清除 key 中 offset 位置的位值（只能是 0 或 1）。
- `GETBIT key offset`：获取 key 中 offset 位置的位值，如果 key 不存在，则返回 0。

Bitmap 还支持更复杂的位操作，如：

- `BITOP operation destkey key [key ...]`：对一个或多个 key 的 Bitmap 进行位操作（AND、OR、NOT、XOR）并将结果保存到 destkey。
- `BITCOUNT key [start] [end]`：计算 key 中位数为 1 的数量，可选地在指定的 start 和 end 范围内进行计数。

Bitmap 在存储空间方面非常高效，例如，表示一亿个用户的登录状态，每个用户用一个位来表示，总共只需要 12 MB 的内存空间。

在实际应用中，Bitmap 可以用于实现诸如亿级数据统计、用户行为跟踪等大规模数据集的高效管理。

总的来说，Redis 的 Bitmap 是一种非常节省空间且功能强大的数据结构，适用于需要对大量二进制数据进行操作的场景。

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



### HyperLogLog

Redis 在 2.8.9 版本添加了 HyperLogLog 结构。

Redis HyperLogLog 是一种用于基数统计的数据结构，它提供了一个近似的、不精确的解决方案来估算集合中唯一元素的数量，即集合的基数。HyperLogLog 特别适用于需要处理大量数据并且对精度要求不是特别高的场景，因为它使用非常少的内存（通常每个 HyperLogLog 实例只需要 12.4KB 左右，无论集合中有多少元素）。

HyperLogLog 的主要特点包括：

1. **近似统计**：HyperLogLog 不保证精确计算基数，但它提供了一个非常接近真实值的近似值。
2. **内存效率**：HyperLogLog 能够使用固定大小的内存来估算基数，这使得它在处理大规模数据集时非常有用。
3. **可合并性**：多个 HyperLogLog 实例可以合并，以估算多个集合的并集基数。

HyperLogLog 的主要命令包括：

- `PFADD key element [element ...]`：向 HyperLogLog 数据结构添加元素。如果 key 不存在，它将被创建。
- `PFCOUNT key`：返回给定 HyperLogLog 的近似基数。
- `PFMERGE destkey sourcekey [sourcekey ...]`：将多个 HyperLogLog 结构合并到一个单独的 HyperLogLog 结构中。

HyperLogLog 的工作原理基于一个数学算法，它使用一个固定大小的位数组和一些哈希函数。当添加一个新元素时，它被哈希函数映射到一个位数组的索引，并根据哈希值的前几位来设置位数组中的位。基数估算是通过分析位数组中 0 的位置来完成的。

由于 HyperLogLog 提供的是近似值，它有一个标准误差率，通常在 0.81% 左右。这意味着如果实际基数是 1000，HyperLogLog 估算的基数可能在 992 到 1008 之间。

HyperLogLog 是处理大数据集基数统计的理想选择，尤其是当数据集太大而无法在内存中完全加载时。它在数据挖掘、日志分析、用户行为分析等领域有着广泛的应用。

场景：可以用来统计站点的UV...

> [HyperLogLog图解](http://content.research.neustar.biz/blog/hll.html )





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







