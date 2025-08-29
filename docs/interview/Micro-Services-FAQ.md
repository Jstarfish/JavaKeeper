---
title: 微服务架构/Spring Cloud面试题大全
date: 2024-12-15
tags: 
 - 微服务
 - Spring Cloud
 - 分布式
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

微服务架构是现代分布式系统的**核心设计理念**，也是Java后端面试的**重点考查领域**。从单体架构演进到微服务，从服务拆分到治理实践，每个环节都体现着架构师的技术深度。本文档将**微服务核心技术**整理成**系统化知识体系**，涵盖架构设计、Spring Cloud生态、服务治理等关键领域，助你在面试中展现架构思维！

微服务面试，围绕着这么几个核心方向准备：

- **架构理念**（微服务vs单体、拆分原则、边界设计、数据一致性）
- **Spring Cloud生态**（注册中心、配置中心、服务网关、链路追踪）  
- **服务治理**（负载均衡、熔断降级、限流机制、灰度发布）
- **通信机制**（同步调用、异步消息、事件驱动、API设计）
- **数据管理**（分库分表、分布式事务、数据同步、CQRS模式）
- **运维部署**（容器化、CI/CD、监控告警、日志收集）
- **实战经验**（架构演进、问题排查、性能调优、最佳实践）

## 🗺️ 知识导航

### 🏷️ 核心知识分类

1. **🏗️ 架构基础**：微服务定义、架构对比、拆分策略、边界划分
2. **☁️ Spring Cloud**：注册发现、配置管理、服务网关、断路器
3. **🔧 服务治理**：负载均衡、容错处理、链路追踪、服务监控
4. **💬 服务通信**：同步调用、消息队列、事件驱动、API网关
5. **🗄️ 数据治理**：数据库拆分、分布式事务、数据一致性、CQRS
6. **🚀 部署运维**：容器化、服务网格、持续集成、监控体系
7. **🎯 实践案例**：架构演进、性能优化、故障处理、团队协作

### 🔑 面试话术模板

| **问题类型** | **回答框架**        | **关键要点** | **深入扩展**       |
| ------------ | ------------------- | ------------ | ------------------ |
| **架构设计** | 背景→原则→方案→效果 | 业务驱动架构 | 技术选型、权衡决策 |
| **技术对比** | 场景→特点→优劣→选择 | 量化对比数据 | 实际项目经验       |
| **问题排查** | 现象→分析→定位→解决 | 系统化思维   | 监控工具、预防措施 |
| **性能优化** | 瓶颈→方案→实施→验证 | 数据驱动优化 | 压测验证、长期监控 |

---

## 🏗️ 一、架构基础与设计

**核心理念**：微服务架构通过服务拆分实现系统的高内聚低耦合，提升开发效率和系统可维护性。

### 🎯 什么是微服务？与单体架构有什么区别？

微服务是一种架构风格，将应用拆分为多个独立的服务：

**微服务架构特点**：

- **服务独立**：每个服务可独立开发、部署、扩展
- **业务导向**：围绕业务能力组织服务
- **去中心化**：数据和治理的去中心化
- **容错设计**：服务间故障隔离
- **技术多样性**：不同服务可用不同技术栈

**架构对比分析**：

| **特性**       | **单体架构**   | **微服务架构**   |
| -------------- | -------------- | ---------------- |
| **部署复杂度** | 简单，一次部署 | 复杂，多服务协调 |
| **开发效率**   | 初期高，后期低 | 初期低，后期高   |
| **团队协作**   | 集中式开发     | 分布式团队       |
| **技术栈**     | 统一技术栈     | 多样化技术栈     |
| **故障影响**   | 全局影响       | 局部影响         |
| **数据一致性** | 强一致性       | 最终一致性       |
| **运维成本**   | 低             | 高               |

**💻 架构演进示例**：

```java
// 单体架构示例
@RestController
public class ECommerceController {
    
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        // 所有业务逻辑在一个应用中
        User user = userService.getUser(request.getUserId());
        Product product = productService.getProduct(request.getProductId());
        Order order = orderService.createOrder(user, product);
        Payment payment = paymentService.processPayment(order);
        
        return ResponseEntity.ok(order);
    }
}

// 微服务架构演进
// 用户服务
@RestController
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
}

// 订单服务
@RestController
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    // 通过RPC调用其他服务
    @Reference
    private UserService userService;
    @Reference
    private ProductService productService;
    @Reference
    private PaymentService paymentService;
    
    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        // 调用远程服务
        User user = userService.getUser(request.getUserId());
        Product product = productService.getProduct(request.getProductId());
        
        Order order = orderService.createOrder(request);
        
        // 异步处理支付
        paymentService.processPaymentAsync(order.getId());
        
        return ResponseEntity.ok(order);
    }
}
```

### 🎯 微服务拆分的原则和策略？

微服务拆分需要遵循一定的原则和方法：

**拆分原则**：

1. **单一职责原则**：每个服务只负责一个业务领域
2. **高内聚低耦合**：服务内部紧密协作，服务间松散耦合
3. **业务能力导向**：按照业务能力而非技术层面拆分
4. **数据独立性**：每个服务管理自己的数据
5. **可独立部署**：服务可以独立发布和部署

**拆分策略**：

**1. 按业务能力拆分**：

```java
// 电商系统的业务能力拆分
- 用户管理服务 (User Management)
  - 用户注册、登录、信息管理
  - 用户权限、角色管理
  
- 商品管理服务 (Product Catalog)  
  - 商品信息管理
  - 库存管理
  - 分类管理
  
- 订单服务 (Order Management)
  - 订单创建、状态管理
  - 订单查询、历史记录
  
- 支付服务 (Payment)
  - 支付处理
  - 账单管理
  - 退款处理
  
- 物流服务 (Logistics)
  - 配送管理
  - 物流跟踪
```

**2. 按数据模型拆分**：

```java
// 基于领域驱动设计(DDD)的拆分
@Entity
@Table(name = "users")
public class User {
    private Long id;
    private String username;
    private String email;
    // 用户聚合根
}

@Entity  
@Table(name = "orders")
public class Order {
    private Long id;
    private Long userId;  // 外键关联，不直接持有User对象
    private List<OrderItem> items;
    // 订单聚合根
}

// 服务边界定义
public interface UserService {
    User createUser(CreateUserRequest request);
    User getUser(Long userId);
    void updateUser(Long userId, UpdateUserRequest request);
}

public interface OrderService {
    Order createOrder(CreateOrderRequest request);
    Order getOrder(Long orderId);
    List<Order> getOrdersByUser(Long userId);
}
```

**3. 按团队结构拆分（康威定律）**：

```java
// 根据组织结构设计服务边界
/**
 * 前端团队 -> 用户界面服务
 * 用户体验团队 -> 用户管理服务  
 * 商品团队 -> 商品目录服务
 * 交易团队 -> 订单服务 + 支付服务
 * 运营团队 -> 数据分析服务
 */

// 团队自治的微服务
@SpringBootApplication
public class UserServiceApplication {
    // 用户团队完全负责此服务
    // - 需求分析
    // - 技术选型  
    // - 开发测试
    // - 部署运维
}
```

### 🎯 如何划定微服务的边界？

服务边界划分是微服务设计的核心挑战：

**边界识别方法**：

**1. 领域驱动设计（DDD）**：

```java
// 通过领域建模识别边界上下文
public class ECommerceDomain {
    
    // 用户管理子域
    @BoundedContext("UserManagement")
    public class UserAggregate {
        @AggregateRoot
        public class User {
            private UserId id;
            private UserProfile profile;
            private UserPreferences preferences;
        }
    }
    
    // 订单管理子域
    @BoundedContext("OrderManagement") 
    public class OrderAggregate {
        @AggregateRoot
        public class Order {
            private OrderId id;
            private List<OrderItem> items;
            private OrderStatus status;
            
            // 只通过ID引用其他聚合
            private UserId customerId;  // 不直接依赖User对象
        }
    }
    
    // 库存管理子域
    @BoundedContext("Inventory")
    public class InventoryAggregate {
        @AggregateRoot  
        public class Product {
            private ProductId id;
            private Stock stock;
            private PriceInfo pricing;
        }
    }
}
```

**2. 数据流分析**：

```java
// 分析数据的读写模式
public class DataFlowAnalysis {
    
    // 高内聚：这些数据经常一起读写
    @ServiceBoundary("UserService")
    public class UserData {
        - User基本信息 (高频读写)
        - UserProfile详细资料 (中频读写)  
        - UserPreferences偏好设置 (低频读写)
    }
    
    // 低耦合：跨服务的数据访问通过API
    @ServiceBoundary("OrderService") 
    public class OrderData {
        - Order订单信息 (高频读写)
        - OrderItem订单项 (高频读写)
        // 通过API获取用户信息，而不是直接访问用户表
        - 调用UserService.getUser(userId)
    }
}
```

**3. 业务流程分析**：

```java
// 分析业务流程的独立性
public class BusinessProcessAnalysis {
    
    // 用户注册流程 - 可独立完成
    @IndependentProcess
    public void userRegistration() {
        validateUserInfo();
        createUserAccount();
        sendWelcomeEmail();
        // 不依赖其他业务领域
    }
    
    // 订单处理流程 - 需要多服务协作
    @CrossServiceProcess
    public void orderProcessing() {
        validateUser();        // -> UserService
        checkInventory();      // -> InventoryService  
        calculatePrice();      // -> PricingService
        processPayment();      // -> PaymentService
        updateInventory();     // -> InventoryService
        
        // 识别出需要服务编排的流程
    }
}
```

---

## ☁️ 二、Spring Cloud生态

**核心理念**：Spring Cloud为微服务架构提供了完整的技术栈，简化了分布式系统的复杂性。

### 🎯 Spring Cloud的核心组件有哪些？

Spring Cloud生态系统的主要组件：

**核心组件架构**：

| **功能领域**     | **组件**  | **作用**         | **替代方案**    |
| ---------------- | --------- | ---------------- | --------------- |
| **服务注册发现** | Eureka    | 服务注册中心     | Consul, Nacos   |
| **配置管理**     | Config    | 外部化配置       | Apollo, Nacos   |
| **服务网关**     | Gateway   | 路由、过滤       | Zuul, Kong      |
| **负载均衡**     | Ribbon    | 客户端负载均衡   | LoadBalancer    |
| **服务调用**     | OpenFeign | 声明式HTTP客户端 | RestTemplate    |
| **断路器**       | Hystrix   | 容错保护         | Resilience4j    |
| **链路追踪**     | Sleuth    | 分布式追踪       | Zipkin, Jaeger  |
| **消息总线**     | Bus       | 配置刷新         | RabbitMQ, Kafka |

**💻 架构集成示例**：

```java
// Spring Cloud微服务启动类
@SpringBootApplication
@EnableEurekaClient          // 启用Eureka客户端
@EnableFeignClients         // 启用Feign客户端
@EnableCircuitBreaker       // 启用断路器
@EnableZipkinServer         // 启用链路追踪
public class UserServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
    
    // 负载均衡配置
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

// 服务间调用示例
@FeignClient(name = "user-service", fallback = UserServiceFallback.class)
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable("id") Long id);
    
    @PostMapping("/users")
    User createUser(@RequestBody CreateUserRequest request);
}

// 断路器降级处理
@Component
public class UserServiceFallback implements UserServiceClient {
    
    @Override
    public User getUser(Long id) {
        return User.builder()
            .id(id)
            .username("默认用户")
            .build();
    }
    
    @Override  
    public User createUser(CreateUserRequest request) {
        throw new ServiceUnavailableException("用户服务暂时不可用");
    }
}
```

### 🎯 Eureka的工作原理？

Eureka是Netflix开源的服务注册与发现组件：

**Eureka架构**：

- **Eureka Server**：服务注册中心
- **Eureka Client**：服务提供者和消费者
- **服务注册**：应用启动时向Eureka注册
- **服务发现**：从Eureka获取服务列表
- **健康检查**：定期检查服务健康状态

**工作流程**：

```java
// 1. Eureka Server配置
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}

// application.yml
server:
  port: 8761

eureka:
  instance:
    hostname: localhost
  client:
    register-with-eureka: false    # 不向自己注册
    fetch-registry: false          # 不从自己拉取注册信息
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/

// 2. 服务提供者配置
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    
    @RestController
    public class UserController {
        
        @GetMapping("/users/{id}")
        public User getUser(@PathVariable Long id) {
            return userService.getUser(id);
        }
    }
}

// 服务提供者配置
spring:
  application:
    name: user-service
    
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 30    # 心跳间隔
    lease-expiration-duration-in-seconds: 90 # 服务失效时间

// 3. 服务消费者
@RestController
public class OrderController {
    
    @Autowired
    private DiscoveryClient discoveryClient;
    
    @Autowired
    @LoadBalanced
    private RestTemplate restTemplate;
    
    @GetMapping("/orders/{id}")
    public Order getOrder(@PathVariable Long id) {
        // 方式1：通过DiscoveryClient发现服务
        List<ServiceInstance> instances = 
            discoveryClient.getInstances("user-service");
        
        if (!instances.isEmpty()) {
            ServiceInstance instance = instances.get(0);
            String userServiceUrl = "http://" + instance.getHost() 
                                  + ":" + instance.getPort();
        }
        
        // 方式2：通过负载均衡调用
        User user = restTemplate.getForObject(
            "http://user-service/users/1", User.class);
            
        return orderService.getOrder(id);
    }
}
```

**自我保护机制**：

```java
// Eureka自我保护机制配置
public class EurekaSelfPreservation {
    
    /**
     * 自我保护触发条件：
     * 1. 15分钟内心跳失败比例超过85%
     * 2. 网络分区导致心跳丢失
     * 
     * 保护措施：
     * 1. 不再剔除任何服务实例
     * 2. 保留服务注册信息
     * 3. 等待网络恢复
     */
    
    // 禁用自我保护（生产环境慎用）
    @Configuration
    public class EurekaServerConfig {
        
        @Value("${eureka.server.enable-self-preservation:true}")
        private boolean enableSelfPreservation;
        
        @Bean
        public EurekaServerConfigBean eurekaServerConfig() {
            EurekaServerConfigBean config = new EurekaServerConfigBean();
            config.setEnableSelfPreservation(enableSelfPreservation);
            return config;
        }
    }
}
```

### 🎯 Spring Cloud Config的配置管理原理？

Spring Cloud Config提供分布式系统的外部化配置支持：

**Config架构组成**：

- **Config Server**：配置服务端，从Git仓库读取配置
- **Config Client**：配置客户端，从Server获取配置
- **配置仓库**：Git仓库存储配置文件
- **消息总线**：配置变更通知机制

**💻 实现示例**：

```java
// 1. Config Server配置
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}

# Config Server配置
server:
  port: 8888

spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/config-repo
          search-paths: '{application}'
          clone-on-start: true
        health:
          enabled: true

# Git仓库结构
config-repo/
├── user-service/
│   ├── user-service.yml           # 默认配置
│   ├── user-service-dev.yml       # 开发环境
│   ├── user-service-test.yml      # 测试环境
│   └── user-service-prod.yml      # 生产环境
└── order-service/
    ├── order-service.yml
    └── ...

// 2. Config Client配置
@SpringBootApplication
@RefreshScope  // 支持配置热刷新
public class UserServiceApplication {
    
    @Value("${user.max-connections:100}")
    private int maxConnections;
    
    @Value("${user.timeout:5000}")
    private int timeout;
    
    @RestController
    public class ConfigController {
        
        @GetMapping("/config")
        public Map<String, Object> getConfig() {
            Map<String, Object> config = new HashMap<>();
            config.put("maxConnections", maxConnections);
            config.put("timeout", timeout);
            return config;
        }
    }
}

# bootstrap.yml（优先级高于application.yml）
spring:
  application:
    name: user-service
  profiles:
    active: dev
  cloud:
    config:
      uri: http://localhost:8888
      profile: ${spring.profiles.active}
      label: master
      retry:
        initial-interval: 2000
        max-attempts: 3

// 3. 配置热刷新
@Component
@RefreshScope
@ConfigurationProperties(prefix = "user")
public class UserProperties {
    
    private int maxConnections = 100;
    private int timeout = 5000;
    private String databaseUrl;
    
    // getters and setters
}

@RestController
public class ConfigRefreshController {
    
    @Autowired
    private UserProperties userProperties;
    
    // 手动刷新配置
    @PostMapping("/refresh")
    public String refresh() {
        // 调用/actuator/refresh端点刷新配置
        return "Configuration refreshed";
    }
    
    @GetMapping("/properties")
    public UserProperties getProperties() {
        return userProperties;
    }
}

// 4. 配置加密
public class ConfigEncryption {
    
    // 在配置文件中使用加密
    # user-service.yml
    datasource:
      username: user
      password: '{cipher}AQB8HgPVw4dVhK9r8s1w...'  # 加密后的密码
      
    // Config Server会自动解密
    @Component
    public class DatabaseConfig {
        
        @Value("${datasource.password}")
        private String password;  // 自动解密后的明文密码
    }
}
```

### 🎯 Spring Cloud Gateway的路由机制？

Spring Cloud Gateway是基于Spring WebFlux的反应式网关：

**Gateway核心概念**：

- **Route（路由）**：网关的基本构建块
- **Predicate（断言）**：匹配HTTP请求的条件
- **Filter（过滤器）**：修改请求和响应

**💻 Gateway配置示例**：

```java
// 1. 编程式路由配置
@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            // 用户服务路由
            .route("user-service", r -> r
                .path("/api/users/**")
                .filters(f -> f
                    .stripPrefix(1)                    // 去除/api前缀
                    .addRequestHeader("X-Service", "user")
                    .addResponseHeader("X-Gateway", "spring-cloud")
                    .retry(3)                          // 重试3次
                )
                .uri("lb://user-service")              // 负载均衡到user-service
            )
            // 订单服务路由
            .route("order-service", r -> r
                .path("/api/orders/**") 
                .and()
                .method(HttpMethod.POST, HttpMethod.GET)
                .filters(f -> f
                    .stripPrefix(1)
                    .addRequestParameter("source", "gateway")
                    .modifyResponseBody(String.class, String.class, 
                        (exchange, body) -> body.toUpperCase())
                )
                .uri("lb://order-service")
            )
            // 静态资源路由
            .route("static-resources", r -> r
                .path("/static/**")
                .uri("http://cdn.example.com")
            )
            .build();
    }
}

// 2. 配置文件路由配置
# application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
            - Method=GET,POST
            - Header=X-Request-Id, \d+
          filters:
            - StripPrefix=1
            - AddRequestHeader=X-Service, user
            - name: RequestRateLimiter
              args:
                rate-limiter: "#{@userRateLimiter}"
                key-resolver: "#{@ipKeyResolver}"
                
        - id: order-service  
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
            - After=2023-01-01T00:00:00+08:00[Asia/Shanghai]
          filters:
            - StripPrefix=1
            - name: Hystrix
              args:
                name: order-fallback
                fallbackUri: forward:/order-fallback

// 3. 自定义过滤器
@Component
public class AuthGatewayFilterFactory extends AbstractGatewayFilterFactory<AuthGatewayFilterFactory.Config> {
    
    public AuthGatewayFilterFactory() {
        super(Config.class);
    }
    
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            
            // 提取Token
            String token = request.getHeaders().getFirst("Authorization");
            
            if (token == null || !isValidToken(token)) {
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return response.setComplete();
            }
            
            // 添加用户信息到请求头
            String userId = extractUserIdFromToken(token);
            ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-User-Id", userId)
                .build();
                
            return chain.filter(exchange.mutate()
                .request(modifiedRequest)
                .build());
        };
    }
    
    @Data
    public static class Config {
        private boolean enabled = true;
        private String headerName = "Authorization";
    }
    
    private boolean isValidToken(String token) {
        // JWT token验证逻辑
        return JwtUtil.validateToken(token);
    }
    
    private String extractUserIdFromToken(String token) {
        return JwtUtil.getUserId(token);
    }
}

// 4. 限流配置
@Configuration
public class RateLimitConfig {
    
    // IP限流
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest()
                .getRemoteAddress()
                .getAddress()
                .getHostAddress()
        );
    }
    
    // 用户限流
    @Bean  
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest()
                .getHeaders()
                .getFirst("X-User-Id")
        );
    }
    
    // Redis限流器
    @Bean
    public RedisRateLimiter userRateLimiter() {
        return new RedisRateLimiter(
            10,  // 令牌桶容量
            20   // 每秒补充令牌数
        );
    }
}
```

---

## 🔧 三、服务治理

**核心理念**：微服务治理通过技术手段保障分布式系统的稳定性、可观测性和可维护性。

### 🎯 什么是熔断器？Hystrix的工作原理？

熔断器是微服务容错的核心模式，防止级联故障：

**熔断器状态机**：

1. **CLOSED**：正常状态，请求正常执行
2. **OPEN**：熔断状态，快速失败
3. **HALF_OPEN**：半开状态，尝试恢复

**💻 Hystrix实现示例**：

```java
// 1. Hystrix Command实现
public class UserServiceCommand extends HystrixCommand<User> {
    
    private final Long userId;
    private final UserServiceClient userServiceClient;
    
    public UserServiceCommand(Long userId, UserServiceClient userServiceClient) {
        super(HystrixCommandGroupKey.Factory.asKey("UserService"),
              HystrixCommandKey.Factory.asKey("GetUser"),
              HystrixCommandProperties.Setter()
                .withExecutionTimeoutInMilliseconds(2000)     // 超时时间
                .withCircuitBreakerRequestVolumeThreshold(10)  // 请求量阈值
                .withCircuitBreakerErrorThresholdPercentage(50) // 错误率阈值
                .withCircuitBreakerSleepWindowInMilliseconds(5000)); // 熔断窗口期
                
        this.userId = userId;
        this.userServiceClient = userServiceClient;
    }
    
    @Override
    protected User run() throws Exception {
        return userServiceClient.getUser(userId);
    }
    
    @Override
    protected User getFallback() {
        // 降级处理
        return User.builder()
            .id(userId)
            .username("默认用户")
            .email("default@example.com")
            .build();
    }
}

// 2. 注解式使用
@Service
public class OrderService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @HystrixCommand(
        groupKey = "OrderService",
        commandKey = "getUser",
        fallbackMethod = "getUserFallback",
        commandProperties = {
            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "3000"),
            @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10"),
            @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "60"),
            @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "10000")
        }
    )
    public User getUser(Long userId) {
        return userServiceClient.getUser(userId);
    }
    
    // 降级方法
    public User getUserFallback(Long userId) {
        return User.builder()
            .id(userId)
            .username("系统繁忙，请稍后再试")
            .build();
    }
    
    // 降级方法（包含异常信息）
    public User getUserFallback(Long userId, Throwable throwable) {
        log.error("获取用户信息失败，userId: {}", userId, throwable);
        
        return User.builder()
            .id(userId)
            .username("服务暂时不可用")
            .build();
    }
}

// 3. Feign集成Hystrix
@FeignClient(
    name = "user-service",
    fallback = UserServiceFallback.class,
    fallbackFactory = UserServiceFallbackFactory.class
)
public interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    User getUser(@PathVariable("id") Long id);
    
    @PostMapping("/users")
    User createUser(@RequestBody CreateUserRequest request);
}

// 降级实现
@Component
public class UserServiceFallback implements UserServiceClient {
    
    @Override
    public User getUser(Long id) {
        return createDefaultUser(id);
    }
    
    @Override
    public User createUser(CreateUserRequest request) {
        throw new ServiceUnavailableException("用户服务暂时不可用，请稍后重试");
    }
    
    private User createDefaultUser(Long id) {
        return User.builder()
            .id(id)
            .username("默认用户" + id)
            .status(UserStatus.UNKNOWN)
            .build();
    }
}

// 带异常信息的降级工厂
@Component
public class UserServiceFallbackFactory implements FallbackFactory<UserServiceClient> {
    
    @Override
    public UserServiceClient create(Throwable cause) {
        return new UserServiceClient() {
            @Override
            public User getUser(Long id) {
                log.error("调用用户服务失败，userId: {}", id, cause);
                
                if (cause instanceof TimeoutException) {
                    return createTimeoutUser(id);
                } else if (cause instanceof ConnectException) {
                    return createConnectionErrorUser(id);
                } else {
                    return createDefaultUser(id);
                }
            }
            
            @Override
            public User createUser(CreateUserRequest request) {
                throw new ServiceUnavailableException("用户服务创建功能暂时不可用: " + cause.getMessage());
            }
        };
    }
}

// 4. Hystrix监控
@Configuration
@EnableHystrixMetricsStream
public class HystrixConfig {
    
    @Bean
    public ServletRegistrationBean<HystrixMetricsStreamServlet> hystrixMetricsStreamServlet() {
        ServletRegistrationBean<HystrixMetricsStreamServlet> registration = 
            new ServletRegistrationBean<>(new HystrixMetricsStreamServlet());
        registration.addUrlMappings("/hystrix.stream");
        return registration;
    }
}
```

### 🎯 服务链路追踪如何实现？

链路追踪帮助定位分布式系统中的性能瓶颈和故障点：

**Sleuth + Zipkin实现**：

```java
// 1. 添加链路追踪依赖和配置
# pom.xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-sleuth-zipkin</artifactId>
</dependency>

# application.yml
spring:
  sleuth:
    sampler:
      probability: 1.0  # 采样率（生产环境建议0.1）
    zipkin:
      base-url: http://localhost:9411
      sender:
        type: web
  application:
    name: order-service

// 2. 自定义Span
@Service
public class OrderService {
    
    private final Tracer tracer;
    private final UserServiceClient userServiceClient;
    
    public OrderService(Tracer tracer, UserServiceClient userServiceClient) {
        this.tracer = tracer;
        this.userServiceClient = userServiceClient;
    }
    
    @NewSpan("create-order")  // 自动创建新的Span
    public Order createOrder(@SpanTag("userId") Long userId, 
                           @SpanTag("productId") Long productId) {
        
        // 手动创建子Span
        Span userSpan = tracer.nextSpan()
            .name("get-user")
            .tag("user.id", String.valueOf(userId))
            .start();
            
        try (Tracer.SpanInScope ws = tracer.withSpanInScope(userSpan)) {
            User user = userServiceClient.getUser(userId);
            userSpan.tag("user.name", user.getUsername());
            
            // 继续处理订单逻辑
            return processOrder(user, productId);
            
        } catch (Exception e) {
            userSpan.tag("error", e.getMessage());
            throw e;
        } finally {
            userSpan.end();
        }
    }
    
    @NewSpan("process-order")
    private Order processOrder(@SpanTag("user") User user, 
                              @SpanTag("productId") Long productId) {
        
        // 添加自定义标签
        tracer.currentSpan()
            .tag("order.type", "online")
            .tag("user.level", user.getLevel().name());
            
        // 模拟业务处理
        Thread.sleep(100);
        
        Order order = Order.builder()
            .userId(user.getId())
            .productId(productId)
            .status(OrderStatus.CREATED)
            .build();
            
        // 记录事件
        tracer.currentSpan().annotate("order.created");
        
        return orderRepository.save(order);
    }
}

// 3. 链路追踪过滤器
@Component
public class TraceFilter implements Filter {
    
    private final Tracer tracer;
    
    public TraceFilter(Tracer tracer) {
        this.tracer = tracer;
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        // 创建根Span
        Span span = tracer.nextSpan()
            .name("http:" + httpRequest.getMethod().toLowerCase())
            .tag("http.method", httpRequest.getMethod())
            .tag("http.url", httpRequest.getRequestURL().toString())
            .tag("http.user_agent", httpRequest.getHeader("User-Agent"))
            .start();
            
        try (Tracer.SpanInScope ws = tracer.withSpanInScope(span)) {
            chain.doFilter(request, response);
            
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            span.tag("http.status_code", String.valueOf(httpResponse.getStatus()));
            
        } catch (Exception e) {
            span.tag("error", e.getMessage());
            throw e;
        } finally {
            span.end();
        }
    }
}

// 4. 链路追踪配置
@Configuration
public class TracingConfiguration {
    
    // 自定义采样策略
    @Bean
    public ProbabilityBasedSampler probabilityBasedSampler() {
        return new ProbabilityBasedSampler(0.1f);  // 10%采样率
    }
    
    // 自定义Span命名策略
    @Bean
    public SpanNamer spanNamer() {
        return new DefaultSpanNamer();
    }
    
    // 跳过某些URL的追踪
    @Bean
    public SkipPatternProvider skipPatternProvider() {
        return () -> Pattern.compile("/health|/metrics|/actuator/.*");
    }
    
    // 自定义标签
    @Bean
    public SpanCustomizer spanCustomizer() {
        return span -> {
            span.tag("service.version", "1.0.0");
            span.tag("service.env", "production");
        };
    }
}

// 5. 异步调用链路追踪
@Service
public class AsyncOrderService {
    
    private final Tracer tracer;
    
    @Async("orderExecutor")
    @TraceAsync  // 确保异步方法中的链路追踪
    public CompletableFuture<Order> processOrderAsync(Long orderId) {
        
        // 获取当前Span
        Span currentSpan = tracer.currentSpan();
        
        return CompletableFuture.supplyAsync(() -> {
            // 在异步线程中继续使用Span
            try (Tracer.SpanInScope ws = tracer.withSpanInScope(currentSpan)) {
                
                Span asyncSpan = tracer.nextSpan()
                    .name("async-process-order")
                    .tag("order.id", String.valueOf(orderId))
                    .start();
                    
                try (Tracer.SpanInScope asyncWs = tracer.withSpanInScope(asyncSpan)) {
                    // 异步处理逻辑
                    return processOrder(orderId);
                } finally {
                    asyncSpan.end();
                }
            }
        });
    }
}
```

---

## 💬 四、服务通信

**核心理念**：微服务间通信需要选择合适的方式，同步调用保证一致性，异步消息提高解耦性。

### 🎯 微服务间通信有哪些方式？

微服务通信模式及其适用场景：

**通信方式分类**：

| **通信模式** | **实现方式**       | **优点**           | **缺点**             | **适用场景**           |
| ------------ | ------------------ | ------------------ | -------------------- | ---------------------- |
| **同步调用** | HTTP/REST, RPC     | 简单直观，强一致性 | 耦合度高，级联故障   | 查询操作，实时性要求高 |
| **异步消息** | 消息队列，事件总线 | 解耦，高可用       | 复杂性高，最终一致性 | 业务流程，状态变更通知 |
| **事件驱动** | Event Sourcing     | 完全解耦，可重放   | 复杂度极高           | 复杂业务流程           |

**💻 通信实现示例**：

```java
// 1. 同步HTTP调用
@RestController
public class OrderController {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        
        // 方式1：RestTemplate调用
        User user = restTemplate.getForObject(
            "http://user-service/users/" + request.getUserId(), 
            User.class);
            
        // 方式2：Feign客户端调用
        Product product = userServiceClient.getProduct(request.getProductId());
        
        // 创建订单
        Order order = orderService.createOrder(user, product, request);
        
        return ResponseEntity.ok(order);
    }
}

// 2. 异步消息通信
@Service
public class OrderEventService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    // 发布订单创建事件
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        
        // RabbitMQ消息发送
        rabbitTemplate.convertAndSend(
            "order.exchange",
            "order.created", 
            event
        );
        
        // Kafka消息发送
        kafkaTemplate.send("order-events", event.getOrderId().toString(), event);
        
        log.info("订单创建事件已发布: {}", event.getOrderId());
    }
}

// 消息监听处理
@RabbitListener(queues = "inventory.order.created")
public class InventoryService {
    
    @RabbitHandler
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("处理订单创建事件，更新库存: {}", event.getOrderId());
        
        // 更新库存
        inventoryRepository.decreaseStock(
            event.getProductId(), 
            event.getQuantity()
        );
        
        // 发布库存更新事件
        applicationEventPublisher.publishEvent(
            new StockUpdatedEvent(event.getProductId(), event.getQuantity())
        );
    }
}

// 3. 事件驱动架构
@Component
public class OrderSagaOrchestrator {
    
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private ShippingService shippingService;
    
    @SagaOrchestrationStart
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        
        // 创建Saga实例
        SagaInstance saga = SagaInstance.builder()
            .sagaId(UUID.randomUUID().toString())
            .orderId(event.getOrderId())
            .status(SagaStatus.STARTED)
            .build();
            
        // 第一步：处理支付
        processPayment(saga, event);
    }
    
    private void processPayment(SagaInstance saga, OrderCreatedEvent event) {
        try {
            PaymentRequest paymentRequest = PaymentRequest.builder()
                .orderId(event.getOrderId())
                .amount(event.getTotalAmount())
                .userId(event.getUserId())
                .build();
                
            paymentService.processPaymentAsync(paymentRequest)
                .whenComplete((result, throwable) -> {
                    if (throwable == null) {
                        handlePaymentSuccess(saga, result);
                    } else {
                        handlePaymentFailure(saga, throwable);
                    }
                });
                
        } catch (Exception e) {
            handlePaymentFailure(saga, e);
        }
    }
    
    private void handlePaymentSuccess(SagaInstance saga, PaymentResult result) {
        saga.setStatus(SagaStatus.PAYMENT_COMPLETED);
        sagaRepository.save(saga);
        
        // 第二步：预留库存
        reserveInventory(saga);
    }
    
    private void handlePaymentFailure(SagaInstance saga, Throwable error) {
        saga.setStatus(SagaStatus.PAYMENT_FAILED);
        saga.setErrorMessage(error.getMessage());
        sagaRepository.save(saga);
        
        // 触发补偿事务
        cancelOrder(saga);
    }
}
```

### 🎯 如何设计API网关？

API网关是微服务架构的入口，统一处理横切关注点：

**网关核心功能**：

- 路由转发
- 认证授权
- 限流熔断
- 监控日志
- 协议转换

**💻 网关实现示例**：

```java
// 1. 网关路由配置
@Configuration
public class GatewayRouteConfig {
    
    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            
            // 用户服务路由
            .route("user-api", r -> r
                .path("/api/v1/users/**")
                .filters(f -> f
                    .stripPrefix(2)  // 去除 /api/v1 前缀
                    .addRequestHeader("X-Gateway-Version", "1.0")
                    .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiter())
                        .setKeyResolver(ipKeyResolver()))
                )
                .uri("lb://user-service")
            )
            
            // 订单服务路由（需要认证）
            .route("order-api", r -> r
                .path("/api/v1/orders/**")
                .filters(f -> f
                    .stripPrefix(2)
                    .filter(authenticationFilter())  // 自定义认证过滤器
                    .circuitBreaker(config -> config
                        .setName("order-circuit-breaker")
                        .setFallbackUri("forward:/fallback/order"))
                )
                .uri("lb://order-service")
            )
            
            // WebSocket路由
            .route("websocket-route", r -> r
                .path("/ws/**")
                .uri("lb:ws://websocket-service")
            )
            
            .build();
    }
    
    // 认证过滤器
    @Bean
    public GatewayFilter authenticationFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            
            // 检查认证头
            String authHeader = request.getHeaders().getFirst("Authorization");
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return unauthorizedResponse(exchange);
            }
            
            String token = authHeader.substring(7);
            
            // 验证JWT token
            return validateToken(token)
                .flatMap(userInfo -> {
                    // 添加用户信息到请求头
                    ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Id", userInfo.getUserId())
                        .header("X-User-Role", userInfo.getRole())
                        .build();
                        
                    return chain.filter(exchange.mutate()
                        .request(modifiedRequest)
                        .build());
                })
                .onErrorResume(throwable -> unauthorizedResponse(exchange));
        };
    }
    
    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add("Content-Type", "application/json");
        
        String body = "{\"error\":\"Unauthorized\",\"message\":\"Invalid or missing token\"}";
        DataBuffer buffer = response.bufferFactory().wrap(body.getBytes());
        
        return response.writeWith(Mono.just(buffer));
    }
}

// 2. 全局过滤器
@Component
public class GlobalLoggingFilter implements GlobalFilter, Ordered {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalLoggingFilter.class);
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        String requestId = UUID.randomUUID().toString();
        long startTime = System.currentTimeMillis();
        
        // 记录请求信息
        logger.info("Gateway Request - ID: {}, Method: {}, URL: {}, Headers: {}", 
            requestId, request.getMethod(), request.getURI(), request.getHeaders());
        
        // 添加请求ID到响应头
        exchange.getResponse().getHeaders().add("X-Request-Id", requestId);
        
        return chain.filter(exchange)
            .doOnSuccess(aVoid -> {
                long duration = System.currentTimeMillis() - startTime;
                logger.info("Gateway Response - ID: {}, Status: {}, Duration: {}ms",
                    requestId, exchange.getResponse().getStatusCode(), duration);
            })
            .doOnError(throwable -> {
                long duration = System.currentTimeMillis() - startTime;
                logger.error("Gateway Error - ID: {}, Duration: {}ms, Error: {}",
                    requestId, duration, throwable.getMessage(), throwable);
            });
    }
    
    @Override
    public int getOrder() {
        return -1; // 最高优先级
    }
}

// 3. 限流配置
@Configuration
public class RateLimitConfig {
    
    @Bean
    public RedisRateLimiter redisRateLimiter() {
        return new RedisRateLimiter(
            10,   // replenishRate: 每秒填充的令牌数
            20,   // burstCapacity: 令牌桶的容量  
            1     // requestedTokens: 每个请求消耗的令牌数
        );
    }
    
    // IP地址限流
    @Bean
    @Primary
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
            Objects.requireNonNull(exchange.getRequest().getRemoteAddress())
                .getAddress()
                .getHostAddress()
        );
    }
    
    // 用户ID限流
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest().getHeaders().getFirst("X-User-Id")
        );
    }
    
    // API路径限流
    @Bean
    public KeyResolver apiKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest().getPath().value()
        );
    }
}

// 4. 熔断降级
@RestController
public class FallbackController {
    
    @GetMapping("/fallback/user")
    public Mono<ResponseEntity<Object>> userFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "User Service Unavailable");
        response.put("message", "用户服务暂时不可用，请稍后重试");
        response.put("timestamp", System.currentTimeMillis());
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(response));
    }
    
    @GetMapping("/fallback/order")  
    public Mono<ResponseEntity<Object>> orderFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Order Service Unavailable");
        response.put("message", "订单服务暂时不可用，请稍后重试");
        response.put("timestamp", System.currentTimeMillis());
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(response));
    }
}

// 5. 网关监控
@Component
public class GatewayMetricsCollector {
    
    private final MeterRegistry meterRegistry;
    private final Counter requestCounter;
    private final Timer requestTimer;
    
    public GatewayMetricsCollector(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.requestCounter = Counter.builder("gateway.requests.total")
            .description("Total gateway requests")
            .register(meterRegistry);
        this.requestTimer = Timer.builder("gateway.requests.duration")
            .description("Gateway request duration")
            .register(meterRegistry);
    }
    
    @EventListener
    public void handleGatewayRequest(GatewayRequestEvent event) {
        requestCounter.increment(
            Tags.of(
                Tag.of("method", event.getMethod()),
                Tag.of("status", String.valueOf(event.getStatus())),
                Tag.of("service", event.getTargetService())
            )
        );
        
        requestTimer.record(event.getDuration(), TimeUnit.MILLISECONDS,
            Tags.of(
                Tag.of("service", event.getTargetService()),
                Tag.of("endpoint", event.getEndpoint())
            )
        );
    }
}
```

---

## 🗄️ 五、数据管理

**核心理念**：微服务数据管理需要平衡数据一致性和服务独立性，通过合理的数据架构设计实现业务目标。

### 🎯 微服务如何处理分布式事务？

分布式事务是微服务架构的核心挑战之一：

**分布式事务模式**：

1. **两阶段提交（2PC）**：强一致性，但性能差
2. **补偿事务（TCC）**：Try-Confirm-Cancel模式
3. **Saga模式**：长流程事务管理
4. **本地消息表**：最终一致性方案

**💻 Saga模式实现**：

```java
// 1. Saga编排器实现
@Component
public class OrderSagaOrchestrator {
    
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private ShippingService shippingService;
    @Autowired
    private SagaInstanceRepository sagaRepository;
    
    // 订单创建Saga流程
    @SagaStart
    public void createOrderSaga(CreateOrderCommand command) {
        
        SagaInstance saga = SagaInstance.builder()
            .sagaId(UUID.randomUUID().toString())
            .orderId(command.getOrderId())
            .status(SagaStatus.STARTED)
            .compensations(new ArrayList<>())
            .build();
            
        sagaRepository.save(saga);
        
        try {
            // 步骤1：创建订单
            createOrder(saga, command);
            
        } catch (Exception e) {
            handleSagaFailure(saga, e);
        }
    }
    
    private void createOrder(SagaInstance saga, CreateOrderCommand command) {
        try {
            Order order = orderService.createOrder(command);
            saga.addCompensation(new CancelOrderCompensation(order.getId()));
            
            // 步骤2：处理支付
            processPayment(saga, order);
            
        } catch (Exception e) {
            throw new SagaException("创建订单失败", e);
        }
    }
    
    private void processPayment(SagaInstance saga, Order order) {
        try {
            PaymentResult result = paymentService.processPayment(
                PaymentRequest.builder()
                    .orderId(order.getId())
                    .amount(order.getTotalAmount())
                    .userId(order.getUserId())
                    .build()
            );
            
            saga.addCompensation(new RefundPaymentCompensation(result.getPaymentId()));
            
            // 步骤3：预留库存
            reserveInventory(saga, order);
            
        } catch (Exception e) {
            executeCompensations(saga);
            throw new SagaException("支付处理失败", e);
        }
    }
    
    private void reserveInventory(SagaInstance saga, Order order) {
        try {
            for (OrderItem item : order.getItems()) {
                InventoryReservation reservation = inventoryService.reserveInventory(
                    ReserveInventoryRequest.builder()
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .orderId(order.getId())
                        .build()
                );
                
                saga.addCompensation(
                    new ReleaseInventoryCompensation(reservation.getReservationId())
                );
            }
            
            // 步骤4：安排发货
            arrangeShipping(saga, order);
            
        } catch (Exception e) {
            executeCompensations(saga);
            throw new SagaException("库存预留失败", e);
        }
    }
    
    private void arrangeShipping(SagaInstance saga, Order order) {
        try {
            ShippingOrder shippingOrder = shippingService.createShippingOrder(
                CreateShippingOrderRequest.builder()
                    .orderId(order.getId())
                    .address(order.getShippingAddress())
                    .items(order.getItems())
                    .build()
            );
            
            saga.addCompensation(
                new CancelShippingCompensation(shippingOrder.getId())
            );
            
            // Saga成功完成
            completeSaga(saga);
            
        } catch (Exception e) {
            executeCompensations(saga);
            throw new SagaException("安排发货失败", e);
        }
    }
    
    private void completeSaga(SagaInstance saga) {
        saga.setStatus(SagaStatus.COMPLETED);
        saga.setCompletedAt(LocalDateTime.now());
        sagaRepository.save(saga);
        
        // 发布Saga完成事件
        eventPublisher.publishEvent(new SagaCompletedEvent(saga.getSagaId()));
    }
    
    private void executeCompensations(SagaInstance saga) {
        saga.setStatus(SagaStatus.COMPENSATING);
        sagaRepository.save(saga);
        
        // 逆序执行补偿操作
        List<Compensation> compensations = saga.getCompensations();
        Collections.reverse(compensations);
        
        for (Compensation compensation : compensations) {
            try {
                compensation.execute();
                compensation.setStatus(CompensationStatus.COMPLETED);
            } catch (Exception e) {
                compensation.setStatus(CompensationStatus.FAILED);
                log.error("补偿操作失败: {}", compensation.getClass().getSimpleName(), e);
            }
        }
        
        saga.setStatus(SagaStatus.COMPENSATED);
        sagaRepository.save(saga);
    }
}

// 2. TCC模式实现
@Service
@Transactional
public class AccountTccService {
    
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TccTransactionRepository tccTransactionRepository;
    
    /**
     * Try阶段：预留资源
     */
    @TccTry
    public void tryDebit(String accountId, BigDecimal amount, String transactionId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new AccountNotFoundException(accountId));
            
        // 检查余额
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(accountId, amount);
        }
        
        // 冻结资金
        account.setBalance(account.getBalance().subtract(amount));
        account.setFrozenAmount(account.getFrozenAmount().add(amount));
        accountRepository.save(account);
        
        // 记录TCC事务
        TccTransaction tccTransaction = TccTransaction.builder()
            .transactionId(transactionId)
            .accountId(accountId)
            .amount(amount)
            .status(TccStatus.TRIED)
            .type(TccType.DEBIT)
            .createdAt(LocalDateTime.now())
            .build();
            
        tccTransactionRepository.save(tccTransaction);
    }
    
    /**
     * Confirm阶段：确认事务
     */
    @TccConfirm
    public void confirmDebit(String transactionId) {
        TccTransaction tccTransaction = tccTransactionRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new TccTransactionNotFoundException(transactionId));
            
        if (tccTransaction.getStatus() != TccStatus.TRIED) {
            throw new IllegalTccStatusException(transactionId, tccTransaction.getStatus());
        }
        
        Account account = accountRepository.findById(tccTransaction.getAccountId())
            .orElseThrow(() -> new AccountNotFoundException(tccTransaction.getAccountId()));
            
        // 确认扣款，释放冻结资金
        account.setFrozenAmount(account.getFrozenAmount().subtract(tccTransaction.getAmount()));
        accountRepository.save(account);
        
        // 更新TCC事务状态
        tccTransaction.setStatus(TccStatus.CONFIRMED);
        tccTransaction.setUpdatedAt(LocalDateTime.now());
        tccTransactionRepository.save(tccTransaction);
    }
    
    /**
     * Cancel阶段：取消事务
     */
    @TccCancel
    public void cancelDebit(String transactionId) {
        TccTransaction tccTransaction = tccTransactionRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new TccTransactionNotFoundException(transactionId));
            
        if (tccTransaction.getStatus() != TccStatus.TRIED) {
            // 幂等处理：如果已经取消或确认，直接返回
            return;
        }
        
        Account account = accountRepository.findById(tccTransaction.getAccountId())
            .orElseThrow(() -> new AccountNotFoundException(tccTransaction.getAccountId()));
            
        // 恢复账户余额
        account.setBalance(account.getBalance().add(tccTransaction.getAmount()));
        account.setFrozenAmount(account.getFrozenAmount().subtract(tccTransaction.getAmount()));
        accountRepository.save(account);
        
        // 更新TCC事务状态
        tccTransaction.setStatus(TccStatus.CANCELLED);
        tccTransaction.setUpdatedAt(LocalDateTime.now());
        tccTransactionRepository.save(tccTransaction);
    }
}

// 3. 本地消息表模式
@Service
@Transactional
public class OrderServiceWithLocalMessage {
    
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private LocalMessageRepository localMessageRepository;
    
    public Order createOrder(CreateOrderRequest request) {
        // 本地事务中同时操作业务数据和消息表
        Order order = Order.builder()
            .userId(request.getUserId())
            .productId(request.getProductId())
            .quantity(request.getQuantity())
            .status(OrderStatus.CREATED)
            .createdAt(LocalDateTime.now())
            .build();
            
        order = orderRepository.save(order);
        
        // 保存待发送消息
        LocalMessage message = LocalMessage.builder()
            .id(UUID.randomUUID().toString())
            .topic("order-events")
            .key(order.getId().toString())
            .payload(JsonUtils.toJson(new OrderCreatedEvent(order)))
            .status(MessageStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .maxRetries(3)
            .currentRetries(0)
            .build();
            
        localMessageRepository.save(message);
        
        return order;
    }
    
    // 定时任务发送未成功的消息
    @Scheduled(fixedDelay = 5000)
    public void sendPendingMessages() {
        List<LocalMessage> pendingMessages = localMessageRepository
            .findByStatusAndCurrentRetriesLessThan(MessageStatus.PENDING, 3);
            
        for (LocalMessage message : pendingMessages) {
            try {
                // 发送消息
                kafkaTemplate.send(message.getTopic(), message.getKey(), message.getPayload())
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            // 发送成功
                            message.setStatus(MessageStatus.SENT);
                            message.setSentAt(LocalDateTime.now());
                        } else {
                            // 发送失败，增加重试次数
                            message.setCurrentRetries(message.getCurrentRetries() + 1);
                            if (message.getCurrentRetries() >= message.getMaxRetries()) {
                                message.setStatus(MessageStatus.FAILED);
                                message.setErrorMessage(ex.getMessage());
                            }
                        }
                        localMessageRepository.save(message);
                    });
                    
            } catch (Exception e) {
                log.error("发送消息失败: {}", message.getId(), e);
                message.setCurrentRetries(message.getCurrentRetries() + 1);
                if (message.getCurrentRetries() >= message.getMaxRetries()) {
                    message.setStatus(MessageStatus.FAILED);
                    message.setErrorMessage(e.getMessage());
                }
                localMessageRepository.save(message);
            }
        }
    }
}
```

### 🎯 如何实现数据一致性？

微服务环境下的数据一致性策略：

**一致性级别**：

- **强一致性**：所有节点同时看到相同数据
- **弱一致性**：允许临时不一致
- **最终一致性**：保证最终数据一致

**💻 实现方案**：

```java
// 1. 事件溯源（Event Sourcing）
@Entity
public class OrderAggregate {
    
    @Id
    private String orderId;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderEvent> events = new ArrayList<>();
    
    // 从事件重建聚合状态
    public static OrderAggregate fromEvents(List<OrderEvent> events) {
        OrderAggregate aggregate = new OrderAggregate();
        
        for (OrderEvent event : events) {
            aggregate.applyEvent(event);
        }
        
        return aggregate;
    }
    
    private void applyEvent(OrderEvent event) {
        switch (event.getEventType()) {
            case ORDER_CREATED:
                OrderCreatedEvent createdEvent = (OrderCreatedEvent) event.getEventData();
                this.orderId = createdEvent.getOrderId();
                this.status = OrderStatus.CREATED;
                this.totalAmount = createdEvent.getTotalAmount();
                this.createdAt = createdEvent.getCreatedAt();
                break;
                
            case ORDER_PAID:
                this.status = OrderStatus.PAID;
                break;
                
            case ORDER_SHIPPED:
                this.status = OrderStatus.SHIPPED;
                break;
                
            case ORDER_CANCELLED:
                this.status = OrderStatus.CANCELLED;
                break;
        }
    }
    
    // 创建订单
    public void createOrder(CreateOrderCommand command) {
        // 业务验证
        validateCreateOrder(command);
        
        // 生成事件
        OrderCreatedEvent event = OrderCreatedEvent.builder()
            .orderId(command.getOrderId())
            .userId(command.getUserId())
            .totalAmount(command.getTotalAmount())
            .items(command.getItems())
            .createdAt(LocalDateTime.now())
            .build();
            
        addEvent(new OrderEvent(EventType.ORDER_CREATED, event));
        applyEvent(events.get(events.size() - 1));
    }
    
    private void addEvent(OrderEvent event) {
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(LocalDateTime.now());
        event.setVersion(events.size() + 1);
        events.add(event);
    }
}

// 2. CQRS模式实现
// 命令端（写模型）
@Service
public class OrderCommandService {
    
    @Autowired
    private OrderEventStore eventStore;
    
    public void createOrder(CreateOrderCommand command) {
        // 加载聚合
        OrderAggregate aggregate = eventStore.loadAggregate(command.getOrderId());
        
        // 执行业务逻辑
        aggregate.createOrder(command);
        
        // 保存事件
        eventStore.saveEvents(command.getOrderId(), aggregate.getUncommittedEvents());
        
        // 发布事件
        publishEvents(aggregate.getUncommittedEvents());
    }
    
    private void publishEvents(List<OrderEvent> events) {
        for (OrderEvent event : events) {
            eventPublisher.publishEvent(event);
        }
    }
}

// 查询端（读模型）
@Service
public class OrderQueryService {
    
    @Autowired
    private OrderReadModelRepository readModelRepository;
    
    // 处理订单创建事件，更新读模型
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        OrderReadModel readModel = OrderReadModel.builder()
            .orderId(event.getOrderId())
            .userId(event.getUserId())
            .status("CREATED")
            .totalAmount(event.getTotalAmount())
            .createdAt(event.getCreatedAt())
            .build();
            
        readModelRepository.save(readModel);
    }
    
    @EventListener
    public void handleOrderPaid(OrderPaidEvent event) {
        OrderReadModel readModel = readModelRepository.findById(event.getOrderId())
            .orElseThrow(() -> new OrderNotFoundException(event.getOrderId()));
            
        readModel.setStatus("PAID");
        readModel.setPaidAt(event.getPaidAt());
        
        readModelRepository.save(readModel);
    }
    
    // 查询方法
    public Page<OrderReadModel> findOrdersByUser(String userId, Pageable pageable) {
        return readModelRepository.findByUserId(userId, pageable);
    }
    
    public Optional<OrderReadModel> findOrderById(String orderId) {
        return readModelRepository.findById(orderId);
    }
}

// 3. 数据同步策略
@Component
public class DataSynchronizer {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 缓存一致性：写后删除模式
    @EventListener
    @Async
    public void handleDataUpdated(DataUpdatedEvent event) {
        // 删除相关缓存
        Set<String> keys = redisTemplate.keys("user:" + event.getUserId() + ":*");
        if (!keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
        
        // 预热重要缓存
        if (event.isImportantData()) {
            preloadCache(event.getUserId());
        }
    }
    
    // 双写一致性：先更新数据库，再更新缓存
    @Transactional
    public void updateUserData(String userId, UserData userData) {
        // 1. 更新数据库
        userRepository.updateUser(userId, userData);
        
        // 2. 更新缓存（可能失败）
        try {
            redisTemplate.opsForValue().set("user:" + userId, userData, Duration.ofHours(1));
        } catch (Exception e) {
            log.warn("更新缓存失败，用户ID: {}", userId, e);
            // 异步重试更新缓存
            asyncUpdateCache(userId, userData);
        }
    }
    
    @Async
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public void asyncUpdateCache(String userId, UserData userData) {
        redisTemplate.opsForValue().set("user:" + userId, userData, Duration.ofHours(1));
    }
}
```

---

## 🎯 面试重点总结

### 高频考点速览

- **架构理念**：微服务vs单体对比、拆分原则、边界设计的系统性思考
- **Spring Cloud**：核心组件功能、Eureka注册发现、Config配置管理、Gateway路由机制
- **服务治理**：熔断降级、链路追踪、负载均衡的设计与实现原理
- **服务通信**：同步异步调用选择、API网关设计、消息驱动架构
- **数据管理**：分布式事务处理、数据一致性保证、CQRS模式应用
- **实践经验**：架构演进路径、性能优化手段、故障排查方法

### 面试答题策略

1. **架构设计题**：先分析业务场景，再阐述技术方案，最后说明权衡考虑
2. **技术原理题**：从问题背景出发，讲解实现原理，对比不同方案优劣
3. **实践经验题**：结合具体项目场景，展示问题解决思路和优化效果
4. **故障处理题**：系统性分析故障现象、定位过程、解决方案、预防措施

---

## 📚 扩展学习

- **官方文档**：Spring Cloud、Netflix OSS等框架的官方文档深入学习
- **架构实践**：研读大厂微服务架构实践案例，了解真实场景的技术选型
- **源码分析**：深入Spring Cloud核心组件源码，理解实现原理和设计思想
- **性能优化**：学习微服务性能监控、调优方法和工具使用
- **运维实践**：掌握微服务部署、监控、故障排查的DevOps实践
