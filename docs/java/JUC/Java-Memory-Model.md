从 JMM 到 volatile

前两天看到同学和我显摆他们公司配的电脑多好多好，我默默打开了自己的电脑，` 酷睿 i7-4770 `，也不是不够用哈，4核8线程的 CPU，也是杠杠的。

![qqq.png](https://i.loli.net/2020/03/13/RrWQAhYspxlBGnd.png)

扯这玩意干啥，Em~~~~

介绍Java 内存模型之前，先简单了解下计算机硬件内存模型



## 硬件内存架构(Hardware Memory Architecture)

计算机硬件架构简易图：

 ![Modern hardware memory architecture.](http://tutorials.jenkov.com/images/java-concurrency/java-memory-model-4.png) 

每个CPU包含一组 CPU 寄存器，这些寄存器本质上是在 CPU 内存中。CPU 在这些寄存器上执行操作的速度要比在主内存(RAM)中执行变量的速度快得多。

大多数 CPU 又有某种大小的缓存层。CPU 可以比主存更快地访问它的缓存，但通常没有访问 CPU 寄存器的速度快。一些 CPU 又可能有多级缓存层(L1、L2)，比如我最开始截图中的CPU，就有 L1~L3 三级缓存。

至于为什么要加缓存，因为**CPU速率高， 内存速率慢，中间加一个Cache的目的就是为了让存储体系可以跟上CPU的速度。** 

但是这样的话，我的4核8线程CPU并发处理主内存数据的时候，不就会有数据不一致问题了吗？

CPU硬件厂商通过“**缓存一致性协议**”（MSI、MESI等）解决了这个问题。


![JMM](http://www.choupangxia.com/wp-content/uploads/2019/11/computer.jpg) 



通常，当CPU需要访问主内存时，它会将一部分主内存读入CPU缓存。它甚至可以将缓存的一部分读入 CPU 寄存器，然后对其执行操作。当 CPU 需要将结果写回主内存时，它会将值从内部寄存器刷新到缓存内存，并在某个时候将值刷新回主内存。 

Cache是由很多个 Cache line （缓存行）组成的。Cache line 是 cache 和 RAM 交换数据的最小单位，通常为 64 Byte。 深入内容先不探究。



## Java内存模型(Java Memory Model)

Java 内存模型即 `Java Memory Model`，简称 **JMM**。

Java内存模型指定Java虚拟机如何与计算机内存(RAM)一起工作。Java虚拟机是整个计算机的模型，因此这个模型自然包括内存模型—即Java内存模型。 用来屏蔽掉各种硬件和操作系统的内存访问差异，以实现让Java程序在各平台下都能够达到一致的内存访问效果

JMM定义了线程和主内存之间的抽象关系：线程之间的共享变量存储在主内存（main memory）中，每个线程都有一个私有的本地内存（local memory），本地内存中存储了该线程以读/写共享变量的副本。本地内存是JMM的一个抽象概念，并不真实存在。它涵盖了缓存，写缓冲区，寄存器以及其他的硬件和编译器优化。


 ![JMM](http://www.choupangxia.com/wp-content/uploads/2019/11/jmm-1.jpg) 

JMM与Java内存结构并不是同一个层次的内存划分，两者基本没有关系。如果一定要勉强对应，那从变量、主内存、工作内存的定义看，主内存主要对应Java堆中的对象实例数据部分，工作内存则对应虚拟机栈的部分区域。

![JMM](http://www.choupangxia.com/wp-content/uploads/2019/11/jmm-2.jpg)

主内存：主要存储的是Java实例对象，所有线程创建的实例对象都存放在主内存中，不管该实例对象是成员变量还是方法中的本地变量(也称局部变量)，当然也包括了共享的类信息、常量、静态变量。共享数据区域，多条线程对同一个变量进行访问可能会发现线程安全问题。

工作内存：主要存储当前方法的所有本地变量信息(工作内存中存储着主内存中的变量副本拷贝)，每个线程只能访问自己的工作内存，即线程中的本地变量对其它线程是不可见的，就算是两个线程执行的是同一段代码，它们也会各自在自己的工作内存中创建属于当前线程的本地变量，当然也包括了字节码行号指示器、相关Native方法的信息。由于工作内存是每个线程的私有数据，线程间无法相互访问工作内存，因此存储在工作内存的数据不存在线程安全问题。

JMM模型与硬件模型直接的对照关系可简化为下图：![JMM](https://user-gold-cdn.xitu.io/2019/11/4/16e348b63f897229?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 









Java内存模型和硬件内存体系结构是不同的。硬件内存体系结构不区分线程栈和堆。在硬件上，线程栈和堆都位于主内存中。线程栈和堆的一部分有时可能出现在CPU缓存和内部CPU寄存器中。如下图所示: 

![The division of thread stack and heap among CPU internal registers, CPU cache and main memory.](http://tutorials.jenkov.com/images/java-concurrency/java-memory-model-5.png) 

当对象和变量可以存储在计算机中不同的内存区域时，可能会出现某些问题。两个主要问题是:

- 线程更新(写)到共享变量的可见性。

- 读取、检查和写入共享变量时的竞争条件。

### Visibility of Shared Objects

如果两个或多个线程共享一个对象，而没有适当地使用volatile声明或同步，则一个线程对共享对象的更新可能对其他线程不可见。
假设共享对象最初存储在主内存中。在CPU 1上运行的线程然后将共享对象读入它的CPU缓存。在这里，它对共享对象进行更改。只要没有将CPU缓存刷新回主内存，在其他CPU上运行的线程就不会看到共享对象的更改版本。这样，每个线程都可能以自己的线程结束

 ![Visibility Issues in the Java Memory Model.](http://tutorials.jenkov.com/images/java-concurrency/java-memory-model-6.png) 



要解决这个问题，可以使用Java的volatile关键字。volatile关键字可以确保直接从主存读取给定的变量，并在更新时始终将其写回主存。 

### Race Conditions

如果两个或多个线程共享一个对象，并且多个线程更新该共享对象中的变量，则可能出现竞争条件。
想象一下，如果线程A将一个共享对象的变量计数读入到它的CPU缓存中。此时，线程B执行相同的操作，但是进入不同的CPU缓存。现在线程A将1添加到count中，线程B也这样做。现在var1增加了两次，在每个CPU缓存中一次。

如果这些增量是按顺序执行的，则变量计数将增加两次，并将原始值+ 2写回主内存。
然而,

 ![Race Condition Issues in the Java Memory Model.](http://tutorials.jenkov.com/images/java-concurrency/java-memory-model-7.png) 

 要解决这个问题，可以使用Java synchronized块。同步块保证在任何给定时间只有一个线程可以进入给定的代码临界段。Synchronized块还保证在Synchronized块中访问的所有变量都将从主内存中读入，当线程退出Synchronized块时，所有更新的变量都将被再次刷新回主内存，而不管变量是否声明为volatile。 











## 内存之间的交互操作

线程的工作内存中保存了被该线程使用到的变量的主内存副本拷贝，线程对变量的所有操作都必须在工作内存中进行，而不能直接读写主内存中的变量。不同的线程之间也无法直接访问对方工作内存中的变量，线程间变量值的传递均需要通过主内存来完成。

![JMM](https://user-gold-cdn.xitu.io/2019/11/4/16e348b79e8bcbd4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

如上图，本地内存A和B有主内存中共享变量x的副本，初始值都为0。线程A执行之后把x更新为1，存放在本地内存A中。当线程A和线程B需要通信时，线程A首先会把本地内存中x=1值刷新到主内存中，主内存中的x值变为1。随后，线程B到主内存中去读取更新后的x值，线程B的本地内存的x值也变为了1。

在此交互过程中，Java内存模型定义了8种操作来完成，虚拟机实现必须保证每一种操作都是原子的、不可再拆分的（double和long类型例外）。

- lock（锁定）：作用于主内存的变量，它把一个变量标识为一条线程独占的状态。 
- unlock（解锁）：作用于主内存的变量，它把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。 
- read（读取）：作用于主内存的变量，它把一个变量的值从主内存传输到线程的工作内存中，以便随后的load动作使用。 
- load（载入）：作用于工作内存的变量，它把read操作从主内存中得到的变量值放入工作内存的变量副本中。 
- use（使用）：作用于工作内存的变量，它把工作内存中一个变量的值传递给执行引擎，每当虚拟机遇到一个需要使用到变量的值的字节码指令时将会执行这个操作。 
- assign（赋值）：作用于工作内存的变量，它把一个从执行引擎接收到的值赋给工作内存的变量，每当虚拟机遇到一个给变量赋值的字节码指令时执行这个操作。 
- store（存储）：作用于工作内存的变量，它把工作内存中一个变量的值传送到主内存中，以便随后的write操作使用。 
- write（写入）：作用于主内存的变量，它把store操作从工作内存中得到的变量的值放入主内存的变量中。 

如果需要把一个变量从主内存复制到工作内存，那就要顺序地执行read和load操作，如果要把变量从工作内存同步回主内存，就要顺序地执行store和write操作。注意，Java内存模型只要求上述两个操作必须按顺序执行，而没有保证是连续执行。也就是说read与load之间、store与write之间是可插入其他指令的，如对主内存中的变量a、b进行访问时，一种可能出现顺序是read a、read b、load b、load a。除此之外，Java内存模型还规定了在执行上述8中基本操作时必须满足如下规则。

- 不允许read和load、store和write操作之一单独出现，即不允许一个变量从主内存读取了但工作内存不接受，或者从工作内存发起回写了但主内存不接受的情况出现。 
- 不允许一个线程丢弃它的最近的assign操作，即变量在工作内存中改变了之后必须把该变化同步回主内存。 
- 不允许一个线程无原因地（没有发生过任何assign操作）把数据从线程的工作内存同步回主内存。 
- 一个新的变量只能在主内存中“诞生”，不允许在工作内存中直接使用一个未被初始化（load或assign）的变量，换句话说，就是对一个变量实施use、store操作之前，必须先执行过了assign和load操作。 
- 一个变量在同一时刻只允许一条线程对其进行lock操作，但lock操作可以被同一条线程重复执行多次，多次执行lock后，只有执行相同次数的unlock操作，变量才会被解锁。 
- 如果对一个变量执行lock操作，那将会清空工作内存中此变量的值，在执行引擎使用这个变量前，需要重新执行load或assign操作初始化变量的值。 
- 如果一个变量事先没有被lock操作锁定，那就不允许对它执行unlock操作，也不允许去unlock一个被其他线程锁定住的变量。 
- 对一个变量执行unlock操作之前，必须先把此变量同步回主内存中（执行store、write操作）。 

## long和double型变量的特殊规则

Java内存模型要求lock，unlock，read，load，assign，use，store，write这8个操作都具有原子性，但对于64位的数据类型（long或double），在模型中定义了一条相对宽松的规定，允许虚拟机将没有被volatile修饰的64位数据的读写操作划分为两次32位的操作来进行，即允许虚拟机实现选择可以不保证64位数据类型的load，store，read，write这4个操作的原子性，即long和double的非原子性协定。

如果多线程的情况下double或long类型并未声明为volatile，可能会出现“半个变量”的数值，也就是既非原值，也非修改后的值。

虽然Java规范允许上面的实现，但商用虚拟机中基本都采用了原子性的操作，因此在日常使用中几乎不会出现读取到“半个变量”的情况。









学习 volatile 之前先来来接下 JMM



JMM ()



我们常说的JVM内存模式指的是JVM的内存分区；而Java内存模式是一种虚拟机规范。

Java虚拟机规范中定义了Java内存模型（Java Memory Model，JMM），用于屏蔽掉各种硬件和操作系统的内存访问差异，以实现让Java程序在各种平台下都能达到一致的并发效果，JMM规范了Java虚拟机与计算机内存是如何协同工作的：规定了一个线程如何和何时可以看到由其他线程修改过后的共享变量的值，以及在必须时如何同步的访问共享变量。



原始的Java内存模型存在一些不足，因此Java内存模型在Java1.5时被重新修订。这个版本的Java内存模型在Java8中仍然在使用。

Java内存模型（不仅仅是JVM内存分区）：调用栈和本地变量存放在线程栈上，对象存放在堆上。

![img](https://pic2.zhimg.com/80/v2-bd607bd9a5598a8330ad329033e04b91_720w.jpg)

![img](https://pic3.zhimg.com/80/v2-a1a75c9f7264cf78d0927663371ca9d2_720w.jpg)



## JMM

JMM（Java内存模型 Java Memory Model，简称JMM）,不同于我们了解的 Java 内存区域，JMM 本身是一种抽象的概念**并不真实存在**，它描述的是一组规则或规范，通过这组规范定义了程序中各个变量（包括实例字段，静态字段和构成数组对象的元素）的访问方式。

JMM关于同步的规定

- 线程解锁前，必须把共享变量的值刷新回主内存
- 线程加锁前，必须读取主内存的最新值到自己的工作内存
- 加锁解锁是同一把锁

由于 JVM 运行程序的实体是线程，而每个线程创建时 JVM 都会为其创建一个工作内存（栈空间），工作内存是每个线程的私有数据区域，而 Java 内存模型中规定所有变量都存储在主内存中，主内存是共享内存区域，所有线程都可以访问，**但线程对变量的操作（读取赋值等）必须在工作内存中进行，首先要将变量从主内存拷贝到自己的工作内存空间，然后对变量进行操作，操作完成后再将变量写回主内存，不能直接操作主内存中的变量**，各个线程中的工作内存中存储着主内存中的**变量副本拷贝**，因此不同的线程间无法访问对方的工作内存，线程间的通信（传值）必须通过主内存来完成，其简要访问过程如下：



![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgct554oj30qe0d441o.jpg)



JMM 要保证三个特性

- 可见性

  各个线程对主内存中共享变量的操作都是各个线程各自拷贝到自己的工作内存进行操作后再写回到主内存中的。这就可能存在一个线程 Thread1 修改了共享变量X的值但未写回主内存中，另外一个线程 Thread2 又对主内存中同一共享变量 X 进行操作，但此时 Thread1 线程工作内存中共享变量 X 对线程 Thread2 来说并不可见，这种工作内存与主内存同步延迟现象就造成了可见性问题

- 原子性

- 有序性

  计算机在执行程序时，为了提高性能，编译器和处理器常常会对指令做重排，一般分为以下 3 种

  ![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgrycnj0j31bs04k74y.jpg)

  单线程环境里确保程序最终执行结果和代码顺序执行的结果一致

  处理器在进行重排序时必须要考虑指令之间的**数据依赖性**

  多项成环境中线程交替执行，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致性是无法确定的，结果无法预测

![](/Users/starfish/Desktop/截屏2020-03-12上午11.47.50.png)

![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgi74ulmj31im0qin9a.jpg)

变量的赋能拷贝







![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgu63mbnj30su0i4whz.jpg)



数据依赖性，所以4不会是第一条

![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgufti8zj31f40mg0xf.jpg)

![](https://tva1.sinaimg.cn/large/00831rSTly1gcrguq8arkj31f80nidyx.jpg)

![](https://tva1.sinaimg.cn/large/00831rSTly1gcrgvj393uj31fa0m8n73.jpg)



线程安全性获得保证

工作内存与主内存同步延迟现象导致的可见性问题，可以使用synchronized或 volatile 关键字解决，他们可以使一个线程修改后的变量立即对其他线程可见。













## 参考

 http://tutorials.jenkov.com/java-concurrency/java-memory-model.html 

 《 The Java Memory Model 》：http://rsim.cs.uiuc.edu/Pubs/popl05.pdf 

《 JSR-133：JavaTM内存模型与线程规范  》： [http://ifeve.com/wp-content/uploads/2014/03/JSR133%E4%B8%AD%E6%96%87%E7%89%88.pdf](http://ifeve.com/wp-content/uploads/2014/03/JSR133中文版.pdf) 

 https://juejin.im/post/5dbfa0aa51882538ce1a4ebc 