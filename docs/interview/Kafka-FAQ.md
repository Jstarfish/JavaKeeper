![Kafka Interview Questions](https://d2h0cx97tjks2p.cloudfront.net/blogs/wp-content/uploads/sites/2/2018/05/Kafka-Interview-Questions-3.jpg)

## 1、Kafka 都有哪些特点？

- 高吞吐量、低延迟：kafka每秒可以处理几十万条消息，它的延迟最低只有几毫秒，每个topic可以分多个partition, consumer group 对partition进行consume操作。
- 可扩展性：kafka集群支持热扩展
- 持久性、可靠性：消息被持久化到本地磁盘，并且支持数据备份防止数据丢失
- 容错性：允许集群中节点失败（若副本数量为n,则允许n-1个节点失败）
- 高并发：支持数千个客户端同时读写

## 2、请简述下你在哪些场景下会选择 Kafka？

- 日志收集：一个公司可以用Kafka可以收集各种服务的log，通过kafka以统一接口服务的方式开放给各种consumer，例如hadoop、HBase、Solr等。
- 消息系统：解耦生产者和消费者、缓存消息等。
- 用户活动跟踪：Kafka经常被用来记录web用户或者app用户的各种活动，如浏览网页、搜索、点击等活动，这些活动信息被各个服务器发布到kafka的topic中，然后订阅者通过订阅这些topic来做实时的监控分析，或者装载到hadoop、数据仓库中做离线分析和挖掘。
- 运营指标：Kafka也经常用来记录运营监控数据。包括收集各种分布式应用的数据，生产各种操作的集中反馈，比如报警和报告。
- 流式处理：比如spark streaming和 Flink

## 3、 Kafka 的设计架构你知道吗？

![图片：mrbird.cc](https://mrbird.cc/img/QQ20200324-210522@2x.png)


Kafka 架构分为以下几个部分

- Producer ：消息生产者，就是向 kafka broker 发消息的客户端。
- Consumer ：消息消费者，向 kafka broker 取消息的客户端。
- Topic ：可以理解为一个队列，一个 Topic 又分为一个或多个分区。
- Consumer Group：这是 kafka 用来实现一个 topic 消息的广播（发给所有的 consumer）和单播（发给任意一个 consumer）的手段。一个 topic 可以有多个 Consumer Group。
- Broker ：一台 kafka 服务器就是一个 broker。一个集群由多个 broker 组成。一个 broker 可以容纳多个 topic。
- Partition：为了实现扩展性，一个非常大的 topic 可以分布到多个 broker上，每个 partition 是一个有序的队列。partition 中的每条消息都会被分配一个有序的id（offset）。将消息发给 consumer，kafka 只保证按一个 partition 中的消息的顺序，不保证一个 topic 的整体（多个 partition 间）的顺序。
- Offset：kafka 的存储文件都是按照 offset.kafka 来命名，用 offset 做名字的好处是方便查找。例如你想找位于 2049 的位置，只要找到 2048.kafka 的文件即可。当然 the first offset 就是 00000000000.kafka。

## 4、Kafka 分区的目的？

分区对于 Kafka 集群的好处是：实现负载均衡。分区对于消费者来说，可以提高并发度，提高效率。

简而言之：**<mark>负载均衡+水平扩展</mark>**

Topic 只是逻辑概念，面向的是 producer 和 consumer；而 Partition 则是物理概念。可以想象，如果 Topic 不进行分区，而将 Topic 内的消息存储于一个 broker，那么关于该 Topic 的所有读写请求都将由这一个 broker 处理，吞吐量很容易陷入瓶颈，这显然是不符合高吞吐量应用场景的。有了 Partition 概念以后，假设一个 Topic 被分为 10 个 Partitions，Kafka 会根据一定的算法将 10 个 Partition 尽可能均匀的分布到不同的 broker（服务器）上，当 producer 发布消息时，producer 客户端可以采用 `random`、`key-hash` 及 `轮询` 等算法选定目标 partition，若不指定，Kafka 也将根据一定算法将其置于某一分区上。Partiton 机制可以极大的提高吞吐量，并且使得系统具备良好的水平扩展能力。



## 5、Kafka 高可靠性实现

谈及可靠性，最常规、最有效的策略就是 “副本（replication）机制” ，Kafka 实现高可靠性同样采用了该策略。

通过调节副本相关参数，可使 Kafka 在性能和可靠性之间取得平衡。

1. 文件存储方面：Kafka 中消息是以 topic 进行分类的，生产者通过 topic 向 Kafka broker 发送消息，消费者通过 topic 读取数据。然而 topic 在物理层面又能以 partition 为分组，一个 topic 可以分成若干个 partition。事实上，partition 并不是最终的存储粒度，partition 还可以细分为 segment，一个 partition 物理上由多个 segment 组成

2. 复制原理和同步方式：![enter image description here](https://images.gitbook.cn/f7aa23c0-cfab-11e8-9378-c501de8503c2)

![enter image description here](https://images.gitbook.cn/616acd70-cf9b-11e8-8388-bd48f25029c6)



## 5、你知道 Kafka 是如何做到消息的有序性？

kafka 中的每个 partition 中的消息在写入时都是有序的，而且单独一个 partition 只能由一个消费者去消费，可以在里面保证消息的顺序性。但是分区之间的消息是不保证有序的。

发送消息的时候，可以指定 partition 发送。



## kafka 全局一致性如何保证

两种方案：

方案一，kafka topic 只设置一个partition分区 

方案二，producer将消息发送到指定partition分区



## 7、请谈一谈 Kafka 数据一致性原理



一致性就是说不论是老的 Leader 还是新选举的 Leader，Consumer 都能读到一样的数据。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200817095840.png)

假设分区的副本为3，其中副本0是 Leader，副本1和副本2是 follower，并且在 ISR 列表里面。虽然副本0已经写入了 Message4，但是 Consumer 只能读取到 Message2。因为所有的 ISR 都同步了 Message2，只有 High Water Mark 以上的消息才支持 Consumer 读取，而 High Water Mark 取决于 ISR 列表里面偏移量最小的分区，对应于上图的副本2，这个很类似于**木桶原理**。

这样做的原因是还没有被足够多副本复制的消息被认为是“不安全”的，如果 Leader 发生崩溃，另一个副本成为新 Leader，那么这些消息很可能丢失了。如果我们允许消费者读取这些消息，可能就会破坏一致性。试想，一个消费者从当前 Leader（副本0） 读取并处理了 Message4，这个时候 Leader 挂掉了，选举了副本1为新的 Leader，这时候另一个消费者再去从新的 Leader 读取消息，发现这个消息其实并不存在，这就导致了数据不一致性问题。

当然，引入了 High Water Mark 机制，会导致 Broker 间的消息复制因为某些原因变慢，那么消息到达消费者的时间也会随之变长（因为我们会先等待消息复制完毕）。延迟时间可以通过参数 replica.lag.time.max.ms 参数配置，它指定了副本在复制消息时可被允许的最大延迟时间。

## 8、ISR、OSR、AR 是什么？

ISR：In-Sync Replicas 副本同步队列

OSR：Out-of-Sync Replicas

AR：Assigned Replicas 所有副本

ISR是由leader维护，follower从leader同步数据有一些延迟（具体可以参见 图文了解 Kafka 的副本复制机制），超过相应的阈值会把 follower 剔除出 ISR, 存入OSR（Out-of-Sync Replicas ）列表，新加入的follower也会先存放在OSR中。AR=ISR+OSR。

## 9、LEO、HW、LSO、LW等分别代表什么

- LEO：是 LogEndOffset 的简称，代表当前日志文件中下一条
- HW：水位或水印（watermark）一词，也可称为高水位(high watermark)，通常被用在流式处理领域（比如Apache Flink、Apache Spark等），以表征元素或事件在基于时间层面上的进度。在Kafka中，水位的概念反而与时间无关，而是与位置信息相关。严格来说，它表示的就是位置信息，即位移（offset）。取 partition 对应的 ISR中 最小的 LEO 作为 HW，consumer 最多只能消费到 HW 所在的位置上一条信息。
- LSO：是 LastStableOffset 的简称，对未完成的事务而言，LSO 的值等于事务中第一条消息的位置(firstUnstableOffset)，对已完成的事务而言，它的值同 HW 相同
- LW：Low Watermark 低水位, 代表 AR 集合中最小的 logStartOffset 值。

## 10、Kafka 在什么情况下会出现消息丢失？

Producer 往 Broker 发送消息的 acks 机制

## 11、怎么尽可能保证 Kafka 的可靠性

为保证 producer 发送的数据，能可靠地发送到指定的 topic，topic 的每个 partition 收到 producer 发送的数据后，都需要向 producer 发送 ack（acknowledge 确认收到），如果 producer 收到 ack，就会进行下一轮的发送，否则重新发送数据。

涉及到副本 ISR、故障处理中的 LEO、HW

## 12、消费者和消费者组有什么关系？

每个消费者从属于消费组。具体关系如下：

![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gh3htbkk8uj30d607074q.jpg)

## 13、Kafka 的每个分区只能被一个消费者线程，如何做到多个线程同时消费一个分区？



## 14、数据传输的事务有几种？

数据传输的事务定义通常有以下三种级别：

- 最多一次: 消息不会被重复发送，最多被传输一次，但也有可能一次不传输
- 最少一次: 消息不会被漏发送，最少被传输一次，但也有可能被重复传输.
- 精确的一次（Exactly once）: 不会漏传输也不会重复传输,每个消息都传输被

## 15、Kafka 消费者是否可以消费指定分区消息？

Kafa consumer消费消息时，向broker发出fetch请求去消费特定分区的消息，consumer指定消息在日志中的偏移量（offset），就可以消费从这个位置开始的消息，customer拥有了offset的控制权，可以向后回滚去重新消费之前的消息，这是很有意义的

## 16、Kafka消息是采用Pull模式，还是Push模式？

producer将消息推送到broker，consumer从broker拉取消息。



## 19、Kafka 高效文件存储设计特点

- Kafka把topic中一个parition大文件分成多个小文件段，通过多个小文件段，就容易定期清除或删除已经消费完文件，减少磁盘占用。
- 通过索引信息可以快速定位message和确定response的最大大小。
- 通过index元数据全部映射到memory，可以避免segment file的IO磁盘操作。
- 通过索引文件稀疏存储，可以大幅降低index文件元数据占用空间大小

## 20、Kafka创建Topic时如何将分区放置到不同的Broker中

- 副本因子不能大于 Broker 的个数；
- 第一个分区（编号为0）的第一个副本放置位置是随机从 `brokerList` 选择的；
- 其他分区的第一个副本放置位置相对于第0个分区依次往后移。也就是如果我们有5个 Broker，5个分区，假设第一个分区放在第四个 Broker 上，那么第二个分区将会放在第五个 Broker 上；第三个分区将会放在第一个 Broker 上；第四个分区将会放在第二个 Broker 上，依次类推；
- 剩余的副本相对于第一个副本放置位置其实是由 `nextReplicaShift` 决定的，而这个数也是随机产生的；



## 21、Kafka新建的分区会在哪个目录下创建

我们知道，在启动 Kafka 集群之前，我们需要配置好 `log.dirs` 参数，其值是 Kafka 数据的存放目录，这个参数可以配置多个目录，目录之间使用逗号分隔，通常这些目录是分布在不同的磁盘上用于提高读写性能。当然我们也可以配置 `log.dir` 参数，含义一样。只需要设置其中一个即可。

如果 `log.dirs` 参数只配置了一个目录，那么分配到各个 Broker 上的分区肯定只能在这个目录下创建文件夹用于存放数据。

但是如果 `log.dirs` 参数配置了多个目录，那么 Kafka 会在哪个文件夹中创建分区目录呢？答案是：Kafka 会在含有分区目录最少的文件夹中创建新的分区目录，分区目录名为 Topic名+分区ID。注意，是分区文件夹总数最少的目录，而不是磁盘使用量最少的目录！也就是说，如果你给 `log.dirs` 参数新增了一个新的磁盘，新的分区目录肯定是先在这个新的磁盘上创建直到这个新的磁盘目录拥有的分区目录不是最少为止。



## 22、谈一谈 Kafka 的再均衡

在Kafka中，当有新消费者加入或者订阅的topic数发生变化时，会触发Rebalance(再均衡：在同一个消费者组当中，分区的所有权从一个消费者转移到另外一个消费者)机制，Rebalance顾名思义就是重新均衡消费者消费。Rebalance的过程如下：

第一步：所有成员都向 coordinator 发送请求，请求入组。一旦所有成员都发送了请求，coordinator 会从中选择一个consumer担任leader的角色，并把组成员信息以及订阅信息发给leader。
第二步：leader开始分配消费方案，指明具体哪个consumer负责消费哪些topic的哪些partition。一旦完成分配，leader会将这个方案发给coordinator。coordinator接收到分配方案之后会把方案发给各个consumer，这样组内



## 22、Kafka 为什么能那么快 | Kafka高效读写数据的原因据的原因 | 吞吐量大的原因？

- partition 并行处理
- 顺序写磁盘，充分利用磁盘特性
- 利用了现代操作系统分页存储 Page Cache 来利用内存提高 I/O 效率
- 采用了零拷贝技术
  - Producer 生产的数据持久化到 broker，采用 mmap 文件映射，实现顺序的快速写入
  - Customer 从 broker 读取数据，采用 sendfile，将磁盘文件读到 OS 内核缓冲区后，转到 NIO buffer进行网络发送，减少 CPU 消耗



## 23、如何保证消息不被重复消费？

生产者在向Kafka写数据时，每条消息会有一个offset，表示消息写入顺序的序号。当消费者消费后，**每隔一段时间会把自己已消费消息的offset通过Zookeeper提交给Kafka**，告知Kafka自己offset的位置。这样一来，如果消费者重启，则会从Kafka记录的offset之后的数据开始消费，从而避免重复消费。

但是，可能出现一种意外情况。由于消费者提交offset是定期的，**当消费者处理了某些消息，但还未来及提交offset时，此时如果重启消费者，则会出现消息的重复消费**。



例：数据 1/2/3 依次进入 Kafka，Kafka 会给这三条数据每条分配一个 offset，代表这条数据的序号，假设分配的 offset 依次是 152/153/154。消费者从 Kafka 消费时，也是按照这个顺序去消费。假如**当消费者消费了 offset=153 的这条数据，刚准备去提交 offset 到 Zookeeper，此时消费者进程被重启了**。那么此时消费过的数据1和数据2的 offset 并没有提交，Kafka 也就不知道你已经消费了 `offset=153` 这条数据。此时当消费者重启后，消费者会找 Kafka 说，嘿，哥儿们，你给我接着把上次我消费到的那个地方后面的数据继续给我传递过来。由于之前的 offset 没有提交成功，那么数据1和数据2会再次传过来，如果此时消费者没有去重的话，那么就会导致重复消费。

![图片](http://prchen.com/2019/06/24/%E6%B6%88%E6%81%AF%E9%87%8D%E5%A4%8D%E6%B6%88%E8%B4%B9%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/1.png)

如上图，可能出现数据1和数据2插入数据库两遍的问题。

其实重复消费消息并不可怕，重要的是在发生重复消费后，如何**保证消息消费时的幂等性**。如果消费者可以在消费消息时先判断一下，自己是否已经消费了该消息，如果是就不消费，那么就可以保证系统的幂等性。

一条数据被消费者重复消费两次，但数据库中只有一条数据，这就保证了系统幂等性。

简单来说，**保证系统幂等性就是确保消息重复发送后数据库中数据的正确性**。

那么，如何保证消息队列的幂等性？

1. 向数据库insert数据时，先**根据主键查询，若数据存在则不insert，改为update**
2. 向Redis中写数据可以用**set去重，天然保证幂等性**
3. 生产者发送每条消息时，增加一个全局唯一id（类似订单id），消费者消费到时，先**根据这个id去Redis中查询是否消费过该消息**。如果没有消费过，就处理，将id写入Redis；如果消费过了，那么就不处理，保证不重复处理相同消息。
4. 基于数据库的**唯一键约束**来保证不会插入重复的数据，当消费者企图插入重复数据到数据库时，会报错。

![图片](http://prchen.com/2019/06/24/%E6%B6%88%E6%81%AF%E9%87%8D%E5%A4%8D%E6%B6%88%E8%B4%B9%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/2.png)

- Kafka采取类似**断点续传**的策略保证消息不被重复消费。具体是通过**每隔一段时间把已消费消息的offset通过Zookeeper提交给Kafka**实现的。
- 但是当消费者**处理完成但尚未提交offset**的时间段宕机或重启等意外情况发生时，还是可能出现消息被重复消费。
- 保证消息不被重复消费（保证消息消费时的幂等性）其实是保证数据库中数据的正确性。几种保证系统幂等性的思路：通过主键查询，若存在则update；Redis天然set去重；根据全局id查询，若已消费则不处理；唯一键约束保证不插入重复数据等。