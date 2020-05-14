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