假如生产环境出现CPU占用过高，请谈谈你的分析思路和定位？

你是你说看日志，那就只能回家等通知了，



1. 先用 top 命令找到 CPU 占比最高的

   ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gesbmulx11j316w0m4qdc.jpg)

2. ps -ef 或者 jps 进一步定位，得知是一个怎样的一个后台

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gesbo6ikkdj31100d242b.jpg)

2. 定位到具体代码或线程

   ps -mp 进程 -o THREAD,tid,time

   参数解释：

   - -m 显示所有进程
   - -p pid 进程使用 cpu 的时间
   - -o 该参数后是用户自定义格式

   ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gesbqgwjjvj30x80n8th3.jpg)

3. 将需要的线程 ID 转换为 16进制格式（英文小写格式）

   线程在内存中跑是 16 进制的，pritf "%x\n" 有问题的线程 ID （或者计算器转换下）

4. jstack 进程 ID | grep tid(16进制线程 ID 小写英文) -A60 

   -A60 打印出前 60 行

   ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gesbvn06ypj31b80loap1.jpg)







https://fredal.xin/java-error-check#toc_h1_0





**查看Linux系统性能的常用命令**

MySQL数据库是常见的两个瓶颈是CPU和I/O的瓶颈。CPU在饱和的时候一般发生在数据装入内存或从磁盘上读取数据时候，磁盘I/O瓶颈发生在装入数据远大于内存容量的时候，如果应用分布在网络上，那么查询量相当大的时候那么瓶颈就会出现在网络上。Linux中我们常用mpstat、vmstat、iostat、sar和top来查看系统的性能状态。

`mpstat`： mpstat是Multiprocessor Statistics的缩写，是实时系统监控工具。其报告为CPU的一些统计信息，这些信息存放在/proc/stat文件中。在多CPUs系统里，其不但能查看所有CPU的平均状况信息，而且能够查看特定CPU的信息。mpstat最大的特点是可以查看多核心cpu中每个计算核心的统计数据，而类似工具vmstat只能查看系统整体cpu情况。

`vmstat`：vmstat命令是最常见的Linux/Unix监控工具，可以展现给定时间间隔的服务器的状态值，包括服务器的CPU使用率，内存使用，虚拟内存交换情况，IO读写情况。这个命令是我查看Linux/Unix最喜爱的命令，一个是Linux/Unix都支持，二是相比top，我可以看到整个机器的CPU、内存、IO的使用情况，而不是单单看到各个进程的CPU使用率和内存使用率(使用场景不一样)。

`iostat`: 主要用于监控系统设备的IO负载情况，iostat首次运行时显示自系统启动开始的各项统计信息，之后运行iostat将显示自上次运行该命令以后的统计信息。用户可以通过指定统计的次数和时间来获得所需的统计信息。

`sar`： sar（System Activity Reporter系统活动情况报告）是目前 Linux 上最为全面的系统性能分析工具之一，可以从多方面对系统的活动进行报告，包括：文件的读写情况、系统调用的使用情况、磁盘I/O、CPU效率、内存使用状况、进程活动及IPC有关的活动等。

`top`：top命令是Linux下常用的性能分析工具，能够实时显示系统中各个进程的资源占用状况，类似于Windows的任务管理器。top显示系统当前的进程和其他状况，是一个动态显示过程,即可以通过用户按键来不断刷新当前状态.如果在前台执行该命令，它将独占前台，直到用户终止该程序为止。比较准确的说，top命令提供了实时的对系统处理器的状态监视。它将显示系统中CPU最“敏感”的任务列表。该命令可以按CPU使用。内存使用和执行时间对任务进行排序；而且该命令的很多特性都可以通过交互式命令或者在个人定制文件中进行设定。

除了服务器硬件的性能瓶颈，对于MySQL系统本身，我们可以使用工具来优化数据库的性能，通常有三种：使用索引，使用 EXPLAIN 分析查询以及调整 MySQL 的内部配置。