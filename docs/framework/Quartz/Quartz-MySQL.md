# jobstore 数据库表结构

> 基于 Quartz 2.x  为版本的表结构和建表语句，1.x 和 2.x 的建表语句不同

| 序号 | 表名                     | 说明                                                         |
| ---- | ------------------------ | ------------------------------------------------------------ |
| 1    | qrtz_job_details         | 存储每一个已配置的 Job 的详细信息(jobDetail)                 |
| 2    | qrtz_triggers            | 存储已配置的触发器 (Trigger) 的信息                          |
| 3    | qrtz_simple_triggers     | 存储简单的 Trigger，包括重复次数，间隔，以及已触的次数       |
| 4    | qrtz_cron_triggers       | 存储 CronTrigger 的信息，包括 Cron 表达式和时区信息          |
| 5    | qrtz_simprop_triggers    | 存储 CalendarIntervalTrigger 和 DailyTimeIntervalTrigger 两种类型的触发器 |
| 6    | qrtz_blog_triggers       | 以 Blob 类型存储的Trigger (用于 Quartz 用户用 JDBC 创建他们自己定制的 Trigger 类型，JobStore 并不知道如何存储实例的时候) |
| 7    | qrtz_calendars           | 以 Blob 类型存储 Quartz 的 Calendar 信息                     |
| 8    | qrtz_paused_trigger_grps | 存储已暂停的触发器的信息                                     |
| 9    | qrtz_fired_triggers      | 记录每个正在执行的 Trigger，以及相联 Job 的执行信息          |
| 10   | qrtz_scheduler_state     | 记录调度器（每个机器节点）的生命状态                         |
| 11   | qrtz_locks               | 记录程序的悲观锁（防止多个节点同时执行同一个定时任务）       |

SQL  地址：[tables_mysql_innodb.sql](https://github.com/quartz-scheduler/quartz/blob/master/quartz-core/src/main/resources/org/quartz/impl/jdbcjobstore/tables_mysql_innodb.sql)



## qrtz_job_details

存储每一个已配置的 Job 的详细信息

```sql
CREATE TABLE `qrtz_job_details` (
  `SCHED_NAME` varchar(120) COLLATE utf8_bin NOT NULL COMMENT '调度器名,集群环境中使用,必须使用同一个名称——集群环境下”逻辑”相同的scheduler,默认为QuartzScheduler',
  `JOB_NAME` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '集群中job的名字',
  `JOB_GROUP` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '集群中job的所属组的名字',
  `DESCRIPTION` varchar(250) COLLATE utf8_bin DEFAULT NULL COMMENT '描述',
  `JOB_CLASS_NAME` varchar(250) COLLATE utf8_bin NOT NULL COMMENT '集群中个note job实现类的完全包名,quartz就是根据这个路径到classpath找到该job类',
  `IS_DURABLE` varchar(1) COLLATE utf8_bin NOT NULL COMMENT '是否持久化,把该属性设置为1，quartz会把job持久化到数据库中',
  `IS_NONCONCURRENT` varchar(1) COLLATE utf8_bin NOT NULL COMMENT '是否并行，该属性可以通过注解配置',
  `IS_UPDATE_DATA` varchar(1) COLLATE utf8_bin NOT NULL,
  `REQUESTS_RECOVERY` varchar(1) COLLATE utf8_bin NOT NULL COMMENT '当一个scheduler失败后，其他实例可以发现那些执行失败的Jobs，若是1，那么该Job会被其他实例重新执行，否则对应的Job只能释放等待下次触发',
  `JOB_DATA` blob COMMENT '一个blob字段，存放持久化job对象',
  PRIMARY KEY (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储每一个已配置的 Job 的详细信息';
```



## qrtz_triggers

存放配置的 Trigger 信息（一个Job可以被多个Trigger绑定，但是一个Trigger只能绑定一个Job）

```sql
CREATE TABLE `qrtz_triggers` (
  `SCHED_NAME` varchar(120) COLLATE utf8_bin NOT NULL COMMENT '调度器名，和配置文件org.quartz.scheduler.instanceName保持一致',
  `TRIGGER_NAME` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '触发器的名字',
  `TRIGGER_GROUP` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '触发器所属组的名字',
  `JOB_NAME` varchar(200) COLLATE utf8_bin NOT NULL COMMENT 'qrtz_job_details表job_name的外键',
  `JOB_GROUP` varchar(200) COLLATE utf8_bin NOT NULL COMMENT 'qrtz_job_details表job_group的外键',
  `DESCRIPTION` varchar(250) COLLATE utf8_bin DEFAULT NULL COMMENT '描述',
  `NEXT_FIRE_TIME` bigint(13) DEFAULT NULL COMMENT '下一次触发时间',
  `PREV_FIRE_TIME` bigint(13) DEFAULT NULL COMMENT '上一次触发时间',
  `PRIORITY` int(11) DEFAULT NULL COMMENT '线程优先级',
  `TRIGGER_STATE` varchar(16) COLLATE utf8_bin NOT NULL COMMENT '当前trigger状态，设置为ACQUIRED,如果设置为WAITING,则job不会触发',
  `TRIGGER_TYPE` varchar(8) COLLATE utf8_bin NOT NULL COMMENT '触发器类型',
  `START_TIME` bigint(13) NOT NULL COMMENT '开始时间',
  `END_TIME` bigint(13) DEFAULT NULL COMMENT '结束时间',
  `CALENDAR_NAME` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '日历名称',
  `MISFIRE_INSTR` smallint(2) DEFAULT NULL COMMENT 'misfire处理规则,1代表【以当前时间为触发频率立刻触发一次，然后按照Cron频率依次执行】,
   2代表【不触发立即执行,等待下次Cron触发频率到达时刻开始按照Cron频率依次执行�】,
   -1代表【以错过的第一个频率时间立刻开始执行,重做错过的所有频率周期后，当下一次触发频率发生时间大于当前时间后，再按照正常的Cron频率依次执行】',
  `JOB_DATA` blob COMMENT 'JOB存储对象',
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  KEY `SCHED_NAME` (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
  CONSTRAINT `qrtz_triggers_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `JOB_NAME`, `JOB_GROUP`) REFERENCES `qrtz_job_details` (`SCHED_NAME`, `JOB_NAME`, `JOB_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储已配置的 Trigger 的信息';
```



## qrtz_simple_triggers

存储简单的 trigger，包括重复次数，间隔，以及触发次数。

 **注意**：TIMES_TRIGGERED 用来记录执行了多少次了，此值被定义在 SimpleTriggerImpl 中，每次执行 +1，这里定义的REPEAT_COUNT=5，实际情况会执行 6 次。因为第一次是在 0 开始。

```sql
CREATE TABLE `qrtz_simple_triggers` (
  `SCHED_NAME` varchar(120) COLLATE utf8_bin NOT NULL COMMENT '调度器名，集群名',
  `TRIGGER_NAME` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '触发器名',
  `TRIGGER_GROUP` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '触发器组',
  `REPEAT_COUNT` bigint(7) NOT NULL COMMENT '重复次数',
  `REPEAT_INTERVAL` bigint(12) NOT NULL COMMENT '重复间隔',
  `TIMES_TRIGGERED` bigint(10) NOT NULL COMMENT '已触发次数',
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  CONSTRAINT `qrtz_simple_triggers_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `qrtz_triggers` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储简单的 Trigger，包括重复次数，间隔，以及已触的次数';
```



## qrtz_corn_triggers

存放 cron 类型的触发器

```sql
CREATE TABLE `qrtz_cron_triggers` (
  `SCHED_NAME` varchar(120) COLLATE utf8_bin NOT NULL COMMENT '集群名',
  `TRIGGER_NAME` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '调度器名,qrtz_triggers表trigger_name的外键',
  `TRIGGER_GROUP` varchar(200) COLLATE utf8_bin NOT NULL COMMENT 'qrtz_triggers表trigger_group的外键',
  `CRON_EXPRESSION` varchar(200) COLLATE utf8_bin NOT NULL COMMENT 'cron表达式',
  `TIME_ZONE_ID` varchar(80) COLLATE utf8_bin DEFAULT NULL COMMENT '时区ID',
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  CONSTRAINT `qrtz_cron_triggers_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `qrtz_triggers` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存放cron类型的触发器';
```



## qrtz_simprop_triggers

存储 `CalendarIntervalTrigger` 和 `DailyTimeIntervalTrigger` 两种类型的触发器，使用 `CalendarIntervalTrigger` 做如下配置：

`CalendarIntervalTrigger` 没有对应的 FactoryBean，直接设置实现类 `CalendarIntervalTriggerImpl`；指定的重复周期是 1，默认单位是天，也就是每天执行一次。

```sql
CREATE TABLE `qrtz_simprop_triggers` (
  `SCHED_NAME` varchar(120) COLLATE utf8_bin NOT NULL,
  `TRIGGER_NAME` varchar(200) COLLATE utf8_bin NOT NULL,
  `TRIGGER_GROUP` varchar(200) COLLATE utf8_bin NOT NULL,
  `STR_PROP_1` varchar(512) COLLATE utf8_bin DEFAULT NULL,
  `STR_PROP_2` varchar(512) COLLATE utf8_bin DEFAULT NULL,
  `STR_PROP_3` varchar(512) COLLATE utf8_bin DEFAULT NULL,
  `INT_PROP_1` int(11) DEFAULT NULL,
  `INT_PROP_2` int(11) DEFAULT NULL,
  `LONG_PROP_1` bigint(20) DEFAULT NULL,
  `LONG_PROP_2` bigint(20) DEFAULT NULL,
  `DEC_PROP_1` decimal(13,4) DEFAULT NULL,
  `DEC_PROP_2` decimal(13,4) DEFAULT NULL,
  `BOOL_PROP_1` varchar(1) COLLATE utf8_bin DEFAULT NULL,
  `BOOL_PROP_2` varchar(1) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  CONSTRAINT `qrtz_simprop_triggers_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `qrtz_triggers` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储CalendarIntervalTrigger和DailyTimeIntervalTrigger两种类型的触发器';
```



## qrtz_blob_triggers

自定义的 triggers 使用 blog 类型进行存储，非自定义的 triggers 不会存放在此表中，Quartz 提供的 triggers 包括：CronTrigger，CalendarIntervalTrigger，DailyTimeIntervalTrigger 以及 SimpleTrigger。

```sql
CREATE TABLE `qrtz_blob_triggers` (
  `SCHED_NAME` varchar(120) COLLATE utf8_bin NOT NULL,
  `TRIGGER_NAME` varchar(200) COLLATE utf8_bin NOT NULL,
  `TRIGGER_GROUP` varchar(200) COLLATE utf8_bin NOT NULL,
  `BLOB_DATA` blob,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  CONSTRAINT `qrtz_blob_triggers_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `qrtz_triggers` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
```



## qrtz_calendars

以 Blob 类型存储 Quartz 的 Calendar 信息

```sql
CREATE TABLE qrtz_calendars
(
  SCHED_NAME VARCHAR(120) NOT NULL,
  CALENDAR_NAME  VARCHAR(200) NOT NULL,
  CALENDAR BLOB NOT NULL,
  CONSTRAINT QRTZ_CALENDARS_PK PRIMARY KEY (SCHED_NAME,CALENDAR_NAME)
);
```



## qrtz_paused_trigger_grps

存储已暂停的 Trigger 组的信息

```sql
CREATE TABLE qrtz_paused_trigger_grps
(
  SCHED_NAME VARCHAR(120) NOT NULL,
  TRIGGER_GROUP  VARCHAR(200) NOT NULL,
  CONSTRAINT QRTZ_PAUSED_TRIG_GRPS_PK PRIMARY KEY (SCHED_NAME,TRIGGER_GROUP)
);
```



## qrtz_scheduler_state

存储所有节点的 scheduler，会定期检查 scheduler 是否失效

```sql
CREATE TABLE `qrtz_scheduler_state` (
  `SCHED_NAME` varchar(120) COLLATE utf8_bin NOT NULL COMMENT '调度器名称，集群名',
  `INSTANCE_NAME` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '集群中实例ID，配置文件中org.quartz.scheduler.instanceId的配置',
  `LAST_CHECKIN_TIME` bigint(13) NOT NULL COMMENT '上次检查时间',
  `CHECKIN_INTERVAL` bigint(13) NOT NULL COMMENT '检查时间间隔',
  PRIMARY KEY (`SCHED_NAME`,`INSTANCE_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='调度器状态';
```



## qrtz_fired_triggers

存储已经触发的 trigger 相关信息，trigger 随着时间的推移状态发生变化，直到最后 trigger 执行完成，从表中被删除

```sql
CREATE TABLE `qrtz_fired_triggers` (
  `SCHED_NAME` varchar(120) COLLATE utf8_bin NOT NULL COMMENT '调度器名称，集群名',
  `ENTRY_ID` varchar(95) COLLATE utf8_bin NOT NULL COMMENT '运行Id',
  `TRIGGER_NAME` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '触发器名',
  `TRIGGER_GROUP` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '触发器组',
  `INSTANCE_NAME` varchar(200) COLLATE utf8_bin NOT NULL COMMENT '集群中实例ID',
  `FIRED_TIME` bigint(13) NOT NULL COMMENT '触发时间',
  `SCHED_TIME` bigint(13) NOT NULL,
  `PRIORITY` int(11) NOT NULL COMMENT '线程优先级',
  `STATE` varchar(16) COLLATE utf8_bin NOT NULL COMMENT '状态',
  `JOB_NAME` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '任务名',
  `JOB_GROUP` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '任务组',
  `IS_NONCONCURRENT` varchar(1) COLLATE utf8_bin DEFAULT NULL COMMENT '是否并行',
  `REQUESTS_RECOVERY` varchar(1) COLLATE utf8_bin DEFAULT NULL COMMENT '是否恢复',
  PRIMARY KEY (`SCHED_NAME`,`ENTRY_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储与已触发的 Trigger 相关的状态信息，以及相联 Job 的执行信息';
```



## qrtz_locks

存储程序的悲观锁的信息(假如使用了悲观锁)

Quartz 提供的锁表，为多个节点调度提供分布式锁，实现分布式调度，默认有 2 个锁：

- STATE_ACCESS 主要用在 scheduler 定期检查是否有效的时候，保证只有一个节点去处理已经失效的 scheduler。
- TRIGGER_ACCESS 主要用在 TRIGGER 被调度的时候，保证只有一个节点去执行调度。

```SQL
CREATE TABLE qrtz_locks
(
  SCHED_NAME VARCHAR(120) NOT NULL,
  LOCK_NAME  VARCHAR(40) NOT NULL,
  CONSTRAINT QRTZ_LOCKS_PK PRIMARY KEY (SCHED_NAME,LOCK_NAME)
);
```