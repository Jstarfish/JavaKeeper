> zookeeper虽然在项目里有用过，奈何我要当大牛，所以要深入了解下，要把Zookeeper也放到知识库里，看了好多博客，感觉大部分都是基于《从Paxos到ZooKeeper 分布式一致性原理与实践》写的，所以自己读了一遍，加上看的其他文章和项目中的使用，做个整理。加油，奥利给！

![](https://www.w3cschool.cn/attachments/image/20170110/1484044507543563.jpg)



## 前言

面试常常被要求「熟悉分布式技术」，当年搞 “XXX管理系统” 的时候，我都不知道分布式系统是个啥。**分布式系统是一个硬件或软件组件分布在不同的网络计算机中上，彼此之间仅仅通过消息传递进行通信和协调的系统**。

计算机系统从集中式到分布式的变革伴随着包括**分布式网络**、**分布式事务**、**分布式数据一致性**等在内的一系列问题和挑战，同时也催生了一大批诸如**`ACID`**、**`CAP`**和**`BASE`**等经典理论的快速发展。

为了解决分布式一致性问题，涌现出了一大批经典的一致性协议和算法，最为著名的就是二阶段提交协议（2PC），三阶段提交协议（3PC）和`Paxos`算法。`Zookeeper`的一致性是通过基于 `Paxos` 算法的 `ZAB` 协议完成的。之前已经介绍过这些《》



## 1. 概述

ZooKeeper 是 Apache 软件基金会的一个软件项目，它为大型「**分布式计算**」提供开源的分布式配置服务、同步服务和命名注册。

Zookeeper 最早起源于雅虎研究院的一个研究小组。在当时，研究人员发现，在雅虎内部很多大型系统基本都需要依赖一个类似的系统来进行分布式协调，但是这些系统往往都存在分布式单点问题。所以，雅虎的开发人员就试图开发一个通用的无单点问题的**分布式协调框架**，以便让开发人员将精力集中在处理业务逻辑上，Zookeeper 就这样诞生了。后来捐赠给了 `Apache` ，现已成为 `Apache` 顶级项目。



### 1.1 特性

![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gds0fy5hsyj30go055dga.jpg)

1. Zookeeper：一个领导者（leader），多个跟随者（follower）组成的集群。

2. Leader 负责进行投票的发起和决议，更新系统状态。

3. Follower 用于接收客户请求并向客户端返回结果，在选举 Leader 过程中参与投票。

4. 集群中只要有半数以上节点存活，Zookeeper 集群就能正常服务。

5. **全局数据一致**（单一视图）：每个 Server 保存一份相同的数据副本，Client 无论连接到哪个 Server，数据都是一致的。

6. **顺序一致性：** 从同一客户端发起的事务请求，最终将会严格地按照顺序被应用到 ZooKeeper 中去。

7. **原子性：** 所有事务请求的处理结果在整个集群中所有机器上的应用情况是一致的，也就是说，要么整个集群中所有的机器都成功应用了某一个事务，要么都没有应用。

8. **实时性**，在一定时间范围内，client 能读到最新数据。

9. **可靠性：** 一旦一次更改请求被应用，更改的结果就会被持久化，直到被下一次更改覆盖。

   

### 1.2 设计目标

- **简单的数据结构** ：Zookeeper 使得分布式程序能够通过一个共享的树形结构的名字空间来进行相互协调，即Zookeeper 服务器内存中的数据模型由一系列被称为`ZNode`的数据节点组成，**Zookeeper 将全量的数据存储在内存中，以此来提高服务器吞吐、减少延迟的目的**。
- **可以构建集群** ： Zookeeper 集群通常由一组机器构成，组成 Zookeeper 集群的每台机器都会在内存中维护当前服务器状态，并且每台机器之间都相互通信。
- **顺序访问** ： 对于来自客户端的每个更新请求，Zookeeper 都会**分配一个全局唯一的递增编号**，这个编号反映了所有事务操作的先后顺序。
- **高性能** ：Zookeeper 和 Redis 一样全量数据存储在内存中，100%读请求压测 QPS 12-13W



### 1.3 数据结构

Zookeeper 数据模型的结构与 Unix 文件系统的结构相似，整体上可以看做是一棵树，每个节点称作一个 **「ZNode」**。每个 ZNode 默认能存储 **1MB** 的数据，每个 ZNode 都可以通过其路径唯一标识。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ged03jwznbj31m20u0qaq.jpg)



### 1.4 角色

Zookeeper Server三种角色：Leader，Follower，Observer

- Leader： 为客户端提供读和写的服务，负责投票的发起和决议，更新系统状态 
- Follower： 为客户端提供读服务，如果是写服务则转发给 Leader。在选举过程中参与投票 
- Observer： 为客户端提供读服务器，如果是写服务则转发给 Leader。不参与选举过程中的投票，也不参与“过半写成功”策略。在不影响写性能的情况下提升集群的读性能。此角色是在 zookeeper3.3 系列新增的角色。



### 1.5 server 状态

- LOOKING：寻找Leader

- LEADING：Leader状态，对应的节点为 Leader

- FOLLOWING：Follower状态，对应的节点为 Follower

- OBSERVING：Observer状态，对应节点为 Observer，该节点不参与 Leader 选举



### 1.6 应用场景

**ZooKeeper 是一个典型的分布式数据一致性解决方案，分布式应用程序可以基于 ZooKeeper 实现诸如数据发布/订阅、负载均衡、命名服务、分布式协调/通知、集群管理、Master 选举、分布式锁和分布式队列等功能** 

#### 统一命名服务

在分布式系统中，通过使用命名服务，客户端应用能够根据指定名字来获取资源或服务的地址，提供者等信息。被命名的实体通常可以是集群中的机器，提供的服务地址，进程对象等等——这些我们都可以统称他们为名字（Name）。其中较为常见的就是一些分布式服务框架（如RPC、RMI）中的服务地址列表。通过调用 Zookeeper 提供的创建节点的 API，能够很容易创建一个全局唯一的 path，这个 path 就可以作为一个名称。 

阿里巴巴开源的分布式服务框架 Dubbo 就使用 ZooKeeper 来作为其命名服务，维护全局的服务地址列表。

#### 数据发布与订阅（配置中心）

发布与订阅模型，即所谓的配置中心，顾名思义就是发布者将数据发布到ZK节点上，供订阅者动态获取数据，实现配置信息的集中式管理和动态更新。例如全局的配置信息，服务式服务框架的服务地址列表等就非常适合使用。

1. 分布式环境下，配置文件管理和同步是一个常见问题

   - 一个集群中，所有节点的配置信息是一致的，比如 Hadoop 集群、集群中的数据库配置信息等全局配置

   - 对配置文件修改后，希望能够快速同步到各个节点上。

2. 配置管理可交由 ZooKeeper 实现

   - 可将配置信息写入 ZooKeeper 上的一个 Znode
   - 各个节点监听这个 Znode
   - 一旦 Znode 中的数据被修改，ZooKeeper 将通知各个节点

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ged0h6hqulj31pv0t012t.jpg)

#### 统一集群管理

所谓集群管理无在乎两点：是否有机器退出和加入、选举 Master。

##### 管理节点

1. 分布式环境中，实时掌握每个节点的状态是必要的，比如我们要知道集群中各机器状态、收集各个机器的运行时状态数据、服务器动态上下线等。

2. 交由 ZooKeeper 实现的方式
   - 可将节点信息写入 ZooKeeper 上的一个 Znode
   - 监听这个 Znode 可获取它的实时状态变化

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gf8h91o6t6j31c70u014z.jpg)

##### Master选举

利用 Zookeeper 的强一致性，能够很好的保证在分布式高并发情况下节点的创建一定是全局唯一的，即 Zookeeper 将会保证客户端无法重复创建一个已经存在的数据节点。Zookeeper通过这种节点唯一的特性，可以创建一个 Master 节点，其他客户端 Watcher 监控当前 Master 是否存活，一旦 Master 挂了，其他机器再创建这样的一个 Master 节点，用来重新选举。



#### 软负载均衡

分布式系统中，负载均衡是一种很普遍的技术，可以是硬件的负载均衡，如 F5，也可以是软件的负载，我们熟知的 Nginx，或者这里介绍的 Zookeeper

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ged05xf1krj31gw0u0tm4.jpg)

#### 分布式协调/通知

Zookeeper 中特有的 「**Watcher**」 注册与异步通知机制，能够很好的实现分布式环境下不同机器，甚至不同系统之间的协调和通知，从而实现对数据变更的实时处理。

使用方法通常是不同系统都对 ZK 上同一个 znode 进行注册，监听 znode 的变化（包括 znode 本身内容及子节点的），其中一个系统 update 了 znode，那么另一个系统能够收到通知，并作出相应处理。

- 心跳检测中可以让检测系统和被检测系统之间并不直接关联起来，而是通过 ZK 上某个节点关联，减少系统耦合;
- 系统调度模式中，假设某系统有控制台和推送系统两部分组成，控制台的职责是控制推送系统进行相应的推送工作。管理人员在控制台作的一些操作，实际上是修改了ZK上某些节点的状态，而ZK就把这些变化通知给他们注册Watcher的客户端，即推送系统，于是，作出相应的推送任务。



#### 分布式锁

分布式锁，这个主要得益于 ZooKeeper 为我们保证了数据的强一致性。

锁服务可以分为两类，一个是**保持独占**，另一个是**控制时序**。 

所谓保持独占，就是所有试图来获取这个锁的客户端，最终只有一个可以成功获得这把锁。通常的做法是把 zk 上的一个 znode 看作是一把锁，通过`create znode`的方式来实现。所有客户端都去创建 `/distribute_lock` 节点，最终成功创建的那个客户端也即拥有了这把锁。 

控制时序，就是所有试图来获取这个锁的客户端，最终都是会被安排执行，只是有个全局时序了。做法和上面基本类似，只是这里 `/distribute_lock` 已半预先存在，客户端在它下面创建临时有序节点（这个可以通过节点的属性控制：`CreateMode.EPHEMERAL_SEQUENTIAL`来指定）。Zk的父节点（`/distribute_lock`）维持一份sequence，保证子节点创建的时序性，从而也形成了每个客户端的全局时序。

个人感觉还是用 Redis 实现分布式锁更加方便。



> PS：其实，ZK并非天生就是为这些应用场景设计的，都是后来众多开发者根据其框架的特性，利用其提供的一系列API接口（或者称为原语集），摸索出来的典型使用方法。



## 2. Hello Zookeeper

Zookeeper 有两种运行模式：集群模式和单机模式。自己学习研究，就单机练习，当然也可以用伪集群。

### 2.1 本地模式安装部署

#### 2.1.1 安装前准备

1. 安装Jdk
2. 拷贝或下载 Zookeeper 安装包到 Linux 系统下(这里有个小问题，如果你下载zookeeper版本是3.5+ 的话，要下载 bin.tar.gz，愚笨的我最先没看到官网说明，一顿操作各种报错找不到 Main 方法)
3. 解压到指定目录

```shell
tar -zxvf apache-zookeeper-3.5.6-bin.tar.gz
```

#### 2.1.2 配置修改

1. 将 zookeeper-3.5.6/conf 这个路径下的 `zoo_sample.cfg` 修改为 `zoo.cfg` ；

```shell
mv zoo_sample.cfg zoo.cfg
```

3. 打开 zoo.cfg 文件，修改 dataDir 路径：

```
dataDir=XXX/zookeeper-3.5.6/zkData
```

4. 在zookeeper-3.5.6/ 这个目录上创建 zkData 文件夹

```shell
mkdir zkData
```

#### 2.1.3 操作 Zookeeper

1. 启动 Zookeeper:  `bin/zkServer.sh start`

```shell
/usr/local/bin/java
ZooKeeper JMX enabled by default
Using config: /home/sync360/test/apache-zookeeper-3.5.7-bin/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
```

2. 查看进程是否启动: `jps`

```shell
4020 Jps
4001 QuorumPeerMain
```

3. 查看状态：`bin/zkServer.sh status`

```shell
/usr/local/bin/java
ZooKeeper JMX enabled by default
Using config: /home/apache-zookeeper-3.5.7-bin/bin/../conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: standalone
```

4. 启动客户端：`bin/zkCli.sh`

```shell
Connecting to localhost:2181
2020-03-25 15:41:19,112 [myid:] - INFO  [main:Environment@109] - Client environment:zookeeper.version=3.5.7-f0fdd52973d373ffd9c86b81d99842dc2c7f660e, built on 02/10/2020 11:30 GMT

...

2020-03-25 15:41:19,183 [myid:] - INFO  [main:ClientCnxn@1653] - zookeeper.request.timeout value is 0. feature enabled=
Welcome to ZooKeeper!

...

WATCHER::

WatchedEvent state:SyncConnected type:None path:null
```

5. 退出客户端：`quit`

6. 停止 Zookeeper:  `bin/zkServer.sh stop`



### 2.2 配置参数解读

在 Zookeeper 的设计中，如果是集群模式，那所有机器上的 zoo.cfg 文件内容应该都是一致的。

Zookeeper 中的配置文件 zoo.cfg 中参数含义解读如下：

- tickTime =2000：通信心跳数，Zookeeper 服务器与客户端心跳时间，单位毫秒

  Zookeeper 使用的基本时间，服务器之间或客户端与服务器之间维持心跳的时间间隔，也就是每个 tickTime时间就会发送一个心跳，时间单位为毫秒。

  它用于心跳机制，并且设置最小的 session 超时时间为两倍心跳时间。(session的最小超时时间是2*tickTime)

- initLimit =10：主从初始通信时限，集群中的 Follower 跟随者服务器与 Leader 领导者服务器之间初始连接时能容忍的最多心跳数（tickTime的数量），用它来限定集群中的 Zookeeper 服务器连接到 Leader 的时限。

- syncLimit =5：主从同步通信时限，集群中 Leader 与 Follower 之间的最大响应时间单位，假如响应超过`syncLimit * tickTime`，Leader 认为Follwer 死掉，从服务器列表中删除 Follwer。

- dataDir：数据文件目录+数据持久化路径。

- clientPort =2181：客户端连接端口。




### 2.3 概念

- ZooKeeper 本身就是一个分布式程序（只要半数以上节点存活，ZooKeeper 就能正常服务）。
- 为了保证高可用，最好是以集群形态来部署 ZooKeeper，这样只要集群中大部分机器是可用的（能够容忍一定的机器故障），那么 ZooKeeper 本身仍然是可用的。
- **ZooKeeper 将数据保存在内存中，这也就保证了高吞吐量和低延迟**（但是内存限制了能够存储的容量不太大，此限制也是保持 znode 中存储的数据量较小的进一步原因）。
- **ZooKeeper 是高性能的。 在“读”多于“写”的应用程序中尤其的高性能，因为“写”会导致所有的服务器间同步状态。**（“读”多于“写”是协调服务的典型场景。）
- ZooKeeper 底层其实只提供了两个功能：
  - 管理（存储、读取）用户程序提交的数据
  - 为用户程序提交数据节点监听服务

#### 2.3.1 会话（Session）

Session 指的是 ZooKeeper 服务器与客户端会话。

**在 ZooKeeper 中，一个客户端连接是指客户端和服务器之间的一个 TCP 长连接**。客户端启动的时候，首先会与服务器建立一个 TCP 连接，从第一次连接建立开始，客户端会话的生命周期也开始了。**通过这个连接，客户端能够通过心跳检测与服务器保持有效的会话，也能够向 Zookeeper 服务器发送请求并接受响应，同时还能够通过该连接接收来自服务器的 Watch 事件通知。** Session 的 `sessionTimeout` 值用来设置一个客户端会话的超时时间。当由于服务器压力太大、网络故障或是客户端主动断开连接等各种原因导致客户端连接断开时，**只要在sessionTimeout 规定的时间内能够重新连接上集群中任意一台服务器，那么之前创建的会话仍然有效。**

在为客户端创建会话之前，服务端首先会为每个客户端都分配一个 sessionID。由于 sessionID 是 Zookeeper 会话的一个重要标识，许多与会话相关的运行机制都是基于这个 sessionID 的，因此，无论是哪台服务器为客户端分配的 sessionID，都务必保证全局唯一。

#### 2.3.2 数据节点（Znode）

在谈到分布式的时候，我们通常说的“节点"是指组成集群的每一台机器。然而，在 Zookeeper 中，“节点"分为两类，第一类同样是指构成集群的机器，我们称之为「**机器节点**」；第二类则是指数据模型中的数据单元，我们称之为「**数据节点**」一一ZNode。

Zookeeper 将所有数据存储在内存中，数据模型是一棵树（Znode Tree)，由斜杠（/）进行分割的路径，就是一个 Znode，例如/star/path1。每个 Znode 上都会保存自己的数据内容，同时还会保存一系列属性信息。

**在 Zookeeper 中，Znode 可以分为持久节点和临时节点两类**。所谓持久节点是指一旦这个 ZNode 被创建了，除非主动进行 ZNode 的移除操作，否则这个 ZNode 将一直保存在 Zookeeper 上。而临时节点就不一样了，它的生命周期和客户端会话绑定，一旦客户端会话失效，那么这个客户端创建的所有临时节点都会被移除。另外，ZooKeeper 还允许用户为每个节点添加一个特殊的属性：**SEQUENTIAL。**一旦节点被标记上这个属性，那么在这个节点被创建的时候，Zookeeper 会自动在其节点名后面追加上一个整型数字，这个整型数字是一个由父节点维护的自增数字。

#### 2.3.3 版本

Zookeeper 的每个 ZNode 上都会存储数据，对应于每个 ZNode，Zookeeper 都会为其维护一个叫作 **Stat** 的数据结构，Stat 中记录了这个 ZNode 的三个数据版本，分别是 version（当前ZNode的版本）、cversion（当前ZNode 子节点的版本）和 aversion（当前ZNode的ACL版本）。

#### 2.3.4 事件监听器（Watcher）

Zookeeper 允许用户在指定节点上注册一些 Watcher，并且在一些特定事件触发的时候，ZooKeeper 服务端会将事件通知到感兴趣的客户端上去，**该机制是 Zookeeper实现分布式协调服务的重要特性**。

#### 2.3.5 ACL

Zookeeper 采用 ACL（Access Control Lists）策略来进行权限控制，类似于 UNIX 文件系统的权限控制。Zookeeper 定义了如下5种权限。

- **CREATE**: 创建子节点的权限
- **READ**: 获取节点数据和子节点列表的权限
- **WRITE**: 更新节点数据的权限
- **DELETE**: 删除子节点的权限
- **ADMIN**: 设置节点ACL的权限

其中尤其需要注意的是，CREATE 和 DELETE 这两种权限都是针对子节点的权限控制。



## 参考：

《从Paxos到ZooKeeper 分布式一致性原理与实践》

《尚硅谷Zookeeper》

 https://zookeeper.apache.org/doc/ 

