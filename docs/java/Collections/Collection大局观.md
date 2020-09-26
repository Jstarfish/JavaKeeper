> Javaer 应该对集合容器有的大局观   同步容器和并发容器总结

## Java 集合“大局观”

容器这部分，工作或是面试遇到的太多了，因为它牵扯的东西也比较多，要放数据，肯定会有数据结构，数据结构又会牵扯到算法，再或者牵扯到高并发，又会有各种安全策略，所以写这篇一，不是为了巩固各种容器的实现细节，而是在心里有个“大局观”，全方位掌握容器。

不扯了，开始唠~

Java的集合容器框架中，主要有四大类别：List、Set、Queue、Map。

为了在心里有个“大局观”，我们贴张图：

![图源：pierrchen.blogspot.com](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200910141411.png)

- 在语言架构上，集合类分为了 Map 和 Collection 两个大的类别。List、Set、Queue 都继承于 Collection。
- 左上角的那一块灰色里面的四个类（Dictionary、HashTable、Vector、Stack）都是 JDK 遗留下的类，太老了，已经没人使用，而且都有了对应的取代类
- 图片分上下两部分，最上边粉红色部分是集合类所有接口关系图，绿色部分是他们的主要实现类，也就是我们真正使用的常用集合类
- 下半部分中都是`java.util.concurrent` 包下内容，也就是我们常用的并发集合包。同样粉色部分是接口，绿色是其实现类。



总体回顾一番后，我们知道了上半部分的 ArrayList、LinkedList、HashMap 这些容器都是非线程安全的，但是 Java 也是并发编程的一把利器呀，如果有多个线程并发地访问这些容器时，就会出现问题。因此，在编写程序时，在多线程环境下必须要求程序员手动地在任何访问到这些容器的地方进行同步处理，这样导致在使用这些容器的时候非常地不方便。

所以，Java 先提供了同步容器供用户使用。 

**同步容器可以简单地理解为通过synchronized来实现同步的容器**，比如 Vector、Hashtable 以及SynchronizedList、SynchronizedMap 等容器。



### 同步容器

- Vector
- Stack
- HashTable
- Collections.synchronizedXXX 方法生成

可以通过查看 Vector，Hashtable 等这些同步容器的实现代码，可以看到这些容器实现线程安全的方式就是将它们的状态封装起来，**并在需要同步的方法上加上关键字synchronized**。

这样做的代价是削弱了并发性，当多个线程共同竞争容器级的锁时，吞吐量就会降低。

因此为了解决同步容器的性能问题，Java 5.0 提供了多种并发容器来改进同步容器的性能。



> 终于进入主题，下面内容才是这篇文章的主角

### 并发容器

常见并发容器

- ConcurrentHashMap：并发版 HashMap
- CopyOnWriteArrayList：并发版 ArrayList
- CopyOnWriteArraySet：并发 Set
- ConcurrentLinkedQueue：并发队列(基于链表)
- ConcurrentLinkedDeque：并发队列(基于双向链表)
- ConcurrentSkipListMap：基于跳表的并发Map
- ConcurrentSkipListSet：基于跳表的并发Set
- SynchronousQueue：读写成对的队列
- DelayQueue：延时队列

7个阻塞队列（这个之前的文章详细介绍过）：

- ArrayBlockingQueue ：一个由数组结构组成的有界阻塞队列
- LinkedBlockingQueue ：一个由链表结构组成的有界阻塞队列
- PriorityBlockingQueue ：一个支持优先级排序的无界阻塞队列
- DelayQueue：一个使用优先级队列实现的无界阻塞队列
- SynchronousQueue：一个不存储元素的阻塞队列
- LinkedTransferQueue：一个由链表结构组成的无界阻塞队列（实现了继承于 BlockingQueue的 TransferQueue）
- LinkedBlockingDeque：一个由链表结构组成的双向阻塞队列



### 1. ConcurrentHashMap 并发版 HashMap

最常见的并发容器之一，可以用作并发场景下的缓存。底层依然是哈希表，但在JAVA 8中有了不小的改变，而JAVA 7和JAVA 8都是用的比较多的版本，因此经常会将这两个版本的实现方式做一些比较（比如面试中）。

一个比较大的差异就是，JAVA 7中采用分段锁来减少锁的竞争，JAVA 8中放弃了分段锁，采用CAS（一种乐观锁），同时为了防止哈希冲突严重时退化成链表（冲突时会在该位置生成一个链表，哈希值相同的对象就链在一起），会在链表长度达到阈值（8）后转换成红黑树（比起链表，树的查询效率更稳定）。



### 2.CopyOnWriteArrayList 并发版ArrayList

并发版ArrayList，底层结构也是数组，和ArrayList不同之处在于：当新增和删除元素时会创建一个新的数组，在新的数组中增加或者排除指定对象，最后用新增数组替换原来的数组。

适用场景：由于读操作不加锁，写（增、删、改）操作加锁，因此适用于读多写少的场景。

局限：由于读的时候不会加锁（读的效率高，就和普通ArrayList一样），读取的当前副本，因此可能读取到脏数据。如果介意，建议不用。

看看源码感受下：

```java
public class CopyOnWriteArrayList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable {
    final transient ReentrantLock lock = new ReentrantLock();
    private transient volatile Object[] array;
    // 添加元素，有锁
    public boolean add(E e) {
        final ReentrantLock lock = this.lock;
        lock.lock(); // 修改时加锁，保证并发安全
        try {
            Object[] elements = getArray(); // 当前数组
            int len = elements.length;
            Object[] newElements = Arrays.copyOf(elements, len + 1); // 创建一个新数组，比老的大一个空间
            newElements[len] = e; // 要添加的元素放进新数组
            setArray(newElements); // 用新数组替换原来的数组
            return true;
        } finally {
            lock.unlock(); // 解锁
        }
    }
    // 读元素，不加锁，因此可能读取到旧数据
    public E get(int index) {
        return get(getArray(), index);
    }
}
```



### 3.CopyOnWriteArraySet 并发Set

基于CopyOnWriteArrayList实现（内含一个CopyOnWriteArrayList成员变量），也就是说底层是一个数组，意味着每次add都要遍历整个集合才能知道是否存在，不存在时需要插入（加锁）。

适用场景：在CopyOnWriteArrayList适用场景下加一个，集合别太大（全部遍历伤不起）。



### 4.ConcurrentLinkedQueue 并发队列(基于链表)

基于链表实现的并发队列，使用乐观锁(CAS)保证线程安全。因为数据结构是链表，所以理论上是没有队列大小限制的，也就是说添加数据一定能成功。



### 5.ConcurrentLinkedDeque 并发队列(基于双向链表)

基于双向链表实现的并发队列，可以分别对头尾进行操作，因此除了先进先出(FIFO)，也可以先进后出（FILO），当然先进后出的话应该叫它栈了。



### 6.ConcurrentSkipListMap 基于跳表的并发Map

SkipList即跳表，跳表是一种空间换时间的数据结构，通过冗余数据，将链表一层一层索引，达到类似二分查找的效果

![](https://user-gold-cdn.xitu.io/2019/8/26/16ccdc3ea400f168?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 7.ConcurrentSkipListSet 基于跳表的并发Set

类似HashSet和HashMap的关系，ConcurrentSkipListSet里面就是一个ConcurrentSkipListMap，就不细说了。



### 8.ArrayBlockingQueue 阻塞队列(基于数组)

基于数组实现的可阻塞队列，构造时必须制定数组大小，往里面放东西时如果数组满了便会阻塞直到有位置（也支持直接返回和超时等待），通过一个锁ReentrantLock保证线程安全。

用offer操作举个例子：

```java
public class ArrayBlockingQueue<E> extends AbstractQueue<E>
        implements BlockingQueue<E>, java.io.Serializable {
    /**
     * 读写共用此锁，线程间通过下面两个Condition通信
     * 这两个Condition和lock有紧密联系（就是lock的方法生成的）
     * 类似Object的wait/notify
     */
    final ReentrantLock lock;
    /** 队列不为空的信号，取数据的线程需要关注 */
    private final Condition notEmpty;
    /** 队列没满的信号，写数据的线程需要关注 */
    private final Condition notFull;
    // 一直阻塞直到有东西可以拿出来
    public E take() throws InterruptedException {
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == 0)
                notEmpty.await();
            return dequeue();
        } finally {
            lock.unlock();
        }
    }
    // 在尾部插入一个元素，队列已满时等待指定时间，如果还是不能插入则返回
    public boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException {
        checkNotNull(e);
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly(); // 锁住
        try {
            // 循环等待直到队列有空闲
            while (count == items.length) {
                if (nanos <= 0)
                    return false;// 等待超时，返回
                // 暂时放出锁，等待一段时间（可能被提前唤醒并抢到锁，所以需要循环判断条件）
                // 这段时间可能其他线程取走了元素，这样就有机会插入了
                nanos = notFull.awaitNanos(nanos);
            }
            enqueue(e);//插入一个元素
            return true;
        } finally {
            lock.unlock(); //解锁
        }
    }
```

乍一看会有点疑惑，读和写都是同一个锁，那要是空的时候正好一个读线程来了不会一直阻塞吗？

答案就在notEmpty、notFull里，这两个出自lock的小东西让锁有了类似synchronized + wait + notify的功能。



### 9.LinkedBlockingQueue 阻塞队列(基于链表)

基于链表实现的阻塞队列，想比与不阻塞的ConcurrentLinkedQueue，它多了一个容量限制，如果不设置默认为int最大值。



### 10.LinkedBlockingDeque 阻塞队列(基于双向链表)

类似LinkedBlockingQueue，但提供了双向链表特有的操作。



### 11.PriorityBlockingQueue 线程安全的优先队列

构造时可以传入一个比较器，可以看做放进去的元素会被排序，然后读取的时候按顺序消费。某些低优先级的元素可能长期无法被消费，因为不断有更高优先级的元素进来。



### 12.SynchronousQueue 数据同步交换的队列

一个虚假的队列，因为它实际上没有真正用于存储元素的空间，每个插入操作都必须有对应的取出操作，没取出时无法继续放入。

一个简单的例子感受一下：

```java
import java.util.concurrent.*;
public class Main {
    public static void main(String[] args) {
        SynchronousQueue<Integer> queue = new SynchronousQueue<>();
        new Thread(() -> {
            try {
                // 没有休息，疯狂写入
                for (int i = 0; ; i++) {
                    System.out.println("放入: " + i);
                    queue.put(i);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
        new Thread(() -> {
            try {
                // 咸鱼模式取数据
                while (true) {
                    System.out.println("取出: " + queue.take());
                    Thread.sleep((long) (Math.random() * 2000));
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
/* 输出:
放入: 0
取出: 0
放入: 1
取出: 1
放入: 2
取出: 2
放入: 3
取出: 3
*/
```

可以看到，写入的线程没有任何sleep，可以说是全力往队列放东西，而读取的线程又很不积极，读一个又sleep一会。输出的结果却是读写操作成对出现。

JAVA中一个使用场景就是Executors.newCachedThreadPool()，创建一个缓存线程池。

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(
        0, // 核心线程为0，没用的线程都被无情抛弃
        Integer.MAX_VALUE, // 最大线程数理论上是无限了，还没到这个值机器资源就被掏空了
        60L, TimeUnit.SECONDS, // 闲置线程60秒后销毁
        new SynchronousQueue<Runnable>()); // offer时如果没有空闲线程取出任务，则会失败，线程池就会新建一个线程
}
```



### 13.LinkedTransferQueue 基于链表的数据交换队列

实现了接口TransferQueue，通过transfer方法放入元素时，如果发现有线程在阻塞在取元素，会直接把这个元素给等待线程。如果没有人等着消费，那么会把这个元素放到队列尾部，并且此方法阻塞直到有人读取这个元素。和SynchronousQueue有点像，但比它更强大。



### 14.DelayQueue 延时队列

可以使放入队列的元素在指定的延时后才被消费者取出，元素需要实现Delayed接口。

## 总结

上面简单介绍了JAVA并发包下的一些容器类，知道有这些东西，遇到合适的场景时就能想起有个现成的东西可以用了。想要知其所以然，后续还得再深入探索一番。



作者：程序员追风
链接：https://juejin.im/post/6844903924911046663