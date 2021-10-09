# 分布式锁

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/redis/locks-505878_1280.jpg)

> 分布式锁的文章其实早就烂大街了，但有些“菜鸟”写的太浅，或者自己估计都没搞明白，没用过，看完后我更懵逼了，有些“大牛”写的吧，又太高级，只能看懂前半部分，后边就开始讲论文了，也比较懵逼，所以还得我这个中不溜的来总结下
>
> 文章拢共分为几个部分：
>
> - 什么是分布式锁
> - 分布式锁的实现要求
> - 基于 Redisson 实现的 Redis 分布式锁
> - 再简单说下 RedLock

## 一、什么是分布式锁	 

**分布式~~锁**，要这么念，首先得是『分布式』，然后才是『锁』

- 分布式：这里的分布式指的是分布式系统，涉及到好多技术和理论，包括 CAP 理论、分布式存储、分布式事务、分布式锁...

  > 分布式系统是由一组通过网络进行通信、为了完成共同的任务而协调工作的计算机节点组成的系统。
  >
  > 分布式系统的出现是为了用廉价的、普通的机器完成单个计算机无法完成的计算、存储任务。其目的是**利用更多的机器，处理更多的数据**。

- 锁：对对，就是你想的那个，Javer 学的第一个锁应该就是 `synchronized` 

  > Java 初级面试问题，来拼写下 **赛克瑞纳挨日的**

  从锁的使用场景有来看下边这 3 种锁：

  **线程锁**：`synchronized` 是用在方法或代码块中的，我们把它叫『线程锁』，线程锁的实现其实是靠线程之间共享内存实现的，说白了就是内存中的一个整型数，有空闲、上锁这类状态，比如 synchronized 是在对象头中的 Mark Word 有个锁状态标志，Lock 的实现类大部分都有个叫 `volatile int state` 的共享变量来做状态标志。

  **进程锁**：为了控制同一操作系统中多个进程访问某个共享资源，因为进程具有独立性，各个进程无法访问其他进程的资源，因此无法通过 synchronized 等线程锁实现进程锁。比如说，我们的同一个 linux 服务器，部署了好几个 Java 项目，有可能同时访问或操作服务器上的相同数据，这就需要进程锁，一般可以用『文件锁』来达到进程互斥。

  **分布式锁**：随着用户越来越多，我们上了好多服务器，原本有个定时给客户发邮件的任务，如果不加以控制的话，到点后每台机器跑一次任务，客户就会收到 N 条邮件，这就需要通过分布式锁来互斥了。

  > 书面解释：分布式锁是控制分布式系统或不同系统之间共同访问共享资源的一种锁实现，如果不同的系统或同一个系统的不同主机之间共享了某个资源时，往往需要互斥来防止彼此干扰来保证一致性。



知道了什么是分布式锁，接下来就到了技术选型环节

![](http://img.doutula.com/production/uploads/image/2018/01/03/20180103987632_tEBevG.jpg)

## 二、分布式锁要怎么搞

要实现一个分布式锁，我们一般选择集群机器都可以操作的外部系统，然后各个机器都去这个外部系统申请锁。

这个外部系统一般需要满足如下要求才能胜任：

1. **互斥**：在任意时刻，只能有一个客户端能持有锁。
2. **防止死锁**：即使有一个客户端在持有锁的期间崩溃而没有主动解锁，也能保证后续其他客户端能加锁。所以锁一般要有一个过期时间。
4. **独占性**：解铃还须系铃人，加锁和解锁必须是同一个客户端，一把锁只能有一把钥匙，客户端自己的锁不能被别人给解开，当然也不能去开别人的锁。
4. **容错**：外部系统不能太“脆弱”，要保证外部系统的正常运行，客户端才可以加锁和解锁。



我觉得可以这么类比：

好多商贩要租用某个仓库，同一时刻，只能给一个商贩租用，且只能有一把钥匙，还得有固定的“租期”，到期后要回收的，当然最重要的是仓库门不能坏了，要不锁都锁不住。这不就是分布式锁吗？

> 感慨自己真是个爱技术爱生活的程序猿~~
>
> 其实锁，本质上就是用来进行防重操作的（数据一致性），像查询这种幂等操作，就不需要费这劲



直接上结论：

分布式锁一般有三种实现方式：**1. 数据库乐观锁；2. 基于 Redis 的分布式锁；3. 基于 ZooKeeper 的分布式锁。**

但为了追求更好的性能，我们通常会选择使用 Redis 或 Zookeeper 来做。

> 想必也有喜欢问为什么的同学，那数据库客观锁怎么就性能不好了?
>
> 使用数据库乐观锁，包括主键防重，版本号控制。但是这两种方法各有利弊。
>
> - 使用主键冲突的策略进行防重，在并发量非常高的情况下对数据库性能会有影响，尤其是应用数据表和主键冲突表在一个库的时候，表现更加明显。还有就是在 MySQL 数据库中采用主键冲突防重，在大并发情况下有可能会造成锁表现象，比较好的办法是在程序中生产主键进行防重。
>
> - 使用版本号策略 
>
>   这个策略源于 MySQL 的  MVCC 机制，使用这个策略其实本身没有什么问题，唯一的问题就是对数据表侵入较大，我们要为每个表设计一个版本号字段，然后写一条判断 SQL 每次进行判断。



第三趴，编码

## 三、基于 Redis 的分布式锁

> 其实 Redis 官网已经给出了实现：https://redis.io/topics/distlock，说各种书籍和博客用了各种手段去用 Redis 实现分布式锁，建议用 Redlock 实现，这样更规范、更安全。我们循序渐进来看

我们默认指定大家用的是 Redis 2.6.12 及更高的版本，就不再去讲 `setnx`、`expire` 这种了，直接 `set` 命令加锁

```sh
set key value[expiration EX seconds|PX milliseconds] [NX|XX]
```

eg:

```bash
SET resource_name my_random_value NX PX 30000
```

> *SET* 命令的行为可以通过一系列参数来修改
>
> - `EX second` ：设置键的过期时间为 `second` 秒。 `SET key value EX second` 效果等同于 `SETEX key second value` 。
> - `PX millisecond` ：设置键的过期时间为 `millisecond` 毫秒。 `SET key value PX millisecond` 效果等同于 `PSETEX key millisecond value` 。
> - `NX` ：只在键不存在时，才对键进行设置操作。 `SET key value NX` 效果等同于 `SETNX key value` 。
> - `XX` ：只在键已经存在时，才对键进行设置操作。

这条指令的意思：当 key——resource_name 不存在时创建这样的 key，设值为 my_random_value，并设置过期时间 30000 毫秒。

别看这干了两件事，因为 Redis 是单线程的，这一条指令不会被打断，所以是原子性的操作。



Redis 实现分布式锁的主要步骤：

1. 指定一个 key 作为锁标记，存入 Redis 中，指定一个 **唯一的标识** 作为 value。
2. 当 key 不存在时才能设置值，确保同一时间只有一个客户端进程获得锁，满足 **互斥性** 特性。
3. 设置一个过期时间，防止因系统异常导致没能删除这个 key，满足 **防死锁** 特性。
4. 当处理完业务之后需要清除这个 key 来释放锁，清除 key 时需要校验 value 值，需要满足 **解铃还须系铃人** 。

设置一个随机值的意思是在解锁时候判断 key 的值和我们存储的随机数是不是一样，一样的话，才是自己的锁，直接 `del` 解锁就行。

当然这个两个操作要保证原子性，所以 Redis 给出了一段 lua 脚本（Redis 服务器会单线程原子性执行 lua 脚本，保证 lua 脚本在处理的过程中不会被任意其它请求打断。）：

```lua
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

 

### 问题：

我们先抛出两个问题思考：

1. 获取锁时，过期时间要设置多少合适呢？

   预估一个合适的时间，其实没那么容易，比如操作资源的时间最慢可能要 10 s，而我们只设置了 5 s  就过期，那就存在锁提前过期的风险。这个问题先记下，我们一会看下 Javaer 要怎么在代码中用 Redis 锁。

2. 容错性如何保证呢？

   Redis 挂了怎么办，你可能会说上主从、上集群，但也会出现这样的极端情况，当我们上锁后，主节点就挂了，这个时候还没来的急同步到从节点，主从切换后锁还是丢了

带着这两个问题，我们接着看



### Redisson 实现代码

Redisson 是 Redis 官方的分布式锁组件。GitHub 地址：[https://github.com/redisson/redisson](https://zhuanlan.zhihu.com/write)

> Redisson 是一个在 Redis 的基础上实现的 Java 驻内存数据网格（In-Memory Data Grid）。它不仅提供了一系列的分布式的 Java 常用对象，还实现了可重入锁（Reentrant Lock）、公平锁（Fair Lock、联锁（MultiLock）、 红锁（RedLock）、 读写锁（ReadWriteLock）等，还提供了许多分布式服务。Redisson 提供了使用 Redis 的最简单和最便捷的方法。Redisson 的宗旨是促进使用者对 Redis 的关注分离（Separation of Concern），从而让使用者能够将精力更集中地放在处理业务逻辑上。

redisson 现在已经很强大了，github 的 wiki 也很详细，分布式锁的介绍直接戳 [Distributed locks and synchronizers](https://github.com/redisson/redisson/wiki/8.-Distributed-locks-and-synchronizers)

Redisson 支持单点模式、主从模式、哨兵模式、集群模式，只是配置的不同，我们以单点模式来看下怎么使用，代码很简单，都已经为我们封装好了，直接拿来用就好，详细的 demo，我放在了 github: starfish-learn-redisson 上，这里就不一步步来了

```java
RLock lock = redisson.getLock("myLock");
```

RLock 提供了各种锁方法，我们来解读下这个接口方法，

> 注：代码为 3.16.2 版本，可以看到继承自 JDK 的 Lock 接口，和 Reddsion 的异步锁接口 RLockAsync(这个我们先不研究)

#### RLock

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/redis/RLock.png)

```java
public interface RLock extends Lock, RLockAsync {

    /**
     * 获取锁的名字
     */
    String getName();
    
    /**
     * 这个叫终端锁操作，表示该锁可以被中断 假如A和B同时调这个方法，A获取锁，B为获取锁，那么B线程可以通过
     * Thread.currentThread().interrupt(); 方法真正中断该线程
     */
    void lockInterruptibly(long leaseTime, TimeUnit unit) throws InterruptedException;

    /**
     * 这个应该是最常用的，尝试获取锁
     * waitTimeout 尝试获取锁的最大等待时间，超过这个值，则认为获取锁失败
     * leaseTime   锁的持有时间,超过这个时间锁会自动失效（值应设置为大于业务处理的时间，确保在锁有效期内业务能处理完）
     */
    boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException;

    /**
     * 锁的有效期设置为 leaseTime，过期后自动失效
     * 如果 leaseTime 设置为 -1, 表示不主动过期
     */
    void lock(long leaseTime, TimeUnit unit);

    /**
     * Unlocks the lock independently of its state
     */
    boolean forceUnlock();

    /**
     * 检查是否被另一个线程锁住
     */
    boolean isLocked();

    /**
     * 检查当前线线程是否持有该锁
     */
    boolean isHeldByCurrentThread();
  
     /**
     *  这个就明了了，检查指定线程是否持有锁
     */
    boolean isHeldByThread(long threadId);

    /**
     * 返回当前线程持有锁的次数
     */
    int getHoldCount();

    /**
     * 返回锁的剩余时间
     * @return time in milliseconds
     *          -2 if the lock does not exist.
     *          -1 if the lock exists but has no associated expire.
     */
    long remainTimeToLive();
    
}
```

#### Demo

```java
Config config = new Config();
config.useSingleServer().setAddress("redis://127.0.0.1:6379").setPassword("").setDatabase(1);
RedissonClient redissonClient = Redisson.create(config);
RLock disLock = redissonClient.getLock("mylock");
boolean isLock;
try {
  /**
   * 尝试获取锁的最大等待时间是 100 秒，超过这个值还没获取到，就认为获取失败
   * 锁的持有时间是 10 秒
   */
  isLock = disLock.tryLock(100, 10, TimeUnit.MILLISECONDS);
  if (isLock) {
    //做自己的业务
    Thread.sleep(10000);
  }
} catch (Exception e) {
  	e.printStackTrace();
} finally {
  	disLock.unlock();
}
```

就是这么简单，Redisson 已经做好了封装，使用起来 so easy，如果使用主从、哨兵、集群这种也只是配置不同。

#### 原理

> 看源码小 tips，最好是 fork 到自己的仓库，然后拉到本地，边看边注释，然后提交到自己的仓库，也方便之后再看，不想这么麻烦的，也可以直接看我的 Jstarfish/redisson

先看下 RLock 的类关系

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/redis/RLock-UML.png)

跟着源码，可以发现 RedissonLock 是 RLock 的直接实现，也是我们加锁、解锁操作的核心类

##### 加锁

主要的加锁方法就下边这两个，区别也很简单，一个有等待时间，一个没有，所以我们挑个复杂的看（源码包含了另一个的绝大部分）

```java
boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException;
void lock(long leaseTime, TimeUnit unit);
```

**RedissonLock.tryLock**

```java
@Override
public boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException {
    // 获取等锁的最长时间
    long time = unit.toMillis(waitTime);
    long current = System.currentTimeMillis();
    //取得当前线程id（判断是否可重入锁的关键）
    long threadId = Thread.currentThread().getId();
    // 【核心点1】尝试获取锁，若返回值为null，则表示已获取到锁，返回的ttl就是key的剩余存活时间
    Long ttl = tryAcquire(waitTime, leaseTime, unit, threadId);
    if (ttl == null) {
        return true;
    }
    // 还可以容忍的等待时长 = 获取锁能容忍的最大等待时长 - 执行完上述操作流程的时间
    time -= System.currentTimeMillis() - current;
    if (time <= 0) {
        //等不到了，直接返回失败
        acquireFailed(waitTime, unit, threadId);
        return false;
    }

    current = System.currentTimeMillis();
    /**
     * 【核心点2】
     * 订阅解锁消息 redisson_lock__channel:{$KEY}，并通过await方法阻塞等待锁释放，解决了无效的锁申请浪费资源的问题：
     * 基于信息量，当锁被其它资源占用时，当前线程通过 Redis 的 channel 订阅锁的释放事件，一旦锁释放会发消息通知待等待的线程进行竞争
     * 当 this.await返回false，说明等待时间已经超出获取锁最大等待时间，取消订阅并返回获取锁失败
     * 当 this.await返回true，进入循环尝试获取锁
     */
    RFuture<RedissonLockEntry> subscribeFuture = subscribe(threadId);
    //await 方法内部是用CountDownLatch来实现阻塞，获取subscribe异步执行的结果（应用了Netty 的 Future）
    if (!subscribeFuture.await(time, TimeUnit.MILLISECONDS)) {
        if (!subscribeFuture.cancel(false)) {
            subscribeFuture.onComplete((res, e) -> {
                if (e == null) {
                    unsubscribe(subscribeFuture, threadId);
                }
            });
        }
        acquireFailed(waitTime, unit, threadId);
        return false;
    }

    // ttl 不为空，表示已经有这样的key了，只能阻塞等待
    try {
        time -= System.currentTimeMillis() - current;
        if (time <= 0) {
            acquireFailed(waitTime, unit, threadId);
            return false;
        }

        // 来个死循环，继续尝试着获取锁
        while (true) {
            long currentTime = System.currentTimeMillis();
            ttl = tryAcquire(waitTime, leaseTime, unit, threadId);
            if (ttl == null) {
                return true;
            }

            time -= System.currentTimeMillis() - currentTime;
            if (time <= 0) {
                acquireFailed(waitTime, unit, threadId);
                return false;
            }

            currentTime = System.currentTimeMillis();

           /**
            * 【核心点3】根据锁TTL，调整阻塞等待时长；
            * 1、latch其实是个信号量Semaphore，调用其tryAcquire方法会让当前线程阻塞一段时间，避免在while循环中频繁请求获锁；
            *  当其他线程释放了占用的锁，会广播解锁消息，监听器接收解锁消息，并释放信号量，最终会唤醒阻塞在这里的线程
            * 2、该Semaphore的release方法，会在订阅解锁消息的监听器消息处理方法org.redisson.pubsub.LockPubSub#onMessage调用；
            */
            //调用信号量的方法来阻塞线程，时长为锁等待时间和租期时间中较小的那个
            if (ttl >= 0 && ttl < time) {
                subscribeFuture.getNow().getLatch().tryAcquire(ttl, TimeUnit.MILLISECONDS);
            } else {
                subscribeFuture.getNow().getLatch().tryAcquire(time, TimeUnit.MILLISECONDS);
            }

            time -= System.currentTimeMillis() - currentTime;
            if (time <= 0) {
                acquireFailed(waitTime, unit, threadId);
                return false;
            }
        }
    } finally {
        // 获取到锁或者抛出中断异常，退订redisson_lock__channel:{$KEY}，不再关注解锁事件
        unsubscribe(subscribeFuture, threadId);
    }
}
```

接着看注释中提到的 3 个核心点

**核心点1-尝试加锁：RedissonLock.tryAcquireAsync**

```java
private <T> RFuture<Long> tryAcquireAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
    RFuture<Long> ttlRemainingFuture;
    // leaseTime != -1 说明没过期
    if (leaseTime != -1) {
        // 实质是异步执行加锁Lua脚本
        ttlRemainingFuture = tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_LONG);
    } else {
        // 否则，已经过期了,传参变为新的时间（续期后）
        ttlRemainingFuture = tryLockInnerAsync(waitTime, internalLockLeaseTime,
                TimeUnit.MILLISECONDS, threadId, RedisCommands.EVAL_LONG);
    }
    ttlRemainingFuture.onComplete((ttlRemaining, e) -> {
        if (e != null) {
            return;
        }

        // lock acquired
        if (ttlRemaining == null) {
            if (leaseTime != -1) {
                internalLockLeaseTime = unit.toMillis(leaseTime);
            } else {
                // 续期
                scheduleExpirationRenewal(threadId);
            }
        }
    });
    return ttlRemainingFuture;
}
```

**异步执行加锁 Lua 脚本：RedissonLock.tryLockInnerAsync**

```java
<T> RFuture<T> tryLockInnerAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId, RedisStrictCommand<T> command) {
    return evalWriteAsync(getRawName(), LongCodec.INSTANCE, command,
            // 1.如果缓存中的key不存在，则执行 hincrby 命令(hincrby key UUID+threadId 1), 设值重入次数1
            // 然后通过 pexpire 命令设置锁的过期时间(即锁的租约时间)
            // 返回空值 nil ，表示获取锁成功
            "if (redis.call('exists', KEYS[1]) == 0) then " +
                    "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +
                    "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                    "return nil; " +
                    "end; " +
                    // 如果key已经存在，并且value也匹配，表示是当前线程持有的锁，则执行 hincrby 命令，重入次数加1，并且设置失效时间
                    "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                    "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +
                    "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                    "return nil; " +
                    "end; " +
                    //如果key已经存在，但是value不匹配，说明锁已经被其他线程持有，通过 pttl 命令获取锁的剩余存活时间并返回，至此获取锁失败
                    "return redis.call('pttl', KEYS[1]);",
            Collections.singletonList(getRawName()), unit.toMillis(leaseTime), getLockName(threadId));
}
```

> - KEYS[1] 就是 Collections.singletonList(getName())，表示分布式锁的key；
> - ARGV[1] 就是internalLockLeaseTime，即锁的租约时间（持有锁的有效时间），默认30s；
> - ARGV[2] 就是getLockName(threadId)，是获取锁时set的唯一值 value，即UUID+threadId

**看门狗续期：RedissonBaseLock.scheduleExpirationRenewal**

```java
// 基于线程ID定时调度和续期
protected void scheduleExpirationRenewal(long threadId) {
    // 新建一个ExpirationEntry记录线程重入计数
    ExpirationEntry entry = new ExpirationEntry();
    ExpirationEntry oldEntry = EXPIRATION_RENEWAL_MAP.putIfAbsent(getEntryName(), entry);
    if (oldEntry != null) {
        // 当前进行的当前线程重入加锁
        oldEntry.addThreadId(threadId);
    } else {
        // 当前进行的当前线程首次加锁
        entry.addThreadId(threadId);
        // 首次新建ExpirationEntry需要触发续期方法，记录续期的任务句柄
        renewExpiration();
    }
}

// 处理续期
private void renewExpiration() {
  // 根据entryName获取ExpirationEntry实例，如果为空，说明在cancelExpirationRenewal()方法已经被移除，一般是解锁的时候触发
  ExpirationEntry ee = EXPIRATION_RENEWAL_MAP.get(getEntryName());
  if (ee == null) {
    return;
  }

  // 新建一个定时任务，这个就是看门狗的实现，io.netty.util.Timeout是Netty结合时间轮使用的定时任务实例
  Timeout task = commandExecutor.getConnectionManager().newTimeout(new TimerTask() {
    @Override
    public void run(Timeout timeout) throws Exception {
      // 这里是重复外面的那个逻辑，
      ExpirationEntry ent = EXPIRATION_RENEWAL_MAP.get(getEntryName());
      if (ent == null) {
        return;
      }
      // 获取ExpirationEntry中首个线程ID，如果为空说明调用过cancelExpirationRenewal()方法清空持有的线程重入计数，一般是锁已经释放的场景
      Long threadId = ent.getFirstThreadId();
      if (threadId == null) {
        return;
      }
      // 向Redis异步发送续期的命令
      RFuture<Boolean> future = renewExpirationAsync(threadId);
      future.onComplete((res, e) -> {
        // 抛出异常，续期失败，只打印日志和直接终止任务
        if (e != null) {
          log.error("Can't update lock " + getRawName() + " expiration", e);
          EXPIRATION_RENEWAL_MAP.remove(getEntryName());
          return;
        }
        // 返回true证明续期成功，则递归调用续期方法（重新调度自己），续期失败说明对应的锁已经不存在，直接返回，不再递归
        if (res) {
          // reschedule itself
          renewExpiration();
        } else {
          cancelExpirationRenewal(null);
        }
      });
    }// 这里的执行频率为leaseTime转换为ms单位下的三分之一，由于leaseTime初始值为-1的情况下才会进入续期逻辑，那么这里的执行频率为lockWatchdogTimeout的三分之一
  }, internalLockLeaseTime / 3, TimeUnit.MILLISECONDS);
  // ExpirationEntry实例持有调度任务实例
  ee.setTimeout(task);
}
```



**核心点2-订阅解锁消息：RedissonLock.subscribe**

```java
protected final LockPubSub pubSub;

public RedissonLock(CommandAsyncExecutor commandExecutor, String name) {
  super(commandExecutor, name);
  this.commandExecutor = commandExecutor;
  this.internalLockLeaseTime = commandExecutor.getConnectionManager().getCfg().getLockWatchdogTimeout();
  //在构造器中初始化pubSub,跟着这几个get方法会发现他们都是在构造器中初始化的，在PublishSubscribeService中会有
  // private final AsyncSemaphore[] locks = new AsyncSemaphore[50]; 这样一段代码，初始化了一组信号量
  this.pubSub = commandExecutor.getConnectionManager().getSubscribeService().getLockPubSub();
}

protected RFuture<RedissonLockEntry> subscribe(long threadId) {
  return pubSub.subscribe(getEntryName(), getChannelName());
}

// 在LockPubSub中注册一个entryName -> RedissonLockEntry的哈希映射，RedissonLockEntry实例中存放着RPromise<RedissonLockEntry>结果，一个信号量形式的锁和订阅方法重入计数器
public RFuture<E> subscribe(String entryName, String channelName) {
  AsyncSemaphore semaphore = service.getSemaphore(new ChannelName(channelName));
  RPromise<E> newPromise = new RedissonPromise<>();
  semaphore.acquire(() -> {
    if (!newPromise.setUncancellable()) {
      semaphore.release();
      return;
    }

    E entry = entries.get(entryName);
    if (entry != null) {
      entry.acquire();
      semaphore.release();
      entry.getPromise().onComplete(new TransferListener<E>(newPromise));
      return;
    }

    E value = createEntry(newPromise);
    value.acquire();

    E oldValue = entries.putIfAbsent(entryName, value);
    if (oldValue != null) {
      oldValue.acquire();
      semaphore.release();
      oldValue.getPromise().onComplete(new TransferListener<E>(newPromise));
      return;
    }

    RedisPubSubListener<Object> listener = createListener(channelName, value);
    service.subscribe(LongCodec.INSTANCE, channelName, semaphore, listener);
  });

  return newPromise;
}
```

核心点 3 比较简单，就不说了



##### 解锁

**RedissonLock.unlock()**

```java
@Override
public void unlock() {
  try {
    // 获取当前调用解锁操作的线程ID
    get(unlockAsync(Thread.currentThread().getId()));
  } catch (RedisException e) {
    // IllegalMonitorStateException一般是A线程加锁，B线程解锁，内部判断线程状态不一致抛出的
    if (e.getCause() instanceof IllegalMonitorStateException) {
      throw (IllegalMonitorStateException) e.getCause();
    } else {
      throw e;
    }
  }
}
```

**RedissonBaseLock.unlockAsync**

```java
@Override
public RFuture<Void> unlockAsync(long threadId) {
  // 构建一个结果RedissonPromise
  RPromise<Void> result = new RedissonPromise<>();
  // 返回的RFuture如果持有的结果为true，说明解锁成功，返回NULL说明线程ID异常，加锁和解锁的客户端线程不是同一个线程
  RFuture<Boolean> future = unlockInnerAsync(threadId);

  future.onComplete((opStatus, e) -> {
    // 取消看门狗的续期任务
    cancelExpirationRenewal(threadId);

    if (e != null) {
      result.tryFailure(e);
      return;
    }

    if (opStatus == null) {
      IllegalMonitorStateException cause = new IllegalMonitorStateException("attempt to unlock lock, not locked by current thread by node id: "
                                                                            + id + " thread-id: " + threadId);
      result.tryFailure(cause);
      return;
    }

    result.trySuccess(null);
  });

  return result;
}
```

**RedissonLock.unlockInnerAsync**

```java
// 真正的内部解锁的方法，执行解锁的Lua脚本
protected RFuture<Boolean> unlockInnerAsync(long threadId) {
  return evalWriteAsync(getRawName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
                        //如果分布式锁存在，但是value不匹配，表示锁已经被其他线程占用，无权释放锁，那么直接返回空值（解铃还须系铃人）
                        "if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then " +
                        "return nil;" +
                        "end; " +
                        //如果value匹配，则就是当前线程占有分布式锁，那么将重入次数减1
                        "local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1); " +
                        //重入次数减1后的值如果大于0，表示分布式锁有重入过，那么只能更新失效时间，还不能删除
                        "if (counter > 0) then " +
                        "redis.call('pexpire', KEYS[1], ARGV[2]); " +
                        "return 0; " +
                        "else " +
                        //重入次数减1后的值如果为0，这时就可以删除这个KEY，并发布解锁消息，返回1
                        "redis.call('del', KEYS[1]); " +
                        "redis.call('publish', KEYS[2], ARGV[1]); " +
                        "return 1; " +
                        "end; " +
                        "return nil;",
                        //这5个参数分别对应KEYS[1]，KEYS[2]，ARGV[1]，ARGV[2]和ARGV[3]
                        Arrays.asList(getRawName(), getChannelName()), LockPubSub.UNLOCK_MESSAGE, internalLockLeaseTime, getLockName(threadId));
}
```



我只列出了一小部分代码，更多的内容还是得自己动手

从源码中，我们可以看到 Redisson 帮我们解决了抛出的第一个问题：失效时间设置多长时间为好？

Redisson 提供了看门狗，每获得一个锁时，只设置一个很短的超时时间，同时起一个线程在每次快要到超时时间时去刷新锁的超时时间。在释放锁的同时结束这个线程。

但是没有解决节点挂掉，丢失锁的问题，接着来~



![img](https://i01piccdn.sogoucdn.com/5c535b46a06ec4d8)

## 四、RedLock

我们上边介绍的分布式锁，在某些极端情况下仍然是有缺陷的

1. 客户端长时间内阻塞导致锁失效

   客户端 1 得到了锁，因为网络问题或者 GC 等原因导致长时间阻塞，然后业务程序还没执行完锁就过期了，这时候客户端 2 也能正常拿到锁，可能会导致线程安全的问题。

2. Redis 服务器时钟漂移

   如果 Redis 服务器的机器时间发生了向前跳跃，就会导致这个 key 过早超时失效，比如说客户端 1 拿到锁后，key 还没有到过期时间，但是 Redis 服务器的时间比客户端快了 2 分钟，导致 key 提前就失效了，这时候，如果客户端 1 还没有释放锁的话，就可能导致多个客户端同时持有同一把锁的问题。

3. 单点实例安全问题

   如果 Redis 是单机模式的，如果挂了的话，那所有的客户端都获取不到锁了，假设你是主从模式，但 Redis 的主从同步是异步进行的，如果 Redis 主宕机了，这个时候从机并没有同步到这一把锁，那么机器 B 再次申请的时候就会再次申请到这把锁，这也是问题

为了解决这些个问题 Redis 作者提出了 RedLock 红锁的算法，在 Redission 中也对 RedLock 进行了实现。

> Redis 官网对 redLock 算法的介绍大致如下：[The Redlock algorithm](https://redis.io/topics/distlock)
>
> 在分布式版本的算法里我们假设我们有 **N 个 Redis master** 节点，这些节点都是完全独立的，我们不用任何复制或者其他隐含的分布式协调机制。之前我们已经描述了在 Redis 单实例下怎么安全地获取和释放锁。我们确保将在每（N) 个实例上使用此方法获取和释放锁。在我们的例子里面我们设置 N=5，这是一个比较合理的设置，所以我们需要在 5 台机器或者虚拟机上面运行这些实例，这样保证他们不会同时都宕掉。为了取到锁，客户端应该执行以下操作:
>
> 1. 获取当前 Unix 时间，以毫秒为单位。
> 2. 依次尝试从 5 个实例，使用相同的 key 和具有唯一性的 value（例如UUID）获取锁。当向 Redis 请求获取锁时，客户端应该设置一个尝试从某个 Reids 实例获取锁的最大等待时间（超过这个时间，则立马询问下一个实例），这个超时时间应该小于锁的失效时间。例如你的锁自动失效时间为 10 秒，则超时时间应该在 5-50 毫秒之间。这样可以避免服务器端 Redis 已经挂掉的情况下，客户端还在死死地等待响应结果。如果服务器端没有在规定时间内响应，客户端应该尽快尝试去另外一个 Redis 实例请求获取锁。
> 3. 客户端使用当前时间减去开始获取锁时间（步骤1记录的时间）就得到获取锁消耗的时间。当且仅当从大多数（N/2+1，这里是3个节点）的 Redis 节点都取到锁，并且使用的总耗时小于锁失效时间时，锁才算获取成功。
> 4. 如果取到了锁，key 的真正有效时间 = 有效时间（获取锁时设置的 key 的自动超时时间） - 获取锁的总耗时（询问各个 Redis 实例的总耗时之和）（步骤 3 计算的结果）。
> 5. 如果因为某些原因，最终获取锁失败（即没有在至少 “N/2+1 ”个 Redis 实例取到锁或者“获取锁的总耗时”超过了“有效时间”），客户端应该在所有的 Redis 实例上进行解锁（即便某些 Redis 实例根本就没有加锁成功，这样可以防止某些节点获取到锁但是客户端没有得到响应而导致接下来的一段时间不能被重新获取锁）。

总结下就是：

1. 客户端在多个 Redis 实例上申请加锁，必须保证大多数节点加锁成功

   解决容错性问题，部分实例异常，剩下的还能加锁成功

2. 大多数节点加锁的总耗时，要小于锁设置的过期时间

   多实例操作，可能存在网络延迟、丢包、超时等问题，所以就算是大多数节点加锁成功，如果加锁的累积耗时超过了锁的过期时间，那有些节点上的锁可能也已经失效了，还是没有意义的

3. 释放锁，要向全部节点发起释放锁请求

   如果部分节点加锁成功，但最后由于异常导致大部分节点没加锁成功，就要释放掉所有的，各节点要保持一致

> 关于 RedLock，两位分布式大佬，Antirez 和 Martin 还进行过一场争论，感兴趣的也可以看看

```java
Config config1 = new Config();
config1.useSingleServer().setAddress("127.0.0.1:6379");
RedissonClient redissonClient1 = Redisson.create(config1);

Config config2 = new Config();
config2.useSingleServer().setAddress("127.0.0.1:5378");
RedissonClient redissonClient2 = Redisson.create(config2);

Config config3 = new Config();
config3.useSingleServer().setAddress("127.0.0.1:5379");
RedissonClient redissonClient3 = Redisson.create(config3);

/**
 * 获取多个 RLock 对象
 */
RLock lock1 = redissonClient1.getLock(lockKey);
RLock lock2 = redissonClient2.getLock(lockKey);
RLock lock3 = redissonClient3.getLock(lockKey);

/**
 * 根据多个 RLock 对象构建 RedissonRedLock （最核心的差别就在这里）
 */
RedissonRedLock redLock = new RedissonRedLock(lock1, lock2, lock3);

try {
    /**
     * 4.尝试获取锁
     * waitTimeout 尝试获取锁的最大等待时间，超过这个值，则认为获取锁失败
     * leaseTime   锁的持有时间,超过这个时间锁会自动失效（值应设置为大于业务处理的时间，确保在锁有效期内业务能处理完）
     */
    boolean res = redLock.tryLock(100, 10, TimeUnit.SECONDS);
    if (res) {
        //成功获得锁，在这里处理业务
    }
} catch (Exception e) {
    throw new RuntimeException("aquire lock fail");
}finally{
    //无论如何, 最后都要解锁
    redLock.unlock();
}
```

最核心的变化就是需要构建多个 RLock ，然后根据多个 RLock 构建成一个 RedissonRedLock，因为 redLock 算法是建立在多个互相独立的 Redis 环境之上的（为了区分可以叫为 Redission node），Redission node 节点既可以是单机模式(single)，也可以是主从模式(master/salve)，哨兵模式(sentinal)，或者集群模式(cluster)。这就意味着，不能跟以往这样只搭建 1个 cluster、或 1个 sentinel 集群，或是1套主从架构就了事了，需要为 RedissonRedLock 额外搭建多几套独立的 Redission 节点。

 **RedissonMultiLock.tryLock**

```java
@Override
public boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException {
  //        try {
  //            return tryLockAsync(waitTime, leaseTime, unit).get();
  //        } catch (ExecutionException e) {
  //            throw new IllegalStateException(e);
  //        }
  long newLeaseTime = -1;
  if (leaseTime != -1) {
    if (waitTime == -1) {
      newLeaseTime = unit.toMillis(leaseTime);
    } else {
      newLeaseTime = unit.toMillis(waitTime)*2;
    }
  }

  long time = System.currentTimeMillis();
  long remainTime = -1;
  if (waitTime != -1) {
    remainTime = unit.toMillis(waitTime);
  }
  long lockWaitTime = calcLockWaitTime(remainTime);

  //允许加锁失败节点个数限制（N-(N/2+1)）
  int failedLocksLimit = failedLocksLimit();
  List<RLock> acquiredLocks = new ArrayList<>(locks.size());
  // 遍历所有节点通过EVAL命令执行lua加锁
  for (ListIterator<RLock> iterator = locks.listIterator(); iterator.hasNext();) {
    RLock lock = iterator.next();
    boolean lockAcquired;
    try {
      // 对节点尝试加锁
      if (waitTime == -1 && leaseTime == -1) {
        lockAcquired = lock.tryLock();
      } else {
        long awaitTime = Math.min(lockWaitTime, remainTime);
        lockAcquired = lock.tryLock(awaitTime, newLeaseTime, TimeUnit.MILLISECONDS);
      }
    } catch (RedisResponseTimeoutException e) {
      // 如果抛出这类异常，为了防止加锁成功，但是响应失败，需要解锁所有节点
      unlockInner(Arrays.asList(lock));
      lockAcquired = false;
    } catch (Exception e) {
      lockAcquired = false;
    }

    if (lockAcquired) {
      acquiredLocks.add(lock);
    } else {
      /*
       *  计算已经申请锁失败的节点是否已经到达 允许加锁失败节点个数限制 （N-(N/2+1)）
       * 如果已经到达， 就认定最终申请锁失败，则没有必要继续从后面的节点申请了
       * 因为 Redlock 算法要求至少N/2+1 个节点都加锁成功，才算最终的锁申请成功
       */
      if (locks.size() - acquiredLocks.size() == failedLocksLimit()) {
        break;
      }

      if (failedLocksLimit == 0) {
        unlockInner(acquiredLocks);
        if (waitTime == -1) {
          return false;
        }
        failedLocksLimit = failedLocksLimit();
        acquiredLocks.clear();
        // reset iterator
        while (iterator.hasPrevious()) {
          iterator.previous();
        }
      } else {
        failedLocksLimit--;
      }
    }
    //计算 目前从各个节点获取锁已经消耗的总时间，如果已经等于最大等待时间，则认定最终申请锁失败，返回false
    if (remainTime != -1) {
      remainTime -= System.currentTimeMillis() - time;
      time = System.currentTimeMillis();
      if (remainTime <= 0) {
        unlockInner(acquiredLocks);
        return false;
      }
    }
  }

  if (leaseTime != -1) {
    acquiredLocks.stream()
      .map(l -> (RedissonLock) l)
      .map(l -> l.expireAsync(unit.toMillis(leaseTime), TimeUnit.MILLISECONDS))
      .forEach(f -> f.syncUninterruptibly());
  }

  return true;
}
```



##### 参考与感谢

- [《Redis —— Distributed locks with Redis》](https://redis.io/topics/distlock)
- [《Redisson —— Distributed locks and synchronizers》](https://github.com/redisson/redisson/wiki/8.-Distributed-locks-and-synchronizers)
- [慢谈 Redis 实现分布式锁 以及 Redisson 源码解析](https://crazyfzw.github.io/2019/08/24/distributed-locks-with-redis/)
- [理解Redisson中分布式锁的实现](https://www.cnblogs.com/throwable/p/14264804.html)





