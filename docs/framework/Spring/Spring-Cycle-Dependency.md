---
title: 烂了大街的 Spring 循环依赖问题，你觉得自己会了吗
date: 2022-06-09
tags: 
 - spring
categories: spring
---

> 文章已收录在 GitHub [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N 线互联网开发、面试必备技能兵器谱，笔记自取。
>
> 微信搜「 **JavaKeeper** 」程序员成长充电站，互联网技术武道场。无套路领取 500+ 本电子书和 30+ 视频教学和源码。

![](https://img.starfish.ink/spring/20200902192731.png)

## 前言

循环依赖问题，算是一道烂大街的面试题了，解毒之前，我们先来回顾两个知识点：

初学 Spring 的时候，我们就知道 IOC，控制反转么，它将原本在程序中手动创建对象的控制权，交由 Spring 框架来管理，不需要我们手动去各种 `new XXX`。

尽管是 Spring 管理，不也得创建对象吗， Java 对象的创建步骤很多，可以 `new XXX`、序列化、`clone()` 等等， 只是 Spring  是通过反射 + 工厂的方式创建对象并放在容器的，创建好的对象我们一般还会对对象属性进行赋值，才去使用，可以理解是分了两个步骤。

好了，对这两个步骤有个印象就行，接着我们进入循环依赖，先说下循环依赖的概念

### 什么是循环依赖

所谓的循环依赖是指，A 依赖 B，B 又依赖 A，它们之间形成了循环依赖。或者是 A 依赖 B，B 依赖 C，C 又依赖 A，形成了循环依赖。更或者是自己依赖自己。它们之间的依赖关系如下：

![](https://img.starfish.ink/spring/cycle-demo.png)

这里以两个类直接相互依赖为例，他们的实现代码可能如下：

```java
public class BeanB {
    private BeanA beanA;
    public void setBeanA(BeanA beanA) {
		this.beanA = beanA;
	}
}

public class BeanA {
    private BeanB beanB;
    public void setBeanB(BeanB beanB) {
        this.beanB = beanB;
	}
}
```

配置信息如下（用注解方式注入同理，只是为了方便理解，用了配置文件）：

```java
<bean id="beanA" class="priv.starfish.BeanA">
  <property name="beanB" ref="beanB"/>
</bean>

<bean id="beanB" class="priv.starfish.BeanB">
  <property name="beanA" ref="beanA"/>
</bean>
```

Spring 启动后，读取如上的配置文件，会按顺序先实例化 A，但是创建的时候又发现它依赖了 B，接着就去实例化 B ，同样又发现它依赖了 A ，这尼玛咋整？无限循环呀

Spring “肯定”不会让这种事情发生的，如前言我们说的 Spring 实例化对象分两步，第一步会先创建一个原始对象，只是没有设置属性，可以理解为"半成品"—— 官方叫 A 对象的早期引用（EarlyBeanReference），所以当实例化 B 的时候发现依赖了 A， B 就会把这个“半成品”设置进去先完成实例化，既然 B 完成了实例化，所以 A 就可以获得 B 的引用，也完成实例化了，这其实就是 Spring 解决循环依赖的思想。

![有点懵逼](https://i04piccdn.sogoucdn.com/7332d8fe139e38e4)



不理解没关系，先有个大概的印象，然后我们从源码来看下 Spring 具体是怎么解决的。



## 源码解毒

> 代码版本：5.0.16.RELEASE

在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前, 必须对它进行实例化。只有在容器实例化后，才可以从 IOC 容器里获取 Bean 实例并使用，循环依赖问题也就是发生在实例化 Bean 的过程中的，所以我们先回顾下获取 Bean 的过程。

### 获取 Bean 流程

Spring IOC 容器中获取 bean 实例的简化版流程如下（排除了各种包装和检查的过程）

![](https://img.starfish.ink/spring/20200901094342.png)

大概的流程顺序（可以结合着源码看下，我就不贴了，贴太多的话，呕~呕呕，想吐）：

1. 流程从 `getBean` 方法开始，`getBean` 是个空壳方法，所有逻辑直接到 `doGetBean` 方法中
2. `transformedBeanName` 将 name 转换为真正的 beanName（name 可能是 FactoryBean 以 & 字符开头或者有别名的情况，所以需要转化下）
3. 然后通过 `getSingleton(beanName)` 方法尝试从缓存中查找是不是有该实例 sharedInstance（单例在 Spring 的同一容器只会被创建一次，后续再获取 bean，就直接从缓存获取即可）
4. 如果有的话，sharedInstance 可能是完全实例化好的 bean，也可能是一个原始的 bean，所以再经 `getObjectForBeanInstance` 处理即可返回
5. 当然 sharedInstance 也可能是 null，这时候就会执行创建 bean 的逻辑，将结果返回



第三步的时候我们提到了一个缓存的概念，这个就是 Spring 为了解决单例的循环依赖问题而设计的 **三级缓存**

```java
/** Cache of singleton objects: bean name --> bean instance */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

/** Cache of singleton factories: bean name --> ObjectFactory */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);

/** Cache of early singleton objects: bean name --> bean instance */
private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);
```

这三级缓存的作用分别是：

- `singletonObjects`：完成初始化的单例对象的 cache，这里的 bean 经历过 `实例化->属性填充->初始化` 以及各种后置处理（一级缓存）

- `earlySingletonObjects`：存放原始的 bean 对象（**完成实例化但是尚未填充属性和初始化**），仅仅能作为指针提前曝光，被其他 bean 所引用，用于解决循环依赖的 （二级缓存）

- `singletonFactories`：在 bean 实例化完之后，属性填充以及初始化之前，如果允许提前曝光，Spring 会将实例化后的 bean 提前曝光，也就是把该 bean 转换成 `beanFactory` 并加入到 `singletonFactories`（三级缓存）

我们首先从缓存中试着获取 bean，就是从这三级缓存中查找

```java
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    // 从 singletonObjects 获取实例，singletonObjects 中的实例都是准备好的 bean 实例，可以直接使用
    Object singletonObject = this.singletonObjects.get(beanName);
    //isSingletonCurrentlyInCreation() 判断当前单例bean是否正在创建中
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            // 一级缓存没有，就去二级缓存找
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                // 二级缓存也没有，就去三级缓存找
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    // 三级缓存有的话，就把他移动到二级缓存,.getObject() 后续会讲到
                    singletonObject = singletonFactory.getObject();
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return singletonObject;
}
```



如果缓存没有的话，我们就要创建了，接着我们以单例对象为例，再看下创建 bean 的逻辑（大括号表示内部类调用方法）：

![spring-createbean](https://img.starfish.ink/spring/spring-createbean.png)

1. 创建 bean 从以下代码开始，一个匿名内部类方法参数（总觉得 Lambda 的方式可读性不如内部类好理解）

   ```java
   if (mbd.isSingleton()) {
       sharedInstance = getSingleton(beanName, () -> {
           try {
               return createBean(beanName, mbd, args);
           }
           catch (BeansException ex) {
               destroySingleton(beanName);
               throw ex;
           }
       });
       bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
   }
   ```

   `getSingleton()` 方法内部主要有两个方法

   ```java
   public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
       // 创建 singletonObject
   	singletonObject = singletonFactory.getObject();
       // 将 singletonObject 放入缓存
       addSingleton(beanName, singletonObject);
   }
   ```

2. `getObject()` 匿名内部类的实现真正调用的又是 `createBean(beanName, mbd, args)`
3. 往里走，主要的实现逻辑在 `doCreateBean`方法，先通过 `createBeanInstance` 创建一个原始 bean 对象
4. 接着 `addSingletonFactory` 添加 bean 工厂对象到 singletonFactories 缓存（三级缓存）
5. 通过 `populateBean` 方法向原始 bean 对象中填充属性，并解析依赖，假设这时候创建 A 之后填充属性时发现依赖 B，然后创建依赖对象 B 的时候又发现依赖 A，还是同样的流程，又去 `getBean(A)`，这个时候三级缓存已经有了 beanA 的“半成品”，这时就可以把 A 对象的原始引用注入 B 对象（并将其移动到二级缓存）来解决循环依赖问题。这时候 `getObject()` 方法就算执行结束了，返回完全实例化的 bean
6. 最后调用 `addSingleton` 把完全实例化好的 bean 对象放入 singletonObjects 缓存（一级缓存）中，打完收工



### Spring 解决循环依赖

建议搭配着“源码”看下边的逻辑图，更好下饭

![](https://img.starfish.ink/spring/cycle-dependency-code.png)

流程其实上边都已经说过了，结合着上图我们再看下具体细节，用大白话再捋一捋：

1. Spring 创建 bean 主要分为两个步骤，创建原始 bean 对象，接着去填充对象属性和初始化
2. 每次创建 bean 之前，我们都会从缓存中查下有没有该 bean，因为是单例，只能有一个
3. 当我们创建 beanA 的原始对象后，并把它放到三级缓存中，接下来就该填充对象属性了，这时候发现依赖了 beanB，接着就又去创建 beanB，同样的流程，创建完 beanB 填充属性时又发现它依赖了 beanA，又是同样的流程，不同的是，这时候可以在三级缓存中查到刚放进去的原始对象 beanA，所以不需要继续创建，用它注入 beanB，完成 beanB 的创建
4. 既然 beanB 创建好了，所以 beanA 就可以完成填充属性的步骤了，接着执行剩下的逻辑，闭环完成

这就是单例模式下 Spring 解决循环依赖的流程了。

但是这个地方，不管是谁看源码都会有个小疑惑，为什么需要三级缓存呢，我赶脚二级他也够了呀

> 革命尚未成功，同志仍需努力

跟源码的时候，发现在创建 beanB 需要引用 beanA 这个“半成品”的时候，就会触发"前期引用"，即如下代码：

```java
ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
if (singletonFactory != null) {
    // 三级缓存有的话，就把他移动到二级缓存
    singletonObject = singletonFactory.getObject();
    this.earlySingletonObjects.put(beanName, singletonObject);
    this.singletonFactories.remove(beanName);
}
```

`singletonFactory.getObject()` 是一个接口方法，这里具体的实现方法在

```java
protected Object getEarlyBeanReference(String beanName, RootBeanDefinition mbd, Object bean) {
    Object exposedObject = bean;
    if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
        for (BeanPostProcessor bp : getBeanPostProcessors()) {
            if (bp instanceof SmartInstantiationAwareBeanPostProcessor) {
                SmartInstantiationAwareBeanPostProcessor ibp = (SmartInstantiationAwareBeanPostProcessor) bp;
                // 这么一大段就这句话是核心，也就是当bean要进行提前曝光时，
                // 给一个机会，通过重写后置处理器的getEarlyBeanReference方法，来自定义操作bean
                // 值得注意的是，如果提前曝光了，但是没有被提前引用，则该后置处理器并不生效!!!
                // 这也正式三级缓存存在的意义，否则二级缓存就可以解决循环依赖的问题
                exposedObject = ibp.getEarlyBeanReference(exposedObject, beanName);
            }
        }
    }
    return exposedObject;
}
```

这个方法就是 Spring 为什么使用三级缓存，而不是二级缓存的原因，它的目的是为了后置处理，如果没有 AOP 后置处理，就不会走进 if 语句，直接返回了 exposedObject ，相当于啥都没干，二级缓存就够用了。

所以又得出结论，这个三级缓存应该和 AOP 有关系，继续。

在 Spring 的源码中`getEarlyBeanReference` 是 `SmartInstantiationAwareBeanPostProcessor` 接口的默认方法，真正实现这个方法的只有**`AbstractAutoProxyCreator`** 这个类，用于提前曝光的 AOP 代理。

```java
@Override
public Object getEarlyBeanReference(Object bean, String beanName) throws BeansException {
   Object cacheKey = getCacheKey(bean.getClass(), beanName);
   this.earlyProxyReferences.put(cacheKey, bean);
   // 对bean进行提前Spring AOP代理
   return wrapIfNecessary(bean, beanName, cacheKey);
}
```

这么说有点干，来个小 demo 吧，我们都知道 **Spring AOP、事务**等都是通过代理对象来实现的，而**事务**的代理对象是由自动代理创建器来自动完成的。也就是说 Spring 最终给我们放进容器里面的是一个代理对象，**而非原始对象**，假设我们有如下一段业务代码：

```java
@Service
public class HelloServiceImpl implements HelloService {
   @Autowired
   private HelloService helloService;

   @Override
   @Transactional
   public Object hello() {
      return "Hello JavaKeeper";
   }
}
```

此 `Service` 类使用到了事务，所以最终会生成一个 JDK 动态代理对象 `Proxy`。刚好它又存在**自己引用自己**的循环依赖，完美符合我们的场景需求。

我们再自定义一个后置处理，来看下效果：

```java
@Component
public class HelloProcessor implements SmartInstantiationAwareBeanPostProcessor {

	@Override
	public Object getEarlyBeanReference(Object bean, String beanName) throws BeansException {
		System.out.println("提前曝光了："+beanName);
		return bean;
	}
}
```

可以看到，调用方法栈中有我们自己实现的 `HelloProcessor`，说明这个 bean 会通过 AOP 代理处理。

![](https://img.starfish.ink/spring/getEarlyBeanReference-code.png)

再从源码看下这个自己循环自己的 bean 的创建流程：

```java
protected Object doCreateBean( ... ){
	...
	
	boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences && isSingletonCurrentlyInCreation(beanName));
    // 需要提前暴露（支持循环依赖），就注册一个ObjectFactory到三级缓存
	if (earlySingletonExposure) { 
        // 添加 bean 工厂对象到 singletonFactories 缓存中，并获取原始对象的早期引用
		//匿名内部方法 getEarlyBeanReference 就是后置处理器	
		// SmartInstantiationAwareBeanPostProcessor 的一个方法，
		// 它的功效为：保证自己被循环依赖的时候，即使被别的Bean @Autowire进去的也是代理对象
		addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
	}

	// 此处注意：如果此处自己被循环依赖了  那它会走上面的getEarlyBeanReference，从而创建一个代理对象从		三级缓存转移到二级缓存里
	// 注意此时候对象还在二级缓存里，并没有在一级缓存。并且此时后续的这两步操作还是用的 exposedObject，它仍旧是原始对象~~~
	populateBean(beanName, mbd, instanceWrapper);
	exposedObject = initializeBean(beanName, exposedObject, mbd);

	// 因为事务的AOP自动代理创建器在getEarlyBeanReference 创建代理后，initializeBean 就不会再重复创建了，二选一的）
    	
	// 所以经过这两大步后，exposedObject 还是原始对象，通过 getEarlyBeanReference 创建的代理对象还在三级缓存呢
	
	...
	
	// 循环依赖校验
	if (earlySingletonExposure) {
        // 注意此处第二个参数传的false，表示不去三级缓存里再去调用一次getObject()方法了~~~，此时代理对象还在二级缓存，所以这里拿出来的就是个 代理对象
		// 最后赋值给exposedObject  然后return出去，进而最终被addSingleton()添加进一级缓存里面去  
		// 这样就保证了我们容器里 最终实际上是代理对象，而非原始对象~~~~~
		Object earlySingletonReference = getSingleton(beanName, false);
		if (earlySingletonReference != null) {
			if (exposedObject == bean) { 
				exposedObject = earlySingletonReference;
			}
		}
		...
	}
	
}
```

#### 自我解惑：

##### 问：还是不太懂，为什么这么设计呢，即使有代理，在二级缓存代理也可以吧 | 为什么要使用三级缓存呢？

我们再来看下相关代码，假设我们现在是二级缓存架构，创建 A 的时候，我们不知道有没有循环依赖，所以放入二级缓存提前暴露，接着创建 B，也是放入二级缓存，这时候发现又循环依赖了 A，就去二级缓存找，是有，但是如果此时还有 AOP 代理呢，我们要的是代理对象可不是原始对象，这怎么办，只能改逻辑，在第一步的时候，不管3721，所有 Bean 统统去完成 AOP 代理，如果是这样的话，就不需要三级缓存了，但是这样不仅没有必要，而且违背了 Spring 在结合 `AOP` 跟 Bean 的生命周期的设计。

所以 Spring “多此一举”的将实例先封装到 ObjectFactory 中（三级缓存），主要关键点在 `getObject()` 方法并非直接返回实例，而是对实例又使用 `SmartInstantiationAwareBeanPostProcessor` 的 `getEarlyBeanReference` 方法对 bean 进行处理，也就是说，当 Spring 中存在该后置处理器，所有的单例 bean 在实例化后都会被进行提前曝光到三级缓存中，但是并不是所有的 bean 都存在循环依赖，也就是三级缓存到二级缓存的步骤不一定都会被执行，有可能曝光后直接创建完成，没被提前引用过，就直接被加入到一级缓存中。因此可以确保只有提前曝光且被引用的 bean 才会进行该后置处理。

```java
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    Object singletonObject = this.singletonObjects.get(beanName);
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
             // 三级缓存获取，key=beanName value=objectFactory，objectFactory中存储					//getObject()方法用于获取提前曝光的实例
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    // 三级缓存有的话，就把他移动到二级缓存
                    singletonObject = singletonFactory.getObject();
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return singletonObject;
}


boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
      isSingletonCurrentlyInCreation(beanName));
if (earlySingletonExposure) {
   if (logger.isDebugEnabled()) {
      logger.debug("Eagerly caching bean '" + beanName +
            "' to allow for resolving potential circular references");
   }
   // 添加 bean 工厂对象到 singletonFactories 缓存中，并获取原始对象的早期引用
   //匿名内部方法 getEarlyBeanReference 就是后置处理器
   // SmartInstantiationAwareBeanPostProcessor 的一个方法，
   // 它的功效为：保证自己被循环依赖的时候，即使被别的Bean @Autowire进去的也是代理对象~~~~  AOP自动代理创建器此方法里会创建的代理对象~~~
   addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
}
```



##### 再问：AOP 代理对象提前放入了三级缓存，没有经过属性填充和初始化，这个代理又是如何保证依赖属性的注入的呢？

这个又涉及到了 Spring 中动态代理的实现，不管是`cglib`代理还是`jdk`动态代理生成的代理类，代理时，会将目标对象 target 保存在最后生成的代理 `$proxy` 中，当调用 `$proxy` 方法时会回调 `h.invoke`，而 `h.invoke` 又会回调目标对象 target 的原始方法。所有，其实在 AOP 动态代理时，原始 bean 已经被保存在 **提前曝光代理**中了，之后 `原始 bean` 继续完成`属性填充`和`初始化`操作。因为 AOP 代理`$proxy `中保存着 `traget` 也就是是 `原始bean` 的引用，因此后续 `原始bean` 的完善，也就相当于Spring AOP中的 `target` 的完善，这样就保证了 AOP 的`属性填充`与`初始化`了！



### 非单例循环依赖

看完了单例模式的循环依赖，我们再看下非单例的情况，假设我们的配置文件是这样的：

```xml
<bean id="beanA" class="priv.starfish.BeanA" scope="prototype">
   <property name="beanB" ref="beanB"/>
</bean>

<bean id="beanB" class="priv.starfish.BeanB" scope="prototype">
   <property name="beanA" ref="beanA"/>
</bean>
```

启动 Spring，结果如下：

```java
Error creating bean with name 'beanA' defined in class path resource [applicationContext.xml]: Cannot resolve reference to bean 'beanB' while setting bean property 'beanB';

Error creating bean with name 'beanB' defined in class path resource [applicationContext.xml]: Cannot resolve reference to bean 'beanA' while setting bean property 'beanA';

Caused by: org.springframework.beans.factory.BeanCurrentlyInCreationException: Error creating bean with name 'beanA': Requested bean is currently in creation: Is there an unresolvable circular reference?
```

对于 `prototype` 作用域的 bean，Spring 容器无法完成依赖注入，因为 Spring 容器不进行缓存 `prototype` 作用域的 bean ，因此无法提前暴露一个创建中的bean 。

原因也挺好理解的，原型模式每次请求都会创建一个实例对象，即使加了缓存，循环引用太多的话，就比较麻烦了就，所以 Spring 不支持这种方式，直接抛出异常：

```java
if (isPrototypeCurrentlyInCreation(beanName)) {
   throw new BeanCurrentlyInCreationException(beanName);
}
```



### 构造器循环依赖

上文我们讲的是通过 Setter 方法注入的单例 bean 的循环依赖问题，用 Spring 的小伙伴也都知道，依赖注入的方式还有**构造器注入**、工厂方法注入的方式（很少使用），那如果构造器注入方式也有循环依赖，可以搞不？

我们再改下代码和配置文件

```java
public class BeanA {
   private BeanB beanB;
   public BeanA(BeanB beanB) {
      this.beanB = beanB;
   }
}

public class BeanB {
	private BeanA beanA;
	public BeanB(BeanA beanA) {
		this.beanA = beanA;
	}
}
```

```xml
<bean id="beanA" class="priv.starfish.BeanA">
<constructor-arg ref="beanB"/>
</bean>

<bean id="beanB" class="priv.starfish.BeanB">
<constructor-arg ref="beanA"/>
</bean>
```

执行结果，又是异常

![](https://img.starfish.ink/spring/cycle-dependency-constructor.png)

看看官方给出的说法

> Circular dependencies
>
> If you use predominantly constructor injection, it is possible to create an unresolvable circular dependency scenario.
>
> For example: Class A requires an instance of class B through constructor injection, and class B requires an instance of class A through constructor injection. If you configure beans for classes A and B to be injected into each other, the Spring IoC container detects this circular reference at runtime, and throws a `BeanCurrentlyInCreationException`.
>
> One possible solution is to edit the source code of some classes to be configured by setters rather than constructors. Alternatively, avoid constructor injection and use setter injection only. In other words, although it is not recommended, you can configure circular dependencies with setter injection.
>
> Unlike the typical case (with no circular dependencies), a circular dependency between bean A and bean B forces one of the beans to be injected into the other prior to being fully initialized itself (a classic chicken-and-egg scenario).

大概意思是：

如果您主要使用构造器注入，循环依赖场景是无法解决的。建议你用 setter 注入方式代替构造器注入

其实也不是说只要是构造器注入就会有循环依赖问题，Spring 在创建 Bean 的时候默认是**按照自然排序来进行创建的**，我们暂且把先创建的 bean 叫主 bean，上文的 A 即主 bean，**只要主 bean 注入依赖 bean 的方式是 setter  方式，依赖 bean 的注入方式无所谓，都可以解决，反之亦然**

所以上文我们 AB 循环依赖问题，只要 A 的注入方式是 setter ，就不会有循环依赖问题。

面试官问：为什么呢？ 

**Spring 解决循环依赖依靠的是 Bean 的“中间态”这个概念，而这个中间态指的是已经实例化，但还没初始化的状态。实例化的过程又是通过构造器创建的，如果 A 还没创建好出来，怎么可能提前曝光，所以构造器的循环依赖无法解决，我一直认为应该先有鸡才能有蛋**。





## 小总结 | 面试这么答

#### B 中提前注入了一个没有经过初始化的 A 类型对象不会有问题吗？

虽然在创建 B 时会提前给 B 注入了一个还未初始化的 A 对象，但是在创建 A 的流程中一直使用的是注入到 B 中的 A 对象的引用，之后会根据这个引用对 A 进行初始化，所以这是没有问题的。

#### Spring 是如何解决的循环依赖？

Spring 为了解决单例的循环依赖问题，使用了三级缓存。其中一级缓存为单例池（`singletonObjects`），二级缓存为提前曝光对象（`earlySingletonObjects`），三级缓存为提前曝光对象工厂（`singletonFactories`）。

假设A、B循环引用，实例化 A 的时候就将其放入三级缓存中，接着填充属性的时候，发现依赖了 B，同样的流程也是实例化后放入三级缓存，接着去填充属性时又发现自己依赖 A，这时候从缓存中查找到早期暴露的 A，没有 AOP 代理的话，直接将 A 的原始对象注入 B，完成 B 的初始化后，进行属性填充和初始化，这时候 B 完成后，就去完成剩下的 A 的步骤，如果有 AOP 代理，就进行 AOP 处理获取代理后的对象 A，注入 B，走剩下的流程。

#### 为什么要使用三级缓存呢？二级缓存能解决循环依赖吗？

如果没有 AOP 代理，二级缓存可以解决问题，但是有 AOP 代理的情况下，只用二级缓存就意味着所有 Bean 在实例化后就要完成 AOP 代理，这样违背了 Spring 设计的原则，Spring 在设计之初就是通过 `AnnotationAwareAspectJAutoProxyCreator` 这个后置处理器来在 Bean 生命周期的最后一步来完成 AOP 代理，而不是在实例化后就立马进行 AOP 代理。



### 参考与感谢：

[《Spring 源码深度解析》- 郝佳著](https://book.douban.com/subject/25866350/)

https://developer.aliyun.com/article/766880

http://www.tianxiaobo.com/2018/06/08/Spring-IOC-容器源码分析-循环依赖的解决办法

https://cloud.tencent.com/developer/article/1497692

https://blog.csdn.net/chaitoudaren/article/details/105060882



