在 Java 世界里，Spring 框架已经几乎成为项目开发的必备框架。



第一部分，我们讲解 Spring 框架中蕴含的经典设计思想或原则。

第二部分，我们讲解 Spring 框架中用来支持扩展的两种设计模式。

第三部分，我们总结罗列 Spring 框架中用到的其他十几种设计模式。



Spring 框架背后的一些经典设计思想（或开发技巧）。

约定大于配置、低侵入松耦合、模块化轻量级等

**1.** **约定优于配置**

基于约定的配置方式，也常叫作“约定优于配置”或者“规约优于配置”（Convention over Configuration）。通过约定的代码结构或者命名来减少配置。说直白点，就是提供配置的默认值，优先使用默认值。程序员只需要设置那些偏离约定的配置就可以了。

比如，在 Spring JPA（基于 ORM 框架、JPA 规范的基础上，封装的一套 JPA 应用框架）中，我们约定类名默认跟表名相同，属性名默认跟表字段名相同，String 类型对应数据库中的 varchar 类型，long 类型对应数据库中的 bigint 类型等等

**2.** **低侵入、松耦合**

框架的侵入性是衡量框架好坏的重要指标。所谓低侵入指的是，框架代码很少耦合在业务代码中。低侵入意味着，当我们要替换一个框架的时候，对原有的业务代码改动会很少。

Spring 提供的 IOC 容器，在不需要 Bean 继承任何父类或者实现任何接口的情况下，仅仅通过配置，就能将它们纳入进 Spring 的管理中。如果我们换一个 IOC 容器，也只是重新配置一下就可以了，原有的 Bean 都不需要任何修改。

除此之外，Spring 提供的 AOP 功能，也体现了低侵入的特性。在项目中，对于非业务功能，比如请求日志、数据采点、安全校验、事务等等，我们没必要将它们侵入进业务代码中。因为一旦侵入，这些代码将分散在各个业务代码中，删除、修改的成本就变得很高。而基于 AOP 这种开发模式，将非业务代码集中放到切面中，删除、修改的成本就变得很低了

**3.** **模块化、轻量级**

每个模块都只负责一个相对独立的功能。模块之间关系，仅有上层对下层的依赖关系，而同层之间以及下层对上层，几乎没有依赖和耦合。

**4.** **再封装、再抽象**

Spring 不仅仅提供了各种 Java 项目开发的常用功能模块，而且还对市面上主流的中间件、系统的访问类库，做了进一步的封装和抽象，提供了更高层次、更统一的访问接口。

比如，Spring 提供了 spring-data-redis 模块，对 Redis Java 开发类库（比如 Jedis、Lettuce）做了进一步的封装，适配 Spring 的访问方式，让编程访问 Redis 更加简单。





### **观察者模式在** **Spring** **中的应用**

Spring 中实现的观察者模式包含三部分：Event 事件（相当于消息）、Listener 监听者（相当于观察者）、Publisher 发送者（相当于被观察者）

```java
// Event事件
public class DemoEvent extends ApplicationEvent {
    private String message;

    public DemoEvent(Object source, String message) {
        super(source);
    }

    public String getMessage() {
        return this.message;
    }
}
```

```java
// Listener监听者
@Component
public class DemoListener implements ApplicationListener<DemoEvent> {
  @Override
  public void onApplicationEvent(DemoEvent demoEvent) {
    String message = demoEvent.getMessage();
    System.out.println(message);
  }
}
```

```java
// Publisher发送者
@Component
public class DemoPublisher {
  @Autowired
  private ApplicationContext applicationContext;

  public void publishEvent(DemoEvent demoEvent) {
    this.applicationContext.publishEvent(demoEvent);
  }
}
```

从代码中，我们可以看出，框架使用起来并不复杂，主要包含三部分工作：

- 定义一个继承 ApplicationEvent 的事件（DemoEvent）；
- 定义一个实现了 ApplicationListener 的监听器（DemoListener）；
- 定义一个发送者（DemoPublisher），发送者调用 ApplicationContext 来发送事件消息。

其中，ApplicationEvent 和 ApplicationListener 的代码实现都非常简单，内部并不包含太多属性和方法。实际上，它们最大的作用是做类型标识之用（继承自 ApplicationEvent 的类是事件，实现 ApplicationListener 的类是监听器）。

```java
public abstract class ApplicationEvent extends EventObject {
  private static final long serialVersionUID = 7099057708183571937L;
  private final long timestamp = System.currentTimeMillis();

  public ApplicationEvent(Object source) {
    super(source);
  }

  public final long getTimestamp() {
    return this.timestamp;
  }
}

public class EventObject implements java.io.Serializable {
  private static final long serialVersionUID = 5516075349620653480L;
  protected transient Object source;

  public EventObject(Object source) {
    if (source == null)
      throw new IllegalArgumentException("null source");
    this.source = source;
  }

  public Object getSource() {
    return source;
  }

  public String toString() {
    return getClass().getName() + "[source=" + source + "]";
  }
}

public interface ApplicationListener<E extends ApplicationEvent> extends Event
  void onApplicationEvent(E var1);
}
```

观察者需要事先注册到被观察者（JDK 的实现方式）或者事件总线（EventBus 的实现方式）中。那在 Spring 的实现中，观察者注册到

了哪里呢？又是如何注册的呢？

我们把观察者注册到了 ApplicationContext 对象中。这里的ApplicationContext 就相当于 Google EventBus 框架中的“事件总线”。不过，稍微提醒一下，ApplicationContext 这个类并不只是为观察者模式服务的。它底层依赖 BeanFactory（IOC 的主要实现类），提供应用启动、运行时的上下文信息，是访问这些信息的最顶层接口。

实际上，具体到源码来说，ApplicationContext 只是一个接口，具体的代码实现包含在它的实现类 AbstractApplicationContext 中。我把跟观察者模式相关的代码，摘抄到了下面。你只需要关注它是如何发送事件和注册监听者就好，其他细节不需要细究

```java
public abstract class AbstractApplicationContext extends ... {
    private final Set<ApplicationListener<?>> applicationListeners;

    public AbstractApplicationContext() {
        this.applicationListeners = new LinkedHashSet();
        //...
    }

    public void publishEvent(ApplicationEvent event) {
        this.publishEvent(event, (ResolvableType)null);
    }

    public void publishEvent(Object event) {
        this.publishEvent(event, (ResolvableType)null);
    }

    protected void publishEvent(Object event, ResolvableType eventType) {
        //...
        Object applicationEvent;
        if (event instanceof ApplicationEvent) {
            applicationEvent = (ApplicationEvent)event;
        } else {
            applicationEvent = new PayloadApplicationEvent(this, event);
            if (eventType == null) {
                eventType = ((PayloadApplicationEvent)applicationEvent).getResolvableTy
            }
        }

        if (this.earlyApplicationEvents != null) {
            this.earlyApplicationEvents.add(applicationEvent);
        } else {
            this.getApplicationEventMulticaster().multicastEvent(
                (ApplicationEvent)applicationEvent, eventType);
        }

        if (this.parent != null) {
            if (this.parent instanceof AbstractApplicationContext) {
                ((AbstractApplicationContext)this.parent).publishEvent(event, eventType
            } else {
                this.parent.publishEvent(event);
            }
        }
    }

    public void addApplicationListener(ApplicationListener<?> listener) {
        Assert.notNull(listener, "ApplicationListener must not be null");
        if (this.applicationEventMulticaster != null) {
            this.applicationEventMulticaster.addApplicationListener(listener);
        } else {
            this.applicationListeners.add(listener);
        }
    }

    public Collection<ApplicationListener<?>> getApplicationListeners() {
        return this.applicationListeners;
    }

    protected void registerListeners() {
        Iterator var1 = this.getApplicationListeners().iterator();

        while(var1.hasNext()) {
            ApplicationListener<?> listener = (ApplicationListener)var1.next(); t
        }

        String[] listenerBeanNames = this.getBeanNamesForType(ApplicationListener.c
        String[] var7 = listenerBeanNames;
        int var3 = listenerBeanNames.length;

        for(int var4 = 0; var4 < var3; ++var4) {
            String listenerBeanName = var7[var4];
            this.getApplicationEventMulticaster().addApplicationListenerBean(listene
        }

        Set<ApplicationEvent> earlyEventsToProcess = this.earlyApplicationEvents;
        this.earlyApplicationEvents = null;
        if (earlyEventsToProcess != null) {
            Iterator var9 = earlyEventsToProcess.iterator();

            while(var9.hasNext()) {
                ApplicationEvent earlyEvent = (ApplicationEvent)var9.next();
                this.getApplicationEventMulticaster().multicastEvent(earlyEvent);
            }
        }
    }
}
```

从上面的代码中，我们发现，真正的消息发送，实际上是通过 ApplicationEventMulticaster 这个类来完成的。这个类的源码我只摘抄了最关键的一部分，也就是 multicastEvent() 这个消息发送函数。不过，它的代码也并不复杂，我就不多解释了。这里我稍微提示一下，它通过线程池，支持异步非阻塞、同步阻塞这两种类型的观察者模式。

借助 Spring 提供的观察者模式的骨架代码，如果我们要在 Spring 下实现某个事件的发送和监听，只需要做很少的工作，定义事件、定义监听器、往 ApplicationContext 中发送事件就可以了，剩下的工作都由 Spring 框架来完成。实际上，这也体现了 Spring 框架的扩展性，也就是在不需要修改任何代码的情况下，扩展新的事件和监听。



### **模板模式在** **Spring** 中的应用

我们来看下一下经常在面试中被问到的一个问题：请你说下 Spring Bean 的创建过程包含哪些主要的步骤。这其中就涉及模板模式。它也体现了 Spring 的扩展性。利用模板模式，Spring 能让用户定制 Bean 的创建过程。

Spring Bean 的创建过程，可以大致分为两大步：对象的创建和对象的初始化。

对象的创建是通过反射来动态生成对象，而不是 new 方法。不管是哪种方式，说白了，总归还是调用构造函数来生成对象，没有什么特殊的。

对象的初始化有两种实现方式。一种是在类中自定义一个初始化函数，并且通过配置文件，显式地告知 Spring，哪个函数是初始化函数。我举了一个例子解释一下。如下所示，在配置文件中，我们通过 init-method 属性来指定初始化函数。

```java
public class DemoClass {
 //...
 public void initDemo() {
 //...初始化..
 }
}
```

```xml
// 配置：需要通过init-method显式地指定初始化方法
<bean id="demoBean" class="ink.strfish.DemoClass" init-method="initDemo"></bean>
```

这种初始化方式有一个缺点，初始化函数并不固定，由用户随意定义，这就需要 Spring 通过反射，在运行时动态地调用这个初始化函数。而反射又会影响代码执行的性能，那有没有替代方案呢？

Spring 提供了另外一个定义初始化函数的方法，那就是让类实现 Initializingbean 接口。这个接口包含一个固定的初始化函数定义（afterPropertiesSet() 函数）。Spring 在初始化 Bean 的时候，可以直接通过 bean.afterPropertiesSet() 的方式，调用 Bean 对象上的

这个函数，而不需要使用反射来调用了。我举个例子解释一下，代码如下所示。

```java
public class DemoClass implements InitializingBean{
 @Override
 public void afterPropertiesSet() throws Exception {
 //...初始化...
 }
}
```

```xml
// 配置：不需要显式地指定初始化方法
<bean id="demoBean" class="com.xzg.cd.DemoClass"></bean>
```

尽管这种实现方式不会用到反射，执行效率提高了，但业务代码（DemoClass）跟框架代码（InitializingBean）耦合在了一起。框架代码侵入到了业务代码中，替换框架的成本就变高了。所以，并不是太推荐这种写法。

实际上，Spring 针对对象的初始化过程，还做了进一步的细化，将它拆分成了三个小步骤：初始化前置操作、初始化、初始化后置操作。其中，中间的初始化操作就是我们刚刚讲的那部分，初始化的前置和后置操作，定义在接口 BeanPostProcessor 中。

BeanPostProcessor 的接口定义如下所示

```java
public interface BeanPostProcessor {

	@Nullable
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	@Nullable
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

}
```

我们再来看下，如何通过 BeanPostProcessor 来定义初始化前置和后置操作？

我们只需要定义一个实现了 BeanPostProcessor 接口的处理器类，并在配置文件中像配置普通 Bean 一样去配置就可以了。Spring 中的 ApplicationContext 会自动检测在配置文件中实现了 BeanPostProcessor 接口的所有 Bean，并把它们注册到 BeanPostProcessor

处理器列表中。在 Spring 容器创建 Bean 的过程中，Spring 会逐一去调用这些处理器。

通过上面的分析，我们基本上弄清楚了 Spring Bean 的整个生命周期（创建加销毁）。针对这个过程，我画了一张图，你可以结合着刚刚讲解一块看下

![](/Users/starfish/Documents/截图/截屏2025-01-02 14.37.01.png)

不过，你可能会说，这里哪里用到了模板模式啊？模板模式不是需要定义一个包含模板方法的抽象模板类，以及定义子类实现模板方法吗？

实际上，这里的模板模式的实现，并不是标准的抽象类的实现方式，而是有点类似我们前面讲到的 Callback 回调的实现方式，也就是将要执行的函数封装成对象（比如，初始化方法封装成 InitializingBean 对象），传递给模板（BeanFactory）来执行



### 适配器模式在 **Spring** **中的应用**

在 Spring MVC 中，定义一个 Controller 最常用的方式是，通过 @Controller 注解来标记某个类是 Controller 类，通过 @RequesMapping 注解来标记函数对应的 URL。不过，定义一个 Controller 远不止这一种方法。我们还可以通过让类实现 Controller 接口或者 Servlet 接口，来定义一个 Controller。针对这三种定义方式，我写了三段示例代码，如下所示：

```java
// 方法一：通过@Controller、@RequestMapping来定义
@Controller
public class DemoController {
    @RequestMapping("/employname")
    public ModelAndView getEmployeeName() {
        ModelAndView model = new ModelAndView("Greeting");
        model.addObject("message", "Dinesh");
        return model;
    }
}

// 方法二：实现Controller接口 + xml配置文件:配置DemoController与URL的对应关系
public class DemoController implements Controller {
    @Override
    public ModelAndView handleRequest(HttpServletRequest req, HttpServletRespon
        ModelAndView model = new ModelAndView("Greeting");
        model.addObject("message", "Dinesh Madhwal");
        return model;
    }
}

// 方法三：实现Servlet接口 + xml配置文件:配置DemoController类与URL的对应关系
public class DemoServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws
        this.doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throw
        resp.getWriter().write("Hello World.");
    }
}
```

在应用启动的时候，Spring 容器会加载这些 Controller 类，并且解析出 URL 对应的处理函数，封装成 Handler 对象，存储到 HandlerMapping 对象中。当有请求到来的时候，DispatcherServlet 从 HanderMapping 中，查找请求 URL 对应的 Handler，然后调用执行 Handler 对应的函数代码，最后将执行结果返回给客户端。

但是，不同方式定义的 Controller，其函数的定义（函数名、入参、返回值等）是不统一的。如上示例代码所示，方法一中的函数的定义很随意、不固定，方法二中的函数定义是handleRequest()、方法三中的函数定义是 service()（看似是定义了 doGet()、doPost()，

实际上，这里用到了模板模式，Servlet 中的 service() 调用了 doGet() 或 doPost() 方法，DispatcherServlet 调用的是 service() 方法）。DispatcherServlet 需要根据不同类型的Controller，调用不同的函数。下面是具体的伪代码：

```java
Handler handler = handlerMapping.get(URL);
 if (handler instanceof Controller) {
 ((Controller)handler).handleRequest(...);
 } else if (handler instanceof Servlet) {
 ((Servlet)handler).service(...);
 } else if (hanlder 对应通过注解来定义的Controller) {
 反射调用方法...
 }
```

从代码中我们可以看出，这种实现方式会有很多 if-else 分支判断，而且，如果要增加一个新的 Controller 的定义方法，我们就要在 DispatcherServlet 类代码中，对应地增加一段如上伪代码所示的 if 逻辑。这显然不符合开闭原则

实际上，我们可以利用是适配器模式对代码进行改造，让其满足开闭原则，能更好地支持扩赞。

适配器其中一个作用是“统一多个类的接口设计”。利用适配器模式，我们将不同方式定义的 Controller 类中的函数，适配为统一的函数定义。这样，我们就能在 DispatcherServlet 类代码中，移除掉 if-else 分支判断逻辑，调用统一的函数。

刚刚讲了大致的设计思路，我们再具体看下 Spring 的代码实现。

Spring 定义了统一的接口 HandlerAdapter，并且对每种 Controller 定义了对应的适配器类。这些适配器类包括：AnnotationMethodHandlerAdapter、SimpleControllerHandlerAdapter、SimpleServletHandlerAdapter 等。源码我贴到了

下面，你可以结合着看下

```java
public interface HandlerAdapter {
    boolean supports(Object var1);

    ModelAndView handle(HttpServletRequest var1, HttpServletResponse var2, Object

    long getLastModified(HttpServletRequest var1, Object var2);
}

// 对应实现Controller接口的Controller
public class SimpleControllerHandlerAdapter implements HandlerAdapter {
    public SimpleControllerHandlerAdapter() {
    }

    public boolean supports(Object handler) {
        return handler instanceof Controller;
    }

    public ModelAndView handle(HttpServletRequest request, HttpServletResponse re
        return ((Controller)handler).handleRequest(request, response);
    }

    public long getLastModified(HttpServletRequest request, Object handler) {
        return handler instanceof LastModified ? ((LastModified)handler).getLastMod
    }
}

// 对应实现Servlet接口的Controller
public class SimpleServletHandlerAdapter implements HandlerAdapter {
    public SimpleServletHandlerAdapter() {
    }

    public boolean supports(Object handler) {
        return handler instanceof Servlet;
    }

    public ModelAndView handle(HttpServletRequest request, HttpServletResponse re
        ((Servlet)handler).service(request, response);
        return null;
    }

    public long getLastModified(HttpServletRequest request, Object handler) {
        return -1L;
    }
}

//AnnotationMethodHandlerAdapter对应通过注解实现的Controller，
//代码太多了，我就不贴在这里了
```

在 DispatcherServlet 类中，我们就不需要区分对待不同的 Controller 对象了，统一调用 HandlerAdapter 的 handle() 函数就可以了。按照这个思路实现的伪代码如下所示。你看，这样就没有烦人的 if-else 逻辑了吧？

```java
// 之前的实现方式
Handler handler = handlerMapping.get(URL);
if (handler instanceof Controller) {
    ((Controller)handler).handleRequest(...);
} else if (handler instanceof Servlet) {
    ((Servlet)handler).service(...);
} else if (hanlder 对应通过注解来定义的Controller) {
    反射调用方法...
}

// 现在实现方式
HandlerAdapter handlerAdapter = handlerMapping.get(URL);
handlerAdapter.handle(...);
```



### **策略模式在** **Spring** 中的应用

Spring AOP 是通过动态代理来实现的。具体到代码实现，Spring 支持两种动态代理实现方式，一种是 JDK 提供的动态代理实现方式，另一种是 Cglib 提供的动态代理实现方式。

前者需要被代理的类有抽象的接口定义，后者不需要。针对不同的被代理类，Spring 会在运行时动态地选择不同的动态代理实现方式。这个应用场景实际上就是策略模式的典型应用场景。

策略模式包含三部分，策略的定义、创建和使用。接下来，我们具体看下，这三个部分是如何体现在 Spring 源码中的。

在策略模式中，策略的定义这一部分很简单。我们只需要定义一个策略接口，让不同的策略类都实现这一个策略接口。对应到 Spring 源码，AopProxy 是策略接口，JdkDynamicAopProxy、CglibAopProxy 是两个实现了 AopProxy 接口的策略类。其中，AopProxy 接口的定义如下所示：

```java
public interface AopProxy {

	Object getProxy();

	Object getProxy(@Nullable ClassLoader classLoader);

}
```

在策略模式中，策略的创建一般通过工厂方法来实现。对应到 Spring 源码，AopProxyFactory 是一个工厂类接口，DefaultAopProxyFactory 是一个默认的工厂类，用来创建 AopProxy 对象。两者的源码如下所示：

```java
public interface AopProxyFactory {
    AopProxy createAopProxy(AdvisedSupport var1) throws AopConfigException;
}

public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {

	private static final long serialVersionUID = 7930414337282325166L;


	@Override
	public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
		if (!NativeDetector.inNativeImage() &&
				(config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config))) {
			Class<?> targetClass = config.getTargetClass();
			if (targetClass == null) {
				throw new AopConfigException("TargetSource cannot determine target class: " +
						"Either an interface or a target is required for proxy creation.");
			}
			if (targetClass.isInterface() || Proxy.isProxyClass(targetClass) || ClassUtils.isLambdaClass(targetClass)) {
				return new JdkDynamicAopProxy(config);
			}
			return new ObjenesisCglibAopProxy(config);
		}
		else {
			return new JdkDynamicAopProxy(config);
		}
	}

	/**
	 * 用来判断用哪个动态代理实现方式
	 * Determine whether the supplied {@link AdvisedSupport} has only the
	 * {@link org.springframework.aop.SpringProxy} interface specified
	 * (or no proxy interfaces specified at all).
	 */
	private boolean hasNoUserSuppliedProxyInterfaces(AdvisedSupport config) {
		Class<?>[] ifcs = config.getProxiedInterfaces();
		return (ifcs.length == 0 || (ifcs.length == 1 && SpringProxy.class.isAssignableFrom(ifcs[0])));
	}

}
```



### **组合模式在** **Spring** 中的应用

Spring Cache 提供了一套抽象的 Cache 接口。使用它我们能够 统一不同缓存实现（Redis、Google Guava…）的不同的访问方式。Spring 中针对不同缓存实现的不同缓存访问类，都依赖这个接口，比如：EhCacheCache、GuavaCache、NoOpCache、

RedisCache、JCacheCache、ConcurrentMapCache、CaffeineCache。Cache 接口的源码如下所示：

```java
public interface Cache {
    String getName();
    Object getNativeCache();
    Cache.ValueWrapper get(Object var1);
    <T> T get(Object var1, Class<T> var2);
    <T> T get(Object var1, Callable<T> var2);
    void put(Object var1, Object var2);
    Cache.ValueWrapper putIfAbsent(Object var1, Object var2);
    void evict(Object var1);
    void clear();

    public static class ValueRetrievalException extends RuntimeException {
        private final Object key;

        public ValueRetrievalException(Object key, Callable<?> loader, Throwable ex) {
            super(String.format("Value for key '%s' could not be loaded using '%s'", key, loader));
            this.key = key;
        }

        public Object getKey() {
            return this.key;
        }
    }

    public interface ValueWrapper {
        Object get();
    }
}
```

在实际的开发中，一个项目有可能会用到多种不同的缓存，比如既用到 Google Guava 缓存，也用到 Redis 缓存。除此之外，同一个缓存实例，也可以根据业务的不同，分割成多个小的逻辑缓存单元（或者叫作命名空间）。

为了管理多个缓存，Spring 还提供了缓存管理功能。不过，它包含的功能很简单，主要有这样两部分：一个是根据缓存名字（创建 Cache 对象的时候要设置 name 属性）获取Cache 对象；另一个是获取管理器管理的所有缓存的名字列表。对应的 Spring 源码如下所示：

```java
public interface CacheManager {
 Cache getCache(String var1);
 Collection<String> getCacheNames();
}
```

刚刚给出的是 CacheManager 接口的定义，那如何来实现这两个接口呢？实际上，这就要用到了我们之前讲过的组合模式。

组合模式主要应用在能表示成树形结构的一组数据上。

树中的结点分为叶子节点和中间节点两类。对应到 Spring 源码，EhCacheManager、SimpleCacheManager、NoOpCacheManager、RedisCacheManager 等表示叶子节点，CompositeCacheManager 表示中间节点。

叶子节点包含的是它所管理的 Cache 对象，中间节点包含的是其他 CacheManager 管理器，既可以是 CompositeCacheManager，也可以是具体的管理器，比如 EhCacheManager、RedisManager 等。

我把 CompositeCacheManger 的代码贴到了下面，你可以结合着讲解一块看下。其中，getCache()、getCacheNames() 两个函数的实现都用到了递归。这正是树形结构最能发挥优势的地方。

```java
public class CompositeCacheManager implements CacheManager, InitializingBean {

	private final List<CacheManager> cacheManagers = new ArrayList<>();
	private boolean fallbackToNoOpCache = false;

	public CompositeCacheManager() {
	}

	public CompositeCacheManager(CacheManager... cacheManagers) {
		setCacheManagers(Arrays.asList(cacheManagers));
	}

	public void setCacheManagers(Collection<CacheManager> cacheManagers) {
		this.cacheManagers.addAll(cacheManagers);
	}

	public void setFallbackToNoOpCache(boolean fallbackToNoOpCache) {
		this.fallbackToNoOpCache = fallbackToNoOpCache;
	}

	@Override
	public void afterPropertiesSet() {
		if (this.fallbackToNoOpCache) {
			this.cacheManagers.add(new NoOpCacheManager());
		}
	}


	@Override
	@Nullable
	public Cache getCache(String name) {
		for (CacheManager cacheManager : this.cacheManagers) {
			Cache cache = cacheManager.getCache(name);
			if (cache != null) {
				return cache;
			}
		}
		return null;
	}

	@Override
	public Collection<String> getCacheNames() {
		Set<String> names = new LinkedHashSet<>();
		for (CacheManager manager : this.cacheManagers) {
			names.addAll(manager.getCacheNames());
		}
		return Collections.unmodifiableSet(names);
	}

}
```



### **装饰器模式在** **Spring** 中的应用

我们知道，缓存一般都是配合数据库来使用的。如果写缓存成功，但数据库事务回滚了，那缓存中就会有脏数据。为了解决这个问题，我们需要将缓存的写操作和数据库的写操作，放到同一个事务中，要么都成功，要么都失败。

实现这样一个功能，Spring 使用到了装饰器模式。TransactionAwareCacheDecorator 增加了对事务的支持，在事务提交、回滚的时候分别对 Cache 的数据进行处理。

TransactionAwareCacheDecorator 实现 Cache 接口，并且将所有的操作都委托给 targetCache 来实现，对其中的写操作添加了事务功能。这是典型的装饰器模式的应用场景和代码实现，我就不多作解释了。

```java
/*
 * Copyright 2002-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springframework.cache.transaction;

import java.util.concurrent.Callable;

import org.springframework.cache.Cache;
import org.springframework.lang.Nullable;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.Assert;

/**
 * Cache decorator which synchronizes its {@link #put}, {@link #evict} and
 * {@link #clear} operations with Spring-managed transactions (through Spring's
 * {@link TransactionSynchronizationManager}, performing the actual cache
 * put/evict/clear operation only in the after-commit phase of a successful
 * transaction. If no transaction is active, {@link #put}, {@link #evict} and
 * {@link #clear} operations will be performed immediately, as usual.
 *
 * <p><b>Note:</b> Use of immediate operations such as {@link #putIfAbsent} and
 * {@link #evictIfPresent} cannot be deferred to the after-commit phase of a
 * running transaction. Use these with care in a transactional environment.
 *
 * @author Juergen Hoeller
 * @author Stephane Nicoll
 * @author Stas Volsky
 * @since 3.2
 * @see TransactionAwareCacheManagerProxy
 */
public class TransactionAwareCacheDecorator implements Cache {

	private final Cache targetCache;


	/**
	 * Create a new TransactionAwareCache for the given target Cache.
	 * @param targetCache the target Cache to decorate
	 */
	public TransactionAwareCacheDecorator(Cache targetCache) {
		Assert.notNull(targetCache, "Target Cache must not be null");
		this.targetCache = targetCache;
	}


	/**
	 * Return the target Cache that this Cache should delegate to.
	 */
	public Cache getTargetCache() {
		return this.targetCache;
	}

	@Override
	public String getName() {
		return this.targetCache.getName();
	}

	@Override
	public Object getNativeCache() {
		return this.targetCache.getNativeCache();
	}

	@Override
	@Nullable
	public ValueWrapper get(Object key) {
		return this.targetCache.get(key);
	}

	@Override
	public <T> T get(Object key, @Nullable Class<T> type) {
		return this.targetCache.get(key, type);
	}

	@Override
	@Nullable
	public <T> T get(Object key, Callable<T> valueLoader) {
		return this.targetCache.get(key, valueLoader);
	}

	@Override
	public void put(final Object key, @Nullable final Object value) {
		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					TransactionAwareCacheDecorator.this.targetCache.put(key, value);
				}
			});
		}
		else {
			this.targetCache.put(key, value);
		}
	}

	@Override
	@Nullable
	public ValueWrapper putIfAbsent(Object key, @Nullable Object value) {
		return this.targetCache.putIfAbsent(key, value);
	}

	@Override
	public void evict(final Object key) {
		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					TransactionAwareCacheDecorator.this.targetCache.evict(key);
				}
			});
		}
		else {
			this.targetCache.evict(key);
		}
	}

	@Override
	public boolean evictIfPresent(Object key) {
		return this.targetCache.evictIfPresent(key);
	}

	@Override
	public void clear() {
		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					targetCache.clear();
				}
			});
		}
		else {
			this.targetCache.clear();
		}
	}

	@Override
	public boolean invalidate() {
		return this.targetCache.invalidate();
	}

}
```



### **工厂模式在** **Spring** 中的应用

在 Spring 中，工厂模式最经典的应用莫过于实现 IOC 容器，对应的 Spring 源码主要是 BeanFactory 类和 ApplicationContext 相关类（AbstractApplicationContext、ClassPathXmlApplicationContext、FileSystemXmlApplicationContext…）。

在 Spring 中，创建 Bean 的方式有很多种，比如纯构造函数、无参构造函数加setter 方法。我写了一个例子来说明这两种创建方式，代码如下所示：

```java
public class Student {
    private long id;
    private String name;

    public Student(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```xml
// 使用构造函数来创建Bean
<bean id="student" class="ink.starfish.Student">
	<constructor-arg name="id" value="1"/>
	<constructor-arg name="name" value="starfish"/>
</bean>
// 使用无参构造函数+setter方法来创建Bean
<bean id="student" class="ink.starfish.Student">
	<property name="id" value="1"></property>
	<property name="name" value="starfish"></property>
</bean>
```

实际上，除了这两种创建 Bean 的方式之外，我们还可以通过工厂方法来创建 Bean。还是刚刚这个例子，用这种方式来创建 Bean 的话就是下面这个样子：

```java
public class StudentFactory {
    private static Map<Long, Student> students = new HashMap<>();
    static {
        map.put(1, new Student(1, "Tom"));
        map.put(2, new Student(2, "Jim"));
        map.put(3, new Student(3, "Mary"));
    }

    public static Student getStudent(long id) {
        return students.get(id);
    }
}
```

```xml
<bean id="zheng" class="ink.starfish.StudentFactory" factory-method="getStudent">
 <constructor-arg value="2"></constructor-arg>
</bean>
```

