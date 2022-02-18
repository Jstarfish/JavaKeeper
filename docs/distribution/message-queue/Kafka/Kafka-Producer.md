# KafkaProducer使用介绍、参数配置以及核心源码解析

## 前言

Kafka，作为目前在大数据领域应用最为广泛的消息队列，其内部实现和设计有很多值得深入研究和分析的地方，使用 kafka 首先需要接触到 producer 的开发，然后是 consumer 开发，自 0.8.2.x 版本以后，kafka 提供了 java 版本的 producer 以代替以前 scala 版本的 producer，下面进行 producer 的解析（新版本producer 指的是 kafka-client 包的 `org.apache.kafka.clients.producer`，而不是 kafka 包下的`kafka.producer.Producer`）。

## Producer 概要设计

发送简略流程图

![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gjmk1gaprjj30i906uwg3.jpg)

大体上来说，用户首先构建待发送的消息对象 ProducerRecord，然后调用 `KafkaProducer#send` 方法进行发送。KafkaProducer 接收到消息后首先对其进行序列化，然后通过分区器（partitioner）确定该数据需要发送的 Topic 的分区，kafka 提供了一个默认的分区器，如果消息指定了 key，那么 partitioner 会根据 key 的 hash 值来确定目标分区，如果没有指定 key，那么将使用轮询的方式确定目标分区，这样可以最大程度的均衡每个分区的消息，确定分区之后，将会进一步确认该分区的 leader 节点(处理该分区消息读写的主节点)，最后追加写入到内存中的消息缓冲池(accumulator)。此时 `KafkaProducer#send` 方法成功返回。

KafkaProducer 中还有一个专门的 Sender IO 线程负责将缓冲池中的消息分批次发送给对应的 broker，完成真正的消息发送逻辑。



## Producer 程序开发

代码很简单，拢共分为 4 步

![](https://i04piccdn.sogoucdn.com/4195c4ece7632219)

1. 配置 producer 参数
2. 构造 ProducerRecord 消息
3. 调用 send 方法进行发送
4. 最后关闭 producer 资源

### 异步提交

```java
public static void main(String[] args) {
    Properties properties = new Properties();
    // Kafka 服务端的主机名和端口号
    properties.put("bootstrap.servers", "10.202.253.240:9092");
    // 等待所有副本节点的应答
    properties.put("acks", "all");
    // 消息发送最大尝试次数
    properties.put("retries", 0);
    // 一批消息处理大小
    properties.put("batch.size", 16384);
    // 请求延时
    properties.put("linger.ms", 1);
    // 发送缓存区内存大小
    properties.put("buffer.memory", 33554432);
    // key 序列化
  properties.put("key.serializer","org.apache.kafka.common.serialization.StringSerializer");
    // value 序列化
  properties.put("value.serializer","org.apache.kafka.common.serialization.StringSerializer");
    Producer<String, String> producer = new KafkaProducer<String, String>(properties);
    for (int i = 0; i < 10; i++) {
        producer.send(new ProducerRecord<String, String>("test",
                Integer.toString(i), "hello world-" + i));
    }
    producer.close();
}
```

> 如果发送失败，也可能是 server.properties 配置的问题，不允许远程访问
>
> - 去掉注释，listeners=PLAINTEXT://:9092
> - 把 advertised.listeners 值改为 PLAINTEXT://host_ip:9092



### 同步提交

Kafka 的 Producer 发送消息采用的是异步发送的方式，`KafkaProducer` 的 `send` 方法返回 `Future` 对象，所以我们可以手动调用 `Future` 对象的 `get` 方法实现同步：

```java
producer.send(new ProducerRecord<String, String>("test",
        Integer.toString(i), "hello world-" + i)).get();
```

get 方法将阻塞，直到返回结果 RecordMetadata，所以可以看成是同步的。

### 异步待回调函数

上边的异步提交方式，可以称为**发送并忘记**（不关心消息是否正常到达，对返回结果不做任何判断处理），所以 kafak 提供了一个带回调函数的 send 方法

```java
Future<RecordMetadata> send(ProducerRecord<K, V> producer, Callback callback);
```

Callback 是一个回调接口，在消息发送完成之后可以回调我们自定义的实现

```java
for (int i = 0; i < 10; i++) {
    producer.send(new ProducerRecord<String, String>("test",
            Integer.toString(i), "hello world-" + i), new Callback() {
        @Override
        public void onCompletion(RecordMetadata recordMetadata, Exception e) {
            if (e == null){
                System.out.println("TopicName : " + recordMetadata.topic() + " Partiton : " + recordMetadata
                        .partition() + " Offset : " + recordMetadata.offset());
            }
            else {
                //进行异常处理
            }
        }
    });
}
```

同样的也能获取结果，回调的时候会传递两个参数：

- `RecordMetadata` 和上文一致的消息发送成功后的元数据。
- `Exception` 消息发送过程中的异常信息。

但是这两个参数并不会同时都有数据，只有发送失败才会有异常信息，同时发送元数据为空。



**同步发送消息**

- 优点：可以保证每条消息准确无误的写入了 broker，对于立即需要发送结果的情况非常适用，在 producer 故障或者宕机的情况也可以保证结果的正确性

- 缺点：由于同步发送需要每条消息都需要及时发送到 broker，没有缓冲批量操作，性能较低

**异步发送消息**

- 优点：可以通过缓冲池对消息进行缓冲，然后进行消息的批量发送，大量减少了和 broker 的交互频率，性能极高，可以通过回调机制获取发送结果

- 缺点：在 producer 直接断电或者重启等故障，将有可能丢失消息发送结果，对消息准确性要求很高的场景不适用



### 带拦截器的 Producer

TODO







## Producer参数说明

- **bootstrap.servers**：Kafka 集群信息列表，用于建立到 Kafka 集群的初始连接，如果集群中机器数很多，只需要指定部分的机器主机的信息即可，不管指定多少台，producer 都会通过其中一台机器发现集群中所有的 broker，格式为 `hostname1:port,hostname2:port,hostname3:port`

- **key.serializer**：任何消息发送到 broker 格式都是字节数组，因此在发送到 broker 之前需要进行序列化，该参数用于对 ProducerRecord 中的 key 进行序列化

- **value.serializer**：该参数用于对 ProducerRecord 中的 value 进行序列化

  > kafka 默认提供了常用的序列化类，也可以通过实现 `org.apache.kafka.common.serialization.Serializer` 实现定义的序列化，Kafka 提供的序列化类如下：
  >
  > ![](https://static01.imgkr.com/temp/0997ff0db5a04501bc3438ed3b7402c9.png)

- **acks：**ack 具有 3 个取值 0、1 和 -1(all)

  - acks=0：producer 不等待 broker 的 ack，这一操作提供了一个最低的延迟，broker 一接收到还没有写入磁盘就已经返回，吞吐量最高，当 broker 故障时有可能**丢失数据**；
  - ack=1：producer 等待 broker 的 ack，partition 的 leader 落盘成功后返回 ack，如果在 follower 同步成功之前 leader 故障，那么将会**丢失数据**

  - acks=-1(all)：producer 等待 broker 的 ack，partition 的 leader 和 follower 全部落盘成功后才返回 ack。但是如果在 follower 同步完成后，broker 发送 ack 之前，leader 发生故障，那么就会造成**数据重复**

- **buffer.memory**：该参数用于设置发送缓冲池的内存大小，单位是字节。默认值 33554432KB（32M）
- **max.block.ms**：当 producer 缓冲满了之后，阻塞的时间
- **compression.type**：压缩类型，目前 kafka 支持四种种压缩类型 `gzip`、`snappy`、`lz4`、`zstd`，性能依次递增。默认值none（不压缩）
- **retries**：重试次数，0 表示不进行重试。默认值 2147483647
- **batch.size**：批次处理大小，通常增加该参数，可以提升 producer 的吞吐量，默认值 16384
- **linger.ms**：发送时延，和 batch.size 任满足其一条件，就会进行发送，减少网络IO，节省带宽之用。原理就是把原本需要多次发送的小batch，通过引入延时的方式合并成大batch发送，减少了网络传输的压力，从而提升吞吐量。当然，也会引入延时
- **max.request.size**：控制 producer 发送请求的大小
- **receive.buffer.bytes**：读取数据时要使用的 TCP 接收缓冲区（SO_RCVBUF）的大小。如果值为 -1，则将使用OS默认值。默认值 32768
- **send. buffer.bytes**：发送数据时使用的 TCP 发送缓冲区（SO_SNDBUF）的大小。如果值为-1，则将使用OS默认值。默认值131072
- **request.timeout.ms**：生产者发送数据时等待服务器返回响应的时间。默认值 30000ms



## 消息分区机制

消息发送时都被发送到一个 topic，它是承载真实数据的逻辑容器，其本质就是一个目录，而 topic 又是由一些 Partition Logs(分区日志)组成的

![](https://static001.geekbang.org/resource/image/18/63/18e487b7e64eeb8d0a487c289d83ab63.png)

**分区的原因：**

1. **方便在集群中扩展**，每个 Partition 可以通过调整以适应它所在的机器，而一个 topic 又可以有多个 Partition 组成，因此整个集群就可以适应任意大小的数据了；
2. **可以提高并发**，因为可以以 Partition 为单位读写了。

> 其实分区的作用就是提供负载均衡的能力，或者说对数据进行分区的主要原因，就是为了实现系统的高伸缩性（Scalability）。
>
> 不同的分区能够被放置到不同节点的机器上，而数据的读写操作也都是针对分区这个粒度而进行的，这样每个节点的机器都能独立地执行各自分区的读写请求处理。并且，我们还可以通过添加新的节点机器来增加整体系统的吞吐量。
>
> 实际上分区的概念以及分区数据库早在 1980 年就已经有大牛们在做了，比如那时候有个叫 Teradata 的数据库就引入了分区的概念。
>
> 值得注意的是，不同的分布式系统对分区的叫法也不尽相同。比如在 Kafka 中叫分区，在 MongoDB 和 Elasticsearch 中就叫分片 Shard，而在 HBase 中则叫 Region，在 Cassandra 中又被称作 vnode。从表面看起来它们实现原理可能不尽相同，但对底层分区（Partitioning）的整体思想却从未改变。

**分区的原则：**

我们需要将 producer 发送的数据封装成一个 ProducerRecord 对象。

```java
public ProducerRecord (String topic, Integer partition, Long timestamp, K key, V value, Iterable<Header> headers)
public ProducerRecord (String topic, Integer partition, Long timestamp, K key, V value)
public ProducerRecord (String topic, Integer partition, K key, V value, Iterable<Header> headers)
public ProducerRecord (String topic, Integer partition, K key, V value)
public ProducerRecord (String topic, K key, V value)
public ProducerRecord (String topic, V value)Copy to clipboardErrorCopied
```

1. 指明 partition 的情况下，直接将指明的值直接作为 partiton 值；
2. 没有指明 partition 值但有 key 的情况下，将 key 的 hash 值与 topic 的 partition 数进行取余得到 partition 值；
3. 既没有 partition 值又没有 key 值的情况下，第一次调用时随机生成一个整数（后面每次调用在这个整数上自增），将这个值与 topic 可用的 partition 总数取余得到 partition 值，也就是常说的 round-robin 算法。

**自定义分区器**

可以通过实现 `org.apache.kafka.clients.producer.Partitioner` 自定分区策略，在构造 KafkaProducer 时配置参数 `partitioner.class` 为自定义的分区类即可

```java
public class MyPartitioner implements Partitioner {

    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value,
                         byte[] valueBytes, Cluster cluster) {
        return 0;
    }

    @Override
    public void close() {

    }

    @Override
    public void configure(Map<String, ?> configs) {

    }
}
```



## 内部原理

Java producer(区别于Scala producer)是双线程的设计，分为 KafkaProducer 用户主线程和 Sender 线程

producer 总共创建两个线程：执行 `KafkaPrducer#send` 逻辑的线程——我们称之为“用户主线程”；执行发送逻辑的 IO 线程——我们称之为“Sender线程”

### 1. 序列化+计算目标分区

这是 `KafkaProducer#send` 逻辑的第一步，即为待发送消息进行序列化并计算目标分区，如下图所示：

![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gjmp7vf31tj30k103uq3n.jpg)

如上图所示，一条所属 topic 是"test"，消息体是"message"的消息被序列化之后结合 KafkaProducer 缓存的元数据(比如该 topic 分区数信息等)共同传给后面的 Partitioner 实现类进行目标分区的计算。

### 2. 追加写入消息缓冲区(accumulator)

producer 创建时会创建一个默认 32MB(由buffer.memory参数指定)的 accumulator 缓冲区，专门保存待发送的消息。除了之前在“关键参数”段落中提到的 linger.ms 和 batch.size 等参数之外，该数据结构中还包含了一个特别重要的集合信息：消息批次信息(batches)。该集合本质上是一个 HashMap，里面分别保存了每个 topic 分区下的batch 队列，即前面说的批次是按照 topic 分区进行分组的。这样发往不同分区的消息保存在对应分区下的 batch队列中。举个简单的例子，假设消息 M1, M2 被发送到 test 的 0 分区但属于不同的 batch，M3 分送到 test 的 1分区，那么 batches 中包含的信息就是：{"test-0" -> [batch1, batch2], "test-1" -> [batch3]}

单个 topic 分区下的 batch 队列中保存的是若干个消息批次。每个 batch 中最重要的 3 个组件包括：

- compressor: 负责执行追加写入操作
- batch缓冲区：由 batch.size 参数控制，消息被真正追加写入到的地方
- thunks：保存消息回调逻辑的集合

 这一步的目的就是将待发送的消息写入消息缓冲池中，具体流程如下图所示：

![](https://images2015.cnblogs.com/blog/735367/201702/735367-20170204164910854-2033381282.png)

okay！这一步执行完毕之后理论上讲 `KafkaProducer.send` 方法就执行完毕了，用户主线程所做的事情就是等待 Sender 线程发送消息并执行返回结果了。

### 3. Sender线程预处理及消息发送

此时，该 Sender 线程登场了。严格来说，Sender 线程自 KafkaProducer 创建后就一直都在运行着 。它的工作流程基本上是这样的：

1. 不断轮询缓冲区寻找已做好发送准备的分区 
2. 将轮询获得的各个 batch 按照目标分区所在的 leader broker 进行分组
3. 将分组后的 batch 通过底层创建的 Socket 连接发送给各个 broker
4. 等待服务器端发送 response 回来

为了说明上的方便，我还是基于图的方式来解释Sender线程的工作原理：

![img](https://images2015.cnblogs.com/blog/735367/201702/735367-20170204164759886-242426092.png)

### 4. Sender线程处理response

上图中Sender线程会发送PRODUCE请求给对应的broker，broker处理完毕之后发送对应的PRODUCE response。一旦Sender线程接收到response将依次(按照消息发送顺序)调用batch中的回调方法，如下图所示：

![img](https://images2015.cnblogs.com/blog/735367/201702/735367-20170204170043386-56898873.png) 

做完这一步，producer发送消息就可以算作是100%完成了。通过这4步我们可以看到新版本producer发送事件完全是异步过程。因此在调优producer前我们就需要搞清楚性能瓶颈到底是在用户主线程还是在Sender线程。具体的性能测试方法以及调优方法以后有机会的话我再写一篇出来和大家讨论。





## 源码解毒

### producer send()

```java
// 1.异步向一个 topic 发送数据
public Future<RecordMetadata> send(ProducerRecord<K, V> record) {
    return this.send(record, (Callback)null);
}


// 异步向一个 topic 发送数据，并注册回调函数，在回调函数中接受发送响应
public Future<RecordMetadata> send(ProducerRecord<K, V> record, Callback callback) {
    //如果有自定义拦截器，会去处理拦截器的Producer
    ProducerRecord<K, V> interceptedRecord = this.interceptors.onSend(record);
    return this.doSend(interceptedRecord, callback);
}
```

`send()` 方法通过重载实现带回调和不带回调的参数，最终都调用 **doSend()** 方法

```java
private Future<RecordMetadata> doSend(ProducerRecord<K, V> record, Callback callback) {
    TopicPartition tp = null;

    try {
        //1、检查producer实例是否已关闭,如果关闭则抛出异常
        this.throwIfProducerClosed();

        KafkaProducer.ClusterAndWaitTime clusterAndWaitTime;
        try {
            //2、确保topic的元数据(metadata)是可用的
            clusterAndWaitTime = this.waitOnMetadata(record.topic(), record.partition(), this.maxBlockTimeMs);
        } catch (KafkaException var19) {
            if (this.metadata.isClosed()) {
                throw new KafkaException("Producer closed while send in progress", var19);
            }

            throw var19;
        }

        long remainingWaitMs = Math.max(0L, this.maxBlockTimeMs - clusterAndWaitTime.waitedOnMetadataMs);
        Cluster cluster = clusterAndWaitTime.cluster;
		//序列化key 和 value
        byte[] serializedKey;
        try {
            serializedKey = this.keySerializer.serialize(record.topic(), record.headers(), record.key());
        } catch (ClassCastException var18) {
            throw new SerializationException("Can't convert key of class " + record.key().getClass().getName() + " to class " + this.producerConfig.getClass("key.serializer").getName() + " specified in key.serializer", var18);
        }

        byte[] serializedValue;
        try {
            serializedValue = this.valueSerializer.serialize(record.topic(), record.headers(), record.value());
        } catch (ClassCastException var17) {
            throw new SerializationException("Can't convert value of class " + record.value().getClass().getName() + " to class " + this.producerConfig.getClass("value.serializer").getName() + " specified in value.serializer", var17);
        }

        //获取分区信息,如果ProducerRecord指定了分区信息就使用该指定分区否则通过计算获取
        int partition = this.partition(record, serializedKey, serializedValue, cluster);
        tp = new TopicPartition(record.topic(), partition);
        this.setReadOnly(record.headers());
        Header[] headers = record.headers().toArray();
        //估算消息的字节大小
        int serializedSize = AbstractRecords.estimateSizeInBytesUpperBound(this.apiVersions.maxUsableProduceMagic(), this.compressionType, serializedKey, serializedValue, headers);
        //确保消息大小不超过发送请求最大值(max.request.size)或者发送缓冲池发小(buffer.memory)
        this.ensureValidRecordSize(serializedSize);
        long timestamp = record.timestamp() == null ? this.time.milliseconds() : record.timestamp();
        this.log.trace("Sending record {} with callback {} to topic {} partition {}", new Object[]{record, callback, record.topic(), partition});
        Callback interceptCallback = new KafkaProducer.InterceptorCallback(callback, this.interceptors, tp);
        //是否使用事务
        if (this.transactionManager != null && this.transactionManager.isTransactional()) {
            this.transactionManager.maybeAddPartitionToTransaction(tp);
        }
		//向 accumulator 中追加数据
        RecordAppendResult result = this.accumulator.append(tp, timestamp, serializedKey, serializedValue, headers, interceptCallback, remainingWaitMs);
        //如果 batch 已经满了,唤醒 sender 线程发送数据
        if (result.batchIsFull || result.newBatchCreated) {
            this.log.trace("Waking up the sender since topic {} partition {} is either full or getting a new batch", record.topic(), partition);
            this.sender.wakeup();
        }

        return result.future;
    } catch (ApiException var20) {
        .........
    } 
    .........
}
```

`doSend()` 方法主要分为 10 步完成：

1. 检查producer实例是否已关闭,如果关闭则抛出异常

2. 确保topic的元数据(metadata)是可用的

3. 序列化ProducerRecord中的key

4. 序列化ProducerRecord中的value

5. 确定分区信息,如果构造ProducerRecord指定了分区信息就使用该指定分区否则通过计算获取

6. 估算整条消息的字节大小

7. 确保消息大小不超过发送请求最大值(max.request.size)或者发送缓冲池发小(buffer.memory)，如果超过则抛出异常

8. 是否使用事务，如果使用则按照事务流程进行

9. 向 accumulator 中追加数据

10. 如果 batch 已经满了,唤醒 sender 线程发送数据

![](https://img2018.cnblogs.com/blog/1465200/201909/1465200-20190910145036444-1215527333.png)

### 具体的发送过程

#### 获取 topic 的 metadata 信息——waitOnMetadata()

Producer 通过 `waitOnMetadata()` 方法来获取对应 topic 的 metadata 信息

```java
//如果元数据Topic列表中还没有该Topic，则将其添加到元数据Topic列表中，并重置过期时间
private KafkaProducer.ClusterAndWaitTime waitOnMetadata(String topic, Integer partition, long maxWaitMs) throws InterruptedException {
    //首先从元数据中获取集群信息
    Cluster cluster = this.metadata.fetch();
    //集群的无效topic列表包含该topic那么抛出异常
    if (cluster.invalidTopics().contains(topic)) {
        throw new InvalidTopicException(topic);
    } else {
        //否则将topic添加到Topic列表中
        this.metadata.add(topic);
        //获取该topic的分区数
        Integer partitionsCount = cluster.partitionCountForTopic(topic);
        //如果存在缓存的元数据，并且未指定分区的或者在已知分区范围内，那么返回缓存的元数据
        if (partitionsCount == null || partition != null && partition >= partitionsCount) {
            long begin = this.time.milliseconds();
            long remainingWaitMs = maxWaitMs;

            long elapsed;
            do {
                if (partition != null) {
                    this.log.trace("Requesting metadata update for partition {} of topic {}.", partition, topic);
                } else {
                    this.log.trace("Requesting metadata update for topic {}.", topic);
                }

                this.metadata.add(topic);
                int version = this.metadata.requestUpdate();
                this.sender.wakeup();

                try {
                    this.metadata.awaitUpdate(version, remainingWaitMs);
                } catch (TimeoutException var15) {
                    throw new TimeoutException(String.format("Topic %s not present in metadata after %d ms.", topic, maxWaitMs));
                }

                cluster = this.metadata.fetch();
                elapsed = this.time.milliseconds() - begin;
                if (elapsed >= maxWaitMs) {
                    throw new TimeoutException(partitionsCount == null ? String.format("Topic %s not present in metadata after %d ms.", topic, maxWaitMs) : String.format("Partition %d of topic %s with partition count %d is not present in metadata after %d ms.", partition, topic, partitionsCount, maxWaitMs));
                }

                if (cluster.unauthorizedTopics().contains(topic)) {
                    throw new TopicAuthorizationException(topic);
                }

                if (cluster.invalidTopics().contains(topic)) {
                    throw new InvalidTopicException(topic);
                }

                remainingWaitMs = maxWaitMs - elapsed;
                partitionsCount = cluster.partitionCountForTopic(topic);
            } while(partitionsCount == null || partition != null && partition >= partitionsCount);

            return new KafkaProducer.ClusterAndWaitTime(cluster, elapsed);
        } else {
            return new KafkaProducer.ClusterAndWaitTime(cluster, 0L);
        }
    }
}
```



#### 确定partition值

关于 partition 值的计算，分为三种情况：

1. 指明 partition 的情况下，直接将指定的值直接作为 partiton 值；
2. 没有指明 partition 值但有 key 的情况下，将 key 的 hash 值与 topic 的 partition 数进行取余得到 partition 值；
3. 既没有 partition 值又没有 key 值的情况下，第一次调用时随机生成一个整数（后面每次调用在这个整数上自增），将这个值与 topic 可用的 partition 总数取余得到 partition 值，也就是常说的轮询算法。

```java
private int partition(ProducerRecord<K, V> record, byte[] serializedKey, byte[] serializedValue, Cluster cluster) {
    Integer partition = record.partition();
    return partition != null ? partition : this.partitioner.partition(record.topic(), record.key(), serializedKey, record.value(), serializedValue, cluster);
}
```

**DefaultPartitioner 的实现**

```java
public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
    List<PartitionInfo> partitions = cluster.partitionsForTopic(topic);
    int numPartitions = partitions.size();
    if (keyBytes == null) {
        //不指定key时,根据 topic 获取对应的整数变量
        int nextValue = this.nextValue(topic);
        List<PartitionInfo> availablePartitions = cluster.availablePartitionsForTopic(topic);
        if (availablePartitions.size() > 0) {
            int part = Utils.toPositive(nextValue) % availablePartitions.size();
            return ((PartitionInfo)availablePartitions.get(part)).partition();
        } else {
            return Utils.toPositive(nextValue) % numPartitions;
        }
    } else {
        //指定key时，通过key进行hash运算然后对该topic分区总数取余
        return Utils.toPositive(Utils.murmur2(keyBytes)) % numPartitions;
    }
}

private int nextValue(String topic) {
    AtomicInteger counter = (AtomicInteger)this.topicCounterMap.get(topic);
    if (null == counter) {
        //第一次随机生成一个数
        counter = new AtomicInteger(ThreadLocalRandom.current().nextInt());
        AtomicInteger currentCounter = (AtomicInteger)this.topicCounterMap.putIfAbsent(topic, counter);
        if (currentCounter != null) {
            counter = currentCounter;
        }
    }
	//以后每次递增
    return counter.getAndIncrement();
}
```



#### 估算消息大小并检查

校验消息是为了防止消息过大或者数量过多，导致内存异常，具体实现

```java
//估算消息大小
int serializedSize = AbstractRecords.estimateSizeInBytesUpperBound(this.apiVersions.maxUsableProduceMagic(), this.compressionType, serializedKey, serializedValue, headers);
//确保消息大小在有效范围内
this.ensureValidRecordSize(serializedSize);

    private void ensureValidRecordSize(int size) {
        //是否超过最大请求的限制,如果超过抛出异常
        if (size > this.maxRequestSize) {
            throw new RecordTooLargeException("The message is " + size + " bytes when serialized which is larger than the maximum request size you have configured with the " + "max.request.size" + " configuration.");
            //是否超过最大内存缓冲池大小,如果超过抛出异常
        } else if ((long)size > this.totalMemorySize) {
            throw new RecordTooLargeException("The message is " + size + " bytes when serialized which is larger than the total memory buffer you have configured with the " + "buffer.memory" + " configuration.");
        }
    }
```



#### 向 accumulator 写数据

```java
public RecordAccumulator.RecordAppendResult append(TopicPartition tp, long timestamp, byte[] key, byte[] value, Header[] headers, Callback callback, long maxTimeToBlock) throws InterruptedException {
    this.appendsInProgress.incrementAndGet();
    ByteBuffer buffer = null;
    if (headers == null) {
        headers = Record.EMPTY_HEADERS;
    }

    RecordAccumulator.RecordAppendResult var16;
    try {
        // 当前tp有对应queue时直接返回，否则新建一个返回
        Deque<ProducerBatch> dq = this.getOrCreateDeque(tp);
        // 在对一个 queue 进行操作时,会保证线程安全
        synchronized(dq) {
            if (this.closed) {
                throw new KafkaException("Producer closed while send in progress");
            }

            RecordAccumulator.RecordAppendResult appendResult = this.tryAppend(timestamp, key, value, headers, callback, dq);
            if (appendResult != null) {
                RecordAccumulator.RecordAppendResult var14 = appendResult;
                return var14;
            }
        }
		// 为 topic-partition 创建一个新的 RecordBatch
        byte maxUsableMagic = this.apiVersions.maxUsableProduceMagic();
        int size = Math.max(this.batchSize, AbstractRecords.estimateSizeInBytesUpperBound(maxUsableMagic, this.compression, key, value, headers));
        this.log.trace("Allocating a new {} byte message buffer for topic {} partition {}", new Object[]{size, tp.topic(), tp.partition()});
        // 给这个 RecordBatch 初始化一个 buffer
        buffer = this.free.allocate(size, maxTimeToBlock);
        synchronized(dq) {
            if (this.closed) {
                throw new KafkaException("Producer closed while send in progress");
            }

            RecordAccumulator.RecordAppendResult appendResult = this.tryAppend(timestamp, key, value, headers, callback, dq);
            if (appendResult == null) {
                // 给 topic-partition 创建一个 RecordBatch
                MemoryRecordsBuilder recordsBuilder = this.recordsBuilder(buffer, maxUsableMagic);
                ProducerBatch batch = new ProducerBatch(tp, recordsBuilder, this.time.milliseconds());
                // 向新的 RecordBatch 中追加数据
                FutureRecordMetadata future = (FutureRecordMetadata)Utils.notNull(batch.tryAppend(timestamp, key, value, headers, callback, this.time.milliseconds()));
                // 将 RecordBatch 添加到对应的 queue 中
                dq.addLast(batch);
                // 向未 ack 的 batch 集合添加这个 batch
                this.incomplete.add(batch);
                buffer = null;
                // 如果 dp.size()>1 就证明这个 queue 有一个 batch 是可以发送了
                RecordAccumulator.RecordAppendResult var19 = new RecordAccumulator.RecordAppendResult(future, dq.size() > 1 || batch.isFull(), true);
                return var19;
            }

            var16 = appendResult;
        }
    } finally {
        if (buffer != null) {
            this.free.deallocate(buffer);
        }

        this.appendsInProgress.decrementAndGet();
    }

    return var16;
}
```



#### 使用sender线程批量发送

```java
public void run() {
    this.log.debug("Starting Kafka producer I/O thread.");

    while(this.running) {
        try {
            this.run(this.time.milliseconds());
        } catch (Exception var4) {
            this.log.error("Uncaught error in kafka producer I/O thread: ", var4);
        }
    }

    this.log.debug("Beginning shutdown of Kafka producer I/O thread, sending remaining records.");
	// 累加器中可能仍然有请求，或者等待确认,等待他们完成就停止接受请求
    while(!this.forceClose && (this.accumulator.hasUndrained() || this.client.inFlightRequestCount() > 0)) {
        //......
    }

    if (this.forceClose) {
        //......
    }

    try {
        this.client.close();
    } catch (Exception var2) {
        this.log.error("Failed to close network client", var2);
    }

    this.log.debug("Shutdown of Kafka producer I/O thread has completed.");
}

void run(long now) {
    //首先还是判断是否使用事务发送
    if (this.transactionManager != null) {
        try {
            if (this.transactionManager.shouldResetProducerStateAfterResolvingSequences()) {
                this.transactionManager.resetProducerId();
            }

            if (!this.transactionManager.isTransactional()) {
                this.maybeWaitForProducerId();
            } else if (this.transactionManager.hasUnresolvedSequences() && !this.transactionManager.hasFatalError()) {
                this.transactionManager.transitionToFatalError(new KafkaException("The client hasn't received acknowledgment for some previously sent messages and can no longer retry them. It isn't safe to continue."));
            } else if (this.transactionManager.hasInFlightTransactionalRequest() || this.maybeSendTransactionalRequest(now)) {
                this.client.poll(this.retryBackoffMs, now);
                return;
            }
			//如果事务管理器转态错误 或者producer没有id 将停止进行发送
            if (this.transactionManager.hasFatalError() || !this.transactionManager.hasProducerId()) {
                RuntimeException lastError = this.transactionManager.lastError();
                if (lastError != null) {
                    this.maybeAbortBatches(lastError);
                }

                this.client.poll(this.retryBackoffMs, now);
                return;
            }

            if (this.transactionManager.hasAbortableError()) {
                this.accumulator.abortUndrainedBatches(this.transactionManager.lastError());
            }
        } catch (AuthenticationException var5) {
            this.log.trace("Authentication exception while processing transactional request: {}", var5);
            this.transactionManager.authenticationFailed(var5);
        }
    }
	//发送Producer数据
    long pollTimeout = this.sendProducerData(now);
    this.client.poll(pollTimeout, now);
}

private long sendProducerData(long now) {
    Cluster cluster = this.metadata.fetch();
    // 获取准备发送数据的分区列表
    ReadyCheckResult result = this.accumulator.ready(cluster, now);
    Iterator iter;
    //如果有分区leader信息是未知的,那么就强制更新metadata
    if (!result.unknownLeaderTopics.isEmpty()) {
        iter = result.unknownLeaderTopics.iterator();

        while(iter.hasNext()) {
            String topic = (String)iter.next();
            this.metadata.add(topic);
        }

        this.log.debug("Requesting metadata update due to unknown leader topics from the batched records: {}", result.unknownLeaderTopics);
        this.metadata.requestUpdate();
    }

    iter = result.readyNodes.iterator();
    long notReadyTimeout = 9223372036854775807L;

    // 移除没有准备好发送的Node
    while(iter.hasNext()) {
        Node node = (Node)iter.next();
        if (!this.client.ready(node, now)) {
            iter.remove();
            notReadyTimeout = Math.min(notReadyTimeout, this.client.pollDelayMs(node, now));
        }
    }
	//创建Producer请求内容
    Map<Integer, List<ProducerBatch>> batches = this.accumulator.drain(cluster, result.readyNodes, this.maxRequestSize, now);
    this.addToInflightBatches(batches);
    List expiredBatches;
    Iterator var11;
    ProducerBatch expiredBatch;
    if (this.guaranteeMessageOrder) {
        Iterator var9 = batches.values().iterator();

        while(var9.hasNext()) {
            expiredBatches = (List)var9.next();
            var11 = expiredBatches.iterator();

            while(var11.hasNext()) {
                expiredBatch = (ProducerBatch)var11.next();
                this.accumulator.mutePartition(expiredBatch.topicPartition);
            }
        }
    }

    this.accumulator.resetNextBatchExpiryTime();
    List<ProducerBatch> expiredInflightBatches = this.getExpiredInflightBatches(now);
    expiredBatches = this.accumulator.expiredBatches(now);
    expiredBatches.addAll(expiredInflightBatches);
    if (!expiredBatches.isEmpty()) {
        this.log.trace("Expired {} batches in accumulator", expiredBatches.size());
    }

    var11 = expiredBatches.iterator();

    while(var11.hasNext()) {
        expiredBatch = (ProducerBatch)var11.next();
        String errorMessage = "Expiring " + expiredBatch.recordCount + " record(s) for " + expiredBatch.topicPartition + ":" + (now - expiredBatch.createdMs) + " ms has passed since batch creation";
        this.failBatch(expiredBatch, -1L, -1L, new TimeoutException(errorMessage), false);
        if (this.transactionManager != null && expiredBatch.inRetry()) {
            this.transactionManager.markSequenceUnresolved(expiredBatch.topicPartition);
        }
    }

    this.sensors.updateProduceRequestMetrics(batches);
    long pollTimeout = Math.min(result.nextReadyCheckDelayMs, notReadyTimeout);
    pollTimeout = Math.min(pollTimeout, this.accumulator.nextExpiryTimeMs() - now);
    pollTimeout = Math.max(pollTimeout, 0L);
    if (!result.readyNodes.isEmpty()) {
        this.log.trace("Nodes with data ready to send: {}", result.readyNodes);
        pollTimeout = 0L;
    }

    this.sendProduceRequests(batches, now);
    return pollTimeout;
}
```













![](https://static01.imgkr.com/temp/7e16aac5204940cb9033ef7c93512a16.png)

![](https://static01.imgkr.com/temp/e414ef7c122f4c1cae598047d96d3f49.png)

之后在IDEA中 , 双击shift , 调出全局搜索框就可以搜索到 jar包里的类了















https://segmentfault.com/a/1190000016643285

https://blog.csdn.net/qq_18581221/article/details/89320230