## 一、概览

### gRPC 是什么

gRPC 是一个由 google 推出的、高性能、开源、通用的 rpc 框架。它是基于 HTTP2 协议标准设计开发，默认采用Protocol Buffers 数据序列化协议，支持多种开发语言。

它可以通过可插拔的负载平衡、跟踪、健康检查和身份验证支持，有效地连接数据中心内部和跨数据中心的服务，支持移动端、浏览器端等各种分布式的后端服务。

在 gRPC 里客户端应用可以像调用本地对象一样直接调用另一台不同的机器上服务端应用的方法，使得您能够更容易地创建分布式应用和服务。与许多 RPC 系统类似，gRPC 也是基于以下理念：定义一个服务，指定其能够被远程调用的方法（包含参数和返回类型）。在服务端实现这个接口，并运行一个 gRPC 服务器来处理客户端调用。在客户端拥有一个存根能够像服务端一样的方法。 

![概念图](https://www.grpc.io/img/landing-2.svg)

### 为什么选择gRPC？

gRPC 是可以在任何环境中运行的现代开源高性能 RPC 框架。它可以有效地连接数据中心内部和跨数据中心的服务，并支持可插拔的负载平衡、跟踪、健康检查和身份验证。它也适用于分布式计算的最后一英里，以将设备，移动应用程序和浏览器连接到后端服务。

- **简单的服务定义**：通过Protocol Buffers, 定义服务的传输数据
- **跨语言和平台工作**：支持多种语言和平台，可通过插件为服务自动生成客户机和服务器存根
- **快速启动并扩展**：只需一行即可安装运行时和开发环境，并通过该框架每秒可扩展至数百万个RPC
- **双向流和集成身份验证**：基于 http2 传输的双向流和完全集成的可插拔式身份验证



### 使用协议缓冲区

默认情况下，gRPC 使用[协议缓冲区](https://mp.weixin.qq.com/s/2MjErgqXhB6SS57TXXTQ4g)（Protocol Buffers）来序列化结构化数据【官方建议使用 proto3】



## 二、Hello gRPC

话不多说，先把项目跑起来~~ 嗖~~~嗖~~~~

使用 gRPC 有 3 个步骤

1. 在 `.proto` 文件中定义服务
2. 使用 `Protocol Buffers`编译器生成服务器和客户端代码
3. 使用 `Java gRPC API` 为您的服务编写一个简单的客户端和服务器

一切从简，直接用IDEA的强大功能生成各种文件就可以了，懒得下载 protoc 编译器。

#### 1. IDEA安装`Protobuf Support` 插件

#### 2. POM文件

```xml
<dependencies>
        <dependency>
            <groupId>com.google.protobuf</groupId>
            <artifactId>protobuf-java</artifactId>
            <version>3.9.0</version>
        </dependency>

        <dependency>
            <groupId>io.grpc</groupId>
            <artifactId>grpc-netty-shaded</artifactId>
            <version>1.23.0</version>
        </dependency>
        <dependency>
            <groupId>io.grpc</groupId>
            <artifactId>grpc-protobuf</artifactId>
            <version>1.23.0</version>
        </dependency>
        <dependency>
            <groupId>io.grpc</groupId>
            <artifactId>grpc-stub</artifactId>
            <version>1.23.0</version>
        </dependency>
        <dependency>
            <groupId>io.grpc</groupId>
            <artifactId>grpc-core</artifactId>
            <version>1.23.0</version>
        </dependency>
    </dependencies>

	<!-- protobuf-maven-plugin插件，用于生成Stub代码库-->
    <build>
        <extensions>
            <extension>
                <groupId>kr.motd.maven</groupId>
                <artifactId>os-maven-plugin</artifactId>
                <version>1.5.0.Final</version>
            </extension>
        </extensions>
        <plugins>
            <plugin>
                <groupId>org.xolstice.maven.plugins</groupId>
                <artifactId>protobuf-maven-plugin</artifactId>
                <version>0.5.1</version>
                <configuration>
                    <protocArtifact>com.google.protobuf:protoc:3.9.0:exe:${os.detected.classifier}</protocArtifact>
                    <pluginId>grpc-java</pluginId>
                    <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.23.0:exe:${os.detected.classifier}</pluginArtifact>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>compile</goal>
                            <goal>compile-custom</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>6</source>
                    <target>6</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

#### 3. helloworld.proto文件

```protobuf
syntax = "proto3";
option java_multiple_files = true;
option java_package = "priv.starfish.helloworld";
option java_outer_classname = "HelloProto";
option objc_class_prefix = "HLW";

package helloworld;
// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}

```

#### 4. complie 自己的 maven项目

![](https://imgkr.cn-bj.ufileos.com/9d0818be-eeba-4a2b-a6a6-29c270c02a31.png)

编译后，会在 `target/generated-sources/protobuf` 目录中的 `java` 以及 `grpc-java` 文件夹下生成相应的java文件，copy到我们自己的代码包下，

![](https://imgkr.cn-bj.ufileos.com/589f066b-ea6e-4904-a711-ee60c35595fb.png)



#### 5. Server + Client

Ctrl +C ——> Ctrl +V 官网的hello world:  [demo](https://github.com/grpc/grpc-java/tree/master/examples/src/main/java/io/grpc/examples/helloworld)

```java
public class HelloWorldServer {
  private static final Logger logger = Logger.getLogger(HelloWorldServer.class.getName());

  private Server server;
  private void start() throws IOException {
    int port = 50051;
    server = ServerBuilder.forPort(port)
        .addService(new GreeterImpl())
        .build()
        .start();
    logger.info("Server started, listening on " + port);
    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run() {
        // Use stderr here since the logger may have been reset by its JVM shutdown hook.
        System.err.println("*** shutting down gRPC server since JVM is shutting down");
        HelloWorldServer.this.stop();
        System.err.println("*** server shut down");
      }
    });
  }

  private void stop() {
    if (server != null) {
      server.shutdown();
    }
  }

  private void blockUntilShutdown() throws InterruptedException {
    if (server != null) {
      server.awaitTermination();
    }
  }


  public static void main(String[] args) throws IOException, InterruptedException {
    final HelloWorldServer server = new HelloWorldServer();
    server.start();
    server.blockUntilShutdown();
  }

  static class GreeterImpl extends GreeterGrpc.GreeterImplBase {

    @Override
    public void sayHello(HelloRequest req, StreamObserver<HelloReply> responseObserver) {
      HelloReply reply = HelloReply.newBuilder().setMessage("Hello,my " + req.getName()).build();
      responseObserver.onNext(reply);
      responseObserver.onCompleted();
    }
  }
}

```

```java
public class HelloWorldClient {
  private static final Logger logger = 	Logger.getLogger(HelloWorldClient.class.getName());

  private final ManagedChannel channel;
  private final GreeterGrpc.GreeterBlockingStub blockingStub;

  /** Construct client connecting to HelloWorld server at {@code host:port}. */
  public HelloWorldClient(String host, int port) {
    this(ManagedChannelBuilder.forAddress(host, port)
        // Channels are secure by default (via SSL/TLS). For the example we disable TLS to avoid
        // needing certificates.
        .usePlaintext()
        .build());
  }

  /** Construct client for accessing HelloWorld server using the existing channel. */
  HelloWorldClient(ManagedChannel channel) {
    this.channel = channel;
    blockingStub = GreeterGrpc.newBlockingStub(channel);
  }

  public void shutdown() throws InterruptedException {
    channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
  }

  /** Say hello to server. */
  public void greet(String name) {
    logger.warning("Will try to greet " + name + " ...");
    HelloRequest request = HelloRequest.newBuilder().setName(name).build();
    HelloReply response;
    try {
      response = blockingStub.sayHello(request);
    } catch (StatusRuntimeException e) {
      logger.log(Level.WARNING, "RPC failed: {0}", e.getStatus());
      return;
    }
    logger.info("Greeting: " + response.getMessage());
  }

  public static void main(String[] args) throws Exception {
    HelloWorldClient client = new HelloWorldClient("localhost", 50051);
    try {
      /* Access a service running on the local machine on port 50051 */
      String user = "world";
      if (args.length > 0) {
        user = args[0]; /* Use the arg as the name to greet if provided */
      }
      client.greet(user);
    } finally {
      client.shutdown();
    }
  }
}
```

#### 6. 分别启动 server 和 client

![](https://imgkr.cn-bj.ufileos.com/456583d5-e8ab-463e-85c8-534e6cd1cfc8.png)



## 三、gRPC 概念

### 服务定义

正如其他 RPC 系统，gRPC 基于如下思想：定义一个服务， 指定其可以被远程调用的方法及其参数和返回类型。gRPC 默认使用 `protocol buffers` 作为接口定义语言，来描述服务接口和消息结构。如果有需要的话，可以使用其他替代方案。

gRPC 允许定义四类服务方法：

- 单项 RPC，即客户端发送一个请求给服务端，从服务端获取一个应答，就像一次普通的函数调用。

  ```java
  rpc SayHello(HelloRequest) returns (HelloResponse);
  ```

- 服务端流式 RPC，即客户端发送一个请求给服务端，可获取一个数据流用来读取一系列消息。客户端从返回的数据流里一直读取直到没有更多消息为止。gRPC 可保证单个RPC调用中的消息顺序

  ```java
  rpc LotsOfReplies(HelloRequest) returns (stream HelloResponse);
  ```

- 客户端流式 RPC，即客户端用提供的一个数据流写入并发送一系列消息给服务端。一旦客户端完成消息写入，就等待服务端读取这些消息并返回应答。

  ```java
  rpc LotsOfGreetings(stream HelloRequest) returns (HelloResponse);
  ```

- 双向流式 RPC，即两边都可以分别通过一个读写数据流来发送一系列消息。这两个数据流操作是相互独立的，所以客户端和服务端能按其希望的任意顺序读写，例如：服务端可以在写应答前等待所有的客户端消息，或者它可以先读一个消息再写一个消息，或者是读写相结合的其他方式。每个数据流里消息的顺序会被保持。

  ```java
  rpc BidiHello(stream HelloRequest) returns (stream HelloResponse);
  ```



### 使用 API 接口

gRPC 提供 protocol buffer 编译插件，能够从一个服务定义的 .proto 文件生成客户端和服务端代码。通常 gRPC 用户可以在服务端实现这些API，并从客户端调用它们。

- 在服务侧，服务端实现服务接口，运行一个 gRPC 服务器来处理客户端调用。gRPC 底层架构会解码传入的请求，执行服务方法，编码服务应答。
- 在客户侧，客户端具有一个称为 *stub* 的本地对象（对于某些语言，首选术语是*client*），该对象实现与服务相同的方法。然后，客户端可以只在本地对象上调用这些方法，将调用的参数包装在适当的 `protocol buffer` 消息类型中-gRPC 来负责发送请求给服务端并返回服务端 protocol buffer 响应。

### 同步 vs 异步

同步 RPC 调用一直会阻塞直到从服务端获得一个应答，这与 RPC 希望的抽象最为接近。另一方面网络内部是异步的，并且在许多场景下能够在不阻塞当前线程的情况下启动 RPC 是非常有用的。

在多数语言里，gRPC 编程接口同时支持同步和异步的特点。

### RPC 生命周期

gRPC 客户端调用 gRPC 服务端的方法时到底发生了什么?

#### 1. 单项 RPC

首先我们来了解一下最简单的 RPC 形式：客户端发出单个请求，获得单个响应。

- 一旦客户端通过stub/client 调用一个方法，服务端会得到相关通知 ，通知包括客户端的元数据，方法名，指定的响应期限
- 服务端既可以在任何响应之前直接发送回初始的元数据，也可以等待客户端的请求信息，到底哪个先发生，取决于具体的应用
- 一旦服务端获得客户端的请求信息，就会做所需的任何工作来创建或组装对应的响应。如果成功的话，这个响应会和包含状态码以及可选的状态信息等状态明细及可选的追踪信息返回给客户端 。
- 假如状态是 OK 的话，客户端会得到应答，这将结束客户端的调用。

#### 2. 服务端流式 RPC

服务端流式 RPC 除了在得到客户端请求信息后发送回一个应答流之外，与我们的简单例子一样。在发送完所有应答后，服务端的状态详情(状态码和可选的状态信息)和可选的跟踪元数据被发送回客户端，以此来完成服务端的工作。客户端在接收到所有服务端的应答后也完成了工作。

#### 3. 客户端流式 RPC

客户端流式 RPC 也基本与我们的简单例子一样，区别在于客户端通过发送一个请求流给服务端，取代了原先发送的单个请求。服务端通常（但并不必须）会在接收到客户端所有的请求后发送回一个应答，其中附带有它的状态详情和可选的跟踪数据。

#### 4. 双向流式 RPC

双向流式 RPC ，调用是由客户端调用方法启动的，服务器接收客户端元数据，方法名和截止时间。服务端可以选择发送回它的初始元数据或等待客户端发送请求。

客户端和服务器端流处理是特定于应用程序的。由于两个流是独立的，因此客户端和服务器可以按任何顺序读取和写入消息。例如服务端可以一直等直到它接收到所有客户端的消息才写应答，或者服务端和客户端可以像"乒乓球"一样：服务端得到一个请求就回送一个应答，接着客户端根据应答来发送另一个请求，以此类推。

### 截止时间

gRPC 允许客户端在调用一个远程方法前指定一个最后期限值。这个值指定了在客户端可以等待服务端多长时间来应答，超过这个时间值 RPC 将结束并返回 `DEADLINE_EXCEEDED` 错误。在服务端可以查询这个期限值来看是否一个特定的方法已经过期，或者还剩多长时间来完成这个方法。 各语言来指定一个截止时间的方式是不同的 - 比如在 Python 里一个截止时间值总是必须的，但并不是所有语言都有一个默认的截止时间。

### RPC 终止

在 gRPC 里，客户端和服务端对调用成功的判断是独立的、本地的，他们的结论可能不一致。这意味着，比如你有一个 RPC 在服务端成功结束("我已经返回了所有应答!")，在客户端可能是失败的("应答在最后期限后才来到!")。也可能在客户端把所有请求发送完前，服务端却判断调用已经完成了。

### 取消 RPC

客户端或服务器都可以随时取消RPC 。取消操作将立即终止RPC，因此不再进行任何工作。它不是一个"撤销"， 在取消之前所做的更改不会回滚。当然，通过同步调用的 RPC 不能被取消，因为直到 RPC 结束前，程序控制权还没有交还给应用。

### 元数据

元数据是一个特殊 RPC 调用的信息（比如身份验证详细信息），这些信息以键值对的形式存在，一般键的类型是字符串，值的类型一般也是字符串(当然也可以是二进制数据)。元数据对 gRPC 本事来说是不透明的 - 它让客户端提供调用相关的信息给服务端，反之亦然。 对于元数据的访问是语言相关的。

### 频道

在创建客户端存根时，一个 gRPC 通道提供一个指定主机和端口号的服务端连接。客户端可以通过指定通道参数来修改 gRPC 的默认行为，比如打开关闭消息压缩。一个通道具有两个状态：`已连接`和`空闲` 。 gRPC 如何处理关闭通道是语言相关的。某些语言还允许查询通道状态。

### 安全认证

gRPC 被设计成可以利用插件的形式支持多种授权认证机制，你可以采用自己喜欢的，简单的，认为方便的一种方式，选择权在用户手里。支持的授权认证机制有

1. SSL/TLS 认证
2. 自定义 Token 认证：gRPC 提供了一种通用机制，可将基于元数据的凭证附加到请求和响应中



## 四、不止Hello World

前边的 hello world 不足以应对实际项目中的种种需求，且没有使用到 gRPC 真正的精华



