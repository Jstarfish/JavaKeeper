## 阿里面试回顾： 说说强引用、软引用、弱引用、虚引用分别是什么？

我们都知道 JVM 垃圾回收中，GC判断堆中的对象实例或数据是不是垃圾的方法有**引用计数法**和**可达性算法**两种。

无论是通过引用计数算法判断对象的引用数量，还是通过根搜索算法判断对象的引用链是否可达，判定对象是否存活都与“引用”有关。

在 JDK 1.2 之前，Java 中的引用的定义很传统：如果 reference 类型的数据中存储的数值代表的是另外一块内存的起始地址，就称该 refrence 数据是代表某块内存、某个对象的引用。这种定义很纯粹，但是太过狭隘，一个对象在这种定义下只有被引用或者没有被引用两种状态，对于如何描述一些“食之无味，弃之可惜”的对象就显得无能为力。

比如我们希望能描述这样一类对象：当内存空间还足够时，则能保留在内存之中；如果内存在进行垃圾收集后还是非常紧张，则可以抛弃这些对象。很多系统的缓存功能都符合这样的应用场景。

在 JDK 1.2 之后，Java 对引用的概念进行了扩充，将引用分为

- 强引用（Strong Reference）
- 软引用（Soft Reference）
- 弱引用（Weak Reference）
- 虚引用（Phantom Reference）

这四种引用强度依次逐渐减弱。  



### JDK 8中的 UML关系图

![Finalizer.png](https://i.loli.net/2020/05/07/AqsHUeYCOf2hzZc.png)



### 强引用

在 Java 中最常见的就是强引用，把一个对象赋给一个引用变量，这个引用变量就是一个强引用。类似 `“Object obj = new Object()”` 这类的引用，只要还有强引用指向一个对象，就能表明对象还“活着”，垃圾收集器就不会碰这种对象。

当一个对象被强引用变量引用时，它处于可达状态，是不可能被垃圾回收器回收的，即使该对象永远不会被用到也不会被回收。

当内存不足，JVM 开始垃圾回收，对于强引用的对象，**就算是出现了 OOM 也不会对该对象进行回收，打死都不收。**因此强引用是造成 Java 内存泄露的主要原因之一。

对于一个普通的对象，如果没有其他的引用关系，只要超过了引用的作用域或者显示地将相应（强）引用赋值为 null，一般认为就是可以被垃圾收集器回收。（具体回收时机还要要看垃圾收集策略）。

#### coding~

```java
public class StrongRefenenceDemo {

    public static void main(String[] args) {
        Object o1 = new Object();
        Object o2 = o1;
        o1 = null;
        System.gc();
        System.out.println(o1);  //null
        System.out.println(o2);  //java.lang.Object@2503dbd3
    }
}
```

TODO : demo中尽管o1已经被回收，但是o2一直存在，不会被垃圾回收



### 软引用

软引用是一种相对强引用弱化了一些的引用，需要用`java.lang.ref.SoftReference` 类来实现，可以让对象豁免一些垃圾收集。

软引用用来描述一些还有用，但并非必需的对象。对于软引用关联着的对象，在系统将要发生内存溢出异常之前，将会把这些对象列进回收范围之中并进行第二次回收。如果这次回收还是没有足够的内存，才会抛出内存溢出异常。

对于只有软引用的对象来说

- 当系统内存充足时它不会被回收
- 当系统内存不足时它才会被回收

软引用通常用在对内存敏感的程序中，比如高速缓存就有用到软引用，内存够用的时候就保留，不够用就回收。

#### coding~

```java
//VM options: -Xms5m -Xmx5m
public class SoftRefenenceDemo {

    public static void main(String[] args) {
        softRefMemoryEnough();
        System.out.println("------内存不够用的情况------");
        softRefMemoryNotEnough();
    }

    private static void softRefMemoryEnough() {
        Object o1 = new Object();
        SoftReference<Object> s1 = new SoftReference<Object>(o1);
        System.out.println(o1);
        System.out.println(s1.get());

        o1 = null;

        System.gc();

        System.out.println(o1);
        System.out.println(s1.get());
    }

     /**
     * JVM配置`-Xms5m -Xmx5m` ，然后故意new一个一个大对象，使内存不足产生 OOM，看软引用回收情况
     */
    private static void softRefMemoryNotEnough() {
        Object o1 = new Object();
        SoftReference<Object> s1 = new SoftReference<Object>(o1);
        System.out.println(o1);
        System.out.println(s1.get());

        o1 = null;

        byte[] bytes = new byte[10 * 1024 * 1024];

        System.out.println(o1);
        System.out.println(s1.get());
    }
}
```

Output

```
java.lang.Object@2503dbd3
java.lang.Object@2503dbd3
null
java.lang.Object@2503dbd3
------内存不够用的情况------
java.lang.Object@4b67cf4d
java.lang.Object@4b67cf4d
java.lang.OutOfMemoryError: Java heap space
	at reference.SoftRefenenceDemo.softRefMemoryNotEnough(SoftRefenenceDemo.java:42)
	at reference.SoftRefenenceDemo.main(SoftRefenenceDemo.java:15)
null
null
```

Mybatis 缓存类就有用到

TODO



### 弱引用

弱引用也是用来描述非必需对象的，但是它的强度比软引用更弱一些，被弱引用关联的对象只能生存到下一次垃圾收集发生之前。当垃圾收集器工作时，无论当前内存是否足够，都会回收掉只被弱引用关联的对象。

弱引用需要用`java.lang.ref.WeakReference`类来实现，它比软引用的生存期更短。

对于只有软引用的对象来说，只要垃圾回收机制一运行，不管 JVM 的内存空间是否足够，都会回收该对象占用的内存。

#### coding~

```java
public class WeakReferenceDemo {

    public static void main(String[] args) {
        Object o1 = new Object();
        WeakReference<Object> w1 = new WeakReference<Object>(o1);

        System.out.println(o1);
        System.out.println(w1.get());

        o1 = null;
        System.gc();

        System.out.println(o1);
        System.out.println(w1.get());
    }
}
```



#### 软引用和弱引用的适用场景

假如有一个应用需要读取大量的本地图片：

- 如果每次读取图片都从硬盘读取则会严重影响性能
- 如果一次性全部加载到内存中又可能造成内存溢出

此时使用软引用就可以解决这个问题。

设计思路：用一个HashMap来保存图片的路径和相应图片对象关联的软引用之间的映射关系，在内存不足时，JVM会自动回收这些缓存图片对象所占用的空间，从而有效的避免了OOM的问题。

Map<String,SoftReference<Bitmap>> imageCache = new HashMap<String,SoftReference<Bitmap>>();



> 你知道弱引用的话，能说下 WeakHashMap吗

```java
public class WeakHashMapDemo {

    public static void main(String[] args) {
        myHashMap();
        myWeakHashMap();

    }

    public static void myHashMap() {
        HashMap<String, String> map = new HashMap<String, String>();
        String key = "k1";
        String value = "v1";
        map.put(key, value);
        System.out.println(map);

        key = null;
        System.out.println(map);

        System.gc();
        System.out.println(map);
    }

    public static void myWeakHashMap() {
        WeakHashMap<String, String> map = new WeakHashMap<String, String>();
        String key = "weak";
        String value = "map";
        map.put(key, value);
        System.out.println(map);

        key = null;
        System.out.println(map);

        System.gc();
        System.out.println(map);
    }

}
```



### 虚引用

虚引用也称为“**幽灵引用**”或者“**幻影引用**”，它是最弱的一种引用关系。

虚引用，顾名思义，就是形同虚设，与其他几种引用都不太一样，一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用来取得一个对象实例。

为一个对象设置虚引用关联的唯一目的就是希望能在这个对象被收集器回收时收到一个系统通知。

虚引用需要`java.lang.ref.PhantomReference` 来实现。



如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回收器回收，它不能单独使用也不能通过它访问对象，虚引用必须和引用队列（RefenenceQueue）联合使用。

虚引用的主要作用是跟踪对象垃圾回收的状态。仅仅是提供了一种确保对象被finalize以后，做某些事情的机制。

PhantomReference的get方法总是返回null，因此无法访问对应的引用对象。其意义在于说明一个对象已经进入finalization阶段，可以被gc回收，用来实现比finalization机制更灵活的回收操作。

换句话说，设置虚引用的唯一目的，就是在这个对象被回收器回收的时候收到一个系统通知或者后续添加进一步的处理。

Java技术允许使用finalize() 方法在垃圾收集器将对象从内存中清除出去之前做必要的清理工作。













## 二、引用到底有什么作用

假设我们有一个对象 Data ，还有一个对象 Entry 中依赖 Data 对象。伪代码如下：

```java
class Data {
    byte[] v;
}

class Entry {
    Data d;
}

Data data = new Data(new byte[10 * 1024]);

Entry entry = new Entry(data);

 
        Copied!
    
```

如果在运行过程中，data = null 后，data 对象可以被垃圾回收掉吗？

答案是：需要看 entry 对象是否为 null

如果 entry 一直不为 null 的话，data 永远不能被回收，因为 Entry.d 变量引用了 data。

这时就可能发生内存泄漏。

> 扩展知识：Java 是值传递还是引用传递？

------

那么如何解决呢，答案就是使用软、弱引用。

假如我们把 Entry 对 data 的依赖声明为一个软引用。如果 data = null 后，垃圾回收时就可以回收 data 对象了。

```java
    class Entry extends WeakReference<Data> {

        public Entry(Data d) {
            super(d);
        }
    }

 
        Copied!
    
```

我们可以大白话的理解为：

- 如果是弱引用，我对你的依赖很柔软薄弱，你觉得自己没有用了，我不会强行留住你，会放你走（垃圾回收）
- 如果是强引用，就算你觉得自己没有用了，我依然不让你走（不让垃圾回收）

**比喻的总结四个引用**

- 强引用：关系非常好，你自己没有用了，我也不会让你走
- 软引用：关系还行，你自己没有用了，我会挽留到在系统将要发生内存溢出异常前在走
- 弱引用：关系就那样，你自己没有用了，垃圾收集员一来你就可以走
- 虚引用：关系近乎敌人，我永远得不到你，垃圾收集员一来你就可以走。主要与 ReferenceQueue 配合使用，在回收时进行一些逻辑操作（认为是回收前执行一个回调函数）

我们可以看到，最主要还是「你自己没有用了」这个操作，可以认为是一个 obj = null 的操作。如果你走了，那么我也拿不到你的信息了。

## 三、弱引用的 GC 实战

```java
@Slf4j
public class WeakReferenceExample {

    public static void main(String[] args) throws InterruptedException {
        // 10M 的缓存数据
        byte[] cacheData = new byte[10 * 1024 * 1024];

        // 将缓存数据用软引用持有
        final WeakReference<byte[]> cacheRef = new WeakReference<>(cacheData);

        log.info("第一次 GC 前 {}", cacheData == null);
        log.info("第一次 GC 前 {}", cacheRef.get() == null);

        // 进行一次 GC 后查看对象的回收情况
        System.gc();
        Thread.sleep(1000); // 等待 GC
        log.info("第一次 GC 后 {}", cacheData == null);
        log.info("第一次 GC 后 {}", cacheRef.get() == null);

        // 将缓存数据的强引用去除，你没有用了
        cacheData = null;
        System.gc();
        Thread.sleep(1000); //等待 GC
        log.info("第二次 GC 后 {}", cacheData == null);
        log.info("第二次 GC 后 {}", cacheRef.get() == null);
    }
    /* 打印内容如下：
    
     第一次 GC 前 false
     第一次 GC 前 false
    
    [GC (System.gc())  14908K->11560K(125952K), 0.0318128 secs]
    [Full GC (System.gc())  11560K->11425K(125952K), 0.0216147 secs]
    
     第一次 GC 后 false
     第一次 GC 后 false
    
    [GC (System.gc())  12090K->11457K(125952K), 0.0016023 secs]
    [Full GC (System.gc())  11457K->818K(125952K), 0.0093186 secs]
    
     第二次 GC 后 true
     第二次 GC 后 true
     */
}

 
        Copied!
    
```

## 四、再理解 ThreadLocalMap 的弱引用

```java
   static class ThreadLocalMap {
        static class Entry extends WeakReference<ThreadLocal<?>> {
            /** The value associated with this ThreadLocal. */
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }

 
        Copied!
    
```

如果我们的代码中不需要 ThreadLocal 这个对象的话，即 ThreadLocal = null。但是 ThreadLocalMap 是线程的变量，如果线程一直运行，那么 ThreadLocalMap 永远不会为 null。

- 如果使用强引用，Entry 中的 k 强引用了 ThreadLocal ，ThreadLocal 永远不能释放
- 如果使用弱引用，ThreadLocal 在垃圾回收时将释放，Entry 中的 k 将变为 null

## [#](https://review-notes.top/language/java-jvm/引用有什么用.html#五、referencequeue-引用队列)五、ReferenceQueue 引用队列

引用队列，用于存放待回收的引用对象。

对于软引用、弱引用和虚引用，如果我们希望当一个对象被垃圾回收器回收时能得到通知，进行额外的处理，这时候就需要使用到引用队列了。

在一个对象被垃圾回收器扫描到将要进行回收时 reference 对象会被放入其注册的引用队列中。我们可从引用队列中获取到相应的对象信息，同时进行额外的处理。比如反向操作，数据清理，资源释放等。

------

下面使用「虚引用」与「引用队列」实战说明 [源码 ](https://github.com/GourdErwa/java-advanced/blob/master/java-jvm/src/main/java/io/gourd/java/jvm/ref/PhantomReferenceExample.java) ：

- 创建一个 Map ，Key 是一个虚引用，虚引用关联 ReferenceQueue 队列，每当 Key 被回收时，这个 Key 会入队列。
- 起一个线程不停的取队列中的回收对象进行打印操作。
- 向 Map 循环 N 次，每次 put 一个大小为 1M 的字节数组，随着内存增长，垃圾回收器开始工作。
- 垃圾回收器工作时，可以看到队列中将被回收的对象信息。

```java
@Slf4j
public class PhantomReferenceExample {

    private static final ReferenceQueue<byte[]> RQ = new ReferenceQueue<>();

    public static void main(String[] args) {
        final Map<PhantomReference<byte[]>, Object> map = new HashMap<>();

        final Thread thread = new Thread(() -> {
            try {
                int cnt = 0;
                PhantomReference<byte[]> k;
                while ((k = (PhantomReference<byte[]>) RQ.remove()) != null) {
                    log.info("第 {} 个回收对象，对象打印为：{}", cnt++, k);
                }
            } catch (InterruptedException ignored) {
            }
        });
        thread.setDaemon(true);
        thread.start();

        for (int i = 0; i < 1000; i++) {
            map.put(new PhantomReference<>(new byte[1024 * 1024], RQ), new Object());
        }

        log.info("map.size ：{}", map.size());
    }
    /* 部分输出如下：
     * 第 789 个回收对象，对象打印为：java.lang.ref.PhantomReference@26653222
     * 第 790 个回收对象，对象打印为：java.lang.ref.PhantomReference@553f17c
     * 第 791 个回收对象，对象打印为：java.lang.ref.PhantomReference@56ac3a89
     * 第 792 个回收对象，对象打印为：java.lang.ref.PhantomReference@6fd02e5
     * 第 793 个回收对象，对象打印为：java.lang.ref.PhantomReference@2b98378d
     * 第 794 个回收对象，对象打印为：java.lang.ref.PhantomReference@26be92ad
     * 第 795 个回收对象，对象打印为：java.lang.ref.PhantomReference@6d00a15d
     * map.size ：1000
     */
}

 
        Copied!
    
```

一般情况我们很少使用软、弱、虚三种引用，如果使用请深入研究其利害，避免引起不必要的 Bug ，通常情况多用于缓存操作，防止缓存无限增长导致内存溢出。

## 六、应用场景

- WeakHashMap 实现类，如果 WeakHashMap 中的 Key 对象如果不需要了，WeakHashMap 内部可以配合 ReferenceQueue 引用队列进行移除
- 缓存的实现，因为缓存一般情况会长时间存活，如果缓存的元素已经失效了，使用软弱引用配合 ReferenceQueue 引用队列可以执行清除操作
- 使用虚引用，完成垃圾回收时的消息回调等操作

## 总结

- 引用可区分为强、软、弱、虚四种，后三种可配合「引用队列」进行一些回收前的操作

## 参考