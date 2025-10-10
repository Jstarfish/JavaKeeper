---
title: 架构能力八股
date: 2024-12-19
tags: 
 - Java
 - SystemDesign
 - Architecture
 - Microservices
 - HighConcurrency
 - Distributed
 - Performance
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> 技术二面一般是展现**系统设计能力**和**架构思维**的关键环节，从**设计模式**到**分布式架构**，从**高并发处理**到**业务场景设计**，每一项技术都考验着工程师的**实战经验**和**技术深度**。本文档将**最常考的技术二面题目**整理成**标准话术**，涵盖系统设计、架构演进、问题排查等核心领域，助你在技术二面中脱颖而出！

---

## 🗺️ 知识导航

### 🏷️ 核心知识分类

1. **🏗️ 设计模式与架构**：可插拔规则引擎、责任链模式、事件驱动架构、单例模式、工厂模式
2. **🔧 项目实战与问题排查**：线上问题定位、性能调优、内存泄漏、死锁处理、故障恢复
3. **💼 业务场景与系统设计**：秒杀系统、系统扩容、大促准备、任务调度、实时风控、多租户SaaS、智能推荐、日志收集、异地多活
4. **⚡ 高并发系统设计**：50w QPS系统、电商大促、直播系统、社交APP、搜索引擎
5. **🌊 分布式系统设计**：短链系统、邮件系统、即时通讯、秒杀系统、配置中心
6. **🚀 性能优化与调优**：接口超时定位、CPU占用排查、死锁处理、第三方接口降级
7. **🏛️ 架构思维与技术治理**：技术选型、微服务治理、容错设计、技术债务管理、监控体系

### 🔑 面试话术模板

| **问题类型** | **回答框架**                        | **关键要点**       | **深入扩展**       |
| ------------ | ----------------------------------- | ------------------ | ------------------ |
| **系统设计** | 需求分析→架构设计→技术选型→性能优化 | 架构合理性，扩展性 | 技术细节，最佳实践 |
| **问题排查** | 现象确认→定位思路→解决方案→预防措施 | 系统性思维，工具使用 | 根因分析，经验总结 |
| **架构演进** | 现状分析→演进策略→实施计划→风险控制 | 技术决策，团队协作 | 技术债务，持续改进 |
| **业务场景** | 场景分析→技术挑战→解决方案→效果验证 | 业务理解，技术实现 | 性能优化，监控告警 |

---

## 🏗️ 一、设计模式与架构

> **核心思想**：设计模式是软件设计的经验总结，通过合理的模式选择可以提升代码的可维护性、可扩展性和复用性。

### 🎯 如何设计一个可插拔的规则引擎？

设计思路：

- 核心采用 **策略模式/链式责任/规则表达式**，把规则以模块形式组织，支持动态加载。
- 规则可以以脚本（Groovy、JS）、DSL、或预编译类的形式存储在数据库/配置中心，运行时装载并缓存。
- 附加功能：规则版本管理、回滚、规则测试环境、并行评估引擎、规则隔离（sandbox）以防注入风险。
- 性能优化：规则编译（避免每次解释）、缓存规则查询结果、对规则执行进行限时保护。
  工程化要点是"可观测、可回滚、可审计"。
  **考察点：** 模块化设计、可插拔实现细节与安全考虑。
  **常见追问：** 为什么用脚本而不是硬编码？（答：脚本允许业务方动态调整规则，减少发布成本）

### 🎯 如何用责任链模式设计订单审批流程？

可以把每个审批节点封装成一个处理器（Handler），Handler 实现统一接口并链式连接：每个 Handler 判断是否通过，若通过则传递给下一个 Handler，否则返回审批失败。优点是可动态插拔审批节点、可在运行时调整流程、易做权限与审核日志记录。注意异步审批/超时处理与补偿逻辑。
**考察点：** 设计模式在业务建模中的应用能力。
**常见追问：** 如何对审批节点做并行处理？（答：将并行节点拆成并发执行，最后做汇总决策）

### 🎯 如何把事件驱动架构（EDA）落地到大项目？

实践要点：

- 选择合适的消息中间件（Kafka/RabbitMQ），Kafka 常用于高吞吐与持久化场景。
- **事件建模**（确定事件粒度、Schema、版本化），使用 schema registry 管控兼容性。
- **幂等与消费侧安全**：消费者需设计幂等、去重与事务（Outbox pattern）。
- **监控与追踪**：链路追踪、消费延迟监控、消息堆积报警。
- **演化策略**：事件版本升级策略、灰度回放能力。
  初始先从业务边界清晰、耦合高的场景切入（如订单/库存），逐步演化。
  **考察点：** EDA 的实践性考虑（schema、幂等、监控、回放）。
  **常见追问：** 如何回溯历史事件？（答：需要消息持久化并提供重放机制）

### 🎯 单例模式在并发下如何正确实现？有坑么？

推荐做法：

- 最简单且安全的方式是使用 **枚举单例**（Java 的枚举天生避免反序列化、反射问题）。
- 另一常用方式是 **静态内部类**（懒加载且线程安全）。
- 可用 **双重检查锁** + `volatile` 实现延迟加载，注意 `volatile` 防止指令重排序。
  陷阱包括反射/序列化破坏单例、类加载器隔离导致单例多实例等。
  **考察点：** 并发下资源初始化与 Java 特性。
  **常见追问：** 为什么枚举单例最安全？（答：JVM 保证枚举只会被实例化一次，并防止反射创建新的实例）

### 🎯 工厂模式如何扩展第三方支付接入？

采用抽象工厂或策略模式：定义统一的支付接口（创建订单、签名、回调验证），每个第三方支付实现该接口并注册到工厂中；工厂根据配置或参数返回对应实现。好处是新增支付渠道只需实现接口并配置即可，降低耦合。再加上配置化加载、熔断和限流等治理逻辑，最终构成可扩展的支付接入平台。
**考察点：** 可扩展性、接口设计、注册/发现机制。
**常见追问：** 如何做支付幂等？（答：订单号+幂等表/唯一索引或幂等 key）

------

## 🔧 二、项目实战与问题排查

### 🎯 线上服务突然出现大量500错误，如何快速定位？

**应急响应流程**：快速止血 -> 定位根因 -> 修复问题 -> 复盘改进。

**立即行动**：

1. **确认影响范围**：
   - **监控大盘**：查看错误率、QPS、响应时间变化
   - **用户反馈**：客服渠道、社交媒体用户反馈情况
   - **业务影响**：核心功能是否受影响，影响用户量
   - **时间节点**：确认问题开始时间和发布时间关系

2. **快速止血措施**：
   - **流量切换**：将流量切换到正常的机房或集群
   - **服务降级**：关闭非核心功能，保证核心链路
   - **限流熔断**：启用限流和熔断机制保护系统
   - **回滚考虑**：如果是新发布导致，考虑快速回滚

**问题定位步骤**：

**第一层：应用层排查**

```bash
# 1. 查看应用日志
tail -f /var/log/app/error.log | grep ERROR

# 2. 检查JVM状态
jstat -gc -h10 <pid> 1s
jmap -heap <pid>

# 3. 线程堆栈分析
jstack <pid> > thread_dump.log
```

**第二层：系统资源排查**

```bash
# 1. 系统资源
top -p <pid>        # CPU和内存使用
iostat -x 1         # 磁盘IO
netstat -i          # 网络状况

# 2. 文件句柄
lsof -p <pid> | wc -l    # 打开文件数
ulimit -n                # 文件句柄限制
```

**第三层：依赖服务排查**

- **数据库**：慢查询日志、连接数、锁等待
- **缓存**：Redis连接数、命中率、内存使用
- **外部接口**：第三方API响应时间和错误率
- **消息队列**：队列积压、消费延迟

**常见问题及处理**：

**场景1：内存溢出（OOM）**

```
症状：500错误 + JVM重启 + GC频繁
排查：jmap -dump + MAT分析内存泄漏
处理：扩大堆内存 + 修复泄漏代码
```

**场景2：数据库连接池耗尽**

```
症状：连接超时异常 + DB连接数达到上限
排查：SHOW PROCESSLIST查看活跃连接
处理：扩大连接池 + 优化慢查询 + 连接泄漏修复
```

**场景3：外部依赖超时**

```
症状：接口超时 + 特定错误码
排查：调用链分析 + 外部服务状态确认
处理：增加超时时间 + 熔断降级 + 重试机制
```

**恢复验证**：

- **监控指标**：错误率恢复到正常水平
- **业务验证**：核心功能正常，用户反馈减少
- **性能验证**：响应时间、QPS恢复正常
- **持续观察**：24小时持续监控确保稳定

 **考察点：** 应急响应能力、问题定位思路、系统分析技能。
 **常见追问：** 如何预防类似问题？（答：监控完善+压测+灰度发布+故障演练）

### 🎯 系统内存使用率持续上升，怎么排查内存泄漏？

**内存泄漏特征**：内存使用持续增长、Full GC频繁但内存不下降、最终导致OOM。

**排查工具和方法**：

**第一步：监控分析**

```bash
# 1. JVM内存监控
jstat -gc -h10 <pid> 5s     # 观察GC情况
jstat -gccapacity <pid>     # 查看堆容量

# 2. 系统内存监控
ps aux | grep java          # 进程内存使用
free -h                     # 系统内存情况
```

**第二步：堆内存分析**

```bash
# 1. 生成堆转储
jmap -dump:live,format=b,file=heap.dump <pid>

# 2. 查看堆内存分布
jmap -histo <pid> | head -20

# 3. 强制GC观察
jmap -gc <pid>
```

**第三步：MAT分析堆转储**

- **Leak Suspects Report**：自动发现可能的内存泄漏
- **Dominator Tree**：查看占用内存最大的对象
- **Histogram**：按类统计对象数量和大小
- **OQL查询**：编写查询语句分析特定对象

**常见内存泄漏模式**：

**1. 集合类未清理**

```java
// 问题代码
private static Map<String, Object> cache = new HashMap<>();

public void addCache(String key, Object value) {
    cache.put(key, value);  // 只添加不清理
}

// 解决方案
private static Map<String, Object> cache = new ConcurrentHashMap<>();

@Scheduled(fixedRate = 300000)  // 5分钟清理一次
public void cleanExpiredCache() {
    cache.entrySet().removeIf(entry -> isExpired(entry));
}
```

**2. ThreadLocal未清理**

```java
// 问题代码
private static ThreadLocal<UserContext> userContext = new ThreadLocal<>();

// 解决方案
try {
    userContext.set(user);
    // 业务逻辑
} finally {
    userContext.remove();  // 必须清理
}
```

**3. 监听器未移除**

```java
// 问题代码：注册监听器但未移除
eventBus.register(listener);

// 解决方案：及时移除
@PreDestroy
public void cleanup() {
    eventBus.unregister(listener);
}
```

**4. 数据库连接泄漏**

```java
// 问题代码
Connection conn = dataSource.getConnection();
// 业务逻辑但没有关闭连接

// 解决方案
try (Connection conn = dataSource.getConnection()) {
    // 业务逻辑
} // 自动关闭连接
```

**非堆内存泄漏排查**：

**Metaspace泄漏**：

```bash
# 监控Metaspace使用
jstat -gc <pid>

# 查看类加载情况
jstat -class <pid>

# 分析类加载器
jcmd <pid> VM.classloader_stats
```

**直接内存泄漏**：

```bash
# 监控直接内存（NIO Buffer）
jcmd <pid> VM.classloader_stats

# 分析内存映射文件
lsof -p <pid> | grep deleted
```

**代码层面预防措施**：

```java
// 1. 使用弱引用缓存
private static Map<String, WeakReference<Object>> cache = 
    new ConcurrentHashMap<>();

// 2. 定时清理机制
@Scheduled(fixedRate = 60000)
public void cleanupCache() {
    cache.entrySet().removeIf(entry -> 
        entry.getValue().get() == null);
}

// 3. 大对象及时清理
try {
    List<BigObject> bigList = new ArrayList<>();
    // 处理逻辑
} finally {
    bigList.clear();  // 显式清理
    bigList = null;
}
```

**系统层面监控**：

- **内存使用趋势**：持续监控内存使用率
- **GC频率监控**：Full GC频率和耗时监控
- **告警机制**：内存使用率超过80%时告警
- **自动重启**：OOM时自动重启机制

 **考察点：** 内存管理知识、问题排查能力、代码质量意识。
 **常见追问：** 如何在生产环境安全地生成堆转储？（答：使用-dump:live减少影响，选择低峰期执行）

### 🎯 数据库查询突然变慢，如何快速优化？

**数据库性能问题排查流程**：监控确认 -> 定位慢查询 -> 分析执行计划 -> 优化实施 -> 效果验证。

**第一步：确认性能问题**

```sql
-- 1. 查看当前活跃连接
SHOW PROCESSLIST;

-- 2. 查看数据库状态
SHOW STATUS LIKE 'Threads%';
SHOW STATUS LIKE 'Questions';
SHOW STATUS LIKE 'Slow_queries';

-- 3. 查看锁等待情况
SELECT * FROM information_schema.INNODB_LOCKS;
SELECT * FROM information_schema.INNODB_LOCK_WAITS;
```

**第二步：定位慢查询**

```sql
-- 1. 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.1;  -- 0.1秒以上的查询

-- 2. 查看当前慢查询
SELECT * FROM information_schema.PROCESSLIST 
WHERE COMMAND != 'Sleep' AND TIME > 0.1;

-- 3. 分析慢查询日志
-- 使用mysqldumpslow分析日志文件
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

**第三步：分析执行计划**

```sql
-- 1. EXPLAIN分析
EXPLAIN SELECT * FROM orders 
WHERE user_id = 12345 AND order_date > '2024-01-01';

-- 2. 关注关键指标
-- type: ALL(全表扫描)最差，index > range > ref > const最好
-- key: 使用的索引
-- rows: 预估扫描行数
-- Extra: Using temporary、Using filesort等需要优化
```

**常见问题及优化策略**：

**场景1：缺少索引**

```sql
-- 问题查询
SELECT * FROM orders WHERE user_id = 12345 AND status = 'PAID';
-- EXPLAIN显示：type=ALL, rows=1000000

-- 解决方案：创建复合索引
CREATE INDEX idx_user_status ON orders(user_id, status);

-- 验证效果
EXPLAIN SELECT * FROM orders WHERE user_id = 12345 AND status = 'PAID';
-- 优化后：type=ref, rows=100
```

**场景2：索引失效**

```sql
-- 问题查询：函数导致索引失效
SELECT * FROM orders WHERE DATE(order_date) = '2024-01-01';

-- 解决方案：避免在索引列上使用函数
SELECT * FROM orders 
WHERE order_date >= '2024-01-01 00:00:00' 
AND order_date < '2024-01-02 00:00:00';
```

**场景3：锁等待问题**

```sql
-- 1. 查找锁等待
SELECT 
 r.trx_id waiting_trx_id,
 r.trx_mysql_thread_id waiting_thread,
 b.trx_id blocking_trx_id,
 b.trx_mysql_thread_id blocking_thread
FROM information_schema.innodb_lock_waits w
INNER JOIN information_schema.innodb_trx b ON b.trx_id = w.blocking_trx_id
INNER JOIN information_schema.innodb_trx r ON r.trx_id = w.requesting_trx_id;

-- 2. 分析死锁
SHOW ENGINE INNODB STATUS;
```

**第四步：实施优化**

**索引优化**：

```sql
-- 1. 创建合适的索引
CREATE INDEX idx_order_date ON orders(order_date);
CREATE INDEX idx_user_status_date ON orders(user_id, status, order_date);

-- 2. 删除冗余索引
DROP INDEX idx_redundant ON orders;

-- 3. 覆盖索引优化
CREATE INDEX idx_cover ON orders(user_id, order_date, status, amount);
```

**查询重写优化**：

```sql
-- 优化前：子查询
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE amount > 1000);

-- 优化后：JOIN
SELECT DISTINCT u.* FROM users u
INNER JOIN orders o ON u.id = o.user_id 
WHERE o.amount > 1000;

-- 优化前：LIMIT深度分页
SELECT * FROM orders ORDER BY id LIMIT 100000, 20;

-- 优化后：游标分页
SELECT * FROM orders WHERE id > 100000 ORDER BY id LIMIT 20;
```

**配置参数优化**：

```sql
-- 1. 缓冲池大小（推荐70-80%物理内存）
SET GLOBAL innodb_buffer_pool_size = 8G;

-- 2. 查询缓存
SET GLOBAL query_cache_size = 256M;
SET GLOBAL query_cache_type = 1;

-- 3. 连接数
SET GLOBAL max_connections = 1000;

-- 4. 临时表大小
SET GLOBAL tmp_table_size = 256M;
SET GLOBAL max_heap_table_size = 256M;
```

**第五步：效果验证**

```sql
-- 1. 再次EXPLAIN验证
EXPLAIN SELECT * FROM orders WHERE user_id = 12345;

-- 2. 性能对比
-- 优化前：执行时间 500ms
-- 优化后：执行时间 50ms

-- 3. 监控指标
SHOW STATUS LIKE 'Handler_read%';
SHOW STATUS LIKE 'Select%';
```

**应急处理措施**：

- **KILL慢查询**：KILL QUERY <thread_id>
- **增加连接数**：临时增加max_connections
- **读写分离**：将读请求路由到从库
- **缓存预热**：将热点数据加载到缓存

 **考察点：** 数据库优化能力、SQL调优技巧、性能分析思路。
 **常见追问：** 索引过多有什么问题？（答：影响写性能、占用存储空间、维护成本高）

------



## 💼 三、业务场景与系统设计

> **核心思想**：业务场景设计题考察工程师将技术能力应用到具体业务场景的能力，需要深入理解业务需求，设计出既满足业务要求又具备良好技术架构的解决方案。

### 🎯 从零设计一个秒杀系统（可直接面试话术）

**高层思路**：要兼顾高并发吞吐、低延迟、可用性、最终一致性与防刷。设计分为前端保护层、缓存层、异步队列与落库保证四个部分：

1. **入口限流/防刷**：在 CDN/网关层做全量限流、用户级限流、验证码或签名机制（避免机器人）。
2. **缓存预热**：在秒杀开始前把库存预热到 Redis，避免直接打 DB。
3. **原子扣减**：使用 Redis Lua 脚本做库存判断与预扣，返回 token 给用户。Lua 保证判断与扣减原子性。
4. **异步下单**：将下单请求放入 MQ，消费者异步落库并做最后库存确认与幂等处理（使用唯一索引或幂等表）。
5. **最终一致性**：定期对库存做校验/对账，出现差异做补偿。
6. **监控与回退**：监控队列长度、消费延迟、错误率，必要时快速降级或关闭秒杀。
   **关键保障**：Redis 原子操作避免大部分超卖，MQ 异步处理保证 DB 不被瞬时流量打垮，幂等设计保证消息重试安全。
   **实现细节与注意事项**：防刷、去重、用户限购、日志埋点、全链路追踪、回放与补偿。
   **考察点：** 从架构到细节的完整性以及对一致性/性能的权衡。

### 🎯 如何将系统从 1 万 TPS 扩展到 10 万 TPS？（面试话术）

扩容分层次：

- **无状态服务水平扩展**：保证服务无状态或把状态外置（Redis/DB），通过负载均衡扩容实例。
- **拆分瓶颈**：使用异步 MQ 解耦、增加分区与消费者并行度、把 CPU 密集型部分优化或下沉到批处理。
- **数据层分库分表**：水平拆分数据库与读写分离，热点表做缓存或 CQRS。
- **缓存与 CDN**：尽可能把读请求命中缓存，减少数据库压力。
- **连接池/网络优化**：减少同步阻塞、保持长连接并优化序列化（例如 Protobuf）。
- **垂直/水平分割业务**：拆分单体服务到微服务，按流量和业务分片扩容。
  关键是定位并解决系统瓶颈（CPU/IO/锁/GC/网络），并做好灰度、容量测试与回滚方案。
  **考察点：** 扩展策略与性能瓶颈识别能力。
  **常见追问：** 单点扩展中最容易忽视的问题？（答：数据库连接数、网络带宽与中间件并发限制）

### 🎯 双 11 类型大促前如何准备（面试话术）

主要工作：容量与容错准备、性能测试、依赖切换与降级策略、运维预案。具体：

- **压测与容量评估**：按预估流量做分层压测（全链路），找并修复瓶颈。
- **预热与缓存**：预先把热数据加载到缓存/CDN，避免冷启动。
- **配置开关与灰度**：支持快速关闭非关键功能，分步骤放量。
- **降级与熔断策略**：为非核心服务建立降级逻辑与回退数据。
- **演练故障**：演练 DB/Redis/消息队列故障切换、回滚流程与补偿机制。
- **监控与报警**：关键指标（QPS/RT/错误率/队列长度/DB slow）必须有实时告警与自动化处理脚本。
- **人力准备**：运维、SRE、后端保障团队待命并有明确责任分工。
  **考察点：** 大促级别运维、压测与应急机制的成熟度。

### 🎯 如何设计一个高可用的分布式日志收集系统？

常见架构：日志采集 -> Fluentd/Logstash -> Kafka（缓冲）-> 消费者（索引到 Elasticsearch/Hadoop）-> 可视化（Kibana）。关键设计点：

- **高可用收集**：采集层做本地缓冲和批量发送。
- **可靠缓冲**：Kafka 做持久化缓冲，避免短时峰值丢失。
- **索引与归档**：ES 用于快速检索，历史日志落到冷存储（HDFS）做归档。
- **结构化与规范**：统一日志格式（JSON + schema），便于解析与搜索。
- **管控 & 限流**：对日志流量做采样、限流以保护下游系统。
- **权限与审计**：管理访问控制和审计日志，保证安全合规。
  **考察点：** 可观测性与大数据流处理设计能力。

### 🎯 如何实现异地多活（Active-Active）系统？

异地多活需要解决数据同步、冲突解决、全局流量路由与延迟问题：

- **流量层**：采用全球负载均衡（DNS + Anycast + GSLB），根据用户地理/延迟路由到最近活跃数据中心。
- **数据同步**：采用异步双向复制（跨 DC），并设计冲突解决策略（CRDT、业务级冲突检测或基于时间戳的合并）。
- **一致性模型**：多数场景选择最终一致性，强一致场景需走中心化主写或 Paxos/Raft 跨域协议（复杂且性能差）。
- **回退与演练**：必须有故障切换与回滚机制，以及跨 DC 的演练。
- **监控 & 延迟容忍**：关注跨域延迟与队列积压，设计降级逻辑。
  异地多活适用于对可用性要求极高的业务，但实现复杂、运维成本高，要按成本收益评估。
  **考察点：** 分布式系统的深层次挑战与工程化能力。

### 🎯 设计一个分布式任务调度系统

**业务需求分析**：支持大规模定时任务调度、高可用、动态调整、监控告警。

**核心功能模块**：

1. **任务管理**：任务创建、编辑、删除、启停控制
2. **调度引擎**：定时触发、依赖调度、失败重试
3. **执行器管理**：多机器负载均衡、故障转移
4. **监控告警**：任务状态监控、失败告警、性能统计
5. **权限管理**：用户权限、操作审计

**系统架构设计**：

**分层架构**：

```
前端控制台 -> API网关 -> 调度中心 -> 执行器集群
                             ↓
                         数据存储层
```

**调度中心设计**：

```java
@Component
public class TaskScheduler {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ExecutorRegistry executorRegistry;

    @Scheduled(fixedRate = 1000) // 每秒扫描一次
    public void scanAndTriggerTasks() {
        List<Task> readyTasks = taskRepository.findReadyTasks(Instant.now());

        for (Task task : readyTasks) {
            try {
                // 选择执行器
                Executor executor = selectExecutor(task);

                // 分发任务
                TaskExecution execution = TaskExecution.builder()
                    .taskId(task.getId())
                    .executorId(executor.getId())
                    .triggerTime(Instant.now())
                    .status(ExecutionStatus.RUNNING)
                    .build();

                // 异步执行
                CompletableFuture.supplyAsync(() -> {
                    return executor.execute(task);
                }).whenComplete((result, ex) -> {
                    updateExecutionResult(execution, result, ex);
                });

            } catch (Exception e) {
                log.error("任务调度失败: {}", task.getId(), e);
                handleTaskFailure(task, e);
            }
        }
    }

    private Executor selectExecutor(Task task) {
        // 负载均衡策略：轮询、随机、最少活跃数
        List<Executor> availableExecutors = executorRegistry.getAvailableExecutors();
        return loadBalancer.select(availableExecutors, task);
    }
}
```

**执行器注册与心跳**：

```java
@Service
public class ExecutorRegistry {

    private final Map<String, ExecutorInfo> executors = new ConcurrentHashMap<>();

    public void registerExecutor(ExecutorInfo executor) {
        executors.put(executor.getId(), executor);
        log.info("执行器注册成功: {}", executor.getId());
    }

    @Scheduled(fixedRate = 10000) // 每10秒检查一次
    public void checkExecutorHealth() {
        Iterator<Map.Entry<String, ExecutorInfo>> iterator = executors.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry<String, ExecutorInfo> entry = iterator.next();
            ExecutorInfo executor = entry.getValue();

            // 检查心跳超时（超过30秒）
            if (Duration.between(executor.getLastHeartbeat(), Instant.now()).getSeconds() > 30) {
                iterator.remove();
                log.warn("执行器下线: {}", executor.getId());

                // 重新分配该执行器上的任务
                reassignTasks(executor.getId());
            }
        }
    }
}
```

**分布式锁防重复执行**：

```java
@Service
public class DistributedTaskLock {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public boolean tryLock(String taskId, String instanceId, long timeoutSeconds) {
        String lockKey = "task:lock:" + taskId;
        String lockValue = instanceId + ":" + System.currentTimeMillis();

        Boolean result = redisTemplate.opsForValue()
            .setIfAbsent(lockKey, lockValue, Duration.ofSeconds(timeoutSeconds));

        return Boolean.TRUE.equals(result);
    }

    public void releaseLock(String taskId, String instanceId) {
        String lockKey = "task:lock:" + taskId;
        String lockValue = instanceId + ":" + System.currentTimeMillis();

        String script = """
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end
            """;

        redisTemplate.execute(RedisScript.of(script, Long.class), 
            Collections.singletonList(lockKey), lockValue);
    }
}
```

**任务依赖调度**：

```java
@Service
public class TaskDependencyResolver {

    public boolean canExecute(Task task) {
        List<TaskDependency> dependencies = task.getDependencies();

        for (TaskDependency dependency : dependencies) {
            Task dependentTask = taskRepository.findById(dependency.getDependentTaskId());

            // 检查依赖任务是否在指定时间窗口内成功执行
            TaskExecution lastExecution = getLastExecution(dependentTask.getId());

            if (lastExecution == null || 
                lastExecution.getStatus() != ExecutionStatus.SUCCESS ||
                !isInTimeWindow(lastExecution, dependency.getTimeWindow())) {
                return false;
            }
        }

        return true;
    }

    private boolean isInTimeWindow(TaskExecution execution, TimeWindow window) {
        Instant executionTime = execution.getEndTime();
        Instant windowStart = window.getStartTime();
        Instant windowEnd = window.getEndTime();

        return executionTime.isAfter(windowStart) && executionTime.isBefore(windowEnd);
    }
}
```

**监控与告警**：

```java
@Component
public class TaskMonitor {

    @EventListener
    public void handleTaskFailure(TaskFailureEvent event) {
        Task task = event.getTask();

        // 更新失败计数
        task.incrementFailureCount();

        // 根据重试策略决定是否重试
        if (shouldRetry(task)) {
            scheduleRetry(task);
        } else {
            // 发送告警
            alertService.sendAlert(AlertType.TASK_FAILURE, 
                "任务执行失败: " + task.getName(), task);
        }
    }

    @Scheduled(fixedRate = 60000) // 每分钟统计一次
    public void collectMetrics() {
        TaskMetrics metrics = TaskMetrics.builder()
            .totalTasks(taskRepository.count())
            .runningTasks(getRunningTaskCount())
            .successRate(calculateSuccessRate())
            .avgExecutionTime(calculateAvgExecutionTime())
            .timestamp(Instant.now())
            .build();

        metricsRepository.save(metrics);
    }
}
```

 **考察点：** 分布式调度、高可用设计、负载均衡、监控告警。
 **常见追问：** 如何保证任务不丢失？（答：持久化存储+分布式锁+故障转移+补偿机制）

### 🎯 设计一个实时风控系统

**业务场景分析**：金融、电商等场景的实时风险识别与控制，毫秒级响应。

**核心挑战**：

1. **实时性要求**：毫秒级风险判断，不能影响用户体验
2. **规则复杂性**：多维度规则组合，动态调整策略
3. **高并发处理**：支持大规模并发风险评估
4. **准确性保证**：降低误判率，平衡安全与体验

**系统架构设计**：

**实时流处理架构**：

```
事件接入 -> 数据预处理 -> 规则引擎 -> 决策输出 -> 行动执行
    ↓           ↓          ↓        ↓        ↓
消息队列    特征提取    规则缓存   决策记录  风控措施
```

**规则引擎设计**：

```java
@Component
public class RiskRuleEngine {

    @Autowired
    private RuleRepository ruleRepository;

    @Autowired
    private FeatureService featureService;

    public RiskAssessmentResult evaluate(RiskEvent event) {
        // 1. 特征提取
        Map<String, Object> features = featureService.extractFeatures(event);

        // 2. 获取适用规则
        List<RiskRule> applicableRules = getApplicableRules(event.getScenario());

        // 3. 规则评估
        List<RuleResult> ruleResults = new ArrayList<>();
        int totalScore = 0;

        for (RiskRule rule : applicableRules) {
            RuleResult result = evaluateRule(rule, features);
            ruleResults.add(result);

            if (result.isTriggered()) {
                totalScore += rule.getScore();

                // 如果是阻断规则，直接返回
                if (rule.getAction() == RuleAction.BLOCK) {
                    return RiskAssessmentResult.blocked(rule.getId(), result.getReason());
                }
            }
        }

        // 4. 决策逻辑
        RiskLevel riskLevel = calculateRiskLevel(totalScore);
        RiskAction action = determineAction(riskLevel, event.getScenario());

        return RiskAssessmentResult.builder()
            .riskLevel(riskLevel)
            .action(action)
            .score(totalScore)
            .ruleResults(ruleResults)
            .evaluationTime(Instant.now())
            .build();
    }

    private RuleResult evaluateRule(RiskRule rule, Map<String, Object> features) {
        try {
            // 使用规则表达式引擎（如Aviator、MVEL）
            Boolean result = ruleEvaluator.evaluate(rule.getExpression(), features);

            return RuleResult.builder()
                .ruleId(rule.getId())
                .triggered(Boolean.TRUE.equals(result))
                .reason(rule.getDescription())
                .build();

        } catch (Exception e) {
            log.error("规则评估异常: {}", rule.getId(), e);
            return RuleResult.failed(rule.getId(), e.getMessage());
        }
    }
}
```

**特征工程服务**：

```java
@Service
public class FeatureService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public Map<String, Object> extractFeatures(RiskEvent event) {
        Map<String, Object> features = new HashMap<>();

        // 基础特征
        features.put("userId", event.getUserId());
        features.put("deviceId", event.getDeviceId());
        features.put("ip", event.getIpAddress());
        features.put("amount", event.getAmount());
        features.put("timestamp", event.getTimestamp());

        // 统计特征（近期行为统计）
        addStatisticalFeatures(features, event);

        // 设备指纹特征
        addDeviceFingerprintFeatures(features, event);

        // 地理位置特征
        addLocationFeatures(features, event);

        return features;
    }

    private void addStatisticalFeatures(Map<String, Object> features, RiskEvent event) {
        String userId = event.getUserId();
        String today = LocalDate.now().toString();

        // 今日交易次数
        String dailyCountKey = "user:" + userId + ":daily:" + today + ":count";
        Long dailyCount = redisTemplate.opsForValue().increment(dailyCountKey);
        redisTemplate.expire(dailyCountKey, Duration.ofDays(1));
        features.put("dailyTransactionCount", dailyCount);

        // 今日交易金额
        String dailyAmountKey = "user:" + userId + ":daily:" + today + ":amount";
        Double dailyAmount = redisTemplate.opsForValue()
            .increment(dailyAmountKey, event.getAmount().doubleValue());
        redisTemplate.expire(dailyAmountKey, Duration.ofDays(1));
        features.put("dailyTransactionAmount", dailyAmount);

        // 最近1小时交易次数
        String hourlyCountKey = "user:" + userId + ":hourly:" + 
            LocalDateTime.now().truncatedTo(ChronoUnit.HOURS) + ":count";
        Long hourlyCount = redisTemplate.opsForValue().increment(hourlyCountKey);
        redisTemplate.expire(hourlyCountKey, Duration.ofHours(1));
        features.put("hourlyTransactionCount", hourlyCount);
    }
}
```

**实时决策缓存**：

```java
@Service
public class RiskDecisionCache {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public void cacheDecision(String key, RiskAssessmentResult result) {
        String cacheKey = "risk:decision:" + key;
        String value = JsonUtils.toJson(result);

        // 缓存1小时
        redisTemplate.opsForValue().set(cacheKey, value, Duration.ofHours(1));
    }

    public RiskAssessmentResult getCachedDecision(String key) {
        String cacheKey = "risk:decision:" + key;
        String value = redisTemplate.opsForValue().get(cacheKey);

        if (value != null) {
            return JsonUtils.fromJson(value, RiskAssessmentResult.class);
        }

        return null;
    }

    // 生成缓存key，考虑用户、设备、金额等因素
    public String generateCacheKey(RiskEvent event) {
        return String.format("%s:%s:%s", 
            event.getUserId(),
            event.getDeviceId(),
            event.getScenario());
    }
}
```

**规则动态更新**：

```java
@Service
public class RuleManagementService {

    @Autowired
    private RuleRepository ruleRepository;

    @EventListener
    public void handleRuleUpdate(RuleUpdateEvent event) {
        RiskRule rule = event.getRule();

        // 更新本地缓存
        ruleCache.put(rule.getId(), rule);

        // 通知其他节点更新
        applicationEventPublisher.publishEvent(
            new RuleCacheRefreshEvent(rule.getId()));

        log.info("规则更新完成: {}", rule.getId());
    }

    @Async
    public void validateRuleEffectiveness(String ruleId) {
        // 分析规则效果
        RuleEffectivenessAnalysis analysis = analyzeRuleEffectiveness(ruleId);

        // 如果效果不佳，建议调整
        if (analysis.getFalsePositiveRate() > 0.1) {
            alertService.sendAlert("规则误判率过高", ruleId);
        }
    }
}
```

**性能监控**：

```java
@Component
public class RiskSystemMonitor {

    private final MeterRegistry meterRegistry;
    private final Counter evaluationCounter;
    private final Timer evaluationTimer;

    public RiskSystemMonitor(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.evaluationCounter = Counter.builder("risk.evaluation.count")
            .register(meterRegistry);
        this.evaluationTimer = Timer.builder("risk.evaluation.duration")
            .register(meterRegistry);
    }

    public void recordEvaluation(RiskAssessmentResult result, Duration duration) {
        evaluationCounter.increment(
            Tags.of(
                "action", result.getAction().name(),
                "risk_level", result.getRiskLevel().name()
            )
        );

        evaluationTimer.record(duration);

        // 如果评估时间过长，记录告警
        if (duration.toMillis() > 100) {
            log.warn("风控评估耗时过长: {}ms", duration.toMillis());
        }
    }
}
```

 **考察点：** 实时计算、规则引擎、特征工程、性能优化。
 **常见追问：** 如何平衡准确性和性能？（答：分层策略+缓存优化+异步处理+模型优化）

### 🎯 设计一个多租户SaaS系统

**业务需求分析**：支持多个企业客户独立使用，数据隔离、资源共享、灵活计费。

**核心挑战**：

1. **数据隔离**：确保租户间数据完全隔离
2. **资源共享**：在保证隔离的前提下最大化资源利用
3. **个性化定制**：支持租户个性化配置和扩展
4. **弹性扩展**：随租户增长动态扩容

**多租户架构模式**：

**1. 数据库隔离策略**

```java
@Configuration
public class MultiTenantConfig {

    // 租户路由策略
    @Bean
    public TenantResolver tenantResolver() {
        return new HeaderTenantResolver(); // 从HTTP头获取租户ID
    }

    // 数据源路由
    @Bean
    public DataSource dataSource() {
        MultiTenantDataSource dataSource = new MultiTenantDataSource();

        // 为每个租户配置独立数据源
        dataSource.setDefaultTargetDataSource(createDataSource("default"));

        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put("tenant1", createDataSource("tenant1"));
        targetDataSources.put("tenant2", createDataSource("tenant2"));
        dataSource.setTargetDataSources(targetDataSources);

        return dataSource;
    }
}

@Component
public class TenantContext {
    private static final ThreadLocal<String> TENANT_ID = new ThreadLocal<>();

    public static void setTenantId(String tenantId) {
        TENANT_ID.set(tenantId);
    }

    public static String getTenantId() {
        return TENANT_ID.get();
    }

    public static void clear() {
        TENANT_ID.remove();
    }
}
```

**2. 租户拦截器**

```java
@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) throws Exception {

        String tenantId = extractTenantId(request);

        if (tenantId == null) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.getWriter().write("Missing tenant identifier");
            return false;
        }

        // 验证租户有效性
        if (!tenantService.isValidTenant(tenantId)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("Invalid tenant");
            return false;
        }

        TenantContext.setTenantId(tenantId);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, 
                              HttpServletResponse response, 
                              Object handler, Exception ex) {
        TenantContext.clear();
    }

    private String extractTenantId(HttpServletRequest request) {
        // 多种方式获取租户ID
        String tenantId = request.getHeader("X-Tenant-ID");
        if (tenantId != null) return tenantId;

        // 从子域名获取
        String serverName = request.getServerName();
        if (serverName.contains(".")) {
            return serverName.split("\\.")[0];
        }

        // 从URL路径获取
        String path = request.getRequestURI();
        if (path.startsWith("/tenant/")) {
            return path.split("/")[2];
        }

        return null;
    }
}
```

**3. 动态配置管理**

```java
@Service
public class TenantConfigurationService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public <T> T getConfig(String tenantId, String configKey, Class<T> type) {
        String cacheKey = "tenant:config:" + tenantId + ":" + configKey;
        Object cached = redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            return type.cast(cached);
        }

        // 从数据库加载配置
        TenantConfiguration config = configRepository.findByTenantIdAndKey(tenantId, configKey);
        if (config != null) {
            T value = JsonUtils.fromJson(config.getValue(), type);
            // 缓存30分钟
            redisTemplate.opsForValue().set(cacheKey, value, Duration.ofMinutes(30));
            return value;
        }

        // 返回默认配置
        return getDefaultConfig(configKey, type);
    }

    public void updateConfig(String tenantId, String configKey, Object value) {
        // 更新数据库
        TenantConfiguration config = TenantConfiguration.builder()
            .tenantId(tenantId)
            .configKey(configKey)
            .value(JsonUtils.toJson(value))
            .updateTime(Instant.now())
            .build();
        configRepository.save(config);

        // 清除缓存
        String cacheKey = "tenant:config:" + tenantId + ":" + configKey;
        redisTemplate.delete(cacheKey);

        // 通知其他节点刷新缓存
        eventPublisher.publishEvent(new ConfigUpdateEvent(tenantId, configKey));
    }
}
```

**4. 资源隔离与限制**

```java
@Service
public class TenantResourceManager {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public boolean checkResourceLimit(String tenantId, ResourceType type, int requestAmount) {
        TenantPlan plan = tenantService.getTenantPlan(tenantId);
        ResourceLimit limit = plan.getResourceLimit(type);

        if (limit == null) {
            return true; // 无限制
        }

        String usageKey = "tenant:usage:" + tenantId + ":" + type.name();

        // 获取当前使用量
        String currentUsageStr = redisTemplate.opsForValue().get(usageKey);
        int currentUsage = currentUsageStr != null ? Integer.parseInt(currentUsageStr) : 0;

        // 检查是否超限
        if (currentUsage + requestAmount > limit.getMaxAmount()) {
            log.warn("租户资源超限: tenantId={}, type={}, current={}, limit={}", 
                tenantId, type, currentUsage, limit.getMaxAmount());
            return false;
        }

        // 更新使用量
        redisTemplate.opsForValue().increment(usageKey, requestAmount);
        redisTemplate.expire(usageKey, Duration.ofDays(1));

        return true;
    }

    @Scheduled(fixedRate = 3600000) // 每小时统计一次
    public void collectResourceUsage() {
        List<Tenant> tenants = tenantService.getAllActiveTenants();

        for (Tenant tenant : tenants) {
            TenantUsageStats stats = calculateUsageStats(tenant.getId());
            usageStatsRepository.save(stats);

            // 检查是否接近限制
            checkUsageAlerts(tenant, stats);
        }
    }
}
```

**5. 计费系统集成**

```java
@Service
public class TenantBillingService {

    public void recordUsage(String tenantId, UsageEvent event) {
        // 记录使用事件
        UsageRecord record = UsageRecord.builder()
            .tenantId(tenantId)
            .eventType(event.getType())
            .quantity(event.getQuantity())
            .timestamp(Instant.now())
            .metadata(event.getMetadata())
            .build();

        usageRecordRepository.save(record);

        // 实时计费
        if (isRealTimeBillingEnabled(tenantId)) {
            calculateAndApplyCharges(tenantId, record);
        }
    }

    @Scheduled(cron = "0 0 2 * * ?") // 每天凌晨2点执行
    public void dailyBilling() {
        List<Tenant> tenants = tenantService.getAllActiveTenants();

        for (Tenant tenant : tenants) {
            try {
                BillingResult result = calculateDailyBilling(tenant.getId());
                generateInvoice(tenant, result);

            } catch (Exception e) {
                log.error("租户计费失败: {}", tenant.getId(), e);
                alertService.sendAlert("计费失败", tenant.getId());
            }
        }
    }
}
```

 **考察点：** 多租户架构、数据隔离、资源管理、计费系统。
 **常见追问：** 如何处理租户数据迁移？（答：在线迁移+双写验证+灰度切换+回滚机制）

### 🎯 设计一个智能推荐系统

**业务场景分析**：为用户提供个性化内容推荐，提升用户体验和业务转化率。

**推荐系统核心架构**：

**1. 多路召回策略**

```java
@Service
public class RecommendationEngine {

 public List<RecommendationItem> recommend(String userId, int count) {
     // 协同过滤召回
     List<RecommendationItem> cfResults = 
         collaborativeFilteringService.recommend(userId, count * 2);

     // 内容相似召回
     List<RecommendationItem> cbResults = 
         contentBasedService.recommend(userId, count * 2);

     // 深度学习召回
     List<RecommendationItem> dlResults = 
         deepLearningService.recommend(userId, count * 2);

     // 热门内容召回
     List<RecommendationItem> popularResults = 
         popularContentService.getPopularItems(count);

     // 结果融合与重排序
     return mergeAndRerank(Arrays.asList(cfResults, cbResults, dlResults, popularResults));
 }
}
```

**2. 实时特征工程**

```java
@Service
public class FeatureEngineeringService {

 public UserFeatures extractUserFeatures(String userId) {
     UserFeatures features = new UserFeatures();

     // 基础画像特征
     UserProfile profile = userService.getUserProfile(userId);
     features.setDemographics(profile.getDemographics());

     // 实时行为特征
     features.setRecentClickCategories(getRecentClickCategories(userId));
     features.setSessionDuration(getCurrentSessionDuration(userId));
     features.setActiveTimeSlots(getActiveTimeSlots(userId));

     // 统计特征
     features.setAvgSessionDuration(calculateAvgSessionDuration(userId));
     features.setClickThroughRate(calculateCTR(userId));
     features.setConversionRate(calculateConversionRate(userId));

     return features;
 }
}
```

**3. 冷启动处理**

```java
@Service
public class ColdStartService {

 public List<RecommendationItem> handleNewUser(String userId) {
     UserProfile profile = userService.getUserProfile(userId);

     // 基于人口统计学特征推荐
     List<RecommendationItem> demographicRecommendations = 
         demographicBasedRecommender.recommend(profile);

     // 热门内容推荐
     List<RecommendationItem> popularRecommendations = 
         popularContentService.getPopularItems(20);

     // 探索性推荐（多样性）
     List<RecommendationItem> exploratoryRecommendations = 
         explorationService.getExploratoryItems(profile);

     return mergeWithDiversity(
         demographicRecommendations, 
         popularRecommendations, 
         exploratoryRecommendations);
 }
}
```

**4. A/B测试框架**

```java
@Service
public class RecommendationABTestService {

 public List<RecommendationItem> applyExperiment(String userId, 
                                               List<RecommendationItem> recommendations) {
     String experimentGroup = getExperimentGroup(userId);

     switch (experimentGroup) {
         case "control":
             return recommendations;
         case "diversity_boost":
             return enhanceDiversity(recommendations);
         case "popularity_boost":
             return boostPopularItems(recommendations);
         case "personalized_rerank":
             return personalizedRerank(userId, recommendations);
         default:
             return recommendations;
     }
 }

 @Scheduled(fixedRate = 3600000) // 每小时分析
 public void analyzeExperimentResults() {
     Map<String, ExperimentMetrics> results = calculateMetrics();

     for (Map.Entry<String, ExperimentMetrics> entry : results.entrySet()) {
         if (entry.getValue().isStatisticallySignificant()) {
             updateExperimentStrategy(entry.getKey(), entry.getValue());
         }
     }
 }
}
```

**考察点：** 推荐算法、特征工程、冷启动、A/B测试。
**常见追问：** 如何解决推荐系统的马太效应？（答：多样性控制+探索性推荐+长尾内容提升）

------



## ⚡ 四、高并发系统设计

> **核心思想**：高并发系统设计是技术面的重点，需要从架构设计、性能优化、容错处理等多个角度来保证系统在高并发场景下的稳定性和性能。

### 🎯 如何设计一个支持50w QPS的分布式系统？

**系统分析**：50w QPS意味着每秒处理50万次请求，这需要在架构、技术栈、存储、网络等多个层面进行优化。

**整体架构设计**：

1. **负载均衡层**：
   - **DNS负载均衡**：多地域部署，就近访问
   - **四层负载均衡**：LVS/HAProxy处理连接分发
   - **七层负载均衡**：Nginx/F5处理HTTP请求路由
   - **CDN**：静态资源缓存，减少源站压力

2. **网关层**：
   - **API网关集群**：Spring Cloud Gateway/Kong水平扩展
   - **限流熔断**：令牌桶、滑动窗口、熔断器保护
   - **请求路由**：按业务、版本、用户等维度路由
   - **协议优化**：HTTP/2、gRPC提升传输效率

3. **服务层**：
   - **微服务架构**：按业务域拆分，独立扩缩容
   - **无状态设计**：服务实例无状态，便于水平扩展
   - **异步处理**：非关键流程异步化，提升响应速度
   - **连接池**：数据库、Redis连接池复用

4. **存储层**：
   - **分库分表**：MySQL按业务、用户维度分片
   - **读写分离**：主库写入，从库读取
   - **多级缓存**：本地缓存 + Redis + CDN
   - **NoSQL**：MongoDB/Cassandra处理大数据量

**性能优化策略**：

**并发处理优化**：

```
计算模型：
单机QPS = 1000（经验值）
需要实例数 = 50w / 1000 = 500台
考虑冗余：500 * 1.5 = 750台
```

**缓存策略**：

- **多级缓存架构**：CDN(90%) -> Redis(9%) -> DB(1%)
- **热点数据预热**：定期将热点数据加载到缓存
- **缓存雪崩防护**：过期时间随机化、多副本
- **缓存更新策略**：写入数据库后异步更新缓存

**数据库优化**：

- **连接池配置**：单实例100-200连接，总计5w-10w连接
- **SQL优化**：索引优化、查询改写、预编译语句
- **分片策略**：按用户ID哈希分片，保证数据均匀
- **读写分离**：读操作分散到多个从库

**系统架构容量规划**：

| 层级   | 组件     | 实例数量 | 单实例QPS | 总QPS |
| ------ | -------- | -------- | --------- | ----- |
| 接入层 | Nginx    | 50台     | 20k       | 100w  |
| 网关层 | Gateway  | 100台    | 10k       | 100w  |
| 服务层 | 业务服务 | 500台    | 1k        | 50w   |
| 缓存层 | Redis    | 20台     | 50k       | 100w  |
| 数据层 | MySQL    | 50台     | 2k        | 10w   |

**监控与保障**：

- **实时监控**：QPS、RT、错误率、系统资源
- **自动扩缩容**：根据CPU、内存、QPS指标自动扩容
- **链路追踪**：分布式链路追踪，快速定位性能瓶颈
- **压力测试**：定期全链路压测，验证容量

 **考察点：** 高并发架构设计、容量规划、性能优化、监控体系。
 **常见追问：** 如何识别系统瓶颈？（答：监控+压测+性能分析工具定位）

### 🎯 电商大促时如何保证系统稳定性？

**大促特点**：流量瞬间暴增10-100倍、业务峰值集中、容错要求极高。

**稳定性保障体系**：

1. **容量准备**：
   - **流量预估**：基于历史数据和业务预期评估峰值流量
   - **压力测试**：全链路压测，找出性能瓶颈
   - **资源扩容**：提前3-5倍扩容关键资源
   - **基础设施**：CDN带宽、服务器、数据库等全面扩容

2. **架构优化**：
   - **静态化**：商品详情、活动页面全部静态化
   - **页面缓存**：首页、列表页等高访问页面缓存
   - **API优化**：接口合并、批量查询、异步处理
   - **资源隔离**：大促流量与日常流量物理隔离

3. **限流降级策略**：
   - **多级限流**：CDN限流、网关限流、服务限流
   - **业务降级**：非核心功能降级，优先保证下单支付
   - **熔断保护**：依赖服务异常时快速熔断
   - **排队机制**：超出处理能力时排队等待

**核心业务保护**：

**下单链路优化**：

```
优化前：同步调用多个服务，RT=500ms
优化后：异步化+缓存预热，RT=50ms

流程优化：
1. 库存预扣（Redis）-> 2ms
2. 订单入库（异步）-> 10ms  
3. 支付调用（异步）-> 20ms
4. 其他服务（异步）-> 并行处理
```

**支付链路保护**：

- **支付渠道**：多支付通道并行，故障自动切换
- **幂等性**：支付请求幂等处理，防止重复扣款
- **异步化**：支付结果异步通知，避免阻塞
- **补偿机制**：支付异常时自动补偿和对账

**数据库保护**：

- **读写分离**：读请求全部走从库和缓存
- **连接池**：严格控制数据库连接数
- **慢查询优化**：提前优化所有慢查询
- **分库分表**：热点表按用户维度分片

**缓存策略**：

- **多级缓存**：CDN + Redis集群 + 本地缓存
- **预热策略**：大促前预热所有热点数据
- **缓存隔离**：不同业务使用不同Redis集群
- **兜底策略**：缓存失效时的降级方案

**监控告警**：

- **实时大盘**：QPS、RT、错误率、库存等核心指标
- **分层监控**：CDN、网关、服务、数据库各层监控
- **智能告警**：基于历史数据的异常检测
- **自动恢复**：故障自动切换和恢复

**应急预案**：

- **限流开关**：流量过大时快速限流
- **降级开关**：一键降级非核心功能
- **回滚预案**：代码快速回滚机制
- **人员保障**：24小时值班和快速响应

 **考察点：** 大促架构设计、稳定性保障、应急处理、监控体系。
 **常见追问：** 如何评估大促容量？（答：历史数据+业务预期+安全系数）

### 🎯 如何设计一个支持百万并发的直播系统？

**直播系统特点**：实时性要求高、并发用户多、带宽消耗大、互动性强。

**整体架构设计**：

1. **推流端**：
   - **RTMP推流**：主播端使用RTMP协议推送视频流
   - **流媒体服务器**：Nginx-RTMP/SRS/Node Media Server接收流
   - **转码服务**：FFmpeg多码率转码，适配不同网络
   - **录制存储**：视频流录制到OSS，支持回放

2. **CDN分发**：
   - **边缘节点**：全球部署CDN节点，就近分发
   - **智能调度**：根据网络质量动态选择最优节点
   - **协议适配**：支持RTMP、HLS、HTTP-FLV多种协议
   - **带宽优化**：码率自适应、预加载优化

3. **播放端**：
   - **多协议支持**：Web端HLS、移动端RTMP
   - **播放器优化**：缓冲策略、断线重连、画质切换
   - **延迟优化**：WebRTC低延迟直播
   - **弱网优化**：网络自适应、画质降级

4. **互动系统**：
   - **弹幕系统**：WebSocket实时弹幕推送
   - **礼物系统**：异步处理礼物动画和扣费
   - **聊天室**：群聊消息分发和审核
   - **连麦系统**：WebRTC点对点连接

**高并发处理**：

**CDN架构设计**：

```
三级CDN架构：
源站 -> 中心节点 -> 边缘节点 -> 用户

并发能力：
- 单边缘节点：1万并发
- 需要节点数：100万 / 1万 = 100个节点
- 考虑冗余：100 * 1.5 = 150个节点
```

**流媒体服务器集群**：

- **负载均衡**：一致性哈希分配主播到不同服务器
- **热备切换**：主播流自动故障切换
- **状态同步**：服务器间流状态实时同步
- **弹性扩容**：根据在线人数自动扩容

**弹幕系统设计**：

- **WebSocket集群**：支持百万并发连接
- **消息分片**：按房间ID分片处理弹幕
- **限流控制**：用户发送频率限制
- **内容审核**：敏感词过滤、机器审核

**性能优化策略**：

**网络优化**：

- **预连接**：页面加载时预建立连接
- **多路复用**：HTTP/2多路复用减少连接数
- **压缩传输**：视频压缩、文本gzip压缩
- **P2P加速**：用户间P2P分享减少带宽

**存储优化**：

- **热点数据**：主播信息、房间状态缓存到Redis
- **视频存储**：多副本存储保证可靠性
- **CDN回源**：智能回源策略减少源站压力
- **数据分片**：按时间、房间维度分片存储

**实时性优化**：

- **端到端延迟**：< 3秒（HLS）、< 1秒（WebRTC）
- **关键帧优化**：GOP设置、IDR帧间隔优化
- **缓冲策略**：播放器缓冲区大小动态调整
- **网络自适应**：根据网络状况调整码率

**监控与运维**：

- **实时监控**：在线人数、带宽使用、推流质量
- **质量监控**：卡顿率、延迟、画质等QoE指标
- **告警机制**：推流中断、CDN异常自动告警
- **故障恢复**：自动切换备用节点和回源路径

 **考察点：** 流媒体架构、CDN设计、实时通信、高并发处理。
 **常见追问：** 如何降低直播延迟？（答：WebRTC+边缘计算+协议优化）

------



## 🌊 四、分布式系统设计

> **核心思想**：分布式系统设计需要解决数据一致性、服务可用性、网络分区等核心问题，通过合理的架构设计和技术选型来保证系统的稳定性和可扩展性。

### 🎯 设计一个短链系统（类似 bit.ly），如何处理千万级 QPS？

> 我会用 ID→Base62 可逆编码生成短码，读路径优先走 CDN 与 Redis 缓存（边缘缓存 302），确保绝大多数请求不回源。持久化用分库分表的 MySQL 或 NoSQL 存储映射与元数据；统计用 Kafka 异步上报并由 Flink 写入 ClickHouse 做实时/离线分析。为支持千万级 QPS，关键措施是：边缘缓存优先、Redis Cluster + 本地缓存、无状态跳转服务水平扩展、多机房部署及热点预热与限流。安全方面加速防刷、URL 白名单与钓鱼检测。短码生成采用 Snowflake + Base62，避免写前冲突，支持自定义短码时通过 DB 唯一索引处理冲突。

**需求分析**：短链生成、原链跳转、统计分析、高并发、高可用。

**核心架构设计**：

1. **短链生成服务**：
   - **编码算法**：Base62（a-z, A-Z, 0-9）生成6-8位短码，支持约568亿个URL
   - **ID生成**：使用分布式ID生成器（Snowflake）保证唯一性
   - **防冲突**：写入前检查唯一性，冲突时重新生成

2. **存储设计**：
   - **缓存层**：Redis集群存储热点短链（短码->原URL）
   - **持久化**：MySQL分库分表存储映射关系
   - **分片策略**：按短码hash分片，保证数据均匀分布

3. **高并发优化**：
   - **读写分离**：写入走主库，查询优先走缓存和从库
   - **多级缓存**：CDN + Redis + 本地缓存，99%请求命中缓存
   - **异步化**：统计数据异步写入，避免影响主链路

4. **扩展性设计**：
   - **水平扩展**：服务无状态，可根据流量动态扩容
   - **分库分表**：按业务或时间维度分片
   - **CDN加速**：静态资源和跳转页面CDN缓存

**完整架构流程**：

```
生成短链：客户端 -> 负载均衡 -> 短链服务 -> ID生成 -> 写DB&缓存 -> 返回短码
访问短链：用户 -> CDN -> 负载均衡 -> 查询服务 -> Redis -> DB -> 302跳转
```

**监控与容灾**：实时监控QPS、缓存命中率、DB性能，多机房部署保证高可用。
 **考察点：** 高并发架构设计、缓存策略、数据库设计、扩展性考虑。
 **常见追问：** 如何防止恶意刷短链？（答：限流+验证码+用户黑名单+URL白名单）



### 🎯 设计一个邮件系统，支持亿级用户发送邮件

**系统架构分层**：

1. **接入层**：
   - **API网关**：统一接入、鉴权、限流、熔断
   - **负载均衡**：按用户分片路由到不同服务集群
   - **协议支持**：SMTP、IMAP、POP3、HTTP API

2. **业务服务层**：
   - **邮件发送服务**：处理邮件发送逻辑、格式校验、附件处理
   - **邮件存储服务**：邮件内容存储、索引、检索
   - **用户管理服务**：账号体系、权限管理、配额控制
   - **通知服务**：实时推送、邮件到达通知

3. **数据存储层**：
   - **用户数据**：MySQL集群存储用户信息、联系人、配置
   - **邮件元数据**：分库分表存储邮件头信息、状态、关系
   - **邮件内容**：对象存储（S3/OSS）存储邮件正文和附件
   - **搜索引擎**：Elasticsearch提供全文检索

4. **消息队列**：
   - **发送队列**：Kafka处理海量邮件发送任务
   - **优先级队列**：重要邮件优先处理
   - **延迟队列**：定时发送功能

**核心技术挑战**：

**亿级用户存储**：

- **水平分片**：按用户ID哈希分库分表
- **冷热分离**：近期邮件放SSD，历史邮件放HDD
- **压缩存储**：邮件内容压缩，附件去重

**高并发处理**：

```
发送流程：用户请求 -> 参数校验 -> 反垃圾检测 -> 入队列 -> 异步发送 -> 状态回调
接收流程：SMTP接收 -> 病毒扫描 -> 反垃圾 -> 存储 -> 索引 -> 推送通知
```

**可靠性保证**：

- **多副本存储**：邮件数据多地域备份
- **消息可靠性**：队列持久化、重试机制、死信队列
- **监控告警**：发送成功率、延迟、存储容量监控

**安全防护**：

- **反垃圾邮件**：机器学习算法、黑名单、内容过滤
- **数据加密**：传输加密（TLS）、存储加密
- **权限控制**：细粒度权限、审计日志

 **考察点：** 大规模系统架构、数据分片、消息队列、安全设计。
 **常见追问：** 如何保证邮件不丢失？（答：多副本+事务+补偿机制+监控）

### 🎯 设计一个类似微信的即时通讯系统

**核心功能需求**：实时消息、群聊、在线状态、消息推送、文件传输。

**整体架构**：

1. **连接层（Gateway）**：
   - **长连接管理**：WebSocket/TCP维持用户连接
   - **负载均衡**：一致性哈希分配用户到Gateway节点
   - **心跳保活**：定期心跳检测连接状态
   - **连接状态同步**：Gateway间用户在线状态同步

2. **消息服务层**：
   - **消息路由服务**：查找接收方网关，转发消息
   - **群聊服务**：群成员管理、消息扇出
   - **离线消息服务**：用户离线时消息暂存
   - **推送服务**：APNs/FCM移动端推送

3. **存储层**：
   - **消息存储**：按会话分片存储到MySQL/Cassandra
   - **用户关系**：Redis存储好友关系、群成员关系
   - **文件存储**：OSS存储图片、语音、视频文件

**核心设计要点**：

**消息投递保证**：

```
发送流程：
客户端 -> Gateway -> 消息服务 -> 存储DB -> 查找接收方Gateway -> 推送接收方
确认机制：发送确认(sent) -> 投递确认(delivered) -> 已读确认(read)
```

**群聊优化**：

- **读扩散模式**：群消息存一份，用户读取时拉取
- **写扩散模式**：每个群成员都存一份消息副本
- **混合模式**：小群写扩散，大群读扩散

**高可用设计**：

- **Gateway集群**：多实例无状态部署，故障自动切换
- **数据多副本**：消息数据至少两副本存储
- **异地部署**：多机房部署，就近接入

**消息同步**：

- **增量同步**：基于消息序列号增量拉取
- **离线消息**：用户上线后批量推送未读消息
- **多端同步**：消息多端实时同步

**性能优化**：

- **消息预加载**：客户端预加载历史消息
- **压缩传输**：消息内容压缩传输
- **CDN加速**：图片、文件通过CDN分发

 **考察点：** 长连接管理、消息可靠性、分布式架构、性能优化。
 **常见追问：** 如何处理海量群聊消息？（答：分片存储+异步扇出+读写分离）

### 🎯 设计一个分布式配置中心（类似Apollo）

**核心功能**：配置管理、实时推送、权限控制、版本管理、灰度发布。

**系统架构设计**：

1. **配置管理层**：
   - **Portal服务**：Web管理界面，配置CRUD操作
   - **Admin服务**：配置管理核心服务，权限控制
   - **Config服务**：配置读取服务，面向客户端

2. **存储层**：
   - **元数据存储**：MySQL存储配置项、应用信息、权限
   - **配置存储**：支持多种存储后端（MySQL/Redis/ETCD）
   - **版本管理**：Git-like版本控制，支持回滚

3. **通知层**：
   - **消息队列**：配置变更事件队列
   - **长连接推送**：HTTP长轮询/WebSocket推送变更
   - **客户端SDK**：配置缓存、自动更新、降级处理

**核心技术实现**：

**配置推送机制**：

```
推送流程：
1. 管理员修改配置 -> Portal
2. 配置校验和持久化 -> Admin
3. 发布变更事件 -> MessageQueue
4. Config服务接收事件 -> 推送客户端
5. 客户端更新本地缓存 -> 应用生效
```

**客户端设计**：

- **本地缓存**：配置项本地缓存，启动时预加载
- **长轮询**：定期请求配置更新，有变更立即返回
- **降级策略**：网络异常时使用本地缓存配置
- **热更新**：配置变更自动刷新，无需重启应用

**高可用保证**：

- **集群部署**：Config服务集群，客户端多实例连接
- **数据备份**：配置数据多副本存储
- **故障切换**：客户端自动切换到其他Config实例
- **本地容灾**：客户端本地文件备份

**安全与权限**：

- **多环境隔离**：dev/test/prod环境严格隔离
- **权限控制**：基于角色的配置读写权限
- **审计日志**：所有配置变更全程审计
- **敏感信息加密**：密码等敏感配置加密存储

**管理功能**：

- **版本管理**：配置版本控制，支持比较和回滚
- **灰度发布**：配置变更灰度发布，降低影响面
- **批量操作**：支持配置的批量导入导出
- **实时监控**：配置推送成功率、客户端在线状态

 **考察点：** 分布式系统设计、实时通信、高可用架构、权限设计。
 **常见追问：** 如何保证配置推送的可靠性？（答：重试机制+本地缓存+多副本）



### 🎯 限流算法

限流算法是分布式系统中 “保护服务稳定性” 的核心手段，用于在流量超过服务承载能力时，通过 “合理丢弃 / 排队请求” 避免服务过载崩溃。

**常见限流算法（4 种核心）**

| 算法                           | 原理                                   | 优点               | 缺点                     |
| ------------------------------ | -------------------------------------- | ------------------ | ------------------------ |
| **固定窗口（Fixed Window）**   | 统计每个时间窗口内的请求数             | 实现简单           | 边界流量突刺问题         |
| **滑动窗口（Sliding Window）** | 将时间窗口细分成小格动态滑动           | 精度更高，平滑     | 实现稍复杂               |
| **令牌桶（Token Bucket）**     | 按固定速率生成令牌，请求需拿令牌才执行 | 支持突发流量，灵活 | 实现复杂，需定时补充令牌 |
| **漏桶（Leaky Bucket）**       | 请求流入桶中，按固定速率流出           | 控制输出速率稳定   | 不支持突发流量           |

------



## 🚀 五、性能优化与调优

> **核心思想**：性能优化是系统稳定运行的关键，需要从代码层面、架构层面、运维层面等多个维度进行优化，通过监控和调优来提升系统性能。

### 🎯 线上接口偶发超时，你如何定位？

标准排查流程：

1. 第一步，先明确超时的现象边界 —— 通过监控看是全接口还是某类接口、全机器还是某几台、随机时间还是高峰期，快速缩小排查范围；

2. **查看调用链**：用 APM/调用链（SkyWalking/Zipkin）定位是自己服务慢还是依赖慢。

3. **抓取线程快照**：`jstack` 看是否有线程阻塞、死锁或大量 GC。

   > **场景 1：自身服务慢**（如接口内耗时高）：
   >
   > - 抓线程快照：用 `jstack <pid> > stack.log` 多次抓取（间隔 5s，抓 3-5 次），分析是否有：
   >   - 大量线程处于 `BLOCKED` 状态（看 “waiting for monitor entry”，定位锁竞争，如全局锁、单例 Bean 的同步方法）；
   >   - 线程处于 `WAITING` 状态（看 “parking to wait for <0x...>”，定位线程池满、队列堆积，如核心线程数设置过小）；
   >   - 死锁：用 `jstack -l <pid>` 直接检测，若有死锁，输出会明确标注 “Found 1 deadlock.”，并显示锁依赖链。
   > - 查 GC 日志：用 `jstat -gcutil <pid> 1000 10` 看 GC 情况，是否有频繁 Full GC（导致 STW 时间过长，如内存泄漏、堆内存设置过小）。
   > - 查代码日志：看接口内是否有 “隐性耗时操作”，如大对象序列化、循环调用 DB、未关闭的流。

4. **查看 DB & 外部依赖**：检查慢 SQL、外呼超时。

5. **网络监控**：排查网络丢包/延迟，检查网关与 LB。

6. **回放/复现**：在预发布或压力环境复现问题并定位。

   归根结底是"先定位慢链路，再深挖具体问题"。定位后讲清楚恢复与后续预防措施（限流、监控、熔断）。
   **考察点：** 系统化问题定位能力与沟通恢复方案。
   **常见追问：** 遇到死锁怎么办？（答：抓取线程堆栈，找到锁依赖链并调整加锁顺序或加超时）

### 🎯 某服务 CPU 占 100%，如何排查？

1. **裸机/容器监控**：用 `top` 或容器监控看是哪个进程/线程。
2. **jstack**：抓取线程堆栈，看是否在某个热点方法或死循环。
3. **CPU profiler**（async-profiler）做采样分析，找出热点方法和系统调用。
4. **检查 GC**：高 CPU 也可能是 GC 消耗（查看 GC 日志）。
5. **业务回归**：判断是否近期部署变更引入性能回退，回滚验证。
   **考察点：** 性能分析工具的熟练度与快速定位能力。
   **常见追问：** async-profiler 用法简述？（答：采样模式低开销，能定位 Java 层热点和 JNI/syscall）

### 🎯 线上死锁如何处理？

做法：

1. 首先通过 **监控系统（如 Arthas、Prometheus、SkyWalking、Thread Dump）** 观察线程卡顿情况。

2. **抓取多次线程堆栈（jstack）** 确定死锁是否持续。

   ```
   jstack -l <pid> > dump.log
   ```

3. **分析锁持有者与等待者**，找到循环依赖链（jstack 会提示死锁信息）。

4. **临时恢复**：如果能快速确定单点锁可手工释放（慎用），或者重启受影响服务实例做短期恢复。

5. **根本修复**：统一加锁顺序、缩小锁粒度、使用 tryLock 超时处理或改为无锁算法。

6. **回顾与防范**：补充单元/集成测试模拟并发场景，避免再次发生。
   **考察点：** 从临时恢复到根本解决与防范的完整流程。
   **常见追问：** 如果无法重启怎么办？（答：尝试定位具体线程并做探测性 dump，若能释放锁再恢复；否则按 SLA 评估重启）



### 🎯 系统内存使用率持续上升，怎么排查内存泄漏？

**内存泄漏特征**：内存使用持续增长、Full GC频繁但内存不下降、最终导致OOM。

**排查工具和方法**：

**第一步：监控分析**

```bash
# 1. JVM内存监控
jstat -gc -h10 <pid> 5s     # 观察GC情况
jstat -gccapacity <pid>     # 查看堆容量

# 2. 系统内存监控
ps aux | grep java          # 进程内存使用
free -h                     # 系统内存情况
```

**第二步：堆内存分析**

```bash
# 1. 生成堆转储
jmap -dump:live,format=b,file=heap.dump <pid>

# 2. 查看堆内存分布
jmap -histo <pid> | head -20

# 3. 强制GC观察
jmap -gc <pid>
```

**第三步：MAT分析堆转储**

- **Leak Suspects Report**：自动发现可能的内存泄漏
- **Dominator Tree**：查看占用内存最大的对象
- **Histogram**：按类统计对象数量和大小
- **OQL查询**：编写查询语句分析特定对象

**常见内存泄漏模式**：

**1. 集合类未清理**

```java
// 问题代码
private static Map<String, Object> cache = new HashMap<>();

public void addCache(String key, Object value) {
    cache.put(key, value);  // 只添加不清理
}

// 解决方案
private static Map<String, Object> cache = new ConcurrentHashMap<>();

@Scheduled(fixedRate = 300000)  // 5分钟清理一次
public void cleanExpiredCache() {
    cache.entrySet().removeIf(entry -> isExpired(entry));
}
```

**2. ThreadLocal未清理**

```java
// 问题代码
private static ThreadLocal<UserContext> userContext = new ThreadLocal<>();

// 解决方案
try {
    userContext.set(user);
    // 业务逻辑
} finally {
    userContext.remove();  // 必须清理
}
```

 **考察点：** 内存管理知识、问题排查能力、代码质量意识。
 **常见追问：** 如何在生产环境安全地生成堆转储？（答：使用-dump:live减少影响，选择低峰期执行）



### 🎯 线上 OOM（OutOfMemoryError）怎么排查和解决？

我线上确实排查过 OOM 问题。一般表现为接口响应变慢、Full GC 频繁、监控报警内存飙升、甚至进程直接被 Killed（OOMKilled）。
 我通常分五步处理：**确认、定位、恢复、根因分析、防范优化**。

**排查与处理步骤**

**① 确认 OOM 类型**

首先看日志或报警信息，确定是哪类内存溢出。
 常见 OOM 类型有：

| 类型                                 | 原因               | 表现                            |
| ------------------------------------ | ------------------ | ------------------------------- |
| `Java heap space`                    | Java 堆内存不足    | Full GC频繁、堆dump可见大量对象 |
| `GC overhead limit exceeded`         | GC回收效果太差     | CPU飙高但内存回不去             |
| `Metaspace`                          | 类加载过多或未卸载 | 动态生成类、热加载、反射        |
| `Direct buffer memory`               | NIO直接内存泄漏    | Netty、大文件、ByteBuffer       |
| `unable to create new native thread` | 线程数超系统限制   | 线程池或无限创建线程            |
| `OutOfMemoryError: Map failed`       | 映射文件过多       | MappedByteBuffer泄漏            |

**② 定位堆内存泄漏原因**

**✅ 工具手段：**

- **jmap** 导出堆快照：

  ```
  jmap -dump:format=b,file=heap.bin <pid>
  ```

- **jstat** 查看 GC 情况：

  ```
  jstat -gcutil <pid> 1000 10
  ```

- **MAT / VisualVM / Arthas heapdump** 打开分析：

  - 查看 **大对象（Dominator Tree）**
  - 查找 **GC Roots 引用链**
  - 判断是否是**内存泄漏（Leak）** 还是 **内存占用高（非泄漏）**

**✅ 分析思路：**

- 哪个类实例数量异常？
- 哪些对象在 GC 后仍被引用？
- 是否存在静态集合缓存未清理？
- 是否有线程池、连接池、队列堆积？

**③ 短期恢复手段**

- **扩容/重启实例**（快速恢复服务）；

- 如果是容器环境，临时调高：

  ```
  -Xmx
  -XX:MaxMetaspaceSize
  ```

- 若是内存泄漏型问题 → 尽量导出堆后再重启；

- 监控确认重启后内存曲线恢复正常。

**④ 根因修复**

常见 OOM 根因及修复方向：

| 问题类别           | 根因                                       | 解决方案                                         |
| ------------------ | ------------------------------------------ | ------------------------------------------------ |
| 缓存泄漏           | Map 缓存未清理 / 本地缓存未过期            | 使用 `ConcurrentHashMap` + TTL 或 Caffeine/Guava |
| 集合不断增长       | 未清理的 `List` / `Map` / 队列             | 控制队列大小、定期清理                           |
| 线程泄漏           | `Executors.newCachedThreadPool()` 无界线程 | 改用 `ThreadPoolExecutor` + 有界队列             |
| 数据库/IO泄漏      | ResultSet/Stream 未关闭                    | 使用 try-with-resources 或连接池                 |
| ClassLoader泄漏    | 动态加载类未卸载（反射、热部署）           | 控制类加载器生命周期                             |
| 外部内存泄漏       | Netty、DirectBuffer 未释放                 | 调用 `release()`、开启内存监控                   |
| JSON/XML解析大对象 | 反序列化过大对象                           | 控制输入流大小、分页处理                         |

**⑤ 防范与监控**

| 措施         | 说明                                                   |
| ------------ | ------------------------------------------------------ |
| JVM 监控     | 使用 Prometheus + Grafana 监控堆、GC、线程             |
| 定期 dump    | 使用 Arthas / jcmd 自动定期 dump 栈快照                |
| 限制内存     | 合理配置 `-Xmx`, `-Xms`, `MaxMetaspaceSize`            |
| 使用弱引用   | 对缓存对象使用 `WeakReference` / `SoftReference`       |
| 压测提前发现 | JMeter / Gatling 模拟长时间高并发请求                  |
| GC 日志分析  | 打开 `-Xlog:gc*` 或 `-XX:+PrintGCDetails` 观测内存波动 |



### 🎯 数据库查询突然变慢，如何快速优化？

**数据库性能问题排查流程**：监控确认 -> 定位慢查询 -> 分析执行计划 -> 优化实施 -> 效果验证。

**第一步：确认性能问题**

```sql
-- 1. 查看当前活跃连接
SHOW PROCESSLIST;

-- 2. 查看数据库状态
SHOW STATUS LIKE 'Threads%';
SHOW STATUS LIKE 'Questions';
SHOW STATUS LIKE 'Slow_queries';

-- 3. 查看锁等待情况
SELECT * FROM information_schema.INNODB_LOCKS;
SELECT * FROM information_schema.INNODB_LOCK_WAITS;
```

**第二步：定位慢查询**

```sql
-- 1. 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.1;  -- 0.1秒以上的查询

-- 2. 查看当前慢查询
SELECT * FROM information_schema.PROCESSLIST 
WHERE COMMAND != 'Sleep' AND TIME > 0.1;

-- 3. 分析慢查询日志
-- 使用mysqldumpslow分析日志文件
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

**第三步：分析执行计划**

```sql
-- 1. EXPLAIN分析
EXPLAIN SELECT * FROM orders 
WHERE user_id = 12345 AND order_date > '2024-01-01';

-- 2. 关注关键指标
-- type: ALL(全表扫描)最差，index > range > ref > const最好
-- key: 使用的索引
-- rows: 预估扫描行数
-- Extra: Using temporary、Using filesort等需要优化
```

**常见问题及优化策略**：

**场景1：缺少索引**

```sql
-- 问题查询
SELECT * FROM orders WHERE user_id = 12345 AND status = 'PAID';
-- EXPLAIN显示：type=ALL, rows=1000000

-- 解决方案：创建复合索引
CREATE INDEX idx_user_status ON orders(user_id, status);

-- 验证效果
EXPLAIN SELECT * FROM orders WHERE user_id = 12345 AND status = 'PAID';
-- 优化后：type=ref, rows=100
```

**场景2：索引失效**

```sql
-- 问题查询：函数导致索引失效
SELECT * FROM orders WHERE DATE(order_date) = '2024-01-01';

-- 解决方案：避免在索引列上使用函数
SELECT * FROM orders 
WHERE order_date >= '2024-01-01 00:00:00' 
AND order_date < '2024-01-02 00:00:00';
```

**考察点：** 数据库优化能力、SQL调优技巧、性能分析思路。
**常见追问：** 索引过多有什么问题？（答：影响写性能、占用存储空间、维护成本高）



### 🎯 日志分析工具用了哪些？

在面试中被问到日志分析工具时，可以从以下几个方面进行回答：所用的工具、它们的主要功能、你是如何使用这些工具的，以及它们在你的项目中带来的具体好处。以下是一些常用的日志分析工具及其特点：

**常用日志分析工具**

1. **ELK Stack (Elasticsearch, Logstash, Kibana)**
   - **Elasticsearch**: 一个强大的搜索引擎，用于存储和查询日志数据。
   - **Logstash**: 一个数据处理管道工具，用于收集、解析和存储日志数据。
   - **Kibana**: 一个数据可视化工具，用于展示和分析 Elasticsearch 中的数据。
   - **使用场景**: 大量日志数据的集中管理和实时分析。
   - **个人经验**: 可以提到如何设置 Logstash 管道、创建 Kibana 仪表盘来监控特定的日志模式或异常。
2. **Graylog**
   - **特点**: 基于 Elasticsearch 的日志管理工具，具有强大的日志聚合、搜索和分析功能。
   - **使用场景**: 实时日志监控和警报。
   - **个人经验**: 可以提到如何配置 Graylog 采集日志、设置警报规则，以及如何利用 Graylog 的搜索功能进行故障排除。
3. **Splunk**
   - **特点**: 商业化的日志管理和分析工具，提供强大的搜索、监控和可视化功能。
   - **使用场景**: 复杂的企业级日志分析和安全监控。
   - **个人经验**: 可以提到如何利用 Splunk 进行实时日志分析、创建报告和仪表盘，以及如何使用 Splunk 的机器学习功能进行异常检测。
4. **Fluentd**
   - **特点**: 一个开源的数据收集器，用于统一日志数据。
   - **使用场景**: 日志数据的收集和转发。
   - **个人经验**: 可以提到如何配置 Fluentd 插件、收集和转发日志到不同的存储系统（如 Elasticsearch、MongoDB）。
5. **Loggly**
   - **特点**: 基于云的日志管理和分析服务，提供实时日志监控和警报。
   - **使用场景**: 云环境中的日志管理。
   - **个人经验**: 可以提到如何将应用日志发送到 Loggly、配置日志搜索和警报，以及利用 Loggly 的仪表盘进行日志可视化。
6. **Prometheus 和 Grafana**
   - **特点**: Prometheus 用于监控和告警，Grafana 用于数据可视化。虽然主要用于度量和监控，但也可以用于日志分析。
   - **使用场景**: 系统和应用的监控。
   - **个人经验**: 可以提到如何配置 Prometheus 采集日志指标、设置警报规则，以及如何利用 Grafana 创建可视化面板。

我们使用 ELK Stack 来集中管理和分析日志数据。通过 Logstash 我们收集来自不同服务的日志，并将其存储在 Elasticsearch 中，然后使用 Kibana 创建了多个仪表盘来监控系统的健康状况和性能

------



## 🏛️ 六、架构思维与技术治理

> **核心思想**：架构思维是高级工程师的核心能力，需要从技术选型、系统治理、团队协作等多个角度来推动技术架构的演进和优化。

### 🎯 如何评估和选择技术架构方案？

**架构评估维度框架**：

1. **功能性需求评估**
   - **业务支撑能力**：能否满足核心业务场景
   - **扩展性要求**：未来业务增长的支撑能力
   - **集成能力**：与现有系统的兼容性

2. **非功能性需求评估**
   - **性能指标**：QPS、RT、吞吐量是否满足预期
   - **可用性要求**：SLA指标、容灾恢复能力
   - **安全性标准**：数据保护、访问控制、审计能力

3. **技术可行性评估**
   - **团队技术栈匹配度**：学习成本和实施风险
   - **生态成熟度**：社区支持、文档完善度、第三方工具
   - **运维复杂度**：部署、监控、故障排查的便利性

**决策评估方法**：

```
技术架构评估表：
方案A  方案B  方案C
功能完整性    8    7    9
性能表现      7    9    6
开发效率      9    6    7
运维成本      6    8    9
技术风险      8    5    7
总分加权      7.6  7.0  7.6
```

**架构决策记录（ADR）**：

- **背景**：为什么需要做这个决策
- **决策**：具体选择了什么方案
- **理由**：选择的依据和权衡考虑
- **后果**：预期的影响和风险

 **考察点：** 架构思维、决策能力、风险评估。
 **常见追问：** 如何处理架构选型中的技术债务？（答：建立技术债务清单，定期评估和重构，平衡业务交付和技术质量）

### 🎯 大型系统的微服务治理策略？

**微服务治理体系**：

1. **服务拆分治理**
   - **领域驱动设计（DDD）**：按业务边界拆分，确保高内聚低耦合
   - **数据库独立**：每个服务独立数据库，避免数据耦合
   - **API设计规范**：RESTful API设计，版本管理策略

2. **服务间通信治理**
   - **同步调用**：HTTP/gRPC，适用于实时性要求高的场景
   - **异步消息**：MQ解耦，适用于最终一致性场景
   - **服务网格**：Istio/Linkerd统一管理服务间通信

3. **服务质量治理**
   - **限流熔断**：Hystrix/Sentinel保护服务稳定性
   - **超时控制**：合理设置调用超时时间
   - **重试策略**：指数退避算法，避免雪崩效应

**治理工具与平台**：

```
服务治理技术栈：
服务注册发现：Eureka/Consul/Nacos
配置中心：Apollo/Nacos
API网关：Zuul/Gateway/Kong
链路追踪：Zipkin/Jaeger/SkyWalking
监控告警：Prometheus+Grafana
日志聚合：ELK/EFK Stack
```

**微服务演进路径**：

- **第一阶段**：单体拆分，核心服务独立
- **第二阶段**：服务治理基础设施建设
- **第三阶段**：服务网格化，统一治理
- **第四阶段**：智能化运维，自动化治理

**治理成功指标**：

- **可用性提升**：单服务故障不影响整体系统
- **部署效率**：部署频率和部署成功率
- **故障恢复**：MTTR（平均恢复时间）指标
- **开发效率**：功能交付周期缩短

 **考察点：** 微服务架构设计、治理体系建设、技术选型能力。
 **常见追问：** 如何解决微服务的分布式事务问题？（答：Saga模式、TCC模式、最终一致性设计）

### 🎯 如何设计容错性强的分布式系统？

**容错设计原则**：

1. **故障隔离（Bulkhead Pattern）**
   - **资源隔离**：线程池、连接池独立配置
   - **服务隔离**：关键服务与非关键服务分离部署
   - **数据隔离**：核心数据与辅助数据分库存储

2. **快速失败（Fail Fast）**
   - **超时控制**：设置合理的调用超时时间
   - **健康检查**：定期检测依赖服务健康状态
   - **熔断机制**：Circuit Breaker模式自动断开故障服务

3. **优雅降级（Graceful Degradation）**
   - **功能降级**：非核心功能在故障时自动关闭
   - **性能降级**：降低响应精度，保证核心功能可用
   - **服务降级**：返回缓存数据或默认值

**容错实现策略**：

**多层次冗余设计**：

```
容错层次：
应用层：多实例部署、负载均衡
服务层：限流熔断、降级机制
数据层：主从复制、分片备份
基础设施：多机房部署、异地容灾
```

**故障恢复机制**：

- **自动重试**：指数退避算法，避免重试风暴
- **断路器**：半开状态探测，自动恢复服务调用
- **负载转移**：故障实例自动摘除，流量转移
- **数据补偿**：异步补偿机制，保证数据最终一致性

**监控与告警体系**：

```java
// 分布式系统健康监控
@Component
public class SystemHealthMonitor {

    @Autowired
    private List<HealthIndicator> healthIndicators;

    @Scheduled(fixedRate = 30000) // 30秒检查一次
    public void checkSystemHealth() {
        for (HealthIndicator indicator : healthIndicators) {
            Health health = indicator.health();
            if (health.getStatus() != Status.UP) {
                alertService.sendAlert("系统组件异常", 
                    indicator.getClass().getSimpleName());
            }
        }
    }
}
```

**容错测试与验证**：

- **混沌工程**：Chaos Monkey随机故障注入测试
- **故障演练**：定期进行故障切换演练
- **压力测试**：验证系统在高负载下的容错能力
- **恢复验证**：测试故障恢复的时间和完整性

 **考察点：** 分布式系统设计、容错机制、故障处理能力。
 **常见追问：** 如何平衡系统的性能和容错性？（答：通过合理的监控指标和自适应机制，动态调整容错策略）

### 🎯 如何进行技术债务管理和重构决策？

**技术债务识别与分类**：

1. **代码质量债务**
   - **代码异味**：重复代码、过长方法、复杂类结构
   - **设计缺陷**：紧耦合、缺乏抽象、违反设计原则
   - **测试缺失**：单元测试覆盖率低、缺少集成测试

2. **架构设计债务**
   - **技术选型**：过时的技术栈、不合适的框架选择
   - **架构腐化**：模块边界模糊、依赖关系复杂
   - **性能债务**：未优化的查询、缓存策略不当

3. **文档和知识债务**
   - **文档缺失**：API文档过时、设计文档不全
   - **知识孤岛**：关键知识集中在少数人手中
   - **运维债务**：部署复杂、监控不完善

**技术债务评估框架**：

```
债务评估矩阵：
          影响范围    修复成本    业务风险    优先级
核心模块    高         中         高         P0
边缘功能    低         低         低         P3
基础组件    高         高         中         P1
```

**重构决策原则**：

- **业务价值驱动**：优先重构影响业务的核心模块
- **风险可控**：分阶段重构，确保系统稳定性
- **投入产出比**：评估重构成本与收益
- **团队能力匹配**：考虑团队技术能力和时间投入

**重构实施策略**：

```java
// 渐进式重构示例：Strangler Fig模式
@Component
public class OrderService {

    @Autowired
    private LegacyOrderService legacyService;

    @Autowired
    private NewOrderService newService;

    @Value("${feature.new-order-service.enabled:false}")
    private boolean newServiceEnabled;

    public OrderResult createOrder(OrderRequest request) {
        if (newServiceEnabled && request.getUserId() % 10 == 0) {
            // 10%流量使用新服务
            return newService.createOrder(request);
        } else {
            // 90%流量使用旧服务
            return legacyService.createOrder(request);
        }
    }
}
```

**技术债务管理流程**：

1. **债务识别**：代码扫描工具（SonarQube）、人工Review
2. **影响评估**：业务影响、技术影响、团队效率影响
3. **优先级排序**：债务价值矩阵、ROI分析
4. **计划制定**：重构计划、时间安排、资源分配
5. **执行跟踪**：进度监控、质量验证、效果评估

 **考察点：** 技术管理能力、重构经验、风险控制意识。
 **常见追问：** 如何说服业务方投入时间做重构？（答：量化技术债务的业务影响，展示重构带来的长期价值）

### 🎯 如何设计系统的监控和可观测性架构？

**可观测性三大支柱**：

1. **Metrics（指标监控）**
   - **系统指标**：CPU、内存、磁盘、网络使用率
   - **应用指标**：QPS、响应时间、错误率、业务指标
   - **基础设施指标**：数据库连接数、消息队列积压、缓存命中率

2. **Logging（日志记录）**
   - **结构化日志**：JSON格式，便于解析和查询
   - **日志等级**：DEBUG、INFO、WARN、ERROR合理使用
   - **链路标识**：TraceId、SpanId关联分布式调用链路

3. **Tracing（链路追踪）**
   - **分布式追踪**：跨服务调用链路跟踪
   - **性能分析**：调用耗时、瓶颈定位
   - **依赖关系**：服务拓扑图、依赖分析

**监控架构设计**：

```
数据采集层：
- 应用探针：APM Agent、Prometheus Exporter
- 基础设施：Node Exporter、cAdvisor
- 日志采集：Fluentd、Logstash、Filebeat

数据存储层：
- 时序数据库：Prometheus、InfluxDB
- 日志存储：Elasticsearch、Loki
- 链路存储：Jaeger、Zipkin

分析展示层：
- 可视化：Grafana、Kibana
- 告警：AlertManager、PagerDuty
- 分析：Jupyter、数据分析平台
```

**监控指标设计**：

```yaml
# 关键业务指标
business_metrics:
  - name: "user_registration_rate"
    description: "用户注册成功率"
    query: "sum(rate(user_register_success[5m])) / sum(rate(user_register_total[5m]))"

  - name: "order_payment_latency"
    description: "订单支付延迟"
    query: "histogram_quantile(0.95, payment_duration_seconds)"

# 技术指标
technical_metrics:
  - name: "service_availability"
    description: "服务可用性"
    query: "up{job=\"my-service\"}"

  - name: "error_rate"
    description: "错误率"
    query: "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))"
```

**告警策略设计**：

```java
// 智能告警减少噪音
@Component
public class IntelligentAlerting {

    public boolean shouldAlert(MetricAlert alert) {
        // 1. 检查是否在维护窗口
        if (isInMaintenanceWindow()) {
            return false;
        }

        // 2. 检查历史模式，避免重复告警
        if (isRecentlyAlerted(alert.getMetricName(), Duration.ofMinutes(30))) {
            return false;
        }

        // 3. 关联性分析，避免告警风暴
        if (hasRelatedActiveAlerts(alert)) {
            return false;
        }

        // 4. 动态阈值调整
        double dynamicThreshold = calculateDynamicThreshold(alert.getMetricName());
        if (alert.getValue() < dynamicThreshold) {
            return false;
        }

        return true;
    }
}
```

**可观测性最佳实践**：

- **SLI/SLO设计**：定义服务等级指标和目标
- **错误预算**：基于SLO计算可接受的错误率
- **渐进式监控**：从基础监控到高级分析
- **自动化运维**：基于监控数据的自动处理

 **考察点：** 监控体系设计、运维自动化、系统稳定性保障。
 **常见追问：** 如何设计有效的告警策略？（答：分级告警+智能降噪+业务关联+自动处理）

------





