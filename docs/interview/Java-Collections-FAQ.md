---
title: 「直击面试」—— Java 集合，你肯定也会被问到这些
date: 2021-05-31
tags: 
 - Java
 - Interview
categories: Interview

---

![](https://img.starfish.ink/common/faq-banner.png)

> 文章收录在 GitBook [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱
>
> 作为一位小菜 "一面面试官"，面试过程中，我肯定会问 Java 集合的内容，同时作为求职者，也肯定会被问到集合，所以整理下 Java 集合面试题
>
> Java集合框架是Java编程的核心基础，也是面试中出现频率最高的技术点之一。从基础的List、Set、Map到高级的并发集合，从底层数据结构到性能优化，集合框架涵盖了数据结构、算法复杂度、线程安全等多个维度的知识点。掌握集合框架，不仅是Java开发的必备技能，更是解决实际业务问题的重要工具。

面向对象语言对事物的体现都是以对象的形式，所以为了方便对多个对象的操作，需要将对象进行存储，集合就是存储对象最常用的一种方式，也叫容器。

![img](https://www.runoob.com/wp-content/uploads/2014/01/2243690-9cd9c896e0d512ed.gif)

从上面的集合框架图可以看到，Java 集合框架主要包括两种类型的容器

- 一种是集合（Collection），存储一个元素集合
- 另一种是图（Map），存储键/值对映射。

Collection 接口又有 3 种子类型，List、Set 和 Queue，再下面是一些抽象类，最后是具体实现类，常用的有 ArrayList、LinkedList、HashSet、LinkedHashSet、HashMap、LinkedHashMap 等等。

集合框架是一个用来代表和操纵集合的统一架构。所有的集合框架都包含如下内容：

- **接口**：是代表集合的抽象数据类型。例如 Collection、List、Set、Map 等。之所以定义多个接口，是为了以不同的方式操作集合对象
- **实现（类）**：是集合接口的具体实现。从本质上讲，它们是可重复使用的数据结构，例如：ArrayList、LinkedList、HashSet、HashMap。
- **算法**：是实现集合接口的对象里的方法执行的一些有用的计算，例如：搜索和排序。这些算法被称为多态，那是因为相同的方法可以在相似的接口上有着不同的实现。

---

## 🗺️ 知识导航

### 🏷️ 核心知识分类

1. **📚 集合框架概览**：Collection vs Map、集合继承体系、Iterator模式、泛型使用
2. **📋 List接口实现**：ArrayList vs LinkedList、Vector、性能对比、使用场景
3. **🔢 Set接口实现**：HashSet vs TreeSet vs LinkedHashSet、去重原理、排序机制
4. **🗂️ Map接口实现**：HashMap vs TreeMap vs LinkedHashMap、hash冲突处理、红黑树
5. **🔒 线程安全集合**：ConcurrentHashMap、CopyOnWriteArrayList、同步容器vs并发容器
6. **⚡ 性能与优化**：时间复杂度分析、空间复杂度、扩容机制、最佳实践

---

## 📚 一、集合框架概览

### 1.1 常用集合介绍

**🎯 说说常用的集合有哪些吧？**

> Collection 有什么子接口、有哪些具体的实现

Map 接口和 Collection 接口是所有集合框架的父接口：

1. **Collection 接口的子接口包括**：Set、List、Queue
2. **List** 是有序的允许有重复元素的 Collection，实现类主要有：ArrayList、LinkedList、Stack以及Vector等
3. **Set** 是一种不包含重复元素且无序的Collection，实现类主要有：HashSet、TreeSet、LinkedHashSet等
4. **Map** 没有继承 Collection 接口，Map 提供 key 到 value 的映射。实现类主要有：HashMap、TreeMap、Hashtable、ConcurrentHashMap 以及 Properties 等

### 1.2 基础概念题

**🎯 说说Java集合框架的整体架构？**

```
Java集合框架主要分为两大体系：
1. Collection体系：
   - List（有序，可重复）：ArrayList、LinkedList、Vector
   - Set（无序，不重复）：HashSet、TreeSet、LinkedHashSet
   - Queue（队列）：LinkedList、PriorityQueue、ArrayDeque

2. Map体系（键值对）：
   - HashMap、TreeMap、LinkedHashMap、Hashtable、ConcurrentHashMap

核心接口关系：
- Iterable -> Collection -> List/Set/Queue
- Map独立体系
- 所有集合都实现了Iterator模式
```

**深入扩展：**

- Collection继承了Iterable接口，支持foreach语法
- Map不继承Collection，因为它存储的是键值对
- Collections工具类提供了大量静态方法操作集合

**🎯 Collection和Collections的区别？**

```
Collection：
- 是一个接口，集合框架的根接口
- 定义了集合的基本操作方法
- 被List、Set、Queue等接口继承

Collections：
- 是一个工具类，提供静态方法
- 包含排序、搜索、同步等操作
- 如sort()、binarySearch()、synchronizedList()等
```

**🎯 Hash冲突及解决办法？**

解决哈希冲突的方法一般有：开放定址法、链地址法（拉链法）、再哈希法、建立公共溢出区等方法。

- **开放定址法**：从发生冲突的那个单元起，按照一定的次序，从哈希表中找到一个空闲的单元。然后把发生冲突的元素存入到该单元的一种方法。开放定址法需要的表长度要大于等于所需要存放的元素。

- **链接地址法（拉链法）**：是将哈希值相同的元素构成一个同义词的单链表，并将单链表的头指针存放在哈希表的第i个单元中，查找、插入和删除主要在同义词链表中进行。（链表法适用于经常进行插入和删除的情况）

- **再哈希法**：就是同时构造多个不同的哈希函数： Hi = RHi(key) i= 1,2,3 … k; 当H1 = RH1(key) 发生冲突时，再用H2 = RH2(key) 进行计算，直到冲突不再产生，这种方法不易产生聚集，但是增加了计算时间

- **建立公共溢出区**：将哈希表分为公共表和溢出表，当溢出发生时，将所有溢出数据统一放到溢出区

### 1.3 Iterator模式题

**🎯 Iterator和ListIterator的区别？**

```
Iterator（单向迭代）：
- 只能向前遍历（hasNext、next）
- 支持remove操作
- 适用于所有Collection

ListIterator（双向迭代）：
- 支持双向遍历（hasNext、next、hasPrevious、previous）
- 支持add、set、remove操作
- 只适用于List集合
- 可以获取当前位置索引
```

**代码示例：**

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");

// Iterator - 单向
Iterator<String> it = list.iterator();
while(it.hasNext()) {
    String item = it.next();
    if("A".equals(item)) {
        it.remove(); // 安全删除
    }
}

// ListIterator - 双向
ListIterator<String> lit = list.listIterator();
while(lit.hasNext()) {
    String item = lit.next();
    lit.set(item + "_modified"); // 修改元素
}
```

---

## 📋 二、List接口实现

### 2.1 ArrayList vs Vector

**🎯 ArrayList和Vector的区别？**

**相同点**：

- ArrayList 和 Vector 都是继承了相同的父类和实现了相同的接口（都实现了List，有序、允许重复和null）

  ```java
  extends AbstractList<E>
          implements List<E>, RandomAccess, Cloneable, java.io.Serializable
  ```

- 底层都是数组（Object[]）实现的

- 初始默认长度都为**10**

**不同点**：

| **特性**     | **ArrayList** | **Vector**         |
| ------------ | ------------- | ------------------ |
| **线程安全** | 否            | 是（synchronized） |
| **性能**     | 高            | 较低（同步开销）   |
| **扩容机制** | 1.5倍         | 2倍                |
| **出现版本** | JDK 1.2       | JDK 1.0            |
| **迭代器**   | fail-fast     | fail-fast          |

**扩容机制详解**：

- **ArrayList 的 grow()**，在满足扩容条件时、ArrayList以**1.5** 倍的方式在扩容（oldCapacity >> **1** ，右移运算，相当于除以 2，结果为二分之一的 oldCapacity）

```java
private void grow(int minCapacity) {
    int oldCapacity = elementData.length;
    //newCapacity = oldCapacity + 0.5*oldCapacity,此处扩容0.5倍
    int newCapacity = oldCapacity + (oldCapacity >> 1); 
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

- **Vector 的 grow()**，Vector 比 ArrayList多一个属性，扩展因子capacityIncrement，可以扩容大小。当扩容容量增量大于**0**时、新数组长度为原数组长度**+**扩容容量增量、否则新数组长度为原数组长度的**2**倍

```java
private void grow(int minCapacity) {
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                     capacityIncrement : oldCapacity);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

**使用建议**：

- 单线程环境：优先使用ArrayList
- 多线程环境：使用Collections.synchronizedList()或CopyOnWriteArrayList

### 2.2 ArrayList深度解析

**🎯 ArrayList的底层实现原理？**

```
底层数据结构：
- 基于数组实现（Object[] elementData）
- 默认初始容量为10
- 支持动态扩容

扩容机制：
- 当容量不足时，扩容至原容量的1.5倍
- 使用Arrays.copyOf()复制数组
- 扩容是耗时操作，建议预估容量

核心特性：
- 随机访问：O(1)时间复杂度
- 插入/删除：O(n)时间复杂度（需要移动元素）
- 允许null值，允许重复元素
- 线程不安全
```

**源码关键点：**

```java
// 默认容量
private static final int DEFAULT_CAPACITY = 10;

// 扩容方法
private void grow(int minCapacity) {
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1); // 1.5倍扩容
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

**🎯 ArrayList和Vector的区别？**

| **特性**     | **ArrayList** | **Vector**         |
| ------------ | ------------- | ------------------ |
| **线程安全** | 否            | 是（synchronized） |
| **性能**     | 高            | 较低（同步开销）   |
| **扩容机制** | 1.5倍         | 2倍                |
| **出现版本** | JDK 1.2       | JDK 1.0            |
| **迭代器**   | fail-fast     | fail-fast          |

**使用建议：**

- 单线程环境：优先使用ArrayList
- 多线程环境：使用Collections.synchronizedList()或CopyOnWriteArrayList

### 2.2 LinkedList深度解析

**🎯 LinkedList的底层实现原理？**

```
底层数据结构：
- 双向链表实现
- 每个节点包含data、next、prev三个字段
- 维护first和last指针

核心特性：
- 插入/删除：O(1)时间复杂度（已知位置）
- 随机访问：O(n)时间复杂度（需要遍历）
- 实现了List和Deque接口
- 允许null值，允许重复元素
- 线程不安全
```

**节点结构：**

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

**🎯 ArrayList vs LinkedList什么时候使用？**

- 是否保证线程安全： ArrayList 和 LinkedList 都是不同步的，也就是不保证线程安全；
- **底层数据结构**： Arraylist 底层使用的是 Object 数组；LinkedList 底层使用的是**双向循环链表**数据结构；
- **插入和删除是否受元素位置的影响：**
  -  **ArrayList 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。** 比如：执行 `add(E e)`方法的时候， ArrayList 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是O(1)。但是如果要在指定位置 i 插入和删除元素的话（ `add(intindex,E element)`）时间复杂度就为 O(n-i)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。
  -  **LinkedList 采用链表存储，所以插入，删除元素时间复杂度不受元素位置的影响，都是近似 $O(1)$，而数组为近似 $O(n)$。**
  -  ArrayList 一般应用于查询较多但插入以及删除较少情况，如果插入以及删除较多则建议使用 LinkedList
- **是否支持快速随机访问**： LinkedList 不支持高效的随机元素访问，而 ArrayList 实现了 RandomAccess 接口，所以有随机访问功能。快速随机访问就是通过元素的序号快速获取元素对象(对应于 `get(intindex)`方法)。
- **内存空间占用**： ArrayList 的空间浪费主要体现在在 list 列表的结尾会预留一定的容量空间，而 LinkedList 的空间花费则体现在它的每一个元素都需要消耗比 ArrayList 更多的空间（因为要存放直接后继和直接前驱以及数据）。

**使用场景：**

```java
// 频繁随机访问 - 使用ArrayList
List<String> list1 = new ArrayList<>();
String item = list1.get(index); // O(1)

// 频繁插入删除 - 使用LinkedList
List<String> list2 = new LinkedList<>();
list2.add(0, "item"); // 头部插入 O(1)

// 作为队列使用 - LinkedList实现了Deque
Deque<String> queue = new LinkedList<>();
queue.offer("item");
queue.poll();
```

---

## 🔢 三、Set接口实现

### 3.1 HashSet深度解析

**🎯 HashSet的底层实现原理？**

```
底层实现：
- 基于HashMap实现
- 元素作为HashMap的key，value为固定的PRESENT对象
- 利用HashMap的key唯一性保证Set的不重复特性

去重原理：
1. 计算元素的hashCode()
2. 根据hash值定位存储位置
3. 如果位置为空，直接存储
4. 如果位置有元素，调用equals()比较
5. equals()返回true表示重复，不添加

核心特性：
- 无序（不保证插入顺序）
- 不允许重复元素
- 允许一个null值
- 线程不安全
```

**源码关键点：**

```java
public class HashSet<E> {
    private transient HashMap<E,Object> map;
    private static final Object PRESENT = new Object();
    
    public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }
}
```

**🎯 如何保证自定义对象在HashSet中不重复？**

```
必须重写hashCode()和equals()方法：

1. equals()相等的对象，hashCode()必须相等
2. hashCode()相等的对象，equals()不一定相等
3. 重写时需要考虑所有参与比较的字段

正确示例：
```

```java
public class Person {
    private String name;
    private int age;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Person person = (Person) obj;
        return age == person.age && Objects.equals(name, person.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}
```

### 3.2 TreeSet深度解析

**🎯 TreeSet的底层实现原理？**

```
底层实现：
- 基于TreeMap实现（红黑树）
- 元素作为TreeMap的key
- 利用红黑树的特性保证有序

排序机制：
1. 自然排序：元素实现Comparable接口
2. 定制排序：构造时传入Comparator

核心特性：
- 有序存储（升序）
- 不允许重复元素
- 不允许null值
- 线程不安全
- 查找、插入、删除：O(log n)
```

**使用示例：**

```java
// 自然排序
Set<Integer> treeSet1 = new TreeSet<>();
treeSet1.add(3);
treeSet1.add(1);
treeSet1.add(2);
// 输出：[1, 2, 3]

// 定制排序
Set<String> treeSet2 = new TreeSet<>((s1, s2) -> s2.compareTo(s1));
treeSet2.add("b");
treeSet2.add("a");
treeSet2.add("c");
// 输出：[c, b, a]
```

### 3.3 LinkedHashSet深度解析

**🎯 LinkedHashSet的特点和使用场景？**

```
底层实现：
- 继承HashSet，基于LinkedHashMap实现
- 在HashSet基础上维护了插入顺序

核心特性：
- 保持插入顺序
- 不允许重复元素
- 允许一个null值
- 性能略低于HashSet（维护链表开销）

使用场景：
- 需要去重且保持插入顺序
- 遍历顺序要求可预测
```

**三种Set对比：**

| **特性**       | **HashSet** | **LinkedHashSet** | **TreeSet**     |
| -------------- | ----------- | ----------------- | --------------- |
| **底层实现**   | HashMap     | LinkedHashMap     | TreeMap(红黑树) |
| **是否有序**   | 无序        | 插入顺序          | 自然/定制排序   |
| **允许null**   | 是          | 是                | 否              |
| **时间复杂度** | O(1)        | O(1)              | O(log n)        |
| **使用场景**   | 快速去重    | 去重+保序         | 排序去重        |

---

## 🗂️ 四、Map接口实现

### 4.1 HashMap基础问题

**🎯 HashMap中key和value可以为null吗？允许几个为null呀？**

1. **键（Key）可以为`null`**：`HashMap`允许一个键为`null`。当使用`null`作为键时，这个键总是被存储在`HashMap`的第0个桶（bucket）中。
2. **值（Value）可以为`null`**：`HashMap`同样允许值为`null`。你可以将任何键映射为`null`值。
3. **允许的`null`数量**：在`HashMap`中，**只有一个键可以是`null`**。因为`HashMap`内部使用键的`hashCode()`来确定键值对的存储位置，而`null`的`hashCode()`值为0。
4. **对性能的影响**：虽然`HashMap`允许键或值为`null`，但频繁使用`null`键可能会影响性能。

**🎯 HashMap的Key需要重写hashCode()和equals()吗？**

**1. HashMap 的存储逻辑**

- **put(K,V)** 时：
  1. 先调用 `key.hashCode()` 计算哈希值，决定存放在哪个 **桶（bucket）**。
  2. 如果桶里已有元素，会调用 `equals()` 比较，判断是否是同一个 key（更新 value）还是哈希冲突（拉链/红黑树存储）。
- **get(K)** 时：
  1. 先算出 `key.hashCode()` 定位到桶。
  2. 再用 `equals()` 在桶里逐个比对，找到目标值。

**2. 为什么要重写？**

如果不重写 `hashCode()` 和 `equals()` 方法，默认实现会使用对象的内存地址来计算哈希码和比较对象。这将导致逻辑上相等的对象（例如内容相同的两个实例）具有不同的哈希码，无法正确存储和查找。

👉 结果就是：**两个"内容相同"的 key 会被认为是不同的 key**，导致存取不一致。

**正确做法**：

```java
public class Person {
    private String name;
    private int age;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Person person = (Person) obj;
        return age == person.age && Objects.equals(name, person.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}
```

**必须遵循的规则**：

1. equals()相等的对象，hashCode()必须相等
2. hashCode()相等的对象，equals()不一定相等
3. 重写时需要考虑所有参与比较的字段

### 4.2 HashMap深度解析

**🎯 HashMap的底层实现原理？（重点）**

```
JDK 1.8之前：数组 + 链表
JDK 1.8之后：数组 + 链表 + 红黑树

核心结构：
- Node数组（哈希桶）
- 链表（解决hash冲突）
- 红黑树（链表长度>8时转换，提升查询效率）

关键参数：
- 默认初始容量：16
- 默认负载因子：0.75
- 树化阈值：8
- 反树化阈值：6
```

**put操作流程：**

```java
1. 计算key的hash值
2. 根据hash值计算数组索引：(n-1) & hash
3. 如果位置为空，直接创建节点
4. 如果位置有元素：
   - key相等，覆盖value
   - key不等，添加到链表尾部
   - 链表长度>8且数组长度>=64，转为红黑树
5. 元素数量超过阈值，触发扩容
```

**🎯 HashMap的扩容机制？**

```
扩容时机：
- 元素数量 > 容量 * 负载因子（默认16 * 0.75 = 12）

扩容过程：
1. 容量扩大为原来的2倍
2. 重新计算所有元素的位置
3. 元素要么在原位置，要么在原位置+原容量

JDK 1.8优化：
- 使用高低位链表优化rehash
- 避免了链表倒置问题
```

**扩容优化代码：**

```java
// JDK 1.8 扩容优化
Node<K,V> loHead = null, loTail = null; // 低位链表
Node<K,V> hiHead = null, hiTail = null; // 高位链表

do {
    next = e.next;
    if ((e.hash & oldCap) == 0) {
        // 原位置
        if (loTail == null) loHead = e;
        else loTail.next = e;
        loTail = e;
    } else {
        // 原位置 + oldCap
        if (hiTail == null) hiHead = e;
        else hiTail.next = e;
        hiTail = e;
    }
} while ((e = next) != null);
```

**🎯 HashMap为什么线程不安全？**

```
线程不安全的表现：
1. 数据丢失：多线程put时可能覆盖
2. 死循环：JDK 1.7扩容时链表可能形成环
3. 数据不一致：get时可能获取到不完整的数据

JDK 1.7死循环原因：
- 扩容时采用头插法
- 多线程环境下可能形成循环链表
- CPU使用率飙升至100%

JDK 1.8改进：
- 采用尾插法
- 避免了死循环问题
- 但仍然存在数据丢失问题
```

**解决方案：**

```java
// 1. Hashtable（性能差）
Map<String, String> map1 = new Hashtable<>();

// 2. Collections.synchronizedMap（性能差）
Map<String, String> map2 = Collections.synchronizedMap(new HashMap<>());

// 3. ConcurrentHashMap（推荐）
Map<String, String> map3 = new ConcurrentHashMap<>();
```

**🎯 HashMap的长度为什么是2的幂次方？**

`HashMap` 中的数组（通常称为"桶"数组）长度设计为2的幂次方有几个原因：

1. **快速取模运算**：HashMap 中桶数组的大小 length 总是 2 的幂，此时，`h & (table.length -1)` 等价于对 length 取模 `h%length`。但取模的计算效率没有位运算高，所以这是一个优化。

2. **减少哈希碰撞**：使用2的幂次方作为数组长度可以使得元素在数组中分布更加均匀，这减少了哈希碰撞的可能性。

3. **动态扩容**：`HashMap`在需要扩容时，通常会增加到当前容量的两倍。如果当前容量已经是2的幂次方，增加到两倍后仍然是2的幂次方。

4. **避免数据迁移**：当数组长度为2的幂次方时，当进行扩容和重新哈希时，可以通过简单的位运算来确定元素在新数组中的位置，而不需要重新计算哈希码。

**🎯 为什么JDK1.8中HashMap从头插入改成尾插入？**

在Java 8中，`HashMap`的插入策略从头部插入（head insertion）改为尾部插入（tail insertion），主要原因：

1. **避免死循环**：JDK1.7中扩容时，每个元素的rehash之后，都会插入到新数组对应索引的链表头，所以这就导致原链表顺序为A->B->C，扩容之后，rehash之后的链表可能为C->B->A，元素的顺序发生了变化。在并发场景下，**扩容时**可能会出现循环链表的情况。

2. **保持顺序**：而JDK1.8从头插入改成尾插入，元素的顺序不变，避免出现循环链表的情况。

3. **提高并发安全性**：尾插入策略在并发环境下更加稳定，虽然HashMap仍然不是线程安全的，但减少了一些潜在问题。

**🎯 HashMap：JDK1.7 VS JDK1.8主要区别？**

| **不同**           | **JDK 1.7**                                                  | **JDK 1.8**                                                  |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **存储结构**       | 数组 + 链表                                                  | 数组 + 链表 + 红黑树                                         |
| **初始化方式**     | 单独函数：inflateTable()                                     | 直接集成到了扩容函数resize()中                               |
| **hash值计算**     | 扰动处理 = 9次扰动 = 4次位运算 + 5次异或运算                 | 扰动处理 = 2次扰动 = 1次位运算 + 1次异或运算                 |
| **存放数据规则**   | 无冲突时，存放数组；冲突时，存放链表                         | 无冲突时，存放数组；冲突 & 链表长度 < 8：存放单链表；冲突 & 链表长度 > 8：树化并存放红黑树 |
| **插入数据方式**   | 头插法（先将原位置的数据移到后1位，再插入数据到该位置）      | 尾插法（直接插入到链表尾部/红黑树）                          |
| **扩容后位置计算** | 全部按照原来方法进行计算（即hashCode -> 扰动函数 -> (h&length-1)） | 按照扩容后的规律计算（即扩容后的位置=原位置 or 原位置 + 旧容量） |

### 4.2 ConcurrentHashMap深度解析

**🎯 ConcurrentHashMap的实现原理？（重点）**

```
JDK 1.7实现（分段锁）：
- Segment数组 + HashEntry数组
- 每个Segment继承ReentrantLock
- 默认16个Segment，最大并发度16
- 锁粒度：Segment级别

JDK 1.8实现（CAS + synchronized）：
- Node数组 + 链表/红黑树
- 取消Segment概念
- 使用CAS + synchronized实现
- 锁粒度：Node级别（更细粒度）
```

**JDK 1.8 put操作：**

```java
final V putVal(K key, V value, boolean onlyIfAbsent) {
    // 1. 计算hash值
    int hash = spread(key.hashCode());
    
    for (Node<K,V>[] tab = table;;) {
        // 2. 如果数组为空，初始化
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();
        // 3. 如果位置为空，CAS插入
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value)))
                break;
        }
        // 4. 如果正在扩容，帮助扩容
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        // 5. 否则synchronized锁住头节点
        else {
            synchronized (f) {
                // 链表或红黑树插入逻辑
            }
        }
    }
}
```

**🎯 ConcurrentHashMap的优势？**

| **特性**   | **Hashtable**      | **Collections.synchronizedMap** | **ConcurrentHashMap** |
| ---------- | ------------------ | ------------------------------- | --------------------- |
| **锁机制** | 方法级synchronized | 方法级synchronized              | 分段锁/节点锁         |
| **并发度** | 1                  | 1                               | 高                    |
| **读操作** | 加锁               | 加锁                            | 无锁(volatile)        |
| **迭代器** | fail-fast          | fail-fast                       | 弱一致性              |
| **null值** | 不允许             | 不允许                          | 不允许                |

**性能优势：**

- 读操作无锁，写操作细粒度锁
- 支持高并发读写
- 迭代过程不阻塞其他操作

### 4.3 其他Map实现

**🎯 TreeMap的特点和使用场景？**

```
底层实现：红黑树（自平衡二叉搜索树）

核心特性：
- 按key排序存储
- 不允许key为null
- 线程不安全
- 查找、插入、删除：O(log n)

排序机制：
1. key实现Comparable接口
2. 构造时传入Comparator

使用场景：
- 需要按key排序的Map
- 范围查询：subMap、headMap、tailMap
```

**🎯 LinkedHashMap的特点？**

```
底层实现：HashMap + 双向链表

核心特性：
- 保持插入顺序或访问顺序
- 继承HashMap，性能略低
- 支持LRU缓存实现

构造参数：
- accessOrder=false：插入顺序（默认）
- accessOrder=true：访问顺序

LRU缓存实现：
```

```java
public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // accessOrder=true
        this.capacity = capacity;
    }
    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```

---

## 🔒 五、线程安全集合

### 5.1 并发集合概述

**🎯 同步容器和并发容器的区别？**

| **特性**     | **同步容器**              | **并发容器**                            |
| ------------ | ------------------------- | --------------------------------------- |
| **实现方式** | Collections.synchronized* | java.util.concurrent                    |
| **锁机制**   | 对象级synchronized        | 分段锁、CAS、Lock                       |
| **性能**     | 低                        | 高                                      |
| **迭代器**   | fail-fast需要外部同步     | 弱一致性或快照                          |
| **代表**     | Vector、Hashtable         | ConcurrentHashMap、CopyOnWriteArrayList |

**同步容器问题：**

```java
Vector<Integer> vector = new Vector<>();
// 虽然add和get是同步的，但组合操作不是原子的
if (vector.size() > 0) {
    vector.get(0); // 可能抛出IndexOutOfBoundsException
}
```

### 5.2 CopyOnWriteArrayList详解

**🎯 CopyOnWriteArrayList的实现原理？**

```
核心思想：写时复制（Copy-On-Write）

实现机制：
- 读操作不加锁，直接读取
- 写操作加锁，复制整个数组，在新数组上修改
- 修改完成后，更新引用指向新数组

适用场景：
- 读多写少的场景
- 实时性要求不高的场景
- 数据量不大的场景
```

**源码分析：**

```java
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        Object[] newElements = Arrays.copyOf(elements, len + 1); // 复制数组
        newElements[len] = e;
        setArray(newElements); // 原子更新引用
        return true;
    } finally {
        lock.unlock();
    }
}

public E get(int index) {
    return get(getArray(), index); // 无锁读取
}
```

**🎯 CopyOnWriteArrayList vs Collections.synchronizedList？**

| **特性**     | **CopyOnWriteArrayList** | **Collections.synchronizedList** |
| ------------ | ------------------------ | -------------------------------- |
| **读性能**   | 高（无锁）               | 低（需要同步）                   |
| **写性能**   | 低（复制数组）           | 中等                             |
| **内存占用** | 高（可能有多个副本）     | 正常                             |
| **实时性**   | 弱一致性                 | 强一致性                         |
| **迭代安全** | 天然安全                 | 需要外部同步                     |

---

## 🔧 五、高级特性与安全机制

### 5.1 快速失败与安全失败

**🎯 Java快速失败（fail-fast）和安全失败（fail-safe）区别？**

**1. Fail-Fast（快速失败）**

- **定义**：在迭代集合时，如果发现集合被结构性修改（add/remove 等），会立刻抛出 `ConcurrentModificationException`。
- **原因**：迭代器内部维护了一个 **modCount（修改次数）**，每次迭代会校验是否和期望值一致，如果不一致就认为出现并发修改，直接报错。
- **典型集合**：`ArrayList`、`HashMap` 等。
- **特点**：
  - 检测到并发修改 → **立即失败**，避免返回错误结果。
  - 不能在遍历过程中修改集合，除非用迭代器自带的 `remove()`。

**2. Fail-Safe（安全失败）**

- **定义**：在迭代时允许集合被修改，修改不会影响正在进行的迭代。
- **原因**：迭代器基于 **集合的副本（快照）** 来遍历，而不是直接访问原集合。
- **典型集合**：`CopyOnWriteArrayList`、`ConcurrentHashMap` 等并发集合。
- **特点**：
  - 遍历时不抛异常。
  - 修改不会影响当前遍历结果，但可能导致数据 **不可见**（因为遍历的是副本）。
  - 内存开销较大（需要拷贝或额外的数据结构支持）。

**🎯 如何避免fail-fast？**

- **在单线程的遍历过程中**，如果要进行 remove 操作，可以调用迭代器 ListIterator 的 remove 方法而不是集合类的 remove方法。

```java
public void remove() {
    if (lastRet < 0)
        throw new IllegalStateException();
    checkForComodification();

    try {
        SubList.this.remove(lastRet);
        cursor = lastRet;
        lastRet = -1;
        expectedModCount = ArrayList.this.modCount;  // 关键：更新期望的modCount
    } catch (IndexOutOfBoundsException ex) {
        throw new ConcurrentModificationException();
    }
}
```

- **使用并发包**(`java.util.concurrent`)中的类来代替 ArrayList 和 hashMap
  - CopyOnWriterArrayList 代替 ArrayList
  - ConcurrentHashMap 代替 HashMap

### 5.2 Iterator详解

**🎯 Iterator 和 Enumeration 区别？**

在 Java 集合中，我们通常都通过 "Iterator(迭代器)" 或 "Enumeration(枚举类)" 去遍历集合。

```java
public interface Enumeration<E> {
    boolean hasMoreElements();
    E nextElement();
}

public interface Iterator<E> {
    boolean hasNext();
    E next();
    void remove();
}
```

**主要区别**：

- **函数接口不同**：Enumeration**只有2个函数接口。**通过Enumeration，我们只能读取集合的数据，而不能对数据进行修改。Iterator**只有3个函数接口。**Iterator除了能读取集合的数据之外，也能数据进行删除操作。

- **Iterator支持 fail-fast机制，而Enumeration不支持**：Enumeration 是 JDK 1.0 添加的接口。使用到它的函数包括 Vector、Hashtable 等类，这些类都是 JDK 1.0中加入的，Enumeration 存在的目的就是为它们提供遍历接口。而 Iterator 是 JDK 1.2 才添加的接口，它也是为了 HashMap、ArrayList 等集合提供遍历接口。Iterator 是支持 fail-fast 机制的。

**🎯 Iterater 和 ListIterator 之间有什么区别？**

- 我们可以使用 Iterator来遍历 Set 和 List 集合，而 ListIterator 只能遍历List
- ListIterator有add方法，可以向List中添加对象，而Iterator不能
- ListIterator和Iterator都有hasNext()和next()方法，可以实现顺序向后遍历，但是ListIterator有hasPrevious()和previous()方法，可以实现逆向（顺序向前）遍历。Iterator不可以
- ListIterator可以定位当前索引的位置，nextIndex()和previousIndex()可以实现。Iterator没有此功能
- 都可实现删除操作，但是 ListIterator可以实现对象的修改，set()方法可以实现。Iterator仅能遍历，不能修改

---

## ⚡ 六、性能与优化

### 6.1 时间复杂度分析

**🎯 各种集合操作的时间复杂度？**

| **集合类型**        | **get/contains** | **add**  | **remove** | **特点**   |
| ------------------- | ---------------- | -------- | ---------- | ---------- |
| **ArrayList**       | O(1)/O(n)        | O(1)     | O(n)       | 随机访问快 |
| **LinkedList**      | O(n)             | O(1)     | O(1)       | 插入删除快 |
| **HashSet/HashMap** | O(1)             | O(1)     | O(1)       | 哈希表     |
| **TreeSet/TreeMap** | O(log n)         | O(log n) | O(log n)   | 有序结构   |
| **ArrayDeque**      | O(1)             | O(1)     | O(1)       | 双端队列   |

> [!CAUTION]
>
> - ArrayList add可能触发扩容，最坏O(n)
> - LinkedList remove需要先查找位置
> - HashMap最坏情况O(n)，平均O(1)
> - ArrayDeque两端操作



### 6.2 最佳实践

**🎯 集合使用的最佳实践？**

```
1. 容量预估：
   - ArrayList: new ArrayList<>(expectedSize)
   - HashMap: new HashMap<>(expectedSize / 0.75 + 1)

2. 选择合适的集合：
   - 频繁随机访问 -> ArrayList
   - 频繁插入删除 -> LinkedList
   - 去重 -> Set
   - 排序 -> TreeSet/TreeMap
   - 高并发 -> ConcurrentHashMap

3. 避免装箱拆箱：
   - 使用primitive集合：TIntArrayList、TLongHashSet

4. 迭代器使用：
   - foreach优于传统for循环
   - 删除元素使用Iterator.remove()

5. 线程安全：
   - 单线程：ArrayList、HashMap
   - 多线程读多写少：CopyOnWriteArrayList
   - 多线程高并发：ConcurrentHashMap
```

**性能优化示例：**

```java
// 1. 容量预估
List<String> list = new ArrayList<>(1000); // 避免扩容

// 2. 批量操作
list.addAll(Arrays.asList("a", "b", "c")); // 一次性添加

// 3. 安全删除
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    if (shouldRemove(it.next())) {
        it.remove(); // 使用迭代器删除
    }
}

// 4. HashMap优化
Map<String, String> map = new HashMap<>(size / 0.75 + 1);
```

### 6.3 其他重要面试题

**🎯 HashMap 和 Hashtable 的区别？**

| **特性**     | **HashMap**          | **Hashtable**      | **ConcurrentHashMap**    |
| ------------ | -------------------- | ------------------ | ------------------------ |
| **线程安全** | 否                   | 是（synchronized） | 是（CAS + synchronized） |
| **效率**     | 高                   | 低（全表锁）       | 高（分段锁/桶锁）        |
| **null值**   | key和value都允许null | 都不允许null       | 都不允许null             |
| **初始容量** | 16                   | 11                 | 16                       |
| **扩容方式** | 2倍                  | 2n+1               | 2倍                      |
| **出现版本** | JDK 1.2              | JDK 1.0            | JDK 1.5                  |
| **迭代器**   | fail-fast            | fail-fast          | 弱一致性                 |

**详细对比**：

1. **线程安全**：Hashtable 内部的方法基本都经过 `synchronized` 修饰，HashMap 是非线程安全的。
2. **初始容量和扩容**：
   - 创建时如果不指定容量，Hashtable 默认为11，HashMap默认为16
   - Hashtable 扩容：容量变为原来的2n+1；HashMap扩容：容量变为原来的2倍
   - HashMap 总是使用2的幂次方作为哈希表的大小

**🎯 Comparable 和 Comparator 接口有何区别？**

Java 中对集合对象或者数组对象排序，有两种实现方式：

**1. Comparable接口（内部比较器）**

- 位于 `java.lang` 包下，只有一个方法 `compareTo()`
- 实现了 Comparable 接口的类可以进行自然排序
- 实现了该接口的 List 或数组可以使用 `Collections.sort()` 或 `Arrays.sort()` 排序

```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

**2. Comparator接口（外部比较器）**

- 位于 `java.util` 包下，主要方法是 `compare()`
- 可以在类外部定义比较规则，不需要修改类本身

```java
public interface Comparator<T> {
    public int compare(T lhs, T rhs);
    public boolean equals(Object object);
}
```

**使用场景对比**：

| **特性**     | **Comparable**         | **Comparator**         |
| ------------ | ---------------------- | ---------------------- |
| **实现位置** | 类内部                 | 类外部                 |
| **包位置**   | java.lang              | java.util              |
| **方法**     | compareTo()            | compare()              |
| **使用场景** | 自然排序，一种排序规则 | 定制排序，多种排序规则 |
| **修改原类** | 需要                   | 不需要                 |

**🎯 HashSet 底层实现原理？**

HashSet 的底层其实就是 HashMap，只不过 **HashSet 是实现了 Set 接口并且把数据作为 K 值，而 V 值一直使用一个相同的虚值来保存**。

```java
public class HashSet<E> {
    private transient HashMap<E,Object> map;
    private static final Object PRESENT = new Object();
    
    public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }
}
```

**核心特点**：

- HashMap的 K 值本身就不允许重复
- 如果 K/V 相同时，会用新的 V 覆盖掉旧的 V，然后返回旧的 V
- 利用HashMap的key唯一性保证Set的不重复特性

---

## 🎯 高频面试题汇总

### 核心必考题（⭐⭐⭐）

1. **说说常用的集合有哪些？**
2. **HashMap底层实现原理和JDK1.8优化**
3. **HashMap中key需要重写hashCode()和equals()吗？**
4. **HashMap为什么线程不安全？如何解决？**
5. **ArrayList vs LinkedList使用场景和性能对比**
6. **ConcurrentHashMap实现原理和JDK版本差异**
7. **HashSet如何保证元素不重复？**

### 进阶深入题（⭐⭐）

8. **HashMap的长度为什么是2的幂次方？**
9. **HashMap扩容机制和负载因子的作用**
10. **为什么JDK1.8中HashMap从头插入改成尾插入？**
11. **红黑树转换条件和意义**
12. **CopyOnWriteArrayList适用场景和缺点**
13. **HashMap vs Hashtable vs ConcurrentHashMap区别**
14. **快速失败(fail-fast)和安全失败(fail-safe)机制**
15. **LinkedHashMap实现LRU缓存**

### 应用实践题（⭐）

16. **如何选择合适的集合类型？**
17. **集合性能优化的方法**
18. **多线程环境下集合的使用注意事项**
19. **自定义对象作为HashMap key的注意事项**
20. **集合遍历和删除的最佳实践**
21. **Iterator vs Enumeration vs ListIterator区别**
22. **Comparable vs Comparator区别和使用场景**

---

## 📝 面试话术模板

### 回答框架

```
1. 概念定义（30秒）
   - 简要说明是什么

2. 核心原理（60秒）
   - 底层实现机制
   - 关键数据结构

3. 特性分析（30秒）
   - 优缺点对比
   - 时间复杂度

4. 使用场景（30秒）
   - 什么情况下使用
   - 注意事项

5. 深入扩展（可选）
   - 源码细节
   - 性能优化
   - 最佳实践
```

### 关键话术

- **HashMap原理**："HashMap底层基于数组+链表+红黑树实现，JDK1.8进行了重要优化，当链表长度大于8时转换为红黑树..."

- **线程安全**："HashMap线程不安全主要表现在数据丢失和死循环，解决方案有使用ConcurrentHashMap或Collections.synchronizedMap..."

- **性能对比**："ArrayList和LinkedList各有优势，ArrayList适合随机访问，LinkedList适合频繁插入删除，选择依据主要是操作特点..."

- **并发集合**："ConcurrentHashMap通过分段锁(JDK1.7)和CAS+synchronized(JDK1.8)实现高并发，相比Hashtable性能更好..."

- **扩容机制**："HashMap默认初始容量16，负载因子0.75，扩容时容量翻倍，JDK1.8优化了扩容算法..."

- **数据结构选择**："根据业务场景选择：需要去重用Set，需要排序用TreeSet，高并发用ConcurrentHashMap..."



### 面试准备清单

**📋 必备图表**

- [ ] 画出HashMap数据结构图（数组+链表+红黑树）
- [ ] 准备ConcurrentHashMap JDK版本对比表
- [ ] 总结各种集合的使用场景表格
- [ ] 整理集合类继承关系图

**💻 实战练习**

- [ ] 手写LRU缓存（基于LinkedHashMap）
- [ ] 实现线程安全的ArrayList
- [ ] 分析HashMap死循环问题（JDK1.7）
- [ ] 性能测试对比不同集合类型

**🎯 核心算法**

- [ ] HashMap的hash函数实现
- [ ] HashMap的put和get流程
- [ ] ConcurrentHashMap的分段锁原理
- [ ] ArrayList的扩容机制

**📚 推荐资源**

- 《Java核心技术》第九章：集合
- 《Java并发编程实战》：并发集合部分
- HashMap源码分析文章
- ConcurrentHashMap源码解读

---

## 🎉 总结

> **Java集合框架面试成功秘诀**
>
> 1. **掌握核心原理**：HashMap、ConcurrentHashMap、ArrayList是重中之重
> 2. **理解设计思想**：为什么这样设计？解决了什么问题？
> 3. **关注版本差异**：JDK1.7 vs JDK1.8的重要变化
> 4. **结合实际应用**：什么场景用什么集合？性能如何优化？
> 5. **准备代码示例**：能手写关键算法，能分析源码
>
> **记住：集合框架不仅是数据结构，更是解决实际问题的工具。深入理解原理，才能在面试中游刃有余，在实际开发中选择最优方案。**

