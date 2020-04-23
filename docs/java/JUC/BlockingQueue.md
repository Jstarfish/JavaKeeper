## 队列和阻塞队列

阻塞队列，顾名思义，首先它是一个队列，而一个阻塞队列在数据结构中所起的作用大致如下





线程 1 往阻塞队列中添加元素，而线程 2 从阻塞队列中移除元素

类似买五道口枣糕

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge41j3g192j31aq0m6qdn.jpg)





当阻塞队列是空时，从队列中获取元素的操作将会被阻塞。

当阻塞队列是满时，从队列中添加元素的操作将会被阻塞。



试图从空的阻塞队列中获取元素的线程将会阻塞，知道其他的线程往空的队列插入新的元素，

同样

试图往已满的阻塞队列添加新元素的线程同样也会阻塞，直到其他的线程从列中移除一个或多个元素或者完全清空队列后继续新增。



## 为什么要用阻塞队列，有什么好处吗

在多线程领域：所谓阻塞，在某些情况下会挂起线程（即阻塞），一旦条件满足，被挂起的线程又会自动被唤醒



为什么需要 BlockingQueue

好处是我们不需要关心什么时候需要阻塞线程，什么时候需要唤醒线程，因为这些 BlockingQueue 都包办了

在 concurrent 包发布以前，多线程环境下，我们每个程序员都必须去自己控制这些细节，尤其还要兼顾效率和线程安全，而这会给我们的程序带来不小的复杂性。



从手动挡换成了自动挡





## BlockingQueue 的核心方法

UML 图  idea

![](/Users/starfish/Desktop/截屏2020-04-23下午4.58.01.png)



![](/Users/starfish/Desktop/截屏2020-04-04上午11.10.23.png)



LinkedBlockingQueue 慎用，有界太大了





## BlockingQueue 核心方法

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge41jdem4nj31e80n0tpr.jpg)







![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge41jh3p0mj31eu0gg15z.jpg)









## SynchronousQueue

没有容量，与其他BlockingQueue不用，SynchronousQueue 是一个不存储元素的BlockingQueue。

每一个put 操作必须要等待一个 take 操作，否则不能继续添加，反之亦然

```java
public class SynchronousQueueDemo {


    public static void main(String[] args) {


        BlockingQueue<String> queue = new SynchronousQueue<>();

        new Thread(()->{
            try {
                System.out.println("Thread 1 put a");
                queue.put("a");

                System.out.println("Thread 1 put b");
                queue.put("b");

                System.out.println("Thread 1 put c");
                queue.put("c");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();


        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(2);
                System.out.println("Thread 2 get:"+queue.take());

                TimeUnit.SECONDS.sleep(2);
                System.out.println("Thread 2 get:"+queue.take());

                TimeUnit.SECONDS.sleep(2);
                System.out.println("Thread 2 get:"+queue.take());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

```
Thread 1 put a
Thread 2 get:a
Thread 1 put b
Thread 2 get:b
Thread 1 put c
Thread 2 get:c
```



## 阻塞队列使用在哪

### 生产者消费者模式

- 传统版
- 阻塞队列版

```java
/**
 * 题目：一个初始值为 0 的变量，两个线程对齐交替操作，一个+1，一个-1，5 轮
 */
public class ProdCounsume_TraditionDemo {
    public static void main(String[] args) {
        ShareData shareData = new ShareData();
        new Thread(() -> {
            for (int i = 0; i <= 5; i++) {
                shareData.increment();
            }
        }, "T1").start();

        new Thread(() -> {
            for (int i = 0; i <= 5; i++) {
                shareData.decrement();
            }
        }, "T1").start();
    }
}

//线程操作资源类
class ShareData {
    private int num = 0;
    private Lock lock = new ReentrantLock();
    private Condition condition = lock.newCondition();

    public void increment() {
        lock.lock();
        try {
          //判断，不能用 if
            while (num != 0) {
                //等待，不能生产
                condition.await();
            }
                //干活
                num++;
                System.out.println(Thread.currentThread().getName() + "\t" + num);

                //唤醒
                condition.signal();

        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void decrement() {

        lock.lock();
        try {
            while (num == 0) {
                //等待，不能生产
                condition.await();
            }
                //干活
                num--;
                System.out.println(Thread.currentThread().getName() + "\t" + num);

                //唤醒
                condition.signal();

        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

防止虚假唤醒，多线程判断用 while，不是 if

### 线程池

### 消息中间件