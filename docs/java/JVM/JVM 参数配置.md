# 你说你做过 JVM 调优和参数配置，那你平时工作用过的配置参数有哪些？

![](https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg?cs=srgb&dl=pexels-207924.jpg&fm=jpg)

## JVM参数类型

JVM 参数类型大致分为以下几类：

- **标准参数**（-），即在 JVM 的各个版本中基本不变的，相对比较稳定的参数，向后兼容
- **非标准参数**（-X），变化比较小的参数，默认 JVM 实现这些参数的功能，但是并不保证所有 JVM 实现都满足，且不保证向后兼容；
- **非Stable参数**（-XX），此类参数各个 JVM 实现会有所不同，将来可能会随时取消，需要慎重使用；



### 标准参数

![image-20200629114526799](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200629114526799.png)

- `-version`：输出 java 的版本信息，比如 jdk 版本、vendor、model
- `-help`：输出 java 标准参数列表及其描述
- `-showversion`：输出 java 版本信息（与-version相同）之后，继续输出 java 的标准参数列表及其描述，相当于`java -verion` 和 `java -help`
- `-client`：设置 jvm 使用 client 模式，特点是启动速度比较快，但运行时性能和内存管理效率不高，通常用于客户端应用程序或者PC应用开发和调试
- `-server`：设置 jvm 使 server 模式，特点是启动速度比较慢，但运行时性能和内存管理效率很高，适用于生产环境。在具有64位能力的 jdk 环境下将默认启用该模式，而忽略 -client 参数
- `-agentlib:libname[=options]`：用于装载本地 lib 包。其中 libname 为本地代理库文件名，默认搜索路径为环境变量 PATH 中的路径，options 为传给本地库启动时的参数，多个参数之间用逗号分隔
- `-agentpath:pathname[=options]`：按全路径装载本地库，不再搜索PATH中的路径；其他功能和 agentlib相同
- `-Dproperty=value`
   设置系统属性名/值对，运行在此jvm之上的应用程序可用System.getProperty("property")得到value的值。
   如果value中有空格，则需要用双引号将该值括起来，如-Dname="space string"。
   该参数通常用于设置系统级全局变量值，如配置文件路径，以便该属性在程序中任何地方都可访问



### X 参数

非标准参数又称为扩展参数，其列表如下

![image-20200629114436655](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200629114436655.png)

- `-Xint`：设置 jvm 以解释模式运行，所有的字节码将被直接执行，而不会编译成本地码
- `-Xbatch`：关闭后台代码编译，强制在前台编译，编译完成之后才能进行代码执行。 默认情况下，jvm 在后台进行编译，若没有编译完成，则前台运行代码时以解释模式运行
- `-Xbootclasspath:bootclasspath`：让 jvm 从指定路径（可以是分号分隔的目录、jar、或者zip）中加载bootclass，用来替换 jdk 的 rt.jar；若非必要，一般不会用到
- `-Xbootclasspath/a:path` ：将指定路径的所有文件追加到默认 bootstrap 路径中
- `-Xfuture`：让jvm对类文件执行严格的格式检查（默认 jvm 不进行严格格式检查），以符合类文件格式规范，推荐开发人员使用该参数。
- `-Xincgc`：开启增量 gc（默认为关闭），这有助于减少长时间GC时应用程序出现的停顿，但由于可能和应用程序并发执行，所以会降低CPU对应用的处理能力
- **`-Xloggc:file`**： 与-verbose:gc功能类似，只是将每次GC事件的相关情况记录到一个文件中，文件的位置最好在本地，以避免网络的潜在问题。若与 verbose 命令同时出现在命令行中，则以 -Xloggc 为准
- **`-Xms`**：指定 jvm 堆的初始大小，默认为物理内存的1/64，最小为1M，可以指定单位，比如k、m，若不指定，则默认为字节
- **`-Xmx`**：指定 jvm 堆的最大值，默认为物理内存的 1/4或者1G，最小为2M；单位与`-Xms`一致
- `-Xprof`：跟踪正运行的程序，并将跟踪数据在标准输出输出；适合于开发环境调试
- **-Xss**： 设置单个线程栈的大小，一般默认为 512k
- -Xmixed：混合模式，JVM自己来决定是否编译成本地代码，默认使用的就是混合模式 




### xx参数

- Boolean 类型

  - 公式： -xx:+ 或者 - 某个属性值（+表示开启，- 表示关闭）

  - Case

    - 是否打印GC收集细节

      - -XX:+PrintGCDetails 
      - -XX:- PrintGCDetails 

      ![img](https://tva1.sinaimg.cn/large/00831rSTly1gdebpozfgwj315o0sgtcy.jpg)

      添加如下参数后，重新查看，发现是 + 号了

      ![img](https://tva1.sinaimg.cn/large/00831rSTly1gdebrx25moj31170u042c.jpg)

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

      ![img](https://tva1.sinaimg.cn/large/00831rSTly1gdecj9d7z3j310202qdgb.jpg)

- jinfo 举例，如何查看当前运行程序的配置

  - jps -l
  - jinfo -flag [配置项] 进程编号
  - jinfo **-flags** 1981(打印所有)
  - jinfo -flag PrintGCDetails 1981
  - jinfo -flag MetaspaceSize 2044

这些都是命令级别的查看，我们如何在程序运行中查看

```
    long totalMemory = Runtime.getRuntime().totalMemory();
    long maxMemory = Runtime.getRuntime().maxMemory();

    System.out.println("total_memory(-xms)="+totalMemory+"字节，" +(totalMemory/(double)1024/1024)+"MB");
    System.out.println("max_memory(-xmx)="+maxMemory+"字节，" +(maxMemory/(double)1024/1024)+"MB");

}
```

https://docs.oracle.com/javacomponents/jrockit-hotspot/migration-guide/cloptions.htm#JRHMG127

参数不懂，推荐直接去看官网，

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

    ```
    public static void main(String[] args) throws InterruptedException {
        System.out.println("==hello gc===");
    
        //Thread.sleep(Integer.MAX_VALUE);
    
        //-Xms10m -Xmx10m -XX:PrintGCDetails
    
        byte[] bytes = new byte[11 * 1024 * 1024];
    
    }![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehkvas3vzj31a90u0n7t.jpg)
    ```

  - Full GC![img](https://tva1.sinaimg.cn/large/00831rSTly1gdefrc3lmbj31hy0gk7of.jpg)

    ![img](https://tva1.sinaimg.cn/large/00831rSTly1gdefr8tvx0j31h60m41eq.jpg) 

  - GC![img](https://tva1.sinaimg.cn/large/00831rSTly1gdefrf0dfqj31fs0honjk.jpg)

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
  - ![img](https://tva1.sinaimg.cn/large/00831rSTly1gdefr4xeq1j31g80lek6e.jpg)



![img](https://tva1.sinaimg.cn/large/00831rSTly1gdee0iss88j31eu0n6aqi.jpg)

## 3. 你平时工作用过的 JVM 常用基本配置参数有哪些？

- -XX:+PrintFlagsInitial

  - 主要查看初始默认值

  - java -XX:+PrintFlagsInitial

  - java -XX:+PrintFlagsInitial -version

  - ![img](https://tva1.sinaimg.cn/large/00831rSTly1gdee0ndg33j31ci0m6k5w.jpg)

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
  - ![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gehf1e54soj31e006qjz6.jpg)

### 盘点家底查看JVM默认值



参数不懂，推荐直接去看官网，

https://docs.oracle.com/javacomponents/jrockit-hotspot/migration-guide/cloptions.htm#JRHMG127



https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BGBCIEFC

https://docs.oracle.com/javase/8/

Java SE Tools Reference for UNIX](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/index.html)