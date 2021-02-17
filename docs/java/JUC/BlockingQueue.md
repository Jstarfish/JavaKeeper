# 阻塞队列——手写生产者消费者模式、线程池原理面试题真正的答案

## 队列和阻塞队列

### 队列

队列（`Queue`）是一种经常使用的集合。`Queue` 实际上是实现了一个先进先出（FIFO：First In First Out）的有序表。和 List、Set 一样都继承自 Collection。它和 `List` 的区别在于，`List`可以在任意位置添加和删除元素，而`Queue` 只有两个操作：

- 把元素添加到队列末尾；
- 从队列头部取出元素。

超市的收银台就是一个队列：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge7jl0dafej30ge03yq2x.jpg)



我们常用的 LinkedList 就可以当队列使用，实现了 Dequeue 接口，还有 ConcurrentLinkedQueue，他们都属于非阻塞队列。

### 阻塞队列

阻塞队列，顾名思义，首先它是一个队列，而一个阻塞队列在数据结构中所起的作用大致如下 

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge7f11uoroj32bs0tidj8.jpg)

线程 1 往阻塞队列中添加元素，而线程 2 从阻塞队列中移除元素

- 当阻塞队列是空时，从队列中获取元素的操作将会被阻塞。

- 当阻塞队列是满时，从队列中添加元素的操作将会被阻塞。

试图从空的阻塞队列中获取元素的线程将会阻塞，直到其他的线程往空的队列插入新的元素，同样，试图往已满的阻塞队列添加新元素的线程同样也会阻塞，直到其他的线程从列中移除一个或多个元素或者完全清空队列后继续新增。

> 类似我们去海底捞排队，海底捞爆满情况下，阻塞队列相当于用餐区，用餐区满了的话，就阻塞在候客区等着，可以用餐的话 put 一波去用餐，吃完就 take 出去。



## 为什么要用阻塞队列，有什么好处吗

在多线程领域：所谓阻塞，是指在某些情况下会挂起线程（即阻塞），一旦条件满足，被挂起的线程又会自动被唤醒。

**那为什么需要 BlockingQueue 呢**

好处是我们不需要关心什么时候需要阻塞线程，什么时候需要唤醒线程，因为这些 BlockingQueue 都包办了。

在 concurrent 包发布以前，多线程环境下，我们每个程序员都必须自己去实现这些细节，尤其还要兼顾效率和线程安全，这会给我们的程序带来不小的复杂性。现在有了阻塞队列，我们的操作就从手动挡换成了自动挡。



## Java 里的阻塞队列

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge6zgkm1lxj31j10f6gm6.jpg)

Collection的子类除了我们熟悉的 List 和 Set，还有一个 Queue，阻塞队列 BlockingQueue 继承自 Queue。

BlockingQueue 是个接口，需要使用它的实现之一来使用 BlockingQueue，`java.util.concurrent` 包下具有以下 BlockingQueue 接口的实现类：

JDK 提供了 7 个阻塞队列。分别是

- ArrayBlockingQueue ：一个由数组结构组成的有界阻塞队列
- LinkedBlockingQueue ：一个由链表结构组成的有界阻塞队列
- PriorityBlockingQueue ：一个支持优先级排序的无界阻塞队列
- DelayQueue：一个使用优先级队列实现的无界阻塞队列
- SynchronousQueue：一个不存储元素的阻塞队列
- LinkedTransferQueue：一个由链表结构组成的无界阻塞队列（实现了继承于 BlockingQueue 的 TransferQueue）
- LinkedBlockingDeque：一个由链表结构组成的双向阻塞队列



## BlockingQueue 核心方法

相比 Queue 接口，BlockingQueue 有四种形式的 API。

| 方法类型     | 抛出异常  | 返回特殊值 | 一直阻塞 | 超时退出           |
| ------------ | --------- | ---------- | -------- | ------------------ |
| 插入         | add(e)    | offer(e)   | put(e)   | offer(e,time,unit) |
| 移除（取出） | remove()  | poll()     | take()   | poll(time,unit)    |
| 检查         | element() | peek()     | 不可用   | 不可用             |

以 ArrayBlockingQueue 为例来看下 Java 阻塞队列提供的常用方法

- 抛出异常：

  - 当阻塞队列满时，再往队列里 add 插入元素会抛出 `java.lang.IllegalStateException: Queue full` 异常；
  - 当队列为空时，从队列里 remove 移除元素时会抛出 `NoSuchElementException` 异常 。
  - element()，返回队列头部的元素，如果队列为空，则抛出一个 `NoSuchElementException` 异常

  ![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9mYjFhNWE0Yy1lNDM4LTQzMDgtOTJlYy05Mjk3ZjYxMTM2ZGEucG5n?x-oss-process=image/format.png)

- 返回特殊值：

  - offer()，插入方法，成功返回 true，失败返回 false；
  - poll()，移除方法，成功返回出队列的元素，队列里没有则返回 null
  - peek() ，返回队列头部的元素，如果队列为空，则返回 null

  ![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8wMGQ4NTQ3OC0wODcxLTQwZGEtOTAwZC00ZDZjZDkwNDdiOGMucG5n?x-oss-process=image/format.png)

- 一直阻塞：

  - 当阻塞队列满时，如果生产线程继续往队列里 put 元素，队列会一直阻塞生产线程，直到拿到数据，或者响应中断退出；
  - 当阻塞队列空时，消费线程试图从队列里 take 元素，队列也会一直阻塞消费线程，直到队列可用。

  ![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS8wMDMxNDNhYi02OGJiLTRmMmItOTQzYi1iYzg3MGFjOTY5MDAucG5n?x-oss-process=image/format.png)

- 超时退出：

  - 当阻塞队列满时，队列会阻塞生产线程一定时间，如果超过一定的时间，生产线程就会退出，返回 false
  - 当阻塞队列空时，队列会阻塞消费线程一定时间，如果超过一定的时间，消费线程会退出，返回 null
  
  ![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS9iODI3MzRhMC04ZGJlLTRhZTktOGU0ZS1lYTQ0NDQ1ZjQ2ZmYucG5n?x-oss-process=image/format.png)



## BlockingQueue 实现类

逐个分析下这 7 个阻塞队列，常用的几个顺便探究下源码。

### ArrayBlockingQueue 

ArrayBlockingQueue，一个由**数组**实现的**有界**阻塞队列。该队列采用先进先出（FIFO）的原则对元素进行排序添加的。

ArrayBlockingQueue 为**有界且固定**，其大小在构造时由构造函数来决定，确认之后就不能再改变了。

ArrayBlockingQueue 支持对等待的生产者线程和使用者线程进行排序的可选公平策略，但是在默认情况下不保证线程公平的访问，在构造时可以选择公平策略（`fair = true`）。公平性通常会降低吞吐量，但是减少了可变性和避免了“不平衡性”。（ArrayBlockingQueue 内部的阻塞队列是通过 ReentrantLock 和 Condition 条件队列实现的， 所以 ArrayBlockingQueue 中的元素存在公平和非公平访问的区别）

所谓公平访问队列是指阻塞的所有生产者线程或消费者线程，当队列可用时，可以按照阻塞的先后顺序访问队列，即先阻塞的生产者线程，可以先往队列里插入元素，先阻塞的消费者线程，可以先从队列里获取元素，可以保证先进先出，避免饥饿现象。

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
    //迭代器
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

    //poll方法用于从队列中取数据，不会阻塞当前线程
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
    
    // 此外，还有一些其他方法

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
    
    // 判断队列中是否存在当前元素o
		public boolean contains(Object o){}
    
    // 返回一个按正确顺序，包含队列中所有元素的数组
		public Object[] toArray(){}
		
		// 自动清空队列中的所有元素
		public void clear(){}
		
		// 移除队列中所有可用元素，并将他们加入到给定的 Collection 中    
		public int drainTo(Collection<? super E> c){}
		
		// 返回此队列中按正确顺序进行迭代的，包含所有元素的迭代器
		public Iterator<E> iterator()
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
        // 如果没传容量，就使用最大int值初始化其容量
        this(Integer.MAX_VALUE);
    }

    public LinkedBlockingQueue(Collection<? extends E> c) {}
    
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
    }
   
    static final class LBQSpliterator<E> implements Spliterator<E> {
      
    }
}
```

#### LinkedBlockingQueue 与 ArrayBlockingQueue 对比

- ArrayBlockingQueue 入队出队采用一把锁，导致入队出队相互阻塞，效率低下；
- LinkedBlockingQueue 入队出队采用两把锁，入队出队互不干扰，效率较高；
- 二者都是有界队列，如果长度相等且出队速度跟不上入队速度，都会导致大量线程阻塞；
- LinkedBlockingQueue 如果初始化不传入初始容量，则使用最大 int 值，如果出队速度跟不上入队速度，会导致队列特别长，占用大量内存；



### PriorityBlockingQueue 

PriorityBlockingQueue 是一个支持优先级的无界阻塞队列。(虽说是无界队列，但是由于资源耗尽的话，也会OutOfMemoryError，无法添加元素)

默认情况下元素采用自然顺序升序排列。也可以自定义类实现 `compareTo()` 方法来指定元素排序规则，或者初始化 PriorityBlockingQueue 时，指定构造参数 Comparator 来对元素进行排序。但需要注意的是不能保证同优先级元素的顺序。PriorityBlockingQueue 是基于**最小二叉堆**实现，使用基于 CAS 实现的自旋锁来控制队列的动态扩容，保证了扩容操作不会阻塞 take 操作的执行。



### DelayQueue

DelayQueue 是一个使用优先级队列实现的延迟无界阻塞队列。

队列使用 PriorityQueue 来实现。队列中的元素必须实现 Delayed 接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才能从队列中提取元素。我们可以将 DelayQueue 运用在以下应用场景：

- 缓存系统的设计：可以用 DelayQueue 保存缓存元素的有效期，使用一个线程循环查询 DelayQueue，一旦能从 DelayQueue 中获取元素时，表示缓存有效期到了。
- 定时任务调度。使用 DelayQueue 保存当天将会执行的任务和执行时间，一旦从 DelayQueue 中获取到任务就开始执行，从比如 Timer 就是使用 DelayQueue 实现的。



### SynchronousQueue

SynchronousQueue 是一个不存储元素的阻塞队列，也即是单个元素的队列。

每一个 put 操作必须等待一个 take 操作，否则不能继续添加元素。SynchronousQueue 可以看成是一个传球手，负责把生产者线程处理的数据直接传递给消费者线程。队列本身并不存储任何元素，非常适合于传递性场景, 比如在一个线程中使用的数据，传递给另外一个线程使用，SynchronousQueue 的吞吐量高于 LinkedBlockingQueue 和 ArrayBlockingQueue。

#### Coding

synchronousQueue 是一个没有数据缓冲的阻塞队列，生产者线程对其的插入操作 put() 必须等待消费者的移除操作 take()，反过来也一样。

对应 peek, contains, clear, isEmpty ... 等方法其实是无效的。

但是 poll() 和 offer() 就不会阻塞，举例来说就是 offer 的时候如果有消费者在等待那么就会立马满足返回 true，如果没有就会返回 false，不会等待消费者到来。

```java
public class SynchronousQueueDemo {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new SynchronousQueue<>();
				
      	//System.out.println(queue.offer("aaa"));   //false
        //System.out.println(queue.poll());         //null

        System.out.println(queue.add("bbb"));      //IllegalStateException: Queue full
      
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

#### 源码解读

不像ArrayBlockingQueue、LinkedBlockingDeque之类的阻塞队列依赖AQS实现并发操作，SynchronousQueue直接使用CAS实现线程的安全访问。

synchronousQueue 提供了两个构造器（公平与否），内部是通过 Transferer 来实现的，具体分为两个Transferer，分别是 TransferStack 和 TransferQueue。

TransferStack：非公平竞争模式使用的数据结构是后进先出栈(LIFO Stack)

TransferQueue：公平竞争模式则使用先进先出队列（FIFO Queue）

性能上两者是相当的，一般情况下，FIFO 通常可以支持更大的吞吐量，但 LIFO 可以更大程度的保持线程的本地化。

```java
private transient volatile Transferer<E> transferer;

public SynchronousQueue() {
    this(false);
}

public SynchronousQueue(boolean fair) {
    transferer = fair ? new TransferQueue<E>() : new TransferStack<E>();
}
```

分析 TransferQueue 的实现

```java
//构造函数中会初始化一个出队的节点，并且首尾都指向这个节点
TransferQueue() {
    QNode h = new QNode(null, false); // initialize to dummy node.
    head = h;
    tail = h;
}
//队列节点,
static final class QNode {
  volatile QNode next;          // next node in queue
  volatile Object item;         // CAS'ed to or from null
  volatile Thread waiter;       // to control park/unpark
  final boolean isData;

  QNode(Object item, boolean isData) {
    this.item = item;
    this.isData = isData;
  }
	// 设置next和item的值，用于进行并发更新, cas 无锁操作
  boolean casNext(QNode cmp, QNode val) {
    return next == cmp &&
      UNSAFE.compareAndSwapObject(this, nextOffset, cmp, val);
  }

  boolean casItem(Object cmp, Object val) {
    return item == cmp &&
      UNSAFE.compareAndSwapObject(this, itemOffset, cmp, val);
  }

  void tryCancel(Object cmp) {
    UNSAFE.compareAndSwapObject(this, itemOffset, cmp, this);
  }

  boolean isCancelled() {
    return item == this;
  }

  boolean isOffList() {
    return next == this;
  }

  // Unsafe mechanics
  private static final sun.misc.Unsafe UNSAFE;
  private static final long itemOffset;
  private static final long nextOffset;

  static {
    try {
      UNSAFE = sun.misc.Unsafe.getUnsafe();
      Class<?> k = QNode.class;
      itemOffset = UNSAFE.objectFieldOffset
        (k.getDeclaredField("item"));
      nextOffset = UNSAFE.objectFieldOffset
        (k.getDeclaredField("next"));
    } catch (Exception e) {
      throw new Error(e);
    }
  }
}
```

从 `put()` 方法和 `take()` 方法可以看出最终调用的都是 TransferQueue 的 `transfer()` 方法。

```java
public void put(E e) throws InterruptedException {
    if (e == null) throw new NullPointerException();
    if (transferer.transfer(e, false, 0) == null) {
        Thread.interrupted();
        throw new InterruptedException();
    }
}

public E take() throws InterruptedException {
  E e = transferer.transfer(null, false, 0);
  if (e != null)
    return e;
  Thread.interrupted();
  throw new InterruptedException();
}

//transfer方法用于提交数据或者是获取数据
E transfer(E e, boolean timed, long nanos) {

  QNode s = null; // constructed/reused as needed
  //如果e不为null，就说明是添加数据的入队操作
  boolean isData = (e != null);

  for (;;) {
    QNode t = tail;
    QNode h = head;
    if (t == null || h == null)         // saw uninitialized value
      continue;                       // spin

    //如果当前操作和 tail 节点的操作是一样的；或者头尾相同（表明队列中啥都没有）。
    if (h == t || t.isData == isData) { // empty or same-mode
      QNode tn = t.next;
      // 如果 t 和 tail 不一样，说明，tail 被其他的线程改了，重来
      if (t != tail)                  // inconsistent read
        continue;
      // 如果 tail 的 next 不是空。就需要将 next 追加到 tail 后面了
      if (tn != null) {               // lagging tail
        // 使用 CAS 将 tail.next 变成 tail,
        advanceTail(t, tn);
        continue;
      }
      // 时间到了，不等待，返回 null，插入失败，获取也是失败的
      if (timed && nanos <= 0)        // can't wait
        return null;
      if (s == null)
        s = new QNode(e, isData);
      if (!t.casNext(null, s))        // failed to link in
        continue;

      advanceTail(t, s);              // swing tail and wait
      Object x = awaitFulfill(s, e, timed, nanos);
      if (x == s) {                   // wait was cancelled
        clean(t, s);
        return null;
      }

      if (!s.isOffList()) {           // not already unlinked
        advanceHead(t, s);          // unlink if head
        if (x != null)              // and forget fields
          s.item = s;
        s.waiter = null;
      }
      return (x != null) ? (E)x : e;

    } else {                            // complementary-mode
      QNode m = h.next;               // node to fulfill
      if (t != tail || m == null || h != head)
        continue;                   // inconsistent read

      Object x = m.item;
      if (isData == (x != null) ||    // m already fulfilled
          x == m ||                   // m cancelled
          !m.casItem(x, e)) {         // lost CAS
        advanceHead(h, m);          // dequeue and retry
        continue;
      }

      advanceHead(h, m);              // successfully fulfilled
      LockSupport.unpark(m.waiter);
      return (x != null) ? (E)x : e;
    }
  }
}
```



### LinkedTransferQueue 

LinkedTransferQueue 是一个由链表结构组成的无界阻塞 TransferQueue 队列。

LinkedTransferQueue采用一种预占模式。意思就是消费者线程取元素时，如果队列不为空，则直接取走数据，若队列为空，那就生成一个节点（节点元素为null）入队，然后消费者线程被等待在这个节点上，后面生产者线程入队时发现有一个元素为null的节点，生产者线程就不入队了，直接就将元素填充到该节点，并唤醒该节点等待的线程，被唤醒的消费者线程取走元素，从调用的方法返回。我们称这种节点操作为“匹配”方式。

队列实现了 TransferQueue 接口重写了 tryTransfer 和 transfer 方法，这组方法和 SynchronousQueue 公平模式的队列类似，具有匹配的功能



### LinkedBlockingDeque 

LinkedBlockingDeque 是一个由链表结构组成的双向阻塞队列。

所谓双向队列指的你可以从队列的两端插入和移出元素。双端队列因为多了一个操作队列的入口，在多线程同时入队时，也就减少了一半的竞争。相比其他的阻塞队列，LinkedBlockingDeque 多了 addFirst，addLast，offerFirst，offerLast，peekFirst，peekLast 等方法，以 First 单词结尾的方法，表示插入，获取（peek）或移除双端队列的第一个元素。以 Last 单词结尾的方法，表示插入，获取或移除双端队列的最后一个元素。另外插入方法 add 等同于 addLast，移除方法 remove 等效于 removeFirst。

在初始化 LinkedBlockingDeque 时可以设置容量防止其过渡膨胀，默认容量也是 Integer.MAX_VALUE。另外双向阻塞队列可以运用在“工作窃取”模式中。



## 阻塞队列使用场景

我们常用的生产者消费者模式就可以基于阻塞队列实现；

线程池中活跃线程数达到 corePoolSize 时，线程池将会将后续的 task 提交到 BlockingQueue 中；



### 生产者消费者模式

JDK API文档的 BlockingQueue 给出了一个典型的应用

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge7bmj64cxj30zm0u0tfe.jpg)



> 面试题：一个初始值为 0 的变量，两个线程对齐交替操作，一个+1，一个-1，5 轮

```java
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



### 线程池

线程池的核心方法 ThreadPoolExecutor，用 BlockingQueue 存放任务的阻塞队列，被提交但尚未被执行的任务

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)
```

线程池在内部实际也是构建了一个生产者消费者模型，将线程和任务两者解耦，并不直接关联，从而良好的缓冲任务，复用线程。

![](https://tva1.sinaimg.cn/large/00831rSTly1gdl1arsqkbj30u50d8dgz.jpg)



不同的线程池实现用的是不同的阻塞队列，newFixedThreadPool 和 newSingleThreadExecutor 用的是LinkedBlockingQueue，newCachedThreadPool 用的是 SynchronousQueue。



> 文章持续更新，可以微信搜「 **JavaKeeper** 」第一时间阅读，无套路领取 500+ 本电子书和 30+ 视频教学和源码，本文 **GitHub** [github.com/JavaKeeper](https://github.com/Jstarfish/JavaKeeper) 已经收录，Javaer 开发、面试必备技能兵器谱，有你想要的。



## 参考与感谢

https://www.liaoxuefeng.com/

SynchronousQueue源码 https://juejin.im/post/5ae754c7f265da0ba76f8534