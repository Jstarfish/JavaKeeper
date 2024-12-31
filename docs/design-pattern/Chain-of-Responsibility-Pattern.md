---
title: 责任链模式
date: 2021-10-09
tags: 
 - Design Patterns
categories: Design Patterns
---

![](https://images.unsplash.com/photo-1463587480257-3c60227e1e52?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNoYWluJTIwb2YlMjByZXNwb25zbGl0eXxlbnwwfHwwfHx8MA%3D%3D)

> 责任链，顾名思义，就是用来处理相关事务责任的一条执行链，执行链上有多个节点，每个节点都有机会（条件匹配）处理请求事务，如果某个节点处理完了就可以根据实际业务需求传递给下一个节点继续处理或者返回处理完毕。
>
> 这种模式给予请求的类型，对请求的发送者和接收者进行解耦。属于行为型模式。
>
> 在这种模式中，通常每个接收者都包含对另一个接收者的引用。如果一个对象不能处理该请求，那么它会把相同的请求传给下一个接收者，依此类推。

先来看一段代码

```java
public void test(int i, Request request){
  if(i==1){
    Handler1.response(request);
  }else if(i == 2){
    Handler2.response(request);
  }else if(i == 3){
    Handler3.response(request);
  }else if(i == 4){
    Handler4.response(request);
  }else{
    Handler5.response(request);
  }
}
```

代码的业务逻辑是这样的，方法有两个参数：整数 i 和一个请求 request，根据 i 的值来决定由谁来处理 request，如果 i==1，由 Handler1来处理，如果 i==2，由 Handler2 来处理，以此类推。在编程中，这种处理业务的方法非常常见，所有处理请求的类由 if…else… 条件判断语句连成一条责任链来对请求进行处理，相信大家都经常用到。这种方法的优点是非常直观，简单明了，并且比较容易维护，但是这种方法也存在着几个比较令人头疼的问题：

- **代码臃肿**：实际应用中的判定条件通常不是这么简单地判断是否为1或者是否为2，也许需要复杂的计算，也许需要查询数据库等等，这就会有很多额外的代码，如果判断条件再比较多，那么这个if…else…语句基本上就没法看了。
- **耦合度高**：如果我们想继续添加处理请求的类，那么就要继续添加if…else…判定条件；另外，这个条件判定的顺序也是写死的，如果想改变顺序，那么也只能修改这个条件语句。

既然缺点我们已经清楚了，就要想办法来解决。这个场景的业务逻辑很简单：如果满足条件1，则由 Handler1 来处理，不满足则向下传递；如果满足条件2，则由 Handler2 来处理，不满足则继续向下传递，以此类推，直到条件结束。其实改进的方法也很简单，就是把判定条件的部分放到处理类中，这就是责任连模式的原理。

------



## 定义

**责任链模式(Chain of Responsibility Pattern)**：使多个对象都有机会处理请求，从而避免了请求的发送者和接受者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递该请求，直到有对象处理它为止。

------



## 角色

- **Handler**： 抽象处理类，抽象处理类中主要包含一个指向下一处理类的成员变量 nextHandler 和一个处理请求的方法 handRequest，handRequest 方法的主要主要思想是，如果满足处理的条件，则由本处理类来进行处理，否则由 nextHandler 来处理
- **ConcreteHandler**： 具体处理类主要是对具体的处理逻辑和处理的适用条件进行实现。具体处理者接到请求后，可以选择将请求处理掉，或者将请求传给下家。由于具体处理者持有对下家的引用，因此，如果需要，具体处理者可以访问下家
- **Client**：客户端

------



## 类图

![](https://img.starfish.ink/design-patterns/responsibility-pattern-uml.png)

### coding

```java
public abstract class Handler {
    private Handler nextHandler;
    private int level;

    public Handler(int level) {
        this.level = level;
    }

    public void setNextHandler(Handler handler){
        this.nextHandler = handler;
    }

    public final void handlerRequest(Request request){
        if(level == request.getLevel()){
            this.response(request);
        }else{
            if (this.nextHandler != null){
                this.nextHandler.handlerRequest(request);
            }else{
                System.out.println("===已经没有处理器了===");
            }
        }

    }
    // 抽象方法，子类实现
    public abstract void response(Request request);
}

class Request {
    int level = 0;
    public Request(int level){
        this.level = level;
    }
    public int getLevel() {
        return level;
    }
}
```

```java
public class ConcreteHandler1 extends Handler {
    public ConcreteHandler1(int level) {
        super(level);
    }

    @Override
    public void response(Request request) {
        System.out.println("请求由处理器1进行处理");
    }
}

public class ConcreteHandler2 extends Handler {
	//...
}

public class ConcreteHandler2 extends Handler {
	//...
}
```

```java
public class Client {
    public static void main(String[] args) {
        ConcreteHandler1 handler1 = new ConcreteHandler1(1);
        ConcreteHandler2 handler2 = new ConcreteHandler2(2);
        ConcreteHandler3 handler3 = new ConcreteHandler3(3);
		//处理者构成一个环形
        handler1.setNextHandler(handler2);
        handler2.setNextHandler(handler3);

        handler1.handlerRequest(new Request(1));
    }
}
```



## 实例

当你想要让一个以上的对象有机会能够处理某个请求的时候，就是用责任链模式。

通过责任链模式，你可以为某个请求创建一个对象链。每个对象依序检查此请求，并对其进行处理，或者将它传给链中的下一个对象。

比如

- 程序员要请 3 天以上的假期，在 OA 申请，需要直接主管、总监、HR 层层审批后才生效。类似的采购审批、报销审批。。。
- 美团在外卖营销业务中资源位展示的逻辑  https://tech.meituan.com/2020/03/19/design-pattern-practice-in-marketing.html



## 应用

JAVA 中的异常处理机制、JAVA WEB 中 Apache Tomcat 对 Encoding 的处理，Struts2 的拦截器，JSP、Servlet 的 Filter 均是责任链的典型应用。

### Servlet 中的责任链

```java
public final class ApplicationFilterChain implements FilterChain {
    private static final ThreadLocal<ServletRequest> lastServicedRequest;
    private static final ThreadLocal<ServletResponse> lastServicedResponse;
    public static final int INCREMENT = 10;
    private ApplicationFilterConfig[] filters = new ApplicationFilterConfig[0];
    private int pos = 0;  //下一个要执行的filter的位置
    private int n = 0;    //filter个数
    private Servlet servlet = null;
    public ApplicationFilterChain() {
    }

    public void doFilter(ServletRequest request, ServletResponse response) throws IOException, ServletException {
        if (Globals.IS_SECURITY_ENABLED) {
            final ServletRequest req = request;
            final ServletResponse res = response;

            try {
                AccessController.doPrivileged(new PrivilegedExceptionAction<Void>() {
                    public Void run() throws ServletException, IOException {
                        ApplicationFilterChain.this.internalDoFilter(req, res);
                        return null;
                    }
                });
            } catch (PrivilegedActionException var7) {
                Exception e = var7.getException();
                if (e instanceof ServletException) {
                    throw (ServletException)e;
                }

                if (e instanceof IOException) {
                    throw (IOException)e;
                }

                if (e instanceof RuntimeException) {
                    throw (RuntimeException)e;
                }

                throw new ServletException(e.getMessage(), e);
            }
        } else {
            this.internalDoFilter(request, response);
        }
    }
```

FilterChain 就是一条过滤链。其中每个过滤器（Filter）都可以决定是否执行下一步。过滤分两个方向，进和出：

- 进：在把 ServletRequest 和 ServletResponse 交给 Servlet 的 service 方法之前，需要进行过滤

- 出：在service方法完成后，往客户端发送之前，需要进行过滤



### Spring MVC 中的责任链

Spring MVC 的 diapatcherServlet 的 doDispatch 方法中，获取与请求匹配的处理器 `HandlerExecutionChain`就是用到了责任链模式。

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;    //使用到了责任链模式
    boolean multipartRequestParsed = false;
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

    try {
        try {
            ModelAndView mv = null;
            Object dispatchException = null;

            try {
                processedRequest = this.checkMultipart(request);
                multipartRequestParsed = processedRequest != request;
                mappedHandler = this.getHandler(processedRequest); 
                if (mappedHandler == null) {
                    this.noHandlerFound(processedRequest, response);
                    return;
                }

                HandlerAdapter ha = this.getHandlerAdapter(mappedHandler.getHandler());
                String method = request.getMethod();
                boolean isGet = "GET".equals(method);
                if (isGet || "HEAD".equals(method)) {
                    long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
                    if ((new ServletWebRequest(request, response)).checkNotModified(lastModified) && isGet) {
                        return;
                    }
                }
                //责任链模式执行预处理方法，其实是将请求交给注册的拦截器执行
                if (!mappedHandler.applyPreHandle(processedRequest, response)) {
                    return;
                }

                mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
                if (asyncManager.isConcurrentHandlingStarted()) {
                    return;
                }

                this.applyDefaultViewName(processedRequest, mv);
               //责任链执行后处理方法
                mappedHandler.applyPostHandle(processedRequest, response, mv);
            } catch (Exception var22) {
         //...
    } finally {
 }
 }
```

- SpringMVC 请求的流程中，执行了拦截器相关方法 `interceptor.preHandler` 等等
- 在处理 SpringMVC 请求时，使用到职责链模式还使用到适配器模式
- HandlerExecutionChain 主要负责的是请求拦截器的执行和请求处理，但是他本身不处理请求，只是将请求分配给链上注册处理器执行，这是职责链实现方式，减少职责链本身与处理逻辑之间的耦合，规范了处理流程
- HandlerExecutionChain 维护了 HandlerInterceptor 的集合， 可以向其中注册相应的拦截器

------



## 总结

**责任链模式其实就是一个灵活版的 if…else…语句**，它就是将这些判定条件的语句放到了各个处理类中，这样做的优点是比较灵活了，但同样也带来了风险，比如设置处理类前后关系时，一定要特别仔细，搞对处理类前后逻辑的条件判断关系，**并且注意不要在链中出现循环引用的问题**。

**优点**：

- 降低耦合度：将请求和处理分开，实现解耦，提高了系统的灵活性。
- 简化了对象：对象不需要知道链的结构
- 良好的扩展性：增加处理者的实现很简单，只需重写处理请求业务逻辑的方法。

**缺点**：

- 从链头发出，直到有处理者响应，在责任链比较长的时候会影响系统性能，一般需要在 Handler 中设置一个最大节点数。
- 请求递归，调试排错比较麻烦。

**使用场景**： 

- 有多个对象可以处理同一个请求，具体哪个对象处理该请求由运行时刻自动确定。 
- 在不明确指定接收者的情况下，向多个对象中的一个提交一个请求。 
- 可动态指定一组对象处理请求。

**模式的扩展**：

职责链模式存在以下两种情况。

1. 纯的职责链模式：一个请求必须被某一个处理者对象所接收，且一个具体处理者对某个请求的处理只能采用以下两种行为之一：自己处理（承担责任）；把责任推给下家处理。
2. 不纯的职责链模式：允许出现某一个具体处理者对象在承担了请求的一部分责任后又将剩余的责任传给下家的情况，且一个请求可以最终不被任何接收端对象所接收。

------



## 参考

- 《研磨设计模式》
- https://wiki.jikexueyuan.com/project/java-design-pattern/chain-responsibility-pattern.html
- https://refactoringguru.cn/design-patterns/chain-of-responsibility
