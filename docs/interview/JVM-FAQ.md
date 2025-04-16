---
title: 手撕 JVM 面试 
date: 2024-05-31
tags: 
 - JVM
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> 为啥 java 不用 360 进行垃圾回收？ 为啥 java 不用 360 进行垃圾回收？   哈哈哈哈~ 
>
> 开玩笑，言归正传。 背诵一下G1 垃圾回收方法类的第 108 行？
>
> 。。。。。。。。。。。。。。。。。。。



## 一、类加载子系统

### 类加载机制？类加载过程

Java 语言是一种具有动态性的解释型语言，类(Class)只有被加载到 JVM 后才能运行。当运行指定程序时，JVM 会将编译生成的 .class 文件按照需求和一定的规则加载到内存中，并组织成为一个完整的 Java 应用程序。这个加载过程是由类加载器完成，具体来说，就是由 ClassLoader 和它的子类来实现的。类加载器本身也是一个类，其实质是把类文件从硬盘读取到内存中。

类的加载方式分为**隐式加载和显示加载**。隐式加载指的是程序在使用 new 等方式创建对象时，会隐式地调用类的加载器把对应的类 加载到 JVM 中。显示加载指的是通过直接调用 `class.forName()` 方法来把所需的类加载到 JVM 中。

Java 虚拟机把描述类的数据从 Class 文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型，这就是虚拟机的加载机制。

类从被加载到虚拟机内存中开始，到卸载出内存为止，它的整个生命周期包括：**加载、验证、准备、解析、初始化、使用和卸载**七个阶段。(验证、准备和解析又统称为连接，为了支持Java语言的**运行时绑定**，所以**解析阶段也可以是在初始化之后进行的**。以上顺序都只是说开始的顺序，实际过程中是交叉的混合式进行的，加载过程中可能就已经开始验证了)

![jvm-class-load](https://img.starfish.ink/jvm/jvm-class-load.png)



> ##### 1. **加载（Loading）**
>
> - 核心任务：
>   1. 通过全限定名获取类的二进制字节流（来源包括JAR、网络、动态生成等）
>   2. 将字节流转换为方法区的运行时数据结构。
>   3. 在堆中生成 `java.lang.Class`对象，作为访问入口
> - 自定义加载器：可重写 `findClass()`方法实现从非标准来源加载类（如网络）。
>
> ##### 2. **验证（Verification）**
>
> - 确保字节流符合JVM规范且无害：
>   - 文件格式验证：检查魔数（`0xCAFEBABE`）、版本号等。
>   - 元数据验证：检查语义（如是否继承final类）。
>   - 字节码验证：分析程序逻辑（如类型转换有效性）。
>   - 符号引用验证：确认符号引用可解析（如类、方法是否存在）。
> - 可关闭：生产环境可通过 `-Xverify:none` 跳过部分验证。
>
> ##### 3. **准备（Preparation）**
>
> - 为**静态变量（类变量）**分配内存并设置初始值：
>   - 默认零值：如 `int` 为0，`boolean` 为false，引用类型为 null。
>   - Final常量例外：若变量被 `final static` 修饰，则直接赋代码中的初始值。
> - 内存分配位置：JDK7+后静态变量存储在堆中而非方法区。
>
> ##### 4. **解析（Resolution）**
>
> - 将常量池中的符号引用转换为直接引用（内存地址或偏移量）：
>
>   - 符号引用：类、方法、字段的描述字符串（如 `java/lang/Object`）。
>
>     - 符号引用：编译时生成的抽象描述，包含类/接口全限定名、字段/方法名称及描述符。例如，`java/lang/String.length:()I` 表示 `String.length()` 方法的符号引用。
>     - 特点：与内存布局无关，仅通过符号定位目标，未加载时无法确定实际地址。
>
>   - 直接引用：指向目标的内存地址或偏移量，如方法在方法表中的索引或字段在对象中的偏移。
>
>     转换时机：
>
>     - **静态解析**：类加载的解析阶段（如 `invokestatic` 调用静态方法）。
>     - **动态解析**：运行时根据实际对象类型确定（如 `invokevirtual` 实现多态）
>
> - 动态绑定：部分解析可能在初始化后执行（如接口方法调用）。
>
> ##### 5. **初始化（Initialization）**
>
> - 执行类构造器 `<clinit>()`方法（由编译器自动生成）：
>   - 内容：合并静态变量赋值和静态代码块语句，按代码顺序执行。
>   - 线程安全：JVM保证 `<clinit>()`在多线程下仅执行一次。
> - **父类优先**：子类初始化前确保父类已初始化



### 触发初始化的条件（主动引用）

以下情况会触发类的初始化阶段 ：

1. **创建实例**：通过 `new` 关键字实例化对象。
2. 访问静态成员：访问类的静态变量（非 `final`）或调用静态方法（包括反射调用 `Class.forName()`）。
   - 例外：若静态变量是 final 常量（如 `final static int a=1`），不会触发初始化。
3. **反射调用**：使用 `java.lang.reflect` 包的方法对类进行反射调用。
4. **子类初始化**：初始化子类时，若父类未初始化，则优先初始化父类。
5. **主类启动**：执行包含 `main()` 方法的类（JVM 启动时的入口类）。
6. **动态语言支持**：通过 `java.lang.invoke.MethodHandle` 动态调用时。

**被动引用示例（不触发初始化）**

- 通过子类引用父类的静态字段（仅初始化父类）。
- 通过数组定义引用类（如 `ClassA[] arr = new ClassA[10]`）
- 访问类的 `final static` 常量（已在准备阶段赋值）

### 类卸载条件

1. 所有实例已被GC回收。
2. 无任何地方引用该类的`Class`对象。
3. 加载该类的类加载器实例已被GC。

- **注意**：由启动类加载器加载的类（如核心类）永不卸载

### 什么是类加载器，类加载器有哪些？这些类加载器都加载哪些文件？

类加载器（ClassLoader）是 JVM 的核心组件，负责将 `.class` 文件的二进制数据加载到内存中，并在堆中生成对应的 `java.lang.Class` 对象，作为访问类元数据的入口。其核心功能包括：

1. **定位并读取字节码文件**（如从本地文件、网络、JAR 包等来源）。
2. **验证字节码合法性**（如文件格式、语义检查等）。
3. **分配内存并初始化默认值**（如静态变量的零值）。
4. **解析符号引用为直接引用**（内存地址或偏移量）。
5. **执行类的初始化逻辑**（如静态代码块）

Java 类加载器主要分为以下三类，遵循**双亲委派模型**:

##### 启动类加载器（引导类加载器，Bootstrap ClassLoader）

- 这个类加载使用 C/C++ 语言实现，嵌套在 JVM 内部
- 它用来加载 Java 的核心库（`JAVA_HOME/jre/lib/rt.jar`、`resource.jar`或`sun.boot.class.path`路径下的内容），用于提供 JVM 自身需要的类
- 并不继承自 `java.lang.ClassLoader`，没有父加载器
- 加载扩展类和应用程序类加载器，并指定为他们的父类加载器
- 出于安全考虑，Bootstrap 启动类加载器只加载名为java、Javax、sun等开头的类

##### 扩展类加载器（Extension ClassLoader）

- Java 语言编写，由`sun.misc.Launcher$ExtClassLoader`实现
- 派生于 ClassLoader
- 父类加载器为启动类加载器
- 从 `java.ext.dirs` 系统属性所指定的目录中加载类库，或从 JDK 的安装目录的`jre/lib/ext` 子目录（扩展目录）下加载类库。如果用户创建的 JAR 放在此目录下，也会自动由扩展类加载器加载

##### 应用程序类加载器（也叫系统类加载器，AppClassLoader）

- Java 语言编写，由 `sun.misc.Lanucher$AppClassLoader` 实现
- 派生于 ClassLoader
- 父类加载器为扩展类加载器
- 它负责加载环境变量`classpath`或系统属性` java.class.path` 指定路径下的类库
- 该类加载是**程序中默认的类加载器**，一般来说，Java 应用的类都是由它来完成加载的
- 通过 `ClassLoader#getSystemClassLoader()` 方法可以获取到该类加载器



##### 用户自定义类加载器

在 Java 的日常应用程序开发中，类的加载几乎是由 3 种类加载器相互配合执行的，在必要时，我们还可以自定义类加载器，来定制类的加载方式



### 什么是双亲委派机制？它有啥优势？

Java 虚拟机对 class 文件采用的是**按需加载**的方式，也就是说当需要使用该类的时候才会将它的 class 文件加载到内存生成 class 对象。而且加载某个类的 class 文件时，Java 虚拟机采用的是双亲委派模式，即把请求交给父类处理，它是一种任务委派模式。

简单说就是当类加载器（Class-Loader）试图加载某个类型的时候，除非父加载器找不到相应类型，否则尽量将这个任务代理给当前加载器的父加载器去做。使用委派模型的目的是避免重复加载 Java 类型。

- **核心原则**：类加载器收到加载请求时，优先委派父类加载器完成加载，若父类无法加载，则由自身尝试加载。
- **意义**：避免重复加载，保证核心类安全（如防止自定义`java.lang.String`覆盖系统类）

![](https://img.starfish.ink/jvm/classloader.png)

> **工作过程**
>
> - 如果一个类加载器收到了类加载请求，它并不会自己先去加载，而是把这个请求委托给父类的加载器去执行；
> - 如果父类加载器还存在其父类加载器，则进一步向上委托，依次递归，请求最终将到达顶层的启动类加载器；
> - 如果父类加载器可以完成类加载任务，就成功返回，倘若父类加载器无法完成此加载任务，子加载器才会尝试自己去加载，这就是双亲委派模式
>
> **优势**
>
> - **避免类的重复加载**，JVM 中区分不同类，不仅仅是根据类名，相同的 class 文件被不同的 ClassLoader 加载就属于两个不同的类（比如，Java中的Object类，无论哪一个类加载器要加载这个类，最终都是委派给处于模型最顶端的启动类加载器进行加载，如果不采用双亲委派模型，由各个类加载器自己去加载的话，系统中会存在多种不同的 Object 类）
> - **保护程序安全，防止核心 API 被随意篡改**，避免用户自己编写的类动态替换 Java 的一些核心类，比如我们自定义类：`java.lang.String`



### 为什么要自定义类加载器？

- 隔离加载类
- 修改类加载的方式
- 扩展加载源（可以从数据库、云端等指定来源加载类）
- 防止源码泄露（Java 代码容易被反编译，如果加密后，自定义加载器加载类的时候就可以先解密，再加载）



### 自定义了一个String，那么会加载哪个String？

| **场景**               | **能否加载自定义`String`** | **原因**                                                    |
| ---------------------- | -------------------------- | ----------------------------------------------------------- |
| 包名为`java.lang`      | ❌ 不能                     | 双亲委派机制优先加载系统类，且JVM安全机制禁止篡改核心包     |
| 包名非`java.lang`      | ✅ 能                       | 应用类加载器直接加载用户类路径下的自定义类，与系统类无冲突  |
| 自定义类加载器打破委派 | ✅ 能（但类型不同）         | 绕过双亲委派直接加载，但JVM认为自定义类与系统类是独立存在的 |

- JVM会阻止用户定义以`java.lang`开头的包名，直接抛出`SecurityException: Prohibited package name: java.lang`，避免核心类被篡改
- 若自定义`String`类的包名不同（如`com.example.String`），应用程序类加载器（AppClassLoader）会直接加载它，不会与系统`String`冲突。
- 使用时需明确指定全限定类名（如`com.example.String str = new com.example.String()`）

> 如果你自定义了一个 `String` 类型的数据，那么系统会加载哪个 `String` 取决于几个因素：
>
> 1. **作用域（Scope）**：
>    - 如果自定义的 `String` 位于局部作用域内（例如一个方法内部），那么这个局部变量将会被优先使用。
>    - 如果自定义的 `String` 位于类的成员变量或者全局变量，那么在该类或全局范围内会优先使用这个自定义的 `String`。
> 2. **类加载顺序**：
>    - 如果你在某个类中自定义了一个名为 `String` 的类型，这个自定义的类型会在该类的上下文中被优先加载。
>    - 通常来说，标准库中的 `java.lang.String` 会在默认情况下被加载使用，但如果你定义了一个同名类且在当前作用域内，这个自定义的类会覆盖标准库中的类。
> 3. **包的使用**：
>    - 如果你的自定义 `String` 类型在某个特定的包中，而标准库的 `java.lang.String` 是在 `java.lang` 包中，那么在不明确指定包名的情况下，当前作用域内的类型会优先被加载。
>    - 可以通过完全限定名（Fully Qualified Name）来区分，例如使用 `java.lang.String` 来确保使用的是标准库中的 `String`。
>
> 以下是一个示例来说明作用域和类加载的情况：
>
> ```JAVA
> public class MyClass {
>     // 自定义的String类
>     public static class String {
>         public void print() {
>             System.out.println("This is my custom String class.");
>         }
>     }
> 
>     public static void main(String[] args) {
>         // 使用自定义的String类
>         String myString = new String();
>         myString.print(); // 输出: This is my custom String class.
> 
>         // 使用标准库的String类
>         java.lang.String standardString = new java.lang.String("Hello, World!");
>         System.out.println(standardString); // 输出: Hello, World!
>     }
> }
> ```
>
> 在这个示例中：
>
> - `mypackage.MyClass.String` 是自定义的 `String` 类，并在 `main` 方法中优先使用。
> - `java.lang.String` 是标准库中的 `String` 类，通过完全限定名确保其正确加载。
>
> 综上所述，系统会加载哪个 `String`，取决于你的自定义 `String` 在代码中的定义位置和使用范围。如果你明确指定了完全限定名，那么系统会准确加载你指定的那个 `String` 类。
>
> 针对 java.*开头的类，jvm 的实现中已经保证了必须由 bootstrp 来加载
>



### 多线程的情况下，类的加载为什么不会出现重复加载的情况？

双亲委派



### 在多线程的情况下，类的加载为什么不会出现重复加载的情况？

**三个类加载器的关系，不是父子关系，是组合关系。**

看看类加载器的加载类的方法 loadClass

```java
protected Class<?> loadClass(String name, boolean resolve)
  throws ClassNotFoundException
{
  //看，这里有锁
  synchronized (getClassLoadingLock(name)) {
    // First, check if the class has already been loaded
    //去看看类是否被加载过，如果被加载过，就立即返回
    Class<?> c = findLoadedClass(name);
    if (c == null) {
      long t0 = System.nanoTime();
      try {
        //这里通过是否有parent来区分启动类加载器和其他2个类加载器
        if (parent != null) {
          //先尝试请求父类加载器去加载类，父类加载器加载不到，再去尝试自己加载类
          c = parent.loadClass(name, false);
        } else {
          //启动类加载器加载类，本质是调用c++的方法
          c = findBootstrapClassOrNull(name);
        }
      } catch (ClassNotFoundException e) {
        // ClassNotFoundException thrown if class not found
        // from the non-null parent class loader
      }
      //如果父类加载器加载不到类，子类加载器再尝试自己加载
      if (c == null) {
        // If still not found, then invoke findClass in order
        // to find the class.
        long t1 = System.nanoTime();
        //加载类
        c = findClass(name);

        // this is the defining class loader; record the stats
        sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
        sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
        sun.misc.PerfCounter.getFindClasses().increment();
      }
    }
    if (resolve) {
      resolveClass(c);
    }
    return c;
  }
}
```

总结一下loadClass方法的大概逻辑：

1. 首先加锁，防止多线程的情况下，重复加载同一个类
2. 当加载类的时候，先请求其父类加载器去加载类，如果父类加载器无法加载类时，才自己尝试去加载类。

![图片摘自网络](https://uploadfiles.nowcoder.com/files/20210318/9603430_1616033889317/154ad50dc8dd4b109ab5e2100c63fe66.png)

上面的源码解析，可以回答问题：在多线程的情况下，类的加载为什么不会出现重复加载的情况？



### 可以打破双亲委派机制吗？

- 双亲委派模型并不是一个强制性的约束模型，而是 Java 设计者推荐给开发者的类加载器实现方式，可以“被破坏”，只要我们自定义类加载器，**重写 `loadClass()` 方法**，指定新的加载逻辑就破坏了，重写 `findClass()` 方法不会破坏双亲委派。

- 双亲委派模型有一个问题：顶层 ClassLoader，无法加载底层 ClassLoader 的类。典型例子 JNDI、JDBC，所以加入了线程上下文类加载器（Thread Context ClassLoader），可以通过 `Thread.setContextClassLoaser()`设置该类加载器，然后顶层 ClassLoader 再使用 `Thread.getContextClassLoader()` 获得底层的 ClassLoader 进行加载。

- Tomcat 中使用了自定义 ClassLoader，并且也破坏了双亲委托机制。每个应用使用 WebAppClassloader 进行单独加载，他首先使用 WebAppClassloader 进行类加载，如果加载不了再委托父加载器去加载，这样可以保证每个应用中的类不冲突。每个 tomcat 中可以部署多个项目，每个项目中存在很多相同的 class 文件（很多相同的jar包），他们加载到 jvm 中可以做到互不干扰。

  > Tomcat 为每个 Web 应用创建独立的 `WebAppClassLoader`，确保不同应用中同名类（如不同版本的 `commons-lang`）互不干扰。例如：
  >
  > - **应用 A** 使用 `commons-lang-2.0.jar`，由 `WebAppClassLoaderA` 加载。
  > - **应用 B** 使用 `commons-lang-3.0.jar`，由 `WebAppClassLoaderB` 加载。 即使类名相同，两个应用中的类也会被 JVM 视为不同的类

- 利用破坏双亲委派来实现**代码热替换**（每次修改类文件，不需要重启服务）。因为一个 Class 只能被一个 ClassLoader 加载一次，否则会报 `java.lang.LinkageError`。当我们想要实现代码热部署时，可以每次都 new 一个自定义的 ClassLoader 来加载新的 Class文件。JSP 的实现动态修改就是使用此特性实现。



### i++ 和 i=i+1在字节码文件上怎么实现及区别？

**i++** 的字节码（使用 `javap -c` 查看）：

```
0:  iconst_0               // 将 0 压入操作数栈
1:  istore_1               // 将栈顶的值（0）存储到局部变量 1（i）
2:  iinc 1, 1              // i 递增 1（相当于 i++）
5:  return
```

**i = i + 1** 的字节码：

```
0:  iconst_0               // 将 0 压入操作数栈
1:  istore_1               // 将栈顶的值（0）存储到局部变量 1（i）
2:  iload_1                // 将局部变量 1（i）加载到操作数栈
3:  iconst_1               // 将常量 1 推入操作数栈
4:  iadd                    // 栈顶两个数相加（i + 1）
5:  istore_1               // 将结果存储到局部变量 1（i）
6:  return
```

**字节码差异**：

- `i++` 通过 **`iinc`** 指令直接修改局部变量 `i` 的值，而 `i = i + 1` 需要先加载变量 `i` 到栈中，再加上 1，最后将结果存储回 `i`。因此，`i++` 相比 `i = i + 1` 更为简洁，直接修改变量，而 `i = i + 1` 需要额外的加法和栈操作。

**效率差异**：

- **`i++`** 的字节码更高效，使用 **`iinc`** 指令直接增加局部变量的值，不需要进行加法运算。
- **`i = i + 1`** 的字节码则需要进行 **加载、加法、存储** 三步操作，涉及到更多的指令和操作数栈。

**可读性差异**：

- `i++` 更符合编程习惯和语法逻辑，它明确表示这是一个递增操作，并且在执行后会返回 `i` 的旧值。
- `i = i + 1` 更为直观，表达了 `i` 增加的过程，但它是一个赋值操作，语义上更清晰一些。



### **静态变量何时赋值？**

非final变量在初始化阶段赋值，final常量在准备阶段赋值

------



## 二、内存结构

### Java 内存结构？| JVM 内存区域的划分

![1.png](https://img.starfish.ink/jvm/jvm-framework.png)

通常可以把 JVM 内存区域分为下面几个方面，其中，有的区域是以线程为单位，而有的区域则是整个 JVM 进程唯一的。

首先，**程序计数器**（PC，Program Counter Register）。在 JVM 规范中，每个线程都有它自己的程序计数器，并且任何时间一个线程都只有一个方法在执行，也就是所谓的当前方法。程序计数器会存储当前线程正在执行的 Java 方法的 JVM 指令地址；或者，如果是在执行本地方法，则是未指定值（undefined）。

第二，**Java 虚拟机栈**（Java Virtual Machine Stack），早期也叫 Java 栈。每个线程在创建时都会创建一个虚拟机栈，其内部保存一个个的栈帧（Stack Frame），对应着一次次的 Java 方法调用。

前面谈程序计数器时，提到了当前方法；同理，在一个时间点，对应的只会有一个活动的栈帧，通常叫作当前帧，方法所在的类叫作当前类。如果在该方法中调用了其他方法，对应的新的栈帧会被创建出来，成为新的当前帧，一直到它返回结果或者执行结束。JVM 直接对 Java 栈的操作只有两个，就是对栈帧的压栈和出栈。

栈帧中存储着局部变量表、操作数（operand）栈、动态链接、方法正常退出或者异常退出的定义等。

第三，**堆**（Heap），它是 Java 内存管理的核心区域，用来放置 Java 对象实例，几乎所有创建的 Java 对象实例都是被直接分配在堆上。堆被所有的线程共享，在虚拟机启动时，我们指定的“Xmx”之类参数就是用来指定最大堆空间等指标。

理所当然，堆也是垃圾收集器重点照顾的区域，所以堆内空间还会被不同的垃圾收集器进行进一步的细分，最有名的就是新生代、老年代的划分。

第四，**方法区**（Method Area）。这也是所有线程共享的一块内存区域，用于存储所谓的元（Meta）数据，例如类结构信息，以及对应的运行时常量池、字段、方法代码等。

由于早期的 Hotspot JVM 实现，很多人习惯于将方法区称为永久代（Permanent Generation）。Oracle JDK 8 中将永久代移除，同时增加了元数据区（Metaspace）。

第五，**运行时常量池**（Run-Time Constant Pool），这是方法区的一部分。如果仔细分析过反编译的类文件结构，你能看到版本号、字段、方法、超类、接口等各种信息，还有一项信息就是常量池。Java 的常量池可以存放各种常量信息，不管是编译期生成的各种字面量，还是需要在运行时决定的符号引用，所以它比一般语言的符号表存储的信息更加宽泛。

第六，**本地方法栈**（Native Method Stack）。它和 Java 虚拟机栈是非常相似的，支持对本地方法的调用，也是每个线程都会创建一个。在 Oracle Hotspot JVM 中，本地方法栈和 Java 虚拟机栈是在同一块儿区域，这完全取决于技术实现的决定，并未在规范中强制。

> - 直接内存（Direct Memory）区域， Direct Buffer 所直接分配的内存，也是个容易出现问题的地方。尽管，在 JVM 工程师的眼中，并不认为它是 JVM 内部内存的一部分，也并未体现 JVM 内存模型中。
> - JVM 本身是个本地程序，还需要其他的内存去完成各种基本任务，比如，JIT Compiler 在运行时对热点方法进行编译，就会将编译后的方法储存在 Code Cache 里面；GC 等功能需要运行在本地线程之中，类似部分都需要占用内存空间。这些是实现 JVM JIT 等功能的需要，但规范中并不涉及。
>
> ![JVM Overview](https://abiasforaction.net/wp-content/uploads/2020/12/xJVM_Overview.png,qx60851.pagespeed.ic.yS2Huqqhjz.webp)



### 1.7 和 1.8 中 jvm 内存结构的区别

在 Java8 中，永久代被移除，被一个称为元空间的区域代替，元空间的本质和永久代类似，都是方法区的实现。

元空间（Java8）和永久代（Java7）之间最大的区别就是：永久代使用的 JVM 的堆内存，Java8 以后的元空间并不在虚拟机中而是使用本机物理内存。

因此，默认情况下，元空间的大小仅受本地内存限制。类的元数据放入 natice memory，字符串池和类的静态变量放入堆中。

![](https://dl-harmonyos.51cto.com/images/202212/d37207e632cd193510c4713b1db551924c2d36.png)



### JVM 堆内部结构？ |  JVM 堆内存为什么要分成新生代，老年代，持久代

1. 新生代

   新生代是大部分对象创建和销毁的区域，在通常的 Java 应用中，绝大部分对象生命周期都是很短暂的。其内部又分为 Eden 区域，作为对象初始分配的区域；两个 Survivor，有时候也叫 from、to 区域，被用来放置从 Minor GC 中保留下来的对象。

   - JVM 会随意选取一个 Survivor 区域作为“to”，然后会在 GC 过程中进行区域间拷贝，也就是将 Eden 中存活下来的对象和 from 区域的对象，拷贝到这个“to”区域。这种设计主要是为了防止内存的碎片化，并进一步清理无用对象。

   - 从内存模型而不是垃圾收集的角度，对 Eden 区域继续进行划分，Hotspot JVM 还有一个概念叫做 Thread Local Allocation Buffer（TLAB），据我所知所有 OpenJDK 衍生出来的 JVM 都提供了 TLAB 的设计。这是 JVM 为每个线程分配的一个私有缓存区域，否则，多线程同时分配内存时，为避免操作同一地址，可能需要使用加锁等机制，进而影响分配速度，你可以参考下面的示意图。从图中可以看出，TLAB 仍然在堆上，它是分配在 Eden 区域内的。其内部结构比较直观易懂，start、end 就是起始地址，top（指针）则表示已经分配到哪里了。所以我们分配新对象，JVM 就会移动 top，当 top 和 end 相遇时，即表示该缓存已满，JVM 会试图再从 Eden 里分配一块儿。

     ![](https://static001.geekbang.org/resource/image/f5/bd/f546839e98ea5d43b595235849b0f2bd.png)

     2. 老年代

        放置长生命周期的对象，通常都是从 Survivor 区域拷贝过来的对象。当然，也有特殊情况，我们知道普通的对象会被分配在 TLAB 上；如果对象较大，JVM 会试图直接分配在 Eden 其他位置上；如果对象太大，完全无法在新生代找到足够长的连续空闲空间，JVM 就会直接分配到老年代。

     3. 永久代

        这部分就是早期 Hotspot JVM 的方法区实现方式了，储存 Java 类元数据、常量池、Intern 字符串缓存，在 JDK 8 之后就不存在永久代这块儿了。

#### 一些参数的配置

- 默认的，新生代 ( Young ) 与老年代 ( Old ) 的比例的值为 1:2 ，可以通过参数 –XX:NewRatio 配置。
- 默认的，Edem : from : to = 8 : 1 : 1 ( 可以通过参数 –XX:SurvivorRatio 来设定)
- Survivor区中的对象被复制次数为15(对应虚拟机参数 -XX:+MaxTenuringThreshold)

#### 为什么要分为Eden和Survivor?为什么要设置两个Survivor区？

- 如果没有Survivor，Eden区每进行一次Minor GC，存活的对象就会被送到老年代。老年代很快被填满，触发Major GC。老年代的内存空间远大于新生代，进行一次 Full GC 消耗的时间比 Minor GC 长得多,所以需要分为 Eden 和 Survivor。
- Survivor 的存在意义，就是减少被送到老年代的对象，进而减少 Full GC 的发生
- 设置两个 Survivor 区最大的好处就是解决了碎片化，刚刚新建的对象在 Eden 中，经历一次 Minor GC，Eden 中的存活对象就会被移动到第一块 survivor space S0，Eden 被清空；等 Eden 区再满了，就再触发一次 Minor GC，Eden 和 S0 中的存活对象又会被复制送入第二块 survivor space S1（这个过程非常重要，因为这种复制算法保证了S1中来自S0和Eden两部分的存活对象占用连续的内存空间，避免了碎片化的发生）



### Java 对象是不是都创建在堆上的呢？

> JVM 的一些高级优化技术，例如逃逸分析（Escape Analysis），可以使对象在栈上分配内存，而不是堆上。逃逸分析可以判断对象的作用域，如果确定对象不会逃逸出方法（即对象仅在方法内部使用），JVM 可以选择将对象分配在栈上。这种优化减少了垃圾回收的负担，并提高了性能。
>
> 通过[逃逸分析](https://en.wikipedia.org/wiki/Escape_analysis)，JVM 会在栈上分配那些不会逃逸的对象，这在理论上是可行的，但是取决于 JVM 设计者的选择。

在 Java 中，并不是所有对象都严格创建在堆上，尽管大部分情况下确实如此。具体来说：

1. **普通对象：通常创建在堆上**

   - Java 中通过 `new` 关键字创建的对象（比如 `new MyClass()`），以及通过反射、序列化等机制创建的对象，默认分配在堆上。

   - 堆是 JVM 中用来存储对象实例和数组的区域，所有线程共享。

2. 栈上分配对象（逃逸分析 & 标量替换优化）
   - 在某些情况下，JVM 可以通过优化技术将原本应该在堆上分配的对象转移到栈上分配。这种优化是通过**逃逸分析（Escape Analysis）**实现的。
     - 如果 JVM 确定某个对象不会在当前方法之外被访问（不会逃逸当前线程），那么它可能会将该对象分配在栈上。
     - 如果对象分配在栈上，当方法执行完毕，栈帧出栈时，对象会自动销毁，不需要垃圾回收。

3. **标量替换**
   - 如果逃逸分析进一步确定一个对象的成员变量可以直接用基本数据类型代替，则 JVM 可能会将对象“拆分”为一组标量变量，而根本不创建对象。这种情况下，对象实际上并没有被显式分配在堆或栈上。

4. **方法区中的特殊对象**

   - **类对象**：每个类的 `Class` 对象是存储在**方法区**中的，用于反射和类元数据。

   - **字符串池**：字符串字面量（如 `"hello"`）存储在堆外的字符串常量池（Java 7 开始字符串常量池在堆中）。

5.  **直接内存中的对象**
   - 通过 `ByteBuffer.allocateDirect()` 分配的直接内存区域（Direct Memory）不在堆上，而是使用操作系统的内存。

**结论**

虽然大部分 Java 对象创建在堆上，但由于 JVM 的优化（如逃逸分析、标量替换）和一些特定机制（如字符串常量池、直接内存），并非所有对象都严格创建在堆上。是否在堆上分配，具体取决于对象的生命周期、作用域以及 JVM 的运行时优化策略。



### Java new 一个对象的过程发生了什么？

Java 在 new 一个对象的时候，会先查看对象所属的类有没有被加载到内存，如果没有的话，就会先通过类的全限定名来加载。加载并初始化类完成后，再进行对象的创建工作。

我们先假设是第一次使用该类，这样的话 new 一个对象就可以分为两个过程：**加载并初始化类和创建对象**

加载过程就是 ClassLoader 那一套：加载-验证-准备-解析-初始化

**一、类加载与初始化（首次使用类时触发）**

1. **类加载检查**

   - **触发条件**：首次使用类（如 `new`、反射调用等），检查是否已加载类元数据。

   - 加载流程：
     - **加载（Loading）**：通过类加载器（如 `AppClassLoader`）从磁盘、网络等来源读取 `.class` 字节流。
     - **验证（Verification）**：检查字节码合法性（如魔数 `0xCAFEBABE`）。
     - **准备（Preparation）**：为静态变量分配内存并赋零值（如 `static int` 初始化为 0）。
     - **解析（Resolution）**：将符号引用转为直接引用（如方法地址）。
     - **初始化（Initialization）**：执行 `<clinit>()` 方法，合并静态代码块和静态变量赋值。

2. **类加载的懒加载特性**

   - **延迟加载**：类仅在首次主动使用时加载，避免启动时加载所有类。

   ```java
   public class MyClass { 
       static { System.out.println("类已初始化"); } 
   }
   public class Test {
       public static void main(String[] args) {
           // 首次 new 时触发类加载和初始化
           MyClass obj = new MyClass(); // 输出："类已初始化"
       }
   }
   ```

**二、对象实例化阶段**

1. **分配堆内存**

   - 内存分配方式：
     - **指针碰撞（Bump the Pointer）**：适用于规整内存（如 `Serial` 收集器），通过移动指针分配连续内存。
     - **空闲列表（Free List）**：适用于碎片化内存（如 `CMS` 收集器），维护可用内存块列表。

   - 线程安全机制：
     - **CAS + 重试**：通过原子操作避免多线程竞争。
     - **TLAB（Thread Local Allocation Buffer）**：为每个线程预分配私有内存区域，减少锁竞争。

2. **初始化零值**

   - JVM 将对象内存区域初始化为零值：
     - 基本类型：`int` → `0`，`boolean` → `false`。
     - 引用类型：初始化为 `null`。

   - **意义**：确保未显式赋值的字段可直接使用。

3. **设置对象头（Object Header）**

   - **Mark Word**：存储哈希码、GC 分代年龄、锁状态（如偏向锁标记）。

   - **类型指针（Class Pointer）**：指向方法区中的类元数据（`Class` 对象），表示该对象是哪个类的实例。

   - **数组长度**（仅数组对象）：记录数组长度。

4. **执行 `<init>()` 方法**

   - 初始化顺序：
     1. **父类构造方法**：递归调用父类构造方法（隐式调用 `super()`）。
     2. **实例变量初始化**：按代码顺序执行字段赋值和实例代码块。
     3. **构造方法体**：执行用户编写的构造逻辑。

   ```java
   public class Parent {
       public Parent() { System.out.println("Parent构造方法"); }
   }
   public class Child extends Parent {
       private int x = initX(); // 实例变量初始化
       { System.out.println("Child实例代码块"); } // 实例代码块
       public Child() { 
           System.out.println("Child构造方法"); 
       }
       private int initX() { 
           System.out.println("初始化x"); 
           return 10; 
       }
   }
   // 输出顺序：
   // Parent构造方法 → 初始化x → Child实例代码块 → Child构造方法
   ```

5. **返回对象引用**：构造完成后，栈帧中引用变量（如 `obj`）指向堆内存地址。







### 请谈谈你对 OOM 的认识 | 哪些区域可能发生 OutOfMemoryError？

OOM 如果通俗点儿说，就是 JVM 内存不够用了，javadoc 中对[OutOfMemoryError](https://docs.oracle.com/javase/9/docs/api/java/lang/OutOfMemoryError.html)的解释是，没有空闲内存，并且垃圾收集器也无法提供更多内存。

这里面隐含着一层意思是，在抛出 OutOfMemoryError 之前，通常垃圾收集器会被触发，尽其所能去清理出空间

当然，也不是在任何情况下垃圾收集器都会被触发的，比如，我们去分配一个超大对象，类似一个超大数组超过堆的最大值，JVM 可以判断出垃圾收集并不能解决这个问题，所以直接抛出 OutOfMemoryError。

从数据区的角度，除了程序计数器，其他区域都有可能会因为可能的空间不足发生 OutOfMemoryError，简单总结如下：

- 堆内存不足是最常见的 OOM 原因之一，抛出的错误信息是“java.lang.OutOfMemoryError:Java heap space”，原因可能千奇百怪，例如，可能存在内存泄漏问题；也很有可能就是堆的大小不合理，比如我们要处理比较可观的数据量，但是没有显式指定 JVM 堆大小或者指定数值偏小；或者出现 JVM 处理引用不及时，导致堆积起来，内存无法释放等。
- 而对于 Java 虚拟机栈和本地方法栈，这里要稍微复杂一点。如果我们写一段程序不断的进行递归调用，而且没有退出条件，就会导致不断地进行压栈。类似这种情况，JVM 实际会抛出 StackOverFlowError；当然，如果 JVM 试图去扩展栈空间的的时候失败，则会抛出 OutOfMemoryError。
- 对于老版本的 Oracle JDK，因为永久代的大小是有限的，并且 JVM 对永久代垃圾回收（如，常量池回收、卸载不再需要的类型）非常不积极，所以当我们不断添加新类型的时候，永久代出现 OutOfMemoryError 也非常多见，尤其是在运行时存在大量动态类型生成的场合；类似 Intern 字符串缓存占用太多空间，也会导致 OOM 问题。对应的异常信息，会标记出来和永久代相关：“java.lang.OutOfMemoryError: PermGen space”。
- 随着元数据区的引入，方法区内存已经不再那么窘迫，所以相应的 OOM 有所改观，出现 OOM，异常信息则变成了：“java.lang.OutOfMemoryError: Metaspace”。
- 直接内存不足，也会导致 OOM



### 内存泄露和内存溢出的区别？

- 内存泄露 memory leak，是指程序在申请内存后，无法释放已申请的内存空间，一次内存泄露危害可以忽略，但内存泄露堆积后果很严重，无论多少内存，迟早会被占光。

- 内存溢出 out of memory，是指程序在申请内存时，没有足够的内存空间供其使用，出现 out of memory；比如申请了一个 integer,但给它存了 long 才能存下的数，那就是内存溢出。

  memory leak  最终会导致 out of memory！

内存泄漏是内存溢出的常见诱因，但内存溢出也可能由非泄漏因素（如数据量过大）直接引发



### 内存泄漏时，如何定位问题代码?

在 Java 中，内存泄漏通常指的是对象被不再需要但仍被引用，从而无法被垃圾回收器回收的情况。要定位和修复内存泄漏，通常需要以下几个步骤：

1. **确认内存泄漏**

   - **表现**：应用程序在长时间运行后会出现性能下降，内存占用不断增加，GC（垃圾回收）频繁但无法回收足够的内存。

   - 工具：可以使用以下工具来确认内存泄漏：
     - **JVM日志**：启用 GC 日志 (`-Xlog:gc*`)，检查垃圾回收的情况，尤其是 Full GC 频繁且回收的内存不多时。
     - **Heap Dump**：通过 `-XX:+HeapDumpOnOutOfMemoryError` 生成堆转储文件，或者使用 `jmap` 工具手动生成堆转储。

2. **分析堆转储（Heap Dump）**

   - **Heap Dump 分析工具**：
     - **Eclipse MAT** (Memory Analyzer Tool)：可以加载堆转储文件，生成泄漏分析报告，显示哪些对象占用了最多内存，以及哪些对象没有被回收。
     - **VisualVM**：这是一个 Java 性能分析工具，支持堆转储的加载与分析，并能够查看对象引用链，帮助定位导致泄漏的对象。
     - **YourKit**、**JProfiler**：这些是商业性能分析工具，功能更全面，支持实时监控、堆分析、内存泄漏检测等。

   - **分析堆转储时的关键点**：
     - 查找长时间存在的对象（例如常驻内存的单例或缓存），查看其引用链。
     - 找到不再需要但仍被引用的对象，分析其引用路径。
     - 查看某些特定类实例的数量是否异常增长。

3. **使用分析工具进行动态分析**

   - **VisualVM**：通过 `VisualVM` 可以在运行时监控堆使用情况，分析类的实例数量，查看垃圾回收日志，甚至进行堆转储。

   - **JProfiler** 或 **YourKit**：这些工具不仅提供堆分析，还能够在运行时实时显示内存分配、对象实例化情况及引用关系，帮助快速定位内存泄漏。

4. **分析代码和日志**

   - 检查哪些对象没有正确地释放或清理，例如：
     - **缓存/集合**：使用了 `HashMap`、`ArrayList` 等数据结构，但没有及时清理过期数据，导致大量对象无法回收。
     - **监听器**：事件监听器没有取消注册，导致对象无法被垃圾回收。
     - **ThreadLocal**：如果没有正确清理 `ThreadLocal` 变量，也可能导致内存泄漏，特别是在线程池中。
     - **数据库连接、文件句柄、网络连接等资源**：没有正确关闭，导致资源泄漏。

   - **日志调试**：通过启用调试日志、使用日志记录对象的创建和释放情况，帮助找出未正确释放的资源。

5. **GC 根分析（GC Roots）**

   - 通过分析对象的 GC 根，可以找到哪些对象被引用着但不再被使用。

   - **引用链分析**：可以借助工具查看哪些对象通过引用链未被回收，特别是常见的 "单例模式"、"静态变量" 等可能会引起问题。

6. **避免常见内存泄漏问题**

   - **缓存问题**：如果使用缓存，如 `HashMap`、`WeakHashMap` 等，要确保缓存数据定期清理，避免无限制增加内存占用。

   - **Listener / Observer 相关问题**：注册的事件监听器或观察者未取消注册，导致对象无法被回收。

   - **ThreadLocal**：在多线程环境下，使用完 `ThreadLocal` 后，要调用 `remove()` 方法清理线程本地变量。

   - **数据库连接池**：确保数据库连接池设置合理，避免因连接池过度增长导致内存泄漏。

7. **压力测试**
   - 使用 **JMeter** 或 **Gatling** 等压力测试工具模拟高并发场景，观察应用程序在长时间高负载下的内存使用情况。通过监控堆内存、GC 日志等，帮助捕捉内存泄漏的迹象。

8. **代码审查**
   - 定期进行代码审查，特别是对资源管理（如数据库连接、IO流等）和大对象（如大型集合、缓存）的处理，确保资源在使用完后正确释放。

9. **常见内存泄漏示例**

   - 缓存泄漏：

     ```java
     // 缓存对象没有过期清理
     private static Map<String, Object> cache = new HashMap<>();
     public void addToCache(String key, Object value) {
         cache.put(key, value);  // 长时间占用内存
     }
     ```

   - 监听器未移除：

     ```java
     public void addListener(MyListener listener) {
         eventSource.addListener(listener);  // 忘记移除
     }
     ```

定位 Java 中的内存泄漏需要通过一系列工具和方法进行分析，从确认内存泄漏开始，逐步使用堆转储、GC 日志分析、动态监控工具等手段，最终找出泄漏的根源，并根据分析结果修复代码中的内存管理问题。



### 栈帧的内部结构?

在 Java 中，**虚拟机栈**（JVM Stack）是 JVM 内存模型的一个重要组成部分，它用于存储方法调用的相关信息，如局部变量、操作数栈、方法调用的返回地址等。每个线程在执行时都会有一个独立的虚拟机栈，确保多线程间的数据隔离。

- **每个线程都有自己的虚拟机栈**，栈是按照方法调用来组织的。
- 栈中的数据是 **方法调用栈帧**（Stack Frame），每个栈帧表示一个方法的执行。
- 方法在执行时，JVM 会为每个方法分配一个栈帧，每当方法调用时会将栈帧压入栈中，方法返回时会将栈帧弹出。

每个**栈帧**（Stack Frame）中存储着：

- 局部变量表（Local Variables）
- 操作数栈（Operand Stack）(或称为表达式栈)
- 动态链接（Dynamic Linking）：指向运行时常量池的方法引用
- 方法返回地址（Return Address）：方法正常退出或异常退出的地址
- 一些附加信息

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Z0fxkgAKKLMAVEVNlW7gDqZIFzSvVq29fMr12sicgr3HIgRFtFRY8IAcDvwP6orNRRIojrn3edcS3h2ibblgAgQg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



### 什么情况下会发生栈内存溢出?

- 栈是线程私有的，他的生命周期与线程相同，每个方法在执行的时候都会创建一个栈帧，用来存储局部变量表，操作数栈，动态链接，方法出口等信息。局部变量表又包含基本数据类型，对象引用类型
- 如果线程请求的栈深度大于虚拟机所允许的最大深度，将抛出StackOverflowError异常，方法递归调用产生这种结果。
- 如果 Java 虚拟机栈可以动态扩展，并且扩展的动作已经尝试过，但是无法申请到足够的内存去完成扩展，或者在新建立线程的时候没有足够的内存去创建对应的虚拟机栈，那么 Java 虚拟机将抛出一个 OutOfMemory 异常。(线程启动过多)
- 参数 -Xss 去调整 JVM 栈的大小



### 如何监控和诊断 JVM 堆内和堆外内存使用？

了解 JVM 内存的方法有很多，具体能力范围也有区别，简单总结如下：

- 可以使用综合性的图形化工具，如 JConsole、VisualVM（注意，从 Oracle JDK 9 开始，VisualVM 已经不再包含在 JDK 安装包中）等。这些工具具体使用起来相对比较直观，直接连接到 Java 进程，然后就可以在图形化界面里掌握内存使用情况。

以 JConsole 为例，其内存页面可以显示常见的**堆内存**和**各种堆外部分**使用状态。

- 也可以使用命令行工具进行运行时查询，如 jstat 和 jmap 等工具都提供了一些选项，可以查看堆、方法区等使用数据。
- 或者，也可以使用 jmap 等提供的命令，生成堆转储（Heap Dump）文件，然后利用 jhat 或 Eclipse MAT 等堆转储分析工具进行详细分析。
- 如果你使用的是 Tomcat、Weblogic 等 Java EE 服务器，这些服务器同样提供了内存管理相关的功能。
- 另外，从某种程度上来说，GC 日志等输出，同样包含着丰富的信息。

这里有一个相对特殊的部分，就是堆外内存中的直接内存，前面的工具基本不适用，可以使用 JDK 自带的 Native Memory Tracking（NMT）特性，它会从 JVM 本地内存分配的角度进行解读。



### String 字符串存放位置？

在 Java 中，`String` 类型的特殊之处在于它可能会在两种位置存放：

1. **字符串常量池（String Pool）**：
   - 在 Java 中，所有的字符串常量（即直接通过双引号声明的字符串字面量）都会存放在字符串常量池中。字符串常量池是位于堆内存中的一块特殊的存储区域。
   - 当程序中多次使用相同的字符串字面量时，Java虚拟机（JVM）会首先在字符串常量池中查找是否存在该字符串。如果存在，就复用已有的字符串引用，而不是重新创建一个新的字符串对象，这样可以节省内存空间。
2. **堆内存（Heap）**：
   - 通过`new`关键字创建的字符串对象，或者通过字符串连接操作符（`+`）动态生成的字符串，会存放在Java堆内存中。
   - 堆内存是Java中存放对象实例的地方，包括通过构造函数创建的`String`对象。

以下是两种情况的示例：

**字符串常量池示例**：

```java
String str1 = "Hello, World!";
String str2 = "Hello, World!";

// str1和str2可能指向字符串常量池中的同一个对象
```

**堆内存示例**：

```java
String str1 = new String("Hello, World!");
String str2 = new String("Hello, World!");

// str1和str2指向堆内存中的不同对象，即使字符串内容相同
```

**注意**：

- 在 Java 7 及以后的版本中，字符串常量池被移动到了堆内存中，而不是方法区。这是为了提高 JVM 的性能和减少内存碎片。
- 字符串常量池和堆内存中的字符串对象可能通过内部的`offset`和`count`字段来共享char数组，这是通过Java的字符串共享机制实现的。
- 当使用`String.intern()`方法时，可以将一个字符串对象放入字符串常量池中。如果字符串已经存在于池中的，`intern()`方法返回的是池中字符串的引用。

```java
String str1 = new String("Hello, World!");
String str2 = str1.intern();

// str1和str2现在指向字符串常量池中的同一个对象
```



### 深拷贝和浅拷贝

简单来讲就是复制、克隆。

```java
Person p=new Person(“张三”); 
```

浅拷贝就是对对象中的数据成员进行简单赋值，如果存在动态成员或者指针就会报错。深拷贝就是对对象中存在的动态成员或指针重新开辟内存空间。



### 总体来看，JVM 把内存划分为“栈(stack)”与“堆(heap)”两大类，为何要这样设计？

个人理解，程序运行时，内存中的信息大致分为两类：

跟程序执行逻辑相关的指令数据，这类数据通常不大，而且生命周期短；

跟对象实例相关的数据，这类数据可能会很大，而且可以被多个线程长时间内反复共用，比如字符串常量、缓存对象这类。

将这两类特点不同的数据分开管理，体现了软件设计上“模块隔离”的思想。好比我们通常会把后端 service 与前端 website 解耦类似，也更便于内存管理。

- **性能和效率**：栈内存的分配和释放速度快，非常适合方法调用和局部变量的管理，而堆内存虽然管理复杂，但适合管理生命周期长、需要动态分配的对象。通过将内存分为栈和堆，JVM能够在不同场景下优化内存管理。

- **安全性**：栈内存由每个线程独立拥有，保证了线程间的数据隔离，避免了数据竞争和安全问题。堆内存虽然是共享的，但通过同步机制可以确保线程安全。

- **灵活性**：堆内存允许动态分配和释放，适应了Java语言中大量使用对象的特点，同时垃圾回收机制能够自动管理内存，减少了开发者手动管理内存的负担。

------



## 三、GC

### 谈下 Java 的内存管理和垃圾回收

内存管理就是内存的生命周期管理，包括内存的申请、压缩、回收等操作。 Java 的内存管理就是 GC，JVM 的 GC 模块不仅管理内存的回收，也负责内存的分配和压缩整理。

Java 程序的指令都运行在 JVM 上，而且我们的程序代码并不需要去分配内存和释放内存（例如 C/C++ 里需要使用的 malloc/free），那么这些操作自然是由 JVM 帮我们搞定的。

JVM 在我们创建 Java 对象的时候去分配新内存，并使用 GC 算法，根据对象的存活时间，在对象不使用之后，自动执行对象的内存回收操作。



### 简述垃圾回收机制

程序在运行的时候，为了提高性能，大部分数据都是会加载到内存中进行运算的，有些数据是需要常驻内存中的，但是有些数据，用过之后便不会再需要了，我们称这部分数据为垃圾数据。

为了防止内存被使用完，我们需要将这些垃圾数据进行回收，即需要将这部分内存空间进行释放。不同于 C++ 需要自行释放内存的机制，Java 虚拟机（JVM）提供了一种自动回收内存的机制，它是低优先级的，在正常情况下是不会执行的，只有在虚拟机空闲或者当前堆内存不足时，才会触发执行，扫描那些没有被任何引用的对象， 并将它们添加到要回收的集合中，进行回收。



### JVM 垃圾回收的时候如何确定垃圾？ 

自动垃圾收集的前提是清楚哪些内存可以被释放，内存中不再使用的空间就是垃圾

对于对象实例收集，主要是两种基本算法

- 引用计数法：引用计数算法，顾名思义，就是为对象添加一个引用计数，用于记录对象被引用的情况，如果计数为 0，即表示对象可回收。有循环引用问题

  ![Reference Counting](https://img.starfish.ink/jvm/Reference-Counting.png)

- 可达性分析：将对象及其引用关系看作一个图，选定活动的对象作为 GC Roots，然后跟踪引用链条，如果一个对象和 GC Roots 之间不可达，也就是不存在引用链条，那么即可认为是可回收对象

  ![Tracing Garbage Collectors](https://img.starfish.ink/jvm/Tracing-Garbage-Collectors.png)



### 引用计数法的缺点，除了循环引用，说一到两个?

1. 引用计数的增减开销在一些情况下会比较大，比如一些根引用的指针更新非常频繁，此时这种开销是不能忽视的（在每次赋值操作的时候都要做相当大的计算，尤其这里面还有递归调用）
2. 对象引用计数器本身是需要空间的，而计数器要占用多少位也是一个问题
3. 一个致命缺陷是循环引用，就是， objA引用了objB，objB也引用了objA，但是除此之外，再没有其他的地方引用这两个对象了，这两个对象的引用计数就都是1。这种情况下，这两个对象是不能被回收的。



### 你知道什么是 GC Roots 吗？GC Roots 如何确定，哪些对象可以作为 GC Roots?

为了解决引用计数法的循环引用问题，Java 使用了可达性分析的方法

可达性算法的原理是以一系列叫做 **GC Root** 的对象为起点出发，引出它们指向的下一个节点，再以下个节点为起点，引出此节点指向的下一个结点。。。（这样通过 GC Root 串成的一条线就叫引用链），直到所有的结点都遍历完毕，如果相关对象不在任意一个以 **GC Root** 为起点的引用链中，则这些对象会被判断为「垃圾」,会被 GC 回收。

**哪些对象可以作为 GC Root 呢，有以下几类**

- 虚拟机栈（栈帧中的本地变量表）中引用的对象
- 方法区中类静态属性引用的对象
- 方法区中常量引用的对象
- 本地方法栈中 JNI（即一般说的 Native 方法）引用的对象
- Java 虚拟机内部的引用，如基本数据类型对应的 Class 对象，一些常驻的异常对象
- 所有被同步锁（synchronized 关键字）持有的对象
- 反映 Java 虚拟机内部情况的 JMXBean、JVMTI 中注册的回调、本地代码缓存

在实际运行过程中，JVM 会通过维护一张全局的引用表来管理 GC Roots。这个表包含了所有活动线程、静态变量、常量引用和 JNI 全局引用等。垃圾回收器在进行标记阶段时，会遍历这个全局引用表，标记从 GC Roots 开始的所有可达对象。



### 哪些内存区域需要 GC ?

 thread 独享的区域：PC Regiester、JVM Stack、Native Method Stack，其生命周期都与线程相同（即与线程共生死），所以无需 GC。而线程共享的 Heap 区、Method Area 则是 GC 关注的重点对象



### 对象的死亡过程?

在 Java 中，对象被垃圾回收器（Garbage Collector, GC）判定为“死亡”并回收内存的过程，涉及 **两次标记** 和潜在的 **自救机会**（通过 `finalize()` 方法）

**一、第一次标记：可达性分析**

1. **触发条件**：当 JVM 开始垃圾回收时，首先通过 **可达性分析算法（Reachability Analysis）** 判断对象是否存活。

2. **GC Roots 的引用链**

   - GC Roots 对象包括：
     - 虚拟机栈（栈帧中的局部变量表）引用的对象。
     - 方法区中静态变量引用的对象。
     - 方法区中常量引用的对象（如字符串常量池）。
     - JNI（Java Native Interface）引用的本地方法栈对象。

   - **遍历过程**：从 GC Roots 出发，递归遍历所有引用链。未被遍历到的对象即为不可达对象。

3. **第一次标记结果**

   - **存活对象**：与 GC Roots 存在引用链，继续保留。

   - **待回收对象**：不可达，被标记为“可回收”，进入第二次标记阶段。

**二、第二次标记：finalize() 方法的自救机会**

1. **筛选条件**

   - 若对象未覆盖 `finalize()` 方法，或 `finalize()` 已被调用过，则直接判定为死亡，无需进入队列。

   - 若对象覆盖了 `finalize()` 且未被调用过，则将其加入 **F-Queue 队列**，进入自救流程。

2. **F-Queue 与 Finalizer 线程**

   - **F-Queue**：一个低优先级的队列，存放待执行 `finalize()` 的对象。

   - Finalizer 线程：JVM 创建的守护线程，负责异步执行队列中对象的 `finalize()` 方法。
     - **注意**：`finalize()` 的执行不保证完成（如线程优先级低或方法死循环）。

3. **自救机制**

   在 `finalize()` 方法中，对象可通过重新与 GC Roots 引用链建立关联来自救：

   ```java
   public class Zombie {
       private static Zombie SAVE_HOOK;
   
       @Override
       protected void finalize() throws Throwable {
           super.finalize();
           System.out.println("finalize() 执行，对象自救");
           SAVE_HOOK = this; // 重新建立与 GC Roots 的关联
       }
   
       public static void main(String[] args) throws Exception {
           SAVE_HOOK = new Zombie();
           SAVE_HOOK = null; // 断开引用，触发 GC
           System.gc();
           Thread.sleep(500); // 等待 Finalizer 线程执行 finalize()
           if (SAVE_HOOK != null) {
               System.out.println("对象存活");
           } else {
               System.out.println("对象被回收");
           }
       }
   }
   
   
   ----- 输出结果
   finalize() 执行，对象自救
   对象存活
   ```

- 关键点：
  - 对象通过 `finalize()` 将 `this` 赋值给静态变量 `SAVE_HOOK`，重新建立与 GC Roots 的引用链。
  - 自救仅生效一次，第二次 GC 时对象仍会被回收。

**三、对象回收的最终判定**

1. **第二次标记结果**

   - **自救成功**：对象重新与引用链关联，移出待回收集合。

   - **自救失败**：对象仍不可达，被标记为“死亡”，等待内存回收。

2. **回收内存**

   根据垃圾收集算法（如标记-清除、复制、标记-整理等），将死亡对象的内存回收。



### 说一说常用的 GC 算法及其优缺点

垃圾回收（Garbage Collection, GC）是自动内存管理的关键部分，用于回收不再使用的对象，防止内存泄漏。以下是一些常用的 GC 算法及其优缺点：

| 算法                                | 思路                                                         | 优点                                                         | 缺点                                                         |
| ----------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 标记-清除（Mark-Sweep）             | ![10.jpg](https://s0.lgstatic.com/i/image6/M00/56/27/Cgp9HWEsmp-AV969AAAXLK9JRog778.jpg)黑色区域表示待清理的垃圾对象，标记出来后直接清空 | 简单易懂。<br>不需要移动对象，保留了对象的原始引用。         | 效率问题：标记和清除过程可能产生较长的停顿时间（Stop-the-World）。 <br>内存碎片：清除后内存中可能会有大量碎片，影响后续内存分配 |
| 标记-整理（Mark-Compact）           | ![12.jpg](https://s0.lgstatic.com/i/image6/M00/56/28/Cgp9HWEsmuuAVl1CAAAXeNiLceQ497.jpg)将垃圾对象清理掉后，同时将剩下的存活对象进行整理挪动（类似于 windows 的磁盘碎片整理)，保证它们占用的空间连续 | 解决了内存碎片问题，通过整理阶段移动对象，减少内存碎片。     | 效率问题：整理阶段可能需要移动对象，增加GC的开销。 移动对象可能导致额外的开销，因为需要更新所有指向移动对象的引用。 |
| 复制（Copying）                     | ![11.jpg](https://s0.lgstatic.com/i/image6/M00/56/30/CioPOWEsmsiAaFzWAAAZCCjflgw041.jpg)将内存对半分，总是保留一块空着（上图中的右侧），将左侧存活的对象（浅灰色区域）复制到右侧，然后左侧全部清空 | 简单且高效，特别适合新生代GC。 没有内存碎片问题，因为复制算法通过复制存活对象到另一个空间来避免碎片。 | 空间利用率低：只使用堆的一半（或者根据算法不同，使用的比例不同）。 复制过程可能产生短暂的停顿。 |
| 分代收集（Generational Collection） | ![14.jpg](https://s0.lgstatic.com/i/image6/M00/56/28/Cgp9HWEsmzOALLLdAAAteML8kLI706.jpg) | 基于弱分代假设（大部分对象都是朝生夕死的），通过将对象分配到不同的代来优化GC性能。 新生代使用复制算法，老年代使用标记-清除或标记-整理算法。 | 对于长寿命的对象，如果频繁晋升到老年代，可能会增加老年代的GC压力。 需要维护多个数据结构来区分不同代的对象。 |

每种GC算法都有其适用场景和限制。选择合适的GC算法取决于应用程序的具体需求，包括对延迟的敏感度、堆内存的大小、对象的生命周期特性等因素。现代 JVM 通常提供了多种 GC 算法，允许开发者根据需要选择或调整。



### JVM中一次完整的GC流程是怎样的，对象如何晋升到老年代

**思路：** 先描述一下Java堆内存划分，再解释 Minor GC，Major GC，full GC，描述它们之间转化流程。

- Java堆 = 老年代 + 新生代

- 新生代 = Eden + S0 + S1

- 当 Eden 区的空间满了， Java虚拟机会触发一次 Minor GC，以收集新生代的垃圾，存活下来的对象，则会转移到 Survivor区。

- **大对象**（需要大量连续内存空间的Java对象，如那种很长的字符串）**直接进入老年态**；

- 如果对象在 Eden 出生，并经过第一次 Minor GC 后仍然存活，并且被 Survivor 容纳的话，年龄设为 1，每熬过一次 Minor GC，年龄+1，**若年龄超过一定限制（15），则被晋升到老年态**。即**长期存活的对象进入老年态**。

  > s0 与 s1 的角色其实会互换，来回移动
  >
  > <mark>注：这里其实已经综合运用了“【标记-清理eden】+【标记-复制 eden->s0】”算法。</mark>

- 老年代满了而**无法容纳更多的对象**，Minor GC 之后通常就会进行Full GC，Full GC  清理整个内存堆 – **包括年轻代和年老代**。

- Major GC **发生在老年代的GC**，**清理老年区**，经常会伴随至少一次Minor GC，**比Minor GC慢10倍以上**。

![img](https://static001.infoq.cn/resource/image/e6/69/e663bd3043c6b3465edc1e7313671d69.png)



### GC分代年龄为什么最大为15？

> 在 hotspot 虚拟机中，对象在堆内存中的存储布局可以划分为三部分：**对象头，实例数据，对齐填充**。
> HotSpot虚拟机对象的对象头部包含两类信息
>
> - 用于存储对象自身的运行时数据，如HashCode，GC的分代年龄，锁状态标志，线程持有的锁，偏向线程ID，偏向时间戳等。这部数据的长度在32位和64位的虚拟机中分别为32比特和64比特，官方称为“Mark word”。
> - 另一种是类型指针，即对象指向它的类型元数据的指针，Java通过这个指针确定该对象是哪个类的实例。但是并不是所有的虚拟机实现都必须在对象数据上保留类型指针，换句话说，查找对象的元数据信息不一定要经过对象本身。
>
> 在32位的HotSpot虚拟机中，如对象未被同步锁锁定的状态下，Mark Word的32个比特存储空间中的25个比特用于存储对象的HashCode，**4个比特存储对象分代年龄**，2个比特存储锁标志位，一个比特固定为0.
>
> **因为Object Header采用4个bit位来保存年龄，4个bit位能表示的最大数就是15！**

在 JVM 的实现中，尤其是 HotSpot 虚拟机中，分代年龄的最大值是 15。这是由 JVM 的设计和垃圾收集器的实现所决定的，主要原因如下：

**标记字段的位数限制**：

- 在 HotSpot VM 中，对象头的 Mark Word 里存储了对象的年龄信息。对象头的 Mark Word 是一个 32 位或者 64 位的字段 (取决于 JVM 的运行模式)。
- 为了高效地存储和管理对象的年龄，JVM 为年龄字段分配了 4 位。这意味着对象年龄的范围是 0 到 15，即最大为 15。

**合理的晋升策略**：

- 在分代垃圾收集策略中，大多数对象在年轻代创建，并且很快变得不可达而被回收。少数存活较长的对象会逐渐晋升到老年代。
- 通过设定最大年龄为 15，可以确保在适当的时间点将长期存活的对象晋升到老年代，减少年轻代的负担。
- 这一设计是基于常见的对象生命周期分布 (即大部分对象短命，少数对象长寿) 而进行的优化。

**性能和效率**：

- 使用 4 位来表示对象年龄，使得垃圾收集器能够高效地处理和管理对象的晋升逻辑。
- 限制年龄最大为 15 简化了垃圾收集器的实现，并且足以区分短命对象和长命对象，从而优化垃圾收集的性能。



### 你知道哪几种垃圾收集器，各自的优缺点，重点讲下cms和G1，包括原理，流程，优缺点。

> GC 垃圾回收算法和垃圾收集器的关系？分别是什么请你谈谈？

> 实际上，垃圾收集器（GC，Garbage Collector）是和具体 JVM 实现紧密相关的，不同厂商（IBM、Oracle），不同版本的 JVM，提供的选择也不同。
>
> 不算上后面出现的神器 ZGC，历史上出现过 7 种经典的垃圾回收器。
>
> ![25.png](https://s0.lgstatic.com/i/image6/M00/56/29/Cgp9HWEsoXuAR2WEAAEJEJx1RMY327.png)
>
> 这些回收器都是基于分代的，把 G1 除外，按回收的分代划分如下。
>
> - 横线以上的 3 种：Serial、ParNew、Parellel Scavenge 都是回收年轻代的；
>
> - 横线以下的 3 种：CMS、Serial Old、Parallel Old 都是回收老年代的。

**思路：** 一定要记住典型的垃圾收集器，尤其 cms 和 G1，它们的原理与区别，涉及的垃圾回收算法。

#### a、几种垃圾收集器：

- **Serial收集器：** 单线程的收集器，收集垃圾时，必须 stop the world，使用复制算法。无需维护复杂的数据结构，初始化也简单，所以一直是 Client 模式下 JVM 的默认选项

- **ParNew收集器：**  一款多线程的收集器，采用复制算法，主要工作在 Young 区，可以通过 `-XX:ParallelGCThreads` 参数来控制收集的线程数，整个过程都是 STW 的，常与 CMS 组合使用

- **Parallel Scavenge收集器：** 新生代收集器，复制算法的收集器，并发的多线程收集器，目标是达到一个可控的吞吐量。如果虚拟机总共运行100分钟，其中垃圾花掉1分钟，吞吐量就是99%。

- **Serial Old收集器：** 是Serial收集器的老年代版本，单线程收集器，使用标记整理算法。

- **Parallel Old收集器：** 是Parallel Scavenge收集器的老年代版本，使用多线程，标记-整理算法。

- **CMS(Concurrent Mark Sweep) 收集器：** 是一种以获得最短回收停顿时间为目标的收集器，**标记清除算法，运作过程：初始标记，并发标记，重新标记，并发清除**，收集结束会产生大量空间碎片。其中初始标记和重新标记会 STW。另外，既然强调了并发（Concurrent），CMS 会占用更多 CPU 资源，并和用户线程争抢。多数应用于互联网站或者 B/S 系统的服务器端上，JDK9 被标记弃用，JDK14 被删除，详情可见 [JEP 363](https://openjdk.java.net/jeps/363)。

  ![26.jpg](https://s0.lgstatic.com/i/image6/M00/56/29/Cgp9HWEsoZSAEqicAABcDI3t_Mo844.jpg)

- **G1收集器：** 一种兼顾吞吐量和停顿时间的 GC 实现，是 Oracle JDK 9 以后的默认 GC 选项。

  G1 GC 仍然存在着年代的概念，但是其内存结构并不是简单的条带式划分，而是类似棋盘的一个个 Region。Region 之间是复制算法，但整体上实际可看作是标记 - 整理（Mark-Compact）算法，可以有效地避免内存碎片，尤其是当 Java 堆非常大的时候，G1 的优势更加明显。

  标记整理算法实现，**运作流程主要包括以下：初始标记，并发标记，最终标记，筛选标记**。不会产生空间碎片，可以精确地控制停顿。

- **Z Garbage Collector (ZGC)**（Z 垃圾回收器）：ZGC 是 **低延迟垃圾回收器**，它的设计目标是将垃圾回收的停顿时间控制在毫秒级别。ZGC 是一种并行、并发、分代的垃圾回收器，特别适合需要低停顿和大堆内存的应用。

  **适用场景**：适用于要求极低延迟和大内存的应用，如大数据处理、高频交易等。

  特点：

  - 设计目标是 **低延迟**。
  - 适合非常大的堆内存（例如超过几百 GB）。
  - 默认配置：`-XX:+UseZGC`（从 JDK 15 开始支持）



#### b、CMS 收集器和 G1 收集器的区别：

目前使用最多的是 CMS 和 G1 收集器，二者都有分代的概念，主要内存结构如下

![img](https://p1.meituan.net/travelcube/3a6dacdd87bfbec847d33d09dbe6226d199915.png)

- CMS 收集器是老年代的收集器，可以配合新生代的 Serial 和 ParNew 收集器一起使用；
- G1 收集器收集范围是老年代和新生代，不需要结合其他收集器使用；
- CMS 收集器以最小的停顿时间为目标的收集器；
- G1 GC 这是一种兼顾吞吐量和停顿时间的 GC 实现，是 Oracle JDK 9 以后的默认 GC 选项。
- G1 GC 仍然存在着年代的概念，但是其内存结构并不是简单的条带式划分，而是类似棋盘的一个个 region。Region 之间是复制算法，但整体上实际可看作是标记 - 整理（Mark-Compact）算法，可以有效地避免内存碎片，尤其是当 Java 堆非常大的时候，G1 的优势更加明显。G1 吞吐量和停顿表现都非常不错，并且仍然在不断地完善，与此同时 CMS 已经在 JDK 9 中被标记为废弃（deprecated），所以 G1 GC 值得你深入掌握。
- CMS 收集器是使用“标记-清除”算法进行的垃圾回收，容易产生内存碎片

> JDK 又增加了两种全新的 GC 方式，分别是：
>
> - [Epsilon GC](http://openjdk.java.net/jeps/318)，简单说就是个不做垃圾收集的 GC，似乎有点奇怪，有的情况下，例如在进行性能测试的时候，可能需要明确判断 GC 本身产生了多大的开销，这就是其典型应用场景。
> - [ZGC](http://openjdk.java.net/jeps/333)，这是 Oracle 开源出来的一个超级 GC 实现，具备令人惊讶的扩展能力，比如支持 T bytes 级别的堆大小，并且保证绝大部分情况下，延迟都不会超过 10 ms。虽然目前还处于实验阶段，仅支持 Linux 64 位的平台，但其已经表现出的能力和潜力都非常令人期待。



### **Minor GC（小型 GC）**

收集年轻代内存的 GC 事件称为 Minor GC。关于 Minor GC 事件，我们需要了解一些相关的内容：

1. 当 JVM 无法为新对象分配内存空间时就会触发 Minor GC（ 一般就是 Eden 区用满了）。如果对象的分配速率很快，那么 Minor GC 的次数也就会很多，频率也就会很快。

2. Minor GC 事件不处理老年代，所以会把所有从老年代指向年轻代的引用都当做 GC Root。从年轻代指向老年代的引用则在标记阶段被忽略。

3. 与我们一般的认知相反，Minor GC 每次都会引起 STW 停顿（stop-the-world），挂起所有的应用线程。对大部分应用程序来说，Minor GC 的暂停时间可以忽略不计，因为 Eden 区里面的对象大部分都是垃圾，也不怎么复制到存活区/老年代。但如果不符合这种情况，那么很多新创建的对象就不能被 GC 清理，Minor GC 的停顿时间就会增大，就会产生比较明显的 GC 性能影响。

   

### Minor GC  和 Full GC 触发条件

我们知道，除了 Minor GC 外，另外两种 GC 事件则是：

- Major GC（大型 GC）：清理老年代空间（Old Space）的 GC 事件。
- Full GC（完全 GC）：清理整个堆内存空间的 GC 事件，包括年轻代空间和老年代空间。



### 什么时候会触发 Full GC ?

1. `System.gc()` 方法的调用

   此方法的调用是建议 JVM 进行 Full GC，虽然只是建议而非一定，但很多情况下它会触发 Full GC，从而增加Full GC 的频率，也即增加了间歇性停顿的次数。强烈影响系建议能不使用此方法就别使用，让虚拟机自己去管理它的内存，可通过 -XX:+ DisableExplicitGC 来禁止 RMI 调用 System.gc。

2. 老年代空间不足

   老年代空间只有在新生代对象转入及创建大对象、大数组时才会出现不足的现象，当执行 Full GC 后空间仍然不足，则抛出如下错误：java.lang.OutOfMemoryError: Java heap space 为避免以上两种状况引起的 Full GC，调优时应尽量做到让对象在 Minor GC 阶段被回收、让对象在新生代多存活一段时间及不要创建过大的对象及数组。

3. 老年代的内存使用率达到了一定阈值（可通过参数调整），直接触发 FGC

4. 空间分配担保：在 YGC 之前，会先检查老年代最大可用的连续空间是否大于新生代所有对象的总空间。如果小于，说明 YGC 是不安全的，则会查看参数 HandlePromotionFailure 是否被设置成了允许担保失败，如果不允许则直接触发 Full GC；如果允许，那么会进一步检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果小于也会触发 Full GC

5. Metaspace（元空间）在空间不足时会进行扩容，当扩容到了-XX:MetaspaceSize 参数的指定值时，也会触发FGC



### System.gc() 和 Runtime.gc() 会做什么事情

`java.lang.System.gc()` 只是 `java.lang.Runtime.getRuntime().gc()` 的简写，两者的行为没有任何不同

其实基本没什么机会用得到这个命令，因为这个命令只是建议 JVM 安排 GC 运行，还有可能完全被拒绝。 GC 本身是会周期性的自动运行的，由 JVM 决定运行的时机，而且现在的版本有多种更智能的模式可以选择，还会根据运行的机器自动去做选择，就算真的有性能上的需求，也应该去对 GC 的运行机制进行微调，而不是通过使用这个命令来实现性能的优化



### SafePoint 是什么

比如 GC 的时候必须要等到 Java 线程都进入到 safepoint 的时候 VMThread 才能开始 执行 GC，

1. 循环的末尾 (防止大循环的时候一直不进入 safepoint，而其他线程在等待它进入 safepoint)
2. 方法返回前
3. 调用方法的call之后 
4. 抛出异常的位置



### 你们用的是什么 GC，都有哪些配置

```
APP_OPTS:-Xms6656m -Xmx6656m -XX:MetaspaceSize=512m -XX:MaxMetaspaceSize=1024m -XX:+UseG1GC -XX:+HeapDumpOnOutOfMemoryError 
-XX:HeapDumpPath=/home/finance/Logs/***Heap.hprof 
-verbose:gc -Xloggc:/home/finance/Logs/gc.log 
-XX:+PrintGC -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintHeapAtGC 
-Dprofiler.msxf.thread.pool.enable=true  -Dprofiler.thread.pool.spring.enable=true  
-Dprofiler.msxf.thread.pool.reject-handler.enable=true -Dprofiler.jdbc.druid.poolmetric=true
```

```
xxx      143       1 54 Jun07 ?        1-13:05:06 /opt/local/jdk/bin/java -Djava.util.logging.config.file=/opt/local/tomcat/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -server -Xmn1024m -Xms22938M -Xmx22938M -XX:PermSize=512m -XX:MaxPermSize=512m -XX:ParallelGCThreads=3 -XX:+UseConcMarkSweepGC -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=80 -XX:+CMSScavengeBeforeRemark -XX:SoftRefLRUPolicyMSPerMB=0 -XX:ParallelGCThreads=3 -Xss1m -XX:+PrintGCDateStamps -XX:+PrintGCDetails -Xloggc:/opt/logs/gc.log -verbose:gc -XX:+DisableExplicitGC -Dsun.rmi.transport.tcp.maxConnectionThreads=400 -XX:+ParallelRefProcEnabled -XX:+PrintTenuringDistribution -Dsun.rmi.transport.tcp.handshakeTimeout=2000 -Xdebug -Xrunjdwp:transport=dt_socket,address=22062,server=y,suspend=n -Dcom.sun.management.snmp.port=18328 -Dcom.sun.management.snmp.interface=0.0.0.0 -Dcom.sun.management.snmp.acl=false -javaagent:/opt/opbin/service_control/script/jmx_prometheus_javaagent-0.13.0.jar=9999:/opt/opbin/service_control/script/config.yaml -Djdk.tls.ephemeralDHKeySize=2048 -Djava.protocol.handler.pkgs=org.apache.catalina.webresources -Dignore.endorsed.dirs= -classpath /opt/local/tomcat/bin/bootstrap.jar:/opt/local/tomcat/bin/tomcat-juli.jar -Dcatalina.base=/opt/local/tomcat -Dcatalina.home=/opt/local/tomcat -Djava.io.tmpdir=/opt/local/tomcat/temp org.apache.catalina.startup.Bootstrap start start
```



### 讲一讲 G1？ 

G1（Garbage First）垃圾收集器是Java虚拟机的一种先进的垃圾收集器，设计目的是在大内存和多处理器环境中提供低停顿时间和高吞吐量的垃圾收集性能。它在JDK 7u4中引入，并在JDK 9中成为推荐的垃圾收集器，用于替代CMS（Concurrent Mark-Sweep）收集器。

G1垃圾收集器的主要特点：

> - **分区内存**：G1将堆划分为多个相等大小的独立区域（Regions），每个区域可以作为Eden、Survivor或老年代空间。这样可以更灵活地管理内存，减少内存碎片。
> - **并行和并发**：G1利用多核处理器的优势，进行并行和并发的垃圾收集操作，减少应用程序的停顿时间。
> - **预测性暂停时间**：G1允许用户设定期望的最大暂停时间目标，并通过合理安排垃圾收集任务来尽量满足这个目标。
> - **混合收集**：G1在老年代内存占用超过一定比例后，会同时收集年轻代和部分老年代内存，称为混合收集（Mixed Collection）。
> - **全堆压缩**：G1在垃圾收集时，会将存活对象移动到较少的区域中，释放出连续的空闲内存区域，减少内存碎片，提高内存利用率。

首先，先来整体了解一下 G1 GC 的内部结构和主要机制。

从内存区域的角度，G1 同样存在着年代的概念，但是与我前面介绍的内存结构很不一样，其内部是类似棋盘状的一个个 region 组成

![](https://img2018.cnblogs.com/blog/157264/201903/157264-20190321131647282-1604848487.png)

region 的大小是一致的，数值是在 1M 到 32M 字节之间的一个 2 的幂值数，JVM 会尽量划分 2048 个左右、同等大小的 region。当然这个数字既可以手动调整，G1 也会根据堆大小自动进行调整。

在 G1 实现中，年代是个逻辑概念，具体体现在，一部分 region 是作为 Eden，一部分作为 Survivor，除了意料之中的 Old region，G1 会将超过 region 50% 大小的对象（在应用中，通常是 byte 或 char 数组）归类为 Humongous 对象，并放置在相应的 region 中。逻辑上，Humongous region 算是老年代的一部分，因为复制这样的大对象是很昂贵的操作，并不适合新生代 GC 的复制算法。

> 你可以思考下 region 设计有什么副作用？
>
> 例如，region 大小和大对象很难保证一致，这会导致空间的浪费。不知道你有没有注意到，我的示意图中有的区域是 Humongous 颜色，但没有用名称标记，这是为了表示，特别大的对象是可能占用超过一个 region 的。并且，region 太小不合适，会令你在分配大对象时更难找到连续空间，这是一个长久存在的情况，请参考[OpenJDK 社区的讨论](http://mail.openjdk.java.net/pipermail/hotspot-gc-use/2017-November/002726.html)。这本质也可以看作是 JVM 的 bug，尽管解决办法也非常简单，直接设置较大的 region 大小，参数如下：
>
> ```
> -XX:G1HeapRegionSize=<N, 例如 16>M
> ```
>

从 GC 算法的角度，G1 选择的是复合算法，可以简化理解为：

- 在新生代，G1 采用的仍然是并行的复制算法，所以同样会发生 Stop-The-World 的暂停。
- 在老年代，大部分情况下都是并发标记，而整理（Compact）则是和新生代 GC 时捎带进行，并且不是整体性的整理，而是增量进行的。

习惯上人们喜欢把新生代 GC（Young GC）叫作 Minor GC，老年代 GC 叫作 Major GC，区别于整体性的 Full GC。但是现代 GC 中，这种概念已经不再准确，对于 G1 来说：

- Minor GC 仍然存在，虽然具体过程会有区别，会涉及 Remembered Set 等相关处理。
- 老年代回收，则是依靠 Mixed GC。并发标记结束后，JVM 就有足够的信息进行垃圾收集，Mixed GC 不仅同时会清理 Eden、Survivor 区域，而且还会清理部分 Old 区域。可以通过设置下面的参数，指定触发阈值，并且设定最多被包含在一次 Mixed GC 中的 region 比例。

```sh
–XX:G1MixedGCLiveThresholdPercent
–XX:G1OldCSetRegionThresholdPercent
```

从 G1 内部运行的角度，下面的示意图描述了 G1 正常运行时的状态流转变化，当然，在发生逃逸失败等情况下，就会触发 Full GC。
![img](data:image/png;base64,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)

G1 相关概念非常多，有一个重点就是 **Remembered Set**，用于记录和维护 region 之间对象的引用关系。为什么需要这么做呢？试想，新生代 GC 是复制算法，也就是说，类似对象从 Eden 或者 Survivor 到 to 区域的“移动”，其实是“复制”，本质上是一个新的对象。在这个过程中，需要必须保证老年代到新生代的跨区引用仍然有效。下面的示意图说明了相关设计。

> 主要用于解决分代垃圾收集器中的跨代引用问题

![img](data:image/png;base64,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BcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHOh/VEJItoJw6O/DNokghJRm2Ab7Q0EAAEQhv7gRQrIR+EFBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkBL5/wFtF3cnBSEEfQAAAABJRU5ErkJggg==)

G1 的很多开销都是源自 Remembered Set，例如，它通常约占用 Heap 大小的 20% 或更高，这可是非常可观的比例。并且，我们进行对象复制的时候，因为需要扫描和更改 Card Table 的信息，这个速度影响了复制的速度，进而影响暂停时间。

接下来，我介绍下大家可能还不了解的 G1 行为变化

- 上面提到了 Humongous 对象的分配和回收，这是很多内存问题的来源，Humongous region 作为老年代的一部分，通常认为它会在并发标记结束后才进行回收，但是在新版 G1 中，Humongous 对象回收采取了更加激进的策略。
  我们知道 G1 记录了老年代 region 间对象引用，Humongous 对象数量有限，所以能够快速的知道是否有老年代对象引用它。如果没有，能够阻止它被回收的唯一可能，就是新生代是否有对象引用了它，但这个信息是可以在 Young GC 时就知道的，所以完全可以在 Young GC 中就进行 Humongous 对象的回收，不用像其他老年代对象那样，等待并发标记结束。
- 在垃圾收集过程中，G1 会把新创建的字符串对象放入队列中，然后在 Young GC 之后，并发地（不会 STW）将内部数据（char 数组，JDK 9 以后是 byte 数组）一致的字符串进行排重，也就是将其引用同一个数组。你可以使用下面参数激活：

```
-XX:+UseStringDeduplication
```

注意，这种排重虽然可以节省不少内存空间，但这种并发操作会占用一些 CPU 资源，也会导致 Young GC 稍微变慢。

- 类型卸载是个长期困扰一些 Java 应用的问题，一个类只有当加载它的自定义类加载器被回收后，才能被卸载。元数据区替换了永久代之后有所改善，但还是可能出现问题。

G1 的类型卸载有什么改进吗？很多资料中都谈到，G1 只有在发生 Full GC 时才进行类型卸载，但这显然不是我们想要的。你可以加上下面的参数查看类型卸载：

```
-XX:+TraceClassUnloading
```

幸好现代的 G1 已经不是如此了，8u40 以后，G1 增加并默认开启下面的选项：

```
-XX:+ClassUnloadingWithConcurrentMark
```

也就是说，在并发标记阶段结束后，JVM 即进行类型卸载。

- 我们知道老年代对象回收，基本要等待并发标记结束。这意味着，如果并发标记结束不及时，导致堆已满，但老年代空间还没完成回收，就会触发 Full GC，所以触发并发标记的时机很重要。早期的 G1 调优中，通常会设置下面参数，但是很难给出一个普适的数值，往往要根据实际运行结果调整

```
-XX:InitiatingHeapOccupancyPercent
```

在 JDK 9 之后的 G1 实现中，这种调整需求会少很多，因为 JVM 只会将该参数作为初始值，会在运行时进行采样，获取统计数据，然后据此动态调整并发标记启动时机。对应的 JVM 参数如下，默认已经开启：

```
-XX:+G1UseAdaptiveIHOP
```

- 在现有的资料中，大多指出 G1 的 Full GC 是最差劲的单线程串行 GC。其实，如果采用的是最新的 JDK，你会发现 Full GC 也是并行进行的了，在通用场景中的表现还优于 Parallel GC 的 Full GC 实现。

当然，还有很多其他的改变，比如更快的 Card Table 扫描等，这里不再展开介绍，因为它们并不带来行为的变化，基本不影响调优选择。

前面介绍了 G1 的内部机制，并且穿插了部分调优建议，下面从整体上给出一些调优的建议。

首先，**建议尽量升级到较新的 JDK 版本**，从上面介绍的改进就可以看到，很多人们常常讨论的问题，其实升级 JDK 就可以解决了。

第二，掌握 GC 调优信息收集途径。掌握尽量全面、详细、准确的信息，是各种调优的基础，不仅仅是 GC 调优。我们来看看打开 GC 日志，这似乎是很简单的事情，可是你确定真的掌握了吗？

除了常用的两个选项，

```
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
```

还有一些非常有用的日志选项，很多特定问题的诊断都是要依赖这些选项：

```
-XX:+PrintAdaptiveSizePolicy // 打印 G1 Ergonomics 相关信息
```

我们知道 GC 内部一些行为是适应性的触发的，利用 PrintAdaptiveSizePolicy，我们就可以知道为什么 JVM 做出了一些可能我们不希望发生的动作。例如，G1 调优的一个基本建议就是避免进行大量的 Humongous 对象分配，如果 Ergonomics 信息说明发生了这一点，那么就可以考虑要么增大堆的大小，要么直接将 region 大小提高。

如果是怀疑出现引用清理不及时的情况，则可以打开下面选项，掌握到底是哪里出现了堆积。

```
-XX:+PrintReferenceGC
```

另外，建议开启选项下面的选项进行并行引用处理。

```
-XX:+ParallelRefProcEnabled
```

需要注意的一点是，JDK 9 中 JVM 和 GC 日志机构进行了重构，其实我前面提到的**PrintGCDetails 已经被标记为废弃**，而**PrintGCDateStamps 已经被移除**，指定它会导致 JVM 无法启动。可以使用下面的命令查询新的配置参数。

```
java -Xlog:help
```

最后，来看一些通用实践，理解了我前面介绍的内部结构和机制，很多结论就一目了然了，例如：

- 如果发现 Young GC 非常耗时，这很可能就是因为新生代太大了，我们可以考虑减小新生代的最小比例。

```
-XX:G1NewSizePercent
```

降低其最大值同样对降低 Young GC 延迟有帮助。

```
-XX:G1MaxNewSizePercent
```

如果我们直接为 G1 设置较小的延迟目标值，也会起到减小新生代的效果，虽然会影响吞吐量。

- 如果是 Mixed GC 延迟较长，我们应该怎么做呢？

还记得前面说的，部分 Old region 会被包含进 Mixed GC，减少一次处理的 region 个数，就是个直接的选择之一。
我在上面已经介绍了 G1OldCSetRegionThresholdPercent 控制其最大值，还可以利用下面参数提高 Mixed GC 的个数，当前默认值是 8，Mixed GC 数量增多，意味着每次被包含的 region 减少。

```
-XX:G1MixedGCCountTarget
```



### Java 11 的 ZGC 和 Java12 的 Shenandoah 了解过吗

ZGC 即 Z Garbage Collector（Z 垃圾收集器，Z 有 Zero 的意思，主要作者是 Oracle 的 Per Liden），这是一款低停顿、高并发，基于小堆块（region）、不分代的增量压缩式垃圾收集器，平均 GC 耗时不到 2 毫秒，最坏情况下的暂停时间也不超过 10 毫秒。

像 G1 和 ZGC 之类的现代 GC 算法，只要空闲的堆内存足够多，基本上不触发 FullGC。

所以很多时候，只要条件允许，加内存才是最有效的解决办法。

既然低延迟是 ZGC 的核心看点，而 JVM 低延迟的关键是 GC 暂停时间，那么我们来看看有哪些方法可以减少 GC 暂停时间：

- 使用多线程“并行”清理堆内存，充分利用多核 CPU 的资源；
- 使用“分阶段”的方式运行 GC 任务，把暂停时间打散；
- 使用“增量”方式进行处理，每次 GC 只处理一部分堆内存（小堆块，region）；
- 让 GC 与业务线程“并发”执行，例如增加并发标记，并发清除等阶段，从而把暂停时间控制在非常短的范围内（目前来说还是必须使用少量的 STW 暂停，比如根对象的扫描，最终标记等阶段）；
- 完全不进行堆内存整理，比如 Golang 的 GC 就采用这种方式（题外话）。



### ZGC 在 G1 基础上做了哪些改进？

在 G1 的基础上，它做了如下 7 点改进（JDK 11 开始引入）

1. 动态调整大小的 Region

   ![ZGC](https://img.starfish.ink/jvm/ZGC.png)

2. 不分代，干掉了 RSets

   G1 中每个 Region 需要借助额外的 RSets 来记录“谁引用了我”，占用了额外的内存空间，每次对象移动时，RSets 也需要更新，会产生开销。

3. 带颜色的指针 Colored Pointer

   ![getting-started-with-z-garbage-collectorzgc-in-java-11-tutorial-img-1](https://img.starfish.ink/jvm/cc38abc5ba683cf300bdd6e89f426212.png)

   这里的指针类似 Java 中的引用，意为对某块虚拟内存的引用。ZGC 采用了64位指针（注：目前只支持 linux 64 位系统），将 42-45 这 4 个 bit 位置赋予了不同含义，即所谓的颜色标志位，也换为指针的 metadata。

   - finalizable 位：仅 finalizer（类比 C++ 中的析构函数）可访问；

   - remap 位：指向对象当前（最新）的内存地址，参考下面提到的relocation；

   - marked0 && marked1 位：用于标志可达对象。

   这 4 个标志位，同一时刻只会有 1 个位置是 1。每当指针对应的内存数据发生变化，比如内存被移动，颜色会发生变化。

4. 读屏障 Load Barrier

   传统 GC 做标记时，为了防止其他线程在标记期间修改对象，通常会简单的 STW。而 ZGC 有了 Colored Pointer 后，引入了所谓的“读屏障”。

   当指针引用的内存正被移动时，指针上的颜色就会变化，ZGC 会先把指针更新成最新状态，然后再返回（你可以回想下 Java 中的 volatile 关键字，有异曲同工之妙）。这样仅读取该指针时，可能会略有开销，而不用将整个 heap STW。

5. 重定位 Relocation

   如下图，在标记过程中，先从 Roots 对象找到了直接关联的下级对象 1，2，4。

   ![39.jpg](https://s0.lgstatic.com/i/image6/M01/56/2A/Cgp9HWEspqWAAHS6AAAcoge7Pv8625.jpg)

   然后继续向下层标记，找到了 5，8 对象， 此时已经可以判定 3，6，7 为垃圾对象。

   ![40.jpg](https://s0.lgstatic.com/i/image6/M01/56/2A/Cgp9HWEsprCAZrtCAAAeqKPoHXw488.jpg)

   如果按常规思路，一般会将 8 从最右侧的 Region，移动或复制到中间的 Region，然后再将中间 Region 的 3 干掉，最后再对中间 Region 做压缩 compact 整理。

   ![41.jpg](https://s0.lgstatic.com/i/image6/M01/56/2A/Cgp9HWEspr6AMxziAAAeYmBBjoU744.jpg)

   但 ZGC 做得更高明，它直接将 4，5 复制到了一个空的新 Region 就完事了，然后中间的 2 个 Region 直接废弃，或理解为“释放”，作为下次回收的“新” Region。这样的好处是避免了中间 Region 的 compact 整理过程。

   ![42.jpg](https://s0.lgstatic.com/i/image6/M01/56/2A/Cgp9HWEspsuAFh42AAAsCgyJwEk919.jpg)


   最后，指针重新调整为正确的指向（即：remap），而且上一阶段的 remap 与下一阶段的mark是混在一起处理的，相对更高效。

   【 Remap 的流程图】

   ![43.jpg](https://s0.lgstatic.com/i/image6/M01/56/2A/Cgp9HWEsptuABwmwAAA8njSoyvA729.jpg)

6. 多重映射 Multi-Mapping

7. 支持 NUMA 架构



## 四、监控和调优

### 说说你知道的几种主要的 JVM 参数

**思路：** 可以说一下堆栈配置相关的，垃圾收集器相关的，还有一下辅助信息相关的。

#### 1）堆栈配置相关

```
java -Xmx3550m -Xms3550m -Xmn2g -Xss128k 
-XX:MaxPermSize=16m -XX:NewRatio=4 -XX:SurvivorRatio=4 -XX:MaxTenuringThreshold=0
```

**-Xmx3550m：** 最大堆大小为3550m。

**-Xms3550m：** 设置初始堆大小为3550m。

**-Xmn2g：** 设置年轻代大小为2g。

**-Xss128k：** 每个线程的堆栈大小为128k。

**-XX:MaxPermSize：**  设置持久代大小为16m

**-XX:NewRatio=4:** 设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。

**-XX:SurvivorRatio=4：** 设置年轻代中Eden区与Survivor区的大小比值。设置为4，则两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6

**-XX:MaxTenuringThreshold=0：** 设置垃圾最大年龄。如果设置为0的话，则年轻代对象不经过Survivor区，直接进入年老代。

#### 2）垃圾收集器相关

```
-XX:+UseParallelGC
-XX:ParallelGCThreads=20
-XX:+UseConcMarkSweepGC 
-XX:CMSFullGCsBeforeCompaction=5
-XX:+UseCMSCompactAtFullCollection：
```

**-XX:+UseParallelGC：** 选择垃圾收集器为并行收集器。

**-XX:ParallelGCThreads=20：** 配置并行收集器的线程数

**-XX:+UseConcMarkSweepGC：** 设置年老代为并发收集。

**-XX:CMSFullGCsBeforeCompaction**：由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理。

**-XX:+UseCMSCompactAtFullCollection：** 打开对年老代的压缩。可能会影响性能，但是可以消除碎片

#### 3）辅助信息相关

```
-XX:+PrintGC
-XX:+PrintGCDetails
```

**-XX:+PrintGC 输出形式:**

[GC 118250K->113543K(130112K), 0.0094143 secs] [Full GC 121376K->10414K(130112K), 0.0650971 secs]

**-XX:+PrintGCDetails 输出形式:**

[GC [DefNew: 8614K->781K(9088K), 0.0123035 secs] 118250K->113543K(130112K), 0.0124633 secs] [GC [DefNew: 8614K->8614K(9088K), 0.0000665 secs][Tenured: 112761K->10414K(121024K), 0.0433488 secs] 121376K->10414K(130112K), 0.0436268 secs



### 你平时工作用过的 JVM 常用基本配置参数有哪些？

```
# 设置堆内存
-Xmx4g -Xms4g 
# 指定 GC 算法
-XX:+UseG1GC -XX:MaxGCPauseMillis=50 
# 指定 GC 并行线程数
-XX:ParallelGCThreads=4 
# 打印 GC 日志
-XX:+PrintGCDetails -XX:+PrintGCDateStamps 
# 指定 GC 日志文件
-Xloggc:gc.log 
# 指定 Meta 区的最大值
-XX:MaxMetaspaceSize=2g 
# 设置单个线程栈的大小
-Xss1m 
# 指定堆内存溢出时自动进行 Dump
-XX:+HeapDumpOnOutOfMemoryError 
-XX:HeapDumpPath=/usr/local/
```



### 你说你做过  JVM 调优和参数配置，请问如何盘点查看 JVM 系统默认值？

#### JVM参数类型

| **类型**     | **示例**              | **作用**                                      |                                                  |
| ------------ | --------------------- | --------------------------------------------- | ------------------------------------------------ |
| **标配参数** | `-version`, `-help`   | 所有 JVM 必须实现的通用功能，无性能影响       |                                                  |
| **X 参数**   | `-Xint`, `-Xcomp`     | 控制 JVM 运行模式（解释、编译、混合）         |                                                  |
| **XX 参数**  | `-XX:+PrintGCDetails` | 调优核心参数，分为 **Boolean** 和 **KV 类型** | -xx:+ 或者 - 某个属性值（+表示开启，- 表示关闭） |

#### **常用工具**

- **`jinfo`**：查看或修改运行中 JVM 的参数。
- **`java` 命令参数**：直接打印默认或修改后的参数。
- **Runtime API**：通过 Java 代码获取内存信息

这些都是命令级别的查看，我们如何在程序运行中查看

```java
long totalMemory = Runtime.getRuntime().totalMemory();
long maxMemory = Runtime.getRuntime().maxMemory();

System.out.println("total_memory(-xms)="+totalMemory+"字节，" +(totalMemory/(double)1024/1024)+"MB");
System.out.println("max_memory(-xmx)="+maxMemory+"字节，" +(maxMemory/(double)1024/1024)+"MB");
```

### 盘点家底查看 JVM 默认值

- -XX:+PrintFlagsInitial

  - 主要查看初始默认值

  - java -XX:+PrintFlagsInitial

  - java -XX:+PrintFlagsInitial -version

    **等号前有冒号** :=  说明 jvm 参数有人为修改过或者 JVM加载修改

    false 说明是Boolean 类型 参数，数字说明是 KV 类型参数

- -XX:+PrintFlagsFinal

  - 主要查看修改更新
  - java -XX:+PrintFlagsFinal
  - java -XX:+PrintFlagsFinal -version
  - 运行java命令的同时打印出参数 java -XX:+PrintFlagsFinal -XX:MetaspaceSize=512m Hello.java

- -XX:+PrintCommondLineFlags

  - 打印命令行参数
  - java -XX:+PrintCommondLineFlags -version
  - 可以方便的看到垃圾回收器



### 能写几个 OOM 代码不？

- java.lang.StackOverflowError

  ```java
  public class StackOverflowErrorDemo {
  
    public static void main(String[] args) {
        stackoverflowError();
    }
  
    private static void stackoverflowError() {
        stackoverflowError();
    }
  }
  ```

- java.lang.OutOfMemoryError: Java heap space

  - new个大对象,就会出现

  ```java
  //JVM参数：-Xmx12m
  static final int SIZE = 2 * 1024 * 1024;
  
  public static void main(String[] a) {
      int[] i = new int[SIZE];
  }
  ```

  

### 谈谈你的 GC 调优思路？

> 谈到调优，这一定是针对特定场景、特定目的的事情， 对于 GC 调优来说，首先就需要清楚调优的目标是什么？从性能的角度看，通常关注三个方面，**内存占用**（footprint）、**延时**（latency）和**吞吐量**（throughput），大多数情况下调优会侧重于其中一个或者两个方面的目标，很少有情况可以兼顾三个不同的角度。当然，除了上面通常的三个方面，也可能需要考虑其他 GC 相关的场景，例如，OOM 也可能与不合理的 GC 相关参数有关；或者，应用启动速度方面的需求，GC 也会是个考虑的方面。
>
> - **延迟（Latency）：** 也可以理解为最大停顿时间，即垃圾收集过程中一次 STW 的最长时间，越短越好，一定程度上可以接受频次的增大，GC 技术的主要发展方向。
> - **吞吐量（Throughput）：** 应用系统的生命周期内，由于 GC 线程会占用 Mutator 当前可用的 CPU 时钟周期，吞吐量即为 Mutator 有效花费的时间占系统总运行时间的百分比，例如系统运行了 100 min，GC 耗时 1 min，则系统吞吐量为 99%，吞吐量优先的收集器可以接受较长的停顿。
>
> 基本的调优思路可以总结为：
>
> - 理解应用需求和问题，确定调优目标。假设，我们开发了一个应用服务，但发现偶尔会出现性能抖动，出现较长的服务停顿。评估用户可接受的响应时间和业务量，将目标简化为，希望 GC 暂停尽量控制在 200ms 以内，并且保证一定标准的吞吐量。
> - 掌握 JVM 和 GC 的状态，定位具体的问题，确定真的有 GC 调优的必要。具体有很多方法，比如，通过 jstat 等工具查看 GC 等相关状态，可以开启 GC 日志，或者是利用操作系统提供的诊断工具等。例如，通过追踪 GC 日志，就可以查找是不是 GC 在特定时间发生了长时间的暂停，进而导致了应用响应不及时。
> - 这里需要思考，选择的 GC 类型是否符合我们的应用特征，如果是，具体问题表现在哪里，是 Minor GC 过长，还是 Mixed GC 等出现异常停顿情况；如果不是，考虑切换到什么类型，如 CMS 和 G1 都是更侧重于低延迟的 GC 选项。
> - 通过分析确定具体调整的参数或者软硬件配置。
> - 验证是否达到调优目标，如果达到目标，即可以考虑结束调优；否则，重复完成分析、调整、验证这个过程。
>

一、调优核心目标与基本原则

1. **核心目标**
   - 延迟优化：减少GC导致的STW时间（如Young GC < 50ms，Full GC < 1s）
   - 吞吐量提升：确保GC时间占比低于5%（如GC吞吐量 > 95%）
   - **内存利用率**：减少内存碎片，避免OOM和频繁扩容
2. **基本原则**
   - 先诊断后调优：通过GC日志和监控工具定位问题，避免盲目调整参数
   - 代码优先原则：优化对象分配模式（如减少大对象、避免内存泄漏）比参数调整更有效
   - 场景适配：根据应用类型选择GC算法（低延迟选G1/ZGC，高吞吐选Parallel GC）

二、调优方法论与实施步骤

1. **数据采集与问题定位**

   - 监控工具：
     - `jstat -gcutil <pid>`：实时查看各代内存使用率及GC次数/耗时
     - `jmap -histo`：分析堆内存对象分布，定位大对象或内存泄漏
     - GC日志分析：通过 `-Xlog:gc*` 生成日志，使用GCeasy或G1Viewer解析

   - 关键指标：
     - Young GC频率：高于10秒/次需优化新生代分配
     - 晋升速率：若单次Young GC后老年代增长>5%，需调整年龄阈值

2. **内存模型优化**

   - 分代策略调整：
     - 新生代扩容：若Young GC频繁（如<30秒/次），增大 `-Xmn`（不超过堆的60%）
     - Survivor区平衡：通过 `-XX:SurvivorRatio` 调整Eden与Survivor比例（默认8:1:1），避免动态年龄判定过早触发

   - 大对象控制：
     - 设置 `-XX:PretenureSizeThreshold=4M`，避免大对象直接进入老年代引发碎片

3. **GC算法选择与参数调优**

   | **GC类型**   | **适用场景**            | **调优参数示例**                                             | **优化目标**     |
   | ------------ | ----------------------- | ------------------------------------------------------------ | ---------------- |
   | **G1**       | 低延迟、大堆内存（>8G） | `-XX:MaxGCPauseMillis=200`（目标停顿时间）`-XX:InitiatingHeapOccupancyPercent=45`（并发标记阈值） 5 | 减少Mixed GC频率 |
   | **Parallel** | 批处理、高吞吐量        | `-XX:ParallelGCThreads=CPU核数`（并行线程数）`-XX:GCTimeRatio=9`（GC/应用时间比） 5 | 最大化吞吐量     |
   | **ZGC**      | 超低延迟（<10ms）       | `-XX:ZAllocationSpikeTolerance=5`（分配速率容忍度）`-Xmx32G`（堆≤32G） | 亚秒级停顿       |

4. **关键参数调优策略**

   - 晋升阈值优化：降低 `-XX:MaxTenuringThreshold` （默认15→5），加速长生命周期对象进入老年代

   - 堆稳定性保障：设置 `-Xms=-Xmx` 避免堆动态扩容，配合 `-XX:+AlwaysPreTouch` 预分配物理内存

   - 元空间控制： 限制 `-XX:MaxMetaspaceSize=512M` ，防止类加载器泄漏导致Full GC

5. **代码级优化**

   - **对象池化**：复用高频率创建对象（如数据库连接、线程）

   - 软引用控制：通过 SoftReference 缓存大对象，在内存紧张时优先释放

   - **并发数据结构**：使用`ConcurrentHashMap`替代`synchronized`集合，减少锁竞争导致的临时对象激增

三、调优效果验证与持续监控

1. AB测试验证：

   - 对比调优前后的GC暂停时间分布（如P99延迟下降30%）

   - 监控吞吐量变化（如QPS提升20%+）

2. 监控体系构建：

   - **时序数据库**：Prometheus采集`jvm_gc_pause_seconds`指标

   - 告警规则：Full GC次数>1次/小时或STW时间>1秒触发告警

四、典型场景调优案例

> 案例1：电商秒杀系统（低延迟场景）
>
> - **问题**：高峰期Young GC暂停时间从50ms飙升至200ms
>
> - 调优：
>
>   1. 切换至G1回收器，设置`MaxGCPauseMillis=100`
>   2. 增大Eden区（`-Xmn=4G`），降低动态年龄判定触发频率
>   3. 代码优化：预加载热点商品数据至堆外缓存
>
> - 效果：Young GC平均暂停时间降至80ms，Full GC完全消除
>
>   
>
> 案例2：大数据计算引擎（高吞吐场景）
>
> - **问题**：Full GC导致每小时任务超时
> - 调优：
>   1. 采用Parallel GC，设置`-XX:GCTimeRatio=19`（GC时间占比≤5%）
>   2. 限制大对象分配：`PretenureSizeThreshold=8M`
>   3. 启用`-XX:+UseLargePages`减少TLB缺失
> - 效果：任务完成时间缩短40%，CPU利用率提升15%

五、调优工具推荐

| **工具类型** | **推荐工具**         | **核心功能**                      |
| ------------ | -------------------- | --------------------------------- |
| 日志分析     | GCeasy、G1Viewer     | 可视化GC暂停分布、内存泄漏检测 9  |
| 实时监控     | Prometheus + Grafana | 可视化JVM内存、GC频率与耗时趋势 8 |
| 堆内存分析   | Eclipse MAT          | 对象引用链分析，定位内存泄漏 7    |

总结：调优需避免的误区

1. **参数过度调整**：如盲目设置`-Xmx=物理内存80%`导致系统Swap
2. 忽略代码优化：90%的GC问题源于代码缺陷而非参数配置
3. 算法选择错配：在32G以上堆内存使用CMS导致并发模式失败

通过系统化的数据采集、场景化参数调整和代码级优化，可显著提升应用性能。建议结合具体业务特征选择调优路径，并通过持续监控验证长期效果。



### 怎么打出线程栈信息。

**思路：** 可以说一下 jps，top ，jstack这几个命令，再配合一次排查线上问题进行解答。

- 输入 jps，获得进程号。
- top -Hp pid 获取本进程中所有线程的CPU耗时性能
- jstack pid命令查看当前java进程的堆栈状态
- 或者 jstack -l  > /tmp/output.txt 把堆栈信息打到一个txt文件。
- 可以使用 fastthread 堆栈定位，[fastthread.io/](http://fastthread.io/)



### 如何查看JVM的内存使用情况?

一、命令行工具

1. **`jps` + `jstat` 组合**
   - **功能**：快速定位 Java 进程并监控内存与 GC 状态。
   - **操作步骤**：
     1. 查看 Java 进程 ID：`jps -l`
     2. 监控堆内存使用（示例 PID=1234）：`jstat -gc 1234 1s 5  # 每1秒刷新，共5次`
   - 输出关键字段：
     - `EC/EU`：Eden 区容量/使用量
     - `OC/OU`：老年代容量/使用量
     - `YGC/YGCT`：Young GC 次数/耗时
     - `FGC/FGCT`：Full GC 次数/耗时
   - **适用场景**：实时监控内存分配与回收效率

2. **`jmap` 堆内存分析**

   - **功能**：生成堆转储文件或直接查看内存分布。

   - 常用命令：
     - 查看堆内存配置：`jmap -heap 1234`
     - 生成堆转储文件（用于后续分析内存泄漏）：`jmap -dump:format=b,file=heap.hprof 1234`
     - 统计对象直方图：`jmap -histo 1234 | head -20  # 显示前20个占用内存最多的类`
   - **适用场景**：排查内存溢出或对象分布异常

3. **`jinfo` 参数查看**

   - **功能**：查看或修改运行中 JVM 的参数。

   - 示例：

     ```bash
     jinfo -flags 1234  # 显示所有参数
     jinfo -flag MaxHeapSize 1234  # 查看堆最大内存
     ```

   - **适用场景**：验证内存参数配置是否生效



### 怎么查看服务器默认的垃圾收集器是哪个？生产上如何配置垃圾收集器？谈谈你对垃圾收集器的理解？

```sh
java -XX:+PrintCommandLineFlags -version
```

使用 G1 垃圾收集

```sh
java -XX:+UseG1GC -jar yourapp.jar
```

垃圾收集器是JVM用来自动管理内存的重要组成部分。它们的主要任务是识别和回收不再使用的对象，释放内存资源。以下是对垃圾收集器的一些关键理解：

1. **自动化内存管理**：自动化内存管理减少了内存泄漏和野指针的风险。
2. **性能影响**：不同的垃圾收集器对应用程序性能的影响不同。选择合适的垃圾收集器可以显著提高应用程序性能。
3. **算法多样性**：存在多种垃圾收集算法，每种算法都有其特定的使用场景和优缺点。
4. **与应用程序特性匹配**：选择垃圾收集器时，需要考虑应用程序的特性，如对象生命周期、响应时间要求、吞吐量需求等。
5. **资源消耗**：垃圾收集器可能会消耗额外的CPU资源来执行垃圾回收任务。
6. **内存分配策略**：垃圾收集器通常与特定的内存分配策略（如TLAB）结合使用，以优化内存分配性能。
7. **并发与增量收集**：现代垃圾收集器通常支持并发或增量收集，以减少GC引起的应用程序停顿。
8. **可配置性**：大多数垃圾收集器都可以通过JVM参数进行配置，以适应不同的性能需求。
9. **持续发展**：垃圾收集器和算法随着JVM的更新而不断发展，新的垃圾收集器（如ZGC、Shenandoah等）提供了更低的延迟和更好的性能。

通过合理选择和配置垃圾收集器，可以显著提高Java应用程序的性能和稳定性。



### 生产环境服务器变慢，诊断思路和性能评估谈谈？

诊断思路

1. **初步排查**
   - **确认问题**：确认问题的存在和范围。检查是否所有服务变慢还是只有特定的服务。
   - **收集信息**：从用户反馈、日志、监控系统中收集详细的症状描述和时间信息。
2. **硬件资源检查**
   - **CPU 使用率**：检查 CPU 使用率是否过高，是否存在 CPU 瓶颈。
   - **内存使用**：检查内存使用情况，是否存在内存泄漏或不合理的内存占用。
   - **磁盘 I/O**：检查磁盘 I/O 是否成为瓶颈，是否有大量的读写操作。
   - **网络流量**：检查网络带宽和延迟，是否存在网络瓶颈。
3. **系统级别检查**
   - **系统日志**：查看操作系统日志（如 `/var/log/syslog` 或 `/var/log/messages`），检查是否有硬件故障、驱动问题等。
   - **资源使用**：使用 `top`、`htop`、`vmstat`、`iostat` 等工具查看实时资源使用情况。
   - **进程检查**：查看是否有异常进程占用大量资源。
4. **应用级别检查**
   - **应用日志**：检查应用日志，查看是否有异常错误、超时或其他提示信息。
   - **线程和堆栈**：检查应用的线程和堆栈信息，使用工具如 `jstack` 查看 Java 应用的线程状态。
   - **垃圾回收**：如果是 Java 应用，检查垃圾回收日志，查看是否存在频繁的 GC 停顿。
   - **数据库性能**：检查数据库性能，查看是否存在慢查询、大量锁等待等问题。
5. **网络检查**
   - **网络延迟**：使用 `ping`、`traceroute` 等工具检查网络延迟和路径。
   - **带宽占用**：使用 `iftop`、`netstat` 等工具查看网络带宽占用情况。
6. **外部依赖**
   - **第三方服务**：检查依赖的第三方服务是否正常运行，是否存在响应缓慢的问题。
   - **API 调用**：检查外部 API 调用的响应时间，是否存在延迟。

#### 性能评估

1. **基准测试**
   - **负载测试**：使用工具如 `JMeter`、`Gatling` 对应用进行负载测试，评估其在高负载下的表现。
   - **压力测试**：模拟高并发用户访问，评估应用的最大承载能力。
2. **性能监控**
   - **监控工具**：使用监控工具如 Prometheus、Grafana、Nagios、Zabbix 等，对服务器的 CPU、内存、磁盘 I/O、网络等进行持续监控。
   - **应用性能监控**：使用 APM 工具如 New Relic、AppDynamics、Dynatrace 等，监控应用的性能指标，如响应时间、错误率、吞吐量等。
3. **日志分析**
   - **集中日志管理**：使用 ELK（Elasticsearch, Logstash, Kibana）或 Splunk 等工具集中管理和分析日志。
   - **日志分析**：分析应用日志和系统日志，查找异常和错误信息。
4. **性能优化**
   - **代码优化**：分析应用代码，查找性能瓶颈，如低效算法、频繁的 I/O 操作等。
   - **数据库优化**：优化数据库查询，添加索引、优化 SQL 语句、调整数据库配置等。
   - **缓存策略**：使用缓存（如 Redis、Memcached）减轻数据库压力，提升响应速度。
   - **负载均衡**：使用负载均衡（如 Nginx、HAProxy）分发流量，减轻单点压力。
   - **集群和分布式**：将应用部署在集群或分布式环境中，提高系统的扩展性和可靠性。

诊断服务器变慢需要系统的方法，从硬件资源、系统级别、应用级别、网络和外部依赖等多个方面进行排查。性能评估则需要通过基准测试、性能监控、日志分析等手段全面了解系统性能，并通过优化代码、数据库、缓存策略等措施提升系统性能。定期的性能评估和优化可以帮助维护系统的稳定性和高效性。



### 假设生产环境出现 CPU占用过高，请谈谈你的分析思路和定位

生产环境出现 CPU 占用过高的情况可能影响应用的性能和响应速度。下面是详细的分析思路和定位步骤：

**分析思路和定位步骤**

1. **确认问题**

   - **监控系统**：检查监控系统（如 Prometheus、Grafana）上的 CPU 使用率图表，确认 CPU 使用率过高的时间段和趋势。
   - **范围确认**：确定是单个服务器还是整个集群的 CPU 占用都很高。

2. **检查操作系统和硬件资源**

   - **系统日志**：查看操作系统日志（如 `/var/log/syslog` 或 `/var/log/messages`），检查是否有硬件故障、驱动问题等。

   - **资源使用工具**：使用 `top`、`htop`、`vmstat`、`iostat` 等工具实时查看 CPU 使用情况，识别占用 CPU 最高的进程。

   - 进程检查：使用  `ps` 命令列出所有进程及其 CPU 使用情况，例如：

     ```bash
     ps aux --sort=-%cpu
     ```

3. **应用层面分析**

   - **应用日志**：检查应用日志，查看是否有异常错误、超时或其他提示信息。
   - **线程分析**：如果是 Java 应用，使用 `jstack` 或其他线程分析工具生成线程堆栈信息，查看哪些线程在占用大量 CPU。
   - **热点分析**：使用 `perf`、`flame graph`（火焰图）等性能分析工具进行热点分析，查看具体哪些代码或方法在消耗 CPU。

4. **数据库和外部服务**

   - **数据库性能**：检查数据库性能，查看是否有慢查询、大量锁等待等问题。使用工具如 `slow query log`、`explain` 分析 SQL 语句。
   - **外部依赖**：检查依赖的第三方服务或 API 调用是否存在性能问题，导致应用在等待响应时占用 CPU。

5. **内存和垃圾回收**

   - **内存使用**：检查内存使用情况，是否有内存泄漏导致频繁的垃圾回收。

   - 垃圾回收日志：如果是 Java 应用，检查垃圾回收日志，查看是否存在频繁的 Full GC。使用 `jstat` 工具查看 GC 活动：

     ```bash
     jstat -gcutil <pid> 1000
     ```

6. **代码和配置优化**

   - **代码检查**：检查代码是否存在效率低下的算法或循环，特别是高频调用的部分。
   - **配置调整**：调整应用和服务器的配置，例如线程池大小、数据库连接池配置等，以优化性能。

**具体步骤和工具示例**

1. **使用 `top` 或 `htop` 查看 CPU 使用情况**

   ```bash
   top
   ```

   观察哪个进程占用 CPU 最高，记下 PID。

2. **使用 `ps` 查看详细进程信息**

   ```bash
   ps aux --sort=-%cpu | head -n 10
   ```

   查看占用 CPU 前 10 的进程。

3. **生成线程堆栈信息（针对 Java 应用）**

   ```bash
   jstack <pid> > thread_dump.txt
   ```

   分析 `thread_dump.txt` 文件，查看哪些线程在占用大量 CPU。

4. **使用 `perf` 工具进行性能分析**

   ```bash
   perf record -F 99 -p <pid> -g -- sleep 30
   perf script > out.perf
   ```

   然后使用 `FlameGraph` 工具生成火焰图，分析热点代码。

5. **检查和调整垃圾回收配置** 查看垃圾回收日志，分析是否有频繁的 Full GC，可以尝试调整堆大小或更换垃圾回收器。

通过上述步骤，可以系统地分析和定位生产环境中 CPU 占用过高的问题。首先确认问题范围，然后检查系统和应用层面，使用合适的工具和方法进行深入分析，最终根据分析结果进行代码和配置优化。定期的性能监控和分析可以预防和及时解决类似问题，保证系统的稳定运行。



### 如何检测 jvm 的各项指标？

> 对于JDK 自带的JVM 监控和性能分析工具用过哪些？你是怎么用的？

**1、JMX（Java Management Extensions）**：

- JMX是Java平台的内置管理框架，用于监控和管理Java应用程序。通过JMX，可以获取JVM的运行时数据，包括内存使用情况、线程信息、垃圾回收统计等。

  > **使用 JConsole 监控 JVM**
  >
  > 1. 启动 JConsole：
  >    - JConsole 是 JDK 自带的图形化工具，用于监控 JVM 的各种指标。
  >    - 你可以在命令行中输入 `jconsole` 启动 JConsole。
  > 2. 连接到 JVM：
  >    - 在 JConsole 的连接窗口中选择本地进程或远程进程，然后点击连接。
  > 3. 查看性能指标：
  >    - 在 JConsole 中，你可以查看内存使用情况、线程活动、类加载、MBean 等
  >
  > 也可以通过编程方式使用 JMX 访问 JVM 的性能指标
  >
  > ```java
  > public class JMXExample {
  >     public static void main(String[] args) throws Exception {
  >         MBeanServerConnection mBeanServer = ManagementFactory.getPlatformMBeanServer();
  >         ObjectName memoryMXBeanName = new ObjectName(ManagementFactory.MEMORY_MXBEAN_NAME);
  >         MemoryMXBean memoryMXBean = ManagementFactory.newPlatformMXBeanProxy(mBeanServer, memoryMXBeanName.toString(), MemoryMXBean.class);
  > 
  >         // 获取堆内存使用情况
  >         MemoryUsage heapMemoryUsage = memoryMXBean.getHeapMemoryUsage();
  >         System.out.println("Heap Memory Usage: " + heapMemoryUsage);
  > 
  >         // 获取非堆内存使用情况
  >         MemoryUsage nonHeapMemoryUsage = memoryMXBean.getNonHeapMemoryUsage();
  >         System.out.println("Non-Heap Memory Usage: " + nonHeapMemoryUsage);
  >     }
  > }
  > ```

- 可以使用JMX Exporter将JVM的监控指标暴露给Prometheus进行采集和监控

 **2、使用 Java 命令行工具**

- `jstat` 是一个命令行工具，用于监控 JVM 的各种性能指标，如垃圾回收、类加载等
- `jmap` 用于生成堆转储文件（heap dump）和查看堆内存的详细信息
- `jstack` 用于生成线程快照（thread dump），可以帮助诊断线程死锁和高 CPU 使用问题

**3、使用第三方监控工具**

- VisualVM 是一个强大的图形化工具，用于监控和分析 JVM 的性能。它可以监控内存使用情况、线程活动、垃圾回收等

- Prometheus 是一个开源监控系统，Grafana 是一个开源的时序数据可视化工具。结合使用这两个工具可以实现对 JVM 的高级监控和可视化。

4、使用 Spring Boot Actuator (如果使用 Spring Boot)
