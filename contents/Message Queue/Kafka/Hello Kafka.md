## 1. 消息队列实现原理

<img src='../../../images/Message Queue/Kafka/mq.png'>



- **点对点模式**（一对一，消费者主动拉取数据，消息收到后消息清除） 点对点模型通常是一个基于拉取或者轮询的消息传送模型，这种模型从队列中请求信息， 而不是将消息推送到客户端。这个模型的特点是发送到队列的消息被一个且只有一个接收者接收处理，即使有多个消息监听者也是如此。 
- **发布/订阅模式**（一对多，数据生产后，推送给所有订阅者） 发布订阅模型则是一个基于推送的消息传送模型。发布订阅模型可以有多种不同的订阅者，临时订阅者只在主动监听主题时才接收消息，而持久订阅者则监听主题的所有消息，即使当前订阅者不可用，处于离线状态。    

------



## 2. 为什么需要消息队列 

1. **解耦**： 允许你独立的扩展或修改两边的处理过程，只要确保它们遵守同样的接口约束。
2. **冗余**：消息队列把数据进行持久化直到它们已经被完全处理，通过这一方式规避了数据丢失风 险。许多消息队列所采用的"插入-获取-删除"范式中，在把一个消息从队列中删除之前，需 要你的处理系统明确的指出该消息已经被处理完毕，从而确保你的数据被安全的保存直到你使用完毕。 
3. **扩展性**： 因为消息队列解耦了你的处理过程，所以增大消息入队和处理的频率是很容易的，只要 另外增加处理过程即可。 
4. **灵活性 & 峰值处理能力**： 在访问量剧增的情况下，应用仍然需要继续发挥作用，但是这样的突发流量并不常见。 如果为以能处理这类峰值访问为标准来投入资源随时待命无疑是巨大的浪费。使用消息队列 能够使关键组件顶住突发的访问压力，而不会因为突发的超负荷的请求而完全崩溃。 
5. **可恢复性**： 系统的一部分组件失效时，不会影响到整个系统。消息队列降低了进程间的耦合度，所 以即使一个处理消息的进程挂掉，加入队列中的消息仍然可以在系统恢复后被处理。
6. **顺序保证**： 在大多使用场景下，数据处理的顺序都很重要。大部分消息队列本来就是排序的，并且 能保证数据会按照特定的顺序来处理。（Kafka 保证一个 Partition 内的消息的有序性）
7. **缓冲**： 有助于控制和优化数据流经过系统的速度， 解决生产消息和消费消息的处理速度不一致 的情况。 
8. **异步通信**： 很多时候，用户不想也不需要立即处理消息。消息队列提供了异步处理机制，允许用户把一个消息放入队列，但并不立即处理它。想向队列中放入多少消息就放多少，然后在需要 的时候再去处理它们    

------



## 3. 泥豪，Kafka

Kafka是一个分布式的流处理平台。是支持分区的（partition）、多副本的（replica），基于zookeeper协调的分布式消息系统，它的最大的特性就是可以实时的处理大量数据以满足各种需求场景：比如基于hadoop的批处理系统、低延迟的实时系统、storm/Spark流式处理引擎，web/nginx日志、访问日志，消息服务等等 

#### 有三个关键能力

- 它可以让你发布和订阅记录流。在这方面，它类似于一个消息队列或企业消息系统
- 它可以让你持久化收到的记录流，从而具有容错能力。
- 它可以让你处理收到的记录流。

#### 它应用于2大类应用

- 构建实时的流数据管道，可靠地获取系统和应用程序之间的数据。
- 构建实时流的应用程序，对数据流进行转换或反应。



### 3.1 概念

- kafka作为一个集群运行在一个或多个服务器上。
- kafka集群存储的消息是以topic为类别记录的。
- 每个消息是由一个key，一个value和时间戳构成。



#### Kafka有四个核心API：

- [生产者 API](http://kafka.apache.org/documentation.html#producerapi) 允许应用程序发布记录流至一个或多个Kafka的话题(Topics)。

- [消费者API](http://kafka.apache.org/documentation.html#consumerapi)允许应用程序订阅一个或多个主题，并处理这些主题接收到的记录流。

- [Streams API](http://kafka.apache.org/documentation/streams)允许应用程序充当流处理器（stream processor），从一个或多个主题获取输入流，并生产一个输出流至一个或多个的主题，能够有效地变换输入流为输出流。

- [Connector API](http://kafka.apache.org/documentation.html#connect)允许构建和运行可重用的生产者或消费者，能够把 Kafka主题连接到现有的应用程序或数据系统。例如，一个连接到关系数据库的连接器(connector)可能会获取每个表的变化。

  <img src='../../../images/Message Queue/Kafka/kafka-apis.png'>

Kafka的客户端和服务器之间的通信是靠一个简单的，高性能的，与语言无关的[TCP协议](https://kafka.apache.org/protocol.html)完成的。这个协议有不同的版本，并保持向后兼容旧版本。Kafka不光提供了一个Java客户端，还有[许多语言](https://cwiki.apache.org/confluence/display/KAFKA/Clients)版本的客户端。

#### 主题和日志

主题是一种分类或发布的一系列记录的名义上的名字。Kafka的主题始终是支持多用户订阅的; 也就是说，一个主题可以有零个，一个或多个消费者订阅写入的数据。

对于每一个主题，Kafka集群保持一个分区日志文件，看下图：

<img src='../../../images/Message Queue/Kafka/log_anatomy.png'>

**每个分区是一个有序的，不可变的消息序列**，新的消息不断追加到这个有组织的有保证的日志上。分区会给每个消息记录分配一个**顺序ID号 – 偏移量**， 能够唯一地标识该分区中的每个记录。**kafka不能保证全局有序，只能保证分区内有序** 。

Kafka集群保留所有发布的记录，不管这个记录有没有被消费过，Kafka提供可配置的保留策略去删除旧数据(还有一种策略根据分区大小删除数据)。例如，如果将保留策略设置为两天，在记录公布后两天，它可用于消费，之后它将被丢弃以腾出空间。Kafka的性能跟存储的数据量的大小无关， 所以将数据存储很长一段时间是没有问题的。

<img src='../../../images/Message Queue/Kafka/log_consumer.png'>

事实上，保留在每个消费者元数据中的最基础的数据就是消费者正在处理的当前记录的**偏移量(offset)或位置(position)**。这种偏移是由消费者控制：通常偏移会随着消费者读取记录线性前进，但事实上，因为其位置是由消费者进行控制，消费者可以在任何它喜欢的位置读取记录。例如，消费者可以恢复到旧的偏移量对过去的数据再加工或者直接跳到最新的记录，并消费从“现在”开始的新的记录。

这些功能的结合意味着，实现Kafka的消费者的代价都是很小的，他们可以增加或者减少而不会对集群或其他消费者有太大影响。例如，你可以使用我们的命令行工具去追随任何主题，而且不会改变任何现有的消费者消费的记录。

数据日志的分区，一举数得。首先，它们允许数据能够扩展到更多的服务器上去。每个单独的分区的大小受到承载它的服务器的限制，但一个话题可能有很多分区，以便它能够支持海量的的数据。其次，更重要的意义是分区是进行并行处理的基础单元。

#### 分布式

日志的分区会跨服务器的分布在Kafka集群中，每个服务器会共享分区进行数据请求的处理。**每个分区可以配置一定数量的副本分区提供容错能力。**

**每个分区都有一个服务器充当“leader”和零个或多个服务器充当“followers”**。 leader处理所有的读取和写入分区的请求，而followers被动的从领导者拷贝数据。如果leader失败了，followers之一将自动成为新的领导者。每个服务器可能充当一些分区的leader和其他分区的follower，这样的负载就会在集群内很好的均衡分配。

#### 生产者

生产者发布数据到他们所选择的主题。生产者负责选择把记录分配到主题中的哪个分区。这可以使用轮询算法( round-robin)进行简单地平衡负载，也可以根据一些更复杂的语义分区算法（比如基于记录一些键值）来完成。

#### 消费者

消费者以消费群（**consumer group** ）的名称来标识自己，每个发布到主题的消息都会发送给订阅了这个主题的消费群里面的一个消费者的一个实例。消费者的实例可以在单独的进程或单独的机器上。

如果所有的消费者实例都属于相同的消费群，那么记录将有效地被均衡到每个消费者实例。

如果所有的消费者实例有不同的消费群，那么每个消息将被广播到所有的消费者进程。

这是kafka用来实现一个topic消息的广播（发给所有的consumer） 和单播（发给任意一个 consumer）的手段。一个 topic 可以有多个 CG。 topic 的消息会复制 （不是真的复制，是概念上的）到所有的 CG，但每个 partion 只会把消息发给该 CG 中的一 个 consumer。如果需要实现广播，只要每个 consumer 有一个独立的 CG 就可以了。要实现 单播只要所有的 consumer 在同一个 CG。用 CG 还可以将 consumer 进行自由的分组而不需 要多次发送消息到不同的 topic； 

<img src='../../../images/Message Queue/Kafka/sumer-groups.png'>

两个服务器的Kafka集群具有四个分区（P0-P3）和两个消费群。A消费群有两个消费者，B群有四个。

更常见的是，我们会发现主题有少量的消费群，每一个都是“逻辑上的订阅者”。每组都是由很多消费者实例组成，从而实现可扩展性和容错性。这只不过是发布 – 订阅模式的再现，区别是这里的订阅者是一组消费者而不是一个单一的进程的消费者。

**Kafka消费群的实现方式是通过分割日志的分区，分给每个Consumer实例，使每个实例在任何时间点的都可以“公平分享”独占的分区**。维持消费群中的成员关系的这个过程是通过Kafka动态协议处理。如果新的实例加入该组，他将接管该组的其他成员的一些分区; 如果一个实例死亡，其分区将被分配到剩余的实例。

Kafka只保证一个分区内的消息有序，不能保证一个主题的不同分区之间的消息有序。分区的消息有序与依靠主键进行数据分区的能力相结合足以满足大多数应用的要求。但是，如果你想要保证所有的消息都绝对有序可以只为一个主题分配一个分区，虽然这将意味着每个消费群同时只能有一个消费进程在消费。

#### 保证

Kafka提供了以下一些高级别的保证：	

- 由生产者发送到一个特定的主题分区的消息将被以他们被发送的顺序来追加。也就是说，如果一个消息M1和消息M2都来自同一个生产者，M1先发，那么M1将有一个低于M2的偏移，会更早在日志中出现。
- 消费者看到的记录排序就是记录被存储在日志中的顺序。
- 对于副本因子N的主题，我们将承受最多N-1次服务器故障切换而不会损失任何的已经保存的记录。

#### Kafka作为消息系统

如何将Kafka的流的概念和传统的企业信息系统作比较？

消息处理模型历来有两种：[队列](http://en.wikipedia.org/wiki/Message_queue)和[发布-订阅](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)。在队列模型中，一组消费者可以从服务器读取记录，每个记录都会被其中一个消费者处理; 在发布-订阅模式里，记录被广播到所有的消费者。这两种模式都具有一定的优点和弱点。队列的优点是它可以让你把数据分配到多个消费者去处理，它可以让您扩展你的处理能力。不幸的是，队列不支持多个订阅者，一旦一个进程读取了数据，这个数据就会消失。发布-订阅模式可以让你广播数据到多个进程，但是因为每一个消息发送到每个订阅者，没办法对订阅者处理能力进行扩展。

Kafka的消费群推广了这两个概念。消费群可以像队列一样让消息被一组进程处理（消费群的成员），与发布 – 订阅模式一样，Kafka可以让你发送广播消息到多个消费群。

Kafka的模型的优点是，每个主题都具有这两个属性，它可以扩展处理能力，也可以实现多个订阅者，没有必要二选一。

Kafka比传统的消息系统具有更强的消息顺序保证的能力。

传统的消息队列的消息在队列中是有序的，多个消费者从队列中消费消息，服务器按照存储的顺序派发消息。然而，尽管服务器是按照顺序派发消息，但是这些消息记录被异步传递给消费者，消费者接收到的消息也许已经是乱序的了。这实际上意味着消息的排序在并行消费中都将丢失。消息系统通常靠 “排他性消费”( exclusive consumer)来解决这个问题，只允许一个进程从队列中消费，当然，这意味着没有并行处理的能力。

Kafka做的更好。通过一个概念：并行性-分区-主题实现主题内的并行处理，Kafka是能够通过一组消费者的进程同时提供排序保证和负载均衡。每个主题的分区指定给每个消费群中的一个消费者，使每个分区只由该组中的一个消费者所消费。通过这样做，我们确保消费者是一个分区唯一的读者，从而顺序的消费数据。因为有许多的分区，所以负载还能够均衡的分配到很多的消费者实例上去。但是请注意，一个消费群的消费者实例不能比分区数量多。

#### Kafka作为存储系统

任何消息队列都能够解耦消息的生产和消费，还能够有效地存储正在传送的消息。Kafka与众不同的是，它是一个非常好的存储系统。

Kafka把消息数据写到磁盘和备份分区。Kafka允许生产者等待返回确认，直到副本复制和持久化全部完成才认为成功，否则则认为写入服务器失败。

Kafka使用的磁盘结构很好扩展，Kafka将执行相同的策略不管你是有50 KB或50TB的持久化数据。

由于存储的重要性，并允许客户控制自己的读取位置，你可以把Kafka认为是一种特殊用途的分布式文件系统，致力于高性能，低延迟的有保障的日志存储，能够备份和自我复制。

#### Kafka流处理

只是读，写，以及储存数据流是不够的，目的是能够实时处理数据流。

在Kafka中，流处理器是从输入的主题连续的获取数据流，然后对输入进行一系列的处理，并生产连续的数据流到输出主题。

例如，零售应用程序可能需要输入销售和出货量，根据输入数据计算出重新订购的数量和调整后的价格，然后输出到主题。

这些简单处理可以直接使用生产者和消费者的API做到。然而，对于更复杂的转换Kafka提供了一个完全集成的[流API](http://kafka.apache.org/documentation/streams)。这允许应用程序把一些重要的计算过程从流中剥离或者加入流一起。

这种设施可帮助解决这类应用面临的难题：处理杂乱的数据，改变代码去重新处理输入，执行有状态的计算等

流API建立在Kafka提供的核心基础单元之上：它使用生产者和消费者的API进行输入输出，使用Kafka存储有状态的数据，并使用群组机制在一组流处理实例中实现容错。

#### 把功能组合起来

消息的传输，存储和流处理的组合看似不寻常却是Kafka作为流处理平台的关键。

像HDFS分布式文件系统，允许存储静态文件进行批量处理。像这样的系统允许存储和处理过去的历史数据。

传统的企业消息系统允许处理您订阅后才抵达的消息。这样的系统只能处理将来到达的数据。

Kafka结合了这些功能，这种结合对Kafka作为流应用平台以及数据流处理的管道至关重要。

通过整合存储和低延迟订阅，流处理应用可以把过去和未来的数据用相同的方式处理。这样一个单独的应用程序，不但可以处理历史的，保存的数据，当它到达最后一条记录不会停止，继续等待处理未来到达的数据。这是泛化了的的流处理的概念，包括了批处理应用以及消息驱动的应用。

同样，流数据处理的管道结合实时事件的订阅使人们能够用Kafka实现低延迟的管道; 可靠的存储数据的能力使人们有可能使用它传输一些重要的必须保证可达的数据。可以与一个定期加载数据的线下系统集成，或者与一个因为维护长时间下线的系统集成。流处理的组件能够保证转换（处理）到达的数据。



### 3.2 Kafka架构图

<img src='../../../images/Message Queue/Kafka/kakfa-principle.png'>





- Broker ：一台 kafka 服务器就是一个 broker。一个集群由多个 broker 组成。一个 broker 可以容纳多个 topic； 
- Partition：为了实现扩展性，一个非常大的 topic 可以分布到多个 broker（即服务器）上， 一个 topic 可以分为多个 partition，每个 partition 是一个有序的队列。 partition 中的每条消息 都会被分配一个有序的 id（ offset）。 kafka 只保证按一个 partition 中的顺序将消息发给 consumer，不保证一个 topic 的整体（多个 partition 间）的顺序； 
- Offset： kafka 的存储文件都是按照 offset.kafka 来命名，用 offset 做名字的好处是方便查 找。例如你想找位于 2049 的位置，只要找到 2048.kafka 的文件即可。当然 the first offset 就 是 00000000000.kafka。



### 3.3 Kafka的使用场景

#### 消息

Kafka被当作传统消息中间件的替代品。消息中间件的使用原因有多种（从数据生产者解耦处理，缓存未处理的消息等）。与大多数消息系统相比，Kafka具有更好的吞吐量，内置的分区，多副本和容错功能，这使其成为大规模消息处理应用程序的良好解决方案。

#### 网站行为跟踪

Kafka的初衷就是能够将用户行为跟踪管道重构为一组实时发布-订阅数据源。这意味着网站活动（页面浏览量，搜索或其他用户行为）将被发布到中心主题，这些中心主题是每个用户行为类型对应一个主题的。这些数据源可被订阅者获取并用于一系列的场景，包括实时处理，实时监控和加载到Hadoop或离线数据仓库系统中进行离线处理和报告。用户行为跟踪通常是非常高的数据量，因为用户每个页面浏览的都会生成许多行为活动消息。

#### 测量

kafka经常用于运行监控数据。这涉及汇总分布式应用程序的统计数据，以产生操作运营数据的汇总数据。

#### 日志聚合

许多人使用Kafka作为日志搜集解决方案的替代品。日志搜集通常从服务器收集物理日志文件，并将它们集中放置（可能是文件服务器或HDFS），以便后续处理。kafka抽象出文件的细节，并将日志或事件数据作为消息流清晰地抽象出来。这可以为更低处理延迟提供支持，对多数据源和分布式数据消费更容易支持。与以日志为中心的系统（如Scribe或Flume）相比，Kafka性能同样出色，由于副本机制确保了更强的耐用性保，并且端到端延迟更低。

#### 流处理

许多kafka使用者处理由多个阶段组成的处理管道中的数据，其中原始输入数据从kafka主题消费，然后汇总，丰富或以其他方式转换为新主题以便进一步消费或后续处理。例如，用于推荐新闻文章的管道可以从RSS提要中抓取文章内容并将其发布到“文章”主题;进一步规范化或删除重复内容，并将清洗后的文章内容发布到新主题。最后的处理阶段可能会尝试向用户推荐这些内容。这样的管道创建实时基于各个主题数据流图。从0.10.0.0版本开始，Apache Kafka提供了一个名为Kafka Streams的轻量级，但功能强大的流处理库，可执行如上所述的数据处理。除了Kafka Streams之外，替代开源流处理工具还包括[Apache Storm](https://storm.apache.org/)和[Apache Samza](http://samza.apache.org/)。

#### 事件源

[事件源](http://martinfowler.com/eaaDev/EventSourcing.html)是一种应用程序设计风格，其中状态的改变作为事件序列被记录下来。 Kafka对非常大的存储日志数据提供支持，使其成为以此风格构建的应用程序的一种优秀后端。

#### 提交日志

Kafka可以作为分布式系统的一种外部提交日志。日志有助于在节点间复制数据，并作为故障节点恢复其数据的重新同步机制。kafka日志压缩功能有助于这种使用场景。在这个场景中，Kafka类似于[Apache BookKeeper](http://zookeeper.apache.org/bookkeeper/)。



在流式计算中， Kafka 一般用来缓存数据， Storm 通过消费 Kafka 的数据进行计算。

-  Kafka 作为一个分布式消息队列。 Kafka 对消息保存时根据 Topic 进行归类，发送消息 者称为 Producer，消息接受者称为 Consumer，此外 kafka 集群由多个 kafka 实例组成，每个实例(server)称为 broker。 
-  无论是 kafka 集群，还是 consumer 都依赖于 zookeeper 集群保存一些 meta 信息， 来保证系统可用性。  
-  Kafka的客户端和服务器之间的通信是靠一个简单的，高性能的，与语言无关的[TCP协议](https://kafka.apache.org/protocol.html)完成的。这个协议有不同的版本，并保持向后兼容旧版本。Kafka不光提供了一个Java客户端，还有[许多语言版本的客户端。 


------



## 3.上手操作

[Quickstart](<https://kafka.apache.org/quickstart> )

[中文版入门指南](<http://ifeve.com/kafka-1/> )

------



## 4.Kafka 工作流程分析和存储机制    

<img src='../../../images/Message Queue/Kafka/kafka-workflow.jpg'>

**Kafka中消息是以topic进行分类的**，生产者生产消息，消费者消费消息，都是面向topic的。

topic是逻辑上的概念，二patition是物理上的概念，每个patition对应一个log文件，而log文件中存储的就是producer生产的数据，patition生产的数据会被不断的添加到log文件的末端，且每条数据都有自己的offset。消费组中的每个消费者，都是实时记录自己消费到哪个offset，以便出错恢复，从上次的位置继续消费。

<img src='../../../images/Message Queue/Kafka/kafka-partition.jpg'>





由于生产者生产的消息会不断追加到log文件末尾，为防止log文件过大导致数据定位效率低下，Kafka采取了**分片**和**索引**机制，将每个partition分为多个segment。每个segment对应两个文件——“.index”文件和“.log”文件。这些文件位于一个文件夹下，该文件夹的命名规则为：topic名称+分区序号。例如，first这个topic有三个分区，则其对应的文件夹为first-0,first-1,first-2。

```shell
00000000000000000000.index
00000000000000000000.log
00000000000000170410.index
00000000000000170410.log
00000000000000239430.index
00000000000000239430.log
```

index和log文件以当前segment的第一条消息的offset命名。下图为index文件和log文件的结构示意图。 

<img src='../../../images/Message Queue/Kafka/kafka-segement.jpg'>



### 4.1 Kafka 生产过程    

#### 4.1.1 写入流程

producer 写入消息流程如下： 

<img src="E:/gitBlog/Technical-Learning/images/Message%20Queue/Kafka/kafka-write-flow.png">



1. producer 先从 zookeeper 的 "/brokers/.../state"节点找到该 partition 的 leader
2. producer 将消息发送给该 leader 
3. leader 将消息写入本地 log 
4. followers 从 leader pull 消息，写入本地 log 后向 leader 发送 ACK    
5. leader 收到所有 ISR 中的 replication 的 ACK 后，增加 HW（high watermark，最后 commit 的 offset）并向 producer 发送 ACK 

#### 4.1.2 写入方式 

​	producer 采用推（push） 模式将消息发布到 broker，每条消息都被追加（append） 到分区（patition） 中，属于顺序写磁盘（顺序写磁盘效率比随机写内存要高，保障 kafka 吞吐率）。

####  4.1.3 分区（Partition） 

​	消息发送时都被发送到一个 topic，其本质就是一个目录，而 topic 是由一些 Partition Logs(分区日志)组成

- 分区的原因 

1. **方便在集群中扩展**，每个 Partition 可以通过调整以适应它所在的机器，而一个 topic 又可以有多个 Partition 组成，因此整个集群就可以适应任意大小的数据了；

2. **可以提高并发**，因为可以以 Partition 为单位读写了。 

- 分区的原则 

1. 指定了 patition，则直接使用； 

2. 未指定 patition 但指定 key，通过对 key 的 value 进行 hash 出一个 patition； 

3. patition 和 key 都未指定，使用轮询选出一个 patition。    


#### 4.1.4 副本（Replication）

 	同 一 个 partition 可 能 会 有 多 个 replication （ 对 应 server.properties 配 置 中 的 default.replication.factor=N）。没有 replication 的情况下，一旦 broker 宕机，其上所有 patition 的数据都不可被消费，同时 producer 也不能再将数据存于其上的 patition。引入 replication 之后，同一个 partition 可能会有多个 replication，而这时需要在这些 replication 之间选出一 个 leader， producer 和 consumer 只与这个 leader 交互，其它 replication 作为 follower 从 leader 中复制数据    

#### 4.1.5 数据可靠性保证

​	为保证producer发送的数据，能可靠的发送到指定的topic，topic的每个partition收到producer数据后，都需要向producer发送ack（acknowledgement确认收到），如果producer收到ack，就会进行下一轮的发送，否则重新发送数据。

<img src='../../../images/Message Queue/Kafka/kafka-ack-slg.png'>

##### 1) 副本数据同步策略

| 方案                        | 优点                                               | 缺点                                                |
| --------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| 半数以上完成同步，就发送ack | 延迟低                                             | 选举新的leader时，容忍n台借点的故障，需要2n+1个副本 |
| 全部完成同步，才发送ack     | 选举新的leader时，容忍n台借点的故障，需要n+1个副本 | 延迟高                                              |

Kafka选择了第二种方案，原因如下：

- 同样为了容忍n台节点的故障，第一种方案需要的副本数相对较多，而Kafka的每个分区都有大量的数据，第一种方案会造成大量的数据冗余；
- 虽然第二种方案的网络延迟会比较高，但网络延迟对Kafka的影响较小。

##### 2) ISR

​	采用第二种方案之后，设想一下情景：leader收到数据，所有follower都开始同步数据，但有一个follower挂了，迟迟不能与leader保持同步，那leader就要一直等下去，直到它完成同步，才能发送ack，这个问题怎么解决呢？

​	leader维护了一个动态的in-sync replica set(ISR),意为和leader保持同步的follower集合。当ISR中的follower完成数据的同步之后，leader就会给follower发送ack。如果follower长时间未向leader同步数据，则该follower将会被踢出ISR，该时间阈值由replica.lag.time.max.ms参数设定。leader发生故障之后，就会从ISR中选举新的leader。（之前还有另一个参数，0.9 版本之后 replica.lag.max.messages 参数被移除了）

##### 3) ack应答机制

​	对于某些不太重要的数据，对数据的可靠性要求不是很高，能够容忍数据的少量丢失，所以没必要等ISR中的follower全部接收成功。

​	所以Kafka为用户提供了**三种可靠性级别**，用户根据对可靠性和延迟的要求进行权衡，选择以下的配置。

**acks参数配置：**

- **acks:**

  ​	0：producer不等待broker的ack，这一操作提供了一个最低的延迟，broker一接收到还没有写入磁盘就已经返回，当broker故障时有可能**丢失数据**；

  ​	1：producer不等待broker的ack，这一操作提供了一个最低的延迟，broker一接收到还没有写入磁盘就已经返回，当broker故障时有可能**丢失数据**（下图为acks=1数据丢失案例）；

<img src='../../../images/Message Queue/Kafka/kafka-ack=1.png'>

​	-1（all）：producer等待broker的ack，partition的leader和follower全部落盘成功后才返回ack。但是	如果在follower同步完成后，broker发送ack之前，leader发生故障，那么就会造成**数据重复**。（下图为acks=1数据重复案例）

<img src='../../../images/Message Queue/Kafka/kafka-ack=-1.png'>

##### 4) 故障处理

<img src='../../../images/Message Queue/Kafka/kafka-leo.png'>



- **LEO: 指的是每个副本最大的offset;**
- **HW：指的是消费者能见到的最大的offset，ISR队列中最小的LEO;**

（1）**followew故障**

​	follower发生故障后会被临时踢出ISR,待该follower恢复后，follower会读取本地磁盘记录的上次的HW，并将log文件高于HW的部分截取掉，从HW开始向leader进行同步。等**该followew的LEO大于该Partition的HW**，即follower追上leader之后，就可以重新加入ISR了。

（2） **leader故障**

​	leader发生故障之后，会从ISR中选出一个新的leader，之后，为保证多个副本之间的数据一致性，其余的follower会先将各自的log文件高于HW的部分截掉，然后从新的leader同步数据。

​	注意：这**只能保证副本之间的数据一致性，并不能保证数据不丢失或者不重复**。

#### 4.1.6 Exactly Once语义

​	将服务器的ACK级别设置为-1，可以保证Producer到Server之间不会丢失数据，即At Least Once语义。相对的，将服务器ACK级别设置为0，可以保证生产者每条消息只会被发送一次，即At Most Once语义。

​	At Least Once可以保证数据不丢失，但是不能保证数据不重复。相对的，At Least Once可以保证数据不重复，但是不能保证数据不丢失。但是，对于一些非常重要的信息，比如说交易数据，下游数据消费者要求数据既不重复也不丢失，即Exactly Once语义。在0.11版本以前的Kafka，对此是无能为力的，智能保证数据不丢失，再在下游消费者对数据做全局去重。对于多个下游应用的情况，每个都需要单独做全局去重，这就对性能造成了很大的影响。

​	0.11版本的Kafka，引入了一项重大特性：幂等性。所谓的幂等性就是指	Producer不论向Server发送多少次重复数据。Server端都会只持久化一条，幂等性结合At Least Once语义，就构成了Kafka的Exactily Once语义，即： **<u>At Least Once + 幂等性 = Exactly Once</u>**

​	要启用幂等性，只需要将Producer的参数中enable.idompotence设置为true即可。Kafka的幂等性实现其实就是将原来下游需要做的去重放在了数据上游。开启幂等性的Producer在初始化的时候会被分配一个PID，发往同一Partition的消息会附带Sequence Number。而Broker端会对<PID,Partition,SeqNumber>做缓存，当具有相同主键的消息提交时，Broker只会持久化一条。

​	但是PID重启就会变化，同时不同的Partition也具有不同主键，所以幂等性无法保证跨分区会话的Exactly Once。

![1570516198641](C:\Users\JIAHAI~1\AppData\Local\Temp\1570516198641.png)




### 4.2 Broker 保存消息

#### 4.2.1 存储方式 

​	物理上把 topic 分成一个或多个 patition（对应 server.properties 中的 num.partitions=3 配 置），每个 patition 物理上对应一个文件夹（该文件夹存储该 patition 的所有消息和索引文 件）。    

#### 4.2.2 存储策略 

​	无论消息是否被消费， kafka 都会保留所有消息。有两种策略可以删除旧数据： 

1. 基于时间： log.retention.hours=168 

2. 基于大小： log.retention.bytes=1073741824 需要注意的是，因为 Kafka 读取特定消息的时间复杂度为 O(1)，即与文件大小无关， 所以这里删除过期文件与提高 Kafka 性能无关。   



#### 4.2.3 Zookeeper在Kafka中的作用    

- **存储结构**

<img src='../../../images/Message Queue/Kafka/zookeeper-store.png'>



注意： producer 不在 zk 中注册， 消费者在 zk 中注册。

-  Zookeeper在Kafka中的作用

  ​	Kafka集群中有一个broker会被选举为Controller，**负责管理集群broker的上线下，所有topic的分区副本分配和leader选举等工作**。

  ​	Controller的管理工作都是依赖于Zookeeper的。

  ​	下图为partition的leader选举过程：

<img src='../../../images/Message Queue/Kafka/controller-leader.png'>



### 4.3 Kafka 消费过程 

#### 4.3.1 消费者组

<img src='../../../images/Message Queue/Kafka/kafka-consume-group.png'>

​	消费者是以 consumer group 消费者组的方式工作，由一个或者多个消费者组成一个组， 共同消费一个 topic。每个分区在同一时间只能由 group 中的一个消费者读取，但是多个 group 可以同时消费这个 partition。在图中，有一个由三个消费者组成的 group，有一个消费者读 取主题中的两个分区，另外两个分别读取一个分区。某个消费者读取某个分区，也可以叫做 某个消费者是某个分区的拥有者。

​	在这种情况下，消费者可以通过水平扩展的方式同时读取大量的消息。另外，如果一个 消费者失败了，那么其他的 group 成员会自动负载均衡读取之前失败的消费者读取的分区。    

#### 4.3.2 消费方式

**consumer 采用 pull（拉） 模式从 broker 中读取数据。** 

​	push（推）模式很难适应消费速率不同的消费者，因为消息发送速率是由 broker 决定的。 它的目标是尽可能以最快速度传递消息，但是这样很容易造成 consumer 来不及处理消息， 典型的表现就是拒绝服务以及网络拥塞。而 pull 模式则可以根据 consumer 的消费能力以适当的速率消费消息。 

​	对于 Kafka 而言， pull 模式更合适，它可简化 broker 的设计， consumer 可自主控制消费消息的速率，同时 consumer 可以自己控制消费方式——即可批量消费也可逐条消费，同时 还能选择不同的提交方式从而实现不同的传输语义。 

​	pull 模式不足之处是，如果 kafka 没有数据，消费者可能会陷入循环中，一直等待数据到达，一直返回空数据。为了避免这种情况，我们在我们的拉请求中有参数，允许消费者请求在等待数据到达 的“长轮询”中进行阻塞（并且可选地等待到给定的字节数，以确保大的传输大小）。    

#### 4.3.3 分区分配策略

​	一个consumer group中有多个consumer，一个topic有多个partition，所以必然会涉及到partition的分配问题，即确定哪个partition由哪个consumer来消费。

​	Kafka有两种分配策略，一是RoundRobin，一是Range。

#### 4.3.4 offset的维护

​	由于consumer在消费过程中可能会出现断电宕机等故障，consumer恢复后，需要从故障前的位置继续消费，所以consumer需要实时记录自己消费到了哪个offset，以便故障恢复后继续消费。

​	Kafka 0.9版本之前，consumer默认将offset保存在Zookeeper中，从0.9版本开始，consumer默认将offset保存在Kafka一个内置的topic中，该topic为**_consumer_offsets**。

- 修改配置文件consumer.properties

```shell
exclude.internal.topics=false
```

- **查询__consumer_offsets topic所有内容** 

**注意：运行下面命令前先要在consumer.properties中设置exclude.internal.topics=false**

0.11.0.0之前版本

```shell
bin/kafka-console-consumer.sh --topic __consumer_offsets --zookeeper localhost:2181 --formatter "kafka.coordinator.GroupMetadataManager\$OffsetsMessageFormatter" --consumer.config config/consumer.properties --from-beginning
```

**0.11.0.0之后版本(含)**

```shell
bin/kafka-console-consumer.sh --topic __consumer_offsets --zookeeper localhost:2181 --formatter "kafka.coordinator.group.GroupMetadataManager\$OffsetsMessageFormatter" --consumer.config config/consumer.properties --from-beginning
```

默认情况下__consumer_offsets有50个分区，如果你的系统中consumer group也很多的话，那么这个命令的输出结果会很多



### 4.4 Kafka高效读写数据的原因

#### 4.4.1 顺序写磁盘

​	Kafka的producer生产数据，要写入到log文件中，写的过程是一直追加到文件末端，为顺序写。官网有数据表明，同样的磁盘，顺序写能到到600M/s，而随机写只有100k/s。这与磁盘的机械机构有关，顺序写之所以快，是因为其省去了大量磁头寻址的时间 。

#### 4.4.2 零拷贝技术（todo...）

<img src='../../../images/Message Queue/Kafka/zero-copy.png'>



------



### 4.5 Kafka事务

​	Kafka从0.11版本开始引入了事务支持。事务可以保证Kafka在Exactly Once语义的基础上，生产和消费可以跨分区和会话，要么全部成功，要么全部失败。

#### 4.5.1 Producer事务

​	为了了实现跨分区跨会话的事务，需要引入一个全局唯一的TransactionID，并将Producer获得的PID和Transaction ID绑定。这样当Producer重启后就可以通过正在进行的TransactionID获得原来的PID。

​	为了管理Transaction，Kafka引入了一个新的组件Transaction Coordinator。Producer就是通过和Transaction Coordinator交互获得Transaction ID对应的任务状态。Transaction Coordinator还负责将事务所有写入Kafka的一个内部Topic，这样即使整个服务重启，由于事务状态得到保存，进行中的事务状态可以得到恢复，从而继续进行。

#### 4.5.2 Consumer事务

​	对Consumer而言，事务的保证就会相对较弱，尤其是无法保证Commit的消息被准确消费。这是由于Consumer可以通过offset访问任意信息，而且不同的SegmentFile生命周期不同，同一事务的消息可能会出现重启后被删除的情况。

------



## 5. Kafka API（Java中的Kafka使用）

### 5.1 启动zk和kafka集群

<img src='../../../images/Message Queue/Kafka/kafka-start.png'>

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

​	Kafka的Producer发送消息采用的是**异步发送**的方式。在消息发送过程中，涉及到了两个线程：**main线程和Sender线程**，以及一个线程共享变量：**RecordAccumulator**。main线程将消息发送给RecordAccumulator，Sender线程不断从RecordAccumulator中拉取消息发送到Kafka broker。

<img src='../../../images/Message Queue/Kafka/kafka-producer-thread.png'>

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

通过 producer.send（record)返回Future对象，通过调用Future.get()进行无限等待结果返回。 

```java
producer.send（record).get()
```

 

### 5.4 创建消费者

kafka 提供了两套 consumer API： 高级 Consumer API 和低级 Consumer API。 

#### 4.3.1 高级 API（自动提交offset）

- 高级 API 优点 

  - 高级 API 写起来简单
  - 不需要自行去管理 offset，系统通过 zookeeper 自行管理。 
  - 不需要管理分区，副本等情况， .系统自动管理。 消费者断线会自动根据上一次记录在 zookeeper 中的 offset 去接着获取数据（默认设置 1 分钟更新一下 zookeeper 中存的 offset） 可以使用 group 来区分对同一个 topic 的不同程序访问分离开来（不同的 group 记录不 同的 offset，这样不同程序读取同一个 topic 才不会因为 offset 互相影响） 

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

  <img src="E:/gitBlog/Technical-Learning/images/Message%20Queue/Kafka/kakfa-java-demo.png"/>

  

#### 4.3.2 低级 API(手动提交offset)

- 低级 API 优点    

  - **能够让开发者自己控制 offset，想从哪里读取就从哪里读取。** 
  - 自行控制连接分区，对分区自定义进行负载均衡 
  - 对 zookeeper 的依赖性降低（如： offset 不一定非要靠 zk 存储，自行存储 offset 即可， 比如存在文件或者内存中）

- 低级 API 缺点

  - 太过复杂，需要自行控制 offset，连接哪个分区，找到分区 leader 等。

- 手动提交offset的方法有两种，分别是commitSync(同步提交)和commitAsync(异步提交)。两者的相同点是，都会将本次poll的一批数据最高的偏移量提交；不同点是，commitSync阻塞当前线程，一直到提交成功，并且会自动失败重试（由不可控因素导致，也会出现提交失败）；而commitAsyc则没有失败重试机制，故有可能提交失败。

  ##### 1) 同步提交offset

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

------



## 6. Kafka producer 拦截器(interceptor) 

### 6.1 拦截器原理

​	Producer 拦截器(interceptor)是在 Kafka 0.10 版本被引入的，主要用于实现 clients 端的定制化控制逻辑。 	对于 producer 而言， interceptor 使得用户在消息发送前以及 producer 回调逻辑前有机会 对消息做一些定制化需求，比如**修改消息**等。同时， producer 允许用户指定多个 interceptor 按序作用于同一条消息从而形成一个拦截链(interceptor chain)。 Intercetpor 的实现接口是 **org.apache.kafka.clients.producer.ProducerInterceptor**，其定义的方法包括： 

1. configure(configs) ：获取配置信息和初始化数据时调用。 

2. onSend(ProducerRecord)： 该方法封装进 KafkaProducer.send 方法中，即它运行在用户主线程中。 Producer 确保在 消息被序列化以及计算分区前调用该方法。 用户可以在该方法中对消息做任何操作，但最好 保证不要修改消息所属的 topic 和分区， 否则会影响目标分区的计算 

3. onAcknowledgement(RecordMetadata, Exception)： 该方法会在消息被应答或消息发送失败时调用，并且通常都是在 producer 回调逻辑触 发之前。 onAcknowledgement 运行在 producer 的 IO 线程中，因此不要在该方法中放入很重 的逻辑，否则会拖慢 producer 的消息发送效率  

4. close： 关闭 interceptor，主要用于执行一些资源清理工作 如前所述， interceptor 可能被运行在多个线程中，因此在具体实现时用户需要自行确保 线程安全。另外倘若指定了多个 interceptor，则 producer 将按照指定顺序调用它们，并仅仅 是捕获每个 interceptor 可能抛出的异常记录到错误日志中而非在向上传递。这在使用过程中 要特别留意。


###  6.2 拦截器案例 

- 需求： 实现一个简单的双 interceptor 组成的拦截链。第一个 interceptor 会在消息发送前将时间 戳信息加到消息 value 的最前部；第二个 interceptor 会在消息发送后更新成功发送消息数或 失败发送消息数。      

<img src="E:/gitBlog/Technical-Learning/images/Message%20Queue/Kafka/interceptor-demo.png"/>



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

<img src='../../../images/Message Queue/Kafka/kakfa-streams-flow.png'/>    



​	第二，虽然 Cloudera 与 Hortonworks 方便了 Storm 和 Spark 的部署，但是这些框架的部 署仍然相对复杂。而 **Kafka Stream 作为类库，可以非常方便的嵌入应用程序中，它对应用的打包和部署基本没有任何要求**。 

​	第三，就流式处理系统而言，基本都支持 Kafka 作为数据源。例如 Storm 具有专门的 kafka-spout，而 Spark 也提供专门的 spark-streaming-kafka 模块。事实上， Kafka 基本上是主流的流式处理系统的标准数据源。换言之， **大部分流式系统中都已部署了 Kafka，此时使用 Kafka Stream 的成本非常低**。 

​	第四， **使用 Storm 或 Spark Streaming 时，需要为框架本身的进程预留资源**，如 Storm 的 supervisor 和 Spark on YARN 的 node manager。即使对于应用实例而言，框架本身也会占 用部分资源，如 Spark Streaming 需要为 shuffle 和 storage 预留内存。 但是 Kafka 作为类库不占用系统资源。 

​	第五，由于 **Kafka 本身提供数据持久化**，因此 Kafka Stream 提供滚动部署和滚动升级以 及重新计算的能力。 

​	第六，由于 Kafka Consumer Rebalance 机制， **Kafka Stream 可以在线动态调整并行度**。    

#### 7.3 Kafka Stream 数据清洗案例 

1. 需求： 实时处理单词带有”>>>”前缀的内容。例如输入”atguigu>>>ximenqing”，最终处理成 “ximenqing” 

   <img src='../../../images/Message Queue/Kafka/kafka-streams-data-clean.png'/>

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



