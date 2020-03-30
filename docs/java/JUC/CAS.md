# 从 Atomic 到 CAS

> CAS 知道吗，如何实现？
>
> 讲一讲AtomicInteger，为什么要用CAS而不是synchronized？
>
> CAS底层原理，谈谈你对 UnSafe 的理解？
>
> AtomicInteger 的ABA问题，能说一下吗，原子更新引用知道吗？
>
> 如何规避 ABA 问题？



## 前言

Java 内存模型要保证可见性，原子性和有序性。

在 JDK 5之前 Java 语言是靠 synchronized 关键字保证同步的，但 synchronized 是一种独占锁，是一种悲观锁， **会导致其它所有需要锁的线程挂起，等待持有锁的线程释放锁** ，效率不是很高。

Java 虚拟机又提供了一个轻量级的同步机制——volatile（[面试必问的 volatile，你真的理解了吗](https://mp.weixin.qq.com/s/QLf3CyLcqOHX2B6pS-a0Uw )）

但是 volatile 算是乞丐版的 synchronized，并不能保证原子性 ，所以，又增加了`java.util.concurrent.atomic`包， 这个包下提供了一系列原子类。



## Atomic 原子类

Atomic 原子类可以保证多线程环境下，当某个线程在执行 atomic 的方法时，不会被其他线程打断，而别的线程就像自旋锁一样，一直等到该方法执行完成，才由 JVM 从等待队列中选择一个线程执行。Atomic类在软件层面上是非阻塞的，它的原子性其实是在硬件层面上借助相关的指令来保证的。 

![](https://tva1.sinaimg.cn/large/00831rSTly1gdc9ufejhyj30mg0n8n0f.jpg)



Atomic包中的类可以分成4组：

1. 基本类型：AtomicBoolean，AtomicInteger，AtomicLong
2.  数组类型：tomicIntegerArray，AtomicLongArray，AtomicReferenceArray
3.  引用类型：AtomicReference，AtomicMarkableReference，AtomicStampedReference
4.  对象的属性修改类型 ：AtomicIntegerFieldUpdater，AtomicLongFieldUpdater，AtomicReferenceFieldUpdater



以 AtomicInteger 为例了解常用方法

| 方法                    | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| get()                   | 直接返回值                                                   |
| addAndGet(int)          | 增加指定的数据后返回增加后的数据                             |
| getAndAdd(int)          | 增加指定的数据，返回变化前的数据                             |
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

`compareAndSet()` 比较并交换，判断用当前值和期望值（第一个参数），是否一致，如果一致，修改为更新值（第二个参数），这就是大名鼎鼎的 CAS



## CAS 是什么

CAS: 全称 `Compare and swap`，它是一条 **CPU 并发原语**。

他的功能是判断内存某个位置的值是否为预期值，如果是则更改为新的值，这个过程是原子的。

CAS 并发原语体现在 Java 语言中的 sum.misc.Unsafe 类中的各个方法。调用Unsafe 类中的CAS 方法， JVM 会帮助我们实现出 CAS 汇编指令。这是一种完全依赖于硬件的功能，通过它实现了原子操作。再次强调，由于CAS是一种系统原语，原语属于操作系统用于范畴，是由若干条指令组成的，用于完成某个功能的一个过程，并且原语的执行必须是连续的，在执行过程中不允许被中断，CAS是一条CPU的原子指令，不会造成数据不一致问题。



i++ 在多线程环境下用 AtomicInteger 的 getAndIncrement() 为什么是线程安全的

```java
public class CASDemo {

    public static void main(String[] args) {

        AtomicInteger num = new AtomicInteger(6);
        System.out.println(num.compareAndSet(6, 7) + "\t + current num:" + num);
        System.out.println(num.compareAndSet(6, 8) + "\t current num:" + num);
    }
}
```

![](https://tva1.sinaimg.cn/large/00831rSTly1gd7dmmn1erj312q0lin1t.jpg)

#### 1. UnSafe

是CAS的核心类，由于 Java 方法无法直接访问底层系统，需要通过本地（native）方法来访问，UnSafe 相当于一个后门，基于该类可以直接操作特定内存的数据。UnSafe 类存在与 sum.misc 包中，其内部方法可以像 C 的指针一样直接操作内存，因为Java 中CAS 操作的执行依赖于 UnSafe 类的方法。

UnSafe 类中的所有方法都是 native 修饰的，也就是说该类中的方法都是直接调用操作系统底层资源执行相应任务。 

#### 2. valueOffset

变量 valueOffset 表示该变量值在内存中的偏移地址，因为UnSafe 就是根据内存偏移地址获取数据

```java
public final int getAndIncrement() {
	return unsafe.getAndAddInt(this, valueOffset, 1);
}
```

#### 3.变量 value用volatile 修饰，保证了多线程之间的内存可见性



## CAS 是什么



逐层看getAndIncrement() 的源码如下

```java
public final int getAndAddInt(Object var1, long var2, int var4) {
    int var5;
    do {
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

    return var5;
}
```

val1 AtomicInteger对象本身

var2 该对象值得引用地址

var4 需要变动的数量

var5 是用过var1 var2 找出的主内存中真实的值（通过内存偏移量）

用该对象当前的值与var5 比较，如果相同，更新var5 + var4 并且返回true

如果不同，继续取值然后再比较，直到更新完成

没有加锁，反复执行，既保证了一致性，又保证了并发性



假设线程A和线程B两个线程同时执行getAndAddInt操作（分别泡在不同CPU上）：

1. AtomicInteger 里面的value原始值为3，即主内存中AtomicInteger的value为3，根据JMM模型，线程A和线程B各自持有一份值为3的value的副本分别到各自的工作内存；
2. 线程A通过getIntVolatile(var1,var2)拿到value值3，这时线程A被挂起；
3. 线程B也通过getIntVolatile(var1,var2)方法获取到value值3，此时刚好线程B没有被挂起并执行compareAndSwapInt方法比较内存值为3，成功修改内存值为4，线程B结束，一切正常
4. 这时线程A恢复，执行compareAndSwapInt() 方法比较，发现自己手里的3和主内存的值4不一致，说明该值已经被其他线程抢先一步修改过了，那线程A本次修改失败，重新读取；
5. 线程A重新获取value值，因为变量value被volatile修饰，所以其他线程对它的修改，线程A总是能够看到，线程A继续执行compareAndSwapInt进行比较替换，直到成功





![](https://tva1.sinaimg.cn/large/00831rSTly1gd7gj60r2wj31eu0kg15t.jpg)



## CAS 缺点

- 循环时间长，开销很大。CAS算法需要不断地自旋来读取最新的内存值，长时间读取不到就会造成不必要的CPU开销。 

  do while 如果CAS失败，会一直进行尝试，如果CAS长时间一直不成功，可能会给CPU带来很大的开销

- 只能保证一个共享变量的原子操作

  当对一个共享变量执行操作时，我们可以使用循环CAS的方式来保证原子操作，但是，对多个共享变量操作时，循环CAS就无法保证操作的原子性，这个时候就可以用锁来保证原子性。

### ABA 问题

aba问题如何产生的

CAS会导致"ABA问题"

CAS算法实现一个重要前提是需要取出内存中某时刻的数据并在当下时刻比较并替换，那么在这个时间差类会导致数据的变化。

比如说一个线程one从内存位置V中取出A，这时候另一个线程two也从内存中取出A，并且线程two进行了一些操作将值变成了B，然后线程two又将V位置的数据变成A，这个时候线程one进行CAS操作发现内存中仍然是A，然后线程one操作成功。

**尽管线程one的CAS操作成功，但是不代表这个过程就是没有问题的。**



### 原子引用

AtomicReference



解决ABA问题， 新增一种机制，修改版本号（类似时间戳）

### 2.   原子变量 CAS算法 

#### CAS 算法

- CAS (Compare-And-Swap) 是一种硬件对并发的支持，针对多处理器 操作而设计的处理器中的一种特殊指令，用于管理对共享数据的并发访问。 
- CAS 是一种无锁的非阻塞算法的实现。 
- CAS 包含了 3 个操作数：
  - 需要读写的内存值 V 
  - 旧的预期值 A 
  - 要修改的更新值 B 
- 当且仅当 V 的值等于 A 时，CAS 通过原子方式用新值 B 来更新 V 的 值，否则不会执行任何操作。 



#### 原子变量 

- 类的小工具包，支持在单个变量上解除锁的线程安全编程。事实上，此包中的类可 将 volatile 值、字段和数组元素的概念扩展到那些也提供原子条件更新操作的类。 
- 类 AtomicBoolean、AtomicInteger、AtomicLong 和 AtomicReference 的实例各自提供对 相应类型单个变量的访问和更新。每个类也为该类型提供适当的实用工具方法。 
- AtomicIntegerArray、AtomicLongArray 和 AtomicReferenceArray 类进一步扩展了原子操 作，对这些类型的数组提供了支持。这些类在为其数组元素提供 volatile 访问语义方 面也引人注目，这对于普通数组来说是不受支持的。 
- 核心方法：boolean compareAndSet(expectedValue, updateValue) 
- java.util.concurrent.atomic 包下提供了一些原子操作的常用类:
  - AtomicBoolean 、AtomicInteger 、AtomicLong 、 AtomicReference 
  - AtomicIntegerArray 、AtomicLongArray 
  - AtomicMarkableReference 
  - AtomicReferenceArray 
  - AtomicStampedReference 



## 原理

自旋锁   UnSafe类

##  Java的Atomic类分析

https://blog.csdn.net/goodlixueyong/article/details/51339689