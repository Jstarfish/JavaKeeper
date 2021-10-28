# Kafka 工作流程和存储机制分析

![](https://images.gitbook.cn/e49bc290-cf95-11e8-8388-bd48f25029c6)

### 一、Kafka 文件存储机制

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh45cng275j30ny0bjwfr.jpg)

#### topic构成

**Kafka 中消息是以 topic 进行分类的**，生产者生产消息，消费者消费消息，都是面向 topic 的。

在 Kafka 中，一个 topic 可以分为多个 partition，一个 partition 分为多个 **segment**，每个 segment 对应两个文件：.index 和 .log 文件

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh3ntjmvt8j31600mzac4.jpg)

**topic 是逻辑上的概念，而 patition 是物理上的概念**，每个 patition 对应一个 log 文件，而 log 文件中存储的就是 producer 生产的数据，patition 生产的数据会被不断的添加到 log 文件的末端，且每条数据都有自己的 offset。

消费组中的每个消费者，都是实时记录自己消费到哪个 offset，以便出错恢复，从上次的位置继续消费。



> 问：Kafka 为什么要将 Topic 进行分区
>
> 答：负载均衡+水平扩展
>
> Topic 只是逻辑概念，面向的是 producer 和 consumer；而 Partition 则是物理概念。可以想象，如果 Topic 不进行分区，而将 Topic 内的消息存储于一个 broker，那么关于该 Topic 的所有读写请求都将由这一个 broker 处理，吞吐量很容易陷入瓶颈，这显然是不符合高吞吐量应用场景的。有了 Partition 概念以后，假设一个 Topic 被分为 10 个 Partitions，Kafka 会根据一定的算法将 10 个 Partition 尽可能均匀的分布到不同的 broker（服务器）上，当 producer 发布消息时，producer 客户端可以采用 `random`、`key-hash` 及 `轮询` 等算法选定目标 partition，若不指定，Kafka 也将根据一定算法将其置于某一分区上。Partiton 机制可以极大的提高吞吐量，并且使得系统具备良好的水平扩展能力。
>
> 在创建 topic 时可以在 `$KAFKA_HOME/config/server.properties` 中指定这个 partition 的数量（如下所示），当然可以在 topic 创建之后去修改 partition 的数量。
>
> ```properties
> # The default number of log partitions per topic. More partitions allow greater
> # parallelism for consumption, but this will also result in more files across
> # the brokers.
> num.partitions=3
> ```
>
> 在发送一条消息时，可以指定这个消息的 key，producer 根据这个 key 和 partition 机制来判断这个消息发送到哪个partition。partition 机制可以通过指定 producer 的 partition.class 这一参数来指定（即支持自定义），该 class 必须实现 kafka.producer.Partitioner 接口。
>
> 



#### 消息存储原理

由于生产者生产的消息会不断追加到 log 文件末尾，为防止 log 文件过大导致数据定位效率低下，Kafka 采取了**分片**和**索引**机制，将每个 partition 分为多个 segment。每个 segment 对应两个文件——`.index文件 `和 `.log文件`。这些文件位于一个文件夹下，该文件夹的命名规则为：`topic名称+分区序号`。

如下，我们创建一个只有一个分区一个副本的 topic

```
> bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic starfish
```

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh3lsiywl1j31p804qdjk.jpg)

然后可以在 kafka-logs 目录（server.properties 默认配置）下看到会有个名为 starfish-0 的文件夹。如果，starfish 这个 topic 有三个分区，则其对应的文件夹为 starfish-0，starfish-1，starfish-2。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh3lw95aahj30oy0bm764.jpg)

这些文件的含义如下：

| 类别                    | 作用                                                         |
| :---------------------- | :----------------------------------------------------------- |
| .index                  | 基于偏移量的索引文件，存放着消息的offset和其对应的物理位置，是<mark>**稀松索引**</mark> |
| .timestamp              | 时间戳索引文件                                               |
| .log                    | 它是segment文件的数据文件，用于存储实际的消息。该文件是二进制格式的。log文件是存储在 ConcurrentSkipListMap 里的，是一个map结构，key是文件名（offset），value是内容，这样在查找指定偏移量的消息时，用二分查找法就能快速定位到消息所在的数据文件和索引文件 |
| .snaphot                | 快照文件                                                     |
| leader-epoch-checkpoint | 保存了每一任leader开始写入消息时的offset，会定时更新。 follower被选为leader时会根据这个确定哪些消息可用 |

index 和 log 文件以当前 segment 的第一条消息的 offset 命名。偏移量 offset 是一个 64 位的长整形数，固定是     20 位数字，长度未达到，用 0 进行填补，索引文件和日志文件都由此作为文件名命名规则。所以从上图可以看出，我们的偏移量是从 0 开始的，`.index` 和 `.log` 文件名称都为 `00000000000000000000`。

接着往 topic 中发送一些消息，并启动消费者消费

```
> bin /kafka-console-producer.sh --bootstrap-server localhost:9092 --topic starfish
one
```

```
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic starfish --from-beginning
one
```

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh3md0mmslj31y40gcwqe.jpg)

查看 .log 文件下是否有数据 one

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh3mujbqwkj30zu082775.jpg)

内容存在一些”乱码“，因为数据是经过序列化压缩的。

那么数据文件 .log 大小有限制吗，能保存多久时间？这些我们都可以通过 Kafka 目录下 `conf/server.properties` 配置文件修改：

```
# log文件存储时间，单位为小时，这里设置为1周
log.retention.hours=168

# log文件大小的最大值，这里为1g，超过这个值，则会创建新的segment（也就是新的.index和.log文件）
log.segment.bytes=1073741824
```

比如，当生产者生产数据量较多，一个 segment 存储不下触发分片时，在日志 topic 目录下你会看到类似如下所示的文件：

```
00000000000000000000.index
00000000000000000000.log
00000000000000170410.index
00000000000000170410.log
00000000000000239430.index
00000000000000239430.log
```

- 每个分区是由多个 Segment 组成，当 Kafka 要写数据到一个 partition 时，它会写入到状态为 active 的segment 中。如果该 segment 被写满，则一个新的 segment 将会被新建，然后变成新的“active” segment
- 偏移量：分区中的每一条消息都会被分配的一个连续的id值，该值用于唯一标识分区中的每一条消息
- 每个 Segment 中则保存了真实的消息数据。每个 Segment 对应于一个索引文件与一个日志文件。Segment 文件的生命周期是由 Kafka Server 的配置参数所决定的。比如说，`server.properties` 文件中的参数项`log.retention.hours=168` 就表示 7 天后删除老的消息文件
- [稀松索引]：稀松索引可以加快速度，因为 index 不是为每条消息都存一条索引信息，而是每隔几条数据才存一条 index 信息，这样 index 文件其实很小。kafka在写入日志文件的时候，同时会写索引文件（.index和.timeindex）。默认情况下，有个参数 log.index.interval.bytes 限定了在日志文件写入多少数据，就要在索引文件写一条索引，默认是4KB，写4kb的数据然后在索引里写一条索引。

举个栗子：00000000000000170410 的 “.index” 文件和 “.log” 文件的对应的关系，如下图

![](https://images.gitbook.cn/60eafc10-cc9b-11e8-b452-15eec1b99303)

> 问：为什么不能以 partition 作为存储单位？还要加个 segment？
>
> 答：如果就以 partition 为最小存储单位，可以想象，当 Kafka producer 不断发送消息，必然会引起 partition 文件的无限扩张，将对消息文件的维护以及已消费的消息的清理带来严重的影响，因此，需以 segment 为单位将 partition 进一步细分。每个 partition（目录）相当于一个巨型文件被平均分配到多个大小相等的 segment（段）数据文件中（每个 segment 文件中消息数量不一定相等）这种特性也方便 old segment 的删除，即方便已被消费的消息的清理，提高磁盘的利用率。每个 partition 只需要支持顺序读写就行，segment 的文件生命周期由服务端配置参数（log.segment.bytes，log.roll.{ms,hours} 等若干参数）决定。
>
> 
>
> 问：segment 的工作原理是怎样的？
>
> 答：segment 文件由两部分组成，分别为 “.index” 文件和 “.log” 文件，分别表示为 segment 索引文件和数据文件。这两个文件的命令规则为：partition 全局的第一个 segment 从 0 开始，后续每个 segment 文件名为上一个 segment 文件最后一条消息的 offset 值，数值大小为 64 位，20 位数字字符长度，没有数字用 0 填充



下图展示了Kafka查找数据的过程：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh4aushr80j30n60b4aab.jpg)

`.index文件` 存储大量的索引信息，`.log文件` 存储大量的数据，索引文件中的元数据指向对应数据文件中 message 的物理偏移地址。

比如现在要查找偏移量 offset 为 3 的消息，根据 .index 文件命名我们可以知道，offset 为 3 的索引应该从00000000000000000000.index 里查找。根据上图所示，其对应的索引地址为 756-911，所以 Kafka 将读取00000000000000000000.log 756~911区间的数据。



### 二、Kafka 生产过程    

Kafka 生产者用于生产消息。通过前面的内容我们知道，Kafka 的 topic 可以有多个分区，那么生产者如何将这些数据可靠地发送到这些分区？生产者发送数据的不同的分区的依据是什么？针对这两个疑问，这节简单记录下。

#### 3.2.1 写入流程

producer 写入消息流程如下： 

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh45yc0vp8j30zz0gbdik.jpg)



1. producer 先从 zookeeper 的 "/brokers/.../state"节点找到该 partition 的 leader
2. producer 将消息发送给该 leader 
3. leader 将消息写入本地 log 
4. followers 从 leader pull 消息，写入本地 log 后向 leader 发送 ACK    
5. leader 收到所有 ISR 中的 replication 的 ACK 后，增加 HW（high watermark，最后 commit 的 offset）并向 producer 发送 ACK 

#### 2.1 写入方式 

producer 采用推（push） 模式将消息发布到 broker，每条消息都被追加（append） 到分区（patition） 中，属于顺序写磁盘（顺序写磁盘效率比随机写内存要高，保障 kafka 吞吐率）。

####  2.2 分区（Partition） 

消息发送时都被发送到一个 topic，其本质就是一个目录，而 topic 是由一些 Partition Logs(分区日志)组成

**分区的原因：**

1. **方便在集群中扩展**，每个 Partition 可以通过调整以适应它所在的机器，而一个 topic 又可以有多个 Partition 组成，因此整个集群就可以适应任意大小的数据了；

2. **可以提高并发**，因为可以以 Partition 为单位读写了。 

**分区的原则：** 

我们需要将 producer 发送的数据封装成一个 ProducerRecord 对象。

```java
public ProducerRecord (String topic, Integer partition, Long timestamp, K key, V value, Iterable<Header> headers)
public ProducerRecord (String topic, Integer partition, Long timestamp, K key, V value)
public ProducerRecord (String topic, Integer partition, K key, V value, Iterable<Header> headers)
public ProducerRecord (String topic, Integer partition, K key, V value)
public ProducerRecord (String topic, K key, V value)
public ProducerRecord (String topic, V value)
```

1. 指明 partition 的情况下，直接将指明的值直接作为 partiton 值； 
2. 没有指明 partition 值但有 key 的情况下，将 key 的 hash 值与 topic 的 partition 数进行取余得到 partition 值； 
3. 既没有 partition 值又没有 key 值的情况下，第一次调用时随机生成一个整数（后面每次调用在这个整数上自增），将这个值与 topic 可用的 partition 总数取余得到 partition 值，也就是常说的 round-robin 算法。  


#### 2.3 副本（Replication）

同一个 partition 可能会有多个 replication（ 对应 server.properties 配置中的 `default.replication.factor=N`）。没有 replication 的情况下，一旦 broker 宕机，其上所有 patition 的数据都不可被消费，同时 producer 也不能再将数据存于其上的 patition。引入 replication 之后，同一个 partition 可能会有多个 replication，而这时需要在这些 replication 之间选出一 个 leader， producer 和 consumer 只与这个 leader 交互，其它 replication 作为 follower 从 leader 中复制数据。

为了提高消息的可靠性，Kafka 每个 topic 的 partition 有 N 个副本（replicas），其中 N（大于等于 1）是 topic 的复制因子（replica fator）的个数。Kafka 通过多副本机制实现故障自动转移，当 Kafka 集群中出现 broker 失效时，副本机制可保证服务可用。对于任何一个 partition，它的 N 个 replicas 中，其中一个 replica 为 leader，其他都为 follower，leader 负责处理 partition 的所有读写请求，follower 则负责被动地去复制 leader 上的数据。如下图所示，Kafka 集群中有 4 个 broker，某 topic 有 3 个 partition，且复制因子即副本个数也为 3：

![](https://images.gitbook.cn/616acd70-cf9b-11e8-8388-bd48f25029c6)

如果 leader 所在的 broker 发生故障或宕机，对应 partition 将因无 leader 而不能处理客户端请求，这时副本的作用就体现出来了：一个新 leader 将从 follower 中被选举出来并继续处理客户端的请求。



#### 2.4 数据可靠性保证

一个 partition 有多个副本（replicas），为了提高可靠性，这些副本分散在不同的 broker 上，由于带宽、读写性能、网络延迟等因素，同一时刻，这些副本的状态通常是不一致的：即 followers 与 leader 的状态不一致。

为保证 producer 发送的数据，能可靠的发送到指定的 topic，topic 的每个 partition 收到 producer 数据后，都需要向 producer 发送 ack（acknowledgement确认收到），如果 producer 收到 ack，就会进行下一轮的发送，否则重新发送数据。

##### a) 副本数据同步策略主要有如下两种

| 方案                        | 优点                                                   | 缺点                                                  |
| --------------------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| 半数以上完成同步，就发送ack | 延迟低                                                 | 选举新的 leader 时，容忍n台节点的故障，需要2n+1个副本 |
| 全部完成同步，才发送ack     | 选举新的 leader 时，容忍n台节点的故障，需要 n+1 个副本 | 延迟高                                                |

Kafka 选择了第二种方案，原因如下：

- 同样为了容忍 n 台节点的故障，第一种方案需要的副本数相对较多，而 Kafka 的每个分区都有大量的数据，第一种方案会造成大量的数据冗余；
- 虽然第二种方案的网络延迟会比较高，但网络延迟对 Kafka 的影响较小。

##### b) ISR

采用第二种方案之后，设想一下情景：leader 收到数据，所有 follower 都开始同步数据，但有一个 follower 挂了，迟迟不能与 leader 保持同步，那 leader 就要一直等下去，直到它完成同步，才能发送 ack，这个问题怎么解决呢？

leader 维护了一个动态的 **in-sync replica set**(ISR)，意为和 leader 保持同步的 follower 集合。当 ISR 中的follower 完成数据的同步之后，leader 就会给 follower 发送 ack。如果 follower 长时间未向 leader 同步数据，则该 follower 将会被踢出 ISR，该时间阈值由 `replica.lag.time.max.ms` 参数设定。leader 发生故障之后，就会从 ISR 中选举新的 leader。（之前还有另一个参数，0.9 版本之后 `replica.lag.max.messages` 参数被移除了）

##### c) ack应答机制

对于某些不太重要的数据，对数据的可靠性要求不是很高，能够容忍数据的少量丢失，所以没必要等 ISR 中的 follower 全部接收成功。

所以 Kafka 为用户提供了**三种可靠性级别**，用户根据对可靠性和延迟的要求进行权衡，选择以下的 acks 参数配置

- 0：producer 不等待 broker 的 ack，这一操作提供了一个最低的延迟，broker 一接收到还没有写入磁盘就已经返回，当 broker 故障时有可能**丢失数据**；

- 1：producer 等待 broker 的 ack，partition 的 leader 落盘成功后返回 ack，如果在 follower 同步成功之前 leader 故障，那么将会**丢失数据**；

- -1（all）：producer 等待 broker 的 ack，partition 的 leader 和 follower 全部落盘成功后才返回 ack。但是	如果在 follower 同步完成后，broker 发送 ack 之前，leader 发生故障，那么就会造成**数据重复**。

##### d) 故障处理

由于我们并不能保证 Kafka 集群中每时每刻 follower 的长度都和 leader 一致（即数据同步是有时延的），那么当           leader 挂掉选举某个 follower 为新的 leader 的时候（原先挂掉的 leader 恢复了成为了 follower），可能会出现  leader 的数据比 follower 还少的情况。为了解决这种数据量不一致带来的混乱情况，Kafka 提出了以下概念：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh46fmpty5j31eq0hudfw.jpg)

- LEO（Log End Offset）：指的是每个副本最后一个offset；
- HW（High Wather）：指的是消费者能见到的最大的 offset，ISR 队列中最小的 LEO。

消费者和 leader 通信时，只能消费 HW 之前的数据，HW 之后的数据对消费者不可见。

针对这个规则：

- **当follower发生故障时**：follower 发生故障后会被临时踢出 ISR，待该 follower 恢复后，follower 会读取本地磁盘记录的上次的 HW，并将 log 文件高于 HW 的部分截取掉，从 HW 开始向 leader 进行同步。等该 follower 的 LEO 大于等于该 Partition 的 HW，即 follower 追上 leader 之后，就可以重新加入 ISR 了。
- **当leader发生故障时**：leader 发生故障之后，会从 ISR 中选出一个新的 leader，之后，为保证多个副本之间的数据一致性，其余的 follower 会先将各自的 log 文件高于 HW 的部分截掉，然后从新的 leader 同步数据。

所以数据一致性并不能保证数据不丢失或者不重复，这是由 ack 控制的。HW 规则只能保证副本之间的数据一致性！



Kafka 的 ISR 的管理最终都会反馈到 ZooKeeper 节点上，具体位置为：

```
/brokers/topics/[topic]/partitions/[partition]/state
```

目前，有两个地方会对这个 ZooKeeper 的节点进行维护。

1. Controller 来维护：Kafka 集群中的其中一个 Broker 会被选举为 Controller，主要负责 Partition 管理和副本状态管理，也会执行类似于重分配 partition 之类的管理任务。在符合某些特定条件下，Controller 下的 LeaderSelector 会选举新的 leader，ISR 和新的 `leader_epoch` 及 `controller_epoch` 写入 ZooKeeper 的相关节点中。同时发起 LeaderAndIsrRequest 通知所有的 replicas。
2. leader 来维护：leader 有单独的线程定期检测 ISR 中 follower 是否脱离 ISR，如果发现 ISR 变化，则会将新的 ISR 的信息返回到 ZooKeeper 的相关节点中。



#### 2.5 Exactly Once语义

将服务器的 ACK 级别设置为 -1，可以保证 Producer 到 Server 之间不会丢失数据，即 At Least Once 语义。相对的，将服务器 ACK 级别设置为 0，可以保证生产者每条消息只会被发送一次，即 At Most Once语义。

**At Least Once 可以保证数据不丢失，但是不能保证数据不重复。相对的，At Most Once 可以保证数据不重复，但是不能保证数据不丢失**。但是，对于一些非常重要的信息，比如说交易数据，下游数据消费者要求数据既不重复也不丢失，即 Exactly Once 语义。在 0.11 版本以前的 Kafka，对此是无能为力的，只能保证数据不丢失，再在下游消费者对数据做全局去重。对于多个下游应用的情况，每个都需要单独做全局去重，这就对性能造成了很大的影响。

0.11 版本的 Kafka，引入了一项重大特性：**幂等性**。所谓的幂等性就是指 Producer 不论向 Server 发送多少次重复数据。Server 端都会只持久化一条，幂等性结合 At Least Once 语义，就构成了 Kafka 的 Exactily Once 语义，即： **<u>At Least Once + 幂等性 = Exactly Once</u>**

要启用幂等性，只需要将 Producer 的参数中 `enable.idompotence` 设置为 `true` 即可。Kafka 的幂等性实现其实就是将原来下游需要做的去重放在了数据上游。开启幂等性的 Producer 在初始化的时候会被分配一个 PID，发往同一 Partition 的消息会附带 Sequence Number。而 Broker 端会对 <PID,Partition,SeqNumber> 做缓存，当具有相同主键的消息提交时，Broker 只会持久化一条。

> 但是 PID 重启就会变化，同时不同的 Partition 也具有不同主键，所以幂等性无法保证跨分区会话的 Exactly Once。




### 三、Broker 保存消息

#### 3.1 存储方式 

物理上把 topic 分成一个或多个 patition（对应 server.properties 中的 num.partitions=3 配置），每个 patition 物理上对应一个文件夹（该文件夹存储该 patition 的所有消息和索引文件）。    

#### 3.2 存储策略 

无论消息是否被消费， kafka 都会保留所有消息。有两种策略可以删除旧数据： 

1. 基于时间： `log.retention.hours=168` 

2. 基于大小： `log.retention.bytes=1073741824` 需要注意的是，因为 Kafka 读取特定消息的时间复杂度为 $O(1)$，即与文件大小无关， 所以这里删除过期文件与提高 Kafka 性能无关。   



### 四、Kafka 消费过程 

**Kafka 消费者采用 pull 拉模式从 broker 中消费数据**。与之相对的 push（推）模式很难适应消费速率不同的消费者，因为消息发送速率是由 broker 决定的。它的目标是尽可能以最快速度传递消息，但是这样很容易造成 consumer 来不及处理消息。而 pull 模式则可以根据 consumer 的消费能力以适当的速率消费消息。

pull 模式不足之处是，如果 kafka 没有数据，消费者可能会陷入循环中，一直返回空数据。为了避免这种情况，我们在我们的拉请求中有参数，允许消费者请求在等待数据到达的“长轮询”中进行阻塞（并且可选地等待到给定的字节数，以确保大的传输大小，或者传入等待超时时间）。 

#### 4.1 消费者组

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh4aejp3muj31aq0om41k.jpg)

消费者是以 consumer group 消费者组的方式工作，由一个或者多个消费者组成一个组， 共同消费一个 topic。每个分区在同一时间只能由 group 中的一个消费者读取，但是多个 group 可以同时消费这个 partition。在图中，有一个由三个消费者组成的 group，有一个消费者读取主题中的两个分区，另外两个分别读取一个分区。某个消费者读取某个分区，也可以叫做某个消费者是某个分区的拥有者。

在这种情况下，消费者可以通过水平扩展的方式同时读取大量的消息。另外，如果一个消费者失败了，那么其他的 group 成员会自动负载均衡读取之前失败的消费者读取的分区。    

**消费者组最为重要的一个功能是实现广播与单播的功能**。一个消费者组可以确保其所订阅的 Topic 的每个分区只能被从属于该消费者组中的唯一一个消费者所消费；如果不同的消费者组订阅了同一个 Topic，那么这些消费者组之间是彼此独立的，不会受到相互的干扰。

> 如果我们希望一条消息可以被多个消费者所消费，那么可以将这些消费者放到不同的消费者组中，这实际上就是广播的效果；如果希望一条消息只能被一个消费者所消费，那么可以将这些消费者放到同一个消费者组中，这实际上就是单播的效果。 

#### 4.2 分区分配策略

一个 consumer group 中有多个 consumer，一个 topic 有多个 partition，所以必然会涉及到 partition 的分配问题，即确定哪个 partition 由哪个 consumer 来消费。

Kafka 有两种分配策略，一是 RoundRobin，一是 Range（新版本还有Sticky）。

##### RoundRobin

RoundRobin 即轮询的意思，比如现在有一个三个消费者 ConsumerA、ConsumerB 和 ConsumerC 组成的消费者组，同时消费 TopicA 主题消息，TopicA 分为 7 个分区，如果采用 RoundRobin 分配策略，过程如下所示：

![图片：mrbird.cc](https://tva1.sinaimg.cn/large/007S8ZIlly1gh47iuetprj31es0ko74s.jpg)

这种轮询的方式应该很好理解。但如果消费者组消费多个主题的多个分区，会发生什么情况呢？比如现在有一个两个消费者 ConsumerA 和 ConsumerB 组成的消费者组，同时消费 TopicA 和 TopicB 主题消息，如果采用RoundRobin 分配策略，过程如下所示：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh4avsimvoj31ey0ladgc.jpg)

> 注：TAP0 表示 TopicA Partition0 分区数据，以此类推。

这种情况下，采用 RoundRobin 算法分配，多个主题会被当做一个整体来看，这个整体包含了各自的 Partition，比如在 Kafka-clients 依赖中，与之对应的对象为 `TopicPartition`。接着将这些 `TopicPartition` 根据其哈希值进行排序，排序后采用轮询的方式分配给消费者。

但这会带来一个问题：假如上图中的消费者组中，ConsumerA 只订阅了 TopicA 主题，ConsumerB 只订阅了 TopicB 主题，采用 RoundRobin 轮询算法后，可能会出现 ConsumerA 消费了 TopicB 主题分区里的消息，ConsumerB 消费了 TopicA 主题分区里的消息。

综上所述，RoundRobin 算法只适用于消费者组中消费者订阅的主题相同的情况。同时会发现，采用 RoundRobin 算法，消费者组里的消费者之间消费的消息个数最多相差 1 个。

##### Range

Kafka 默认采用 Range 分配策略，Range 顾名思义就是按范围划分的意思。

比如现在有一个三个消费者 ConsumerA、ConsumerB 和 ConsumerC 组成的消费者组，同时消费 TopicA 主题消息，TopicA分为7个分区，如果采用 Range 分配策略，过程如下所示：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh47xvny6fj31eo0kot93.jpg)

假如现在有一个两个消费者 ConsumerA 和 ConsumerB 组成的消费者组，同时消费 TopicA 和 TopicB 主题消息，如果采用 Range 分配策略，过程如下所示：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh47xrhr61j31fa0lamxi.jpg)

Range 算法并不会把多个主题分区当成一个整体。

从上面的例子我们可以总结出Range算法的一个弊端：那就是同一个消费者组内的消费者消费的消息数量相差可能较大。

#### 4.3 offset 的维护

由于 consumer 在消费过程中可能会出现断电宕机等故障，consumer 恢复后，需要从故障前的位置继续消费，所以 consumer 需要实时记录自己消费到了哪个 offset，以便故障恢复后继续消费。

Kafka 0.9 版本之前，consumer 默认将 offset 保存在 Zookeeper 中，从 0.9 版本开始，consumer 默认将 offset保存在 Kafka 一个内置的 topic 中，该 topic 为 **_consumer_offsets**。

```shell
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic starfish --from-beginning
one
```

消费 topic 后，查看 kafka-logs 目录，会发现多出 50 个分区。

默认情况下__consumer_offsets 有 50 个分区，如果你的系统中 consumer group 也很多的话，那么这个命令的输出结果会很多，具体放置在哪个分区，根据 groupID 做如下计算得到：

```
Math.abs(groupID.hashCode()) % numPartitions
```

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh485ouy5aj31aq0u04qp.jpg)



#### 4.4 再均衡 Rebalance 

所谓的再平衡，指的是在 kafka consumer 所订阅的 topic 发生变化时发生的一种分区重分配机制。一般有三种情况会触发再平衡：

- consumer group 中的新增或删除某个 consumer，导致其所消费的分区需要分配到组内其他的 consumer上；
- consumer 订阅的 topic 发生变化，比如订阅的 topic 采用的是正则表达式的形式，如 `test-*` 此时如果有一个新建了一个topic `test-user`，那么这个 topic 的所有分区也是会自动分配给当前的 consumer 的，此时就会发生再平衡；
- consumer 所订阅的 topic 发生了新增分区的行为，那么新增的分区就会分配给当前的 consumer，此时就会触发再平衡。

Kafka 提供的再平衡策略主要有三种：`Round Robin`，`Range` 和 `Sticky`，默认使用的是 `Range`。这三种分配策略的主要区别在于：

- `Round Robin`：会采用轮询的方式将当前所有的分区依次分配给所有的 consumer；
- `Range`：首先会计算每个 consumer可以消费的分区个数，然后按照顺序将指定个数范围的分区分配给各个consumer；
- `Sticky`：这种分区策略是最新版本中新增的一种策略，其主要实现了两个目的：
  - 将现有的分区尽可能均衡的分配给各个 consumer，存在此目的的原因在于`Round Robin`和`Range`分配策略实际上都会导致某几个 consumer 承载过多的分区，从而导致消费压力不均衡；
  - 如果发生再平衡，那么重新分配之后在前一点的基础上会尽力保证当前未宕机的 consumer 所消费的分区不会被分配给其他的 consumer 上；

### 五、Kafka事务

Kafka 从 0.11 版本开始引入了事务支持。事务可以保证 Kafka 在 Exactly Once 语义的基础上，生产和消费可以跨分区和会话，要么全部成功，要么全部失败。

#### 5.1 Producer事务

为了了实现跨分区跨会话的事务，需要引入一个全局唯一的 TransactionID，并将 Producer 获得的 PID 和Transaction ID 绑定。这样当 Producer 重启后就可以通过正在进行的 TransactionID 获得原来的 PID。

为了管理 Transaction，Kafka 引入了一个新的组件 Transaction Coordinator。Producer 就是通过和 Transaction Coordinator 交互获得 Transaction ID 对应的任务状态。Transaction Coordinator 还负责将事务所有写入 Kafka 的一个内部 Topic，这样即使整个服务重启，由于事务状态得到保存，进行中的事务状态可以得到恢复，从而继续进行。

#### 5.2 Consumer事务

对 Consumer 而言，事务的保证就会相对较弱，尤其是无法保证 Commit 的消息被准确消费。这是由于Consumer 可以通过 offset 访问任意信息，而且不同的 SegmentFile 生命周期不同，同一事务的消息可能会出现重启后被删除的情况。



## 参考与来源：

- 尚硅谷Kafka教学

- 部分图片来源：mrbird.cc

- https://gitbook.cn/books/5ae1e77197c22f130e67ec4e/index.html