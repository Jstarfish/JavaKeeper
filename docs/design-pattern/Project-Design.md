### **设计实现一个支持各种算法的限流框架**

#### **需求分析**

- 易用性方面，我们希望限流规则的配置、编程接口的使用都很简单。我们希望提供各种不同的限流算法，比如基于内存的单机限流算法、基于 Redis 的分布式限流算法，能够让使用者自由选择。除此之外，因为大部分项目都是基于 Spring 开发的，我们还希望限流框架能否非常方便地集成到使用 Spring 框架的项目中。

- 扩展性、灵活性方面，我们希望能够灵活地扩展各种限流算法。同时，我们还希望支持不同格式（JSON、YAML、XML 等格式）、不同数据源（本地文件配置或 Zookeeper 集中配置等）的限流规则的配置方式。
- 性能方面，因为每个接口请求都要被检查是否限流，这或多或少会增加接口请求的响应时间。而对于响应时间比较敏感的接口服务来说，我们要让限流框架尽可能低延迟，尽可能减少对接口请求本身响应时间的影响
- 容错性方面，接入限流框架是为了提高系统的可用性、稳定性，不能因为限流框架的异常，反过来影响到服务本身的可用性。所以，限流框架要有高度的容错性。比如，分布式限流算法依赖集中存储器 Redis。如果 Redis 挂掉了，限流逻辑无法正常运行，这个时候业务接口也要能正常服务才行。

#### **设计**

**限流规则**

框架需要定义限流规则的语法格式，包括调用方、接口、限流阈值、时间粒度这几个元素。框架用户按照这个语法格式来配置限流规则。

```yaml
configs:
 - appId: app-1
 limits:
 - api: /v1/user
 limit: 100
 unit：60
 - api: /v1/order
 limit: 50
 - appId: app-2
 limits:
 - api: /v1/user
 limit: 50
 - api: /v1/order
 limit: 50
```

**限流算法**

常见的限流算法有：固定时间窗口限流算法、滑动时间窗口限流算法、令牌桶限流算法、漏桶限流算法。其中，固定时间窗口限流算法最简单。我们只需要选定一个起始时间起点，之后每来一个接口请求，我们都给计数器（记录当前时间窗口内的访问次数）加一，如果在当

前时间窗口内，根据限流规则（比如每秒钟最大允许 100 次接口请求），累加访问次数超过限流值（比如 100 次），就触发限流熔断，拒绝接口请求。当进入下一个时间窗口之后，计数器清零重新计数。

不过，固定时间窗口的限流算法的缺点也很明显。这种算法的限流策略过于粗略，无法应对两个时间窗口临界时间内的突发流量。

**限流模式**

我们把限流模式分为两种：单机限流和分布式限流。

所谓单机限流，就是针对单个实例的访问频率进行限制。注意这里的单机并不是真的一台物理机器，而是一个服务实例，因为有可能一台物理机器部署多个实例。所谓的分布式限流，就是针对某个服务的多个实例的总的访问频率进行限制。

**集成使用**

因为框架是需要集成到应用中使用的，我们希望框架尽可能低侵入，与业务代码松耦合，替换、删除起来也更容易些。