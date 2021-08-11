# 分布式锁

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/redis/locks-505878_1280.jpg)

> 分布式锁的文章其实早就烂大街了，但有些“菜鸟”写的太浅，或者自己估计都没搞明白，没用过，看完后我更懵逼了，有些“大牛”写的吧，又太高级，只能看懂前半部分，后边就开始讲论文了，也比较懵逼，所以还得我这个中不溜的来总结下
>
> 文章拢共分为几个部分：
>
> - 什么是分布式锁
> - 分布式锁的实现要求
> - 

## 一、什么是分布式锁	 

**分布式~~锁**，要这么念，首先得是『分布式』，然后才是『锁』

- 分布式：这里的分布式指的是分布式系统，涉及到好多技术和理论，包括CAP 理论、分布式存储、分布式事务、分布式锁...

  > 分布式系统是由一组通过网络进行通信、为了完成共同的任务而协调工作的计算机节点组成的系统。
  >
  > 分布式系统的出现是为了用廉价的、普通的机器完成单个计算机无法完成的计算、存储任务。其目的是**利用更多的机器，处理更多的数据**。

- 锁：对对，就是你想的那个，Javer 学的第一个锁应该就是 `synchronized` 

  > Java 初级面试问题，来拼写下 **赛克瑞纳挨日的**

  锁

  **线程锁**：`synchronized` 是用在方法或代码块中的，我们把它叫『线程锁』，线程锁的实现其实是靠线程之间共享内存实现的，说白了就是内存中的一个整型数，有空闲、上锁这类状态，比如 synchronized 是在对象头中的 Mark Word 有个锁状态标志，Lock 的实现类大部分都有个叫 `volatile int state` 的共享变量来做状态标志。

  **进程锁**：比如说，我们的同一个 linux 服务器，部署了好几个 Java 项目，有可能同时访问或操作服务器上的相同数据，这就需要进程锁，一般可以用『文件锁』来达到进程互斥。

  **分布式锁**：随着用户越来越多，我们上了好多服务器，原本有个定时给客户发邮件的任务，不加以控制的话，到点后每台机器跑一次任务，客户就会收到 N 条邮件，这就需要通过分布式锁来互斥了。

  > 书面解释：分布式锁是控制分布式系统或不同系统之间共同访问共享资源的一种锁实现，如果不同的系统或同一个系统的不同主机之间共享了某个资源时，往往需要互斥来防止彼此干扰来保证一致性。



知道了什么是分布式锁，接下来就到了技术选型环节



## 二、分布式锁要怎么搞

要实现一个分布式锁，我们一般选择集群机器都可以操作的外部系统，然后各个机器都去这个外部系统申请锁。

这个外部系统一般需要满足如下要求才能胜任：

1. 互斥：在任意时刻，只能有一个客户端能持有锁。
2. 防止死锁：即使有一个客户端在持有锁的期间崩溃而没有主动解锁，也能保证后续其他客户端能加锁。所以锁一般要有一个过期时间。
4. 解铃还须系铃人：加锁和解锁必须是同一个客户端，一把锁只能有一把钥匙，客户端自己的锁不能被别人给解开，当然也不能去开别人的锁。
4. 容错：外部系统不能太“脆弱”，要保证外部系统的正常运行，客户端才可以加锁和解锁。



这么类比恰当不：

好多商贩要租用某个仓库，同一时刻，只能给一个商贩租用，且只能有一把钥匙，还得有固定的“租期”，到期后要回收的，当然最重要的是仓库门不能坏了，要不锁都锁不住。



直接上结论：

分布式锁一般有三种实现方式：**1. 数据库乐观锁；2. 基于Redis的分布式锁；3. 基于ZooKeeper的分布式锁。**

但为了追求更好的性能，我们通常会选择使用 Redis 或 Zookeeper 来做。



第三趴，编码

## 三、基于 Redis 的分布式锁

> 其实 Redis 官网已经给出了实现：https://redis.io/topics/distlock，说各种书籍和博客用了各种手段去用 Redis 实现分布式锁，建议用 Redlock 实现，这样更规范、更安全。我们循序渐进来看

我们默认指定大家用的是 Redis 2.6.12 及更高的版本，就不再去讲 `setnx`、`expire` 这种了，直接 `set` 命令加锁

```
set key value[expiration EX seconds|PX milliseconds] [NX|XX]
```

eg:

```bash
SET resource_name my_random_value NX PX 30000
```

这条指令的意思：当 key——resource_name 不存在时创建，并设置过期时间 30000 毫秒，值为 my_random_value

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

   预估一个合适的时间，其实没那么容易，这个问题先记下，我们先看下 Javaer 要怎么在代码中用 Redis 锁。

2. 容错性如何保证呢？

   Redis 挂了怎么办，你可能会说上主从、上集群，但也会出现这样的极端情况，当我们上锁后，主节点就挂了，这个时候还没来的急同步到从节点，主从切换后锁还是丢了

这两个问题，我们接着看



### Redisson 实现代码

redisson 是 Redis 官方的分布式锁组件。GitHub 地址：[https://github.com/redisson/redisson](https://zhuanlan.zhihu.com/write)

redisson 现在已经很强大了，github 的 wiki 也很详细，分布式锁的介绍直接戳 [Distributed locks and synchronizers](https://github.com/redisson/redisson/wiki/8.-Distributed-locks-and-synchronizers)

Redisson 支持单点模式、主从模式、哨兵模式、集群模式，只是配置的不同，我们以单点模式来看下怎么使用，代码很简单，都已经为我们封装好了，直接拿来用就好，详细的demo，我放在了 github: starfish-learn-redisson 上，这里就不一步步来了

```java
RLock lock = redisson.getLock("myLock");
```

RLock 提供了各种锁方法，我们来解读下这个接口方法，

> 注：代码为 3.16.2 版本，可以看到继承自 JDK 的 Lock 接口，和 Reddsion 的异步锁接口 RLockAsync(这个我们先不研究)

#### RLock

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













上面的这个问题 ——> 失效时间设置多长时间为好？这个问题在 redisson 的做法是：每获得一个锁时，只设置一个很短的超时时间，同时起一个线程在每次快要到超时时间时去刷新锁的超时时间。在释放锁的同时结束这个线程。

```java
RedissonClient redissonClient = Redisson.create();
RLock rLock = redissonClient.getLock("resourceName");
//直接加锁
//rLock.lock();
//尝试加锁5秒，锁过期时间10秒
rLock.tryLock(5,10,TimeUnit.SECONDS);
//非阻塞异步加锁
RFuture<Boolean> rFuture = rLock.tryLockAsync(5,10,TimeUnit.SECONDS);rLock.unlock();
```



![img](https://i01piccdn.sogoucdn.com/5c535b46a06ec4d8)

## 四、RedLock

我们想象一个这样的场景当机器A申请到一把锁之后，如果Redis主宕机了，这个时候从机并没有同步到这一把锁，那么机器B再次申请的时候就会再次申请到这把锁，为了解决这个问题Redis作者提出了RedLock红锁的算法,在Redission中也对RedLock进行了实现。





## 五、Zookeeper 的分布式锁













##### 参考与感谢

- https://redis.io/topics/distlock