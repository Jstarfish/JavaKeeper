# Zookeeper 实战

> 上篇大都是概念性东西，作为一名优秀的 Javaer，肯定要实战一番。加油，奥利给！
>
> 文章收集在 GitHub [JavaEgg](https://github.com/Jstarfish/JavaEgg) 中，欢迎 star+指导，N线互联网开发必备兵器库



分布式安装部署，作为一个后端开发正规军，公司一般也不需要你去自己安装，就不探讨了。



## 客户端命令行操作

安装好了之后，先在服务器上了解下命令

### 操作 Zookeeper

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



### 常用命令

| 命令基本语法     | 功能描述                                         |
| ---------------- | ------------------------------------------------ |
| help             | 显示所有操作命令                                 |
| ls path [watch]  | 使用 ls 命令来查看当前znode中所包含的内容        |
| ls2 path [watch] | 查看当前节点数据并能看到更新次数等数据           |
| create           | 普通创建-s  含有序列-e  临时（重启或者超时消失） |
| get path [watch] | 获得节点的值                                     |
| set              | 设置节点的具体值                                 |
| stat             | 查看节点状态                                     |
| delete           | 删除节点                                         |
| rmr              | 递归删除节点                                     |

#### ls 查看当前 zk 中所包含的内容

```shell
[zk: localhost:2181(CONNECTED) 1] ls /
[lazyegg, zookeeper]
```

#### create 创建一个新的 znode

```shell
[zk: localhost:2181(CONNECTED) 2] create /test
Created /test
```

#### get 查看新的 znode 的值

```shell
[zk: localhost:2181(CONNECTED) 4] get /test
null
```

可以看到值为 null,我们刚才设置了一个没有值得节点，也可以通过 `create /zoo dog ` 直接创建有内容的节点

#### set 对 zk 所关联的字符串进行设置

```shell
set /test hello
```

#### delete 删除节点

```shell
delete /test
```



## API应用

不管 Java 是不是最好的语言，我都要说 `I use Java. Java for ever`。所以我们要用 Java 去操作 zookeeper。 

zookeeper的 Java 常用客户端有 3 种，分别是：zookeeper原生API、开源的 zkclient、Apache Curator

#### 1. 原生API

- 创建连接的时候是异步的，所以我们在开发的时候需要人工的写代码等待创建节点的状态，如果需要的话。
- 连接时无超时重连机制。本人觉得这个非常重要，因为在现实使用中，网络是不可信的，在创建节点的时候要考虑到网络的不稳定性。因此，超时重连机制是非常必要的。
- zookeepr 的通信是网络通信，因此在数据通信的时候会消耗一定的网络IO和带宽。但zookeeper没有序列化机制，需要开发者自行开发。
- Watcher注册一次，触发后会自动失效。
- 不支持递归创建树形节点。这点是比较有用的，类似Linux的命令：`mkdir -p /xxx/xxx/`

#### 2. ZkClient

ZkClient 是 Github上一个开源的 zk 客户端，由 datameer 的工程师 Stefan Groschupf 和 Peter Voss 一起开发

- 解决session会话超时重连
- Watcher反复注册
- 简化开发api

当然还有很多的很多修改的功能，使用也很简单，但是社区不活跃，连api文档都不完善，对于我们来说只能看源码来开发应用了，也略有麻烦的。有兴趣的开源上 github 看看。 https://github.com/sgroschupf/zkclient

#### 3. Curator

Curator 是 Netflix 公司开源的一套 Zookeeper Java 客户端框架。后来成为 Apache 基金会的顶级项目之一 。

http://curator.apache.org/ 

目前使用最多的也是 Curator，公司用的也是这个，所以用这个学习记录（基于 2019-07-14 发布的官方版本）

 ![img](http://curator.apache.org/images/ph-quote.png) 



### Maven依赖

Curator 由多个 artifact 组成。根据需要选择引入具体的 artifact，但大多数情况下只用引入`curator-recipes`即可。 

| **GroupID/Org**    | **ArtifactID/Name**        | **Description**                                              |
| :----------------- | :------------------------- | :----------------------------------------------------------- |
| org.apache.curator | curator-recipes            | 所有典型应用场景。需要依赖client和framework，需设置自动获取依赖 |
| org.apache.curator | curator-async              | 具有O/R建模、迁移和许多其他特性的异步DSL                     |
| org.apache.curator | curator-framework          | 高级 API,建立在客户端之上的，应该会自动将其拉入              |
| org.apache.curator | curator-client             | Zookeeper client的封装，用于取代原生的Zookeeper客户端        |
| org.apache.curator | curator-test               | 包含TestingServer、TestingCluster和一些用于测试的其他工具    |
| org.apache.curator | curator-examples           | 示例                                                         |
| org.apache.curator | curator-x-discovery        | 在framework上构建的服务发现实现                              |
| org.apache.curator | curator-x-discovery-server | 可以使用Curator Discovery的RESTful服务                       |

### 版本兼容

http://curator.apache.org/zk-compatibility.html 



为了可以直观的看到 Zookeeper 的节点信息，可以考虑弄一个 zk 的管控界面，常见的有 zkui 和 zkweb。

zkui：[github.com/DeemOpen/zk…](https://github.com/DeemOpen/zkui)

zkweb：[github.com/zhitom/zkwe…](https://github.com/zhitom/zkweb)

我用的 zkweb ，虽然界面上看起来没有 zkui 精简，但是在层次展示和一些细节上感觉比 zkui 好一点



### 开干

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>4.3.0</version>
</dependency>
```



建议直接 clone https://github.com/apache/curator ，`curator-examples` 下边有各种示例，选举、分布式锁、服务发现、缓存。。。

Curator使用流式接口风格。

#### 1. coding

```java
public class CuratorTest {

    public String zookeeperConnectionString = "10.121.214.95:2181";
    CuratorFramework client;

    /**
     *  创建客户端，两种方式，默认客户端，带参数的客户端创建
     */
    @Before
    public void CreateClient() {
        RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 3);
        client = CuratorFrameworkFactory.newClient(zookeeperConnectionString, retryPolicy);
        client.start();
    }

    /**
     * 有了CuratorFramework 实例，就可以使用了,先来创建个空节点
     */
    @Test
    public void createPath() {
        try {
            client.create().forPath("/myPath1");
            client.create().forPath("/myPath1/myChildren1");
            client.create().forPath("/myPath1/myChildren2");
            //client.create().forPath("/myPath1","myData1".getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 创建临时节点
     * 和持久节点不同的是，临时节点的生命周期和客户端会话绑定。
     * 也就是说，如果客户端会话失效，那么这个节点就会自动被清除掉。
     * 注意，这里提到的是会话失效，而非连接断开。另外，在临时节点下面不能创建子节点。
     */
    @Test
    public void createEphemeral() throws Exception {
        client.create().withMode(CreateMode.EPHEMERAL).forPath("/myPath2", "myData2".getBytes());
    }

    /**
     *  为节点设置数据
     */
    @Test
    public void setData() throws Exception {
        client.setData().forPath("/myPath1", "myData1".getBytes());
    }

    /**
     *  列出子节点
     */
    @Test
    public void watchedGetChildren() throws Exception {
        List<String> list = client.getChildren().watched().forPath("/myPath1");
        for (String s : list) {
            System.out.println(s);
        }
    }


    /**
     *  删除节点
     *  sguaranteed()：接口是一个保障措施，只要客户端会话有效，
     *  那么Curator会在后台持续进行删除操作，直到节点删除成功
     *  deletingChildrenIfNeeded()： 删除一个节点，并递归删除其所有子节点
     */
    @Test
    public void guaranteedDelete() throws Exception {
        //client.delete().forPath("/myPath1");
        //client.delete().guaranteed().forPath("/myPath1");
        client.delete().deletingChildrenIfNeeded().forPath("/myPath1");
    }
}
```





## Curator Async

### What Is Curator Async?

Curator Async 是一个封装了 `CuratorFramework`  实例的 `DSL(Domain-specific language)`

完全异步，基于 Java8 的`CompletionStage` 

 https://curator.apache.org/curator-x-async/index.html 



 https://blog.gmem.cc/apache-curator-study-note 



pc广告在上海 zk用作配置管理，有可投放的商品包状态变动会通知他们

## 参考

《Zookeeper客户端对比选择》 https://www.cnblogs.com/liangjf/p/8552559.html 



 https://juejin.im/post/5cb1ec81e51d456e3b701871 













## 直击面试

- 请简述ZooKeeper的选举机制

- ZooKeeper的监听原理是什么？

- ZooKeeper的部署方式有哪几种？集群中的角色有哪些？集群最少需要几台机器？

  部署方式单机模式、集群模式

  角色：Leader和Follower

  集群最少需要机器数：3

- ZooKeeper的常用命令

  ls create get delete set…



![](../../../images/blog_end.png)