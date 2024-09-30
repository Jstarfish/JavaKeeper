# 模板方法模式——看看 JDK 和 Spring 是如何优雅复用代码的

> 文章收录在 GitHub [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱

## 前言

模板，顾名思义，它是一个固定化、标准化的东西。

**模板方法模式**是一种行为设计模式， 它在超类中定义了一个算法的框架， 允许子类在不修改结构的情况下重写算法的特定步骤。

## 场景问题

程序员不愿多扯，上来先干两行代码

网上模板方法的场景示例特别多，个人感觉还是《Head First 设计模式》中的例子比较好。

假设我们是一家饮品店的师傅，起码需要以下两个手艺

![img](https://static001.geekbang.org/infoq/19/196f4c041c71d63442c2c688051c893a.jpeg)

真简单哈，这么看，步骤大同小异，我的第一反应就是写个业务接口，不同的饮品实现其中的方法就行，像这样

![img](https://static001.geekbang.org/infoq/a2/a226b8a9219cd7a29af2f3b626cd5fcb.jpeg)



画完类图，猛地发现，第一步和第三步没什么差别，而且做饮品是个流程式的工作，我希望使用时，直接调用一个方法，就去执行对应的制作步骤。

灵机一动，不用接口了，用一个**抽象父类**，把步骤方法放在一个大的流程方法 `makingDrinks()` 中，且第一步和第三步，完全一样，没必要在子类实现，改进如下

![img](https://static001.geekbang.org/infoq/21/2146409c43149828b8a12949daf5b0a4.jpeg)

再看下我们的设计，感觉还不错，现在用同一个 `makingDrinks()` 方法来处理咖啡和茶的制作，而且我们不希望子类覆盖这个方法，所以可以申明为 final，不同的制作步骤，我们希望子类来提供，必须在父类申明为抽象方法，而第一步和第三步我们不希望子类重写，所以我们声明为非抽象方法

```java
public abstract class Drinks {

    void boilWater() {
        System.out.println("将水煮沸");
    }

    abstract void brew();

    void pourInCup() {
        System.out.println("倒入杯子");
    }

    abstract void addCondiments();
    
    public final void makingDrinks() {
        //热水
        boilWater();
        //冲泡
        brew();
        //倒进杯子
        pourInCup();
        //加料
        addCondiments();
    }
}
```

接着，我们分别处理咖啡和茶，这两个类只需要**继承**父类，重写其中的抽象方法即可（实现各自的冲泡和添加调料）

```java
public class Tea extends Drinks {
    @Override
    void brew() {
        System.out.println("冲茶叶");
    }
    @Override
    void addCondiments() {
        System.out.println("加柠檬片");
    }
}
```

```java
public class Coffee extends Drinks {
    @Override
    void brew() {
        System.out.println("冲咖啡粉");
    }

    @Override
    void addCondiments() {
        System.out.println("加奶加糖");
    }
}
```

现在可以上岗了，试着制作下咖啡和茶吧

```java
public static void main(String[] args) {
    Drinks coffee = new Coffee();
    coffee.makingDrinks();
    System.out.println();
    Drinks tea = new Tea();
    tea.makingDrinks();
}
```

好嘞，又学会一个设计模式，这就是**模板方法模式**，我们的 `makingDrinks()` 就是模板方法。我们可以看到相同的步骤 `boilWater()` 和 `pourInCup()` 只在父类中进行即可，不同的步骤放在子类实现。



## 认识模板方法

在阎宏博士的《JAVA与模式》一书中开头是这样描述模板方法（Template Method）模式的：

> 模板方法模式是类的行为模式。准备一个抽象类，将部分逻辑以具体方法以及具体构造函数的形式实现，然后声明一些抽象方法来迫使子类实现剩余的逻辑。不同的子类可以以不同的方式实现这些抽象方法，从而对剩余的逻辑有不同的实现。这就是模板方法模式的用意。

写代码的一个很重要的思考点就是“**变与不变**”，程序中哪些功能是可变的，哪些功能是不变的，我们可以把不变的部分抽象出来，进行公共的实现，把变化的部分分离出来，用接口来封装隔离，或用抽象类约束子类行为。模板方法就很好的体现了这一点。

模板方法定义了一个算法的步骤，并允许子类为一个或多个步骤提供实现。

模板方法模式是所有模式中最为常见的几个模式之一，是**基于继承**的代码复用的基本技术，我们再看下类图

![img](https://static001.geekbang.org/infoq/b1/b114ec408fb0231529d8748618df9ed7.jpeg)

模板方法模式就是用来创建一个算法的模板，这个模板就是方法，该方法将算法定义成一组步骤，其中的任意步骤都可能是抽象的，由子类负责实现。这样可以**确保算法的结构保持不变，同时由子类提供部分实现**。



再回顾下我们制作咖啡和茶的例子，有些顾客要不希望咖啡加糖或者不希望茶里加柠檬，我们要改造下模板方法，在加相应的调料之前，问下顾客

```java
public abstract class Drinks {

    void boilWater() {
        System.out.println("将水煮沸");
    }

    abstract void brew();

    void pourInCup() {
        System.out.println("倒入杯子");
    }

    abstract void addCondiments();

    public final void makingDrinks() {
        boilWater();
        brew();
        pourInCup();

        //如果顾客需要，才加料
        if (customerLike()) {
            addCondiments();
        }
    }

    //定义一个空的缺省方法，只返回 true
    boolean customerLike() {
        return true;
    }
}
```

如上，我们加了一个逻辑判断，逻辑判断的方法是一个只返回 true 的方法，这个方法我们叫做 **钩子方法**。

> 钩子：在模板方法的父类中，我们可以定义一个方法，它默认不做任何事，子类可以视情况要不要覆盖它，该方法称为“钩子”。

钩子方法一般是空的或者有默认实现。钩子的存在，可以让子类有能力对算法的不同点进行挂钩。而要不要挂钩，又由子类去决定。

是不是很有用呢，我们再看下咖啡的制作

```java
public class Coffee extends Drinks {
    @Override
    void brew() {
        System.out.println("冲咖啡粉");
    }

    @Override
    void addCondiments() {
        System.out.println("加奶加糖");
    }
	//覆盖了钩子，提供了自己的询问功能，让用户输入是否需要加料
    boolean customerLike() {
        String answer = getUserInput();
        if (answer.toLowerCase().startsWith("y")) {
            return true;
        } else {
            return false;
        }
    }

    //处理用户的输入
    private String getUserInput() {
        String answer = null;
        System.out.println("您想要加奶加糖吗？输入 YES 或 NO");
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        try {
            answer = reader.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (answer == null) {
            return "no";
        }
        return answer;
    }
}
```

接着再去测试下代码，看看结果吧。

![img](https://static001.geekbang.org/infoq/e6/e608360ad552adc44dab00293fddd671.jpeg)



我想你应该知道钩子的好处了吧，它可以作为条件控制，影响抽象类中的算法流程，当然也可以什么都不做。



模板方法有很多种实现，有时看起来可能不是我们所谓的“中规中矩”的设计。接下来我们看下 JDK 和 Spring 中是怎么使用模板方法的。

### JDK 中的模板方法

我们写代码经常会用到 **comparable** 比较器来对数组对象进行排序，我们都会实现它的 `compareTo()` 方法，之后就可以通过 `Collections.sort()` 或者 `Arrays.sort()` 方法进行排序了。

具体的实现类就不写了(可以去 github：starfish-learning 上看我的代码)，看下使用

```java
@Override
public int compareTo(Object o) {
    Coffee coffee = (Coffee) o;
    if(this.price < (coffee.price)){
        return -1;
    }else if(this.price == coffee.price){
        return 0;
    }else{
        return 1;
    }
}
```

```java
public static void main(String[] args) {
  Coffee[] coffees = {new Coffee("星冰乐",38),
                      new Coffee("拿铁",32),
                      new Coffee("摩卡",35)};
 
  Arrays.sort(coffees);

  for (Coffee coffee1 : coffees) {
    System.out.println(coffee1);
  }

}
```

![img](https://static001.geekbang.org/infoq/92/9241c28ee542321b3e6f4e2a2fbf805a.jpeg)

你可能会说，这个看着不像我们常规的模板方法，是的。我们看下比较器实现的步骤

1. 构建对象数组
2. 通过 `Arrays.sort` 方法对数组排序，传参为 `Comparable` 接口的实例
3. 比较时候会调用我们的实现类的 `compareTo()` 方法
4. 将排好序的数组设置进原数组中，排序完成

一脸懵逼，这个实现竟然也是模板方法。

这个模式的重点在于提供了一个固定算法框架，并让子类实现某些步骤，虽然使用继承是标准的实现方式，但通过回调来实现，也不能说这就不是模板方法。

其实并发编程中最常见，也是面试必问的 AQS 就是一个典型的模板方法。



### Spring 中的模板方法

Spring 中的设计模式太多了，而且大部分扩展功能都可以看到模板方法模式的影子。

我们看下 IOC 容器初始化时的模板方法，不管是 XML 还是注解的方式，对于核心容器启动流程都是一致的。

`AbstractApplicationContext` 的 `refresh` 方法实现了 IOC 容器启动的主要逻辑。

一个 `refresh()` 方法包含了好多其他步骤方法，像不像我们说的 **模板方法**，`getBeanFactory()` 、`refreshBeanFactory()` 是子类必须实现的抽象方法，`postProcessBeanFactory()` 是钩子方法。

```java
public abstract class AbstractApplicationContext extends DefaultResourceLoader
      implements ConfigurableApplicationContext {
	@Override
	public void refresh() throws BeansException, IllegalStateException {
		synchronized (this.startupShutdownMonitor) {
			prepareRefresh();
			ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
			prepareBeanFactory(beanFactory);
            postProcessBeanFactory(beanFactory);
            invokeBeanFactoryPostProcessors(beanFactory);
            registerBeanPostProcessors(beanFactory);
            initMessageSource();
            initApplicationEventMulticaster();
            onRefresh();
            registerListeners();
            finishBeanFactoryInitialization(beanFactory);
            finishRefresh();
		}
	}
    // 两个抽象方法
    @Override
	public abstract ConfigurableListableBeanFactory getBeanFactory() throws 		IllegalStateException;	
    
    protected abstract void refreshBeanFactory() throws BeansException, IllegalStateException;
    
    //钩子方法
    protected void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
	}
 }
```

打开你的 IDEA，我们会发现常用的 `ClassPathXmlApplicationContext` 和 `AnnotationConfigApplicationContext` 启动入口，都是它的实现类（子类的子类的子类的...）。

`AbstractApplicationContext` 的一个子类 `AbstractRefreshableWebApplicationContext` 中有钩子方法 `onRefresh() ` 的实现：

```java
public abstract class AbstractRefreshableWebApplicationContext extends …… {
    /**
	 * Initialize the theme capability.
	 */
	@Override
	protected void onRefresh() {
		this.themeSource = UiApplicationContextUtils.initThemeSource(this);
	}
}
```

看下大概的类图：

![img](https://static001.geekbang.org/infoq/13/1360f5528a2e86e5b0d0bf3a97b3c04b.jpeg)



## 小总结

**优点**：1、封装不变部分，扩展可变部分。 2、提取公共代码，便于维护。 3、行为由父类控制，子类实现。

**缺点**：每一个不同的实现都需要一个子类来实现，导致类的个数增加，使得系统更加庞大。

**使用场景**： 1、有多个子类共有的方法，且逻辑相同。 2、重要的、复杂的方法，可以考虑作为模板方法。

**注意事项**：为防止恶意操作，一般模板方法都加上 final 关键词。



## 参考：

《Head First 设计模式》、《研磨设计模式》

https://sourcemaking.com/design_patterns/template_method
