> 上篇大都是概念性东西，作为一名优秀的 Javaer，肯定要实战一番。加油，奥利给！
>
> 文章收集在 GitHub [JavaEgg](https://github.com/Jstarfish/JavaEgg) 中，欢迎 star+指导，N线互联网开发必备兵器库



## 分布式安装部署



## 客户端命令行操作

| 命令基本语法     | 功能描述                                         | 示例 |
| ---------------- | ------------------------------------------------ | ---- |
| help             | 显示所有操作命令                                 |      |
| ls path [watch]  | 使用 ls 命令来查看当前znode中所包含的内容        |      |
| ls2 path [watch] | 查看当前节点数据并能看到更新次数等数据           |      |
| create           | 普通创建-s  含有序列-e  临时（重启或者超时消失） |      |
| get path [watch] | 获得节点的值                                     |      |
| set              | 设置节点的具体值                                 |      |
| stat             | 查看节点状态                                     |      |
| delete           | 删除节点                                         |      |
| rmr              | 递归删除节点                                     |      |



## 官方教程

https://cwiki.apache.org/confluence/display/ZOOKEEPER/EurosysTutorial

## 4.2 API应用

### 4.3.1 环境搭建

### 4.3.2 创建ZooKeeper客户端

### 4.3.3 创建子节点

### 4.3.4 获取子节点并监听节点变化

### 4.3.5 判断Znode是否存在



# 企业面试真题

## 5.1 请简述ZooKeeper的选举机制



## 5.2 ZooKeeper的监听原理是什么？



## 5.3 ZooKeeper的部署方式有哪几种？集群中的角色有哪些？集群最少需要几台机器？

（1）部署方式单机模式、集群模式

（2）角色：Leader和Follower

（3）集群最少需要机器数：3

## 5.4 ZooKeeper的常用命令

ls create get delete set…





## 一致性协议

