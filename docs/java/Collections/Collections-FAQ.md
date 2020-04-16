> Java 面试，集合类问题是肯定会问到的

> 说说常见的集合有哪些吧？
>
> HashMap说一下，其中的Key需要重写hashCode()和equals()吗？
>
> HashMap中key和value可以为null吗？允许几个为null呀？
>
> HashMap线程安全吗?ConcurrentHashMap和hashTable有什么区别？ 
>
> List和Set说一下，现在有一个ArrayList，对其中的所有元素按照某一属性大小排序，应该怎么做？
>
> ArrayList 和 Vector 的区别



前言瞎扯：经常看到网上各种帖子，各种大厂面试题集锦，自己都进不了大厂，成天标题党，搞得我找资源老费劲了，都是一两句话，最后都论为为了面试而去背题了，当面试高级点岗位的时候，一到被深入的问某个问题，就懵逼了。所以在我准备面试的时候，还得一个问题一个问题的准备，坑。



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



集合分为两大块：`java.util` 包下的非线程安全集合和 `java.util.concurrent` 下的线程安全集合。

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

  ```java
  extends AbstractList<E>
          implements List<E>, RandomAccess, Cloneable, java.io.Serializable
  ```

- 底层都是数组（Object[]）实现的

- 初始默认长度都为**10**

不同点：

- 同步性：Vector 中的 public 方法多数添加了 synchronized 关键字、以确保方法同步、也即是 Vector 线程安全、ArrayList 线程不安全

- 性能：Vector 存在 synchronized 的锁等待情况、需要等待释放锁这个过程、所以性能相对较差

- 扩容大小：ArrayList在底层数组不够用时在原来的基础上扩展 0.5 倍，Vector默认是扩展 1 倍

  扩容机制，扩容方法其实就是新创建一个数组，然后将旧数组的元素都复制到新数组里面。其底层的扩容方法都在 **grow()** 中（基于JDK8）

  - ArrayList 的 grow()，在满足扩容条件时、ArrayList以**1.5** 倍的方式在扩容（oldCapacity >> **1** ，右移运算，相当于除以 2，结果为二分之一的 oldCapacity）

    ```java
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        //newCapacity = oldCapacity + O.5*oldCapacity,此处扩容0.5倍
        int newCapacity = oldCapacity + (oldCapacity >> 1); 
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
    ```

  - Vector 的 grow()，Vector 比 ArrayList多一个属性，扩展因子capacityIncrement，可以扩容大小。当扩容容量增量大于**0**时、新数组长度为原数组长度**+**扩容容量增量、否则新数组长度为原数组长度的**2**倍

    ```java
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        //
        int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                         capacityIncrement : oldCapacity);
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
    ```

    



## Arraylist 与 LinkedList 区别

- 是否保证线程安全： ArrayList 和 LinkedList 都是不同步的，也就是不保证线程安全；
- **底层数据结构**： Arraylist 底层使用的是 Object 数组；LinkedList 底层使用的是双向循环链表数据结构；
- **插入和删除是否受元素位置的影响：**
  -  **ArrayList 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。** 比如：执行 `add(E e)`方法的时候， ArrayList 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是O(1)。但是如果要在指定位置 i 插入和删除元素的话（ `add(intindex,E element)`）时间复杂度就为 O(n-i)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。
  -  **LinkedList 采用链表存储，所以插入，删除元素时间复杂度不受元素位置的影响，都是近似 $O(1)$，而数组为近似 $O(n)$。**
- **是否支持快速随机访问**： LinkedList 不支持高效的随机元素访问，而 ArrayList 实现了 RandomAccess 接口，所以有随机访问功能。快速随机访问就是通过元素的序号快速获取元素对象(对应于 `get(intindex)`方法)。
- **内存空间占用**： ArrayList 的空间浪费主要体现在在 list 列表的结尾会预留一定的容量空间，而 LinkedList 的空间花费则体现在它的每一个元素都需要消耗比 ArrayList 更多的空间（因为要存放直接后继和直接前驱以及数据）。



高级工程师的我，可不得看看源码，具体分析下：

ArrayList 和 LinkedList 两者都实现了 List 接口

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable{
```

```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable
```



ArrayList 提供了 3 个构造器，①无参构造器 ②带初始容量构造器 ③参数为集合构造器

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable{
   
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            // 创建初始容量的数组
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                                               initialCapacity);
        }
}

    public ArrayList() {
        // 默认为空数组
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
    
    public ArrayList(Collection<? extends E> c) { //...}       
}
```

LinkedList 提供了 2 个构造器，因为基于链表，所以也就没有初始化大小，也没有扩容的机制，就是一直在前面或者后面插插插~~

```java
public LinkedList() {
}

public LinkedList(Collection<? extends E> c) {
    this();
    addAll(c);
}
// 
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;

    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
```

### 插入

**ArrayList**:

```java
public boolean add(E e) {
    // 确保数组的容量，保证可以添加该元素
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 将该元素放入数组中
    elementData[size++] = e;
    return true;
}
private void ensureCapacityInternal(int minCapacity) {
    // 如果数组是空的，那么会初始化该数组
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        // DEFAULT_CAPACITY 为 10,所以调用无参默认 ArrayList 构造方法初始化的话，默认的数组容量为 10
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
    }

    ensureExplicitCapacity(minCapacity);
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // 确保数组的容量，如果不够的话，调用 grow 方法扩容
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
//扩容具体的方法
private void grow(int minCapacity) {
    // 当前数组的容量
    int oldCapacity = elementData.length;
    // 新数组扩容为原来容量的 1.5 倍
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    // 如果新数组扩容容量还是比最少需要的容量还要小的话，就设置扩充容量为最小需要的容量
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    //判断新数组容量是否已经超出最大数组范围，MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    // 复制元素到新的数组中
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

当然也可以插入指定位置，还有一个重载的方法 `add(int index, E element)` 

```java
public void add(int index, E element) {
    // 判断 index 有没有超出索引的范围
    rangeCheckForAdd(index);
    // 和之前的操作是一样的，都是保证数组的容量足够
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 将指定位置及其后面数据向后移动一位
    System.arraycopy(elementData, index, elementData, index + 1,
                     size - index);
    // 将该元素添加到指定的数组位置
    elementData[index] = element;
    // ArrayList 的大小改变
    size++;
}
```

可以看到每次插入指定位置都要移动元素，效率较低。

再来看 **LinkedList** 的插入，也有插入末尾，插入指定位置两种，由于基于链表，肯定得先有个 Node

```java
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;

    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
```

```java
public boolean add(E e) {
    // 直接往队尾加元素
    linkLast(e);
    return true;
}

void linkLast(E e) {
    // 保存原来链表尾部节点，last 是全局变量，用来表示队尾元素
    final Node<E> l = last;
    // 为该元素 e 新建一个节点
    final Node<E> newNode = new Node<>(l, e, null);
    // 将新节点设为队尾
    last = newNode;
    // 如果原来的队尾元素为空，那么说明原来的整个列表是空的，就把新节点赋值给头结点
    if (l == null)
        first = newNode;
    else
    // 原来尾结点的后面为新生成的结点
        l.next = newNode;
    // 节点数 +1
    size++;
    modCount++;
}

public void add(int index, E element) {
    // 检查 index 有没有超出索引范围
    checkPositionIndex(index);
    // 如果追加到尾部，那么就跟 add(E e) 一样了
    if (index == size)
        linkLast(element);
    else
    // 否则就是插在其他位置
     linkBefore(element, node(index));
}

//linkBefore方法中调用了这个node方法，类似二分查找的优化
Node<E> node(int index) {
    // assert isElementIndex(index);
    // 如果 index 在前半段，从前往后遍历获取 node
    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        // 如果 index 在后半段，从后往前遍历获取 node
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}

void linkBefore(E e, Node<E> succ) {
    // assert succ != null;
    // 保存 index 节点的前节点
    final Node<E> pred = succ.prev;
    // 新建一个目标节点
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    // 如果是在开头处插入的话
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

### 获取

ArrayList 也叫数组列表，底层使用的数组实现的，严格来说是动态数组。

ArrayList工作原理其实很简单，底层是动态数组，每次创建一个 ArrayList 实例时会分配一个初始容量（没有指定初始容量的话，默认是 10），以add方法为例，如果没有指定初始容量，当执行add方法，先判断当前数组是否为空，如果为空则给保存对象的数组分配一个最小容量，默认为10。当添加大容量元素时，会先增加数组的大小，以提高添加的效率

1. ArrayList底层是基于数组来实现的，因此在 get 的时候效率高，而 add 或者 remove 的时候，效率低。get方法的时间复杂度为O(1)，add和remove操作的时间复杂度为O(n)；
2. 调用默认的 ArrayList 无参构造方法的话，数组的初始容量为 10 ；
3. ArrayList 会自动扩容，扩容的时候，会将容量扩至原来的 1.5 倍；
4. ArrayList 不是线程安全的
5. ArrayList一般应用于查询较多但插入以及删除较少情况，如果插入以及从删除较多则建议使用LinkedList

LinkedList 是有序并且支持元素重复的集合，底层是基于双向链表的，即每个节点既包含指向其后继的引用也包括指向其前驱的引用，LinkedList 实现了 List 接口，继承了 AbstractSequentialList 类，在频繁进行插入以及删除的情况下效率较高。此外 LinkedList 还实现了 Deque（继承自Queue接口）接口，可以当做队列使用。

也正因为是链表，所以也就没有动态扩容的步骤


 

#### 补充：数据结构基础之双向链表

双向链表也叫双链表，是链表的一种，它的每个数据结点中都有两个指针，分别指向直接后继和直接前驱。所以，从双向链表中的任意一个结点开始，都可以很方便地访问它的前驱结点和后继结点。一般我们都构造双向循环链表，如下图所示，同时下图也是LinkedList 底层使用的是双向循环链表数据结构。

![这几道Java集合框架面试题在面试中几乎必问](https://tva1.sinaimg.cn/large/007S8ZIlly1gds8ftwgj6j30e3020gls.jpg)





## Map

### HashMap的底层实现

#### JDK1.8之前

JDK1.8 之前 HashMap 由 **数组+链表** 组成的（**“链表散列”** 即数组和链表的结合体），数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的（HashMap 采用 **“拉链法也就是链地址法”** 解决冲突），如果定位到的数组位置不含链表（当前 entry 的 next 指向 null ）,那么对于查找，添加等操作很快，仅需一次寻址即可；如果定位到的数组包含链表，对于添加操作，其时间复杂度依然为 O(1)，因为最新的 Entry 会插入链表头部，即需要简单改变引用链即可，而对于查找操作来讲，此时就需要遍历链表，然后通过 key 对象的 equals 方法逐一比对查找.

> 所谓 **“拉链法”** 就是将链表和数组相结合。也就是说创建一个链表数组，数组中每一格就是一个链表。若遇到哈希冲突，则将冲突的值加到链表中即可。

![](https://www.javazhiyin.com/wp-content/uploads/2018/11/java3-1543319970.png)

#### JDK1.8之后

相比于之前的版本， JDK1.8之后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时，将链表转化为红黑树，以减少搜索时间。

![这几道Java集合框架面试题在面试中几乎必问](https://www.javazhiyin.com/wp-content/uploads/2018/11/java8-1543319970.jpeg)

TreeMap、TreeSet以及 JDK1.8 之后的 HashMap 底层都用到了红黑树。红黑树就是为了解决二叉查找树的缺陷，因为二叉查找树在某些情况下会退化成一个线性结构。



### HashMap 和 Hashtable 的区别

1. **线程是否安全：** HashMap 是非线程安全的，HashTable 是线程安全的；HashTable 内部的方法基本都经过 `synchronized` 修饰。（如果你要保证线程安全的话就使用 ConcurrentHashMap 吧！）；

2. **效率：** 因为线程安全的问题，HashMap 要比 HashTable 效率高一点。另外，HashTable 基本被淘汰，不要在代码中使用它；

3. **对Null key 和Null value的支持：** HashMap 中，null 可以作为键，这样的键只有一个，可以有一个或多个键所对应的值为 null。。但是在 HashTable 中 put 进的键值只要有一个 null，直接抛出 NullPointerException。

4. **初始容量大小和每次扩充容量大小的不同 ：** 

   ①创建时如果不指定容量初始值，Hashtable 默认的初始大小为11，之后每次扩充，容量变为原来的2n+1。HashMap 默认的初始化大小为16。之后每次扩充，容量变为原来的2倍。

   ②创建时如果给定了容量初始值，那么 Hashtable 会直接使用你给定的大小，而 HashMap 会将其扩充为2的幂次方大小。也就是说 HashMap 总是使用2的幂次方作为哈希表的大小,后面会介绍到为什么是2的幂次方。

5. **底层数据结构：** JDK1.8 以后的 HashMap 在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时，将链表转化为红黑树，以减少搜索时间。Hashtable 没有这样的机制。



### HashMap 的长度为什么是2的幂次方

为了能让 HashMap 存取高效，尽量较少碰撞，也就是要尽量把数据分配均匀，每个链表/红黑树长度大致相同。这个实现就是把数据存到哪个链表/红黑树中的算法。

**这个算法应该如何设计呢？**

我们首先可能会想到采用%取余的操作来实现。但是，重点来了：**“取余(%)操作中如果除数是2的幂次则等价于与其除数减一的与(&)操作（也就是说 hash%length==hash&(length-1)的前提是 length 是2的 n 次方；）。”** 并且 **采用二进制位操作 &，相对于%能够提高运算效率，这就解释了 HashMap 的长度为什么是2的幂次方。**



### HashSet 和 HashMap 区别

![这几道Java集合框架面试题在面试中几乎必问](https://www.javazhiyin.com/wp-content/uploads/2018/11/java7-1543319970.jpeg)



### Hashtable 和 ConcurrentHashMap 的区别

ConcurrentHashMap 和 Hashtable 的区别主要体现在实现线程安全的方式上不同。

- **底层数据结构：** JDK1.7的 ConcurrentHashMap 底层采用 **分段的数组+链表** 实现，JDK1.8 采用的数据结构跟HashMap1.8的结构类似，**数组+链表/红黑二叉树**。Hashtable 和 JDK1.8 之前的 HashMap 的底层数据结构类似都是采用 **数组+链表** 的形式，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的；
- **实现线程安全的方式（重要）：** ① **在JDK1.7的时候，ConcurrentHashMap（分段锁）** 对整个桶数组进行了分割分段(Segment)，每一把锁只锁容器其中一部分数据，多线程访问容器里不同数据段的数据，就不会存在锁竞争，提高并发访问率。（默认分配16个Segment，比Hashtable效率提高16倍。） **到了 JDK1.8 的时候已经摒弃了Segment的概念，而是直接用 Node 数组+链表/红黑树的数据结构来实现，并发控制使用 synchronized 和 CAS 来操作。（JDK1.6以后 对 synchronized锁做了很多优化）** 整个看起来就像是优化过且线程安全的 HashMap，虽然在JDK1.8中还能看到 Segment 的数据结构，但是已经简化了属性，只是为了兼容旧版本；② **Hashtable(同一把锁)** :使用 synchronized 来保证线程安全，效率非常低下。当一个线程访问同步方法时，其他线程也访问同步方法，可能会进入阻塞或轮询状态，如使用 put 添加元素，另一个线程不能使用 put 添加元素，也不能使用 get，竞争越激烈效率越低。

**两者的对比图：**

HashTable:![这几道Java集合框架面试题在面试中几乎必问](https://www.javazhiyin.com/wp-content/uploads/2018/11/java0-1543319971.jpg)

JDK1.7的ConcurrentHashMap：![这几道Java集合框架面试题在面试中几乎必问](https://www.javazhiyin.com/wp-content/uploads/2018/11/java3-1543319971.jpg)JDK1.8的ConcurrentHashMap（TreeBin: 红黑二叉树节点；Node: 链表节点）：![这几道Java集合框架面试题在面试中几乎必问](https://www.javazhiyin.com/wp-content/uploads/2018/11/java2-1543319971.png)



### ConcurrentHashMap线程安全的具体实现方式/底层具体实现

#### JDK1.7（上面有示意图）

首先将数据分为一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据时，其他段的数据也能被其他线程访问。

**ConcurrentHashMap 是由 Segment 数组结构和 HahEntry 数组结构组成**。

Segment 实现了 ReentrantLock,所以 Segment 是一种可重入锁，扮演锁的角色。HashEntry 用于存储键值对数据。

```
static class Segment<K,V> extends ReentrantLock implements Serializable {}
```

一个 ConcurrentHashMap 里包含一个 Segment 数组。Segment 的结构和HashMap类似，是一种数组和链表结构，一个 Segment 包含一个 HashEntry 数组，每个 HashEntry 是一个链表结构的元素，每个 Segment 守护着一个HashEntry数组里的元素，当对 HashEntry 数组的数据进行修改时，必须首先获得对应的 Segment的锁。

#### JDK1.8 （上面有示意图）

ConcurrentHashMap取消了Segment分段锁，采用CAS和synchronized来保证并发安全。数据结构跟HashMap1.8的结构类似，数组+链表/红黑二叉树。

synchronized只锁定当前链表或红黑二叉树的首节点，这样只要hash不冲突，就不会产生并发，效率又提升N倍。



### Comparable和Comparator接口有何区别？

Comparable和Comparator接口被用来对对象集合或者数组进行排序。Comparable接口被用来提供对象的自然排序，我们可以使用它来提供基于单个逻辑的排序。Comparator接口被用来提供不同的排序算法，我们可以选择需要使用的Comparator来对给定的对象集合进行排序。



## Set

### HashSet 原理

## HashSet如何检查重复

当你把对象加入HashSet时，HashSet会先计算对象的hashcode值来判断对象加入的位置，同时也会与其他加入的对象的hashcode值作比较，如果没有相符的hashcode，HashSet会假设对象没有重复出现。但是如果发现有相同hashcode值的对象，这时会调用equals（）方法来检查hashcode相等的对象是否真的相同。如果两者相同，HashSet就不会让加入操作成功。（摘自我的Java启蒙书《Head fist java》第二版）

**hashCode（）与equals（）的相关规定：**

1. 如果两个对象相等，则hashcode一定也是相同的
2. 两个对象相等,对两个equals方法返回true
3. 两个对象有相同的hashcode值，它们也不一定是相等的
4. 综上，equals方法被覆盖过，则hashCode方法也必须被覆盖
5. hashCode()的默认行为是对堆上的对象产生独特值。如果没有重写hashCode()，则该class的两个对象无论如何都不会相等（即使这两个对象指向相同的数据）。

**==与equals的区别**

1. ==是判断两个变量或实例是不是指向同一个内存空间 equals是判断两个变量或实例所指向的内存空间的值是不是相同
2. ==是指对内存地址进行比较 equals()是对字符串的内容进行比较3.==指引用是否相同 equals()指的是值是否相同




## 集合框架底层数据结构总结

### Collection

#### 1. List

- **Arraylist：** Object数组
- **Vector：** Object数组
- **LinkedList：** 双向循环链表

#### 2. Set

- **HashSet（无序，唯一）:** 基于 HashMap 实现的，底层采用 HashMap 来保存元素。HashMap底层数据结构见下。
- **LinkedHashSet：** LinkedHashSet 继承与 HashSet，并且其内部是通过 LinkedHashMap 来实现的。有点类似于我们之前说的LinkedHashMap 其内部是基于 Hashmap 实现一样，不过还是有一点点区别的。
- **TreeSet（有序，唯一）：** 红黑树(自平衡的排序二叉树。)

#### 3. Map

- **HashMap：** JDK1.8之前HashMap由数组+链表组成的，数组是HashMap的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）.JDK1.8以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时，将链表转化为红黑树，以减少搜索时间
- **LinkedHashMap:** LinkedHashMap 继承自 HashMap，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，LinkedHashMap 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。详细可以查看：《LinkedHashMap 源码详细分析（JDK1.8）》：https://www.imooc.com/article/22931
- **HashTable:** 数组+链表组成的，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的
- **TreeMap:** 红黑树（自平衡的排序二叉树）





### Iterater和ListIterator之间有什么区别？

- 我们可以使用Iterator来遍历Set和List集合，而ListIterator只能遍历List。 
- Iterator只可以向前遍历，而LIstIterator可以双向遍历。 
- ListIterator从Iterator接口继承，然后添加了一些额外的功能，比如添加一个元素、替换一个元素、获取前面或后面元素的索引位置。



## comparable 和 comparator的区别？

- comparable接口实际上是出自java.lang包 它有一个 compareTo(Object obj)方法用来排序
- comparator接口实际上是出自 java.util 包它有一个compare(Object obj1, Object obj2)方法用来排序

一般我们需要对一个集合使用自定义排序时，我们就要重写compareTo方法或compare方法，当我们需要对某一个集合实现两种排序方式，比如一个song对象中的歌名和歌手名分别采用一种排序方法的话，我们可以重写compareTo方法和使用自制的Comparator方法或者以两个Comparator来实现歌名排序和歌星名排序，第二种代表我们只能使用两个参数版的Collections.sort().



## 如何对Object的list排序？

- 对objects数组进行排序，我们可以用Arrays.sort()方法
- 对objects的集合进行排序，需要使用Collections.sort()方法





## 参考与感谢

https://www.javatpoint.com/java-arraylist

https://www.runoob.com/java/java-collections.html

https://www.javazhiyin.com/21717.html

https://yuqirong.me/2018/01/31/LinkedList内部原理解析/