## 5. Kafka API（Java中的Kafka使用）

### 5.1 启动zk和kafka集群



### 5.2 导入 pom 依赖 

```
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka_2.12</artifactId>
    <version>2.1.1</version>
</dependency>
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>2.1.1</version>
</dependency>
```

### 5.3 创建生产者

Kafka的Producer发送消息采用的是**异步发送**的方式。在消息发送过程中，涉及到了两个线程：**main线程和Sender线程**，以及一个线程共享变量：**RecordAccumulator**。main线程将消息发送给RecordAccumulator，Sender线程不断从RecordAccumulator中拉取消息发送到Kafka broker。

![img](H:/Technical-Learning/docs/_images/message-queue/Kafka/kafka-producer-thread.png)

相关参数：	

- **batch.size**：只有数据积累到batch.size之后，sender才会发送数据。
- **linger.ms**：如果数据迟迟未达到batch.size，sender等待linger.time之后就会发送数据。

#### 5.3.1 异步发送API

```java
package priv.learn.producer;
import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;

public class CustomerProducer {
    public static void main(String[] args) {
        Properties properties = new Properties();
        // Kafka 服务端的主机名和端口号
        properties.put("bootstrap.servers", "39.121.214.96:9092");
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
        // value 序列化     properties.put("value.serializer","org.apache.kafka.common.serialization.StringSerializer");
        Producer<String, String> producer = new KafkaProducer<String, String>(properties);
        for (int i = 0; i < 50; i++) {
            producer.send(new ProducerRecord<String, String>("learn-java-kafka",
                    Integer.toString(i), "hello world-" + i));
        }
        producer.close();
    }
}
```

#### 5.3.2  异步发送，带回调函数

回调函数会在 producer 收到 ack 时调用，为异步调用，该方法有两个参数，分别是 RecordMetadata 和 Exception，如果 Exception 为 null，说明消息发送成功，如果 Exception 不为 null，说明消息发送失败。 注意：消息发送失败会自动重试，不需要我们在回调函数中手动重试。

```java
package priv.learn.producer;

import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import java.util.Properties;

/**
- @date: 2019/9/9 16:11
- @description: 创建生产者带回调函数（新 API）
  */
  public class CallBackProducer {

  public static void main(String[] args) {
      Properties props = new Properties();
      props.put("bootstrap.servers", "10.121.214.96:9092");
      // 等待所有副本节点的应答
      props.put("acks", "all");
      // 消息发送最大尝试次数
      props.put("retries", 0);
      // 一批消息处理大小
      props.put("batch.size", 16384);
      // 增加服务端请求延时
      props.put("linger.ms", 1);
      // 发送缓存区内存大小
      props.put("buffer.memory", 33554432);
      // key 序列化
      props.put("key.serializer",
              "org.apache.kafka.common.serialization.StringSerializer");
      // value 序列化
      props.put("value.serializer",
              "org.apache.kafka.common.serialization.StringSerializer");
      KafkaProducer<String, String> kafkaProducer = new KafkaProducer<>(props);
      for (int i = 0; i < 50; i++) {
          kafkaProducer.send(new ProducerRecord<String, String>("learn-java-kafka", "hello"
                  + i), new Callback() {
              @Override
              public void onCompletion(RecordMetadata metadata, Exception
                      exception) {
                  if (metadata != null) {
                      System.err.println(metadata.partition() + "---" +
                              metadata.offset());
                  }
              }
          });
      }
      kafkaProducer.close();
  }
  }
```

#### 5.3.2  同步发送

同步发送的意思就是，一条消息发送之后，会阻塞当前线程，直至返回 ack。 由于 send 方法返回的是一个 Future 对象，根据 Futrue 对象的特点，我们也可以实现同 步发送的效果，只需在调用 Future 对象的 get 方发即可。

```java
producer.send（record).get()
```

 

### 5.4 创建消费者

Consumer 消费数据时的可靠性是很容易保证的，因为数据在 Kafka 中是持久化的，故 不用担心数据丢失问题。 由于 consumer 在消费过程中可能会出现断电宕机等故障，consumer 恢复后，需要从故 障前的位置的继续消费，所以 consumer 需要实时记录自己消费到了哪个 offset，以便故障恢 复后继续消费。 所以 offset 的维护是 Consumer 消费数据是必须考虑的问题。

kafka 提供了两套 consumer API： 高级 Consumer API 和低级 Consumer API。 

#### 4.3.1 高级 API（自动提交offset）

- 高级 API 优点 

  - 高级 API 写起来简单
  - 不需要自行去管理 offset，系统通过 zookeeper 自行管理。 
  - 不需要管理分区，副本等情况， 系统自动管理。 消费者断线会自动根据上一次记录在 zookeeper 中的 offset 去接着获取数据（默认设置 1 分钟更新一下 zookeeper 中存的 offset） 可以使用 group 来区分对同一个 topic 的不同程序访问分离开来（不同的 group 记录不同的 offset，这样不同程序读取同一个 topic 才不会因为 offset 互相影响） 

- 高级 API 缺点 

  - 不能自行控制 offset（对于某些特殊需求来说） 不能细化控制如分区、副本、 zk 等 

  ```java
  package priv.learn.consume;
  import org.apache.kafka.clients.consumer.ConsumerRecord;
  import org.apache.kafka.clients.consumer.ConsumerRecords;
  import org.apache.kafka.clients.consumer.KafkaConsumer;
  import java.util.Arrays;
  import java.util.Properties;
  
  /**
   * @date: 2019/9/9 16:58
   * @description: 高级 API:官方提供案例（自动维护消费情况）（新 API）
   */
  public class CustomNewConsumer {
  
      public static void main(String[] args) {
          Properties props = new Properties();
          // 定义 kakfa 服务的地址，不需要将所有 broker 指定上
          props.put("bootstrap.servers", "10.121.214.96:9092");
          // 制定 consumer group
          props.put("group.id", "test");
          // 是否自动确认 offset
          props.put("enable.auto.commit", "true");
          // 自动确认 offset 的时间间隔
          props.put("auto.commit.interval.ms", "1000");
          // key 的序列化类
          props.put("key.deserializer",
                  "org.apache.kafka.common.serialization.StringDeserializer");
          // value 的序列化类
          props.put("value.deserializer",
                  "org.apache.kafka.common.serialization.StringDeserializer");
          // 定义 consumer
          KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
          // 消费者订阅的 topic, 可同时订阅多个
          consumer.subscribe(Arrays.asList("first", "second", "third","learn-java-kafka"));
          while (true) {
              // 读取数据，读取超时时间为 100ms
              ConsumerRecords<String, String> records = consumer.poll(100);
              for (ConsumerRecord<String, String> record : records) {
                  System.out.printf("offset = %d, key = %s, value = %s%n",
                          record.offset(), record.key(), record.value());
              }
          }
      }
  }
  ```

  **结果：**

  ![img](H:/Technical-Learning/docs/_images/message-queue/Kafka/kakfa-java-demo.png)

  

#### 4.3.2 低级 API(手动提交offset)

虽然自动提交 offset 十分简介便利，但由于其是基于时间提交的，开发人员难以把握 offset 提交的时机。因此 Kafka 还提供了手动提交 offset 的 API。 

- 低级 API 优点    

  - **能够让开发者自己控制 offset，想从哪里读取就从哪里读取。** 
  - 自行控制连接分区，对分区自定义进行负载均衡 
  - 对 zookeeper 的依赖性降低（如： offset 不一定非要靠 zk 存储，自行存储 offset 即可， 比如存在文件或者内存中）

- 低级 API 缺点

  - 太过复杂，需要自行控制 offset，连接哪个分区，找到分区 leader 等。

- 手动提交offset的方法有两种，分别是commitSync(同步提交)和commitAsync(异步提交)。两者的相同点是，都会将本次poll的一批数据最高的偏移量提交；不同点是，commitSync阻塞当前线程，一直到提交成功，并且会自动失败重试（由不可控因素导致，也会出现提交失败）；而commitAsyc则没有失败重试机制，故有可能提交失败。

  ##### 1) 同步提交offset
  
  由于同步提交 offset 有失败重试机制，故更加可靠，以下为同步提交 offset 的示例。

```java
package priv.learn.consume;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import java.util.Arrays;
import java.util.Properties;
/**
 * @date: 2019/10/10 16:33
 * @description: 同步手动提交offset
 */
public class CommitSyncCounsumer {

    public static void main(String[] args) {
        Properties props = new Properties();
        props.put("bootstrap.servers", "192.121.214.51:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test");

        //1. 关闭自动提交offset
        props.put("enable.auto.commit","false");
        props.put("enable.auto.commit", "true");
        props.put("auto.commit.interval.ms", "1000");
        props.put("key.deserializer",
                "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer",
                "org.apache.kafka.common.serialization.StringDeserializer");
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Arrays.asList("first", "second", "third","learn-java-kafka"));
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(100);
            for (ConsumerRecord<String, String> record : records) {
                System.out.printf("offset = %d, key = %s, value = %s%n",
                        record.offset(), record.key(), record.value());
            }
            //2. 需要自己手动提交
            consumer.commitAsync();
        }
    }
}
```

##### 2) 异步提交offset

虽然同步提交 offset 更可靠一些，但是由于其会阻塞当前线程，直到提交成功。因此吞吐量会收到很大的影响。因此更多的情况下，会选用异步提交 offset 的方式

```java
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(100);
    for (ConsumerRecord<String, String> record : records) {
        System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
    }
    consumer.commitAsync(new OffsetCommitCallback() {
        @Override
        public void onComplete(Map<TopicPartition, OffsetAndMetadata> map, Exception e) {
            if(e != null){
                System.out.println("commit failed"+map);
            }
        }
    });
}
```

还可以用官方提供的例子跑一下：<https://github.com/apache/kafka/tree/trunk/examples> 



##### 3） 数据漏消费和重复消费分析

无论是同步提交还是异步提交 offset，都有可能会造成数据的漏消费或者重复消费。先提交 offset 后消费，有可能造成数据的漏消费；而先消费后提交 offset，有可能会造成数据的重复消费。

------



#### 4.3.3 自定义存储offset

Kafka 0.9 版本之前，offset 存储在 zookeeper，0.9 版本及之后，默认将 offset 存储在 Kafka 的一个内置的 topic 中。除此之外，Kafka 还可以选择自定义存储 offset。 

offset 的维护是相当繁琐的，因为需要考虑到消费者的 Rebalace。 

当有新的消费者加入消费者组、已有的消费者推出消费者组或者所订阅的主题的分区发 生变化，就会触发到分区的重新分配，重新分配的过程叫做 Rebalance。

消费者发生 Rebalance 之后，每个消费者消费的分区就会发生变化。因此消费者要首先获取到自己被重新分配到的分区，并且定位到每个分区最近提交的 offset 位置继续消费。 

要实现自定义存储 offset，需要借助 ConsumerRebalanceListener，以下为示例代码，其 中提交和获取 offset 的方法，需要根据所选的 offset 存储系统自行实现。



## 6. Kafka producer 拦截器(interceptor) 

### 6.1 拦截器原理

Producer 拦截器(interceptor)是在 Kafka 0.10 版本被引入的，主要用于实现 clients 端的定制化控制逻辑。 	对于 producer 而言， interceptor 使得用户在消息发送前以及 producer 回调逻辑前有机会 对消息做一些定制化需求，比如**修改消息**等。同时， producer 允许用户指定多个 interceptor 按序作用于同一条消息从而形成一个拦截链(interceptor chain)。 Intercetpor 的实现接口是 **org.apache.kafka.clients.producer.ProducerInterceptor**，其定义的方法包括： 

1. configure(configs) ：获取配置信息和初始化数据时调用。 

2. onSend(ProducerRecord)： 该方法封装进 KafkaProducer.send 方法中，即它运行在用户主线程中。 Producer 确保在 消息被序列化以及计算分区前调用该方法。 用户可以在该方法中对消息做任何操作，但最好 保证不要修改消息所属的 topic 和分区， 否则会影响目标分区的计算 

3. onAcknowledgement(RecordMetadata, Exception)： 该方法会在消息被应答或消息发送失败时调用，并且通常都是在 producer 回调逻辑触 发之前。 onAcknowledgement 运行在 producer 的 IO 线程中，因此不要在该方法中放入很重 的逻辑，否则会拖慢 producer 的消息发送效率  

4. close： 关闭 interceptor，主要用于执行一些资源清理工作 如前所述， interceptor 可能被运行在多个线程中，因此在具体实现时用户需要自行确保 线程安全。另外倘若指定了多个 interceptor，则 producer 将按照指定顺序调用它们，并仅仅 是捕获每个 interceptor 可能抛出的异常记录到错误日志中而非在向上传递。这在使用过程中 要特别留意。


###  6.2 拦截器案例 

- 需求： 实现一个简单的双 interceptor 组成的拦截链。第一个 interceptor 会在消息发送前将时间 戳信息加到消息 value 的最前部；第二个 interceptor 会在消息发送后更新成功发送消息数或 失败发送消息数。      

![img](H:/Technical-Learning/docs/_images/message-queue/Kafka/interceptor-demo.png)



- 案例实操 

  - 增加时间戳拦截器 

    ```java
    package priv.learn.interceptor;
    
    import org.apache.kafka.clients.producer.ProducerInterceptor;
    import org.apache.kafka.clients.producer.ProducerRecord;
    import org.apache.kafka.clients.producer.RecordMetadata;
    import java.util.Map;
    
    /**
     * @description: 增加时间拦截器，在发送消息时增加时间
     */
    public class TimeInterceptor implements ProducerInterceptor<String, String> {
        @Override
        public ProducerRecord<String, String> onSend(ProducerRecord<String, String> producerRecord) {
            // 创建一个新的 record，把时间戳写入消息体的最前部
            return new ProducerRecord(producerRecord.topic(), producerRecord.partition(),
                    producerRecord.timestamp(), producerRecord.key(),
                    System.currentTimeMillis() + "," + producerRecord.value().toString());
        }
    
        @Override
        public void onAcknowledgement(RecordMetadata recordMetadata, Exception e) {
        }
    
        @Override
        public void close() {
        }
        @Override
        public void configure(Map<String, ?> map) {
        }
    }
    ```

  

  - 统计发送消息成功和发送失败消息数，并在 producer 关闭时打印这两个计数器 

  ```java
  package priv.learn.interceptor;
  
  import org.apache.kafka.clients.producer.ProducerInterceptor;
  import org.apache.kafka.clients.producer.ProducerRecord;
  import org.apache.kafka.clients.producer.RecordMetadata;
  import java.util.Map;
  
  /**
   * @description:统计发送消息成功和发送失败消息数，并在 producer 关闭时打印这两个计数器
   */
  public class CounterInterceptor  implements ProducerInterceptor<String, String> {
      private int errorCounter = 0;
      private int successCounter = 0;
  
      @Override
      public ProducerRecord<String, String> onSend(ProducerRecord<String, String> producerRecord) {
          return producerRecord;
      }
  
      @Override
      public void onAcknowledgement(RecordMetadata recordMetadata, Exception e) {
          // 统计成功和失败的次数
          if (e == null) {
              successCounter++;
          } else {
              errorCounter++;
          }
      }
  
      @Override
      public void close() {
          // 保存结果
          System.out.println("Successful sent: " + successCounter);
          System.out.println("Failed sent: " + errorCounter);
      }
  
      @Override
      public void configure(Map<String, ?> map) {
      }
  }
  ```

  - 创建生产者

  ```java
  package priv.learn.interceptor;
  
  import org.apache.kafka.clients.producer.KafkaProducer;
  import org.apache.kafka.clients.producer.Producer;
  import org.apache.kafka.clients.producer.ProducerConfig;
  import org.apache.kafka.clients.producer.ProducerRecord;
  import java.util.ArrayList;
  import java.util.List;
  import java.util.Properties;
  
  /**
   * @description: 带拦截器的producer 主程序
   */
  public class InterceptorProducer {
  
      public static void main(String[] args) throws Exception {
          // 1 设置配置信息
          Properties props = new Properties();
          props.put("bootstrap.servers", "10.121.214.96:9092");
          props.put("acks", "all");
          props.put("retries", 0);
          props.put("batch.size", 16384);
          props.put("linger.ms", 1);
          props.put("buffer.memory", 33554432);
          props.put("key.serializer",
                  "org.apache.kafka.common.serialization.StringSerializer");
          props.put("value.serializer",
                  "org.apache.kafka.common.serialization.StringSerializer");
          // 2 构建拦截链
          List<String> interceptors = new ArrayList<>();
          interceptors.add("priv.learn.interceptor.TimeInterceptor");
          interceptors.add("priv.learn.interceptor.CounterInterceptor");
          props.put(ProducerConfig.INTERCEPTOR_CLASSES_CONFIG, interceptors);
          String topic = "first";
          Producer<String, String> producer = new KafkaProducer<>(props);
          // 3 发送消息
          for (int i = 0; i < 10; i++) {
              ProducerRecord<String, String> record = new ProducerRecord<>(topic,
                      "message" + i);
              producer.send(record);
          }
          // 4 一定要关闭 producer，这样才会调用 interceptor 的 close 方法
          producer.close();
      }
  }
  ```

------



## 7. kafka Streams 

Kafka Streams是Apache Kafka 开源项目的一个组成部分。是一个功能强大，易于使用的库。用于在 Kafka 上构建高可分布式、拓展性，容错的应用程序。 

####  7.1 Kafka Streams 特点 

1. 功能强大：高扩展性，弹性，容错 

2. 轻量级 ：无需专门的集群 一个库，而不是框架 

3. 完全集成：100%的 Kafka 0.10.0 版本兼容 ，易于集成到现有的应用程序 

4. 实时性： 毫秒级延迟 、并非微批处理、 窗口允许乱序数据、允许迟到数据


####  7.2 为什么要有 Kafka Stream 

​	当前已经有非常多的流式处理系统，最知名且应用最多的开源流式处理系统有 Spark Streaming 和 Apache Storm。 Apache Storm 发展多年，应用广泛，提供记录级别的处理能力，当前也支持 SQL on Stream。而 Spark Streaming 基于 Apache Spark，可以非常方便与图计算， SQL 处理等集成，功能强大，对于熟悉其它 Spark 应用开发的用户而言使用门槛低。另外， 目前主流的 Hadoop 发行版，如 Cloudera 和 Hortonworks，都集成了 Apache Storm 和 Apache Spark，使得部署更容易。 既然 Apache Spark 与 Apache Storm 拥用如此多的优势，那为何还需要 Kafka Stream 呢？    

 主要有如下原因。 

​	第一， Spark 和 Storm 都是流式处理框架，而 **Kafka Stream 提供的是一个基于 Kafka 的 流式处理类库**。框架要求开发者按照特定的方式去开发逻辑部分，供框架调用。开发者很难了解框架的具体运行方式，从而使得调试成本高，并且使用受限。而 Kafka Stream 作为流式处理类库，直接提供具体的类给开发者调用，整个应用的运行方式主要由开发者控制，方便使用和调试。

![img](../../_images/message-queue/Kafka/kakfa-streams-flow.png'/>    



​	第二，虽然 Cloudera 与 Hortonworks 方便了 Storm 和 Spark 的部署，但是这些框架的部 署仍然相对复杂。而 **Kafka Stream 作为类库，可以非常方便的嵌入应用程序中，它对应用的打包和部署基本没有任何要求**。 

​	第三，就流式处理系统而言，基本都支持 Kafka 作为数据源。例如 Storm 具有专门的 kafka-spout，而 Spark 也提供专门的 spark-streaming-kafka 模块。事实上， Kafka 基本上是主流的流式处理系统的标准数据源。换言之， **大部分流式系统中都已部署了 Kafka，此时使用 Kafka Stream 的成本非常低**。 

​	第四， **使用 Storm 或 Spark Streaming 时，需要为框架本身的进程预留资源**，如 Storm 的 supervisor 和 Spark on YARN 的 node manager。即使对于应用实例而言，框架本身也会占 用部分资源，如 Spark Streaming 需要为 shuffle 和 storage 预留内存。 但是 Kafka 作为类库不占用系统资源。 

​	第五，由于 **Kafka 本身提供数据持久化**，因此 Kafka Stream 提供滚动部署和滚动升级以 及重新计算的能力。 

​	第六，由于 Kafka Consumer Rebalance 机制， **Kafka Stream 可以在线动态调整并行度**。    

#### 7.3 Kafka Stream 数据清洗案例 

1. 需求： 实时处理单词带有”>>>”前缀的内容。例如输入”atguigu>>>ximenqing”，最终处理成 “ximenqing” 

   ![img](../../_images/message-queue/Kafka/kafka-streams-data-clean.png'/>

2. demo

   ```xml
   <dependency>
       <groupId>org.apache.kafka</groupId>
       <artifactId>kafka-streams</artifactId>
       <version>2.1.1</version>
   </dependency>
   ```

```java
package priv.learn.stream;

import org.apache.kafka.streams.processor.Processor;
import org.apache.kafka.streams.processor.ProcessorContext;

/**
 * @description: 具体业务处理
 */
public class LogProcessor implements Processor<byte[], byte[]> {

    private ProcessorContext context;

    @Override
    public void init(ProcessorContext context) {
        this.context = context;
    }

    @Override
    public void process(byte[] key, byte[] value) {
        String input = new String(value);
    // 如果包含“>>>”则只保留该标记后面的内容
        if (input.contains(">>>")) {
            input = input.split(">>>")[1].trim();
    // 输出到下一个 topic
            context.forward("logProcessor".getBytes(), input.getBytes());
        } else {
            context.forward("logProcessor".getBytes(), input.getBytes());
        }
    }

    @Override
    public void punctuate(long timestamp) {
    }

    @Override
    public void close() {
    }
}
```

```java
package priv.learn.stream;
import java.util.Properties;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.processor.Processor;
import org.apache.kafka.streams.processor.ProcessorSupplier;
import org.apache.kafka.streams.processor.TopologyBuilder;

/**
 * @description:主类
 */
public class Application {

    public static void main(String[] args) {
        // 定义输入的 topic
        String from = "first";
        // 定义输出的 topic
        String to = "second";
        // 设置参数
        Properties settings = new Properties();
        settings.put(StreamsConfig.APPLICATION_ID_CONFIG, "logFilter");
        settings.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "hadoop102:9092");
        StreamsConfig config = new StreamsConfig(settings);
        // 构建拓扑
        TopologyBuilder builder = new TopologyBuilder();
        builder.addSource("SOURCE", from)
                .addProcessor("PROCESS", new ProcessorSupplier<byte[], byte[]>() {
                    @Override
                    public Processor<byte[], byte[]> get() {
// 具体分析处理
                        return new LogProcessor();
                    }
                }, "SOURCE")
                .addSink("SINK", to, "PROCESS");
        // 创建 kafka stream
        KafkaStreams streams = new KafkaStreams(builder, config);
        streams.start();
    }
}
```

------



## 8. 扩展

### 8.1 Kafka 与 Flume 比较

 在企业中必须要清楚流式数据采集框架 flume 和 kafka 的定位是什么： 

##### flume：

- cloudera 公司研发: 适合多个生产者； 
- 适合下游数据消费者不多的情况； 
- 适合数据安全性要求不高的操作； 
- 适合与 Hadoop 生态圈对接的操作。 

##### kafka：

- linkedin 公司研发: 适合数据下游消费众多的情况； 

- 适合数据安全性要求较高的操作，支持 replication。 

  

因此我们常用的一种模型是： 线上数据 --> flume --> kafka --> flume(根据情景增删该流程) --> HDFS 



### 8.2 Kafka 配置信息 

##### Broker 配置信息 

| Property                                      | Default           | Description                                                  |
| --------------------------------------------- | ----------------- | ------------------------------------------------------------ |
| **broker.id**                                 |                   | 必填参数，broker 的唯一标识 ，每个broker都可以用一个唯一的非负整数id进行标识；这个id可以作为broker的“名字” |
| **log.dirs**                                  | /tmp/kafka-logs   | Kafka 数据存放的目录。可以指定多个目录， 中间用逗号分隔，当新 partition 被创建的时 会被存放到当前存放 partition 最少的目录。 |
| **port**                                      | 6667              | server接受客户端连接的端口                                   |
| **zookeeper.connect**                         | null              | ZooKeeper连接字符串的格式为：hostname:port，此处hostname和port分别是ZooKeeper集群中某个节点的host和port；为了当某个host宕掉之后你能通过其他ZooKeeper节点进行连接，你可以按照一下方式制定多个hosts： hostname1:port1, hostname2:port2, hostname3:port3.  ZooKeeper   允许你增加一个“chroot”路径，将集群中所有kafka数据存放在特定的路径下。当多个Kafka集群或者其他应用使用相同ZooKeeper集群时，可以使用这个方式设置数据存放路径。这种方式的实现可以通过这样设置连接字符串格式，如下所示： hostname1：port1，hostname2：port2，hostname3：port3/chroot/path 这样设置就将所有kafka集群数据存放在/chroot/path路径下。注意，在你启动broker之前，你必须创建这个路径，并且consumers必须使用相同的连接格式。 |
| message.max.bytes                             | 1000000           | server可以接收的消息最大尺寸。重要的是，consumer和producer有关这个属性的设置必须同步，否则producer发布的消息对consumer来说太大。 |
| num.network.threads                           | 3                 | server用来处理网络请求的网络线程数目；一般你不需要更改这个属性。 |
| num.io.threads                                | 8                 | server用来处理请求的I/O线程的数目；这个线程数目至少要等于硬盘的个数。 |
| background.threads                            | 4                 | 用于后台处理的线程数目，例如文件删除；你不需要更改这个属性。 |
| queued.max.requests                           | 500               | 在网络线程停止读取新请求之前，可以排队等待I/O线程处理的最大请求个数。 |
| host.name                                     | null              | broker的hostname；如果hostname已经设置的话，broker将只会绑定到这个地址上；如果没有设置，它将绑定到所有接口，并发布一份到ZK |
| advertised.host.name                          | null              | 如果设置，则就作为broker 的hostname发往producer、consumers以及其他brokers |
| advertised.port                               | null              | 此端口将给与producers、consumers、以及其他brokers，它会在建立连接时用到； 它仅在实际端口和server需要绑定的端口不一样时才需要设置。 |
| socket.send.buffer.bytes                      | 100 * 1024        | SO_SNDBUFF 缓存大小，server进行socket 连接所用               |
| socket.receive.buffer.bytes                   | 100 * 1024        | SO_RCVBUFF缓存大小，server进行socket连接时所用               |
| socket.request.max.bytes                      | 100 * 1024 * 1024 | server允许的最大请求尺寸；  这将避免server溢出，它应该小于Java  heap size |
| num.partitions                                | 1                 | 如果创建topic时没有给出划分partitions个数，这个数字将是topic下partitions数目的默认数值。 |
| log.segment.bytes                             | 1014*1024*1024    | topic  partition的日志存放在某个目录下诸多文件中，这些文件将partition的日志切分成一段一段的；这个属性就是每个文件的最大尺寸；当尺寸达到这个数值时，就会创建新文件。此设置可以由每个topic基础设置时进行覆盖。 查看  [the per-topic  configuration section](http://kafka.apache.org/documentation.html#topic-config) |
| log.roll.{ms,hours}                           | 24 * 7 hours      | 新建 segment 文件的时间，此值可以被 topic 级别的参数覆盖。   |
| log.retention.{ms,minute s,hours}             | 7 days            | Kafka segment log 的保存周期，保存周期超 过此时间日志就会被删除。此参数可以被 topic 级别参数覆盖。数据量大时，建议减小 此值。 |
| log.retention.bytes                           | -1                | 每个 partition 的最大容量，若数据量超过此 值，partition 数据将会被删除。注意这个参数  控制的是每个 partition 而不是 topic。此参数 可以被 log 级别参数覆盖。 |
| log.retention.check.interval.ms               | 5 minutes         | 检查日志分段文件的间隔时间，以确定是否文件属性是否到达删除要求。 |
| log.cleaner.enable                            | false             | 当这个属性设置为false时，一旦日志的保存时间或者大小达到上限时，就会被删除；如果设置为true，则当保存属性达到上限时，就会进行[log compaction](https://cwiki.apache.org/confluence/display/KAFKA/Log+Compaction)。 |
| log.cleaner.threads                           | 1                 | 进行日志压缩的线程数                                         |
| log.cleaner.io.buffer.size                    | 500*1024*1024     | log cleaner清除过程中针对日志进行索引化以及精简化所用到的缓存大小。最好设置大点，以提供充足的内存。 |
| log.cleaner.io.buffer.load.factor             | 512*1024          | 进行log cleaning时所需要的I/O chunk尺寸。你不需要更改这项设置。 |
| log.cleaner.io.buffer.load.factor             | 0.9               | log cleaning中所使用的hash表的负载因子；你不需要更改这个选项。 |
| log.cleaner.backoff.ms                        | 15000             | 进行日志是否清理检查的时间间隔                               |
| log.cleaner.min.cleanable.ratio               | 0.5               | 这项配置控制log  compactor试图清理日志的频率（假定[log compaction](https://cwiki.apache.org/confluence/display/KAFKA/Log+Compaction)是打开的）。默认避免清理压缩超过50%的日志。这个比率绑定了备份日志所消耗的最大空间（50%的日志备份时压缩率为50%）。更高的比率则意味着浪费消耗更少，也就可以更有效的清理更多的空间。这项设置在每个topic设置中可以覆盖。 查看[the per-topic  configuration section](http://kafka.apache.org/documentation.html#topic-config)。 |
| log.flush.scheduler.interval.ms               | Long.MaxValue     | 检查是否需要fsync的时间间隔                                  |
| log.flush.interval.ms                         | Long.MaxValue     | 仅仅通过interval来控制消息的磁盘写入时机，是不足的，这个数用来控制”fsync“的时间间隔，如果消息量始终没有达到固化到磁盘的消息数，但是离上次磁盘同步的时间间隔达到阈值，也将触发磁盘同步。 |
| log.delete.delay.ms                           | 60000             | 文件在索引中清除后的保留时间，一般不需要修改                 |
| auto.create.topics.enable                     | true              | 是否允许自动创建topic。如果是真的，则produce或者fetch 不存在的topic时，会自动创建这个topic。否则需要使用命令行创建topic |
| controller.socket.timeout.ms                  | 30000             | partition管理控制器进行备份时，socket的超时时间。            |
| controller.message.queue.size                 | Int.MaxValue      | controller-to-broker-channles的buffer 尺寸                   |
| default.replication.factor                    | 1                 | 默认备份份数，仅指自动创建的topics                           |
| replica.lag.time.max.ms                       | 10000             | 如果一个follower在这个时间内没有发送fetch请求，leader将从ISR重移除这个follower，并认为这个follower已经挂了 |
| replica.lag.max.messages                      | 4000              | 如果一个replica没有备份的条数超过这个数值，则leader将移除这个follower，并认为这个follower已经挂了 |
| replica.socket.timeout.ms                     | 30*1000           | leader 备份数据时的socket网络请求的超时时间                  |
| replica.socket.receive.buffer.bytes           | 64*1024           | 备份时向leader发送网络请求时的socket receive buffer          |
| replica.fetch.max.bytes                       | 1024*1024         | 备份时每次fetch的最大值                                      |
| replica.fetch.min.bytes                       | 500               | leader发出备份请求时，数据到达leader的最长等待时间           |
| replica.fetch.min.bytes                       | 1                 | 备份时每次fetch之后回应的最小尺寸                            |
| num.replica.fetchers                          | 1                 | 从leader备份数据的线程数                                     |
| replica.high.watermark.checkpoint.interval.ms | 5000              | 每个replica检查是否将最高水位进行固化的频率                  |
| fetch.purgatory.purge.interval.requests       | 1000              | fetch 请求清除时的清除间隔                                   |
| producer.purgatory.purge.interval.requests    | 1000              | producer请求清除时的清除间隔                                 |
| zookeeper.session.timeout.ms                  | 6000              | zookeeper会话超时时间。                                      |
| zookeeper.connection.timeout.ms               | 6000              | 客户端等待和zookeeper建立连接的最大时间                      |
| zookeeper.sync.time.ms                        | 2000              | zk follower落后于zk leader的最长时间                         |
| controlled.shutdown.enable                    | true              | 是否能够控制broker的关闭。如果能够，broker将可以移动所有leaders到其他的broker上，在关闭之前。这减少了不可用性在关机过程中。 |
| controlled.shutdown.max.retries               | 3                 | 在执行不彻底的关机之前，可以成功执行关机的命令数。           |
| controlled.shutdown.retry.backoff.ms          | 5000              | 在关机之间的backoff时间                                      |
| auto.leader.rebalance.enable                  | true              | 如果这是true，控制者将会自动平衡brokers对于partitions的leadership |
| leader.imbalance.per.broker.percentage        | 10                | 每个broker所允许的leader最大不平衡比率                       |
| leader.imbalance.check.interval.seconds       | 300               | 检查leader不平衡的频率                                       |
| offset.metadata.max.bytes                     | 4096              | 允许客户端保存他们offsets的最大个数                          |
| max.connections.per.ip                        | Int.MaxValue      | 每个ip地址上每个broker可以被连接的最大数目                   |
| max.connections.per.ip.overrides              |                   | 每个ip或者hostname默认的连接的最大覆盖                       |
| connections.max.idle.ms                       | 600000            | 空连接的超时限制                                             |
| log.roll.jitter.{ms,hours}                    | 0                 | 从logRollTimeMillis抽离的jitter最大数目                      |
| num.recovery.threads.per.data.dir             | 1                 | 每个数据目录用来日志恢复的线程数目                           |
| unclean.leader.election.enable                | true              | 指明了是否能够使不在ISR中replicas设置用来作为leader          |
| **delete.topic.enable**                       | false             | 启用 deletetopic 参数，建议设置为 true                       |
| offsets.topic.num.partitions                  | 50                | The number of partitions for the offset commit topic. Since changing  this after deployment is currently unsupported, we recommend using a  higher setting for production (e.g., 100-200). |
| offsets.topic.retention.minutes               | 1440              | 存在时间超过这个时间限制的offsets都将被标记为待删除          |
| offsets.retention.check.interval.ms           | 600000            | offset管理器检查陈旧offsets的频率                            |
| offsets.topic.replication.factor              | 3                 | topic的offset的备份份数。建议设置更高的数字保证更高的可用性  |
| offset.topic.segment.bytes                    | 104857600         | offsets topic的segment尺寸。                                 |
| offsets.load.buffer.size                      | 5242880           | 这项设置与批量尺寸相关，当从offsets segment中读取时使用。    |
| offsets.commit.required.acks                  | -1                | 在offset  commit可以接受之前，需要设置确认的数目，一般不需要更改 |

##### Producer 配置信息

| Property                           | Default                           | Description                                                  |
| ---------------------------------- | --------------------------------- | ------------------------------------------------------------ |
| **metadata.broker.list**           |                                   | 启动时 producer 查询 brokers 的列表，可以是集群中所有 brokers 的一个子集。注意，这 个参数只是用来获取 topic 的元信息用， producer 会从元信息中挑选合适的 broker 并 与 之 建 立 socket 连 接 。 格 式 是 ： host1:port1,host2:port2。 |
| request.required.acks              | 0                                 | 此配置是表明当一次produce请求被认为完成时的确认值。特别是，多少个其他brokers必须已经提交了数据到他们的log并且向他们的leader确认了这些信息。典型的值包括： 0： 表示producer从来不等待来自broker的确认信息（和0.7一样的行为）。这个选择提供了最小的时延但同时风险最大（因为当server宕机时，数据将会丢失）。 1：表示获得leader replica已经接收了数据的确认信息。这个选择时延较小同时确保了server确认接收成功。 -1：producer会获得所有同步replicas都收到数据的确认。同时时延最大，然而，这种方式并没有完全消除丢失消息的风险，因为同步replicas的数量可能是1.如果你想确保某些replicas接收到数据，那么你应该在topic-level设置中选项min.insync.replicas设置一下。请阅读一下设计文档，可以获得更深入的讨论。 |
| request.timeout.ms                 | 10000                             | broker尽力实现request.required.acks需求时的等待时间，否则会发送错误到客户端 |
| producer.type                      | sync                              | 此选项置顶了消息是否在后台线程中异步发送。正确的值： （1）  async： 异步发送 （2）  sync： 同步发送 通过将producer设置为异步，我们可以批量处理请求（有利于提高吞吐率）但是这也就造成了客户端机器丢掉未发送数据的可能性 |
| serializer.class                   | kafka.serializer.DefaultEncoder   | 消息的序列化类别。默认编码器输入一个字节byte[]，然后返回相同的字节byte[] |
| key.serializer.class               |                                   | 关键字的序列化类。如果没给与这项，默认情况是和消息一致       |
| partitioner.class                  | kafka.producer.DefaultPartitioner | partitioner 类，用于在subtopics之间划分消息。默认partitioner基于key的hash表 |
| compression.codec                  | none                              | 此项参数可以设置压缩数据的codec，可选codec为：“none”， “gzip”， “snappy” |
| compressed.topics                  | null                              | 此项参数可以设置某些特定的topics是否进行压缩。如果压缩codec是NoCompressCodec之外的codec，则对指定的topics数据应用这些codec。如果压缩topics列表是空，则将特定的压缩codec应用于所有topics。如果压缩的codec是NoCompressionCodec，压缩对所有topics军不可用。 |
| message.send.max.retries           | 3                                 | 此项参数将使producer自动重试失败的发送请求。此项参数将置顶重试的次数。注意：设定非0值将导致重复某些网络错误：引起一条发送并引起确认丢失 |
| retry.backoff.ms                   | 100                               | 在每次重试之前，producer会更新相关topic的metadata，以此进行查看新的leader是否分配好了。因为leader的选择需要一点时间，此选项指定更新metadata之前producer需要等待的时间。 |
| topic.metadata.refresh.interval.ms | 600*1000                          | producer一般会在某些失败的情况下（partition  missing，leader不可用等）更新topic的metadata。他将会规律的循环。如果你设置为负值，metadata只有在失败的情况下才更新。如果设置为0，metadata会在每次消息发送后就会更新（不建议这种选择，系统消耗太大）。重要提示： 更新是有在消息发送后才会发生，因此，如果producer从来不发送消息，则metadata从来也不会更新。 |
| queue.buffering.max.ms             | 5000                              | 当应用async模式时，用户缓存数据的最大时间间隔。例如，设置为100时，将会批量处理100ms之内消息。这将改善吞吐率，但是会增加由于缓存产生的延迟。 |
| queue.buffering.max.messages       | 10000                             | 当使用async模式时，在在producer必须被阻塞或者数据必须丢失之前，可以缓存到队列中的未发送的最大消息条数 |
| batch.num.messages                 | 200                               | 使用async模式时，可以批量处理消息的最大条数。或者消息数目已到达这个上线或者是queue.buffer.max.ms到达，producer才会处理 |
| send.buffer.bytes                  | 100*1024                          | socket 写缓存尺寸                                            |
| client.id                          | “”                                | 这个client  id是用户特定的字符串，在每次请求中包含用来追踪调用，他应该逻辑上可以确认是那个应用发出了这个请求。 |

#####  

##### Consumer 配置信息 

| Property                          | Default        | Description                                                  |
| --------------------------------- | -------------- | ------------------------------------------------------------ |
| group.id                          |                | 用来唯一标识consumer进程所在组的字符串，如果设置同样的group  id，表示这些processes都是属于同一个consumer  group |
| zookeeper.connect                 |                | 指定zookeeper的连接的字符串，格式是hostname：port，此处host和port都是zookeeper  server的host和port，为避免某个zookeeper 机器宕机之后失联，你可以指定多个hostname：port，使用逗号作为分隔： hostname1：port1，hostname2：port2，hostname3：port3 可以在zookeeper连接字符串中加入zookeeper的chroot路径，此路径用于存放他自己的数据，方式： hostname1：port1，hostname2：port2，hostname3：port3/chroot/path |
| consumer.id                       | null           | 不需要设置，一般自动产生                                     |
| socket.timeout.ms                 | 30*100         | 网络请求的超时限制。真实的超时限制是   max.fetch.wait+socket.timeout.ms |
| socket.receive.buffer.bytes       | 64*1024        | socket用于接收网络请求的缓存大小                             |
| fetch.message.max.bytes           | 1024*1024      | 每次fetch请求中，针对每次fetch消息的最大字节数。这些字节将会督导用于每个partition的内存中，因此，此设置将会控制consumer所使用的memory大小。这个fetch请求尺寸必须至少和server允许的最大消息尺寸相等，否则，producer可能发送的消息尺寸大于consumer所能消耗的尺寸。 |
| num.consumer.fetchers             | 1              | 用于fetch数据的fetcher线程数                                 |
| auto.commit.enable                | true           | 如果为真，consumer所fetch的消息的offset将会自动的同步到zookeeper。这项提交的offset将在进程挂掉时，由新的consumer使用 |
| auto.commit.interval.ms           | 60*1000        | consumer向zookeeper提交offset的频率，单位是秒                |
| queued.max.message.chunks         | 2              | 用于缓存消息的最大数目，以供consumption。每个chunk必须和fetch.message.max.bytes相同 |
| rebalance.max.retries             | 4              | 当新的consumer加入到consumer  group时，consumers集合试图重新平衡分配到每个consumer的partitions数目。如果consumers集合改变了，当分配正在执行时，这个重新平衡会失败并重入 |
| fetch.min.bytes                   | 1              | 每次fetch请求时，server应该返回的最小字节数。如果没有足够的数据返回，请求会等待，直到足够的数据才会返回。 |
| fetch.wait.max.ms                 | 100            | 如果没有足够的数据能够满足fetch.min.bytes，则此项配置是指在应答fetch请求之前，server会阻塞的最大时间。 |
| rebalance.backoff.ms              | 2000           | 在重试reblance之前backoff时间                                |
| refresh.leader.backoff.ms         | 200            | 在试图确定某个partition的leader是否失去他的leader地位之前，需要等待的backoff时间 |
| auto.offset.reset                 | largest        | zookeeper中没有初始化的offset时，如果offset是以下值的回应： smallest：自动复位offset为smallest的offset largest：自动复位offset为largest的offset anything  else：向consumer抛出异常 |
| consumer.timeout.ms               | -1             | 如果没有消息可用，即使等待特定的时间之后也没有，则抛出超时异常 |
| exclude.internal.topics           | true           | 是否将内部topics的消息暴露给consumer                         |
| paritition.assignment.strategy    | range          | 选择向consumer 流分配partitions的策略，可选值：range，roundrobin |
| client.id                         | group id value | 是用户特定的字符串，用来在每次请求中帮助跟踪调用。它应该可以逻辑上确认产生这个请求的应用 |
| zookeeper.session.timeout.ms      | 6000           | zookeeper 会话的超时限制。如果consumer在这段时间内没有向zookeeper发送心跳信息，则它会被认为挂掉了，并且reblance将会产生 |
| zookeeper.connection.timeout.ms   | 6000           | 客户端在建立通zookeeper连接中的最大等待时间                  |
| zookeeper.sync.time.ms            | 2000           | ZK follower可以落后ZK leader的最大时间                       |
| offsets.storage                   | zookeeper      | 用于存放offsets的地点： zookeeper或者kafka                   |
| offset.channel.backoff.ms         | 1000           | 重新连接offsets channel或者是重试失败的offset的fetch/commit请求的backoff时间 |
| offsets.channel.socket.timeout.ms | 10000          | 当读取offset的fetch/commit请求回应的socket 超时限制。此超时限制是被consumerMetadata请求用来请求offset管理 |
| offsets.commit.max.retries        | 5              | 重试offset commit的次数。这个重试只应用于offset  commits在shut-down之间。他 |
| dual.commit.enabled               | true           | 如果使用“kafka”作为offsets.storage，你可以二次提交offset到zookeeper(还有一次是提交到kafka）。在zookeeper-based的offset   storage到kafka-based的offset storage迁移时，这是必须的。对任意给定的consumer   group来说，比较安全的建议是当完成迁移之后就关闭这个选项 |
| partition.assignment.strategy     | range          | 在“range”和“roundrobin”策略之间选择一种作为分配partitions给consumer 数据流的策略；  循环的partition分配器分配所有可用的partitions以及所有可用consumer   线程。它会将partition循环的分配到consumer线程上。如果所有consumer实例的订阅都是确定的，则partitions的划分是确定的分布。循环分配策略只有在以下条件满足时才可以：（1）每个topic在每个consumer实力上都有同样数量的数据流。（2）订阅的topic的集合对于consumer   group中每个consumer实例来说都是确定的。 |



