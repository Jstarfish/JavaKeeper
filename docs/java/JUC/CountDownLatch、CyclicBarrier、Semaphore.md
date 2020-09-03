> Java并发编程：CountDownLatch、CyclicBarrier 和 Semaphore

## CountDownLatch

在多线程协作完成业务功能时，有时候需要等待其他多个线程完成任务之后，主线程才能继续往下执行业务功能，在这种的业务场景下，通常可以使用 Thread 类的 `join()` 方法，让主线程等待被 join 的线程执行完之后，主线程才能继续往下执行。当然，使用线程间消息通信机制也可以完成。其实，Java 并发工具类中为我们提供了类似“**倒计时**”这样的工具类，可以十分方便的完成所说的这种业务场景。

简单概括他的作用就是：让一些线程阻塞直到另一些线程完成一系列操作后才被唤醒。

CountDownLatch 主要有两个方法，当一个或多个线程调用 await 方法时，调用线程会被阻塞。其他线程调用 countDown 方法会将计数器减1（调用 countDown 方法的线程不会阻塞），当计数器的值变为零时，因调用 await 方法被阻塞的线程会被唤醒，继续执行。

> 捎带脚带学两个英文单词：CountDown: 倒计时  Latch：门闩，
>
> 跟我一起读，CountDown，/ˈkaʊntdaʊn/  倒计时
>
> 所以就用锁门的例子理解下 CountDownLatch，班里10个人，每天下了晚自习都是班长最后锁门走人

```java
public class CountDownLatchDemo {
    final static int studentsNum = 10;

    //模拟下晚自习，班长最后关门
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(studentsNum);
        for (int i = 0; i < studentsNum; i++) {
                new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"\t 上完自习，离开教室");

                countDownLatch.countDown();
            },String.valueOf(i)).start();
        }
		// 主线程main，班长调用await 方法阻塞自己，直至计数器数值为0（同学们都离开）
        countDownLatch.await();
        System.out.println(Thread.currentThread().getName()+"\t 班长锁门，离开教室");
    }
}
```

上边的代码，如果有人通宵上自习，死心眼的班长会一直等，一直等~

为了让班长随机应变，CountDownLatch 还提供了等待限制时间的方法，常用方法一览：

- `await()`：调用该方法的线程等到构造方法传入的 N 减到 0 的时候，才能继续往下执行；
- `await(long timeout, TimeUnit unit)`：与上面的 await 方法功能一致，只不过这里有了时间限制，调用该方法的线程等到指定的 timeout 时间后，不管 N 是否减至为 0，都会继续往下执行；
- `countDown()`：使 CountDownLatch 初始值 N 减 1；
- `getCount()`：获取当前 CountDownLatch 维护的值；

[Oracle 官网 CountDownLatch 说明](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CountDownLatch.html)，提供了两个非常经典的使用场景



## CyclicBarrier

CyclicBarrier 的字面意思是可循环（Cyclic）使用的屏障（Barrier），它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活，线程进入屏障通过 CyclicBarrier 的 `await()` 方法。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gicop7b8boj31hu0s0doe.jpg)

可以理解为：**集齐七颗龙珠，才能召唤神龙**（主力开发都到齐了，才能需求评审，也有点报数的感觉）

```java
public class CyclieBarrierDemo {

    public static void main(String[] args) {

        // public CyclicBarrier(int parties, Runnable barrierAction) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7, () -> {
            System.out.println("召唤神龙");
        });

        for (int i = 1; i < 8; i++) {
            final int temp = i;
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "收集到第" + temp + "颗龙珠");

                try {
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }

    }

}
```

> 可以这么理解：**countDownLatch 相当于做减法，CyclicBarrier 相当于做加法**

## Semaphore 

Semaphore 翻译过来是**信号量**的意思，其实我们叫它令牌或者许可更好理解一些。

官方是这样解释的：

> Semaphore 用于限制可以访问某些资源（物理或逻辑的）的线程数目，他维护了一个许可证集合，有多少资源需要限制就维护多少许可证集合，假如这里有 N 个资源，那就对应于 N 个许可证，同一时刻也只能有 N 个线程访问。一个线程获取许可证就调用 acquire 方法，用完了释放资源就调用 release 方法。

这个解释太官方，我们用例子来理解：

如果我 `Semaphore s = new Semaphore(1)` 写的是1，我取一下（acquire），他就变成 0，当变成 0 之后别人是 acquire 不到的，然后继续执行，线程结束之后注意要 `s.release()`，执行完该执行的就把他 release 掉，release 又把0变回去1， 还原化。

Semaphore 的含义就是限流，比如说你在买票，Semaphore 写 5 就是只能有5个人可以同时买票。acquire 的意思叫获得这把锁，线程如果想继续往下执行，必须得从 Semaphore 里面获得一 个许可， 他一共有 5 个许可，用到 0 了剩下的就得等着。

> 我们去海底捞吃火锅，假设海底捞有10 张桌子，同一时间最多有10 桌客人进餐，第 11 以后来的客人必须在候餐区等着，有客人出来后，你就可以进去了

```java
public class SemaphoreDemo {

    public static void main(String[] args) {

        //模拟 5 张桌子, 这里用公平锁，前5波先进去吃
        Semaphore semaphore = new Semaphore(5,true);

        //7 波吃饭的客人
        for (int i = 1; i <= 7 ; i++) {
            new Thread(()->{
                try {
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName()+"\t 进去吃饭");
                    TimeUnit.SECONDS.sleep(3);

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    System.out.println(Thread.currentThread().getName()+"\t 吃完离开");
                    semaphore.release();
                }
            },String.valueOf(i)).start();
        }
    }
}
```

```
1	 进去吃饭
5	 进去吃饭
3	 进去吃饭
4	 进去吃饭
2	 进去吃饭
4	 吃完离开
2	 吃完离开
3	 吃完离开
6	 进去吃饭
5	 吃完离开
1	 吃完离开
7	 进去吃饭
7	 吃完离开
6	 吃完离开
```

**Semaphore 信号量主要用于两个目的，一个是用于多个共享资源的互斥使用，另一个用于并发线程数的控制**。



### 常用方法

**acquire(int permits)**

从许可集中请求获取一个许可，此时当前线程开始阻塞，直到获得一个可用许可，或者当前线程被中断

**release(int permits)**

释放给定数目的许可，将其返回给许可集。这个是对应于上面的方法

**acquire(int permits)**

从许可集中请求获取指定个数(permits)的许可，此时当前线程开始阻塞，直到获得指定数据(permits)可用许可，或者当前线程被中断。

**availablePermits()**

返回此信号量中当前可用的许可数

**reducePermits(int reduction)**

根据指定的缩减量减小可用许可的数目。

**hasQueuedThreads()**

查询是否有线程正在等待获取资源。

**getQueueLength()**

返回正在等待获取的线程的估计数目。该值仅是估计的数字。

**tryAcquire(int permits,  long timeout, TimeUnit unit)**

如果在给定的等待时间内此信号量有可用的所有许可，并且当前线程未被中断，则从此信号量获取给定数目的许可。

**acquireUninterruptibly(int permits)**

从此信号量获取给定数目的许可，在提供这些许可前一直将线程阻塞。



> 他们底层逻辑是基于 AbstractQueuedSynchronizer 实现的。



## 小总结

1. CountDownLatch 可以实现计数等待，主要用于某个线程等待其他几个线程
2. CyclicBarrier 实现循环栅栏，主要用于多个线程同时等待其他线程
3. Semaphore 信号量，主要强调只有某些个数量的线程能拿到资源执行