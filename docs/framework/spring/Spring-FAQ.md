

> 基于Spring Framework 4.x，系统学习建议还是官方文档走起：https://spring.io/projects/spring-framework#learn

## 一、一般问题

### 开发中主要使用 Spring 的什么技术 ?

①. IOC 容器管理各层的组件

②. 使用 AOP 配置声明式事务

③. 整合其他框架.



### Spring有哪些优点？

- **轻量级：**Spring在大小和透明性方面绝对属于轻量级的，基础版本的Spring框架大约只有2MB。
- **控制反转(IOC)：**Spring使用控制反转技术实现了松耦合。依赖被注入到对象，而不是创建或寻找依赖对象。
- **面向切面编程(AOP)：** Spring支持面向切面编程，同时把应用的业务逻辑与系统的服务分离开来。
- **容器：**Spring包含并管理应用程序对象的配置及生命周期。
- **MVC框架：**Spring的web框架是一个设计优良的web MVC框架，很好的取代了一些web框架。
- **事务管理：**Spring对下至本地业务上至全局业务(JAT)提供了统一的事务管理接口。
- **异常处理：**Spring提供一个方便的API将特定技术的异常(由JDBC, Hibernate, 或JDO抛出)转化为一致的、Unchecked异常。



### Spring模块

![spring overview](https://docs.spring.io/spring/docs/4.3.27.RELEASE/spring-framework-reference/htmlsingle/images/spring-overview.png)

### 简述 AOP 和 IOC 概念

AOP: Aspect Oriented Program, 面向(方面)切面的编程;Filter(过滤器)也是一种 AOP. AOP 是一种新的 方法论, 是对传统 OOP(Object-OrientedProgramming, 面向对象编程) 的补充. AOP 的主要编程对象是切面(aspect),而切面模块化横切关注点.可以举例通过事务说明.

IOC: Invert Of Control, 控制反转. 也称为 DI(依赖注入)其思想是反转资源获取的方向. 传统的资源查找方式要求组件向容器发起请求查找资源.作为回应, 容器适时的返回资源. 而应用了 IOC 之后, 则是容器主动地将资源推送给它所管理的组件,组件所要做的仅是选择一种合适的方式来接受资源. 这种行为也被称为查找的被动形式



## 二、依赖注入（IoC）

IoC（Inverse of Control:控制反转）是一种**设计思想**，就是 **将原本在程序中手动创建对象的控制权，交由Spring框架来管理。** IoC 在其他语言中也有应用，并非 Spring 特有。 **IoC 容器是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个Map（key，value）,Map 中存放的是各种对象。**

将对象之间的相互依赖关系交给 IoC 容器来管理，并由 IoC 容器完成对象的注入。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。 **IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。** 在实际项目中一个 Service 类可能有几百甚至上千个类作为它的底层，假如我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IoC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。

### 什么是 Spring IOC 容器？

Spring 框架的核心是 Spring 容器。容器创建对象，将它们装配在一起，配置它们并管理它们的完整生命周期。Spring 容器使用依赖注入来管理组成应用程序的组件。容器通过读取提供的配置元数据来接收对象进行实例化，配置和组装的指令。该元数据可以通过 XML，Java 注解或 Java 代码提供。

![image.png](https://upload-images.jianshu.io/upload_images/3101171-33099411d16ca051.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



### 什么是依赖注入？

**依赖注入是在编译阶段尚未知所需的功能是来自哪个的类的情况下，将其他对象所依赖的功能对象实例化的模式**。这就需要一种机制用来激活相应的组件以提供特定的功能，所以**依赖注入是控制反转的基础**。否则如果在组件不受框架控制的情况下，框架又怎么知道要创建哪个组件？

依赖注入有以下三种实现方式：

1. 构造器注入
2. Setter方法注入（属性注入）
3. 接口注入



### spring 中有多少种 IOC 容器？

在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前，必须对它进行实例化.。只有在容器实例化后， 才可以从 IOC 容器里获取 Bean 实例并使用

Spring 提供了两种类型的 IOC 容器实现.

- BeanFactory： IOC 容器的基本实现

- ApplicationContext: 提供了更多的高级特性，是 BeanFactory的子接口

BeanFactory是 Spring 框架的基础设施，面向 Spring 本身；ApplicationContext 面向使用 Spring 框架的开发者，几乎所有的应用场合都直接使用 ApplicationContext 而非底层的 BeanFactory；

无论使用何种方式, 配置文件是相同的。



###  BeanFactory 和 ApplicationContext 区别

| BeanFactory                | ApplicationContext       |
| -------------------------- | ------------------------ |
| 懒加载                     | 即时加载                 |
| 它使用语法显式提供资源对象 | 它自己创建和管理资源对象 |
| 不支持国际化               | 支持国际化               |
| 不支持基于依赖的注解       | 支持基于依赖的注解       |



**ApplicationContext**

ApplicationContext 的主要实现类：

- ClassPathXmlApplicationContext：从 类路径下加载配置文件
- FileSystemXmlApplicationContext: 从文件系统中加载配置文件

- ConfigurableApplicationContext 扩展于 ApplicationContext，新增加两个主要方法：refresh() 和 close()， 让 ApplicationContext具有启动、刷新和关闭上下文的能力
- WebApplicationContext 是专门为 WEB 应用而准备的，它允许从相对于 WEB 根目录的路径中完成初始化工作
- ApplicationContext 在初始化上下文时就实例化所有单例的 Bean

![](https://imgkr.cn-bj.ufileos.com/9f366f70-4b1e-48f5-8301-811398b8d25f.png)

**从 IOC 容器中获取 Bean**

-  调用 ApplicationContext 的 getBean() 方法

![](https://imgkr.cn-bj.ufileos.com/3aa6c769-3b9a-4882-b2e1-622c127437a3.png)

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");
HelloWorld helloWorld = (HelloWorld) ctx.getBean("helloWorld");
helloWorld.hello();
```



### 列举 IoC 的一些好处

- 它将最小化应用程序中的代码量；
- 它将使您的应用程序易于测试，因为它不需要单元测试用例中的任何单例或 JNDI 查找机制；
- 它以最小的影响和最少的侵入机制促进松耦合；
- 它支持即时的实例化和延迟加载服务



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
        Fruit f=null;
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
        Fruit f=Factory.getInstance("io.github.dunwu.spring.Apple");
        if(f!=null){
            f.eat();
        }
    }
}
```



## 三、Beans

### 什么是 Spring Beans？

- 它们是构成用户应用程序主干的对象
- Bean 由 Spring IoC 容器管理
- 它们由 Spring IoC 容器实例化，配置，装配和管理
- Bean 是基于用户提供给容器的配置元数据创建

![Bean generation - Spring Interview Questions - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/bean.png)



### spring 提供了哪些配置方式？

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

  	1. @Bean 注解扮演与 `<bean/> ` 元素相同的角色。
   	2. @Configuration 类允许通过简单地调用同一个类中的其他 @Bean 方法来定义 bean 间依赖关系。

  例如：

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

- 在 Spring 中, 可以在 <bean> 元素的 scope属性里设置 Bean 的作用域。

- 默认情况下，Spring 只为每个在 IOC 容器里声明的 Bean 创建唯一一个实例, 整个 IOC 容器范围内都能共享该实例：所有后续的 getBean() 调用和 Bean 引用都将返回这个唯一的 Bean 实例。该作用域被称为 **singleton**，它是所有 Bean 的默认作用域。

Spring容器中的bean可以分为5个范围。所有范围的名称都是自说明的，但是为了避免混淆，还是让我们来解释一下：

1. **singleton**：这种bean范围是默认的，这种范围确保不管接受到多少个请求，每个容器中只有一个bean的实例，单例的模式由bean factory自身来维护。
2. **prototype**：原型范围与单例范围相反，为每一个bean请求提供一个实例。
3. **request**：每次HTTP请求都会创建一个新的bean，该作用于仅适用于WebApplicationContext环境，在请求完成以后，bean会失效并被垃圾回收器回收。
4. **Session**：同一个HTTP Session 共享一个bean，不同的 HTTP Session使用不同的bean。该作用于仅适用于WebApplicationContext环境，在session过期后，bean会随之失效。
5. **global-session**：全局session作用域，仅仅在基于portlet的web应用中才有意义，Spring5已经没有了。Portlet是能够生成语义代码(例如：HTML)片段的小型Java Web插件。它们基于portlet容器，可以像servlet一样处理HTTP请求。但是，与 servlet 不同，每个 portlet 都有不同的会话

全局作用域与Servlet中的session作用域效果相同。



### Spring bean 容器的生命周期是什么样的？

Spring IOC 容器可以管理 Bean 的生命周期, Spring 允许在 Bean 生命周期的特定点执行定制的任务.

Spring bean 容器的生命周期流程如下：

1. Spring 容器根据配置中的 bean 定义实例化 bean；
2. Spring 使用依赖注入填充所有属性，如 bean 中所定义的配置；
3. 如果 bean 实现 BeanNameAware 接口，则工厂通过传递 bean 的 ID 来调用 setBeanName()；
4. 如果 bean 实现 BeanFactoryAware 接口，工厂通过传递自身的实例来调用 setBeanFactory()；
5. 与上面的类似，如果实现了其他 `*.Aware`接口，就调用相应的方法；
6. 如果存在与 bean 关联的任何 BeanPostProcessors，则调用 preProcessBeforeInitialization() 方法；
7. 如果为 bean 指定了 init 方法（`<bean>` 的 init-method 属性），那么将调用它；
8. 最后，如果存在与 bean 关联的任何 BeanPostProcessors，则将调用 postProcessAfterInitialization() 方法；
9. 如果 bean 实现 DisposableBean 接口，当 spring 容器关闭时，会调用 destory()；
10. 如果为 bean 指定了 destroy 方法（`<bean>` 的 destroy-method 属性），那么将调用它

![](https://imgkr.cn-bj.ufileos.com/6125ce48-cdfe-4779-9c25-c98088b4cf39.png)



### 在 Spring 中如何配置 Bean?

Bean 的配置方式: 通过全类名 （反射）、 通过工厂方法 （静态工厂方法 & 实例工厂方法）、FactoryBean



### 什么是 Spring 装配

当 bean 在 Spring 容器中组合在一起时，它被称为装配或 bean 装配，装配是创建应用对象之间协作关系的行为。 Spring 容器需要知道需要什么 bean 以及容器应该如何使用依赖注入来将 bean 绑定在一起，同时装配 bean。

依赖注入的本质就是装配，装配是依赖注入的具体行为。

注入是实例化的过程，将创建的bean放在Spring容器中，分为属性注入（setter方式）、构造器注入



### 什么是bean自动装配？

Spring 容器可以自动配置相互协作 beans 之间的关联关系。这意味着 Spring 可以自动配置一个 bean 和其他协作bean 之间的关系，通过检查 BeanFactory 的内容里有没有使用< property>元素。

在Spring框架中共有5种自动装配，让我们逐一分析

1. **no：**这是Spring框架的默认设置，在该设置下自动装配是关闭的，开发者需要自行在beanautowire属性里指定自动装配的模式

2. **byName：**该选项可以根据bean名称设置依赖关系。当向一个bean中自动装配一个属性时，容器将根据bean的名称自动在在配置文件中查询一个匹配的bean。如果找到的话，就装配这个属性，如果没找到的话就报错。

3. **byType：**该选项可以根据bean类型设置依赖关系。当向一个bean中自动装配一个属性时，容器将根据bean的类型自动在在配置文件中查询一个匹配的bean。如果找到的话，就装配这个属性，如果没找到的话就报错。

4. **constructor：**构造器的自动装配和byType模式类似，但是仅仅适用于与有构造器相同参数的bean，如果在容器中没有找到与构造器参数类型一致的bean，那么将会抛出异常。

5. **autodetect：**Spring首先尝试通过 *constructor* 使用自动装配来连接，如果它不执行，Spring 尝试通过 *byType* 来自动装配

   

### 自动装配有什么局限？

- 基本数据类型的值、字符串字面量、类字面量无法使用自动装配来注入。
- 装配依赖中若是出现匹配到多个bean（出现歧义性），装配将会失败



### 通过注解的方式配置bean | 什么是基于注解的容器配置

**组件扫描**(component scanning): Spring 能够从 classpath下自动扫描, 侦测和实例化具有特定注解的组件。

特定组件包括:

- **@Component**：基本注解, 标识了一个受 Spring 管理的组件
- **@Respository**：标识持久层组件
- **@Service**：标识服务层(业务层)组件
- **@Controller**： 标识表现层组件

![annotations - Spring Framework Tutorial - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/annotations.png)

对于扫描到的组件,，Spring 有默认的命名策略：使用非限定类名,，第一个字母小写。也可以在注解中通过 value 属性值标识组件的名称。

当在组件类上使用了特定的注解之后,，还需要在 Spring 的配置文件中声明 `<context:component-scan>`：

- `base-package` 属性指定一个需要扫描的基类包，Spring 容器将会扫描这个基类包里及其子包中的所有类

- 当需要扫描多个包时, 可以使用逗号分隔

- 如果仅希望扫描特定的类而非基包下的所有类，可使用 `resource-pattern` 属性过滤特定的类，示例：

  ```xml
  <context:component-scan base-package="priv.starfish.front.web.controller"
  	annotation-config="true" resource-pattern="autowire/*.class"/>
  ```

  

### 如何在 spring 中启动注解装配？

默认情况下，Spring 容器中未打开注解装配。因此，要使用基于注解装配，我们必须通过配置`<context：annotation-config />` 元素在 Spring 配置文件中启用它。





## 四、AOP

### 什么是 AOP？

AOP(Aspect-Oriented Programming，面向切面编程)：是一种新的方法论, 是对传统 OOP(Object-Oriented Programming，面向对象编程) 的补充。在 OOP 中, 我们以类(class)作为我们的基本单元，而 AOP 中的基本单元是 **Aspect(切面)**

AOP 的主要编程对象是切面(aspect)

在应用 AOP 编程时, 仍然需要定义公共功能，但可以明确的定义这个功能在哪里,，以什么方式应用,，并且不必修改受影响的类。这样一来横切关注点就被模块化到特殊的对象(切面)里。

AOP 的好处:

- 每个事物逻辑位于一个位置，代码不分散，便于维护和升级
- 业务模块更简洁, 只包含核心业务代码

![AOP - Spring Framework Interview Questions - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/unnamed.png)



### **AOP 术语**

- 切面（Aspect）：横切关注点（跨越应用程序多个模块的功能）被模块化的特殊对象
- 连接点（Joinpoint）：程序执行的某个特定位置，如类某个方法调用前、调用后、方法抛出异常后等。连接点由两个信息确定：方法表示的程序执行点；相对点表示的方位![img](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/JoinPoint-1.png)
- 通知（Advice）： 切面必须要完成的工作。特定 JoinPoint 处的 Aspect 所采取的动作称为 Advice。Spring AOP 使用一个 Advice 作为拦截器，在 JoinPoint “周围”维护一系列的拦截器![advice - Spring Framework Interview Questions - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/advice-2.png)
- 目标（Target）：被通知的对象
- 代理（Proxy）：向目标对象应用通知之后创建的对象
- 切点（pointcut）：每个类都拥有多个连接点，程序运行中的一些时间点，例如一个方法的执行，或者是一个异常的处理。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件。切点和连接点不是一对一的关系，一个切点匹配多个连接点，切点通过 `org.springframework.aop.Pointcut` 接口进行描述，它使用类和方法作为连接点的查询条件。
- 引入（Introduction）：引入允许我们向现有的类添加新方法或属性。
- 织入（Weaving）：织入是把切面应用到目标对象并创建新的代理对象的过程。



**Spring  AOP**

- **AspectJ：**Java 社区里最完整最流行的 AOP 框架.
- 在 Spring2.0 以上版本中, 可以使用基于 AspectJ注解或基于 XML 配置的 AOP

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

- - @Before: 前置通知, 在方法执行之前执行
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



### 有哪些不同的AOP实现

![AOP Implementations - Spring Framework Interview Questions - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/AOP-Implementations.png)



### Spring AOP and AspectJ AOP 有什么区别？

- Spring AOP 基于动态代理方式实现，AspectJ 基于静态代理方式实现。
- Spring AOP 仅支持方法级别的 PointCut；提供了完全的 AOP 支持，它还支持属性级别的 PointCut。



## 五、数据访问

### spring对JDBC的支持

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



### 事务管理器

Spring 并不直接管理事务，而是提供了多种事务管理器，他们将事务管理的职责委托给 Hibernate 或者 JTA 等持久化机制所提供的相关平台框架的事务来实现。

Spring 事务管理器的接口是 `org.springframework.transaction.PlatformTransactionManager`，通过这个接口，Spring为各个平台如 JDBC、Hibernate 等都提供了对应的事务管理器，但是具体的实现就是各个平台自己的事情了。

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
- 为了在 Spring 2.x 中启用声明式事务管理，可以通过 tx Schema 中定义的 <tx:advice> 元素声明事务通知，为此必须事先将这个 Schema 定义添加到 <beans> 根元素中去
- 声明了事务通知后，就需要将它与切入点关联起来。由于事务通知是在 <aop:config> 元素外部声明的, 所以它无法直接与切入点产生关联，所以必须在 <aop:config> 元素中声明一个增强器通知与切入点关联起来.
- 由于 Spring AOP 是基于代理的方法，所以只能增强公共方法。因此, 只有公有方法才能通过 Spring AOP 进行事务管理。

![img](https://imgkr.cn-bj.ufileos.com/8342e671-cd06-4ccc-b206-51a355780cea.png)



### 用 @Transactional 注解声明式地管理事务

- 除了在带有切入点，通知和增强器的 Bean 配置文件中声明事务外，Spring 还允许简单地用 @Transactional 注解来标注事务方法
- 为了将方法定义为支持事务处理的，可以为方法添加 @Transactional 注解，根据 Spring AOP 基于代理机制，**只能标注公有方法.**
- 可以在方法或者类级别上添加 @Transactional 注解。当把这个注解应用到类上时， 这个类中的所有公共方法都会被定义成支持事务处理的
- 在 Bean 配置文件中只需要启用 `<tx:annotation-driven>`元素, 并为之指定事务管理器就可以了
-  如果事务处理器的名称是 transactionManager, 就可以在 `<tx:annotation-driven>` 元素中省略 `transaction-manager` 属性，这个元素会自动检测该名称的事务处理器

![img](https://imgkr.cn-bj.ufileos.com/800f0b12-550d-49b9-b5a3-82fd645c51e9.png)



### 事务传播属性

- 当事务方法被另一个事务方法调用时， 必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行
- 事务的传播行为可以由传播属性指定，Spring 定义了 7  种类传播行为：

![](https://imgkr.cn-bj.ufileos.com/910901d5-de7e-4d06-8825-39e8ae051060.png)



### Spring 支持的事务隔离级别

![img](https://imgkr.cn-bj.ufileos.com/a4fb6d55-d32b-41d8-9a98-e6873970196d.png)

事务的隔离级别要得到底层数据库引擎的支持，而不是应用程序或者框架的支持；

Oracle 支持的 2 种事务隔离级别，Mysql支持 4 种事务隔离级别。



### 设置隔离事务属性

用 @Transactional 注解声明式地管理事务时可以在 @Transactional 的 isolation 属性中设置隔离级别

在 Spring 事务通知中, 可以在 `<tx:method>` 元素中指定隔离级别

### 设置回滚事务属性

- 默认情况下只有未检查异常(RuntimeException和Error类型的异常)会导致事务回滚，而受检查异常不会。
- 事务的回滚规则可以通过 @Transactional 注解的 rollbackFor和 noRollbackFor属性来定义，这两个属性被声明为 Class[] 类型的，因此可以为这两个属性指定多个异常类。

- - rollbackFor：遇到时必须进行回滚
  - noRollbackFor： 一组异常类，遇到时必须不回滚

###  超时和只读属性

- 由于事务可以在行和表上获得锁， 因此长事务会占用资源, 并对整体性能产生影响
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

- 

## 七、MVC

### Spring MVC 框架有什么用？

Spring Web MVC 框架提供 **模型-视图-控制器** 架构和随时可用的组件，用于开发灵活且松散耦合的 Web 应用程序。 MVC 模式有助于分离应用程序的不同方面，如输入逻辑，业务逻辑和 UI 逻辑，同时在所有这些元素之间提供松散耦合。



### Spring MVC的优点

- 可以支持各种视图技术,而不仅仅局限于JSP
- 与Spring框架集成（如IoC容器、AOP等）
- 清晰的角色分配：前端控制器(dispatcherServlet) ，请求到处理器映射（handlerMapping)，处理器适配器（HandlerAdapter)， 视图解析器（ViewResolver）
- 支持各种请求资源的映射策略



### Spring MVC 的运行流程 | **DispatcherServlet**描述

在整个 Spring MVC 框架中， DispatcherServlet 处于核心位置，负责协调和组织不同组件以完成请求处理并返回响应的工作

SpringMVC 处理请求过程：

1. 若一个请求匹配 DispatcherServlet 的请求映射路径(在 web.xml中指定)，WEB 容器将该请求转交给 DispatcherServlet 处理
2. DispatcherServlet 接收到请求后, 将根据请求信息(包括 URL、HTTP方法、请求头、请求参数、Cookie 等)及 HandlerMapping 的配置找到处理请求的处理器(Handler)。可将 HandlerMapping 看成路由控制器， 将 Handler 看成目标主机
3. 当 DispatcherServlet 根据 HandlerMapping 得到对应当前请求的 Handler 后，通过 HandlerAdapter 对 Handler 进行封装，再以统一的适配器接口调用 Handler
4. 处理器完成业务逻辑的处理后将返回一个 ModelAndView 给 DispatcherServlet，ModelAndView 包含了视图逻辑名和模型数据信息
5. DispatcherServlet 借助 ViewResoler 完成逻辑视图名到真实视图对象的解析
6. 得到真实视图对象 View 后, DispatcherServlet 使用这个 View 对ModelAndView 中的模型数据进行视图渲染

![](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/dispatcherservlet.png)



![](https://imgkr.cn-bj.ufileos.com/986949cb-e4dc-42cf-acb9-8cd07bbb4d05.png)



### 说出 Spring MVC 常用的 5 个注解:

@RequestMapping 、 @PathVariable 、 @RequestParam 、 @RequestBoy 、@ResponseBody

### @Responsebody

@responsebody 表示该方法的返回结果直接写入HTTP response body中

一般在异步获取数据时使用，在使用@RequestMapping后，返回值通常解析为跳转路径，加上@responsebody后返回结果不会被解析为跳转路径，而是直接写入HTTP response body中。比如异步获取json数据，加上@responsebody后，会直接返回json数据。



### @Autowired和@Resource的区别

用途：做bean的注入时使用

- @Autowired，属于Spring的注解，`org.springframework.beans.factory.annotation.Autowired`　　　　

- @Resource，不属于Spring的注解，JDK1.6支持的注解，`javax.annotation.Resource`

共同点：都用来装配bean。写在字段上，或写在setter方法

不同点：@Autowired  默认按类型装配。依赖对象必须存在，如果要允许null值，可以设置它的required属性为false  @Autowired(required=false)，也可以使用名称装配，配合@Qualifier注解





## 八、其他问题

各种注解：

### @PostConstruct @PreDestroy



### Spring 框架中用到了哪些设计模式？

- **工厂设计模式** : Spring使用工厂模式通过 `BeanFactory`、`ApplicationContext` 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **模板方法模式** : Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **包装器设计模式** : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- **观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。
- **适配器模式** :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`。











## 参考与来源

https://www.edureka.co/blog/interview-questions/spring-interview-questions/