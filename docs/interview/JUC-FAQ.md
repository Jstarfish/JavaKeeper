JUC 面试题总共围绕的就这么几部分

- 多线程的一些概念（进程、线程、并行、并发啥的，谈谈你对高并发的认识）
- 同步机制（locks、synchronzied、atomic）
- 并发容器类
  - ConcurrentHashMap、CopyOnWriteArrayList、CopyOnWriteArraySet
  - 阻塞队列（顺着就会问到线程池）
- 线程池（Executor、Callable 、Future、ExecutorService等等，底层原理）
- AQS
  - AQS 原理
  - 工具类：CountDownLatch、ReentrantLock、Semaphore、Exchanger
- atomic 类（atomic常用类，方法，到 CAS，或者 ABA问题）
- Fork/Join并行计算框架

![img](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200927155707.png)



## 一、多线程开篇

### 进程和线程

进程是程序的一次执行过程，是系统运行程序的基本单位，因此进程是动态的。系统运行一个程序即是一个进程从创建，运行到消亡的过程。

线程是操作系统能够进行运算调度的最小单位，它被包含在进程之中，是进程中的实际运作单位。

在 Java 中，当我们启动 main 函数时其实就是启动了一个 JVM 的进程，而 main 函数所在的线程就是这个进程中的一个线程，也称主线程。

线程是进程的子集，一个进程可以有很多线程，每条线程并行执行不同的任务。不同的进程使用不同的内存空间，而所有的线程共享一片相同的内存空间。



### 说说并发与并行的区别?

- **并发：** 同一时间段，多个任务都在执行 (单位时间内不一定同时执行)；
- **并行：** 单位时间内，多个任务同时执行。



### 什么是线程安全和线程不安全？

通俗的说：加锁的就是是线程安全的，不加锁的就是是线程不安全的

**线程安全: 就是多线程访问时，采用了加锁机制，当一个线程访问该类的某个数据时，进行保护，其他线程不能进行访问，直到该线程读取完，其他线程才可使用。不会出现数据不一致或者数据污染**。

一个线程安全的计数器类的同一个实例对象在被多个线程使用的情况下也不会出现计算失误。很显然你可以将**集合类分成两组，线程安全和非线程安全的**。 Vector 是用同步方法来实现线程安全的, 而和它相似的 ArrayList 不是线程安全的。

**线程不安全：就是不提供数据访问保护，有可能出现多个线程先后更改数据造成所得到的数据是脏数据**

如果你的代码所在的进程中有多个线程在同时运行，而这些线程可能会同时运行这段代码。如果每次运行结果和单线程运行的结果是一样的，而且其他的变量的值也和预期的是一样的，就是线程安全的。

线程安全问题都是由全局变量及静态变量引起的。 若每个线程中对全局变量、静态变量只有读操作，而无写操作，一般来说，这个全局变量是线程安全的；若有多个线程同时执行写操作，一般都需要考虑线程同步，否则的话就可能影响线程安全。



### 什么是上下文切换?

多线程编程中一般线程的个数都大于 CPU 核心的个数，而一个 CPU 核心在任意时刻只能被一个线程使用，为了让这些线程都能得到有效执行，CPU 采取的策略是为每个线程分配时间片并轮转的形式。当一个线程的时间片用完的时候就会重新处于就绪状态让给其他线程使用，这个过程就属于一次上下文切换。

概括来说就是：当前任务在执行完 CPU 时间片切换到另一个任务之前会先保存自己的状态，以便下次再切换回这个任务时，可以再加载这个任务的状态。**任务从保存到再加载的过程就是一次上下文切换**。

上下文切换通常是计算密集型的。也就是说，它需要相当可观的处理器时间，在每秒几十上百次的切换中，每次切换都需要纳秒量级的时间。所以，上下文切换对系统来说意味着消耗大量的 CPU 时间，事实上，可能是操作系统中时间消耗最大的操作。

Linux 相比与其他操作系统（包括其他类 Unix 系统）有很多的优点，其中有一项就是，其上下文切换和模式切换的时间消耗非常少。



### 如何在 Windows 和 Linux 上查找哪个线程 cpu 利用率最高？

windows上面用任务管理器看，linux下可以用 top 这个工具看。

1. 找出cpu耗用厉害的进程pid， 终端执行top命令，然后按下shift+p 查找出cpu利用最厉害的pid号
2. 根据上面第一步拿到的pid号，top -H -p pid 。然后按下shift+p，查找出cpu利用率最厉害的线程号，比如top -H -p 1328
3. 将获取到的线程号转换成16进制，去百度转换一下就行
4. 使用jstack工具将进程信息打印输出，jstack pid号 > /tmp/t.dat，比如jstack 31365 > /tmp/t.dat
5. 编辑/tmp/t.dat文件，查找线程号对应的信息



### 说说线程的生命周期和状态?

Java 线程在运行的生命周期中的指定时刻只可能处于下面 6 种不同状态的其中一个状态（图源《Java 并发编程艺术》4.1.4 节）。

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/19-1-29/Java%E7%BA%BF%E7%A8%8B%E7%9A%84%E7%8A%B6%E6%80%81.png)

线程在生命周期中并不是固定处于某一个状态而是随着代码的执行在不同状态之间切换。Java 线程状态变迁如下图所示（图源《Java 并发编程艺术》4.1.4 节）：

![](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/19-1-29/Java+%E7%BA%BF%E7%A8%8B%E7%8A%B6%E6%80%81%E5%8F%98%E8%BF%81.png)

由上图可以看出：线程创建之后它将处于 **NEW（新建）** 状态，调用 `start()` 方法后开始运行，线程这时候处于 **READY（可运行）** 状态。可运行状态的线程获得了 CPU 时间片（timeslice）后就处于 **RUNNING（运行）** 状态。



### 说说 sleep() 方法和 wait() 方法区别和共同点?

- 两者最主要的区别在于：**sleep 方法没有释放锁，而 wait 方法释放了锁** 。
- 两者都可以暂停线程的执行。
- wait 通常被用于线程间交互/通信，sleep 通常被用于暂停执行。
- wait() 方法被调用后，线程不会自动苏醒，需要别的线程调用同一个对象上的 notify() 或者 notifyAll() 方法。sleep() 方法执行完成后，线程会自动苏醒。或者可以使用 wait(long timeout)超时后线程会自动苏醒。

**yield()**
yield() 方法和 sleep() 方法类似，也不会释放“锁标志”，区别在于，它没有参数，即 yield() 方法只是使当前线程重新回到可执行状态，所以执行 yield() 的线程有可能在进入到可执行状态后马上又被执行，另外 yield() 方法只能使同优先级或者高优先级的线程得到执行机会，这也和 sleep() 方法不同。

**join()**
join() 方法会使当前线程等待调用 join() 方法的线程结束后才能继续执行



### 为什么我们调用 start() 方法时会执行 run() 方法，为什么我们不能直接调用 run() 方法？

这是另一个非常经典的 java 多线程面试问题，而且在面试中会经常被问到。很简单，但是很多人都会答不上来！

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



### Java 多线程之间的通信方式

**①同步** 这里讲的同步是指多个线程通过synchronized关键字这种方式来实现线程间的通信。

**②while轮询的方式**

**③wait/notify机制**

**④管道通信**就是使用java.io.PipedInputStream 和 java.io.PipedOutputStream进行通信

https://www.cnblogs.com/hapjin/p/5492619.html

------



## 二、同步机制篇

### Java同步机制有哪些

1. synchronized 关键字，这个相信大家很了解，最好能理解其中的原理

2. Lock 接口及其实现类，如 ReentrantLock.ReadLock 和 ReentrantReadWriteLock.WriteLock

   以上两种都是最基本的，也是大家在实际项目中最常用的，一般用 lock 的比较多，能提高效率，典型的对比如 Hashtable 和 CurrentHashMap 的性能对比;

那还有那些更高级的同步机制：

3. 信号量（Semaphore）：是一种计数器，用来保护一个或者多个共享资源的访问，它是并发编程的一种基础工具，大多数编程语言都提供这个机制，这也是操作系统中经常提到的
4. CountDownLatch：是 Java 语言提供的同步辅助类，在完成一组正在其他线程中执行的操作之前，他允许线程一直等待
5. CyclicBarrier：也是 java 语言提供的同步辅助类，他允许多个线程在某一个集合点处进行相互等待；
6. Phaser：也是 java 语言提供的同步辅助类，他把并发任务分成多个阶段运行，在开始下一阶段之前，当前阶段中所有的线程都必须执行完成，JAVA7 才有的特性。
7. Exchanger：他提供了两个线程之间的数据交换点。



### synchronized关键字

> synchoronized的底层是怎么实现的？
>
> synchronized 使用的几种方式和区别？
>
> synchronized说一下，有哪些实用形式？对类加锁时调用方法一定会加锁吗？

synrhronized 关键字简洁、清晰、语义明确，因此即使有了 Lock 接口，使用的还是非常广泛。其应用层的语义是可以把任何一个非null对象作为"锁"，

- 当 synchronized 作用在方法上时，锁住的便是对象实例（this）；
- 当作用在静态方法时锁住的便是对象对应的 Class 实例，因为 Class数据存在于永久代，因此静态方法锁相当于该类的一个全局锁；
- 当synchronized作用于某一个对象实例时，锁住的便是对应的代码块。

在 HotSpot JVM实现中，锁有个专门的名字：**对象监视器**。 

在 JVM 中，对象在内存中的布局分为三块区域：**对象头、实例数据和对齐填充**

synchronized 用的锁是存在 Java 对象头里的。

底层实现：

1. 进入时，执行 monitorenter，将计数器 +1，释放锁 monitorexit 时，计数器-1；
2. 当一个线程判断到计数器为 0 时，则当前锁空闲，可以占用；反之，当前线程进入等待状态。

当执行 monitorenter 指令时，线程试图获取锁也就是获取 monitor(monitor对象存在于每个Java对象的对象头中，synchronized 锁便是通过这种方式获取锁的，也是为什么Java中任意对象可以作为锁的原因) 的持有权。当计数器为0则可以成功获取，获取后将锁计数器设为1也就是加1。相应的在执行 monitorexit 指令后，将锁计数器设为0，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。

含义：（monitor 机制）

Synchronized 是在加锁，加对象锁。对象锁是一种重量锁（monitor），synchronized 的锁机制会根据线程竞争情况在运行时会有偏向锁（单一线程）、轻量锁（多个线程访问 synchronized 区域）、对象锁（重量锁，多个线程存在竞争的情况）、自旋锁等。

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

[![](https://camo.githubusercontent.com/78771c0f89d7076e8f70ca5c9fab40ed03f44f6b/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f73796e6368726f6e697a65642545352538352542332545392539342541452545352541442539372545352538452539462545372539302538362e706e67)](https://camo.githubusercontent.com/78771c0f89d7076e8f70ca5c9fab40ed03f44f6b/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f73796e6368726f6e697a65642545352538352542332545392539342541452545352541442539372545352538452539462545372539302538362e706e67)

从上面我们可以看出：

**synchronized 同步语句块的实现使用的是 monitorenter 和 monitorexit 指令，其中 monitorenter 指令指向同步代码块的开始位置，monitorexit 指令则指明同步代码块的结束位置。** 当执行 monitorenter 指令时，线程试图获取锁也就是获取 monitor(monitor对象存在于每个 Java 对象的对象头中，synchronized 锁便是通过这种方式获取锁的，也是为什么 Java 中任意对象可以作为锁的原因) 的持有权。当计数器为0则可以成功获取，获取后将锁计数器设为1也就是加1。相应的在执行 monitorexit 指令后，将锁计数器设为0，表明锁被释放。如果获取对象锁失败，那当前线程就要阻塞等待，直到锁被另外一个线程释放为止。

**② synchronized 修饰方法的的情况**

```java
public class SynchronizedDemo2 {
	public synchronized void method() {
		System.out.println("synchronized 方法");
	}
}
```

[![synchronized关键字原理](https://camo.githubusercontent.com/269441dd7da0840bc071cf70fa8162f58482a559/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f73796e6368726f6e697a6564254535253835254233254539253934254145254535254144253937254535253845253946254537253930253836322e706e67)](https://camo.githubusercontent.com/269441dd7da0840bc071cf70fa8162f58482a559/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f73796e6368726f6e697a6564254535253835254233254539253934254145254535254144253937254535253845253946254537253930253836322e706e67)

synchronized 修饰的方法并没有 monitorenter 指令和 monitorexit 指令，取得代之的确实是 ACC_SYNCHRONIZED 标识，该标识指明了该方法是一个同步方法，JVM 通过该 ACC_SYNCHRONIZED 访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用。





### Lock

> 什么是线程死锁? 如何避免死锁?

#### 认识线程死锁

线程死锁描述的是这样一种情况：多个线程同时被阻塞，它们中的一个或者全部都在等待某个资源被释放。由于线程被无限期地阻塞，因此程序不可能正常终止。

如下图所示，线程 A 持有资源 2，线程 B 持有资源 1，他们同时都想申请对方的资源，所以这两个线程就会互相等待而进入死锁状态。

![img](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-4/2019-4%E6%AD%BB%E9%94%811.png)

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

#### 如何避免线程死锁?

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

线程 1 首先获得到 resource1 的监视器锁,这时候线程 2 就获取不到了。然后线程 1 再去获取 resource2 的监视器锁，可以获取到。然后线程 1 释放了对 resource1、resource2 的监视器锁的占用，线程 2 获取到就可以执行了。这样就破坏了破坏循环等待条件，因此避免了死锁。



### 如何排查死锁

通过jdk工具jps、jstack排查死锁问题



### 死锁预防

1、以确定的顺序获得锁

如果必须获取多个锁，那么在设计的时候需要充分考虑不同线程之前获得锁的顺序

2、超时放弃

当使用synchronized关键词提供的内置锁时，只要线程没有获得锁，那么就会永远等待下去，然而Lock接口提供了`boolean tryLock(long time, TimeUnit unit) throws InterruptedException`方法，该方法可以按照固定时长等待锁，因此线程可以在获取锁超时以后，主动释放之前已经获得的所有的锁。通过这种方式，也可以很有效地避免死锁。



### ReentrantLock (可重入锁) 

> 何为可重入

可重入的意思是某一个线程是否可多次获得一个锁，**在继承的情况下，如果不是可重入的，那就形成死锁了,比如递归调用自己的时候;**，如果不能可重入，每次都获取锁不合适，比如synchronized就是可重入的，ReentrantLock也是可重入的

可重入锁，也叫做递归锁，指的是同一线程外层函数获得锁之后 ，内层递归函数仍然有获取该锁的代码，但不受影响。

当某个线程A已经持有了一个锁,当线程B尝试进入被这个锁保护的代码段的时候.就会被阻塞.而锁的操作粒度是”线程”,而不是调用.同一个线程再次进入同步代码的时候.可以使用自己已经获取到的锁,这就是可重入锁

> 为什么要可重入

如果线程A继续再次获得这个锁呢?比如一个方法是synchronized,递归调用自己,那么第一次已经获得了锁,第二次调用的时候还能进入吗? 直观上当然需要能进入.这就要求必须是可重入的.可重入锁又叫做递归锁,不然就死锁了。 

 它实现方式是：

为每个锁关联一个获取计数器和一个所有者线程,当计数值为0的时候,这个锁就没有被任何线程持有.当线程请求一个未被持有的锁时,JVM将记下锁的持有者,并且将获取计数值置为1,如果同一个线程再次获取这个锁,技术值将递增,退出一次同步代码块,计算值递减,当计数值为0时,这个锁就被释放.ReentrantLock里面有实现



**`ReentrantLock` 类是唯一实现了`Lock的类`** ，它拥有与`synchronized` 相同的并发性和内存语义，但是添加了类似**锁投票**、**定时锁等候**和**可中断锁等候**的一些特性。此外，它还提供了在激烈争用情况下**更佳的性能**。（换句话说，当许多线程都想访问共享资源时，JVM 可以花更少的时候来调度线程，把更多时间用在执行线程上。）  

用sychronized修饰的方法或者语句块在代码执行完之后锁自动释放，而是用Lock需要我们**手动释放锁**，所以为了保证锁最终被释放(发生异常情况)，要把互斥区放在try内，释放锁放在finally内！！  





### volatile关键字

> 谈谈你对 volatile 的理解？
>
> 你知道 volatile 底层的实现机制吗？
>
> volatile 变量和 atomic 变量有什么不同？
>
> volatile 的使用场景，你能举两个例子吗？
>
> volatile 能使得一个非原子操作变成原子操作吗？

**理解**：

volatile 是 Java 虚拟机提供的轻量级的同步机制，保证了 Java 内存模型的两个特性，可见性、有序性（禁止指令重排）、不能保证原子性。



**场景**：

DCL 版本的单例模式就用到了volatile，因为 DCL 也不一定是线程安全的，`instance = new Singleton();`并不是一个原子操作，会分为 3 部分执行，

1. 给 instance 分配内存
2. 调用 instance 的构造函数来初始化对象
3. 将 instance 对象指向分配的内存空间（执行完这步 instance 就为非 null 了）

步骤 2 和 3 不存在数据依赖关系，如果虚拟机存在指令重排序优化，则步骤 2和 3 的顺序是无法确定的

一句话：在需要保证原子性的场景，不要使用 volatile。



**原理**：

volatile 可以保证线程可见性且提供了一定的有序性，但是无法保证原子性。在 JVM 底层是基于内存屏障实现的。

- 当对非 volatile 变量进行读写的时候，每个线程先从内存拷贝变量到 CPU 缓存中。如果计算机有多个CPU，每个线程可能在不同的 CPU 上被处理，这意味着每个线程可以拷贝到不同的 CPU cache 中
- 而声明变量是 volatile 的，JVM 保证了每次读变量都从内存中读，跳过 CPU cache 这一步，所以就不会有可见性问题
  - 对 volatile 变量进行写操作时，会在写操作后加一条 store 屏障指令，将工作内存中的共享变量刷新回主内存；
  - 对 volatile 变量进行读操作时，会在写操作后加一条 load 屏障指令，从主内存中读取共享变量；

**性能**：

volatile 的读性能消耗与普通变量几乎相同，但是写操作稍慢，因为它需要在本地代码中插入许多内存屏障指令来保证处理器不发生乱序执行。



### synchronized 和 Lock 区别

1、原始构成

- synchronized 是关键字属于JVM 层面
  - monitorenter(底层是通过monitor对象完成，其实 wait/notify等方法也依赖于monitor对象只有在同步代码块或方法中才能调wait/notify等方法)
  - Lock是具体类（java.util.concurrent.locks.Lock）是api 层面的锁

2、使用方法

synchronized 不需要用户手动释放锁，当 synchronized 代码执行完后系统会自动让线程释放对象锁的占用

RenntrantLock则需要用户去手动释放锁，若没有手动释放，可能造成死锁

3、等待是否可中断

synchronized 不可中断，除非抛出异常或正常运行结束

RenntrantLock可中断，

- 设置超时时间 tryLock(long timeout,TimeUnit unit)
- lockIntteruptiby() 放代码块中，调用interrupt() 方法可中断

4、加锁是否公平

synchronized 是非公平锁

RenntrantLock两者都可以，默认是非公平锁

5、锁绑定多个条件Condition

synchronized 没有

RenntrantLock用来实现分组唤醒需要唤醒的线程们，可以精准唤醒，而不是像synchronized那样随机唤醒一个线程要么唤醒全部线程。



### 说说 synchronized 关键字和 volatile 关键字的区别

`synchronized` 关键字和 `volatile` 关键字是两个互补的存在，而不是对立的存在：

- **volatile关键字**是线程同步的**轻量级实现**，所以**volatile性能肯定比synchronized关键字要好**。但是**volatile关键字只能用于变量而synchronized关键字可以修饰方法以及代码块**。synchronized关键字在JavaSE1.6之后进行了主要包括为了减少获得锁和释放锁带来的性能消耗而引入的偏向锁和轻量级锁以及其它各种优化之后执行效率有了显著提升，**实际开发中使用 synchronized 关键字的场景还是更多一些**。
- **多线程访问volatile关键字不会发生阻塞，而synchronized关键字可能会发生阻塞**
- **volatile关键字能保证数据的可见性，但不能保证数据的原子性。synchronized关键字两者都能保证。**
- **volatile关键字主要用于解决变量在多个线程之间的可见性，而 synchronized关键字解决的是多个线程之间访问资源的同步性。**



### 谈谈 synchronized和ReentrantLock 的区别

![](https://p0.meituan.net/travelcube/412d294ff5535bbcddc0d979b2a339e6102264.png)

**① 两者都是可重入锁**

两者都是可重入锁。“可重入锁”概念是：自己可以再次获取自己的内部锁。比如一个线程获得了某个对象的锁，此时这个对象锁还没有释放，当其再次想要获取这个对象的锁的时候还是可以获取的，如果不可锁重入的话，就会造成死锁。同一个线程每次获取锁，锁的计数器都自增1，所以要等到锁的计数器下降为0时才能释放锁。

**② synchronized 依赖于 JVM 而 ReentrantLock 依赖于 API**

synchronized 是依赖于 JVM 实现的，前面我们也讲到了 虚拟机团队在 JDK1.6 为 synchronized 关键字进行了很多优化，但是这些优化都是在虚拟机层面实现的，并没有直接暴露给我们。ReentrantLock 是 JDK 层面实现的（也就是 API 层面，需要 lock() 和 unlock() 方法配合 try/finally 语句块来完成），所以我们可以通过查看它的源代码，来看它是如何实现的。

**③ ReentrantLock 比 synchronized 增加了一些高级功能**

相比synchronized，ReentrantLock增加了一些高级功能。主要来说主要有三点：**①等待可中断；②可实现公平锁；③可实现选择性通知（锁可以绑定多个条件）**

- **ReentrantLock提供了一种能够中断等待锁的线程的机制**，通过lock.lockInterruptibly()来实现这个机制。也就是说正在等待的线程可以选择放弃等待，改为处理其他事情。
- **ReentrantLock可以指定是公平锁还是非公平锁。而synchronized只能是非公平锁。所谓的公平锁就是先等待的线程先获得锁。** ReentrantLock默认情况是非公平的，可以通过 ReentrantLock类的`ReentrantLock(boolean fair)`构造方法来制定是否是公平的。
- synchronized关键字与wait()和notify()/notifyAll()方法相结合可以实现等待/通知机制，ReentrantLock类当然也可以实现，但是需要借助于Condition接口与newCondition() 方法。Condition是JDK1.5之后才有的，它具有很好的灵活性，比如可以实现多路通知功能也就是在一个Lock对象中可以创建多个Condition实例（即对象监视器），**线程对象可以注册在指定的Condition中，从而可以有选择性的进行线程通知，在调度线程上更加灵活。 在使用notify()/notifyAll()方法进行通知时，被通知的线程是由 JVM 选择的，用ReentrantLock类结合Condition实例可以实现“选择性通知”** ，这个功能非常重要，而且是Condition接口默认提供的。而synchronized关键字就相当于整个Lock对象中只有一个Condition实例，所有的线程都注册在它一个身上。如果执行notifyAll()方法的话就会通知所有处于等待状态的线程这样会造成很大的效率问题，而Condition实例的signalAll()方法 只会唤醒注册在该Condition实例中的所有等待线程。

如果你想使用上述功能，那么选择ReentrantLock是一个不错的选择。

**④ 性能已不是选择标准**



------



## 三、JMM篇

> 谈谈 Java 内存模型
>
> 指令重排
>
> 内存屏障
>
> 单核CPU有可见性问题吗

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

  ![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgrycnj0j31bs04k74y.jpg)

  单线程环境里确保程序最终执行结果和代码顺序执行的结果一致；

  处理器在进行重排序时必须要考虑指令之间的**数据依赖性**；

  多线程环境中线程交替执行，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致性是无法确定的，结果无法预测



JMM是不区分JVM到底是运行在单核处理器、多核处理器的，Java内存模型是对CPU内存模型的抽象，这是一个High-Level的概念，与具体的CPU平台没啥关系



happens-before 先行发生，是 Java 内存模型中定义的两项操作之间的偏序关系，**如果操作A 先行发生于操作B，那么A的结果对B可见**。

内存屏障是被插入两个 CPU 指令之间的一种指令，用来禁止处理器指令发生重排序（像屏障一样），从而保障**有序性**的。





------





## 四、Atomic~CAS篇

> CAS 知道吗，如何实现？
> 讲一讲AtomicInteger，为什么要用 CAS 而不是 synchronized？
> CAS 底层原理，谈谈你对 UnSafe 的理解？
> AtomicInteger 的ABA问题，能说一下吗，原子更新引用知道吗？
> CAS 有什么缺点吗？ 如何规避 ABA 问题？

Java 虚拟机又提供了一个轻量级的同步机制——volatile，但是 volatile 算是乞丐版的 synchronized，并不能保证原子性 ，所以，又增加了`java.util.concurrent.atomic`包， 这个包下提供了一系列原子类。



**Atomic**：

AtomicBoolean、AtomicInteger、tomicIntegerArray、AtomicReference、AtomicStampedReference

常用方法：

addAndGet(int)、getAndIncrement()、compareAndSet(int, int)

**CAS**:

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



**Unsafe**：

CAS 并发原语体现在 Java 语言中的 `sum.misc.Unsafe` 类中的各个方法。调用 Unsafe 类中的 CAS 方法， JVM 会帮助我们实现出 CAS 汇编指令。

是 CAS 的核心类，由于 Java 方法无法直接访问底层系统，需要通过本地（native）方法来访问，UnSafe 相当于一个后门，UnSafe 类中的所有方法都是 native 修饰的，也就是说该类中的方法都是直接调用操作系统底层资源执行相应任务。 



## 五、线程池篇

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



常见的线程池的使用方式：

- newFixedThreadPool   创建一个指定工作线程数量的线程池
- newSingleThreadExecutor   创建一个单线程化的Executor
- newCachedThreadPool  创建一个可缓存线程池
- newScheduledThreadPool   创建一个定长的线程池，而且支持定时的以及周期性的任务执行，支持定时及周期性任务执行
- newWorkStealingPool  Java8 新特性，使用目前机器上可用的处理器作为它的并行级别



线程池的几个重要参数：

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



工作原理：

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



合理配置线程池（创建多少个线程合适）：

- CPU 密集型

  CPU 密集的意思是该任务需要大量的运算，而没有阻塞，CPU 一直全速运行

  CPU 密集任务只有在真正的多核 CPU 上才可能得到加速（通过多线程）

  而在单核 CPU 上，无论开几个模拟的多线程该任务都不可能得到加速，因为 CPU 总的运算能力就那些。

  CPU 密集型任务配置尽可能少的线程数量：

  一般公式：CPU 合数 + 1 个线程的线程池

- IO 密集型

  - IO密集型任务线程并不是一直在执行任务，则应配置尽可能多的线程，如 CPU 核心数*2

  - IO 密集型，即该任务需要大量的 IO，即大量的阻塞

    在单线程上运行 IO 密集型的任务会导致浪费大量的 CPU 运算能力浪费在等待。

    所以在 IO 密集型任务中使用多线程可以大大的加速程序运行，即使在单核 CPU 上，这种加速主要就是利用了被浪费调的阻塞时间。所以在 IO 密集型任务中使用多线程可以大大的加速程序运行，即使在单核 CPU 上，这种加速主要就是利用了被浪费掉的阻塞时间。

### 为什么要用线程池？

> **池化技术相比大家已经屡见不鲜了，线程池、数据库连接池、Http 连接池等等都是对这个思想的应用。池化技术的思想主要是为了减少每次获取资源的消耗，提高对资源的利用率。**

**线程池**提供了一种限制和管理资源（包括执行一个任务）。 每个**线程池**还维护一些基本统计信息，例如已完成任务的数量。

这里借用《Java 并发编程的艺术》提到的来说一下**使用线程池的好处**：

- **降低资源消耗**。通过重复利用已创建的线程降低线程创建和销毁造成的消耗。
- **提高响应速度**。当任务到达时，任务可以不需要的等到线程创建就能立即执行。
- **提高线程的可管理性**。线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。



### 实现Runnable接口和Callable接口的区别

`Runnable`自Java 1.0以来一直存在，但`Callable`仅在Java 1.5中引入,目的就是为了来处理`Runnable`不支持的用例。**Runnable 接口**不会返回结果或抛出检查异常，但是**`Callable` 接口**可以。所以，如果任务不需要返回结果或抛出异常推荐使用 **Runnable 接口**，这样代码看起来会更加简洁。

工具类 `Executors` 可以实现 `Runnable` 对象和 `Callable` 对象之间的相互转换。（`Executors.callable（Runnable task`）或 `Executors.callable（Runnable task，Object resule）`）。

```
Runnable.java
@FunctionalInterface
public interface Runnable {
   /**
    * 被线程执行，没有返回值也无法抛出异常
    */
    public abstract void run();
}
Callable.java
@FunctionalInterface
public interface Callable<V> {
    /**
     * 计算结果，或在无法这样做时抛出异常。
     * @return 计算得出的结果
     * @throws 如果无法计算结果，则抛出异常
     */
    V call() throws Exception;
}
```

### 执行execute()方法和submit()方法的区别是什么呢？

1. **execute()方法用于提交不需要返回值的任务，所以无法判断任务是否被线程池执行成功与否；**
2. **submit()方法用于提交需要返回值的任务。线程池会返回一个 Future 类型的对象，通过这个 Future 对象可以判断任务是否执行成功**，并且可以通过 `Future` 的 `get()`方法来获取返回值，`get()`方法会阻塞当前线程直到任务完成，而使用 `get（long timeout，TimeUnit unit）`方法则会阻塞当前线程一段时间后立即返回，这时候有可能任务没有执行完。

我们以**`AbstractExecutorService`**接口中的一个 `submit` 方法为例子来看看源代码：

```
    public Future<?> submit(Runnable task) {
        if (task == null) throw new NullPointerException();
        RunnableFuture<Void> ftask = newTaskFor(task, null);
        execute(ftask);
        return ftask;
    }
```

上面方法调用的 `newTaskFor` 方法返回了一个 `FutureTask` 对象。

```
    protected <T> RunnableFuture<T> newTaskFor(Runnable runnable, T value) {
        return new FutureTask<T>(runnable, value);
    }
```

我们再来看看`execute()`方法：

```
    public void execute(Runnable command) {
      ...
    }
```

### 如何创建线程池

《阿里巴巴Java开发手册》中强制线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险

> Executors 返回线程池对象的弊端如下：
>
> - **FixedThreadPool 和 SingleThreadExecutor** ： 允许请求的队列长度为 Integer.MAX_VALUE ，可能堆积大量的请求，从而导致OOM。
> - **CachedThreadPool 和 ScheduledThreadPool** ： 允许创建的线程数量为 Integer.MAX_VALUE ，可能会创建大量线程，从而导致OOM。

**方式一：通过构造方法实现** [![ThreadPoolExecutor构造方法](https://camo.githubusercontent.com/c1a87ea139bc0379f5c98484416594843ff29d6d/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f546872656164506f6f6c4578656375746f722545362539452538342545392538302541302545362539362542392545362542332539352e706e67)](https://camo.githubusercontent.com/c1a87ea139bc0379f5c98484416594843ff29d6d/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f546872656164506f6f6c4578656375746f722545362539452538342545392538302541302545362539362542392545362542332539352e706e67) **方式二：通过Executor 框架的工具类Executors来实现** 我们可以创建三种类型的ThreadPoolExecutor：

- **FixedThreadPool** ： 该方法返回一个固定线程数量的线程池。该线程池中的线程数量始终不变。当有一个新的任务提交时，线程池中若有空闲线程，则立即执行。若没有，则新的任务会被暂存在一个任务队列中，待有线程空闲时，便处理在任务队列中的任务。
- **SingleThreadExecutor：** 方法返回一个只有一个线程的线程池。若多余一个任务被提交到该线程池，任务会被保存在一个任务队列中，待线程空闲，按先入先出的顺序执行队列中的任务。
- **CachedThreadPool：** 该方法返回一个可根据实际情况调整线程数量的线程池。线程池的线程数量不确定，但若有空闲线程可以复用，则会优先使用可复用的线程。若所有线程均在工作，又有新的任务提交，则会创建新的线程处理任务。所有线程在当前任务执行完毕后，将返回线程池进行复用。

对应Executors工具类中的方法如图所示： [![Executor框架的工具类](https://camo.githubusercontent.com/6cfe663a5033e0f4adcfa148e6c54cdbb97c00bb/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f4578656375746f722545362541312538362545362539452542362545372539412538342545352542372541352545352538352542372545372542312542422e706e67)](https://camo.githubusercontent.com/6cfe663a5033e0f4adcfa148e6c54cdbb97c00bb/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f4578656375746f722545362541312538362545362539452542362545372539412538342545352542372541352545352538352542372545372542312542422e706e67)

### ThreadPoolExecutor 类分析

`ThreadPoolExecutor` 类中提供的四个构造方法。我们来看最长的那个，其余三个都是在这个构造方法的基础上产生（其他几个构造方法说白点都是给定某些默认参数的构造方法比如默认制定拒绝策略是什么），这里就不贴代码讲了，比较简单。

```
    /**
     * 用给定的初始参数创建一个新的ThreadPoolExecutor。
     */
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
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
```

**下面这些对创建 非常重要，在后面使用线程池的过程中你一定会用到！所以，务必拿着小本本记清楚。**

####  `ThreadPoolExecutor`构造函数重要参数分析

**ThreadPoolExecutor 3 个最重要的参数：**

- **corePoolSize :** 核心线程数线程数定义了最小可以同时运行的线程数量。
- **maximumPoolSize :** 当队列中存放的任务达到队列容量的时候，当前可以同时运行的线程数量变为最大线程数。
- **workQueue:** 当新任务来的时候会先判断当前运行的线程数量是否达到核心线程数，如果达到的话，新任务就会被存放在队列中。

`ThreadPoolExecutor`其他常见参数:

1. **keepAliveTime**:当线程池中的线程数量大于 `corePoolSize` 的时候，如果这时没有新的任务提交，核心线程外的线程不会立即销毁，而是会等待，直到等待的时间超过了 `keepAliveTime`才会被回收销毁；
2. **unit** : `keepAliveTime` 参数的时间单位。
3. **threadFactory** :executor 创建新线程的时候会用到。
4. **handler** :饱和策略。关于饱和策略下面单独介绍一下。

#### `ThreadPoolExecutor` 饱和策略

**ThreadPoolExecutor 饱和策略定义:**

如果当前同时运行的线程数量达到最大线程数量并且队列也已经被放满了任时，`ThreadPoolTaskExecutor` 定义一些策略:

- **ThreadPoolExecutor.AbortPolicy**：抛出 `RejectedExecutionException`来拒绝新任务的处理。
- **ThreadPoolExecutor.CallerRunsPolicy**：调用执行自己的线程运行任务。您不会任务请求。但是这种策略会降低对于新任务提交速度，影响程序的整体性能。另外，这个策略喜欢增加队列容量。如果您的应用程序可以承受此延迟并且你不能任务丢弃任何一个任务请求的话，你可以选择这个策略。
- **ThreadPoolExecutor.DiscardPolicy：** 不处理新任务，直接丢弃掉。
- **ThreadPoolExecutor.DiscardOldestPolicy：** 此策略将丢弃最早的未处理的任务请求。

举个例子： Spring 通过 `ThreadPoolTaskExecutor` 或者我们直接通过 `ThreadPoolExecutor` 的构造函数创建线程池的时候，当我们不指定 `RejectedExecutionHandler` 饱和策略的话来配置线程池的时候默认使用的是 `ThreadPoolExecutor.AbortPolicy`。在默认情况下，`ThreadPoolExecutor` 将抛出 `RejectedExecutionException` 来拒绝新来的任务 ，这代表你将丢失对这个任务的处理。 对于可伸缩的应用程序，建议使用 `ThreadPoolExecutor.CallerRunsPolicy`。当最大池被填满时，此策略为我们提供可伸缩队列。（这个直接查看 `ThreadPoolExecutor` 的构造函数源码就可以看出，比较简单的原因，这里就不贴代码了）

### 一个简单的线程池Demo:`Runnable`+`ThreadPoolExecutor`

为了让大家更清楚上面的面试题中的一些概念，我写了一个简单的线程池 Demo。

首先创建一个 `Runnable` 接口的实现类（当然也可以是 `Callable` 接口，我们上面也说了两者的区别。）

```
/**
 * 这是一个简单的Runnable类，需要大约5秒钟来执行其任务。
 * @author shuang.kou
 */
public class MyRunnable implements Runnable {

    private String command;

    public MyRunnable(String s) {
        this.command = s;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " Start. Time = " + new Date());
        processCommand();
        System.out.println(Thread.currentThread().getName() + " End. Time = " + new Date());
    }

    private void processCommand() {
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String toString() {
        return this.command;
    }
}
```

编写测试程序，我们这里以阿里巴巴推荐的使用 `ThreadPoolExecutor` 构造函数自定义参数的方式来创建线程池。

```
public class ThreadPoolExecutorDemo {

    private static final int CORE_POOL_SIZE = 5;
    private static final int MAX_POOL_SIZE = 10;
    private static final int QUEUE_CAPACITY = 100;
    private static final Long KEEP_ALIVE_TIME = 1L;
    public static void main(String[] args) {

        //使用阿里巴巴推荐的创建线程池的方式
        //通过ThreadPoolExecutor构造函数自定义参数创建
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                CORE_POOL_SIZE,
                MAX_POOL_SIZE,
                KEEP_ALIVE_TIME,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(QUEUE_CAPACITY),
                new ThreadPoolExecutor.CallerRunsPolicy());

        for (int i = 0; i < 10; i++) {
            //创建WorkerThread对象（WorkerThread类实现了Runnable 接口）
            Runnable worker = new MyRunnable("" + i);
            //执行Runnable
            executor.execute(worker);
        }
        //终止线程池
        executor.shutdown();
        while (!executor.isTerminated()) {
        }
        System.out.println("Finished all threads");
    }
}
```

可以看到我们上面的代码指定了：

1. `corePoolSize`: 核心线程数为 5。
2. `maximumPoolSize` ：最大线程数 10
3. `keepAliveTime` : 等待时间为 1L。
4. `unit`: 等待时间的单位为 TimeUnit.SECONDS。
5. `workQueue`：任务队列为 `ArrayBlockingQueue`，并且容量为 100;
6. `handler`:饱和策略为 `CallerRunsPolicy`。

**Output：**

```
pool-1-thread-2 Start. Time = Tue Nov 12 20:59:44 CST 2019
pool-1-thread-5 Start. Time = Tue Nov 12 20:59:44 CST 2019
pool-1-thread-4 Start. Time = Tue Nov 12 20:59:44 CST 2019
pool-1-thread-1 Start. Time = Tue Nov 12 20:59:44 CST 2019
pool-1-thread-3 Start. Time = Tue Nov 12 20:59:44 CST 2019
pool-1-thread-5 End. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-3 End. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-2 End. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-4 End. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-1 End. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-2 Start. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-1 Start. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-4 Start. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-3 Start. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-5 Start. Time = Tue Nov 12 20:59:49 CST 2019
pool-1-thread-2 End. Time = Tue Nov 12 20:59:54 CST 2019
pool-1-thread-3 End. Time = Tue Nov 12 20:59:54 CST 2019
pool-1-thread-4 End. Time = Tue Nov 12 20:59:54 CST 2019
pool-1-thread-5 End. Time = Tue Nov 12 20:59:54 CST 2019
pool-1-thread-1 End. Time = Tue Nov 12 20:59:54 CST 2019
```

### 线程池原理分析

承接上节，我们通过代码输出结果可以看出：**线程池每次会同时执行 5 个任务，这 5 个任务执行完之后，剩余的 5 个任务才会被执行。** 大家可以先通过上面讲解的内容，分析一下到底是咋回事？（自己独立思考一会）

现在，我们就分析上面的输出内容来简单分析一下线程池原理。

**为了搞懂线程池的原理，我们需要首先分析一下 `execute`方法。**在 4.6 节中的 Demo 中我们使用 `executor.execute(worker)`来提交一个任务到线程池中去，这个方法非常重要，下面我们来看看它的源码：

```
   // 存放线程池的运行状态 (runState) 和线程池内有效线程的数量 (workerCount)
   private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));

    private static int workerCountOf(int c) {
        return c & CAPACITY;
    }

    private final BlockingQueue<Runnable> workQueue;

    public void execute(Runnable command) {
        // 如果任务为null，则抛出异常。
        if (command == null)
            throw new NullPointerException();
        // ctl 中保存的线程池当前的一些状态信息
        int c = ctl.get();

        //  下面会涉及到 3 步 操作
        // 1.首先判断当前线程池中之行的任务数量是否小于 corePoolSize
        // 如果小于的话，通过addWorker(command, true)新建一个线程，并将任务(command)添加到该线程中；然后，启动该线程从而执行任务。
        if (workerCountOf(c) < corePoolSize) {
            if (addWorker(command, true))
                return;
            c = ctl.get();
        }
        // 2.如果当前之行的任务数量大于等于 corePoolSize 的时候就会走到这里
        // 通过 isRunning 方法判断线程池状态，线程池处于 RUNNING 状态才会被并且队列可以加入任务，该任务才会被加入进去
        if (isRunning(c) && workQueue.offer(command)) {
            int recheck = ctl.get();
            // 再次获取线程池状态，如果线程池状态不是 RUNNING 状态就需要从任务队列中移除任务，并尝试判断线程是否全部执行完毕。同时执行拒绝策略。
            if (!isRunning(recheck) && remove(command))
                reject(command);
                // 如果当前线程池为空就新创建一个线程并执行。
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
        }
        //3. 通过addWorker(command, false)新建一个线程，并将任务(command)添加到该线程中；然后，启动该线程从而执行任务。
        //如果addWorker(command, false)执行失败，则通过reject()执行相应的拒绝策略的内容。
        else if (!addWorker(command, false))
            reject(command);
    }
```

通过下图可以更好的对上面这 3 步做一个展示，下图是我为了省事直接从网上找到，原地址不明。

[![图解线程池实现原理](https://camo.githubusercontent.com/cf627f637b4c678cd77b815fbea8789dd3158b0c/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d372f2545352539422542452545382541372541332545372542412542462545372541382538422545362542312541302545352541452539452545372538452542302545352538452539462545372539302538362e706e67)](https://camo.githubusercontent.com/cf627f637b4c678cd77b815fbea8789dd3158b0c/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d372f2545352539422542452545382541372541332545372542412542462545372541382538422545362542312541302545352541452539452545372538452542302545352538452539462545372539302538362e706e67)

现在，让我们在回到我们写的 Demo， 现在应该是不是很容易就可以搞懂它的原理了呢？

没搞懂的话，也没关系，可以看看我的分析：

> 我们在代码中模拟了 10 个任务，我们配置的核心线程数为 5 、等待队列容量为 100 ，所以每次只可能存在 5 个任务同时执行，剩下的 5 个任务会被放到等待队列中去。当前的 5 个任务之行完成后，才会之行剩下的 5 个任务。



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



### 线程池都有哪几种工作队列？

- ArrayBlockingQueue ：一个由数组结构组成的有界阻塞队列
- LinkedBlockingQueue ：一个由链表结构组成的有界阻塞队列
- PriorityBlockingQueue ：一个支持优先级排序的无界阻塞队列
- DelayQueue：一个使用优先级队列实现的无界阻塞队列
- SynchronousQueue：一个不存储元素的阻塞队列
- LinkedTransferQueue：一个由链表结构组成的无界阻塞队列（实现了继承于 BlockingQueue 的 TransferQueue）
- LinkedBlockingDeque：一个由链表结构组成的双向阻塞队列



### 合理配置线程池你是如何考虑的？

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

  所以在 IO 密集型任务中使用多线程可以大大的加速程序运行，即使在单核 CPU 上，这种加速主要就是利用了被浪费调的阻塞时间。所以在 IO 密集型任务中使用多线程可以大大的加速程序运行，即使在单核 CPU 上，这种加速主要就是利用了被浪费掉的阻塞时间。

  IO 密集型时，大部分线程都阻塞，故需要多配置线程数：

  参考公式： CPU 核数/（1- 阻塞系数）   阻塞系数在 0.8~0.9 之间

  比如 8 核 CPU：8/（1 -0.9）= 80个线程数


  这个其实没有一个特别适用的公式，肯定适合自己的业务，美团给出了个**动态更新**的逻辑，可以看看





## 六、AQS篇

### 6.1. AQS 介绍

AQS的全称为（AbstractQueuedSynchronizer），这个类在java.util.concurrent.locks包下面。

[![AQS类](https://camo.githubusercontent.com/7e2bd67b66e3e1764a442b8d96689f64e5521c2c/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f4151532545372542312542422e706e67)](https://camo.githubusercontent.com/7e2bd67b66e3e1764a442b8d96689f64e5521c2c/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f4151532545372542312542422e706e67)

AQS是一个用来构建锁和同步器的框架，使用AQS能简单且高效地构造出应用广泛的大量的同步器，比如我们提到的ReentrantLock，Semaphore，其他的诸如ReentrantReadWriteLock，SynchronousQueue，FutureTask等等皆是基于AQS的。当然，我们自己也能利用AQS非常轻松容易地构造出符合我们自己需求的同步器。

### 6.2. AQS 原理分析

AQS 原理这部分参考了部分博客，在5.2节末尾放了链接。

> 在面试中被问到并发知识的时候，大多都会被问到“请你说一下自己对于AQS原理的理解”。下面给大家一个示例供大家参加，面试不是背题，大家一定要加入自己的思想，即使加入不了自己的思想也要保证自己能够通俗的讲出来而不是背出来。

下面大部分内容其实在AQS类注释上已经给出了，不过是英语看着比较吃力一点，感兴趣的话可以看看源码。

#### 6.2.1. AQS 原理概览

**AQS核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制AQS是用CLH队列锁实现的，即将暂时获取不到锁的线程加入到队列中。**

> CLH(Craig,Landin,and Hagersten)队列是一个虚拟的双向队列（虚拟的双向队列即不存在队列实例，仅存在结点之间的关联关系）。AQS是将每条请求共享资源的线程封装成一个CLH锁队列的一个结点（Node）来实现锁的分配。

看个AQS(AbstractQueuedSynchronizer)原理图：

[![AQS原理图](https://camo.githubusercontent.com/13db51afdebad2dac67a224d422f6f60c9b8d366/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f4151532545352538452539462545372539302538362545352539422542452e706e67)](https://camo.githubusercontent.com/13db51afdebad2dac67a224d422f6f60c9b8d366/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f4151532545352538452539462545372539302538362545352539422542452e706e67)

AQS使用一个int成员变量来表示同步状态，通过内置的FIFO队列来完成获取资源线程的排队工作。AQS使用CAS对该同步状态进行原子操作实现对其值的修改。

```
private volatile int state;//共享变量，使用volatile修饰保证线程可见性
```

状态信息通过protected类型的getState，setState，compareAndSetState进行操作

```
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

#### 6.2.2. AQS 对资源的共享方式

**AQS定义两种资源共享方式**

- Exclusive

  （独占）：只有一个线程能执行，如ReentrantLock。又可分为公平锁和非公平锁：

  - 公平锁：按照线程在队列中的排队顺序，先到者先拿到锁
  - 非公平锁：当线程要获取锁时，无视队列顺序直接去抢锁，谁抢到就是谁的

- **Share**（共享）：多个线程可同时执行，如Semaphore/CountDownLatch。Semaphore、CountDownLatch、 CyclicBarrier、ReadWriteLock 我们都会在后面讲到。

ReentrantReadWriteLock 可以看成是组合式，因为ReentrantReadWriteLock也就是读写锁允许多个线程同时对某一资源进行读。

不同的自定义同步器争用共享资源的方式也不同。自定义同步器在实现时只需要实现共享资源 state 的获取与释放方式即可，至于具体线程等待队列的维护（如获取资源失败入队/唤醒出队等），AQS已经在顶层实现好了。

#### 6.2.3. AQS底层使用了模板方法模式

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

### 6.3. AQS 组件总结

- **Semaphore(信号量)-允许多个线程同时访问：** synchronized 和 ReentrantLock 都是一次只允许一个线程访问某个资源，Semaphore(信号量)可以指定多个线程同时访问某个资源。
- **CountDownLatch （倒计时器）：** CountDownLatch是一个同步工具类，用来协调多个线程之间的同步。这个工具通常用来控制线程等待，它可以让某一个线程等待直到倒计时结束，再开始执行。
- **CyclicBarrier(循环栅栏)：** CyclicBarrier 和 CountDownLatch 非常类似，它也可以实现线程间的技术等待，但是它的功能比 CountDownLatch 更加复杂和强大。主要应用场景和 CountDownLatch 类似。CyclicBarrier 的字面意思是可循环使用（Cyclic）的屏障（Barrier）。它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活。CyclicBarrier默认的构造方法是 CyclicBarrier(int parties)，其参数表示屏障拦截的线程数量，每个线程调用await()方法告诉 CyclicBarrier 我已经到达了屏障，然后当前线程被阻塞。



### AQS是如何唤醒下一个线程的？

当需要阻塞或者唤醒一个线程的时候，AQS都是使用LockSupport这个工具类来完成的。



### ReetrantLock有用过吗，怎么实现重入的

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



### countDownLatch/CycliBarries/Semaphore使用过吗



#### CycliBarries

CycliBarries 的字面意思是可循环（cycli）使用的屏障（Barries）。它主要做的事情是，让一组线程达到一个屏障（也可以叫同步点）时被阻塞，知道最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活，线程进入屏障通过CycliBarries的 await() 方法。

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





## 七、并发容器篇

Queue

ConcurrentHashMap

#### 什么是ConcurrentHashMap？

ConcurrentHashMap是Java中的一个**线程安全且高效的HashMap实现**。平时涉及高并发如果要用map结构，那第一时间想到的就是它。相对于hashmap来说，ConcurrentHashMap就是线程安全的map，其中利用了锁分段的思想提高了并发度。

那么它到底是如何实现线程安全的？

JDK 1.6版本关键要素：

- segment继承了ReentrantLock充当锁的角色，为每一个segment提供了线程安全的保障；
- segment维护了哈希散列表的若干个桶，每个桶由HashEntry构成的链表。

JDK1.8后，ConcurrentHashMap抛弃了原有的**Segment 分段锁，而采用了 CAS + synchronized 来保证并发安全性**。

#### Java 中 ConcurrentHashMap 的并发度是什么？

ConcurrentHashMap 把实际 map 划分成若干部分来实现它的可扩展性和线程安全。这种划分是使用并发度获得的，它是 ConcurrentHashMap 类构造函数的一个可选参数，默认值为 16，这样在多线程情况下就能避免争用。

在 JDK8 后，它摒弃了 Segment（锁段）的概念，而是启用了一种全新的方式实现,利用 CAS 算法。同时加入了更多的辅助变量来提高并发度

#### Java 中的同步集合与并发集合有什么区别？

同步集合与并发集合都为多线程和并发提供了合适的线程安全的集合，不过并发集合的可扩展性更高。在 Java1.5 之前程序员们只有同步集合来用且在多线程并发的时候会导致争用，阻碍了系统的扩展性。Java5 介绍了并发集合像ConcurrentHashMap，不仅提供线程安全还用锁分离和内部分区等现代技术提高了可扩展性。

#### SynchronizedMap 和 ConcurrentHashMap 有什么区别？

SynchronizedMap 一次锁住整张表来保证线程安全，所以每次只能有一个线程来访为 map。

ConcurrentHashMap 使用分段锁来保证在多线程下的性能。

ConcurrentHashMap 中则是一次锁住一个桶。ConcurrentHashMap 默认将hash 表分为 16 个桶，诸如 get，put，remove 等常用操作只锁当前需要用到的桶。

这样，原来只能一个线程进入，现在却能同时有 16 个写线程执行，并发性能的提升是显而易见的。

另外 ConcurrentHashMap 使用了一种不同的迭代方式。在这种迭代方式中，当iterator 被创建后集合再发生改变就不再是抛出ConcurrentModificationException，取而代之的是在改变时 new 新的数据从而不影响原有的数据，iterator 完成后再将头指针替换为新的数据 ，这样 iterator线程可以使用原来老的数据，而写线程也可以并发的完成改变

#### CopyOnWriteArrayList 是什么，可以用于什么应用场景？有哪些优缺点？

CopyOnWriteArrayList 是一个并发容器。有很多人称它是线程安全的，我认为这句话不严谨，缺少一个前提条件，那就是非复合场景下操作它是线程安全的。

CopyOnWriteArrayList(免锁容器)的好处之一是当多个迭代器同时遍历和修改这个列表时，不会抛出 ConcurrentModificationException。在CopyOnWriteArrayList 中，写入将导致创建整个底层数组的副本，而源数组将保留在原地，使得复制的数组在被修改时，读取操作可以安全地执行。

CopyOnWriteArrayList 的使用场景

通过源码分析，我们看出它的优缺点比较明显，所以使用场景也就比较明显。就是合适读多写少的场景。

CopyOnWriteArrayList 的缺点

1. 由于写操作的时候，需要拷贝数组，会消耗内存，如果原数组的内容比较多的情况下，可能导致 young gc 或者 full gc。
2. 不能用于实时读的场景，像拷贝数组、新增元素都需要时间，所以调用一个 set 操作后，读取到数据可能还是旧的，虽然CopyOnWriteArrayList 能做到最终一致性,但是还是没法满足实时性要求。
3. 由于实际使用中可能没法保证 CopyOnWriteArrayList 到底要放置多少数据，万一数据稍微有点多，每次 add/set 都要重新复制数组，这个代价实在太高昂了。在高性能的互联网应用中，这种操作分分钟引起故障。

CopyOnWriteArrayList 的设计思想

1. 读写分离，读和写分开
2. 最终一致性
3. 使用另外开辟空间的思路，来解决并发冲突

#### ThreadLocal 是什么？有哪些使用场景？

ThreadLocal 是一个本地线程副本变量工具类，在每个线程中都创建了一个 ThreadLocalMap 对象，简单说 ThreadLocal 就是一种以空间换时间的做法，每个线程可以访问自己内部 ThreadLocalMap 对象内的 value。通过这种方式，避免资源在多线程间共享。

原理：线程局部变量是局限于线程内部的变量，属于线程自身所有，不在多个线程间共享。Java提供ThreadLocal类来支持线程局部变量，是一种实现线程安全的方式。但是在管理环境下（如 web 服务器）使用线程局部变量的时候要特别小心，在这种情况下，工作线程的生命周期比任何应用变量的生命周期都要长。任何线程局部变量一旦在工作完成后没有释放，Java 应用就存在内存泄露的风险。

经典的使用场景是为每个线程分配一个 JDBC 连接 Connection。这样就可以保证每个线程的都在各自的 Connection 上进行数据库的操作，不会出现 A 线程关了 B线程正在使用的 Connection； 还有 Session 管理 等问题。

#### 什么是线程局部变量？

线程局部变量是局限于线程内部的变量，属于线程自身所有，不在多个线程间共享。Java 提供 ThreadLocal 类来支持线程局部变量，是一种实现线程安全的方式。但是在管理环境下（如 web 服务器）使用线程局部变量的时候要特别小心，在这种情况下，工作线程的生命周期比任何应用变量的生命周期都要长。任何线程局部变量一旦在工作完成后没有释放，Java 应用就存在内存泄露的风险。

#### ThreadLocal造成内存泄漏的原因？

`ThreadLocalMap` 中使用的 key 为 `ThreadLocal` 的弱引用,而 value 是强引用。所以，如果 `ThreadLocal` 没有被外部强引用的情况下，在垃圾回收的时候，key 会被清理掉，而 value 不会被清理掉。这样一来，`ThreadLocalMap` 中就会出现key为null的Entry。假如我们不做任何措施的话，value 永远无法被GC 回收，这个时候就可能会产生内存泄露。ThreadLocalMap实现中已经考虑了这种情况，在调用 `set()`、`get()`、`remove()` 方法的时候，会清理掉 key 为 null 的记录。使用完 `ThreadLocal`方法后 最好手动调用`remove()`方法

#### ThreadLocal内存泄漏解决方案？

- 每次使用完ThreadLocal，都调用它的remove()方法，清除数据。
- 在使用线程池的情况下，没有及时清理ThreadLocal，不仅是内存泄漏的问题，更严重的是可能导致业务逻辑出现问题。所以，使用ThreadLocal就跟加锁完要解锁一样，用完就清理。

#### 什么是阻塞队列？阻塞队列的实现原理是什么？如何使用阻塞队列来实现生产者-消费者模型？

阻塞队列（BlockingQueue）是一个支持两个附加操作的队列。

这两个附加的操作是：在队列为空时，获取元素的线程会等待队列变为非空。当队列满时，存储元素的线程会等待队列可用。

阻塞队列常用于生产者和消费者的场景，生产者是往队列里添加元素的线程，消费者是从队列里拿元素的线程。阻塞队列就是生产者存放元素的容器，而消费者也只从容器里拿元素。

JDK7 提供了 7 个阻塞队列。分别是：

ArrayBlockingQueue ：一个由数组结构组成的有界阻塞队列。

LinkedBlockingQueue ：一个由链表结构组成的有界阻塞队列。

PriorityBlockingQueue ：一个支持优先级排序的无界阻塞队列。

DelayQueue：一个使用优先级队列实现的无界阻塞队列。

SynchronousQueue：一个不存储元素的阻塞队列。

LinkedTransferQueue：一个由链表结构组成的无界阻塞队列。

LinkedBlockingDeque：一个由链表结构组成的双向阻塞队列。

Java 5 之前实现同步存取时，可以使用普通的一个集合，然后在使用线程的协作和线程同步可以实现生产者，消费者模式，主要的技术就是用好，wait,notify,notifyAll,sychronized 这些关键字。而在 java 5 之后，可以使用阻塞队列来实现，此方式大大简少了代码量，使得多线程编程更加容易，安全方面也有保障。

BlockingQueue 接口是 Queue 的子接口，它的主要用途并不是作为容器，而是作为线程同步的的工具，因此他具有一个很明显的特性，当生产者线程试图向 BlockingQueue 放入元素时，如果队列已满，则线程被阻塞，当消费者线程试图从中取出一个元素时，如果队列为空，则该线程会被阻塞，正是因为它所具有这个特性，所以在程序中多个线程交替向 BlockingQueue 中放入元素，取出元素，它可以很好的控制线程之间的通信。

阻塞队列使用最经典的场景就是 socket 客户端数据的读取和解析，读取数据的线程不断将数据放入队列，然后解析线程不断从队列取数据解析。

## 八、其他问题

### ThreadLocal

当使用 ThreadLocal 维护变量时，其为每个使用该变量的线程提供独立的变量副本，所以每一个线程都可以独立的改变自己的副本，而不会影响其他线程对应的副本。

ThreadLocal 内部实现机制：

- 每个线程内部都会维护一个类似 HashMap 的对象，称为 ThreadLocalMap，里边会包含若干了 Entry（K-V 键值对），相应的线程被称为这些 Entry 的属主线程；
- Entry 的 Key 是一个 ThreadLocal 实例，Value 是一个线程特有对象。Entry 的作用即是：为其属主线程建立起一个 ThreadLocal 实例与一个线程特有对象之间的对应关系；
- Entry 对 Key 的引用是弱引用；Entry 对 Value 的引用是强引用。

### 3.1. ThreadLocal简介

通常情况下，我们创建的变量是可以被任何一个线程访问并修改的。**如果想实现每一个线程都有自己的专属本地变量该如何解决呢？** JDK中提供的`ThreadLocal`类正是为了解决这样的问题。 **ThreadLocal类主要解决的就是让每个线程绑定自己的值，可以将ThreadLocal类形象的比喻成存放数据的盒子，盒子中可以存储每个线程的私有数据。**

**如果你创建了一个ThreadLocal变量，那么访问这个变量的每个线程都会有这个变量的本地副本，这也是ThreadLocal变量名的由来。他们可以使用 get（） 和 set（） 方法来获取默认值或将其值更改为当前线程所存的副本的值，从而避免了线程安全问题。**

再举个简单的例子：

比如有两个人去宝屋收集宝物，这两个共用一个袋子的话肯定会产生争执，但是给他们两个人每个人分配一个袋子的话就不会出现这样的问题。如果把这两个人比作线程的话，那么ThreadLocal就是用来避免这两个线程竞争的。

### 3.2. ThreadLocal示例

相信看了上面的解释，大家已经搞懂 ThreadLocal 类是个什么东西了。

```
import java.text.SimpleDateFormat;
import java.util.Random;

public class ThreadLocalExample implements Runnable{

     // SimpleDateFormat 不是线程安全的，所以每个线程都要有自己独立的副本
    private static final ThreadLocal<SimpleDateFormat> formatter = ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyyMMdd HHmm"));

    public static void main(String[] args) throws InterruptedException {
        ThreadLocalExample obj = new ThreadLocalExample();
        for(int i=0 ; i<10; i++){
            Thread t = new Thread(obj, ""+i);
            Thread.sleep(new Random().nextInt(1000));
            t.start();
        }
    }

    @Override
    public void run() {
        System.out.println("Thread Name= "+Thread.currentThread().getName()+" default Formatter = "+formatter.get().toPattern());
        try {
            Thread.sleep(new Random().nextInt(1000));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //formatter pattern is changed here by thread, but it won't reflect to other threads
        formatter.set(new SimpleDateFormat());

        System.out.println("Thread Name= "+Thread.currentThread().getName()+" formatter = "+formatter.get().toPattern());
    }

}
```

Output:

```
Thread Name= 0 default Formatter = yyyyMMdd HHmm
Thread Name= 0 formatter = yy-M-d ah:mm
Thread Name= 1 default Formatter = yyyyMMdd HHmm
Thread Name= 2 default Formatter = yyyyMMdd HHmm
Thread Name= 1 formatter = yy-M-d ah:mm
Thread Name= 3 default Formatter = yyyyMMdd HHmm
Thread Name= 2 formatter = yy-M-d ah:mm
Thread Name= 4 default Formatter = yyyyMMdd HHmm
Thread Name= 3 formatter = yy-M-d ah:mm
Thread Name= 4 formatter = yy-M-d ah:mm
Thread Name= 5 default Formatter = yyyyMMdd HHmm
Thread Name= 5 formatter = yy-M-d ah:mm
Thread Name= 6 default Formatter = yyyyMMdd HHmm
Thread Name= 6 formatter = yy-M-d ah:mm
Thread Name= 7 default Formatter = yyyyMMdd HHmm
Thread Name= 7 formatter = yy-M-d ah:mm
Thread Name= 8 default Formatter = yyyyMMdd HHmm
Thread Name= 9 default Formatter = yyyyMMdd HHmm
Thread Name= 8 formatter = yy-M-d ah:mm
Thread Name= 9 formatter = yy-M-d ah:mm
```

从输出中可以看出，Thread-0已经改变了formatter的值，但仍然是thread-2默认格式化程序与初始化值相同，其他线程也一样。

上面有一段代码用到了创建 `ThreadLocal` 变量的那段代码用到了 Java8 的知识，它等于下面这段代码，如果你写了下面这段代码的话，IDEA会提示你转换为Java8的格式(IDEA真的不错！)。因为ThreadLocal类在Java 8中扩展，使用一个新的方法`withInitial()`，将Supplier功能接口作为参数。

```
 private static final ThreadLocal<SimpleDateFormat> formatter = new ThreadLocal<SimpleDateFormat>(){
        @Override
        protected SimpleDateFormat initialValue()
        {
            return new SimpleDateFormat("yyyyMMdd HHmm");
        }
    };
```

### 3.3. ThreadLocal原理

从 `Thread`类源代码入手。

```
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

```
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

```
ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
 ......
}
```

比如我们在同一个线程中声明了两个 `ThreadLocal` 对象的话，会使用 `Thread`内部都是使用仅有那个`ThreadLocalMap` 存放数据的，`ThreadLocalMap`的 key 就是 `ThreadLocal`对象，value 就是 `ThreadLocal` 对象调用`set`方法设置的值。

[![ThreadLocal数据结构](https://camo.githubusercontent.com/a463d65fe6b4b96dc81750d19f80f26f8e0675d0/68747470733a2f2f75706c6f61642d696d616765732e6a69616e7368752e696f2f75706c6f61645f696d616765732f373433323630342d616432666635383131323762613863632e6a70673f696d6167654d6f6772322f6175746f2d6f7269656e742f7374726970253743696d61676556696577322f322f772f383036)](https://camo.githubusercontent.com/a463d65fe6b4b96dc81750d19f80f26f8e0675d0/68747470733a2f2f75706c6f61642d696d616765732e6a69616e7368752e696f2f75706c6f61645f696d616765732f373433323630342d616432666635383131323762613863632e6a70673f696d6167654d6f6772322f6175746f2d6f7269656e742f7374726970253743696d61676556696577322f322f772f383036)

`ThreadLocalMap`是`ThreadLocal`的静态内部类。

[![ThreadLocal内部类](https://camo.githubusercontent.com/11f103a8a726894a98d431b0675f759e3d915782/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f5468726561644c6f63616c2545352538362538352545392538332541382545372542312542422e706e67)](https://camo.githubusercontent.com/11f103a8a726894a98d431b0675f759e3d915782/68747470733a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f323031392d362f5468726561644c6f63616c2545352538362538352545392538332541382545372542312542422e706e67)

### 3.4. ThreadLocal 内存泄露问题

`ThreadLocalMap` 中使用的 key 为 `ThreadLocal` 的弱引用,而 value 是强引用。所以，如果 `ThreadLocal` 没有被外部强引用的情况下，在垃圾回收的时候，key 会被清理掉，而 value 不会被清理掉。这样一来，`ThreadLocalMap` 中就会出现key为null的Entry。假如我们不做任何措施的话，value 永远无法被GC 回收，这个时候就可能会产生内存泄露。ThreadLocalMap实现中已经考虑了这种情况，在调用 `set()`、`get()`、`remove()` 方法的时候，会清理掉 key 为 null 的记录。使用完 `ThreadLocal`方法后 最好手动调用`remove()`方法

```
      static class Entry extends WeakReference<ThreadLocal<?>> {
            /** The value associated with this ThreadLocal. */
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }
```

**弱引用介绍：**

> 如果一个对象只具有弱引用，那就类似于**可有可无的生活用品**。弱引用与软引用的区别在于：只具有弱引用的对象拥有更短暂的生命周期。在垃圾回收器线程扫描它 所管辖的内存区域的过程中，一旦发现了只具有弱引用的对象，不管当前内存空间足够与否，都会回收它的内存。不过，由于垃圾回收器是一个优先级很低的线程， 因此不一定会很快发现那些只具有弱引用的对象。
>
> 弱引用可以和一个引用队列（ReferenceQueue）联合使用，如果弱引用所引用的对象被垃圾回收，Java虚拟机就会把这个弱引用加入到与之关联的引用队列中。



 