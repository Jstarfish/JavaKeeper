# Redis 哨兵模式

> 我们知道 Reids 提供了主从集群的机制，来保证可用性，可是如果主库发生故障了，那就直接会影响到从库的同步，怎么办呢？
>
> 所以，如果主库挂了，我们就需要运行一个新主库，比如说把一个从库切换为主库，把它当成主库。这就涉及到三个问题：
>
> 1. 主库真的挂了吗？
> 2. 该选择哪个从库作为主库？
> 3. 怎么把新主库的相关信息通知给从库和客户端呢？
>
> 围绕这 3 个问题，我们来看下 Redis 哨兵。

### Redis Sentinel 哨兵

![](https://cdn.jsdelivr.net/gh/wmyskxz/img/img/Redis%EF%BC%889%EF%BC%89%E2%80%94%E2%80%94%E5%8F%B2%E4%B8%8A%E6%9C%80%E5%BC%BA%E3%80%90%E9%9B%86%E7%BE%A4%E3%80%91%E5%85%A5%E9%97%A8%E5%AE%9E%E8%B7%B5%E6%95%99%E7%A8%8B/7896890-884d5be9a2ddfebc.png)

上图 展示了一个典型的哨兵架构图，它由两部分组成，哨兵节点和数据节点：

- **哨兵节点：** 哨兵系统由一个或多个哨兵节点组成，哨兵节点是特殊的 Redis 节点，<mark>不存储数据</mark>；
- **数据节点：** 主节点和从节点都是数据节点；

在复制的基础上，哨兵实现了 **自动化的故障恢复** 功能，下面是官方对于哨兵功能的描述：

- **监控（Monitoring）：** 哨兵会不断地检查主节点和从节点是否运作正常。监控是指哨兵进程在运行时，周期性地给所有的主从库发送 PING 命令，检测它们是否仍然在线运行。如果从库没有在规定时间内响应哨兵的 PING 命令，哨兵就会把它标记为“下线状态”；同样，如果主库也没有在规定时间内响应哨兵的 PING 命令，哨兵就会判定主库下线，然后开始自动切换主库的流程。
- **自动故障转移（Automatic failover）/ 选主：** 当 **主节点** 不能正常工作时，哨兵会开始 **自动故障转移操作**，它会将失效主节点的其中一个 **从节点升级为新的主节点**，并让其他从节点改为复制新的主节点。
- **配置提供者（Configuration provider）：** 客户端在初始化时，通过连接哨兵来获得当前 Redis 服务的主节点地址。
- **通知（Notification）：** 在执行通知任务时，哨兵会把新主库的连接信息发给其他从库，让它们执行 replicaof 命令，和新主库建立连接，并进行数据复制。同时，哨兵会把新主库的连接信息通知给客户端，让它们把请求操作发到新主库上。

其中，监控和自动故障转移功能，使得哨兵可以及时发现主节点故障并完成转移。而配置提供者和通知功能，则需要在与客户端的交互中才能体现。



### 哨兵机制的基本流程

在监控任务中，哨兵需要判断主库是否处于下线状态；

#### 主观下线和客观下线

我先解释下什么是“主观下线”。

**哨兵进程会使用 PING 命令检测它自己和主、从库的网络连接情况，用来判断实例的状态。**如果哨兵发现主库或从库对 PING 命令的响应超时了，那么，哨兵就会先把它标记为“主观下线”。

如果检测的是从库，那么，哨兵简单地把它标记为“主观下线”就行了，因为从库的下线影响一般不太大，集群的对外服务不会间断。

但是，如果检测的是主库，那么，哨兵还不能简单地把它标记为“主观下线”，开启主从切换。因为很有可能存在这么一个情况：那就是哨兵误判了，其实主库并没有故障。可是，一旦启动了主从切换，后续的选主和通知操作都会带来额外的计算和通信开销。

为了避免这些不必要的开销，我们要特别注意误判的情况。

误判一般会发生在集群网络压力较大、网络拥塞，或者是主库本身压力较大的情况下。一旦哨兵判断主库下线了，就会开始选择新主库，并让从库和新主库进行数据同步，这个过程本身就会有开销，例如，哨兵要花时间选出新主库，从库也需要花时间和新主库同步。

那怎么减少误判呢？

在日常生活中，当我们要对一些重要的事情做判断的时候，经常会和家人或朋友一起商量一下，然后再做决定。

哨兵机制也是类似的，它通常会采用多实例组成的集群模式进行部署，这也被称为**哨兵集群**。引入多个哨兵实例一起来判断，就可以避免单个哨兵因为自身网络状况不好，而误判主库下线的情况。同时，多个哨兵的网络同时不稳定的概率较小，由它们一起做决策，误判率也能降低。

在判断主库是否下线时，不能由一个哨兵说了算，只有大多数的哨兵实例，都判断主库已经“主观下线”了，主库才会被标记为“**客观下线**”，这个叫法也是表明主库下线成为一个客观事实了。这个判断原则就是：少数服从多数。同时，这会进一步触发哨兵开始主从切换流程。

为了方便你理解，我再画一张图展示一下这里的逻辑。如下图所示，Redis 主从集群有一个主库、三个从库，还有三个哨兵实例。在图片的左边，哨兵 2 判断主库为“主观下线”，但哨兵 1 和 3 却判定主库是上线状态，此时，即使哨兵 3 仍然判断主库为上线状态，主库也被标记为“客观下线”了。

![img](https://static001.geekbang.org/resource/image/19/0d/1945703abf16ee14e2f7559873e4e60d.jpg)

#### 如何选定新主库？

一般来说，我把哨兵选择新主库的过程称为“筛选 + 打分”。简单来说，我们在多个从库中，先按照一定的筛选条件，把不符合条件的从库去掉。然后，我们再按照一定的规则，给剩下的从库逐个打分，将得分最高的从库选为新主库，如下图所示：

![img](https://static001.geekbang.org/resource/image/f2/4c/f2e9b8830db46d959daa6a39fbf4a14c.jpg)





### 快速体验

#### 第一步：创建主从节点配置文件并启动

正确安装好 Redis 之后，我们去到 Redis 的安装目录 *(mac 默认在 `/usr/local/`)\*，找到 `redis.conf` 文件复制三份分别命名为 `redis-master.conf`/`redis-slave1.conf`/`redis-slave2.conf`，分别作为 `1` 个主节点和 `2` 个从节点的配置文件 \*(下图演示了我本机的 `redis.conf` 文件的位置)*

![](https://cdn.jsdelivr.net/gh/wmyskxz/img/img/Redis%EF%BC%889%EF%BC%89%E2%80%94%E2%80%94%E5%8F%B2%E4%B8%8A%E6%9C%80%E5%BC%BA%E3%80%90%E9%9B%86%E7%BE%A4%E3%80%91%E5%85%A5%E9%97%A8%E5%AE%9E%E8%B7%B5%E6%95%99%E7%A8%8B/7896890-34de77bfca56d32e.png)

打开可以看到这个 `.conf` 后缀的文件里面有很多说明的内容，全部删除然后分别改成下面的样子：

```bash
#redis-master.conf
port 6379
daemonize yes
logfile "6379.log"
dbfilename "dump-6379.rdb"

#redis-slave1.conf
port 6380
daemonize yes
logfile "6380.log"
dbfilename "dump-6380.rdb"
slaveof 127.0.0.1 6379

#redis-slave2.conf
port 6381
daemonize yes
logfile "6381.log"
dbfilename "dump-6381.rdb"
slaveof 127.0.0.1 6379
```

然后我们可以执行 `redis-server ` 来根据配置文件启动不同的 Redis 实例，依次启动主从节点：

```bash
redis-server /usr/local/redis-5.0.3/redis-master.conf
redis-server /usr/local/redis-5.0.3/redis-slave1.conf
redis-server /usr/local/redis-5.0.3/redis-slave2.conf
```

节点启动后，我们执行 `redis-cli` 默认连接到我们端口为 `6379` 的主节点执行 `info Replication` 检查一下主从状态是否正常：*(可以看到下方正确地显示了两个从节点)*

![img](https://cdn.jsdelivr.net/gh/wmyskxz/img/img/Redis%EF%BC%889%EF%BC%89%E2%80%94%E2%80%94%E5%8F%B2%E4%B8%8A%E6%9C%80%E5%BC%BA%E3%80%90%E9%9B%86%E7%BE%A4%E3%80%91%E5%85%A5%E9%97%A8%E5%AE%9E%E8%B7%B5%E6%95%99%E7%A8%8B/7896890-a1c935f094240cac.png)

#### 第二步：创建哨兵节点配置文件并启动

按照上面同样的方法，我们给哨兵节点也创建三个配置文件。*(哨兵节点本质上是特殊的 Redis 节点，所以配置几乎没什么差别，只是在端口上做区分就好)*

```bash
# redis-sentinel-1.conf
port 26379
daemonize yes
logfile "26379.log"
sentinel monitor mymaster 127.0.0.1 6379 2

# redis-sentinel-2.conf
port 26380
daemonize yes
logfile "26380.log"
sentinel monitor mymaster 127.0.0.1 6379 2

# redis-sentinel-3.conf
port 26381
daemonize yes
logfile "26381.log"
sentinel monitor mymaster 127.0.0.1 6379 2
```

其中，`sentinel monitor mymaster 127.0.0.1 6379 2` 配置的含义是：该哨兵节点监控 `127.0.0.1:6379` 这个主节点，该主节点的名称是 `mymaster`，最后的 `2` 的含义与主节点的故障判定有关：至少需要 `2` 个哨兵节点同意，才能判定主节点故障并进行故障转移。

执行下方命令将哨兵节点启动起来：

```bash
redis-server /usr/local/redis-5.0.3/redis-sentinel-1.conf --sentinel
redis-server /usr/local/redis-5.0.3/redis-sentinel-2.conf --sentinel
redis-server /usr/local/redis-5.0.3/redis-sentinel-3.conf --sentinel
```

使用 `redis-cil` 工具连接哨兵节点，并执行 `info Sentinel` 命令来查看是否已经在监视主节点了：

```bash
# 连接端口为 26379 的 Redis 节点
➜  ~ redis-cli -p 26379
127.0.0.1:26379> info Sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=127.0.0.1:6379,slaves=2,sentinels=3
```

此时你打开刚才写好的哨兵配置文件，你还会发现出现了一些变化：

#### 第三步：演示故障转移

首先，我们使用 `kill -9` 命令来杀掉主节点，**同时** 在哨兵节点中执行 `info Sentinel` 命令来观察故障节点的过程：

```bash
➜  ~ ps aux | grep 6379
longtao          74529   0.3  0.0  4346936   2132   ??  Ss   10:30上午   0:03.09 redis-server *:26379 [sentinel]
longtao          73541   0.2  0.0  4348072   2292   ??  Ss   10:18上午   0:04.79 redis-server *:6379
longtao          75521   0.0  0.0  4286728    728 s008  S+   10:39上午   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn 6379
longtao          74836   0.0  0.0  4289844    944 s006  S+   10:32上午   0:00.01 redis-cli -p 26379
➜  ~ kill -9 73541
```

如果 **刚杀掉瞬间** 在哨兵节点中执行 `info` 命令来查看，会发现主节点还没有切换过来，因为哨兵发现主节点故障并转移需要一段时间：

```bash
# 第一时间查看哨兵节点发现并未转移，还在 6379 端口
127.0.0.1:26379> info Sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=127.0.0.1:6379,slaves=2,sentinels=3
```

一段时间之后你再执行 `info` 命令，查看，你就会发现主节点已经切换成了 `6381` 端口的从节点：

```bash
# 过一段时间之后在执行，发现已经切换了 6381 端口
127.0.0.1:26379> info Sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=127.0.0.1:6381,slaves=2,sentinels=3
```

但同时还可以发现，**哨兵节点认为新的主节点仍然有两个从节点** *(上方 slaves=2)*，这是因为哨兵在将 `6381` 切换成主节点的同时，将 `6379` 节点置为其从节点。虽然 `6379` 从节点已经挂掉，但是由于 **哨兵并不会对从节点进行客观下线**，因此认为该从节点一直存在。当 `6379` 节点重新启动后，会自动变成 `6381` 节点的从节点。

另外，在故障转移的阶段，哨兵和主从节点的配置文件都会被改写：

- **对于主从节点：** 主要是 `slaveof` 配置的变化，新的主节点没有了 `slaveof` 配置，其从节点则 `slaveof` 新的主节点。
- **对于哨兵节点：** 除了主从节点信息的变化，纪元(epoch) *(记录当前集群状态的参数)* 也会变化，纪元相关的参数都 +1 了。

### 客户端访问哨兵系统代码演示

上面我们在 *快速体验* 中主要感受到了服务端自己对于当前主从节点的自动化治理，下面我们以 Java 代码为例，来演示一下客户端如何访问我们的哨兵系统：

```java
public static void testSentinel() throws Exception {
         String masterName = "mymaster";
         Set<String> sentinels = new HashSet<>();
         sentinels.add("127.0.0.1:26379");
         sentinels.add("127.0.0.1:26380");
         sentinels.add("127.0.0.1:26381");

         // 初始化过程做了很多工作
         JedisSentinelPool pool = new JedisSentinelPool(masterName, sentinels); 
         Jedis jedis = pool.getResource();
         jedis.set("key1", "value1");
         pool.close();
}
```

#### 客户端原理

Jedis 客户端对哨兵提供了很好的支持。如上述代码所示，我们只需要向 Jedis 提供哨兵节点集合和 `masterName` ，构造 `JedisSentinelPool` 对象，然后便可以像使用普通 Redis 连接池一样来使用了：通过 `pool.getResource()` 获取连接，执行具体的命令。

在整个过程中，我们的代码不需要显式的指定主节点的地址，就可以连接到主节点；代码中对故障转移没有任何体现，就可以在哨兵完成故障转移后自动的切换主节点。之所以可以做到这一点，是因为在 `JedisSentinelPool` 的构造器中，进行了相关的工作；主要包括以下两点：

1. **遍历哨兵节点，获取主节点信息：** 遍历哨兵节点，通过其中一个哨兵节点 + `masterName` 获得主节点的信息；该功能是通过调用哨兵节点的 `sentinel get-master-addr-by-name` 命令实现；
2. **增加对哨兵的监听：** 这样当发生故障转移时，客户端便可以收到哨兵的通知，从而完成主节点的切换。具体做法是：利用 Redis 提供的 **发布订阅** 功能，为每一个哨兵节点开启一个单独的线程，订阅哨兵节点的 + switch-master 频道，当收到消息时，重新初始化连接池。

### 新的主服务器是怎样被挑选出来的？

**故障转移操作的第一步** 要做的就是在已下线主服务器属下的所有从服务器中，挑选出一个状态良好、数据完整的从服务器，然后向这个从服务器发送 `slaveof no one` 命令，将这个从服务器转换为主服务器。但是这个从服务器是怎么样被挑选出来的呢？

![](https://cdn.jsdelivr.net/gh/wmyskxz/img/img/Redis%EF%BC%889%EF%BC%89%E2%80%94%E2%80%94%E5%8F%B2%E4%B8%8A%E6%9C%80%E5%BC%BA%E3%80%90%E9%9B%86%E7%BE%A4%E3%80%91%E5%85%A5%E9%97%A8%E5%AE%9E%E8%B7%B5%E6%95%99%E7%A8%8B/7896890-02dfea57f44fc27e.png)



简单来说 Sentinel 使用以下规则来选择新的主服务器：

1. 在失效主服务器属下的从服务器当中， 那些被标记为主观下线、已断线、或者最后一次回复 PING 命令的时间大于五秒钟的从服务器都会被 **淘汰**。
2. 在失效主服务器属下的从服务器当中， 那些与失效主服务器连接断开的时长超过 down-after 选项指定的时长十倍的从服务器都会被 **淘汰**。
3. 在 **经历了以上两轮淘汰之后** 剩下来的从服务器中， 我们选出 **复制偏移量（replication offset）最大** 的那个 **从服务器** 作为新的主服务器；如果复制偏移量不可用，或者从服务器的复制偏移量相同，那么 **带有最小运行 ID** 的那个从服务器成为新的主服务器。

