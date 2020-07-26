### 五、Kafka高效读写数据的原因

#### 5.1 顺序写磁盘

Kafka 的 producer 生产数据，要写入到 log 文件中，写的过程是一直追加到文件末端，为顺序写。官网有数据表明，同样的磁盘，顺序写能到到 600M/s，而随机写只有 100k/s。这与磁盘的机械机构有关，顺序写之所以快，是因为其省去了大量磁头寻址的时间 。

#### 5.2 零拷贝技术



![img](/Users/starfish/workspace/tech/docs/_images/message-queue/Kafka/zero-copy.png)

