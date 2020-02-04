内存与垃圾回收

字节码与类的加载

性能监控与调优

面试题



JVM与Java体系结构

类加载子系统

运行时数据区概述与线程

程序计数器

虚拟机栈

本地方法接口

本地方法栈

堆

方法区

直接内存

执行引擎

String Table

垃圾回收





你是否也遇到过这些问题？

- 运行线上系统突然卡死，系统无法访问，甚至直接OOM
- 想解决线上JVM GC问题，但却无从下手
- 新项目上线，对各种JVM参数设置一脸懵逼，直接默认，然后就JJ了
- 每次面试都要重新背一遍JVM的一些原理概念性东西





![](/Users/starfish/Desktop/截屏2020-02-04上午10.24.26.png)



java8 文档

https://docs.oracle.com/javase/8/docs/





# Java Language and Virtual Machine Specifications

https://docs.oracle.com/javase/specs/index.html

官方提供的java和jvm规范



书籍推荐

《Java 虚拟机规范》

《深入理解Java虚拟机》

《实战Java虚拟机》

《java虚拟机精讲》





![](/Users/starfish/Desktop/截屏2020-02-04上午11.01.30.png)



### 字节码

我们平时所说的java字节码，指的是用java语言编写的字节码，准确的说任何能在jvm平台上执行的字节码格式都是一样的，所以应该统称为**jvm字节码**。

不同的编译器可以编译出相同的字节码文件，字节码文件也可以在不同的jvm上运行。

Java虚拟机与Java语言没有必然的联系，它只与特定的二进制文件格式——Class文件格式关联，Class文件中包含了Java虚拟机指令集（或者称为字节码、Bytecodes）和符号集，还有一些其他辅助信息。

![](/Users/starfish/Desktop/截屏2020-02-04上午11.29.16.png)

![](/Users/starfish/Desktop/截屏2020-02-04上午11.39.35.png)



虚拟机与Java虚拟机

所谓虚拟机（Virtual Machine），就是一台虚拟的计算机。它是一款软件，用来执行一系列虚拟计算机指令。大体上，虚拟机可以分为**系统虚拟机**和**程序虚拟机**。

- Visaual Box，VMware就属于系统虚拟机，它们完全是对物理计算机的仿真，提供了一个可运行完整操作系统的软件平台
- 程序虚拟机的典型代表就是Java虚拟机，它专门为执行单个计算机程序而设计，在Java虚拟机中执行的指令我们称为Java字节码指令



### Java虚拟机

Java虚拟机是二进制字节码的运行环境,负责装载字节码到其内部，解释/编译为对应平台的机器指令执行。每一条Java指令，Java虚拟机规范中都有详细定义，如怎么取操作数，怎么处理操作数，处理结果放在哪里。

#### 特点

- 一次编译，到处运次
- 自动内存管理
- 自动垃圾回收功能



![](/Users/starfish/Desktop/截屏2020-02-04下午1.23.36.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午1.24.44.png)



JVM整体结构

![](/Users/starfish/Desktop/截屏2020-02-04下午1.30.56.png)



![](/Users/starfish/Desktop/截屏2020-02-04下午1.40.10.png)



![](/Users/starfish/Desktop/截屏2020-02-04下午1.59.14.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午3.31.35.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午3.37.16.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午3.51.02.png)

## JVM生命周期

![](/Users/starfish/Desktop/截屏2020-02-04下午3.44.09.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午5.36.14.png)



JVM发展历程

![](/Users/starfish/Desktop/截屏2020-02-04下午5.56.40.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午6.06.42.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午6.07.38.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午6.16.42.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午6.17.29.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午6.23.56.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午9.15.11.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午9.17.26.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午9.18.19.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午9.23.08.png)

![](/Users/starfish/Desktop/截屏2020-02-04下午9.32.17.png)