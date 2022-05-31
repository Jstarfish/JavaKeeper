# 「直击面试」—— Java 集合，你肯定也会被问到这些

> 文章收录在 GitBook [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱

作为一位小菜 ”一面面试官“，面试过程中，我肯定会问 Java 集合的内容，同时作为求职者，也肯定会被问到集合，所以整理下 Java 集合面试题

![](https://i02piccdn.sogoucdn.com/fe487f455e5b1eb6)

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
>
> list 可以删除吗，遍历的时候可以删除吗，为什么

面向对象语言对事物的体现都是以对象的形式，所以为了方便对多个对象的操作，需要将对象进行存储，集合就是存储对象最常用的一种方式，也叫容器。

![](https://tva1.sinaimg.cn/large/00831rSTly1gdp03vldkkg30hv0gzwet.gif)



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
2. List是有序的允许有重复元素的 Collection，实现类主要有：ArrayList、LinkedList、Stack以及Vector等
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

- 扩容大小：ArrayList 在底层数组不够用时在原来的基础上扩展 0.5 倍，Vector 默认是扩展 1 倍

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

    

## ArrayList 与 LinkedList 区别

- 是否保证线程安全： ArrayList 和 LinkedList 都是不同步的，也就是不保证线程安全；
- **底层数据结构**： Arraylist 底层使用的是 Object 数组；LinkedList 底层使用的是**双向循环链表**数据结构；
- **插入和删除是否受元素位置的影响：**
  -  **ArrayList 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。** 比如：执行 `add(E e)`方法的时候， ArrayList 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是O(1)。但是如果要在指定位置 i 插入和删除元素的话（ `add(intindex,E element)`）时间复杂度就为 O(n-i)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。
  -  **LinkedList 采用链表存储，所以插入，删除元素时间复杂度不受元素位置的影响，都是近似 $O(1)$，而数组为近似 $O(n)$。**
  -  ArrayList 一般应用于查询较多但插入以及删除较少情况，如果插入以及删除较多则建议使用 LinkedList
- **是否支持快速随机访问**： LinkedList 不支持高效的随机元素访问，而 ArrayList 实现了 RandomAccess 接口，所以有随机访问功能。快速随机访问就是通过元素的序号快速获取元素对象(对应于 `get(intindex)`方法)。
- **内存空间占用**： ArrayList 的空间浪费主要体现在在 list 列表的结尾会预留一定的容量空间，而 LinkedList 的空间花费则体现在它的每一个元素都需要消耗比 ArrayList 更多的空间（因为要存放直接后继和直接前驱以及数据）。



高级工程师的我，可不得看看源码，具体分析下：

- ArrayList 工作原理其实很简单，底层是动态数组，每次创建一个 ArrayList 实例时会分配一个初始容量（没有指定初始容量的话，默认是 10），以 add 方法为例，如果没有指定初始容量，当执行 add 方法，先判断当前数组是否为空，如果为空则给保存对象的数组分配一个最小容量，默认为 10。当添加大容量元素时，会先增加数组的大小，以提高添加的效率；

- LinkedList 是有序并且支持元素重复的集合，底层是基于双向链表的，即每个节点既包含指向其后继的引用也包括指向其前驱的引用。链表无容量限制，但双向链表本身使用了更多空间，也需要额外的链表指针操作。按下标访问元素 `get(i)/set(i,e)` 要悲剧的遍历链表将指针移动到位(如果i>数组大小的一半，会从末尾移起)。插入、删除元素时修改前后节点的指针即可，但还是要遍历部分链表的指针才能移动到下标所指的位置，只有在链表两头的操作`add()`， `addFirst()`，`removeLast()`或用 `iterator()` 上的 `remove()` 能省掉指针的移动。此外 LinkedList 还实现了 Deque（继承自Queue接口）接口，可以当做队列使用。

不会囊括所有方法，只是为了学习，记录思想。

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

### 构造器

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
   throw new IllegalArgumentException("Illegal Capacity: "+initialCapacity);
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
// LinkedList 既然作为链表，那么肯定会有节点
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

**ArrayList** 的 get() 方法很简单，就是在数组中返回指定位置的元素即可，所以效率很高

```java
public E get(int index) {
    // 检查 index 有没有超出索引的范围
    rangeCheck(index);
    // 返回指定位置的元素
    return elementData(index);
}
```

**LinkedList** 的 get() 方法，就是在内部调用了上边看到的 node() 方法，判断在前半段还是在后半段，然后遍历得到即可。

```java
public E get(int index) {
    checkElementIndex(index);
    return node(index).item;
}
```

------



## Hash冲突及解决办法

解决哈希冲突的方法一般有：开放定址法、链地址法（拉链法）、再哈希法、建立公共溢出区等方法。

> - 开放定址法：从发生冲突的那个单元起，按照一定的次序，从哈希表中找到一个空闲的单元。然后把发生冲突的元素存入到该单元的一种方法。开放定址法需要的表长度要大于等于所需要存放的元素。
> - 链接地址法（拉链法）：是将哈希值相同的元素构成一个同义词的单链表，并将单链表的头指针存放在哈希表的第i个单元中，查找、插入和删除主要在同义词链表中进行。（链表法适用于经常进行插入和删除的情况）
> - 再哈希法：就是同时构造多个不同的哈希函数： Hi = RHi(key)   i= 1,2,3 … k; 当H1 = RH1(key)  发生冲突时，再用H2 = RH2(key) 进行计算，直到冲突不再产生，这种方法不易产生聚集，但是增加了计算时间
> - 建立公共溢出区：将哈希表分为公共表和溢出表，当溢出发生时，将所有溢出数据统一放到溢出区



## HashMap的底层实现

> 什么时候会使用HashMap？他有什么特点？
>
> 你知道HashMap的工作原理吗？
>
> 你知道get和put的原理吗？equals()和hashCode()的都有什么作用？
>
> 你知道hash的实现吗？为什么要这样实现？
>
> 如果HashMap的大小超过了负载因子(load factor)定义的容量，怎么办？

HashMap 在 JDK 7 和 JDK8 中的实现方式略有不同。分开记录。

深入 HahsMap 之前，先要了解的概念

1. initialCapacity：初始容量。指的是 HashMap 集合初始化的时候自身的容量。可以在构造方法中指定；如果不指定的话，总容量默认值是 16 。需要注意的是初始容量必须是 2 的幂次方。（**1.7中，已知HashMap中将要存放的KV个数的时候，设置一个合理的初始化容量可以有效的提高性能**）

   ```java
   static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
   ```

2. size：当前 HashMap 中已经存储着的键值对数量，即 `HashMap.size()` 。

3. loadFactor：加载因子。所谓的加载因子就是 HashMap (当前的容量/总容量) 到达一定值的时候，HashMap 会实施扩容。加载因子也可以通过构造方法中指定，默认的值是 0.75 。举个例子，假设有一个 HashMap 的初始容量为 16 ，那么扩容的阀值就是 0.75 * 16 = 12 。也就是说，在你打算存入第 13 个值的时候，HashMap 会先执行扩容。

4. threshold：扩容阀值。即 扩容阀值 = HashMap 总容量 * 加载因子（默认是12）。当前 HashMap 的容量大于或等于扩容阀值的时候就会去执行扩容。扩容的容量为当前 HashMap 总容量的两倍。比如，当前 HashMap 的总容量为 16 ，那么扩容之后为 32 。

5. table：Entry 数组。我们都知道 HashMap 内部存储 key/value 是通过 Entry 这个介质来实现的。而 table 就是 Entry 数组。

### JDK1.7 实现

JDK1.7 中 HashMap 由 **数组+链表** 组成（**“链表散列”** 即数组和链表的结合体），数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的（HashMap 采用 **“拉链法也就是链地址法”** 解决冲突），如果定位到的数组位置不含链表（当前 entry 的 next 指向 null ），那么对于查找，添加等操作很快，仅需一次寻址即可；如果定位到的数组包含链表，对于添加操作，其时间复杂度依然为 $O(1)$，因为最新的 Entry 会插入链表头部，即需要简单改变引用链即可，而对于查找操作来讲，此时就需要遍历链表，然后通过 key 对象的 equals 方法逐一比对查找。

> 所谓 **“拉链法”** 就是将链表和数组相结合。也就是说创建一个链表数组，数组中每一格就是一个链表。若遇到哈希冲突，则将冲突的值加到链表中即可。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx45a2fbbj31dz0oaacx.jpg)

#### 源码解析

##### 构造方法

《阿里巴巴 Java 开发手册》推荐集合初始化时，指定集合初始值大小。（说明：HashMap 使用HashMap(int initialCapacity) 初始化）建议原因： https://www.zhihu.com/question/314006228/answer/611170521

```java
// 默认的构造方法使用的都是默认的初始容量和加载因子
// DEFAULT_INITIAL_CAPACITY = 16，DEFAULT_LOAD_FACTOR = 0.75f
public HashMap() {
    this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR);
}

// 可以指定初始容量，并且使用默认的加载因子
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

public HashMap(int initialCapacity, float loadFactor) {
    // 对初始容量的值判断
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    // 设置加载因子
    this.loadFactor = loadFactor;
    threshold = initialCapacity;
    // 空方法
    init();
}

public HashMap(Map<? extends K, ? extends V> m) {
  this(Math.max((int) (m.size() / DEFAULT_LOAD_FACTOR) + 1,
                DEFAULT_INITIAL_CAPACITY), DEFAULT_LOAD_FACTOR);
  inflateTable(threshold);
  putAllForCreate(m);
}
```

HashMap 的前 3 个构造方法最后都会去调用 `HashMap(int initialCapacity, float loadFactor)` 。在其内部去设置初始容量和加载因子。而最后的 `init()` 是空方法，主要给子类实现，比如LinkedHashMap。

##### put() 方法

```java
public V put(K key, V value) {
    // 如果 table 数组为空时先创建数组，并且设置扩容阀值
    if (table == EMPTY_TABLE) {
        inflateTable(threshold);
    }
    // 如果 key 为空时，调用 putForNullKey 方法特殊处理
    if (key == null)
        return putForNullKey(value);
    // 计算 key 的哈希值
    int hash = hash(key);
    // 根据计算出来的哈希值和当前数组的长度计算在数组中的索引
    int i = indexFor(hash, table.length);
    // 先遍历该数组索引下的整条链表
    // 如果该 key 之前已经在 HashMap 中存储了的话，直接替换对应的 value 值即可
    for (Entry<K,V> e = table[i]; e != null; e = e.next) {
        Object k;
       //先判断hash值是否一样，如果一样，再判断key是否一样，不同对象的hash值可能一样
        if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }

    modCount++;
    // 如果该 key 之前没有被存储过，那么就进入 addEntry 方法
    addEntry(hash, key, value, i);
    return null;
}

void addEntry(int hash, K key, V value, int bucketIndex) {
    // 当前容量大于或等于扩容阀值的时候，会执行扩容
    if ((size >= threshold) && (null != table[bucketIndex])) {
        // 扩容为原来容量的两倍
        resize(2 * table.length);
        // 重新计算哈希值
        hash = (null != key) ? hash(key) : 0;
        // 重新得到在新数组中的索引
        bucketIndex = indexFor(hash, table.length);
    }
    // 创建节点
    createEntry(hash, key, value, bucketIndex);
}

//扩容，创建了一个新的数组，然后把数据全部复制过去，再把新数组的引用赋给 table
void resize(int newCapacity) {
    Entry[] oldTable = table;  //引用扩容前的Entry数组
    int oldCapacity = oldTable.length;
    if (oldCapacity == MAXIMUM_CAPACITY) { //扩容前的数组大小如果已经达到最大(2^30)了
        threshold = Integer.MAX_VALUE;  //修改阈值为int的最大值(2^31-1)，这样以后就不会扩容了
        return;
    }
    // 创建新的 entry 数组
    Entry[] newTable = new Entry[newCapacity];
    // 将旧 entry 数组中的数据复制到新 entry 数组中
    transfer(newTable, initHashSeedAsNeeded(newCapacity));
    // 将新数组的引用赋给 table
    table = newTable;
    // 计算新的扩容阀值
    threshold = (int)Math.min(newCapacity * loadFactor, MAXIMUM_CAPACITY + 1);
}

void transfer(Entry[] newTable) {
     Entry[] src = table;                   //src引用了旧的Entry数组
     int newCapacity = newTable.length;
     for (int j = 0; j < src.length; j++) { //遍历旧的Entry数组
         Entry<K,V> e = src[j];             //取得旧Entry数组的每个元素
         if (e != null) {
             src[j] = null;//释放旧Entry数组的对象引用（for循环后，旧的Entry数组不再引用任何对象）
             do {
                 Entry<K,V> next = e.next;
                 int i = indexFor(e.hash, newCapacity); //！！重新计算每个元素在数组中的位置
                 e.next = newTable[i]; //标记[1]
                 newTable[i] = e;      //将元素放在数组上
                 e = next;             //访问下一个Entry链上的元素
             } while (e != null);
         }
     }
} 

void createEntry(int hash, K key, V value, int bucketIndex) {
   // 取出table中下标为bucketIndex的Entry
    Entry<K,V> e = table[bucketIndex];
   // 利用key、value来构建新的Entry
   // 并且之前存放在table[bucketIndex]处的Entry作为新Entry的next
   // 把新创建的Entry放到table[bucketIndex]位置
    table[bucketIndex] = new Entry<>(hash, key, value, e);
    // 当前 HashMap 的容量加 1
    size++;
}
```

最后的 `createEntry()` 方法就说明了当 hash 冲突时，采用的拉链法来解决 hash 冲突的，并且是把新元素插入到单链表的表头。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx45xr0x5j31hl0u0ncd.jpg)

##### get() 方法

```java
public V get(Object key) {
    // 如果 key 是空的，就调用 getForNullKey 方法特殊处理
    if (key == null)
        return getForNullKey();
    // 获取 key 相对应的 entry 
    Entry<K,V> entry = getEntry(key);

    return null == entry ? null : entry.getValue();
}

//找到对应 key 的数组索引，然后遍历链表查找即可
final Entry<K,V> getEntry(Object key) {
    if (size == 0) {
        return null;
    }
    // 计算 key 的哈希值
    int hash = (key == null) ? 0 : hash(key);
    // 得到数组的索引，然后遍历链表，查看是否有相同 key 的 Entry
    for (Entry<K,V> e = table[indexFor(hash, table.length)];
         e != null;
         e = e.next) {
        Object k;
        if (e.hash == hash &&
            ((k = e.key) == key || (key != null && key.equals(k))))
            return e;
    }
    // 没有的话，返回 null
    return null;
}
```

### JDK1.8 实现

JDK 1.7 中，如果哈希碰撞过多，拉链过长，极端情况下，所有值都落入了同一个桶内，这就退化成了一个链表。通过 key 值查找要遍历链表，效率较低。 JDK1.8 在解决哈希冲突时有了较大的变化，**当链表长度大于阈值（默认为8）时，将链表转化为红黑树**，以减少搜索时间。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx468uknnj31650ogjth.jpg)

TreeMap、TreeSet 以及 JDK1.8 之后的 HashMap 底层都用到了红黑树。红黑树就是为了解决二叉查找树的缺陷，因为二叉查找树在某些情况下会退化成一个线性结构。

#### 源码解析

##### 构造方法

JDK8 构造方法改动不是很大

```java
public HashMap() {
  this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}

public HashMap(int initialCapacity) {
  this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

public HashMap(int initialCapacity, float loadFactor) {
  if (initialCapacity < 0)
    throw new IllegalArgumentException("Illegal initial capacity: " +
                                       initialCapacity);
  if (initialCapacity > MAXIMUM_CAPACITY)
    initialCapacity = MAXIMUM_CAPACITY;
  if (loadFactor <= 0 || Float.isNaN(loadFactor))
    throw new IllegalArgumentException("Illegal load factor: " +
                                       loadFactor);
  this.loadFactor = loadFactor;
  this.threshold = tableSizeFor(initialCapacity);
}

public HashMap(Map<? extends K, ? extends V> m) {
  this.loadFactor = DEFAULT_LOAD_FACTOR;
  putMapEntries(m, false);
}
```

##### 确定哈希桶数组索引位置（hash 函数的实现）

```java
//方法一：
static final int hash(Object key) { //jdk1.8 & jdk1.7
 int h;
 // h = key.hashCode() 为第一步 取hashCode值
 // h ^ (h >>> 16)  为第二步 高位参与运算
 return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
//方法二：
static int indexFor(int h, int length) { //jdk1.7的源码，jdk1.8没有提取这个方法，而是放在了其他方法中，比如 put 的p = tab[i = (n - 1) & hash]
 return h & (length-1); //第三步 取模运算
}
```

HashMap 定位数组索引位置，直接决定了 hash 方法的离散性能。Hash 算法本质上就是三步：**取key的hashCode值、高位运算、取模运算**。

![hash](https://tva1.sinaimg.cn/large/007S8ZIlly1gdwv5m4g4sj30ga09cdfy.jpg)

> 为什么要这样呢？

### HashMap 的长度为什么是 2 的幂次方?

目的当然是为了减少哈希碰撞，使 table 里的数据分布的更均匀。

1. HashMap 中桶数组的大小 length 总是 2 的幂，此时，`h & (table.length -1)` 等价于对 length 取模 `h%length`。但取模的计算效率没有位运算高，所以这是一个优化。假设 `h = 185`，`table.length-1 = 15(0x1111)`，其实散列真正生效的只是低 4bit 的有效位，所以很容易碰撞。

   ![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx46gac50j30m8037mxf.jpg)

2. 图中的 hash 是由键的 hashCode 产生。计算余数时，由于 n 比较小，hash 只有低 4 位参与了计算，高位的计算可以认为是无效的。这样导致了计算结果只与低位信息有关，高位数据没发挥作用。为了处理这个缺陷，我们可以把上图中的 hash 高 4 位数据与低 4 位数据进行异或运算，即 `hash ^ (hash >>> 4)`。通过这种方式，让高位数据与低位数据进行异或，以此加大低位信息的随机性，变相的让高位数据参与到计算中。此时的计算过程如下：

   ![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx46jwezjj30m804cjrw.jpg)

   在 Java 中，hashCode 方法产生的 hash 是 int 类型，32 位宽。前16位为高位，后16位为低位，所以要右移16位，即 `hash ^ (hash >>> 16)` 。这样还增加了 hash 的复杂度，进而影响 hash 的分布性。

**HashMap 的长度为什么是 2 的幂次方？**

为了能让 HashMap 存取高效，尽量减少碰撞，也就是要尽量把数据分配均匀，Hash值的范围是 -2147483648 到 2147483647，前后加起来有 40 亿的映射空间，只要哈希函数映射的比较均匀松散，一般应用是很难出现碰撞的，但一个问题是 40 亿的数组内存是放不下的。所以这个散列值是不能直接拿来用的。用之前需要先对数组长度取模运算，得到余数才能用来存放位置也就是对应的数组小标。这个数组下标的计算方法是 `(n-1)&hash`，n 代表数组长度。

这个算法应该如何设计呢？

我们首先可能会想到采用%取余的操作来实现。但是，重点来了。

**取余操作中如果除数是2的幂次则等价于其除数减一的与操作**，也就是说 `hash%length=hash&(length-1)`，但前提是 length 是 2 的 n 次方，并且采用 & 运算比 % 运算效率高，这也就解释了 HashMap 的长度为什么是 2 的幂次方。

##### get() 方法

```java
public V get(Object key) {
  Node<K,V> e;
  return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
  Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
  //定位键值对所在桶的位置
  if ((tab = table) != null && (n = tab.length) > 0 &&
      (first = tab[(n - 1) & hash]) != null) {
    // 直接命中
    if (first.hash == hash && // always check first node
        ((k = first.key) == key || (key != null && key.equals(k))))
      return first;
    // 未命中
    if ((e = first.next) != null) {
      // 如果 first 是 TreeNode 类型，则调用黑红树查找方法
      if (first instanceof TreeNode)
        return ((TreeNode<K,V>)first).getTreeNode(hash, key);
      do {
        // 在链表中查找
        if (e.hash == hash &&
            ((k = e.key) == key || (key != null && key.equals(k))))
          return e;
      } while ((e = e.next) != null);
    }
  }
  return null;
}
```

##### put() 方法

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdx470vyzej311c0u0120.jpg)

```java
public V put(K key, V value) {
  // 对key的hashCode()做hash
  return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
  Node<K,V>[] tab; Node<K,V> p; int n, i;
  // tab为空则创建
  if ((tab = table) == null || (n = tab.length) == 0)
    n = (tab = resize()).length;
  // 计算index，并对null做处理
  if ((p = tab[i = (n - 1) & hash]) == null)
    tab[i] = newNode(hash, key, value, null);
  else {
    Node<K,V> e; K k;
    // 节点key存在，直接覆盖value
    if (p.hash == hash &&
        ((k = p.key) == key || (key != null && key.equals(k))))
      e = p;
    // 判断该链为红黑树
    else if (p instanceof TreeNode)
      e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
    else {
      //该链为链表
      for (int binCount = 0; ; ++binCount) {
        if ((e = p.next) == null) {
          p.next = newNode(hash, key, value, null);
          //链表长度大于8转换为红黑树进行处理
          if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
            treeifyBin(tab, hash);
          break;
        }
        //key已经存在直接覆盖value
        if (e.hash == hash &&
            ((k = e.key) == key || (key != null && key.equals(k))))
          break;
        p = e;
      }
    }
    if (e != null) { // existing mapping for key
      V oldValue = e.value;
      if (!onlyIfAbsent || oldValue == null)
        e.value = value;
      afterNodeAccess(e);
      return oldValue;
    }
  }
  ++modCount;
  // 超过最大容量 就扩容
  if (++size > threshold)
    resize();
  afterNodeInsertion(evict);
  return null;
}
```

> HashMap 的 put 方法的具体流程？

①.判断键值对数组table[i]是否为空或为null，否则执行resize()进行扩容；

②.根据键值key计算hash值得到插入的数组索引i，如果table[i]==null，直接新建节点添加，转向⑥，如果table[i]不为空，转向③；

③.判断table[i]的首个元素是否和key一样，如果相同直接覆盖value，否则转向④，这里的相同指的是hashCode以及equals；

④.判断table[i] 是否为treeNode，即table[i] 是否是红黑树，如果是红黑树，则直接在树中插入键值对，否则转向⑤；

⑤.遍历table[i]，判断链表长度是否大于8（还会判断数组长度是否大于等于64），大于8的话把链表转换为红黑树，在红黑树中执行插入操作，否则进行链表的插入操作；遍历过程中若发现key已经存在直接覆盖value即可；

⑥.插入成功后，判断实际存在的键值对数量size是否超多了最大容量threshold，如果超过，进行扩容。

##### resize() 扩容

```java
final Node<K,V>[] resize() {
  Node<K,V>[] oldTab = table;
  int oldCap = (oldTab == null) ? 0 : oldTab.length;
  int oldThr = threshold;
  int newCap, newThr = 0;
  if (oldCap > 0) {
    // 超过最大值就不再扩充了，就只好随你碰撞了
    if (oldCap >= MAXIMUM_CAPACITY) {
      //修改阈值为int的最大值(2^31-1)，这样以后就不会扩容了
      threshold = Integer.MAX_VALUE;
      return oldTab;
    }
     // 没超过最大值，就扩充为原来的2倍
    else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
             oldCap >= DEFAULT_INITIAL_CAPACITY)
      newThr = oldThr << 1; // double threshold
  }
  else if (oldThr > 0) // initial capacity was placed in threshold
    newCap = oldThr;
  else {               // zero initial threshold signifies using defaults
    newCap = DEFAULT_INITIAL_CAPACITY;
    newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
  }
  // 计算新的resize上限
  if (newThr == 0) {
    float ft = (float)newCap * loadFactor;
    newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
              (int)ft : Integer.MAX_VALUE);
  }
  threshold = newThr;
  // 开始复制到新的数组
  @SuppressWarnings({"rawtypes","unchecked"})
  Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
  table = newTab;
  // 把每个bucket都移动到新的buckets中
  if (oldTab != null) {
    //  循环遍历旧的 table 数组
    for (int j = 0; j < oldCap; ++j) {
      Node<K,V> e;
      if ((e = oldTab[j]) != null) {
        oldTab[j] = null;
        //  如果该桶只有一个元素，那么直接复制
        if (e.next == null)
          newTab[e.hash & (newCap - 1)] = e;
        // 如果是红黑树，那么对红黑树进行拆分
        else if (e instanceof TreeNode)
          ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
         //  遍历链表，将原链表节点分成lo和hi两个链表
         // 其中 lo 表示在原来的桶位置，hi 表示在新的桶位置
        else { // preserve order  链表优化重hash的代码块
          Node<K,V> loHead = null, loTail = null;
          Node<K,V> hiHead = null, hiTail = null;
          Node<K,V> next;
          do {
            // 原索引
            next = e.next;
            if ((e.hash & oldCap) == 0) {
              if (loTail == null)
                loHead = e;
              else
                loTail.next = e;
              loTail = e;
            }
            // 原索引+oldCap
            else {
              if (hiTail == null)
                hiHead = e;
              else
                hiTail.next = e;
              hiTail = e;
            }
          } while ((e = next) != null);
          // 原索引放到bucket里
          if (loTail != null) {
            loTail.next = null;
            newTab[j] = loHead;
          }
          // 原索引+oldCap放到bucket里
          if (hiTail != null) {
            hiTail.next = null;
            newTab[j + oldCap] = hiHead;
          }
        }
      }
    }
  }
  return newTab;
}
```

### HashMap的扩容操作是怎么实现的？

1. 在 jdk1.8 中，resize 方法是在 HashMap 中的键值对大于阀值时或者初始化时，就调用 resize 方法进行扩容；
2. 每次扩展的时候，都是扩展 2 倍；
3. 扩展后 Node 对象的位置要么在原位置，要么移动到原偏移量两倍的位置。

在 `putVal()` 中，我们看到在这个函数里面使用到了2次 `resize()` 方法，`resize()` 方法表示在进行第一次初始化时会对其进行扩容，或者当该数组的实际大小大于其扩容阈值（第一次为0.75 * 16 = 12），这个时候在扩容的同时也会伴随的桶上面的元素进行重新分发，这也是JDK1.8版本的一个优化的地方，在1.7中，扩容之后需要重新去计算其Hash值，根据Hash值对其进行分发，但在1.8 版本中，则是根据在同一个桶的位置中进行判断(e.hash & oldCap)是否为0，重新进行hash分配后，该元素的位置要么停留在原始位置，要么移动到原始位置+增加的数组大小这个位置上



##### 链表树化

当桶中链表长度超过 TREEIFY_THRESHOLD（默认为8）时，就会调用 treeifyBin 方法进行树化操作。但此时并不一定会树化，因为在 treeifyBin 方法中还会判断 HashMap 的容量是否大于等于 64。如果容量大于等于 64，那么进行树化，否则优先进行扩容。

为什么树化还要判断整体容量是否大于 64 呢？

当桶数组容量比较小时，键值对节点 hash 的碰撞率可能会比较高，进而导致链表长度较长，从而导致查询效率低下。这时候我们有两种选择，一种是扩容，让哈希碰撞率低一些。另一种是树化，提高查询效率。

如果我们采用扩容，那么我们需要做的就是做一次链表数据的复制。而如果我们采用树化，那么我们需要将链表转化成红黑树。到这里，貌似没有什么太大的区别，但我们让场景继续延伸下去。当插入的数据越来越多，我们会发现需要转化成树的链表越来越多。

到了一定容量，我们就需要进行扩容了。这个时候我们有许多树化的红黑树，在扩容之时，我们需要将许多的红黑树拆分成链表，这是一个挺大的成本。而如果我们在容量小的时候就进行扩容，那么需要树化的链表就越少，我们扩容的成本也就越低。

接下来我们看看链表树化是怎么做的：

```java
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    // 1. 容量小于 MIN_TREEIFY_CAPACITY，优先扩容
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        resize();
    // 2. 桶不为空，那么进行树化操作
    else if ((e = tab[index = (n - 1) & hash]) != null) {
        TreeNode<K,V> hd = null, tl = null;
        // 2.1 先将链表转成 TreeNode 表示的双向链表
        do {
            TreeNode<K,V> p = replacementTreeNode(e, null);
            if (tl == null)
                hd = p;
            else {
                p.prev = tl;
                tl.next = p;
            }
            tl = p;
        } while ((e = e.next) != null);
        // 2.2 将 TreeNode 表示的双向链表树化
        if ((tab[index] = hd) != null)
            hd.treeify(tab);
    }
}
```

我们可以看到链表树化的整体思路也比较清晰。首先将链表转成 TreeNode 表示的双向链表，之后再调用 `treeify()` 方法进行树化操作。那么我们继续看看 `treeify()` 方法的实现。

```java
final void treeify(Node<K,V>[] tab) {
    TreeNode<K,V> root = null;
    // 1. 遍历双向 TreeNode 链表，将 TreeNode 节点一个个插入
    for (TreeNode<K,V> x = this, next; x != null; x = next) {
        next = (TreeNode<K,V>)x.next;
        x.left = x.right = null;
        // 2. 如果 root 节点为空，那么直接将 x 节点设置为根节点
        if (root == null) {
            x.parent = null;
            x.red = false;
            root = x;
        }
        else {
            K k = x.key;
            int h = x.hash;
            Class<?> kc = null;            
            // 3. 如果 root 节点不为空，那么进行比较并在合适的地方插入
            for (TreeNode<K,V> p = root;;) {
                int dir, ph;
                K pk = p.key;
                // 4. 计算 dir 值，-1 表示要从左子树查找插入点，1表示从右子树
                if ((ph = p.hash) > h)
                    dir = -1;
                else if (ph < h)
                    dir = 1;
                else if ((kc == null &&
                          (kc = comparableClassFor(k)) == null) ||
                         (dir = compareComparables(kc, k, pk)) == 0)
                    dir = tieBreakOrder(k, pk);

                TreeNode<K,V> xp = p;
                // 5. 如果查找到一个 p 点，这个点是叶子节点
                // 那么这个就是插入位置
                if ((p = (dir <= 0) ? p.left : p.right) == null) {
                    x.parent = xp;   
                    if (dir <= 0)
                        xp.left = x;
                    else
                        xp.right = x;
                    // 做插入后的动平衡
                    root = balanceInsertion(root, x);
                    break;
                }
            }
        }
    }
    // 6.将 root 节点移动到链表头
    moveRootToFront(tab, root);
}
```

从上面代码可以看到，treeify() 方法其实就是将双向 TreeNode 链表进一步树化成红黑树。其中大致的步骤为：

- 遍历 TreeNode 双向链表，将 TreeNode 节点一个个插入
- 如果 root 节点为空，那么表示红黑树现在为空，直接将该节点作为根节点。否则需要查找到合适的位置去插入 TreeNode 节点。
- 通过比较与 root 节点的位置，不断寻找最合适的点。如果最终该节点的叶子节点为空，那么该节点 p 就是插入节点的父节点。接着，将 x 节点的 parent 引用指向 xp 节点，xp 节点的左子节点或右子节点指向 x 节点。
- 接着，调用 balanceInsertion 做一次动态平衡。
- 最后，调用 moveRootToFront 方法将 root 节点移动到链表头。

关于 balanceInsertion() 动平衡可以参考红黑树的插入动平衡，这里暂不深入讲解。最后我们继续看看 moveRootToFront 方法。

```java
static <K,V> void moveRootToFront(Node<K,V>[] tab, TreeNode<K,V> root) {
    int n;
    if (root != null && tab != null && (n = tab.length) > 0) {
        int index = (n - 1) & root.hash;
        TreeNode<K,V> first = (TreeNode<K,V>)tab[index];
        // 如果插入红黑树的 root 节点不是链表的第一个元素
        // 那么将 root 节点取出来，插在 first 节点前面
        if (root != first) {
            Node<K,V> rn;
            tab[index] = root;
            TreeNode<K,V> rp = root.prev;
            // 下面的两个 if 语句，做的事情是将 root 节点取出来
            // 让 root 节点的前继指向其后继节点
            // 让 root 节点的后继指向其前继节点
            if ((rn = root.next) != null)
                ((TreeNode<K,V>)rn).prev = rp;
            if (rp != null)
                rp.next = rn;
            // 这里直接让 root 节点插入到 first 节点前方
            if (first != null)
                first.prev = root;
            root.next = first;
            root.prev = null;
        }
        assert checkInvariants(root);
    }
}
```

##### 红黑树拆分

扩容后，普通节点需要重新映射，红黑树节点也不例外。按照一般的思路，我们可以先把红黑树转成链表，之后再重新映射链表即可。但因为红黑树插入的时候，TreeNode 保存了元素插入的顺序，所以直接可以按照插入顺序还原成链表。这样就避免了将红黑树转成链表后再进行哈希映射，无形中提高了效率。

```java
final void split(HashMap<K,V> map, Node<K,V>[] tab, int index, int bit) {
    TreeNode<K,V> b = this;
    // Relink into lo and hi lists, preserving order
    TreeNode<K,V> loHead = null, loTail = null;
    TreeNode<K,V> hiHead = null, hiTail = null;
    int lc = 0, hc = 0;
    // 1. 将红黑树当成是一个 TreeNode 组成的双向链表
    // 按照链表扩容一样，分别放入 loHead 和 hiHead 开头的链表中
    for (TreeNode<K,V> e = b, next; e != null; e = next) {
        next = (TreeNode<K,V>)e.next;
        e.next = null;
        // 1.1. 扩容后的位置不变，还是原来的位置，该节点放入 loHead 链表
        if ((e.hash & bit) == 0) {
            if ((e.prev = loTail) == null)
                loHead = e;
            else
                loTail.next = e;
            loTail = e;
            ++lc;
        }
        // 1.2 扩容后的位置改变了，放入 hiHead 链表
        else {
            if ((e.prev = hiTail) == null)
                hiHead = e;
            else
                hiTail.next = e;
            hiTail = e;
            ++hc;
        }
    }
    // 2. 对 loHead 和 hiHead 进行树化或链表化
    if (loHead != null) {
        // 2.1 如果链表长度小于阈值，那就链表化，否则树化
        if (lc <= UNTREEIFY_THRESHOLD)
            tab[index] = loHead.untreeify(map);
        else {
            tab[index] = loHead;
            if (hiHead != null) // (else is already treeified)
                loHead.treeify(tab);
        }
    }
    if (hiHead != null) {
        if (hc <= UNTREEIFY_THRESHOLD)
            tab[index + bit] = hiHead.untreeify(map);
        else {
            tab[index + bit] = hiHead;
            if (loHead != null)
                hiHead.treeify(tab);
        }
    }
}
```

从上面的代码我们知道红黑树的扩容也和链表的转移是一样的，不同的是其转化成 hiHead 和 loHead 之后，会根据链表长度选择拆分成链表还是继承维持红黑树的结构。

##### 红黑树链化

我们在说到红黑树拆分的时候说到，红黑树结构在扩容的时候如果长度低于阈值，那么就会将其转化成链表。其实现代码如下：

```java
final Node<K,V> untreeify(HashMap<K,V> map) {
    Node<K,V> hd = null, tl = null;
    for (Node<K,V> q = this; q != null; q = q.next) {
        Node<K,V> p = map.replacementNode(q, null);
        if (tl == null)
            hd = p;
        else
            tl.next = p;
        tl = p;
    }
    return hd;
}
```

因为红黑树中包含了插入元素的顺序，所以当我们将红黑树拆分成两个链表 hiHead 和 loHead 时，其还是保持着原来的顺序的。所以此时我们只需要循环遍历一遍，然后将 TreeNode 节点换成 Node 节点即可。



### 为什么JDK1.8中HashMap从头插入改成尾插入

JDK1.7中扩容时，每个元素的rehash之后，都会插入到新数组对应索引的链表头，所以这就导致原链表顺序为A->B->C，扩容之后，rehash之后的链表可能为C->B->A，元素的顺序发生了变化。在并发场景下，**扩容时**可能会出现循环链表的情况。而JDK1.8从头插入改成尾插入元素的顺序不变，避免出现循环链表的情况

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/others/hashmap-1.7-cycle.png)

> 在扩容时，头插法会改变链表中元素原本的顺序，以至于在并发场景下导致链表成环的问题，而尾插法，在扩容时会保持链表元素原本的顺序，就不会出现链表成环的问题
>
> ### 死循环执行步骤1
>
> 死循环是因为并发 HashMap 扩容导致的，并发扩容的第一步，线程 T1 和线程 T2 要对 HashMap 进行扩容操作，此时 T1 和 T2 指向的是链表的头结点元素 A，而 T1 和 T2 的下一个节点，也就是 T1.next 和 T2.next 指向的是 B 节点，如下图所示：
>
> ![img](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/others/hashmap-cycle-1.png)
>
> ### 死循环执行步骤2
>
> 死循环的第二步操作是，线程 T2 时间片用完进入休眠状态，而线程 T1 开始执行扩容操作，一直到线程 T1 扩容完成后，线程 T2 才被唤醒，扩容之后的场景如下图所示：图片从上图可知线程 T1 执行之后，因为是头插法，所以 HashMap 的顺序已经发生了改变，但线程 T2 对于发生的一切是不可知的，所以它的指向元素依然没变，如上图展示的那样，T2 指向的是 A 元素，T2.next 指向的节点是 B 元素。
>
> ### 死循环执行步骤3
>
> 当线程 T1 执行完，而线程 T2 恢复执行时，死循环就建立了，如下图所示：
>
> ![img](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/others/hashmap-cycle-2.png)
>
> 因为 T1 执行完扩容之后 B 节点的下一个节点是 A，而 T2 线程指向的首节点是 A，第二个节点是 B，这个顺序刚好和 T1 扩完容完之后的节点顺序是相反的。T1 执行完之后的顺序是 B 到 A，而 T2 的顺序是 A 到 B，这样 A 节点和 B 节点就形成死循环了，这就是 HashMap 死循环导致的原因。

### HashMap 为什么线程不安全

1. put 的时候导致的多线程数据不一致。
    这个问题比较好想象，比如有两个线程 A 和 B，首先 A 希望插入一个 key-value 对到 HashMap 中，首先计算记录所要落到的桶的索引坐标，然后获取到该桶里面的链表头结点，此时线程 A 的时间片用完了，而此时线程 B 被调度得以执行，和线程 A 一样执行，只不过线程 B 成功将记录插到了桶里面，假设线程 A 插入的记录计算出来的桶索引和线程 B 要插入的记录计算出来的桶索引是一样的，那么当线程 B 成功插入之后，线程 A 再次被调度运行时，它依然持有过期的链表头但是它对此一无所知，以至于它认为它应该这样做，如此一来就覆盖了线程 B 插入的记录，这样线程 B 插入的记录就凭空消失了，造成了数据不一致的行为。

2. 另外一个比较明显的线程不安全的问题是 HashMap 的 get 操作可能因为 resize 而引起死循环（cpu100%），具体分析如下：

   下面的代码是resize的核心内容：

```java
void transfer(Entry[] newTable, boolean rehash) {  
        int newCapacity = newTable.length;  
        for (Entry<K,V> e : table) {  
  
            while(null != e) {  
                Entry<K,V> next = e.next;           
                if (rehash) {  
                    e.hash = null == e.key ? 0 : hash(e.key);  
                }  
                int i = indexFor(e.hash, newCapacity);   
                e.next = newTable[i];  
                newTable[i] = e;  
                e = next;  
            } 
        }  
    }  
```

具体原因如上题



### HashMap：JDK1.7 VS JDK1.8

JDK1.8主要解决或优化了以下问题：

- resize 扩容优化
- 引入了红黑树，目的是避免单条链表过长而影响查询效率
- 解决了多线程死循环问题，但仍是非线程安全的，多线程时可能会造成数据丢失问题

| 不同                     | JDK 1.7                                                      | JDK 1.8                                                      |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 存储结构                 | 数组 + 链表                                                  | 数组 + 链表 + 红黑树                                         |
| 初始化方式               | 单独函数：inflateTable()                                     | 直接集成到了扩容函数resize()中                               |
| hash值计算方式           | 扰动处理 = 9次扰动 = 4次位运算 + 5次异或运算                 | 扰动处理 = 2次扰动 = 1次位运算 + 1次异或运算                 |
| 存放数据的规则           | 无冲突时，存放数组；冲突时，存放链表                         | 无冲突时，存放数组；冲突 & 链表长度 < 8：存放单链表；冲突 & 链表长度 > 8：树化并存放红黑树 |
| 插入数据方式             | 头插法（先将原位置的数据移到后1位，再插入数据到该位置）      | 尾插法（直接插入到链表尾部/红黑树）                          |
| 扩容后存储位置的计算方式 | 全部按照原来方法进行计算（即hashCode ->> 扰动函数 ->> (h&length-1)） | 按照扩容后的规律计算（即扩容后的位置=原位置 or 原位置 + 旧容量 |

------



## Hashtable

Hashtable 和 HashMap 都是散列表，也是用”拉链法“实现的哈希表。保存数据和 JDK7 中的 HashMap 一样，是 Entity 对象，只是 Hashtable 中的几乎所有的 public 方法都是 synchronized 的，而有些方法也是在内部通过 synchronized 代码块来实现，效率肯定会降低。且 put() 方法不允许空值。



### HashMap 和 Hashtable 的区别

1. **线程是否安全：** HashMap 是非线程安全的，HashTable 是线程安全的；HashTable 内部的方法基本都经过 `synchronized` 修饰。（如果你要保证线程安全的话就使用 ConcurrentHashMap 吧！）；

2. **效率：** 因为线程安全的问题，HashMap 要比 HashTable 效率高一点。另外，HashTable 基本被淘汰，不要在代码中使用它；

3. **对Null key 和Null value的支持：** HashMap 中，null 可以作为键，这样的键只有一个，可以有一个或多个键所对应的值为 null。。但是在 HashTable 中 put 进的键值只要有一个 null，直接抛出 NullPointerException。

4. **初始容量大小和每次扩充容量大小的不同 ：** 

   ① 创建时如果不指定容量初始值，Hashtable 默认的初始大小为11，之后每次扩充，容量变为原来的2n+1。HashMap 默认的初始化大小为16。之后每次扩充，容量变为原来的2倍。

   ② 创建时如果给定了容量初始值，那么 Hashtable 会直接使用你给定的大小，而 HashMap 会将其扩充为2的幂次方大小。也就是说 HashMap 总是使用2的幂次方作为哈希表的大小,后面会介绍到为什么是2的幂次方。

5. **底层数据结构：** JDK1.8 以后的 HashMap 在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时，将链表转化为红黑树，以减少搜索时间。Hashtable 没有这样的机制。

6. HashMap的迭代器（`Iterator`）是fail-fast迭代器，但是 Hashtable的迭代器（`enumerator`）不是 fail-fast的。如果有其它线程对HashMap进行的添加/删除元素，将会抛出`ConcurrentModificationException`，但迭代器本身的`remove`方法移除元素则不会抛出异常。这条同样也是 Enumeration 和 Iterator 的区别。



#### 了解过 LinkedHashMap、TreeMap 吗

LinkedHashMap属于HashMap的子类，与HashMap的区别在于LinkedHashMap保存了记录插入的顺序。TreeMap 实现了 SortedMap接口，TreeMap 有能力对插入的记录根据 key 排序，默认按照升序排序，也可以自定义比较项，在使用 TreeMap 的时候，key 应当实现 Comparable。

> 虽然 LinkedHashMap 和 TreeMap 都可以保证某种顺序，但二者还是非常不同的。
>
> - LinkedHashMap 通常提供的是遍历顺序符合插入顺序，它的实现是通过为条目（键值对）维护一个双向链表。注意，通过特定构造函数，我们可以创建反映访问顺序的实例，所谓的 put、get、compute 等，都算作“访问”。
> - 对于 TreeMap，它的整体顺序是由键的顺序关系决定的，通过 Comparator 或 Comparable（自然顺序）来决定。

## ConcurrentHashMap

HashMap 在多线程情况下，在 put 的时候，插入的元素超过了容量（由负载因子决定）的范围就会触发扩容操作，就是 resize，这个会重新将原数组的内容重新 hash 到新的扩容数组中，在多线程的环境下，存在同时其他的元素也在进行 put 操作，如果 hash 值相同，可能出现同时在同一数组下用链表表示，造成**闭环**，导致在 get 时会出现死循环，所以 HashMap 是线程不安全的。(可参考：https://www.jianshu.com/p/e2f75c8cce01）

Hashtable，是线程安全的，它在所有涉及到多线程操作的都加上了 synchronized 关键字来锁住整个 table，这就意味着所有的线程都在竞争一把锁，在多线程的环境下，它是安全的，但是无疑是效率低下的。

### JDK1.7 实现

Hashtable 容器在竞争激烈的并发环境下表现出效率低下的原因，是因为所有访问 Hashtable 的线程都必须竞争同一把锁，那假如容器里有多把锁，每一把锁用于锁容器其中一部分数据，那么当多线程访问容器里不同数据段的数据时，线程间就不会存在锁竞争，这就是 ConcurrentHashMap 所使用的锁分段技术。

在 JDK1.7 版本中，ConcurrentHashMap 的数据结构是由一个 Segment 数组和多个 HashEntry 组成。Segment 数组的意义就是将一个大的 table 分割成多个小的 table 来进行加锁。每一个 Segment 元素存储的是 HashEntry 数组+链表，这个和 HashMap 的数据存储结构一样。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/others/concurrenthashmap-1.7-segment.jpg)

ConcurrentHashMap 类中包含两个静态内部类 HashEntry 和 Segment。
HashEntry 用来封装映射表的键值对，Segment 用来充当锁的角色，每个 Segment 对象守护整个散列映射表的若干个桶。每个桶是由若干个 HashEntry 对象链接起来的链表。一个 ConcurrentHashMap 实例中包含由若干个 Segment 对象组成的数组。每个 Segment 守护着一个 HashEntry 数组里的元素，当对 HashEntry 数组的数据进行修改时，必须首先获得它对应的 Segment 锁。

#### Segment 类

Segment 类继承于 ReentrantLock 类，从而使得 Segment 对象能充当可重入锁的角色。一个 Segment 就是一个子哈希表，Segment 里维护了一个 HashEntry 数组，并发环境下，对于不同 Segment 的数据进行操作是不用考虑锁竞争的。

从源码可以看到，Segment 内部类和我们上边看到的 HashMap 很相似。也有负载因子，阈值等各种属性。

```java
static final class Segment<K,V> extends ReentrantLock implements Serializable {
  
  static final int MAX_SCAN_RETRIES =
    Runtime.getRuntime().availableProcessors() > 1 ? 64 : 1;
  transient volatile HashEntry<K,V>[] table;
  transient int count;
  transient int modCount;  //记录修改次数
  transient int threshold;
  final float loadFactor;

  Segment(float lf, int threshold, HashEntry<K,V>[] tab) {
    this.loadFactor = lf;
    this.threshold = threshold;
    this.table = tab;
  }

  //put 方法会有加锁操作，
  final V put(K key, int hash, V value, boolean onlyIfAbsent) {
    HashEntry<K,V> node = tryLock() ? null :
                scanAndLockForPut(key, hash, value);
    // ...
  }

  @SuppressWarnings("unchecked")
  private void rehash(HashEntry<K,V> node) {
    // ...
  }

  private HashEntry<K,V> scanAndLockForPut(K key, int hash, V value) {
 		//...
  }

  private void scanAndLock(Object key, int hash) {
 		//...
  }

  final V remove(Object key, int hash, Object value) {
    //...
  }

  final boolean replace(K key, int hash, V oldValue, V newValue) {
  	//...
  }

  final V replace(K key, int hash, V value) {
    //...
  }

  final void clear() {
		//...
  }
}
```

#### HashEntry 类

HashEntry 是目前最小的逻辑处理单元。一个 ConcurrentHashMap 维护一个 Segment 数组，一个 Segment 维护一个 HashEntry 数组。

```java
static final class HashEntry<K,V> {
  final int hash;
  final K key;
  volatile V value;   // value 为 volatie 类型，保证可见
  volatile HashEntry<K,V> next;
	//...
}
```

#### ConcurrentHashMap 类

默认的情况下，每个 ConcurrentHashMap 类会创建16个并发的 segment，每个 segment 里面包含多个 Hash表，每个 Hash 链都是由 HashEntry 节点组成的。

```java
public class ConcurrentHashMap<K, V> extends AbstractMap<K, V>
        implements ConcurrentMap<K, V>, Serializable {
  //默认初始容量为 16，即初始默认为 16 个桶
  static final int DEFAULT_INITIAL_CAPACITY = 16;
  static final float DEFAULT_LOAD_FACTOR = 0.75f;
  //默认并发级别为 16。该值表示当前更新线程的估计数
  static final int DEFAULT_CONCURRENCY_LEVEL = 16;
  
  static final int MAXIMUM_CAPACITY = 1 << 30;
  static final int MIN_SEGMENT_TABLE_CAPACITY = 2;  
  static final int MAX_SEGMENTS = 1 << 16; // slightly conservative  
  static final int RETRIES_BEFORE_LOCK = 2;
  final int segmentMask;  //段掩码,主要为了定位Segment
  final int segmentShift;
  final Segment<K,V>[] segments;   //主干就是这个分段锁数组
  
  //构造器
  public ConcurrentHashMap(int initialCapacity,
                             float loadFactor, int concurrencyLevel) {
        if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)
            throw new IllegalArgumentException();
       //MAX_SEGMENTS 为1<<16=65536，也就是最大并发数为65536
        if (concurrencyLevel > MAX_SEGMENTS)
            concurrencyLevel = MAX_SEGMENTS;
        // 2的sshif次方等于ssize，例:ssize=16,sshift=4;ssize=32,sshif=5
        int sshift = 0;
        // ssize 为segments数组长度，根据concurrentLevel计算得出
        int ssize = 1;
        while (ssize < concurrencyLevel) {
            ++sshift;
            ssize <<= 1;
        }
        this.segmentShift = 32 - sshift;
        this.segmentMask = ssize - 1;
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        int c = initialCapacity / ssize;
        if (c * ssize < initialCapacity)
            ++c;
        int cap = MIN_SEGMENT_TABLE_CAPACITY;
        while (cap < c)
            cap <<= 1;
        // 创建segments数组并初始化第一个Segment，其余的Segment延迟初始化
        Segment<K,V> s0 =
            new Segment<K,V>(loadFactor, (int)(cap * loadFactor),
                             (HashEntry<K,V>[])new HashEntry[cap]);
        Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];
        UNSAFE.putOrderedObject(ss, SBASE, s0); // ordered write of segments[0]
        this.segments = ss;
    }
}
```

#### put() 方法

1. **定位segment并确保定位的Segment已初始化**
2. **调用 Segment的 put 方法。**

```java
public V put(K key, V value) {
  Segment<K,V> s;
  //concurrentHashMap不允许key/value为空
  if (value == null)
    throw new NullPointerException();
  //hash函数对key的hashCode重新散列，避免差劲的不合理的hashcode，保证散列均匀
  int hash = hash(key);
  //返回的hash值无符号右移segmentShift位与段掩码进行位运算，定位segment
  int j = (hash >>> segmentShift) & segmentMask;
  if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck
       (segments, (j << SSHIFT) + SBASE)) == null) //  in ensureSegment
    s = ensureSegment(j);
  return s.put(key, hash, value, false);
}
```

#### get() 方法

**get方法无需加锁，由于其中涉及到的共享变量都使用volatile修饰，volatile可以保证内存可见性，所以不会读取到过期数据**

```java
public V get(Object key) {
  Segment<K,V> s; // manually integrate access methods to reduce overhead
  HashEntry<K,V>[] tab;
  int h = hash(key);
  long u = (((h >>> segmentShift) & segmentMask) << SSHIFT) + SBASE;
  if ((s = (Segment<K,V>)UNSAFE.getObjectVolatile(segments, u)) != null &&
      (tab = s.table) != null) {
    for (HashEntry<K,V> e = (HashEntry<K,V>) UNSAFE.getObjectVolatile
         (tab, ((long)(((tab.length - 1) & h)) << TSHIFT) + TBASE);
         e != null; e = e.next) {
      K k;
      if ((k = e.key) == key || (e.hash == h && key.equals(k)))
        return e.value;
    }
  }
  return null;
}
```

### JDK1.8  实现

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/others/concurrenthashmap-1.8.jpg)

ConcurrentHashMap 在 JDK8 中进行了巨大改动，光是代码量就从1000多行增加到6000行！1.8 摒弃了`Segment`(锁段)的概念，采用了 `CAS + synchronized` 来保证并发的安全性。

可以看到，和 HashMap 1.8 的数据结构很像。底层数据结构改变为采用**数组+链表+红黑树**的数据形式。

#### 和HashMap1.8相同的一些地方

- 底层数据结构一致
- HashMap初始化是在第一次put元素的时候进行的，而不是init
- HashMap的底层数组长度总是为2的整次幂
- 默认树化的阈值为 8，而链表化的阈值为 6（当低于这个阈值时，红黑树转成链表）
- hash算法也很类似，但多了一步`& HASH_BITS`，该步是为了消除最高位上的负符号，hash的负在ConcurrentHashMap中有特殊意义表示在**扩容或者是树节点**

```java
static final int HASH_BITS = 0x7fffffff; // usable bits of normal node hash

static final int spread(int h) {
    return (h ^ (h >>> 16)) & HASH_BITS;
}
```

#### 一些关键属性

```java
private static final int MAXIMUM_CAPACITY = 1 << 30; //数组最大大小 同HashMap

private static final int DEFAULT_CAPACITY = 16;//数组默认大小

static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8; //数组可能最大值，需要与toArray（）相关方法关联

private static final int DEFAULT_CONCURRENCY_LEVEL = 16; //兼容旧版保留的值，默认线程并发度，类似信号量

private static final float LOAD_FACTOR = 0.75f;//默认map扩容比例，实际用(n << 1) - (n >>> 1)代替了更高效

static final int TREEIFY_THRESHOLD = 8; // 链表转树阀值，大于8时

static final int UNTREEIFY_THRESHOLD = 6; //树转链表阀值，小于等于6（tranfer时，lc、hc=0两个计数器分别++记录原bin、新binTreeNode数量，<=UNTREEIFY_THRESHOLD 则untreeify(lo)）。【仅在扩容tranfer时才可能树转链表】

static final int MIN_TREEIFY_CAPACITY = 64;

private static final int MIN_TRANSFER_STRIDE = 16;//扩容转移时的最小数组分组大小

private static int RESIZE_STAMP_BITS = 16;//本类中没提供修改的方法 用来根据n生成位置一个类似时间戳的功能

private static final int MAX_RESIZERS = (1 << (32 - RESIZE_STAMP_BITS)) - 1; // 2^15-1，help resize的最大线程数

private static final int RESIZE_STAMP_SHIFT = 32 - RESIZE_STAMP_BITS; // 32-16=16，sizeCtl中记录size大小的偏移量

static final int MOVED = -1; // hash for forwarding nodes（forwarding nodes的hash值）、标示位

static final int TREEBIN = -2; // hash for roots of trees（树根节点的hash值）

static final int RESERVED = -3; // ReservationNode的hash值

static final int HASH_BITS = 0x7fffffff; // 用在计算hash时进行安位与计算消除负hash

static final int NCPU = Runtime.getRuntime().availableProcessors(); // 可用处理器数量

/* ---------------- Fields -------------- */

transient volatile Node<K,V>[] table; //装载Node的数组，作为ConcurrentHashMap的数据容器，采用懒加载的方式，直到第一次插入数据的时候才会进行初始化操作，数组的大小总是为2的幂次方。

private transient volatile Node<K,V>[] nextTable; //扩容时使用，平时为null，只有在扩容的时候才为非null

/**
* 实际上保存的是hashmap中的元素个数  利用CAS锁进行更新但它并不用返回当前hashmap的元素个数 
*/
private transient volatile long baseCount;

/**
*该属性用来控制table数组的大小，根据是否初始化和是否正在扩容有几种情况：
*当值为负数时：如果为-1表示正在初始化，如果为-N则表示当前正有N-1个线程进行扩容操作；
*当值为正数时：如果当前数组为null的话表示table在初始化过程中，sizeCtl表示为需要新建数组的长度；若已经初始化了，表示当前数据容器（table数组）可用容量也可以理解成临界值（插入节点数超过了该临界值就需要扩容），具体指为数组的长度n 乘以 加载因子loadFactor；当值为0时，即数组长度为默认初始值。
*/
private transient volatile int sizeCtl;
```

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

```java
final V putVal(K key, V value, boolean onlyIfAbsent) {
    // key 和 value 均不允许为 null
    if (key == null || value == null) throw new NullPointerException();
    // 根据 key 计算出 hash 值
    int hash = spread(key.hashCode());
    int binCount = 0;
    for (Node<K,V>[] tab = table;;) {
        Node<K,V> f; int n, i, fh;
         // 判断是否需要进行初始化
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();
        // f 即为当前 key 定位出的 Node，如果为空表示当前位置可以写入数据，利用 CAS 尝试写入，失败则自旋保证成功
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            if (casTabAt(tab, i, null,
                         new Node<K,V>(hash, key, value, null)))
                break;                   // no lock when adding to empty bin
        }
        // 如果当前位置的 hashcode == MOVED == -1,则需要进行扩容
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        // 如果都不满足，则利用 synchronized 锁写入数据
        else {
          // 剩下情况又分两种，插入链表、插入红黑树
            V oldVal = null;
          //采用同步内置锁实现并发控制
            synchronized (f) {
                if (tabAt(tab, i) == f) {
                    // 如果 fh=f.hash >=0，当前为链表，在链表中插入新的键值对
                    if (fh >= 0) {
                        binCount = 1;
                      //遍历链表，如果找到对应的 node 节点，修改 value,否则直接在链表尾部加入节点
                        for (Node<K,V> e = f;; ++binCount) {
                            K ek;
                            if (e.hash == hash &&
                                ((ek = e.key) == key ||
                                 (ek != null && key.equals(ek)))) {
                                oldVal = e.val;
                                if (!onlyIfAbsent)
                                    e.val = value;
                                break;
                            }
                            Node<K,V> pred = e;
                            if ((e = e.next) == null) {
                                pred.next = new Node<K,V>(hash, key,
                                                          value, null);
                                break;
                            }
                        }
                    }
                    // 当前为红黑树，将新的键值对插入到红黑树中
                    else if (f instanceof TreeBin) {
                        Node<K,V> p;
                        binCount = 2;
                        if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                       value)) != null) {
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }
            // 插入完键值对后再根据实际大小看是否需要转换成红黑树
            if (binCount != 0) {
                if (binCount >= TREEIFY_THRESHOLD)
                    treeifyBin(tab, i);
                if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }
    // 对当前容量大小进行检查，如果超过了临界值（实际大小*加载因子）就需要扩容 
    addCount(1L, binCount);
    return null;
}
```

我们可以发现 JDK8 中的实现也是**锁分离**的思想，只是锁住的是一个Node，而不是JDK7中的Segment，而锁住Node之前的操作是无锁的并且也是线程安全的，建立在之前提到的原子操作上。

#### get() 方法

get方法无需加锁，由于其中涉及到的共享变量都使用volatile修饰，volatile可以保证内存可见性，所以不会读取到过期数据

```java
public V get(Object key) {
  Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
  int h = spread(key.hashCode());
  // 判断数组是否为空
  if ((tab = table) != null && (n = tab.length) > 0 &&
      (e = tabAt(tab, (n - 1) & h)) != null) {
    // 判断node 节点第一个元素是不是要找的，如果是直接返回
    if ((eh = e.hash) == h) {
      if ((ek = e.key) == key || (ek != null && key.equals(ek)))
        return e.val;
    }
    // // hash小于0,说明是特殊节点（TreeBin或ForwardingNode）调用find
    else if (eh < 0)
      return (p = e.find(h, key)) != null ? p.val : null;
    // 不是上面的情况,那就是链表了,遍历链表
    while ((e = e.next) != null) {
      if (e.hash == h &&
          ((ek = e.key) == key || (ek != null && key.equals(ek))))
        return e.val;
    }
  }
  return null;
}
```



### Hashtable 和 ConcurrentHashMap 的区别

ConcurrentHashMap 和 Hashtable 的区别主要体现在实现线程安全的方式上不同。

- **底层数据结构：** JDK1.7 的 ConcurrentHashMap 底层采用 **分段的数组+链表** 实现，JDK1.8 采用的数据结构和 HashMap1.8 的结构类似，**数组+链表/红黑二叉树**。Hashtable 和 JDK1.8 之前的 HashMap 的底层数据结构类似都是采用 **数组+链表** 的形式，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的；
- **实现线程安全的方式（重要）** ：
  - **在 JDK1.7 的时候，ConcurrentHashMap（分段锁）** 对整个桶数组进行了分割分段(Segment)，每一把锁只锁容器其中一部分数据，多线程访问容器里不同数据段的数据，就不会存在锁竞争，提高并发访问率。（默认分配16个Segment，比Hashtable效率提高16倍。） **到了 JDK1.8 的时候已经摒弃了Segment的概念，而是直接用 Node 数组+链表/红黑树的数据结构来实现，并发控制使用 synchronized 和 CAS 来操作。（JDK1.6以后 对 synchronized锁做了很多优化）** 整个看起来就像是优化过且线程安全的 HashMap，虽然在 JDK1.8 中还能看到 Segment 的数据结构，但是已经简化了属性，只是为了兼容旧版本；
  - Hashtable(同一把锁) ：使用 synchronized 来保证线程安全，效率非常低下。当一个线程访问同步方法时，其他线程也访问同步方法，可能会进入阻塞或轮询状态，如使用 put 添加元素，另一个线程不能使用 put 添加元素，也不能使用 get，竞争越激烈效率越低。



## Java快速失败（fail-fast）和安全失败（fail-safe）区别

### 快速失败（fail—fast）

在用迭代器遍历一个集合对象时，如果遍历过程中对集合对象的内容进行了修改（增加、删除、修改），则会抛出 `ConcurrentModificationException`。

原理：迭代器在遍历时直接访问集合中的内容，并且在遍历过程中使用一个 modCount 变量。集合在被遍历期间如果内容发生变化，就会改变 modCount 的值。每当迭代器使用 hashNext()/next() 遍历下一个元素之前，都会检测 modCount 变量是否为 expectedmodCount 值，是的话就返回遍历；否则抛出异常，终止遍历。

注意：这里异常的抛出条件是检测到 modCount！=expectedmodCount 这个条件。如果集合发生变化时修改modCount 值刚好又设置为了 expectedmodCount 值，则异常不会抛出。因此，不能依赖于这个异常是否抛出而进行并发操作的编程，这个异常只建议用于检测并发修改的 bug。

场景：`java.util` 包下的集合类都是快速失败的，不能在多线程下发生并发修改（迭代过程中被修改）。

### 安全失败（fail—safe）

采用安全失败机制的集合容器，在遍历时不是直接在集合内容上访问的，而是先复制原有集合内容，在拷贝的集合上进行遍历。

原理：由于迭代时是对原集合的拷贝进行遍历，所以在遍历过程中对原集合所作的修改并不能被迭代器检测到，所以不会触发 `Concurrent Modification Exception`。

缺点：基于拷贝内容的优点是避免了 `Concurrent Modification Exception`，但同样地，迭代器并不能访问到修改后的内容，即：迭代器遍历的是开始遍历那一刻拿到的集合拷贝，在遍历期间原集合发生的修改迭代器是不知道的。

场景：`java.util.concurrent` 包下的容器都是安全失败，可以在多线程下并发使用，并发修改。

**快速失败和安全失败是对迭代器而言的**。 

快速失败：当在迭代一个集合的时候，如果有另外一个线程在修改这个集合，就会抛出`ConcurrentModification`异常，`java.util` 下都是快速失败。 

安全失败：在迭代时候会在集合二层做一个拷贝，所以在修改集合上层元素不会影响下层。在 `java.util.concurrent` 下都是安全失败



### 如何避免**fail-fast** ？

- 在单线程的遍历过程中，如果要进行 remove 操作，可以调用迭代器 ListIterator 的 remove 方法而不是集合类的 remove方法。看看 ArrayList 中迭代器的 remove 方法的源码，该方法不能指定元素删除，只能 remove 当前遍历元素。

```java
public void remove() {
    if (lastRet < 0)
        throw new IllegalStateException();
    checkForComodification();

    try {
        SubList.this.remove(lastRet);
        cursor = lastRet;
        lastRet = -1;
        expectedModCount = ArrayList.this.modCount;  //
    } catch (IndexOutOfBoundsException ex) {
        throw new ConcurrentModificationException();
    }
}
```

- 使用并发包(`java.util.concurrent`)中的类来代替 ArrayList 和 hashMap
  - CopyOnWriterArrayList 代替 ArrayList
  - ConcurrentHashMap 代替 HashMap



## Iterator 和 Enumeration 区别

在 Java 集合中，我们通常都通过 “Iterator(迭代器)” 或 “Enumeration(枚举类)” 去遍历集合。

```java
public interface Enumeration<E> {
    boolean hasMoreElements();
    E nextElement();
}
```

```java
public interface Iterator<E> {
    boolean hasNext();
    E next();
    void remove();
}
```

- **函数接口不同**，Enumeration**只有2个函数接口。**通过Enumeration，我们只能读取集合的数据，而不能对数据进行修改。Iterator**只有3个函数接口。**Iterator除了能读取集合的数据之外，也能数据进行删除操作。
- **Iterator支持 fail-fast机制，而Enumeration不支持**。Enumeration 是 JDK 1.0 添加的接口。使用到它的函数包括 Vector、Hashtable 等类，这些类都是 JDK 1.0中加入的，Enumeration 存在的目的就是为它们提供遍历接口。Enumeration 本身并没有支持同步，而在 Vector、Hashtable 实现 Enumeration 时，添加了同步。
  而 Iterator 是 JDK 1.2 才添加的接口，它也是为了 HashMap、ArrayList 等集合提供遍历接口。Iterator 是支持 fail-fast 机制的：当多个线程对同一个集合的内容进行操作时，就可能会产生 fail-fast 事件



## Comparable 和 Comparator 接口有何区别？

Java 中对集合对象或者数组对象排序，有两种实现方式：

- 对象实现 Comparable 接口

  - Comparable 在 `java.lang` 包下，是一个接口，内部只有一个方法 `compareTo()`

    ```java
    public interface Comparable<T> {
        public int compareTo(T o);
    }
    ```

  - Comparable 可以让实现它的类的对象进行比较，具体的比较规则是按照 compareTo 方法中的规则进行。这种顺序称为 **自然顺序**。
  - 实现了 Comparable 接口的 List 或则数组可以使用 `Collections.sort()` 或者 `Arrays.sort()` 方法进行排序

- 定义比较器，实现 Comparator接口

  - Comparator 在 `java.util` 包下，也是一个接口，JDK 1.8 以前只有两个方法：

    ```java
    public interface Comparator<T> {
        public int compare(T lhs, T rhs);
        public boolean equals(Object object);
    }
    ```

**comparable 相当于内部比较器。comparator 相当于外部比较器**

区别：

- Comparator 位于 `java.util` 包下，而 Comparable 位于 `java.lang` 包下

- Comparable 接口的实现是在类的内部（如 String、Integer已经实现了 Comparable 接口，自己就可以完成比较大小操作），Comparator 接口的实现是在类的外部（可以理解为一个是自已完成比较，一个是外部程序实现比较）

- 实现 Comparable 接口要重写 compareTo 方法, 在 compareTo 方法里面实现比较。一个已经实现Comparable 的类的对象或数据，可以通过 **Collections.sort(list) 或者 Arrays.sort(arr)**实现排序。通过 **Collections.sort(list,Collections.reverseOrder())** 对list进行倒序排列。

  ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzefrcjolj30ui0u0dm0.jpg)

- 实现Comparator需要重写 compare 方法

  ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzefws30uj311s0t643v.jpg)



## HashSet

HashSet 是用来存储没有重复元素的集合类，并且它是无序的。HashSet 内部实现是基于 HashMap ，实现了 Set 接口。

从 HahSet 提供的构造器可以看出，除了最后一个 HashSet 的构造方法外，其他所有内部就是去创建一个 HashMap 。没有其他的操作。而最后一个构造方法不是 public 的，所以不对外公开。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzeqxhvj3j311s0ka787.jpg)



### HashSet如何检查重复

HashSet 的底层其实就是 HashMap，只不过我们 **HashSet 是实现了 Set 接口并且把数据作为 K 值，而 V 值一直使用一个相同的虚值来保存**，HashMap的 K 值本身就不允许重复，并且在 HashMap 中如果 K/V 相同时，会用新的 V 覆盖掉旧的 V，然后返回旧的 V。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdzeyvg5h0j311s0jen0n.jpg)



### Iterater 和 ListIterator 之间有什么区别？

- 我们可以使用 Iterator来遍历 Set 和 List 集合，而 ListIterator 只能遍历List
- ListIterator有add方法，可以向List中添加对象，而Iterator不能
- ListIterator和Iterator都有hasNext()和next()方法，可以实现顺序向后遍历，但是ListIterator有hasPrevious()和previous()方法，可以实现逆向（顺序向前）遍历。Iterator不可以
- ListIterator可以定位当前索引的位置，nextIndex()和previousIndex()可以实现。Iterator没有此功能
- 都可实现删除操作，但是 ListIterator可以实现对象的修改，set()方法可以实现。Iterator仅能遍历，不能修改



<img src="https://static01.imgkr.com/temp/ef920406f7274d06a9b203b6b03e3171.png" style="zoom:50%;" />



## References

所有内容都是基于源码阅读和各种大佬之前总结的知识整理而来，输入并输出，奥利给。

- https://www.javatpoint.com/java-arraylist

- https://www.runoob.com/java/java-collections.html

- https://www.javazhiyin.com/21717.html

- https://yuqirong.me/2018/01/31/LinkedList内部原理解析/

- https://youzhixueyuan.com/the-underlying-structure-and-principle-of-hashmap.html

- 《HashMap源码详细分析》http://www.tianxiaobo.com/2018/01/18/HashMap-源码详细分析-JDK1-8/

- 《ConcurrentHashMap1.7源码分析》https://www.cnblogs.com/chengxiao/p/6842045.html

- http://www.justdojava.com/2019/12/18/java-collection-15.1/