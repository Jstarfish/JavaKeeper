<https://www.jianshu.com/p/2accc2840a1b> 

## RPC是个啥玩意

**远程过程调用**（英语：Remote Procedure Call，缩写为 RPC）是一个计算机通信[协议](https://zh.wikipedia.org/wiki/%E7%B6%B2%E7%B5%A1%E5%82%B3%E8%BC%B8%E5%8D%94%E8%AD%B0)。该协议允许运行于一台计算机的[程序](https://zh.wikipedia.org/wiki/%E7%A8%8B%E5%BA%8F)调用另一台计算机的[子程序](https://zh.wikipedia.org/wiki/%E5%AD%90%E7%A8%8B%E5%BA%8F)，而程序员无需额外地为这个交互作用编程,区别于本地过程调用。



**RPC要解决的两个问题：**

1. **解决分布式系统中，服务之间的调用问题。**
2. **远程调用时，要能够像本地调用一样方便，让调用者感知不到远程调用的逻辑。**





更通俗的解释：[如何给老婆解释什么是RPC](<https://www.jianshu.com/p/2accc2840a1b> )







<https://www.cnblogs.com/LBSer/p/4853234.html> 

<https://juejin.im/entry/57c866230a2b58006b204712> 

## 如何调用他人的远程服务？

　　由于各个服务部署在不同机器，服务间的调用涉及到网络通信过程，如果服务消费方每调用一个服务都要写一坨网络通信相关的代码，不仅使用复杂而且极易出错。

如果有一种方式能让我们像调用本地服务一样调用远程服务，而让调用者对网络通信这些细节透明，那么将大大提高生产力。这种方式其实就是RPC（Remote Procedure Call Protocol），在各大互联网公司中被广泛使用，如阿里巴巴的hsf、dubbo（开源）、Facebook的thrift（开源）、Google grpc（开源）、Twitter的finagle等。

我们首先看下一个RPC调用的具体流程：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gjlr8lf4hlj31440ny41b.jpg)

1）服务消费方（client）调用以本地调用方式调用服务；

2）client stub接收到调用后负责将方法、参数等组装成能够进行网络传输的消息体；

3）client stub找到服务地址，并将消息发送到服务端；

4）server stub收到消息后进行解码；

5）server stub根据解码结果调用本地的服务；

6）本地服务执行并将结果返回给server stub；

7）server stub将返回结果打包成消息并发送至消费方；

8）client stub接收到消息，并进行解码；

9）服务消费方得到最终结果。

**RPC的目标就是要2~8这些步骤都封装起来，让用户对这些细节透明。**



RPC仅仅是一种技术，为什么会与微服务框架搞混呢？

因为随着RPC的大量使用，必然伴随着服务的发现、服务的治理、服务的监控这些，这就组成了微服务框架。

RPC仅仅是微服务中的一部分。





维度	RPC	REST
耦合性	强耦合	松散耦合
消息协议	二进制thrift、protobuf、avro	文本型XML、JSON
通讯协议	TCP为主，也可以是HTTP	HTTP/HTTP2
性能	高	一般低于RPC
接口契约IDL	Thrift、protobuf idl	Swagger
客户端	强类型客户端、一般自动生成，可支持多语言客户端	一般http client可访问，也可支持多语言
案例	dubbo、motan、tars、grpc、thrift	spring boot/mvc、Jax-rs
开发者友好	客户端比较方便，但是二进制消息不可读	文本消息开发者可读、浏览器可直接访问查看结果
对外开放	需要转换成REST/文本协议	直接对外开放


### RPC VS HTTP

RPC=Remote Produce Call 是一种技术的概念名词. HTTP是一种协议,**RPC可以通过HTTP来实现**,也可以通过Socket自己实现一套协议来实现. 

HTTP严格来说跟RPC不是一个层级的概念。HTTP本身也可以作为RPC的传输层协议。 

首先 http 和 rpc 并不是一个并行概念。

rpc是远端过程调用，其调用协议通常包含传输协议和序列化协议。

传输协议包含: 如著名的 [gRPC]([grpc / grpc.io](https://link.zhihu.com/?target=http%3A//www.grpc.io/)) 使用的 http2 协议，也有如dubbo一类的自定义报文的tcp协议。

序列化协议包含: 如基于文本编码的 xml json，也有二进制编码的 protobuf hessian等。



# RPC vs Restful

其实这两者并不是一个维度的概念，总得来说RPC涉及的维度更广。

如果硬要比较，那么可以从RPC风格的url和Restful风格的url上进行比较。

比如你提供一个查询订单的接口，用RPC风格，你可能会这样写：

```
/queryOrder?orderId=123
```

用Restful风格呢？

```
Get  
/order?orderId=123
```

**RPC是面向过程，Restful是面向资源**，并且使用了Http动词。从这个维度上看，Restful风格的url在表述的精简性、可读性上都要更好。

REST是一种架构风格，指的是一组架构约束条件和原则。满足这些约束条件和原则的应用程序或设计就是 RESTful。REST规范把所有内容都视为资源，网络上一切皆资源。 

# RPC vs RMI

严格来说这两者也不是一个维度的。

RMI是Java提供的一种访问远程对象的协议，是已经实现好了的，可以直接用了。

而RPC呢？人家只是一种编程模型，并没有规定你具体要怎样实现，**你甚至都可以在你的RPC框架里面使用RMI来实现数据的传输**，比如Dubbo：[Dubbo - rmi协议](https://link.jianshu.com?t=http%3A%2F%2Fdubbo.apache.org%2Fbooks%2Fdubbo-user-book%2Freferences%2Fprotocol%2Frmi.html)





## **一、RPC架构简介**

RPC的全称是Remote Procedure Call，它是一种进程间通信方式。允许像调用本地服务一样调用远程服务，它的具体实现方式可以不同，例如Spring的 HTTP Invoker，Facebook的 Thrift二进制私有协议通信。

RPC概念术语在上世纪80年代由 Bruce Jay Nelson提出，在他的论文中对RPC进行了如下总结。

1)简单:RPC概念的语义十分清晰和简单，这样建立分布式计算就更容易。

2)高效:过程调用看起来十分简单而且高效。

3)通用:在单机计算中过程往往是不同算法和APl，跨进程调用最重要的是通用的通信机制。

2006年之后，随着移动互联网的发展，各种智能终端的普及，远程分布式调用已经成为主流，RPC框架也如雨后春笋般诞生，开源和自研的RPC框架的普及标志着传统垂直应用架构时代的终结。

 

## **二、RPC框架原理**

RPC框架的目标就是让远程过程(服务)调用更加简单、透明，RPC框架负责屏蔽底层的传输方式(TCP或者UDP)、序列化方式( XML/JSON/二进制)和通信细节。框架使用者只需要了解谁在什么位置提供了什么样的远程服务接口即可，开发者不需要关心底层通信细节和调用过程。 

 

RPC框架的调用原理图如下：

 

 ![img](http://jiangew.me/assets/images/post/20181013/grpc-01-01.png) 

 

 

 

## **三：RPC框架核心技术点**

RPC框架实现的几个核心技术点总结如下：

1)远程服务提供者需要以某种形式提供服务调用相关的信息，包括但不限于服务接口定义、数据结构，或者中间态的服务定义文件，例如 Thrift的IDL文件， WS-RPC的WSDL文件定义，甚至也可以是服务端的接口说明文档;服务调用者需要通过一定的途径获取远程服务调用相关信息，例如服务端接口定义Jar包导入，获取服务端1DL文件等。

2)远程代理对象:服务调用者调用的服务实际是远程服务的本地代理，对于Java语言，它的实现就是JDK的动态代理，通过动态代理的拦截机制，将本地调用封装成远程服务调用. 

3)通信:RPC框架与具体的协议无关，例如Spring的远程调用支持 HTTP Invoke、RMI Invoke， MessagePack使用的是私有的二进制压缩协议。

4)序列化:远程通信，需要将对象转换成二进制码流进行网络传输，不同的序列化框架，支持的数据类型、数据包大小、异常类型及性能等都不同。不同的RPC框架应用场景不同，因此技术选择也会存在很大差异。一些做得比较好的RPC框架可以支持多种序列化方式，有的甚至支持用户自定义序列化框架( Hadoop Avro)。

 

 

## **四、业界主流的RPC框架**

业界主流的RPC框架很多，比较出名的RPC主要有以下4种：

1）、由Facebook开发的原创服务调用框架Apache Thrift; 

2）、Hadoop的子项目Avro-RPC;

3）、caucho提供的基于binary-RPC实现的远程通信框架Hessian;

4）、Google开源的基于HTTP/2和ProtoBuf的通用RPC框架gRPC



| 功能             | Hessian | Montan                       | rpcx   | gRPC             | Thrift        | Dubbo   | Dubbox   | Tars | Spring Cloud |      |
| ---------------- | ------- | ---------------------------- | ------ | ---------------- | ------------- | ------- | -------- | ---- | ------------ | ---- |
| 开发语言         | 跨语言  | Java                         | Go     | 跨语言           | 跨语言        | Java    | Java     |      | Java         |      |
| 分布式(服务治理) | ×       | √                            | √      | ×                | ×             | √       | √        |      | √            |      |
| 多序列化框架支持 | hessian | √(支持Hessian2、Json,可扩展) | √      | × 只支持protobuf | ×(thrift格式) | √       | √        |      | √            |      |
| 多种注册中心     | ×       | √                            | √      | ×                | ×             | √       | √        |      | √            |      |
| 管理中心         | ×       | √                            | √      | ×                | ×             | √       | √        |      | √            |      |
| 跨编程语言       | √       | ×                            | ×      | √                | √             | ×       | ×        |      | ×            |      |
| 支持REST         | ×       | ×                            | ×      | ×                | ×             | ×       | √        |      | √            |      |
| 开源机构         | Caucho  | Weibo                        | Apache | Google           | Apache        | Alibaba | Dangdang |      | Apache       |      |
|                  |         |                              |        |                  |               |         |          |      |              |      |
|                  |         |                              |        |                  |               |         |          |      |              |      |
|                  |         |                              |        |                  |               |         |          |      |              |      |



https://blog.csdn.net/u013452337/article/details/86593291



 

 

 

 

 

