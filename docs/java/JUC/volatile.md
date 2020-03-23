> 谈谈你对 volatile 的理解？
>
> 你知道 volatile 底层的实现机制吗？
>
> volatile 变量和 atomic 变量有什么不同？
>
> volatile 的使用场景，你能举两个例子吗？
>

之前算是比较详细的介绍了 [Java 内存模型](https://mp.weixin.qq.com/s?__biz=MzIwOTIxNTg0OQ==&mid=2247483928&idx=1&sn=87401493c2378ae5a291fe9c07f6bd09&chksm=97760a1ea0018308ad9b5608ffa74937abf37e5ec54e7d773fd4c4199daace67a98e390ea4ce&token=954870021&lang=zh_CN#rd)——JMM， **JMM是围绕着并发过程中如何处理可见性、原子性和有序性这 3 个 特征建立起来的**，而 volatile 可以保证其中的两个特性，下面具体探讨下这个面试必问的关键字。

 ![img](https://i02piccdn.sogoucdn.com/b1d5cd0fd6acf03a) 

## 1. 概念

volatile 是 Java 中的关键字，是一个变量修饰符，用来修饰会被不同线程访问和修改的变量。

------



## 2. Java 内存模型 3 个特性

### 2.1 可见性

可见性是一种复杂的属性，因为可见性中的错误总是会违背我们的直觉。通常，我们无法确保执行读操作的线程能适时地看到其他线程写入的值，有时甚至是根本不可能的事情。为了确保多个线程之间对内存写入操作的可见性，必须使用同步机制。

**可见性，是指线程之间的可见性，一个线程修改的状态对另一个线程是可见的**。也就是一个线程修改的结果。另一个线程马上就能看到。

在 Java 中 volatile、synchronized 和 final 都可以实现可见性。

### 2.2 原子性

原子性指的是某个线程正在执行某个操作时，中间不可以被加塞或分割，要么整体成功，要么整体失败。比如  a=0；（a非long和double类型） 这个操作是不可分割的，那么我们说这个操作是原子操作。再比如：a++； 这个操作实际是a = a +   1；是可分割的，所以他不是一个原子操作。非原子操作都会存在线程安全问题，需要我们使用同步技术（sychronized）来让它变成一个原子操作。一个操作是原子操作，那么我们称它具有原子性。Java的 concurrent 包下提供了一些原子类，AtomicInteger、AtomicLong、AtomicReference等。

在 Java 中 synchronized 和在 lock、unlock 中操作保证原子性。

### 2.3 有序性

Java  语言提供了 volatile 和 synchronized 两个关键字来保证线程之间操作的有序性，volatile  是因为其本身包含“禁止指令重排序”的语义，synchronized 是由“一个变量在同一个时刻只允许一条线程对其进行 lock  操作”这条规则获得的，此规则决定了持有同一个对象锁的两个同步块只能串行执行。

------



## 3. volatile 是 Java 虚拟机提供的轻量级的同步机制

- 保证可见性
- **不保证原子性**
- 禁止指令重排(保证有序性)

### 3.1 空说无凭，代码验证

#### 3.1.1 可见性验证

```java
class MyData {
    int number = 0;
    public void add() {
        this.number = number + 1;
    }
}

   // 启动两个线程，一个work线程，一个main线程，work线程修改number值后，查看main线程的number
   private static void testVolatile() {
        MyData myData = new MyData();
     
        new Thread(() -> {
            System.out.println(Thread.currentThread().getName()+"\t come in");
            try {
                TimeUnit.SECONDS.sleep(2);
                myData.add();
                System.out.println(Thread.currentThread().getName()+"\t update number value :"+myData.number);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "workThread").start();

        //第2个线程，main线程
        while (myData.number == 0){
            //main线程还在找0
        }
        System.out.println(Thread.currentThread().getName()+"\t mission is over");      
        System.out.println(Thread.currentThread().getName()+"\t mission is over，main get number is:"+myData.number);
    }
}
```

运行 `testVolatile()` 方法，输出如下，会发现在 main 线程死循环，说明 main 线程的值一直是 0

```
workThread	 execute
workThread	 update number value :1
```

修改 `volatile int number = 0`,，在 number 前加关键字 volatile,重新运行，main 线程获取结果为 1

```
workThread	 execute
workThread	 update number value :1
main	 execute over，main get number is:1
```



#### 3.1.2 不保证原子性验证

```java
class MyData {
    volatile int number = 0;
    public void add() {
        this.number = number + 1;
    }
}

private static void testAtomic() throws InterruptedException {
  MyData myData = new MyData();

  for (int i = 0; i < 10; i++) {
    new Thread(() ->{
      for (int j = 0; j < 1000; j++) {
        myData.addPlusPlus();
      }
    },"addPlusThread:"+ i).start();
  }


  //等待上边20个线程结束后(预计5秒肯定结束了)，在main线程中获取最后的number
  TimeUnit.SECONDS.sleep(5);
  while (Thread.activeCount() > 2){
    Thread.yield();
  }
  System.out.println("final value："+myData.number);
}
```

运行 `testAtomic` 发现最后的输出值，并不一定是期望的值 10000，往往是比 10000 小的数值。

```
final value：9856
```

为什么会这样呢，因为 `i++` 在转化为字节码指令的时候是4条指令

- `getfield` 获取原始值
- `iconst_1` 将值入栈
- `iadd` 进行加 1 操作
- `putfield` 把 `iadd` 后的操作写回主内存

这样在运行时候就会存在多线程竞争问题，可能会出现了丢失写值的情况。

![](https://tva1.sinaimg.cn/large/00831rSTly1gd0pb766vkj31hw0lyjvm.jpg)

如何解决原子性问题呢？

加 `synchronized` 或者直接使用 `Automic` 原子类。



#### 3.1.3 禁止指令重排验证

计算机在执行程序时，为了提高性能，编译器和处理器常常会对指令做重排，一般分为以下 3 种

![img](https://tva1.sinaimg.cn/large/00831rSTly1gcrgrycnj0j31bs04k74y.jpg)

处理器在进行重排序时必须要考虑指令之间的**数据依赖性**，我们叫做 `as-if-serial` 语义

单线程环境里确保程序最终执行结果和代码顺序执行的结果一致；但是多线程环境中线程交替执行，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致性是无法确定的，结果无法预测。

我们往往用下面的代码验证 volatile 禁止指令重排，如果多线程环境下，`最后的输出结果不一定是我们想象到的 2，这时就要把两个变量都设置为 volatile。

```java
public class ReSortSeqDemo {

    int a = 0;
    boolean flag = false;

    public void mehtod1(){
        a = 1;
        flag = true;
    }

    public void method2(){
        if(flag){
            a = a +1;
            System.out.println("reorder value: "+a);
        }
    }
}
```

`volatile` 实现禁止指令重排优化，从而避免了多线程环境下程序出现乱序执行的现象。



还有一个我们最常见的多线程环境中 `DCL(double-checked locking)` 版本的单例模式中，就是使用了 volatile 禁止指令重排的特性。

```java
public class Singleton {

    private static volatile Singleton instance;
  
    private Singleton(){}
    // DCL
    public static Singleton getInstance(){
        if(instance ==null){   //第一次检查
            synchronized (Singleton.class){
                if(instance == null){   //第二次检查
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

因为有指令重排序的存在，双端检索机制也不一定是线程安全的。

why ?  

Because:  `instance = new Singleton();`  初始化对象的过程其实并不是一个原子的操作，它会分为三部分执行，

1. 给 instance 分配内存
2. 调用 instance 的构造函数来初始化对象
3. 将 instance 对象指向分配的内存空间（执行完这步 instance 就为非 null 了）

步骤 2 和 3 不存在数据依赖关系，如果虚拟机存在指令重排序优化，则步骤 2和 3 的顺序是无法确定的。如果A线程率先进入同步代码块并先执行了 3 而没有执行 2，此时因为 instance 已经非 null。这时候线程 B 在第一次检查的时候，会发现 instance 已经是 非null 了，就将其返回使用，但是此时 instance 实际上还未初始化，自然就会出错。所以我们要限制实例对象的指令重排，用 volatile 修饰（JDK 5 之前使用了 volatile 的双检锁是有问题的）。

------



## 4. 原理

volatile 可以保证线程可见性且提供了一定的有序性，但是无法保证原子性。在 JVM 底层是基于内存屏障实现的。

- 当对非 volatile 变量进行读写的时候，每个线程先从内存拷贝变量到 CPU 缓存中。如果计算机有多个CPU，每个线程可能在不同的 CPU 上被处理，这意味着每个线程可以拷贝到不同的 CPU cache 中
- 而声明变量是 volatile 的，JVM 保证了每次读变量都从内存中读，跳过 CPU cache 这一步，所以就不会有可见性问题
  - 对 volatile 变量进行写操作时，会在写操作后加一条 store 屏障指令，将工作内存中的共享变量刷新回主内存；
  - 对 volatile 变量进行读操作时，会在写操作后加一条 load 屏障指令，从主内存中读取共享变量；



通过 hsdis 工具获取 JIT 编译器生成的汇编指令来看看对 volatile 进行写操作CPU会做什么事情，还是用上边的单例模式，可以看到

![](https://i.loli.net/2020/03/23/dP4EVrexioGlc9m.png)

（PS：具体的汇编指令对我这个 Javaer 太南了，但是 JVM 字节码我们可以认识，`putstatic`   的含义是给一个静态变量设置值，那这里的 `putstatic instance` ,而且是第 17 行代码，更加确定是给 instance 赋值了。果然像各种资料里说的，找到了 `lock add1` 据说还得翻阅。这里可以看下这两篇 https://www.jianshu.com/p/6ab7c3db13c3 、 https://www.cnblogs.com/xrq730/p/7048693.html ）

有 volatile 修饰的共享变量进行写操作时会多出第二行汇编代码，该句代码的意思是**对原值加零**，其中相加指令addl前有 **lock** 修饰。通过查IA-32架构软件开发者手册可知，lock前缀的指令在多核处理器下会引发两件事情：

- 将当前处理器缓存行的数据写回到系统内存
- 这个写回内存的操作会引起在其他CPU里缓存了该内存地址的数据无效

**正是 lock 实现了 volatile 的「防止指令重排」「内存可见」的特性**

------



## 5. 使用场景

您只能在有限的一些情形下使用 volatile 变量替代锁。要使 volatile 变量提供理想的线程安全，必须同时满足下面两个条件：

- 对变量的写操作不依赖于当前值
- 该变量没有包含在具有其他变量的不变式中

其实就是在需要保证原子性的场景，不要使用 volatile。

------



## 5. volatile 性能

volatile 的读性能消耗与普通变量几乎相同，但是写操作稍慢，因为它需要在本地代码中插入许多内存屏障指令来保证处理器不发生乱序执行。

引用《正确使用 volaitle 变量》一文中的话：

很难做出准确、全面的评价，例如 “X 总是比 Y 快”，尤其是对 JVM 内在的操作而言。（例如，某些情况下 JVM 也许能够完全删除锁机制，这使得我们难以抽象地比较 `volatile` 和 `synchronized` 的开销。）就是说，在目前大多数的处理器架构上，volatile 读操作开销非常低 —— 几乎和非 volatile 读操作一样。而 volatile 写操作的开销要比非 volatile 写操作多很多，因为要保证可见性需要实现内存界定（Memory Fence），即便如此，volatile 的总开销仍然要比锁获取低。

volatile 操作不会像锁一样造成阻塞，因此，在能够安全使用 volatile 的情况下，volatile 可以提供一些优于锁的可伸缩特性。如果读操作的次数要远远超过写操作，与锁相比，volatile 变量通常能够减少同步的性能开销。



## 参考

《深入理解Java虚拟机》
 http://tutorials.jenkov.com/java-concurrency/java-memory-model.html 
 https://juejin.im/post/5dbfa0aa51882538ce1a4ebc 
《正确使用 Volatile 变量》https://www.ibm.com/developerworks/cn/java/j-jtp06197.html