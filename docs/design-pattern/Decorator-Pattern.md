 https://design-patterns.readthedocs.io/zh_CN/latest/structural_patterns/decorator.html 



 https://www.javazhiyin.com/33987.html 



 http://www.spring4all.com/article/15180 

 https://juejin.im/post/5ba0fb04e51d450e67494256 

# 装饰模式

《Head First 设计模式》中是这么形容装饰者模式——“给爱用继承的人个全新的设计眼界”



装饰器模式（Decorator Pattern）允许向一个现有的对象添加新的功能，同时又不改变其结构。这种类型的设计模式属于结构型模式，它是作为现有的类的一个包装。

这种模式创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供了额外的功能。

我们通过下面的实例来演示装饰器模式的用法。其中，我们将把一个形状装饰上不同的颜色，同时又不改变形状类。



## 模式动机

一般有两种方式可以实现给一个类或对象增加行为：

- 继承机制，使用继承机制是给现有类添加功能的一种有效途径，通过继承一个现有类可以使得子类在拥有自身方法的同时还拥有父类的方法。但是这种方法是静态的，用户不能控制增加行为的方式和时机。
- 关联机制，即将一个类的对象嵌入另一个对象中，由另一个对象来决定是否调用嵌入对象的行为以便扩展自己的行为，我们称这个嵌入的对象为装饰器(Decorator)

装饰模式以对客户透明的方式动态地给一个对象附加上更多的责任，换言之，客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不需要创造更多子类的情况下，将对象的功能加以扩展。这就是装饰模式的模式动机。



## 定义

装饰模式(Decorator Pattern) ：动态地给一个对象增加一些额外的职责(Responsibility)，就增加对象功能来说，装饰模式比生成子类实现更为灵活。其别名也可以称为包装器(Wrapper)，与适配器模式的别名相同，但它们适用于不同的场合。根据翻译的不同，装饰模式也有人称之为“油漆工模式”，它是一种对象结构型模式。 



## 角色

- **Component （ 抽象构件 ）**：

- **ConcreteComponent （ 具体构件 ）**：

- **Decorator （ 抽象装饰类 ）**：

- **ConcreteDecorator （ 具体装饰类 ）**：



## 类图

![](https://tva1.sinaimg.cn/large/00831rSTly1gcxwtvpenhj311t0lnacu.jpg)

再记录下 UML 类图的注意事项，这里我的 Subject 是**抽象方法**，所以用***斜体***，抽象方法也要用斜体，具体的各种箭头意义，我之前也总结过《设计模式前传——学设计模式前你要知道这些》（被网上各种帖子毒害过的自己，认真记录~~~）。

## 实例

1、定义观察者接口

```java
interface Observer {
    public void update();
}
```

2、定义被观察者

```java
abstract class Subject {
    private Vector<Observer> obs = new Vector();

    public void addObserver(Observer obs){
        this.obs.add(obs);
    }
    public void delObserver(Observer obs){
        this.obs.remove(obs);
    }
    protected void notifyObserver(){
        for(Observer o: obs){
            o.update();
        }
    }
    public abstract void doSomething();
}
```

3、具体的被观察者

```java
class ConcreteSubject extends Subject {
    public void doSomething(){
        System.out.println("被观察者事件发生改变");
        this.notifyObserver();
    }
}
```

4、具体的被观察者

```java
class ConcreteObserver1 implements Observer {
    public void update() {
        System.out.println("观察者1收到信息，并进行处理");
    }
}
class ConcreteObserver2 implements Observer {
    public void update() {
        System.out.println("观察者2收到信息，并进行处理");
    }
}
```

5、客户端

```java
public class Client {
    public static void main(String[] args){
        Subject sub = new ConcreteSubject();
        sub.addObserver(new ConcreteObserver1()); //添加观察者1
        sub.addObserver(new ConcreteObserver2()); //添加观察者2
        sub.doSomething();
    }
}
```

输出

```
被观察者事件发生改变
观察者1收到信息，并进行处理
观察者2收到信息，并进行处理
```

通过运行结果可以看到，我们只调用了 `Subject` 的方法，但同时两个观察者的相关方法都被调用了。仔细看一下代码，其实很简单，就是在 `Subject` 类中关联一下 `Observer` 类，并且在 `doSomething()` 方法中遍历一下 `Observer` 的 `update()` 方法就行了。 



## 优缺点

装饰模式的优点:

- 装饰模式与继承关系的目的都是要扩展对象的功能，但是装饰模式可以提供比继承更多的灵活性。
- 可以通过一种动态的方式来扩展一个对象的功能，通过配置文件可以在运行时选择不同的装饰器，从而实现不同的行为。
- 通过使用不同的具体装饰类以及这些装饰类的排列组合，可以创造出很多不同行为的组合。可以使用多个具体装饰类来装饰同一对象，得到功能更为强大的对象。
- 具体构件类与具体装饰类可以独立变化，用户可以根据需要增加新的具体构件类和具体装饰类，在使用时再对其进行组合，原有代码无须改变，符合“开闭原则”

装饰模式的缺点:

- 使用装饰模式进行系统设计时将产生很多小对象，这些对象的区别在于它们之间相互连接的方式有所不同，而不是它们的类或者属性值有所不同，同时还将产生很多具体装饰类。这些装饰类和小对象的产生将增加系统的复杂度，加大学习与理解的难度。
- 这种比继承更加灵活机动的特性，也同时意味着装饰模式比继承更加易于出错，排错也很困难，对于多次装饰的对象，调试时寻找错误可能需要逐级排查，较为烦琐。



## 总结

- 与继承关系相比，关联关系的主要优势在于不会破坏类的封装性，而且继承是一种耦合度较大的静态关系，无法在程序运行时动态扩展。在软件开发阶段，关联关系虽然不会比继承关系减少编码量，但是到了软件维护阶段，由于关联关系使系统具有较好的松耦合性，因此使得系统更加容易维护。当然，关联关系的缺点是比继承关系要创建更多的对象。
- 使用装饰模式来实现扩展比继承更加灵活，它以对客户透明的方式动态地给一个对象附加更多的责任。装饰模式可以在不需要创造更多子类的情况下，将对象的功能加以扩展。



## 应用

### JDK中的观察者模式

观察者模式在 Java 语言中的地位非常重要。在 JDK 的 java.util 包中，提供了 Observable 类以及 Observer 接口，它们构成了 JDK 对观察者模式的支持（可以去查看下源码，写的比较严谨）。but，在 Java9 被弃用了。

### Spring 中的观察者模式

Spring 事件驱动模型也是观察者模式很经典的应用。就是我们常见的项目中最常见的事件监听器。

#### 1. Spring 中观察者模式的四个角色

1. **事件：ApplicationEvent** 是所有事件对象的父类。ApplicationEvent 继承自 jdk 的 EventObject, 所有的事件都需要继承 ApplicationEvent, 并且通过 source 得到事件源。

   Spring 也为我们提供了很多内置事件，`ContextRefreshedEvent`、`ContextStartedEvent`、`ContextStoppedEvent`、`ContextClosedEvent`、`RequestHandledEvent`。

2. **事件监听：ApplicationListener**，也就是观察者，继承自 jdk 的 EventListener，该类中只有一个方法 onApplicationEvent。当监听的事件发生后该方法会被执行。

3. **事件源：ApplicationContext**，`ApplicationContext` 是 Spring 中的核心容器，在事件监听中 ApplicationContext 可以作为事件的发布者，也就是事件源。因为 ApplicationContext 继承自 ApplicationEventPublisher。在 `ApplicationEventPublisher` 中定义了事件发布的方法：`publishEvent(Object event)`

4. **事件管理：ApplicationEventMulticaster**，用于事件监听器的注册和事件的广播。监听器的注册就是通过它来实现的，它的作用是把 Applicationcontext 发布的 Event 广播给它的监听器列表。

#### 2. coding~~~~~~

1、定义事件

```java
public class MyEvent extends ApplicationEvent {
    public MyEvent(Object source) {
        super(source);
        System.out.println("my Event");
    }
}
```

2、实现事件监听器

```java
@Component
class MyListenerA implements ApplicationListener<MyEvent> {
    public void onApplicationEvent(MyEvent AyEvent) {
        System.out.println("ListenerA received");
    }
}

@Component
class MyListenerB implements ApplicationListener<MyEvent> {
    public void onApplicationEvent(MyEvent AyEvent) {
        System.out.println("ListenerB received");
    }
}
```

3、事件发布者

```java
@Component
public class MyPublisher implements ApplicationContextAware {
    private ApplicationContext applicationContext;
    
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext=applicationContext;
    }
    
    public void publishEvent(ApplicationEvent event){
        System.out.println("publish event");
        applicationContext.publishEvent(event);
    }
}
```

4、测试，先用注解方式将 MyPublisher 注入 Spring

```java
@Configuration
@ComponentScan
public class AppConfig {

    @Bean(name = "myPublisher")
    public MyPublisher myPublisher(){
        return new MyPublisher();
    }
}
```

```java
public class Client {

    @Test
    public void main() {
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        MyPublisher myPublisher = (MyPublisher) context.getBean("myPublisher");
        myPublisher.publishEvent(new MyEvent(this));
    }
}
```

5、输出

```
my Event
publish event
ListenerA received
ListenerB received
```




## 瞎扯

设计模式真的只是一种设计思想，不需要非得有多个观察者才可以用观察者模式，只有一个观察者，我也要用。

再举个栗子，我是做广告投放的嘛（广告投放的商品文件一般为 xml），假如我的广告位有些空闲流量，这我得利用起来呀，所以我就从淘宝客或者拼夕夕的多多客上通过开放的 API 获取一些，这个时候我也可以用观察者模式，每次请求 10 万条商品，我就生成一个新的商品文件，这个时候我也可以用观察者模式，获取商品的类是被观察者，写商品文件的是观察者，当商品够10万条了，就通知观察者重新写到一个新的文件。

大佬可能觉这么实现有点费劲，不用设计模式也好，或者用消息队列也好，其实都只是一种手段，选择适合自己业务的，开心就好。



## 参考

https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/observer.html

https://www.cnblogs.com/jmcui/p/11054756.html