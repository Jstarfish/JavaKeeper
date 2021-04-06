# 手写 Spring

![image-20201106173130849](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20201106173132.png)
配置阶段：主要是完成application.xml配置和Annotation配置。

初始化阶段：主要是加载并解析配置信息，然后，初始化IOC容器，完成容器的DI操作，已经完成HandlerMapping的初始化。

运行阶段：主要是完成Spring容器启动以后，完成用户请求的内部调度，并返回响应结果。
=======


```undefined
   ⑴ 用户发送请求至前端控制器DispatcherServlet

   ⑵ DispatcherServlet收到请求调用HandlerMapping处理器映射器。

   ⑶ 处理器映射器根据请求url找到具体的处理器，生成处理器对象及处理器拦截器(如果有则生成)一并返回给DispatcherServlet。

   ⑷ DispatcherServlet通过HandlerAdapter处理器适配器调用处理器

   ⑸ 执行处理器(Controller，也叫后端控制器)。

   ⑹ Controller执行完成返回ModelAndView

   ⑺ HandlerAdapter将controller执行结果ModelAndView返回给DispatcherServlet

   ⑻ DispatcherServlet将ModelAndView传给ViewReslover视图解析器

   ⑼ ViewReslover解析后返回具体View

   ⑽ DispatcherServlet对View进行渲染视图（即将模型数据填充至视图中）。

   ⑾ DispatcherServlet响应用户。
```
