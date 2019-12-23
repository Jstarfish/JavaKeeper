https://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html



JAVA8增强的内容

https://docs.oracle.com/javase/8/docs/technotes/guides/language/enhancements.html#javase8

# Java8新特性

Java8 新增了非常多的特性，我们主要讨论以下几个：

- **Lambda 表达式** − Lambda 允许把函数作为一个方法的参数（函数作为参数传递到方法中）。
- **方法引用** − 方法引用提供了非常有用的语法，可以直接引用已有Java类或对象（实例）的方法或构造器。与lambda联合使用，方法引用可以使语言的构造更紧凑简洁，减少冗余代码。
- **默认方法** − 默认方法就是一个在接口里面有了一个实现的方法。
- **新工具** − 新的编译工具，如：Nashorn引擎 jjs、 类依赖分析器jdeps。
- **Stream API** −新添加的Stream API（java.util.stream） 把真正的函数式编程风格引入到Java中。
- **Date Time API** − 加强对日期与时间的处理。
- **Optional 类** − Optional 类已经成为 Java 8 类库的一部分，用来解决空指针异常。
- **Nashorn, JavaScript 引擎** − Java 8提供了一个新的Nashorn javascript引擎，它允许我们在JVM上运行特定的javascript应用。



1. Lambda 表达式 
2. 函数式接口 
3. 方法引用与构造器引用 
4. Stream API
5. 接口中的默认方法与静态方法
6. 新时间日期 API 
7. 其他新特性



Java8

- Java编程语言
  - Lambda表达式： 它们使您能够将功能视为方法参数，或将代码视为数据 
  - Method references provide easy-to-read lambda expressions for methods that already have a name.
  - Default methods enable new functionality to be added to the interfaces of libraries and ensure binary compatibility with code written for older versions of those interfaces.
  - Repeating Annotations provide the ability to apply the same annotation type more than once to the same declaration or type use.
  - Type Annotations provide the ability to apply an annotation anywhere a type is used, not just on a declaration. Used with a pluggable type system, this feature enables improved type checking of your code.
  - Improved type inference.
  - Method parameter reflection.

- 集合
  -  Stream API：新java.util中的类。stream包提供了一个流API来支持对元素流的函数式操作 
  -  具有键冲突的hashmap的性能改进

- [Compact Profiles](http://docs.oracle.com/javase/8/docs/technotes/guides/compactprofiles/) contain predefined subsets of the Java SE platform and enable applications that do not require the entire Platform to be deployed and run on small devices. 

-  [Security](http://docs.oracle.com/javase/8/docs/technotes/guides/security/enhancements-8.html) 

  - Client-side TLS 1.2 enabled by default
  - New variant of `AccessController.doPrivileged` that enables code to assert a subset of its privileges, without preventing the full traversal of the stack to check for other permissions
  - Stronger algorithms for password-based encryption
  - SSL/TLS Server Name Indication (SNI) Extension support in JSSE Server
  - Support for AEAD algorithms: The SunJCE provider is enhanced to support AES/GCM/NoPadding cipher implementation as well as GCM algorithm parameters. And the SunJSSE provider is enhanced to support AEAD mode based cipher suites. See Oracle Providers Documentation, JEP 115.
  - KeyStore enhancements, including the new Domain KeyStore type `java.security.DomainLoadStoreParameter`, and the new command option `-importpassword` for the keytool utility
  - SHA-224 Message Digests
  - Enhanced Support for NSA Suite B Cryptography
  - Better Support for High Entropy Random Number Generation
  - New `java.security.cert.PKIXRevocationChecker` class for configuring revocation checking of X.509 certificates
  - 64-bit PKCS11 for Windows
  - New rcache Types in Kerberos 5 Replay Caching
  - Support for Kerberos 5 Protocol Transition and Constrained Delegation
  - Kerberos 5 weak encryption types disabled by default
  - Unbound SASL for the GSS-API/Kerberos 5 mechanism
  - SASL service for multiple host names
  - JNI bridge to native JGSS on Mac OS X
  - Support for stronger strength ephemeral DH keys in the SunJSSE provider
  - Support for server-side cipher suites preference customization in JSSE

-  [JavaFX](http://docs.oracle.com/javase/8/javase-clienttechnologies.htm) 

  - 
    The new Modena theme has been implemented in this release. For more information, see the blog at [fxexperience.com](http://fxexperience.com/2013/03/modena-theme-update/).
  - The new `SwingNode` class enables developers to embed Swing content into JavaFX applications. See the [`SwingNode`](http://docs.oracle.com/javase/8/javafx/api/javafx/embed/swing/SwingNode.html) javadoc and [Embedding Swing Content in JavaFX Applications](http://docs.oracle.com/javase/8/javafx/interoperability-tutorial/embed-swing.htm).
  - The new UI Controls include the [`DatePicker`](http://docs.oracle.com/javase/8/javafx/api/javafx/scene/control/DatePicker.html) and the [`TreeTableView`](http://docs.oracle.com/javase/8/javafx/api/javafx/scene/control/TreeTableView.html) controls.
  - The `javafx.print` package provides the public classes for the JavaFX Printing API. See the [javadoc](http://docs.oracle.com/javase/8/javafx/api/javafx/print/package-summary.html) for more information.
  - The 3D Graphics features now include 3D shapes, camera, lights, subscene, material, picking, and antialiasing. The new `Shape3D` (`Box`, `Cylinder`, `MeshView`, and `Sphere` subclasses), `SubScene`, `Material`, `PickResult`, `LightBase` (`AmbientLight` and `PointLight` subclasses) , and `SceneAntialiasing` API classes have been added to the JavaFX 3D Graphics library. The `Camera` API class has also been updated in this release. See the corresponding class javadoc for `javafx.scene.shape.Shape3D`, `javafx.scene.SubScene`, `javafx.scene.paint.Material`, `javafx.scene.input.PickResult`, `javafx.scene.SceneAntialiasing`, and the [Getting Started with JavaFX 3D Graphics](http://docs.oracle.com/javase/8/javafx/graphics-tutorial/javafx-3d-graphics.htm) document.
  - The `WebView` class provides new features and improvements. Review [Supported Features of HTML5](http://docs.oracle.com/javase/8/javafx/embedded-browser-tutorial/index.html) for more information about additional HTML5 features including Web Sockets, Web Workers, and Web Fonts.
  - Enhanced text support including bi-directional text and complex text scripts such as Thai and Hindi in controls, and multi-line, multi-style text in text nodes.
  - Support for Hi-DPI displays has been added in this release.
  - The CSS Styleable* classes became public API. See the [`javafx.css`](http://docs.oracle.com/javase/8/javafx/api/javafx/css/package-frame.html) javadoc for more information.
  - The new [`ScheduledService`](http://docs.oracle.com/javase/8/javafx/api/javafx/concurrent/ScheduledService.html) class allows to automatically restart the service.
  - JavaFX is now available for ARM platforms. JDK for ARM includes the base, graphics and controls components of JavaFX.

- [Tools](http://docs.oracle.com/javase/8/docs/technotes/tools/enhancements-8.html)

  - The `jjs` command is provided to invoke the Nashorn engine.
  - The `java` command launches JavaFX applications.
  - The `java` man page has been reworked.
  - The `jdeps` command-line tool is provided for analyzing class files.
  - Java Management Extensions (JMX) provide remote access to diagnostic commands.
  - The `jarsigner` tool has an option for requesting a signed time stamp from a Time Stamping Authority (TSA).
  - [Javac tool](http://docs.oracle.com/javase/8/docs/technotes/guides/javac/index.html)
    - The `-parameters` option of the `javac` command can be used to store formal parameter names and enable the Reflection API to retrieve formal parameter names.
    - The type rules for equality operators in the Java Language Specification (JLS) Section 15.21 are now correctly enforced by the `javac` command.
    - The `javac` tool now has support for checking the content of `javadoc` comments for issues that could lead to various problems, such as invalid HTML or accessibility issues, in the files that are generated when `javadoc` is run. The feature is enabled by the new `-Xdoclint` option. For more details, see the output from running "`javac -X`". This feature is also available in the `javadoc` tool, and is enabled there by default.
    - The `javac` tool now provides the ability to generate native headers, as needed. This removes the need to run the `javah` tool as a separate step in the build pipeline. The feature is enabled in `javac` by using the new `-h` option, which is used to specify a directory in which the header files should be written. Header files will be generated for any class which has either native methods, or constant fields annotated with a new annotation of type `java.lang.annotation.Native`.
  - [Javadoc tool](http://docs.oracle.com/javase/8/docs/technotes/guides/javadoc/whatsnew-8.html)
    - The `javadoc` tool supports the new `DocTree` API that enables you to traverse Javadoc comments as abstract syntax trees.
    - The `javadoc` tool supports the new Javadoc Access API that enables you to invoke the Javadoc tool directly from a Java application, without executing a new process. See the [javadoc what's new](http://docs.oracle.com/javase/8/docs/technotes/guides/javadoc/whatsnew-8.html) page for more information.
    - The `javadoc` tool now has support for checking the content of `javadoc` comments for issues that could lead to various problems, such as invalid HTML or accessibility issues, in the files that are generated when `javadoc` is run. The feature is enabled by default, and can also be controlled by the new `-Xdoclint` option. For more details, see the output from running "`javadoc -X`". This feature is also available in the `javac` tool, although it is not enabled by default there.

- [Internationalization](http://docs.oracle.com/javase/8/docs/technotes/guides/intl/enhancements.8.html)国际化

  -  Unicode增强，包括对Unicode 6.2.0的支持 
  - Adoption of Unicode CLDR Data and the java.locale.providers System Property
  - New Calendar and Locale APIs
  - Ability to Install a Custom Resource Bundle as an Extension

- [Deployment](http://docs.oracle.com/javase/8/docs/technotes/guides/jweb/enhancements-8.html)部署

  - For sandbox applets and Java Web Start applications, `URLPermission` is now used to allow connections back to the server from which they were started. `SocketPermission` is no longer granted.
  - The Permissions attribute is required in the JAR file manifest of the main JAR file at all security levels.

- [Date-Time Package](http://docs.oracle.com/javase/8/docs/technotes/guides/datetime/index.html) - a new set of packages that provide a comprehensive date-time model.

- [Scripting](http://docs.oracle.com/javase/8/docs/technotes/guides/scripting/enhancements.html#jdk8)

  - The Rhino javascript engine has been replaced with the [Nashorn](http://docs.oracle.com/javase/8/docs/technotes/guides/scripting/nashorn/) Javascript Engine

- [Pack200](http://docs.oracle.com/javase/8/docs/technotes/guides/pack200/enhancements.html)

  - Pack200 Support for Constant Pool Entries and New Bytecodes Introduced by JSR 292
  - JDK8 support for class files changes specified by JSR-292, JSR-308 and JSR-335

- [IO and NIO](http://docs.oracle.com/javase/8/docs/technotes/guides/io/enhancements.html#jdk8)

  - New `SelectorProvider` implementation for Solaris based on the Solaris event port mechanism. To use, run with the system property `java.nio.channels.spi.Selector` set to the value `sun.nio.ch.EventPortSelectorProvider`.
  - Decrease in the size of the `/jre/lib/charsets.jar` file
  - Performance improvement for the `java.lang.String(byte[], *)` constructor and the `java.lang.String.getBytes()` method.

- [java.lang and java.util Packages](http://docs.oracle.com/javase/8/docs/technotes/guides/lang/enhancements.html#jdk8)

  - Parallel Array Sorting
  - Standard Encoding and Decoding Base64
  - Unsigned Arithmetic Support

- [JDBC](http://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/)

  - The JDBC-ODBC Bridge has been removed.
  - JDBC 4.2 introduces new features.

- Java DB

  - JDK 8 includes Java DB 10.10.

- [Networking](http://docs.oracle.com/javase/8/docs/technotes/guides/net/enhancements-8.0.html)

  - The class `java.net.URLPermission` has been added.
  - In the class `java.net.HttpURLConnection`, if a security manager is installed, calls that request to open a connection require permission.

- [Concurrency](http://docs.oracle.com/javase/8/docs/technotes/guides/concurrency/changes8.html)

  - Classes and interfaces have been added to the `java.util.concurrent` package.
  - Methods have been added to the `java.util.concurrent.ConcurrentHashMap` class to support aggregate operations based on the newly added streams facility and lambda expressions.
  - Classes have been added to the `java.util.concurrent.atomic` package to support scalable updatable variables.
  - Methods have been added to the `java.util.concurrent.ForkJoinPool` class to support a common pool.
  - The `java.util.concurrent.locks.StampedLock` class has been added to provide a capability-based lock with three modes for controlling read/write access.

- [Java XML](http://docs.oracle.com/javase/8/docs/technotes/guides/xml/enhancements.html) - [JAXP](http://docs.oracle.com/javase/8/docs/technotes/guides/xml/jaxp/enhancements-8.html)

- [HotSpot](http://docs.oracle.com/javase/8/docs/technotes/guides/vm/)

  - Hardware intrinsics were added to use Advanced Encryption Standard (AES). The `UseAES` and `UseAESIntrinsics` flags are available to enable the hardware-based AES intrinsics for Intel hardware. The hardware must be 2010 or newer Westmere hardware.

    **Note:** AES intrinsics are only supported by the Server VM.

    For example, to enable hardware AES, use the following flags:

    ```
    -XX:+UseAES -XX:+UseAESIntrinsics
    ```

    To disable hardware AES use the following flags:

    ```
    -XX:-UseAES -XX:-UseAESIntrinsics
    ```

  - Removal of PermGen.

  - Default Methods in the Java Programming Language are supported by the byte code instructions for method invocation.

- [Java Mission Control 5.3 Release Notes](http://www.oracle.com/technetwork/java/javase/jmc53-release-notes-2157171.html)

  - JDK 8 includes Java Mission Control 5.3.

  [![E-mail this page](https://www.oracle.com/us/assets/email.gif)](javascript:mailpage()) [E-mail this page](javascript:mailpage())  [![Printer View](https://www.oracle.com/us/assets/print_icon.gif) Printer View](javascript: void 0;)

##### Resources for

- [Developers](https://developer.oracle.com/)
- [Startups](https://www.oracle.com/startup/)
- [Students and Educators](https://academy.oracle.com/en/oa-web-overview.html)



##### Partners

- [Oracle PartnerNetwork](https://www.oracle.com/partnernetwork/)
- [Find a Partner](https://solutions.oracle.com/scwar/scr/Partners/index.html)
- [Log in to OPN](https://www.oracle.com/partners/)



##### How We Operate

- [Corporate Security Practices](https://www.oracle.com/corporate/security-practices/)
- [Corporate Responsibility](https://www.oracle.com/corporate/citizenship/)
- [Diversity and Inclusion](https://www.oracle.com/corporate/careers/diversity/)



##### Contact Us

- [US Sales: +1.800.633.0738](tel:18006330738)
- [Global Contacts](https://www.oracle.com/corporate/contact/global.html)
- [Subscribe to emails](https://go.oracle.com/subscriptions)



- 
- 
- 
- 

- [© 2019 Oracle](https://www.oracle.com/legal/copyright.html)
- [Site Map](https://www.oracle.com/sitemap.html)
- [Terms of Use and Privacy](https://www.oracle.com/legal/privacy/index.html)
- 
-  Cookie 喜好设置
- [Ad Choices](https://www.oracle.com/legal/privacy/marketing-cloud-data-cloud-privacy-policy.html#12)
- [Careers](https://www.oracle.com/corporate/careers/)

-  

​	



Java 8新特性简介 

 速度更快 

 代码更少（增加了新的语法 Lambda 表达式）

  强大的 Stream API

  便于并行

  最大化减少空指针异常 Optional 

其中最为核心的为 Lambda 表达式与Stream API





## Lambda表达式

 Lambda表达式使您能够封装单个行为单元并将其传递给其他代码。如果希望对集合的每个元素、流程完成时或流程遇到错误时执行某个操作，可以使用lambda表达式。Lambda表达式由以下特性支持: 

- [Method References](http://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html) are compact, easy-to-read lambda expressions for methods that already have a name.
- [Default Methods](http://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html) enable you to add new functionality to the interfaces of your libraries and ensure binary compatibility with code written for older versions of those interfaces. They are interface methods that have an implementation and the `default` keyword at the beginning of the method signature. In addition, you can define static methods in interfaces.
- [New and Enhanced APIs That Take Advantage of Lambda Expressions and Streams in Java SE 8](https://docs.oracle.com/javase/8/docs/technotes/guides/language/lambda_api_jdk8.html) describe new and enhanced classes that take advantage of lambda expressions and streams.



Lambda 是一个匿名函数，我们可以把 Lambda表达式理解为是一段可以传递的代码(将代码 像数据一样进行传递)。可以写出更简洁、更 灵活的代码。作为一种更紧凑的代码风格，使Java的语言表达能力得到了提升。



 匿名类的一个问题是，如果您的匿名类的实现非常简单，例如一个接口只包含一个方法，那么匿名类的语法可能看起来很笨拙和不清楚。在这些情况下，您通常试图将功能作为参数传递给另一个方法，例如当有人单击按钮时应该采取什么操作。Lambda表达式允许您这样做，将功能视为方法参数，或将代码视为数据。 



Lambda 表达式语法 

Lambda 表达式在Java 语言中引入了一个新的语法元 素和操作符。这个操作符为 “->” ， 该操作符被称 为 Lambda 操作符或剪头操作符。它将 Lambda 分为 两个部分：

左侧：指定了 Lambda 表达式需要的所有参数 

右侧：指定了 Lambda 体，即 Lambda 表达式要执行的功能。



语法格式一：无参，无返回值，Lambda 体只需一条语句



语法格式二：Lambda 需要一个参数



语法格式三：Lambda 只需要一个参数时，参数的小括号可以省略



语法格式四：Lambda 需要两个参数，并且有返回值



语法格式五：当 Lambda 体只有一条语句时，return 与大括号可以省略

```
email -> System.out.println(email)
```



语法格式六：



类型推断 

上述 Lambda 表达式中的参数类型都是由编译器推断 得出的。Lambda 表达式中无需指定类型，程序依然可 以编译，这是因为 javac 根据程序的上下文，在后台 推断出了参数的类型。Lambda 表达式的类型依赖于上 下文环境，是由编译器推断出来的。这就是所谓的“类型推断”



 Lambda表达式的理想用例 

 假设您正在创建一个社交网络应用 





## 函数式接口

什么是函数式接口 

 只包含一个抽象方法的接口，称为函数式接口。 

 你可以通过 Lambda 表达式来创建该接口的对象。（若 Lambda 表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方 法上进行声明）。 

 我们可以在任意函数式接口上使用 @FunctionalInterface 注解， 这样做可以检查它是否是一个函数式接口，同时 javadoc 也会包 含一条声明，说明这个接口是一个函数式接口。





Java 内置四大核心函数式接口 

函数式接口 参数类型 返回类型 用途 Consumer消费型接口 T void 对类型为T的对象应用操 作，包含方法： void accept(T t) Supplier供给型接口 无 T 返回类型为T的对象，包 含方法：T get(); Function函数型接口 T R 对类型为T的对象应用操 作，并返回结果。结果 是R类型的对象。包含方 法：R apply(T t); Predicate断定型接口 T boolean 确定类型为T的对象是否 满足某约束，并返回 boolean 值。包含方法 boolean test(T t);





## 方法引用与构造器引用

方法引用 

当要传递给Lambda体的操作，已经有实现的方法了，可以使用方法引用！ （实现抽象方法的参数列表，必须与方法引用方法的参数列表保持一致！） 方法引用：使用操作符 “::” 将方法名和对象或类的名字分隔开来。 如下三种主要使用情况：

对象::实例方法 

 类::静态方法 

 类::实例方法



构造器引用 

格式： ClassName::new 

与函数式接口相结合，自动与函数式接口中方法兼容。 可以把构造器引用赋值给定义的方法，与构造器参数 列表要与接口中抽象方法的参数列表一致！



数组引用 格式： type[] :: new



## 强大的 Stream API

了解 Stream Java8中有两大最为重要的改变。第一个是 Lambda 表达式；另外一 个则是 Stream API(java.util.stream.*)。 

Stream 是 Java8 中处理集合的关键抽象概念，它可以指定你希望对 集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。 使用Stream API 对集合数据进行操作，就类似于使用 SQL 执行的数 据库查询。也可以使用 Stream API 来并行执行操作。简而言之， Stream API 提供了一种高效且易于使用的处理数据的方式。



什么是 Stream

流(Stream) 到底是什么呢？ 是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。 “集合讲的是数据，流讲的是计算！” 

注意： 

①Stream 自己不会存储元素。

 ②Stream 不会改变源对象。相反，他们会返回一个持有结果的新Stream。 

③Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行。



Stream 的操作三个步骤 

 创建 Stream 一个数据源（如：集合、数组），获取一个流

  中间操作 一个中间操作链，对数据源的数据进行处理

  终止操作(终端操作) 一个终止操作，执行中间操作链，并产生结果



创建 Stream

 Java8 中的 Collection 接口被扩展，提供了 两个获取流的方法： 

 default Streamstream() : 返回一个顺序流 

 default StreamparallelStream() : 返回一个并行流



由数组创建流 

Java8 中的 Arrays 的静态方法 stream() 可 以获取数组流：

  static Streamstream(T[] array): 返回一个流 

重载形式，能够处理对应基本类型的数组：

  public static IntStream stream(int[] array) 

 public static LongStream stream(long[] array)

  public static DoubleStream stream(double[] array)



由值创建流 可以使用静态方法 Stream.of(), 通过显示值 创建一个流。它可以接收任意数量的参数。 

 public staticStreamof(T... values) : 返回一个流



由函数创建流：创建无限流 可以使用静态方法 Stream.iterate() 和 Stream.generate(), 创建无限流。 

 迭代 

public staticStreamiterate(final T seed, final UnaryOperatorf) 

 生成 

public staticStreamgenerate(Suppliers) : 



Stream 的中间操作 

多个中间操作可以连接起来形成一个流水线，除非流水 线上触发终止操作，否则中间操作不会执行任何的处理！ 而在终止操作时一次性全部处理，称为“惰性求值”。



并行流与串行流 

并行流就是把一个内容分成多个数据块，并用不同的线程分 别处理每个数据块的流。 

Java 8 中将并行进行了优化，我们可以很容易的对数据进行并 行操作。Stream API 可以声明性地通过 parallel() 与 sequential() 在并行流与顺序流之间进行切换。



了解 Fork/Join 框架

Fork/Join 框架：就是在必要的情况下，将一个大任务，进行拆分(fork)成若干个 小任务（拆到不可再拆时），再将一个个的小任务运算的结果进行 join 汇总.





Fork/Join 框架与传统线程池的区别 

采用 “工作窃取”模式（work-stealing）： 当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加到线 程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中。 

相对于一般的线程池实现,fork/join框架的优势体现在对其中包含的任务的 处理方式上.在一般的线程池中,如果一个线程正在执行的任务由于某些原因 无法继续运行,那么该线程会处于等待状态.而在fork/join框架实现中,如果 某个子问题由于等待另外一个子问题的完成而无法继续运行.那么处理该子 问题的线程会主动寻找其他尚未运行的子问题来执行.这种方式减少了线程的等待时间,提高了性能.





## 新时间日期 API

使用 LocalDate、LocalTime、LocalDateTime 

 LocalDate、LocalTime、LocalDateTime 类的实 例是不可变的对象，分别表示使用 ISO-8601日 历系统的日期、时间、日期和时间。它们提供 了简单的日期或时间，并不包含当前的时间信 息。也不包含与时区相关的信息。



Instant 时间戳 

 用于“时间戳”的运算。它是以Unix元年(传统 的设定为UTC时区1970年1月1日午夜时分)开始 所经历的描述进行运算



Duration 和 Period 

 Duration:用于计算两个“时间”间隔

 Period:用于计算两个“日期”间隔



日期的操纵 

 TemporalAdjuster : 时间校正器。有时我们可能需要获 取例如：将日期调整到“下个周日”等操作。 

 TemporalAdjusters : 该类通过静态方法提供了大量的常 用 TemporalAdjuster 的实现。



解析与格式化

java.time.format.DateTimeFormatter 类：该类提供了三种 格式化方法： 

 预定义的标准格式 

 语言环境相关的格式 

 自定义的格式



时区的处理 

 Java8 中加入了对时区的支持，带时区的时间为分别为： ZonedDate、ZonedTime、ZonedDateTime 

其中每个时区都对应着 ID，地区ID都为 “{区域}/{城市}”的格式 例如 ：Asia/Shanghai 等

 ZoneId：该类中包含了所有的时区信息 

getAvailableZoneIds() : 可以获取所有时区时区信息 

of(id) : 用指定的时区信息获取 ZoneId 对象



## 6 接口中的默认方法与静态方法

接口中的默认方法 

Java 8中允许接口中包含具有具体实现的方法，该方法称为 “默认方法”，默认方法使用 default 关键字修饰。

接口默认方法的”类优先”原则 

若一个接口中定义了一个默认方法，而另外一个父类或接口中 又定义了一个同名的方法时 

 选择父类中的方法。如果一个父类提供了具体的实现，那么 接口中具有相同名称和参数的默认方法会被忽略。

  接口冲突。如果一个父接口提供一个默认方法，而另一个接 口也提供了一个具有相同名称和参数列表的方法（不管方法 是否是默认方法），那么必须覆盖该方法来解决冲突

Java8 中，接口中允许添加静态方法。



## 7 其他新特性

Optional 类 

Optional类(java.util.Optional) 是一个容器类，代表一个值存在或不存在， 原来用 null 表示一个值不存在，现在 Optional 可以更好的表达这个概念。并且 可以避免空指针异常。 

常用方法： 

Optional.of(T t) : 创建一个 Optional 实例 

Optional.empty() : 创建一个空的 Optional 实例 

Optional.ofNullable(T t):若 t 不为 null,创建 Optional 实例,否则创建空实例 

isPresent() : 判断是否包含值 orElse(T t) : 如果调用对象包含值，返回该值，否则返回t 

orElseGet(Supplier s) :如果调用对象包含值，返回该值，否则返回 s 获取的值 

map(Function f): 如果有值对其处理，并返回处理后的Optional，否则返回 Optional.empty() 

flatMap(Function mapper):与 map 类似，要求返回值必须是Optional



重复注解与类型注解

 Java 8对注解处理提供了两点改进：可重复的注解及可用于类 型的注解。



java8 api https://docs.oracle.com/javase/8/docs/api/



Jdk8文档  https://docs.oracle.com/javase/8/docs/