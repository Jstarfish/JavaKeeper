---
title: Spring框架面试题大全
date: 2024-12-15
tags: 
 - Spring
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> Spring框架作为Java生态系统的**核心基础设施**，是每个Java开发者必须掌握的技术栈。从简单的IOC容器到复杂的微服务架构，从传统的SSM到现代的响应式编程，Spring技术栈的深度和广度决定了开发者的职业高度。
>
>
> Spring 面试，围绕着这么几个核心方向准备：
>
> - **Spring Framework核心**（IOC容器、依赖注入、Bean生命周期、AOP编程）
> - **Spring Boot自动配置**（Starter机制、条件装配、外部化配置、Actuator监控）  
> - **Spring MVC请求处理**（DispatcherServlet、HandlerMapping、视图解析、异常处理）
> - **Spring事务管理**（声明式事务、传播行为、隔离级别、事务失效问题）
> - **Spring Data数据访问**（Repository模式、分页查询、事务管理、多数据源）
> - **Spring Security安全框架**（认证授权、JWT集成、CSRF防护、方法级安全）
> - **Spring Cloud微服务**（服务注册发现、配置中心、熔断降级、网关路由）



## 🗺️ 知识导航

### 🏷️ 核心知识分类

1. **🏗️ Spring Framework核心**：IOC容器、依赖注入、Bean生命周期、作用域、循环依赖、BeanFactory vs ApplicationContext
2. **🎯 AOP面向切面编程**：AOP概念、代理模式、通知类型、切点表达式、AspectJ集成、动态代理 vs CGLIB
3. **🌐 Spring MVC架构**：请求处理流程、DispatcherServlet、HandlerMapping、视图解析、参数绑定、异常处理
4. **🚀 Spring Boot核心特性**：自动配置原理、Starter机制、条件装配、外部化配置、Actuator监控、打包部署
5. **💾 数据访问与事务**：Spring Data、事务管理、传播行为、隔离级别、事务失效、多数据源、分页查询
6. **🔒 Spring Security安全**：认证授权流程、SecurityContext、JWT集成、CSRF防护、方法级安全、OAuth2集成
7. **☁️ Spring Cloud微服务**：服务注册发现、配置中心、熔断降级、API网关、链路追踪、分布式事务
8. **📝 注解与配置**：常用注解、JavaConfig、Profile管理、属性注入、条件装配、自定义注解
9. **🔧 高级特性与实践**：事件机制、国际化、缓存抽象、任务调度、WebSocket、响应式编程
10. **🎯 面试重点与实践**：设计模式、性能优化、最佳实践、常见陷阱、Spring vs SpringBoot、整体架构设计

### 🔑 面试话术模板

| **问题类型** | **回答框架**                          | **关键要点**                 | **深入扩展**                     |
| ------------ | ------------------------------------- | ---------------------------- | -------------------------------- |
| **概念解释** | 定义→核心特性→工作原理→应用场景       | 准确定义，突出核心价值       | 源码分析，设计思想，最佳实践     |
| **原理分析** | 背景问题→解决方案→实现机制→优势劣势   | 图解流程，关键步骤           | 底层实现，性能考量，扩展机制     |
| **技术对比** | 相同点→差异点→适用场景→选择建议       | 多维度对比，实际场景         | 性能差异，实现复杂度，维护成本   |
| **实践应用** | 业务场景→技术选型→具体实现→踩坑经验   | 实际项目案例，代码示例       | 性能优化，监控运维，故障处理     |
| **架构设计** | 需求分析→技术选型→架构设计→实施方案   | 系统思考，全局视角           | 可扩展性，高可用，一致性保证     |

---

## 🏗️ 一、Spring Framework核心

**核心理念**：通过IOC控制反转和AOP面向切面编程，实现松耦合、高内聚的企业级应用开发框架。

### 🎯 使用 **Spring** 框架能带来哪些好处?

1. **简化开发**：Spring 框架通过高度的 **抽象** 和 **自动化配置**，大大简化了 Java 开发，减少了开发者手动编写大量配置代码的需要。
   - **依赖注入（DI）**：Spring 提供了 **依赖注入**（DI）机制，通过 `@Autowired` 或构造器注入，自动管理组件之间的依赖关系，减少了代码的耦合性，提高了可维护性。

   - **面向切面编程（AOP）**：Spring 提供了 **AOP** 功能，使得日志记录、安全控制、事务管理等横切关注点的代码能够与业务逻辑分离，降低了系统的复杂度。

2. **松耦合架构**：Spring 提供了 **松耦合的架构**，通过 **依赖注入** 和 **接口/抽象类**，让组件之间的依赖关系松散，方便了模块的解耦和扩展。

   - 通过 **依赖注入（DI）**，组件之间的依赖不再通过硬编码连接，而是由 Spring 容器管理，依赖关系在运行时通过配置注入。

   - Spring 提供了丰富的 **接口** 和 **抽象**，让开发者可以轻松替换和扩展功能。

3. **更好的可维护性和可测试性**

   - **依赖注入**：使得组件之间的依赖关系通过容器进行管理，从而更容易进行单元测试。可以通过 **Mocking** 或 **Stubbing** 来模拟依赖项，方便进行单元测试。

   - **分层架构支持**：Spring 提供的服务和 DAO 层可以更加清晰地进行分层，使得系统结构更加清晰，便于维护。

   - **事务管理**：Spring 提供了声明式事务管理，方便进行数据库操作的事务控制，降低了编码复杂度，同时提高了事务管理的灵活性。

4. **集成性强**：Spring 的另一个关键优势是其 **良好的集成能力**。Spring 提供了许多与常见技术框架的集成，包括：

   - **JPA、Hibernate、MyBatis** 等持久化框架的集成。

   - **Spring Security**：提供强大的安全框架，支持身份验证、授权控制等功能。

   - **Spring MVC**：可以与不同的 Web 框架（如 JSP、Freemarker、Thymeleaf）以及 RESTful 风格的接口进行集成。

   - **Spring Boot**：让构建、部署 Spring 应用更加便捷，简化了 Spring 项目的配置和启动。

5. **事务管理**：Spring 提供了 **声明式事务管理**，可以通过 `@Transactional` 注解来实现事务的管理，避免了手动管理事务的麻烦，并且支持多种事务传播机制和隔离级别。

6. **Spring Boot 提升开发效率**：Spring Boot 是 Spring 的子项目，旨在简化 Spring 应用的配置和部署。它提供了以下优点：

   - **自动配置**：Spring Boot 自动配置了很多常见的功能，如数据库连接、Web 配置、消息队列等，减少了手动配置的工作量。

   - **内嵌 Web 容器**：Spring Boot 提供了内嵌的 Tomcat、Jetty 等 Web 容器，可以将应用打包成独立的 JAR 或 WAR 文件，便于部署和运行。

   - **快速开发**：Spring Boot 提供了大量的默认配置和开箱即用的功能，可以快速启动项目，并减少了配置和开发的时间。



### 🎯 Spring有哪些优点？

- **轻量级**：Spring在大小和透明性方面绝对属于轻量级的，基础版本的Spring框架大约只有2MB。
- **控制反转(IOC)**：Spring使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象。
- **面向切面编程(AOP)**：Spring支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来。
- **容器**：Spring包含并管理应用程序对象的配置及生命周期。
- **MVC框架**：Spring的web框架是一个设计优良的web MVC框架，很好的取代了一些web框架。
- **事务管理**：Spring对下至本地业务上至全局业务(JAT)提供了统一的事务管理接口。
- **异常处理**：Spring提供一个方便的API将特定技术的异常(由JDBC, Hibernate, 或JDO抛出)转化为一致的、Unchecked异常。



### 🎯 什么是Spring框架？核心特性有哪些？

Spring是一个开源的企业级Java应用开发框架，由Rod Johnson创建，目标是简化企业级应用开发。

**核心特性包括**：

**1. IOC控制反转**：
- 对象创建和依赖关系管理交给Spring容器
- 通过依赖注入实现松耦合架构
- 提高了代码的可测试性和可维护性

**2. AOP面向切面编程**：
- 将横切关注点从业务逻辑中分离
- 支持声明式事务、日志、安全等
- 基于动态代理和CGLIB实现

**3. 轻量级容器**：
- 非侵入式设计，POJO即可
- 容器启动快，内存占用少
- 可以选择性使用框架功能

**4. 一站式解决方案**：
- 提供完整的企业级技术栈
- 良好的框架集成能力
- Spring Boot、Spring Cloud等生态丰富

**💻 代码示例**：
```java
// IOC容器基本使用
@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User findById(Long id) {
        return userRepository.findById(id);
    }
}

// AOP切面示例  
@Aspect
@Component
public class LoggingAspect {
    @Around("@annotation(Log)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - start;
        System.out.println("Method executed in: " + executionTime + "ms");
        return result;
    }
}
```

### 🎯 什么是IOC？依赖注入的实现原理是什么？

IoC（Inverse of Control:控制反转）是一种**设计思想**，就是 **将原本在程序中手动创建对象的控制权，交由Spring框架来管理。** IoC 在其他语言中也有应用，并非 Spring 特有。 **IoC 容器是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个Map（key，value）,Map 中存放的是各种对象。**

**IoC 的核心思想**

在传统的编程中，程序中会有显式的代码来创建对象并管理它们的生命周期。IoC 则通过将这些控制权交给容器，让容器在适当的时机创建对象，并根据需要注入对象的依赖项。

将对象之间的相互依赖关系交给 IoC 容器来管理，并由 IoC 容器完成对象的注入。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。 **IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。** 在实际项目中一个 Service 类可能有几百甚至上千个类作为它的底层，假如我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IoC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。

"IOC全称Inversion of Control，即控制反转，是Spring框架的核心思想：

**传统模式 vs IOC模式**：

- **传统模式**：对象主动创建和管理依赖对象（我找你）
- **IOC模式**：对象被动接受外部注入的依赖（你找我）
- **控制权反转**：从对象内部转移到外部容器

**IoC 的实现原理**

IoC 的实现方式通常有几种，其中最常见的是 **依赖注入（Dependency Injection，DI）**。

1. **依赖注入（DI）**：IoC 的实现通常是通过依赖注入来完成的。依赖注入是一种设计模式，用于将对象的依赖关系从外部传入，而不是由对象本身来创建或查找依赖的对象。

   - **构造器注入**：通过构造函数将依赖项传递给对象。
   - **Setter 注入**：通过设置器方法传递依赖项。
   - **接口注入**：对象实现某个接口，容器通过该接口提供依赖项。

   **依赖注入（DI,Dependency Injection）是在编译阶段尚未知所需的功能是来自哪个的类的情况下，将其他对象所依赖的功能对象实例化的模式**。

2. **控制反转容器**：IoC 通常通过容器来实现，容器负责对象的创建、初始化、管理生命周期，并在需要时注入依赖项。常见的 IoC 容器有 Spring（Java）、Unity（.NET）、Guice（Java）、Dagger（Java/Kotlin）等。

**IoC 的好处**「列举 IoC 的一些好处」

- **解耦**：对象之间不需要直接依赖，可以让系统更容易扩展和维护。
- **易于测试**：通过容器，可以方便地替换依赖项，进行单元测试时可以使用模拟对象（Mock Object）来替代真实对象。
- **灵活性**：IoC 容器提供了配置和管理对象依赖关系的能力，可以灵活配置依赖项，而不需要改变代码。

> **IoC（控制反转）** 是一种设计原则，其核心思想是将对象创建和依赖关系的管理交给外部容器来控制，避免程序内部直接创建和管理依赖对象，从而解耦系统中的各个组件。常见的 IoC 实现方式是依赖注入（DI），通过构造器注入、Setter 注入或接口注入等方式来实现对象的依赖关系注入。IoC 容器负责管理对象的生命周期和依赖注入，常见的框架如 Spring 在 Java 中就使用了 IoC 原理来实现松耦合的系统设计。IoC 可以提高系统的可测试性、可维护性和灵活性，是现代软件架构中常用的设计思想。

**💻 代码示例**：
```java
// 构造器注入（推荐）
@Service
public class OrderService {
    private final PaymentService paymentService;
    private final InventoryService inventoryService;
    
    public OrderService(PaymentService paymentService, 
                       InventoryService inventoryService) {
        this.paymentService = paymentService;
        this.inventoryService = inventoryService;
    }
}

// Setter注入
@Service
public class UserService {
    private EmailService emailService;
    
    @Autowired
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```



### 🎯 什么是 Spring IOC 容器？

Spring IoC（Inverse of Control，控制反转）容器是Spring框架的核心组件，它负责管理应用程序中的对象（称为Bean）。IoC容器通过控制反转的方式，将组件的创建、配置和依赖关系管理从应用程序代码中分离出来，由容器来处理。

IoC容器的主要功能包括：

1. **依赖注入（DI）**：IoC容器能够自动注入Bean的依赖项，而不需要手动创建或查找这些依赖项。
2. **配置管理**：IoC容器使用配置元数据（如XML、注解或Java配置类）来创建和管理Bean。
3. **Bean生命周期管理**：IoC容器管理Bean的整个生命周期，包括实例化、初始化、使用和销毁。
4. **作用域控制**：IoC容器支持不同的Bean作用域，如单例（Singleton）、原型（Prototype）、请求（Request）、会话（Session）等。
5. **依赖关系解析**：IoC容器能够解析Bean之间的依赖关系，并根据配置自动组装这些Bean。
6. **事件发布和监听**：IoC容器支持事件驱动模型，允许Bean发布事件和监听其他Bean的事件。
7. **类型转换和数据绑定**：IoC容器提供类型转换服务，能够将配置数据绑定到Bean的属性上。
8. **自动装配**：IoC容器能够根据Bean的类型和名称自动装配依赖关系，减少显式配置的需要。
9. **扩展点**：IoC容器提供了多个扩展点，如BeanFactoryPostProcessor和BeanPostProcessor，允许开发者自定义容器的行为。

通过使用Spring IoC容器，开发者可以专注于业务逻辑的实现，而不必关心对象的创建和依赖管理，从而提高代码的可维护性、可测试性和灵活性。

> “Spring IoC 容器的主要功能包括对象的创建与生命周期管理、依赖注入（DI）、自动装配、bean 的作用域管理、AOP 支持、事件机制、资源管理与外部配置集成等。通过这些功能，Spring IoC 容器使得开发者能够更加灵活、高效地管理应用中的对象和它们之间的依赖关系，从而实现解耦、提高代码的可维护性和扩展性。”



### 🎯 Spring 中有多少种 IOC 容器？

Spring 中的 org.springframework.beans 包和 org.springframework.context 包构成了 Spring 框架 IoC 容器的基础。

在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前，必须对它进行实例化。只有在容器实例化后， 才可以从 IOC 容器里获取 Bean 实例并使用

Spring 提供了两种类型的 IOC 容器实现

- BeanFactory：IOC 容器的基本实现

- ApplicationContext：提供了更多的高级特性，是 BeanFactory 的子接口

BeanFactory 是 Spring 框架的基础设施，面向 Spring 本身；ApplicationContext 面向使用 Spring 框架的开发者，几乎所有的应用场合都直接使用 ApplicationContext 而非底层的 BeanFactory；

无论使用何种方式, 配置文件是相同的。



###  🎯 BeanFactory 和 ApplicationContext 区别？

在 Spring 框架中，`BeanFactory` 和 `ApplicationContext` 都是 IoC 容器的核心接口，它们都负责管理和创建 Bean，但它们之间有一些关键的区别。了解这些区别可以帮助你选择合适的容器类型，并正确使用它们。

- **BeanFactory**：是 Spring 最基础的容器，负责管理 Bean 的生命周期以及依赖注入。它提供了最基础的功能，通常用于内存或资源较为有限的环境中。
- **ApplicationContext**：是 `BeanFactory` 的一个子接口，扩展了 `BeanFactory` 的功能，提供了更多的企业级特性，如事件发布、国际化支持、AOP 支持等。`ApplicationContext` 是一个功能更为丰富的容器，通常在大多数 Spring 应用中使用。

| 功能/特性                  | **BeanFactory**                        | **ApplicationContext**                                       |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| **继承关系**               | `BeanFactory` 是最基本的容器接口。     | `ApplicationContext` 继承自 `BeanFactory`，并扩展了更多功能。 |
| **懒加载（Lazy Loading）** | 默认懒加载                             | 支持懒加载，容器启动时不会立即初始化所有的 Bean，直到真正需要它们时才初始化。 |
| **国际化支持**             | 不支持国际化。                         | 提供国际化支持，可以使用 `MessageSource` 进行消息的本地化。  |
| **事件机制**               | 不支持事件发布与监听。                 | 提供事件发布与监听机制，可以使用 `ApplicationEventPublisher` 发布和监听事件。 |
| **AOP 支持**               | 不支持 AOP                             | 支持 AOP（如事务管理、日志记录等）。                         |
| **注解驱动配置**           | 不支持自动扫描和注解驱动配置           | 支持注解驱动配置，支持 `@ComponentScan` 自动扫描组件。       |
| **Bean 定义的配置**        | 仅支持通过 XML 或 Java 配置来定义 Bean | 支持通过 XML、JavaConfig 或注解配置来定义 Bean。             |
| **刷新容器功能**           | 没有刷新容器的功能                     | 提供 `refresh()` 方法，可以刷新容器，重新加载配置文件和 Bean。 |

**常用的实现类**

- **BeanFactory 的实现类**：
  - `XmlBeanFactory`（已废弃）
  - `SimpleBeanFactory`
  - `DefaultListableBeanFactory`（最常用）
- **ApplicationContext 的实现类**：
  - `ClassPathXmlApplicationContext`：基于 XML 配置文件的上下文。
  - `AnnotationConfigApplicationContext`：基于注解配置的上下文。
  - `GenericWebApplicationContext`：适用于 Web 应用的上下文。

> “`BeanFactory` 是 Spring 最基本的容器接口，负责创建和管理 Bean，但它功能较为简洁，通常用于资源有限的环境。而 `ApplicationContext` 继承了 `BeanFactory`，并提供了更多企业级功能，如国际化支持、事件机制和 AOP 等。`ApplicationContext` 是大多数 Spring 应用中使用的容器，它具有更强的功能和灵活性。通常推荐使用 `ApplicationContext`，除非你有特定的性能或资源要求。”

```java
// BeanFactory基础用法
DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();
XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(beanFactory);
reader.loadBeanDefinitions("applicationContext.xml");
UserService userService = beanFactory.getBean(UserService.class);

// ApplicationContext用法（推荐）
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
UserService userService = context.getBean(UserService.class);

// 利用ApplicationContext的高级特性
@Component
public class EventPublisher implements ApplicationContextAware {
    private ApplicationContext applicationContext;
    
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }
    
    public void publishEvent(String message) {
        applicationContext.publishEvent(new CustomEvent(this, message));
    }
}
```



### 🎯 Spring IoC 的实现机制

Spring 中的 IoC 的实现原理就是工厂模式加反射机制，示例：

```java
interface Fruit {
     public abstract void eat();
}
class Apple implements Fruit {
    public void eat(){
        System.out.println("Apple");
    }
}
class Orange implements Fruit {
    public void eat(){
        System.out.println("Orange");
    }
}
class Factory {
    public static Fruit getInstance(String ClassName) {
        Fruit f = null;
        try {
            f=(Fruit)Class.forName(ClassName).newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return f;
    }
}
class Client {
    public static void main(String[] a) {
        Fruit f=Factory.getInstance("priv.starfish.spring.Apple");
        if(f!=null){
            f.eat();
        }
    }
}
```



### 🎯 什么是 JavaConfig？

“JavaConfig 是 Spring 提供的一种基于 Java 类的配置方式，它通过 `@Configuration` 注解标识配置类，通过 `@Bean` 注解声明 Bean。相较于传统的 XML 配置，JavaConfig 提供了类型安全、灵活的配置方式，支持注解和 Java 语言的优势，使得配置更加简洁、可维护，并且与其他框架集成更加方便。”



### 🎯 请举例说明如何在 **Spring** 中注入一个 **Java Collection**?

Spring 提供了以下四种集合类的配置元素:

- `<list>` : 该标签用来装配可重复的 list 值。
- `<set>` : 该标签用来装配没有重复的 set 值。
- `<map>`: 该标签可用来注入键和值可以为任何类型的键值对。
- `<props>` : 该标签支持注入键和值都是字符串类型的键值对。

```xml
<beans>
<!-- Definition for javaCollection -->
<bean id="javaCollection" class="com.howtodoinjava.JavaCollection">
      <!-- java.util.List -->
      <property name="customList">
        <list>
           <value>INDIA</value>
           <value>Pakistan</value>
           <value>USA</value>
           <value>UK</value>
        </list>
      </property>
     <!-- java.util.Set -->
     <property name="customSet">
        <set>
           <value>INDIA</value>
           <value>Pakistan</value>
           <value>USA</value>
           <value>UK</value>
        </set>
      </property>
     <!-- java.util.Map -->
     <property name="customMap">
        <map>
           <entry key="1" value="INDIA"/>
           <entry key="2" value="Pakistan"/>
           <entry key="3" value="USA"/>
           <entry key="4" value="UK"/>
</map>
    </property>
    <!-- java.util.Properties -->
    <property name="customProperies">
        <props>
            <prop key="admin">admin@nospam.com</prop>
            <prop key="support">support@nospam.com</prop>
        </props>
</property>
   </bean>
</beans>
```



### 🎯 什么是 Spring Beans？

- 它们是构成用户应用程序主干的对象
- Bean 由 Spring IoC 容器管理
- 它们由 Spring IoC 容器实例化，配置，装配和管理
- Bean 是基于用户提供给容器的配置元数据创建



### 🎯 Spring 提供了哪些配置方式？

- 基于 xml 配置

  bean 所需的依赖项和服务在 XML 格式的配置文件中指定。这些配置文件通常包含许多 bean 定义和特定于应用程序的配置选项。它们通常以 bean 标签开头。例如：

  ```xml
  <bean id="studentbean" class="org.edureka.firstSpring.StudentBean">
   <property name="name" value="Edureka"></property>
  </bean>
  ```

- 基于注解配置

  您可以通过在相关的类，方法或字段声明上使用注解，将 bean 配置为组件类本身，而不是使用 XML 来描述 bean 装配。默认情况下，Spring 容器中未打开注解装配。因此，您需要在使用它之前在 Spring 配置文件中启用它。例如：

  ```xml
  <beans>
  <context:annotation-config/>
  <!-- bean definitions go here -->
  </beans>
  ```

- 基于 Java API 配置

  Spring 的 Java 配置是通过使用 @Bean 和 @Configuration 来实现。

  1. @Bean 注解扮演与 `<bean/>` 元素相同的角色。
  2. @Configuration 类允许通过简单地调用同一个类中的其他 @Bean 方法来定义 bean 间依赖关系。

  ```java
  @Configuration
  public class StudentConfig {
      @Bean
      public StudentBean myStudent() {
          return new StudentBean();
      }
  }
  ```




### 🎯 通过注解的方式配置bean | 什么是基于注解的容器配置

**组件扫描**(component scanning): Spring 能够从 classpath下自动扫描, 侦测和实例化具有特定注解的组件。

特定组件包括:

- **@Component**：基本注解，标识了一个受 Spring 管理的组件
- **@Respository**：标识持久层组件
- **@Service**：标识服务层(业务层)组件
- **@Controller**： 标识表现层组件

对于扫描到的组件，Spring 有默认的命名策略：使用非限定类名，第一个字母小写。也可以在注解中通过 value 属性值标识组件的名称。

当在组件类上使用了特定的注解之后，还需要在 Spring 的配置文件中声明 `<context:component-scan>`：

- `base-package` 属性指定一个需要扫描的基类包，Spring 容器将会扫描这个基类包里及其子包中的所有类

- 当需要扫描多个包时, 可以使用逗号分隔

- 如果仅希望扫描特定的类而非基包下的所有类，可使用 `resource-pattern` 属性过滤特定的类，示例：

  ```xml
  <context:component-scan base-package="priv.starfish.front.web.controller"
  	annotation-config="true" resource-pattern="autowire/*.class"/>
  ```

  

### 🎯 Spring Bean的生命周期是怎样的？

Spring的核心概念之一是**依赖注入（Dependency Injection, DI）和控制反转（Inversion of Control, IoC）**，这两个概念帮助管理对象的生命周期和依赖关系。

在Spring中，**Bean**指的是由Spring IoC容器管理的对象。Bean的生命周期主要由以下几个阶段构成：

1. **实例化（Instantiation）：**Spring容器首先根据Bean定义创建Bean的实例。这个实例可以通过构造函数、工厂方法等方式创建。
2. **属性赋值（Populating Properties）：**在Bean实例化后，Spring会进行**依赖注入**。Spring根据Bean的定义，为这个实例注入所需的依赖，例如为属性赋值、调用`@Autowired`注解的方法等。
3. **初始化（Initialization）：**
   - 在完成属性赋值后，Spring会调用Bean的初始化方法。如果Bean实现了`InitializingBean`接口，Spring会调用其`afterPropertiesSet()`方法。此外，如果在Bean定义中指定了`init-method`，这个方法也会被调用。
   - 此外，如果Bean被声明为需要某个生命周期回调方法，比如`@PostConstruct`注解的回调方法，也会在此阶段执行。
4. **使用（Using the Bean）：**在Bean完成初始化后，它可以被应用程序使用。此时，Bean处于Spring容器的控制下，应用程序可以通过依赖注入获取并使用该Bean。
5. **销毁（Destruction）：**
   - 当Spring容器关闭时（例如应用程序上下文被关闭），Spring会销毁Bean。如果Bean实现了`DisposableBean`接口，Spring会调用其`destroy()`方法。此外，如果在Bean定义中指定了`destroy-method`，这个方法也会被调用。
   - 如果Bean使用了`@PreDestroy`注解，Spring也会在此阶段执行相应的方法。

**💻 代码示例**：

```java
@Component
public class LifecycleDemo implements BeanNameAware, InitializingBean, DisposableBean {
    
    private String beanName;
    
    public LifecycleDemo() {
        System.out.println("1. 构造器执行");
    }
    
    @Autowired
    public void setDependency(SomeDependency dependency) {
        System.out.println("2. 属性注入");
    }
    
    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        System.out.println("3. BeanNameAware回调：" + name);
    }
    
    @PostConstruct
    public void postConstruct() {
        System.out.println("4. @PostConstruct执行");
    }
    
    @Override
    public void afterPropertiesSet() {
        System.out.println("5. InitializingBean.afterPropertiesSet()");
    }
    
    @PreDestroy
    public void preDestroy() {
        System.out.println("6. @PreDestroy执行");
    }
    
    @Override
    public void destroy() {
        System.out.println("7. DisposableBean.destroy()");
    }
}
```



### 🎯 什么是 Spring 装配?

在 Spring 框架中，**装配（Wiring）**是指将一个对象的依赖关系注入到另一个对象中的过程。通过装配，Spring 容器能够自动管理对象之间的依赖关系，从而减少了应用程序中显式地创建和管理对象的代码。装配是 Spring IoC（控制反转）容器的核心概念之一，它使得 Spring 应用能够轻松地将不同的组件连接在一起，形成完整的应用程序。

**Spring 装配的类型**

Spring 提供了几种不同的方式来装配 Bean，主要包括以下几种：

1. **构造器注入（Constructor Injection）**
2. **Setter 注入（Setter Injection）**
3. **字段注入（Field Injection）**
4. **自动装配（Autowiring）**
5. **基于 XML 配置的装配**

> 依赖注入的本质就是装配，装配是依赖注入的具体行为。



### 🎯 什么是bean自动装配？

**Bean 自动装配（Bean Autowiring）** 是 Spring 框架中的一项重要功能，用于自动满足一个对象对其他对象的依赖。通过自动装配，Spring 容器能够根据配置的规则，将所需的依赖对象自动注入到目标 Bean 中，而无需手动显式定义依赖关系。这种机制极大地简化了依赖注入的过程，使代码更加简洁和易于维护。

在Spring框架有多种自动装配，让我们逐一分析

1. **no**：这是Spring框架的默认设置，在该设置下自动装配是关闭的，开发者需要自行在beanautowire属性里指定自动装配的模式

2. **byName**：**按名称自动装配（结合 `@Qualifier` 注解）**如果容器中有多个相同类型的 Bean，可以使用 `@Qualifier` 注解结合 `@Autowired` 来按名称指定具体的 Bean。

3. **byType**：按类型自动装配 (`@Autowired` 默认方式)

4. **constructor**：通过在构造器上添加 `@Autowired` 注解，Spring 会根据构造器参数的类型自动注入对应的 Bean。这种方式可以确保在对象创建时，所有依赖项都已完全注入。

5. **autodetect**：Spring首先尝试通过 *constructor* 使用自动装配来连接，如果它不执行，Spring 尝试通过 *byType* 来自动装配【Spring 4.x 中已经被废弃】

在自动装配时，Spring 会检查容器中的所有 Bean，并根据规则选择一个合适的 Bean 来满足依赖。如果找不到匹配的 Bean 或找到多个候选 Bean，可能会抛出异常。



### 🎯 自动装配有什么局限？

- 基本数据类型的值、字符串字面量、类字面量无法使用自动装配来注入。
- 装配依赖中若是出现匹配到多个bean（出现歧义性），装配将会失败



### 🎯 Spring Bean的作用域有哪些？如何选择？

"Spring支持多种Bean作用域，用于控制Bean的创建策略和生命周期：

**核心作用域**：

**1. singleton（单例，默认）**：
- 整个Spring容器中只有一个Bean实例
- 线程不安全，需注意并发访问
- 适用于无状态的服务层组件

**2. prototype（原型）**：
- 每次getBean()都创建新实例
- Spring不管理prototype Bean的完整生命周期
- 适用于有状态的Bean

**Web环境作用域**：

**3. request（请求作用域）**：
- 每个HTTP请求创建一个Bean实例
- 请求结束后实例被销毁
- 用于存储请求相关数据

**4. session（会话作用域）**：
- 每个HTTP Session创建一个实例
- Session失效后实例被销毁
- 用于存储用户会话数据

**5. application（应用作用域）**：
- 整个Web应用只有一个实例
- 绑定到ServletContext生命周期

**选择原则**：
- 无状态Bean → singleton
- 有状态Bean → prototype  
- Web数据 → request/session
- 全局共享 → application"

**💻 代码示例**：
```java
// 单例Bean（默认）
@Component
public class SingletonService {
    private int counter = 0; // 线程不安全！
    
    public void increment() {
        counter++;
    }
}

// 原型Bean
@Component
@Scope("prototype") 
public class PrototypeBean {
    private int counter = 0; // 每个实例独立
}

// 请求作用域
@Component
@RequestScope
public class RequestBean {
    private String requestId = UUID.randomUUID().toString();
}

// 会话作用域  
@Component
@SessionScope
public class UserSession {
    private String userId;
    private Map<String, Object> attributes = new HashMap<>();
}
```



### 🎯 Spring 框架中的单例 **Beans** 是线程安全的么?

> Spring 容器中的Bean是否线程安全，容器本身并没有提供Bean的线程安全策略，因此可以说Spring容器中的Bean本身不具备线程安全的特性，但是具体还是要结合具体scope的Bean去研究。
>
> 线程安全这个问题，要从单例与原型Bean分别进行说明。
>
> **「原型Bean」**对于原型Bean,每次创建一个新对象，也就是线程之间并不存在Bean共享，自然是不会有线程安全的问题。
>
> **「单例Bean」**对于单例Bean,所有线程都共享一个单例实例Bean,因此是存在资源的竞争。

在 Spring 框架中，单例（**Singleton**）Beans 默认是**线程不安全的**，这取决于 Bean 的内部状态以及是否对其进行了适当的同步和管理。具体来说，Spring 的 **单例作用域** 表示容器只会创建该 Bean 的单一实例并共享，但它并没有自动保证 Bean 实例本身的线程安全性。

1. 单例 Bean 线程安全问题的原因

   - **单例模式**意味着 Spring 容器会在应用启动时创建该 Bean 的唯一实例，并且整个应用程序生命周期内都会使用这个实例。因此，如果该 Bean 被多个线程共享并且内部状态是可变的（即 Bean 的属性值发生改变），则必须小心处理，以避免线程安全问题。

   - **线程不安全的实例**：如果单例 Bean 中的字段是可变的且没有正确同步，那么多个线程访问该 Bean 时，可能会出现竞态条件、脏读、写冲突等问题。

2. 单例 Bean 线程安全的几种情况

- 无状态的单例 Bean（线程安全）

  如果单例 Bean 没有任何可变的成员变量，或者所有成员变量都是不可变的（例如 `final` 类型或 `@Value` 注入的常量），则它是线程安全的，因为不同线程在访问该 Bean 时不会修改其状态。

  ```java
  @Component
  public class MyService {
      public String greet(String name) {
          return "Hello, " + name;
      }
  }
  ```

  在这个例子中，`MyService` 是无状态的，方法内部没有任何成员变量，因此多个线程可以同时调用该方法，而不会出现线程安全问题。

- 有状态的单例 Bean（非线程安全）

  如果单例 Bean 的某些字段是可变的，或者它们会随着方法调用而变化（例如，实例变量依赖于请求参数或其他外部因素），那么它可能会变得线程不安全。

  ```java
  @Component
  public class CounterService {
      private int counter = 0;
  
      public void increment() {
          counter++;  // 非线程安全操作
      }
  
      public int getCounter() {
          return counter;
      }
  }
  ```

  在这个例子中，`CounterService` 是有状态的，因为 `counter` 字段的值会根据 `increment()` 方法的调用而变化。如果多个线程同时调用 `increment()` 方法，可能会导致竞态条件（race condition），从而导致线程安全问题。

- 有状态的单例 Bean 的线程安全处理

  如果你的单例 Bean 是有状态的，且你需要在多线程环境中使用，可以自己来确保线程安全：比如同步方法、原子类等

> - **无状态的单例 Bean**：如果单例 Bean 没有可变状态（即没有实例字段或者所有字段都是 `final` 的），那么它是线程安全的。
> - **有状态的单例 Bean**：如果单例 Bean 的字段是可变的，且在多线程环境中可能会被同时访问，默认情况下它是**线程不安全的**。这种情况下，必须通过同步、原子类、或者 `ThreadLocal` 等技术来确保线程安全。
> - **Spring 不会自动为单例 Bean 提供线程安全机制**，开发者需要根据实际情况来保证线程安全性。

> “Spring 框架中的单例 Bean 默认情况下并不保证线程安全性。单例模式意味着同一个 Bean 实例会被多个线程共享，因此如果 Bean 有可变的状态（例如成员变量会在方法调用中发生变化），就可能导致线程安全问题。为了确保线程安全，我们可以使用同步机制、原子类或者 `ThreadLocal` 来保证在多线程环境中的安全访问。如果 Bean 是无状态的，那么它就是线程安全的。”



### 🎯 什么是循环依赖？Spring如何解决？

> 循环依赖是指 Bean 之间的相互依赖导致的创建死循环。Spring 通过 **三级缓存** 提前暴露半成品 Bean 的引用来解决单例 Bean 的循环依赖，支持 setter/field 注入。但构造器注入和 prototype Bean 的循环依赖无法解决，会报错。

**循环依赖**： 两个或多个 Bean 之间相互依赖，形成一个环。

- 例如：`A` 依赖 `B`,  `B` 又依赖 `A`

如果 Spring 不处理，就会在 Bean 创建过程中死循环，导致启动失败。

------

**Spring 解决循环依赖的机制**

Spring 默认支持 **单例 Bean 的循环依赖**（构造器注入除外）。核心依赖 **三级缓存机制**：

1. **singletonObjects**（一级缓存）：完成初始化的单例对象的 cache，这里的 bean 经历过 `实例化->属性填充->初始化` 以及各种后置处理
2. **earlySingletonObjects**（二级缓存）：存放提前曝光的“半成品” Bean（**完成实例化但是尚未填充属性和初始化**），仅仅能作为指针提前曝光，被其他 bean 所引用，用于解决循环依赖的
3. **singletonFactories**（三级缓存）：存放对象工厂（主要用于 AOP 代理提前暴露）

**解决流程：**

1. Spring 创建 Bean `A` → 实例化 `A`，但属性未注入
   - 把 `A` 的 **工厂对象（ObjectFactory）** 放入 **三级缓存**
2. `A` 需要注入 `B` → 创建 `B`
3. `B` 又需要 `A` → 从三级缓存找到 `A` 的工厂，拿到 `A` 的引用（可能是代理对象），放入二级缓存
4. `B` 完成创建 → 注入到 `A`
5. `A` 完成属性注入 → 移到一级缓存，删除二三级缓存中的引用

------

**注意点**

- **支持的情况**：
  - 单例 Bean + setter 注入 / field 注入（可以先实例化再填充属性）
- **不支持的情况**：
  - **构造器注入**循环依赖（因为对象还没实例化就要彼此依赖，没法提前暴露）
  - **prototype Bean**（因为原型 Bean 不走单例缓存机制）

```java
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    // 从 singletonObjects 获取实例，singletonObjects 中的实例都是准备好的 bean 实例，可以直接使用
    Object singletonObject = this.singletonObjects.get(beanName);
    //isSingletonCurrentlyInCreation() 判断当前单例bean是否正在创建中
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            // 一级缓存没有，就去二级缓存找
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                // 二级缓存也没有，就去三级缓存找
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    // 三级缓存有的话，就把他移动到二级缓存,.getObject() 后续会讲到
                    singletonObject = singletonFactory.getObject();
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return singletonObject;
}
```



### 🎯 为什么 Spring 要用三级缓存？二级缓存是不是就够了？

> 如果只考虑循环依赖，**二级缓存就能解决**；
>
> Spring 使用 **三级缓存** 是为了兼顾 **AOP 代理场景**，确保即使 Bean 被代理，依赖注入的也是同一个最终对象。

**二级缓存能解决吗？**

从“解决循环依赖”的角度看，其实 **二级缓存就够了**。

- 当 `A` 需要 `B`，`B` 又需要 `A`，Spring 可以把 `A` 的“半成品对象”直接放到二级缓存里（`earlySingletonObjects`），这样 `B` 在创建时就能拿到 `A` 的引用，从而解决循环依赖。

------

**为什么需要三级缓存？**

三级缓存的作用是为了 **支持 AOP 代理等场景**。

- 假如 `A` 是一个需要被代理的 Bean（比如加了 `@Transactional`），如果只用二级缓存：
  - `B` 注入的是原始的 `A` 对象（还没生成代理）
  - 之后 `A` 在 BeanPostProcessor 里生成了代理对象，但 `B` 已经持有了原始对象，最终导致依赖的不是同一个对象（代理失效）
- 所以 Spring 在三级缓存中放的不是对象本身，而是一个 **ObjectFactory**，可以在需要的时候返回真正的对象（原始的或者代理过的）。
  - `getEarlyBeanReference()` 会在 BeanPostProcessor 中执行，把原始对象包装成代理对象。
  - 这样保证了 `A` 和 `B` 拿到的都是最终的代理对象，而不是半成品。

---



## 🎯 二、AOP面向切面编程

**核心理念**：将横切关注点从业务逻辑中分离，实现关注点分离，提高代码的模块化程度。

### 🎯 什么是AOP？核心概念有哪些？

"AOP全称Aspect Oriented Programming，即面向切面编程，是对OOP的补充和扩展：

**AOP核心思想**：
- 将横切关注点（如日志、事务、安全）从业务逻辑中分离
- 通过动态代理技术实现方法增强
- 提高代码的模块化程度和可维护性

**核心概念**：

**1. 切面（Aspect）**：
- 横切关注点的模块化封装
- 包含切点和通知的组合
- 使用@Aspect注解定义

**2. 连接点（JoinPoint）**：
- 程序执行过程中能插入切面的点
- Spring AOP中特指方法执行点
- 包含方法信息、参数、目标对象等

**3. 切点（Pointcut）**：
- 匹配连接点的表达式
- 定义在哪些方法上应用通知
- 使用AspectJ表达式语言

**4. 通知（Advice）**：
- 在特定连接点执行的代码
- 包含前置、后置、环绕、异常、最终通知

**5. 目标对象（Target）**：
- 被通知的对象，通常是业务逻辑对象

**6. 织入（Weaving）**：
- 将切面应用到目标对象创建代理的过程
- Spring采用运行时织入"

**💻 代码示例**：
```java
@Aspect
@Component
public class LoggingAspect {
    
    // 定义切点
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}
    
    @Pointcut("@annotation(com.example.annotation.Log)")
    public void logAnnotation() {}
    
    // 前置通知
    @Before("serviceLayer()")
    public void beforeAdvice(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        System.out.println("方法执行前: " + methodName + ", 参数: " + Arrays.toString(args));
    }
    
    // 环绕通知
    @Around("logAnnotation()")
    public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long endTime = System.currentTimeMillis();
        System.out.println("方法执行耗时: " + (endTime - startTime) + "ms");
        return result;
    }
    
    // 异常通知
    @AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
    public void afterThrowingAdvice(JoinPoint joinPoint, Exception ex) {
        System.out.println("方法执行异常: " + ex.getMessage());
    }
}
```



### 🎯 AOP 有哪些实现方式？

实现 AOP 的技术，主要分为两大类：

- 静态代理 - 指使用 AOP 框架提供的命令进行编译，从而在编译阶段就可生成 AOP 代理类，因此也称为编译时增强；
  - 编译时编织（特殊编译器实现）
  - 类加载时编织（特殊的类加载器实现）。
- 动态代理 - 在运行时在内存中“临时”生成 AOP 动态代理类，因此也被称为运行时增强。
  - JDK 动态代理
  - CGLIB



### 🎯 Spring AOP 实现原理?

Spring AOP 的实现原理基于**动态代理**和**字节码增强**，其核心是通过在运行时生成代理对象，将横切逻辑（如日志、事务）织入目标方法中。以下是其实现原理的详细解析：

> `Spring`的`AOP`实现原理其实很简单，就是通过**动态代理**实现的。如果我们为`Spring`的某个`bean`配置了切面，那么`Spring`在创建这个`bean`的时候，实际上创建的是这个`bean`的一个代理对象，我们后续对`bean`中方法的调用，实际上调用的是代理类重写的代理方法。而`Spring`的`AOP`使用了两种动态代理，分别是**JDK的动态代理**，以及**CGLib的动态代理**。

### 🎯 Spring AOP的实现原理是什么？

"Spring AOP基于动态代理技术实现，根据目标对象的不同采用不同的代理策略：

一、**核心实现机制：动态代理**

Spring AOP 通过两种动态代理技术实现切面逻辑的织入：

1. **JDK 动态代理**

   - **适用条件**：目标对象实现了至少一个接口。

   - **适用条件**：目标对象实现了接口

   - **实现原理**：基于 `java.lang.reflect.Proxy` 类生成代理对象，代理类实现目标接口并重写方法。

   - 关键源码：

     ```java
     Proxy.newProxyInstance(ClassLoader, interfaces, InvocationHandler);
     ```

     在  `InvocationHandler#invoke()` 方法中拦截目标方法，执行切面逻辑（如前置通知、后置通知）。

   - **代理方式**：生成接口的实现类作为代理

   - **优点**：JDK内置，无需额外依赖

   - **缺点**：只能代理接口方法

2. **CGLIB 动态代理**

   - **适用条件**：目标对象未实现接口。

   - **实现原理**：基于ASM字节码操作，通过继承目标类生成子类代理，覆盖父类方法并插入切面逻辑。

   - 关键源码：

     ```java
     Enhancer enhancer = new Enhancer();
     enhancer.setSuperclass(targetClass);
     enhancer.setCallback(MethodInterceptor);
     ```

     在 `MethodInterceptor#intercept()` 方法中实现方法拦截

   - **代理方式**：生成目标类的子类作为代理

   - **优点**：可以代理普通类

   - **缺点**：无法代理final类和方法

代理创建流程**：

1. Spring检查目标对象是否实现接口
2. 有接口→JDK动态代理，无接口→CGLIB代理
3. 创建代理对象，织入切面逻辑
4. 返回代理对象供客户端使用

**方法调用流程**：

1. 客户端调用代理对象方法
2. 代理拦截方法调用
3. 执行前置通知
4. 调用目标对象方法
5. 执行后置通知
6. 返回结果给客户端

**强制使用CGLIB**：

- @EnableAspectJAutoProxy(proxyTargetClass=true)
- 或配置spring.aop.proxy-target-class=true"

**💻 代码示例**：

```java
// 目标接口和实现（会使用JDK动态代理）
public interface UserService {
    void saveUser(String username);
}

@Service
public class UserServiceImpl implements UserService {
    @Override
    public void saveUser(String username) {
        System.out.println("保存用户: " + username);
    }
}

// 无接口的类（会使用CGLIB代理）
@Service
public class OrderService {
    public void createOrder(String orderId) {
        System.out.println("创建订单: " + orderId);
    }
}

// 强制使用CGLIB
@Configuration
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class AopConfig {
}

// 代理工厂使用示例
public class ProxyFactoryDemo {
    public void testProxy() {
        ProxyFactory factory = new ProxyFactory();
        factory.setTarget(new UserServiceImpl());
        factory.addAdvice(new MethodInterceptor() {
            @Override
            public Object invoke(MethodInvocation invocation) throws Throwable {
                System.out.println("方法调用前");
                Object result = invocation.proceed();
                System.out.println("方法调用后");
                return result;
            }
        });
        
        UserService proxy = (UserService) factory.getProxy();
        proxy.saveUser("张三");
    }
}
```

> | **特性**     | **JDK 动态代理**                                             | **CGLIB 动态代理**                                           |
> | ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
> | **底层技术** | 基于 Java 反射机制，通过 `Proxy` 类和 `InvocationHandler` 接口生成代理类。 | 基于 **ASM 字节码框架**，通过生成目标类的子类实现代理。      |
> | **代理方式** | 只能代理实现了接口的类，生成接口的代理类。                   | 可代理普通类（无需接口），生成目标类的子类覆盖方法。         |
> | **性能**     | 方法调用通过反射实现，性能较低。                             | 通过 **FastClass 机制** 直接调用方法，性能更高（以空间换时间）。 |
> | **代码生成** | 运行时动态生成代理类的字节码。                               | 生成目标类的子类字节码，修改原始类结构。                     |
> | **适用场景** | 代理接口实现类，适用于轻量级应用。                           | 代理无接口的类，适用于高性能需求场景（如 Spring AOP）。      |
> | **优点**     | 1. 无需第三方库依赖；2. 代码简单易用。                       | 1. 支持代理普通类和 final 方法；2. 性能更高（FastClass 机制）。 |
> | **缺点**     | 1. 只能代理接口；2. 反射调用性能较低。                       | 1. 生成代理类耗时较长；2. 可能破坏类封装性（如代理 final 方法需特殊处理）。 |



### 🎯 Spring AOP的通知类型有哪些？

"Spring AOP提供了五种通知类型，分别在方法执行的不同时机生效：

**通知类型详解**：

**1. @Before 前置通知**：
- 在目标方法执行前执行
- 不能阻止目标方法执行
- 适用于参数校验、权限检查

**2. @AfterReturning 返回后通知**：

- 在目标方法正常返回后执行
- 可以访问方法返回值
- 适用于结果处理、缓存更新

**3. @AfterThrowing 异常通知**：
- 在目标方法抛出异常后执行
- 可以访问异常信息
- 适用于异常处理、错误记录

**4. @After 最终通知**：
- 无论方法正常还是异常都会执行
- 类似finally块的作用
- 适用于资源清理

**5. @Around 环绕通知**：
- 包围目标方法执行
- 功能最强大，可控制是否执行目标方法
- 适用于性能监控、事务控制

**执行顺序**：
- 正常流程：@Around前 → @Before → 目标方法 → @AfterReturning → @After → @Around后
- 异常流程：@Around前 → @Before → 目标方法 → @AfterThrowing → @After → @Around后"

**💻 代码示例**：
```java
@Aspect
@Component
public class AdviceTypeDemo {
    
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}
    
    @Before("serviceLayer()")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println("1. 前置通知：方法执行前");
    }
    
    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void afterReturningAdvice(JoinPoint joinPoint, Object result) {
        System.out.println("2. 返回后通知：方法正常返回，结果=" + result);
    }
    
    @AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
    public void afterThrowingAdvice(JoinPoint joinPoint, Exception ex) {
        System.out.println("3. 异常通知：方法抛出异常，异常=" + ex.getMessage());
    }
    
    @After("serviceLayer()")
    public void afterAdvice(JoinPoint joinPoint) {
        System.out.println("4. 最终通知：无论正常还是异常都执行");
    }
    
    @Around("serviceLayer()")
    public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("5. 环绕通知：方法执行前");
        try {
            Object result = joinPoint.proceed(); // 调用目标方法
            System.out.println("6. 环绕通知：方法执行后");
            return result;
        } catch (Exception e) {
            System.out.println("7. 环绕通知：捕获异常");
            throw e;
        }
    }
}
```



### 🎯 切点表达式怎么写？

"切点表达式使用AspectJ语法，用于精确匹配连接点，Spring AOP主要支持execution表达式：

**execution表达式语法**：
```
execution([修饰符] 返回值类型 [类名].方法名(参数列表) [throws 异常])
```

**通配符说明**：
- `*`：匹配任意字符（除了包分隔符.）
- `..`：匹配任意数量的参数或包层级
- `+`：匹配子类型

**常用表达式模式**：

**1. 方法级别匹配**：
- `execution(* com.example.service.UserService.findById(..))`
- 匹配UserService类的findById方法

**2. 类级别匹配**：
- `execution(* com.example.service.UserService.*(..))`
- 匹配UserService类的所有方法

**3. 包级别匹配**：
- `execution(* com.example.service.*.*(..))`
- 匹配service包下所有类的所有方法

**4. 递归包匹配**：
- `execution(* com.example.service..*.*(..))`
- 匹配service包及子包下所有类的所有方法

**其他切点指示符**：
- `@annotation`：匹配标注了指定注解的方法
- `@within`：匹配标注了指定注解的类
- `args`：匹配参数类型
- `target`：匹配目标对象类型
- `this`：匹配代理对象类型"

**💻 代码示例**：
```java
@Aspect
@Component
public class PointcutExpressionDemo {
    
    // 匹配所有public方法
    @Pointcut("execution(public * *(..))")
    public void publicMethods() {}
    
    // 匹配Service层所有方法
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {}
    
    // 匹配返回值为String的方法
    @Pointcut("execution(String com.example..*.*(..))")
    public void stringMethods() {}
    
    // 匹配单个参数为String的方法
    @Pointcut("execution(* com.example..*.*(String))")
    public void stringParameterMethods() {}
    
    // 匹配第一个参数为String的方法
    @Pointcut("execution(* com.example..*.*(String,..))")
    public void firstStringParameterMethods() {}
    
    // 匹配标注了@Transactional的方法
    @Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")
    public void transactionalMethods() {}
    
    // 匹配Controller类中的所有方法
    @Pointcut("@within(org.springframework.stereotype.Controller)")
    public void controllerMethods() {}
    
    // 组合切点表达式
    @Pointcut("serviceLayer() && !stringMethods()")
    public void serviceLayerExceptString() {}
    
    @Before("publicMethods() && args(username)")
    public void beforePublicMethodWithUsername(String username) {
        System.out.println("调用public方法，用户名参数: " + username);
    }
}

// 自定义注解示例
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Log {
    String value() default "";
}

@Service
public class UserService {
    @Log("查询用户")
    public User findById(String id) {
        return new User(id);
    }
}
```



### 🎯 Spring AOP and AspectJ AOP 有什么区别？

- Spring AOP 基于动态代理方式实现，AspectJ 基于静态代理方式实现。
- Spring AOP 仅支持方法级别的 PointCut；提供了完全的 AOP 支持，它还支持属性级别的 PointCut。



### 🎯 你有没有⽤过Spring的AOP? 是⽤来⼲嘛的? ⼤概会怎么使⽤？		

Spring AOP 主要用于以下几个方面：

1. **日志记录**：在方法执行前后自动记录日志。
2. **性能监控**：在方法执行前后记录时间，监控性能。
3. **事务管理**：在方法执行前后自动管理事务。
4. **安全检查**：在方法执行前检查用户权限。
5. **缓存**：在方法执行后缓存结果以提高性能。
6. **异常处理**：在方法执行时统一处理异常。



### 🎯 过滤器和拦截器的区别？

**过滤器（Filter）**

- 作用：过滤器主要用于对请求和响应进行预处理和后处理。它可以在请求到达 Servlet 之前和响应返回客户端之前对请求和响应进行修改。

- 使用场景

  - **请求和响应的编码转换**：例如，将所有请求和响应的编码设置为 UTF-8。

  - **权限检查**：例如，检查用户是否已经登录，如果没有登录，则重定向到登录页面。

  - **日志记录**：记录每个请求的详细信息。

  - **过滤非法请求**：例如，过滤掉一些恶意的请求。

- **实现方式**

  过滤器是基于 Servlet API 的，通常需要实现 `javax.servlet.Filter` 接口，并在 web.xml 文件中配置或使用注解进行配置。

**拦截器（Interceptor）**

- **作用**：拦截器用于在请求进入控制器（Controller）之前和离开控制器之后进行处理。它主要用于处理控制器层面的逻辑，如方法调用之前的验证、方法调用之后的日志记录等。

- **使用场景**：

  - **权限验证**：例如，检查用户是否具有访问某个控制器方法的权限。

  - **日志记录**：记录每个方法调用的详细信息。

  - **事务管理**：在方法调用之前开启事务，方法调用之后提交或回滚事务。

  - **数据预处理**：在方法调用之前准备数据，在方法调用之后处理返回的数据。

- **实现方式**

  拦截器通常与框架（如 Spring MVC）集成，使用框架提供的接口进行配置和实现。例如，在 Spring MVC 中，拦截器需要实现 `HandlerInterceptor` 接口，并在配置文件或注解中进行配置。

| 特点     | 过滤器（Filter）                            | 拦截器（Interceptor）                                        |
| -------- | ------------------------------------------- | ------------------------------------------------------------ |
| 作用范围 | 对请求和响应进行预处理和后处理              | 对控制器方法的调用进行预处理和后处理                         |
| 使用场景 | 请求和响应的编码转换、权限检查、日志记录等  | 权限验证、日志记录、事务管理等                               |
| 实现方式 | 实现 `javax.servlet.Filter` 接口            | 实现框架提供的拦截器接口（如 Spring 的 `HandlerInterceptor`） |
| 配置方式 | 配置在 web.xml 文件中或使用注解             | 配置在框架的配置文件或使用注解                               |
| 执行时机 | 在请求到达 Servlet 之前和响应返回客户端之前 | 在控制器方法调用之前和之后                                   |



---

## 🌐 三、Spring MVC架构

**核心理念**：基于MVC设计模式的Web框架，提供灵活的请求处理和视图渲染机制。

### 🎯 Spring MVC 框架有什么用？

Spring Web MVC 框架提供 **模型-视图-控制器** 架构和随时可用的组件，用于开发灵活且松散耦合的 Web 应用程序。 MVC 模式有助于分离应用程序的不同方面，如输入逻辑，业务逻辑和 UI 逻辑，同时在所有这些元素之间提供松散耦合。



### 🎯 Spring MVC的优点

- 可以支持各种视图技术，而不仅仅局限于JSP
- 与Spring框架集成（如IoC容器、AOP等）
- 清晰的角色分配：前端控制器(dispatcherServlet) ，请求到处理器映射（handlerMapping)，处理器适配器（HandlerAdapter)， 视图解析器（ViewResolver）
- 支持各种请求资源的映射策略



### 🎯 Spring MVC 的整体架构和核心组件？

> Spring MVC 的架构以 `DispatcherServlet` 为核心，负责请求的调度和分发，通过 `HandlerMapping` 找到具体的控制器方法，控制器方法执行后返回 `ModelAndView`，并通过 `ViewResolver` 渲染视图。这样的架构使得 Web 应用中的请求处理过程更加清晰和模块化。

**Spring MVC** 是一个基于 Servlet 的 Web 框架，它遵循了 **MVC（Model-View-Controller）设计模式**，将应用程序的不同功能分离，增强了应用的可维护性、可扩展性和解耦性。Spring MVC 是 Spring Framework 中的一部分，提供了一个灵活的请求处理流程和 Web 层的解决方案。

**Spring MVC 的整体架构**

Spring MVC 架构是基于请求驱动的模式，处理请求的过程分为以下几个关键步骤：

1. **DispatcherServlet（前端控制器）**：
   - Spring MVC 的核心组件之一，所有的 HTTP 请求都首先会进入 `DispatcherServlet`。它作为前端控制器（Front Controller），接收客户端请求并将请求分发给合适的处理器。
   - `DispatcherServlet` 从 web.xml 中进行配置，通常是 Web 应用的入口。
2. **HandlerMapping（处理器映射器）**：
   - `HandlerMapping` 的作用是根据请求的 URL 找到相应的处理器（Controller）。
   - 它会将 URL 映射到相应的处理方法上，`HandlerMapping` 通过查找配置文件中定义的映射关系来决定哪个控制器方法应该处理当前请求。
3. **Controller（控制器）**：
   - 控制器是业务逻辑的核心，负责处理具体的请求并返回一个视图。
   - `@Controller` 注解定义了一个控制器类，而方法上通常使用 `@RequestMapping` 或者更细粒度的注解（如 `@GetMapping`、`@PostMapping`）来映射请求。
4. **HandlerAdapter（处理器适配器）**：
   - `HandlerAdapter` 的作用是根据 `HandlerMapping` 返回的控制器和方法，选择合适的适配器来调用相应的业务逻辑。
   - 它是为了支持不同类型的控制器而设计的，通常会选择具体的适配器，如 `HttpRequestHandlerAdapter` 或 `AnnotationMethodHandlerAdapter`。
5. **ViewResolver（视图解析器）**：
   - `ViewResolver` 负责根据控制器返回的视图名（例如 JSP 文件名）解析出具体的视图对象（如 `InternalResourceViewResolver`）。
   - 它根据视图名称将其解析为一个实际的视图，比如 JSP 或 Thymeleaf 模板。
6. **ModelAndView（模型与视图）**：
   - `ModelAndView` 是控制器方法返回的对象，它包含了模型数据和视图名称。
   - `Model` 存储控制器执行后的数据，`View` 则指向具体的视图模板。
7. **View（视图）**：
   - 视图组件负责将模型数据渲染成用户可以查看的页面，常见的视图技术包括 JSP、Thymeleaf、FreeMarker 等。



### 🎯 Spring MVC 的运行流程?

在整个 Spring MVC 框架中， DispatcherServlet 处于核心位置，负责协调和组织不同组件以完成请求处理并返回响应的工作

SpringMVC 处理请求过程：

> 1. **DispatcherServlet**接收请求，委托给 HandlerMapping；
> 2. HandlerMapping 匹配处理器（Controller），返回 HandlerExecutionChain；
> 3. 调用 HandlerAdapter 执行 Controller 方法，返回 ModelAndView；
> 4. ViewResolver 解析视图，渲染响应结果。

1. **请求接收与分发**
   - 入口：用户通过浏览器发送 HTTP 请求，所有请求首先到达 `DispatcherServlet`（前端控制器），它是整个流程的统一入口。
   - 核心作用：`DispatcherServlet` 负责接收请求并协调后续处理流程，类似“调度中心”。
2. **处理器映射（HandlerMapping）**
   - 查找处理器：`DispatcherServlet` 调用 `HandlerMapping` 组件，根据请求的 URL 路径匹配对应的处理器（Controller 或其方法）。例如，带有 `@RequestMapping`注解的方法会被识别为 Handler。
   - 返回执行链：`HandlerMapping` 返回 `HandlerExecutionChain`，包含目标处理器及关联的拦截器（Interceptor）。
3. **处理器适配（HandlerAdapter）**
   - 适配调用：`DispatcherServlet` 通过 `HandlerAdapter` 调用处理器方法。HandlerAdapter 负责将 Servlet 的请求参数转换为处理器方法的输入，并执行具体业务逻辑。
   - 返回值处理：处理器返回 `ModelAndView` 对象，包含模型数据（Model）和视图名称（View）。
4. **视图解析与渲染**
   - 视图解析器：`DispatcherServlet` 将逻辑视图名传递给 `ViewResolver`，解析为具体的视图对象（如 JSP、Thymeleaf 模板）。
   - 数据渲染：视图对象将模型数据填充到请求域，生成响应内容（如 HTML），最终由 DispatcherServlet 返回客户端。
5. **异常处理**
   - **异常捕获**：若处理过程中发生异常，DispatcherServlet 调用 **HandlerExceptionResolver** 组件处理，生成错误视图或 JSON 响应



### 🎯 Spring 的 Controller 是单例的吗？多线程情况下 Controller 是线程安全吗？

controller默认是单例的，不要使用非静态的成员变量，否则会发生数据逻辑混乱。正因为单例所以不是线程安全的

```java
@Controller
//@Scope("prototype")
public class ScopeTestController {

    private int num = 0;

    @RequestMapping("/testScope")
    public void testScope() {
        System.out.println(++num);
    }

    @RequestMapping("/testScope2")
    public void testScope2() {
        System.out.println(++num);
    }

}
```

我们首先访问 `http://localhost:8080/testScope`，得到的答案是`1`；
然后我们再访问 `http://localhost:8080/testScope2`，得到的答案是 `2`。

接下来我们再来给`controller`增加作用多例 `@Scope("prototype")`

我们依旧首先访问 `http://localhost:8080/testScope`，得到的答案是`1`；
然后我们再访问 `http://localhost:8080/testScope2`，得到的答案还是 `1`。

**单例是不安全的，会导致属性重复使用**。

**解决方案**

1. 不要在controller中定义成员变量
2. 万一必须要定义一个非静态成员变量时候，则通过注解@Scope(“prototype”)，将其设置为多例模式。
3. 在Controller中使用ThreadLocal变量



### 🎯 Spring MVC的工作原理是什么？

"Spring MVC基于前端控制器模式，以DispatcherServlet为核心协调各组件完成请求处理：

**完整请求处理流程**：

**1. 请求接收**：
- 用户发送HTTP请求到DispatcherServlet
- DispatcherServlet作为前端控制器接收所有请求
- 这是整个MVC流程的统一入口

**2. 处理器映射**：
- DispatcherServlet查询HandlerMapping
- HandlerMapping根据URL找到对应的Handler
- 返回HandlerExecutionChain（Handler + 拦截器链）

**3. 处理器适配**：
- DispatcherServlet通过HandlerAdapter调用Handler
- HandlerAdapter适配不同类型的处理器
- 支持@Controller、Controller接口等多种处理器

**4. 业务处理**：
- HandlerAdapter调用具体的Controller方法
- Controller执行业务逻辑，调用Service层
- 返回ModelAndView或@ResponseBody数据

**5. 异常处理**：
- 如果处理过程中出现异常
- HandlerExceptionResolver进行异常处理
- 返回错误视图或错误响应

**6. 视图解析**：
- ViewResolver解析逻辑视图名到具体视图
- 创建View对象用于渲染
- 对于@ResponseBody直接返回，跳过视图解析

**7. 视图渲染**：
- View渲染模型数据生成响应内容
- 将最终响应返回给客户端

**核心组件**：
- DispatcherServlet：前端控制器
- HandlerMapping：处理器映射器
- HandlerAdapter：处理器适配器
- Controller：控制器
- ViewResolver：视图解析器
- View：视图"

**💻 代码示例**：
```java
// 1. 控制器示例
@Controller
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // 返回视图
    @GetMapping
    public String listUsers(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        return "user/list"; // 逻辑视图名
    }
    
    // 返回JSON数据
    @GetMapping("/api/{id}")
    @ResponseBody
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    // 处理表单提交
    @PostMapping
    public String createUser(@ModelAttribute User user, 
                           RedirectAttributes redirectAttributes) {
        userService.save(user);
        redirectAttributes.addFlashAttribute("message", "用户创建成功");
        return "redirect:/users";
    }
}

// 2. 自定义HandlerMapping
@Component
public class CustomHandlerMapping extends AbstractHandlerMapping {
    
    @Override
    protected Object getHandlerInternal(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (path.startsWith("/custom/")) {
            return new CustomHandler();
        }
        return null;
    }
}

// 3. 自定义HandlerAdapter
@Component
public class CustomHandlerAdapter implements HandlerAdapter {
    
    @Override
    public boolean supports(Object handler) {
        return handler instanceof CustomHandler;
    }
    
    @Override
    public ModelAndView handle(HttpServletRequest request, 
                              HttpServletResponse response, 
                              Object handler) throws Exception {
        CustomHandler customHandler = (CustomHandler) handler;
        String result = customHandler.handleRequest(request);
        
        ModelAndView mv = new ModelAndView();
        mv.addObject("result", result);
        mv.setViewName("custom/result");
        return mv;
    }
}

// 4. 配置类
@Configuration
@EnableWebMvc
@ComponentScan("com.example.controller")
public class WebMvcConfig implements WebMvcConfigurer {
    
    // 配置视图解析器
    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
    
    // 配置拦截器
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoggingInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/static/**");
    }
    
    // 配置静态资源
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}

// 5. 拦截器示例
public class LoggingInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) {
        System.out.println("请求前置处理: " + request.getRequestURI());
        return true;
    }
    
    @Override
    public void postHandle(HttpServletRequest request, 
                          HttpServletResponse response, 
                          Object handler, 
                          ModelAndView modelAndView) {
        System.out.println("请求后置处理");
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler, 
                               Exception ex) {
        System.out.println("请求完成处理");
    }
}
```



### 🎯 @RequestMapping注解有哪些属性？

"@RequestMapping是Spring MVC最核心的注解，用于映射HTTP请求到处理方法：

| 属性             | 类型              | 作用                                                         |
| ---------------- | ----------------- | ------------------------------------------------------------ |
| **value / path** | `String[]`        | 指定请求的 URL 路径（别名关系，常用 `value`）。              |
| **method**       | `RequestMethod[]` | 限定请求方式，如 `GET`、`POST`、`PUT`、`DELETE` 等。         |
| **params**       | `String[]`        | 请求必须包含的参数条件（或不能包含），如 `params="id=1"`。   |
| **headers**      | `String[]`        | 请求必须包含的 Header 条件，如 `headers="Content-Type=application/json"`。 |
| **consumes**     | `String[]`        | 限定请求体（Content-Type），如 `consumes="application/json"`。 |
| **produces**     | `String[]`        | 限定响应体类型（Accept），如 `produces="application/json"`。 |
| **name**         | `String`          | 为映射起个名字，方便在工具或日志中区分。                     |

**简化注解**：
- @GetMapping = @RequestMapping(method = GET)
- @PostMapping = @RequestMapping(method = POST)
- @PutMapping = @RequestMapping(method = PUT)
- @DeleteMapping = @RequestMapping(method = DELETE)
- @PatchMapping = @RequestMapping(method = PATCH)"

**💻 代码示例**：
```java
@Controller
@RequestMapping("/api/users")
public class UserController {
    
    // 基本映射
    @RequestMapping("/list")
    public String listUsers() {
        return "users/list";
    }
    
    // 指定请求方法
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public String saveUser() {
        return "redirect:/api/users/list";
    }
    
    // 路径变量
    @RequestMapping("/detail/{id}")
    public String getUserDetail(@PathVariable Long id, Model model) {
        model.addAttribute("userId", id);
        return "users/detail";
    }
    
    // 参数限定
    @RequestMapping(value = "/search", params = {"name", "age"})
    public String searchUsers(@RequestParam String name, 
                             @RequestParam int age) {
        return "users/search-result";
    }
    
    // 请求头限定
    @RequestMapping(value = "/api/data", 
                   headers = {"Accept=application/json", "X-API-Version=1.0"})
    @ResponseBody
    public List<User> getApiData() {
        return userService.findAll();
    }
    
    // Content-Type限定
    @RequestMapping(value = "/api/users", 
                   method = RequestMethod.POST,
                   consumes = "application/json",
                   produces = "application/json")
    @ResponseBody
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
    
    // 使用简化注解
    @GetMapping("/api/users/{id}")
    @ResponseBody
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    @PostMapping(value = "/api/users", 
                consumes = MediaType.APPLICATION_JSON_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<User> createUserRest(@RequestBody @Valid User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    @PutMapping("/api/users/{id}")
    @ResponseBody
    public ResponseEntity<User> updateUser(@PathVariable Long id, 
                                          @RequestBody @Valid User user) {
        user.setId(id);
        User updatedUser = userService.update(user);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/api/users/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    // 复杂路径匹配
    @GetMapping("/files/**")
    public ResponseEntity<Resource> getFile(HttpServletRequest request) {
        String filePath = request.getRequestURI().substring("/files/".length());
        Resource resource = resourceLoader.getResource("classpath:static/" + filePath);
        return ResponseEntity.ok().body(resource);
    }
    
    // 正则表达式路径
    @GetMapping("/users/{id:[0-9]+}")
    @ResponseBody
    public User getUserByNumericId(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    // 矩阵变量
    @GetMapping("/users/{id}/books/{isbn}")
    @ResponseBody
    public Book getBook(@PathVariable Long id,
                       @PathVariable String isbn,
                       @MatrixVariable(name = "edition", pathVar = "isbn") String edition) {
        return bookService.findByIsbnAndEdition(isbn, edition);
    }
}
```


### 🎯 Spring MVC 如何处理跨域请求（CORS）？

- 配置 `@CrossOrigin`

  ```java
  @RestController
  @CrossOrigin(origins = "http://localhost:8080", maxAge = 3600)
  public class ApiController { ... }
  ```

- 或通过 `WebMvcConfigurer`全局配置：

  ```java
  @Configuration
  public class WebConfig implements WebMvcConfigurer {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
          registry.addMapping("/api/**").allowedOrigins("*");
      }
  }
  ```

  

---

## 🚀 四、Spring Boot核心特性

**核心理念**：约定大于配置，提供开箱即用的快速开发体验，简化Spring应用的搭建和部署。

### 🎯 什么是Spring Boot？解决了什么问题？

"Spring Boot是Spring团队提供的快速开发框架，旨在简化Spring应用的初始搭建和开发过程：

**Spring Boot 的特点（相比 Spring）**

1. **开箱即用**：几乎零配置，能快速启动应用。
2. **内嵌服务器**：内置 Tomcat/Jetty/Undertow，不需要单独部署 WAR 包。
3. **自动装配**：通过条件注解自动配置常用的 Bean，减少 XML 配置。
4. **约定大于配置**：合理的默认值，配置量大幅减少。
5. **外部化配置**：支持多环境（application-dev.yml、application-prod.yml）。
6. **与微服务天然结合**：与 Spring Cloud 无缝对接。
7. **依赖管理问题**：Spring Boot提供starter依赖，一键解决场景。内置版本仲裁，避免依赖冲突

**💻 代码示例**：

```java
// 传统Spring配置（复杂）
@Configuration
@EnableWebMvc
@EnableTransactionManagement
@ComponentScan("com.example")
public class WebConfig implements WebMvcConfigurer {
    
    @Bean
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setUsername("root");
        dataSource.setPassword("password");
        return dataSource;
    }
    
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
    
    // 还需要配置视图解析器、事务管理器等...
}

// Spring Boot方式（简洁）
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// application.yml配置即可
/*
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: password
*/
```

### 🎯说说 Spring Boot 和 Spring 的关系？

> Spring Boot 我理解就是把 spring spring mvc spring data jpa 等等的一些常用的常用的基础框架组合起来，提供默认的配置，然后提供可插拔的设计，就是各种 starter ，来方便开发者使用这一系列的技术，套用官方的一句话， spring 家族发展到今天，已经很庞大了，作为一个开发者，如果想要使用 spring 家族一系列的技术，需要一个一个的搞配置，然后还有个版本兼容性问题，其实挺麻烦的，偶尔也会有小坑出现，其实挺影响开发进度， spring boot 就是来解决这个问题，提供了一个解决方案吧，可以先不关心如何配置，可以快速的启动开发，进行业务逻辑编写，各种需要的技术，加入 starter 就配置好了，直接使用，可以说追求开箱即用的效果吧.

> 如果说 Spring 是一个家族，其实就是；它包含 spring core, spring mvc，spring boot与spring Cloud 等等；
>
> 那 spring boot 就像是这个家族中的大管家

Spring Boot 是 Spring 开源组织下的子项目，是 Spring 组件一站式解决方案，主要是简化了使用 Spring 的难度，简省了繁重的配置，提供了各种启动器，开发者能快速上手。

Spring Boot 主要有如下优点：

1. 容易上手，提升开发效率，为 Spring 开发提供一个更快、更广泛的入门体验。
2. 开箱即用，远离繁琐的配置。
3. 提供了一系列大型项目通用的非业务性功能，例如：内嵌服务器、安全管理、运行数据监控、运行状况检查和外部化配置等。
4. 没有代码生成，也不需要XML配置。
5. 避免大量的 Maven 导入和各种版本冲突。



### 🎯 Spring Boot 启动流程？

Spring Boot 的启动流程围绕 `SpringApplication.run()` 方法展开，分为 **初始化阶段、环境准备、上下文创建与刷新、自动配置** 等步骤。整体流程可概括为：

```wiki
启动类 main() → SpringApplication.run()
├─ 初始化阶段：推断应用类型、加载初始化器/监听器
├─ 环境准备：加载配置、创建监听器集合
├─ 上下文创建：实例化 ApplicationContext
├─ 上下文刷新：加载 Bean、自动配置、启动容器
└─ 后置处理：执行 Runner、发布完成事件
```

 **1. 初始化阶段（SpringApplication 构造）**

- 推断应用类型：通过类路径判断是 Web（Servlet/Reactive）或非 Web 应用，决定后续创建哪种 `ApplicationContext`

  （如web应用 `AnnotationConfigServletWebServerApplicationContext`、普通应用`AnnotationConfigApplicationContext`）。

- 加载初始化器与监听器：从 `META-INF/spring.factories` 加载 `ApplicationContextInitializer`（用于自定义上下文初始化逻辑）和 `ApplicationListener`（监听启动事件，如 `ConfigFileApplicationListener` 加载配置文件）。

- 确定主类：通过堆栈信息解析包含 `main()`的启动类，用于组件扫描。

**2. 环境准备（`run()` 方法前半段）**

> 不是指 `run()` 之外，而是指 `run()` 里 **在 ApplicationContext 创建之前**的部分

- 创建监听器集合：初始化 `SpringApplicationRunListeners`（如 `EventPublishingRunListener`），发布 `ApplicationStartingEvent`事件。
- 加载配置环境：
  - 构建 `ConfigurableEnvironment`，解析命令行参数和 `application.properties/yml`文件。
  - 通过 `EnvironmentPostProcessor` 扩展环境变量（如 `RandomValuePropertySource` 支持随机值）。
- 打印 Banner：加载并显示启动 Banner，支持自定义文本或图片。

**3. 上下文创建与刷新（核心阶段）**

**调用 `SpringApplication.run()` 方法**：

- 创建应用上下文：根据应用类型实例化 `ApplicationContext`（如 Web 应用使用 `AnnotationConfigServletWebServerApplicationContext`）。
- 准备上下文：关联环境变量、注册初始 Bean（如 `BeanDefinitionLoader` 加载启动类）。
- 刷新上下文（`ApplicationContext.refresh()` 方法）：
  1. 加载 Bean 定义：扫描 `@Component`、`@Configuration` 等注解，注册 Bean。
  2. 执行自动配置：通过 `@EnableAutoConfiguration` 加载 `spring.factories` 中的自动配置类（如 `DataSourceAutoConfiguration`），结合条件注解（`@ConditionalOnClass`）按需加载。
  3. 启动内嵌容器：Web 应用初始化 Tomcat/Jetty 服务器，监听端口
  4. 完成单例 Bean 初始化：调用 `finishBeanFactoryInitialization()` 实例化所有非懒加载的单例 Bean

**4. 后置处理与启动完成**

- 执行 Runner 接口：调用所有 `CommandLineRunner` 和 `ApplicationListener` ，执行启动后自定义逻辑（如初始化数据）。
- **发布完成事件**：触发 `ApplicationReadyEvent`，通知应用已就绪



### 🎯 `CommandLineRunner` 或 `ApplicationRunner`接口区别？

> “两个接口都是在 Spring Boot 启动完成后执行的，区别在于参数处理：`CommandLineRunner` 直接拿原始字符串数组，而 `ApplicationRunner` 对参数做了解析和封装，更适合处理复杂的启动参数。”

Spring Boot 提供了两个接口，用来在 **应用启动完成之后** 执行一些自定义逻辑：

**① 相同点**

- 都会在 `SpringApplication.run()` **上下文刷新完成**，Spring 容器准备就绪后执行。
- 都可以用 `@Order` 注解或者实现 `Ordered` 接口控制执行顺序。
- 常见应用场景：数据初始化、缓存预热、检查配置等。

**② 区别点**

- **CommandLineRunner**：`run(String... args)`，直接拿到命令行参数数组。
- **ApplicationRunner**：`run(ApplicationArguments args)`，对命令行参数进行了封装，支持更方便的解析（比如区分 option 参数和非 option 参数）。

举个例子：

- `--name=starfish foo bar`
  - 在 **CommandLineRunner** 里拿到的是 `["--name=starfish", "foo", "bar"]`
  - 在 **ApplicationRunner** 里，可以通过 `args.getOptionNames()` 拿到 `["name"]`，`args.getOptionValues("name")` 拿到 `["starfish"]`，而非 option 参数就是 `[foo, bar]`。

```java
@Component
public class MyCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        // 可以访问命令行参数args
    }
}
```

```java
@Component
public class MyApplicationRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 使用ApplicationArguments来处理命令行参数
    }
}
```

两者都是在Spring应用的`ApplicationContext`完全初始化之后，且所有的`@PostConstruct`注解的方法执行完毕后调用的。选择使用哪一个接口取决于你的具体需求，如果你只需要简单的命令行参数，`CommandLineRunner`可能就足够了。如果你需要更复杂的参数解析功能，那么`ApplicationRunner`会是更好的选择。在Spring Boot应用中，你可以同时使用这两个接口，它们并不互相排斥。



### 🎯 Spring Boot自动配置原理是什么？

> Spring Boot 相比 Spring 的最大特点是开箱即用、内嵌服务器和自动装配。
>  自动装配的原理是：启动类上的 `@SpringBootApplication` 启动了 `@EnableAutoConfiguration`，它通过 `AutoConfigurationImportSelector` 扫描 `spring.factories` 或 `spring-autoconfigure-metadata` 中的配置类，并结合条件注解（如 @ConditionalOnClass、@ConditionalOnMissingBean）来决定哪些 Bean 注入到容器中，从而实现按需自动配置。
>
> 核心机制：
>
> 1. `@SpringBootApplication`组合`@EnableAutoConfiguration`，扫描`META-INF/spring.factories`文件；
> 2. 根据类路径中的依赖（如`spring-boot-starter-web`）自动配置 Bean（如 Tomcat、MVC 组件）；
> 3. 可通过`application.properties/yaml`或`@Conditional`注解覆盖默认配置。

Spring Boot 自动配置（Auto-Configuration）是 Spring Boot 的核心特性之一，旨在根据项目中的依赖自动配置 Spring 应用。通过自动配置，开发者无需手动编写大量的配置代码，可以专注于业务逻辑的开发。其实现原理主要基于以下几个方面：

1. **启动类注解的复合结构**

   Spring Boot 应用通常使用 `@SpringBootApplication` 注解来启动，该注解本质上是以下三个注解的组合：

   - @SpringBootConfiguration：标识当前类为配置类，继承自 `@Configuration`，支持 Java Config 配置方式。

   - @ComponentScan：自动扫描当前包及其子包下的组件（如 `@Controller`、`@Service`等），将其注册为 Bean。

   - **@EnableAutoConfiguration**：**自动配置的核心入口**，通过 `@Import` 导入 `AutoConfigurationImportSelector` 类，触发自动配置流程

   ```java
   @SpringBootApplication
   public class MyApplication {
       public static void main(String[] args) {
           SpringApplication.run(MyApplication.class, args);
       }
   }
   -------------
   @Target(ElementType.TYPE)
   @Retention(RetentionPolicy.RUNTIME)
   @Documented
   @Inherited
   @SpringBootConfiguration
   @EnableAutoConfiguration
   @ComponentScan
   public @interface SpringBootApplication {
   }
   ```

2. **自动配置的触发机制**

   `@EnableAutoConfiguration` 通过 `AutoConfigurationImportSelector` 类加载配置：

   - 读取 `spring.factories` 文件：从所有依赖的 `META-INF/spring.factories` 文件中，查找 `org.springframework.boot.autoconfigure.EnableAutoConfiguration` 键值对应的全类名列表。

     ```
     # Auto Configure
     org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
     org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
     org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
     org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration,\
     ...
     ```

   - 条件化筛选配置类：通过条件注解（如 `@ConditionalOnClass`、`@ConditionalOnMissingBean`）过滤掉不满足当前环境的配置类，例如：

     - 类路径中缺少某个类时禁用相关配置（`@ConditionalOnClass`）。
     - 容器中已存在某个 Bean 时跳过重复注册（`@ConditionalOnMissingBean`）。

   - **加载有效配置类**：筛选后的配置类通过反射实例化，并注册到 Spring 容器中

3. **自动配置类的实现逻辑**

   自动配置类通常包含以下内容：

   - 条件注解控制：例如，`DataSourceAutoConfiguration` 仅在类路径存在 `javax.sql.DataSource` 时生效。

   - 默认 Bean 定义：通过 `@Bean` 方法定义默认组件（如 `JdbcTemplate`），开发者可通过配置文件覆盖默认值。

   - **外部化配置支持**：结合 `@ConfigurationProperties` 将 `application.properties` 中的属性注入到 Bean 中

4. **条件注解的作用**

   Spring Boot 提供丰富的条件注解，用于动态控制配置类的加载和 Bean 的注册：

   - @ConditionalOnClass：类路径存在指定类时生效。

   - @ConditionalOnMissingBean：容器中不存在指定 Bean 时生效。

   - @ConditionalOnProperty：根据配置文件属性值决定是否加载。
   - **@ConditionalOnWebApplication**：仅在 Web 应用环境下生效

5. **自动配置的优化与扩展**

- 按需加载：通过条件筛选避免加载未使用的组件，减少内存占用。
- 自定义 Starter：开发者可封装自定义 Starter，遵循相同机制（`spring.factories` \+ 条件注解）实现模块化自动配置。
- **配置文件优先级**：通过 `spring.autoconfigure.exclude` 显式排除不需要的自动配置类

Spring Boot 的自动配置本质上是 **基于约定和条件判断的 Bean 注册机制**，通过以下流程实现“开箱即用”：

```
启动类注解 → 加载 spring.factories → 条件筛选 → 注册有效 Bean
```

**💻 代码示例**：

```java
// 自动配置类示例
@Configuration
@ConditionalOnClass(DataSource.class)
@ConditionalOnProperty(prefix = "spring.datasource", name = "url")
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean(DataSource.class)
    public DataSource dataSource(DataSourceProperties properties) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(properties.getUrl());
        dataSource.setUsername(properties.getUsername());
        dataSource.setPassword(properties.getPassword());
        return dataSource;
    }
}

// 配置属性类
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceProperties {
    private String url;
    private String username;
    private String password;
    // getter/setter...
}

// spring.factories文件内容
/*
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.autoconfigure.DataSourceAutoConfiguration,\
com.example.autoconfigure.WebMvcAutoConfiguration
*/

// 自定义条件注解
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Conditional(OnRedisCondition.class)
public @interface ConditionalOnRedis {
}

public class OnRedisCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        try {
            context.getClassLoader().loadClass("redis.clients.jedis.Jedis");
            return context.getEnvironment().getProperty("spring.redis.host") != null;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }
}
```



### 🎯 什么是Starter？

> Starter 就是 Spring Boot 的“功能插件”，本质上是一个依赖模块，里面封装了某种功能所需的依赖和自动配置类。Spring Boot 通过 `@EnableAutoConfiguration` 机制扫描 Starter 中的自动配置类，并结合条件注解，最终把所需的 Bean 注入到容器中。这样开发者只需引入 Starter 依赖，就能快速使用对应功能，极大减少了配置工作。

**Starter** 就是 **Spring Boot 提供的依赖模块**，它把某个功能所需的依赖、配置、自动装配类都打包好，开发者只需要引入 Starter，就能“开箱即用”。

换句话说：**Starter = 依赖管理 + 自动配置 + 约定默认值**

**🛠 Starter 的组成**

一个 Starter 一般包含三部分：

1. **依赖**：把常用的第三方库统一打包（比如 spring-boot-starter-web 就打包了 Spring MVC、Jackson、Tomcat 等）。
2. **自动配置类**：在 `META-INF/spring.factories` 或 `AutoConfiguration.imports` 中声明。
3. **条件注解控制**：如 `@ConditionalOnClass`、`@ConditionalOnMissingBean`，保证灵活性。

**常见官方 Starter**

- `spring-boot-starter-web`：Web 开发（Spring MVC、Tomcat）
- `spring-boot-starter-data-jpa`：JPA 和 Hibernate
- `spring-boot-starter-data-redis`：Redis 集成
- `spring-boot-starter-security`：Spring Security
- `spring-boot-starter-test`：测试依赖



### 🎯 让你设计一个spring-boot-starter你会怎么设计？

设计一个 Spring Boot Starter 需要考虑其目的、功能、易用性和扩展性。以下是设计一个 Spring Boot Starter 的一般步骤：

1. **定义 Starter 的目的和功能**：
   - 确定 Starter 要解决的问题或要提供的功能。
   - 例如，可能是为了简化数据库操作、提供缓存解决方案、实现特定的业务功能等。
2. **创建 Maven 项目**：
   - 使用 Spring Initializr 或者手动创建一个 Maven 项目。
   - 包含必要的依赖，如 Spring Boot 和其他相关库。
3. **设计自动配置**：
   - 创建 `@Configuration` 类来定义自动配置。
   - 使用 `@EnableAutoConfiguration` 和 `@ComponentScan` 注解来启用自动配置和组件扫描。
   - 通过 `@ConditionalOnClass`、`@ConditionalOnMissingBean` 等条件注解来控制配置的生效条件。
4. **定义默认配置属性**：
   - 在 `application.properties` 或 `application.yml` 中定义默认配置属性。
   - 创建一个配置类，使用 `@ConfigurationProperties` 注解来绑定这些属性。
5. **创建自定义注解**：如果需要，可以创建自定义注解来进一步简化配置。
6. **实现依赖管理**：在 `pom.xml` 中定义 `<dependencyManagement>` 标签，管理 Starter 依赖的版本。
7. **编写文档**：提供清晰的文档说明如何使用 Starter，包括配置属性的详细说明。
8. **打包和命名**：
   - 按照 `spring-boot-starter-xxx` 的格式命名你的 Starter。
   - 在 `pom.xml` 中配置 `<groupId>`、`<artifactId>` 和 `<version>`。
9. **测试**：编写单元测试和集成测试来验证自动配置的正确性。
10. **发布**：将 Starter 发布到 Maven 中央仓库或私有仓库，以便其他项目可以依赖。
11. **提供示例**：提供一个示例项目，展示如何使用你的 Starter。

**💻 代码示例**：

```java
// 1. 自动配置类
@Configuration
@ConditionalOnClass(SmsService.class)
@ConditionalOnProperty(prefix = "sms", name = "enabled", havingValue = "true")
@EnableConfigurationProperties(SmsProperties.class)
public class SmsAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public SmsService smsService(SmsProperties properties) {
        return new SmsService(properties.getApiKey(), properties.getSecret());
    }
}

// 2. 配置属性类
@ConfigurationProperties(prefix = "sms")
@Data
public class SmsProperties {
    
    private boolean enabled = false;
    private String apiKey;
    private String secret;
    private String templateId;
    private int timeout = 5000;
}

// 3. 核心服务类
public class SmsService {
    
    private final String apiKey;
    private final String secret;
    
    public SmsService(String apiKey, String secret) {
        this.apiKey = apiKey;
        this.secret = secret;
    }
    
    public boolean sendSms(String phone, String message) {
        // 发送短信的具体实现
        System.out.println("发送短信到: " + phone + ", 内容: " + message);
        return true;
    }
}

// 4. META-INF/spring.factories文件
/*
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.starter.SmsAutoConfiguration
*/

// 5. pom.xml依赖管理（Starter模块）
/*
<dependency>
    <groupId>com.example</groupId>
    <artifactId>sms-spring-boot-autoconfigure</artifactId>
</dependency>
*/

// 6. 使用自定义Starter
@RestController
public class SmsController {
    
    @Autowired
    private SmsService smsService;
    
    @PostMapping("/send")
    public String sendSms(@RequestParam String phone, @RequestParam String message) {
        boolean success = smsService.sendSms(phone, message);
        return success ? "发送成功" : "发送失败";
    }
}

// 7. application.yml配置
/*
sms:
  enabled: true
  api-key: your-api-key
  secret: your-secret
  template-id: SMS_001
  timeout: 10000
*/
```

### 🎯 Spring Boot的配置优先级是怎样的？

"Spring Boot遵循约定大于配置原则，支持多种配置方式，具有明确的优先级顺序：

**配置优先级（从高到低）**：

**1. 命令行参数**：

- java -jar app.jar --server.port=8081
- 优先级最高，可覆盖任何配置

**2. 系统环境变量**：

- export SERVER_PORT=8081
- 通过操作系统设置的环境变量

**3. Java系统属性**：

- -Dserver.port=8081
- JVM启动参数设置的系统属性

**4. JNDI属性**：

- java:comp/env/server.port
- 从JNDI获取的属性

**5. 随机值属性**：

- RandomValuePropertySource支持的属性

**6. jar包外的配置文件**：

- application-{profile}.properties/yml
- 放在jar包同级目录

**7. jar包内的配置文件**：

- classpath中的application-{profile}.properties/yml

**8. @PropertySource注解**：

- 通过@PropertySource加载的属性文件

**9. 默认属性**：

- SpringApplication.setDefaultProperties()

**配置文件搜索顺序**：

1. file:./config/ (当前目录config子目录)
2. file:./ (当前目录)
3. classpath:/config/ (classpath config目录)
4. classpath:/ (classpath根目录)

**Profile配置**：

- application.yml (通用配置)
- application-dev.yml (开发环境)
- application-prod.yml (生产环境)"

**💻 代码示例**：

```java
// 1. 配置类读取优先级示例
@Component
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    private String name;
    private int port;
    private boolean enabled;
}

// 2. 多环境配置示例
// application.yml (基础配置)
/*
app:
  name: MyApp
  port: 8080
  
spring:
  profiles:
    active: dev
*/

// application-dev.yml (开发环境)
/*
app:
  port: 8081
  enabled: true
  
logging:
  level:
    root: DEBUG
*/

// application-prod.yml (生产环境)  
/*
app:
  port: 8080
  enabled: false
  
logging:
  level:
    root: WARN
*/

// 3. @Value注解读取配置
@RestController
public class ConfigController {
    
    @Value("${app.name:DefaultApp}")
    private String appName;
    
    @Value("${server.port:8080}")
    private int serverPort;
    
    @GetMapping("/config")
    public Map<String, Object> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("appName", appName);
        config.put("serverPort", serverPort);
        return config;
    }
}

// 4. 条件配置示例
@Configuration
public class ConditionalConfig {
    
    @Bean
    @ConditionalOnProperty(name = "app.enabled", havingValue = "true")
    public MyService myService() {
        return new MyService();
    }
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new H2DataSource();
    }
    
    @Bean
    @Profile("prod") 
    public DataSource prodDataSource() {
        return new MySQLDataSource();
    }
}

// 5. 启动时指定配置
/*
命令行方式：
java -jar app.jar --spring.profiles.active=prod --server.port=8081

环境变量方式：
export SPRING_PROFILES_ACTIVE=prod
export SERVER_PORT=8081

IDE配置：
-Dspring.profiles.active=dev
*/
```



### 🎯 spring-boot-starter-parent 有什么用 ?

`spring-boot-starter-parent` 是 Spring Boot 提供的一个父 POM（项目对象模型），用于简化 Spring Boot 项目的构建和依赖管理。它作为父级 POM，主要提供了许多方便的配置，包括版本管理、插件配置、依赖管理等。使用 `spring-boot-starter-parent` 可以减少很多手动配置的工作，让开发者专注于应用程序的开发而非构建过程：

1. **依赖管理**：`spring-boot-starter-parent` 预定义了 Spring Boot 相关依赖的版本，这意味着你不需要在每个模块的 `pom.xml` 中显式指定版本号，可以避免版本冲突和兼容性问题。
2. **插件管理**：它提供了一些预先配置的 Maven 插件，例如 `maven-compiler-plugin`（用于Java编译）、`maven-surefire-plugin`（用于单元测试）等，这些插件都已经配置好了适合大多数Spring Boot应用的参数。
3. **资源过滤和属性替换**：通过在父 POM 中定义资源过滤和属性替换规则，可以确保应用程序的配置文件（如 `application.properties`）在不同环境间正确切换。
4. **Spring Boot 应用的打包优化**：它配置了 `maven-war-plugin` 插件，使得打包的 WAR 文件中不包含 `META-INF` 目录下的 `pom.xml` 和 `pom.properties` 文件，这对于部署到 Servlet 容器是有益的。
5. **自动配置的依赖**：可以方便地引入 Spring Boot 的自动配置依赖，例如 `spring-boot-starter`，这可以自动配置应用程序的大部分设置。
6. **版本一致性**：确保所有 Spring Boot 相关依赖的版本一致，避免不同库之间的版本冲突。
7. **快速开始**：对于新项目，使用 `spring-boot-starter-parent` 可以快速开始，无需手动配置大量的 Maven 设置。
8. **继承和自定义**：如果需要，你可以继承 `spring-boot-starter-parent` 并根据项目需求进行自定义配置。



### 🎯 Spring Boot 打成的 jar 和普通的 jar 有什么区别 ?

Spring Boot 项目最终打包成的 jar 是可执行 jar ，这种 jar 可以直接通过 `java -jar xxx.jar` 命令来运行，这种 jar 不可以作为普通的 jar 被其他项目依赖，即使依赖了也无法使用其中的类。

Spring Boot 的 jar 无法被其他项目依赖，主要还是他和普通 jar 的结构不同。普通的 jar 包，解压后直接就是包名，包里就是我们的代码，而 Spring Boot 打包成的可执行 jar 解压后，在 `\BOOT-INF\classes` 目录下才是我们的代码，因此无法被直接引用。如果非要引用，可以在 pom.xml 文件中增加配置，将 Spring Boot 项目打包成两个 jar ，一个可执行，一个可引用。



### 🎯 如何使用 Spring Boot 实现异常处理？

Spring Boot 提供了异常处理的多种方式，主要通过以下几种手段实现：

- 使用全局异常处理类（`@ControllerAdvice` 和 `@ExceptionHandler`）。
- 配置自定义错误页面或返回统一的 JSON 响应。
- 利用 Spring Boot 自带的 `ErrorController` 接口扩展默认异常处理逻辑。



### 🎯 Spring Boot Actuator有什么用？

"Spring Boot Actuator提供了生产级别的监控和管理功能，是运维必备组件：

**核心功能**：

**1. 健康检查**：

- /health端点显示应用健康状态
- 支持自定义健康指示器
- 可集成数据库、Redis等组件检查

**2. 指标监控**：

- /metrics端点提供JVM、HTTP等指标
- 集成Micrometer指标库
- 支持Prometheus、InfluxDB等监控系统

**3. 应用信息**：

- /info端点显示应用版本、Git信息
- /env端点显示环境变量和配置
- /configprops显示配置属性

**4. 运行时管理**：

- /shutdown端点优雅关闭应用
- /loggers端点动态修改日志级别
- /threaddump获取线程转储

**常用端点**：

- /health - 健康检查
- /metrics - 应用指标
- /info - 应用信息
- /env - 环境变量
- /loggers - 日志配置
- /heapdump - 堆转储
- /threaddump - 线程转储
- /shutdown - 关闭应用

**安全配置**：

- 默认情况下大部分端点需要认证
- 可通过management.endpoints.web.exposure.include配置暴露端点
- 建议生产环境配置安全访问控制"

**💻 代码示例**：

```java
// 1. 添加Actuator依赖
/*
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
*/

// 2. Actuator配置
// application.yml
/*
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info,env
      base-path: /actuator
  endpoint:
    health:
      show-details: always
    shutdown:
      enabled: true
  server:
    port: 8081  # 管理端口与应用端口分离
    
info:
  app:
    name: @project.name@
    version: @project.version@
    description: Demo Application
*/

// 3. 自定义健康检查
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // 自定义健康检查逻辑
        boolean isHealthy = checkExternalService();
        
        if (isHealthy) {
            return Health.up()
                    .withDetail("status", "服务正常")
                    .withDetail("timestamp", System.currentTimeMillis())
                    .build();
        } else {
            return Health.down()
                    .withDetail("status", "外部服务不可用")
                    .withDetail("error", "连接超时")
                    .build();
        }
    }
    
    private boolean checkExternalService() {
        // 检查外部服务状态
        return Math.random() > 0.2;
    }
}

// 4. 自定义指标
@RestController
public class MetricsController {
    
    private final Counter requestCounter;
    private final Timer requestTimer;
    
    public MetricsController(MeterRegistry meterRegistry) {
        this.requestCounter = Counter.builder("http_requests_total")
                .description("Total HTTP requests")
                .tag("method", "GET")
                .register(meterRegistry);
                
        this.requestTimer = Timer.builder("http_request_duration")
                .description("HTTP request duration")
                .register(meterRegistry);
    }
    
    @GetMapping("/api/data")
    public String getData() {
        return requestTimer.recordCallable(() -> {
            requestCounter.increment();
            // 模拟业务逻辑
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "数据返回成功";
        });
    }
}

// 5. 安全配置
@Configuration
public class ActuatorSecurityConfig {
    
    @Bean
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .requestMatcher(EndpointRequest.toAnyEndpoint())
                .authorizeHttpRequests(authz -> authz
                    .requestMatchers(EndpointRequest.to("health")).permitAll()
                    .anyRequest().hasRole("ADMIN")
                )
                .httpBasic(Customizer.withDefaults())
                .build();
    }
}

// 6. 监控集成示例
// Prometheus配置
/*
management:
  metrics:
    export:
      prometheus:
        enabled: true
  endpoints:
    web:
      exposure:
        include: prometheus
*/

// 访问监控端点示例
/*
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/metrics
curl http://localhost:8080/actuator/info
curl http://localhost:8080/actuator/env
*/
```



### 🎯spring boot 核心配置文件是什么？bootstrap.properties 和 application.properties 有何区别 ?

单纯做 Spring Boot 开发，可能不太容易遇到 bootstrap.properties 配置文件，但是在结合 Spring Cloud 时，这个配置就会经常遇到了，特别是在需要加载一些远程配置文件的时侯。

spring boot 核心的两个配置文件：

- bootstrap (. yml 或者 . properties)：boostrap 由父 ApplicationContext 加载的，比 applicaton 优先加载，配置在应用程序上下文的引导阶段生效。一般来说我们在 Spring Cloud Config 或者 Nacos 中会用到它。且 boostrap 里面的属性不能被覆盖；
- application (. yml 或者 . properties)： 由 ApplicatonContext 加载，用于 spring boot 项目的自动化配置。



### 🎯Spring Boot 的核心注解是哪个？它主要由哪几个注解组成的？

启动类上面的注解是@SpringBootApplication，它也是 Spring Boot 的核心注解，主要组合包含了以下 3 个注解：

- @SpringBootConfiguration：组合了 @Configuration 注解，实现配置文件的功能。
- @EnableAutoConfiguration：打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置功能： @SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })。
- @ComponentScan：Spring组件扫描。

------



## 💾 五、数据访问与事务（Transaction核心）

**核心理念**：Spring提供统一的事务管理抽象，支持声明式事务，简化数据访问层开发。

### 🎯 Spring事务管理机制是什么？

作为企业级应用程序框架,，Spring 在不同的事务管理 API 之上定义了一个抽象层，而应用程序开发人员不必了解底层的事务管理 API，就可以使用 Spring 的事务管理机制

Spring 既支持**编程式事务管理**，也支持**声明式的事务管理**

- 编程式事务管理：将事务管理代码嵌入到业务方法中来控制事务的提交和回滚，在编程式管理事务时，必须在每个事务操作中包含额外的事务管理代码，属于硬编码

  - 通过TransactionTemplate或PlatformTransactionManager手动管理
  - 代码侵入性强，但控制精确
  - 适用于复杂的事务逻辑

- 声明式事务管理：大多数情况下比编程式事务管理更好用。它将事务管理代码从业务方法中分离出来，以声明的方式来实现事务管理。事务管理作为一种横切关注点，可以通过 AOP 方法模块化。

  - 基于AOP实现，使用@Transactional注解
  - 代码无侵入，配置简单
  - 是企业开发的首选方案

  Spring 通过 Spring AOP 框架支持声明式事务管理，**声明式事务又分为两种：**

  - 基于XML的声明式事务
  - 基于注解的声明式事务

**核心组件**：
- PlatformTransactionManager：事务管理器接口
- TransactionDefinition：事务定义信息
- TransactionStatus：事务运行状态
- TransactionTemplate：编程式事务模板

**事务属性**：
- 传播行为：定义事务方法调用时的行为
- 隔离级别：控制并发事务的隔离程度
- 超时时间：事务执行的最大时间
- 只读属性：优化只读操作的性能
- 回滚规则：定义哪些异常导致回滚"

**💻 代码示例**：
```java
@Service
@Transactional
public class UserService {
    
    // 声明式事务 - 默认配置
    public void saveUser(User user) {
        userRepository.save(user);
        // 运行时异常自动回滚
    }
    
    // 指定传播行为和隔离级别
    @Transactional(
        propagation = Propagation.REQUIRES_NEW,
        isolation = Isolation.READ_COMMITTED,
        timeout = 30,
        rollbackFor = Exception.class
    )
    public void processOrder(Order order) {
        orderRepository.save(order);
        updateInventory(order);
    }
    
    // 只读事务优化
    @Transactional(readOnly = true)
    public List<User> findActiveUsers() {
        return userRepository.findByStatus("ACTIVE");
    }
}
```



### 🎯 事务管理器

Spring 并不直接管理事务，而是提供了多种事务管理器，他们将事务管理的职责委托给 Hibernate 或者 JTA 等持久化机制所提供的相关平台框架的事务来实现。

Spring 事务管理器的接口是 `org.springframework.transaction.PlatformTransactionManager`，通过这个接口，Spring 为各个平台如 JDBC、Hibernate 等都提供了对应的事务管理器，但是具体的实现就是各个平台自己的事情了。

#### Spring 中的事务管理器的不同实现

**事务管理器以普通的 Bean 形式声明在 Spring IOC 容器中**

- 在应用程序中只需要处理一个数据源, 而且通过 JDBC 存取

  ```java
  org.springframework.jdbc.datasource.DataSourceTransactionManager
  ```

- 在 JavaEE 应用服务器上用 JTA(Java Transaction API) 进行事务管理

  ```
  org.springframework.transaction.jta.JtaTransactionManager
  ```

- 用 Hibernate 框架存取数据库

  ```
  org.springframework.orm.hibernate3.HibernateTransactionManager
  ```

**事务管理器以普通的 Bean 形式声明在 Spring IOC 容器中**



### 🎯 用事务通知声明式地管理事务

- 事务管理是一种横切关注点
- 为了在 Spring 2.x 中启用声明式事务管理，可以通过 tx Schema 中定义的 \<tx:advice> 元素声明事务通知，为此必须事先将这个 Schema 定义添加到 \<beans> 根元素中去
- 声明了事务通知后，就需要将它与切入点关联起来。由于事务通知是在 \<aop:config> 元素外部声明的, 所以它无法直接与切入点产生关联，所以必须在 \<aop:config> 元素中声明一个增强器通知与切入点关联起来.
- 由于 Spring AOP 是基于代理的方法，所以只能增强公共方法。因此, 只有公有方法才能通过 Spring AOP 进行事务管理。



### 🎯 用 @Transactional 注解声明式地管理事务

- 除了在带有切入点，通知和增强器的 Bean 配置文件中声明事务外，Spring 还允许简单地用 @Transactional 注解来标注事务方法
- 为了将方法定义为支持事务处理的，可以为方法添加 @Transactional 注解，根据 Spring AOP 基于代理机制，**只能标注公有方法.**
- 可以在方法或者类级别上添加 @Transactional 注解。当把这个注解应用到类上时， 这个类中的所有公共方法都会被定义成支持事务处理的
- 在 Bean 配置文件中只需要启用 `<tx:annotation-driven>`元素, 并为之指定事务管理器就可以了
- 如果事务处理器的名称是 transactionManager, 就可以在 `<tx:annotation-driven>` 元素中省略 `transaction-manager` 属性，这个元素会自动检测该名称的事务处理器



### 🎯 Spring Boot 的事务是怎么实现的？

Spring Boot 的事务管理是基于 **Spring Framework** 的事务抽象实现的，利用了 Spring 的 **声明式事务**（基于 AOP）和 **编程式事务**（通过 `PlatformTransactionManager`）来进行事务控制。在 Spring Boot 中，事务的实现本质上是 Spring 提供的事务管理功能的自动化配置，通过自动配置机制来简化事务管理的配置。

下面我们详细探讨 Spring Boot 如何实现事务管理。

1. **Spring 事务管理的核心组件**

   Spring 的事务管理主要依赖于以下几个关键组件：

   - **`PlatformTransactionManager`**：这是 Spring 提供的事务管理接口，支持各种类型的事务管理。常用的实现类包括：
     - `DataSourceTransactionManager`：用于 JDBC 数据源的事务管理。
     - `JpaTransactionManager`：用于 JPA（Java Persistence API）持久化框架的事务管理。
     - `HibernateTransactionManager`：用于 Hibernate 的事务管理。

   - **`TransactionDefinition`**：定义了事务的传播行为、隔离级别、回滚规则等事务属性。

   - **`TransactionStatus`**：代表事务的状态，记录事务的执行情况，可以提交或回滚事务。

2. **Spring Boot 如何自动配置事务管理**

   Spring Boot 会自动根据项目中包含的库来配置合适的事务管理器。例如，如果项目中使用的是 **JPA**（通过 `spring-boot-starter-data-jpa`），Spring Boot 会自动配置 `JpaTransactionManager`；如果使用的是 **JDBC**，则会自动配置 `DataSourceTransactionManager`。

   Spring Boot 的自动配置基于 **Spring Framework** 的 `@EnableTransactionManagement` 和 **AOP**（面向切面编程）机制。

- **自动配置事务管理器**

  Spring Boot 会根据 `application.properties` 或 `application.yml` 中的配置自动选择合适的 `PlatformTransactionManager`，并且为你配置一个 `@Transactional` 注解所需的代理。

  例如，如果你使用了 JPA 和 Spring Data JPA，Spring Boot 会自动配置 `JpaTransactionManager`。

  ```java
  @Configuration
  @EnableTransactionManagement
  public class DataSourceConfig {
      // 配置事务管理器
      @Bean
      public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
          return new JpaTransactionManager(entityManagerFactory);
      }
  }
  ```

  Spring Boot 会根据自动配置为我们生成这个 `transactionManager`，从而简化了配置过程。

- **事务代理和 AOP**

  Spring Boot 的事务管理基于 **AOP（面向切面编程）** 实现的。当你在方法上使用 `@Transactional` 注解时，Spring 会在底层创建一个代理，这个代理会拦截方法的调用，并在方法执行前后执行事务相关的操作（如开启、提交、回滚事务）。

  具体来说，Spring 通过 `@Transactional` 注解创建的代理类会通过 **动态代理（JDK 动态代理或 CGLIB 代理）** 来拦截目标方法的调用，执行事务管理逻辑：

  - 在方法执行之前，代理会先开启事务。

  - 在方法执行后，代理会根据方法执行的结果来决定是提交事务还是回滚事务（如果发生异常）。

3. **Spring Boot 事务管理的工作原理**

- **声明式事务（基于 AOP）**

  Spring Boot 默认使用声明式事务管理。这是通过 **`@Transactional`** 注解实现的。Spring Boot 的事务管理是通过 AOP（面向切面编程）技术来动态处理事务的。

  具体流程如下：

  1. **方法执行之前**：代理对象会在方法执行前调用 `PlatformTransactionManager` 的 `begin()` 方法，开启事务。

  2. **方法执行之后**：方法执行完成后，代理对象会根据方法的返回值和抛出的异常来判断是提交事务还是回滚事务：

     - 如果方法正常执行完成，事务会被提交（`commit()`）。

     - 如果方法抛出 `RuntimeException` 或其他配置的异常类型，事务会被回滚（`rollback()`）。

- **事务的传播行为和隔离级别**

  Spring 事务还可以通过配置 `@Transactional` 注解的属性来指定事务的 **传播行为** 和 **隔离级别**，这也是 Spring 事务管理的一大特点。

  - **传播行为（Propagation）**：指定一个方法如何参与当前事务的上下文。例如：

    - `REQUIRED`（默认）：如果当前方法有事务，加入当前事务；如果没有事务，创建一个新的事务。
    - `REQUIRES_NEW`：总是创建一个新的事务，挂起当前事务。
    - `NESTED`：在当前事务中执行，但支持事务嵌套。

  - **隔离级别（Isolation）**：控制事务之间的隔离程度。例如：

    - `READ_COMMITTED`：确保读取的数据是已提交的数据。

    - `READ_UNCOMMITTED`：允许读取未提交的数据。

    - `SERIALIZABLE`：最严格的隔离级别，保证事务完全隔离，避免并发问题。

      ```java
      @Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
      public void someMethod() {
          // 该方法会开启新的事务并设置隔离级别
      }
      ```

- **回滚规则**

  默认情况下，Spring 的事务管理会在发生 **运行时异常**（`RuntimeException`）或 **Error** 时进行回滚。如果抛出的是 **检查型异常**（`CheckedException`），则默认不会回滚，但可以通过 `@Transactional` 注解的 `rollbackFor` 属性来修改这一行为。

  ```java
  @Transactional(rollbackFor = Exception.class)
  public void someMethod() throws Exception {
      // 这里如果抛出 Exception 类型的异常，事务会回滚
  }
  ```

4. **编程式事务管理**

   除了声明式事务（通过 `@Transactional` 注解），Spring 还支持编程式事务管理。编程式事务管理通常用于对事务进行更加细粒度的控制。Spring 提供了 `PlatformTransactionManager` 接口来进行编程式事务管理，最常用的实现是 `DataSourceTransactionManager` 和 `JpaTransactionManager`。

   ```java
   @Autowired
   private PlatformTransactionManager transactionManager;
   
   public void someMethod() {
       TransactionDefinition definition = new DefaultTransactionDefinition();
       TransactionStatus status = transactionManager.getTransaction(definition);
       
       try {
           // 执行业务逻辑
           transactionManager.commit(status);
       } catch (Exception e) {
           transactionManager.rollback(status);
       }
   }
   ```

5. **事务管理的优点和特点**

   - **简化了配置**：Spring Boot 自动根据使用的持久化框架配置事务管理器，减少了手动配置的工作量。

   - **基于 AOP**：声明式事务管理使用 AOP 技术动态代理，拦截方法调用，实现事务的自动控制。

   - **灵活的传播行为和隔离级别**：Spring 提供了多种传播行为和隔离级别，开发者可以根据需求灵活配置。

   - **事务回滚**：通过 `@Transactional` 注解，Spring 可以自动根据异常类型决定是否回滚事务，支持自定义回滚规则。

> **Spring Boot 的事务管理是基于 Spring 框架的事务抽象实现的**。Spring Boot 自动配置事务管理器，具体事务管理器（如 `JpaTransactionManager` 或 `DataSourceTransactionManager`）会根据项目中使用的持久化框架自动选择。事务管理主要通过 **声明式事务** 和 **编程式事务** 来实现。
>
> - **声明式事务**：通过 `@Transactional` 注解来管理事务，Spring 会通过 AOP（面向切面编程）技术，拦截标注了 `@Transactional` 注解的方法，自动处理事务的开始、提交和回滚。
> - **编程式事务**：通过 `PlatformTransactionManager` 和 `TransactionStatus` 来手动控制事务的提交和回滚，适用于更加灵活的场景。
>
> Spring Boot 默认支持常见的传播行为（如 `REQUIRED`、`REQUIRES_NEW`）和隔离级别（如 `READ_COMMITTED`、`SERIALIZABLE`），并允许自定义事务回滚规则（默认回滚 `RuntimeException` 和 `Error`）。这些特性使得 Spring Boot 的事务管理既灵活又高效。



### 🎯 Spring事务传播行为有哪些？

"Spring定义了7种事务传播行为，控制事务方法调用时的事务边界：

**支持当前事务**：

**REQUIRED（默认）**：
- 有事务就加入，没有就新建
- 最常用的传播行为

**SUPPORTS**：
- 有事务就加入，没有就以非事务执行
- 适用于查询方法

**MANDATORY**：
- 必须在事务中执行，否则抛异常
- 强制要求调用方提供事务

**不支持当前事务**：

**REQUIRES_NEW**：
- 总是创建新事务，挂起当前事务
- 适用于独立的子事务

**NOT_SUPPORTED**：
- 以非事务方式执行，挂起当前事务
- 适用于不需要事务的操作

**NEVER**：
- 以非事务方式执行，有事务就抛异常
- 强制非事务执行

**嵌套事务**：

**NESTED**：
- 嵌套事务，基于保存点实现
- 内层事务回滚不影响外层事务"

**💻 代码示例**：
```java
@Service
public class OrderService {
    
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private LogService logService;
    
    @Transactional
    public void processOrder(Order order) {
        // 主事务
        orderRepository.save(order);
        
        // REQUIRES_NEW：独立事务，不受主事务影响
        paymentService.processPayment(order);
        
        // NESTED：嵌套事务，可以独立回滚
        logService.logOrder(order);
    }
}

@Service
public class PaymentService {
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processPayment(Order order) {
        // 新的独立事务
        Payment payment = new Payment(order);
        paymentRepository.save(payment);
        // 即使主事务回滚，支付记录也会保存
    }
}

@Service  
public class LogService {
    
    @Transactional(propagation = Propagation.NESTED)
    public void logOrder(Order order) {
        // 嵌套事务
        OrderLog log = new OrderLog(order);
        logRepository.save(log);
        // 如果日志失败，只回滚日志操作
    }
}
```

### 🎯 Spring事务失效的常见原因有哪些？

"Spring事务失效是常见问题，主要原因包括：

**AOP代理失效场景**：

**1. 方法不是public**：
- @Transactional只能作用于public方法
- private/protected/默认方法事务不生效

**2. 内部方法调用**：
- 同一个类内部方法调用，不经过代理
- 解决方案：通过ApplicationContext获取代理对象

**3. 方法被final修饰**：
- final方法无法被代理重写
- static方法同样无法被代理

**异常处理问题**：

**4. 异常被捕获**：
- try-catch捕获异常但不重新抛出
- 事务管理器感知不到异常

**5. 异常类型不匹配**：
- 默认只回滚RuntimeException
- 检查异常需要显式配置rollbackFor

**配置和环境问题**：

**6. 事务管理器未正确配置**：
- 数据源与事务管理器不匹配
- 多数据源配置错误

**7. 传播行为配置错误**：
- NOT_SUPPORTED、NEVER等传播行为
- 导致方法以非事务方式执行"

**💻 代码示例**：
```java
@Service
public class UserService {
    
    // ❌ 错误：非public方法
    @Transactional
    private void updateUserInternal(User user) {
        userRepository.save(user);
    }
    
    // ❌ 错误：内部调用不经过代理
    @Transactional
    public void updateUser(User user) {
        this.updateUserInternal(user); // 事务失效
    }
    
    // ❌ 错误：异常被捕获
    @Transactional
    public void saveUserWithCatch(User user) {
        try {
            userRepository.save(user);
            throw new RuntimeException("测试异常");
        } catch (Exception e) {
            // 异常被捕获，事务不回滚
            log.error("保存失败", e);
        }
    }
    
    // ✅ 正确：重新抛出异常
    @Transactional
    public void saveUserCorrect(User user) {
        try {
            userRepository.save(user);
        } catch (Exception e) {
            log.error("保存失败", e);
            throw e; // 重新抛出异常
        }
    }
    
    // ✅ 正确：指定回滚异常类型
    @Transactional(rollbackFor = Exception.class)
    public void saveUserWithCheckedException(User user) throws Exception {
        userRepository.save(user);
        if (user.getAge() < 0) {
            throw new Exception("年龄不能为负数");
        }
    }
}
```

### 🎯 Spring Data JPA和MyBatis的区别？

"Spring Data JPA和MyBatis是两种不同的数据访问技术：

**Spring Data JPA**：
- 基于JPA标准的ORM框架
- 约定大于配置，自动生成SQL
- Repository接口自动实现CRUD
- 适合领域驱动设计，对象关系映射
- 学习成本低，开发效率高

**MyBatis**：
- 半自动ORM框架，SQL与Java分离
- 需要手写SQL，控制精确
- 支持动态SQL，适合复杂查询
- 适合数据库优先设计
- 性能可控，但开发工作量大

**选择建议**：
- 简单CRUD，快速开发：Spring Data JPA
- 复杂查询，性能要求高：MyBatis
- 团队熟悉SQL：MyBatis
- 团队偏向对象模型：Spring Data JPA"

**💻 代码示例**：
```java
// Spring Data JPA方式
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 方法名自动生成SQL
    List<User> findByNameAndAge(String name, Integer age);
    
    // 自定义查询
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    User findByEmail(String email);
    
    // 分页查询
    Page<User> findByNameContaining(String name, Pageable pageable);
}

// MyBatis方式
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE name = #{name} AND age = #{age}")
    List<User> findByNameAndAge(@Param("name") String name, @Param("age") Integer age);
    
    @Insert("INSERT INTO user(name, email, age) VALUES(#{name}, #{email}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertUser(User user);
    
    // XML配置复杂查询
    List<User> findUsersWithConditions(UserQueryCondition condition);
}
```



### 🎯 @Transactional 为什么不能用在私有方法上？

`@Transactional` 注解是 Spring 提供的一种声明式事务管理方式，它用于指定某个方法在执行时需要进行事务管理。通常，这个注解被用在公有（public）方法上，原因包括：

1. **代理机制**：Spring 的声明式事务管理是基于 AOP（面向切面编程）实现的。当使用 `@Transactional` 注解时，Spring 会为被注解的方法创建一个代理对象。对于非公有方法，Spring 无法在运行时动态地创建代理，因为这些方法不能被代理对象所调用。
2. **事务传播**：事务的传播依赖于方法调用链。`@Transactional` 注解通常用于服务层或对外的 API 方法上，这样可以确保在业务逻辑的开始处就开启事务，并在业务逻辑结束时提交或回滚事务。如果将 `@Transactional` 注解用在私有方法上，那么事务的传播行为（如传播级别、事务的保存点等）可能不会按预期工作。
3. **代码设计**：从设计的角度来看，将 `@Transactional` 注解用在公有方法上更符合业务逻辑的封装和分层。私有方法通常被设计为辅助方法，不应该独立承担事务管理的责任。
4. **事务的可见性**：将 `@Transactional` 注解用在公有方法上可以清晰地表明事务的边界，这对于理解和维护代码都是有益的。如果用在私有方法上，可能会隐藏事务的边界，使得其他开发者难以理解事务的范围。
5. **事务的粒度**：事务应该在业务逻辑的适当粒度上进行管理。通常，一个业务操作会跨越多个方法调用，将 `@Transactional` 注解用在私有方法上可能会导致过细的事务粒度，这不利于事务管理。
6. **Spring 版本限制**：在 Spring 5 之前的版本中，`@Transactional` 注解确实不能用于非公有方法。从 Spring 5 开始，引入了对非公有方法的支持，但是仍然推荐将 `@Transactional` 注解用在公有方法上。



### 🎯 事务传播属性

- 当事务方法被另一个事务方法调用时， 必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行
- 事务的传播行为可以由传播属性指定，Spring 定义了 7  种类传播行为：

| 传播行为                  | 意义                                                         |
| ------------------------- | ------------------------------------------------------------ |
| PROPAGATION_MANDATORY     | 表示该方法必须运行在一个事务中。如果当前没有事务正在发生，将抛出一个异常 |
| PROPAGATION_NESTED        | 表示如果当前正有一个事务在进行中，则该方法应当运行在一个嵌套式事务中。被嵌套的事务可以独立于封装事务进行提交或回滚。如果封装事务不存在，行为就像PROPAGATION_REQUIRES一样。 |
| PROPAGATION_NEVER         | 表示当前的方法不应该在一个事务中运行。如果一个事务正在进行，则会抛出一个异常。 |
| PROPAGATION_NOT_SUPPORTED | 表示该方法不应该在一个事务中运行。如果一个现有事务正在进行中，它将在该方法的运行期间被挂起。 |
| PROPAGATION_SUPPORTS      | 表示当前方法不需要事务性上下文，但是如果有一个事务已经在运行的话，它也可以在这个事务里运行。 |
| PROPAGATION_REQUIRES_NEW  | 表示当前方法必须在它自己的事务里运行。一个新的事务将被启动，而且如果有一个现有事务在运行的话，则将在这个方法运行期间被挂起。 |
| PROPAGATION_REQUIRES      | 表示当前方法必须在一个事务中运行。如果一个现有事务正在进行中，该方法将在那个事务中运行，否则就要开始一个新事务。 |



### 🎯 Spring 支持的事务隔离级别

| 隔离级别                   | 含义                                                         |
| -------------------------- | ------------------------------------------------------------ |
| ISOLATION_DEFAULT          | 使用后端数据库默认的隔离级别。                               |
| ISOLATION_READ_UNCOMMITTED | 允许读取尚未提交的更改。可能导致脏读、幻影读或不可重复读。   |
| ISOLATION_READ_COMMITTED   | 允许从已经提交的并发事务读取。可防止脏读，但幻影读和不可重复读仍可能会发生。 |
| ISOLATION_REPEATABLE_READ  | 对相同字段的多次读取的结果是一致的，除非数据被当前事务本身改变。可防止脏读和不可重复读，但幻影读仍可能发生。 |
| ISOLATION_SERIALIZABLE     | 完全服从ACID的隔离级别，确保不发生脏读、不可重复读和幻影读。这在所有隔离级别中也是最慢的，因为它通常是通过完全锁定当前事务所涉及的数据表来完成的。 |

事务的隔离级别要得到底层数据库引擎的支持，而不是应用程序或者框架的支持；

Oracle 支持的 2 种事务隔离级别，Mysql支持 4 种事务隔离级别。



### 🎯 设置隔离事务属性

用 @Transactional 注解声明式地管理事务时可以在 @Transactional 的 isolation 属性中设置隔离级别

在 Spring 事务通知中, 可以在 `<tx:method>` 元素中指定隔离级别

### 🎯 设置回滚事务属性

- 默认情况下只有未检查异常(RuntimeException和Error类型的异常)会导致事务回滚，而受检查异常不会。
- 事务的回滚规则可以通过 @Transactional 注解的 rollbackFor和 noRollbackFor属性来定义，这两个属性被声明为 Class[] 类型的，因此可以为这两个属性指定多个异常类。

  - rollbackFor：遇到时必须进行回滚
  - noRollbackFor： 一组异常类，遇到时必须不回滚

###  🎯 超时和只读属性

- 由于事务可以在行和表上获得锁， 因此长事务会占用资源，并对整体性能产生影响
- 如果一个事物只读取数据但不做修改，数据库引擎可以对这个事务进行优化
- 超时事务属性：事务在强制回滚之前可以保持多久，这样可以防止长期运行的事务占用资源
- 只读事务属性：表示这个事务只读取数据但不更新数据，这样可以帮助数据库引擎优化事务

**设置超时和只读事务属性**

- 超时和只读属性可以在 @Transactional 注解中定义，超时属性以秒为单位来计算

列出两种方式的示例：

```java
@Transactional(propagation = Propagation.NESTED, timeout = 1000, isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
```

```xml
	<tx:advice id="txAdvice" transaction-manager="txManager">
		<!-- the transactional semantics... -->
		<tx:attributes>
			<!-- all methods starting with 'get' are read-only -->
			<tx:method name="get*" read-only="true" propagation="REQUIRES_NEW" isolation="READ_COMMITTED" timeout="30" no-rollback-for="java.lang.ArithmeticException"/>
			<!-- other methods use the default transaction settings (see below) -->
			<tx:method name="*"/>
		</tx:attributes>
	</tx:advice>

    <!-- ensure that the above transactional advice runs for any execution
        of an operation defined by the FooService interface -->
    <aop:config>
        <aop:pointcut id="fooServiceOperation" expression="execution(* x.y.service.FooService.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="fooServiceOperation"/>
    </aop:config>
```

---

## 🔒 六、Spring Security安全框架

**核心理念**：Spring Security提供全面的安全解决方案，包括认证、授权、攻击防护等企业级安全功能。

### 🎯 Spring Security的核心概念？

"Spring Security是基于过滤器链的安全框架：

**核心概念**：

**Authentication（认证）**：
- 验证用户身份的过程
- 包含用户凭证和权限信息
- 存储在SecurityContext中

**Authorization（授权）**：
- 控制用户对资源的访问权限
- 基于角色或权限进行访问控制
- 支持方法级和URL级授权

**SecurityContext**：
- 安全上下文，存储当前用户的安全信息
- 通过ThreadLocal实现线程隔离
- SecurityContextHolder提供访问接口

**核心组件**：

**AuthenticationManager**：
- 认证管理器，处理认证请求
- 通常使用ProviderManager实现

**UserDetailsService**：
- 用户详情服务，加载用户信息
- 自定义用户数据源的关键接口

**PasswordEncoder**：
- 密码编码器，处理密码加密
- 推荐使用BCryptPasswordEncoder

**过滤器链**：
- SecurityFilterChain处理HTTP请求
- 包含认证、授权、CSRF防护等过滤器"

**💻 代码示例**：
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login?logout")
            );
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails admin = User.builder()
            .username("admin")
            .password(encoder.encode("admin123"))
            .roles("ADMIN")
            .build();
        return new InMemoryUserDetailsManager(admin);
    }
}
```

### 🎯 Spring Security如何实现JWT认证？

"JWT认证是无状态的认证方式，Spring Security可以很好地集成：

**JWT认证流程**：
1. 用户登录，验证用户名密码
2. 生成JWT Token返回给客户端
3. 客户端在请求头中携带Token
4. 服务器验证Token并提取用户信息
5. 基于用户信息进行授权决策

**实现要点**：

**JWT工具类**：
- 生成Token：包含用户信息和过期时间
- 验证Token：检查签名和过期状态
- 解析Token：提取用户身份信息

**JWT过滤器**：
- 继承OncePerRequestFilter
- 从请求头提取Token
- 验证Token并设置SecurityContext

**认证端点**：
- 处理登录请求
- 验证用户凭证
- 生成并返回JWT Token

**优势**：无状态、跨域友好、易于扩展
**注意**：Token安全存储、合理设置过期时间"

**💻 代码示例**：
```java
@RestController
public class AuthController {
    
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(), request.getPassword())
        );
        
        UserDetails user = (UserDetails) auth.getPrincipal();
        String token = jwtUtil.generateToken(user.getUsername());
        
        return ResponseEntity.ok(new JwtResponse(token));
    }
}

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain chain) throws ServletException, IOException {
        String token = extractToken(request);
        
        if (token != null && jwtUtil.validateToken(token)) {
            String username = jwtUtil.getUsernameFromToken(token);
            UserDetails user = userDetailsService.loadUserByUsername(username);
            
            Authentication auth = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        
        chain.doFilter(request, response);
    }
}
```

### 🎯 Spring Security方法级安全怎么使用？

"Spring Security提供了方法级的安全控制，可以在方法上直接配置权限：

**启用方法安全**：
- @EnableGlobalMethodSecurity注解
- @EnableMethodSecurity（Spring Security 6+）
- 支持多种注解方式

**安全注解类型**：

**@PreAuthorize**：
- 方法执行前进行权限检查
- 支持SpEL表达式
- 最常用的方法级安全注解

**@PostAuthorize**：
- 方法执行后进行权限检查
- 可以基于返回值进行权限控制

**@Secured**：
- 简单的角色检查
- 只支持角色名称，不支持复杂表达式

**@RolesAllowed**：
- JSR-250标准注解
- 功能类似@Secured

**SpEL表达式**：
- hasRole('ROLE_USER')：检查角色
- hasAuthority('READ_USER')：检查权限
- authentication.name == #username：复杂权限逻辑"

**💻 代码示例**：
```java
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig {
}

@Service
public class UserService {
    
    // 只有ADMIN角色可以访问
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    
    // 用户只能访问自己的信息
    @PreAuthorize("hasRole('ADMIN') or authentication.name == #username")
    public User getUserInfo(String username) {
        return userRepository.findByUsername(username);
    }
    
    // 基于返回值的权限检查
    @PostAuthorize("hasRole('ADMIN') or returnObject.username == authentication.name")
    public User findUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    // 多个权限检查
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') and hasAuthority('USER_READ')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
```



### 🎯 比较一下 Spring Security 和 Shiro 各自的优缺点 ?

由于 Spring Boot 官方提供了大量的非常方便的开箱即用的 Starter ，包括 Spring Security 的 Starter ，使得在 Spring Boot 中使用 Spring Security 变得更加容易，甚至只需要添加一个依赖就可以保护所有的接口，所以，如果是 Spring Boot 项目，一般选择 Spring Security 。当然这只是一个建议的组合，单纯从技术上来说，无论怎么组合，都是没有问题的。Shiro 和 Spring Security 相比，主要有如下一些特点：

1. Spring Security 是一个重量级的安全管理框架；Shiro 则是一个轻量级的安全管理框架
2. Spring Security 概念复杂，配置繁琐；Shiro 概念简单、配置简单
3. Spring Security 功能强大；Shiro 功能简单

---



## ☁️ 七、Spring Cloud微服务

**核心理念**：Spring Cloud为分布式系统开发提供工具集，简化微服务架构的实现和运维。

### 🎯 Spring Cloud 核心组件有哪些？各自作用？

- **服务注册与发现**：Eureka/Nacos（服务实例自动注册与发现）；
- **服务调用**：Feign（基于接口的声明式 REST 调用）；
- **负载均衡**：Ribbon（客户端负载均衡算法）；
- **熔断降级**：Hystrix/Sentinel（防止级联故障）；
- **网关**：Gateway（统一入口，路由、限流、认证）。

💻 代码示例
```java
// 服务提供者
@RestController
@EnableEurekaClient
public class UserController {
    
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}

// 服务消费者 - Feign客户端
@FeignClient(name = "user-service", fallback = UserServiceFallback.class)
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}

// 断路器降级
@Component
public class UserServiceFallback implements UserServiceClient {
    @Override
    public User getUser(Long id) {
        return new User(id, "默认用户", "服务降级");
    }
}

// Gateway网关配置
@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r.path("/users/**")
                .uri("lb://user-service"))
            .route("order-service", r -> r.path("/orders/**")
                .uri("lb://order-service"))
            .build();
    }
}
```

### 🎯 微服务之间如何进行通信？

"微服务间通信有多种方式，各有适用场景：

**同步通信**：

**HTTP/REST**：

- 最常用的通信方式
- 基于HTTP协议，简单易理解
- 使用JSON格式传输数据
- 工具：RestTemplate、OpenFeign

**RPC调用**：
- 远程过程调用，性能较好
- 支持多种协议：gRPC、Dubbo
- 强类型接口，开发效率高

**异步通信**：

**消息队列**：
- 基于消息中间件：RabbitMQ、Kafka
- 解耦服务间依赖关系
- 支持削峰填谷、事件驱动

**事件驱动**：
- 基于事件的异步通信
- 服务发布和订阅事件
- 实现最终一致性

**选择原则**：
- 实时性要求高：同步通信
- 解耦要求高：异步通信
- 性能要求高：RPC调用
- 简单场景：HTTP/REST"

**💻 代码示例**：
```java
// HTTP通信 - RestTemplate
@Service
public class OrderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUserInfo(Long userId) {
        String url = "http://user-service/users/" + userId;
        return restTemplate.getForObject(url, User.class);
    }
}

// HTTP通信 - OpenFeign
@FeignClient("user-service")
public interface UserClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable Long id);
}

// 消息队列通信
@Component
public class OrderEventPublisher {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(order);
        rabbitTemplate.convertAndSend("order.exchange", 
                                     "order.created", event);
    }
}

@RabbitListener(queues = "inventory.queue")
public void handleOrderCreated(OrderCreatedEvent event) {
    // 处理订单创建事件，更新库存
    inventoryService.updateInventory(event.getOrder());
}
```

### 🎯 微服务的分布式事务怎么处理？

"分布式事务是微服务架构的核心挑战，有多种解决方案：

**两阶段提交（2PC）**：
- 传统的强一致性解决方案
- 协调者和参与者模式
- 存在性能和可用性问题，不适合微服务

**TCC模式**：
- Try-Confirm-Cancel三个阶段
- 业务层面的补偿机制
- 实现复杂但控制精确

**Saga模式**：
- 长事务拆分为多个短事务
- 每个事务有对应的补偿操作
- 适合业务流程复杂的场景

**最终一致性**：
- 基于消息队列的异步处理
- 通过重试和补偿达到最终一致
- 性能好，但需要处理中间状态

**分布式事务框架**：
- Seata：阿里开源的分布式事务解决方案
- 支持AT、TCC、Saga等模式
- 对业务代码侵入性小

**最佳实践**：
- 避免分布式事务，通过设计规避
- 优先考虑最终一致性
- 重要业务场景使用TCC或Saga"

**💻 代码示例**：
```java
// Saga模式示例
@SagaOrchestrationStart
@Transactional
public class OrderSagaService {
    
    public void processOrder(Order order) {
        // 1. 创建订单
        orderService.createOrder(order);
        
        // 2. 扣减库存
        inventoryService.decreaseStock(order.getItems());
        
        // 3. 扣减积分
        pointService.decreasePoints(order.getUserId(), order.getPoints());
        
        // 4. 发送通知
        notificationService.sendOrderNotification(order);
    }
    
    // 补偿方法
    @SagaOrchestrationCancel
    public void cancelOrder(Order order) {
        notificationService.cancelNotification(order);
        pointService.compensatePoints(order.getUserId(), order.getPoints());
        inventoryService.compensateStock(order.getItems());
        orderService.cancelOrder(order);
    }
}

// 基于消息的最终一致性
@Service
public class OrderService {
    
    @Transactional
    public void createOrder(Order order) {
        // 1. 保存订单
        orderRepository.save(order);
        
        // 2. 发送事件消息
        OrderCreatedEvent event = new OrderCreatedEvent(order);
        messageProducer.send("order.created", event);
    }
}

@EventListener
public class InventoryEventHandler {
    
    @RabbitListener(queues = "inventory.order.queue")
    public void handleOrderCreated(OrderCreatedEvent event) {
        try {
            inventoryService.decreaseStock(event.getOrder().getItems());
            // 发送库存扣减成功事件
            messageProducer.send("inventory.decreased", 
                                new InventoryDecreasedEvent(event.getOrder()));
        } catch (Exception e) {
            // 发送库存扣减失败事件
            messageProducer.send("inventory.decrease.failed", 
                                new InventoryDecreaseFailedEvent(event.getOrder()));
        }
    }
}
```

---



## 📝 八、注解与配置

**核心理念**：Spring注解简化配置，提供声明式编程模型，实现约定大于配置的设计理念。

### 🎯 Spring常用注解有哪些？

"Spring提供了丰富的注解简化开发配置：

**核心注解**：

**@Component及其派生**：
- @Component：通用组件注解
- @Service：服务层组件
- @Repository：数据访问层组件
- @Controller：控制器组件
- @RestController：REST控制器（@Controller + @ResponseBody）

**依赖注入注解**：
- @Autowired：自动装配，按类型注入
- @Qualifier：指定具体实现类
- @Resource：按名称注入（JSR-250）
- @Value：注入配置值

**配置相关注解**：
- @Configuration：配置类
- @Bean：定义Bean
- @Import：导入其他配置
- @ComponentScan：组件扫描
- @Profile：环境配置

**Web相关注解**：
- @RequestMapping：请求映射
- @GetMapping/@PostMapping：HTTP方法映射
- @RequestParam：请求参数
- @PathVariable：路径变量
- @RequestBody/@ResponseBody：请求/响应体

**AOP注解**：
- @Aspect：切面
- @Pointcut：切点
- @Before/@After/@Around：通知类型

**事务注解**：
- @Transactional：声明式事务
- @EnableTransactionManagement：启用事务管理"

**💻 代码示例**：
```java
// 组件注解
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${app.default.page-size:10}")
    private int defaultPageSize;
    
    public Page<User> findUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
}

// Web注解
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        User saved = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}

// 配置注解
@Configuration
@EnableWebMvc
@ComponentScan("com.example")
public class WebConfig implements WebMvcConfigurer {
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new H2DataSource();
    }
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        return new MySQLDataSource();
    }
}
```

### 🎯 @Autowired和@Resource的区别？

"@Autowired和@Resource都用于依赖注入，但有重要区别：

**@Autowired（Spring注解）**：
- 按类型（byType）自动装配
- 可以配合@Qualifier按名称装配
- 可以标注在构造器、字段、方法上
- required属性控制是否必须注入
- Spring框架专有注解

**@Resource（JSR-250标准）**：
- 按名称（byName）自动装配
- name属性指定Bean名称
- type属性指定Bean类型
- 只能标注在字段和setter方法上
- Java标准注解，跨框架

**装配顺序**：
- @Resource：先按名称，再按类型
- @Autowired：先按类型，再按名称（配合@Qualifier）

**使用建议**：
- 推荐使用@Autowired + 构造器注入
- 需要按名称注入时使用@Qualifier
- 跨框架兼容时考虑@Resource"

**💻 代码示例**：
```java
@Service
public class UserService {
    
    // @Autowired按类型注入
    @Autowired
    private UserRepository userRepository;
    
    // @Autowired + @Qualifier按名称注入
    @Autowired
    @Qualifier("cacheUserRepository")
    private UserRepository cacheRepository;
    
    // @Resource按名称注入
    @Resource(name = "jdbcUserRepository")
    private UserRepository jdbcRepository;
    
    // 构造器注入（推荐）
    private final EmailService emailService;
    
    @Autowired
    public UserService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    // 可选依赖注入
    @Autowired(required = false)
    private SmsService smsService;
    
    public void notifyUser(User user, String message) {
        emailService.send(user.getEmail(), message);
        if (smsService != null) {
            smsService.send(user.getPhone(), message);
        }
    }
}
```

### 🎯 Spring中如何自定义注解？

"Spring支持自定义注解来简化重复配置：

**自定义注解步骤**：

**1. 定义注解**：
- 使用@interface关键字
- 添加@Target指定作用范围
- 添加@Retention指定生命周期
- 定义注解属性

**2. 注解处理**：
- AOP方式：通过切面处理
- BeanPostProcessor：Bean后处理器
- 反射机制：运行时处理

**3. 与Spring集成**：
- 结合Spring AOP实现横切关注点
- 利用Spring的依赖注入能力
- 配合事件机制实现解耦

**常见应用场景**：
- 日志记录：@Log
- 缓存控制：@Cache
- 权限检查：@RequireRole
- 重试机制：@Retry
- 限流控制：@RateLimit

**最佳实践**：
- 注解语义清晰，避免过度设计
- 提供合理的默认值
- 考虑注解的组合使用
- 完善的文档和示例"

**💻 代码示例**：
```java
// 自定义日志注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {
    String value() default "";
    LogLevel level() default LogLevel.INFO;
    boolean logParams() default true;
    boolean logResult() default true;
}

// 日志处理切面
@Aspect
@Component
public class LogAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(LogAspect.class);
    
    @Around("@annotation(log)")
    public Object doLog(ProceedingJoinPoint point, Log log) throws Throwable {
        String methodName = point.getSignature().getName();
        Object[] args = point.getArgs();
        
        // 记录方法调用
        if (log.logParams()) {
            logger.info("调用方法: {}, 参数: {}", methodName, args);
        }
        
        long startTime = System.currentTimeMillis();
        Object result = point.proceed();
        long endTime = System.currentTimeMillis();
        
        // 记录方法结果
        if (log.logResult()) {
            logger.info("方法: {} 执行完成, 耗时: {}ms, 结果: {}", 
                       methodName, endTime - startTime, result);
        }
        
        return result;
    }
}

// 自定义缓存注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Cache {
    String key() default "";
    int expire() default 300; // 5分钟
    TimeUnit timeUnit() default TimeUnit.SECONDS;
}

// 缓存处理器
@Component
public class CacheAnnotationProcessor implements BeanPostProcessor {
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        Class<?> clazz = bean.getClass();
        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(Cache.class)) {
                // 创建缓存代理
                return createCacheProxy(bean, method);
            }
        }
        return bean;
    }
    
    private Object createCacheProxy(Object bean, Method method) {
        return Proxy.newProxyInstance(
            bean.getClass().getClassLoader(),
            bean.getClass().getInterfaces(),
            new CacheInvocationHandler(bean, method)
        );
    }
}

// 使用自定义注解
@Service
public class UserService {
    
    @Log("查询用户信息")
    @Cache(key = "user:#{args[0]}", expire = 600)
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    @Log(value = "创建用户", logResult = false)
    public User createUser(User user) {
        return userRepository.save(user);
    }
}
```



### 🎯 Spring Boot 注解 原理?

**Spring Boot** 是基于 Spring 框架的一个开源框架，旨在简化 Spring 应用程序的配置和部署。Spring Boot 利用了大量的自动配置和开箱即用的功能，其中许多功能都通过注解来实现。理解 Spring Boot 的注解原理，能够帮助我们更好地理解其自动化配置的过程，以及如何扩展和自定义 Spring Boot 应用。

**常见的 Spring Boot 注解及其原理**

1. `@SpringBootApplication：复合注解，通常用在主类上，启动 Spring Boot 应用程序。它实际上包含了三个注解：

   - `@SpringBootConfiguration`：标识当前类为配置类，类似于 `@Configuration`，表示该类是 Spring 配置类，会被 Spring 容器加载。

   - `@EnableAutoConfiguration`：启用 Spring Boot 的自动配置功能，让 Spring Boot 根据项目的依赖和配置自动做出配置选择。

   - `@ComponentScan`：启用组件扫描，默认会扫描当前包及其子包下的所有 Spring 组件（包括 `@Component`、`@Service`、`@Repository`、`@Controller` 等注解）。

   **原理**：`@SpringBootApplication` 通过组合这些注解，实现了自动配置、组件扫描和 Spring 配置的功能，简化了开发人员的配置工作。

2. `@EnableAutoConfiguration`：开启了自动配置功能。它告诉 Spring Boot 自动为应用程序配置所需要的组件，避免了手动配置大量的 Bean。

   **原理**：`@EnableAutoConfiguration` 是通过 **条件化注解** (`@Conditional` 系列注解) 来实现的，Spring Boot 会根据项目的依赖（如类路径中的 jar 包）来判断是否启用相应的自动配置类。例如，如果项目中有 `spring-boot-starter-web` 依赖，Spring Boot 会自动配置 Tomcat、DispatcherServlet 等 Web 相关组件。

3. `@Configuration`：标记该类是一个配置类，类似于传统的 XML 配置文件，用于声明和定义 Spring Bean。

   **原理**：Spring 在类上使用 `@Configuration` 时，会将该类作为一个配置类处理。通过解析该类中的 `@Bean` 注解来生成 Spring Bean。`@Configuration` 实际上是 `@Component` 注解的扩展，意味着配置类也会被 Spring 容器管理。

4. `@ComponentScan`：用于告诉 Spring 框架去扫描指定包（及其子包）中的类，并将其作为 Spring Bean 进行注册。通常该注解与 `@Configuration` 一起使用。

   **原理**：Spring Boot 启动类使用 `@ComponentScan` 默认扫描当前包及其子包，查找 `@Component`、`@Service`、`@Repository` 等注解标注的类，将它们加入到 Spring 容器中。如果需要更改扫描路径，可以在注解中指定 `basePackages` 属性。

5. `@Conditional` ：是一种根据某些条件决定是否加载 Bean 的机制。在 Spring Boot 中，自动配置大量使用了 `@Conditional` 注解，以实现基于环境或配置的条件加载。

   **原理**：Spring Boot 使用 `@Conditional` 注解和多个具体的条件类（如 `@ConditionalOnProperty`、`@ConditionalOnClass`、`@ConditionalOnMissingBean` 等）来判断是否需要创建某些 Bean。例如，`@ConditionalOnClass` 会检查类路径中是否存在某个类，从而决定是否启用某个配置。

**Spring Boot 注解的工作原理总结**

1. **自动配置（`@EnableAutoConfiguration`）**：通过条件化注解，Spring Boot 根据项目的依赖和配置，自动选择并加载合适的配置类。每个自动配置类通常都有一个 `@Conditional` 注解，确保仅在满足特定条件时才会加载。
2. **组件扫描（`@ComponentScan`）**：Spring Boot 默认扫描主应用类所在包及其子包，自动将符合条件的类（如 `@Component` 注解的类）注册为 Spring Bean。
3. **配置绑定（`@Value` 和 `@ConfigurationProperties`）**：Spring Boot 提供的注解允许将配置文件中的值自动注入到 Java 类中，使得配置管理更加方便。
4. **Web 控制（`@RestController`）**：`@RestController` 注解结合了 `@Controller` 和 `@ResponseBody`，使得开发 RESTful API 更加简洁。

> **Spring Boot 注解** 在 Spring Boot 中发挥了重要作用，简化了开发流程。最核心的注解包括：
>
> - **@SpringBootApplication**：复合注解，包含了 `@Configuration`、`@EnableAutoConfiguration` 和 `@ComponentScan`，负责配置类的定义、自动配置的启用和组件扫描的开启。
> - **@EnableAutoConfiguration**：启用 Spring Boot 自动配置，根据类路径、环境等信息自动配置应用所需的组件。
> - **@ConfigurationProperties** 和 **@Value**：用于将外部配置（如 `application.properties`）注入到 Java 类中，`@ConfigurationProperties` 适合批量注入复杂配置，而 `@Value` 更适用于简单的单个值注入。
> - **@RestController**：简化 REST API 开发，结合了 `@Controller` 和 `@ResponseBody` 注解，使得方法返回的对象直接作为 HTTP 响应的内容。
>
> 这些注解共同作用，通过自动配置和条件化加载，为开发者提供了高效、简便的配置和开发体验。

---



## 🔧 九、高级特性与实践

**核心理念**：Spring提供了丰富的高级特性，包括事件机制、缓存抽象、国际化支持等，助力企业级应用开发。

### 🎯 Spring的事件机制怎么使用？

"Spring事件机制基于观察者模式，实现组件间的解耦通信：

**核心组件**：

**ApplicationEvent**：
- 事件基类，所有自定义事件需继承
- 包含事件源和时间戳信息
- 可以携带自定义数据

**ApplicationEventPublisher**：
- 事件发布器接口
- ApplicationContext实现了此接口
- 通过publishEvent方法发布事件

**ApplicationListener**：
- 事件监听器接口
- 泛型指定监听的事件类型
- 可以使用@EventListener注解简化

**事件处理特点**：
- 默认同步执行，可配置异步
- 支持事件过滤和条件监听
- 自动类型匹配，支持继承关系
- 可以设置监听器优先级

**应用场景**：
- 业务解耦：订单创建后通知库存、积分等
- 系统监控：性能指标收集
- 缓存更新：数据变更后缓存失效
- 日志审计：操作记录和审计日志"

**💻 代码示例**：
```java
// 自定义事件
public class OrderCreatedEvent extends ApplicationEvent {
    private final Order order;
    
    public OrderCreatedEvent(Object source, Order order) {
        super(source);
        this.order = order;
    }
    
    public Order getOrder() {
        return order;
    }
}

// 事件发布
@Service
public class OrderService {
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    @Transactional
    public Order createOrder(Order order) {
        Order savedOrder = orderRepository.save(order);
        
        // 发布事件
        OrderCreatedEvent event = new OrderCreatedEvent(this, savedOrder);
        eventPublisher.publishEvent(event);
        
        return savedOrder;
    }
}

// 事件监听
@Component
public class OrderEventListener {
    
    // 库存处理
    @EventListener
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        Order order = event.getOrder();
        inventoryService.reserveStock(order.getItems());
    }
    
    // 积分处理
    @EventListener
    @Order(1) // 设置优先级
    public void handlePointsCalculation(OrderCreatedEvent event) {
        Order order = event.getOrder();
        pointService.calculatePoints(order);
    }
    
    // 条件监听
    @EventListener(condition = "#event.order.amount > 1000")
    public void handleVipOrder(OrderCreatedEvent event) {
        // 处理VIP订单逻辑
        vipService.processVipOrder(event.getOrder());
    }
}

// 异步事件配置
@Configuration
@EnableAsync
public class AsyncEventConfig {
    
    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(25);
        executor.setThreadNamePrefix("Event-");
        executor.initialize();
        return executor;
    }
}
```

### 🎯 Spring Cache缓存抽象怎么使用？

"Spring Cache提供了声明式缓存抽象，支持多种缓存实现：

**核心注解**：

**@Cacheable**：
- 方法结果缓存，如果缓存存在直接返回
- 适用于查询方法
- 支持条件缓存和SpEL表达式

**@CacheEvict**：
- 缓存清除，删除指定缓存
- 适用于更新、删除操作
- 支持批量清除和条件清除

**@CachePut**：
- 缓存更新，总是执行方法并更新缓存
- 适用于更新操作

**@Caching**：
- 组合缓存操作
- 支持同时使用多个缓存注解

**缓存实现**：
- ConcurrentHashMap：简单内存缓存
- Redis：分布式缓存
- Ehcache：本地缓存
- Caffeine：高性能本地缓存

**高级特性**：
- 缓存穿透保护
- 缓存雪崩保护
- 自定义缓存键生成策略
- 缓存统计和监控"

**💻 代码示例**：
```java
// 启用缓存
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        RedisCacheManager.Builder builder = RedisCacheManager
            .RedisCacheManagerBuilder
            .fromConnectionFactory(jedisConnectionFactory())
            .cacheDefaults(cacheConfiguration());
        return builder.build();
    }
    
    private RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .disableCachingNullValues();
    }
}

@Service
public class UserService {
    
    // 缓存查询结果
    @Cacheable(value = "users", key = "#id")
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    // 条件缓存
    @Cacheable(value = "users", key = "#username", condition = "#username.length() > 3")
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // 缓存更新
    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    // 缓存清除
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    // 清除所有缓存
    @CacheEvict(value = "users", allEntries = true)
    public void clearAllUserCache() {
        // 清空所有用户缓存
    }
    
    // 组合缓存操作
    @Caching(
        put = @CachePut(value = "users", key = "#user.id"),
        evict = @CacheEvict(value = "userStats", allEntries = true)
    )
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
```

### 🎯 Spring如何实现国际化？

"Spring提供了完整的国际化（i18n）支持：

**核心组件**：

**MessageSource**：
- 消息资源接口，管理国际化消息
- ResourceBundleMessageSource：基于properties文件
- ReloadableResourceBundleMessageSource：支持热加载

**LocaleResolver**：
- 语言环境解析器，确定用户的Locale
- AcceptHeaderLocaleResolver：基于HTTP头
- SessionLocaleResolver：基于Session
- CookieLocaleResolver：基于Cookie

**LocaleChangeInterceptor**：
- 语言切换拦截器
- 监听语言切换请求参数

**实现步骤**：
1. 配置MessageSource和LocaleResolver
2. 创建不同语言的资源文件
3. 添加语言切换拦截器
4. 在代码中使用MessageSource获取消息
5. 在JSP/Thymeleaf模板中使用国际化标签

**最佳实践**：
- 统一的资源文件命名规范
- 使用键值对管理消息
- 支持参数化消息
- 提供友好的语言切换界面"

**💻 代码示例**：
```java
// 国际化配置
@Configuration
public class I18nConfig implements WebMvcConfigurer {
    
    @Bean
    public MessageSource messageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }
    
    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver resolver = new SessionLocaleResolver();
        resolver.setDefaultLocale(Locale.CHINA);
        return resolver;
    }
    
    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("lang");
        return interceptor;
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }
}

// 资源文件
// messages_zh_CN.properties
user.name=用户名
user.age=年龄
welcome.message=欢迎 {0}!

// messages_en_US.properties
user.name=Username
user.age=Age
welcome.message=Welcome {0}!

// 控制器使用
@Controller
public class HomeController {
    
    @Autowired
    private MessageSource messageSource;
    
    @GetMapping("/welcome")
    public String welcome(@RequestParam String username, 
                         Model model, HttpServletRequest request) {
        Locale locale = RequestContextUtils.getLocale(request);
        String message = messageSource.getMessage("welcome.message", 
                                                 new Object[]{username}, locale);
        model.addAttribute("message", message);
        return "welcome";
    }
}

// 工具类
@Component
public class I18nUtil {
    
    @Autowired
    private MessageSource messageSource;
    
    public String getMessage(String key, Object... args) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, args, locale);
    }
}
```

### 🎯 Spring WebFlux响应式编程怎么使用？

"Spring WebFlux是Spring 5引入的响应式Web框架，基于Reactor实现：

**核心概念**：

**响应式编程**：
- 基于异步数据流的编程模式
- 采用观察者模式，数据流驱动
- 非阻塞I/O，提高系统吞吐量
- 支持背压（Backpressure）处理

**Reactor核心类型**：
- Mono：表示0到1个元素的异步序列
- Flux：表示0到N个元素的异步序列
- 支持链式操作和函数式编程

**WebFlux vs Spring MVC**：

**Spring MVC**：
- 基于Servlet API，同步阻塞模型
- 每个请求对应一个线程
- 适合传统的CRUD应用
- 成熟稳定，生态完善

**Spring WebFlux**：
- 基于Reactive Streams，异步非阻塞
- 少量线程处理大量请求
- 适合高并发、I/O密集型应用
- 支持函数式和注解式编程

**适用场景**：
- 高并发的微服务应用
- 实时数据流处理
- 服务间异步通信
- SSE（Server-Sent Events）和WebSocket

**技术栈支持**：
- Netty、Undertow等非阻塞服务器
- R2DBC响应式数据库访问
- Spring Cloud Gateway响应式网关
- Redis Reactive、MongoDB Reactive等"

**💻 代码示例**：

```java
// WebFlux控制器
@RestController
public class ReactiveUserController {
    
    @Autowired
    private ReactiveUserService userService;
    
    // 返回单个用户
    @GetMapping("/users/{id}")
    public Mono<User> getUser(@PathVariable String id) {
        return userService.findById(id)
                .switchIfEmpty(Mono.error(new UserNotFoundException("用户不存在")));
    }
    
    // 返回用户列表
    @GetMapping("/users")
    public Flux<User> getUsers() {
        return userService.findAll()
                .delayElements(Duration.ofMillis(100)); // 模拟延迟
    }
    
    // 创建用户
    @PostMapping("/users")
    public Mono<User> createUser(@RequestBody Mono<User> userMono) {
        return userMono
                .flatMap(userService::save)
                .doOnSuccess(user -> log.info("用户创建成功: {}", user.getId()));
    }
    
    // 流式处理
    @GetMapping(value = "/users/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<User> streamUsers() {
        return userService.findAll()
                .delayElements(Duration.ofSeconds(1))
                .repeat();
    }
}

// 响应式Service
@Service
public class ReactiveUserService {
    
    @Autowired
    private ReactiveUserRepository userRepository;
    
    public Mono<User> findById(String id) {
        return userRepository.findById(id)
                .doOnNext(user -> log.debug("找到用户: {}", user))
                .doOnError(error -> log.error("查询用户失败: {}", error.getMessage()));
    }
    
    public Flux<User> findAll() {
        return userRepository.findAll()
                .filter(user -> user.isActive())
                .sort((u1, u2) -> u1.getName().compareTo(u2.getName()));
    }
    
    public Mono<User> save(User user) {
        return Mono.just(user)
                .filter(u -> StringUtils.hasText(u.getName()))
                .switchIfEmpty(Mono.error(new IllegalArgumentException("用户名不能为空")))
                .flatMap(userRepository::save);
    }
    
    // 批量处理
    public Flux<User> saveAll(Flux<User> users) {
        return users
                .filter(user -> StringUtils.hasText(user.getName()))
                .flatMap(this::save)
                .onErrorContinue((error, user) -> 
                    log.error("保存用户失败: {}, 错误: {}", user, error.getMessage()));
    }
}

// 函数式编程风格
@Configuration
public class RouterConfig {
    
    @Bean
    public RouterFunction<ServerResponse> userRoutes(UserHandler userHandler) {
        return RouterFunctions.route()
                .GET("/api/users", userHandler::getAllUsers)
                .GET("/api/users/{id}", userHandler::getUser)
                .POST("/api/users", userHandler::createUser)
                .PUT("/api/users/{id}", userHandler::updateUser)
                .DELETE("/api/users/{id}", userHandler::deleteUser)
                .build();
    }
}

@Component
public class UserHandler {
    
    @Autowired
    private ReactiveUserService userService;
    
    public Mono<ServerResponse> getAllUsers(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(userService.findAll(), User.class);
    }
    
    public Mono<ServerResponse> getUser(ServerRequest request) {
        String id = request.pathVariable("id");
        return userService.findById(id)
                .flatMap(user -> ServerResponse.ok().bodyValue(user))
                .switchIfEmpty(ServerResponse.notFound().build());
    }
    
    public Mono<ServerResponse> createUser(ServerRequest request) {
        return request.bodyToMono(User.class)
                .flatMap(userService::save)
                .flatMap(user -> ServerResponse.status(HttpStatus.CREATED).bodyValue(user))
                .onErrorResume(error -> ServerResponse.badRequest().bodyValue(error.getMessage()));
    }
}

// WebClient响应式HTTP客户端
@Service
public class ExternalApiService {
    
    private final WebClient webClient;
    
    public ExternalApiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.example.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
    }
    
    public Mono<UserInfo> getUserInfo(String userId) {
        return webClient.get()
                .uri("/users/{id}", userId)
                .retrieve()
                .onStatus(HttpStatus::is4xxClientError, 
                    response -> Mono.error(new RuntimeException("客户端错误")))
                .onStatus(HttpStatus::is5xxServerError,
                    response -> Mono.error(new RuntimeException("服务器错误")))
                .bodyToMono(UserInfo.class)
                .timeout(Duration.ofSeconds(5))
                .retry(3);
    }
    
    public Flux<UserInfo> getAllUsers() {
        return webClient.get()
                .uri("/users")
                .retrieve()
                .bodyToFlux(UserInfo.class)
                .onErrorReturn(Collections.emptyList())
                .flatMapIterable(list -> list);
    }
}
```



### 🎯 springMVC  和 spring WebFlux 区别？

`Spring MVC` 和 `Spring WebFlux` 都是 Spring 框架中用于构建 Web 应用程序的模块，但它们有一些根本性的区别，特别是在处理请求的方式和支持的编程模型上。以下是两者的主要区别和工作原理的详细说明：

1. **编程模型和架构**

- Spring MVC（同步阻塞式）

  Spring MVC 是一个基于 Servlet 的 Web 框架，遵循经典的请求-响应模型。它是一个 **同步阻塞** 的框架，即每个请求都由一个独立的线程处理，直到请求完成，线程才会被释放。其工作流程如下：

  1. **请求到达**：客户端发送请求到服务器，Tomcat 接收请求并交给 Spring MVC 处理。
  2. **请求分发**：DispatcherServlet 将请求传递给合适的控制器（Controller）。
  3. **处理请求**：控制器处理业务逻辑，调用服务层、数据访问层等。
  4. **视图解析**：返回模型和视图（ModelAndView），然后交由视图解析器（如 JSP）渲染成最终的 HTML。
  5. **响应返回**：最终的响应通过 Tomcat 返回到客户端。

​	Spring MVC 适用于传统的基于 Servlet 的 Web 应用，通常用于同步场景，像表单提交、处理重定向等。

2. **Spring WebFlux（异步非阻塞式）**

   Spring WebFlux 是一个 **异步非阻塞** 的 Web 框架，可以更好地处理高并发场景和 I/O 密集型操作。Spring WebFlux 适用于响应式编程模型，通过使用 **Reactor**（一个响应式编程库）提供的支持，能够以异步和非阻塞的方式处理请求。

   Spring WebFlux 可以运行在多种容器上，除了传统的 Servlet 容器（如 Tomcat），它还支持基于 Netty 等非 Servlet 容器的运行模式。它的工作原理如下：

   1. **请求到达**：客户端发送请求到服务器，Tomcat 或 Netty 接收请求。
   2. **请求分发**：DispatcherHandler 将请求传递给合适的控制器。
   3. **异步处理**：控制器在处理请求时，通常会返回一个 `Mono` 或 `Flux`（Reactor 库的异步数据流类型），这些类型代表了一个单一元素（Mono）或者多个元素（Flux）的异步响应。
   4. **响应返回**：通过事件驱动的方式，最终响应异步返回给客户端。

​	Spring WebFlux 适合高并发、I/O 密集型和实时数据流场景，像聊天系统、实时通知、数据流处理等。

| 特性                | Spring MVC                                      | Spring WebFlux                                         |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| **编程模型**        | 同步阻塞模型（传统的请求-响应模型）             | 异步非阻塞模型（响应式编程）                           |
| **线程模型**        | 每个请求分配一个线程，阻塞等待响应              | 请求通过事件循环处理，异步返回结果                     |
| **请求处理方式**    | 阻塞，处理请求时，线程会被占用                  | 非阻塞，线程可以用于其他任务，直到结果返回             |
| **I/O 模型**        | 阻塞式 I/O                                      | 非阻塞式 I/O                                           |
| **适用场景**        | 对同步请求较为适合，例如表单提交，传统 Web 应用 | 高并发、实时数据流处理，I/O 密集型场景，微服务         |
| **支持的容器**      | Servlet 容器（如 Tomcat）                       | Servlet 容器（如 Tomcat）及非 Servlet 容器（如 Netty） |
| **响应体类型**      | `ModelAndView`（同步返回）                      | `Mono` 和 `Flux`（异步返回）                           |
| **扩展性与性能**    | 高并发时性能较差，容易出现线程饱和              | 高并发时性能更优，线程利用率更高                       |
| **学习曲线**        | 更易上手，熟悉的编程模型                        | 学习曲线较陡，需要理解异步编程和响应式流               |
| **支持的 API 类型** | REST API、Web 应用                              | 支持 REST API，且更适合长连接和实时通信                |



### 🎯 Spring 框架中用到了哪些设计模式？

- **工厂设计模式** : Spring使用工厂模式通过 `BeanFactory`、`ApplicationContext` 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **模板方法模式** : Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **包装器设计模式** : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- **观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。
- **适配器模式** :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`。

---



## 🎯 十、面试重点与实践

**核心理念**：掌握Spring面试的关键技巧和常见陷阱，结合实际项目经验展现技术深度。

### 🎯 Spring面试常见陷阱和注意事项？

"Spring面试中有一些常见的陷阱和需要注意的点：

**概念混淆陷阱**：
- BeanFactory vs ApplicationContext：功能和使用场景区别
- @Component vs @Bean：注解驱动 vs Java配置
- AOP vs 过滤器：实现机制和适用场景不同

**生命周期理解陷阱**：
- Bean生命周期的完整流程要准确
- 循环依赖的解决机制要清楚
- 事务失效的常见场景要熟悉

**性能相关陷阱**：
- 单例Bean的线程安全问题
- @Transactional的性能影响
- AOP代理的创建开销

**配置相关陷阱**：
- 注解扫描范围要合理
- 配置文件的优先级顺序
- Profile环境配置的使用

**实践经验陷阱**：
- 不要只停留在理论层面
- 要能结合具体项目场景
- 要了解Spring在微服务中的应用

**回答技巧**：
- 先回答核心概念，再展开细节
- 结合代码示例说明
- 提及性能和最佳实践
- 展现解决实际问题的能力"

### 🎯 Spring Boot vs Spring Framework的区别？

"Spring Boot和Spring Framework是包含关系，不是替代关系：

**Spring Framework**：
- Spring生态的核心基础框架
- 提供IoC、AOP、事务管理等核心功能
- 需要大量XML或Java配置
- 学习曲线较陡峭，配置复杂

**Spring Boot**：
- 基于Spring Framework的快速开发框架
- 提供自动配置和起步依赖
- 约定大于配置，零配置启动
- 内嵌Web服务器，简化部署

**核心区别**：

**配置方式**：
- Spring Framework：需要显式配置Bean
- Spring Boot：自动配置，按需覆盖

**依赖管理**：
- Spring Framework：手动管理版本兼容
- Spring Boot：Starter依赖，版本仲裁

**部署方式**：
- Spring Framework：需要外部Web容器
- Spring Boot：内嵌容器，jar包直接运行

**开发效率**：
- Spring Framework：配置繁琐，开发慢
- Spring Boot：快速启动，开发效率高

**适用场景**：
- Spring Framework：需要精确控制配置的场景
- Spring Boot：快速开发，微服务架构"

### 🎯 如何设计一个Spring应用的整体架构？

"设计Spring应用架构需要考虑多个方面：

**分层架构设计**：

**表现层（Presentation Layer）**：
- 使用Spring MVC处理HTTP请求
- RestController提供RESTful API
- 参数校验和异常统一处理

**业务层（Business Layer）**：
- Service层封装业务逻辑
- 使用@Transactional管理事务
- 业务规则验证和流程控制

**数据访问层（Data Access Layer）**：
- Repository模式封装数据访问
- Spring Data JPA简化CRUD操作
- 多数据源配置和读写分离

**技术架构选型**：

**配置管理**：
- Spring Boot的外部化配置
- Config Server集中配置管理
- Profile环境区分

**安全框架**：
- Spring Security统一安全管理
- JWT无状态认证
- 方法级权限控制

**缓存策略**：
- Spring Cache抽象层
- Redis分布式缓存
- 多级缓存设计

**监控运维**：
- Spring Boot Actuator健康检查
- Micrometer指标收集
- 分布式链路追踪

**微服务架构**：
- Spring Cloud服务治理
- API网关统一入口
- 服务间通信和容错

**最佳实践**：
- 遵循SOLID设计原则
- 合理的包结构组织
- 统一的异常处理机制
- 完善的单元测试覆盖"

**💻 代码示例**：
```java
// 分层架构示例
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        UserDTO dto = UserMapper.toDTO(user);
        return ResponseEntity.ok(dto);
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid CreateUserRequest request) {
        User user = userService.createUser(request);
        UserDTO dto = UserMapper.toDTO(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public User createUser(CreateUserRequest request) {
        // 业务逻辑验证
        validateUserRequest(request);
        
        // 创建用户
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .build();
        
        User savedUser = userRepository.save(user);
        
        // 发送欢迎邮件
        emailService.sendWelcomeEmail(savedUser);
        
        // 发布用户创建事件
        eventPublisher.publishEvent(new UserCreatedEvent(savedUser));
        
        return savedUser;
    }
    
    private void validateUserRequest(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("用户名已存在");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("邮箱已存在");
        }
    }
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.status = 'ACTIVE'")
    List<User> findActiveUsers();
}

// 全局异常处理
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBusinessException(BusinessException e) {
        return ErrorResponse.builder()
            .code("BUSINESS_ERROR")
            .message(e.getMessage())
            .build();
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage()));
        
        return ErrorResponse.builder()
            .code("VALIDATION_ERROR")
            .message("参数校验失败")
            .errors(errors)
            .build();
    }
}
```

---

## 📚 总结与进阶

### 🎯 Spring学习路径建议

**基础阶段**：
1. **Spring Framework核心**：IoC、DI、AOP基础概念
2. **Spring MVC**：Web开发基础，请求处理流程
3. **Spring Data**：数据访问和事务管理
4. **Spring Security**：安全框架基础

**进阶阶段**：
1. **Spring Boot**：自动配置、Starter机制、监控
2. **Spring Cloud**：微服务架构、服务治理
3. **响应式编程**：WebFlux、Reactive Streams
4. **Native编译**：GraalVM Native Image

**实战阶段**：
1. **企业级项目**：完整的业务系统开发
2. **性能优化**：JVM调优、缓存策略、数据库优化
3. **架构设计**：微服务拆分、分布式系统设计
4. **DevOps实践**：CI/CD、容器化、云原生部署

### ⚡ 面试准备清单

- [ ] Spring Framework核心原理（IoC、AOP、Bean生命周期）
- [ ] Spring Boot自动配置和Starter机制
- [ ] Spring MVC请求处理流程和核心组件
- [ ] Spring事务管理和传播机制
- [ ] Spring Security认证授权流程
- [ ] Spring Cloud微服务组件
- [ ] 常用注解的作用和原理
- [ ] 实际项目中Spring的应用经验
- [ ] Spring相关的性能优化实践
- [ ] Spring生态的发展趋势

### 🚀 技术发展趋势

**云原生时代**：
- Spring Boot 3.x和Spring Framework 6.x
- 基于GraalVM的Native编译
- Kubernetes原生支持
- Serverless架构适配

**响应式编程**：
- Spring WebFlux异步非阻塞
- R2DBC响应式数据库访问
- 事件驱动架构设计

**人工智能集成**：
- Spring AI项目
- 向量数据库集成
- 机器学习模型服务化

---

**🎯 面试成功秘诀**：不仅要掌握Spring的理论知识，更要结合实际项目经验，展现解决实际问题的能力。准备好详细的项目案例，能够深入讲解Spring在项目中的应用和遇到的挑战及解决方案。记住：**技术深度 + 实战经验 + 清晰表达 = 面试成功**！

**🔥 最后提醒**：Spring生态庞大且发展迅速，保持持续学习的心态，关注官方文档和社区动态，在实践中不断提升技术深度和广度。祝你面试顺利，offer满满！ 🎉