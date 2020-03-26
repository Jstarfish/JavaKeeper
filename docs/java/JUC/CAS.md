> CAS 知道吗，如何实现？
>
> 讲一讲AtomicInteger，为什么要用CAS而不是synchronized？
>
> CAS底层原理，谈谈你对UnSafe 的理解？
>
> AtomicInteger 的ABA问题，能说一下吗，原子更新引用知道吗？
>
> 如何规避 ABA 问题？

从 Atomic 原子类，到 CAS

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

CAS: 全称Compare and swap，它是一条 **CPU 并发原语**。

他的功能是判断内存某个位置的值是否为预期值，如果是则更改为新的值，这个过程是原子的。

CAS 并发原语体现在 Java 语言中的 sum.misc.Unsafe 类中的各个方法。调用Unsafe 类中的CAS 方法， JVM 会帮助我们实现出 CAS 汇编指令。这是一种完全依赖于硬件的功能，通过它实现了原子操作。再次强调，由于CAS是一种系统原语，原语属于操作系统用于范畴，是由若干条指令组成的，用于完成某个功能的一个过程，并且原语的执行必须是连续的，在执行过程中不允许被中断，CAS是一条CPU的原子指令，不会造成数据不一致问题。

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



![](https://tva1.sinaimg.cn/large/00831rSTly1gd7gj9n5k4j31c40k6kc2.jpg)







![](https://tva1.sinaimg.cn/large/00831rSTly1gd7gj60r2wj31eu0kg15t.jpg)



## CAS 缺点

- 循环时间长，开销很大

  do while 如果CAS失败，会一直进行尝试，如果CAS长时间一直不成功，可能会给CPU带来很大的开销

- 只能保证一个共享变量的原子操作

  当对一个共享变量执行操作时，我们可以使用循环CAS的方式来保证原子操作，但是，对多个共享变量操作时，循环CAS就无法保证操作的原子性，这个时候就可以用锁来保证原子性。

### ABA 问题

aba问题如何产生的

![](https://tva1.sinaimg.cn/large/00831rSTly1gd7gje4hjgj31f00gogwz.jpg)

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