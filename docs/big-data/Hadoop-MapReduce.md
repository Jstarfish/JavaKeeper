> 官方文档才是最好的入门学习文档：https://hadoop.apache.org/docs/r1.0.4/cn/mapred_tutorial.html

##  一、MapReduce 概述

###  1.1 MapReduce 定义

MapReduce 是一个<mark>**分布式运算程序的编程框架**</mark>，是用户开发“基于Hadoop的数据分析应用”的核心框架。基于它写出来的应用程序能够运行在由上千个商用机器组成的大型集群上，并以一种可靠容错的方式并行处理上T级别的数据集。

MapReduce 核心功能是将**用户编写的业务逻辑代码**和**自带默认组件**整合成一个完整的**分布式运算程序**，并发运行在一个 Hadoop 集群上。 

一个Map/Reduce *作业（job）* 通常会把输入的数据集切分为若干独立的数据块，由 *map任务（task）*以完全并行的方式处理它们。框架会对map的输出先进行排序， 然后把结果输入给*reduce任务*。通常作业的输入和输出都会被存储在文件系统中。 整个框架负责任务的调度和监控，以及重新执行已经失败的任务。

通常，Map/Reduce框架和[分布式文件系统](https://hadoop.apache.org/docs/r1.0.4/cn/hdfs_design.html)是运行在一组相同的节点上的，也就是说，计算节点和存储节点通常在一起。这种配置允许框架在那些已经存好数据的节点上高效地调度任务，这可以使整个集群的网络带宽被非常高效地利用。

Map/Reduce框架由一个单独的 master JobTracker 和每个集群节点一个 slave TaskTracker 共同组成。master 负责调度构成一个作业的所有任务，这些任务分布在不同的 slave 上，master 监控它们的执行，重新执行已经失败的任务。而 slave 仅负责执行由 master 指派的任务。

应用程序至少应该指明输入/输出的位置（路径），并通过实现合适的接口或抽象类提供map和reduce函数。再加上其他作业的参数，就构成了*作业配置（job configuration）*。然后，Hadoop 的 *job client*提交作业（jar包/可执行程序等）和配置信息给 JobTracker，后者负责分发这些软件和配置信息给 slave、调度任务并监控它们的执行，同时提供状态和诊断信息给 job-client。

虽然Hadoop框架是用JavaTM实现的，但Map/Reduce应用程序则不一定要用 Java来写 。

- [Hadoop Streaming](https://hadoop.apache.org/core/docs/r0.18.2/api/org/apache/hadoop/streaming/package-summary.html)是一种运行作业的实用工具，它允许用户创建和运行任何可执行程序 （例如：Shell工具）来做为mapper和reducer。
- [Hadoop Pipes](https://hadoop.apache.org/core/docs/r0.18.2/api/org/apache/hadoop/mapred/pipes/package-summary.html)是一个与[SWIG](http://www.swig.org/)兼容的C++ API （没有基于JNITM技术），它也可用于实现Map/Reduce应用程序。

### 1.2 MapReduce 优缺点

#### 优点 

1. **易于编程**

   它简单的实现一些接口，就可以完成一个分布式程序，这个分布式程序可以分布到大量廉价的 PC机器上运行。也就是说你写一个分布式程序，跟写一个简单的串行程序是一模一样的。就是因为这个特点使得MapReduce 编程变得非常流行。 

2. **良好的扩展性**

   当你的计算资源不能得到满足的时候，你可以通过简单的增加机器来扩展它的计算能力。 MapReduce 

3. **高容错性**

   MapReduce 设计的初衷就是使程序能够部署在廉价的 PC 机器上，这就要求它具有很高的容错性。比如其中一台机器挂了，它可以把上面的计算任务 转移到另外一个节点上运行，不至于这个任务运行失败，而且这个过程不需要人工参与，而完全是由 Hadoop 内部完成的。 

4. **适合 PB 级以上海量数据的离线处理**

   可以实现上千台服务器集群并发工作，提供数据处理能力。 

#### 缺点

1. **不擅长实时计算**

   MapReduce 无法像 MySQL 一样，在毫秒或者秒级内返回结果。 

2. **不擅长流式计算**

   流式计算的输入数据是动态的，而 MapReduce 的输入数据集是静态的，不能动态变化。这是因为MapReduce 自身的设计特点决定了数据源必须是静态的。 

3. **不擅长DAG（有向图）计算**

   多个应用程序存在依赖关系，后一个应用程序的输入为前一个的输出。在这种情况下，MapReduce 并不是不能做，而是使用后，每个 MapReduce作业的输出结果都会写入到磁盘，会造成大量的磁盘 IO，导致性能非常的低下。



### 1.3 MapReduce 核心思想

![image-20200723104319403](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200723104319403.png)



1. 分布式的运算程序往往需要分成至少 2 个阶段。
2. 第一个阶段的 MapTask 并发实例，完全并行运行，互不相干。
3. 第二个阶段的 ReduceTask 并发实例互不相干，但是他们的数据依赖于上一个阶段的所有 MapTask 并发实例的输出。
4. MapReduce 编程模型只能包含一个 Map 阶段和一个 Reduce 阶段，如果用户的业务逻辑非常复杂，那就只能多个 MapReduce 程序，串行运行。



### 1.4 MapReduce 进程

一个完整的 MapReduce 程序在分布式运行时有三类实例进程： 

1. MrAppMaster： 负责整个程序的过程调度及状态协调
2. MapTask： 负责 Map 阶段的整个数据处理流程
3. ReduceTask：负责 Reduce 阶段的整个数据处理流程



### 1.5 官方 WordCount 源码 

采用反编译工具反编译源码，发现 WordCount 案例有 Map 类、Reduce 类和驱动类。且 数据的类型是 Hadoop 自身封装的序列化类型。



### 1.6 常用数据序列化类型

![image-20200723104612516](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200723104612516.png)



### 1.7 MapReduce 编程规范

用户编写的程序分成三个部分：Mapper、Reducer 和 Driver。

1、Mapper 阶段

​	① 用户自定义的 Mapper 要继承自己的父类

​	② Mapper 的输入数据是 KV 对的形式（KV的类型可自定义）

​	③ Mapper 中的业务逻辑写在 map() 方法中

​	④ Mapper 的输出数据是 KV 对的形式（KV 的类型可自定义）

​	⑤ map() 方法（MapTask 进程）对每一个调用一次

2、Reducer 阶段 

​	① 用户自定义的 Reducer 要继承自己的父类

​	② Reducer 的输入数据类型对应 Mapper 的输出数据类型，也是KV 

​	③ Reducer 的业务逻辑写在 reduce() 方法中

​	④ ReduceTask 进程对每一组相同k的组调用一次 reduce() 方法

3、Driver阶段

​	相当于 YARN 集群的客户端，用于提交我们整个程序到 YARN 集群，提交的是封装了 MapReduce 程序相关运	行参数的 job 对象



### 1.8 输入与输出

Map/Reduce框架运转在<key, value> 键值对上，也就是说， 框架把作业的输入看为是一组<key, value> 键值对，同样也产出一组 <key, value> 键值对做为作业的输出，这两组键值对的类型可能不同。

框架需要对key和value的类(classes)进行序列化操作， 因此，这些类需要实现 [Writable](https://hadoop.apache.org/core/docs/r0.18.2/api/org/apache/hadoop/io/Writable.html)接口。 另外，为了方便框架执行排序操作，key类必须实现 [WritableComparable](https://hadoop.apache.org/core/docs/r0.18.2/api/org/apache/hadoop/io/WritableComparable.html)接口。

一个Map/Reduce 作业的输入和输出类型如下所示：

(input) <k1, v1> -> **map** -> <k2, v2> -> **combine** -> <k2, v2> -> **reduce** -> <k3, v3> (output)



### 1.9 hello world

> 我们用官方提供的 WordCount 例子





## 二、Hadoop 序列化

### 2.1 序列化概述

#### 2.1.1 什么是序列化 

序列化就是把内存中的对象，转换成字节序列（或其他数据传输协议）以便于存储到磁盘（持久化）和网络传输。 反序列化就是将收到字节序列（或其他数据传输协议）或者是磁盘的持久化数据，转换成内存中的对象。 

#### 2.1.2 为什么要序列化 

一般来说，“活的”对象只生存在内存里，关机断电就没有了。而且“活的” 对象只能由本地的进程使用，不能被发送到网络上的另外一台计算机。 然而序列化可以存储“活的”对象，可以将“活的”对象发送到远程计算机。

#### 2.1.3 为什么不用Java的序列化

Java 的序列化是一个重量级序列化框架（Serializable），一个对象被序列化后，会附带很多额外的信息（各种校验信息，Header，继承体系等），不便于在网络中高效传输。所以，Hadoop 自己开发了一套序列化机制（Writable）。

**Hadoop序列化特点：**

1. 紧凑 ：高效使用存储空间
2. 快速：读写数据的额外开销小
3. 可扩展：随着通信协议的升级而可升级
4. 互操作：支持多语言的交互

#### 2.2 自定义 bean 对象实现序列化接口（Writable）

在企业开发中往往常用的基本序列化类型不能满足所有需求，比如在 Hadoop 框架内部传递一个 bean 对象，那么该对象就需要实现序列化接口。 具体实现 bean 对象序列化步骤如下 7 步。 

1. 必须实现 Writable 接口

2. 反序列化时，需要反射调用空参构造函数，所以必须有空参构造 

   ```java
   public FlowBean() {
   	super();
   }
   ```

3. 重写序列化方法 

   ```java
   @Override
   public void write(DataOutput out) throws IOException {
   	out.writeLong(upFlow);
   	out.writeLong(downFlow);
   	out.writeLong(sumFlow);
   }
   ```

4. 重写反序列化方法

   ```java
   @Override
   public void readFields(DataInput in) throws IOException {
   	upFlow = in.readLong();
   	downFlow = in.readLong();
   	sumFlow = in.readLong();
   }
   ```

5. 注意反序列化的顺序和序列化的顺序完全一致 

6. 要想把结果显示在文件中，需要重写 toString()，可用”\t”分开，方便后续用

7. 如果需要将自定义的 bean 放在 key 中传输，则还需要实现 Comparable 接口，因为 MapReduce 框中的 Shuffle 过程要求对 key 必须能排序

   ```java
   @Override
   public int compareTo(FlowBean o) {
   	// 倒序排列，从大到小
   	return this.sumFlow > o.getSumFlow() ? -1 : 1;
   }
   ```



#### 2.3 序列化案例实操

1、需求：统计每一个手机号耗费的总上行流量、下行流量、总流量

1. 输入数据 phone_data .txt 

2. 输入数据格式：

   ![image-20200723183657595](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200723183657595.png)

3. 期望输出数据格式

    ![image-20200723183719979](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200723183719979.png)



2、需求分析

![image-20200723183758867](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200723183758867.png)

3、编写 MapReduce 程序

编写流量统计的 Bean 对象