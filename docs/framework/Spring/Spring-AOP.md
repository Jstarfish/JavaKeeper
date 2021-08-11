## 一、AOP 前奏

假设我们原本有个计算器的程序，现在有这样的需求：

1. 在程序执行期间记录日志
2. 希望计算器只处理正数运算

啥也不说了，闷头干~

```java
public interface ArithmeticCalculator {
    void add(int i,int j);
    void sub(int i,int j);
}
```

```java
public void add(int i, int j) {
        if(i < 0 || j < 0){
            throw new IllegalArgumentException("Positive numbers only");
        }
        System.out.println("The method add begins with " + i + "," + j);
        int result =  i + j;
        System.out.println("result: "+ result);
        System.out.println("The method add ends with " + i + "," + j);
    }

    public void sub(int i, int j) {
        if(i < 0 || j < 0){
            throw new IllegalArgumentException("Positive numbers only");
        }
        System.out.println("The method sub begins with " + i + "," + j);
        int result =  i - j;
        System.out.println("result: "+ result);
        System.out.println("The method sub ends with " + i + "," + j);
    }
```

### 问题

这么一通干，存在的问题：

- 代码混乱：越来越多的非业务需求(日志和验证等)加入后，原有的业务方法急剧膨胀。每个方法在处理核心逻辑的同时还必须兼顾其他多个关注点
- 代码分散：以日志需求为例，只是为了满足这个单一需求，就不得不在多个模块（方法）里多次重复相同的日志代码。如果日志需求发生变化，必须修改所有模块

### 解决

这里就可以用动态代理来解决。可以参考之前的文章: [《面试官问 Spring AOP 中两种代理模式的区别，我懵逼了》](https://mp.weixin.qq.com/s/U7eR5Mpu4VBbtPP1livLnA)

代理设计模式的原理：**使用一个代理将对象包装起来**，然后用该代理对象取代原始对象。任何对原始对象的调用都要通过代理。代理对象决定是否以及何时将方法调用转到原始对象上。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/spring/Untitled%20Diagram-%E7%AC%AC%204%20%E9%A1%B5.svg)



1、我们用 JDK 动态代理来实现日志功能

> JDK 动态代理主要涉及到 `java.lang.reflect` 包中的两个类：Proxy 和 InvocationHandler。 
>
> InvocationHandler 是一个接口，通过实现该接口定义横切逻辑，并通过反射机制调用目标类的代码，动态将横切逻辑和业务逻辑编制在一起。
>
> Proxy 利用 InvocationHandler 动态创建一个符合某一接口的实例，生成目标类的代理对象。
>
> 原理是使用反射机制。

```java
public class LoggingHandler implements InvocationHandler {

    /**
     * 被代理的目标对象
     */
    private Object proxyObj;

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("The method " + method.getName() + " begins with " + Arrays.toString(args));
        Object result = method.invoke(proxyObj,args);
        System.out.println("The method " + method.getName() + " ends with " + Arrays.toString(args));
        return result;
    }

    public Object createProxy(Object proxyObj){
        this.proxyObj = proxyObj;
        //返回一个代理对象
        return Proxy.newProxyInstance(proxyObj.getClass().getClassLoader(),
                proxyObj.getClass().getInterfaces(),this);
    }
}
```

2、再用 CGLib 动态代理实现校验功能

> CGLIB 全称为 Code Generation Library，是一个强大的高性能，高质量的代码生成类库，可以在运行期扩展 Java 类与实现 Java 接口，CGLib 封装了 asm，可以再运行期动态生成新 的 class。
>
> 和 JDK 动态代理相比较：JDK 创建代理有一个限制，就是只能为接口创建代理实例， 而对于没有通过接口定义业务方法的类，则可以通过 CGLIB 创建动态代理。
>
> 需要导入 cglib-nodep-***.jar
>

```java
public class ValidationHandler implements MethodInterceptor {

    /**
     * 被代理的目标对象
     */
    private Object targetObject;


    public Object createProxy(Object targetObject){
        this.targetObject = targetObject;
        Enhancer enhancer = new Enhancer();
        //设置代理目标
        enhancer.setSuperclass(targetObject.getClass());
        //设置回调
        enhancer.setCallback(this);
        return enhancer.create();
    }

    /**
     * 在代理实例上处理方法调用并返回结果
     * @param o ： 代理类
     * @param method ：被代理的方法
     * @param objects ：该方法的参数数组
     * @param methodProxy
     */
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        Object result = null;

        for (Object object : objects) {
            if(Integer.parseInt(object.toString()) < 0){
                throw new IllegalArgumentException("Positive numbers only");
            }
        }
        //执行目标对象的方法
        result = methodProxy.invoke(targetObject,objects);
        return result;
    }
}
```

3、使用

```java
public static void main(String[] args) {

     ValidationHandler validationHandler = new ValidationHandler();
     LoggingHandler loggingHandler = new LoggingHandler();

     //cglib 要求目标对象是个单独的对象
     ArithmeticCalculatorImpl calculatorImpl = new ArithmeticCalculatorImpl();
     validationHandler.createProxy(calculatorImpl);

     //JDK 动态代理要求目标对象是接口
     ArithmeticCalculator calculator = new ArithmeticCalculatorImpl();
     ArithmeticCalculator loggingProxy = (ArithmeticCalculator) loggingHandler.createProxy(calculator);
     loggingProxy.add(1,2);

     ArithmeticCalculatorImpl validationProxy = (ArithmeticCalculatorImpl) validationHandler.createProxy(calculatorImpl);
     validationProxy.sub(-1,2);
   }
```



## 二、AOP

- AOP(Aspect-Oriented Programming，面向切面编程)： 是一种新的方法论，是对传统 OOP(Object-Oriented Programming，面向对象编程) 的补充
- AOP 的主要编程对象是切面(aspect)，而切面模块化横切关注点
- 在应用 AOP 编程时，仍然需要定义公共功能，但可以明确的定义这个功能在哪里，以什么方式应用，并且不必修改受影响的类。这样一来横切关注点就被模块化到特殊的对象(切面)里
- AOP 的好处：

  - 每个事物逻辑位于一个位置，代码不分散，便于维护和升级

  - 业务模块更简洁，只包含核心业务代


![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/spring/aop-demo.svg)

### AOP 核心概念

- 切面（aspect）：类是对物体特征的抽象，切面就是对横切关注点的抽象

- 横切关注点：对哪些方法进行拦截，拦截后怎么处理，这些关注点称之为横切关注点

- 连接点（joinpoint）：程序执行的某个特定位置：如类某个方法调用前、调用后、方法抛出异常后等。连接点由两个信息确定：方法表示的程序执行点；相对点表示的方位。例如 ArithmethicCalculator#add() 方法执行前的连接点，执行点为 ArithmethicCalculator#add()； 方位为该方法执行前的位置。

  被拦截到的点，因为 Spring 只支持方法类型的连接点，所以在 Spring 中连接点指的就是被拦截到的方法，实际上连接点还可以是字段或者构造器

- 切入点（pointcut）：每个类都拥有多个连接点，例如 ArithmethicCalculator 的所有方法实际上都是连接点，即连接点是程序类中客观存在的事务。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件。切点和连接点不是一对一的关系，一个切点匹配多个连接点，切点通过 `org.springframework.aop.Pointcut` 接口进行描述，它使用类和方法作为连接点的查询条件。

- 通知（advice）：所谓通知指的就是指拦截到连接点之后要执行的代码，通知分为前置、后置、 异常、最终、环绕通知五类

- 目标对象（Target）：代理的目标对象
- 代理（Proxy）：向目标对象应用通知之后创建的对象

- 织入（weave）：将切面应用到目标对象并导致代理对象创建的过程

- 引入（introduction）：在不修改代码的前提下，引入可以在运行期为类动态地添加一些方法或字段。

> "横切"的技术，剖解开封装的对象内部，并将那些影响了多个类的公共行为封装到一个可重用模块， 并将其命名为"Aspect"，即切面。所谓"切面"，简单说就是那些与业务无关，却为业务模块所共同调用的逻辑或责任封装起来，便于减少系统的重复代码，降低模块之间的耦合度，并有利于未来的可操作性和可维护性。
>
> 使用"横切"技术，AOP 把软件系统分为两个部分：**核心关注点**和**横切关注点**。业务处理的主要流程是核心关注点，与之关系不大的部分是横切关注点。
>
> 横切关注点的一个特点是，他们经常发生在核心关注点的多处，而各处基本相似，比如权限认证、日志、事物。
>
> AOP 的作用在于分离系统中的各种关注点，将核心关注点和横切关注点分离开来。
>
> AOP 主要应用场景有：
>
> - Authentication 权限
> - Caching 缓存
> - Context passing 内容传递
> - Error handling 错误处理
> - Lazy loading 懒加载
> - Debugging 调试
> - logging, tracing, profiling and monitoring 记录跟踪、优化、校准
> - Performance optimization 性能优化
> - Persistence 持久化
> - Resource pooling 资源池
> - Synchronization 同步
> - Transactions 事务



## 三、Spring AOP

- **AspectJ**：Java 社区里最完整最流行的 AOP 框架
- 在 Spring2.0 以上版本中，可以使用基于 AspectJ 注解或基于 XML 配置的 AOP



**在 Spring 中启用 AspectJ 注解支持**

- 要在 Spring 应用中使用 AspectJ 注解，必须在 classpath 下包含 AspectJ 类库:

  aopalliance.jar、aspectj.weaver.jar 和 spring-aspects.jar

- 将 aop Schema 添加到 \<beans> 根元素中

- 要在 Spring IOC 容器中启用 AspectJ 注解支持，只要在 Bean 配置文件中定义一个空的 XML 元素 \<aop:aspectj-autoproxy>

- 当 Spring IOC 容器侦测到 Bean 配置文件中的 \<aop:aspectj-autoproxy> 元素时，会自动为与 AspectJ 切面匹配的 Bean 创建代理



### 3.1 用 AspectJ 注解声明切面

- 要在 Spring 中声明 AspectJ 切面，只需要在 IOC 容器中将切面声明为 Bean 实例。当在 Spring IOC 容器中初始化 AspectJ 切面之后，Spring IOC 容器就会为那些与 AspectJ 切面相匹配的 Bean 创建代理
- 在 AspectJ 注解中，切面只是一个带有 @Aspect 注解的 Java 类
- 通知是标注有某种注解的简单的 Java 方法
- AspectJ 支持 5 种类型的通知注解：

  - @Before：前置通知，在方法执行之前执行
  - @After：后置通知，在方法执行之后执行
  - @AfterRunning：返回通知，在方法返回结果之后执行
  - @AfterThrowing：异常通知，在方法抛出异常之后
  - @Around：环绕通知，围绕着方法执行



#### 1、前置通知

前置通知：在方法执行之前执行的通知

前置通知使用 @Before 注解，并将切入点表达式的值作为注解值

- @Aspect：标识这个类是一个切面

- @Before：标识这个方法是个前置通知
  - execution 代表切点表达式，表示执行 ArithmeticCalculator 接口的 `add()` 方法
  - \* 代表匹配任意修饰符及任意返回值
  - 参数列表中的 .. 代表匹配任意数量的参数

```java
@Aspect
@Component
public class LogAspect {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    /**
     * 前置通知，目标方法调用前被调用
     */
    @Before("execution(* priv.starfish.aop.aspect.Calculator.add(..))")
    public void beforeAdvice(){
        log.info("The method add begins");
    }
 
}
```



##### 利用方法签名编写 AspectJ 切入点表达式

最典型的切入点表达式是根据方法的签名来匹配各种方法:

- `execution *priv.starfish.aop.ArithmeticCalculator.*(..)`： 匹配 ArithmeticCalculator 中声明的所有方法，第一个 * 

  代表任意修饰符及任意返回值，第二个 * 代表任意方法，.. 代表匹配任意数量的参数。若目标类与接口与该切面在同一个包中，可以省略包名

- `execution public * ArithmeticCalculator.*(..)`： 匹配 ArithmeticCalculator 接口的所有公有方法

- `execution public double ArithmeticCalculator.*(..)`： 匹配 ArithmeticCalculator 中返回 double 类型数值的方法

- `execution public double ArithmeticCalculator.*(double, ..)`： 匹配第一个参数为 double 类型的方法， .. 匹配任意数量任意类型的参数

- `execution public double ArithmeticCalculator.*(double, double)`： 匹配参数类型为 double, double 的方法



##### 合并切入点表达式

- AspectJ 可以使用 且（&&）、或（||）、非（！）来组合切入点表达式
- 在 Schema风格下，由于在 XML 中使用“&&”需要使用转义字符“\&amp;&amp”来代替，所以很不方便，因此 Spring AOP 提供了and、or、not 来代替 &&、||、！。

```java
@Pointcut("execution(* *.add(int,int)) || execution(* *.sub(int,int))")
public void loggingOperation(){};
```



##### 让通知访问当前连接点的细节

可以在通知方法中声明一个类型为 JoinPoint 的参数，然后就能访问连接细节了，比如方法名称和参数值等

```java
@Before("execution(* priv.starfish.aop.aspect.Calculator.add(..))")
public void beforeAdvice(JoinPoint joinPoint) {
  log.info("The method " + joinPoint.getSignature().getName()
           + "() begins with " + Arrays.toString(joinPoint.getArgs()));
}
```



#### 2、后置通知

- 后置通知是在连接点完成之后执行的，即连接点返回结果或者抛出异常的时候，下面的后置通知记录了方法的终止
- 一个切面可以包括一个或者多个通知

```java
@Aspect
@Component
public class LogAspect {
private Logger log = LoggerFactory.getLogger(this.getClass());

  /**
   * 前置通知，目标方法调用前被调用
   */
  @Before("execution(* priv.starfish.aop.aspect.Calculator.add(..))")
  public void beforeAdvice(){
      log.info("The method add begins");
  }
  
  /**
   * 后置通知，目标方法执行完执行
   */
  @After("execution( * *.*(..))")
  public void afterAdvice(JoinPoint joinPoint){
    log.info("The method " + joinPoint.getSignature().getName() + "() ends");
  }
  
}
```



#### 3、返回通知

- 无论连接点是正常返回还是抛出异常，后置通知都会执行。如果只想在连接点返回的时候记录日志，应该使用返回通知代替后置通知

  > **在返回通知中访问连接点的返回值**
  >
  > - 在返回通知中，只要将 returning 属性添加到 @AfterReturning 注解中，就可以访问连接点的返回值。该属性的值即为用来传入返回值的参数名称
  > - 必须在通知方法的签名中添加一个同名参数，在运行时，Spring AOP 会通过这个参数传递返回值
  > - 原始的切点表达式需要出现在 pointcut 属性中

```java
/**
 * 后置返回通知
 * 如果参数中的第一个参数为JoinPoint，则第二个参数为返回值的信息
 * 如果参数中的第一个参数不为JoinPoint，则第一个参数为returning中对应的参数
 * returning 只有目标方法返回值与通知方法相应参数类型时才能执行后置返回通知，否则不执行
 */
@AfterReturning(value = "loggingOperation()",returning = "res")
public void afterReturningAdvice(JoinPoint joinPoint, Object res){
    System.out.println("后置返回通知 返回值："+res);
}
```



#### 4、后置异常通知

- 只在连接点抛出异常时才执行异常通知
- 将 throwing 属性添加到 @AfterThrowing 注解中，也可以访问连接点抛出的异常。 Throwable 是所有错误和异常类的超类，所以在异常通知方法可以捕获到任何错误和异常
- 如果只对某种特殊的异常类型感兴趣，可以将参数声明为其他异常的参数类型。然后通知就只在抛出这个类型及其子类的异常时才被执行

```java
/**
 * 后置异常通知
 *  定义一个名字，该名字用于匹配通知实现方法的一个参数名，当目标方法抛出异常返回后，将把目标方法抛出的异常传给通知方法；
 *  throwing 只有目标方法抛出的异常与通知方法相应参数异常类型时才能执行后置异常通知，否则不执行，
 */
@AfterThrowing(value = "loggingOperation()",throwing = "exception")
public void afterThrowingAdvice(JoinPoint joinPoint,ArithmeticException exception){
    log.error(joinPoint.getSignature().getName() + "has throw an exception" + exception);
}
```



#### 5、环绕通知

- 环绕通知是所有通知类型中功能最为强大的，能够全面地控制连接点。甚至可以控制是否执行连接点
- 对于环绕通知来说，连接点的参数类型必须是 ProceedingJoinPoint。 它是 JoinPoint 的子接口，允许控制何时执行，是否执行连接点
- 在环绕通知中需要明确调用 ProceedingJoinPoint 的 `proceed()` 方法来执行被代理的方法，如果忘记这样做就会导致通知被执行了，但目标方法没有被执行
- 注意：环绕通知的方法需要返回目标方法执行之后的结果，即调用 `joinPoint.proceed();` 的返回值，否则会出现空指针异常

```java
/**
 * 环绕通知：
 * 环绕通知非常强大，可以决定目标方法是否执行，什么时候执行，执行时是否需要替换方法参数，执行完毕是否需要替换返回值。
 * 环绕通知第一个参数必须是org.aspectj.lang.ProceedingJoinPoint类型
 */
@Around("loggingOperation()")
public Object aroundAdvice(ProceedingJoinPoint joinPoint){
    System.out.println("- - - - - 环绕前置通知 - - - -");
    try {
        //调用执行目标方法
        Object obj = joinPoint.proceed();
        System.out.println("- - - - - 环绕后置返回通知 - - - -");
        return obj;
    } catch (Throwable throwable) {
        throwable.printStackTrace();
        System.out.println("- - - - - 环绕异常通知 - - - -");
    }finally {
        System.out.println("- - - - - 环绕后置通知 - - - -");
    }
    return null;
}
```



#### 指定切面的优先级

- 在同一个连接点上应用不止一个切面时，除非明确指定，否则它们的优先级是不确定的
- 切面的优先级可以通过实现 Ordered 接口或利用 @Order 注解指定
- 实现 Ordered 接口，`getOrder()` 方法的返回值越小，优先级越高
- 若使用 @Order 注解，序号出现在注解中

```java
@Aspect
@Order(0)
public class ValidationAspect {
}

@Aspect
@Order(1)
public class LogAspect {
```



#### 重用切入点定义

- 在编写 AspectJ 切面时，可以直接在通知注解中书写切入点表达式。但同一个切点表达式可能会在多个通知中重复出现
- 在 AspectJ 切面中，可以通过 @Pointcut 注解将一个切入点声明成简单的方法。切入点的方法体通常是空的，因为将切入点定义与应用程序逻辑混在一起是不合理的
- 切入点方法的访问控制符同时也控制着这个切入点的可见性。如果切入点要在多个切面中共用，最好将它们集中在一个公共的类中。在这种情况下，它们必须被声明为 public。在引入这个切入点时，必须将类名也包括在内。如果类没有与这个切面放在同一个包中，还必须包含包名。
- 其他通知可以通过方法名称引入该切入点

```java
/**
 * 切入点
 */
@Pointcut("execution(public int priv.starfish.aop.aspect.CalculatorImpl.*(int,int))")
public void executePackage(){};

/**
 * 这里直接写成 value= 调用了切入点 excution 表达式
 */
@AfterReturning(value = "executePackage()",returning = "res")
public void afterReturningAdvice(JoinPoint joinPoint, Object res){
  System.out.println("- - - - - 后置返回通知- - - - -");
  System.out.println("后置返回通知 返回值："+res);
}
```



#### 引入通知

- 引入通知是一种特殊的通知类型。它通过为接口提供实现类，允许对象动态地实现接口，就像对象已经在运行时扩展了实现类一样

- 引入通知可以使用两个实现类 MaxCalculatorImpl 和 MinCalculatorImpl，让 ArithmeticCalculatorImpl 动态地实现 MaxCalculator和 MinCalculator接口。而这与从 MaxCalculatorImpl 和 MinCalculatorImpl 中实现多继承的效果相同。但却不需要修改 ArithmeticCalculatorImpl 的源代码
- 引入通知也必须在切面中声明
- 在切面中，通过为**任意字段**添加**@DeclareParents**注解来引入声明
- 注解类型的 **value** 属性表示哪些类是当前引入通知的目标。value 属性值也可以是一个 AspectJ 类型的表达式，可以将一个接口引入到多个类中。**defaultImpl**属性中指定这个接口使用的实现类

> 代码在 starfish-learn-spring 上



### 3.2 用基于 XML 的配置声明切面

- 除了使用 AspectJ 注解声明切面，Spring 也支持在 Bean 配置文件中声明切面。这种声明是通过 aop schema 中的 XML 元素完成的

- 正常情况下，基于注解的声明要优先于基于 XML 的声明。通过 AspectJ注解，切面可以与 AspectJ 兼容，而基于 XML 的配置则是 Spring 专有的。由于 AspectJ 得到越来越多的 AOP 框架支持，所以以注解风格编写的切面将会有更多重用的机会

- 当使用 XML 声明切面时，需要在 \<beans> 根元素中导入 aop Schema

- 在 Bean 配置文件中，所有的 Spring AOP 配置都必须定义在 \<aop:config> 元素内部。对于每个切面而言，都要创建一个 \<aop:aspect>

  元素来为具体的切面实现引用后端 Bean 实例

- 切面 Bean 必须有一个标识符，供 \<aop:aspect> 元素引用

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-4.2.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop-4.2.xsd">

    <bean id="calculator" class="priv.starfish.aop.xml.CalculatorImpl" />
    <bean id="timeHandler" class="priv.starfish.aop.xml.TimeHandler" />

    <aop:config>
        <aop:aspect id="time" ref="timeHandler">
            <aop:pointcut id="addTime" expression="execution(* priv.starfish.aop.xml.*.*(..))"/>
            <aop:before method="printTime" pointcut-ref="addTime" />
            <aop:after method="printTime" pointcut-ref="addTime" />
        </aop:aspect>
    </aop:config>
</beans>
```

```java
public class TimeHandler {

    public void printTime() {
        System.out.println("CurrentTime = " + System.currentTimeMillis());
    }
}
```

```java
public static void main(String[] args) {
    ApplicationContext ctx =
            new ClassPathXmlApplicationContext("applicationContext.xml");

    Calculator calculator = (Calculator)ctx.getBean("calculator");
    calculator.add(2,3);
}
```



### 3.2 AOP 两种代理方式

**Spring 中 AOP 代理由 Spring 的 IOC 容器负责生成、管理，其依赖关系也由 IOC 容器负责管理**。因此，AOP 代理可以直接使用容器中

的其它 bean 实例作为目标，这种关系可由 IOC 容器的依赖注入提供。Spring创建代理的规则为：

1. **默认使用 Java 动态代理来创建 AOP 代理**，这样就可以为任何接口实例创建代理了

2. **当需要代理的类不是代理接口的时候，Spring会切换为使用CGLIB代理**，也可强制使用 CGLIB

Spring 提供了两种方式来生成代理对象： **JDKProxy** 和 **Cglib**，具体使用哪种方式生成由 AopProxyFactory 根据 AdvisedSupport 对象

的配置来决定。默认的策略是如果目标类是接口， 则使用 JDK 动态代理技术，否则使用 Cglib 来生成代理。



注：JDK 动态代理要比 cglib 代理执行速度快，但性能不如 cglib 好。所以在选择用哪种代理还是要看具体情况，一般单例模式用 cglib 比较好。