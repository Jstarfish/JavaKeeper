---
title: 手撕 JUC 面试 
date: 2024-05-31
tags: 
 - JUC
categories: JUC
---

![](https://img.starfish.ink/common/faq-banner.png)

> JUC 面试，围绕着这么几个方向准备
>
> - 多线程的一些概念（进程、线程、并行、并发啥的，谈谈你对高并发的认识）
> - Java 内存模型相关（也可以算是 JVM 的范畴）
> - 同步机制（locks、synchronzied、atomic）
> - 并发容器类
>   - ConcurrentHashMap、CopyOnWriteArrayList、CopyOnWriteArraySet
>   - 阻塞队列（顺着就会问到线程池）
> - 线程池（Executor、Callable 、Future、ExecutorService等等，底层原理）
> - AQS
>   - AQS 原理
>   - 工具类：CountDownLatch、ReentrantLock、Semaphore、Exchanger
> - atomic 类（atomic常用类，方法，到 CAS，或者 ABA问题）
> - Fork/Join并行计算框架
>



## 一、多线程开篇

### 进程和线程？

进程是程序的一次执行过程，是系统运行程序的基本单位，因此进程是动态的。系统运行一个程序即是一个进程从创建，运行到消亡的过程。

线程是操作系统能够进行运算调度的最小单位，它被包含在进程之中，是进程中的实际运作单位。

在 Java 中，当我们启动 main 函数时其实就是启动了一个 JVM 的进程，而 main 函数所在的线程就是这个进程中的一个线程，也称主线程。

线程是进程的子集，一个进程可以有很多线程，每条线程并行执行不同的任务。不同的进程使用不同的内存空间，而所有的线程共享一片相同的内存空间。



### 了解协程么

> **协程的目的**
>
> 在传统的J2EE系统中都是基于每个请求占用一个线程去完成完整的业务逻辑（包括事务）。所以系统的吞吐能力取决于每个线程的操作耗时。如果遇到很耗时的I/O行为，则整个系统的吞吐立刻下降，因为这个时候线程一直处于阻塞状态，如果线程很多的时候，会存在很多线程处于空闲状态（等待该线程执行完才能执行），造成了资源应用不彻底。
>
> 最常见的例子就是JDBC（它是同步阻塞的），这也是为什么很多人都说数据库是瓶颈的原因。这里的耗时其实是让CPU一直在等待I/O返回，说白了线程根本没有利用CPU去做运算，而是处于空转状态。而另外过多的线程，也会带来更多的ContextSwitch开销。
>
> 对于上述问题，现阶段行业里的比较流行的解决方案之一就是单线程加上异步回调。其代表派是node.js以及Java里的新秀Vert.x。
>
> 而协程的目的就是当出现长时间的I/O操作时，通过让出目前的协程调度，执行下一个任务的方式，来消除ContextSwitch上的开销。
>
> **协程的特点**
>
> 1. 线程的切换由操作系统负责调度，协程由用户自己进行调度，因此减少了上下文切换，提高了效率。
> 2. 线程的默认Stack大小是1M，而协程更轻量，接近1K。因此可以在相同的内存中开启更多的协程。
> 3. 由于在同一个线程上，因此可以避免竞争关系而使用锁。
> 4. 适用于被阻塞的，且需要大量并发的场景。但不适用于大量计算的多线程，遇到此种情况，更好实用线程去解决。
>
> **协程的原理**
>
> 当出现IO阻塞的时候，由协程的调度器进行调度，通过将数据流立刻yield掉（主动让出），并且记录当前栈上的数据，阻塞完后立刻再通过线程恢复栈，并把阻塞的结果放到这个线程上去跑，这样看上去好像跟写同步代码没有任何差别，这整个流程可以称为coroutine，而跑在由`coroutine`负责调度的线程称为`Fiber`。比如Golang里的 go关键字其实就是负责开启一个`Fiber`，让`func`逻辑跑在上面。
>
> 由于协程的暂停完全由程序控制，发生在用户态上；而线程的阻塞状态是由操作系统内核来进行切换，发生在内核态上。
> 因此，协程的开销远远小于线程的开销，也就没有了ContextSwitch上的开销。



### 说说并发与并行的区别?

- **并发：** 同一时间段，多个任务都在执行 (单位时间内不一定同时执行)；
- **并行：** 单位时间内，多个任务同时执行。



### 说下同步、异步、阻塞和非阻塞？

**同步与异步**

首先来解释同步和异步的概念，这两个概念与消息的通知机制有关。也就是**同步与异步主要是从消息通知机制角度来说的**。

所谓同步就是一个任务的完成需要依赖另外一个任务时，只有等待被依赖的任务完成后，依赖的任务才能算完成，这是一种可靠的任务序列。

所谓异步是不需要等待被依赖的任务完成，只是通知被依赖的任务要完成什么工作，依赖的任务也立即执行，只要自己完成了整个任务就算完成了。

异步的概念和同步相对。当一个同步调用发出后，调用者要一直等待返回消息（结果）通知后，才能进行后续的执行；当一个异步过程调用发出后，调用者不能立刻得到返回消息（结果）。实际处理这个调用的部件在完成后，通过状态、通知和回调来通知调用者

**阻塞和非阻塞**

阻塞和非阻塞这两个概念与程序（线程）等待消息通知(无所谓同步或者异步)时的**状态**有关。也就是说**阻塞与非阻塞主要是程序（线程）等待消息通知时的状态角度来说的**

阻塞调用是指调用结果返回之前，当前线程会被挂起，一直处于等待消息通知，不能够执行其他业务。函数只有在得到结果之后才会返回

**有人也许会把阻塞调用和同步调用等同起来，实际上它们是不同的。**

对于同步调用来说，很多时候当前线程可能还是激活的，只是从逻辑上当前函数没有返回而已，此时，这个线程可能也会处理其他的消息

1. 如果这个线程在等待当前函数返回时，仍在执行其他消息处理，那这种情况就叫做同步非阻塞；

2. 如果这个线程在等待当前函数返回时，没有执行其他消息处理，而是处于挂起等待状态，那这种情况就叫做同步阻塞；

所以同步的实现方式会有两种：同步阻塞、同步非阻塞；同理，异步也会有两种实现：异步阻塞、异步非阻塞



### 什么是线程安全和线程不安全？

通俗的说：加锁的就是是线程安全的，不加锁的就是是线程不安全的

**线程安全: 就是多线程访问时，采用了加锁机制，当一个线程访问该类的某个数据时，进行保护，其他线程不能进行访问，直到该线程读取完，其他线程才可使用。不会出现数据不一致或者数据污染**。

一个线程安全的计数器类的同一个实例对象在被多个线程使用的情况下也不会出现计算失误。很显然你可以将**集合类分成两组，线程安全和非线程安全的**。 Vector 是用同步方法来实现线程安全的, 而和它相似的 ArrayList 不是线程安全的。

**线程不安全：就是不提供数据访问保护，有可能出现多个线程先后更改数据造成所得到的数据是脏数据**

线程安全问题都是由全局变量及静态变量引起的。 若每个线程中对全局变量、静态变量只有读操作，而无写操作，一般来说，这个全局变量是线程安全的；若有多个线程同时执行写操作，一般都需要考虑线程同步，否则的话就可能影响线程安全。



### 什么是上下文切换?

多线程编程中一般线程的个数都大于 CPU 核心的个数，而一个 CPU 核心在任意时刻只能被一个线程使用，为了让这些线程都能得到有效执行，CPU 采取的策略是为每个线程分配时间片并轮转的形式。当一个线程的时间片用完的时候就会重新处于就绪状态让给其他线程使用，这个过程就属于一次上下文切换。

概括来说就是：当前任务在执行完 CPU 时间片切换到另一个任务之前会先保存自己的状态，以便下次再切换回这个任务时，可以再加载这个任务的状态。**任务从保存到再加载的过程就是一次上下文切换**。

上下文切换通常是计算密集型的。也就是说，它需要相当可观的处理器时间，在每秒几十上百次的切换中，每次切换都需要纳秒量级的时间。所以，上下文切换对系统来说意味着消耗大量的 CPU 时间，事实上，可能是操作系统中时间消耗最大的操作。

Linux 相比与其他操作系统（包括其他类 Unix 系统）有很多的优点，其中有一项就是，其上下文切换和模式切换的时间消耗非常少。



### 什么是线程的上下文切换?

对于单核 CPU，CPU 在一个时刻只能运行一个线程，当在运行一个线程的过程中转去运行另外一个线程，这个叫做线程上下文切换(对于进程也是类似)。

线程上下文切换过程中会记录程序计数器、**CPU** 寄存器的状态等数据。

虽然多线程可以使得任务执行的效率得到提升，但是由于在线程切换时同 样会带来一定的开销代价，并且多个线程会导致系统资源占用的增加，所以在 进行多线程编程时要注意这些因素。



### 用户线程和守护线程有什么区别?

当我们在 Java 程序中创建一个线程，它就被称为用户线程。将一个用户线程设置为守护线程的方法就是在调用 **start()**方法之前，调用对象的 `setDamon(true)` 方法。一个守护线程是在后台执行并且不会阻止 JVM 终止的 线程，守护线程的作用是为其他线程的运行提供便利服务。当没有用户线程在 运行的时候，**JVM** 关闭程序并且退出。一个守护线程创建的子线程依然是守护线程。

守护线程的一个典型例子就是垃圾回收器。



### 如何在 Windows 和 Linux 上查找哪个线程 cpu 利用率最高？

windows上面用任务管理器看，linux下可以用 top 这个工具看。

1. 找出 cpu 耗用厉害的进程pid， 终端执行top命令，然后按下shift+p 查找出cpu利用最厉害的pid号
2. 根据上面第一步拿到的pid号，top -H -p pid 。然后按下shift+p，查找出cpu利用率最厉害的线程号，比如top -H -p 1328
3. 将获取到的线程号转换成16进制，去百度转换一下就行
4. 使用jstack工具将进程信息打印输出，jstack pid号 > /tmp/t.dat，比如jstack 31365 > /tmp/t.dat
5. 编辑/tmp/t.dat文件，查找线程号对应的信息



### 说说线程的生命周期和状态?

Java 线程在运行的生命周期中的指定时刻只可能处于下面 6 种不同状态的其中一个状态（图源《Java 并发编程艺术》4.1.4 节）。

![img](https://ask.qcloudimg.com/http-save/yehe-1104878/o9ndah1viz.png?imageView2/2/w/1620)

线程在生命周期中并不是固定处于某一个状态而是随着代码的执行在不同状态之间切换。Java 线程状态变迁如下图所示

![img](https://ask.qcloudimg.com/http-save/yehe-1104878/f7epdyuln1.png?imageView2/2/w/1620)

由上图可以看出：线程创建之后它将处于 **NEW（新建）** 状态，调用 `start()` 方法后开始运行，线程这时候处于 **READY（可运行）** 状态。可运行状态的线程获得了 CPU 时间片（timeslice）后就处于 **RUNNING（运行）** 状态。



### 一个线程两次调用 start() 方法会出现什么情况？谈谈线程的生命周期和状态转移

在 Java 中，线程对象一旦启动，不能再次启动。如果尝试对同一个线程对象调用两次 `start()` 方法，会抛出 `java.lang.IllegalThreadStateException` 异常。

关于线程生命周期的不同状态，在 Java 5 以后，线程状态被明确定义在其公共内部枚举类型 java.lang.Thread.State 中，分别是：

- 新建（NEW），表示线程被创建出来还没真正启动的状态，可以认为它是个 Java 内部状态。
- 就绪（RUNNABLE），表示该线程已经在 JVM 中执行，当然由于执行需要计算资源，它可能是正在运行，也可能还在等待系统分配给它 CPU 片段，在就绪队列里面排队。
- 在其他一些分析中，会额外区分一种状态 RUNNING，但是从 Java API 的角度，并不能表示出来。
- 阻塞（BLOCKED），这个状态和同步非常相关，阻塞表示线程在等待 Monitor lock。比如，线程试图通过 synchronized 去获取某个锁，但是其他线程已经独占了，那么当前线程就会处于阻塞状态。
- 等待（WAITING），表示正在等待其他线程采取某些操作。一个常见的场景是类似生产者消费者模式，发现任务条件尚未满足，就让当前消费者线程等待（wait），另外的生产者线程去准备任务数据，然后通过类似 notify 等动作，通知消费线程可以继续工作了。Thread.join() 也会令线程进入等待状态。
- 计时等待（TIMED_WAIT），其进入条件和等待状态类似，但是调用的是存在超时条件的方法，比如 wait 或 join 等方法的指定超时版本。

- 终止（TERMINATED），不管是意外退出还是正常执行结束，线程已经完成使命，终止运行，也有人把这个状态叫作死亡。

在第二次调用 start() 方法的时候，线程可能处于终止或者其他（非 NEW）状态，但是不论如何，都是不可以再次启动的。



### 说说 sleep() 方法和 wait() 方法区别和共同点?

- 两者最主要的区别在于：**sleep 方法没有释放锁，而 wait 方法释放了锁** 。
- 两者都可以暂停线程的执行。
- wait 通常被用于线程间交互/通信，sleep 通常被用于暂停执行。
- wait() 方法被调用后，线程不会自动苏醒，需要别的线程调用同一个对象上的 `notify()` 或者 `notifyAll()` 方法。`sleep()` 方法执行完成后，线程会自动苏醒。或者可以使用 `wait(long timeout)` 超时后线程会自动苏醒。

**yield()**
yield() 方法和 sleep() 方法类似，也不会释放“锁标志”，区别在于，它没有参数，即 yield() 方法只是使当前线程重新回到可执行状态，所以执行 yield() 的线程有可能在进入到可执行状态后马上又被执行，另外 yield() 方法只能使同优先级或者高优先级的线程得到执行机会，这也和 sleep() 方法不同。

**join()**
join() 方法会使当前线程等待调用 join() 方法的线程结束后才能继续执行



### 为什么我们调用 start() 方法时会执行 run() 方法，为什么我们不能直接调用 run() 方法？

new 一个 Thread，线程进入了新建状态；调用 start() 方法，会启动一个线程并使线程进入了就绪状态，当分配到时间片后就可以开始运行了。 start() 会执行线程的相应准备工作，然后自动执行 run() 方法的内容，这是真正的多线程工作。 而直接执行 run() 方法，会把 run 方法当成一个 main 线程下的普通方法去执行，并不会在某个线程中执行它，所以这并不是多线程工作。

**总结： 调用 start 方法方可启动线程并使线程进入就绪状态，而 run 方法只是 thread 的一个普通方法调用，还是在主线程里执行。**



### Java 线程启动的几种方式

```java
public static void main(String[] args) {
  new MyThread().start();     //第一种  直接通过Thread  MyThread 是继承了Thread对象的类  实现在下面

  new Thread(new MyRun()).start();      //第二种 Runnable
  new Thread(()->{                //第三种  lambda
    System.out.println("Hello Lambda!");
  }).start();

  Thread t = new Thread(new FutureTask<String>(new MyCall()));    //第四种
  t.start();

  ExecutorService service = Executors.newCachedThreadPool();   //第五种  使用Executor
  service.execute(()->{
    System.out.println("Hello ThreadPool");
  });
  service.shutdown();
}
}
```



### 进程间的通信方式？

进程间通信（Inter-Process Communication，IPC）是指在不同进程之间传递数据和信息的机制。不同操作系统提供了多种 IPC 方式，下面是常见的几种：

1. **管道（Pipe）**

   无名管道（Anonymous Pipe）：单向通信，只能用于有亲缘关系的进程（父进程与子进程）。

   有名管道（Named Pipe 或 FIFO）：在 Unix/Linux 系统中，可以使用 `mkfifo` 命令创建有名管道，支持双向通信。

2. 消息队列（Message Queue）

   - **特点**：消息队列是存储在内核中的消息链表，允许进程通过发送和接收消息进行通信，支持有序的消息传递。

   - **实现**：在 Unix/Linux 系统中，可以使用 `msgget`、`msgsnd`、`msgrcv` 等系统调用进行消息队列的创建和操作。

3. 共享内存（Shared Memory）

   - **特点**：多个进程可以直接访问同一块内存区域，是最快的 IPC 方式之一，但需要同步机制来避免数据竞争。

   - **实现**：在 Unix/Linux 系统中，可以使用 `shmget`、`shmat`、`shmdt`、`shmctl` 等系统调用进行共享内存的创建和管理。

4. 信号（Signal）

   - **特点**：信号是一种异步通信机制，用于通知进程某个事件已经发生。常用于进程间的简单通知。

   - **实现**：在 Unix/Linux 系统中，可以使用 `kill` 系统调用发送信号，使用 `signal` 或 `sigaction` 设置信号处理程序。

5. 信号量（Semaphore）

   - **特点**：信号量是一种用于进程间同步的计数器，可以用来控制多个进程对共享资源的访问。

   - **实现**：在 Unix/Linux 系统中，可以使用 `semget`、`semop`、`semctl` 等系统调用进行信号量的创建和操作。

6. 套接字（Socket）

   - **特点**：套接字是一种底层的网络通信机制，可以用于同一台机器上不同进程之间的通信，也可以用于不同机器上的进程之间的通信，支持双向通信。

   - **实现**：在 Unix/Linux 系统中，可以使用 `socket`、`bind`、`listen`、`accept`、`connect`、`send`、`recv` 等系统调用进行套接字编程。

7. 文件（File）

   - **特点**：通过读写共享文件的方式进行通信，适用于数据量较大且不要求高实时性的场景。

   - **实现**：在所有操作系统中，进程可以通过标准的文件读写操作进行通信。

8. 内存映射文件（Memory-Mapped File）

   - **特点**：通过将文件映射到进程的地址空间，实现进程间的共享内存，适用于大数据量的共享。

   - **实现**：在 Unix/Linux 系统中，可以使用 `mmap` 系统调用创建内存映射文件。



### Java 多线程之间的通信方式？

- 同步，同步是指多个线程通过 synchronized 关键字这种方式来实现线程间的通信。

- while 轮询的方式

- wait/notify 机制

- 信号量

- 管道通信：就是使用 java.io.PipedInputStream 和 java.io.PipedOutputStream进行通信



### Java 并发包提供了哪些并发工具类？

我们通常所说的并发包也就是 `java.util.concurrent` 及其子包，集中了 Java 并发的各种基础工具类，具体主要包括几个方面：

- 提供了比 synchronized 更加高级的各种同步结构，包括 CountDownLatch、CyclicBarrier、Semaphore 等，可以实现更加丰富的多线程操作，比如利用 Semaphore 作为资源控制器，限制同时进行工作的线程数量。
- 各种线程安全的容器，比如最常见的 ConcurrentHashMap、有序的 ConcunrrentSkipListMap，或者通过类似快照机制，实现线程安全的动态数组 CopyOnWriteArrayList 等。
- 各种并发队列实现，如各种 BlockedQueue 实现，比较典型的 ArrayBlockingQueue、 SynchorousQueue 或针对特定场景的 PriorityBlockingQueue 等。
- 强大的 Executor 框架，可以创建各种不同类型的线程池，调度任务运行等，绝大部分情况下，不再需要自己从头实现线程池和任务调度器。

------



## 二、同步机制篇

### Java 同步机制有哪些？

1. synchronized 关键字，这个相信大家很了解，最好能理解其中的原理

2. Lock 接口及其实现类，如 ReentrantLock.ReadLock 和 ReentrantReadWriteLock.WriteLock


3. 信号量（Semaphore）：是一种计数器，用来保护一个或者多个共享资源的访问，它是并发编程的一种基础工具，大多数编程语言都提供这个机制，这也是操作系统中经常提到的
4. CountDownLatch：是 Java 语言提供的同步辅助类，在完成一组正在其他线程中执行的操作之前，他允许线程一直等待
5. CyclicBarrier：也是 java 语言提供的同步辅助类，他允许多个线程在某一个集合点处进行相互等待；
6. Phaser：也是 java 语言提供的同步辅助类，他把并发任务分成多个阶段运行，在开始下一阶段之前，当前阶段中所有的线程都必须执行完成，JAVA7 才有的特性。
7. Exchanger：他提供了两个线程之间的数据交换点。
8. `StampedLock` ：是一种改进的读写锁，提供了三种模式：写锁、悲观读锁和乐观读锁，适用于读多写少的场景。



### synchronized 关键字

> synchoronized的底层是怎么实现的？
>
> synchronized 使用的几种方式和区别？
>
> synchronized说一下，有哪些实用形式？对类加锁时调用方法一定会加锁吗？
>
> synrhronized 锁升级

**使用**

synrhronized 关键字简洁、清晰、语义明确，因此即使有了 Lock 接口，使用的还是非常广泛。其应用层的语义是可以把任何一个非null对象作为"锁"，

- 当 synchronized 作用在方法上时，锁住的便是对象实例（this）；
- 当作用在静态方法时锁住的便是对象对应的 Class 实例，因为 Class数据存在于永久代，因此静态方法锁相当于该类的一个全局锁；
- 当 synchronized 作用于某一个对象实例时，锁住的便是对应的代码块。

**原理**

在 HotSpot JVM实现中，锁有个专门的名字：**对象监视器**。 

在 JVM 中，对象在内存中的布局分为三块区域：**对象头、实例数据和对齐填充**

synchronized 用的锁是存在 Java 对象头里的。

底层实现：

1. 进入时，执行 monitorenter，将计数器 +1，释放锁 monitorexit 时，计数器-1；
2. 当一个线程判断到计数器为 0 时，则当前锁空闲，可以占用；反之，当前线程进入等待状态。

![img](https://www.programcreek.com/wp-content/uploads/2011/12/java-monitor-associate-with-object.jpg)

当执行 monitorenter 指令时，线程试图获取锁也就是获取 monitor(monitor对象存在于每个Java对象的对象头中，synchronized 锁便是通过这种方式获取锁的，也是为什么Java中任意对象可以作为锁的原因) 的持有权。当计数器为0则可以成功获取，获取后将锁计数器设为1也就是加1。相应的在执行 monitorexit 指令后，将锁计数器设为0，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。

该关键字是一个几种锁的封装。

**synchronized 关键字底层原理属于 JVM 层面。**

**① synchronized 同步语句块的情况**

```java
public class SynchronizedDemo {
	public void method() {
		synchronized (this) {
			System.out.println("synchronized 代码块");
		}
	}
}
```

通过 JDK 自带的 javap 命令查看 SynchronizedDemo 类的相关字节码信息：首先切换到类的对应目录执行 `javac SynchronizedDemo.java` 命令生成编译后的 .class 文件，然后执行`javap -c -s -v -l SynchronizedDemo.class`。

**synchronized 同步语句块的实现使用的是 monitorenter 和 monitorexit 指令，其中 monitorenter 指令指向同步代码块的开始位置，monitorexit 指令则指明同步代码块的结束位置。** 当执行 monitorenter 指令时，线程试图获取锁也就是获取 monitor(monitor对象存在于每个 Java 对象的对象头中，synchronized 锁便是通过这种方式获取锁的，也是为什么 Java 中任意对象可以作为锁的原因) 的持有权。当计数器为0则可以成功获取，获取后将锁计数器设为1也就是加1。相应的在执行 monitorexit 指令后，将锁计数器设为0，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。

**② synchronized 修饰方法的的情况**

```java
public class SynchronizedDemo2 {
	public synchronized void method() {
		System.out.println("synchronized 方法");
	}
}
```

synchronized 修饰的方法并没有 monitorenter 指令和 monitorexit 指令，取得代之的确实是 ACC_SYNCHRONIZED 标识，该标识指明了该方法是一个同步方法，JVM 通过该 ACC_SYNCHRONIZED 访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用。

> synchronized 代码块是由一对儿 monitorenter/monitorexit 指令实现的，Monitor 对象是同步的基本实现[单元](https://docs.oracle.com/javase/specs/jls/se10/html/jls-8.html#d5e13622)。
>
> 在 Java 6 之前，Monitor 的实现完全是依靠操作系统内部的互斥锁，因为需要进行用户态到内核态的切换，所以同步操作是一个无差别的重量级操作。
>
> 现代的（Oracle）JDK 中，JVM 对此进行了大刀阔斧地改进，提供了三种不同的 Monitor 实现，也就是常说的三种不同的锁：偏斜锁（Biased Locking）、轻量级锁和重量级锁，大大改进了其性能。
>
> 所谓锁的升级、降级，就是 JVM 优化 synchronized 运行的机制，当 JVM 检测到不同的竞争状况时，会自动切换到适合的锁实现，这种切换就是锁的升级、降级。
>
> 当没有竞争出现时，默认会使用偏斜锁。JVM 会利用 CAS 操作（[compare and swap](https://en.wikipedia.org/wiki/Compare-and-swap)），在对象头上的 Mark Word 部分设置线程 ID，以表示这个对象偏向于当前线程，所以并不涉及真正的互斥锁。这样做的假设是基于在很多应用场景中，大部分对象生命周期中最多会被一个线程锁定，使用偏斜锁可以降低无竞争开销。
>
> 如果有另外的线程试图锁定某个已经被偏斜过的对象，JVM 就需要撤销（revoke）偏斜锁，并切换到轻量级锁实现。轻量级锁依赖 CAS 操作 Mark Word 来试图获取锁，如果重试成功，就使用普通的轻量级锁；否则，进一步升级为重量级锁。
>
> 我注意到有的观点认为 Java 不会进行锁降级。实际上据我所知，锁降级确实是会发生的，当 JVM 进入安全点（[SafePoint](http://blog.ragozin.info/2012/10/safepoints-in-hotspot-jvm.html)）的时候，会检查是否有闲置的 Monitor，然后试图进行降级。



#### 锁升级

在JDK 1.6后，Jvm为了提高锁的获取与释放效率对（synchronized ）进行了优化，引入了 偏向锁 和 轻量级锁 ，从此以后锁的状态就有了四种（无锁、偏向锁、轻量级锁、重量级锁）

- **无锁**

  无锁是指没有对资源进行锁定，所有的线程都能访问并修改同一个资源，但同时只有一个线程能修改成功。

- **偏向锁**

  初次执行到synchronized代码块的时候，锁对象变成偏向锁（通过CAS修改对象头里的锁标志位），字面意思是“偏向于第一个获得它的线程”的锁。执行完同步代码块后，线程并不会主动释放偏向锁。当第二次到达同步代码块时，线程会判断此时持有锁的线程是否就是自己（持有锁的线程ID也在对象头里），如果是则正常往下执行。由于之前没有释放锁，这里也就不需要重新加锁。如果自始至终使用锁的线程只有一个，很明显偏向锁几乎没有额外开销，性能极高。

  当一个线程访问同步代码块并获取锁时，会在 Mark Word 里存储锁偏向的线程 ID。在线程进入和退出同步块时不再通过 CAS 操作来加锁和解锁，而是检测 Mark Word 里是否存储着指向当前线程的偏向锁。轻量级锁的获取及释放依赖多次 CAS 原子指令，而偏向锁只需要在置换 ThreadID 的时候依赖一次 CAS 原子指令即可。

- **轻量级锁（自旋锁）**

  一旦有第二个线程加入锁竞争，偏向锁就升级为轻量级锁（自旋锁），其他线程会通过自旋的形式尝试获取锁，线程不会阻塞，从而提高性能

  没有抢到锁的线程将自旋，即不停地循环判断锁是否能够被成功获取。获取锁的操作，其实就是通过CAS修改对象头里的锁标志位。先比较当前锁标志位是否为“释放”，如果是则将其设置为“锁定”，比较并设置是原子性发生的。这就算抢到锁了，然后线程将当前锁的持有者信息修改为自己。

  长时间的自旋操作是非常消耗资源的，一个线程持有锁，其他线程就只能在原地空耗CPU，执行不了任何有效的任务，这种现象叫做忙等（busy-waiting）

- **重量级锁**

  重量级锁显然，此忙等是有限度的（有个计数器记录自旋次数，默认允许循环10次，可以通过虚拟机参数更改）。如果锁竞争情况严重，某个达到最大自旋次数的线程，会将轻量级锁升级为重量级锁（依然是CAS修改锁标志位，但不修改持有锁的线程ID）。当后续线程尝试获取锁时，发现被占用的锁是重量级锁，则直接将自己挂起（而不是忙等），等待将来被唤醒。

  重量级锁是指当有一个线程获取锁之后，其余所有等待获取该锁的线程都会处于阻塞状态。

  简言之，就是所有的控制权都交给了操作系统，由操作系统来负责线程间的调度和线程的状态变更。而这样会出现频繁地对线程运行状态的切换，线程的挂起和唤醒，从而消耗大量的系统资源



### ReentrantLock (可重入锁) 

**何为可重入**

可重入的意思是某一个线程是否可多次获得一个锁，**在继承的情况下，如果不是可重入的，那就形成死锁了，比如递归调用自己的时候;**，如果不能可重入，每次都获取锁不合适，比如 synchronized 就是可重入的，ReentrantLock也是可重入的

可重入锁，也叫做递归锁，指的是同一线程外层函数获得锁之后 ，内层递归函数仍然有获取该锁的代码，但不受影响。

当某个线程A已经持有了一个锁,当线程B尝试进入被这个锁保护的代码段的时候.就会被阻塞.而锁的操作粒度是”线程”,而不是调用。同一个线程再次进入同步代码的时候.可以使用自己已经获取到的锁,这就是可重入锁

**为什么要可重入**

如果线程A继续再次获得这个锁呢?比如一个方法是synchronized,递归调用自己,那么第一次已经获得了锁,第二次调用的时候还能进入吗? 直观上当然需要能进入.这就要求必须是可重入的.可重入锁又叫做递归锁，不然就死锁了。 

**它实现方式是：**

**为每个锁关联一个获取计数器和一个所有者线程**，当计数值为 0 的时候，这个锁就没有被任何线程持有。当线程请求一个未被持有的锁时，JVM将记下锁的持有者，并且将获取计数值置为 1，如果同一个线程再次获取这个锁，计数值将递增，退出一次同步代码块，计算值递减，当计数值为 0 时，这个锁就被释放 ReentrantLock 里面有实现



**`ReentrantLock` 类是唯一实现了`Lock的类`** ，它拥有与`synchronized` 相同的并发性和内存语义，但是添加了类似**锁投票**、**定时锁等候**和**可中断锁等候**的一些特性。此外，它还提供了在激烈争用情况下**更佳的性能**。（换句话说，当许多线程都想访问共享资源时，JVM 可以花更少的时候来调度线程，把更多时间用在执行线程上。）  

用sychronized修饰的方法或者语句块在代码执行完之后锁自动释放，而是用Lock需要我们**手动释放锁**，所以为了保证锁最终被释放(发生异常情况)，要把互斥区放在try内，释放锁放在finally内！！  



### 谈谈 synchronized和 ReentrantLock 的区别

**① 两者都是可重入锁**

两者都是可重入锁。“可重入锁”概念是：自己可以再次获取自己的内部锁。比如一个线程获得了某个对象的锁，此时这个对象锁还没有释放，当其再次想要获取这个对象的锁的时候还是可以获取的，如果不可锁重入的话，就会造成死锁。同一个线程每次获取锁，锁的计数器都自增1，所以要等到锁的计数器下降为0时才能释放锁。

**② synchronized 依赖于 JVM 而 ReentrantLock 依赖于 API**

synchronized 是依赖于 JVM 实现的，虚拟机团队在 JDK1.6 为 synchronized 关键字进行了很多优化，但是这些优化都是在虚拟机层面实现的，并没有直接暴露给我们。ReentrantLock 是 JDK 层面实现的（也就是 API 层面，需要 lock() 和 unlock() 方法配合 try/finally 语句块来完成），所以我们可以通过查看它的源代码，来看它是如何实现的。

**③ ReentrantLock 比 synchronized 增加了一些高级功能**

相比 synchronized，ReentrantLock 增加了一些高级功能。主要来说主要有三点：**①等待可中断；②可实现公平锁；③可实现选择性通知（锁可以绑定多个条件）**

- **ReentrantLock提供了一种能够中断等待锁的线程的机制**，通过 `lock.lockInterruptibly()` 来实现这个机制。也就是说正在等待的线程可以选择放弃等待，改为处理其他事情。
- **ReentrantLock可以指定是公平锁还是非公平锁。而synchronized只能是非公平锁。所谓的公平锁就是先等待的线程先获得锁。** ReentrantLock 默认情况是非公平的，可以通过 ReentrantLock 类的 `ReentrantLock(boolean fair)` 构造方法来制定是否是公平的。
- synchronized 关键字与 `wait()` 和 `notify()/notifyAll()` 方法相结合可以实现等待/通知机制，ReentrantLock 类当然也可以实现，但是需要借助于 Condition 接口与 `newCondition()` 方法。Condition 是 JDK1.5 之后才有的，它具有很好的灵活性，比如可以实现多路通知功能也就是在一个Lock对象中可以创建多个Condition实例（即对象监视器），**线程对象可以注册在指定的Condition中，从而可以有选择性的进行线程通知，在调度线程上更加灵活。 在使用notify()/notifyAll()方法进行通知时，被通知的线程是由 JVM 选择的，用ReentrantLock类结合Condition实例可以实现“选择性通知”** ，这个功能非常重要，而且是Condition接口默认提供的。而synchronized关键字就相当于整个Lock对象中只有一个Condition实例，所有的线程都注册在它一个身上。如果执行notifyAll()方法的话就会通知所有处于等待状态的线程这样会造成很大的效率问题，而Condition实例的signalAll()方法 只会唤醒注册在该Condition实例中的所有等待线程。

如果你想使用上述功能，那么选择ReentrantLock是一个不错的选择。

**④ 性能已不是选择标准**



### volatile关键字？

> 谈谈你对 volatile 的理解？
>
> 你知道 volatile 底层的实现机制吗？
>
> volatile 变量和 atomic 变量有什么不同？
>
> volatile 的使用场景，你能举两个例子吗？
>
> volatile 能使得一个非原子操作变成原子操作吗？

**volatile是什么？**

在谈及线程安全时，常会说到一个变量——volatile。在《Java并发编程实战》一书中是这么定义volatile的——“Java语言提供了一种稍弱的同步机制，即volatile变量，用来确保将变量的更新操作通知到其他线程”。

这句话说明了两点：

1. volatile变量是一种同步机制；
2. volatile能够确保可见性。

这两点和我们探讨“volatile变量是否能够保证线程安全性”息息相关。

volatile 是 Java 虚拟机提供的轻量级的同步机制，保证了 Java 内存模型的两个特性，可见性、有序性（禁止指令重排）、不能保证原子性。

**场景**：

DCL 版本的单例模式就用到了volatile，因为 DCL 也不一定是线程安全的，`instance = new Singleton();`并不是一个原子操作，会分为 3 部分执行，

1. 给 instance 分配内存
2. 调用 instance 的构造函数来初始化对象
3. 将 instance 对象指向分配的内存空间（执行完这步 instance 就为非 null 了）

步骤 2 和 3 不存在数据依赖关系，如果虚拟机存在指令重排序优化，则步骤 2和 3 的顺序是无法确定的

一句话：在需要保证原子性的场景，不要使用 volatile。



#### **原理**

volatile 可以保证线程可见性且提供了一定的有序性，但是无法保证原子性。在 JVM 底层是基于内存屏障实现的。

- 当对非 volatile 变量进行读写的时候，每个线程先从内存拷贝变量到 CPU 缓存中。如果计算机有多个CPU，每个线程可能在不同的 CPU 上被处理，这意味着每个线程可以拷贝到不同的 CPU cache 中
- 而声明变量是 volatile 的，JVM 保证了每次读变量都从内存中读，跳过 CPU cache 这一步，所以就不会有可见性问题
  - 对 volatile 变量进行写操作时，会在写操作后加一条 store 屏障指令，将工作内存中的共享变量刷新回主内存；
  - 对 volatile 变量进行读操作时，会在写操作后加一条 load 屏障指令，从主内存中读取共享变量；

> **可见性**
>
> 　　volatile能够保证字段的可见性：volatile变量，用来确保将变量的更新操作通知到其他线程。volatile变量不会被缓存在寄存器或者对其他处理器不可见的地方，因此在读取volatile类型的变量时总会返回最新写入的值。
>
> 　　可见性和“线程如何对变量进行操作(取值、赋值等)”有关系：
>
> 　　我们要先明确一个**定律**：线程对变量的所有操作(取值、赋值等)都必须在工作内存（各线程独立拥有）中进行，而不能直接读写内存中的变量，各工作内存间也不能相互访问。对于volatile变量来说，由于它特殊的操作顺序性规定，看起来如同操作主内存一般，但实际上 volatile变量也是遵循这一定律的。
>
> 　　关于主存与工作内存之间具体的交互协议（即一个变量如何从主存拷贝到工作内存、如何从工作内存同步到主存等实现细节），Java内存模型中定义了以下八种操作来完成：
>
> 　　　　lock:(锁定)，unlock(解锁)，read(读取)，load(载入)，use(试用)， assign(赋值)，store(存储)，write(写入)。
>
> 　　volatile 对这八种操作有着两个特殊的限定，正因为有这些限定才让volatile修饰的变量有可见性以及可以禁止指令重排序 ：
>
> 　　　　① use动作之前必须要有read和load动作， 这三个动作必须是连续出现的。【表示：每次工作内存要使用volatile变量之前必须去主存中拿取最新的volatile变量】
>
> 　　　　② assign动作之后必须跟着store和write动作，这三个动作必须是连续出现的。【表示: 每次工作内存改变了volatile变量的值，就必须把该值写回到主存中】
>
> 　　有以上两条规则就能保证每个线程每次去拿volatile变量的时候，那个变量肯定是最新的， 其实也就相当于好多个线程用的是同一个内存，无工作内存和主存之分。而操作没有用volatile修饰的变量则不能保证每次都能获取到最新的变量值。



### volatile 是线程安全的吗

**因为volatile不能保证变量操作的原子性，所以试图通过volatile来保证线程安全性是不靠谱的**



### synchronized 关键字和 volatile 关键字的区别?

`synchronized` 关键字和 `volatile` 关键字是两个互补的存在，而不是对立的存在：

- **volatile关键字**是线程同步的**轻量级实现**，所以**volatile性能肯定比synchronized关键字要好**。但是**volatile关键字只能用于变量而synchronized关键字可以修饰方法以及代码块**。synchronized关键字在JavaSE1.6之后进行了主要包括为了减少获得锁和释放锁带来的性能消耗而引入的偏向锁和轻量级锁以及其它各种优化之后执行效率有了显著提升，**实际开发中使用 synchronized 关键字的场景还是更多一些**。
- **多线程访问volatile关键字不会发生阻塞，而synchronized关键字可能会发生阻塞**
- **volatile关键字能保证数据的可见性，但不能保证数据的原子性。synchronized关键字两者都能保证。**
- **volatile关键字主要用于解决变量在多个线程之间的可见性，而 synchronized关键字解决的是多个线程之间访问资源的同步性。**



### 什么是线程死锁? 如何避免死锁?

线程死锁描述的是这样一种情况：多个线程同时被阻塞，它们中的一个或者全部都在等待某个资源被释放。由于线程被无限期地阻塞，因此程序不可能正常终止。

如下图所示，线程 A 持有资源 2，线程 B 持有资源 1，他们同时都想申请对方的资源，所以这两个线程就会互相等待而进入死锁状态。

![img](https://ask.qcloudimg.com/http-save/5876652/1t73ossag1.jpeg)

下面通过一个例子来说明线程死锁,代码模拟了上图的死锁的情况 (代码来源于《并发编程之美》)：

```JAVA
public class DeadLockDemo {
    private static Object resource1 = new Object();//资源 1
    private static Object resource2 = new Object();//资源 2

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (resource1) {
                System.out.println(Thread.currentThread() + "get resource1");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread() + "waiting get resource2");
                synchronized (resource2) {
                    System.out.println(Thread.currentThread() + "get resource2");
                }
            }
        }, "线程 1").start();

        new Thread(() -> {
            synchronized (resource2) {
                System.out.println(Thread.currentThread() + "get resource2");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread() + "waiting get resource1");
                synchronized (resource1) {
                    System.out.println(Thread.currentThread() + "get resource1");
                }
            }
        }, "线程 2").start();
    }
}
```

Output

```
Thread[线程 1,5,main]get resource1
Thread[线程 2,5,main]get resource2
Thread[线程 1,5,main]waiting get resource2
Thread[线程 2,5,main]waiting get resource1
```

线程 A 通过 synchronized (resource1) 获得 resource1 的监视器锁，然后通过 `Thread.sleep(1000);`让线程 A 休眠 1s 为的是让线程 B 得到执行然后获取到 resource2 的监视器锁。线程 A 和线程 B 休眠结束了都开始企图请求获取对方的资源，然后这两个线程就会陷入互相等待的状态，这也就产生了死锁。上面的例子符合产生死锁的四个必要条件。学过操作系统的朋友都知道产生死锁必须具备以下四个条件：

- 互斥条件：该资源任意一个时刻只由一个线程占用。
- 占有且等待：一个进程因请求资源而阻塞时，对已获得的资源保持不放。
- 不可强行占有：线程已获得的资源在末使用完之前不能被其他线程强行剥夺，只有自己使用完毕后才释放资源
- 循环等待条件：若干进程之间形成一种头尾相接的循环等待资源关系。



### 如何避免线程死锁?

我上面说了产生死锁的四个必要条件，为了避免死锁，我们只要破坏产生死锁的四个条件中的其中一个就可以了。现在我们来挨个分析一下：

1. **破坏互斥条件** ：这个条件我们没有办法破坏，因为我们用锁本来就是想让他们互斥的（临界资源需要互斥访问）。
2. **破坏请求与保持条件**  ：一次性申请所有的资源。
3. **破坏不剥夺条件** ：占用部分资源的线程进一步申请其他资源时，如果申请不到，可以主动释放它占有的资源。
4. **破坏循环等待条件** ：靠按序申请资源来预防。按某一顺序申请资源，释放资源则反序释放。破坏循环等待条件。

我们对线程 2 的代码修改成下面这样就不会产生死锁了。

```java
new Thread(() -> {
    synchronized (resource1) {
        System.out.println(Thread.currentThread() + "get resource1");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread() + "waiting get resource2");
        synchronized (resource2) {
            System.out.println(Thread.currentThread() + "get resource2");
        }
    }
}, "线程 2").start();
```

Output

```
Thread[线程 1,5,main]get resource1
Thread[线程 1,5,main]waiting get resource2
Thread[线程 1,5,main]get resource2
Thread[线程 2,5,main]get resource1
Thread[线程 2,5,main]waiting get resource2
Thread[线程 2,5,main]get resource2

Process finished with exit code 0
```

我们分析一下上面的代码为什么避免了死锁的发生?

线程 1 首先获得到 resource1 的监视器锁，这时候线程 2 就获取不到了。然后线程 1 再去获取 resource2 的监视器锁，可以获取到。然后线程 1 释放了对 resource1、resource2 的监视器锁的占用，线程 2 获取到就可以执行了。这样就破坏了破坏循环等待条件，因此避免了死锁。



### 如何排查死锁?

定位死锁最常见的方式就是利用 jstack 等工具获取线程栈，然后定位互相之间的依赖关系，进而找到死锁。如果是比较明显的死锁，往往 jstack 等就能直接定位，类似 JConsole 甚至可以在图形界面进行有限的死锁检测。

如果程序运行时发生了死锁，绝大多数情况下都是无法在线解决的，只能重启、修正程序本身问题。所以，代码开发阶段互相审查，或者利用工具进行预防性排查，往往也是很重要的。

#### 死锁预防

1. 以确定的顺序获得锁

   如果必须获取多个锁，那么在设计的时候需要充分考虑不同线程之前获得锁的顺序

2. 超时放弃

   当使用 synchronized 关键词提供的内置锁时，只要线程没有获得锁，那么就会永远等待下去，然而Lock接口提供了`boolean tryLock(long time, TimeUnit unit) throws InterruptedException`方法，该方法可以按照固定时长等待锁，因此线程可以在获取锁超时以后，主动释放之前已经获得的所有的锁。通过这种方式，也可以很有效地避免死锁。



### 何谓悲观锁与乐观锁?

- **悲观锁**

  总是假设最坏的情况，每次去拿数据的时候都认为别人会修改，所以每次在拿 数据的时候都会上锁，这样别人想拿这个数据就会阻塞直到它拿到锁(共享资 源每次只给一个线程使用，其它线程阻塞，用完后再把资源转让给其它线 程)。传统的关系型数据库里边就用到了很多这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁。Java 中 synchronized 和 ReentrantLock 等独占锁就是悲观锁思想的实现。

- **乐观锁**

  总是假设最好的情况，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号机制和 CAS 算法实现。乐观锁适用于多读的应用类型，这样可以提 高吞吐量，像数据库提供的类似于 **write_condition** 机制，其实都是提供的乐 观锁。在 Java 中 java.util.concurrent.atomic 包下面的原子变量类就是使用了 乐观锁的一种实现方式 **CAS** 实现的。

**两种锁的使用场景**

从上面对两种锁的介绍，我们知道两种锁各有优缺点，不可认为一种好于另一 种，像**乐观锁适用于写比较少的情况下(多读场景)**，即冲突真的很少发生的 时候，这样可以省去了锁的开销，加大了系统的整个吞吐量。但如果是多写的情况，一般会经常产生冲突，这就会导致上层应用会不断的进行 retry，这样反倒是降低了性能，所以**一般多写的场景下用悲观锁就比较合适**。



##  三、同步工具类

**`CountDownLatch`**

- 用于等待其他线程完成操作。

**`CyclicBarrier`**

- 用于多个线程互相等待，直到所有线程都到达某个屏障点再继续执行。

**`Semaphore`**

- 用于控制同时访问特定资源的线程数量。

**`Exchanger`**

- 用于两个线程之间交换数据。

------



## 四、JMM篇

> 
>
> 指令重排
>
> 内存屏障
>
> 单核CPU有可见性问题吗

### 谈谈 Java 内存模型

Java 虚拟机规范中试图定义一种「 **Java 内存模型**」来**屏蔽掉各种硬件和操作系统的内存访问差异**，以实现**让 Java 程序在各种平台下都能达到一致的内存访问效果**

**JMM组成**：

- 主内存：Java 内存模型规定了所有变量都存储在主内存中（此处的主内存与物理硬件的主内存 RAM 名字一样，两者可以互相类比，但此处仅是虚拟机内存的一部分）。

- 工作内存：每条线程都有自己的工作内存，线程的工作内存中保存了该线程使用到的主内存中的共享变量的副本拷贝。**线程对变量的所有操作都必须在工作内存进行，而不能直接读写主内存中的变量**。**工作内存是 JMM 的一个抽象概念，并不真实存在**。

**特性**：

JMM 就是用来解决如上问题的。 **JMM是围绕着并发过程中如何处理可见性、原子性和有序性这 3 个 特征建立起来的**

- **可见性**：可见性是指当一个线程修改了共享变量的值，其他线程能够立即得知这个修改。Java 中的 volatile、synchronzied、final 都可以实现可见性

- **原子性**：即一个操作或者多个操作，要么全部执行并且执行的过程不会被任何因素打断，要么就都不执行。即使在多个线程一起执行的时候，一个操作一旦开始，就不会被其他线程所干扰。

- **有序性**：

  计算机在执行程序时，为了提高性能，编译器和处理器常常会对指令做重排，一般分为以下 3 种

  ![img](https://img2018.cnblogs.com/blog/1742516/201910/1742516-20191014224010984-843081793.png)

  单线程环境里确保程序最终执行结果和代码顺序执行的结果一致；

  处理器在进行重排序时必须要考虑指令之间的**数据依赖性**；

  多线程环境中线程交替执行，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致性是无法确定的，结果无法预测

> JMM 是不区分 JVM 到底是运行在单核处理器、多核处理器的，Java 内存模型是对 CPU 内存模型的抽象，这是一个 High-Level 的概念，与具体的 CPU 平台没啥关系



### Java 内存模型中的 happen-before 是什么？

happens-before 先行发生，是 Java 内存模型中定义的两项操作之间的偏序关系，**如果操作 A 先行发生于操作 B，那么 A 的结果对 B 可见**。

内存屏障是被插入两个 CPU 指令之间的一种指令，用来禁止处理器指令发生重排序（像屏障一样），从而保障**有序性**的。

Happen-before 关系，是 Java 内存模型中保证多线程操作可见性的机制，也是对早期语言规范中含糊的可见性概念的一个精确定义。

它的具体表现形式，包括但远不止是我们直觉中的 synchronized、volatile、lock 操作顺序等方面，例如：

- 线程内执行的每个操作，都保证 happen-before 后面的操作，这就保证了基本的程序顺序规则，这是开发者在书写程序时的基本约定。
- 对于 volatile 变量，对它的写操作，保证 happen-before 在随后对该变量的读取操作。
- 对于一个锁的解锁操作，保证 happen-before 加锁操作。
- 对象构建完成，保证 happen-before 于 finalizer 的开始动作。
- 甚至是类似线程内部操作的完成，保证 happen-before 其他 Thread.join() 的线程等。

这些 happen-before 关系是存在着传递性的，如果满足 a happen-before b 和 b happen-before c，那么 a happen-before c 也成立。

前面我一直用 happen-before，而不是简单说前后，是因为它不仅仅是对执行时间的保证，也包括对内存读、写操作顺序的保证。仅仅是时钟顺序上的先后，并不能保证线程交互的可见性。



## 五、原子操作

> Atomic~CAS篇
>
> **`java.util.concurrent.atomic` 包**
>
> - `AtomicInteger`、`AtomicLong`、`AtomicReference` 等。
>
> **CAS（Compare And Swap）**
>
> - CAS 的原理、优缺点。
>
> CAS 知道吗，如何实现？
> 讲一讲AtomicInteger，为什么要用 CAS 而不是 synchronized？
> CAS 底层原理，谈谈你对 UnSafe 的理解？
> AtomicInteger 的ABA问题，能说一下吗，原子更新引用知道吗？
> CAS 有什么缺点吗？ 如何规避 ABA 问题？



### AtomicInteger 底层实现原理是什么？如何在自己的产品代码中应用 CAS 操作？

AtomicIntger 是对 int 类型的一个封装，提供原子性的访问和更新操作，其原子性操作的实现是基于 CAS（[compare-and-swap](https://en.wikipedia.org/wiki/Compare-and-swap)）技术。

所谓 CAS，表征的是一系列操作的集合，获取当前数值，进行一些运算，利用 CAS 指令试图进行更新。如果当前数值未变，代表没有其他线程进行并发修改，则成功更新。否则，可能出现不同的选择，要么进行重试，要么就返回一个成功或者失败的结果。

从 AtomicInteger 的内部属性可以看出，它依赖于 Unsafe 提供的一些底层能力，进行底层操作；以 volatile 的 value 字段，记录数值，以保证可见性。

```java
private static final jdk.internal.misc.Unsafe U = jdk.internal.misc.Unsafe.getUnsafe();
private static final long VALUE = U.objectFieldOffset(AtomicInteger.class, "value");
private volatile int value;
```

具体的原子操作细节，可以参考任意一个原子更新方法，比如下面的 getAndIncrement。

Unsafe 会利用 value 字段的内存地址偏移，直接完成操作。

```java
public final int getAndIncrement() {
    return U.getAndAddInt(this, VALUE, 1);
}
```

因为 getAndIncrement 需要返归数值，所以需要添加失败重试逻辑。

```java
public final int getAndAddInt(Object o, long offset, int delta) {
    int v;
    do {
        v = getIntVolatile(o, offset);
    } while (!weakCompareAndSetInt(o, offset, v, v + delta));
    return v;
}
```

而类似 compareAndSet 这种返回 boolean 类型的函数，因为其返回值表现的就是成功与否，所以不需要重试。

```java
public final boolean compareAndSet(int expectedValue, int newValue)
```

CAS 是 Java 并发中所谓 lock-free 机制的基础。



Java 虚拟机又提供了一个轻量级的同步机制——volatile，但是 volatile 算是乞丐版的 synchronized，并不能保证原子性 ，所以，又增加了`java.util.concurrent.atomic`包， 这个包下提供了一系列原子类。



### **Atomic**？

AtomicBoolean、AtomicInteger、tomicIntegerArray、AtomicReference、AtomicStampedReference

常用方法：

addAndGet(int)、getAndIncrement()、compareAndSet(int, int)

### **CAS**？

- CAS：全称 `Compare and swap`，即**比较并交换**，它是一条 **CPU 同步原语**。 是一种硬件对并发的支持，针对多处理器操作而设计的一种特殊指令，用于管理对共享数据的并发访问。 
- CAS 是一种无锁的非阻塞算法的实现。 
- CAS 包含了 3 个操作数：
  - 需要读写的内存值 V 
  - 旧的预期值 A 
  - 要修改的更新值 B 
- 当且仅当 V 的值等于 A 时，CAS 通过原子方式用新值 B 来更新 V 的 值，否则不会执行任何操作（他的功能是判断内存某个位置的值是否为预期值，如果是则更改为新的值，这个过程是原子的。）
- 缺点
  - 循环时间长，开销很大
  - 只能保证一个共享变量的原子操作
  - ABA 问题（用 AtomicReference 避免）

### Unsafe

CAS 并发原语体现在 Java 语言中的 `sum.misc.Unsafe` 类中的各个方法。调用 Unsafe 类中的 CAS 方法， JVM 会帮助我们实现出 CAS 汇编指令。

是 CAS 的核心类，由于 Java 方法无法直接访问底层系统，需要通过本地（native）方法来访问，UnSafe 相当于一个后门，UnSafe 类中的所有方法都是 native 修饰的，也就是说该类中的方法都是直接调用操作系统底层资源执行相应任务。 



## 六、线程池

> 线程池原理，拒绝策略，核心线程数
>
> 为什么要用线程池，优势是什么？
>
> 线程池的工作原理，几个重要参数，给了具体几个参数分析线程池会怎么做，阻塞队列的作用是什么？
>
> 说说几种常见的线程池及使用场景?
>
> 线程池的构造类的方法的 5 个参数的具体意义是什么
>
> 按线程池内部机制，当提交新任务时，有哪些异常要考虑
>
> 单机上一个线程池正在处理服务，如果忽然断电怎么办（正在处理和阻塞队列里的请求怎么处理）？
>
> 生产上如何合理设置参数？



### 为什么要用线程池，优势是什么？

> **池化技术相比大家已经屡见不鲜了，线程池、数据库连接池、Http 连接池等等都是对这个思想的应用。池化技术的思想主要是为了减少每次获取资源的消耗，提高对资源的利用率。**

线程池是一种基于池化思想管理线程的工具。

线程池解决的核心问题就是资源管理问题。在并发环境下，系统不能够确定在任意时刻中，有多少任务需要执行，有多少资源需要投入。这种不确定性将带来以下若干问题：

1. 频繁申请/销毁资源和调度资源，将带来额外的消耗，可能会非常巨大。
2. 对资源无限申请缺少抑制手段，易引发系统资源耗尽的风险。
3. 系统无法合理管理内部的资源分布，会降低系统的稳定性。

为解决资源分配这个问题，线程池采用了“池化”思想。



线程池做的工作主要是控制运行的线程数量，处理过程中将任务放入队列，然后在线程创建后启动这些任务，如果线程数量超过了最大数量，超出数量的线程排队等候，等其他线程执行完毕，再从队列中取出任务来执行。

主要优点：

1. **降低资源消耗**：线程复用，通过重复利用已创建的线程减低线程创建和销毁造成的消耗
2. **提高响应速度**：当任务到达时，任务可以不需要等到线程创建就能立即执行
3. **提高线程的可管理性**：线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。
4. **提供更多更强大的功能**：线程池具备可拓展性，允许开发人员向其中增加更多的功能。比如延时定时线程池ScheduledThreadPoolExecutor，就允许任务延期执行或定期执行。



### Java 并发类库提供的线程池有哪几种？ 分别有什么特点？

常见的线程池的使用方式：

- newFixedThreadPool   创建一个指定工作线程数量的线程池
- newSingleThreadExecutor   创建一个单线程化的Executor，它的特点在于工作线程数目被限制为 1，操作一个无界的工作队列，所以它保证了所有任务的都是被顺序执行，最多会有一个任务处于活动状态，并且不允许使用者改动线程池实例，因此可以避免其改变线程数目。
- newCachedThreadPool  创建一个可缓存线程池，它会试图缓存线程并重用，当无缓存线程可用时，就会创建新的工作线程；如果线程闲置的时间超过 60 秒，则被终止并移出缓存；长时间闲置时，这种线程池，不会消耗什么资源。其内部使用 SynchronousQueue 作为工作队列。
- newScheduledThreadPool   创建一个定长的线程池，而且支持定时的以及周期性的任务执行，支持定时及周期性任务执行
- newWorkStealingPool  Java8 新特性，使用目前机器上可用的处理器作为它的并行级别



### 线程池的几个重要参数

常用的构造线程池方法其实最后都是通过 **ThreadPoolExecutor** 实例来创建的，且该构造器有 7 大参数。

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {//...}
```

- **corePoolSize：** 线程池中的常驻核心线程数

  - 创建线程池后，当有请求任务进来之后，就会安排池中的线程去执行请求任务，近似理解为近日当值线程
  - 当线程池中的线程数目达到 corePoolSize 后，就会把到达的任务放到缓存队列中

- **maximumPoolSize：** 线程池最大线程数大小，该值必须大于等于 1

- **keepAliveTime：** 线程池中非核心线程空闲的存活时间

  - 当前线程池数量超过 corePoolSize 时，当空闲时间达到 keepAliveTime 值时，非核心线程会被销毁直到只剩下 corePoolSize 个线程为止

- **unit：** keepAliveTime 的时间单位

- **workQueue：** 存放任务的阻塞队列，被提交但尚未被执行的任务

- **threadFactory：** 用于设置创建线程的工厂，可以给创建的线程设置有意义的名字，可方便排查问题

- **handler：** 拒绝策略，表示当队列满了且工作线程大于等于线程池的最大线程数（maximumPoolSize）时如何来拒绝请求执行的线程的策略，主要有四种类型。

  等待队列也已经满了，再也塞不下新任务。同时，线程池中的 max 线程也达到了，无法继续为新任务服务，这时候我们就需要拒绝策略合理的处理这个问题了。

  - AbortPolicy   直接抛出 RegectedExcutionException 异常阻止系统正常进行，**默认策略**
  - DiscardPolicy  直接丢弃任务，不予任何处理也不抛出异常，如果允许任务丢失，这是最好的一种方案
  - DiscardOldestPolicy  抛弃队列中等待最久的任务，然后把当前任务加入队列中尝试再次提交当前任务
  - CallerRunsPolicy  交给线程池调用所在的线程进行处理，“调用者运行”的一种调节机制，该策略既不会抛弃任务，也不会抛出异常，而是将某些任务回退到调用者，从而降低新任务的流量

  以上内置拒绝策略均实现了 RejectExcutionHandler 接口



### 线程池工作原理

![Java线程池实现原理及其在美团业务中的实践- 美团技术团队](https://p0.meituan.net/travelcube/77441586f6b312a54264e3fcf5eebe2663494.png)

**线程池在内部实际上构建了一个生产者消费者模型，将线程和任务两者解耦，并不直接关联，从而良好的缓冲任务，复用线程**。线程池的运行主要分成两部分：**任务管理、线程管理**。任务管理部分充当生产者的角色，当任务提交后，线程池会判断该任务后续的流转：

- 直接申请线程执行该任务；
- 缓冲到队列中等待线程执行；
- 拒绝该任务。

线程管理部分是消费者，它们被统一维护在线程池内，根据任务请求进行线程的分配，当线程执行完任务后则会继续获取新的任务去执行，最终当线程获取不到任务的时候，线程就会被回收。

流程：

1. 在创建线程池后，等待提交过来的任务请求

2. 当调用 execute() 方法添加一个请求任务时，线程池会做如下判断：

   - 如果正在运行的线程数量小于 corePoolSize，那么马上创建线程运行这个任务
   - 如果正在运行的线程数量大于或等于 corePoolSize，那么将这个任务**放入队列**
   - 如果这个时候队列满了且正在运行的线程数量还小于 maximumPoolSize，那么创建非核心线程立刻运行这个任务
   - 如果队列满了且正在运行的线程数量大于或等于 maximumPoolSize，那么线程池**会启动饱和拒绝策略来执行**

3. 当一个线程完成任务时，它会从队列中取下一个任务来执行

4. 当一个线程无事可做超过一定的时间（keepAliveTime）时，线程池会判断：

   - 如果当前运行的线程数大于 corePoolSize，那么这个线程就被停掉
   - 所以线程池的所有任务完成后它**最终会收缩到 corePoolSize 的大小**



### Java线程池，5核心、10最大、20队列，第6个任务来了是什么状态？第26个任务来了是什么状态？队列满了以后执行队列的任务是从队列头 or 队尾取？核心线程和非核心线程执行结束后，谁先执行队列里的任务？

**问题1：第6个任务的状态**

当第6个任务到来时，假设前5个任务已经填满了核心线程，线程池的行为如下：

1. 前5个任务由核心线程处理，核心线程数为 5。
2. 第6个任务将被放入任务队列中，因为此时队列还没有满。

因此，第6个任务将处于等待状态，在任务队列中等待被执行。

**问题2：第26个任务的状态**

当第26个任务到来时，假设前面的任务已经按照规则被处理过，线程池的行为如下：

1. 核心线程处理了前5个任务。
2. 任务队列大小为 20，因此第6到第25个任务会被放入队列中。
3. 当第26个任务到来时，核心线程数为 5，任务队列已经满（20 个任务），此时当前线程数小于最大线程数（10），线程池将创建新的线程来处理任务。

因此，第26个任务将由新创建的线程（非核心线程）来处理。

**问题3：队列任务的取出顺序**

Java 中的 `ThreadPoolExecutor` 默认使用 `LinkedBlockingQueue` 作为任务队列，这个队列是一个先进先出（FIFO）的队列。因此，当任务队列中的任务被取出执行时，是从队列头部取出。

**问题4：核心线程和非核心线程执行结束后，谁先执行队列里的任务？**

在 `ThreadPoolExecutor` 中，当核心线程和非核心线程执行完任务后，如果队列中有等待的任务，以下是任务执行的顺序：

1. 如果核心线程有空闲，则由核心线程优先从队列头部取任务执行。
2. 如果没有空闲的核心线程，而有空闲的非核心线程，则由非核心线程从队列头部取任务执行。

换句话说，线程池会尽量保持核心线程忙碌，并优先使用核心线程来处理任务。当核心线程忙碌时，非核心线程才会处理队列中的任务。



### 合理配置线程池你是如何考虑的？（创建多少个线程合适）

首先要考虑到 CPU 核心数，那么在 Java 中如何获取核心线程数？

可以使用 `Runtime.getRuntime().availableProcessor()` 方法来获取（可能不准确，作为参考）

在确认了核心数后，再去判断是 CPU 密集型任务还是 IO 密集型任务：

- **CPU 密集型任务**：CPU密集型也叫计算密集型，这种类型大部分状况下，CPU使用时间远高于I/O耗时。有许多计算要处理、许多逻辑判断，几乎没有I/O操作的任务就属于 CPU 密集型。

  CPU 密集任务只有在真正的多核 CPU 上才可能得到加速（通过多线程）

  而在单核 CPU 上，无论开几个模拟的多线程该任务都不可能得到加速，因为 CPU 总的运算能力就那些。

  如果是 CPU 密集型任务，频繁切换上下线程是不明智的，此时应该设置一个较小的线程数

  一般公式：**CPU 核数 + 1 个线程的线程池**

  为什么 +1 呢？

  《Java并发编程实战》一书中给出的原因是：**即使当计算（CPU）密集型的线程偶尔由于页缺失故障或者其他原因而暂停时，这个“额外”的线程也能确保 CPU 的时钟周期不会被浪费。**

- **IO 密集型任务**：与之相反，IO 密集型则是系统运行时，大部分时间都在进行 I/O 操作，CPU 占用率不高。比如像 MySQL 数据库、文件的读写、网络通信等任务，这类任务**不会特别消耗 CPU 资源，但是 IO 操作比较耗时，会占用比较多时间**。

  在单线程上运行 IO 密集型的任务会导致浪费大量的 CPU 运算能力浪费在等待。

  所以在 IO 密集型任务中使用多线程可以大大的加速程序运行，即使在单核 CPU 上，这种加速主要就是利用了被浪费调的阻塞时间。

  IO 密集型时，大部分线程都阻塞，故需要多配置线程数：

  参考公式： CPU 核数/（1- 阻塞系数）   阻塞系数在 0.8~0.9 之间

  比如 8 核 CPU：8/（1 -0.9）= 80个线程数


  这个其实没有一个特别适用的公式，肯定适合自己的业务，美团给出了个**动态更新**的逻辑，可以看看



### 执行execute()方法和submit()方法的区别是什么呢？

1. **execute()方法用于提交不需要返回值的任务，所以无法判断任务是否被线程池执行成功与否；**
2. **submit()方法用于提交需要返回值的任务。线程池会返回一个 Future 类型的对象，通过这个 Future 对象可以判断任务是否执行成功**，并且可以通过 `Future` 的 `get()`方法来获取返回值，`get()`方法会阻塞当前线程直到任务完成，而使用 `get（long timeout，TimeUnit unit）`方法则会阻塞当前线程一段时间后立即返回，这时候有可能任务没有执行完。

我们以**`AbstractExecutorService`**接口中的一个 `submit` 方法为例子来看看源代码：

```java
    public Future<?> submit(Runnable task) {
        if (task == null) throw new NullPointerException();
        RunnableFuture<Void> ftask = newTaskFor(task, null);
        execute(ftask);
        return ftask;
    }
```

上面方法调用的 `newTaskFor` 方法返回了一个 `FutureTask` 对象。

```java
    protected <T> RunnableFuture<T> newTaskFor(Runnable runnable, T value) {
        return new FutureTask<T>(runnable, value);
    }
```

我们再来看看`execute()`方法：

```java
    public void execute(Runnable command) {
      ...
    }
```



### 如何创建线程池？

《阿里巴巴Java开发手册》中强制线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险

> Executors 返回线程池对象的弊端如下：
>
> - **FixedThreadPool 和 SingleThreadExecutor** ： 允许请求的队列长度为 Integer.MAX_VALUE ，可能堆积大量的请求，从而导致OOM。
> - **CachedThreadPool 和 ScheduledThreadPool** ： 允许创建的线程数量为 Integer.MAX_VALUE ，可能会创建大量线程，从而导致OOM。



### 当提交新任务时，异常如何处理?

1. 在任务代码try/catch捕获异常

2. 通过Future对象的get方法接收抛出的异常，再处理

3. 为工作者线程设置UncaughtExceptionHandler，在uncaughtException方法中处理异常

   ```java
   ExecutorService threadPool = Executors.newFixedThreadPool(1, r -> {
               Thread t = new Thread(r);
               t.setUncaughtExceptionHandler(
                       (t1, e) -> {
                           System.out.println(t1.getName() + "线程抛出的异常"+e);
                       });
               return t;
              });
           threadPool.execute(()->{
               Object object = null;
               System.out.print("result## " + object.toString());
           });
   ```

4. 重写ThreadPoolExecutor的afterExecute方法，处理传递的异常引用

   ```java
   class ExtendedExecutor extends ThreadPoolExecutor {
       // 这可是jdk文档里面给的例子。。
       protected void afterExecute(Runnable r, Throwable t) {
           super.afterExecute(r, t);
           if (t == null && r instanceof Future<?>) {
               try {
                   Object result = ((Future<?>) r).get();
               } catch (CancellationException ce) {
                   t = ce;
               } catch (ExecutionException ee) {
                   t = ee.getCause();
               } catch (InterruptedException ie) {
                   Thread.currentThread().interrupt(); // ignore/reset
               }
           }
           if (t != null)
               System.out.println(t);
       }
   }}
   
   ```



## 七、AQS篇

### AQS 介绍

AQS的全称为（AbstractQueuedSynchronizer），这个类在java.util.concurrent.locks包下面。

AQS是一个用来构建锁和同步器的框架，使用AQS能简单且高效地构造出应用广泛的大量的同步器，比如我们提到的ReentrantLock，Semaphore，其他的诸如ReentrantReadWriteLock，SynchronousQueue，FutureTask 等等皆是基于 AQS 的。当然，我们自己也能利用 AQS 非常轻松容易地构造出符合我们自己需求的同步器。

### AQS 原理分析

AQS 原理这部分参考了部分博客，在5.2节末尾放了链接。

> 在面试中被问到并发知识的时候，大多都会被问到“请你说一下自己对于AQS原理的理解”。下面给大家一个示例供大家参加，面试不是背题，大家一定要加入自己的思想，即使加入不了自己的思想也要保证自己能够通俗的讲出来而不是背出来。

下面大部分内容其实在AQS类注释上已经给出了，不过是英语看着比较吃力一点，感兴趣的话可以看看源码。

**AQS核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制AQS是用CLH队列锁实现的，即将暂时获取不到锁的线程加入到队列中。**

> CLH(Craig,Landin,and Hagersten)队列是一个虚拟的双向队列（虚拟的双向队列即不存在队列实例，仅存在结点之间的关联关系）。AQS 是将每条请求共享资源的线程封装成一个 CLH 锁队列的一个结点（Node）来实现锁的分配。

看个 AQS(AbstractQueuedSynchronizer)原理图：

![image.png](https://blog-1300588375.cos.ap-chengdu.myqcloud.com/image_1624029202628.png)

AQS 使用一个 int 成员变量来表示同步状态，通过内置的 FIFO 队列来完成获取资源线程的排队工作。AQS 使用 CAS 对该同步状态进行原子操作实现对其值的修改。

```java
private volatile int state;//共享变量，使用volatile修饰保证线程可见性
```

状态信息通过 protected 类型的 getState，setState，compareAndSetState 进行操作

```java
//返回同步状态的当前值
protected final int getState() {  
        return state;
}
 // 设置同步状态的值
protected final void setState(int newState) { 
        state = newState;
}
//原子地（CAS操作）将同步状态值设置为给定值update如果当前同步状态的值等于expect（期望值）
protected final boolean compareAndSetState(int expect, int update) {
        return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
}
```



**AQS定义两种资源共享方式**

- Exclusive

  （独占）：只有一个线程能执行，如 ReentrantLock。又可分为公平锁和非公平锁：

  - 公平锁：按照线程在队列中的排队顺序，先到者先拿到锁
  - 非公平锁：当线程要获取锁时，无视队列顺序直接去抢锁，谁抢到就是谁的

- **Share**（共享）：多个线程可同时执行，如 Semaphore/CountDownLatch。Semaphore、CountDownLatch、 CyclicBarrier、ReadWriteLock。

ReentrantReadWriteLock 可以看成是组合式，因为ReentrantReadWriteLock 也就是读写锁允许多个线程同时对某一资源进行读。

不同的自定义同步器争用共享资源的方式也不同。自定义同步器在实现时只需要实现共享资源 state 的获取与释放方式即可，至于具体线程等待队列的维护（如获取资源失败入队/唤醒出队等），AQS已经在顶层实现好了。

**AQS底层使用了模板方法模式**

同步器的设计是基于模板方法模式的，如果需要自定义同步器一般的方式是这样（模板方法模式很经典的一个应用）：

1. 使用者继承AbstractQueuedSynchronizer并重写指定的方法。（这些重写方法很简单，无非是对于共享资源state的获取和释放）
2. 将AQS组合在自定义同步组件的实现中，并调用其模板方法，而这些模板方法会调用使用者重写的方法。

这和我们以往通过实现接口的方式有很大区别，这是模板方法模式很经典的一个运用。

**AQS使用了模板方法模式，自定义同步器时需要重写下面几个AQS提供的模板方法：**

```
isHeldExclusively()//该线程是否正在独占资源。只有用到condition才需要去实现它。
tryAcquire(int)//独占方式。尝试获取资源，成功则返回true，失败则返回false。
tryRelease(int)//独占方式。尝试释放资源，成功则返回true，失败则返回false。
tryAcquireShared(int)//共享方式。尝试获取资源。负数表示失败；0表示成功，但没有剩余可用资源；正数表示成功，且有剩余资源。
tryReleaseShared(int)//共享方式。尝试释放资源，成功则返回true，失败则返回false。
```

默认情况下，每个方法都抛出 `UnsupportedOperationException`。 这些方法的实现必须是内部线程安全的，并且通常应该简短而不是阻塞。AQS类中的其他方法都是final ，所以无法被其他类使用，只有这几个方法可以被其他类使用。

以ReentrantLock为例，state初始化为0，表示未锁定状态。A线程lock()时，会调用tryAcquire()独占该锁并将state+1。此后，其他线程再tryAcquire()时就会失败，直到A线程unlock()到state=0（即释放锁）为止，其它线程才有机会获取该锁。当然，释放锁之前，A线程自己是可以重复获取此锁的（state会累加），这就是可重入的概念。但要注意，获取多少次就要释放多么次，这样才能保证state是能回到零态的。

再以CountDownLatch以例，任务分为N个子线程去执行，state也初始化为N（注意N要与线程个数一致）。这N个子线程是并行执行的，每个子线程执行完后countDown()一次，state会CAS(Compare and Swap)减1。等到所有子线程都执行完后(即state=0)，会unpark()主调用线程，然后主调用线程就会从await()函数返回，继续后余动作。

一般来说，自定义同步器要么是独占方法，要么是共享方式，他们也只需实现`tryAcquire-tryRelease`、`tryAcquireShared-tryReleaseShared`中的一种即可。但AQS也支持自定义同步器同时实现独占和共享两种方式，如`ReentrantReadWriteLock`。

推荐两篇 AQS 原理和相关源码分析的文章：

- http://www.cnblogs.com/waterystone/p/4920797.html
- https://www.cnblogs.com/chengxiao/archive/2017/07/24/7141160.html



### AQS 组件总结

- **Semaphore(信号量)-允许多个线程同时访问：** synchronized 和 ReentrantLock 都是一次只允许一个线程访问某个资源，Semaphore(信号量)可以指定多个线程同时访问某个资源。
- **CountDownLatch （倒计时器）：** CountDownLatch是一个同步工具类，用来协调多个线程之间的同步。这个工具通常用来控制线程等待，它可以让某一个线程等待直到倒计时结束，再开始执行。
- **CyclicBarrier(循环栅栏)：** CyclicBarrier 和 CountDownLatch 非常类似，它也可以实现线程间的技术等待，但是它的功能比 CountDownLatch 更加复杂和强大。主要应用场景和 CountDownLatch 类似。CyclicBarrier 的字面意思是可循环使用（Cyclic）的屏障（Barrier）。它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活。CyclicBarrier默认的构造方法是 CyclicBarrier(int parties)，其参数表示屏障拦截的线程数量，每个线程调用await()方法告诉 CyclicBarrier 我已经到达了屏障，然后当前线程被阻塞。



### AQS是如何唤醒下一个线程的？

当需要阻塞或者唤醒一个线程的时候，AQS都是使用 LockSupport 这个工具类来完成的。



### AQS 中独占锁和共享锁的操作流程大体描述一下

##### **独占锁与共享锁的区别**

- **独占锁是持有锁的线程释放锁之后才会去唤醒下一个线程。**
- **共享锁是线程获取到锁后，就会去唤醒下一个线程，所以共享锁在获取锁和释放锁的时候都会调用doReleaseShared方法唤醒下一个线程，当然这会受共享线程数量的限制**。



### ReetrantLock有用过吗，怎么实现重入的？

ReentrantLock的可重入性是AQS很好的应用之一。在ReentrantLock里面，不管是公平锁还是非公平锁，都有一段逻辑。

公平锁：

```java
// java.util.concurrent.locks.ReentrantLock.FairSync#tryAcquire

if (c == 0) {
	if (!hasQueuedPredecessors() && compareAndSetState(0, acquires)) {
		setExclusiveOwnerThread(current);
		return true;
	}
}
else if (current == getExclusiveOwnerThread()) {
	int nextc = c + acquires;
	if (nextc < 0)
		throw new Error("Maximum lock count exceeded");
	setState(nextc);
	return true;
}
```

非公平锁：

```java
// java.util.concurrent.locks.ReentrantLock.Sync#nonfairTryAcquire

if (c == 0) {
	if (compareAndSetState(0, acquires)){
		setExclusiveOwnerThread(current);
		return true;
	}
}
else if (current == getExclusiveOwnerThread()) {
	int nextc = c + acquires;
	if (nextc < 0) // overflow
		throw new Error("Maximum lock count exceeded");
	setState(nextc);
	return true;
}
```

从上面这两段都可以看到，有一个同步状态State来控制整体可重入的情况。State是Volatile修饰的，用于保证一定的可见性和有序性。

```java
// java.util.concurrent.locks.AbstractQueuedSynchronizer

private volatile int state;
```

接下来看State这个字段主要的过程：

1. State初始化的时候为0，表示没有任何线程持有锁。
2. 当有线程持有该锁时，值就会在原来的基础上+1，同一个线程多次获得锁是，就会多次+1，这里就是可重入的概念。
3. 解锁也是对这个字段-1，一直到0，此线程对锁释放。

还会通过 `getExclusiveOwnerThread()`、`setExclusiveOwnerThread(current)`进行当前线程的设置



### countDownLatch/CycliBarries/Semaphore使用过吗

#### CycliBarries

CycliBarries 的字面意思是可循环（cycli）使用的屏障（Barries）。它主要做的事情是，让一组线程达到一个屏障（也可以叫同步点）时被阻塞，知道最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活，线程进入屏障通过 CycliBarries 的 await() 方法。

```java
public class CyclieBarrierDemo {

    public static void main(String[] args) {
        // public CyclicBarrier(int parties, Runnable barrierAction) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7,()->{
            System.out.println("召唤神龙");
        });

        for (int i = 1; i < 8; i++) {
            final int temp = i;
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"收集到第"+temp+"颗龙珠");

                try {
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            },String.valueOf(i)).start();
        }

    }

}
```



#### Semaphore

信号量主要用于两个目的，一个是用于多个共享资源的互斥使用，另一个用于并发线程数的控制。

```java
/**
 * @description: 模拟抢车位
 * @author: starfish
 * @data: 2020-04-04 10:29
 **/
public class SemaphoreDemo {

    public static void main(String[] args) {

        //模拟 3 个车位
        Semaphore semaphore = new Semaphore(3);

        //7 辆车去争抢
        for (int i = 0; i < 7; i++) {
            new Thread(()->{
                try {
                    semaphore.acquire();  //抢到车位
                    System.out.println(Thread.currentThread().getName()+"\t抢到车位");
                    TimeUnit.SECONDS.sleep(3);
                    System.out.println(Thread.currentThread().getName()+"\t 停车 3 秒后离开");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    semaphore.release();
                }
                System.out.println(Thread.currentThread().getName()+"\t抢到车位");
            },String.valueOf(i)).start();
        }
    }
}
```





## 七、并发集合篇

### ConcurrentHashMap？

ConcurrentHashMap 是 Java 中的一个**线程安全且高效的HashMap实现**。平时涉及高并发如果要用map结构，那第一时间想到的就是它。相对于hashmap来说，ConcurrentHashMap就是线程安全的map，其中利用了锁分段的思想提高了并发度。

那么它到底是如何实现线程安全的？

JDK 1.6版本关键要素：

- segment继承了ReentrantLock充当锁的角色，为每一个segment提供了线程安全的保障；
- segment维护了哈希散列表的若干个桶，每个桶由HashEntry构成的链表。

JDK1.8后，ConcurrentHashMap抛弃了原有的**Segment 分段锁，而采用了 CAS + synchronized 来保证并发安全性**。

##### ConcurrentHashMap 的并发度是什么？

ConcurrentHashMap 把实际 map 划分成若干部分来实现它的可扩展性和线程安全。这种划分是使用并发度获得的，它是 ConcurrentHashMap 类构造函数的一个可选参数，默认值为 16，这样在多线程情况下就能避免争用。

在 JDK8 后，它摒弃了 Segment（锁段）的概念，而是启用了一种全新的方式实现,利用 CAS 算法。同时加入了更多的辅助变量来提高并发度



### Java 中的同步集合与并发集合有什么区别？

同步集合与并发集合都为多线程和并发提供了合适的线程安全的集合，不过并发集合的可扩展性更高。在 Java1.5 之前程序员们只有同步集合来用且在多线程并发的时候会导致争用，阻碍了系统的扩展性。Java5 介绍了并发集合像ConcurrentHashMap，不仅提供线程安全还用锁分离和内部分区等现代技术提高了可扩展性。



### SynchronizedMap 和 ConcurrentHashMap 有什么区别？

SynchronizedMap 一次锁住整张表来保证线程安全，所以每次只能有一个线程来访为 map。

ConcurrentHashMap 使用分段锁来保证在多线程下的性能。

ConcurrentHashMap 中则是一次锁住一个桶。ConcurrentHashMap 默认将 hash 表分为 16 个桶，诸如 get，put，remove 等常用操作只锁当前需要用到的桶。

这样，原来只能一个线程进入，现在却能同时有 16 个写线程执行，并发性能的提升是显而易见的。

另外 ConcurrentHashMap 使用了一种不同的迭代方式。在这种迭代方式中，当 iterator 被创建后集合再发生改变就不再是抛出ConcurrentModificationException，取而代之的是在改变时 new 新的数据从而不影响原有的数据，iterator 完成后再将头指针替换为新的数据 ，这样 iterator线程可以使用原来老的数据，而写线程也可以并发的完成改变



### CopyOnWriteArrayList 是什么，可以用于什么应用场景？有哪些优缺点？

CopyOnWriteArrayList 是一个并发容器。有很多人称它是线程安全的，我认为这句话不严谨，缺少一个前提条件，那就是非复合场景下操作它是线程安全的。

CopyOnWriteArrayList(免锁容器)的好处之一是当多个迭代器同时遍历和修改这个列表时，不会抛出 ConcurrentModificationException。在CopyOnWriteArrayList 中，写入将导致创建整个底层数组的副本，而源数组将保留在原地，使得复制的数组在被修改时，读取操作可以安全地执行。

CopyOnWriteArrayList 的使用场景

通过源码分析，我们看出它的优缺点比较明显，所以使用场景也就比较明显。就是合适读多写少的场景。

CopyOnWriteArrayList 的缺点

1. 由于写操作的时候，需要拷贝数组，会消耗内存，如果原数组的内容比较多的情况下，可能导致 young gc 或者 full gc。
2. 不能用于实时读的场景，像拷贝数组、新增元素都需要时间，所以调用一个 set 操作后，读取到数据可能还是旧的，虽然CopyOnWriteArrayList 能做到最终一致性，但是还是没法满足实时性要求。
3. 由于实际使用中可能没法保证 CopyOnWriteArrayList 到底要放置多少数据，万一数据稍微有点多，每次 add/set 都要重新复制数组，这个代价实在太高昂了。在高性能的互联网应用中，这种操作分分钟引起故障。

CopyOnWriteArrayList 的设计思想

1. 读写分离，读和写分开
2. 最终一致性
3. 使用另外开辟空间的思路，来解决并发冲突



### 并发包中的 ConcurrentLinkedQueue 和 LinkedBlockingQueue 有什么区别？

有时候我们把并发包下面的所有容器都习惯叫作并发容器，但是严格来讲，类似 ConcurrentLinkedQueue 这种“Concurrent*”容器，才是真正代表并发。

关于问题中它们的区别：

- Concurrent 类型基于 lock-free，在常见的多线程访问场景，一般可以提供较高吞吐量。
- 而 LinkedBlockingQueue 内部则是基于锁，并提供了 BlockingQueue 的等待性方法。

不知道你有没有注意到，java.util.concurrent 包提供的容器（Queue、List、Set）、Map，从命名上可以大概区分为 Concurrent*、CopyOnWrite*和 Blocking*等三类，同样是线程安全容器，可以简单认为：

- Concurrent 类型没有类似 CopyOnWrite 之类容器相对较重的修改开销。
- 但是，凡事都是有代价的，Concurrent 往往提供了较低的遍历一致性。你可以这样理解所谓的弱一致性，例如，当利用迭代器遍历时，如果容器发生修改，迭代器仍然可以继续进行遍历。
- 与弱一致性对应的，就是我介绍过的同步容器常见的行为“fail-fast”，也就是检测到容器在遍历过程中发生了修改，则抛出 ConcurrentModificationException，不再继续遍历。
- 弱一致性的另外一个体现是，size 等操作准确性是有限的，未必是 100% 准确。
- 与此同时，读取的性能具有一定的不确定性。



### 什么是阻塞队列？阻塞队列的实现原理是什么？如何使用阻塞队列来实现生产者-消费者模型？

> - 哪些队列是有界的，哪些是无界的？
> - 针对特定场景需求，如何选择合适的队列实现？
> - 从源码的角度，常见的线程安全队列是如何实现的，并进行了哪些改进以提高性能表现？

阻塞队列（BlockingQueue）是一个支持两个附加操作的队列。

这两个附加的操作是：

- 在队列为空时，获取元素的线程会等待队列变为非空。
- 当队列满时，存储元素的线程会等待队列可用。

阻塞队列常用于生产者和消费者的场景，生产者是往队列里添加元素的线程，消费者是从队列里拿元素的线程。阻塞队列就是生产者存放元素的容器，而消费者也只从容器里拿元素。

JDK7 提供了 7 个阻塞队列。分别是：

- ArrayBlockingQueue ：一个由数组结构组成的有界阻塞队列。
- LinkedBlockingQueue ：一个由链表结构组成的有界阻塞队列。
- PriorityBlockingQueue ：一个支持优先级排序的无界阻塞队列。
- DelayQueue：一个使用优先级队列实现的无界阻塞队列。
- SynchronousQueue：一个不存储元素的阻塞队列。
- LinkedTransferQueue：一个由链表结构组成的无界阻塞队列。
- LinkedBlockingDeque：一个由链表结构组成的双向阻塞队列。

Java 5 之前实现同步存取时，可以使用普通的一个集合，然后在使用线程的协作和线程同步可以实现生产者，消费者模式，主要的技术就是用好，wait，notify，notifyAll，sychronized 这些关键字。而在 java 5 之后，可以使用阻塞队列来实现，此方式大大简少了代码量，使得多线程编程更加容易，安全方面也有保障。

BlockingQueue 接口是 Queue 的子接口，它的主要用途并不是作为容器，而是作为线程同步的的工具，因此他具有一个很明显的特性，当生产者线程试图向 BlockingQueue 放入元素时，如果队列已满，则线程被阻塞，当消费者线程试图从中取出一个元素时，如果队列为空，则该线程会被阻塞，正是因为它所具有这个特性，所以在程序中多个线程交替向 BlockingQueue 中放入元素，取出元素，它可以很好的控制线程之间的通信。

阻塞队列使用最经典的场景就是 socket 客户端数据的读取和解析，读取数据的线程不断将数据放入队列，然后解析线程不断从队列取数据解析。



### 如何设计一个阻塞队列，都需要考虑哪些点

> 要是让你用数组实现一个阻塞队列该怎么实现（ArrayBlockQueue）
>
> 手写阻塞队列的add 和take方法

阻塞队列相比于普通队列，区别在于当队列为空时获取被阻塞，当队列为满时插入被阻塞。

这个问题其实涉及到两个点

- 阻塞方式：使用互斥锁（synchronized、 Lock）来保护队列操作，如果队列满了 我们用wait、sleep
- 不阻塞后，需要有线程通信机制（notify、notifyAll 或者 condition）

当然，肯定会有队列的实现，list 或者 linkedlist 都可以

```java
public class CustomBlockQueue {
    //队列容器
    private List<Integer> container = new ArrayList<>();
    private Lock lock = new ReentrantLock();
    //Condition
    //  队列为空
    private Condition isNull = lock.newCondition();
    // 队列已满
    private Condition isFull = lock.newCondition();
    private volatile int size;
    private volatile int capacity;

    CustomBlockQueue(int cap) {
        this.capacity = cap;
    }
        
    public void add(int data) {
        try {
            lock.lock();
            try {
                while (size >= capacity) {
                    System.out.println("队列已满，释放锁，等待消费者消费数据");
                    isFull.await();
                }
            } catch (InterruptedException e) {
                isFull.signal();
                e.printStackTrace();
            }
            ++size;
            container.add(data);
            isNull.signal();
        } finally {
            lock.unlock();
        }
    }

    public int take(){
        try {
            lock.lock();
            try {
                while (size == 0){
                    System.out.println("阻塞队列空了，释放锁，等待生产者生产数据");
                    isNull.await();
                }
            }catch (InterruptedException e){
                isFull.signal();
                e.printStackTrace();
            }
            --size;
            int res = container.get(0);
            container.remove(0);
            isFull.signal();
            return res ;
        }finally {
            lock.unlock();
        }
    }
}
```



### 有哪些线程安全的非阻塞队列？

ConcurrentLinkedQueue是一个基于链接节点的无界线程安全队列，它采用先进先出的规则对节点进行排序，当我们添加一个元素的时候，它会添加到队列的尾部；当我们获取一个元素时，它会返回队列头部的元素。

结构如下：

```java
public class ConcurrentLinkedQueue<E> extends AbstractQueue<E>  
        implements Queue<E>, java.io.Serializable {  
    private transient volatile Node<E> head;//头指针  
    private transient volatile Node<E> tail;//尾指针  
    public ConcurrentLinkedQueue() {//初始化，head=tail=（一个空的头结点）  
        head = tail = new Node<E>(null);  
    }  
    private static class Node<E> {  
        volatile E item;  
        volatile Node<E> next;//内部是使用单向链表实现  
        ......  
    }  
    ......  
}  
```

入队和出队操作均利用CAS（compare and set）更新，这样允许多个线程并发执行，并且不会因为加锁而阻塞线程，使得并发性能更好。



### ThreadLocal 是什么？有哪些使用场景？

通常情况下，我们创建的变量是可以被任何一个线程访问并修改的。**如果想实现每一个线程都有自己的专属本地变量该如何解决呢？** JDK中提供的`ThreadLocal`类正是为了解决这样的问题。 **ThreadLocal类主要解决的就是让每个线程绑定自己的值，可以将ThreadLocal类形象的比喻成存放数据的盒子，盒子中可以存储每个线程的私有数据。**

**如果你创建了一个ThreadLocal变量，那么访问这个变量的每个线程都会有这个变量的本地副本，这也是ThreadLocal变量名的由来。他们可以使用 get（） 和 set（） 方法来获取默认值或将其值更改为当前线程所存的副本的值，从而避免了线程安全问题。**

再举个简单的例子：

比如有两个人去宝屋收集宝物，这两个共用一个袋子的话肯定会产生争执，但是给他们两个人每个人分配一个袋子的话就不会出现这样的问题。如果把这两个人比作线程的话，那么ThreadLocal就是用来避免这两个线程竞争的。

经典的使用场景是为每个线程分配一个 JDBC 连接 Connection。这样就可以保证每个线程的都在各自的 Connection 上进行数据库的操作，不会出现 A 线程关了 B线程正在使用的 Connection； 还有 Session 管理 等问题。



当使用 ThreadLocal 维护变量时，其为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立的改变自己的副本，而不会影响其他线程对应的副本。

ThreadLocal 内部实现机制：

- 每个线程内部都会维护一个类似 HashMap 的对象，称为 ThreadLocalMap，里边会包含若干了 Entry（K-V 键值对），相应的线程被称为这些 Entry 的属主线程；
- Entry 的 Key 是一个 ThreadLocal 实例，Value 是一个线程特有对象。Entry 的作用即是：为其属主线程建立起一个 ThreadLocal 实例与一个线程特有对象之间的对应关系；
- Entry 对 Key 的引用是弱引用；Entry 对 Value 的引用是强引用。



### ThreadLocal原理？

从 `Thread`类源代码入手。

```java
public class Thread implements Runnable {
 ......
//与此线程有关的ThreadLocal值。由ThreadLocal类维护
ThreadLocal.ThreadLocalMap threadLocals = null;

//与此线程有关的InheritableThreadLocal值。由InheritableThreadLocal类维护
ThreadLocal.ThreadLocalMap inheritableThreadLocals = null;
 ......
}
```

从上面`Thread`类 源代码可以看出`Thread` 类中有一个 `threadLocals` 和 一个 `inheritableThreadLocals` 变量，它们都是 `ThreadLocalMap` 类型的变量,我们可以把 `ThreadLocalMap` 理解为`ThreadLocal` 类实现的定制化的 `HashMap`。默认情况下这两个变量都是null，只有当前线程调用 `ThreadLocal` 类的 `set`或`get`方法时才创建它们，实际上调用这两个方法的时候，我们调用的是`ThreadLocalMap`类对应的 `get()`、`set() `方法。

`ThreadLocal`类的`set()`方法

```java
    public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }
    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }
```

通过上面这些内容，我们足以通过猜测得出结论：**最终的变量是放在了当前线程的 ThreadLocalMap 中，并不是存在 ThreadLocal 上，ThreadLocal 可以理解为只是ThreadLocalMap的封装，传递了变量值。** `ThrealLocal` 类中可以通过`Thread.currentThread()`获取到当前线程对象后，直接通过`getMap(Thread t)`可以访问到该线程的`ThreadLocalMap`对象。

**每个Thread中都具备一个ThreadLocalMap，而ThreadLocalMap可以存储以ThreadLocal为key ，Object 对象为 value的键值对。**

```java
ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
 ......
}
```

比如我们在同一个线程中声明了两个 `ThreadLocal` 对象的话，会使用 `Thread`内部都是使用仅有那个`ThreadLocalMap` 存放数据的，`ThreadLocalMap`的 key 就是 `ThreadLocal`对象，value 就是 `ThreadLocal` 对象调用`set`方法设置的值。

`ThreadLocalMap`是`ThreadLocal`的静态内部类。



### 什么是线程局部变量？

线程局部变量是局限于线程内部的变量，属于线程自身所有，不在多个线程间共享。Java 提供 ThreadLocal 类来支持线程局部变量，是一种实现线程安全的方式。但是在管理环境下（如 web 服务器）使用线程局部变量的时候要特别小心，在这种情况下，工作线程的生命周期比任何应用变量的生命周期都要长。任何线程局部变量一旦在工作完成后没有释放，Java 应用就存在内存泄露的风险。



### ThreadLocal 内存泄露问题?

`ThreadLocalMap` 中使用的 key 为 `ThreadLocal` 的弱引用，而 value 是强引用。所以，如果 `ThreadLocal` 没有被外部强引用的情况下，在垃圾回收的时候，key 会被清理掉，而 value 不会被清理掉。这样一来，`ThreadLocalMap` 中就会出现key为null的Entry。假如我们不做任何措施的话，value 永远无法被GC 回收，这个时候就可能会产生内存泄露。ThreadLocalMap实现中已经考虑了这种情况，在调用 `set()`、`get()`、`remove()` 方法的时候，会清理掉 key 为 null 的记录。使用完 `ThreadLocal`方法后 最好手动调用`remove()`方法

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
  /** The value associated with this ThreadLocal. */
  Object value;

  Entry(ThreadLocal<?> k, Object v) {
    super(k);
    value = v;
  }
}
```



### ThreadLocalMap的enrty的key为什么要设置成弱引用

将Entry的Key设置成弱引用，在配合线程池使用的情况下可能会有内存泄露的风险。之设计成弱引用的目的是为了更好地对ThreadLocal进行回收，当我们在代码中将ThreadLocal的强引用置为null后，这时候Entry中的ThreadLocal理应被回收了，但是如果Entry的key被设置成强引用则该ThreadLocal就不能被回收，这就是将其设置成弱引用的目的。



**弱引用介绍：**

> 如果一个对象只具有弱引用，那就类似于**可有可无的生活用品**。弱引用与软引用的区别在于：只具有弱引用的对象拥有更短暂的生命周期。在垃圾回收器线程扫描它 所管辖的内存区域的过程中，一旦发现了只具有弱引用的对象，不管当前内存空间足够与否，都会回收它的内存。不过，由于垃圾回收器是一个优先级很低的线程， 因此不一定会很快发现那些只具有弱引用的对象。
>
> 弱引用可以和一个引用队列（ReferenceQueue）联合使用，如果弱引用所引用的对象被垃圾回收，Java虚拟机就会把这个弱引用加入到与之关联的引用队列中。



## 八、并发工具

### ForkJoinPool 

##### 什么是 ForkJoinPool？它与传统的线程池有什么区别？

ForkJoinPool 是 Java 并行计算框架中的一部分，主要用于执行大规模并行任务。它基于分而治之（divide-and-conquer）策略，将大任务分解成若干小任务，并行执行后合并结果。与传统的线程池（如 `ThreadPoolExecutor`）不同，ForkJoinPool 设计为处理任务的递归分解和合并，具有更高的吞吐量和效率。

##### ForkJoinPool 的工作原理是什么？

ForkJoinPool 的核心工作原理是工作窃取（work-stealing）算法。每个工作线程都有一个双端队列（deque），线程从头部取任务执行。当某个线程完成了自己的任务队列后，它可以从其他线程的队列尾部窃取任务执行，从而保持高效的并行处理。

##### 如何使用 ForkJoinPool 来并行处理任务？

使用 ForkJoinPool 需要继承 `RecursiveTask<V>` 或 `RecursiveAction` 类，并实现 `compute()` 方法。`RecursiveTask` 用于有返回值的任务，`RecursiveAction` 用于没有返回值的任务。下面是一个简单的示例：

```java
import java.util.concurrent.RecursiveTask;
import java.util.concurrent.ForkJoinPool;

public class SumTask extends RecursiveTask<Integer> {
    private final int[] arr;
    private final int start;
    private final int end;
    private static final int THRESHOLD = 10;

    public SumTask(int[] arr, int start, int end) {
        this.arr = arr;
        this.start = start;
        this.end = end;
    }

    @Override
    protected Integer compute() {
        if (end - start <= THRESHOLD) {
            int sum = 0;
            for (int i = start; i < end; i++) {
                sum += arr[i];
            }
            return sum;
        } else {
            int mid = (start + end) / 2;
            SumTask leftTask = new SumTask(arr, start, mid);
            SumTask rightTask = new SumTask(arr, mid, end);
            leftTask.fork();
            return rightTask.compute() + leftTask.join();
        }
    }

    public static void main(String[] args) {
        ForkJoinPool pool = new ForkJoinPool();
        int[] arr = new int[100];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
        SumTask task = new SumTask(arr, 0, arr.length);
        int result = pool.invoke(task);
        System.out.println("Sum: " + result);
    }
}
```

##### 什么是 `fork()` 和 `join()` 方法？

- `fork()` 方法：将任务拆分并放入队列中，使其他工作线程可以从队列中窃取并执行。
- `join()` 方法：等待子任务完成并获取其结果。

在上述示例中，`leftTask.fork()` 将左半部分任务放入队列，而 `rightTask.compute()` 直接计算右半部分任务。随后，`leftTask.join()` 等待左半部分任务完成并获取结果。

##### 解释一下 ForkJoinPool 的 `invoke()` 方法和 `submit()` 方法的区别。

- `invoke()` 方法：同步调用，提交任务并等待任务完成，返回任务结果。
- `submit()` 方法：异步调用，提交任务但不等待任务完成，返回一个 `ForkJoinTask` 对象，可以通过这个对象的 `get()` 方法获取任务结果。

##### 在 ForkJoinPool 中，如何处理异常？

在 ForkJoinPool 中执行任务时，如果任务抛出异常，异常会被封装在 `ExecutionException` 中。可以在调用 `join()` 或 `invoke()` 时捕获和处理异常。

```java
public class ExceptionHandlingTask extends RecursiveTask<Integer> {
    private final int[] arr;
    private final int start;
    private final int end;

    public ExceptionHandlingTask(int[] arr, int start, int end) {
        this.arr = arr;
        this.start = start;
        this.end = end;
    }

    @Override
    protected Integer compute() {
        if (start == end) {
            throw new RuntimeException("Exception in task");
        }
        return arr[start];
    }

    public static void main(String[] args) {
        ForkJoinPool pool = new ForkJoinPool();
        int[] arr = new int[1];
        ExceptionHandlingTask task = new ExceptionHandlingTask(arr, 0, 0);
        try {
            int result = pool.invoke(task);
            System.out.println("Result: " + result);
        } catch (RuntimeException e) {
            System.out.println("Exception: " + e.getMessage());
        } catch (ExecutionException e) {
            System.out.println("ExecutionException: " + e.getCause().getMessage());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

##### 什么是 RecursiveTask 和 RecursiveAction？

- `RecursiveTask<V>`：用于有返回值的并行任务。必须实现 `compute()` 方法，并返回计算结果。
- `RecursiveAction`：用于没有返回值的并行任务。必须实现 `compute()` 方法，但不返回结果。

##### ForkJoinPool 是如何实现工作窃取的？

ForkJoinPool 使用双端队列（deque）来实现工作窃取。每个工作线程都有自己的任务队列，从队列的头部获取任务。当一个线程的任务队列为空时，它可以从其他线程的队列尾部窃取任务执行。工作窃取算法可以最大限度地保持工作线程的忙碌，减少空闲线程的数量，提高 CPU 使用率。

##### ForkJoinPool 的并行度（parallelism level）是什么？

ForkJoinPool 的并行度指的是可同时运行的工作线程数。可以在创建 ForkJoinPool 时指定并行度：

```java
ForkJoinPool pool = new ForkJoinPool(4); // 并行度为 4
```

并行度通常设置为 CPU 核心数，以充分利用多核处理器的计算能力。

##### ForkJoinPool 如何避免任务窃取导致的死锁？

ForkJoinPool 通过任务窃取和任务分解来避免死锁。工作线程在等待其他线程完成任务时，会主动窃取其他线程的任务以保持忙碌状态。此外，ForkJoinPool 使用工作窃取算法，尽可能将任务分散到各个线程的队列中，减少任务窃取导致的资源争用，从而降低死锁的可能性。



### CompletableFuture

`CompletableFuture` 是 Java 8 引入的一种用于异步编程的类，它实现了 `Future` 和 `CompletionStage` 接口，提供了多种方法来进行异步计算、处理计算结果和错误处理。它不仅可以用来代表一个异步计算的结果，还可以通过多个方法组合多个异步操作，使得编写复杂的异步流变得更加简洁和易读。

1. **异步计算**：支持异步任务的执行，非阻塞地获取结果。
2. **任务组合**：提供了丰富的 API 来组合多个异步任务。
3. **结果处理**：可以在异步任务完成后处理结果。
4. **异常处理**：提供了多种方法来处理异步任务中的异常。
5. **手动完成**：可以手动完成（`complete`）异步任务。



## 九、其他问题

###  网站的高并发，大流量访问怎么解决?

1. HTML 页面静态化

   访问频率较高但内容变动较小，使用网站 HTML 静态化方案来优化访问速度。将社区 内的帖子、文章进行实时的静态化，有更新的时候再重新静态化也是大量使用的策略。

   优势:
   一、减轻服务器负担。 

   二、加快页面打开速度，静态页面无需访问数据库，打开速度较动态页面有明显提高; 

   三、很多搜索引擎都会优先收录静态页面，不仅被收录的快，还收录的全，容易被搜索引擎找到;

   四、HTML 静态页面不会受程序相关漏洞的影响，减少攻击 ，提高安全性。

2. 图片服务器和应用服务器相分离

   现在很多的网站上都会用到大量的图片，而图片是网页传输中占主要的数据量,也是影 响网站性能的主要因素。因此很多网站都会将图片存储从网站中分离出来，另外架构一个 或多个服务器来存储图片，将图片放到一个虚拟目录中，而网页上的图片都用一个 URL 地 址来指向这些服务器上的图片的地址，这样的话网站的性能就明显提高了。

   优势:
    一、 分担 Web 服务器的 I/O 负载-将耗费资源的图片服务分离出来，提高服务器的性能和稳定性。

   二、 能够专门对图片服务器进行优化-为图片服务设置有针对性的缓存方案，减少带宽 成本，提高访问速度。

   三、 提高网站的可扩展性-通过增加图片服务器，提高图片吞吐能力。

3. 数据库  数据库层面的优化，读写分离，分库分表

4. 缓存

   尽量使用缓存，包括用户缓存，信息缓存等，多花点内存来做缓存，可以大量减少与 数据库的交互，提高性能。

   假如我们能减少数据库频繁的访问，那对系统肯定大大有利的。比如一个电子商务系 统的商品搜索，如果某个关键字的商品经常被搜，那就可以考虑这部分商品列表存放到缓 存(内存中去)，这样不用每次访问数据库，性能大大增加。

5. 镜像

    镜像是冗余的一种类型，一个磁盘上的数据在另一个磁盘上存在一个完全相同的副本 即为镜像。

6. 负载均衡

   在网站高并发访问的场景下，使用负载均衡技术(负载均衡服务器)为一个应用构建 一个由多台服务器组成的服务器集群，将并发访问请求分发到多台服务器上处理，避免单 一服务器因负载压力过大而响应缓慢，使用户请求具有更好的响应延迟特性。

7. 并发控制 加锁，如乐观锁和悲观锁。

8. 消息队列
    通过 mq 一个一个排队方式，跟 12306 一样。



### 订票系统，某车次只有一张火车票，假定有 **1w** 个人同 时打开 **12306** 网站来订票，如何解决并发问题?(可扩展 到任何高并发网站要考虑的并发读写问题)。

不但要保证 1w 个人能同时看到有票(数据的可读性)，还要保证最终只能 由一个人买到票(数据的排他性)。

使用数据库层面的并发访问控制机制。采用乐观锁即可解决此问题。乐观 锁意思是不锁定表的情况下，利用业务的控制来解决并发问题，这样既保证数 据的并发可读性，又保证保存数据的排他性，保证性能的同时解决了并发带来 的脏数据问题。hibernate 中实现乐观锁。

银行两操作员同时操作同一账户就是典型的例子。比如 A、B 操作员同 时读取一余额为 1000 元的账户，A 操作员为该账户增加 100 元，B 操作员同时 为该账户减去 50元，A先提交，B后提交。最后实际账户余额为1000-50=950 元，但本该为 1000+100-50=1050。这就是典型的并发问题。如何解决?可以用锁。



### 如果不用锁机制如何实现共享数据访问？

> 不要用锁，不要用 **sychronized** 块或者方法，也不要直接使用 **jdk** 提供的线程安全 的数据结构，需要自己实现一个类来保证多个线程同时读写这个类 中的共享数据是线程安全的，怎么办?

无锁化编程的常用方法:硬件**CPU**同步原语CAS(Compare and Swap)，如无锁栈，无锁队列(ConcurrentLinkedQueue)等等。现在 几乎所有的 CPU 指令都支持 CAS 的原子操作，X86 下对应的是 CMPXCHG 汇 编指令，处理器执行 CMPXCHG 指令是一个原子性操作。有了这个原子操作， 我们就可以用其来实现各种无锁(lock free)的数据结构。

CAS 实现了区别于 sychronized 同步锁的一种乐观锁，当多个线程尝试使 用 CAS 同时更新同一个变量时，只有其中一个线程能更新变量的值，而其它线 程都失败，失败的线程并不会被挂起，而是被告知这次竞争中失败，并可以再 次尝试。CAS 有 3 个操作数，内存值 V，旧的预期值 A，要修改后的新值 B。 当且仅当预期值 A 和内存值 V 相同时，将内存值 V 修改为 B，否则什么都不做。 其实 CAS 也算是有锁操作，只不过是由 CPU 来触发，比 synchronized 性能 好的多。CAS 的关键点在于，系统在硬件层面保证了比较并交换操作的原子性， 处理器使用基于对缓存加锁或总线加锁的方式来实现多处理器之间的原子操作。CAS 是非阻塞算法的一种常见实现。

一个线程间共享的变量，首先在主存中会保留一份，然后每个线程的工作 内存也会保留一份副本。这里说的预期值，就是线程保留的副本。当该线程从 主存中获取该变量的值后，主存中该变量可能已经被其他线程刷新了，但是该 线程工作内存中该变量却还是原来的值，这就是所谓的预期值了。当你要用 CAS 刷新该值的时候，如果发现线程工作内存和主存中不一致了，就会失败，如果 一致，就可以更新成功。

**Atomic** 包提供了一系列原子类。这些类可以保证多线程环境下，当某个 线程在执行atomic的方法时，不会被其他线程打断，而别的线程就像自旋锁一 样，一直等到该方法执行完成，才由 JVM 从等待队列中选择一个线程执行。 Atomic 类在软件层面上是非阻塞的，它的原子性其实是在硬件层面上借助相关 的指令来保证的。



### 写出 **3** 条你遵循的多线程最佳实践

1. 给线程起个有意义的名字。

2. 避免锁定和缩小同步的范围 。

   相对于同步方法我更喜欢同步块，它给我拥有对锁的绝对控制权。 

3. 多用同步辅助类，少用 **wait** 和 **notify** 。
4. 多用并发容器，少用同步容器。
    如果下一次你需要用到 map，你应该首先想到用 ConcurrentHashMap。