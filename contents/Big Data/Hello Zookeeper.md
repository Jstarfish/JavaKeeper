# 1. What is ZooKeeper?

Zookeeper是一个开源的分布式的，为分布式应用提供协调服务的Apache项目 。

ZooKeeper是一个集中的服务，可用于维护配置信息、统一命名服务、提供分布式同步和提供组服务。（服务器节点动态上下线、软负载均衡等）

**ZooKeeper 的设计目标是将那些复杂且容易出错的分布式一致性服务封装起来，构成一个高效可靠的原语集，并以一系列简单易用的接口提供给用户使用** 

Zookeeper服务本身是分布式的，并且高度可靠 

ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. All of these kinds of services are used in some form or another by distributed applications. Each time they are implemented there is a lot of work that goes into fixing the bugs and race conditions that are inevitable. Because of the difficulty of implementing these kinds of services, applications initially usually skimp on them, which make them brittle in the presence of change and difficult to manage. Even when done correctly, different implementations of these services lead to management complexity when the applications are deployed.

ZooKeeper aims at distilling the essence of these different services into a very simple interface to a centralized coordination service. The service itself is distributed and highly reliable. Consensus, group management, and presence protocols will be implemented by the service so that the applications do not need to implement them on their own. Application specific uses of these will consist of a mixture of specific components of Zoo Keeper and application specific conventions. [ZooKeeper Recipes](http://hadoop.apache.org/zookeeper/docs/current/recipes.html) shows how this simple service can be used to build much more powerful abstractions. 



## 1.1 概述

ZooKeeper allows distributed processes to coordinate with each other through a shared hierarchical name space of data registers (we call these registers znodes), much like a file system. Unlike normal file systems ZooKeeper provides its clients with high throughput, low latency, highly available, strictly ordered access to the znodes. The performance aspects of ZooKeeper allow it to be used in large distributed systems. The reliability aspects prevent it from becoming the single point of failure in big systems. Its strict ordering allows sophisticated synchronization primitives to be implemented at the client.

The name space provided by ZooKeeper is much like that of a standard file system. A name is a sequence of path elements separated by a slash ("/"). Every znode in ZooKeeper's name space is identified by a path. And every znode has a parent whose path is a prefix of the znode with one less element; the exception to this rule is root ("/") which has no parent. Also, exactly like standard file systems, a znode cannot be deleted if it has any children.

The main differences between ZooKeeper and standard file systems are that every znode can have data associated with it (every file can also be a directory and vice-versa) and znodes are limited to the amount of data that they can have. ZooKeeper was designed to store coordination data: status information, configuration, location information, etc. This kind of meta-information is usually measured in kilobytes, if not bytes. ZooKeeper has a built-in sanity check of 1M, to prevent it from being used as a large data store, but in general it is used to store much smaller pieces of data.

![img](https://cwiki.apache.org/confluence/download/attachments/24193436/service.png?version=1&modificationDate=1295027310000&api=v2)

The service itself is replicated over a set of machines that comprise the service. These machines maintain an in-memory image of the data tree along with a transaction logs and snapshots in a persistent store. Because the data is kept in-memory, ZooKeeper is able to get very high throughput and low latency numbers. The downside to an in-memory database is that the size of the database that ZooKeeper can manage is limited by memory. This limitation is further reason to keep the amount of data stored in znodes small.

The servers that make up the ZooKeeper service must all know about each other. As long as a majority of the servers are available, the ZooKeeper service will be available. Clients must also know the list of servers. The clients create a handle to the ZooKeeper service using this list of servers.

Clients only connect to a single ZooKeeper server. The client maintains a TCP connection through which it sends requests, gets responses, gets watch events, and sends heartbeats. If the TCP connection to the server breaks, the client will connect to a different server. When a client first connects to the ZooKeeper service, the first ZooKeeper server will setup a session for the client. If the client needs to connect to another server, this session will get reestablished with the new server.

Read requests sent by a ZooKeeper client are processed locally at the ZooKeeper server to which the client is connected. If the read request registers a watch on a znode, that watch is also tracked locally at the ZooKeeper server. Write requests are forwarded to other ZooKeeper servers and go through consensus before a response is generated. Sync requests are also forwarded to another server, but do not actually go through consensus. Thus, the throughput of read requests scales with the number of servers and the throughput of write requests decreases with the number of servers.

Order is very important to ZooKeeper; almost bordering on obsessive–compulsive disorder. All updates are totally ordered. ZooKeeper actually stamps each update with a number that reflects this order. We call this number the zxid (ZooKeeper Transaction Id). Each update will have a unique zxid. Reads (and watches) are ordered with respect to updates. Read responses will be stamped with the last zxid processed by the server that services the read.

Zookeeper是一个开源的分布式的，为分布式应用提供协调服务的Apache项目。 

Zookeeper从设计模式角度来理解是一个基于观察者模式设计的服务管理框架，负责存储和管理数据，然后接收管理者的注册，一旦数据的状态发生变化，Zookeeper就通知注册者。



## 1.2 特点

1. Zookeeper：一个领导者（leader），多个跟随者（follower）组成的集群。
2. Leader负责进行投票的发起和决议，更新系统状态
3. Follower用于接收客户请求并向客户端返回结果，在选举Leader过程中参与投票
4. 集群中只要有半数以上节点存活，Zookeeper集群就能正常服务。
5. 全局数据一致：每个server保存一份相同的数据副本，client无论连接到哪个server，数据都是一致的。
6. **顺序一致性：** 从同一客户端发起的事务请求，最终将会严格地按照顺序被应用到 ZooKeeper 中去。
7. **原子性：** 所有事务请求的处理结果在整个集群中所有机器上的应用情况是一致的，也就是说，要么整个集群中所有的机器都成功应用了某一个事务，要么都没有应用。
8. 实时性，在一定时间范围内，client能读到最新数据。
9. **可靠性：** 一旦一次更改请求被应用，更改的结果就会被持久化，直到被下一次更改覆盖。



## 1.3 数据结构

Zookeeper数据模型的结构与Unix文件系统的结构相似，整体上可以看做是一棵树，每个节点称作一个ZNode.。每个ZNode默认能存储1MB的数据，每个ZNode都可以通过其路径唯一标识。

<img src='../../images/Big Data/Hello Zookeeper/zk-znode.png'>



## 1.4 应用场景

**ZooKeeper 是一个典型的分布式数据一致性解决方案，分布式应用程序可以基于 ZooKeeper 实现诸如数据发布/订阅、负载均衡、命名服务、分布式协调/通知、集群管理、Master 选举、分布式锁和分布式队列等功能** 

#### 统一命名服务

在分布式环境下，经常需要对应用/服务进行统一命名，便于识别不同服务。

（1）类似于域名与ip之间对应关系，ip不容易记住，而域名容易记住。

（2）通过名称来获取资源或服务的地址，提供者等信息。

#### 统一配管理

1. 分布式环境下，配置文件管理和同步是一个常见问题。

- 一个集群中，所有节点的配置信息是一致的，比如 Hadoop 集群。
- 对配置文件修改后，希望能够快速同步到各个节点上。

2. 配置管理可交由ZooKeeper实现。

- 可将配置信息写入ZooKeeper上的一个Znode。
- 各个节点监听这个Znode。
- 一旦Znode中的数据被修改，ZooKeeper将通知各个节点。

<img src='../../images/Big Data/Hello Zookeeper/zk-unify-conf.png'>

#### 统一集群管理

1. 分布式环境中，实时掌握每个节点的状态是必要的。

- 可根据节点实时状态做出一些调整。

2. 可交由ZooKeeper实现。

- 可将节点信息写入ZooKeeper上的一个Znode。
- 监听这个Znode可获取它的实时状态变化。

#### 软负载均衡

<img src='../../images/Big Data/Hello Zookeeper/zk-loadbalancing.png'>

#### 服务器动态上下线



# 2. Hello Zookeeper

## 2.1 本地模式安装部署

#### 1．安装前准备

1. 安装Jdk
2. 拷贝Zookeeper安装包到Linux系统下
3. 解压到指定目录

```shell
tar -zxvf zookeeper-3.4.10.tar.gz -C /opt/module/
```

#### 2．配置修改

1. 将/opt/module/zookeeper-3.4.10/conf这个路径下的zoo_sample.cfg修改为zoo.cfg；

```
mv zoo_sample.cfg zoo.cfg
```

3. 打开zoo.cfg文件，修改dataDir路径：

```
dataDir=/opt/module/zookeeper-3.4.10/zkData
```

4. 在/opt/module/zookeeper-3.4.10/这个目录上创建zkData文件夹

```
 mkdir zkData
```

#### 3．操作Zookeeper

1. 启动Zookeeper

```
bin/zkServer.sh start
```

2. 查看进程是否启动

```
jps
4020 Jps
4001 QuorumPeerMain
```

3. 查看状态：

```
bin/zkServer.sh status
```

4. 启动客户端：

```
bin/zkCli.sh
```

5. 退出客户端：

```
quit
```

6. 停止Zookeeper

```
bin/zkServer.sh stop
```



## 2.2 配置参数解读

Zookeeper中的配置文件zoo.cfg中参数含义解读如下：

- tickTime =2000：通信心跳数，Zookeeper服务器与客户端心跳时间，单位毫秒

  Zookeeper使用的基本时间，服务器之间或客户端与服务器之间维持心跳的时间间隔，也就是每个tickTime时间就会发送一个心跳，时间单位为毫秒。

  它用于心跳机制，并且设置最小的session超时时间为两倍心跳时间。(session的最小超时时间是2*tickTime)

- initLimit =10：LF初始通信时限

  集群中的Follower跟随者服务器与Leader领导者服务器之间初始连接时能容忍的最多心跳数（tickTime的数量），用它来限定集群中的Zookeeper服务器连接到Leader的时限。

- syncLimit =5：LF同步通信时限

  集群中Leader与Follower之间的最大响应时间单位，假如响应超过syncLimit * tickTime，Leader认为Follwer死掉，从服务器列表中删除Follwer。

- dataDir：数据文件目录+数据持久化路径

  主要用于保存Zookeeper中的数据。

- clientPort =2181：客户端连接端口

  监听客户端连接的端口。



### 2.3 概念

- **ZooKeeper 本身就是一个分布式程序（只要半数以上节点存活，ZooKeeper 就能正常服务）。**
- **为了保证高可用，最好是以集群形态来部署 ZooKeeper，这样只要集群中大部分机器是可用的（能够容忍一定的机器故障），那么 ZooKeeper 本身仍然是可用的。**
- **ZooKeeper 将数据保存在内存中，这也就保证了 高吞吐量和低延迟**（但是内存限制了能够存储的容量不太大，此限制也是保持znode中存储的数据量较小的进一步原因）。
- **ZooKeeper 是高性能的。 在“读”多于“写”的应用程序中尤其地高性能，因为“写”会导致所有的服务器间同步状态。**（“读”多于“写”是协调服务的典型场景。）
- **ZooKeeper有临时节点的概念。 当创建临时节点的客户端会话一直保持活动，瞬时节点就一直存在。而当会话终结时，瞬时节点被删除。持久节点是指一旦这个ZNode被创建了，除非主动进行ZNode的移除操作，否则这个ZNode将一直保存在Zookeeper上。**
- ZooKeeper 底层其实只提供了两个功能：①管理（存储、读取）用户程序提交的数据；②为用户程序提交数据节点监听服务。

#### 2.3.1 会话（Session）

Session 指的是 ZooKeeper 服务器与客户端会话。**在 ZooKeeper 中，一个客户端连接是指客户端和服务器之间的一个 TCP 长连接**。客户端启动的时候，首先会与服务器建立一个 TCP 连接，从第一次连接建立开始，客户端会话的生命周期也开始了。**通过这个连接，客户端能够通过心跳检测与服务器保持有效的会话，也能够向Zookeeper服务器发送请求并接受响应，同时还能够通过该连接接收来自服务器的Watch事件通知。** Session的`sessionTimeout`值用来设置一个客户端会话的超时时间。当由于服务器压力太大、网络故障或是客户端主动断开连接等各种原因导致客户端连接断开时，**只要在sessionTimeout规定的时间内能够重新连接上集群中任意一台服务器，那么之前创建的会话仍然有效。**

**在为客户端创建会话之前，服务端首先会为每个客户端都分配一个sessionID。由于 sessionID 是 Zookeeper 会话的一个重要标识，许多与会话相关的运行机制都是基于这个 sessionID 的，因此，无论是哪台服务器为客户端分配的 sessionID，都务必保证全局唯一。**

#### 2.3.2 Znode

**在谈到分布式的时候，我们通常说的“节点"是指组成集群的每一台机器。然而，在Zookeeper中，“节点"分为两类，第一类同样是指构成集群的机器，我们称之为机器节点；第二类则是指数据模型中的数据单元，我们称之为数据节点一一ZNode。**

Zookeeper将所有数据存储在内存中，数据模型是一棵树（Znode Tree)，由斜杠（/）的进行分割的路径，就是一个Znode，例如/foo/path1。每个上都会保存自己的数据内容，同时还会保存一系列属性信息。

**在Zookeeper中，node可以分为持久节点和临时节点两类。所谓持久节点是指一旦这个ZNode被创建了，除非主动进行ZNode的移除操作，否则这个ZNode将一直保存在Zookeeper上。而临时节点就不一样了，它的生命周期和客户端会话绑定，一旦客户端会话失效，那么这个客户端创建的所有临时节点都会被移除。**另外，ZooKeeper还允许用户为每个节点添加一个特殊的属性：**SEQUENTIAL**.一旦节点被标记上这个属性，那么在这个节点被创建的时候，Zookeeper会自动在其节点名后面追加上一个整型数字，这个整型数字是一个由父节点维护的自增数字。

#### 2.3.3 版本

在前面我们已经提到，Zookeeper 的每个 ZNode 上都会存储数据，对应于每个ZNode，Zookeeper 都会为其维护一个叫作 **Stat** 的数据结构，Stat中记录了这个 ZNode 的三个数据版本，分别是version（当前ZNode的版本）、cversion（当前ZNode子节点的版本）和 cversion（当前ZNode的ACL版本）。

#### 2.3.4 Watcher

**Watcher（事件监听器），是Zookeeper中的一个很重要的特性。Zookeeper允许用户在指定节点上注册一些Watcher，并且在一些特定事件触发的时候，ZooKeeper服务端会将事件通知到感兴趣的客户端上去，该机制是Zookeeper实现分布式协调服务的重要特性。**

#### 2.3.5 ACL

Zookeeper采用ACL（AccessControlLists）策略来进行权限控制，类似于 UNIX 文件系统的权限控制。Zookeeper 定义了如下5种权限。

- CREATE: 创建子节点的权限
- READ: 获取节点数据和子节点列表的权限
- WRITE: 更新节点数据的权限
- DELETE: 删除子节点的权限
- ADMIN: 设置节点ACL的权限

其中尤其需要注意的是，CREATE和DELETE这两种权限都是针对子节点的权限控制。



# 3. Zookeeper内部原理

## 3.1 `选举机制`

1. 半数机制：集群中半数以上机器存活，集群可用。所以Zookeeper适合安装奇数台服务器。
2. Zookeeper虽然在配置文件中并没有指定Master和Slave。但是，Zookeeper工作时，是有一个节点为Leader，其他则为Follower，Leader是通过内部的选举机制临时产生的。
3. 以一个简单的例子来说明整个选举的过程。

假设有五台服务器组成的Zookeeper集群，它们的id从1-5，同时它们都是最新启动的，也就是没有历史数据，在存放数据量这一点上，都是一样的。假设这些服务器依序启动，来看看会发生什么，如下图所示。

<img src='../../images/Big Data/Hello Zookeeper/zk-elect.jpg'>

1. 服务器1启动，此时只有它一台服务器启动了，它发出去的报文没有任何响应，所以它的选举状态一直是LOOKING状态。
2. 服务器2启动，它与最开始启动的服务器1进行通信，互相交换自己的选举结果，由于两者都没有历史数据，所以id值较大的服务器2胜出，但是由于没有达到超过半数以上的服务器都同意选举它(这个例子中的半数以上是3)，所以服务器1、2还是继续保持LOOKING状态。
3. 服务器3启动，根据前面的理论分析，服务器3成为服务器1、2、3中的老大，而与上面不同的是，此时有三台服务器选举了它，所以它成为了这次选举的Leader。
4. 服务器4启动，根据前面的分析，理论上服务器4应该是服务器1、2、3、4中最大的，但是由于前面已经有半数以上的服务器选举了服务器3，所以它只能接收当小弟的命了。
5. 服务器5启动，同4一样当小弟。

## 3.2 节点类型

   ![](C:\Users\jiahaixin\Desktop\BFFAF6E0-625A-49a4-BF9C-9E529D860BF1.jpg)

## 3.3 Stat结构体

1. czxid-创建节点的事务zxid。 每次修改ZooKeeper状态都会收到一个zxid形式的时间戳，也就是ZooKeeper事务ID。事务ID是ZooKeeper中所有修改总的次序。每个修改都有唯一的zxid，如果zxid1小于zxid2，那么zxid1在zxid2之前发生。
2. ctime - znode被创建的毫秒数(从1970年开始)
3. mzxid - znode最后更新的事务zxid
4. mtime - znode最后修改的毫秒数(从1970年开始)
5. pZxid-znode最后更新的子节点zxid
6. cversion - znode子节点变化号，znode子节点修改次数
7. dataversion - znode数据变化号
8. aclVersion - znode访问控制列表的变化号
9. ephemeralOwner- 如果是临时节点，这个是znode拥有者的session id。如果不是临时节点则是0。
10. dataLength- znode的数据长度
11. numChildren - znode子节点数量

## 3.4 监听器原理

- 监听原理详解：

1. 首先要有一个main()线程
2. 在main线程中创建Zookeeper客户端，这时就会创建两个线程，一个负责网络连接通信（connet），一个负责监听（listener）。
3. 通过connect线程将注册的监听事件发送给Zookeeper。
4. 在Zookeeper的注册监听器列表中将注册的监听事件添加到列表中。
5. Zookeeper监听到有数据或路径变化，就会将这个消息发送给listener线程。
6. listener线程内部调用了process（）方法。

- 常见的监听

1. 监听节点数据的变化： get path [watch]
2.  监听子节点增减的变化： ls path [watch]



<img src='../../images/Big Data/Hello Zookeeper/\zk-listener.png'>



## 3.5 写数据流程

   <img src='../../images/Big Data/Hello Zookeeper/zk-write-data.png'>





# 4. 实战

## 4.1 客户端命令行操作

| 命令基本语法       | 功能描述                                               |
| ------------------ | ------------------------------------------------------ |
| help               | 显示所有操作命令                                       |
| ls path [watch]    | 使用 ls 命令来查看当前znode中所包含的内容              |
| ls2 path   [watch] | 查看当前节点数据并能看到更新次数等数据                 |
| create             | 普通创建   -s  含有序列   -e  临时（重启或者超时消失） |
| get path   [watch] | 获得节点的值                                           |
| set                | 设置节点的具体值                                       |
| stat               | 查看节点状态                                           |
| delete             | 删除节点                                               |
| rmr                | 递归删除节点                                           |



## 4.3 API应用

### 4.3.1 Eclipse环境搭建

1．创建一个Maven工程

2．添加pom文件

3．拷贝log4j.properties文件到项目根目录

需要在项目的src/main/resources目录下，新建一个文件，命名为“log4j.properties”，在文件中填入。

log4j.rootLogger=INFO, stdout  

log4j.appender.stdout=org.apache.log4j.ConsoleAppender  

log4j.appender.stdout.layout=org.apache.log4j.PatternLayout  

log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] - %m%n  

log4j.appender.logfile=org.apache.log4j.FileAppender  

log4j.appender.logfile.File=target/spring.log  

log4j.appender.logfile.layout=org.apache.log4j.PatternLayout  

log4j.appender.logfile.layout.ConversionPattern=%d %p [%c] - %m%n  

### 4.3.2 创建ZooKeeper客户端

### 4.3.3 创建子节点

### 4.3.4 获取子节点并监听节点变化

### 4.3.5 判断Znode是否存在

## 4.4 监听服务器节点动态上下线案例

1．需求

某分布式系统中，主节点可以有多台，可以动态上下线，任意一台客户端都能实时感知到主节点服务器的上下线。



# 企业面试真题

## 5.1 请简述ZooKeeper的选举机制

详见3.1。

## 5.2 ZooKeeper的监听原理是什么？

详见3.4。

## 5.3 ZooKeeper的部署方式有哪几种？集群中的角色有哪些？集群最少需要几台机器？

（1）部署方式单机模式、集群模式

（2）角色：Leader和Follower

（3）集群最少需要机器数：3

## 5.4 ZooKeeper的常用命令

ls create get delete set…