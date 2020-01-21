## 1. Spring是什么

- Spring 是一个开源框架

- Spring 为简化企业级应用开发而生，使用 Spring 可以使简单的 JavaBean实现以前只有 EJB 才能实现的功能

- Spring 是一个 IOC(DI) 和 AOP 容器框架

具体描述 Spring

- 轻量级：Spring 是非侵入性的 - 基于 Spring 开发的应用中的对象可以不依赖于 Spring 的 API
- 依赖注入(DI --- dependency injection、IOC)
- 面向切面编程(AOP --- aspect oriented programming)
- 容器: Spring 是一个容器, 因为它包含并且管理应用对象的生命周期
- 框架: Spring 实现了使用简单的组件配置组合成一个复杂的应用. 在 Spring 中可以使用 XML 和 Java 注解组合这些对象
-  一站式：在 IOC 和 AOP 的基础上可以整合各种企业应用的开源框架和优秀的第三方类库（实际上 Spring 自身也提供了展现层的 SpringMVC和 持久层的 Spring JDBC）

Spring的核心是**控制反转**（IOC）和**面向切面**（AOP）

## 2. Spring特点

1. 方便解耦，简化开发：通过IOC容器，将对象之间的依赖关系交给Spring控制，避免编码过度耦合
2. AOP编程的支持：面向切面编程，解决传统OOP难以解决的问题
3. 声明式事物的支持
4. 方便程序的测试：对Junit4的完美支持，方便通过注解@Test进行测试
5. 方便整合集成各种优秀框架
6. 降低Java EE API的使用难度  
7. 其源代码是经典学习案例

## 3. Spring 模块

![](../_images/Spring/spring-overview.png)

Spring 框架是一个分层架构，由 7 个定义良好的模块组成：

### Core Container

核心容器由`Spring - Core`、`Spring -bean`、`Spring -context`、`Spring -context-support`和`Spring - Expression` (Spring表达式语言)模块组成 。 `spring-core`和`spring-beans`模块提供了框架的基本功能，包括IoC和依赖项注入特性。其主要组件是BeanFactory，它是工厂模式的实现。BeanFactory使用控制反转模式将程序的配置和依赖性规范与实际的应用程序代码分开

### AOP

通过配置管理特性， `spring-aop` 模块直接将面向切面的编程功能集成到了 Spring 框架中

### Aspects

独立的`spring-aspects`模块提供了与AspectJ的集成 

### Instrumentation

`spring-instrument` 模块提供了类检测支持和类加载器实现，以在某些应用程序服务器中使用 ，  `spring-instrument-tomcat`包含Tomcat的Spring检测代理 

### Messaging

 `spring-messaging` 模块包含从 `Message`，`MessageChannel`，`MessageHandler` 等其他基于消息的基础应用中得到的抽象。该模块还包含一系列的注解来讲消息映射到方法上，和SpringMVC注解类似 

### Data Access/Integration

 数据访问/集成 由JDBC、ORM、OXM、JMS和 Transaction 模块组成 

`spring-jdbc`提供JDBC抽象层 ，使我们从繁重的JDBC编程中解脱出来，并且不再需要为解析不同的数据库的异常而烦恼。

`spring-tx`支持对所有 POJO 和实现了特定接口的类进行编程式和申明式事务管理。

`spring-orm`整合了流行的 ORM 应用程序接口，包括JPA、JDO和Hibernate。使用该模块我们可以任意使用这些ORM框架和Spring的其他功能（如上面的申明式事务管理）进行组合。

`spring-oxm`为 OXM 的实现提供抽象层，如 JAXB、Castor、XMLBeans、JiBX 和XStream。

`spring-jms` 是Java消息服务，包含产生和接受消息 。Spring Framework 4.1将它并入在`spring-messaging` 模块。

### Web

Web层由`spring-web`、`spring-webmvc`、`spring-websocket`和`spring-webmvc-portlet` 模块组成 

`spring-web` 包含基本的面向网络的集成特性，如文件分部上传，使用Servet监听器和面向网络的应用上下文初始化IoC容器。他还包括 HTTP 客户端和网络相关的 Spring远程支持。

`spring-webmvc` 也被成为 *Web-Servlet* 模块，包含Spring的模型-视图-控制器（model-view-controller，[*MVC*](http://docs.spring.io/spring/docs/4.3.0.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#mvc-introduction)) 和 REST Web Services。 Spring MVC 框架是得实体模型代码和网络表单清楚地分离开来，还可以轻松集成Spring框架的其他特性。

`spring-webmvc-portlet` 也被称为 *Web-Portlet* 模块，在Portlet 容器中实现MVC，并且能使用`spring-webmvc` 模块的功能

### Test

`spring -test`模块支持使用JUnit或TestNG对Spring组件进行单元测试和集成测试 



《Spring 揭秘》中的Spring框架总体结构

![](../_images/Spring/spring-tree.png)





官方文档： https://docs.spring.io/spring/docs/4.3.26.RELEASE/spring-framework-reference/htmlsingle/ 