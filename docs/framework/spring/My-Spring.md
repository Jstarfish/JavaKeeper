# 手写 Spring

![image-20201106173130849](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20201106173132.png)

配置阶段：主要是完成application.xml配置和Annotation配置。

初始化阶段：主要是加载并解析配置信息，然后，初始化IOC容器，完成容器的DI操作，已经完成HandlerMapping的初始化。

运行阶段：主要是完成Spring容器启动以后，完成用户请求的内部调度，并返回响应结果。