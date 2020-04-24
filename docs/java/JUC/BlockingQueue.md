阻塞队列——手写生产者消费者模式、线程池原理、消息中间件原理的元凶哦哦

![java中的阻塞队列和非阻塞队列](http://p3.pstatp.com/large/pgc-image/e9b1a11d65f8455296c662a4dfb4dd1a)

![这里写图片描述](https://img-blog.csdn.net/20180405212220898?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTM4ODcwMDg=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 队列和阻塞队列

### 队列

队列（`Queue`）是一种经常使用的集合。`Queue`实际上是实现了一个先进先出（FIFO：First In First Out）的有序表。和 List、Set一样都继承自 Collection。它和`List`的区别在于，`List`可以在任意位置添加和删除元素，而`Queue` 只有两个操作：

- 把元素添加到队列末尾；
- 从队列头部取出元素。

超市的收银台就是一个队列：

![queue](https://www.liaoxuefeng.com/files/attachments/1285667604660289/l)



![2jpg](http://www.aixx123.com/upload/271c9337969d4f358e6247ff893d9e75_2.jpg)

我们常用的 LinkedList 就可以当队列使用，实现了Dequeue接口，ConcurrentLinkedQueue，都属于非阻塞队列。

### 阻塞队列

阻塞队列，顾名思义，首先它是一个队列，而一个阻塞队列在数据结构中所起的作用大致如下

![img](http://misc.linkedkeeper.com/misc/img/blog/201706/linkedkeeper0_2c8d5504-1fd9-4865-9a46-b4b2e1500670.jpg)



线程 1 往阻塞队列中添加元素，而线程 2 从阻塞队列中移除元素

- 当阻塞队列是空时，从队列中获取元素的操作将会被阻塞。

- 当阻塞队列是满时，从队列中添加元素的操作将会被阻塞。

> 类似我们去海底捞排队，海底捞往往饱满装填，阻塞队列相当于候客区，可以用餐的话就take一波，去餐厅用餐，候客区满的话，等待的客人就会被阻塞在外边等着。

试图从空的阻塞队列中获取元素的线程将会阻塞，直到其他的线程往空的队列插入新的元素，同样，试图往已满的阻塞队列添加新元素的线程同样也会阻塞，直到其他的线程从列中移除一个或多个元素或者完全清空队列后继续新增。



## 为什么要用阻塞队列，有什么好处吗

在多线程领域：所谓阻塞，在某些情况下会挂起线程（即阻塞），一旦条件满足，被挂起的线程又会自动被唤醒



### 为什么需要 BlockingQueue

好处是我们不需要关心什么时候需要阻塞线程，什么时候需要唤醒线程，因为这些 BlockingQueue 都包办了

在 concurrent 包发布以前，多线程环境下，我们每个程序员都必须去自己控制这些细节，尤其还要兼顾效率和线程安全，而这会给我们的程序带来不小的复杂性。



从手动挡换成了自动挡



## Java 里的阻塞队列

![LinkedTransferQueue.png](https://i.loli.net/2020/04/24/Oj6cAbLfDpmgIU1.png)



Collection的子类除了我们熟悉的List和Set，还有一个 Queue有一个BlockingQueue

BlockingQueue 是个接口，你需要使用它的实现之一来使用BlockingQueue，java.util.concurrent包下具有以下 BlockingQueue 接口的实现类：

JDK 提供了 7 个阻塞队列。分别是

- ArrayBlockingQueue ：一个由数组结构组成的有界阻塞队列。
- LinkedBlockingQueue ：一个由链表结构组成的有界阻塞队列。
- PriorityBlockingQueue ：一个支持优先级排序的无界阻塞队列。
- DelayQueue：一个使用优先级队列实现的无界阻塞队列。
- SynchronousQueue：一个不存储元素的阻塞队列。
- LinkedTransferQueue：一个由链表结构组成的无界阻塞队列。
- LinkedBlockingDeque：一个由链表结构组成的双向阻塞队列。



以 ArrayBlockingQueue 来说明 Java 阻塞队列提供的4对方法

相比Queue接口有两种形式的api，BlockingQueue则有四种形式的api，阻塞队列定义如果调用了某个函数可能当时不能立即满足结果 ，但很有可能在未来的某个时刻会满足。

## BlockingQueue 核心方法

| 方法类型     | 抛出异常  | 返回特殊值 | 一直阻塞 | 超时退出           |
| ------------ | --------- | ---------- | -------- | ------------------ |
| 插入         | add(e)    | offer(e)   | put(e)   | offer(e,time,unit) |
| 移除（取出） | remove()  | poll()     | take()   | poll(time,unit)    |
| 检查         | element() | peek()     | 不可用   | 不可用             |

- 抛出异常：

  - 当阻塞队列满时，再往队列里 add 插入元素会抛出 `java.lang.IllegalStateException: Queue full` 异常；
  - 当队列为空时，从队列里 remove 移除元素时会抛出 `NoSuchElementException` 异常 。
  - element()，返回队列头部的元素，如果队列为空，则抛出一个 `NoSuchElementException` 异常

  ![](https://imgkr.cn-bj.ufileos.com/fb1a5a4c-e438-4308-92ec-9297f61136da.png)

- 返回特殊值：

  - offer()，插入方法，成功返回 true，失败返回 false；
  - poll()，移除方法，成功返回出队列的元素，队列里没有则返回 null
  - peek() ，返回队列头部的元素，如果队列为空，则返回 null

  ![](https://imgkr.cn-bj.ufileos.com/00d85478-0871-40da-900d-4d6cd9047b8c.png)

- 一直阻塞：

  - 当阻塞队列满时，如果生产者线程继续往队列里 put 元素，队列会一直阻塞生产者线程，直到拿到数据，或者响应中断退出；
  - 当阻塞队列空时，消费者线程试图从队列里 take 元素，队列也会一直阻塞消费者线程，直到队列可用。

  ![](https://imgkr.cn-bj.ufileos.com/003143ab-68bb-4f2b-943b-bc870ac96900.png)

- 超时退出：

  - 当阻塞队列满时，队列会阻塞生产者线程一定时间，如果超过一定的时间，生产者线程就会退出。

  ![](https://imgkr.cn-bj.ufileos.com/b82734a0-8dbe-4ae9-8e4e-ea44445f46ff.png)











https://cloud.tencent.com/developer/article/1350854

### ArrayBlockingQueue 

ArrayBlockingQueue，一个由**数组**实现的**有界**阻塞队列。该队列采用先进先出（FIFO）的原则对元素进行排序添加的。

ArrayBlockingQueue 为**有界且固定**，其大小在构造时由构造函数来决定，确认之后就不能再改变了。

ArrayBlockingQueue 支持对等待的生产者线程和使用者线程进行排序的可选公平策略，但是在默认情况下不保证线程公平的访问，在构造时可以选择公平策略（`fair = true`）。公平性通常会降低吞吐量，但是减少了可变性和避免了“不平衡性”。（ArrayBlockingQueue 内部的阻塞队列是通过 ReentrantLock 和 Condition 条件队列实现的， 所以 ArrayBlockingQueue 中的元素存在公平和非公平访问的区别）

所谓公平访问队列是指阻塞的所有生产者线程或消费者线程，当队列可用时，可以按照阻塞的先后顺序访问队列，即先阻塞的生产者线程，可以先往队列里插入元素，先阻塞的消费者线程，可以先从队列里获取元素。

#### 源码解读

```java
public class ArrayBlockingQueue<E> extends AbstractQueue<E>
        implements BlockingQueue<E>, java.io.Serializable {

    // 通过数组来实现的队列
    final Object[] items;
    //记录队首元素的下标
    int takeIndex;
    //记录队尾元素的下标
    int putIndex;
    //队列中的元素个数
    int count;
    //通过ReentrantLock来实现同步
    final ReentrantLock lock;
    //有2个条件对象，分别表示队列不为空和队列不满的情况
    private final Condition notEmpty;
    private final Condition notFull;
    transient Itrs itrs;

    //offer方法用于向队列中添加数据
    public boolean offer(E e) {
        // 可以看出添加的数据不支持null值
        checkNotNull(e);
        final ReentrantLock lock = this.lock;
        //通过重入锁来实现同步
        lock.lock();
        try {
          //如果队列已经满了的话直接就返回false，不会阻塞调用这个offer方法的线程
            if (count == items.length)
                return false;
            else {
               //如果队列没有满，就调用enqueue方法将元素添加到队列中
                enqueue(e);
                return true;
            }
        } finally {
            lock.unlock();
        }
    }

    //多了个等待时间的 offer方法
    public boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException {

        checkNotNull(e);
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        //获取可中断锁
        lock.lockInterruptibly();
        try {
            while (count == items.length) {
                if (nanos <= 0)
                    return false;
                //等待设置的时间
                nanos = notFull.awaitNanos(nanos);
            }
           //如果等待时间过了，队列有空间的话就会调用enqueue方法将元素添加到队列
            enqueue(e);
            return true;
        } finally {
            lock.unlock();
        }
    }

    //将数据添加到队列中的具体方法
    private void enqueue(E x) {
        // assert lock.getHoldCount() == 1;
        // assert items[putIndex] == null;
        final Object[] items = this.items;
        items[putIndex] = x;
       //通过循环数组实现的队列，当数组满了时下标就变成0了
        if (++putIndex == items.length)
            putIndex = 0;
        count++;
       //激活因为notEmpty条件而阻塞的线程，比如调用take方法的线程
        notEmpty.signal();
    }

    //将数据从队列中取出的方法
    private E dequeue() {
        // assert lock.getHoldCount() == 1;
        // assert items[takeIndex] != null;
        final Object[] items = this.items;
        @SuppressWarnings("unchecked")
        E x = (E) items[takeIndex];
        //将对应的数组下标位置设置为null释放资源
        items[takeIndex] = null;
        if (++takeIndex == items.length)
            takeIndex = 0;
        count--;
        if (itrs != null)
            itrs.elementDequeued();
       //激活因为notFull条件而阻塞的线程，比如调用put方法的线程
        notFull.signal();
        return x;
    }

    //put方法和offer方法不一样的地方在于，如果队列是满的话，它就会把调用put方法的线程阻塞，直到队列里有空间
    public void put(E e) throws InterruptedException {
        checkNotNull(e);
        final ReentrantLock lock = this.lock;
       //因为后面调用了条件变量的await()方法，而await()方法会在中断标志设置后抛出InterruptedException异常后退出，
      // 所以在加锁时候先看中断标志是不是被设置了，如果设置了直接抛出InterruptedException异常，就不用再去获取锁了
        lock.lockInterruptibly();
        try {
            while (count == items.length)
                //如果队列满的话就阻塞等待，直到notFull的signal方法被调用，也就是队列里有空间了
                notFull.await();
           //队列里有空间了执行添加操作
            enqueue(e);
        } finally {
            lock.unlock();
        }
    }

    ////poll方法用于从队列中取数据，不会阻塞当前线程
    public E poll() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            //如果队列为空的话会直接返回null，否则调用dequeue方法取数据
            return (count == 0) ? null : dequeue();
        } finally {
            lock.unlock();
        }
    }
    //有等待时间的 poll 重载方法
    public E poll(long timeout, TimeUnit unit) throws InterruptedException {
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == 0) {
                if (nanos <= 0)
                    return null;
                nanos = notEmpty.awaitNanos(nanos);
            }
            return dequeue();
        } finally {
            lock.unlock();
        }
    }

    //take方法也是用于取队列中的数据，但是和poll方法不同的是它有可能会阻塞当前的线程
    public E take() throws InterruptedException {
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            //当队列为空时，就会阻塞当前线程
            while (count == 0)
                notEmpty.await();
            //直到队列中有数据了，调用dequeue方法将数据返回
            return dequeue();
        } finally {
            lock.unlock();
        }
    }

    //返回队首元素
    public E peek() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return itemAt(takeIndex); // null when queue is empty
        } finally {
            lock.unlock();
        }
    }

    //获取队列的元素个数，加了锁，所以结果是准确的
    public int size() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }

    //返回队列剩余空间，还能加几个元素
    public int remainingCapacity() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return items.length - count;
        } finally {
            lock.unlock();
        }
    }
}
```



### LinkedBlockingQueue 

LinkedBlockingQueue 是一个用单向链表实现的有界阻塞队列。此队列的默认和最大长度为 `Integer.MAX_VALUE`。此队列按照先进先出的原则对元素进行排序。

如果不是特殊业务，LinkedBlockingQueue 使用时，切记要定义容量 `new LinkedBlockingQueue(capacity)`

，防止过度膨胀。

#### 源码解读

```java
public class LinkedBlockingQueue<E> extends AbstractQueue<E>
        implements BlockingQueue<E>, java.io.Serializable {
    private static final long serialVersionUID = -6903933977591709194L;

    // 基于链表实现，肯定要有结点类，典型的单链表结构
    static class Node<E> {
        E item;
        Node<E> next;
        Node(E x) { item = x; }
    }

    //容量
    private final int capacity;

    //当前队列元素数量
    private final AtomicInteger count = new AtomicInteger();

    // 头节点，不存数据
    transient Node<E> head;

 	// 尾节点，便于入队
    private transient Node<E> last;

    // take锁，出队锁，只有take，poll方法会持有
    private final ReentrantLock takeLock = new ReentrantLock();

    // 出队等待条件
	// 当队列无元素时，take锁会阻塞在notEmpty条件上，等待其它线程唤醒
    private final Condition notEmpty = takeLock.newCondition();

    // 入队锁，只有put，offer会持有
    private final ReentrantLock putLock = new ReentrantLock();

    // 入队等待条件
	// 当队列满了时，put锁会会阻塞在notFull上，等待其它线程唤醒
    private final Condition notFull = putLock.newCondition();

    //同样提供三个构造器
    public LinkedBlockingQueue(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException();
       // 初始化head和last指针为空值节点
        this.capacity = capacity;
        last = head = new Node<E>(null);
    }
    
    public LinkedBlockingQueue() {
        //// 如果没传容量，就使用最大int值初始化其容量
        this(Integer.MAX_VALUE);
    }

    public LinkedBlockingQueue(Collection<? extends E> c) {

    }
    
    //入队
    public void put(E e) throws InterruptedException {
        // 不允许null元素
        if (e == null) throw new NullPointerException();
        //规定给当前put方法预留一个本地变量
        int c = -1;
        // 新建一个节点
        Node<E> node = new Node<E>(e);
        final ReentrantLock putLock = this.putLock;
        final AtomicInteger count = this.count;
        // 使用put锁加锁
        putLock.lockInterruptibly();
        try {
			// 如果队列满了，就阻塞在notFull条件上
        	// 等待被其它线程唤醒
            while (count.get() == capacity) {
                notFull.await();
            }
            // 队列不满了，就入队
            enqueue(node);
            // 队列长度加1
            c = count.getAndIncrement();
            // 如果现队列长度小于容量
        	// 就再唤醒一个阻塞在notFull条件上的线程
            // 这里为啥要唤醒一下呢？
            // 因为可能有很多线程阻塞在notFull这个条件上的
            // 而取元素时只有取之前队列是满的才会唤醒notFull
            // 为什么队列满的才唤醒notFull呢？
            // 因为唤醒是需要加putLock的，这是为了减少锁的次数
            // 所以，这里索性在放完元素就检测一下，未满就唤醒其它notFull上的线程
            // 说白了，这也是锁分离带来的代价
            if (c + 1 < capacity)
                notFull.signal();
        } finally {
			// 释放锁
            putLock.unlock();
        }
        // 如果原队列长度为0，现在加了一个元素后立即唤醒notEmpty条件
        if (c == 0)
            signalNotEmpty();
    }
    
    private void signalNotEmpty() {
        final ReentrantLock takeLock = this.takeLock;
        // 加take锁
        takeLock.lock();
        try {
            // 唤醒notEmpty条件
            notEmpty.signal();
        } finally {
            takeLock.unlock();
        }
    }


    private void signalNotFull() {
        final ReentrantLock putLock = this.putLock;
        putLock.lock();
        try {
            notFull.signal();
        } finally {
            putLock.unlock();
        }
    }


    private void enqueue(Node<E> node) {
        // 直接加到last后面
        last = last.next = node;
    }

    public boolean offer(E e) {
		//用带过期时间的说明
    }

    public boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException {

        if (e == null) throw new NullPointerException();
        //转换为纳秒
        long nanos = unit.toNanos(timeout);
        int c = -1;
        final ReentrantLock putLock = this.putLock;
        final AtomicInteger count = this.count;
        //获取入队锁，支持等待锁的过程中被中断
        putLock.lockInterruptibly();
        try {
            //队列满了，再看看有没有超时
            while (count.get() == capacity) {
                if (nanos <= 0)
                    //等待时间超时
                    return false;
                //进行等待，awaitNanos(long nanos)是AQS中的方法
                //在等待过程中，如果被唤醒或超时，则继续当前循环
                //如果被中断，则抛出中断异常
                nanos = notFull.awaitNanos(nanos);
            }
            //进入队尾
            enqueue(new Node<E>(e));
            c = count.getAndIncrement();
            //说明当前元素后面还能再插入一个
            //就唤醒一个入队条件队列中阻塞的线程
            if (c + 1 < capacity)
                notFull.signal();
        } finally {
            putLock.unlock();
        }
        //节点数量为0，说明队列是空的
        if (c == 0)
            //唤醒一个出队条件队列阻塞的线程
            signalNotEmpty();
        return true;
    }


    public E take() throws InterruptedException {
        E x;
        int c = -1;
        final AtomicInteger count = this.count;
        final ReentrantLock takeLock = this.takeLock;
        takeLock.lockInterruptibly();
        try {
            // 如果队列无元素，则阻塞在notEmpty条件上
            while (count.get() == 0) {
                notEmpty.await();
            }
            // 否则，出队
            x = dequeue();
            // 获取出队前队列的长度
            c = count.getAndDecrement();
            // 如果取之前队列长度大于1，则唤醒notEmpty
            if (c > 1)
                notEmpty.signal();
        } finally {
            takeLock.unlock();
        }
        // 如果取之前队列长度等于容量
    	// 则唤醒notFull
        if (c == capacity)
            signalNotFull();
        return x;
    }
    
    private E dequeue() {
        Node<E> h = head;
        Node<E> first = h.next;
        h.next = h; // help GC
        head = first;
        E x = first.item;
        first.item = null;
        return x;
    }

    public E poll(long timeout, TimeUnit unit) throws InterruptedException {
        E x = null;
        int c = -1;
        long nanos = unit.toNanos(timeout);
        final AtomicInteger count = this.count;
        final ReentrantLock takeLock = this.takeLock;
        takeLock.lockInterruptibly();
        try {
            while (count.get() == 0) {
                //队列为空且已经超时，直接返回空
                if (nanos <= 0)
                    return null;
                //等待过程中可能被唤醒，超时，中断
                nanos = notEmpty.awaitNanos(nanos);
            }
            //进行出队操作
            x = dequeue();
            c = count.getAndDecrement();
            if (c > 1)
                notEmpty.signal();
        } finally {
            takeLock.unlock();
        }
        //如果出队前，队列是满的，则唤醒一个被take()阻塞的线程
        if (c == capacity)
            signalNotFull();
        return x;
    }

    public E poll() {
		//
    }

    public E peek() {
        if (count.get() == 0)
            return null;
        final ReentrantLock takeLock = this.takeLock;
        takeLock.lock();
        try {
            Node<E> first = head.next;
            if (first == null)
                return null;
            else
                return first.item;
        } finally {
            takeLock.unlock();
        }
    }

    void unlink(Node<E> p, Node<E> trail) {
        // assert isFullyLocked();
        // p.next is not changed, to allow iterators that are
        // traversing p to maintain their weak-consistency guarantee.
        p.item = null;
        trail.next = p.next;
        if (last == p)
            last = trail;
        if (count.getAndDecrement() == capacity)
            notFull.signal();
    }

    public boolean remove(Object o) {
        if (o == null) return false;
        fullyLock();
        try {
            for (Node<E> trail = head, p = trail.next;
                 p != null;
                 trail = p, p = p.next) {
                if (o.equals(p.item)) {
                    unlink(p, trail);
                    return true;
                }
            }
            return false;
        } finally {
            fullyUnlock();
        }
    }

    public boolean contains(Object o) {
        if (o == null) return false;
        fullyLock();
        try {
            for (Node<E> p = head.next; p != null; p = p.next)
                if (o.equals(p.item))
                    return true;
            return false;
        } finally {
            fullyUnlock();
        }
    }
   
    static final class LBQSpliterator<E> implements Spliterator<E> {
      
    }
}
```

#### LinkedBlockingQueue 与 ArrayBlockingQueue 对比

- ArrayBlockingQueue 入队出队采用一把锁，导致入队出队相互阻塞，效率低下；
- LinkedBlockingQueue入队出队采用两把锁，入队出队互不干扰，效率较高；
- 二者都是有界队列，如果长度相等且出队速度跟不上入队速度，都会导致大量线程阻塞；
- LinkedBlockingQueue 如果初始化不传入初始容量，则使用最大int值，如果出队速度跟不上入队速度，会导致队列特别长，占用大量内存；



### PriorityBlockingQueue 

PriorityBlockingQueue 是一个支持优先级的无界阻塞队列。默认情况下元素采取自然顺序排列，也可以通过比较器 comparator 来指定元素的排序规则。元素按照升序排列。



### DelayQueue 

DelayQueue 是一个使用优先级队列实现的延迟无界阻塞队列。

队列使用 PriorityQueue 来实现。队列中的元素必须实现 Delayed 接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才能从队列中提取元素。我们可以将 DelayQueue 运用在以下应用场景：

- 缓存系统的设计：可以用 DelayQueue 保存缓存元素的有效期，使用一个线程循环查询 DelayQueue，一旦能从 DelayQueue 中获取元素时，表示缓存有效期到了。
- 定时任务调度。使用 DelayQueue 保存当天将会执行的任务和执行时间，一旦从 DelayQueue 中获取到任务就开始执行，从比如 TimerQueue 就是使用 DelayQueue 实现的。



### SynchronousQueue

SynchronousQueue 是一个不存储元素的阻塞队列，也即是单个元素的队列。

每一个 put 操作必须等待一个 take 操作，否则不能继续添加元素。SynchronousQueue 可以看成是一个传球手，负责把生产者线程处理的数据直接传递给消费者线程。队列本身并不存储任何元素，非常适合于传递性场景, 比如在一个线程中使用的数据，传递给另外一个线程使用，SynchronousQueue 的吞吐量高于 LinkedBlockingQueue 和 ArrayBlockingQueue。

没有容量，与其他BlockingQueue不用，SynchronousQueue 是一个不存储元素的BlockingQueue。

每一个put 操作必须要等待一个 take 操作，否则不能继续添加，反之亦然

```java
public class SynchronousQueueDemo {


    public static void main(String[] args) {


        BlockingQueue<String> queue = new SynchronousQueue<>();

        new Thread(()->{
            try {
                System.out.println("Thread 1 put a");
                queue.put("a");

                System.out.println("Thread 1 put b");
                queue.put("b");

                System.out.println("Thread 1 put c");
                queue.put("c");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();


        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(2);
                System.out.println("Thread 2 get:"+queue.take());

                TimeUnit.SECONDS.sleep(2);
                System.out.println("Thread 2 get:"+queue.take());

                TimeUnit.SECONDS.sleep(2);
                System.out.println("Thread 2 get:"+queue.take());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

```
Thread 1 put a
Thread 2 get:a
Thread 1 put b
Thread 2 get:b
Thread 1 put c
Thread 2 get:c
```



### LinkedTransferQueue 

LinkedTransferQueue 是一个由链表结构组成的无界阻塞 TransferQueue 队列。相对于其他阻塞队列，LinkedTransferQueue 多了 tryTransfer 和 transfer 方法。

transfer 方法。如果当前有消费者正在等待接收元素（消费者使用 take() 方法或带时间限制的 poll() 方法时），transfer 方法可以把生产者传入的元素立刻 transfer（传输）给消费者。如果没有消费者在等待接收元素，transfer 方法会将元素存放在队列的 tail 节点，并等到该元素被消费者消费了才返回。transfer 方法的关键代码如下：

```
Node pred = tryAppend(s, haveData);
return awaitMatch(s, pred, e, (how == TIMED), nanos);
```

第一行代码是试图把存放当前元素的 s 节点作为 tail 节点。第二行代码是让 CPU 自旋等待消费者消费元素。因为自旋会消耗 CPU，所以自旋一定的次数后使用 Thread.yield() 方法来暂停当前正在执行的线程，并执行其他线程。

tryTransfer 方法。则是用来试探下生产者传入的元素是否能直接传给消费者。如果没有消费者等待接收元素，则返回 false。和 transfer 方法的区别是 tryTransfer 方法无论消费者是否接收，方法立即返回。而 transfer 方法是必须等到消费者消费了才返回。

对于带有时间限制的 tryTransfer(E e, long timeout, TimeUnit unit) 方法，则是试图把生产者传入的元素直接传给消费者，但是如果没有消费者消费该元素则等待指定的时间再返回，如果超时还没消费元素，则返回 false，如果在超时时间内消费了元素，则返回 true。



### LinkedBlockingDeque 

LinkedBlockingDeque 是一个由链表结构组成的双向阻塞队列。所谓双向队列指的你可以从队列的两端插入和移出元素。双端队列因为多了一个操作队列的入口，在多线程同时入队时，也就减少了一半的竞争。相比其他的阻塞队列，LinkedBlockingDeque 多了 addFirst，addLast，offerFirst，offerLast，peekFirst，peekLast 等方法，以 First 单词结尾的方法，表示插入，获取（peek）或移除双端队列的第一个元素。以 Last 单词结尾的方法，表示插入，获取或移除双端队列的最后一个元素。另外插入方法 add 等同于 addLast，移除方法 remove 等效于 removeFirst。但是 take 方法却等同于 takeFirst，不知道是不是 Jdk 的 bug，使用时还是用带有 First 和 Last 后缀的方法更清楚。

在初始化 LinkedBlockingDeque 时可以设置容量防止其过渡膨胀。另外双向阻塞队列可以运用在“工作窃取”模式中。



## 阻塞队列的实现原理

https://juejin.im/post/5df240f16fb9a0161d742b60

http://www.linkedkeeper.com/1003.html

如果队列是空的，消费者会一直等待，当生产者添加元素时候，消费者是如何知道当前队列有元素的呢？如果让你来设计阻塞队列你会如何设计，让生产者和消费者能够高效率的进行通讯呢？让我们先来看看 JDK 是如何实现的。

使用通知模式实现。所谓通知模式，就是当生产者往满的队列里添加元素时会阻塞住生产者，当消费者消费了一个队列中的元素后，会通知生产者当前队列可用。通过查看 JDK 源码发现 ArrayBlockingQueue 使用了 Condition 来实现，代码如下：

```
private final Condition notFull;
private final Condition notEmpty;

public ArrayBlockingQueue(int capacity, boolean fair) {
        // 省略其他代码 
        notEmpty = lock.newCondition();
        notFull =  lock.newCondition();
    }

public void put(E e) throws InterruptedException {
        checkNotNull(e);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == items.length)
                notFull.await();
            insert(e);
        } finally {
            lock.unlock();
        }
}

public E take() throws InterruptedException {
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == 0)
                notEmpty.await();
            return extract();
  } finally {
            lock.unlock();
        }
}

private void insert(E x) {
        items[putIndex] = x;
        putIndex = inc(putIndex);
        ++count;
        notEmpty.signal();
    }
```

当我们往队列里插入一个元素时，如果队列不可用，阻塞生产者主要通过 LockSupport.park(this); 来实现

```
public final void await() throws InterruptedException {
            if (Thread.interrupted())
                throw new InterruptedException();
            Node node = addConditionWaiter();
            int savedState = fullyRelease(node);
            int interruptMode = 0;
            while (!isOnSyncQueue(node)) {
                LockSupport.park(this);
                if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
                    break;
            }
            if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
                interruptMode = REINTERRUPT;
            if (node.nextWaiter != null) // clean up if cancelled
                unlinkCancelledWaiters();
            if (interruptMode != 0)

reportInterruptAfterWait(interruptMode);
        }
```

继续进入源码，发现调用 setBlocker 先保存下将要阻塞的线程，然后调用 unsafe.park 阻塞当前线程。

```
public static void park(Object blocker) {
        Thread t = Thread.currentThread();
        setBlocker(t, blocker);
        unsafe.park(false, 0L);
        setBlocker(t, null);
    }
```

unsafe.park 是个 native 方法，代码如下：

```
public native void park(boolean isAbsolute, long time);
```

park 这个方法会阻塞当前线程，只有以下四种情况中的一种发生时，该方法才会返回。

- 与 park 对应的 unpark 执行或已经执行时。注意：已经执行是指 unpark 先执行，然后再执行的 park。
- 线程被中断时。
- 如果参数中的 time 不是零，等待了指定的毫秒数时。
- 发生异常现象时。这些异常事先无法确定。

我们继续看一下 JVM 是如何实现 park 方法的，park 在不同的操作系统使用不同的方式实现，在 linux 下是使用的是系统方法 pthread_cond_wait 实现。实现代码在 JVM 源码路径 src/os/linux/vm/os_linux.cpp 里的 os::PlatformEvent::park 方法，代码如下：

```
void os::PlatformEvent::park() {      
     	     int v ;
	     for (;;) {
		v = _Event ;
	     if (Atomic::cmpxchg (v-1, &_Event, v) == v) break ;
	     }
	     guarantee (v >= 0, "invariant") ;
	     if (v == 0) {
	     // Do this the hard way by blocking ...
	     int status = pthread_mutex_lock(_mutex);
	     assert_status(status == 0, status, "mutex_lock");
	     guarantee (_nParked == 0, "invariant") ;
	     ++ _nParked ;
	     while (_Event < 0) {
	     status = pthread_cond_wait(_cond, _mutex);
	     // for some reason, under 2.7 lwp_cond_wait() may return ETIME ...
	     // Treat this the same as if the wait was interrupted
	     if (status == ETIME) { status = EINTR; }
	     assert_status(status == 0 || status == EINTR, status, "cond_wait");
	     }
	     -- _nParked ;
	     
	     // In theory we could move the ST of 0 into _Event past the unlock(),
	     // but then we'd need a MEMBAR after the ST.
	     _Event = 0 ;
	     status = pthread_mutex_unlock(_mutex);
	     assert_status(status == 0, status, "mutex_unlock");
	     }
	     guarantee (_Event >= 0, "invariant") ;
	     }

     }
```

pthread_cond_wait 是一个多线程的条件变量函数，cond 是 condition 的缩写，字面意思可以理解为线程在等待一个条件发生，这个条件是一个全局变量。这个方法接收两个参数，一个共享变量 _cond，一个互斥量 _mutex。而 unpark 方法在 linux 下是使用 pthread_cond_signal 实现的。park 在 windows 下则是使用 WaitForSingleObject 实现的。

当队列满时，生产者往阻塞队列里插入一个元素，生产者线程会进入 WAITING (parking) 状态。我们可以使用 jstack dump 阻塞的生产者线程看到这点：

```
"main" prio=5 tid=0x00007fc83c000000 nid=0x10164e000 waiting on condition [0x000000010164d000]
   java.lang.Thread.State: WAITING (parking)
        at sun.misc.Unsafe.park(Native Method)
        - parking to wait for  <0x0000000140559fe8> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(LockSupport.java:186)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(AbstractQueuedSynchronizer.java:2043)
        at java.util.concurrent.ArrayBlockingQueue.put(ArrayBlockingQueue.java:324)
        at blockingqueue.ArrayBlockingQueueTest.main(ArrayBlockingQueueTest.java:11)
```



## 阻塞队列使用在哪

JDK api文档给出了一个典型的应用 https://docs.oracle.com/javase/8/docs/api/index.html

```
 class Producer implements Runnable {
   private final BlockingQueue queue;
   Producer(BlockingQueue q) { queue = q; }
   public void run() {
     try {
       while (true) { queue.put(produce()); }
     } catch (InterruptedException ex) { ... handle ...}
   }
   Object produce() { ... }
 }

 class Consumer implements Runnable {
   private final BlockingQueue queue;
   Consumer(BlockingQueue q) { queue = q; }
   public void run() {
     try {
       while (true) { consume(queue.take()); }
     } catch (InterruptedException ex) { ... handle ...}
   }
   void consume(Object x) { ... }
 }

 class Setup {
   void main() {
     BlockingQueue q = new SomeQueueImplementation();
     Producer p = new Producer(q);
     Consumer c1 = new Consumer(q);
     Consumer c2 = new Consumer(q);
     new Thread(p).start();
     new Thread(c1).start();
     new Thread(c2).start();
   }
 }
```

### 生产者消费者模式

- 传统版
- 阻塞队列版

```java
/**
 * 题目：一个初始值为 0 的变量，两个线程对齐交替操作，一个+1，一个-1，5 轮
 */
public class ProdCounsume_TraditionDemo {
    public static void main(String[] args) {
        ShareData shareData = new ShareData();
        new Thread(() -> {
            for (int i = 0; i <= 5; i++) {
                shareData.increment();
            }
        }, "T1").start();

        new Thread(() -> {
            for (int i = 0; i <= 5; i++) {
                shareData.decrement();
            }
        }, "T1").start();
    }
}

//线程操作资源类
class ShareData {
    private int num = 0;
    private Lock lock = new ReentrantLock();
    private Condition condition = lock.newCondition();

    public void increment() {
        lock.lock();
        try {
          //判断，不能用 if
            while (num != 0) {
                //等待，不能生产
                condition.await();
            }
                //干活
                num++;
                System.out.println(Thread.currentThread().getName() + "\t" + num);

                //唤醒
                condition.signal();

        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void decrement() {

        lock.lock();
        try {
            while (num == 0) {
                //等待，不能生产
                condition.await();
            }
                //干活
                num--;
                System.out.println(Thread.currentThread().getName() + "\t" + num);

                //唤醒
                condition.signal();

        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

防止虚假唤醒，多线程判断用 while，不是 if

### 线程池

### 消息中间件