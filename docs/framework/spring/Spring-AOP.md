# Spring AOP











## 两种代理的使用

**1.JDK动态代理** **2.cglib代理**

1、如果目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP
2、如果目标对象实现了接口，可以强制使用CGLIB实现AOP
3、如果目标对象没有实现了接口，必须采用CGLIB库，spring会自动在JDK动态代理和CGLIB之间转换

注：JDK动态代理要比cglib代理执行速度快，但性能不如cglib好。所以在选择用哪种代理还是要看具体情况，一般单例模式用cglib比较好，具体原因请自行百度。

### 一 JDK动态代理实现（原理是使用反射机制）

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

 

### 二 CGLIB代理

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

  ![img](https://images2015.cnblogs.com/blog/825618/201510/825618-20151023134432505-1808034718.png)

**写在后面：spring AOP的两种代理实现代码就写到这，这里只是实现了，如果你要想真正明白，还得熟悉其中原理机制，比如反射机制，newProxyInstance（...），Enhancer（）原理，invoke（）原理等等。**