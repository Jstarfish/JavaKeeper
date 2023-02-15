#### WebHandler

```java
public interface WebHandler {
 /**
 * Handle the web server exchange.
 * @param exchange the current server exchange
 * @return {@code Mono<Void>} to indicate when request handling is complete
 */
    Mono<Void> handle(ServerWebExchange exchange);
}
```

在这里，说明一下HttpHandler与WebHandler的区别，两者的设计目标不同。前者主要针对的是跨HTTP服务器，即付出最小的代价在各种不同的HTTP服务器上保证程序正常运行。于是我们在前面的章节中看到了为适配Reactor Netty而进行的ReactorHttpHandlerAdapter类相关实现。而后者则侧重于提供构建常用Web应用程序的基本功能。例如，我们可以在上面的WebHandler源码中看到handle方法传入的参数是ServerWebExchange类型的，通过这个类型参数，我们所定义的WebHandler组件不仅可以访问请求（ServerHttpRequest getRequest）和响应（ServerHttpResponse getResponse），也可以访问请求的属性（Map<String, Object> getAttributes）及会话的属性，还可以访问已解析的表单数据（Form data）、多部分数据（Multipart data）等。



#### DispatcherHandler

```java
public class DispatcherHandler implements WebHandler, ApplicationContextAware {
 @Nullable
 private List<HandlerMapping> handlerMappings;

 @Nullable
 private List<HandlerAdapter> handlerAdapters;

 @Nullable
 private List<HandlerResultHandler> resultHandlers;
    ...
 @Override
 public void setApplicationContext(ApplicationContext applicationContext) {
 initStrategies(applicationContext);
    }
 protected void initStrategies(ApplicationContext context) {
 Map<String, HandlerMapping> mappingBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
                context, HandlerMapping.class, true, false);

 ArrayList<HandlerMapping> mappings = new ArrayList<>(mappingBeans.values());
        AnnotationAwareOrderComparator.sort(mappings);
 this.handlerMappings = Collections.unmodifiableList(mappings);

 Map<String, HandlerAdapter> adapterBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
                context, HandlerAdapter.class, true, false);

 this.handlerAdapters = new ArrayList<>(adapterBeans.values());
        AnnotationAwareOrderComparator.sort(this.handlerAdapters);

 Map<String, HandlerResultHandler> beans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
                context, HandlerResultHandler.class, true, false);

 this.resultHandlers = new ArrayList<>(beans.values());
        AnnotationAwareOrderComparator.sort(this.resultHandlers);
    }
    ...
}
```

Spring WebFlux为了适配我们在Spring MVC中养成的开发习惯，围绕熟知的Controller进行了相应的适配设计，其中有一个WebHandler实现类DispatcherHandler(如下代码所示)，是请求处理的调度中心，实际处理工作则由可配置的委托组件执行。该模型非常灵活，支持多种工作流程。

换句话说，DispatcherHandler就是HTTP请求相应处理器（handler）或控制器（controller）的中央调度程序。DispatcherHandler会从Spring Configuration中发现自己所需的组件，也就是它会从应用程序上下文中（application context）查找以下内容。

### 路由模式

Spring WebFlux包含一个轻量级的函数式编程模型，其中定义的函数可以对请求进行路由处理。请求也可以通过基于注解形式的路由模式进行处理。