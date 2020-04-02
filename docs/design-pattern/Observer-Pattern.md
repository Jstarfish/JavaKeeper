> 文章收录在 GitHub [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱

在软件系统中经常会有这样的需求：如果一个对象的状态发生改变，某些与它相关的对象也要随之做出相应的变化。

![img](https://i04piccdn.sogoucdn.com/56adb9635c84ff9f)

- 微信公众号，如果一个用户订阅了某个公众号，那么便会收到公众号发来的消息，那么，公众号就是『被观察者』，而用户就是『观察者』
- 气象站可以将每天预测到的温度、湿度、气压等以公告的形式发布给各种第三方网站，如果天气数据有更新，要能够实时的通知给第三方，这里的气象局就是『被观察者』，第三方网站就是『观察者』
- MVC 模式中的模型与视图的关系也属于观察与被观察

观察者模式是使用频率较高的设计模式之一。

![](https://img01.sogoucdn.com/app/a/100520093/e18d20c94006dfe0-9eef65073f0f6be0-688789934e19c96097ccf76b41f77cf4.jpg)

观察者模式包含观察目标和观察者两类对象，一个目标可以有任意数目的与之相依赖的观察者，一旦观察目标的状态发生改变，所有的观察者都将得到通知。



## 定义

**观察者模式(Observer Pattern)**： 定义对象间一种一对多的依赖关系，使得当每一个对象改变状态，则所有依赖于它的对象都会得到通知并自动更新。 

观察者模式是一种**对象行为型模式**。

观察者模式的别名包括发布-订阅（Publish/Subscribe）模式、模型-视图（Model/View）模式、源-监听器（Source/Listener）模式或从属者（Dependents）模式。

细究的话，发布订阅和观察者有些不同，可以理解成发布订阅模式属于广义上的观察者模式。

![img](https://tva1.sinaimg.cn/large/00831rSTly1gcyfkrn2s3j30ip0badgh.jpg)

## 角色

- **Subject（目标）**：被观察者，它是指被观察的对象。 从类图中可以看到，类中有一个用来存放观察者对象的Vector 容器（之所以使用Vector而不使用List，是因为多线程操作时，Vector在是安全的，而List则是不安全的），这个Vector容器是被观察者类的核心，另外还有三个方法：attach方法是向这个容器中添加观察者对象；detach方法是从容器中移除观察者对象；notify方法是依次调用观察者对象的对应方法。这个角色可以是接口，也可以是抽象类或者具体的类，因为很多情况下会与其他的模式混用，所以使用抽象类的情况比较多。 

- **ConcreteSubject（具体目标）**：具体目标是目标类的子类，通常它包含经常发生改变的数据，当它的状态发生改变时，向它的各个观察者发出通知。同时它还实现了在目标类中定义的抽象业务逻辑方法（如果有的话）。如果无须扩展目标类，则具体目标类可以省略。

- **Observer（观察者）**：观察者将对观察目标的改变做出反应，观察者一般定义为**接口**，该接口声明了更新数据的方法 `update()`，因此又称为**抽象观察者**。

- **ConcreteObserver（具体观察者）**：在具体观察者中维护一个指向具体目标对象的引用，它存储具体观察者的有关状态，这些状态需要和具体目标的状态保持一致；它实现了在抽象观察者 Observer 中定义的 update()方法。通常在实现时，可以调用具体目标类的 attach() 方法将自己添加到目标类的集合中或通过 detach() 方法将自己从目标类的集合中删除。



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

4、具体的观察者

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

#### 优点

- 降低了目标与观察者之间的耦合关系，两者之间是抽象耦合关系
- 目标与观察者之间建立了一套触发机制
- 支持广播通信
- 符合“开闭原则”的要求

#### 缺点

- 目标与观察者之间的依赖关系并没有完全解除，而且有可能出现循环引用
- 当观察者对象很多时，通知的发布会花费很多时间，影响程序的效率



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



![](https://user-gold-cdn.xitu.io/2020/3/20/170f5beacffbc730?w=750&h=390&f=jpeg&s=29031)