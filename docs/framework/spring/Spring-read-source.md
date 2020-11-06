## 为什么看

很多 Javaer 有过面试中被问到 “看过 Spring 源码没？”

平常的工作中，大多数开发其实都属于 CRUD 工程师，业务领域达到一定地步后，自己就会觉得重复的业务代码让我们不断的粘贴、复制和修改，日复一日，又担心自己变成一个业务代码生产机器，而无法面对新技术和环境变化。

所以，有时间的话，可以搭建一个 Spring 源码环境，想深入了解哪一块，就去自己实现，代码步入到相关的模块，为什么不是直接用 IDEA 的 jar 包编译方式呢，因为那玩意只能看，不能主动去改源码。

来吧，进去 Spring 看看 Java 界的扛把子们是怎么写代码的吧。肯定会对你日后写代码有帮助的。

- 良好的代码风格，也能看看 Spring 是怎么对方法，类，各种结构的明明方式和写法，别每次写个方法时候就会getXXX，
- 编码设计方式
- 
- 各种设计模式的运用

Spring 是一个很大的生态，我们不可能去花大把的时间，把每个细节都去掌握，所以，看源码之前，我们需要要先知道 Spring 的思想，然后再从源码中看实现，有精力的可以自己造个小轮子。



提升编码质量和水准

借鉴系统开发和设计思想

代码重构提供参考依据

面试

## 从哪里开始看

想读 Spring 源码，但是又不知道从哪里开始读，是先看 IOC 还是先看 AOP 呢，迷惑

Spring 涵盖的东西太多了，如果不能进行针对性的阅读，很容易迷失。

程序员学语言，学框架都是从 Hello World 开始的，看源码为什么不也从 Hello World 开始呢？

```java
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
Object bean = context.getBean("hello");
```

运行完这段代码后，我们产生这么几个疑问：

- ApplicationContext 是个容器，怎么创建的，创建时候干了什么？
- 怎么就获取到了配置文件 `applicationContext.xml`
- getBean() 怎么就调用了实例



## 如何看

最开始用最新版的代码，各种报错，“一气之下”，改为下载了 v5.0.16 版本的，竟然没有任何错误，开搞。源码中的自述文件，其实有教程，`import-into-idea.md`

步骤：

1. 安装并配置 Gradle
2. 下载 Spring 源码
3. 编译 Spring，进入 `spring-framework` 文件夹下，打开 cmd，输入 `gradlew :spring-oxm:compileTestJava` 进行编译
4. IDEA导入源码
5. 打开IDEA，File->New->Project From Existing Sources…，选中 `spring-framework` 源码文件夹，点击OK，选择 Import project from external model，选中 Gradle，点击 Next（各个版本不一样，我直接 Finsh）
6. 新建测试 Module

网上教程很多，推荐两个：

https://blog.csdn.net/bskfnvjtlyzmv867/article/details/81171802

https://www.cnblogs.com/zhangfengxian/p/11072500.html









