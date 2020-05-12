## 前言

Java 与 C++ 之间有一堵由内存动态分配和垃圾收集技术所围成的“高墙”，墙外面的人想进去，墙里面的人却想出来。

Java 相比 C/C++ 最显著的特点便是引入了自动垃圾回收 ，它解决了 C/C++ 最令人头疼的内存管理问题，让程序员专注于程序本身，不用关心内存回收这些恼人的问题，这也是 Java 能大行其道的重要原因之一，GC 真正让程序员的生产力得到了释放，但是程序员很难感知到它的存在。

深入了解 GC 是成为一名优秀 Java 程序员的必修课！



## JVM 内存区域

要搞懂垃圾回收的机制，我们首先要知道垃圾回收主要回收的是哪些数据，这些数据主要在哪一块区域，所以我们一起来看下 JVM 的内存区域

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYWExWalY2Q0VkRG1kaWNJZmRFY3pnSUZkMjlrTk5qaFJrR0dITFdvZ2FUV0VpYXpzUVZpYmdsOWtnLzY0MA?x-oss-process=image/format,png)

- 虚拟机栈：描述的是方法执行时的内存模型,是线程私有的，生命周期与线程相同,每个方法被执行的同时会创建**栈桢**，主要保存执行方法时的局部变量表、操作数栈、动态连接和方法返回地址等信息,方法执行时入栈，方法执行完出栈，出栈就相当于清空了数据，入栈出栈的时机很明确，所以这块区域**不需要进行 GC**。

- 本地方法栈：与虚拟机栈功能非常类似，主要区别在于虚拟机栈为虚拟机执行 Java 方法时服务，而本地方法栈为虚拟机执行本地方法时服务的。这块区域也**不需要进行 GC**

- 程序计数器：线程独有的， 可以把它看作是当前线程执行的字节码的行号指示器，比如如下字节码内容，在每个字节码`前面都有一个数字（行号），我们可以认为它就是程序计数器存储的内容![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYWnhwZkRpY3FoSmVmMjZLZ05HcUppYnI4STU4WVN5WVFLTjZYTDk5VmVIS2ZxTFdwVU44T013NFEvNjQw?x-oss-process=image/format,png)

  记录这些数字（指令地址）有啥用呢，我们知道 Java 虚拟机的多线程是通过线程轮流切换并分配处理器的时间来完成的，在任何一个时刻，一个处理器只会执行一个线程，如果这个线程被分配的时间片执行完了（线程被挂起），处理器会切换到另外一个线程执行，当下次轮到执行被挂起的线程（唤醒线程）时，怎么知道上次执行到哪了呢，通过记录在程序计数器中的行号指示器即可知道，所以程序计数器的主要作用是记录线程运行时的状态，方便线程被唤醒时能从上一次被挂起时的状态继续执行，需要注意的是，程序计数器是**唯一一个**在 Java 虚拟机规范中没有规定任何 OOM 情况的区域，所以这块区域也**不需要进行 GC**

- 本地内存：线程共享区域，Java 8 中，本地内存，也是我们通常说的**堆外内存**，包含元空间和直接内存,注意到上图中 Java 8 和 Java 8 之前的 JVM 内存区域的区别了吗，在 Java 8 之前有个**永久代**的概念，实际上指的是 HotSpot 虚拟机上的永久代，它用永久代实现了 JVM 规范定义的方法区功能，主要存储类的信息，常量，静态变量，即时编译器编译后代码等，这部分由于是在堆中实现的，受 GC 的管理，不过由于永久代有` -XX:MaxPermSize` 的上限，所以如果动态生成类（将类信息放入永久代）或大量地执行 **String.intern** （将字段串放入永久代中的常量区），很容易造成 OOM，有人说可以把永久代设置得足够大，但很难确定一个合适的大小，受类数量，常量数量的多少影响很大。所以在 Java 8 中就把方法区的实现移到了本地内存中的元空间中，这样方法区就不受 JVM 的控制了,也就不会进行 GC，也因此提升了性能（发生 GC 会发生 Stop The Word,造成性能受到一定影响，后文会提到），也就不存在由于永久代限制大小而导致的 OOM 异常了（假设总内存1G，JVM 被分配内存 100M， 理论上元空间可以分配 2G-100M = 1.9G，空间大小足够），也方便在元空间中统一管理。综上所述，在 Java 8 以后这一区域也**不需要进行 GC**

​        *画外音：* *思考一个问题，堆外内存不受 GC控制，无法通过 GC 释放内存，那该以什么样的形式释放呢，总不能只创建不释放吧，这样的话内存可能很快就满了，这里不做详细阐述，请看文末的参考文章*

- 堆：前面几块数据区域都不进行 GC，那只剩下堆了，是的，这里是 GC 发生的区域！对象实例和数组都是在堆上分配的，GC 也主要对这两类数据进行回收，这块也是我们之后重点需要分析的区域



## 如何识别垃圾

上一节我们详细讲述了 JVM 的内存区域，知道了 GC 主要发生在堆，那么 GC 该怎么判断堆中的对象实例或数据是不是垃圾呢，或者说判断某些数据是否是垃圾的方法有哪些。

### 引用计数法

最容易想到的一种方式是引用计数法，啥叫引用计数法，简单地说，就是对象被引用一次，在它的对象头上加一次引用次数，如果没有被引用（引用次数为 0），则此对象可回收

```java
String ref = new String("Java");
```

以上代码 ref1 引用了右侧定义的对象，所以引用次数是 1

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYamljaWM0aERkdkRmT3lUUWFobHQzQkt2VXdJU3p3T3NHcUZqZmFXdXZWajk5Yk9rUzdBb1JaNGcvNjQw?x-oss-process=image/format,png)

如果在上述代码后面添加一个 ref = null，则由于对象没被引用，引用次数置为 0，由于不被任何变量引用，此时即被回收，动图如下

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2dpZi9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYWXpkcGwzNmZtRUh3RDFYZ0Z2ZTM5WXlqSnNXMmliU09NZDZPTU81SExJbENIYVlpYnZFUFNpYmliQS82NDA?x-oss-process=image/format,png)

看起来用引用计数确实没啥问题了，不过它无法解决一个主要的问题：循环引用！啥叫循环引用

```java
public class TestRC {

    TestRC instance;
    public TestRC(String name) {
    }

    public static  void main(String[] args) {
      // 第一步
      A a = new TestRC("a");
      B b = new TestRC("b");

      // 第二步
      a.instance = b;
      b.instance = a;

      // 第三步
      a = null;
      b = null;
    }
}
```

按步骤一步步画图

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYaWJkYjN3RERoQXJuRmliaFdoV2NIa2NNUjVRcndyRTJwTm9nSjZySFdpY1l6N2JqRTJOaWJXMW9jZy82NDA?x-oss-process=image/format,png)

到了第三步，虽然 a，b 都被置为 null 了，但是由于之前它们指向的对象互相指向了对方（引用计数都为 1），所以无法回收，也正是由于无法解决循环引用的问题，所以主流的 Java 虚拟机都没有选用引用计数法来管理内存。

### 可达性算法

现代虚拟机基本都是采用这种算法来判断对象是否存活，可达性算法的原理是以一系列叫做  **GC Root**  的对象为起点出发，引出它们指向的下一个节点，再以下个节点为起点，引出此节点指向的下一个结点。。。（这样通过 GC Root 串成的一条线就叫引用链），直到所有的结点都遍历完毕,如果相关对象不在任意一个以 **GC Root** 为起点的引用链中，则这些对象会被判断为「垃圾」,会被 GC 回收。

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYdlpMbXg5SGRlTmliUlFqbkZad1VCRlhUUTZtSnk3OWFqeDRCZHFGTWljSWlhVzRCTlFhR1RaV2liZy82NDA?x-oss-process=image/format,png)

如图示，如果用可达性算法即可解决上述循环引用的问题，因为从**GC Root** 出发没有到达 a,b,所以 a，b 可回收

> a, b 对象可回收，就一定会被回收吗?

即使在可达性分析算法中不可达的对象，也并非是“非死不可”的，这时候他们暂时处于“缓刑”阶段，要真正宣告一个对象死亡，至少要两次标记过程：

1. 对象不可达（可回收），会进行第一次标记并进行一次筛选，筛选条件是此对象是否有必要执行 finalize() 方法 
2. 如果有必要执行finaize() 方法，这个对象会被放在一个叫做 F-Queue 的队列中，稍后会由JVM 自动建立的、低优先级的 Finalizer 线程去执行（触发，并不会等其运行结束），这时进行第二次标记，仍然不可达，则会被真的回收。

**注意：**任何一个对象的 finalize() 方法只会被系统自动调用一次，如果第一次执行 finalize 方法此对象变成了可达确实不会回收，但如果对象再次被 GC，则会忽略 finalize 方法，对象会被回收！这一点切记!

那么这些 **GC Roots** 到底是什么东西呢，哪些对象可以作为 GC Root 呢，有以下几类

- 虚拟机栈（栈帧中的本地变量表）中引用的对象
- 方法区中类静态属性引用的对象
- 方法区中常量引用的对象
- 本地方法栈中 JNI（即一般说的 Native 方法）引用的对象

#### 虚拟机栈中引用的对象

如下代码所示，a 是栈帧中的本地变量，当 a = null 时，由于此时 a 充当了 **GC Root** 的作用，a 与原来指向的实例 **new Test()** 断开了连接，所以对象会被回收。

```java
public class Test {
  public static  void main(String[] args) {
    Test a = new Test();
    a = null;
  }
}
```

#### 方法区中类静态属性引用的对象

如下代码所示，当栈帧中的本地变量 a = null 时，由于 a 原来指向的对象与 GC Root (变量 a) 断开了连接，所以 a 原来指向的对象会被回收，而由于我们给 s 赋值了变量的引用，s 在此时是类静态属性引用，充当了 GC Root 的作用，它指向的对象依然存活!

```java
public class Test {
    public static Test s;
    public static  void main(String[] args) {
	  Test a = new Test();
	  a.s = new Test();
	  a = null;
  }
}
```

#### 方法区中常量引用的对象

如下代码所示，常量 s 指向的对象并不会因为 a 指向的对象被回收而回收

```java
public class Test {
	public static final Test s = new Test();
     public static void main(String[] args) {
	   Test a = new Test();
	   a = null;
  }
}
```

#### 本地方法栈中 JNI 引用的对象

所谓本地方法就是一个 Java 调用非 Java 代码的接口，该方法并非 Java 实现的，可能由 C 或 Python等其他语言实现的， Java 通过 JNI 来调用本地方法， 而本地方法是以库文件的形式存放的（在 WINDOWS 平台上是 DLL 文件形式，在 UNIX 机器上是 SO 文件形式）。通过调用本地的库文件的内部方法，使 JAVA 可以实现和本地机器的紧密联系，调用系统级的各接口方法。

当调用 Java 方法时，虚拟机会创建一个栈桢并压入 Java 栈，而当它调用的是本地方法时，虚拟机会保持 Java 栈不变，不会在 Java 栈祯中压入新的祯，虚拟机只是简单地动态连接并直接调用指定的本地方法。

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYdWhiZDlIQ0xCSVlSQmVrUXFpY3M3WEJyajB2VlVWU1BUSFRpYkpidXRyZEdSV2liMU1sRGQxNkpRLzY0MA?x-oss-process=image/format,png)

```java
JNIEXPORT void JNICALL Java_com_pecuyu_jnirefdemo_MainActivity_newStringNative(JNIEnv *env, jobject instance，jstring jmsg) {

		//...

   // 缓存String的class

   jclass jc = (*env)->FindClass(env, STRING_PATH);
}
```

如上代码所示，当 Java 调用以上本地方法时，jc 会被本地方法栈压入栈中, jc 就是我们说的本地方法栈中 JNI 的对象引用，因此只会在此本地方法执行完成后才会被释放。



### JDK8 之前的方法区回收

永久代的垃圾收集主要回收两部分内容：废弃常量和无用的类。

废弃常量：与堆中对象回收类似，以常量池中字面量的回收为例，例如资格字符串“abc”已经进入常量池，但没有任何一个 String 对象引用常量池中的"abc"常量，也没有其他地方引用了这个字面量，如果发生内存回收，且有必要的话，这个常量就会被系统清理出常量池。

无用类：

- 该类所有的实例都已经被回收（堆中不存在该类的任何实例）
- 加载该类的 ClassLoader 已经被回收
- 该类对应的 java.lang.Class 对象没有在任何地方被引用，无法在任何地方通过反射访问该类的方法。

虚拟机**可以**对满足以上 3 个条件的无用类进行回收，并不是一定会被回收。是否对类回收，HotSpot虚拟机提供了`-Xnoclassgc` 参数进行控制

------



## 垃圾收集算法

可以通过可达性算法来识别哪些数据是垃圾，那该怎么对这些垃圾进行回收呢。主要有以下几种方式

- 标记清除算法
- 复制算法
- 标记整理法
- 分代收集算法

### 标记清除算法

步骤很简单，和名字一样，分为“标记”和“清除”两个阶段

1. 先根据可达性算法**标记**出相应的可回收对象（图中黄色部分）

 

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYVWFrUFc2STJoMXhvUXBYTWV2VXpNMmVHd0cwaWE5WXJQTDFRQ0R2WGFXMW13YTNDcnZIZVJpYkEvNjQw?x-oss-process=image/format,png)

​    2.对可回收的对象进行回收操作起来确实很简单，也不用做移动数据的操作，那有啥问题呢？仔细看上图，没错，内存碎片！假如我们想在上图中的堆中分配一块需要**连续内存**占用 4M 或 5M 的区域，显然是会失败，怎么解决呢，如果能把上面未使用的 2M， 2M，1M 内存能连起来就能连成一片可用空间为 5M 的区域即可，怎么做呢?

### 复制算法

把堆等分成两块区域, A 和 B，区域 A 负责分配对象，区域 B 不分配, 对区域 A 使用以上所说的标记法把存活的对象标记出来，然后把区域 A 中存活的对象都复制到区域 B（存活对象都依次**紧邻排列**）最后把 A 区对象全部清理掉释放出空间，这样就解决了内存碎片的问题了。

![](/Users/starfish/Downloads/复制算法.png)

不过复制算法的缺点很明显，比如给堆分配了 500M 内存，结果只有 250M 可用，空间平白无故减少了一半！这肯定是不能接受的！另外每次回收也要把存活对象移动到另一半，效率低下（我们可以想想删除数组元素再把非删除的元素往一端移，效率显然堪忧）

### 标记整理法

前面两步和标记清除法一样，不同的是它在标记清除法的基础上添加了一个整理的过程 ，即将所有的存活对象都往一端移动,紧邻排列（如图示），再清理掉另一端的所有区域，这样的话就解决了内存碎片的问题。

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYUzM1aWN4MTltaWIzZFpDRW0zZk9kbHcyY2xZYldUSnRoVTVpYm45WnRjOGtRdWFvc3hPYWNoUVd3LzY0MA?x-oss-process=image/format,png)

但是缺点也很明显：每进一次垃圾清除都要频繁地移动存活的对象，效率十分低下。

### 分代收集算法

分代收集算法整合了以上算法，综合了这些算法的优点，最大程度避免了它们的缺点，所以是现代虚拟机采用的首选算法,与其说它是算法，倒不是说它是一种策略，因为它是把上述几种算法整合在了一起，为啥需要分代收集呢，来看一下对象的分配有啥规律

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2pwZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYRjFmRXJWTmlhTHJ3ZW5NdVJGcHhOTE03a0pVSkdocVlnMWljUnpiaEVXT3lwWmZpY3F5eUdiaWFIdy82NDA?x-oss-process=image/format,png)

*如图示：纵轴代表已分配的字节，而横轴代表程序运行时间*

由图可知，大部分的对象都很短命，都在很短的时间内都被回收了（IBM 专业研究表明，一般来说，98% 的对象都是朝生夕死的，经过一次 Minor GC 后就会被回收），所以分代收集算法根据**对象存活周期的不同**将堆分成新生代和老生代（Java8以前还有个永久代）,默认比例为 1 : 2，新生代又分为 Eden 区， from Survivor 区（简称S0），to Survivor 区(简称 S1),三者的比例为 8: 1 : 1，这样就可以根据新老生代的特点选择最合适的垃圾回收算法，我们把新生代发生的 GC 称为 Young GC（也叫 Minor GC）,老年代发生的 GC 称为 Old GC（也称为 Full GC）。

![img](https://tva1.sinaimg.cn/large/00831rSTly1gdc2yeeoz8j30aj04mglm.jpg)

*画外音：思考一下，新生代为啥要分这么多区？*

那么分代垃圾收集是怎么工作的呢，我们一起来看看

#### 分代收集工作原理

**1、对象在新生代的分配与回收**

由以上的分析可知，大部分对象在很短的时间内都会被回收，对象一般分配在 Eden 区

![img](https://tva1.sinaimg.cn/large/00831rSTly1gdc2y9r7vsj30qk07kgls.jpg)

当 Eden 区将满时，触发 Minor GC![img](https://tva1.sinaimg.cn/large/00831rSTly1gdc2ynwz4oj30q007wmxf.jpg)

我们之前怎么说来着，大部分对象在短时间内都会被回收, 所以经过 Minor GC 后只有少部分对象会存活，它们会被移到 S0 区（这就是为啥空间大小  Eden: S0: S1 = 8:1:1, Eden 区远大于 S0,S1 的原因，因为在 Eden 区触发的 Minor GC 把大部对象（接近98%）都回收了,只留下少量存活的对象，此时把它们移到 S0 或 S1 绰绰有余）同时对象年龄加一（对象的年龄即发生 Minor GC 的次数），最后把 Eden 区对象全部清理以释放出空间，如下

![img](https://tva1.sinaimg.cn/large/00831rSTly1gdc2z7ahusg30hr09l0v2.gif)

当触发下一次 Minor GC 时，会把 Eden 区的存活对象和 S0（或S1） 中的存活对象（S0 或 S1 中的存活对象经过每次 Minor GC 都可能被回收）一起移到 S1（Eden 和 S0 的存活对象年龄+1）, 同时清空 Eden 和 S0 的空间。![img](https://tva1.sinaimg.cn/large/00831rSTly1gdc2zeh8bvg30hq09h76r.gif)

若再触发下一次 Minor GC，则重复上一步，只不过此时变成了 从 Eden，S1 区将存活对象复制到 S0 区,每次垃圾回收, S0, S1 角色互换，都是从 Eden ,S0(或S1) 将存活对象移动到 S1(或S0)。也就是说在 Eden 区的垃圾回收我们采用的是**复制算法**，因为在 Eden 区分配的对象大部分在 Minor GC 后都消亡了，只剩下极少部分存活对象（这也是为啥 Eden:S0:S1 默认为 8:1:1 的原因），S0,S1 区域也比较小，所以最大限度地降低了复制算法造成的对象频繁拷贝带来的开销。

**2、对象何时晋升老年代**

- 当对象的年龄达到了我们设定的阈值，则会从S0（或S1）晋升到老年代![img](https://tva1.sinaimg.cn/large/00831rSTly1gdc2zt5evgg30hs0axgnj.gif)

  如图示：年龄阈值设置为 15（默认为15岁）， 当发生下一次 Minor GC 时，S0 中有个对象年龄达到 15，达到我们的设定阈值，晋升到老年代！

- 大对象，当某个对象分配需要大量的连续内存时，此时对象的创建不会分配在 Eden 区，会直接分配在老年代，因为如果把大对象分配在 Eden 区, Minor GC 后再移动到 S0,S1 会有很大的开销（对象比较大，复制会比较慢，也占空间），也很快会占满 S0,S1 区，所以干脆就直接移到老年代。最典型的大对象就是那种很长的字符串以及数组

- 还有一种情况也会让对象晋升到老年代，即在 S0（或S1） 区相同年龄的对象大小之和大于 S0（或S1）空间一半以上时，则年龄大于等于该年龄的对象也会晋升到老年代。

**3、空间分配担保**

在发生 MinorGC 之前，虚拟机会先检查老年代最大可用的连续空间是否大于新生代所有对象的总空间，如果大于，那么Minor GC 可以确保是安全的，如果不大于，那么虚拟机会查看 HandlePromotionFailure 设置值是否允许担保失败。如果允许，那么会继续检查老年代最大可用连续空间是否大于历次晋升到老年代对象的平均大小，如果大于则进行 Minor GC，否则可能进行一次 Full GC。

**4、Stop The World**

如果老年代满了，会触发 Full GC, Full GC 会同时回收新生代和老年代（即对整个堆进行GC），它会导致 Stop The World（简称 STW）,造成挺大的性能开销。

什么是 STW ？所谓的 STW, 即在 GC（minor GC 或 Full GC）期间，只有垃圾回收器线程在工作，其他工作线程则被挂起。

![img](https://tva1.sinaimg.cn/large/00831rSTly1gdc2zzpdzfj30tk0go3zo.jpg)

*画外音：为啥在垃圾收集期间其他工作线程会被挂起？想象一下，你一边在收垃圾，另外一群人一边丢垃圾，垃圾能收拾干净吗。*

一般 Full GC 会导致工作线程停顿时间过长（因为Full GC 会清理**整个堆**中的不可用对象，一般要花较长的时间），如果在此 server 收到了很多请求，则会被拒绝服务！所以我们要尽量减少 Full GC（Minor GC 也会造成 STW，但只会触发轻微的 STW，因为 Eden 区的对象大部分都被回收了，只有极少数存活对象会通过复制算法转移到 S0 或 S1 区，所以相对还好）。

现在我们应该明白把新生代设置成 Eden, S0，S1区或者给对象设置年龄阈值或者默认把新生代与老年代的空间大小设置成 1:2 都是为了**尽可能地避免对象过早地进入老年代，尽可能晚地触发 Full GC**。想想新生代如果只设置 Eden 会发生什么，后果就是每经过一次 Minor GC，存活对象会过早地进入老年代，那么老年代很快就会装满，很快会触发 Full GC，而对象其实在经过两三次的 Minor GC 后大部分都会消亡，所以有了 S0,S1的缓冲，只有少数的对象会进入老年代，老年代大小也就不会这么快地增长，也就避免了过早地触发 Full GC。

由于 Full GC（或Minor GC） 会影响性能，所以我们要在一个合适的时间点发起 GC，这个时间点被称为 **Safe Point（安全点）**，这个时间点的选定既不能太少以让 GC 时间太长导致程序过长时间卡顿，也不能过于频繁以至于过分增大运行时的负荷。一般当线程在这个时间点上状态是可以确定的，如确定 GC Root 的信息等，可以使 JVM 开始安全地 GC。Safe Point 主要指的是以下特定位置：

- 循环的末尾
- 方法返回前
- 调用方法的 call 之后
- 抛出异常的位置 另外需要注意的是由于新生代的特点（大部分对象经过 Minor GC后会消亡）， Minor GC 用的是复制算法，而在老生代由于对象比较多，占用的空间较大，使用复制算法会有较大开销（复制算法在对象存活率较高时要进行多次复制操作，同时浪费一半空间）所以根据老生代特点，在老年代进行的 GC 一般采用的是标记整理法来进行回收。

------



## 垃圾收集器种类

如果说收集算法是内存回收的方法论，那么垃圾收集器就是内存回收的具体实现。Java 虚拟机规范并没有规定垃圾收集器应该如何实现，因此一般来说不同厂商，不同版本的虚拟机提供的垃圾收集器实现可能会有差别，一般会给出参数来让用户根据应用的特点来组合各个年代使用的收集器，主要有以下垃圾收集器

![img](https://tva1.sinaimg.cn/large/00831rSTly1gdc303ew8zj30py0mojsm.jpg)

- 在新生代工作的垃圾回收器：Serial, ParNew, ParallelScavenge
- 在老年代工作的垃圾回收器：CMS，Serial Old(MSC), Parallel Old
- 同时在新老生代工作的垃圾回收器：G1

图片中的垃圾收集器如果存在连线，则代表它们之间可以配合使用，接下来我们来看看各个垃圾收集器的具体功能。

### 新生代收集器

#### Serial 收集器

Serial 收集器是工作在新生代的，单线程的垃圾收集器，单线程意味着它只会使用一个 CPU 或一个收集线程来完成垃圾回收，不仅如此，还记得我们上文提到的 Stop The World 吗，它在进行垃圾收集时，其他用户线程会暂停，直到垃圾收集结束，也就是说在 GC 期间，此时的应用不可用。

看起来单线程垃圾收集器不太实用，不过我们需要知道的任何技术的使用都不能脱离场景，在 **Client 模式**下，它简单有效（与其他收集器的单线程比），对于限定单个 CPU 的环境来说，Serial 单线程模式无需与其他线程交互，减少了开销，专心做 GC 能将其单线程的优势发挥到极致，另外在用户的桌面应用场景，分配给虚拟机的内存一般不会很大，收集几十甚至一两百兆（仅是新生代的内存，桌面应用基本不会再大了），STW 时间可以控制在一百多毫秒内，只要不是频繁发生，这点停顿是可以接受的，所以对于运行在 Client 模式下的虚拟机，Serial 收集器是新生代的默认收集器

#### ParNew 收集器

ParNew 收集器是 Serial 收集器的多线程版本，除了使用多线程，其他像收集算法、STW、对象分配规则、回收策略与 Serial 收集器完成一样，在底层上，这两种收集器也共用了相当多的代码，它的垃圾收集过程如下![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYYUNIUWxRNTRtR2ptSjVhYzRENzAwWDhuRkJjTXFwYXlqR1dkcmRoTmNNUFk4OU5acFB2TFNBLzY0MA?x-oss-process=image/format,png)

ParNew 主要工作在 Server 模式，我们知道服务端如果接收的请求多了，响应时间就很重要了，多线程可以让垃圾回收得更快，也就是减少了 STW 时间，能提升响应时间，所以是许多运行在 Server 模式下的虚拟机的首选新生代收集器，另一个与性能无关的原因是因为除了 Serial  收集器，**只有它能与 CMS 收集器配合工作**，CMS 是一个划时代的垃圾收集器，是真正意义上的**并发收集器**，它第一次实现了垃圾收集线程与用户线程（基本上）同时工作，它采用的是传统的 GC 收集器代码框架，与 Serial，ParNew 共用一套代码框架，所以能与这两者一起配合工作，而后文提到的 Parallel Scavenge 与 G1 收集器没有使用传统的 GC 收集器代码框架，而是另起炉灶独立实现的，另外一些收集器则只是共用了部分的框架代码，所以无法与 CMS 收集器一起配合工作。

在多 CPU 的情况下，由于 ParNew 的多线程回收特性，毫无疑问垃圾收集会更快，也能有效地减少 STW 的时间，提升应用的响应速度。

#### Parallel Scavenge 收集器

Parallel Scavenge 收集器也是一个使用**复制算法**，**多线程**，工作于新生代的垃圾收集器，看起来功能和 ParNew 收集器一样，它有啥特别之处吗

**关注点不同**，CMS 等垃圾收集器关注的是尽可能缩短垃圾收集时用户线程的停顿时间，而 Parallel Scavenge 目标是达到一个可控制的吞吐量（吞吐量 = 运行用户代码时间 / （运行用户代码时间+垃圾收集时间）），也就是说 CMS 等垃圾收集器更适合用到与用户交互的程序，因为停顿时间越短，用户体验越好，而 Parallel Scavenge 收集器关注的是吞吐量，所以更适合做后台运算等不需要太多用户交互的任务。

Parallel Scavenge 收集器提供了两个参数来精确控制吞吐量，分别是控制最大垃圾收集时间的`-XX:MaxGCPauseMillis` 参数及直接设置吞吐量大小的 `-XX:GCTimeRatio`（默认99%）

除了以上两个参数，还可以用 Parallel Scavenge 收集器提供的第三个参数 `-XX:UseAdaptiveSizePolicy`，开启这个参数后，就不需要手工指定新生代大小，Eden 与 Survivor 比例（SurvivorRatio）等细节，只需要设置好基本的堆大小（-Xmx 设置最大堆）,以及最大垃圾收集时间与吞吐量大小，虚拟机就会根据当前系统运行情况收集监控信息，动态调整这些参数以尽可能地达到我们设定的最大垃圾收集时间或吞吐量大小这两个指标。**自适应策略**也是 Parallel Scavenge  与 ParNew 的重要区别！

### 老年代收集器

#### Serial Old 收集器

Serial 收集器是工作于新生代的单线程收集器，与之相对地，Serial Old 是工作于老年代的单线程收集器，此收集器的主要意义在于给 Client 模式下的虚拟机使用，如果在 Server 模式下，则它还有两大用途：一种是在 JDK 1.5 及之前的版本中与 Parallel Scavenge 配合使用，另一种是作为 CMS 收集器的后备预案,在并发收集发生 Concurrent Mode Failure 时使用，它与 Serial 收集器配合使用示意图如下

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYWHNFaEpMN29haFo5SmpLdzdFS0oxcnIxaWM2ZlBUckV6TGlhOEVkZTRUMnVxWmRPVWVxcmYwbncvNjQw?x-oss-process=image/format,png)

#### Parallel Old 收集器

Parallel Old 是相对于 Parallel Scavenge 收集器的老年代版本，使用多线程和标记整理算法，两者组合示意图如下，这两者的组合由于都是多线程收集器，真正实现了「吞吐量优先」的目标

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYeU0zWU8zazZhd29Nd2trWkxUNkNTQm51d2FZdHJCT2xhcUJ6a2JhczRKZjVPR29sU2g1bElnLzY0MA?x-oss-process=image/format,png)

#### CMS 收集器

CMS（Concurrent Mark Sweep） 收集器是以实现最短 STW 时间为目标的收集器，如果应用很重视服务的响应速度，希望给用户最好的体验，则 CMS 收集器是个很不错的选择！

我们之前说老年代主要用标记整理法，而 CMS 虽然工作于老年代，但采用的是**标记清除算法**，主要有以下四个步骤

1. 初始标记
2. 并发标记
3. 重新标记
4. 并发清除

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYQmswSGRhQTR4MUZxa29iS1J4ZEVyaWJSTVFuODZ6RHQ5RnBjZU8xaWNtTHdkNm9pY2hTams0aWJaUS82NDA?x-oss-process=image/format,png)

从图中可以的看到初始标记和重新标记两个阶段会发生 STW，造成用户线程挂起，不过初始标记仅标记 GC Roots 能关联的对象，速度很快，并发标记是进行 GC Roots  Tracing 的过程，重新标记是为了修正并发标记期间因用户线程继续运行而导致标记产生变动的那一部分对象的标记记录，这一阶段停顿时间一般比初始标记阶段稍长，但**远比并发标记时间短**。

整个过程中耗时最长的是并发标记和标记清理，不过这两个阶段用户线程都可工作，所以不影响应用的正常使用，所以总体上看，可以认为 CMS 收集器的内存回收过程是与用户线程一起并发执行的。

但是 CMS 收集器远达不到完美的程度，主要有以下三个缺点

- CMS 收集器对 CPU 资源非常敏感 。原因也可以理解，比如本来我本来可以有 10 个用户线程处理请求，现在却要分出 3 个作为回收线程，吞吐量下降了30%，CMS 默认启动的回收线程数是 （CPU数量+3）/ 4，如果 CPU 数量只有一两个，那吞吐量就直接下降 50%，显然是不可接受的
- CMS 无法处理浮动垃圾（Floating Garbage）,可能出现 「Concurrent Mode Failure」而导致另一次 Full GC 的产生，由于在并发清理阶段用户线程还在运行，所以清理的同时新的垃圾也在不断出现，这部分垃圾只能在下一次 GC 时再清理掉（即浮云垃圾），同时在垃圾收集阶段用户线程也要继续运行，就需要预留足够多的空间要确保用户线程正常执行，这就意味着 CMS 收集器不能像其他收集器一样等老年代满了再使用，JDK 1.5 默认当老年代使用了68%空间后就会被激活，当然这个比例可以通过 -XX:CMSInitiatingOccupancyFraction 来设置，但是如果设置地太高很容易导致在 CMS 运行期间预留的内存无法满足程序要求，会导致 **Concurrent Mode Failure** 失败，这时会启用 Serial Old 收集器来重新进行老年代的收集，而我们知道 Serial Old 收集器是单线程收集器，这样就会导致 STW 更长了。
- CMS 采用的是标记清除法，上文我们已经提到这种方法会产生大量的内存碎片，这样会给大内存分配带来很大的麻烦，如果无法找到足够大的连续空间来分配对象，将会触发 Full GC，这会影响应用的性能。当然我们可以开启 -XX:+UseCMSCompactAtFullCollection（默认是开启的），用于在 CMS 收集器顶不住要进行 FullGC 时开启内存碎片的合并整理过程，内存整理会导致 STW，停顿时间会变长，还可以用另一个参数 -XX:CMSFullGCsBeforeCompation 用来设置执行多少次不压缩的 Full GC 后跟着带来一次带压缩的。

#### G1（Garbage First） 收集器

G1 收集器是面向服务端的垃圾收集器，被称为驾驭一切的垃圾回收器，主要有以下几个特点

- 像 CMS 收集器一样，能与应用程序线程并发执行。

- 整理空闲空间更快。

- 需要 GC 停顿时间更好预测。

- 不会像 CMS 那样牺牲大量的吞吐性能。

- 不需要更大的 Java Heap

   


与 CMS 相比，它在以下两个方面表现更出色

1. 运作期间不会产生内存碎片，G1 从整体上看采用的是标记-整理法，局部（两个 Region）上看是基于复制算法实现的，两个算法都不会产生内存碎片，收集后提供规整的可用内存，这样有利于程序的长时间运行。
2. 在 STW 上建立了**可预测**的停顿时间模型，用户可以指定期望停顿时间，G1 会将停顿时间控制在用户设定的停顿时间以内。

为什么G1能建立可预测的停顿模型呢，主要原因在于 G1 对堆空间的分配与传统的垃圾收集器不一器，传统的内存分配就像我们前文所述，是连续的，分成新生代，老年代，新生代又分 Eden,S0,S1,如下

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYdW5xUk11aHE2RlpiY0tpY05pYmN2S21lVHdpYzA1b3Jkb1oyd2dXNGhINUt0TWxLdThEdlFpYkU1dy82NDA?x-oss-process=image/format,png)

而 G1 各代的存储地址不是连续的，每一代都使用了 n 个不连续的大小相同的 Region，每个Region占有一块连续的虚拟内存地址，如图示

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYN2VZbmliVUZIdW83QWliWnlMc2FIcTZ0V3BXbndMTzNqajFyazNtVGhyQVBTc2RtVk1yZ3psTFEvNjQw?x-oss-process=image/format,png)

除了和传统的新老生代，幸存区的空间区别，Region还多了一个H，它代表Humongous，这表示这些Region存储的是巨大对象（humongous object，H-obj），即大小大于等于region一半的对象，这样超大对象就直接分配到了老年代，防止了反复拷贝移动。那么 G1 分配成这样有啥好处呢？

传统的收集器如果发生 Full GC 是对整个堆进行全区域的垃圾收集，而分配成各个 Region 的话，方便 G1 跟踪各个 Region 里垃圾堆积的价值大小（回收所获得的空间大小及回收所需经验值），这样根据价值大小维护一个优先列表，根据允许的收集时间，优先收集回收价值最大的 Region，也就避免了整个老年代的回收，也就减少了 STW 造成的停顿时间。同时由于只收集部分 Region，也就做到了 STW 时间的可控。

G1 收集器的工作步骤如下

1. 初始标记
2. 并发标记
3. 最终标记
4. 筛选回收

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9PeXdleXNDU2VMVXJZcVBpY2pWd2p1TUNoUHJQaWNOSGRYOFMwOHJEUlZsaWFWVzg0aWJDTTlrekN0SXhDSVlxRkdHYmlhZDZWUEJWOXFTWkVxT0p0VHV5eWljUS82NDA?x-oss-process=image/format,png)

可以看到整体过程与 CMS 收集器非常类似，筛选阶段会根据各个 Region 的回收价值和成本进行排序，根据用户期望的 GC 停顿时间来制定回收计划。



## GC 日志



## 内存分配和回收策略

Java 技术体系所提倡的自动内存管理最终可以归结为自动化的解决两个问题

- 给对象分配内存
- 回收分配给对象的内存

回收内存上边已经介绍了很多了，而对象的内存分配，往大方向上讲，就是在堆上分配，对象主要分配在新生代的 Eden 区上，如果启动了本地线程分配缓冲，将按线程优先在 TLAB 上分配。少数情况可能直接分配在老年代，分配的规则取决于使用哪种垃圾收集器。

## 总结

本文简述了垃圾回收的原理与垃圾收集器的种类，相信大家对开头提的一些问题应该有了更深刻的认识，在生产环境中我们要根据**不同的场景**来选择垃圾收集器组合，如果是运行在桌面环境处于 Client 模式的，则用 Serial + Serial Old 收集器绰绰有余，如果需要响应时间快，用户体验好的，则用 ParNew + CMS 的搭配模式，即使是号称是「驾驭一切」的 G1，也需要根据吞吐量等要求适当调整相应的 JVM 参数，没有最牛的技术，只有最合适的使用场景，切记！



 

## 参考

堆外内存的回收机制分析 https://www.jianshu.com/p/35cf0f348275 

java调用本地方法--jni简介 https://blog.csdn.net/w1992wishes/article/details/80283403 

咱们从头到尾说一次 Java 垃圾回收 https://mp.weixin.qq.com/s/pR7U1OTwsNSg5fRyWafucA 

深入理解 Java 虚拟机 

Java Hotspot G1 GC的一些关键技术 https://tech.meituan.com/2016/09/23/g1.html