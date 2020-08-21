想读 Spring 源码，但是又不知道从哪里开始读，是先看 IOC 还是先看 AOP 呢，迷惑

Spring涵盖的东西太多了，如果不能进行针对性的阅读，很容易迷失。

程序员学语言，学框架都是从 Hello World 开始的，看源码为什么不也从 Hello World 开始呢？

```java
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
Object bean = context.getBean("JavaKeeper");
```

运行完这段代码后，问自己两个问题：

- **容器创建时做了什么？**
- **getBean()时又做了什么？**



![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200821140323.png)

然后，，，不要着急，不要着急，先去做点别的

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/Spring20200821140017.png)





