# Java 8 通关攻略

> 点赞+收藏 就学会系列，文章收录在 GitHub [JavaEgg](https://github.com/Jstarfish/JavaEgg) ，N线互联网开发必备技能兵器谱

> Java8早在2014年3月就发布了，还不得全面了解下
>
> 本文是用我拙劣的英文和不要脸的这抄抄那抄抄，熬出的，没有深究源码，只是对 Java8 有一个整体的认知，可以上手用起来，示例代码也都在github上

# JDK 8 有什么新功能  

-  Java 编程语言（ Java Programming Language）
  - **Lambda表达式**：一个新的语言特性， 它们使您能够将函数视为方法参数，或将代码视为数据 
  - **方法引用**： 方法引用为已经有名称的方法提供易于阅读的lambda表达式 
  - **默认方法**：使用 default 关键字为接口定义默认方法（有实现的方法）
  -  **重复注解**提供了将同一注解多次应用于同一声明或类型使用的能力 
  -  **类型注解**提供了在使用类型的任何地方应用注解的能力，而不仅仅是在声明上
  -  Java8 增强了**类型推断**  
  -  方法参数反射 
  -  `java.util.function`:  一个新的包，它包含为lambda表达式和方法引用提供目标类型的通用功能接口 
-  集合（Collections）
  -   `java.util.stream`包中新增了 **Stream API** ，用来支持对元素流的函数式操作 
  -   改进了有键冲突问题的 **HashMap**
-  精简运行时（Compact Profiles）
-  安全性（Security）
-  JavaFX
-  Tools（包含一些调用Nashorn引擎、 启动JavaFX应用程序等等 ）
-  国际化（Internationalization）

  -  Unicode增强，包括对Unicode 6.2.0的支持
  - 提供了新的 Calendar  和  Locale  API
-  部署（Deployment） 
-  日期-时间 包（**Date-Time Package**）：提供了更全面的时间和日期操作
-  脚本（Scripting）：Java 8提供了一个新的 Nashorn javascript 引擎(取代了Nashorn javascript引擎)，它允许我们在JVM上运行特定的 javascript 应用
-  改进 IO 和 NIO
-  改进 `java.lang` 和 `java.util` 
   -  支持数组并行排序 
   -  支持Base64 的编码和解码
   -  支持 无符号运算
   -  **Optional 类** ：最大化减少空指针异常
- JDBC

  - JDBC-ODBC桥已被移除 
  - JDBC 4.2引入了新的特性 
-  Java DB（一个Java数据库）
-  网络（Networking）
   - 新增了 `java.net.URLPermission` 
-  并发（**Concurrency**）
   -  `CompletableFuture` 增强了之前的`Future`
   -  `java.util.concurrent.ConcurrentHashMap` 支持基于新添加的streams功能和lambda表达式的聚合操作 
   -  `java.util.concurrent.atomic`  提供了一组原子变量类， 对于单个变量支持无锁、线程安全操作的工具类 
   -  `java.util.concurrent.ForkJoinPool` 用于补充ExecutorService 
   -  `java.util.concurrent.locks.StampedLock` 提供了基于功能的锁，有三种模式用于控制读/写访问

- JVM: 移除了 PermGen ，取而代之的是Metaspace

Java8 特别强大的是Lambda 表达式和Stream，通过它两新增和增强了很多包

新增： `java.lang.invoke`、` java.util.function`、`java.util.stream` 

修改：

![modify-class.png](https://i.loli.net/2020/01/06/42aBbSWoVINYkjq.png)

------



## 一、Lambda表达式

可以把 Lambda 表达式理解为**简洁的表示可传递的匿名函数的一种方式**，Lambda表达式基于数学中的**λ演算**得名：它没有名称，但有参数列表、函数主体、返回类型，可能还有一个可以抛出的异常列表。

- 匿名——匿名函数（即没有函数名的函数），不像普通的方法有一个明确的名称，“写得少，想得多”
- 函数——Lambda函数不像方法那样属于某个特定的类，但一样有参数列表、函数主体和返回类型
- 传递——Lambda表达式可以作为参数传递给方法或者存储在变量中
- 简洁——无需像匿名类那样写很多模板代码

Lambda表达式使您能够封装单个行为单元并将其传递给其他代码。如果希望对集合的每个元素、流程完成时或流程遇到错误时执行某个操作，可以使用lambda表达式。



### 1. 为什么要使用Lambda表达式

Lambda 是一个匿名函数，我们可以把 Lambda表达式理解为是一段可以传递的代码(**将代码像数据一样进行传递**——**行为参数化**)。可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使Java的语言表达能力得到了提升。

匿名类的一个问题是，如果您的匿名类的实现非常简单，例如一个接口只包含一个方法，那么匿名类的语法可能看起来很笨拙和不清楚。在这些情况下，您通常试图将功能作为参数传递给另一个方法，例如当有人单击按钮时应该采取什么操作。Lambda表达式允许您这样做，将功能视为方法参数，或将代码视为数据。 

![hello-lambda](https://i.loli.net/2019/12/26/WugthVbdwUEm5J2.png)



### 2. Lambda 表达式语法 

`(parameters) -> expression` 或`(parameters) ->{ statements; }`

Lambda 表达式在 Java 语言中引入了一个新的语法元素和操作符。这个操作符为 <mark> “**->**”</mark> ， 该操作符被称为 **Lambda 操作符**或剪头操作符。它将 Lambda 分为两个部分：

- 左侧：指定了 Lambda 表达式需要的所有参数 

- 右侧：指定了 Lambda 体，即 Lambda 表达式要执行的功能

#### eg(错误示范)：

```java
(Integer i) -> return "hello"+i;   //错误的Lambda，return是一个控制流语句，需要{}
(String s) -> {"hello";}    //“hello”是一个表达式，不是语句，不需要{}，可以写成{return “hello”;}
```

#### eg(正确示范)：

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

3. Lambda 需要两个参数，并且有返回值

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

   

**类型推断** 

上述 Lambda 表达式中的参数类型都是由编译器推断得出的。Lambda 表达式中无需指定类型，程序依然可以编译，这是因为 javac 根据程序的上下文，在后台推断出了参数的类型。Lambda 表达式的类型依赖于上下文环境，是由编译器推断出来的。这就是所谓的“类型推断”。Java7中引入的**菱形运算符**（**<>**）,就是利用泛型从上下文推断类型。

```java
List<String> list = new ArrayList<>();
```



### 3. Lambda表达式实例

官方提供的示例，假设你要开发一个社交软件，那个缺打的PM成天改需求，今天要查询出成年用户的信息，明天又要查询成年女性的用户信息，后天又要按各种奇怪的搜索条件查询。

这时的程序员：从简单的用户遍历比较方法改为通用的搜索方法到后来都用上了工厂模式，等到第7天的时候，你不耐烦了，玛德，每个条件就一句话，我写了7个类，我可不想做`CtrlCV工程师`，这时候Lambda表达式是你的不二之选。

**行为参数化**就是可以帮助你处理频繁变更的需求的一种软件开发模式。

官方提供的demo，一步步告诉你使用Java8的好处（从值参数化到行为参数化）。[代码](https://github.com/Jstarfish/starfish-learning/tree/master/starfish-learn-java8/src/lambda)

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
        roster.add(new Person(
                        "Fred",
                        IsoChronology.INSTANCE.date(1980, 6, 20),
                        Person.Sex.MALE,
                        "fred@example.com"));
        roster.add(new Person(
                        "Jane",
                        IsoChronology.INSTANCE.date(1990, 7, 15),
                        Person.Sex.FEMALE, "jane@example.com"));
        roster.add(new Person(
                        "George",
                        IsoChronology.INSTANCE.date(1991, 8, 13),
                        Person.Sex.MALE, "george@example.com"));
        roster.add(new Person(
                        "Bob",
                        IsoChronology.INSTANCE.date(2000, 9, 12),
                        Person.Sex.MALE, "bob@example.com"));
        return roster;
    }
}

```

![](https://i04piccdn.sogoucdn.com/f55480c7c84bb963)

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
         *   您可以使用一个匿名类而不是一个本地类，并且不必为每个搜索声明一个新类
         */
        System.out.println("Persons who are eligible for Selective Service:");
        class CheckPersonEligibleForSelectiveService implements CheckPerson {
            public boolean test(Person p) {
                return p.getGender() == Person.Sex.MALE
                        && p.getAge() >= 18
                        && p.getAge() <= 25;
            }
        }

        // 这个其实就是通过行为参数化传递代码
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

        printPersons(
                roster,
                (Person p) -> p.getGender() == Person.Sex.MALE
                        && p.getAge() >= 18
                        && p.getAge() <= 25
        );

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
}
```

------



## 二、函数式接口

### 1. 什么是函数式接口

- 只包含一个抽象方法的接口，称为函数式接口，该抽象方法也被称为函数方法。 我们熟知的Comparator和Runnable、Callable就属于函数式接口。
- 这样的接口这么简单，都不值得在程序中定义，所以，JDK8在  `java.util.function`  中定义了几个标准的函数式接口，供我们使用。[Package java.util.function](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)
- 可以通过 Lambda 表达式来创建该接口的对象。（若 Lambda 表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方法上进行声明）。 
- 我们可以在任意函数式接口上使用 **@FunctionalInterface** 注解， 这样做可以检查它是否是一个函数式接口，同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口。

### 2. 自定义函数式接口

```java
@FunctionalInterface    //@FunctionalInterface标注该接口会被设计成一个函数式接口，否则会编译错误
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

作为参数传递 Lambda 表达式：为了将 Lambda 表达式作为参数传递，**接收Lambda 表达式的参数类型必须是与该 Lambda 表达式兼容的函数式接口的类型**。 

函数接口为lambda表达式和方法引用提供目标类型 

### 3. Java 内置四大核心函数式接口

| 函数式接口    | 参数类型 | 返回类型 | 用途                                                         |
| ------------- | -------- | -------- | ------------------------------------------------------------ |
| Consumer\<T>  | T        | void     | 对类型为T的对象应用操作，包含方法：void accept(T t)          |
| Supplier\<T>  | 无       | T        | 返回类型为T的对象，包 含方法：T get();                       |
| Function<T,R> | T        | R        | 对类型为T的对象应用操作，并返回结果。结果是R类型的对象。包含方法：R apply(T t); |
| Predicate\<T> | T        | boolean  | 确定类型为T的对象是否满足某约束，并返回 boolean 值。包含方法 boolean test(T t); |

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
 * Supplier<T> : 供给型接口   T get();
 * Function<T, R> : 函数型接口  R apply(T t);
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



**Package java.util.function** 包下还提供了很多其他的演变方法。

![java8-function.png](https://i.loli.net/2019/12/31/tzNWejl7gdnvSrK.png)

**?> Tip**

Java类型要么是引用类型（Byte、Integer、Objuct、List），要么是原始类型（int、double、byte、char）。但是泛型只能绑定到引用类型。将原始类型转换为对应的引用类型，叫**装箱**，相反，将引用类型转换为对应的原始类型，叫**拆箱**。当然Java提供了自动装箱机制帮我们执行了这一操作。

```java
List<Integer> list = new ArrayList();
	for (int i = 0; i < 10; i++) {
	list.add(i);    //int被装箱为Integer
}
```

但这在性能方面是要付出代价的。装箱后的值本质上就是把原始类型包裹起来，并保存在堆里。因此，装箱后的值需要更多的内存，并需要额外的内存搜索来获取被包裹的原始值。

以上funciton包中的**IntPredicate、DoubleConsumer、LongBinaryOperator、ToDoubleFuncation等就是避免自动装箱的操作**。一般，针对专门的输入参数类型的函数式接口的名称都要加上对应的原始类型前缀。



------



## 三、方法引用

- 方法引用是指通过方法的名字来指向一个方法

- 当要传递给 Lambda 体的操作，已经有实现的方法了，就可以使用方法引用（实现抽象方法的参数列表，必须与方法引用方法的参数列表保持一致！）

- 方法引用的唯一用途是支持Lambda的简写(可以理解为方法引用是lambda表达式的另一种表现形式，快捷写法)

 使用 <mark>**::**</mark> 操作符将**方法名**和**对象或类**的名字分隔开 

### 1. eg

```java
BinaryOperator<Double> binaryOperator = (x,y)->Math.pow(x,y);
//等价于
BinaryOperator<Double> binaryOperator1 = Math::pow;
```



### 2. 方法引用类型

Java 8 提供了4种方法引用

| Kind                             | Example                                |
| -------------------------------- | -------------------------------------- |
| 静态方法引用                     | `ContainingClass::staticMethodName`    |
| 特定对象的实例方法引用           | `containingObject::instanceMethodName` |
| 特定类型的任意对象的实例方法引用 | `ContainingType::methodName`           |
| 构造器引用                       | `ClassName::new`                       |

#### 1. 静态方法引用

```java
//比较年龄的方法在Person.compareByAge的已经存在，所以可以使用方法引用
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

#### 2. 特定对象的实例方法引用

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

####  3. 特定类型的任意对象的实例方法引用

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

#### 4. 构造器引用

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
//等价于
Function<Integer,Person> fun = MyClass::new;
// 带两个参数的构造器引用就要用BiFunction，多个参数的话，还可以自定义一个这样的函数式接口
```

```java
@Test
public void test6(){
    Supplier<Person> sup = ()->new Person("Tom", IsoChronology.INSTANCE.date(1995, 6, 20), Person.Sex.MALE, "tom@qq.com");
    System.out.println(sup.get());
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

------



## 四、Stream——函数式数据处理 

Stream 是 Java8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。 使用Stream API 对集合数据进行操作，就类似于使用 SQL 执行的数据库查询。也可以使用 Stream API 来并行执行操作。简而言之， **Stream API 提供了一种高效且易于使用的处理数据的方式**。

### 1. Stream是个啥

Stream(流) 是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。

 “**集合讲的是数据，流讲的是计算！**” 

?>**tip**

- Stream 自己不会存储元素

- Stream 不会改变源对象。相反，他们会返回一个持有结果的新Stream

- Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行

流操作有两个重要特点

- 流水线——很多流操作本身会返回一个流，这样多个操作就可以链接起来，形成一个大的流水线
- 内部迭代——与迭代器显示迭代集合不同，流的迭代操作都在背后进行

### 2. Stream 的操作三个步骤 

1. **创建 Stream** 一个数据源（如：集合、数组），获取一个流
2. **中间操作**(一个中间操作链，对数据源的数据进行处理，形成一条流的流水线)
3. **终止操作**(一个终止操作，执行中间操作链，并产生结果)

![](https://i.loli.net/2020/01/02/ktdAwhmWiNePnSJ.png)

#### 2.1. 创建 Stream

 Java8 中的 Collection 接口被扩展，提供了两个获取流的方法： 

- default Stream\<E> **stream()** : 返回一个顺序流 

- default Stream\<E> **parallelStream()** : 返回一个并行流

##### 由数组创建流 

Java8 中的 Arrays 的静态方法 stream() 可以获取数组流：

- static Stream stream(T[] array): 返回一个流 

**重载形式，能够处理对应基本类型的数组：**

- public static IntStream stream(int[] array) 

- public static LongStream stream(long[] array)

- public static DoubleStream stream(double[] array)

##### 由值创建流 

可以使用静态方法 Stream.of(), 通过显示值创建一个流。它可以接收任意数量的参数。 

- public static\<T> Stream\<T> of(T... values) : 返回一个流

##### 由函数创建流：创建无限流 

可以使用静态方法 Stream.iterate() 和 Stream.generate(), 创建无限流。 

- 迭代 
  - public static\<T> Stream\<T> iterate(final T seed, final UnaryOperator\<T> f) 

- 生成 
  - public static\<T> Stream\<T> generate(Supplier\<T> s) : 

```java
//创建 Stream
@Test
public void test1(){
  //1. Collection 提供了两个方法  stream() 与 parallelStream()
  List<String> list = new ArrayList<>();
  Stream<String> stream = list.stream(); //获取一个顺序流
  Stream<String> parallelStream = list.parallelStream(); //获取一个并行流

  //2. 通过 Arrays 中的 stream() 获取一个数组流
  Integer[] nums = new Integer[10];
  Stream<Integer> stream1 = Arrays.stream(nums);

  //3. 通过 Stream 类中静态方法 of()
  Stream<Integer> stream2 = Stream.of(1,2,3,4,5,6);

  //4. 创建无限流
  //迭代
  Stream<Integer> stream3 = Stream.iterate(0, (x) -> x + 2).limit(10);
  stream3.forEach(System.out::println);

  //生成
  Stream<Double> stream4 = Stream.generate(Math::random).limit(2);
  stream4.forEach(System.out::println);
}
```



#### 2.2. Stream 的中间操作 

多个中间操作可以连接起来形成一个流水线，除非流水线上触发终止操作，否则中间操作不会执行任何的处理！ 而在终止操作时一次性全部处理，称为<mark>“惰性求值”</mark>。

##### 2.2.1 筛选与切片

| 方法                | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| filter(Predicate p) | 接收 Lambda ， 从流中排除某些元素                            |
| distinct()          | 筛选，通过流所生成元素的 hashCode() 和 equals() 去除重复元素 |
| limit(long maxSize) | 截断流，使其元素不超过给定数量                               |
| skip(long n)        | 跳过元素，返回一个扔掉了前 n 个元素的流。若流中元素不足 n 个，则返回一个空流。与 limit(n) 互补 |

```java
List<Person> persons = Person.createRoster();

//内部迭代：迭代操作 Stream API 内部完成
@Test
public void test2(){
  //所有的中间操作不会做任何的处理
  Stream<Person> stream = persons.stream()
    .filter((e) -> {
      System.out.println("测试中间操作");
      return e.getAge() <= 35;
    });

  //只有当做终止操作时，所有的中间操作会一次性的全部执行，称为“惰性求值”
  stream.forEach(System.out::println);
}

//外部迭代
@Test
public void test3(){
  Iterator<Person> it = persons.iterator();

  while(it.hasNext()){
    System.out.println(it.next());
  }
}

@Test
public void test4(){
  persons.stream()
    .filter((p) -> {
      System.out.println("大于25岁的成员："); // &&  ||
      return (p.getAge()) >= 25;
    }).limit(3)
    .forEach(System.out::println);
}

@Test
public void test5(){
  persons.parallelStream()
    .filter((e) -> e.getAge() >= 20)
    .skip(2)
    .forEach(System.out::println);
}

@Test
public void test6(){
  persons.stream()
    .distinct()
    .forEach(System.out::println);
}
```



##### 2.2.2 映射

| 方法                            | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| map(Function f)                 | 接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素 |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 DoubleStream |
| mapToInt(ToIntFunction f)       | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 IntStream。 |
| mapToLong(ToLongFunction f)     | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 LongStream |
| flatMap(Function f)             | 接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流 |

```java
//映射
@Test
public void test1(){
  Stream<String> str = persons.stream()
    .map((e) -> e.getName());
  System.out.println("-------------------------------------------");
  List<String> strList = Arrays.asList("aaa", "bbb", "ccc", "ddd", "eee");
  Stream<String> stream = strList.stream()
    .map(String::toUpperCase);
  stream.forEach(System.out::println);

  System.out.println("---------------------------------------------");

  Stream<Character> stream3 = strList.stream()
    .flatMap(TestStreamAPI::filterCharacter);
  stream3.forEach(System.out::println);
}

public static Stream<Character> filterCharacter(String str){
  List<Character> list = new ArrayList<>();
  for (Character ch : str.toCharArray()) {
    list.add(ch);
  }
  return list.stream();
}
```



##### 2.2.3 排序

| 方法                    | 描述                               |
| ----------------------- | ---------------------------------- |
| sorted()                | 产生一个新流，其中按自然顺序排序   |
| sorted(Comparator comp) | 产生一个新流，其中按比较器顺序排序 |

```java
@Test
public void test(){
  persons.stream()
    .map(Person::getName)
    .sorted()
    .forEach(System.out::println);

  System.out.println("------------------------------------");

  persons.stream()
    .sorted((x, y) -> {
      if(x.getAge() == y.getAge()){
        return x.getName().compareTo(y.getName());
      }else{
        return Integer.compare(x.getAge(), y.getAge());
      }
    }).forEach(System.out::println);
}
```



#### 2.3. Stream 的终止操作

终端操作会从流的流水线生成结果。其结果可以是任何不是流的值，例如：List、Integer，甚至是 void

##### 2.3.1 查找与匹配

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

```java
public class TestStreamAPI2 {

	List<Person> persons = Person.createRoster();	
	//3. 终止操作
	@Test
	public void test1(){
			boolean bl = persons.stream()
				.allMatch((e) -> e.getGender().equals(Person.Sex.FEMALE));
			
			System.out.println("所有成员都为女性吗？"+bl);
			
			boolean bl1 = persons.stream()
				.anyMatch((e) -> e.getGender().equals(Person.Sex.FEMALE));
			
			System.out.println("成员中有女性吗？"+bl1);
			
			boolean bl2 = persons.stream()
				.noneMatch((e) -> e.getGender().equals(Person.Sex.FEMALE));
			
			System.out.println("成员中是不是没有女性？"+bl2);
	}
	
	@Test
	public void test2(){
		Optional<Person> op = persons.stream()
			.sorted(Comparator.comparingInt(Person::getAge))
			.findFirst();
		System.out.println("年龄最小的："+op.get());
		
		Optional<Person> op2 = persons.parallelStream()
			.filter((e) -> e.getGender().equals(Person.Sex.MALE))
			.findAny();
		
		System.out.println("随便找个男的："+op2.get());
	}
	
	@Test
	public void test3(){
		long count = persons.stream()
						 .filter((e) -> e.getGender().equals(Person.Sex.FEMALE))
						 .count();
		
		System.out.println("女生的人数："+count);
		
		Optional<Integer> op = persons.stream()
			.map(Person::getAge)
			.max(Integer::compare);
		
		System.out.println("最大年龄："+op.get());
		
		Optional<Person> op2 = persons.stream()
			.min((e1, e2) -> Integer.compare(e1.getAge(), e2.getAge()));
		
		System.out.println("最小年龄成员："+op2.get());
	}
	
	//注意：流进行了终止操作后，不能再次使用
	@Test
	public void test4(){
		Stream<Person> stream = persons.stream()
		 .filter((e) -> e.getGender().equals(Person.Sex.FEMALE));
		
		long count = stream.count();
		
		stream.map(Person::getAge)
			.max(Integer::compare);
	}
}
```



##### 2.3.2 规约

| 方法                             | 描述                                                       |
| -------------------------------- | ---------------------------------------------------------- |
| reduce(T iden, BinaryOperator b) | 可以将流中元素反复结合起来，得到一个值。 返回 T            |
| reduce(BinaryOperator b)         | 可以将流中元素反复结合起来，得到一个值。 返回 Optional\<T> |

 备注：map 和 reduce 的连接通常称为 map-reduce 模式，因 Google 用它来进行网络搜索而出名。 

```java
List<Person> persons = Person.createRoster();

//3. 终止操作:归约
@Test
public void test1(){
  List<Integer> list = Arrays.asList(1,2,3,4,5,6,7,8,9,10);
  Integer sum = list.stream()
    .reduce(0, (x, y) -> x + y);

  System.out.println(sum);
  System.out.println("----------------------------------------");

  Optional<Integer> op = persons.stream()
    .map(Person::getAge)
    .reduce(Integer::sum);
  System.out.println("所有成员的年龄和："+op.get());
}

//需求：搜索名字中 “B” 出现的次数
@Test
public void test2(){
  Optional<Integer> sum = persons.stream()
    .map(Person::getName)
    .flatMap(TestStreamAPI1::filterCharacter)
    .map((ch) -> {
      if(ch.equals('B'))
        return 1;
      else 
        return 0;
    }).reduce(Integer::sum);

  System.out.println(sum.get());
}
```



##### 2.3.3 收集

| 方法                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| collect(Collector c) | 将流转换为其他形式。接收一个 Collector接口的 实现，用于给Stream中元素做汇总的方法 |

#### Collectors

Collector接口中方法的实现决定了如何对流执行收集操作(如收集到 List、Set、Map)。但是 **Collectors** 实用类提供了很多静态方法，可以方便地创建常见收集器实例，具体方法与实例如下表：  https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collectors.html 

| 方法              | 返回类型              | 作用                                                         | 示例                                                         |
| ----------------- | --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| toList            | List\<T>              | 把流中元素收集到List                                         | List list= list.stream().collect(Collectors.toList());       |
| toSet             | Set\<T>               | 把流中元素收集到Set                                          | Set set= list.stream().collect(Collectors.toSet());          |
| toCollection      | Collection\<T>        | 把流中元素收集到创建的集合                                   | Collectione mps=list.stream().collect(Collectors.toCollection(ArrayList::new)); |
| counting          | Long                  | 计算流中元素的个数                                           | long count = list.stream().collect(Collectors.counting());   |
| summingInt        | Integer               | 对流中元素的整数属性求和                                     | Integer sum = persons.stream()    .collect(Collectors.summingInt(Person::getAge)); |
| averagingInt      | Double                | 计算流中元素Integer属性的平均值                              | double avg= list.stream().collect(Collectors.averagingInt(Person::getAge)); |
| summarizingInt    | IntSummaryStatistics  | 收集流中Integer属性的统计值。 如：平均值                     | IntSummaryStatistics iss= list.stream().collect(Collectors.summarizingInt(Person::getAge)); |
| joining           | String                | 连接流中每个字符串                                           | String str= list.stream().map(Person::getName).collect(Collectors.joining()); |
| maxBy             | Optional\<T>          | 根据比较器选择最大值                                         | Optionalmax= list.stream().collect(Collectors.maxBy(comparingInt(Person::getAge))); |
| minBy             | Optonal\<T>           | 根据比较器选择最小值                                         | Optional min = list.stream().collect(Collectors.minBy(comparingInt(Person::getAge))); |
| reducing          | 归约产生的类型        | 从一个作为累加器的初始值开始，利用BinaryOperator与 流中元素逐个结合，从而归 约成单个值 | int total=list.stream().collect(Collectors.reducing(0, Person::getAge, Integer::sum)); |
| collectingAndThen | 转换函数返回的类型    | 包裹另一个收集器，对其结果转换函数                           | int how= list.stream().collect(Collectors.collectingAndThen(Collectors.toList(), List::size)); |
| groupingBy        | Map<K,List\<T>>       | 根据某属性值对流分组，属性为K，结果为V                       | Map<Person.Sex, List\<Person>> map = persons.stream()    .collect(Collectors.groupingBy(Person::getGender)); |
| partitioningBy    | Map<Boolean,List\<T>> | 根据true或false进行分区                                      | Map<Boolean, List\<Person>> map = persons.stream()    .collect(Collectors.partitioningBy((e) -> e.getAge() >= 50)); |

```java
@Test
public void test3(){
  List<String> list = persons.stream()
    .map(Person::getName)
    .collect(Collectors.toList());
  list.forEach(System.out::println);
}

@Test
public void test4(){
  Optional<Integer> max = persons.stream()
    .map(Person::getAge)
    .collect(Collectors.maxBy(Integer::compare));

  System.out.println("最大年龄："+max.get());

  Optional<Person> op = persons.stream().min(Comparator.comparingInt(Person::getAge));

  System.out.println("最小年龄的成员："+op.get());

  Integer sum = persons.stream()
    .collect(Collectors.summingInt(Person::getAge));

  System.out.println("所有成员年龄和："+sum);

  IntSummaryStatistics dss = persons.stream()
    .collect(Collectors.summarizingInt(Person::getAge));

  System.out.println("最大年龄："+dss.getMax());
}

//分组
@Test
public void test5(){
  Map<Person.Sex, List<Person>> map = persons.stream()
    .collect(Collectors.groupingBy(Person::getGender));

  System.out.println("按性别分组："+map);
}

//多级分组
@Test
public void test6(){
  Map<Person.Sex, Map<String, List<Person>>> map = persons.stream()
    .collect(Collectors.groupingBy(Person::getGender, Collectors.groupingBy((e) -> {
      if(e.getAge() >= 60)
        return "老年";
      else if(e.getAge() >= 35)
        return "中年";
      else
        return "成年";
    })));

  System.out.println(map);
}

//分区
@Test
public void test7(){
  Map<Boolean, List<Person>> map = persons.stream()
    .collect(Collectors.partitioningBy((e) -> e.getAge() >= 50));

  System.out.println(map);
}
@Test
public void test8(){
  String str = persons.stream()
    .map(Person::getName)
    .collect(Collectors.joining("," , "----", "----"));

  System.out.println(str);
}

@Test
public void test9(){
  Optional<Integer> sum = persons.stream()
    .map(Person::getAge)
    .collect(Collectors.reducing(Integer::sum));
  System.out.println(sum.get());
}
```



### 3. 并行流与串行流 

#### 先说说并行和并发

并发是两个任务共享时间段，并行则是两个任务在同一时间发生，比如运行在多核CPU上。

![lbvsVU.png](https://s2.ax1x.com/2020/01/14/lbvsVU.png)

**并行流就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流**。 

Java 8 中将并行进行了优化，我们可以很容易的对数据进行并行操作。Stream API 可以声明性地通过 `parallel()` 与 `sequential()` 在并行流与顺序流之间进行切换。如果想从一个集合类创建一个流，调用`parallerStream`就可以获取一个并行流。

```java
public static long parallelSum(long n) {
    return Stream.iterate(1L, i -> i + 1)
        .limit(n)
        .parallel()    //将流转化为并行流
        .reduce(0L, Long::sum);
}
```

#### 配置并行流使用的线程池

使用流的parallel方法，你可能会想到，并行流用的线程是从哪儿来的？有多少个？怎么自定义？

并行流内部使用了默认的**ForkJoinPool**(分支/合并框架)，它默认的线程数量就是你的处理器数量，这个值是由`Runtime.getrRuntime().acailable-Processors()`得到。

你可以通过系统属性`java.util.concurrent.ForkJoinPool.common.parallelism`来改变线程池大小，如下

`System.setProperty("java.util.concurrent.ForkJoinPool.common.parallelism","12");`，这是一个全局设置，因此会影响代码中所有的并行流（目前还无法专门为某个并行流指定该值，一般而言，让ForkJoinPool的大小等于处理器数量是个不错的默认值）。

#### 高效使用并行流

- 并行流并不是总是比顺序流快
- 留意装箱。自动装箱和拆箱操作会大大降低性能，Java8 中有原始类型流（IntStream、LongStream...）来避免这种操作
- 有些操作本身在并行流上的性能就比顺序流差，特别是 limit 和 findFirst 等依赖元素顺序的操作，他们在并行流上执行的代价就非常大
- 还要考虑流的操作流水线的总计算成本
- 对于较小的数据量，没必要使用并行流
- 要考虑流背后的数据结构是否易于分解，比如，ArrayList 的拆分效率比 LinkedList 高很多，前者无需遍历
- 还要考虑终端操作中合并步骤的代价是大是小（比如Collector中的combiner方法）



### 4. Fork/Join 框架

并行流背后使用的基础框架就是 Java7 中引入的**分支/合并框架**。

Fork/Join（分支/合并）框架的目的是以递归方式将可以并行的任务拆分(fork)成更小的任务，然后将每个任务的结果合并 (join)起来生成整体效果。它是ExectorService接口的一个实现，把子任务分配给线程池（称为ForkJoinPool）中的工作线程。

Fork/Join 框架：就是在必要的情况下，将一个大任务，进行拆分(fork)成若干个小任务（拆到不可再拆时），再将一个个的小任务运算的结果进行 join 汇总

![fork-join.png](https://i.loli.net/2020/01/03/gaFyc3oPrjxTfeC.png)



```java
// 用分支/合并框架 并行求和
public class ForkJoinSumCalculator extends RecursiveTask<Long> {

    private final long[] numbers;
    private final int start;
    private final int end;

    //不再将任务分解为子任务的数组大小
    public static long THRESHOLD = 100;

    //公共构造器用于创建主任务
    public ForkJoinSumCalculator(long[] numbers) {
        this(numbers, 0, numbers.length);
    }

    //私有构造器用于以递归方式为主任务创建子任务
    private ForkJoinSumCalculator(long[] numbers, int start, int end) {
        this.numbers = numbers;
        this.start = start;
        this.end = end;
    }

    @Override
    protected Long compute() {
        int length = end - start;
        //如果大小小于等于阈值，顺序计算结果
        if (length <= THRESHOLD) {
            return computerSequntially();
        }

        ForkJoinSumCalculator leftTask = new ForkJoinSumCalculator(numbers, start, start + length / 2);

        leftTask.fork();

        ForkJoinSumCalculator rightTask = new ForkJoinSumCalculator(numbers, start + length / 2, end);

        Long rightResult = rightTask.compute();   //同步执行第二个任务，
        Long leftResult = leftTask.join(); // 读取第一个子任务的结果，如果尚未完成就等待
        return rightResult + leftResult;
    }


    // 子任务不再可分时计算和
    private long computerSequntially() {
        long sum = 0;
        for (int i = start; i < end; i++) {
            sum += numbers[i];
        }
        return sum;
    }

    public static long forkJoimSum(long n) {
        long[] numbers = LongStream.rangeClosed(1, n).toArray();
        ForkJoinTask<Long> task = new ForkJoinSumCalculator(numbers);
        return new ForkJoinPool().invoke(task);
    }

    public static void main(String[] args) {
        System.out.println("sum:" + forkJoimSum(10000));
    }
}
```



#### Fork/Join 框架与传统线程池的区别 

采用 “工作窃取”模式（work-stealing）： 当执行新的任务时它可以将其拆分成更小的任务执行，并将小任务加到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中。 

相对于一般的线程池实现，fork/join框架的优势体现在对其中包含的任务的处理方式上，在一般的线程池中，如果一个线程正在执行的任务由于某些原因无法继续运行，那么该线程会处于等待状态，而在fork/join框架实现中，如果某个子问题由于等待另外一个子问题的完成而无法继续运行，那么处理该子问题的线程会主动寻找其他尚未运行的子问题来执行，这种方式减少了线程的等待时间，提高了性能。

#### 使用Fork/Join框架的最佳做法

- 对一个任务调用join方法会阻塞调用方，直到该任务作出结果。因此，有必要在两个子任务的计算都开始之后再调用它
- 不应该在 RecursiveTask 内部使用 ForkJoinPool 的 invoke 方法。相反，你应该始终直接调用 compute 或fork 方法，只有顺序代码才应该用 invoke 来启动并行计算



#### 工作窃取

![fork-join-steal.jpg](https://i.loli.net/2020/01/03/N4KMeZuzEQjh2Co.png)



### 5. Spliterator

“可分迭代器”——spliterator，和Iterator一样，也用于遍历数据源中的元素，它是为了并行执行而设计。

Java8 为集合框架中包含的所有数据结构都提供了一个默认的 Spliterator 方法。集合实现了Spliterator接口，接口提供了一个Spliterator方法。

![spliterator](https://i.loli.net/2020/01/03/D7mhsfeoKSpOJ9N.png)



## 五、接口中的默认方法与静态方法

传统上，Java中实现接口的类必须为接口中定义的每个方法提供一个实现类，或者从父类中继承它的实现。但如果类库的设计者需要修改接口，加入新的方法，这种方式就会出现问题。所有使用该接口的实体类为了适配新的接口约定都需要进行修改（要是这么不兼容的话，迟早被淘汰）。所以，Java8为了解决这一问题引入了一种新的机制。**Java8中的接口支持在声明方法的同时提供实现**。其一，**Java8允许在接口中声明静态方法**。其二，Java8引入的新功能——**默认方法，通过默认方法可以指定接口方法的默认实现**（因此，实现接口的类如果不显式的提供该方法的具体实现，就会自动继承默认的实现，这种机制可以使你平滑的进行接口的优化和升级）。

#### 默认方法

Java 8中允许接口中包含具有具体实现的方法，该方法称为 “默认方法”，默认方法使用 **default** 关键字修饰。

```java
interface MyFunc<T>{
    T func(int a);

    default String getName(){
        return "hello java8";
    }
}
```

```java
@Test
public void test1(){
    List<Integer> list = Arrays.asList(22,11,33,55,4);
    //sort是List接口中的默认方法,naturalOrder是Comparator的静态方法
    list.sort(Comparator.naturalOrder());
    for (Integer integer : list) {
        System.out.println(integer);
    }
}
```

![default-method.png](https://i.loli.net/2020/01/03/gHvVGs7alt3UZQN.png)



#### 默认方法的”类优先”原则

若一个接口中定义了一个默认方法，而另外一个父类或接口中又定义了一个同名的方法时 

- 选择父类中的方法。如果一个父类提供了具体的实现，那么接口中具有相同名称和参数的默认方法会被忽略。

- 接口冲突。如果一个父接口提供一个默认方法，而另一个接口也提供了一个具有相同名称和参数列表的方法（不管方法是否是默认方法），那么必须覆盖该方法来解决冲突

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

JavaAPI的设计者们充分利用了默认方法，为集合接口和类新增了很多新的方法。

![](https://tva1.sinaimg.cn/large/006tNbRwly1galzsigkj0j31g20eago3.jpg)

------



## 六、Optional 类 

### 1. 用 Optional 取代 null

*当你碰到程序中有一个NullPointerException时的第一冲动是不就是赶紧找到代码，添加一个if语句，检查下？？*

NullPointerException是Java程序开发中典型的异常。为了避免这种异常，我们的代码有可能充斥着一层又一层的深度嵌套的null检查，代码可读性极差。

Optional类(java.util.Optional) 是一个容器类，代表一个值存在或不存在， 原来用 null 表示一个值不存在，现在 Optional 可以更好的表达这个概念。并且可以避免空指针异常。 

变量存在时，Optional类知识对类简单封装。变量不存在时，缺失的值就会被建模成一个“空”的Optional对象，由方法`Optional.empty()`返回。

常用方法： 

- Optional.of(T t) : 创建一个 Optional 实例 
- Optional.empty() : 创建一个空的 Optional 实例 
- Optional.ofNullable(T t):若 t 不为 null,创建 Optional 实例,否则创建空实例 
- isPresent() : 判断是否包含值 orElse(T t) : 如果调用对象包含值，返回该值，否则返回t 
- orElseGet(Supplier s) :如果调用对象包含值，返回该值，否则返回 s 获取的值 
- map(Function f): 如果有值对其处理，并返回处理后的Optional，否则返回 Optional.empty() 
- flatMap(Function mapper):与 map 类似，要求返回值必须是Optional



### 2. Optional 实例

#### 2.1 创建Optional对象

```java
@Test
public void test(){

    Optional<Person> optional = Optional.empty();  //创建一个空Optional

    Optional<Person> op = Optional.of(new Person());
    Person p = op.get();
    System.out.println(p);   //Person{name='null', birthday=null, gender=null, emailAddress='null'}

    Person person = null;
    Optional<Person> op1 = Optional.of(person); //person为null，抛出NullPointerException

    Optional<Person> op2 = Optional.ofNullable(person);   //创建允许null值得Optional对象

}
```

#### 2.2 optional 对象操作

```java
@Test
public void test4(){
    Person person = new Person("Tom",IsoChronology.INSTANCE.date(1999, 7, 15),Person.Sex.FEMALE, "Tom@360.com")
    Optional<Person> op = Optional.ofNullable(person);

    Optional<String> op1 = op.map(Person::getName);
    System.out.println(op1.get());
    
    /**
    * 使用 map 从 optional 对象中提取和转换值
    * 如果想提取人员姓名，之前需要判断persion !=null,Optional提供了一个map方法，对其处理
    **/
    Optional<String> op2 = op.map(Person::getName);
    System.out.println(op2.get());

    //使用 flatMap 链接 optional 对象
    Optional<String> op3 = op.flatMap((e) -> Optional.of(e.getName()));
    System.out.println(op3.get());
    
    //TODO
}
```



## 七、CompletableFuture —— 组合式异步编程

### 1. Future接口

Future接口在 Java 5 中被引入，设计初衷是对将来某个时刻会发生的结果进行建模。它建模了一种异步计算，返回一个执行运算结果的引用，当运算结束后，这个引用被返回给调用方。在 Future中触发那些潜在耗时的操作把调用线程解放出来，让它能继续执行其他有价值的工作， 不再需要等待耗时的操作完成。打个比方，你可以把它想象成这样的场景：你拿了一袋衣服到你中意的干洗店去洗衣服。干洗店员工会给你张发票，告诉你什么时候你的衣服会洗好（这就 是一个Future事件）。衣服干洗的同时，你可以去做其他的事情。Future的另一个优点是它比 更底层的Thread更易用。要使用Future，通常你只需要将耗时的操作封装在一个Callable对象中，再将它提交给ExecutorService，就可以了。下面这段代码展示了Java 8之前使用 Future的一个例子。 

```java
ExecutorService executor = Executors.newCachedThreadPool();
Future<Double> future = executor.submit(new Callable<Double>() {
    public Double call() {
        return doSomeThings();    //异步方式在新的线程中执行操作
    }
});
//doSomethingElse();    //异步操作进行的同时，可以做其他事情
try {
    //获取异步操作的结果，如果阻塞，等1秒后退出
    Double result = future.get(1, TimeUnit.SECONDS);   
} catch (ExecutionException | InterruptedException | TimeoutException e) {
}
```

#### 1.1 Future接口的局限性

虽然Future以及相关使用方法提供了异步执行任务的能力，但是对于结果的获取却是很不方便，只能通过阻塞或者轮询的方式得到任务的结果。阻塞的方式显然和我们的异步编程的初衷相违背，轮询的方式又会耗费无谓的CPU资源，而且也不能及时地得到计算结果，为什么不能用观察者设计模式当计算结果完成及时通知监听者呢？ 

Java的一些框架，比如Netty，自己扩展了Java的 `Future`接口，提供了`addListener`等多个扩展方法。Google guava也提供了通用的扩展Future:ListenableFuture、SettableFuture 以及辅助类Futures等,方便异步编程。

作为正统的Java类库，是不是应该做点什么，加强一下自身库的功能呢？ 

在Java 8中, 新增加了一个包含50个方法左右的类: **CompletableFuture**，提供了非常强大的Future的扩展功能，可以帮助我们简化异步编程的复杂性，提供了函数式编程的能力，可以通过回调的方式处理计算结果，并且提供了转换和组合CompletableFuture的方法。 

比如实现下面一些例子: 

- 将两个异步计算合并为一个——这两个异步计算之间相对独立，同时第二个又依赖于第一个的结果
- 等待Future集合中的所有任务都完成
- 仅等待Future集合中最快结束的任务完成（有可能因为它们试图通过不同的方式计算同 一个值），并返回它的结果
- 通过编程方式完成一个Future任务的执行（即以手工设定异步操作结果的方式）
- 应对Future的完成事件（即当Future的完成事件发生时会收到通知，并能使用Future 计算的结果进行下一步的操作，不只是简单地阻塞等待操作的结果）

####  1.2 使用CompletableFuture 构建异步应用

```java
public class TestCompletableFuture {
    public static CompletableFuture<Integer> compute() {
        final CompletableFuture<Integer> future = new CompletableFuture<>();
        return future;
    }
    public static void main(String[] args) throws Exception {
        final CompletableFuture<Integer> f = compute();
        class Client extends Thread {
            CompletableFuture<Integer> f;
            Client(String threadName, CompletableFuture<Integer> f) {
                super(threadName);
                this.f = f;
            }
            @Override
            public void run() {
                try {
                    System.out.println(this.getName() + ": " + f.get());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }
            }
        }
        new Client("Client1", f).start();
        new Client("Client2", f).start();
        System.out.println("waiting");
        f.complete(100);
        System.in.read();
    }
}
```



------



## 八、新时间日期 API

### 1. 使用 LocalDate、LocalTime、LocalDateTime 

- LocalDate、LocalTime、LocalDateTime 类的实例是**不可变的对象**，分别表示使用 ISO-8601日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含当前的时间信息。也不包含与时区相关的信息。

  ```java
  @Test
  public void test1(){
      LocalDate date = LocalDate.of(2020,01,03);
      Month month = date.getMonth();
      System.out.println(month);    //JANUARY
  
      DayOfWeek dayOfWeek = date.getDayOfWeek();
      System.out.println(dayOfWeek);   //FRIDAY
  
      int len = date.lengthOfMonth();
      System.out.println(len);  //31
      //使用TemporalField(ChronoField枚举实现了该接口）读取LocalDate的值
      int year = date.get(ChronoField.YEAR);
      System.out.println(year);  //2020
  
      LocalDate ld = LocalDate.parse("2020-01-03");
      System.out.println(ld);   //2020-01-03
  
      LocalTime time = LocalTime.of(19,56,11);
      System.out.println(time);  //19:56:11
  
      LocalDateTime ldt = LocalDateTime.now();
      LocalDateTime l1 = LocalDateTime.of(2020,01,03,18,48);
      System.out.println(l1);  //2020-01-03T18:48
  
      LocalDateTime l2 = l1.plusYears(3);
      System.out.println(l2);     //2023-01-03T18:48
  
      LocalDateTime l3 = l1.minusMonths(1);
      System.out.println(l3);  //2019-12-03T18:48
      System.out.println(l3.getMinute()+","+l3.getYear());   //48,2019
  }
  ```

### 2. Instant 时间戳 

- 用于“时间戳”的运算。它是以Unix元年(传统的设定为UTC时区1970年1月1日午夜时分)开始所经历的秒数进行计算

  ```java
  @Test
  public void test2(){
      Instant ins = Instant.now();  //默认使用 UTC 时区
      OffsetDateTime odt = ins.atOffset(ZoneOffset.ofHours(8));
      System.out.println(odt);
      System.out.println(ins.getNano());
      Instant ins2 = Instant.ofEpochSecond(5);
      System.out.println(ins2);
  }
  ```

### 3. Duration 和 Period 

- Duration:用于计算两个“时间”间隔

- Period:用于计算两个“日期”间隔

  ```java
  @Test
  public void test3(){
      Instant ins1 = Instant.now();
      try {
          Thread.sleep(1000);
      } catch (InterruptedException e) {
      }
      Instant ins2 = Instant.now();
      System.out.println("所耗费时间为：" + Duration.between(ins1, ins2));   
  
      System.out.println("----------------------------------");
      LocalDate ld1 = LocalDate.now();
      LocalDate ld2 = LocalDate.of(2019, 1, 1);
  
      Period pe = Period.between(ld2, ld1);
      System.out.println(pe.getYears());  
      System.out.println(pe.getMonths());
      System.out.println(pe.getDays());
  }
  ```


### 4. 日期的操纵 

- 通过 withXXX 方法修改 LocalDate 的属性

- TemporalAdjuster : 时间校正器。有时我们可能需要获取例如：将日期调整到“下个周日”等操作。 

- TemporalAdjusters : 该类通过静态方法提供了大量的常 用 TemporalAdjuster 的实现。

  ```java
  @Test
  public void test(){
      LocalDate date = LocalDate.now();
      //通过withAttributer方法修改LocalDate的属性
      LocalDate date1 = date.with(ChronoField.ALIGNED_WEEK_OF_YEAR,9);
      LocalDate date2 = date.withYear(2019);
      LocalDate date3 = date.withDayOfMonth(11);  //修改为11号
      System.out.println(date1);
      //下周日
      LocalDate nextSunday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
      System.out.println(nextSunday);
  }
  ```

### 5. 解析与格式化

`java.time.format.DateTimeFormatter` 类：该类提供了三种格式化方法： 

- 预定义的标准格式 

- 语言环境相关的格式 

- 自定义的格式

  ```java
  @Test
  public void test(){
      //DateTimeFormatter dtf = DateTimeFormatter.ISO_LOCAL_DATE;
      DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm:ss E");
  
      LocalDateTime ldt = LocalDateTime.now();
      String strDate = ldt.format(dtf);
  
      System.out.println(strDate); //2020年01月03日 20:32:14 星期五
  
      LocalDateTime newLdt = ldt.parse(strDate, dtf);
      System.out.println(newLdt);  //2020-01-03T20:32:14
  }
  ```

#### 时区的处理 

- Java8 中加入了对时区的支持，带时区的时间为分别为： ZonedDate、ZonedTime、ZonedDateTime 

  其中每个时区都对应着 ID，地区ID都为 “{区域}/{城市}”的格式 例如 ：Asia/Shanghai 等

   ZoneId：该类中包含了所有的时区信息 

  - getAvailableZoneIds() : 可以获取所有时区时区信息 
- of(id) : 用指定的时区信息获取 ZoneId 对象
  
  ```java
  @Test
  public void test(){
      Set<String> set = ZoneId.getAvailableZoneIds();  //遍历时区
      set.forEach(System.out::println);
      LocalDateTime ldt = LocalDateTime.now(ZoneId.of("Asia/Shanghai"));
      System.out.println(ldt);
  
      ZonedDateTime zdt = ZonedDateTime.now(ZoneId.of("US/Pacific"));
      System.out.println(zdt);
  }
  ```
  
  

## 九、重复注解与类型注解

### 注解

Java 8 对注解处理提供了两点改进：**可重复的注解**及**可用于类型的注解**

Java中注解是一种对程序元素进行配置，提供附加信息的机制（Java8之前，注解只能被用在声明上）

### 重复注解

![](https://tva1.sinaimg.cn/large/006tNbRwly1galxorjm1gj31m20cy765.jpg)

Java8 之前不允许上边这样的重复注解，所以一般会通过一些惯用手法绕过这一限制。可以声明一个新的注解，它包含了你希望重复的注解数组。

![](https://tva1.sinaimg.cn/large/006tNbRwly1galy1inqmij30qi0rwtb9.jpg)

#### 创建一个重复注解

1. 将注解标记为**@Repeatable**
2. 提供一个注解的容器

```java
import java.lang.annotation.Repeatable;
@Repeatable(Authors.class)
public @interface Author {
    String name();
}
```

```java
public @interface Authors {
    Author[] value();
}
```

```java
@Author(name = "Java")
@Author(name = "Android")
public class Book {
    public static void main(String[] args) {
        Author[] authors = Book.class.getAnnotationsByType(Author.class);
        Arrays.asList(authors).forEach(s->{
            System.out.println(s.name());
        });
    }
}
```

### 类型注解

Java8 开始，注解可以应用于任何类型。包括new操作符、类型转换、instanceof检查、范型类型参数，以及implemtnts和throws子句。

```java
@NotNull String name = person.getName();    //getName不返回空

List<@NotNull Person> persons = new ArrayList<>();  //persons总是非空
```



## 十、其他语言特性

### 原子操作

`java.util.concurrent.atomic` 包提供了多个对数字类型进行操作的类，比如AtomicInteger和AtomicLong，它们支持对单一变量的原子操作。这些类在Java 8中新增了更多的方法支持。

- getAndUpdate——以原子方式用给定的方法更新当前值，并返回变更之前的值

- updateAndGet——以原子方式用给定的方法更新当前值，并返回变更之后的值

- getAndAccumulate——以原子方式用给定的方法对当前及给定的值进行更新，并返回变更之前的值

- accumulateAndGet——以原子方式用给定的方法对当前及给定的值进行更新，并返回变更之后的值




**Adder和Accumulator**

多线程的环境中，如果多个线程需要频繁地进行更新操作，且很少有读取的动作(比如，在统计计算的上下文中)，Java API文档中推荐大使用新的类LongAdder、LongAccumulator、Double-Adder以及DoubleAccumulator，尽量避免使用它们对应的原子类型。这些新的类在设计之初就考虑了动态增长的需求，可以有效地减少线程间的竞争。

LongAddr 和 DoubleAdder 类都支持加法操作 ， 而 LongAccumulator 和 DoubleAccumulator可以使用给定的方法整合多个值。

### ConcurrentHashMap

ConcurrentHashMap类的引入极大地提升了HashMap现代化的程度，新引入的ConcurrentHashMap对并发的支持非常友好。ConcurrentHashMap允许并发地进行新增和更新操作，因为它仅对内部数据结构的某些部分上锁。因此，和另一种选择，即同步式的Hashtable比较起来，它具有更高的读写性能。

1. **性能**

   为了改善性能，要对ConcurrentHashMap的内部数据结构进行调整。典型情况下，map的条目会被存储在桶中，依据键生成哈希值进行访问。但是，如果大量键返回相同的哈希值，由于桶是由List实现的，它的查询复杂度为O(n)，这种情况下性能会恶化。在Java 8中，当桶过于臃肿时，它们会被动态地替换为排序树(sorted tree)，新的数据结构具有更好的查询性能(排序树的查询复杂度为O(log(n)))。注意，这种优化只有当键是可以比较的(比如String或者Number类)时才可能发生。

2. **类流操作**

   ConcurrentHashMap支持三种新的操作，这些操作和你之前在流中所见的很像:

- forEach——对每个键值对进行特定的操作
- reduce——使用给定的􏰤简函数(reduction function)，将所有的键值对整合出一个结果􏰝 
- search——对每一个键值对执行一个函数，直到函数的返回值为一个非空值

  以上每一种操作都支持四种形式，接受使用键、值、Map.Entry以及键值对的函数:

- 使用键和值的操作(forEach、reduce、search)
- 使用键的操作(forEachKey、reduceKeys、searchKeys)
- 使用值的操作 (forEachValue、reduceValues、searchValues)

- 使用Map.Entry对象的操作(forEachEntry、reduceEntries、searchEntries) 

注意，这些操作不会对ConcurrentHashMap的状态上锁。它们只会在运行过程中对元素进行操作。应用到这些操作上的函数不应该对任何的顺序，或者其他对象，或在计算过程发生变化的值，有依赖。 除此之外，你需要为这些操作指定一个并发阈值。如果经过预预估当前map的大小小于设定的阈值，操作会顺序执行。使用值1开开启基于通用线程池的最大并行。使用值Long.MAX_VALUE设定程序以单线程执行操作。下面这个例子中，我们使用reduceValues试图找出map中的最大值:

```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>(); 
Optional<Integer> maxValue = Optional.of(map.reduceValues(1, Integer::max));
```

注意，对int、long和double，它们的reduce操作各有不同(比如reduceValuesToInt、reduceKeysToLong等)。

3. 计数

   ConcurrentHashMap类提供了一个新的方法，名叫**mappingCount**，它以长整型long返回map中映射的数目。我们应该尽量使用这个新方法，而不是老的size方法，size方法返回的类型为int。这是因为映射的数量可能是int无法表示的。

4. 集合视图

   ConcurrentHashMap类还提供了一个名为**KeySet**的新方法，该方法以Set的形式返回ConcurrentHashMap的一个视图(对map的修改会反映在该Set中，反之亦然)。你也可以使用新的静态方法**newKeySet**，由ConcurrentHashMap创建一个Set。

### Arrays

Arrays类提供了不同的静态方法对数组进行操作。现在，它又包括了四个新的方法(它们都有特别重载的变量)

- **parallelSort**：parallelSort方法会以并发的方式对指定的数组进行排序，你可以使用自然顺序，也可以

  为数组对象定义特别的Comparator

- **setAll和parallelSetAll**：setAll和parallelSetAll方法可以以顺序的方式也可以用并发的方式，使用提供的函数 计算每一个元素的值，对指定数组中的所有元素进行设置

- **parallelPrefix**：parallelPrefix方法以并发的方式，用用户提供的二进制操作符对给定数组中的每个元素

  进行累积计算

### Number

 Number类中新增方法

- Short、Integer、Long、Float和Double类提供了静态方法sum、min和max
- Integer和Long类提供了compareUnsigned、divideUnsigned、remainderUnsigned 和toUnsignedLong方法来处理无符号数。 
- Integer和Long类也分别提供了静态方法parseUnsignedInt和parseUnsignedLong 将字符解析为无符号int或者long类型。
- Byte和Short类提供了toUnsignedInt和toUnsignedLong方法通过无符号转换将参数转化为 int 或 者 long 类型。类似地， Integer 类现在也提供了静态方法 toUnsignedLong。 
- Double和Float类提供了静态方法isFinite，可以检查参数是否为有限浮点数。
- Boolean类现在提供了静态方法logicalAnd、logicalOr和logicalXor，可以在两个 boolean之间执行and、or和xor操作。 
- BigInteger 类提供了 byteValueExact 、 shortValueExact 、 intValueExact 和 longValueExact，可以将BigInteger类型的值转换为对应的基础类型。不过，如果在转换过程中有信息的丢失，方法会抛出算术异常。 

### Math

如果Math中的方法在操作中出现ຼ出，Math类提供了新的方法可以抛出算术异常。支持这一异常的方法包括使用int和long参数的addExact、subtractExact、multipleExact、 incrementExact、decrementExact和negateExact。此外，Math类还新增了一个静态方法 toIntExact，可以将long值转换为int值。其他的新增内容包括静态方法floorMod、floorDiv 和nextDown。 

### Files

Files类最引人注目的改变是，你现在可以用文件直接产生流

- Files.list——生成由指定目录中所有条目构成的Stream\<Path>。这个列表不是递归包含的。由于流是延迟消费的，处理包含内容非常庞大的目录时，这个方法非常有用
- Files.walk——和Files.list有些类似，它也生成包含给定目录中所有条目的 Stream\<Path>。不过这个列表是递归的，你可以设定递归的深度。注意，该遍历是依照深度优先进行的
- Files.find—— 通过递归地遍历一个目录找到符合条件的条目，并生成一个  Stream\<Path> 对象

### String

String类也新增􏱗了一个静态方法，名叫join。它可以用一个分隔符将多个字符串􏶘接起来。和我们以前使用的apache提供的`StringUtils.join`一样。

### Reflection  

Reflection API的变化就是为了支持Java 8中注解机制的改变。 除此之外，Relection接口的另一个变化是**新增了可以查询方法参数信息的API**，比如，你现在可以使用新的`java.lang.reflect.Parameter`类查询方法参数的名称和修饰符。 

------



## FAQ

![](https://i04piccdn.sogoucdn.com/73c6ca3174ce3662)

- 说说你知道的Java8 有哪写新特性？

- 什么是lambda表达式？有啥优点？
- ConcurrentHashMap 在Java8 和 Java7的实现区别？
- 能说说 Java 8 改进的JVM 不?
- hashMap原理，java8做了哪些改变？
- 外部迭代和内部迭代，你晓得吧？

------



## 参考

《Java 8实战》
《Java 8函数式编程》
Java 8官方文档
某免费视频学习网站





