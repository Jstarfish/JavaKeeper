> 对象在 JVM 中是怎么存储的
>
> 对象头里有什么？
>
> 文章收录在 GitHub [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱，有你想要的。

作为一名 Javaer，生活中的我们可能暂时没有对象，但是工作中每天都会创建大量的 Java 对象，你有试着去了解下自己的“对象”吗？

我们从四个方面重新认识下自己的“对象”

1. 创建对象的 6 种方式
2. 创建一个对象在 JVM 中都发生了什么
3. 对象在 JVM 中的内存布局
4. 对象的访问定位



## 一、创建对象的方式

- 使用 new 关键字

  这是创建一个对象最通用、常规的方法，同时也是最简单的方式。通过使用此方法，我们可以调用任何要调用的构造函数（默认使用无参构造函数）

  ```java
  Person p = new Person();
  ```

- 使用 Class 类的 newInstance()，只能调用空参的构造器，权限必须为 public

  ```java
  //获取类对象
  Class aClass = Class.forName("priv.starfish.Person");
  Person p1 = (Person) aClass.newInstance();
  ```

- Constructor 的 newInstance(xxx)，对构造器没有要求

  ```java
  Class aClass = Class.forName("priv.starfish.Person");
  //获取构造器
  Constructor constructor = aClass.getConstructor();
  Person p2 = (Person) constructor.newInstance();
  ```

- clone()

  深拷贝，需要实现 Cloneable 接口并实现 clone()，不调用任何的构造器

  ```java
  Person p3 = (Person) p.clone();
  ```

- 反序列化

  通过序列化和反序列化技术从文件或者网络中获取对象的二进制流。

  每当我们序列化和反序列化对象时，JVM 会为我们创建了一个独立的对象。在 deserialization 中，JVM 不使用任何构造函数来创建对象。（序列化的对象需要实现 Serializable）

  ```java
  //准备一个文件用于存储该对象的信息
  File f = new File("person.obj");
  FileOutputStream fos = new FileOutputStream(f);
  ObjectOutputStream oos = new ObjectOutputStream(fos);
  //序列化对象，写入到磁盘中
  oos.writeObject(p);
  //反序列化
  FileInputStream fis = new FileInputStream(f);
  ObjectInputStream ois = new ObjectInputStream(fis);
  //反序列化对象
  Person p4 = (Person) ois.readObject();
  ```

- 第三方库 Objenesls

  Java已经支持通过 `Class.newInstance()` 动态实例化 Java 类，但是这需要Java类有个适当的构造器。很多时候一个Java类无法通过这种途径创建，例如：构造器需要参数、构造器有副作用、构造器会抛出异常。Objenesis 可以绕过上述限制



## 二、创建对象的步骤

这里讨论的仅仅是普通 Java 对象，不包含数组和 Class 对象（普通对象和数组对象的创建指令是不同的。创建类实例的指令：new，创建数组的指令：newarray，anewarray，multianewarray）

#### 1. new指令

虚拟机遇到一条 new 指令时，首先去检查这个指令的参数是否能在 Metaspace 的常量池中定位到一个类的符号引用，并且检查这个符号引用代表的类是否已被加载、解析和初始化过（即判断类元信息是否存在）。如果没有，那么须在双亲委派模式下，先执行相应的类加载过程。

#### 2. 分配内存

接下来虚拟机将为新生代对象分配内存。对象所需的内存的大小在类加载完成后便可完全确定。如果实例成员变量是引用变量，仅分配引用变量空间即可，即 4 个字节大小。分配方式有“**指针碰撞**（Bump the Pointer）”和“**空闲列表**（Free List）”两种方式，具体由所采用的垃圾收集器是否带有压缩整理功能决定。

- 如果内存是规整的，就采用“指针碰撞”来为对象分配内存。意思是所有用过的内存在一边，空闲的内存在另一边，中间放着一个指针作为分界点的指示器，分配内存就仅仅是把指针指向空闲那边挪动一段与对象大小相等的距离罢了。如果垃圾收集器采用的是 Serial、ParNew 这种基于压缩算法的，就采用这种方法。（一般使用带整理功能的垃圾收集器，都采用指针碰撞）

  ![](https://img-blog.csdnimg.cn/2020060220241513.png)

- 如果内存是不规整的，虚拟机需要维护一个列表，这个列表会记录哪些内存是可用的，在为对象分配内存的时候从列表中找到一块足够大的空间划分给该对象实例，并更新列表内容，这种分配方式就是“空闲列表”。使用CMS 这种基于Mark-Sweep 算法的收集器时，通常采用空闲列表。

  ![](https://img-blog.csdnimg.cn/20200602202424136.png)

> 我们都知道堆内存是线程共享的，那在分配内存的时候就会存在并发安全问题，JVM 是如何解决的呢？

一般有两种解决方案：

1. 对分配内存空间的动作做同步处理，采用 CAS 机制，配合失败重试的方式保证更新操作的原子性

2. 每个线程在 Java 堆中预先分配一小块内存，然后再给对象分配内存的时候，直接在自己这块"私有"内存中分配，当这部分区域用完之后，再分配新的"私有"内存。这种方案称为 **TLAB**（Thread Local Allocation Buffer），这部分 Buffer 是从堆中划分出来的，但是是本地线程独享的。

   **这里值得注意的是，我们说 TLAB 是线程独享的，只是在“分配”这个动作上是线程独占的，至于在读取、垃圾回收等动作上都是线程共享的。而且在使用上也没有什么区别。**另外，TLAB 仅作用于新生代的 Eden Space，对象被创建的时候首先放到这个区域，但是新生代分配不了内存的大对象会直接进入老年代。**因此在编写 Java 程序时，通常多个小的对象比大的对象分配起来更加高效。**

   虚拟机是否使用 TLAB 是可以选择的，可以通过设置 `-XX:+/-UseTLAB` 参数来指定，JDK8 默认开启。

#### 3. 初始化

内存分配完成后，虚拟机需要将分配到的内存空间都初始化为零值（不包括对象头），这一步操作保证了对象的实例字段在 Java 代码中可以不赋初始值就直接使用，程序能访问到这些字段的数据类型所对应的零值。如：byte、short、long 转化为对象后初始值为 0，Boolean 初始值为 false。

#### 4. 对象的初始设置（设置对象的对象头）

接下来虚拟机要对对象进行必要的设置，例如这个对象是哪个类的实例、如何才能找到类的元数据信息、对象的哈希码、对象的GC分代年龄等信息。这些信息存放在对象的对象头（Object Header）之中。根据虚拟机当前的运行状态的不同，如对否启用偏向锁等，对象头会有不同的设置方式。

#### 5. \<init>方法初始化

在上面的工作都完成了之后，从虚拟机的角度看，一个新的对象已经产生了，但是从 Java 程序的角度看，对象创建才刚刚开始，\<init>方法还没有执行，所有的字段都还为零。初始化成员变量，执行实例化代码块，调用类的构造方法，并把堆内对象的地址赋值给引用变量。

所以，一般来说，执行 new 指令后接着执行 init 方法，把对象按照程序员的意愿进行初始化（应该是将构造函数中的参数赋值给对象的字段），这样一个真正可用的对象才算完全产生出来。



## 三、对象的内存布局

在 HotSpot 虚拟机中，对象在内存中存储的布局可以分为 3 块区域：对象头（Header）、实例数据（Instance Data）、对其填充（Padding）。

### 对象头

HotSpot 虚拟机的对象头包含两部分信息。

- 第一部分用于存储对象自身的运行时数据，如哈希码(HashCode)、GC分代年龄、锁状态标志、线程持有的锁、偏向线程ID、偏向时间戳等。
- 对象的另一部分类型指针，即对象指向它的类元数据的指针，虚拟机通过这个指针来确定这个对象是哪个类的实例（并不是所有的虚拟机实现都必须在对象数据上保留类型指针，也就是说，查找对象的元数据信息并不一定要经过对象本身）。

如果对象是一个 Java 数组，那在对象头中还必须有一块用于记录数组长度的数据。

> 元数据：描述数据的数据。对数据及信息资源的描述信息。在 Java 中，元数据大多表示为注解。

### 实例数据

实例数据部分是对象真正存储的有效信息，也是在程序代码中定义的各种类型的字段内容，无论从父类继承下来的，还是在子类中定义的，都需要记录起来。这部分的存储顺序会受虚拟机默认的分配策略参数和字段在 Java 源码中定义的顺序影响（相同宽度的字段总是被分配到一起）。

规则：

- 相同宽度的字段总是被分配在一起
- 父类中定义的变量会出现在子类之前
- 如果 CompactFields 参数为 true(默认true)，子类的窄变量可能插入到父类变量的空隙

### 对齐填充

对齐填充部分并不是必然存在的，也没有特别的含义，它仅仅起着占位符的作用。由于 HotSpot VM 的自动内存管理系统要求对象的起始地址必须是 8 字节的整数倍，也就是说，对象的大小必须是 8 字节的整数倍。而对象头部分正好是 8 字节的倍数（1倍或者2倍），因此，当对象实例数据部分没有对齐时，就需要通过对齐填充来补全。

我们通过一个简单的例子加深下理解

```java
public class PersonObject {
    public static void main(String[] args) {
        Person person = new Person();
    }
}
```

```java
public class Person {
    int id = 1008;
    String name;
    Department department;
    {
        name = "匿名用户";   //name赋值为字符串常量
    }
}
```

```java
public class Department {
    int id;
    String name;
}
```

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ggoj68y1auj31d20u0e6e.jpg)





## 四、对象的访问定位

我们创建对象的目的，肯定是为了使用它，那 JVM 是如何通过栈帧中的对象引用访问到其内存的对象实例呢？

由于 reference 类型在 Java 虚拟机规范里只规定了一个指向对象的引用，并没有定义这个引用应该通过哪种方式去定位，以及访问到 Java 堆中的对象的具体位置，因此不同虚拟机实现的对象访问方式会有所不同，主流的访问方式有两种：

- 句柄访问

  如果使用句柄访问方式，Java堆中会划分出一块内存来作为句柄池，reference中存储的就是对象的句柄地址，而句柄中包含了对象实例数据和类型数据各自的具体地址信息。使用句柄方式最大的好处就是reference中存储的是稳定的句柄地址，在对象被移动（垃圾收集时移动对象是非常普遍的行为）时只会改变句柄中的实例数据指针，而reference本身不需要被修改。

  ![](https://tva1.sinaimg.cn/large/007S8ZIlly1ggojeoey4yj30oz0hadgu.jpg)

- 直接指针（Hotspot 使用该方式）

  如果使用该方式，Java堆对象的布局就必须考虑如何放置访问类型数据的相关信息，reference中直接存储的就是对象地址。使用直接指针方式最大的好处就是**速度更快**，他**节省了一次指针定位的时间开销**。

  ![](https://tva1.sinaimg.cn/large/007S8ZIlly1ggojeyqqagj30p10hit9l.jpg)





**参考**:

- https://zhuanlan.zhihu.com/p/44948944
- https://blog.csdn.net/boy1397081650/article/details/89930710
- https://www.cnblogs.com/lusaisai/p/12748869.html
- https://juejin.im/post/5d4250def265da03ab422c79



![](https://imgkr.cn-bj.ufileos.com/f8c5cc56-4e87-4821-84ab-32b105819091.png)