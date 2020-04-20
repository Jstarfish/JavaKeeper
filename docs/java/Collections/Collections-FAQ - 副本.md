「我就是大厂面试官」—— Java 集合，你肯定会被问到这些

> 作为Java求职者，无数次被问到过集合的知识，同时作为一位"周角公司小菜一面面试官”，我也肯定会问面试者集合的知识，所以就有了这篇，源码较多，建议静下心来哈，一起学习，一起进步



面向对象语言对事物的体现都是以对象的形式，所以为了方便对多个对象的操作，需要将对象进行存储，集合就是存储对象最常用的一种方式，也叫容器。

![img](https://tva1.sinaimg.cn/large/00831rSTly1gdp03vldkkg30hv0gzwet.gif)



从上面的集合框架图可以看到，Java 集合框架主要包括两种类型的容器

- 一种是集合（Collection），存储一个元素集合
- 另一种是图（Map），存储键/值对映射。

Collection 接口又有 3 种子类型，List、Set 和 Queue，再下面是一些抽象类，最后是具体实现类，常用的有 ArrayList、LinkedList、HashSet、LinkedHashSet、HashMap、LinkedHashMap 等等。

集合框架是一个用来代表和操纵集合的统一架构。所有的集合框架都包含如下内容：

- **接口**：是代表集合的抽象数据类型。例如 Collection、List、Set、Map 等。之所以定义多个接口，是为了以不同的方式操作集合对象

- **实现（类）**：是集合接口的具体实现。从本质上讲，它们是可重复使用的数据结构，例如：ArrayList、LinkedList、HashSet、HashMap。

- **算法**：是实现集合接口的对象里的方法执行的一些有用的计算，例如：搜索和排序。这些算法被称为多态，那是因为相同的方法可以在相似的接口上有着不同的实现。

------



## 说说常用的集合有哪些吧？

Map 接口和 Collection 接口是所有集合框架的父接口：

1. Collection接口的子接口包括：Set、List、Queue
2. List是有序的不允许有重复元素的Collection，实现类主要有：ArrayList、LinkedList、Stack以及Vector等
3. Set是一种不包含重复元素且无序的Collection，实现类主要有：HashSet、TreeSet、LinkedHashSet等
4. Map没有继承Collection接口，Map提供key到value的映射。实现类主要有：HashMap、TreeMap、Hashtable、ConcurrentHashMap 以及 Properties 等



## ArrayList 和 Vector 的区别

相同点：
- ArrayList 和 Vector 都是继承了相同的父类和实现了相同的接口（都实现了List，有序、允许重复和null）
![](https://imgkr.cn-bj.ufileos.com/113446fd-3bef-4e21-bcf3-fe54ec0e97f9.png)
- 底层都是数组（Object[]）实现的
- 初始默认长度都为**10**

不同点：
- 同步性：Vector 中的 public 方法多数添加了 synchronized 关键字、以确保方法同步、也即是 Vector 线程安全、ArrayList 线程不安全
- 性能：Vector 存在 synchronized 的锁等待情况、需要等待释放锁这个过程、所以性能相对较差
- 扩容大小：ArrayList在底层数组不够用时在原来的基础上扩展 0.5 倍，Vector 默认是扩展 1 倍
  扩容机制，扩容方法其实就是新创建一个数组，然后将旧数组的元素都复制到新数组里面。其底层的扩容方法都在 **grow()** 中（基于JDK8）
  - ArrayList 的 grow()，在满足扩容条件时、ArrayList以**1.5** 倍的方式在扩容（oldCapacity >> **1** ，右移运算，相当于除以 2，结果为二分之一的 oldCapacity）
    ![](https://imgkr.cn-bj.ufileos.com/07666f8e-d467-4927-99fd-b1d7f743a98e.png)
  - Vector 的 grow()，Vector 比 ArrayList多一个属性 capacityIncrement，可以指定扩容大小。当扩容容量增量大于 **0** 时、新数组长度为 原数组长度**+**扩容容量增量、否则新数组长度为原数组长度的 **2** 倍
    ![](https://imgkr.cn-bj.ufileos.com/578bbe68-993f-4a53-9fb9-19eeff04ae3d.png)
    
    

## ArrayList 与 LinkedList 区别

- 是否保证线程安全： ArrayList 和 LinkedList 都是不同步的，也就是不保证线程安全；
- **底层数据结构**： Arraylist 底层使用的是 Object 数组；LinkedList 底层使用的是双向循环链表数据结构；
- **插入和删除是否受元素位置的影响：**
  -  **ArrayList 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。** 比如：执行 `add(E e)`方法的时候， ArrayList 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是O(1)。但是如果要在指定位置 i 插入和删除元素的话（ `add(intindex,E element)`）时间复杂度就为 O(n-i)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。
  -  **LinkedList 采用链表存储，所以插入，删除元素时间复杂度不受元素位置的影响，都是近似 $O(1)$，而数组为近似 $O(n)$。**
  -  ArrayList 一般应用于查询较多但插入以及删除较少情况，如果插入以及从删除较多则建议使用 LinkedList
- **是否支持快速随机访问**： LinkedList 不支持高效的随机元素访问，而 ArrayList 实现了 RandomAccess 接口，所以有随机访问功能。快速随机访问就是通过元素的序号快速获取元素对象(对应于 `get(intindex)`方法)。
- **内存空间占用**： ArrayList 的空间浪费主要体现在在 list 列表的结尾会预留一定的容量空间，而 LinkedList 的空间花费则体现在它的每一个元素都需要消耗比 ArrayList 更多的空间（因为要存放直接后继和直接前驱以及数据）。



高级工程师的我，可不得看看源码，具体分析下：

- ArrayList工作原理其实很简单，底层是动态数组，每次创建一个 ArrayList 实例时会分配一个初始容量（没有指定初始容量的话，默认是 10），以add方法为例，如果没有指定初始容量，当执行add方法，先判断当前数组是否为空，如果为空则给保存对象的数组分配一个最小容量，默认为10。当添加大容量元素时，会先增加数组的大小，以提高添加的效率；

- LinkedList 是有序并且支持元素重复的集合，底层是基于双向链表的，即每个节点既包含指向其后继的引用也包括指向其前驱的引用。链表无容量限制，但双向链表本身使用了更多空间，也需要额外的链表指针操作。按下标访问元素 `get(i)/set(i,e)` 要悲剧的遍历链表将指针移动到位(如果i>数组大小的一半，会从末尾移起)。插入、删除元素时修改前后节点的指针即可，但还是要遍历部分链表的指针才能移动到下标所指的位置，只有在链表两头的操作`add()`， `addFirst()`，`removeLast()`或用 `iterator()` 上的 `remove()` 能省掉指针的移动。此外 LinkedList 还实现了 Deque（继承自Queue接口）接口，可以当做队列使用。

ps：不会囊括所有方法，只是为了学习，记录思想。

ArrayList 和 LinkedList 两者都实现了 List 接口

![](https://imgkr.cn-bj.ufileos.com/907e3677-9237-4c57-a5ee-69bfd8bba64d.png)

![](https://imgkr.cn-bj.ufileos.com/1c7a4939-3a0d-42df-8e60-e96ca8415e5d.png)

### 构造器

ArrayList 提供了 3 个构造器，①无参构造器 ②带初始容量构造器 ③参数为集合构造器

![](https://imgkr.cn-bj.ufileos.com/cd13ffd9-b5d4-4628-984c-a32a61b4a7a6.png)

LinkedList 提供了 2 个构造器，因为基于链表，所以也就没有初始化大小，也没有扩容的机制，就是一直在前面或者后面插插插~~

![](https://imgkr.cn-bj.ufileos.com/52082360-9f49-43c4-972f-783ec55dd176.png)

### 插入

**ArrayList** 的 add() 方法

![](https://imgkr.cn-bj.ufileos.com/d0ade0ca-a2de-4336-b2ec-304bf02b41d1.png)

当然也可以插入指定位置，还有一个重载的方法 `add(int index, E element)` 

![](https://imgkr.cn-bj.ufileos.com/4492c25b-19c5-4207-ab38-9e95c50fa2ad.png)

可以看到每次插入指定位置都要移动元素，效率较低。

再来看 **LinkedList** 的插入，也有插入末尾，插入指定位置两种，由于基于链表，肯定得先有个 Node

![](https://imgkr.cn-bj.ufileos.com/7efc0819-801e-4be2-876d-39df2b57cd5b.png)

![](https://imgkr.cn-bj.ufileos.com/9a493ad0-76b5-4d03-94a1-dba297e678a7.png)

### 获取

**ArrayList** 的 get() 方法很简单，就是在数组中返回指定位置的元素即可，所以效率很高

![](https://imgkr.cn-bj.ufileos.com/18dd6bbd-517c-445f-954c-88588806b4d6.png)

**LinkedList** 的 get() 方法，就是在内部调用了上边看到的 node() 方法，判断在前半段还是在后半段，然后遍历得到即可。

![](https://imgkr.cn-bj.ufileos.com/2e17102a-5a9e-4563-aead-35d7b05b56b1.png)

------



## HashMap的底层实现

> 什么时候会使用HashMap？他有什么特点？
>
> 你知道HashMap的工作原理吗？
>
> 你知道 get 和 put 的原理吗？equals() 和 hashCode() 的都有什么作用？
>
> 你知道hash的实现吗？为什么要这样实现？
>
> 如果HashMap的大小超过了负载因子(load factor)定义的容量，怎么办？

HashMap 在 JDK 7 和 JDK8 中的实现方式略有不同。分开记录。

### JDK1.7 实现

深入 HahsMap 之前，先要了解的概念

1. initialCapacity：初始容量。指的是 HashMap 集合初始化的时候自身的容量。可以在构造方法中指定；如果不指定的话，总容量默认值是 16 。需要注意的是初始容量必须是 2 的幂次方。（**1.7中，已知HashMap中将要存放的 KV 个数的时候，设置一个合理的初始化容量可以有效的提高性能**）

   ```java
   static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
   ```

2. size：当前 HashMap 中已经存储着的键值对数量，即 `HashMap.size()` 。

3. loadFactor：加载因子。所谓的加载因子就是 HashMap (当前的容量/总容量) 到达一定值的时候，HashMap 会实施扩容。加载因子也可以通过构造方法中指定，默认的值是 0.75 。举个例子，假设有一个 HashMap 的初始容量为 16 ，那么扩容的阀值就是 0.75 * 16 = 12 。也就是说，在你打算存入第 13 个值的时候，HashMap 会先执行扩容。

4. threshold：扩容阀值。即 扩容阀值 = HashMap 总容量 * 加载因子。当前 HashMap 的容量大于或等于扩容阀值的时候就会去执行扩容。扩容的容量为当前 HashMap 总容量的两倍。比如，当前 HashMap 的总容量为 16 ，那么扩容之后为 32 。

5. table：Entry 数组。我们都知道 HashMap 内部存储 key/value 是通过 Entry 这个介质来实现的。而 table 就是 Entry 数组。

JDK1.7 中 HashMap 由 **数组+链表** 组成（**“链表散列”** 即数组和链表的结合体），数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的（HashMap 采用 **“拉链法也就是链地址法”** 解决冲突），如果定位到的数组位置不含链表（当前 entry 的 next 指向 null ）,那么对于查找，添加等操作很快，仅需一次寻址即可；如果定位到的数组包含链表，对于添加操作，其时间复杂度依然为 O(1)，因为最新的 Entry 会插入链表头部，即需要简单改变引用链即可，而对于查找操作来讲，此时就需要遍历链表，然后通过 key 对象的 equals 方法逐一比对查找。

> 所谓 **“拉链法”** 就是将链表和数组相结合。也就是说创建一个链表数组，数组中每一格就是一个链表。若遇到哈希冲突，则将冲突的值加到链表中即可。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx45a2fbbj31dz0oaacx.jpg)

#### 源码解析

##### 构造方法

《阿里巴巴 Java 开发手册》推荐集合初始化时，指定集合初始值大小。（说明：HashMap 使用HashMap(int initialCapacity) 初始化），原因： https://www.zhihu.com/question/314006228/answer/611170521

![](https://imgkr.cn-bj.ufileos.com/194188ef-4d4b-4c36-98c9-971810becd62.png)

HashMap 的前 3 个构造方法最后都会去调用 `HashMap(int initialCapacity, float loadFactor)` 。在其内部去设置初始容量和加载因子。而最后的 `init()` 是空方法，主要给子类实现，比如 LinkedHashMap。

##### put() 方法

![](https://imgkr.cn-bj.ufileos.com/bd8c8a5e-bb59-4260-9eb9-e6666a267df0.png)

最后的 createEntry() 方法就说明了当 hash 冲突时，采用的拉链法来解决 hash 冲突的，并且是把新元素是插入到单边表的表头。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx45xr0x5j31hl0u0ncd.jpg)

##### get() 方法

![](https://imgkr.cn-bj.ufileos.com/f8970a78-3c43-43a7-88b1-7494d330b937.png)

### JDK1.8 实现

JDK 1.7 中，如果哈希碰撞过多，拉链过长，极端情况下，所有值都落入了同一个桶内，这就退化成了一个链表。通过 key 值查找要遍历链表，效率较低。 JDK1.8在解决哈希冲突时有了较大的变化，**当链表长度大于阈值（默认为8）时，将链表转化为红黑树**，以减少搜索时间。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx468uknnj31650ogjth.jpg)

TreeMap、TreeSet以及 JDK1.8 之后的 HashMap 底层都用到了红黑树。红黑树就是为了解决二叉查找树的缺陷，因为二叉查找树在某些情况下会退化成一个线性结构。

#### 源码解析

##### 构造方法

JDK8 构造方法改动不是很大

![](https://imgkr.cn-bj.ufileos.com/dbc0c117-1e97-4cef-a353-939af0e85716.png)

##### 确定哈希桶数组索引位置（hash 函数的实现）

![](https://imgkr.cn-bj.ufileos.com/ab8e32d3-cfd2-4c4d-bcf9-0d964531d92e.png)

HashMap定位数组索引位置，直接决定了hash方法的离散性能。Hash算法本质上就是三步：**取key的hashCode值、高位运算、取模运算**。

![hash](https://tva1.sinaimg.cn/large/007S8ZIlly1gdwv5m4g4sj30ga09cdfy.jpg)

> 为什么要这样呢？
>
> HashMap 的长度为什么是2的幂次方?

目的当然是为了减少哈希碰撞，使 table 里的数据分布的更均匀。

1. HashMap 中桶数组的大小 length 总是2的幂，此时，`h & (table.length -1)` 等价于对 length 取模 `h%length`。但取模的计算效率没有位运算高，所以这是是一个优化。假设 `h = 185`，`table.length-1 = 15(0x1111)`，其实散列真正生效的只是低 4bit 的有效位，所以很容易碰撞。

   ![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx46gac50j30m8037mxf.jpg)

2. 图中的 hash 是由键的 hashCode 产生。计算余数时，由于 n 比较小，hash 只有低4位参与了计算，高位的计算可以认为是无效的。这样导致了计算结果只与低位信息有关，高位数据没发挥作用。为了处理这个缺陷，我们可以上图中的 hash 高4位数据与低4位数据进行异或运算，即 `hash ^ (hash >>> 4)`。通过这种方式，让高位数据与低位数据进行异或，以此加大低位信息的随机性，变相的让高位数据参与到计算中。此时的计算过程如下：

   ![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx46jwezjj30m804cjrw.jpg)

   在 Java 中，hashCode 方法产生的 hash 是 int 类型，32 位宽。前16位为高位，后16位为低位，所以要右移16位，即 `hash ^ (hash >>> 16)` 。这样还增加了hash 的复杂度，进而影响 hash 的分布性。

##### put() 方法

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx470vyzej311c0u0120.jpg)

![](https://imgkr.cn-bj.ufileos.com/3bf39985-3223-4a72-b7b6-9fa04f685bbe.png)

##### resize() 扩容

![](https://imgkr.cn-bj.ufileos.com/19bbc796-c30b-46cd-8226-02b56885b163.png)

##### get() 方法

![](https://imgkr.cn-bj.ufileos.com/3757d187-34a5-49ad-835d-d152b25da0cf.png)

------



## Hashtable

Hashtable 和 HashMap 都是散列表，也是用”拉链法“实现的哈希表。保存数据和 JDK7 中的 HashMap 一样，是 Entity 对象，只是 Hashtable 中的几乎所有的 public 方法都是 synchronized 的，而有些方法也是在内部通过 synchronized 代码块来实现，效率肯定会降低。且 put() 方法不允许空值。

使用次数太少，不深究。



### HashMap 和 Hashtable 的区别

1. **线程是否安全：** HashMap 是非线程安全的，HashTable 是线程安全的；HashTable 内部的方法基本都经过 `synchronized` 修饰。（如果你要保证线程安全的话就使用 ConcurrentHashMap 吧！）；

2. **效率：** 因为线程安全的问题，HashMap 要比 HashTable 效率高一点。另外，HashTable 基本被淘汰，不要在代码中使用它；

3. **对Null key 和Null value的支持：** HashMap 中，null 可以作为键，这样的键只有一个，可以有一个或多个键所对应的值为 null。。但是在 HashTable 中 put 进的键值只要有一个 null，直接抛出 NullPointerException。

4. **初始容量大小和每次扩充容量大小的不同 ：** 

   - 创建时如果不指定容量初始值，Hashtable 默认的初始大小为11，之后每次扩充，容量变为原来的2n+1。HashMap 默认的初始化大小为16。之后每次扩充，容量变为原来的2倍。
-  创建时如果给定了容量初始值，那么 Hashtable 会直接使用你给定的大小，而 HashMap 会将其扩充为2的幂次方大小。也就是说 HashMap 总是使用2的幂次方作为哈希表的大小,后面会介绍到为什么是2的幂次方。
   
5. **底层数据结构：** JDK1.8 以后的 HashMap 在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时，将链表转化为红黑树，以减少搜索时间。Hashtable 没有这样的机制。

6. HashMap的迭代器（`Iterator`）是fail-fast迭代器，但是 Hashtable的迭代器（`enumerator`）不是 fail-fast的。如果有其它线程对HashMap进行的添加/删除元素，将会抛出`ConcurrentModificationException`，但迭代器本身的`remove`方法移除元素则不会抛出异常。这条同样也是 Enumeration 和 Iterator 的区别。



## ConcurrentHashMap

HashMap在多线程情况下，在put的时候，插入的元素超过了容量（由负载因子决定）的范围就会触发扩容操作，就是rehash，这个会重新将原数组的内容重新hash到新的扩容数组中，在多线程的环境下，存在同时其他的元素也在进行put操作，如果hash值相同，可能出现同时在同一数组下用链表表示，造成闭环，导致在get时会出现死循环，所以HashMap是线程不安全的。

Hashtable，是线程安全的，它在所有涉及到多线程操作的都加上了synchronized关键字来锁住整个table，这就意味着所有的线程都在竞争一把锁，在多线程的环境下，它是安全的，但是无疑是效率低下的。

### JDK1.7 实现

Hashtable 容器在竞争激烈的并发环境下表现出效率低下的原因，是因为所有访问 Hashtable 的线程都必须竞争同一把锁，那假如容器里有多把锁，每一把锁用于锁容器其中一部分数据，那么当多线程访问容器里不同数据段的数据时，线程间就不会存在锁竞争，，这就是ConcurrentHashMap所使用的锁分段技术。

在 JDK1.7版本中，ConcurrentHashMap 的数据结构是由一个 Segment 数组和多个 HashEntry 组成。Segment 数组的意义就是将一个大的 table 分割成多个小的 table 来进行加锁。每一个 Segment 元素存储的是 HashEntry数组+链表，这个和 HashMap 的数据存储结构一样。

![img](https://yfzhou.oss-cn-beijing.aliyuncs.com/blog/img/JDK1.7%20ConcurrentHashMap.jpg)

ConcurrentHashMap 类中包含两个静态内部类 HashEntry 和 Segment。
HashEntry 用来封装映射表的键值对，Segment 用来充当锁的角色，每个 Segment 对象守护整个散列映射表的若干个桶。每个桶是由若干个 HashEntry 对象链接起来的链表。一个 ConcurrentHashMap 实例中包含由若干个 Segment 对象组成的数组。每个 Segment 守护着一个 HashEntry 数组里的元素，当对 HashEntry 数组的数据进行修改时，必须首先获得它对应的 Segment 锁。

#### Segment 类

Segment 类继承于 ReentrantLock 类，从而使得 Segment 对象能充当可重入锁的角色。一个 Segment 就是一个子哈希表，Segment 里维护了一个 HashEntry 数组，并发环境下，对于不同 Segment 的数据进行操作是不用考虑锁竞争的。

从源码可以看到，Segment 内部类和我们上边看到的 HashMap 很相似。也有负载因子，阈值等各种属性。

![](https://imgkr.cn-bj.ufileos.com/723a47a2-8167-42c2-b653-00886b143d96.png)

#### HashEntry 类

HashEntry 是目前我们最小的逻辑处理单元。一个ConcurrentHashMap 维护一个 Segment 数组，一个Segment维护一个 HashEntry 数组。

![](https://imgkr.cn-bj.ufileos.com/18efdea8-b6bd-4dbc-8b1c-c36d1ed951d5.png)

#### ConcurrentHashMap 类

默认的情况下，每个ConcurrentHashMap 类会创建16个并发的 segment，每个 segment 里面包含多个 Hash表，每个 Hash 链都是由 HashEntry 节点组成的。

![](https://imgkr.cn-bj.ufileos.com/0ed25ed2-23ea-413c-918a-4a46bcbeb6c4.png)

#### put() 方法

1. **定位segment并确保定位的Segment已初始化 **
2. **调用 Segment的 put 方法。**

![](https://imgkr.cn-bj.ufileos.com/b77ba4ca-3adf-4eb6-8d12-ffdec6abba0a.png)

#### get() 方法

**get方法无需加锁，由于其中涉及到的共享变量都使用volatile修饰，volatile可以保证内存可见性，所以不会读取到过期数据**

![](https://imgkr.cn-bj.ufileos.com/1b536342-8558-44c4-b9db-9fcc10bd6c6f.png)

### JDK1.8  实现

![img](https://yfzhou.oss-cn-beijing.aliyuncs.com/blog/img/JDK1.8%20ConcurrentHashMap.jpg)

ConcurrentHashMap 在 JDK8 中进行了巨大改动，光是代码量就从1000多行增加到6000行！1.8摒弃了`Segment`(锁段)的概念，采用了 `CAS + synchronized` 来保证并发的安全性。

可以看到，和HashMap 1.8的数据结构很像。底层数据结构改变为采用数组+链表+红黑树的数据形式。

#### 和 HashMap1.8 相同的一些地方

- 底层数据结构一致
- HashMap初始化是在第一次put元素的时候进行的，而不是init
- HashMap的底层数组长度总是为2的整次幂
- 默认树化的阈值为 8，而链表化的阈值为 6
- hash算法也很类似，但多了一步`& HASH_BITS`，该步是为了消除最高位上的负符号，hash的负在ConcurrentHashMap中有特殊意义表示在**扩容或者是树节点**

![](https://imgkr.cn-bj.ufileos.com/10ef9d35-a547-41eb-ba4e-d35d27316d2f.png)

#### 一些关键属性

![](https://imgkr.cn-bj.ufileos.com/f0d2520d-2614-42af-8329-90a9bf51ef7c.png)

#### put() 方法

1. 首先会判断 key、value是否为空，如果为空就抛异常！
2. `spread()`方法获取hash，减小hash冲突
3. 判断是否初始化table数组，没有的话调用`initTable()`方法进行初始化
4. 判断是否能直接将新值插入到table数组中
5. 判断当前是否在扩容，`MOVED`为-1说明当前ConcurrentHashMap正在进行扩容操作，正在扩容的话就进行协助扩容
6. 当table[i]为链表的头结点，在链表中插入新值，通过synchronized (f)的方式进行加锁以实现线程安全性。
   1. 在链表中如果找到了与待插入的键值对的key相同的节点，就直接覆盖
   2. 如果没有找到的话，就直接将待插入的键值对追加到链表的末尾
7. 当table[i]为红黑树的根节点，在红黑树中插入新值/覆盖旧值
8. 根据当前节点个数进行调整，否需要转换成红黑树(个数大于等于8，就会调用`treeifyBin`方法将tabel[i]`第i个散列桶`拉链转换成红黑树)
9. 对当前容量大小进行检查，如果超过了临界值（实际大小*加载因子）就进行扩容

![](https://imgkr.cn-bj.ufileos.com/b8f0482a-5387-4932-b7a0-74c4ff50bc28.png)

我们可以发现 JDK8 中的实现也是**锁分离**的思想，只是锁住的是一个 Node，而不是 JDK7 中的 Segment，而锁住Node 之前的操作是无锁的并且也是线程安全的，建立在原子操作上。

#### get() 方法

get 方法无需加锁，由于其中涉及到的共享变量都使用 volatile 修饰，volatile 可以保证内存可见性，所以不会读取到过期数据

![](https://imgkr.cn-bj.ufileos.com/472a1867-435e-4252-8d57-f4434a6b3a1d.png)



### Hashtable 和 ConcurrentHashMap 的区别

ConcurrentHashMap 和 Hashtable 的区别主要体现在实现线程安全的方式上不同。

- **底层数据结构：** JDK1.7的 ConcurrentHashMap 底层采用 **分段的数组+链表** 实现，JDK1.8 采用的数据结构和HashMap1.8的结构类似，**数组+链表/红黑二叉树**。Hashtable 和 JDK1.8 之前的 HashMap 的底层数据结构类似都是采用 **数组+链表** 的形式，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的；
- **实现线程安全的方式（重要）：** 
  - **在JDK1.7的时候，ConcurrentHashMap（分段锁）** 对整个桶数组进行了分割分段(Segment)，每一把锁只锁容器其中一部分数据，多线程访问容器里不同数据段的数据，就不会存在锁竞争，提高并发访问率。（默认分配16个Segment，比Hashtable效率提高16倍。） **到了 JDK1.8 的时候已经摒弃了Segment的概念，而是直接用 Node 数组+链表/红黑树的数据结构来实现，并发控制使用 synchronized 和 CAS 来操作。（JDK1.6以后 对 synchronized锁做了很多优化）** 整个看起来就像是优化过且线程安全的 HashMap，虽然在 JDK1.8 中还能看到 Segment 的数据结构，但是已经简化了属性，只是为了兼容旧版本；
  - Hashtable(同一把锁) :使用 synchronized 来保证线程安全，效率非常低下。当一个线程访问同步方法时，其他线程也访问同步方法，可能会进入阻塞或轮询状态，如使用 put 添加元素，另一个线程不能使用 put 添加元素，也不能使用 get，竞争越激烈效率越低。



> list 可以删除吗，遍历的时候可以删除吗，为什么

## Java快速失败（fail-fast）和安全失败（fail-safe）区别

### 快速失败（fail—fast）

在用迭代器遍历一个集合对象时，如果遍历过程中对集合对象的内容进行了修改（增加、删除、修改），则会抛出ConcurrentModificationException。

原理：迭代器在遍历时直接访问集合中的内容，并且在遍历过程中使用一个 modCount 变量。集合在被遍历期间如果内容发生变化，就会改变 modCount 的值。每当迭代器使用 hashNext()/next() 遍历下一个元素之前，都会检测 modCount 变量是否为 expectedmodCount 值，是的话就返回遍历；否则抛出异常，终止遍历。

注意：这里异常的抛出条件是检测到 modCount！=expectedmodCount 这个条件。如果集合发生变化时修改modCount 值刚好又设置为了 expectedmodCount 值，则异常不会抛出。因此，不能依赖于这个异常是否抛出而进行并发操作的编程，这个异常只建议用于检测并发修改的bug。

场景：java.util包下的集合类都是快速失败的，不能在多线程下发生并发修改（迭代过程中被修改）。

### 安全失败（fail—safe）

采用安全失败机制的集合容器，在遍历时不是直接在集合内容上访问的，而是先复制原有集合内容，在拷贝的集合上进行遍历。

原理：由于迭代时是对原集合的拷贝进行遍历，所以在遍历过程中对原集合所作的修改并不能被迭代器检测到，所以不会触发 Concurrent Modification Exception。

缺点：基于拷贝内容的优点是避免了Concurrent Modification Exception，但同样地，迭代器并不能访问到修改后的内容，即：迭代器遍历的是开始遍历那一刻拿到的集合拷贝，在遍历期间原集合发生的修改迭代器是不知道的。

场景：java.util.concurrent包下的容器都是安全失败，可以在多线程下并发使用，并发修改。

快速失败和安全失败是对迭代器而言的。 快速失败：当在迭代一个集合的时候，如果有另外一个线程在修改这个集合，就会抛出ConcurrentModification异常，java.util下都是快速失败。 安全失败：在迭代时候会在集合二层做一个拷贝，所以在修改集合上层元素不会影响下层。在java.util.concurrent下都是安全失败



### 如何避免**fail-fast** ？

- 在单线程的遍历过程中，如果要进行remove操作，可以调用迭代器 ListIterator 的 remove 方法而不是集合类的 remove方法。看看 ArrayList中迭代器的 remove方法的源码，该方法不能指定元素删除，只能remove当前遍历元素。

  ![](https://imgkr.cn-bj.ufileos.com/0b66c39d-9550-4c34-b4cd-0b500e08ccfc.png)

- 使用并发包(`java.util.concurrent`)中的类来代替 ArrayList 和 hashMap
  - CopyOnWriterArrayList 代替 ArrayList
  - ConcurrentHashMap 代替 HashMap



## Iterator 和 Enumeration 区别

在Java集合中，我们通常都通过 “Iterator(迭代器)” 或 “Enumeration(枚举类)” 去遍历集合。

![](https://imgkr.cn-bj.ufileos.com/f954a78a-61d8-4a64-b98e-de4cced44a71.png)

![](https://imgkr.cn-bj.ufileos.com/fef1c6a9-86f3-45a4-b7b6-f98a24a68633.png)

- **函数接口不同**，Enumeration**只有2个函数接口。**通过Enumeration，我们只能读取集合的数据，而不能对数据进行修改。Iterator**只有3个函数接口。**Iterator除了能读取集合的数据之外，也能数据进行删除操作。
- **Iterator支持 fail-fast机制，而Enumeration不支持**。Enumeration 是JDK 1.0添加的接口。使用到它的函数包括Vector、Hashtable等类，这些类都是JDK 1.0中加入的，Enumeration存在的目的就是为它们提供遍历接口。Enumeration本身并没有支持同步，而在Vector、Hashtable实现Enumeration时，添加了同步。
  而Iterator 是JDK 1.2才添加的接口，它也是为了HashMap、ArrayList等集合提供遍历接口。Iterator是支持fail-fast机制的：当多个线程对同一个集合的内容进行操作时，就可能会产生fail-fast事件



## Comparable 和 Comparator接口有何区别？

Java中对集合对象或者数组对象排序，有两种实现方式：
- 对象实现Comparable 接口
  - Comparable 在 java.lang 包下，是一个接口，内部只有一个方法 compareTo()
    ![](https://imgkr.cn-bj.ufileos.com/ed09ae86-4a84-41f7-88f4-9338d4584eaf.png)
  - Comparable 可以让实现它的类的对象进行比较，具体的比较规则是按照 compareTo 方法中的规则进行。这种顺序称为 **自然顺序**。
  - 实现了 Comparable 接口的 List 或则数组可以使用 `Collections.sort()` 或者 `Arrays.sort()` 方法进行排序
- 定义比较器，实现 Comparator接口
  - Comparator 在 java.util 包下，也是一个接口，JDK 1.8 以前只有两个方法：
    ![](https://imgkr.cn-bj.ufileos.com/446e640b-8f28-4de8-8f84-ae479fd77dc8.png)
**comparable相当于内部比较器。comparator相当于外部比较器**

区别：
- Comparator 位于 `java.util` 包下，而 Comparable 位于 `java.lang` 包下
- Comparable 接口的实现是在类的内部（如 String、Integer已经实现了 Comparable 接口，自己就可以完成比较大小操作），Comparator 接口的实现是在类的外部（可以理解为一个是自已完成比较，一个是外部程序实现比较）
- 实现 Comparable 接口要重写 compareTo 方法, 在 compareTo 方法里面实现比较。一个已经实现Comparable 的类的对象或数据，可以通过 **Collections.sort(list) 或者 Arrays.sort(arr)**实现排序。通过 **Collections.sort(list,Collections.reverseOrder())** 对list进行倒序排列。

  ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzefrcjolj30ui0u0dm0.jpg)

- 实现Comparator需要重写 compare 方法

  ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzefws30uj311s0t643v.jpg)



## HashSet

HashSet是用来存储没有重复元素的集合类，并且它是无序的。HashSet 内部实现是基于 HashMap ，实现了 Set 接口。

从 HahSet 提供的构造器可以看出，除了最后一个 HashSet 的构造方法外，其他所有内部就是去创建一个 Hashap 。没有其他的操作。而最后一个构造方法不是 public 的，所以不对外公开。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzeqxhvj3j311s0ka787.jpg)



### HashSet如何检查重复

HashSet的底层其实就是HashMap，只不过我们**HashSet是实现了Set接口并且把数据作为K值，而V值一直使用一个相同的虚值来保存**，HashMap的K值本身就不允许重复，并且在HashMap中如果K/V相同时，会用新的V覆盖掉旧的V，然后返回旧的V。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzeyvg5h0j311s0jen0n.jpg)



### Iterater 和 ListIterator 之间有什么区别？

- 我们可以使用Iterator来遍历Set和List集合，而ListIterator只能遍历List
- ListIterator有add方法，可以向List中添加对象，而Iterator不能
- ListIterator和Iterator都有hasNext()和next()方法，可以实现顺序向后遍历，但是ListIterator有hasPrevious()和previous()方法，可以实现逆向（顺序向前）遍历。Iterator不可以
- ListIterator可以定位当前索引的位置，nextIndex()和previousIndex()可以实现。Iterator没有此功能
- 都可实现删除操作，但是 ListIterator可以实现对象的修改，set()方法可以实现。Iterator仅能遍历，不能修改





## 参考与感谢

所有内容都是基于源码阅读和各种大佬之前总结的知识整理而来，输入并输出，奥利给。

- https://www.javatpoint.com/java-arraylist
- https://www.runoob.com/java/java-collections.html
- https://www.javazhiyin.com/21717.html
- https://yuqirong.me/2018/01/31/LinkedList内部原理解析/
- https://youzhixueyuan.com/the-underlying-structure-and-principle-of-hashmap.html
- 《HashMap源码详细分析》http://www.tianxiaobo.com/2018/01/18/HashMap-源码详细分析-JDK1-8
- 《ConcurrentHashMap1.7源码分析》https://www.cnblogs.com/chengxiao/p/6842045.html
- http://www.justdojava.com/2019/12/18/java-collection-15.1/

