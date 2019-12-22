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



Java 8新特性简介 

 速度更快 

 代码更少（增加了新的语法 Lambda 表达式）

  强大的 Stream API

  便于并行

  最大化减少空指针异常 Optional 

其中最为核心的为 Lambda 表达式与Stream API





## Lambda表达式

Lambda 是一个匿名函数，我们可以把 Lambda表达式理解为是一段可以传递的代码(将代码 像数据一样进行传递)。可以写出更简洁、更 灵活的代码。作为一种更紧凑的代码风格，使Java的语言表达能力得到了提升。





Lambda 表达式语法 

Lambda 表达式在Java 语言中引入了一个新的语法元 素和操作符。这个操作符为 “->” ， 该操作符被称 为 Lambda 操作符或剪头操作符。它将 Lambda 分为 两个部分：

 左侧：指定了 Lambda 表达式需要的所有参数 

右侧：指定了 Lambda 体，即 Lambda 表达式要执行的功能。



语法格式一：无参，无返回值，Lambda 体只需一条语句



语法格式二：Lambda 需要一个参数



语法格式三：Lambda 只需要一个参数时，参数的小括号可以省略



语法格式四：Lambda 需要两个参数，并且有返回值



语法格式五：当 Lambda 体只有一条语句时，return 与大括号可以省略



语法格式六：



类型推断 

上述 Lambda 表达式中的参数类型都是由编译器推断 得出的。Lambda 表达式中无需指定类型，程序依然可 以编译，这是因为 javac 根据程序的上下文，在后台 推断出了参数的类型。Lambda 表达式的类型依赖于上 下文环境，是由编译器推断出来的。这就是所谓的“类型推断”





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