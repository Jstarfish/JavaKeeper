### Runtime

每个JVM只有一个Runtime实例，即为运行时环境，相当于内存结构的中间的那个框框：运行时环境

### 线程

线程是一个程序里的运行单元。JVM允许一个应用有多个线程并行的执行。

在Hotspot JVM里，每个线程都与操作系统的本地线程直接映射。当一个Java线程准备好执行以后，此时一个操作系统的本地线程也同时创建。Java线程执行终止后，本地线程也会回收。

操作系统负责所有线程的安排调度到任何一个可用的CPU上，一旦本地线程初始化成功，它就会调用Java线程中的run()方法。

- 如果你使用jconsole或者是任何一个调试工具，都能看到在后台有许多线程在运行。这些后台线程不包括调动`public static void main(String[] args)`的main线程以及所有这个main线程自己创建的线程
- 这些主要的后台系统线程在Hotspot JVM里主要是以下几个：
  - **虚拟机线程**：这种线程的操作是需要JVM达到安全点才会出现。这些操作必须在不同的线程中发生的原因是他们都需要JVM达到安全点，这样堆才不会变化。这种线程的执行类型包括”stop-the-world“的垃圾收集，线程栈收集，线程挂起一起偏向所撤销
  - 周期任务线程：这种线程是时间周期事件的体现（比如中断），他们一般用于周期性操作的调度执行
  - GC线程：这种线程对JVM里不同种类的垃圾收集行为提供了支持
  - 编译线程：这种线程在运行时会将字节码编译成本地代码
  - 信号调度线程：这种线程接收信号并发送给JVM，在它内部通过调用适当的方法进行处理





### 堆内存参数调整（调优关键） 

- 实际上每一块子内存区中都会存在有一部分的可变伸缩区 
- 如果空间不足时，则在可变范围之内扩大内存空间 
- 当一段时间后，内存空间有余，再将可变空间进行释放 

JVM所有操作：https://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html

| VM Switch              | VM Switch Description                                        |
| :--------------------- | :----------------------------------------------------------- |
| -Xms                   | 设置初始分配大小，默认为物理内存的1/64                       |
| -Xmx                   | 最大分配内存，默认为物理内存的1/4                            |
| -Xmn                   | For setting the size of the Young Generation, rest of the space goes for Old Generation. |
| -XX:PermGen            | For setting the initial size of the Permanent Generation memory |
| -XX:MaxPermGen         | For setting the maximum size of Perm Gen                     |
| -XX:SurvivorRatio      | For providing ratio of Eden space and Survivor Space, for example if Young Generation size is 10m and VM switch is -XX:SurvivorRatio=2 then 5m will be reserved for Eden Space and 2.5m each for both the Survivor spaces. The default value is 8. |
| -XX:NewRatio           | For providing ratio of old/new generation sizes. The default value is 2. |
| -XX:+PrintGCDetails    | 输出详细的GC处理日志                                         |
| -XX:+PrintGCTimeStamps | 输出GC的时间戳信息                                           |
| -XX:+PrintGCDateStamps | 输出GC的时间戳信息（以日期的形式）                           |
| -XX:+PrintHeapAtGC     | 在GC进行处理的前后打印堆内存信息                             |
| -Xloggc:(SavePath)     | 设置日志信息保存文件                                         |
|                        |                                                              |