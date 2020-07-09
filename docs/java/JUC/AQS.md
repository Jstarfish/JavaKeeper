Java中的大部分同步类（Lock、Semaphore、ReentrantLock等）都是基于AbstractQueuedSynchronizer（简称为AQS）实现的。AQS是一种提供了原子式管理同步状态、阻塞和唤醒线程功能以及队列模型的简单框架。



> 文章来源 https://dayarch.top/p/java-aqs-and-reentrantlock.html





## 队列同步器 AQS

队列同步器 （AbstractQueuedSynchronizer），简称同步器或AQS，就是我们今天的主人公

> **问：**为什么你分析 JUC 源码，要从 AQS 说起呢？
>
> **答：**看下图

[![img](https://rgyb.sunluomeng.top/20200517201817.png)](https://rgyb.sunluomeng.top/20200517201817.png)

相信看到这个截图你就明白一二了，你听过的，面试常被问起的，工作中常用的

- `ReentrantLock`
- `ReentrantReadWriteLock`
- `Semaphore(信号量)`
- `CountDownLatch`
- `公平锁`
- `非公平锁`
- `ThreadPoolExecutor` (关于线程池的理解，可以查看 [为什么要使用线程池?](https://dayarch.top/p/why-we-need-to-use-threadpool.html) )

都和 AQS 有直接关系，所以了解 AQS 的抽象实现，在此基础上再稍稍查看上述各类的实现细节，很快就可以全部搞定，不至于查看源码时一头雾水，丢失主线

上面提到，在锁的实现类中会聚合同步器，然后利同步器实现锁的语义，那么问题来了：

> 为什么要用聚合模式，怎么进一步理解锁和同步器的关系呢？

[![img](https://rgyb.sunluomeng.top/20200530125122.png)](https://rgyb.sunluomeng.top/20200530125122.png)

我们绝大多数都是在使用锁，实现锁之后，其核心就是要使用方便

[![img](https://rgyb.sunluomeng.top/20200530130025.png)](https://rgyb.sunluomeng.top/20200530130025.png)

从 AQS 的类名称和修饰上来看，这是一个抽象类，所以从设计模式的角度来看同步器一定是基于【模版模式】来设计的，使用者需要继承同步器，实现自定义同步器，并重写指定方法，随后将同步器组合在自定义的同步组件中，并调用同步器的模版方法，而这些模版方法又回调用使用者重写的方法

我不想将上面的解释说的这么抽象，其实想理解上面这句话，我们只需要知道下面两个问题就好了

1. 哪些是自定义同步器可重写的方法？
2. 哪些是抽象同步器提供的模版方法？



### 同步器可重写的方法

同步器提供的可重写方法只有5个，这大大方便了锁的使用者：

[![img](https://rgyb.sunluomeng.top/20200523160830.png)](https://rgyb.sunluomeng.top/20200523160830.png)

按理说，需要重写的方法也应该有 abstract 来修饰的，为什么这里没有？原因其实很简单，上面的方法我已经用颜色区分成了两类：

- `独占式`
- `共享式`

自定义的同步组件或者锁不可能既是独占式又是共享式，为了避免强制重写不相干方法，所以就没有 abstract 来修饰了，但要抛出异常告知不能直接使用该方法：

```java
protected boolean tryAcquire(int arg) {
    throw new UnsupportedOperationException();
}
```

暖暖的很贴心（如果你有类似的需求也可以仿照这样的设计）

表格方法描述中所说的`同步状态`就是上文提到的有 volatile 修饰的 state，所以我们在`重写`上面几个方法时，还要通过同步器提供的下面三个方法（AQS 提供的）来获取或修改同步状态：

[![img](https://rgyb.sunluomeng.top/20200523160906.png)](https://rgyb.sunluomeng.top/20200523160906.png)

而独占式和共享式操作 state 变量的区别也就很简单了

[![img](https://rgyb.sunluomeng.top/20200523160705.png)](https://rgyb.sunluomeng.top/20200523160705.png)

所以你看到的 `ReentrantLock` `ReentrantReadWriteLock` `Semaphore(信号量)` `CountDownLatch` 这几个类其实仅仅是在实现以上几个方法上略有差别，其他的实现都是通过同步器的模版方法来实现的，到这里是不是心情放松了许多呢？我们来看一看模版方法：

### 同步器提供的模版方法

上面我们将同步器的实现方法分为独占式和共享式两类，模版方法其实除了提供以上两类模版方法之外，只是多了`响应中断`和`超时限制` 的模版方法供 Lock 使用，来看一下

[![img](https://rgyb.sunluomeng.top/20200523195957.png)](https://rgyb.sunluomeng.top/20200523195957.png)

先不用记上述方法的功能，目前你只需要了解个大概功能就好。另外，相信你也注意到了：

> 上面的方法都有 final 关键字修饰，说明子类不能重写这个方法

看到这你也许有点乱了，我们稍微归纳一下：

[![img](https://rgyb.sunluomeng.top/20200523213113.png)](https://rgyb.sunluomeng.top/20200523213113.png)

程序员还是看代码心里踏实一点，我们再来用代码说明一下上面的关系（注意代码中的注释，以下的代码并不是很严谨，只是为了简单说明上图的代码实现）：

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.AbstractQueuedSynchronizer;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;

/**
 * 自定义互斥锁
 *
 * @author tanrgyb
 * @date 2020/5/23 9:33 PM
 */
public class MyMutex implements Lock {

	// 静态内部类-自定义同步器
	private static class MySync extends AbstractQueuedSynchronizer{
		@Override
		protected boolean tryAcquire(int arg) {
			// 调用AQS提供的方法，通过CAS保证原子性
			if (compareAndSetState(0, arg)){
				// 我们实现的是互斥锁，所以标记获取到同步状态（更新state成功）的线程，
				// 主要为了判断是否可重入（一会儿会说明）
				setExclusiveOwnerThread(Thread.currentThread());
				//获取同步状态成功，返回 true
				return true;
			}
			// 获取同步状态失败，返回 false
			return false;
		}

		@Override
		protected boolean tryRelease(int arg) {
			// 未拥有锁却让释放，会抛出IMSE
			if (getState() == 0){
				throw new IllegalMonitorStateException();
			}
			// 可以释放，清空排它线程标记
			setExclusiveOwnerThread(null);
			// 设置同步状态为0，表示释放锁
			setState(0);
			return true;
		}

		// 是否独占式持有
		@Override
		protected boolean isHeldExclusively() {
			return getState() == 1;
		}

		// 后续会用到，主要用于等待/通知机制，每个condition都有一个与之对应的条件等待队列，在锁模型中说明过
		Condition newCondition() {
			return new ConditionObject();
		}
	}

  // 聚合自定义同步器
	private final MySync sync = new MySync();


	@Override
	public void lock() {
		// 阻塞式的获取锁，调用同步器模版方法独占式，获取同步状态
		sync.acquire(1);
	}

	@Override
	public void lockInterruptibly() throws InterruptedException {
		// 调用同步器模版方法可中断式获取同步状态
		sync.acquireInterruptibly(1);
	}

	@Override
	public boolean tryLock() {
		// 调用自己重写的方法，非阻塞式的获取同步状态
		return sync.tryAcquire(1);
	}

	@Override
	public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
		// 调用同步器模版方法，可响应中断和超时时间限制
		return sync.tryAcquireNanos(1, unit.toNanos(time));
	}

	@Override
	public void unlock() {
		// 释放锁
		sync.release(1);
	}

	@Override
	public Condition newCondition() {
		// 使用自定义的条件
		return sync.newCondition();
	}
}
```

如果你现在打开 IDE， 你会发现上文提到的 `ReentrantLock` `ReentrantReadWriteLock` `Semaphore(信号量)` `CountDownLatch` 都是按照这个结构实现，所以我们就来看一看 AQS 的模版方法到底是怎么实现锁



## AQS实现分析

从上面的代码中，你应该理解了`lock.tryLock()` 非阻塞式获取锁就是调用自定义同步器重写的 `tryAcquire()` 方法，通过 CAS 设置state 状态，不管成功与否都会马上返回；那么 lock.lock() 这种阻塞式的锁是如何实现的呢？

有阻塞就需要排队，实现排队必然需要队列

> CLH：Craig、Landin and Hagersten 队列，是一个单向链表，AQS中的队列是CLH变体的虚拟双向队列（FIFO）——概念了解就好，不要记

队列中每个排队的个体就是一个 Node，所以我们来看一下 Node 的结构

### Node 节点

AQS 内部维护了一个同步队列，用于管理同步状态。

- 当线程获取同步状态失败时，就会将当前线程以及等待状态等信息构造成一个 Node 节点，将其加入到同步队列中尾部，阻塞该线程
- 当同步状态被释放时，会唤醒同步队列中“首节点”的线程获取同步状态

为了将上述步骤弄清楚，我们需要来看一看 Node 结构 （如果你能打开 IDE 一起看那是极好的）

[![img](https://rgyb.sunluomeng.top/20200524183916.png)](https://rgyb.sunluomeng.top/20200524183916.png)

乍一看有点杂乱，我们还是将其归类说明一下：

[![img](https://rgyb.sunluomeng.top/20200524184014.png)](https://rgyb.sunluomeng.top/20200524184014.png)

上面这几个状态说明有个印象就好，有了Node 的结构说明铺垫，你也就能想象同步队列的基本结构了：

[![img](https://rgyb.sunluomeng.top/20200525072245.png)](https://rgyb.sunluomeng.top/20200525072245.png)

前置知识基本铺垫完毕，我们来看一看独占式获取同步状态的整个过程

### 独占式获取同步状态

故事要从范式 `lock.lock()` 开始

```java
public void lock() {
	// 阻塞式的获取锁，调用同步器模版方法，获取同步状态
	sync.acquire(1);
}
```

进入 AQS 的模版方法 `acquire()`

```java
public final void acquire(int arg) {
  // 调用自定义同步器重写的 tryAcquire 方法
	if (!tryAcquire(arg) &&
		acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
		selfInterrupt();
}
```

首先，也会尝试非阻塞的获取同步状态，如果获取失败（tryAcquire返回false），则会调用 `addWaiter` 方法构造 Node 节点（Node.EXCLUSIVE 独占式）并安全的（CAS）加入到同步队列【尾部】

```java
private Node addWaiter(Node mode) {
  	// 构造Node节点，包含当前线程信息以及节点模式【独占/共享】
    Node node = new Node(Thread.currentThread(), mode);
  	// 新建变量 pred 将指针指向tail指向的节点
    Node pred = tail;
  	// 如果尾节点不为空
    if (pred != null) {
      	// 新加入的节点前驱节点指向尾节点
        node.prev = pred;

      	// 因为如果多个线程同时获取同步状态失败都会执行这段代码
        // 所以，通过 CAS 方式确保安全的设置当前节点为最新的尾节点
        if (compareAndSetTail(pred, node)) {
          	// 曾经的尾节点的后继节点指向当前节点
            pred.next = node;
          	// 返回新构建的节点
            return node;
        }
    }
  	// 尾节点为空，说明当前节点是第一个被加入到同步队列中的节点
  	// 需要一个入队操作
    enq(node);
    return node;
}

private Node enq(final Node node) {
  	// 通过“死循环”确保节点被正确添加，最终将其设置为尾节点之后才会返回，这里使用 CAS 的理由和上面一样
    for (;;) {
        Node t = tail;
      	// 第一次循环，如果尾节点为 null
        if (t == null) { // Must initialize
          	// 构建一个哨兵节点，并将头部指针指向它
            if (compareAndSetHead(new Node()))
              	// 尾部指针同样指向哨兵节点
                tail = head;
        } else {
          	// 第二次循环，将新节点的前驱节点指向t
            node.prev = t;
          	// 将新节点加入到队列尾节点
            if (compareAndSetTail(t, node)) {
              	// 前驱节点的后继节点指向当前新节点，完成双向队列
                t.next = node;
                return t;
            }
        }
    }
}
```

你可能比较迷惑 enq() 的处理方式，进入该方法就是一个“死循环”，我们就用图来描述它是怎样跳出循环的

[![img](https://rgyb.sunluomeng.top/20200530135150.png)](https://rgyb.sunluomeng.top/20200530135150.png)

有些同学可能会有疑问，为什么会有哨兵节点？

> 哨兵，顾名思义，是用来解决国家之间边界问题的，不直接参与生产活动。同样，计算机科学中提到的哨兵，也用来解决边界问题，如果没有边界，指定环节，按照同样算法可能会在边界处发生异常，比如要继续向下分析的 `acquireQueued()` 方法

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
      	// "死循环"，尝试获取锁，或者挂起
        for (;;) {
          	// 获取当前节点的前驱节点
            final Node p = node.predecessor();
          	// 只有当前节点的前驱节点是头节点，才会尝试获取锁
          	// 看到这你应该理解添加哨兵节点的含义了吧
            if (p == head && tryAcquire(arg)) {
              	// 获取同步状态成功，将自己设置为头
                setHead(node);
              	// 将哨兵节点的后继节点置为空，方便GC
                p.next = null; // help GC
                failed = false;
              	// 返回中断标识
                return interrupted;
            }
          	// 当前节点的前驱节点不是头节点
          	//【或者】当前节点的前驱节点是头节点但获取同步状态失败
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

获取同步状态成功会返回可以理解了，但是如果失败就会一直陷入到“死循环”中浪费资源吗？很显然不是，`shouldParkAfterFailedAcquire(p, node)` 和 `parkAndCheckInterrupt()` 就会将线程获取同步状态失败的线程挂起，我们继续向下看

```java
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
  	// 获取前驱节点的状态
    int ws = pred.waitStatus;
  	// 如果是 SIGNAL 状态，即等待被占用的资源释放，直接返回 true
  	// 准备继续调用 parkAndCheckInterrupt 方法
    if (ws == Node.SIGNAL)
        return true;
  	// ws 大于0说明是CANCELLED状态，
    if (ws > 0) {
        // 循环判断前驱节点的前驱节点是否也为CANCELLED状态，忽略该状态的节点，重新连接队列
        do {
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);
        pred.next = node;
    } else {
      	// 将当前节点的前驱节点设置为设置为 SIGNAL 状态，用于后续唤醒操作
      	// 程序第一次执行到这返回为false，还会进行外层第二次循环，最终从代码第7行返回
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
    }
    return false;
}
```

到这里你也许有个问题：

> 这个地方设置前驱节点为 SIGNAL 状态到底有什么作用？

保留这个问题，我们陆续揭晓

如果前驱节点的 waitStatus 是 SIGNAL状态，即 shouldParkAfterFailedAcquire 方法会返回 true ，程序会继续向下执行 `parkAndCheckInterrupt` 方法，用于将当前线程挂起

```java
private final boolean parkAndCheckInterrupt() {
  	// 线程挂起，程序不会继续向下执行
    LockSupport.park(this);
  	// 根据 park 方法 API描述，程序在下述三种情况会继续向下执行
  	// 	1. 被 unpark 
  	// 	2. 被中断(interrupt)
  	// 	3. 其他不合逻辑的返回才会继续向下执行
  	
  	// 因上述三种情况程序执行至此，返回当前线程的中断状态，并清空中断状态
  	// 如果由于被中断，该方法会返回 true
    return Thread.interrupted();
}
```

被唤醒的程序会继续执行 `acquireQueued` 方法里的循环，如果获取同步状态成功，则会返回 `interrupted = true` 的结果

程序继续向调用栈上层返回，最终回到 AQS 的模版方法 `acquire`

```java
public final void acquire(int arg) {
	if (!tryAcquire(arg) &&
		acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
		selfInterrupt();
}
```

你也许会有疑惑:

> 程序已经成功获取到同步状态并返回了，怎么会有个自我中断呢？

```java
static void selfInterrupt() {
    Thread.currentThread().interrupt();
}
```

[![img](https://rgyb.sunluomeng.top/20200530171736.png)](https://rgyb.sunluomeng.top/20200530171736.png)

如果你不能理解中断，强烈建议你回看 [Java多线程中断机制](https://dayarch.top/p/java-concurrency-interrupt-mechnism.html)

到这里关于获取同步状态我们还遗漏了一条线，acquireQueued 的 finally 代码块如果你仔细看你也许马上就会有疑惑:

> 到底什么情况才会执行 if(failed) 里面的代码 ？

```java
if (failed)
  cancelAcquire(node);
```

这段代码被执行的条件是 failed 为 true，正常情况下，如果跳出循环，failed 的值为false，如果不能跳出循环貌似怎么也不能执行到这里，所以只有不正常的情况才会执行到这里，也就是会发生异常，才会执行到此处

查看 try 代码块，只有两个方法会抛出异常：

- `node.processor()` 方法
- 自己重写的 `tryAcquire()` 方法

先看前者：

[![img](https://rgyb.sunluomeng.top/20200525201815.png)](https://rgyb.sunluomeng.top/20200525201815.png)

很显然，这里抛出的异常不是重点，那就以 ReentrantLock 重写的 tryAcquire() 方法为例

[![img](https://rgyb.sunluomeng.top/20200525202215.png)](https://rgyb.sunluomeng.top/20200525202215.png)

另外，上面分析 `shouldParkAfterFailedAcquire` 方法还对 CANCELLED 的状态进行了判断，那么

> 什么时候会生成取消状态的节点呢？

答案就在 `cancelAcquire` 方法中， 我们来看看 cancelAcquire到底怎么设置/处理 CANNELLED 的

```java
private void cancelAcquire(Node node) {
       // 忽略无效节点
       if (node == null)
           return;
			// 将关联的线程信息清空
       node.thread = null;

       // 跳过同样是取消状态的前驱节点
       Node pred = node.prev;
       while (pred.waitStatus > 0)
           node.prev = pred = pred.prev;

       // 跳出上面循环后找到前驱有效节点，并获取该有效节点的后继节点
       Node predNext = pred.next;

       // 将当前节点的状态置为 CANCELLED
       node.waitStatus = Node.CANCELLED;

       // 如果当前节点处在尾节点，直接从队列中删除自己就好
       if (node == tail && compareAndSetTail(node, pred)) {
           compareAndSetNext(pred, predNext, null);
       } else {
           int ws;
         	// 1. 如果当前节点的有效前驱节点不是头节点，也就是说当前节点不是头节点的后继节点
           if (pred != head &&
               // 2. 判断当前节点有效前驱节点的状态是否为 SIGNAL
               ((ws = pred.waitStatus) == Node.SIGNAL ||
                // 3. 如果不是，尝试将前驱节点的状态置为 SIGNAL
                (ws <= 0 && compareAndSetWaitStatus(pred, ws, Node.SIGNAL))) &&
               // 判断当前节点有效前驱节点的线程信息是否为空
               pred.thread != null) {
             	// 上述条件满足
               Node next = node.next;
             	// 将当前节点有效前驱节点的后继节点指针指向当前节点的后继节点
               if (next != null && next.waitStatus <= 0)
                   compareAndSetNext(pred, predNext, next);
           } else {
             	// 如果当前节点的前驱节点是头节点，或者上述其他条件不满足，就唤醒当前节点的后继节点
               unparkSuccessor(node);
           }
					
           node.next = node; // help GC
       }
```

看到这个注释你可能有些乱了，其核心目的就是从等待队列中移除 CANCELLED 的节点，并重新拼接整个队列，总结来看，其实设置 CANCELLED 状态节点只是有三种情况，我们通过画图来分析一下：

[![img](https://rgyb.sunluomeng.top/20200527104935.png)](https://rgyb.sunluomeng.top/20200527104935.png)

------

[![img](https://rgyb.sunluomeng.top/20200527105017.png)](https://rgyb.sunluomeng.top/20200527105017.png)

------

[![img](https://rgyb.sunluomeng.top/20200527105040.png)](https://rgyb.sunluomeng.top/20200527105040.png)

至此，获取同步状态的过程就结束了，我们简单的用流程图说明一下整个过程

[![img](https://rgyb.sunluomeng.top/20200527112235.png)](https://rgyb.sunluomeng.top/20200527112235.png)

获取锁的过程就这样的结束了，先暂停几分钟整理一下自己的思路。我们上面还没有说明 SIGNAL 的作用， SIGNAL 状态信号到底是干什么用的？这就涉及到锁的释放了，我们来继续了解，整体思路和锁的获取是一样的， 但是释放过程就相对简单很多了

### 独占式释放同步状态

故事要从 unlock() 方法说起

```java
public void unlock() {
	// 释放锁
	sync.release(1);
}
```

调用 AQS 模版方法 release，进入该方法

```java
public final boolean release(int arg) {
  	// 调用自定义同步器重写的 tryRelease 方法尝试释放同步状态
    if (tryRelease(arg)) {
      	// 释放成功，获取头节点
        Node h = head;
      	// 存在头节点，并且waitStatus不是初始状态
      	// 通过获取的过程我们已经分析了，在获取的过程中会将 waitStatus的值从初始状态更新成 SIGNAL 状态
        if (h != null && h.waitStatus != 0)
          	// 解除线程挂起状态
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

查看 unparkSuccessor 方法，实际是要唤醒头节点的后继节点

```java
private void unparkSuccessor(Node node) {      
  	// 获取头节点的waitStatus
    int ws = node.waitStatus;
    if (ws < 0)
      	// 清空头节点的waitStatus值，即置为0
        compareAndSetWaitStatus(node, ws, 0);
  
  	// 获取头节点的后继节点
    Node s = node.next;
  	// 判断当前节点的后继节点是否是取消状态，如果是，需要移除，重新连接队列
    if (s == null || s.waitStatus > 0) {
        s = null;
      	// 从尾节点向前查找，找到队列第一个waitStatus状态小于0的节点
        for (Node t = tail; t != null && t != node; t = t.prev)
          	// 如果是独占式，这里小于0，其实就是 SIGNAL
            if (t.waitStatus <= 0)
                s = t;
    }
    if (s != null)
      	// 解除线程挂起状态
        LockSupport.unpark(s.thread);
}
```

有同学可能有疑问：

> 为什么这个地方是从队列尾部向前查找不是 CANCELLED 的节点？

原因有两个：

第一，先回看节点加入队列的情景：

```java
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    // Try the fast path of enq; backup to full enq on failure
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}
```

节点入队并不是原子操作，代码第6、7行

```
node.prev = pred; 
compareAndSetTail(pred, node)
```

这两个地方可以看作是尾节点入队的原子操作，如果此时代码还没执行到 pred.next = node; 这时又恰巧执行了unparkSuccessor方法，就没办法从前往后找了，因为后继指针还没有连接起来，所以需要从后往前找

第二点原因，在上面图解产生 CANCELLED 状态节点的时候，先断开的是 Next 指针，Prev指针并未断开，因此这也是必须要从后往前遍历才能够遍历完全部的Node

同步状态至此就已经成功释放了，之前获取同步状态被挂起的线程就会被唤醒，继续从下面代码第 3 行返回执行：

```java
private final boolean parkAndCheckInterrupt() {
    LockSupport.park(this);
    return Thread.interrupted();
}
```

继续返回上层调用栈, 从下面代码15行开始执行，重新执行循环，再次尝试获取同步状态

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

到这里，关于独占式获取/释放锁的流程已经闭环了，但是关于 AQS 的另外两个模版方法还没有介绍

- `响应中断`
- `超时限制`

[![img](https://rgyb.sunluomeng.top/20200530195432.png)](https://rgyb.sunluomeng.top/20200530195432.png)

### 独占式响应中断获取同步状态

故事要从lock.lockInterruptibly() 方法说起

```java
public void lockInterruptibly() throws InterruptedException {
	// 调用同步器模版方法可中断式获取同步状态
	sync.acquireInterruptibly(1);
}
```

有了前面的理解，理解独占式可响应中断的获取同步状态方式，真是一眼就能明白了：

```java
public final void acquireInterruptibly(int arg)
        throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();
  	// 尝试非阻塞式获取同步状态失败，如果没有获取到同步状态，执行代码7行
    if (!tryAcquire(arg))
        doAcquireInterruptibly(arg);
}
```

继续查看 `doAcquireInterruptibly` 方法：

```java
private void doAcquireInterruptibly(int arg)
    throws InterruptedException {
    final Node node = addWaiter(Node.EXCLUSIVE);
    boolean failed = true;
    try {
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
              	// 获取中断信号后，不再返回 interrupted = true 的值，而是直接抛出 InterruptedException 
                throw new InterruptedException();
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

没想到 JDK 内部也有如此相近的代码，可响应中断获取锁没什么深奥的，就是被中断抛出 InterruptedException 异常（代码第17行），这样就逐层返回上层调用栈捕获该异常进行下一步操作了

趁热打铁，来看看另外一个模版方法：

### 独占式超时限制获取同步状态

这个很好理解，就是给定一个时限，在该时间段内获取到同步状态，就返回 true， 否则，返回 false。好比线程给自己定了一个闹钟，闹铃一响，线程就自己返回了，这就不会使自己是阻塞状态了

既然涉及到超时限制，其核心逻辑肯定是计算时间间隔，因为在超时时间内，肯定是多次尝试获取锁的，每次获取锁肯定有时间消耗，所以计算时间间隔的逻辑就像我们在程序打印程序耗时 log 那么简单

> nanosTimeout = deadline - System.nanoTime()

故事要从 `lock.tryLock(time, unit)` 方法说起

```java
public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
	// 调用同步器模版方法，可响应中断和超时时间限制
	return sync.tryAcquireNanos(1, unit.toNanos(time));
}
```

来看 tryAcquireNanos 方法

```java
public final boolean tryAcquireNanos(int arg, long nanosTimeout)
        throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();
    return tryAcquire(arg) ||
        doAcquireNanos(arg, nanosTimeout);
}
```

是不是和上面 `acquireInterruptibly` 方法长相很详细了，继续查看来 doAcquireNanos 方法，看程序, 该方法也是 throws InterruptedException，我们在中断文章中说过，方法标记上有 `throws InterruptedException` 说明该方法也是可以响应中断的，所以你可以理解超时限制是 `acquireInterruptibly` 方法的加强版，具有超时和非阻塞控制的双保险

```java
private boolean doAcquireNanos(int arg, long nanosTimeout)
        throws InterruptedException {
  	// 超时时间内，为获取到同步状态，直接返回false
    if (nanosTimeout <= 0L)
        return false;
  	// 计算超时截止时间
    final long deadline = System.nanoTime() + nanosTimeout;
  	// 以独占方式加入到同步队列中
    final Node node = addWaiter(Node.EXCLUSIVE);
    boolean failed = true;
    try {
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return true;
            }
          	// 计算新的超时时间
            nanosTimeout = deadline - System.nanoTime();
          	// 如果超时，直接返回 false
            if (nanosTimeout <= 0L)
                return false;
            if (shouldParkAfterFailedAcquire(p, node) &&
            		// 判断是最新超时时间是否大于阈值 1000    
                nanosTimeout > spinForTimeoutThreshold)
              	// 挂起线程 nanosTimeout 长时间，时间到，自动返回
                LockSupport.parkNanos(this, nanosTimeout);
            if (Thread.interrupted())
                throw new InterruptedException();
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

上面的方法应该不是很难懂，但是又同学可能在第 27 行上有所困惑

> 为什么 nanosTimeout 和 自旋超时阈值1000进行比较？

```java
/**
 * The number of nanoseconds for which it is faster to spin
 * rather than to use timed park. A rough estimate suffices
 * to improve responsiveness with very short timeouts.
 */
static final long spinForTimeoutThreshold = 1000L;
```

其实 doc 说的很清楚，说白了，1000 nanoseconds 时间已经非常非常短暂了，没必要再执行挂起和唤醒操作了，不如直接当前线程直接进入下一次循环

到这里，我们自定义的 MyMutex 只差 Condition 没有说明了，不知道你累了吗？我还在坚持

[![img](https://rgyb.sunluomeng.top/20200530195521.png)](https://rgyb.sunluomeng.top/20200530195521.png)

### Condition

如果你看过之前写的 [并发编程之等待通知机制](https://dayarch.top/p/waiting-notification-mechanism.html) ，你应该对下面这个图是有印象的：

[![img](https://cdn.jsdelivr.net/gh/FraserYu/img-host/blog-img20200315110223.png)](https://cdn.jsdelivr.net/gh/FraserYu/img-host/blog-img20200315110223.png)

如果当时你理解了这个模型，再看 Condition 的实现，根本就不是问题了，首先 Condition 还是一个接口，肯定也是需要有实现类的

[![img](https://rgyb.sunluomeng.top/20200530200503.png)](https://rgyb.sunluomeng.top/20200530200503.png)

那故事就从 `lock.newnewCondition` 说起吧

```java
public Condition newCondition() {
	// 使用自定义的条件
	return sync.newCondition();
}
```

自定义同步器重封装了该方法：

```java
Condition newCondition() {
	return new ConditionObject();
}
```

ConditionObject 就是 Condition 的实现类，该类就定义在了 AQS 中，只有两个成员变量：

```java
/** First node of condition queue. */
private transient Node firstWaiter;
/** Last node of condition queue. */
private transient Node lastWaiter;
```

所以，我们只需要来看一下 ConditionObject 实现的 await / signal 方法来使用这两个成员变量就可以了

```java
public final void await() throws InterruptedException {
    if (Thread.interrupted())
        throw new InterruptedException();
  	// 同样构建 Node 节点，并加入到等待队列中
    Node node = addConditionWaiter();
  	// 释放同步状态
    int savedState = fullyRelease(node);
    int interruptMode = 0;
    while (!isOnSyncQueue(node)) {
      	// 挂起当前线程
        LockSupport.park(this);
        if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
            break;
    }
    if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
        interruptMode = REINTERRUPT;
    if (node.nextWaiter != null) // clean up if cancelled
        unlinkCancelledWaiters();
    if (interruptMode != 0)
        reportInterruptAfterWait(interruptMode);
}
```

这里注意用词，在介绍获取同步状态时，addWaiter 是加入到【同步队列】，就是上图说的入口等待队列，这里说的是【等待队列】，所以 addConditionWaiter 肯定是构建了一个自己的队列：

```java
private Node addConditionWaiter() {
    Node t = lastWaiter;
    
    if (t != null && t.waitStatus != Node.CONDITION) {
        unlinkCancelledWaiters();
        t = lastWaiter;
    }
  	// 新构建的节点的 waitStatus 是 CONDITION，注意不是 0 或 SIGNAL 了
    Node node = new Node(Thread.currentThread(), Node.CONDITION);
  	// 构建单向同步队列
    if (t == null)
        firstWaiter = node;
    else
        t.nextWaiter = node;
    lastWaiter = node;
    return node;
}
```

这里有朋友可能会有疑问：

> 为什么这里是单向队列，也没有使用CAS 来保证加入队列的安全性呢？

因为 await 是 Lock 范式 try 中使用的，说明已经获取到锁了，所以就没必要使用 CAS 了，至于是单向，因为这里还不涉及到竞争锁，只是做一个条件等待队列

在 Lock 中可以定义多个条件，每个条件都会对应一个 条件等待队列，所以将上图丰富说明一下就变成了这个样子：

[![img](https://rgyb.sunluomeng.top/20200530205315.png)](https://rgyb.sunluomeng.top/20200530205315.png)

线程已经按相应的条件加入到了条件等待队列中，那如何再尝试获取锁呢？signal / signalAll 方法就已经排上用场了

```java
public final void signal() {
    if (!isHeldExclusively())
        throw new IllegalMonitorStateException();
    Node first = firstWaiter;
    if (first != null)
        doSignal(first);
}
```

Signal 方法通过调用 doSignal 方法，只唤醒条件等待队列中的第一个节点

```java
private void doSignal(Node first) {
    do {
        if ( (firstWaiter = first.nextWaiter) == null)
            lastWaiter = null;
        first.nextWaiter = null;
      	// 调用该方法，将条件等待队列的线程节点移动到同步队列中
    } while (!transferForSignal(first) &&
             (first = firstWaiter) != null);
}
```

继续看 `transferForSignal` 方法

```java
final boolean transferForSignal(Node node) {       
    if (!compareAndSetWaitStatus(node, Node.CONDITION, 0))
        return false;

   	// 重新进行入队操作
    Node p = enq(node);
    int ws = p.waitStatus;
    if (ws > 0 || !compareAndSetWaitStatus(p, ws, Node.SIGNAL))
      	// 唤醒同步队列中该线程
        LockSupport.unpark(node.thread);
    return true;
}
```

所以我们再用图解一下唤醒的整个过程

[![img](https://rgyb.sunluomeng.top/20200530210706.png)](https://rgyb.sunluomeng.top/20200530210706.png)

到这里，理解 signalAll 就非常简单了，只不过循环判断是否还有 nextWaiter，如果有就像 signal 操作一样，将其从条件等待队列中移到同步队列中

```java
private void doSignalAll(Node first) {
    lastWaiter = firstWaiter = null;
    do {
        Node next = first.nextWaiter;
        first.nextWaiter = null;
        transferForSignal(first);
        first = next;
    } while (first != null);
}
```

不知你还是否记得，我在[并发编程之等待通知机制](https://dayarch.top/p/waiting-notification-mechanism.html) 中还说过一句话

> 没有特殊原因尽量用 signalAll 方法

什么时候可以用 signal 方法也在其中做了说明，请大家自行查看吧

[![img](https://rgyb.sunluomeng.top/20200530211202.png)](https://rgyb.sunluomeng.top/20200530211202.png)

这里我还要多说一个细节，从条件等待队列移到同步队列是有时间差的，所以使用 await() 方法也是范式的， 同样在该文章中做了解释

[![img](https://cdn.jsdelivr.net/gh/FraserYu/img-host/blog-img20200312154011.png)](https://cdn.jsdelivr.net/gh/FraserYu/img-host/blog-img20200312154011.png)

有时间差，就会有公平和不公平的问题，想要全面了解这个问题，我们就要走近 ReentrantLock 中来看了，除了了解公平/不公平问题，查看 ReentrantLock 的应用还是要反过来验证它使用的AQS的，我们继续吧

## ReentrantLock 是如何应用的AQS

独占式的典型应用就是 ReentrantLock 了，我们来看看它是如何重写这个方法的

[![img](https://rgyb.sunluomeng.top/20200530113417.png)](https://rgyb.sunluomeng.top/20200530113417.png)

乍一看挺奇怪的，怎么里面自定义了三个同步器：其实 NonfairSync，FairSync 只是对 Sync 做了进一步划分：

[![img](https://rgyb.sunluomeng.top/20200531100921.png)](https://rgyb.sunluomeng.top/20200531100921.png)

从名称上你应该也知道了，这就是你听到过的 `公平锁/非公平锁`了

### 何为公平锁/非公平锁？

生活中，排队讲求先来后到视为公平。程序中的公平性也是符合请求锁的绝对时间的，其实就是 FIFO，否则视为不公平

我们来对比一下 ReentrantLock 是如何实现公平锁和非公平锁的

[![img](https://rgyb.sunluomeng.top/20200531102752.png)](https://rgyb.sunluomeng.top/20200531102752.png)

其实没什么大不了，公平锁就是判断同步队列是否还有先驱节点的存在，只有没有先驱节点才能获取锁；而非公平锁是不管这个事的，能获取到同步状态就可以，就这么简单，那问题来了：

### 为什么会有公平锁/非公平锁的设计？

考虑这个问题，我们需重新回忆上面的锁获取实现图了，其实上面我已经透露了一点

[![img](https://rgyb.sunluomeng.top/20200530210706.png)](https://rgyb.sunluomeng.top/20200530210706.png)

主要有两点原因：

#### 原因一：

恢复挂起的线程到真正锁的获取还是有时间差的，从人类的角度来看这个时间微乎其微，但是从CPU的角度来看，这个时间差存在的还是很明显的。所以非公平锁能更充分的利用 CPU 的时间片，尽量减少 CPU 空闲状态时间

\####原因二：

不知你是否还记得我在 [面试问，创建多少个线程合适？](https://dayarch.top/p/how-many-threads-should-be-created.html) 文章中反复提到过，使用多线程很重要的考量点是线程切换的开销，想象一下，如果采用非公平锁，当一个线程请求锁获取同步状态，然后释放同步状态，因为不需要考虑是否还有前驱节点，所以刚释放锁的线程在此刻再次获取同步状态的几率就变得非常大，所以就减少了线程的开销

[![img](https://rgyb.sunluomeng.top/20200531104701.png)](https://rgyb.sunluomeng.top/20200531104701.png)

相信到这里，你也就明白了，为什么 ReentrantLock 默认构造器用的是非公平锁同步器

```java
public ReentrantLock() {
    sync = new NonfairSync();
}
```

看到这里，感觉非公平锁 perfect，非也，有得必有失

> 使用公平锁会有什么问题？

公平锁保证了排队的公平性，非公平锁霸气的忽视这个规则，所以就有可能导致排队的长时间在排队，也没有机会获取到锁，这就是传说中的 **“饥饿”**

### 如何选择公平锁/非公平锁？

相信到这里，答案已经在你心中了，如果为了更高的吞吐量，很显然非公平锁是比较合适的，因为节省很多线程切换时间，吞吐量自然就上去了，否则那就用公平锁还大家一个公平

我们还差最后一个环节，真的要挺住

### 可重入锁

到这里，我们还没分析 ReentrantLock 的名字，JDK 起名这么有讲究，肯定有其含义，直译过来【可重入锁】

> 为什么要支持锁的重入？

试想，如果是一个有 synchronized 修饰的递归调用方法，程序第二次进入被自己阻塞了岂不是很大的笑话，所以 synchronized 是支持锁的重入的

Lock 是新轮子，自然也要支持这个功能，其实现也很简单，请查看公平锁和非公平锁对比图，其中有一段代码：

```java
// 判断当前线程是否和已占用锁的线程是同一个
else if (current == getExclusiveOwnerThread())
```

仔细看代码， 你也许发现，我前面的一个说明是错误的，我要重新解释一下

[![img](https://rgyb.sunluomeng.top/20200531110129.png)](https://rgyb.sunluomeng.top/20200531110129.png)

重入的线程会一直将 state + 1， 释放锁会 state - 1直至等于0，上面这样写也是想帮助大家快速的区分

## 总结

本文是一个长文，说明了为什么要造 Lock 新轮子，如何标准的使用 Lock，AQS 是什么，是如何实现锁的，结合 ReentrantLock 反推 AQS 中的一些应用以及其独有的一些特性

独占式获取锁就这样介绍完了，我们还差 AQS 共享式 `xxxShared` 没有分析，结合共享式，接下来我们来阅读一下 Semaphore，ReentrantReadWriteLock 和 CountLatch 等

另外也欢迎大家的留言，如有错误之处还请指出，我的手酸了，眼睛干了，我去准备撸下一篇…..

[![img](https://rgyb.sunluomeng.top/20200531112135.png)](https://rgyb.sunluomeng.top/20200531112135.png)

## 灵魂追问

1. 为什么更改 state 有 setState() , compareAndSetState() 两种方式，感觉后者更安全，但是锁的视线中有好多地方都使用了 setState()，安全吗？

2. 下面代码是一个转账程序，是否存在死锁或者锁的其他问题呢？

   ```java
   class Account {
     private int balance;
     private final Lock lock
             = new ReentrantLock();
     // 转账
     void transfer(Account tar, int amt){
       while (true) {
         if(this.lock.tryLock()) {
           try {
             if (tar.lock.tryLock()) {
               try {
                 this.balance -= amt;
                 tar.balance += amt;
               } finally {
                 tar.lock.unlock();
               }
             }//if
           } finally {
             this.lock.unlock();
           }
         }//if
       }//while
     }//transfer
   }
   ```

## 参考

1. Java 并发实战
2. Java 并发编程的艺术
3. https://tech.meituan.com/2019/12/05/aqs-theory-and-apply.html











参考与感谢

https://tech.meituan.com/2019/12/05/aqs-theory-and-apply.html

https://github.com/Snailclimb/JavaGuide/blob/master/docs/java/Multithread/AQS.md

https://www.javadoop.com/post/AbstractQueuedSynchronizer-2

https://www.cnblogs.com/waterystone/p/4920797.html

https://www.cnblogs.com/chengxiao/archive/2017/07/24/7141160.html