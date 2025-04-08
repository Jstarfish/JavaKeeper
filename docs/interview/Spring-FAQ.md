---
title: Spring 面试集
date: 2022-06-31
tags: 
 - MySQL
categories: Spring
---

![](https://img.starfish.ink/common/faq-banner.png)

> 写在之前：不建议背书式的去记忆面试题，对技术的提升帮助很小，对正经面试也没什么帮助，准备面试的过程还是要把各个知识点真懂了，然后再连成线。
>
> 个人建议把面试题看作是费曼学习法中的回顾、简化的环节，准备面试的时候，跟着题目先自己讲给自己听，看看自己会满意吗，不满意就继续学习这个点，如此反复，心仪的offer肯定会有的。
>
> 当然，大家有遇到过什么样『有趣』『有含量』的题目，欢迎提出来，一起学习~

> 本文基于Spring Framework 4.x 总结的常见面试题，系统学习建议还是官方文档走起：https://spring.io/projects/spring-framework#learn

## 一、一般问题

### 开发中主要使用 Spring 的什么技术 ?

1. IOC 容器管理各层的组件
2. 使用 AOP 配置声明式事务
3. 整合其他框架



### 使用 **Spring** 框架能带来哪些好处?

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



### Spring有哪些优点？

- **轻量级**：Spring在大小和透明性方面绝对属于轻量级的，基础版本的Spring框架大约只有2MB。
- **控制反转(IOC)**：Spring使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象。
- **面向切面编程(AOP)**：Spring支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来。
- **容器**：Spring包含并管理应用程序对象的配置及生命周期。
- **MVC框架**：Spring的web框架是一个设计优良的web MVC框架，很好的取代了一些web框架。
- **事务管理**：Spring对下至本地业务上至全局业务(JAT)提供了统一的事务管理接口。
- **异常处理**：Spring提供一个方便的API将特定技术的异常(由JDBC, Hibernate, 或JDO抛出)转化为一致的、Unchecked异常。



### 简述 AOP 和 IOC 概念

**1. AOP（面向切面编程）**

**概念：**

- AOP（Aspect-Oriented Programming）是一种编程范式，旨在通过将横切关注点（cross-cutting concerns）与业务逻辑分离，从而提高代码的模块化。它通过定义切面（Aspect）来封装一类特定的功能（如日志记录、安全控制、事务管理等），并将这些功能应用到多个业务方法中。

**核心点：**

- **切面（Aspect）**：对横切关注点的封装，通常由切点（Pointcut）和通知（Advice）组成。
- **切点（Pointcut）**：定义在哪些方法上应用通知，可以基于方法的签名、注解等条件来选择。
- **通知（Advice）**：具体执行的动作，通知分为多种类型，比如`before`（前置通知）、`after`（后置通知）、`around`（环绕通知）等。
- **织入（Weaving）**：AOP将切面与目标对象结合的过程，通常在编译时、类加载时或运行时完成。

**应用场景：**

- AOP常用于日志记录、性能统计、事务管理等场景。

**2. IOC（控制反转）**

**概念：**

- IOC（Inversion of Control）是指将程序的控制权从程序中控制者转交给外部容器，特别是控制对象的创建和管理。简而言之，IOC通过依赖注入（DI）将对象之间的依赖关系交给框架来管理，从而减少了硬编码的依赖。

**核心点：**

- **依赖注入（DI）**：IOC 最常见的实现方式，主要通过构造函数注入、Setter方法注入和接口注入等方式，将外部依赖传递给目标对象。
- **容器管理**：IOC容器负责管理应用中的所有对象的生命周期和依赖关系。Spring是实现IOC的典型框架。
- **解耦**：IOC的核心思想是解耦，使得组件之间不直接依赖，而是通过容器注入来进行松耦合的集成。

**应用场景：**

- IOC广泛应用于大型企业级应用中，尤其是在Spring框架中，几乎所有的服务组件都由IOC容器进行管理。



### 说说 Spring Boot 和 Spring 的关系？

Spring Boot 是 Spring 开源组织下的子项目，是 Spring 组件一站式解决方案，主要是简化了使用 Spring 的难度，简省了繁重的配置，提供了各种启动器，开发者能快速上手。

Spring Boot 主要有如下优点：

1. 容易上手，提升开发效率，为 Spring 开发提供一个更快、更广泛的入门体验。
2. 开箱即用，远离繁琐的配置。
3. 提供了一系列大型项目通用的非业务性功能，例如：内嵌服务器、安全管理、运行数据监控、运行状况检查和外部化配置等。
4. 没有代码生成，也不需要XML配置。
5. 避免大量的 Maven 导入和各种版本冲突。

> Spring Boot 我理解就是把 spring spring mvc spring data jpa 等等的一些常用的常用的基础框架组合起来，提供默认的配置，然后提供可插拔的设计，就是各种 starter ，来方便开发者使用这一系列的技术，套用官方的一句话， spring 家族发展到今天，已经很庞大了，作为一个开发者，如果想要使用 spring 家族一系列的技术，需要一个一个的搞配置，然后还有个版本兼容性问题，其实挺麻烦的，偶尔也会有小坑出现，其实挺影响开发进度， spring boot 就是来解决这个问题，提供了一个解决方案吧，可以先不关心如何配置，可以快速的启动开发，进行业务逻辑编写，各种需要的技术，加入 starter 就配置好了，直接使用，可以说追求开箱即用的效果吧.

> 如果说 Spring 是一个家族，其实就是；它包含 spring core, spring mvc，spring boot与spring Cloud 等等；
>
> 那 spring boot 就像是这个家族中的大管家



### Spring Boot 中的 starter 到底是什么 ?

首先，这个 Starter 并非什么新的技术点，基本上还是基于 Spring 已有功能来实现的。首先它提供了一个自动化配置类，一般命名为 `XXXAutoConfiguration` ，在这个配置类中通过条件注解来决定一个配置是否生效（条件注解就是 Spring 中原本就有的），然后它还会提供一系列的默认配置，也允许开发者根据实际情况自定义相关配置，然后通过类型安全的属性注入将这些配置属性注入进来，新注入的属性会代替掉默认属性。正因为如此，很多第三方框架，我们只需要引入依赖就可以直接使用了。当然，开发者也可以自定义 Starter



### 让你设计一个spring-boot-starter你会怎么设计？

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



### spring-boot-starter-parent 有什么用 ?

`spring-boot-starter-parent` 是 Spring Boot 提供的一个父 POM（项目对象模型），用于简化 Spring Boot 项目的构建和依赖管理。它作为父级 POM，主要提供了许多方便的配置，包括版本管理、插件配置、依赖管理等。使用 `spring-boot-starter-parent` 可以减少很多手动配置的工作，让开发者专注于应用程序的开发而非构建过程：

1. **依赖管理**：`spring-boot-starter-parent` 预定义了 Spring Boot 相关依赖的版本，这意味着你不需要在每个模块的 `pom.xml` 中显式指定版本号，可以避免版本冲突和兼容性问题。
2. **插件管理**：它提供了一些预先配置的 Maven 插件，例如 `maven-compiler-plugin`（用于Java编译）、`maven-surefire-plugin`（用于单元测试）等，这些插件都已经配置好了适合大多数Spring Boot应用的参数。
3. **资源过滤和属性替换**：通过在父 POM 中定义资源过滤和属性替换规则，可以确保应用程序的配置文件（如 `application.properties`）在不同环境间正确切换。
4. **Spring Boot 应用的打包优化**：它配置了 `maven-war-plugin` 插件，使得打包的 WAR 文件中不包含 `META-INF` 目录下的 `pom.xml` 和 `pom.properties` 文件，这对于部署到 Servlet 容器是有益的。
5. **自动配置的依赖**：可以方便地引入 Spring Boot 的自动配置依赖，例如 `spring-boot-starter`，这可以自动配置应用程序的大部分设置。
6. **版本一致性**：确保所有 Spring Boot 相关依赖的版本一致，避免不同库之间的版本冲突。
7. **快速开始**：对于新项目，使用 `spring-boot-starter-parent` 可以快速开始，无需手动配置大量的 Maven 设置。
8. **继承和自定义**：如果需要，你可以继承 `spring-boot-starter-parent` 并根据项目需求进行自定义配置。



### Spring Boot 打成的 jar 和普通的 jar 有什么区别 ?

Spring Boot 项目最终打包成的 jar 是可执行 jar ，这种 jar 可以直接通过 `java -jar xxx.jar` 命令来运行，这种 jar 不可以作为普通的 jar 被其他项目依赖，即使依赖了也无法使用其中的类。

Spring Boot 的 jar 无法被其他项目依赖，主要还是他和普通 jar 的结构不同。普通的 jar 包，解压后直接就是包名，包里就是我们的代码，而 Spring Boot 打包成的可执行 jar 解压后，在 `\BOOT-INF\classes` 目录下才是我们的代码，因此无法被直接引用。如果非要引用，可以在 pom.xml 文件中增加配置，将 Spring Boot 项目打包成两个 jar ，一个可执行，一个可引用。



### 如何使用 Spring Boot 实现异常处理？

Spring Boot 提供了异常处理的多种方式，主要通过以下几种手段实现：

- 使用全局异常处理类（`@ControllerAdvice` 和 `@ExceptionHandler`）。
- 配置自定义错误页面或返回统一的 JSON 响应。
- 利用 Spring Boot 自带的 `ErrorController` 接口扩展默认异常处理逻辑。



### Spring Boot 启动流程？

Spring Boot 是一个基于 Spring 框架的快速开发框架，它简化了基于 Spring 的应用开发过程，提供了自动配置、微服务支持、监控等功能。Spring Boot 的启动流程主要包括以下几个步骤：

1. **初始化SpringApplication**：创建一个`SpringApplication`实例，它负责启动整个Spring Boot应用。

2. **运行SpringApplication.run()**：调用`run()`方法开始启动流程。这个方法会触发Spring Boot的自动配置机制。

3. **加载应用类**：SpringApplication会查找主类（带有`@SpringBootApplication`注解的类），这个类通常包含了应用的主要配置。

   > 主启动类被标注为 `@SpringBootApplication`，这是一个复合注解，包括 `@SpringBootConfiguration`、`@EnableAutoConfiguration` 和 `@ComponentScan`，它们分别负责配置类声明、启用自动配置和包扫描。

4. **创建并配置ApplicationContext**：SpringApplication会创建一个`ApplicationContext`，它是Spring应用的核心，负责管理Bean的生命周期和依赖注入。

5. **执行Bean定义的加载**：Spring Boot会加载所有的Bean定义，包括`@Component`、`@Service`、`@Repository`、`@Controller`等注解的类。

6. **自动配置**：Spring Boot的自动配置会根据类路径上的库、Bean的定义以及各种属性来决定配置哪些Bean。

   > `@EnableAutoConfiguration` 注解启用自动配置，通过读取 `META-INF/spring.factories` 文件，自动配置类会被加载并应用

7. **注册所有的Bean**：将所有配置好的Bean注册到`ApplicationContext`中。

8. **调用所有的ApplicationListener**：Spring Boot会调用所有注册的事件监听器，这些监听器可以对Spring的生命周期事件做出响应。

9. **刷新ApplicationContext**：调用`ApplicationContext.refresh()`方法，完成Bean的创建和初始化。

10. **运行所有的@PostConstruct注解的方法**：在Bean初始化之后，Spring会调用所有带有`@PostConstruct`注解的方法。

11. **调用所有的CommandLineRunner和ApplicationRunner**：如果应用中定义了`CommandLineRunner`或`ApplicationRunner`接口的实现，Spring Boot会在这时调用它们。

12. **应用启动完成**：所有上述步骤完成后，Spring Boot应用就启动完成了，可以对外提供服务。

这个流程是Spring Boot启动的大致概述，具体的实现细节可能会根据不同版本的Spring Boot有所差异。



### `CommandLineRunner` 或 `ApplicationRunner`接口区别

`CommandLineRunner` 和 `ApplicationRunner` 是 Spring Boot 提供的两个接口，用于在 Spring Boot 应用启动完成后运行特定代码。这两个接口的主要区别在于它们的 `run` 方法的参数类型。

1. **CommandLineRunner**：

   - `CommandLineRunner`接口包含一个`run`方法，其参数是`String... args`，即命令行参数的数组。

   - 这个接口适合于命令行工具或需要访问命令行参数的应用场景。

     ```java
     @Component
     public class MyCommandLineRunner implements CommandLineRunner {
         @Override
         public void run(String... args) throws Exception {
             // 可以访问命令行参数args
         }
     }
     ```

2. **ApplicationRunner**：

   - `ApplicationRunner`接口同样包含一个`run`方法，但其参数是`ApplicationArguments`类型的实例。

   - `ApplicationArguments`提供了更多关于命令行参数的高级处理能力，例如能够区分选项和非选项参数，或者获取所有的选项值等。

   - 这个接口适合于需要更细致控制命令行参数解析的应用场景。

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



## 二、依赖注入

IoC（Inverse of Control:控制反转）是一种**设计思想**，就是 **将原本在程序中手动创建对象的控制权，交由Spring框架来管理。** IoC 在其他语言中也有应用，并非 Spring 特有。 **IoC 容器是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个Map（key，value）,Map 中存放的是各种对象。**

将对象之间的相互依赖关系交给 IoC 容器来管理，并由 IoC 容器完成对象的注入。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。 **IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。** 在实际项目中一个 Service 类可能有几百甚至上千个类作为它的底层，假如我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IoC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。

### 什么是 Spring IOC 容器？

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



### 什么是 IoC？IoC 的实现原理？

**IoC（控制反转，Inversion of Control）** 是一种设计原则，目的是将控制权从传统的程序逻辑中反转到外部容器中，使得对象的创建和管理交给外部系统来处理，从而减轻对象间的耦合。简单来说，IoC 通过让外部容器来控制对象的创建和依赖关系的注入，避免了程序代码中手动创建对象的工作。

**IoC 的核心思想**

在传统的编程中，程序中会有显式的代码来创建对象并管理它们的生命周期。IoC 则通过将这些控制权交给容器，让容器在适当的时机创建对象，并根据需要注入对象的依赖项。

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



### 什么是 JavaConfig？

“JavaConfig 是 Spring 提供的一种基于 Java 类的配置方式，它通过 `@Configuration` 注解标识配置类，通过 `@Bean` 注解声明 Bean。相较于传统的 XML 配置，JavaConfig 提供了类型安全、灵活的配置方式，支持注解和 Java 语言的优势，使得配置更加简洁、可维护，并且与其他框架集成更加方便。”



### Spring 中有多少种 IOC 容器？

Spring 中的 org.springframework.beans 包和 org.springframework.context 包构成了 Spring 框架 IoC 容器的基础。

在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前，必须对它进行实例化。只有在容器实例化后， 才可以从 IOC 容器里获取 Bean 实例并使用

Spring 提供了两种类型的 IOC 容器实现

- BeanFactory：IOC 容器的基本实现

- ApplicationContext：提供了更多的高级特性，是 BeanFactory 的子接口

BeanFactory 是 Spring 框架的基础设施，面向 Spring 本身；ApplicationContext 面向使用 Spring 框架的开发者，几乎所有的应用场合都直接使用 ApplicationContext 而非底层的 BeanFactory；

无论使用何种方式, 配置文件是相同的。



###  BeanFactory 和 ApplicationContext 区别

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



### Spring IoC 的实现机制

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



### 请举例说明如何在 **Spring** 中注入一个 **Java Collection**?

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



## 三、Beans

### 什么是 Spring Beans？

- 它们是构成用户应用程序主干的对象
- Bean 由 Spring IoC 容器管理
- 它们由 Spring IoC 容器实例化，配置，装配和管理
- Bean 是基于用户提供给容器的配置元数据创建



### Spring 提供了哪些配置方式？

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
  
  

### Spring Bean的作用域？

- 在 Spring 中, 可以在 \<bean> 元素的 scope 属性里设置 Bean 的作用域。

- 默认情况下，Spring 只为每个在 IOC 容器里声明的 Bean 创建唯一一个实例，整个 IOC 容器范围内都能共享该实例：所有后续的 `getBean()` 调用和 Bean 引用都将返回这个唯一的 Bean 实例。该作用域被称为 **singleton**，它是所有 Bean 的默认作用域。

Spring 容器中的 bean 可以分为 5 个范围。所有范围的名称都是自说明的，但是为了避免混淆，还是让我们来解释一下：

1. **singleton**：这种bean范围是默认的，这种范围确保不管接受到多少个请求，每个容器中只有一个bean的实例，单例的模式由bean factory自身来维护。
2. **prototype**：原型范围与单例范围相反，为每一个bean请求提供一个实例。
3. **request**：每次HTTP请求都会创建一个新的bean，该作用于仅适用于WebApplicationContext环境，在请求完成以后，bean会失效并被垃圾回收器回收。
4. **Session**：同一个HTTP Session 共享一个bean，不同的 HTTP Session使用不同的bean。该作用于仅适用于WebApplicationContext环境，在session过期后，bean会随之失效。
5. **global-session**：全局session作用域，仅仅在基于portlet的web应用中才有意义，Spring5已经没有了。Portlet是能够生成语义代码(例如：HTML)片段的小型Java Web插件。它们基于portlet容器，可以像servlet一样处理HTTP请求。但是，与 servlet 不同，每个 portlet 都有不同的会话

全局作用域与Servlet中的session作用域效果相同。



### **Spring** 框架中的单例 **Beans** 是线程安全的么?

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



### Spring bean 容器的生命周期是什么样的？

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



### 什么是 Spring 装配?

在 Spring 框架中，**装配（Wiring）**是指将一个对象的依赖关系注入到另一个对象中的过程。通过装配，Spring 容器能够自动管理对象之间的依赖关系，从而减少了应用程序中显式地创建和管理对象的代码。装配是 Spring IoC（控制反转）容器的核心概念之一，它使得 Spring 应用能够轻松地将不同的组件连接在一起，形成完整的应用程序。

**Spring 装配的类型**

Spring 提供了几种不同的方式来装配 Bean，主要包括以下几种：

1. **构造器注入（Constructor Injection）**
2. **Setter 注入（Setter Injection）**
3. **字段注入（Field Injection）**
4. **自动装配（Autowiring）**
5. **基于 XML 配置的装配**

> 依赖注入的本质就是装配，装配是依赖注入的具体行为。



### 什么是bean自动装配？

**Bean 自动装配（Bean Autowiring）** 是 Spring 框架中的一项重要功能，用于自动满足一个对象对其他对象的依赖。通过自动装配，Spring 容器能够根据配置的规则，将所需的依赖对象自动注入到目标 Bean 中，而无需手动显式定义依赖关系。这种机制极大地简化了依赖注入的过程，使代码更加简洁和易于维护。

在Spring框架有多种自动装配，让我们逐一分析

1. **no**：这是Spring框架的默认设置，在该设置下自动装配是关闭的，开发者需要自行在beanautowire属性里指定自动装配的模式

2. **byName**：**按名称自动装配（结合 `@Qualifier` 注解）**如果容器中有多个相同类型的 Bean，可以使用 `@Qualifier` 注解结合 `@Autowired` 来按名称指定具体的 Bean。

3. **byType**：按类型自动装配 (`@Autowired` 默认方式)

4. **constructor**：通过在构造器上添加 `@Autowired` 注解，Spring 会根据构造器参数的类型自动注入对应的 Bean。这种方式可以确保在对象创建时，所有依赖项都已完全注入。

5. **autodetect**：Spring首先尝试通过 *constructor* 使用自动装配来连接，如果它不执行，Spring 尝试通过 *byType* 来自动装配【Spring 4.x 中已经被废弃】

在自动装配时，Spring 会检查容器中的所有 Bean，并根据规则选择一个合适的 Bean 来满足依赖。如果找不到匹配的 Bean 或找到多个候选 Bean，可能会抛出异常。



### 自动装配有什么局限？

- 基本数据类型的值、字符串字面量、类字面量无法使用自动装配来注入。
- 装配依赖中若是出现匹配到多个bean（出现歧义性），装配将会失败



### Spring Boot 自动配置原理是什么？

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



### 通过注解的方式配置bean | 什么是基于注解的容器配置

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

  

### 如何在 spring 中启动注解装配？

默认情况下，Spring 容器中未打开注解装配。因此，要使用基于注解装配，我们必须通过配置`<context：annotation-config />` 元素在 Spring 配置文件中启用它。



### Spring Boot 是否可以使用 XML 配置 ?

Spring Boot 推荐使用 Java 配置而非 XML 配置，但是 Spring Boot 中也可以使用 XML 配置，通过 @ImportResource 注解可以引入一个 XML 配置。



### spring boot 核心配置文件是什么？bootstrap.properties 和 application.properties 有何区别 ?

单纯做 Spring Boot 开发，可能不太容易遇到 bootstrap.properties 配置文件，但是在结合 Spring Cloud 时，这个配置就会经常遇到了，特别是在需要加载一些远程配置文件的时侯。

spring boot 核心的两个配置文件：

- bootstrap (. yml 或者 . properties)：boostrap 由父 ApplicationContext 加载的，比 applicaton 优先加载，配置在应用程序上下文的引导阶段生效。一般来说我们在 Spring Cloud Config 或者 Nacos 中会用到它。且 boostrap 里面的属性不能被覆盖；
- application (. yml 或者 . properties)： 由 ApplicatonContext 加载，用于 spring boot 项目的自动化配置。



### 什么是 Spring Profiles？

Spring Profiles 允许用户根据配置文件（dev，test，prod 等）来注册 bean。因此，当应用程序在开发中运行时，只有某些 bean 可以加载，而在 PRODUCTION 中，某些其他 bean 可以加载。假设我们的要求是 Swagger 文档仅适用于 QA 环境，并且禁用所有其他文档。这可以使用配置文件来完成。Spring Boot 使得使用配置文件非常简单。



### 如何在自定义端口上运行 Spring Boot 应用程序？

为了在自定义端口上运行 Spring Boot 应用程序，您可以在application.properties 中指定端口。

```properties
server.port = 8090
```



## 四、AOP

### 描述一下Spring AOP 呗？

AOP(Aspect-Oriented Programming，面向切面编程)：是一种新的方法论，是对传统 OOP(Object-Oriented Programming，面向对象编程) 的补充。在 OOP 中, 我们以类(class)作为我们的基本单元，而 AOP 中的基本单元是 **Aspect(切面)**

AOP 的主要编程对象是切面(aspect)

在应用 AOP 编程时, 仍然需要定义公共功能，但可以明确的定义这个功能在哪里,，以什么方式应用,，并且不必修改受影响的类。这样一来横切关注点就被模块化到特殊的对象(切面)里。

AOP 的好处:

- 每个事物逻辑位于一个位置，代码不分散，便于维护和升级
- 业务模块更简洁, 只包含核心业务代码

**AOP 术语**

- 切面（Aspect）：横切关注点（跨越应用程序多个模块的功能），被模块化的特殊对象
- 连接点（Joinpoint）：程序执行的某个特定位置，如类某个方法调用前、调用后、方法抛出异常后等。在这个位置我们可以插入一个 AOP 切面，它实际上是应用程序执行 Spring AOP 的位置

- 通知（Advice）： 通知是个在方法执行前或执行后要做的动作，实际上是程序执行时要通过 SpringAOP 框架触发的代码段。Spring 切面可以应用五种类型的通知：
  - before： 前置通知 ， 在一个方法执行前被调用
  - after：在方法执行之后调用的通知，无论方式执行是否成功
  - after-returning：仅当方法成功完成后执行的通知 
  - after-throwing：在方法抛出异常退出时执行的通知 
  - around：在方法执行之前和之后调用的通知

- 目标（Target）：被通知的对象，通常是一个代理对象，也指被通知（advice）对象
- 代理（Proxy）：向目标对象应用通知之后创建的对象
- 切点（pointcut）：每个类都拥有多个连接点，程序运行中的一些时间点，例如一个方法的执行，或者是一个异常的处理。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件。切点和连接点不是一对一的关系，一个切点匹配多个连接点，切点通过 `org.springframework.aop.Pointcut` 接口进行描述，它使用类和方法作为连接点的查询条件
- 引入（Introduction）：引入允许我们向现有的类添加新方法或属性
- 织入（Weaving）：织入是把切面应用到目标对象并创建新的代理对象的过程



**Spring  AOP**

- **AspectJ：**Java 社区里最完整最流行的 AOP 框架
- 在 Spring2.0 以上版本中, 可以使用基于 AspectJ 注解或基于 XML 配置的 AOP

**在 Spring 中启用 AspectJ 注解支持**

- 要在 Spring 应用中使用 AspectJ 注解, 必须在 classpath 下包含 AspectJ 类库：`aopalliance.jar`、`aspectj.weaver.jar` 和 `spring-aspects.jar`
- 将 aop Schema 添加到 `<beans>` 根元素中.
- 要在 Spring IOC 容器中启用 AspectJ 注解支持, 只要在 Bean 配置文件中定义一个空的 XML 元素 `<aop:aspectj-autoproxy>`
- 当 Spring IOC 容器侦测到 Bean 配置文件中的` <aop:aspectj-autoproxy>` 元素时, 会自动为与 AspectJ切面匹配的 Bean 创建代理.



### 有哪写类型的通知（Advice） | 用 AspectJ 注解声明切面

- 要在 Spring 中声明 AspectJ切面, 只需要在 IOC 容器中将切面声明为 Bean 实例. 当在 Spring IOC 容器中初始化 AspectJ切面之后, Spring IOC 容器就会为那些与 AspectJ切面相匹配的 Bean 创建代理.
- 在 AspectJ注解中, 切面只是一个带有 @Aspect 注解的 Java 类.
- 通知是标注有某种注解的简单的 Java 方法.
- AspectJ支持 5 种类型的通知注解:

  - @Before: 前置通知, 在方法执行之前执行
  - @After: 后置通知, 在方法执行之后执行
  - @AfterRunning: 返回通知, 在方法返回结果之后执行
  - @AfterThrowing: 异常通知, 在方法抛出异常之后
  - @Around: 环绕通知, 围绕着方法执行



### AOP 有哪些实现方式？

实现 AOP 的技术，主要分为两大类：

- 静态代理 - 指使用 AOP 框架提供的命令进行编译，从而在编译阶段就可生成 AOP 代理类，因此也称为编译时增强；
  - 编译时编织（特殊编译器实现）
  - 类加载时编织（特殊的类加载器实现）。
- 动态代理 - 在运行时在内存中“临时”生成 AOP 动态代理类，因此也被称为运行时增强。
  - JDK 动态代理
  - CGLIB



### Spring AOP 实现原理

Spring AOP 的实现原理基于**动态代理**和**字节码增强**，其核心是通过在运行时生成代理对象，将横切逻辑（如日志、事务）织入目标方法中。以下是其实现原理的详细解析：

> `Spring`的`AOP`实现原理其实很简单，就是通过**动态代理**实现的。如果我们为`Spring`的某个`bean`配置了切面，那么`Spring`在创建这个`bean`的时候，实际上创建的是这个`bean`的一个代理对象，我们后续对`bean`中方法的调用，实际上调用的是代理类重写的代理方法。而`Spring`的`AOP`使用了两种动态代理，分别是**JDK的动态代理**，以及**CGLib的动态代理**。

一、**核心实现机制：动态代理**

Spring AOP 通过两种动态代理技术实现切面逻辑的织入：

1. **JDK 动态代理**

   - **适用条件**：目标对象实现了至少一个接口。

   - **实现原理**：基于 `java.lang.reflect.Proxy` 类生成代理对象，代理类实现目标接口并重写方法。

   - 关键源码：

     ```java
     Proxy.newProxyInstance(ClassLoader, interfaces, InvocationHandler);
     ```

     在  `InvocationHandler#invoke()` 方法中拦截目标方法，执行切面逻辑（如前置通知、后置通知）。

2. **CGLIB 动态代理**

   - **适用条件**：目标对象未实现接口。

   - **实现原理**：通过继承目标类生成子类代理，覆盖父类方法并插入切面逻辑。

   - 关键源码：

     ```java
     Enhancer enhancer = new Enhancer();
     enhancer.setSuperclass(targetClass);
     enhancer.setCallback(MethodInterceptor);
     ```

     在 `MethodInterceptor#intercept()` 方法中实现方法拦截

二、核心组件

1. **切面（Aspect）**：由 **通知（Advice）** 和 **切点（Pointcut）** 组成，定义横切逻辑。
2. **切点（Pointcut）**：通过表达式（如 `execution(* com.example.service.*.*(..))`）匹配需要拦截的目标方法。
3. **通知（Advice）**
   - 类型：
     - `@Before`：在目标方法前执行。
     - `@After`：在目标方法后执行。
     - `@Around`：包裹目标方法，可控制方法执行。
   - **执行顺序**：通过拦截器链按顺序执行多个通知。

三、织入（Weaving）流程

1. **代理对象生成**
   - **入口**：`DefaultAopProxyFactory` 根据目标对象选择 JDK 或 CGLIB 代理。
   - 判断逻辑：
     - 目标类有接口 → JDK 动态代理。
     - 目标类无接口 → CGLIB 代理。
2. **拦截器链执行**
   - 流程：
     1. 通过 `AdvisedSupport` 获取匹配的拦截器链。
     2. 按顺序执行拦截器的通知逻辑。
     3. 调用目标方法。

> | **特性**     | **JDK 动态代理**                                             | **CGLIB 动态代理**                                           |
> | ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
> | **底层技术** | 基于 Java 反射机制，通过 `Proxy` 类和 `InvocationHandler` 接口生成代理类。 | 基于 **ASM 字节码框架**，通过生成目标类的子类实现代理。      |
> | **代理方式** | 只能代理实现了接口的类，生成接口的代理类。                   | 可代理普通类（无需接口），生成目标类的子类覆盖方法。         |
> | **性能**     | 方法调用通过反射实现，性能较低。                             | 通过 **FastClass 机制** 直接调用方法，性能更高（以空间换时间）。 |
> | **代码生成** | 运行时动态生成代理类的字节码。                               | 生成目标类的子类字节码，修改原始类结构。                     |
> | **适用场景** | 代理接口实现类，适用于轻量级应用。                           | 代理无接口的类，适用于高性能需求场景（如 Spring AOP）。      |
> | **优点**     | 1. 无需第三方库依赖；2. 代码简单易用。                       | 1. 支持代理普通类和 final 方法；2. 性能更高（FastClass 机制）。 |
> | **缺点**     | 1. 只能代理接口；2. 反射调用性能较低。                       | 1. 生成代理类耗时较长；2. 可能破坏类封装性（如代理 final 方法需特殊处理）。 |



### Spring AOP and AspectJ AOP 有什么区别？

- Spring AOP 基于动态代理方式实现，AspectJ 基于静态代理方式实现。
- Spring AOP 仅支持方法级别的 PointCut；提供了完全的 AOP 支持，它还支持属性级别的 PointCut。



### 你有没有⽤过Spring的AOP? 是⽤来⼲嘛的? ⼤概会怎么使⽤？		

Spring AOP 主要用于以下几个方面：

1. **日志记录**：在方法执行前后自动记录日志。
2. **性能监控**：在方法执行前后记录时间，监控性能。
3. **事务管理**：在方法执行前后自动管理事务。
4. **安全检查**：在方法执行前检查用户权限。
5. **缓存**：在方法执行后缓存结果以提高性能。
6. **异常处理**：在方法执行时统一处理异常。



### 过滤器和拦截器的区别

##### 过滤器（Filter）

- 作用：过滤器主要用于对请求和响应进行预处理和后处理。它可以在请求到达 Servlet 之前和响应返回客户端之前对请求和响应进行修改。

- 使用场景

  - **请求和响应的编码转换**：例如，将所有请求和响应的编码设置为 UTF-8。

  - **权限检查**：例如，检查用户是否已经登录，如果没有登录，则重定向到登录页面。

  - **日志记录**：记录每个请求的详细信息。

  - **过滤非法请求**：例如，过滤掉一些恶意的请求。

- **实现方式**

  过滤器是基于 Servlet API 的，通常需要实现 `javax.servlet.Filter` 接口，并在 web.xml 文件中配置或使用注解进行配置。

##### 拦截器（Interceptor）

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



## 五、数据访问

### Spring 对 JDBC的支持

JdbcTemplate简介

- 为了使 JDBC 更加易于使用, Spring 在 JDBC API 上定义了一个抽象层, 以此建立一个 JDBC 存取框架
- 作为 Spring JDBC 框架的核心， JDBCTemplate 的设计目的是为不同类型的 JDBC 操作提供模板方法。每个模板方法都能控制整个过程，并允许覆盖过程中的特定任务。通过这种方式，可以在尽可能保留灵活性的情况下，将数据库存取的工作量降到最低。

### Spring 支持哪些 ORM 框架

Hibernate、iBatis、JPA、JDO、OJB



## 六、事务

### Spring 中的事务管理

作为企业级应用程序框架,，Spring 在不同的事务管理 API 之上定义了一个抽象层，而应用程序开发人员不必了解底层的事务管理 API，就可以使用 Spring 的事务管理机制

Spring 既支持**编程式事务管理**，也支持**声明式的事务管理**

- 编程式事务管理：将事务管理代码嵌入到业务方法中来控制事务的提交和回滚，在编程式管理事务时，必须在每个事务操作中包含额外的事务管理代码，属于硬编码
- 声明式事务管理：大多数情况下比编程式事务管理更好用。它将事务管理代码从业务方法中分离出来，以声明的方式来实现事务管理。事务管理作为一种横切关注点，可以通过 AOP 方法模块化。Spring 通过 Spring AOP 框架支持声明式事务管理，**声明式事务又分为两种：**
  - 基于XML的声明式事务
  - 基于注解的声明式事务



### Spring Boot 的事务是怎么实现的？

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



### 事务管理器

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



### 用事务通知声明式地管理事务

- 事务管理是一种横切关注点
- 为了在 Spring 2.x 中启用声明式事务管理，可以通过 tx Schema 中定义的 \<tx:advice> 元素声明事务通知，为此必须事先将这个 Schema 定义添加到 \<beans> 根元素中去
- 声明了事务通知后，就需要将它与切入点关联起来。由于事务通知是在 \<aop:config> 元素外部声明的, 所以它无法直接与切入点产生关联，所以必须在 \<aop:config> 元素中声明一个增强器通知与切入点关联起来.
- 由于 Spring AOP 是基于代理的方法，所以只能增强公共方法。因此, 只有公有方法才能通过 Spring AOP 进行事务管理。



### 用 @Transactional 注解声明式地管理事务

- 除了在带有切入点，通知和增强器的 Bean 配置文件中声明事务外，Spring 还允许简单地用 @Transactional 注解来标注事务方法
- 为了将方法定义为支持事务处理的，可以为方法添加 @Transactional 注解，根据 Spring AOP 基于代理机制，**只能标注公有方法.**
- 可以在方法或者类级别上添加 @Transactional 注解。当把这个注解应用到类上时， 这个类中的所有公共方法都会被定义成支持事务处理的
- 在 Bean 配置文件中只需要启用 `<tx:annotation-driven>`元素, 并为之指定事务管理器就可以了
-  如果事务处理器的名称是 transactionManager, 就可以在 `<tx:annotation-driven>` 元素中省略 `transaction-manager` 属性，这个元素会自动检测该名称的事务处理器



### @Transactional 为什么不能用在私有方法上？

`@Transactional` 注解是 Spring 提供的一种声明式事务管理方式，它用于指定某个方法在执行时需要进行事务管理。通常，这个注解被用在公有（public）方法上，原因包括：

1. **代理机制**：Spring 的声明式事务管理是基于 AOP（面向切面编程）实现的。当使用 `@Transactional` 注解时，Spring 会为被注解的方法创建一个代理对象。对于非公有方法，Spring 无法在运行时动态地创建代理，因为这些方法不能被代理对象所调用。
2. **事务传播**：事务的传播依赖于方法调用链。`@Transactional` 注解通常用于服务层或对外的 API 方法上，这样可以确保在业务逻辑的开始处就开启事务，并在业务逻辑结束时提交或回滚事务。如果将 `@Transactional` 注解用在私有方法上，那么事务的传播行为（如传播级别、事务的保存点等）可能不会按预期工作。
3. **代码设计**：从设计的角度来看，将 `@Transactional` 注解用在公有方法上更符合业务逻辑的封装和分层。私有方法通常被设计为辅助方法，不应该独立承担事务管理的责任。
4. **事务的可见性**：将 `@Transactional` 注解用在公有方法上可以清晰地表明事务的边界，这对于理解和维护代码都是有益的。如果用在私有方法上，可能会隐藏事务的边界，使得其他开发者难以理解事务的范围。
5. **事务的粒度**：事务应该在业务逻辑的适当粒度上进行管理。通常，一个业务操作会跨越多个方法调用，将 `@Transactional` 注解用在私有方法上可能会导致过细的事务粒度，这不利于事务管理。
6. **Spring 版本限制**：在 Spring 5 之前的版本中，`@Transactional` 注解确实不能用于非公有方法。从 Spring 5 开始，引入了对非公有方法的支持，但是仍然推荐将 `@Transactional` 注解用在公有方法上。



### 事务传播属性

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



### Spring 支持的事务隔离级别

| 隔离级别                   | 含义                                                         |
| -------------------------- | ------------------------------------------------------------ |
| ISOLATION_DEFAULT          | 使用后端数据库默认的隔离级别。                               |
| ISOLATION_READ_UNCOMMITTED | 允许读取尚未提交的更改。可能导致脏读、幻影读或不可重复读。   |
| ISOLATION_READ_COMMITTED   | 允许从已经提交的并发事务读取。可防止脏读，但幻影读和不可重复读仍可能会发生。 |
| ISOLATION_REPEATABLE_READ  | 对相同字段的多次读取的结果是一致的，除非数据被当前事务本身改变。可防止脏读和不可重复读，但幻影读仍可能发生。 |
| ISOLATION_SERIALIZABLE     | 完全服从ACID的隔离级别，确保不发生脏读、不可重复读和幻影读。这在所有隔离级别中也是最慢的，因为它通常是通过完全锁定当前事务所涉及的数据表来完成的。 |

事务的隔离级别要得到底层数据库引擎的支持，而不是应用程序或者框架的支持；

Oracle 支持的 2 种事务隔离级别，Mysql支持 4 种事务隔离级别。



### 设置隔离事务属性

用 @Transactional 注解声明式地管理事务时可以在 @Transactional 的 isolation 属性中设置隔离级别

在 Spring 事务通知中, 可以在 `<tx:method>` 元素中指定隔离级别

### 设置回滚事务属性

- 默认情况下只有未检查异常(RuntimeException和Error类型的异常)会导致事务回滚，而受检查异常不会。
- 事务的回滚规则可以通过 @Transactional 注解的 rollbackFor和 noRollbackFor属性来定义，这两个属性被声明为 Class[] 类型的，因此可以为这两个属性指定多个异常类。

  - rollbackFor：遇到时必须进行回滚
  - noRollbackFor： 一组异常类，遇到时必须不回滚

###  超时和只读属性

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



## 七、MVC

### Spring MVC 框架有什么用？

Spring Web MVC 框架提供 **模型-视图-控制器** 架构和随时可用的组件，用于开发灵活且松散耦合的 Web 应用程序。 MVC 模式有助于分离应用程序的不同方面，如输入逻辑，业务逻辑和 UI 逻辑，同时在所有这些元素之间提供松散耦合。



### Spring MVC的优点

- 可以支持各种视图技术，而不仅仅局限于JSP
- 与Spring框架集成（如IoC容器、AOP等）
- 清晰的角色分配：前端控制器(dispatcherServlet) ，请求到处理器映射（handlerMapping)，处理器适配器（HandlerAdapter)， 视图解析器（ViewResolver）
- 支持各种请求资源的映射策略



### Spring MVC 的整体架构和核心组件？

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



### Spring MVC 的运行流程?

在整个 Spring MVC 框架中， DispatcherServlet 处于核心位置，负责协调和组织不同组件以完成请求处理并返回响应的工作

SpringMVC 处理请求过程：

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



### Spring 的 Controller 是单例的吗？多线程情况下 Controller 是线程安全吗？

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



### springMVC  和 spring WebFlux 区别？

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



### Spring MVC 对比 Spring Boot ？

Spring MVC 是 Spring 的 Web 模块，专注于请求处理与视图渲染，适合需要精细控制 Web 层的场景；而 Spring Boot 是 Spring 生态的快速开发工具，通过自动配置和内嵌服务器简化部署，适合快速构建独立应用。整合 Spring 生态（包括 Spring MVC），提供内嵌服务器（Tomcat/Jetty）、自动配置、Starter 依赖等特性。两者并非替代关系。

Spring Boot 是 Spring 生态的“脚手架”，默认集成 Spring MVC 作为 Web 层框架



## 八、注解

### 什么是基于Java的Spring注解配置? 给一些注解的例子

基于Java的配置，允许你在少量的Java注解的帮助下，进行你的大部分Spring配置而非通过XML文件。

以@Configuration 注解为例，它用来标记类可以当做一个bean的定义，被Spring IOC容器使用。

另一个例子是@Bean注解，它表示此方法将要返回一个对象，作为一个bean注册进Spring应用上下文。

```java
@Configuration
public class StudentConfig {
    @Bean
    public StudentBean myStudent() {
        return new StudentBean();
    }
}
```

### 怎样开启注解装配？

注解装配在默认情况下是不开启的，为了使用注解装配，我们必须在Spring配置文件中配置 `<context:annotation-config/>` 元素。

### Spring 常用注解:

##### @Controller

在SpringMVC 中，控制器Controller 负责处理由DispatcherServlet 分发的请求，它把用户请求的数据经过业务处理层处理之后封装成一个Model ，然后再把该Model 返回给对应的View 进行展示。在SpringMVC 中只需使用@Controller 标记一个类是Controller ，然后使用@RequestMapping 和@RequestParam 等一些注解用以定义URL 请求和Controller 方法之间的映射，这样的Controller 就能被外界访问到。

##### @RequestMapping

RequestMapping是一个用来处理请求地址映射的注解，可用于类或方法上

##### @RequestMapping 

Spring Framework 4.3 之后引入的基于HTTP方法的变体

- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`
- `@PatchMapping`

##### @PathVariable

用于将请求URL中的模板变量映射到功能处理方法的参数上，即取出uri模板中的变量作为参数

##### @RequestParam

使用@RequestParam绑定请求参数值，在处理方法入参处使用@RequestParam可以把请求参数传递给请求方法

- value：参数名
- required：是否必须。默认为true, 表示请求参数中必须包含对应的参数，若不存在，将抛出异常

##### @RequestBody

@RequestBody 表明方法参数应该绑定到HTTP请求体的值

##### @ResponseBody

@Responsebody 表示该方法的返回结果直接写入HTTP response body中

一般在异步获取数据时使用，在使用@RequestMapping后，返回值通常解析为跳转路径，加上@Responsebody后返回结果不会被解析为跳转路径，而是直接写入HTTP response body中。比如异步获取 json 数据，加上@Responsebody后，会直接返回 json 数据。

##### @Resource和@Autowired

@Resource和@Autowired都是做bean的注入时使用，其实@Resource并不是Spring的注解，它的包是javax.annotation.Resource，需要导入，但是Spring支持该注解的注入。

- 共同点：两者都可以写在字段和 setter 方法上。两者如果都写在字段上，那么就不需要再写 setter 方法。
- 不同点
  - @Autowired 为 Spring 提供的注解，@Autowired 注解是按照类型（byType）装配依赖对象，默认情况下它要求依赖对象必须存在，如果允许 null 值，可以设置它的 required 属性为 false。如果我们想使用按照名称（byName）来装配，可以结合 @Qualifier 注解一起使用
  - @Resource 默认按照 ByName 自动注入，由 J2EE 提供，需要导入包 `javax.annotation.Resource`。@Resource 有两个重要的属性：name 和 type，而 Spring 将@ Resource 注解的 name 属性解析为bean 的名字，而 type 属性则解析为 bean 的类型。所以，如果使用 name 属性，则使用 byName 的自动注入策略，而使用 type 属性时则使用 byType 自动注入策略。如果既不制定 name 也不制定 type 属性，这时将通过反射机制使用 byName 自动注入策略。

##### @ModelAttribute

方法入参标注该注解后, 入参的对象就会放到数据模型中

##### @SessionAttribute

将模型中的某个属性暂存到**HttpSession**中，以便多个请求之间可以共享这个属性

##### @CookieValue

@CookieValue可让处理方法入参绑定某个Cookie 值

##### @RequestHeader

请求头包含了若干个属性，服务器可据此获知客户端的信息，通过@RequestHeader即可将请求头中的属性值绑定到处理方法的入参中



### @Component, @Controller, @Repository, @Service 有何区别？

| **注解**        | **用途**                                                     | **层次**          | **独特功能**                                                 |
| --------------- | ------------------------------------------------------------ | ----------------- | ------------------------------------------------------------ |
| **@Component**  | 通用注解，标识任何由 Spring 管理的组件，适用于不属于其他特定分类的类（如工具类、配置类） | 无明确分层        | 无附加功能，仅用于组件注册。                                 |
| **@Controller** | 专用于 **Web 控制层**，处理 HTTP 请求和响应，常与 `@RequestMapping` 配合使用。 | 表现层（Web 层）  | 与 Spring MVC 深度整合，支持请求分发和视图解析。             |
| **@Service**    | 标识 **业务逻辑层**，封装复杂业务规则和事务管理。            | 业务层（Service） | 无技术强制功能，但通过语义强调业务逻辑，便于代码分层。       |
| **@Repository** | 用于 **数据访问层**（DAO），负责数据库操作。                 | 持久层（DAO 层）  | **自动转换数据库异常**（如 JDBC/SQL 异常 → Spring `DataAccessException`）。 |

1. **派生关系**：
   - `@Controller`、`@Service`、`@Repository`均继承自 `@Component`，本质上是其特化版本。
   - 技术层面，四者均可互换（例如用 `@Component` 替代 `@Service`），但会破坏语义和功能特性。
2. **功能差异**：
   - `@Repository` 的异常转换是唯一性功能，其他注解无法替代。
   - **@Controller** 与 Spring MVC 的 `DispatcherServlet` 深度绑定，支持视图解析和拦截器逻辑



### @Required 注解有什么作用

这个注解表明bean的属性必须在配置的时候设置，通过一个bean定义的显式的属性值或通过自动装配，若@Required注解的bean属性未被设置，容器将抛出 BeanInitializationException。示例：

```java
public class Employee {
    private String name;
    @Required
    public void setName(String name){
        this.name=name;
    }
    public string getName(){
        return name;
    }
}
```



### @Autowired 注解有什么作用

@Autowired默认是按照类型装配注入的，默认情况下它要求依赖对象必须存在（可以设置它required属性为false）。@Autowired 注解提供了更细粒度的控制，包括在何处以及如何完成自动装配。它的用法和@Required一样，修饰setter方法、构造器、属性或者具有任意名称和/或多个参数的PN方法。

```java
public class Employee {
    private String name;
    @Autowired
    public void setName(String name) {
        this.name=name;
    }
    public string getName(){
        return name;
    }
}
```



### @Qualifier 注解有什么作用

当创建多个相同类型的 bean 并希望仅使用属性装配其中一个 bean 时，可以使用 @Qualifier 注解和 @Autowired 通过指定应该装配哪个确切的 bean 来消除歧义。



### @RequestMapping 注解有什么用？

@RequestMapping 注解用于将特定 HTTP 请求方法映射到将处理相应请求的控制器中的特定类/方法。此注释可应用于两个级别：

- 类级别：映射请求的 URL
- 方法级别：映射 URL 以及 HTTP 请求方法



### Spring Boot 注解 原理?

**Spring Boot** 是基于 Spring 框架的一个开源框架，旨在简化 Spring 应用程序的配置和部署。Spring Boot 利用了大量的自动配置和开箱即用的功能，其中许多功能都通过注解来实现。理解 Spring Boot 的注解原理，能够帮助我们更好地理解其自动化配置的过程，以及如何扩展和自定义 Spring Boot 应用。

**常见的 Spring Boot 注解及其原理**

1. `@SpringBootApplication：复合注解，通常用在主类上，启动 Spring Boot 应用程序。它实际上包含了三个注解：

   - `@SpringBootConfiguration`：标识当前类为配置类，类似于 `@Configuration`，表示该类是 Spring 配置类，会被 Spring 容器加载。

   - `@EnableAutoConfiguration`：启用 Spring Boot 的自动配置功能，让 Spring Boot 根据项目的依赖和配置自动做出配置选择。

   - `@ComponentScan`：启用组件扫描，默认会扫描当前包及其子包下的所有 Spring 组件（包括 `@Component`、`@Service`、`@Repository`、`@Controller` 等注解）。

   **原理**：`@SpringBootApplication` 通过组合这些注解，实现了自动配置、组件扫描和 Spring 配置的功能，简化了开发人员的配置工作。

2. `@EnableAutoConfiguration：开启了自动配置功能。它告诉 Spring Boot 自动为应用程序配置所需要的组件，避免了手动配置大量的 Bean。

   **原理**：`@EnableAutoConfiguration` 是通过 **条件化注解** (`@Conditional` 系列注解) 来实现的，Spring Boot 会根据项目的依赖（如类路径中的 jar 包）来判断是否启用相应的自动配置类。例如，如果项目中有 `spring-boot-starter-web` 依赖，Spring Boot 会自动配置 Tomcat、DispatcherServlet 等 Web 相关组件。

3. `@Configuration：标记该类是一个配置类，类似于传统的 XML 配置文件，用于声明和定义 Spring Bean。

   **原理**：Spring 在类上使用 `@Configuration` 时，会将该类作为一个配置类处理。通过解析该类中的 `@Bean` 注解来生成 Spring Bean。`@Configuration` 实际上是 `@Component` 注解的扩展，意味着配置类也会被 Spring 容器管理。

4. `@ComponentScan`：用于告诉 Spring 框架去扫描指定包（及其子包）中的类，并将其作为 Spring Bean 进行注册。通常该注解与 `@Configuration` 一起使用。

   **原理**：Spring Boot 启动类使用 `@ComponentScan` 默认扫描当前包及其子包，查找 `@Component`、`@Service`、`@Repository` 等注解标注的类，将它们加入到 Spring 容器中。如果需要更改扫描路径，可以在注解中指定 `basePackages` 属性。

5. `@Conditional` ：是一种根据某些条件决定是否加载 Bean 的机制。在 Spring Boot 中，自动配置大量使用了 `@Conditional` 注解，以实现基于环境或配置的条件加载。

   **原理**：Spring Boot 使用 `@Conditional` 注解和多个具体的条件类（如 `@ConditionalOnProperty`、`@ConditionalOnClass`、`@ConditionalOnMissingBean` 等）来判断是否需要创建某些 Bean。例如，`@ConditionalOnClass` 会检查类路径中是否存在某个类，从而决定是否启用某个配置。

#### Spring Boot 注解的工作原理总结

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

------



## 九、其他问题

### Spring 框架中用到了哪些设计模式？

- **工厂设计模式** : Spring使用工厂模式通过 `BeanFactory`、`ApplicationContext` 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **模板方法模式** : Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **包装器设计模式** : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- **观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。
- **适配器模式** :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`。



### Spring Boot 的核心注解是哪个？它主要由哪几个注解组成的？

启动类上面的注解是@SpringBootApplication，它也是 Spring Boot 的核心注解，主要组合包含了以下 3 个注解：

- @SpringBootConfiguration：组合了 @Configuration 注解，实现配置文件的功能。
- @EnableAutoConfiguration：打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置功能： @SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })。
- @ComponentScan：Spring组件扫描。



### 如何实现 Spring Boot 应用程序的安全性？

为了实现 Spring Boot 的安全性，我们使用 spring-boot-starter-security 依赖项，并且必须添加安全配置。它只需要很少的代码。配置类将必须扩展WebSecurityConfigurerAdapter 并覆盖其方法。



### 比较一下 Spring Security 和 Shiro 各自的优缺点 ?

由于 Spring Boot 官方提供了大量的非常方便的开箱即用的 Starter ，包括 Spring Security 的 Starter ，使得在 Spring Boot 中使用 Spring Security 变得更加容易，甚至只需要添加一个依赖就可以保护所有的接口，所以，如果是 Spring Boot 项目，一般选择 Spring Security 。当然这只是一个建议的组合，单纯从技术上来说，无论怎么组合，都是没有问题的。Shiro 和 Spring Security 相比，主要有如下一些特点：

1. Spring Security 是一个重量级的安全管理框架；Shiro 则是一个轻量级的安全管理框架
2. Spring Security 概念复杂，配置繁琐；Shiro 概念简单、配置简单
3. Spring Security 功能强大；Shiro 功能简单



### Spring Boot 中如何解决跨域问题 ?

跨域可以在前端通过 JSONP 来解决，但是 JSONP 只可以发送 GET 请求，无法发送其他类型的请求，在 RESTful 风格的应用中，就显得非常鸡肋，因此我们推荐在后端通过 （CORS，Cross-origin resource sharing） 来解决跨域问题。这种解决方案并非 Spring Boot 特有的，在传统的 SSM 框架中，就可以通过 CORS 来解决跨域问题，只不过之前我们是在 XML 文件中配置 CORS ，现在可以通过实现WebMvcConfigurer接口然后重写addCorsMappings方法解决跨域问题。

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(3600);
    }

}
```

项目中前后端分离部署，所以需要解决跨域的问题。
我们使用cookie存放用户登录的信息，在spring拦截器进行权限控制，当权限不符合时，直接返回给用户固定的json结果。
当用户登录以后，正常使用；当用户退出登录状态时或者token过期时，由于拦截器和跨域的顺序有问题，出现了跨域的现象。
我们知道一个http请求，先走filter，到达servlet后才进行拦截器的处理，如果我们把cors放在filter里，就可以优先于权限拦截器执行。

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

}
```



### 什么是 CSRF 攻击？

CSRF 代表跨站请求伪造。这是一种攻击，迫使最终用户在当前通过身份验证的Web 应用程序上执行不需要的操作。CSRF 攻击专门针对状态改变请求，而不是数据窃取，因为攻击者无法查看对伪造请求的响应。



### Spring Boot 中的监视器是什么？

Spring boot actuator 是 spring 启动框架中的重要功能之一。Spring boot 监视器可帮助您访问生产环境中正在运行的应用程序的当前状态。有几个指标必须在生产环境中进行检查和监控。即使一些外部应用程序可能正在使用这些服务来向相关人员触发警报消息。监视器模块公开了一组可直接作为 HTTP URL 访问的REST 端点来检查状态。



### 如何在 Spring Boot 中禁用 Actuator 端点安全性？

默认情况下，所有敏感的 HTTP 端点都是安全的，只有具有 ACTUATOR 角色的用户才能访问它们。安全性是使用标准的 HttpServletRequest.isUserInRole 方法实施的。 我们可以使用来禁用安全性。只有在执行机构端点在防火墙后访问时，才建议禁用安全性。



### 我们如何监视所有 Spring Boot 微服务？

Spring Boot 提供监视器端点以监控各个微服务的度量。这些端点对于获取有关应用程序的信息（如它们是否已启动）以及它们的组件（如数据库等）是否正常运行很有帮助。但是，使用监视器的一个主要缺点或困难是，我们必须单独打开应用程序的知识点以了解其状态或健康状况。想象一下涉及 50 个应用程序的微服务，管理员将不得不击中所有 50 个应用程序的执行终端。为了帮助我们处理这种情况，我们将使用位于的开源项目。 它建立在 Spring Boot Actuator 之上，它提供了一个 Web UI，使我们能够可视化多个应用程序的度量。
