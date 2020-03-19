# 工厂模式——我有不止一个对象

> 3年工作经验是吧？
>
> 你知道工厂模式分为几类吗？他们都有什么区别？
>
> 那你说说你们项目中是怎么使用工厂模式的？

> 带着问题，尤其是面试问题的学习才是最高效的。加油，奥利给！  
>
> 文章收录在 GitHub [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱 

## 工厂模式

工厂模式（Factory Pattern）是 Java 中最常用的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

在工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用一个共同的接口来指向新创建的对象。

<img src="https://tva1.sinaimg.cn/large/00831rSTly1gcmy3e9tbzg30p00ge16a.gif" style="zoom:33%;" />



### 工厂模式可以分为三类：

- 简单工厂模式（Simple Factory）
- 工厂方法模式（Factory Method）
- 抽象工厂模式（Abstract Factory）

简单工厂其实不是一个标准的的设计模式。GOF 23种设计模式中只有「工厂方法模式」与「抽象工厂模式」。简单工厂模式可以看为工厂方法模式的一种特例，为了统一整理学习，就都归为工厂模式。

这三种工厂模式在设计模式的分类中都属于**创建型模式**，三种模式从上到下逐步抽象。

### 创建型模式

创建型模式(Creational Pattern)对类的实例化过程进行了抽象，能够将软件模块中对象的创建和对象的使用分离。为了使软件的结构更加清晰，外界对于这些对象只需要知道它们共同的接口，而不清楚其具体的实现细节，使整个系统的设计更加符合单一职责原则。

创建型模式在创建什么(What)，由谁创建(Who)，何时创建(When)等方面都为软件设计者提供了尽可能大的灵活性。

创建型模式隐藏了类的实例的创建细节，通过隐藏对象如何被创建和组合在一起达到使整个系统独立的目的。

工厂模式是创建型模式中比较重要的。工厂模式的主要功能就是帮助我们实例化对象。之所以名字中包含工厂模式四个字，是因为对象的实例化过程是通过工厂实现的，是用工厂代替new操作的。

### 工厂模式优点：

- **可以使代码结构清晰，有效地封装变化**。在编程中，产品类的实例化有时候是比较复杂和多变的，通过工厂模式，将产品的实例化封装起来，使得调用者根本无需关心产品的实例化过程，只需依赖工厂即可得到自己想要的产品。
- **对调用者屏蔽具体的产品类**。如果使用工厂模式，调用者只关心产品的接口就可以了，至于具体的实现，调用者根本无需关心。即使变更了具体的实现，对调用者来说没有任何影响。
- **降低耦合度**。产品类的实例化通常来说是很复杂的，它需要依赖很多的类，而这些类对于调用者来说根本无需知道，如果使用了工厂方法，我们需要做的仅仅是实例化好产品类，然后交给调用者使用。对调用者来说，产品所依赖的类都是透明的。

### 适用场景

不管是简单工厂模式，工厂方法模式还是抽象工厂模式，他们具有类似的特性，所以他们的适用场景也是类似的。 

首先，作为一种创建类模式，在任何需要生成**复杂对象**的地方，都可以使用工厂方法模式。有一点需要注意的地方就是复杂对象适合使用工厂模式，而简单对象，特别是只需要通过new就可以完成创建的对象，无需使用工厂模式。如果使用工厂模式，就需要引入一个工厂类，会增加系统的复杂度。 

其次，工厂模式是一种典型的**解耦模式**，迪米特法则在工厂模式中表现的尤为明显。假如调用者自己组装产品需要增加依赖关系时，可以考虑使用工厂模式。将会大大降低对象之间的耦合度。

再次，由于工厂模式是依靠抽象架构的，它把实例化产品的任务交由实现类完成，**扩展性比较好**。也就是说，当需要系统有比较好的扩展性时，可以考虑工厂模式，不同的产品用不同的实现工厂来组装。

------



## 一、简单工厂模式

在介绍简单工厂模式之前，我们尝试解决以下问题：

现在我们要使用面向对象的形式定义计算器，为了实现各算法之间的解耦。我们一般会这么写：

```java
// 计算类的基类
@Setter
@Getter
public abstract class Operation {
    private double value1 = 0;
    private double value2 = 0;
    protected abstract double getResule();
}

//加法
public class OperationAdd extends Operation {
    @Override
    protected double getResule() {
        return getValue1() + getValue2();
    }
}
//减法
public class OperationSub extends Operation {
    @Override
    protected double getResule() {
        return getValue1() - getValue2();
    }
}
//乘法
public class OperationMul extends Operation {
    @Override
    protected double getResule() {
        return getValue1() * getValue2();
    }
}
//除法
public class OperationDiv extends Operation {
    @Override
    protected double getResule() {
        if (getValue2() != 0) {
            return getValue1() / getValue2();
        }
        throw new IllegalArgumentException("除数不能为零");
    }
}
```

当我们要使用这个计算器的时候，又会这么写：

```java
public static void main(String[] args) {
  //计算两数之和
  OperationAdd operationAdd = new OperationAdd();
  operationAdd.setValue1(1);
  operationAdd.setValue2(2);
  System.out.println("sum:"+operationAdd.getResule());
  //计算两数乘积
  OperationMul operationMul = new OperationMul();
  operationMul.setValue1(3);
  operationMul.setValue2(5);
  System.out.println("multiply:"+operationMul.getResule());
  //计算两数之差。。。
}
```

想要使用不同的运算的时候就要创建不同的类，并且要明确知道该类的名字。那么这种重复的创建类的工作其实可以放到一个统一的类中去管理。这样的方法我们就叫做「**简单工厂模式**」，在简单工厂模式中用于创建实例的方法是静态(static)方法，因此简单工厂模式又被称为「**静态工厂方法**」模式。。简单工厂模式有以下优点：

- 一个调用者想创建一个对象，只要知道其名称就可以了。
- 屏蔽产品的具体实现，调用者只关心产品的接口。

### 1.1 定义

提供一个创建对象实例的功能，而无需关心其具体实现。被创建实例的类型可以是接口、抽象类，也可以是具体的类。

### 1.2 简单工厂模式实现方式

没骗你，简单工厂模式，真是因为简单才被叫做简单工厂模式的。

简单工厂模式包含 3 个角色（要素）：

- Factory：即工厂类， 简单工厂模式的核心部分，负责实现创建所有产品的内部逻辑；工厂类可以被外界直接调用，创建所需对象
- Product：抽象类产品， 它是工厂类所创建的所有对象的父类，封装了各种产品对象的公有方法，它的引入将提高系统的灵活性，使得在工厂类中只需定义一个通用的工厂方法，因为所有创建的具体产品对象都是其子类对象
- ConcreteProduct：具体产品， 它是简单工厂模式的创建目标，所有被创建的对象都充当这个角色的某个具体类的实例。它要实现抽象产品中声明的抽象方法

#### UML类图

![](https://tva1.sinaimg.cn/large/00831rSTly1gcp76z5g27j30li0fpjsv.jpg)

#### 实例

现在我们定义一个工厂类，它可以根据参数的不同返回不同类的实例，被创建的实例通常都具有共同的父类。

```java
//工厂类
public class OperationFactory {

    public static Operation createOperation(String operation) {
        Operation oper = null;
        switch (operation) {
            case "add":
                oper = new OperationAdd();
                break;
            case "sub":
                oper = new OperationSub();
                break;
            case "mul":
                oper = new OperationMul();
                break;

            case "div":
                oper = new OperationDiv();
                break;
            default:
                throw new UnsupportedOperationException("不支持该操作");
        }
        return oper;
    }
}
```

有了工厂类之后，可以使用工厂创建对象：

```java
public static void main(String[] args) {
  Operation operationAdd = OperationFactory.createOperation("add");
  operationAdd.setValue1(1);
  operationAdd.setValue2(2)
  System.out.println(operationAdd.getResule());
}
```

通过简单工厂模式，该计算器的使用者不需要关系实现加法逻辑的那个类的具体名字，只要知道该类对应的参数"add"就可以了。这就体现了之前提到的工厂模式的优点。



### 1.3 简单工厂模式存在的问题

当我们需要增加一种计算时，例如开平方。这个时候我们需要先定义一个类继承Operation类，其中实现平方的代码。除此之外我们还要修改 OperationFactory 类的代码，增加一个case。这显然是**违背开闭原则**的。可想而知对于新产品的加入，工厂类是很被动的。

我们举的例子是最简单的情况。而在实际应用中，很可能产品是一个多层次的树状结构。 简单工厂可能就不太适用了。

### 1.4 简单工厂模式总结

工厂类是整个简单工厂模式的关键。包含了必要的逻辑判断，根据外界给定的信息，决定究竟应该创建哪个具体类的对象。通过使用工厂类，外界可以从直接创建具体产品对象的尴尬局面摆脱出来，仅仅需要负责“消费”对象就可以了。而不必管这些对象究竟如何创建及如何组织的。明确了各自的职责和权利，有利于整个软件体系结构的优化。

但是由于工厂类集中了所有实例的创建逻辑，违反了高内聚责任分配原则，将全部创建逻辑集中到了一个工厂类中；**它所能创建的类只能是事先考虑到的，如果需要添加新的类，则就需要改变工厂类了**。

当系统中的具体产品类不断增多时候，可能会出现要求工厂类根据不同条件创建不同实例的需求．这种对条件的判断和对具体产品类型的判断交错在一起，很难避免模块功能的蔓延，对系统的维护和扩展非常不利；

为了解决这些缺点，就有了工厂方法模式。

------



## 二、工厂方法模式

我们常说的工厂模式，就是指「工厂方法模式」，也叫「虚拟构造器模式」或「多态工厂模式」。

### 2.1 定义

**定义一个创建对象的接口，但让实现这个接口的类来决定实例化哪个类。工厂方法让类的实例化推迟到子类中进行**。

### 2.2 工厂方法模式实现方式

工厂方法模式包含 4 个角色（要素）：

- Product：抽象产品，定义工厂方法所创建的对象的接口，也就是实际需要使用的对象的接口
- ConcreteProduct：具体产品，具体的Product接口的实现对象
- Factory：工厂接口，也可以叫 Creator(创建器)，申明工厂方法，通常返回一个 Product 类型的实例对象
- ConcreteFactory：工厂实现，或者叫 ConcreteCreator(创建器对象)，覆盖 Factory 定义的工厂方法，返回具体的 Product 实例

#### UML类图

![](https://tva1.sinaimg.cn/large/00831rSTly1gcp774606hj30za0hagmu.jpg)

####  实例

从UML类图可以看出，每种产品实现，我们都要增加一个继承于工厂接口 `IFactory` 的工厂类 `Factory` ，修改简单工厂模式代码中的工厂类如下：

```java
//工厂接口
public interface IFactory {
    Operation CreateOption();
}

//加法类工厂
public class AddFactory implements IFactory {
    public Operation CreateOption() {
        return new OperationAdd();
    }
}

//减法类工厂
public class SubFactory implements IFactory {
    public Operation CreateOption() {
        return new OperationSub();
    }
}

//乘法类工厂
public class MulFactory implements IFactory {
    public Operation CreateOption() {
        return new OperationMul();
    }
}

//除法类工厂
public class DivFactory implements IFactory {
    public Operation CreateOption() {
        return new OperationDiv();
    }
}
```

这时，我们使用计算器的时候，要为每种运算方法增加一个工厂对象

```java
public class Client {
    public static void main(String[] args) {
      //减法
      IFactory subFactory = new SubFactory();
      Operation operationSub =  subFactory.CreateOption();
      operationSub.setValue1(22);
      operationSub.setValue2(20);
      System.out.println("sub:"+operationSub.getResult());
      //除法
      IFactory Divfactory = new DivFactory();
      Operation operationDiv =  Divfactory.CreateOption();
      operationDiv.setValue1(99);
      operationDiv.setValue2(33);
      System.out.println("div:"+operationSub.getResult());
    }
}
```



纳尼，这不是更复杂了吗，每个产品对应一个工厂，我又不是按代码量赚钱的。。。

### 2.3 工厂方法模式适用场景

工厂方法模式和简单工厂模式虽然都是通过工厂来创建对象，他们之间最大的不同是——工厂方法模式在设计上完全完全符合“**开闭原则**”。

在以下情况下可以使用工厂方法模式：

- **一个类不知道它所需要的对象的类**：在工厂方法模式中，客户端不需要知道具体产品类的类名，只需要知道所对应的工厂即可，具体的产品对象由具体工厂类创建；客户端需要知道创建具体产品的工厂类。
- **一个类通过其子类来指定创建哪个对象**：在工厂方法模式中，对于抽象工厂类只需要提供一个创建产品的接口，而由其子类来确定具体要创建的对象，利用面向对象的多态性和里氏代换原则，在程序运行时，子类对象将覆盖父类对象，从而使得系统更容易扩展。
- 将创建对象的任务委托给多个工厂子类中的某一个，客户端在使用时可以无须关心是哪一个工厂子类创建产品子类，需要时再动态指定，可将具体工厂类的类名存储在配置文件或数据库中。

#### 使用场景

- 日志记录器：记录可能记录到本地硬盘、系统事件、远程服务器等，用户可以选择记录日志到什么地方。
- 数据库访问，当用户不知道最后系统采用哪一类数据库，以及数据库可能有变化时。
- 设计一个连接服务器的框架，需要三个协议，"POP3"、"IMAP"、"HTTP"，可以把这三个作为产品类，共同实现一个接口。
- 比如 Hibernate 换数据库只需换方言和驱动就可以



### 2.4 工厂方法模式总结

工厂方法模式是简单工厂模式的进一步抽象和推广。

由于使用了面向对象的多态性，工厂方法模式保持了简单工厂模式的优点，而且克服了它的缺点。

在工厂方法模式中，核心的工厂类不再负责所有产品的创建，而是将具体创建工作交给子类去做。这个核心类仅仅负责给出具体工厂必须实现的接口，而不负责产品类被实例化这种细节，这使得工厂方法模式可以允许系统在不修改工厂角色的情况下引进新产品。

**优点：** 

- 一个调用者想创建一个对象，只要知道其名称就可以了。 
- 扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以。 
- 屏蔽产品的具体实现，调用者只关心产品的接口。

**缺点：**

每次增加一个产品时，都需要增加一个具体类和对象实现工厂，使得系统中类的个数成倍增加，在一定程度上增加了系统的复杂度，同时也增加了系统具体类的依赖。这并不是什么好事。

------



## 三、抽象工厂模式

工厂方法模式通过引入工厂等级结构，解决了简单工厂模式中工厂类职责太重的问题，但由于工厂方法模式中的每个工厂只生产一类产品，可能会导致系统中存在大量的工厂类，势必会增加系统的开销。此时，我们可以考虑将一些相关的产品组成一个“**产品族**”，由同一个工厂来统一生产，这就是抽象工厂模式的基本思想。 

### 3.1 定义

为创建一组相关或相互依赖的对象提供一个接口，而且无需指定他们的具体类。

抽象工厂(Abstract Factory)模式，又称工具箱(Kit 或Toolkit)模式。

### 3.2 抽象工厂模式实现方式

抽象工厂模式是工厂方法模式的升级版本，他用来创建一组相关或者相互依赖的对象。他与工厂方法模式的区别就在于，工厂方法模式针对的是一个产品等级结构；而抽象工厂模式则是针对的多个产品等级结构。在编程中，通常一个产品结构，表现为一个接口或者抽象类，也就是说，工厂方法模式提供的所有产品都是衍生自同一个接口或抽象类，而抽象工厂模式所提供的产品则是衍生自不同的接口或抽象类。

在抽象工厂模式中，有一个**产品族**的概念：所谓的产品族，是指**位于不同产品等级结构中功能相关联的产品组成的家族**。抽象工厂模式所提供的一系列产品就组成一个产品族；而工厂方法提供的一系列产品称为一个等级结构。

也没骗你，抽象工厂模式确实是抽象。

抽象工厂模式包含的角色（要素）：

- AbstractFactory：抽象工厂，用于声明生成抽象产品的方法
- ConcreteFactory：具体工厂，实现抽象工厂定义的方法，具体实现一系列产品对象的创建
- AbstractProduct：抽象产品，定义一类产品对象的接口
- ConcreteProduct：具体产品，通常在具体工厂里，会选择具体的产品实现，来创建符合抽象工厂定义的方法返回的产品类型的对象。
- Client：客户端，使用抽象工厂来获取一系列所需要的产品对象

#### UML类图

![](https://tva1.sinaimg.cn/large/00831rSTly1gcp778i6yhj31gu0u0ahy.jpg)

#### 实例

我把维基百科的例子改下用于理解，假设我们要生产两种产品，键盘（Keyboard）和鼠标（Mouse） ，每一种产品都支持多种系列，比如 Mac 系列和 Windows 系列。这样每个系列的产品分别是 MacKeyboard WinKeyboard, MacMouse, WinMouse 。为了可以在运行时刻创建一个系列的产品族，我们可以为每个系列的产品族创建一个工厂 MacFactory 和 WinFactory 。每个工厂都有两个方法 CreateMouse 和 CreateKeyboard 并返回对应的产品，可以将这两个方法抽象成一个接口 HardWare 。这样在运行时刻我们可以选择创建需要的产品系列。

![](https://tva1.sinaimg.cn/large/00831rSTly1gcp77dgtchj31gu0u0ag5.jpg)

1. 抽象产品

2. ```java
   public interface Keyboard {
     void input();
   }
   public interface Mouse {
     void click();
   }
   ```

2. 具体产品

   ```java
   //具体产品
   public class MacKeyboard implements Keyboard {
       @Override
       public void input() {
           System.out.println("Mac 专用键盘");
       }
   }
   
   public class MacMouse implements Mouse {
       @Override
       public void click() {
           System.out.println("Mac 专用鼠标");
       }
   }
   
   public class WinKeyboard implements Keyboard {
       @Override
       public void input() {
           System.out.println("Win 专用键盘");
       }
   }
   
   public class WinMouse implements Mouse {
       @Override
       public void click() {
           System.out.println("win 专用鼠标");
       }
   }
   ```

3. 抽象工厂

   ```java
   public interface Hardware {
        Keyboard createKyeBoard();
        Mouse createMouse();
   }
   ```

4. 具体的工厂类

   ```java
   public class MacFactory implements Hardware{
       @Override
       public Keyboard createKyeBoard() {
           return new MacKeyboard();
       }
   
       @Override
       public Mouse createMouse() {
           return new MacMouse();
       }
   }
   
   public class WinFactory implements Hardware{
       @Override
       public Keyboard createKyeBoard() {
           return new WinKeyboard();
       }
   
       @Override
       public Mouse createMouse() {
           return new WinMouse();
       }
   }
   ```

5. 使用

   ```java
   public class Client {
     public static void main(String[] args) {
       Hardware macFactory = new MacFactory();
       Keyboard keyboard = macFactory.createKyeBoard();
       keyboard.input();   //Mac 专用键盘
   
       Hardware winFactory = new WinFactory();
       Mouse mouse = winFactory.createMouse();
       mouse.click();  //win 专用鼠标
     }
   }
   ```

### 3.3 抽象工厂模式适用场景

抽象工厂模式和工厂方法模式一样，都符合开闭原则。但是不同的是，工厂方法模式在增加一个具体产品的时候，都要增加对应的工厂。但是**抽象工厂模式只有在新增一个类型的具体产品时才需要新增工厂**。也就是说，工厂方法模式的一个工厂只能创建一个具体产品。而抽象工厂模式的一个工厂可以创建属于一类类型的多种具体产品。工厂创建产品的个数介于简单工厂模式和工厂方法模式之间。

在以下情况下可以使用抽象工厂模式：

- 一个系统不应当依赖于产品类实例如何被创建、组合和表达的细节，这对于所有类型的工厂模式都是重要的。
- 系统中有多于一个的产品族，而每次只使用其中某一产品族。
- 属于同一个产品族的产品将在一起使用，这一约束必须在系统的设计中体现出来。
- 系统结构稳定，不会频繁的增加对象。

**“开闭原则”的倾斜性**

**在抽象工厂模式中，增加新的产品族很方便，但是增加新的产品等级结构很麻烦**，抽象工厂模式的这种性质称为**“开闭原则”的倾斜性**。“开闭原则”要求系统对扩展开放，对修改封闭，通过扩展达到增强其功能的目的，对于涉及到多个产品族与多个产品等级结构的系统，其功能增强包括两方面：

- 增加产品族：对于增加新的产品族，工厂方法模式很好的支持了“开闭原则”，对于新增加的产品族，只需要对应增加一个新的具体工厂即可，对已有代码无须做任何修改。
- 增加新的产品等级结构：对于增加新的产品等级结构，需要修改所有的工厂角色，包括抽象工厂类，在所有的工厂类中都需要增加生产新产品的方法，违背了“开闭原则”。

正因为抽象工厂模式存在“开闭原则”的倾斜性，它以一种倾斜的方式来满足“开闭原则”，为增加新产品族提供方便，但不能为增加新产品结构提供这样的方便，因此要求设计人员在设计之初就能够全面考虑，不会在设计完成之后向系统中增加新的产品等级结构，也不会删除已有的产品等级结构，否则将会导致系统出现较大的修改，为后续维护工作带来诸多麻烦。


### 3.4 抽象工厂模式总结

抽象工厂模式是工厂方法模式的进一步延伸，由于它提供了功能更为强大的工厂类并且具备较好的可扩展性，在软件开发中得以广泛应用，尤其是在一些框架和API类库的设计中，例如在Java语言的AWT（抽象窗口工具包）中就使用了抽象工厂模式，它使用抽象工厂模式来实现在不同的操作系统中应用程序呈现与所在操作系统一致的外观界面。抽象工厂模式也是在软件开发中最常用的设计模式之一。

**优点：** 

- 抽象工厂模式隔离了具体类的生成，使得客户并不需要知道什么被创建。由于这种隔离，更换一个具体工厂就变得相对容易，所有的具体工厂都实现了抽象工厂中定义的那些公共接口，因此只需改变具体工厂的实例，就可以在某种程度上改变整个软件系统的行为。 
- 当一个产品族中的多个对象被设计成一起工作时，它能够保证客户端始终只使用同一个产品族中的对象。
- 增加新的产品族很方便，无须修改已有系统，符合“开闭原则”。

**缺点：**

增加新的产品等级结构麻烦，需要对原有系统进行较大的修改，甚至需要修改抽象层代码，这显然会带来较大的不便，违背了“开闭原则”。

#### 工厂模式的退化

当抽象工厂模式中每一个具体工厂类只创建一个产品对象，也就是只存在一个产品等级结构时，抽象工厂模式退化成工厂方法模式；当工厂方法模式中抽象工厂与具体工厂合并，提供一个统一的工厂来创建产品对象，并将创建对象的工厂方法设计为静态方法时，工厂方法模式退化成简单工厂模式。



## 四、我们身边的工厂模式

工厂模式在Java码农身边真是无处不在，不信打开你的项目，搜索 `Factory`

- 我们最常用的 Spring  就是一个最大的 Bean 工厂，IOC 通过`BeanFactory`对Bean 进行管理。

- 我们使用的日志门面框架`slf4j`，点进去就可以看到熟悉的味道

  ```java
  private final static Logger logger = LoggerFactory.getLogger(HelloWord.class);
  ```

- JDK 的 `Calendar` 使用了简单工厂模式

  ```java
   Calendar calendar = Calendar.getInstance();
  ```

  

## 参考

https://blog.csdn.net/lovelion/article/details/17517213 

https://wiki.jikexueyuan.com/project/java-design-pattern/abstract-factory-pattern.html 

https://blog.csdn.net/lovelion/article/details/17517213                                                                                                                                    



![](https://i.loli.net/2020/03/19/AkRqgTo6y5crBSx.png)