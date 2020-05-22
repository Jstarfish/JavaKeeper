假如生产环境出现CPU占用过高，请谈谈你的分析思路和定位？

曾经年少的我碰到这种问题，答案会脱口而出：“看日志”。

然后就是回家漫长的等通知。





查看Linux系统性能的常用命令

Linux中我们常用mpstat、vmstat、iostat、sar和top来查看系统的性能状态。

`mpstat`： mpstat是Multiprocessor Statistics的缩写，是实时系统监控工具。其报告为CPU的一些统计信息，这些信息存放在/proc/stat文件中。在多CPUs系统里，其不但能查看所有CPU的平均状况信息，而且能够查看特定CPU的信息。mpstat最大的特点是可以查看多核心cpu中每个计算核心的统计数据，而类似工具vmstat只能查看系统整体cpu情况。

`vmstat`：vmstat命令是最常见的Linux/Unix监控工具，可以展现给定时间间隔的服务器的状态值，包括服务器的CPU使用率，内存使用，虚拟内存交换情况，IO读写情况。这个命令是我查看Linux/Unix最喜爱的命令，一个是Linux/Unix都支持，二是相比top，我可以看到整个机器的CPU、内存、IO的使用情况，而不是单单看到各个进程的CPU使用率和内存使用率(使用场景不一样)。

`iostat`: 主要用于监控系统设备的IO负载情况，iostat首次运行时显示自系统启动开始的各项统计信息，之后运行iostat将显示自上次运行该命令以后的统计信息。用户可以通过指定统计的次数和时间来获得所需的统计信息。

`sar`： sar（System Activity Reporter系统活动情况报告）是目前 Linux 上最为全面的系统性能分析工具之一，可以从多方面对系统的活动进行报告，包括：文件的读写情况、系统调用的使用情况、磁盘I/O、CPU效率、内存使用状况、进程活动及IPC有关的活动等。

`top`：top命令是Linux下常用的性能分析工具，能够实时显示系统中各个进程的资源占用状况，类似于Windows的任务管理器。top显示系统当前的进程和其他状况，是一个动态显示过程,即可以通过用户按键来不断刷新当前状态.如果在前台执行该命令，它将独占前台，直到用户终止该程序为止。比较准确的说，top命令提供了实时的对系统处理器的状态监视。它将显示系统中CPU最“敏感”的任务列表。该命令可以按CPU使用。内存使用和执行时间对任务进行排序；而且该命令的很多特性都可以通过交互式命令或者在个人定制文件中进行设定。

除了服务器硬件的性能瓶颈，对于MySQL系统本身，我们可以使用工具来优化数据库的性能，通常有三种：使用索引，使用 EXPLAIN 分析查询以及调整 MySQL 的内部配置。



## 线上机器CPU占用过高的故事（案例）

### 1. 出现问题

在这个代表爱情的日子里，我正憧憬着怎么赶紧写完下午的bug，早早下班回家的时候，突然收到一封系统邮件，大致意思是“有一台机器CPU使用太高了”，打开监控平台，果然

![image-20200520142648150](C:\Users\jiahaixin\Downloads\chart (1).png)

### 2. 定位问题

#### 定位进程

遇到问题，我没有丝毫慌张，不紧不慢的登录服务器，只是简单的输入了3个英文字母：**top**

![](C:\Users\jiahaixin\Desktop\360\111.jpg)

如下，果然看到有一个java进程CPU的使用率竟然达到了325%

`ps -ef` 或者 `jps -l` 进一步定位具体对应的pid，看看是一个什么进程

![](C:\Users\jiahaixin\Desktop\360\222.jpg)



#### 定位线程

定位到具体线程(tid)

`ps -mp pid -o THREAD,tid,time`

参数解释：

- -m 显示所有进程
- -p pid 进程使用 cpu 的时间
- -o 该参数后是用户自定义格式

![](C:\Users\jiahaixin\Desktop\360\777.jpg)

或者通过`top -H -p pid` ，直接找到CPU使用率比较高的一些线程

![](C:\Users\jiahaixin\Desktop\360\666.jpg)

这两种方式均可以看到CPU使用率最高的线程都是20817



#### 定位代码

因为线程在内存中跑是 16 进制的，将需要的线程 ID 转换为 16进制格式（英文小写格式）

`printf '%x\n' tid`（tid是有问题的线程ID），这一步也可以用计算器换算下

![](C:\Users\jiahaixin\Desktop\360\888.jpg)

通过jstack查看该线程的栈信息

`jstack tid | grep nid -A100` （nid是16进制的线程ID，-A100表示打印前100行）

![](C:\Users\jiahaixin\Desktop\360\999.jpg)



https://fredal.xin/java-error-check#toc_h1_0





