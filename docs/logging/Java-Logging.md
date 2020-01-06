## Java日志

日志就是记录程序的运行轨迹，方便查找关键信息，也方便快速定位解决问题。 



## Java常用框架

- **Jul** (Java Util Logging) : 自Java1.4以来，Java在Java.util中提供的一个内置框架，也常称为JDKLog、jdk-logging。
- **Log4j** : Apache Log4j是一个基于Java的日志记录工具。它是由Ceki Gülcü首创的，现在则是Apache软件基金会的一个项目。
- **Log4j 2** : Apache Log4j 2是apache开发的一款Log4j的升级产品，Log4j 2与Log4j 1发生了很大的变化，Log4j 2不兼容Log4j 1。
- **Logback**  : 一套日志组件的实现(Slf4j阵营)。
- **tinylog** : 一个轻量级的日志框架
- **Apache Commons Logging** : Apache基金会所属的项目，是一套Java日志接口，之前叫 Jakarta Commons Logging，后更名为Commons Logging。
- **Slf4j** : Simple Logging Facade for Java，类似于Commons Logging，是一套简易Java日志门面，本身并无日志的实现。（Simple Logging Facade for Java，缩写Slf4j）。



JUL、LOG4J1、LOG4J2、LOGBACK是**日志实现框架**，而Commons Logging和SLF4J是**日志实现门面**，可以理解为一个适配器，**可以将你的应用程序从日志框架中解耦**。

【强制】应用中不可直接使用日志系统（Log4j、Logback）中的 API，而应依赖使用日志框架 SLF4J 中的 API，使用门面模式的日志框架，有利于维护和各个类的日志处理方式统一。 import org.slf4j.Logger; import org.slf4j.LoggerFactory; private static final Logger logger = LoggerFactory.getLogger(Abc.class);  



## Java常用日志框架历史

- 1996年早期，欧洲安全电子市场项目组决定编写它自己的程序跟踪API(Tracing API)。经过不断的完善，这个API终于成为一个十分受欢迎的Java日志软件包，即Log4j。后来Log4j成为Apache基金会项目中的一员。

- 期间Log4j近乎成了Java社区的日志标准。据说Apache基金会还曾经建议Sun引入Log4j到java的标准库中，但Sun拒绝了。

- 2002年Java1.4发布，Sun推出了自己的日志库JUL(Java Util Logging),其实现基本模仿了Log4j的实现。在JUL出来以前，Log4j就已经成为一项成熟的技术，使得Log4j在选择上占据了一定的优势。

- 接着，Apache推出了Jakarta Commons Logging，JCL只是定义了一套日志接口(其内部也提供一个Simple Log的简单实现)，支持运行时动态加载日志组件的实现，也就是说，在你应用代码里，只需调用Commons Logging的接口，底层实现可以是Log4j，也可以是Java Util Logging。

- 后来(2006年)，Ceki Gülcü不适应Apache的工作方式，离开了Apache。然后先后创建了Slf4j(日志门面接口，类似于Commons Logging)和Logback(Slf4j的实现)两个项目，并回瑞典创建了QOS公司，QOS官网上是这样描述Logback的：The Generic，Reliable Fast&Flexible Logging Framework(一个通用，可靠，快速且灵活的日志框架)。

- 现今，Java日志领域被划分为两大阵营：Commons Logging阵营和Slf4j阵营。
  Commons Logging在Apache大树的笼罩下，有很大的用户基数。但有证据表明，形式正在发生变化。2013年底有人分析了GitHub上30000个项目，统计出了最流行的100个Libraries，可以看出Slf4j的发展趋势更好：

- Apache眼看有被Logback反超的势头，于2012-07重写了Log4j 1.x，成立了新的项目Log4j 2, Log4j 2具有Logback的所有特性。
  

  

![](http://cnblogpic.oss-cn-qingdao.aliyuncs.com/blogpic/java_log/java_populor_jar.png)

## java常用日志框架关系

- Log4j 2与Log4j 1发生了很大的变化，Log4j 2不兼容Log4j 1。
- Commons Logging和Slf4j是日志门面(门面模式是软件工程中常用的一种软件设计模式，也被称为正面模式、外观模式。它为子系统中的一组接口提供一个统一的高层接口，使得子系统更容易使用)。Log4j和Logback则是具体的日志实现方案。可以简单的理解为接口与接口的实现，调用者只需要关注接口而无需关注具体的实现，做到解耦。
- 比较常用的组合使用方式是Slf4j与Logback组合使用，Commons Logging与Log4j组合使用。
- Logback必须配合Slf4j使用。由于Logback和Slf4j是同一个作者，其兼容性不言而喻。



## Commons Logging与Slf4j实现机制对比

#### Commons Logging实现机制

> Commons Logging是通过动态查找机制，在程序运行时，使用自己的ClassLoader寻找和载入本地具体的实现。详细策略可以查看commons-logging-*.jar包中的org.apache.commons.logging.impl.LogFactoryImpl.java文件。由于Osgi不同的插件使用独立的ClassLoader，Osgi的这种机制保证了插件互相独立, 其机制限制了Commons Logging在Osgi中的正常使用。

#### Slf4j实现机制

> Slf4j在编译期间，静态绑定本地的Log库，因此可以在Osgi中正常使用。它是通过查找类路径下org.slf4j.impl.StaticLoggerBinder，然后在StaticLoggerBinder中进行绑定。



## 项目中选择日志框架选择

如果是在一个新的项目中建议使用Slf4j与Logback组合，这样有如下的几个优点。

- Slf4j实现机制决定Slf4j限制较少，使用范围更广。由于Slf4j在编译期间，静态绑定本地的LOG库使得通用性要比Commons Logging要好。
- Logback拥有更好的性能。Logback声称：某些关键操作，比如判定是否记录一条日志语句的操作，其性能得到了显著的提高。这个操作在Logback中需要3纳秒，而在Log4J中则需要30纳秒。LogBack创建记录器（logger）的速度也更快：13毫秒，而在Log4J中需要23毫秒。更重要的是，它获取已存在的记录器只需94纳秒，而Log4J需要2234纳秒，时间减少到了1/23。跟JUL相比的性能提高也是显著的。
- Commons Logging开销更高

```
# 在使Commons Logging时为了减少构建日志信息的开销，通常的做法是
if(log.isDebugEnabled()){
  log.debug("User name： " +
    user.getName() + " buy goods id ：" + good.getId());
}

# 在Slf4j阵营，你只需这么做：
log.debug("User name：{} ,buy goods id ：{}", user.getName(),good.getId());

# 也就是说，Slf4j把构建日志的开销放在了它确认需要显示这条日志之后，减少内存和Cup的开销，使用占位符号，代码也更为简洁
```

- Logback文档免费。Logback的所有文档是全面免费提供的，不象Log4J那样只提供部分免费文档而需要用户去购买付费文档。



## Java日志组件

[**Loggers**](http://www.loggly.com/ultimate-guide/logging/java-logging-basics/#loggers)**：**记录器，Logger 负责捕捉事件并将其发送给合适的 Appender。

[**Loggers**](http://www.loggly.com/ultimate-guide/logging/java-logging-basics/#loggers)**：**记录器，Logger 负责捕捉事件并将其发送给合适的 Appender。

[**Appenders**](http://www.loggly.com/ultimate-guide/logging/java-logging-basics/#appenders)**：**也被称为 Handlers，处理器，负责将日志事件记录到目标位置。在将日志事件输出之前， Appenders 使用Layouts来对事件进行格式化处理。

[**Layouts**](http://www.loggly.com/ultimate-guide/logging/java-logging-basics/#layouts)**：**也被称为 Formatters，格式化器，它负责对日志事件中的数据进行转换和格式化。Layouts 决定了数据在一条日志记录中的最终形式。

当 Logger 记录一个事件时，它将事件转发给适当的 Appender。然后 Appender 使用 Layout 来对日志记录进行格式化，并将其发送给控制台、文件或者其它目标位置。另外，Filters 可以让你进一步指定一个 Appender 是否可以应用在一条特定的日志记录上。在日志配置中，Filters 并不是必需的，但可以让你更灵活地控制日志消息的流动。

![]( https://logglyultimate.wpengine.com/wp-content/uploads/2015/09/Picture1-2.png )



## Java日志级别

不同的日志框架，级别也会有些差异

**log4j**  —— **OFF、FATAL、ERROR、WARN、INFO、DEBUG、TRACE、 ALL** 

**logback**  —— **OFF、ERROR、WARN、INFO、DEBUG、TRACE、 ALL** 

| 日志级别 | 描述                                               |
| -------- | -------------------------------------------------- |
| OFF      | 关闭：最高级别，不输出日志。                       |
| FATAL    | 致命：输出非常严重的可能会导致应用程序终止的错误。 |
| ERROR    | 错误：输出错误，但应用还能继续运行。               |
| WARN     | 警告：输出可能潜在的危险状况。                     |
| INFO     | 信息：输出应用运行过程的详细信息。                 |
| DEBUG    | 调试：输出更细致的对调试应用有用的信息。           |
| TRACE    | 跟踪：输出更细致的程序运行轨迹。                   |
| ALL      | 所有：输出所有级别信息。                           |



## SLF4J绑定日志框架

![](http://cnblogpic.oss-cn-qingdao.aliyuncs.com/blogpic/java_log/slf4j-bind.png)

![](http://www.slf4j.org/images/concrete-bindings.png)



## 阿里Java开发手册——日志规约 

1. 【强制】应用中不可直接使用日志系统（Log4j、Logback）中的 API，而应依赖使用日志框架 SLF4J 中的 API，使用门面模式的日志框架，有利于维护和各个类的日志处理方式统一。 

   ```java
   import org.slf4j.Logger; 
   import org.slf4j.LoggerFactory;
   
   private static final Logger logger = LoggerFactory.getLogger(Abc.class);  
   ```

2. 【强制】日志文件至少保存 15 天，因为有些异常具备以“周”为频次发生的特点。 

3. 【强制】应用中的扩展日志（如打点、临时监控、访问日志等）命名方式： appName_logType_logName.log。 logType:日志类型，如 stats/monitor/access 等；logName:日志描述。这种命名的好处： 通过文件名就可知道日志文件属于什么应用，什么类型，什么目的，也有利于归类查找。 正例：mppserver 应用中单独监控时区转换异常，如： mppserver_monitor_timeZoneConvert.log 说明：推荐对日志进行分类，如将错误日志和业务日志分开存放，便于开发人员查看，也便于 通过日志对系统进行及时监控。 

4. 【强制】对 trace/debug/info 级别的日志输出，必须使用条件输出形式或者使用占位符的方 式。 说明：logger.debug("Processing trade with id: " + id + " and symbol: " + symbol); 如果日志级别是 warn，上述日志不会打印，但是会执行字符串拼接操作，如果 symbol 是对象， 会执行 toString()方法，浪费了系统资源，执行了上述操作，最终日志却没有打印。 

   正例：（条件）建设采用如下方式 

   ```java
   if (logger.isDebugEnabled()) {
       logger.debug("Processing trade with id: " + id + " and symbol: " + symbol); 
   } 
   ```

   正例：（占位符）

   ```java
    logger.debug("Processing trade with id: {} and symbol : {} ", id, symbol); 
   ```

5. 【强制】避免重复打印日志，浪费磁盘空间，务必在 log4j.xml 中设置 additivity=false。 正例： 

6. 【强制】异常信息应该包括两类信息：案发现场信息和异常堆栈信息。如果不处理，那么通过 关键字 throws 往上抛出。 正例：logger.error(各类参数或者对象 toString() + "_" + e.getMessage(), e); 

7. 【推荐】谨慎地记录日志。生产环境禁止输出 debug 日志；有选择地输出 info 日志；如果使 用 warn 来记录刚上线时的业务行为信息，一定要注意日志输出量的问题，避免把服务器磁盘 撑爆，并记得及时删除这些观察日志。 说明：大量地输出无效日志，不利于系统性能提升，也不利于快速定位错误点。记录日志时请 思考：这些日志真的有人看吗？看到这条日志你能做什么？能不能给问题排查带来好处？ 

8. 【推荐】可以使用 warn 日志级别来记录用户输入参数错误的情况，避免用户投诉时，无所适 从。如非必要，请不要在此场景打出 error 级别，避免频繁报警。 说明：注意日志输出的级别，error 级别只记录系统逻辑出错、异常或者重要的错误信息。 

9. 【推荐】尽量用英文来描述日志错误信息，如果日志中的错误信息用英文描述不清楚的话使用 中文描述即可，否则容易产生歧义。国际化团队或海外部署的服务器由于字符集问题，【强制】 使用全英文来注释和描述日志错误信息。 



> [Ultimate Guide to Logging](https://www.loggly.com/ultimate-guide/java-logging-basics/#layouts)
>
> [《Java常用日志框架介绍》](https://www.cnblogs.com/chenhongliang/p/5312517.html)











