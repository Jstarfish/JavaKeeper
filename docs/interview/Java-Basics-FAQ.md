---
title: Java 基础八股文 
date: 2024-08-31
tags: 
 - Java
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> Java基础是所有Java开发者的**根基**，也是面试官考察的**重中之重**。从面向对象三大特性到泛型擦除机制，从异常处理到反射原理，每一个知识点都可能成为面试的关键。本文档将**最常考的Java基础**整理成**标准话术**，让你在面试中对答如流！

### 🔥 为什么Java基础如此重要？

- **📈 面试必考**：95%的Java岗都会深挖基础
- **🧠 思维体现**：体现你对Java语言的深度理解  
- **💼 工作基础**：日常开发中无处不在的核心概念
- **🎓 进阶前提**：框架、中间件都建立在基础之上

---

## 🗺️ 知识导航

### 🏷️ 核心知识分类

1. **🔥 面向对象编程**：封装、继承、多态、抽象类、接口、内部类
2. **📊 数据类型体系**：基本类型、包装类、自动装箱拆箱、类型转换
3. **🔤 字符串处理**：String、StringBuilder、StringBuffer、字符串常量池
4. **⚠️ 异常处理机制**：异常体系、try-catch-finally、异常传播、自定义异常
5. **🎯 泛型机制**：泛型语法、类型擦除、通配符、泛型边界
6. **🪞 反射机制**：Class对象、动态代理、注解处理、反射性能
7. **📁 IO流体系**：字节流、字符流、缓冲流、NIO基础
8. **🆕 Java新特性**：Lambda表达式、Stream API、Optional、函数式接口



### 🔑 面试话术模板

| **问题类型** | **回答框架**                        | **关键要点**       | **深入扩展**       |
| ------------ | ----------------------------------- | ------------------ | ------------------ |
| **概念解释** | 定义→特点→应用场景→示例             | 准确定义，突出特点 | 底层原理，源码分析 |
| **对比分析** | 相同点→不同点→使用场景→选择建议     | 多维度对比         | 性能差异，实际应用 |
| **原理解析** | 背景→实现机制→执行流程→注意事项     | 图解流程           | 源码实现，JVM层面  |
| **应用实践** | 问题场景→解决方案→代码实现→优化建议 | 实际案例           | 最佳实践，踩坑经验 |

---

## 🔥 一、面向对象编程（OOP核心）

> **核心思想**：将现实世界的事物抽象为对象，通过类和对象来组织代码，实现高内聚、低耦合的程序设计。

### 🎯 JDK、JRE、JVM的区别？

**📋 标准话术**：

> "JDK、JRE、JVM是Java技术体系的三个核心组件：
>
> **JVM（Java Virtual Machine）**：
>
> - Java虚拟机，是整个Java实现跨平台的最核心部分
> - 负责字节码的解释执行，提供内存管理、垃圾回收等功能
> - 不同操作系统有对应的JVM实现，但对上层透明
>
> **JRE（Java Runtime Environment）**：
>
> - Java运行时环境，包含JVM和Java核心类库
> - 是运行Java程序所必需的最小环境
> - 包括JVM标准实现及Java基础类库（如java.lang、java.util等）
>
> **JDK（Java Development Kit）**：
>
> - Java开发工具包，包含JRE以及开发工具
> - 提供编译器javac、调试器jdb、文档生成器javadoc等
> - 开发Java程序必须安装JDK，而运行Java程序只需JRE
>
> 简单说：JDK包含JRE，JRE包含JVM，开发用JDK，运行用JRE，执行靠JVM。"

**💻 代码示例**：

```java
public class JavaEnvironmentDemo {
    
    public static void main(String[] args) {
        // 获取Java环境信息
        System.out.println("=== Java Environment Info ===");
        
        // JVM相关信息
        System.out.println("JVM Name: " + System.getProperty("java.vm.name"));
        System.out.println("JVM Version: " + System.getProperty("java.vm.version"));
        System.out.println("JVM Vendor: " + System.getProperty("java.vm.vendor"));
        
        // JRE相关信息
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("Java Home: " + System.getProperty("java.home"));
        
        // 运行时环境信息
        Runtime runtime = Runtime.getRuntime();
        System.out.println("Available Processors: " + runtime.availableProcessors());
        System.out.println("Max Memory: " + runtime.maxMemory() / 1024 / 1024 + " MB");
        System.out.println("Total Memory: " + runtime.totalMemory() / 1024 / 1024 + " MB");
        System.out.println("Free Memory: " + runtime.freeMemory() / 1024 / 1024 + " MB");
        
        // 操作系统信息
        System.out.println("OS Name: " + System.getProperty("os.name"));
        System.out.println("OS Version: " + System.getProperty("os.version"));
        System.out.println("OS Architecture: " + System.getProperty("os.arch"));
        
        // Class Path信息
        System.out.println("Class Path: " + System.getProperty("java.class.path"));
    }
}

/*
 * JDK、JRE、JVM的层次关系：
 * 
 * ┌─────────────── JDK ───────────────┐
 * │  ┌─────────── JRE ──────────┐     │
 * │  │  ┌─── JVM ───┐           │     │
 * │  │  │           │           │     │
 * │  │  │  字节码   │  Java核心  │ 开发 │
 * │  │  │  执行引擎 │  类库      │ 工具 │
 * │  │  │  内存管理 │  (rt.jar)  │     │
 * │  │  │  垃圾回收 │           │     │
 * │  │  └───────────┘           │     │
 * │  └─────────────────────────┘     │
 * └───────────────────────────────────┘
 * 
 * 开发工具包括：
 * - javac: 编译器
 * - java: 运行器  
 * - javadoc: 文档生成
 * - jar: 打包工具
 * - jdb: 调试器
 * - jconsole: 监控工具
 */
```

### 🎯 Class和Object的区别？

**📋 标准话术**：

> "Class和Object有本质区别：
>
> **Class（类）**：
>
> - 是对象的模板或蓝图，定义了对象的属性和行为
> - 在Java中有两重含义：一是我们定义的Java类，二是java.lang.Class类
> - java.lang.Class保存了Java类的元信息，主要用于反射操作
> - 通过Class可以获取类的字段、方法、构造器等元数据
>
> **Object（对象）**：
>
> - 是类的具体实例，是类在内存中的具体表现
> - java.lang.Object是所有Java类的根父类，包括Class类本身
> - 提供了基础方法如equals()、hashCode()、toString()等
>
> **关系总结**：类是对象的模板，对象是类的实例；Class类用于反射获取类信息，Object类是所有类的基类。"

**💻 代码示例**：

```java
import java.lang.reflect.*;

public class ClassObjectDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. 演示Class和Object的关系
        demonstrateClassObjectRelation();
        
        // 2. Class类的使用（反射）
        demonstrateClassUsage();
        
        // 3. Object类的方法
        demonstrateObjectMethods();
    }
    
    // Class和Object关系演示
    public static void demonstrateClassObjectRelation() {
        System.out.println("=== Class and Object Relation ===");
        
        // 创建Student对象
        Student student1 = new Student("Alice", 20);
        Student student2 = new Student("Bob", 22);
        
        // 获取Class对象的三种方式
        Class<?> clazz1 = student1.getClass();      // 通过对象
        Class<?> clazz2 = Student.class;            // 通过类字面量
        try {
            Class<?> clazz3 = Class.forName("Student"); // 通过类名
            System.out.println("All Class objects are same: " + 
                (clazz1 == clazz2 && clazz2 == clazz3));
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        
        // Class对象的信息
        System.out.println("Class name: " + clazz1.getName());
        System.out.println("Simple name: " + clazz1.getSimpleName());
        System.out.println("Package: " + clazz1.getPackage());
        
        // Object的基本信息
        System.out.println("student1 class: " + student1.getClass().getSimpleName());
        System.out.println("student1 hash: " + student1.hashCode());
        System.out.println("student1 string: " + student1.toString());
    }
    
    // Class类的反射使用
    public static void demonstrateClassUsage() {
        System.out.println("\n=== Class Usage (Reflection) ===");
        
        try {
            Class<?> studentClass = Student.class;
            
            // 获取构造器
            Constructor<?>[] constructors = studentClass.getConstructors();
            System.out.println("Constructors count: " + constructors.length);
            
            // 获取字段
            Field[] fields = studentClass.getDeclaredFields();
            System.out.println("Fields:");
            for (Field field : fields) {
                System.out.println("  " + field.getType().getSimpleName() + " " + field.getName());
            }
            
            // 获取方法
            Method[] methods = studentClass.getDeclaredMethods();
            System.out.println("Methods:");
            for (Method method : methods) {
                System.out.println("  " + method.getName() + "()");
            }
            
            // 通过反射创建对象
            Constructor<?> constructor = studentClass.getConstructor(String.class, int.class);
            Object studentObj = constructor.newInstance("Charlie", 21);
            System.out.println("Created by reflection: " + studentObj);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // Object类方法演示
    public static void demonstrateObjectMethods() {
        System.out.println("\n=== Object Methods ===");
        
        Student s1 = new Student("David", 23);
        Student s2 = new Student("David", 23);
        Student s3 = s1;
        
        // equals方法
        System.out.println("s1.equals(s2): " + s1.equals(s2));  // true（重写了equals）
        System.out.println("s1.equals(s3): " + s1.equals(s3));  // true
        System.out.println("s1 == s3: " + (s1 == s3));          // true（同一对象）
        
        // hashCode方法
        System.out.println("s1.hashCode(): " + s1.hashCode());
        System.out.println("s2.hashCode(): " + s2.hashCode());
        System.out.println("HashCodes equal: " + (s1.hashCode() == s2.hashCode()));
        
        // toString方法
        System.out.println("s1.toString(): " + s1.toString());
        
        // getClass方法
        System.out.println("s1.getClass(): " + s1.getClass());
        
        // 演示Object其他方法
        try {
            // wait/notify需要在synchronized块中
            synchronized (s1) {
                System.out.println("Object methods like wait/notify require synchronization");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

// 示例学生类
class Student {
    private String name;
    private int age;
    
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 重写Object的方法
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Student student = (Student) obj;
        return age == student.age && java.util.Objects.equals(name, student.name);
    }
    
    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, age);
    }
    
    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
    
    // getter方法
    public String getName() { return name; }
    public int getAge() { return age; }
}
```

### 🎯 请解释面向对象的三大特性

**📋 标准话术**：

> "面向对象编程有三大核心特性：**封装、继承、多态**。
>
> **封装（Encapsulation）**：将数据和操作数据的方法绑定在一起，通过访问修饰符控制外部对内部数据的访问，隐藏实现细节，只暴露必要的接口。这样可以保护数据安全，降低模块间耦合度。
>
> **继承（Inheritance）**：子类可以继承父类的属性和方法，实现代码复用。Java支持单继承，一个类只能继承一个父类，但可以通过接口实现多重继承的效果。继承体现了'is-a'的关系。
>
> **多态（Polymorphism）**：同一个接口可以有多种不同的实现方式，在运行时动态决定调用哪个具体实现。Java中多态通过方法重写和接口实现来体现，运行时绑定确保调用正确的方法。"

**💻 代码示例**：

```java
// 封装示例
public class Account {
    private double balance;  // 私有字段，外部不能直接访问
    
    public void deposit(double amount) {  // 公共方法，提供安全的操作接口
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public double getBalance() {  // getter方法，控制数据访问
        return balance;
    }
}

// 继承示例
class Animal {
    protected String name;
    
    public void eat() {
        System.out.println(name + " is eating");
    }
}

class Dog extends Animal {  // 继承Animal类
    public void bark() {    // 子类特有方法
        System.out.println(name + " is barking");
    }
    
    @Override
    public void eat() {     // 方法重写
        System.out.println(name + " is eating dog food");
    }
}

// 多态示例
interface Shape {
    double getArea();
}

class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle implements Shape {
    private double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
}

// 多态的使用
public class PolymorphismDemo {
    public static void printArea(Shape shape) {  // 参数类型是接口
        System.out.println("Area: " + shape.getArea());  // 运行时动态绑定
    }
    
    public static void main(String[] args) {
        Shape circle = new Circle(5);
        Shape rectangle = new Rectangle(4, 6);
        
        printArea(circle);     // 输出圆的面积
        printArea(rectangle);  // 输出矩形的面积
    }
}
```

### 🎯 Overload和Override的区别？

**📋 标准话术**：

> "Overload（重载）和Override（重写）是Java面向对象的两个重要概念：
>
> **Overload（方法重载）**：
>
> - 同一个类中多个方法名相同，但参数不同
> - 编译时多态（静态多态），编译器根据参数决定调用哪个方法
> - 参数必须不同：类型、个数、顺序至少一项不同
> - 返回值类型可以相同也可以不同，但不能仅凭返回值区分
> - 访问修饰符可以不同
>
> **Override（方法重写）**：
>
> - 子类重新实现父类的方法
> - 运行时多态（动态多态），根据实际对象类型决定调用哪个方法
> - 方法签名必须完全相同：方法名、参数列表、返回值类型
> - 访问修饰符不能更严格，但可以更宽松
> - 不能重写static、final、private方法
>
> **核心区别**：
>
> - 重载是水平扩展（同类多方法），重写是垂直扩展（继承层次）
> - 重载在编译时确定，重写在运行时确定
> - 重载体现了接口的灵活性，重写体现了多态性
>
> 记忆技巧：Overload添加功能，Override改变功能。"

**💻 代码示例**：

```java
public class OverloadOverrideDemo {
    
    public static void main(String[] args) {
        // 演示方法重载
        Calculator calc = new Calculator();
        calc.demonstrateOverload();
        
        System.out.println();
        
        // 演示方法重写
        Animal animal = new Dog();
        animal.makeSound();  // 运行时多态
        
        // 演示重写的访问控制
        demonstrateOverrideAccessControl();
        
        // 演示重载的编译时解析
        demonstrateOverloadResolution();
    }
    
    public static void demonstrateOverrideAccessControl() {
        System.out.println("=== Override访问控制演示 ===");
        
        Parent parent = new Child();
        parent.protectedMethod();  // 调用子类重写的方法
        parent.publicMethod();     // 调用子类重写的方法
    }
    
    public static void demonstrateOverloadResolution() {
        System.out.println("\n=== Overload解析演示 ===");
        
        OverloadExample example = new OverloadExample();
        
        // 编译时就确定调用哪个方法
        example.process(10);           // 调用process(int)
        example.process(10L);          // 调用process(long)
        example.process("hello");      // 调用process(String)
        example.process(10, 20);       // 调用process(int, int)
        example.process(10.5);         // 调用process(double)
        
        // 自动类型提升
        byte b = 10;
        example.process(b);            // byte -> int，调用process(int)
        
        short s = 20;
        example.process(s);            // short -> int，调用process(int)
        
        char c = 'A';
        example.process(c);            // char -> int，调用process(int)
    }
}

// 方法重载示例
class Calculator {
    
    public void demonstrateOverload() {
        System.out.println("=== 方法重载演示 ===");
        
        // 同名方法，不同参数
        System.out.println("add(2, 3) = " + add(2, 3));
        System.out.println("add(2.5, 3.7) = " + add(2.5, 3.7));
        System.out.println("add(1, 2, 3) = " + add(1, 2, 3));
        System.out.println("add(\"Hello\", \"World\") = " + add("Hello", "World"));
        
        // 可变参数重载
        System.out.println("sum() = " + sum());
        System.out.println("sum(1) = " + sum(1));
        System.out.println("sum(1,2,3,4,5) = " + sum(1, 2, 3, 4, 5));
    }
    
    // 重载方法1：两个int参数
    public int add(int a, int b) {
        System.out.println("调用了add(int, int)");
        return a + b;
    }
    
    // 重载方法2：两个double参数
    public double add(double a, double b) {
        System.out.println("调用了add(double, double)");
        return a + b;
    }
    
    // 重载方法3：三个int参数
    public int add(int a, int b, int c) {
        System.out.println("调用了add(int, int, int)");
        return a + b + c;
    }
    
    // 重载方法4：两个String参数
    public String add(String a, String b) {
        System.out.println("调用了add(String, String)");
        return a + b;
    }
    
    // 重载方法5：参数顺序不同
    public String format(String format, int value) {
        System.out.println("调用了format(String, int)");
        return String.format(format, value);
    }
    
    public String format(int value, String suffix) {
        System.out.println("调用了format(int, String)");
        return value + suffix;
    }
    
    // 可变参数重载
    public int sum(int... numbers) {
        System.out.println("调用了sum(int...)，参数个数: " + numbers.length);
        int result = 0;
        for (int num : numbers) {
            result += num;
        }
        return result;
    }
    
    // 注意：这种重载会导致歧义，编译错误
    // public int sum(int[] numbers) { ... }  // 与可变参数冲突
}

// 重载解析示例
class OverloadExample {
    
    public void process(int value) {
        System.out.println("处理int: " + value);
    }
    
    public void process(long value) {
        System.out.println("处理long: " + value);
    }
    
    public void process(double value) {
        System.out.println("处理double: " + value);
    }
    
    public void process(String value) {
        System.out.println("处理String: " + value);
    }
    
    public void process(int a, int b) {
        System.out.println("处理两个int: " + a + ", " + b);
    }
    
    // 重载与继承的交互
    public void process(Object obj) {
        System.out.println("处理Object: " + obj);
    }
    
    public void process(Number num) {
        System.out.println("处理Number: " + num);
    }
}

// 方法重写示例
abstract class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    // 抽象方法，强制子类重写
    public abstract void makeSound();
    
    // 普通方法，可以被重写
    public void eat() {
        System.out.println(name + " is eating");
    }
    
    // final方法，不能被重写
    public final void sleep() {
        System.out.println(name + " is sleeping");
    }
    
    // static方法，不能被重写（但可以被隐藏）
    public static void species() {
        System.out.println("This is an animal");
    }
}

class Dog extends Animal {
    
    public Dog() {
        super("Dog");
    }
    
    // 重写抽象方法
    @Override
    public void makeSound() {
        System.out.println(name + " barks: Woof! Woof!");
    }
    
    // 重写普通方法
    @Override
    public void eat() {
        System.out.println(name + " eats dog food");
    }
    
    // 隐藏父类的static方法（不是重写）
    public static void species() {
        System.out.println("This is a dog");
    }
    
    // 子类特有的方法
    public void fetch() {
        System.out.println(name + " fetches the ball");
    }
    
    // 重写Object类的方法
    @Override
    public String toString() {
        return "Dog{name='" + name + "'}";
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Dog dog = (Dog) obj;
        return name.equals(dog.name);
    }
    
    @Override
    public int hashCode() {
        return name.hashCode();
    }
}

// 访问控制与重写
class Parent {
    protected void protectedMethod() {
        System.out.println("Parent protected method");
    }
    
    public void publicMethod() {
        System.out.println("Parent public method");
    }
    
    // private方法不能被重写
    private void privateMethod() {
        System.out.println("Parent private method");
    }
}

class Child extends Parent {
    
    // 重写protected方法，可以改为public（访问权限放宽）
    @Override
    public void protectedMethod() {
        System.out.println("Child overridden protected method (now public)");
    }
    
    // 重写public方法，访问权限保持不变
    @Override
    public void publicMethod() {
        System.out.println("Child overridden public method");
        super.publicMethod();  // 调用父类方法
    }
    
    // 这不是重写，而是子类的新方法
    public void privateMethod() {
        System.out.println("Child's own private method");
    }
}

/*
 * Overload vs Override 对比总结：
 * 
 * ┌─────────────┬─────────────────┬─────────────────┐
 * │   特性      │    Overload     │    Override     │
 * ├─────────────┼─────────────────┼─────────────────┤
 * │ 发生位置    │     同一类内    │   继承关系中    │
 * │ 方法名      │      相同       │      相同       │
 * │ 参数列表    │     必须不同    │    必须相同     │
 * │ 返回值类型  │     可以不同    │   必须相同      │
 * │ 访问修饰符  │     可以不同    │ 不能更严格      │
 * │ 解析时机    │     编译时      │     运行时      │
 * │ 多态类型    │    静态多态     │   动态多态      │
 * │ 继承要求    │       无        │      必须       │
 * └─────────────┴─────────────────┴─────────────────┘
 * 
 * 重要规则：
 * 1. 重载：参数不同（类型、个数、顺序），编译时确定
 * 2. 重写：签名相同，运行时确定，体现多态性
 * 3. @Override注解帮助编译器检查重写的正确性
 * 4. 重写遵循"里氏替换原则"：子类可以替换父类
 */
```

### 🎯 你是如何理解面向对象的？

**📋 标准话术**：

> "面向对象（OOP）是一种'万物皆对象'的编程思想：
>
> **核心理念**：将现实问题构建关系，然后抽象成类（class），给类定义属性和方法后，再将类实例化成实例（instance），通过访问实例的属性和调用方法来进行使用。
>
> **四大特征**：
>
> - **封装**：隐藏内部实现，只暴露必要接口
> - **继承**：子类继承父类特性，实现代码复用  
> - **多态**：同一接口多种实现，运行时动态绑定
> - **抽象**：提取共同特征，忽略具体细节
>
> **设计原则**：
>
> - **单一职责**：一个类只做一件事
> - **开闭原则**：对扩展开放，对修改关闭
> - **里氏替换**：子类不破坏父类契约
> - **接口隔离**：多个专用接口优于单一臃肿接口
> - **依赖倒置**：依赖抽象而非实现
>
> 面向对象让代码更模块化、可维护、可扩展，是现代软件开发的基础思想。"

**💻 代码示例**：

```java
// 面向对象设计示例：电商系统
public class OOPDemo {
    
    public static void main(String[] args) {
        // 演示面向对象的四大特性
        demonstrateOOPFeatures();
        
        // 演示设计原则
        demonstrateDesignPrinciples();
    }
    
    public static void demonstrateOOPFeatures() {
        System.out.println("=== OOP Features Demo ===");
        
        // 1. 封装：通过私有字段和公共方法控制访问
        Account account = new Account(1000.0);
        account.deposit(500.0);     // 通过方法安全地操作数据
        account.withdraw(200.0);
        System.out.println("Account balance: " + account.getBalance());
        
        // 2. 继承：子类继承父类特性
        VIPAccount vipAccount = new VIPAccount(2000.0, 0.02);
        vipAccount.deposit(1000.0);
        System.out.println("VIP account balance: " + vipAccount.getBalance());
        
        // 3. 多态：统一接口，不同实现
        PaymentProcessor processor = new PaymentProcessor();
        
        Payment creditCard = new CreditCardPayment();
        Payment alipay = new AlipayPayment();
        Payment wechat = new WechatPayment();
        
        processor.processPayment(creditCard, 100.0);
        processor.processPayment(alipay, 100.0);
        processor.processPayment(wechat, 100.0);
        
        // 4. 抽象：抽取共同特征
        System.out.println("\nAbstraction: All payments implement Payment interface");
    }
    
    public static void demonstrateDesignPrinciples() {
        System.out.println("\n=== Design Principles Demo ===");
        
        // 单一职责原则：每个类只负责一个功能
        OrderService orderService = new OrderService();
        PaymentService paymentService = new PaymentService();
        NotificationService notificationService = new NotificationService();
        
        // 依赖倒置原则：依赖抽象而非具体实现
        Order order = new Order("ORDER001", 299.0);
        orderService.createOrder(order);
        paymentService.processPayment(order.getAmount());
        notificationService.sendNotification("Order created successfully");
    }
}

// 1. 封装示例
class Account {
    private double balance;  // 私有字段，外部无法直接访问
    
    public Account(double initialBalance) {
        this.balance = Math.max(0, initialBalance);  // 构造时验证
    }
    
    // 公共方法提供受控访问
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: " + amount);
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount);
            return true;
        }
        System.out.println("Insufficient funds");
        return false;
    }
    
    public double getBalance() {
        return balance;
    }
    
    protected void setBalance(double balance) {  // 受保护的方法供子类使用
        this.balance = balance;
    }
}

// 2. 继承示例
class VIPAccount extends Account {
    private double interestRate;
    
    public VIPAccount(double initialBalance, double interestRate) {
        super(initialBalance);  // 调用父类构造器
        this.interestRate = interestRate;
    }
    
    // 重写父类方法
    @Override
    public void deposit(double amount) {
        super.deposit(amount);  // 调用父类方法
        double interest = amount * interestRate;
        super.deposit(interest);  // 额外的利息
        System.out.println("Interest added: " + interest);
    }
    
    // 子类特有方法
    public double getInterestRate() {
        return interestRate;
    }
}

// 3. 多态示例 - 抽象接口
interface Payment {
    void pay(double amount);
    String getPaymentMethod();
}

// 具体实现类
class CreditCardPayment implements Payment {
    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " by Credit Card");
    }
    
    @Override
    public String getPaymentMethod() {
        return "Credit Card";
    }
}

class AlipayPayment implements Payment {
    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " by Alipay");
    }
    
    @Override
    public String getPaymentMethod() {
        return "Alipay";
    }
}

class WechatPayment implements Payment {
    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " by WeChat Pay");
    }
    
    @Override
    public String getPaymentMethod() {
        return "WeChat Pay";
    }
}

// 多态使用
class PaymentProcessor {
    public void processPayment(Payment payment, double amount) {
        System.out.println("Processing payment via " + payment.getPaymentMethod());
        payment.pay(amount);  // 运行时动态绑定
    }
}

// 设计原则示例：单一职责
class Order {
    private String orderId;
    private double amount;
    
    public Order(String orderId, double amount) {
        this.orderId = orderId;
        this.amount = amount;
    }
    
    public String getOrderId() { return orderId; }
    public double getAmount() { return amount; }
}

// 每个服务类只负责一个功能
class OrderService {
    public void createOrder(Order order) {
        System.out.println("Order created: " + order.getOrderId());
    }
}

class PaymentService {
    public void processPayment(double amount) {
        System.out.println("Payment processed: $" + amount);
    }
}

class NotificationService {
    public void sendNotification(String message) {
        System.out.println("Notification sent: " + message);
    }
}
```

### 🎯 抽象类和接口有什么区别？

**📋 标准话术**：

> "抽象类和接口都是Java中实现抽象的机制，但它们有以下关键区别：
>
> **抽象类（Abstract Class）**：
>
> - 可以包含抽象方法和具体方法
> - 可以有成员变量（包括实例变量）
> - 可以有构造方法
> - 使用extends关键字继承，支持单继承
> - 访问修饰符可以是public、protected、default
>
> **接口（Interface）**：
>
> - JDK 8之前只能有抽象方法，JDK 8+可以有默认方法和静态方法
> - 只能有public static final常量
> - 不能有构造方法
> - 使用implements关键字实现，支持多实现
> - 方法默认是public abstract
>
> **使用场景**：当多个类有共同特征且需要代码复用时用抽象类；当需要定义规范、实现多重继承效果时用接口。现在更推荐'组合优于继承'的设计理念。"

**💻 代码示例**：

```java
// 抽象类示例
abstract class Vehicle {
    protected String brand;     // 可以有实例变量
    protected int speed;
    
    public Vehicle(String brand) {  // 可以有构造方法
        this.brand = brand;
    }
    
    // 具体方法
    public void start() {
        System.out.println(brand + " vehicle started");
    }
    
    // 抽象方法，子类必须实现
    public abstract void accelerate();
    public abstract void brake();
}

class Car extends Vehicle {
    public Car(String brand) {
        super(brand);
    }
    
    @Override
    public void accelerate() {
        speed += 10;
        System.out.println("Car accelerated to " + speed + " km/h");
    }
    
    @Override
    public void brake() {
        speed = Math.max(0, speed - 15);
        System.out.println("Car braked to " + speed + " km/h");
    }
}

// 接口示例
interface Flyable {
    int MAX_ALTITUDE = 10000;  // public static final常量
    
    void takeOff();            // public abstract方法
    void land();
    
    // JDK 8+ 默认方法
    default void fly() {
        System.out.println("Flying at altitude " + MAX_ALTITUDE);
    }
    
    // JDK 8+ 静态方法
    static void checkWeather() {
        System.out.println("Weather is suitable for flying");
    }
}

interface Swimmable {
    void dive();
    void surface();
}

// 类可以实现多个接口
class Duck implements Flyable, Swimmable {
    @Override
    public void takeOff() {
        System.out.println("Duck takes off from water");
    }
    
    @Override
    public void land() {
        System.out.println("Duck lands on water");
    }
    
    @Override
    public void dive() {
        System.out.println("Duck dives underwater");
    }
    
    @Override
    public void surface() {
        System.out.println("Duck surfaces");
    }
}
```

### 🎯 作用域public，private，protected，以及不写时的区别？

**📋 标准话术**：

> "Java访问修饰符控制类、方法、变量的可见性，有四种访问级别：
>
> **public（公共的）**：
>
> - 对所有类可见，无访问限制
> - 可以被任何包中的任何类访问
> - 用于对外开放的API接口
>
> **protected（受保护的）**：
>
> - 对同一包内的类和所有子类可见
> - 即使子类在不同包中也可以访问
> - 用于继承体系中需要共享的成员
>
> **默认（包访问权限，不写修饰符）**：
>
> - 只对同一包内的类可见
> - 也称为package-private或friendly
> - 用于包内部的实现细节
>
> **private（私有的）**：
>
> - 只对当前类可见，最严格的访问控制
> - 子类也无法访问父类的private成员
> - 用于封装内部实现细节
>
> **访问范围**：public > protected > 默认 > private
>
> **设计原则**：遵循最小权限原则，优先使用private，根据需要逐步放宽权限。"

### 🎯 说说Java中的内部类有哪些？

**📋 标准话术**：

> "Java中的内部类主要有四种类型：
>
> **1. 成员内部类（Member Inner Class）**：定义在类中的普通内部类，可以访问外部类的所有成员，包括私有成员。创建内部类对象需要先创建外部类对象。
>
> **2. 静态内部类（Static Nested Class）**：使用static修饰的内部类，不依赖外部类实例，只能访问外部类的静态成员。可以直接通过外部类名创建。
>
> **3. 局部内部类（Local Inner Class）**：定义在方法或代码块中的类，只能在定义它的方法内使用，可以访问方法中的final或effectively final变量。
>
> **4. 匿名内部类（Anonymous Inner Class）**：没有名字的内部类，通常用于实现接口或继承类的简单实现，常用于事件处理和回调。
>
> 内部类的优势是可以访问外部类私有成员，实现更好的封装；缺点是增加了代码复杂度，可能造成内存泄漏（内部类持有外部类引用）。"

**💻 代码示例**：

```java
public class OuterClass {
    private String outerField = "Outer field";
    private static String staticField = "Static field";
    
    // 1. 成员内部类
    public class MemberInnerClass {
        private String innerField = "Inner field";
        
        public void display() {
            System.out.println("Access outer field: " + outerField);
            System.out.println("Access static field: " + staticField);
            System.out.println("Inner field: " + innerField);
        }
        
        // 内部类不能有静态方法（除非是静态内部类）
        // public static void staticMethod() {} // 编译错误
    }
    
    // 2. 静态内部类
    public static class StaticNestedClass {
        private String nestedField = "Nested field";
        
        public void display() {
            // System.out.println(outerField); // 编译错误，不能访问非静态外部成员
            System.out.println("Access static field: " + staticField);
            System.out.println("Nested field: " + nestedField);
        }
        
        public static void staticMethod() {
            System.out.println("Static method in nested class");
        }
    }
    
    public void demonstrateLocalClass() {
        final String localVar = "Local variable";
        int effectivelyFinalVar = 100;
        
        // 3. 局部内部类
        class LocalInnerClass {
            public void display() {
                System.out.println("Access outer field: " + outerField);
                System.out.println("Access local var: " + localVar);
                System.out.println("Access effectively final var: " + effectivelyFinalVar);
            }
        }
        
        LocalInnerClass local = new LocalInnerClass();
        local.display();
    }
    
    public void demonstrateAnonymousClass() {
        // 4. 匿名内部类 - 实现接口
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("Anonymous class implementing Runnable");
                System.out.println("Access outer field: " + outerField);
            }
        };
        
        // 匿名内部类 - 继承类
        Thread thread = new Thread() {
            @Override
            public void run() {
                System.out.println("Anonymous class extending Thread");
            }
        };
        
        runnable.run();
        thread.start();
    }
    
    public static void main(String[] args) {
        OuterClass outer = new OuterClass();
        
        // 创建成员内部类对象
        OuterClass.MemberInnerClass member = outer.new MemberInnerClass();
        member.display();
        
        // 创建静态内部类对象
        OuterClass.StaticNestedClass nested = new OuterClass.StaticNestedClass();
        nested.display();
        OuterClass.StaticNestedClass.staticMethod();
        
        // 局部内部类和匿名内部类
        outer.demonstrateLocalClass();
        outer.demonstrateAnonymousClass();
    }
}
```



### 🎯 实例方法和静态方法有什么不一样?

实例方法依赖对象，有 `this`，能访问实例变量，支持多态；静态方法依赖类本身，没有 `this`，只能访问静态变量，不能真正重写，常用于工具类和全局方法。

| 特性           | 实例方法 (Instance Method)                  | 静态方法 (Static Method)                  |
| -------------- | ------------------------------------------- | ----------------------------------------- |
| **归属**       | 属于对象实例                                | 属于类本身                                |
| **调用方式**   | `对象.方法()`                               | `类名.方法()` 或 `对象.方法()`（不推荐）  |
| **this 引用**  | 隐含传入 `this` 参数                        | 没有 `this`                               |
| **访问权限**   | 可访问实例变量和静态变量                    | 只能访问静态变量和静态方法                |
| **内存位置**   | 方法存在于方法区，调用需依赖对象实例        | 方法存在于方法区，直接通过类调用          |
| **多态性**     | 可以被子类重写，支持运行时多态              | 不能真正被重写，只能隐藏（method hiding） |
| **典型应用**   | 与对象状态相关的方法（如 `user.getName()`） | 工具方法、工厂方法（如 `Math.max()`）     |
| **字节码调用** | `invokevirtual` / `invokeinterface`         | `invokestatic`                            |



### 🎯 break、continue、return的区别及作用？

**📋 标准话术**：

> "break、continue、return都是Java中的控制流语句，但作用不同：
>
> **break语句**：
>
> - 作用：立即终止当前循环或switch语句
> - 使用场景：循环中满足某个条件时提前退出
> - 只能跳出当前层循环，不能跳出外层循环（除非使用标签）
>
> **continue语句**：
>
> - 作用：跳过当前循环迭代的剩余部分，直接进入下一次迭代
> - 使用场景：满足某个条件时跳过当前循环体的执行
> - 只影响当前层循环
>
> **return语句**：
>
> - 作用：立即终止方法的执行并返回到调用处
> - 可以带返回值（非void方法）或不带返回值（void方法）
> - 会终止整个方法，不仅仅是循环
>
> 核心区别：break跳出循环，continue跳过迭代，return跳出方法。"

**💻 代码示例**：

```java
public class ControlFlowDemo {
    
    public static void main(String[] args) {
        System.out.println("=== Break Demo ===");
        demonstrateBreak();
        
        System.out.println("\n=== Continue Demo ===");
        demonstrateContinue();
        
        System.out.println("\n=== Return Demo ===");
        demonstrateReturn();
        
        System.out.println("\n=== Labeled Break/Continue ===");
        demonstrateLabeledStatements();
    }
    
    // break演示
    public static void demonstrateBreak() {
        System.out.println("Finding first even number greater than 5:");
        for (int i = 1; i <= 10; i++) {
            if (i > 5 && i % 2 == 0) {
                System.out.println("Found: " + i);
                break;  // 找到后立即退出循环
            }
            System.out.println("Checking: " + i);
        }
        System.out.println("Loop ended");
        
        // switch中的break
        System.out.println("\nSwitch with break:");
        int day = 3;
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;  // 没有break会继续执行下一个case
            default:
                System.out.println("Other day");
        }
    }
    
    // continue演示
    public static void demonstrateContinue() {
        System.out.println("Printing only odd numbers:");
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) {
                continue;  // 跳过偶数，直接进入下一次迭代
            }
            System.out.println("Odd number: " + i);
        }
        
        System.out.println("\nSkipping multiples of 3:");
        for (int i = 1; i <= 10; i++) {
            if (i % 3 == 0) {
                System.out.println("Skipping: " + i);
                continue;
            }
            System.out.println("Processing: " + i);
        }
    }
    
    // return演示
    public static void demonstrateReturn() {
        System.out.println("Result: " + findFirstNegative(new int[]{1, 3, -2, 5, -8}));
        
        processNumbers();
    }
    
    public static int findFirstNegative(int[] numbers) {
        for (int num : numbers) {
            if (num < 0) {
                return num;  // 找到负数立即返回，不继续执行
            }
            System.out.println("Checking positive: " + num);
        }
        return 0;  // 没找到负数返回0
    }
    
    public static void processNumbers() {
        System.out.println("Processing numbers 1-10:");
        for (int i = 1; i <= 10; i++) {
            if (i == 5) {
                System.out.println("Stopping at 5");
                return;  // 提前结束方法
            }
            System.out.println("Processing: " + i);
        }
        System.out.println("This will not be printed");  // 不会执行到这里
    }
    
    // 标签break/continue演示
    public static void demonstrateLabeledStatements() {
        System.out.println("Nested loops with labeled break:");
        
        outer: for (int i = 1; i <= 3; i++) {
            System.out.println("Outer loop: " + i);
            for (int j = 1; j <= 3; j++) {
                if (i == 2 && j == 2) {
                    System.out.println("Breaking outer loop at i=2, j=2");
                    break outer;  // 跳出外层循环
                }
                System.out.println("  Inner loop: " + j);
            }
            System.out.println("Outer loop " + i + " completed");
        }
        System.out.println("All loops ended");
        
        System.out.println("\nNested loops with labeled continue:");
        outerContinue: for (int i = 1; i <= 3; i++) {
            System.out.println("Outer loop: " + i);
            for (int j = 1; j <= 3; j++) {
                if (i == 2 && j == 2) {
                    System.out.println("Continuing outer loop at i=2, j=2");
                    continue outerContinue;  // 继续外层循环的下一次迭代
                }
                System.out.println("  Inner loop: " + j);
            }
            System.out.println("Inner loops completed for i=" + i);
        }
    }
}

/*
 * 控制流语句对比总结：
 * 
 * ┌─────────────┬─────────────────┬─────────────────┬─────────────────┐
 * │   语句      │     作用范围     │      影响       │    使用场景     │
 * ├─────────────┼─────────────────┼─────────────────┼─────────────────┤
 * │   break     │   当前循环/switch│   终止循环      │   提前退出循环   │
 * │   continue  │   当前循环迭代   │   跳过当前迭代  │   跳过特定条件   │
 * │   return    │   整个方法      │   终止方法执行  │   返回结果/退出  │
 * └─────────────┴─────────────────┴─────────────────┴─────────────────┘
 * 
 * 注意事项：
 * 1. break和continue只能在循环或switch中使用
 * 2. return可以在方法的任何地方使用
 * 3. 标签可以让break/continue跳出多层循环
 * 4. 在finally块中使用return会覆盖try/catch中的return
 */
```

---

## 📊 二、数据类型体系（类型基础）

> **核心思想**：Java是强类型语言，理解基本类型、包装类、自动装箱拆箱机制对于避免性能陷阱和理解JVM内存管理至关重要。

### 🎯 int、float、short、double、long、char占字节数？

**📋 标准话术**：

> "Java基本数据类型的字节数是固定的，这保证了跨平台的一致性：
>
> **整数类型**：
>
> - byte：1字节（8位），取值范围 -128 ~ 127
> - short：2字节（16位），取值范围 -32,768 ~ 32,767
> - int：4字节（32位），取值范围 -2,147,483,648 ~ 2,147,483,647
> - long：8字节（64位），取值范围 -9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807
>
> **浮点类型**：
>
> - float：4字节（32位），单精度浮点数，有效位数6-7位
> - double：8字节（64位），双精度浮点数，有效位数15-16位
>
> **字符类型**：
>
> - char：2字节（16位），采用Unicode编码，取值范围 0 ~ 65,535
>
> **布尔类型**：
>
> - boolean：理论上1位即可，但JVM实现通常使用1字节
>
> **记忆技巧**：byte(1) < short(2) < int(4) = float(4) < long(8) = double(8)，char(2)用于Unicode字符。"

**📊 Java数据类型存储范围对照表**：

| **数据类型** | **字节数** | **位数** | **取值范围**                                                 | **默认值** | **包装类** |
| ------------ | ---------- | -------- | ------------------------------------------------------------ | ---------- | ---------- |
| **byte**     | 1字节      | 8位      | -128 ~ 127 (-2⁷ ~ 2⁷-1)                                      | 0          | Byte       |
| **short**    | 2字节      | 16位     | -32,768 ~ 32,767 (-2¹⁵ ~ 2¹⁵-1)                              | 0          | Short      |
| **int**      | 4字节      | 32位     | -2,147,483,648 ~ 2,147,483,647 (-2³¹ ~ 2³¹-1)                | 0          | Integer    |
| **long**     | 8字节      | 64位     | -9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807 (-2⁶³ ~ 2⁶³-1) | 0L         | Long       |
| **float**    | 4字节      | 32位     | ±3.4E-38 ~ ±3.4E+38 (IEEE 754单精度)                         | 0.0f       | Float      |
| **double**   | 8字节      | 64位     | ±1.7E-308 ~ ±1.7E+308 (IEEE 754双精度)                       | 0.0d       | Double     |
| **char**     | 2字节      | 16位     | 0 ~ 65,535 ('\u0000' ~ '\uffff')                             | '\u0000'   | Character  |
| **boolean**  | 1字节      | 1位逻辑  | true / false                                                 | false      | Boolean    |

**📝 重要说明**：

- `*` boolean在JVM中通常占用1字节，但在boolean数组中可能按位存储
- 整数类型都是**有符号**的，除了char是**无符号**的
- 浮点类型遵循**IEEE 754标准**，存在精度限制
- char类型采用**UTF-16编码**，可以表示Unicode字符
- 所有数值类型都有对应的**包装类**，支持自动装箱拆箱

**🔢 数值范围记忆方法**：

- **有符号整型**：-2^(n-1) ~ 2^(n-1)-1（n为位数）
- **无符号整型**：0 ~ 2^n-1（仅char类型）
- **浮点类型**：指数位数决定范围，尾数位数决定精度



### 🎯 基本类型和引用类型之间的自动装箱机制？

**📋 标准话术**：

> "自动装箱拆箱是Java 5引入的语法糖，简化了基本类型和包装类之间的转换：
>
> **自动装箱（Autoboxing）**：
>
> - 基本类型自动转换为对应的包装类对象
> - 编译器在编译时自动调用valueOf()方法
> - 例如：int → Integer，double → Double
>
> **自动拆箱（Unboxing）**：
>
> - 包装类对象自动转换为对应的基本类型
> - 编译器自动调用xxxValue()方法
> - 例如：Integer → int，Double → double
>
> **装箱拆箱触发场景**：
>
> - 赋值操作：基本类型赋给包装类变量
> - 方法调用：参数类型不匹配时自动转换
> - 运算操作：包装类参与算术运算
> - 集合操作：基本类型存入集合
>
> **缓存机制**：
>
> - Integer缓存-128到127的对象
> - Boolean缓存true和false
> - Character缓存0到127
> - Short、Byte有类似缓存
>
> **注意事项**：
>
> - 可能引发NullPointerException
> - 频繁装箱拆箱影响性能
> - ==比较时要注意缓存范围
>
> 装箱拆箱简化了代码，但要注意性能和空指针问题。"

**💻 代码示例**：

```java
public class AutoBoxingDemo {
    
    public static void main(String[] args) {
        // 1. 基本装箱拆箱
        Integer a = 100;              // 自动装箱：Integer.valueOf(100)
        int b = a;                    // 自动拆箱：a.intValue()
        Integer sum = a + 50;         // 拆箱运算后装箱
        
        // 2. 缓存机制陷阱
        Integer i1 = 127, i2 = 127;  // 使用缓存
        Integer i3 = 128, i4 = 128;  // 不使用缓存
        System.out.println(i1 == i2); // true (缓存范围内)
        System.out.println(i3 == i4); // false (超出缓存)
        System.out.println(i3.equals(i4)); // true (正确比较)
        
        // 3. 空指针陷阱
        Integer nullInt = null;
        try {
            int value = nullInt;      // NPE: 拆箱null对象
        } catch (NullPointerException e) {
            System.out.println("拆箱异常: " + e.getClass().getSimpleName());
        }
        
        // 4. 集合中的装箱
        List<Integer> list = Arrays.asList(1, 2, 3); // 装箱
        int total = 0;
        for (int num : list) {        // 拆箱
            total += num;
        }
        
        // 5. 性能对比
        // 基本类型：int累加（快）
        // 包装类型：Integer累加（慢，频繁装箱拆箱）
    }
}

/*
 * 自动装箱拆箱总结：
 * 
 * ┌─────────────┬─────────────────┬─────────────────┬─────────────────┐
 * │   操作      │      触发条件   │     实际调用    │      示例       │
 * ├─────────────┼─────────────────┼─────────────────┼─────────────────┤
 * │  自动装箱   │ 基本类型→包装类 │  valueOf()      │ Integer i = 10; │
 * │  自动拆箱   │ 包装类→基本类型 │  xxxValue()     │ int j = i;      │
 * │  运算拆箱   │ 包装类参与运算  │  xxxValue()     │ i + 10          │
 * │  比较拆箱   │ 包装类比较大小  │  xxxValue()     │ i > 5           │
 * └─────────────┴─────────────────┴─────────────────┴─────────────────┘
 * 
 * 缓存范围：
 * - Integer: -128 ~ 127
 * - Character: 0 ~ 127  
 * - Boolean: true, false
 * - Byte: -128 ~ 127
 * - Short: -128 ~ 127
 * - Long: -128 ~ 127
 * 
 * 最佳实践：
 * 1. 避免在循环中频繁装箱拆箱
 * 2. 使用equals()而不是==比较包装类
 * 3. 注意null值的拆箱异常
 * 4. 性能敏感场景优先使用基本类型
 * 5. 集合存储大量数值时考虑基本类型集合库
 */
```

### 🎯 基本数据类型和包装类有什么区别？

**📋 标准话术**：

> "Java中基本数据类型和包装类的主要区别：
>
> **存储位置**：基本类型存储在栈内存或方法区（如果是类变量），包装类对象存储在堆内存中。
>
> **性能差异**：基本类型操作效率更高，包装类需要额外的对象创建和方法调用开销。
>
> **功能差异**：基本类型只能存储值，包装类提供了丰富的方法，可以转换、比较、解析等。
>
> **空值处理**：基本类型不能为null，包装类可以为null，这在集合操作中很重要。
>
> **自动装箱拆箱**：JDK 5+提供了自动装箱（基本类型→包装类）和拆箱（包装类→基本类型）机制，简化了编码但要注意性能影响。
>
> **缓存机制**：Integer等包装类对小数值（-128到127）使用缓存，相同值返回同一对象。"

| **特性**     | **基本类型**                   | **包装类型**                     |
| ------------ | ------------------------------ | -------------------------------- |
| **类型**     | `int`, `double`, `boolean`等   | `Integer`, `Double`, `Boolean`等 |
| **存储位置** | 栈内存（局部变量）             | 堆内存（对象实例）               |
| **默认值**   | `int`为0，`boolean`为false     | `null`（可能导致NPE）            |
| **内存占用** | 小（如`int`占4字节）           | 大（如`Integer`占16字节以上）    |
| **对象特性** | 不支持方法调用、泛型、集合存储 | 支持方法调用、泛型、集合存储     |
| **判等方式** | `==`直接比较值                 | `==`比较对象地址，`equals`比较值 |

- 包装类型可以为 null，而基本类型不可以（它使得包装类型可以应用于 POJO 中，而基本类型则不行）

  和 POJO 类似的，还有数据传输对象 DTO（Data Transfer Object，泛指用于展示层与服务层之间的数据传输对象）、视图对象 VO（View Object，把某个页面的数据封装起来）、持久化对象 PO（Persistant Object，可以看成是与数据库中的表映射的 Java 对象）。

  那为什么 POJO 的属性必须要用包装类型呢？

  《阿里巴巴 Java 开发手册》上有详细的说明，我们来大声朗读一下（预备，起）。

> 数据库的查询结果可能是 null，如果使用基本类型的话，因为要自动拆箱（将包装类型转为基本类型，比如说把 Integer 对象转换成 int 值），就会抛出 `NullPointerException` 的异常。

1. 包装类型可用于泛型，而基本类型不可以

```java
List<int> list = new ArrayList<>(); // 提示 Syntax error, insert "Dimensions" to complete ReferenceType
List<Integer> list = new ArrayList<>();
```

为什么呢？

> 在 Java 中，**包装类型可以用于泛型，而基本类型不可以**，这是因为 Java 的泛型机制是基于**对象类型**设计的，而基本类型（如 `int`, `double` 等）并不是对象。下面是详细原因：
>
> 1. **Java 泛型的工作原理**
>
> - Java 泛型在编译期间会进行**类型擦除**，即泛型信息会在字节码中被擦除。
> - 编译后，泛型的类型参数会被替换为 `Object`，或在某些情况下替换为类型的上限（如果有设置）。
> - 由于泛型会被转换为 `Object` 类型，泛型只能用于**引用类型**，而基本类型不能直接转换为 `Object`。
>
> 2. 基本类型比包装类型更高效
>
>    基本类型在栈中直接存储的具体数值，而包装类型则存储的是堆中的引用。
>
> ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/29/16d7a5686ac8c66b~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)
>
> 
>
> 很显然，相比较于基本类型而言，包装类型需要占用更多的内存空间。假如没有基本类型的话，对于数值这类经常使用到的数据来说，每次都要通过 new 一个包装类型就显得非常笨重。
>
> 3. 两个包装类型的值可以相同，但却不相等
>
> 4. 自动装箱和自动拆箱
>
>    既然有了基本类型和包装类型，肯定有些时候要在它们之间进行转换。把基本类型转换成包装类型的过程叫做装箱（boxing）。反之，把包装类型转换成基本类型的过程叫做拆箱（unboxing）
>
> 5. **包装类型的缓存机制**
>
>    - **范围**：部分包装类缓存常用值（如`Integer`缓存-128~127）
>
>    - ```java
>      Integer a = 127;
>      Integer b = 127;
>      System.out.println(a == b); // true（同一缓存对象）
>                
>      Integer c = 128;
>      Integer d = 128;
>      System.out.println(c == d); // false（新创建对象）
>      ```
>
> 

### 🎯==和equals的区别是什么？

**📋 标准话术**：

> "==和equals的区别是Java面试的经典问题：
>
> **==运算符**：
>
> - 对于基本数据类型，比较的是值是否相等
> - 对于引用类型，比较的是内存地址（引用）是否相同
> - 不能被重写，是Java语言层面的操作符
>
> **equals方法**：
>
> - 是Object类的方法，所有类都继承了这个方法
> - 默认实现就是==比较，但可以被重写自定义比较逻辑
> - String、Integer等包装类都重写了equals方法，比较的是内容
> - 重写equals时必须同时重写hashCode，保证'equals相等的对象hashCode也相等'
>
> **最佳实践**：比较对象内容用equals，比较引用用==；自定义类需要重写equals和hashCode。"

### 🎯 深拷贝、浅拷贝区别？

**📋 标准话术**：

> "对象拷贝是Java中的重要概念，分为浅拷贝和深拷贝：
>
> **浅拷贝（Shallow Copy）**：
>
> - 只复制对象的基本字段，不复制引用字段指向的对象
> - 原对象和拷贝对象共享引用类型的成员变量
> - 修改引用对象会影响原对象和拷贝对象
> - 通过Object.clone()默认实现浅拷贝
>
> **深拷贝（Deep Copy）**：
>
> - 完全复制对象及其所有引用的对象
> - 原对象和拷贝对象完全独立，互不影响
> - 需要递归复制所有引用类型的字段
> - 实现方式：序列化、手动递归复制、第三方库
>
> **实现方式对比**：
>
> - Object.clone()：浅拷贝，需要实现Cloneable接口
> - 序列化方式：深拷贝，需要实现Serializable接口
> - 构造器/工厂方法：可控制拷贝深度
> - 第三方库：如Apache Commons或Spring BeanUtils
>
> **选择原则**：对象结构简单用浅拷贝，包含复杂引用关系用深拷贝。"

**💻 代码示例**：

```java
import java.io.*;
import java.util.*;

public class CopyDemo {
    
    public static void main(String[] args) throws Exception {
        // 演示浅拷贝
        demonstrateShallowCopy();
        
        System.out.println();
        
        // 演示深拷贝
        demonstrateDeepCopy();
        
        System.out.println();
        
        // 演示各种深拷贝实现方式
        demonstrateDeepCopyMethods();
    }
    
    public static void demonstrateShallowCopy() throws CloneNotSupportedException {
        System.out.println("=== 浅拷贝演示 ===");
        
        Address address = new Address("北京", "朝阳区");
        Person original = new Person("张三", 25, address);
        
        // 浅拷贝
        Person shallowCopy = original.clone();
        
        System.out.println("原对象: " + original);
        System.out.println("浅拷贝: " + shallowCopy);
        System.out.println("地址对象相同: " + (original.getAddress() == shallowCopy.getAddress()));
        
        // 修改拷贝对象的基本字段
        shallowCopy.setName("李四");
        shallowCopy.setAge(30);
        
        System.out.println("\n修改拷贝对象的基本字段后:");
        System.out.println("原对象: " + original);
        System.out.println("浅拷贝: " + shallowCopy);
        
        // 修改引用字段的内容
        shallowCopy.getAddress().setCity("上海");
        shallowCopy.getAddress().setDistrict("浦东新区");
        
        System.out.println("\n修改引用字段内容后:");
        System.out.println("原对象: " + original);
        System.out.println("浅拷贝: " + shallowCopy);
        System.out.println("原对象地址也被修改了！");
    }
    
    public static void demonstrateDeepCopy() throws Exception {
        System.out.println("=== 深拷贝演示 ===");
        
        Address address = new Address("广州", "天河区");
        PersonDeep original = new PersonDeep("王五", 28, address);
        original.addHobby("读书");
        original.addHobby("游泳");
        
        // 深拷贝
        PersonDeep deepCopy = original.deepClone();
        
        System.out.println("原对象: " + original);
        System.out.println("深拷贝: " + deepCopy);
        System.out.println("地址对象相同: " + (original.getAddress() == deepCopy.getAddress()));
        System.out.println("爱好列表相同: " + (original.getHobbies() == deepCopy.getHobbies()));
        
        // 修改拷贝对象
        deepCopy.setName("赵六");
        deepCopy.getAddress().setCity("深圳");
        deepCopy.getAddress().setDistrict("南山区");
        deepCopy.addHobby("编程");
        
        System.out.println("\n修改深拷贝对象后:");
        System.out.println("原对象: " + original);
        System.out.println("深拷贝: " + deepCopy);
        System.out.println("原对象未受影响！");
    }
    
    public static void demonstrateDeepCopyMethods() throws Exception {
        System.out.println("=== 各种深拷贝方法演示 ===");
        
        Address address = new Address("杭州", "西湖区");
        PersonDeep original = new PersonDeep("钱七", 32, address);
        original.addHobby("旅游");
        
        // 方法1：序列化深拷贝
        PersonDeep copy1 = SerializationUtils.deepCopy(original);
        
        // 方法2：手动深拷贝
        PersonDeep copy2 = original.manualDeepCopy();
        
        // 方法3：构造器深拷贝
        PersonDeep copy3 = new PersonDeep(original);
        
        System.out.println("原对象: " + original);
        System.out.println("序列化拷贝: " + copy1);
        System.out.println("手动拷贝: " + copy2);
        System.out.println("构造器拷贝: " + copy3);
        
        // 验证独立性
        copy1.getAddress().setCity("copy1-城市");
        copy2.getAddress().setCity("copy2-城市");
        copy3.getAddress().setCity("copy3-城市");
        
        System.out.println("\n修改各拷贝对象后:");
        System.out.println("原对象: " + original);
        System.out.println("copy1: " + copy1);
        System.out.println("copy2: " + copy2);
        System.out.println("copy3: " + copy3);
    }
}

// 地址类
class Address implements Cloneable, Serializable {
    private String city;
    private String district;
    
    public Address(String city, String district) {
        this.city = city;
        this.district = district;
    }
    
    // 拷贝构造器
    public Address(Address other) {
        this.city = other.city;
        this.district = other.district;
    }
    
    @Override
    protected Address clone() throws CloneNotSupportedException {
        return (Address) super.clone();
    }
    
    // getters and setters
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    
    @Override
    public String toString() {
        return city + "-" + district;
    }
}

// 浅拷贝Person类
class Person implements Cloneable {
    private String name;
    private int age;
    private Address address;
    
    public Person(String name, int age, Address address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
    
    @Override
    protected Person clone() throws CloneNotSupportedException {
        // 默认的浅拷贝
        return (Person) super.clone();
    }
    
    // getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + ", address=" + address + "}";
    }
}

// 深拷贝Person类
class PersonDeep implements Cloneable, Serializable {
    private String name;
    private int age;
    private Address address;
    private List<String> hobbies;
    
    public PersonDeep(String name, int age, Address address) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.hobbies = new ArrayList<>();
    }
    
    // 拷贝构造器
    public PersonDeep(PersonDeep other) {
        this.name = other.name;
        this.age = other.age;
        this.address = new Address(other.address);  // 深拷贝地址
        this.hobbies = new ArrayList<>(other.hobbies);  // 深拷贝列表
    }
    
    // 手动深拷贝
    public PersonDeep manualDeepCopy() {
        PersonDeep copy = new PersonDeep(this.name, this.age, new Address(this.address));
        copy.hobbies = new ArrayList<>(this.hobbies);
        return copy;
    }
    
    // 序列化深拷贝
    public PersonDeep deepClone() throws Exception {
        return SerializationUtils.deepCopy(this);
    }
    
    public void addHobby(String hobby) {
        hobbies.add(hobby);
    }
    
    // getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public List<String> getHobbies() { return hobbies; }
    
    @Override
    public String toString() {
        return "PersonDeep{name='" + name + "', age=" + age + 
               ", address=" + address + ", hobbies=" + hobbies + "}";
    }
}

// 序列化工具类
class SerializationUtils {
    
    @SuppressWarnings("unchecked")
    public static <T extends Serializable> T deepCopy(T original) throws Exception {
        // 序列化
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject(original);
        }
        
        // 反序列化
        ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
        try (ObjectInputStream ois = new ObjectInputStream(bais)) {
            return (T) ois.readObject();
        }
    }
}

/*
 * 拷贝方式对比：
 * 
 * ┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
 * │   方式      │   实现难度  │   性能      │   完整性    │   适用场景  │
 * ├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
 * │  浅拷贝     │     简单    │     高      │   不完整    │  简单对象   │
 * │  手动深拷贝 │     中等    │     中等    │   完整      │ 可控拷贝    │
 * │  序列化拷贝 │     简单    │     低      │   完整      │ 复杂对象    │
 * │  构造器拷贝 │     中等    │     高      │   可控      │ 设计良好    │
 * │  第三方库   │     简单    │     中等    │   完整      │ 通用场景    │
 * └─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
 * 
 * 最佳实践：
 * 1. 不可变对象不需要深拷贝
 * 2. 优先使用拷贝构造器，控制拷贝逻辑
 * 3. 复杂对象可以考虑序列化方式
 * 4. 性能敏感场景避免序列化拷贝
 * 5. 注意循环引用问题
 */
```

### 🎯 hashCode与equals的关系？

**📋 标准话术**：

> "hashCode和equals是Java对象的两个重要方法，它们有严格的契约关系：
>
> **hashCode方法**：
>
> - 返回对象的哈希码值，用于哈希表（如HashMap）中的快速查找
> - 默认实现通常基于对象的内存地址计算
> - 必须保证：相等的对象具有相同的哈希码
>
> **equals与hashCode契约**：
>
> 1. 如果两个对象equals相等，则它们的hashCode必须相等
> 2. 如果两个对象hashCode相等，它们的equals不一定相等（哈希冲突）
> 3. 重写equals时必须重写hashCode，否则违反契约
> 4. hashCode应该尽量分散，减少哈希冲突
>
> **实践原则**：
>
> - 同时重写equals和hashCode，保持一致性
> - equals中使用的字段，hashCode也应该使用
> - 使用Objects.equals()和Objects.hash()简化实现
> - 重写后的对象才能正确用于HashMap、HashSet等集合
>
> 违反契约会导致集合操作异常，如HashMap中相等的对象无法正确查找。"



---

## 🔤 三、字符串处理（String核心）

> **核心思想**：String是Java中最常用的类，理解String、StringBuilder、StringBuffer的区别和字符串常量池机制是基础中的基础。

### 🎯 String、StringBuilder、StringBuffer的区别？

**📋 标准话术**：

> "String、StringBuilder、StringBuffer的主要区别：
>
> **String类**：
>
> - 不可变（immutable），任何修改都会创建新对象
> - 线程安全（因为不可变）
> - 适用于字符串内容不会改变的场景
> - 大量字符串拼接会产生很多临时对象，性能较差
>
> **StringBuilder类**：
>
> - 可变的字符序列，修改操作在原对象上进行
> - 线程不安全，但性能最好
> - 适用于单线程环境下的字符串拼接
> - 内部使用char数组，动态扩容
>
> **StringBuffer类**：
>
> - 可变的字符序列，功能与StringBuilder类似
> - 线程安全（方法都用synchronized修饰）
> - 适用于多线程环境下的字符串拼接
> - 由于同步开销，性能比StringBuilder差
>
> **选择建议**：单线程用StringBuilder，多线程用StringBuffer，不变字符串用String。"

**💻 代码示例**：

```java
public class StringDemo {
    
    public static void main(String[] args) {
        // 1. String不可变性演示
        demonstrateStringImmutability();
        
        // 2. 字符串常量池
        demonstrateStringPool();
        
        // 3. 性能对比
        performanceComparison();
        
        // 4. 线程安全测试
        threadSafetyTest();
        
        // 5. 常用方法演示
        demonstrateStringMethods();
    }
    
    // String不可变性演示
    public static void demonstrateStringImmutability() {
        System.out.println("=== String Immutability ===");
        
        String str = "Hello";
        System.out.println("Original string: " + str);
        System.out.println("String object ID: " + System.identityHashCode(str));
        
        str = str + " World";  // 创建新对象，原对象不变
        System.out.println("After concatenation: " + str);
        System.out.println("New object ID: " + System.identityHashCode(str));
        
        // 字符串字面量拼接（编译时优化）
        String compile1 = "Hello" + " " + "World";  // 编译时合并为"Hello World"
        String compile2 = "Hello World";
        System.out.println("Compile-time concatenation same object: " + (compile1 == compile2)); // true
    }
    
    // 字符串常量池演示
    public static void demonstrateStringPool() {
        System.out.println("\n=== String Pool ===");
        
        String s1 = "hello";              // 常量池
        String s2 = "hello";              // 引用常量池中的对象
        String s3 = new String("hello");  // 堆中新对象
        String s4 = s3.intern();          // 返回常量池中的对象
        
        System.out.println("s1 == s2: " + (s1 == s2));  // true，同一个常量池对象
        System.out.println("s1 == s3: " + (s1 == s3));  // false，不同对象
        System.out.println("s1 == s4: " + (s1 == s4));  // true，intern()返回常量池对象
        
        // 动态字符串的intern
        String dynamic = new String("hello") + new String("world");
        String dynamicIntern = dynamic.intern();
        String literal = "helloworld";
        System.out.println("dynamic.intern() == literal: " + (dynamicIntern == literal));
    }
    
    // 性能对比
    public static void performanceComparison() {
        System.out.println("\n=== Performance Comparison ===");
        int iterations = 10000;
        
        // String拼接性能（差）
        long startTime = System.currentTimeMillis();
        String result1 = "";
        for (int i = 0; i < iterations; i++) {
            result1 += "a";  // 每次都创建新对象
        }
        long stringTime = System.currentTimeMillis() - startTime;
        
        // StringBuilder性能（最好）
        startTime = System.currentTimeMillis();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < iterations; i++) {
            sb.append("a");  // 在原对象上修改
        }
        String result2 = sb.toString();
        long stringBuilderTime = System.currentTimeMillis() - startTime;
        
        // StringBuffer性能（中等）
        startTime = System.currentTimeMillis();
        StringBuffer sbf = new StringBuffer();
        for (int i = 0; i < iterations; i++) {
            sbf.append("a");  // 同步方法调用
        }
        String result3 = sbf.toString();
        long stringBufferTime = System.currentTimeMillis() - startTime;
        
        System.out.println("String concatenation: " + stringTime + "ms");
        System.out.println("StringBuilder: " + stringBuilderTime + "ms");
        System.out.println("StringBuffer: " + stringBufferTime + "ms");
        
        System.out.println("Results equal: " + 
            result1.equals(result2) + ", " + result2.equals(result3));
    }
    
    // 线程安全测试
    public static void threadSafetyTest() {
        System.out.println("\n=== Thread Safety Test ===");
        
        // StringBuilder - 线程不安全
        StringBuilder sb = new StringBuilder();
        StringBuffer sbf = new StringBuffer();
        
        // 创建多个线程同时操作
        Runnable appendTask = () -> {
            for (int i = 0; i < 1000; i++) {
                sb.append("a");
                sbf.append("a");
            }
        };
        
        Thread[] threads = new Thread[5];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(appendTask);
            threads[i].start();
        }
        
        // 等待所有线程完成
        for (Thread thread : threads) {
            try {
                thread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        System.out.println("Expected length: " + (5 * 1000));
        System.out.println("StringBuilder length: " + sb.length()); // 可能小于期望值
        System.out.println("StringBuffer length: " + sbf.length()); // 等于期望值
    }
    
    // 常用字符串方法演示
    public static void demonstrateStringMethods() {
        System.out.println("\n=== Common String Methods ===");
        
        String str = "  Hello World Java Programming  ";
        
        // 基本操作
        System.out.println("Length: " + str.length());
        System.out.println("Trimmed: '" + str.trim() + "'");
        System.out.println("Upper case: " + str.toUpperCase());
        System.out.println("Lower case: " + str.toLowerCase());
        
        // 搜索操作
        System.out.println("Index of 'World': " + str.indexOf("World"));
        System.out.println("Last index of 'a': " + str.lastIndexOf("a"));
        System.out.println("Contains 'Java': " + str.contains("Java"));
        System.out.println("Starts with '  Hello': " + str.startsWith("  Hello"));
        System.out.println("Ends with 'ing  ': " + str.endsWith("ming  "));
        
        // 替换操作
        System.out.println("Replace 'World' with 'Universe': " + 
            str.replace("World", "Universe"));
        System.out.println("Replace all spaces: " + 
            str.replaceAll("\\s+", "_"));
        
        // 分割操作
        String[] words = str.trim().split("\\s+");
        System.out.println("Split into words: " + java.util.Arrays.toString(words));
        
        // 子字符串
        System.out.println("Substring(2, 7): '" + str.substring(2, 7) + "'");
        
        // 字符操作
        System.out.println("Char at index 2: '" + str.charAt(2) + "'");
        char[] chars = str.toCharArray();
        System.out.println("Char array length: " + chars.length);
    }
}

// StringBuilder和StringBuffer源码分析要点
class StringBuilderAnalysis {
    /*
     * StringBuilder和StringBuffer都继承自AbstractStringBuilder
     * 
     * 核心字段：
     * char[] value;  // 存储字符数据的数组
     * int count;     // 当前字符数量
     * 
     * 扩容机制：
     * 当容量不足时，新容量 = (旧容量 + 1) * 2
     * 如果还不够，直接使用需要的容量
     * 
     * StringBuffer的同步：
     * 所有公共方法都用synchronized修饰
     * 
     * 性能优化建议：
     * 1. 预估容量，使用带初始容量的构造方法
     * 2. 单线程环境优先使用StringBuilder
     * 3. 避免在循环中使用String拼接
     */
    
    public static void optimizedStringBuilding() {
        // 好的做法：预估容量
        StringBuilder sb = new StringBuilder(1000);  // 预分配容量
        
        // 避免的做法：不断扩容
        StringBuilder sb2 = new StringBuilder();  // 默认容量16，会多次扩容
    }
}
```

---

## ⚠️ 四、异常处理机制（Exception核心）

> **核心思想**：异常处理是Java程序健壮性的重要保障，理解异常体系、处理机制和最佳实践对编写高质量代码至关重要。

### 🎯 Java异常体系是怎样的？

**📋 标准话术**：

> "Java异常体系以Throwable为根类，分为两大分支：
>
> **Error类**：表示严重的系统级错误，程序无法处理，如OutOfMemoryError、StackOverflowError。应用程序不应该捕获这类异常。
>
> **Exception类**：程序可以处理的异常，又分为两类：
>
> **检查型异常（Checked Exception）**：
>
> - 编译时必须处理（try-catch或throws声明）
> - 如IOException、SQLException、ClassNotFoundException
> - 表示程序运行中可能出现的合理异常情况
>
> **非检查型异常（Unchecked Exception）**：
>
> - 继承自RuntimeException，编译时不强制处理
> - 如NullPointerException、ArrayIndexOutOfBoundsException
> - 通常表示程序逻辑错误
>
> **异常处理原则**：能处理就处理，不能处理就向上抛出；记录日志；不要忽略异常；优先使用标准异常。"



---

## 🎯 五、泛型机制（Generic核心）

> **核心思想**：泛型提供了编译时类型安全检查，避免类型转换异常，同时提高代码复用性和可读性。

### 🎯 什么是Java泛型？类型擦除是什么？

**📋 标准话术**：

> "Java泛型是JDK 5引入的特性，允许在定义类、接口和方法时使用类型参数：
>
> **泛型的作用**：
>
> - 提供编译时类型安全检查，避免ClassCastException
> - 消除类型转换的需要，提高代码可读性
> - 提高代码复用性，一套代码适用多种类型
>
> **类型擦除（Type Erasure）**：
>
> - Java泛型是编译时特性，运行时会被擦除
> - 编译后所有泛型信息都被替换为原始类型或Object
> - 这是为了保持与早期Java版本的兼容性
> - 导致一些限制，如不能创建泛型数组、不能获取运行时泛型信息等
>
> **通配符**：
>
> - `?` 表示未知类型
> - `? extends T` 上界通配符，只能读取
> - `? super T` 下界通配符，只能写入
>
> **PECS原则**：Producer Extends, Consumer Super - 生产者使用extends，消费者使用super。"

**💻 代码示例**：

```java
import java.util.*;

public class GenericDemo {
    
    public static void main(String[] args) {
        // 1. 泛型类：类型安全，无需转换
        Box<String> stringBox = new Box<>("Hello");
        String str = stringBox.get();               // 无需强转
        
        List<Integer> list = new ArrayList<>();     // 类型安全
        list.add(100);
        // list.add("string");                      // 编译错误
        
        // 2. 泛型方法：类型推断
        String[] arr = {"A", "B", "C"};
        swap(arr, 0, 2);                           // <String>可省略
        
        // 3. 通配符：灵活性
        List<? extends Number> numbers = new ArrayList<Integer>();
        List<? super Integer> ints = new ArrayList<Number>();
        
        // 4. 类型擦除：运行时泛型信息丢失
        List<String> strList = new ArrayList<>();
        List<Integer> intList = new ArrayList<>();
        System.out.println(strList.getClass() == intList.getClass()); // true
    }
    
    // 泛型类演示
    public static void demonstrateGenericClass() {
        System.out.println("=== Generic Class Demo ===");
        
        // 使用泛型避免类型转换
        Box<String> stringBox = new Box<>("Hello");
        Box<Integer> intBox = new Box<>(42);
        
        String str = stringBox.get();  // 无需类型转换
        Integer num = intBox.get();    // 编译时类型安全
        
        System.out.println("String box: " + str);
        System.out.println("Integer box: " + num);
        
        // 泛型集合
        List<String> stringList = new ArrayList<>();
        stringList.add("Java");
        stringList.add("Python");
        // stringList.add(123);  // 编译错误，类型安全
        
        for (String s : stringList) {
            System.out.println("Language: " + s);  // 无需转换
        }
    }
    
    // 泛型方法演示
    public static void demonstrateGenericMethod() {
        System.out.println("\n=== Generic Method Demo ===");
        
        // 泛型方法自动推断类型
        String[] strings = {"a", "b", "c"};
        Integer[] integers = {1, 2, 3};
        
        printArray(strings);   // T推断为String
        printArray(integers);  // T推断为Integer
        
        // 显式指定类型
        GenericDemo.<Double>printArray(new Double[]{1.1, 2.2, 3.3});
        
        // 有界类型参数
        System.out.println("Max number: " + findMax(integers));
        
        // 多个类型参数
        Pair<String, Integer> pair = makePair("Age", 25);
        System.out.println("Pair: " + pair);
    }
    
    // 通配符演示
    public static void demonstrateWildcards() {
        System.out.println("\n=== Wildcards Demo ===");
        
        List<Integer> intList = Arrays.asList(1, 2, 3);
        List<Double> doubleList = Arrays.asList(1.1, 2.2, 3.3);
        List<String> stringList = Arrays.asList("a", "b", "c");
        
        // 上界通配符 - 只能读取，不能写入
        printNumbers(intList);    // Integer extends Number
        printNumbers(doubleList); // Double extends Number
        // printNumbers(stringList); // 编译错误
        
        // 下界通配符 - 只能写入Number或其子类
        List<Object> objList = new ArrayList<>();
        addNumbers(objList);
        System.out.println("Added numbers: " + objList);
        
        // 无界通配符
        printCollection(intList);
        printCollection(stringList);
    }
    
    // 类型擦除演示
    public static void demonstrateTypeErasure() {
        System.out.println("\n=== Type Erasure Demo ===");
        
        List<String> stringList = new ArrayList<>();
        List<Integer> intList = new ArrayList<>();
        
        // 运行时类型相同，都是ArrayList
        System.out.println("Same class: " + 
            (stringList.getClass() == intList.getClass())); // true
        
        System.out.println("Class name: " + stringList.getClass().getName());
        
        // 反射无法获取泛型信息
        try {
            java.lang.reflect.Method method = GenericDemo.class.getMethod("printArray", Object[].class);
            System.out.println("Method: " + method.toGenericString());
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }
    
    // 泛型限制演示
    public static void demonstrateGenericLimitations() {
        System.out.println("\n=== Generic Limitations Demo ===");
        
        // 1. 不能创建泛型数组
        // List<String>[] array = new List<String>[10]; // 编译错误
        List<String>[] array = new List[10];  // 可以，但会有警告
        
        // 2. 不能实例化类型参数
        // T instance = new T(); // 编译错误
        
        // 3. 不能创建参数化类型的数组
        // Pair<String, Integer>[] pairs = new Pair<String, Integer>[10]; // 编译错误
        
        // 4. 静态字段不能使用类型参数
        // static T staticField; // 编译错误
        
        System.out.println("Generic limitations demonstrated");
    }
    
    // 泛型方法
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.print(element + " ");
        }
        System.out.println();
    }
    
    // 有界类型参数
    public static <T extends Comparable<T>> T findMax(T[] array) {
        T max = array[0];
        for (T element : array) {
            if (element.compareTo(max) > 0) {
                max = element;
            }
        }
        return max;
    }
    
    // 多个类型参数
    public static <T, U> Pair<T, U> makePair(T first, U second) {
        return new Pair<>(first, second);
    }
    
    // 上界通配符
    public static void printNumbers(List<? extends Number> list) {
        for (Number n : list) {
            System.out.print(n + " ");
        }
        System.out.println();
    }
    
    // 下界通配符
    public static void addNumbers(List<? super Number> list) {
        list.add(42);
        list.add(3.14);
        // list.add("string"); // 编译错误
    }
    
    // 无界通配符
    public static void printCollection(List<?> list) {
        for (Object obj : list) {
            System.out.print(obj + " ");
        }
        System.out.println();
    }
}

// 泛型类
class Box<T> {
    private T content;
    
    public Box(T content) {
        this.content = content;
    }
    
    public T get() {
        return content;
    }
    
    public void set(T content) {
        this.content = content;
    }
}

// 多个类型参数的泛型类
class Pair<T, U> {
    private T first;
    private U second;
    
    public Pair(T first, U second) {
        this.first = first;
        this.second = second;
    }
    
    public T getFirst() { return first; }
    public U getSecond() { return second; }
    
    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

// 有界类型参数
class NumberBox<T extends Number> {
    private T number;
    
    public NumberBox(T number) {
        this.number = number;
    }
    
    public double getDoubleValue() {
        return number.doubleValue();  // 可以调用Number的方法
    }
}
```

---

## 🪞 六、反射机制（Reflection核心）

> **核心思想**：反射是Java的动态特性，允许程序在运行时检查和操作类、方法、字段等，是框架开发的重要基础。

### 🎯 注解的原理？

**📋 标准话术**：

> "Java注解是一种特殊的'接口'，用于为代码提供元数据信息：
>
> **注解的本质**：
>
> - 注解本质上是继承了Annotation接口的特殊接口
> - 编译后生成字节码，存储在Class文件的常量池中
> - 运行时通过反射机制读取注解信息
> - 不影响程序的正常执行，只提供元数据
>
> **注解的生命周期**：
>
> - SOURCE：只在源码阶段保留，编译时丢弃
> - CLASS：编译到Class文件，运行时不加载到JVM
> - RUNTIME：运行时保留，可以通过反射读取
>
> **注解处理流程**：
>
> 1. 定义注解（使用@interface）
> 2. 在代码中使用注解
> 3. 编译器将注解信息写入Class文件
> 4. 运行时通过反射API读取和处理注解
>
> **核心应用**：
>
> - 框架配置：Spring的@Component、@Autowired等
> - 代码生成：Lombok的@Data、@Getter等
> - 约束校验：@NotNull、@Valid等
> - 测试框架：JUnit的@Test、@BeforeEach等
>
> 注解是现代Java框架的基石，简化了配置，提高了开发效率。"

### 🎯 什么是反射机制？反射有什么应用场景？

**📋 标准话术**：

> "Java反射机制是在运行状态中，对于任意一个类都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性。这种动态获取信息以及动态调用对象方法的功能称为Java的反射机制。
>
> **反射的核心类**：
>
> - Class：类的元信息，是反射的入口点
> - Field：字段信息，可以获取和设置字段值
> - Method：方法信息，可以调用方法
> - Constructor：构造器信息，可以创建实例
>
> **应用场景**：
>
> - 框架开发：Spring、Hibernate等大量使用反射
> - 注解处理：运行时处理注解信息
> - 动态代理：JDK动态代理基于反射实现
> - 配置文件：根据配置动态创建对象
> - IDE工具：代码提示、自动完成功能
>
> **优缺点**：
>
> - 优点：提高代码灵活性，实现动态编程
> - 缺点：性能开销大，破坏封装性，代码可读性差
>
> 反射是框架设计的灵魂，但在日常开发中应谨慎使用。"

**💻 代码示例**：

```java
import java.lang.annotation.*;
import java.lang.reflect.*;
import java.util.*;

public class ReflectionDemo {
    
    public static void main(String[] args) throws Exception {
        // 1. 获取Class对象的三种方式
        demonstrateGetClass();
        
        // 2. 反射操作字段
        demonstrateFields();
        
        // 3. 反射操作方法
        demonstrateMethods();
        
        // 4. 反射操作构造器
        demonstrateConstructors();
        
        // 5. 注解处理
        demonstrateAnnotations();
        
        // 6. 动态代理
        demonstrateDynamicProxy();
    }
    
    // 获取Class对象的方式
    public static void demonstrateGetClass() throws ClassNotFoundException {
        System.out.println("=== Get Class Object ===");
        
        // 方式1：通过对象获取
        Student student = new Student("Alice", 20);
        Class<?> clazz1 = student.getClass();
        
        // 方式2：通过类名获取
        Class<?> clazz2 = Student.class;
        
        // 方式3：通过Class.forName()获取
        Class<?> clazz3 = Class.forName("Student");
        
        System.out.println("Same class: " + (clazz1 == clazz2 && clazz2 == clazz3));
        System.out.println("Class name: " + clazz1.getName());
        System.out.println("Simple name: " + clazz1.getSimpleName());
        System.out.println("Package: " + clazz1.getPackage().getName());
    }
    
    // 反射操作字段
    public static void demonstrateFields() throws Exception {
        System.out.println("\n=== Field Operations ===");
        
        Class<?> clazz = Student.class;
        Student student = new Student("Bob", 22);
        
        // 获取所有字段（包括私有）
        Field[] fields = clazz.getDeclaredFields();
        System.out.println("Fields count: " + fields.length);
        
        for (Field field : fields) {
            System.out.println("Field: " + field.getName() + 
                             ", Type: " + field.getType().getSimpleName() + 
                             ", Modifiers: " + Modifier.toString(field.getModifiers()));
        }
        
        // 访问私有字段
        Field nameField = clazz.getDeclaredField("name");
        nameField.setAccessible(true);  // 绕过访问控制
        
        String name = (String) nameField.get(student);
        System.out.println("Original name: " + name);
        
        nameField.set(student, "Charlie");
        System.out.println("Modified name: " + student.getName());
        
        // 访问静态字段
        Field countField = clazz.getDeclaredField("count");
        countField.setAccessible(true);
        int count = (int) countField.get(null);  // 静态字段传null
        System.out.println("Student count: " + count);
    }
    
    // 反射操作方法
    public static void demonstrateMethods() throws Exception {
        System.out.println("\n=== Method Operations ===");
        
        Class<?> clazz = Student.class;
        Student student = new Student("David", 25);
        
        // 获取所有方法
        Method[] methods = clazz.getDeclaredMethods();
        System.out.println("Methods count: " + methods.length);
        
        for (Method method : methods) {
            System.out.println("Method: " + method.getName() + 
                             ", Return type: " + method.getReturnType().getSimpleName() + 
                             ", Parameters: " + method.getParameterCount());
        }
        
        // 调用公共方法
        Method getNameMethod = clazz.getMethod("getName");
        String name = (String) getNameMethod.invoke(student);
        System.out.println("Name from method: " + name);
        
        // 调用私有方法
        Method privateMethod = clazz.getDeclaredMethod("privateMethod");
        privateMethod.setAccessible(true);
        privateMethod.invoke(student);
        
        // 调用带参数的方法
        Method setAgeMethod = clazz.getMethod("setAge", int.class);
        setAgeMethod.invoke(student, 30);
        System.out.println("Age after method call: " + student.getAge());
        
        // 调用静态方法
        Method staticMethod = clazz.getDeclaredMethod("getCount");
        int count = (int) staticMethod.invoke(null);
        System.out.println("Count from static method: " + count);
    }
    
    // 反射操作构造器
    public static void demonstrateConstructors() throws Exception {
        System.out.println("\n=== Constructor Operations ===");
        
        Class<?> clazz = Student.class;
        
        // 获取所有构造器
        Constructor<?>[] constructors = clazz.getDeclaredConstructors();
        System.out.println("Constructors count: " + constructors.length);
        
        for (Constructor<?> constructor : constructors) {
            System.out.println("Constructor parameters: " + constructor.getParameterCount());
        }
        
        // 使用无参构造器
        Constructor<?> defaultConstructor = clazz.getDeclaredConstructor();
        Student student1 = (Student) defaultConstructor.newInstance();
        System.out.println("Default constructor: " + student1);
        
        // 使用有参构造器
        Constructor<?> paramConstructor = clazz.getDeclaredConstructor(String.class, int.class);
        Student student2 = (Student) paramConstructor.newInstance("Eva", 28);
        System.out.println("Param constructor: " + student2);
    }
    
    // 注解处理
    public static void demonstrateAnnotations() throws Exception {
        System.out.println("\n=== Annotation Processing ===");
        
        Class<?> clazz = Student.class;
        
        // 检查类注解
        if (clazz.isAnnotationPresent(MyAnnotation.class)) {
            MyAnnotation annotation = clazz.getAnnotation(MyAnnotation.class);
            System.out.println("Class annotation value: " + annotation.value());
        }
        
        // 检查字段注解
        Field nameField = clazz.getDeclaredField("name");
        if (nameField.isAnnotationPresent(MyAnnotation.class)) {
            MyAnnotation annotation = nameField.getAnnotation(MyAnnotation.class);
            System.out.println("Field annotation value: " + annotation.value());
        }
        
        // 检查方法注解
        Method method = clazz.getMethod("getName");
        if (method.isAnnotationPresent(MyAnnotation.class)) {
            MyAnnotation annotation = method.getAnnotation(MyAnnotation.class);
            System.out.println("Method annotation value: " + annotation.value());
        }
    }
    
    // 动态代理
    public static void demonstrateDynamicProxy() {
        System.out.println("\n=== Dynamic Proxy ===");
        
        // 创建目标对象
        UserService userService = new UserServiceImpl();
        
        // 创建代理对象
        UserService proxy = (UserService) Proxy.newProxyInstance(
            userService.getClass().getClassLoader(),
            userService.getClass().getInterfaces(),
            new LoggingHandler(userService)
        );
        
        // 通过代理调用方法
        proxy.login("admin", "password");
        proxy.logout("admin");
    }
}

// 示例类
@MyAnnotation("Student class")
class Student {
    private static int count = 0;
    
    @MyAnnotation("name field")
    private String name;
    private int age;
    
    public Student() {
        this("Unknown", 0);
    }
    
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
        count++;
    }
    
    @MyAnnotation("getName method")
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
    
    private void privateMethod() {
        System.out.println("Private method called");
    }
    
    public static int getCount() {
        return count;
    }
    
    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
}

// 自定义注解
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.FIELD, ElementType.METHOD})
@interface MyAnnotation {
    String value() default "";
}

// 动态代理示例
interface UserService {
    void login(String username, String password);
    void logout(String username);
}

class UserServiceImpl implements UserService {
    @Override
    public void login(String username, String password) {
        System.out.println("User " + username + " logged in");
    }
    
    @Override
    public void logout(String username) {
        System.out.println("User " + username + " logged out");
    }
}

class LoggingHandler implements InvocationHandler {
    private Object target;
    
    public LoggingHandler(Object target) {
        this.target = target;
    }
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Before method: " + method.getName());
        Object result = method.invoke(target, args);
        System.out.println("After method: " + method.getName());
        return result;
    }
}
```



### 🎯 反射的原理？

> 反射基于 JVM 类加载机制，JVM 在类加载后会生成唯一的 `Class` 对象保存类的元信息。反射 API 就是通过 `Class` 对象访问这些元信息，从而在运行时动态调用方法、访问字段或创建对象。它的本质是 JVM 内部类型信息表的访问封装。反射灵活但性能较差，因此主要用于框架层，而不是业务层的高频调用。

反射是 **JVM 在类加载后，利用运行时保留的类元数据，通过 `Class` 对象来操作类的属性和方法** 的机制，本质是对 JVM 内部数据结构的一层封装。

**1、核心原理**

- 当类被加载到 JVM 后，会生成唯一的 `Class` 对象，存储类的元信息（字段、方法、构造器、注解等）。
- `Class` 对象存放在 **方法区（元空间）**，它是反射的入口。
- 反射 API (`java.lang.reflect`) 通过访问 `Class` 对象来操作元数据，本质就是 **JVM 把字节码信息映射为对象供开发者调用**。

**2、核心机制**

- **Class 对象**：类的运行时表示。
- **Field 对象**：封装字段信息，可读写字段值。
- **Method 对象**：封装方法信息，可 `invoke` 调用。
- **Constructor 对象**：封装构造器信息，可 `newInstance` 创建实例。
- **setAccessible(true)**：跳过访问权限检查。

**3、使用流程**

1. 获取 `Class` 对象（`Class.forName()`、`xxx.class`、`obj.getClass()`）。
2. 通过 `Class` 对象获取 `Field`、`Method`、`Constructor` 等。
3. 调用 `invoke()`、`set()` 等完成动态操作。

4、**性能与应用**

- **性能**：反射比直接调用慢 10~20 倍，因为多了权限校验和方法查找；JVM 在反射调用一定次数后会做优化（内联）。
- **应用场景**：框架（Spring、Hibernate、MyBatis）利用反射实现 **依赖注入、AOP、ORM** 等。



---

## 📁 七、IO流体系（IO核心）

> **核心思想**：Java IO提供了丰富的输入输出操作，分为字节流、字符流、缓冲流等，满足不同场景的数据处理需求。

### 🎯 BIO、NIO、AIO有什么区别？

- **BIO (Blocking I/O):** 同步阻塞I/O模式，数据的读取写入必须阻塞在一个线程内等待其完成。在活动连接数不是特别高（小于单机1000）的情况下，这种模型是比较不错的，可以让每一个连接专注于自己的 I/O 并且编程模型简单，也不用过多考虑系统的过载、限流等问题。线程池本身就是一个天然的漏斗，可以缓冲一些系统处理不了的连接或请求。但是，当面对十万甚至百万级连接的时候，传统的 BIO 模型是无能为力的。因此，我们需要一种更高效的 I/O 处理模型来应对更高的并发量。
- **NIO (New I/O):** NIO是一种同步非阻塞的I/O模型，在Java 1.4 中引入了NIO框架，对应 java.nio 包，提供了 Channel , Selector，Buffer等抽象。NIO中的N可以理解为Non-blocking，不单纯是New。它支持面向缓冲的，基于通道的I/O操作方法。 NIO提供了与传统BIO模型中的 `Socket` 和 `ServerSocket` 相对应的 `SocketChannel` 和 `ServerSocketChannel` 两种不同的套接字通道实现,两种通道都支持阻塞和非阻塞两种模式。阻塞模式使用就像传统中的支持一样，比较简单，但是性能和可靠性都不好；非阻塞模式正好与之相反。对于低负载、低并发的应用程序，可以使用同步阻塞I/O来提升开发速率和更好的维护性；对于高负载、高并发的（网络）应用，应使用 NIO 的非阻塞模式来开发
- **AIO (Asynchronous I/O):** AIO 也就是 NIO 2。在 Java 7 中引入了 NIO 的改进版 NIO 2,它是异步非阻塞的IO模型。异步 IO 是基于事件和回调机制实现的，也就是应用操作之后会直接返回，不会堵塞在那里，当后台处理完成，操作系统会通知相应的线程进行后续的操作。AIO 是异步IO的缩写，虽然 NIO 在网络操作中，提供了非阻塞的方法，但是 NIO 的 IO 行为还是同步的。对于 NIO 来说，我们的业务线程是在 IO 操作准备好时，得到通知，接着就由这个线程自行进行 IO 操作，IO操作本身是同步的。查阅网上相关资料，我发现就目前来说 AIO 的应用还不是很广泛，Netty 之前也尝试使用过 AIO，不过又放弃了。

```java
import java.io.*;
import java.net.*;
import java.nio.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.util.concurrent.*;

public class IOModelDemo {
    
    public static void main(String[] args) throws Exception {
        // 演示BIO
        demonstrateBIO();
        
        System.out.println();
        
        // 演示NIO
        demonstrateNIO();
        
        System.out.println();
        
        // 演示AIO
        demonstrateAIO();
        
        System.out.println();
        
        // 性能对比
        performanceComparison();
    }
    
    // BIO演示
    public static void demonstrateBIO() throws IOException {
        System.out.println("=== BIO演示 ===");
        
        // 文件操作 - 阻塞式
        String fileName = "bio_test.txt";
        String content = "BIO测试内容\n阻塞式IO操作";
        
        // BIO写文件
        try (FileOutputStream fos = new FileOutputStream(fileName);
             BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(fos))) {
            
            writer.write(content);
            System.out.println("BIO写入完成");
        }
        
        // BIO读文件
        try (FileInputStream fis = new FileInputStream(fileName);
             BufferedReader reader = new BufferedReader(new InputStreamReader(fis))) {
            
            String line;
            System.out.println("BIO读取内容:");
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
        
        // 清理
        new File(fileName).delete();
        
        // BIO网络编程特点演示
        demonstrateBIONetworking();
    }
    
    public static void demonstrateBIONetworking() {
        System.out.println("\nBIO网络编程特点:");
        System.out.println("- 每个客户端连接需要一个线程");
        System.out.println("- 线程在accept()和read()时阻塞");
        System.out.println("- 适合连接数少、处理快的场景");
        
        // 模拟BIO服务器代码结构
        System.out.println("\nBIO服务器伪代码:");
        System.out.println("ServerSocket server = new ServerSocket(port);");
        System.out.println("while (true) {");
        System.out.println("    Socket client = server.accept(); // 阻塞等待");
        System.out.println("    new Thread(() -> {");
        System.out.println("        // 处理客户端请求");
        System.out.println("        InputStream in = client.getInputStream(); // 可能阻塞");
        System.out.println("    }).start();");
        System.out.println("}");
    }
    
    // NIO演示
    public static void demonstrateNIO() throws IOException {
        System.out.println("=== NIO演示 ===");
        
        String fileName = "nio_test.txt";
        String content = "NIO测试内容\n非阻塞式IO操作\n基于Channel和Buffer";
        
        // NIO写文件
        Path path = Paths.get(fileName);
        try (FileChannel channel = FileChannel.open(path, 
                StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
            
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            buffer.put(content.getBytes("UTF-8"));
            buffer.flip(); // 切换到读模式
            
            while (buffer.hasRemaining()) {
                channel.write(buffer);
            }
            System.out.println("NIO写入完成");
        }
        
        // NIO读文件
        try (FileChannel channel = FileChannel.open(path, StandardOpenOption.READ)) {
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            
            int bytesRead = channel.read(buffer);
            if (bytesRead != -1) {
                buffer.flip(); // 切换到读模式
                
                byte[] bytes = new byte[buffer.remaining()];
                buffer.get(bytes);
                
                System.out.println("NIO读取内容:");
                System.out.println(new String(bytes, "UTF-8"));
            }
        }
        
        // 清理
        Files.deleteIfExists(path);
        
        // NIO特点演示
        demonstrateNIOFeatures();
    }
    
    public static void demonstrateNIOFeatures() {
        System.out.println("\nNIO核心组件:");
        System.out.println("1. Channel（通道）- 数据传输的通道");
        System.out.println("2. Buffer（缓冲区）- 数据的容器");
        System.out.println("3. Selector（选择器）- 多路复用器");
        
        System.out.println("\nNIO优势:");
        System.out.println("- 一个线程处理多个连接");
        System.out.println("- 非阻塞操作，提高并发性能");
        System.out.println("- 内存映射文件，提高大文件处理效率");
        
        // Buffer操作演示
        System.out.println("\nBuffer操作演示:");
        ByteBuffer buffer = ByteBuffer.allocate(10);
        
        System.out.println("初始状态 - position: " + buffer.position() + 
                          ", limit: " + buffer.limit() + 
                          ", capacity: " + buffer.capacity());
        
        buffer.put("Hello".getBytes());
        System.out.println("写入后 - position: " + buffer.position() + 
                          ", limit: " + buffer.limit());
        
        buffer.flip();
        System.out.println("flip后 - position: " + buffer.position() + 
                          ", limit: " + buffer.limit());
        
        buffer.clear();
        System.out.println("clear后 - position: " + buffer.position() + 
                          ", limit: " + buffer.limit());
    }
    
    // AIO演示
    public static void demonstrateAIO() throws Exception {
        System.out.println("=== AIO演示 ===");
        
        String fileName = "aio_test.txt";
        String content = "AIO测试内容\n异步非阻塞IO操作\n基于回调机制";
        
        Path path = Paths.get(fileName);
        
        // AIO写文件
        try (AsynchronousFileChannel channel = AsynchronousFileChannel.open(path,
                StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
            
            ByteBuffer buffer = ByteBuffer.wrap(content.getBytes("UTF-8"));
            
            // 异步写入，使用Future
            Future<Integer> writeResult = channel.write(buffer, 0);
            
            // 等待写入完成
            Integer bytesWritten = writeResult.get();
            System.out.println("AIO异步写入完成，写入字节数: " + bytesWritten);
        }
        
        // AIO读文件 - 使用回调
        try (AsynchronousFileChannel channel = AsynchronousFileChannel.open(path,
                StandardOpenOption.READ)) {
            
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            
            // 使用CompletionHandler回调
            CountDownLatch latch = new CountDownLatch(1);
            
            channel.read(buffer, 0, buffer, new CompletionHandler<Integer, ByteBuffer>() {
                @Override
                public void completed(Integer result, ByteBuffer attachment) {
                    attachment.flip();
                    
                    byte[] bytes = new byte[attachment.remaining()];
                    attachment.get(bytes);
                    
                    try {
                        System.out.println("AIO异步读取完成:");
                        System.out.println(new String(bytes, "UTF-8"));
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        latch.countDown();
                    }
                }
                
                @Override
                public void failed(Throwable exc, ByteBuffer attachment) {
                    System.err.println("AIO读取失败: " + exc.getMessage());
                    latch.countDown();
                }
            });
            
            // 等待异步操作完成
            latch.await();
        }
        
        // 清理
        Files.deleteIfExists(path);
        
        // AIO特点演示
        demonstrateAIOFeatures();
    }
    
    public static void demonstrateAIOFeatures() {
        System.out.println("\nAIO特点:");
        System.out.println("- 真正的异步IO操作");
        System.out.println("- 操作完成后通过回调通知");
        System.out.println("- 不需要轮询操作状态");
        System.out.println("- 适合IO密集型应用");
        
        System.out.println("\nAIO两种获取结果的方式:");
        System.out.println("1. Future方式 - 主动查询结果");
        System.out.println("2. CompletionHandler方式 - 被动回调通知");
    }
    
    // 性能对比
    public static void performanceComparison() throws Exception {
        System.out.println("=== IO模型性能对比 ===");
        
        int fileCount = 100;
        String content = "性能测试内容\n";
        
        // BIO性能测试
        long start = System.currentTimeMillis();
        for (int i = 0; i < fileCount; i++) {
            String fileName = "bio_perf_" + i + ".txt";
            try (FileOutputStream fos = new FileOutputStream(fileName)) {
                fos.write(content.getBytes());
            }
            new File(fileName).delete();
        }
        long bioTime = System.currentTimeMillis() - start;
        
        // NIO性能测试
        start = System.currentTimeMillis();
        for (int i = 0; i < fileCount; i++) {
            String fileName = "nio_perf_" + i + ".txt";
            Path path = Paths.get(fileName);
            try (FileChannel channel = FileChannel.open(path,
                    StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
                ByteBuffer buffer = ByteBuffer.wrap(content.getBytes());
                channel.write(buffer);
            }
            Files.deleteIfExists(path);
        }
        long nioTime = System.currentTimeMillis() - start;
        
        System.out.println("文件操作性能对比 (" + fileCount + "个文件):");
        System.out.println("BIO耗时: " + bioTime + "ms");
        System.out.println("NIO耗时: " + nioTime + "ms");
        
        if (nioTime > 0) {
            System.out.println("性能比率: " + (bioTime / (double) nioTime));
        }
        
        System.out.println("\n实际应用中的选择:");
        System.out.println("- 小文件、低并发：BIO简单高效");
        System.out.println("- 大文件、高并发：NIO性能更好");
        System.out.println("- 长时间IO操作：AIO避免线程阻塞");
    }
}

/*
 * IO模型对比总结：
 * 
 * ┌─────────┬─────────────┬─────────────┬─────────────┬─────────────┐
 * │  模型   │   阻塞性    │   复杂度    │   并发性    │   适用场景  │
 * ├─────────┼─────────────┼─────────────┼─────────────┼─────────────┤
 * │   BIO   │   同步阻塞  │     低      │     低      │ 连接数少    │
 * │   NIO   │  同步非阻塞 │     中      │     高      │ 高并发      │
 * │   AIO   │  异步非阻塞 │     高      │     高      │ 长连接      │
 * └─────────┴─────────────┴─────────────┴─────────────┴─────────────┘
 * 
 * 核心区别：
 * 1. BIO：线程与连接1:1，适合连接数少的场景
 * 2. NIO：线程与连接1:N，使用Selector实现多路复用
 * 3. AIO：操作异步执行，通过回调获取结果
 * 
 * 发展历程：
 * - JDK 1.0: BIO - 简单但性能有限
 * - JDK 1.4: NIO - 提升并发性能
 * - JDK 1.7: AIO/NIO.2 - 真正异步IO
 */
```

### 🎯 字节流和字符流的区别？什么是缓冲流？

**📋 标准话术**：

> "Java IO流体系是处理输入输出数据的核心API：
>
> **字节流vs字符流**：
>
> - 字节流（InputStream/OutputStream）：以字节为单位处理数据，可以处理任何类型的文件
> - 字符流（Reader/Writer）：以字符为单位处理数据，专门处理文本文件，支持字符编码转换
> - 字节流是最基础的，字符流是在字节流基础上的封装
>
> **缓冲流**：
>
> - BufferedInputStream/BufferedOutputStream：字节缓冲流
> - BufferedReader/BufferedWriter：字符缓冲流
> - 通过内存缓冲区减少实际的磁盘IO次数，大幅提高性能
> - 默认缓冲区大小8192字节
>
> **NIO（New IO）**：
>
> - 面向缓冲区（Buffer）而不是面向流
> - 支持非阻塞IO操作
> - 使用Channel和Selector实现高性能IO
> - 适合高并发场景，如服务器端编程
>
> 选择原则：处理文本用字符流，处理二进制用字节流，高性能场景用缓冲流或NIO。"

**💻 代码示例**：

```java
import java.io.*;
import java.nio.*;
import java.nio.channels.*;
import java.nio.file.*;
import java.util.*;

public class IODemo {
    
    public static void main(String[] args) throws IOException {
        // 1. 字节流操作
        demonstrateByteStreams();
        
        // 2. 字符流操作
        demonstrateCharacterStreams();
        
        // 3. 缓冲流操作
        demonstrateBufferedStreams();
        
        // 4. NIO基础操作
        demonstrateNIO();
        
        // 5. IO性能对比
        performanceComparison();
    }
    
    // 字节流演示
    public static void demonstrateByteStreams() throws IOException {
        System.out.println("=== Byte Streams Demo ===");
        
        String content = "Hello Java IO! 你好世界！";
        String fileName = "byte_test.txt";
        
        // 字节流写入
        try (FileOutputStream fos = new FileOutputStream(fileName)) {
            byte[] bytes = content.getBytes("UTF-8");
            fos.write(bytes);
            System.out.println("Written " + bytes.length + " bytes");
        }
        
        // 字节流读取
        try (FileInputStream fis = new FileInputStream(fileName)) {
            byte[] buffer = new byte[1024];
            int bytesRead = fis.read(buffer);
            String result = new String(buffer, 0, bytesRead, "UTF-8");
            System.out.println("Read: " + result);
        }
        
        // 复制文件示例
        copyFileUsingByteStream("byte_test.txt", "byte_copy.txt");
        
        // 清理文件
        new File(fileName).delete();
        new File("byte_copy.txt").delete();
    }
    
    // 字符流演示
    public static void demonstrateCharacterStreams() throws IOException {
        System.out.println("\n=== Character Streams Demo ===");
        
        String content = "Hello Java IO!\n你好世界！\n字符流测试";
        String fileName = "char_test.txt";
        
        // 字符流写入
        try (FileWriter writer = new FileWriter(fileName, StandardCharsets.UTF_8)) {
            writer.write(content);
            System.out.println("Written characters: " + content.length());
        }
        
        // 字符流读取
        try (FileReader reader = new FileReader(fileName, StandardCharsets.UTF_8)) {
            char[] buffer = new char[1024];
            int charsRead = reader.read(buffer);
            String result = new String(buffer, 0, charsRead);
            System.out.println("Read characters: " + charsRead);
            System.out.println("Content:\n" + result);
        }
        
        // 按行读取
        System.out.println("Reading line by line:");
        try (BufferedReader br = new BufferedReader(
                new FileReader(fileName, StandardCharsets.UTF_8))) {
            String line;
            int lineNumber = 1;
            while ((line = br.readLine()) != null) {
                System.out.println("Line " + lineNumber++ + ": " + line);
            }
        }
        
        // 清理文件
        new File(fileName).delete();
    }
    
    // 缓冲流演示
    public static void demonstrateBufferedStreams() throws IOException {
        System.out.println("\n=== Buffered Streams Demo ===");
        
        String fileName = "buffered_test.txt";
        
        // 缓冲字符流写入
        try (BufferedWriter writer = new BufferedWriter(
                new FileWriter(fileName, StandardCharsets.UTF_8))) {
            for (int i = 1; i <= 5; i++) {
                writer.write("Line " + i + ": This is a test line.");
                writer.newLine();  // 跨平台换行
            }
            writer.flush();  // 强制刷新缓冲区
            System.out.println("Written 5 lines with buffered writer");
        }
        
        // 缓冲字符流读取
        try (BufferedReader reader = new BufferedReader(
                new FileReader(fileName, StandardCharsets.UTF_8))) {
            System.out.println("Reading with buffered reader:");
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
        
        // 缓冲字节流示例
        demonstrateByteBufferedStream(fileName);
        
        // 清理文件
        new File(fileName).delete();
    }
    
    // NIO基础演示
    public static void demonstrateNIO() throws IOException {
        System.out.println("\n=== NIO Demo ===");
        
        String content = "NIO Test Content\n使用NIO进行文件操作";
        Path path = Paths.get("nio_test.txt");
        
        // NIO写入文件
        Files.write(path, content.getBytes(StandardCharsets.UTF_8));
        System.out.println("Written file using NIO");
        
        // NIO读取文件
        byte[] bytes = Files.readAllBytes(path);
        String result = new String(bytes, StandardCharsets.UTF_8);
        System.out.println("Read content: " + result);
        
        // NIO按行读取
        System.out.println("Reading lines with NIO:");
        List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        for (int i = 0; i < lines.size(); i++) {
            System.out.println("Line " + (i + 1) + ": " + lines.get(i));
        }
        
        // Channel和Buffer示例
        demonstrateChannelAndBuffer(path);
        
        // 清理文件
        Files.deleteIfExists(path);
    }
    
    // Channel和Buffer演示
    public static void demonstrateChannelAndBuffer(Path path) throws IOException {
        System.out.println("\n--- Channel and Buffer Demo ---");
        
        // 使用Channel写入
        try (FileChannel channel = FileChannel.open(path, 
                StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
            
            String data = "Channel Buffer Demo\n通道缓冲区演示";
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            buffer.put(data.getBytes(StandardCharsets.UTF_8));
            buffer.flip();  // 切换到读模式
            
            while (buffer.hasRemaining()) {
                channel.write(buffer);
            }
            System.out.println("Written using Channel and Buffer");
        }
        
        // 使用Channel读取
        try (FileChannel channel = FileChannel.open(path, StandardOpenOption.READ)) {
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            int bytesRead = channel.read(buffer);
            buffer.flip();  // 切换到读模式
            
            byte[] bytes = new byte[bytesRead];
            buffer.get(bytes);
            String result = new String(bytes, StandardCharsets.UTF_8);
            System.out.println("Read using Channel: " + result);
        }
    }
    
    // 性能对比
    public static void performanceComparison() throws IOException {
        System.out.println("\n=== Performance Comparison ===");
        
        String testFile = "performance_test.txt";
        int iterations = 10000;
        
        // 测试无缓冲字节流
        long start = System.currentTimeMillis();
        try (FileOutputStream fos = new FileOutputStream(testFile)) {
            for (int i = 0; i < iterations; i++) {
                fos.write("Test line\n".getBytes());
            }
        }
        long unbufferedTime = System.currentTimeMillis() - start;
        
        // 测试缓冲字节流
        start = System.currentTimeMillis();
        try (BufferedOutputStream bos = new BufferedOutputStream(
                new FileOutputStream(testFile + "_buffered"))) {
            for (int i = 0; i < iterations; i++) {
                bos.write("Test line\n".getBytes());
            }
        }
        long bufferedTime = System.currentTimeMillis() - start;
        
        System.out.println("Unbuffered time: " + unbufferedTime + "ms");
        System.out.println("Buffered time: " + bufferedTime + "ms");
        System.out.println("Performance improvement: " + 
            (unbufferedTime / (double) bufferedTime) + "x");
        
        // 清理文件
        new File(testFile).delete();
        new File(testFile + "_buffered").delete();
    }
    
    // 工具方法
    public static void copyFileUsingByteStream(String source, String dest) throws IOException {
        try (FileInputStream fis = new FileInputStream(source);
             FileOutputStream fos = new FileOutputStream(dest)) {
            
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, bytesRead);
            }
            System.out.println("File copied successfully");
        }
    }
    
    public static void demonstrateByteBufferedStream(String fileName) throws IOException {
        System.out.println("--- Byte Buffered Stream ---");
        
        // 读取文件到字节数组
        try (BufferedInputStream bis = new BufferedInputStream(
                new FileInputStream(fileName))) {
            
            byte[] buffer = new byte[1024];
            int bytesRead = bis.read(buffer);
            String content = new String(buffer, 0, bytesRead, StandardCharsets.UTF_8);
            System.out.println("Buffered byte stream read: " + content.replace("\n", "\\n"));
        }
    }
}

// IO流的分类和特点
class IOStreamTypes {
    
    public static void showStreamHierarchy() {
        System.out.println("=== Java IO Stream Hierarchy ===");
        System.out.println("字节流 (Byte Streams):");
        System.out.println("├── InputStream (抽象基类)");
        System.out.println("│   ├── FileInputStream (文件字节输入流)");
        System.out.println("│   ├── BufferedInputStream (缓冲字节输入流)");
        System.out.println("│   ├── DataInputStream (数据字节输入流)");
        System.out.println("│   └── ObjectInputStream (对象字节输入流)");
        System.out.println("└── OutputStream (抽象基类)");
        System.out.println("    ├── FileOutputStream (文件字节输出流)");
        System.out.println("    ├── BufferedOutputStream (缓冲字节输出流)");
        System.out.println("    ├── DataOutputStream (数据字节输出流)");
        System.out.println("    └── ObjectOutputStream (对象字节输出流)");
        
        System.out.println("\n字符流 (Character Streams):");
        System.out.println("├── Reader (抽象基类)");
        System.out.println("│   ├── FileReader (文件字符输入流)");
        System.out.println("│   ├── BufferedReader (缓冲字符输入流)");
        System.out.println("│   ├── InputStreamReader (字节到字符转换流)");
        System.out.println("│   └── StringReader (字符串输入流)");
        System.out.println("└── Writer (抽象基类)");
        System.out.println("    ├── FileWriter (文件字符输出流)");
        System.out.println("    ├── BufferedWriter (缓冲字符输出流)");
        System.out.println("    ├── OutputStreamWriter (字符到字节转换流)");
        System.out.println("    └── StringWriter (字符串输出流)");
    }
}
```

### 🎯 什么是Java序列化？如何实现Java序列化？

**📋 标准话术**：

> "Java序列化是将对象转换为字节流的机制，反序列化是将字节流恢复为对象：
>
> **序列化定义**：
>
> - 将对象的状态信息转换为可以存储或传输的形式的过程
> - 主要用于对象持久化、网络传输、深拷贝等场景
> - Java通过ObjectOutputStream和ObjectInputStream实现
>
> **Serializable接口**：
>
> - 标记接口，没有方法需要实现
> - 表示该类的对象可以被序列化
> - 如果父类实现了Serializable，子类自动可序列化
> - 不实现此接口的类无法序列化，会抛NotSerializableException
>
> **serialVersionUID**：
>
> - 序列化版本号，用于验证序列化对象的兼容性
> - 如果不显式声明，JVM会自动生成
> - 类结构改变时，自动生成的UID会变化，导致反序列化失败
> - 建议显式声明，便于版本控制
>
> **序列化过程**：
>
> 1. 检查对象是否实现Serializable接口
> 2. 写入类元数据信息
> 3. 递归序列化父类信息
> 4. 写入实例字段数据（transient字段除外）
>
> **注意事项**：
>
> - static字段不会被序列化
> - transient字段会被忽略
> - 父类不可序列化时，需要无参构造器
> - 序列化可能破坏单例模式"

### 🎯 Serializable接口的作用？transient关键字？

**📋 标准话术**：

> "Serializable接口是Java序列化机制的核心：
>
> **Serializable接口作用**：
>
> - 标记接口，标识类可以被序列化
> - 启用序列化机制，允许对象转换为字节流
> - 提供版本控制支持（serialVersionUID）
> - 支持自定义序列化逻辑（writeObject/readObject）
>
> **transient关键字**：
>
> - 修饰字段，表示该字段不参与序列化
> - 反序列化时，transient字段会被初始化为默认值
> - 常用于敏感信息（密码）、计算字段、缓存数据
> - 可以通过自定义序列化方法重新赋值
>
> **自定义序列化**：
>
> - writeObject()：自定义序列化逻辑
> - readObject()：自定义反序列化逻辑
> - writeReplace()：序列化前替换对象
> - readResolve()：反序列化后替换对象（常用于单例）
>
> 序列化是Java的重要机制，但要注意性能和安全性问题。"

------



## 🆕 八、Java新特性（Modern Java）

> **核心思想**：Java 8引入了函数式编程特性，后续版本持续演进，提供了更简洁、高效的编程方式。

### 🎯 final、finally、finalize的区别？

**📋 标准话术**：

> "final、finally、finalize是Java中三个容易混淆的关键字，它们有完全不同的用途：
>
> **final关键字**：
>
> - 修饰符，用于限制继承、重写和重新赋值
> - 修饰类：类不能被继承（如String、Integer）
> - 修饰方法：方法不能被重写
> - 修饰变量：变量不能被重新赋值（常量）
> - 修饰参数：参数在方法内不能被修改
>
> **finally语句块**：
>
> - 异常处理机制的一部分，与try-catch配合使用
> - 无论是否发生异常都会执行（除非JVM退出）
> - 常用于资源清理（关闭文件、数据库连接等）
> - 执行优先级高于try-catch中的return语句
>
> **finalize()方法**：
>
> - Object类的一个方法，用于垃圾回收前的清理工作
> - 由垃圾收集器调用，不保证何时调用
> - Java 9后已标记为过时，不推荐使用
> - 应该使用try-with-resources或AutoCloseable替代
>
> 记忆口诀：final限制，finally保证，finalize清理。"

**💻 代码示例**：

```java
public class FinalFinallyFinalizeDemo {
    
    public static void main(String[] args) {
        // 1. final演示
        final int CONSTANT = 100;           // 常量不可变
        // CONSTANT = 200;                  // 编译错误
        
        final List<String> list = new ArrayList<>();
        list.add("Hello");                  // 引用不变，内容可变
        // list = new ArrayList<>();        // 编译错误
        
        // 2. finally演示
        try {
            System.out.println("try执行");
            return;                         // 即使return，finally也执行
        } finally {
            System.out.println("finally执行");  // 必定执行
        }
        
        // 3. finalize演示（已过时）
        MyResource resource = new MyResource();
        resource = null;
        System.gc();                        // 建议GC，finalize可能被调用
        
        // 4. 推荐替代方案：try-with-resources
        try (AutoCloseable res = new MyAutoCloseable()) {
            // 使用资源
        } catch (Exception e) {
            e.printStackTrace();
        }  // 自动关闭，无需finally
    }
}

// final类：不能被继承
final class ImmutableClass {
    public final void finalMethod() {      // final方法：不能重写
        System.out.println("不可重写的方法");
    }
}

// finalize示例（不推荐）
class MyResource {
    @Override
    protected void finalize() throws Throwable {
        System.out.println("finalize被调用");
        super.finalize();
    }
}

// 推荐的资源管理方式
class MyAutoCloseable implements AutoCloseable {
    @Override
    public void close() throws Exception {
        System.out.println("资源已关闭");
    }
}

/*
 * final、finally、finalize对比总结：
 * 
 * ┌──────────┬─────────────┬─────────────┬─────────────┬─────────────┐
 * │   特性   │    类型     │    用途     │   执行时机  │   推荐程度  │
 * ├──────────┼─────────────┼─────────────┼─────────────┼─────────────┤
 * │  final   │   关键字    │   限制修饰  │   编译时    │   强烈推荐  │
 * │ finally  │   语句块    │ 异常处理/清理│   运行时    │   推荐使用  │
 * │finalize  │    方法     │  垃圾回收   │ GC时(不确定) │   已弃用    │
 * └──────────┴─────────────┴─────────────┴─────────────┴─────────────┘
 * 
 * 使用场景：
 * - final: 不可变设计、常量定义、防止继承/重写
 * - finally: 资源清理、确保执行的代码
 * - finalize: 已弃用，使用AutoCloseable + try-with-resources
 * 
 * 最佳实践：
 * 1. 大量使用final提高代码安全性
 * 2. 用finally确保关键代码执行
 * 3. 避免finalize，改用AutoCloseable
 * 4. 利用try-with-resources自动资源管理
 */
```

### 🎯 Lambda表达式中使用外部变量，为什么要final？

**📋 标准话术**：

> "Lambda表达式中使用外部变量必须是final或effectively final，这是由Java的实现机制决定的：
>
> **为什么需要final**：
>
> - Lambda表达式本质上是匿名内部类的语法糖
> - 内部类访问外部变量时，实际是复制了变量的值
> - 如果允许修改，会导致内外部变量值不一致的问题
> - final保证了变量的一致性和线程安全
>
> **effectively final**：
>
> - 变量没有被显式声明为final，但事实上没有被修改
> - 编译器会自动识别这种情况
> - 这种变量也可以在Lambda中使用
>
> **解决方案**：
>
> - 使用数组或包装类来绕过限制
> - 使用AtomicInteger等原子类
> - 将变量提升为实例变量或静态变量
>
> 这个限制确保了Lambda表达式的安全性和一致性。"

### 🎯 Lambda表达式是什么？有什么优势？

**📋 标准话术**：

> "Lambda表达式是Java 8引入的重要特性，实现了函数式编程：
>
> **Lambda表达式**：
>
> - 本质是匿名函数，可以作为参数传递
> - 语法：(参数) -> {方法体}
> - 简化了匿名内部类的书写
> - 只能用于函数式接口（有且仅有一个抽象方法的接口）
>
> **Stream API**：
>
> - 提供了声明式的数据处理方式
> - 支持链式调用，代码更简洁
> - 内置并行处理能力
> - 常用操作：filter、map、reduce、collect等
>
> **Optional类**：
>
> - 解决空指针异常问题
> - 明确表示可能为空的值
> - 提供函数式风格的空值处理
>
> **函数式接口**：
>
> - @FunctionalInterface注解标记
> - 内置接口：Predicate、Function、Consumer、Supplier等
> - 支持方法引用语法
>
> 优势：代码更简洁、可读性更强、支持并行处理、函数式编程风格。"

**💻 代码示例**：

```java
import java.util.*;
import java.util.function.*;
import java.util.stream.*;

public class Java8FeaturesDemo {
    
    public static void main(String[] args) {
        // 1. Lambda表达式：简化匿名内部类
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        names.sort((a, b) -> a.length() - b.length());  // 按长度排序
        
        // 2. Stream API：函数式数据处理
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        List<Integer> result = numbers.stream()
            .filter(n -> n % 2 == 0)    // 筛选偶数
            .map(n -> n * n)            // 平方
            .collect(Collectors.toList()); // [4, 16]
        
        // 3. Optional：避免空指针
        Optional<String> optional = Optional.ofNullable("Hello");
        optional.ifPresent(System.out::println);        // 有值时执行
        String value = optional.orElse("Default");      // 无值时默认值
        
        // 4. 函数式接口：四大核心接口
        Predicate<Integer> isEven = n -> n % 2 == 0;    // 断言
        Function<String, Integer> getLength = String::length; // 函数
        Consumer<String> print = System.out::println;   // 消费者
        Supplier<Double> random = Math::random;         // 供应者
        
        // 5. 方法引用：四种形式
        names.forEach(System.out::println);             // 静态方法引用
        names.stream().map(String::length);             // 实例方法引用
        names.stream().map(String::new);                // 构造器引用
        names.stream().filter(String::isEmpty);         // 任意对象方法引用
    }
}

/*
 * Java 8核心特性总结：
 * 
 * 1. Lambda表达式：(参数) -> 表达式
 * 2. Stream API：数据处理管道
 * 3. Optional：空值安全
 * 4. 函数式接口：@FunctionalInterface
 * 5. 方法引用：类::方法
 */
```

### 🎯 有用过JDK17吗，有什么新特性？

JDK 17 是 Java 的长期支持版本（LTS），发布于 2021 年，带来了许多新特性和改进，以下是一些重要的更新：

1. **Sealed Classes（封闭类）**

JDK 17 引入了封闭类（Sealed Classes），它允许你限制哪些类可以继承或实现一个特定的类或接口。通过这种方式，开发者可以更好地控制继承结构。封闭类通过 `permits` 关键字指定哪些类可以继承。

```java
public abstract sealed class Shape permits Circle, Rectangle {
}
```

2. **Pattern Matching for Switch (预览)**

在 JDK 17 中，switch 语句的模式匹配功能被引入（作为预览功能）。这使得 switch 语句不仅可以根据值进行匹配，还可以根据类型进行匹配。以前的 switch 仅支持基本类型或枚举，而新特性扩展了其灵活性。

```java
static String formatterPatternSwitch(Object obj) {
    return switch (obj) {
        case Integer i -> String.format("int %d", i);
        case Long l    -> String.format("long %d", l);
        case String s  -> String.format("String %s", s);
        default        -> obj.toString();
    };
}
```

3. **Records（记录类型）增强**

Records 是 JDK 16 引入的特性，但在 JDK 17 中得到了进一步增强。Records 提供了一种简洁的方式来创建不可变的数据类，它自动生成构造函数、`equals()`、`hashCode()` 和 `toString()` 方法。

```java
public record Point(int x, int y) {}
```

4. **强封装的 Java 内部 API**

JDK 17 强化了对 Java 内部 API 的封装，默认情况下不再允许非公共 API 访问其他模块的内部 API。通过此特性，Java 模块化变得更加安全，防止非预期的依赖。

5. **Foreign Function & Memory API (外部函数和内存 API)**

JDK 17 通过新的外部函数和内存 API 预览功能，允许 Java 程序直接调用非 Java 代码（如本地代码）。这一特性极大增强了与原生系统库的集成能力。

```java
MemorySegment segment = MemorySegment.allocateNative(100);
```

6. **macOS 上的 AArch64 支持**

随着 Apple M1 处理器的推出，JDK 17 为 macOS 引入了对 AArch64 架构的支持。开发者现在可以在 macOS 的 ARM 平台上更高效地运行 Java 程序。

7. **Deprecation for Removal of RMI Activation**

RMI Activation（远程方法调用激活机制）已经被弃用并计划在未来移除。这一功能的移除是因为它在现代分布式系统中较少使用，并且存在更好的替代方案。

8. **Vector API (预览)**

JDK 17 进一步预览了 Vector API，允许在 Java 中进行向量运算。Vector API 利用 SIMD（单指令多数据）硬件指令，可以实现高性能的数学计算。这对科学计算和机器学习任务尤为重要。

```java
VectorSpecies<Float> SPECIES = FloatVector.SPECIES_256;
```

9. **简化的强制性 NullPointerException 信息**

JDK 17 改进了 `NullPointerException` 的错误信息，帮助开发者更快定位问题。例如，如果你访问空引用对象的字段，JDK 17 会明确指出是哪个字段导致了异常。

10. **默认垃圾回收器 ZGC 和 G1 的改进**

JDK 17 对 ZGC（Z Garbage Collector）和 G1 垃圾回收器进行了优化，以进一步降低垃圾收集的延迟，并提高应用程序的整体性能。

这些新特性和改进使得 JDK 17 成为一个功能丰富、性能优越的版本，特别适合长期支持和大规模企业级应用。

```java
// JDK17新特性示例
public class JDK17FeaturesDemo {
    
    public static void main(String[] args) {
        // 1. Switch表达式
        String dayType = switch (5) {
            case 1, 7 -> "Weekend";
            case 2, 3, 4, 5, 6 -> "Weekday";
            default -> "Invalid";
        };
        
        // 2. Text Blocks：多行字符串
        String json = """
            {
                "name": "张三",
                "age": 25,
                "city": "北京"
            }
            """;
        
        // 3. Pattern Matching：模式匹配
        Object obj = "Hello";
        if (obj instanceof String str && str.length() > 3) {
            System.out.println("长字符串: " + str.toUpperCase());
        }
        
        // 4. Records：数据类
        Person person = new Person("李四", 30);
        System.out.println(person.name() + " is " + person.age());
        
        // 5. Sealed Classes：密封类
        Shape circle = new Circle(5.0);
        double area = calculateArea(circle);
    }
    
    // Records自动生成构造器、getter、equals、hashCode、toString
    public record Person(String name, int age) {}
    
    // Sealed Classes：限制继承
    public static sealed interface Shape permits Circle, Rectangle {
        double area();
    }
    
    public static final class Circle implements Shape {
        private final double radius;
        public Circle(double radius) { this.radius = radius; }
        public double area() { return Math.PI * radius * radius; }
    }
    
    public static final class Rectangle implements Shape {
        private final double width, height;
        public Rectangle(double width, double height) {
            this.width = width; this.height = height;
        }
        public double area() { return width * height; }
    }
    
    // Pattern Matching with Sealed Classes
    public static double calculateArea(Shape shape) {
        return switch (shape) {
            case Circle c -> c.area();
            case Rectangle r -> r.area();
            // 密封类确保覆盖所有情况，无需default
        };
    }
}
```


---

## 🏆 面试准备速查表

### 📋 Java基础高频面试题清单

| **知识点**   | **核心问题**                   | **关键话术**                     | **代码要点**                   |
| ------------ | ------------------------------ | -------------------------------- | ------------------------------ |
| **面向对象** | 三大特性、抽象类vs接口、内部类 | 封装继承多态、is-a关系、访问控制 | 继承重写、接口实现、内部类访问 |
| **数据类型** | 基本类型vs包装类、==vs equals  | 栈堆存储、自动装箱、缓存机制     | Integer缓存、equals重写        |
| **字符串**   | String不可变性、三者区别       | 常量池、性能对比、线程安全       | StringBuilder使用、intern方法  |
| **异常处理** | 异常体系、处理机制、最佳实践   | 检查型vs非检查型、异常链         | try-with-resources、自定义异常 |

### 🎯 面试回答技巧

1. **STAR法则**：Situation（背景）→ Task（任务）→ Action（行动）→ Result（结果）
2. **层次递进**：基本概念 → 深入原理 → 实际应用 → 性能优化
3. **举例说明**：理论结合实际项目经验
4. **源码引用**：适当提及源码实现，体现深度

### ⚠️ 常见面试陷阱

- ⚠️ **概念混淆**：抽象类和接口的选择场景
- ⚠️ **性能陷阱**：String拼接、装箱拆箱的性能影响
- ⚠️ **空指针**：equals方法的参数顺序、null处理
- ⚠️ **异常滥用**：不要用异常控制业务流程



---

## 🏆 面试准备速查表

### 📋 Java基础高频面试题清单

| **知识点**   | **核心问题**                   | **关键话术**                     | **代码要点**                   |
| ------------ | ------------------------------ | -------------------------------- | ------------------------------ |
| **面向对象** | 三大特性、抽象类vs接口、内部类 | 封装继承多态、is-a关系、访问控制 | 继承重写、接口实现、内部类访问 |
| **数据类型** | 基本类型vs包装类、==vs equals  | 栈堆存储、自动装箱、缓存机制     | Integer缓存、equals重写        |
| **字符串**   | String不可变性、三者区别       | 常量池、性能对比、线程安全       | StringBuilder使用、intern方法  |
| **异常处理** | 异常体系、处理机制、最佳实践   | 检查型vs非检查型、异常链         | try-with-resources、自定义异常 |

### 🎯 面试回答技巧

1. **STAR法则**：Situation（背景）→ Task（任务）→ Action（行动）→ Result（结果）
2. **层次递进**：基本概念 → 深入原理 → 实际应用 → 性能优化
3. **举例说明**：理论结合实际项目经验
4. **源码引用**：适当提及源码实现，体现深度

### ⚠️ 常见面试陷阱

- ⚠️ **概念混淆**：抽象类和接口的选择场景
- ⚠️ **性能陷阱**：String拼接、装箱拆箱的性能影响
- ⚠️ **空指针**：equals方法的参数顺序、null处理
- ⚠️ **异常滥用**：不要用异常控制业务流程

