# Redis 分布式锁

## 一、什么是分布式锁？	 

要介绍分布式锁，首先要提到与分布式锁相对应的是线程锁、进程锁。

**线程锁**：主要用来给方法、代码块加锁。当某个方法或代码使用锁，在同一时刻仅有一个线程执行该方法或该代码段。线程锁只在同一JVM中有效果，因为线程锁的实现在根本上是依靠线程之间共享内存实现的，比如synchronized是共享对象头，显示锁Lock是共享某个变量（state）。

**进程锁**：为了控制同一操作系统中多个进程访问某个共享资源，因为进程具有独立性，各个进程无法访问其他进程的资源， 可以使用本地系统的信号量控制 。

**分布式锁**：分布式锁是控制分布式系统或不同系统之间共同访问共享资源的一种锁实现，如果不同的系统或同一个系统的不同主机之间共享了某个资源时，往往需要互斥来防止彼此干扰来保证一致性。



分布式锁一般有三种实现方式：**1. 数据库乐观锁；2. 基于Redis的分布式锁；3. 基于ZooKeeper的分布式锁。**



TODO:乐观锁、悲观锁



### 可靠性

首先，为了确保分布式锁可用，我们至少要确保锁的实现同时满足以下四个条件：

1. 互斥性。在任意时刻，只有一个客户端能持有锁。
2. 不会发生死锁。即使有一个客户端在持有锁的期间崩溃而没有主动解锁，也能保证后续其他客户端能加锁。
3. 具有容错性。只要大部分的Redis节点正常运行，客户端就可以加锁和解锁。
4. 解铃还须系铃人。加锁和解锁必须是同一个客户端，客户端自己不能把别人加的锁给解了。



## 基于 Redis 做分布式锁

setnx(key, value)：“set if not exits”，若该key-value不存在，则成功加入缓存并且返回1，存在返回0。

get(key)：获得key对应的value值，若不存在则返回nil。

getset(key, value)：先获取key对应的value值，若不存在则返回nil，然后将旧的value更新为新的value。

expire(key, seconds)：设置key-value的有效期为seconds秒。



Redis 2.8 版本中作者加入了 set 指令的扩展参数，使得 setnx 和 expire 指令可以一起执行，彻底解决了分布式锁的乱象。

\> set lock:codehole true ex 5 nx OK ... **do** something critical ... > del lock:codehole 

上面这个指令就是 setnx 和 expire 组合在一起的原子指令，它就是分布式锁的奥义所在。

```
set key value[expiration EX seconds|PX milliseconds] [NX|XX]
```



### 基于 redisson 做分布式锁

redisson 是 redis 官方的分布式锁组件。GitHub 地址：[https://github.com/redisson/redisson](https://zhuanlan.zhihu.com/write)

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



## RedLock

我们想象一个这样的场景当机器A申请到一把锁之后，如果Redis主宕机了，这个时候从机并没有同步到这一把锁，那么机器B再次申请的时候就会再次申请到这把锁，为了解决这个问题Redis作者提出了RedLock红锁的算法,在Redission中也对RedLock进行了实现。