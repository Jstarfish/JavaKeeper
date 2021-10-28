# Java并发编程：CountDownLatch、CyclicBarrier 和 Semaphore

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





> 看个真实业务的例子：目前对账系统的处理逻辑是首先查询订单，然后查询派送单，之后对比订单和派送单，将差异写入差异库。
>
> ![img](https://static001.geekbang.org/resource/image/06/fe/068418bdc371b8a1b4b740428a3b3ffe.png)
>
> ```java
> while(存在未对账订单){
>   // 查询未对账订单
>   pos = getPOrders();
>   // 查询派送单
>   dos = getDOrders();
>   // 执行对账操作
>   diff = check(pos, dos);
>   // 差异写入差异库
>   save(diff);
> } 
> ```
>
> 我们创建了两个线程 T1 和 T2，并行执行查询未对账订单 getPOrders() 和查询派送单 getDOrders() 这两个操作。在主线程中执行对账操作 check() 和差异写入 save() 两个操作。不过需要注意的是：主线程需要等待线程 T1 和 T2 执行完才能执行 check() 和 save() 这两个操作，为此我们通过调用 T1.join() 和 T2.join() 来实现等待，当 T1 和 T2 线程退出时，调用 T1.join() 和 T2.join() 的主线程就会从阻塞态被唤醒，从而执行之后的 check() 和 save()。
>
> ```java
> while(存在未对账订单){
>   // 查询未对账订单
>   Thread T1 = new Thread(()->{
>     pos = getPOrders();
>   });
>   T1.start();
>   // 查询派送单
>   Thread T2 = new Thread(()->{
>     dos = getDOrders();
>   });
>   T2.start();
>   // 等待T1、T2结束
>   T1.join();
>   T2.join();
>   // 执行对账操作
>   diff = check(pos, dos);
>   // 差异写入差异库
>   save(diff);
> } 
> ```
>
> while 循环里面每次都会创建新的线程，而创建线程可是个耗时的操作。所以最好是创建出来的线程能够循环利用，估计这时你已经想到线程池了，是的，线程池就能解决这个问题。
>
> 而下面的代码就是用线程池优化后的：我们首先创建了一个固定大小为 2 的线程池，之后在 while 循环里重复利用。一切看上去都很顺利，但是有个问题好像无解了，那就是主线程如何知道 getPOrders() 和 getDOrders() 这两个操作什么时候执行完。前面主线程通过调用线程 T1 和 T2 的 join() 方法来等待线程 T1 和 T2 退出，但是在线程池的方案里，线程根本就不会退出，所以 join() 方法已经失效了。
>
> ```java
> // 创建2个线程的线程池
> Executor executor = 
>   Executors.newFixedThreadPool(2);
> while(存在未对账订单){
>   // 查询未对账订单
>   executor.execute(()-> {
>     pos = getPOrders();
>   });
>   // 查询派送单
>   executor.execute(()-> {
>     dos = getDOrders();
>   });
>   
>   /* ？？如何实现等待？？*/
>   
>   // 执行对账操作
>   diff = check(pos, dos);
>   // 差异写入差异库
>   save(diff);
> }   
> ```
>
> 直接用 CountDownlatch，计数器的初始值等于 2，之后在pos = getPOrders();和dos = getDOrders();两条语句的后面对计数器执行减 1 操作，这个对计数器减 1 的操作是通过调用 latch.countDown(); 来实现的。在主线程中，我们通过调用 latch.await() 来实现对计数器等于 0 的等待。
>
> ```java
> // 创建2个线程的线程池
> Executor executor = Executors.newFixedThreadPool(2);
> while(存在未对账订单){
>   // 计数器初始化为2
>   CountDownLatch latch = new CountDownLatch(2);
>   // 查询未对账订单
>   executor.execute(()-> {
>     pos = getPOrders();
>     latch.countDown();
>   });
>   // 查询派送单
>   executor.execute(()-> {
>     dos = getDOrders();
>     latch.countDown();
>   });
>   
>   // 等待两个查询操作结束
>   latch.await();
>   
>   // 执行对账操作
>   diff = check(pos, dos);
>   // 差异写入差异库
>   save(diff);
> }
> ```
>
> 经过上面的重重优化之后，长出一口气，终于可以交付了。不过在交付之前还需要再次审视一番，看看还有没有优化的余地，仔细看还是有的。前面我们将 getPOrders() 和 getDOrders() 这两个查询操作并行了，但这两个查询操作和对账操作 check()、save() 之间还是串行的。很显然，这两个查询操作和对账操作也是可以并行的，也就是说，在执行对账操作的时候，可以同时去执行下一轮的查询操作，这个过程可以形象化地表述为下面这幅示意图。
>
> ![img](https://static001.geekbang.org/resource/image/e6/8b/e663d90f49d9666e618ac1370ccca58b.png)
>
> 那接下来我们再来思考一下如何实现这步优化，两次查询操作能够和对账操作并行，对账操作还依赖查询操作的结果，这明显有点生产者 - 消费者的意思，两次查询操作是生产者，对账操作是消费者。既然是生产者 - 消费者模型，那就需要有个队列，来保存生产者生产的数据，而消费者则从这个队列消费数据。
>
> 这时候可以用 CyclicBarrier 实现了，一个线程 T1 执行订单的查询工作，一个线程 T2 执行派送单的查询工作，当线程 T1 和 T2 都各自生产完 1 条数据的时候，通知线程 T3 执行对账操作。
>
> ![img](https://static001.geekbang.org/resource/image/65/ad/6593a10a393d9310a8f864730f7426ad.png)
>
> ```java
> // 订单队列
> Vector<P> pos;
> // 派送单队列
> Vector<D> dos;
> // 执行回调的线程池 
> Executor executor = Executors.newFixedThreadPool(1);
> final CyclicBarrier barrier =
>   new CyclicBarrier(2, ()->{
>     executor.execute(()->check());
>   });
>   
> void check(){
>   P p = pos.remove(0);
>   D d = dos.remove(0);
>   // 执行对账操作
>   diff = check(p, d);
>   // 差异写入差异库
>   save(diff);
> }
>   
> void checkAll(){
>   // 循环查询订单库
>   Thread T1 = new Thread(()->{
>     while(存在未对账订单){
>       // 查询订单库
>       pos.add(getPOrders());
>       // 等待
>       barrier.await();
>     }
>   });
>   T1.start();  
>   // 循环查询运单库
>   Thread T2 = new Thread(()->{
>     while(存在未对账订单){
>       // 查询运单库
>       dos.add(getDOrders());
>       // 等待
>       barrier.await();
>     }
>   });
>   T2.start();
> }
> ```

### 总结

CountDownLatch 和 CyclicBarrier 是 Java 并发包提供的两个非常易用的线程同步工具类，这两个工具类用法的区别在这里还是有必要再强调一下：**CountDownLatch 主要用来解决一个线程等待多个线程的场景**，可以类比旅游团团长要等待所有的游客到齐才能去下一个景点；**而 CyclicBarrier 是一组线程之间互相等待**，更像是几个驴友之间不离不弃。除此之外 CountDownLatch 的计数器是不能循环利用的，也就是说一旦计数器减到 0，再有线程调用 await()，该线程会直接通过。但 CyclicBarrier 的计数器是可以循环利用的，而且具备自动重置的功能，一旦计数器减到 0 会自动重置到你设置的初始值。除此之外，CyclicBarrier 还可以设置回调函数，可以说是功能丰富。







## Semaphore 

Semaphore 翻译过来是**信号量**的意思，其实我们叫它令牌或者许可更好理解一些。

官方是这样解释的：

> Semaphore 用于限制可以访问某些资源（物理或逻辑的）的线程数目，他维护了一个许可证集合，有多少资源需要限制就维护多少许可证集合，假如这里有 N 个资源，那就对应于 N 个许可证，同一时刻也只能有 N 个线程访问。一个线程获取许可证就调用 acquire 方法，用完了释放资源就调用 release 方法。

这个解释太官方，我们用例子来理解：

如果我 `Semaphore s = new Semaphore(1)` 写的是1，我取一下（acquire），他就变成 0，当变成 0 之后别人是 acquire 不到的，然后继续执行，线程结束之后注意要 `s.release()`，执行完该执行的就把他 release 掉，release 又把 0 变回去 1， 还原化。

Semaphore 的含义就是限流，比如说你在买票，Semaphore 写 5 就是只能有5个人可以同时买票。acquire 的意思叫获得这把锁，线程如果想继续往下执行，必须得从 Semaphore 里面获得一 个许可， 他一共有 5 个许可，用到 0 了剩下的就得等着。

> 这是 Lock 不容易实现的一个功能：Semaphore 可以允许多个线程访问一个临界区。

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



#### 我们用 Semaphore 实现一个限流器

Semaphore 可以允许多个线程访问一个临界区。

比较常见的需求就是我们工作中遇到的各种池化资源，例如连接池、对象池、线程池等等。其中，你可能最熟悉数据库连接池，在同一时刻，一定是允许多个线程同时使用连接池的，当然，每个连接在被释放前，是不允许其他线程使用的。

假设有一个对象池的需求，所谓对象池呢，指的是一次性创建出 N 个对象，之后所有的线程重复利用这 N 个对象，当然对象在被释放前，也是不允许其他线程使用的。对象池，可以用 List 保存实例对象

```java
class ObjPool<T, R> {
  final List<T> pool;
  // 用信号量实现限流器
  final Semaphore sem;
  // 构造函数
  ObjPool(int size, T t){
    pool = new Vector<T>(){};
    for(int i=0; i<size; i++){
      pool.add(t);
    }
    sem = new Semaphore(size);
  }
  // 利用对象池的对象，调用func
  R exec(Function<T,R> func) {
    T t = null;
    sem.acquire();
    try {
      t = pool.remove(0);
      return func.apply(t);
    } finally {
      pool.add(t);
      sem.release();
    }
  }
}
// 创建对象池
ObjPool<Long, String> pool = 
  new ObjPool<Long, String>(10, 2);
// 通过对象池获取t，之后执行  
pool.exec(t -> {
    System.out.println(t);
    return t.toString();
});
```

我们用一个 List来保存对象实例，用 Semaphore 实现限流器。

关键的代码是 ObjPool 里面的 exec() 方法，这个方法里面实现了限流的功能。在这个方法里面，我们首先调用 acquire() 方法（与之匹配的是在 finally 里面调用 release() 方法），假设对象池的大小是 10，信号量的计数器初始化为 10，那么前 10 个线程调用 acquire() 方法，都能继续执行，相当于通过了信号灯，而其他线程则会阻塞在 acquire() 方法上。对于通过信号灯的线程，我们为每个线程分配了一个对象 t（这个分配工作是通过 pool.remove(0) 实现的），分配完之后会执行一个回调函数 func，而函数的参数正是前面分配的对象 t ；执行完回调函数之后，它们就会释放对象（这个释放工作是通过 pool.add(t) 实现的），同时调用 release() 方法来更新信号量的计数器。如果此时信号量里计数器的值小于等于 0，那么说明有线程在等待，此时会自动唤醒等待的线程。



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