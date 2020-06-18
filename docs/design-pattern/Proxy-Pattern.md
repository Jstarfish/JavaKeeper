# 代理模式

![代理设计模式](https://refactoringguru.cn/images/patterns/content/proxy/proxy.png)



##  基本介绍

**代理模式**是一种结构型设计模式。为对象提供一个替身，以控制对这个对象的访问。即通过代理对象访问目标对象，并允许在将请求提交给对象前后进行一些处理。

被代理的对象可以是远程对象、创建开销大的对象或需要安全控制的对象。

代理模式主要有三种不同的形式：

- 静态代理：由程序员创建代理类或特定工具自动生成源代码再对其编译。在程序运行前代理类的 `.class` 文件就已经存在了
- 动态代理（JDK 代理、接口代理）：在程序运行时运用反射机制动态创建而成，动态就是在程序运行时生成的，而不是编译时。
- Cglib 代理（可以在内存动态的创建对象，而不是实现接口，属于动态代理的范畴）



##  问题

为什么要控制对于某个对象的访问呢？ 举个例子： 有这样一个消耗大量系统资源的巨型对象， 你只是偶尔需要使用它， 并非总是需要。

![数据库查询有可能会非常缓慢](https://refactoringguru.cn/images/patterns/diagrams/proxy/problem-zh.png)



你可以实现延迟初始化： 在实际有需要时再创建该对象。 对象的所有客户端都要执行延迟初始代码。 不幸的是， 这很可能会带来很多重复代码。

在理想情况下， 我们希望将代码直接放入对象的类中， 但这并非总是能实现： 比如类可能是第三方封闭库的一部分。



##  解决方案

代理模式建议新建一个与原服务对象接口相同的代理类， 然后更新应用以将代理对象传递给所有原始对象客户端。 代理类接收到客户端请求后会创建实际的服务对象， 并将所有工作委派给它。

![代理模式的解决方案](https://refactoringguru.cn/images/patterns/diagrams/proxy/solution-zh.png)

代理将自己伪装成数据库对象， 可在客户端或实际数据库对象不知情的情况下处理延迟初始化和缓存查询结果的工作。

这有什么好处呢？ 如果需要在类的主要业务逻辑前后执行一些工作， 你无需修改类就能完成这项工作。 由于代理实现的接口与原类相同， 因此你可将其传递给任何一个使用实际服务对象的客户端。



##  代理模式结构

![代理设计模式的结构](https://refactoringguru.cn/images/patterns/diagrams/proxy/structure.png)

1. **服务接口** （Service Interface） 声明了服务接口。 代理必须遵循该接口才能伪装成服务对象。
2. **服务** （Service） 类提供了一些实用的业务逻辑。
3. **代理** （Proxy） 类包含一个指向服务对象的引用成员变量。 代理完成其任务 （例如延迟初始化、 记录日志、 访问控制和缓存等） 后会将请求传递给服务对象。 通常情况下， 代理会对其服务对象的整个生命周期进行管理。
4. **客户端** （Client） 能通过同一接口与服务或代理进行交互， 所以你可在一切需要服务对象的代码中使用代理。



打游戏有代练、买卖房子有中介、再比如一般公司投互联网广告也可以找代理公司，这里的代练、中介、广告代理公司扮演的角色都是代理。

这里举个更接近程序员的例子，比如有些变态的公司不允许在公司刷微博，看视频，可以通过一层代理来限制我们访问这些网站。

废话不多说，先来个静态代理。

## 静态代理

1、定义网络接口

```java
public interface Internet {
    void connectTo(String serverHost) throws Exception;
}
```

2、真正的网络连接

```java
public class RealInternet implements Internet{

    @Override
    public void connectTo(String serverHost) throws Exception {
        System.out.println("Connecting to "+ serverHost);
    }
}
```

3、公司的网络代理

```java
public class ProxyInternet implements Internet {

    //目标对象，通过接口聚合
    private Internet internet;

    // 通过构造方法传入目标对象
    public ProxyInternet(Internet internet){
        this.internet = internet;
    }
    //网络黑名单
    private static List<String> bannedSites;

    static
    {
        bannedSites = new ArrayList<String>();
        bannedSites.add("bilibili.com");
        bannedSites.add("youtube.com");
        bannedSites.add("weibo.com");
        bannedSites.add("qq.com");
    }

    @Override
    public void connectTo(String serverhost) throws Exception {
        // 添加限制功能
        if(bannedSites.contains(serverhost.toLowerCase()))
        {
            throw new Exception("Access Denied:"+serverhost);
        }
        internet.connectTo(serverhost);
    }
}
```

4、客户端验证

```java
public class Client {

    public static void main(String[] args) {
        Internet internet = new ProxyInternet(new RealInternet());
        try {
            internet.connectTo("so.com");
            internet.connectTo("qq.com");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
```

5、输出

```
Connecting to so.com
Access Denied:qq.com
```

> 不能访问娱乐性网站，但是可以用 360 搜索，SO 靠谱，哈哈



### 静态代理类优缺点

#### 优点：

在不修改目标对象的前提下，可以通过代理对象对目标对象功能扩展

代理使客户端不需要知道实现类是什么，怎么做的，而客户端只需知道代理即可（解耦合），对于如上的客户端代码，RealInterner() 可以应用工厂将它隐藏。

#### 缺点：

1. 代理类和委托类实现了相同的接口，代理类通过委托类实现了相同的方法。这样就出现了大量的代码重复。如果接口增加一个方法，除了所有实现类需要实现这个方法外，所有代理类也需要实现此方法。增加了代码维护的复杂度。

2. 代理对象只服务于一种类型的对象，如果要服务多类型的对象。势必要为每一种对象都进行代理，静态代理在程序规模稍大时就无法胜任了。



## 动态代理

静态代理会产生很多静态类，所以我们要想办法可以通过一个代理类完成全部的代理功能，这就引出了动态代理。

### JDK原生动态代理

- 代理对象，不需要实现接口，但是目标对象要实现接口，否则不能用动态代理
- 代理对象的生成，是通过 JDK 的 API（反射机制），动态的在内存中构建代理对象

在 Java 中要想实现动态代理机制，需要 `java.lang.reflect.InvocationHandler` 接口和 `java.lang.reflect.Proxy` 类的支持

#### Coding

1、网络接口不变

```java
public interface Internet {
    void connectTo(String serverHost) throws Exception;
}
```

2、真正的网络连接，也不会改变

```java
public class RealInternet implements Internet{

    @Override
    public void connectTo(String serverHost) throws Exception {
        System.out.println("Connecting to "+ serverHost);
    }
}
```

3、动态代理，需要实现 `InvocationHandler`，我们用 Lambda 表达式简化下

```java
public class ProxyFactory {

    /**
     * 维护一个目标对象
     **/
    private Object target;

    /**
     * 构造器，初始化目标对象
     **/
    public ProxyFactory(Object target) {
        this.target = target;
    }

    public Object getProxyInstance() {

        /**
         被代理对象target通过参数传递进来，
         通过target.getClass().getClassLoader()获取ClassLoader对象，
         然后通过target.getClass().getInterfaces()获取它实现的所有接口，
         再将target包装到实现了InvocationHandler接口的对象中。
         通过newProxyInstance函数我们就获得了一个动态代理对象。
         */
        return Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                if(bannedSites.contains(args[0].toString().toLowerCase()))
                {
                    throw new Exception("Access Denied:"+args[0]);
                }
                //反射机制调用目标对象的方法
                Object obj = method.invoke(target, args);
                return obj;
            }
        });
    }

    private static List<String> bannedSites;

    static
    {
        bannedSites = new ArrayList<String>();
        bannedSites.add("bilibili.com");
        bannedSites.add("youtube.com");
        bannedSites.add("weibo.com");
        bannedSites.add("qq.com");
    }
}
```

4、客户端

```java
public class Client {

    public static void main(String[] args) {
        Internet internet = new ProxyInternet(new RealInternet());
        try {
            internet.connectTo("360.cn");
            internet.connectTo("qq.com");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
```

动态代理的方式中，所有的函数调用最终都会经过 `invoke` 函数的转发，因此我们就可以在这里做一些自己想做的操作，比如日志系统、事务、拦截器、权限控制等。



### cglib代理

静态代理和 JDK 代理模式都要求目标对象实现一个接口，但有时候目标对象只是一个单独的对象，并没有实现任何接口，这个时候就可以使用目标对象子类来实现代理，这就是 cglib 代理。

- [cglib](https://github.com/cglib/cglib)(*Code Generation Library*)是一个基于ASM的字节码生成库，它允许我们在运行时对字节码进行修改和动态生成。cglib 通过继承方式实现代理。它广泛的被许多AOP的框架使用，比如我们的 Spring AOP。

- cglib 包的底层是通过使用字节码处理框架 ASM 来转换字节码并生成新的类。

- cglib 代理也被叫做子类代理，它是在内存中构建一个子类对象从而实现目标对象功能扩展。



#### Coding

添加 `cglib` 依赖

```xml
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
```

1、不需要接口

```java
public class RealInternet{

    public void connectTo(String serverHost) {
        System.out.println("Connecting to "+ serverHost);
    }
}
```

2、代理工厂类

```java
public class ProxyFactory implements MethodInterceptor {

    private Object target;

    public ProxyFactory(Object target){
        this.target = target;
    }

    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        System.out.println("cglib 代理开始，可以添加逻辑");
        Object obj = method.invoke(target,objects);
        System.out.println("cglib 代理结束");
        return obj;
    }


    public Object getProxyInstance(){
        //工具类
        Enhancer enhancer = new Enhancer();
        //设置父类
        enhancer.setSuperclass(target.getClass());
        //设置回调函数
        enhancer.setCallback(this);
        //创建子类对象，即代理对象
        return enhancer.create();
    }
}
```

3、客户端

```java
public class Client {

    public static void main(String[] args) {

        //目标对象
        RealInternet target = new RealInternet();
        //获取代理对象,并且将目标对象传递给代理对象
        RealInternet internet = (RealInternet) new ProxyFactory(target).getProxyInstance();
        internet.connectTo("so.cn");
    }
}
```

4、输出

```
cglib 代理开始，可以添加逻辑
Connecting to so.cn
cglib 代理结束
```



##  代理模式适合应用场景

使用代理模式的方式多种多样， 我们来看看最常见的几种。

- 延迟初始化 （虚拟代理）：如果你有一个偶尔使用的重量级服务对象， 一直保持该对象运行会消耗系统资源时， 可使用代理模式。

   你无需在程序启动时就创建该对象， 可将对象的初始化延迟到真正有需要的时候。

- 访问控制 （保护代理）：如果你只希望特定客户端使用服务对象， 这里的对象可以是操作系统中非常重要的部分， 而客户端则是各种已启动的程序 （包括恶意程序）， 此时可使用代理模式。

   代理可仅在客户端凭据满足要求时将请求传递给服务对象。

- 本地执行远程服务 （远程代理）：适用于服务对象位于远程服务器上的情形。

  在这种情形中， 代理通过网络传递客户端请求， 负责处理所有与网络相关的复杂细节。

- 记录日志请求 （日志记录代理）：适用于当你需要保存对于服务对象的请求历史记录时。 代理可以在向服务传递请求前进行记录。

- 缓存请求结果 （缓存代理）：适用于需要缓存客户请求结果并对缓存生命周期进行管理时， 特别是当返回结果的体积非常大时。

  代理可对重复请求所需的相同结果进行缓存， 还可使用请求参数作为索引缓存的键值。比如请求图片、文件等资源时，先到代理缓存取，如果没有就去公网取并缓存到代理服务器

- 智能引用：可在没有客户端使用某个重量级对象时立即销毁该对象。

  代理会将所有获取了指向服务对象或其结果的客户端记录在案。 代理会时不时地遍历各个客户端， 检查它们是否仍在运行。 如果相应的客户端列表为空， 代理就会销毁该服务对象， 释放底层系统资源。

  代理还可以记录客户端是否修改了服务对象。 其他客户端还可以复用未修改的对象。



## AOP 中的代理模式

AOP（面向切面编程）主要的的实现技术主要有 `Spring AOP` 和 `AspectJ`

AspectJ 的底层技术就是静态代理，用一种 AspectJ 支持的特定语言编写切面，通过一个命令来编译，生成一个新的代理类，该代理类增强了业务类，这是在编译时增强，相对于下面说的运行时增强，编译时增强的性能更好。（AspectJ 的静态代理，不像我们前边介绍的需要为每一个目标类手动编写一个代理类，AspectJ 框架可以在编译时就生成目标类的“代理类”，在这里加了个冒号，是因为实际上它并没有生成一个新的类，而是把代理逻辑直接编译到目标类里面了）

Spring AOP 采用的是动态代理，在运行期间对业务方法进行增强，所以不会生成新类，对于动态代理技术，Spring AOP 提供了对 JDK 动态代理的支持以及 CGLib 的支持。

默认情况下，Spring对实现了接口的类使用 JDK Proxy方式，否则的话使用CGLib。不过可以通过配置指定 Spring AOP 都通过 CGLib 来生成代理类。

![](https://imgkr.cn-bj.ufileos.com/ea2aff72-3e0a-4a0d-9950-504c0f3ef911.png)

具体逻辑在 `org.springframework.aop.framework.DefaultAopProxyFactory`类中，使用哪种方式生成由`AopProxy` 根据 `AdvisedSupport` 对象的配置来决定源码如下：

```java
public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {
    public DefaultAopProxyFactory() {
    }

    public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
        if (!config.isOptimize() && !config.isProxyTargetClass() && !this.hasNoUserSuppliedProxyInterfaces(config)) {
            return new JdkDynamicAopProxy(config);
        } else {
            Class<?> targetClass = config.getTargetClass();
            if (targetClass == null) {
                throw new AopConfigException("TargetSource cannot determine target class: Either an interface or a target is required for proxy creation.");
            } else {
                //如果目标类是接口且是代理类, 使用JDK动态代理类，否则使用Cglib生成代理类
                return (AopProxy)(!targetClass.isInterface() && !Proxy.isProxyClass(targetClass) ? new ObjenesisCglibAopProxy(config) : new JdkDynamicAopProxy(config));
            }
        }
    }

    private boolean hasNoUserSuppliedProxyInterfaces(AdvisedSupport config) {
    }
}
```

具体内容就不展开了，后边整理 SpringAOP 的时候再深入。











## 参考与感谢

https://refactoringguru.cn/design-patterns/proxy

https://www.geeksforgeeks.org/proxy-design-pattern/