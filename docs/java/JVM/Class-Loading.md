# 类加载子系统

> 带着问题，尤其是面试问题的学习才是最高效的。加油，奥利给！
>
> 点赞+收藏 就学会系列，文章收录在 GitHub [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱

## 直击面试

1. 看你简历写得熟悉 JVM，那你说说类的加载过程吧？
2. 我们可以自定义一个 String 类来使用吗？
3. 什么是类加载器，类加载器有哪些？这些类加载器都加载哪些文件？
4. 多线程的情况下，类的加载为什么不会出现重复加载的情况？
5. 什么是双亲委派机制？它有啥优势？可以打破这种机制吗？

------
## 类加载子系统

![](https://tva1.sinaimg.cn/large/0082zybply1gbzlnjzayoj30u00wpwn7.jpg)



## 类加载机制概念

**Java 虚拟机把描述类的数据从 Class 文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型，这就是虚拟机的加载机制**。Class 文件由类装载器装载后，在 JVM 中将形成一份描述 Class 结构的元信息对象，通过该元信息对象可以获知 Class 的结构信息：如构造函数，属性和方法等，Java 允许用户借由这个 Class 相关的元信息对象间接调用 Class 对象的功能，这里就是我们经常能见到的 Class 类。



## 类加载子系统作用

- 类加载子系统负责从文件系统或者网络中加载 class 文件，class 文件在文件开头有特定的文件标识（0xCAFEBABE）
- ClassLoader 只负责 class 文件的加载。至于它是否可以运行，则由 Execution Engine 决定
- 加载的类信息存放于一块称为方法区的内存空间。除了类的信息外，方法区中还存放运行时常量池信息，可能还包括字符串字面量和数字常量（这部分常量信息是class文件中常量池部分的内存映射）
- Class 对象是存放在堆区的



## 类加载器 ClassLoader 角色

1. class file 存在于本地硬盘上，可以理解为设计师画在纸上的模板，而最终这个模板在执行的时候是要加载到 JVM 当中来根据这个文件实例化出 n 个一模一样的实例
2. class file 加载到 JVM 中，被称为 DNA 元数据模板，放在方法区
3. 在 .calss 文件 -> JVM -> 最终成为元数据模板，此过程就要一个运输工具（类装载器），扮演一个快递员的角色

------



## 类加载过程

类从被加载到虚拟机内存中开始，到卸载出内存为止，它的整个生命周期包括：**加载、验证、准备、解析、初始化、使用和卸载**七个阶段。(验证、准备和解析又统称为连接，为了支持 Java 语言的**运行时绑定**，所以**解析阶段也可以是在初始化之后进行的**。以上顺序都只是说开始的顺序，实际过程中是交叉的混合式进行的，加载过程中可能就已经开始验证了)

![jvm-class-load](https://tva1.sinaimg.cn/large/0082zybply1gbnxhplvkrj30yi0d60ty.jpg)

### 1. 加载（Loading）：

1. 通过一个类的全限定名获取定义此类的二进制字节流（简单点说就是找到文件系统中/jar 包中/或存在于任何地方的“`class 文件`”。 如果找不到二进制表示形式，则会抛出 `NoClassDefFound` 错误。）
2. 将这个字节流所代表的的静态存储结构转化为方法区的运行时数据结构
3. **在内存中生成一个代表这个类的 `java.lang.Class` 对象**，作为方法区这个类的各种数据的访问入口

加载 `.class` 文件的方式

- 从本地系统中直接加载
- 通过网络获取，典型场景：Web Applet
- 从 zip 压缩文件中读取，成为日后 jar、war 格式的基础
- 运行时计算生成，使用最多的是：动态代理技术
- 由其他文件生成，比如 JSP 应用
- 从专有数据库提取 .class 文件，比较少见
- 从加密文件中获取，典型的防 Class 文件被反编译的保护措施

### 2. 连接（Linking）

#### 验证（Verify）

- 目的在于确保 Class 文件的字节流中包含信息符合当前虚拟机要求，保证被加载类的正确性，不会危害虚拟机自身安全
- 主要包括四种验证，**文件格式验证，元数据验证，字节码验证，符号引用验证**

> 校验过程检查 classfile 的语义，判断常量池中的符号，并执行类型检查， 主要目的是判断字节码的合法性，比如 magic number, 对版本号进行验证。 这些检查过程中可能会抛出 `VerifyError`， `ClassFormatError` 或 `UnsupportedClassVersionError`。
>
> 因为 classfile 的验证属是链接阶段的一部分，所以这个过程中可能需要加载其他类，在某个类的加载过程中，JVM 必须加载其所有的超类和接口。
>
> 如果类层次结构有问题（例如，该类是自己的超类或接口,死循环了），则 JVM 将抛出 `ClassCircularityError`。 而如果实现的接口并不是一个 interface，或者声明的超类是一个 interface，也会抛出 `IncompatibleClassChangeError`。

#### 准备（Prepare）

然后进入准备阶段，这个阶段将会创建静态字段, 并将其初始化为标准默认值(比如`null`或者`0 值`)，并分配方法表，即在方法区中分配这些变量所使用的内存空间。

- 为**类变量**分配内存并且设置该类变量的默认初始值，即**零值**
  | 数据类型  | 零值     |
  | --------- | -------- |
  | int       | 0        |
  | long      | 0L       |
  | short     | (short)0 |
  | char      | '\u0000' |
  | byte      | (byte)0  |
  | boolean   | false    |
  | float     | 0.0f     |
  | double    | 0.0d     |
  | reference | null     |
- 这里不包含用 final 修饰的 static，因为 final 在编译的时候就会分配了，准备阶段会显示初始化
- 这里**不会为实例变量分配初始化**，类变量会分配在**方法区**中，而实例变量是会在对象实例化时随着对象一起分配到 Java 堆中

  ```java
  private static int i = 1;  //变量i在准备阶只会被赋值为0，初始化时才会被赋值为1
  private final static int j = 2;  //这里被final修饰的变量j，直接成为常量，编译时就会被分配为2
  ```

#### 解析（Resolve）

然后进入可选的解析符号引用阶段。 也就是解析常量池，主要有以下四种：类或接口的解析、字段解析、类方法解析、接口方法解析。

- 将常量池内的符号引用转换为直接引用的过程
- 事实上，解析操作往往会伴随着 JVM 在执行完初始化之后再执行
- 符号引用就是一组符号来描述所引用的目标。符号引用的字面量形式明确定义在《Java虚拟机规范》的 Class文件格式中。直接引用就是直接指向目标的指针、相对偏移量或一个间接定位到目标的句柄（如果有了直接引用，那引用的目标必定在堆中存在）
- 解析动作主要针对类或接口、字段、类方法、接口方法、方法类型等。对应常量池中的`CONSTANT_Class_info`、`CONSTANT_Fieldref_info`、`CONSTANT_Methodref_info`等

> [《JVM里的符号引用如何存储？》](https://www.zhihu.com/question/30300585)

### 3. 初始化（Initialization）

JVM 规范明确规定, 必须在类的首次“主动使用”时才能执行类初始化。

初始化的过程包括执行：

- 类构造器方法
- static 静态变量赋值语句
- static 静态代码块

如果是一个子类进行初始化会先对其父类进行初始化，保证其父类在子类之前进行初始化。所以其实在 java 中初始化一个类，那么必然先初始化过 `java.lang.Object` 类，因为所有的 java 类都继承自 java.lang.Object。

> - 初始化阶段就是执行**类构造器方法** `<clinit>()` 的过程
> - 此方法不需要定义，是 javac 编译器自动收集类中的所有类变量的赋值动作和静态代码块中的语句合并而来
> - 构造器方法中指令按语句在源文件中出现的顺序执行
> - `<clinit>()` 不同于类的构造器（构造器是虚拟机视角下的 `<init>()`）
> - 若该类具有父类，JVM 会保证子类的 `<clinit>()` 执行前，父类的 `<clinit>()` 已经执行完毕
> - 虚拟机必须保证一个类的 `<clinit>()` 方法在多线程下被同步加锁

```java
public class ClassInitTest{
  private static int num1 = 30;
  static{
    num1 = 10;
    num2 = 10;     //num2写在定义变量之前，为什么不会报错呢？？
    System.out.println(num2);   //這裡直接打印可以吗？ 报错，非法的前向引用，可以赋值，但不可调用
  }
  private static int num2 = 20;  //num2在准备阶段就被设置了默认初始值0，初始化阶段又将10改为20
  public static void main(String[] args){
    System.out.println(num1);  //10
    System.out.println(num2);   //20
  }
}
```



## 类加载时机

#### Java类何时会被加载

Java 程序对类的使用方式分为：主动使用和被动使用。虚拟机规范规定**有且只有 5 种情况必须立即对类进行“初始化”**，即类的主动使用。

- 创建类的实例、访问某个类或接口的静态变量，或者对该静态变量赋值、调用类的静态方法（即遇到 `new`、`getstatic`、`putstatic`、`invokestatic` 这四条字节码指令时）
- 反射
- 初始化一个类的子类
- Java 虚拟机启动时被标明为启动类的类
- JDK7 开始提供的动态语言支持：`java.lang.invoke.MethodHandle` 实例的解析结果，`REF_getStatic`、`REF_putStatic`、`REF_invokeStatic` 句柄对应的类没有初始化，则初始化

除以上五种情况，其他使用 Java 类的方式被看作是对**类的被动使用**，都不**会导致类的初始化**。

> JVM 规范枚举了下述多种触发情况：
>
> - 当虚拟机启动时，初始化用户指定的主类，就是启动执行的 main 方法所在的类；
> - 当遇到用以新建目标类实例的 new 指令时，初始化 new 指令的目标类，就是 new 一个类的时候要初始化；
> - 当遇到调用静态方法的指令时，初始化该静态方法所在的类；
> - 当遇到访问静态字段的指令时，初始化该静态字段所在的类；
> - 子类的初始化会触发父类的初始化；
> - 如果一个接口定义了 default 方法，那么直接实现或者间接实现该接口的类的初始化，会触发该接口的初始化；
> - 使用反射 API 对某个类进行反射调用时，初始化这个类，其实跟前面一样，反射调用要么是已经有实例了，要么是静态方法，都需要初始化；
> - 当初次调用 MethodHandle 实例时，初始化该 MethodHandle 指向的方法所在的类。
>
> 同时以下几种情况不会执行类初始化：
>
> - 通过子类引用父类的静态字段，只会触发父类的初始化，而不会触发子类的初始化。
> - 定义对象数组，不会触发该类的初始化。
> - 常量在编译期间会存入调用类的常量池中，本质上并没有直接引用定义常量的类，不会触发定义常量所在的类。
> - 通过类名获取 Class 对象，不会触发类的初始化，Hello.class 不会让 Hello 类初始化。
> - 通过 Class.forName 加载指定类时，如果指定参数 initialize 为 false 时，也不会触发类初始化，其实这个参数是告诉虚拟机，是否要对类进行初始化。Class.forName(“jvm.Hello”)默认会加载 Hello 类。
> - 通过 ClassLoader 默认的 loadClass 方法，也不会触发初始化动作（加载了，但是不初始化）。
>
> 示例: 诸如 Class.forName(), classLoader.loadClass() 等 Java API, 反射API, 以及 JNI_FindClass 都可以启动类加载。 JVM 本身也会进行类加载。 比如在 JVM 启动时加载核心类，java.lang.Object, java.lang.Thread 等等。

#### eg:

```java
public class NotInitialization {
    public static void main(String[] args) { 
        //只输出SupperClass int 123,不会输出SubClass init
        //对于静态字段，只有直接定义这个字段的类才会被初始化
        System.out.println(SubClass.value); 
    }
}

class SuperClass {
    static {
        System.out.println("SupperClass init");
    }
    public static int value = 123;
}

class SubClass extends SuperClass {
    static {
        System.out.println("SubClass init");
    }
}
```

------



## 类加载器

- JVM 支持两种类型的类加载器，分别为**引导类加载器**（Bootstrap ClassLoader）和**自定义类加载器**（User-Defined ClassLoader）

- 从概念上来讲，自定义类加载器一般指的是程序中由开发人员自定义的一类类加载器，但是 Java 虚拟机规范却没有这么定义，而是将所有派生于抽象类 ClassLoader 的类加载器都划分为自定义类加载器

系统自带的类加载器分为三种：

- 启动类加载器（BootstrapClassLoader）
- 扩展类加载器（ExtClassLoader）
- 应用类加载器（AppClassLoader）

一般启动类加载器是由 JVM 内部实现的，在 Java 的 API 里无法拿到，但是我们可以侧面看到和影响它。后 2 种类加载器在 Oracle Hotspot JVM 里，都是在中`sun.misc.Launcher`定义的，扩展类加载器和应用类加载器一般都继承自`URLClassLoader`类，这个类也默认实现了从各种不同来源加载 class 字节码转换成 Class 的方法。

![classloader](https://tva1.sinaimg.cn/large/e6c9d24ely1h35g2zl2pdj223y0u042i.jpg)

> 不同类加载器看似是继承(Inheritance)关系，实际是采用组合关系来复用父类加载器的相关代码



#### 启动类加载器（引导类加载器，Bootstrap ClassLoader）

- 这个类加载使用 C/C++ 语言实现，嵌套在 JVM 内部
- 它用来加载 Java 的核心库（`JAVA_HOME/jre/lib/rt.jar`、`resource.jar`或`sun.boot.class.path`路径下的内容），用于提供 JVM 自身需要的类
- 并不继承自 `java.lang.ClassLoader`，没有父加载器
- 加载扩展类和应用程序类加载器，并指定为他们的父类加载器
- 出于安全考虑，Bootstrap 启动类加载器只加载名为 java、Javax、sun 等开头的类

#### 扩展类加载器（Extension ClassLoader）

- Java 语言编写，由 `sun.misc.Launcher$ExtClassLoader` 实现
- 派生于 ClassLoader
- 父类加载器为启动类加载器
- 从 `java.ext.dirs` 系统属性所指定的目录中加载类库，或从 JDK 的安装目录的 `jre/lib/ext` 子目录（扩展目录）下加载类库。如果用户创建的 JAR 放在此目录下，也会自动由扩展类加载器加载

#### 应用程序类加载器（也叫系统类加载器，AppClassLoader）

- Java 语言编写，由 `sun.misc.Lanucher$AppClassLoader` 实现
- 派生于 ClassLoader
- 父类加载器为扩展类加载器
- 它负责加载环境变量 `classpath` 或系统属性 ` java.class.path` 指定路径下的类库
- 该类加载是**程序中默认的类加载器**，一般来说，Java 应用的类都是由它来完成加载的
- 通过 `ClassLoader#getSystemClassLoader()` 方法可以获取到该类加载器

```java
public class ClassLoaderTest {
    public static void main(String[] args) {
        //获取系统类加载器
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        System.out.println(systemClassLoader);  //sun.misc.Launcher$AppClassLoader@135fbaa4

        //获取其上层：扩展类加载器
        ClassLoader extClassLoader = systemClassLoader.getParent();
        System.out.println(extClassLoader);  //sun.misc.Launcher$ExtClassLoader@2503dbd3

        //再获取其上层：获取不到引导类加载器
        ClassLoader bootstrapClassLoader = extClassLoader.getParent();
        System.out.println(bootstrapClassLoader);     //null

        //对于用户自定义类来说，默认使用系统类加载器进行加载，输出和systemClassLoader一样
        ClassLoader classLoader = ClassLoaderTest.class.getClassLoader();
        System.out.println(classLoader);  //sun.misc.Launcher$AppClassLoader@135fbaa4

        //String 类使用引导类加载器进行加载。Java的核心类库都使用引导类加载器进行加载，所以也获取不到
        ClassLoader classLoader1 = String.class.getClassLoader();
        System.out.println(classLoader1);  //null

        //获取BootstrapClassLoader可以加载的api的路径
        URL[] urls = sun.misc.Launcher.getBootstrapClassPath().getURLs();
        for (URL url : urls) {
            System.out.println(url.toExternalForm());
        }
    }
}
```



#### 用户自定义类加载器

在 Java 的日常应用程序开发中，类的加载几乎是由 3 种类加载器相互配合执行的，在必要时，我们还可以自定义类加载器，来定制类的加载方式

> 如果用户自定义了类加载器，则自定义类加载器都以应用类加载器作为父加载器。应用类加载器的父类加载器为扩展类加载器。这些类加载器是有层次关系的，启动加载器又叫根加载器，是扩展加载器的父加载器，但是直接从 ExClassLoader 里拿不到它的引用，同样会返回 null。

##### 为什么要自定义类加载器？

- 隔离加载类
- 修改类加载的方式
- 扩展加载源（可以从数据库、云端等指定来源加载类）
- 防止源码泄露（Java 代码容易被反编译，如果加密后，自定义加载器加载类的时候就可以先解密，再加载）

##### 用户自定义加载器实现步骤

1. 开发人员可以通过继承抽象类 `java.lang.ClassLoader` 类的方式，实现自己的类加载器，以满足一些特殊的需求
2. 在 JDK1.2 之前，在自定义类加载器时，总会去继承 ClassLoader 类并重写 loadClass() 方法，从而实现自定义的类加载类，但是 JDK1.2 之后已经不建议用户去覆盖 `loadClass()` 方式，而是建议把自定义的类加载逻辑写在 `findClass()` 方法中
3. 编写自定义类加载器时，如果没有太过于复杂的需求，可以直接继承 URLClassLoader 类，这样就可以避免自己去编写 findClass() 方法及其获取字节码流的方式，使自定义类加载器编写更加简洁

**eg**:

> 比如我们试着实现一个可以用来处理简单加密的字节码的类加载器，用来保护我们的 class 字节码文件不被使用者直接拿来破解
>
> ```java
> public class Hello {
>     static {
>         System.out.println("Hello Class Initialized!");
>     }
> }
> ```
>
> 这个 Hello 类非常简单，就是在自己被初始化的时候，打印出来一句“Hello Class Initialized!”。假设这个类的内容非常重要，我们不想把编译到得到的 Hello.class 给别人，但是我们还是想别人可以调用或执行这个类，应该怎么办呢？一个简单的思路是，我们把这个类的 class 文件二进制作为字节流先加密一下，然后尝试通过自定义的类加载器来加载加密后的数据。为了演示简单，我们使用 jdk 自带的 Base64 算法，把字节码加密成一个文本。在下面这个例子里，我们实现一个 HelloClassLoader，它继承自 ClassLoader 类，但是我们希望它通过我们提供的一段 Base64 字符串，来还原出来，并执行我们的 Hello 类里的打印一串字符串的逻辑。
>
> ```java
> public class HelloClassLoader extends ClassLoader {
> 
>     public static void main(String[] args) {
>         try {
>             new HelloClassLoader().findClass("jvm.Hello").newInstance(); // 加载并初始化Hello类
>         } catch (ClassNotFoundException e) {
>             e.printStackTrace();
>         } catch (IllegalAccessException e) {
>             e.printStackTrace();
>         } catch (InstantiationException e) {
>             e.printStackTrace();
>         }
>     }
> 
>     @Override
>     protected Class<?> findClass(String name) throws ClassNotFoundException {
> 
>         String helloBase64 = "yv66vgAAADQAHwoABgARCQASABMIABQKABUAFgcAFwcAGAEABjxpbml0PgEAAygpVgEABENvZGUBAA9MaW5lTnVtYmVyVGFibGUBABJMb2NhbFZhcmlhYmxlVGFibGUBAAR0aGlzAQALTGp2bS9IZWxsbzsBAAg8Y2xpbml0PgEAClNvdXJjZUZpbGUBAApIZWxsby5qYXZhDAAHAAgHABkMABoAGwEAGEhlbGxvIENsYXNzIEluaXRpYWxpemVkIQcAHAwAHQAeAQAJanZtL0hlbGxvAQAQamF2YS9sYW5nL09iamVjdAEAEGphdmEvbGFuZy9TeXN0ZW0BAANvdXQBABVMamF2YS9pby9QcmludFN0cmVhbTsBABNqYXZhL2lvL1ByaW50U3RyZWFtAQAHcHJpbnRsbgEAFShMamF2YS9sYW5nL1N0cmluZzspVgAhAAUABgAAAAAAAgABAAcACAABAAkAAAAvAAEAAQAAAAUqtwABsQAAAAIACgAAAAYAAQAAAAMACwAAAAwAAQAAAAUADAANAAAACAAOAAgAAQAJAAAAJQACAAAAAAAJsgACEgO2AASxAAAAAQAKAAAACgACAAAABgAIAAcAAQAPAAAAAgAQ";
> 
>         byte[] bytes = decode(helloBase64);
>         return defineClass(name,bytes,0,bytes.length);
>     }
> 
>     public byte[] decode(String base64){
>         return Base64.getDecoder().decode(base64);
>     }
> }
> ```
>
> 直接执行这个类：
>
> ```shell
> $ java jvm.HelloClassLoader Hello Class Initialized!
> ```



### ClassLoader 常用方法

ClassLoader 类，是一个抽象类，其后所有的类加载器都继承自 ClassLoader（不包括启动类加载器）

| 方法                                                 | 描述                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| getParent()                                          | 返回该类加载器的超类加载器                                   |
| loadClass(String name)                               | 加载名称为name的类，返回java.lang.Class类的实例              |
| findClass(String name)                               | 查找名称为name的类，返回java.lang.Class类的实例              |
| findLoadedClass(String name)                         | 查找名称为name的已经被加载过的类，返回java.lang.Class类的实例 |
| defineClass(String name, byte[] b, int off, int len) | 把字节数组b中内容转换为一个Java类，返回java.lang.Class类的实例 |
| resolveClass(Class<?> c)                             | 连接指定的一个Java类                                         |

### 对类加载器的引用

JVM 必须知道一个类型是由启动加载器加载的还是由用户类加载器加载的。如果一个类型是由用户类加载器加载的，那么 JVM 会**将这个类加载器的一个引用作为类型信息的一部分保存在方法区中**。当解析一个类型到另一个类型的引用的时候，JVM 需要保证这两个类型的类加载器是相同的。

------



## 双亲委派机制

Java 虚拟机对 class 文件采用的是<mark>**按需加载**</mark>的方式，也就是说当需要使用该类的时候才会将它的 class 文件加载到内存生成 class 对象。而且加载某个类的 class 文件时，Java 虚拟机采用的是双亲委派模式，即把请求交给父类处理，它是一种任务委派模式。

### 工作过程

- 如果一个类加载器收到了类加载请求，它并不会自己先去加载，而是把这个请求委托给父类的加载器去执行；
- 如果父类加载器还存在其父类加载器，则进一步向上委托，依次递归，请求最终将到达顶层的启动类加载器；
- 如果父类加载器可以完成类加载任务，就成功返回，倘若父类加载器无法完成此加载任务，子加载器才会尝试自己去加载，这就是双亲委派模式

![](https://tva1.sinaimg.cn/large/0082zybply1gbo5vegwfuj30rs0lv45n.jpg)

### 优势

- <mark>避免类的重复加载</mark>，JVM 中区分不同类，不仅仅是根据类名，相同的 class 文件被不同的 ClassLoader 加载就属于两个不同的类（比如，Java中的Object类，无论哪一个类加载器要加载这个类，最终都是委派给处于模型最顶端的启动类加载器进行加载，如果不采用双亲委派模型，由各个类加载器自己去加载的话，系统中会存在多种不同的 Object 类）
- <mark>保护程序安全，防止核心 API 被随意篡改</mark>，避免用户自己编写的类动态替换 Java 的一些核心类，比如我们自定义类：`java.lang.String`

在 JVM 中表示两个 class 对象是否为同一个类存在两个必要条件：

- 类的完整类名必须一致，包括包名
- 加载这个类的 ClassLoader（指ClassLoader实例对象）必须相同



### 沙箱安全机制

如果我们自定义 String 类，但是在加载自定义 String 类的时候会率先使用引导类加载器加载，而引导类加载器在加载的过程中会先加载 jdk 自带的文件（rt.jar包中 `java\lang\String.class`），报错信息说没有 main 方法就是因为加载的是`rt.jar`包中的 String 类。这样就可以保证对 java 核心源代码的保护，这就是简单的沙箱安全机制。



### 破坏双亲委派模型

- 双亲委派模型并不是一个强制性的约束模型，而是 Java 设计者推荐给开发者的类加载器实现方式，可以“被破坏”，只要我们自定义类加载器，**重写 `loadClass()` 方法**，指定新的加载逻辑就破坏了，重写 `findClass()` 方法不会破坏双亲委派。

- 双亲委派模型有一个问题：顶层 ClassLoader，无法加载底层 ClassLoader 的类。典型例子 JNDI、JDBC，所以加入了线程上下文类加载器（Thread Context ClassLoader），可以通过 `Thread.setContextClassLoaser()`设置该类加载器，然后顶层 ClassLoader 再使用 `Thread.getContextClassLoader()` 获得底层的 ClassLoader 进行加载。

- Tomcat 中使用了自定 ClassLoader，并且也破坏了双亲委托机制。每个应用使用 WebAppClassloader 进行单独加载，他首先使用 WebAppClassloader 进行类加载，如果加载不了再委托父加载器去加载，这样可以保证每个应用中的类不冲突。每个 tomcat 中可以部署多个项目，每个项目中存在很多相同的 class 文件（很多相同的jar包），他们加载到 jvm 中可以做到互不干扰。

  ![](https://tva1.sinaimg.cn/large/e6c9d24ely1h35ghbt9uej20ib0g4abi.jpg)

- 利用破坏双亲委派来实现**代码热替换**（每次修改类文件，不需要重启服务）。因为一个 Class 只能被一个 ClassLoader 加载一次，否则会报 `java.lang.LinkageError`。当我们想要实现代码热部署时，可以每次都 new 一个自定义的 ClassLoader 来加载新的 Class文件。JSP 的实现动态修改就是使用此特性实现。



## 如何替换 JDK 的类

如何替换 JDK 中的类？比如，我们现在就拿 HashMap为例。

当 Java 的原生 API 不能满足需求时，比如我们要修改 HashMap 类，就必须要使用到 Java 的 endorsed 技术。我们需要将自己的 HashMap 类，打包成一个 jar 包，然后放到 -Djava.endorsed.dirs 指定的目录中。注意类名和包名，应该和 JDK 自带的是一样的。但是，java.lang 包下面的类除外，因为这些都是特殊保护的。

因为我们上面提到的双亲委派机制，是无法直接在应用中替换 JDK 的原生类的。但是，有时候又不得不进行一下增强、替换，比如你想要调试一段代码，或者比 Java 团队早发现了一个 Bug。所以，Java 提供了 endorsed 技术，用于替换这些类。这个目录下的 jar 包，会比 rt.jar 中的文件，优先级更高，可以被最先加载到。



### References

- http://blog.itpub.net/31561269/viewspace-2222522/
