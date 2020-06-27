# 你说你做过 JVM 调优和参数配置，那你平时工作用过的配置参数有哪些？

## JVM参数类型

### 标准参数，即在 JVM 的各个版本中基本不变的，相对比较稳定的参数

- -version   (`java -version`) 
- -help       (`java -help`)
- `java -showversion`

### X 参数，非标准化参数，变化比较小的参数

- -Xint：解释执行

- -Xcomp：第一次使用就编译成本地代码

- -Xmixed：混合模式，JVM自己来决定是否编译成本地代码，默认使用的就是混合模式 

  ![img](https://tva1.sinaimg.cn/large/00831rSTly1gdeb84yh71j30yq0j6akl.jpg)

- xx参数

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