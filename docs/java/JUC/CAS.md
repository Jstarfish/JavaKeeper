# 从 Atomic 到 CAS ，竟然衍生出这么多 20k+ 面试题

> CAS 知道吗，如何实现？
> 讲一讲 AtomicInteger，为什么要用 CAS 而不是 synchronized？
> CAS 底层原理，谈谈你对 UnSafe 的理解？
> AtomicInteger 的ABA问题，能说一下吗，原子更新引用知道吗？
> CAS 有什么缺点吗？ 如何规避 ABA 问题？



## 前言

Java 内存模型要保证可见性，原子性和有序性。

在 JDK 5之前 Java 语言是靠 synchronized 关键字保证同步的，但 synchronized 是一种独占锁，是一种悲观锁， **会导致其它所有需要锁的线程挂起，等待持有锁的线程释放锁** ，效率不是很高。

Java 虚拟机又提供了一个轻量级的同步机制——volatile（[面试必问的 volatile，你真的理解了吗](https://mp.weixin.qq.com/s/QLf3CyLcqOHX2B6pS-a0Uw )）

但是 volatile 算是乞丐版的 synchronized，并不能保证原子性 ，所以，又增加了`java.util.concurrent.atomic`包， 这个包下提供了一系列原子类。



## 1. Atomic 原子类

Atomic 原子类可以保证多线程环境下，当某个线程在执行 atomic 的方法时，不会被其他线程打断，而别的线程就像自旋锁一样，一直等到该方法执行完成，才由 JVM 从等待队列中选择一个线程执行。Atomic 类在软件层面上是非阻塞的，它的原子性其实是在硬件层面上借助相关的指令来保证的。 

![](https://tva1.sinaimg.cn/large/00831rSTly1gdc9ufejhyj30mg0n8n0f.jpg)



Atomic 包中的类可以分成 4 组：

1. 基本类型：AtomicBoolean，AtomicInteger，AtomicLong
2.  数组类型：AtomicIntegerArray，AtomicLongArray，AtomicReferenceArray
3.  引用类型：AtomicReference，AtomicMarkableReference，AtomicStampedReference
4.  对象的属性修改类型（原子化对象属性更新器） ：AtomicIntegerFieldUpdater，AtomicLongFieldUpdater，AtomicReferenceFieldUpdater
5.  JDK1.8 新增（原子化的累加器）：DoubleAccumulator、LongAccumulator、DoubleAdder、LongAdder、Striped64



以 AtomicInteger 为例了解常用方法

| 方法                    | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| get()                   | 直接返回值                                                   |
| addAndGet(int)          | 增加指定的数据后返回增加后的数据，相当于 i++                 |
| getAndAdd(int)          | 增加指定的数据，返回变化前的数据，相当于 ++i                 |
| getAndIncrement()       | 增加1，返回增加前的数据                                      |
| getAndDecrement()       | 减少1，返回减少前的数据                                      |
| getAndSet(int)          | 设置指定的数据，返回设置前的数据                             |
| decrementAndGet()       | 减少1，返回减少后的值                                        |
| incrementAndGet()       | 增加1，返回增加后的值                                        |
| floatValue()            | 转化为浮点数返回                                             |
| intValue()              | 转化为int 类型返回                                           |
| set(int)                | 设置为给定值                                                 |
| lazySet(int)            | 仅仅当get时才会set http://ifeve.com/juc-atomic-class-lazyset-que/ |
| compareAndSet(int, int) | 尝试新增后对比，若增加成功则返回true否则返回false            |

### Coding~~~

```java
public class CASDemo {
    public static void main(String[] args) {
        System.out.println(num.compareAndSet(6, 7) + "\t + current num:" + num);
        System.out.println(num.compareAndSet(6, 7) + "\t current num:" + num);
    }
}
```

```
true	 + current num:7
false	 current num:7
```

执行两次结果却不同，Why? 

`compareAndSet()` 尝试新增后对比，若增加成功则返回true否则返回false。其实就是比较并交换，判断用当前值和期望值（第一个参数），是否一致，如果一致，修改为更新值（第二个参数），这就是大名鼎鼎的 CAS。



## 2. CAS 是什么

### 2.1 CAS 算法

- CAS：全称 `Compare and swap`，即**比较并交换**，它是一条 **CPU 同步原语**。 是一种硬件对并发的支持，针对多处理器操作而设计的一种特殊指令，用于管理对共享数据的并发访问。 
- CAS 是一种**无锁的非阻塞算法**的实现。 
- CAS 包含了 3 个操作数：
  - 需要读写的内存值 V 
  - 旧的预期值 A 
  - 要修改的更新值 B 
- 当且仅当 V 的值等于 A 时，CAS 通过原子方式用新值 B 来更新 V 的 值，否则不会执行任何操作（他的功能是判断内存某个位置的值是否为预期值，如果是则更改为新的值，这个过程是原子的。）

CAS 并发原语体现在 Java 语言中的 `sum.misc.Unsafe` 类中的各个方法。调用 Unsafe 类中的 CAS 方法， JVM 会帮助我们实现出 CAS 汇编指令。这是一种完全依赖于硬件的功能，通过它实现了原子操作。再次强调，由于 CAS是一种系统原语，**原语属于操作系统用于范畴，是由若干条指令组成的，用于完成某个功能的一个过程，并且原语的执行必须是连续的，在执行过程中不允许被中断**，CAS 是一条 CPU 的原子指令，不会造成数据不一致问题。

我们常用的 `java.util.concurrent` 包就建立在CAS之上。



### 2.2 用 CAS 分析 AtomicInteger 类

查看 AtomicInteger 代码如下，可以看到该类下的方法大部分是 调用了 **Unsafe** 类

![](https://tva1.sinaimg.cn/large/00831rSTly1gd7dmmn1erj312q0lin1t.jpg)

#### 2.2.1 UnSafe 类

是 CAS 的核心类，由于 Java 方法无法直接访问底层系统，需要通过本地（native）方法来访问，UnSafe 相当于一个后门，基于该类可以直接操作特定内存的数据。UnSafe 类存在与 `sum.misc` 包中，其内部方法可以像 C 语言的指针一样直接操作内存，因为 Java 中 CAS 操作的执行依赖于 UnSafe 类的方法。

UnSafe 类中的所有方法都是 native 修饰的，也就是说该类中的方法都是直接调用操作系统底层资源执行相应任务。 

```java
public final class Unsafe {
    private static final Unsafe theUnsafe;
	// ......
    @CallerSensitive
    public static Unsafe getUnsafe() {
        Class var0 = Reflection.getCallerClass();
        if (!VM.isSystemDomainLoader(var0.getClassLoader())) {
            throw new SecurityException("Unsafe");
        } else {
            return theUnsafe;
        }
    }

    public native int getInt(Object var1, long var2);

    public native void putInt(Object var1, long var2, int var4);

    public native Object getObject(Object var1, long var2);

    public native void putObject(Object var1, long var2, Object var4); 
    
    public final native boolean compareAndSwapObject(Object var1, long var2, Object var4, Object var5);
    
    public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);
    // ......
}
```

Unsafe 类为一单例实现，提供静态方法 getUnsafe 获取 Unsafe 实例，当且仅当调用 getUnsafe 方法的类为引导类加载器所加载时才合法，否则抛出 SecurityException 异常 

#### 2.2.2 valueOffset

AtomicInteger 中的变量 valueOffset 表示该变量值在内存中的偏移地址，因为 UnSafe 就是根据内存偏移地址获取数据。

```java
public final int getAndIncrement() {
	return unsafe.getAndAddInt(this, valueOffset, 1);
}
```

#### 2.2.3 volatile int value

变量 value 用 volatile 修饰，保证了多线程之间的内存可见性。



#### 2.2.4 举个栗子  

我们用线程安全的 ++i 举例，也就是 AtomicInteger 中的  getAndAdd

逐层看 Unsafe 类中的 getAndAdd() 的源码如下

```java
public final int getAndAddInt(Object var1, long var2, int var4) {
    int var5;
    do {
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

    return var5;
}
```

**解毒**：

可以看到 getAndAddInt 方法有 4 个参数

- val1：AtomicInteger 对象本身

- var2：该对象值的引用地址，内存偏移量
- var4： 需要变动的数量，即 ++i 的 i
- var5：用var1， var2 找出的主内存中真实的值（通过内存偏移量）

`this.compareAndSwapInt`  用该对象当前的值与 var5 比较，如果相同，更新 var5 + var4 并且返回 true，如果不同，继续取值然后再比较，直到更新完成。

这一操作没有加锁，反复执行，**既保证了一致性，又保证了并发性**。



假设线程A和线程B两个线程同时执行 getAndAddInt 操作（分别跑在不同CPU上）：

1. AtomicInteger 里面的 value 原始值为 3，即主内存中 AtomicInteger 的 value 为 3，根据 JMM 模型，线程A和线程B各自持有一份值为 3 的 value 的副本分别到各自的工作内存；
2. 线程A通过 getIntVolatile(var1,var2) 拿到 value 值3，这时线程A被挂起；
3. 线程B也通过 getIntVolatile(var1,var2) 方法获取到 value 值 3，此时刚好线程B没有被挂起并执行compareAndSwapInt 方法比较内存值为 3，成功修改内存值为 4，线程B结束，一切正常
4. 这时线程A恢复，执行compareAndSwapInt() 方法比较，发现自己手里的3和主内存的值4不一致，说明该值已经被其他线程抢先一步修改过了，那线程A本次修改失败，重新读取；
5. 线程A重新获取value值，因为变量value 被 volatile 修饰，所以其他线程对它的修改，线程A总是能够看到，线程A继续执行compareAndSwapInt进行比较替换，直到成功



#### 2.2.5 使用 UnSafe 类

那如若想使用这个类，该如何获取其实例？有如下两个可行方案 

1.  从`getUnsafe` 方法的使用限制条件出发，通过Java命令行命令 `-Xbootclasspath/a` 把调用 Unsafe 相关方法的类A所在 jar 包路径追加到默认的 bootstrap 路径中，使得A被引导类加载器加载，从而通过`Unsafe.getUnsafe `方法安全的获取 Unsafe 实例。 

   ```
   java -Xbootclasspath/a: ${path}   // 其中path为调用Unsafe相关方法的类所在jar包路径 
   ```

2. 通过反射技术暴力获取 Unsafe 对象

   ```java
   private static Unsafe reflectGetUnsafe() {
       try {
         Field field = Unsafe.class.getDeclaredField("theUnsafe");
         field.setAccessible(true);
         return (Unsafe) field.get(null);
       } catch (Exception e) {
         log.error(e.getMessage(), e);
         return null;
       }
   }
   ```

美团技术团队有一篇介绍Unsafe 类的文章：[Java魔法类：Unsafe应用解析](https://tech.meituan.com/2019/02/14/talk-about-java-magic-class-unsafe.html)



## 3. CAS 缺点

- 循环时间长，开销很大。CAS算法需要不断地自旋来读取最新的内存值，长时间读取不到就会造成不必要的CPU开销。 

  do while 如果CAS失败，会一直进行尝试，如果CAS长时间一直不成功，可能会给CPU带来很大的开销

- 只能保证一个共享变量的原子操作

  当对一个共享变量执行操作时，我们可以使用循环CAS的方式来保证原子操作，但是，对多个共享变量操作时，循环CAS就无法保证操作的原子性，这个时候就可以用锁来保证原子性。
  
- ABA 问题

  

### ABA 问题

ABA 问题是什么？是如何产生的？

CAS算法实现一个重要前提是需要取出内存中某时刻的数据并在当下时刻比较并替换，那么在这个时间差类会导致数据的变化。

比如线程1从内存位置 V 中取出A，这时线程2也从内存中取出A，并且线程2进行了一些操作将值变成了B，然后线程2又将V位置的数据变成A，这个时候线程1进行CAS操作发现内存中仍然是A，线程1就会误认为它没有被修改过，这个漏洞就是CAS操作的"ABA"问题。

**尽管线程1的CAS操作成功，但是不代表这个过程就是没有问题的。**



#### 原子引用

我们平时操作的不止是基本数据类型，大多数情况其实是类对象，Atomic 提供的引用类型 AtomicReference 通过泛型可以支持对对象的原子操作

```java
public class AtomicRefrenceDemo {

    public static void main(String[] args) {

        User tom = new User("tom",18);
        User jim = new User("jim",20);

        AtomicReference<User> user = new AtomicReference<>();
        user.set(tom);

        System.out.println(user.compareAndSet(tom, jim)+"\t"+user.get().toString());
        System.out.println(user.compareAndSet(tom, jim)+"\t"+user.get().toString());

    }
}

class User{
    String name;
    int age;
    public User(String tom, int i) {
    }
}
```

除了AtomicReference ，Atomic 还提供了AtomicStampedReference、AtomicMarkableReference



### 解决ABA 问题

各种乐观锁的实现中通常都会用版本戳 version 来对记录或对象标记，避免并发操作带来的问题 

在Java中，AtomicStampedReference\<V> 也实现了这个作用，它通过包装[E,int]的元组来对对象标记版本戳stamp，从而避免ABA问题 

```java
public class AtomicStampedReferenceDemo {

    static AtomicStampedReference<String> asf = new AtomicStampedReference<>("A", 1);

    public static void main(String[] args) {

        new Thread(() -> {
            String value = asf.getReference();
            System.out.println("Thread1 current value: " + asf.getReference() + ", stamp: " + asf.getStamp());

            asf.compareAndSet(value, "B", asf.getStamp(), asf.getStamp() + 1);
            System.out.println("Thread1： " + value + "——>" + asf.getReference() + ",stamp:" + asf.getStamp());
            value = asf.getReference();
            asf.compareAndSet(asf.getReference(), "A", asf.getStamp(), asf.getStamp() + 1);
            System.out.println("Thread1： " + value + "——>" + asf.getReference() + ",stamp:" + asf.getStamp());
        }).start();

        new Thread(() -> {
            String value = asf.getReference();

            int stamp = asf.getStamp();
            System.out.println("Thread2 current value: " + asf.getReference() + ", stamp: " + stamp);

            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Thread2: " + value + "——>" + "B" + ",stamp:" + stamp + 1);
            boolean flag = asf.compareAndSet(value, "B", stamp, stamp + 1);
            if (flag) {
                System.out.println("Thread2 update from " + value + " to B");
            } else {
                System.out.println("Thread2 update fail");
            }
        }).start();
    }
}
```

```
Thread1 current value: A, stamp: 1
Thread2 current value: A, stamp: 1
Thread1： A——>B,stamp:2
Thread1： B——>A,stamp:3
Thread2: A——>B,stamp:11
Thread2 update fail
```

