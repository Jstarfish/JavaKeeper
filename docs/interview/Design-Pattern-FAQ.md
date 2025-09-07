---
title: 设计模式八股文
date: 2024-08-31
tags: 
 - 设计模式
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> 设计模式是Java开发者**必备的技能**，也是面试中**高频考点**。从经典的23种GoF设计模式到Spring框架中的模式应用，从单例模式的7种写法到代理模式的动态实现，每一个模式都承载着前辈的智慧结晶。掌握设计模式，让你的代码更优雅、更健壮、更具扩展性！
>
> 设计模式面试要点：
>
> - 设计原则（SOLID原则、迪米特法则、合成复用原则）
> - 创建型模式（单例、工厂、建造者、原型、抽象工厂）
> - 结构型模式（适配器、装饰器、代理、桥接、组合、外观、享元）
> - 行为型模式（观察者、策略、模板方法、责任链、状态、命令）
> - 实际应用（Spring中的模式、项目实战经验）



## 🗺️ 知识导航

### 🏷️ 核心知识分类

1. **📏 设计原则**：SOLID原则、开闭原则、里氏替换原则、依赖倒置原则、单一职责原则
2. **🏗️ 创建型模式**：单例模式、工厂模式、建造者模式、原型模式、抽象工厂模式
3. **🔧 结构型模式**：适配器模式、装饰器模式、代理模式、桥接模式、组合模式、外观模式、享元模式
4. **⚡ 行为型模式**：观察者模式、策略模式、模板方法模式、责任链模式、状态模式、命令模式、中介者模式
5. **🌟 实际应用**：Spring中的设计模式、项目实战案例、最佳实践

### 🔑 面试话术模板

| **问题类型** | **回答框架**                        | **关键要点**       | **深入扩展**       |
| ------------ | ----------------------------------- | ------------------ | ------------------ |
| **概念解释** | 定义→目的→结构→应用                 | 核心思想，解决问题 | 源码分析，实际项目 |
| **模式对比** | 相同点→不同点→使用场景→选择建议     | 多维度对比         | 性能差异，适用性   |
| **实现原理** | 背景→问题→解决方案→代码实现         | UML图，代码结构    | 源码实现，优缺点   |
| **应用实践** | 项目背景→遇到问题→选择模式→效果评估 | 实际案例           | 最佳实践，踩坑经验 |

---

## 📏 一、设计原则（Design Principles）

> **核心思想**：设计原则是设计模式的理论基础，指导我们写出高质量的代码，是所有设计模式遵循的基本准则。

### 🎯 什么是设计模式？你是否在你的代码里面使用过任何设计模式？

"设计模式是软件开发中经过验证的，用于解决特定环境下重复出现问题的解决方案：

**设计模式的本质**：

- 是一套被反复使用、多数人知晓的、经过分类的、代码设计经验的总结
- 提供了一种统一的术语和概念，便于开发者之间的沟通
- 提高代码的可重用性、可读性、可靠性和可维护性

**GoF 23种设计模式**：

- 创建型模式（5种）：关注对象的创建
- 结构型模式（7种）：关注类和对象的组合
- 行为型模式（11种）：关注对象之间的通信

**在项目中的应用**：

- 单例模式：配置管理器、数据库连接池
- 工厂模式：对象创建、消息处理器选择
- 观察者模式：事件处理、消息通知
- 策略模式：支付方式选择、算法切换

设计模式不是万能的，要根据具体场景选择，避免过度设计。"

### 🎯 请说说你了解的设计原则有哪些？

"设计原则是设计模式的理论基础，主要有SOLID五大原则：

**SOLID原则**：

**1. 单一职责原则（Single Responsibility Principle, SRP）**：

- 一个类只应该有一个引起它变化的原因
- 每个类只负责一项职责，降低代码复杂度
- 例：User类只负责用户属性，UserService负责用户业务逻辑

**2. 开闭原则（Open-Closed Principle, OCP）**：

- 对扩展开放，对修改关闭
- 通过抽象和多态实现功能扩展而不修改现有代码
- 例：策略模式中新增支付方式无需修改原有支付逻辑

**3. 里氏替换原则（Liskov Substitution Principle, LSP）**：

- 子类对象能够替换父类对象而不影响程序正确性
- 子类必须能够完全替代父类，保持行为一致性
- 例：Rectangle和Square的继承关系设计

**4. 接口隔离原则（Interface Segregation Principle, ISP）**：

- 客户端不应该依赖它不需要的接口
- 使用多个专门的接口比使用单一的总接口要好
- 例：将大接口拆分成多个小而专一的接口

**5. 依赖倒置原则（Dependency Inversion Principle, DIP）**：

- 高层模块不应该依赖低层模块，两者都应该依赖抽象
- 抽象不应该依赖细节，细节应该依赖抽象
- 例：控制器依赖Service接口而不是具体实现类

**其他重要原则**：

- **合成复用原则**：优先使用对象组合而非类继承
- **迪米特法则**：一个对象应该对其他对象保持最少的了解

这些原则指导我们设计出松耦合、高内聚、可扩展的代码。"

### 🎯 什么是开闭原则？如何在代码中应用？

"开闭原则是面向对象设计的核心原则，对扩展开放，对修改关闭：

**核心思想**：

- 当需求变化时，应该通过扩展现有代码来实现变化
- 而不是修改现有的代码
- 通过抽象化来实现开闭原则

**实现方式**：

- 使用抽象类或接口来定义规范
- 具体实现通过继承或实现来扩展功能
- 依赖注入和多态来实现灵活的扩展

**代码示例**：

```java
// 抽象支付接口
interface PaymentStrategy {
    void pay(double amount);
}

// 具体支付实现
class AlipayPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("支付宝支付: " + amount);
    }
}

class WechatPayment implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("微信支付: " + amount);
    }
}

// 支付上下文
class PaymentContext {
    private PaymentStrategy strategy;

    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void executePayment(double amount) {
        strategy.pay(amount);
    }
}
```

**新增银行卡支付时**：

- 只需新增BankCardPayment类实现PaymentStrategy
- 无需修改PaymentContext或其他现有代码
- 完美体现了对扩展开放，对修改关闭

开闭原则是设计模式的基石，策略模式、工厂模式等都体现了这一原则。"

---

## 🏗️ 二、创建型模式（Object Creation）

> **核心思想**：封装对象的创建过程，使系统独立于如何创建、组合和表示对象。



### 🎯 请列举出在 JDK 中几个常用的设计模式？

"JDK中大量使用了设计模式，这些模式的应用体现了优秀的软件设计：

**创建型模式**：

- 单例模式：Runtime类、Calendar类确保全局唯一实例
- 工厂模式：Boolean.valueOf()、Integer.valueOf()等工厂方法
- 建造者模式：StringBuilder、StringBuffer的链式调用

**结构型模式**：

- 装饰器模式：Java IO流体系（BufferedReader装饰FileReader）
- 适配器模式：Arrays.asList()将数组适配为List
- 代理模式：动态代理机制（java.lang.reflect.Proxy）

**行为型模式**：

- 观察者模式：Swing/AWT事件机制、PropertyChangeSupport
- 策略模式：Collections.sort()的Comparator参数
- 模板方法模式：AbstractList、AbstractMap等抽象类
- 迭代器模式：Collection接口的iterator()方法

这些模式的应用让JDK的API设计更加灵活和可扩展。"



### 🎯 什么是单例模式？有哪些应用场景？请用 Java 写出线程安全的单例模式

"单例模式确保一个类只有一个实例，并提供全局访问点：

**单例模式定义**：

- 保证一个类仅有一个实例，并提供一个访问它的全局访问点
- 控制实例数量，避免资源浪费和状态不一致
- 延迟初始化，需要时才创建实例

**应用场景**：

- 系统资源：数据库连接池、线程池、缓存管理器
- 配置对象：应用程序配置、系统设置管理
- 工具类：日志记录器、打印机管理器
- 硬件接口：设备驱动程序（如打印机驱动）

**优缺点分析**：

- 优点：节约内存、避免重复创建、全局访问点
- 缺点：违反单一职责、不利于测试、可能成为性能瓶颈"

**💻 单例模式的7种实现方式**：

**推荐程度排序：枚举 > 静态内部类 > 双重校验锁 > 饿汉式 > 懒汉式**

**1. 懒汉式（线程不安全）**：

```java
public class LazySingleton {
    private static LazySingleton instance;
    
    private LazySingleton() {}
    
    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();  // 多线程下可能创建多个实例
        }
        return instance;
    }
}
```

**2. 懒汉式（线程安全，同步效率低）**：

```java
public class SynchronizedLazySingleton {
    private static SynchronizedLazySingleton instance;
    
    private SynchronizedLazySingleton() {}
    
    public static synchronized SynchronizedLazySingleton getInstance() {
        if (instance == null) {
            instance = new SynchronizedLazySingleton();
        }
        return instance;
    }
}
```

**3. 饿汉式（推荐）**：

```java
public class EagerSingleton {
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    private EagerSingleton() {}
    
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}
```

**4. 饿汉式变种（静态代码块）**：

```java
public class StaticBlockSingleton {
    private static final StaticBlockSingleton INSTANCE;
    
    static {
        INSTANCE = new StaticBlockSingleton();
    }
    
    private StaticBlockSingleton() {}
    
    public static StaticBlockSingleton getInstance() {
        return INSTANCE;
    }
}
```

**5. 静态内部类（强烈推荐）**：

```java
public class InnerClassSingleton {
    private InnerClassSingleton() {}
    
    // 静态内部类，JVM保证线程安全，懒加载
    private static class SingletonHolder {
        private static final InnerClassSingleton INSTANCE = new InnerClassSingleton();
    }
    
    public static InnerClassSingleton getInstance() {
        return SingletonHolder.INSTANCE;  // 触发内部类加载
    }
}
```

**6. 枚举（最佳实现）**：

```java
public enum EnumSingleton {
    INSTANCE;
    
    // 可以添加其他方法
    public void doSomething() {
        System.out.println("EnumSingleton doing something...");
    }
    
    public void anotherMethod() {
        // 业务逻辑
    }
}

// 使用方式
// EnumSingleton.INSTANCE.doSomething();
```

**7. 双重校验锁（DCL，推荐）**：

```java
public class DoubleCheckedLockingSingleton {
    // volatile防止指令重排序
    private volatile static DoubleCheckedLockingSingleton instance;
    
    private DoubleCheckedLockingSingleton() {}
    
    public static DoubleCheckedLockingSingleton getInstance() {
        // 第一次检查，避免不必要的同步
        if (instance == null) {
            synchronized (DoubleCheckedLockingSingleton.class) {
                // 第二次检查，确保线程安全
                if (instance == null) {
                    instance = new DoubleCheckedLockingSingleton();
                }
            }
        }
        return instance;
    }
}
```

**💡 各种实现方式对比**：

| **实现方式** | **线程安全** | **懒加载** | **性能** | **推荐度** | **特点** |
| ------------ | ------------ | ---------- | -------- | ---------- | -------- |
| 懒汉式 | ❌ | ✅ | 高 | ⭐ | 最简单但不安全 |
| 同步懒汉式 | ✅ | ✅ | 低 | ⭐⭐ | 安全但效率低 |
| 饿汉式 | ✅ | ❌ | 高 | ⭐⭐⭐ | 简单安全，可能浪费内存 |
| 静态内部类 | ✅ | ✅ | 高 | ⭐⭐⭐⭐⭐ | 完美解决方案 |
| 枚举 | ✅ | ❌ | 高 | ⭐⭐⭐⭐⭐ | 最简洁，防反射和序列化 |
| 双重校验锁 | ✅ | ✅ | 高 | ⭐⭐⭐⭐ | 复杂但高效 |


### 🎯 如何防止反射和序列化破坏单例？

"单例模式的两大威胁是反射和序列化，需要采取防护措施：

**反射攻击演示**：

```java
// 正常获取单例
Singleton instance1 = Singleton.getInstance();

// 反射破坏单例
Constructor<Singleton> constructor = Singleton.class.getDeclaredConstructor();
constructor.setAccessible(true);
Singleton instance2 = constructor.newInstance();

System.out.println(instance1 == instance2); // false，单例被破坏
```

**防御措施**：

**方案1：构造函数防护**

```java
public class AntiReflectionSingleton {
 private static volatile AntiReflectionSingleton instance;
 private static boolean initialized = false;

 private AntiReflectionSingleton() {
     synchronized (AntiReflectionSingleton.class) {
         if (initialized) {
             throw new RuntimeException("单例已存在，禁止反射创建");
         }
         initialized = true;
     }
 }
}
```

**方案2：枚举天然防御**

```java
public enum EnumSingleton {
 INSTANCE;
 // JVM层面防止反射调用枚举构造器
}
```



**序列化攻击演示**：

```java
// 序列化破坏单例
Singleton instance1 = Singleton.getInstance();

// 序列化
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("singleton.ser"));
oos.writeObject(instance1);

// 反序列化创建新实例
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("singleton.ser"));
Singleton instance2 = (Singleton) ois.readObject();

System.out.println(instance1 == instance2); // false，单例被破坏
```

**防御措施：实现readResolve方法**

```java
public class SerializationSafeSingleton implements Serializable {
 private static final long serialVersionUID = 1L;
 private static volatile SerializationSafeSingleton instance;

 private SerializationSafeSingleton() {}

 public static SerializationSafeSingleton getInstance() {
     if (instance == null) {
         synchronized (SerializationSafeSingleton.class) {
             if (instance == null) {
                 instance = new SerializationSafeSingleton();
             }
         }
     }
     return instance;
 }

 // 关键：反序列化时返回已有实例
 private Object readResolve() {
     return getInstance();
 }
}
```

**终极解决方案：枚举单例**

```java
public enum UltimateSingleton {
 INSTANCE;

 public void doSomething() {
     System.out.println("枚举单例天然防止反射和序列化攻击");
 }
}
```

枚举是实现单例的最佳方式：线程安全、懒加载、防反射、防序列化。"

**💡 单例模式最佳实践**：

1. **优先选择枚举**：代码简洁，天然安全
2. **次选静态内部类**：懒加载+高性能
3. **避免反射攻击**：构造器中添加检查
4. **防序列化破坏**：实现readResolve方法
5. **考虑实际需求**：是否真的需要全局唯一



### 🎯 使用工厂模式最主要的好处是什么？在哪里使用？

"工厂模式是创建型设计模式的核心，主要解决对象创建的复杂性：

**工厂模式的好处**：

- **解耦创建和使用**：客户端不需要知道具体对象的创建细节
- **封装变化**：新增产品类型时，只需扩展工厂，无需修改客户端
- **统一管理**：集中控制对象的创建逻辑，便于维护
- **提高复用性**：相同的创建逻辑可以被多处复用

**应用场景**：

- **数据库连接**：根据配置创建不同数据库的连接
- **日志框架**：根据级别创建不同的日志处理器
- **UI组件**：根据操作系统创建对应的界面组件
- **支付系统**：根据支付方式创建对应的支付处理器

**JDK中的应用**：

- `Boolean.valueOf()`, `Integer.valueOf()`等工厂方法
- `Calendar.getInstance()`获取日历实例
- `NumberFormat.getInstance()`创建格式化器

工厂模式让系统更加灵活，符合开闭原则。"

  

### 🎯 简单工厂、工厂方法和抽象工厂的区别？

"工厂模式有三种类型，复杂程度和应用场景各不相同：

**简单工厂（Simple Factory）**：

- 一个工厂类根据参数创建不同产品
- 违反开闭原则，新增产品需要修改工厂类
- 适用于产品种类较少且稳定的场景

**工厂方法（Factory Method）**：

- 每种产品对应一个具体工厂
- 符合开闭原则，新增产品只需新增工厂
- 适用于产品族较少但产品种类可能增加的场景

**抽象工厂（Abstract Factory）**：

- 创建一系列相关的产品族
- 适用于有多个产品族，每个产品族有多个产品的场景
- 如：不同风格的UI组件（Windows风格、Mac风格）

**选择建议**：简单工厂适合小项目，工厂方法适合中型项目，抽象工厂适合复杂的产品体系。"

**💻 代码示例对比**：

**简单工厂示例**：
```java
// 产品接口
interface Product {
    void use();
}

// 具体产品
class ProductA implements Product {
    public void use() { System.out.println("使用产品A"); }
}

class ProductB implements Product {
    public void use() { System.out.println("使用产品B"); }
}

// 简单工厂
class SimpleFactory {
    public static Product createProduct(String type) {
        switch (type) {
            case "A": return new ProductA();
            case "B": return new ProductB();
            default: throw new IllegalArgumentException("未知产品类型");
        }
    }
}
```

**工厂方法示例**：
```java
// 抽象工厂
interface Factory {
    Product createProduct();
}

// 具体工厂
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

**抽象工厂示例**：
```java
// 抽象工厂
interface AbstractFactory {
    ProductA createProductA();
    ProductB createProductB();
}

// 具体工厂族
class WindowsFactory implements AbstractFactory {
    public ProductA createProductA() { return new WindowsProductA(); }
    public ProductB createProductB() { return new WindowsProductB(); }
}

class MacFactory implements AbstractFactory {
    public ProductA createProductA() { return new MacProductA(); }
    public ProductB createProductB() { return new MacProductB(); }
}
```

---

## 🔧 三、结构型模式（Object Composition）

> **核心思想**：关注类和对象的组合，通过组合获得更强大的功能，解决如何将类或对象按某种布局组成更大的结构。

### 🎯 什么是代理模式？有哪几种代理？

**代理模式（Proxy Pattern）** 是一种结构型设计模式，用于为目标对象提供一个代理对象，通过代理对象来控制对目标对象的访问。代理对象在客户端与目标对象之间起到中介的作用，可以对访问进行控制、增强或简化。

- **静态代理**：在编译阶段，代理类已经被定义好。
- **动态代理**
  - 在运行时动态生成代理类，而不需要手动编写代理类代码。
  - 动态代理通常基于 **Java 反射** 实现，最常用的两种动态代理技术是 **JDK 动态代理** 和 **CGLIB 动态代理**。



### 🎯 静态代理和动态代理的区别？

| **对比维度**       | **静态代理**                                                 | **动态代理**                                                 |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **代理类生成时间** | 代理类在 **编译时** 已经生成，由开发者手动编写代理类。       | 代理类在 **运行时** 动态生成，不需要手动编写代理类。         |
| **实现方式**       | 手动创建一个实现目标类接口的代理类，通过代理类调用目标对象的方法。 | 使用反射机制（如 `Proxy` 或 `CGLIB`）在运行时生成代理类。    |
| **目标类要求**     | 目标类必须实现接口。                                         | **JDK 动态代理**：目标类必须实现接口。 **CGLIB 动态代理**：目标类无需实现接口，但不能是 `final` 类。 |
| **灵活性**         | 灵活性较低，每个目标类都需要一个对应的代理类，代码量较大。   | 灵活性高，一个代理类可以代理多个目标对象。                   |
| **性能**           | 性能略优于动态代理（因为无需反射机制）。                     | 性能略低于静态代理（因依赖反射）。 但在 CGLIB 中，性能接近静态代理。 |
| **实现难度**       | 实现简单，但代码量较多，维护麻烦。                           | 实现复杂，但代码量少，易于维护。                             |
| **扩展性**         | 扩展性差，新增目标类时需要新增代理类。                       | 扩展性好，新增目标类时无需新增代理类，只需修改动态代理逻辑。 |



### 🎯 JDK 动态代理和 CGLIB 动态代理的区别？

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

### 🎯 举一个用 Java 实现的装饰模式(decorator design pattern) ？它是作用于对象层次还是类层次？

"装饰器模式动态地给对象添加新功能，是**对象层次**的扩展：

**装饰器模式特点**：

- **对象组合优于继承**：通过包装而非继承扩展功能
- **运行时增强**：可以动态添加或撤销装饰
- **层层嵌套**：多个装饰器可以层层包装
- **透明性**：装饰后的对象与原对象有相同接口

**Java IO流的装饰器设计**：

```java
// 基础组件
InputStream fileStream = new FileInputStream("file.txt");

// 装饰器层层包装
InputStream bufferedStream = new BufferedInputStream(fileStream);     // 添加缓冲功能
InputStream dataStream = new DataInputStream(bufferedStream);         // 添加数据类型读取

// 等价于：new DataInputStream(new BufferedInputStream(new FileInputStream("file.txt")));
```

**作用层次**：装饰器模式作用于**对象层次**，而非类层次

- 不改变原有类的结构
- 通过对象组合实现功能扩展
- 比继承更加灵活，避免类爆炸

装饰器模式让功能扩展变得优雅而灵活。"



---

## ⚡ 四、行为型模式（Object Interaction）

> **核心思想**：关注对象之间的通信，负责对象间的有效沟通和职责委派，解决类或对象之间的交互问题。

### 🎯 在 Java 中，什么叫观察者设计模式（observer design pattern）？

观察者模式是基于对象的状态变化和观察者的通讯，以便他们作出相应的操作。简单的例子就是一个天气系统，当天气变化时必须在展示给公众的视图中进行反映。这个视图对象是一个主体，而不同的视图是观察者。



### 🎯 举一个用 Java 实现的装饰模式(decorator design pattern) ？它是作用于对象层次还是类层次？

"装饰器模式动态地给对象添加新功能，是**对象层次**的扩展：

**装饰器模式特点**：

- **对象组合优于继承**：通过包装而非继承扩展功能
- **运行时增强**：可以动态添加或撤销装饰
- **层层嵌套**：多个装饰器可以层层包装
- **透明性**：装饰后的对象与原对象有相同接口

**Java IO流的装饰器设计**：

```java
// 基础组件
InputStream fileStream = new FileInputStream("file.txt");

// 装饰器层层包装
InputStream bufferedStream = new BufferedInputStream(fileStream);     // 添加缓冲功能
InputStream dataStream = new DataInputStream(bufferedStream);         // 添加数据类型读取

// 等价于：new DataInputStream(new BufferedInputStream(new FileInputStream("file.txt")));
```

**作用层次**：装饰器模式作用于**对象层次**，而非类层次

- 不改变原有类的结构
- 通过对象组合实现功能扩展
- 比继承更加灵活，避免类爆炸

装饰器模式让功能扩展变得优雅而灵活。"



---

## 🌟 五、实际应用（Practical Application）

> **核心思想**：设计模式在实际项目中的应用案例和最佳实践，包括Spring框架、项目实战经验和开发建议。

### 🎯 Spring 当中用到了哪些设计模式？

"Spring框架大量运用设计模式，体现了优秀的架构设计：

**创建型模式**：

- **单例模式**：Spring Bean默认为单例，确保全局唯一性
- **工厂模式**：BeanFactory是工厂的抽象，ApplicationContext是具体工厂
- **建造者模式**：BeanDefinitionBuilder用于构建复杂的Bean定义
- **原型模式**：prototype作用域的Bean通过克隆创建

**结构型模式**：

- **代理模式**：AOP的核心实现，JDK动态代理和CGLIB代理
- **装饰器模式**：BeanWrapper装饰Bean，添加属性访问能力
- **适配器模式**：HandlerAdapter适配不同类型的Controller
- **外观模式**：ApplicationContext提供统一的访问接口

**行为型模式**：

- **模板方法模式**：JdbcTemplate、RestTemplate等模板类
- **策略模式**：Bean实例化策略选择（单例vs原型）
- **观察者模式**：ApplicationEvent和ApplicationListener
- **责任链模式**：Filter链、Interceptor链的处理方式

Spring的设计模式应用体现了框架的灵活性和可扩展性。"



### 🎯 在工作中遇到过哪些设计模式，是如何应用的

"在实际项目开发中，我经常使用以下设计模式：

**业务场景应用**：

- **策略模式**：支付方式选择（支付宝、微信、银行卡支付策略）
- **工厂模式**：消息处理器创建（短信、邮件、推送消息工厂）
- **模板方法模式**：业务流程框架（订单处理、审批流程模板）
- **责任链模式**：权限验证链、参数校验链、业务处理链
- **观察者模式**：系统事件通知（用户注册后发送邮件、积分等）

**系统设计应用**：

- **单例模式**：配置管理器、缓存管理器、日志记录器
- **建造者模式**：复杂查询条件构建、报表生成器
- **适配器模式**：第三方服务接口适配、遗留系统集成
- **代理模式**：AOP切面编程、性能监控、事务管理
- **外观模式**：微服务聚合接口、复杂子系统封装

设计模式让代码更易维护、扩展和理解，是高质量代码的基石。”



### 🎯 简述一下你了解的 Java 设计模式（总结）

"GoF 23种设计模式按用途分为三大类，每类解决不同层面的问题：

**⭐ 常用设计模式重点掌握**：

**创建型模式（5种）**：

- ⭐⭐⭐ **单例模式**：确保类只有一个实例，全局访问点
- ⭐⭐⭐ **工厂方法**：定义创建对象接口，子类决定实例化类型
- ⭐⭐ **建造者模式**：分步构造复杂对象，相同过程创建不同表示
- ⭐⭐ **原型模式**：通过克隆创建对象，避免复杂初始化
- ⭐ **抽象工厂**：创建相关对象族，无需指定具体类

**结构型模式（7种）**：

- ⭐⭐⭐ **代理模式**：为对象提供代理，控制访问并增强功能
- ⭐⭐⭐ **装饰模式**：动态添加对象功能，灵活扩展行为
- ⭐⭐ **适配器模式**：转换接口，让不兼容类协同工作
- ⭐⭐ **外观模式**：提供统一接口，简化子系统访问
- ⭐ **组合模式**：树形结构，统一处理单个和组合对象
- 桥接模式：分离抽象和实现，两者可独立变化
- 享元模式：共享对象减少内存使用

**行为型模式（11种）**：

- ⭐⭐⭐ **观察者模式**：对象间一对多依赖，状态变化通知所有观察者
- ⭐⭐⭐ **策略模式**：定义算法族，封装并可相互替换
- ⭐⭐ **模板方法**：定义算法骨架，子类实现具体步骤
- ⭐⭐ **责任链模式**：请求沿链传递，直到有对象处理
- ⭐ **状态模式**：对象内部状态改变时改变行为
- 命令模式：请求封装为对象，支持撤销和重做
- 访问者模式：分离算法与数据结构，便于添加新操作
- 中介者模式：集中处理对象间复杂交互
- 备忘录模式：保存对象状态，支持恢复
- 解释器模式：为语言定义文法表示和解释器
- 迭代器模式：顺序访问聚合对象元素

---

## 🎓 总结与最佳实践

设计模式不是银弹，但是优秀代码的重要组成部分。选择合适的模式，避免过度设计，在实际应用中不断练习和总结，才能真正掌握设计模式的精髓。记住：**设计模式是为了解决问题而存在的，不要为了使用模式而使用模式**。

### 🎯 学习设计模式的建议

1. **理解问题背景**：每个模式都是为了解决特定问题而产生的
2. **掌握核心结构**：理解模式的组成部分和它们之间的关系
3. **练习代码实现**：通过编写代码来加深理解
4. **结合实际项目**：在真实项目中寻找应用场景
5. **避免过度设计**：不要为了使用模式而使用模式

### 🎯 常见的设计误区

1. **模式万能论**：认为设计模式可以解决所有问题
2. **过度抽象**：为简单问题引入复杂的模式
3. **死记硬背**：只记住结构而不理解应用场景
4. **盲目套用**：不考虑具体情况强行使用某种模式

### 🎯 面试重点提醒

- 重点掌握单例、工厂、代理、观察者、策略等常用模式
- 理解设计原则，特别是开闭原则和单一职责原则
- 能够结合Spring框架说明模式的实际应用
- 准备1-2个项目中实际使用设计模式的案例

**最终目标**：让设计模式成为你编写高质量代码的有力工具！



