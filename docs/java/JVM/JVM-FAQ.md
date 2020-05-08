JVM 面试题

![](https://tva1.sinaimg.cn/large/00831rSTly1gdeadup0v1j30xk0lgncn.jpg)



![](https://tva1.sinaimg.cn/large/00831rSTly1gdeambp5abj31ew0pm16q.jpg)









请谈谈你对 OOM 的认识？

GC 垃圾回收算法和垃圾收集器的关系？分别是什么请你谈谈？

怎么查看服务器默认的垃圾收集器是哪个？生产上如何配置垃圾收集器的？谈谈你对垃圾收集器的理解？

G1 垃圾收集器？

生产环境服务器变慢，诊断思路和性能评估谈谈？

假如生产环境出现 CPU 占用过高，请谈谈你的分析思路和定位

## 1. JVM 垃圾回收的时候如何确定垃圾？ 你知道什么是 GC Roots 吗？GC Roots 如何确定，那些对象可以作为 GC Roots?

内存中不再使用的空间就是垃圾

引用计数法和可达性分析

![](https://tva1.sinaimg.cn/large/00831rSTly1gdeam8z27oj31e60mudzv.jpg)

![](https://tva1.sinaimg.cn/large/00831rSTly1gdeaofj7tsj31cs0nstsz.jpg)

哪些对象可以作为 GC Root 呢，有以下几类

- 虚拟机栈（栈帧中的本地变量表）中引用的对象
- 方法区中类静态属性引用的对象
- 方法区中常量引用的对象
- 本地方法栈中 JNI（即一般说的 Native 方法）引用的对象



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







## 4. 强引用、软引用、弱引用、虚引用分别是什么？





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







## 7.怎么查看服务器默认的垃圾收集器是哪个？生产上如何配置垃圾收集器？谈谈你对垃圾收集器的理解？

## 8.G1 垃圾收集器？



## 9.生产环境服务器变慢，诊断思路和性能评估谈谈？

## 10.假设生产环境出现 CPU占用过高，请谈谈你的分析思路和定位

## 11. 对于JDK 自带的JVM 监控和性能分析工具用过哪些？你是怎么用的？

