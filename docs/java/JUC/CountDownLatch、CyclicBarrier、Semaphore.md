# 多线程：CountDownLatch、CyclicBarrier、Semaphore

## CountDownLatch

让一些线程阻塞直到另一些线程完成一系列操作后才被唤醒。

CountDownLatch 主要有两个方法，当一个或多个线程调用 await 方法时，调用线程会被阻塞。其他线程调用 countDown 方法会将计数器减1（调用 countDown 方法的想爱你成不会阻塞），当计数器的值变为零时，因调用 await 方法被阻塞的线程会被唤醒，继续执行。

```java
public class CountDownLatchDemo {
    final static int studentsNum = 10;

    //模拟下晚自习，班长最后关门
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(studentsNum);
        //i<10 会怎么样，班长会一直在等待
        //for (int i = 1; i < 10; i++) {
        for (int i = 1; i <= 10; i++) {

                new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"\t 上完自习，离开教室");

                countDownLatch.countDown();
            },String.valueOf(i)).start();
        }

        countDownLatch.await();
        System.out.println(Thread.currentThread().getName()+"\t 班长锁门，离开教室");

    }
}
```











## CyclicBarrier

CyclicBarrier的字面意思是可循环（Cyclic）使用的屏障（Barrier），它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，知道最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活，线程进入屏障通过 CyclicBarrier 的 await() 方法。

**集齐七颗龙珠，召唤神龙**

人来齐了，才能开会

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

countDownLatch 相当于做减法，CyclicBarrier 相当于做加法

## Semaphore 

semaphore 信号量主要用于两个目的，一个是用于多个共享资源的互斥使用，另一个用于并发线程数的控制。

抢车位，走一辆，进一辆

```java
public class SemaphoreDemo {

    public static void main(String[] args) {

        //模拟 3 个车位
        Semaphore semaphore = new Semaphore(3);

        //7 辆车去争抢
        for (int i = 0; i < 7; i++) {
            new Thread(()->{
                try {
                    semaphore.acquire();  //抢到车位
                    System.out.println(Thread.currentThread().getName()+"\t抢到车位");
                    TimeUnit.SECONDS.sleep(3);
                    System.out.println(Thread.currentThread().getName()+"\t 停车 3 秒后离开");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    semaphore.release();
                }
                System.out.println(Thread.currentThread().getName()+"\t抢到车位");
            },String.valueOf(i)).start();
        }
    }
}
```

