# JVM 与 Java 体系结构

你是否也遇到过这些问题？

- 运行线上系统突然卡死，系统无法访问，甚至直接OOM
- 想解决线上JVM GC问题，但却无从下手
- 新项目上线，对各种JVM参数设置一脸懵逼，直接默认，然后就JJ了
- 每次面试都要重新背一遍JVM的一些原理概念性东西


这段广告语写的好，趁着在家办公学习下JVM，先列出整体知识点

![](https://tva1.sinaimg.cn/large/0082zybply1gbv4xk7o5hj30tm0wowh7.jpg)



Java开发都知道JVM是Java虚拟机，上学时还用过的VM也叫虚拟机，先比较一波

### 虚拟机与Java虚拟机

所谓虚拟机（Virtual Machine），就是一台虚拟的计算机。它是一款软件，用来执行一系列虚拟计算机指令。大体上，虚拟机可以分为**系统虚拟机**和**程序虚拟机**。

- Visaual Box，VMware就属于系统虚拟机，它们完全是对物理计算机的仿真，提供了一个可运行完整操作系统的软件平台
- 程序虚拟机的典型代表就是Java虚拟机，它专门为执行单个计算机程序而设计，在Java虚拟机中执行的指令我们称为Java字节码指令



## JVM 是什么

`JVM` 是 `Java Virtual Machine`（**Java虚拟机**)的缩写，`JVM`是一种用于计算设备的**规范**，它是一个**虚构**的计算机，是通过在实际的计算机上仿真模拟各种计算机功能来实现的。

Java虚拟机是二进制字节码的运行环境，负责装载**字节码**到其内部，解释/编译为对应平台的机器指令执行。每一条Java指令，Java虚拟机规范中都有详细定义，如怎么取操作数，怎么处理操作数，处理结果放在哪里。

### 特点

- 一次编译，到处运次（跨平台）
- 自动内存管理
- 自动垃圾回收功能

### 字节码

我们平时所说的java字节码，指的是用java语言编写的字节码，准确的说任何能在jvm平台上执行的字节码格式都是一样的，所以应该统称为**jvm字节码**。

不同的编译器可以编译出相同的字节码文件，字节码文件也可以在不同的jvm上运行。

Java虚拟机与Java语言没有必然的联系，它只与特定的二进制文件格式——Class文件格式关联，Class文件中包含了Java虚拟机指令集（或者称为字节码、Bytecodes）和符号集，还有一些其他辅助信息。

### Java代码执行过程

![](https://tva1.sinaimg.cn/large/0082zybply1gbnkxsppg8j30jg0pk0x9.jpg)







## JVM的位置

JVM是运行在操作系统之上的，它与硬件没有直接的交互。

`JDK`(Java Development Kit) 是 `Java` 语言的软件开发工具包（`SDK`）。`JDK` 物理存在，是 ` Java Language`、`Tools`、`JRE` 和 `JVM` 的一个集合。

![jvm-jdk-jre](https://tva1.sinaimg.cn/large/006tNbRwly1gbmnj3i2fyj315m0rc0z8.jpg)

![Difference Between JDK, JVM and JRE](https://tva1.sinaimg.cn/large/0082zybply1gbnkycw3z0j30h009fjth.jpg)



## JVM整体结构

![jvm-framework](https://tva1.sinaimg.cn/large/0082zybply1gbnqgrxfz4j30u00wp12d.jpg)



## JVM的架构模型

Java编译器输入的指令流基本上是一种基于**栈的指令集架构**，另外一种指令集架构则是基于**寄存器的指令集架构**。

两种架构之间的区别：

- 基于栈式架构的特点
  - 设计和实现更简单，适用于资源受限的系统；
  - 避开了寄存器的分配难题，使用零地址指令方式分配；
  - 指令流中的指令大部分是零地址指令，其执行过程依赖于操作栈。指令集更小，编译器容易实现；
  - 不需要硬件支持，可移植性更好，更好实现跨平台
- 基于寄存器架构的特点
  - 典型的应用是X86的二进制指令集：比如传统的PC以及Android的Davlik虚拟机；
  - 指令集架构则完全依赖硬件，可移植性差；
  - 性能优秀和执行更高效；
  - 花费更少的指令去完成一项操作；
  - 大部分情况下，基于寄存器架构的指令集往往都以一地址指令、二地址指令和三地址指令为主，而基于栈式架构的指令集却是以零地址指令为主

由于跨平台性的设计，Java的指令都是根据栈来设计的。不同平台CPU架构不同，所以不能设计为基于寄存器的，优点是跨平台，指令集小，编译器容易实现，缺点是性能下降，实现同样的功能需要更多的指令。

##### 分析基于栈式架构的JVM代码执行过程

进入class文件所在目录，执行`javap -v xx.class`反解析（或者通过IDEA插件`Jclasslib`直接查看），可以看到当前类对应的code区（汇编指令）、本地变量表、异常表和代码行偏移量映射表、常量池等信息。

![jvm-javap](https://tva1.sinaimg.cn/large/0082zybply1gbnnern41cj31cd0u0qbc.jpg)

以上图中的 1+2 为例说明:

```
Classfile /Users/starfish/workspace/myCode/starfish-learning/starfish-learn/target/classes/priv/starfish/jvm/JVM1.class
  Last modified 2020-2-7; size 487 bytes
  MD5 checksum 1a9653128b55585b2745270d13b17aaf
  Compiled from "JVM1.java"
public class priv.starfish.jvm.JVM1
  SourceFile: "JVM1.java"
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #3.#22         //  java/lang/Object."<init>":()V
   #2 = Class              #23            //  priv/starfish/jvm/JVM1
   #3 = Class              #24            //  java/lang/Object
   #4 = Utf8               <init>
   #5 = Utf8               ()V
   #6 = Utf8               Code
   #7 = Utf8               LineNumberTable
   #8 = Utf8               LocalVariableTable
   #9 = Utf8               this
  #10 = Utf8               Lpriv/starfish/jvm/JVM1;
  #11 = Utf8               main
  #12 = Utf8               ([Ljava/lang/String;)V
  #13 = Utf8               args
  #14 = Utf8               [Ljava/lang/String;
  #15 = Utf8               i
  #16 = Utf8               I
  #17 = Utf8               j
  #18 = Utf8               k
  #19 = Utf8               MethodParameters
  #20 = Utf8               SourceFile
  #21 = Utf8               JVM1.java
  #22 = NameAndType        #4:#5          //  "<init>":()V
  #23 = Utf8               priv/starfish/jvm/JVM1
  #24 = Utf8               java/lang/Object
{
  public priv.starfish.jvm.JVM1();
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0       
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return        
      LineNumberTable:
        line 3: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
               0       5     0  this   Lpriv/starfish/jvm/JVM1;

  public static void main(java.lang.String[]);
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=4, args_size=1
         0: iconst_1      //冒号前的数字表示程序计数器的数，常量1入栈
         1: istore_1      //保存到1的操作数栈中,这里的1表示操作数栈的索引位置
         2: iconst_2      
         3: istore_2      
         4: iload_1       //加载
         5: iload_2       
         6: iadd          //常量出栈，求和
         7: istore_3      //存储到索引为3的操作数栈
         8: return        
      LineNumberTable:
        line 6: 0
        line 7: 2
        line 8: 4
        line 9: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
               0       9     0  args   [Ljava/lang/String;
               2       7     1     i   I
               4       5     2     j   I
               8       1     3     k   I
      MethodParameters: length = 0x5
       01 00 0D 00 00 
}
```



## JVM生命周期

#### 虚拟机的启动

Java虚拟机的启动是通过引导类加载器（Bootstrap Class Loader）创建一个初始类（initial class）来完成的，这个类是由虚拟机的具体实现指定的。

#### 虚拟机的执行

- 一个运行中的Java虚拟机有着一个清晰的任务：执行Java程序
- 程序开始执行时它才运行，程序结束时它就停止
- 执行一个所谓的Java程序的时候，真正执行的是一个叫做Java虚拟机的进程
- 你在同一台机器上运行三个程序，就会有三个运行中的Java虚拟机。 Java虚拟机总是开始于一个**main()**方法，这个方法必须是公有、返回void、只接受一个字符串数组。在程序执行时，你必须给Java虚拟机指明这个包含main()方法的类名。 

#### 虚拟机的退出

有以下几种情况：

- 程序正常执行结束
- 程序在执行过程中遇到了异常或错误而异常终止
- 由于操作系统出现错误而导致Java虚拟机进程终止
- 某线程调用Runtime类或System类的exit方法，或Runtime类的halt方法，并且Java安全管理器也允许这次exit或halt操作
- 除此之外，JNI(Java Native Interface)规范描述了用`JNI Invocation API`来加载或卸载Java虚拟机时，Java虚拟机的退出情况



## Java和JVM规范

[Java Language and Virtual Machine Specifications](https://docs.oracle.com/javase/specs/index.html)



## JVM发展历程

JDK 版本升级不仅仅体现在语言和功能特性上，还包括了其编译和执行的 Java 虚拟机的升级。

- 1990年，在Sun计算机公司中，由Patrick Naughton、MikeSheridan及James Gosling领导的小组Green Team，开发出的新的程序语言，命名为Oak，后期命名为Java
- 1995年，Sun正式发布Java和HotJava产品，Java首次公开亮相
- 1996 年，JDK 1.0 发布时，提供了纯解释执行的 Java 虚拟机实现：Sun Classic VM。
- 1997 年，JDK 1.1 发布时，虚拟机没有做变更，依然使用 Sun Classic VM 作为默认的虚拟机
- 1998 年，JDK 1.2 发布时，提供了运行在 Solaris 平台的 Exact VM 虚拟机，但此时还是用 Sun Classic VM 作为默认的 Java 虚拟机，同时发布了JSP/Servlet、EJB规范，以及将Java分成J2EE、J2SE、J2ME
- 2000 年，JDK1.3 发布，默认的 Java 虚拟机由 Sun Classic VM 改为 Sun HotSopt VM，而 Sun Classic VM 则作为备用虚拟机
- 2002 年，JDK 1.4 发布，Sun Classic VM 退出商用虚拟机舞台，直接使用 Sun HotSpot VM 作为默认虚拟机一直到现在
- 2003年，Java平台的Scala正式发布，同年Groovy也加入了Java阵营
- 2004年，JDK1.5发布，同时JDK1.5改名为JDK5.0
- 2006年，JDK6发布，同年，Java开源并建立了OpenJDK。顺理成章，Hotspot虚拟机也成为了OpenJDK默认虚拟机
- 2008年，Oracle收购BEA，得到了JRockit虚拟机
- 2010年，Oracle收购了Sun，获得Java商标和HotSpot虚拟机
- 2011年，JDK7发布，在JDK1.7u4中，正式启用了新的垃圾回收器G1
- 2014年，JDK8发布，用元空间MetaSpace取代了PermGen
- 2017年，JDK9发布，将G1设置为默认GC，替代CMS

  

### Sun Classic VM

- 世界上第一款商用 Java 虚拟机。1996年随着Java1.0的发布而发布，JDK1.4时完全被淘汰；
- 这款虚拟机内部只提供解释器；
- 如果使用JIT编译器，就需要进行外挂。但是一旦使用了JIT编译器，JIT就会接管虚拟机的执行系统，解释器就不再工作，解释器和编译器不能配合工作；
- 现在hotspot内置了此虚拟机

### Exact VM

- 它的执行系统已经具备了现代高性能虚拟机的雏形：如热点探测、两级即时编译器、编译器与解析器混合工作模式等；
- 使用准确式内存管理：虚拟机可以知道内存中某个位置的数据具体是什么类型；
- 在商业应用上只存在了很短暂的时间就被更优秀的 HotSpot VM 所取代

### Sun HotSpot VM

- 它是 Sun JDK 和 OpenJDK 中所带的虚拟机，也是目前使用范围最广的 Java 虚拟机；
- 继承了 Sun 之前两款商用虚拟机的优点（如准确式内存管理），也使用了许多自己新的技术优势，如热点代码探测技术（通过执行计数器找出最具有编译价值的代码，然后通知 JIT 编译器以方法为单位进行编译；
- Oracle 公司分别收购了 BEA 和 Sun，并在 JDK8 的时候，整合了 JRokit VM 和 HotSpot VM，如使用了 JRokit 的垃圾回收器与 MissionControl 服务，使用了 HotSpot 的 JIT 编译器与混合的运行时系统。

### BEA JRockit VM

- 专注于服务器端应用，内部不包含解析器实现；
- 号称是世界上最快的JVM

### IBM J9 VM

- 全称：IBM Technology for Java Virtual Machine，简称IT4J，内部代号：J9
- 市场定位于HotSpot接近，服务器端、桌面应用、嵌入式等多用途VM
- 目前是有影响力的三大商用虚拟机之一

虚拟机有很多，此外还有Azul VM、Liquid VM、Apache Harmony、TaobaoJVM、Graal VM等



## 参考

《深入理解Java虚拟机》

《尚硅谷JVM》