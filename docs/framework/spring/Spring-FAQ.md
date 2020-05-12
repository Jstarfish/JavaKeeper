



## 一般问题

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

我们用的是4.x

![spring overview](https://docs.spring.io/spring/docs/4.3.27.RELEASE/spring-framework-reference/htmlsingle/images/spring-overview.png)

### 简述 AOP 和 IOC 概念

AOP: Aspect Oriented Program, 面向(方面)切面的编程;Filter(过滤器)也是一种 AOP. AOP 是一种新的 方法论, 是对传统 OOP(Object-OrientedProgramming, 面向对象编程) 的补充. AOP 的主要编程对象是切面(aspect),而切面模块化横切关注点.可以举例通过事务说明.

IOC: Invert Of Control, 控制反转. 也称为 DI(依赖注入)其思想是反转资源获取的方向. 传统的资源查找方式要求组件向容器发起请求查找资源.作为回应, 容器适时的返回资源. 而应用了 IOC 之后, 则是容器主动地将资源推送给它所管理的组件,组件所要做的仅是选择一种合适的方式来接受资源. 这种行为也被称为查找的被动形式



## 依赖注入（Ioc）

### 什么是 Spring IOC 容器？

Spring 框架的核心是 Spring 容器。容器创建对象，将它们装配在一起，配置它们并管理它们的完整生命周期。Spring 容器使用依赖注入来管理组成应用程序的组件。容器通过读取提供的配置元数据来接收对象进行实例化，配置和组装的指令。该元数据可以通过 XML，Java 注解或 Java 代码提供。

![image.png](https://upload-images.jianshu.io/upload_images/3101171-33099411d16ca051.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



### 什么是依赖注入？

**依赖注入是在编译阶段尚未知所需的功能是来自哪个的类的情况下，将其他对象所依赖的功能对象实例化的模式**。这就需要一种机制用来激活相应的组件以提供特定的功能，所以**依赖注入是控制反转的基础**。否则如果在组件不受框架控制的情况下，框架又怎么知道要创建哪个组件？

在Java中依赖注入有以下三种实现方式：

1. 构造器注入
2. Setter方法注入（属性注入）
3. 接口注入



### **Spring 容器** 

### spring 中有多少种 IOC 容器？

 在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前, 必须对它进行实例化. 只有在容器实例化后, 才可以从 IOC 容器里获取 Bean 实例并使用

Spring 提供了两种类型的 IOC 容器实现.

- - BeanFactory: IOC 容器的基本实现.

- - ApplicationContext: 提供了更多的高级特性. 是 BeanFactory的子接口.
  - BeanFactory是 Spring 框架的基础设施，面向 Spring 本身；ApplicationContext面向使用 Spring 框架的开发者，几乎所有的应用场合都直接使用 ApplicationContext而非底层的 BeanFactory
  - 无论使用何种方式, 配置文件是相同的.



###  区分 BeanFactory 和 ApplicationContext。

| BeanFactory                | ApplicationContext       |
| -------------------------- | ------------------------ |
| 它使用懒加载               | 它使用即时加载           |
| 它使用语法显式提供资源对象 | 它自己创建和管理资源对象 |
| 不支持国际化               | 支持国际化               |
| 不支持基于依赖的注解       | 支持基于依赖的注解       |



**ApplicationContext**  

- ApplicationContext的主要实现类：

- - ClassPathXmlApplicationContext：从 类路径下加载配置文件
  - FileSystemXmlApplicationContext: 从文件系统中加载配置文件

- ConfigurableApplicationContext扩展于 ApplicationContext，新增加两个主要方法：refresh() 和 close()， 让 ApplicationContext具有启动、刷新和关闭上下文的能力
- ApplicationContext在初始化上下文时就实例化所有单例的 Bean。
- WebApplicationContext是专门为 WEB 应用而准备的，它允许从相对于 WEB 根目录的路径中完成初始化工作

![](https://imgkr.cn-bj.ufileos.com/9f366f70-4b1e-48f5-8301-811398b8d25f.png)

**从 IOC 容器中获取 Bean**

-  调用 ApplicationContext的 getBean() 方法

![](https://imgkr.cn-bj.ufileos.com/3aa6c769-3b9a-4882-b2e1-622c127437a3.png)

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");
HelloWorld helloWorld = (HelloWorld) ctx.getBean("helloWorld");
helloWorld.hello();
```



### 列举 IoC 的一些好处。

IoC 的一些好处是：

- 它将最小化应用程序中的代码量。
- 它将使您的应用程序易于测试，因为它不需要单元测试用例中的任何单例或 JNDI 查找机制。
- 它以最小的影响和最少的侵入机制促进松耦合。
- 它支持即时的实例化和延迟加载服务。



### Spring IoC 的实现机制

Spring 中的 IoC 的实现原理就是工厂模式加反射机制。

示例：

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



## Beans

### 什么是 spring bean？

- 它们是构成用户应用程序主干的对象。
- Bean 由 Spring IoC 容器管理。
- 它们由 Spring IoC 容器实例化，配置，装配和管理。
- Bean 是基于用户提供给容器的配置元数据创建



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

Spring容器中的bean可以分为5个范围。所有范围的名称都是自说明的，但是为了避免混淆，还是让我们来解释一下：

1. **singleton**：这种bean范围是默认的，这种范围确保不管接受到多少个请求，每个容器中只有一个bean的实例，单例的模式由bean factory自身来维护。
2. **prototype**：原形范围与单例范围相反，为每一个bean请求提供一个实例。
3. **request**：在请求bean范围内会每一个来自客户端的网络请求创建一个实例，在请求完成以后，bean会失效并被垃圾回收器回收。
4. **Session**：与请求范围类似，确保每个session中有一个bean的实例，在session过期后，bean会随之失效。
5. **global-session**：global-session和Portlet应用相关。当你的应用部署在Portlet容器中工作时，它包含很多portlet。如果你想要声明让所有的portlet共用全局的存储变量的话，那么这全局变量需要存储在global-session中。

全局作用域与Servlet中的session作用域效果相同。



### spring bean 容器的生命周期是什么样的？

spring bean 容器的生命周期流程如下：

1. Spring 容器根据配置中的 bean 定义中实例化 bean。
2. Spring 使用依赖注入填充所有属性，如 bean 中所定义的配置。
3. 如果 bean 实现 BeanNameAware 接口，则工厂通过传递 bean 的 ID 来调用 setBeanName()。
4. 如果 bean 实现 BeanFactoryAware 接口，工厂通过传递自身的实例来调用 setBeanFactory()。
5. 如果存在与 bean 关联的任何 BeanPostProcessors，则调用 preProcessBeforeInitialization() 方法。
6. 如果为 bean 指定了 init 方法（`` 的 init-method 属性），那么将调用它。
7. 最后，如果存在与 bean 关联的任何 BeanPostProcessors，则将调用 postProcessAfterInitialization() 方法。
8. 如果 bean 实现 DisposableBean 接口，当 spring 容器关闭时，会调用 destory()。
9. 如果为 bean 指定了 destroy 方法（`` 的 destroy-method 属性），那么将调用它。

![](https://imgkr.cn-bj.ufileos.com/6125ce48-cdfe-4779-9c25-c98088b4cf39.png)



### 在 Spring 中如何配置 Bean ?

Bean 的配置方式: 通过全类名 （反射）、 通过工厂方法 （静态工厂方法 & 实例工厂方法）、FactoryBean



### 什么是 spring 装配

当 bean 在 Spring 容器中组合在一起时，它被称为装配或 bean 装配。 Spring 容器需要知道需要什么 bean 以及容器应该如何使用依赖注入来将 bean 绑定在一起，同时装配 bean

依赖注入的本质就是装配，装配是依赖注入的具体行为

注入是  实例化的过程，将创建的bean放在Spring容器中，分为属性注入（setter方式） 构造器注入

装配  是 创建应用对象之间协作关系的行为



**什么是bean自动装配？**

 **自动装配有哪些方式？**

Spring容器可以自动配置相互协作beans之间的关联关系。这意味着Spring可以自动配置一个bean和其他协作bean之间的关系，通过检查BeanFactory 的内容里没有使用和< property>元素。

在Spring框架中共有5种自动装配，让我们逐一分析。

1. **no：**这是Spring框架的默认设置，在该设置下自动装配是关闭的，开发者需要自行在bean定义中用标签明确的设置依赖关系。

2. **byName：**该选项可以根据bean名称设置依赖关系。当向一个bean中自动装配一个属性时，容器将根据bean的名称自动在在配置文件中查询一个匹配的bean。如果找到的话，就装配这个属性，如果没找到的话就报错。

3. **byType：**该选项可以根据bean类型设置依赖关系。当向一个bean中自动装配一个属性时，容器将根据bean的类型自动在在配置文件中查询一个匹配的bean。如果找到的话，就装配这个属性，如果没找到的话就报错。

4. **constructor：**造器的自动装配和byType模式类似，但是仅仅适用于与有构造器相同参数的bean，如果在容器中没有找到与构造器参数类型一致的bean，那么将会抛出异常。

5. **autodetect：**该模式自动探测使用构造器自动装配或者byType自动装配。首先，会尝试找合适的带参数的构造器，如果找到的话就是用构造器自动装配，如果在bean内部没有找到相应的构造器或者是无参构造器，容器就会自动选择byTpe的自动装配方式。

   

### 自动装配有什么局限？

- 覆盖的可能性 - 您始终可以使用 `` 和 `` 设置指定依赖项，这将覆盖自动装配。
- 基本元数据类型 - 简单属性（如原数据类型，字符串和类）无法自动装配。
- 令人困惑的性质 - 总是喜欢使用明确的装配，因为自动装配不太精确。



**XML 配置里的 Bean 自动装配的缺点**

•在 Bean 配置文件里设置 autowire属性进行自动装配将会装配 Bean 的所有属性. 然而, 若只希望装配个别属性时, autowire属性就不够灵活了.

•autowire属性要么根据类型自动装配, 要么根据名称自动装配, 不能两者兼而有之.

•一般情况下，**在实际的项目中很少使用自动装配功能**，因为和自动装配功能所带来的好处比起来，明确清晰的配置文档更有说服力一些



### 通过注解的方式配置bean | 什么是基于注解的容器配置

不使用 XML 来描述 bean 装配，开发人员通过在相关的类，方法或字段声明上使用注解将配置移动到组件类本身。它可以作为 XML 设置的替代方案。例如：

Spring 的 Java 配置是通过使用 @Bean 和 @Configuration 来实现。

- @Bean 注解扮演与 元素相同的角色。
- @Configuration 类允许通过简单地调用同一个类中的其他 @Bean 方法来定义 bean 间依赖关系。

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



### 如何在 spring 中启动注解装配？

默认情况下，Spring 容器中未打开注解装配。因此，要使用基于注解装配，我们必须通过配置`<context：annotation-config />` 元素在 Spring 配置文件中启用它。



> @Component, @Controller, @Repository, @Service 有何区别？

**在 classpath中扫描组件**

组件扫描(component scanning): Spring 能够从 classpath下自动扫描, 侦测和实例化具有特定注解的组件.

特定组件包括:

- **@Component**: 基本注解, 标识了一个受 Spring 管理的组件。这将 java 类标记为 bean。它是任何 Spring 管理组件的通用构造型。spring 的组件扫描机制现在可以将其拾取并将其拉入应用程序环境中。

- **@Respository**: 标识持久层组件。这个注解是具有类似用途和功能的 @Component 注解的特化。它为 DAO 提供了额外的好处。它将 DAO 导入 IoC 容器，并使未经检查的异常有资格转换为 Spring DataAccessException。

- **@Service**: 标识服务层(业务层)组件。此注解是组件注解的特化。它不会对 @Component 注解提供任何其他行为。您可以在服务层类中使用 @Service 而不是 @Component，因为它以更好的方式指定了意图。

- **@Controller**: 标识表现层组件。：这将一个类标记为 Spring Web MVC 控制器。标有它的 Bean 会自动导入到 IoC 容器中

![annotations - Spring Framework Tutorial - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/annotations.png)

### @Required 注解有什么用？

@Required 应用于 bean 属性 setter 方法。此注解仅指示必须在配置时使用 bean 定义中的显式属性值或使用自动装配填充受影响的 bean 属性。如果尚未填充受影响的 bean 属性，则容器将抛出 BeanInitializationException。

示例：

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



### @Autowired 注解有什么用？

@Autowired 可以更准确地控制应该在何处以及如何进行自动装配。此注解用于在 setter 方法，构造函数，具有任意名称或多个参数的属性或方法上自动装配 bean。默认情况下，它是类型驱动的注入。

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

###  

###  @Qualifier 注解有什么用？

当您创建多个相同类型的 bean 并希望仅使用属性装配其中一个 bean 时，您可以使用@Qualifier 注解和 @Autowired 通过指定应该装配哪个确切的 bean 来消除歧义。

例如，这里我们分别有两个类，Employee 和 EmpAccount。在 EmpAccount 中，使用@Qualifier 指定了必须装配 id 为 emp1 的 bean。

Employee.java

```java
public class Employee {
    private String name;
    @Autowired
    public void setName(String name) {
        this.name=name;
    }
    public string getName() {
        return name;
    }
}
```

EmpAccount.java

```java
public class EmpAccount {
    private Employee emp;

    @Autowired
    @Qualifier(emp1)
    public void showName() {
        System.out.println(“Employee name : ”+emp.getName);
    }
}
```



### @RequestMapping 注解有什么用？

@RequestMapping 注解用于将特定 HTTP 请求方法映射到将处理相应请求的控制器中的特定类/方法。此注释可应用于两个级别：

- 类级别：映射请求的 URL
- 方法级别：映射 URL 以及 HTTP 请求方法



## AOP

### 什么是 AOP？

AOP(Aspect-Oriented Programming), 即 **面向切面编程**, 它与 OOP( Object-Oriented Programming, 面向对象编程) 相辅相成, 提供了与 OOP 不同的抽象软件结构的视角.
在 OOP 中, 我们以类(class)作为我们的基本单元, 而 AOP 中的基本单元是 **Aspect(切面)**

面向切面编程是一种编程技术，它允许程序员模块化横切关注点或横切典型职责划分的行为。横切关注点的例子可以是日志记录和事务管理。AOP的核心是一个方面。它将能够影响多个类的行为封装到可重用模块中

- AOP(Aspect-Oriented Programming, 面向切面编程): 是一种新的方法论, 是对传统 OOP(Object-Oriented Programming, 面向对象编程) 的补充.
- AOP 的主要编程对象是切面(aspect), 而切面模块化横切关注点.
- 在应用 AOP 编程时, 仍然需要定义公共功能, 但可以明确的定义这个功能在哪里, 以什么方式应用, 并且不必修改受影响的类. 这样一来横切关注点就被模块化到特殊的对象(切面)里.
- AOP 的好处:

- - 每个事物逻辑位于一个位置, 代码不分散, 便于维护和升级
  - 业务模块更简洁, 只包含核心业务代码.

![AOP - Spring Framework Interview Questions - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/unnamed.png)



### **AOP 术语**

- 切面(Aspect): 横切关注点(跨越应用程序多个模块的功能)被模块化的特殊对象
- 通知(Advice): 切面必须要完成的工作。特定 JoinPoint 处的 Aspect 所采取的动作称为 Advice。Spring AOP 使用一个 Advice 作为拦截器，在 JoinPoint “周围”维护一系列的拦截器。![advice - Spring Framework Interview Questions - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/advice-2.png)
- 目标(Target): 被通知的对象
- 代理(Proxy): 向目标对象应用通知之后创建的对象
- 连接点（Joinpoint）：程序执行的某个特定位置：如类某个方法调用前、调用后、方法抛出异常后等。连接点由两个信息确定：方法表示的程序执行点；相对点表示的方位。![img](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/JoinPoint-1.png)
- 切点（pointcut）：每个类都拥有多个连接点：程序运行中的一些时间点, 例如一个方法的执行, 或者是一个异常的处理。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件。切点和连接点不是一对一的关系，一个切点匹配多个连接点，切点通过 org.springframework.aop.Pointcut接口进行描述，它使用类和方法作为连接点的查询条件。



### 什么是 Aspect？

`aspect` 由 `pointcount` 和 `advice` 组成, 它既包含了横切逻辑的定义, 也包括了连接点的定义. Spring AOP 就是负责实施切面的框架, 它将切面所定义的横切逻辑编织到切面所指定的连接点中.
AOP 的工作重心在于如何将增强编织目标对象的连接点上, 这里包含两个工作:

1. 如何通过 pointcut 和 advice 定位到特定的 joinpoint 上
2. 如何在 advice 中编写切面代码.



**Spring  AOP**

- **AspectJ：**Java 社区里最完整最流行的 AOP 框架.
- 在 Spring2.0 以上版本中, 可以使用基于 AspectJ注解或基于 XML 配置的 AOP

**在 Spring 中启用 AspectJ 注解支持**

- 要在 Spring 应用中使用 AspectJ 注解, 必须在 classpath 下包含 AspectJ 类库:aopalliance.jar、aspectj.weaver.jar 和 spring-aspects.jar
- 将 aop Schema 添加到 <beans> 根元素中.
- 要在 Spring IOC 容器中启用 AspectJ 注解支持, 只要在 Bean 配置文件中定义一个空的 XML 元素 <aop:aspectj-autoproxy>
- 当 Spring IOC 容器侦测到 Bean 配置文件中的 <aop:aspectj-autoproxy> 元素时, 会自动为与 AspectJ切面匹配的 Bean 创建代理.





### 有哪写类型的通知（Advice） | **用 AspectJ 注解声明切面**

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

Spring AOP 基于动态代理方式实现；AspectJ 基于静态代理方式实现。
Spring AOP 仅支持方法级别的 PointCut；提供了完全的 AOP 支持，它还支持属性级别的 PointCut。



## 数据访问

### spring对JDBC的支持

**JdbcTemplate简介**

•为了使 JDBC 更加易于使用, Spring 在 JDBC API 上定义了一个抽象层, 以此建立一个 JDBC 存取框架.

•作为 Spring JDBC 框架的核心, **JDBC 模板**的设计目的是为不同类型的 JDBC 操作提供**模板方法**. 每个模板方法都能控制整个过程, 并允许覆盖过程中的特定任务. 通过这种方式, 可以在尽可能保留灵活性的情况下, 将数据库存取的工作量降到最低.

### spring 支持哪些 ORM 框架

- Hibernate
- iBatis
- JPA
- JDO
- OJB



## 事务

**Spring 中的事务管理**

- 作为企业级应用程序框架, Spring 在不同的事务管理 API 之上定义了一个抽象层. 而应用程序开发人员不必了解底层的事务管理 API, 就可以使用 Spring 的事务管理机制.
- Spring 既支持编程式事务管理, 也支持声明式的事务管理.

- - 编程式事务管理: 将事务管理代码嵌入到业务方法中来控制事务的提交和回滚. 在编程式管理事务时, 必须在每个事务操作中包含额外的事务管理代码.
  - 声明式事务管理: 大多数情况下比编程式事务管理更好用. 它将事务管理代码从业务方法中分离出来, 以声明的方式来实现事务管理. 事务管理作为一种横切关注点, 可以通过 AOP 方法模块化. Spring 通过 Spring AOP 框架支持声明式事务管理.

- Spring 从不同的事务管理 API 中抽象了一整套的事务机制. 开发人员不必了解底层的事务 API, 就可以利用这些事务机制. 有了这些事务机制, 事务管理代码就能独立于特定的事务技术了.



### 事务管理器

*Spring并不直接管理事务，而是提供了多种事务管理器*，他们将事务管理的职责委托给Hibernate或者JTA等持久化机制所提供的相关平台框架的事务来实现。

Spring事务管理器的接口是org.springframework.transaction.PlatformTransactionManager，通过这个接口，Spring为各个平台如JDBC、Hibernate等都提供了对应的事务管理器，但是具体的实现就是各个平台自己的事情了。.

**Spring 中的事务管理器的不同实现**

**事务管理器以普通的 Bean 形式声明在 Spring IOC 容器中**

- 在应用程序中只需要处理一个数据源, 而且通过 JDBC 存取

```
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



**用事务通知声明式地管理事务**

- 事务管理是一种横切关注点
- 为了在 Spring 2.x 中启用声明式事务管理, 可以通过 tx Schema 中定义的 <tx:advice> 元素声明事务通知, 为此必须事先将这个 Schema 定义添加到 <beans> 根元素中去.
- 声明了事务通知后, 就需要将它与切入点关联起来. 由于事务通知是在 <aop:config> 元素外部声明的, 所以它无法直接与切入点产生关联. 所以必须在 <aop:config> 元素中声明一个增强器通知与切入点关联起来.
- 由于 Spring AOP 是基于代理的方法, 所以只能增强公共方法. 因此, 只有公有方法才能通过 Spring AOP 进行事务管理.



**用 @Transactional 注解声明式地管理事务**

- 除了在带有切入点, 通知和增强器的 Bean 配置文件中声明事务外, Spring 还允许简单地用 @Transactional 注解来标注事务方法.
- 为了将方法定义为支持事务处理的, 可以为方法添加 @Transactional 注解. 根据 Spring AOP 基于代理机制, **只能标注公有方法.**
- 可以在方法或者类级别上添加 @Transactional 注解. 当把这个注解应用到类上时, 这个类中的所有公共方法都会被定义成支持事务处理的.
- 在 Bean 配置文件中只需要启用 ****元素, 并为之指定事务管理器就可以了.
-  如果事务处理器的名称是 transactionManager, 就可以在<tx:annotation-driven> 元素中省略 transaction-manager 属性. 这个元素会自动检测该名称的事务处理器. 



**事务传播属性**

- 当事务方法被另一个事务方法调用时, 必须指定事务应该如何传播. 例如: 方法可能继续在现有事务中运行, 也可能开启一个新事务, 并在自己的事务中运行.
- 事务的传播行为可以由传播属性指定. Spring 定义了 7  种类传播行为.

![](https://imgkr.cn-bj.ufileos.com/910901d5-de7e-4d06-8825-39e8ae051060.png)



## MVC

> 什么是Spring MVC ？简单介绍下你对springMVC的理解?

### Spring MVC 框架有什么用？

Spring Web MVC 框架提供 **模型-视图-控制器** 架构和随时可用的组件，用于开发灵活且松散耦合的 Web 应用程序。 MVC 模式有助于分离应用程序的不同方面，如输入逻辑，业务逻辑和 UI 逻辑，同时在所有这些元素之间提供松散耦合。



### Spring MVC的优点

（1）可以支持各种视图技术,而不仅仅局限于JSP；

（2）与Spring框架集成（如IoC容器、AOP等）；

（3）清晰的角色分配：前端控制器(dispatcherServlet) , 请求到处理器映射（handlerMapping), 处理器适配器（HandlerAdapter), 视图解析器（ViewResolver）。

（4） 支持各种请求资源的映射策略。



### Spring MVC 的运行流程 | **DispatcherServlet**描述

①. 在整个 Spring MVC 框架中， DispatcherServlet 处于核心位置，负责协调和组织不同组件以完成请求处理并返回响应的工作

②. SpringMVC 处理请求过程：

\> 若一个请求匹配 DispatcherServlet 的请求映射路径(在 web.xml中指定), WEB 容器将该请求转交给 DispatcherServlet 处理

\> DispatcherServlet 接收到请求后, 将根据请求信息(包括 URL、HTTP方法、请求头、请求参数、Cookie 等)及 HandlerMapping 的配置找到处理请求的处理器(Handler). 可将 HandlerMapping 看成路由控制器， 将 Handler 看成目标主机。

\> 当 DispatcherServlet 根据 HandlerMapping 得到对应当前请求的Handler 后，通过 HandlerAdapter 对 Handler 进行封装，再以统一的适配器接口调用 Handler。

\> 处 理 器 完 成 业 务 逻 辑 的 处 理 后 将 返 回 一 个 ModelAndView 给DispatcherServlet, ModelAndView 包含了视图逻辑名和模型数据信息

\> DispatcherServlet 借助 ViewResoler 完成逻辑视图名到真实视图对象的解析

\> 得到真实视图对象 View 后, DispatcherServlet 使用这个 View 对ModelAndView 中的模型数据进行视图渲染

**简单的谈一下SpringMVC的工作流程？**

![dispatcherServlet - Spring Framework Interview Questions - Edureka!](https://d1jnx9ba8s6j9r.cloudfront.net/blog/wp-content/uploads/2017/05/dispatcherservlet.png)

流程

1、用户发送请求至前端控制器DispatcherServlet

2、DispatcherServlet收到请求调用HandlerMapping处理器映射器。

3、处理器映射器找到具体的处理器，生成处理器对象及处理器拦截器(如果有则生成)一并返回给DispatcherServlet。

4、DispatcherServlet调用HandlerAdapter处理器适配器

5、HandlerAdapter经过适配调用具体的处理器(Controller，也叫后端控制器)。

6、Controller执行完成返回ModelAndView

7、HandlerAdapter将controller执行结果ModelAndView返回给DispatcherServlet

8、DispatcherServlet将ModelAndView传给ViewReslover视图解析器

9、ViewReslover解析后返回具体View

10、DispatcherServlet根据View进行渲染视图（即将模型数据填充至视图中）。

11、DispatcherServlet响应用户





### **处理请求的流程**

![](https://imgkr.cn-bj.ufileos.com/40bdde8e-4fe2-4524-a09e-4dbcdf1d5bcb.jpg)



![](https://imgkr.cn-bj.ufileos.com/986949cb-e4dc-42cf-acb9-8cd07bbb4d05.png)



### 说出 Spring MVC 常用的 5 个注解:

@RequestMapping 、 @PathVariable 、 @RequestParam 、 @RequestBoy 、

@ResponseBody



### @Responsebody

@responsebody表示该方法的返回结果直接写入HTTP response body中

一般在异步获取数据时使用，在使用@RequestMapping后，返回值通常解析为跳转路径，加上@responsebody后返回结果不会被解析为跳转路径，而是直接写入HTTP response body中。比如异步获取json数据，加上@responsebody后，会直接返回json数据。



### @Autowired和@Resource的区别

用途：做bean的注入时使用

历史：

- @Autowired     属于Spring的注解　　　　　　　　　　　　org.springframework.beans.factory.annotation.Autowired

- @Resource　　 不属于Spring的注解，JDK1.6支持的注解　　　 javax.annotation.Resource

共同点：

装配bean. 写在字段上,或写在setter方法

不同点：

- @Autowired  默认按类型装配。依赖对象必须存在，如果要允许null值，可以设置它的required属性为false  @Autowired(required=false)

　　也可以使用名称装配，配合@Qualifier注解



### @Controller注解的作用

Controller控制器，是MVC中的部分C，为什么是部分呢？因为此处的控制器主要负责功能处理部分：

1、收集、验证请求参数并绑定到命令对象；

2、将命令对象交给业务对象，由业务对象处理并返回模型数据；

3、返回ModelAndView（Model部分是业务对象返回的模型数据，视图部分为逻辑视图名）。

在Spring MVC 中，控制器Controller 负责处理由DispatcherServlet 分发的请求，它把用户请求的数据经过业务处理层处理之后封装成一个Model ，然后再把该Model 返回给对应的View 进行展示。在Spring MVC 中提供了一个非常简便的定义Controller 的方法，你无需继承特定的类或实现特定的接口，只需使用@Controller 标记一个类是Controller ，然后使用@RequestMapping 和@RequestParam 等一些注解用以定义URL 请求和Controller 方法之间的映射，这样的Controller 就能被外界访问到。此外Controller 不会直接依赖于HttpServletRequest 和HttpServletResponse 等HttpServlet 对象，它们可以通过Controller 的方法参数灵活的获取到。

@Controller 用于标记在一个类上，使用它标记的类就是一个Spring MVC Controller 对象。分发处理器将会扫描使用了该注解的类的方法，并检测该方法是否使用了@RequestMapping 注解。@Controller 只是定义了一个控制器类，而使用@RequestMapping 注解的方法才是真正处理请求的处理器。单单使用@Controller 标记在一个类上还不能真正意义上的说它就是Spring MVC 的一个控制器类，因为这个时候Spring 还不认识它。那么要如何做Spring 才能认识它呢？这个时候就需要我们把这个控制器类交给Spring 来管理。有两种方式：

在Spring MVC 的配置文件中定义MyController 的bean 对象。
在Spring MVC 的配置文件中告诉Spring 该到哪里去找标记为@Controller 的Controller 控制器。







### Spring 框架中用到了哪些设计模式？

**工厂设计模式** : Spring使用工厂模式通过 `BeanFactory`、`ApplicationContext` 创建 bean 对象。

**代理设计模式** : Spring AOP 功能的实现。

**单例设计模式** : Spring 中的 Bean 默认都是单例的。

**模板方法模式** : Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。

**包装器设计模式** : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。

**观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。

**适配器模式** :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`。











## 参考与来源

https://www.edureka.co/blog/interview-questions/spring-interview-questions/