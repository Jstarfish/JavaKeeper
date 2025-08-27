---
title: Java并发编程
date: 2024-05-31
tags: 
 - JUC
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> Java并发编程是面试中**最具技术含量**的部分，也是区分初级和高级开发者的重要标准。从基础的线程创建到复杂的JMM内存模型，从synchronized关键字到Lock接口的实现原理，每一个知识点都可能成为面试官深挖的切入点。掌握并发编程，不仅是面试利器，更是高性能系统开发的基石。
>
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

![](https://img.starfish.ink/common/juc-faq.png)

## 🗺️ 知识导航

### 🏷️ 核心知识分类

1. **🧵 线程基础**：创建方式、生命周期、线程状态、线程安全、ThreadLocal、进程vs线程、并发vs并行
2. **🔒 同步关键字**：synchronized原理、volatile特性、锁升级、偏向锁、轻量级锁、重量级锁
3. **🏛️ 锁机制与AQS**：ReentrantLock、读写锁、AQS框架、公平锁vs非公平锁、死锁问题
4. **⚛️ 原子操作与CAS**：CAS机制、ABA问题、AtomicInteger、LongAdder、无锁编程
5. **🛠️ 并发工具类**：CountDownLatch、CyclicBarrier、Semaphore、Exchanger、线程间通信
6. **🏊 线程池详解**：ThreadPoolExecutor七大参数、工作原理、拒绝策略、参数配置、性能优化
7. **🧠 Java内存模型**：JMM规范、主内存vs工作内存、happen-before原则、内存屏障、三大特性
8. **📦 并发容器**：ConcurrentHashMap、CopyOnWriteArrayList、BlockingQueue、同步容器vs并发容器
9. **🚀 高级并发工具**：ForkJoinPool工作窃取、CompletableFuture异步编程、ThreadLocal原理
10. **🎯 并发应用实践**：订票系统高并发、网站架构设计、无锁化编程、生产者消费者模式、最佳实践

### 🔑 面试话术模板

| **问题类型** | **回答框架**        | **关键要点** | **深入扩展**      |
| ------------ | ------------------- | ------------ | ----------------- |
| **机制原理** | 背景→实现→特点→应用 | 底层实现机制 | 源码分析、JVM层面 |
| **性能对比** | 场景→测试→数据→结论 | 量化性能差异 | 实际项目经验      |
| **并发问题** | 问题→原因→解决→预防 | 线程安全分析 | 最佳实践模式      |
| **工具选择** | 需求→特点→适用→示例 | 使用场景对比 | 源码实现原理      |

## 一、线程基础🧵 

### 🎯 进程和线程？

进程是程序的一次执行过程，是系统运行程序的基本单位，因此进程是动态的。系统运行一个程序即是一个进程从创建，运行到消亡的过程。

线程是进程中的一个执行单元。

线程是进程的子集，一个进程可以有很多线程，每条线程并行执行不同的任务。不同的进程使用不同的内存空间，而所有的线程共享一片相同的内存空间。

在 Java 中，当我们启动 main 函数时其实就是启动了一个 JVM 的进程，而 main 函数所在的线程就是这个进程中的一个线程，也称主线程。

**为什么要用多线程而不是多进程？**

- 线程更轻量，切换开销小，通信更高效。
- 适合 I/O 密集型、CPU 密集型应用。



### 🎯 了解协程么？

**协程是用户态的轻量级线程**，由程序主动控制切换（而非操作系统调度），**单线程可运行多个协程**，适合处理高并发、IO 密集型场景。
*类比记忆*：

- 线程是 “操作系统管理的工人”，协程是 “工人（线程）手下的临时工”—— 工人自己安排临时工干活，减少找老板（操作系统）调度的开销。

| **对比维度** | **协程**                                    | **线程**                                  |
| ------------ | ------------------------------------------- | ----------------------------------------- |
| **调度层**   | 用户态（编程语言 / 框架控制）               | 内核态（操作系统内核调度）                |
| **创建成本** | 极低（纳秒级，内存消耗小）                  | 较高（毫秒级，需分配独立栈内存）          |
| **适用场景** | IO 密集型（如网络请求、数据库操作）         | CPU 密集型（如复杂计算）                  |
| **典型框架** | Kotlin 协程、Quarkus Vert.x、Spring WebFlux | 原生 Java 线程、线程池（ExecutorService） |

**Java 中的协程支持**

1. **现状**：
   - Java 标准库目前**无原生协程支持**，需通过框架或语言扩展实现。
   - 主流方案：
     - **Kotlin 协程**：通过 JVM 字节码与 Java 互操作（如在 Spring Boot 中混合使用）。
     - **Quarkus**：基于 SmallRye Mutiny 实现响应式编程，底层用协程优化 IO 操作。
     - **Loom 项目（实验性）**：JDK 19 引入轻量级线程（Virtual Threads），类似协程但由 JVM 管理调度。
2. **未来趋势**：
   - Loom 项目的虚拟线程可能在未来 JDK 版本中正式转正，成为 Java 协程的替代方案。

> **协程的目的**
>
> 在传统的J2EE系统中都是基于每个请求占用一个线程去完成完整的业务逻辑（包括事务）。所以系统的吞吐能力取决于每个线程的操作耗时。如果遇到很耗时的I/O行为，则整个系统的吞吐立刻下降，因为这个时候线程一直处于阻塞状态，如果线程很多的时候，会存在很多线程处于空闲状态（等待该线程执行完才能执行），造成了资源应用不彻底。
>
> 最常见的例子就是JDBC（它是同步阻塞的），这也是为什么很多人都说数据库是瓶颈的原因。这里的耗时其实是让CPU一直在等待I/O返回，说白了线程根本没有利用CPU去做运算，而是处于空转状态。而另外过多的线程，也会带来更多的ContextSwitch开销。
>
> 对于上述问题，现阶段行业里的比较流行的解决方案之一就是单线程加上异步回调。其代表派是node.js以及Java里的Vert.x。
>
> 而协程的目的就是当出现长时间的I/O操作时，通过让出目前的协程调度，执行下一个任务的方式，来消除ContextSwitch上的开销。
>
> 协程（Coroutine）是一种比线程更轻量的并发处理单元，主要特点是它们可以在一个线程内非阻塞地切换。协程与线程的区别在于：
>
> 1. **线程**由操作系统调度，切换需要系统调用（较高开销）。
> 2. **协程**由应用程序自己调度，切换仅是函数调用（较低开销）。
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
>
> **1. 协程的核心概念**
>
> - **协作式调度**：
>   协程通过显式的 `yield` 或 `suspend` 语句让出执行权，而不是由操作系统抢占式调度。
> - **共享线程**：
>   多个协程可以运行在同一个线程中，且它们共享该线程的栈空间。
>
> **2. 协程的实现**
>
> 协程的实现可以基于以下机制：
>
> 1. **状态保存**：协程在挂起时会保存当前的执行状态，包括程序计数器和局部变量。
> 2. **调度器**：负责管理协程的调度，比如哪个协程运行，哪个挂起。
> 3. **栈帧管理**：协程通常以轻量的栈帧形式运行，其栈比线程栈更小，支持更高的并发量。



### 🎯 说说并发与并行的区别?

- **并发：** 同一时间段，多个任务都在执行 (单位时间内不一定同时执行)；
- **并行：** 单位时间内，多个任务同时执行。



### 🎯 说下同步、异步、阻塞和非阻塞？

同步和异步两个概念与消息的通知机制有关。也就是**同步与异步主要是从消息通知机制角度来说的**。

阻塞和非阻塞这两个概念与程序（线程）等待消息通知(无所谓同步或者异步)时的**状态**有关。也就是说**阻塞与非阻塞主要是程序（线程）等待消息通知时的状态角度来说的**

1. **同步（Sync）**：调用者需等待结果返回，全程 “亲自参与” 任务执行。
2. **异步（Async）**
   **调用者无需等待结果**，任务交予后台处理，通过回调 / 通知获取结果。
   *例：点外卖后无需一直等餐，配送完成会电话通知。*
3. **阻塞（Block）**
   **线程发起请求后被挂起**，无法执行其他操作，直到结果返回。
   *例：单线程程序中，调用`InputStream.read()`时，线程会一直等待数据可读。*
4. **非阻塞（Non-Block）**
   **线程发起请求后立即返回**，可继续执行其他任务（需轮询或回调处理结果）。
   *例：多线程程序中，调用`SocketChannel.read()`时，若数据不可读立即返回`-1`，线程可处理其他通道。*

| **对比维度** | **同步 vs 异步**                                             | **阻塞 vs 非阻塞**                     |
| ------------ | ------------------------------------------------------------ | -------------------------------------- |
| **核心区别** | **任务执行方式**：是否亲自处理                               | **线程状态**：是否被挂起（能否干别的） |
| **典型场景** | - 同步：Servlet 单线程处理请求 - 异步：Spring `@Async` 注解  | - 阻塞：BIO 模型 - 非阻塞：NIO 模型    |
| **组合关系** | 可交叉组合，共 4 种模式： **同步阻塞（BIO）**、**同步非阻塞（NIO 轮询）**、 **异步阻塞（少见）**、**异步非阻塞（AIO）** | 无直接关联，需结合具体场景分析         |

阻塞调用是指调用结果返回之前，当前线程会被挂起，一直处于等待消息通知，不能够执行其他业务。函数只有在得到结果之后才会返回

**有人也许会把阻塞调用和同步调用等同起来，实际上它们是不同的。**

对于同步调用来说，很多时候当前线程可能还是激活的，只是从逻辑上当前函数没有返回而已，此时，这个线程可能也会处理其他的消息

1. 如果这个线程在等待当前函数返回时，仍在执行其他消息处理，那这种情况就叫做同步非阻塞；

2. 如果这个线程在等待当前函数返回时，没有执行其他消息处理，而是处于挂起等待状态，那这种情况就叫做同步阻塞；

所以同步的实现方式会有两种：同步阻塞、同步非阻塞；同理，异步也会有两种实现：异步阻塞、异步非阻塞

> #### “BIO、NIO、AIO 分别属于哪种模型？”
>
> - **BIO（Blocking IO）** = 同步阻塞（最传统，线程易阻塞浪费资源）。
> - **NIO（Non-Blocking IO）** = 同步非阻塞（通过选择器 Selector 实现线程非阻塞，需手动轮询结果）。
> - **AIO（Asynchronous IO）** = 异步非阻塞（JDK 7 引入，后台自动完成 IO 操作，回调通知结果）。



### 🎯 什么是线程安全和线程不安全？

通俗的说：加锁的就是线程安全的，不加锁的就是线程不安全的

**线程安全: **线程安全**指的是当多个线程同时访问某个共享资源或执行某个方法时，不会引发竞态条件（race condition）等问题。线程安全的代码确保多个线程能够**安全且正确地访问资源，即无论系统的调度如何，最终的结果总是符合预期

> 如何实现线程安全：
>
> - **加锁机制**：常见的是通过使用锁（`synchronized`、`Lock` 等），确保同一时间只有一个线程能够访问共享资源。
> - **原子操作**：使用原子性操作或工具类，如 Java 中的 `AtomicInteger`，可以确保线程间的操作是不可分割的，避免了竞态条件。
> - **不可变对象**：如果数据本身是不可变的，那么它自然是线程安全的，因为任何线程都只能读取，而不会修改数据。

**线程不安全：就是不提供数据访问保护，有可能出现多个线程先后更改数据造成所得到的数据是脏数据**

线程安全问题都是由全局变量及静态变量引起的。 若每个线程中对全局变量、静态变量只有读操作，而无写操作，一般来说，这个全局变量是线程安全的；若有多个线程同时执行写操作，一般都需要考虑线程同步，否则的话就可能影响线程安全。



### 🎯 哪些场景需要额外注意线程安全问题？

1. **共享资源访问**：当多个线程访问同一个可变对象或变量时，需要确保线程安全，防止数据不一致。
2. 依赖时序的操作
3. **可变对象的并发修改**：如果一个对象的状态可以被多个线程修改，需要同步访问以避免竞态条件。
4. **集合的并发操作**：向集合添加、删除或修改元素时，如果集合是共享的，需要使用线程安全的集合类或同步机制。
5. **静态字段和单例模式**：静态字段和单例实例可能被多个线程访问，需要特别注意初始化和访问的线程安全。
6. **并发数据结构操作**：使用如`ConcurrentHashMap`等并发集合时，虽然提供了更好的线程安全性，但在某些复合操作上仍需注意同步。
7. **资源池管理**：连接池、线程池等资源池的使用，需要确保资源的分配和释放是线程安全的。
8. **锁的使用**：在使用锁（如`synchronized`或`ReentrantLock`）时，需要避免死锁、活锁和资源耗尽等问题。
9. **原子操作**：对于需要原子性的操作，如计数器递增，需要使用原子变量类（如`AtomicInteger`）。
10. **可见性问题**：确保一个线程对变量的修改对其他线程是可见的，可以通过 `volatile` 关键字或 `synchronized` 块来实现。
11. **并发异常处理**：在处理异常时，需要确保资源的释放和状态的恢复不会影响线程安全。
12. **发布-订阅模式**：在事件驱动的架构中，事件的发布和订阅需要同步，以避免事件处理的竞态条件。

在设计系统时，应该始终考虑到线程安全问题，并采用适当的同步机制和并发工具来避免这些问题。此外，编写单元测试和集成测试时，也应该考虑到多线程环境下的行为。



### 🎯 什么是上下文切换?

上下文切换（Context Switch）指的是 **CPU 从一个线程/进程切换到另一个线程/进程运行时**，保存当前执行状态并恢复另一个的执行状态的过程。

> 多线程编程中一般线程的个数都大于 CPU 核心的个数，而一个 CPU 核心在任意时刻只能被一个线程使用，为了让这些线程都能得到有效执行，CPU 采取的策略是为每个线程分配时间片并轮转的形式。当一个线程的时间片用完的时候就会重新处于就绪状态让给其他线程使用，这个过程就属于一次上下文切换。

这里的“上下文”包括：

- 程序计数器（PC）
- 寄存器
- 堆栈信息
- 内存映射等

**为什么会发生？**

- 线程时间片耗尽（操作系统调度）
- 有更高优先级线程需要运行
- 线程主动挂起（sleep、wait、IO 阻塞）
- 多核 CPU 上线程切换

**成本与影响**

- 上下文切换不是“免费”的：
  - 保存/恢复寄存器和内存信息需要时间
  - 缓存失效（Cache Miss），降低 CPU 利用率
- **过多的上下文切换会导致性能下降**，甚至“线程切换比工作还耗时”。

**如何减少？**

- 使用线程池，避免频繁创建/销毁线程
- 减少锁竞争（synchronized、ReentrantLock）
- 使用无锁数据结构（CAS、Atomic 类）
- 降低线程数量（通常 ≤ CPU 核心数 * 2）



### 🎯 用户线程和守护线程有什么区别?

当我们在 Java 程序中创建一个线程，它就被称为用户线程。将一个用户线程设置为守护线程的方法就是在调用 **start()**方法之前，调用对象的 `setDamon(true)` 方法。一个守护线程是在后台执行并且不会阻止 JVM 终止的 线程，守护线程的作用是为其他线程的运行提供便利服务。当没有用户线程在 运行的时候，**JVM** 关闭程序并且退出。一个守护线程创建的子线程依然是守护线程。

守护线程的一个典型例子就是垃圾回收器。



### 🎯 说说线程的生命周期和状态?

Java 线程在运行的生命周期中的指定时刻只可能处于下面 6 种不同状态的其中一个状态

Java 通过 `Thread.State` 枚举定义了线程的**6 种状态**（JDK 1.5 后），可通过 `getState()` 方法获取，需注意与生命周期阶段的对应关系：

| 状态名称        | **说明**                                                     | **对应生命周期阶段**        |
| --------------- | ------------------------------------------------------------ | --------------------------- |
| `NEW`           | 线程对象被创建（例如通过 `new Thread()`）之后，但在调用 `start()` 方法之前的初始状态 | 新建                        |
| `RUNNABLE`      | 线程调用了 `start()` 方法之后的状态。**这并不意味着线程正在CPU上执行，而是表示线程具备了运行的条件** | 就绪、运行                  |
| `BLOCKED`       | 阻塞状态，等待监视器锁（如 `synchronized` 锁）。             | 阻塞（同步阻塞）            |
| `WAITING`       | 无限等待状态，需其他线程显式唤醒（如调用 `wait()` 无超时参数）。 | 阻塞（主动阻塞 / 协作阻塞） |
| `TIMED_WAITING` | 限时等待状态，超时后自动唤醒（如 `wait(long ms)`、`sleep(long ms)`）。 | 阻塞（主动阻塞）            |
| `TERMINATED`    | 终止状态，线程执行完毕或异常结束（同生命周期的 “死亡”）。    | 死亡                        |

线程在生命周期中并不是固定处于某一个状态而是随着代码的执行在不同状态之间切换。

```
┌─────────┐      start()      ┌─────────────────┐
│  NEW    │ ───────────────→ │  RUNNABLE       │
└─────────┘                 └─────────────────┘
                               ↗        ↘
                              ↙          ↘
                      CPU调度获取时间片   主动放弃CPU（yield()）
                              ↓          ↗
┌─────────┐     run()完成     ┌─────────────────┐
│TERMINATED←─────────────────│  RUNNING        │
└─────────┘                  └─────────────────┘
                               ↓         ↓         ↓
                          ┌────┴────┐ ┌──┴────┐ ┌──┴────┐
                          │          │ │       │ │       │
              ┌───────────▼───┐ ┌───▼─────────▼─┴───────▼────┐
              │               │ │                              │
┌─────────────────┐ ┌─────────────────┐ ┌───────────────────────┐
│   BLOCKED       │ │  WAITING        │ │  TIMED_WAITING        │
│  (等待锁)       │ │  (无限等待)      │ │  (超时等待)            │
└─────────────────┘ └─────────────────┘ └───────────────────────┘
              ▲               ▲                     ▲
              │               │                     │
              │               │                     │
┌─────────────┴───┐ ┌─────────┴──────────────┐ ┌───┴──────────────────┐
│获取synchronized │ │notify()/notifyAll()    │ │时间到达或提前唤醒    │
│锁               │ │join()线程结束          │ │notify()/notifyAll()  │
└─────────────────┘ └────────────────────────┘ └───────────────────────┘
```



### 🎯 一个线程两次调用 start() 方法会出现什么情况？谈谈线程的生命周期和状态转移

在 Java 中，线程对象一旦启动，不能再次启动。如果尝试对同一个线程对象调用两次 `start()` 方法，会抛出 `java.lang.IllegalThreadStateException` 异常。

- 当线程对象第一次调用 `start()` 时，线程从 **NEW 状态** 进入 **RUNNABLE 状态**，JVM 会为其创建对应的操作系统线程并执行 `run()` 方法。

- **若再次调用 `start()`，会抛出 `IllegalThreadStateException`**，因为线程状态已不再是 NEW。

  ```java
  Thread t = new Thread(() -> System.out.println("Running"));
  t.start(); // 第一次调用，正常启动
  t.start(); // 第二次调用，抛出 IllegalThreadStateException
  ```

 **状态流转的关键限制**

- **NEW → RUNNABLE**：只能通过 **一次 `start()` 调用** 触发。
- **RUNNABLE → 其他状态**：可通过锁竞争、等待 / 通知、超时等操作转换。
- **TERMINATED**：一旦进入，无法回到其他状态（线程生命周期结束）。



> #### 线程池如何复用线程？
>
> 线程池通过 `execute(Runnable task)` 方法复用线程，其核心原理是：
>
> 1. **Worker 线程循环**：线程池中的工作线程（Worker）会持续从任务队列中获取任务并执行。
> 2. **任务替换**：当一个任务执行完毕后，Worker 不会终止，而是继续执行下一个任务。
> 3. **状态维护**：Worker 线程本身不会被重复 `start()`，而是通过 `run()` 方法的循环调用实现复用。



### 🎯 说说 sleep() 方法和 wait() 方法区别和共同点?

sleep () 和 wait () 的核心区别在于锁的处理机制：

1. **锁释放**：sleep () 不释放锁，wait () 释放锁并进入等待队列；
2. **唤醒方式**：sleep () 依赖时间或中断，wait () 依赖其他线程通知；
3. **使用场景**：sleep () 用于线程暂停，wait () 用于线程协作（wait 方法必须在 synchronized 保护的代码中使用）。



- `wait ()`通常被用于线程间交互/通信（wait 方法必须在 synchronized 保护的代码中使用），sleep 通常被用于暂停执行。
- `wait()` 方法被调用后，线程不会自动苏醒，需要别的线程调用同一个对象上的 `notify()` 或者 `notifyAll()` 方法。`sleep()` 方法执行完成后，线程会自动苏醒。或者可以使用 `wait(long timeout)` 超时后线程会自动苏醒。

> `Thread.yield()` 方法用于提示调度器当前线程愿意放弃对处理器的占用，并允许其他同优先级的线程运行。
> 
>yield() 方法和 sleep() 方法类似，也不会释放“锁标志”，区别在于，它没有参数，即 yield() 方法只是使当前线程重新回到可执行状态，所以执行 yield() 的线程有可能在进入到可执行状态后马上又被执行，另外 yield() 方法只能使同优先级或者高优先级的线程得到执行机会，这也和 sleep() 方法不同。
> 
> `Thread.join()` 方法用于等待当前线程执行完毕。它可以用于确保某个线程在另一个线程完成之前不会继续执行。



### 🎯 为什么 wait () 必须在 synchronized 块中？

- **原子性保障**：避免线程安全问题（如生产者修改队列后，消费者未及时感知）。

- **JVM 实现机制**：锁对象的 `monitor` 记录等待线程，需通过 `synchronized` 获取锁后才能操作 `monitor`

  

### 🎯 为什么我们调用 start() 方法时会执行 run() 方法，为什么我们不能直接调用 run() 方法？

调用 `start()` 方法最终会导致在新的执行路径上执行 `run()` 方法中的代码，这是 Java 实现多线程的标准方式。直接调用 `run()` 方法通常是一个错误，原因在于两者在行为、线程生命周期和底层执行机制上存在根本区别：

1. **`start()` 的本质：创建新执行流**
   - **核心职责：** `start()` 方法是 `Thread` 类提供的，用于**请求 Java 虚拟机 (JVM) 启动一个新的操作系统线程（或映射到内核调度实体）**。
   - 底层机制：当调用 `start()`时：
     - JVM底层会通过一个 `native` 方法（通常是 `start0()`）与操作系统交互，请求创建一个新的系统线程。
     - 这个新创建的系统线程获得独立的执行上下文（包括程序计数器、栈空间）。
     - **在操作系统准备好并调度这个新线程之后，由操作系统（或 JVM 线程调度器）自动调用该线程对象的 `run()` 方法。**
   - **结果：** `run()` 方法中的代码会在一个**全新的、独立的执行线程**中运行，实现真正的并发或并行。
2. **直接调用 `run()`：普通方法调用（非多线程）**
   - **行为：** 直接调用 `run()` 方法，就像调用任何其他 Java 类的普通实例方法一样。
   - **执行上下文：** `run()` 方法会在**当前调用它的线程**中执行（例如，很可能是在 `main` 线程中执行）。
   - 结果：
     - **不会创建新的线程！**
     - `run()` 方法中的代码在当前线程的栈帧中同步执行（按顺序执行，阻塞当前线程）。
     - 完全丧失了多线程的意义，等同于单线程顺序执行。

> - **`start()` 是线程的 “出生证”，JVM 见它才开新线程；`run()` 是线程的 “工作内容”，直接调用只是普通方法**。
> - **状态流转有规则，`NEW` 到 `RUNNABLE` 靠 `start()`，跳过它线程无法活**。



### 🎯 Java 线程启动的几种方式

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



### 🎯 如何正确停止线程？

通常情况下，我们不会手动停止一个线程，而是允许线程运行到结束，然后让它自然停止。但是依然会有许多特殊的情况需要我们提前停止线程，比如：用户突然关闭程序，或程序运行出错重启等。

在 Java 中，正确停止线程通常涉及到线程的协作和适当的关闭机制。由于Java没有提供直接停止线程的方法（如`stop()`方法已经被废弃，因为它太危险，容易造成数据不一致等问题），以下是一些常见的正确停止线程的方法：

1. **使用标志位**：使用标志位是停止线程的常见方法。在这种方法中，线程会定期检查一个标志位，如果标志位指示线程应该停止，那么线程会自行结束。

   ```java
   private volatile boolean stopRunning = false;
   
   public void stopThread() {
       this.stopRunning = true;
   }
   
   public void run() {
       while (!stopRunning) {
           // 执行任务
       }
       // 清理资源
   }
   ```

2. **中断状态（Interruption）**：使用线程的中断机制来优雅地停止线程。当需要停止线程时，调用`Thread.interrupt()`方法；在线程的执行过程中，检查中断状态，如果被中断，则退出。

   ```JAVA
   // 在其他线程中调用此方法来中断线程
   thread.interrupt();
   
   // 在目标线程中检查中断状态
   public void run() {
       try {
           while (!Thread.currentThread().isInterrupted()) {
               // 执行任务
           }
       } catch (InterruptedException e) {
           // 线程被中断，可以选择重置中断状态或退出
           Thread.currentThread().interrupt();
       } finally {
           // 清理资源
       }
   }
   ```

3. **使用ExecutorService**：使用`ExecutorService`可以更容易地控制线程的生命周期。调用`shutdown()`方法开始关闭，调用`shutdownNow()`可以尝试立即停止所有正在执行的任务。

   ```java
   ExecutorService executorService = Executors.newSingleThreadExecutor();
   Future<?> future = executorService.submit(() -> {
       // 执行任务
   });
   
   // 请求关闭线程池，不再接受新任务，尝试完成已提交的任务
   executorService.shutdown();
   
   // 尝试立即停止所有正在执行的任务列表，返回未完成的任务列表
   List<Runnable> notCompleted = executorService.shutdownNow();
   
   // 等待线程池关闭，直到所有任务完成后
   executorService.awaitTermination(60, TimeUnit.SECONDS);
   ```

   **使用 `Future.cancel()`**： `ExecutorService` 启动的话，也可以使用 `Future.cancel()` 方法来停止线程。



### 🎯 进程间的通信方式？

进程间通信（Inter-Process Communication，IPC）是指在不同进程之间传递数据和信息的机制。不同操作系统提供了多种 IPC 方式，下面是常见的几种：

1. **管道（Pipe）**

   - 无名管道（Anonymous Pipe）：单向通信，只能用于有亲缘关系的进程（父进程与子进程）。

   - 有名管道（Named Pipe 或 FIFO）：在 Unix/Linux 系统中，可以使用 `mkfifo` 命令创建有名管道，支持双向通信。

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



### 🎯 Java 多线程之间的通信方式？

| **通信方式**         | **核心机制**                                 | **适用场景**                        | **关键类 / 方法**                       |
| -------------------- | -------------------------------------------- | ----------------------------------- | --------------------------------------- |
| 共享变量             | `volatile`/`synchronized` 保证可见性和原子性 | 简单状态通知和数据共享              | `volatile` 关键字、`synchronized` 块    |
| `wait()`/`notify()`  | 对象监视器 + 等待 / 通知机制                 | 条件等待和唤醒（如生产者 - 消费者） | `Object.wait()`、`Object.notify()`      |
| `Lock` + `Condition` | 显式锁 + 多路等待队列                        | 复杂同步逻辑（如多条件等待）        | `ReentrantLock`、`Condition.await()`    |
| `BlockingQueue`      | 阻塞队列实现线程安全的入队 / 出队            | 生产者 - 消费者模型简化             | `ArrayBlockingQueue`、`put()`、`take()` |
| `CountDownLatch`     | 倒计时等待多个线程完成                       | 主线程等待子线程集合                | `CountDownLatch.await()`、`countDown()` |
| `CyclicBarrier`      | 线程集合后同步执行                           | 多轮协作（如多阶段计算）            | `CyclicBarrier.await()`                 |
| `Exchanger`          | 两个线程间数据交换                           | 遗传算法、管道设计等一对一交换场景  | `Exchanger.exchange()`                  |



### 🎯 Java 同步机制有哪些？

1. `synchronized` 关键字，这个相信大家很了解，最好能理解其中的原理

2. `Lock` 接口及其实现类，如 ReentrantLock.ReadLock 和 ReentrantReadWriteLock.WriteLock


3. `Semaphore`：是一种计数器，用来保护一个或者多个共享资源的访问，它是并发编程的一种基础工具，大多数编程语言都提供这个机制，这也是操作系统中经常提到的
4. `CountDownLatch`：是 Java 语言提供的同步辅助类，在完成一组正在其他线程中执行的操作之前，他允许线程一直等待
5. `CyclicBarrier`：也是 java 语言提供的同步辅助类，他允许多个线程在某一个集合点处进行相互等待；
6. `Phaser`：也是 java 语言提供的同步辅助类，他把并发任务分成多个阶段运行，在开始下一阶段之前，当前阶段中所有的线程都必须执行完成，JAVA7 才有的特性。
7. `Exchanger`：他提供了两个线程之间的数据交换点。
8. `StampedLock` ：是一种改进的读写锁，提供了三种模式：写锁、悲观读锁和乐观读锁，适用于读多写少的场景。



------



## 二、同步关键字（并发控制）🔒 

### 🎯 synchronized 关键字?

> "synchronized是Java最基础的同步机制，基于Monitor监视器实现：
>
> **实现原理**：
>
> - 同步代码块：使用monitorenter和monitorexit字节码指令
> - 同步方法：使用ACC_SYNCHRONIZED访问标志
> - 基于对象头的Mark Word存储锁信息
>
> **锁升级过程**：
>
> 1. **偏向锁**：只有一个线程访问时，在对象头记录线程ID
> 2. **轻量级锁**：多线程竞争但无实际冲突，使用CAS操作
> 3. **重量级锁**：存在真正竞争时，升级为Monitor锁，线程阻塞
>
> **特点**：
>
> - 可重入性：同一线程可以多次获得同一把锁
> - 不可中断：等待锁的线程不能被中断
> - 非公平锁：无法保证等待时间最长的线程优先获得锁
>
> JDK 6+的锁优化使synchronized性能大幅提升，在低竞争场景下甚至超过ReentrantLock。"

**1. 底层实现原理**

`synchronized` 的底层实现基于 **JVM 监视器锁（Monitor）** 机制：

- **同步代码块**：通过字节码指令 `monitorenter`（加锁）和 `monitorexit`（释放锁）实现
- **同步方法**：通过方法访问标志 `ACC_SYNCHRONIZED` 隐式实现锁机制
- **核心数据结构**：每个对象关联一个 Monitor（包含 Owner 线程、EntryList 阻塞队列、WaitSet 等待队列）

> 📌 **关键点**：所有 Java 对象天生自带 Monitor，这是 `synchronized` 能以任意对象作为锁的根本原因。
>
> **synchronized 关键字底层原理属于 JVM 层面。**
>
> **① synchronized 同步语句块的情况**
>
> ```java
> public class SynchronizedDemo {
> 	public void method() {
> 		synchronized (this) {
> 			System.out.println("synchronized 代码块");
> 		}
> 	}
> }
> ```
>
> 通过 JDK 自带的 javap 命令查看 SynchronizedDemo 类的相关字节码信息：首先切换到类的对应目录执行 `javac SynchronizedDemo.java` 命令生成编译后的 .class 文件，然后执行`javap -c -s -v -l SynchronizedDemo.class`。
>
> **synchronized 同步语句块的实现使用的是 monitorenter 和 monitorexit 指令，其中 monitorenter 指令指向同步代码块的开始位置，monitorexit 指令则指明同步代码块的结束位置。** 当执行 monitorenter 指令时，线程试图获取锁也就是获取 monitor(monitor对象存在于每个 Java 对象的对象头中，synchronized 锁便是通过这种方式获取锁的，也是为什么 Java 中任意对象可以作为锁的原因) 的持有权。当计数器为0则可以成功获取，获取后将锁计数器设为1也就是加1。相应的在执行 monitorexit 指令后，将锁计数器设为0，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。
>
> 1. 进入时，执行 monitorenter，将计数器 +1，释放锁 monitorexit 时，计数器-1；
> 2. 当一个线程判断到计数器为 0 时，则当前锁空闲，可以占用；反之，当前线程进入等待状态。
>
> **② synchronized 修饰方法的的情况**
>
> ```java
> public class SynchronizedDemo2 {
> 	public synchronized void method() {
> 		System.out.println("synchronized 方法");
> 	}
> }
> ```
>
> synchronized 修饰的方法并没有 monitorenter 指令和 monitorexit 指令，取得代之的确实是 `ACC_SYNCHRONIZED` 标识，该标识指明了该方法是一个同步方法，JVM 通过该 ACC_SYNCHRONIZED 访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用。
>
> > **为什么方法的同步使用 `ACC_SYNCHRONIZED`？**
> >
> > 1. **简化字节码**
> >    - 同步方法的范围天然固定为整个方法体，直接用标志位表示更加简洁。
> >    - 避免了显式插入指令的额外开销。
> > 2. **由 JVM 执行优化**
> >    - JVM 可以直接识别 `ACC_SYNCHRONIZED` 并在方法调用层面加锁，而无需用户手动控制。
> >    - 更容易结合其他锁优化（如偏向锁、轻量级锁）。
>
> 

**2. 使用方式与区别**

| **使用方式**     | **锁对象**                      | **作用范围** | **特点**                   |                               |
| ---------------- | ------------------------------- | ------------ | -------------------------- | ----------------------------- |
| **同步实例方法** | `this`（当前对象实例）          | 整个方法体   | 影响同一对象的所有同步方法 |                               |
| **同步静态方法** | `Class` 对象（如 `User.class`） | 整个方法体   | 全局锁，影响所有实例的调用 |                               |
| **同步代码块**   | 指定任意对象                    | 代码块内部   | 锁粒度最小，性能最优       | `synchronized (lock) { ... }` |

> ⚠️ **注意**：对类加锁（静态同步）时，**调用非静态方法不会加锁**（因为锁对象不同）：
>
> ```java
> class User {
>  public static synchronized void staticMethod() {} // 锁User.class
>  public synchronized void instanceMethod() {}      // 锁this实例
> }
> ```

**3. 对象头与 Monitor**

- **对象头（Object Header）**：
  每个 Java 对象在内存中都有对象头，包含 **Mark Word** 和 **Klass Pointer**。
  - **Mark Word**：存储对象的哈希码、GC 分代年龄、锁状态等信息。
  - **Class Pointer**：指向对象所属类的元数据。
- **Monitor（监视器）**：
  每个对象都关联一个 Monitor，本质是操作系统的互斥量（Mutex），包含：
  - **Owner**：记录当前持有锁的线程。
  - **Entry List**：等待获取锁的线程队列。
  - **Wait Set**：调用 `wait()` 后阻塞的线程队列。

**4. 锁升级（JDK 1.6+ 优化）**

JVM 为减少锁竞争的性能开销，引入了**锁升级机制**：
**无锁 → 偏向锁 → 轻量级锁 → 重量级锁**（状态不可逆）

对象头中包含了锁标志位（Lock Word），用于表示对象的锁状态。

`Mark Word` 在锁的不同状态下会有不同的含义：

- **无锁（Normal）**：存储对象的哈希值。指没有对资源进行锁定，所有的线程都能访问并修改同一个资源，但同时只有一个线程能修改成功。

- **偏向锁（Biased Lock）**：存储线程 ID，表示锁倾向于某个线程。

  - **适用场景**：单线程多次获取同一锁。
  - **原理**：首次获取锁时，JVM 在对象头 Mark Word 中存储线程 ID（CAS 操作），后续该线程直接获取锁，无需同步开销。
  - **升级条件**：当其他线程尝试获取锁时，偏向锁失效，升级为轻量级锁。

- **轻量级锁（Lightweight Lock）**（也叫自旋锁）：存储指向锁记录的指针。

  - **适用场景**：多线程交替执行，无锁竞争。
  - **原理**：线程获取锁时，JVM 在当前线程栈帧中创建锁记录（Lock Record），通过 CAS 将 Mark Word 指向锁记录。若成功则获取锁，失败则升级为重量级锁。
  - **特点**：未获取锁的线程**自旋等待**，避免线程阻塞和唤醒的开销。长时间的自旋操作是非常消耗资源的，一个线程持有锁，其他线程就只能在原地空耗CPU，执行不了任何有效的任务，这种现象叫做忙等（busy-waiting）

- **重量级锁（Heavyweight Lock）**：存储指向 Monitor 对象的指针。

  - **适用场景**：多线程竞争激烈。如果锁竞争情况严重，某个达到最大自旋次数的线程，会将轻量级锁升级为重量级锁（依然是CAS修改锁标志位，但不修改持有锁的线程ID）。当后续线程尝试获取锁时，发现被占用的锁是重量级锁，则直接将自己挂起（而不是忙等），等待将来被唤醒。

  - **原理**：依赖操作系统的互斥量（Mutex），未获取锁的线程**进入内核态阻塞**，锁释放后需唤醒线程（性能开销大）。

  - 重量级锁是指当有一个线程获取锁之后，其余所有等待获取该锁的线程都会处于阻塞状态。

    简言之，就是所有的控制权都交给了操作系统，由操作系统来负责线程间的调度和线程的状态变更。而这样会出现频繁地对线程运行状态的切换，线程的挂起和唤醒，从而消耗大量的系统资源



### 🎯 volatile关键字？

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

一句话：<mark>在需要保证原子性的场景，不要使用 volatile</mark>。



### 🎯 volatile 底层的实现机制？

volatile 可以保证线程可见性且提供了一定的有序性，但是无法保证原子性。在 JVM 底层是基于内存屏障实现的。

- 当对非 volatile 变量进行读写的时候，每个线程先从内存拷贝变量到 CPU 缓存中。如果计算机有多个CPU，每个线程可能在不同的 CPU 上被处理，这意味着每个线程可以拷贝到不同的 CPU cache 中
- 而声明变量是 volatile 的，JVM 保证了每次读变量都从内存中读，跳过 CPU cache 这一步，所以就不会有可见性问题
  - 对 volatile 变量进行写操作时，会在写操作后加一条 store 屏障指令，将工作内存中的共享变量刷新回主内存；
  - 对 volatile 变量进行读操作时，会在写操作后加一条 load 屏障指令，从主内存中读取共享变量；

> 基于 **内存屏障指令**：
>
> 1. 写操作屏障
>
>    ```Asm
>    StoreStoreBarrier
>    volatile写操作
>    StoreLoadBarrier  // 强制刷新到主存
>    ```
>
> 2. 读操作屏障
>
>    ```Asm
>    volatile读操作
>    LoadLoadBarrier
>    LoadStoreBarrier  // 禁止后续读写重排序
>    ```
>
> **硬件级实现**： x86 平台使用 `lock` 前缀指令（如 `lock addl $0,0(%rsp)`）实现内存屏障效果。



### 🎯 volatile 是线程安全的吗

**因为volatile不能保证变量操作的原子性，所以试图通过volatile来保证线程安全性是不靠谱的**



### 🎯 volatile 变量和 atomic 变量有什么不同？

| **特性**     | **volatile**             | **AtomicXXX**      |
| ------------ | ------------------------ | ------------------ |
| **可见性**   | ✅ 保证                   | ✅ 保证             |
| **有序性**   | ✅ 保证                   | ✅ 保证             |
| **原子性**   | ❌ 不保证（如 `count++`） | ✅ 保证（CAS 实现） |
| **底层实现** | 内存屏障                 | CAS + volatile     |
| **性能开销** | 低（无锁）               | 中等（CAS 自旋）   |
| **适用场景** | 状态标志、DCL 单例       | 计数器、累加操作   |



### 🎯 synchronized 关键字和 volatile 关键字的区别?

`synchronized` 关键字和 `volatile` 关键字是两个互补的存在，而不是对立的存在：

- **volatile关键字**是线程同步的**轻量级实现**，所以**volatile性能肯定比synchronized关键字要好**。但是**volatile关键字只能用于变量而synchronized关键字可以修饰方法以及代码块**。synchronized关键字在JavaSE1.6之后进行了主要包括为了减少获得锁和释放锁带来的性能消耗而引入的偏向锁和轻量级锁以及其它各种优化之后执行效率有了显著提升，**实际开发中使用 synchronized 关键字的场景还是更多一些**。
- **多线程访问volatile关键字不会发生阻塞，而synchronized关键字可能会发生阻塞**
- **volatile关键字能保证数据的可见性，但不能保证数据的原子性。synchronized关键字两者都能保证。**
- **volatile关键字主要用于解决变量在多个线程之间的可见性，而 synchronized关键字解决的是多个线程之间访问资源的同步性。**





## 三、锁机制 🏛️ 

### 🎯 你知道哪几种锁？分别有什么特点？

根据分类标准我们把锁分为以下 7 大类别，分别是：

- 偏向锁/轻量级锁/重量级锁：偏向锁/轻量级锁/重量级锁，这三种锁特指 synchronized 锁的状态，通过在对象头中的 mark word 来表明锁的状态。
- 可重入锁/非可重入锁：可重入锁指的是线程当前已经持有这把锁了，能在不释放这把锁的情况下，再次获取这把锁
- 共享锁/独占锁：共享锁指的是我们同一把锁可以被多个线程同时获得，而独占锁指的就是，这把锁只能同时被一个线程获得。我们的读写锁，就最好地诠释了共享锁和独占锁的理念。读写锁中的读锁，是共享锁，而写锁是独占锁。
- 公平锁/非公平锁：公平锁的公平的含义在于如果线程现在拿不到这把锁，那么线程就都会进入等待，开始排队，在等待队列里等待时间长的线程会优先拿到这把锁，有先来先得的意思。而非公平锁就不那么“完美”了，它会在一定情况下，忽略掉已经在排队的线程，发生插队现象
- 悲观锁/乐观锁：悲观锁假定并发冲突**一定会发生**，因此在操作共享数据前**先加锁**（独占资源）。乐观锁是假定并发冲突**很少发生**，操作共享数据时**不加锁**，在提交更新时检测是否发生冲突（通常通过版本号或 CAS 机制）
- 自旋锁/非自旋锁：自旋锁的理念是如果线程现在拿不到锁，并不直接陷入阻塞或者释放 CPU 资源，而是开始利用循环，不停地尝试获取锁，这个循环过程被形象地比喻为“自旋”
- 可中断锁/不可中断锁：synchronized 关键字修饰的锁代表的是不可中断锁，一旦线程申请了锁，就没有回头路了，只能等到拿到锁以后才能进行其他的逻辑处理。而我们的 ReentrantLock 是一种典型的可中断锁

| **锁类型** | **特点**             | **典型实现**                    | **适用场景**     |
| ---------- | -------------------- | ------------------------------- | ---------------- |
| 乐观锁     | 无锁，通过 CAS 更新  | `AtomicInteger`、数据库版本号   | 读多写少、冲突少 |
| 悲观锁     | 操作前加锁           | `synchronized`、`ReentrantLock` | 写多、竞争激烈   |
| 公平锁     | 按请求顺序获取锁     | `ReentrantLock(true)`           | 防止线程饥饿     |
| 可重入锁   | 同一线程可重复加锁   | `synchronized`、`ReentrantLock` | 嵌套同步块       |
| 读写锁     | 读锁共享，写锁排他   | `ReentrantReadWriteLock`        | 读多写少         |
| 偏向锁     | 单线程优化，无锁竞争 | JVM 对 `synchronized` 的优化    | 单线程场景       |
| 自旋锁     | 循环尝试获取锁       | CAS 操作                        | 锁持有时间短     |




### 🎯 ReentrantLock (可重入锁) 

`ReentrantLock` 是 Java 并发包（`java.util.concurrent.locks`）中实现的**可重入显式锁**，功能上与 `synchronized` 类似，但提供更灵活的锁控制（如可中断锁、公平锁、条件变量）。

**核心特性**：

1. **可重入性**：同一线程可多次获取同一把锁而不会死锁（通过内部计数器实现）。
   - 实现原理：锁内部维护一个**持有锁的线程标识**和**重入次数计数器**，线程再次获取锁时，计数器加 1，释放锁时计数器减 1，直至为 0 时真正释放锁。
2. **显式锁管理**：需手动调用 `lock()` 和 `unlock()`（必须在 `finally` 块中释放）。
3. **公平锁支持**：通过构造参数 `new ReentrantLock(true)` 实现线程按请求顺序获取锁。
4. 灵活的锁获取方式：
   - `lock()`：阻塞式获取锁。
   - `tryLock()`：非阻塞式尝试获取锁（立即返回结果）。
   - `tryLock(timeout, unit)`：带超时的获取锁。
   - `lockInterruptibly()`：可响应中断的获取锁。
5. **条件变量（Condition）**：替代 `wait()`/`notify()`，支持多路等待队列（如生产者 - 消费者模型）。



### 🎯 ReetrantLock有用过吗，怎么实现重入的？

ReentrantLock 的可重入性是 AQS 很好的应用之一。在 ReentrantLock 里面，不管是公平锁还是非公平锁，都有一段逻辑。

公平锁：

```java
// java.util.concurrent.locks.ReentrantLock.FairSync#tryAcquire

if (c == 0) {
  //在公平锁中，线程获取锁时会检查等待队列，只有当没有其他线程等待时，才会获取锁，这保证了线程按照请求的顺序获取锁。
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

从上面这两段都可以看到，有一个同步状态State来控制整体可重入的情况。State 是 volatile 修饰的，用于保证一定的可见性和有序性。

```java
// java.util.concurrent.locks.AbstractQueuedSynchronizer

private volatile int state;
```

接下来看 State 这个字段主要的过程：

1. State 初始化的时候为 0，表示没有任何线程持有锁。
2. 当有线程持有该锁时，值就会在原来的基础上 +1，同一个线程多次获得锁是，就会多次 +1，这里就是可重入的概念。
3. 解锁也是对这个字段 -1，一直到 0，此线程对锁释放。

还会通过 `getExclusiveOwnerThread()`、`setExclusiveOwnerThread(current)`进行当前线程的设置



### 🎯 谈谈 synchronized和 ReentrantLock 的区别？

| **特性**       | **synchronized**                                  | **ReentrantLock**               |
| -------------- | ------------------------------------------------- | ------------------------------- |
| **锁类型**     | 隐式锁（JVM 控制）                                | 显式锁（手动获取 / 释放）       |
| **可重入性**   | 支持                                              | 支持                            |
| **公平性**     | 非公平（无法设置）                                | 可通过构造方法设置公平 / 非公平 |
| **锁获取方式** | 阻塞式                                            | 支持阻塞、非阻塞、超时、可中断  |
| **线程通信**   | 使用 `wait()`/`notify()`                          | 使用 `Condition` 对象           |
| **性能**       | 早期版本性能较差，JDK 6+ 优化后接近 ReentrantLock | 优化后性能高，尤其在竞争激烈时  |
| **适用场景**   | 简单场景（自动释放锁）                            | 复杂场景（需要灵活控制锁逻辑）  |

1. 两者都是可重入锁

2. synchronized 依赖于 JVM 而 ReentrantLock 依赖于 API

   synchronized 是依赖于 JVM 实现的，虚拟机团队在 JDK1.6 为 synchronized 关键字进行了很多优化，但是这些优化都是在虚拟机层面实现的，并没有直接暴露给我们。ReentrantLock 是 JDK 层面实现的（也就是 API 层面，需要 lock() 和 unlock() 方法配合 try/finally 语句块来完成），所以我们可以通过查看它的源代码，来看它是如何实现的。

3. ReentrantLock 比 synchronized 增加了一些高级功能。主要来说主要有三点：**①等待可中断；②可实现公平锁；③可实现选择性通知（锁可以绑定多个条件）**

   - **ReentrantLock提供了一种能够中断等待锁的线程的机制**，通过 `lock.lockInterruptibly()` 来实现这个机制。也就是说正在等待的线程可以选择放弃等待，改为处理其他事情。

   - **ReentrantLock可以指定是公平锁还是非公平锁。而synchronized只能是非公平锁。所谓的公平锁就是先等待的线程先获得锁。** ReentrantLock 默认情况是非公平的，可以通过 ReentrantLock 类的 `ReentrantLock(boolean fair)` 构造方法来制定是否是公平的。

   - synchronized 关键字与 `wait()` 和 `notify()/notifyAll()` 方法相结合可以实现等待/通知机制，ReentrantLock 类当然也可以实现，但是需要借助于 Condition 接口与 `newCondition()` 方法。Condition 是 JDK1.5 之后才有的，它具有很好的灵活性，比如可以实现多路通知功能也就是在一个Lock对象中可以创建多个Condition实例（即对象监视器），**线程对象可以注册在指定的Condition中，从而可以有选择性的进行线程通知，在调度线程上更加灵活。 在使用notify()/notifyAll()方法进行通知时，被通知的线程是由 JVM 选择的，用ReentrantLock类结合Condition实例可以实现“选择性通知”** ，这个功能非常重要，而且是Condition接口默认提供的。而synchronized关键字就相当于整个Lock对象中只有一个Condition实例，所有的线程都注册在它一个身上。如果执行notifyAll()方法的话就会通知所有处于等待状态的线程这样会造成很大的效率问题，而Condition实例的signalAll()方法 只会唤醒注册在该Condition实例中的所有等待线程。



### 🎯 读写锁 ReentrantReadWriteLock

"ReadWriteLock实现了读写分离，适用于读多写少的场景：

**核心特点**：

- **读锁共享**：多个线程可同时持有读锁
- **写锁独占**：写锁与任何锁互斥
- **锁降级**：持有写锁时可获取读锁
- **不支持锁升级**：持有读锁时不能获取写锁”



### 🎯 什么是线程死锁? 如何避免死锁?

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



### 🎯 如何避免线程死锁?

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



### 🎯 如何排查死锁?

定位死锁最常见的方式就是利用 jstack 等工具获取线程栈，然后定位互相之间的依赖关系，进而找到死锁。如果是比较明显的死锁，往往 jstack 等就能直接定位，类似 JConsole 甚至可以在图形界面进行有限的死锁检测。

如果程序运行时发生了死锁，绝大多数情况下都是无法在线解决的，只能重启、修正程序本身问题。所以，代码开发阶段互相审查，或者利用工具进行预防性排查，往往也是很重要的。

#### 死锁预防

1. 以确定的顺序获得锁

   如果必须获取多个锁，那么在设计的时候需要充分考虑不同线程之前获得锁的顺序

2. 超时放弃

   当使用 synchronized 关键词提供的内置锁时，只要线程没有获得锁，那么就会永远等待下去，然而Lock接口提供了`boolean tryLock(long time, TimeUnit unit) throws InterruptedException`方法，该方法可以按照固定时长等待锁，因此线程可以在获取锁超时以后，主动释放之前已经获得的所有的锁。通过这种方式，也可以很有效地避免死锁。



### 🎯 哲学家就餐问题？

> 这题我刚毕业那会，遇见过一次，笔试题
>
> 哲学家就餐问题（The Dining Philosophers Problem）是计算机科学中经典的同步问题之一，由 Edsger Dijkstra 于 1965 年提出。问题描述如下：
>
> - 有五个哲学家围坐在圆桌旁，每个哲学家前面有一盘意大利面。
>
> - 在每两位哲学家之间有一只叉子（共五只叉子）。
>
> - 哲学家需要两只叉子才能吃意大利面。
>
> - 哲学家可以进行两个动作：思考和吃饭。
>
> - 当哲学家思考时，他们不占用任何叉子；当哲学家准备吃饭时，他们必须先拿起左右两边的叉子。
>
>   ![1226. 哲学家进餐- 力扣（LeetCode）](https://img.starfish.ink/algorithm/philosopher.jpeg)

问题的关键在于如何避免死锁（Deadlock），确保每个哲学家都有机会吃饭，同时也要避免资源饥饿（Starvation）

**解决方案**

对于这个问题我们该如何解决呢？有多种解决方案，这里我们讲讲其中的几种。前面我们讲过，要想解决死锁问题，只要破坏死锁四个必要条件的任何一个都可以。

**1. 服务员检查**

第一个解决方案就是引入服务员检查机制。比如我们引入一个服务员，当每次哲学家要吃饭时，他需要先询问服务员：我现在能否去拿筷子吃饭？此时，服务员先判断他拿筷子有没有发生死锁的可能，假如有的话，服务员会说：现在不允许你吃饭。这是一种解决方案。

```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class DiningPhilosophers {
    private final Lock[] forks = new ReentrantLock[5];
    private final Semaphore waiter = new Semaphore(4);

    public DiningPhilosophers() {
        for (int i = 0; i < forks.length; i++) {
            forks[i] = new ReentrantLock();
        }
    }

    public void dine(int philosopher) throws InterruptedException {
        waiter.acquire();

        int leftFork = philosopher;
        int rightFork = (philosopher + 1) % 5;

        forks[leftFork].lock();
        forks[rightFork].lock();

        try {
            eat(philosopher);
        } finally {
            forks[leftFork].unlock();
            forks[rightFork].unlock();
            waiter.release();
        }
    }

    private void eat(int philosopher) throws InterruptedException {
        System.out.println("Philosopher " + philosopher + " is eating");
        Thread.sleep(1000);  // Simulate eating
        System.out.println("Philosopher " + philosopher + " finished eating");
    }

    public static void main(String[] args) {
        DiningPhilosophers dp = new DiningPhilosophers();
        for (int i = 0; i < 5; i++) {
            final int philosopher = i;
            new Thread(() -> {
                try {
                    dp.dine(philosopher);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
    }
}

```

**2. 领导调节**

基于死锁**检测和恢复策略**，可以引入一个领导，这个领导进行定期巡视。如果他发现已经发生死锁了，就会剥夺某一个哲学家的筷子，让他放下。这样一来，由于这个人的牺牲，其他的哲学家就都可以吃饭了。这也是一种解决方案。

**3. 改变一个哲学家拿筷子的顺序**

我们还可以利用**死锁避免**策略，那就是从逻辑上去避免死锁的发生，比如改变其中一个哲学家拿筷子的顺序。我们可以让 4 个哲学家都先拿左边的筷子再拿右边的筷子，但是**有一名哲学家与他们相反，他是先拿右边的再拿左边的**，这样一来就不会出现循环等待同一边筷子的情况，也就不会发生死锁了。

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class DiningPhilosophers {
    private final Lock[] forks = new ReentrantLock[5];

    public DiningPhilosophers() {
        for (int i = 0; i < forks.length; i++) {
            forks[i] = new ReentrantLock();
        }
    }

    public void dine(int philosopher) throws InterruptedException {
        int leftFork = philosopher;
        int rightFork = (philosopher + 1) % 5;

        if (philosopher % 2 == 0) {
            forks[leftFork].lock();
            forks[rightFork].lock();
        } else {
            forks[rightFork].lock();
            forks[leftFork].lock();
        }

        try {
            eat(philosopher);
        } finally {
            forks[leftFork].unlock();
            forks[rightFork].unlock();
        }
    }

    private void eat(int philosopher) throws InterruptedException {
        System.out.println("Philosopher " + philosopher + " is eating");
        Thread.sleep(1000);  // Simulate eating
        System.out.println("Philosopher " + philosopher + " finished eating");
    }

    public static void main(String[] args) {
        DiningPhilosophers dp = new DiningPhilosophers();
        for (int i = 0; i < 5; i++) {
            final int philosopher = i;
            new Thread(() -> {
                try {
                    dp.dine(philosopher);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
    }
}

```



### 🎯 何谓悲观锁与乐观锁?

- **悲观锁**

  总是假设最坏的情况，每次去拿数据的时候都认为别人会修改，所以每次在拿 数据的时候都会上锁，这样别人想拿这个数据就会阻塞直到它拿到锁(共享资 源每次只给一个线程使用，其它线程阻塞，用完后再把资源转让给其它线程)。传统的关系型数据库里边就用到了很多这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁。Java 中 synchronized 和 ReentrantLock 等独占锁就是悲观锁思想的实现。

- **乐观锁**

  总是假设最好的情况，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号机制和 CAS 算法实现。乐观锁适用于多读的应用类型，这样可以提 高吞吐量，像数据库提供的类似于 **write_condition** 机制，其实都是提供的乐 观锁。在 Java 中 `java.util.concurrent.atomic` 包下面的原子变量类就是使用了 乐观锁的一种实现方式 **CAS** 实现的。

**两种锁的使用场景**

从上面对两种锁的介绍，我们知道两种锁各有优缺点，不可认为一种好于另一 种，像**乐观锁适用于写比较少的情况下(多读场景)**，即冲突真的很少发生的 时候，这样可以省去了锁的开销，加大了系统的整个吞吐量。但如果是多写的情况，一般会经常产生冲突，这就会导致上层应用会不断的进行 retry，这样反倒是降低了性能，所以**一般多写的场景下用悲观锁就比较合适**。



### 🎯 对比公平和非公平的优缺点?

公平锁的优点在于各个线程公平平等，每个线程等待一段时间后，都有执行的机会，而它的缺点就在于整体执行速度更慢，吞吐量更小，相反非公平锁的优势就在于整体执行速度更快，吞吐量更大，但同时也可能产生线程饥饿问题，也就是说如果一直有线程插队，那么在等待队列中的线程可能长时间得不到运行





## 四、原子操作与CAS（无锁编程）⚛️ 

在编程中，具备原子性的操作被称为原子操作。原子操作是指一系列的操作，要么全部发生，要么全部不发生，不会出现执行一半就终止的情况。

> 下面我们举一个不具备原子性的例子，比如 i++ 这一行代码在 CPU 中执行时，可能会从一行代码变为以下的 3 个指令：
>
> - 第一个步骤是读取；
> - 第二个步骤是增加；
> - 第三个步骤是保存。
>
> 这就说明 i++ 是不具备原子性的，同时也证明了 i++ 不是线程安全的

Java 中的以下几种操作是具备原子性的，属于原子操作：

- 除了 long 和 double 之外的基本类型（int、byte、boolean、short、char、float）的读/写操作，都天然的具备原子性；
- 所有引用 reference 的读/写操作；
- 加了 volatile 后，所有变量的读/写操作（包含 long 和 double）。这也就意味着 long 和 double 加了 volatile 关键字之后，对它们的读写操作同样具备原子性；
- 在 java.concurrent.Atomic 包中的一部分类的一部分方法是具备原子性的，比如 AtomicInteger 的 incrementAndGet 方法。

> 在 Java 中，`long` 和 `double` 变量的原子性取决于具体的硬件和 JVM 实现，但通常情况下，对 `long` 和 `double` 类型变量的读和写操作不是原子的。这是因为 `long` 和 `double` 在 JVM 中占用 64 位，而在 32 位的 JVM 实现中，对 64 位的操作可能需要分两步进行：每次操作 32 位。因此，如果没有额外的同步措施，多个线程可能会看到部分更新的值，这会导致数据不一致。
>
> **实际开发中**，目前各种平台下的主流虚拟机的实现中，几乎都会把 64 位数据的读写操作作为原子操作来对待，因此我们在编写代码时一般不需要为了避免读到“半个变量”而把 long 和 double 声明为 volatile 的

**原子类的作用**和锁有类似之处，是为了保证并发情况下线程安全。不过原子类相比于锁，有一定的优势：

- 粒度更细：原子变量可以把竞争范围缩小到变量级别，通常情况下，锁的粒度都要大于原子变量的粒度。
- 效率更高：除了高度竞争的情况之外，使用原子类的效率通常会比使用同步互斥锁的效率更高，因为原子类底层利用了 CAS 操作，不会阻塞线程。

| 类型                               | 具体类                                                       |
| :--------------------------------- | :----------------------------------------------------------- |
| Atomic* 基本类型原子类             | AtomicInteger、AtomicLong、AtomicBoolean                     |
| Atomic*Array 数组类型原子类        | AtomicIntegerArray、AtomicLongArray、AtomicReferenceArray    |
| Atomic*Reference 引用类型原子类    | AtomicReference、AtomicStampedReference、AtomicMarkableReference |
| Atomic*FieldUpdater 升级类型原子类 | AtomicIntegerfieldupdater、AtomicLongFieldUpdater、AtomicReferenceFieldUpdater |
| Adder 累加器                       | LongAdder、DoubleAdder                                       |
| Accumulator 积累器                 | LongAccumulator、DoubleAccumulator                           |



### 🎯 AtomicInteger 底层实现原理是什么？如何在自己的产品代码中应用 CAS 操作？

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



### 🎯 CAS 知道吗，如何实现？

- CAS：全称 `Compare and swap`，即**比较并交换**，它是一条 **CPU 同步原语**。 是一种硬件对并发的支持，针对多处理器操作而设计的一种特殊指令，用于管理对共享数据的并发访问。 
- CAS 是一种无锁的非阻塞算法的实现。 
- CAS 包含了 3 个操作数：
  - 需要读写的内存值 V 
  - 旧的预期值 A 
  - 要修改的更新值 B 
- 当且仅当 V 的值等于 A 时，CAS 通过原子方式用新值 B 来更新 V 的 值，否则不会执行任何操作（他的功能是判断内存某个位置的值是否为预期值，如果是则更改为新的值，这个过程是原子的。）
- 缺点
  - 自旋时间过长：由于单次 CAS 不一定能执行成功，所以 **CAS 往往是配合着循环来实现的**，有的时候甚至是死循环，不停地进行重试，直到线程竞争不激烈的时候，才能修改成功
  - 只能保证一个共享变量的原子操作：不能灵活控制线程安全的范围，我们不能针对多个共享变量同时进行 CAS 操作，因为这多个变量之间是独立的，简单的把原子操作组合到一起，并不具备原子性
  - ABA 问题（用 AtomicReference 避免）



### 🎯 CAS 底层原理，谈谈你对 UnSafe 的理解？

> "CAS（Compare and Swap）是一种硬件支持的原子操作：
>
> **基本原理**：
>
> - 包含3个操作数：内存值V、预期值A、更新值B
> - 当且仅当V==A时，才将V更新为B
> - CPU硬件保证整个操作的原子性
>
> **优势与问题**：
>
> - 优势：无锁化，避免线程阻塞
> - ABA问题：可用AtomicStampedReference解决
> - 自旋开销：高竞争下可能CPU空转"

CAS 并发原语体现在 Java 语言中的 `sum.misc.Unsafe` 类中的各个方法。调用 Unsafe 类中的 CAS 方法， JVM 会帮助我们实现出 CAS 汇编指令。

是 CAS 的核心类，由于 Java 方法无法直接访问底层系统，需要通过本地（native）方法来访问，UnSafe 相当于一个后门，UnSafe 类中的所有方法都是 native 修饰的，也就是说该类中的方法都是直接调用操作系统底层资源执行相应任务。 



### 🎯 讲一讲AtomicInteger，为什么要用 CAS 而不是 synchronized？

1. **高效的线程安全**：CAS 能在多线程下提供线程安全的操作，而不需要像 `synchronized` 一样使用锁。CAS 的自旋机制在短时间内是非常高效的，因为大多数情况下操作会在几次尝试内成功。
2. **无锁优化**：CAS 不会引发线程的阻塞和挂起，避免了线程在获取锁时的开销。这对于高并发场景特别重要，`AtomicInteger` 能在高并发场景下提供更好的性能表现。
3. **避免锁的竞争和开销**：`synchronized` 在多线程竞争时，失败的线程会被挂起并等待唤醒，涉及到线程上下文切换，开销较大。而 CAS 通过乐观锁的思想，只在冲突发生时重试，避免了不必要的线程切换。

**CAS 的问题：**

虽然 CAS 比 `synchronized` 更高效，但它也有一些缺点：

- **ABA 问题**：CAS 会比较当前值是否等于期望值，但如果一个变量的值从 A 变为 B，再变回 A，CAS 会认为它没有改变，从而通过比较。为了解决这个问题，可以引入版本号。
- **自旋开销**：如果线程不断尝试修改变量，但总是失败，自旋的开销会变得很高。在高竞争环境下，CAS 的性能优势可能会减小。
- **只能保证一个变量的原子性**：CAS 只能操作单个变量，对于复杂的并发操作场景，仍然需要使用锁或其他同步机制。



### 🎯 为什么高并发下 LongAdder 比 AtomicLong 效率更高？

>  "LongAdder采用分段累加思想：
>
> **核心机制**：
>
> - **base变量**：竞争不激烈时直接累加
> - **Cell[]数组**：竞争激烈时分散累加
> - **hash分配**：线程按hash值分配到不同Cell
>
> **性能优势**：空间换时间，减少CAS竞争"

LongAdder 引入了分段累加的概念，内部一共有两个参数参与计数：第一个叫作 base，它是一个变量，第二个是 Cell[] ，是一个数组。

其中的 base 是用在竞争不激烈的情况下的，可以直接把累加结果改到 base 变量上。

那么，当竞争激烈的时候，就要用到我们的 Cell[] 数组了。一旦竞争激烈，各个线程会分散累加到自己所对应的那个 Cell[] 数组的某一个对象中，而不会大家共用同一个。

这样一来，LongAdder 会把不同线程对应到不同的 Cell 上进行修改，降低了冲突的概率，这是一种分段的理念，提高了并发性，这就和 Java 7 的 ConcurrentHashMap 的 16 个 Segment 的思想类似。

竞争激烈的时候，LongAdder 会通过计算出每个线程的 hash 值来给线程分配到不同的 Cell 上去，每个 Cell 相当于是一个独立的计数器，这样一来就不会和其他的计数器干扰，Cell 之间并不存在竞争关系，所以在自加的过程中，就大大减少了刚才的 flush 和 refresh，以及降低了冲突的概率，这就是为什么 LongAdder 的吞吐量比 AtomicLong 大的原因，本质是空间换时间，因为它有多个计数器同时在工作，所以占用的内存也要相对更大一些。







## 五、并发工具类（同步辅助）🛠️ 

### 🎯 AQS 原理分析

> AQS 是 JUC 的核心框架，其原理可概括为：
>
> 1. **状态管理**：通过 `volatile int state` 和 CAS 操作保证原子性。
> 2. **队列设计**：CLH 变体双向链表，管理等待线程。
> 3. **模板方法**：子类通过重写 `tryAcquire()`/`tryRelease()` 实现独占或共享锁。
> 4. 核心机制：
>    - 独占模式（如 `ReentrantLock`）：线程竞争失败则入队阻塞。
>    - 共享模式（如 `CountDownLatch`）：允许多线程同时访问。
> 5. **应用场景**：锁、信号量、倒计时器等同步工具的基础。

AQS的全称为（AbstractQueuedSynchronizer），这个类在 `java.util.concurrent.locks` 包下面。

AQS是一个用来构建锁和同步器的框架，使用AQS能简单且高效地构造出应用广泛的大量的同步器，比如我们提到的ReentrantLock，Semaphore，其他的诸如ReentrantReadWriteLock，SynchronousQueue，FutureTask 等等皆是基于 AQS 的。当然，我们自己也能利用 AQS 非常轻松容易地构造出符合我们自己需求的同步器。

AQS 是 Java 并发包（JUC）的核心框架，用于构建锁（如 `ReentrantLock`）和同步器（如 `CountDownLatch`）。

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

> 而 state 的含义并不是一成不变的，它会**根据具体实现类的作用不同而表示不同的含义**。
>
> 比如说在信号量里面，state 表示的是剩余**许可证的数量**。如果我们最开始把 state 设置为 10，这就代表许可证初始一共有 10 个，然后当某一个线程取走一个许可证之后，这个 state 就会变为 9，所以信号量的 state 相当于是一个内部计数器。
>
> 再比如，在 CountDownLatch 工具类里面，state 表示的是**需要“倒数”的数量**。一开始我们假设把它设置为 5，当每次调用 CountDown 方法时，state 就会减 1，一直减到 0 的时候就代表这个门闩被放开。
>
> 下面我们再来看一下 state 在 ReentrantLock 中是什么含义，在 ReentrantLock 中它表示的是**锁的占有情况**。最开始是 0，表示没有任何线程占有锁；如果 state 变成 1，则就代表这个锁已经被某一个线程所持有了。

**AQS 定义两种资源共享方式**

- Exclusive（独占）：只有一个线程能执行，如 ReentrantLock。又可分为公平锁和非公平锁：

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



### 🎯 AQS 组件总结

“AQS 衍生的同步组件可分为：

1. 独占模式：
   - `ReentrantLock`：可重入锁，支持公平 / 非公平，手动控制加解锁。
   - `ReentrantReadWriteLock`：读写分离，读锁共享、写锁独占。
2. 共享模式：
   - `Semaphore`：信号量，控制并发线程数（如限流）。
   - `CountDownLatch`：倒计时门栓，一次性等待多线程完成。
   - `CyclicBarrier`：循环屏障，可重复使用，等待所有线程同步。
     选择时需根据场景特性（互斥 / 共享、是否可重复、同步类型）合理选用，例如接口限流用 `Semaphore`，任务汇总用 `CountDownLatch`。”



### 🎯 AQS是如何唤醒下一个线程的？

当需要阻塞或者唤醒一个线程的时候，AQS都是使用 LockSupport 这个工具类来完成的。

AQS（AbstractQueuedSynchronizer）的核心功能之一是**线程的阻塞与唤醒**。当持有锁的线程释放资源后，AQS 需要精确地唤醒等待队列中的下一个线程，以确保同步逻辑的正确性。下面从源码角度深入分析这一过程：

一、唤醒线程的触发点

AQS 唤醒线程主要发生在两种场景：

1. **释放锁时**：独占模式下调用 `release()`，共享模式下调用 `releaseShared()`。
2. **取消等待时**：当线程被中断或超时，会从队列中移除并尝试唤醒后继节点。

二、唤醒线程的核心方法：`unparkSuccessor()`

这是 AQS 唤醒线程的核心实现，其逻辑如下：

```java
private void unparkSuccessor(Node node) {
    // 获取当前节点的等待状态
    int ws = node.waitStatus;
    // 如果状态为 SIGNAL(-1) 或 CONDITION(-2) 或 PROPAGATE(-3)，尝试将其设为 0
    if (ws < 0)
        compareAndSetWaitStatus(node, ws, 0);

    // 找到有效的后继节点（排除状态为 CANCELLED(1) 的节点）
    Node s = node.next;
    if (s == null || s.waitStatus > 0) {
        s = null;
        // 从尾部向前遍历，找到最靠前的有效节点
        for (Node t = tail; t != null && t != node; t = t.prev) {
            if (t.waitStatus <= 0)
                s = t;
        }
    }
    
    // 唤醒找到的有效后继节点
    if (s != null)
        LockSupport.unpark(s.thread);
}
```



### 🎯 AQS 中独占锁和共享锁的操作流程大体描述一下

##### **独占锁与共享锁的区别**

- **独占锁是持有锁的线程释放锁之后才会去唤醒下一个线程。**
- **共享锁是线程获取到锁后，就会去唤醒下一个线程，所以共享锁在获取锁和释放锁的时候都会调用doReleaseShared方法唤醒下一个线程，当然这会受共享线程数量的限制**。



### 🎯 countDownLatch/CycliBarries/Semaphore使用过吗

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

![img](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/Java%20%e5%b9%b6%e5%8f%91%e7%bc%96%e7%a8%8b%2078%20%e8%ae%b2-%e5%ae%8c/assets/Cgq2xl5fiViAS1xOAADHimTjAp0576.png)

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

#### CountDownLatch

用于等待其他线程完成操作

![img](https://learn.lianglianglee.com/%e4%b8%93%e6%a0%8f/Java%20%e5%b9%b6%e5%8f%91%e7%bc%96%e7%a8%8b%2078%20%e8%ae%b2-%e5%ae%8c/assets/Cgq2xl5h8oSAKLBQAABld2EcD7Q385.png)





## 六、线程池详解（任务调度核心）🏊 

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



### 🎯 为什么要用线程池，优势是什么？

> **池化技术相比大家已经屡见不鲜了，线程池、数据库连接池、Http 连接池等等都是对这个思想的应用。池化技术的思想主要是为了减少每次获取资源的消耗，提高对资源的利用率。**
>
> 如果每个任务都创建一个线程会带来哪些问题：
>
> 1. 第一点，反复创建线程系统开销比较大，每个线程创建和销毁都需要时间，如果任务比较简单，那么就有可能导致创建和销毁线程消耗的资源比线程执行任务本身消耗的资源还要大。
> 2. 第二点，过多的线程会占用过多的内存等资源，还会带来过多的上下文切换，同时还会导致系统不稳定。

线程池是一种基于池化思想管理线程的工具。

线程池做的工作主要是控制运行的线程数量，处理过程中将任务放入队列，然后在线程创建后启动这些任务，如果线程数量超过了最大数量，超出数量的线程排队等候，等其他线程执行完毕，再从队列中取出任务来执行。

主要优点：

1. **降低资源消耗**：线程复用，通过重复利用已创建的线程减低线程创建和销毁造成的消耗
2. **提高响应速度**：当任务到达时，任务可以不需要等到线程创建就能立即执行
3. **提高线程的可管理性**：线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。
4. **提供更多更强大的功能**：线程池具备可拓展性，允许开发人员向其中增加更多的功能。比如延时定时线程池ScheduledThreadPoolExecutor，就允许任务延期执行或定期执行。



### 🎯 Java 并发类库提供的线程池有哪几种？ 分别有什么特点？

- `FixedThreadPool`：固定线程数，无界队列，适合稳定负载；
- `SingleThreadExecutor`：单线程顺序执行，避免竞争；
- `CachedThreadPool`：动态创建线程，适合短任务；线程数不固定，可动态创建新线程（最大为 Integer.MAX_VALUE）。工作队列是 **SynchronousQueue（无存储能力）**
- `ScheduledThreadPool`：支持定时 / 周期任务；工作队列是 **DelayedWorkQueue**，按任务执行时间排序
- `WorkStealingPool`（Java 8+）：基于 ForkJoinPool，利用工作窃取算法提升多核性能。内部使用 **双端队列（WorkQueue）**，任务按 LIFO 顺序执行。

实际开发中建议自定义 `ThreadPoolExecutor`，避免无界队列导致 OOM，根据任务类型（CPU/IO 密集）设置核心参数



### 🎯 线程池的几个重要参数？

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

- **`corePoolSize`（核心线程数）**

  - 线程池初始创建时的线程数量，即使线程空闲也不会被销毁（除非设置 `allowCoreThreadTimeOut` 为 `true`）
  - 创建线程池后，当有请求任务进来之后，就会安排池中的线程去执行请求任务，近似理解为近日当值线程
  - 当线程池中的线程数目达到 corePoolSize 后，就会把到达的任务放到缓存队列中

- **`maximumPoolSize`（最大线程数）**： 线程池允许创建的最大线程数量，必须 ≥ `corePoolSize`。

- **`keepAliveTime`（线程存活时间）**： 非核心线程（超过 `corePoolSize` 的线程）在空闲时的存活时间

- **`unit`（时间单位）**： `keepAliveTime` 的时间单位（如 `TimeUnit.SECONDS`、`MILLISECONDS`）

- **`workQueue`（工作队列）**： 存储等待执行的任务，必须是 `BlockingQueue` 实现类

- **`threadFactory`（线程工厂）**：用于设置创建线程的工厂，可以给创建的线程设置有意义的名字，可方便排查问题

- **`handler`（拒绝策略）**：拒绝策略，表示当队列满了且工作线程大于等于线程池的最大线程数（maximumPoolSize）时如何来拒绝请求执行的线程的策略，主要有四种类型。

  等待队列也已经满了，再也塞不下新任务。同时，线程池中的 max 线程也达到了，无法继续为新任务服务，这时候我们就需要拒绝策略合理的处理这个问题了。

  - AbortPolicy   直接抛出 RegectedExcutionException 异常阻止系统正常进行，**默认策略**
  - DiscardPolicy  直接丢弃任务，不予任何处理也不抛出异常，如果允许任务丢失，这是最好的一种方案
  - DiscardOldestPolicy  抛弃队列中等待最久的任务，然后把当前任务加入队列中尝试再次提交当前任务
  - CallerRunsPolicy  交给线程池调用所在的线程进行处理，“调用者运行”的一种调节机制，该策略既不会抛弃任务，也不会抛出异常，而是将某些任务回退到调用者，从而降低新任务的流量

  以上内置拒绝策略均实现了 `RejectExcutionHandler` 接口



### 🎯 线程池工作原理？

![Java线程池实现原理及其在美团业务中的实践- 美团技术团队](https://p0.meituan.net/travelcube/77441586f6b312a54264e3fcf5eebe2663494.png)

**线程池在内部实际上构建了一个生产者消费者模型，将线程和任务两者解耦，并不直接关联，从而良好的缓冲任务，复用线程**。线程池的运行主要分成两部分：**任务管理、线程管理**。

任务管理部分充当生产者的角色，当任务提交后（通过 `execute()` 或 `submit()` 方法提交任务），线程池会判断该任务后续的流转：

- 直接申请线程执行该任务；
- 缓冲到队列中等待线程执行；
- 拒绝该任务。

线程管理部分是消费者角色，它们被统一维护在线程池内，根据任务请求进行线程的分配，当线程执行完任务后则会继续获取新的任务去执行，最终当线程获取不到任务的时候，线程就会被回收。

流程：

1. 在创建线程池后，等待提交过来的任务请求

2. 当调用 execute() 方法添加一个请求任务时，线程池会做如下判断：

   - **判断核心线程数**：如果正在运行的线程数量小于 corePoolSize，那么马上创建线程运行这个任务（即使有空闲线程）
     - 示例：核心线程数为 5，前 5 个任务会立即创建 5 个线程执行。
   - **判断工作队列**：如果正在运行的线程数量大于或等于 corePoolSize，任务进入 **工作队列（workQueue）** 等待
     - 若队列为 **无界队列**（如 `LinkedBlockingQueue`），任务会无限排队，`maximumPoolSize` 失效。
     - 若队列为 **有界队列**（如 `ArrayBlockingQueue`），队列满时进入下一步。
   - **判断最大线程数**：如果这个时候队列已满且线程数 < `maximumPoolSize`，**创建非核心线程执行任务**
     - 示例：核心线程数 5，最大线程数 10，队列容量 100。当提交第 106 个任务时（前 5 个线程 + 100 个队列任务），创建第 6 个线程。
   - **触发拒绝策略**：如果队列满了且正在运行的线程数量大于或等于 maximumPoolSize，那么线程池**会启动饱和拒绝策略来执行**
     - 若队列已满且线程数 ≥ `maximumPoolSize`，调用 `RejectedExecutionHandler` 处理任务。
     - 默认策略 `AbortPolicy` 直接抛异常，其他策略包括回退给调用者（`CallerRunsPolicy`）、丢弃最老任务（`DiscardOldestPolicy`）等。

   ```
   提交任务 → 线程数 < corePoolSize？→ 是：创建核心线程执行
                        ↓ 否
                    队列未满？→ 是：入队等待
                        ↓ 否
                    线程数 < maxPoolSize？→ 是：创建非核心线程执行
                            ↓ 否
                        触发拒绝策略
   ```

3. 当一个线程完成任务时，它会从队列中取下一个任务来执行

4. 当一个线程无事可做超过一定的时间（keepAliveTime）时，线程池会判断：

   - 如果当前运行的线程数大于 corePoolSize，那么这个线程就被停掉
   - 所以线程池的所有任务完成后它**最终会收缩到 corePoolSize 的大小**

>在线程池中，同一个线程可以从 BlockingQueue 中不断提取新任务来执行，其核心原理在于线程池对 Thread 进行了封装，并不是每次执行任务都会调用 Thread.start() 来创建新线程，而是让每个线程去执行一个“循环任务”，在这个“循环任务”中，不停地检查是否还有任务等待被执行，如果有则直接去执行这个任务，也就是调用任务的 run 方法，把 run 方法当作和普通方法一样的地位去调用，相当于把每个任务的 run() 方法串联了起来，所以线程数量并不增加。

## 🎯 线程生命周期管理

线程池中的线程通过 `Worker` 类封装，其生命周期如下：

1. **Worker 初始化**
   - `Worker` 继承 `AbstractQueuedSynchronizer`（AQS），实现锁机制，避免任务执行期间被中断。
   - 每个 `Worker` 持有一个 `Thread`，启动时执行 `runWorker()` 方法。
2. **任务循环执行**
   - `runWorker()`方法通过 `getTask()`从队列获取任务：
     - 若为核心线程，`getTask()` 会阻塞等待（除非 `allowCoreThreadTimeOut=true`）。
     - 若非核心线程，`getTask()` 超时（`keepAliveTime`）后返回 `null`，线程终止。
3. **线程回收**
   - 当 `getTask()` 返回 `null` 时，`runWorker()` 退出循环，`Worker` 被移除，线程销毁。
   - 最终线程池收缩到 `corePoolSize` 大小（除非设置核心线程超时）。

#### **源码级机制解析**

1. **线程池状态与线程数的原子管理**

   - 线程池使用一个 `AtomicInteger`变量 `ctl` 同时存储线程池状态和当前线程数：

     ```java
     // ctl 的高 3 位表示状态，低 29 位表示线程数
     private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
     ```

   - 状态包括：`RUNNING`（接收新任务）、`SHUTDOWN`（不接收新任务但处理队列任务）、`STOP`（不接收新任务且不处理队列任务）等。

2. **任务窃取与阻塞唤醒**

   - 线程池使用 `ReentrantLock` 保护内部状态，通过 `Condition` 实现线程间通信。
   - 当队列为空时，线程通过 `notEmpty.await()` 阻塞；当有新任务入队时，通过 `notEmpty.signal()` 唤醒等待线程。

3. **动态调整线程数**

   - 线程池提供 `setCorePoolSize()` 和 `setMaximumPoolSize()` 方法动态调整参数，适应负载变化。



### 🎯 Java线程池，5核心、10最大、20队列，第6个任务来了是什么状态？第26个任务来了是什么状态？队列满了以后执行队列的任务是从队列头 or 队尾取？核心线程和非核心线程执行结束后，谁先执行队列里的任务？

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

> 1. **第 6 个任务**：核心线程已满，任务进入队列（队列大小 = 1），线程数保持 5。
> 2. **第 26 个任务**：队列已满（20/20），创建第 6 个线程（非核心）执行，线程数 = 6。
> 3. **队列取出顺序**：默认 FIFO（从队列头部取），除非使用优先级队列。
> 4. **线程优先级**：核心 / 非核心线程无优先级差异，先空闲的线程先获取任务，但非核心线程可能因超时被回收。



### 🎯 执行execute()方法和submit()方法的区别是什么呢？

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



### 🎯 线程池常用的阻塞队列有哪些？

| **阻塞队列类型**          | **存储结构**       | **有界 / 无界**                           | **特点**                                                     | **适用场景**                         |
| ------------------------- | ------------------ | ----------------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| **ArrayBlockingQueue**    | 数组               | 有界                                      | - 初始化时指定容量，满后插入操作阻塞 - 按 FIFO 顺序处理元素 - 支持公平 / 非公平锁（默认非公平） | 任务量可预估、需要控制内存占用的场景 |
| **LinkedBlockingQueue**   | 链表               | 可选有界 / 无界（默认 Integer.MAX_VALUE） | - 无界时理论上可存储无限任务 - 按 FIFO 顺序处理元素 - 吞吐量高于 ArrayBlockingQueue | 任务量不确定、希望自动缓冲的场景     |
| **SynchronousQueue**      | 不存储元素         | 无界（逻辑上）                            | - 不存储任何元素，插入操作必须等待消费者接收 - 适合任务与线程直接移交，无缓冲需求 | 要求任务立即执行、避免队列积压的场景 |
| **PriorityBlockingQueue** | 堆结构             | 无界                                      | - 按元素优先级排序（实现 `Comparable` 或自定义 `Comparator`） - 支持获取优先级最高的任务 | 任务有优先级差异的场景（如紧急任务） |
| **DelayQueue**            | 优先队列（基于堆） | 无界                                      | - 元素需实现 `Delayed` 接口，按延迟时间排序 - 仅到期任务可被取出执行 | 定时任务、延迟执行场景（如超时处理） |

- 对于 FixedThreadPool 和 SingleThreadExector 而言，它们使用的阻塞队列是容量为 Integer.MAX_VALUE 的 LinkedBlockingQueue，可以认为是无界队列
- SynchronousQueue，对应的线程池是 CachedThreadPool。线程池 CachedThreadPool 的最大线程数是 Integer 的最大值，可以理解为线程数是可以无限扩展的
- DelayedWorkQueue，它对应的线程池分别是 ScheduledThreadPool 和 SingleThreadScheduledExecutor，这两种线程池的最大特点就是可以延迟执行任务。DelayedWorkQueue 的特点是内部元素并不是按照放入的时间排序，而是会按照延迟的时间长短对任务进行排序，内部采用的是“堆”的数据结构



### 🎯 如何创建线程池？

> 为什么不应该自动创建线程池？

创建线程池应直接使用 `ThreadPoolExecutor` 构造函数，避免 `Executors` 工厂方法的风险：

1. **拒绝无界队列**：`FixedThreadPool` 默认使用无界队列，可能导致 OOM。
2. **控制线程数**：`CachedThreadPool` 允许创建无限线程，可能耗尽资源。
3. **自定义参数**：根据任务特性（CPU/IO 密集）设置核心线程数、队列类型（如有界队列）和拒绝策略（如 `CallerRunsPolicy`）。
4. **监控与命名**：使用 `ThreadFactory` 命名线程，便于问题排查

> 《阿里巴巴Java开发手册》中强制线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险
>
> Executors 返回线程池对象的弊端如下：
>
> - **FixedThreadPool 和 SingleThreadExecutor** ： 允许请求的队列长度为 Integer.MAX_VALUE ，可能堆积大量的请求，从而导致OOM。
> - **CachedThreadPool 和 ScheduledThreadPool** ： 允许创建的线程数量为 Integer.MAX_VALUE ，可能会创建大量线程，从而导致OOM。



### 🎯 合理配置线程池你是如何考虑的？（创建多少个线程合适）

合理配置线程池的核心是确定线程数量，这需要结合任务类型、系统资源、硬件特性等多维度综合考量。

**一、线程池核心参数与线程数量的关系**

线程池的关键参数中，**`corePoolSize`（核心线程数）** 是线程数量配置的核心，它决定了线程池的基础处理能力。而`maximumPoolSize`（最大线程数）则作为流量高峰时的补充，两者需配合队列大小共同调整。

**二、任务类型分类与线程数计算**

根据任务的 IO 密集型、CPU 密集型特性，可采用不同的计算模型：

1. **CPU 密集型任务（计算密集型）**

   - **特点**：任务主要消耗 CPU 资源（如加密、压缩、数学计算），几乎没有 IO 等待。

   - 公式：`corePoolSize = CPU核心数 + 1`

     - 解释：CPU 核心数可通过`Runtime.getRuntime().availableProcessors()`获取，+1 是为了应对线程偶发的上下文切换开销，避免 CPU 空闲。

       > 为什么 +1 呢？
       >
       > 《Java并发编程实战》一书中给出的原因是：**即使当计算（CPU）密集型的线程偶尔由于页缺失故障或者其他原因而暂停时，这个“额外”的线程也能确保 CPU 的时钟周期不会被浪费。**
       >
       > 比如加密、解密、压缩、计算等一系列需要大量耗费 CPU 资源的任务，因为计算任务非常重，会占用大量的 CPU 资源，所以这时 CPU 的每个核心工作基本都是满负荷的，而我们又设置了过多的线程，每个线程都想去利用 CPU 资源来执行自己的任务，这就会造成不必要的上下文切换，此时线程数的增多并没有让性能提升，反而由于线程数量过多会导致性能下降。

   - **示例**：4 核 CPU 的服务器，核心线程数设为 5。

2. **IO 密集型任务（读写 / 网络请求等）**

   IO 密集型则是系统运行时，大部分时间都在进行 I/O 操作，CPU 占用率不高。比如像 MySQL 数据库、文件的读写、网络通信等任务，这类任务**不会特别消耗 CPU 资源，但是 IO 操作比较耗时，会占用比较多时间**。

   在单线程上运行 IO 密集型的任务会导致浪费大量的 CPU 运算能力浪费在等待。

   所以在 IO 密集型任务中使用多线程可以大大的加速程序运行，即使在单核 CPU 上，这种加速主要就是利用了被浪费调的阻塞时间。

   IO 密集型时，大部分线程都阻塞，故需要多配置线程数：

   IO 密集型任务：

   - **特点**：任务频繁等待 IO 操作（如数据库查询、文件读写、网络通信），CPU 利用率低。

   - 公式：这个公式有很多种观点，

     - `CPU 核心数 × 2（IO 等待时线程可复用）`
     - `CPU 核心数 × （1 + 平均IO等待时间/平均CPU处理时间）`
     - `CPU 核心数 * (1 + 阻塞系数)`
     - 解释：IO 等待时间越长，需要越多线程来 “切换执行” 以充分利用 CPU。

     > 《Java并发编程实战》的作者 Brain Goetz 推荐的计算方法：
     >
     > ```undefined
     > 线程数 = CPU 核心数 *（1+平均等待时间/平均工作时间）
     > ```
     >
     > 太少的线程数会使得程序整体性能降低，而过多的线程也会消耗内存等其他资源，所以如果想要更准确的话，可以进行压测，监控 JVM 的线程情况以及 CPU 的负载情况，根据实际情况衡量应该创建的线程数，合理并充分利用资源。


3. **混合型任务（兼具 CPU 和 IO 操作）**

   - **方案 1**：拆分为独立线程池，分别处理 CPU 和 IO 任务（推荐）。

   - **方案 2**：若无法拆分，按 IO 密集型任务计算，并通过监控调整。

**三、其他影响因素与实践策略**

1. **系统资源限制**

   - **内存约束**：线程数过多会导致内存溢出（每个线程默认栈大小约 1MB）。

   - **IO 资源**：如数据库连接数限制，线程数不应超过数据库最大连接数。

2. **任务队列大小**

   - 线程数需与队列容量配合：
     - 若`corePoolSize`较小，队列可设为中等大小（如 100），应对流量波动；
     - 若`corePoolSize`较大，队列可设为较小值（如 20），避免任务堆积。

3. **动态调整策略**

   - **自适应线程池**：通过监控 CPU 利用率、任务队列长度动态调整线程数（如使用`ScheduledExecutorService`定期检测）。

   - **示例代码**：

     ```java
     // 动态线程池实现示例（Spring Boot）
     @Bean
     public ThreadPoolTaskExecutor dynamicExecutor() {
         ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
         executor.setCorePoolSize(8); 
         executor.setMaxPoolSize(32);
         executor.setQueueCapacity(1000);
         
         // 开启监控自动调整
         executor.setAllowCoreThreadTimeOut(true);
         executor.setKeepAliveSeconds(30);
         
         // 添加监控指标
         executor.setThreadPoolExecutor(new ThreadPoolExecutor(
             ... // 参数同上
         ) {
             protected void afterExecute(Runnable r, Throwable t) {
                 monitorAndAdjust(); // 监控回调
             }
         });
         return executor;
     }
     
     private void monitorAndAdjust() {
         // 基于队列堆积情况调整
         if (queueSize > 800) { // 队列堆积警告阈值
             executor.setMaxPoolSize(Math.min(64, executor.getMaxPoolSize() + 4));
         } 
         else if (queueSize < 200 && executor.getMaxPoolSize() > 32) {
             executor.setMaxPoolSize(executor.getMaxPoolSize() - 2);
         }
     }
     ```

4. **压测与监控**

   - 压测验证：通过 JMeter 等工具模拟不同并发量，观察线程池的：
     - 任务处理耗时（响应时间）；
     - CPU、内存利用率；
     - 队列堆积情况（是否触发拒绝策略）。

- 关键监控指标：
  - `taskCount`（总任务数）、`completedTaskCount`（完成任务数）；
  - 线程活跃数、队列剩余容量；
  - 拒绝任务数（是否触发`RejectedExecutionHandler`）。



### 🎯 当提交新任务时，异常如何处理?

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







## 七、Java内存模型（JMM）🧠 

> 指令重排
>
> 内存屏障
>
> 单核CPU有可见性问题吗

### 🎯 为什么需要 JMM（Java Memory Model，Java 内存模型）？

> "JMM解决了跨平台的内存访问一致性问题：
>
> **解决的问题**：
>
> - 不同处理器内存模型差异
> - 编译器优化导致的指令重排
> - 多线程下的可见性、原子性、有序性
>
> **组成**：
>
> - **主内存**：所有线程共享
> - **工作内存**：每个线程私有"

为了理解 Java 内存模型的作用，我们首先就来回顾一下从 Java 代码到最终执行的 CPU 指令的大致流程：

- 最开始，我们编写的 Java 代码，是 *.java 文件；
- 在编译（包含词法分析、语义分析等步骤）后，在刚才的 *.java 文件之外，会多出一个新的 Java 字节码文件（*.class）；
- JVM 会分析刚才生成的字节码文件（*.class），并根据平台等因素，把字节码文件转化为具体平台上的**机器指令；**
- 机器指令则可以直接在 CPU 上运行，也就是最终的程序执行。

所以程序最终执行的效果会依赖于具体的处理器，而不同的处理器的规则又不一样，不同的处理器之间可能差异很大，因此同样的一段代码，可能在处理器 A 上运行正常，而在处理器 B 上运行的结果却不一致。同理，在没有 JMM 之前，不同的 JVM 的实现，也会带来不一样的“翻译”结果。

所以 Java 非常需要一个标准，来让 Java 开发者、编译器工程师和 JVM 工程师能够达成一致。达成一致后，我们就可以很清楚的知道什么样的代码最终可以达到什么样的运行效果，让多线程运行结果可以预期，这个标准就是 JMM**，**这就是需要 JMM 的原因。

**Java 内存模型（Java Memory Model, JMM）** 是 Java 虚拟机规范中定义的一组规则，规定了 **多线程环境下如何访问共享变量**，以及 **线程之间如何通过内存进行通信**。

换句话说：JMM 决定了一个线程写入的变量值，**何时、对哪些线程可见**。



### 🎯 JMM三大特性

| **特性**   | **含义**           | **实现方式**           |
| ---------- | ------------------ | ---------------------- |
| **原子性** | 操作不可分割       | synchronized、Lock     |
| **可见性** | 修改对其他线程可见 | volatile、synchronized |
| **有序性** | 禁止指令重排序     | volatile、synchronized |



### 🎯 谈谈 Java 内存模型？

Java 虚拟机规范中试图定义一种「 **Java 内存模型**」来**屏蔽掉各种硬件和操作系统的内存访问差异**，以实现**让 Java 程序在各种平台下都能达到一致的内存访问效果**

**JMM组成**：

- 主内存：Java 内存模型规定了所有变量都存储在主内存中（此处的主内存与物理硬件的主内存 RAM 名字一样，两者可以互相类比，但此处仅是虚拟机内存的一部分）。

- 工作内存：每条线程都有自己的工作内存，线程的工作内存中保存了该线程使用到的主内存中的共享变量的副本拷贝。**线程对变量的所有操作都必须在工作内存进行，而不能直接读写主内存中的变量**。**工作内存是 JMM 的一个抽象概念，并不真实存在**。

> 线程之间不能直接访问对方的工作内存，只能通过 **主内存** 传递。

**特性**：

JMM 就是用来解决如上问题的。 **JMM是围绕着并发过程中如何处理可见性、原子性和有序性这 3 个 特征建立起来的**

- **可见性**：可见性是指当一个线程修改了共享变量的值，其他线程能够立即得知这个修改。

  - Java 中的 volatile、synchronzied、final 都可以实现可见性

- **原子性**：操作是否可以“一次完成，不可分割”。

  - `synchronized`、`Lock` 保证复合操作原子性；`AtomicInteger` 通过 CAS 保证。

- **有序性**：

  计算机在执行程序时，为了提高性能，编译器和处理器常常会对指令做重排，一般分为以下 3 种

  ```
  源代码 -> 编译器优化的重排 -> 指令并行的重排 -> 内存系统的重排 -> 最终执行指令
  ```

  单线程环境里确保程序最终执行结果和代码顺序执行的结果一致；

  处理器在进行重排序时必须要考虑指令之间的**数据依赖性**；

  多线程环境中线程交替执行，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致性是无法确定的，结果无法预测

  - `volatile` 禁止指令重排，`synchronized/Lock` 也能保证。

> JMM 是不区分 JVM 到底是运行在单核处理器、多核处理器的，Java 内存模型是对 CPU 内存模型的抽象，这是一个 High-Level 的概念，与具体的 CPU 平台没啥关系



### 🎯 Java 内存模型（JMM）的底层规则？

**1.工作内存与主内存的隔离**

- **主内存**：所有线程共享的公共内存，存储对象实例和类静态变量。
- **工作内存**：每个线程私有的内存，存储主内存变量的副本（线程对变量的操作必须在工作内存中进行）。
- **问题**：线程 A 修改工作内存中的变量后，若未同步到主内存，线程 B 的工作内存可能仍持有旧值，导致可见性问题。

**2. 变量操作的八大原子指令**

JMM 定义了以下操作（需成对出现），用于规范主内存与工作内存的交互：

| **指令** | **作用**                                                     |
| -------- | ------------------------------------------------------------ |
| `lock`   | 锁定主内存变量，标识为线程独占（一个变量同一时刻只能被一个线程 `lock`）。 |
| `unlock` | 解锁主内存变量，允许其他线程 `lock`。                        |
| `read`   | 从主内存读取变量值到工作内存。                               |
| `load`   | 将 `read` 读取的值存入工作内存的变量副本。                   |
| `use`    | 将工作内存的变量副本值传递给线程的计算引擎（用于运算）。     |
| `assign` | 将计算引擎的结果赋值给工作内存的变量副本。                   |
| `store`  | 将工作内存的变量副本值传递到主内存，准备写入。               |
| `write`  | 将 `store` 传递的值写入主内存的变量。                        |



### 🎯 Java 内存模型中的 happen-before 是什么？

> happen-before定义操作间的偏序关系：
>
> **核心规则**：
>
> - 程序次序规则：线程内按顺序执行
> - 锁定规则：unlock happen-before lock
> - volatile规则：写 happen-before 读
> - 传递性：A→B，B→C，则A→C"

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





## 八、并发容器（线程安全集合）📦 

### 🎯 Java 并发包提供了哪些并发工具类？

我们通常所说的并发包也就是 `java.util.concurrent` 及其子包，集中了 Java 并发的各种基础工具类，具体主要包括几个方面：

- 提供了比 synchronized 更加高级的各种同步结构，包括 CountDownLatch、CyclicBarrier、Semaphore 等，可以实现更加丰富的多线程操作，比如利用 Semaphore 作为资源控制器，限制同时进行工作的线程数量。
- 各种线程安全的容器，比如最常见的 ConcurrentHashMap、有序的 ConcunrrentSkipListMap，或者通过类似快照机制，实现线程安全的动态数组 CopyOnWriteArrayList 等。
- 各种并发队列实现，如各种 BlockedQueue 实现，比较典型的 ArrayBlockingQueue、 SynchorousQueue 或针对特定场景的 PriorityBlockingQueue 等。
- 强大的 Executor 框架，可以创建各种不同类型的线程池，调度任务运行等，绝大部分情况下，不再需要自己从头实现线程池和任务调度器。



### 🎯 ConcurrentHashMap？

ConcurrentHashMap 是 Java 中的一个**线程安全且高效的HashMap实现**。平时涉及高并发如果要用map结构，那第一时间想到的就是它。相对于hashmap来说，ConcurrentHashMap就是线程安全的map，其中利用了锁分段的思想提高了并发度。

那么它到底是如何实现线程安全的？

JDK 1.6版本关键要素：

- segment继承了ReentrantLock充当锁的角色，为每一个segment提供了线程安全的保障；
- segment维护了哈希散列表的若干个桶，每个桶由HashEntry构成的链表。

JDK1.8后，ConcurrentHashMap抛弃了原有的**Segment 分段锁，而采用了 CAS + synchronized 来保证并发安全性**。

##### ConcurrentHashMap 的并发度是什么？

ConcurrentHashMap 把实际 map 划分成若干部分来实现它的可扩展性和线程安全。这种划分是使用并发度获得的，它是 ConcurrentHashMap 类构造函数的一个可选参数，默认值为 16，这样在多线程情况下就能避免争用。

在 JDK8 后，它摒弃了 Segment（锁段）的概念，而是启用了一种全新的方式实现,利用 CAS 算法。同时加入了更多的辅助变量来提高并发度



### 🎯 Java 中的同步集合与并发集合有什么区别？

同步集合是通过**在集合的每个方法上使用同步锁（`synchronized`）**来确保线程安全的。Java 提供了一些同步集合类，例如：

- `Collections.synchronizedList(List list)`：返回一个线程安全的 `List` 实现。
- `Collections.synchronizedMap(Map map)`：返回一个线程安全的 `Map` 实现。

这些同步集合类通过对所有操作加锁，来保证只有一个线程能够在同一时刻访问或修改集合。

并发集合是 Java 5 引入的，它们是专门为高并发环境设计的，能够在多线程环境中提供更高效的操作。Java 提供了多个并发集合类：

- **`ConcurrentHashMap`**：线程安全的哈希表，提供高效的并发读写操作。
- **`CopyOnWriteArrayList`**：适用于读操作远远多于写操作的场景，它在修改时复制整个数组。
- **`ConcurrentLinkedQueue`**：高效的无界非阻塞并发队列。

这些并发集合通过更加细粒度的锁（如分段锁或无锁算法）实现线程安全，避免了同步集合中的全局锁定问题。



### 🎯 SynchronizedMap 和 ConcurrentHashMap 有什么区别？

SynchronizedMap 一次锁住整张表来保证线程安全，所以每次只能有一个线程来访为 map。

ConcurrentHashMap 使用分段锁来保证在多线程下的性能。

ConcurrentHashMap 中则是一次锁住一个桶。ConcurrentHashMap 默认将 hash 表分为 16 个桶，诸如 get，put，remove 等常用操作只锁当前需要用到的桶。

这样，原来只能一个线程进入，现在却能同时有 16 个写线程执行，并发性能的提升是显而易见的。

另外 ConcurrentHashMap 使用了一种不同的迭代方式。在这种迭代方式中，当 iterator 被创建后集合再发生改变就不再是抛出ConcurrentModificationException，取而代之的是在改变时 new 新的数据从而不影响原有的数据，iterator 完成后再将头指针替换为新的数据 ，这样 iterator线程可以使用原来老的数据，而写线程也可以并发的完成改变



### 🎯 CopyOnWriteArrayList 是什么，可以用于什么应用场景？有哪些优缺点？

CopyOnWriteArrayList 是一个并发容器。有很多人称它是线程安全的，我认为这句话不严谨，缺少一个前提条件，那就是非复合场景下操作它是线程安全的。

CopyOnWriteArrayList(免锁容器)的好处之一是当多个迭代器同时遍历和修改这个列表时，不会抛出 ConcurrentModificationException。在 CopyOnWriteArrayList 中，写入将导致创建整个底层数组的副本，而源数组将保留在原地，使得复制的数组在被修改时，读取操作可以安全地执行。

CopyOnWriteArrayList 的使用场景:

通过源码分析，我们看出它的优缺点比较明显，所以使用场景也就比较明显。就是合适读多写少的场景。

CopyOnWriteArrayList 的缺点：

1. 由于写操作的时候，需要拷贝数组，会消耗内存，如果原数组的内容比较多的情况下，可能导致 young gc 或者 full gc。
2. 不能用于实时读的场景，像拷贝数组、新增元素都需要时间，所以调用一个 set 操作后，读取到数据可能还是旧的，虽然CopyOnWriteArrayList 能做到最终一致性，但是还是没法满足实时性要求。
3. 由于实际使用中可能没法保证 CopyOnWriteArrayList 到底要放置多少数据，万一数据稍微有点多，每次 add/set 都要重新复制数组，这个代价实在太高昂了。在高性能的互联网应用中，这种操作分分钟引起故障。

CopyOnWriteArrayList 的设计思想：

1. 读写分离，读和写分开
2. 最终一致性
3. 使用另外开辟空间的思路，来解决并发冲突



### 🎯 并发包中的 ConcurrentLinkedQueue 和 LinkedBlockingQueue 有什么区别？

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



### 🎯 什么是阻塞队列？阻塞队列的实现原理是什么？如何使用阻塞队列来实现生产者-消费者模型？

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



### 🎯 如何设计一个阻塞队列，都需要考虑哪些点?

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



### 🎯 有哪些线程安全的非阻塞队列？

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



### 🎯 ThreadLocal 是什么？有哪些使用场景？

> 比如有两个人去宝屋收集宝物，这两个共用一个袋子的话肯定会产生争执，但是给他们两个人每个人分配一个袋子的话就不会出现这样的问题。如果把这两个人比作线程的话，那么ThreadLocal就是用来避免这两个线程竞争的。

ThreadLocal 是 Java 提供的一个线程局部变量工具类，它允许我们创建只能被同一个线程读写的变量。ThreadLocal 提供了线程安全的共享变量，每个线程都可以独立地改变自己的副本，而不会影响其他线程的副本。

原理： ThreadLocal 实际上是与线程绑定的一个映射，每个线程都拥有自己的 ThreadLocalMap，其中存储了以 ThreadLocal 对象为键、线程私有数据为值的键值对。

主要特点：

1. 线程隔离：每个线程都有自己的独立副本。
2. 数据隐藏：ThreadLocal 中的数据只能被特定线程访问。
3. 减少同步：由于变量是线程私有的，所以不需要额外的同步。

使用场景：

1. 线程安全的单例模式： 在多线程环境下，可以使用 ThreadLocal 来实现线程安全的单例模式，每个线程都持有对象的一个副本。
2. 存储用户身份信息： 在 Web 应用中，可以使用 ThreadLocal 来存储用户的登录信息或 Session 信息，使得这些信息在同一线程的不同方法中都可以访问，而不需要显式地传递参数。
3. 数据库连接管理： 在某些数据库连接池的实现中，可以使用 ThreadLocal 来存储当前线程持有的数据库连接，确保事务中使用的是同一个连接。
4. 解决线程安全问题： 在一些非线程安全的工具类中（如 SimpleDateFormat），可以使用 ThreadLocal 来为每个线程创建一个独立的实例，避免并发问题。
5. 跨函数传递数据： 当某些数据需要在同一线程的多个方法中传递，但又不适合作为方法参数时，可以考虑使用 ThreadLocal。
6. 全局存储线程内数据： 在一些复杂的系统中，可能需要在线程的整个生命周期内存储一些数据，ThreadLocal 提供了一种优雅的解决方案。
7. 性能优化： 在一些需要频繁创建和销毁对象的场景，可以使用 ThreadLocal 来重用这些对象，减少创建和销毁的开销。



### 🎯 ThreadLocal 是用来解决共享资源的多线程访问的问题吗？

不是，ThreadLocal 并不是用来解决共享资源的多线程访问问题的，而是用来解决线程间数据隔离的问题.

虽然 ThreadLocal 确实可以用于解决多线程情况下的线程安全问题，但其资源并不是共享的，而是每个线程独享的。

如果我们把放到 ThreadLocal 中的资源用 static 修饰，让它变成一个共享资源的话，那么即便使用了 ThreadLocal，同样也会有线程安全问题

### 🎯 ThreadLocal原理？

当使用 ThreadLocal 维护变量时，其为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立的改变自己的副本，而不会影响其他线程对应的副本。

ThreadLocal 内部实现机制：

- 每个线程内部都会维护一个类似 HashMap 的对象，称为 ThreadLocalMap，里边会包含若干了 Entry（K-V 键值对），相应的线程被称为这些 Entry 的属主线程；
- Entry 的 Key 是一个 ThreadLocal 实例，Value 是一个线程特有对象。Entry 的作用即是：为其属主线程建立起一个 ThreadLocal 实例与一个线程特有对象之间的对应关系；
- Entry 对 Key 的引用是弱引用；Entry 对 Value 的引用是强引用。

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



### 🎯 什么是线程局部变量？

线程局部变量是局限于线程内部的变量，属于线程自身所有，不在多个线程间共享。Java 提供 ThreadLocal 类来支持线程局部变量，是一种实现线程安全的方式。但是在管理环境下（如 web 服务器）使用线程局部变量的时候要特别小心，在这种情况下，工作线程的生命周期比任何应用变量的生命周期都要长。任何线程局部变量一旦在工作完成后没有释放，Java 应用就存在内存泄露的风险。



### 🎯 ThreadLocal 内存泄露问题?

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



### 🎯 ThreadLocalMap的enrty的key为什么要设置成弱引用

将Entry的Key设置成弱引用，在配合线程池使用的情况下可能会有内存泄露的风险。之设计成弱引用的目的是为了更好地对ThreadLocal进行回收，当我们在代码中将ThreadLocal的强引用置为null后，这时候Entry中的ThreadLocal理应被回收了，但是如果Entry的key被设置成强引用则该ThreadLocal就不能被回收，这就是将其设置成弱引用的目的。



**弱引用介绍：**

> 如果一个对象只具有弱引用，那就类似于**可有可无的生活用品**。弱引用与软引用的区别在于：只具有弱引用的对象拥有更短暂的生命周期。在垃圾回收器线程扫描它 所管辖的内存区域的过程中，一旦发现了只具有弱引用的对象，不管当前内存空间足够与否，都会回收它的内存。不过，由于垃圾回收器是一个优先级很低的线程， 因此不一定会很快发现那些只具有弱引用的对象。
>
> 弱引用可以和一个引用队列（ReferenceQueue）联合使用，如果弱引用所引用的对象被垃圾回收，Java虚拟机就会把这个弱引用加入到与之关联的引用队列中。



## 九、高级并发工具 🚀 

### 🎯 什么是 ForkJoinPool？它与传统的线程池有什么区别？

ForkJoinPool 是 Java 并行计算框架中的一部分，主要用于执行大规模并行任务。它基于分而治之（divide-and-conquer）策略，将大任务分解成若干小任务，并行执行后合并结果。与传统的线程池（如 `ThreadPoolExecutor`）不同，ForkJoinPool 设计为处理任务的递归分解和合并，具有更高的吞吐量和效率。

### 🎯 ForkJoinPool 的工作原理是什么？

ForkJoinPool 的核心工作原理是工作窃取（work-stealing）算法。每个工作线程都有一个双端队列（deque），线程从头部取任务执行。当某个线程完成了自己的任务队列后，它可以从其他线程的队列尾部窃取任务执行，从而保持高效的并行处理。

工作窃取算法可以最大限度地保持工作线程的忙碌，减少空闲线程的数量，提高 CPU 使用率。

### 🎯 如何使用 ForkJoinPool 来并行处理任务？

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

### 🎯 什么是 `fork()` 和 `join()` 方法？

- `fork()` 方法：将任务拆分并放入队列中，使其他工作线程可以从队列中窃取并执行。
- `join()` 方法：等待子任务完成并获取其结果。

在上述示例中，`leftTask.fork()` 将左半部分任务放入队列，而 `rightTask.compute()` 直接计算右半部分任务。随后，`leftTask.join()` 等待左半部分任务完成并获取结果。

### 🎯 解释一下 ForkJoinPool 的 `invoke()` 方法和 `submit()` 方法的区别。

- `invoke()` 方法：同步调用，提交任务并等待任务完成，返回任务结果。
- `submit()` 方法：异步调用，提交任务但不等待任务完成，返回一个 `ForkJoinTask` 对象，可以通过这个对象的 `get()` 方法获取任务结果。

### 🎯 在 ForkJoinPool 中，如何处理异常？

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

### 🎯 什么是 RecursiveTask 和 RecursiveAction？

- `RecursiveTask<V>`：用于有返回值的并行任务。必须实现 `compute()` 方法，并返回计算结果。
- `RecursiveAction`：用于没有返回值的并行任务。必须实现 `compute()` 方法，但不返回结果。

### 🎯 ForkJoinPool 的并行度（parallelism level）是什么？

ForkJoinPool 的并行度指的是可同时运行的工作线程数。可以在创建 ForkJoinPool 时指定并行度：

```java
ForkJoinPool pool = new ForkJoinPool(4); // 并行度为 4
```

并行度通常设置为 CPU 核心数，以充分利用多核处理器的计算能力。

### 🎯 ForkJoinPool 如何避免任务窃取导致的死锁？

ForkJoinPool 通过任务窃取和任务分解来避免死锁。工作线程在等待其他线程完成任务时，会主动窃取其他线程的任务以保持忙碌状态。此外，ForkJoinPool 使用工作窃取算法，尽可能将任务分散到各个线程的队列中，减少任务窃取导致的资源争用，从而降低死锁的可能性。



### 🎯 CompletableFuture

`CompletableFuture` 是 Java 8 引入的一种用于异步编程的类，它实现了 `Future` 和 `CompletionStage` 接口，提供了多种方法来进行异步计算、处理计算结果和错误处理。它不仅可以用来代表一个异步计算的结果，还可以通过多个方法组合多个异步操作，使得编写复杂的异步流变得更加简洁和易读。

1. **异步计算**：支持异步任务的执行，非阻塞地获取结果。
2. **任务组合**：提供了丰富的 API 来组合多个异步任务。
3. **结果处理**：可以在异步任务完成后处理结果。
4. **异常处理**：提供了多种方法来处理异步任务中的异常。
5. **手动完成**：可以手动完成（`complete`）异步任务。



## 十、并发应用实践

### 🎯 高并发网站架构设计

> "高并发网站需要从多个维度优化：
>
> **前端优化**：
>
> - HTML 静态化：减少动态内容生成
> - CDN 加速：就近访问，减少延迟
> - 图片服务分离：减轻 Web 服务器 I/O 负载
>
> **应用层优化**：
>
> - 负载均衡：分发请求到多台服务器
> - 连接池：复用数据库连接
> - 缓存机制：多级缓存减少数据库访问
>
> **数据层优化**：
>
> - 读写分离：主库写，从库读
> - 分库分表：水平拆分减少单表压力
> - 索引优化：提高查询效率"

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



### 🎯 订票系统，某车次只有一张火车票，假定有 **1w** 个人同 时打开 **12306** 网站来订票，如何解决并发问题?(可扩展 到任何高并发网站要考虑的并发读写问题)。

> "这是典型的高并发读写问题，既要保证 1w 人能同时看到有票（可读性），又要保证只有一个人能买到票（排他性）：
>
> **解决方案**：
>
> 1. **数据库乐观锁**：利用版本号或时间戳，避免锁表影响性能
> 2. **分布式锁**：Redis 实现，保证分布式环境下的原子性
> 3. **消息队列**：请求排队处理，削峰填谷
> 4. **库存预扣**：先扣库存再处理业务，避免超卖"

不但要保证 1w 个人能同时看到有票(数据的可读性)，还要保证最终只能 由一个人买到票(数据的排他性)。

使用数据库层面的并发访问控制机制。采用乐观锁即可解决此问题。乐观 锁意思是不锁定表的情况下，利用业务的控制来解决并发问题，这样既保证数 据的并发可读性，又保证保存数据的排他性，保证性能的同时解决了并发带来 的脏数据问题。hibernate 中实现乐观锁。

银行两操作员同时操作同一账户就是典型的例子。比如 A、B 操作员同 时读取一余额为 1000 元的账户，A 操作员为该账户增加 100 元，B 操作员同时 为该账户减去 50元，A先提交，B后提交。最后实际账户余额为1000-50=950 元，但本该为 1000+100-50=1050。这就是典型的并发问题。如何解决?可以用锁。



### 🎯 如果不用锁机制如何实现共享数据访问？

> 不要用锁，不要用 **sychronized** 块或者方法，也不要直接使用 **jdk** 提供的线程安全 的数据结构，需要自己实现一个类来保证多个线程同时读写这个类 中的共享数据是线程安全的，怎么办?

无锁化编程的常用方法:硬件**CPU**同步原语CAS(Compare and Swap)，如无锁栈，无锁队列(ConcurrentLinkedQueue)等等。现在 几乎所有的 CPU 指令都支持 CAS 的原子操作，X86 下对应的是 CMPXCHG 汇 编指令，处理器执行 CMPXCHG 指令是一个原子性操作。有了这个原子操作， 我们就可以用其来实现各种无锁(lock free)的数据结构。

CAS 实现了区别于 sychronized 同步锁的一种乐观锁，当多个线程尝试使 用 CAS 同时更新同一个变量时，只有其中一个线程能更新变量的值，而其它线 程都失败，失败的线程并不会被挂起，而是被告知这次竞争中失败，并可以再 次尝试。CAS 有 3 个操作数，内存值 V，旧的预期值 A，要修改后的新值 B。 当且仅当预期值 A 和内存值 V 相同时，将内存值 V 修改为 B，否则什么都不做。 其实 CAS 也算是有锁操作，只不过是由 CPU 来触发，比 synchronized 性能 好的多。CAS 的关键点在于，系统在硬件层面保证了比较并交换操作的原子性， 处理器使用基于对缓存加锁或总线加锁的方式来实现多处理器之间的原子操作。CAS 是非阻塞算法的一种常见实现。

一个线程间共享的变量，首先在主存中会保留一份，然后每个线程的工作 内存也会保留一份副本。这里说的预期值，就是线程保留的副本。当该线程从 主存中获取该变量的值后，主存中该变量可能已经被其他线程刷新了，但是该 线程工作内存中该变量却还是原来的值，这就是所谓的预期值了。当你要用 CAS 刷新该值的时候，如果发现线程工作内存和主存中不一致了，就会失败，如果 一致，就可以更新成功。

**Atomic** 包提供了一系列原子类。这些类可以保证多线程环境下，当某个 线程在执行atomic的方法时，不会被其他线程打断，而别的线程就像自旋锁一 样，一直等到该方法执行完成，才由 JVM 从等待队列中选择一个线程执行。 Atomic 类在软件层面上是非阻塞的，它的原子性其实是在硬件层面上借助相关 的指令来保证的。



### 🎯 如何在 Windows 和 Linux 上查找哪个线程 cpu 利用率最高？

windows上面用任务管理器看，linux下可以用 top 这个工具看。

1. 找出 cpu 耗用厉害的进程pid， 终端执行top命令，然后按下shift+p 查找出cpu利用最厉害的pid号
2. 根据上面第一步拿到的pid号，top -H -p pid 。然后按下shift+p，查找出cpu利用率最厉害的线程号，比如top -H -p 1328
3. 将获取到的线程号转换成16进制，去百度转换一下就行
4. 使用jstack工具将进程信息打印输出，jstack pid号 > /tmp/t.dat，比如jstack 31365 > /tmp/t.dat
5. 编辑/tmp/t.dat文件，查找线程号对应的信息



### 🎯 Java有哪几种实现生产者消费者模式的方法？

1. **使用`wait()`和`notify()`方法**：

   - 利用Java的同步机制，生产者在缓冲区满时调用`wait()`挂起，消费者在缓冲区空时调用`wait()`挂起。相应地，生产者在放入商品后调用`notifyAll()`唤醒消费者，消费者在取出商品后调用`notifyAll()`唤醒生产者。

2. **使用`ReentrantLock`和`Condition`**：

   - `ReentrantLock`提供了更灵活的锁机制，`Condition`可以用来替代`wait()`和`notify()`，提供更细粒度的控制。

3. **使用`BlockingQueue`**：

   - `java.util.concurrent.BlockingQueue`是一个线程安全的队列，其已经实现了生产者-消费者模式。当队列为满时，`put()`操作将阻塞；当队列为空时，`take()`操作将阻塞。

   

### 🎯 写出 **3** 条你遵循的多线程最佳实践

1. 给线程起个有意义的名字。

2. 避免锁定和缩小同步的范围 。

   相对于同步方法我更喜欢同步块，它给我拥有对锁的绝对控制权。 

3. 多用同步辅助类，少用 **wait** 和 **notify** 。
4. 多用并发容器，少用同步容器。
    如果下一次你需要用到 map，你应该首先想到用 ConcurrentHashMap。





## 并发编程最佳实践总结

### 🎯 设计原则

1. **安全性优先**：确保数据一致性，避免竞态条件
2. **性能兼顾**：在保证正确性前提下优化并发度
3. **可维护性**：代码清晰，便于理解和调试
4. **故障恢复**：考虑异常情况和系统故障

### 🎯 实践经验

1. **线程命名**：给线程起有意义的名字，便于问题排查
2. **锁粒度**：优先使用同步块而非同步方法，缩小锁范围
3. **工具选择**：多用并发容器，少用同步容器
4. **异常处理**：完善的异常处理和日志记录
5. **监控告警**：建立完整的监控体系

### 🎯 性能优化

1. **无锁化**：优先使用 CAS 和原子类
2. **读写分离**：读多写少场景使用 CopyOnWriteArrayList
3. **分段锁**：减少锁竞争，提高并发度
4. **异步处理**：使用线程池和消息队列
5. **缓存机制**：多级缓存减少 I/O 操作

**记住：并发编程的核心是在保证正确性的前提下，提高系统的并发处理能力！**



## 🔥 高频面试题快速回顾

### 💡 基础概念类

| **问题**   | **核心答案**             | **关键点**                              |
| ---------- | ------------------------ | --------------------------------------- |
| 进程vs线程 | 资源分配 vs 调度单位     | 内存隔离、通信方式、创建开销            |
| 并发vs并行 | 时间段内 vs 同一时刻     | 逻辑概念 vs 物理概念                    |
| 线程状态   | 6种状态及转换            | NEW→RUNNABLE→BLOCKED/WAITING→TERMINATED |
| 线程安全   | 多线程访问共享资源正确性 | 加锁、原子操作、不可变对象              |

### 🔒 同步机制类

| **问题**          | **核心答案**           | **关键点**                        |
| ----------------- | ---------------------- | --------------------------------- |
| synchronized原理  | Monitor机制，锁升级    | monitorenter/exit、偏向→轻量→重量 |
| volatile作用      | 可见性+有序性          | 内存屏障、禁止重排、不保证原子性  |
| ReentrantLock特性 | 显式锁，公平性，可中断 | vs synchronized对比表             |
| AQS框架           | 状态管理+队列+模板方法 | state、CLH队列、独占/共享模式     |

### 🛠️ 并发工具类

| **问题**       | **核心答案**       | **关键点**               |
| -------------- | ------------------ | ------------------------ |
| CountDownLatch | 倒计时门栓，一次性 | 主线程等待多个子线程完成 |
| CyclicBarrier  | 循环屏障，可重用   | 多线程相互等待，同步执行 |
| Semaphore      | 信号量，控制并发数 | 限流、资源池管理         |
| ThreadLocal    | 线程局部变量       | ThreadLocalMap、内存泄漏 |

### 🏊 线程池类

| **问题** | **核心答案**                        | **关键点**                 |
| -------- | ----------------------------------- | -------------------------- |
| 七大参数 | 核心、最大、存活时间等              | corePoolSize最重要         |
| 工作原理 | 核心→队列→非核心→拒绝               | 任务提交流程图             |
| 参数配置 | CPU密集型+1，IO密集型×(1+等待/处理) | 结合任务特性配置           |
| 拒绝策略 | 4种策略及适用场景                   | Abort、CallerRuns、Discard |

### ⚛️ 原子操作类

| **问题**      | **核心答案**         | **关键点**                 |
| ------------- | -------------------- | -------------------------- |
| CAS机制       | 比较并交换，硬件保证 | V、A、B三个操作数          |
| AtomicInteger | 基于CAS的无锁实现    | 自旋重试、性能优势         |
| ABA问题       | 值变化无法感知       | AtomicStampedReference解决 |
| LongAdder优势 | 分段累加减少竞争     | base+Cell[]、空间换时间    |

### 📦 并发容器类

| **问题**             | **核心答案**          | **关键点**              |
| -------------------- | --------------------- | ----------------------- |
| ConcurrentHashMap    | 1.7分段锁→1.8CAS+sync | Segment→Node数组+红黑树 |
| CopyOnWriteArrayList | 写时复制，读多写少    | 读无锁、写复制数组      |
| 同步vs并发容器       | 全局锁 vs 细粒度锁    | fail-fast vs 弱一致性   |
| BlockingQueue        | 阻塞队列，生产消费    | put/take自动阻塞        |

### 🧠 JMM类

| **问题**      | **核心答案**           | **关键点**                   |
| ------------- | ---------------------- | ---------------------------- |
| JMM作用       | 跨平台内存一致性       | 主内存+工作内存模型          |
| 三大特性      | 原子性、可见性、有序性 | 各自实现方式                 |
| happen-before | 操作间偏序关系         | 程序次序、锁定、volatile规则 |
| 内存屏障      | 禁止指令重排           | LoadLoad、StoreStore等       |

---

## 🎯 面试突击技巧

### 📝 万能回答框架

1. **背景阐述** (10秒)：简述问题背景和重要性
2. **核心原理** (30秒)：讲清楚底层实现机制  
3. **关键特点** (20秒)：对比优缺点和适用场景
4. **实践经验** (20秒)：结合项目经验或最佳实践

### 🔥 加分回答技巧

- **源码引用**：适当提及关键源码实现
- **性能数据**：给出具体的性能对比数据
- **实战经验**：结合实际项目中的使用经验
- **问题延伸**：主动提及相关的深层问题

### ⚠️ 常见面试陷阱

- **概念混淆**：synchronized vs ReentrantLock选择
- **性能误区**：盲目认为无锁一定比有锁快
- **使用错误**：volatile不能保证原子性
- **内存泄漏**：ThreadLocal使用后不清理

记住这个口诀：**理论扎实、实践丰富、思路清晰、表达准确**！

---

> 💡 **最终提醒**：
>
> 1. **循序渐进**：从基础概念到高级应用
> 2. **结合实践**：每个知识点都举具体使用场景  
> 3. **源码分析**：适当提及关键源码实现
> 4. **性能对比**：说明不同方案的优缺点
> 5. **问题解决**：展示解决并发问题的思路

**并发编程面试，重在理解原理，贵在实战经验！** 🚀