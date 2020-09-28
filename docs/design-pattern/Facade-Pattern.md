# 外观模式

之前介绍过装饰者模式和适配器模式，我们知道适配器模式是如何将一个类的接口转换成另一个符合客户期望的接口的。但 Java 中要实现这一点，必须将一个不兼容接口的对象包装起来，变成兼容的对象。

- 装饰模式：不改变接口，但加入责任
- 适配器模式：将一个接口转换为另一个接口
- 外观模式：让接口更简单



## 问题

假设你必须在代码中使用某个复杂的库或框架中的众多对象。 正常情况下，你需要负责所有对象的初始化工作、 管理其依赖关系并按正确的顺序执行方法等。

最终， 程序中类的业务逻辑将与第三方类的实现细节紧密耦合， 使得理解和维护代码的工作很难进行。 



外观类为包含许多活动部件的复杂子系统提供一个简单的接口。 与直接调用子系统相比， 外观提供的功能可能比较有限， 但它却包含了客户端真正关心的功能。

如果你的程序需要与包含几十种功能的复杂库整合， 但只需使用其中非常少的功能， 那么使用外观模式会非常方便。



## 真实世界类比

当你通过电话给商店下达订单时， 接线员就是该商店的所有服务和部门的外观。 接线员为你提供了一个同购物系统、 支付网关和各种送货服务进行互动的简单语音接口。

![电话购物的示例](https://refactoringguru.cn/images/patterns/diagrams/facade/live-example-zh.png)





## 外观模式结构

![外观设计模式的结构](https://refactoringguru.cn/images/patterns/diagrams/facade/structure.png)

- **外观** （Facade） 提供了一种访问特定子系统功能的便捷方式， 其了解如何重定向客户端请求， 知晓如何操作一切活动部件。

- 创建**附加外观** （Additional Facade） 类可以避免多种不相关的功能污染单一外观， 使其变成又一个复杂结构。 客户端和其他外观都可使用附加外观。

- **复杂子系统** （Complex Subsystem） 由数十个不同对象构成。 如果要用这些对象完成有意义的工作， 你必须深入了解子系统的实现细节， 比如按照正确顺序初始化对象和为其提供正确格式的数据。

  子系统类不会意识到外观的存在， 它们在系统内运作并且相互之间可直接进行交互。

- **客户端** （Client） 使用外观代替对子系统对象的直接调用。



#### Coding

Java 虽然不能实现标准的类适配器，但是有一种变通的方式，也能够使用继承来实现接口的适配，那就是让适配器去实现 Target 的接口，然后继承 Adaptee 的实现，虽然不是十分标准，但意思差不多。

1. 首先有一个已存在的将被适配的类

   ```java
   public class Adaptee {
       public void adapteeRequest() {
           System.out.println("被适配者的方法");
       }
   }
   ```

2. 定义客户端使用的接口，与业务相关

   ```java
   public interface Target {
   
       void request();
   }
   ```

3. 怎么才可以在目标接口中的 `request()` 调用 `Adaptee` 的 `adapteeRequest()` 方法呢？直接实现 `Target` 肯定是不行的，所以我们通过一个适配器类，实现 `Target` 接口，同时继承了 `Adaptee` 类，然后在实现的 `request()` 方法中调用父类的 `adapteeRequest()` 即可

   ```java
   public class Adapter extends Adaptee implements Target{
       @Override
       public void request() {
           //...一些操作...
           super.adapteeRequest();
           //...一些操作...
       }
   }
   ```

4. 使用适配器的客户端

   ```java
   public class Client {
       public static void main(String[] args) {
   
           Target adapterTarget = new Adapter();
           adapterTarget.request();
       }
   }
   ```




## 外观模式适合应用场景

如果你需要一个指向复杂子系统的直接接口， 且该接口的功能有限， 则可以使用外观模式。

子系统通常会随着时间的推进变得越来越复杂。 即便是应用了设计模式， 通常你也会创建更多的类。 尽管在多种情形中子系统可能是更灵活或易于复用的， 但其所需的配置和样板代码数量将会增长得更快。 为了解决这个问题， 外观将会提供指向子系统中最常用功能的快捷方式， 能够满足客户端的大部分需求。

如果需要将子系统组织为多层结构， 可以使用外观。

创建外观来定义子系统中各层次的入口。 你可以要求子系统仅使用外观来进行交互， 以减少子系统之间的耦合。

让我们回到视频转换框架的例子。 该框架可以拆分为两个层次： 音频相关和视频相关。 你可以为每个层次创建一个外观， 然后要求各层的类必须通过这些外观进行交互。 这种方式看上去与[中介者](https://refactoringguru.cn/design-patterns/mediator)模式非常相似。



## 再来认识外观模式

> 看到外观模式的实现，可能有朋友会说，这他么不就是把原来客户端的代码搬到了 Facade 里面吗，没什么大变化

### 外观模式目的

外观模式相当于屏蔽了外部客户端和系统内部模块的交互

外观模式的目的不是给系统添加新的功能接口，而是为了让外部减少与子系统内多个模块的交互，松散耦合，从而让外部能更简单的使用子系统。

当然即使有了外观，如果需要的话，我们也可以直接调用具体模块功能。

## 实现方式

1. 考虑能否在现有子系统的基础上提供一个更简单的接口。 如果该接口能让客户端代码独立于众多子系统类， 那么你的方向就是正确的。
2. 在一个新的外观类中声明并实现该接口。 外观应将客户端代码的调用重定向到子系统中的相应对象处。 如果客户端代码没有对子系统进行初始化， 也没有对其后续生命周期进行管理， 那么外观必须完成此类工作。
3. 如果要充分发挥这一模式的优势， 你必须确保所有客户端代码仅通过外观来与子系统进行交互。 此后客户端代码将不会受到任何由子系统代码修改而造成的影响， 比如子系统升级后， 你只需修改外观中的代码即可。
4. 如果外观变得过于臃肿， 你可以考虑将其部分行为抽取为一个新的专用外观类。



## 外观模式优缺点

-  你可以让自己的代码独立于复杂子系统。

-  外观可能成为与程序中所有类都耦合的上帝对象。



## 与其他模式的关系

- 外观模式为现有对象定义了一个新接口， [适配器模式](https://refactoringguru.cn/design-patterns/adapter)则会试图运用已有的接口。 *适配器*通常只封装一个对象， *外观*通常会作用于整个对象子系统上。
- 当只需对客户端代码隐藏子系统创建对象的方式时， 你可以使用[抽象工厂模式](https://refactoringguru.cn/design-patterns/abstract-factory)来代替[外观](https://refactoringguru.cn/design-patterns/facade)。
- [享元模式](https://refactoringguru.cn/design-patterns/flyweight)展示了如何生成大量的小型对象， [外观](https://refactoringguru.cn/design-patterns/facade)则展示了如何用一个对象来代表整个子系统。
- [外观](https://refactoringguru.cn/design-patterns/facade)和[中介者模式](https://refactoringguru.cn/design-patterns/mediator)的职责类似： 它们都尝试在大量紧密耦合的类中组织起合作。
  - *外观*为子系统中的所有对象定义了一个简单接口， 但是它不提供任何新功能。 子系统本身不会意识到外观的存在。 子系统中的对象可以直接进行交流。
  - *中介者*将系统中组件的沟通行为中心化。 各组件只知道中介者对象， 无法直接相互交流。
- [外观](https://refactoringguru.cn/design-patterns/facade)类通常可以转换为[单例模式](https://refactoringguru.cn/design-patterns/singleton)类， 因为在大部分情况下一个外观对象就足够了。
- [外观](https://refactoringguru.cn/design-patterns/facade)与[代理模式](https://refactoringguru.cn/design-patterns/proxy)的相似之处在于它们都缓存了一个复杂实体并自行对其进行初始化。 *代理*与其服务对象遵循同一接口， 使得自己和服务对象可以互换， 在这一点上它与*外观*不同。



### demo

用一个生活中的充电器的例子来讲解下适配器，我国民用电都是 220V，而我们的手机充电一般需要 5V。

220V 的交流电相当于被适配者 Adaptee，我们的目标 Target 是 5V 直流电，充电器本身相当于一个 Adapter，将220V 的输入电压变换为 5V 输出。

1. 首先是我们的名用电（我国是 220V，当然还可以有其他国家的其他准备，可随时扩展）

   ```java
   public class Volatage220V {
   
       public final int output = 220;
   
       public int output220v() {
           System.out.println("输出电压 " + output);
           return output;
       }
   }
   ```

2. 适配接口

   ```java
   public interface IVoltage5V {
        int output5V();
   }
   ```

3. 我们的手机充电，只支持 5V 电压

   ```java
   public class Phone {
   
       public void charging(IVoltage5V v) {
           if (v.output5V() == 5) {
               System.out.println("电压 5V ，符合充电标准，开始充电");
           } else {
               System.out.println("电压不符合标准，无法充电");
           }
       }
   }
   ```

4. 适配器

   ```java
   public class VoltageAdapter implements IVoltage5V {
   
       private Volatage220V volatage220V;  //聚合
   
       public VoltageAdapter(Volatage220V v) {
           this.volatage220V = v;
       }
   
       @Override
       public int output5V() {
           int dst = 0;
           if (null != volatage220V) {
               int src = volatage220V.output220v();
               System.out.println("适配器工作~~~~~");
               dst = src / 44;
               System.out.println("适配器工作完成，输出电压" + dst);
           }
           return dst;
       }
   }
   ```

5. 工作，如果去国外旅游，有不同的电压，只需要扩展适配器即可。

   ```java
   public class Client {
       public static void main(String[] args) {
           Phone phone = new Phone();
           phone.charging(new VoltageAdapter(new Volatage220V()));
       }
   }
   ```



##  适配器模式优缺点

-  单一职责原则，你可以将接口或数据转换代码从程序主要业务逻辑中分离。
-  开闭原则。 只要客户端代码通过客户端接口与适配器进行交互， 你就能在不修改现有客户端代码的情况下在程序中添加新类型的适配器。

-  代码整体复杂度增加， 因为你需要新增一系列接口和类。 有时直接更改服务类使其与其他代码兼容会更简单。



## Spring 中的适配器

Spring 源码中搜关键字`Adapter` 会出现很多实现类，SpringMVC 中的 `HandlerAdapter` ，就是适配器的应用。

我们先回顾下 SpringMVC  处理流程：

![qsli.github.io](https://tva1.sinaimg.cn/large/007S8ZIlly1gfjqoif1ddj30vq0ij0uq.jpg)

Spring MVC中的适配器模式主要用于执行目标 `Controller` 中的请求处理方法。

在Spring MVC中，`DispatcherServlet` 作为用户，`HandlerAdapter` 作为期望接口，具体的适配器实现类用于对目标类进行适配，`Controller` 作为需要适配的类。

为什么要在 Spring MVC 中使用适配器模式？Spring MVC 中的 `Controller` 种类众多，不同类型的 `Controller` 通过不同的方法来对请求进行处理。如果不利用适配器模式的话，`DispatcherServlet` 直接获取对应类型的 `Controller`，需要的自行来判断，像下面这段代码一样：

```java
if(mappedHandler.getHandler() instanceof MultiActionController){  
   ((MultiActionController)mappedHandler.getHandler()).xxx  
}else if(mappedHandler.getHandler() instanceof XXX){  
    ...  
}else if(...){  
   ...  
}  
```

这样假设如果我们增加一个 Controller，就要在代码中加入一行 if 语句，这种形式就使得程序难以维护，也违反了设计模式中的开闭原则 – 对扩展开放，对修改关闭。

我们通过源码看看 SpringMVC 是如何实现的，首先看下核心类 DispatcherServlet：

```java
public class DispatcherServlet extends FrameworkServlet {
  	//......
		//维护所有HandlerAdapter类的集合
    @Nullable
    private List<HandlerAdapter> handlerAdapters;
  
		//初始化handlerAdapters
    private void initHandlerAdapters(ApplicationContext context) {
        this.handlerAdapters = null;
        if (this.detectAllHandlerAdapters) {
            Map<String, HandlerAdapter> matchingBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(context, HandlerAdapter.class, true, false);
            if (!matchingBeans.isEmpty()) {
                this.handlerAdapters = new ArrayList(matchingBeans.values());
                AnnotationAwareOrderComparator.sort(this.handlerAdapters);
            }
        } else {
            try {
                HandlerAdapter ha = (HandlerAdapter)context.getBean("handlerAdapter", HandlerAdapter.class);
                this.handlerAdapters = Collections.singletonList(ha);
            } catch (NoSuchBeanDefinitionException var3) {
            }
        }

        if (this.handlerAdapters == null) {
            this.handlerAdapters = this.getDefaultStrategies(context, HandlerAdapter.class);
            if (this.logger.isTraceEnabled()) {
                this.logger.trace("No HandlerAdapters declared for servlet '" + this.getServletName() + "': using default strategies from DispatcherServlet.properties");
            }
        }
    }
  
  //dispatch 方法中会获取 HandlerAdapter
  protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //...
    
				//获得controller对应的适配器
        HandlerAdapter ha = this.getHandlerAdapter(mappedHandler.getHandler());          
				
				//调用适配器的handler方法处理请求，并返回ModelAndView
        mv = ha.handle(processedRequest, response, mappedHandler.getHandler());            
        //...
    }
  	
		//返回对应的controller的处理器
      protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
        if (this.handlerAdapters != null) {
            Iterator var2 = this.handlerAdapters.iterator();

            while(var2.hasNext()) {
                HandlerAdapter adapter = (HandlerAdapter)var2.next();
                if (adapter.supports(handler)) {
                    return adapter;
                }
            }
        }
    }
```

接着看下 HandlerAdapter 的源码，也就是适配器接口:

```java
public interface HandlerAdapter {
    boolean supports(Object var1);

    @Nullable
    ModelAndView handle(HttpServletRequest var1, HttpServletResponse var2, Object var3) throws Exception;

    long getLastModified(HttpServletRequest var1, Object var2);
}
```



再来屡一下这个流程：

1. 首先是适配器接口 DispatchServlet 中有一个集合维护所有的 HandlerAdapter，如果配置文件中没有对适配器进行配置，那么 DispatchServlet 会在创建时对该变量进行初始化，注册所有默认的 HandlerAdapter。
2. 当一个请求过来时，DispatchServlet 会根据传过来的 handler 类型从该集合中寻找对应的 HandlerAdapter子类进行处理，并且调用它的 handler() 方法
3. 对应的 HandlerAdapter 中的 handler() 方法又会执行对应 Controller 的 handleRequest() 方法

适配器与 handler 有对应关系，而各个适配器又都是适配器接口的实现类，因此，它们都遵循相同的适配器标准，所以用户可以按照相同的方式，通过不同的 handler 去处理请求。 当然了，Spring 框架中也为我们定义了一些默认的 Handler 对应的适配器。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gfjrbrv96pj31ck0j0dl6.jpg)

通过适配器模式我们将所有的 `controller` 统一交给 `HandlerAdapter` 处理，免去了写大量的 `if-else` 语句对 `Controller` 进行判断，也更利于扩展新的 `Controller` 类型。



## 参考与感谢
《图解 Java 设计模式》
《Head First设计模式》
https://refactoringguru.cn/design-patterns/
https://blog.csdn.net/lu__peng/article/details/79117894
https://juejin.im/post/5ba28986f265da0abc2b6084#heading-12