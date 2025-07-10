---
title: Kakfa 面试
date: 2022-1-9
tags: 
 - Kafka
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

## 一、概念性问题

### 为什么需要消息队列

消息队列最鲜明的特性是**异步、削峰、解耦**。

1. **解耦**： 允许你独立的扩展或修改两边的处理过程，只要确保它们遵守同样的接口约束。
2. **冗余**：消息队列把数据进行持久化直到它们已经被完全处理，通过这一方式规避了数据丢失风险。许多消息队列所采用的"插入-获取-删除"范式中，在把一个消息从队列中删除之前，需要你的处理系统明确的指出该消息已经被处理完毕，从而确保你的数据被安全的保存直到你使用完毕。 
3. **扩展性**： 因为消息队列解耦了你的处理过程，所以增大消息入队和处理的频率是很容易的，只要另外增加处理过程即可。 
4. **峰值处理能力** &  **灵活性 **： 在访问量剧增的情况下，应用仍然需要继续发挥作用，但是这样的突发流量并不常见。 如果为以能处理这类峰值访问为标准来投入资源随时待命无疑是巨大的浪费。使用消息队列能够使关键组件顶住突发的访问压力，而不会因为突发的超负荷的请求而完全崩溃。 
5. **可恢复性**： 系统的一部分组件失效时，不会影响到整个系统。消息队列降低了进程间的耦合度，所以即使一个处理消息的进程挂掉，加入队列中的消息仍然可以在系统恢复后被处理。
6. **顺序保证**： 在大多使用场景下，数据处理的顺序都很重要。大部分消息队列本来就是排序的，并且能保证数据会按照特定的顺序来处理。（Kafka 保证一个 Partition 内的消息的有序性）
7. **缓冲**： 有助于控制和优化数据流经过系统的速度， 解决生产消息和消费消息的处理速度不一致的情况。 
8. **异步通信**： 很多时候，用户不想也不需要立即处理消息。消息队列提供了异步处理机制，允许用户把一个消息放入队列，但并不立即处理它。想向队列中放入多少消息就放多少，然后在需要的时候再去处理它们。



### Kakfa 是什么 ?

Kafka 是由 Apache 软件基金会开发的一个开源流处理平台。

Kafka 是一个**分布式**的基于**发布/订阅模式的消息队列**（Message Queue），主要应用于大数据实时处理领域。



### Kafka 使用场景 ？

- 消息系统：解耦生产者和消费者、缓存消息等。
- 日志收集：一个公司可以用 Kafka 收集各种服务的 log，通过kafka以统一接口服务的方式开放给各种consumer，例如hadoop、HBase、Solr 等。
- 用户活动跟踪：Kafka 经常被用来记录 web 用户或者app用户的各种活动，如浏览网页、搜索、点击等活动，这些活动信息被各个服务器发布到kafka的topic中，然后订阅者通过订阅这些topic来做实时的监控分析，或者装载到hadoop、数据仓库中做离线分析和挖掘。
- 运营指标：Kafka 也经常用来记录运营监控数据。包括收集各种分布式应用的数据，生产各种操作的集中反馈，比如报警和报告。
- 流式处理：比如 spark streaming 和 Flink



### Kafka 都有哪些特点？

- 高吞吐量、低延迟：kafka 每秒可以处理几十万条消息，它的延迟最低只有几毫秒，每个 topic 可以分多个 partition，consumer group 对 partition 进行 consume 操作。
- 可扩展性：kafka 集群支持热扩展
- 持久性、可靠性：消息被持久化到本地磁盘，并且支持数据备份防止数据丢失
- 容错性：允许集群中节点失败（若副本数量为n,则允许n-1个节点失败）
- 高并发：支持数千个客户端同时读写

> 面试中还有一个比较经典的问题，就是你为什么用 Kafka、RabbitMQ 或 RocketMQ，又 或者说你为什么使用某一个中间件，这种问题该怎么回答呢？



### Kafka 核心 API 有哪些？

1. Producer API 允许应用程序发送数据流到 kafka 集群中的 topic
2. Consumer API 允许应用程序从 kafka 集群的 topic 中读取数据流
3. Streams API 允许从输入 topic 转换数据流到输出 topic
4. Connect API 用于在 Kafka 与外部系统之间构建数据管道。它支持可插拔的连接器，用于将数据从外部系统导入 Kafka 或将 Kafka 数据导出到外部系统。
5. Admin API 用于管理和监控 Kafka 集群。它提供了创建、删除主题，查看主题、分区和 Broker 信息等功能。



## 二、架构 | 原理和设计

### Kafka 的设计架构你知道吗？

![](https://mrbird.cc/img/QQ20200324-210522@2x.png)



### Kafka 主要组件有哪些？

Kafka 架构分为以下几个部分

- Producer ：消息生产者，就是向 kafka broker 发消息的客户端。
- Consumer ：消息消费者，向 kafka broker 取消息的客户端。
- Topic ：可以理解为一个队列，一个 Topic 又分为一个或多个分区。
- Consumer Group：这是 kafka 用来实现一个 topic 消息的广播（发给所有的 consumer）和单播（发给任意一个 consumer）的手段。一个 topic 可以有多个 Consumer Group。
- Broker ：一台 kafka 服务就是一个 broker。一个集群由多个 broker 组成。一个 broker 可以容纳多个 topic。
- Partition：为了实现扩展性，一个非常大的 topic 可以分布到多个 broker上，每个 partition 是一个有序的队列。partition 中的每条消息都会被分配一个有序的 id（offset）。将消息发给 consumer，kafka 只保证按一个 partition 中的消息的顺序，不保证一个 topic 的整体（多个 partition 间）的顺序。



### Zookeeper 在 Kafka 中的作用

Zookeeper 主要用于在集群中不同节点之间的通信。老版本的 kafka 中，偏移量信息也存放在 zk 中。

在 Kafka 中，主要被用于集群元数据管理、 Broker管理、leader 检测、分布式同步、配置管理、识别新节点何时离开或者连接、集群、节点实时状态等

1. 集群元数据管理

   ZooKeeper存储和管理Kafka集群的元数据信息，包括Broker列表、主题配置和分区信息。这些元数据确保Kafka集群中的各个节点能够协同工作，保持一致性。

2. Broker管理

   ZooKeeper维护Kafka集群中的Broker列表。每个Broker启动时，会向ZooKeeper注册自己，并周期性地发送心跳信息。ZooKeeper监控这些心跳信息，检测Broker的状态。如果某个Broker失效，ZooKeeper会通知集群中的其他组件，以便进行故障恢复。

3. 分区Leader选举

   Kafka中的每个分区都有一个Leader负责处理所有的读写请求，其他Broker作为Follower从Leader复制数据。ZooKeeper负责管理分区的Leader选举。当Leader失效时，ZooKeeper会触发重新选举，确保分区始终有一个可用的Leader。

4. 消费者组协调

   ZooKeeper管理消费者组的成员信息和偏移量。消费者组中的每个消费者实例向ZooKeeper注册自己，并定期发送心跳信息。ZooKeeper根据这些信息协调消费者组的成员，确保每个分区的消息只被一个消费者实例消费。同时，ZooKeeper还存储消费者组的偏移量，便于在消费者故障恢复时继续消费。

5. 配置管理

   ZooKeeper用于存储Kafka集群的配置信息。通过ZooKeeper，可以集中管理和动态更新Kafka的配置，而无需重启集群中的每个节点。



### 没有 Zookeeper ， Kafka 能用吗？

在Kafka的传统架构中，ZooKeeper是必不可少的组件，它负责集群的管理和协调任务，如元数据管理、Leader选举和消费者组协调。然而，Kafka已经逐步减少对ZooKeeper的依赖，特别是在新的Kafka版本中，通过引入Kafka Raft协议（KRaft），Kafka可以在没有ZooKeeper的情况下运行。

**Kafka Raft协议（KRaft）**

Kafka Raft协议是Kafka 2.8.0版本引入的，旨在移除对ZooKeeper的依赖。KRaft采用了Raft共识算法来管理Kafka集群的元数据和协调任务，使Kafka能够在没有ZooKeeper的情况下独立运行。

**KRaft的主要特性：**

1. **分布式共识**：使用Raft协议实现分布式共识，确保元数据的一致性和可靠性。
2. **高可用性**：通过选举Leader，保证即使在节点故障的情况下，集群依然能够正常运行。
3. **简化架构**：移除ZooKeeper后，Kafka集群的架构变得更加简单，部署和管理也更加方便。

**设置KRaft模式**

以下是配置Kafka在KRaft模式下运行的基本步骤：

1. **配置服务器属性**： 创建一个新的配置文件`server.properties`，并添加以下配置项：

   ```properties
   process.roles=controller,broker
   node.id=1
   controller.quorum.voters=1@localhost:9093
   listeners=PLAINTEXT://localhost:9092,CONTROLLER://localhost:9093
   log.dirs=/tmp/kraft-combined-logs
   ```

2. **启动Kafka**： 使用新的配置文件启动Kafka：

   ```bash
   bin/kafka-server-start.sh config/server.properties
   ```

3. **初始化元数据**： 在第一次启动时，需要初始化元数据：

   ```bash
   bin/kafka-storage.sh format -t <uuid> -c config/server.properties
   ```

**KRaft的优势**

- **简化部署**：减少了Kafka集群的组件数量，使得部署和管理变得更加简单。
- **降低运维成本**：不再需要维护ZooKeeper集群，降低了运维成本和复杂性。
- **提高稳定性**：通过Raft协议实现的分布式共识，提高了系统的稳定性和可靠性。



### Kafka 分区的目的？

简而言之：**<mark>负载均衡+水平扩展</mark>**

Topic 只是逻辑概念，面向的是 producer 和 consumer；而 Partition 则是物理概念。

分区对于 Kafka 集群的好处是：实现负载均衡。分区对于消费者来说，可以提高并发度，提高效率。

![kafka use cases](https://scalac.io/wp-content/uploads/2021/02/kafka-use-cases-3-1030x549.png)

> 可以想象，如果 Topic 不进行分区，而将 Topic 内的消息存储于一个 broker，那么关于该 Topic 的所有读写请求都将由这一个 broker 处理，吞吐量很容易陷入瓶颈，这显然是不符合高吞吐量应用场景的。有了 Partition 概念以后，假设一个 Topic 被分为 10 个 Partitions，Kafka 会根据一定的算法将 10 个 Partition 尽可能均匀的分布到不同的 broker（服务器）上，当 producer 发布消息时，producer 客户端可以采用 `random`、`key-hash` 及 `轮询` 等算法选定目标 partition，若不指定，Kafka 也将根据一定算法将其置于某一分区上。Partiton 机制可以极大的提高吞吐量，并且使得系统具备良好的水平扩展能力。



### 为什么不能以 partition 作为存储单位？还要加个 segment？

在Apache Kafka中，虽然Partition是逻辑上的存储单元，但在物理存储层面上，Kafka将每个Partition划分为多个Segment。这种设计有几个重要的原因，主要包括管理、性能和数据恢复等方面的考虑。

**1、易于管理**

​	将Partition划分为多个Segment使得Kafka在管理日志文件时更加灵活：

- 日志滚动：通过Segment，Kafka可以实现日志滚动策略，例如按时间或文件大小进行滚动，删除旧的Segment文件以释放存储空间。

- 文件大小限制：单个大的日志文件难以管理和操作，而将其划分为多个较小的Segment文件，便于进行文件系统操作，如移动、删除和压缩。

**2、性能优化**

Segment有助于提升Kafka的性能，尤其是在数据写入和读取方面：

- **顺序写入**：Kafka通过顺序写入Segment文件来优化磁盘写入性能，避免随机写入的开销。
- **高效读取**：分段存储允许Kafka在读取数据时更有效地利用磁盘缓存，并可以通过索引快速定位Segment文件中的数据位置，提升读取效率。

**3、数据恢复和副本同步**

​	Segment的引入简化了数据恢复和副本同步过程：

- **数据恢复**：在发生故障时，Kafka只需要恢复受影响的Segment文件，而不是整个Partition，从而加快数据恢复速度。

- **副本同步**：当副本之间进行数据同步时，Segment级别的操作使得Kafka能够仅同步最近更新的Segment，而不是整个Partition的数据，减少网络带宽的使用和同步时间。

**4、高效的垃圾回收**

​	Segment使得Kafka能够更高效地进行垃圾回收：

- **日志清理**：Kafka的日志清理策略可以在Segment级别进行，删除或压缩旧的Segment文件，而不影响正在使用的Segment。
- **TTL管理**：Kafka可以基于Segment实现TTL（Time-to-Live）管理，在达到指定保留时间后删除旧的Segment文件，从而控制磁盘空间的使用。



### segment 的工作原理是怎样的？

segment 文件由两部分组成，分别为 “.index” 文件和 “.log” 文件，分别表示为 segment 索引文件和数据文件。

这两个文件的命令规则为：partition 全局的第一个 segment 从 0 开始，后续每个 segment 文件名为上一个 segment 文件最后一条消息的 offset 值，数值大小为 64 位，20 位数字字符长度，没有数字用 0 填充



### 如果我指定了一个offset，kafka 怎么查找到对应的消息

在Kafka中，每个消息都被分配了一个唯一的偏移量（offset），这是一个连续的整数，表示消息在日志中的位置。当你指定一个偏移量并想要查找对应的消息时，Kafka 会进行以下操作：

1. **确定分区**：首先，需要确定偏移量所属的分区。Kafka 通过主题和分区的组合来唯一确定消息。
2. **查找索引**：Kafka 为每个分区维护了一个索引，这个索引允许它快速查找给定偏移量的位置。这个索引通常是稀疏的，以减少内存使用，并存储在内存中。
3. **确定物理位置**：使用索引，Kafka 可以快速定位到包含目标偏移量消息的物理文件（即日志文件）和文件内的大致位置。
4. **读取消息**：一旦确定了物理位置，Kafka 会从磁盘读取包含该偏移量的消息。如果文件很大，Kafka 会尝试直接定位到消息的起始位置，否则可能需要顺序扫描到该位置。
5. **返回消息**：找到指定偏移量的消息后，Kafka 将其返回给请求者。



### Kafka 高效文件存储设计特点?

- Kafka 把 topic 中一个 partition 大文件分成多个小文件段，通过多个小文件段，就容易定期清除或删除已经消费完文件，减少磁盘占用。
- 通过索引信息可以快速定位 message 和确定 response 的最大大小。
- 通过 index 元数据全部映射到 memory，可以避免 segment file 的 IO 磁盘操作。
- 通过索引文件稀疏存储，可以大幅降低 index 文件元数据占用空间大小



## 三、 生产者和消费者

### Kafka消息是采用 Pull 模式，还是 Push 模式？ 

producer 将消息推送到 broker，consumer 从 broker 拉取消息。

消费者采用 pull 的模式的好处就是消费速率可以自行控制，可以按自己的消费能力决定是否消费策略（是否批量等）

有个缺点是，如果没有消息可供消费是，consumer 也需要不断在循环中轮训等消息的到达，所以 kafka 为了避免这点，提供了阻塞式等新消息。



### Kafka 消费者是否可以消费指定分区消息？

**Kafka 消费者可以消费指定分区的消息。** 这种操作称为**分配分区消费（Partition Assignment）**，Kafka 提供了多种方式来实现对指定分区的消息消费。

1. 默认消费方式（消费者组模式）

   - 在 Kafka 中，消费者通常属于某个**消费者组**（Consumer Group），由 Kafka 的**分区分配策略**（Partition Assignment Strategy）负责自动将 Topic 的分区分配给组内的消费者。

   - 在这种模式下：
     - 消费者组中的消费者共享 Topic 的分区。
     - Kafka 自动平衡分区的分配，消费者**无法直接指定消费某个分区**。

2. 手动分配消费分区

   Kafka 提供了手动指定消费分区的能力，这种方式允许消费者直接消费指定的分区，而不依赖 Kafka 的自动分区分配机制。

   **方法：使用 `assign` 方法**：Kafka Consumer API 提供了 `assign` 方法，允许消费者手动订阅特定的分区。

   ```java
   public class SpecificPartitionConsumer {
       public static void main(String[] args) {
           // 配置 Kafka 消费者属性
           Properties props = new Properties();
           props.put("bootstrap.servers", "localhost:9092");
           props.put("group.id", "test-group");
           props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
           props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
   
           KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
   
           // 手动指定要消费的分区
           TopicPartition partition = new TopicPartition("my-topic", 0); // 指定 Topic 和分区
          //使用 `assign` 方法将消费者绑定到特定分区  
         	consumer.assign(Collections.singletonList(partition));
   
           // 开始消费指定分区的消息
           while (true) {
               ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
               for (ConsumerRecord<String, String> record : records) {
                   System.out.printf("Offset = %d, Key = %s, Value = %s%n",
                           record.offset(), record.key(), record.value());
               }
           }
       }
   }
   ```

3. 指定分区并指定偏移量

   除了手动分配分区，Kafka 还允许消费者**从指定分区的特定偏移量开始消费**。

   **方法：使用 `seek` 方法**

   - 在调用 `assign` 方法分配分区后，可以通过 `seek` 方法指定从分区的哪个偏移量开始消费。

   ```java
   TopicPartition partition = new TopicPartition("my-topic", 0);
   consumer.assign(Collections.singletonList(partition));
   
   // 指定从偏移量 50 开始消费
   consumer.seek(partition, 50);
   
   // 开始消费
   while (true) {
       ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
       for (ConsumerRecord<String, String> record : records) {
           System.out.printf("Offset = %d, Key = %s, Value = %s%n",
                   record.offset(), record.key(), record.value());
       }
   }
   ```



### 为什么要有消费者组 | 消费者和消费者组有什么关系？

**Consumer Group 是 Kafka 提供的可扩展且具有容错性的消费者机制**。

既然是一个组，那么组内必然可以有多个消费者或消费者实例（Consumer Instance），它们共享一个公共的 ID，这个 ID 被称为 Group ID。组内的所有消费者协调在一起来消费订阅主题（Subscribed Topics）的所有分区（Partition）。当然，每个分区只能由同一个消费者组内的一个 Consumer 实例来消费。

**消费者组最为重要的一个功能是实现广播与单播的功能**。一个消费者组可以确保其所订阅的 Topic 的每个分区只能被从属于该消费者组中的唯一一个消费者所消费；如果不同的消费者组订阅了同一个 Topic，那么这些消费者组之间是彼此独立的，不会受到相互的干扰。



![Architecture](https://quarkus.io/guides/images/kafka-one-app-two-consumers.png)





### Kafka 的每个分区只能被一个消费者线程消费，如何做到多个线程同时消费一个分区？

在Kafka中，每个分区只能被一个消费者线程消费，以保证消息处理的顺序性。然而，有时需要通过多线程来提高单个分区的消费速度。在这种情况下，可以在消费者应用程序中实现多线程处理。以下是几种常见的方法：

**方法一：多线程消费处理**

这种方法通过在单个消费者线程中读取消息，然后将消息分发到多个工作线程进行处理。这样，虽然消息的消费是单线程的，但处理是多线程的。

```java
public class MultithreadedConsumer {
    private static final int NUM_WORKER_THREADS = 4;

    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Arrays.asList("my-topic"));

        ExecutorService executorService = Executors.newFixedThreadPool(NUM_WORKER_THREADS);

        try {
            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
                for (ConsumerRecord<String, String> record : records) {
                    executorService.submit(() -> processRecord(record));
                }
            }
        } finally {
            consumer.close();
            executorService.shutdown();
        }
    }

    private static void processRecord(ConsumerRecord<String, String> record) {
        System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
        // Add your processing logic here
    }
}
```

**方法二：使用Kafka Connect和KStreams**

Kafka Connect和KStreams是Kafka生态系统中的两个工具，可以帮助实现多线程消费。

- Kafka Connect是用于大规模数据导入和导出的框架，具有内置的并行处理能力。
- Kafka Streams提供了流处理的抽象，可以在流处理中并行处理数据。

**方法三：手动管理偏移量**

通过手动管理偏移量，可以实现更灵活的多线程消费。

```java
public class MultithreadedConsumerWithManualOffset {
    private static final int NUM_WORKER_THREADS = 4;
    private static ExecutorService executorService = Executors.newFixedThreadPool(NUM_WORKER_THREADS);

    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test-group");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Arrays.asList("my-topic"));

        try {
            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
                List<Future<?>> futures = new ArrayList<>();

                for (ConsumerRecord<String, String> record : records) {
                    futures.add(executorService.submit(() -> processRecord(record)));
                }

                // Wait for all tasks to complete
                for (Future<?> future : futures) {
                    future.get();
                }

                // Commit offsets after processing
                consumer.commitSync();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            consumer.close();
            executorService.shutdown();
        }
    }

    private static void processRecord(ConsumerRecord<String, String> record) {
        System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
        // Add your processing logic here
    }
}
```

**注意事项**

- **消息顺序性**：确保多线程处理不破坏消息的顺序性。
- **偏移量管理**：手动提交偏移量时，确保所有消息都已成功处理。
- **异常处理**：处理多线程中的异常情况，防止消息丢失。

通过这些方法，可以在不破坏Kafka分区消费模型的情况下，实现多线程处理，以提高消息处理的效率和吞吐量。





## 四、集群

### Kafka 的多副本机制了解吗？

> 所谓的副本机制（Replication），也可以称之为备份机制，通常是指分布式系统在多台网络互联的机器上保存有相同的数据拷贝。副本机制有什么好处呢？
>
> 1. **提供数据冗余**。即使系统部分组件失效，系统依然能够继续运转，因而增加了整体可用性以及数据持久性。
> 2. **提供高伸缩性**。支持横向扩展，能够通过增加机器的方式来提升读性能，进而提高读操作吞吐量。
> 3. **改善数据局部性**。允许将数据放入与用户地理位置相近的地方，从而降低系统延时。
>
> Kafka 只是用副本机制来提供数据冗余实现高可用性和高持久性，也就是第一个好处

所谓副本，本质上就是一个只能追加写消息的提交日志。这些日志被相同的分散保存在不同的 Broker 上。

在实际生产上，每台 Broker 都可能保存有各个主题下不同分区的不同副本。因此单个Broker上存有成百上千个副本现象是非常正常的。

既然多个Broker中保存分区下的多个副本，那么是如何保证副本当中的数据都是一致的呢？

针对这个问题，kafka的解决方案就是**领导者副本机制**

- 在kafka中，副本分成两类：领导者副本和追随者副本。每个分区在创建时都要选举一个副本，成为领导者副本，其余的副本自动称为追随者副本。
- kafka中，**追随者副本是不会对外提供服务的**，所有的请求都必须由领导者副本来处理。它唯一的任务就是从领导者副本异步拉取消息，并写入到自己提交日志中，从而实现与领导者副本的同步。
- 当领导者副本挂掉了，或者说所在 Broker 宕机了，kafka 可以通过 Zookeeper 提供的监控功能能够实时感知到，并开启新一轮领导者选举，从追随者副本中选一个作为新的领导者。老 Leader 副本重启回来后，只能作为追随者副本加入到集群中。



### Kafka 判断一个节点是否存活有什么条件？

- **ZooKeeper的心跳机制**：每个Broker会在ZooKeeper上创建一个临时节点，并定期发送心跳（heartbeat）信号以表明自己是活跃的。如果ZooKeeper在设定的超时时间内没有收到某个Broker的心跳，便会认为该Broker已失效，并删除其临时节点。
  - **Session超时**：如果ZooKeeper在`zookeeper.session.timeout.ms`设置的时间内未收到Broker的心跳，则会认为该Broker失效。
  - **心跳间隔**：Broker定期发送心跳给ZooKeeper，心跳间隔由`zookeeper.sync.time.ms`参数决定。
- **Leader和Follower之间的心跳**：在Kafka的多副本机制中，Leader副本与Follower副本之间也有心跳机制。Follower副本会定期向Leader发送心跳，表明自己是存活的。
  - **Replica Lag**：如果Follower副本落后于Leader副本超过`replica.lag.time.max.ms`设置的时间，则会被移出ISR（In-Sync Replicas）集合，Kafka认为该Follower可能已失效。
-  **网络连接检查**：Kafka使用TCP连接进行数据传输。Broker之间、Broker与ZooKeeper之间、以及Broker与客户端之间的网络连接状况也是判断节点是否存活的重要依据。
  - **TCP连接超时**：Kafka通过TCP连接进行数据传输和心跳检测，如果TCP连接超时，Kafka会尝试重连并记录连接状态。

- **Broker元数据刷新**：Kafka客户端（生产者和消费者）会定期从Kafka集群中刷新元数据，了解Broker的状态。如果某个Broker无法响应元数据请求，客户端将其标记为不可用。

- **元数据请求超时**：客户端通过`metadata.max.age.ms`参数设置元数据刷新的时间间隔，如果在这个间隔内无法获取到Broker的元数据，则认为该Broker不可用。



## 五、kafka 数据可靠性保证

### kafka 在可靠性方面做了哪些改进

谈及可靠性，最常规、最有效的策略就是 “副本（replication）机制” ，Kafka 实现高可靠性同样采用了该策略。

通过调节副本相关参数，可使 Kafka 在性能和可靠性之间取得平衡。

> 实践中，我们为了保证 producer 发送的数据，能可靠地发送到指定的 topic，topic 的每个 partition 收到 producer 发送的数据后，都需要向 producer 发送 ack（acknowledge 确认收到），如果 producer 收到 ack，就会进行下一轮的发送，否则重新发送数据。
>
> 涉及到副本 ISR、故障处理中的 LEO、HW

### ISR

一个 partition 有多个副本（replicas），为了提高可靠性，这些副本分散在不同的 broker 上，由于带宽、读写性能、网络延迟等因素，同一时刻，这些副本的状态通常是不一致的：即 followers 与 leader 的状态不一致。

为保证 producer 发送的数据，能可靠的发送到指定的 topic，topic 的每个 partition 收到 producer 数据后，都需要向 producer 发送 ack（acknowledgement确认收到），如果 producer 收到 ack，就会进行下一轮的发送，否则重新发送数据。

leader 维护了一个动态的 **in-sync replica set**(ISR)，意为和 leader 保持同步的 follower 集合。当 ISR 中的 follower 完成数据的同步之后，leader 就会给 follower 发送 ack。

如果 follower 长时间未向 leader 同步数据，则该 follower 将会被踢出 ISR，该时间阈值由 `replica.lag.time.max.ms` 参数设定。当前默认值是 10 秒。这就是说，只要一个 follower 副本落后 Leader 副本的时间不连续超过 10 秒，那么 Kafka 就认为该 Follower 副本与 Leader 是同步的，即使此时 follower 副本中保存的消息明显少于 Leader 副本中的消息。



### ISR 频繁变化，可能会有哪些原因，怎么排查

- 网络延迟和不稳定：高网络延迟或不稳定的网络连接会导致Follower副本无法及时从Leader副本同步数据，从而被移出ISR
- 磁盘性能问题：Follower副本的磁盘写入速度不足，无法及时写入从Leader同步的数据，导致其落后于Leader，进而被移出ISR
- CPU或内存资源不足：Broker节点的CPU或内存资源不足，导致数据处理速度变慢，影响副本同步的性能。
- GC（垃圾回收）停顿：Java垃圾回收停顿（GC Pause）时间过长，会导致Broker节点在短时间内无法处理请求，影响副本同步



### ack 应答机制 

对于某些不太重要的数据，对数据的可靠性要求不是很高，能够容忍数据的少量丢失，所以没必要等 ISR 中的 follower 全部接收成功。

所以 Kafka 为用户提供了**三种可靠性级别**，用户根据对可靠性和延迟的要求进行权衡，选择以下的 acks 参数配置

- 0：producer 不等待 broker 的 ack，这一操作提供了一个最低的延迟，broker 一接收到还没有写入磁盘就已经返回，当 broker 故障时有可能**丢失数据**；
- 1：producer 等待 broker 的 ack，partition 的 leader 落盘成功后返回 ack，如果在 follower 同步成功之前 leader 故障，那么将会**丢失数据**；
- -1（all）：producer 等待 broker 的 ack，partition 的 leader 和 follower 全部落盘成功后才返回 ack。但是如果在 follower 同步完成后，broker 发送 ack 之前，leader 发生故障，那么就会造成**数据重复**。



### 故障处理

由于我们并不能保证 Kafka 集群中每时每刻 follower 的长度都和 leader 一致（即数据同步是有时延的），那么当 leader 挂掉选举某个 follower 为新的 leader 的时候（原先挂掉的 leader 恢复了成为了 follower），可能会出现 leader 的数据比 follower 还少的情况。为了解决这种数据量不一致带来的混乱情况，Kafka 提出了以下概念：

- LEO（Log End Offset）：指的是每个副本最后一个offset；
- HW（High Wather）：指的是消费者能见到的最大的 offset，ISR 队列中最小的 LEO。

消费者和 leader 通信时，只能消费 HW 之前的数据，HW 之后的数据对消费者不可见。

针对这个规则：

- **当follower发生故障时**：follower 发生故障后会被临时踢出 ISR，待该 follower 恢复后，follower 会读取本地磁盘记录的上次的 HW，并将 log 文件高于 HW 的部分截取掉，从 HW 开始向 leader 进行同步。等该 follower 的 LEO 大于等于该 Partition 的 HW，即 follower 追上 leader 之后，就可以重新加入 ISR 了。
- **当leader发生故障时**：leader 发生故障之后，会从 ISR 中选出一个新的 leader，之后，为保证多个副本之间的数据一致性，其余的 follower 会先将各自的 log 文件高于 HW 的部分截掉，然后从新的 leader 同步数据。

所以数据一致性并不能保证数据不丢失或者不重复，这是由 ack 控制的。HW 规则只能保证副本之间的数据一致性！



### ISR、OSR、AR 是什么？

- ISR：ISR是“同步副本集合”（In-Sync Replicas Set）的缩写。ISR集合包含所有与Leader副本保持同步的副本

- OSR：OSR是“不同步副本集合”（Out-of-Sync Replicas Set）的缩写

- AR：AR是“分配副本集合”（Assigned Replicas Set）的缩写。AR集合包含所有被分配给某个分区的副本，包括Leader和所有Follower。这是Kafka在配置主题时指定的副本数量。

ISR 是由 leader 维护，follower 从 leader 同步数据有一些延迟，超过相应的阈值会把 follower 剔除出 ISR，存入 OSR（Out-of-Sync Replicas ）列表，新加入的 follower 也会先存放在 OSR 中。`AR=ISR+OSR`。



### 请谈一谈 Kafka 数据一致性原理?

- 多副本机制：Kafka的每个分区可以配置多个副本（Replicas），这些副本分布在不同的Broker上。副本包括一个Leader和多个Follower。生产者和消费者的所有读写请求都通过Leader进行
- ISR（In-Sync Replicas）集合
- 确认机制：Kafka通过配置`acks`参数来决定消息的确认策略，从而保证数据一致性。
- 选举和故障恢复：当Leader失效时，Kafka会从ISR中选举一个新的Leader。这确保了新Leader的数据是最新的，并且与旧Leader保持一致
- 幂等性和事务：Kafka支持幂等性和事务，以确保消息的精确一次（exactly-once）语义



### 数据传输的事务有几种？

数据传输的事务定义通常有以下三种级别：

- 最多一次: 消息不会被重复发送，最多被传输一次，但也有可能一次不传输
- 最少一次: 消息不会被漏发送，最少被传输一次，但也有可能被重复传输.
- 精确的一次（Exactly once）: 不会漏传输也不会重复传输,每个消息都传输被



### Kafka创建Topic时如何将分区放置到不同的Broker中？

创建Topic时可以通过指定分区分配策略（Partition Assignment Strategy）来控制分区（Partition）如何放置到不同的Broker上

1. **默认分区分配**： 如果创建Topic时没有指定分区分配策略，Kafka将使用默认的分区分配策略。默认情况下，Kafka会尝试均匀地将分区分配到所有Broker上。

2. **自定义分区分配策略**： 创建Topic时，可以使用`--partition`和`--replication-factor`参数来指定分区数和副本因子。然后，通过`--assign`参数来指定每个分区的Broker列表

3. **使用Broker ID**： 如果你知道Broker的ID，可以直接使用Broker ID来指定分区的放置

   ```bash
   kafka-topics.sh --create --topic my-topic --num-partitions 3 --replication-factor 2 --broker-list "0:1,1:2"
   ```

4. **使用KafkaAdminClient API**： 如果使用Java API创建Topic，可以使用`KafkaAdminClient`类的`createTopics`方法，并设置`NewTopic`对象的`replicaAssignment`属性来指定每个分区的Broker列表



## 六、实践相关

### Kafka 如何保证消息不丢失?

那面对“在使用 MQ 消息队列时，如何确保消息不丢失”这个问题时，你要怎么回答呢？首先，你要分析其中有几个考点，比如：

- 如何知道有消息丢失？

- 哪些环节可能丢消息？

- 如何确保消息不丢失？

**Kafka 只对“已提交”的消息（committed message）做有限度的持久化保证。**

一条消息从生产到消费完成这个过程，可以划分三个阶段

![](https://static001.geekbang.org/resource/image/81/05/81a01f5218614efea2838b0808709205.jpg)

#### 生产者丢数据

可能会有哪些因素导致消息没有发送成功呢？其实原因有很多，例如网络抖动，导致消息压根就没有发送到 Broker 端；或者消息本身不合格导致 Broker 拒绝接收（比如消息太大了，超过了 Broker 的承受能力）等

解决此问题的方法非常简单：**Producer 永远要使用带有回调通知的发送 API，也就是说不要使用 producer.send(msg)，而要使用 producer.send(msg, callback)**。不要小瞧这里的 callback（回调），它能准确地告诉你消息是否真的提交成功了。一旦出现消息提交失败的情况，你就可以有针对性地进行处理。

#### Broker 丢数据

在存储阶段正常情况下，只要 Broker 在正常运行，就不会出现丢失消息的问题，但是如果 Broker 出现了故障，比如进程死掉了或者服务器宕机了，还是可能会丢失消息的。

所以 Broker 会做副本，保证一条消息至少同步两个节点再返回 ack

#### 消费者丢数据

Consumer 端丢失数据主要体现在 Consumer 端要消费的消息不见了。Consumer 程序有个“位移”的概念，表示的是这个 Consumer 当前消费到的 Topic 分区的位置。下面这张图清晰地展示了 Consumer 端的位移数据。

![](https://static001.geekbang.org/resource/image/0c/37/0c97bed3b6350d73a9403d9448290d37.png)

比如对于 Consumer A 而言，它当前的位移值就是 9；Consumer B 的位移值是 11。

这里的“位移”类似于我们看书时使用的书签，它会标记我们当前阅读了多少页，下次翻书的时候我们能直接跳到书签页继续阅读。

正确使用书签有两个步骤：第一步是读书，第二步是更新书签页。如果这两步的顺序颠倒了，就可能出现这样的场景：当前的书签页是第 90 页，我先将书签放到第 100 页上，之后开始读书。当阅读到第 95 页时，我临时有事中止了阅读。那么问题来了，当我下次直接跳到书签页阅读时，我就丢失了第 96～99 页的内容，即这些消息就丢失了。

同理，Kafka 中 Consumer 端的消息丢失就是这么一回事。要对抗这种消息丢失，办法很简单：**维持先消费消息（阅读），再更新位移（书签）的顺序**即可。这样就能最大限度地保证消息不丢失。

当然，这种处理方式可能带来的问题是消息的重复处理，类似于同一页书被读了很多遍，但这不属于消息丢失的情形。

**如果是多线程异步处理消费消息，Consumer 程序不要开启自动提交位移，而是要应用程序手动提交位移**。



#### 最佳实践

1. 不要使用 producer.send(msg)，而要使用 producer.send(msg, callback)。记住，一定要使用带有回调通知的 send 方法。
2. 设置 `acks = all`。acks 是 Producer 的一个参数，代表了你对“已提交”消息的定义。如果设置成 all，则表明所有副本 Broker 都要接收到消息，该消息才算是“已提交”。这是最高等级的“已提交”定义。
3. 设置 retries 为一个较大的值。这里的 retries 同样是 Producer 的参数，对应前面提到的 Producer 自动重试。当出现网络的瞬时抖动时，消息发送可能会失败，此时配置了 retries > 0 的 Producer 能够自动重试消息发送，避免消息丢失。
4. 设置参数 `retry.backoff.ms`。指消息生产超时或失败后重试的间隔时间，单位是毫秒。如果重试时间太短，会出现系统还没恢复就开始重试的情况，进而导致再次失败。300 毫秒算是比较合适的。
5. 设置 `unclean.leader.election.enable = false`。这是 Broker 端的参数，指是否能把非 ISR 集合中的副本选举为 leader 副本。unclean.leader.election.enable = true，也就是说允许非 ISR 集合中的 follower 副本成为 leader 副本。如果一个 Broker 落后原先的 Leader 太多，那么它一旦成为新的 Leader，必然会造成消息的丢失。故一般都要将该参数设置成 false，即不允许这种情况的发生。
6. 设置 `replication.factor >= 3`。这也是 Broker 端的参数，表示分区副本的个数。其实这里想表述的是，最好将消息多保存几份，毕竟目前防止消息丢失的主要机制就是冗余。
7. 设置 `min.insync.replicas > 1`。这依然是 Broker 端参数，指的是 ISR 最少的副本数量。在实际环境中千万不要使用默认值 1。
8. 确保 replication.factor > min.insync.replicas。如果两者相等，那么只要有一个副本挂机，整个分区就无法正常工作了。我们不仅要改善消息的持久性，防止数据丢失，还要在不降低可用性的基础上完成。推荐设置成 replication.factor = min.insync.replicas + 1。
9. 确保消息消费完成再提交。Consumer 端有个参数 `enable.auto.commit`，最好把它设置成 false，并采用手动提交位移的方式。如果把参数 enable.auto.commit 设置为 true 就表示消息偏移量是由消费端自动提交，由异步线程去完成的，业务线程无法控制。如果刚拉取了消息之后，业务处理还没进行完，这时提交了消息偏移量但是消费者却挂了，这就造成还没进行完业务处理的消息的位移被提交了，下次再消费就消费不到这些消息，造成消息的丢失。

> 相关设置
> 
> - Producer：ack， retry
>- Broker: replica、min_isr、unclen.electron、log.flush.messages
> - Consumer: offset_commit



### Kafka 如何保证消息不被重复消费？

Kafka 又是如何做到消息不重复的，也就是：生产端不重复生产消息，服务端不重复存储消息，消费端也不能重复消费消息。

相较上面“消息不丢失”的场景，“消息不重复”的服务端无须做特别的配置，因为服务端不会重复存储消息，如果有重复消息也应该是由生产端重复发送造成的。

#### 生产者：不重复生产消息

生产端发送消息后，服务端已经收到消息了，但是假如遇到网络问题，无法获得响应，生产端就无法判断该消息是否成功提交到了 Kafka，而我们一般会配置重试次数，但这样会引发生产端重新发送同一条消息，从而造成消息重复的发送。

对于这个问题，Kafka 0.11.0 的版本之前并没有什么解决方案，不过从 0.11.0 的版本开始，Kafka 给每个生产端生成一个唯一的 ID，并且在每条消息中生成一个 sequence num，sequence num 是递增且唯一的，这样就能对消息去重，达到一个生产端不重复发送一条消息的目的。

但是这个方法是有局限性的，只对在一个生产端内生产的消息有效，如果一个消息分别在两个生产端发送就不行了，还是会造成消息的重复发送。好在这种可能性比较小，因为消息的重试一般会在一个生产端内进行。当然，对应一个消息分别在两个生产端发送的请求我们也有方案，只是要多做一些补偿的工作，比如，我们可以为每一个消息分配一个全局 ID，并把全局 ID 存放在远程缓存或关系型数据库里，这样在发送前可以判断一下是否已经发送过了。

> 保证消息队列的幂等性的方案？
>
> 1. 向数据库insert数据时，先**根据主键查询，若数据存在则不insert，改为update**
> 2. 向Redis中写数据可以用**set去重，天然保证幂等性**
> 3. 生产者发送每条消息时，增加一个全局唯一id（类似订单id），消费者消费到时，先**根据这个id去Redis中查询是否消费过该消息**。如果没有消费过，就处理，将id写入Redis；如果消费过了，那么就不处理，保证不重复处理相同消息。
> 4. 基于数据库的**唯一键约束**来保证不会插入重复的数据，当消费者企图插入重复数据到数据库时，会报错。
>
> 如果数据量超级大的话，还有种方案使用布隆过滤器 + redis 的方案 + 唯一索引，**层层削流**，就是**确保到达数据库的流量最小化**。
>
> 首先，一个请求过来的时候，我们会利用布隆过滤器来判断它有没有被处理过。如果布隆过滤器说没有处理过，那么就确实没有被处理过，可以直接处理。如果布隆过滤器说处理过（可能是假阳性），那么就要执行下一步。
>
> 第二步就是利用 Redis 存储近期处理过的 key。如果 Redis 里面有这个 key，说明它的确被处理过了，直接返回，否则进入第三步。这一步的关键就是 key的过期时间应该是多长。
>
> 第三步则是利用唯一索引，如果唯一索引冲突了，那么就代表已经处理过了。这个唯一索引一般就是业务的唯一索引，并不需要额外创建一个索引。

#### 消费端：不能重复消费消息

比如说你在处理消息完毕之后，准备提交了。这个时候突然宕机了，没有提交。等恢复过来，你会再次消费同一个消息。

为了保证消息不重复，消费端就不能重复消费消息，该如何去实现呢？消费端需要做好如下配置。

第一步，设置 `enable.auto.commit=false`。跟前面一样，这里同样要避免自动提交偏移量。你可以想象这样一种情况，消费端拉取消息和处理消息都完成了，但是自动提交偏移量还没提交消费端却挂了，这时候 Kafka 消费组开始重新平衡并把分区分给另一个消费者，由于偏移量没提交新的消费者会重复拉取消息，这就最终造成重复消费消息。

第二步，单纯配成手动提交同样不能避免重复消费，还需要消费端使用正确的消费“姿势”。这里还是先看下图这种情况：

![](https://s0.lgstatic.com/i/image6/M01/4D/0A/Cgp9HWDtPCWAYncVABfKsdCDbq0367.png)

消费者拉取消息后，先提交 offset 后再处理消息，这样就不会出现重复消费消息的可能。但是你可以想象这样一个场景：在提交 offset 之后、业务逻辑处理消息之前出现了宕机，待消费者重新上线时，就无法读到刚刚已经提交而未处理的这部分消息（这里对应图中 5~8 这部分消息），还是会有少消费消息的情况。

```java
List<String> messages = consumer.poll();
consumer.commitOffset();
processMsg(messages);
```



### Kafka 如何保证消息的顺序消费?

> 如果你用的是单分区解决方案，那么有没有消息积压问题？如果有，你是怎么解决的？
>
> 如果你用的是多分区解决方案，那么有没有分区负载不均衡的问题？如果有，你是怎么解决的？

- 1 个 Topic 只创建 1 个Partition(分区)，这样生产者的所有数据都发送到了一个 Partition，保证了消息的消费顺序（这样的坏处就是磨灭了 kafka 最优秀的特性。所以可以思考下是不是技术选型有问题， kafka本身适合与流式大数据量，要求高吞吐，对数据有序性要求不严格的场景。

- 如果我们要求的是全局有序，那除了换更加强大的机器就没别的办法了。而事实上，大部分的业务场景要求的都不是全局有序，而是业务内有序。例如要求同一个订单创建订单的消息应该先于完成支付消息，但是不会要求不同订单之间的消息是有序的。在这种场景下，可以使用多分区方案。只需要确保同一个业务的消息发送到同一个分区就可以保证同一个业务的消息是有序的。

- 生产者在发送消息的时候指定要发送到哪个 Partition

  > 怎么指定呢？我们需要将 producer 发送的数据封装成一个 ProducerRecord 对象。
  >
  > 1. 指明 partition 的情况下，直接将指明的值作为 partiton 值；
  >
  > 2. 没有指明 partition 值但有 key 的情况下，将 key 的 hash 值与 topic 的 partition数进行取余得到 partition 值；
  >
  >    在 Producer 往 Kafka 插入数据时，控制同一Key分发到同一 Partition，并且设置参数`max.in.flight.requests.per.connection=1`，也即同一个链接只能发送一条消息，如此便可严格保证 Kafka 消息的顺序
  >
  > 3. 既没有 partition 值又没有 key 值的情况下，第一次调用时随机生成一个整数（后面每次调用在这个整数上自增），将这个值与 topic 可用的 partition 总数取余得到 partition 值，也就是常说的 round-robin 算法。

但是缺点有两个，一个是数据不均匀，另一个是增加分区可能导致消息失序。

- **数据不均匀**
  - 数据不均匀一般是业务造成的。在我们的方案里面，分区是根据业务特征来选择的，那么自然有一些分区有很多数据，有一些分区数据很少。比如说万一我们不小心把热点用户的消息都发到了同一个分区里面，那么这个分区的 QPS 就会很高，消费者也不一定来得及消费，就可能引起消息积压。
  - 要想解决这个问题，可以通过改进计算目标分区的方式来解决，比如说采用类似于 Redis 中槽和槽分配的机制，又或者说一致性哈希算法，基本上就能解决这个问题了。

- **增加分区引起消息失序**

  - 对于新加入的分区，可以暂停消费一段时间。比如说在前面的例子中，如果我们估算 msg1 会在一分钟内被消费，那么新加入的

    分区的消费者可以在三分钟后再开始消费。



### Kafka 如何处理消息积压问题？

> 你们公司消息队列的监控有哪些？可以利用哪些监控指标来确定消息是否积压？ 在发现消息积压的时候，能不能利用监控的消费速率和生产速率，来推断多久以后积压的 消息会被处理完毕？ 你们公司消息积压的真实案例，包括故障原因、发现和定位过程、最终解决方案。 你负责的业务使用的 topic 还有对应的分区数量。 
>
> 你的业务 topic 里面用了几个分区？你是怎么确定分区数量的？
>
> 如果分区数量不够会发生 什么？ 什么情况下会发生消息积压？怎么解决消息积压的问题？ 
>
> 在异步消费的时候，如果你拉取了一批消息，还没来得及提交就宕机了会发生什么？

如果出现积压，那一定是性能问题，想要解决消息从生产到消费上的性能问题，就首先要知道哪些环节可能出现消息积压，然后在考虑如何解决。

因为消息发送之后才会出现积压的问题，所以和消息生产端没有关系，又因为绝大部分的消息队列单节点都能达到每秒钟几万的处理能力，相对于业务逻辑来说，性能不会出现在中间件的消息存储上面。毫无疑问，出问题的肯定是消息消费阶段，那么从消费端入手，如何回答呢？

1. **提高消费者的处理能力**

- **增加消费者实例**：

  - 可以通过增加消费者实例来提高消息处理能力。这可以通过增加消费者数量来实现，确保每个分区都有一个消费者进行处理。

  - 使用消费者组来实现负载均衡，每个消费者组中的消费者实例会自动分配分区。

- **优化消费者逻辑**：

  - 确保消费者处理逻辑高效，减少每条消息的处理时间。

  - 使用批处理来减少I/O操作的频率，例如一次性消费多条消息并进行批量处理。

- **水平扩展**：
  - 消费端的性能优化除了优化消费业务逻辑以外，也可以通过水平扩容，增加消费端的并发数来提升总体的消费性能。特别需要注意的一点是，**在扩容 Consumer 的实例数量的同时，必须同步扩容主题中的分区（也叫队列）数量，确保 Consumer 的实例数和分区数量是相等的。**如果 Consumer 的实例数量超过分区数量，这样的扩容实际上是没有效果的。原因我们之前讲过，因为对于消费者来说，在每个分区上实际上只能支持单线程消费。

2. **增加Kafka的吞吐量**

- **优化Kafka配置**：

  - 调整Kafka的分区数（partitions），增加主题的分区数可以提高并行处理的能力。

  - 配置适当的生产者和消费者参数，例如`acks`, `batch.size`, `linger.ms`等，以提高消息的发送和接收性能。

- **硬件升级**：

  - 增加Kafka服务器的CPU、内存和磁盘性能，确保Kafka服务器具有足够的资源处理高负载。

  - 使用更快的网络连接，以减少网络延迟和提高数据传输速度。

3. **优化数据流**

- **数据过滤和压缩**：

  - 在生产者端过滤不必要的数据，减少发送到Kafka的消息量。

  - 使用Kafka的消息压缩功能（如gzip, snappy），减少消息的大小，提高传输效率。

- **异步处理**：
  - 使用异步处理机制，消费者在消费消息后立即返回，不等待消息处理完成。消息处理可以交给后台线程或其他服务进行异步处理。

4. **监控和预警**

- **设置监控**：

  - 使用Kafka自带的监控工具或第三方监控工具（如Prometheus, Grafana），实时监控Kafka的性能指标（如消息堆积量、消费者延迟等）。

  - 设置预警机制，当消息堆积超过一定阈值时，及时通知运维人员进行处理。

5. **数据再均衡**

- **再均衡消费者分区**：

  - 使用Kafka的再均衡机制，确保消费者分区分配均匀，避免某些消费者处理负载过重。

  - 通过调整分区策略，使得消息在各个分区之间均匀分布。

> 如果是线上突发问题，要临时扩容，增加消费端的数量，与此同时，降级一些非核心的业务。通过扩容和降级承担流量，这是为了表明你对应急问题的处理能力。
>
> 其次，才是排查解决异常问题，如通过监控，日志等手段分析是否消费端的业务逻辑代码出现了问题，优化消费端的业务处理逻辑。
>
> 最后，如果是消费端的处理能力不足，可以通过水平扩容来提供消费端的并发处理能力，但这里有一个考点需要特别注意， 那就是在扩容消费者的实例数的同时，必须同步扩容主题 Topic 的分区数量，确保消费者的实例数和分区数相等。如果消费者的实例数超过了分区数，由于分区是单线程消费，所以这样的扩容就没有效果。
>
> 比如在 Kafka 中，一个 Topic 可以配置多个 Partition（分区），数据会被写入到多个分区中，但在消费的时候，Kafka 约定一个分区只能被一个消费者消费，Topic 的分区数量决定了消费的能力，所以，可以通过增加分区来提高消费者的处理能力。

> 要确定新的分区数量的最简单的做法就是用平均生产者速率除以单一消费者的 消费速率。 比如说所有的生产者合并在一起，QPS 是 3000。而一个消费者处理的 QPS 是 200，那么 $3000 \div 200 = 15$。也就是说你需要 15 个分区。进一步考虑 业务增长或者突发流量，可以使用 18 个或者 20 个



### 谈一谈 Kafka 的再均衡

Kafka的再均衡（Rebalancing）是消费者组（Consumer Group）中的一个关键概念，它是指当消费者组中的成员发生变动时（例如，新消费者加入组、现有消费者崩溃或离开组），Kafka重新分配分区（Partition）给消费者组中的所有消费者的过程。

以下是关于Kafka再均衡的一些要点：

1. **消费者组**：Kafka中的消费者通常以组的形式存在。消费者组中的所有消费者协调合作，平均分配订阅主题的所有分区，以实现负载均衡。

2. **再均衡触发条件**：

   - 组成员发生变更(新consumer加入组、已有consumer主动离开组或已有consumer崩溃了)
   - 订阅主题数发生变更，如果你使用了正则表达式的方式进行订阅，那么新建匹配正则表达式的topic就会触发rebalance
   - 订阅主题的分区数发生变更 

3. **再均衡过程**：

   - 当触发再均衡条件时，当前所有的消费者都会暂停消费，以便进行分区的重新分配。
   - 消费者组中的某个消费者（通常是组协调者，Group Coordinator）负责发起再均衡过程。
   - 协调者计算新的分区分配方案，并将方案广播给组内的所有消费者。
   - 所有消费者根据新的分配方案重新分配分区，并开始从新分配的分区中读取数据。

   > 和旧版本consumer依托于Zookeeper进行rebalance不同，新版本consumer使用了Kafka内置的一个全新的组协调协议（group coordination protocol）。
   >
   > 对于每个组而言，Kafka的某个broker会被选举为组协调者（group coordinator）。
   >
   > Kafka新版本 consumer 默认提供了多种分配策略
   >
   > - Kafka提供了多种再均衡策略，可以通过配置`partition.assignment.strategy`参数进行设置：
   >   - **RangeAssignor**：按范围分配分区。每个消费者分配一组连续的分区。
   >   - **RoundRobinAssignor**：以轮询方式分配分区。分区尽可能均匀地分配给所有消费者。
   >   - **StickyAssignor**：在保持现有分区分配的基础上，尽量少地移动分区。
   >   - **CooperativeStickyAssignor**：一种渐进的再均衡策略，最小化分区移动，并确保消费者间的平衡。
   >
   > 1. 所有成员都向 coordinator 发送请求，请求入组。一旦所有成员都发送了请求，coordinator 会从中选择一个consumer 担任 leader 的角色，并把组成员信息以及订阅信息发给 leader。
   >
   > 2. leader 开始分配消费方案，指明具体哪个 consumer 负责消费哪些 topic 的哪些 partition。一旦完成分配，leader 会将这个方案发给 coordinator。coordinator 接收到分配方案之后会把方案发给各个 consumer，这样组内的所有成员就都知道自己应该消费哪些分区了。

4. **再均衡的影响**：

   - 在再均衡期间，消费者组的消费者将无法消费数据，这可能导致短暂的服务中断。
   - 再均衡完成后，每个消费者将开始从其分配到的分区中读取数据，这可能会导致已经提交的偏移量被覆盖。

5. **再均衡的优化**：

   - 尽量减少再均衡的发生，例如，避免频繁地添加或移除消费者。
   - 使用`max.poll.interval.ms`配置参数来设置消费者在两次轮询之间的最大时间间隔，这有助于控制再均衡的触发。
   - 使用`session.timeout.ms`配置参数来设置消费者与组协调者会话的超时时间，这有助于在消费者崩溃时快速触发再均衡。

6. **消费者偏移量管理**：

   - 在再均衡期间，消费者可能会丢失或提交新的偏移量。因此，合理管理偏移量非常重要，例如，使用Kafka提供的自动提交偏移量功能或手动管理偏移量。

7. **再均衡监听器**：

   - Kafka消费者API提供了再均衡监听器（`ConsumerRebalanceListener`），允许开发者在再均衡发生前后执行特定的操作，例如，在再均衡前保存当前的消费状态，在再均衡后恢复消费。

8. **再均衡与消费者故障转移**：

   - 再均衡是Kafka处理消费者故障转移的一种机制。当消费者崩溃时，Kafka会触发再均衡，将崩溃消费者负责的分区分配给其他消费者，以确保数据仍然可以被消费。

再均衡是Kafka消费者模型的一个核心特性，它允许消费者组动态地适应消费者数量和订阅主题的变化。然而，再均衡也可能带来一些性能影响，因此在设计和配置Kafka消费者时，需要仔细考虑这些因素。



### 创建topic时如何选择合适的分区数？

> 每天两三亿数据量，每秒几千条，设置多少分区合适

- 通过吞吐量需求确定分区数
- 通过消费者数确定分区数：分区数决定了消费者组中并行消费的最大数量。每个分区只能由一个消费者实例处理，所以分区数至少应与消费者实例数相等，以确保每个消费者都有分区可消费
- 负载均衡和高可用性：更多的分区有助于更均匀地分布负载，并提高高可用性。分区可以分布在不同的Broker上，分散负载，避免单点瓶颈
- 消息顺序性：如果应用程序要求严格的消息顺序，分区数的选择需要考虑到这一点。每个分区内部保证消息的顺序，但不同分区之间的消息顺序不保证
- Kafka和系统的限制：Kafka和底层系统对分区数有一定的限制，特别是在分区数非常大的情况下
- 调整和优化：在实际部署中，分区数并不是一成不变的。根据实际使用情况，可以动态调整分区数。



### Kafka 是否支持动态增加和减少分区

Kafka支持动态增加分区，但不支持减少分区。

- 动态增加分区的影响
  - **负载均衡**：增加分区后，可以重新分配分区到消费者，提供更好的负载均衡。
  - **吞吐量提升**：增加分区数目能够提升Kafka集群的吞吐量，因为更多的分区意味着可以并行处理更多的消息。

- **动态增加分区的限制**
  - **数据顺序性**：对于依赖消息顺序的应用程序，增加分区可能会影响数据的顺序性，因为新的消息可能会分配到新的分区。
  - **重新分配成本**：增加分区后，可能需要重新分配分区到不同的Broker，这会带来额外的网络和I/O负载。

Kafka目前不支持动态减少分区。这是因为减少分区会涉及到数据的重新分配和合并，这会导致很大的复杂性和潜在的数据丢失风险

**原因**：

- **数据迁移复杂性**：减少分区需要将现有分区的数据迁移到其他分区，这会带来巨大的I/O负载和复杂的迁移逻辑。
- **数据一致性风险**：在减少分区的过程中，可能会有数据丢失或数据不一致的风险，这对于生产环境是不容忽视的。



## 七、其他

### Kafka 为什么能那么快 | Kafka高效读写数据的原因 | 吞吐量大的原因？

从**零拷贝、page cache、顺序写、分区、分段与索引、批量处理、压缩**

- partition 并行处理
- 顺序写磁盘，充分利用磁盘特性
- 利用了现代操作系统分页存储 Page Cache 来利用内存提高 I/O 效率
- 采用了零拷贝技术（所谓的零拷贝，就是指没有 CPU 参与的拷贝）
  - Producer 生产的数据持久化到 broker，采用 mmap 文件映射，实现顺序的快速写入
  - Customer 从 broker 读取数据，采用 sendfile，将磁盘文件读到 OS 内核缓冲区后，转到 NIO buffer进行网络发送，减少 CPU 消耗

>#### 零拷贝？
>
>零拷贝是中间件设计的通用技术，是指完全没有 CPU 参与的读写操作。我以从磁盘读数据，然后写到网卡上为例介绍一下。首先，应用程序发起系统调用，这个系统调用会读取磁盘的数据，读到内核缓存里面。同时，磁盘到内核缓存是 DMA 拷贝。然后再从内核缓存拷贝到 NIC 缓存中，这个过程也是 DMA 拷贝。这样就完成了整个读写操作。和普通的读取磁盘再发送到网卡比起来，零拷贝少了两次 CPU 拷贝，和两次内核态与用户态的切换。
>
>这里说的内核缓存，在 linux 系统上其实就是 page cache。
>
>#### page cache
>
>Kafka 充分利用了 page cache。Kafka 写入的时候只是写入到了 pagecache，这几乎等价于一个内存写入操作，然后依靠异步刷新把数据刷新到磁盘上。而 page cache 是可以存放很多数据的，也就是说 Kafka 本身调用了很多次写入操作之后，才会真的触发 IO 操作，提高了性能。而且，Kafka 是基于JVM 的，那么利用 page cache 也能缓解垃圾回收的压力。大多数跟 IO 操作打交道的中间件都有类似的机制，比如说 MySQL、Redis。
>
>不过使用 page cache 的缺陷就是如果消息还没刷新到磁盘上，服务器就宕机了，那么整个消息就丢失了。
>
>#### 顺序写
>
>Kafka 在写入数据的时候就充分利用了顺序写的特性。它针对每一个分区，有一个日志文件 WAL（write-ahead log），这个日志文件是只追加的，也就是顺序写的，因此发消息的性能会很好。MySQL、Redis 和其他消息中间件也采用了类似的技术。
>
>但是 Kafka 的顺序写要求的是分区内部顺序写，不同的分区之间就不是顺序写的。所以如果一个 topic 下的分区数量不合理，偏多的话，写入性能是比较差的。
>
>举个例子，假如说要写入 100M 的数据，如果只有一个分区，那就是直接顺序写入 100M。但是如果有 100 个分区，每个分区写入 1M，它的性能是要差很多的。因为一个 topic 至少有一个分区，topic 多也会影响 Kafka 的性能。最好是在创建 topic 的时候就规划好分区，但是如果没规划好，还是得考虑解决。当然，如果分区太多，可以不适用，我们指定分区发送消息就可以。





### 基于kafka的延时队列和死信队列如何实现

延迟队列是一种特殊的队列。它里面的每个元素都有一个过期时间，当元素还没到过期时间 的时候，如果你试图从队列里面获取一个元素，你会被阻塞。当有元素过期的时候，你就会 拿到这个过期的元素。你可以这样想，你拿到的永远是最先过期的那个元素。

很多语言本身就提供了延迟队列的实现，比如说在 Java 里面的 DelayQueue。

死信队列是一种逻辑上的概念，也就是说它本身只是一个普通的队列。而死信的意思是指过 期的无法被消费的消息，这些消息会被投送到这个死信队列。

基于Kafka实现延时队列和死信队列可以有效地处理消息的延迟投递和异常消息处理。以下是详细的实现方法：

#### 实现延时队列

延时队列用于将消息在特定时间后再投递。实现Kafka延时队列的方法有几种，以下是其中一种常用方法：

方法：**使用多个主题和定时任务**

1. **创建多个主题**：创建一组按延迟时间分隔的Kafka主题，如`delay-1min`, `delay-5min`, `delay-10min`等。

2. **生产者发送消息**：生产者根据消息的延迟时间，将消息发送到相应的延迟主题。

   ```java
   public void sendMessage(String topic, String key, String message, long delay) {
       // 计算目标主题
       String delayTopic = getDelayTopic(delay);
       // 发送消息到延迟主题
       kafkaTemplate.send(delayTopic, key, message);
   }
   
   private String getDelayTopic(long delay) {
       if (delay <= 60000) {
           return "delay-1min";
       } else if (delay <= 300000) {
           return "delay-5min";
       } else {
           return "delay-10min";
       }
   }
   ```

3. **定时任务消费延迟主题**：使用定时任务或后台线程定期消费延迟主题，将消息转发到实际处理的主题。

   ```java
   @Scheduled(fixedRate = 60000)
   public void processDelayQueue() {
       ConsumerRecords<String, String> records = kafkaConsumer.poll(Duration.ofMillis(1000));
       for (ConsumerRecord<String, String> record : records) {
           // 将消息转发到实际处理的主题
           kafkaTemplate.send("actual-topic", record.key(), record.value());
       }
   }
   ```

> 这个方案的缺点其实还挺严重的。第一个是延迟时间必须预先设定好，比如只 能允许延迟 1min、3min 或者 10min 的消息，不支持随机延迟时间。不过绝大多数情况下，业务是用不着非得 随机延迟时间的。
>
> 在一些 业务场景下，需要根据具体业务数据来计算延迟时间，那么这个就不适用了。 
>
> 第二个是分区之间负载不均匀。比如很多业务可能只需要延迟 3min，那么 1min 和 10min 分区的数据就很少。这会进一步导致一个问题，就是负载高的 分区会出现消息积压的问题。 在这里，很多解决消息积压的手段都无法使用，所以只能考虑多设置几个延迟 时间相近的分区，比如说在 3min 附近设置 2min30s，3min30s 这种分区来分 摊压力。
>
> 还要考虑一致性问题，比如发送延时队列失败、或者转发到业务 topic 时失败，要怎么处理

#### 实现死信队列

死信队列用于处理由于各种原因无法成功处理的消息。实现 Kafka 死信队列的方法如下：

1. **创建死信主题**：创建一个专门的死信主题，如`dead-letter-topic`。

2. **配置消费者处理逻辑**：在消费者逻辑中捕获处理失败的异常，将失败的消息发送到死信主题。

   ```java
   public void consume(ConsumerRecord<String, String> record) {
       try {
           // 处理消息
           processMessage(record.value());
       } catch (Exception e) {
           // 将处理失败的消息发送到死信主题
           kafkaTemplate.send("dead-letter-topic", record.key(), record.value());
       }
   }
   
   private void processMessage(String message) {
       // 处理消息逻辑
       if (message.contains("error")) {
           throw new RuntimeException("处理失败");
       }
   }
   ```

3. **监控死信队列**：定期检查死信主题中的消息，分析和处理这些失败的消息。

   ```java
   @Scheduled(fixedRate = 60000)
   public void processDeadLetterQueue() {
       ConsumerRecords<String, String> records = kafkaConsumer.poll(Duration.ofMillis(1000));
       for (ConsumerRecord<String, String> record : records) {
           // 记录或重试处理死信消息
           logger.error("处理死信消息: " + record.value());
       }
   }
   ```

**优点**：

- **解耦**：使用Kafka主题来实现延时和死信队列，可以解耦生产者和消费者。
- **扩展性**：Kafka天然支持分布式和高吞吐量，适合大规模消息处理。

**局限性**：

- **复杂性**：需要管理多个主题和定时任务，增加了系统复杂性。
- **延迟精度**：延时队列的延迟精度取决于定时任务的执行频率，可能无法达到毫秒级精度。



### Kafka 目前有哪些内部 topic，他们都有什么特征，各自的作用又是什么？

Kafka的内部主题（Internal Topics）是系统自动创建和管理的，用于维护集群的元数据和协调操作。以下是一些常见的Kafka内部主题及其特征和作用：

1. **__consumer_offsets**
   - 特征：这个主题用于存储消费者组的偏移量信息。
   - 作用：跟踪每个消费者组消费到每个分区的偏移量，确保消费者可以在重新启动后从正确的位置继续消费。
2. **__transaction_state**
   - 特征：这个主题用于存储Kafka事务日志。
   - 作用：记录事务的状态信息，如事务的开始、提交或结束，用于维护事务的一致性和完整性。
3. **__consumer_offsets-[consumer_group_id]**
   - 特征：对于每个消费者组，Kafka会创建一个单独的内部主题来存储该组的偏移量。
   - 作用：这些主题是__consumer_offsets的分区，每个分区对应一个消费者组，用于存储该组的偏移量信息。
4. **__transaction_offsets**
   - 特征：这个主题用于存储事务的偏移量。
   - 作用：跟踪每个事务的当前偏移量，确保事务在提交或恢复时能够从正确的位置开始。
5. **__cluster_metadata**
   - 特征：这个主题用于存储集群的元数据信息。
   - 作用：记录集群的Broker列表、主题信息、分区信息等元数据，用于集群的管理和维护。
6. **__controller_epoch**
   - 特征：这个主题用于存储控制器（Controller）的epoch信息。
   - 作用：控制器是Kafka集群中的一个特殊Broker，负责管理分区和副本的状态。这个主题记录控制器的状态和版本信息，确保集群的稳定性。
7. **__replicator**
   - 特征：这个主题用于在Kafka集群之间复制数据。
   - 作用：在Kafka MirrorMaker或跨集群复制场景中，用于同步数据到目标集群。



### kafka中的幂等是怎么实现的

Kafka中，幂等性（Idempotence）指的是发送消息到Kafka集群时，即使多次发送相同的消息，也不会导致消息被多次处理或产生副作用。Kafka通过以下机制实现幂等性：

1. **Producer ID（PID）**
   - 每个幂等性生产者在初始化时都会分配一个唯一的Producer ID（PID）。这个ID用于标识该生产者实例。

2. **序列号**

   - 每个消息（Record）在发送时都会被分配一个序列号。这个序列号是生产者在每个分区上单调递增的。

   - 序列号和PID结合使用，可以唯一标识每个消息。

3. **幂等性保证逻辑**

   - Kafka Broker会维护每个生产者的PID和序列号的映射表。当Broker接收到一条消息时，会检查这条消息的PID和序列号。

   - 如果消息的PID和序列号与之前接收到的消息相同，则Broker会丢弃这条消息，避免重复写入。

4. **重试机制**
   - 如果消息发送失败，幂等性生产者会自动重试。由于PID和序列号的机制，即使发生重试，也不会导致消息重复写入。



### 为什么kafka不支持读写分离？

Kafka不支持读写分离的主要原因与其设计原则、性能优化以及数据一致性需求密切相关。以下是详细解释：

1. **数据一致性**

   Kafka的设计目标之一是保证消息的强一致性。在Kafka中，每个分区都有一个Leader和多个Follower。所有的写操作必须先写入Leader，然后Leader会将数据复制到Follower。

   - **单点写入**：所有写操作通过Leader进行，确保数据的一致性。Follower从Leader同步数据，保持与Leader的数据一致。

   - **一致性保障**：如果允许读操作从Follower读取数据，由于Follower可能会滞后于Leader，可能导致读取到不一致的数据。

2. **简化设计和高性能**

   Kafka的设计理念是保持架构的简洁和高效，这对于实现**高吞吐量和低延迟**的消息系统至关重要。

   - **单一机制**：通过仅允许Leader处理写操作和大部分读操作，Kafka简化了其数据一致性和分布式处理逻辑。

   - **性能优化**：Leader处理读写操作，避免了在Follower上实现复杂的读一致性逻辑，这简化了实现并优化了性能。

3. 高可用性和故障恢复

   Kafka通过Leader和Follower机制来保证高可用性和快速故障恢复。

   - **快速恢复**：在Leader故障时，从ISR（In-Sync Replicas）中选举新的Leader。如果读操作允许从Follower读取，故障恢复过程会变得复杂，因为需要确保新Leader的Follower数据是一致且最新的。

   - **简化故障处理**：仅从Leader读取和写入，使得故障处理逻辑更简单，确保系统在故障恢复过程中仍然可以提供强一致性的数据服务。

4. **可预见的负载分布**

   通过将所有写操作集中在Leader上，Kafka可以更好地预测和管理系统负载。

   - **预防热点**：避免Follower节点成为读请求的热点，导致不均衡的资源消耗。

   - 负载管理：可以更好地管理和调配系统资源，避免由于Follower读请求导致的不均衡负载。

Kafka的设计理念和架构决定了不支持读写分离，主要是为了保证数据一致性、简化设计和优化性能。通过集中处理写操作和大部分读操作，Kafka能够提供高吞吐量、低延迟和高可靠性的消息服务。	



### KafkaConsumer是非线程安全的，那怎么实现多线程消费?

- 每个线程一个KafkaConsumer实例：最简单且常见的方法是每个线程创建一个KafkaConsumer实例。这种方式可以确保每个消费者实例在独立的线程中运行，避免线程安全问题。

- 单个KafkaConsumer实例多线程处理：单个KafkaConsumer实例从Kafka中拉取消息，然后将这些消息分发到多个工作线程进行处理。这样可以利用多线程处理的优势，同时避免了KafkaConsumer的线程安全问题。

  

### 如果让你设计一个MQ，你怎么设计？

其实回答这类问题，说白了，起码不求你看过那技术的源码，起码你大概知道那个技术的基本原理，核心组成部分，基本架构构成，然后参照一些开源的技术把一个系统设计出来的思路说一下就好

比如说这个消息队列系统，我们来从以下几个角度来考虑一下

1. 首先这个mq得支持可伸缩性吧，就是需要的时候快速扩容，就可以增加吞吐量和容量，那怎么搞？设计个分布式的系统呗，参照一下kafka的设计理念，broker -> topic -> partition，每个partition放一个机器，就存一部分数据。如果现在资源不够了，简单啊，给topic增加partition，然后做数据迁移，增加机器，不就可以存放更多数据，提供更高的吞吐量了？
2. 其次你得考虑一下这个mq的数据要不要落地磁盘吧？那肯定要了，落磁盘，才能保证别进程挂了数据就丢了。那落磁盘的时候怎么落啊？顺序写，这样就没有磁盘随机读写的寻址开销，磁盘顺序读写的性能是很高的，这就是kafka的思路。
3. 其次你考虑一下你的mq的可用性啊？这个事儿，具体参考我们之前可用性那个环节讲解的kafka的高可用保障机制。多副本 -> leader & follower -> broker挂了重新选举leader即可对外服务。
4. 能不能支持数据0丢失啊？可以的，参考我们之前说的那个kafka数据零丢失方案

实现一个  MQ 肯定是很复杂的，其实这是个开放题，就是看看你有没有从架构角度整体构思和设计的思维以及能力。
