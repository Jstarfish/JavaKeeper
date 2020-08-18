### Redis事务的几个命令

| 命令    | 描述                                                         |
| ------- | ------------------------------------------------------------ |
| MULTI   | 标记一个事务块的开始                                         |
| EXEC    | 执行所有事务块内的命令                                       |
| DISCARD | 取消事务，放弃执行事务块内的所有命令                         |
| WATCH   | 监视一个（或多个）key，如果在事务执行之前这个（或多个）key被其他命令所改动，那么事务将被打断 |
| UNWATCH | 取消WATCH命令对所有keys的监视                                |

可以一次执行多个命令，本质是一组命令的集合。一个事务中的所有命令都会序列化，按顺序地串行化执行而不会被其它命令插入，不许加塞

能干嘛：一个队列中，一次性、顺序性、排他性的执行一系列命令

事务可以一次执行多个命令， 并且带有以下两个重要的保证：

- 事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
- 事务是一个原子操作：事务中的命令要么全部被执行，要么全部都不执行。

[MULTI](http://redisdoc.com/transaction/multi.html#multi) 命令用于开启一个事务，它总是返回 OK 。

[MULTI](http://redisdoc.com/transaction/multi.html#multi) 执行之后， 客户端可以继续向服务器发送任意多条命令， 这些命令不会立即被执行， 而是被放到一个队列中， 当 [EXEC](http://redisdoc.com/transaction/exec.html#exec) 命令被调用时， 所有队列中的命令才会被执行。

另一方面， 通过调用 [DISCARD](http://redisdoc.com/transaction/discard.html#discard) ， 客户端可以清空事务队列， 并放弃执行事务。

### 事务中的错误

使用事务时可能会遇上以下两种错误：

- 事务在执行 [EXEC](http://redisdoc.com/transaction/exec.html#exec) 之前，入队的命令可能会出错。比如说，命令可能会产生语法错误（参数数量错误，参数名错误，等等），或者其他更严重的错误，比如内存不足（如果服务器使用 maxmemory 设置了最大内存限制的话）。
- 命令可能在 [EXEC](http://redisdoc.com/transaction/exec.html#exec) 调用之后失败。举个例子，事务中的命令可能处理了错误类型的键，比如将列表命令用在了字符串键上面，诸如此类。

对于发生在 [EXEC](http://redisdoc.com/transaction/exec.html#exec) 执行之前的错误，客户端以前的做法是检查命令入队所得的返回值：如果命令入队时返回 QUEUED ，那么入队成功；否则，就是入队失败。如果有命令在入队时失败，那么大部分客户端都会停止并取消这个事务。

不过，从 Redis 2.6.5 开始，服务器会对命令入队失败的情况进行记录，并在客户端调用 [EXEC](http://redisdoc.com/transaction/exec.html#exec) 命令时，拒绝执行并自动放弃这个事务。

在 Redis 2.6.5 以前， Redis 只执行事务中那些入队成功的命令，而忽略那些入队失败的命令。 而新的处理方式则使得在流水线（pipeline）中包含事务变得简单，因为发送事务和读取事务的回复都只需要和服务器进行一次通讯。

至于那些在 [EXEC](http://redisdoc.com/transaction/exec.html#exec) 命令执行之后所产生的错误， 并没有对它们进行特别处理： 即使事务中有某个/某些命令在执行时产生了错误， 事务中的其他命令仍然会继续执行。

### 为什么 Redis 不支持回滚

如果你有使用关系式数据库的经验， 那么 “Redis 在事务失败时不进行回滚，而是继续执行余下的命令”这种做法可能会让你觉得有点奇怪。

以下是这种做法的优点：

- Redis 命令只会因为错误的语法而失败（并且这些问题不能在入队时发现），或是命令用在了错误类型的键上面：这也就是说，从实用性的角度来说，失败的命令是由编程错误造成的，而这些错误应该在开发的过程中被发现，而不应该出现在生产环境中。
- 因为不需要对回滚进行支持，所以 Redis 的内部可以保持简单且快速。

有种观点认为 Redis 处理事务的做法会产生 bug ， 然而需要注意的是， 在通常情况下， 回滚并不能解决编程错误带来的问题。 举个例子， 如果你本来想通过 [INCR](http://redisdoc.com/string/incr.html#incr) 命令将键的值加上 1 ， 却不小心加上了 2 ， 又或者对错误类型的键执行了 [INCR](http://redisdoc.com/string/incr.html#incr) ， 回滚是没有办法处理这些情况的。

鉴于没有任何机制能避免程序员自己造成的错误， 并且这类错误通常不会在生产环境中出现， 所以 Redis 选择了更简单、更快速的无回滚方式来处理事务。

简单示例：

- case1：正常执行（可以批处理 挺爽 每条操作成功的话都会各取所需 互不影响）

  ![redis-transaction-case1.png](http://ww1.sinaimg.cn/large/9b9f09a9ly1g9yqu69x1ej209q05hmx3.jpg)

- Case2：放弃事务（discard操作表示放弃事务）

  ![redis-transaction-case2.png](http://ww1.sinaimg.cn/large/9b9f09a9ly1g9yqw17zn7j208n03uq2t.jpg)

- Case3：全体连坐（某一条操作记录报错的话，exec后所有操作都不会成功）

![redis-transaction-case3.png](http://ww1.sinaimg.cn/large/9b9f09a9ly1g9yqy1ebddj20eh04z3yi.jpg)

- Case4：冤头债主（示例中 k1被设置为String类型，decr k1可以放入操作队列中，因为只有在执行的时候才可以判断出语句错误，其他正确的会被正常执行）

  ![redis-transaction-case4.png](http://ww1.sinaimg.cn/large/9b9f09a9ly1g9yr1chai1j20df07k0ss.jpg)

- Case5：watch监控



### 使用 check-and-set 操作实现乐观锁

[WATCH](http://redisdoc.com/transaction/watch.html#watch) 命令可以为 Redis 事务提供 check-and-set （CAS）行为。

被 [WATCH](http://redisdoc.com/transaction/watch.html#watch) 的键会被监视，并会发觉这些键是否被改动过了。 如果有至少一个被监视的键在 [EXEC](http://redisdoc.com/transaction/exec.html#exec) 执行之前被修改了， 那么整个事务都会被取消， [EXEC](http://redisdoc.com/transaction/exec.html#exec) 返回空多条批量回复（null multi-bulk reply）来表示事务已经失败。

举个例子， 假设我们需要原子性地为某个值进行增 1 操作（假设 [INCR](http://redisdoc.com/string/incr.html#incr) 不存在）。

首先我们可能会这样做：

```
val = GET mykey 
val = val + 1 
SET mykey $val 
```

上面的这个实现在只有一个客户端的时候可以执行得很好。 但是， 当多个客户端同时对同一个键进行这样的操作时， 就会产生竞争条件。

举个例子， 如果客户端 A 和 B 都读取了键原来的值， 比如 10 ， 那么两个客户端都会将键的值设为 11 ， 但正确的结果应该是 12 才对。

有了 [WATCH](http://redisdoc.com/transaction/watch.html#watch) ， 我们就可以轻松地解决这类问题了：

```
WATCH mykey 
val = GET mykey 
val = val + 1 
MULTI 
SET mykey $val 
EXEC 
```

使用上面的代码， 如果在 WATCH 执行之后， EXEC 执行之前， 有其他客户端修改了 mykey 的值， 那么当前客户端的事务就会失败。 程序需要做的， 就是不断重试这个操作， 直到没有发生碰撞为止。

这种形式的锁被称作乐观锁， 它是一种非常强大的锁机制。 并且因为大多数情况下， 不同的客户端会访问不同的键， 碰撞的情况一般都很少， 所以通常并不需要进行重试。

**了解 WATCH**

WATCH 使得 EXEC 命令需要有条件地执行： 事务只能在所有被监视键都没有被修改的前提下执行， 如果这个前提不能满足的话，事务就不会被执行。

如果你使用 WATCH 监视了一个带过期时间的键， 那么即使这个键过期了， 事务仍然可以正常执行， 关于这方面的详细情况，请看这个帖子： http://code.google.com/p/redis/issues/detail?id=270

WATCH命令可以被调用多次。 对键的监视从 WATCH 执行之后开始生效， 直到调用 EXEC 为止。

用户还可以在单个 WATCH 命令中监视任意多个键， 就像这样：

```
redis> WATCH key1 key2 key3 OK 
```

**当** [**EXEC**](http://redisdoc.com/transaction/exec.html#exec) **被调用时， 不管事务是否成功执行， 对所有键的监视都会被取消。**另外， 当客户端断开连接时， 该客户端对键的监视也会被取消。

使用无参数的 UNWATCH 命令可以手动取消对所有键的监视。 对于一些需要改动多个键的事务， 有时候程序需要同时对多个键进行加锁， 然后检查这些键的当前值是否符合程序的要求。 当值达不到要求时， 就可以使用 UNWATCH 命令来取消目前对键的监视， 中途放弃这个事务， 并等待事务的下次尝试。



#### 悲观锁/乐观锁/CAS(Check And Set)

##### 悲观锁

 悲观锁(Pessimistic Lock), 顾名思义，就是很悲观，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会block直到它拿到锁。传统的关系型数据库里边就用到了很多这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁

##### 乐观锁

乐观锁(Optimistic Lock), 顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。乐观锁适用于多读的应用类型，这样可以提高吞吐量，乐观锁策略:提交版本必须大于记录当前版本才能执行更新

##### CAS

初始化信用卡可用余额和欠额, 加塞篡改，先监控再开启multi，保证两笔金额变动在同一个事务内

有加塞篡改：监控了key，如果key被修改了，后面一个事务的执行失效

![](H:\Technical-Learning\docs\_images\redis\redis-watch-demo.jpg)

 unwatch

一旦执行了exec之前加的监控锁都会被取消掉了



小结：

**watch指令，类似乐观锁**，事务提交时，如果key的值已被别的客户端改变，比如某个list已被别的客户端push/pop过了，整个事务队列都不会被执行。

通过watch命令在事务执行之前监控了多个keys，倘若在watch之后有任何key的值发生变化，exec命令执行的事务都将被放弃，同时返回Nullmulit-bulk应答以通知调用者事务执行失败

![redis-transaction-watch1.png](https://i.loli.net/2019/11/18/oWGvR1H78gCh4dN.png)

![redis-transaction-watch2.png](https://i.loli.net/2019/11/18/JR1YpD2HSIQ7OEd.png)

![redis-transaction-watch3.png](https://i.loli.net/2019/11/18/Hp8ilxgOGcbnTJ2.png)

### 事务3阶段3特性

#### 3阶段

- 开启：以MULTI开始一个事务

- 入队：将多个命令入队到事务中，接到这些命令并不会立即执行，而是放到等待执行的事务队列里面

- 执行：由EXEC命令触发事务

#### 3特性

- 单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。

- **没有隔离级别的概念**：队列中的命令没有提交之前都不会实际的被执行，因为事务提交前任何指令都不会被实际执行，也就不存在”事务内的查询要看到事务里的更新，在事务外查询不能看到”这个让人万分头痛的问题

- 不保证原子性：redis同一个事务中如果有一条命令执行失败，其后的命令仍然会被执行，没有回滚