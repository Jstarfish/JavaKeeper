---
title: 建造者模式
date: 2021-10-09
tags: 
 - Design Patterns
categories: Design Patterns
---

![](https://img.starfish.ink/design-patterns/builder-pattern-banner.png)

> StringBuilder 你肯定用过，JDK 中的建造者模式
>
> lombok 中的 @Bulider，你可能也用过，恩，这也是我们要说的建造者模式

> 直接使用构造函数或者配合 set 方法就能创建对象，为什么还需要建造者模式来创建呢？
>
> 建造者模式和工厂模式都可以创建对象，那它们两个的区别在哪里呢？

## 简介

Builder Pattern，中文翻译为**建造者模式**或者**构建者模式**，也有人叫它**生成器模式**。

**建造者模式**是一种创建型设计模式， 使你能够分步骤创建复杂对象。它允许用户只通过指定复杂对象的类型和内容就可以构建它们，用户不需要知道内部的具体构建细节。

**定义**：将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

![](https://img.starfish.ink/design-pattern/frc-8d65236e72e9b84771951a1f4af83e86.gif)



## hello world

程序员麽，先上个 `hello world` 热热身

```java
public class User {

    private Long id;
    private String name;
    private Integer age;  //可选
    private String desc;	//可选

    private User(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.age = builder.age;
        this.desc = builder.desc;
    }

    public static Builder newBuilder(Long id, String name) {
        return new Builder(id, name);
    }

    public Long getId() {return id;}
    public String getName() {return name;}
    public Integer getAge() {return age;}
    public String getDesc() {return desc;}

    @Override
    public String toString() {
        return "Builder{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", desc='" + desc + '\'' +
                '}';
    }

    public static class Builder {
        private Long id;
        private String name;
        private Integer age;
        private String desc;

        private Builder(Long id, String name) {
            Assert.assertNotNull("标识不能为空",id);
            Assert.assertNotNull("名称不能为空",name);
            this.id = id;
            this.name = name;
        }
        public Builder age(Integer age) {
            this.age = age;
            return this;
        }
        public Builder desc(String desc) {
            this.desc = desc;
            return this;
        }
        public User build() {
            return new User(this);
        }

    }

    public static void main(String[] args) {
        User user = User.newBuilder(1L, "starfish").age(22).desc("test").build();
        System.out.println(user.toString());
    }
}
```

这样的代码有什么优缺点呢？

主要优点：

1. 明确了必填参数和可选参数，在构造方法中进行验证；
2. 可以定义为不可变类，初始化后属性字段值不可变更；
3. 赋值代码可读性较好，明确知道哪个属性字段对应哪个值；
4. 支持链式方法调用，相比于调用 Setter 方法，代码更简洁。

主要缺点：

1. 代码量较大，多定义了一个 Builder 类，多定义了一套属性字段，多实现了一套赋值方法；
2. 运行效率低，需要先创建 Builder 实例，再赋值属性字段，再创建目标实例，最后拷贝属性字段。

> 当然，以上代码，就可以通过 Lombok 的 @Builder 简化代码
>
> 如果我们就那么三三两两个参数，直接构造函数配合 set 方法就能搞定的，就不用套所谓的模式了。
>
> 高射炮打蚊子——不合算
>
> 假设有这样一个复杂对象， 在对其进行构造时需要对诸多成员变量和嵌套对象进行繁复的初始化工作。 这些初始化代码通常深藏于一个包含众多参数且让人基本看不懂的构造函数中； 甚至还有更糟糕的情况， 那就是这些代码散落在客户端代码的多个位置。
>
> 这时候才是构造器模式上场的时候



上边的例子，其实属于简化版的建造者模式，只是为了方便构建类中的各个参数，”正经“的和这个有点差别，更倾向于用同样的构建过程分步创建不同的产品类。

我们接着扯~

## 结构

![](https://img.starfish.ink/design-patterns/builder-UML.png)

从 UML 图上可以看到有 4 个不同的角色

- 抽象建造者（Builder）：创建一个 Produc 对象的各个部件指定的接口/抽象类
- 具体建造者（ConcreteBuilder）：实现接口，构建和装配各个组件
- 指挥者/导演类（Director）：构建一个使用 Builder 接口的对象。负责调用适当的建造者来组建产品，导演类一般不与产品类发生依赖关系，与导演类直接交互的是建造者类。
- 产品类（Product）：一个具体的产品对象



## demo

假设我是个汽车工厂，需求就是能造各种车（或者造电脑、造房子、做煎饼、生成不同文件TextBuilder、HTMLBuilder等等，都是一个道理）

![](https://img.starfish.ink/design-patterns/builder-car.png)

1、生成器（Builder）接口声明在所有类型生成器中通用的产品构造步骤

```java
public interface CarBuilder {
    void setCarType(CarType type);
    void setSeats(int seats);
    void setEngine(Engine engine);
    void setGPS(GPS gps);
}
```

2、具体的生成器（Concrete Builders）提供构造过程的不同实现

```java
public class SportsCarBuilder implements CarBuilder {

    private CarType carType;
    private int seats;
    private Engine engine;
    private GPS gps;

    @Override
    public void setCarType(CarType type) {
        this.carType = type;
    }

    @Override
    public void setSeats(int seats) {
        this.seats = seats;
    }

    @Override
    public void setEngine(Engine engine) {
        this.engine = engine;
    }

    @Override
    public void setGPS(GPS gps) {
        this.gps = gps;
    }

    public Car getResult() {
        return new Car(carType, seats, engine, gps);
    }
}
```

3、产品（Products）是最终生成的对象

```java
@Setter
@Getter
@ToString
public class Car {

    private final CarType carType;
    private final int seats;
    private final Engine engine;
    private final GPS gps;
    private double fuel;

    public Car(CarType carType,int seats,Engine engine,GPS gps){
        this.carType = carType;
        this.seats = seats;
        this.engine = engine;
        this.gps = gps;
    }
}
```

4、主管（Director）类定义调用构造步骤的顺序，这样就可以创建和复用特定的产品配置（Director 类的构造函数的参数是 CarBuilder，但实际上没有实例传递出去作参数，因为 CarBuilder 是接口或抽象类，无法产生对象实例，实际传递的是 Builder 的子类，根据子类类型，决定生产内容）

```java
public class Director {

    public void constructSportsCar(CarBuilder builder){
        builder.setCarType(CarType.SPORTS_CAR);
        builder.setSeats(2);
        builder.setEngine(new Engine(2.0,0));
        builder.setGPS(new GPS());
    }

    public void constructCityCar(CarBuilder builder){
        builder.setCarType(CarType.CITY_CAR);
        builder.setSeats(4);
        builder.setEngine(new Engine(1.5,0));
        builder.setGPS(new GPS());
    }

    public void constructSUVCar(CarBuilder builder){
        builder.setCarType(CarType.SUV);
        builder.setSeats(4);
        builder.setEngine(new Engine(2.5,0));
        builder.setGPS(new GPS());
    }

}
```

5、客户端使用（最终结果从建造者对象中获取，主管并不知道最终产品的类型）

```java
public class Client {

    public static void main(String[] args) {
        Director director = new Director();
        SportsCarBuilder builder = new SportsCarBuilder();
        director.constructSportsCar(builder);

        Car car = builder.getResult();
        System.out.println(car.toString());
    }
}
```



## 适用场景

适用场景其实才是理解设计模式最重要的，只要知道这个业务场景需要什么模式，网上浪程序员能不会吗

- **使用建造者模式可避免重叠构造函数的出现**。

  假设你的构造函数中有 N 个可选参数，那 new 各种实例的时候就很麻烦，需要重载构造函数多次

- 当你希望使用代码创建不同形式的产品 （例如石头或木头房屋） 时， 可使用建造者模式。

  如果你需要创建的各种形式的产品， 它们的制造过程相似且仅有细节上的差异， 此时可使用建造者模式。

- **使用生成器构造组合树或其他复杂对象**。

  建造者模式让你能分步骤构造产品。 你可以延迟执行某些步骤而不会影响最终产品。 你甚至可以递归调用这些步骤， 这在创建对象树时非常方便。



## VS 抽象工厂

抽象工厂模式实现对产品家族的创建，一个产品家族是这样的一系列产品：具有不同分类维度的产品组合，采用抽象工厂模式不需要关心抽象过程，只关心什么产品由什么工厂生产即可。而建造者模式则是要求按照指定的蓝图建造产品，它的主要目的是通过组装零配件而生产一个新的产品。



## 最后

设计模式，这玩意看简单的例子，肯定能看得懂，主要是结合自己的业务思考怎么应用，让系统设计更完善，懂了每种模式后，可以找找各种框架源码或在 github 搜搜相关内容，看看实际中是怎么应用的。



> 公众号回复 ”设计模式“，领取 10 本设计模式 pdf 书籍



## 参考

- refactoringguru.cn

