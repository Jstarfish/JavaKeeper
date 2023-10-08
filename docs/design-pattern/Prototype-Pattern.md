---
title: 从原型模型到浅拷贝和深拷贝
date: 2023-09-12
tags: 
 - Design Pattern
categories: Design Pattern
---

![](https://img.starfish.ink/design-pattern/banner-prototype.jpg)

> 如果你有一个对象， 并希望生成与其完全相同的一个复制品， 你该如何实现呢？ 
>
> 首先， 你必须新建一个属于相同类的对象。 然后， 你必须遍历原始对象的所有成员变量， 并将成员变量值复制到新对象中。

![](https://img.starfish.ink/design-pattern/format.png)

```java
for (int i = 0; i < 10; i++) {
  Sheep sheep = new Sheep("肖恩"+i+"号",2+i,"白色");
  System.out.println(sheep.toString());
}
```

这种方式是比较容易想到的，但是有几个不足

- 在创建新对象的时候，总是需要重新获取原始对象的属性，如果创建的对象比较复杂，效率会很低
- 总是需要重新初始化对象，而不是动态地获得对象运行时的状态, 不够灵活
- 另一方面，并非所有对象都能通过这种方式进行复制， 因为有些对象可能拥有私有成员变量， 它们在对象本身以外是不可见的

> 万物兼对象的 Java 中的所有类的根类 Object，提供了一个 `clone()` 方法，该方法可以将一个 Java 对象复制一份，但是需要实现 clone() 的类必须要实现一个接口 Cloneable，该接口表示该类能够复制且具有复制的能力。
>
> 这就引出了原型模式。



## 基本介绍

1. 原型模式(Prototype模式)是指：用原型实例指定创建对象的种类，并且通过拷贝这些原型，创建新的对象
2. **原型模式**是一种**创建型设计模式**， 使你能够复制已有对象， 而又无需使代码依赖它们所属的类
3. 工作原理是：通过将一个原型对象传给那个要发动创建的对象，这个要发动创建的对象通过请求原型对象拷贝它们自己来实施创建，即 对象**.clone**()

### 类图

![](https://img.starfish.ink/design-pattern/prototype-UML.png)

- Prototype : **原型** （Prototype） 接口将对克隆方法进行声明

  Java 中 Prototype 类需要具备以下两个条件

  - **实现 Cloneable 接口**。在 Java 语言有一个 Cloneable 接口，它的作用只有一个，就是在运行时通知虚拟机可以安全地在实现了此接口的类上使用 clone 方法。在 Java 虚拟机中，只有实现了这个接口的类才可以被拷贝，否则在运行时会抛出 CloneNotSupportedException 异常
  - **重写 Object 类中的 clone 方法**。Java 中，所有类的父类都是 Object 类，Object 类中有一个 clone 方法，作用是返回对象的一个拷贝

- ConcretePrototype：**具体原型** （Concrete Prototype） 类将实现克隆方法。 除了将原始对象的数据复制到克隆体中之外， 该方法有时还需处理克隆过程中的极端情况， 例如克隆关联对象和梳理递归依赖等等。

- Client: 使用原型的客户端，首先要获取到原型实例对象，然后通过原型实例克隆自己，从而创建一个新的对象。



## 实例

> 我们用王二小放羊的例子写这个实例

### 1、原型类（实现 *Clonable*）

```java
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
class Sheep implements Cloneable {
    private String name;
    private Integer age;
    private String color;

    @Override
    protected Sheep clone() {
        Sheep sheep = null;
        try {
            sheep = (Sheep) super.clone();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return sheep;
    }
}
```

### 2、具体原型

按业务的不同实现不同的原型对象，假设现在主角是王二小，羊群里有山羊、绵羊一大群

```java
public class Goat extends Sheep{
    public void graze() {
        System.out.println("山羊去吃草");
    }
}
```

```java
public class Lamb extends Sheep{
    public void graze() {
        System.out.println("羔羊去吃草");
    }
}
```

### 3、客户端

```java
public class Client {

    static List<Sheep> sheepList = new ArrayList<>();
    public static void main(String[] args) {
        Goat goat = new Goat();
        goat.setName("山羊");
        goat.setAge(3);
        goat.setColor("灰色");
        for (int i = 0; i < 5; i++) {
            sheepList.add(goat.clone());
        }

        Lamb lamb = new Lamb();
        lamb.setName("羔羊");
        lamb.setAge(2);
        lamb.setColor("白色");
        for (int i = 0; i < 5; i++) {
            sheepList.add(lamb.clone());
            System.out.println(lamb.hashCode()+","+lamb.clone().hashCode());
        }

        for (Sheep sheep : sheepList) {
            System.out.println(sheep.toString());
        }
}
```



原型模式将克隆过程委派给被克隆的实际对象。 模式为所有支持克隆的对象声明了一个通用接口， 该接口让你能够克隆对象，同时又无需将代码和对象所属类耦合。 通常情况下，这样的接口中仅包含一个 `克隆`方法。

所有的类对 `克隆`方法的实现都非常相似。 该方法会创建一个当前类的对象， 然后将原始对象所有的成员变量值复制到新建的类中。 你甚至可以复制私有成员变量， 因为绝大部分编程语言都允许对象访问其同类对象的私有成员变量。

支持克隆的对象即为*原型*。 当你的对象有几十个成员变量和几百种类型时， 对其进行克隆甚至可以代替子类的构造。



## 优势

**使用原型模式创建对象比直接 new 一个对象在性能上要好的多，因为 Object 类的 clone 方法是一个本地方法，它直接操作内存中的二进制流，特别是复制大对象时，性能的差别非常明显**。

使用原型模式的另一个好处是简化对象的创建，使得创建对象就像我们在编辑文档时的复制粘贴一样简单。

因为以上优点，所以在需要重复地创建相似对象时可以考虑使用原型模式。比如需要在一个循环体内创建对象，假如对象创建过程比较复杂或者循环次数很多的话，使用原型模式不但可以简化创建过程，而且可以使系统的整体性能提高很多。



## 适用场景

[《Head First 设计模式》]("Head First 设计模式")是这么形容原型模式的：当创建给定类的实例的过程很昂贵或很复杂时，就是用原型模式。

如果你需要复制一些对象，同时又希望代码独立于这些对象所属的具体类，可以使用原型模式。

如果子类的区别仅在于其对象的初始化方式， 那么你可以使用该模式来减少子类的数量。别人创建这些子类的目的可能是为了创建特定类型的对象。



## 原型模式在 Spring 中的应用

我们都知道 Spring bean 默认是单例的，但是有些场景可能需要原型范围，如下

```xml
<bean id="sheep" class="priv.starfish.prototype.Sheep" scope="prototype">
   <property name="name" value="肖恩"/>
   <property name="age" value="2"/>
   <property name="color" value="白色"/>
</bean>
```

同样，王二小还是有 10 只羊，感兴趣的也可以看下他们创建的对象是不是同一个

```java
public class Client {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        for (int i = 0; i < 10; i++) {
            Object bean = context.getBean("sheep");
            System.out.println(bean);
        }
    }
}
```

感兴趣的同学可以深入源码看下具体的实现，在 AbstractBeanFactory 的 `doGetBean()` 方法中

![](https://img.starfish.ink/design-pattern/prototype-demo-doGetBean.png)



## 原型模式的注意事项

- 使用原型模式复制对象不会调用类的构造方法。因为对象的复制是通过调用 Object 类的 clone 方法来完成的，它直接在内存中复制数据，因此不会调用到类的构造方法。不但构造方法中的代码不会执行，甚至连访问权限都对原型模式无效。还记得单例模式吗？单例模式中，只要将构造方法的访问权限设置为 private 型，就可以实现单例。但是 clone 方法直接无视构造方法的权限，所以，**单例模式与原型模式是冲突的**，在使用时要特别注意。
- 深拷贝与浅拷贝。Object 类的 clone方法只会拷贝对象中的基本的数据类型，对于数组、容器对象、引用对象等都不会拷贝，这就是浅拷贝。如果要实现深拷贝，必须将原型模式中的数组、容器对象、引用对象等另行拷贝。



## 浅拷贝和深拷贝

首先需要明白，浅拷贝和深拷贝都是针对一个已有对象的操作。

在 Java 中，除了**基本数据类型**（元类型）之外，还存在 **类的实例对象** 这个引用数据类型。而一般使用 『 **=** 』号做赋值操作的时候。对于基本数据类型，实际上是拷贝的它的值，但是对于对象而言，其实赋值的只是这个对象的引用，将原对象的引用传递过去，他们实际上还是指向的同一个对象。

而浅拷贝和深拷贝就是在这个基础之上做的区分，如果在拷贝这个对象的时候，只对基本数据类型进行了拷贝，而对引用数据类型只是进行了引用的传递，而没有真实的创建一个新的对象，则认为是**浅拷贝**。反之，在对引用数据类型进行拷贝的时候，创建了一个新的对象，并且复制其内的成员变量，则认为是**深拷贝**。

> 所谓的浅拷贝和深拷贝，只是在拷贝对象的时候，对 **类的实例对象** 这种引用数据类型的不同操作而已

### 浅拷贝

1. 对于数据类型是基本数据类型的成员变量，浅拷贝会直接进行值传递，也就是将该属性值复制一份给新的对象。 

2. 对于数据类型是引用数据类型的成员变量，比如说成员变量是某个数组、某个类的对象等，那么浅拷贝会进行引用传递，也就是只是将该成员变量的引用值(内存地址)复制一份给新的对象。因为实际上两个对象的该成员变量都指向同一个实例。在这种情况下，在一个对象中修改该成员变量会影响到另一个对象的该成员变量值

3. 前面我们克隆羊就是浅拷贝，如果我们在 Sheep 中加一个对象类型的属性，`public Sheep child;`可以看到 s 和 s1 的 friend 是同一个。

   ```java
   Sheep s = new Sheep();
   s.setName("sss");
   
   s.friend = new Sheep();
   s.friend.setName("喜洋洋");
   
   Sheep s1 = s.clone();
   System.out.println(s == s1);
   System.out.println(s.hashCode()+"---"+s.clone().hashCode());
   
   System.out.println(s.friend == s1.friend);
   System.out.println(s.friend.hashCode() + "---" +s1.friend.hashCode());
   ```

   ```
   false
   621009875---1265094477
   true
   2125039532---2125039532
   ```

### 深拷贝

现在我们知道 clone() 方法，只能对当前对象进行浅拷贝，引用类型依然是在传递引用。那如何进行一个深拷贝呢？

常见的深拷贝实现方式有两种：

1. 重写 **clone** 方法来实现深拷贝
2. 通过对象序列化实现深拷贝

浅拷贝和深拷贝只是相对的，如果一个对象内部只有基本数据类型，那用 `clone()` 方法获取到的就是这个对象的深拷贝，而如果其内部还有引用数据类型，那用 `clone()` 方法就是一次浅拷贝的操作。