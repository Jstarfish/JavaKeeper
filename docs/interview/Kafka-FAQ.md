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

简单架构如下

![](https://www.iteblog.com/pic/producer_consumer.png)

详细如下

![32 道常见的 Kafka 面试题你都会吗？附答案](https://www.iteblog.com/pic/kafka/kafka_arch-iteblog.png)


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

## 5、你知道 Kafka 是如何做到消息的有序性？

kafka 中的每个 partition 中的消息在写入时都是有序的，而且单独一个 partition 只能由一个消费者去消费，可以在里面保证消息的顺序性。但是分区之间的消息是不保证有序的。



## 7、请谈一谈 Kafka 数据一致性原理

一致性就是说不论是老的 Leader 还是新选举的 Leader，Consumer 都能读到一样的数据。

![](https://www.iteblog.com/pic/kafka/kafka_high_water_make-iteblog.png)

假设分区的副本为3，其中副本0是 Leader，副本1和副本2是 follower，并且在 ISR 列表里面。虽然副本0已经写入了 Message4，但是 Consumer 只能读取到 Message2。因为所有的 ISR 都同步了 Message2，只有 High Water Mark 以上的消息才支持 Consumer 读取，而 High Water Mark 取决于 ISR 列表里面偏移量最小的分区，对应于上图的副本2，这个很类似于木桶原理。

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

可以参见我这篇文章：[Kafka 是如何保证数据可靠性和一致性](https://www.iteblog.com/archives/2560.html)

## 11、怎么尽可能保证 Kafka 的可靠性

可以参见我这篇文章：[Kafka 是如何保证数据可靠性和一致性](https://www.iteblog.com/archives/2560.html)

## 12、消费者和消费者组有什么关系？

每个消费者从属于消费组。具体关系如下：

[![32 道常见的 Kafka 面试题你都会吗？附答案](https://www.iteblog.com/pic/kafka/consumer-groups.png)](https://www.iteblog.com/pic/kafka/consumer-groups.png)
如果想及时了解Spark、Hadoop或者HBase相关的文章，欢迎关注微信公众号：**iteblog_hadoop**

## 13、Kafka 的每个分区只能被一个消费者线程，如何做到多个线程同时消费一个分区？

参见我这篇文章：[Airbnb 是如何通过 balanced Kafka reader 来扩展 Spark streaming 实时流处理能力的](https://www.iteblog.com/archives/2551.html)

## 14、数据传输的事务有几种？

数据传输的事务定义通常有以下三种级别：

- 最多一次: 消息不会被重复发送，最多被传输一次，但也有可能一次不传输
- 最少一次: 消息不会被漏发送，最少被传输一次，但也有可能被重复传输.
- 精确的一次（Exactly once）: 不会漏传输也不会重复传输,每个消息都传输被

## 15、Kafka 消费者是否可以消费指定分区消息？

Kafa consumer消费消息时，向broker发出fetch请求去消费特定分区的消息，consumer指定消息在日志中的偏移量（offset），就可以消费从这个位置开始的消息，customer拥有了offset的控制权，可以向后回滚去重新消费之前的消息，这是很有意义的

## 16、Kafka消息是采用Pull模式，还是Push模式？

Kafka最初考虑的问题是，customer应该从brokes拉取消息还是brokers将消息推送到consumer，也就是pull还push。在这方面，Kafka遵循了一种大部分消息系统共同的传统的设计：producer将消息推送到broker，consumer从broker拉取消息。

一些消息系统比如Scribe和Apache Flume采用了push模式，将消息推送到下游的consumer。这样做有好处也有坏处：由broker决定消息推送的速率，对于不同消费速率的consumer就不太好处理了。消息系统都致力于让consumer以最大的速率最快速的消费消息，但不幸的是，push模式下，当broker推送的速率远大于consumer消费的速率时，consumer恐怕就要崩溃了。最终Kafka还是选取了传统的pull模式。
Pull模式的另外一个好处是consumer可以自主决定是否批量的从broker拉取数据。Push模式必须在不知道下游consumer消费能力和消费策略的情况下决定是立即推送每条消息还是缓存之后批量推送。如果为了避免consumer崩溃而采用较低的推送速率，将可能导致一次只推送较少的消息而造成浪费。Pull模式下，consumer就可以根据自己的消费能力去决定这些策略。
Pull有个缺点是，如果broker没有可供消费的消息，将导致consumer不断在循环中轮询，直到新消息到t达。为了避免这点，Kafka有个参数可以让consumer阻塞知道新消息到达(当然也可以阻塞知道消息的数量达到某个特定的量这样就可以批量发

## 17、Kafka 消息格式的演变清楚吗？

Kafka 的消息格式经过了四次大变化，具体可以参见我这篇文章：[Apache Kafka消息格式的演变(0.7.x~0.10.x)](https://www.iteblog.com/archives/2232.html)。

## 18、Kafka 偏移量的演变清楚吗？

参见我这篇文章：[图解Apache Kafka消息偏移量的演变(0.7.x~0.10.x)](https://www.iteblog.com/archives/2235.html)

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

具体可以参见[Kafka创建Topic时如何将分区放置到不同的Broker中](https://www.iteblog.com/archives/2219.html)。

## 21、Kafka新建的分区会在哪个目录下创建

我们知道，在启动 Kafka 集群之前，我们需要配置好 `log.dirs` 参数，其值是 Kafka 数据的存放目录，这个参数可以配置多个目录，目录之间使用逗号分隔，通常这些目录是分布在不同的磁盘上用于提高读写性能。当然我们也可以配置 `log.dir` 参数，含义一样。只需要设置其中一个即可。

如果 `log.dirs` 参数只配置了一个目录，那么分配到各个 Broker 上的分区肯定只能在这个目录下创建文件夹用于存放数据。

但是如果 `log.dirs` 参数配置了多个目录，那么 Kafka 会在哪个文件夹中创建分区目录呢？答案是：Kafka 会在含有分区目录最少的文件夹中创建新的分区目录，分区目录名为 Topic名+分区ID。注意，是分区文件夹总数最少的目录，而不是磁盘使用量最少的目录！也就是说，如果你给 `log.dirs` 参数新增了一个新的磁盘，新的分区目录肯定是先在这个新的磁盘上创建直到这个新的磁盘目录拥有的分区目录不是最少为止。

具体可以参见我博客：[Kafka新建的分区会在哪个目录下创建](https://www.iteblog.com/archives/2231.html)

## 22、谈一谈 Kafka 的再均衡

在Kafka中，当有新消费者加入或者订阅的topic数发生变化时，会触发Rebalance(再均衡：在同一个消费者组当中，分区的所有权从一个消费者转移到另外一个消费者)机制，Rebalance顾名思义就是重新均衡消费者消费。Rebalance的过程如下：

第一步：所有成员都向coordinator发送请求，请求入组。一旦所有成员都发送了请求，coordinator会从中选择一个consumer担任leader的角色，并把组成员信息以及订阅信息发给leader。
第二步：leader开始分配消费方案，指明具体哪个consumer负责消费哪些topic的哪些partition。一旦完成分配，leader会将这个方案发给coordinator。coordinator接收到分配方案之后会把方案发给各个consumer，这样组内的所有成员就都知道自己应该消费哪些分区了。
所以对于Rebalance来说，Coordinator起着至关重要的作用

## 23、谈谈 Kafka 分区分配策略

参见我这篇文章 [Kafka分区分配策略(Partition Assignment Strategy)](https://www.iteblog.com/archives/2209.html)

## 24、Kafka Producer 是如何动态感知主题分区数变化的？

参见我这篇文章：[Kafka Producer是如何动态感知Topic分区数变化](https://www.iteblog.com/archives/1618.html)

## 25、 Kafka 是如何实现高吞吐率的？

Kafka是分布式消息系统，需要处理海量的消息，Kafka的设计是把所有的消息都写入速度低容量大的硬盘，以此来换取更强的存储能力，但实际上，使用硬盘并没有带来过多的性能损失。kafka主要使用了以下几个方式实现了超高的吞吐率：

- 顺序读写；
- 零拷贝
- 文件分段
- 批量发送
- 数据压缩。

具体参见：[Kafka是如何实现高吞吐率的](https://www.iteblog.com/redirect.php?url=aHR0cHM6Ly9tcC53ZWl4aW4ucXEuY29tL3MvYi1URU9ibmZqLWw4cTRpZDFzZXBjdw==&article=true)

## 26、Kafka 监控都有哪些？

参见我另外几篇文章：[Apache Kafka监控之KafkaOffsetMonitor](https://www.iteblog.com/archives/1083.html)
[雅虎开源的Kafka集群管理器(Kafka Manager)](https://www.iteblog.com/archives/1264.html)
[Apache Kafka监控之Kafka Web Console](https://www.iteblog.com/archives/1084.html)
还有 JMX

## 27、如何为Kafka集群选择合适的Topics/Partitions数量

参见我另外几篇文章：[如何为Kafka集群选择合适的Topics/Partitions数量](https://www.iteblog.com/archives/1805.html)

## 28、谈谈你对 Kafka 事务的了解？

参见这篇文章：http://www.jasongj.com/kafka/transaction/