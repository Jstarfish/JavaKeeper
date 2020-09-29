请谈谈你对 OOM 的认识？

GC 垃圾回收算法和垃圾收集器的关系？分别是什么请你谈谈？

怎么查看服务器默认的垃圾收集器是哪个？生产上如何配置垃圾收集器的？谈谈你对垃圾收集器的理解？

G1 垃圾收集器？

生产环境服务器变慢，诊断思路和性能评估谈谈？

假如生产环境出现 CPU 占用过高，请谈谈你的分析思路和定位





## 类加载子系统

### 类加载机制？类加载过程

Java 虚拟机把描述类的数据从 Class 文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型，这就是虚拟机的加载机制

类从被加载到虚拟机内存中开始，到卸载出内存为止，它的整个生命周期包括：**加载、验证、准备、解析、初始化、使用和卸载**七个阶段。(验证、准备和解析又统称为连接，为了支持Java语言的**运行时绑定**，所以**解析阶段也可以是在初始化之后进行的**。以上顺序都只是说开始的顺序，实际过程中是交叉的混合式进行的，加载过程中可能就已经开始验证了)

### 什么是类加载器，类加载器有哪些？这些类加载器都加载哪些文件？

#### 启动类加载器（引导类加载器，Bootstrap ClassLoader）

- 这个类加载使用 C/C++ 语言实现，嵌套在 JVM 内部
- 它用来加载 Java 的核心库（`JAVA_HOME/jre/lib/rt.jar`、`resource.jar`或`sun.boot.class.path`路径下的内容），用于提供 JVM 自身需要的类
- 并不继承自 `java.lang.ClassLoader`，没有父加载器
- 加载扩展类和应用程序类加载器，并指定为他们的父类加载器
- 出于安全考虑，Bootstrap 启动类加载器只加载名为java、Javax、sun等开头的类

#### 扩展类加载器（Extension ClassLoader）

- Java 语言编写，由`sun.misc.Launcher$ExtClassLoader`实现
- 派生于 ClassLoader
- 父类加载器为启动类加载器
- 从 `java.ext.dirs` 系统属性所指定的目录中加载类库，或从 JDK 的安装目录的`jre/lib/ext` 子目录（扩展目录）下加载类库。如果用户创建的 JAR 放在此目录下，也会自动由扩展类加载器加载

#### 应用程序类加载器（也叫系统类加载器，AppClassLoader）

- Java 语言编写，由 `sun.misc.Lanucher$AppClassLoader` 实现
- 派生于 ClassLoader
- 父类加载器为扩展类加载器
- 它负责加载环境变量`classpath`或系统属性` java.class.path` 指定路径下的类库
- 该类加载是**程序中默认的类加载器**，一般来说，Java 应用的类都是由它来完成加载的
- 通过 `ClassLoader#getSystemClassLoader()` 方法可以获取到该类加载器

#### 用户自定义类加载器

在 Java 的日常应用程序开发中，类的加载几乎是由 3 种类加载器相互配合执行的，在必要时，我们还可以自定义类加载器，来定制类的加载方式

##### 为什么要自定义类加载器？

- 隔离加载类
- 修改类加载的方式
- 扩展加载源（可以从数据库、云端等指定来源加载类）
- 防止源码泄露（Java 代码容易被反编译，如果加密后，自定义加载器加载类的时候就可以先解密，再加载）



### 多线程的情况下，类的加载为什么不会出现重复加载的情况？

双亲委派

### 什么是双亲委派机制？它有啥优势？可以打破这种机制吗？

Java 虚拟机对 class 文件采用的是**按需加载**的方式，也就是说当需要使用该类的时候才会将它的 class 文件加载到内存生成 class 对象。而且加载某个类的 class 文件时，Java 虚拟机采用的是双亲委派模式，即把请求交给父类处理，它是一种任务委派模式。

**工作过程**

- 如果一个类加载器收到了类加载请求，它并不会自己先去加载，而是把这个请求委托给父类的加载器去执行；
- 如果父类加载器还存在其父类加载器，则进一步向上委托，依次递归，请求最终将到达顶层的启动类加载器；
- 如果父类加载器可以完成类加载任务，就成功返回，倘若父类加载器无法完成此加载任务，子加载器才会尝试自己去加载，这就是双亲委派模式

**优势**

- 避免类的重复加载，JVM 中区分不同类，不仅仅是根据类名，相同的 class 文件被不同的 ClassLoader 加载就属于两个不同的类（比如，Java中的Object类，无论哪一个类加载器要加载这个类，最终都是委派给处于模型最顶端的启动类加载器进行加载，如果不采用双亲委派模型，由各个类加载器自己去加载的话，系统中会存在多种不同的 Object 类）
- 保护程序安全，防止核心 API 被随意篡改，避免用户自己编写的类动态替换 Java 的一些核心类，比如我们自定义类：`java.lang.String`

### 自定义了一个String，那么会加载哪个String？

针对java.*开头的类，jvm的实现中已经保证了必须由bootstrp来加载



### 简单说说你了解的类加载器，可以打破双亲委派么，怎么打破。

**思路：** 先说明一下什么是类加载器，可以给面试官画个图，再说一下类加载器存在的意义，说一下双亲委派模型，最后阐述怎么打破双亲委派模型。

**我的答案：**

#### 1) 什么是类加载器？

**类加载器** 就是根据指定全限定名称将class文件加载到JVM内存，转为Class对象。

> - 启动类加载器（Bootstrap  ClassLoader）：由C++语言实现（针对HotSpot）,负责将存放在<JAVA_HOME>\lib目录或-Xbootclasspath参数指定的路径中的类库加载到内存中。
> - 其他类加载器：由Java语言实现，继承自抽象类ClassLoader。如：
>
> > - 扩展类加载器（Extension ClassLoader）：负责加载<JAVA_HOME>\lib\ext目录或java.ext.dirs系统变量指定的路径中的所有类库。
> > - 应用程序类加载器（Application ClassLoader）。负责加载用户类路径（classpath）上的指定类库，我们可以直接使用这个类加载器。一般情况，如果我们没有自定义类加载器默认就是用这个加载器。

#### 2）双亲委派模型

**双亲委派模型工作过程是：**

> 如果一个类加载器收到类加载的请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器完成。每个类加载器都是如此，只有当父加载器在自己的搜索范围内找不到指定的类时（即ClassNotFoundException），子加载器才会尝试自己去加载。

双亲委派模型图：



![img](https://user-gold-cdn.xitu.io/2019/7/23/16c1c54cf4ad886b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



#### 3）为什么需要双亲委派模型？

在这里，先想一下，如果没有双亲委派，那么用户是不是可以**自己定义一个java.lang.Object的同名类**，**java.lang.String的同名类**，并把它放到ClassPath中,那么**类之间的比较结果及类的唯一性将无法保证**，因此，为什么需要双亲委派模型？**防止内存中出现多份同样的字节码**

#### 4）怎么打破双亲委派模型？

打破双亲委派机制则不仅**要继承ClassLoader**类，还要**重写loadClass和findClass**方法。



------

------



## 内存管理

### Java内存结构？

![](https://user-gold-cdn.xitu.io/2019/7/8/16bd08c33a3d751b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

方法区和堆是所有线程共享的内存区域；而Java栈、本地方法栈和程序计数器是线程私有的内存区域。

- Java堆是Java虚拟机所管理的内存中最大的一块。Java堆是被所有线程共享的一块内存区域，在虚拟机启动时创建。此内存区域的唯一目的就是存放对象实例，几乎所有的对象实例都在这里分配内存。
- 方法区用于存储已被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据。
- 程序计数器（Program Counter Register）是一块较小的内存空间，它的作用可以看做是当前线程所执行的字节码的行号指示器。
- JVM栈（JVM Stacks）,与程序计数器一样，也是线程私有的，它的生命周期与线程相同。虚拟机栈描述的是Java方法执行的内存模型：每个方法被执行的时候都会同时创建一个栈帧（Stack Frame）用于存储局部变量表、操作栈、动态链接、方法出口等信息。每一个方法被调用直至执行完成的过程，就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程。
- 本地方法栈（Native Method Stacks）与虚拟机栈所发挥的作用是非常相似的，其区别不过是虚拟机栈为虚拟机执行Java方法（也就是字节码）服务，而本地方法栈则是为虚拟机使用到的Native方法服务。




### 内存泄露和内存溢出的区别？

内存溢出 out of memory，是指程序在申请内存时，没有足够的内存空间供其使用，出现out of memory；比如申请了一个integer,但给它存了long才能存下的数，那就是内存溢出。

内存泄露 memory leak，是指程序在申请内存后，无法释放已申请的内存空间，一次内存泄露危害可以忽略，但内存泄露堆积后果很严重，无论多少内存,迟早会被占光。

memory leak会最终会导致out of memory！



### 什么情况下会发生栈内存溢出?

- 栈是线程私有的，他的生命周期与线程相同，每个方法在执行的时候都会创建一个栈帧，用来存储局部变量表，操作数栈，动态链接，方法出口等信息。局部变量表又包含基本数据类型，对象引用类型
- 如果线程请求的栈深度大于虚拟机所允许的最大深度，将抛出StackOverflowError异常，方法递归调用产生这种结果。
- 如果Java虚拟机栈可以动态扩展，并且扩展的动作已经尝试过，但是无法申请到足够的内存去完成扩展，或者在新建立线程的时候没有足够的内存去创建对应的虚拟机栈，那么Java虚拟机将抛出一个OutOfMemory 异常。(线程启动过多)
- 参数 -Xss 去调整JVM栈的大小



### JVM内存为什么要分成新生代，老年代，持久代。新生代中为什么要分为Eden和Survivor。

#### 1）共享内存区划分

- 共享内存区 = 持久带 + 堆
- 持久带 = 方法区 + 其他
- Java堆 = 老年代 + 新生代
- 新生代 = Eden + S0 + S1

#### 2）一些参数的配置

- 默认的，新生代 ( Young ) 与老年代 ( Old ) 的比例的值为 1:2 ，可以通过参数 –XX:NewRatio 配置。
- 默认的，Edem : from : to = 8 : 1 : 1 ( 可以通过参数 –XX:SurvivorRatio 来设定)
- Survivor区中的对象被复制次数为15(对应虚拟机参数 -XX:+MaxTenuringThreshold)

#### 3)为什么要分为Eden和Survivor?为什么要设置两个Survivor区？

- 如果没有Survivor，Eden区每进行一次Minor GC，存活的对象就会被送到老年代。老年代很快被填满，触发Major GC.老年代的内存空间远大于新生代，进行一次Full GC消耗的时间比Minor GC长得多,所以需要分为Eden和Survivor。
- Survivor的存在意义，就是减少被送到老年代的对象，进而减少Full GC的发生，Survivor的预筛选保证，只有经历16次Minor GC还能在新生代中存活的对象，才会被送到老年代。
- 设置两个Survivor区最大的好处就是解决了碎片化，刚刚新建的对象在Eden中，经历一次Minor GC，Eden中的存活对象就会被移动到第一块survivor space S0，Eden被清空；等Eden区再满了，就再触发一次Minor GC，Eden和S0中的存活对象又会被复制送入第二块survivor space S1（这个过程非常重要，因为这种复制算法保证了S1中来自S0和Eden两部分的存活对象占用连续的内存空间，避免了碎片化的发生）

------



## GC

### 1. JVM 垃圾回收的时候如何确定垃圾？ 你知道什么是 GC Roots 吗？GC Roots 如何确定，那些对象可以作为 GC Roots?

内存中不再使用的空间就是垃圾

引用计数法和可达性分析

![](https://tva1.sinaimg.cn/large/00831rSTly1gdeam8z27oj31e60mudzv.jpg)

![](https://tva1.sinaimg.cn/large/00831rSTly1gdeaofj7tsj31cs0nstsz.jpg)

哪些对象可以作为 GC Root 呢，有以下几类

- 虚拟机栈（栈帧中的本地变量表）中引用的对象
- 方法区中类静态属性引用的对象
- 方法区中常量引用的对象
- 本地方法栈中 JNI（即一般说的 Native 方法）引用的对象



### JVM中一次完整的GC流程是怎样的，对象如何晋升到老年代

**思路：** 先描述一下Java堆内存划分，再解释Minor GC，Major GC，full GC，描述它们之间转化流程。

**我的答案：**

- Java堆 = 老年代 + 新生代
- 新生代 = Eden + S0 + S1
- 当 Eden 区的空间满了， Java虚拟机会触发一次 Minor GC，以收集新生代的垃圾，存活下来的对象，则会转移到 Survivor区。
- **大对象**（需要大量连续内存空间的Java对象，如那种很长的字符串）**直接进入老年态**；
- 如果对象在Eden出生，并经过第一次Minor GC后仍然存活，并且被Survivor容纳的话，年龄设为1，每熬过一次Minor GC，年龄+1，**若年龄超过一定限制（15），则被晋升到老年态**。即**长期存活的对象进入老年态**。
- 老年代满了而**无法容纳更多的对象**，Minor GC 之后通常就会进行Full GC，Full GC  清理整个内存堆 – **包括年轻代和年老代**。
- Major GC **发生在老年代的GC**，**清理老年区**，经常会伴随至少一次Minor GC，**比Minor GC慢10倍以上**。



### 你知道哪几种垃圾收集器，各自的优缺点，重点讲下cms和G1，包括原理，流程，优缺点。

**思路：** 一定要记住典型的垃圾收集器，尤其cms和G1，它们的原理与区别，涉及的垃圾回收算法。

**我的答案：**

#### 1）几种垃圾收集器：

- **Serial收集器：** 单线程的收集器，收集垃圾时，必须stop the world，使用复制算法。
- **ParNew收集器：**  Serial收集器的多线程版本，也需要stop the world，复制算法。
- **Parallel Scavenge收集器：** 新生代收集器，复制算法的收集器，并发的多线程收集器，目标是达到一个可控的吞吐量。如果虚拟机总共运行100分钟，其中垃圾花掉1分钟，吞吐量就是99%。
- **Serial Old收集器：** 是Serial收集器的老年代版本，单线程收集器，使用标记整理算法。
- **Parallel Old收集器：** 是Parallel Scavenge收集器的老年代版本，使用多线程，标记-整理算法。
- **CMS(Concurrent Mark Sweep) 收集器：** 是一种以获得最短回收停顿时间为目标的收集器，**标记清除算法，运作过程：初始标记，并发标记，重新标记，并发清除**，收集结束会产生大量空间碎片。
- **G1收集器：** 标记整理算法实现，**运作流程主要包括以下：初始标记，并发标记，最终标记，筛选标记**。不会产生空间碎片，可以精确地控制停顿。

#### 2）CMS收集器和G1收集器的区别：

- CMS收集器是老年代的收集器，可以配合新生代的Serial和ParNew收集器一起使用；
- G1收集器收集范围是老年代和新生代，不需要结合其他收集器使用；
- CMS收集器以最小的停顿时间为目标的收集器；
- G1收集器可预测垃圾回收的停顿时间
- CMS收集器是使用“标记-清除”算法进行的垃圾回收，容易产生内存碎片
- G1收集器使用的是“标记-整理”算法，进行了空间整合，降低了内存空间碎片。



### 





### 说说你知道的几种主要的JVM参数

**思路：** 可以说一下堆栈配置相关的，垃圾收集器相关的，还有一下辅助信息相关的。

**我的答案：**

#### 1）堆栈配置相关

```
java -Xmx3550m -Xms3550m -Xmn2g -Xss128k 
-XX:MaxPermSize=16m -XX:NewRatio=4 -XX:SurvivorRatio=4 -XX:MaxTenuringThreshold=0
复制代码
```

**-Xmx3550m：** 最大堆大小为3550m。

**-Xms3550m：** 设置初始堆大小为3550m。

**-Xmn2g：** 设置年轻代大小为2g。

**-Xss128k：** 每个线程的堆栈大小为128k。

**-XX:MaxPermSize：**  设置持久代大小为16m

**-XX:NewRatio=4:** 设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。

**-XX:SurvivorRatio=4：** 设置年轻代中Eden区与Survivor区的大小比值。设置为4，则两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6

**-XX:MaxTenuringThreshold=0：** 设置垃圾最大年龄。如果设置为0的话，则年轻代对象不经过Survivor区，直接进入年老代。

#### 2）垃圾收集器相关

```
-XX:+UseParallelGC
-XX:ParallelGCThreads=20
-XX:+UseConcMarkSweepGC 
-XX:CMSFullGCsBeforeCompaction=5
-XX:+UseCMSCompactAtFullCollection：
复制代码
```

**-XX:+UseParallelGC：** 选择垃圾收集器为并行收集器。

**-XX:ParallelGCThreads=20：** 配置并行收集器的线程数

**-XX:+UseConcMarkSweepGC：** 设置年老代为并发收集。

**-XX:CMSFullGCsBeforeCompaction**：由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理。

**-XX:+UseCMSCompactAtFullCollection：** 打开对年老代的压缩。可能会影响性能，但是可以消除碎片

#### 3）辅助信息相关

```
-XX:+PrintGC
-XX:+PrintGCDetails
复制代码
```

**-XX:+PrintGC 输出形式:**

[GC 118250K->113543K(130112K), 0.0094143 secs] [Full GC 121376K->10414K(130112K), 0.0650971 secs]

**-XX:+PrintGCDetails 输出形式:**

[GC [DefNew: 8614K->781K(9088K), 0.0123035 secs] 118250K->113543K(130112K), 0.0124633 secs] [GC [DefNew: 8614K->8614K(9088K), 0.0000665 secs][Tenured: 112761K->10414K(121024K), 0.0433488 secs] 121376K->10414K(130112K), 0.0436268 secs



### 怎么打出线程栈信息。

**思路：** 可以说一下jps，top ，jstack这几个命令，再配合一次排查线上问题进行解答。

**我的答案：**

- 输入jps，获得进程号。
- top -Hp pid 获取本进程中所有线程的CPU耗时性能
- jstack pid命令查看当前java进程的堆栈状态
- 或者 jstack -l  > /tmp/output.txt 把堆栈信息打到一个txt文件。
- 可以使用fastthread 堆栈定位，[fastthread.io/](http://fastthread.io/)













![](https://tva1.sinaimg.cn/large/00831rSTly1gdeadup0v1j30xk0lgncn.jpg)



![](https://tva1.sinaimg.cn/large/00831rSTly1gdeambp5abj31ew0pm16q.jpg)





------







## 调优

## 2.你说你做过 JVM 调优和参数配置，请问如何盘点查看 JVM 系统默认值

### JVM参数类型

- 标配参数

  - -version   (java -version) 
  - -help       (java -help)
  - java -showversion

- X 参数（了解）

  - -Xint 解释执行

  - -Xcomp 第一次使用就编译成本地代码

  - -Xmixed 混合模式

    ![](https://tva1.sinaimg.cn/large/00831rSTly1gdeb84yh71j30yq0j6akl.jpg)

- xx参数

  - Boolean 类型

    - 公式： -xx:+ 或者 - 某个属性值（+表示开启，- 表示关闭）

    - Case

      - 是否打印GC收集细节

        - -XX:+PrintGCDetails 
        - -XX:- PrintGCDetails 

        ![](https://tva1.sinaimg.cn/large/00831rSTly1gdebpozfgwj315o0sgtcy.jpg)

        添加如下参数后，重新查看，发现是 + 号了

        ![](https://tva1.sinaimg.cn/large/00831rSTly1gdebrx25moj31170u042c.jpg)

      - 是否使用串行垃圾回收器

        - -XX:-UseSerialGC
        - -XX:+UseSerialGC

  - KV 设值类型

    - 公式 -XX:属性key=属性 value

    - Case:

      - -XX:MetaspaceSize=128m

      - -xx:MaxTenuringThreshold=15

      - 我们常见的 -Xms和 -Xmx 也属于 KV 设值类型

        - -Xms 等价于 -XX:InitialHeapSize
        - -Xmx 等价于 -XX:MaxHeapSize

        ![](https://tva1.sinaimg.cn/large/00831rSTly1gdecj9d7z3j310202qdgb.jpg)

  - jinfo 举例，如何查看当前运行程序的配置

    - jps -l
    - jinfo -flag [配置项] 进程编号
    - jinfo **-flags** 1981(打印所有)
    - jinfo -flag PrintGCDetails 1981
    - jinfo -flag MetaspaceSize 2044

这些都是命令级别的查看，我们如何在程序运行中查看

```java
    long totalMemory = Runtime.getRuntime().totalMemory();
    long maxMemory = Runtime.getRuntime().maxMemory();

    System.out.println("total_memory(-xms)="+totalMemory+"字节，" +(totalMemory/(double)1024/1024)+"MB");
    System.out.println("max_memory(-xmx)="+maxMemory+"字节，" +(maxMemory/(double)1024/1024)+"MB");

}
```

### 盘点家底查看JVM默认值

- -XX:+PrintFlagsInitial

  - 主要查看初始默认值

  - java -XX:+PrintFlagsInitial

  - java -XX:+PrintFlagsInitial -version

  - ![](https://tva1.sinaimg.cn/large/00831rSTly1gdee0ndg33j31ci0m6k5w.jpg)

    **等号前有冒号** :=  说明 jvm 参数有人为修改过或者 JVM加载修改

    false 说明是Boolean 类型 参数，数字说明是 KV 类型参数

- -XX:+PrintFlagsFinal

  - 主要查看修改更新
  - java -XX:+PrintFlagsFinal
  - java -XX:+PrintFlagsFinal -version
  - 运行java命令的同时打印出参数 java -XX:+PrintFlagsFinal -XX:MetaspaceSize=512m Hello.java

- -XX:+PrintCommondLineFlags

  - 打印命令行参数
  - java -XX:+PrintCommondLineFlags -version
  - 可以方便的看到垃圾回收器
  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehf1e54soj31e006qjz6.jpg)

## 3. 你平时工作用过的 JVM 常用基本配置参数有哪些？

![](https://tva1.sinaimg.cn/large/00831rSTly1gdee0iss88j31eu0n6aqi.jpg)



- -Xms

  - 初始大小内存，默认为物理内存1/64
  - 等价于 -XX:InitialHeapSize

- -Xmx

  - 最大分配内存，默认为物理内存的1/4
  - 等价于 -XX:MaxHeapSize

- -Xss

  - 设置单个线程的大小，一般默认为 512k~1024k
  - 等价于 -XX:ThreadStackSize
  - 如果通过 `jinfo ThreadStackSize 线程 ID` 查看会显示为 0，指的是默认出厂设置

- -Xmn

  - 设置年轻代大小（一般不设置）

- -XX:MetaspaceSize

  - 设置元空间大小。元空间的本质和永久代类似，都是对 JMM 规范中方法区的实现。不过元空间与永久代最大的区别是，元空间并不在虚拟机中，而是使用本地内存。因此，默认情况下，元空间的大小仅受本地内存限制
  - 但是元空间默认也很小，频繁 new 对象，也会 OOM
  - -Xms10m -Xmx10m -XX:MetaspaceSize=1024m -XX:+PrintFlagsFinal

- -XX:+PrintGCDetails

  - 输出详细的 GC 收集日志信息 

  - 测试时候，可以将参数调到最小，

    `-Xms10m -Xmx10m -XX:+PrintGCDetails`

    定义一个大对象，撑爆堆内存，

    ```java
    public static void main(String[] args) throws InterruptedException {
        System.out.println("==hello gc===");
    
        //Thread.sleep(Integer.MAX_VALUE);
    
        //-Xms10m -Xmx10m -XX:PrintGCDetails
    
        byte[] bytes = new byte[11 * 1024 * 1024];
    
    }![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehkvas3vzj31a90u0n7t.jpg)
    ```

  - GC![](https://tva1.sinaimg.cn/large/00831rSTly1gdefrf0dfqj31fs0honjk.jpg)

  - Full GC![](https://tva1.sinaimg.cn/large/00831rSTly1gdefrc3lmbj31hy0gk7of.jpg)

    ![](https://tva1.sinaimg.cn/large/00831rSTly1gdefr8tvx0j31h60m41eq.jpg) 

- -XX:SurvivorRatio

  - 设置新生代中 eden 和S0/S1空间的比例
  - 默认 -XX:SurvivorRatio=8,Eden:S0:S1=8:1:1
  - SurvivorRatio值就是设置 Eden 区的比例占多少，S0/S1相同，如果设置  -XX:SurvivorRatio=2，那Eden:S0:S1=2:1:1

- -XX:NewRatio

  - 配置年轻代和老年代在堆结构的比例
  - 默认 -XX:NewRatio=2，新生代 1，老年代 2，年轻代占整个堆的 1/3
  - NewRatio值就是设置老年代的占比，如果设置-XX:NewRatio=4，那就表示新生代占 1，老年代占 4，年轻代占整个堆的 1/5

- -XX:MaxTenuringThreshold

  - 设置垃圾的最大年龄（java8 固定设置最大 15）
  - ![](https://tva1.sinaimg.cn/large/00831rSTly1gdefr4xeq1j31g80lek6e.jpg)

参数不懂，推荐直接去看官网，

https://docs.oracle.com/javacomponents/jrockit-hotspot/migration-guide/cloptions.htm#JRHMG127



https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BGBCIEFC

https://docs.oracle.com/javase/8/

Java SE Tools Reference for UNIX](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/index.html)







### 4. 强引用、软引用、弱引用、虚引用分别是什么？





## 5. 请谈谈你对 OOM 的认识

- java.lang.StackOverflowError

  - ```
    public class StackOverflowErrorDemo {
    
        public static void main(String[] args) {
            stackoverflowError();
        }
    
        private static void stackoverflowError() {
            stackoverflowError();
        }
    }
    ```

- java.lang.OutOfMemoryError: Java heap space

  - new个大对象,就会出现

- java.lang.OutOfMemoryError: GC overhead limit exceeded  (GC上头，哈哈)

  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehmrz0dvaj311w0muk0e.jpg)

  - ```java
    public class StackOverflowErrorDemo {
    
        public static void main(String[] args) {
            stackoverflowError();
        }
    
        private static void stackoverflowError() {
            stackoverflowError();
        }
    }
    ```

- java.lang.OutOfMemoryError: Direct buffer memory

  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehn18eix6j31a00m2wup.jpg)
  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehn52fphnj31as0lidyh.jpg)

- java.lang.OutOfMemoryError: unable to create new native thread

  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehn7osaz1j31940kc4c8.jpg)

- java.lang.OutOfMemoryError：Metaspace

  - http://openjdk.java.net/jeps/122
  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehnc3d4g3j319e0msguj.jpg)
  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehndijxo8j31920madt6.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehmmia4gaj30xw0gudid.jpg)





## 6. GC垃圾回收算法和垃圾收集器的关系？分别是什么，请你谈谈？

![](https://tva1.sinaimg.cn/large/007S8ZIlly1geho5bjeg5j31e409m0xb.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlly1geho87aqmuj31260dqdl2.jpg)



![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehoafwkoaj31a00my7js.jpg)



![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehobkwiegj31da0mc7ds.jpg)





![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehofhsuglj31a20ka116.jpg)



![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehohen24lj31f20n2du8.jpg)



![](https://tva1.sinaimg.cn/large/007S8ZIlly1geholtp9p9j31bu0i8dsm.jpg)



![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehop8c2u8j30uu0kgk46.jpg)





![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehptemx4oj31520js47e.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehps6jzcsj31go0mok5q.jpg)







### 7.怎么查看服务器默认的垃圾收集器是哪个？生产上如何配置垃圾收集器？谈谈你对垃圾收集器的理解？

### 8.G1 垃圾收集器？



### 9.生产环境服务器变慢，诊断思路和性能评估谈谈？

### 10.假设生产环境出现 CPU占用过高，请谈谈你的分析思路和定位



### 11. 对于JDK 自带的JVM 监控和性能分析工具用过哪些？你是怎么用的？

- jconsole  直接在jdk/bin目录下点击jconsole.exe即可启动
-  VisualVM   jdk/bin目录下面jvisualvm.exe

https://www.cnblogs.com/ityouknow/p/6437037.html



