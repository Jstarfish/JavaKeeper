### Java JUC 简介

在 Java 5.0 提供了 `java.util.concurrent` （简称 JUC ）包，在此包中增加了在并发编程中很常用 的实用工具类，用于定义类似于线程的自定义子 系统，包括线程池、异步 IO 和轻量级任务框架。 提供可调的、灵活的线程池。还提供了设计用于 多线程上下文中的 Collection 实现等。 



并发和并行

线程和进程

### 1.   volatile 关键字 内存可见性	

**可见性：**

　　可见性是一种复杂的属性，因为可见性中的错误总是会违背我们的直觉。通常，我们无法确保执行读操作的线程能适时地看到其他线程写入的值，有时甚至是根本不可能的事情。为了确保多个线程之间对内存写入操作的可见性，必须使用同步机制。

　　**可见性，是指线程之间的可见性，一个线程修改的状态对另一个线程是可见的。**也就是一个线程修改的结果。另一个线程马上就能看到。比如：用volatile修饰的变量，就会具有可见性。volatile修饰的变量不允许线程内部缓存和重排序，即直接修改内存。所以对其他线程是可见的。但是这里需要注意一个问题，volatile只能让被他修饰内容具有可见性，但不能保证它具有原子性。比如  volatile int a = 0；之后有一个操作 a++；这个变量a具有可见性，但是a++  依然是一个非原子操作，也就是这个操作同样存在线程安全问题。

　　在 Java 中 volatile、synchronized 和 final 实现可见性。

**原子性：**

　　**原子是世界上的最小单位，具有不可分割性。**比如  a=0；（a非long和double类型） 这个操作是不可分割的，那么我们说这个操作时原子操作。再比如：a++； 这个操作实际是a = a +   1；是可分割的，所以他不是一个原子操作。非原子操作都会存在线程安全问题，需要我们使用同步技术（sychronized）来让它变成一个原子操作。一个操作是原子操作，那么我们称它具有原子性。java的concurrent包下提供了一些原子类，我们可以通过阅读API来了解这些原子类的用法。比如：AtomicInteger、AtomicLong、AtomicReference等。

　　在 Java 中 synchronized 和在 lock、unlock 中操作保证原子性。

**有序性：**

　　Java  语言提供了 volatile 和 synchronized 两个关键字来保证线程之间操作的有序性，volatile  是因为其本身包含“禁止指令重排序”的语义，synchronized 是由“一个变量在同一个时刻只允许一条线程对其进行 lock  操作”这条规则获得的，此规则决定了持有同一个对象锁的两个同步块只能串行执行。



- Java语言提供了一种稍弱的同步机制，即volatile变量，用来确保将变量的更新操作通知到其他线程。当把变量声明为volatile类型后，编译器与运行时都会注意到这个变量是共享的，因此不会将该变量上的操作与其他内存操作一起重排序。volatile变量不会被缓存在寄存器或者对其他处理器不可见的地方，因此在读取volatile类型的变量时总会返回最新写入的值。

　　**在访问volatile变量时不会执行加锁操作，因此也就不会使执行线程阻塞，因此volatile变量是一种比sychronized关键字更轻量级的同步机制。** 

- 当对非 volatile 变量进行读写的时候，每个线程先从内存拷贝变量到CPU缓存中。如果计算机有多个CPU，每个线程可能在不同的CPU上被处理，这意味着每个线程可以拷贝到不同的 CPU cache 中。

- 而声明变量是 volatile 的，JVM 保证了每次读变量都从内存中读，跳过 CPU cache 这一步。



#### 当一个变量定义为 volatile 之后，将具备两种特性：

1. 保证此变量对所有的线程的可见性，这里的“可见性”，当一个线程修改了这个变量的值，volatile 保证了新值能立即同步到主内存，以及每次使用前立即从主内存刷新。但普通变量做不到这点，普通变量的值在线程间传递均需要通过主内存（详见：[Java内存模型](http://www.cnblogs.com/zhengbin/p/6407137.html)）来完成。
2. 禁止指令重排序优化。有volatile修饰的变量，赋值后多执行了一个“load addl $0x0, (%esp)”操作，这个操作相当于一个**内存屏障**（指令重排序时不能把后面的指令重排序到内存屏障之前的位置），只有一个CPU访问内存时，并不需要内存屏障；（什么是指令重排序：是指CPU采用了允许将多条指令不按程序规定的顺序分开发送给各相应电路单元处理）。

#### volatile 性能：

　　volatile 的读性能消耗与普通变量几乎相同，但是写操作稍慢，因为它需要在本地代码中插入许多内存屏障指令来保证处理器不发生乱序执行。



### 2.   原子变量 CAS算法 

讲一讲AtomicInteger，为什么要用CAS而不是synchronized?

![](/Users/starfish/Desktop/截屏2020-03-12下午3.05.09.png)



![](/Users/starfish/Desktop/截屏2020-03-12下午3.08.31.png)





![](/Users/starfish/Desktop/截屏2020-03-12下午3.09.20.png)

![](/Users/starfish/Desktop/截屏2020-03-12下午3.10.33.png)

![](/Users/starfish/Desktop/截屏2020-03-12下午3.11.47.png)



![](/Users/starfish/Desktop/截屏2020-03-12下午3.12.18.png)



![](/Users/starfish/Desktop/截屏2020-03-12下午3.22.07.png)

![](/Users/starfish/Desktop/截屏2020-03-12下午3.23.54.png)



![](/Users/starfish/Desktop/截屏2020-03-12下午3.27.54.png)





![](/Users/starfish/Desktop/截屏2020-03-12下午3.30.30.png)



![](/Users/starfish/Desktop/截屏2020-03-12下午3.30.53.png)

![](/Users/starfish/Desktop/截屏2020-03-12下午3.31.40.png)



CAS缺点

![](/Users/starfish/Desktop/截屏2020-03-12下午3.32.52.png)



![](/Users/starfish/Desktop/截屏2020-03-12下午3.34.10.png)

引出ABA问题

![](/Users/starfish/Desktop/截屏2020-03-12下午3.40.29.png)



![](/Users/starfish/Desktop/截屏2020-03-12下午4.05.33.png)

#### CAS 算法

- CAS (Compare-And-Swap) 是一种硬件对并发的支持，针对多处理器 操作而设计的处理器中的一种特殊指令，用于管理对共享数据的并发访问。 
- CAS 是一种无锁的非阻塞算法的实现。 
- CAS 包含了 3 个操作数：
  - 需要读写的内存值 V 
  -  进行比较的值 A 
  - 拟写入的新值 B 
- 当且仅当 V 的值等于 A 时，CAS 通过原子方式用新值 B 来更新 V 的 值，否则不会执行任何操作。 



#### 原子变量 

- 类的小工具包，支持在单个变量上解除锁的线程安全编程。事实上，此包中的类可 将 volatile 值、字段和数组元素的概念扩展到那些也提供原子条件更新操作的类。 
- 类 AtomicBoolean、AtomicInteger、AtomicLong 和 AtomicReference 的实例各自提供对 相应类型单个变量的访问和更新。每个类也为该类型提供适当的实用工具方法。 
- AtomicIntegerArray、AtomicLongArray 和 AtomicReferenceArray 类进一步扩展了原子操 作，对这些类型的数组提供了支持。这些类在为其数组元素提供 volatile 访问语义方 面也引人注目，这对于普通数组来说是不受支持的。 
- 核心方法：boolean compareAndSet(expectedValue, updateValue) 
- java.util.concurrent.atomic 包下提供了一些原子操作的常用类:
  - AtomicBoolean 、AtomicInteger 、AtomicLong 、 AtomicReference 
  - AtomicIntegerArray 、AtomicLongArray 
  - AtomicMarkableReference 
  - AtomicReferenceArray 
  - AtomicStampedReference 



### 3.  ConcurrentHashMap 锁分段机制 

http://www.importnew.com/28263.html

ConcurrentHashMap 

- Java 5.0 在 java.util.concurrent 包中提供了多种并发容器类来改进同步容器 的性能。
- ConcurrentHashMap 同步容器类是Java 5 增加的一个线程安全的哈希表。对 与多线程的操作，介于 HashMap 与 Hashtable 之间。内部采用“锁分段” 机制替代 Hashtable 的独占锁。进而提高性能。 
- 此包还提供了设计用于多线程上下文中的 Collection 实现：

 ConcurrentHashMap、ConcurrentSkipListMap、ConcurrentSkipListSet、 CopyOnWriteArrayList 和 CopyOnWriteArraySet。当期望许多线程访问一个给 定 collection 时，ConcurrentHashMap 通常优于同步的 HashMap， ConcurrentSkipListMap 通常优于同步的 TreeMap。当期望的读数和遍历远远 大于列表的更新数时，CopyOnWriteArrayList 优于同步的 ArrayList。 



### 4. CountDownLatch 闭锁 

CountDownLatch

- Java 5.0 在 java.util.concurrent 包中提供了多种并发容器类来改进同步容器 的性能。
- CountDownLatch 一个同步辅助类，在完成一组正在其他线程中执行的操作 之前，它允许一个或多个线程一直等待。
- 闭锁可以延迟线程的进度直到其到达终止状态，闭锁可以用来确保某些活 动直到其他活动都完成才继续执行：
  - 确保某个计算在其需要的所有资源都被初始化之后才继续执行;
  - 确保某个服务在其依赖的所有其他服务都已经启动之后才启动; 
  -  等待直到某个操作所有参与者都准备就绪再继续执行。 



### 5. 实现 Callable 接口 

Callable 接口 

- Java 5.0 在 java.util.concurrent 提供了一个新的创建执行 线程的方式：Callable 接口 
- Callable 接口类似于 Runnable，两者都是为那些其实例可 能被另一个线程执行的类设计的。但是 Runnable 不会返 回结果，并且无法抛出经过检查的异常。
- Callable 需要依赖FutureTask ，FutureTask 也可以用作闭锁。

```java
/*
 * 一、创建执行线程的方式三：实现 Callable 接口。 相较于实现 Runnable 接口的方式，方法可以有返回值，并且可以抛出异常。
 *
 * 二、执行 Callable 方式，需要 FutureTask 实现类的支持，用于接收运算结果。  
   FutureTask 是  Future 接口的实现类
 */
public class TestCallable {

    public static void main(String[] args) {
        ThreadDemo td = new ThreadDemo();

        //1.执行 Callable 方式，需要 FutureTask 实现类的支持，用于接收运算结果。
        FutureTask<Integer> result = new FutureTask<>(td);

        new Thread(result).start();

        //2.接收线程运算后的结果
        try {
            Integer sum = result.get();  //FutureTask 可用于 闭锁
            System.out.println(sum);
            System.out.println("------------------------------------");
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }
}

 class ThreadDemo implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = 0; i <= 100000; i++) {
            sum += i;
        }
        return sum;
    }
}
```



### 6. Lock 同步锁 

显示锁 Lock 

- 在 Java 5.0 之前，协调共享对象的访问时可以使用的机 制只有 **synchronized** 和 **volatile** 。Java 5.0 后增加了一些 新的机制，但并不是一种替代内置锁的方法，而是当内 置锁不适用时，作为一种可选择的高级功能。
- **ReentrantLock** 实现了 Lock 接口，并提供了与 synchronized 相同的互斥性和内存可见性。但相较于 synchronized 提供了更高的处理锁的灵活性。  



- Lock和synchronized的区别

1. Lock不是Java语言内置的，synchronized是Java语言的关键字，因此是内置特性。Lock是一个类，通过这个类可以实现同步访问；
2. Lock和synchronized有一点非常大的不同，采用synchronized不需要用户去手动释放锁，当synchronized方法或者synchronized代码块执行完之后，系统会自动让线程释放对锁的占用；而Lock则必须要用户去手动释放锁，如果没有主动释放锁，就有可能导致出现死锁现象。



### 7. Condition 控制线程通信 

Condition 

- Condition 接口描述了可能会与锁有关联的条件变量。这些变量在用 法上与使用 Object.wait 访问的隐式监视器类似，但提供了更强大的 功能。需要特别指出的是，单个 Lock 可能与多个 Condition 对象关 联。为了避免兼容性问题，Condition 方法的名称与对应的 Object 版 本中的不同。 
- 在 Condition 对象中，与 wait、notify 和 notifyAll 方法对应的分别是 await、signal 和 signalAll。
- Condition 实例实质上被绑定到一个锁上。要为特定 Lock 实例获得 Condition 实例，请使用其 newCondition() 方法。 



### 8. 线程按序交替 

线程按序交替

- 编写一个程序，开启 3 个线程，这三个线程的 ID 分别为 A、B、C，每个线程将自己的 ID 在屏幕上打印 10 遍，要 求输出的结果必须按顺序显示。 如：ABCABCABC…… 依次递归 	



### 9. ReadWriteLock 读写锁 

读-写锁 ReadWriteLock 

- ReadWriteLock 维护了一对相关的锁，一个用于只读操作， 另一个用于写入操作。只要没有 writer，读取锁可以由 多个 reader 线程同时保持。写入锁是独占的。。 
- ReadWriteLock 读取操作通常不会改变共享资源，但执行 写入操作时，必须独占方式来获取锁。对于读取操作占 多数的数据结构。 ReadWriteLock 能提供比独占锁更高 的并发性。而对于只读的数据结构，其中包含的不变性 可以完全不需要考虑加锁操作。 



### 10. 线程八锁 

- 一个对象里面如果有多个synchronized方法，某一个时刻内，只要一个线程去调用 其中的一个synchronized方法了，其它的线程都只能等待，换句话说，某一个时刻 内，只能有唯一一个线程去访问这些synchronized方法 

- 锁的是当前对象this，被锁定后，其它的线程都不能进入到当前对象的其它的 synchronized方法 
- 加个普通方法后发现和同步锁无关
-  换成两个对象后，不是同一把锁了，情况立刻变化。 
- 都换成静态同步方法后，情况又变化 
- 所有的非静态同步方法用的都是同一把锁——实例对象本身，也就是说如果一个实 例对象的非静态同步方法获取锁后，该实例对象的其他非静态同步方法必须等待获 取锁的方法释放锁后才能获取锁，可是别的实例对象的非静态同步方法因为跟该实 例对象的非静态同步方法用的是不同的锁，所以毋须等待该实例对象已获取锁的非 静态同步方法释放锁就可以获取他们自己的锁。
-  所有的静态同步方法用的也是同一把锁——类对象本身，这两把锁是两个不同的对 象，所以静态同步方法与非静态同步方法之间是不会有竞态条件的。但是一旦一个 静态同步方法获取锁后，其他的静态同步方法都必须等待该方法释放锁后才能获取 锁，而不管是同一个实例对象的静态同步方法之间，还是不同的实例对象的静态同 步方法之间，只要它们同一个类的实例对象！ 



### 11. 线程池 

如果并发的线程数量很多，并且每个线程都是执行一个时间很短的任务就结束了，这样频繁创建线程就会大大降低系统的效率，因为频繁创建线程和销毁线程需要时间。 

第四种获取线程的方法：线程池，一个 **ExecutorService**，它使用可能的几个池线程之 一执行每个提交的任务，通常使用 Executors 工厂方法配置。 

- 线程池可以解决两个不同问题：由于减少了每个任务调用的开销，它们通常可以在 执行大量异步任务时提供增强的性能，并且还可以提供绑定和管理资源（包括执行 任务集时使用的线程）的方法。每个 **ThreadPoolExecutor** 还维护着一些基本的统计数 据，如完成的任务数。 
- 为了便于跨大量上下文使用，此类提供了很多可调整的参数和扩展钩子 (hook)。但 是，强烈建议程序员使用较为方便的 Executors 工厂方法 ： 
  -  Executors.newCachedThreadPool()（无界线程池，可以进行自动线程回收）
  - Executors.newFixedThreadPool(int)（固定大小线程池） 
  - Executors.newSingleThreadExecutor()（单个后台线程） 

它们均为大多数使用场景预定义了设置。 



### 12. 线程调度 

ScheduledExecutorService 

- 一个 ExecutorService，可安排在给定的延迟后运行或定 期执行的命令。 



### 13. ForkJoinPool 分支/合并框架 工作窃取 

Fork/Join 框架 

Fork/Join 框架：就是在必要的情况下，将一个大任务，进行拆分(fork)成 若干个小任务（拆到不可再拆时），再将一个个的小任务运算的结果进 行 join 汇总。 

![1540376584260](E:\笔记\1540376584260.png)





Fork/Join 框架与线程池的区别

- 采用 “工作窃取”模式（work-stealing）： 

当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加 到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队 列中。 

- 相对于一般的线程池实现，fork/join框架的优势体现在对其中包含的任务 的处理方式上.在一般的线程池中，如果一个线程正在执行的任务由于某些 原因无法继续运行，那么该线程会处于等待状态。而在fork/join框架实现中， 如果某个子问题由于等待另外一个子问题的完成而无法继续运行。那么处理 该子问题的线程会主动寻找其他尚未运行的子问题来执行.这种方式减少了 线程的等待时间，提高了性能。 

