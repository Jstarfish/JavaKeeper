# 观察者模式

在软件系统中经常会有这样的需求：如果一个对象的状态发生改变，某些与它相关的对象也要随之做出相应的变化。

比如，我们有一个天气预报需求，气象站可以将每天预测到的温度、湿度、气压等以公告的形式发布出去（自己的网站或第三方），如果天气数据有更新，要能够实时的通知给第三方；

再比如，我们要设计一个自动部署的功能，就像eclipse开发时，只要修改了文件，eclipse就会自动将修改的文件部署到服务器中。这两个功能有一个相似的地方，那就是一个对象要时刻监听着另一个对象，只要它的状态一发生改变，自己随之要做出相应的行动。

其实，能够实现这一点的方案很多，但是，无疑使用观察者模式是一个主流的选择。 

观察者模式也是使用频率较高的设计模式之一。

![](https://img01.sogoucdn.com/app/a/100520093/e18d20c94006dfe0-9eef65073f0f6be0-688789934e19c96097ccf76b41f77cf4.jpg)

## 定义

**观察者模式(Observer Pattern)**： 定义对象间一种一对多的依赖关系，使得当每一个对象改变状态，则所有依赖于它的对象都会得到通知并自动更新。 

观察者模式是一种**对象行为型模式**。

观察者模式的别名包括发布-订阅（Publish/Subscribe）模式、模型-视图（Model/View）模式、源-监听器（Source/Listener）模式或从属者（Dependents）模式。

观察者模式包含观察目标和观察者两类对象，一个目标可以有任意数目的与之相依赖的观察者，一旦观察目标的状态发生改变，所有的观察者都将得到通知。



## 角色

- **Subject（目标）**：被观察者，它是指被观察的对象。 从类图中可以看到，类中有一个用来存放观察者对象的Vector 容器（之所以使用Vector而不使用List，是因为多线程操作时，Vector在是安全的，而List则是不安全的），这个Vector容器是被观察者类的核心，另外还有三个方法：attach方法是向这个容器中添加观察者对象；detach方法是从容器中移除观察者对象；notify方法是依次调用观察者对象的对应方法。这个角色可以是接口，也可以是抽象类或者具体的类，因为很多情况下会与其他的模式混用，所以使用抽象类的情况比较多。 

- **ConcreteSubject（具体目标）**：具体目标是目标类的子类，通常它包含经常发生改变的数据，当它的状态发生改变时，向它的各个观察者发出通知。同时它还实现了在目标类中定义的抽象业务逻辑方法（如果有的话）。如果无须扩展目标类，则具体目标类可以省略。

- **Observer（观察者）**：观察者将对观察目标的改变做出反应，观察者一般定义为**接口**，该接口声明了更新数据的方法 `update()`，因此又称为**抽象观察者**。

- **ConcreteObserver（具体观察者）**：在具体观察者中维护一个指向具体目标对象的引用，它存储具体观察者的有关状态，这些状态需要和具体目标的状态保持一致；它实现了在抽象观察者 Observer 中定义的 update()方法。通常在实现时，可以调用具体目标类的 attach() 方法将自己添加到目标类的集合中或通过 detach() 方法将自己从目标类的集合中删除。



## 类图





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

3、具体的观察者

```java
class ConcreteSubject extends Subject {
    public void doSomething(){
        System.out.println("被观察者事件反生");
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

通过运行结果可以看到，我们只调用了Subject的方法，但同时两个观察者的相关方法都被同时调用了。仔细看一下代码，其实很简单，无非就是在Subject类中关联一下Observer类，并且在doSomething方法中遍历一下Observer的update方法就行了。 



## 优缺点

观察者与被观察者之间是属于轻度的关联关系，并且是抽象耦合的，这样，对于两者来说都比较容易进行扩展。

观察者模式是一种常用的触发机制，它形成一条触发链，依次对各个观察者的方法进行处理。但同时，这也算是观察者模式一个缺点，由于是链式触发，当观察者比较多的时候，性能问题是比较令人担忧的。并且，在链式结构中，比较容易出现循环引用的错误，造成系统假死。



## 应用

1.  观察者模式在 Java 语言中的地位非常重要。在 JDK 的 java.util 包中，提供了 Observable 类以及 Observer 接口，它们构成了 JDK 对观察者模式的支持（可以去查看下源码，写的比较严谨）
2. 



## 项目

下面的代码就比较厉害了。“东半球最大的安全公司”和“全中国最大的农村拼购平台”联合出品（em，这么说确实没错，没夸大，哈哈）。

![image-20200317153750274.png](https://i.loli.net/2020/03/17/kUBxgCQDNKi3jaE.png)

![image-20200317162346913.png](https://i.loli.net/2020/03/17/e3nIL14NaifVEhq.png)

设计模式真的只是一种设计思想，不需要非得有多个观察者才可以用观察者模式，只有一个观察者，我也要用。

需求：比如我的网站想放一些广告位，所以我从淘宝的淘宝客，拼夕夕的多多客

## 参考