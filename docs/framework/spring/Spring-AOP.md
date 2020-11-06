# Spring AOP

"横切"的技术，剖解开封装的对象内部，并将那些影响了多个类的公共行为封装到一个可重用模块， 并将其命名为"Aspect"，即切面。所谓"切面"，简单说就是那些与业务无关，却为业务模块所共 同调用的逻辑或责任封装起来，便于减少系统的重复代码，降低模块之间的耦合度，并有利于未 来的可操作性和可维护性。 

使用"横切"技术，AOP 把软件系统分为两个部分：**核心关注点**和**横切关注点**。业务处理的主要流程是核心关注点，与之关系不大的部分是横切关注点。横切关注点的一个特点是，他们经常发生在核心关注点的多处，而各处基本相似，比如权限认证、日志、事物。

AOP 的作用在于分离系统中的各种关注点，将核心关注点和横切关注点分离开来。

 AOP 主要应用场景有： 

- Authentication 权限 
- Caching 缓存 
- Context passing 内容传递 
- Error handling 错误处理 
- Lazy loading 懒加载
- Debugging 调试
- logging, tracing, profiling and monitoring 记录跟踪 优化 校准
- Performance optimization 性能优化
- Persistence 持久化
- Resource pooling 资源池
- Synchronization 同步
- Transactions 事务



## AOP 核心概念

切面（aspect）：类是对物体特征的抽象，切面就是对横切关注点的抽象

横切关注点：对哪些方法进行拦截，拦截后怎么处理，这些关注点称之为横切关注点

连接点（joinpoint）：被拦截到的点，因为 Spring 只支持方法类型的连接点，所以在 Spring 中连接点指的就是被拦截到的方法，实际上连接点还可以是字段或者构造器

切入点（pointcut）：对连接点进行拦截的定义

通知（advice）：所谓通知指的就是指拦截到连接点之后要执行的代码，通知分为前置、后置、 异常、最终、环绕通知五类

目标对象：代理的目标对象

织入（weave）：将切面应用到目标对象并导致代理对象创建的过程

引入（introduction）：在不修改代码的前提下，引入可以在运行期为类动态地添加一些方法 或字段。





## AOP 两种代理方式

Spring 提供了两种方式来生成代理对象: **JDKProxy** 和 **Cglib**，具体使用哪种方式生成由 AopProxyFactory 根据 AdvisedSupport 对象的配置来决定。默认的策略是如果目标类是接口， 则使用 JDK 动态代理技术，否则使用 Cglib 来生成代理。

### JDK 动态接口代理 

JDK 动态代理主要涉及到 `java.lang.reflect` 包中的两个类：Proxy 和 InvocationHandler。 InvocationHandler 是一个接口，通过实现该接口定义横切逻辑，并通过反射机制调用目标类的代码，动态将横切逻辑和业务逻辑编制在一起。Proxy 利用 InvocationHandler 动态创建 一个符合某一接口的实例，生成目标类的代理对象。

原理是使用反射机制

**首先定义接口，并实现**   

```java
    public interface TestService {
        public int add();    
    }
 
    public class TestServiceImpl implements TestService {
 
        @Override
        public int add() {
            System.out.println("开始执行add..."); 
            return 0;
        }
    }
```

**定义代理类，这里要注意导入的包是import java.lang.reflect.\***

```java
   public class JDKDynamicProxy implements InvocationHandler {
 
     //被代理的目标对象
    private Object proxyObj;  
    
    /**
      * Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)
      * loader    :类加载器 一个ClassLoader对象，定义了由哪个ClassLoader对象来对生成的代理对象进行加载
      * interfaces:一个Interface对象的数组，表示的是我将要给我需要代理的对象提供一组什么接口，如果我提供了一组接口给它，那么这个代理对象就宣称实现了该接口(多态)，这样我就能调用这组接口中的方法了
       * h         :一个InvocationHandler对象，表示的是当我这个动态代理对象在调用方法的时候，会关联到哪一个InvocationHandler对象上
     */
       public Object newProxy(Object proxyObj){  
             this.proxyObj = proxyObj;
            //返回一个代理对象  
           return Proxy.newProxyInstance(proxyObj.getClass().getClassLoader(),   
                                      proxyObj.getClass().getInterfaces(),   
                                      this);  
       }  
 
      /**
       * 执行目标对象
       * Object  proxy：被代理的对象
       * Method  method：要调用的方法
       * Object  args[]：方法调用时所需要的参数
       */
        @Override
        public Object invoke(Object proxy, Method method, Object[] args)
                                   throws Throwable {       
             before(); 
             Object object = method.invoke(this.proxyObj,args);  // 通过反射机制调用目标对象的方法
             after();       
             return object;  
         }
    
         public void before(){
              System.out.println("开始执行目标对象之前..."); 
         }
    
         public void after(){
             System.out.println("开始执行目标对象之后..."); 
         }
     }
```

**测试类：**   

```java
public static void main(String[] args) {
        
          //我们要代理的真实对象
          TestService testService = new TestServiceImpl();        
          //testJDKProxyService.add();//不是用代理    
        
         JDKDynamicProxy JDKDynamicProxyTarget = new JDKDynamicProxy();
         TestService testServiceProxy = (TestService) JDKDynamicProxyTarget.newProxy(testService);
         //执行代理类的方法  
         testServiceProxy.add();
 
     }
```

控制台显示

  ![img](https://images2015.cnblogs.com/blog/825618/201510/825618-20151023125046927-2133361015.png)

 

### CGLib 动态代理 

CGLib 全称为 Code Generation Library，是一个强大的高性能，高质量的代码生成类库， 可以在运行期扩展 Java 类与实现 Java 接口，CGLib 封装了 asm，可以再运行期动态生成新 的 class。和 JDK 动态代理相比较：JDK 创建代理有一个限制，就是只能为接口创建代理实例， 而对于没有通过接口定义业务方法的类，则可以通过 CGLib 创建动态代理。



需要导入 cglib-nodep-2.1_3.jar

先说下cglib，CGlib是一个强大的,高性能,高质量的Code生成类库。它可以在运行期扩展Java类与实现Java接口。

**先定义一个实现类（注意并没有实现接口）**

```java
public class TestCGLIBServiceImpl {
 
    public int add() {
        System.out.println("开始执行add..."); 
        return 0;
    }
 }
```

**定义cglib代理类，此时导入的包应该是import net.sf.cglib.proxy.\*** 


```java
import java.lang.reflect.Method;
  import net.sf.cglib.proxy.Enhancer;
  import net.sf.cglib.proxy.MethodInterceptor;
  import net.sf.cglib.proxy.MethodProxy;
 
    public class CGLIBProxy implements MethodInterceptor{
 
    private Object targetObject ;//被代理的目标对象
    
    public Object createProxyInstance(Object targetObject) {
 
           this.targetObject = targetObject;
 
           Enhancer enhancer = new Enhancer();
 
           enhancer.setSuperclass(targetObject.getClass());// 设置代理目标
 
           enhancer.setCallback(this);// 设置回调
 
           return enhancer.create();
 
    } 
    
 
    /**
     * 在代理实例上处理方法调用并返回结果 
     * @param object ： 代理类
     * @param method ：被代理的方法
     * @param args ：该方法的参数数组
     * @param methodProxy
     */
    @Override
    public Object intercept(Object object, Method method, Object[] args,
            MethodProxy methodproxy) throws Throwable {        
        Object result = null;    
        try {
              System.out.println("前置处理开始 ...");
              result = methodproxy.invoke( targetObject , args);//执行目标对象的方法
              System.out.println("后置处理开始  ...");
           } catch (Exception e) {
               System.out.println("异常处理 ...");
           } finally {
               System.out.println("调用结束 ...");
           }
           return result; 
       }   
   }
```

**测试类：**

```java
 public class TestCGLIBProxy {
 
        public static void main(String[] args) {
        
          //我们要代理的真实对象
          TestCGLIBServiceImpl testCGLIB = new TestCGLIBServiceImpl();
           CGLIBProxy CGLIBproxy = new CGLIBProxy();
           TestCGLIBServiceImpl testCGLIBProxy = (TestCGLIBServiceImpl) CGLIBproxy.createProxyInstance(testCGLIB);
           testCGLIBProxy.add();
       }
   }
```

结果图：

  ![](https://images2015.cnblogs.com/blog/825618/201510/825618-20151023134432505-1808034718.png)



### 写在代理模式之后

1、如果目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP
2、如果目标对象实现了接口，可以强制使用CGLIB实现AOP
3、如果目标对象没有实现了接口，必须采用CGLIB库，spring会自动在JDK动态代理和CGLIB之间转换

注：JDK 动态代理要比 cglib 代理执行速度快，但性能不如 cglib 好。所以在选择用哪种代理还是要看具体情况，一般单例模式用 cglib 比较好。



**写在后面：spring AOP的两种代理实现代码就写到这，这里只是实现了，如果你要想真正明白，还得熟悉其中原理机制，比如反射机制，newProxyInstance（...），Enhancer（）原理，invoke（）原理等等。**