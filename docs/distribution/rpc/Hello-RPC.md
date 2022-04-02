![](https://cdn.pixabay.com/photo/2019/12/19/05/56/digitization-4705450_960_720.jpg)

> 说起 rpc，肯定要提到分布式
>
> 能说下rpc的通信流程吗
>
> 如果没有rpc框架，你怎么调用另外一台服务器上的接口呢

## 一、RPC是个啥玩意

**远程过程调用**（英语：Remote Procedure Call，缩写为 RPC）是一个计算机通信协议。该协议允许运行于一台计算机的程序调用另一台计算机的子程序，而程序员无需额外地为这个交互作用编程，区别于本地过程调用。



远程过程调用，自然是相对于本地过程调用来说的，如果是个单体应用，内部之间，本地函数调用就可以了，因为在**同一个地址空间**，或者说在同一块内存，所以通过方法栈和参数栈就可以实现。

随着应用的升级，单体应用无法满足发展，我们改造成分布式应用，将很多可以共享的功能都单独拎出来组成各种服务

这时候有同学会说了，服务之间通过 http，调用 Restful 接口就行

对了，我们外部 API 一般都是这样，每次构造 http 请求和 body 这些

可是我们是内部系统，希望可以像本地调用那样，去发起远程调用，让使用者感知不到远程调用的过程呢，像这样：

```java
@Reference
private Calculator calculator;

...

calculator.add(1,2);

...

```

这时候，有同学就会说，用**代理模式**呀！而且最好是结合Spring IoC一起使用，通过Spring注入calculator对象，注入时，如果扫描到对象加了@Reference注解，那么就给它生成一个代理对象，将这个代理对象放进容器中。而这个代理对象的内部，就是通过httpClient来实现RPC远程过程调用的。

可能上面这段描述比较抽象，不过这就是很多RPC框架要解决的问题和解决的思路，比如阿里的Dubbo。

总结一下，RPC 的作用体现在两个方面

1. 远程调用时，要能够像本地调用一样方便，让调用者感知不到远程调用的逻辑
2. 解决分布式系统中，服务之间的调用问题。隐藏底层网络通信的复杂性，让我们更专注于业务



实际情况下，RPC很少用到http协议来进行数据传输，毕竟我只是想传输一下数据而已，何必动用到一个文本传输的应用层协议呢，我为什么不直接使用**二进制传输**？比如直接用Java的Socket协议进行传输？

不管你用何种协议进行数据传输，**一个完整的RPC过程，都可以用下面这张图来描述**：

![img](https:////upload-images.jianshu.io/upload_images/7143349-9e00bb104b9e3867.png?imageMogr2/auto-orient/strip|imageView2/2/w/263/format/webp)

![](https://static001.geekbang.org/resource/image/82/59/826a6da653c4093f3dc3f0a833915259.jpg)

以左边的Client端为例，Application就是rpc的调用方，Client Stub就是我们上面说到的代理对象，也就是那个看起来像是Calculator的实现类，其实内部是通过rpc方式来进行远程调用的代理对象，至于Client Run-time Library，则是实现远程调用的工具包，比如jdk的Socket，最后通过底层网络实现实现数据的传输。

这个过程中最重要的就是**序列化**和**反序列化**了，因为数据传输的数据包必须是二进制的，你直接丢一个Java对象过去，人家可不认识，你必须把Java对象序列化为二进制格式，传给Server端，Server端接收到之后，再反序列化为Java对象。





> 大概知道了 RPC 是个啥，可是又说不上来他和 HTTP 或者 RMI 的区别，我们接着聊
>
> ![](https://img.pkdoutu.com/production/uploads/image/2018/06/08/20180608391715_wkvHBK.jpg)

## 二、RPC  再了解

### RPC VS HTTP

RPC=Remote Produce Call 是一种技术的概念名词. HTTP是一种协议,**RPC可以通过HTTP来实现**,也可以通过Socket自己实现一套协议来实现. 

HTTP严格来说跟RPC不是一个层级的概念。HTTP本身也可以作为RPC的传输层协议。 

首先 http 和 rpc 并不是一个并行概念。

rpc是远端过程调用，其调用协议通常包含传输协议和序列化协议。

传输协议包含: 如著名的 [gRPC]([grpc / grpc.io](https://link.zhihu.com/?target=http%3A//www.grpc.io/)) 使用的 http2 协议，也有如dubbo一类的自定义报文的tcp协议。

序列化协议包含: 如基于文本编码的 xml json，也有二进制编码的 protobuf hessian等。



### RPC vs Restful

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

### RPC vs RMI

严格来说这两者也不是一个维度的。

RMI 是 Java 提供的一种访问远程对象的协议，是已经实现好了的，可以直接用了。

而 RPC 呢？人家只是一种编程模型，并没有规定你具体要怎样实现，**你甚至都可以在你的RPC框架里面使用RMI来实现数据的传输**，比如Dubbo：[Dubbo - rmi协议](https://link.jianshu.com?t=http%3A%2F%2Fdubbo.apache.org%2Fbooks%2Fdubbo-user-book%2Freferences%2Fprotocol%2Frmi.html)





## 三、RPC框架原理

> 如何调用他人的远程服务？



RPC框架的目标就是让远程过程(服务)调用更加简单、透明，

既然是一个远程调用，那肯定就需要网络来传输数据

RPC框架负责屏蔽底层的传输方式(TCP或者UDP)、序列化方式( XML/JSON/二进制)和通信细节。

框架使用者只需要了解谁在什么位置提供了什么样的远程服务接口即可，开发者不需要关心底层通信细节和调用过程。 





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





RPC框架的目标就是让远程过程(服务)调用更加简单、透明，RPC框架负责屏蔽底层的传输方式(TCP或者UDP)、序列化方式( XML/JSON/二进制)和通信细节。框架使用者只需要了解谁在什么位置提供了什么样的远程服务接口即可，开发者不需要关心底层通信细节和调用过程。 

 

RPC框架的调用原理图如下：

 

 ![img](http://jiangew.me/assets/images/post/20181013/grpc-01-01.png) 

 

 

 

## RPC框架核心技术点

RPC框架实现的几个核心技术点总结如下：

1)远程服务提供者需要以某种形式提供服务调用相关的信息，包括但不限于服务接口定义、数据结构，或者中间态的服务定义文件，例如 Thrift的IDL文件， WS-RPC的WSDL文件定义，甚至也可以是服务端的接口说明文档;服务调用者需要通过一定的途径获取远程服务调用相关信息，例如服务端接口定义Jar包导入，获取服务端1DL文件等。

### 远程代理

动态代理，用 Spring AOP 的同学就不陌生了，他就是远程调用的魔法

当我们作为调用方使用接口时，RPC 会自动给接口生成一个代理类，我们在项目中注入接口的时候，运行过程中实际绑定的是这个接口生成的代理类。这样在接口方法被调用的时候，它实际上是被生成代理类拦截到了，这样我们就可以在生成的代理类里 面，加入远程调用逻辑。

通过这种“偷梁换柱”的手法，就可以帮用户屏蔽远程调用的细节，实现像调用本地一样地调用远程的体验，整体流程如下图所示:

![](https://static001.geekbang.org/resource/image/05/53/05cd18e7e33c5937c7c39bf8872c5753.jpg)

远程代理对象:服务调用者调用的服务实际是远程服务的本地代理，对于Java语言，它的实现就是JDK的动态代理，通过动态代理的拦截机制，将本地调用封装成远程服务调用. 



### 通信

一次 RPC 调用，本质就是服务消费者与服务提供者间的一次网络信息交换的过程。

服务调用者通过网络 IO 发送一条 请求消息，服务提供者接收并解析，处理完相关的业务逻辑之后，再发送一条响应消息给服务调用者，服务调用者接收并解析响应消息，处理完相关的响应逻辑，一次 RPC 调用便结 束了。可以说，网络通信是整个 RPC 调用流程的基础。

#### 常见网络 IO 模型

那说到网络通信，就不得不提一下网络 IO 模型。为什么要讲网络 IO 模型呢?因为所谓的

两台 PC 机之间的网络通信，实际上就是两台 PC 机对网络 IO 的操作。

常见的网络 IO 模型分为四种:同步阻塞 IO(BIO)、同步非阻塞 IO(NIO)、IO 多路复 用和异步非阻塞 IO(AIO)。在这四种 IO 模型中，只有 AIO 为异步 IO，其他都是同步 IO。

其中，最常用的就是同步阻塞 IO 和 IO 多路复用，这一点通过了解它们的机制，你会 get 到。至于其他两种 IO 模型，因为不常用，则不作为本讲的重点，有兴趣的话我们可以在留 言区中讨论。



##### 阻塞 IO(blocking IO)

同步阻塞 IO 是最简单、最常见的 IO 模型，在 Linux 中，默认情况下所有的 socket 都是blocking 的，先看下操作流程。

首先，应用进程发起 IO 系统调用后，应用进程被阻塞，转到内核空间处理。之后，内核开 始等待数据，等待到数据之后，再将内核中的数据拷贝到用户内存中，整个 IO 处理完毕后 返回进程。最后应用的进程解除阻塞状态，运行业务逻辑。

这里我们可以看到，系统内核处理 IO 操作分为两个阶段——等待数据和拷贝数据。而在这 两个阶段中，应用进程中 IO 操作的线程会一直都处于阻塞状态，如果是基于 Java 多线程 开发，那么每一个 IO 操作都要占用线程，直至 IO 操作结束。

这个流程就好比我们去餐厅吃饭，我们到达餐厅，向服务员点餐，之后要一直在餐厅等待后
厨将菜做好，然后服务员会将菜端给我们，我们才能享用。



##### IO 多路复用(IO multiplexing)

多路复用 IO 是在高并发场景中使用最为广泛的一种 IO 模型，如 Java 的 NIO、Redis、 Nginx 的底层实现就是此类 IO 模型的应用，经典的 Reactor 模式也是基于此类 IO 模型。

那么什么是 IO 多路复用呢? 通过字面上的理解，多路就是指多个通道，也就是多个网络连接的 IO，而复用就是指多个通道复用在一个复用器上。

多个网络连接的 IO 可以注册到一个复用器(select)上，当用户进程调用了 select，那么 整个进程会被阻塞。同时，内核会“监视”所有 select 负责的 socket，当任何一个 socket 中的数据准备好了，select 就会返回。这个时候用户进程再调用 read 操作，将数据从内核中拷贝到用户进程。

这里我们可以看到，当用户进程发起了 select 调用，进程会被阻塞，当发现该 select 负责 的 socket 有准备好的数据时才返回，之后才发起一次 read，整个流程要比阻塞 IO 要复杂，似乎也更浪费性能。但它最大的优势在于，用户可以在一个线程内同时处理多个 socket 的 IO 请求。用户可以注册多个 socket，然后不断地调用 select 读取被激活的 socket，即可达到在同一个线程内同时处理多个 IO 请求的目的。而在同步阻塞模型中，必须通过多线程的方式才能达到这个目的。



### 序列化

网络传输的数据必须是二进制数据，远程通信时需要将对象转换成二进制码流进行网络传输，不同的序列化框架，支持的数据类型、数据包大小、异常类型及性能等都不同

> 序列化就是将对象转换成二进制数据的过程，而反序列就是反过来将二进制转换为对象的过程。

不同的RPC框架应用场景不同，因此技术选择也会存在很大差异。一些做得比较好的RPC框架可以支持多种序列化方式，有的甚至支持用户自定义序列化框架( Hadoop Avro)

![](https://static001.geekbang.org/resource/image/d2/04/d215d279ef8bfbe84286e81174b4e704.jpg)

 **有哪些常用的序列化?**

#### JDK 原生序列化

Javer 肯定对这种原生的序列化方式最熟悉不过了

```java

import java.io.*;

public class Student implements Serializable {
    //学号
    private int no;
    //姓名
    private String name;

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "no=" + no +
                ", name='" + name + '\'' +
                '}';
    }

    public static void main(String[] args) throws IOException, ClassNotFoundException {
        String home = System.getProperty("user.home");
        String basePath = home + "/Desktop";
        FileOutputStream fos = new FileOutputStream(basePath + "student.dat");
        Student student = new Student();
        student.setNo(100);
        student.setName("TEST_STUDENT");
        ObjectOutputStream oos = new ObjectOutputStream(fos);
        oos.writeObject(student);
        oos.flush();
        oos.close();

        FileInputStream fis = new FileInputStream(basePath + "student.dat");
        ObjectInputStream ois = new ObjectInputStream(fis);
        Student deStudent = (Student) ois.readObject();
        ois.close();

        System.out.println(deStudent);

    }
}
```

 我们可以看到，JDK 自带的序列化机制对使用者而言是非常简单的。

序列化具体的实现是由 ObjectOutputStream 完成的，而反序列化的具体实现是由 ObjectInputStream 完成的。

那么 JDK 的序列化过程是怎样完成的呢？我们看下下面这张图：

![](https://static001.geekbang.org/resource/image/7e/9f/7e2616937e3bc5323faf3ba4c09d739f.jpg)

序列化过程就是在读取对象数据的时候，不断加入一些特殊分隔符，这些特殊分隔符用于在反序列化过程中截断用。

- 头部数据用来声明序列化协议、序列化版本，用于高低版本向后兼容
- 对象数据主要包括类名、签名、属性名、属性类型及属性值，当然还有开头结尾等数据，除了属性值属于真正的对象值，其他都是为了反序列化用的元数据
- 存在对象引用、继承的情况下，就是递归遍历“写对象”逻辑

实际上任何一种序列化框架，核心思想就是设计一种序列化协议，将对象的类型、属性类型、属性值一一按照固定的格式写到二进制字节流中来完成序列化，再按照固定的格式一一读出对象的类型、属性类型、属性值，通过这些信息重新创建出一个新的对象，来完成反序列化。



#### JSON

JSON 是典型的 Key-Value 方式，没有数据类型，是一种文本型序列化框架

但用 JSON 进行序列化有这样两个问题，你需要格外注意：

- JSON 进行序列化的额外空间开销比较大，对于大数据量服务这意味着需要巨大的内存和磁盘开销；
- JSON 没有类型，但像 Java 这种强类型语言，需要通过反射统一解决，所以性能不会太好。

所以如果 RPC 框架选用 JSON 序列化，服务提供者与服务调用者之间传输的数据量要相对较小，否则将严重影响性能。



#### Hessian

Hessian 是动态类型、二进制、紧凑的，并且可跨语言移植的一种序列化框架。Hessian 协议要比 JDK、JSON 更加紧凑，性能上要比 JDK、JSON 序列化高效很多，而且生成的字节数也更小。

```java

Student student = new Student();
student.setNo(101);
student.setName("HESSIAN");

//把student对象转化为byte数组
ByteArrayOutputStream bos = new ByteArrayOutputStream();
Hessian2Output output = new Hessian2Output(bos);
output.writeObject(student);
output.flushBuffer();
byte[] data = bos.toByteArray();
bos.close();

//把刚才序列化出来的byte数组转化为student对象
ByteArrayInputStream bis = new ByteArrayInputStream(data);
Hessian2Input input = new Hessian2Input(bis);
Student deStudent = (Student) input.readObject();
input.close();

System.out.println(deStudent);
```

相对于 JDK、JSON，由于 Hessian 更加高效，生成的字节数更小，有非常好的兼容性和稳定性，所以 Hessian 更加适合作为 RPC 框架远程通信的序列化协议。

但 Hessian 本身也有问题，官方版本对 Java 里面一些常见对象的类型不支持，比如：

- Linked 系列，LinkedHashMap、LinkedHashSet 等，但是可以通过扩展 CollectionDeserializer 类修复；
- Locale 类，可以通过扩展 ContextSerializerFactory 类修复；
- Byte/Short 反序列化的时候变成 Integer。



#### Protobuf

Protobuf 是 Google 公司内部的混合语言数据标准，是一种轻便、高效的结构化数据存储格式，可以用于结构化数据序列化，支持 Java、Python、C++、Go 等语言。

Protobuf 使用的时候需要定义 IDL（Interface description language），然后使用不同语言的 IDL 编译器，生成序列化工具类，它的优点是：

- 序列化后体积相比 JSON、Hessian 小很多；
- IDL 能清晰地描述语义，所以足以帮助并保证应用程序之间的类型不会丢失，无需类似 XML 解析器；
- 序列化反序列化速度很快，不需要通过反射获取类型；
- 消息格式升级和兼容性不错，可以做到向后兼容。

```protobuf

/**
 *
 * // IDl 文件格式
 * synax = "proto3";
 * option java_package = "com.test";
 * option java_outer_classname = "StudentProtobuf";
 *
 * message StudentMsg {
 * //序号
 * int32 no = 1;
 * //姓名
 * string name = 2;
 * }
 * 
 */
 
StudentProtobuf.StudentMsg.Builder builder = StudentProtobuf.StudentMsg.newBuilder();
builder.setNo(103);
builder.setName("protobuf");

//把student对象转化为byte数组
StudentProtobuf.StudentMsg msg = builder.build();
byte[] data = msg.toByteArray();

//把刚才序列化出来的byte数组转化为student对象
StudentProtobuf.StudentMsg deStudent = StudentProtobuf.StudentMsg.parseFrom(data);

System.out.println(deStudent);
```



以上只是些常见的序列化协议，还有 Message pack、kryo 等



RPC 框架如何选择序列化？需要考虑的因素

- 传输性能和效率
- 空间开销（序列化后的二进制数据体积不能太大）
- 通用性和兼容性
- 安全性（别动不动就安全漏洞）





## 四、业界主流的RPC框架

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



 

 

 

- [如何给老婆解释什么是RPC](<https://www.jianshu.com/p/2accc2840a1b> )
- [你应该知道的RCP原理](https://www.cnblogs.com/LBSer/p/4853234.html)
- [深入理解RPC](https://juejin.cn/post/6844903443237175310)

 

