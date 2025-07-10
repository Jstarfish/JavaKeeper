---
title: Java 基础面试 
date: 2024-08-31
tags: 
 - Java
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

### JDK 和 JRE、 JVM

- JDK（Java Development Kit）是 Java 开发工具包，包括了 Java 运行环境 JRE、Java 工具和 Java 基础类库。

- JRE（Java Runtime Environment）是运行 Java 程序所必须的环境的集合，包含 JVM 标准实现及 Java 核心类库。

- JVM（Java Virtual Machine）是 Java 虚拟机的缩写，是整个 Java 实现跨平台的最核心的部分，能够运行以Java 语言写作的软件程序。



### Class 和 Object 的区别

Class这个Java类保存的是一个Java类的元信息，一般在反射中使用。可以通过Class类型来获取其他类型的元数据（metadata），比如字段，属性，构造器，方法等等，可以获取并调用。

Object类，是所有Java类的根。它包括Class类。

> 类是对象的模板，对象是类的具体实例，对象依据类而产生



### 对比 Exception 和 Error，另外，运行时异常与一般异常有什么区别？

Exception 和 Error 都是继承了 Throwable 类，在 Java 中只有 Throwable 类型的实例才可以被抛出（throw）或者捕获（catch），它是异常处理机制的基本组成类型。

Exception 和 Error 体现了 Java 平台设计者对不同异常情况的分类。Exception 是程序正常运行中，可以预料的意外情况，可能并且应该被捕获，进行相应处理。

Error 是指在正常情况下，不大可能出现的情况，绝大部分的 Error 都会导致程序（比如 JVM 自身）处于非正常的、不可恢复状态。既然是非正常情况，所以不便于也不需要捕获，常见的比如 OutOfMemoryError 之类，都是 Error 的子类。

Exception 又分为**可检查**（checked）异常和**不检查**（unchecked）异常，可检查异常在源代码里必须显式地进行捕获处理，这是编译期检查的一部分。前面我介绍的不可查的 Error，是 Throwable 不是 Exception。

不检查异常就是所谓的运行时异常，类似 NullPointerException、ArrayIndexOutOfBoundsException 之类，通常是可以编码避免的逻辑错误，具体根据需要来判断是否需要捕获，并不会在编译期强制要求。

> 1. **检查异常（Checked Exception）**
>
> 检查异常是指在编译时必须处理的异常，通常是程序外部因素导致的异常，例如 I/O 操作、网络问题等。
>
> - **`IOException`**：输入/输出操作异常，通常出现在文件读写、网络通信等场景。
>   - 常见子类：
>     - `FileNotFoundException`：文件未找到。
>     - `EOFException`：文件或数据流末尾异常。
>     - `MalformedURLException`：URL格式错误。
> - **`SQLException`**：与数据库操作相关的异常。
>   - 常见场景：数据库连接失败、SQL语法错误等。
> - **`ClassNotFoundException`**：尝试加载类时找不到该类的异常。
>   - 常见场景：动态加载类（如反射）时，指定的类没有在类路径中找到。
> - **`FileNotFoundException`**：尝试打开一个不存在的文件时抛出的异常。
> - **`ParseException`**：解析字符串时格式不正确抛出的异常。
>   - 常见场景：日期时间解析、数字解析等。
> - **`InterruptedException`**：线程在执行时被中断时抛出的异常。
>   - 常见场景：线程等待、休眠、阻塞等操作中。
>
> 2. **运行时异常（Runtime Exception）**
>
> 运行时异常是指在程序运行时可能发生的异常，通常是由逻辑错误引起的，不需要强制捕获。
>
> - **`NullPointerException`**：空指针异常，指向 `null` 的对象调用方法或访问字段时会抛出此异常。
> - **`ArrayIndexOutOfBoundsException`**：数组下标越界异常，访问数组时使用了无效的索引。
> - **`ArithmeticException`**：算术异常，通常发生在数学计算过程中，常见场景：除以零（`x / 0`）等。
> - **`ClassCastException`**：类型转换异常，在执行类型转换时，如果类型不兼容就会抛出此异常。
>   - 常见场景：将对象强制转换为不兼容的类型。
> - **`IllegalArgumentException`**：非法参数异常，方法传入了不合法的参数值。
>   - 常见场景：方法参数值无效，如负数传递给需要正数的参数。
> - **`IllegalStateException`**：方法调用在当前状态下无效时抛出的异常。
>   - 常见场景：调用一个必须在特定状态下执行的方法时抛出。
> - **`NumberFormatException`**：数字格式化异常，尝试将一个不合法的字符串转换为数字时抛出。
>   - 常见场景：将字母或特殊符号的字符串转为整数、浮点数等。
> - **`IndexOutOfBoundsException`**：访问一个非法索引位置时抛出的异常，通常用于集合类。
>   - 常见场景：访问 `List` 或 `String` 时超出有效范围。
> - **`ConcurrentModificationException`**：并发修改异常，当一个集合被结构性修改时，另一个线程遍历该集合时会抛出此异常。
>
> 3. **错误（Error）**
>
> 错误表示 JVM 无法处理的严重问题，通常是无法恢复的，程序应该避免直接捕获这些异常。
>
> - **`OutOfMemoryError`**：JVM 内存溢出错误，表示堆内存或永久代内存不足。
>   - 常见场景：程序申请的内存超过了 JVM 配置的最大内存。
> - **`StackOverflowError`**：栈溢出错误，通常是递归调用没有终止条件导致的栈空间不足。
>   - 常见场景：无限递归导致栈空间耗尽。
> - **`VirtualMachineError`**：JVM 内部发生了无法处理的错误，通常由虚拟机或环境问题引起。
> - **`NoClassDefFoundError`**：JVM 无法找到某个类的定义。
>   - 常见场景：类路径没有包含需要加载的类文件。



### 类和对象的区别

类是一类物体的共同特性的抽象，对象是类的一个实例.

通俗的说:把某一类物品共有的特征,或者属性组装起来就是一个类. 能够具体到物品或者个体就是对象.



### 你是如何理解面向对象的

在我理解,面向对象是一种“万物皆对象”的编程思想

面向对象 ( Object Oriented ) 是将现实问题构建关系，然后抽象成 **类 ( class )**，给类定义属性和方法后，再将类实例化成 **实例 ( instance )** ，通过访问实例的属性和调用方法来进行使用。

类具有基本特征：封装、继承、多态、抽象

设计原则：

| 原则         | 核心思想                     | 典型应用                                          |
| ------------ | ---------------------------- | ------------------------------------------------- |
| **单一职责** | 一个类只做一件事             | 拆分`UserManager`为`AuthService`+`ProfileService` |
| **开闭原则** | 对扩展开放，对修改关闭       | 通过策略模式实现支付方式扩展                      |
| **里氏替换** | 子类不破坏父类契约           | `Bird`类不应继承`Penguin`（企鹅不会飞）           |
| **接口隔离** | 多个专用接口优于单一臃肿接口 | 拆分`Animal`为`Flyable`/`Swimmable`               |
| **依赖倒置** | 依赖抽象而非实现             | 订单模块通过`PaymentGateway`接口调用支付          |



### 构造方法和普通方法的区别

构造函数的方法名和类型相同、没有返回值类型、不能写 return，是给对象初始化用的，创建对象的时候就会初始化，执行唯一的一次构造方法，系统会默认添加一个无参的构造方法

普通方法是对象调用才能执行，可被多次调用。

**构造器Constructor是否可被override**

构造器Constructor不能被继承，因此不能重写Override，但可以被重载Overload。



### 作用域public，private，protected，以及不写时的区别

在Java中，作用域（也称为访问修饰符）决定了类、方法、变量或其他成员的可见性。Java提供了四种作用域：`public`、`private`、`protected`，以及默认（不写时）的作用域。以下是它们的区别：

1. **public（公共的）**：
   - `public` 成员可以被任何其他类访问，无论它们位于哪个包中。
   - `public` 类可以被任何其他类实例化。
   - `public` 接口或方法可以被任何外部类实现或调用。
2. **private（私有的）**：
   - `private` 成员只能在其所在的类内部访问。
   - `private` 成员不能被同一个包中的其他类访问，更不能被不同包中的类访问。
   - `private` 成员是封装性原则的一部分，用于隐藏类的内部实现细节。
3. **protected（受保护的）**：
   - `protected` 成员可以被同一个包中的其他类访问，也可以被不同包中的子类访问（继承），不同包中的非子类不可访问。
   - `protected` 成员提供了比 `private` 更宽的访问范围，但比 `public` 窄。
4. **默认（不写时）**：
   - 当你没有指定任何访问修饰符时，成员具有默认（也称为包级私有）作用域。
   - 默认作用域的成员只能被同一个包中的其他类访问，不能被不同包中的类访问。
5. **接口中的成员**：
   - 接口中的所有成员默认都是 `public` 的，并且隐式地标记为 `static` 和 `final`（除非被声明为 `default` 方法）。
6. **类的作用域**：
   - 类的访问修饰符决定了该类是否可以被其他类实例化。
   - `public` 类可以被任何其他类实例化。
   - 默认（包级私有）类只能被同一个包中的其他类实例化。
7. **内部类的作用域**：
   - 内部类的访问修饰符决定了外部类是否可以访问内部类。

在设计类和成员时，应根据需要选择合适的作用域，以确保适当的封装和访问控制。通常，应尽可能使成员的可见性最小化，以提高代码的安全性和可维护性。



### Integer 与 int 的区别

在 Java 中，`int` 和 `Integer` 都是用来表示整数的，但它们有本质的区别：

1. **基本类型 vs. 包装类**

- `int` 是 Java 的**基本数据类型**，用于直接存储整数值。
- `Integer` 是 Java 提供的**包装类**（属于 `java.lang` 包），用于将基本类型 `int` 封装成对象，以便在需要对象的场景中使用。

2. **存储方式**

- `int` 直接存储数值，属于**值类型**，存储在栈内存中，访问速度快，内存占用小。
- `Integer` 是对象，属于**引用类型**，它存储的是对堆内存中实际对象的引用。相比 `int`，`Integer` 对象占用的内存更大，访问稍慢。

3. **默认值**

- `int` 的默认值为 `0`。
- `Integer` 的默认值为 `null`（因为它是对象，可以为空）。

4. **用途**

- `int` 适用于基本的数值计算，是最常用的数据类型之一。
- `Integer` 在需要对象的地方使用，比如集合类（如 `List`、`Map`）中，因为集合只支持对象类型而不支持基本数据类型。

5. **自动装箱与拆箱**

- 从 Java 5 开始，Java 支持自动装箱和自动拆箱，可以在 自动转换：

  - **装箱**：将 `int` 自动转换为 `Integer` 对象。
  - **拆箱**：将 `Integer` 对象自动转换为 `int`。

  ```java
  Integer integerObj = 5;  // 自动装箱，将 int 转换为 Integer
  int num = integerObj;    // 自动拆箱，将 Integer 转换为 int
  ```

6. **比较**

- `int` 直接比较数值。
- `Integer` 使用 `equals` 比较值，但直接使用 `==` 比较时，会比较两个对象的引用地址，可能导致预期之外的结果。

7. **缓存机制**

- `Integer` 在 `-128` 到 `127` 范围内的值会缓存，这个范围内的数值会复用相同的对象，因此在此范围内的 `Integer` 值用 `==` 比较可能为 `true`，但超出此范围的对象用 `==` 比较为 `false`。

  > **缓存范围内的值**：当两个 `Integer` 对象都是通过自动装箱从 `-128` 到 `127` 范围内的整数创建的，并且它们的整数值相同时，这两个对象实际上是相同的对象引用。例如：
  >
  > ```java
  > Integer a = 100;
  > Integer b = 100;
  > System.out.println(a == b); // 输出 true
  > ```
  >
  > **不同缓存范围的值**：如果两个 `Integer` 对象的整数值不在 `-128` 到 `127` 的缓存范围内，那么每次自动装箱都会创建一个新的 `Integer` 对象，因此它们不会是相同的对象引用。例如：
  >
  > ```java
  > Integer c = 128;
  > Integer d = 128;
  > System.out.println(c == d); // 输出 false
  > ```
  >
  > **不同时间创建的对象**：即使两个 `Integer` 对象的数值相同，但如果它们是在不同时间通过显式创建或者自动装箱得到的，那么它们也不会是相同的对象引用。例如：
  >
  > ```java
  > Integer e = new Integer(100);
  > Integer f = new Integer(100);
  > System.out.println(e == f); // 输出 false
  > ```



### int float short double long char 占字节数？

java实现了平台无关，所以所有的基本数据类型字长和机器字长无关，即32位和64位一样，但是引用（地址）与机器字长有关。

| 数据类型 | 32位计算机 | 64位计算机 | 取值范围                          |
| -------- | ---------- | ---------- | --------------------------------- |
| byte     | 1          | 1          | -128~127                          |
| char     | 2          | 2          |                                   |
| short    | 2          | 2          | (-2)的15次方 ~ (2的15次方) - 1    |
| int      | 4          | 4          | -2^31 ~ 2^31 - 1                  |
| long     | 8          | 8          | 即 (-2)的63次方 ~ (2的63次方) - 1 |
| float    | 4          | 4          |                                   |
| double   | 8          | 8          |                                   |
| 引用     | 4          | 8          |                                   |



### 基本类型和包装类型的区别

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

2. 基本类型比包装类型更高效

   基本类型在栈中直接存储的具体数值，而包装类型则存储的是堆中的引用。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/29/16d7a5686ac8c66b~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)



很显然，相比较于基本类型而言，包装类型需要占用更多的内存空间。假如没有基本类型的话，对于数值这类经常使用到的数据来说，每次都要通过 new 一个包装类型就显得非常笨重。

3. 两个包装类型的值可以相同，但却不相等

4. 自动装箱和自动拆箱

   既然有了基本类型和包装类型，肯定有些时候要在它们之间进行转换。把基本类型转换成包装类型的过程叫做装箱（boxing）。反之，把包装类型转换成基本类型的过程叫做拆箱（unboxing）

5. **包装类型的缓存机制**

   - **范围**：部分包装类缓存常用值（如`Integer`缓存-128~127）

   - ```java
     Integer a = 127;
     Integer b = 127;
     System.out.println(a == b); // true（同一缓存对象）
     
     Integer c = 128;
     Integer d = 128;
     System.out.println(c == d); // false（新创建对象）
     ```



### &和&&的区别

&和&&都可以用作**逻辑与**的运算符，表示逻辑与（and），当运算符两边的表达式的结果都为 true 时，整个运算结果才为 true，否则，只要有一方为 false，则结果为 false。

&& 还具有**短路**的功能，即如果第一个表达式为 false，则不再计算第二个表达式

&还可以用作**位运算符**，当&操作符两边的表达式不是boolean类型时，&表示按位与操作，我们通常使用0x0f来与一个整数进行&运算，来获取该整数的最低4个bit位，例如，0x31 & 0x0f的结果为0x01。  



### 全局变量、局部变量、静态变量和实例变量的区别

全局变量：也叫成员变量，是指在类中定义的变量，它在整个类中都有效。全局变量的定义一般是在类的最上方，在所有方法的外部的位置处定义。

全局变量又可分为：类变量（静态变量）和实例变量（对象变量）。

实例变量也叫对象变量，这种变量是在类声明的内部但是在类的其他成员方法之外声明的。类的每个对象维护它自己的一份实例变量的副本。

注意：实例变量被定义在类中但在任何方法之外。并且 New 出来后均被初始化，也就是说没有显示初始化的，都被赋予了默认值。

类变量也叫静态变量，也就是在实例变量前加了static 的变量。一般被用来声明常量。（至于static这个关键字的详细使用，这里就不在详细叙述）



### 类变量与实例变量的区别

在语法定义上的区别：静态变量前要加static关键字，而实例变量前则不加。

在程序运行时的区别：**实例变量属于某个对象的属性**，必须创建了实例对象，其中的实例变量才会被分配空间，才能使用这个实例变量。**静态变量不属于某个实例对象，而是属于类**，所以也称为类变量，只要程序加载了类的字节码，不用创建任何实例对象，静态变量就会被分配空间，静态变量就可以被使用了。总之，**实例变量必须创建对象后才可以通过这个对象来使用，静态变量则可以直接使用类名来引用**。

  类变量是所有该类的实例化对象所共有的资源，其中一个对象将它值改变，其他对象得到的就是改变后的结果；而实例变量则属对象私有，某一个对象将其所包含的实例变量的值改变，不影响其他对象中实例变量的值；

**局部变量**，由声明在某方法，或某代码段里（比如for循环）。执行到它的时候直接在栈中开辟内存并使用的。当局部变量脱离作用域，存放该作用域的栈指针，栈顶与栈底重合即为释放内存，速度是非常快的。



### "=="和equals区别

==操作符专门用来比较两个变量的值是否相等，也就是用于比较变量所对应的内存中所存储的数值是否相同，要比较两个基本类型的数据或两个引用变量是否相等，只能用\==操作符。

equals 方法是用于比较两个独立对象的内容是否相同，就好比去比较两个人的长相是否相同，它比较的两个对象是独立的。

如果一个类没有自己定义equals方法，那么它将继承Object类的equals方法，Object类的equals方法的实现代码如下：

```JAVA
boolean equals(Object o){
	return this==o;
}
```

这说明，如果一个类没有自己定义equals方法，它默认的equals方法（从Object 类继承的）就是使用==操作符，也是在比较两个变量指向的对象是否是同一对象，这时候使用equals和使用\==会得到同样的结果，如果比较的是两个独立的对象则总返回false。如果你编写的类希望能够比较该类创建的两个实例对象的内容是否相同，那么你必须覆盖equals方法，由你自己写代码来决定在什么情况即可认为两个对象的内容是相同的。



### String s = new String("xyz");创建了几个String Object? 二者之间有什么区别？

两个或一个，”xyz”对应一个对象，这个对象放在字符串常量缓冲区，常量”xyz”不管出现多少遍，都是缓冲区中的那一个。New String每写一遍，就创建一个新的对象，它一句那个常量”xyz”对象的内容来创建出一个新String对象。如果以前就用过’xyz’，这句代表就不会创建”xyz”自己了，直接从缓冲区拿。



### String 和StringBuffer的区别

String和StringBuffer，它们都可以储存和操作字符串，即包含多个字符的字符数据。

不同之处在于: 感觉就像是变量和常量的区别，StringBuffer对象的内容可以修改，而Sring对象一旦产生就不可以被修改，重新赋值的话，其实就是 两个对象了。典型地，你可以使用StringBuffer来动态构造字符数据。

另外，String实现了equals方法，new String(“abc”).equals(new String(“abc”)的结果为true,而StringBuffer没有实现equals方法，所以，new StringBuffer(“abc”).equals(new StringBuffer(“abc”)的结果为false。

SringBuffer进行字符串处理时，不生成新的对象，内存占得少，所以实际使用中，要经常对字符串进行修改，插入删除等，用StringBufer更合适，还有一个StringBuilde，是线程不安全的，可能快点。

String覆盖了equals方法和hashCode方法，而StringBuffer没有覆盖equals方法和hashCode方法，所以，将StringBuffer对象存储进Java集合类中时会出现问题。



### final, finally, finalize的区别

final 用于声明属性，方法和类，分别表示属性不可变，方法不可覆盖，类不可继承。

内部类要访问局部变量，局部变量必须定义成final类型。

finally是异常处理语句结构的一部分，表示总是执行。 

finalize是Object类的一个方法，在垃圾收集器执行的时候会调用被回收对象的此方法，可以覆盖此方法提供垃圾收集时的其他资源回收，例如关闭文件等。JVM不保证此方法总被调用



### Java中finally语句块的深度解析(try catch finally的执行顺序)

1、除了以下2种情况外，不管有木有出现异常，finally块中代码都会执行；

①程序未进入try{}块的执行，如在try之前出现运行时异常，程序终止。

②程序进入到try{}和catch{}块的执行，但是在try{}或者catch{}块碰到了System.exit(0)语句，jvm直接退出。 finally{}块不会执行

2、当try和catch中有return时，finally仍然会执行；

3、**finally是在return后面的表达式运算后执行的**（此时并没有返回运算后的值，而是先把要返回的值的引用地址保存起来，而不管finally中的代码怎么样，最后返回的都是这个引用地址（或者说这个引用地址指向的对象），而这个返回值在finally中会被不会被改变要分以下2种情况）。

①若这个返回值是基本数据类型（int,double）或者不可变类对象（如String,Integer），

②则不管finally中的代码怎么样，返回的值都不会改变，仍然是之前保存的值，若这个值是可变类对象），所以函数返回值是在finally执行前确定的；

4、**finally中最好不要包含return，否则程序会提前退出，返回值不是try或catch中保存的返回值，而是finally中的return值**。



### Overload和Override的区别

Overload是重载的意思，Override是覆盖的意思，也就是重写。

重载Overload表示同一个类中可以有多个名称相同的方法，但这些方法的参数列表各不相同（即参数个数或类型不同）。

重写Override表示子类中的方法可以与父类中的某个方法的名称和参数完全相同，通过子类创建的实例对象调用这个方法时，将调用子类中的定义方法，这相当于把父类中定义的那个完全相同的方法给覆盖了，这也是面向对象编程的多态性的一种表现。子类覆盖父类的方法时，只能比父类抛出更少的异常，或者是抛出父类抛出的异常的子异常，因为子类可以解决父类的一些问题，不能比父类有更多的问题。子类方法的访问权限只能比父类的更大，不能更小。如果父类的方法是private类型，那么，子类则不存在覆盖的限制，相当于子类中增加了一个全新的方法。



### ceil、floor、round的区别

Math类中提供了三个与取整有关的方法：ceil、floor、round，这些方法的作用与它们的英文名称的含义相对应，例如，ceil的英文意义是天花板，该方法就表示向上取整，Math.ceil(11.3)的结果为12,Math.ceil(-11.3)的结果是-11；floor的英文意义是地板，该方法就表示向下取整，Math.ceil(11.6)的结果为11,Math.ceil(-11.6)的结果是-12；最难掌握的是round方法，它表示“四舍五入”，算法为Math.floor(x+0.5)，即将原来的数字加上0.5后再向下取整，所以，Math.round(11.5)的结果为12，Math.round(-11.5)的结果为-11。 



### 抽象类和接口的对比

抽象类是用来捕捉子类的通用特性的。接口是抽象方法的集合。

从设计层面来说，抽象类是对类的抽象，是一种模板设计，接口是行为的抽象，是一种行为的规范。

**相同点**

- 接口和抽象类都不能实例化
- 都位于继承的顶端，用于被其他实现或继承
- 都包含抽象方法，其子类都必须覆写这些抽象方法

**不同点**

| 参数       | 抽象类                                                       | 接口                                                         |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 声明       | 抽象类使用abstract关键字声明                                 | 接口使用interface关键字声明                                  |
| 实现       | 子类使用extends关键字来继承抽象类。如果子类不是抽象类的话，它需要提供抽象类中所有声明的方法的实现 | 子类使用implements关键字来实现接口。它需要提供接口中所有声明的方法的实现 |
| 构造器     | 抽象类可以有构造器                                           | 接口不能有构造器                                             |
| 访问修饰符 | 抽象类中的方法可以是任意访问修饰符                           | 接口方法默认修饰符是public。并且不允许定义为 private 或者 protected |
| 多继承     | 一个类最多只能继承一个抽象类                                 | 一个类可以实现多个接口                                       |
| 字段声明   | 抽象类的字段声明可以是任意的                                 | 接口的字段默认都是 static 和 final 的                        |

**备注**：Java8中接口中引入默认方法和静态方法，以此来减少抽象类和接口之间的差异。

现在，我们可以为接口提供默认实现的方法了，并且不用强制子类来实现它。

接口和抽象类各有优缺点，在接口和抽象类的选择上，必须遵守这样一个原则：

- 行为模型应该总是通过接口而不是抽象类定义，所以通常是优先选用接口，尽量少用抽象类。
- 选择抽象类的时候通常是如下情况：需要定义子类的行为，又要为子类提供通用的功能。

 

### 什么是java序列化，如何实现java序列化？或者请解释Serializable接口的作用

无论何种类型的数据，都是以二进制的形式在网络上传送，为了由一个进程把Java对象发送给另一个进程，需要把其转换为字节序列才能在网络上传送，把JAVA对象转换为字节序列的过程就称为对象的序列化，将字节序列恢复成Java对象的过程称为对象的反序列化

只有实现了 serializable接口的类的对象才能被序列化 

例如，在web开发中，如果对象被保存在了Session中，tomcat在重启时要把Session对象序列化到硬盘，这个对象就必须实现Serializable接口。如果对象要经过分布式系统进行网络传输或通过rmi等远程调用，这就需要在网络上传输对象，被传输的对象就必须实现Serializable接口。



### java中有几种类型的流？JDK为每种类型的流提供了一些抽象类以供继承，请说出他们分别是哪些类？

字节流，字符流。

字节流继承于InputStream OutputStream，

字符流继承于InputStreamReader OutputStreamWriter。

在java.io包中还有许多其他的流，主要是为了提高性能和使用方便。



### 字节流与字符流的区别

要把一片二进制数据数据逐一输出到某个设备中，或者从某个设备中逐一读取一片二进制数据，不管输入输出设备是什么，我们要用统一的方式来完成这些操作，用一种抽象的方式进行描述，这个抽象描述方式起名为IO流，对应的抽象类为OutputStream和InputStream ，不同的实现类就代表不同的输入和输出设备，它们都是针对字节进行操作的。

在应用中，经常要完全是字符的一段文本输出去或读进来，用字节流可以吗？计算机中的一切最终都是二进制的字节形式存在。对于“中国”这些字符，首先要得到其对应的字节，然后将字节写入到输出流。读取时，首先读到的是字节，可是我们要把它显示为字符，我们需要将字节转换成字符。由于这样的需求很广泛，人家专门提供了字符流的包装类。

 底层设备永远只接受字节数据，有时候要写字符串到底层设备，需要将字符串转成字节再进行写入。字符流是字节流的包装，字符流则是直接接受字符串，它内部将串转成字节，再写入底层设备，这为我们向IO设别写入或读取字符串提供了一点点方便。

 字符向字节转换时，要注意编码的问题，因为字符串转成字节数组，

 其实是转成该字符的某种编码的字节形式，读取也是反之的道理。



### 获得一个类的类对象有哪些方式？

- 方法1：类型.class，例如：String.class
- 方法2：对象.getClass()，例如："hello".getClass()
- 方法3：Class.forName()，例如：Class.forName("java.lang.String")



### 如何通过反射创建对象？

- 方法1：通过类对象调用newInstance()方法，例如：String.class.newInstance()
- 方法2：通过类对象的getConstructor()或getDeclaredConstructor()方法获得构造器（Constructor）对象并调用其newInstance()方法创建对象，例如：String.class.getConstructor(String.class).newInstance("Hello");



### break ,continue ,return 的区别及作用

break 跳出总上一层循环，不再执行循环(结束当前的循环体)

continue 跳出本次循环，继续执行下次循环(结束正在执行的循环 进入下一个循环条件)

return 程序返回，不再执行下面的代码(结束当前的方法 直接返回)



### hashCode 与 equals (重要)

> HashSet如何检查重复
>
> 两个对象的 hashCode() 相同，则 equals() 也一定为 true，对吗？
>
> hashCode和equals方法的关系
>
> 面试官可能会问你：“你重写过 hashcode 和 equals 么，为什么重写equals时必须重写hashCode方法？”

`hashCode` 和 `equals` 是两个非常重要的方法，它们在对象比较和哈希表（如`HashMap`、`HashSet`等）中扮演着关键角色

**hashCode()介绍**

hashCode() 的作用是获取哈希码，也称为散列码；它实际上是返回一个int整数。这个哈希码的作用是确定该对象在哈希表中的索引位置。hashCode() 定义在JDK的Object.java中，这就意味着Java中的任何类都包含有hashCode()函数。

散列表存储的是键值对(key-value)，它的特点是：能根据“键”快速的检索出对应的“值”。这其中就利用到了散列码！（可以快速找到所需要的对象）

**为什么要有 hashCode**

**我们以“HashSet 如何检查重复”为例子来说明为什么要有 hashCode**：

当你把对象加入 HashSet 时，HashSet 会先计算对象的 hashcode 值来判断对象加入的位置，同时也会与其他已经加入的对象的 hashcode 值作比较，如果没有相符的hashcode，HashSet会假设对象没有重复出现。但是如果发现有相同 hashcode 值的对象，这时会调用 equals()方法来检查 hashcode 相等的对象是否真的相同。如果两者相同，HashSet 就不会让其加入操作成功。如果不同的话，就会重新散列到其他位置。（摘自我的Java启蒙书《Head first java》第二版）。这样我们就大大减少了 equals 的次数，相应就大大提高了执行速度。

**hashCode()与equals()的相关规定**

如果两个对象相等，则hashcode一定也是相同的

两个对象相等，对两个对象分别调用equals方法都返回true

两个对象有相同的hashcode值，它们也不一定是相等的

**因此，equals 方法被覆盖过，则 hashCode 方法也必须被覆盖**

hashCode() 的默认行为是对堆上的对象产生独特值。如果没有重写 hashCode()，则该 class 的两个对象无论如何都不会相等（即使这两个对象指向相同的数据）

### 为什么重写了equals()，还要重写hashCode()？

当一个类的对象用作哈希表的键时，这两个方法必须同时被正确地重写。如果只重写`equals`而不重写`hashCode`，那么在哈希表中查找对象时可能会出现问题，因为哈希表依赖于`hashCode`来快速定位对象，而`equals`用于确认找到的对象是否是期望的对象。如果两个对象相等，但它们的哈希码不同，那么它们将被存储在哈希表的不同位置，导致无法通过`equals`找到对象。



### 深拷贝、浅拷贝区别?

在 Java（以及许多编程语言）中，**深拷贝**和**浅拷贝**是两种常见的对象拷贝方式，它们的区别主要在于对象及其内部引用对象的复制行为：

- 浅拷贝会**复制对象本身**及其**直接字段**，但对于对象中的引用类型字段（如数组或其他对象），仅复制引用地址，而不会复制引用的实际对象

- 深拷贝是指创建一个新对象，其字段值与原始对象相同，并且对于原始对象中引用的其他对象，深拷贝也会创建这些对象的副本。这意味着新对象和原始对象完全独立，没有任何共享的引用

  除了重写 `clone` 方法外，还可以通过以下方式实现深拷贝：

  1. **序列化和反序列化**： 使用 `ObjectOutputStream` 和 `ObjectInputStream` 进行深拷贝。
  2. **第三方工具**： 使用 Apache Commons Lang 的 `SerializationUtils` 等工具简化深拷贝实现



### BIO,NIO,AIO 有什么区别?

简答

- BIO：Block IO 同步阻塞式 IO，就是我们平常使用的传统 IO，它的特点是模式简单使用方便，并发处理能力低。
- NIO：Non IO 同步非阻塞 IO，是传统 IO 的升级，客户端和服务器端通过 Channel（通道）通讯，实现了多路复用。
- AIO：Asynchronous IO 是 NIO 的升级，也叫 NIO2，实现了异步非堵塞 IO ，异步 IO 的操作基于事件和回调机制。

详细回答

- **BIO (Blocking I/O):** 同步阻塞I/O模式，数据的读取写入必须阻塞在一个线程内等待其完成。在活动连接数不是特别高（小于单机1000）的情况下，这种模型是比较不错的，可以让每一个连接专注于自己的 I/O 并且编程模型简单，也不用过多考虑系统的过载、限流等问题。线程池本身就是一个天然的漏斗，可以缓冲一些系统处理不了的连接或请求。但是，当面对十万甚至百万级连接的时候，传统的 BIO 模型是无能为力的。因此，我们需要一种更高效的 I/O 处理模型来应对更高的并发量。
- **NIO (New I/O):** NIO是一种同步非阻塞的I/O模型，在Java 1.4 中引入了NIO框架，对应 java.nio 包，提供了 Channel , Selector，Buffer等抽象。NIO中的N可以理解为Non-blocking，不单纯是New。它支持面向缓冲的，基于通道的I/O操作方法。 NIO提供了与传统BIO模型中的 `Socket` 和 `ServerSocket` 相对应的 `SocketChannel` 和 `ServerSocketChannel` 两种不同的套接字通道实现,两种通道都支持阻塞和非阻塞两种模式。阻塞模式使用就像传统中的支持一样，比较简单，但是性能和可靠性都不好；非阻塞模式正好与之相反。对于低负载、低并发的应用程序，可以使用同步阻塞I/O来提升开发速率和更好的维护性；对于高负载、高并发的（网络）应用，应使用 NIO 的非阻塞模式来开发
- **AIO (Asynchronous I/O):** AIO 也就是 NIO 2。在 Java 7 中引入了 NIO 的改进版 NIO 2,它是异步非阻塞的IO模型。异步 IO 是基于事件和回调机制实现的，也就是应用操作之后会直接返回，不会堵塞在那里，当后台处理完成，操作系统会通知相应的线程进行后续的操作。AIO 是异步IO的缩写，虽然 NIO 在网络操作中，提供了非阻塞的方法，但是 NIO 的 IO 行为还是同步的。对于 NIO 来说，我们的业务线程是在 IO 操作准备好时，得到通知，接着就由这个线程自行进行 IO 操作，IO操作本身是同步的。查阅网上相关资料，我发现就目前来说 AIO 的应用还不是很广泛，Netty 之前也尝试使用过 AIO，不过又放弃了。



### 实例方法和静态方法有什么不一样?

| **对比维度**     | **实例方法**                                     | **静态方法**                                 |
| ---------------- | ------------------------------------------------ | -------------------------------------------- |
| **归属**         | 属于对象，需实例化后调用（`new Obj().method()`） | 属于类，直接通过类名调用（`Class.method()`） |
| **内存分配**     | 堆内存（对象创建时）                             | 方法区（类加载时）                           |
| **调用方式**     | `对象.方法名()`                                  | `类名.方法名()`                              |
| **访问实例成员** | 允许                                             | 禁止                                         |
| **多态支持**     | 支持重写（Override），运行时绑定                 | 不支持重写，可隐藏父类同名静态方法（Hide）   |
| **适用场景**     | 对象状态操作、工厂模式                           | 工具类、单例模式、无状态计算                 |



## 反射

### 什么是反射机制？

JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能称为java语言的反射机制。

静态编译和动态编译

- **静态编译：**在编译时确定类型，绑定对象
- **动态编译：**运行时确定类型，绑定对象

### 反射机制优缺点

- **优点：** 运行期类型的判断，动态加载类，提高代码灵活度。
- **缺点：** 性能瓶颈：反射相当于一系列解释操作，通知 JVM 要做的事情，性能比直接的java代码要慢很多。

### 反射机制的应用场景有哪些？

反射是框架设计的灵魂。

在我们平时的项目开发过程中，基本上很少会直接使用到反射机制，但这不能说明反射机制没有用，实际上有很多设计、开发都与反射机制有关，例如模块化的开发，通过反射去调用对应的字节码；动态代理设计模式也采用了反射机制，还有我们日常使用的 Spring／Hibernate 等框架也大量使用到了反射机制。

举例：

①我们在使用JDBC连接数据库时使用Class.forName()通过反射加载数据库的驱动程序；

②Spring框架也用到很多反射机制，最经典的就是xml的配置模式。Spring 通过 XML 配置模式装载 Bean 的过程：

1) 将程序内所有 XML 或 Properties 配置文件加载入内存中; 
2) Java类里面解析xml或properties里面的内容，得到对应实体类的字节码字符串以及相关的属性信息; 
3) 使用反射机制，根据这个字符串获得某个类的Class实例; 
4) 动态配置实例的属性

### Java获取反射的三种方法

1. 通过new对象实现反射机制 
2. 通过路径实现反射机制 
3. 通过类名实现反射机制

```java
public class Student {
    private int id;
    String name;
    protected boolean sex;
    public float score;
}
123456
public class Get {
    //获取反射机制三种方式
    public static void main(String[] args) throws ClassNotFoundException {
        //方式一(通过建立对象)
        Student stu = new Student();
        Class classobj1 = stu.getClass();
        System.out.println(classobj1.getName());
        //方式二（所在通过路径-相对路径）
        Class classobj2 = Class.forName("fanshe.Student");
        System.out.println(classobj2.getName());
        //方式三（通过类名）
        Class classobj3 = Student.class;
        System.out.println(classobj3.getName());
    }
}
```



### 反射的原理

**Java 反射**是一种运行时机制，允许程序在运行时动态地获取类的相关信息（如类名、方法、构造器、字段等），并对其进行操作。它是通过 **Java 的 `java.lang.reflect` 包** 提供的。

简单一句话：反射技术可以对类进行解剖。

反射就是在 Java 类执行过程中的加载步骤中，从 .class 字节码文件中提取出包含 java 类的所有信息，然后将字节码中的方法，变量，构造函数等映射成 相应的 Method、Filed、Constructor 等类，然后进行各种操作

反射的核心原理是 Java 虚拟机在运行时维护了一套完整的 **类型信息表（Type Information Table）**，通过这些信息，可以动态访问和操作类的属性和行为。

**1、类加载**

- 反射基于 **Java 类加载机制**。当类被加载到 JVM 时，会生成对应的 `Class` 对象，该对象包含该类的所有元数据（如类名、字段、方法、构造器等）。
- `Class` 对象是反射操作的入口点。

**2、Class 对象**

- 每个类在运行时都有唯一的一个 `Class` 对象与之对应。
- `Class` 对象是由类加载器（`ClassLoader`）加载的，存储在 **方法区（Method Area）**。

**3、动态访问**

- 通过 `Class` 对象获取方法、字段、构造器等信息，使用 `Method.invoke()` 或 `Field.set()` 等方法操作类的实例。



### 注解的原理

注解的底层也是使用反射实现的，我们可以自定义一个注解来体会下。注解和接口有点类似，不过申明注解类需要加上@interface，注解类里面，只支持基本类型、String及枚举类型，里面所有属性被定义成方法，并允许提供默认值。

https://blog.csdn.net/yuzongtao/article/details/83306182

**注解处理器**

这个是注解使用的核心了，前面我们说了那么多注解相关的，那到底java是如何去处理这些注解的呢

从getAnnotation进去可以看到java.lang.class实现了**AnnotatedElement**方法

```java
MyAnTargetType t = AnnotationTest.class.getAnnotation(MyAnTargetType.class);
```

```java
public final class Class<T> implements java.io.Serializable,
                              GenericDeclaration,
                              Type,
                              AnnotatedElement
```

java.lang.reflect.AnnotatedElement 接口是所有程序元素（Class、Method和Constructor）的父接口，所以程序通过反射获取了某个类的AnnotatedElement对象之后，程序就可以调用该对象的如下四个个方法来访问Annotation信息：

方法1 \<T extends Annotation> T getAnnotation(Class\<T> annotationClass):*返回改程序元素上存在的、指定类型的注解，如果该类型注解不存在，则返回null
方法2：Annotation[] getAnnotations(): 返回该程序元素上存在的所有注解



## Java 版本差异



### 有用过jdk17吗，有什么新特性

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



### lambda 原理

Lambda 表达式依赖于 **函数式接口**。函数式接口是只包含**一个抽象方法**的接口，这就是为什么 Lambda 表达式可以简化接口实现的原因

```java
@FunctionalInterface
public interface MyFunctionalInterface {
    void doSomething();
}
```

Lambda 表达式其实是对一个函数式接口的实现。在 Java 中常见的函数式接口有：

- `Runnable`
- `Callable`
- `Function`
- `Supplier`
- `Consumer`
- `Predicate`

Lambda 表达式的底层实现

Lambda 表达式在编译时并不会像匿名类那样直接生成内部类，而是通过 JVM 的 `invokedynamic` 指令以及 `LambdaMetafactory` 来动态生成。

3.1 `invokedynamic` 指令

Lambda 表达式引入了 `invokedynamic` 字节码指令，它使得 JVM 能够在运行时动态地将 Lambda 表达式与目标函数式接口进行绑定。

- 在 Java 8 之前，所有方法调用都使用静态绑定，比如通过 `invokestatic`、`invokevirtual` 等字节码指令。而 `invokedynamic` 是一种动态绑定的指令，它允许在运行时决定如何调用方法。

当编译器遇到 Lambda 表达式时，会将其编译成一个 `invokedynamic` 调用指令，而不是生成一个匿名类。

3.2 `LambdaMetafactory`

`LambdaMetafactory` 是 Java 8 中引入的一个类，它与 `invokedynamic` 配合使用，用于生成 Lambda 表达式的实际实现。简而言之，`LambdaMetafactory` 是负责动态创建 Lambda 实现的工厂类。

当 JVM 执行到 `invokedynamic` 时，会调用 `LambdaMetafactory`，动态生成与 Lambda 表达式相关的代码。

3.3 Lambda 表达式的编译过程

让我们来详细看看 Lambda 表达式的编译和执行过程。

Lambda 表达式代码：

```
Runnable runnable = () -> System.out.println("Hello, Lambda!");
runnable.run();
```

编译后的字节码：

编译器将 Lambda 表达式编译成类似以下的字节码（可以通过 `javap -c` 命令查看）：

```
INVOKEDYNAMIC run()Ljava/lang/Runnable; [
  // BootstrapMethods:
  0: #27 invokestatic java/lang/invoke/LambdaMetafactory.metafactory
  ...
]
```

- **`INVOKEDYNAMIC`**：编译器生成的 `invokedynamic` 指令，表示该调用将在运行时被解析。
- **`LambdaMetafactory.metafactory`**：JVM 在执行时会调用 `LambdaMetafactory` 来创建 `Runnable` 的具体实现。

##### 运行时：

1. JVM 遇到 `invokedynamic` 指令。
2. JVM 调用 `LambdaMetafactory.metafactory` 方法来生成 Lambda 的实际实现。
3. `LambdaMetafactory` 动态生成 `Runnable` 的实现类，该实现类在内部包含了 `System.out.println("Hello, Lambda!")` 的逻辑。
4. Lambda 表达式的实例被创建，赋值给 `runnable`。
5. 执行 `runnable.run()`，输出 `Hello, Lambda!`。

3.4 Lambda 是如何优化的

与传统的匿名内部类不同，Lambda 表达式的实现通过动态生成类，这样可以避免创建大量的匿名内部类，并且有助于性能优化。

- **性能优化**：由于 Lambda 表达式是通过动态生成的，因此在某些情况下，JVM 可以进行优化，比如复用同一个 Lambda 实现，而不是每次都创建新的实例。
- **减少类加载开销**：匿名内部类每次定义时都要生成一个新的类，而 Lambda 表达式则通过 `invokedynamic` 动态生成，减少了类加载的开销。

4. Lambda 表达式与匿名类的区别

尽管在语法上 Lambda 表达式与匿名类看起来相似，但它们在底层实现上有着明显区别：

- **编译后处理**：
  - **匿名类**：会生成一个内部类，每次使用都会创建新的类。
  - **Lambda 表达式**：通过 `invokedynamic` 和 `LambdaMetafactory` 动态生成代码，不会生成额外的类文件。
- **性能**：
  - **匿名类**：每次使用时都需要创建新对象。
  - **Lambda 表达式**：可以在某些情况下复用已有实现，性能更好。
- **内存使用**：
  - **匿名类**：每次实例化时都需要额外的内存。
  - **Lambda 表达式**：在运行时生成，减少了类的数量，有更好的内存表现。

Java 8 的 Lambda 表达式通过 `invokedynamic` 指令和 `LambdaMetafactory` 动态生成代码，而不是像匿名类那样生成新的类文件。这使得 Lambda 表达式的性能更加优越，并减少了类加载的开销。Lambda 表达式的引入大大简化了函数式接口的实现方式，使得 Java 代码更加简洁和高效。



### lambda 表达式中使用外部变量，为什么要 final？

我们在 Java 8 之前，匿名类中如果要访问局部变量的话，那个局部变量必须显式的声明为 final

每个方法在执行的时候都会在线程栈中开辟一块空间创建一个栈帧，方法的执行实际就是栈帧的入栈出栈的过程。栈帧中包含局部变量表，操作数栈，动态连接，方法出口等。外部方法的局部变量（假如有一个局部变量p）就保存在所在栈帧（为了方便叫栈帧A）的局部变量表中，而lambda表达式实际上就是一个匿名内部类的接口实现方法，执行的时候需要在线程栈中创建一个新的栈帧（栈帧B）。不同栈帧之间的局部变量表是独享的，所以栈帧B中的变量p实际上是对外部变量的一个私有拷贝。为了保证程序的正确性就要求这个被应用的局部变量需要定义成final的。假如变量p不要求是final的就会出现栈帧A和栈帧B中该变量值不一样的情况。这就跟我们预期的不一致了。导致程序不正确。
