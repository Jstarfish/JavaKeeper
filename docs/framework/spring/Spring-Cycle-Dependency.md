## 前言

循环依赖问题，算是一道烂大街的面试题了，解毒之前，我们先来回顾两个知识点：

初学 Spring 的时候，我们就知道 IOC，控制反转么，它将原本在程序中手动创建对象的控制权，交由 Spring 框架来管理，不需要我们手动去各种 `new XXX`。

就算是 Spring 管理，不也得创建对象吗， Java 对象的创建步骤很多，可以 `new XXX`、序列化、`clone()` 等等， 只是 Spring  是通过反射 + 工厂的方式创建对象并放在容器的，创建好的对象我们一般还会对对象属性进行赋值，才去使用，可以理解是分了两个步骤。

好了，有个这概念，方便理解下边的内容，然后我们就说下循环依赖的概念

### 什么是循环依赖

所谓的循环依赖是指，A 依赖 B，B 又依赖 A，它们之间形成了循环依赖。或者是 A 依赖 B，B 依赖 C，C 又依赖 A，形成了循环依赖。如果能写出自己依赖自己的 Javaer，那应该更是个狠角色，它们之间的依赖关系如下：

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200831102205.png)

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

配置信息如下：

```java
<bean id="beanA" class="priv.starfish.BeanA">
  <property name="beanB" ref="beanB"/>
</bean>

<bean id="beanB" class="priv.starfish.BeanB">
  <property name="beanA" ref="beanA"/>
</bean>
```

用注解方式注入同理，只是为了方便理解，用了配置文件。

Spring 启动后，读取如上的配置文件，会按顺序先实例化 A，但是创建的时候又发现它依赖了 B，接着就去实例化 B ，同样又发现它依赖了 A ，这尼玛咋整？无限循环呀

Spring “肯定”不会让这种事情发生的，如前言我们说的 Spring 实例化对象分两步，第一步会先创建一个原始对象，只是没有设置属性，可以理解为"半成品"—— 官方叫 A 对象的早期引用（EarlyBeanReference），所以当实例化 B 的时候发现依赖了 A， B 就会把这个“半成品”设置进去先完成实例化，既然 B 完成了实例化，所以 A 就可以获得 B 的引用，也完成实例化了。

![有点懵逼](https://i04piccdn.sogoucdn.com/7332d8fe139e38e4)



不理解没关系，先有个大概的印象，然后我们从源码来看下 Spring 具体是怎么解决的。



## 源码解毒

> 代码版本：5.0.16.RELEASE

在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前, 必须对它进行实例化。只有在容器实例化后，才可以从 IOC 容器里获取 Bean 实例并使用，循环依赖问题也就是发生在实例化 Bean 的过程中的，所以我们先回顾下获取 Bean 的过程

### 获取 Bean 流程

Spring IOC 容器中获取 bean 实例的简化版流程如下（排除了各种包装和检查的过程）

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200901094342.png)

大概的流程顺序（可以结合着源码看下，我就不贴了，贴太多的话，呕~呕呕，想吐）：

1. 流程从 `getBean` 方法开始，`getBean` 是个空壳方法，所有逻辑直接到 `doGetBean` 方法中
2. `transformedBeanName` 将 name 转换为真正的 beanName（name 可能是 FactoryBean以 & 字符开头或者有别名的情况，所以需要转化下）
3. 然后通过 `getSingleton(beanName)` 方法尝试从缓存缓存中查找是不是有该实例 sharedInstance（单例在 Spring 的同一容器只会被创建一次，后续再获取 bean，就直接从缓存获取即可）
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

- `singletonObjects`：完成初始化的单例对象的 cache，这里的 bean 经历过 实例化->属性填充->初始化 以及各类的后置处理（一级缓存）

- `earlySingletonObjects`：存放原始的 bean 对象（**完成实例化但是尚未填充属性和初始化**），仅仅能作为指针提前曝光，被其他 bean 所引用，用于解决循环依赖的 （二级缓存）

- `singletonFactories`：在 bean 实例化完之后，属性填充以及初始化之前，如果允许提前曝光，Spring 会将实例化后的 bean 提前曝光，也就是把该 bean 转换成 `beanFactory` 并加入到 `singletonFactories`（三级缓存）

我们首先从缓存中试着获取 bean，就是从这三级缓存中查找

```java
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    // 从 singletonObjects 获取实例，singletonObjects 中的实例都是准备好的 bean 实例，可以直接使用
    Object singletonObject = this.singletonObjects.get(beanName);
    //isSingletonCurrentlyInCreation()判断当前单例bean是否正在创建中
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            // 一级缓存没有，就去二级缓存找
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                // 二级缓存也没有，就去三级缓存找
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
```



如果缓存没有的话，我们就要创建了，接着我们以单例对象为例，再看下创建 bean 的逻辑（大括号表示内部类调用方法）：

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200901153322.png)

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
5. 通过 `populateBean` 方法向原始 bean 对象中填充属性，并解析依赖，假设这时候创建 A 之后填充属性时发现依赖 B，然后创建依赖对象 B 的时候又发现依赖 A，还是同样的流程，又去 `getBean(A)`，这个时候三级缓存已经有了 beanA 的“半成品”，这时就可以把 A 对象的原始引用注入 B 对象，来解决循环依赖问题。这时候 getObject() 方法就算执行结束了，返回完全实例化的 bean
6. 最后调用 `addSingleton` 把完全实例化好的 bean 对象放入 singletonObjects 缓存（一级缓存）中，打完收工



### Spring 解决循环依赖

建议搭配着“源码”看下边的逻辑图，更好下饭

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200901174635.png)

流程其实上边都已经说过了，结合者图示我们再看下具体细节嗯，用大白话再捋一捋：

1. Spring 创建 bean 主要分为两个步骤，创建原始 bean 对象，接着去填充对象属性，
2. 每次创建 bean 之前，我们都会从缓存中查下有没有该 bean
3. 当我们创建 beanA 的原始对象后，并把它放到三级缓存中，接下来就该填充对象属性了，这时候发现依赖了 beanB，接着就又去创建 beanB，同样的流程，创建完 beanB 填充属性时又发现它依赖了 beanA，又是同样的流程，不同的是，这时候可以在三级缓存中查到刚放进去的 beanA，所以不需要继续创建，用它注入 beanB，完成 beanB 的创建
4. 既然 beanB 创建好了，接着就可以走 beanA 就可以完成填充属性的步骤了，接着执行剩下的逻辑，闭环完成

这个地方，不管是谁看源码都会有个小疑惑，为什么需要三级缓存呢，我赶脚二级他也够了呀

跟源码的时候，发现在创建 beanB 需要引用 beanA 的前期引用时候，会触发"前期引用"，即如下代码：

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

这个方法就是 Spring 为什么使用三级缓存，而不是二级缓存的原因，它的目的是为了后置处理，如果没有 AOP 后置处理，相当于啥都没干，二级缓存就够用了。

在 Spring 的源码中`getEarlyBeanReference` 是 `SmartInstantiationAwareBeanPostProcessor` 接口的默认方法，真正实现这个方法的只有`AbstractAutoProxyCreator`这个类，用于提前曝光的 AOP 代理。

```java
@Override
public Object getEarlyBeanReference(Object bean, String beanName) throws BeansException {
   Object cacheKey = getCacheKey(bean.getClass(), beanName);
   this.earlyProxyReferences.put(cacheKey, bean);
   // 对bean进行提前Spring AOP代理
   return wrapIfNecessary(bean, beanName, cacheKey);
}
```

可是看出，如果有代理的话，exposedObject 返回的就是代理后的 bean 了，



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

原因也挺好理解的，原型模式每次请求都会创建一个实例对象，循环引用太多的话，傻傻分不清楚，比较麻烦了就，所以 Spring 不支持这种方式，直接抛出异常：

```java
if (isPrototypeCurrentlyInCreation(beanName)) {
   throw new BeanCurrentlyInCreationException(beanName);
}
```



### 构造器循环依赖

上文我们讲的是通过 Setter 方法注入的单例 bean 的循环依赖问题，用 Spring 的小伙伴也都知道，依赖注入的方式还有**构造器注入**、工厂方法注入的方式（很少使用），那如果构造器注入方式也有循环依赖，可以搞不？

我们改下代码和配置文件

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

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200901153526.png)

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

为什么呢？ 因为如果先创建 beanA，实例化的过程是通过构造器创建的，如果 A 还没创建好出来，怎么可能**提前曝光**，典型的先有鸡还是先有蛋。





## 小总结 | 自我解惑

#### B 中提前注入了一个没有经过初始化的 A 类型对象不会有问题吗？

虽然在创建B时会提前给B注入了一个还未初始化的A对象，但是在创建A的流程中一直使用的是注入到B中的A对象的引用，之后会根据这个引用对A进行初始化，所以这是没有问题的。

#### 为什么要使用三级缓存呢？二级缓存能解决循环依赖吗？

如果要使用二级缓存解决循环依赖，意味着所有 Bean 在实例化后就要完成 AOP 代理，这样违背了 Spring 设计的原则，Spring 在设计之初就是通过 `AnnotationAwareAspectJAutoProxyCreator` 这个后置处理器来在 Bean 生命周期的最后一步来完成 AOP 代理，而不是在实例化后就立马进行 AOP 代理

从上文的  `addSingletonFactory` 添加 bean 工厂对象到 singletonFactories 缓存

```java
protected Object getEarlyBeanReference(String beanName, RootBeanDefinition mbd, Object bean) {
   Object exposedObject = bean;
   if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
      for (BeanPostProcessor bp : getBeanPostProcessors()) {
         if (bp instanceof SmartInstantiationAwareBeanPostProcessor) {
            SmartInstantiationAwareBeanPostProcessor ibp = (SmartInstantiationAwareBeanPostProcessor) bp;
            exposedObject = ibp.getEarlyBeanReference(exposedObject, beanName);
         }
      }
   }
   return exposedObject;
}
```

#### Spring是如何解决的循环依赖？

Spring通过三级缓存解决了循环依赖，其中一级缓存为单例池（`singletonObjects`）,二级缓存为早期曝光对象`earlySingletonObjects`，三级缓存为早期曝光对象工厂（`singletonFactories`）。当A、B两个类发生循环引用时，在A完成实例化后，就使用实例化后的对象去创建一个对象工厂，并添加到三级缓存中，如果A被AOP代理，那么通过这个工厂获取到的就是A代理后的对象，如果A没有被AOP代理，那么这个工厂获取到的就是A实例化的对象。当A进行属性注入时，会去创建B，同时B又依赖了A，所以创建B的同时又会去调用getBean(a)来获取需要的依赖，此时的getBean(a)会从缓存中获取，第一步，先获取到三级缓存中的工厂；第二步，调用对象工工厂的getObject方法来获取到对应的对象，得到这个对象后将其注入到B中。紧接着B会走完它的生命周期流程，包括初始化、后置处理器等。当B创建完后，会将B再注入到A中，此时A再完成它的整个生命周期。至此，循环依赖结束！

#### 你们项目中是怎么解决循环依赖问题的？

1. 看是否存在设计逻辑错误问题，如果有的话，修改代码逻辑

2. 改用 Setter/Field 注入的方式注入

3. 使用延迟加载，在注入依赖时，先注入代理对象，当首次使用时再创建对象完成注入，比如

   ```java
   @Component
   public class BeanA {
   
       private BeanB beanB;
   
       @Autowired
       public BeanA(@Lazy BeanB beanB) {
           this.beanB = beanB;
       }
   }
   ```

4.  也可以使用 @PostConstruct 在 Bean 初始化将依赖注入













![image-20200831151812306](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200831151812306.png)





参考：

[《Spring 源码深度解析》- 郝佳著](https://book.douban.com/subject/25866350/)

https://developer.aliyun.com/article/766880

http://www.tianxiaobo.com/2018/06/08/Spring-IOC-容器源码分析-循环依赖的解决办法

https://developer.aliyun.com/article/766880



