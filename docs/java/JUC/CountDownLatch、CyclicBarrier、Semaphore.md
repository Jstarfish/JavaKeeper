## CountDownLatch

让一些线程阻塞直到另一些线程完成一系列操作后才被唤醒。

CountDownLatch 主要有两个方法，当一个或多个线程调用 await 方法时，调用线程会被阻塞。其他线程调用 countDown 方法会将计数器减1（调用 countDown 方法的想爱你成不会阻塞），当计数器的值变为零时，因调用 await 方法被阻塞的线程会被唤醒，继续执行。

```

```











## CyclicBarrier

CyclicBarrier的字面意思是可循环（Cyclic）使用的屏障（Barrier），它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，知道最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活，线程进入屏障通过 CyclicBarrier 的 await() 方法。

集齐七颗龙珠，召唤神龙



## Semaphore 

semaphore 信号量主要用于两个目的，一个是用于多个共享资源的互斥使用，另一个用于并发线程数的控制。

抢车位

```

```

