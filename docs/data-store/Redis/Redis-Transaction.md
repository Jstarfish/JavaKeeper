![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200824161651.jpg)

为了确保连续多个操作的原子性，一个成熟的数据库通常都会有事务支持，Redis 也不例外。但是又和关系型数据库不太一样。

每个事务的操作都有 begin、commit 和 rollback，begin 指示事务的开始，commit 指示事务的提交，rollback 指示事务的回滚。它大致的形式如下。

```java
begin();
try {
    command1();
    command2();
    ....
    commit();
} catch(Exception e) {
    rollback();
}
```

Redis 在形式上看起来也差不多，分别是 multi/exec/discard。multi 指示事务的开始，exec 指示事务的执行，discard 指示事务的丢弃。

```
> multi
OK
> incr star
QUEUED
> incr star
QUEUED
> exec
(integer) 1
(integer) 2
```

上面的指令演示了一个完整的事务过程，所有的指令在 exec 之前不执行，而是缓存在服务器的一个事务队列中，服务器一旦收到 exec 指令，才开执行整个事务队列，执行完毕后一次性返回所有指令的运行结果。



Redis 事务可以一次执行多个命令，本质是一组命令的集合。一个事务中的所有命令都会序列化，按顺序地串行化执行而不会被其它命令插入，不许加塞。

可以保证一个队列中，一次性、顺序性、排他性的执行一系列命令（Redis 事务的主要作用是串联多个命令防止别的命令插队）

官方文档是这么说的

> 事务可以一次执行多个命令， 并且带有以下两个重要的保证：
>
> - 事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
> - 事务是一个原子操作：事务中的命令要么全部被执行，要么全部都不执行

这个原子操作，和关系型 DB 的原子性不太一样，它不能完全保证原子性，后边会介绍。



### Redis 事务的几个命令

| 命令    | 描述                                                         |
| ------- | ------------------------------------------------------------ |
| MULTI   | 标记一个事务块的开始                                         |
| EXEC    | 执行所有事务块内的命令                                       |
| DISCARD | 取消事务，放弃执行事务块内的所有命令                         |
| WATCH   | 监视一个（或多个）key，如果在事务执行之前这个（或多个）key被其他命令所改动，那么事务将被打断 |
| UNWATCH | 取消 WATCH 命令对所有 keys 的监视                            |

[MULTI](http://redisdoc.com/transaction/multi.html#multi) 命令用于开启一个事务，它总是返回 OK 。

MULTI 执行之后， 客户端可以继续向服务器发送任意多条命令， 这些命令不会立即被执行， 而是被放到一个队列中， 当 [EXEC](http://redisdoc.com/transaction/exec.html#exec) 命令被调用时， 所有队列中的命令才会被执行。

另一方面， 通过调用 [DISCARD](http://redisdoc.com/transaction/discard.html#discard) ， 客户端可以清空事务队列， 并放弃执行事务。

废话不多说，直接操作起来看结果更好理解~

### 一帆风顺

**正常执行**（可以批处理，挺爽，每条操作成功的话都会各取所需，互不影响）

![redis-transaction-case1.png](https://tva1.sinaimg.cn/large/007S8ZIlly1gi13pr19z7j314g0eojwz.jpg)

**放弃事务**（discard 操作表示放弃事务，之前的操作都不算数）

![redis-transaction-case2.png](https://tva1.sinaimg.cn/large/007S8ZIlly1gi13rcxo7qj314e0c8n1z.jpg)



### 事务中的错误

上边规规矩矩的操作，看着还挺好，可是**事务是为解决数据安全操作提出的**，我们用 Redis 事务的时候，可能会遇上以下两种错误：

- 事务在执行 `EXEC` 之前，入队的命令可能会出错。比如说，命令可能会产生语法错误（参数数量错误，参数名错误等等），或者其他更严重的错误，比如内存不足（如果服务器使用 `maxmemory` 设置了最大内存限制的话）。
- 命令可能在 `EXEC` 调用之后失败。举个例子，事务中的命令可能处理了错误类型的键，比如将列表命令用在了字符串键上面，诸如此类。

Redis 针对如上两种错误采用了不同的处理策略，对于发生在 `EXEC` 执行之前的错误，服务器会对命令入队失败的情况进行记录，并在客户端调用 `EXEC` 命令时，拒绝执行并自动放弃这个事务（Redis 2.6.5 之前的做法是检查命令入队所得的返回值：如果命令入队时返回 QUEUED ，那么入队成功；否则，就是入队失败）

对于那些在 `EXEC` 命令执行之后所产生的错误， 并没有对它们进行特别处理： 即使事务中有某个/某些命令在执行时产生了错误， 事务中的其他命令仍然会继续执行。

**全体连坐**（某一条操作记录报错的话，exec 后所有操作都不会成功）

![redis-transaction-case3.png](https://tva1.sinaimg.cn/large/007S8ZIlly1gi13roq9olj31480icgtw.jpg)

**冤头债主**（示例中 k1 被设置为 String 类型，decr k1 可以放入操作队列中，因为只有在执行的时候才可以判断出语句错误，其他正确的会被正常执行）

![redis-transaction-case4.png](https://tva1.sinaimg.cn/large/007S8ZIlly1gi13s3dl4uj31480jen4s.jpg)



### 为什么 Redis 不支持回滚

如果你有使用关系式数据库的经验，那么 “Redis 在事务失败时不进行回滚，而是继续执行余下的命令”这种做法可能会让你觉得有点奇怪。

以下是官方的*自夸*：

> - Redis 命令只会因为错误的语法而失败（并且这些问题不能在入队时发现），或是命令用在了错误类型的键上面：这也就是说，从实用性的角度来说，失败的命令是由编程错误造成的，而这些错误应该在开发的过程中被发现，而不应该出现在生产环境中。
> - 因为不需要对回滚进行支持，所以 Redis 的内部可以保持简单且快速。
>
> 有种观点认为 Redis 处理事务的做法会产生 bug ， 然而需要注意的是， 在通常情况下， 回滚并不能解决编程错误带来的问题。 举个例子， 如果你本来想通过 `INCR` 命令将键的值加上 1 ， 却不小心加上了 2 ， 又或者对错误类型的键执行了 `INCR` ， 回滚是没有办法处理这些情况的。
>
> 鉴于没有任何机制能避免程序员自己造成的错误， 并且这类错误通常不会在生产环境中出现， 所以 Redis 选择了更简单、更快速的无回滚方式来处理事务。

![img](https://i04piccdn.sogoucdn.com/d2ab1c04cc178f61)



### 带 Watch 的事务

`WATCH` 命令用于在事务开始之前监视任意数量的键： 当调用 EXEC 命令执行事务时， 如果任意一个被监视的键已经被其他客户端修改了， 那么整个事务将被打断，不再执行， 直接返回失败。

WATCH命令可以被调用多次。 对键的监视从 WATCH 执行之后开始生效， 直到调用 EXEC 为止。

用户还可以在单个 WATCH 命令中监视任意多个键， 就像这样：

```
redis> WATCH key1 key2 key3 
OK 
```

**当** `EXEC` **被调用时， 不管事务是否成功执行， 对所有键的监视都会被取消。**另外， 当客户端断开连接时， 该客户端对键的监视也会被取消。

我们看个简单的例子，用 watch 监控我的账号余额（一周100零花钱的我），正常消费

![redis-transaction-watch1.png](https://tva1.sinaimg.cn/large/007S8ZIlly1gi13slyi49j314i0fugs6.jpg)

但这个卡，还绑定了我媳妇的支付宝，如果在我消费的时候，她也消费了，会怎么样呢？

犯困的我去楼下 711 买了包烟，买了瓶水，这时候我媳妇在超市直接刷了 100，此时余额不足的我还在挑口香糖来着，，，

![redis-transaction-watch2](https://tva1.sinaimg.cn/large/007S8ZIlly1gi13swhge0j314c0mmtio.jpg)

这时候我去结账，发现刷卡失败（事务中断），尴尬的一批

![redis-transaction-watch3](https://tva1.sinaimg.cn/large/007S8ZIlly1gi13tb8jadj314i0m2ti6.jpg)



你可能没看明白 watch 有啥用，我们再来看下，如果还是同样的场景，我们没有 `watch balance` ，事务不会失败，储蓄卡成负数，是不不太符合业务呢

![redis-transaction-watch4](https://tva1.sinaimg.cn/large/007S8ZIlly1gi13tmbr58j314e0kkajh.jpg)



使用无参数的 `UNWATCH` 命令可以手动取消对所有键的监视。 对于一些需要改动多个键的事务，有时候程序需要同时对多个键进行加锁， 然后检查这些键的当前值是否符合程序的要求。 当值达不到要求时， 就可以使用 `UNWATCH` 命令来取消目前对键的监视， 中途放弃这个事务， 并等待事务的下次尝试。



**watch指令，类似乐观锁**，事务提交时，如果 key 的值已被别的客户端改变，比如某个 list 已被别的客户端push/pop 过了，整个事务队列都不会被执行。（当然也可以用 Redis 实现分布式锁来保证安全性，属于悲观锁）

通过 watch 命令在事务执行之前监控了多个 keys，倘若在 watch 之后有任何 key 的值发生变化，exec 命令执行的事务都将被放弃，同时返回 Null 应答以通知调用者事务执行失败。

> ##### 悲观锁
>
> 悲观锁(Pessimistic Lock)，顾名思义，就是很悲观，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会 block 直到它拿到锁。传统的关系型数据库里边就用到了很多这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁
>
> ##### 乐观锁
>
> 乐观锁(Optimistic Lock)，顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。乐观锁适用于多读的应用类型，这样可以提高吞吐量。乐观锁策略：提交版本必须大于记录当前版本才能执行更新



### WATCH 命令的实现原理

在代表数据库的 `server.h/redisDb` 结构类型中， 都保存了一个 `watched_keys` 字典， 字典的键是这个数据库被监视的键， 而字典的值则是一个链表， 链表中保存了所有监视这个键的客户端。

```c
typedef struct redisDb {
    dict *dict;                 /* The keyspace for this DB */
    dict *expires;              /* Timeout of keys with a timeout set */
    dict *blocking_keys;        /* Keys with clients waiting for data (BLPOP)*/
    dict *ready_keys;           /* Blocked keys that received a PUSH */
    dict *watched_keys;         /* WATCHED keys for MULTI/EXEC CAS */
    int id;                     /* Database ID */
    long long avg_ttl;          /* Average TTL, just for stats */
    unsigned long expires_cursor; /* Cursor of the active expire cycle. */
    list *defrag_later;         /* List of key names to attempt to defrag one by one, gradually. */
} redisDb;

list *watched_keys;     /* Keys WATCHED for MULTI/EXEC CAS */
```

比如说，以下字典就展示了一个 `watched_keys` 字典的例子：

![图：Redis设计与实现](https://redisbook.readthedocs.io/en/latest/_images/graphviz-9aea81f33da1373550c590eb0b7ca0c2b3d38366.svg)

其中， 键 `key1` 正在被 `client2` 、 `client5` 和 `client1` 三个客户端监视， 其他一些键也分别被其他别的客户端监视着。

WATCH 命令的作用， 就是将当前客户端和要监视的键在 `watched_keys` 中进行关联。

举个例子， 如果当前客户端为 `client10086` ， 那么当客户端执行 `WATCH key1 key2` 时， 前面展示的 `watched_keys` 将被修改成这个样子：

![图：Redis设计与实现](https://redisbook.readthedocs.io/en/latest/_images/graphviz-fe5e31054c282a3cdd86656994fe1678a3d4f201.svg)

通过 `watched_keys` 字典， 如果程序想检查某个键是否被监视， 那么它只要检查字典中是否存在这个键即可； 如果程序要获取监视某个键的所有客户端， 那么只要取出键的值（一个链表）， 然后对链表进行遍历即可。



在任何对数据库键空间（key space）进行修改的命令成功执行之后 （比如 FLUSHDB、SET 、DEL、LPUSH、 SADD，诸如此类）， `multi.c/touchWatchedKey` 函数都会被调用 —— 它检查数据库的 `watched_keys` 字典， 看是否有客户端在监视已经被命令修改的键， 如果有的话， 程序将所有监视这个/这些被修改键的客户端的 `REDIS_DIRTY_CAS` 选项打开：

![图：Redis设计与实现](https://redisbook.readthedocs.io/en/latest/_images/graphviz-e5c66122242aa10939b696dfeeb905343c5202bd.svg)

```c
/* "Touch" a key, so that if this key is being WATCHed by some client the
 * next EXEC will fail. */
void touchWatchedKey(redisDb *db, robj *key) {
    list *clients;
    listIter li;
    listNode *ln;

    if (dictSize(db->watched_keys) == 0) return;
    clients = dictFetchValue(db->watched_keys, key);
    if (!clients) return;

    /* Mark all the clients watching this key as CLIENT_DIRTY_CAS */
    /* Check if we are already watching for this key */
    listRewind(clients,&li);
    while((ln = listNext(&li))) {
        client *c = listNodeValue(ln);

        c->flags |= CLIENT_DIRTY_CAS;
    }
}
```

当客户端发送 EXEC 命令、触发事务执行时， 服务器会对客户端的状态进行检查：

- 如果客户端的 `REDIS_DIRTY_CAS` 选项已经被打开，那么说明被客户端监视的键至少有一个已经被修改了，事务的安全性已经被破坏。服务器会放弃执行这个事务，直接向客户端返回空回复，表示事务执行失败。
- 如果 `REDIS_DIRTY_CAS` 选项没有被打开，那么说明所有监视键都安全，服务器正式执行事务。



### 小总结：

#### 3 阶段

- 开启：以 MULTI 开始一个事务

- 入队：将多个命令入队到事务中，接到这些命令并不会立即执行，而是放到等待执行的事务队列里面

- 执行：由 EXEC 命令触发事务

#### 3 特性

- 单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
- **没有隔离级别的概念**：队列中的命令没有提交之前都不会实际的被执行，因为事务提交前任何指令都不会被实际执行，也就不存在”事务内的查询要看到事务里的更新，在事务外查询不能看到”这个让人万分头痛的问题
- 不保证原子性：Redis 同一个事务中如果有一条命令执行失败，其后的命令仍然会被执行，没有回滚

在传统的关系式数据库中，常常用 ACID 性质来检验事务功能的安全性。Redis 事务保证了其中的一致性（C）和隔离性（I），但并不保证原子性（A）和持久性（D）。

Redis 事务在发送每个指令到事务缓存队列时都要经过一次网络读写，当一个事务内部的指令较多时，需要的网络 IO 时间也会线性增长。所以通常 Redis 的客户端在执行事务时都会结合 pipeline 一起使用，这样可以将多次 IO 操作压缩为单次 IO 操作。