---
title: Spring WebFlux
date: 2023-05-23
tags: 
 - Spring
categories: Spring
---

![](https://miro.medium.com/v2/resize:fit:1228/format:webp/1*S_6ZOB75Uk-oLh8qVVuC8w.png)

> WebFlux 到底是个什么，主要用于解决什么问题，有什么优势和劣势
>
> 哪些场景或者业务适用于 WebFlux

![](https://img.starfish.ink/spring/springwebflux-banner.svg)



传统的基于Servlet的Web框架，如 Spring MVC，在本质上都是阻塞和多线程的，每个连接都会使用一个线程。在请求处理的时候，会在线程池中拉取一个工作者( worker )线程来对请求进行处理。同时，请求线程是阻塞的，直到工作者线程提示它已经完成为止。

在 Spring5 中，引入了一个新的异步、非阻塞的WEB模块，就是Spring-WebFlux。该框架在很大程度上是基于Reactor项目的，能够解决Web应用和API中对更好的可扩展性的需求。

> 关于Reactor响应式编程的前置知识：看上一篇

要了解 WebFlux ，首先得知道什么是响应式编程，什么是 Reactice

### Reactive Streams（响应式流）

Reactive Streams 是 JVM 中面向流的库标准和规范：

一般由以下组成：

- 发布者：发布元素到订阅者
- 订阅者：消费元素
- 订阅：在发布者中，订阅被创建时，将与订阅者共享
- 处理器：发布者与订阅者之间处理数据

特性

- 处理可能无限数量的元素
- 按顺序处理
- 组件之间异步传递
- 强制性非阻塞背压（Backpressure）



### Backpressure（背压）

## 一、响应式编程

这是微软为了应对 **高并发环境下** 的服务端编程，提出的一个实现 **异步编程** 的方案。

> reactive programming is a declarative programming paradigm concerned with data streams and the propagation of change

响应式编程（reactive programming）是一种基于数据流（data stream）和变化传递（propagation of change）的声明式（declarative）的编程范式

![外行人都能看懂的WebFlux，错过了血亏！_Java_03](https://img-blog.csdnimg.cn/img_convert/92e5f1d2718e8e952ddcd160e819fad1.png)

意思大概如下：

- 在命令式编程(我们的日常编程模式)下，式子 `a=b+c`，这就意味着 `a`的值是由 `b` 和 `c` 计算出来的。如果 `b` 或者 `c` 后续有变化，不会影响到 `a` 的值
- 在响应式编程下，式子 `a:=b+c`，这就意味着 `a` 的值是由 `b` 和 `c` 计算出来的。但如果 `b` 或者 `c` 的值后续有变化，会影响到 `a` 的值

我认为上面的例子已经可以帮助我们理解变化传递（propagation of change）

那数据流（data stream）和声明式（declarative）怎么理解呢？

Lambda的语法是这样的(Stream流的使用会涉及到很多Lambda表达式的东西，所以一般先学Lambda再学Stream流)：

![](https://img-blog.csdnimg.cn/img_convert/a2e6b36f5b89e764dce97124b84d5ea2.webp?x-oss-process=image/format,png)

Stream流的使用分为三个步骤(创建Stream流、执行中间操作、执行最终操作)：

![外行人都能看懂的WebFlux，错过了血亏！_Java_05](https://img-blog.csdnimg.cn/img_convert/6e069fbda532ae7e59b1a8b7188ff76a.webp?x-oss-process=image/format,png)

执行中间操作实际上就是给我们提供了很多的API去操作Stream流中的数据(求和/去重/过滤)等等

![外行人都能看懂的WebFlux，错过了血亏！_Java_06](https://img-blog.csdnimg.cn/img_convert/3d6e3b7ebb4e6b8de55e048f6abc30ac.webp?x-oss-process=image/format,png)

说了这么多，怎么理解数据流和声明式呢？其实是这样的：

本来数据是我们自行处理的，后来我们把要处理的数据抽象出来（变成了数据流），然后通过API去处理数据流中的数据（是声明式的）
比如下面的代码；将数组中的数据变成数据流，通过显式声明调用.sum()来处理数据流中的数据，得到最终的结果：

```
public static void main(String[] args) {
    int[] nums = { 1, 2, 3 };
    int sum2 = IntStream.of(nums).parallel().sum();
    System.out.println("结果为：" + sum2);
}
```

如图下所示：

![外行人都能看懂的WebFlux，错过了血亏！_Java_07](https://img-blog.csdnimg.cn/img_convert/e65280d03d75299559d90138d99ebe65.png)



### 响应式编程->异步非阻塞

说到响应式编程就离不开异步非阻塞。

从Spring官网介绍WebFlux的信息我们就可以发现asynchronous, nonblocking 这样的字样，因为响应式编程它是异步的，也可以理解成变化传递它是异步执行的。

我们的JDK8 Stream流是同步的，它就不适合用于响应式编程（但基础的用法是需要懂的，因为响应式流编程都是操作流嘛）

而在JDK9 已经支持响应式流了，下面我们来看一下



响应式编程打破了传统的同步阻塞式编程模型，基于响应式数据流和背压机制实现了异步非阻塞式的网络通信、数据访问和事件驱动架构，能够减轻服务器资源之间的竞争关系，从而提高服务的响应能力。

Spring 5 中内嵌了响应式 Web 框架、响应式数据访问、响应式消息通信等多种响应式组件，从而极大简化了响应式应用程序的开发过程和难度。

事实上，响应式编程的实施目前主要有两个障碍，一个是关系型数据访问，而另一个就是网络协议。

## 二、JDK9 Reactive

响应式流的规范早已经被提出了：里面提到了：

> Reactive Streams is an initiative to provide a standard for asynchronous stream processing with non-blocking back pressure ----->http://www.reactive-streams.org/

翻译再加点信息：

响应式流(Reactive Streams)通过定义一组实体，接口和互操作方法，给出了实现异步非阻塞背压的标准。第三方遵循这个标准来实现具体的解决方案，常见的有Reactor，RxJava，Akka Streams，Ratpack等。

规范里头实际上就是定义了四个接口：

![外行人都能看懂的WebFlux，错过了血亏！_Java_09](https://img-blog.csdnimg.cn/img_convert/d6b7836ff0350a86ef964bd835530feb.png)

Java 平台直到 JDK 9 才提供了对于Reactive的完整支持，JDK9也定义了上述提到的四个接口，在java.util.concurrent包上

![外行人都能看懂的WebFlux，错过了血亏！_Java_10](https://img-blog.csdnimg.cn/img_convert/23db7b08f8181fcc75118e7ce5623cba.png)

一个通用的流处理架构一般会是这样的（生产者产生数据，对数据进行中间处理，消费者拿到数据消费)：

![外行人都能看懂的WebFlux，错过了血亏！_Java_11](https://img-blog.csdnimg.cn/img_convert/d3df369ef19c771ca93654d88d5bfcaf.png)

- 数据来源，一般称为生产者（Producer）
- 数据的目的地，一般称为消费者(Consumer)

- 在处理时，对数据执行某些操作一个或多个处理阶段。（Processor)

到这里我们再看回响应式流的接口，我们应该就能懂了：

- Publisher（发布者)相当于生产者(Producer)
- Subscriber(订阅者)相当于消费者(Consumer)
- Processor就是在发布者与订阅者之间处理数据用的

在响应式流上提到了back pressure（背压)这么一个概念，其实非常好理解。在响应式流实现异步非阻塞是基于生产者和消费者模式的，而生产者消费者很容易出现的一个问题就是：生产者生产数据多了，就把消费者给压垮了。

而背压说白了就是：消费者能告诉生产者自己需要多少量的数据。这里就是Subscription接口所做的事。



## 三、Hello WebFlux

WebFlux 是 Spring Framework5.0 中引入的一种新的反应式Web框架。通过Reactor项目实现 Reactive Streams规范，完全异步和非阻塞框架。本身不会加快程序执行速度，但在高并发情况下借助异步IO能够以少量而稳定的线程处理更高的吞吐，规避文件IO/网络IO阻塞带来的线程堆积。

####  WebFlux 的特性

WebFlux 具有以下特性：

- **异步非阻塞** - 可以举一个上传例子。相对于 Spring MVC 是同步阻塞IO模型，Spring WebFlux这样处理：线程发现文件数据没传输好，就先做其他事情，当文件准备好时通知线程来处理（这里就是输入非阻塞方式），当接收完并写入磁盘（该步骤也可以采用异步非阻塞方式）完毕后再通知线程来处理响应（这里就是输出非阻塞方式）。
- **响应式函数编程** - 相对于Java8 Stream 同步、阻塞的Pull模式，Spring Flux 采用Reactor Stream 异步、非阻塞Push模式。书写采用 Java lambda 方式,接近自然语言形式且容易理解。
- **不拘束于Servlet** - 可以运行在传统的Servlet 容器（3.1+版本），还能运行在Netty、Undertow等NIO容器中。



####  WebFlux 的设计目标

- 适用高并发
- 高吞吐量
- 可伸缩性



WebFlux使用的响应式流并不是用JDK9平台的，而是一个叫做Reactor响应式流库。所以，入门WebFlux其实更多是了解怎么使用Reactor的API，下面我们来看看~

Reactor是一个响应式流，它也有对应的发布者(Publisher )，Reactor的发布者用两个类来表示：

- Mono(返回0或1个元素)
- Flux(返回0-n个元素)

而订阅者则是Spring框架去完成


1. Spring提供了完整的支持响应式的服务端技术栈。
    如下图所示，左侧为基于spring-webmvc的技术栈，右侧为基于spring-webflux的技术栈，- Spring WebFlux是基于响应式流的，因此可以用来建立异步的、非阻塞的、事件驱动的服务。它采用Reactor作为首选的响应式流的实现库，不过也提供了对RxJava的支持。
    - 由于响应式编程的特性，Spring WebFlux和Reactor底层需要支持异步的运行环境，比如Netty和Undertow；也可以运行在支持异步I/O的Servlet 3.1的容器之上，比如Tomcat（8.0.23及以上）和Jetty（9.0.4及以上）。
    - 从图的纵向上看，spring-webflux上层支持两种开发模式：
      类似于Spring WebMVC的基于注解（@Controller、@RequestMapping）的开发模式；
    - Java 8 lambda 风格的函数式开发模式。
    - Spring WebFlux也支持响应式的Websocket服务端开发。


2. 响应式Http客户端 
   
    此外，Spring WebFlux也提供了一个响应式的Http客户端API WebClient。它可以用函数式的方式异步非阻塞地发起Http请求并处理响应。其底层也是由Netty提供的异步支持。
    我们可以把WebClient看做是响应式的RestTemplate，与后者相比，前者：
    
    - 是非阻塞的，可以基于少量的线程处理更高的并发；
    - 可以使用Java 8 lambda表达式；
    - 支持异步的同时也可以支持同步的使用方式；
    - 可以通过数据流的方式与服务端进行双向通信。

Spring Framework 中包含的原始 Web 框架 Spring Web MVC 是专门为 Servlet API 和 Servlet 容器构建的。反应式堆栈 Web 框架 Spring WebFlux 是在 5.0 版的后期添加的。它是完全非阻塞的，支持反应式流(Reactive Stream)背压，并在Netty，Undertow和Servlet 3.1 +容器等服务器上运行。

![](https://img-blog.csdnimg.cn/img_convert/a07973cc0b1fc58382d8fefdfe5f1683.png)

- **编程模型**：Spring 5 web 模块包含了 Spring WebFlux 的 HTTP 抽象。类似 Servlet API , WebFlux 提供了 WebHandler API 去定义非阻塞 API 抽象接口。可以选择以下两种编程模型实现：

  - 注解控制层。和 MVC 保持一致，WebFlux 也支持响应性 @RequestBody 注解。

  - 功能性端点。基于 lambda 轻量级编程模型，用来路由和处理请求的小工具。和上面最大的区别就是，这种模型，全程控制了请求 - 响应的生命流程

- **内嵌容器**：跟 Spring Boot 大框架一样启动应用，但 WebFlux 默认是通过 Netty 启动，并且自动设置了默认端口为 8080。另外还提供了对 Jetty、Undertow 等容器的支持。开发者自行在添加对应的容器 Starter 组件依赖，即可配置并使用对应内嵌容器实例。

  但是要注意，必须是 Servlet 3.1+ 容器，如 Tomcat、Jetty；或者非 Servlet 容器，如 Netty 和 Undertow。

- **Starter 组件**：Spring Boot Webflux 提供了很多 “开箱即用” 的 Starter 组件



Spring WebFlux 是一个异步非阻塞式 IO 模型，通过少量的容器线程就可以支撑大量的并发访问。底层使用的是 Netty 容器，这点也和传统的 SpringMVC 不一样，SpringMVC 是基于 Servlet 的。

> 接口的响应时间并不会因为使用了 WebFlux 而缩短，服务端的处理结果还是得由 worker 线程处理完成之后再返回给前端。



【spring-webmvc + Servlet + Tomcat】命令式的、同步阻塞的

【spring-webflux + Reactor + Netty】响应式的、异步非阻塞的



webflux的关键是自己编写的代码里面返回流（Flux/Mono），spring框架来负责处理订阅。 spring框架提供2种开发模式来编写响应式代码，使用mvc之前的注解模式和使用router function模式，都需要我们的代码返回流，spring的响应式数据库spring data jpa，如使用mongodb，也是返回流，订阅都需要交给框架，自己不能订阅。

spring框架提供2种开发模式来编写响应式代码，使用mvc之前的注解模式和使用router function模式，都需要我们的代码返回流，spring的响应式数据库spring data jpa，如使用mongodb，也是返回流，订阅都需要交给框架，自己不能订阅



## 调试

在响应式编程中，调试是块难啃的骨头，这也是从命令式编程到响应式编程的切换过程中，学习曲线最陡峭的地方。

在命令式编程中，方法的调用关系摆在面上，我们通常可以通过stack trace追踪的问题出现的位置。但是在异步的响应式编程中，一方面有诸多的调用是在水面以下的，作为响应式开发库的使用者是不需要了解的；另一方面，基于事件的异步响应机制导致stack trace并非很容易在代码中按图索骥的。



------



## Reactive Redis

底层框架是Lettuce

ReactiveRedisTemplate与RedisTemplate使用类似，但它提供的是异步的，响应式Redis交互方式。

这里再强调一下，响应式编程是异步的，ReactiveRedisTemplate发送Redis请求后不会阻塞线程，当前线程可以去执行其他任务。

等到Redis响应数据返回后，ReactiveRedisTemplate再调度线程处理响应数据。

响应式编程可以通过优雅的方式实现异步调用以及处理异步结果，正是它的最大的意义。



### Redis异步

说到Redis的通信，我们都知道Redis基于RESP(Redis Serialization Protocol)协议来通信，并且通信方式是`停等模型`，也就说一次通信独占一个连接直到client读取到返回结果之后才能释放该连接让其他线程使用。

这里小伙伴们思考一下，针对Redis客户端，我们能否使用异步通信方式呢？首先要理解这里讨论的异步到底是指什么，这里的异步就是能够让client端在等待Redis服务端返回结果的这段时间内不再阻塞死等，而是可以继续干其他事情。

针对异步，其实有两种实现思路，一种是类似于dubbo那样使用`单连接+序列号（标识单次通信）`的通信方式，另外一种是类似于netty client那样直接基于`Reactor模型`来做。*注意：方式一的底层通信机制一般也是基于Reactor模型，client端不管是什么处理方式，对于redis server端来说是无感知的。*

https://zhuanlan.zhihu.com/p/77328969



https://subscription.packtpub.com/book/programming/9781788995979/5/ch05lvl1sec40/spring-mvc-versus-webflux

![img](https://static.packt-cdn.com/products/9781788995979/graphics/d2af6e5b-5d26-448d-b54c-64b42d307736.png)





- Mono：实现发布者，并返回 0 或 1 个元素，即单对象。

- Flux：实现发布者，并返回 N 个元素，即 List 列表对象。



#### WebHandler

```java
public interface WebHandler {
 /**
 * Handle the web server exchange.
 * @param exchange the current server exchange
 * @return {@code Mono<Void>} to indicate when request handling is complete
 */
    Mono<Void> handle(ServerWebExchange exchange);
}
```

在这里，说明一下HttpHandler与WebHandler的区别，两者的设计目标不同。前者主要针对的是跨HTTP服务器，即付出最小的代价在各种不同的HTTP服务器上保证程序正常运行。于是我们在前面的章节中看到了为适配Reactor Netty而进行的ReactorHttpHandlerAdapter类相关实现。而后者则侧重于提供构建常用Web应用程序的基本功能。例如，我们可以在上面的WebHandler源码中看到handle方法传入的参数是ServerWebExchange类型的，通过这个类型参数，我们所定义的WebHandler组件不仅可以访问请求（ServerHttpRequest getRequest）和响应（ServerHttpResponse getResponse），也可以访问请求的属性（Map<String, Object> getAttributes）及会话的属性，还可以访问已解析的表单数据（Form data）、多部分数据（Multipart data）等。



#### DispatcherHandler

```java
public class DispatcherHandler implements WebHandler, ApplicationContextAware {
 @Nullable
 private List<HandlerMapping> handlerMappings;

 @Nullable
 private List<HandlerAdapter> handlerAdapters;

 @Nullable
 private List<HandlerResultHandler> resultHandlers;
    ...
 @Override
 public void setApplicationContext(ApplicationContext applicationContext) {
 initStrategies(applicationContext);
    }
 protected void initStrategies(ApplicationContext context) {
 Map<String, HandlerMapping> mappingBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
                context, HandlerMapping.class, true, false);

 ArrayList<HandlerMapping> mappings = new ArrayList<>(mappingBeans.values());
        AnnotationAwareOrderComparator.sort(mappings);
 this.handlerMappings = Collections.unmodifiableList(mappings);

 Map<String, HandlerAdapter> adapterBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
                context, HandlerAdapter.class, true, false);

 this.handlerAdapters = new ArrayList<>(adapterBeans.values());
        AnnotationAwareOrderComparator.sort(this.handlerAdapters);

 Map<String, HandlerResultHandler> beans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
                context, HandlerResultHandler.class, true, false);

 this.resultHandlers = new ArrayList<>(beans.values());
        AnnotationAwareOrderComparator.sort(this.resultHandlers);
    }
    ...
}
```

Spring WebFlux 为了适配我们在 Spring MVC 中养成的开发习惯，围绕熟知的Controller进行了相应的适配设计，其中有一个WebHandler实现类DispatcherHandler(如下代码所示)，是请求处理的调度中心，实际处理工作则由可配置的委托组件执行。该模型非常灵活，支持多种工作流程。

换句话说，DispatcherHandler就是HTTP请求相应处理器（handler）或控制器（controller）的中央调度程序。DispatcherHandler会从Spring Configuration中发现自己所需的组件，也就是它会从应用程序上下文中（application context）查找以下内容。

### 路由模式

Spring WebFlux包含一个轻量级的函数式编程模型，其中定义的函数可以对请求进行路由处理。请求也可以通过基于注解形式的路由模式进行处理。







### 原理

首先，WebFlux是Spring的响应式框架，基于Reactor和Netty。那底层原理应该包括它的异步非阻塞模型、Reactor库的使用、Netty的处理流程，以及和传统Servlet的区别。

#### 一、异步非阻塞 I/O 模型

1. **与传统 Servlet 的对比**
   - Spring MVC：基于 Servlet 的同步阻塞模型，每个请求占用一个线程，线程在等待 I/O（如数据库操作）时会被阻塞，导致高并发场景下线程资源耗尽。
   - WebFlux：采用异步非阻塞 I/O，通过 Reactor 库和 Netty 的事件驱动机制，单线程可处理多个请求。线程仅在数据就绪时被唤醒处理，避免资源浪费。
2. **事件循环（EventLoop）**
   - WebFlux 默认使用 Netty 作为服务器，其核心是 EventLoop 线程池（BossGroup 和 WorkerGroup）。BossGroup 负责接收连接，WorkerGroup 处理 I/O 事件（如 HTTP 请求解析）。
   - 处理逻辑通过回调机制实现，例如在 Netty 的 `HttpServerHandle`中，当请求到达时触发 `onStateChange`方法，将请求交给 Reactor 的响应式流处理。

#### 二、响应式编程与 Reactor 库

1. **Reactive Streams 规范**
   - WebFlux 基于 Reactive Streams 规范，通过 Publisher-Subscriber模型实现数据流的异步处理，支持**背压（Backpressure）**机制，防止生产者压垮消费者。
   - 核心类：
     - **Flux**：处理 0-N 个元素的异步序列（如分页查询结果流）。
     - Mono：处理 0-1 个元素的异步序列（如单条数据库查询）。
2. **线程切换与调度**
   - 默认情况下，WebFlux 的请求处理在 Netty 的 I/O 线程中执行。若业务逻辑耗时较长（如 CPU 密集型操作），需通过 `publishOn` 或 `subscribeOn` 切换到自定义线程池，避免阻塞 I/O 线程。
   - 示例：使用 `Schedulers.elastic()` 或 `Schedulers.parallel()`管理线程池。

#### 三、核心处理流程

1. **请求处理链路**
   - Netty 接收请求：Netty 的 `HttpServerOperations` 封装请求和响应对象，触发状态变更事件（如 `REQUEST_RECEIVED`）。
   - Handler 处理：请求通过 `ReactorHttpHandlerAdapter` 转发至 WebFlux 的 `DispatcherHandler`，匹配路由并调用 Controller 方法。
   - 响应式流传递：Controller 返回 `Flux`/`Mono`对象，数据流经过滤器链（如 `WebFilter`）后，由 Netty 异步写入响应。
2. **背压实现**
   - 当消费者处理速度慢于生产者时，通过 `Subscription.request(n)` 控制数据拉取速率。例如，数据库查询结果流分批推送，避免内存溢出





## References

- https://docs.spring.io/spring-framework/reference/web-reactive.html
- [vivo互联网技术-深入剖析 Spring WebFlux](https://mp.weixin.qq.com/s?__biz=MzI4NjY4MTU5Nw==&mid=2247492039&idx=2&sn=eec30ff895a29e608fdafe78c626115d&chksm=ebdb9155dcac1843580ec28b8c31e334eb8aeb0a10573b5f3d4e7e8aaaec49893772399790a9&cur_album_id=1612326847164284932&scene=189#wechat_redirect)
- http://www.dre.vanderbilt.edu/~schmidt/PDF/reactor-siemens.pdf
- https://blog.51cto.com/u_12206475/3118309
- https://blog.51cto.com/u_12206475/3118303
- https://blog.csdn.net/qq_33371766/article/details/123642687