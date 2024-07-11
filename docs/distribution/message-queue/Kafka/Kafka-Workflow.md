---
title: Kafka 工作流程和存储机制分析
date: 2023-02-15
tags: 
 - Kafka
categories: Kafka
---

![](https://img.starfish.ink/mq/kafka-workflow.jpg)



## Kafka 架构

![overview-of-kafka-architecture](https://images.ctfassets.net/gt6dp23g0g38/4DA2zHan28tYNAV2c9Vd98/b9fca38c23e2b2d16a4c4de04ea6dd3f/Kafka_Internals_004.png)

Kafka 是一个数据流处理系统，它允许开发者实时地对新发生的事件做出反应。

Kafka 的架构由存储层和计算层组成。

存储层被设计为高效地存储数据，并且是一个分布式系统，这意味着如果你的存储需求随时间增长，你可以轻松地扩展系统以适应增长。

计算层由四个核心组件构成：

1. **生产者（Producer）API**：
   - 生产者 API 允许开发者将数据发送到 Kafka 主题。
2. **消费者（Consumer）API**：
   - 消费者 API 允许开发者从 Kafka 主题接收数据流。
3. **流（Streams）API**：
   - 流 API 提供了构建和运行流处理应用程序的能力，可以对数据进行复杂的转换和处理。
4. **连接器（Connector）API**：
   - 连接器 API 允许开发者将 Kafka 与外部系统如数据库连接起来，实现数据的自动导入和导出。





Kafka 官方定义是一个流处理系统，用于处理事件流（Event Stream），事件是对发生的某事的记录，同时提供了关于所发生事情的信息。

Kafka 记录（Kafka Record）是 Kafka 中传输和存储的基本单元。每条记录包含以下内容：

- **主题（Topic）**：记录所属的主题。
- **分区（Partition）**：记录存储的分区。
- **偏移量（Offset）**：记录在分区中的位置。
- **时间戳（Timestamp）**：记录的时间戳。
- **键（Key）**：可选，用于分区策略。
- **值（Value）**：实际的数据内容。
- **头部（Headers）**：可选的元数据，用于附加信息。

![](/Users/starfish/oceanus/picBed/kafka/kafka-event-stream.png)







### Record Schema

In Kafka, the key and value are stored as byte arrays which means that clients can work with any type of data that can be serialized to bytes. A popular format among Kafka users is Avro, which is also supported by Confluent Schema Registry.

When integrated with Schema Registry, the first byte of an event will be a magic byte which signifies that this event is using a schema in the Schema Registry. The next four bytes make up the schema ID that can be used to retrieve the schema from the registry, and the rest of the bytes contain the event itself. Schema Registry also supports Protobuf and JSON schema formats.

![inline-pic-schema](https://images.ctfassets.net/gt6dp23g0g38/33K4H01OUsnYyR7z4dzRkj/d07131ca9752ba363792844e887c7f48/Kafka_Internals_006.png)



### Topics

**Kafka 中消息是以 topic 进行分类的**，生产者生产消息，消费者消费消息，都是面向 topic 的。

在 Kafka 中，一个核心概念是主题（Topic）。主题是事件的仅追加（append-only）且不可变的日志。通常，相同类型或以某种方式相关的事件会被放入同一个主题中。Kafka 生产者将事件写入主题，而 Kafka 消费者从主题中读取事件。

![inline-pic-topic](https://images.ctfassets.net/gt6dp23g0g38/J2Y8oV2hoVWLv8u7sJ2v6/271fa3dde5d47e3a5980ad51fdd8b331/Kafka_Internals_007.png)



### Topic 分区

![inline-pic-partition-2](https://images.ctfassets.net/gt6dp23g0g38/ODHQiu10QMZJ4bBbeQcvG/024159856d3361aaac482da28979acf6/Kafka_Internals_009.png)

为了在 Kafka 中分配事件的存储和处理，Kafka 使用了分区的概念。一个主题由一个或多个分区组成，这些分区可以位于 Kafka 集群的不同节点上。

分区是 Kafka 事件存储的主要单元，尽管我们将在后面讨论的分层存储中，一些事件存储会从分区中移出。分区也是并行性的主要单元。事件可以通过同时写入多个分区来并行地生产到主题中。同样，消费者可以通过不同的消费者实例从不同的分区中读取来分散他们的工作负载。如果我们只使用一个分区，我们将只能有效地使用一个消费者实例。

在分区内部，每个事件都被赋予一个称为偏移量（offset）的唯一标识符。随着事件的添加，给定分区的偏移量将持续增长，而且偏移量从不重复使用。在 Kafka 中，偏移量有多种用途，其中包括消费者跟踪已处理的事件。





Kafka 将数据和元数据分别管理，这种设计有助于提高系统的灵活性和可扩展性。以下是 Kafka 如何分别管理数据和元数据的一些关键点：

1. **数据管理**：
   - Kafka 的数据层主要负责存储实际的消息事件。数据通常存储在主题（Topics）中，并且可以分布在多个分区（Partitions）上以实现并行处理和扩展性。
2. **元数据管理**：
   - 元数据包括关于 Kafka 集群的配置信息、主题的分区信息、副本（Replicas）的分配、消费者组（Consumer Groups）的状态等。这些信息通常由 Kafka 的控制平面（Control Plane）管理。
3. **Zookeeper 的使用**：
   - 在早期版本的 Kafka 中，Zookeeper 被用来存储和管理元数据。Zookeeper 作为一个协调服务，处理集群管理任务，如领导者选举、节点注册、负载均衡等。
4. **Kafka 自身管理元数据**：
   - 从 Kafka 2.8.0 版本开始，Kafka 引入了 KRaft（Kafka Raft Metadata）模式，允许 Kafka 自身管理元数据，而不再依赖 Zookeeper。
5. **KRaft 协议**：
   - KRaft 协议是 Kafka 用来处理元数据管理的共识协议，它借鉴了 Raft 算法来确保元数据的一致性和高可用性。
6. **元数据的持久化**：
   - Kafka 将元数据持久化存储在本地文件系统中，例如，主题配置信息存储在 `meta.properties` 文件中。
7. **控制平面和数据平面的分离**：
   - Kafka 的控制平面负责管理元数据和集群协调，而数据平面负责实际的消息存储和传输。这种分离允许 Kafka 更好地扩展和优化性能。
8. **动态更新元数据**：
   - Kafka 允许动态地更新元数据，如增加分区、修改副本因子等，而无需停止服务。
9. **元数据的高可用性**：
   - Kafka 的元数据管理设计确保了元数据的高可用性，即使在某些节点或组件失败的情况下，集群仍然可以正常运行。

通过分别管理数据和元数据，Kafka 能够提供更好的性能、灵活性和可维护性，同时也为复杂的分布式系统提供了强大的支持。







Kafka 将每个 Topic 划分为多个分区（Partition），每个分区在磁盘上对应一个日志文件（Log）。为了管理这些日志文件，Kafka 将每个分区的日志文件进一步分为多个段（Segment）。每个段包含一段时间内的消息，并且有两个文件：一个数据文件和一个索引文件。

- **数据文件**：存储实际的消息内容，文件扩展名为 `.log`。
- **索引文件**：存储消息的偏移量和物理位置，用于快速定位消息，文件扩展名为 `.index`。

![](/Users/starfish/oceanus/picBed/kafka/kafka-topic.png)

**topic 是逻辑上的概念，而 patition 是物理上的概念**，每个 patition 对应一个 log 文件，而 log 文件中存储的就是 producer 生产的数据，patition 生产的数据会被不断的添加到 log 文件的末端，且每条数据都有自己的 offset。

消费组中的每个消费者，都是实时记录自己消费到哪个 offset，以便出错恢复，从上次的位置继续消费。



### Kafka 为什么要将 Topic 进行分区？

答：负载均衡+水平扩展

Topic 只是逻辑概念，面向的是 producer 和 consumer；而 Partition 则是物理概念。可以想象，如果 Topic 不进行分区，而将 Topic 内的消息存储于一个 broker，那么关于该 Topic 的所有读写请求都将由这一个 broker 处理，吞吐量很容易陷入瓶颈，这显然是不符合高吞吐量应用场景的。有了 Partition 概念以后，假设一个 Topic 被分为 10 个 Partitions，Kafka 会根据一定的算法将 10 个 Partition 尽可能均匀的分布到不同的 broker（服务器）上，当 producer 发布消息时，producer 客户端可以采用 `random`、`key-hash` 及 `轮询` 等算法选定目标 partition，若不指定，Kafka 也将根据一定算法将其置于某一分区上。Partiton 机制可以极大的提高吞吐量，并且使得系统具备良好的水平扩展能力。

在创建 topic 时可以在 `$KAFKA_HOME/config/server.properties` 中指定这个 partition 的数量（如下所示），当然可以在 topic 创建之后去修改 partition 的数量。

```properties
# The default number of log partitions per topic. More partitions allow greater
# parallelism for consumption, but this will also result in more files across
# the brokers.
num.partitions=3
```

在发送一条消息时，可以指定这个消息的 key，producer 根据这个 key 和 partition 机制来判断这个消息发送到哪个 partition。partition 机制可以通过指定 producer 的 partition.class 这一参数来指定（即支持自定义），该 class 必须实现 kafka.producer.Partitioner 接口。



## 三、Broker 保存消息

Kafka 集群中的功能分为数据平面和控制平面。控制平面负责管理集群中的所有元数据。数据平面处理我们写入和读取 Kafka 的实际数据。

![kafka-manages-data-and-metadata-separately](https://images.ctfassets.net/gt6dp23g0g38/6dIHZmyFufygLqoOZl9NK8/568033253444bede095afcea83924c44/Kafka_Internals_015.png)



broker 内部

![inside-the-apache-kafka-broker](https://images.ctfassets.net/gt6dp23g0g38/39R8M25VXtbor8PP0Uv5Zh/1ed96b8c15b8c8ddf81f1e0ab02e5b77/Kafka_Internals_016.png)

### 客户端请求的两种类型：生产请求和获取请求

客户端请求分为两类：生产请求和获取请求。生产请求是请求将一批数据写入指定的主题。获取请求是请求从 Kafka 主题中获取数据。这两种请求都经历许多相同的步骤。我们将首先了解生产请求的流程，然后再看看获取请求有何不同。

#### 生产请求流程

1. **记录分区**：生产者使用分区器决定数据写入哪个分区。
2. **批次积累**：为了提高效率，生产者会将数据累积到批次中。
3. **发送请求**：当批次满足时间或大小要求时，生产者将数据批次发送给分区的 Leader Broker。
4. **确认机制**：生产者根据配置的确认机制（acks）等待 Broker 的响应。

#### 获取请求流程

1. **发送获取请求**：消费者指定主题、分区和偏移量，发送获取请求。
2. **请求处理**：获取请求进入 Broker 的网络线程，被放入请求队列。
3. **数据读取**：I/O 线程根据请求中的偏移量从日志文件中读取数据。
4. **批量响应**：为了提高效率，消费者可以配置等待最小数据量或最大等待时间来返回响应。 



#### 3.1 存储方式 

物理上把 topic 分成一个或多个 partition（对应 server.properties 中的 num.partitions=3 配置），每个 partition 物理上对应一个文件夹（该文件夹存储该 patition 的所有消息和索引文件）。   

![kafka-physical-storage](https://images.ctfassets.net/gt6dp23g0g38/6BStOsjiQRncUJUEXIeo1s/a38554930ab928132ec2244d53efa149/Kafka_Internals_022.png) 

#### 3.2 存储策略 

无论消息是否被消费， kafka 都会保留所有消息。有两种策略可以删除旧数据： 

1. 基于时间： `log.retention.hours=168` 

2. 基于大小： `log.retention.bytes=1073741824` 需要注意的是，因为 Kafka 读取特定消息的时间复杂度为 $O(1)$，即与文件大小无关， 所以这里删除过期文件与提高 Kafka 性能无关。   





## Kafka Data Replication

In this module we’ll look at how the data plane handles data replication. Data replication is a critical feature of Kafka that allows it to provide high durability and availability. We enable replication at the topic level. When a new topic is created we can specify, explicitly or through defaults, how many replicas we want. Then each partition of that topic will be replicated that many times. This number is referred to as the replication factor. With a replication factor of N, in general, we can tolerate N-1 failures, without data loss, and while maintaining availability.

数据平面如何处理数据复制。数据复制是 Kafka 的一个关键特性，它允许 Kafka 提供高持久性和可用性。我们在主题级别启用复制。当创建新主题时，我们可以明确指定或通过默认设置来指定我们想要的副本数量。然后，该主题的每个分区将被复制指定的次数。这个数字被称为复制因子。使用 N 作为复制因子，通常我们可以容忍 N-1 次故障，而不会丢失数据，同时保持可用性。

### Leader, Follower, and In-Sync Replica (ISR) List

![leader-follower-isr-list](https://images.ctfassets.net/gt6dp23g0g38/4Llth82ZvCCBqcHfp7v0lH/60e6f507fdccce263d38b6d285e6b143/Kafka_Internals_030.png)

一旦主题的所有分区副本被创建，每个分区的一个副本将被指定为领导者副本，持有该副本的代理将成为该分区的领导者。其余的副本将是追随者。生产者将写入领导者副本，追随者将获取数据以与领导者保持同步。消费者通常也从领导者副本获取数据，但它们可以配置为从追随者获取。

分区领导者以及所有与领导者同步的追随者将构成同步副本集（ISR）。在理想情况下，所有副本都将是 ISR 的一部分。

> Once the replicas for all the partitions in a topic are created, one replica of each partition will be designated as the leader replica and the broker that holds that replica will be the leader for that partition. The remaining replicas will be followers. Producers will write to the leader replica and the followers will fetch the data in order to keep in sync with the leader. Consumers also, generally, fetch from the leader replica, but they can be configured to fetch from followers.
>
> The partition leader, along with all of the followers that have caught up with the leader, will be part of the in-sync replica set (ISR). In the ideal situation, all of the replicas will be part of the ISR.

### Leader Epoch

![leader-epoch](https://images.ctfassets.net/gt6dp23g0g38/1rHc9oqwn8DD94JIQckrXL/a36399e2acc2437810ddaa8a568307ca/Kafka_Internals_031.png)

每个领导者都与一个独特的、单调递增的数字相关联，称为领导者纪元。纪元用于跟踪当这个副本是领导者时完成的工作，每当选出新领导者时，纪元会增加。领导者纪元对于诸如日志协调等事项非常重要，我们很快就会讨论。

> Each leader is associated with a unique, monotonically increasing number called the leader epoch. The epoch is used to keep track of what work was done while this replica was the leader and it will be increased whenever a new leader is elected. The leader epoch is very important for things like log reconciliation, which we’ll discuss shortly.

### Follower Fetch Request

![follower-fetch-request](https://images.ctfassets.net/gt6dp23g0g38/QMNcHw9rAoiFGXj4DnP9I/51ef0ec74b91b1f01a88f8fa3934b2f0/Kafka_Internals_032.png)

每当领导者将其本地日志中的新数据附加时，追随者将向领导者发出获取请求，传入他们需要开始获取的偏移量。

> Whenever the leader appends new data into its local log, the followers will issue a fetch request to the leader, passing in the offset at which they need to begin fetching.

### Follower Fetch Response

![follower-fetch-response](https://images.ctfassets.net/gt6dp23g0g38/7kr6K36N4VF4D5F3gpY71h/10329b5e4b700afdb1aa28a46432fd44/Kafka_Internals_033.png)

领导者将从指定偏移量开始的记录响应获取请求。获取响应还将包括每个记录的偏移量和当前领导者纪元。追随者然后将这些记录附加到他们自己的本地日志中

> The leader will respond to the fetch request with the records starting at the specified offset. The fetch response will also include the offset for each record and the current leader epoch. The followers will then append those records to their own local logs.

### Committing Partition Offsets

![committing-partition-offsets](https://images.ctfassets.net/gt6dp23g0g38/7ADIKF2poAYD0iE1p1hJNF/eff71842eed8637f50d888e27f962343/Kafka_Internals_034.png)

一旦 ISR 中的所有追随者都获取到了特定的偏移量，到该偏移量为止的记录就被认为是已提交的，并且对消费者可用。这由高水位线指定。

领导者通过获取请求中发送的偏移值了解追随者获取的最高偏移量。例如，如果追随者向领导者发送一个获取请求，指定偏移量为 3，领导者知道这个追随者已经提交了所有到偏移量 3 的记录。一旦所有追随者都达到了偏移量 3，领导者将相应地推进高水位线。

> Once all of the followers in the ISR have fetched up to a particular offset, the records up to that offset are considered committed and are available for consumers. This is designated by the high watermark.

> The leader is made aware of the highest offset fetched by the followers through the offset value sent in the fetch requests. For example, if a follower sends a fetch request to the leader that specifies offset 3, the leader knows that this follower has committed all records up to offset 3. Once all of the followers have reached offset 3, the leader will advance the high watermark accordingly.

### Advancing the Follower High Watermark

![advancing-the-follower-high-watermark](https://images.ctfassets.net/gt6dp23g0g38/2GtWQTnR5GwuDaUltAxEHM/50dd8e261231d98af4dcae5fc57bc41e/Kafka_Internals_035.png)

反过来，领导者使用获取响应来通知追随者当前的高水位线。由于这个过程是异步的，追随者的高水位线通常会落后于领导者实际持有的高水位线。

> The leader, in turn, uses the fetch response to inform followers of the current high watermark. Because this process is asynchronous, the followers’ high watermark will typically lag behind the actual high watermark held by the leader.

### Handling Leader Failure

![handling-leader-failure](https://images.ctfassets.net/gt6dp23g0g38/4gmUY2HRzEEgtWX4aYO5RK/92c1cd987a80a083e0903ab21bb7a6e6/Kafka_Internals_036.png)

如果领导者失败，或者由于其他原因我们需要选择一个新的领导者，ISR 中的一个代理将被选为新的领导者。领导者选举和通知受影响的追随者的过程由控制平面处理。数据平面重要的是在这个过程中没有数据丢失。这就是为什么新的领导者只能从 ISR 中选择，除非主题特别配置为允许选择不同步的副本。我们知道 ISR 中的所有副本都与最新的提交偏移量保持最新。

一旦选出新领导者，领导者纪元将增加，新领导者将开始接受生产请求。

> If a leader fails, or if for some other reason we need to choose a new leader, one of the brokers in the ISR will be chosen as the new leader. The process of leader election and notification of affected followers is handled by the control plane. The important thing for the data plane is that no data is lost in the process. That is why a new leader can only be selected from the ISR, unless the topic has been specifically configured to allow replicas that are not in sync to be selected. We know that all of the replicas in the ISR are up to date with the latest committed offset.

Once a new leader is elected, the leader epoch will be incremented and the new leader will begin accepting produce requests.

### Temporary Decreased High Watermark

![temporary-decreased-high-watermark](https://images.ctfassets.net/gt6dp23g0g38/Kr5GipOTKKo9KojdSmREF/a230a16ec35d8887e91cff2ddeb29e00/Kafka_Internals_037.png)

当新领导者当选时，其高水位线可能小于实际的高水位线。如果发生这种情况，任何偏移量在当前领导者的高水位线和实际高水位线之间的获取请求将触发可重试的 OFFSET_NOT_AVAILABLE 错误。消费者将继续尝试获取，直到高水位线更新，此时处理将正常继续。

> When a new leader is elected, its high watermark could be less than the actual high watermark. If this happens, any fetch requests for an offset that is between the current leader’s high watermark and the actual will trigger a retriable OFFSET_NOT_AVAILABLE error. The consumer will continue trying to fetch until the high watermark is updated, at which point processing will continue as normal.

### Partition Replica Reconciliation

![partition-replica-reconciliation](https://images.ctfassets.net/gt6dp23g0g38/1MCX2GxiBgktyO7kPgSBGu/f0e8800cd5c4d66ec23243795b5597f5/Kafka_Internals_038.png)

在新领导者选举后立即，一些副本可能有未提交的记录与新领导者不同步。这就是为什么领导者的高水位线还不是当前的。它不能是，直到它知道每个追随者已经赶上到哪个偏移量。我们不能前进，直到这个问题得到解决。这是通过一个称为副本协调的过程完成的。协调的第一步是在不同步的追随者发送获取请求时开始的。在我们的示例中，请求显示追随者正在获取的偏移量高于其当前纪元的高水位线。

> Immediately after a new leader election, it is possible that some replicas may have uncommitted records that are out of sync with the new leader. This is why the leader's high watermark is not current yet. It can’t be until it knows the offset that each follower has caught up to. We can’t move forward until this is resolved. This is done through a process called replica reconciliation. The first step in reconciliation begins when the out-of-sync follower sends a fetch request. In our example, the request shows that the follower is fetching an offset that is higher than the high watermark for its current epoch.

### Fetch Response Informs Follower of Divergence

![partition-replica-reconciliation](https://images.ctfassets.net/gt6dp23g0g38/1MCX2GxiBgktyO7kPgSBGu/1087c6850f64d0e30a86f97f8ac6f77a/Kafka_Internals_039.png)

当领导者收到获取请求时，它将检查自己的日志，并确定所请求的偏移量对于该纪元无效。然后，它将向追随者发送响应，告诉它该纪元应该以哪个偏移量结束。领导者让追随者执行清理工作。

> When the leader receives the fetch request it will check it against its own log and determine that the offset being requested is not valid for that epoch. It will then send a response to the follower telling it what offset that epoch should end at. The leader leaves it to the follower to perform the cleanup.

### Follower Truncates Log to Match Leader Log

![follower-truncates-log-to-match-leader-log](https://images.ctfassets.net/gt6dp23g0g38/2SLCk6ccSIlkvPjrKq2YCi/492556be995fa402bd06e20cc24a6964/Kafka_Internals_040.png)

追随者将使用获取响应中的信息来截断多余的数据，以便与领导者同步。

The follower will use the information in the fetch response to truncate the extraneous data so that it will be in sync with the leader.

### Subsequent Fetch with Updated Offset and Epoch

![subsequent-fetch-with-updated-offset-and-epoch](https://images.ctfassets.net/gt6dp23g0g38/aYcacWtuT1gnS6RCQRxaa/5b2760f264a6fd99b29c16a03d030b03/Kafka_Internals_041.png)

现在，追随者可以再次发送获取请求，但这次使用正确的偏移量。

Now the follower can send that fetch request again, but this time with the correct offset.

### Follower 102 Reconciled

![follower-102-reconciled](https://images.ctfassets.net/gt6dp23g0g38/5rtqIUVT29SGB5vharEdcE/ed09090d7e99d57752e001dfc8758d56/Kafka_Internals_042.png)

然后，领导者将响应从该偏移量开始的新记录，包括新的领导者纪元。

The leader will then respond with the new records since that offset includes the new leader epoch.

### Follower 102 Acknowledges New Records

![follower-102-acknowledges-new-records](https://images.ctfassets.net/gt6dp23g0g38/10rKaHrv3sJxZ9CxmYwL9w/b3a8d28f7b99a4b8cee79fe9a1b7697e/Kafka_Internals_043.png)

当追随者再次获取时，它传递的偏移量将告知领导者它已经赶上，领导者将能够增加高水位线。此时，领导者和追随者已完全协调，但我们仍然处于副本不足的状态，因为并非所有副本都在 ISR 中。根据配置，我们可以在此状态下操作，但这当然不理想。

When the follower fetches again, the offset that it passes will inform the leader that it has caught up and the leader will be able to increase the high watermark. At this point the leader and follower are fully reconciled, but we are still in an under replicated state because not all of the replicas are in the ISR. Depending on configuration, we can operate in this state, but it’s certainly not ideal.

### Follower 101 Rejoins the Cluster

![follower-101-rejoins-the-cluster](https://images.ctfassets.net/gt6dp23g0g38/slWIzdKdFUuiEwK1BAG4E/cd88e602396e4bcdacad99487ea4387f/Kafka_Internals_044.png)

过一段时间，希望不久，失败的副本代理将重新上线。然后，它将经历我们刚刚描述的相同协调过程。一旦完成协调并赶上新领导者，它将被重新添加到 ISR，我们将回到快乐的地方。

At some point, hopefully soon, the failed replica broker will come back online. It will then go through the same reconciliation process that we just described. Once it is done reconciling and is caught up with the new leader, it will be added back to the ISR and we will be back in our happy place.

### Handling Failed or Slow Followers

![handling-failed-or-slow-followers](https://images.ctfassets.net/gt6dp23g0g38/1T8pQOyW8YcUj64phgAYW5/c550c246504f246faab3f172f2f073a0/Kafka_Internals_045.png)

显然，当领导者失败时，这是一个更大的问题，但我们也需要处理追随者失败以及运行缓慢的追随者。领导者监视其追随者的进度。如果自追随者上次完全赶上以来，经过了可配置的时间量，领导者将从同步副本集中移除该追随者。这允许领导者推进高水位线，以便消费者可以继续消费当前数据。如果追随者重新上线或以其他方式赶上领导者，那么它将被重新添加到 ISR。

Obviously when a leader fails, it’s a bigger deal, but we also need to handle follower failures as well as followers that are running slow. The leader monitors the progress of its followers. If a configurable amount of time elapses since a follower was last fully caught up, the leader will remove that follower from the in-sync replica set. This allows the leader to advance the high watermark so that consumers can continue consuming current data. If the follower comes back online or otherwise gets its act together and catches up to the leader, then it will be added back to the ISR.

### Partition Leader Balancing

![partition-leader-balancing](https://images.ctfassets.net/gt6dp23g0g38/6P0oOJdQ8gJkU0ib014amg/3074980c72714d158fea435866283388/Kafka_Internals_046.png)

正如我们所看到的，包含领导者副本的代理比追随者副本做了更多的工作。因此，最好不要在单个代理上拥有不成比例的领导者副本数量。为了防止这种情况，Kafka 有首选副本的概念。创建主题时，每个分区的第一个副本被指定为首选副本。由于 Kafka 已经努力在可用代理之间均匀分配分区，这将通常导致领导者的良好平衡。

由于各种原因进行领导者选举时，领导者可能会出现在非首选副本上，这可能导致不平衡。因此，Kafka 会定期检查领导者副本是否不平衡。它使用可配置的阈值来确定这一点。如果确实发现不平衡，它将执行领导者重新平衡，以使领导者回到其首选副本上。

As we’ve seen, the broker containing the leader replica does a bit more work than the follower replicas. Because of this it’s best not to have a disproportionate number of leader replicas on a single broker. To prevent this Kafka has the concept of a preferred replica. When a topic is created, the first replica for each partition is designated as the preferred replica. Since Kafka is already making an effort to evenly distribute partitions across the available brokers, this will usually result in a good balance of leaders.

As leader elections occur for various reasons, the leaders might end up on non-preferred replicas and this could lead to an imbalance. So, Kafka will periodically check to see if there is an imbalance in leader replicas. It uses a configurable threshold to make this determination. If it does find an imbalance it will perform a leader rebalance to get the leaders back on their preferred replicas.



## 一、Kafka 文件存储机制

### 消息存储原理

由于生产者生产的消息会不断追加到 log 文件末尾，为防止 log 文件过大导致数据定位效率低下，Kafka 采取了**分片**和**索引**机制，将每个 partition 分为多个 segment。每个 segment 对应两个文件——`.index文件`和 `.log文件`。这些文件位于一个文件夹下，该文件夹的命名规则为：`topic名称+分区序号`。

如下，我们创建一个只有一个分区一个副本的 topic

```sh
> bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic starfish
```

![](https://img.starfish.ink/mq/kafka-topic-create.png)

然后可以在 kafka-logs 目录（server.properties 默认配置）下看到会有个名为 starfish-0 的文件夹。如果，starfish 这个 topic 有三个分区，则其对应的文件夹为 starfish-0，starfish-1，starfish-2。

![](https://img.starfish.ink/mq/kafka-topic-partition.png)

这些文件的含义如下：

| 类别                    | 作用                                                         |
| :---------------------- | :----------------------------------------------------------- |
| .index                  | 基于偏移量的索引文件，存放着消息的offset和其对应的物理位置，是<mark>**稀松索引**</mark> |
| .timestamp              | 时间戳索引文件                                               |
| .log                    | 它是segment文件的数据文件，用于存储实际的消息。该文件是二进制格式的。log文件是存储在 ConcurrentSkipListMap 里的，是一个map结构，key是文件名（offset），value是内容，这样在查找指定偏移量的消息时，用二分查找法就能快速定位到消息所在的数据文件和索引文件 |
| .snaphot                | 快照文件                                                     |
| leader-epoch-checkpoint | 保存了每一任leader开始写入消息时的offset，会定时更新。 follower被选为leader时会根据这个确定哪些消息可用 |

index 和 log 文件以当前 segment 的第一条消息的 offset 命名。偏移量 offset 是一个 64 位的长整形数，固定是  20 位数字，长度未达到，用 0 进行填补，索引文件和日志文件都由此作为文件名命名规则。所以从上图可以看出，我们的偏移量是从 0 开始的，`.index` 和 `.log` 文件名称都为 `00000000000000000000`。

接着往 topic 中发送一些消息，并启动消费者消费

```
> bin /kafka-console-producer.sh --bootstrap-server localhost:9092 --topic starfish
one
```

```
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic starfish --from-beginning
one
```

![](https://img.starfish.ink/mq/kafka-console-producer.png)

查看 .log 文件下是否有数据 one

![](https://img.starfish.ink/mq/0000log.png)

内容存在一些”乱码“，因为数据是经过序列化压缩的。

那么数据文件 .log 大小有限制吗，能保存多久时间？这些我们都可以通过 Kafka 目录下 `conf/server.properties` 配置文件修改：

```properties
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

- 每个分区是由多个 Segment 组成，当 Kafka 要写数据到一个 partition 时，它会写入到状态为 active 的 segment 中。如果该 segment 被写满，则一个新的 segment 将会被新建，然后变成新的“active” segment
- 偏移量：分区中的每一条消息都会被分配的一个连续的 id 值，该值用于唯一标识分区中的每一条消息
- 每个 Segment 中则保存了真实的消息数据。每个 Segment 对应于一个索引文件与一个日志文件。Segment 文件的生命周期是由 Kafka Server 的配置参数所决定的。比如说，`server.properties` 文件中的参数项 `log.retention.hours=168` 就表示 7 天后删除老的消息文件
- [稀松索引]：稀松索引可以加快速度，因为 index 不是为每条消息都存一条索引信息，而是每隔几条数据才存一条 index 信息，这样 index 文件其实很小。kafka 在写入日志文件的时候，同时会写索引文件（.index和.timeindex）。默认情况下，有个参数 `log.index.interval.bytes` 限定了在日志文件写入多少数据，就要在索引文件写一条索引，默认是 4KB，写 4kb 的数据然后在索引里写一条索引。

举个栗子：00000000000000170410 的 “.index” 文件和 “.log” 文件的对应的关系，如下图![](/Users/starfish/oceanus/picBed/kafka/kafka-segment-log.png)

> 问：为什么不能以 partition 作为存储单位？还要加个 segment？
>
> 答：如果就以 partition 为最小存储单位，可以想象，当 Kafka producer 不断发送消息，必然会引起 partition 文件的无限扩张，将对消息文件的维护以及已消费的消息的清理带来严重的影响，因此，需以 segment 为单位将 partition 进一步细分。每个 partition（目录）相当于一个巨型文件被平均分配到多个大小相等的 segment（段）数据文件中（每个 segment 文件中消息数量不一定相等）这种特性也方便 old segment 的删除，即方便已被消费的消息的清理，提高磁盘的利用率。每个 partition 只需要支持顺序读写就行，segment 的文件生命周期由服务端配置参数（log.segment.bytes，log.roll.{ms,hours} 等若干参数）决定。
>
> 
>
> 问：segment 的工作原理是怎样的？
>
> 答：segment 文件由两部分组成，分别为 “.index” 文件和 “.log” 文件，分别表示为 segment 索引文件和数据文件。这两个文件的命令规则为：partition 全局的第一个 segment 从 0 开始，后续每个 segment 文件名为上一个 segment 文件最后一条消息的 offset 值，数值大小为 64 位，20 位数字字符长度，没有数字用 0 填充



消费者从分配到的分区中查找数据过程大概是这样的：

1. **定位段文件**：消费者根据要读取的消息的偏移量查找对应的段文件
2. **使用索引文件查找物理位置**：当消费者请求某个偏移量的消息时，Kafka 会在索引文件中使用二分查找算法快速定位到包含该偏移量消息的日志段
3. **顺序读取数据文件**：一旦找到消息的物理位置，消费者从段文件的对应位置开始顺序读取消息。顺序读取比随机读取更高效，因为它避免了磁盘的寻道时间。

这套机制是建立在 offset 是有序的。索引文件被映射到内存中，所以查找的速度还是很快的。

一句话，Kafka 的 Message 存储采用了分区(partition)，分段(LogSegment)和稀疏索引这几个手段来达到了高效性。



## 二、Kafka 生产过程    

Kafka 生产者用于生产消息。通过前面的内容我们知道，Kafka 的 topic 可以有多个分区，那么生产者如何将这些数据可靠地发送到这些分区？生产者发送数据的不同的分区的依据是什么？

### 2.1 写入流程

producer 写入消息流程如下： 

![img](https://i0.wp.com/belowthemalt.com/wp-content/uploads/2020/11/kafkaproducerapi.png?resize=618%2C334&ssl=1)

![How to Make Kafka Producer/Consumer Production-Ready | by Shivanshu Goyal |  The Startup | Medium](https://miro.medium.com/v2/resize:fit:1200/1*RQlk_aKjeTlwJn68llhX7A.png)



### 2.2 写入方式 

producer 采用推（push） 模式将消息发布到 broker，每条消息都被追加（append） 到分区（patition） 中，属于顺序写磁盘（顺序写磁盘效率比随机写内存要高，保障 kafka 吞吐率）。

###  2.3 分区（Partition） 

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





### 2.4 副本（Replication）

Kafka 是有主题概念的，而每个主题又进一步划分成若干个分区。副本的概念实际上是在分区层级下定义的，每个分区配置有若干个副本。

**所谓副本（Replica），本质就是一个只能追加写消息的提交日志**。根据 Kafka 副本机制的定义，同一个分区下的所有副本保存有相同的消息序列，这些副本分散保存在不同的 Broker 上，从而能够对抗部分 Broker 宕机带来的数据不可用。

同一个 partition 可能会有多个 replication（ 对应 server.properties 配置中的 `default.replication.factor=N`）。没有 replication 的情况下，一旦 broker 宕机，其上所有 partition 的数据都不可被消费，同时 producer 也不能再将数据存于其上的 patition。引入 replication 之后，同一个 partition 可能会有多个 replication，而这时需要在这些 replication 之间选出一 个 leader， producer 和 consumer 只与这个 leader 交互，其它 replication 作为 follower 从 leader 中复制数据。

为了提高消息的可靠性，Kafka 每个 topic 的 partition 有 N 个副本（replicas），其中 N（大于等于 1）是 topic 的复制因子（replica fator）的个数。**Kafka 通过多副本机制实现故障自动转移**，当 Kafka 集群中出现 broker 失效时，副本机制可保证服务可用。对于任何一个 partition，它的 N 个 replicas 中，其中一个 replica 为 leader，其他都为 follower，leader 负责处理 partition 的所有读写请求，follower 则负责被动地去复制 leader 上的数据。如下图所示，Kafka 集群中有 4 个 broker，某 topic 有 3 个 partition，且复制因子即副本个数也为 3：

![kafka-data-replication](https://images.ctfassets.net/gt6dp23g0g38/HZjoaXOuEc1zteyMcoOww/1ebab125a11552f4e8b8d88e7850f0ad/Kafka_Internals_029.png)

![partition-leader-balancing](https://images.ctfassets.net/gt6dp23g0g38/6P0oOJdQ8gJkU0ib014amg/3074980c72714d158fea435866283388/Kafka_Internals_046.png)

如果 leader 所在的 broker 发生故障或宕机，对应 partition 将因无 leader 而不能处理客户端请求，这时副本的作用就体现出来了：一个新 leader 将从 follower 中被选举出来并继续处理客户端的请求。



#### 2.5 数据可靠性保证

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

leader 维护了一个动态的 **in-sync replica set**(ISR)，意为和 leader 保持同步的 follower 集合。当 ISR 中的 follower 完成数据的同步之后，leader 就会给 follower 发送 ack。

如果 follower 长时间未向 leader 同步数据，则该 follower 将会被踢出 ISR，该时间阈值由 `replica.lag.time.max.ms` 参数设定。当前默认值是 10 秒。这就是说，只要一个 follower 副本落后 Leader 副本的时间不连续超过 10 秒，那么 Kafka 就认为该 Follower 副本与 Leader 是同步的，即使此时 follower 副本中保存的消息明显少于 Leader 副本中的消息。

如下这种情况，不管是 follower1 还是 follower2 ，是否有资格在 ISR 中待着，只和同步时间有关，和相差的消息数量无关

如果这个同步过程的速度持续慢于 Leader 副本的消息写入速度，那么在 replica.lag.time.max.ms 时间后，此 Follower 副本就会被认为是与 Leader 副本不同步的，因此不能再放入 ISR 中。此时，Kafka 会自动收缩 ISR 集合，将该副本“踢出”ISR。

值得注意的是，倘若该副本后面慢慢地追上了 Leader 的进度，那么它是能够重新被加回 ISR 的。这也表明，ISR 是一个动态调整的集合，而非静态不变的。

![leader-follower-isr-list](https://images.ctfassets.net/gt6dp23g0g38/4Llth82ZvCCBqcHfp7v0lH/60e6f507fdccce263d38b6d285e6b143/Kafka_Internals_030.png)

![advancing-the-follower-high-watermark](https://images.ctfassets.net/gt6dp23g0g38/2GtWQTnR5GwuDaUltAxEHM/50dd8e261231d98af4dcae5fc57bc41e/Kafka_Internals_035.png)

leader 发生故障之后，就会从 ISR 中选举新的 leader。（之前还有另一个参数，0.9 版本之后 `replica.lag.max.messages` 参数被移除了）

> #### Unclean 领导者选举（Unclean Leader Election）
>
> 既然 ISR 是可以动态调整的，那么自然就可以出现这样的情形：ISR 为空。因为 Leader 副本天然就在 ISR 中，如果 ISR 为空了，就说明 Leader 副本也“挂掉”了，Kafka 需要重新选举一个新的 Leader。可是 ISR 是空，此时该怎么选举新 Leader 呢？
>
> **Kafka 把所有不在 ISR 中的存活副本都称为非同步副本**。通常来说，非同步副本落后 Leader 太多，因此，如果选择这些副本作为新 Leader，就可能出现数据的丢失。毕竟，这些副本中保存的消息远远落后于老 Leader 中的消息。在 Kafka 中，选举这种副本的过程称为 Unclean 领导者选举。**Broker 端参数 unclean.leader.election.enable 控制是否允许 Unclean 领导者选举**。
>
> 开启 Unclean 领导者选举可能会造成数据丢失，但好处是，它使得分区 Leader 副本一直存在，不至于停止对外提供服务，因此提升了高可用性。反之，禁止 Unclean 领导者选举的好处在于维护了数据的一致性，避免了消息丢失，但牺牲了高可用性。
>
> 如果你听说过 CAP 理论的话，你一定知道，一个分布式系统通常只能同时满足一致性（Consistency）、可用性（Availability）、分区容错性（Partition tolerance）中的两个。显然，在这个问题上，Kafka 赋予你选择 C 或 A 的权利。
>
> 你可以根据你的实际业务场景决定是否开启 Unclean 领导者选举。不过，我强烈建议你**不要**开启它，毕竟我们还可以通过其他的方式来提升高可用性。如果为了这点儿高可用性的改善，牺牲了数据一致性，那就非常不值当了。

##### c) ack 应答机制

对于某些不太重要的数据，对数据的可靠性要求不是很高，能够容忍数据的少量丢失，所以没必要等 ISR 中的 follower 全部接收成功。

所以 Kafka 为用户提供了**三种可靠性级别**，用户根据对可靠性和延迟的要求进行权衡，选择以下的 acks 参数配置

- 0：producer 不等待 broker 的 ack，这一操作提供了一个最低的延迟，broker 一接收到还没有写入磁盘就已经返回，当 broker 故障时有可能**丢失数据**；

- 1：producer 等待 broker 的 ack，partition 的 leader 落盘成功后返回 ack，如果在 follower 同步成功之前 leader 故障，那么将会**丢失数据**；

- -1（all）：producer 等待 broker 的 ack，partition 的 leader 和 follower 全部落盘成功后才返回 ack。但是	如果在 follower 同步完成后，broker 发送 ack 之前，leader 发生故障，那么就会造成**数据重复**。

##### d) 故障处理

由于我们并不能保证 Kafka 集群中每时每刻 follower 的长度都和 leader 一致（即数据同步是有时延的），那么当  leader 挂掉选举某个 follower 为新的 leader 的时候（原先挂掉的 leader 恢复了成为了 follower），可能会出现  leader 的数据比 follower 还少的情况。为了解决这种数据量不一致带来的混乱情况，Kafka 提出了以下概念：

![](https://img.starfish.ink/mq/kafka-leo-hw.png)

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



#### 2.6 Exactly Once 语义

将服务器的 ACK 级别设置为 -1，可以保证 Producer 到 Server 之间不会丢失数据，即 At Least Once 语义。相对的，将服务器 ACK 级别设置为 0，可以保证生产者每条消息只会被发送一次，即 At Most Once语义。

**At Least Once 可以保证数据不丢失，但是不能保证数据不重复。相对的，At Most Once 可以保证数据不重复，但是不能保证数据不丢失**。但是，对于一些非常重要的信息，比如说交易数据，下游数据消费者要求数据既不重复也不丢失，即 Exactly Once 语义。在 0.11 版本以前的 Kafka，对此是无能为力的，只能保证数据不丢失，再在下游消费者对数据做全局去重。对于多个下游应用的情况，每个都需要单独做全局去重，这就对性能造成了很大的影响。

0.11 版本的 Kafka，引入了一项重大特性：**幂等性**。所谓的幂等性就是指 Producer 不论向 Server 发送多少次重复数据。Server 端都会只持久化一条，幂等性结合 At Least Once 语义，就构成了 Kafka 的 Exactly Once 语义，即： **<u>At Least Once + 幂等性 = Exactly Once</u>**

要启用幂等性，只需要将 Producer 的参数中 `enable.idompotence` 设置为 `true` 即可。Kafka 的幂等性实现其实就是将原来下游需要做的去重放在了数据上游。开启幂等性的 Producer 在初始化的时候会被分配一个 PID，发往同一 Partition 的消息会附带 Sequence Number。而 Broker 端会对 <PID,Partition,SeqNumber> 做缓存，当具有相同主键的消息提交时，Broker 只会持久化一条。

> 但是 PID 重启就会变化，同时不同的 Partition 也具有不同主键，所以幂等性无法保证跨分区会话的 Exactly Once。

即消息可靠性保证有如下三种：

- 最多一次（at most once）：消息可能会丢失，但绝不会被重复发送。
- 至少一次（at least once）：消息不会丢失，但有可能被重复发送。 （目前 Kakfa 默认提供的交付可靠性保障）
- 精确一次（exactly once）：消息不会丢失，也不会被重复发送。

首先，它只能保证单分区上的幂等性，即一个幂等性 Producer 能够保证某个主题的一个分区上不出现重复消息，它无法实现多个分区的幂等性。其次，它只能实现单会话上的幂等性，不能实现跨会话的幂等性。这里的会话，你可以理解为 Producer 进程的一次运行。当你重启了 Producer 进程之后，这种幂等性保证就丧失了。

> 如果我想实现多分区以及多会话上的消息无重复，应该怎么做呢？
>
> 答案就是事务（transaction）或者依赖事务型 Producer。这也是幂等性 Producer 和事务型 Producer 的最大区别！







## 四、Kafka 消费过程 

**Kafka 消费者采用 pull 拉模式从 broker 中消费数据**。与之相对的 push（推）模式很难适应消费速率不同的消费者，因为消息发送速率是由 broker 决定的。它的目标是尽可能以最快速度传递消息，但是这样很容易造成 consumer 来不及处理消息。而 pull 模式则可以根据 consumer 的消费能力以适当的速率消费消息。

pull 模式不足之处是，如果 kafka 没有数据，消费者可能会陷入循环中，一直返回空数据。为了避免这种情况，我们在我们的拉请求中有参数，允许消费者请求在等待数据到达的“长轮询”中进行阻塞（并且可选地等待到给定的字节数，以确保大的传输大小，或者传入等待超时时间）。 

#### 4.1 消费者组

![](https://img.starfish.ink/mq/kafka-consume-group.png)

**Consumer Group 是 Kafka 提供的可扩展且具有容错性的消费者机制**。

消费者是以 consumer group 消费者组的方式工作，由一个或者多个消费者组成一个组， 共同消费一个 topic。每个分区在同一时间只能由 group 中的一个消费者读取，但是多个 group 可以同时消费这个 partition。在图中，有一个由三个消费者组成的 group，有一个消费者读取主题中的两个分区，另外两个分别读取一个分区。某个消费者读取某个分区，也可以叫做某个消费者是某个分区的拥有者。

在这种情况下，消费者可以通过水平扩展的方式同时读取大量的消息。另外，如果一个消费者失败了，那么其他的 group 成员会自动负载均衡读取之前失败的消费者读取的分区。    

**消费者组最为重要的一个功能是实现广播与单播的功能**。一个消费者组可以确保其所订阅的 Topic 的每个分区只能被从属于该消费者组中的唯一一个消费者所消费；如果不同的消费者组订阅了同一个 Topic，那么这些消费者组之间是彼此独立的，不会受到相互的干扰。

> 如果我们希望一条消息可以被多个消费者所消费，那么可以将这些消费者放到不同的消费者组中，这实际上就是广播的效果；如果希望一条消息只能被一个消费者所消费，那么可以将这些消费者放到同一个消费者组中，这实际上就是单播的效果。 

#### 4.2 分区分配策略

一个 consumer group 中有多个 consumer，一个 topic 有多个 partition，所以必然会涉及到 partition 的分配问题，即确定哪个 partition 由哪个 consumer 来消费。

Kafka 有两种分配策略，一是 RoundRobin，一是 Range（新版本还有Sticky）。

##### RoundRobin

RoundRobin 即轮询的意思，比如现在有一个三个消费者 ConsumerA、ConsumerB 和 ConsumerC 组成的消费者组，同时消费 TopicA 主题消息，TopicA 分为 7 个分区，如果采用 RoundRobin 分配策略，过程如下所示：

![](https://img.starfish.ink/mq/QQ20200401-145222@2x.png)

这种轮询的方式应该很好理解。但如果消费者组消费多个主题的多个分区，会发生什么情况呢？比如现在有一个两个消费者 ConsumerA 和 ConsumerB 组成的消费者组，同时消费 TopicA 和 TopicB 主题消息，如果采用RoundRobin 分配策略，过程如下所示：

![](https://img.starfish.ink/mq/QQ20200401-150317@2x.png)

> 注：TAP0 表示 TopicA Partition0 分区数据，以此类推。

这种情况下，采用 RoundRobin 算法分配，多个主题会被当做一个整体来看，这个整体包含了各自的 Partition，比如在 Kafka-clients 依赖中，与之对应的对象为 `TopicPartition`。接着将这些 `TopicPartition` 根据其哈希值进行排序，排序后采用轮询的方式分配给消费者。

但这会带来一个问题：假如上图中的消费者组中，ConsumerA 只订阅了 TopicA 主题，ConsumerB 只订阅了 TopicB 主题，采用 RoundRobin 轮询算法后，可能会出现 ConsumerA 消费了 TopicB 主题分区里的消息，ConsumerB 消费了 TopicA 主题分区里的消息。

综上所述，RoundRobin 算法只适用于消费者组中消费者订阅的主题相同的情况。同时会发现，采用 RoundRobin 算法，消费者组里的消费者之间消费的消息个数最多相差 1 个。

##### Range

Kafka 默认采用 Range 分配策略，Range 顾名思义就是按范围划分的意思。

比如现在有一个三个消费者 ConsumerA、ConsumerB 和 ConsumerC 组成的消费者组，同时消费 TopicA 主题消息，TopicA 分为 7 个分区，如果采用 Range 分配策略，过程如下所示：

![](https://img.starfish.ink/mq/QQ20200401-152904@2x.png)

假如现在有一个两个消费者 ConsumerA 和 ConsumerB 组成的消费者组，同时消费 TopicA 和 TopicB 主题消息，如果采用 Range 分配策略，过程如下所示：

![](https://img.starfish.ink/mq/QQ20200401-153300@2x.png)

Range 算法并不会把多个主题分区当成一个整体。

从上面的例子我们可以总结出 Range 算法的一个弊端：那就是同一个消费者组内的消费者消费的消息数量相差可能较大。

#### 4.3 offset 的维护

消费者在消费的过程中需要记录自己消费了多少数据，即消费位置信息。在 Kafka 中，这个位置信息有个专门的术语：位移（Offset）。

> 由于 consumer 在消费过程中可能会出现断电宕机等故障，consumer 恢复后，需要从故障前的位置继续消费，所以 consumer 需要实时记录自己消费到了哪个 offset，以便故障恢复后继续消费。

看上去该 Offset 就是一个数值而已，其实对于 Consumer Group 而言，它是一组 KV 对，Key 是分区，V 对应 Consumer 消费该分区的最新位移。如果用 Java 来表示的话，你大致可以认为是这样的数据结构，即 Map<TopicPartition, Long>，其中 TopicPartition 表示一个分区，而 Long 表示位移的类型。当然，Kafka 源码中并不是这样简单的数据结构，而是要比这个复杂得多，不过这并不会妨碍我们对 Group 位移的理解。

Kafka 0.9 版本之前，consumer 默认将 offset 保存在 Zookeeper 中，从 0.9 版本开始，consumer 默认将 offset 保存在 Kafka 一个内置的 topic 中，该 topic 为 **_consumer_offsets**。

> 将位移保存在 ZooKeeper 外部系统的做法，最显而易见的好处就是减少了 Kafka Broker 端的状态保存开销。现在比较流行的做法是将服务器节点做成无状态的，这样可以自由地扩缩容，实现超强的伸缩性。Kafka 最开始也是基于这样的考虑，才将 Consumer Group 位移保存在独立于 Kafka 集群之外的框架中。
>
> 不过，慢慢地人们发现了一个问题，即 ZooKeeper 这类元框架其实并不适合进行频繁的写更新，而 Consumer Group 的位移更新却是一个非常频繁的操作。这种大吞吐量的写操作会极大地拖慢 ZooKeeper 集群的性能，因此 Kafka 社区渐渐有了这样的共识：将 Consumer 位移保存在 ZooKeeper 中是不合适的做法。

```shell
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic starfish --from-beginning
one
```

消费 topic 后，查看 kafka-logs 目录，会发现多出 50 个分区。

默认情况下__consumer_offsets 有 50 个分区，如果你的系统中 consumer group 也很多的话，那么这个命令的输出结果会很多，具体放置在哪个分区，根据 groupID 做如下计算得到：

```
Math.abs(groupID.hashCode()) % numPartitions
```

![](https://img.starfish.ink/mq/kafka-consumer-offset.png)



#### 4.4 再均衡 Rebalance 

所谓的再平衡，指的是在 kafka consumer 所订阅的 topic 发生变化时发生的一种分区重分配机制。

**Rebalance 本质上是一种协议，规定了一个 Consumer Group 下的所有 Consumer 如何达成一致，来分配订阅 Topic 的每个分区**。

一般有三种情况会触发再平衡：

- 组成员数发生变更：consumer group 中的新增或删除某个 consumer，导致其所消费的分区需要分配到组内其他的 consumer上；
- 订阅主题发生变更：consumer 订阅的 topic 发生变化，比如订阅的 topic 采用的是正则表达式的形式，如 `test-*` 此时如果有一个新建了一个 topic `test-user`，那么这个 topic 的所有分区也是会自动分配给当前的 consumer 的，此时就会发生再平衡；
- 订阅主题的分区数发生变更：consumer 所订阅的 topic 发生了新增分区的行为，那么新增的分区就会分配给当前的 consumer，此时就会触发再平衡。



Rebalance 发生时，Group 下所有的 Consumer 实例都会协调在一起共同参与。那每个 Consumer 实例怎么知道应该消费订阅主题的哪些分区呢？这就需要分配策略的协助了。

Kafka 提供的再平衡策略主要有三种：`Round Robin`，`Range` 和 `Sticky`，默认使用的是 `Range`。这三种分配策略的主要区别在于：

- `Round Robin`：会采用轮询的方式将当前所有的分区依次分配给所有的 consumer；
- `Range`：首先会计算每个 consumer可以消费的分区个数，然后按照顺序将指定个数范围的分区分配给各个consumer；
- `Sticky`：这种分区策略是最新版本中新增的一种策略，其主要实现了两个目的：
  - 将现有的分区尽可能均衡的分配给各个 consumer，存在此目的的原因在于`Round Robin`和`Range`分配策略实际上都会导致某几个 consumer 承载过多的分区，从而导致消费压力不均衡；
  - 如果发生再平衡，那么重新分配之后在前一点的基础上会尽力保证当前未宕机的 consumer 所消费的分区不会被分配给其他的 consumer 上；

> 讲完了 Rebalance，现在我来说说它“遭人恨”的地方。
>
> 首先，Rebalance 过程对 Consumer Group 消费过程有极大的影响。如果你了解 JVM 的垃圾回收机制，你一定听过万物静止的收集方式，即著名的 stop the world，简称 STW。在 STW 期间，所有应用线程都会停止工作，表现为整个应用程序僵在那边一动不动。Rebalance 过程也和这个类似，在 Rebalance 过程中，所有 Consumer 实例都会停止消费，等待 Rebalance 完成。这是 Rebalance 为人诟病的一个方面。
>
> 其次，目前 Rebalance 的设计是所有 Consumer 实例共同参与，全部重新分配所有分区。其实更高效的做法是尽量减少分配方案的变动。例如实例 A 之前负责消费分区 1、2、3，那么 Rebalance 之后，如果可能的话，最好还是让实例 A 继续消费分区 1、2、3，而不是被重新分配其他的分区。这样的话，实例 A 连接这些分区所在 Broker 的 TCP 连接就可以继续用，不用重新创建连接其他 Broker 的 Socket 资源。
>
> 最后，Rebalance 实在是太慢了。曾经，有个国外用户的 Group 内有几百个 Consumer 实例，成功 Rebalance 一次要几个小时！这完全是不能忍受的。最悲剧的是，目前社区对此无能为力，至少现在还没有特别好的解决方案。所谓“本事大不如不摊上”，也许最好的解决方案就是避免 Rebalance 的发生吧。





#### 2.7 Kafka 事务

Kafka 从 0.11 版本开始引入了事务支持。事务可以保证 Kafka 在 Exactly Once 语义的基础上，生产和消费可以跨分区和会话，要么全部成功，要么全部失败。

##### 2.6.1 Producer事务

为了了实现跨分区跨会话的事务，需要引入一个全局唯一的 TransactionID，并将 Producer 获得的 PID 和Transaction ID 绑定。这样当 Producer 重启后就可以通过正在进行的 TransactionID 获得原来的 PID。

为了管理 Transaction，Kafka 引入了一个新的组件 Transaction Coordinator。Producer 就是通过和 Transaction Coordinator 交互获得 Transaction ID 对应的任务状态。Transaction Coordinator 还负责将事务所有写入 Kafka 的一个内部 Topic，这样即使整个服务重启，由于事务状态得到保存，进行中的事务状态可以得到恢复，从而继续进行。

设置事务型 Producer 的方法也很简单，满足两个要求即可：

- 和幂等性 Producer 一样，开启 enable.idempotence = true。
- 设置 Producer 端参数 transctional. id。最好为其设置一个有意义的名字。

此外，你还需要在 Producer 代码中做一些调整，如这段代码所示：

```java
producer.initTransactions();
try {
  producer.beginTransaction();
  producer.send(record1);
  producer.send(record2);
  producer.commitTransaction();
} catch (KafkaException e) {
  producer.abortTransaction();
}
```



##### 2.6.2 Consumer事务

对 Consumer 而言，事务的保证就会相对较弱，尤其是无法保证 Commit 的消息被准确消费。这是由于Consumer 可以通过 offset 访问任意信息，而且不同的 SegmentFile 生命周期不同，同一事务的消息可能会出现重启后被删除的情况。

> 在 Consumer 端，读取事务型 Producer 发送的消息也是需要一些变更的。修改起来也很简单，设置 isolation.level 参数的值即可。当前这个参数有两个取值：
>
> 1. read_uncommitted：这是默认值，表明 Consumer 能够读取到 Kafka 写入的任何消息，不论事务型 Producer 提交事务还是终止事务，其写入的消息都可以读取。很显然，如果你用了事务型 Producer，那么对应的 Consumer 就不要使用这个值。
> 2. read_committed：表明 Consumer 只会读取事务型 Producer 成功提交事务写入的消息。当然了，它也能看到非事务型 Producer 写入的所有消息。



## 参考与来源：

- https://developer.confluent.io/courses/architecture/get-started/  文章配图均来自该教程

- 尚硅谷Kafka教学

- 部分图片来源：mrbird.cc

- https://gitbook.cn/books/5ae1e77197c22f130e67ec4e/index.html