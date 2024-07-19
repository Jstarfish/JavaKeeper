---
title: 手撕 JVM 面试 
date: 2024-05-31
tags: 
 - JVM
categories: JVM
---

![](https://img.starfish.ink/common/faq-banner.png)

请谈谈你对 OOM 的认识？

> GC 垃圾回收算法和垃圾收集器的关系？分别是什么请你谈谈？
>
> 怎么查看服务器默认的垃圾收集器是哪个？生产上如何配置垃圾收集器的？谈谈你对垃圾收集器的理解？
>
> G1 垃圾收集器？
>
> 生产环境服务器变慢，诊断思路和性能评估谈谈？
>
> 假如生产环境出现 CPU 占用过高，请谈谈你的分析思路和定位



## 一、类加载子系统

### 类加载机制？类加载过程

Java 语言是一种具有动态性的解释型语言，类(Class)只有被加载到 JVM 后才能运行。当运行指定程序时，JVM 会将编译生成的 .class 文件按照需求和一定的规则加载到内存中，并组织成为一个完整的 Java 应用程序。这个加载过程是由类加载器完成，具体来说，就是由 ClassLoader 和它的子类来实现的。类加载器本身也是一个类，其实质是把类文件从硬盘读取到内存中。

类的加载方式分为**隐式加载和显示加载**。隐式加载指的是程序在使用 new 等方式创建对象时，会隐式地调用类的加载器把对应的类 加载到 JVM 中。显示加载指的是通过直接调用 `class.forName()` 方法来把所需的类加载到 JVM 中。

任何一个工程项目都是由许多类组成的，当程序启动时，只把需要的类加载到 JVM 中，其他类只有被使用到的时候才会被加载，采用这种方法一方面可以加快加载速度，另一方面可以节约程序运行时对内存的开销。此外，在 Java 语言中，每个类或接口都对应一个 .class 文件，这些文件可以被看成是一个个可以被动态加载的单元，因此当只有部分类被修改时，只需要重新编译变化的类即可， 而不需要重新编译所有文件，因此加快了编译速度。

Java 虚拟机把描述类的数据从 Class 文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型，这就是虚拟机的加载机制。

类从被加载到虚拟机内存中开始，到卸载出内存为止，它的整个生命周期包括：**加载、验证、准备、解析、初始化、使用和卸载**七个阶段。(验证、准备和解析又统称为连接，为了支持Java语言的**运行时绑定**，所以**解析阶段也可以是在初始化之后进行的**。以上顺序都只是说开始的顺序，实际过程中是交叉的混合式进行的，加载过程中可能就已经开始验证了)

![jvm-class-load](/Users/starfish/oceanus/picBed/jvm/jvm-class-load.png)



### 什么是类加载器，类加载器有哪些？这些类加载器都加载哪些文件？

类加载器就是做上边提到的类加载过程的一个东西~

类加载器的任务是根据一个类的全限定名来读取此类的二进制字节流到 JVM 中，然后转换为一个与目标类对应的 java.lang.Class 对象实例

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

![img](https://miro.medium.com/v2/resize:fit:990/0*trTHtaDpG_aDf2CO.png)

##### 用户自定义类加载器

在 Java 的日常应用程序开发中，类的加载几乎是由 3 种类加载器相互配合执行的，在必要时，我们还可以自定义类加载器，来定制类的加载方式



### 为什么要自定义类加载器？

- 隔离加载类
- 修改类加载的方式
- 扩展加载源（可以从数据库、云端等指定来源加载类）
- 防止源码泄露（Java 代码容易被反编译，如果加密后，自定义加载器加载类的时候就可以先解密，再加载）



### 自定义了一个String，那么会加载哪个String？

如果你自定义了一个 `String` 类型的数据，那么系统会加载哪个 `String` 取决于几个因素：

1. **作用域（Scope）**：
   - 如果自定义的 `String` 位于局部作用域内（例如一个方法内部），那么这个局部变量将会被优先使用。
   - 如果自定义的 `String` 位于类的成员变量或者全局变量，那么在该类或全局范围内会优先使用这个自定义的 `String`。
2. **类加载顺序**：
   - 如果你在某个类中自定义了一个名为 `String` 的类型，这个自定义的类型会在该类的上下文中被优先加载。
   - 通常来说，标准库中的 `java.lang.String` 会在默认情况下被加载使用，但如果你定义了一个同名类且在当前作用域内，这个自定义的类会覆盖标准库中的类。
3. **包的使用**：
   - 如果你的自定义 `String` 类型在某个特定的包中，而标准库的 `java.lang.String` 是在 `java.lang` 包中，那么在不明确指定包名的情况下，当前作用域内的类型会优先被加载。
   - 可以通过完全限定名（Fully Qualified Name）来区分，例如使用 `java.lang.String` 来确保使用的是标准库中的 `String`。

以下是一个示例来说明作用域和类加载的情况：

```JAVA
package mypackage;

public class MyClass {
    // 自定义的String类
    public static class String {
        public void print() {
            System.out.println("This is my custom String class.");
        }
    }

    public static void main(String[] args) {
        // 使用自定义的String类
        String myString = new String();
        myString.print(); // 输出: This is my custom String class.

        // 使用标准库的String类
        java.lang.String standardString = new java.lang.String("Hello, World!");
        System.out.println(standardString); // 输出: Hello, World!
    }
}
```

在这个示例中：

- `mypackage.MyClass.String` 是自定义的 `String` 类，并在 `main` 方法中优先使用。
- `java.lang.String` 是标准库中的 `String` 类，通过完全限定名确保其正确加载。

综上所述，系统会加载哪个 `String`，取决于你的自定义 `String` 在代码中的定义位置和使用范围。如果你明确指定了完全限定名，那么系统会准确加载你指定的那个 `String` 类。

针对 java.*开头的类，jvm 的实现中已经保证了必须由 bootstrp 来加载



### 多线程的情况下，类的加载为什么不会出现重复加载的情况？

双亲委派



### 什么是双亲委派机制？它有啥优势？

![img](https://img.starfish.ink/jvm/classloader.png)

Java 虚拟机对 class 文件采用的是**按需加载**的方式，也就是说当需要使用该类的时候才会将它的 class 文件加载到内存生成 class 对象。而且加载某个类的 class 文件时，Java 虚拟机采用的是双亲委派模式，即把请求交给父类处理，它是一种任务委派模式。

简单说就是当类加载器（Class-Loader）试图加载某个类型的时候，除非父加载器找不到相应类型，否则尽量将这个任务代理给当前加载器的父加载器去做。使用委派模型的目的是避免重复加载 Java 类型。

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
- Tomcat 中使用了自定 ClassLoader，并且也破坏了双亲委托机制。每个应用使用 WebAppClassloader 进行单独加载，他首先使用 WebAppClassloader 进行类加载，如果加载不了再委托父加载器去加载，这样可以保证每个应用中的类不冲突。每个 tomcat 中可以部署多个项目，每个项目中存在很多相同的 class 文件（很多相同的jar包），他们加载到 jvm 中可以做到互不干扰。
- 利用破坏双亲委派来实现**代码热替换**（每次修改类文件，不需要重启服务）。因为一个 Class 只能被一个 ClassLoader 加载一次，否则会报 `java.lang.LinkageError`。当我们想要实现代码热部署时，可以每次都 new 一个自定义的 ClassLoader 来加载新的 Class文件。JSP 的实现动态修改就是使用此特性实现。



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





### 1.7和1.8中jvm内存结构的区别

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

我注意到有一些观点，认为通过[逃逸分析](https://en.wikipedia.org/wiki/Escape_analysis)，JVM 会在栈上分配那些不会逃逸的对象，这在理论上是可行的，但是取决于 JVM 设计者的选择。据我所知，Oracle Hotspot JVM 中并未这么做，这一点在逃逸分析相关的[文档](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/performance-enhancements-7.html#escapeAnalysis)里已经说明，所以可以明确所有的对象实例都是创建在堆上。

- 目前很多书籍还是基于 JDK 7 以前的版本，JDK 已经发生了很大变化，Intern 字符串的缓存和静态变量曾经都被分配在永久代上，而永久代已经被元数据区取代。但是，Intern 字符串缓存和静态变量并不是被转移到元数据区，而是直接在堆上分配，所以这一点同样符合前面一点的结论：对象实例都是分配在堆上。



### Java new 一个对象的过程发生了什么

java在new一个对象的时候，会先查看对象所属的类有没有被加载到内存，如果没有的话，就会先通过类的全限定名来加载。加载并初始化类完成后，再进行对象的创建工作。

我们先假设是第一次使用该类，这样的话new一个对象就可以分为两个过程：**加载并初始化类和创建对象**

加载过程就是 ClassLoader 那一套：加载-验证-准备-解析-初始化

> 首先，JVM 会检查该类是否已经加载、连接和初始化。如果类尚未加载，JVM 会通过类加载器加载类文件并执行以下步骤：
>
> - **加载（Loading）**：从类文件中读取字节码，将其加载到内存中。
>
> - 连接（Linking）
>
>   ：
>
>   - **验证（Verification）**：确保类的字节码符合 JVM 规范。
>   - **准备（Preparation）**：为类的静态变量分配内存并设置默认值。
>   - **解析（Resolution）**：将类的符号引用替换为直接引用。
>
> - **初始化（Initialization）**：执行类的静态初始化块和静态变量的初始化。

然后创建对象

1. 分配内存 

   一旦类被加载并初始化，JVM 会为新的对象分配内存。内存分配通常发生在堆上。内存分配的方式有以下两种主要方式：

   - **指针碰撞（Pointer Bumping）**：如果堆内存是规整的，没有碎片，JVM 会通过移动一个指针来分配内存。
   - **空闲列表（Free List）**：如果堆内存有碎片，JVM 会通过维护一个空闲列表来找到合适的内存块进行分配。

2. 初始化分配的内存【对所有实例变量赋默认值】

   分配内存后，JVM 会将该内存块清零（零值初始化），以确保对象的实例变量有默认值（如 `0`、`null` 等）。

3. 设置对象头

   JVM 会在分配的内存中设置对象头（Object Header），包括以下信息：

   - **Mark Word**：用于存储对象的哈希码、GC 分代年龄、锁状态标志等。
   - **Class Pointer**：指向对象的类元数据，表示该对象是哪个类的实例。

4. 执行构造方法

   初始化顺序是先初始化父类再初始化子类，初始化时先执行实例代码块然后是构造方法

   在内存分配和对象头设置完成后，JVM 会调用构造方法来初始化对象。构造方法的执行过程如下：

   - **显式调用父类构造方法**：如果没有显式调用，默认会调用父类的无参构造方法。
   - **按声明顺序初始化实例变量**：执行实例变量的初始化。
   - **执行构造方法体**：执行构造方法中的代码。

```java
public class MyClass {
    private int x = 10; // 实例变量初始化

    public MyClass() {
        x = 20; // 构造方法体
    }
}

public class Test {
    public static void main(String[] args) {
        MyClass obj = new MyClass(); // new 关键字创建对象
    }
}
```

在上述代码中，`new MyClass()` 过程包括：类加载检查、内存分配、内存初始化、对象头设置、实例变量初始化、调用构造方法。

5. 返回对象引用

   对象初始化完成后，`new` 关键字会返回对象的引用，并将其赋值给相应的变量。



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



### 内存泄漏时，如何定位问题代码

Java 的内存泄漏问题比较难以定位，下面针对一些常见的内存泄漏场景做介绍：

1. 持续在堆上创建对象而不释放。例如，持续不断的往一个列表中添加对象，而不对列表清空。这种问题，通常可以给程序运行时添加 JVM 参数`-Xmx` 指定一个较小的运行堆大小，这样可以比较容易的发现这类问题。
2. 不正确的使用静态对象。因为 static 关键字修饰的对象的生命周期与 Java 程序的运行周期是一致的，所以垃圾回收机制无法回收静态变量引用的对象。所以，发生内存泄漏问题时，我们要着重分析所有的静态变量。
3. 对大 String 对象调用 `String.intern()` 方法，该方法会从字符串常量池中查询当前字符串是否存在，若不存在就会将当前字符串放入常量池中。而在 jdk6 之前，字符串常量存储在 `PermGen` 区的，但是默认情况下 `PermGen` 区比较小，所以较大的字符串调用此方法，很容易会触发内存溢出问题。
4. 打开的输入流、连接没有正确关闭。由于这些资源需要对应的内存维护状态，因此不关闭会导致这些内存无法释放。

Java 的内存泄漏定位一般是比较困难的，需要使用到很多的实践经验和调试技巧。下面是一些比较通用的方法：

- 可以添加 `-verbose:gc` 启动参数来输出 GC 日志。通过分析这些日志，可以知道每次 GC 后内存是否有增加，如果在缓慢的增加，那就有可能是内存泄漏了（当然也需要结合当前的负载）。如果无法添加这个启动参数，也可以使用jstat来查看实时的gc日志。如果有条件运行的化可以考虑使用jvisualvm图形化的观察，不过要是线上的化一般没这个条件。
- 当通过dump出堆内存，然后使用jvisualvm查看分析，一般能够分析出内存中大量存在的对象以及它的类型等。我们可以通过添加-XX:+HeapDumpOnOutOfMemoryError启动参数来自动保存发生OOM时的内存dump。
- 当确定出大对象，或者大量存在的实例类型以后，我们就需要去review代码，从实际的代码入手来定位到真正发生泄漏的代码。



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

这里有一个相对特殊的部分，就是是堆外内存中的直接内存，前面的工具基本不适用，可以使用 JDK 自带的 Native Memory Tracking（NMT）特性，它会从 JVM 本地内存分配的角度进行解读。



### String 字符串存放位置？

在Java中，`String` 类型的特殊之处在于它可能会在两种位置存放：

1. **字符串常量池（String Pool）**：
   - 在Java中，所有的字符串常量（即直接通过双引号声明的字符串字面量）都会存放在字符串常量池中。字符串常量池是位于堆内存中的一块特殊的存储区域。
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

- 在Java 7及以后的版本中，字符串常量池被移动到了堆内存中，而不是方法区。这是为了提高JVM的性能和减少内存碎片。
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

------



## 三、GC

### 谈下 Java 的内存管理和垃圾回收

内存管理就是内存的生命周期管理，包括内存的申请、压缩、回收等操作。 Java 的内存管理就是 GC，JVM 的 GC 模块不仅管理内存的回收，也负责内存的分配和压缩整理。

Java 程序的指令都运行在 JVM 上，而且我们的程序代码并不需要去分配内存和释放内存（例如 C/C++ 里需要使用的 malloc/free），那么这些操作自然是由JVM帮我们搞定的。

JVM 在我们创建 Java 对象的时候去分配新内存，并使用 GC 算法，根据对象的存活时间，在对象不使用之后，自动执行对象的内存回收操作。



### 简述垃圾回收机制

程序在运行的时候，为了提高性能，大部分数据都是会加载到内存中进行运算的，有些数据是需要常驻内存中的，但是有些数据，用过之后便不会再需要了，我们称这部分数据为垃圾数据。

为了防止内存被使用完，我们需要将这些垃圾数据进行回收，即需要将这部分内存空间进行释放。不同于 C++ 需要自行释放内存的机制，Java 虚拟机（JVM）提供了一种自动回收内存的机制，它是低优先级的，在正常情况下是不会执行的，只有在虚拟机空闲或者当前堆内存不足时，才会触发执行，扫面那些没有被任何引用的对象， 并将它们添加到要回收的集合中，进行回收。



### JVM 垃圾回收的时候如何确定垃圾？ 

自动垃圾收集的前提是清楚哪些内存可以被释放，内存中不再使用的空间就是垃圾

对于对象实例收集，主要是两种基本算法

- 引用计数法：引用计数算法，顾名思义，就是为对象添加一个引用计数，用于记录对象被引用的情况，如果计数为 0，即表示对象可回收。有循环引用问题

  ![](https://dl-harmonyos.51cto.com/images/202212/6610b0168edd882e5ed921e4eef6daf9c5d378.png)

- 可达性分析：将对象及其引用关系看作一个图，选定活动的对象作为 GC Roots，然后跟踪引用链条，如果一个对象和 GC Roots 之间不可达，也就是不存在引用链条，那么即可认为是可回收对象

  ![](https://dl-harmonyos.51cto.com/images/202212/c89f360980bd1793f756862748b88614ca44a7.png)



### 引用计数法的缺点，除了循环引用，说一到两个?

1. 引用计数的增减开销在一些情况下会比较大，比如一些根引用的指针更新非常频繁，此时这种开销是不能忽视的（在每次赋值操作的时候都要做相当大的计算，尤其这里面还有递归调用）
2. 对象引用计数器本身是需要空间的，而计数器要占用多少位也是一个问题
3. 一个致命缺陷是循环引用，就是， objA引用了objB，objB也引用了objA，但是除此之外，再没有其他的地方引用这两个对象了，这两个对象的引用计数就都是1。这种情况下，这两个对象是不能被回收的。



### 你知道什么是 GC Roots 吗？GC Roots 如何确定，那些对象可以作为 GC Roots?

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

1. 第一次标记

​	对象在进行可达性分析后发现没有与 GC Roots 相连接的引用链，那它将会被第一次标记。

2. 第二次标记

   假如对象没有覆盖 finalize 方法，或者 finalize 方法已经被虚拟机调用过，那么不执行 finalize 方法。
   如果有必要执行 finalize 方法，那么该对象将会被放置在一个名为 F-Queue 的队列之中，并在稍后由一条由虚拟机自动建立的、低调度优先级的 Finalizer 线程去执行它们的 finalize 方法。

   finalize 方法是对象逃脱死亡命运的最后一次机会，稍后收集器将对 F-Queue 中的对象进行第二次小规模的标记，如果对象要在 finalize 中成功拯救自己，只要重新与引用链上的任何一个对象建立关联即可。
   如果对象这时候还没有逃脱，那基本上它就真的要被回收了。



### 说一说常用的 GC 算法及其优缺点

> 垃圾回收（Garbage Collection, GC）是自动内存管理的关键部分，用于回收不再使用的对象，防止内存泄漏。以下是一些常用的GC算法及其优缺点：
>
> 1. 标记-清除（Mark-Sweep）
>
> **优点**：
>
> - 简单易懂。
> - 不需要移动对象，保留了对象的原始引用。
>
> **缺点**：
>
> - 效率问题：标记和清除过程可能产生较长的停顿时间（Stop-the-World）。
> - 内存碎片：清除后内存中可能会有大量碎片，影响后续内存分配。
>
> 2. 标记-整理（Mark-Compact）
>
> **优点**：
>
> - 解决了内存碎片问题，通过整理阶段移动对象，减少内存碎片。
>
> **缺点**：
>
> - 效率问题：整理阶段可能需要移动对象，增加GC的开销。
> - 移动对象可能导致额外的开销，因为需要更新所有指向移动对象的引用。
>
> 3. 复制（Copying）
>
> **优点**：
>
> - 简单且高效，特别适合新生代GC。
> - 没有内存碎片问题，因为复制算法通过复制存活对象到另一个空间来避免碎片。
>
> **缺点**：
>
> - 空间利用率低：只使用堆的一半（或者根据算法不同，使用的比例不同）。
> - 复制过程可能产生短暂的停顿。
>
> 4. 分代收集（Generational Collection）
>
> **优点**：
>
> - 基于弱分代假设（大部分对象都是朝生夕死的），通过将对象分配到不同的代来优化GC性能。
> - 新生代使用复制算法，老年代使用标记-清除或标记-整理算法。
>
> **缺点**：
>
> - 对于长寿命的对象，如果频繁晋升到老年代，可能会增加老年代的GC压力。
> - 需要维护多个数据结构来区分不同代的对象。
>
> 5. 增量收集（Incremental Collection）
>
> **优点**：
>
> - 减少GC的停顿时间，通过增量地执行GC任务来实现。
>
> **缺点**：
>
> - 增加了GC的总体时间，因为GC任务被分成多个小部分执行。
> - 可能需要更复杂的逻辑来确保GC的正确性和完整性。
>
> 6. 并发标记-清除（Concurrent Mark-Sweep）
>
> **优点**：
>
> - 并发执行GC任务，减少GC对应用程序性能的影响。
>
> **缺点**：
>
> - 并发执行可能导致线程安全问题，需要额外的同步机制。
> - 并发GC可能会增加CPU资源的消耗。
>
> 7. G1收集器（Garbage-First）
>
> **优点**：
>
> - 专为大堆内存设计，通过将堆分割成多个区域并优先回收垃圾最多的区域来优化GC性能。
> - 支持并发和增量GC，减少停顿时间。
>
> **缺点**：
>
> - 相对于其他GC算法，G1的内存占用和CPU开销可能更大。
> - 需要更复杂的实现来跟踪各个区域的垃圾数量。
>
> 8. ZGC（Z Garbage Collector）
>
> **优点**：
>
> - 低延迟GC，适合需要极低停顿时间的应用程序。
> - 并发处理大部分GC任务，减少对应用程序性能的影响。
>
> **缺点**：
>
> - 相对于其他GC算法，ZGC的内存占用可能更高。
> - 需要特定的JVM支持（如OpenJDK的ZGC实现）。
>
> 每种GC算法都有其适用场景和限制。选择合适的GC算法取决于应用程序的具体需求，包括对延迟的敏感度、堆内存的大小、对象的生命周期特性等因素。现代JVM通常提供了多种GC算法，允许开发者根据需要选择或调整。



### JVM中一次完整的GC流程是怎样的，对象如何晋升到老年代

**思路：** 先描述一下Java堆内存划分，再解释Minor GC，Major GC，full GC，描述它们之间转化流程。

- Java堆 = 老年代 + 新生代
- 新生代 = Eden + S0 + S1
- 当 Eden 区的空间满了， Java虚拟机会触发一次 Minor GC，以收集新生代的垃圾，存活下来的对象，则会转移到 Survivor区。
- **大对象**（需要大量连续内存空间的Java对象，如那种很长的字符串）**直接进入老年态**；
- 如果对象在 Eden 出生，并经过第一次 Minor GC 后仍然存活，并且被 Survivor 容纳的话，年龄设为 1，每熬过一次 Minor GC，年龄+1，**若年龄超过一定限制（15），则被晋升到老年态**。即**长期存活的对象进入老年态**。
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

> 实际上，垃圾收集器（GC，Garbage Collector）是和具体 JVM 实现紧密相关的，不同厂商（IBM、Oracle），不同版本的 JVM，提供的选择也不同。

**思路：** 一定要记住典型的垃圾收集器，尤其 cms 和 G1，它们的原理与区别，涉及的垃圾回收算法。

#### a、几种垃圾收集器：

- **Serial收集器：** 单线程的收集器，收集垃圾时，必须 stop the world，使用复制算法。无需维护复杂的数据结构，初始化也简单，所以一直是 Client 模式下 JVM 的默认选项

- **ParNew收集器：**  一款多线程的收集器，采用复制算法，主要工作在 Young 区，可以通过 `-XX:ParallelGCThreads` 参数来控制收集的线程数，整个过程都是 STW 的，常与 CMS 组合使用

- **Parallel Scavenge收集器：** 新生代收集器，复制算法的收集器，并发的多线程收集器，目标是达到一个可控的吞吐量。如果虚拟机总共运行100分钟，其中垃圾花掉1分钟，吞吐量就是99%。

- **Serial Old收集器：** 是Serial收集器的老年代版本，单线程收集器，使用标记整理算法。

- **Parallel Old收集器：** 是Parallel Scavenge收集器的老年代版本，使用多线程，标记-整理算法。

- **CMS(Concurrent Mark Sweep) 收集器：** 是一种以获得最短回收停顿时间为目标的收集器，**标记清除算法，运作过程：初始标记，并发标记，重新标记，并发清除**，收集结束会产生大量空间碎片。其中初始标记和重新标记会 STW。另外，既然强调了并发（Concurrent），CMS 会占用更多 CPU 资源，并和用户线程争抢。多数应用于互联网站或者 B/S 系统的服务器端上，JDK9 被标记弃用，JDK14 被删除，详情可见 [JEP 363](https://openjdk.java.net/jeps/363)。

- **G1收集器：** 一种兼顾吞吐量和停顿时间的 GC 实现，是 Oracle JDK 9 以后的默认 GC 选项。

  G1 GC 仍然存在着年代的概念，但是其内存结构并不是简单的条带式划分，而是类似棋盘的一个个 region。Region 之间是复制算法，但整体上实际可看作是标记 - 整理（Mark-Compact）算法，可以有效地避免内存碎片，尤其是当 Java 堆非常大的时候，G1 的优势更加明显。

  标记整理算法实现，**运作流程主要包括以下：初始标记，并发标记，最终标记，筛选标记**。不会产生空间碎片，可以精确地控制停顿。



#### b、CMS 收集器和 G1 收集器的区别：

目前使用最多的是 CMS 和 G1 收集器，二者都有分代的概念，主要内存结构如下

![img](https://p1.meituan.net/travelcube/3a6dacdd87bfbec847d33d09dbe6226d199915.png)

- CMS 收集器是老年代的收集器，可以配合新生代的 Serial 和 ParNew 收集器一起使用；
- G1 收集器收集范围是老年代和新生代，不需要结合其他收集器使用；
- CMS 收集器以最小的停顿时间为目标的收集器；
- G1 GC 这是一种兼顾吞吐量和停顿时间的 GC 实现，是 Oracle JDK 9 以后的默认 GC 选项。
- G1 GC 仍然存在着年代的概念，但是其内存结构并不是简单的条带式划分，而是类似棋盘的一个个 region。Region 之间是复制算法，但整体上实际可看作是标记 - 整理（Mark-Compact）算法，可以有效地避免内存碎片，尤其是当 Java 堆非常大的时候，G1 的优势更加明显。G1 吞吐量和停顿表现都非常不错，并且仍然在不断地完善，与此同时 CMS 已经在 JDK 9 中被标记为废弃（deprecated），所以 G1 GC 值得你深入掌握。
- CMS 收集器是使用“标记-清除”算法进行的垃圾回收，容易产生内存碎片

> 如果你有关注目前尚处于开发中的 JDK 11，你会发现，JDK 又增加了两种全新的 GC 方式，分别是：
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

   此方法的调用是建议 JVM 进行 Full GC，虽然只是建议而非一定，但很多情况下它会触发 Full GC，从而增加Full GC 的频率，也即增加了间歇性停顿的次数。强烈影响系建议能不使用此方法就别使用，让虚拟机自己去管理它的内存，可通过通过 -XX:+ DisableExplicitGC 来禁止 RMI 调用 System.gc。

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
xxx      143       1 54 Jun07 ?        1-13:05:06 /opt/local/jdk/bin/java -Djava.util.logging.config.file=/opt/local/tomcat/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -server -Xmn1024m -Xms22938M -Xmx22938M -XX:PermSize=512m -XX:MaxPermSize=512m -XX:ParallelGCThreads=3 -XX:+UseConcMarkSweepGC -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=80 -XX:+CMSScavengeBeforeRemark -XX:SoftRefLRUPolicyMSPerMB=0 -XX:ParallelGCThreads=3 -Xss1m -XX:+PrintGCDateStamps -XX:+PrintGCDetails -Xloggc:/opt/logs/gc.log -verbose:gc -XX:+DisableExplicitGC -Dsun.rmi.transport.tcp.maxConnectionThreads=400 -XX:+ParallelRefProcEnabled -XX:+PrintTenuringDistribution -Dsun.rmi.transport.tcp.handshakeTimeout=2000 -Xdebug -Xrunjdwp:transport=dt_socket,address=22062,server=y,suspend=n -Dcom.sun.management.snmp.port=18328 -Dcom.sun.management.snmp.interface=0.0.0.0 -Dcom.sun.management.snmp.acl=false -javaagent:/opt/opbin/service_control/script/jmx_prometheus_javaagent-0.13.0.jar=9999:/opt/opbin/service_control/script/config.yaml -Djdk.tls.ephemeralDHKeySize=2048 -Djava.protocol.handler.pkgs=org.apache.catalina.webresources -Dignore.endorsed.dirs= -classpath /opt/local/tomcat/bin/bootstrap.jar:/opt/local/tomcat/bin/tomcat-juli.jar -Dcatalina.base=/opt/local/tomcat -Dcatalina.home=/opt/local/tomcat -Djava.io.tmpdir=/opt/local/tomcat/temp org.apache.catalina.startup.Bootstrap start start
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



> > https://learn.lianglianglee.com/%E4%B8%93%E6%A0%8F/JVM%20%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%2032%20%E8%AE%B2%EF%BC%88%E5%AE%8C%EF%BC%89/14%20%E5%B8%B8%E8%A7%81%E7%9A%84%20GC%20%E7%AE%97%E6%B3%95%EF%BC%88ParallelCMSG1%EF%BC%89.md
>
> 首先，先来整体了解一下 G1 GC 的内部结构和主要机制。
>
> 从内存区域的角度，G1 同样存在着年代的概念，但是与我前面介绍的内存结构很不一样，其内部是类似棋盘状的一个个 region 组成，请参考下面的示意图。
> ![img](data:image/png;base64,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)
>
> region 的大小是一致的，数值是在 1M 到 32M 字节之间的一个 2 的幂值数，JVM 会尽量划分 2048 个左右、同等大小的 region，这点可以从源码[heapRegionBounds.hpp](http://hg.openjdk.java.net/jdk/jdk/file/fa2f93f99dbc/src/hotspot/share/gc/g1/heapRegionBounds.hpp)中看到。当然这个数字既可以手动调整，G1 也会根据堆大小自动进行调整。
>
> 在 G1 实现中，年代是个逻辑概念，具体体现在，一部分 region 是作为 Eden，一部分作为 Survivor，除了意料之中的 Old region，G1 会将超过 region 50% 大小的对象（在应用中，通常是 byte 或 char 数组）归类为 Humongous 对象，并放置在相应的 region 中。逻辑上，Humongous region 算是老年代的一部分，因为复制这样的大对象是很昂贵的操作，并不适合新生代 GC 的复制算法。
>
> 你可以思考下 region 设计有什么副作用？
>
> 例如，region 大小和大对象很难保证一致，这会导致空间的浪费。不知道你有没有注意到，我的示意图中有的区域是 Humongous 颜色，但没有用名称标记，这是为了表示，特别大的对象是可能占用超过一个 region 的。并且，region 太小不合适，会令你在分配大对象时更难找到连续空间，这是一个长久存在的情况，请参考[OpenJDK 社区的讨论](http://mail.openjdk.java.net/pipermail/hotspot-gc-use/2017-November/002726.html)。这本质也可以看作是 JVM 的 bug，尽管解决办法也非常简单，直接设置较大的 region 大小，参数如下：
>
> ```
> -XX:G1HeapRegionSize=<N, 例如 16>M
> 复制代码
> ```
>
> 从 GC 算法的角度，G1 选择的是复合算法，可以简化理解为：
>
> - 在新生代，G1 采用的仍然是并行的复制算法，所以同样会发生 Stop-The-World 的暂停。
> - 在老年代，大部分情况下都是并发标记，而整理（Compact）则是和新生代 GC 时捎带进行，并且不是整体性的整理，而是增量进行的。
>
> 我在[上一讲](http://time.geekbang.org/column/article/10513)曾经介绍过，习惯上人们喜欢把新生代 GC（Young GC）叫作 Minor GC，老年代 GC 叫作 Major GC，区别于整体性的 Full GC。但是现代 GC 中，这种概念已经不再准确，对于 G1 来说：
>
> - Minor GC 仍然存在，虽然具体过程会有区别，会涉及 Remembered Set 等相关处理。
> - 老年代回收，则是依靠 Mixed GC。并发标记结束后，JVM 就有足够的信息进行垃圾收集，Mixed GC 不仅同时会清理 Eden、Survivor 区域，而且还会清理部分 Old 区域。可以通过设置下面的参数，指定触发阈值，并且设定最多被包含在一次 Mixed GC 中的 region 比例。
>
> ```
> –XX:G1MixedGCLiveThresholdPercent
> –XX:G1OldCSetRegionThresholdPercent
> ```
>
> 从 G1 内部运行的角度，下面的示意图描述了 G1 正常运行时的状态流转变化，当然，在发生逃逸失败等情况下，就会触发 Full GC。
> ![img](data:image/png;base64,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)
>
> G1 相关概念非常多，有一个重点就是 Remembered Set，用于记录和维护 region 之间对象的引用关系。为什么需要这么做呢？试想，新生代 GC 是复制算法，也就是说，类似对象从 Eden 或者 Survivor 到 to 区域的“移动”，其实是“复制”，本质上是一个新的对象。在这个过程中，需要必须保证老年代到新生代的跨区引用仍然有效。下面的示意图说明了相关设计。
> ![img](data:image/png;base64,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BcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHFAQCMlWGJzCQkEgJFthG+wPBcEBBYGQbIXBKSwUBEKyFbbB/lAQHOh/VEJItoJw6O/DNokghJRm2Ab7Q0EAAEQhv7gRQrIR+EFBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkENBAAAAAJBDQQAAAACQQ0EAAAAAkBL5/wFtF3cnBSEEfQAAAABJRU5ErkJggg==)
>
> G1 的很多开销都是源自 Remembered Set，例如，它通常约占用 Heap 大小的 20% 或更高，这可是非常可观的比例。并且，我们进行对象复制的时候，因为需要扫描和更改 Card Table 的信息，这个速度影响了复制的速度，进而影响暂停时间。
>
> 描述 G1 内部的资料很多，我就不重复了，如果你想了解更多内部结构和算法等，我建议参考一些具体的[介绍](https://www.infoq.com/articles/G1-One-Garbage-Collector-To-Rule-Them-All)，书籍方面我推荐 Charlie Hunt 等撰写的《Java Performance Companion》。
>
> 接下来，我介绍下大家可能还不了解的 G1 行为变化，它们在一定程度上解决了专栏其他讲中提到的部分困扰，如类型卸载不及时的问题。
>
> - 上面提到了 Humongous 对象的分配和回收，这是很多内存问题的来源，Humongous region 作为老年代的一部分，通常认为它会在并发标记结束后才进行回收，但是在新版 G1 中，Humongous 对象回收采取了更加激进的策略。
>   我们知道 G1 记录了老年代 region 间对象引用，Humongous 对象数量有限，所以能够快速的知道是否有老年代对象引用它。如果没有，能够阻止它被回收的唯一可能，就是新生代是否有对象引用了它，但这个信息是可以在 Young GC 时就知道的，所以完全可以在 Young GC 中就进行 Humongous 对象的回收，不用像其他老年代对象那样，等待并发标记结束。
> - 我在[专栏第 5 讲](http://time.geekbang.org/column/article/7349)，提到了在 8u20 以后字符串排重的特性，在垃圾收集过程中，G1 会把新创建的字符串对象放入队列中，然后在 Young GC 之后，并发地（不会 STW）将内部数据（char 数组，JDK 9 以后是 byte 数组）一致的字符串进行排重，也就是将其引用同一个数组。你可以使用下面参数激活：
>
> ```
> -XX:+UseStringDeduplication
> 复制代码
> ```
>
> 注意，这种排重虽然可以节省不少内存空间，但这种并发操作会占用一些 CPU 资源，也会导致 Young GC 稍微变慢。
>
> - 类型卸载是个长期困扰一些 Java 应用的问题，在[专栏第 25 讲](http://time.geekbang.org/column/article/10192)中，我介绍了一个类只有当加载它的自定义类加载器被回收后，才能被卸载。元数据区替换了永久代之后有所改善，但还是可能出现问题。
>
> G1 的类型卸载有什么改进吗？很多资料中都谈到，G1 只有在发生 Full GC 时才进行类型卸载，但这显然不是我们想要的。你可以加上下面的参数查看类型卸载：
>
> ```
> -XX:+TraceClassUnloading
> 复制代码
> ```
>
> 幸好现代的 G1 已经不是如此了，8u40 以后，G1 增加并默认开启下面的选项：
>
> ```
> -XX:+ClassUnloadingWithConcurrentMark
> 复制代码
> ```
>
> 也就是说，在并发标记阶段结束后，JVM 即进行类型卸载。
>
> - 我们知道老年代对象回收，基本要等待并发标记结束。这意味着，如果并发标记结束不及时，导致堆已满，但老年代空间还没完成回收，就会触发 Full GC，所以触发并发标记的时机很重要。早期的 G1 调优中，通常会设置下面参数，但是很难给出一个普适的数值，往往要根据实际运行结果调整
>
> ```
> -XX:InitiatingHeapOccupancyPercent
> 复制代码
> ```
>
> 在 JDK 9 之后的 G1 实现中，这种调整需求会少很多，因为 JVM 只会将该参数作为初始值，会在运行时进行采样，获取统计数据，然后据此动态调整并发标记启动时机。对应的 JVM 参数如下，默认已经开启：
>
> ```
> -XX:+G1UseAdaptiveIHOP
> 复制代码
> ```
>
> - 在现有的资料中，大多指出 G1 的 Full GC 是最差劲的单线程串行 GC。其实，如果采用的是最新的 JDK，你会发现 Full GC 也是并行进行的了，在通用场景中的表现还优于 Parallel GC 的 Full GC 实现。
>
> 当然，还有很多其他的改变，比如更快的 Card Table 扫描等，这里不再展开介绍，因为它们并不带来行为的变化，基本不影响调优选择。
>
> 前面介绍了 G1 的内部机制，并且穿插了部分调优建议，下面从整体上给出一些调优的建议。
>
> 首先，**建议尽量升级到较新的 JDK 版本**，从上面介绍的改进就可以看到，很多人们常常讨论的问题，其实升级 JDK 就可以解决了。
>
> 第二，掌握 GC 调优信息收集途径。掌握尽量全面、详细、准确的信息，是各种调优的基础，不仅仅是 GC 调优。我们来看看打开 GC 日志，这似乎是很简单的事情，可是你确定真的掌握了吗？
>
> 除了常用的两个选项，
>
> ```
> -XX:+PrintGCDetails
> -XX:+PrintGCDateStamps
> ```
>
> 还有一些非常有用的日志选项，很多特定问题的诊断都是要依赖这些选项：
>
> ```
> -XX:+PrintAdaptiveSizePolicy // 打印 G1 Ergonomics 相关信息
> 复制代码
> ```
>
> 我们知道 GC 内部一些行为是适应性的触发的，利用 PrintAdaptiveSizePolicy，我们就可以知道为什么 JVM 做出了一些可能我们不希望发生的动作。例如，G1 调优的一个基本建议就是避免进行大量的 Humongous 对象分配，如果 Ergonomics 信息说明发生了这一点，那么就可以考虑要么增大堆的大小，要么直接将 region 大小提高。
>
> 如果是怀疑出现引用清理不及时的情况，则可以打开下面选项，掌握到底是哪里出现了堆积。
>
> ```
> -XX:+PrintReferenceGC
> 复制代码
> ```
>
> 另外，建议开启选项下面的选项进行并行引用处理。
>
> ```
> -XX:+ParallelRefProcEnabled
> 复制代码
> ```
>
> 需要注意的一点是，JDK 9 中 JVM 和 GC 日志机构进行了重构，其实我前面提到的**PrintGCDetails 已经被标记为废弃**，而**PrintGCDateStamps 已经被移除**，指定它会导致 JVM 无法启动。可以使用下面的命令查询新的配置参数。
>
> ```
> java -Xlog:help
> 复制代码
> ```
>
> 最后，来看一些通用实践，理解了我前面介绍的内部结构和机制，很多结论就一目了然了，例如：
>
> - 如果发现 Young GC 非常耗时，这很可能就是因为新生代太大了，我们可以考虑减小新生代的最小比例。
>
> ```
> -XX:G1NewSizePercent
> 复制代码
> ```
>
> 降低其最大值同样对降低 Young GC 延迟有帮助。
>
> ```
> -XX:G1MaxNewSizePercent
> 复制代码
> ```
>
> 如果我们直接为 G1 设置较小的延迟目标值，也会起到减小新生代的效果，虽然会影响吞吐量。
>
> - 如果是 Mixed GC 延迟较长，我们应该怎么做呢？
>
> 还记得前面说的，部分 Old region 会被包含进 Mixed GC，减少一次处理的 region 个数，就是个直接的选择之一。
> 我在上面已经介绍了 G1OldCSetRegionThresholdPercent 控制其最大值，还可以利用下面参数提高 Mixed GC 的个数，当前默认值是 8，Mixed GC 数量增多，意味着每次被包含的 region 减少。
>
> ```
> -XX:G1MixedGCCountTarget
> 复制代码
> ```
>
> 今天的内容算是抛砖引玉，更多内容你可以参考[G1 调优指南](https://docs.oracle.com/javase/9/gctuning/garbage-first-garbage-collector-tuning.htm#JSGCT-GUID-4914A8D4-DE41-4250-B68E-816B58D4E278)等，远不是几句话可以囊括的。需要注意的是，也要避免过度调优，G1 对大堆非常友好，其运行机制也需要浪费一定的空间，有时候稍微多给堆一些空间，比进行苛刻的调优更加实用。
>
> 今天我梳理了基本的 GC 调优思路，并对 G1 内部结构以及最新的行为变化进行了详解。总的来说，G1 的调优相对简单、直观，因为可以直接设定暂停时间等目标，并且其内部引入了各种智能的自适应机制，希望这一切的努力，能够让你在日常应用开发时更加高效。



## 四、监控和调优

### 说说你知道的几种主要的 JVM 参数

**思路：** 可以说一下堆栈配置相关的，垃圾收集器相关的，还有一下辅助信息相关的。

**我的答案：**

#### 1）堆栈配置相关

```
java -Xmx3550m -Xms3550m -Xmn2g -Xss128k 
-XX:MaxPermSize=16m -XX:NewRatio=4 -XX:SurvivorRatio=4 -XX:MaxTenuringThreshold=0
复制代码
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
复制代码
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



### 你说你做过  JVM 调优和参数配置，请问如何盘点查看 JVM 系统默认值

#### JVM参数类型

- 标配参数

  - -version   (java -version) 
  - -help       (java -help)
  - java -showversion

- X 参数（了解）

  - -Xint 解释执行

  - -Xcomp 第一次使用就编译成本地代码

  - -Xmixed 混合模式

- xx参数

  - Boolean 类型

    - 公式： -xx:+ 或者 - 某个属性值（+表示开启，- 表示关闭）

    - Case

      - 是否打印GC收集细节

        - -XX:+PrintGCDetails 
        - -XX:- PrintGCDetails 

        添加如下参数后，重新查看，发现是 + 号了

        ![](https://tva1.sinaimg.cn/large/00831rSTly1gdebrx25moj31170u042c.jpg)

      - 是否使用串行垃圾回收器

        - -XX:-UseSerialGC
      - -XX:+UseSerialGC
    
  - KV 设值类型

    - 公式 -XX:属性key=属性 value

    - Case:

      - -XX:MetaspaceSize=128m

      - -xx:MaxTenuringThreshold=15

      - 我们常见的 -Xms和 -Xmx 也属于 KV 设值类型

        - -Xms 等价于 -XX:InitialHeapSize
        - -Xmx 等价于 -XX:MaxHeapSize
  
        ![](https://tva1.sinaimg.cn/large/00831rSTly1gdecj9d7z3j310202qdgb.jpg)

  - jinfo 举例，如何查看当前运行程序的配置

    - jps -l
    - jinfo -flag [配置项] 进程编号
    - jinfo **-flags** 1981(打印所有)
    - jinfo -flag PrintGCDetails 1981
    - jinfo -flag MetaspaceSize 2044

这些都是命令级别的查看，我们如何在程序运行中查看

```java
    long totalMemory = Runtime.getRuntime().totalMemory();
    long maxMemory = Runtime.getRuntime().maxMemory();

    System.out.println("total_memory(-xms)="+totalMemory+"字节，" +(totalMemory/(double)1024/1024)+"MB");
    System.out.println("max_memory(-xmx)="+maxMemory+"字节，" +(maxMemory/(double)1024/1024)+"MB");

}
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
  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehf1e54soj31e006qjz6.jpg)



参数不懂，推荐直接去看官网，

https://docs.oracle.com/javacomponents/jrockit-hotspot/migration-guide/cloptions.htm#JRHMG127

https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html#BGBCIEFC

https://docs.oracle.com/javase/8/

Java SE Tools Reference for UNIX](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/index.html)



### 能写几个 OOM 代码不

- java.lang.StackOverflowError

  - ```java
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

- java.lang.OutOfMemoryError: GC overhead limit exceeded  (GC上头，哈哈)

  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehmrz0dvaj311w0muk0e.jpg)

- java.lang.OutOfMemoryError: Direct buffer memory

  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehn18eix6j31a00m2wup.jpg)
  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehn52fphnj31as0lidyh.jpg)

- java.lang.OutOfMemoryError: unable to create new native thread

  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehn7osaz1j31940kc4c8.jpg)

- java.lang.OutOfMemoryError：Metaspace

  - http://openjdk.java.net/jeps/122
  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehnc3d4g3j319e0msguj.jpg)
  - ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehndijxo8j31920madt6.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehmmia4gaj30xw0gudid.jpg)



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



### 怎么打出线程栈信息。

**思路：** 可以说一下jps，top ，jstack这几个命令，再配合一次排查线上问题进行解答。

**我的答案：**

- 输入jps，获得进程号。
- top -Hp pid 获取本进程中所有线程的CPU耗时性能
- jstack pid命令查看当前java进程的堆栈状态
- 或者 jstack -l  > /tmp/output.txt 把堆栈信息打到一个txt文件。
- 可以使用 fastthread 堆栈定位，[fastthread.io/](http://fastthread.io/)





![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehofhsuglj31a20ka116.jpg)



![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehohen24lj31f20n2du8.jpg)



![](https://tva1.sinaimg.cn/large/007S8ZIlly1geholtp9p9j31bu0i8dsm.jpg)



![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehop8c2u8j30uu0kgk46.jpg)





![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehptemx4oj31520js47e.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gehps6jzcsj31go0mok5q.jpg)







### 7.怎么查看服务器默认的垃圾收集器是哪个？生产上如何配置垃圾收集器？谈谈你对垃圾收集器的理解？





### 9.生产环境服务器变慢，诊断思路和性能评估谈谈？

### 10.假设生产环境出现 CPU占用过高，请谈谈你的分析思路和定位



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







