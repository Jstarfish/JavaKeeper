# 随遇而安的适配器模式 | Spring 中的适配器

![适配器设计模式](https://tva1.sinaimg.cn/large/007S8ZIlly1gfjtnx5644j30hs0b4mxx.jpg)



## 问题

假设我们在做一套股票看盘系统，数据提供方给我们提供 XML 格式数据，我们获取数据用来显示，随着系统的迭代，我们要整合一些第三方系统的对外数据，但是他们只提供获取 JSON 格式的数据接口。

在不想改变原有代码逻辑的情况下，如何解决呢？

这时候我们就可以创建一个「**适配器**」。这是一个特殊的对象， 能够转换对象接口， 使其能与其他对象进行交互。

适配器模式通过封装对象将复杂的转换过程隐藏于幕后。 被封装的对象甚至察觉不到适配器的存在。 

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gfjt8avun0j31py0kztda.jpg)



## 真实世界类比

适配器是什么，不难理解，生活中也随处可见。比如，笔记本电脑的电源适配器、万能充（曾经的它真有一个这么牛逼的名字）、一拖十数据线等等。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gfjhf9tjluj32hc0mu4p8.jpg)



## 基本介绍

- 适配器模式将一个类的接口，转换成客户期望的另外一个接口。适配器让原本接口不兼容的类可以合作无间。也可以叫包装器（Wrapper）

- **适配器模式**是一种结构型设计模式， 它能使接口不兼容的对象能够相互合作
- 主要分为两类：类适配器模式、对象适配器模式



## 工作原理

- 适配器模式：将一个类的接口转换成另一种接口，让原本接口不兼容的类可以兼容
- 从用户的角度看不到被适配者，是解耦的
- 用户调用适配器转化出来的目标接口方法，适配器再调用被适配者的相关接口方法
- 用户收到反馈结果，感觉只是和目标接口交互



## 适配器模式结构

### 对象适配器

实现时使用了构成原则： 适配器实现了其中一个对象的接口， 并对另一个对象进行封装。 所有流行的编程语言都可以实现适配器。

![适配器设计模式的结构（对象适配器）](https://tva1.sinaimg.cn/large/007S8ZIlly1gfjjbh88h7j31od0u0ds2.jpg)

1. **客户端** （Client） 是包含当前程序业务逻辑的类。
2. **客户端接口** （Target） 描述了其他类与客户端代码合作时必须遵循的协议。
3. **服务** （Service） 中有一些功能类 （通常来自第三方或遗留系统）。 客户端与其接口不兼容， 因此无法直接调用其功能，也可以叫适配者类（Adaptee）。
4. **适配器** （Adapter） 是一个可以同时与客户端和服务交互的类： 它在实现客户端接口的同时封装了服务对象。 适配器接受客户端通过适配器接口发起的调用， 并将其转换为适用于被封装服务对象的调用。
5. **客户端代码只需通过接口与适配器交互即可， 无需与具体的适配器类耦合**。 因此， 你可以向程序中添加新类型的适配器而无需修改已有代码。 这在服务类的接口被更改或替换时很有用： 你无需修改客户端代码就可以创建新的适配器类。

#### Coding

1. 定义客户端使用的接口，与业务相关

   ```java
   public interface Target {
   
       /*
        * 客户端请求处理的方法
        */
       void request();
   }
   ```

2. 已经存在的接口，这个接口需要配置

   ```java
   public class Adaptee {
   
       /*
        * 原本存在的方法
        */
       public void specificRequest(){
       //业务代码
       }
   }
   ```

3. 适配器类

   ```java
   public class Adapter implements Target {
   
       /*
        * 持有需要被适配的接口对象
        */
       private Adaptee adaptee;
   
       /*
        * 构造方法，传入需要被适配的对象
        * @param adaptee 需要被适配的对象
        */
       public Adapter(Adaptee adaptee) {
           this.adaptee = adaptee;
       }
   
       @Override
       public void request() {
           // TODO Auto-generated method stub
           adaptee.specificRequest();
       }
   
   }
   ```

4. 使用适配器的客户端

   ```java
   public class Client {
   
       public static void main(String[] args) {
           //创建需要被适配的对象
           Adaptee adaptee = new Adaptee();
           //创建客户端需要调用的接口对象
           Target target = new Adapter(adaptee);
           //请求处理
           target.request();
       }
   }
   ```



### 类适配器

这一实现使用了继承机制： 适配器同时继承两个对象的接口。 请注意， 这种方式仅能在支持多重继承的编程语言中实现，例如 C++， Java 不支持多重继承，也就没有这种适配器了。

![适配器设计模式（类适配器）](https://tva1.sinaimg.cn/large/007S8ZIlly1gfjtka91z8j31od0u0n9c.jpg)

**类适配器**不需要封装任何对象， 因为它同时继承了客户端和服务的行为。 适配功能在重写的方法中完成。 最后生成的适配器可替代已有的客户端类进行使用。

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

   

##  适配器模式适合应用场景

- 当你希望使用某个类， 但是其接口与其他代码不兼容时， 可以使用适配器类。

- 适配器模式允许你创建一个中间层类， 其可作为代码与遗留类、 第三方类或提供怪异接口的类之间的转换器。

- 如果您需要复用这样一些类， 他们处于同一个继承体系， 并且他们又有了额外的一些共同的方法， 但是这些共同的方法不是所有在这一继承体系中的子类所具有的共性。

- 你可以扩展每个子类， 将缺少的功能添加到新的子类中。 但是， 你必须在所有新子类中重复添加这些代码， 这样会使得代码有坏味道。

  将缺失功能添加到一个适配器类中是一种优雅得多的解决方案。 然后你可以将缺少功能的对象封装在适配器中， 从而动态地获取所需功能。 如要这一点正常运作， 目标类必须要有通用接口， 适配器的成员变量应当遵循该通用接口。 这种方式同装饰模式非常相似。

### demo

用一个生活中的充电器的例子来讲解下适配器，我国民用电都是 220V，而我们的手机充电一般需要 5V。

220V 的交流电相当于被适配者 Adaptee，我们的目标 Target 是 5V 直流电，充电器本身相当于一个 Adapter，将220V 的输入电压变换为 5V 输出。

1. 首先是我们的民用电（我国是 220V，当然还可以有其他国家的其他准备，可随时扩展）

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

Spring MVC 中的适配器模式主要用于执行目标 `Controller` 中的请求处理方法。

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
2. 当一个请求过来时，DispatchServlet 会根据传过来的 handler 类型从该集合中寻找对应的 HandlerAdapter子类进行处理，并且调用它的 `handler()` 方法
3. 对应的 HandlerAdapter 中的 `handler()` 方法又会执行对应 Controller 的 `handleRequest()` 方法

适配器与 handler 有对应关系，而各个适配器又都是适配器接口的实现类，因此，它们都遵循相同的适配器标准，所以用户可以按照相同的方式，通过不同的 handler 去处理请求。 当然了，Spring 框架中也为我们定义了一些默认的 Handler 对应的适配器。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gfjrbrv96pj31ck0j0dl6.jpg)

通过适配器模式我们将所有的 `controller` 统一交给 `HandlerAdapter` 处理，免去了写大量的 `if-else`  语句对 `Controller` 进行判断，也更利于扩展新的 `Controller` 类型。



## 参考与感谢
《图解 Java 设计模式》
《Head First设计模式》
https://refactoringguru.cn/design-patterns/
https://blog.csdn.net/lu__peng/article/details/79117894
https://juejin.im/post/5ba28986f265da0abc2b6084#heading-12