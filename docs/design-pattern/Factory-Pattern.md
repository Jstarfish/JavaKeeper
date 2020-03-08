> 1、工厂模式分为几类？
>
> 2、GOF 23种设计模式中，工厂方法模式和抽象工厂模式有什么区别？
>
> 3、不在GOF 23种设计模式中的简单工厂模式是什么？
>
> 4、简单工厂模式、工厂方法模式和抽象工厂模式各自解决什么问题？有什么不同？





## 工厂模式

工厂模式（Factory Pattern）是 Java 中最常用的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

在工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用一个共同的接口来指向新创建的对象。



## 介绍

**意图：**定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行。

**主要解决：**主要解决接口选择的问题。

**何时使用：**我们明确地计划不同条件下创建不同实例时。

**如何解决：**让其子类实现工厂接口，返回的也是一个抽象的产品。

**关键代码：**创建过程在其子类执行。

**应用实例：** 1、您需要一辆汽车，可以直接从工厂里面提货，而不用去管这辆汽车是怎么做出来的，以及这个汽车里面的具体实现。 2、Hibernate 换数据库只需换方言和驱动就可以。

**优点：** 1、一个调用者想创建一个对象，只要知道其名称就可以了。 2、扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以。 3、屏蔽产品的具体实现，调用者只关心产品的接口。

**缺点：**每次增加一个产品时，都需要增加一个具体类和对象实现工厂，使得系统中类的个数成倍增加，在一定程度上增加了系统的复杂度，同时也增加了系统具体类的依赖。这并不是什么好事。

**使用场景：** 1、日志记录器：记录可能记录到本地硬盘、系统事件、远程服务器等，用户可以选择记录日志到什么地方。 2、数据库访问，当用户不知道最后系统采用哪一类数据库，以及数据库可能有变化时。 3、设计一个连接服务器的框架，需要三个协议，"POP3"、"IMAP"、"HTTP"，可以把这三个作为产品类，共同实现一个接口。

**注意事项：**作为一种创建类模式，在任何需要生成复杂对象的地方，都可以使用工厂方法模式。有一点需要注意的地方就是复杂对象适合使用工厂模式，而简单对象，特别是只需要通过 new 就可以完成创建的对象，无需使用工厂模式。如果使用工厂模式，就需要引入一个工厂类，会增加系统的复杂度。



## 单例模式的定义

**单例模式确保一个类只有一个实例，并提供一个全局唯一访问点**



## 单例模式的类图

![](https://tva1.sinaimg.cn/large/006tNbRwly1gbjeonzilrj309u064t93.jpg)

工厂模式可以分为三类：

- 简单工厂模式（Simple Factory）
- 工厂方法模式（Factory Method）
- 抽象工厂模式（Abstract Factory）

简单工厂其实不是一个标准的的设计模式。GOF 23种设计模式中只有「工厂方法模式」与「抽象工厂模式」。简单工厂模式可以看为工厂方法模式的一种特例，为了统一整理学习，就一起真理下。

这三种工厂模式在设计模式的分类中都属于**创建型模式**。

这三种模式从上到下逐步抽象，并且更具一般性。

创建型模式(Creational Pattern)对类的实例化过程进行了抽象，能够将软件模块中对象的创建和对象的使用分离。为了使软件的结构更加清晰，外界对于这些对象只需要知道它们共同的接口，而不清楚其具体的实现细节，使整个系统的设计更加符合单一职责原则。

创建型模式在创建什么(What)，由谁创建(Who)，何时创建(When)等方面都为软件设计者提供了尽可能大的灵活性。

创建型模式隐藏了类的实例的创建细节，通过隐藏对象如何被创建和组合在一起达到使整个系统独立的目的。

工厂模式是创建型模式中比较重要的。工厂模式的主要功能就是帮助我们实例化对象。之所以名字中包含工厂模式四个字，是因为对象的实例化过程是通过工厂实现的，是用工厂代替new操作的。

这样做的好处是封装了对象的实例化细节，尤其是对于实例化较复杂或者对象的生命周期应该集中管理的情况。会给你系统带来更大的可扩展性和尽量少的修改量。

接下来我们分别介绍下这三种工厂模式。



## 简单工厂模式

简单工厂模式是属于创建型模式，又叫做静态工厂方法（Static Factory Method）模式。简单工厂模式是由一个工厂对象决定创建出哪一种产品类的实例。简单工厂模式是工厂模式家族中最简单实用的模式，可以理解为是不同工厂模式的一个特殊实现。

在介绍简单工厂模式之前，我们尝试解决以下问题：

现在我们要使用面向对象的形式定义计算器，为了实现各算法之间的解耦。主要的用到的类如下：

```
// 计算类的基类
public abstract class Operation {

    private double value1 = 0;
    private double value2 = 0;

    public double getValue1() {
        return value1;
    }
    public void setValue1(double value1) {
        this.value1 = value1;
    }
    public double getValue2() {
        return value2;
    }
    public void setValue2(double value2) {
        this.value2 = value2;
    }
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

当我想要执行加法运算时，可以使用如下代码：

```
public class Main {
    public static void main(String[] args) {
        OperationAdd operationAdd = new OperationAdd();
        operationAdd.setValue1(10);
        operationAdd.setValue2(5);
System.out.println(operationAdd.getResule());
    }
}
```

当我需要执行减法运算时，我就要创建一个OperationSub类。也就是说，我想要使用不同的运算的时候就要创建不同的类，并且要明确知道该类的名字。

那么这种重复的创建类的工作其实可以放到一个统一的工厂类中。简单工厂模式有以下优点：

- 1、一个调用者想创建一个对象，只要知道其名称就可以了。
- 2、屏蔽产品的具体实现，调用者只关心产品的接口。

### 简单工厂模式实现方式

简单工厂模式其实和他的名字一样，很简单。先来看看它的组成:

Factory:这是本模式的核心,含有一定的商业逻辑和判断逻辑。在java中它往往由 一个具体类实现。（OperationFactory）

Product:它一般是具体产品继承的父类或者实现的接口。在java中由接口或者抽象类来实现。（Operation）

ConcreteProduct:工厂类所创建的对象就是此角色的实例。在java中由一个具体类实现。 来用类图来清晰的表示下的它们之间的关系（OperationAdd\OperationSub等）

关系图如下：

![](https://tva1.sinaimg.cn/large/00831rSTly1gcmncln3o9j311i0k6adu.jpg)



在原有类的基础上，定义工厂类：

```
//工厂类
public class OperationFactory {

    public static Operation createOperation(String operation) {
        Operation oper = null;
        switch (operation) {
            case "+":
                oper = new OperationAdd();
                break;
            case "-":
                oper = new OperationSub();
                break;
            case "*":
                oper = new OperationMul();
                break;

            case "/":
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

```
Operation operationAdd = OperationFactory.createOperation("+");
operationAdd.setValue1(10);
operationAdd.setValue2(5);
System.out.println(operationAdd.getResule());
```

通过简单工厂模式，该计算器的使用者不需要关系实现加法逻辑的那个类的具体名字，他只要知道该类对应的参数"+"就可以了。

### 简单工厂模式存在的问题

当我们需要增加一种计算时，例如开平方。这个时候我们需要先定义一个类继承Operation类，其中实现平方的代码。除此之外我们还要修改OperationFactory类的代码，增加一个case。这显然是违背开闭原则的。可想而知对于新产品的加入，工厂类是很被动的。

我们举的例子是最简单的情况。而在实际应用中，很可能产品是一个多层次的树状结构。 简单工厂可能就不太适用了。

### 简单工厂模式总结

工厂类是整个简单工厂模式的关键。包含了必要的逻辑判断，根据外界给定的信息，决定究竟应该创建哪个具体类的对象。通过使用工厂类，外界可以从直接创建具体产品对象的尴尬局面摆脱出来，仅仅需要负责“消费”对象就可以了。而不必管这些对象究竟如何创建及如何组织的。明确了各自的职责和权利，有利于整个软件体系结构的优化。

但是由于工厂类集中了所有实例的创建逻辑，违反了高内聚责任分配原则，将全部创建逻辑集中到了一个工厂类中；它所能创建的类只能是事先考虑到的，如果需要添加新的类，则就需要改变工厂类了。

当系统中的具体产品类不断增多时候，可能会出现要求工厂类根据不同条件创建不同实例的需求．这种对条件的判断和对具体产品类型的判断交错在一起，很难避免模块功能的蔓延，对系统的维护和扩展非常不利；

这些缺点在工厂方法模式中得到了一定的解决。



## **工厂方法模式**

工厂方法模式(Factory Method Pattern)又称为工厂模式，也叫虚拟构造器(Virtual Constructor)模式或者多态工厂(Polymorphic Factory)模式，它属于类创建型模式。

工厂方法模式是一种实现了“工厂”概念的面向对象设计模式。就像其他创建型模式一样，它也是处理在不指定对象具体类型的情况下创建对象的问题。

工厂方法模式的实质是“定义一个创建对象的接口，但让实现这个接口的类来决定实例化哪个类。工厂方法让类的实例化推迟到子类中进行。”

### **工厂方法模式用途**

工厂方法模式和简单工厂模式虽然都是通过工厂来创建对象，他们之间最大的不同是——工厂方法模式在设计上完全完全符合“开闭原则”。

在以下情况下可以使用工厂方法模式：

- 一个类不知道它所需要的对象的类：在工厂方法模式中，客户端不需要知道具体产品类的类名，只需要知道所对应的工厂即可，具体的产品对象由具体工厂类创建；客户端需要知道创建具体产品的工厂类。
- 一个类通过其子类来指定创建哪个对象：在工厂方法模式中，对于抽象工厂类只需要提供一个创建产品的接口，而由其子类来确定具体要创建的对象，利用面向对象的多态性和里氏代换原则，在程序运行时，子类对象将覆盖父类对象，从而使得系统更容易扩展。
- 将创建对象的任务委托给多个工厂子类中的某一个，客户端在使用时可以无须关心是哪一个工厂子类创建产品子类，需要时再动态指定，可将具体工厂类的类名存储在配置文件或数据库中。

### **工厂方法模式实现方式**

工厂方法模式包含如下角色：

Product：抽象产品（Operation）

ConcreteProduct：具体产品(OperationAdd)

Factory：抽象工厂(IFactory)

ConcreteFactory：具体工厂(AddFactory)

关系图如下：

![img](https://tva1.sinaimg.cn/large/00831rSTly1gcmnch426sj310y0k0dkr.jpg)



这里还用计算器的例子。在保持Operation，OperationAdd，OperationDiv，OperationSub，OperationMul等几个方法不变的情况下，修改简单工厂模式中的工厂类（OperationFactory）。替代原有的那个"万能"的大工厂类，这里使用工厂方法来代替：

```
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

//除法类工厂
public class DivFactory implements IFactory {
    public Operation CreateOption() {
        return new OperationDiv();
    }
}

//除法类工厂
public class MulFactory implements IFactory {
    public Operation CreateOption() {
        return new OperationMul();
    }
}

//减法类工厂
public class SubFactory implements IFactory {
    public Operation CreateOption() {
        return new OperationSub();
    }
}
```

这样，在客户端中想要执行加法运算时，需要以下方式：

```
public class Main {

    public static void main(String[] args) {
        IFactory factory = new AddFactory();
        Operation operationAdd =  factory.CreateOption();
        operationAdd.setValue1(10);
        operationAdd.setValue2(5);
        System.out.println(operationAdd.getResult());
    }
}
```

到这里，一个工厂方法模式就已经写好了。

从代码量上看，这种工厂方法模式比简单工厂方法模式更加复杂。针对不同的操作（Operation）类都有对应的工厂。很多人会有以下疑问：

貌似工厂方法模式比简单工厂模式要复杂的多？



工厂方法模式和我自己创建对象没什么区别？为什么要多搞出一些工厂来？

下面就针对以上两个问题来深入理解一下工厂方法模式。

### **为什么要使用工厂来创建对象？**

封装对象的创建过程

在工厂方法模式中，工厂方法用来创建客户所需要的产品，同时还向客户**隐藏了哪种具体产品类将被实例化这一细节，用户只需要关心所需产品对应的工厂，无须关心创建细节，甚至无须知道具体产品类的类名。**

基于工厂角色和产品角色的多态性设计是工厂方法模式的关键。**它能够使工厂可以自主确定创建何种产品对象，而如何创建这个对象的细节则完全封装在具体工厂内部。**工厂方法模式之所以又被称为多态工厂模式，是因为所有的具体工厂类都具有同一抽象父类。

**为什么每种对象要单独有一个工厂？**

符合『开放-封闭原则』

主要目的是为了解耦。在系统中加入新产品时，无须修改抽象工厂和抽象产品提供的接口，无须修改客户端，也无须修改其他的具体工厂和具体产品，而只要添加一个具体工厂和具体产品就可以了。这样，系统的可扩展性也就变得非常好，完全符合“开闭原则。

以上就是工厂方法模式的优点。但是，工厂模式也有一些不尽如人意的地方：

- 在添加新产品时，需要编写新的具体产品类，而且还要提供与之对应的具体工厂类，系统中类的个数将成对增加，在一定程度上增加了系统的复杂度，有更多的类需要编译和运行，会给系统带来一些额外的开销。

  

- 由于考虑到系统的可扩展性，需要引入抽象层，在客户端代码中均使用抽象层进行定义，增加了系统的抽象性和理解难度，且在实现时可能需要用到DOM、反射等技术，增加了系统的实现难度。

### **工厂方法模式总结**

工厂方法模式是简单工厂模式的进一步抽象和推广。

由于使用了面向对象的多态性，工厂方法模式保持了简单工厂模式的优点，而且克服了它的缺点。

在工厂方法模式中，核心的工厂类不再负责所有产品的创建，而是将具体创建工作交给子类去做。这个核心类仅仅负责给出具体工厂必须实现的接口，而不负责产品类被实例化这种细节，这使得工厂方法模式可以允许系统在不修改工厂角色的情况下引进新产品。

工厂方法模式的主要优点是增加新的产品类时无须修改现有系统，并封装了产品对象的创建细节，系统具有良好的灵活性和可扩展性；其缺点在于增加新产品的同时需要增加新的工厂，导致系统类的个数成对增加，在一定程度上增加了系统的复杂性。



## 抽象工厂模式

抽象工厂模式(Abstract Factory Pattern)：提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。抽象工厂(Abstract Factory)模式，又称工具箱(Kit 或Toolkit)模式，属于对象创建型模式。

抽象工厂模式提供了一种方式，可以将同一产品族的单独的工厂封装起来。在正常使用中，客户端程序需要创建抽象工厂的具体实现，然后使用抽象工厂作为接口来创建这一主题的具体对象。客户端程序不需要知道（或关心）它从这些内部的工厂方法中获得对象的具体类型，因为客户端程序仅使用这些对象的通用接口。抽象工厂模式将一组对象的实现细节与他们的一般使用分离开来。

#### 创建过程如下 

一个具体工厂创建一个产品族，一个产品族是不同系列产品的组合，产品的创建的逻辑分在在每个具体工厂类中。所有的具体工厂继承自同一个抽象工厂。 

客户端创建不同产品族的工厂，产品族的工厂创建具体的产品对客户端是不可见的。 

增加新的产品族时，需要增加具体工厂类,符合OCP原则。 

增加新产品时，需要修改具体工厂类和增加产品类，不符合OCP原则 

如果没有应对“多系列对象创建”的需求变化，则没有必要使用抽象工厂模式，这时候使用简单的静态工厂完全可以。

**产品族**

来认识下什么是产品族: 位于不同产品等级结构中,功能相关的产品组成的家族。如下面的例子，就有两个产品族：跑车族和商务车族。

关系图如下：

![img](https://tva1.sinaimg.cn/large/00831rSTly1gcmncbtwkej31160mkdow.jpg)



**抽象工厂模式用途**

抽象工厂模式和工厂方法模式一样，都符合开放-封闭原则。但是不同的是，工厂方法模式在增加一个具体产品的时候，都要增加对应的工厂。但是抽象工厂模式只有在新增一个类型的具体产品时才需要新增工厂。也就是说，工厂方法模式的一个工厂只能创建一个具体产品。而抽象工厂模式的一个工厂可以创建属于一类类型的多种具体产品。工厂创建产品的个数介于简单工厂模式和工厂方法模式之间。

在以下情况下可以使用抽象工厂模式：

- 一个系统不应当依赖于产品类实例如何被创建、组合和表达的细节，这对于所有类型的工厂模式都是重要的。
- 系统中有多于一个的产品族，而每次只使用其中某一产品族。
- 属于同一个产品族的产品将在一起使用，这一约束必须在系统的设计中体现出来。
- 系统提供一个产品类的库，所有的产品以同样的接口出现，从而使客户端不依赖于具体实现。

**抽象工厂模式实现方式**

抽象工厂模式包含如下角色：

AbstractFactory(抽象工厂)：用于声明生成抽象产品的方法

ConcreteFactory(具体工厂)：实现了抽象工厂声明的生成抽象产品的方法，生成一组具体产品，这些产品构成了一个产品族，每一个产品都位于某个产品等级结构中；

AbstractProduct(抽象产品)：为每种产品声明接口，在抽象产品中定义了产品的抽象业务方法；

Product(具体产品)：定义具体工厂生产的具体产品对象，实现抽象产品接口中定义的业务方法。

本文的例子采用一个汽车代工厂造汽车的例子。假设我们是一家汽车代工厂商，我们负责给奔驰和特斯拉两家公司制造车子。

我们简单的把奔驰车理解为需要加油的车，特斯拉为需要充电的车。其中奔驰车中包含跑车和商务车两种，特斯拉同样也包含奔驰车和商务车。

![img](https://tva1.sinaimg.cn/large/00831rSTly1gcmnc75l75j31100q6k0i.jpg)



以上场景，我们就可以把跑车和商务车分别对待，对于跑车有单独的工厂创建，商务车也有单独的工厂。

这样，以后无论是再帮任何其他厂商造车，只要是跑车或者商务车我们都不需要再引入工厂。同样，如果我们要增加一种其他类型的车，比如越野车，我们也不需要对跑车或者商务车的任何东西做修改。

下面是抽象产品，奔驰车和特斯拉车：

```
public interface BenzCar {
    //加汽油
    public void gasUp();

}

public interface TeslaCar {
    //充电
    public void charge();
}
```

下面是具体产品，奔驰跑车、奔驰商务车、特斯拉跑车、特斯拉商务车：

```
public class BenzSportCar implements BenzCar {
    public void gasUp() {
        System.out.println("给我的奔驰跑车加最好的汽油");
    }
}

public class BenzBusinessCar implements BenzCar{
    public void gasUp() {
        System.out.println("给我的奔驰商务车加一般的汽油");
    }
}

public class TeslaSportCar implements TeslaCar {
    public void charge() {
        System.out.println("给我特斯拉跑车冲满电");
    }
}

public class TeslaBusinessCar implements TeslaCar {
    public void charge() {
        System.out.println("不用给我特斯拉商务车冲满电");
    }
}
```

下面是抽象工厂：

```
public interface CarFactory {

    public BenzCar getBenzCar();
    public TeslaCar getTeslaCar();
}
```

下面是具体工厂：

```
public class SportCarFactory implements CarFactory {
    public BenzCar getBenzCar() {
        return new BenzSportCar();
    }

    public TeslaCar getTeslaCar() {
        return new TeslaSportCar();
    }
}

public class BusinessCarFactory implements CarFactory {
    public BenzCar getBenzCar() {
        return new BenzBusinessCar();
    }

    public TeslaCar getTeslaCar() {
        return new TeslaBusinessCar();
    }
}
```

**“开闭原则”的倾斜性**

“开闭原则”要求系统对扩展开放，对修改封闭，通过扩展达到增强其功能的目的。对于涉及到多个产品族与多个产品等级结构的系统，其功能增强包括两方面：

- 增加产品族：对于增加新的产品族，工厂方法模式很好的支持了“开闭原则”，对于新增加的产品族，只需要对应增加一个新的具体工厂即可，对已有代码无须做任何修改。
- 增加新的产品等级结构：对于增加新的产品等级结构，需要修改所有的工厂角色，包括抽象工厂类，在所有的工厂类中都需要增加生产新产品的方法，不能很好地支持“开闭原则”。

抽象工厂模式的这种性质称为“开闭原则”的倾斜性，抽象工厂模式以一种倾斜的方式支持增加新的产品，它为新产品族的增加提供方便，但不能为新的产品等级结构的增加提供这样的方便。

**抽象工厂模式总结**

抽象工厂模式提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。抽象工厂模式又称为Kit模式，属于对象创建型模式。

抽象工厂模式是所有形式的工厂模式中最为抽象和最具一般性的一种形态。

抽象工厂模式的主要优点是隔离了具体类的生成，使得客户并不需要知道什么被创建，而且每次可以通过具体工厂类创建一个产品族中的多个对象，增加或者替换产品族比较方便，增加新的具体工厂和产品族很方便；主要缺点在于增加新的产品等级结构很复杂，需要修改抽象工厂和所有的具体工厂类，对“开闭原则”的支持呈现倾斜性。



## **三种工厂模式对比**

**简单工厂模式的优缺点**

- 优点：

- - 1、屏蔽产品的具体实现，调用者只关心产品的接口。
  - 2、实现简单

- 缺点：

- - 1、增加产品，需要修改工厂类，不符合开放-封闭原则
  - 2、工厂类集中了所有实例的创建逻辑，违反了高内聚责任分配原则

**工厂方法模式的优缺点**

- 优点：

- - 1、继承了简单工厂模式的优点
  - 2、符合开放-封闭原则

- 缺点：

- - 1、增加产品，需要增加新的工厂类，导致系统类的个数成对增加，在一定程度上增加了系统的复杂性。

**抽象工厂模式的优缺点**

- 优点：

- - 1、隔离了具体类的生成，使得客户并不需要知道什么被创建
  - 2、每次可以通过具体工厂类创建一个产品族中的多个对象，增加或者替换产品族比较方便，增加新的具体工厂和产品族很方便；

- 缺点

- - 增加新的产品等级结构很复杂，需要修改抽象工厂和所有的具体工厂类，对“开闭原则”的支持呈现倾斜性。

    



**三种工厂模式的对比与转换**

![img](https://tva1.sinaimg.cn/large/00831rSTly1gcmnc0p64nj310u0oi45c.jpg)

简单工厂 ： 用来生产同一等级结构中的任意产品。（对于增加新的产品，主要是新增产品，就要修改工厂类。符合单一职责原则。不符合开放-封闭原则）

工厂方法 ：用来生产同一等级结构中的固定产品。（支持增加任意产品，新增产品时不需要更改已有的工厂，需要增加该产品对应的工厂。符合单一职责原则、符合开放-封闭原则。但是引入了复杂性）

抽象工厂 ：用来生产不同产品族的全部产品。（增加新产品时，需要修改工厂，增加产品族时，需要增加工厂。符合单一职责原则，部分符合开放-封闭原则，降低了复杂性）

最后，三种工厂模式各有优缺点，没有最好的，只有最合适的！