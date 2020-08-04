# KafkaProducer使用介绍、参数配置以及核心源码解析

## 前言

Kafka，作为目前在大数据领域应用最为广泛的消息队列，其内部实现和设计有很多值得深入研究和分析的地方，使用 kafka 首先需要接触到 producer 的开发，然后是 consumer 开发，自 0.8.2.x 版本以后，kafka 提供了 java 版本的 producer 以代替以前 scala 版本的 producer，下面进行 producer 的解析。

## Producer 概要设计

发送简略流程图

![img](https://img-blog.csdnimg.cn/20190415213218860.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE4NTgxMjIx,size_16,color_FFFFFF,t_70)

KafkaProducer 首先使用序列化器将需要发送的数据进行序列化，然后通过分区器（partitioner）确定该数据需要发送的 Topic 的分区，kafka 提供了一个默认的分区器，如果消息指定了 key，那么 partitioner 会根据 key 的hash 值来确定目标分区，如果没有指定 key，那么将使用轮询的方式确定目标分区，这样可以最大程度的均衡每个分区的消息，确定分区之后，将会进一步确认该分区的 leader 节点(处理该分区消息读写的主节点)，消息会进入缓冲池进行缓冲，然后等消息到达一定数量或者大小后进行批量发送



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

> 如果发送失败，也可能 server.properties 配置的问题，不允许远程访问
>
> - 去掉注释，listeners=PLAINTEXT://:9092
> - 把advertised.listeners值改为PLAINTEXT://host_ip:9092

### 同步提交

Kafka 的 Producer 发送消息采用的是异步发送的方式，`KafkaProducer` 的 `send` 方法返回 `Future` 对象，所以我们可以手动调用 `Future` 对象的 `get` 方法实现同步：

```java
producer.send(new ProducerRecord<String, String>("test",
        Integer.toString(i), "hello world-" + i)).get();
```

get 方法将阻塞，直到返回结果 RecordMetadata，所以可以看成是同步的。

### 异步待回调函数

上边的异步提交方式，可以称为发送并忘记（不关心消息是否正常到达，对返回结果不做任何判断处理），所以 kafak 提供了一个带回调函数的 send 方法

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

- **key.serializer**：任何消息发送到 broker 格式都是字节数组，因此在发送到 broker 之前需要进行序列化，该参数用于对 ProducerRecord 中的 key进行序列化

- **value.serializer**：该参数用于对 ProducerRecord 中的 value 进行序列化

  > kafka 默认提供了常用的序列化类，也可以通过实现 `org.apache.kafka.common.serialization.Serializer` 实现定义的序列化，Kafka 提供的序列化类如下：
  >
  > ![](https://static01.imgkr.com/temp/0997ff0db5a04501bc3438ed3b7402c9.png)

- **acks：**ack 具有3个取值 0、1 和 -1(all)

  - acks=0：producer 不等待 broker 的 ack，这一操作提供了一个最低的延迟，broker 一接收到还没有写入磁盘就已经返回，吞吐量最高，当 broker 故障时有可能**丢失数据**；
  - ack=1：producer 等待 broker 的 ack，partition 的 leader 落盘成功后返回 ack，如果在 follower 同步成功之前 leader 故障，那么将会**丢失数据**

  - acks=-1(all)：producer 等待 broker 的 ack，partition 的 leader 和 follower 全部落盘成功后才返回 ack。但是如果在 follower 同步完成后，broker 发送 ack 之前，leader 发生故障，那么就会造成**数据重复**

- **buffer.memory**：该参数用于设置发送缓冲池的内存大小，单位是字节。默认值 33554432KB（32M）
- **max.block.ms**：当 producer 缓冲满了之后，阻塞的时间
- **compression.type**：压缩类型，目前 kafka 支持四种种压缩类型 `gzip`、`snappy`、`lz4`、`zstd`，性能依次递增。默认值none（不压缩）
- **retries**：重试次数，0 表示不进行重试。默认值 2147483647
- **batch.size**：批次处理大小，通常增加该参数，可以提升 producer 的吞吐量，默认值 16384
- **linger.ms**：发送时延，和 batch.size 任满足其一条件，就会进行发送
- **max.request.size**：控制 producer 发送请求的大小
- **receive.buffer.bytes**：读取数据时要使用的 TCP 接收缓冲区（SO_RCVBUF）的大小。如果值为 -1，则将使用OS默认值。默认值 32768
- **send. buffer.bytes**：发送数据时使用的 TCP 发送缓冲区（SO_SNDBUF）的大小。如果值为-1，则将使用OS默认值。默认值131072
- **request.timeout.ms**：生产者发送数据时等待服务器返回响应的时间。默认值 30000ms



## 消息分区机制

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



## 





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

doSend() 方法主要分为10步完成：

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



















![](https://static01.imgkr.com/temp/7e16aac5204940cb9033ef7c93512a16.png)

![](https://static01.imgkr.com/temp/e414ef7c122f4c1cae598047d96d3f49.png)

之后在IDEA中 , 双击shift , 调出全局搜索框就可以搜索到 jar包里的类了















https://segmentfault.com/a/1190000016643285

https://blog.csdn.net/qq_18581221/article/details/89320230