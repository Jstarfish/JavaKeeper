https://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html

# Java8新特性概览 

Java8早在2014年3月就发布了。

[What's New in JDK 8]( https://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html )

-  [Java Programming Language](http://docs.oracle.com/javase/8/docs/technotes/guides/language/enhancements.html#javase8) 
  - Lambda表达式：一个新的语言特性， 它们使您能够将函数视为方法参数，或将代码视为数据 
  - 方法引用： 方法引用为已经有名称的方法提供易于阅读的lambda表达式 
  -  重复注释提供了将同一注释类型多次应用于同一声明或类型使用的能力 
  -  类型注释提供了在使用类型的任何地方应用注释的能力，而不仅仅是在声明上。与可插拔类型系统一起使用，该特性支持改进的代码类型检查。 
  -  Improved type inference 
  -  方法参数反射 
-  [Collections](http://docs.oracle.com/javase/8/docs/technotes/guides/collections/changes8.html) 
  
  -  [java.util.stream](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html) 
  -  具有键冲突的hashmap的性能改进 
-  [Compact Profiles](http://docs.oracle.com/javase/8/docs/technotes/guides/compactprofiles/) contain predefined subsets of the Java SE platform and enable applications that do not require the entire Platform to be deployed and run on small devices. 
-  [Security](http://docs.oracle.com/javase/8/docs/technotes/guides/security/enhancements-8.html) 
-  [JavaFX](http://docs.oracle.com/javase/8/javase-clienttechnologies.htm) 
-  [Tools](http://docs.oracle.com/javase/8/docs/technotes/tools/enhancements-8.html) 
  
-  提供jjs命令来调用Nashorn引擎 
  
-  [Internationalization](http://docs.oracle.com/javase/8/docs/technotes/guides/intl/enhancements.8.html) 

  -  Unicode增强，包括对Unicode 6.2.0的支持
  -  Adoption of Unicode CLDR Data and the java.locale.providers System Property 
  - 新的 Calendar  和  Locale  API
  -  能够安装自定义资源包作为扩展 

-  [Deployment](http://docs.oracle.com/javase/8/docs/technotes/guides/jweb/enhancements-8.html) 

  - For sandbox applets and Java Web Start applications, `URLPermission` is now used to allow connections back to the server from which they were started. `SocketPermission` is no longer granted.
  - The Permissions attribute is required in the JAR file manifest of the main JAR file at all security levels.

-  [Date-Time Package](http://docs.oracle.com/javase/8/docs/technotes/guides/datetime/index.html) - a new set of packages that provide a comprehensive date-time model. 

-  [Scripting](http://docs.oracle.com/javase/8/docs/technotes/guides/scripting/enhancements.html#jdk8) 

  -  Java 8提供了一个新的Nashorn javascript引擎(取代了Nashorn javascript引擎)，它允许我们在JVM上运行特定的javascript应用

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







JAVA8增强的内容

https://docs.oracle.com/javase/8/docs/technotes/guides/language/enhancements.html#javase8



Java8 API

 https://docs.oracle.com/javase/8/docs/api/overview-summary.html 

## Java8新特性

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





# New and Enhanced APIs That Take Advantage of Lambda Expressions and Streams in Java SE 8

利用Lambda表达式和Streams，新增和改良的API

- `java.util`:  增加了 java.lang.invoke 包，
- `java.util.function`:  一个新的包，它包含为lambda表达式和方法引用提供目标类型的通用功能接口 
- `java.util.stream`:  一个新的包，它包含了为流和聚合操作提供功能的大部分接口和类 

## New Packages

 `java.util.function`
`java.util.stream` 



## Modified Packages( [java8API](https://docs.oracle.com/javase/8/docs/api/overview-summary.html ))

| Package                | New Classes                                                  | Modified Classes                                             |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `java.io`              | `UncheckedIOException`                                       | `BufferedReader`                                             |
| `java.lang`            | not applicable                                               | `AutoCloseable` `ThreadLocal` `String` `Iterable` `CharSequence` `Boolean` `Integer` `Long` `Float` `Double` |
| `java.nio.file`        | not applicable                                               | `Files`                                                      |
| `java.util`            | `PrimitiveIterator` `Spliterator` `DoubleSummaryStatistics` `IntSummaryStatistics` `LongSummaryStatistics` `Optional` `OptionalDouble` `OptionalInt` `OptionalLong` `Spliterators` `SplittableRandom` `StringJoiner` | `Arrays` `BitSet` `Collection` `Comparator` `Iterator` `List` `Map` `Map.Entry` `LinkedHashMap` `Random` `TreeMap` |
| `java.util.concurrent` | not applicable                                               | `ThreadLocalRandom`                                          |
| `java.util.jar`        | not applicable                                               | `JarFile`                                                    |
| `java.util.zip`        | not applicable                                               | `ZipFile`                                                    |
| `java.util.logging`    | not applicable                                               | `Logger`                                                     |
| `java.util.regex`      | not applicable                                               | `Pattern`                                                    |

------



## Lambda表达式

 “Lambda 表达式”(lambda expression)是一个**匿名函数**，Lambda表达式基于数学中的**λ演算**得名，直接对应于其中的 lambda 抽象(lambda abstraction)，是一个匿名函数，即没有函数名的函数。Lambda表达式可以表示**闭包**。 

Lambda表达式使您能够封装单个行为单元并将其传递给其他代码。如果希望对集合的每个元素、流程完成时或流程遇到错误时执行某个操作，可以使用lambda表达式。Lambda表达式由以下特性支持: 

- [Method References](http://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html) are compact, easy-to-read lambda expressions for methods that already have a name.
- [Default Methods](http://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html) enable you to add new functionality to the interfaces of your libraries and ensure binary compatibility with code written for older versions of those interfaces. They are interface methods that have an implementation and the `default` keyword at the beginning of the method signature. In addition, you can define static methods in interfaces.
- [New and Enhanced APIs That Take Advantage of Lambda Expressions and Streams in Java SE 8](https://docs.oracle.com/javase/8/docs/technotes/guides/language/lambda_api_jdk8.html) describe new and enhanced classes that take advantage of lambda expressions and streams.



### 1. 为什么要使用Lambda表达式

Lambda 是一个匿名函数，我们可以把 Lambda表达式理解为是一段可以传递的代码(将代码像数据一样进行传递——**行为参数化**)。可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使Java的语言表达能力得到了提升。

匿名类的一个问题是，如果您的[匿名类](https://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html)的实现非常简单，例如一个接口只包含一个方法，那么匿名类的语法可能看起来很笨拙和不清楚。在这些情况下，您通常试图将功能作为参数传递给另一个方法，例如当有人单击按钮时应该采取什么操作。Lambda表达式允许您这样做，将功能视为方法参数，或将代码视为数据。 

![hello-lambda](https://i.loli.net/2019/12/26/WugthVbdwUEm5J2.png)



### Lambda 表达式语法 

`(parameters) -> expression` 或`(parameters) ->{ statements; }`

Lambda 表达式在Java 语言中引入了一个新的语法元素和操作符。这个操作符为 <mark> “**->**”</mark> ， 该操作符被称为 **Lambda 操作符**或剪头操作符。它将 Lambda 分为两个部分：

- 左侧：指定了 Lambda 表达式需要的所有参数 

- 右侧：指定了 Lambda 体，即 Lambda 表达式要执行的功能。



1. 无参，无返回值，Lambda 体只需一条语句

   ```java
   Runnable runnable = () -> System.out.println("hello lambda");
   ```

2. Lambda 需要一个参数

   ```java
   Consumer<String> consumer = (args) -> System.out.println(args);
   ```

   Lambda 只需要一个参数时，参数的小括号可以省略

   ```java
   Consumer<String> consumer = args -> System.out.println(args);
   ```

3. Lambda 需要两个参数，并且有返回值（Lambda最多两个参数）

   ```java
   BinaryOperator<Long> binaryOperator = (Long x,Long y) -> {
   	System.out.println("实现函数接口方法");
   	return x +y;
   };
   ```

   参数的数据类型可省略，Java8增强了**类型推断**，且当 Lambda 体只有一条语句时，return 与大括号可以省略

   ```java
   BinaryOperator<Long> binaryOperator = (x, y) -> x + y;
   ```

   
   
   上联：左右遇一括号省
   
   下联：左侧推断类型省
   
   横批：能省则省
   
   

**类型推断** 

上述 Lambda 表达式中的参数类型都是由编译器推断 得出的。Lambda 表达式中无需指定类型，程序依然可以编译，这是因为 javac 根据程序的上下文，在后台 推断出了参数的类型。Lambda 表达式的类型依赖于上 下文环境，是由编译器推断出来的。这就是所谓的“类型推断”



### [Lambda表达式实例](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)

官方提供的示例，假设你要开发一个社交软件，那个缺打的PM成天改需求，今天要查询出成年用户的信息，明天又要查询成年女性的用户信息，后天又要按各种奇怪的搜索条件查询。

这时的程序员：从简单的用户遍历比较方法改为通用的搜索方法到后来都用上了工厂模式，等到第7天的时候，你不耐烦了，玛德，每个条件就一句话，我写了7个类，我可不想做`CtrlCV工程师`，这时候Lambda表达式是你的不二之选。

[代码](https://github.com/Jstarfish/starfish-learning/tree/master/starfish-learn-java8/src/lambda)

```java
import java.util.List;
import java.util.ArrayList;
import java.time.chrono.IsoChronology;
import java.time.LocalDate;

public class Person {

    public enum Sex {
        MALE, FEMALE
    }

    String name;
    LocalDate birthday;
    Sex gender;
    String emailAddress;

    Person(String nameArg, LocalDate birthdayArg,
           Sex genderArg, String emailArg) {
        name = nameArg;
        birthday = birthdayArg;
        gender = genderArg;
        emailAddress = emailArg;
    }

    public int getAge() {
        return birthday
                .until(IsoChronology.INSTANCE.dateNow())
                .getYears();
    }

    public void printPerson() {
        System.out.println(name + ", " + this.getAge());
    }

    public Sex getGender() {
        return gender;
    }

    public String getName() {
        return name;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public static int compareByAge(Person a, Person b) {
        return a.birthday.compareTo(b.birthday);
    }

    public static List<Person> createRoster() {

        List<Person> roster = new ArrayList<>();
        roster.add(
                new Person(
                        "Fred",
                        IsoChronology.INSTANCE.date(1980, 6, 20),
                        Person.Sex.MALE,
                        "fred@example.com"));
        roster.add(
                new Person(
                        "Jane",
                        IsoChronology.INSTANCE.date(1990, 7, 15),
                        Person.Sex.FEMALE, "jane@example.com"));
        roster.add(
                new Person(
                        "George",
                        IsoChronology.INSTANCE.date(1991, 8, 13),
                        Person.Sex.MALE, "george@example.com"));
        roster.add(
                new Person(
                        "Bob",
                        IsoChronology.INSTANCE.date(2000, 9, 12),
                        Person.Sex.MALE, "bob@example.com"));

        return roster;
    }
}

```

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public class RosterTest {

    interface CheckPerson {
        boolean test(Person p);
    }

    /**
     * 1. eg：输出年龄大于20岁的成员
     *   匹配符合某一特征的成员的方法
     *   如果老板要年龄在某一区间的成员呢？接着换方法
     */
    public static void printPersonsOlderThan(List<Person> roster, int age) {
        for (Person p : roster) {
            if (p.getAge() >= age) {
                p.printPerson();
            }
        }
    }

    /**
     * 2. eg:输出年龄在14到30岁之间的成员
     * 		更全面的匹配方法
     * 		如果老板只要男性成员呢？
     */
    public static void printPersonsWithinAgeRange(
            List<Person> roster, int low, int high) {
        for (Person p : roster) {
            if (low <= p.getAge() && p.getAge() < high) {
                p.printPerson();
            }
        }
    }

    /**
     * 3. eg:老板又提出了各种复杂的需求，不要处女座的、只要邮箱是163的，怎么搞？
     * 方法1：在本地类中指定搜索条件代码，通过接口方式，不同的需求对应不同的实现类，
     *		 每次都要新建实现类，写大量的代码
     * 方法2：在匿名类中指定搜索条件代码，不需要写各种实现，但是还要写个interface CheckPerson，
     *       而且匿名类写起来也挺麻烦
     * 方法3：Lambda表达式是懒人的不二之选，CheckPerson是一个只包含一个抽象方法的接口，
     *	     比较简单，Lambda可以省略其实现
     */
    public static void printPersons(
            List<Person> roster, CheckPerson tester) {
        for (Person p : roster) {
            if (tester.test(p)) {
                p.printPerson();
            }
        }
    }

    /**
     * 4. eg: 搞这么久，还得写一个接口，而且是只有一个抽象方法，还是不爽？
     * 			你也可以使用标准的函数接口来代替接口CheckPerson，从而进一步减少所需的代码量
     * 			java.util.function包中定义了标准的函数接口
     * 			我们可以使用JDK8提供的 Predicate<T>接口来代替CheckPerson。
     *			该接口包含方法boolean test(T t)
     */
    public static void printPersonsWithPredicate(
            List<Person> roster, Predicate<Person> tester) {
        for (Person p : roster) {
            if (tester.test(p)) {
                p.printPerson();
            }
        }
    }

    /**
     * 5. Lambda表达式可不只是能够简化匿名类
     * 		简化 p.printPerson(), 
     * 		使用Consumer<T>接口的void accept(T t)方法，相当于入参的操作
     */
    public static void processPersons(
            List<Person> roster,
            Predicate<Person> tester,
            Consumer<Person> block) {
        for (Person p : roster) {
            if (tester.test(p)) {
                block.accept(p);
            }
        }
    }

    /**
     * 6. eg: 老板说了只想看到邮箱
     * Function<T,R>接口，相当于输入类型，mapper定义参数，block负责方对给定的参数进行执行
     */
    public static void processPersonsWithFunction(
            List<Person> roster,
            Predicate<Person> tester,
            Function<Person, String> mapper,
            Consumer<String> block) {
        for (Person p : roster) {
            if (tester.test(p)) {
                String data = mapper.apply(p);
                block.accept(data);
            }
        }
    }

    // 7. 使用泛型
    public static <X, Y> void processElements(
            Iterable<X> source,
            Predicate<X> tester,
            Function<X, Y> mapper,
            Consumer<Y> block) {
        for (X p : source) {
            if (tester.test(p)) {
                Y data = mapper.apply(p);
                block.accept(data);
            }
        }
    }

    public static void main(String[] args) {
        List<Person> roster = Person.createRoster();

        /**
         * 1. 输出年龄大于20岁的成员
         */
        System.out.println("Persons older than 20:");
        printPersonsOlderThan(roster, 20);
        System.out.println();

        /**
         * 2. 输出年龄在14到30岁之间的成员
         */
        System.out.println("Persons between the ages of 14 and 30:");
        printPersonsWithinAgeRange(roster, 14, 30);
        System.out.println();

        /**
         * 3. 输出年龄在18到25岁的男性成员
         * （在本地类中指定搜索条件）
         * 您可以使用一个匿名类而不是一个本地类，并且不必为每个搜索声明一个新类
         */
        System.out.println("Persons who are eligible for Selective Service:");
        class CheckPersonEligibleForSelectiveService implements CheckPerson {
            public boolean test(Person p) {
                return p.getGender() == Person.Sex.MALE
                        && p.getAge() >= 18
                        && p.getAge() <= 25;
            }
        }

        printPersons(
                roster, new CheckPersonEligibleForSelectiveService());


        System.out.println();

        // 3. 在匿名类中指定搜索条件代码
        System.out.println("Persons who are eligible for Selective Service " +
                "(anonymous class):");
        printPersons(
                roster,
                new CheckPerson() {
                    public boolean test(Person p) {
                        return p.getGender() == Person.Sex.MALE
                                && p.getAge() >= 18
                                && p.getAge() <= 25;
                    }
                }
        );

        System.out.println();

        // 3: 使用Lambda表达式简化代码，一个箭头
        System.out.println("Persons who are eligible for Selective Service " +
                "(lambda expression):");

//        printPersons(
//                roster,
//                (Person p) -> p.getGender() == Person.Sex.MALE
//                        && p.getAge() >= 18
//                        && p.getAge() <= 25
//        );

        printPersons(roster, p -> p.getGender() == Person.Sex.MALE && p.getAge() >= 18 && p.getAge() <= 25);

        System.out.println();

        // 4. 使用Lambda的标准功能接口
        System.out.println("Persons who are eligible for Selective Service " +
                "(with Predicate parameter):");

        printPersonsWithPredicate(
                roster,
                p -> p.getGender() == Person.Sex.MALE
                        && p.getAge() >= 18
                        && p.getAge() <= 25
        );

        System.out.println();

        //5.使用Predicate和Consumer参数
        System.out.println("5. Persons who are eligible for Selective Service " +
                "(with Predicate and Consumer parameters):");

        processPersons(
                roster,
                p -> p.getGender() == Person.Sex.MALE
                        && p.getAge() >= 18
                        && p.getAge() <= 25,
                p -> p.printPerson()
        );

        System.out.println();

        // 6. 通过Function<T,R> 指定输出类型
        System.out.println("Persons who are eligible for Selective Service " +
                "(with Predicate, Function, and Consumer parameters):");

        processPersonsWithFunction(
                roster,
                p -> p.getGender() == Person.Sex.MALE
                        && p.getAge() >= 18
                        && p.getAge() <= 25,
                p -> p.getEmailAddress(),
                email -> System.out.println(email)
        );

        System.out.println();

        // 7. 使用泛型
        System.out.println("Persons who are eligible for Selective Service " +
                "(generic version):");

        processElements(
                roster,
                p -> p.getGender() == Person.Sex.MALE
                        && p.getAge() >= 18
                        && p.getAge() <= 25,
                p -> p.getEmailAddress(),
                email -> System.out.println(email)
        );

        System.out.println();

        // 8: 使用接受Lambda表达式的批量数据操作
        System.out.println("Persons who are eligible for Selective Service " +
                "(with bulk data operations):");

        roster.stream()
                .filter(
                        p -> p.getGender() == Person.Sex.MALE
                                && p.getAge() >= 18
                                && p.getAge() <= 25)
                .map(p -> p.getEmailAddress())
                .forEach(email -> System.out.println(email));
        System.out.println();

        /**
         *  9. 按年龄排序。Java 8 之前需要实现 Comparator 接口
         *  接口比较器是一个功能接口。因此，
         *  可以使用lambda表达式来代替定义并创建一个实现了Comparator的类的新实例:
         */
        Person[] rosterAsArray = roster.toArray(new Person[roster.size()]);

        Arrays.sort(rosterAsArray,
                (a, b) -> Person.compareByAge(a, b)
        );

        for (Person person : roster) {
            person.printPerson();
        }

        /**
         *  这种比较两个Person实例的出生日期的方法已经作为Person. 
         *	comparebyage存在。你可以在lambda表达式中调用这个方法
         */

        Arrays.sort(rosterAsArray,
                (a, b) -> Person.compareByAge(a, b)
        );

        /**
         *  ===================================================================
         *  方法引用：
         * 这个lambda表达式调用现有的方法，所以您可以使用方法引用而不是lambda表达式
         *  Person::compareByAge 等同于 (a, b) -> Person.compareByAge(a, b)
         */
        Arrays.sort(rosterAsArray, Person::compareByAge);

        System.out.println();

        // Reference to an Instance Method of a Particular Object
        class ComparisonProvider {
            public int compareByName(Person a, Person b) {
                return a.getName().compareTo(b.getName());
            }

            public int compareByAge(Person a, Person b) {
                return a.getBirthday().compareTo(b.getBirthday());
            }
        }
        ComparisonProvider myComparisonProvider = new ComparisonProvider();
        Arrays.sort(rosterAsArray, myComparisonProvider::compareByName);
        for (Person person : rosterAsArray) {
            person.printPerson();
        }

        System.out.println();

        /**
         * 引用特定类型的任意对象的实例方法
         * String::compareToIgnoreCase 格式化 (String a, String b) ，
         *  并去调用 a.compareToIgnoreCase(b)
         */
        String[] stringArray = { "Barbara", "James", "Mary", "John",
                "Patricia", "Robert", "Michael", "Linda" };
        Arrays.sort(stringArray, String::compareToIgnoreCase);
        for (String s : stringArray) {
            System.out.println(s);
        }


        System.out.println();

        // 通过 stream 将计算集合的和
        Integer[] intArray = {1, 2, 3, 4, 5, 6, 7, 8 };
        List<Integer> listOfIntegers =
                new ArrayList<>(Arrays.asList(intArray));
        System.out.println("Sum of integers: " +
                listOfIntegers
                        .stream()
                        .reduce(Integer::sum).get());
    }
}
```

------



## 函数式接口

### 什么是函数式接口  

- 只包含一个抽象方法的接口，称为函数式接口，该方法也被称为函数方法。 
- 这样的接口这么简单，都不值得在程序中定义，所以，JDK8在  `java.util.function`  中定义了几个标准的函数式接口，供我们使用。[Package java.util.function](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)
- 可以通过 Lambda 表达式来创建该接口的对象。（若 Lambda 表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方法上进行声明）。 
- 我们可以在任意函数式接口上使用 **@FunctionalInterface** 注解， 这样做可以检查它是否是一个函数式接口，同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口。

### 自定义函数式接口

```java
@FunctionalInterface
public interface MyFunc<T> {
    T getValue(T t);
}
```

```java
public static String toUpperString(MyFunc<String> myFunc, String str) {
    return myFunc.getValue(str);
}

public static void main(String[] args) {
    String newStr = toUpperString((str) -> str.toUpperCase(), "abc");
    System.out.println(newStr);
}
```

作为参数传递 Lambda 表达式：为了将 Lambda 表达式作为参数传递，接收Lambda 表达式的参数类型必须是与该 Lambda 表达式兼容的函数式接口的类型。 

函数接口为lambda表达式和方法引用提供目标类型 

### Java 内置四大核心函数式接口 

| 函数式接口    | 参数类型 | 返回类型 | 用途                                                         |
| ------------- | -------- | -------- | ------------------------------------------------------------ |
| Consumer<T>   | T        | void     | 对类型为T的对象应用操作，包含方法：void accept(T t)          |
| Supplier<T>   | 无       | T        | 返回类型为T的对象，包 含方法：T get();                       |
| Function<T,R> | T        | R        | 对类型为T的对象应用操作，并返回结果。结果是R类型的对象。包含方法：R apply(T t); |
| Predicate<T>  | T        | boolean  | 确定类型为T的对象是否满足某约束，并返回 boolean 值。包含方法 boolean test(T t); |

```java
import org.junit.Test;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

/*
 * Java8 内置的四大核心函数式接口
 * Consumer<T> : 消费型接口  void accept(T t);
 * 		
 * Supplier<T> : 供给型接口   T get();
 *
 * Function<T, R> : 函数型接口  R apply(T t);
 *
 * Predicate<T> : 断言型接口   boolean test(T t);
 */
public class FunctionalInterfaceTest {

    //Predicate<T> 断言型接口：将满足条件的字符串放入集合
    public List<String> filterStr(List<String> list, Predicate<String> predicate) {
        List<String> newList = new ArrayList<>();
        for (String s : list) {
            if (predicate.test(s)) {
                newList.add(s);
            }
        }
        return newList;
    }

    @Test
    public void testPredicate() {
        List<String> list = Arrays.asList("hello", "java8", "function", "predicate");
        List<String> newList = filterStr(list, s -> s.length() > 5);
        for (String s : newList) {
            System.out.println(s);
        }
    }

    // Function<T, R> 函数型接口：处理字符串
    public String strHandler(String str, Function<String, String> function) {
        return function.apply(str);
    }

    @Test
    public void testFunction() {
        String str1 = strHandler("测试内置函数式接口", s -> s.substring(2));
        System.out.println(str1);

        String str2 = strHandler("abcdefg", s -> s.toUpperCase());
        System.out.println(str2);
    }

    //Supplier<T> 供给型接口 :产生指定个数的整数，并放入集合
    public List<Integer> getNumList(int num, Supplier<Integer> supplier) {
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            Integer n = supplier.get();
            list.add(n);
        }
        return list;
    }

    @Test
    public void testSupplier() {
        List<Integer> numList = getNumList(10, () -> (int) (Math.random() * 100));

        for (Integer num : numList) {
            System.out.println(num);
        }
    }

    //Consumer<T> 消费型接口 :修改参数
    public void modifyValue(Integer value, Consumer<Integer> consumer) {
        consumer.accept(value);
    }

    @Test
    public void testConsumer() {
        modifyValue(3, s -> System.out.println(s * 3));
    }
}
```



**Package java.util.function**包下还提供了很多其他的演变方法。

![java8-function.png](https://i.loli.net/2019/12/31/tzNWejl7gdnvSrK.png)

------



## 方法引用

- 方法引用是指通过方法的名字来指向一个方法

- 当要传递给 Lambda 体的操作，已经有实现的方法了，就可以使用方法引用（实现抽象方法的参数列表，必须与方法引用方法的参数列表保持一致！）

- 方法引用的唯一用途是支持Lambda的简写(可以理解为方法引用是lambda表达式的另一种表现形式)

 使用 **::** 操作符将**方法名**和**对象或类**的名字分隔开 

### eg:

```java
BinaryOperator<Double> binaryOperator = (x,y)->Math.pow(x,y);
//等价于
BinaryOperator<Double> binaryOperator1 = Math::pow;

```



### 方法引用类型

Java 8 提供了4种方法引用

| Kind                             | Example                                |
| -------------------------------- | -------------------------------------- |
| 静态方法引用                     | `ContainingClass::staticMethodName`    |
| 特定对象的实例方法引用           | `containingObject::instanceMethodName` |
| 特定类型的任意对象的实例方法引用 | `ContainingType::methodName`           |
| 构造器引用                       | `ClassName::new`                       |

#### 1. 引用静态方法

```java
Arrays.sort(rosterAsArray, Person::compareByAge);
//---------------------
@Test
public void test3(){
    BiFunction<Double,Double,Double> bif = (x,y)->Math.max(x,y);
    System.out.println(bif.apply(22.1,23.2));

    System.out.println("===等价于===");

    BiFunction<Double,Double,Double> bif1 = Math::max;
    System.out.println(bif1.apply(22.1,23.2));
}

@Test
public void test4(){
    Comparator<Integer> com = (x, y)->Integer.compare(x,y);
    System.out.println(com.compare(1,2));

    System.out.println("===等价于===");
    Comparator<Integer> com1 = Integer::compare;
    System.out.println(com1.compare(1,2));
}
```

#### 2. 引用特定对象的实例方法

```java
class ComparisonProvider {
    public int compareByName(Person a, Person b) {
        return a.getName().compareTo(b.getName());
    }
        
    public int compareByAge(Person a, Person b) {
        return a.getBirthday().compareTo(b.getBirthday());
    }
}
ComparisonProvider myComparisonProvider = new ComparisonProvider();
Arrays.sort(rosterAsArray, myComparisonProvider::compareByName);
//------------------------
@Test
public void test2() {
    Person person = new Person("Tom", IsoChronology.INSTANCE.date(1995, 6, 20), Person.Sex.MALE, "tom@qq.com");

    Supplier<String> sup = () -> person.getName();
    System.out.println(sup.get());

    System.out.println("===等价于===");

    Supplier<String> sup1 = person::getName;
    System.out.println(sup1.get());
}
```

####  3. 引用特定类型的任意对象的实例方法

```java
String[] stringArray = { "Barbara", "James", "Mary", "John",
    "Patricia", "Robert", "Michael", "Linda" };
Arrays.sort(stringArray, String::compareToIgnoreCase);
//-------------------
@Test
public void test5(){
    BiPredicate<String,String> bp = (x,y)->x.equals(y);
    System.out.println(bp.test("Java情报局","Java情报局1"));
    System.out.println("===等价于===");

    BiPredicate<String,String> bp1 = String::equals;
    System.out.println(bp.test("Java情报局","Java情报局"));
}
```

#### 4. 引用构造器

将一个集合内元素复制到另一个集合中。

```java
public static <T, SOURCE extends Collection<T>, DEST extends Collection<T>>
    DEST transferElements(
        SOURCE sourceCollection,
        Supplier<DEST> collectionFactory) {
        
        DEST result = collectionFactory.get();
        for (T t : sourceCollection) {
            result.add(t);
        }
        return result;
}
```

Supplier是一个函数式接口，您可以使用lambda表达式调用方法TransferElements

```java
Set<Person> rosterSetLambda =
    transferElements(roster, () -> { return new HashSet<>(); });
```

使用构造器引用代替lambda表达式

```java
Set<Person> rosterSet = transferElements(roster, HashSet<Person>::new);
//Java编译器可以推断出要创建包含Person类型元素的HashSet集合，可简写
Set<Person> rosterSet = transferElements(roster, HashSet::new);
```

```java
Function<Integer,MyClass> fun = (n) -> new MyClass(n);
？？？  带多个参数的如何引用
Function<Integer,Person> fun = MyClass::new;
```

//???????????????????????

```java
@Test
public void test6(){
    Supplier<Person> sup = ()->new Person("Tom", IsoChronology.INSTANCE.date(1995, 6, 20), Person.Sex.MALE, "tom@qq.com");
    System.out.println(sup.get());
    System.out.println("===等价于===");

    //下边这个有问题
    Supplier<Person> sup1 = Person::new("Tom", IsoChronology.INSTANCE.date(1995, 6, 20), Person.Sex.MALE, "tom@qq.com");
    System.out.println(sup1.get());
}
```

**构造器引用还可以创建数组**

```java
@Test
public void test7(){
    Function<Integer,String[]> fun = args -> new String[args];
    String[] strs = fun.apply(6);
    System.out.println(strs.length);
    
    System.out.println("===等价于===");
    
    Function<Integer,String[]> fun1 = String[]::new;
    String[] strs1 = fun1.apply(6);
    System.out.println(strs1.length);
}
```



### 方法引用实例

```java
Person[] rosterAsArray =
    roster.toArray(new Person[roster.size()]);

//Comparator 是一个函数式接口？？
class PersonAgeComparator
    implements Comparator<Person> {
    public int compare(Person a, Person b) {
        return a.getBirthday().compareTo(b.getBirthday());
    }
}

// 实现比较器方法
Arrays.sort(rosterAsArray, new PersonAgeComparator());

// 使用Lambda表达式代替创建实现Comparator的实例类
Arrays.sort(rosterAsArray,
            (Person a, Person b) -> {
                return a.getBirthday().compareTo(b.getBirthday());
            }
           );

// 比较年龄的方法在Person.compareByAge的已经存在，所以可以使用方法引用
Arrays.sort(rosterAsArray, Person::compareByAge);

// 使用方法引用 == 下边简化后的 Lambda 表达式
Arrays.sort(rosterAsArray, (a, b) -> Person.compareByAge(a, b));

// 还可以直接使用Comparator比较器的方法
Arrays.sort(rosterAsArray,Comparator.comparing(Person::getBirthday));
```

------



## 强大的 Stream API

Stream 是 Java8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。 使用Stream API 对集合数据进行操作，就类似于使用 SQL 执行的数据库查询。也可以使用 Stream API 来并行执行操作。简而言之， Stream API 提供了一种高效且易于使用的处理数据的方式。



### Stream是个啥

流(Stream) 是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。

 “**集合讲的是数据，流讲的是计算！**” 

?>**tip**

- Stream 自己不会存储元素

- Stream 不会改变源对象。相反，他们会返回一个持有结果的新Stream

- Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行



### Stream 的操作三个步骤 

1. 创建 Stream 一个数据源（如：集合、数组），获取一个流

2. 中间操作(一个中间操作链，对数据源的数据进行处理)

3. 终止操作(一个终止操作，执行中间操作链，并产生结果)

![image-20191231155436575.png](https://i.loli.net/2019/12/31/C2D5pwsTm8FWP6O.png)

#### 1. 创建 Stream

 Java8 中的 Collection 接口被扩展，提供了两个获取流的方法： 

- default Streamstream() : 返回一个顺序流 

- default StreamparallelStream() : 返回一个并行流

##### 由数组创建流 

Java8 中的 Arrays 的静态方法 stream() 可 以获取数组流：

- static Streamstream(T[] array): 返回一个流 

**重载形式，能够处理对应基本类型的数组：**

- public static IntStream stream(int[] array) 

- public static LongStream stream(long[] array)

- public static DoubleStream stream(double[] array)

##### 由值创建流 

可以使用静态方法 Stream.of(), 通过显示值 创建一个流。它可以接收任意数量的参数。 

- public staticStreamof(T... values) : 返回一个流

##### 由函数创建流：创建无限流 

可以使用静态方法 Stream.iterate() 和 Stream.generate(), 创建无限流。 

- 迭代 
  - public staticStreamiterate(final T seed, final UnaryOperatorf) 

- 生成 
  - public staticStreamgenerate(Suppliers) : 



#### 2. Stream 的中间操作 

多个中间操作可以连接起来形成一个流水线，除非流水线上触发终止操作，否则中间操作不会执行任何的处理！ 而在终止操作时一次性全部处理，称为<mark>“惰性求值”</mark>。

##### 2.1 筛选与切片

| 方法                | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| filter(Predicate p) | 接收 Lambda ， 从流中排除某些元素                            |
| distinct()          | 筛选，通过流所生成元素的 hashCode() 和 equals() 去 除重复元素 |
| limit(long maxSize) | 截断流，使其元素不超过给定数量                               |
| skip(long n)        | 跳过元素，返回一个扔掉了前 n 个元素的流。若流中元素 不足 n 个，则返回一个空流。与 limit(n) 互补 |

##### 2.2 映射

| 方法                            | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| map(Function f)                 | 接收一个函数作为参数，该函数会被应用到每个元 素上，并将其映射成一个新的元素 |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 DoubleStream |
| mapToInt(ToIntFunction f)       | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 IntStream。 |
| mapToLong(ToLongFunction f)     | 接收一个函数作为参数，该函数会被应用到每个元 素上，产生一个新的 LongStream |
| flatMap(Function f)             | 接收一个函数作为参数，将流中的每个值都换成另 一个流，然后把所有流连接成一个流 |

##### 2.3 排序

| 方法                    | 描述                               |
| ----------------------- | ---------------------------------- |
| sorted()                | 产生一个新流，其中按自然顺序排序   |
| sorted(Comparator comp) | 产生一个新流，其中按比较器顺序排序 |



#### 3. Stream 的终止操作

 终端操作会从流的流水线生成结果。其结果可以是任何不是流的 值，例如：List、Integer，甚至是 void

##### 3.1 查找与匹配

| 方法                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| allMatch(Predicate p)  | 检查是否匹配所有元素                                         |
| anyMatch(Predicate p)  | 检查是否至少匹配一个元素                                     |
| noneMatch(Predicate p) | 检查是否没有匹配所有元素                                     |
| findFirst()            | 返回第一个元素                                               |
| findAny()              | 返回当前流中的任意元素                                       |
| count()                | 返回流中元素总数                                             |
| max(Comparator c)      | 返回流中最大值                                               |
| min(Comparator c)      | 返回流中最小值                                               |
| forEach(Consumer c)    | **内部迭代(使用 Collection 接口需要用户去做迭 代，称为外部迭代。相反，Stream API 使用内部 迭代——它帮你把迭代做了)** |

##### 3.2 规约

| 方法                             | 描述                                                   |
| -------------------------------- | ------------------------------------------------------ |
| reduce(T iden, BinaryOperator b) | 可以将流中元素反复结合起来，得到一个值。 返回 T        |
| reduce(BinaryOperator b)         | 可以将流中元素反复结合起来，得到一个值。 返回 Optional |

 备注：map 和 reduce 的连接通常称为 map-reduce 模式，因 Google 用它 来进行网络搜索而出名。 

##### 3.2 收集

| 方法                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| collect(Collector c) | 将流转换为其他形式。接收一个 Collector接口的 实现，用于给Stream中元素做汇总的方法 |

Collector接口中方法的实现决定了如何对流执行收集操作(如收 集到 List、Set、Map)。但是 Collectors 实用类提供了很多静态 方法，可以方便地创建常见收集器实例，具体方法与实例如下表：  https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collectors.html 

| 方法              | 返回类型             | 作用                                                         | 示例                                                         |
| ----------------- | -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| toList            | List<T>              | 把流中元素收集到List                                         | List emps= list.stream().collect(Collectors.toList());       |
| toSet             | Set<T>               | 把流中元素收集到Set                                          | Set emps= list.stream().collect(Collectors.toSet());         |
| toCollection      | Collection<T>        | 把流中元素收集到创建的集合                                   | Collectionemps=list.stream().collect(Collectors.toCollection(ArrayList::new)); |
| counting          | Long                 | 计算流中元素的个数                                           | long count = list.stream().collect(Collectors.counting());   |
| summingInt        | Integer              | 对流中元素的整数属性求和                                     | int total=list.stream().collect(Collectors.summingInt(Employee::getSalary)); |
| averagingInt      | Double               | 计算流中元素Integer属性的平均 值                             | doubleavg= list.stream().collect(Collectors.averagingInt(Employee::getSalary)); |
| summarizingInt    | IntSummaryStatistics | 收集流中Integer属性的统计值。 如：平均值                     | IntSummaryStatisticsiss= list.stream().collect(Collectors.summarizingInt(Employee::getSalary)); |
| joining           | String               | 连接流中每个字符串                                           | String str= list.stream().map(Employee::getName).collect(Collectors.joining()); |
| maxBy             | Optional<T>          | 根据比较器选择最大值                                         | Optionalmax= list.stream().collect(Collectors.maxBy(comparingInt(Employee::getSalary))); |
| minBy             | Optonal<T>           | 根据比较器选择最小值                                         | Optional min = list.stream().collect(Collectors.minBy(comparingInt(Employee::getSalary))); |
| reducing          | 归约产生的类型       | 从一个作为累加器的初始值开始，利用BinaryOperator与 流中元素逐个结合，从而归 约成单个值 | int total=list.stream().collect(Collectors.reducing(0, Employee::getSalar, Integer::sum)); |
| collectingAndThen | 转换函数返回的类型   | 包裹另一个收集器，对其结 果转换函数                          | int how= list.stream().collect(Collectors.collectingAndThen(Collectors.toList(), List::size)); |
| groupingBy        | Map<K,List<T>>       | 根据某属性值对流分组，属 性为K，结果为V                      | Map> map= list.stream() .collect(Collectors.groupingBy(Employee::getStatus)); |
| partitioningBy    | Map<Boolean,List<T>> | 根据true或false进行分区                                      | Map>vd= list.stream().collect(Collectors.partitioningBy(Employee::getManage)); |



### 并行流与串行流 

并行流就是把一个内容分成多个数据块，并用不同的线程分 别处理每个数据块的流。 

Java 8 中将并行进行了优化，我们可以很容易的对数据进行并 行操作。Stream API 可以声明性地通过 parallel() 与 sequential() 在并行流与顺序流之间进行切换。



### Fork/Join 框架

Fork/Join 框架：就是在必要的情况下，将一个大任务，进行拆分(fork)成若干个小任务（拆到不可再拆时），再将一个个的小任务运算的结果进行 join 汇总

![image-20191231163411156.png](https://i.loli.net/2019/12/31/ihAlSeYOE4gfp1q.png)





#### Fork/Join 框架与传统线程池的区别 

采用 “工作窃取”模式（work-stealing）： 当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加到线 程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中。 

相对于一般的线程池实现，fork/join框架的优势体现在对其中包含的任务的处理方式上，在一般的线程池中，如果一个线程正在执行的任务由于某些原因无法继续运行，那么该线程会处于等待状态，而在fork/join框架实现中，如果某个子问题由于等待另外一个子问题的完成而无法继续运行，那么处理该子问题的线程会主动寻找其他尚未运行的子问题来执行，这种方式减少了线程的等待时间,提高了性能。



















The following table maps each of the operations the method `processElements` performs with the corresponding aggregate operation:

| `processElements` Action                                     | Aggregate Operation                      |
| ------------------------------------------------------------ | ---------------------------------------- |
| Obtain a source of objects                                   | `Stream **stream**()`                    |
| Filter objects that match a `Predicate` object               | `Stream **filter**(Predicate predicate)` |
| Map objects to another value as specified by a `Function` object | ` Stream **map**(Function mapper)`       |
| Perform an action as specified by a `Consumer` object        | `void **forEach**(Consumer action)`      |



## 新时间日期 API

#### 使用 LocalDate、LocalTime、LocalDateTime 

- LocalDate、LocalTime、LocalDateTime 类的实例是**不可变的对象**，分别表示使用 ISO-8601日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含当前的时间信 息。也不包含与时区相关的信息。

#### Instant 时间戳 

- 用于“时间戳”的运算。它是以Unix元年(传统 的设定为UTC时区1970年1月1日午夜时分)开始所经历的描述进行运算

#### Duration 和 Period 

- Duration:用于计算两个“时间”间隔

- Period:用于计算两个“日期”间隔

#### 日期的操纵 

- TemporalAdjuster : 时间校正器。有时我们可能需要获 取例如：将日期调整到“下个周日”等操作。 

- TemporalAdjusters : 该类通过静态方法提供了大量的常 用 TemporalAdjuster 的实现。

  ```java
  //下周日
  @Test
  public void test1(){
      LocalDate nextSunday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
      System.out.println(nextSunday);
  }
  ```

#### 解析与格式化

java.time.format.DateTimeFormatter 类：该类提供了三种 格式化方法： 

- 预定义的标准格式 

- 语言环境相关的格式 

- 自定义的格式

#### 时区的处理 

- Java8 中加入了对时区的支持，带时区的时间为分别为： ZonedDate、ZonedTime、ZonedDateTime 

  其中每个时区都对应着 ID，地区ID都为 “{区域}/{城市}”的格式 例如 ：Asia/Shanghai 等

   ZoneId：该类中包含了所有的时区信息 

  - getAvailableZoneIds() : 可以获取所有时区时区信息 

  - of(id) : 用指定的时区信息获取 ZoneId 对象



## 接口中的默认方法与静态方法

#### 接口中的默认方法 

Java 8中允许接口中包含具有具体实现的方法，该方法称为 “默认方法”，默认方法使用 **default** 关键字修饰。

```java
interface MyFunc<T>{
    T func(int a);

    default String getName(){
        return "hello java8";
    }
}
```

**接口默认方法的”类优先”原则** 

若一个接口中定义了一个默认方法，而另外一个父类或接口中 又定义了一个同名的方法时 

- 选择父类中的方法。如果一个父类提供了具体的实现，那么 接口中具有相同名称和参数的默认方法会被忽略。

- 接口冲突。如果一个父接口提供一个默认方法，而另一个接 口也提供了一个具有相同名称和参数列表的方法（不管方法 是否是默认方法），那么必须覆盖该方法来解决冲突

```java
interface MyFunc<T> {
    default String getName() {
        return "hello java8";
    }
}

interface MyFunc1 {
    default String getName() {
        return "hello Java情报局";
    }
}

class MyClass implements MyFunc, MyFunc1 {

    @Override
    public String getName() {
        return MyFunc1.super.getName();
    }
}
```

#### 接口中的静态方法

Java8 中，接口中允许添加静态方法

```java
interface MyFunc<T> {

    static void show(){
        System.out.println("hello JavaEgg");
    }
    default String getName() {
        return "hello java8";
    }
}
```

------



## 其他新特性

### Optional 类 

Optional类(java.util.Optional) 是一个容器类，代表一个值存在或不存在， 原来用 null 表示一个值不存在，现在 Optional 可以更好的表达这个概念。并且 可以避免空指针异常。 

常用方法： 

- Optional.of(T t) : 创建一个 Optional 实例 

- Optional.empty() : 创建一个空的 Optional 实例 

- Optional.ofNullable(T t):若 t 不为 null,创建 Optional 实例,否则创建空实例 

- isPresent() : 判断是否包含值 orElse(T t) : 如果调用对象包含值，返回该值，否则返回t 

- orElseGet(Supplier s) :如果调用对象包含值，返回该值，否则返回 s 获取的值 

- map(Function f): 如果有值对其处理，并返回处理后的Optional，否则返回 Optional.empty() 

- flatMap(Function mapper):与 map 类似，要求返回值必须是Optional



### 重复注解与类型注解

 Java 8对注解处理提供了两点改进：可重复的注解及可用于类 型的注解

![](https://ftp.bmp.ovh/imgs/2019/12/c703840d2b401aa1.png)









# Aggregate Operations聚合操作

### Pipelines and Streams

通过集合roster调用stream（）方法创建流， filter() 操作返回一个新流，该流包含与其谓词匹配的元素 

 管道是聚合操作的序列（下边代码包含了filter和forEach两个聚合操作，两段代码等价）

```
roster
    .stream()
    .filter(e -> e.getGender() == Person.Sex.MALE)
    .forEach(e -> System.out.println(e.getName()));
```

```
for (Person p : roster) {
    if (p.getGender() == Person.Sex.MALE) {
        System.out.println(p.getName());
    }
}
```

管道包含以下组件：

- 一个 source ：可以是一个集合，一个数组，一个函数，或者是一个  I/O channel。
- 0个或过个  *intermediate operations* ：比如filter，产生一个新的流（ 流是元素的序列。与集合不同，它不是存储元素的数据结构  相反，流通过管道携带来自source的值 ）
- y个 *terminal operation* 



计算所有男性的平均年龄

```
double average = roster
    .stream()
    .filter(p -> p.getGender() == Person.Sex.MALE)
    .mapToInt(Person::getAge)
    .average()
    .getAsDouble();
```

 `mapToInt`  返回一个新的流 `IntStream`  



###  聚合操作和迭代器之间的区别 

 聚合操作，比如forEach，看起来就像迭代器。然而，它们有几个根本的区别 

- 内部迭代：不包含类似next的方法来指示它们处理集合的下一个元素 

-  它们处理来自流的元素 ： 聚合操作只操作来自流的元素，而不是直接来自集合，所以也被叫做 *stream operations*. 

-  它们支持将行为作为参数 ： 可以将lambda表达式指定为大多数聚合操作的参数 

   













java8 api https://docs.oracle.com/javase/8/docs/api/



Jdk8文档  https://docs.oracle.com/javase/8/docs/