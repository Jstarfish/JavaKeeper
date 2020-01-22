# Spring IoC

<!-- TOC depthFrom:2 depthTo:3 -->

- [IoC 概念](#ioc-概念)
  - [IoC 是什么](#ioc-是什么)
  - [IoC 能做什么](#ioc-能做什么)
  - [依赖注入](#依赖注入)
  - [IoC 和 DI](#ioc-和-di)
  - [IoC 容器](#ioc-容器)
  - [Bean](#bean)
- [IoC 容器](#ioc-容器-1)
  - [核心接口](#核心接口)
  - [IoC 容器工作步骤](#ioc-容器工作步骤)
  - [Bean 概述](#bean-概述)
  - [依赖](#依赖)
- [IoC 容器配置](#ioc-容器配置)
  - [Xml 配置](#xml-配置)
  - [注解配置](#注解配置)
  - [Java 配置](#java-配置)

<!-- /TOC -->

## IoC 概念

### IoC 是什么

**IoC，是 Inversion of Control 的缩写，即控制反转。**他还有一个别名叫**依赖注入**（Dependency Injection）有些资料也称依赖注入是IOC的一种常见方式。

IoC 不是什么技术，而是一种设计思想。在 Java 开发中，IoC 意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。如何理解 Ioc 呢？理解 Ioc 的关键是要明确“谁控制谁，控制什么，为何是反转（有反转就应该有正转了），哪些方面反转了”，那我们来深入分析一下：

- **谁控制谁，控制什么：**传统 JavaSE 程序设计，我们直接在对象内部通过 new 进行创建对象，是程序主动去创建依赖对象；而 IoC 是有专门一个容器来创建这些对象，即由 IoC 容器来控制对象的创建；谁控制谁？当然是 IoC 容器控制了对象；控制什么？那就是主要控制了外部资源获取（不只是对象包括比如文件等）。
- **为何是反转，哪些方面反转了：**有反转就有正转，传统应用程序是由我们自己在对象中主动控制去直接获取依赖对象，也就是正转；而反转则是由容器来帮忙创建及注入依赖对象；为何是反转？因为由容器帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，所以是反转；哪些方面反转了？依赖对象的获取被反转了。

用图例说明一下，传统程序设计如图 2-1，都是主动去创建相关对象然后再组合起来：

<div align="center"><img src="http://sishuok.com/forum/upload/2012/2/19/a02c1e3154ef4be3f15fb91275a26494__1.JPG"/></div>
图 2-1 传统应用程序示意图

当有了 IoC/DI 的容器后，在客户端类中不再主动去创建这些对象了，如图 2-2 所示:

<div align="center"><img src="http://sishuok.com/forum/upload/2012/2/19/6fdf1048726cc2edcac4fca685f050ac__2.JPG"/></div>
图 2-2 有 IoC/DI 容器后程序结构示意图

### IoC 能做什么

IoC 不是一种技术，只是一种思想，一个重要的面向对象编程的法则，它能指导我们如何设计出松耦合、更优良的程序。传统应用程序都是由我们在类内部主动创建依赖对象，从而导致类与类之间高耦合，难于测试；有了 IoC 容器后，把创建和查找依赖对象的控制权交给了容器，由容器进行注入组合对象，所以对象与对象之间是松散耦合，这样也方便测试，利于功能复用，更重要的是使得程序的整个体系结构变得非常灵活。

其实 IoC 对编程带来的最大改变不是从代码上，而是从思想上，发生了“主从换位”的变化。应用程序原本是老大，要获取什么资源都是主动出击，但是在 IoC/DI 思想中，应用程序就变成被动的了，被动的等待 IoC 容器来创建并注入它所需要的资源了。

IoC 很好的体现了面向对象设计法则之一—— 好莱坞法则：“Don't call us,we will call you”；即由 IoC 容器帮对象找相应的依赖对象并注入，而不是由对象主动去找。

### 依赖注入

DI，是 **Dependency Injection** 的缩写，即依赖注入。

依赖注入是 IoC 的最常见形式。

容器全权负责的组件的装配，它会把符合依赖关系的对象通过 JavaBean 属性或者构造函数传递给需要的对象。

DI 是组件之间依赖关系由容器在运行期决定，形象的说，即由容器动态的将某个依赖关系注入到组件之中。依赖注入的目的并非为软件系统带来更多功能，而是为了提升组件重用的频率，并为系统搭建一个灵活、可扩展的平台。通过依赖注入机制，我们只需要通过简单的配置，而无需任何代码就可指定目标需要的资源，完成自身的业务逻辑，而不需要关心具体的资源来自何处，由谁实现。

理解 DI 的关键是：“谁依赖谁，为什么需要依赖，谁注入谁，注入了什么”，那我们来深入分析一下：

- **谁依赖于谁：**当然是应用程序依赖于 IoC 容器；
- **为什么需要依赖：**应用程序需要 IoC 容器来提供对象需要的外部资源；
- **谁注入谁：**很明显是 IoC 容器注入应用程序某个对象，应用程序依赖的对象；
- **注入了什么**：就是注入某个对象所需要的外部资源（包括对象、资源、常量数据）。

### IoC 和 DI

其实它们是同一个概念的不同角度描述，由于控制反转概念比较含糊（可能只是理解为容器控制对象这一个层面，很难让人想到谁来维护对象关系），所以 2004 年大师级人物 Martin Fowler 又给出了一个新的名字：“依赖注入”，相对 IoC 而言，“依赖注入”明确描述了“被注入对象依赖 IoC 容器配置依赖对象”。

> 注：如果想要更加深入的了解 IoC 和 DI，请参考大师级人物 Martin Fowler 的一篇经典文章 [Inversion of Control Containers and the Dependency Injection pattern](http://www.martinfowler.com/articles/injection.html) 。

### IoC 容器

IoC 容器就是具有依赖注入功能的容器。IoC 容器负责实例化、定位、配置应用程序中的对象及建立这些对象间的依赖。应用程序无需直接在代码中 new 相关的对象，应用程序由 IoC 容器进行组装。在 Spring 中 BeanFactory 是 IoC 容器的实际代表者。

Spring IoC 容器如何知道哪些是它管理的对象呢？这就需要配置文件，Spring IoC 容器通过读取配置文件中的配置元数据，通过元数据对应用中的各个对象进行实例化及装配。一般使用基于 xml 配置文件进行配置元数据，而且 Spring 与配置文件完全解耦的，可以使用其他任何可能的方式进行配置元数据，比如注解、基于 java 文件的、基于属性文件的配置都可以

那 Spring IoC 容器管理的对象叫什么呢？

### Bean

JavaBean 是一种JAVA语言写成的可重用组件。为写成JavaBean，类必须是具体的和公共的，并且具有**无参数的构造器**。JavaBean 通过提供符合一致性设计模式的公共方法（getter / setter 方法）将内部域暴露成员属性。众所周知，属性名称符合这种模式，其他Java 类可以通过自省机制发现和操作这些JavaBean 的属性。

一个javaBean由三部分组成：**属性、方法、事件**

JavaBean的任务就是: “Write once, run anywhere, reuse everywhere”，即“一次性编写，任何地方执行，任何地方重用”。

由 IoC 容器管理的那些组成你应用程序的对象我们就叫它 Bean。Bean 就是由 Spring 容器初始化、装配及管理的对象，除此之外，bean 就与应用程序中的其他对象没有什么区别了。

## IoC 容器

### 核心接口

`org.springframework.beans` 和 `org.springframework.context` 是 IoC 容器的基础。

在 Spring 中，有两种 IoC 容器：`BeanFactory` 和 `ApplicationContext`。

- `BeanFactory`：Spring 实例化、配置和管理对象的最基本接口。
- `ApplicationContext`：BeanFactory 的子接口。它还扩展了其他一些接口，以支持更丰富的功能，如：国际化、访问资源、事件机制、更方便的支持 AOP、在 web 应用中指定应用层上下文等。

实际开发中，更推荐使用 `ApplicationContext` 作为 IoC 容器，因为它的功能远多于 `FactoryBean`。

常见 `ApplicationContext` 实现：

- **ClassPathXmlApplicationContext**：`ApplicationContext` 的实现，从 classpath 获取配置文件；

```java
BeanFactory beanFactory = new ClassPathXmlApplicationContext("classpath.xml");
```

- **FileSystemXmlApplicationContext**：`ApplicationContext` 的实现，从文件系统获取配置文件。

```java
BeanFactory beanFactory = new FileSystemXmlApplicationContext("fileSystemConfig.xml");
```

### IoC 容器工作步骤

使用 IoC 容器可分为三步骤：

1.  配置元数据：需要配置一些元数据来告诉 Spring，你希望容器如何工作，具体来说，就是如何去初始化、配置、管理 JavaBean 对象。

2)  实例化容器：由 IoC 容器解析配置的元数据。IoC 容器的 Bean Reader 读取并解析配置文件，根据定义生成 BeanDefinition 配置元数据对象，IoC 容器根据 BeanDefinition 进行实例化、配置及组装 Bean。

3.  使用容器：由客户端实例化容器，获取需要的 Bean。

#### 配置元数据

> **元数据（Metadata）**
> 又称中介数据、中继数据，为描述数据的数据（data about data），主要是描述数据属性（property）的信息。

配置元数据的方式：

- **基于 xml 配置**：Spring 的传统配置方式。在 `<beans>` 标签中配置元数据内容。

  缺点是当 JavaBean 过多时，产生的配置文件足以让你眼花缭乱。

- **基于注解配置**：Spring2.5 引入。可以大大简化你的配置。

- **基于 Java 配置**：可以使用 Java 类来定义 JavaBean 。

  为了使用这个新特性，需要用到 `@Configuration` 、`@Bean` 、`@Import` 和 `@DependsOn` 注解。

### Bean 概述

一个 Spring 容器管理一个或多个 bean。
这些 bean 根据你配置的元数据（比如 xml 形式）来创建。
Spring IoC 容器本身，并不能识别你配置的元数据。为此，要将这些配置信息转为 Spring 能识别的格式——BeanDefinition 对象。

#### 命名 Bean

指定 id 和 name 属性不是必须的。
Spring 中，并非一定要指定 id 和 name 属性。实际上，Spring 会自动为其分配一个特殊名。
如果你需要引用声明的 bean，这时你才需要一个标识。官方推荐驼峰命名法来命名。

#### 支持别名

可能存在这样的场景，不同系统中对于同一 bean 的命名方式不一样。
为了适配，Spring 支持 `<alias>` 为 bean 添加别名的功能。

```xml
<alias name="subsystemA-dataSource" alias="subsystemB-dataSource"/>
<alias name="subsystemA-dataSource" alias="myApp-dataSource" />
```

#### 实例化 Bean

**构造器方式**

```xml
<bean id="exampleBean" class="examples.ExampleBean"/>
```

**静态工厂方法**

### 依赖

依赖注入
依赖注入有两种主要方式：

- 构造器注入
- Setter 注入
  构造器注入有可能出现循环注入的错误。如：

```java
class A {
	public A(B b){}
}
class B {
	public B(A a){}
}
```

**依赖和配置细节**
使用 depends-on
Lazy-initialized Bean
自动装配
方法注入

## IoC 容器配置

IoC 容器的配置有三种方式：

- 基于 xml 配置
- 基于注解配置
- 基于 Java 配置

作为 Spring 传统的配置方式，xml 配置方式一般为大家所熟知。

如果厌倦了 xml 配置，Spring 也提供了注解配置方式或 Java 配置方式来简化配置。

**本文，将对 Java 配置 IoC 容器做详细的介绍。**

### Xml 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
         http://www.springframework.org/schema/beans/spring-beans.xsd">
  <import resource="resource1.xml" />
  <bean id="bean1" class=""></bean>
  <bean id="bean2" class=""></bean>
  <bean name="bean2" class=""></bean>

  <alias alias="bean3" name="bean2"/>
  <import resource="resource2.xml" />
</beans>
```

标签说明：

- `<beans>` 是 Spring 配置文件的根节点。
- `<bean>` 用来定义一个 JavaBean。`id` 属性是它的标识，在文件中必须唯一；`class` 属性是它关联的类。
- `<alias>` 用来定义 Bean 的别名。
- `<import>` 用来导入其他配置文件的 Bean 定义。这是为了加载多个配置文件，当然也可以把这些配置文件构造为一个数组（new String[] {“config1.xml”, config2.xml}）传给 `ApplicationContext` 实现类进行加载多个配置文件，那一个更适合由用户决定；这两种方式都是通过调用 Bean Definition Reader 读取 Bean 定义，内部实现没有任何区别。`<import>` 标签可以放在 `<beans>` 下的任何位置，没有顺序关系。

#### 实例化容器

实例化容器的过程：
定位资源（XML 配置文件）
读取配置信息(Resource)
转化为 Spring 可识别的数据形式（BeanDefinition）

```java
ApplicationContext context =
      new ClassPathXmlApplicationContext(new String[] {"services.xml", "daos.xml"});
```

组合 xml 配置文件
配置的 Bean 功能各不相同，都放在一个 xml 文件中，不便管理。
Java 设计模式讲究职责单一原则。配置其实也是如此，功能不同的 JavaBean 应该被组织在不同的 xml 文件中。然后使用 import 标签把它们统一导入。

```xml
<import resource="classpath:spring/applicationContext.xml"/>
<import resource="/WEB-INF/spring/service.xml"/>
```

#### 使用容器

使用容器的方式就是通过`getBean`获取 IoC 容器中的 JavaBean。
Spring 也有其他方法去获得 JavaBean，但是 Spring 并不推荐其他方式。

```java
// create and configure beans
ApplicationContext context =
new ClassPathXmlApplicationContext(new String[] {"services.xml", "daos.xml"});
// retrieve configured instance
PetStoreService service = context.getBean("petStore", PetStoreService.class);
// use configured instance
List<String> userList = service.getUsernameList();
```

### 注解配置

Spring2.5 引入了注解。
于是，一个问题产生了：**使用注解方式注入 JavaBean 是不是一定完爆 xml 方式？**
未必。正所谓，仁者见仁智者见智。任何事物都有其优缺点，看你如何取舍。来看看注解的优缺点：
**优点**：大大减少了配置，并且可以使配置更加精细——类，方法，字段都可以用注解去标记。
**缺点**：使用注解，不可避免产生了侵入式编程，也产生了一些问题。

- 你需要将注解加入你的源码并编译它；

- 注解往往比较分散，不易管控。

> 注：spring 中，先进行注解注入，然后才是 xml 注入，因此如果注入的目标相同，后者会覆盖前者。

#### 启动注解

Spring 默认是不启用注解的。如果想使用注解，需要先在 xml 中启动注解。
启动方式：在 xml 中加入一个标签，很简单吧。

```xml
<context:annotation-config/>
```

> 注：`<context:annotation-config/>` 只会检索定义它的上下文。什么意思呢？就是说，如果你
> 为 DispatcherServlet 指定了一个`WebApplicationContext`，那么它只在 controller 中查找`@Autowired`注解，而不会检查其它的路径。

#### Spring 注解

- **`@Required`**

`@Required` 注解只能用于修饰 bean 属性的 setter 方法。受影响的 bean 属性必须在配置时被填充在 xml 配置文件中，否则容器将抛出`BeanInitializationException`。

```java
public class AnnotationRequired {
    private String name;
    private String sex;

    public String getName() {
        return name;
    }

    /**
     * @Required 注解用于bean属性的setter方法并且它指示，受影响的bean属性必须在配置时被填充在xml配置文件中，
     *           否则容器将抛出BeanInitializationException。
     */
    @Required
    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
```

- **`@Autowired`**

`@Autowired`注解可用于修饰属性、setter 方法、构造方法。

> 注：`@Autowired`注解也可用于修饰构造方法，但如果类中只有默认构造方法，则没有必要。如果有多个构造器，至少应该修饰一个，来告诉容器哪一个必须使用。

可以使用 JSR330 的注解`@Inject`来替代`@Autowired`。

**_范例_**

```java
public class AnnotationAutowired {
    private static final Logger log = LoggerFactory.getLogger(AnnotationRequired.class);

    @Autowired
    private Apple fieldA;

    private Banana fieldB;

    private Orange fieldC;

    public Apple getFieldA() {
        return fieldA;
    }

    public void setFieldA(Apple fieldA) {
        this.fieldA = fieldA;
    }

    public Banana getFieldB() {
        return fieldB;
    }

    @Autowired
    public void setFieldB(Banana fieldB) {
        this.fieldB = fieldB;
    }

    public Orange getFieldC() {
        return fieldC;
    }

    public void setFieldC(Orange fieldC) {
        this.fieldC = fieldC;
    }

    public AnnotationAutowired() {}

    @Autowired
    public AnnotationAutowired(Orange fieldC) {
        this.fieldC = fieldC;
    }

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext ctx =
                        new ClassPathXmlApplicationContext("spring/spring-annotation.xml");

        AnnotationAutowired annotationAutowired =
                        (AnnotationAutowired) ctx.getBean("annotationAutowired");
        log.debug("fieldA: {}, fieldB:{}, fieldC:{}", annotationAutowired.getFieldA().getName(),
                        annotationAutowired.getFieldB().getName(),
                        annotationAutowired.getFieldC().getName());
        ctx.close();
    }
}
```

xml 中的配置

```xml
<!-- 测试@Autowired -->
<bean id="apple" class="org.zp.notes.spring.beans.annotation.sample.Apple"/>
<bean id="potato" class="org.zp.notes.spring.beans.annotation.sample.Banana"/>
<bean id="tomato" class="org.zp.notes.spring.beans.annotation.sample.Orange"/>
<bean id="annotationAutowired" class="org.zp.notes.spring.beans.annotation.sample.AnnotationAutowired"/>
```

- **`@Qualifier`**

在`@Autowired`注解中，提到了如果发现有多个候选的 bean 都符合修饰类型，Spring 就会抓瞎了。

那么，如何解决这个问题。

可以通过`@Qualifier`指定 bean 名称来锁定真正需要的那个 bean。

**_范例_**

```java
public class AnnotationQualifier {
    private static final Logger log = LoggerFactory.getLogger(AnnotationQualifier.class);

    @Autowired
    @Qualifier("dog") /** 去除这行，会报异常 */
    Animal dog;

    Animal cat;

    public Animal getDog() {
        return dog;
    }

    public void setDog(Animal dog) {
        this.dog = dog;
    }

    public Animal getCat() {
        return cat;
    }

    @Autowired
    public void setCat(@Qualifier("cat") Animal cat) {
        this.cat = cat;
    }

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext ctx =
                new ClassPathXmlApplicationContext("spring/spring-annotation.xml");

        AnnotationQualifier annotationQualifier =
                (AnnotationQualifier) ctx.getBean("annotationQualifier");

        log.debug("Dog name: {}", annotationQualifier.getDog().getName());
        log.debug("Cat name: {}", annotationQualifier.getCat().getName());
        ctx.close();
    }
}

abstract class Animal {
    public String getName() {
        return null;
    }
}

class Dog extends Animal {
    public String getName() {
        return "狗";
    }
}

class Cat extends Animal {
    public String getName() {
        return "猫";
    }
}
```

xml 中的配置

```xml
<!-- 测试@Qualifier -->
<bean id="dog" class="org.zp.notes.spring.beans.annotation.sample.Dog"/>
<bean id="cat" class="org.zp.notes.spring.beans.annotation.sample.Cat"/>
<bean id="annotationQualifier" class="org.zp.notes.spring.beans.annotation.sample.AnnotationQualifier"/>
```

#### JSR 250 注解

@Resource

Spring 支持 JSP250 规定的注解`@Resource`。这个注解根据指定的名称来注入 bean。

如果没有为`@Resource`指定名称，它会像`@Autowired`一样按照类型去寻找匹配。

在 Spring 中，由`CommonAnnotationBeanPostProcessor`来处理`@Resource`注解。

**_范例_**

```java
public class AnnotationResource {
    private static final Logger log = LoggerFactory.getLogger(AnnotationResource.class);

    @Resource(name = "flower")
    Plant flower;

    @Resource(name = "tree")
    Plant tree;

    public Plant getFlower() {
        return flower;
    }

    public void setFlower(Plant flower) {
        this.flower = flower;
    }

    public Plant getTree() {
        return tree;
    }

    public void setTree(Plant tree) {
        this.tree = tree;
    }

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext ctx =
                        new ClassPathXmlApplicationContext("spring/spring-annotation.xml");

        AnnotationResource annotationResource =
                        (AnnotationResource) ctx.getBean("annotationResource");
        log.debug("type: {}, name: {}", annotationResource.getFlower().getClass(), annotationResource.getFlower().getName());
        log.debug("type: {}, name: {}", annotationResource.getTree().getClass(), annotationResource.getTree().getName());
        ctx.close();
    }
}
```

xml 的配置

```xml
<!-- 测试@Resource -->
<bean id="flower" class="org.zp.notes.spring.beans.annotation.sample.Flower"/>
<bean id="tree" class="org.zp.notes.spring.beans.annotation.sample.Tree"/>
<bean id="annotationResource" class="org.zp.notes.spring.beans.annotation.sample.AnnotationResource"/>
```

- **`@PostConstruct` 和 `@PreDestroy`**

`@PostConstruct` 和 `@PreDestroy` 是 JSR 250 规定的用于生命周期的注解。

从其名号就可以看出，一个是在构造之后调用的方法，一个是销毁之前调用的方法。

```java
public class AnnotationPostConstructAndPreDestroy {
    private static final Logger log = LoggerFactory.getLogger(AnnotationPostConstructAndPreDestroy.class);

    @PostConstruct
    public void init() {
        log.debug("call @PostConstruct method");
    }

    @PreDestroy
    public void destroy() {
        log.debug("call @PreDestroy method");
    }
}
```

#### JSR 330 注解

从 Spring3.0 开始，Spring 支持 JSR 330 标准注解（依赖注入）。

注：如果要使用 JSR 330 注解，需要使用外部 jar 包。

若你使用 maven 管理 jar 包，只需要添加依赖到 pom.xml 即可：

```xml
<dependency>
  <groupId>javax.inject</groupId>
  <artifactId>javax.inject</artifactId>
  <version>1</version>
</dependency>
```

@Inject

`@Inject`和`@Autowired`一样，可以修饰属性、setter 方法、构造方法。

**_范例_**

```java
public class AnnotationInject {
    private static final Logger log = LoggerFactory.getLogger(AnnotationInject.class);
    @Inject
    Apple fieldA;

    Banana fieldB;

    Orange fieldC;

    public Apple getFieldA() {
        return fieldA;
    }

    public void setFieldA(Apple fieldA) {
        this.fieldA = fieldA;
    }

    public Banana getFieldB() {
        return fieldB;
    }

    @Inject
    public void setFieldB(Banana fieldB) {
        this.fieldB = fieldB;
    }

    public Orange getFieldC() {
        return fieldC;
    }

    public AnnotationInject() {}

    @Inject
    public AnnotationInject(Orange fieldC) {
        this.fieldC = fieldC;
    }

    public static void main(String[] args) throws Exception {
        AbstractApplicationContext ctx =
                        new ClassPathXmlApplicationContext("spring/spring-annotation.xml");
        AnnotationInject annotationInject = (AnnotationInject) ctx.getBean("annotationInject");

        log.debug("type: {}, name: {}", annotationInject.getFieldA().getClass(),
                        annotationInject.getFieldA().getName());

        log.debug("type: {}, name: {}", annotationInject.getFieldB().getClass(),
                        annotationInject.getFieldB().getName());

        log.debug("type: {}, name: {}", annotationInject.getFieldC().getClass(),
                        annotationInject.getFieldC().getName());

        ctx.close();
    }
}
```

Java 配置

基于 Java 配置 Spring IoC 容器，实际上是 Spring 允许用户定义一个类，在这个类中去管理 IoC 容器的配置。

为了让 Spring 识别这个定义类为一个 Spring 配置类，需要用到两个注解：@Configuration 和@Bean。

如果你熟悉 Spring 的 xml 配置方式，你可以将@Configuration 等价于<beans>标签；将@Bean 等价于<bean>标签。

@Bean

@Bean 的修饰目标只能是方法或注解。

@Bean 只能定义在@Configuration 或@Component 注解修饰的类中。

声明一个 bean

此外，@Configuration 类允许在同一个类中通过@Bean 定义内部 bean 依赖。

声明一个 bean，只需要在 bean 属性的 set 方法上标注@Bean 即可。

    @Configuration
    public class AnnotationConfiguration {
        private static final Logger log = LoggerFactory.getLogger(JavaComponentScan.class);
    
        @Bean
        public Job getPolice() {
            return new Police();
        }
    
        public static void main(String[] args) {
            AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(AnnotationConfiguration.class);
            ctx.scan("org.zp.notes.spring.beans");
            ctx.refresh();
            Job job = (Job) ctx.getBean("police");
            log.debug("job: {}, work: {}", job.getClass(), job.work());
        }
    }
    
    public interface Job {
        String work();
    }
    
    @Component("police")
    public class Police implements Job {
        @Override
        public String work() {
            return "抓罪犯";
        }
    }

这等价于配置

    <beans>
    	<bean id="police" class="org.zp.notes.spring.ioc.sample.job.Police"/>
    </beans>

@Bean 注解用来表明一个方法实例化、配置合初始化一个被 Spring IoC 容器管理的新对象。

如果你熟悉 Spring 的 xml 配置，你可以将@Bean 视为等价于<beans>标签。

@Bean 注解可以用于任何的 Spring @Component bean，然而，通常被用于@Configuration bean。

@Configuration

@Configuration 是一个类级别的注解，用来标记被修饰类的对象是一个 BeanDefinition。

@Configuration 类声明 bean 是通过被@Bean 修饰的公共方法。此外，@Configuration 类允许在同一个类中通过@Bean 定义内部 bean 依赖。

    @Configuration
    public class AppConfig {
        @Bean
        public MyService myService() {
            return new MyServiceImpl();
        }
    }

这等价于配置

    <beans>
    	<bean id="myService" class="com.acme.services.MyServiceImpl"/>
    </beans>

用 AnnotationConfigApplicationContext 实例化 IoC 容器。

### Java 配置

基于 Java 配置 Spring IoC 容器，实际上是**Spring 允许用户定义一个类，在这个类中去管理 IoC 容器的配置**。

为了让 Spring 识别这个定义类为一个 Spring 配置类，需要用到两个注解：`@Configuration`和`@Bean`。

如果你熟悉 Spring 的 xml 配置方式，你可以将`@Configuration`等价于`<beans>`标签；将`@Bean`等价于`<bean>`标签。

#### @Bean

@Bean 的修饰目标只能是方法或注解。

@Bean 只能定义在`@Configuration`或`@Component`注解修饰的类中。

#### 声明一个 bean

此外，@Configuration 类允许在同一个类中通过@Bean 定义内部 bean 依赖。

声明一个 bean，只需要在 bean 属性的 set 方法上标注@Bean 即可。

```java
@Configuration
public class AnnotationConfiguration {
    private static final Logger log = LoggerFactory.getLogger(JavaComponentScan.class);

    @Bean
    public Job getPolice() {
        return new Police();
    }

    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(AnnotationConfiguration.class);
        ctx.scan("org.zp.notes.spring.beans");
        ctx.refresh();
        Job job = (Job) ctx.getBean("police");
        log.debug("job: {}, work: {}", job.getClass(), job.work());
    }
}

public interface Job {
    String work();
}

@Component("police")
public class Police implements Job {
    @Override
    public String work() {
        return "抓罪犯";
    }
}
```

这等价于配置

```xml
<beans>
	<bean id="police" class="org.zp.notes.spring.ioc.sample.job.Police"/>
</beans>
```

@Bean 注解用来表明一个方法实例化、配置合初始化一个被 Spring IoC 容器管理的新对象。

如果你熟悉 Spring 的 xml 配置，你可以将@Bean 视为等价于`<beans>`标签。

@Bean 注解可以用于任何的 Spring `@Component` bean，然而，通常被用于`@Configuration` bean。

#### @Configuration

`@Configuration` 是一个类级别的注解，用来标记被修饰类的对象是一个`BeanDefinition`。

`@Configuration` 声明 bean 是通过被 `@Bean` 修饰的公共方法。此外，`@Configuration` 允许在同一个类中通过 `@Bean` 定义内部 bean 依赖。

```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

这等价于配置

```xml
<beans>
	<bean id="myService" class="com.acme.services.MyServiceImpl"/>
</beans>
```

用 `AnnotationConfigApplicationContext` 实例化 IoC 容器。