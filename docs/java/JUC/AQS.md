## 队列同步器 AQS

Java 中的大部分同步类都是基于AbstractQueuedSynchronizer（简称为AQS）实现的。

`ReentrantLock`、`ReentrantReadWriteLock`、`Semaphore(信号量)`、`CountDownLatch`、`公平锁`、`非公平锁`、

`ThreadPoolExecutor` 都和 AQS 有直接关系，所以了解 AQS 的抽象实现，并在此基础上结合上述各类的实现细节，很快就可以把 JUC 一网打尽，不至于查看源码时一头雾水，丢失主线。



### 是什么

AQS 是 `AbstractQueuedSynchronizer` 的简称，翻译成中文就是 `抽象队列同步器` ，这三个单词分开来看：

- Abstract （抽象）：也就是说， AQS 是一个抽象类，只实现一些主要的逻辑，有些方法推迟到子类实现
- Queued （队列）：队列有啥特征呢？先进先出（ FIFO ）对吧？也就是说， AQS 是用先进先出队列来存储数据的
- Synchronizer （同步器）：即 AQS是 实现同步功能的

以上概括一下， AQS 是一个用来构建锁和同步器的框架，使用 AQS 能简单而又高效地构造出同步器。



程序员么，看原理类内容，不看源码“下饭”，就不叫深入学习，所以，适当打开下源码结合着看，很容易理解了。



## 框架结构

首先，我们通过下面的架构图来整体了解一下 AQS 框架

![美团技术团队](https://p1.meituan.net/travelcube/82077ccf14127a87b77cefd1ccf562d3253591.png)

- 上图中有颜色的为 Method，无颜色的为 Attribution。
- 总的来说，AQS 框架共分为五层，自上而下由浅入深，从 AQS 对外暴露的 API 到底层基础数据。
- 当有自定义同步器接入时，只需重写第一层所需要的部分方法即可，不需要关注底层具体的实现流程。当自定义同步器进行加锁或者解锁操作时，先经过第一层的 API 进入 AQS 内部方法，然后经过第二层进行锁的获取，接着对于获取锁失败的流程，进入第三层和第四层的等待队列处理，而这些处理方式均依赖于第五层的基础数据提供层。



### 第一层

如果你现在打开 IDE， 你会发现我们经常使用的 `ReentrantLock` 、`ReentrantReadWriteLock`、 `Semaphore`、 `CountDownLatch` ，都是【聚合】了一个【队列同步器】的子类完成线程访问控制的，也就是我们说的第一层，API 层。

为什么要聚合一个同步器的子类呢，这其实就是一个典型的模板方法模式的优点：

- 我们使用的锁事面向使用者的，它定义了使用者与锁交互的接口，隐藏了实现的细节，我们就像范式那样直接使用就可以了，很简单
- 而同步器面向的是锁的实现，比如 Doug Lea 大神，或者我们业务自定义的同步器，它简化了锁的实现方式，屏蔽了同步状态管理，线程排队，等待/唤醒等底层操作

这可以让我们使用起来更加方便，因为我们绝大多数都是在使用锁，实现锁之后，其核心就是要使用方便。



同步器的设计是就基于模板方法模式的，如果需要自定义同步器一般的方式是这样（模板方法模式很经典的一个应用）：

1. 使用者继承 AbstractQueuedSynchronizer 并重写指定的方法。（这些重写方法很简单，无非是对于共享资源 state 的获取和释放）
2. 将 AQS 组合在自定义同步组件的实现中，并调用其模板方法，而这些模板方法又会调用使用者重写的方法。

这和我们以往通过实现接口的方式有很大区别，这是模板方法模式很经典的一个运用，下面简单的给大家介绍一下模板方法模式，模板方法模式是一个很容易理解的设计模式之一。

> 模板方法模式是基于”继承“的，主要是为了在不改变模板结构的前提下在子类中重新定义模板中的内容以实现复用代码。

模板方法模式，都有两类方法，子类可重写的方法和模板类提供的模板方法，那 AQS 中肯定也有这两类方法，其实就是我们说的第一层 API 层中的所有方法，我们来看看

1. 哪些是自定义同步器可重写的方法？
2. 哪些是抽象同步器提供的模版方法？

#### 同步器可重写的方法

同步器提供的可重写方法只有5个，这大大方便了锁的使用者：

![](https://rgyb.sunluomeng.top/20200523160830.png)

按理说，需要重写的方法也应该有 abstract 来修饰的，为什么这里没有？原因其实很简单，上面的方法我已经用颜色区分成了两类：

- `独占式`：一个时间点只能执行一个线程
- `共享式`：一个时间点可多个线程同时执行

表格方法描述中所说的`同步状态`就是上文提到的有 volatile 修饰的 state，所以我们在`重写`上面几个方法时，还可以通过同步器提供的下面三个方法（AQS 提供的）来获取或修改同步状态：

![](https://rgyb.sunluomeng.top/20200523160906.png)

而独占式和共享式操作 state 变量的区别也就很简单了，我们可以通过修改 State 字段表示的同步状态来实现多线程的独占模式和共享模式（加锁过程）

![](https://rgyb.sunluomeng.top/20200523160705.png)

稍微详细点步骤如下：

![](https://p0.meituan.net/travelcube/27605d483e8935da683a93be015713f331378.png)

![](https://p0.meituan.net/travelcube/3f1e1a44f5b7d77000ba4f9476189b2e32806.png)



#### 同步器提供的模版方法

上面我们将同步器的实现方法分为独占式和共享式两类，模版方法其实除了提供以上两类模版方法之外，只是多了`响应中断`和`超时限制` 的模版方法供 Lock 使用，来看一下

![](https://rgyb.sunluomeng.top/20200523195957.png)

先不用记上述方法的功能，目前你只需要了解个大概功能就好。另外，相信你也注意到了：

> 上面的方法都有 final 关键字修饰，说明子类不能重写这个方法

看到这你也许有点乱了，我们稍微归纳一下：

![](https://rgyb.sunluomeng.top/20200523213113.png)

程序员还是看代码心里踏实一点，我们再来用代码说明一下上面的关系（注意代码中的注释，以下的代码并不是很严谨，只是为了简单说明上图的代码实现）：

```java
/**
 * 自定义互斥锁
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

再打开 IDE， 看看 `ReentrantLock` `ReentrantReadWriteLock` `Semaphore(信号量)` `CountDownLatch` 的实现，会发现，他们都是按照这个结构实现的，是不感觉会了一个，剩下的几个常见的也差不多了。



接着我们就来看一看 AQS 的模版方法到底是怎么实现锁的



## AQS实现分析 | 原理

AQS 核心思想是，如果被请求的共享资源空闲，那么就将当前请求资源的线程设置为有效的工作线程，将共享资源设置为锁定状态；如果共享资源被占用，就需要一定的阻塞等待唤醒机制来保证锁分配。这个机制主要用的是CLH 队列的变体实现的，将暂时获取不到锁的线程加入到队列中。

> CLH：Craig、Landin and Hagersten队列，是单向链表，AQS 中的队列是 CLH 变体的虚拟双向队列（FIFO），AQS 是通过将每条请求共享资源的线程封装成一个节点来实现锁的分配。

主要原理图如下：

![](https://p0.meituan.net/travelcube/7132e4cef44c26f62835b197b239147b18062.png)

AQS 使用一个 volatile 的 int 类型的成员变量来表示同步状态，通过内置的 FIFO 队列来完成资源获取的排队工作，通过 CAS 完成对 state 值的修改。

队列中每个排队的个体就是一个 Node，所以我们来看一下 Node 的结构



### AQS数据结构

#### Node 节点

AQS 内部维护了一个同步队列，用于管理同步状态。

- 当线程获取同步状态失败时，就会将当前线程以及等待状态等信息构造成一个 Node 节点，将其加入到同步队列中尾部，阻塞该线程
- 当同步状态被释放时，会唤醒同步队列中“首节点”的线程获取同步状态

为了将上述步骤弄清楚，我们需要来看一看 Node 结构 （如果你能打开 IDE 一起看那是极好的）

![img](https://rgyb.sunluomeng.top/20200524183916.png)

解释一下几个方法和属性值的含义：

| 方法和属性值 | 含义                                                         |
| :----------- | :----------------------------------------------------------- |
| waitStatus   | 当前节点在队列中的状态                                       |
| thread       | 表示处于该节点的线程                                         |
| prev         | 前驱指针                                                     |
| predecessor  | 返回前驱节点，没有的话抛出npe                                |
| nextWaiter   | 指向下一个处于CONDITION状态的节点（由于本篇文章不讲述Condition Queue队列，这个指针不多介绍） |
| next         | 后继指针                                                     |

线程两种锁的模式：

| 模式      | 含义                           |
| :-------- | :----------------------------- |
| SHARED    | 表示线程以共享的模式等待锁     |
| EXCLUSIVE | 表示线程正在以独占的方式等待锁 |

waitStatus有下面几个枚举值：

| 枚举      | 含义                                           |
| :-------- | :--------------------------------------------- |
| 0         | 当一个Node被初始化的时候的默认值               |
| CANCELLED | 为1，表示线程获取锁的请求已经取消了            |
| CONDITION | 为-2，表示节点在等待队列中，节点线程等待唤醒   |
| PROPAGATE | 为-3，当前线程处在SHARED情况下，该字段才会使用 |
| SIGNAL    | 为-1，表示线程已经准备好了，就等资源释放了     |

乍一看有点杂乱，我们还是将其归类说明一下：

![](https://rgyb.sunluomeng.top/20200524184014.png)

上面这几个状态说明有个印象就好，有了Node 的结构说明铺垫，你也就能想象同步队列的基本结构了：

![](https://rgyb.sunluomeng.top/20200525072245.png)





一般来说，自定义同步器要么是独占方式，要么是共享方式，它们也只需实现 tryAcquire-tryRelease、tryAcquireShared-tryReleaseShared 中的一种即可。AQS 也支持自定义同步器同时实现独占和共享两种方式，如ReentrantReadWriteLock。ReentrantLock 是独占锁，所以实现了 tryAcquire-tryRelease。

前置知识基本铺垫完毕，我们来看一看独占式获取同步状态的整个过程

### 独占式获取同步状态

故事要从范式 `lock.lock()` 开始，，或者可以结合着 ReentrantLock 来看，也可以（先不要在意公平锁和非公平锁，他们在底层是相同的）

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

首先，也会尝试非阻塞的获取同步状态，如果该方法返回了True，则说明当前线程获取锁成功，如果获取失败（tryAcquire 返回 false），则会调用 `addWaiter` 方法构造 Node 节点（Node.EXCLUSIVE 独占式）并安全的（CAS）加入到同步队列【尾部】

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

//如果Pred指针是Null（说明等待队列中没有元素），或者当前Pred指针和Tail指向的位置不同（说明被别的线程已经修改），就需要看一下Enq的方法
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

如果没有被初始化，需要进行初始化一个头结点出来（注释中的哨兵结点）。但请注意，初始化的头结点并不是当前线程节点，而是调用了无参构造函数的节点。如果经历了初始化或者并发导致队列中有元素，则与之前的方法相同。其实，addWaiter就是一个在双端链表添加尾节点的操作，需要注意的是，双端链表的头结点是一个无参构造函数的头结点。

总结一下，线程获取锁的时候，过程大体如下：

1. 当没有线程获取到锁时，线程1获取锁成功。
2. 线程2申请锁，但是锁被线程1占有。
3. 如果再有线程要获取锁，依次在队列中往后排队即可。

![img](https://p0.meituan.net/travelcube/e9e385c3c68f62c67c8d62ab0adb613921117.png)

上边解释了 addWaiter 方法，这个方法其实就是把对应的线程以 Node 的数据结构形式加入到双端队列里，返回的是一个包含该线程的 Node。而这个 Node 会作为参数，进入到 acquireQueued 方法中。acquireQueued 方法可以对排队中的线程进行“获锁”操作。

总的来说，一个线程获取锁失败了，被放入等待队列，acquireQueued 会把放入队列中的线程不断去获取锁，直到获取成功或者不再需要获取（中断）。

下面我们从“何时出队列？”和“如何出队列？”两个方向来分析一下acquireQueued源码：

```java
final boolean acquireQueued(final Node node, int arg) {
    // 标记是否成功拿到资源
    boolean failed = true;
    try {
        // 标记等待过程中是否中断过
        boolean interrupted = false;
      	// "死循环"，自旋，要么获取锁，要么中断
        for (;;) {
          	// 获取当前节点的前驱节点
            final Node p = node.predecessor();
          	// 如果p是头结点，说明当前节点在真实数据队列的首部，就尝试获取锁（别忘了头结点是虚节点）
          	// 这就是为什么有个空的头结点
            if (p == head && tryAcquire(arg)) {
              	// 获取锁成功，头指针移动到当前node
                setHead(node);
              	// 将哨兵节点的后继节点置为空，方便GC
                p.next = null; // help GC
                failed = false;
              	// 返回中断标识
                return interrupted;
            }
          	// 当前节点的前驱节点不是头节点
          	//【或者】当前节点的前驱节点是头节点但获取同步状态失败
            // 说明p为头节点且当前没有获取到锁（可能是非公平锁被抢占了）或者是p不为头结点，这个时候就要判断当前node是否要被阻塞（被阻塞条件：前驱节点的waitStatus为-1），防止无限循环浪费资源。具体两个方法下面细细分析
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

注：setHead方法是把当前节点置为虚节点，但并没有修改waitStatus，因为它是一直需要用的数据。

```java
private void setHead(Node node) {
	head = node;
	node.thread = null;
	node.prev = null;
}
```

获取同步状态成功会返回可以理解了，但是如果失败就会一直陷入到“死循环”中浪费资源吗？很显然不是，`shouldParkAfterFailedAcquire(p, node)` 和 `parkAndCheckInterrupt()` 就会将线程获取同步状态失败的线程挂起，我们继续向下看

```java
// 靠前驱节点判断当前线程是否应该被阻塞
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
  	// 获取前驱节点的状态
    int ws = pred.waitStatus;
  	// 如果是 SIGNAL 状态，即等待被占用的资源释放，直接返回 true
  	// 准备继续调用 parkAndCheckInterrupt 方法
    // 说明头结点处于唤醒状态
    if (ws == Node.SIGNAL)
        return true;
  	// ws 大于0说明是CANCELLED状态，取消状态
    if (ws > 0) {
        // 循环判断前驱节点的前驱节点是否也为CANCELLED状态，忽略该状态的节点，重新连接队列
        do {
            // 循环向前查找取消节点，把取消节点从队列中剔除
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);
        pred.next = node;
    } else {
      	// 将当前节点的前驱节点设置为设置为 SIGNAL 状态，用于后续唤醒操作
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
    }
    return false;
}
```

到这里你也许有个问题：

> 这个地方设置前驱节点为 SIGNAL 状态到底有什么作用？

保留这个问题，我们陆续揭晓

如果前驱节点的 waitStatus 是 SIGNAL状态，即 shouldParkAfterFailedAcquire 方法会返回 true ，程序会继续向下执行 `parkAndCheckInterrupt` 方法，parkAndCheckInterrupt 主要用于挂起当前线程，阻塞调用栈，返回当前线程的中断状态

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

上述方法的流程图如下：

![](https://p0.meituan.net/travelcube/c124b76dcbefb9bdc778458064703d1135485.png)

从上图可以看出，跳出当前循环的条件是当“前置节点是头结点，且当前线程获取锁成功”。为了防止因死循环导致CPU资源被浪费，我们会判断前置节点的状态来决定是否要将当前线程挂起，具体挂起流程用流程图表示如下（shouldParkAfterFailedAcquire流程）：

![](https://p0.meituan.net/travelcube/9af16e2481ad85f38ca322a225ae737535740.png)





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

![](https://rgyb.sunluomeng.top/20200530171736.png)

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

<img src="https://rgyb.sunluomeng.top/20200525201815.png" style="zoom:200%;" />

很显然，这里抛出的异常不是重点，那就以 ReentrantLock 重写的 tryAcquire() 方法为例

![](https://rgyb.sunluomeng.top/20200525202215.png)

另外，上面分析 `shouldParkAfterFailedAcquire` 方法还对 CANCELLED 的状态进行了判断，那么

> 什么时候会生成取消状态的节点呢？

acquireQueued方法中的Finally代码：

```java
// java.util.concurrent.locks.AbstractQueuedSynchronizer

final boolean acquireQueued(final Node node, int arg) {
	boolean failed = true;
	try {
    ...
		for (;;) {
			final Node p = node.predecessor();
			if (p == head && tryAcquire(arg)) {
				...
				failed = false;
        ...
			}
			...
	} finally {
		if (failed)
			cancelAcquire(node);
		}
}
```

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
    // 更新失败的话，则进入else，如果更新成功，将tail的后继节点设置为null
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

看到这个注释你可能有些乱了，其核心目的就是从等待队列中移除 CANCELLED 的节点，并重新拼接整个队列，

当前的流程：

- 获取当前节点的前驱节点，如果前驱节点的状态是CANCELLED，那就一直往前遍历，找到第一个waitStatus <= 0的节点，将找到的Pred节点和当前Node关联，将当前Node设置为CANCELLED。
- 根据当前节点的位置，考虑以下三种情况：

(1) 当前节点是尾节点。

(2) 当前节点是Head的后继节点。

(3) 当前节点不是Head的后继节点，也不是尾节点。

根据上述第二条，我们来分析每一种情况的流程。

当前节点是尾节点。

![img](https://p1.meituan.net/travelcube/b845211ced57561c24f79d56194949e822049.png)

当前节点是Head的后继节点。

![img](https://p1.meituan.net/travelcube/ab89bfec875846e5028a4f8fead32b7117975.png)

当前节点不是Head的后继节点，也不是尾节点。

![img](https://p0.meituan.net/travelcube/45d0d9e4a6897eddadc4397cf53d6cd522452.png)

通过上面的流程，我们对于CANCELLED节点状态的产生和变化已经有了大致的了解，但是为什么所有的变化都是对Next指针进行了操作，而没有对Prev指针进行操作呢？什么情况下会对Prev指针进行操作？

> 执行cancelAcquire的时候，当前节点的前置节点可能已经从队列中出去了（已经执行过Try代码块中的shouldParkAfterFailedAcquire方法了），如果此时修改Prev指针，有可能会导致Prev指向另一个已经移除队列的Node，因此这块变化Prev指针不安全。 shouldParkAfterFailedAcquire方法中，会执行下面的代码，其实就是在处理Prev指针。shouldParkAfterFailedAcquire是获取锁失败的情况下才会执行，进入该方法后，说明共享资源已被获取，当前节点之前的节点都不会出现变化，因此这个时候变更Prev指针比较安全。
>
> ```
> do {
> 	node.prev = pred = pred.prev;
> } while (pred.waitStatus > 0);
> ```

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

![img](https://rgyb.sunluomeng.top/20200530195432.png)

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

![img](https://rgyb.sunluomeng.top/20200530195521.png)

### Condition

如果你看过之前写的 [并发编程之等待通知机制](https://dayarch.top/p/waiting-notification-mechanism.html) ，你应该对下面这个图是有印象的：

![](https://cdn.jsdelivr.net/gh/FraserYu/img-host/blog-img20200315110223.png)

如果当时你理解了这个模型，再看 Condition 的实现，根本就不是问题了，首先 Condition 还是一个接口，肯定也是需要有实现类的

![](https://rgyb.sunluomeng.top/20200530200503.png)

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

![](https://rgyb.sunluomeng.top/20200530205315.png)

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

![](https://rgyb.sunluomeng.top/20200530210706.png)

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

![img](https://rgyb.sunluomeng.top/20200530211202.png)

这里我还要多说一个细节，从条件等待队列移到同步队列是有时间差的，所以使用 await() 方法也是范式的， 同样在该文章中做了解释

![](https://cdn.jsdelivr.net/gh/FraserYu/img-host/blog-img20200312154011.png)

有时间差，就会有公平和不公平的问题，想要全面了解这个问题，我们就要走近 ReentrantLock 中来看了，除了了解公平/不公平问题，查看 ReentrantLock 的应用还是要反过来验证它使用的AQS的，我们继续吧

## ReentrantLock 是如何应用的AQS

独占式的典型应用就是 ReentrantLock 了，我们来看看它是如何重写这个方法的

![](https://rgyb.sunluomeng.top/20200530113417.png)

乍一看挺奇怪的，怎么里面自定义了三个同步器：其实 NonfairSync，FairSync 只是对 Sync 做了进一步划分：

![](https://rgyb.sunluomeng.top/20200531100921.png)

从名称上你应该也知道了，这就是你听到过的 `公平锁/非公平锁`了

### 何为公平锁/非公平锁？

生活中，排队讲求先来后到视为公平。程序中的公平性也是符合请求锁的绝对时间的，其实就是 FIFO，否则视为不公平

我们来对比一下 ReentrantLock 是如何实现公平锁和非公平锁的

![](https://rgyb.sunluomeng.top/20200531102752.png)

其实没什么大不了，公平锁就是判断同步队列是否还有先驱节点的存在，只有没有先驱节点才能获取锁；而非公平锁是不管这个事的，能获取到同步状态就可以，就这么简单，那问题来了：

### 为什么会有公平锁/非公平锁的设计？

考虑这个问题，我们需重新回忆上面的锁获取实现图了，其实上面我已经透露了一点

![](https://rgyb.sunluomeng.top/20200530210706.png)

主要有两点原因：

#### 原因一：

恢复挂起的线程到真正锁的获取还是有时间差的，从人类的角度来看这个时间微乎其微，但是从CPU的角度来看，这个时间差存在的还是很明显的。所以非公平锁能更充分的利用 CPU 的时间片，尽量减少 CPU 空闲状态时间

\####原因二：

不知你是否还记得我在 [面试问，创建多少个线程合适？](https://dayarch.top/p/how-many-threads-should-be-created.html) 文章中反复提到过，使用多线程很重要的考量点是线程切换的开销，想象一下，如果采用非公平锁，当一个线程请求锁获取同步状态，然后释放同步状态，因为不需要考虑是否还有前驱节点，所以刚释放锁的线程在此刻再次获取同步状态的几率就变得非常大，所以就减少了线程的开销

![](https://rgyb.sunluomeng.top/20200531104701.png)

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

![](https://rgyb.sunluomeng.top/20200531110129.png)

重入的线程会一直将 state + 1， 释放锁会 state - 1直至等于0，上面这样写也是想帮助大家快速的区分

## 总结

本文是一个长文，说明了为什么要造 Lock 新轮子，如何标准的使用 Lock，AQS 是什么，是如何实现锁的，结合 ReentrantLock 反推 AQS 中的一些应用以及其独有的一些特性

独占式获取锁就这样介绍完了，我们还差 AQS 共享式 `xxxShared` 没有分析，结合共享式，接下来我们来阅读一下 Semaphore，ReentrantReadWriteLock 和 CountLatch 等

另外也欢迎大家的留言，如有错误之处还请指出，我的手酸了，眼睛干了，我去准备撸下一篇…..

![](https://rgyb.sunluomeng.top/20200531112135.png)

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



**AQS 核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制 AQS 是用 CLH 队列锁实现的，即将暂时获取不到锁的线程加入到队列中。**



## 参考

1. Java 并发实战
2. Java 并发编程的艺术
3. https://tech.meituan.com/2019/12/05/aqs-theory-and-apply.html
4. https://github.com/Snailclimb/JavaGuide/blob/master/docs/java/Multithread/AQS.md
5. https://www.javadoop.com/post/AbstractQueuedSynchronizer-2
6. https://www.cnblogs.com/waterystone/p/4920797.html
7. https://www.cnblogs.com/chengxiao/archive/2017/07/24/7141160.html
8. https://dayarch.top/p/java-aqs-and-reentrantlock.html







