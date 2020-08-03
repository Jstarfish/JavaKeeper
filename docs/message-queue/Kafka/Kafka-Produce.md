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









https://segmentfault.com/a/1190000016643285

https://blog.csdn.net/qq_18581221/article/details/89320230