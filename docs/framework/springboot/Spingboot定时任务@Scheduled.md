#### 1.pom依赖：

引入springboot starter包即可

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
</dependencies>
```



#### 2.启动类启用定时任务：

在启动类上加注解：**@EnableScheduling**即可实现。

```java
@SpringBootApplication
@EnableScheduling
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

```



#### 3.创建定时任务实现类(单线程和多线程版本)：

##### 3.1 单线程定时任务：

```java
@Component
public class ScheduledTask {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
	// String形式的参数，可以从配置文件中加载，方便维护
    // @Scheduled(fixedDelayString = "${jobs.fixedDelay}")
    @Scheduled(fixedRate = 6000)
    public void getTask1() {
        System.out.println("定时任务1-----当前时间：" + dateFormat.format(new Date()));
    }

    @Scheduled(cron = "${jobs.cron}")
    public void getTask2() {
        System.out.println("定时任务2-----当前时间：" + dateFormat.format(new Date()));
    }
}
```

###### application.properties

```properties
jobs.fixedDelay=6000
jobs.cron=0/5 * *  * * ?
```

###### 运行结果：

```sh
2019-05-09 11:19:21.826  INFO 12868 --- [   scheduling-1] p.s.springbootlearn.ScheduledTask        : 任务1,从配置文件加载任务信息，当前时间：11:19:21
2019-05-09 11:19:25.001  INFO 12868 --- [   scheduling-1] p.s.springbootlearn.ScheduledTask        : 任务2,从配置文件加载任务信息，当前时间：11:19:25
2019-05-09 11:19:26.828  INFO 12868 --- [   scheduling-1] p.s.springbootlearn.ScheduledTask        : 任务1,从配置文件加载任务信息，当前时间：11:19:26
2019-05-09 11:19:30.001  INFO 12868 --- [   scheduling-1] p.s.springbootlearn.ScheduledTask        : 任务2,从配置文件加载任务信息，当前时间：11:19:30
```





##### 3.2 多线程定时任务：

###### 加一个多线程配置类，OK

```
@Configuration
public class ScheduleConfig implements SchedulingConfigurer {
    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {

        scheduledTaskRegistrar.setScheduler(Executors.newScheduledThreadPool(10));

    }
}
```



###### 结果如下：

可以看到开启了多个线程

```shell
2019-05-09 11:59:50.000  INFO 15140 --- [pool-1-thread-2] p.s.springbootlearn.ScheduledTask        : 任务2,从配置文件加载任务信息，当前时间：11:59:50
2019-05-09 11:59:54.294  INFO 15140 --- [pool-1-thread-1] p.s.springbootlearn.ScheduledTask        : 任务1,从配置文件加载任务信息，当前时间：11:59:54
2019-05-09 11:59:55.000  INFO 15140 --- [pool-1-thread-3] p.s.springbootlearn.ScheduledTask        : 任务2,从配置文件加载任务信息，当前时间：11:59:55
```



还可以基于注解**@EnableAsync**和**@Async**异步执行定时任务，也是多线程

```java
@Component
@EnableAsync
public class ScheduledTask {

    private final Log logger = LogFactory.getLog(this.getClass());

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    @Async
    @Scheduled(fixedDelayString = "${jobs.fixedDelay}")
    public void getTask1() {
        logger.info(Thread.currentThread().getName() + "===任务1,从配置文件加载任务信息，当前时间：" + dateFormat.format(new Date()));
    }

    @Async
    @Scheduled(cron = "${jobs.cron}")
    public void getTask2() {
        logger.info(Thread.currentThread().getName()+ "===任务2,从配置文件加载任务信息，当前时间：" + dateFormat.format(new Date()));
    }
}
```

或者增加配置类定义线程池的一些信息

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(destroyMethod = "shutdown")
    public ThreadPoolTaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        // 设置线程名前缀
        scheduler.setThreadNamePrefix("task-");
        // 线程内容执行完后60秒停在
        scheduler.setAwaitTerminationSeconds(60);
        // 等待所有线程执行完
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        return scheduler;
    }
}
```





#### 4.参数说明：

@Scheduled的代码

```java
public @interface Scheduled {
    String CRON_DISABLED = "-";
    String cron() default "";
    String zone() default "";
    long fixedDelay() default -1L;
    String fixedDelayString() default "";
    long fixedRate() default -1L;
    String fixedRateString() default "";
    long initialDelay() default -1L;
    String initialDelayString() default "";
}
```

   @Scheduled接受多种定时参数的设置（主要分为两类cornexpression和Rate/Delay表达式）：

​    （1）cron：cron表达式，指定任务在特定时间执行；

​    （2）fixedDelay：表示上一次任务执行完成后多久再次执行，参数类型为long，单位ms；

​    （3）fixedDelayString：与fixedDelay含义一样，只是参数类型变为String；

​    （4）fixedRate：表示按一定的频率执行任务，参数类型为long，单位ms；

​    （5）fixedRateString: 与fixedRate的含义一样，只是将参数类型变为String；

​    （6）initialDelay：表示延迟多久再第一次执行任务，参数类型为long，单位ms；

​    （7）initialDelayString：与initialDelay的含义一样，只是将参数类型变为String；

​    （8）zone：时区，默认为当前时区，一般没有用到。

​	

**☆☆☆☆☆** fixedRate和fixedDelay  的区别

- @Scheduled(fixedRate = 6000)：**上一次开始执行时间点后每隔6秒执行一次**。
- @Scheduled(fixedDelay = 6000)：**上一次执行完毕时间点之后6秒再执行**。
- @Scheduled(initialDelay=1000, fixedRate=6000)：**第一次延迟1秒后执行，之后按fixedRate的规则每6秒执行一次**。

　　　　　　

cornexpression表达式详解：

| 字段 | 允许值          | 允许特殊字符     |
| ---- | --------------- | ---------------- |
| 秒   | 0-59            | , - * /          |
| 分   | 0-59            | , - * /          |
| 小时 | 0-23            | , - * /          |
| 日   | 1-31            | , - * ? / L W C  |
| 月   | 1-12或JAN-DEC   | , - * /          |
| 周   | 1-7或SUN-SAT    | , - *  ? / L C # |
| 年   | 留空或1970-2099 | , - * /          |

　　　　　　　　　 　　　　　　　　　　　　　　　　 　

**cron一共有7位，但是最后一位是年，可以留空，所以我们可以写6位：**

**☆☆☆☆☆**

　　 *  表示所有值，在分钟里表示每一分钟触发。在小时，日期，月份等里面表示每一小时，每一日，每一月。

　　？ 表示不指定值。表示不关心当前位置设置的值。 比如不关心是周几，则周的位置填写？。　　主要是由于日期跟周是有重复的所以两者必须有一者设置为？

　　-  表示区间。小时设置为10-12表示10,11,12点均会触发。

　　， 表示多个值。 小时设置成10,12表示10点和12点会触发。

　　 /  表示递增触发。 5/15表示从第5秒开始，每隔15秒触发。

　　L  表示最后的意思。 日上表示最后一天。星期上表示星期六或7。 L前加数据，表示该数据的最后一个。

　　　　 星期上设置6L表示最后一个星期五。  6表示星期五

　　W 表示离指定日期最近的工作日触发。15W离该月15号最近的工作日触发。

　　#表示每月的第几个周几。 6#3表示该月的第三个周五。

 

　　示例：

  		"0 0 12 * * ?" 每天中午12点触发 

　　　　"0 15 10 ? * *" 每天上午10:15触发 

　　　　"0 15 10 * * ?" 每天上午10:15触发 

　　　　"0 15 10 * * ? *" 每天上午10:15触发 

　　　　"0 15 10 * * ? 2005" 2005年的每天上午10:15触发 

　　　　"0 * 14 * * ?" 在每天下午2点到下午2:59期间的每1分钟触发 

　　　　"0 0/5 14 * * ?" 在每天下午2点到下午2:55期间的每5分钟触发 

　　　　"0 0/5 14,18 * * ?" 在每天下午2点到2:55期间和下午6点到6:55期间的每5分钟触发 

　　　　"0 0-5 14 * * ?" 在每天下午2点到下午2:05期间的每1分钟触发 

　　　　"0 10,44 14 ? 3 WED" 每年三月的星期三的下午2:10和2:44触发 

　　　　"0 15 10 ? * MON-FRI" 周一至周五的上午10:15触发 

　　　　"0 15 10 15 * ?" 每月15日上午10:15触发 

　　　　"0 15 10 L * ?" 每月最后一日的上午10:15触发 

　　　　"0 15 10 ? * 6L" 每月的最后一个星期五上午10:15触发 

　　　　"0 15 10 ? * 6L 2002-2005" 2002年至2005年的每月的最后一个星期五上午10:15触发 

　　　　"0 15 10 ? * 6#3" 每月的第三个星期五上午10:15触发 

　　　　每天早上6点     0 6 * * *     每两个小时     0 */2 * * * 

　　　　晚上11点到早上8点之间每两个小时，早上八点    0 23-7/2，8 * * * 

　　　　每个月的4号和每个礼拜的礼拜一到礼拜三的早上11点     0 11 4 * 1-3 

　　　　1月1日早上4点     0 4 1 1 *





Reference ： https://blog.csdn.net/u013456370/article/details/79411952