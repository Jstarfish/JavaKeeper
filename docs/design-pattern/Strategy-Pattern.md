# 策略模式——略施小计就彻底消除了多重 if else

> 最近接手了一个新项目，有段按不同类型走不同检验逻辑的代码，将近小 10 个 `if -else` 判断，真正的“屎山”代码。
>
> 所以在项目迭代的时候，就打算重构一下，写设计方案后，刚好再总结总结策略模式。
>
> 先贴个阿里的《 Java 开发手册》中的一个规范

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/design-pattern/ali-strategy.png) 

我们先不探讨其他方式，主要讲策略模式。



## 定义

**策略模式**：封装可以互换的行为，并使用委托来决定要使用哪一个。

策略模式是一种**行为设计模式**， 它能让你定义一系列算法， 并将每种算法分别放入独立的类中， 以使算法的对象能够相互替换。

> 用人话翻译后就是：运行时我给你这个类的方法传不同的 “key”，你这个方法会执行不同的业务逻辑。
>
> 细品一下，这不就是 if else 干的事吗？



先直观的看下传统的多重  `if else` 代码

```java
public String getCheckResult(String type) {
  if ("校验1".equals(type)) {
    return "执行业务逻辑1";
  } else if ("校验2".equals(type)) {
    return "执行业务逻辑2";
  } else if ("校验3".equals(type)) {
    return "执行业务逻辑3";
  } else if ("校验4".equals(type)) {
    return "执行业务逻辑4";
  } else if ("校验5".equals(type)) {
    return "执行业务逻辑5";
  } else if ("校验6".equals(type)) {
    return "执行业务逻辑6";
  } else if ("校验7".equals(type)) {
    return "执行业务逻辑7";
  } else if ("校验8".equals(type)) {
    return "执行业务逻辑8";
  } else if ("校验9".equals(type)) {
    return "执行业务逻辑9";
  }
  return "不在处理的逻辑中返回业务错误";
}
```

这么看，你要是还觉得挺清晰的话，想象下这些 return 里是各种复杂的业务逻辑方法~~

![](https://img03.sogoucdn.com/app/a/100520093/e18d20c94006dfe0-0381536966d1161a-7f08208216d08261f99e84e5bf306d20.jpg)

网上的示例很多，比如不同路线的规划、不同支付方式的选择 都是典型的 if else 问题，也都是典型的策略模式问题，我们先看下策略模式的类图~



## 类图

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/design-pattern/strategy-pattern.jpg)

策略模式涉及到三个角色：

- **Strategy**：策略接口或者策略抽象类，并且策略执行的接口（Context 使用这个接口来调用具体的策略实现算法）
- **ConcreateStrategy**：实现策略接口的具体策略类
- **Context**：上下文类，持有具体策略类的实例，并负责调用相关的算法



应用策略模式来解决问题的思路

## 实例

先看看最简单的策略模式 demo:

1、策略接口

```java
public interface Strategy {
    void operate();
}
```

2、具体的算法实现

```java
public class ConcreteStrategyA implements Strategy {
    @Override
    public void operate() {
        //具体的算法实现
        System.out.println("执行业务逻辑A");
    }
}

public class ConcreteStrategyB implements Strategy {
    @Override
    public void operate() {
        //具体的算法实现
        System.out.println("执行业务逻辑B");
    }
}
```

3、上下文的实现

```java
public class Context {

    //持有一个具体的策略对象
    private Strategy strategy;

    //构造方法，传入具体的策略对象
    public Context(Strategy strategy){
        this.strategy = strategy;
    }

    public void doSomething(){
        //调用具体的策略对象进操作
        strategy.operate();
    }
}
```

4、客户端使用

```java
public static void main(String[] args) {
  Context context = new Context(new ConcreteStrategyA());
  context.doSomething();
}
```



## 解析策略模式

策略模式的功能就是把具体的算法实现从具体的业务处理中独立出来，把它们实现成单独的算法类，从而形成一系列算法，并让这些算法可以互相替换。

> 策略模式的重心不是如何来实现算法，而是如何组织、调用这些算法，从而让程序结构更灵活，具有更好的维护性和扩展性。



实际上，每个策略算法具体实现的功能，就是原来在 if-else 结构中的具体实现，每个 if-else 语句都是一个平等的功能结构，可以说是兄弟关系。

策略模式呢，就是把各个平等的具体实现封装到单独的策略实现类了，然后通过上下文与具体的策略类进行交互

所以说，策略模式只是在代码结构上的一个调整，

 『 **策略模式 = 实现策略接口（或抽象类）的每个策略类 + 上下文的逻辑分派** 』

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/design-pattern/if-else.jpg)

> 策略模式的本质：分离算法，选择实现  ——《研磨设计模式》

即使用了策略模式，你该写的业务逻辑照常写，到逻辑分派的时候，只是变相的 `if-else`。

而它的优化点是抽象了出了接口，将业务逻辑封装成一个一个的实现类，任意地替换。在复杂场景（业务逻辑较多）时比直接 `if-else` 更好维护和扩展些。



### 谁来选择具体的策略算法

如果你手写了上边的 demo，就会发现，这玩意不及 `if-else` 来的顺手，尤其是在判断逻辑的时候，每个逻辑都要要构造一个上下文对象，费劲。

其实，策略模式中，我们可以自己定义谁来选择具体的策略算法，有两种：

- 客户端：当使用上下文时，由客户端选择，像我们的 demo
- 上下文：客户端不用选，由上下文选



### 优缺点

#### 优点：

- 定义一系列算法：策略模式的功能就是定义一系列算法，实现让这些算法可以相互替换，所以为这一系列算法定义公共的接口，以约束一系列算法要实现的功能。如果这一系列算法具有公共功能，可以把策略接口实现为抽象类，把这些公共功能实现到父类
- 避免多重条件语句：也就是避免大量的 `if-else`
- 更好的扩展性（完全符合开闭原则）：策略模式中扩展新的策略实现很容易，无需对上下文修改，只增加新的策略实现类就可以

#### 缺点：

- 客户必须了解每种策略的不同
- 增加了对象数：每个具体策略都封装成了类，可能备选的策略会很多
- 只适合扁平的算法结构：



### 适用场景

> 策略模式的本质：分离算法，选择实现

- 当你想使用对象中各种不同的算法变体， 并希望能在运行时切换算法时，可使用策略模式。

- 当你有许多仅在执行某些行为时略有不同的相似类时（它们之间的区别仅在于它们的行为），使用策略模式可以动态地让一个对象在许多行为中选择一种行为

- 如果算法在上下文的逻辑中不是特别重要， 使用该模式能将类的业务逻辑与其算法实现细节隔离开来。

   策略模式让你能将各种算法的代码、 内部数据和依赖关系与其他代码隔离开来。 不同客户端可通过一个简单接口执行算法， 并能在运行时进行切换。

- **当类中使用了复杂条件运算符以在同一算法的不同变体中切换时，可使用该模式**

  - 策略模式将所有继承自同样接口的算法抽取到独立类中， 因此不再需要条件语句。 原始对象并不实现所有算法的变体， 而是将执行工作委派给其中的一个独立算法对象。



实际使用中，往往不会只是单一的某个设计模式的套用，一般都会混合使用，而且模式之间的结合也是没有定势的，要具体问题具体分析。

策略模式往往会结合其他模式一起使用，

### 策略模式在 JDK 中的应用

#### 策略模式在 Spring 中的应用

https://mp.weixin.qq.com/s?__biz=MzAxODcyNjEzNQ==&mid=2247487480&idx=2&sn=461a012afd41d4e2466a9024b81b6e39&chksm=9bd0a260aca72b760e429753beb1fa12270c18b5cc6829538ccbfefcc23214fefc0aadd575c8&scene=27#wechat_redirect



最后：

并不是说，看到if-else 就想着用策略模式去优化，业务逻辑简单，可能几个枚举，或者几个卫语句就搞定的场景，就不用非得硬套设计模式了，杀鸡焉用牛刀，是吧，可以看看参考文章第一篇



参考与感谢：

- [《用 Map + 函数式接口来实现策略模式》](https://www.cnblogs.com/keeya/p/13187727.html)
- 《研磨设计模式》

