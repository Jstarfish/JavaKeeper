从 JMM 到 volatile

> 谈谈你对volatile 的理解？
>
> volatile 的工作原理？
>
> CAS 你知道吗？ 



 ![img](https://miro.medium.com/max/643/0*aO7jvEaMLhADKTqa) 











学习 volatile 之前先来来接下 JMM





![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgi74ulmj31im0qin9a.jpg)

变量的赋能拷贝







![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgu63mbnj30su0i4whz.jpg)



数据依赖性，所以4不会是第一条

![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgufti8zj31f40mg0xf.jpg)

![](https://tva1.sinaimg.cn/large/00831rSTly1gcrguq8arkj31f80nidyx.jpg)

![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgvj393uj31fa0m8n73.jpg)



线程安全性获得保证

工作内存与主内存同步延迟现象导致的可见性问题，可以使用synchronized或 volatile 关键字解决，他们可以使一个线程修改后的变量立即对其他线程可见。





![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgwjpoekj31dg0nynfc.jpg)





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



volatile 是 Java 虚拟机提供的轻量级的同步机制

- 保证可见性
- 不保证原子性
- 禁止指令重排





#### 当一个变量定义为 volatile 之后，将具备两种特性：

1. 保证此变量对所有的线程的可见性，这里的“可见性”，当一个线程修改了这个变量的值，volatile 保证了新值能立即同步到主内存，以及每次使用前立即从主内存刷新。但普通变量做不到这点，普通变量的值在线程间传递均需要通过主内存（详见：[Java内存模型](http://www.cnblogs.com/zhengbin/p/6407137.html)）来完成。
2. 禁止指令重排序优化。有volatile修饰的变量，赋值后多执行了一个“load addl $0x0, (%esp)”操作，这个操作相当于一个**内存屏障**（指令重排序时不能把后面的指令重排序到内存屏障之前的位置），只有一个CPU访问内存时，并不需要内存屏障；（什么是指令重排序：是指CPU采用了允许将多条指令不按程序规定的顺序分开发送给各相应电路单元处理）。

#### volatile 性能：

　　volatile 的读性能消耗与普通变量几乎相同，但是写操作稍慢，因为它需要在本地代码中插入许多内存屏障指令来保证处理器不发生乱序执行。

### 2.   原子变量 CAS算法 

#### CAS 算法

- CAS (Compare-And-Swap) 是一种硬件对并发的支持，针对多处理器 操作而设计的处理器中的一种特殊指令，用于管理对共享数据的并发访问。 
- CAS 是一种无锁的非阻塞算法的实现。 
- CAS 包含了 3 个操作数：
  - 需要读写的内存值 V 
  - 进行比较的值 A 
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



## 参考

 http://tutorials.jenkov.com/java-concurrency/java-memory-model.html 

 https://juejin.im/post/5dbfa0aa51882538ce1a4ebc 