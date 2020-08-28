## 前言

扯依赖循环之前，我们先来回顾两个知识点：

初学 Spring 的时候，我们就知道 IOC，控制反转，它将原本在程序中手动创建对象的控制权，交由 Spring 框架来管理。

Spring 管理，不也得创建吗， Java 对象的创建步骤很多，可以 `new XXX`、序列化、`clone()` 等等，而 Spring  是通过反射的方式创建对象的，创建好的对象我们一般还会对对象属性进行赋值，才去使用。

好了，有个这概念，方便理解下边的内容，然后我们就说下循环依赖的概念

### 什么是循环依赖

所谓的循环依赖是指，A 依赖 B，B 又依赖 A，它们之间形成了循环依赖。或者是 A 依赖 B，B 依赖 C，C 又依赖 A。它们之间的依赖关系如下：

![img](https://huzb.me/2019/03/11/Spring%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90%E2%80%94%E2%80%94%E8%A7%A3%E5%86%B3%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96/%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96.png)

这里以两个类直接相互依赖为例，他们的实现代码可能如下：

```java
public class BeanB {
    private BeanA beanA;
    // 省略 getter/setter
}

public class BeanA {
    private BeanB beanB;
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



```java
public static void main(String[] args) {
    ApplicationContext context = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");

    BeanA beanA = (BeanA) context.getBean("beanA");
    System.out.println(beanA);
}
```

ApplicationContext.getBean() 获取所依赖对象时，由于 Spring 容器中还没有 A 对象实例，所以会先去创建一个 A 对象，但是创建的时候又发现它依赖了 B，接着就去获取 B，但是 Spring 容器中也没有 B ，同样去创建 B ，又发现它依赖了 A ，这尼玛咋整？无限循环呀

Spring 肯定不会让这种事情发生的，这个时候其实 A、B  对象都已经创建好了，只是没有设置属性，可以理解为"半成品"—— 官方叫 A 对象的早期引用（earlyreference），所以 B 就会把这个“半成品”设置进去先完成实例化，既然 B 完成了实例化，所以 A 就可以获得 B 的引用，也完成实例化了。

![有点懵逼](https://i04piccdn.sogoucdn.com/7332d8fe139e38e4)



有个大概的印象，然后我们从源码来看下 Spring 具体是怎么解决的



## 源码解毒

> 代码版本：5.0.16.RELEASE

```java
BeanA beanA = (BeanA) context.getBean("beanA");
```

嗯~，这个不就是 getBean 么，所以我们先回顾下 bean 的获取过程

### 回顾获取 bean 的过程

Spring IOC 容器中获取 bean 实例的简化版流程如下

![](C:\Users\jiahaixin\Downloads\Spring-getBean简易版 (4).png)

大概的流程顺序（可以结合着源码看下，我就不贴了，贴太多的话，呕~呕呕，想吐）：

1. 流程从 getBean 方法开始，getBean 是个空壳方法，所有逻辑直接到 doGetBean 方法中
2. 通过 name 获取真正的 beanName（name 可能会以 & 字符开头或者有别名的情况，所以需要转化下）
3. 然后通过 `getSingleton(beanName)` 方法去缓存中查找是不是有该实例 sharedInstance
4. 如果有的话，sharedInstance 可能是完全实例化好的 bean，也可能是一个原始的 bean，所以再经 `getObjectForBeanInstance` 处理即可返回
5. 当然 sharedInstance 也可能是 null，这时候就会执行创建 bean 的逻辑，将结果返回



好了，又有个印象了，然后我们再给出个结论，后边探究原因：

> Spring对循环依赖的处理有三种情况： 
>
> - 构造器的循环依赖：这种依赖spring是处理不了的，直接抛出 `BeanCurrentlylnCreationException` 异常
>
> - 单例模式下的 setter 循环依赖：通过“三级缓存”处理循环依赖
> - 非单例循环依赖：无法处理

所以，我们只看单例对象的创建方式，Spring 单例对象的初始化大略分为三步：

1. createBeanInstance：实例化，其实也就是调用对象的构造方法实例化对象
2. populateBean：填充属性，这一步主要是多 bean 的依赖属性进行填充
3. initializeBean：调用 Spring xml中的 init 方法，并返回结果

![bean初始化](https://img-blog.csdn.net/20170912091609918)

从上面讲述的单例 bean 初始化步骤我们可以知道，循环依赖主要发生在第一、第二步。也就是构造器循环依赖和field 循环依赖。 

Spring 为了解决单例的循环依赖问题，使用了三级缓存。

```java
/** Cache of singleton objects: bean name --> bean instance */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

/** Cache of singleton factories: bean name --> ObjectFactory */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);

/** Cache of early singleton objects: bean name --> bean instance */
private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);
```

这三级缓存的作用分别是：

- `singletonObjects`：完成初始化的单例对象的cache（一级缓存）

- `earlySingletonObjects`：存放原始的 bean 对象（尚未填充属性/完成实例化但是尚未初始化），提前曝光，用于解决循环依赖的 （二级缓存）

- `singletonFactories`：存放 bean 工厂对象，用于解决循环依赖（三级缓存）

接着，我们再从源码看下 创建 bean 的过程

### 创建 bean 的过程

我们在创建 bean 的时候，会首先从 cache 中获取这个bean，没有的话，就去创建

![img](https://huzb.me/2019/03/11/Spring%E6%BA%90%E7%A0%81%E6%B5%85%E6%9E%90%E2%80%94%E2%80%94%E8%A7%A3%E5%86%B3%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96/bean%E5%88%9B%E5%BB%BA%E6%B5%81%E7%A8%8B.png)



1、我们只看单例情况 `mbd.isSingleton()` 的创建方式

```java
// Create bean instance.
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

2、createBean 最后会调用 `doCreateBean`，doCreateBean 方法中的逻辑很多，首先调用了 createBeanInstance 方法创建了一个原始的 bean 对象，随后调用 addSingletonFactory 方法向缓存中添加单例 bean 工厂，从该工厂可以获取原始对象的引用，也就是所谓的“早期引用”（我们之前说的半成品）。再之后，继续调用 populateBean 方法向原始 bean 对象中填充属性，并解析依赖。getObject 执行完成后，会返回完全实例化好的 bean。紧接着 getSingleton 就会把完全实例化好的 bean 对象放入缓存中。到这里，红色执行路径差不多也就要结束的。

```java
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
			throws BeanCreationException {

		// Instantiate the bean.
		BeanWrapper instanceWrapper = createBeanInstance(beanName, mbd, args);

		addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));

		// Initialize the bean instance.
		populateBean(beanName, mbd, instanceWrapper);
		exposedObject = initializeBean(beanName, exposedObject, mbd);

		return exposedObject;
	}
```

③. 现在缓存中有了，同样调用 `getObjectForBeanInstance` 返回 bean











https://blog.csdn.net/u010853261/article/details/77940767

https://juejin.im/post/6844903806757502984#comment

http://www.tianxiaobo.com/2018/06/08/Spring-IOC-容器源码分析-循环依赖的解决办法/#22-一些缓存的介绍

### 构造器循环依赖

```java
// Fail if we're already creating this bean instance:
// We're assumably within a circular reference.
// BeanFactory 不缓存 Prototype 类型的 bean，无法处理该类型 bean 的循环依赖问题
if (isPrototypeCurrentlyInCreation(beanName)) {
    throw new BeanCurrentlyInCreationException(beanName);
}
public BeanCurrentlyInCreationException(String beanName) {
    super(beanName, "Requested bean is currently in creation: Is there an unresolvable circular reference?");
}
```

















通俗点的流程就是：

![img](https://blog-pictures.oss-cn-shanghai.aliyuncs.com/15284160504039.jpg)



说了这么多，好像和循环依赖没啥关系，不要着急吗，

![img](http://img.doutula.com/production/uploads/image/2016/02/27/20160227565778_ZpvyKM.jpg)



首先，需要明确的是spring对循环依赖的处理有三种情况： 

①构造器的循环依赖：这种依赖spring是处理不了的，直接抛出BeanCurrentlylnCreationException异常。

②单例模式下的setter循环依赖：通过“三级缓存”处理循环依赖。 

③非单例循环依赖：无法处理。





我们先给出结论，有个大概的印象：





接下来，我们具体看看 spring是如何处理三种循环依赖的。



#### 1、构造器循环依赖

this .singletonsCurrentlylnCreation.add(beanName）将当前正要创建的bean 记录在缓存中 Spring 容器将每一个正在创建的bean 标识符放在一个“当前创建bean 池”中， bean 标识 柏：在创建过程中将一直保持在这个池中，因此如果在创建bean 过程中发现自己已经在“当前 创建bean 池” 里时，将抛出BeanCurrentlyInCreationException 异常表示循环依赖；而对于创建 完毕的bean 将从“ 当前创建bean 池”中清除掉。

#### 2、setter循环依赖











那我们就开始步入 Spring 解决循环依赖的代码

```java
protected <T> T doGetBean(final String name, final Class<T> requiredType, final Object[] args, boolean typeCheckOnly)throws BeansException {
    // ...... 
    
    // 从缓存中获取 bean 实例
    Object sharedInstance = getSingleton(beanName);
    // ......
}

public Object getSingleton(String beanName) {
    return getSingleton(beanName, true);
}

@Nullable
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

这个逻辑比较好理解，获取 bean 的时候肯定是先看看之前有没有，有的话，就直接拿来用，没有的话就去创建一个用，还在 doGetBean 方法中，三级缓存都没有了，就 else

```java
else {
    // BeanFactory 不缓存 Prototype 类型的 bean，无法处理该类型 bean 的循环依赖问题
    if (isPrototypeCurrentlyInCreation(beanName)) {
        throw new BeanCurrentlyInCreationException(beanName);
    }

    // 如果 sharedInstance = null，则到父容器中查找 bean 实例
    BeanFactory parentBeanFactory = getParentBeanFactory();
   
    // ............................................
    // Create bean instance. mbd.isSingleton() 用于判断 bean 是否是单例模式
    if (mbd.isSingleton()) {
        sharedInstance = getSingleton(beanName, () -> {
            try {
                // 创建 bean 实例，createBean 返回的 bean 是完全实例化好的
                return createBean(beanName, mbd, args);
            }
            catch (BeansException ex) {
                destroySingleton(beanName);
                throw ex;
            }
        });
        // 进行后续的处理
        bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
    }
    // ............................................

    else if (mbd.isPrototype()) {
        // It's a prototype -> create a new instance.
        // ...
    }
}

// 把中间创建bean的逻辑拿出来，两个方法getSingleton 和 createBean
public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
	//....
    
    // 调用 getObject 方法创建 bean 实例
    singletonObject = singletonFactory.getObject();
    newSingleton = true;

    if (newSingleton) {
        // 添加 bean 到 singletonObjects 缓存（一级缓存）中，并从其他集合中将 bean 相关记录移除
        addSingleton(beanName, singletonObject);
    }
    return singletonObject;
}

// createBean 方法中真正的逻辑在 doCreateBean 方法，我们来看下
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
    throws BeanCreationException {

    // Instantiate the bean.
    BeanWrapper instanceWrapper = null;
    instanceWrapper = createBeanInstance(beanName, mbd, args);
	// 从 BeanWrapper 对象中获取 bean 对象，这里的 bean 指向的是一个原始的对象
    final Object bean = instanceWrapper.getWrappedInstance();

    // ...

    // 
    boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences && isSingletonCurrentlyInCreation(beanName));
    if (earlySingletonExposure) {
        addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
    }

    // Initialize the bean instance.
    Object exposedObject = bean;
    // 填充属性，解析依赖
    populateBean(beanName, mbd, instanceWrapper);
    exposedObject = initializeBean(beanName, exposedObject, mbd);
    return exposedObject;
}
```

把源码中主要逻辑抽了一部分，还是挺长的，简单说就是三步走：

1. 创建 bean 对象： `BeanWrapper instanceWrapper = createBeanInstance(beanName, mbd, args);`
2. 添加 bean 工厂对象到 singletonFactories 缓存中，并获取原始对象的早期引用 （解决循环依赖的关键，在bean 创建完成但是还未填充属性时候提前暴露）`addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));`
3. 填充属性，解析依赖 `populateBean(beanName, mbd, instanceWrapper);`

为什么第二步要提前曝光呢







![img](https://blog-pictures.oss-cn-shanghai.aliyuncs.com/15283756103006.jpg)

主要的调用方法是：

```
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    Object singletonObject = this.singletonObjects.get(beanName);
    //isSingletonCurrentlyInCreation()判断当前单例bean是否正在创建中
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            singletonObject = this.earlySingletonObjects.get(beanName);
            //allowEarlyReference 是否允许从singletonFactories中通过getObject拿到对象
            if (singletonObject == null && allowEarlyReference) {
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    singletonObject = singletonFactory.getObject();
                    //从singletonFactories中移除，并放入earlySingletonObjects中。
                    //其实也就是从三级缓存移动到了二级缓存
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return (singletonObject != NULL_OBJECT ? singletonObject : null);
}
```

从上面三级缓存的分析，我们可以知道，Spring解决循环依赖的诀窍就在于singletonFactories这个三级cache。这个cache的类型是ObjectFactory，定义如下：

```
public interface ObjectFactory<T> {
    T getObject() throws BeansException;
}
```

这个接口在AbstractBeanFactory里实现，并在核心方法doCreateBean（）引用下面的方法:

```
protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
    Assert.notNull(singletonFactory, "Singleton factory must not be null");
    synchronized (this.singletonObjects) {
        if (!this.singletonObjects.containsKey(beanName)) {
            this.singletonFactories.put(beanName, singletonFactory);
            this.earlySingletonObjects.remove(beanName);
            this.registeredSingletons.add(beanName);
        }
    }
}
```

这段代码发生在createBeanInstance之后，populateBean（）之前，也就是说单例对象此时已经被创建出来(调用了构造器)。这个对象已经被生产出来了，此时将这个对象提前曝光出来，让大家使用。

这样做有什么好处呢？让我们来分析一下“A的某个field或者setter依赖了B的实例对象，同时B的某个field或者setter依赖了A的实例对象”这种循环依赖的情况。A首先完成了初始化的第一步，并且将自己提前曝光到singletonFactories中，此时进行初始化的第二步，发现自己依赖对象B，此时就尝试去get(B)，发现B还没有被create，所以走create流程，B在初始化第一步的时候发现自己依赖了对象A，于是尝试get(A)，尝试一级缓存singletonObjects(肯定没有，因为A还没初始化完全)，尝试二级缓存earlySingletonObjects（也没有），尝试三级缓存singletonFactories，由于A通过ObjectFactory将自己提前曝光了，所以B能够通过ObjectFactory.getObject拿到A对象(虽然A还没有初始化完全，但是总比没有好呀)，B拿到A对象后顺利完成了初始化阶段1、2、3，完全初始化之后将自己放入到一级缓存singletonObjects中。此时返回A中，A此时能拿到B的对象顺利完成自己的初始化阶段2、3，最终A也完成了初始化，进去了一级缓存singletonObjects中，而且更加幸运的是，由于B拿到了A的对象引用，所以B现在hold住的A对象完成了初始化。

#### 3、非单例循环依赖

对于“prototype”作用域bean, Spring 容器无法完成依赖注入，因为Spring 容器不进行缓 存“prototype”作用域的bean ，因此无法提前暴露一个创建中的bean 。










IOC 容器在读到上面的配置时，会按照顺序，先去实例化 beanA。然后发现 beanA 依赖于 beanB，接在又去实例化 beanB。实例化 beanB 时，发现 beanB 又依赖于 beanA。如果容器不处理循环依赖的话，容器会无限执行上面的流程，直到内存溢出，程序崩溃。当然，Spring 是不会让这种情况发生的。在容器再次发现 beanB 依赖于 beanA 时，容器会获取 beanA 对象的一个早期的引用（early reference），并把这个早期引用注入到 beanB 中，让 beanB 先完成实例化。beanB 完成实例化，beanA 就可以获取到 beanB 的引用，beanA 随之完成实例化。这里大家可能不知道“早期引用”是什么意思，这里先别着急，我会在下一章进行说明。





















###  2.3 回顾获取 bean 的过程



##  3. 源码分析

好了，经过前面的铺垫，现在我们终于可以深入源码一探究竟了，想必大家已等不及了。那我不卖关子了，下面我们按照方法的调用顺序，依次来看一下循环依赖相关的代码。如下：

```
protected <T> T doGetBean(
            final String name, final Class<T> requiredType, final Object[] args, boolean typeCheckOnly)
            throws BeansException {

    // ...... 
    
    // 从缓存中获取 bean 实例
    Object sharedInstance = getSingleton(beanName);

    // ......
}

public Object getSingleton(String beanName) {
    return getSingleton(beanName, true);
}

protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    // 从 singletonObjects 获取实例，singletonObjects 中的实例都是准备好的 bean 实例，可以直接使用
    Object singletonObject = this.singletonObjects.get(beanName);
    // 判断 beanName 对应的 bean 是否正在创建中
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            // 从 earlySingletonObjects 中获取提前曝光的 bean
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                // 获取相应的 bean 工厂
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    // 提前曝光 bean 实例（raw bean），用于解决循环依赖
                    singletonObject = singletonFactory.getObject();
                    
                    // 将 singletonObject 放入缓存中，并将 singletonFactory 从缓存中移除
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return (singletonObject != NULL_OBJECT ? singletonObject : null);
}
```

上面的源码中，doGetBean 所调用的方法 getSingleton(String) 是一个空壳方法，其主要逻辑在 getSingleton(String, boolean) 中。该方法逻辑比较简单，首先从 singletonObjects 缓存中获取 bean 实例。若未命中，再去 earlySingletonObjects 缓存中获取原始 bean 实例。如果仍未命中，则从 singletonFactory 缓存中获取 ObjectFactory 对象，然后再调用 getObject 方法获取原始 bean 实例的应用，也就是早期引用。获取成功后，将该实例放入 earlySingletonObjects 缓存中，并将 ObjectFactory 对象从 singletonFactories 移除。看完这个方法，我们再来看看 getSingleton(String, ObjectFactory) 方法，这个方法也是在 doGetBean 中被调用的。这次我会把 doGetBean 的代码多贴一点出来，如下：

```
protected <T> T doGetBean(
        final String name, final Class<T> requiredType, final Object[] args, boolean typeCheckOnly)
        throws BeansException {

    // ...... 
    Object bean;

    // 从缓存中获取 bean 实例
    Object sharedInstance = getSingleton(beanName);

    // 这里先忽略 args == null 这个条件
    if (sharedInstance != null && args == null) {
        // 进行后续的处理
        bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);
    } else {
        // ......

        // mbd.isSingleton() 用于判断 bean 是否是单例模式
        if (mbd.isSingleton()) {
            // 再次获取 bean 实例
            sharedInstance = getSingleton(beanName, new ObjectFactory<Object>() {
                @Override
                public Object getObject() throws BeansException {
                    try {
                        // 创建 bean 实例，createBean 返回的 bean 是完全实例化好的
                        return createBean(beanName, mbd, args);
                    } catch (BeansException ex) {
                        destroySingleton(beanName);
                        throw ex;
                    }
                }
            });
            // 进行后续的处理
            bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
        }

        // ......
    }

    // ......

    // 返回 bean
    return (T) bean;
}
```

这里的代码逻辑和我在 `2.3 回顾获取 bean 的过程` 一节的最后贴的主流程图已经很接近了，对照那张图和代码中的注释，大家应该可以理解 doGetBean 方法了。继续往下看：

```
public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
    synchronized (this.singletonObjects) {

        // ......
        
        // 调用 getObject 方法创建 bean 实例
        singletonObject = singletonFactory.getObject();
        newSingleton = true;

        if (newSingleton) {
            // 添加 bean 到 singletonObjects 缓存中，并从其他集合中将 bean 相关记录移除
            addSingleton(beanName, singletonObject);
        }

        // ......
        
        // 返回 singletonObject
        return (singletonObject != NULL_OBJECT ? singletonObject : null);
    }
}

protected void addSingleton(String beanName, Object singletonObject) {
    synchronized (this.singletonObjects) {
        // 将 <beanName, singletonObject> 映射存入 singletonObjects 中
        this.singletonObjects.put(beanName, (singletonObject != null ? singletonObject : NULL_OBJECT));

        // 从其他缓存中移除 beanName 相关映射
        this.singletonFactories.remove(beanName);
        this.earlySingletonObjects.remove(beanName);
        this.registeredSingletons.add(beanName);
    }
}
```

上面的代码中包含两步操作，第一步操作是调用 getObject 创建 bean 实例，第二步是调用 addSingleton 方法将创建好的 bean 放入缓存中。代码逻辑并不复杂，相信大家都能看懂。那么接下来我们继续往下看，这次分析的是 doCreateBean 中的一些逻辑。如下：

```
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final Object[] args)
        throws BeanCreationException {

    BeanWrapper instanceWrapper = null;

    // ......

    // ☆ 创建 bean 对象，并将 bean 对象包裹在 BeanWrapper 对象中返回
    instanceWrapper = createBeanInstance(beanName, mbd, args);
    
    // 从 BeanWrapper 对象中获取 bean 对象，这里的 bean 指向的是一个原始的对象
    final Object bean = (instanceWrapper != null ? instanceWrapper.getWrappedInstance() : null);

    /*
     * earlySingletonExposure 用于表示是否”提前暴露“原始对象的引用，用于解决循环依赖。
     * 对于单例 bean，该变量一般为 true。更详细的解释可以参考我之前的文章
     */ 
    boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
            isSingletonCurrentlyInCreation(beanName));
    if (earlySingletonExposure) {
        // ☆ 添加 bean 工厂对象到 singletonFactories 缓存中
        addSingletonFactory(beanName, new ObjectFactory<Object>() {
            @Override
            public Object getObject() throws BeansException {
                /* 
                 * 获取原始对象的早期引用，在 getEarlyBeanReference 方法中，会执行 AOP 
                 * 相关逻辑。若 bean 未被 AOP 拦截，getEarlyBeanReference 原样返回 
                 * bean，所以大家可以把 
                 *      return getEarlyBeanReference(beanName, mbd, bean) 
                 * 等价于：
                 *      return bean;
                 */
                return getEarlyBeanReference(beanName, mbd, bean);
            }
        });
    }

    Object exposedObject = bean;

    // ......
    
    // ☆ 填充属性，解析依赖
    populateBean(beanName, mbd, instanceWrapper);

    // ......

    // 返回 bean 实例
    return exposedObject;
}

protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
    synchronized (this.singletonObjects) {
        if (!this.singletonObjects.containsKey(beanName)) {
            // 将 singletonFactory 添加到 singletonFactories 缓存中
            this.singletonFactories.put(beanName, singletonFactory);

            // 从其他缓存中移除相关记录，即使没有
            this.earlySingletonObjects.remove(beanName);
            this.registeredSingletons.add(beanName);
        }
    }
}
```

上面的代码简化了不少，不过看起来仍有点复杂。好在，上面代码的主线逻辑比较简单，由三个方法组成。如下：

```
1. 创建原始 bean 实例 → createBeanInstance(beanName, mbd, args)
2. 添加原始对象工厂对象到 singletonFactories 缓存中 
        → addSingletonFactory(beanName, new ObjectFactory<Object>{...})
3. 填充属性，解析依赖 → populateBean(beanName, mbd, instanceWrapper)
```

到这里，本节涉及到的源码就分析完了。可是看完源码后，我们似乎仍然不知道这些源码是如何解决循环依赖问题的。难道本篇文章就到这里了吗？答案是否。下面我来解答这个问题，这里我还是以 BeanA 和 BeanB 两个类相互依赖为例。在上面的方法调用中，有几个关键的地方，下面一一列举出来：

**1. 创建原始 bean 对象**

```
instanceWrapper = createBeanInstance(beanName, mbd, args);
final Object bean = (instanceWrapper != null ? instanceWrapper.getWrappedInstance() : null);
```

假设 beanA 先被创建，创建后的原始对象为 `BeanA@1234`，上面代码中的 bean 变量指向就是这个对象。

**2. 暴露早期引用**

```
addSingletonFactory(beanName, new ObjectFactory<Object>() {
    @Override
    public Object getObject() throws BeansException {
        return getEarlyBeanReference(beanName, mbd, bean);
    }
});
```

beanA 指向的原始对象创建好后，就开始把指向原始对象的引用通过 ObjectFactory 暴露出去。getEarlyBeanReference 方法的第三个参数 bean 指向的正是 createBeanInstance 方法创建出原始 bean 对象 BeanA@1234。

**3. 解析依赖**

```
populateBean(beanName, mbd, instanceWrapper);
```

populateBean 用于向 beanA 这个原始对象中填充属性，当它检测到 beanA 依赖于 beanB 时，会首先去实例化 beanB。beanB 在此方法处也会解析自己的依赖，当它检测到 beanA 这个依赖，于是调用 BeanFactry.getBean(“beanA”) 这个方法，从容器中获取 beanA。

**4. 获取早期引用**

```
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    Object singletonObject = this.singletonObjects.get(beanName);
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            // ☆ 从缓存中获取早期引用
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    // ☆ 从 SingletonFactory 中获取早期引用
                    singletonObject = singletonFactory.getObject();
                    
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return (singletonObject != NULL_OBJECT ? singletonObject : null);
}
```

接着上面的步骤讲，populateBean 调用 BeanFactry.getBean(“beanA”) 以获取 beanB 的依赖。getBean(“beanA”) 会先调用 getSingleton(“beanA”)，尝试从缓存中获取 beanA。此时由于 beanA 还没完全实例化好，于是 this.singletonObjects.get(“beanA”) 返回 null。接着 this.earlySingletonObjects.get(“beanA”) 也返回空，因为 beanA 早期引用还没放入到这个缓存中。最后调用 singletonFactory.getObject() 返回 singletonObject，此时 singletonObject != null。singletonObject 指向 BeanA@1234，也就是 createBeanInstance 创建的原始对象。此时 beanB 获取到了这个原始对象的引用，beanB 就能顺利完成实例化。beanB 完成实例化后，beanA 就能获取到 beanB 所指向的实例，beanA 随之也完成了实例化工作。由于 beanB.beanA 和 beanA 指向的是同一个对象 BeanA@1234，所以 beanB 中的 beanA 此时也处于可用状态了。

以上的过程对应下面的流程图：

![img](https://blog-pictures.oss-cn-shanghai.aliyuncs.com/15283756103006.jpg)

##  4. 总结

到这里，本篇文章差不多就快写完了，不知道大家看懂了没。这篇文章在前面做了大量的铺垫，然后再进行源码分析。相比于我之前写的几篇文章，本篇文章所对应的源码难度上比之前简单一些。但说实话也不好写，我本来只想简单介绍一下背景知识，然后直接进行源码分析。但是又怕有的朋友看不懂，所以还是用了大篇幅介绍的背景知识。这样写，可能有的朋友觉得比较啰嗦。但是考虑到大家的水平不一，为了保证让大家能够更好的理解，所以还是尽量写的详细一点。本篇文章总的来说写的还是有点累的，花了一些心思思考怎么安排章节顺序，怎么简化代码和画图。如果大家看完这篇文章，觉得还不错的话，不妨给个赞吧，也算是对我的鼓励吧。

由于个人的技术能力有限，若文章有错误不妥之处，欢迎大家指出来。好了，本篇文章到此结束，谢谢大家的阅读。







https://juejin.im/post/6844903806757502984

http://www.tianxiaobo.com/2018/06/08/Spring-IOC-容器源码分析-循环依赖的解决办法