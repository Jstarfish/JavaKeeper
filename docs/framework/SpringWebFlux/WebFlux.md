---
title: Spring WebFlux
date: 2023-05-23
tags: 
 - Spring
categories: Spring
---

![](https://img.starfish.ink/spring/springwebflux-banner.svg)

> WebFlux 到底是个什么，主要用于解决什么问题，有什么优势和劣势
>
> 哪些场景或者业务适用于 WebFlux



要了解 WebFlux ，首先得知道什么是响应式编程，什么是 Reactice

WebFlux

支持很高的并发量

- 目前不支持关系型数据库

## 概念

先循序渐进的了解几个概念



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



### 响应式编程

有了 Reactive Streams 这种标准和规范，利用规范可以进行响应式编程。

> 或者叫 反应式编程，这是微软为了应对 **高并发环境下** 的服务端编程，提出的一个实现 **异步编程** 的方案。

响应式编程（reactive programming）是一种基于数据流（data stream）和变化传递（propagation of change）的声明式（declarative）的编程范式

![](https://img-blog.csdnimg.cn/img_convert/92e5f1d2718e8e952ddcd160e819fad1.png)

意思大概如下：

- 在命令式编程(我们的日常编程模式)下，式子 `a=b+c`，这就意味着 `a`的值是由 `b` 和 `c` 计算出来的。如果 `b` 或者 `c` 后续有变化，不会影响到 `a` 的值
- 在响应式编程下，式子 `a:=b+c`，这就意味着 `a` 的值是由 `b` 和 `c` 计算出来的。但如果 `b` 或者 `c` 的值后续有变化，会影响到 `a` 的值

我认为上面的例子已经可以帮助我们理解变化传递（propagation of change）





有了 Reactive Streams 这种标准和规范，利用规范可以进行响应式编程。那再了解下什么是 Reactive programming 响应式编程。响应式编程是基于异步和事件驱动的非阻塞程序，只是垂直通过在 JVM 内启动少量线程扩展，而不是水平通过集群扩展。

> 就像一个项目中，我们不是加人，而是让少量的人去干更多的活

这就是一个编程范例，具体项目中如何体现呢？

响应式项目编程实战中，通过基于 Reactive Streams 规范实现的框架 Reactor 去实战。Reactor 一般提供两种响应式 API ：

- Mono：实现发布者，并返回 0 或 1 个元素
- Flux：实现发布者，并返回 N 个元素



### Spring Webflux

Spring Boot Webflux 就是基于 Reactor 实现的。Spring Boot 2.0 包括一个新的 spring-webflux 模块。该模块包含对响应式 HTTP 和 WebSocket 客户端的支持，以及对 REST，HTML 和 WebSocket 交互等程序的支持。一般来说，Spring MVC 用于同步处理，Spring Webflux 用于异步处理。

Spring Boot Webflux 有两种编程模型实现，一种类似 Spring MVC 注解方式，另一种是使用其功能性端点方式。





> https://docs.spring.io/spring-framework/reference/web-reactive.html

![](https://img.starfish.ink/spring/spring-framework-doc.png)



特性：

- **响应式 API**：Reactor 框架是 Spring Boot Webflux 响应库依赖，通过 Reactive Streams 并与其他响应库交互。提供了 两种响应式 API：Mono 和 Flux。一般是将 Publisher 作为输入，在框架内部转换成 Reactor 类型并处理逻辑，然后返回 Flux 或 Mono 作为输出。

![spring mvc and webflux venn](https://docs.spring.io/spring-framework/reference/_images/spring-mvc-and-webflux-venn.png)

- **编程模型**：Spring 5 web 模块包含了 Spring WebFlux 的 HTTP 抽象。类似 Servlet API , WebFlux 提供了 WebHandler API 去定义非阻塞 API 抽象接口。可以选择以下两种编程模型实现：

  - 注解控制层。和 MVC 保持一致，WebFlux 也支持响应性 @RequestBody 注解。

  - 功能性端点。基于 lambda 轻量级编程模型，用来路由和处理请求的小工具。和上面最大的区别就是，这种模型，全程控制了请求 - 响应的生命流程

- **内嵌容器**：跟 Spring Boot 大框架一样启动应用，但 WebFlux 默认是通过 Netty 启动，并且自动设置了默认端口为 8080。另外还提供了对 Jetty、Undertow 等容器的支持。开发者自行在添加对应的容器 Starter 组件依赖，即可配置并使用对应内嵌容器实例。

  但是要注意，必须是 Servlet 3.1+ 容器，如 Tomcat、Jetty；或者非 Servlet 容器，如 Netty 和 Undertow。

- **Starter 组件**：Spring Boot Webflux 提供了很多 “开箱即用” 的 Starter 组件





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







## 参考

- https://docs.spring.io/spring-framework/reference/web-reactive.html