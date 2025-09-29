---
title: 资深工程师场景面试核心题库
date: 2024-05-31
tags: 
 - Java
 - Spring
 - 微服务
 - 分布式
 - 高并发
 - 场景题
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> Java资深工程师面试的核心在于**解决实际业务问题的能力**，从**高并发架构设计**到**分布式系统治理**，从**性能调优实战**到**线上故障处理**，每一个场景都考验着工程师的技术深度和业务理解。本文档将**最常考的Java场景题**整理成**标准话术**，涵盖并发编程、Spring生态、微服务架构、分布式事务、性能优化等核心场景，助你在面试中展现资深工程师的技术实力！

---

## 🗺️ 知识导航

### 🏷️ 核心场景分类

1. **🚀 高并发场景**：线程池设计、锁优化、缓存架构、限流降级
2. **🌐 分布式系统**：微服务治理、服务发现、配置中心、链路追踪
3. **💾 数据一致性**：分布式事务、CAP理论、最终一致性、幂等设计
4. **⚡ 性能优化**：JVM调优、SQL优化、接口优化、内存泄漏排查
5. **🛡️ 系统稳定性**：监控告警、故障恢复、容灾设计、压测方案
6. **🏗️ 架构设计**：系统拆分、领域建模、技术选型、演进策略
7. **🎯 经典系统设计**：短链系统、IM聊天、搜索引擎、推荐系统
8. **💼 线上问题**：故障定位、应急处理、根因分析、预防措施

### 🔑 面试话术模板

| **问题类型** | **回答框架**                        | **关键要点**       | **深入扩展**       |
| ------------ | ----------------------------------- | ------------------ | ------------------ |
| **场景设计** | 业务背景→技术方案→架构设计→落地实践 | 突出业务理解       | 技术深度，方案对比 |
| **问题排查** | 现象描述→分析思路→定位过程→解决方案 | 系统化排查方法     | 工具使用，预防措施 |
| **技术选型** | 需求分析→方案对比→选择依据→风险评估 | 多维度对比分析     | 实际踩坑，经验总结 |
| **优化实践** | 问题背景→性能瓶颈→优化方案→效果验证 | 量化优化效果       | 监控体系，持续改进 |

---

## 🚀 一、高并发场景设计

> **核心思想**：高并发场景是Java后端的核心考点，考察的是在大流量、高并发环境下如何保证系统的稳定性和性能。

### 🎯 如何设计一个秒杀系统？

**业务背景**：
双11大促，iPhone限量1000台，预计有100万用户同时抢购，要求系统稳定、库存准确、用户体验良好。

**核心挑战**：
- **高并发冲击**：瞬时100万QPS
- **库存超卖**：1000台商品不能卖出1001台  
- **系统可用性**：不能因为一个商品影响整个系统

**设计思路**：

**1. 架构分层**
```
用户 → CDN → 网关 → 应用 → 缓存 → 数据库
    流量分散   限流   业务处理  热点数据   持久化
```

**2. 核心策略**

**流量控制层**：
- **前端限流**：按钮置灰、验证码、排队页面
- **网关限流**：令牌桶算法，QPS限制在10万
- **应用限流**：Sentinel规则，熔断降级

**缓存预热层**：
- **商品信息**：提前加载到Redis，设置永不过期
- **库存预热**：Redis中维护实时库存数量
- **用户信息**：登录用户信息缓存1小时

**库存扣减层**：
- **Redis原子扣减**：使用Lua脚本保证原子性
- **数据库兜底**：异步同步最终库存到MySQL
- **超卖防护**：多重校验，宁可少卖不能超卖

**异步处理层**：
- **削峰填谷**：MQ异步处理订单创建
- **最终一致性**：订单状态最终与库存状态一致

**3. 关键技术点**

**分布式锁**：
- 防止并发扣减库存
- Redis+Lua脚本实现
- 设置合理的锁超时时间

**幂等设计**：
- 用户重复点击防护
- 接口幂等性保证
- 订单重复创建检查

**降级策略**：
- **L1降级**：关闭推荐、广告等非核心功能
- **L2降级**：返回静态页面，提示系统繁忙
- **L3降级**：暂停秒杀活动，保护核心系统

**4. 容量规划**

**QPS估算**：
- 100万用户，假设10%真正下单 = 10万QPS
- 考虑瞬时峰值，按5倍预估 = 50万QPS
- 系统设计按100万QPS保证安全边界

**存储估算**：
- 用户并发连接：100万 × 10KB = 10GB内存
- 商品信息缓存：1000条 × 1KB = 1MB  
- 订单临时存储：10万条 × 0.5KB = 50MB

**5. 监控告警**

**实时监控**：
- QPS、响应时间、错误率
- 库存余量、下单成功率
- 系统资源：CPU、内存、网络

**异常告警**：
- 库存异常变化（突然归零或增加）
- 响应时间超过阈值（>1秒）
- 错误率超过阈值（>1%）

**6. 风险应对**

**技术风险**：
- **缓存击穿**：热点商品缓存失效，使用分布式锁
- **系统雪崩**：限流熔断，快速失败  
- **数据一致性**：最终一致性，补偿机制

**业务风险**：
- **黄牛刷单**：实名认证、行为分析、风控规则
- **恶意攻击**：IP限制、验证码、黑名单
- **舆情风险**：客服预案、退款流程、公关应对

**核心原则**：
1. **宁可慢，不可错** - 确保数据准确性
2. **快速失败** - 减少系统负载  
3. **多层防护** - 不依赖单一技术手段
4. **可观测性** - 实时监控，快速定位问题

### 🎯 如何设计一个支持千万级用户的秒杀系统？

**业务背景**：
双11大促，商品限量1000件，预计有1000万用户同时抢购，要求系统能够承受高并发请求，确保库存准确性，用户体验良好。

**架构设计思路**：

**1. 流量削峰**
```java
@Service
public class SeckillService {
    public Result seckill(Long userId, Long productId) {
        // 1. 限流检查 - 令牌桶算法
        if (!rateLimiter.tryAcquire()) {
            return Result.fail("系统繁忙，请稍后重试");
        }
        
        // 2. Redis预扣库存 - 原子操作
        Long stock = redisTemplate.opsForValue().decrement("stock:" + productId);
        if (stock < 0) {
            redisTemplate.opsForValue().increment("stock:" + productId);
            return Result.fail("商品已售完");
        }
        
        // 3. 异步下单 - 削峰填谷
        orderProducer.sendOrder(userId, productId);
        return Result.success("排队中");
    }
}
```

**2. 缓存架构设计**
```java
@Component
public class SeckillCacheManager {
    // L1本地缓存 + L2Redis + L3数据库
    public Object getProductInfo(Long productId) {
        String key = "product:" + productId;
        
        // 本地缓存 -> Redis -> 数据库
        Object result = localCache.getIfPresent(key);
        if (result != null) return result;
        
        result = redisTemplate.opsForValue().get(key);
        if (result != null) {
            localCache.put(key, result);
            return result;
        }
        
        // 分布式锁防缓存击穿
        try (RedisLock lock = redisLockUtil.getLock("lock:" + key)) {
            if (lock.tryLock()) {
                result = productService.getById(productId);
                redisTemplate.opsForValue().set(key, result, 300, TimeUnit.SECONDS);
                localCache.put(key, result);
            }
        }
        return result;
    }
}
```

**3. 库存扣减方案**
```java
@Service
public class StockService {
    // Lua脚本保证原子性
    private static final String STOCK_LUA = 
        "local stock = redis.call('get', KEYS[1]) " +
        "if tonumber(stock) >= tonumber(ARGV[1]) then " +
        "  redis.call('decrby', KEYS[1], ARGV[1]) " +
        "  return 1 else return 0 end";
    
    public boolean decreaseStock(Long productId, Integer quantity) {
        Long result = redisTemplate.execute(
            new DefaultRedisScript<>(STOCK_LUA, Long.class),
            Collections.singletonList("stock:" + productId),
            quantity
        );
        return result != null && result == 1;
    }
}
```

**技术选型要点**：
- **前端**：CDN加速、防重复提交、用户体验优化
- **网关**：Sentinel限流、Hystrix熔断
- **应用**：Guava RateLimiter、异步处理
- **存储**：Redis缓存、MySQL分库分表

### 🎯 如何解决高并发下的缓存问题（缓存穿透、击穿、雪崩）？

**问题背景**：
电商系统在大促期间出现缓存相关故障，导致数据库压力骤增，系统响应缓慢甚至崩溃。

**缓存穿透解决方案**：

**1. 布隆过滤器 + 空值缓存**
```java
@Service
public class ProductCacheService {
    public Product getProduct(Long productId) {
        // 1. 布隆过滤器预检查
        if (!bloomFilter.mightContain(String.valueOf(productId))) {
            return null; // 一定不存在
        }
        
        // 2. 查询缓存
        Product product = redisTemplate.opsForValue().get("product:" + productId);
        if (product != null) return product;
        
        // 3. 查询数据库 + 空值缓存
        product = productMapper.selectById(productId);
        if (product != null) {
            redisTemplate.opsForValue().set("product:" + productId, product, 3600, TimeUnit.SECONDS);
        } else {
            redisTemplate.opsForValue().set("product:" + productId, "NULL", 300, TimeUnit.SECONDS);
        }
        return product;
    }
}
```

**2. 缓存击穿 - 分布式锁**
```java
@Service
public class HotDataCacheService {
    public Object getHotData(String key) {
        Object data = redisTemplate.opsForValue().get(key);
        if (data != null) return data;
        
        // 获取分布式锁，防止缓存击穿
        try (RedisLock lock = redisLockUtil.getLock("lock:" + key)) {
            if (lock.tryLock(5, TimeUnit.SECONDS)) {
                // 双重检查
                data = redisTemplate.opsForValue().get(key);
                if (data == null) {
                    data = queryFromDatabase(key);
                    redisTemplate.opsForValue().set(key, data, 7200, TimeUnit.SECONDS);
                }
            }
        }
        return data;
    }
}
```

**3. 缓存雪崩 - 随机TTL + 多级缓存**
```java
@Service
public class CacheAvalancheService {
    public void setCacheWithRandomTTL(String key, Object value, int baseTTL) {
        // 随机过期时间，防止大量key同时过期
        int randomTTL = baseTTL + new Random().nextInt(300);
        redisTemplate.opsForValue().set(key, value, randomTTL, TimeUnit.SECONDS);
    }
    
    // 多级缓存：L1本地 + L2Redis + L3数据库
    public Object getData(String key) {
        Object data = l1Cache.getIfPresent(key);
        if (data != null) return data;
        
        data = redisTemplate.opsForValue().get(key);
        if (data != null) {
            l1Cache.put(key, data);
            return data;
        }
        
        data = queryFromDatabase(key);
        if (data != null) {
            l1Cache.put(key, data);
            setCacheWithRandomTTL(key, data, 3600);
        }
        return data;
    }
}
```

### 🎯 设计一个高并发的订单系统架构？

**业务场景**：
设计一个能够支持每秒10万订单创建的电商订单系统，需要保证数据一致性、高可用性和良好的用户体验。

**核心思路**：`异步化 + 分库分表 + 消息队列`

**1. 订单接口设计**
```java
@RestController
public class OrderController {
    @PostMapping("/orders")
    public Result<String> createOrder(@RequestBody CreateOrderRequest request) {
        // 1. 参数校验 + 幂等性检查
        String orderId = idGenerator.nextId();
        if (existsOrder(request.getIdempotentKey())) {
            return Result.success(getExistOrderId(request.getIdempotentKey()));
        }
        
        // 2. 异步创建订单
        orderProducer.sendOrderMessage(orderId, request);
        return Result.success(orderId);
    }
}
```

**2. 分库分表策略**
```sql
-- 水平分库分表：根据user_id分库，order_id分表
-- 2个库 × 16个表 = 32个分片
ds${user_id % 2}.t_order_${order_id % 16}
```

**3. 异步处理订单**
```java
@RabbitListener(queues = "order.create.queue")
public void handleOrderCreate(OrderMessage message) {
    try {
        // 1. 创建订单
        orderService.saveOrder(buildOrder(message));
        
        // 2. 扣减库存
        if (!inventoryService.decreaseInventory(message.getProductItems())) {
            throw new BusinessException("库存不足");
        }
        
        // 3. 发送支付消息
        paymentProducer.sendPaymentMessage(message);
        
    } catch (Exception e) {
        // 发送到死信队列
        orderProducer.sendToDeadLetterQueue(message, e.getMessage());
    }
}
```

**4. 性能优化要点**
- **数据库连接池**：HikariCP，最大连接数50，最小空闲10
- **异步线程池**：核心线程20，最大线程50，队列1000
- **分布式事务**：Saga模式，支持补偿回滚

---

## 🌐 二、分布式系统设计

> **核心思想**：分布式系统设计考察的是在复杂的微服务环境下，如何保证系统的可用性、一致性和分区容错性。

### 🎯 如何设计一个微服务架构？包含哪些核心组件？

**业务背景**：
将一个单体电商系统拆分为微服务架构，支持用户、商品、订单、支付、库存等多个业务域，要求高可用、可扩展、易维护。

**核心组件架构**：

**1. 服务拆分策略**
```java
// 按业务域拆分
@RestController("/api/users")    // 用户服务
@RestController("/api/products") // 商品服务  
@RestController("/api/orders")   // 订单服务
```

**2. 服务注册与发现**
```java
// Nacos配置
spring:
  cloud:
    nacos:
      discovery:
        server-addr: nacos-server:8848
        
@Component
public class ServiceDiscovery {
    public ProductDTO getProduct(Long productId) {
        // 从注册中心获取服务实例
        List<ServiceInstance> instances = discoveryClient.getInstances("product-service");
        ServiceInstance instance = loadBalancer.choose(instances);
        return restTemplate.getForObject(instance.getUri() + "/products/" + productId, ProductDTO.class);
    }
}
```

**3. API网关设计**
```java
// Spring Cloud Gateway
@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r.path("/api/users/**")
                .filters(f -> f.stripPrefix(2).requestRateLimiter(rateLimiter()))
                .uri("lb://user-service"))
            .route("product-service", r -> r.path("/api/products/**") 
                .filters(f -> f.circuitBreaker(config -> config.setName("product-cb")))
                .uri("lb://product-service"))
            .build();
    }
}
```

**4. 服务容错处理**
```java
// Hystrix熔断器
@Component
public class ProductServiceClient {
    @HystrixCommand(fallbackMethod = "getProductFallback")
    public ProductDTO getProduct(Long productId) {
        return restTemplate.getForObject("http://product-service/products/" + productId, ProductDTO.class);
    }
    
    public ProductDTO getProductFallback(Long productId) {
        return ProductDTO.builder().id(productId).name("商品暂时不可用").build();
    }
}
```

### 🎯 如何保证分布式系统的数据一致性？

**业务场景**：
在电商订单系统中，订单创建涉及多个服务：订单服务、库存服务、支付服务、用户积分服务。如何保证这些操作要么全部成功，要么全部失败？

**分布式事务解决方案**：

**1. Saga分布式事务模式**
```java
@Component
public class OrderSagaService {
    public void createOrderWithSaga(CreateOrderRequest request) {
        sagaTransactionManager
            // 步骤1：创建订单
            .addStep(() -> orderService.createOrder(request),
                    orderId -> orderService.cancelOrder(orderId))
            // 步骤2：扣减库存  
            .addStep(() -> inventoryService.decreaseInventory(request.getItems()),
                    result -> inventoryService.increaseInventory(request.getItems()))
            // 步骤3：扣减余额
            .addStep(() -> accountService.deductBalance(request.getUserId(), request.getAmount()),
                    result -> accountService.addBalance(request.getUserId(), request.getAmount()))
            .execute();
    }
}
```

**2. TCC分布式事务模式**
```java
// TCC三阶段：Try-Confirm-Cancel
@Service
public class InventoryTccService {
    // Try：预留资源
    public boolean tryReserve(Long productId, Integer quantity, String txId) {
        return inventoryService.reserveInventory(productId, quantity, txId);
    }
    
    // Confirm：确认执行
    public boolean confirmReserve(String txId) {
        return inventoryService.confirmReservation(txId);
    }
    
    // Cancel：取消执行
    public boolean cancelReserve(String txId) {
        return inventoryService.cancelReservation(txId);
    }
}
```

**3. 消息最终一致性**
```java
// 事务消息保证最终一致性
@Service
public class OrderService {
    @Transactional
    public void createOrder(CreateOrderRequest request) {
        // 发送事务消息
        transactionalMessageSender.send("order-created-topic", 
            OrderCreatedEvent.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .build(),
            // 本地事务
            () -> {
                Order order = new Order();
                order.setId(request.getOrderId());
                order.setStatus(OrderStatus.CREATED);
                orderRepository.save(order);
            }
        );
    }
}

// 库存服务消费消息
@RabbitListener(topic = "order-created-topic")
public void handleOrderCreated(OrderCreatedEvent event) {
    if (inventoryService.decreaseInventory(event.getItems())) {
        // 发送库存扣减成功消息
        messageSender.send("inventory-decreased", event);
    } else {
        // 发送库存不足消息，触发订单取消
        messageSender.send("inventory-insufficient", event);
    }
}
```

**4. 分布式锁保证并发安全**
```java
@Component
public class RedisDistributedLock {
    public boolean tryLock(String key, String requestId, long expireTime) {
        String result = redisTemplate.opsForValue()
            .setIfAbsent("lock:" + key, requestId, Duration.ofMillis(expireTime));
        return Boolean.TRUE.equals(result);
    }
    
    public boolean unlock(String key, String requestId) {
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                       "return redis.call('del', KEYS[1]) else return 0 end";
        Long result = redisTemplate.execute(new DefaultRedisScript<>(script, Long.class),
            Collections.singletonList("lock:" + key), requestId);
        return result != null && result == 1L;
    }
}
```

---

## 💾 三、数据一致性与事务处理

### 🎯 如何设计一个分布式事务框架？

**设计思路**：
设计一个通用的分布式事务框架，支持多种事务模式（Saga、TCC、AT），具备高性能、高可用、易扩展的特点。

**框架整体架构**：

**1. 核心组件设计**
```java
// 事务管理器接口
public interface TransactionManager {
    
    /**
     * 开始全局事务
     */
    GlobalTransaction begin(String transactionName, int timeout);
    
    /**
     * 提交全局事务
     */
    GlobalTransactionStatus commit(String xid);
    
    /**
     * 回滚全局事务
     */
    GlobalTransactionStatus rollback(String xid);
    
    /**
     * 获取事务状态
     */
    GlobalTransactionStatus getStatus(String xid);
}

// 全局事务实现
@Component
public class DefaultTransactionManager implements TransactionManager {
    
    @Autowired
    private TransactionCoordinator coordinator;
    
    @Autowired
    private GlobalTransactionRepository globalTransactionRepository;
    
    @Override
    public GlobalTransaction begin(String transactionName, int timeout) {
        String xid = XidGenerator.generateXid();
        
        GlobalTransaction transaction = GlobalTransaction.builder()
            .xid(xid)
            .name(transactionName)
            .status(GlobalTransactionStatus.BEGIN)
            .timeout(timeout)
            .beginTime(System.currentTimeMillis())
            .build();
        
        // 持久化事务信息
        globalTransactionRepository.save(transaction);
        
        // 设置事务上下文
        TransactionContext.bind(transaction);
        
        return transaction;
    }
    
    @Override
    public GlobalTransactionStatus commit(String xid) {
        GlobalTransaction transaction = globalTransactionRepository.findByXid(xid);
        if (transaction == null) {
            return GlobalTransactionStatus.NOT_FOUND;
        }
        
        try {
            // 调用协调器提交事务
            boolean success = coordinator.commitTransaction(transaction);
            
            GlobalTransactionStatus status = success ? 
                GlobalTransactionStatus.COMMITTED : GlobalTransactionStatus.COMMIT_FAILED;
            
            transaction.setStatus(status);
            globalTransactionRepository.update(transaction);
            
            return status;
            
        } catch (Exception e) {
            log.error("提交事务失败: {}", xid, e);
            transaction.setStatus(GlobalTransactionStatus.COMMIT_FAILED);
            globalTransactionRepository.update(transaction);
            return GlobalTransactionStatus.COMMIT_FAILED;
        }
    }
}
```

**2. 分支事务管理**
```java
// 分支事务管理器
@Component
public class BranchTransactionManager {
    
    @Autowired
    private BranchTransactionRepository branchTransactionRepository;
    
    public BranchTransaction registerBranch(String xid, BranchTransactionRequest request) {
        String branchId = BranchIdGenerator.generateBranchId();
        
        BranchTransaction branchTransaction = BranchTransaction.builder()
            .branchId(branchId)
            .xid(xid)
            .resourceId(request.getResourceId())
            .branchType(request.getBranchType())
            .applicationData(request.getApplicationData())
            .status(BranchTransactionStatus.REGISTERED)
            .build();
        
        branchTransactionRepository.save(branchTransaction);
        
        return branchTransaction;
    }
    
    public boolean commitBranch(String branchId) {
        BranchTransaction branchTransaction = branchTransactionRepository.findByBranchId(branchId);
        if (branchTransaction == null) {
            return false;
        }
        
        // 根据分支类型执行不同的提交逻辑
        BranchTransactionHandler handler = getHandler(branchTransaction.getBranchType());
        boolean success = handler.commitBranch(branchTransaction);
        
        branchTransaction.setStatus(success ? 
            BranchTransactionStatus.COMMITTED : BranchTransactionStatus.COMMIT_FAILED);
        branchTransactionRepository.update(branchTransaction);
        
        return success;
    }
    
    public boolean rollbackBranch(String branchId) {
        BranchTransaction branchTransaction = branchTransactionRepository.findByBranchId(branchId);
        if (branchTransaction == null) {
            return false;
        }
        
        BranchTransactionHandler handler = getHandler(branchTransaction.getBranchType());
        boolean success = handler.rollbackBranch(branchTransaction);
        
        branchTransaction.setStatus(success ? 
            BranchTransactionStatus.ROLLBACKED : BranchTransactionStatus.ROLLBACK_FAILED);
        branchTransactionRepository.update(branchTransaction);
        
        return success;
    }
}

// 分支事务处理器接口
public interface BranchTransactionHandler {
    
    boolean commitBranch(BranchTransaction branchTransaction);
    
    boolean rollbackBranch(BranchTransaction branchTransaction);
    
    BranchType getSupportedBranchType();
}

// TCC分支事务处理器
@Component
public class TccBranchTransactionHandler implements BranchTransactionHandler {
    
    @Override
    public boolean commitBranch(BranchTransaction branchTransaction) {
        try {
            // 调用TCC的Confirm方法
            TccActionContext context = TccActionContext.builder()
                .branchId(branchTransaction.getBranchId())
                .xid(branchTransaction.getXid())
                .applicationData(branchTransaction.getApplicationData())
                .build();
            
            TccAction tccAction = getTccAction(branchTransaction.getResourceId());
            return tccAction.confirm(context);
            
        } catch (Exception e) {
            log.error("TCC分支提交失败: {}", branchTransaction.getBranchId(), e);
            return false;
        }
    }
    
    @Override
    public boolean rollbackBranch(BranchTransaction branchTransaction) {
        try {
            TccActionContext context = TccActionContext.builder()
                .branchId(branchTransaction.getBranchId())
                .xid(branchTransaction.getXid())
                .applicationData(branchTransaction.getApplicationData())
                .build();
            
            TccAction tccAction = getTccAction(branchTransaction.getResourceId());
            return tccAction.cancel(context);
            
        } catch (Exception e) {
            log.error("TCC分支回滚失败: {}", branchTransaction.getBranchId(), e);
            return false;
        }
    }
    
    @Override
    public BranchType getSupportedBranchType() {
        return BranchType.TCC;
    }
}
```

**3. 事务协调器**
```java
// 事务协调器
@Component
public class TransactionCoordinator {
    
    @Autowired
    private BranchTransactionManager branchTransactionManager;
    
    @Autowired
    private AsyncTaskExecutor asyncTaskExecutor;
    
    public boolean commitTransaction(GlobalTransaction globalTransaction) {
        List<BranchTransaction> branchTransactions = 
            branchTransactionRepository.findByXid(globalTransaction.getXid());
        
        if (branchTransactions.isEmpty()) {
            return true;
        }
        
        // 并行提交所有分支事务
        List<CompletableFuture<Boolean>> futures = branchTransactions.stream()
            .map(branch -> CompletableFuture.supplyAsync(() -> 
                branchTransactionManager.commitBranch(branch.getBranchId()), asyncTaskExecutor))
            .collect(Collectors.toList());
        
        // 等待所有分支事务完成
        CompletableFuture<Void> allOf = CompletableFuture.allOf(
            futures.toArray(new CompletableFuture[0]));
        
        try {
            allOf.get(globalTransaction.getTimeout(), TimeUnit.MILLISECONDS);
            
            // 检查所有分支事务是否都提交成功
            return futures.stream()
                .allMatch(future -> {
                    try {
                        return future.get();
                    } catch (Exception e) {
                        return false;
                    }
                });
                
        } catch (TimeoutException e) {
            log.error("事务提交超时: {}", globalTransaction.getXid());
            return false;
        } catch (Exception e) {
            log.error("事务提交异常: {}", globalTransaction.getXid(), e);
            return false;
        }
    }
    
    public boolean rollbackTransaction(GlobalTransaction globalTransaction) {
        List<BranchTransaction> branchTransactions = 
            branchTransactionRepository.findByXid(globalTransaction.getXid());
        
        // 并行回滚所有分支事务
        List<CompletableFuture<Boolean>> futures = branchTransactions.stream()
            .map(branch -> CompletableFuture.supplyAsync(() -> 
                branchTransactionManager.rollbackBranch(branch.getBranchId()), asyncTaskExecutor))
            .collect(Collectors.toList());
        
        CompletableFuture<Void> allOf = CompletableFuture.allOf(
            futures.toArray(new CompletableFuture[0]));
        
        try {
            allOf.get(globalTransaction.getTimeout(), TimeUnit.MILLISECONDS);
            
            return futures.stream()
                .allMatch(future -> {
                    try {
                        return future.get();
                    } catch (Exception e) {
                        log.error("分支事务回滚失败", e);
                        return false;
                    }
                });
                
        } catch (Exception e) {
            log.error("事务回滚异常: {}", globalTransaction.getXid(), e);
            return false;
        }
    }
}
```

**4. 自动代理和注解支持**
```java
// 分布式事务注解
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DistributedTransaction {
    
    /**
     * 事务名称
     */
    String name() default "";
    
    /**
     * 超时时间（毫秒）
     */
    int timeout() default 30000;
    
    /**
     * 事务传播行为
     */
    TransactionPropagation propagation() default TransactionPropagation.REQUIRED;
    
    /**
     * 回滚异常类型
     */
    Class<? extends Throwable>[] rollbackFor() default {};
}

// 分布式事务切面
@Aspect
@Component
public class DistributedTransactionAspect {
    
    @Autowired
    private TransactionManager transactionManager;
    
    @Around("@annotation(distributedTransaction)")
    public Object around(ProceedingJoinPoint joinPoint, DistributedTransaction distributedTransaction) throws Throwable {
        
        String transactionName = StringUtils.isNotBlank(distributedTransaction.name()) 
            ? distributedTransaction.name() 
            : joinPoint.getSignature().getName();
        
        GlobalTransaction transaction = null;
        boolean isTransactionInitiator = false;
        
        try {
            // 检查是否已有事务上下文
            GlobalTransaction currentTransaction = TransactionContext.getCurrent();
            
            if (currentTransaction == null) {
                // 开启新事务
                transaction = transactionManager.begin(transactionName, distributedTransaction.timeout());
                isTransactionInitiator = true;
            } else {
                transaction = currentTransaction;
            }
            
            // 执行业务方法
            Object result = joinPoint.proceed();
            
            // 如果是事务发起者，负责提交事务
            if (isTransactionInitiator) {
                GlobalTransactionStatus status = transactionManager.commit(transaction.getXid());
                if (status != GlobalTransactionStatus.COMMITTED) {
                    throw new TransactionException("分布式事务提交失败: " + status);
                }
            }
            
            return result;
            
        } catch (Throwable e) {
            if (isTransactionInitiator && transaction != null) {
                // 判断是否需要回滚
                if (shouldRollback(e, distributedTransaction.rollbackFor())) {
                    transactionManager.rollback(transaction.getXid());
                }
            }
            throw e;
        } finally {
            if (isTransactionInitiator) {
                TransactionContext.unbind();
            }
        }
    }
    
    private boolean shouldRollback(Throwable ex, Class<? extends Throwable>[] rollbackFor) {
        if (rollbackFor.length == 0) {
            return ex instanceof RuntimeException || ex instanceof Error;
        }
        
        for (Class<? extends Throwable> clazz : rollbackFor) {
            if (clazz.isAssignableFrom(ex.getClass())) {
                return true;
            }
        }
        
        return false;
    }
}
```

**5. 事务恢复机制**
```java
// 事务恢复服务
@Service
public class TransactionRecoveryService {
    
    @Scheduled(fixedRate = 30000) // 每30秒执行一次
    public void recoverTimeoutTransactions() {
        long currentTime = System.currentTimeMillis();
        
        // 查找超时的事务
        List<GlobalTransaction> timeoutTransactions = 
            globalTransactionRepository.findTimeoutTransactions(currentTime);
        
        for (GlobalTransaction transaction : timeoutTransactions) {
            try {
                recoverTransaction(transaction);
            } catch (Exception e) {
                log.error("恢复事务失败: {}", transaction.getXid(), e);
            }
        }
    }
    
    private void recoverTransaction(GlobalTransaction transaction) {
        switch (transaction.getStatus()) {
            case BEGIN:
            case COMMITTING:
                // 尝试提交
                GlobalTransactionStatus commitStatus = transactionManager.commit(transaction.getXid());
                if (commitStatus == GlobalTransactionStatus.COMMITTED) {
                    log.info("恢复提交事务成功: {}", transaction.getXid());
                } else {
                    log.warn("恢复提交事务失败: {}, status: {}", transaction.getXid(), commitStatus);
                }
                break;
                
            case ROLLBACKING:
                // 尝试回滚
                GlobalTransactionStatus rollbackStatus = transactionManager.rollback(transaction.getXid());
                if (rollbackStatus == GlobalTransactionStatus.ROLLBACKED) {
                    log.info("恢复回滚事务成功: {}", transaction.getXid());
                } else {
                    log.warn("恢复回滚事务失败: {}, status: {}", transaction.getXid(), rollbackStatus);
                }
                break;
                
            case COMMIT_FAILED:
            case ROLLBACK_FAILED:
                // 记录日志，人工处理
                log.error("事务需要人工处理: {}, status: {}", transaction.getXid(), transaction.getStatus());
                alertService.sendAlert("分布式事务异常", 
                    String.format("事务%s状态异常，需要人工处理", transaction.getXid()));
                break;
                
            default:
                break;
        }
    }
}
```

---

## ⚡ 四、性能优化实战

> **核心思想**：性能优化是Java后端工程师的核心技能，需要从JVM、数据库、接口、缓存等多个维度进行系统性优化。

### 🎯 如何诊断和解决Java应用的性能问题？

**业务背景**：
生产环境中的Java应用出现响应缓慢，CPU使用率高，内存占用不断增长，需要系统性地诊断和解决性能问题。

**性能诊断方法论**：

**1. 性能问题分类**
```java
@Component
public class PerformanceDiagnosticService {
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    // 性能指标监控
    public PerformanceMetrics collectMetrics() {
        return PerformanceMetrics.builder()
            // JVM指标
            .heapMemoryUsed(getHeapMemoryUsed())
            .nonHeapMemoryUsed(getNonHeapMemoryUsed())
            .gcCount(getGcCount())
            .gcTime(getGcTime())
            
            // 应用指标
            .threadCount(getThreadCount())
            .deadlockedThreads(getDeadlockedThreads())
            .cpuUsage(getCpuUsage())
            
            // 业务指标
            .responseTime(getAverageResponseTime())
            .throughput(getThroughput())
            .errorRate(getErrorRate())
            .build();
    }
    
    // CPU热点分析
    public List<MethodHotspot> analyzeCpuHotspots() {
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        long[] threadIds = threadBean.getAllThreadIds();
        
        Map<StackTraceElement, Long> methodCpuTime = new HashMap<>();
        
        for (long threadId : threadIds) {
            ThreadInfo threadInfo = threadBean.getThreadInfo(threadId, Integer.MAX_VALUE);
            if (threadInfo != null) {
                long cpuTime = threadBean.getThreadCpuTime(threadId);
                
                for (StackTraceElement element : threadInfo.getStackTrace()) {
                    methodCpuTime.merge(element, cpuTime, Long::sum);
                }
            }
        }
        
        return methodCpuTime.entrySet().stream()
            .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
            .limit(10)
            .map(entry -> MethodHotspot.builder()
                .method(entry.getKey().toString())
                .cpuTime(entry.getValue())
                .build())
            .collect(Collectors.toList());
    }
    
    // 内存泄漏检测
    public MemoryLeakReport detectMemoryLeaks() {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
        
        // 检查堆内存增长趋势
        long memoryGrowthRate = calculateMemoryGrowthRate();
        
        // 分析大对象
        List<LargeObjectInfo> largeObjects = analyzeLargeObjects();
        
        // 检查GC效率
        GcEfficiencyInfo gcEfficiency = analyzeGcEfficiency();
        
        return MemoryLeakReport.builder()
            .heapUsage(heapUsage)
            .memoryGrowthRate(memoryGrowthRate)
            .largeObjects(largeObjects)
            .gcEfficiency(gcEfficiency)
            .build();
    }
}
```

**2. JVM调优实战**
```java
// JVM参数优化配置
@Configuration
public class JvmOptimizationConfig {
    
    /**
     * 生产环境JVM参数推荐配置
     * 
     * 堆内存配置：
     * -Xms4g -Xmx4g                    # 初始和最大堆内存4G
     * -XX:NewRatio=3                   # 老年代与新生代比例3:1
     * -XX:SurvivorRatio=8              # Eden与Survivor比例8:1:1
     * 
     * GC配置：
     * -XX:+UseG1GC                     # 使用G1垃圾收集器
     * -XX:MaxGCPauseMillis=200         # 最大GC暂停时间200ms
     * -XX:G1HeapRegionSize=16m         # G1区域大小16MB
     * 
     * 内存溢出诊断：
     * -XX:+HeapDumpOnOutOfMemoryError  # OOM时生成堆转储
     * -XX:HeapDumpPath=/logs/heapdump  # 堆转储文件路径
     * 
     * GC日志：
     * -Xloggc:/logs/gc.log            # GC日志路径
     * -XX:+PrintGCDetails             # 打印GC详细信息
     * -XX:+PrintGCTimeStamps          # 打印GC时间戳
     */
    
    @Bean
    public JvmMonitor jvmMonitor() {
        return new JvmMonitor();
    }
}

@Component
public class GcOptimizer {
    
    // G1GC调优策略
    public void optimizeG1GC() {
        /*
         * G1GC调优要点：
         * 
         * 1. 设置合理的暂停时间目标
         *    -XX:MaxGCPauseMillis=200
         *    
         * 2. 调整堆区域大小
         *    -XX:G1HeapRegionSize=16m (适用于4-8G堆)
         *    
         * 3. 控制并发标记线程数
         *    -XX:ConcGCThreads=4
         *    
         * 4. 调整混合GC触发阈值
         *    -XX:G1MixedGCCountTarget=8
         *    -XX:G1OldCSetRegionThreshold=10
         *    
         * 5. 启用大对象优化
         *    -XX:G1HeapRegionSize的50%作为大对象阈值
         */
    }
    
    // ZGC调优策略（适用于大内存场景）
    public void optimizeZGC() {
        /*
         * ZGC调优要点：
         * 
         * 1. 启用ZGC
         *    -XX:+UnlockExperimentalVMOptions -XX:+UseZGC
         *    
         * 2. 设置内存分配速率
         *    -XX:SoftMaxHeapSize=30g (软限制，允许超过)
         *    
         * 3. 启用着色指针压缩
         *    -XX:+UseCompressedOops
         *    
         * 4. 调整GC触发阈值
         *    -XX:ZCollectionInterval=5 (秒)
         */
    }
}
```

**3. 数据库性能优化**
```java
@Service
public class DatabaseOptimizationService {
    
    @Autowired
    private SqlAnalyzer sqlAnalyzer;
    
    @Autowired
    private IndexAdvisor indexAdvisor;
    
    // 慢查询优化
    public List<SlowQueryOptimization> optimizeSlowQueries() {
        // 1. 获取慢查询日志
        List<SlowQuery> slowQueries = sqlAnalyzer.getSlowQueries();
        
        List<SlowQueryOptimization> optimizations = new ArrayList<>();
        
        for (SlowQuery query : slowQueries) {
            SlowQueryOptimization optimization = SlowQueryOptimization.builder()
                .originalSql(query.getSql())
                .executionTime(query.getExecutionTime())
                .build();
            
            // 2. SQL重写优化
            String optimizedSql = rewriteSQL(query.getSql());
            optimization.setOptimizedSql(optimizedSql);
            
            // 3. 索引建议
            List<IndexSuggestion> indexSuggestions = indexAdvisor.suggestIndexes(query);
            optimization.setIndexSuggestions(indexSuggestions);
            
            // 4. 分页优化
            if (query.getSql().contains("LIMIT")) {
                String paginationOptimization = optimizePagination(query.getSql());
                optimization.setPaginationOptimization(paginationOptimization);
            }
            
            optimizations.add(optimization);
        }
        
        return optimizations;
    }
    
    private String rewriteSQL(String originalSql) {
        // SQL重写规则
        String optimized = originalSql;
        
        // 1. 避免SELECT *
        if (optimized.contains("SELECT *")) {
            optimized = replaceSelectStar(optimized);
        }
        
        // 2. 优化JOIN操作
        if (optimized.contains("JOIN")) {
            optimized = optimizeJoins(optimized);
        }
        
        // 3. 优化WHERE条件
        optimized = optimizeWhereClause(optimized);
        
        // 4. 优化GROUP BY
        if (optimized.contains("GROUP BY")) {
            optimized = optimizeGroupBy(optimized);
        }
        
        return optimized;
    }
    
    // 连接池优化
    @Bean
    public DataSource optimizedDataSource() {
        HikariConfig config = new HikariConfig();
        
        // 连接池大小优化
        config.setMaximumPoolSize(calculateOptimalPoolSize());
        config.setMinimumIdle(config.getMaximumPoolSize() / 4);
        
        // 连接超时优化
        config.setConnectionTimeout(30000);      // 30秒
        config.setIdleTimeout(600000);           // 10分钟
        config.setMaxLifetime(1800000);          // 30分钟
        
        // 性能优化参数
        config.setLeakDetectionThreshold(60000); // 连接泄漏检测
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        
        return new HikariDataSource(config);
    }
    
    private int calculateOptimalPoolSize() {
        // 连接池大小计算公式
        int cpuCores = Runtime.getRuntime().availableProcessors();
        int targetUtilization = 80; // 目标CPU利用率80%
        int blockingCoefficient = 90; // 阻塞系数90%（数据库IO密集）
        
        return cpuCores * targetUtilization * (1 + blockingCoefficient) / 100;
    }
}
```

**4. 接口性能优化**
```java
@RestController
public class OptimizedController {
    
    @Autowired
    private AsyncTaskExecutor asyncExecutor;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 批量接口优化
    @PostMapping("/users/batch")
    public ResponseEntity<List<UserDTO>> getUsersBatch(@RequestBody List<Long> userIds) {
        
        // 1. 参数校验
        if (userIds.size() > 100) {
            throw new IllegalArgumentException("批量查询数量不能超过100");
        }
        
        // 2. 缓存批量查询
        List<UserDTO> cachedUsers = batchGetFromCache(userIds);
        Set<Long> missedIds = userIds.stream()
            .filter(id -> cachedUsers.stream().noneMatch(user -> user.getId().equals(id)))
            .collect(Collectors.toSet());
        
        // 3. 数据库批量查询
        List<UserDTO> dbUsers = Collections.emptyList();
        if (!missedIds.isEmpty()) {
            dbUsers = userService.getUsersByIds(missedIds);
            // 回写缓存
            batchSetToCache(dbUsers);
        }
        
        // 4. 合并结果
        List<UserDTO> allUsers = new ArrayList<>(cachedUsers);
        allUsers.addAll(dbUsers);
        
        return ResponseEntity.ok(allUsers);
    }
    
    // 异步接口优化
    @PostMapping("/orders/async")
    public CompletableFuture<ResponseEntity<String>> createOrderAsync(
            @RequestBody CreateOrderRequest request) {
        
        return CompletableFuture
            .supplyAsync(() -> {
                // 异步创建订单
                String orderId = orderService.createOrder(request);
                return ResponseEntity.ok(orderId);
            }, asyncExecutor)
            .exceptionally(throwable -> {
                log.error("异步创建订单失败", throwable);
                return ResponseEntity.status(500).body("订单创建失败");
            });
    }
    
    // 响应压缩优化
    @GetMapping("/products")
    @Compress // 自定义注解，启用响应压缩
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<ProductDTO> products = productService.getProducts(page, size);
        
        // 设置缓存头
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(300, TimeUnit.SECONDS)) // 5分钟缓存
            .body(products);
    }
}

// 性能监控切面
@Aspect
@Component
public class PerformanceMonitoringAspect {
    
    private final Timer.Sample timerSample = Timer.start();
    
    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PostMapping)")
    public Object monitorPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        Timer.Sample sample = Timer.start();
        
        try {
            Object result = joinPoint.proceed();
            
            // 记录成功请求
            sample.stop(Timer.builder("http.request.duration")
                .tag("method", methodName)
                .tag("status", "success")
                .register(Metrics.globalRegistry));
            
            return result;
            
        } catch (Exception e) {
            // 记录失败请求
            sample.stop(Timer.builder("http.request.duration")
                .tag("method", methodName)
                .tag("status", "error")
                .register(Metrics.globalRegistry));
            
            throw e;
        }
    }
}
```

### 🎯 如何进行JVM内存调优和GC优化？

**业务背景**：
应用服务器频繁出现Full GC，GC停顿时间过长影响用户体验，需要针对性地进行JVM内存调优。

**JVM调优实战方案**：

**1. 内存分析工具使用**
```java
@Component
public class JvmAnalysisToolkit {
    
    // 内存快照分析
    public void analyzeHeapDump(String heapDumpPath) {
        /*
         * 使用MAT (Memory Analyzer Tool) 分析堆转储：
         * 
         * 1. 打开.hprof文件
         * 2. 查看Overview报告
         * 3. 分析支配树 (Dominator Tree)
         * 4. 查找内存泄漏嫌疑 (Leak Suspects)
         * 5. 分析大对象 (Top Consumers)
         */
        
        // 编程方式分析内存
        try {
            HotSpotDiagnosticMXBean diagnosticBean = ManagementFactory
                .getPlatformMXBean(HotSpotDiagnosticMXBean.class);
            
            // 生成堆转储
            String fileName = "heap-dump-" + System.currentTimeMillis() + ".hprof";
            diagnosticBean.dumpHeap(fileName, true);
            
            log.info("堆转储已生成: {}", fileName);
            
        } catch (Exception e) {
            log.error("生成堆转储失败", e);
        }
    }
    
    // GC日志分析
    public GcAnalysisReport analyzeGcLogs(String gcLogPath) {
        /*
         * GC日志分析要点：
         * 
         * 1. GC频率和时间
         *    - Young GC频率过高：新生代太小或对象过早晋升
         *    - Full GC频率过高：老年代内存不足或内存泄漏
         * 
         * 2. GC停顿时间
         *    - STW时间过长：堆太大或GC算法不合适
         *    - 并发GC效率低：并发线程数不足
         * 
         * 3. 内存使用模式
         *    - 内存使用趋势：是否存在内存泄漏
         *    - 晋升率：对象从新生代到老年代的速度
         */
        
        return GcAnalysisReport.builder()
            .avgYoungGcTime(calculateAvgYoungGcTime(gcLogPath))
            .avgFullGcTime(calculateAvgFullGcTime(gcLogPath))
            .gcFrequency(calculateGcFrequency(gcLogPath))
            .memoryUsageTrend(analyzeMemoryTrend(gcLogPath))
            .build();
    }
    
    // 在线内存分析
    public MemoryUsageReport analyzeOnlineMemory() {
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        List<MemoryPoolMXBean> poolBeans = ManagementFactory.getMemoryPoolMXBeans();
        
        Map<String, MemoryUsage> poolUsages = new HashMap<>();
        for (MemoryPoolMXBean poolBean : poolBeans) {
            poolUsages.put(poolBean.getName(), poolBean.getUsage());
        }
        
        return MemoryUsageReport.builder()
            .heapMemory(memoryBean.getHeapMemoryUsage())
            .nonHeapMemory(memoryBean.getNonHeapMemoryUsage())
            .poolUsages(poolUsages)
            .build();
    }
}
```

**2. 不同场景的GC策略选择**
```java
@Component
public class GcStrategySelector {
    
    // 低延迟场景 - ZGC配置
    public void configureLowLatencyGC() {
        /*
         * ZGC适用场景：
         * - 堆内存 > 8GB
         * - 对延迟极度敏感 (< 10ms)
         * - 可以容忍稍高的CPU开销
         * 
         * JVM参数：
         * -XX:+UnlockExperimentalVMOptions
         * -XX:+UseZGC
         * -Xmx32g
         * -XX:SoftMaxHeapSize=30g
         */
    }
    
    // 高吞吐场景 - Parallel GC配置
    public void configureHighThroughputGC() {
        /*
         * Parallel GC适用场景：
         * - 吞吐量优先的批处理应用
         * - 可以容忍较长的停顿时间
         * - 多核CPU环境
         * 
         * JVM参数：
         * -XX:+UseParallelGC
         * -XX:+UseParallelOldGC
         * -XX:ParallelGCThreads=8
         * -XX:MaxGCPauseMillis=500
         */
    }
    
    // 平衡场景 - G1GC配置
    public void configureBalancedGC() {
        /*
         * G1GC适用场景：
         * - 4GB ~ 32GB堆内存
         * - 平衡延迟和吞吐量
         * - 可预测的停顿时间
         * 
         * JVM参数：
         * -XX:+UseG1GC
         * -XX:MaxGCPauseMillis=200
         * -XX:G1HeapRegionSize=16m
         * -XX:G1NewSizePercent=30
         * -XX:G1MaxNewSizePercent=40
         * -XX:G1MixedGCCountTarget=8
         */
    }
}
```

---

## 🛡️ 五、系统稳定性保障

> **核心思想**：系统稳定性是生产环境的生命线，需要从监控、容灾、降级、恢复等多个维度构建完整的稳定性保障体系。

### 🎯 如何设计一个完整的监控告警系统？

**业务背景**：
构建一个面向微服务架构的监控告警系统，需要覆盖基础设施、应用服务、业务指标等多个层面，实现故障的快速发现和定位。

**监控系统架构设计**：

**1. 多层监控体系**
```java
@Configuration
public class MonitoringConfiguration {
    
    // 基础设施监控
    @Bean
    public InfrastructureMonitor infrastructureMonitor() {
        return InfrastructureMonitor.builder()
            .cpuThreshold(80.0)         // CPU使用率告警阈值
            .memoryThreshold(85.0)      // 内存使用率告警阈值
            .diskThreshold(90.0)        // 磁盘使用率告警阈值
            .networkThreshold(1000.0)   // 网络吞吐量告警阈值(Mbps)
            .build();
    }
    
    // 应用监控
    @Bean
    public ApplicationMonitor applicationMonitor() {
        return ApplicationMonitor.builder()
            .responseTimeThreshold(2000)    // 响应时间告警阈值(ms)
            .errorRateThreshold(5.0)        // 错误率告警阈值(%)
            .throughputThreshold(1000)      // 吞吐量告警阈值(QPS)
            .jvmHeapThreshold(80.0)        // JVM堆内存告警阈值(%)
            .build();
    }
    
    // 业务监控
    @Bean
    public BusinessMonitor businessMonitor() {
        return BusinessMonitor.builder()
            .orderSuccessRateThreshold(95.0)   // 订单成功率告警阈值
            .paymentFailureThreshold(1.0)      // 支付失败率告警阈值
            .userActiveThreshold(10000)        // 活跃用户数告警阈值
            .build();
    }
}

@Service
public class MetricsCollectionService {
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    @Autowired
    private PrometheusClient prometheusClient;
    
    // 自定义业务指标收集
    @EventListener
    public void handleOrderEvent(OrderEvent event) {
        Timer.Sample sample = Timer.start(meterRegistry);
        
        try {
            // 记录订单处理时间
            sample.stop(Timer.builder("order.processing.time")
                .tag("status", event.getStatus().name())
                .tag("product_category", event.getProductCategory())
                .register(meterRegistry));
            
            // 记录订单金额分布
            DistributionSummary.builder("order.amount")
                .tag("payment_method", event.getPaymentMethod())
                .register(meterRegistry)
                .record(event.getAmount().doubleValue());
            
            // 记录订单成功率
            Counter.builder("order.total")
                .tag("status", event.getStatus().name())
                .register(meterRegistry)
                .increment();
                
        } catch (Exception e) {
            // 记录异常指标
            Counter.builder("order.error")
                .tag("error_type", e.getClass().getSimpleName())
                .register(meterRegistry)
                .increment();
        }
    }
    
    // 系统健康度指标
    @Scheduled(fixedRate = 30000) // 每30秒收集一次
    public void collectHealthMetrics() {
        // JVM指标
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        double memoryUsage = (double) (totalMemory - freeMemory) / totalMemory * 100;
        
        Gauge.builder("jvm.memory.usage.percent")
            .register(meterRegistry, () -> memoryUsage);
        
        // 线程池指标
        ThreadPoolTaskExecutor executor = (ThreadPoolTaskExecutor) applicationContext.getBean("taskExecutor");
        Gauge.builder("thread.pool.active.threads")
            .register(meterRegistry, () -> executor.getActiveCount());
        
        Gauge.builder("thread.pool.queue.size")
            .register(meterRegistry, () -> executor.getThreadPoolExecutor().getQueue().size());
        
        // 数据库连接池指标
        HikariDataSource dataSource = (HikariDataSource) applicationContext.getBean("dataSource");
        Gauge.builder("database.connection.active")
            .register(meterRegistry, () -> dataSource.getHikariPoolMXBean().getActiveConnections());
        
        Gauge.builder("database.connection.idle")
            .register(meterRegistry, () -> dataSource.getHikariPoolMXBean().getIdleConnections());
    }
}
```

**2. 智能告警规则引擎**
```java
@Component
public class AlertRuleEngine {
    
    @Autowired
    private AlertRuleRepository alertRuleRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // 告警规则评估
    @Scheduled(fixedRate = 60000) // 每分钟评估一次
    public void evaluateAlertRules() {
        List<AlertRule> rules = alertRuleRepository.getActiveRules();
        
        for (AlertRule rule : rules) {
            try {
                boolean triggered = evaluateRule(rule);
                
                if (triggered) {
                    handleAlertTrigger(rule);
                } else {
                    handleAlertRecover(rule);
                }
                
            } catch (Exception e) {
                log.error("告警规则评估失败: {}", rule.getName(), e);
            }
        }
    }
    
    private boolean evaluateRule(AlertRule rule) {
        // 获取指标数据
        MetricQuery query = MetricQuery.builder()
            .metric(rule.getMetric())
            .timeRange(rule.getTimeWindow())
            .aggregation(rule.getAggregation())
            .build();
        
        double currentValue = prometheusClient.queryMetric(query);
        
        // 评估阈值条件
        switch (rule.getComparator()) {
            case GREATER_THAN:
                return currentValue > rule.getThreshold();
            case LESS_THAN:
                return currentValue < rule.getThreshold();
            case EQUALS:
                return Math.abs(currentValue - rule.getThreshold()) < 0.001;
            default:
                return false;
        }
    }
    
    private void handleAlertTrigger(AlertRule rule) {
        // 检查告警抑制条件
        if (isAlertSuppressed(rule)) {
            return;
        }
        
        // 创建告警事件
        AlertEvent event = AlertEvent.builder()
            .ruleId(rule.getId())
            .ruleName(rule.getName())
            .severity(rule.getSeverity())
            .message(generateAlertMessage(rule))
            .timestamp(System.currentTimeMillis())
            .status(AlertStatus.FIRING)
            .build();
        
        // 发送通知
        notificationService.sendAlert(event);
        
        // 记录告警历史
        alertHistoryService.recordAlert(event);
    }
    
    private boolean isAlertSuppressed(AlertRule rule) {
        // 1. 检查维护窗口
        if (isInMaintenanceWindow()) {
            return true;
        }
        
        // 2. 检查告警频率限制
        if (isAlertRateLimited(rule)) {
            return true;
        }
        
        // 3. 检查依赖服务状态
        if (isDependentServiceDown(rule)) {
            return true;
        }
        
        return false;
    }
}

// 多渠道通知服务
@Service
public class NotificationService {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private SmsService smsService;
    
    @Autowired
    private SlackService slackService;
    
    @Autowired
    private DingTalkService dingTalkService;
    
    public void sendAlert(AlertEvent event) {
        // 根据严重程度选择通知渠道
        List<NotificationChannel> channels = selectChannels(event.getSeverity());
        
        for (NotificationChannel channel : channels) {
            try {
                switch (channel) {
                    case EMAIL:
                        sendEmailAlert(event);
                        break;
                    case SMS:
                        sendSmsAlert(event);
                        break;
                    case SLACK:
                        sendSlackAlert(event);
                        break;
                    case DINGTALK:
                        sendDingTalkAlert(event);
                        break;
                }
            } catch (Exception e) {
                log.error("发送告警通知失败: channel={}, event={}", channel, event.getRuleName(), e);
            }
        }
    }
    
    private List<NotificationChannel> selectChannels(AlertSeverity severity) {
        switch (severity) {
            case CRITICAL:
                return Arrays.asList(SMS, EMAIL, SLACK, DINGTALK);
            case HIGH:
                return Arrays.asList(EMAIL, SLACK);
            case MEDIUM:
                return Arrays.asList(EMAIL);
            case LOW:
                return Arrays.asList(SLACK);
            default:
                return Collections.emptyList();
        }
    }
    
    private void sendDingTalkAlert(AlertEvent event) {
        DingTalkMessage message = DingTalkMessage.builder()
            .msgtype("markdown")
            .markdown(DingTalkMarkdown.builder()
                .title("🚨 系统告警")
                .text(buildDingTalkMessage(event))
                .build())
            .build();
        
        dingTalkService.sendMessage(message);
    }
    
    private String buildDingTalkMessage(AlertEvent event) {
        return String.format(
            "### 🚨 系统告警\n\n" +
            "**告警规则**: %s\n\n" +
            "**严重程度**: %s\n\n" +
            "**告警时间**: %s\n\n" +
            "**告警详情**: %s\n\n" +
            "**处理建议**: %s",
            event.getRuleName(),
            event.getSeverity(),
            formatTimestamp(event.getTimestamp()),
            event.getMessage(),
            getHandlingSuggestion(event)
        );
    }
}
```

**3. 故障自动恢复机制**
```java
@Component
public class AutoRecoveryService {
    
    @Autowired
    private ServiceHealthChecker healthChecker;
    
    @Autowired
    private LoadBalancer loadBalancer;
    
    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;
    
    // 服务自动恢复
    @EventListener
    public void handleServiceFailure(ServiceFailureEvent event) {
        String serviceName = event.getServiceName();
        String instanceId = event.getInstanceId();
        
        log.warn("检测到服务故障: service={}, instance={}", serviceName, instanceId);
        
        // 1. 立即从负载均衡器移除故障实例
        loadBalancer.removeInstance(serviceName, instanceId);
        
        // 2. 触发熔断器
        CircuitBreaker circuitBreaker = circuitBreakerRegistry.circuitBreaker(serviceName);
        circuitBreaker.transitionToOpenState();
        
        // 3. 启动自动恢复流程
        startAutoRecovery(serviceName, instanceId);
    }
    
    private void startAutoRecovery(String serviceName, String instanceId) {
        CompletableFuture.runAsync(() -> {
            int maxRetries = 10;
            int retryInterval = 30; // 30秒
            
            for (int i = 0; i < maxRetries; i++) {
                try {
                    Thread.sleep(retryInterval * 1000);
                    
                    // 健康检查
                    if (healthChecker.checkHealth(serviceName, instanceId)) {
                        log.info("服务恢复成功: service={}, instance={}", serviceName, instanceId);
                        
                        // 重新加入负载均衡器
                        loadBalancer.addInstance(serviceName, instanceId);
                        
                        // 重置熔断器
                        CircuitBreaker circuitBreaker = circuitBreakerRegistry.circuitBreaker(serviceName);
                        circuitBreaker.reset();
                        
                        // 发送恢复通知
                        notificationService.sendRecoveryNotification(serviceName, instanceId);
                        
                        break;
                    }
                    
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                } catch (Exception e) {
                    log.error("自动恢复检查失败: service={}, instance={}, retry={}", 
                        serviceName, instanceId, i + 1, e);
                }
            }
        });
    }
    
    // 数据库连接自动恢复
    @Component
    public class DatabaseConnectionRecovery {
        
        @Autowired
        private DataSource dataSource;
        
        @EventListener
        public void handleDatabaseConnectionFailure(DatabaseFailureEvent event) {
            log.warn("检测到数据库连接故障，启动自动恢复");
            
            // 1. 验证连接池状态
            validateConnectionPool();
            
            // 2. 重新建立连接
            rebuildConnections();
            
            // 3. 验证数据库可用性
            validateDatabaseAvailability();
        }
        
        private void validateConnectionPool() {
            if (dataSource instanceof HikariDataSource) {
                HikariDataSource hikariDS = (HikariDataSource) dataSource;
                HikariPoolMXBean poolBean = hikariDS.getHikariPoolMXBean();
                
                log.info("连接池状态: active={}, idle={}, waiting={}", 
                    poolBean.getActiveConnections(),
                    poolBean.getIdleConnections(),
                    poolBean.getThreadsAwaitingConnection());
                
                // 如果连接池耗尽，尝试清理无效连接
                if (poolBean.getIdleConnections() == 0) {
                    hikariDS.getHikariPoolMXBean().softEvictConnections();
                }
            }
        }
        
        private void rebuildConnections() {
            try (Connection connection = dataSource.getConnection()) {
                // 执行简单查询验证连接
                connection.prepareStatement("SELECT 1").executeQuery();
                log.info("数据库连接恢复成功");
            } catch (SQLException e) {
                log.error("数据库连接恢复失败", e);
                throw new DatabaseRecoveryException("数据库连接恢复失败", e);
            }
        }
    }
}
```

### 🎯 如何设计系统的容灾和降级策略？

**业务背景**：
设计多层次的容灾降级策略，在部分服务故障时保证核心业务可用，在极端情况下实现优雅降级。

**容灾降级架构设计**：

**1. 多级降级策略**
```java
@Component
public class DegradationManager {
    
    @Autowired
    private ServiceRegistry serviceRegistry;
    
    @Autowired
    private ConfigurationManager configManager;
    
    // 降级策略枚举
    public enum DegradationLevel {
        NORMAL(0, "正常服务"),
        LEVEL_1(1, "轻度降级"),
        LEVEL_2(2, "中度降级"), 
        LEVEL_3(3, "重度降级"),
        EMERGENCY(4, "紧急降级");
        
        private final int level;
        private final String description;
    }
    
    // 当前降级等级
    private volatile DegradationLevel currentLevel = DegradationLevel.NORMAL;
    
    // 降级决策
    public void evaluateAndApplyDegradation() {
        SystemHealthMetrics metrics = collectSystemMetrics();
        DegradationLevel targetLevel = decideDegradationLevel(metrics);
        
        if (targetLevel != currentLevel) {
            log.warn("系统降级等级变更: {} -> {}", currentLevel, targetLevel);
            applyDegradation(targetLevel);
            currentLevel = targetLevel;
        }
    }
    
    private DegradationLevel decideDegradationLevel(SystemHealthMetrics metrics) {
        // 基于多个指标的综合评分
        int score = 0;
        
        // CPU使用率评分 (0-25分)
        if (metrics.getCpuUsage() > 90) score += 25;
        else if (metrics.getCpuUsage() > 80) score += 15;
        else if (metrics.getCpuUsage() > 70) score += 5;
        
        // 内存使用率评分 (0-25分)
        if (metrics.getMemoryUsage() > 90) score += 25;
        else if (metrics.getMemoryUsage() > 80) score += 15;
        else if (metrics.getMemoryUsage() > 70) score += 5;
        
        // 错误率评分 (0-25分)
        if (metrics.getErrorRate() > 10) score += 25;
        else if (metrics.getErrorRate() > 5) score += 15;
        else if (metrics.getErrorRate() > 2) score += 5;
        
        // 响应时间评分 (0-25分)
        if (metrics.getAvgResponseTime() > 5000) score += 25;
        else if (metrics.getAvgResponseTime() > 3000) score += 15;
        else if (metrics.getAvgResponseTime() > 2000) score += 5;
        
        // 根据综合评分决定降级等级
        if (score >= 80) return DegradationLevel.EMERGENCY;
        if (score >= 60) return DegradationLevel.LEVEL_3;
        if (score >= 40) return DegradationLevel.LEVEL_2;
        if (score >= 20) return DegradationLevel.LEVEL_1;
        return DegradationLevel.NORMAL;
    }
    
    private void applyDegradation(DegradationLevel level) {
        switch (level) {
            case LEVEL_1:
                applyLevel1Degradation();
                break;
            case LEVEL_2:
                applyLevel2Degradation();
                break;
            case LEVEL_3:
                applyLevel3Degradation();
                break;
            case EMERGENCY:
                applyEmergencyDegradation();
                break;
            case NORMAL:
                restoreNormalService();
                break;
        }
    }
    
    private void applyLevel1Degradation() {
        // 轻度降级：关闭非核心功能
        configManager.updateConfig("feature.recommendation.enabled", false);
        configManager.updateConfig("feature.analytics.enabled", false);
        configManager.updateConfig("cache.ttl", "3600"); // 延长缓存时间
        
        log.info("已应用Level1降级策略：关闭推荐和分析功能");
    }
    
    private void applyLevel2Degradation() {
        // 中度降级：使用缓存数据，减少数据库访问
        configManager.updateConfig("service.user.cache_only", true);
        configManager.updateConfig("service.product.cache_only", true);
        configManager.updateConfig("batch.size", "50"); // 减少批处理大小
        
        log.info("已应用Level2降级策略：启用缓存模式");
    }
    
    private void applyLevel3Degradation() {
        // 重度降级：只保留核心业务
        configManager.updateConfig("service.search.enabled", false);
        configManager.updateConfig("service.review.enabled", false);
        configManager.updateConfig("service.notification.enabled", false);
        
        log.info("已应用Level3降级策略：只保留核心业务");
    }
    
    private void applyEmergencyDegradation() {
        // 紧急降级：返回静态页面
        configManager.updateConfig("system.emergency_mode", true);
        
        log.error("已应用紧急降级策略：系统进入应急模式");
    }
}

// 业务降级装饰器
@Component
public class ServiceDegradationDecorator {
    
    @Autowired
    private DegradationManager degradationManager;
    
    @Autowired
    private CacheManager cacheManager;
    
    // 用户服务降级
    public UserDTO getUserWithDegradation(Long userId) {
        DegradationLevel level = degradationManager.getCurrentLevel();
        
        switch (level) {
            case NORMAL:
                return userService.getUser(userId);
                
            case LEVEL_1:
            case LEVEL_2:
                // 优先从缓存获取
                UserDTO cachedUser = cacheManager.getUser(userId);
                if (cachedUser != null) {
                    return cachedUser;
                }
                // 缓存miss时降级到基础信息
                return userService.getUserBasicInfo(userId);
                
            case LEVEL_3:
            case EMERGENCY:
                // 返回默认用户信息
                return createDefaultUser(userId);
                
            default:
                throw new ServiceUnavailableException("用户服务不可用");
        }
    }
    
    // 商品搜索降级
    public SearchResult searchProductsWithDegradation(SearchRequest request) {
        DegradationLevel level = degradationManager.getCurrentLevel();
        
        switch (level) {
            case NORMAL:
                return searchService.searchProducts(request);
                
            case LEVEL_1:
                // 使用简化搜索算法
                return searchService.simpleSearch(request);
                
            case LEVEL_2:
                // 返回热门商品
                return searchService.getHotProducts(request.getCategory());
                
            case LEVEL_3:
            case EMERGENCY:
                // 返回静态推荐
                return getStaticRecommendations(request.getCategory());
                
            default:
                return SearchResult.empty();
        }
    }
}
```

**2. 熔断器模式实现**
```java
@Component
public class CustomCircuitBreaker {
    
    private volatile CircuitBreakerState state = CircuitBreakerState.CLOSED;
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private final AtomicInteger requestCount = new AtomicInteger(0);
    private volatile long lastFailureTime = 0;
    
    // 配置参数
    private final int failureThreshold = 5;      // 失败阈值
    private final int requestThreshold = 10;     // 请求阈值
    private final long timeout = 60000;          // 超时时间(ms)
    private final double failureRateThreshold = 0.5; // 失败率阈值
    
    public <T> T execute(Supplier<T> operation, Supplier<T> fallback) {
        if (state == CircuitBreakerState.OPEN) {
            if (System.currentTimeMillis() - lastFailureTime > timeout) {
                state = CircuitBreakerState.HALF_OPEN;
                log.info("熔断器进入半开状态");
            } else {
                log.warn("熔断器开启，执行降级逻辑");
                return fallback.get();
            }
        }
        
        try {
            T result = operation.get();
            onSuccess();
            return result;
        } catch (Exception e) {
            onFailure();
            return fallback.get();
        }
    }
    
    private void onSuccess() {
        if (state == CircuitBreakerState.HALF_OPEN) {
            state = CircuitBreakerState.CLOSED;
            failureCount.set(0);
            log.info("熔断器恢复到关闭状态");
        }
    }
    
    private void onFailure() {
        requestCount.incrementAndGet();
        int failures = failureCount.incrementAndGet();
        lastFailureTime = System.currentTimeMillis();
        
        if (shouldOpenCircuit()) {
            state = CircuitBreakerState.OPEN;
            log.warn("熔断器开启: failures={}, rate={}", 
                failures, calculateFailureRate());
        }
    }
    
    private boolean shouldOpenCircuit() {
        int requests = requestCount.get();
        int failures = failureCount.get();
        
        return requests >= requestThreshold && 
               failures >= failureThreshold &&
               calculateFailureRate() >= failureRateThreshold;
    }
    
    private double calculateFailureRate() {
        int requests = requestCount.get();
        int failures = failureCount.get();
        return requests > 0 ? (double) failures / requests : 0.0;
    }
    
    enum CircuitBreakerState {
        CLOSED, OPEN, HALF_OPEN
    }
}

// 限流器实现
@Component
public class RateLimiter {
    
    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();
    
    public boolean tryAcquire(String key, int permits, int capacity, int refillRate) {
        TokenBucket bucket = buckets.computeIfAbsent(key, 
            k -> new TokenBucket(capacity, refillRate));
        
        return bucket.tryConsume(permits);
    }
    
    private static class TokenBucket {
        private final int capacity;
        private final int refillRate;
        private volatile int tokens;
        private volatile long lastRefillTime;
        
        public TokenBucket(int capacity, int refillRate) {
            this.capacity = capacity;
            this.refillRate = refillRate;
            this.tokens = capacity;
            this.lastRefillTime = System.currentTimeMillis();
        }
        
        public synchronized boolean tryConsume(int permits) {
            refill();
            
            if (tokens >= permits) {
                tokens -= permits;
                return true;
            }
            return false;
        }
        
        private void refill() {
            long now = System.currentTimeMillis();
            long timePassed = now - lastRefillTime;
            
            if (timePassed > 0) {
                int tokensToAdd = (int) (timePassed / 1000.0 * refillRate);
                tokens = Math.min(capacity, tokens + tokensToAdd);
                lastRefillTime = now;
            }
        }
    }
}
```

---

## 🏗️ 六、架构设计与演进

> **核心思想**：架构设计是技术决策的艺术，需要在业务需求、技术约束、团队能力之间找到最佳平衡点，并具备持续演进能力。

### 🎯 如何进行系统架构的重构和演进？

**业务背景**：
将一个传统的单体电商系统逐步演进为微服务架构，需要制定详细的重构计划，保证业务连续性的同时完成架构升级。

**架构演进策略**：

**1. 演进式架构设计**
```java
// 架构演进规划器
@Component
public class ArchitectureEvolutionPlanner {
    
    // 领域划分分析
    public DomainAnalysisResult analyzeDomainBoundaries(MonolithApplication monolith) {
        
        // 1. 代码依赖分析
        CodeDependencyGraph dependencyGraph = analyzeCodeDependencies(monolith);
        
        // 2. 数据访问模式分析
        DataAccessPattern dataPattern = analyzeDataAccess(monolith);
        
        // 3. 业务功能聚合度分析
        BusinessCohesionAnalysis cohesionAnalysis = analyzeBusinessCohesion(monolith);
        
        // 4. 团队组织结构分析
        TeamStructureAnalysis teamAnalysis = analyzeTeamStructure();
        
        return DomainAnalysisResult.builder()
            .suggestedDomains(identifyDomainBoundaries(dependencyGraph, dataPattern))
            .migrationComplexity(calculateMigrationComplexity(cohesionAnalysis))
            .teamAlignment(teamAnalysis)
            .build();
    }
    
    // 分解策略生成
    public MigrationStrategy generateMigrationStrategy(DomainAnalysisResult analysis) {
        List<MigrationPhase> phases = new ArrayList<>();
        
        // Phase 1: 边界清晰的独立服务
        phases.add(MigrationPhase.builder()
            .phase(1)
            .description("拆分边界服务")
            .targetServices(Arrays.asList("user-service", "notification-service"))
            .estimatedTime("2-3个月")
            .risks("低")
            .benefits("验证微服务可行性，积累经验")
            .build());
            
        // Phase 2: 核心业务服务
        phases.add(MigrationPhase.builder()
            .phase(2)
            .description("拆分核心业务服务")
            .targetServices(Arrays.asList("product-service", "inventory-service"))
            .estimatedTime("3-4个月")
            .risks("中")
            .benefits("解耦核心业务逻辑")
            .build());
            
        // Phase 3: 复杂业务服务
        phases.add(MigrationPhase.builder()
            .phase(3)
            .description("拆分复杂业务服务")
            .targetServices(Arrays.asList("order-service", "payment-service"))
            .estimatedTime("4-6个月")
            .risks("高")
            .benefits("完成主要业务服务化")
            .build());
        
        return MigrationStrategy.builder()
            .phases(phases)
            .totalEstimatedTime("9-13个月")
            .rollbackStrategy(generateRollbackStrategy())
            .riskMitigationPlan(generateRiskMitigationPlan())
            .build();
    }
}

// 绞杀者模式实现
@Component
public class StranglerFigPattern {
    
    @Autowired
    private RoutingDecisionEngine routingEngine;
    
    @Autowired
    private LegacySystemProxy legacyProxy;
    
    @Autowired
    private NewServiceProxy newServiceProxy;
    
    // 渐进式路由切换
    @RequestMapping("/api/**")
    public ResponseEntity<?> routeRequest(HttpServletRequest request) {
        String path = request.getServletPath();
        
        // 路由决策
        RoutingDecision decision = routingEngine.decide(path, request);
        
        switch (decision.getTarget()) {
            case NEW_SERVICE:
                return forwardToNewService(request, decision);
            case LEGACY_SYSTEM:
                return forwardToLegacySystem(request, decision);
            case BOTH_WITH_COMPARISON:
                return executeWithComparison(request, decision);
            default:
                throw new UnsupportedOperationException("Unknown routing target");
        }
    }
    
    private ResponseEntity<?> executeWithComparison(HttpServletRequest request, 
                                                   RoutingDecision decision) {
        // 并行执行新老系统
        CompletableFuture<ResponseEntity<?>> legacyFuture = 
            CompletableFuture.supplyAsync(() -> forwardToLegacySystem(request, decision));
            
        CompletableFuture<ResponseEntity<?>> newServiceFuture = 
            CompletableFuture.supplyAsync(() -> forwardToNewService(request, decision));
        
        try {
            // 等待两个系统都返回结果
            ResponseEntity<?> legacyResponse = legacyFuture.get(5, TimeUnit.SECONDS);
            ResponseEntity<?> newServiceResponse = newServiceFuture.get(5, TimeUnit.SECONDS);
            
            // 比较结果
            ComparisonResult comparison = compareResponses(legacyResponse, newServiceResponse);
            recordComparisonResult(request.getServletPath(), comparison);
            
            // 根据配置决定返回哪个结果
            return decision.isReturnNewService() ? newServiceResponse : legacyResponse;
            
        } catch (Exception e) {
            log.error("并行执行失败，降级到老系统", e);
            return forwardToLegacySystem(request, decision);
        }
    }
}

// 数据迁移策略
@Component
public class DataMigrationStrategy {
    
    // 数据同步模式
    public enum SyncMode {
        DUAL_WRITE,      // 双写模式
        EVENT_SOURCING,  // 事件溯源
        CDC_REPLICATION  // 变更数据捕获
    }
    
    // 双写模式实现
    @Service
    public class DualWriteService {
        
        @Autowired
        private LegacyUserRepository legacyUserRepo;
        
        @Autowired
        private NewUserRepository newUserRepo;
        
        @Transactional
        public void createUser(User user) {
            try {
                // 写入老系统
                legacyUserRepo.save(user);
                
                // 写入新系统
                newUserRepo.save(user);
                
            } catch (Exception e) {
                log.error("双写失败，用户创建回滚", e);
                throw e;
            }
        }
        
        // 数据一致性校验
        @Scheduled(fixedRate = 3600000) // 每小时执行
        public void verifyDataConsistency() {
            List<Long> userIds = legacyUserRepo.findAllUserIds();
            
            for (Long userId : userIds) {
                User legacyUser = legacyUserRepo.findById(userId);
                User newUser = newUserRepo.findById(userId);
                
                if (!isDataConsistent(legacyUser, newUser)) {
                    DataInconsistencyEvent event = DataInconsistencyEvent.builder()
                        .userId(userId)
                        .legacyData(legacyUser)
                        .newData(newUser)
                        .timestamp(System.currentTimeMillis())
                        .build();
                    
                    handleDataInconsistency(event);
                }
            }
        }
    }
    
    // CDC变更数据捕获
    @Component
    public class ChangeDataCapture {
        
        @EventListener
        public void handleDatabaseChangeEvent(DatabaseChangeEvent event) {
            switch (event.getOperation()) {
                case INSERT:
                    syncInsertToNewSystem(event);
                    break;
                case UPDATE:
                    syncUpdateToNewSystem(event);
                    break;
                case DELETE:
                    syncDeleteToNewSystem(event);
                    break;
            }
        }
        
        private void syncInsertToNewSystem(DatabaseChangeEvent event) {
            try {
                Object newEntity = convertToNewFormat(event.getData());
                newUserRepo.save(newEntity);
                
                log.info("CDC同步插入成功: id={}", event.getEntityId());
                
            } catch (Exception e) {
                log.error("CDC同步插入失败: id={}", event.getEntityId(), e);
                
                // 记录失败事件，后续重试
                recordSyncFailure(event, e);
            }
        }
    }
}
```

**2. 技术债务管理**
```java
@Component
public class TechnicalDebtManager {
    
    // 技术债务评估
    public TechnicalDebtAssessment assessTechnicalDebt(CodebaseAnalysis codebase) {
        
        Map<DebtCategory, DebtMetrics> debtByCategory = new HashMap<>();
        
        // 代码质量债务
        DebtMetrics codeQualityDebt = assessCodeQuality(codebase);
        debtByCategory.put(DebtCategory.CODE_QUALITY, codeQualityDebt);
        
        // 架构债务
        DebtMetrics architectureDebt = assessArchitecture(codebase);
        debtByCategory.put(DebtCategory.ARCHITECTURE, architectureDebt);
        
        // 测试债务
        DebtMetrics testDebt = assessTestCoverage(codebase);
        debtByCategory.put(DebtCategory.TEST_COVERAGE, testDebt);
        
        // 文档债务
        DebtMetrics documentationDebt = assessDocumentation(codebase);
        debtByCategory.put(DebtCategory.DOCUMENTATION, documentationDebt);
        
        // 性能债务
        DebtMetrics performanceDebt = assessPerformance(codebase);
        debtByCategory.put(DebtCategory.PERFORMANCE, performanceDebt);
        
        return TechnicalDebtAssessment.builder()
            .debtByCategory(debtByCategory)
            .totalDebtScore(calculateTotalDebtScore(debtByCategory))
            .prioritizedActions(generatePrioritizedActions(debtByCategory))
            .build();
    }
    
    private DebtMetrics assessCodeQuality(CodebaseAnalysis codebase) {
        return DebtMetrics.builder()
            .score(calculateCodeQualityScore(codebase))
            .issues(Arrays.asList(
                "圈复杂度过高的方法: 15个",
                "代码重复度: 12%",
                "超长方法: 8个",
                "命名不规范: 23处"
            ))
            .estimatedFixTime("40人日")
            .businessImpact("中等")
            .build();
    }
    
    private DebtMetrics assessArchitecture(CodebaseAnalysis codebase) {
        return DebtMetrics.builder()
            .score(calculateArchitectureScore(codebase))
            .issues(Arrays.asList(
                "循环依赖: 3处",
                "违反DIP原则: 12处",
                "紧耦合模块: 5个",
                "架构异味: 8处"
            ))
            .estimatedFixTime("120人日")
            .businessImpact("高")
            .build();
    }
    
    // 债务偿还计划
    public DebtRepaymentPlan createRepaymentPlan(TechnicalDebtAssessment assessment) {
        List<DebtRepaymentTask> tasks = new ArrayList<>();
        
        // 按优先级排序债务
        List<PrioritizedDebt> prioritizedDebts = prioritizeDebts(assessment);
        
        for (PrioritizedDebt debt : prioritizedDebts) {
            DebtRepaymentTask task = DebtRepaymentTask.builder()
                .category(debt.getCategory())
                .description(debt.getDescription())
                .priority(debt.getPriority())
                .estimatedEffort(debt.getEstimatedEffort())
                .businessValue(debt.getBusinessValue())
                .prerequisites(debt.getPrerequisites())
                .risks(debt.getRisks())
                .build();
                
            tasks.add(task);
        }
        
        return DebtRepaymentPlan.builder()
            .tasks(tasks)
            .totalEstimatedTime(calculateTotalTime(tasks))
            .quarterlyMilestones(generateQuarterlyMilestones(tasks))
            .successMetrics(defineSuccessMetrics())
            .build();
    }
    
    // 债务监控
    @Scheduled(fixedRate = 86400000) // 每天执行
    public void monitorTechnicalDebt() {
        CodebaseAnalysis currentCodebase = analyzeCurrentCodebase();
        TechnicalDebtAssessment currentAssessment = assessTechnicalDebt(currentCodebase);
        
        // 与历史数据比较
        TechnicalDebtTrend trend = comparWithHistoricalData(currentAssessment);
        
        if (trend.isWorsening()) {
            sendDebtAlert(trend);
        }
        
        // 更新债务仪表板
        updateDebtDashboard(currentAssessment, trend);
    }
}

// 重构工具集
@Component
public class RefactoringToolkit {
    
    // 自动化重构建议
    public List<RefactoringRecommendation> analyzeRefactoringOpportunities(Class<?> targetClass) {
        List<RefactoringRecommendation> recommendations = new ArrayList<>();
        
        // 分析方法过长
        Method[] methods = targetClass.getDeclaredMethods();
        for (Method method : methods) {
            if (isMethodTooLong(method)) {
                recommendations.add(RefactoringRecommendation.builder()
                    .type(RefactoringType.EXTRACT_METHOD)
                    .target(method.getName())
                    .reason("方法行数过多，建议提取子方法")
                    .confidence(0.8)
                    .estimatedEffort("2小时")
                    .build());
            }
        }
        
        // 分析类职责过多
        if (hasMultipleResponsibilities(targetClass)) {
            recommendations.add(RefactoringRecommendation.builder()
                .type(RefactoringType.SPLIT_CLASS)
                .target(targetClass.getSimpleName())
                .reason("类承担多个职责，建议拆分")
                .confidence(0.7)
                .estimatedEffort("1天")
                .build());
        }
        
        // 分析重复代码
        List<CodeDuplication> duplications = findCodeDuplications(targetClass);
        for (CodeDuplication duplication : duplications) {
            recommendations.add(RefactoringRecommendation.builder()
                .type(RefactoringType.EXTRACT_COMMON_METHOD)
                .target(duplication.getLocation())
                .reason("发现重复代码，建议提取公共方法")
                .confidence(0.9)
                .estimatedEffort("1小时")
                .build());
        }
        
        return recommendations;
    }
    
    // 重构安全检查
    public RefactoringSafetyCheck checkRefactoringSafety(RefactoringPlan plan) {
        List<SafetyRisk> risks = new ArrayList<>();
        
        // 检查测试覆盖率
        if (getTestCoverage(plan.getTargetCode()) < 80) {
            risks.add(SafetyRisk.builder()
                .level(RiskLevel.HIGH)
                .description("测试覆盖率不足80%，重构风险较高")
                .mitigation("增加单元测试覆盖率至80%以上")
                .build());
        }
        
        // 检查依赖关系
        List<String> dependentModules = findDependentModules(plan.getTargetCode());
        if (dependentModules.size() > 5) {
            risks.add(SafetyRisk.builder()
                .level(RiskLevel.MEDIUM)
                .description("依赖模块过多，可能影响范围较大")
                .mitigation("分阶段重构，逐步解耦依赖关系")
                .build());
        }
        
        return RefactoringSafetyCheck.builder()
            .isRefactoringSafe(risks.stream().noneMatch(r -> r.getLevel() == RiskLevel.HIGH))
            .risks(risks)
            .recommendations(generateSafetyRecommendations(risks))
            .build();
    }
}
```

---

## 💼 八、线上问题诊断与处理

> **核心思想**：线上问题处理是检验工程师实力的试金石，需要具备系统化的排查思路、丰富的工具经验和快速的应急响应能力。

### 🎯 如何快速定位和解决线上性能问题？

**业务背景**：
生产环境突然出现接口响应时间增长、CPU使用率飙升、内存泄漏等问题，需要快速定位根因并解决。

**问题诊断方法论**：

**1. 系统化排查流程**
```java
@Service
public class ProductionIssueHandler {
    
    @Autowired
    private MonitoringService monitoringService;
    
    @Autowired
    private LogAnalysisService logAnalysisService;
    
    @Autowired
    private PerformanceProfiler performanceProfiler;
    
    // 问题诊断主流程
    public IssueAnalysisReport diagnoseProductionIssue(IssueReport issue) {
        log.info("开始诊断生产问题: {}", issue.getDescription());
        
        // 1. 收集系统快照
        SystemSnapshot snapshot = captureSystemSnapshot();
        
        // 2. 分析问题类型
        IssueType issueType = classifyIssue(issue, snapshot);
        
        // 3. 执行针对性诊断
        DiagnosisResult diagnosis = executeDiagnosis(issueType, snapshot);
        
        // 4. 生成分析报告
        return IssueAnalysisReport.builder()
            .issueId(issue.getId())
            .issueType(issueType)
            .systemSnapshot(snapshot)
            .diagnosis(diagnosis)
            .recommendedActions(generateRecommendations(diagnosis))
            .urgencyLevel(assessUrgency(diagnosis))
            .build();
    }
    
    private SystemSnapshot captureSystemSnapshot() {
        return SystemSnapshot.builder()
            .timestamp(System.currentTimeMillis())
            // JVM指标
            .heapMemoryUsage(getHeapMemoryUsage())
            .nonHeapMemoryUsage(getNonHeapMemoryUsage())
            .gcMetrics(getGcMetrics())
            .threadInfo(getThreadInfo())
            
            // 系统指标
            .cpuUsage(getCpuUsage())
            .loadAverage(getLoadAverage())
            .diskUsage(getDiskUsage())
            .networkTraffic(getNetworkTraffic())
            
            // 应用指标
            .activeConnections(getActiveConnections())
            .queueSizes(getQueueSizes())
            .cacheHitRates(getCacheHitRates())
            .errorRates(getErrorRates())
            
            // 业务指标
            .throughput(getThroughput())
            .responseTime(getResponseTime())
            .activeUsers(getActiveUsers())
            .build();
    }
    
    private IssueType classifyIssue(IssueReport issue, SystemSnapshot snapshot) {
        // 基于多个维度分类问题
        
        // CPU相关问题
        if (snapshot.getCpuUsage() > 80) {
            return IssueType.HIGH_CPU_USAGE;
        }
        
        // 内存相关问题
        if (snapshot.getHeapMemoryUsage().getUsed() / snapshot.getHeapMemoryUsage().getMax() > 0.9) {
            return IssueType.MEMORY_PRESSURE;
        }
        
        // 线程相关问题
        if (snapshot.getThreadInfo().getDeadlockedThreads() > 0) {
            return IssueType.DEADLOCK;
        }
        
        // 响应时间问题
        if (snapshot.getResponseTime() > 5000) {
            return IssueType.SLOW_RESPONSE;
        }
        
        // 错误率问题
        if (snapshot.getErrorRates().values().stream().anyMatch(rate -> rate > 5.0)) {
            return IssueType.HIGH_ERROR_RATE;
        }
        
        return IssueType.UNKNOWN;
    }
}

// CPU问题诊断器
@Component
public class CpuIssueAnalyzer {
    
    public CpuAnalysisResult analyzeCpuIssue(SystemSnapshot snapshot) {
        
        // 1. 线程CPU使用分析
        List<ThreadCpuInfo> threadCpuInfo = analyzeThreadCpuUsage();
        
        // 2. 方法热点分析
        List<MethodHotspot> methodHotspots = analyzeMethodHotspots();
        
        // 3. GC影响分析
        GcImpactAnalysis gcImpact = analyzeGcImpact(snapshot.getGcMetrics());
        
        // 4. 代码热点定位
        List<CodeHotspot> codeHotspots = locateCodeHotspots();
        
        return CpuAnalysisResult.builder()
            .topCpuConsumingThreads(threadCpuInfo.subList(0, Math.min(10, threadCpuInfo.size())))
            .methodHotspots(methodHotspots)
            .gcImpact(gcImpact)
            .codeHotspots(codeHotspots)
            .rootCause(identifyRootCause(threadCpuInfo, methodHotspots, gcImpact))
            .build();
    }
    
    private List<ThreadCpuInfo> analyzeThreadCpuUsage() {
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        
        long[] threadIds = threadBean.getAllThreadIds();
        List<ThreadCpuInfo> threadInfos = new ArrayList<>();
        
        for (long threadId : threadIds) {
            ThreadInfo threadInfo = threadBean.getThreadInfo(threadId);
            if (threadInfo != null) {
                long cpuTime = threadBean.getThreadCpuTime(threadId);
                
                threadInfos.add(ThreadCpuInfo.builder()
                    .threadId(threadId)
                    .threadName(threadInfo.getThreadName())
                    .cpuTime(cpuTime)
                    .state(threadInfo.getThreadState())
                    .stackTrace(Arrays.asList(threadInfo.getStackTrace()))
                    .build());
            }
        }
        
        // 按CPU时间排序
        return threadInfos.stream()
            .sorted((t1, t2) -> Long.compare(t2.getCpuTime(), t1.getCpuTime()))
            .collect(Collectors.toList());
    }
    
    private String identifyRootCause(List<ThreadCpuInfo> threadInfo, 
                                   List<MethodHotspot> methodHotspots,
                                   GcImpactAnalysis gcImpact) {
        
        // 分析CPU消耗的主要原因
        StringBuilder rootCause = new StringBuilder();
        
        // 检查是否为GC导致
        if (gcImpact.getGcCpuPercentage() > 30) {
            rootCause.append("主要原因：GC开销过大，占用CPU ").append(gcImpact.getGcCpuPercentage()).append("%\n");
            rootCause.append("建议：检查内存使用，优化GC参数或增加堆内存\n");
        }
        
        // 检查热点方法
        if (!methodHotspots.isEmpty()) {
            MethodHotspot topHotspot = methodHotspots.get(0);
            if (topHotspot.getCpuPercentage() > 20) {
                rootCause.append("热点方法：").append(topHotspot.getMethodName())
                         .append(" 占用CPU ").append(topHotspot.getCpuPercentage()).append("%\n");
                rootCause.append("建议：优化该方法的算法复杂度或减少调用频率\n");
            }
        }
        
        // 检查线程竞争
        long blockedThreads = threadInfo.stream()
            .filter(t -> t.getState() == Thread.State.BLOCKED)
            .count();
        
        if (blockedThreads > threadInfo.size() * 0.3) {
            rootCause.append("线程竞争：").append(blockedThreads).append("个线程处于阻塞状态\n");
            rootCause.append("建议：检查锁竞争，优化同步机制\n");
        }
        
        return rootCause.toString();
    }
}

// 内存问题诊断器
@Component  
public class MemoryIssueAnalyzer {
    
    public MemoryAnalysisResult analyzeMemoryIssue(SystemSnapshot snapshot) {
        
        // 1. 堆内存分析
        HeapAnalysis heapAnalysis = analyzeHeapMemory(snapshot.getHeapMemoryUsage());
        
        // 2. 非堆内存分析
        NonHeapAnalysis nonHeapAnalysis = analyzeNonHeapMemory(snapshot.getNonHeapMemoryUsage());
        
        // 3. 内存泄漏检测
        MemoryLeakDetection leakDetection = detectMemoryLeaks();
        
        // 4. 大对象分析
        LargeObjectAnalysis largeObjectAnalysis = analyzeLargeObjects();
        
        // 5. GC效率分析
        GcEfficiencyAnalysis gcEfficiency = analyzeGcEfficiency(snapshot.getGcMetrics());
        
        return MemoryAnalysisResult.builder()
            .heapAnalysis(heapAnalysis)
            .nonHeapAnalysis(nonHeapAnalysis)
            .leakDetection(leakDetection)
            .largeObjectAnalysis(largeObjectAnalysis)
            .gcEfficiency(gcEfficiency)
            .recommendedActions(generateMemoryOptimizationActions())
            .build();
    }
    
    private MemoryLeakDetection detectMemoryLeaks() {
        // 使用堆转储分析内存泄漏
        try {
            // 生成堆转储
            String heapDumpPath = generateHeapDump();
            
            // 分析堆转储
            HeapDumpAnalysis analysis = analyzeHeapDump(heapDumpPath);
            
            // 检测疑似泄漏对象
            List<SuspiciousObject> suspiciousObjects = findSuspiciousObjects(analysis);
            
            return MemoryLeakDetection.builder()
                .heapDumpPath(heapDumpPath)
                .suspiciousObjects(suspiciousObjects)
                .leakProbability(calculateLeakProbability(suspiciousObjects))
                .build();
                
        } catch (Exception e) {
            log.error("内存泄漏检测失败", e);
            return MemoryLeakDetection.builder()
                .error("内存泄漏检测失败: " + e.getMessage())
                .build();
        }
    }
    
    private List<SuspiciousObject> findSuspiciousObjects(HeapDumpAnalysis analysis) {
        List<SuspiciousObject> suspicious = new ArrayList<>();
        
        // 查找占用内存过大的对象
        for (ObjectInfo obj : analysis.getLargeObjects()) {
            if (obj.getSize() > 100 * 1024 * 1024) { // 100MB
                suspicious.add(SuspiciousObject.builder()
                    .className(obj.getClassName())
                    .size(obj.getSize())
                    .instanceCount(obj.getInstanceCount())
                    .suspicionReason("单个对象占用内存超过100MB")
                    .build());
            }
        }
        
        // 查找实例数量异常的对象
        for (ObjectInfo obj : analysis.getObjectsByCount()) {
            if (obj.getInstanceCount() > 1000000) { // 100万实例
                suspicious.add(SuspiciousObject.builder()
                    .className(obj.getClassName())
                    .size(obj.getSize())
                    .instanceCount(obj.getInstanceCount())
                    .suspicionReason("对象实例数量超过100万")
                    .build());
            }
        }
        
        return suspicious;
    }
}
```

**2. 应急响应处理**
```java
@Component
public class EmergencyResponseHandler {
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private AutoRecoveryService autoRecoveryService;
    
    @Autowired
    private IncidentCommandCenter incidentCommandCenter;
    
    // 紧急响应流程
    @EventListener
    public void handleCriticalIncident(CriticalIncidentEvent event) {
        log.error("检测到严重生产事故: {}", event.getDescription());
        
        try {
            // 1. 立即响应
            executeImmediateResponse(event);
            
            // 2. 成立应急小组
            IncidentResponse response = incidentCommandCenter.activateIncidentResponse(event);
            
            // 3. 执行止损措施
            executeDamageControlMeasures(event);
            
            // 4. 开始根因分析
            startRootCauseAnalysis(event);
            
            // 5. 持续监控
            continuousMonitoring(event);
            
        } catch (Exception e) {
            log.error("应急响应执行失败", e);
            escalateToHigherLevel(event, e);
        }
    }
    
    private void executeImmediateResponse(CriticalIncidentEvent event) {
        switch (event.getType()) {
            case HIGH_ERROR_RATE:
                // 高错误率：启用熔断器
                circuitBreakerRegistry.getAllCircuitBreakers()
                    .forEach(CircuitBreaker::transitionToOpenState);
                break;
                
            case MEMORY_LEAK:
                // 内存泄漏：重启受影响的实例
                autoRecoveryService.restartAffectedInstances(event.getAffectedServices());
                break;
                
            case DATABASE_CONNECTION_POOL_EXHAUSTED:
                // 连接池耗尽：清理无效连接
                databaseConnectionManager.evictInvalidConnections();
                break;
                
            case DISK_SPACE_FULL:
                // 磁盘空间不足：清理临时文件和日志
                diskSpaceManager.emergencyCleanup();
                break;
        }
    }
    
    private void executeDamageControlMeasures(CriticalIncidentEvent event) {
        List<DamageControlAction> actions = determineDamageControlActions(event);
        
        for (DamageControlAction action : actions) {
            try {
                executeDamageControlAction(action);
                log.info("止损措施执行成功: {}", action.getDescription());
            } catch (Exception e) {
                log.error("止损措施执行失败: {}", action.getDescription(), e);
            }
        }
    }
    
    private List<DamageControlAction> determineDamageControlActions(CriticalIncidentEvent event) {
        List<DamageControlAction> actions = new ArrayList<>();
        
        // 根据事故严重程度决定止损措施
        switch (event.getSeverity()) {
            case P0: // 最高级别
                actions.add(DamageControlAction.builder()
                    .type(ActionType.TRAFFIC_DIVERSION)
                    .description("将流量切换到备用集群")
                    .priority(1)
                    .build());
                    
                actions.add(DamageControlAction.builder()
                    .type(ActionType.SYSTEM_DEGRADATION)
                    .description("启用紧急降级模式")
                    .priority(2)
                    .build());
                break;
                
            case P1: // 高优先级
                actions.add(DamageControlAction.builder()
                    .type(ActionType.CIRCUIT_BREAKER)
                    .description("启用服务熔断")
                    .priority(1)
                    .build());
                break;
        }
        
        return actions;
    }
    
    // 故障复盘分析
    public PostIncidentReport conductPostIncidentReview(String incidentId) {
        IncidentRecord incident = incidentRepository.findById(incidentId);
        
        // 1. 时间线重建
        List<IncidentTimeline> timeline = reconstructTimeline(incident);
        
        // 2. 根因分析
        RootCauseAnalysis rootCause = conductRootCauseAnalysis(incident);
        
        // 3. 影响评估
        ImpactAssessment impact = assessIncidentImpact(incident);
        
        // 4. 响应效果评估
        ResponseEffectivenessAssessment responseAssessment = assessResponseEffectiveness(incident);
        
        // 5. 改进建议
        List<ImprovementRecommendation> improvements = generateImprovements(incident, rootCause);
        
        return PostIncidentReport.builder()
            .incidentId(incidentId)
            .timeline(timeline)
            .rootCause(rootCause)
            .impact(impact)
            .responseAssessment(responseAssessment)
            .improvements(improvements)
            .lessonsLearned(extractLessonsLearned(incident))
            .build();
    }
    
    private RootCauseAnalysis conductRootCauseAnalysis(IncidentRecord incident) {
        return RootCauseAnalysis.builder()
            .primaryCause(identifyPrimaryCause(incident))
            .contributingFactors(identifyContributingFactors(incident))
            .whyAnalysis(conductFiveWhyAnalysis(incident))
            .preventionMeasures(identifyPreventionMeasures(incident))
            .build();
    }
    
    private List<String> conductFiveWhyAnalysis(IncidentRecord incident) {
        List<String> whyAnalysis = new ArrayList<>();
        
        whyAnalysis.add("为什么发生服务响应缓慢？");
        whyAnalysis.add("因为数据库查询超时");
        
        whyAnalysis.add("为什么数据库查询超时？");
        whyAnalysis.add("因为数据库连接池耗尽");
        
        whyAnalysis.add("为什么连接池耗尽？");
        whyAnalysis.add("因为有慢查询占用连接过长时间");
        
        whyAnalysis.add("为什么有慢查询？");
        whyAnalysis.add("因为缺少必要的数据库索引");
        
        whyAnalysis.add("为什么缺少索引？");
        whyAnalysis.add("因为代码审查流程中没有DBA参与");
        
        return whyAnalysis;
    }
}

// 故障预防系统
@Component
public class FailurePreventionSystem {
    
    // 混沌工程实践
    @Component
    public class ChaosEngineeringService {
        
        // 网络延迟注入
        public void injectNetworkLatency(String serviceName, int latencyMs, Duration duration) {
            log.info("对服务{}注入网络延迟{}ms，持续时间{}", serviceName, latencyMs, duration);
            
            // 使用代理或iptables规则注入延迟
            NetworkLatencyInjector.inject(serviceName, latencyMs, duration);
            
            // 监控系统响应
            monitorSystemResponse(serviceName, duration);
        }
        
        // 内存压力测试
        public void injectMemoryPressure(String serviceName, double memoryPressurePercent, Duration duration) {
            log.info("对服务{}注入内存压力{}%，持续时间{}", serviceName, memoryPressurePercent, duration);
            
            // 分配内存造成压力
            MemoryPressureInjector.inject(serviceName, memoryPressurePercent, duration);
            
            // 观察GC和性能表现
            observeGcBehavior(serviceName, duration);
        }
        
        // CPU高负载测试
        public void injectCpuLoad(String serviceName, double cpuLoadPercent, Duration duration) {
            log.info("对服务{}注入CPU负载{}%，持续时间{}", serviceName, cpuLoadPercent, duration);
            
            CpuLoadInjector.inject(serviceName, cpuLoadPercent, duration);
            observeSystemStability(serviceName, duration);
        }
    }
    
    // 容量规划
    @Service
    public class CapacityPlanningService {
        
        public CapacityPlan generateCapacityPlan(String serviceName, int planningHorizonMonths) {
            // 1. 收集历史数据
            HistoricalMetrics metrics = collectHistoricalMetrics(serviceName, planningHorizonMonths);
            
            // 2. 分析增长趋势
            GrowthTrend trend = analyzeGrowthTrend(metrics);
            
            // 3. 预测未来容量需求
            CapacityForecast forecast = forecastCapacityNeeds(trend, planningHorizonMonths);
            
            // 4. 生成扩容建议
            List<ScalingRecommendation> recommendations = generateScalingRecommendations(forecast);
            
            return CapacityPlan.builder()
                .serviceName(serviceName)
                .currentCapacity(getCurrentCapacity(serviceName))
                .forecast(forecast)
                .recommendations(recommendations)
                .riskAssessment(assessCapacityRisks(forecast))
                .build();
        }
        
        private CapacityForecast forecastCapacityNeeds(GrowthTrend trend, int months) {
            // 使用线性回归或机器学习模型预测
            double currentQps = trend.getCurrentQps();
            double monthlyGrowthRate = trend.getMonthlyGrowthRate();
            
            List<MonthlyCapacityNeeds> monthlyNeeds = new ArrayList<>();
            for (int month = 1; month <= months; month++) {
                double predictedQps = currentQps * Math.pow(1 + monthlyGrowthRate, month);
                
                MonthlyCapacityNeeds needs = MonthlyCapacityNeeds.builder()
                    .month(month)
                    .predictedQps(predictedQps)
                    .requiredCpuCores(calculateRequiredCpu(predictedQps))
                    .requiredMemoryGb(calculateRequiredMemory(predictedQps))
                    .requiredInstances(calculateRequiredInstances(predictedQps))
                    .build();
                    
                monthlyNeeds.add(needs);
            }
            
            return CapacityForecast.builder()
                .monthlyNeeds(monthlyNeeds)
                .peakCapacityNeeds(calculatePeakCapacityNeeds(monthlyNeeds))
                .confidenceLevel(0.85)
                .build();
        }
    }
}
```

---

## 🎯 九、经典系统设计

> **核心思想**：经典系统设计是面试中的重点考察内容，主要测试候选人的系统架构能力、技术选型思维和工程实践经验。

### 🎯 如何设计一个高性能的短链系统？

**业务背景**：
设计一个类似bit.ly的短链系统，支持长URL转短URL，短URL重定向到长URL，要求支持每日10亿次转换请求，99.9%可用性，响应时间<100ms。

**系统设计思路**：

**1. 需求分析**
```
功能需求：
- 长URL转短URL
- 短URL重定向
- 自定义短链
- 链接有效期设置
- 访问统计

非功能需求：
- 高并发：10亿/天 ≈ 11.6万QPS
- 高可用：99.9%
- 低延迟：<100ms
- 数据持久化：永久存储
```

**2. 短链生成算法**
```java
@Service
public class ShortUrlService {
    
    private static final String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int SHORT_URL_LENGTH = 7; // 62^7 ≈ 3.5万亿
    
    @Autowired
    private SnowflakeIdGenerator idGenerator;
    
    @Autowired
    private BloomFilter<String> bloomFilter;
    
    /**
     * 方案1：基于自增ID + Base62编码
     */
    public String generateShortUrl(String longUrl) {
        // 检查是否已存在
        String existingShortUrl = urlMappingService.getShortUrl(longUrl);
        if (existingShortUrl != null) {
            return existingShortUrl;
        }
        
        // 生成全局唯一ID
        long id = idGenerator.nextId();
        String shortUrl = base62Encode(id);
        
        // 保存映射关系
        UrlMapping mapping = UrlMapping.builder()
            .id(id)
            .longUrl(longUrl)
            .shortUrl(shortUrl)
            .createTime(System.currentTimeMillis())
            .expireTime(getDefaultExpireTime())
            .build();
        
        urlMappingService.save(mapping);
        
        // 添加到布隆过滤器
        bloomFilter.put(shortUrl);
        
        return shortUrl;
    }
    
    /**
     * 方案2：基于Hash + 冲突处理
     */
    public String generateShortUrlByHash(String longUrl) {
        String shortUrl = null;
        int attempt = 0;
        final int maxAttempts = 5;
        
        while (attempt < maxAttempts) {
            // 使用MurmurHash3
            String input = longUrl + attempt;
            long hash = MurmurHash3.hash64(input.getBytes());
            shortUrl = base62Encode(Math.abs(hash)).substring(0, SHORT_URL_LENGTH);
            
            // 检查冲突
            if (!bloomFilter.mightContain(shortUrl)) {
                // 大概率不存在，进行数据库检查
                if (!urlMappingService.exists(shortUrl)) {
                    break;
                }
            }
            attempt++;
        }
        
        if (attempt == maxAttempts) {
            // 降级为方案1
            return generateShortUrl(longUrl);
        }
        
        return shortUrl;
    }
    
    private String base62Encode(long num) {
        if (num == 0) return "0";
        
        StringBuilder sb = new StringBuilder();
        while (num > 0) {
            sb.append(BASE62_CHARS.charAt((int) (num % 62)));
            num /= 62;
        }
        return sb.reverse().toString();
    }
}
```

**3. 数据存储设计**
```sql
-- URL映射表（主表）
CREATE TABLE url_mapping (
    id BIGINT PRIMARY KEY,
    short_url VARCHAR(10) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    create_time BIGINT NOT NULL,
    expire_time BIGINT,
    click_count BIGINT DEFAULT 0,
    creator_id BIGINT,
    status TINYINT DEFAULT 1,
    INDEX idx_short_url (short_url),
    INDEX idx_long_url_hash (long_url(100)),
    INDEX idx_creator_time (creator_id, create_time)
) ENGINE=InnoDB;

-- 访问统计表
CREATE TABLE url_statistics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_url VARCHAR(10) NOT NULL,
    access_date DATE NOT NULL,
    click_count BIGINT DEFAULT 0,
    unique_visitors BIGINT DEFAULT 0,
    UNIQUE KEY uk_url_date (short_url, access_date)
) ENGINE=InnoDB;
```

**4. 缓存架构设计**
```java
@Service
public class UrlCacheService {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Autowired
    private Cache<String, String> localCache;
    
    private static final String CACHE_PREFIX = "short_url:";
    private static final int CACHE_TTL = 3600; // 1小时
    
    public String getLongUrl(String shortUrl) {
        // L1缓存：本地缓存
        String longUrl = localCache.getIfPresent(shortUrl);
        if (longUrl != null) {
            return longUrl;
        }
        
        // L2缓存：Redis
        String cacheKey = CACHE_PREFIX + shortUrl;
        longUrl = redisTemplate.opsForValue().get(cacheKey);
        if (longUrl != null) {
            localCache.put(shortUrl, longUrl);
            return longUrl;
        }
        
        // L3存储：数据库
        UrlMapping mapping = urlMappingService.getByShortUrl(shortUrl);
        if (mapping != null && !isExpired(mapping)) {
            longUrl = mapping.getLongUrl();
            
            // 回写缓存
            redisTemplate.opsForValue().set(cacheKey, longUrl, CACHE_TTL, TimeUnit.SECONDS);
            localCache.put(shortUrl, longUrl);
            
            return longUrl;
        }
        
        return null;
    }
    
    public void preloadHotUrls() {
        // 预热热点短链
        List<String> hotUrls = urlMappingService.getHotUrls(1000);
        
        hotUrls.parallelStream().forEach(shortUrl -> {
            UrlMapping mapping = urlMappingService.getByShortUrl(shortUrl);
            if (mapping != null) {
                String cacheKey = CACHE_PREFIX + shortUrl;
                redisTemplate.opsForValue().set(cacheKey, mapping.getLongUrl(), 
                    CACHE_TTL * 2, TimeUnit.SECONDS); // 热点数据TTL更长
            }
        });
    }
}
```

**5. 重定向服务**
```java
@RestController
public class RedirectController {
    
    @Autowired
    private UrlCacheService urlCacheService;
    
    @Autowired
    private UrlStatisticsService statisticsService;
    
    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(
            @PathVariable String shortUrl,
            HttpServletRequest request) {
        
        // 参数校验
        if (!isValidShortUrl(shortUrl)) {
            return ResponseEntity.notFound().build();
        }
        
        // 获取长链接
        String longUrl = urlCacheService.getLongUrl(shortUrl);
        if (longUrl == null) {
            return ResponseEntity.notFound().build();
        }
        
        // 异步统计访问
        CompletableFuture.runAsync(() -> {
            statisticsService.recordAccess(shortUrl, request);
        });
        
        // 302重定向
        return ResponseEntity.status(HttpStatus.FOUND)
            .location(URI.create(longUrl))
            .build();
    }
    
    private boolean isValidShortUrl(String shortUrl) {
        return shortUrl != null 
            && shortUrl.length() <= 10
            && shortUrl.matches("[0-9A-Za-z]+");
    }
}
```

### 🎯 如何设计一个IM即时通讯系统？

**业务背景**：
设计一个支持千万级用户的IM系统，包括单聊、群聊、离线消息、消息推送等功能，要求低延迟(<200ms)、高可用、消息可靠传递。

**系统架构设计**：

**1. 整体架构**
```
客户端 → 网关层 → 连接服务 → 消息服务 → 存储层
   ↓       ↓       ↓        ↓        ↓
 WebSocket  LB   长连接管理  消息路由   MySQL/Redis
```

**2. 长连接管理**
```java
@Component
public class ConnectionManager {
    
    // 用户连接映射 userId -> WebSocketSession
    private final ConcurrentHashMap<Long, WebSocketSession> userConnections = new ConcurrentHashMap<>();
    
    // 连接元数据
    private final ConcurrentHashMap<String, ConnectionMetadata> connectionMetadata = new ConcurrentHashMap<>();
    
    @EventListener
    public void handleWebSocketConnect(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        Long userId = getUserIdFromToken(headerAccessor.getFirstNativeHeader("token"));
        
        if (userId != null) {
            WebSocketSession session = event.getWebSocketSession();
            userConnections.put(userId, session);
            
            ConnectionMetadata metadata = ConnectionMetadata.builder()
                .userId(userId)
                .sessionId(sessionId)
                .connectTime(System.currentTimeMillis())
                .serverId(getServerId())
                .build();
            
            connectionMetadata.put(sessionId, metadata);
            
            // 注册到Redis，供其他服务器查找
            registerUserConnection(userId, getServerId());
            
            // 发送离线消息
            sendOfflineMessages(userId);
        }
    }
    
    @EventListener
    public void handleWebSocketDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        ConnectionMetadata metadata = connectionMetadata.remove(sessionId);
        if (metadata != null) {
            userConnections.remove(metadata.getUserId());
            unregisterUserConnection(metadata.getUserId());
        }
    }
    
    public boolean sendMessageToUser(Long userId, ChatMessage message) {
        WebSocketSession session = userConnections.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(JSON.toJSONString(message)));
                return true;
            } catch (Exception e) {
                log.error("发送消息失败: userId={}", userId, e);
                userConnections.remove(userId);
            }
        }
        return false;
    }
    
    private void registerUserConnection(Long userId, String serverId) {
        redisTemplate.opsForHash().put("user_connections", 
            userId.toString(), serverId);
        redisTemplate.expire("user_connections", Duration.ofHours(1));
    }
}
```

**3. 消息路由服务**
```java
@Service
public class MessageRoutingService {
    
    @Autowired
    private ConnectionManager connectionManager;
    
    @Autowired
    private MessageProducer messageProducer;
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public void routeMessage(ChatMessage message) {
        switch (message.getMessageType()) {
            case SINGLE_CHAT:
                routeSingleChatMessage(message);
                break;
            case GROUP_CHAT:
                routeGroupChatMessage(message);
                break;
            default:
                log.warn("未知消息类型: {}", message.getMessageType());
        }
    }
    
    private void routeSingleChatMessage(ChatMessage message) {
        Long receiverId = message.getReceiverId();
        
        // 先尝试本地投递
        if (connectionManager.sendMessageToUser(receiverId, message)) {
            // 投递成功，更新消息状态
            updateMessageStatus(message.getMessageId(), MessageStatus.DELIVERED);
            return;
        }
        
        // 本地投递失败，查找用户在哪个服务器
        String serverId = redisTemplate.opsForHash().get("user_connections", 
            receiverId.toString());
        
        if (serverId != null && !serverId.equals(getServerId())) {
            // 转发到目标服务器
            messageProducer.sendToServer(serverId, message);
        } else {
            // 用户离线，存储离线消息
            storeOfflineMessage(receiverId, message);
        }
    }
    
    private void routeGroupChatMessage(ChatMessage message) {
        Long groupId = message.getGroupId();
        
        // 获取群成员列表
        List<Long> members = groupService.getGroupMembers(groupId);
        
        // 批量投递消息
        List<CompletableFuture<Void>> futures = members.stream()
            .filter(memberId -> !memberId.equals(message.getSenderId())) // 排除发送者
            .map(memberId -> CompletableFuture.runAsync(() -> {
                ChatMessage memberMessage = message.copy();
                memberMessage.setReceiverId(memberId);
                routeSingleChatMessage(memberMessage);
            }))
            .collect(Collectors.toList());
        
        // 等待所有投递完成
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
            .thenRun(() -> {
                updateMessageStatus(message.getMessageId(), MessageStatus.GROUP_DELIVERED);
            });
    }
}
```

**4. 消息存储设计**
```sql
-- 消息表（分表存储）
CREATE TABLE chat_message (
    id BIGINT PRIMARY KEY,
    message_id VARCHAR(64) UNIQUE NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT,
    group_id BIGINT,
    message_type TINYINT NOT NULL, -- 1:单聊 2:群聊
    content_type TINYINT NOT NULL, -- 1:文本 2:图片 3:语音 4:文件
    content TEXT NOT NULL,
    send_time BIGINT NOT NULL,
    status TINYINT DEFAULT 1, -- 1:发送中 2:已送达 3:已读
    INDEX idx_sender_time (sender_id, send_time),
    INDEX idx_receiver_time (receiver_id, send_time),
    INDEX idx_group_time (group_id, send_time)
) ENGINE=InnoDB;

-- 会话表
CREATE TABLE conversation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    target_id BIGINT NOT NULL, -- 对方用户ID或群ID
    conversation_type TINYINT NOT NULL, -- 1:单聊 2:群聊
    last_message_id VARCHAR(64),
    last_message_time BIGINT,
    unread_count INT DEFAULT 0,
    UNIQUE KEY uk_user_target (user_id, target_id, conversation_type),
    INDEX idx_user_time (user_id, last_message_time)
) ENGINE=InnoDB;
```

**5. 离线消息处理**
```java
@Service
public class OfflineMessageService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String OFFLINE_MESSAGE_PREFIX = "offline_msg:";
    private static final int MAX_OFFLINE_MESSAGES = 1000;
    
    public void storeOfflineMessage(Long userId, ChatMessage message) {
        String key = OFFLINE_MESSAGE_PREFIX + userId;
        
        // 使用Redis List存储离线消息
        redisTemplate.opsForList().leftPush(key, message);
        
        // 限制离线消息数量
        redisTemplate.opsForList().trim(key, 0, MAX_OFFLINE_MESSAGES - 1);
        
        // 设置过期时间（7天）
        redisTemplate.expire(key, Duration.ofDays(7));
        
        // 更新未读消息计数
        incrementUnreadCount(userId, message);
    }
    
    public List<ChatMessage> getOfflineMessages(Long userId) {
        String key = OFFLINE_MESSAGE_PREFIX + userId;
        
        // 获取所有离线消息
        List<Object> messages = redisTemplate.opsForList().range(key, 0, -1);
        
        if (CollectionUtils.isNotEmpty(messages)) {
            // 清空离线消息
            redisTemplate.delete(key);
            
            return messages.stream()
                .map(obj -> (ChatMessage) obj)
                .sorted(Comparator.comparing(ChatMessage::getSendTime))
                .collect(Collectors.toList());
        }
        
        return Collections.emptyList();
    }
    
    private void incrementUnreadCount(Long userId, ChatMessage message) {
        // 更新会话未读数
        conversationService.incrementUnreadCount(
            userId, 
            message.getMessageType() == MessageType.SINGLE_CHAT 
                ? message.getSenderId() 
                : message.getGroupId(),
            message.getMessageType()
        );
    }
}
```

### 🎯 如何设计一个推荐系统？

**业务背景**：
设计一个电商推荐系统，支持个性化商品推荐、实时推荐、冷启动推荐，要求响应时间<100ms，支持千万级用户和亿级商品。

**系统架构设计**：

**1. 推荐算法架构**
```java
@Service
public class RecommendationService {
    
    @Autowired
    private UserProfileService userProfileService;
    
    @Autowired
    private ItemProfileService itemProfileService;
    
    @Autowired
    private RecommendationCache recommendationCache;
    
    public List<RecommendationItem> recommend(Long userId, RecommendationContext context) {
        try {
            // 1. 获取用户画像
            UserProfile userProfile = userProfileService.getUserProfile(userId);
            
            // 2. 选择推荐策略
            List<RecommendationStrategy> strategies = selectStrategies(userProfile, context);
            
            // 3. 多路召回
            List<RecallResult> recallResults = strategies.parallelStream()
                .map(strategy -> strategy.recall(userProfile, context))
                .collect(Collectors.toList());
            
            // 4. 候选商品合并去重
            Set<Long> candidateItems = mergeAndDeduplicate(recallResults);
            
            // 5. 排序打分
            List<ScoredItem> scoredItems = rankingService.rank(userId, candidateItems, context);
            
            // 6. 多样性重排
            List<ScoredItem> diversifiedItems = diversifyResults(scoredItems, userProfile);
            
            // 7. 过滤和截断
            List<RecommendationItem> finalResults = filterAndTruncate(diversifiedItems, context);
            
            // 8. 缓存结果
            cacheRecommendations(userId, finalResults, context);
            
            return finalResults;
            
        } catch (Exception e) {
            log.error("推荐失败: userId={}", userId, e);
            return getFallbackRecommendations(userId, context);
        }
    }
    
    private List<RecommendationStrategy> selectStrategies(UserProfile userProfile, RecommendationContext context) {
        List<RecommendationStrategy> strategies = new ArrayList<>();
        
        // 协同过滤策略
        if (userProfile.getInteractionCount() > 10) {
            strategies.add(collaborativeFilteringStrategy);
        }
        
        // 内容推荐策略
        if (userProfile.hasPreferences()) {
            strategies.add(contentBasedStrategy);
        }
        
        // 热门推荐策略（兜底）
        strategies.add(popularItemsStrategy);
        
        // 实时推荐策略
        if (context.isRealTime()) {
            strategies.add(realTimeStrategy);
        }
        
        return strategies;
    }
}

// 协同过滤推荐策略
@Component
public class CollaborativeFilteringStrategy implements RecommendationStrategy {
    
    @Autowired
    private UserSimilarityService userSimilarityService;
    
    @Autowired
    private ItemSimilarityService itemSimilarityService;
    
    @Override
    public RecallResult recall(UserProfile userProfile, RecommendationContext context) {
        Long userId = userProfile.getUserId();
        
        // 基于用户的协同过滤
        List<Long> userBasedItems = recallByUserCF(userId, context.getRecallSize() / 2);
        
        // 基于物品的协同过滤
        List<Long> itemBasedItems = recallByItemCF(userId, context.getRecallSize() / 2);
        
        // 合并结果
        Set<Long> allItems = new HashSet<>();
        allItems.addAll(userBasedItems);
        allItems.addAll(itemBasedItems);
        
        return RecallResult.builder()
            .strategy("collaborative_filtering")
            .items(new ArrayList<>(allItems))
            .score(0.8) // 策略权重
            .build();
    }
    
    private List<Long> recallByUserCF(Long userId, int size) {
        // 1. 找到相似用户
        List<SimilarUser> similarUsers = userSimilarityService.getSimilarUsers(userId, 100);
        
        // 2. 获取相似用户喜欢的商品
        Map<Long, Double> itemScores = new HashMap<>();
        
        for (SimilarUser similarUser : similarUsers) {
            List<UserInteraction> interactions = userInteractionService
                .getUserInteractions(similarUser.getUserId());
            
            for (UserInteraction interaction : interactions) {
                Long itemId = interaction.getItemId();
                double score = similarUser.getSimilarity() * interaction.getScore();
                itemScores.merge(itemId, score, Double::sum);
            }
        }
        
        // 3. 排序并返回top N
        return itemScores.entrySet().stream()
            .sorted((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()))
            .limit(size)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }
}
```

**2. 实时特征计算**
```java
@Service
public class RealTimeFeatureService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private FeatureProducer featureProducer;
    
    public void updateUserBehavior(UserBehaviorEvent event) {
        Long userId = event.getUserId();
        Long itemId = event.getItemId();
        String behaviorType = event.getBehaviorType();
        
        // 1. 更新用户实时特征
        updateUserRealTimeFeatures(userId, event);
        
        // 2. 更新商品实时特征
        updateItemRealTimeFeatures(itemId, event);
        
        // 3. 更新用户-商品交互特征
        updateInteractionFeatures(userId, itemId, behaviorType);
        
        // 4. 触发实时推荐更新
        if (shouldTriggerRecommendationUpdate(event)) {
            featureProducer.sendRecommendationUpdateEvent(userId);
        }
    }
    
    private void updateUserRealTimeFeatures(Long userId, UserBehaviorEvent event) {
        String userFeatureKey = "user_features:" + userId;
        Map<String, Object> features = new HashMap<>();
        
        // 更新行为计数
        incrementBehaviorCount(userFeatureKey, event.getBehaviorType());
        
        // 更新类目偏好
        updateCategoryPreference(userFeatureKey, event.getCategoryId(), event.getBehaviorType());
        
        // 更新品牌偏好
        updateBrandPreference(userFeatureKey, event.getBrandId(), event.getBehaviorType());
        
        // 更新价格偏好
        updatePricePreference(userFeatureKey, event.getPrice());
        
        // 设置过期时间
        redisTemplate.expire(userFeatureKey, Duration.ofDays(7));
    }
    
    private void incrementBehaviorCount(String userFeatureKey, String behaviorType) {
        String field = "behavior_count:" + behaviorType;
        redisTemplate.opsForHash().increment(userFeatureKey, field, 1);
        
        // 使用时间衰减
        String timestampField = "last_" + behaviorType + "_time";
        redisTemplate.opsForHash().put(userFeatureKey, timestampField, System.currentTimeMillis());
    }
    
    private void updateCategoryPreference(String userFeatureKey, Long categoryId, String behaviorType) {
        String field = "category_pref:" + categoryId;
        double weight = getBehaviorWeight(behaviorType);
        
        // 使用指数移动平均更新偏好度
        Object currentValue = redisTemplate.opsForHash().get(userFeatureKey, field);
        double currentPref = currentValue != null ? Double.parseDouble(currentValue.toString()) : 0.0;
        double newPref = 0.7 * currentPref + 0.3 * weight;
        
        redisTemplate.opsForHash().put(userFeatureKey, field, newPref);
    }
}

// Flink实时特征计算
@Component
public class RealTimeFeatureCalculator {
    
    public void processUserBehaviorStream() {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);
        
        // 用户行为数据流
        DataStream<UserBehaviorEvent> behaviorStream = env
            .addSource(new FlinkKafkaConsumer<>("user-behavior-topic", 
                new UserBehaviorEventSchema(), properties))
            .assignTimestampsAndWatermarks(
                WatermarkStrategy.<UserBehaviorEvent>forBoundedOutOfOrderness(Duration.ofSeconds(10))
                    .withTimestampAssigner((event, timestamp) -> event.getTimestamp()));
        
        // 计算用户实时特征
        DataStream<UserFeature> userFeatures = behaviorStream
            .keyBy(UserBehaviorEvent::getUserId)
            .window(SlidingEventTimeWindows.of(Time.hours(1), Time.minutes(10)))
            .aggregate(new UserFeatureAggregator());
        
        // 计算商品实时特征
        DataStream<ItemFeature> itemFeatures = behaviorStream
            .keyBy(UserBehaviorEvent::getItemId)
            .window(TumblingEventTimeWindows.of(Time.minutes(5)))
            .aggregate(new ItemFeatureAggregator());
        
        // 输出到特征存储
        userFeatures.addSink(new UserFeatureSink());
        itemFeatures.addSink(new ItemFeatureSink());
        
        try {
            env.execute("Real-time Feature Calculation");
        } catch (Exception e) {
            log.error("实时特征计算任务执行失败", e);
        }
    }
}
```

**3. 排序模型服务**
```java
@Service
public class RankingModelService {
    
    @Autowired
    private ModelRepository modelRepository;
    
    @Autowired
    private FeatureExtractor featureExtractor;
    
    private volatile RankingModel currentModel;
    
    @PostConstruct
    public void loadModel() {
        this.currentModel = modelRepository.loadLatestModel();
    }
    
    public List<ScoredItem> rank(Long userId, List<Long> candidateItems, RecommendationContext context) {
        if (candidateItems.isEmpty()) {
            return Collections.emptyList();
        }
        
        // 1. 特征提取
        List<FeatureVector> features = candidateItems.parallelStream()
            .map(itemId -> featureExtractor.extractFeatures(userId, itemId, context))
            .collect(Collectors.toList());
        
        // 2. 模型预测
        List<Double> scores = currentModel.predict(features);
        
        // 3. 构建评分结果
        List<ScoredItem> scoredItems = new ArrayList<>();
        for (int i = 0; i < candidateItems.size(); i++) {
            scoredItems.add(ScoredItem.builder()
                .itemId(candidateItems.get(i))
                .score(scores.get(i))
                .features(features.get(i))
                .build());
        }
        
        // 4. 排序
        return scoredItems.stream()
            .sorted((item1, item2) -> Double.compare(item2.getScore(), item1.getScore()))
            .collect(Collectors.toList());
    }
    
    @Scheduled(fixedRate = 300000) // 每5分钟检查一次
    public void checkModelUpdate() {
        RankingModel latestModel = modelRepository.loadLatestModel();
        if (latestModel.getVersion() > currentModel.getVersion()) {
            log.info("检测到新模型版本: {} -> {}", currentModel.getVersion(), latestModel.getVersion());
            this.currentModel = latestModel;
        }
    }
}

// 深度学习排序模型
@Component
public class DeepLearningRankingModel implements RankingModel {
    
    private TensorFlowModel model;
    
    @Override
    public List<Double> predict(List<FeatureVector> features) {
        try {
            // 1. 特征预处理
            float[][] inputMatrix = preprocessFeatures(features);
            
            // 2. 模型推理
            try (Tensor<?> inputTensor = Tensor.create(inputMatrix)) {
                Session.Runner runner = model.getSession().runner()
                    .feed("input", inputTensor)
                    .fetch("output");
                
                List<Tensor<?>> outputs = runner.run();
                try (Tensor<?> outputTensor = outputs.get(0)) {
                    float[][] predictions = new float[1][(int) outputTensor.shape()[1]];
                    outputTensor.copyTo(predictions);
                    
                    // 3. 后处理
                    return Arrays.stream(predictions[0])
                        .boxed()
                        .map(Float::doubleValue)
                        .collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            log.error("模型预测失败", e);
            return features.stream()
                .map(f -> 0.5) // 默认分数
                .collect(Collectors.toList());
        }
    }
    
    private float[][] preprocessFeatures(List<FeatureVector> features) {
        int batchSize = features.size();
        int featureSize = features.get(0).getDimension();
        float[][] inputMatrix = new float[batchSize][featureSize];
        
        for (int i = 0; i < batchSize; i++) {
            FeatureVector feature = features.get(i);
            for (int j = 0; j < featureSize; j++) {
                inputMatrix[i][j] = feature.getValue(j).floatValue();
            }
        }
        
        return inputMatrix;
    }
}
```

**4. A/B测试框架**
```java
@Service
public class ABTestService {
    
    @Autowired
    private ExperimentRepository experimentRepository;
    
    @Autowired
    private UserGroupService userGroupService;
    
    public String getExperimentGroup(Long userId, String experimentName) {
        // 1. 获取实验配置
        Experiment experiment = experimentRepository.getExperiment(experimentName);
        if (experiment == null || !experiment.isActive()) {
            return "control"; // 默认对照组
        }
        
        // 2. 用户分组
        String userGroup = userGroupService.getUserGroup(userId, experimentName);
        if (userGroup != null) {
            return userGroup;
        }
        
        // 3. 基于用户ID的哈希分组
        int hash = Math.abs(Objects.hash(userId, experimentName));
        double ratio = (hash % 10000) / 10000.0;
        
        double cumulativeRatio = 0.0;
        for (ExperimentGroup group : experiment.getGroups()) {
            cumulativeRatio += group.getTrafficRatio();
            if (ratio < cumulativeRatio) {
                // 4. 记录用户分组
                userGroupService.saveUserGroup(userId, experimentName, group.getName());
                return group.getName();
            }
        }
        
        return "control";
    }
    
    public void recordExperimentMetric(Long userId, String experimentName, String metricName, double value) {
        String userGroup = userGroupService.getUserGroup(userId, experimentName);
        if (userGroup != null) {
            ExperimentMetric metric = ExperimentMetric.builder()
                .experimentName(experimentName)
                .userGroup(userGroup)
                .userId(userId)
                .metricName(metricName)
                .metricValue(value)
                .timestamp(System.currentTimeMillis())
                .build();
            
            experimentMetricRepository.save(metric);
        }
    }
}

// 推荐效果评估
@Service
public class RecommendationEvaluationService {
    
    public void evaluateRecommendation(Long userId, List<RecommendationItem> recommendations, 
                                     UserFeedback feedback) {
        String experimentGroup = abTestService.getExperimentGroup(userId, "recommendation_algorithm");
        
        // 1. 计算点击率
        double ctr = calculateCTR(recommendations, feedback);
        abTestService.recordExperimentMetric(userId, "recommendation_algorithm", "ctr", ctr);
        
        // 2. 计算转化率
        double cvr = calculateCVR(recommendations, feedback);
        abTestService.recordExperimentMetric(userId, "recommendation_algorithm", "cvr", cvr);
        
        // 3. 计算多样性
        double diversity = calculateDiversity(recommendations);
        abTestService.recordExperimentMetric(userId, "recommendation_algorithm", "diversity", diversity);
        
        // 4. 计算新颖性
        double novelty = calculateNovelty(userId, recommendations);
        abTestService.recordExperimentMetric(userId, "recommendation_algorithm", "novelty", novelty);
    }
    
    private double calculateCTR(List<RecommendationItem> recommendations, UserFeedback feedback) {
        if (recommendations.isEmpty()) return 0.0;
        
        long clickCount = feedback.getClickedItems().stream()
            .mapToLong(clickedItem -> 
                recommendations.stream()
                    .anyMatch(rec -> rec.getItemId().equals(clickedItem)) ? 1L : 0L)
            .sum();
        
        return (double) clickCount / recommendations.size();
    }
}
```

---

## 🎯 高频考点Top20

### 💡 经典系统设计类

1. **🔗 短链系统设计** - URL生成算法、缓存架构、分库分表策略
2. **💬 IM聊天系统** - 长连接管理、消息路由、离线消息处理
3. **🔍 搜索引擎系统** - 倒排索引、查询解析、分布式存储
4. **📊 推荐系统设计** - 召回策略、排序模型、实时特征计算
5. **🎫 秒杀系统设计** - 流量削峰、库存扣减、异步处理
6. **📱 消息推送系统** - 多端推送、长连接、消息路由
7. **🔐 统一认证系统** - SSO单点登录、JWT Token、权限控制
8. **📈 监控系统设计** - 指标收集、时序存储、告警规则
9. **🎮 抢红包系统** - 红包算法、并发控制、事务处理
10. **🚗 打车系统设计** - 地理位置、路径规划、实时匹配

### 🚀 高并发优化类

11. **🔄 缓存架构设计** - 多级缓存、缓存更新、一致性保证
12. **⚡ 接口性能优化** - 慢查询优化、异步处理、批量操作
13. **🎯 限流降级策略** - 令牌桶、漏桶、熔断器、降级方案
14. **💾 数据库优化** - 索引设计、分库分表、读写分离
15. **🔧 JVM性能调优** - 内存管理、GC优化、参数调整

### 📡 分布式系统类

16. **🌐 微服务架构** - 服务拆分、服务治理、配置中心
17. **💰 分布式事务** - Saga、TCC、最终一致性、幂等设计
18. **🔄 分布式锁** - Redis实现、Zookeeper实现、数据一致性
19. **📊 分布式存储** - 数据分片、副本机制、一致性哈希
20. **🔗 服务链路追踪** - 分布式追踪、性能监控、故障定位

### 🎭 面试回答技巧

**📝 系统设计题回答框架**：
1. **需求澄清**（2分钟）- 功能需求、非功能需求、约束条件
2. **容量估算**（2分钟）- QPS估算、存储估算、带宽估算
3. **架构设计**（8分钟）- 整体架构、核心组件、数据流向
4. **详细设计**（10分钟）- 关键组件设计、数据模型、算法选择
5. **扩展优化**（3分钟）- 性能优化、可扩展性、可用性保证

**🎯 加分回答要点**：
- **量化指标** - 用具体数字说明系统容量和性能
- **技术深度** - 深入讲解核心技术原理和实现细节
- **权衡思考** - 分析不同方案的优缺点和适用场景
- **实战经验** - 结合实际项目经验和踩坑总结
- **演进策略** - 考虑系统的演进路径和迭代优化

---

## 🎉 总结

**Java资深工程师的核心竞争力在于解决复杂业务问题的系统化思维能力**，这不仅需要扎实的技术功底，更需要对业务场景的深度理解和架构设计的全局视野。

**记住：面试官看重的是你的技术深度、架构思维和解决问题的方法论，而不是死记硬背的理论知识。**

**最后一句话**：*"技术为业务服务，架构因场景而异"* - 始终以解决实际问题为目标，在实践中不断提升技术能力！

---

> 💌 **持续学习，精进技术！**  
> 资深工程师的成长之路永无止境，在技术的深海中不断探索，用代码改变世界！