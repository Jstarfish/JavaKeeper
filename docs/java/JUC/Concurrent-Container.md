# Javaer 对集合类要有的“大局观”——同步容器和并发容器总结版

容器这部分，工作或是面试遇到的太多了，因为它牵扯的东西也比较多，要放数据，肯定会有数据结构，数据结构又会牵扯到算法，再或者牵扯到高并发，又会有各种安全策略，所以写这篇一，不是为了巩固各种容器的实现细节，而是在心里有个“大局观”，全方位掌握容器。

不扯了，开始唠~

Java 的集合容器框架中，主要有四大类别：List、Set、Queue、Map。

为了在心里有个“大局观”，我们贴张图：

![图源：pierrchen.blogspot.com](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200910141411.png)

- 在语言架构上，集合类分为了 Map 和 Collection 两个大的类别。List、Set、Queue 都继承于 Collection。
- 左上角的那一块灰色里面的四个类（Dictionary、HashTable、Vector、Stack）都是 JDK 遗留下的类，太老了，已经没人使用，而且都有了对应的取代类
- 图片分上下两部分，最上边粉红色部分是集合类所有接口关系图，绿色部分是他们的主要实现类，也就是我们真正使用的常用集合类
- 下半部分中都是`java.util.concurrent` 包下内容，也就是我们常用的并发集合包。同样粉色部分是接口，绿色是其实现类。



总体回顾一番后，我们知道了上半部分的 ArrayList、LinkedList、HashMap 这些容器都是非线程安全的，但是 Java 也是并发编程的一把利器呀，如果有多个线程并发地访问这些容器时，就会出现问题。因此，在编写程序时，在多线程环境下必须要求程序员手动地在任何访问到这些容器的地方进行同步处理，这样导致在使用这些容器的时候非常地不方便。

所以，Java 先提供了同步容器供用户使用。 

```java

```

其实以上三个容器都是Collections通过代理模式对原本的操作加上了synchronized同步。而synchronized的同步粒度太大，导致在多线程处理的效率很低。所以在 JDK1.5 的时候推出了并发包下的并发容器，来应对多线程下容器处理效率低的问题。



**同步容器可以简单地理解为通过synchronized来实现同步的容器**，比如 Vector、Hashtable 以及SynchronizedList、SynchronizedMap 等容器。



## 同步容器

- Vector
- Stack
- HashTable
- Collections.synchronizedXXX 方法生成

#### 1. Vector

Vector 和 ArrayList 一样都实现了 List 接口，其对于数组的各种操作和 ArrayList 一样，只是 Vertor 在可能出现线程不安全的所有方法都用 synchronized 进行了修饰。

#### 2. Stack

Stack 是 Vertor 的子类，Stack 实现的是先进后出的栈。在出栈入栈等操作都进行了 synchronized 修饰。

#### 3. HashTable

HashTable 实现了 Map 接口，它实现的功能和 HashMap 基本一致（HashTable 不可存 null，而 HashMap 的键和值都可以存 null）。区别也是 HashTable 使用了 synchronized 修饰了对外方法。

#### 4. Collections提供的同步集合类

```java
List list = Collections.synchronizedList(new ArrayList());

Set set = Collections.synchronizedSet(new HashSet());

Map map = Collections.synchronizedMap(new HashMap());
```

可以通过查看 Vector，Hashtable 等这些同步容器的实现代码，可以看到这些容器实现线程安全的方式就是将它们的状态封装起来，**并在需要同步的方法上加上关键字synchronized**。

这样做的代价是削弱了并发性，当多个线程共同竞争容器级的锁时，吞吐量就会降低。

因此为了解决同步容器的性能问题，Java 5.0 提供了多种并发容器来改进同步容器的性能。



> 终于进入主题，下面内容才是这篇文章的主角

## 并发容器

常见并发容器

- ConcurrentHashMap：并发版 HashMap
- CopyOnWriteArrayList：并发版 ArrayList
- CopyOnWriteArraySet：并发 Set
- ConcurrentLinkedQueue：并发队列(基于链表)
- ConcurrentLinkedDeque：并发队列(基于双向链表)
- ConcurrentSkipListMap：基于跳表的并发 Map
- ConcurrentSkipListSet：基于跳表的并发 Set
- SynchronousQueue：读写成对的队列
- DelayQueue：延时队列

7个阻塞队列（这个之前的文章详细介绍过 [「阻塞队列」手写生产者消费者、线程池原理面试题真正的答案](https://mp.weixin.qq.com/s/SqFmOV7lCmtJpF1dcYiF-w)）：

- ArrayBlockingQueue ：一个由数组结构组成的有界阻塞队列
- LinkedBlockingQueue ：一个由链表结构组成的有界阻塞队列
- PriorityBlockingQueue ：一个支持优先级排序的无界阻塞队列
- DelayQueue：一个使用优先级队列实现的无界阻塞队列
- SynchronousQueue：一个不存储元素的阻塞队列
- LinkedTransferQueue：一个由链表结构组成的无界阻塞队列（实现了继承于 BlockingQueue的 TransferQueue）
- LinkedBlockingDeque：一个由链表结构组成的双向阻塞队列



### ConcurrentHashMap

并发版的 HashMap，不管是写代码还是面试，这都是最常见的并发容器之一。 JDK 7 和 JDK 8 在实现方式上有一些不同，在 JDK 7 版本中，ConcurrentHashMap 的数据结构是由一个 Segment 数组和多个 HashEntry 组成。Segment 数组的意义就是将一个大的 table 分割成多个小的 table 来进行加锁。每一个 Segment 元素存储的是 HashEntry 数组+链表，这个和 HashMap 的数据存储结构一样。一句话就是 JDK7 采用分段锁来降低锁的竞争。

![img](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200910104046.jpg)

JDK8 弃用了段锁，改为采用**数组+链表+红黑树**的数据形式，虽然也是采用了**锁分离**的思想，只是锁住的是一个Node，**并发控制使用 synchronized 和 CAS 来操作**，进一步优化

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200910104629.jpg)



> `Copy-On-Write`，顾名思义，在计算机中就是当你想要对一块内存进行修改时，我们不在原有内存块中进行`写`操作，而是将内存拷贝一份，在新的内存中进行`写`操作，`写`完之后呢，就将指向原来内存指针指向新的内存，原来的内存就可以被回收掉嘛！

> 从 JDK1.5 开始 Java 并发包里提供了两个使用 `CopyOnWrite` 机制实现的并发容器,它们是`CopyOnWriteArrayList` 和 `CopyOnWriteArraySet`。

### CopyOnWriteArrayList

并发版 ArrayList，底层结构也是数组，其实现机制是在对容器有写入操作时，copy 出一份副本数组，完成操作后将副本数组引用赋值给容器。底层是通过 ReentrantLock 来保证同步的。

适用场景：

- 集合中数据不是特别多，因为涉及到写时复制
- 读多写少的场景，因为读操作不加锁，写（增、删、改）操作加锁

局限性：通过牺牲容器的一致性来换取容器的高并发效率（在 copy 期间读到的是旧数据）。所以不能在需要强一致性的场景下使用。

看看源码感受下：

```java
public class CopyOnWriteArrayList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable {
    
    final transient ReentrantLock lock = new ReentrantLock();
    private transient volatile Object[] array;
    
    // 添加元素，有锁
    public boolean add(E e) {
        final ReentrantLock lock = this.lock;
        //1. 使用Lock,保证写线程在同一时刻只有一个
        lock.lock();
        try {
            //2. 获取旧数组引用
            Object[] elements = getArray(); 
            int len = elements.length;
            //3. 创建新的数组，并将旧数组的数据复制到新数组中，比老的大一个空间
            Object[] newElements = Arrays.copyOf(elements, len + 1); 
            //4. 要添加的元素放进新数组
            newElements[len] = e;
            //5. 将旧数组引用指向新的数组（用新数组替换原来的数组）
            setArray(newElements);
            return true;
        } finally {
            lock.unlock(); // 解锁
        }
    }
    
    // 读元素，不加锁，因此可能读取到旧数据
    private E get(Object[] a, int index) {
        return (E) a[index];
    }
}
```



### CopyOnWriteArraySet

并发版本的 Set，看到这个名字的时候我就有个疑惑，我们用 Set  的实现类一般是 HashSet 或 TreeSet，没见过ArraySet，为什么不叫 CopyOnWriteHashSet 呢？

> 我敢肯定，这玩意和 CopyOnWriteArrayList 有关系，上部分源码

```java
public class CopyOnWriteArraySet<E> extends AbstractSet<E>
        implements java.io.Serializable {

    private final CopyOnWriteArrayList<E> al;
    
    public boolean add(E e) {
        return al.addIfAbsent(e);
    }

    public void forEach(Consumer<? super E> action) {
        al.forEach(action);
    }
```

可以看到，类内部以后一个成员变量 CopyOnWriteArrayList，所有相关操作都是围绕这个成员变量操作的，所以它是基于 CopyOnWriteArrayList 实现的，也就是说底层是一个动态数组，而不是散列表（HashMap）

和 CopyOnWriteArrayList 类似，它的适用场景：

- Set 大小通常保持很小
- 只读操作远多于可变操作（可变操作（`add()`、`set()`和 `remove()`等等的开销很大）



> 下面再看两个基于跳表的并发容器，SkipList 即跳表，跳表是一种空间换时间的数据结构，通过冗余数据，将链表一层一层索引，达到类似二分查找的效果，其数据元素默认按照key值升序，天然有序。运用的场景特别多，Redis 中的 Zset 就是跳表实现的
>
> ![](https://upload.wikimedia.org/wikipedia/commons/8/86/Skip_list.svg)

### ConcurrentSkipListMap 

ConcurrentSkipListMap 是一个并发安全, 基于 skip list 实现有序存储的 Map。

它与 TreeMap 一样，实现了对有序队列的快速查找，但同时，它还是多线程安全的。在多线程环境下，它要比加锁的TreeMap效率高。



### ConcurrentSkipListSet

有木有发现我们使用的 Set 一般都是基于 Map 的某种实现类而实现的，ConcurrentSkipListSet 也不例外，他内部维护了一个 ConcurrentNavigableMap 成员变量，可以理解为并发版的 TreeSet，只是有序且线程安全的。

```java
public class ConcurrentSkipListSet<E>
    extends AbstractSet<E>
    implements NavigableSet<E>, Cloneable, java.io.Serializable {

    private final ConcurrentNavigableMap<E,Object> m;

    public ConcurrentSkipListSet() {
        m = new ConcurrentSkipListMap<E,Object>();
    }
}
```







> 剩下的就是各种队列了，队列又分为两种，阻塞队列和非阻塞队列。
>
> 阻塞队列是如果你试图向一个 已经满了的队列中添加一个元素或者是从一个空的阻塞队列中移除一个元素，将导致消费者线程或者生产者线程阻塞，非阻塞队列是能即时返回结果（消费者），但必须自行编码解决返回为空的情况处理（以及消费重试等问题）。这两种都是线程安全的。
>
> 阻塞队列可以用一个锁（入队和出队共享一把锁）或者两个锁（入队使用一把锁，出队使用一把锁）来实现线程安全，JDK中典型的实现是`BlockingQueue`；
>
> 非阻塞队列可以用循环CAS的方式来保证数据的一致性，来达到线程安全的目的。
>
> ![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200927140845.png)

先来看下非阻塞队列

### ConcurrentLinkedQueue

ConcurrentLinkedQueue 是一个基于链表实现的无界线程安全队列，遵循队列的FIFO原则，队尾入队，队首出队。使用乐观锁（CAS）保证线程安全。



> **Deque**（double-ended queue）是一种双端队列，也就是说可以在任意一端进行“入列”，也可以在任意一端进行“出列”。
>
> 所以 Deque 其实既可以当做队列使用，也可以当做栈来使用。

### ConcurrentLinkedDeque

基于双向链表实现的并发队列，可以分别对头尾进行操作，因此除了先进先出（FIFO），也可以先进后出（FILO）。

在 JDK1.7 之前，除了 Stack 类外，并没有其它适合并发环境的“栈”数据结构。ConcurrentLinkedDeque 作为双端队列，可以当作“栈”来使用，并且高效地支持并发环境。

ConcurrentLinkedDeque 和 ConcurrentLinkedQueue 一样，采用了无锁算法，底层也是基于**自旋+CAS **的方式实现



### DelayQueue

DelayQueue 是一个无界的 BlockingQueue，我们叫做“延时队列”，用于放置实现了 Delayed 接口的对象，其中的对象只能在其到期时才能从队列中取走。这种队列是有序的，即队头对象的延迟到期时间最长。

比如我们的自动取消订单业务、下单成功多久发送短信、或者一些任务超时处理，都可能会用到 DelayQueue。



> 下边说阻塞队列，7 种阻塞队列的详细介绍，之前详细介绍了，他们都是 BlockingQueue 的实现类，所以这里简单回顾下。

### ArrayBlockingQueue

ArrayBlockingQueue，一个由**数组**实现的**有界**阻塞队列。该队列采用先进先出（FIFO）的原则对元素进行排序添加的。

ArrayBlockingQueue 为**有界且固定**，其大小在构造时由构造函数来决定，确认之后就不能再改变了。



### LinkedBlockingQueue

LinkedBlockingQueue 是一个用单向链表实现的有界阻塞队列。此队列的默认和最大长度为 `Integer.MAX_VALUE`。此队列按照先进先出的原则对元素进行排序。

如果不是特殊业务，LinkedBlockingQueue 使用时，切记要定义容量 `new LinkedBlockingQueue(capacity)`

，防止过度膨胀。



### LinkedBlockingDeque

LinkedBlockingDeque 是一个由链表结构组成的双向阻塞队列。

所谓双向队列指的你可以从队列的两端插入和移出元素。双端队列因为多了一个操作队列的入口，在多线程同时入队时，也就减少了一半的竞争。



### PriorityBlockingQueue

PriorityBlockingQueue 是一个支持优先级的无界阻塞队列。(虽说是无界队列，但是由于资源耗尽的话，也会OutOfMemoryError，无法添加元素)

默认情况下元素采用自然顺序升序排列。也可以自定义类实现 compareTo() 方法来指定元素排序规则，或者初始化 PriorityBlockingQueue 时，指定构造参数 Comparator 来对元素进行排序。但需要注意的是不能保证同优先级元素的顺序。PriorityBlockingQueue 是基于**最小二叉堆**实现，使用基于 CAS 实现的自旋锁来控制队列的动态扩容，保证了扩容操作不会阻塞 take 操作的执行。



### SynchronousQueue

SynchronousQueue 是一个不存储元素的阻塞队列，也即是单个元素的队列。

每一个 put 操作必须等待一个 take 操作，否则不能继续添加元素。SynchronousQueue 可以看成是一个传球手，负责把生产者线程处理的数据直接传递给消费者线程。队列本身并不存储任何元素，非常适合于传递性场景, 比如在一个线程中使用的数据，传递给另外一个线程使用，SynchronousQueue 的吞吐量高于 LinkedBlockingQueue 和 ArrayBlockingQueue。



### LinkedTransferQueue

LinkedTransferQueue 是一个由链表结构组成的无界阻塞 TransferQueue 队列。

LinkedTransferQueue采用一种预占模式。意思就是消费者线程取元素时，如果队列不为空，则直接取走数据，若队列为空，那就生成一个节点（节点元素为null）入队，然后消费者线程被等待在这个节点上，后面生产者线程入队时发现有一个元素为null的节点，生产者线程就不入队了，直接就将元素填充到该节点，并唤醒该节点等待的线程，被唤醒的消费者线程取走元素，从调用的方法返回。我们称这种节点操作为“匹配”方式。



## 总结

Java 并发容器的所有，都列出来了，现在应该对 容器 有个“大局观”了，业务中遇到适合的场景，我们就可以“对症下药”了。


