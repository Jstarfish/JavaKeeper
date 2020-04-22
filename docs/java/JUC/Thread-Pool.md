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
>



## 一、线程池是什么

线程池（Thread Pool）是一种基于池化思想管理线程的工具，经常出现在多线程服务器中，如 MySQL。

线程过多会带来额外的开销，其中包括创建销毁线程的开销、调度线程的开销等等，同时也降低了计算机的整体性能。线程池维护多个线程，等待监督管理者分配可并发执行的任务。这种做法，一方面避免了处理任务时创建销毁线程开销的代价，另一方面避免了线程数量膨胀导致的过分调度问题，保证了对内核的充分利用。



## 二、为什么要用线程池，优势是什么

线程池解决的核心问题就是资源管理问题。在并发环境下，系统不能够确定在任意时刻中，有多少任务需要执行，有多少资源需要投入。这种不确定性将带来以下若干问题：

1. 频繁申请/销毁资源和调度资源，将带来额外的消耗，可能会非常巨大。
2. 对资源无限申请缺少抑制手段，易引发系统资源耗尽的风险。
3. 系统无法合理管理内部的资源分布，会降低系统的稳定性。

为解决资源分配这个问题，线程池采用了“池化”（Pooling）思想。池化，顾名思义，是为了最大化收益并最小化风险，而将资源统一在一起管理的一种思想。

“池化”思想不仅仅能应用在计算机领域，在金融、设备、人员管理、工作管理等领域也有相关的应用。

在计算机领域中的表现为：统一管理IT资源，包括服务器、存储、和网络资源等等。通过共享资源，使用户在低投入中获益。除去线程池，还有其他比较典型的几种使用策略包括：

1. 内存池(Memory Pooling)：预先申请内存，提升申请内存速度，减少内存碎片。
2. 连接池(Connection Pooling)：预先申请数据库连接，提升申请连接的速度，降低系统的开销。
3. 实例池(Object Pooling)：循环使用对象，减少资源在初始化和释放时的昂贵损耗。



线程池做的工作主要是控制运行的线程数量，处理过程中将任务放入队列，然后在线程创建后启动这些任务，如果线程数量超过了最大数量，超出数量的线程排队等候，等其他线程执行完毕，再从队列中取出任务来执行。

他的主要优点：

1. **降低资源消耗**：线程复用，通过重复利用已创建的线程减低线程创建和销毁造成的消耗
2. **提高响应速度**：当任务到达时，任务可以不需要等到线程创建就能立即执行
3. **提高线程的可管理性**：线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。
4. **提供更多更强大的功能**：线程池具备可拓展性，允许开发人员向其中增加更多的功能。比如延时定时线程池ScheduledThreadPoolExecutor，就允许任务延期执行或定期执行。



## 三、线程池如何使用

### 架构说明

Java 中的线程池是通过 Executor 框架实现的，该框架中用到了 Executor，Executors，ExecutorService，ThreadPoolExecutor 这几个类。

![](https://tva1.sinaimg.cn/large/00831rSTly1gdl11f7s24j312e0nmtai.jpg)

ThreadPoolExecutor 实现的顶层接口是 Executor，顶层接口 Executor 提供了一种思想：将任务提交和任务执行进行解耦。用户无需关注如何创建线程，如何调度线程来执行任务，用户只需提供 Runnable 对象，将任务的运行逻辑提交到执行器(Executor)中，由 Executor 框架完成线程的调配和任务的执行部分。ExecutorService 接口增加了一些能力：

1. 扩充执行任务的能力，补充可以为一个或一批异步任务生成 Future 的方法；
2. 提供了管控线程池的方法，比如停止线程池的运行。

AbstractExecutorService 则是上层的抽象类，将执行任务的流程串联了起来，保证下层的实现只需关注一个执行任务的方法即可。最下层的实现类 ThreadPoolExecutor 实现最复杂的运行部分，ThreadPoolExecutor 将会一方面维护自身的生命周期，另一方面同时管理线程和任务，使两者良好的结合从而执行并行任务。



### Hello ThreadPool

常见的线程池的使用方式

 `Executors`，提供了一系列静态工厂方法用于创建各种线程池，工具类，类似于我们常用的 `Arrays`、`Collections`

#### newFixedThreadPool

```
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```

- 创建一个指定工作线程数量的线程池。每当提交一个任务就创建一个工作线程，如果工作线程数量达到线程池初始的最大数，则将提交的任务存入到池队列中，可控制线程的最大并发数。
- newFixedThreadPool 创建的线程池 corePoolSize 和 MaximumPoolSize 值是相等的，它使用的 **LinkedBolckingQueue**
- 这种方式即使线程池中没有可运行任务时，它也不会释放工作线程，还会占用一定的系统资源。



#### newSingleThreadExecutor

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```

- 创建一个单线程化的Executor，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序执行。如果这个线程异常结束，会有另一个取代它，保证顺序执行。
- newSingleThreadExecutor 将 corePoolSize 和 maximumPoolSize 都设置为 1，它使用的 **LinkedBlockingQueue**

- 

#### newCachedThreadPool

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

- 创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程。

- newCachedThreadPool 将 corePoolSize 设置为 0，将 maximumPoolSize 设置为 Integer.MAX_VALUE，使用的 SynchronousQueue，也就是说来了任务就创建线程运行，当线程空闲超过 60 秒，就销毁线程，如果又提交了新的任务，则线程池重新创建一个工作线程。
- 在使用 newCachedThreadPool 时，一定要注意控制任务的数量，否则，由于大量线程同时运行，很有会造成系统瘫痪。



#### newScheduledThreadPool

```java
public ScheduledThreadPoolExecutor(int corePoolSize,
                                   ThreadFactory threadFactory) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue(), threadFactory);
}
```

- 创建一个定长的线程池，而且支持定时的以及周期性的任务执行，支持定时及周期性任务执行。



#### newWorkStealingPool

```java
public static ExecutorService newWorkStealingPool() {
    return new ForkJoinPool
        (Runtime.getRuntime().availableProcessors(),
         ForkJoinPool.defaultForkJoinWorkerThreadFactory,
         null, true);
}
```

- Java8 新特性，使用目前机器上可用的处理器作为它的并行级别
- 可以通过参数 parallelism 指定并行数量



## 四、线程池的几个重要参数

从使用中我们可以看到，常用的构造线程池方法其实最后都是通过 **ThreadPoolExecutor** 实例来创建的，且该构造器有 7 大参数。

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.acc = System.getSecurityManager() == null ?
                null :
                AccessController.getContext();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
```

- **corePoolSize：** 线程池中的常驻核心线程数
  - 创建线程池后，当有请求任务进来之后，就会安排池中的线程去执行请求任务，近似理解为近日当值线程
  - 当线程池中的线程数目达到corePoolSize后，就会把到达的任务放到缓存队列中

- **maximumPoolSize：** 线程池最大线程数大小，该值必须大于等于 1

- **keepAliveTime：** 线程池中非核心线程空闲的存活时间
  
- 当前线程池数量超过 corePoolSize 时，当空闲时间达到 keepAliveTime 值时，非核心线程会被销毁直到只剩下 corePoolSize 个线程为止
  
- **unit：** keepAliveTime 的时间单位

- **workQueue：** 存放任务的阻塞队列，被提交但尚未被执行的任务

- **threadFactory：** 用于设置创建线程的工厂，可以给创建的线程设置有意义的名字，可方便排查问题

- **handler：** 拒绝策略，表示当队列满了且工作线程大于等于线程池的最大线程数（maximumPoolSize）时如何来拒绝请求执行的线程的策略，主要有四种类型。

  等待队列也已经满了，再也塞不下新任务。同时，线程池中的 max 线程也达到了，无法继续为新任务服务，这时候我们就需要拒绝策略合理的处理这个问题了。

  - AbortPolicy   直接抛出RegectedExcutionException 异常阻止系统正常进行，**默认策略**
  - DiscardPolicy  直接丢弃任务，不予任何处理也不抛出异常，如果允许任务丢失，这是最好的一种方案
  - DiscardOldestPolicy  抛弃队列中等待最久的任务，然后把当前任务加入队列中尝试再次提交当前任务
  - CallerRunsPolicy  交给线程池调用所在的线程进行处理，“调用者运行”的一种调节机制，该策略既不会抛弃任务，也不会抛出异常，而是将某些任务回退到调用者，从而降低新任务的流量

  以上内置拒绝策略均实现了 RejectExcutionHandler 接口



## 五、线程池的底层工作原理

ThreadPoolExecutor 是如何运行，如何同时维护线程和执行任务的呢？其运行机制如下图所示：

![img](https://tva1.sinaimg.cn/large/00831rSTly1gdl1arsqkbj30u50d8dgz.jpg)

线程池在内部实际上构建了一个生产者消费者模型，将线程和任务两者解耦，并不直接关联，从而良好的缓冲任务，复用线程。线程池的运行主要分成两部分：**任务管理、线程管理**。任务管理部分充当生产者的角色，当任务提交后，线程池会判断该任务后续的流转：

- 直接申请线程执行该任务；
- 缓冲到队列中等待线程执行；
- 拒绝该任务。

线程管理部分是消费者，它们被统一维护在线程池内，根据任务请求进行线程的分配，当线程执行完任务后则会继续获取新的任务去执行，最终当线程获取不到任务的时候，线程就会被回收。



说说线程池的工作原理？

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

   

用生活中的例子类比这一过程

- 核心线程比作公司正式员工
- 非核心线程比作外包员工
- 阻塞队列比作需求池
- 提交任务比作提需求
- 公司最多可聘请或可容纳的员工数量比作最大线程数量

当产品提了新需求，正式员工（核心线程）先接需求（执行任务）。如果正式员工都有需求在做（核心线程数已满），产品就把需求先放需求池（阻塞队列）。如果需求池(阻塞队列)也满了，但是这时候产品继续提需求，这个时候就请外包（非核心线程）来做。如果所有员工（最大线程数也满了）都有需求在做了，那就执行拒绝策略，不接新需求了。如果外包员工把需求做完了，且过了一定时间（keepAliveTime），公司就不会再与外包员工续约了，外包员工这时就会离开公司。



### 5.1 线程池生命周期

线程池运行的状态，并不是用户显式设置的，而是伴随着线程池的运行，由内部来维护。线程池内部使用一个变量维护两个值：**运行状态**(runState)和**线程数量** (workerCount)。在具体实现中，线程池将运行状态(runState)、线程数量 (workerCount)两个关键参数的维护放在了一起，如下代码所示：

```Java
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
```

这个 AtomicInteger 类型的 `ctl`，是对线程池的运行状态和线程池中有效线程的数量进行控制的一个字段， 它同时包含两部分的信息：线程池的运行状态 (runState) 和线程池内有效线程的数量 (workerCount)，高 3 位保存runState，低 29 位保存 workerCount，两个变量之间互不干扰。用一个变量去存储两个值，可避免在做相关决策时，出现不一致的情况，不必为了维护两者的一致，而占用锁资源。通过阅读线程池源代码也可以发现，经常出现要同时判断线程池运行状态和线程数量的情况。线程池也提供了若干方法去供用户获得线程池当前的运行状态、线程个数。这里都使用的是位运算的方式，相比于基本运算，速度也会快很多。

关于内部封装的获取生命周期状态、获取线程池线程数量的计算方法如以下代码所示：

```Java
private static int runStateOf(int c)     { return c & ~CAPACITY; } //计算当前运行状态
private static int workerCountOf(int c)  { return c & CAPACITY; }  //计算当前线程数量
private static int ctlOf(int rs, int wc) { return rs | wc; }   //通过状态和线程数生成ctl
```

ThreadPoolExecutor 定义了 5 种运行状态：

```java
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```

| 运行状态   | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| RUNNING    | 能接受新提交的任务，并且也能处理阻塞队列中的任务             |
| SHUTDOWN   | 关闭状态，不再接受新提交的任务，但却可以继续处理阻塞队列中已保存的任务 |
| STOP       | 不能接受新任务，也不处理队列中的任务，会中断正在处理任务的线程 |
| TIDYING    | 所有的任务都已终止了，有效线程数为 0                         |
| TERMINATED | 在 terminated() 方法执行后进入该状态                         |

转化关系图：

![](https://tva1.sinaimg.cn/large/00831rSTly1gdlc42wt0dj30ok0r4tb9.jpg)

### 5.2 任务执行机制

#### 任务调度

任务调度是线程池的主要入口，当用户提交了一个任务，接下来这个任务将如何执行都是由这个阶段决定的。了解这部分就相当于了解了线程池的核心运行机制。

首先，所有任务的调度都是由 execute 方法完成的，这部分完成的工作是：检查现在线程池的运行状态、运行线程数、运行策略，决定接下来执行的流程，是直接申请线程执行，或是缓冲到队列中执行，亦或是直接拒绝该任务。其执行过程如下：

1. 首先检测线程池运行状态，如果不是 RUNNING，则直接拒绝，线程池要保证在 RUNNING 的状态下执行任务。
2. 如果 workerCount < corePoolSize，则创建并启动一个线程来执行新提交的任务。
3. 如果 workerCount >= corePoolSize，且线程池内的阻塞队列未满，则将任务添加到该阻塞队列中。
4. 如果 workerCount >= corePoolSize && workerCount < maximumPoolSize，且线程池内的阻塞队列已满，则创建并启动一个线程来执行新提交的任务。
5. 如果 workerCount >= maximumPoolSize，并且线程池内的阻塞队列已满， 则根据拒绝策略来处理该任务, 默认的处理方式是直接抛异常。

```java
public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();
    int c = ctl.get();
    if (workerCountOf(c) < corePoolSize) {
        if (addWorker(command, true))
            return;
        c = ctl.get();
    }
    if (isRunning(c) && workQueue.offer(command)) {
        int recheck = ctl.get();
        if (! isRunning(recheck) && remove(command))
            reject(command);
        else if (workerCountOf(recheck) == 0)
            addWorker(null, false);
    }
    else if (!addWorker(command, false))
        reject(command);
}
```

其执行流程如下图所示：

![](https://tva1.sinaimg.cn/large/00831rSTly1gdlddysj52j30g80eljs8.jpg)



#### 任务缓冲

任务缓冲模块是线程池能够管理任务的核心部分。线程池的本质是对任务和线程的管理，而做到这一点最关键的思想就是将任务和线程两者解耦，不让两者直接关联，才可以做后续的分配工作。线程池中是以生产者消费者模式，通过一个阻塞队列来实现的。阻塞队列缓存任务，工作线程从阻塞队列中获取任务。

阻塞队列(BlockingQueue)是一个支持两个附加操作的队列。这两个附加的操作是：在队列为空时，获取元素的线程会等待队列变为非空。当队列满时，存储元素的线程会等待队列可用。阻塞队列常用于生产者和消费者的场景，生产者是往队列里添加元素的线程，消费者是从队列里拿元素的线程。阻塞队列就是生产者存放元素的容器，而消费者也只从容器里拿元素。

下图中展示了线程1往阻塞队列中添加元素，而线程2从阻塞队列中移除元素：

![](https://tva1.sinaimg.cn/large/00831rSTly1gdldf026r1j309o033wef.jpg)



使用不同的队列可以实现不一样的任务存取策略。在这里，我们可以再介绍下阻塞队列的成员：

![](https://tva1.sinaimg.cn/large/00831rSTly1gdldg06a43j31b20l848n.jpg)

#### 任务申请

由上文的任务分配部分可知，任务的执行有两种可能：一种是任务直接由新创建的线程执行。另一种是线程从任务队列中获取任务然后执行，执行完任务的空闲线程会再次去从队列中申请任务再去执行。第一种情况仅出现在线程初始创建的时候，第二种是线程获取任务绝大多数的情况。

线程需要从任务缓存模块中不断地取任务执行，帮助线程从阻塞队列中获取任务，实现线程管理模块和任务管理模块之间的通信。这部分策略由 getTask 方法实现

```java
private Runnable getTask() {
    boolean timedOut = false; // Did the last poll() time out?

    for (;;) {
        int c = ctl.get();
        int rs = runStateOf(c);

        // Check if queue empty only if necessary.
        if (rs >= SHUTDOWN && (rs >= STOP || workQueue.isEmpty())) {
            decrementWorkerCount();
            return null;
        }

        int wc = workerCountOf(c);

        // Are workers subject to culling?
        boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;

        if ((wc > maximumPoolSize || (timed && timedOut))
            && (wc > 1 || workQueue.isEmpty())) {
            if (compareAndDecrementWorkerCount(c))
                return null;
            continue;
        }

        try {
            Runnable r = timed ?
                workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
                workQueue.take();
            if (r != null)
                return r;
            timedOut = true;
        } catch (InterruptedException retry) {
            timedOut = false;
        }
    }
}
```

![](https://tva1.sinaimg.cn/large/00831rSTly1gdldgaabnhj30vi0rcjsz.jpg)

getTask 这部分进行了多次判断，为的是控制线程的数量，使其符合线程池的状态。如果线程池现在不应该持有那么多线程，则会返回 null 值。工作线程 Worker 会不断接收新任务去执行，而当工作线程 Worker 接收不到任务的时候，就会开始被回收。

#### 任务拒绝

任务拒绝模块是线程池的保护部分，线程池有一个最大的容量，当线程池的任务缓存队列已满，并且线程池中的线程数目达到 maximumPoolSize 时，就需要拒绝掉该任务，采取任务拒绝策略，保护线程池。

拒绝策略是一个接口，其设计如下：

```Java
public interface RejectedExecutionHandler {
    void rejectedExecution(Runnable r, ThreadPoolExecutor executor);
}
```

用户可以通过实现这个接口去定制拒绝策略，也可以选择 JDK 提供的四种已有拒绝策略，其特点如下：

![](https://tva1.sinaimg.cn/large/00831rSTly1gdldgt1vd5j30vm0r6jsz.jpg)

### 5.3 工作线程管理

#### Worker线程

线程池为了掌握线程的状态并维护线程的生命周期，设计了线程池内的工作线程Worker。我们来看一下它的部分代码：

```Java
private final class Worker extends AbstractQueuedSynchronizer implements Runnable{
    final Thread thread;//Worker持有的线程
    Runnable firstTask;//初始化的任务，可以为null
  	volatile long completedTasks;  //线程任务计数器
}
```

Worker 这个工作线程，实现了 Runnable 接口，并持有一个线程 thread，一个初始化的任务 firstTask。thread是在调用构造方法时通过 ThreadFactory 来创建的线程，可以用来执行任务；firstTask 用它来保存传入的第一个任务，这个任务可以有也可以为 null。如果这个值是非空的，那么线程就会在启动初期立即执行这个任务，也就对应核心线程创建时的情况；如果这个值是null，那么就需要创建一个线程去执行任务列表（workQueue）中的任务，也就是非核心线程的创建。

![](https://tva1.sinaimg.cn/large/00831rSTly1gdldh6s3ahj30yc0d675z.jpg)

线程池需要管理线程的生命周期，需要在线程长时间不运行的时候进行回收。线程池使用一张 Hash表去持有线程的引用，这样可以通过添加引用、移除引用这样的操作来控制线程的生命周期。这个时候重要的就是如何判断线程是否在运行。

Worker是通过继承 `AbstractQueuedSynchronizer`，使用AQS来实现独占锁这个功能。没有使用可重入锁ReentrantLock，而是使用AQS，为的就是实现不可重入的特性去反应线程现在的执行状态。

1. lock方法一旦获取了独占锁，表示当前线程正在执行任务中。 
2. 如果正在执行任务，则不应该中断线程。
3. 如果该线程现在不是独占锁的状态，也就是空闲的状态，说明它没有在处理任务，这时可以对该线程进行中断。 
4. 线程池在执行 shutdown 方法或 tryTerminate 方法时会调用 interruptIdleWorkers 方法来中断空闲的线程，interruptIdleWorkers 方法会使用 tryLock 方法来判断线程池中的线程是否是空闲状态；如果线程是空闲状态则可以安全回收。

在线程回收过程中就使用到了这种特性，回收过程如下图所示：

![](https://tva1.sinaimg.cn/large/00831rSTly1gdldhyeeptj30hd05yjrx.jpg)



#### Worker线程增加

增加线程是通过线程池中的 addWorker 方法，该方法的功能就是增加一个线程，该方法不考虑线程池是在哪个阶段增加的该线程，这个分配线程的策略是在上个步骤完成的，该步骤仅仅完成增加线程，并使它运行，最后返回是否成功这个结果。addWorker方法有两个参数：firstTask、core。firstTask 参数用于指定新增的线程执行的第一个任务，该参数可以为空；core 参数为 true 表示在新增线程时会判断当前活动线程数是否少于 corePoolSize，false 表示新增线程前需要判断当前活动线程数是否少于 maximumPoolSize

```java
private boolean addWorker(Runnable firstTask, boolean core) {
    retry:
    for (;;) {
        int c = ctl.get();
        int rs = runStateOf(c);

        // Check if queue empty only if necessary.
        if (rs >= SHUTDOWN &&
            ! (rs == SHUTDOWN &&
               firstTask == null &&
               ! workQueue.isEmpty()))
            return false;

        for (;;) {
            int wc = workerCountOf(c);
            if (wc >= CAPACITY ||
                wc >= (core ? corePoolSize : maximumPoolSize))
                return false;
            if (compareAndIncrementWorkerCount(c))
                break retry;
            c = ctl.get();  // Re-read ctl
            if (runStateOf(c) != rs)
                continue retry;
            // else CAS failed due to workerCount change; retry inner loop
        }
    }

    boolean workerStarted = false;
    boolean workerAdded = false;
    Worker w = null;
    try {
        w = new Worker(firstTask);
        final Thread t = w.thread;
        if (t != null) {
            final ReentrantLock mainLock = this.mainLock;
            mainLock.lock();
            try {
                // Recheck while holding lock.
                // Back out on ThreadFactory failure or if
                // shut down before lock acquired.
                int rs = runStateOf(ctl.get());

                if (rs < SHUTDOWN ||
                    (rs == SHUTDOWN && firstTask == null)) {
                    if (t.isAlive()) // precheck that t is startable
                        throw new IllegalThreadStateException();
                    workers.add(w);
                    int s = workers.size();
                    if (s > largestPoolSize)
                        largestPoolSize = s;
                    workerAdded = true;
                }
            } finally {
                mainLock.unlock();
            }
            if (workerAdded) {
                t.start();
                workerStarted = true;
            }
        }
    } finally {
        if (! workerStarted)
            addWorkerFailed(w);
    }
    return workerStarted;
}
```

![](https://tva1.sinaimg.cn/large/00831rSTly1gdldib3z5yj30u00y6go6.jpg)



#### Worker线程执行任务

在 Worker类中的 run 方法调用了 runWorker 方法来执行任务，runWorker 方法的执行过程如下：

1. while循环不断地通过getTask()方法获取任务。
2. getTask()方法从阻塞队列中取任务。 
3. 如果线程池正在停止，那么要保证当前线程是中断状态，否则要保证当前线程不是中断状态。 
4. 执行任务。
5. 如果getTask结果为null则跳出循环，执行processWorkerExit()方法，销毁线程。

```java
final void runWorker(Worker w) {
    Thread wt = Thread.currentThread();
    Runnable task = w.firstTask;
    w.firstTask = null;
    w.unlock(); // allow interrupts
    boolean completedAbruptly = true;
    try {
        while (task != null || (task = getTask()) != null) {
            w.lock();
            // If pool is stopping, ensure thread is interrupted;
            // if not, ensure thread is not interrupted.  This
            // requires a recheck in second case to deal with
            // shutdownNow race while clearing interrupt
            if ((runStateAtLeast(ctl.get(), STOP) ||
                 (Thread.interrupted() &&
                  runStateAtLeast(ctl.get(), STOP))) &&
                !wt.isInterrupted())
                wt.interrupt();
            try {
                beforeExecute(wt, task);
                Throwable thrown = null;
                try {
                    task.run();
                } catch (RuntimeException x) {
                    thrown = x; throw x;
                } catch (Error x) {
                    thrown = x; throw x;
                } catch (Throwable x) {
                    thrown = x; throw new Error(x);
                } finally {
                    afterExecute(task, thrown);
                }
            } finally {
                task = null;
                w.completedTasks++;
                w.unlock();
            }
        }
        completedAbruptly = false;
    } finally {
        processWorkerExit(w, completedAbruptly);  //获取不到任务时，主动回收自己
    }
}
```

![图11 执行任务流程](https://p0.meituan.net/travelcube/879edb4f06043d76cea27a3ff358cb1d45243.png)

#### Worker线程回收

线程池中线程的销毁依赖 JVM 自动的回收，线程池做的工作是根据当前线程池的状态维护一定数量的线程引用，防止这部分线程被 JVM 回收，当线程池决定哪些线程需要回收时，只需要将其引用消除即可。Worker被创建出来后，就会不断地进行轮询，然后获取任务去执行，核心线程可以无限等待获取任务，非核心线程要限时获取任务。当 Worker 无法获取到任务，也就是获取的任务为空时，循环会结束，Worker会主动消除自身在线程池内的引用。

```java
try {
  while (task != null || (task = getTask()) != null) {
    //执行任务
  }
} finally {
  	processWorkerExit(w, completedAbruptly);//获取不到任务时，主动回收自己
}
```

事实上，在这个方法中，将线程引用移出线程池就已经结束了线程销毁的部分。但由于引起线程销毁的可能性有很多，线程池还要判断是什么引发了这次销毁，是否要改变线程池的现阶段状态，是否要根据新状态，重新分配线程。

![img](https://tva1.sinaimg.cn/large/00831rSTly1gdldiqf07tj30oo01ujrg.jpg)

线程回收的工作是 在 processWorkerExit 方法完成的。





在工作中，单一的、固定数的、可变的三种创建线程池的方法，那个用的最多？

你在工作中是如何使用线程池的，是否自定义过线程池使用

合理配置线程池你是如何考虑的





到底用哪个线程池，阿里规范规定不允许使用 Excutiors 创建。

```

```





合理配置线程池你是如何考虑的？

- CPU 密集型

  CPU 密集的意思是该任务需要大量的运算，而没有阻塞，CPU 一直全速运行

  CPU 密集任务只有在真正的多核 CPU 上才可能得到加速（通过多线程）

  而在单核 CPU 上，无论开几个模拟的多线程该任务都不可能得到加速，因为 CPU 总的运算能力就那些。

  CPU 密集型任务配置尽可能少的线程数量：

  一般公式：CPU 合数 + 1 个线程的线程池

- IO 密集型
  - IO密集型任务线程并不是一直在执行任务，则应配置尽可能多的线程，如 CPU 核心数*2
  
  - IO 密集型，即该任务需要大量的 IO，即大量的阻塞、
  
    在单线程上运行 IO 密集型的任务会导致浪费大量的 CPU 运算能力浪费在等待。
  
    所以在 IO 密集型任务中使用多线程可以大大的加速程序运行，即使在单核 CPU 上，这种加速主要就是利用了被浪费调的阻塞时间。所以在 IO 密集型任务中使用多线程可以大大的加速程序运行，即使在单核 CPU 上，这种加速主要就是利用了被浪费掉的阻塞时间。
  
  
  
  ​		IO 密集型时，大部分线程都阻塞，故需要多配置线程数：
  
  ​		参考公式： CPU 核数/（1- 阻塞系数）   阻塞系数在 0.8~0.9 之间
  
  ​		比如 8 核 CPU：8/（1 -0.9）= 80个线程数

