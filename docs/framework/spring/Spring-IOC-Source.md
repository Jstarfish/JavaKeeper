很多人一提IOC，便张口就来：控制反转。究竟哪些方面被反转了呢？答案是依赖对象的获得被反转了。很多时候，我们通过多个对象之间的协作来完成一个功能，如果获取所依赖对象靠自身来实现，这将导致代码的耦合度高和难以测试。当然,控制反转还有一个好听的名字:依赖注入。

一、搞清楚ApplicationContext实例化Bean的过程
二、搞清楚这个过程中涉及的核心类
三、搞清楚IOC容器提供的扩展点有哪些，学会扩展
四、学会IOC容器这里使用的设计模式
五、搞清楚不同创建方式的bean的创建过程



1. 先回顾下 IOC 的知识
2. 搞清楚ApplicationContext实例化Bean的过程



## IOC 回顾

IoC（Inverse of Control:控制反转）是一种**设计思想**，就是 **将原本在程序中手动创建对象的控制权，交由Spring框架来管理。** IoC 在其他语言中也有应用，并非 Spring 特有。 **IoC 容器是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个Map（key，value）,Map 中存放的是各种对象。**

将对象之间的相互依赖关系交给 IoC 容器来管理，并由 IoC 容器完成对象的注入。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。 **IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。** 在实际项目中一个 Service 类可能有几百甚至上千个类作为它的底层，假如我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IoC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。

### 什么是 Spring IOC 容器？

Spring 框架的核心是 Spring 容器。容器创建对象，将它们装配在一起，配置它们并管理它们的完整生命周期。Spring 容器使用依赖注入来管理组成应用程序的组件。容器通过读取提供的配置元数据来接收对象进行实例化，配置和组装的指令。该元数据可以通过 XML，Java 注解或 Java 代码提供。

![container magic](https://docs.spring.io/spring/docs/5.0.18.RELEASE/spring-framework-reference/images/container-magic.png)

### 什么是依赖注入？

**依赖注入（DI,Dependency Injection）是在编译阶段尚未知所需的功能是来自哪个的类的情况下，将其他对象所依赖的功能对象实例化的模式**。这就需要一种机制用来激活相应的组件以提供特定的功能，所以**依赖注入是控制反转的基础**。否则如果在组件不受框架控制的情况下，框架又怎么知道要创建哪个组件？

依赖注入有以下三种实现方式：

1. 构造器注入
2. Setter方法注入（属性注入）
3. 接口注入

### Spring 中有多少种 IOC 容器？

在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前，必须对它进行实例化。只有在容器实例化后， 才可以从 IOC 容器里获取 Bean 实例并使用

Spring 提供了两种类型的 IOC 容器实现

- BeanFactory：IOC 容器的基本实现
- ApplicationContext：提供了更多的高级特性，是 BeanFactory 的子接口

BeanFactory 是 Spring 框架的基础设施，面向 Spring 本身；ApplicationContext 面向使用 Spring 框架的开发者，几乎所有的应用场合都直接使用 ApplicationContext 而非底层的 BeanFactory；

无论使用何种方式, 配置文件是相同的。



还是从最简单的 hello world 来看

```java
ApplicationContext ac = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
Hello hello = (Hello)ac.getBean("hello");
hello.sayHello();
```

这个从写法上我们可以知道从 ClassPath 中寻找 xml 配置文件，然后根据 xml 文件的内容来构建ApplicationContext 对象实例（容器），然后通过容器获取一个叫”hello“的bean，执行该bean 的 sayHello 方法。

当然我们之前也知道这不是唯一的构建容器方式，如下。

![javadoop.com](https://www.javadoop.com/blogimages/spring-context/1.png)

我们先来说说 BeanFactory

### BeanFactory

BeanFactory，从名字上可以看出来它是 bean 的工厂，它负责生产和管理各个 bean 实例。

![2](https://user-gold-cdn.xitu.io/2018/10/16/1667c977252c3284?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)





**启动过程分析**

第一步，我们肯定要从 ClassPathXmlApplicationContext 的构造方法说起。

```java
public ClassPathXmlApplicationContext(
      String[] configLocations, boolean refresh, @Nullable ApplicationContext parent)
      throws BeansException {

   super(parent);
   // 根据提供的路径，处理成配置文件数组(以分号、逗号、空格、tab、换行符分割)
   setConfigLocations(configLocations);
   if (refresh) {
      refresh();
   }
}
```

接下来，就是 refresh()，这里简单说下为什么是 refresh()，而不是 init() 这种名字的方法。因为 ApplicationContext 建立起来以后，其实我们是可以通过调用 refresh() 这个方法重建的，refresh() 会将原来的 ApplicationContext 销毁，然后再重新执行一次初始化操作。

```java
@Override
public void refresh() throws BeansException, IllegalStateException {
   // 来个锁，不然 refresh() 还没结束，你又来个启动或销毁容器的操作，那不就乱套了嘛
   synchronized (this.startupShutdownMonitor) {
      //一些准备操作，记录下容器的启动时间、标记“已启动”状态、处理配置文件中的占位符
      prepareRefresh();

      // Tell the subclass to refresh the internal bean factory.
      ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

      // Prepare the bean factory for use in this context.
      prepareBeanFactory(beanFactory);

      try {
         // Allows post-processing of the bean factory in context subclasses.
         postProcessBeanFactory(beanFactory);

         // Invoke factory processors registered as beans in the context.
         invokeBeanFactoryPostProcessors(beanFactory);

         // Register bean processors that intercept bean creation.
         registerBeanPostProcessors(beanFactory);

         // Initialize message source for this context.
         initMessageSource();

         // Initialize event multicaster for this context.
         initApplicationEventMulticaster();

         // Initialize other special beans in specific context subclasses.
         onRefresh();

         // Check for listener beans and register them.
         registerListeners();

         // Instantiate all remaining (non-lazy-init) singletons.
         finishBeanFactoryInitialization(beanFactory);

         // Last step: publish corresponding event.
         finishRefresh();
      }

      catch (BeansException ex) {
         if (logger.isWarnEnabled()) {
            logger.warn("Exception encountered during context initialization - " +
                  "cancelling refresh attempt: " + ex);
         }

         // Destroy already created singletons to avoid dangling resources.
         destroyBeans();

         // Reset 'active' flag.
         cancelRefresh(ex);

         // Propagate exception to caller.
         throw ex;
      }

      finally {
         // Reset common introspection caches in Spring's core, since we
         // might not ever need metadata for singleton beans anymore...
         resetCommonCaches();
      }
   }
}
```













Spring IOC通过引入xml配置，由IOC容器来管理对象的生命周期,依赖关系等。

![img](https://picb.zhimg.com/50/v2-035f3673ab0c762f3f5fb2ba09573a72_hd.jpg?source=1940ef5c)![img](https://picb.zhimg.com/80/v2-035f3673ab0c762f3f5fb2ba09573a72_720w.jpg?source=1940ef5c)

从图中可以看出，我们以前获取两个有依赖关系的对象，要用set方法，而用容器之后，它们之间的关系就由容器来管理。那么，Spring容器的加载过程是什么样的呢?

![img](https://pic1.zhimg.com/50/v2-3ef45ea35401ffbdc432fa42ad025b96_hd.jpg?source=1940ef5c)![img](https://pic1.zhimg.com/80/v2-3ef45ea35401ffbdc432fa42ad025b96_720w.jpg?source=1940ef5c)

 BeanDefinition是一个接口，用于属性承载，比如<bean>元素标签拥有class、scope、lazy-init等配置。bean的定义方式有千千万万种，无论是何种标签，无论是何种资源定义，无论是何种容器，只要按照Spring的规范编写xml配置文件，最终的bean定义内部表示都将转换为内部的唯一结构：BeanDefinition。当BeanDefinition注册完毕以后，Spring的BeanFactory就可以随时根据需要进行实例化了。





## 2.ApplicationContext与BeanFactory探究.

实例化的工作会在容器启动后过 AbstractApplicationContext 中 refresh方法自动进行。我们常用的ApplicationContext 实现类 ClassPathXmlApplicationContext继承了AbstractApplicationContext类，继承关系如下图.

![img](https://pic1.zhimg.com/50/v2-7277317c9434645b9f6efb95d295d25b_hd.jpg?source=1940ef5c)![img](https://pic1.zhimg.com/80/v2-7277317c9434645b9f6efb95d295d25b_720w.jpg?source=1940ef5c)

AbstractApplicationContext里的reflash方法是Spring初始IOC容器一个非常重要的方法，不管你是ApplicationContext 哪个实现类，最终都会进入这个方法。

```java
@Override  
    public void refresh() throws BeansException, IllegalStateException {  
        synchronized (this.startupShutdownMonitor) {  
            // 设置和校验系统变量和环境变量的值
            prepareRefresh();  

            //主要是创建beanFactory，同时加载配置文件.xml中的beanDefinition  
            //通过String[] configLocations = getConfigLocations()获取资源路径，然后加载beanDefinition  
            ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();  


            //给beanFactory注册一些标准组建，如ClassLoader，StandardEnvironment，BeanProcess  
            prepareBeanFactory(beanFactory);  

            try {  

                //提供给子类实现一些postProcess的注册，如AbstractRefreshableWebApplicationContext注册一些Servlet相关的  
                //postProcess，真对web进行生命周期管理的Scope，通过registerResolvableDependency()方法注册指定ServletRequest，HttpSession，WebRequest对象的工厂方法  
                postProcessBeanFactory(beanFactory);  

                //调用所有BeanFactoryProcessor的postProcessBeanFactory()方法  
                invokeBeanFactoryPostProcessors(beanFactory);  

                //注册BeanPostProcessor，BeanPostProcessor作用是用于拦截Bean的创建  
                registerBeanPostProcessors(beanFactory);  

                //初始化消息Bean  
                initMessageSource();  

                //初始化上下文的事件多播组建，ApplicationEvent触发时由multicaster通知给ApplicationListener  
                initApplicationEventMulticaster();  

                //ApplicationContext初始化一些特殊的bean  
                onRefresh();  

                //注册事件监听器，事件监听Bean统一注册到multicaster里头，ApplicationEvent事件触发后会由multicaster广播  
                registerListeners();  

                //非延迟加载的单例Bean实例化  
                finishBeanFactoryInitialization(beanFactory);  

                finishRefresh();  
            }  

            catch (BeansException ex) {  
                logger.warn("Exception encountered during context initialization - cancelling refresh attempt", ex);  

                destroyBeans();  

                cancelRefresh(ex);  

                throw ex;  
            }  
        }  
    }
```

​       代码逻辑清晰的值得mark一下。这个方法的作用是创建加载Spring容器配置（包括.xml配置，property文件和数据库模式等）。

​        BeanFactory体系结构是典型的工厂方法模式，即什么样的工厂生产什么样的产品。要知道工厂是如何产生对象的，我们需要看具体的IOC容器实现，具体的实现有：如 DefaultListableBeanFactory 、 XmlBeanFactory 、 ApplicationContext 等。那么，究竟BeanFactory里到底是什么样的呢？

```java
package org.springframework.beans.factory;

public interface BeanFactory {

    /**
     * 用来引用一个实例，或把它和工厂产生的Bean区分开，就是说，如果一个FactoryBean的名字为a，那么，&a会得到那个Factory
     */
    String FACTORY_BEAN_PREFIX = "&";

    /*
     * 四个不同形式的getBean方法，获取实例
     */
    Object getBean(String name) throws BeansException;

    <T> T getBean(String name, Class<T> requiredType) throws BeansException;

    <T> T getBean(Class<T> requiredType) throws BeansException;

    Object getBean(String name, Object... args) throws BeansException;

    boolean containsBean(String name); // 是否存在

    boolean isSingleton(String name) throws NoSuchBeanDefinitionException;// 是否为单实例

    boolean isPrototype(String name) throws NoSuchBeanDefinitionException;// 是否为原型（多实例）

    boolean isTypeMatch(String name, Class<?> targetType)
            throws NoSuchBeanDefinitionException;// 名称、类型是否匹配

    Class<?> getType(String name) throws NoSuchBeanDefinitionException; // 获取类型

    String[] getAliases(String name);// 根据实例的名字获取实例的别名

}
```

​      我们可以看出BeanFactory里只对IOC容器的基本行为作了定义，根本不关心你的bean是如何定义怎样加载的，它规定了所有的容器至少需要实现的标准。说到实现，BeanFactory有几个比较重要的实现类需要知道，ref：[【Spring4揭秘 BeanFactory】基本容器-BeanFactory](https://link.zhihu.com/?target=http%3A//blog.csdn.net/u011179993/article/details/51636742)。那么BeanFactory的基本实现类XmlBeanFactory与我们常用的ApplicationContext有什么区别呢?答案是bean的加载。

## 3.bean的加载。

​         我们先看一道面试经常会问到的问题:**Spring的bean在什么时候实例化?** ——第一：如果你使用BeanFactory，如XmlBeanFactory作为Spring Bean的工厂类，则所有的bean都是在第一次使用该bean的时候实例化 。第二：如果你使用ApplicationContext作为Spring Bean的工厂类，则又分为以下几种情况： 

​      1.如果bean的scope是singleton的，并且lazy-init为false（默认是false，所以可以不用设置），则ApplicationContext启动的时候就实例化该bean，并且将实例化的bean放在一个线程安全的 ConcurrentHashMap 结构的缓存中，下次再使用该Bean的时候，直接从这个缓存中取 。

​       2.如果bean的scope是singleton的，并且lazy-init为true，则该bean的实例化是在第一次使用该bean的时候进行实例化 。

​      3.如果bean的scope是prototype的，则该bean的实例化是在第一次使用该Bean的时候进行实例化 。

ClassPathXmlApplicationContext有几个重载的构造函数最终都会调用父类AbstractApplicationContext的reflash方法，reflash方法在前文有介绍，作用是创建加载Spring容器配置。AbstractApplicationContext也有getBean方法：

```java
AbstractApplicationContext下的代码：
public Object getBean(String name) throws BeansException {
        //Bean的获取外部容器交给了内部容器
        return getBeanFactory().getBean(name);
}
```

内部容器由DefaultListableBeanFactory承当，但真实的getBean方法实现是由其父类AbstractBeanFactory实现的，AbstractBeanFactory类同样实现了BeanFactory接口的方法，它有四个重载的getBean方法，不管哪一个都会去调用doGetBean方法：

![img](https://pic3.zhimg.com/50/v2-1399fa8d35b3f3c516f811b0d51895af_hd.jpg?source=1940ef5c)![img](https://pic3.zhimg.com/80/v2-1399fa8d35b3f3c516f811b0d51895af_720w.jpg?source=1940ef5c)

![img](https://pic3.zhimg.com/50/v2-4bde828630325f9fda2e9fa3f4ac2a80_hd.jpg?source=1940ef5c)![img](https://pic3.zhimg.com/80/v2-4bde828630325f9fda2e9fa3f4ac2a80_720w.jpg?source=1940ef5c)

那么doGetBean里干了什么事情呢？

```java
protected <T> T doGetBean(
			final String name, final Class<T> requiredType, final Object[] args, boolean typeCheckOnly)
			throws BeansException { 
//bean name处理，去除FactoryBean前缀等  
     final String beanName = transformedBeanName(name);  
     Object bean = null;  

//先从singleton缓存中查看是否已经实例化过该Bean，根据是否有缓存分为两个分支分别处理  
    Object sharedInstance = getSingleton(beanName);  
    if (sharedInstance != null && args == null) {  
// 分支一，若缓存中获取到了并且该BeanDefinition信息表明该bean是singleton的，直接将获取到的缓存Bean  
//(有可能是半成品)交给getObjectForBeanInstance处理  
 /*.........省略logger部分代码............*/  
//调用getObjectForBeanInstance处理  
     bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);  
    }else {  
// 分之二：没有缓存，则需要从头实例化该bean  
            // We're assumably within a circular reference.  
      if (isPrototypeCurrentlyInCreation(beanName)) {   
           throw new BeanCurrentlyInCreationException(beanName);}  

// 检查BeanDefinition是否在当前工厂或父工厂  
            BeanFactory parentBeanFactory = getParentBeanFactory();  
            if (parentBeanFactory != null && !containsBeanDefinition(beanName)) {  
                // Not found -> check parent.  
                String nameToLookup = originalBeanName(name);  
                if (args != null) {  
// 父工厂getBean  
                    return parentBeanFactory.getBean(nameToLookup, args);  
                }  
                else {  
                    // No args -> delegate to standard getBean method.  
                    return parentBeanFactory.getBean(nameToLookup, requiredType);  
                }  
            }  
//将bean加入“正在创建”的集合，完成后会remove,对应afterSingletonCreation/afterPrototypeCreation方法  
            if (!typeCheckOnly) {  
                markBeanAsCreated(beanName);  
            }  

            final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);  
            checkMergedBeanDefinition(mbd, beanName, args);  

// 解决依赖关系，将依赖的bean提前实例化  
            String[] dependsOn = mbd.getDependsOn();  
            if (dependsOn != null) {  
                for (int i = 0; i < dependsOn.length; i++) {  
                    String dependsOnBean = dependsOn[i];  
                    getBean(dependsOnBean);  
                    registerDependentBean(dependsOnBean, beanName);  
                }  
            }  

// 这里又需要根据bean的类型分为三种情况：singleton、prototype、request/session  
            if (mbd.isSingleton()) {  
                           //通过自定义ObjectFactory实例化Bean，此结果可能是半成品(是FactoryBean等)  
                sharedInstance = getSingleton(beanName, new ObjectFactory() {  
                    public Object getObject() throws BeansException {  
                        try {  
                          //真正实例化装配的逻辑在createBean方法中  
                            return createBean(beanName, mbd, args);  
                        }  
                        catch (BeansException ex) {   
                            destroySingleton(beanName);  
                            throw ex;  
                        }  
                    }  
                });  
                        //上一步半成品的Bean交给getObjectForBeanInstance方法处理  
                bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);  
            }  

            else if (mbd.isPrototype()) {  
                Object prototypeInstance = null;  
                try {  
                    beforePrototypeCreation(beanName);  
                     //真正实例化装配的逻辑在createBean方法中  
                    prototypeInstance = createBean(beanName, mbd, args);  
                }  
                finally {  
                    afterPrototypeCreation(beanName);  
                }  
                    //上一步半成品的Bean交给getObjectForBeanInstance方法处理  
               bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);  
            }  

            else {  
                            //request、session 的bean  
                String scopeName = mbd.getScope();  
                final Scope scope = (Scope) this.scopes.get(scopeName);  
                if (scope == null) {  
        throw new IllegalStateException("No Scope registered for scope '" + scopeName + "'");  
                }  
                try {  
                    Object scopedInstance = scope.get(beanName, new ObjectFactory() {  
                        public Object getObject() throws BeansException {  
                            beforePrototypeCreation(beanName);  
                            try {  
                         //真正实例化装配的逻辑在createBean方法中  
                                return createBean(beanName, mbd, args);  
                            }  
                            finally {  
                                afterPrototypeCreation(beanName);  
                            }  
                        }  
                    });  
                       //上一步半成品的Bean交给getObjectForBeanInstance方法处理  
                bean = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);  
                }  
                catch (IllegalStateException ex) {  
                    throw new BeanCreationException(beanName,  
                "Scope '" + scopeName + "' is not active for the current thread; " +  
    "consider defining a scoped proxy for this bean if you intend to refer to it from a singleton",  
                            ex);  
                }  
            }  
        }  

        if (requiredType != null && bean != null &&  
                              !requiredType.isAssignableFrom(bean.getClass())) {  
            throw new BeanNotOfRequiredTypeException(name, requiredType, bean.getClass());  
        }  
        return bean;  
    }
```

   bean的加载经历了一个复杂的过程，上面代码主要做了以下几件事(此段摘抄自[《Spring源码深度解析》](https://link.zhihu.com/?target=https%3A//pan.baidu.com/s/1jGxdGTg))：

​       1.转换对应的beanName。如果name=“&aa”的，会去除&符号。或者<bean>标签带有alias（别名的意思），则取alias所表示最终的beanName。

​        2.尝试从缓存中加载单例bean。如果加载不成功，会再次尝试从singletonFactories中加载。

​       3.bean的实例化。假如我们需要对工厂bean进行处理，那么这里得到的其实是工厂bean 的初始状态。真正干活的则是getObjectForBeanInstance定义factory-method方法返回的bean。

​       4.原型模式的依赖检查。如果A类有B的属性，B中有A的属性，则会产生循环依赖。[spring如何解决循环依赖问题](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/bhlsheji/p/5208076.html)

​       5.将存储的Xml配置文件的GernericBeanDefinition转换为RootBeanDefinition。前文提到的用于承载属性的BeanDefinition有三个实现，GernericBeanDefinition，RootBeanDefinition和ChildBeanDefinition，如果父类bean不为空的话，这里会把所有的属性一并合并父类属性，因为后续所有的Bean都是针对RootBeanDefinition的。

​       6.寻找依赖。在初始化一个bean的时候，会首先初始化这个bean所对应的依赖。

​       7.根据不同的scope创建bean。scope属性默认是singleton，还有prototype、request等。

​       8.类型转换。如果bean是个String，而requiredType传入了Integer，然后返回bean，加载结束。

其中,最重要的步骤是(7),spring的常用特性都在那里实现.

## 4.FactoryBean

​       首先要分辨BeanFactory 与 FactoryBean的区别， 两个名字很像，所以容易搞混。这里做一个简单的比喻你就明白了：

​        1.FactoryBean：工厂类接口，用户可以通过实现该接口定制实例化 bean的逻辑。我们把bean比作是人，那么FactoryBean则是女娲，首先它本身有人的特征，但它能够生产人。

​        2.BeanFactory ：BeanFactory定义了 IOC 容器的最基本形式。如果bean还比作是人，那么它可以理解成三界，三界里有各种功能的人，它是一个容器，可以管理很多的人。

FactoryBean里干了什么事情？

```java
public interface FactoryBean<T> {

    //返回由FactoryBean创建的Bean实例,如果isSingleton返回true,则该实例会放到spring容器中单例缓存池中.
	T getObject() throws Exception;

   //返回FactoryBean创建的bean类型.
	Class<?> getObjectType();

    //返回由FactoryBean创建的bean实例的作用域是singleton还是prototype
	boolean isSingleton();

}
```

它的作用不在这里做阐述，ref：[Spring的FactoryBean使用](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/quanyongan/p/4133724.html)

写到这里,博主总结一下阅读Spring源码的心得:

​     1.学习Spring思想和编码规范。Spring的很多函数代码量大，逻辑复杂,而Spring的编码风格就是将复杂的逻辑分解，分成N个小函数的嵌套，每一层都是对下一层的总结和概要。博主在工作中最佩服的一个大神说过：学习Spring源码思想为我所用，哪怕是一天学习一个变量名，他在工作中设计很多小组件的时候都是基于Spring思想和规范。他说，不要迷茫学什么技术，其实每天只要进步一点点就好，突破的是自己，而不是某个领域。用10年其实才敢说入门一门技术。

   2.跟了Spring代码的函数，你会或多或少发现一些规律：一个真正干活的函数其实是以do开头的，如doGetBean，而给我们错觉的函数，如getBean和createBean等等方法，其实只是从全局角度做一些统筹工作。

​    3.放弃阅读源码是一个不明智的选择，因为你失去了跟大师学习的机会。当你硬着头皮读完一个框架的源码，则其他框架都是相通的。

​    \4. 因为篇幅有限,而博主的已经搞了一天代码，手已经快练成麒麟臂，AOP又是一个重要且内容比较多的部分，所以打算以后再更新Spring AOP是什么？可以做什么？









https://www.zhihu.com/question/21346206/answer/366816411



Spring IOC 容器源码分析 https://juejin.im/post/6844903694039793672#heading-7