---
title: 「直击面试」—— 设计模式
date: 2023-05-31
tags: 
 - 设计模式
categories: 设计模式
---

![](https://img.starfish.ink/common/faq-banner.png)

> 使用UML类图画出原型模式核心角色
>
> 原型设计模式的深拷贝和浅拷贝是什么，并写出深拷贝的两种方式的源码(重写 clone 方法实现深拷贝、使用序列化来实现深拷贝 
>
> 设计模式的七大原则
>
> 在 Spring 框架中哪里使用到原型模式，并对源码进行分析 
>
> 介绍解释器设计模式是什么?



### 1、什么是设计模式？你是否在你的代码里面使用过任何设计模式？

软件设计模式（Software Design Pattern），又称设计模式，是指在软件开发中，经过验证的，用于解决在特定环境下、重复出现的、特定问题的**解决方案**。



### 2、请列举出在 JDK 中几个常用的设计模式？

单例模式（Singleton pattern）用于 Runtime，Calendar 和其他的一些类中。

工厂模式（Factory pattern）被用于各种不可变的类如 Boolean，像 Boolean.valueOf

观察者模式（Observer pattern）被用于 Swing 和很多的事件监听中。

装饰器设计模式（Decorator design pattern）被用于多个 Java IO 类中。



### 3、什么是单例模式？有哪些应用场景？请用 Java 写出线程安全的单例模式

**单例模式确保一个类只有一个实例，并提供一个全局唯一访问点**。有一些对象我们确实只需要一个，比如，线程池、数据库连接、缓存、日志对象等，如果有多个的话，会造成程序的行为异常，资源使用过量或者不一致的问题。

单例模式重点在于在整个系统上共享一些创建时较耗资源的对象。整个应用中只维护一个特定类实例，它被所有组件共同使用。`Java.lang.Runtime` 是单例模式的经典例子。从 Java5 开始你可以使用枚举（enum）来实现线程安全的单例。

**单例模式的 7 种写法：懒汉 2 种，枚举，饿汉 2 种，静态内部类，双重校验锁（推荐）。**

- 懒汉式：懒加载，线程不安全

```java
public class Singleton
{
    private static Singleton singleton;

    private Singleton(){
    }

    public static Singleton getInstance(){
        if (singleton == null)
            singleton = new Singleton();
        return singleton;
    }
}
```

- 懒汉式线程安全版：同步效率低

```java
public class Singleton
{
    private static Singleton singleton;

    private Singleton(){
    }

    public synchronized static Singleton getInstance(){
        if (singleton == null)
            singleton = new Singleton();
        return singleton;
    }
}
```

- 饿汉式：

```java
public class Singleton{
    private static Singleton singleton = new Singleton();

    private Singleton(){
    }

    public static Singleton getInstance(){
        return singleton;
    }
}
```

- 饿汉式变种：

```java
public class Singleton{
    private static Singleton singleton;
    static{
        singleton = new Singleton();
    }

    private Singleton(){
    }

    public static Singleton getInstance(){
        return singleton;
    }
}
```

- 静态内部类方式：利用 JVM 的加载机制，当使用到 SingletonHolder 才会进行初始化。

```java
public class Singleton{
    private Singleton(){
    }

    private static class SingletonHolder{
        private static final Singleton singleton = new Singleton();
    }

    public static Singleton getInstance(){
        return SingletonHolder.singleton;
    }
}
```

- 枚举：

```java
public enum Singletons
{
    INSTANCE;
    // 此处表示单例对象里面的各种方法
    public void Method(){
    }
}
```

- 双重校验锁：

```java
public class Singleton
{
    private volatile static Singleton singleton;

    private Singleton(){
    }

    public static Singleton getInstance()
    {
        if (singleton == null){
            synchronized (Singleton.class){
                if (singleton == null){
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```



### 4、如何防止反射和序列化破坏单例？

#### 1. 防止反射破坏单例

在 Java 中，即使实现了线程安全的单例模式，**反射**和**序列化/反序列化**仍可能破坏单例模式的约束（即只存在一个实例）

**防止反射破坏单例**

通过反射，可以调用私有构造函数创建新的实例，从而破坏单例模式。例如：

```java
Singleton instance1 = Singleton.getInstance();
Constructor<Singleton> constructor = Singleton.class.getDeclaredConstructor();
constructor.setAccessible(true); // 绕过私有访问限制
Singleton instance2 = constructor.newInstance();

System.out.println(instance1 == instance2); // false
```

这种方式直接调用了私有构造函数，从而生成了新的实例

**解决方法**

1.1 **在构造函数中添加防护机制**

通过在构造函数中添加防止多次实例化的逻辑，可以避免反射调用私有构造函数。

实现如下：

```java
public class Singleton {
    private static volatile Singleton instance;
    private static boolean isInstanceCreated = false;

    private Singleton() {
        // 如果已经有实例存在，抛出异常
        if (isInstanceCreated) {
            throw new RuntimeException("单例模式禁止通过反射创建多个实例");
        }
        isInstanceCreated = true;
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

原理：

- `isInstanceCreated` 标志记录是否已经创建过实例。
- 如果通过反射调用构造函数并尝试创建新的实例，会触发异常。

1.2 **使用枚举单例**

Java 的枚举类型天然防止反射破坏。即使通过反射调用 `Enum` 类的私有构造函数，也会抛出 `java.lang.IllegalArgumentException`。

实现如下：

```java
public enum Singleton {
    INSTANCE;

    public void doSomething() {
        System.out.println("Singleton using Enum");
    }
}
```

使用枚举的优点：

- 枚举本身是线程安全的。
- 防止反射和序列化破坏单例。



#### **2. 防止序列化/反序列化破坏单例**

通过序列化和反序列化，可以生成一个新的实例，从而破坏单例。例如：

```java
Singleton instance1 = Singleton.getInstance();

// 序列化
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("singleton.ser"));
oos.writeObject(instance1);
oos.close();

// 反序列化
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("singleton.ser"));
Singleton instance2 = (Singleton) ois.readObject();
ois.close();

System.out.println(instance1 == instance2); // false
```

序列化和反序列化过程中，会重新创建一个新的对象，破坏了单例模式。

**解决方法**

2.1 **实现 `readResolve` 方法**

通过实现 `readResolve` 方法，可以在反序列化时，返回已有的单例对象，而不是创建新的实例。

修改后的代码如下：

```java
import java.io.Serializable;

public class Singleton implements Serializable {
    private static final long serialVersionUID = 1L;

    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    // 防止反序列化创建新实例
    protected Object readResolve() {
        return getInstance();
    }
}
```

原理：

- 序列化时，Java 会将对象转换为字节流。
- 反序列化时，`readResolve` 方法会被调用，用以替换从字节流中反序列化出来的对象。
- 这样可以确保返回的是单例实例，而不是新的实例

同样地，枚举天生支持序列化，且反序列化时不会创建新的对象。



### 5、 使用工厂模式最主要的好处是什么？在哪里使用？

工厂模式是一种**创建型设计模式**，用于将对象的创建过程与使用过程解耦。其主要目的是**隐藏对象创建的复杂性**，使代码更具灵活性和扩展性。

使用工厂的理由： 

- **解耦——降低代码的耦合度**：客户端（调用者）不需要了解具体对象的创建细节，只需要通过工厂接口获取对象。

- **可以使代码结构清晰，有效地封装变化**：新增对象类型时，只需扩展工厂类，而不需要修改客户端代码

- **简化对象的创建：**某些对象的创建过程可能非常复杂，涉及多步骤初始化或配置。工厂模式将这些复杂的创建逻辑封装在工厂类中，客户端只需调用工厂方法，获取创建好的对象。

  

### 6、简单工厂、工厂方法和抽象工厂的区别？

简单工厂其实不是一个标准的的设计模式。GOF 23 种设计模式中只有「工厂方法模式」与「抽象工厂模式」。

简单工厂模式可以看为工厂方法模式的一种特例。

各模式的理解： 

- 简单工厂：把对象的创建放到一个工厂类中，通过参数来创建不同的对象。 

  ```java
  class SimpleFactory {
      public static Product createProduct(String type) {
          if (type.equals("A")) {
              return new ProductA();
          } else if (type.equals("B")) {
              return new ProductB();
          }
          return null;
      }
  }
  ```

- 工厂方法：每种产品由一种工厂来创建。（每次增加一个产品时，都需要增加一个具体类和对象实现工厂）

  ```java
  interface Factory {
      Product createProduct();
  }
  class ProductAFactory implements Factory {
      public Product createProduct() {
          return new ProductA();
      }
  }
  class ProductBFactory implements Factory {
      public Product createProduct() {
          return new ProductB();
      }
  }
  ```

- 抽象工厂：对工厂方法的改进，一个产品族对应一个工厂

  ```java
  interface AbstractFactory {
      ProductA createProductA();
      ProductB createProductB();
  }
  ```

  

### 什么是代理模式？有哪几种代理？

**代理模式（Proxy Pattern）** 是一种结构型设计模式，用于为目标对象提供一个代理对象，通过代理对象来控制对目标对象的访问。代理对象在客户端与目标对象之间起到中介的作用，可以对访问进行控制、增强或简化。

- **静态代理**：在编译阶段，代理类已经被定义好。
- **动态代理**
  - 在运行时动态生成代理类，而不需要手动编写代理类代码。
  - 动态代理通常基于 **Java 反射** 实现，最常用的两种动态代理技术是 **JDK 动态代理** 和 **CGLIB 动态代理**。



### 静态代理和动态代理的区别？

| **对比维度**       | **静态代理**                                                 | **动态代理**                                                 |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **代理类生成时间** | 代理类在 **编译时** 已经生成，由开发者手动编写代理类。       | 代理类在 **运行时** 动态生成，不需要手动编写代理类。         |
| **实现方式**       | 手动创建一个实现目标类接口的代理类，通过代理类调用目标对象的方法。 | 使用反射机制（如 `Proxy` 或 `CGLIB`）在运行时生成代理类。    |
| **目标类要求**     | 目标类必须实现接口。                                         | **JDK 动态代理**：目标类必须实现接口。 **CGLIB 动态代理**：目标类无需实现接口，但不能是 `final` 类。 |
| **灵活性**         | 灵活性较低，每个目标类都需要一个对应的代理类，代码量较大。   | 灵活性高，一个代理类可以代理多个目标对象。                   |
| **性能**           | 性能略优于动态代理（因为无需反射机制）。                     | 性能略低于静态代理（因依赖反射）。 但在 CGLIB 中，性能接近静态代理。 |
| **实现难度**       | 实现简单，但代码量较多，维护麻烦。                           | 实现复杂，但代码量少，易于维护。                             |
| **扩展性**         | 扩展性差，新增目标类时需要新增代理类。                       | 扩展性好，新增目标类时无需新增代理类，只需修改动态代理逻辑。 |



### JDK 动态代理和 CGLIB 动态代理的区别？

| **对比维度**        | **JDK 动态代理**                                             | **CGLIB 动态代理**                                           |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **实现方式**        | 基于 **Java 反射机制** 和接口实现，使用 `java.lang.reflect.Proxy`。 | 基于 **字节码增强** 技术，使用第三方库（如 `CGLIB` 或 `ASM`）。 |
| **代理对象要求**    | 目标类必须实现 **接口**。                                    | 目标类 **无需实现接口**，可以代理普通类。                    |
| **继承限制**        | 无需继承，直接代理接口即可。                                 | 目标类不能是 `final` 类，代理的方法也不能是 `final` 方法（因为无法被重写）。 |
| **性能**            | 性能略低（因反射调用方法效率较低）。                         | 性能较高（直接生成字节码，调用方法接近普通方法调用）。       |
| **代码依赖**        | 无需依赖外部库，属于 JDK 原生功能。                          | 需要引入 `CGLIB` 或其他字节码增强库（如 ASM）。              |
| **应用场景**        | 目标类实现了接口时适用。                                     | 目标类未实现接口或需要对具体类进行代理时适用。               |
| **实现复杂度**      | 简单，使用 `Proxy` 类和 `InvocationHandler` 接口生成代理对象。 | 复杂，需要处理字节码增强逻辑（通常通过工具库封装）。         |
| **Spring AOP 支持** | 默认情况下，Spring AOP 使用 JDK 动态代理（如果目标类实现了接口）。 | Spring 会使用 CGLIB 动态代理（如果目标类未实现接口）。       |



### 在 Java 中，什么叫观察者设计模式（observer design pattern ）？

观察者模式是基于对象的状态变化和观察者的通讯，以便他们作出相应的操作。简单的例子就是一个天气系统，当天气变化时必须在展示给公众的视图中进行反映。这个视图对象是一个主体，而不同的视图是观察者。



### 举一个用 Java 实现的装饰模式(decorator design pattern) ？它是作用于对象层次还是类层次？

装饰模式增加强了单个对象的能力。Java IO 到处都使用了装饰模式，典型例子就是 Buffered 系列类如 BufferedReader 和 BufferedWriter，它们增强了 Reader 和 Writer 对象，以实现提升性能的 Buffer 层次的读取和写入。

动态地给一个对象增加一些额外的职责，就增加对象功能来说，装饰模式比生成子类实现更为灵活。装饰模式是一种对象结构型模式。装饰模式是一种用于替代继承的技术,使用对象之间的关联关系取代类之间的继承关系。在装饰模式中引入了装饰类，在装饰类中既可以调用待装饰的原有类的方法，还可以增加新的方法，以扩充原有类的功能。
装饰原有对象、在不改变原有对象的情况下扩展增强新功能/新特征.。当不能采用继承的方式对系统进行扩展或者采用继承不利于系统扩展和维护时可以使用装饰模式。



### 在 Java 中，为什么不允许从静态方法中访问非静态变量？

Java 中不能从静态上下文访问非静态数据只是因为非静态变量是跟具体的对象实例关联的，而静态的却没有和任何实例关联。



### 设计一个 ATM 机，请说出你的设计思路？

比如设计金融系统来说，必须知道它们应该在任何情况下都能够正常工作。不管是断电还是其他情况，ATM 应该保持正确的状态（事务） , 想想 加锁（locking）、事务（transaction）、错误条件（error condition）、边界条件（boundary condition） 等等。尽管你不能想到具体的设计，但如果你可以指出非功能性需求，提出一些问题，想到关于边界条件，这些都会是很好的。



### 在 Java 中，什么时候用重载，什么时候用重写？

如果你看到一个类的不同实现有着不同的方式来做同一件事，那么就应该用重写（overriding），而重载（overloading）是用不同的输入做同一件事。在 Java 中，重载的方法签名不同，而重写并不是。



### 举例说明什么情况下会更倾向于使用抽象类而不是接口？

接口和抽象类都遵循”面向接口而不是实现编码”设计原则，它可以增加代码的灵活性，可以适应不断变化的需求。下面有几个点可以帮助你回答这个问题：

在 Java 中，你只能继承一个类，但可以实现多个接口。所以一旦你继承了一个类，你就失去了继承其他类的机会了。

接口通常被用来表示附属描述或行为如：Runnable、Clonable、Serializable 等等，因此当你使用抽象类来表示行为时，你的类就不能同时是 Runnable 和 Clonable(注：这里的意思是指如果把 Runnable 等实现为抽象类的情况)，因为在 Java 中你不能继承两个类，但当你使用接口时，你的类就可以同时拥有多个不同的行为。

在一些对时间要求比较高的应用中，倾向于使用抽象类，它会比接口稍快一点。

如果希望把一系列行为都规范在类继承层次内，并且可以更好地在同一个地方进行编码，那么抽象类是一个更好的选择。有时，接口和抽象类可以一起使用，接口中定义函数，而在抽象类中定义默认的实现。



### Spring 当中用到了哪些设计模式？

- 模板方法模式：例如 jdbcTemplate，通过封装固定的数据库访问比如获取 connection、获取 statement，关闭 connection、关闭 statement 等
   然后将特殊的 SQL 操作交给用户自己实现。
- 策略模式：Spring 在初始化对象的时候，可以选择单例或者原型模式。
- 简单工厂：Spring 中的 BeanFactory 就是简单工厂模式的体现，根据传入一个唯一的标识来获得 bean 对象。
- 工厂方法模式：一般情况下，应用程序有自己的工厂对象来创建 bean，如果将应用程序自己的工厂对象交给 Spring 管理， 那么 Spring 管理的就不是普通的 bean，而是工厂 Bean。
- 单例模式：保证全局只有唯一一个对象。
- 适配器模式：SpringAOP 的 Advice 有如下：BeforeAdvice、AfterAdvice、AfterAdvice，而需要将这些增强转为 aop 框架所需的
   对应的拦截器 MethodBeforeAdviceInterceptor、AfterReturningAdviceInterceptor、ThrowsAdviceInterceptor。
- 代理模式：Spring 的 Proxy 模式在 aop 中有体现，比如 JdkDynamicAopProxy 和 Cglib2AopProxy。
- 装饰者模式：如 HttpServletRequestWrapper，自定义请求包装器包装请求，将字符编码转换的工作添加到 getParameter()方法中。
- 观察者模式：如启动初始化 Spring 时的 ApplicationListener 监听器。



### 在工作中遇到过哪些设计模式，是如何应用的

- 工厂模式（生产题型）。
- 策略模式（进行判题）。
- 模板方法模式（阅卷、判断题目信息是否正确，如条件 1,2,3，三个条件分别由子类实现），
- 建造者模式（组装试卷生成器）
- 状态模式（根据试卷类型进行不同抽题）
- 适配器模式（适配其他微服务，类似防腐层）
- 外观模式（将一些使用较工具类封装简单一点）
- 代理模式（AOP 切面编程）
- 责任链模式（推送、日志等额外操作）
- 组合模式（无限层级的知识点）



### 简述一下你了解的 Java 设计模式（总结）

标星号的为常用设计模式

```
★单例模式：保证某个类只能有一个唯一实例，并提供一个全局的访问点。
★简单工厂：一个工厂类根据传入的参数决定创建出那一种产品类的实例。
工厂方法：定义一个创建对象的接口，让子类决定实例化那个类。
抽象工厂：创建一组相关或依赖对象族，比如创建一组配套的汉堡可乐鸡翅。
★建造者模式：封装一个复杂对象的构建过程，并可以按步骤构造，最后再build。
★原型模式：通过复制现有的实例来创建新的实例，减少创建对象成本（字段需要复杂计算或者创建成本高）。
 
★适配器模式：将一个类的方法接口转换成我们希望的另外一个接口。
★组合模式：将对象组合成树形结构以表示“部分-整体”的层次结构。（无限层级的知识点树）
★装饰模式：动态的给对象添加新的功能。
★代理模式：为对象提供一个代理以增强对象内的方法。
亨元（蝇量）模式：通过共享技术来有效的支持大量细粒度的对象（Integer中的少量缓存）。
★外观模式：对外提供一个统一的方法，来访问子系统中的一群接口。
桥接模式：将抽象部分和它的实现部分分离，使它们都可以独立的变化（比如插座和充电器，他们之间相插是固定的，
但是至于插座是插在220V还是110V，充电器是充手机还是pad可以自主选择）。
 
★模板方法模式：定义一个算法步骤，每个小步骤由子类各自实现。
解释器模式：给定一个语言，定义它的文法的一种表示，并定义一个解释器。
★策略模式：定义一系列算法，把他们封装起来，并且使它们可以相互替换。
★状态模式：允许一个对象根据其内部状态改变而改变它的行为。
★观察者模式：被观测的对象发生改变时通知它的所有观察者。
备忘录模式：保存一个对象的某个状态，以便在适当的时候恢复对象。
中介者模式：许多对象利用中介者来进行交互，将网状的对象关系变为星状的（最少知识原则）。
命令模式：将命令请求封装为一个对象，可用于操作的撤销或重做。
访问者模式：某种物体的使用方式是不一样的，将不同的使用方式交给访问者，而不是给这个物体。（例如对铜的使用，造币厂
造硬币。雕刻厂造铜像，不应该把造硬币和造铜像的功能交给铜自己实现，这样才能解耦）
★责任链模式：避免请求发送者与接收者耦合在一起，让多个对象都有可能接收请求，将这些对象连接成一条链，
并且沿着这条链传递请求，直到有对象处理它为止。
迭代器模式：一种遍历访问聚合对象中各个元素的方法，不暴露该对象的内部结构。
```



