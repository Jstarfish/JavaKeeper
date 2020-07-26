### 3.6 Zookeeper在Kafka中的作用    

- **存储结构**

  ![img](file:///Users/starfish/workspace/tech/docs/_images/message-queue/Kafka/zookeeper-store.png?lastModify=1595738386)

  

  注意： **producer 不在 zk 中注册， 消费者在 zk 中注册。**

  Kafka集群中有一个broker会被选举为Controller，**负责管理集群broker的上线下，所有topic的分区副本分配和leader选举等工作**。

  Controller的管理工作都是依赖于Zookeeper的。

  下图为 partition 的 leader 选举过程：

  ![img](file:///Users/starfish/workspace/tech/docs/_images/message-queue/Kafka/controller-leader.png?lastModify=1595738386)

  