## 阿里面试回顾： 说说强引用、软引用、弱引用、虚引用？

我们都知道 JVM 垃圾回收中，GC判断堆中的对象实例或数据是不是垃圾的方法有**引用计数法**和**可达性算法**两种。

无论是通过引用计数算法判断对象的引用数量，还是通过根搜索算法判断对象的引用链是否可达，判定对象是否存活都与“引用”有关。

### 引用

先说说引用，Java中的引用，类似 C 语言中的指针。初学 Java时，我们就知道 Java 数据类型分两大类，基本类型和引用类型。

>基本类型：编程语言中内置的最小粒度的数据类型。它包括四大类八种类型：
>
>- 4种整数类型：byte、short、int、long
>- 2种浮点数类型：float、double
>- 1种字符类型：char
>- 1种布尔类型：boolean
>
>引用类型：引用类型指向一个对象，不是原始值，指向对象的变量是引用变量。在 Java 里，除了基本类型，其他类型都属于引用类型，它主要包括：类、接口、数组、枚举、注解

有了数据类型，JVM对程序数据的管理就规范化了，不同的数据类型，它的存储形式和位置是不一样的

怎么跑偏了，回归正题，通过引用，可以对堆中的对象进行操作。引用《Java编程思想》中的一段话，

> ”每种编程语言都有自己的数据处理方式。有些时候，程序员必须注意将要处理的数据是什么类型。你是直接操纵元素，还是用某种基于特殊语法的间接表示（例如C/C++里的指针）来操作对象。所有这些在 Java 里都得到了简化，一切都被视为对象。因此，我们可采用一种统一的语法。尽管将一切都“看作”对象，但操纵的标识符实际是指向一个对象的“引用”（reference）。”　　

比如：

```
Person person = new Person("张三");
```

这里的 person 就是指向Person 实例“张三”的引用，我们一般都是通过 person 来操作“张三”实例。



在 JDK 1.2 之前，Java 中的引用的定义很传统：如果 reference 类型的数据中存储的数值代表的是另外一块内存的起始地址，就称该 refrence 数据是代表某块内存、某个对象的引用。这种定义很纯粹，但是太过狭隘，一个对象在这种定义下只有被引用或者没有被引用两种状态，对于如何描述一些“食之无味，弃之可惜”的对象就显得无能为力。

比如我们希望能描述这样一类对象：当内存空间还足够时，则能保留在内存之中；如果内存在进行垃圾收集后还是非常紧张，则可以抛弃这些对象。很多系统的缓存功能都符合这样的应用场景。

在 JDK 1.2 之后，Java 对引用的概念进行了扩充，将引用分为

- 强引用（Strong Reference）
- 软引用（Soft Reference）
- 弱引用（Weak Reference）
- 虚引用（Phantom Reference）

这四种引用强度依次逐渐减弱。  



Java 中引入四种引用的目的是让程序自己决定对象的生命周期，JVM 是通过垃圾回收器对这四种引用做不同的处理，来实现对象生命周期的改变。



### JDK 8中的 UML关系图

![Finalizer.png](https://i.loli.net/2020/05/07/AqsHUeYCOf2hzZc.png)

FinalReference 类是包内可见，其他三种引用类型均为 public，可以在应用程序中直接使用。



### 强引用

在 Java 中最常见的就是强引用，把一个对象赋给一个引用变量，这个引用变量就是一个强引用。类似 `“Object obj = new Object()”` 这类的引用。

当一个对象被强引用变量引用时，它处于可达状态，是不可能被垃圾回收器回收的，即使该对象永远不会被用到也不会被回收。

当内存不足，JVM 开始垃圾回收，对于强引用的对象，**就算是出现了 OOM 也不会对该对象进行回收，打死都不收。**因此强引用有时也是造成 Java 内存泄露的原因之一。

对于一个普通的对象，如果没有其他的引用关系，只要超过了引用的作用域或者显示地将相应（强）引用赋值为 null，一般认为就是可以被垃圾收集器回收。（具体回收时机还要要看垃圾收集策略）。

**coding~**

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

demo 中尽管 o1已经被回收，但是 o2 强引用 o1，一直存在，所以不会被GC回收



### 软引用

软引用是一种相对强引用弱化了一些的引用，需要用`java.lang.ref.SoftReference` 类来实现，可以让对象豁免一些垃圾收集。

软引用用来描述一些还有用，但并非必需的对象。对于软引用关联着的对象，在系统将要发生内存溢出异常之前，将会把这些对象列进回收范围之中并进行第二次回收。如果这次回收还是没有足够的内存，才会抛出内存溢出异常。

对于只有软引用的对象来说：当系统内存充足时它不会被回收，当系统内存不足时它才会被回收。

**coding~**

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



软引用通常用在对内存敏感的程序中，比如高速缓存就有用到软引用，内存够用的时候就保留，不够用就回收。

我们看下 Mybatis 缓存类 SoftCache 用到的软引用

```java
public Object getObject(Object key) {
    Object result = null;
    SoftReference<Object> softReference = (SoftReference)this.delegate.getObject(key);
    if (softReference != null) {
        result = softReference.get();
        if (result == null) {
            this.delegate.removeObject(key);
        } else {
            synchronized(this.hardLinksToAvoidGarbageCollection) {
                this.hardLinksToAvoidGarbageCollection.addFirst(result);
                if (this.hardLinksToAvoidGarbageCollection.size() > this.numberOfHardLinks) {
                    this.hardLinksToAvoidGarbageCollection.removeLast();
                }
            }
        }
    }
    return result;
}
```



### 弱引用

弱引用也是用来描述非必需对象的，但是它的强度比软引用更弱一些，被弱引用关联的对象只能生存到下一次垃圾收集发生之前。当垃圾收集器工作时，无论当前内存是否足够，都会回收掉只被弱引用关联的对象。

弱引用需要用`java.lang.ref.WeakReference`类来实现，它比软引用的生存期更短。

对于只有软引用的对象来说，只要垃圾回收机制一运行，不管 JVM 的内存空间是否足够，都会回收该对象占用的内存。

**coding~**

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

> Weak reference objects, which do not prevent their referents from being made finalizable, finalized, and then reclaimed. Weak references are most often used to implement canonicalizing mappings.

官方文档这么写的，弱引用常被用来实现规范化映射，JDK 中的 WeakHashMap 就是一个这样的例子

> 面试官：既然你都知道弱引用，那能说说 WeakHashMap 吗

```java
public class WeakHashMapDemo {

    public static void main(String[] args) throws InterruptedException {
        myHashMap();
        myWeakHashMap();
    }

    public static void myHashMap() {
        HashMap<String, String> map = new HashMap<String, String>();
        String key = new String("k1");
        String value = "v1";
        map.put(key, value);
        System.out.println(map);

        key = null;
        System.gc();

        System.out.println(map);
    }

    public static void myWeakHashMap() throws InterruptedException {
        WeakHashMap<String, String> map = new WeakHashMap<String, String>();
        //String key = "weak";
        // 刚开始写成了上边的代码
        //思考一下，写成上边那样会怎么样？ 那可不是引用了
        String key = new String("weak");
        String value = "map";
        map.put(key, value);
        System.out.println(map);
        //去掉强引用
        key = null;
        System.gc();
        Thread.sleep(1000);
        System.out.println(map);
    }
}
```



我们看下 ThreadLocal  中用到的弱引用

```java
static class ThreadLocalMap {

    static class Entry extends WeakReference<ThreadLocal<?>> {
        Object value;

        Entry(ThreadLocal<?> k, Object v) {
            super(k);
            value = v;
        }
    }
    //......
}
```



### 虚引用

虚引用也称为“**幽灵引用**”或者“**幻影引用**”，它是最弱的一种引用关系。

虚引用，顾名思义，就是形同虚设，与其他几种引用都不太一样，一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用来取得一个对象实例。

虚引用需要`java.lang.ref.PhantomReference` 来实现。

如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回收器回收，它不能单独使用也不能通过它访问对象，虚引用必须和引用队列（RefenenceQueue）联合使用。

虚引用的主要作用是跟踪对象垃圾回收的状态。仅仅是提供了一种确保对象被 finalize 以后，做某些事情的机制。

PhantomReference 的 get 方法总是返回 null，因此无法访问对应的引用对象。其意义在于说明一个对象已经进入 finalization 阶段，可以被 GC 回收，用来实现比 finalization 机制更灵活的回收操作。

换句话说，**设置虚引用的唯一目的，就是在这个对象被回收器回收的时候收到一个系统通知或者后续添加进一步的处理**。

Java 允许使用 finalize() 方法在垃圾收集器将对象从内存中清除出去之前做必要的清理工作。

```java
public class PhantomReferenceDemo {

    public static void main(String[] args) throws InterruptedException {
        Object o1 = new Object();
        ReferenceQueue<Object> referenceQueue = new ReferenceQueue<Object>();
        PhantomReference<Object> phantomReference = new PhantomReference<Object>(o1,referenceQueue);

        System.out.println(o1);
        System.out.println(referenceQueue.poll());
        System.out.println(phantomReference.get());

        o1 = null;
        System.gc();
        Thread.sleep(3000);

        System.out.println(o1);
        System.out.println(referenceQueue.poll()); //引用队列中
        System.out.println(phantomReference.get());
    }

}
```

```
java.lang.Object@4554617c
null
null
null
java.lang.ref.PhantomReference@74a14482
null
```



### 引用队列

ReferenceQueue 是用来配合引用工作的，没有ReferenceQueue 一样可以运行。

SoftReference、WeakReference、PhantomReference 都有一个可以传递 ReferenceQueue 的构造器。

创建引用的时候，可以指定关联的队列，当 GC 释放对象内存的时候，会将引用加入到引用队列。如果程序发现某个虚引用已经被加入到引用队列，那么就可以在所引用的对象的内存被回收之前采取必要的行动，这相当于是一种通知机制。

当关联的引用队列中有数据的时候，意味着指向的堆内存中的对象被回收。通过这种方式，JVM 允许我们在对象被销毁后，做一些我们自己想做的事情。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1geleex85g0j319i0u0nke.jpg)



最后，稍微了解下源码中的实现

### Reference源码(JDK8)

强软弱虚四种引用，我们有了个大概的认识，我们也知道除了强引用没有对应的类型表示，是普遍存在的。剩下的三种引用都是 `java.lang.ref.Reference` 的直接子类。

> 那就会有疑问了，我们可以通过继承 Reference，自定义引用类型吗？

> Abstract base class for reference objects. This class defines the operations common to all reference objects. Because reference objects are implemented in close cooperation with the garbage collector, this class may not be subclassed directly.

JDK 官方文档是这么说的，`Reference`是所有引用对象的基类。这个类定义了所有引用对象的通用操作。因为引用对象是与垃圾收集器紧密协作而实现的，所以这个类可能不能直接子类化。

#### Reference 的4种状态

- Active：新创建的引用实例处于Active状态，但当GC检测到该实例引用的实际对象的可达性发生某些改变(实际对象处于 GC roots 不可达)后，它的状态将变化为`Pending`或者`Inactive`。如果 Reference 注册了ReferenceQueue，则会切换为`Pending`，并且Reference会加入`pending-Reference`链表中，如果没有注册ReferenceQueue，会切换为`Inactive`。
- Pending：当引用实例被放置在pending-Reference 链表中时，它处于Pending状态。此时，该实例在等待一个叫Reference-handler的线程将此实例进行enqueue操作。如果某个引用实例没有注册在一个引用队列中，该实例将永远不会进入Pending状态
- Enqueued：在ReferenceQueue队列中的Reference的状态，如果Reference从队列中移除，会进入`Inactive`状态
- Inactive：一旦某个引用实例处于Inactive状态，它的状态将不再会发生改变，同时说明该引用实例所指向的实际对象一定会被GC所回收

![img](http://imushan.com/img/image-20180820230137796.png)



#### `Reference`的构造函数和成员变量

```java
public abstract class Reference<T> {
   //引用指向的对象
   private T referent;    
   // reference被回收后，当前Reference实例会被添加到这个队列中
   volatile ReferenceQueue<? super T> queue;
   //下一个Reference实例的引用，Reference实例通过此构造单向的链表
   volatile Reference next;
   //由transient修饰，基于状态表示不同链表中的下一个待处理的对象，主要是pending-reference列表的下一个元素，通过JVM直接调用赋值
   private transient Reference<T> discovered;
   // 等待加入队列的引用列表，这里明明是个Reference类型的对象，官方文档确说是个list?
   //因为GC检测到某个引用实例指向的实际对象不可达后，会将该pending指向该引用实例，
   //discovered字段则是用来表示下一个需要被处理的实例，因此我们只要不断地在处理完当前pending之后，将discovered指向的实例赋予给pending即可。所以这个pending就相当于是一个链表。
   private static Reference<Object> pending = null;
    
    /* -- Constructors -- */
    Reference(T referent) {
        this(referent, null);
    }

    Reference(T referent, ReferenceQueue<? super T> queue) {
        this.referent = referent;
        this.queue = (queue == null) ? ReferenceQueue.NULL : queue;
    }
}
```

Reference 提供了两个构造器，一个带引用队列 ReferenceQueue，一个不带。

带 ReferenceQueue 的意义在于我们可以从外部通过对 ReferenceQueue 的操作来了解到引用实例所指向的实际对象是否被回收了，同时我们也可以通过 ReferenceQueue  对引用实例进行一些额外的操作；但如果我们的引用实例在创建时没有指定一个引用队列，那我们要想知道实际对象是否被回收，就只能够不停地轮询引用实例的get() 方法是否为空了。

值得注意的是虚引用 PhantomReference，由于它的 get() 方法永远返回 null，因此它的构造函数必须指定一个引用队列。

这两种查询实际对象是否被回收的方法都有应用，如 WeakHashMap 中就选择去查询 queue 的数据，来判定是否有对象将被回收；而 ThreadLocalMap，则采用判断 get() 是否为 null 来作处理。

#### 实例方法(和ReferenceHandler线程不相关的方法)

```java
private static Lock lock = new Lock();
// 获取持有的referent实例
public T get() {
    return this.referent;
}
// 把持有的referent实例置为null
public void clear() {
    this.referent = null;
}
// 判断是否处于enqeued状态
public boolean isEnqueued() {
    return (this.queue == ReferenceQueue.ENQUEUED);
}
// 入队参数，同时会把referent置为null
public boolean enqueue() {
    return this.queue.enqueue(this);
}
```

#### ReferenceHandler线程

通过上文的讨论，我们知道一个Reference实例化后状态为Active，其引用的对象被回收后，垃圾回收器将其加入到`pending-Reference`链表，等待加入ReferenceQueue。

ReferenceHandler线程是由`Reference`静态代码块中建立并且运行的线程，它的运行方法中依赖了比较多的本地(native)方法，ReferenceHandler线程的主要功能就pending list中的引用实例添加到引用队列中，并将pending指向下一个引用实例。

```java
// 控制垃圾回收器操作与Pending状态的Reference入队操作不冲突执行的全局锁
// 垃圾回收器开始一轮垃圾回收前要获取此锁
// 所以所有占用这个锁的代码必须尽快完成，不能生成新对象，也不能调用用户代码
static private class Lock { }
private static Lock lock = new Lock();

private static class ReferenceHandler extends Thread {

    private static void ensureClassInitialized(Class<?> clazz) {
        try {
            Class.forName(clazz.getName(), true, clazz.getClassLoader());
        } catch (ClassNotFoundException e) {
            throw (Error) new NoClassDefFoundError(e.getMessage()).initCause(e);
        }
    }

    static {
        ensureClassInitialized(InterruptedException.class);
        ensureClassInitialized(Cleaner.class);
    }

    ReferenceHandler(ThreadGroup g, String name) {
        super(g, name);
    }

    public void run() {
        while (true) {
            tryHandlePending(true);
        }
    }
}

static boolean tryHandlePending(boolean waitForNotify) {
    Reference<Object> r;
    Cleaner c;
    try {
        synchronized (lock) {
            // 判断pending-Reference链表是否有数据
            if (pending != null) {
                // 如果有Pending Reference，从列表中取出
                r = pending;
                c = r instanceof Cleaner ? (Cleaner) r : null;
                // unlink 'r' from 'pending' chain
                pending = r.discovered;
                r.discovered = null;
            } else {
				// 如果没有Pending Reference，调用wait等待
                if (waitForNotify) {
                    lock.wait();
                }
                // retry if waited
                return waitForNotify;
            }
        }
    } catch (OutOfMemoryError x) {
        Thread.yield();
        return true;
    } catch (InterruptedException x) {
        return true;
    }

    // Fast path for cleaners
    if (c != null) {
        c.clean();
        return true;
    }

    ReferenceQueue<? super Object> q = r.queue;
    if (q != ReferenceQueue.NULL) q.enqueue(r);
    return true;
}

//ReferenceHandler线程是在Reference的static块中启动的
static {
    // ThreadGroup继承当前执行线程(一般是主线程)的线程组
    ThreadGroup tg = Thread.currentThread().getThreadGroup();
    for (ThreadGroup tgn = tg;
         tgn != null;
         tg = tgn, tgn = tg.getParent());
    // 创建线程实例，命名为Reference Handler，配置最高优先级和后台运行(守护线程)，然后启动
    Thread handler = new ReferenceHandler(tg, "Reference Handler");
    // ReferenceHandler线程有最高优先级
    handler.setPriority(Thread.MAX_PRIORITY);
    handler.setDaemon(true);
    handler.start();

    // provide access in SharedSecrets
    SharedSecrets.setJavaLangRefAccess(new JavaLangRefAccess() {
        @Override
        public boolean tryHandlePendingReference() {
            return tryHandlePending(false);
        }
    });
}
```

由于ReferenceHandler线程是`Reference`的静态代码创建的，所以只要`Reference`这个父类被初始化，该线程就会创建和运行，由于它是守护线程，除非 JVM 进程终结，否则它会一直在后台运行(注意它的`run()`方法里面使用了死循环)。



### ReferenceQueue源码

```java
public class ReferenceQueue<T> {

    public ReferenceQueue() { }
	// 内部类Null类继承自ReferenceQueue，覆盖了enqueue方法返回false
    private static class Null<S> extends ReferenceQueue<S> {
        boolean enqueue(Reference<? extends S> r) {
            return false;
        }
    }
 	// 用于标识没有注册Queue
    static ReferenceQueue<Object> NULL = new Null<>();
    // 用于标识已经处于对应的Queue中
    static ReferenceQueue<Object> ENQUEUED = new Null<>();

    // 静态内部类，作为锁对象
    static private class Lock { };
    /* 互斥锁，用于同步ReferenceHandler的enqueue和用户线程操作的remove和poll出队操作 */
    private Lock lock = new Lock();
    // 引用链表的头节点
    private volatile Reference<? extends T> head = null;
    // 引用队列长度，入队则增加1，出队则减少1
    private long queueLength = 0;

    // 入队操作，只会被Reference实例调用
    boolean enqueue(Reference<? extends T> r) { /* Called only by Reference class */
        synchronized (lock) {
			// 如果引用实例持有的队列为ReferenceQueue.NULL或者ReferenceQueue.ENQUEUED则入队失败返回false
            ReferenceQueue<?> queue = r.queue;
            if ((queue == NULL) || (queue == ENQUEUED)) {
                return false;
            }
            assert queue == this;
            // 当前引用实例已经入队，那么它本身持有的引用队列实例置为ReferenceQueue.ENQUEUED
            r.queue = ENQUEUED;
            // 如果链表没有元素，则此引用实例直接作为头节点，否则把前一个引用实例作为下一个节点
            r.next = (head == null) ? r : head;
            // 当前实例更新为头节点，也就是每一个新入队的引用实例都是作为头节点，已有的引用实例会作为后继节点
            head = r;
            // 队列长度增加1
            queueLength++;
            // 特殊处理FinalReference，VM进行计数
            if (r instanceof FinalReference) {
                sun.misc.VM.addFinalRefCount(1);
            }
            // 唤醒所有等待的线程
            lock.notifyAll();
            return true;
        }
    }

    // 引用队列的poll操作，此方法必须在加锁情况下调用
    private Reference<? extends T> reallyPoll() {       /* Must hold lock */
        Reference<? extends T> r = head;
        if (r != null) {
            @SuppressWarnings("unchecked")
            Reference<? extends T> rn = r.next;
            // 更新next节点为头节点，如果next节点为自身，说明已经走过一次出队，则返回null
            head = (rn == r) ? null : rn;
            r.queue = NULL;
            // 当前头节点变更为环状队列，考虑到FinalReference尚为inactive和避免重复出队的问题
            r.next = r;
            // 队列长度减少1
            queueLength--;
            if (r instanceof FinalReference) {
                sun.misc.VM.addFinalRefCount(-1);
            }
            return r;
        }
        return null;
    }

    // 队列的公有poll操作，主要是加锁后调用reallyPoll
    public Reference<? extends T> poll() {
        if (head == null)
            return null;
        synchronized (lock) {
            return reallyPoll();
        }
    }
// 移除引用队列中的下一个引用元素，实际上也是依赖于reallyPoll的Object提供的阻塞机制
    public Reference<? extends T> remove(long timeout)
        throws IllegalArgumentException, InterruptedException
    {
        if (timeout < 0) {
            throw new IllegalArgumentException("Negative timeout value");
        }
        synchronized (lock) {
            Reference<? extends T> r = reallyPoll();
            if (r != null) return r;
            long start = (timeout == 0) ? 0 : System.nanoTime();
            for (;;) {
                lock.wait(timeout);
                r = reallyPoll();
                if (r != null) return r;
                if (timeout != 0) {
                    long end = System.nanoTime();
                    timeout -= (end - start) / 1000_000;
                    if (timeout <= 0) return null;
                    start = end;
                }
            }
        }
    }

    public Reference<? extends T> remove() throws InterruptedException {
        return remove(0);
    }

    void forEach(Consumer<? super Reference<? extends T>> action) {
        for (Reference<? extends T> r = head; r != null;) {
            action.accept(r);
            @SuppressWarnings("unchecked")
            Reference<? extends T> rn = r.next;
            if (rn == r) {
                if (r.queue == ENQUEUED) {
                    // still enqueued -> we reached end of chain
                    r = null;
                } else {
                    // already dequeued: r.queue == NULL; ->
                    // restart from head when overtaken by queue poller(s)
                    r = head;
                }
            } else {
                // next in chain
                r = rn;
            }
        }
    }
}
```

`ReferenceQueue`只存储了`Reference`链表的头节点，真正的`Reference`链表的所有节点是存储在`Reference`实例本身，通过属性 next 拼接的，`ReferenceQueue`提供了对`Reference`链表的入队、poll、remove等操作



## 参考与感谢

https://juejin.im/post/5bce68226fb9a05ce46a0476

http://www.kdgregory.com/index.php?page=java.refobj

https://blog.csdn.net/Jesministrator/article/details/78786162

http://throwable.club/2019/02/16/java-reference/

《深入理解java虚拟机》

