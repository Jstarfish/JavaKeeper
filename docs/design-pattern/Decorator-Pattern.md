# 装饰模式——看看 JDK 和 Spring 是如何杜绝继承滥用的

《Head First 设计模式》中是这么形容装饰者模式的——“**给爱用继承的人一个全新的设计眼界**”，拒绝继承滥用，从装饰者模式开始。

装饰者模式允许向一个现有的对象添加新的功能，同时又不改变其结构。这种类型的设计模式属于**结构型模式**，它是作为现有的类的一个包装。

这种模式创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供了额外的功能。

------



## 模式动机

一般有两种方式可以实现给一个类或对象增加行为：

- 继承机制，使用继承机制是给现有类添加功能的一种有效途径，通过继承一个现有类可以使得子类在拥有自身方法的同时还拥有父类的方法。但是这种方法是静态的，用户不能控制增加行为的方式和时机。
- 关联机制，即将一个类的对象嵌入另一个对象中，由另一个对象来决定是否调用嵌入对象的行为以便扩展自己的行为，我们称这个嵌入的对象为**装饰器**(Decorator)

装饰模式以对客户透明的方式动态地给一个对象附加上更多的责任，换言之，客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不需要创造更多子类的情况下，将对象的功能加以扩展。

------



## 定义

**装饰模式**(Decorator Pattern) ：动态地给一个对象增加一些额外的职责(Responsibility)，就增加对象功能来说，装饰模式比生成子类（继承）实现更为灵活。其别名也可以称为**包装器**(Wrapper)，与适配器模式的别名相同，但它们适用于不同的场合。

------



## 角色

- **Component**： 抽象组件，装饰者和被装饰者共同的父类，是一个接口或者抽象类，用来定义基本行为，可以给这些对象动态添加职责

- **ConcreteComponent**： 具体的组件对象，实现类 ，即被装饰者，通常就是被装饰器装饰的原始对象，也就是可以给这个对象添加职责

- **Decorator**： 所有装饰器的抽象父类，一般是抽象类，实现接口；它的属性必然有个指向 Conponent 抽象组件的对象 ，其实就是持有一个被装饰的对象

- **ConcreteDecorator**： 具体的装饰对象，实现具体要被装饰对象添加的功能。每一个具体装饰类都定义了一些新的行为，它可以调用在抽象装饰类中定义的方法，并可以增加新的方法用以扩充对象的行为。



装饰者和被装饰者对象有相同的父类，因为装饰者和被装饰者必须是一样的类型，**这里利用继承是为了达到类型匹配，而不是利用继承获得行为**。

利用继承设计子类，只能在编译时静态决定，并且所有子类都会继承相同的行为；利用组合的做法扩展对象，就可以在运行时动态的进行扩展。装饰者模式遵循开放-关闭原则：**类应该对扩展开放，对修改关闭。**利用装饰者，我们可以实现新的装饰者增加新的行为而不用修改现有代码，而如果单纯依赖继承，每当需要新行为时，还得修改现有的代码。

------



## 类图

![](https://tva1.sinaimg.cn/large/00831rSTly1gd5a7252usj31750tpgof.jpg)

------



## 实例

看了好多资料的例子，比如

- 公司发放奖金，不同的员工类型对应不同的奖金计算规则，用各种计算规则去装饰统一的奖金计算类
- 星巴克售卖用咖啡，用摩卡、奶泡去装饰咖啡，实现不同的计费
- 变形金刚在变形之前是一辆汽车，它可以在陆地上移动。当它变成机器人之后除了能够在陆地上移动之外，还可以说话；如果需要，它还可以变成飞机，除了在陆地上移动还可以在天空中飞翔 

我还是比较喜欢卖煎饼的例子

 ![](https://i04piccdn.sogoucdn.com/a000fc61baeaeb5b) 

1、定义抽象组件

```java
public abstract class Pancake {

    String description = "普通煎饼";

    public String getDescription(){
        return description;
    }

    public abstract double cost();
}
```

2、定义具体的被装饰者，这里是煎饼果子，当然还可以有鸡蛋灌饼、手抓饼等其他被装饰者

```java
public class Battercake extends Pancake {
    @Override
    public double cost() {
        return 8;
    }

    public Battercake(){
        description = "煎饼果子";
    }
}
```

3、抽象的装饰器对象，定义一个调料抽象类

```java
public abstract class CondimentDecorator extends Pancake {

    // 持有组件对象
    protected Pancake pancake;
    public CondimentDecorator(Pancake pancake){
        this.pancake = pancake;
    }

    public abstract String getDescription();
}
```

4、具体的装饰者，我们定义一个鸡蛋装饰器，一个火腿装饰器

```java
public class Egg extends CondimentDecorator {
    public Egg(Pancake pancake){
        super(pancake);
    }

    @Override
    public String getDescription() {
        return pancake.getDescription() + "加鸡蛋";
    }

    @Override
    public double cost() {
        return pancake.cost() + 1;
    }
}
```

```java
public class Sausage extends CondimentDecorator{
    public Sausage(Pancake pancake){
        super(pancake);
    }
    @Override
    public String getDescription() {
        return pancake.getDescription() + "加火腿";
    }

    @Override
    public double cost() {
        return pancake.cost() + 2;
    }
}
```

5、测试煎饼交易，over

```java
public class Client {

    public static void main(String[] args) {
        //买一个普通的煎饼果子
        Pancake battercake = new Battercake();
        System.out.println(battercake.getDescription() + "花费："+battercake.cost() + "元");

        //买一个加双蛋的煎饼果子
        Pancake doubleEgg = new Battercake();
        doubleEgg = new Egg(doubleEgg);
        doubleEgg = new Egg(doubleEgg);
        System.out.println(doubleEgg.getDescription() + "花费" + doubleEgg.cost() + "元");

        //加火腿和鸡蛋
        Pancake battercakePlus = new Battercake();
        battercakePlus = new Egg(battercakePlus);
        battercakePlus = new Sausage(battercakePlus);
        System.out.println(battercakePlus.getDescription() + "花费" + battercakePlus.cost() + "元");
    }
}
```

输出：

```
煎饼果子花费：8.0元
煎饼果子加鸡蛋加鸡蛋花费10.0元
煎饼果子加鸡蛋加火腿花费11.0元
```

顺便看下通过 IDEA 生成的 UML 类图（和我们画的类图一样哈）

![](https://tva1.sinaimg.cn/large/00831rSTly1gd515ta83tj318c0pmjui.jpg)

------



## 应用

### Java I/O 中的装饰者模式

我们使用 `java.io` 包下的各种输入流、输出流、字节流、字符流、缓冲流等各种各样的流，他们中的许多类都是装饰者，下面是一个典型的对象集合，用装饰者将功能结合起来，以读取文件数据

![](https://tva1.sinaimg.cn/large/00831rSTly1gd51gr33b0j30ls0au74n.jpg)

`BufferedInputStream` 和 `LinerNumberInputStream` 都是扩展自 `FilterInputStream`，而 `FilterInputStream` 是一个抽象的装饰类。

在 idea 中选中一些常见 InputStream 类，生成 UML 图如下：

![](https://tva1.sinaimg.cn/large/00831rSTly1gd51yq60yxj322e0rewkg.jpg)

我们平时读取一个文件中的内容其实就使用到了装饰模式的思想，简化《Head First 设计模式》的例子，我们自定义一个装饰者，把输入流中的所有大写字符转换为小写

```java
public class LowerCaseInputStream extends FilterInputStream {
  
    protected LowerCaseInputStream(InputStream in) {
        super(in);
    }

    public int read() throws IOException {
        int c = super.read();
        return (c == -1 ? c:Character.toLowerCase(c));
    }
}
```

```java
public class InputTest {

    public static void main(String[] args) throws IOException {
        int c;
        //装饰器的组装过程
        InputStream in = new LowerCaseInputStream(new BufferedInputStream(new FileInputStream("JavaKeeper.txt"))); 

        while ((c = in.read()) >= 0){
            System.out.print((char) c);
        }
        in.close();
    }
}
```

采用装饰者模式在实例化组件时，将增加代码的复杂度，一旦使用装饰者模式，不只需要实例化组件，还把把此组件包装进装饰者中，天晓得有几个，所以在某些复杂情况下，我们还会结合工厂模式和生成器模式。比如Spring中的装饰者模式。



### Servlet 中的装饰者模式

Servlet API 源自于 4 个实现类，它很少被使用，但是十分强大：`ServletRequestWrapper`、`ServletResponseWrapper`以及 `HttpServletRequestWrapper`、`HttpServletResponseWrapper`。

比如`ServletRequestWrapper` 是 `ServletRequest` 接口的简单实现，开发者可以继承 `ServletRequestWrapper` 去扩展原来的`request`

```java
public class ServletRequestWrapper implements ServletRequest {
    private ServletRequest request;

    public ServletRequestWrapper(ServletRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        } else {
            this.request = request;
        }
    }
	//.......
}
```



### spring 中的装饰者模式

Spring 的 `ApplicationContext` 中配置所有的 `DataSource`。 这些 DataSource 可能是各种不同类型的， 比如不同的数据库： Oracle、 SQL Server、 MySQL 等， 也可能是不同的数据源。 然后 SessionFactory 根据客户的每次请求， 将 DataSource 属性设置成不同的数据源， 以达到切换数据源的目的。

在 Spring 的命名体现：Spring 中用到的包装器模式在类名上有两种表现： 一种是类名中含有 `Wrapper`， 另一种是类名中含有 `Decorator`。 基本上都是动态地给一个对象添加一些额外的职责，比如

- `org.springframework.cache.transaction` 包下的 `TransactionAwareCacheDecorator` 类
- `org.springframework.session.web.http` 包下的 `SessionRepositoryFilter` 内部类 `SessionRepositoryRequestWrapper` 



### Mybatis 缓存中的装饰者模式

Mybatis 的缓存模块中，使用了装饰器模式的变体，其中将 `Decorator` 接口和 `Componet` 接口合并为一个`Component `接口。`org.apache.ibatis.cache` 包下的结构

![](https://tva1.sinaimg.cn/large/00831rSTly1gd56rvosupj30kw0r6gpg.jpg)

------



## 总结

装饰模式的本质：**动态组合**

动态组合是手段，组合才是目的。这里的组合有两个意思，一个是动态功能的组合，也就是动态进行装饰器的组合；另外一个是指对象组合，通过对象组合来实现为被装饰对象透明的增加功能。

### 优缺点

装饰模式的优点:

- 装饰模式与继承关系的目的都是要扩展对象的功能，但是装饰模式可以提供比继承更多的灵活性。
- 可以通过一种动态的方式来扩展一个对象的功能，通过配置文件可以在运行时选择不同的装饰器，从而实现不同的行为。
- 通过使用不同的具体装饰类以及这些装饰类的排列组合，可以创造出很多不同行为的组合。可以使用多个具体装饰类来装饰同一对象，得到功能更为强大的对象。
- 具体构件类与具体装饰类可以独立变化，用户可以根据需要增加新的具体构件类和具体装饰类，在使用时再对其进行组合，原有代码无须改变，符合“开闭原则”

装饰模式的缺点:

- 使用装饰模式进行系统设计时将产生很多小对象，这些对象的区别在于它们之间相互连接的方式有所不同，而不是它们的类或者属性值有所不同，同时还将产生很多具体装饰类。这些装饰类和小对象的产生将增加系统的复杂度，加大学习与理解的难度。
- 这种比继承更加灵活机动的特性，也同时意味着装饰模式比继承更加易于出错，排错也很困难，对于多次装饰的对象，调试时寻找错误可能需要逐级排查，较为烦琐。

### 何时选用

- 如果需要在不影响其他对象的情况下，以动态、透明的方式给对象添加职责，可以使用装饰模式
- 当不能采用继承的方式对系统进行扩展或者采用继承不利于系统扩展和维护时可以使用装饰模式。不能采用继承的情况主要有两类：第一类是系统中存在大量独立的扩展，为支持每一种扩展或者扩展之间的组合将产生大量的子类，使得子类数目呈爆炸性增长；第二类是因为类已定义为不能被继承（如 Java 语言中的 final 类）

------



## 参考

《Head First 设计模式》《研磨设计模式》

https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/observer.html

https://www.runoob.com/design-pattern/decorator-pattern.html

https://juejin.im/post/5ba0fb04e51d450e67494256#heading-14