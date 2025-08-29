---
title: MyBatis/ORM框架面试题大全
date: 2024-12-15
tags: 
 - MyBatis
 - ORM
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

>  MyBatis作为Java生态中**最流行的半自动ORM框架**，是面试中的**必考重点**。从SQL映射到动态SQL，从缓存机制到性能调优，每一个知识点都可能成为面试的关键。本文档将**MyBatis核心知识**整理成**标准面试话术**，并补充JPA、Hibernate等ORM框架对比，让你在面试中游刃有余！
>
>
>  MyBatis 面试，围绕着这么几个核心方向准备：
>
>  - **MyBatis核心原理**（SqlSession、Mapper代理、执行流程、参数映射、结果映射）
>  - **动态SQL与映射**（#{} vs ${}、动态SQL标签、resultMap、关联查询）  
>  - **缓存机制**（一级缓存、二级缓存、缓存失效、自定义缓存）
>  - **插件与扩展**（拦截器机制、分页插件、性能监控、审计字段）
>  - **事务与数据源**（Spring集成、多数据源、分布式事务、读写分离）
>  - **性能优化**（N+1问题、批处理、连接池、SQL调优、执行计划）
>  - **ORM框架对比**（MyBatis vs JPA/Hibernate、MyBatis-Plus特性分析）

## 🗺️ 知识导航

### 🏷️ 核心知识分类

1. **基础与架构**：MyBatis架构、执行流程、Mapper机制、类型与结果映射
2. **SQL与动态SQL**：#{} vs ${}、动态SQL标签、批量操作、联表/关联查询
3. **缓存机制**：一级缓存、二级缓存、缓存命中与失效场景、自定义缓存
4. **插件与扩展**：拦截器四大点位、插件链、分页、审计、加解密
5. **事务与多数据源**：Spring整合、事务传播、Seata/分布式事务、读写分离
6. **性能与调优**：参数与日志、批处理、延迟加载、N+1、连接池、索引与执行计划
7. **工程化与规范**：Mapper规范、SQL规范、错误码与异常处理、灰度与回滚
8. **ORM生态对比**：MyBatis vs JPA/Hibernate、MyBatis-Plus特性与利弊

---

## 🧠 一、MyBatis核心原理

 **核心理念**：半自动ORM框架，提供SQL与Java对象之间的映射，保持SQL的灵活性和可控性。

### 🎯 JDBC 有几个步骤？

JDBC（Java DataBase Connectivity）是 Java 程序与关系型数据库交互的统一 API

JDBC 大致可以分为六个步骤：

1. 注册数据库驱动类，指定数据库地址，其中包括 DB 的用户名、密码及其他连接信息；
2. 调用 `DriverManager.getConnection()` 方法创建 Connection 连接到数据库；
3. 调用 Connection 的 `createStatement() `或 `prepareStatement()` 方法，创建 Statement 对象，此时会指定 SQL（或是 SQL 语句模板 + SQL 参数）；
4. 通过 Statement 对象执行 SQL 语句，得到 ResultSet 对象，也就是查询结果集；
5. 遍历 ResultSet，从结果集中读取数据，并将每一行数据库记录转换成一个 JavaBean 对象；
6. 关闭 ResultSet 结果集、Statement 对象及数据库 Connection，从而释放这些对象占用的底层资源。



### 🎯 什么是 ORM?

全称为 Object Relational Mapping。对象-映射-关系型数据库。对象关系映射(简称 ORM，或 O/RM，或 O/R mapping)，用于实现面向对象编程语言里不同类型系统的数据之间的转换。简单的说，ORM 是通过使用描述对象和数据库之间映射的元数据，将程序中的对象与关系数据库相互映射。

ORM 提供了实现持久化层的另一种模式，它采用映射元数据来描述对象关系的映射，使得 ORM 中间件能在任何一个应用的业务逻辑层和数据库层之间充当桥梁。

无论是执行查询操作，还是执行其他 DML 操作，JDBC 操作步骤都会重复出现。为了简化重复逻辑，提高代码的可维护性，可以将 JDBC 重复逻辑封装到一个类似 DBUtils 的工具类中，在使用时只需要调用 DBUtils 工具类中的方法即可。当然，我们也可以使用“反射+配置”的方式，将关系模型到对象模型的转换进行封装，但是这种封装要做到通用化且兼顾灵活性，就需要一定的编程功底。

**ORM 框架的核心功能：根据配置（配置文件或是注解）实现对象模型、关系模型两者之间无感知的映射**（如下图）。

![What is ORM. Object-relational mapping (ORM) emerged… | by Kavya | Medium](https://miro.medium.com/v2/resize:fit:1200/0*MAXI8BnsQC4G5rcg.png)

在生产环境中，数据库一般都是比较稀缺的，数据库连接也是整个服务中比较珍贵的资源之一。建立数据库连接涉及鉴权、握手等一系列网络操作，是一个比较耗时的操作，所以我们不能像上述 JDBC 基本操作流程那样直接释放掉数据库连接，否则持久层很容易成为整个系统的性能瓶颈。

Java 程序员一般会使用数据库连接池的方式进行优化，此时就需要引入第三方的连接池实现，当然，也可以自研一个连接池，但是要处理连接活跃数、控制连接的状态等一系列操作还是有一定难度的。另外，有一些查询返回的数据是需要本地缓存的，这样可以提高整个程序的查询性能，这就需要缓存的支持。

如果没有 ORM 框架的存在，这就需要我们 Java 开发者熟悉相关连接池、缓存等组件的 API 并手动编写一些“黏合”代码来完成集成，而且这些代码重复度很高，这显然不是我们希望看到的结果。

很多 ORM 框架都支持集成第三方缓存、第三方数据源等常用组件，并对外提供统一的配置接入方式，这样我们只需要使用简单的配置即可完成第三方组件的集成。当我们需要更换某个第三方组件的时候，只需要引入相关依赖并更新配置即可，这就大大提高了开发效率以及整个系统的可维护性。



### 🎯 什么是MyBatis？核心组件和架构是什么？

> MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。
>
> MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。
>
> MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

MyBatis是一个半自动的ORM持久化框架：

**MyBatis定义**：

- 支持自定义SQL、存储过程和高级映射
- 避免了几乎所有的JDBC代码和手动设置参数
- 使用简单的XML或注解用于配置和原始映射
- 将接口和Java的POJO映射成数据库中的记录

**MyBatis核心组件**：

**1. SqlSessionFactory**：
- MyBatis的核心对象，用于创建SqlSession
- 通过SqlSessionFactoryBuilder构建
- 一个应用只需要一个SqlSessionFactory实例
- 生命周期应该是应用级别的

**2. SqlSession**：
- 执行SQL命令的主要接口
- 包含了面向数据库执行的所有方法
- 线程不安全，不能被共享
- 使用后需要关闭以释放资源

**3. Executor（执行器）**：
- MyBatis的核心执行器接口
- SimpleExecutor：简单执行器，每次执行都创建Statement
- ReuseExecutor：复用执行器，复用PreparedStatement
- BatchExecutor：批量执行器，用于批量更新操作

**4. MappedStatement**：
- 映射语句的封装对象
- 包含SQL配置信息、参数映射、结果映射等
- 每个<select>、<insert>、<update>、<delete>对应一个MappedStatement

**5. TypeHandler**：
- 类型处理器，用于JDBC类型和Java类型之间的转换
- 设置参数时Java类型转换为JDBC类型
- 获取结果时JDBC类型转换为Java类型

**6. ObjectFactory**：
- 对象工厂，用于创建结果对象实例
- 默认使用无参构造器或按参数列表的构造器
- 可以自定义ObjectFactory扩展对象创建逻辑

**7. Plugin（插件）**：
- MyBatis允许在已映射语句执行过程中的某一点进行拦截调用
- 默认情况下可以拦截Executor、ParameterHandler、ResultSetHandler、StatementHandler的方法调用

**MyBatis整体架构**：
- 接口层：Mapper接口
- 数据处理层：ParameterHandler、ResultSetHandler、TypeHandler
- 框架支持层：SqlSession、Executor、MappedStatement
- 引导层：配置文件（mybatis-config.xml、XXXMapper.xml）

**💻 代码示例**：

```java
// 基本使用示例
public class MyBatisExample {
    private SqlSessionFactory sqlSessionFactory;
    
    public User getUserById(Long id) {
        try (SqlSession session = sqlSessionFactory.openSession()) {
            UserMapper mapper = session.getMapper(UserMapper.class);
            return mapper.selectById(id);
        }
    }
}

// Mapper接口定义
public interface UserMapper {
    User selectById(@Param("id") Long id);
    int insert(User user);
    List<User> selectByCondition(@Param("name") String name, 
                                @Param("status") Integer status);
}
```



### 🎯 MyBatis的执行流程是什么？

MyBatis的执行流程包括初始化、SQL执行和结果处理三个阶段：

**完整执行流程**：

**1. 配置加载阶段**：
- 读取mybatis-config.xml全局配置文件
- 解析映射文件（XXXMapper.xml）或注解
- 创建配置Configuration对象存储配置信息
- 构建SqlSessionFactory实例

**2. 会话创建阶段**：
- 调用SqlSessionFactory.openSession()创建SqlSession
- SqlSession内部创建Executor执行器
- 根据配置选择SimpleExecutor/ReuseExecutor/BatchExecutor

**3. 获取Mapper代理**：
- 调用SqlSession.getMapper()获取Mapper接口代理对象
- MyBatis使用JDK动态代理创建MapperProxy
- MapperProxy实现InvocationHandler接口

**4. 方法调用阶段**：
- 调用Mapper接口方法
- MapperProxy拦截方法调用
- 根据namespace + id获取MappedStatement
- 调用Executor执行具体操作

**5. 参数处理阶段**：
- ParameterHandler处理输入参数
- 根据TypeHandler将Java类型转换为JDBC类型
- 设置PreparedStatement的参数

**6. SQL执行阶段**：
- StatementHandler准备SQL语句
- 调用PreparedStatement.execute()执行SQL
- 对于查询返回ResultSet，对于更新返回影响行数

**7. 结果处理阶段**：
- ResultSetHandler处理查询结果
- 根据resultMap或resultType配置进行结果映射
- 使用TypeHandler将JDBC类型转换为Java类型
- 返回最终的Java对象

**8. 资源释放阶段**：
- 关闭ResultSet、PreparedStatement、Connection
- 释放SqlSession资源
- 清理一级缓存（如果需要）

**💻 代码示例**：

```java
// MyBatis执行流程示例
public User selectUser(Long userId) {
    try (SqlSession session = sqlSessionFactory.openSession()) {
        UserMapper mapper = session.getMapper(UserMapper.class);
        return mapper.selectById(userId);
    }
}
```



### 🎯 为什么说Mybatis是半自动ORM映射工具？它与全自动的区别在哪里？

ORM（Object Relational Mapping），对象关系映射，是一种为了解决关系型数据库数据与简单Java对象（POJO）的映射关系的技术。

Hibernate属于全自动ORM映射工具，使用Hibernate查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。

Mybatis在查询关联对象或关联集合对象时，需要手动编写sql来完成，所以，称之为半自动ORM映射工具。



### 🎯 Mybatis优缺点

**优点**

与传统的数据库访问技术相比，ORM有以下优点：

- 基于SQL语句编程，相当灵活，不会对应用程序或者数据库的现有设计造成任何影响，SQL写在XML里，解除SQL与程序代码的耦合，便于统一管理；提供XML标签，支持编写动态SQL语句，并可重用
- 与JDBC相比，减少了50%以上的代码量，消除了JDBC大量冗余的代码，不需要手动开关连接
- 很好的与各种数据库兼容（因为MyBatis使用JDBC来连接数据库，所以只要JDBC支持的数据库MyBatis都支持）
- 提供映射标签，支持对象与数据库的字段映射；提供对象关系映射标签，支持对象关系组件维护
- 能够与Spring很好的集成

**缺点**

- SQL语句的编写工作量较大，尤其当字段多、关联表多时，对开发人员编写SQL语句的功底有一定要求
- SQL语句依赖于数据库，导致数据库移植性差，不能随意更换数据库



### 🎯 MyBatis的工作原理

1. 读取 MyBatis 配置文件：mybatis-config.xml 为 MyBatis 的全局配置文件，包含了 MyBatis 行为的设置和属性信息，例如数据库连接信息和映射文件。（我们一般是通过Spring 整合，用 SqlSessionFactoryBean 配置 dataSource 和 mapper 地址等，其实现了InitializingBean 、FactoryBean、ApplicationListener 三个接口 ）
2. 加载映射文件mapper.xml。映射文件即 SQL 映射文件，该文件中配置了操作数据库的 SQL 语句，需要在 MyBatis 配置文件 mybatis-config.xml 中加载。mybatis-config.xml 文件可以加载多个映射文件，每个文件对应数据库中的一张表（MyBatis 会将 Mapper 映射文件中定义的 SQL 语句解析成 SqlSource 对象，其中的动态标签、SQL 语句文本等，会解析成对应类型的 SqlNode 对象）。
3. 构造会话工厂：通过 MyBatis 的环境等配置信息构建会话工厂 SqlSessionFactory。 
4. 创建会话对象：由会话工厂创建 SqlSession 对象，该对象中包含了执行 SQL 语句的所有方法。
5. Executor 执行器：MyBatis 底层定义了一个 Executor 接口来操作数据库，它将根据 SqlSession 传递的参数动态地生成需要执行的 SQL 语句，同时负责查询缓存的维护。
6. MappedStatement 对象：在 Executor 接口的执行方法中有一个 MappedStatement 类型的参数，该参数是对映射信息的封装，用于存储要映射的 SQL 语句的 id、参数等信息。
7. 输入参数映射：输入参数类型可以是 Map、List 等集合类型，也可以是基本数据类型和 POJO 类型。输入参数映射过程类似于 JDBC 对 preparedStatement 对象设置参数的过程。
8. 输出结果映射：输出结果类型可以是 Map、 List 等集合类型，也可以是基本数据类型和 POJO 类型。输出结果映射过程类似于 JDBC 对结果集的解析过程。



### 🎯 MyBatis的架构设计是怎样的

![img](https://oss-emcsprod-public.modb.pro/wechatSpider/modb_20210809_cd427228-f90f-11eb-8882-00163e068ecd.png)

我们把Mybatis的功能架构分为四层：

- API接口层：提供给外部使用的接口API，开发人员通过这些本地API来操纵数据库。接口层一接收到调用请求就会调用数据处理层来完成具体的数据处理。
- 数据处理层：负责具体的SQL查找、SQL解析、SQL执行和执行结果映射处理等。它主要的目的是根据调用的请求完成一次数据库操作。
- 基础支撑层：负责最基础的功能支撑，包括连接管理、事务管理、配置加载和缓存处理，这些都是共用的东西，将他们抽取出来作为最基础的组件。为上层的数据处理层提供最基础的支撑。
- 引导层：加载xml配置和Java配置

---

## 🧩 二、SQL与动态SQL

 **核心理念**：MyBatis提供强大的动态SQL功能，支持参数化查询和灵活的SQL构建，在保证安全性的同时提供最大的SQL控制能力。

### 🎯 #{} 与 ${} 有什么区别？各自的使用场景是什么？

> - \#{}是占位符，预编译处理，可以防止SQL注入；${}是拼接符，字符串替换，没有预编译处理，不能防止SQL注入。
> - Mybatis在处理#{}时，#{}传入参数是以字符串传入，会将SQL中的#{}替换为?号，调用PreparedStatement的set方法来赋值；Mybatis在处理\${}时，是原值传入，就是把${}替换成变量的值，相当于JDBC中的Statement编译
> - \#{} 的变量替换是在DBMS 中，变量替换后，#{} 对应的变量自动加上单引号；\${} 的变量替换是在 DBMS 外，变量替换后，${} 对应的变量不会加上单引号

#{} 和 ${} 是MyBatis中两种不同的参数占位符，它们在SQL处理方式和安全性上有本质区别：

**#{}占位符（推荐使用）**：

**实现机制**：
- 使用PreparedStatement的参数占位符
- SQL编译时生成？占位符，运行时通过setXxx()方法设置参数值
- 参数值会被自动转义，防止SQL注入攻击

**特点优势**：
- **安全性高**：自动防止SQL注入，参数值被当作字面值处理
- **类型处理**：支持TypeHandler进行类型转换
- **性能优化**：PreparedStatement可以复用执行计划
- **自动转义**：字符串参数自动加引号，日期等类型自动格式化

**适用场景**：
- 传递查询条件的值（如WHERE子句中的条件值）
- INSERT、UPDATE语句中的数据值
- 任何需要参数化的场景（推荐默认选择）

**${}占位符（谨慎使用）**：

**实现机制**：
- 直接进行字符串替换（String Substitution）
- 在SQL解析阶段直接将参数值拼接到SQL语句中
- 不使用PreparedStatement的参数绑定

**特点风险**：
- **SQL注入风险**：参数值直接拼接，恶意输入可能改变SQL结构
- **类型处理限制**：不支持自动类型转换
- **性能影响**：每次都是新的SQL语句，无法复用执行计划

**适用场景**：
- **动态表名**：SELECT * FROM ${tableName} WHERE id = #{id}
- **动态列名**：SELECT ${columnName} FROM user WHERE id = #{id}
- **动态ORDER BY**：SELECT * FROM user ORDER BY ${sortField} ${sortOrder}
- **动态SQL片段**：需要动态改变SQL结构的场景

**安全使用${} 的最佳实践**：
- 严格校验输入参数，使用白名单机制
- 避免直接使用用户输入，通过枚举或配置映射
- 结合其他验证机制确保参数安全性

**💻 代码示例**：

```java
// Mapper接口
public interface UserMapper {
    
    // 使用#{}进行参数化查询（安全）
    User findByIdAndName(@Param("id") Long id, @Param("name") String name);
    
    // 使用${}进行动态表名（需谨慎）
    List<User> findByTableName(@Param("tableName") String tableName);
    
    // 动态排序字段
    List<User> findUsersWithSort(@Param("sortField") String sortField, 
                                @Param("sortOrder") String sortOrder);
    
    // 批量查询特定列
    List<Map<String, Object>> selectColumns(@Param("columns") String columns);
}
```

```xml
<!-- MyBatis XML映射文件 -->
<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 使用#{}的安全查询 -->
    <select id="findByIdAndName" resultType="User">
        SELECT * FROM user 
        WHERE id = #{id} AND name = #{name}
        <!-- 编译后：SELECT * FROM user WHERE id = ? AND name = ? -->
    </select>
    
    <!-- 使用${}的动态表名（需严格校验tableName参数） -->
    <select id="findByTableName" resultType="User">
        SELECT * FROM ${tableName}
        <!-- 编译后：SELECT * FROM user_2024 -->
    </select>
    
    <!-- 动态排序（需校验排序字段和方向） -->
    <select id="findUsersWithSort" resultType="User">
        SELECT * FROM user 
        ORDER BY ${sortField} ${sortOrder}
        <!-- 编译后：SELECT * FROM user ORDER BY create_time DESC -->
    </select>
    
    <!-- 动态列查询 -->
    <select id="selectColumns" resultType="map">
        SELECT ${columns} FROM user
        <!-- 编译后：SELECT id,name,email FROM user -->
    </select>
    
    <!-- 复合使用示例 -->
    <select id="dynamicQuery" resultType="User">
        SELECT * FROM ${tableName}
        <where>
            <if test="id != null">
                AND id = #{id}
            </if>
            <if test="name != null and name != ''">
                AND name LIKE CONCAT('%', #{name}, '%')
            </if>
            <if test="status != null">
                AND status = #{status}
            </if>
        </where>
        <if test="sortField != null and sortOrder != null">
            ORDER BY ${sortField} ${sortOrder}
        </if>
    </select>
</mapper>
```

```java
// 安全使用${}的Service层实现
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    // 表名白名单，防止SQL注入
    private static final Set<String> ALLOWED_TABLES = Set.of(
        "user", "user_backup", "user_2024", "user_archive
    );
    
    // 允许的排序字段白名单
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "id", "name", "email", "create_time", "update_time
    );
    
    public List<User> findByTableName(String tableName) {
        // 严格校验表名，防止SQL注入
        if (!ALLOWED_TABLES.contains(tableName)) {
            throw new IllegalArgumentException("Invalid table name: " + tableName);
        }
        
        return userMapper.findByTableName(tableName);
    }
    
    public List<User> findUsersWithSort(String sortField, String sortOrder) {
        // 校验排序字段
        if (!ALLOWED_SORT_FIELDS.contains(sortField)) {
            throw new IllegalArgumentException("Invalid sort field: " + sortField);
        }
        
        // 校验排序方向
        if (!"ASC".equalsIgnoreCase(sortOrder) && !"DESC".equalsIgnoreCase(sortOrder)) {
            throw new IllegalArgumentException("Invalid sort order: " + sortOrder);
        }
        
        return userMapper.findUsersWithSort(sortField, sortOrder);
    }
    
    // 动态列查询的安全实现
    public List<Map<String, Object>> selectUserColumns(List<String> columnNames) {
        // 定义允许查询的列
        Set<String> allowedColumns = Set.of(
            "id", "name", "email", "phone", "create_time", "status
        );
        
        // 验证所有列名都在白名单中
        for (String column : columnNames) {
            if (!allowedColumns.contains(column)) {
                throw new IllegalArgumentException("Invalid column name: " + column);
            }
        }
        
        String columns = String.join(",", columnNames);
        return userMapper.selectColumns(columns);
    }
}
```

### 🎯 MyBatis动态SQL有哪些标签？如何使用？

MyBatis提供了强大的动态SQL功能，通过XML标签实现条件化的SQL构建：

 **核心动态SQL标签**：

 **1. `<if>` 条件判断标签**：
 - 根据条件决定是否包含某段SQL
 - test属性支持OGNL表达式
 - 常用于WHERE条件的动态构建

 **2. `<choose>/<when>/<otherwise>` 多分支选择**：
 - 类似于Java的switch-case语句
 - 只有一个分支会被执行
 - <otherwise>相当于default分支

 **3. `<where>` 智能WHERE子句**：
 - 自动添加WHERE关键字
 - 自动处理AND/OR逻辑，去除多余的AND/OR
 - 如果没有条件则不添加WHERE

 **4. `<set>` 智能SET子句**：
 - 用于UPDATE语句的动态SET子句
 - 自动去除末尾的逗号
 - 至少需要一个字段才生效

 **5. `<trim>` 通用修剪标签**：
 - prefix/suffix：添加前缀/后缀
 - prefixOverrides/suffixOverrides：去除指定的前缀/后缀
 - <where>和<set>都是<trim>的特殊形式

 **6. `<foreach>` 循环遍历标签**：
 - 遍历集合生成SQL片段
 - 支持List、Array、Map等集合类型
 - 常用于IN查询、批量INSERT等场景

 **7. `<bind>` 变量绑定标签**：
 - 创建一个变量并绑定到上下文
 - 常用于模糊查询的LIKE语句
 - 可以进行字符串拼接和处理

**💻 代码示例**：

```xml
<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- if标签示例：条件查询 -->
    <select id="findUsersByCondition" resultType="User">
        SELECT * FROM user
        <where>
            <if test="id != null">
                AND id = #{id}
            </if>
            <if test="name != null and name != ''">
                AND name LIKE CONCAT('%', #{name}, '%')
            </if>
            <if test="email != null and email != ''">
                AND email = #{email}
            </if>
            <if test="status != null">
                AND status = #{status}
            </if>
            <if test="minAge != null">
                AND age >= #{minAge}
            </if>
            <if test="maxAge != null">
                AND age <= #{maxAge}
            </if>
        </where>
    </select>
    
    <!-- choose/when/otherwise示例：多分支查询 -->
    <select id="findUsersByType" resultType="User">
        SELECT * FROM user
        <where>
            <choose>
                <when test="type == 'admin'">
                    AND role = 'ADMIN' AND status = 1
                </when>
                <when test="type == 'vip'">
                    AND vip_level > 0 AND vip_expire_time > NOW()
                </when>
                <when test="type == 'active'">
                    AND last_login_time > DATE_SUB(NOW(), INTERVAL 30 DAY)
                </when>
                <otherwise>
                    AND status = 1
                </otherwise>
            </choose>
        </where>
    </select>
    
    <!-- set标签示例：动态更新 -->
    <update id="updateUserSelective">
        UPDATE user
        <set>
            <if test="name != null and name != ''">
                name = #{name},
            </if>
            <if test="email != null and email != ''">
                email = #{email},
            </if>
            <if test="phone != null">
                phone = #{phone},
            </if>
            <if test="status != null">
                status = #{status},
            </if>
            <!-- 更新时间总是更新 -->
            update_time = NOW()
        </set>
        WHERE id = #{id}
    </update>
    
    <!-- trim标签示例：自定义修剪逻辑 -->
    <select id="findUsersWithCustomTrim" resultType="User">
        SELECT * FROM user
        <trim prefix="WHERE" prefixOverrides="AND |OR">
            <if test="name != null">
                AND name = #{name}
            </if>
            <if test="email != null">
                OR email = #{email}
            </if>
        </trim>
    </select>
    
    <!-- foreach标签示例：批量操作 -->
    <!-- IN查询 -->
    <select id="findUsersByIds" resultType="User">
        SELECT * FROM user WHERE id IN
        <foreach collection="ids" item="id" open="(" close=")" separator=",">
            #{id}
        </foreach>
    </select>
    
    <!-- 批量插入 -->
    <insert id="batchInsertUsers">
        INSERT INTO user (name, email, phone, status) VALUES
        <foreach collection="users" item="user" separator=",">
            (#{user.name}, #{user.email}, #{user.phone}, #{user.status})
        </foreach>
    </insert>
    
    <!-- 批量更新（MySQL特有语法） -->
    <update id="batchUpdateUsers">
        <foreach collection="users" item="user" separator=";">
            UPDATE user SET 
            name = #{user.name}, 
            email = #{user.email}
            WHERE id = #{user.id}
        </foreach>
    </update>
    
    <!-- bind标签示例：模糊查询 -->
    <select id="findUsersByNameLike" resultType="User">
        <bind name="nameLike" value="'%' + name + '%'"/>
        SELECT * FROM user WHERE name LIKE #{nameLike}
    </select>
    
    <!-- 复合示例：复杂动态查询 -->
    <select id="findUsersComplex" resultType="User">
        SELECT * FROM user
        <where>
            <!-- 基础条件 -->
            <if test="baseCondition != null">
                <if test="baseCondition.status != null">
                    AND status = #{baseCondition.status}
                </if>
                <if test="baseCondition.minCreateTime != null">
                    AND create_time >= #{baseCondition.minCreateTime}
                </if>
            </if>
            
            <!-- 搜索条件（多选一） -->
            <if test="searchCondition != null">
                AND (
                <choose>
                    <when test="searchCondition.type == 'name'">
                        name LIKE CONCAT('%', #{searchCondition.keyword}, '%')
                    </when>
                    <when test="searchCondition.type == 'email'">
                        email LIKE CONCAT('%', #{searchCondition.keyword}, '%')
                    </when>
                    <when test="searchCondition.type == 'phone'">
                        phone LIKE CONCAT('%', #{searchCondition.keyword}, '%')
                    </when>
                    <otherwise>
                        (name LIKE CONCAT('%', #{searchCondition.keyword}, '%')
                         OR email LIKE CONCAT('%', #{searchCondition.keyword}, '%'))
                    </otherwise>
                </choose>
                )
            </if>
            
            <!-- ID列表过滤 -->
            <if test="includeIds != null and includeIds.size() > 0">
                AND id IN
                <foreach collection="includeIds" item="id" open="(" close=")" separator=",">
                    #{id}
                </foreach>
            </if>
            
            <!-- 排除ID列表 -->
            <if test="excludeIds != null and excludeIds.size() > 0">
                AND id NOT IN
                <foreach collection="excludeIds" item="id" open="(" close=")" separator=",">
                    #{id}
                </foreach>
            </if>
        </where>
        
        <!-- 动态排序 -->
        <if test="sortField != null and sortOrder != null">
            ORDER BY ${sortField} ${sortOrder}
        </if>
        
        <!-- 分页 -->
        <if test="offset != null and limit != null">
            LIMIT #{offset}, #{limit}
        </if>
    </select>
    
    <!-- SQL片段复用 -->
    <sql id="userColumns">
        id, name, email, phone, status, create_time, update_time
    </sql>
    
    <sql id="userBaseCondition">
        <where>
            <if test="status != null">
                AND status = #{status}
            </if>
            <if test="name != null and name != ''">
                AND name LIKE CONCAT('%', #{name}, '%')
            </if>
        </where>
    </sql>
    
    <!-- 使用SQL片段 -->
    <select id="findUsersWithFragment" resultType="User">
        SELECT <include refid="userColumns"/> FROM user
        <include refid="userBaseCondition"/>
    </select>
</mapper>
```



### 🎯 模糊查询like语句该怎么写

1. '%${question}%'  可能引起SQL注入，不推荐

2. "%"#{question}"%"   注意：因为#{...}解析成sql语句时候，会在变量外侧自动加单引号'  '，所以这里 % 需要使用双引号"  "，不能使用单引号 '  '，不然会查不到任何结果。

3. CONCAT('%',#{question},'%')   使用CONCAT()函数，推荐

4. 使用bind标签

```xml
<select id="listUserLikeUsername" resultType="com.jourwon.pojo.User">
　　<bind name="pattern" value="'%' + username + '%'" />
　　select id,sex,age,username,password from person where username LIKE #{pattern}
</select>
```



### 🎯 当实体类中的属性名和表中的字段名不一样 ，怎么办

第1种：通过在查询的SQL语句中定义字段名的别名，让字段名的别名和实体类的属性名一致。

```xml
<select id="getOrder" parameterType="int" resultType="com.jourwon.pojo.Order">
      select order_id id, order_no orderno ,order_price price form orders where order_id=#{id};
</select>
```

第2种：通过`<resultMap>`
来映射字段名和实体类属性名的一一对应关系。

```xml
<select id="getOrder" parameterType="int" resultMap="orderResultMap">
select * from orders where order_id=#{id}
</select>

<resultMap type="com.jourwon.pojo.Order" id="orderResultMap">
  <!–用id属性来映射主键字段–>
   <id property="id" column="order_id">

  <!–用result属性来映射非主键字段，property为实体类属性名，column为数据库表中的属性–>
   <result property ="orderno" column ="order_no"/>
   <result property="price" column="order_price" />
</reslutMap>
```



### 🎯 使用MyBatis的mapper接口调用时有哪些要求？

- Mapper.xml文件中的namespace即是mapper接口的全限定类名。
- Mapper接口方法名和mapper.xml中定义的sql语句id一一对应。
- Mapper接口方法的输入参数类型和mapper.xml中定义的每个sql语句的parameterType的类型相同。
- Mapper接口方法的输出参数类型和mapper.xml中定义的每个sql语句的resultType的类型相同。



### 🎯 MyBatis是如何进行分页的？分页插件的原理是什么？

Mybatis使用RowBounds对象进行分页，它是针对ResultSet结果集执行的内存分页，而非物理分页，可以在sql内直接书写带有物理分页的参数来完成物理分页功能，也可以使用分页插件来完成物理分页。

分页插件的基本原理是使用Mybatis提供的插件接口，实现自定义插件，通过jdk动态代理在插件的拦截方法内拦截待执行的sql，然后重写sql，根据dialect方言，添加对应的物理分页语句和参数。

举例：select * from student，拦截sql后重写为：select t.* from (select * from student) t limit 0, 10



### 🎯 resultType resultMap 的区别?

- 类的名字和数据库相同时，可以直接设置 resultType 参数为 Pojo 类

- 若不同，需要设置 resultMap 将结果名字和 Pojo 名字进行转换

---



## 🧠 三、缓存机制

 **核心理念**：MyBatis提供两级缓存机制来提升查询性能，通过合理的缓存策略减少数据库访问，提高应用响应速度。

### 🎯 MyBatis的一级缓存和二级缓存是什么？有什么区别？



> 在应用运行过程中，我们有可能在一次数据库会话中，执行多次查询条件完全相同的SQL，MyBatis提供了一级缓存的方案优化这部分场景，如果是相同的SQL语句，会优先命中一级缓存，避免直接对数据库进行查询，提高性能。
>
> ![img](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018a/6e38df6a.jpg)
>
> 每个SqlSession中持有了Executor，每个Executor中有一个LocalCache。当用户发起查询时，MyBatis根据当前执行的语句生成`MappedStatement`，在Local Cache进行查询，如果缓存命中的话，直接返回结果给用户，如果缓存没有命中的话，查询数据库，结果写入`Local Cache`，最后返回结果给用户。具体实现类的类关系图如下图所示。
>
> ![img](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018a/d76ec5fe.jpg)
>
> 一级缓存中，其最大的共享范围就是一个SqlSession内部，如果多个SqlSession之间需要共享缓存，则需要使用到二级缓存
>
> 二级缓存开启后，同一个namespace下的所有操作语句，都影响着同一个Cache，即二级缓存被多个SqlSession共享，是一个全局的变量。
>
> 当开启缓存后，数据的查询执行的流程就是 二级缓存 -> 一级缓存 -> 数据库

1. 一级缓存: 基于 PerpetualCache 的 HashMap 本地缓存，其存储作用域为 Session，当 Session flush 或 close 之后，该 Session 中的所有 Cache 就将清空，MyBatis默认打开一级缓存。

2. 二级缓存与一级缓存机制相同，默认也是采用 PerpetualCache，HashMap 存储，不同之处在于其存储作用域为 Mapper(Namespace)，并且可自定义存储源，如 Ehcache。默认不打开二级缓存，要开启二级缓存，使用二级缓存属性类需要实现Serializable序列化接口(可用来保存对象的状态)，可在它的映射文件中配置`<cache/>`
   标签；

3. 对于缓存数据更新机制，当某一个作用域(一级缓存 Session/二级缓存Namespaces)进行了C/U/D 操作后，默认该作用域下所有缓存将被清理掉。

 **主要区别对比**：
 - **作用域**：一级缓存是SqlSession级别，二级缓存是Mapper级别
 - **生命周期**：一级缓存随SqlSession销毁，二级缓存可以持续存在
 - **共享性**：一级缓存不能共享，二级缓存可以跨SqlSession共享
 - **配置**：一级缓存默认开启，二级缓存需要手动配置
 - **序列化**：一级缓存不需要序列化，二级缓存需要对象可序列化

**💻 代码示例**：

```java
// 一级缓存示例
@Test
public void testFirstLevelCache() {
    SqlSession session = sqlSessionFactory.openSession();
    try {
        UserMapper mapper = session.getMapper(UserMapper.class);
        
        // 第一次查询，从数据库获取
        User user1 = mapper.selectById(1L);
        System.out.println("第一次查询: " + user1);
        
        // 第二次查询，从一级缓存获取（相同SqlSession）
        User user2 = mapper.selectById(1L);
        System.out.println("第二次查询: " + user2);
        
        // 验证是同一个对象
        System.out.println("是否为同一对象: " + (user1 == user2)); // true
        
        // 执行更新操作，清空一级缓存
        mapper.updateUser(new User(2L, "Updated Name"));
        
        // 再次查询，重新从数据库获取
        User user3 = mapper.selectById(1L);
        System.out.println("更新后查询: " + user3);
        System.out.println("是否为同一对象: " + (user1 == user3)); // false
        
    } finally {
        session.close();
    }
}

// 验证不同SqlSession的一级缓存隔离
@Test
public void testFirstLevelCacheIsolation() {
    // 第一个SqlSession
    SqlSession session1 = sqlSessionFactory.openSession();
    UserMapper mapper1 = session1.getMapper(UserMapper.class);
    User user1 = mapper1.selectById(1L);
    
    // 第二个SqlSession
    SqlSession session2 = sqlSessionFactory.openSession();
    UserMapper mapper2 = session2.getMapper(UserMapper.class);
    User user2 = mapper2.selectById(1L); // 重新从数据库查询
    
    System.out.println("不同Session是否为同一对象: " + (user1 == user2)); // false
    
    session1.close();
    session2.close();
}
```

```xml
<!-- 二级缓存配置示例 -->
<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 开启二级缓存 -->
    <cache 
        eviction="LRU" 
        flushInterval="300000" 
        size="1024" 
        readOnly="false"/>
        
    <!-- 或者使用自定义缓存实现 -->
    <cache type="org.apache.ibatis.cache.impl.PerpetualCache">
        <property name="cacheFile" value="/tmp/user-cache.tmp"/>
    </cache>
    
    <!-- 查询语句，默认使用缓存 -->
    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
    
    <!-- 禁用特定查询的二级缓存 -->
    <select id="selectWithoutCache" resultType="User" useCache="false">
        SELECT * FROM user WHERE status = #{status}
    </select>
    
    <!-- 更新操作，默认会清空缓存 -->
    <update id="updateUser">
        UPDATE user SET name = #{name} WHERE id = #{id}
    </update>
    
    <!-- 更新操作，但不清空缓存 -->
    <update id="updateUserKeepCache" flushCache="false">
        UPDATE user SET last_access_time = NOW() WHERE id = #{id}
    </update>
</mapper>
```

```java
// 二级缓存示例
@Test
public void testSecondLevelCache() {
    // 第一个SqlSession查询数据
    SqlSession session1 = sqlSessionFactory.openSession();
    try {
        UserMapper mapper1 = session1.getMapper(UserMapper.class);
        User user1 = mapper1.selectById(1L);
        System.out.println("Session1查询: " + user1);
    } finally {
        session1.close(); // 关闭session，数据进入二级缓存
    }
    
    // 第二个SqlSession查询相同数据
    SqlSession session2 = sqlSessionFactory.openSession();
    try {
        UserMapper mapper2 = session2.getMapper(UserMapper.class);
        User user2 = mapper2.selectById(1L); // 从二级缓存获取
        System.out.println("Session2查询: " + user2);
    } finally {
        session2.close();
    }
}
```



### 🎯 什么情况下MyBatis缓存会失效？如何控制缓存行为？

MyBatis缓存失效涉及多种场景，了解这些场景有助于合理使用缓存：

 **一级缓存失效场景**：

 **1. SqlSession关闭或提交**：
 - SqlSession.close()时清空缓存
 - SqlSession.commit()或rollback()时清空缓存
 - 这是最常见的缓存失效场景

 **2. 执行DML操作**：
 - 任何INSERT、UPDATE、DELETE操作都会清空一级缓存
 - 包括其他Mapper的DML操作（同一SqlSession内）
 - 防止脏读问题

 **3. 手动清理缓存**：
 - 调用SqlSession.clearCache()方法
 - 主动清空当前SqlSession的缓存

 **4. 不同的查询条件**：
 - SQL语句不同
 - 参数值不同
 - 分页参数不同
 - RowBounds不同

 **5. localCacheScope设置**：
 - 设置为STATEMENT时，每次语句执行后都清空缓存
 - 默认为SESSION，缓存在整个Session期间有效

 **二级缓存失效场景**：

 **1. 命名空间内的DML操作**：
 - 当前namespace的任何INSERT、UPDATE、DELETE操作
 - 会清空该namespace的所有二级缓存
 - 保证数据一致性

 **2. 配置属性控制**：
 - flushCache="true"：强制清空缓存
 - useCache="false"：不使用缓存
 - 可以针对特定语句进行精确控制

 **3. 缓存策略触发**：
 - 达到缓存大小限制，触发淘汰策略
 - 达到刷新间隔时间，自动清空缓存
 - LRU、FIFO等淘汰算法的执行

 **4. 序列化问题**：
 - 缓存对象未实现Serializable接口
 - 序列化/反序列化过程出错

 **缓存控制最佳实践**：
 - 合理设置缓存策略和大小
 - 读多写少的场景适合使用二级缓存
 - 实时性要求高的数据不建议缓存
 - 定期监控缓存命中率和内存使用情况

**💻 代码示例**：

```java
// 缓存失效演示
@Test
public void testCacheInvalidation() {
    SqlSession session = sqlSessionFactory.openSession();
    try {
        UserMapper mapper = session.getMapper(UserMapper.class);
        
        // 第一次查询，建立缓存
        User user1 = mapper.selectById(1L);
        System.out.println("第一次查询: " + user1);
        
        // 第二次查询，使用缓存
        User user2 = mapper.selectById(1L);
        System.out.println("第二次查询（缓存）: " + user2);
        System.out.println("缓存命中: " + (user1 == user2)); // true
        
        // 执行更新操作，导致缓存失效
        User updateUser = new User(2L, "New Name");
        mapper.updateUser(updateUser);
        
        // 再次查询，缓存已失效，重新查询数据库
        User user3 = mapper.selectById(1L);
        System.out.println("更新后查询: " + user3);
        System.out.println("缓存失效: " + (user1 == user3)); // false
        
        // 手动清空缓存
        session.clearCache();
        User user4 = mapper.selectById(1L);
        System.out.println("手动清空后查询: " + user4);
        
    } finally {
        session.close();
    }
}
```

```xml
<!-- 缓存控制配置示例 -->
<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 二级缓存配置 -->
    <cache 
        eviction="LRU"          <!-- 淘汰策略：LRU, FIFO, SOFT, WEAK -->
        flushInterval="600000"  <!-- 刷新间隔：10分钟 -->
        size="512"              <!-- 缓存大小：512个对象 -->
        readOnly="false"        <!-- 是否只读 -->
        blocking="true"/>       <!-- 是否阻塞 -->
        
    <!-- 普通查询，使用缓存 -->
    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
    
    <!-- 实时性要求高的查询，不使用缓存 -->
    <select id="selectCurrentOnlineCount" resultType="int" useCache="false">
        SELECT COUNT(*) FROM user WHERE last_access_time > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
    </select>
    
    <!-- 更新操作，默认清空缓存 -->
    <update id="updateUser">
        UPDATE user SET name = #{name}, update_time = NOW() WHERE id = #{id}
    </update>
    
    <!-- 统计类更新，不清空查询缓存 -->
    <update id="incrementViewCount" flushCache="false">
        UPDATE user SET view_count = view_count + 1 WHERE id = #{id}
    </update>
    
    <!-- 强制清空缓存的查询 -->
    <select id="selectWithForceRefresh" resultType="User" flushCache="true">
        SELECT * FROM user WHERE id = #{id}
    </select>
</mapper>
```

### 🎯 如何自定义MyBatis缓存？如何集成Redis等外部缓存？

MyBatis支持自定义缓存实现，可以集成Redis、Ehcache等第三方缓存系统：

 **自定义缓存实现步骤**：

 **1. 实现Cache接口**：
 - org.apache.ibatis.cache.Cache接口定义了缓存的基本操作
 - 包括put、get、remove、clear等方法
 - 需要提供唯一的缓存ID标识

 **2. 处理并发安全**：
 - 缓存实现必须是线程安全的
 - 可以使用synchronized或并发集合
 - 考虑读写锁优化性能

 **3. 配置缓存策略**：
 - 淘汰策略（LRU、FIFO等）
 - 过期时间控制
 - 内存大小限制

 **Redis缓存集成方案**：

 **使用现有组件**：
 - mybatis-redis：官方提供的Redis缓存实现
 - redisson-mybatis：基于Redisson的缓存实现
 - 配置简单，功能完善

 **自定义Redis缓存**：
 - 更灵活的配置选项
 - 可以定制序列化方式
 - 支持分布式缓存场景

 **缓存使用注意事项**：
 - 数据一致性：缓存与数据库的同步策略
 - 缓存穿透：大量请求不存在的数据
 - 缓存雪崩：缓存同时失效导致数据库压力激增
 - 缓存击穿：热点数据失效导致并发查询数据库

---

## 🧱 四、插件与扩展

 **核心理念**：MyBatis通过拦截器机制提供强大的扩展能力，支持在SQL执行的不同阶段进行干预和增强，实现分页、审计、加解密等高级功能。

### 🎯 MyBatis插件的原理是什么？可以拦截哪些对象和方法？

MyBatis插件基于JDK动态代理和责任链模式实现，提供了强大的扩展机制：

 **插件实现原理**：

 **1. 拦截器接口**：
 - 所有插件必须实现org.apache.ibatis.plugin.Interceptor接口
 - 通过@Intercepts和@Signature注解声明拦截的对象和方法
 - intercept()方法包含具体的拦截逻辑

 **2. 动态代理机制**：
 - MyBatis在初始化时通过Plugin.wrap()方法为目标对象创建代理
 - 使用JDK动态代理技术，生成代理对象
 - 代理对象在方法调用时会执行拦截器逻辑

 **3. 责任链模式**：
 - 多个插件按照注册顺序形成拦截器链
 - 每个拦截器都可以选择是否继续执行下一个拦截器
 - 通过Invocation.proceed()方法传递调用链

 **可拦截的四大核心对象**：

 **1. Executor（执行器）**：
 - **作用**：负责SQL的执行，是MyBatis的核心组件
 - **可拦截方法**：
   - update(MappedStatement, Object)：拦截INSERT、UPDATE、DELETE操作
   - query(MappedStatement, Object, RowBounds, ResultHandler)：拦截SELECT操作
   - flushStatements()：拦截批处理语句的执行
   - commit(boolean)、rollback(boolean)：拦截事务提交和回滚
 - **应用场景**：分页插件、SQL性能监控、分表路由

 **2. StatementHandler（语句处理器）**：
 - **作用**：负责处理JDBC Statement，设置参数、执行SQL
 - **可拦截方法**：
   - prepare(Connection, Integer)：拦截SQL预编译
   - parameterize(Statement)：拦截参数设置
   - batch(Statement)：拦截批处理添加
   - update(Statement)、query(Statement, ResultHandler)：拦截SQL执行
 - **应用场景**：SQL重写、慢SQL监控、SQL安全检查

 **3. ParameterHandler（参数处理器）**：
 - **作用**：负责将Java对象转换为SQL参数
 - **可拦截方法**：
   - getParameterObject()：获取参数对象
   - setParameters(PreparedStatement)：设置SQL参数
 - **应用场景**：参数加解密、参数值转换、敏感信息脱敏

 **4. ResultSetHandler（结果处理器）**：
 - **作用**：负责将ResultSet转换为Java对象
 - **可拦截方法**：
   - handleResultSets(Statement)：处理结果集
   - handleCursorResultSets(Statement)：处理游标结果集
   - handleOutputParameters(CallableStatement)：处理存储过程输出参数
 - **应用场景**：结果集过滤、数据脱敏、字段值转换

**💻 代码示例**：

```java
// 自定义分页插件
@Intercepts({
    @Signature(type = Executor.class, method = "query", 
               args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}),
    @Signature(type = Executor.class, method = "query", 
               args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class, CacheKey.class, BoundSql.class})
})
public class PaginationPlugin implements Interceptor {
    
    private static final String COUNT_SUFFIX = "_COUNT";
    private static final String PAGE_PARAM = "page";
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object[] args = invocation.getArgs();
        MappedStatement ms = (MappedStatement) args[0];
        Object parameter = args[1];
        RowBounds rowBounds = (RowBounds) args[2];
        ResultHandler resultHandler = (ResultHandler) args[3];
        Executor executor = (Executor) invocation.getTarget();
        
        // 检查是否需要分页
        if (rowBounds == null || rowBounds == RowBounds.DEFAULT) {
            // 检查参数中是否包含分页信息
            PageParam pageParam = extractPageParam(parameter);
            if (pageParam == null) {
                return invocation.proceed();
            }
            rowBounds = new RowBounds(pageParam.getOffset(), pageParam.getPageSize());
        }
        
        // 无需分页
        if (rowBounds == RowBounds.DEFAULT) {
            return invocation.proceed();
        }
        
        BoundSql boundSql;
        if (args.length == 4) {
            boundSql = ms.getBoundSql(parameter);
        } else {
            boundSql = (BoundSql) args[5];
        }
        
        // 执行count查询
        long total = executeCountQuery(executor, ms, parameter, boundSql);
        
        // 执行分页查询
        String originalSql = boundSql.getSql();
        String pagingSql = buildPageSql(originalSql, rowBounds);
        
        // 创建新的BoundSql
        BoundSql newBoundSql = new BoundSql(ms.getConfiguration(), pagingSql, 
                                           boundSql.getParameterMappings(), parameter);
        
        // 复制动态参数
        copyAdditionalParameters(boundSql, newBoundSql);
        
        // 创建新的MappedStatement
        MappedStatement newMs = copyMappedStatement(ms, new BoundSqlSource(newBoundSql));
        args[0] = newMs;
        
        // 执行分页查询
        List<?> result = (List<?>) invocation.proceed();
        
        // 包装分页结果
        return new PageResult<>(result, total, rowBounds.getOffset() / rowBounds.getLimit() + 1, 
                               rowBounds.getLimit());
    }
    
    private PageParam extractPageParam(Object parameter) {
        if (parameter instanceof Map) {
            Map<String, Object> paramMap = (Map<String, Object>) parameter;
            Object pageObj = paramMap.get(PAGE_PARAM);
            if (pageObj instanceof PageParam) {
                return (PageParam) pageObj;
            }
        } else if (parameter instanceof PageParam) {
            return (PageParam) parameter;
        }
        return null;
    }
    
    private long executeCountQuery(Executor executor, MappedStatement ms, 
                                 Object parameter, BoundSql boundSql) throws SQLException {
        String countSql = buildCountSql(boundSql.getSql());
        BoundSql countBoundSql = new BoundSql(ms.getConfiguration(), countSql, 
                                            boundSql.getParameterMappings(), parameter);
        
        MappedStatement countMs = buildCountMappedStatement(ms, countBoundSql);
        
        List<Object> countResult = executor.query(countMs, parameter, RowBounds.DEFAULT, null);
        return Long.parseLong(countResult.get(0).toString());
    }
    
    private String buildCountSql(String originalSql) {
        return "SELECT COUNT(*) FROM (" + originalSql + ") tmp_count";
    }
    
    private String buildPageSql(String originalSql, RowBounds rowBounds) {
        return originalSql + " LIMIT " + rowBounds.getOffset() + ", " + rowBounds.getLimit();
    }
    
    @Override
    public Object plugin(Object target) {
        if (target instanceof Executor) {
            return Plugin.wrap(target, this);
        }
        return target;
    }
    
    @Override
    public void setProperties(Properties properties) {
        // 插件配置属性
    }
}

// SQL监控插件
@Intercepts({
    @Signature(type = StatementHandler.class, method = "query", args = {Statement.class, ResultHandler.class}),
    @Signature(type = StatementHandler.class, method = "update", args = {Statement.class}),
    @Signature(type = StatementHandler.class, method = "batch", args = {Statement.class})
})
public class SqlMonitorPlugin implements Interceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(SqlMonitorPlugin.class);
    private int slowSqlThreshold = 1000; // 慢SQL阈值，毫秒
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        BoundSql boundSql = statementHandler.getBoundSql();
        String sql = boundSql.getSql();
        
        long startTime = System.currentTimeMillis();
        String sqlId = getSqlId(statementHandler);
        
        try {
            Object result = invocation.proceed();
            
            long endTime = System.currentTimeMillis();
            long executeTime = endTime - startTime;
            
            // 记录SQL执行信息
            logSqlExecution(sqlId, sql, executeTime, true, null);
            
            // 慢SQL告警
            if (executeTime > slowSqlThreshold) {
                logger.warn("慢SQL检测: [{}] 执行时间: {}ms, SQL: {}", sqlId, executeTime, sql);
            }
            
            return result;
            
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long executeTime = endTime - startTime;
            
            logSqlExecution(sqlId, sql, executeTime, false, e.getMessage());
            throw e;
        }
    }
    
    private String getSqlId(StatementHandler statementHandler) {
        try {
            MetaObject metaObject = SystemMetaObject.forObject(statementHandler);
            MappedStatement mappedStatement = 
                (MappedStatement) metaObject.getValue("delegate.mappedStatement");
            return mappedStatement.getId();
        } catch (Exception e) {
            return "Unknown";
        }
    }
    
    private void logSqlExecution(String sqlId, String sql, long executeTime, 
                               boolean success, String errorMsg) {
        // 可以发送到监控系统或数据库
        logger.info("SQL执行记录: [{}] 耗时: {}ms 状态: {} SQL: {}", 
                   sqlId, executeTime, success ? "成功" : "失败", sql);
        
        if (!success && errorMsg != null) {
            logger.error("SQL执行异常: [{}] 错误: {}", sqlId, errorMsg);
        }
        
        // 发送到监控系统
        sendToMonitorSystem(sqlId, executeTime, success);
    }
    
    private void sendToMonitorSystem(String sqlId, long executeTime, boolean success) {
        // 实现发送到监控系统的逻辑
        // 例如：发送到Prometheus、Grafana等监控系统
    }
    
    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }
    
    @Override
    public void setProperties(Properties properties) {
        String threshold = properties.getProperty("slowSqlThreshold");
        if (threshold != null) {
            this.slowSqlThreshold = Integer.parseInt(threshold);
        }
    }
}

// 数据脱敏插件
@Intercepts({
    @Signature(type = ResultSetHandler.class, method = "handleResultSets", args = {Statement.class})
})
public class DataMaskingPlugin implements Interceptor {
    
    private static final Map<String, MaskingStrategy> MASKING_STRATEGIES = new HashMap<>();
    
    static {
        MASKING_STRATEGIES.put("phone", new PhoneMaskingStrategy());
        MASKING_STRATEGIES.put("email", new EmailMaskingStrategy());
        MASKING_STRATEGIES.put("idCard", new IdCardMaskingStrategy());
        MASKING_STRATEGIES.put("bankCard", new BankCardMaskingStrategy());
    }
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        List<Object> result = (List<Object>) invocation.proceed();
        
        if (result == null || result.isEmpty()) {
            return result;
        }
        
        // 对结果进行脱敏处理
        for (Object obj : result) {
            maskSensitiveData(obj);
        }
        
        return result;
    }
    
    private void maskSensitiveData(Object obj) {
        if (obj == null) {
            return;
        }
        
        Class<?> clazz = obj.getClass();
        Field[] fields = clazz.getDeclaredFields();
        
        for (Field field : fields) {
            Sensitive sensitive = field.getAnnotation(Sensitive.class);
            if (sensitive != null) {
                try {
                    field.setAccessible(true);
                    Object value = field.get(obj);
                    
                    if (value instanceof String) {
                        String originalValue = (String) value;
                        String maskedValue = maskValue(originalValue, sensitive.type());
                        field.set(obj, maskedValue);
                    }
                } catch (Exception e) {
                    logger.warn("数据脱敏失败: {}", e.getMessage());
                }
            }
        }
    }
    
    private String maskValue(String value, String type) {
        MaskingStrategy strategy = MASKING_STRATEGIES.get(type);
        if (strategy != null) {
            return strategy.mask(value);
        }
        return value;
    }
    
    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }
    
    @Override
    public void setProperties(Properties properties) {
        // 插件配置
    }
}

// 脱敏注解
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Sensitive {
    String type();
}

// 脱敏策略接口
interface MaskingStrategy {
    String mask(String original);
}

// 手机号脱敏策略
class PhoneMaskingStrategy implements MaskingStrategy {
    @Override
    public String mask(String phone) {
        if (phone == null || phone.length() < 11) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }
}

// 邮箱脱敏策略
class EmailMaskingStrategy implements MaskingStrategy {
    @Override
    public String mask(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        int atIndex = email.indexOf("@");
        String username = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        
        if (username.length() <= 3) {
            return username + domain;
        }
        
        return username.substring(0, 3) + "***" + domain;
    }
}

// 身份证脱敏策略
class IdCardMaskingStrategy implements MaskingStrategy {
    @Override
    public String mask(String idCard) {
        if (idCard == null || idCard.length() < 18) {
            return idCard;
        }
        return idCard.substring(0, 6) + "********" + idCard.substring(14);
    }
}

// 银行卡脱敏策略
class BankCardMaskingStrategy implements MaskingStrategy {
    @Override
    public String mask(String bankCard) {
        if (bankCard == null || bankCard.length() < 16) {
            return bankCard;
        }
        return bankCard.substring(0, 4) + " **** **** " + bankCard.substring(bankCard.length() - 4);
    }
}

// 使用示例
public class User {
    private Long id;
    private String name;
    
    @Sensitive(type = "phone")
    private String phone;
    
    @Sensitive(type = "email")
    private String email;
    
    @Sensitive(type = "idCard")
    private String idCard;
    
    // getters and setters
}
```

```xml
<!-- MyBatis配置文件中注册插件 -->
<configuration>
    <plugins>
        <!-- SQL监控插件 -->
        <plugin interceptor="com.example.plugin.SqlMonitorPlugin">
            <property name="slowSqlThreshold" value="2000"/>
        </plugin>
        
        <!-- 分页插件 -->
        <plugin interceptor="com.example.plugin.PaginationPlugin"/>
        
        <!-- 数据脱敏插件 -->
        <plugin interceptor="com.example.plugin.DataMaskingPlugin"/>
    </plugins>
</configuration>
```

---

## 🔁 五、事务与多数据源

 **核心理念**：在企业级应用中，事务管理和多数据源是必不可少的功能。Spring与MyBatis的深度整合为事务控制和数据源管理提供了强大的支持。

### 🎯 Spring + MyBatis 事务是如何生效的？有哪些常见的坑？

Spring与MyBatis的事务整合基于Spring的声明式事务管理：

 **事务生效的基本条件**：

 **1. 代理机制生效**：
 - 方法必须是public的（Spring AOP基于代理实现）
 - 调用必须通过Spring代理对象进行
 - 需要正确配置@EnableTransactionManagement
 - 确保有合适的PlatformTransactionManager实现

 **2. 事务传播行为**：
 - REQUIRED：如果当前有事务则加入，没有则创建新事务（默认）
 - REQUIRES_NEW：总是创建新事务，挂起当前事务
 - NESTED：嵌套事务，基于SavePoint实现
 - SUPPORTS：如果有事务则加入，没有则以非事务方式执行

 **3. MyBatis集成原理**：
 - SqlSessionFactoryBean与Spring事务管理器集成
 - SqlSessionTemplate自动参与Spring事务
 - 同一事务内多次数据库操作使用同一个SqlSession

 **常见的坑与解决方案**：

 **1. 自调用失效**：
 - 问题：同一类内部方法调用@Transactional不生效
 - 原因：绕过了Spring代理
 - 解决：使用AopContext.currentProxy()或拆分到不同类

 **2. 异常类型问题**：
 - 问题：检查异常不会自动回滚
 - 原因：@Transactional默认只对RuntimeException回滚
 - 解决：使用rollbackFor指定异常类型

 **3. 批处理异常被吃掉**：
 - 问题：批处理中单条失败不影响其他记录
 - 原因：批处理底层可能吞掉部分异常
 - 解决：检查批处理返回结果，手动处理异常

 **4. 只读事务误用**：
 - 问题：在只读事务中执行修改操作
 - 解决：合理使用readOnly属性，优化性能

**💻 代码示例**：

```java
// 1. Spring事务配置
@Configuration
@EnableTransactionManagement
public class TransactionConfig {
    
    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
    
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        return factoryBean.getObject();
    }
    
    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}

// 2. 正确使用事务的Service
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private OrderMapper orderMapper;
    
    // 正确的事务使用
    @Transactional(rollbackFor = Exception.class)
    public void createUserWithOrder(User user, Order order) {
        // 1. 插入用户
        userMapper.insert(user);
        
        // 2. 插入订单
        order.setUserId(user.getId());
        orderMapper.insert(order);
        
        // 3. 业务校验，任何异常都会回滚
        if (order.getAmount() < 0) {
            throw new BusinessException("订单金额不能为负数");
        }
    }
    
    // 事务传播行为示例
    @Transactional
    public void outerMethod() {
        userMapper.insert(new User("outer"));
        
        try {
            innerMethod(); // 调用内部事务方法
        } catch (Exception e) {
            log.error("内部方法异常", e);
            // 外部事务仍会回滚，因为内部异常会传播到外部
        }
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void innerMethod() {
        userMapper.insert(new User("inner"));
        throw new RuntimeException("内部异常");
        // REQUIRES_NEW创建独立事务，不影响外部事务
    }
    
    // 解决自调用问题
    @Transactional
    public void methodA() {
        userMapper.insert(new User("A"));
        
        // 错误方式：直接调用，事务不生效
        // this.methodB();
        
        // 正确方式：通过代理调用
        ((UserService) AopContext.currentProxy()).methodB();
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void methodB() {
        userMapper.insert(new User("B"));
    }
    
    // 批处理事务处理
    @Transactional(rollbackFor = Exception.class)
    public void batchInsertUsers(List<User> users) {
        int batchSize = 1000;
        for (int i = 0; i < users.size(); i += batchSize) {
            int endIndex = Math.min(i + batchSize, users.size());
            List<User> batch = users.subList(i, endIndex);
            
            int[] results = userMapper.batchInsert(batch);
            
            // 检查批处理结果
            for (int j = 0; j < results.length; j++) {
                if (results[j] == 0) {
                    throw new BusinessException(
                        String.format("批处理第%d条记录插入失败", i + j + 1));
                }
            }
        }
    }
    
    // 只读事务优化查询
    @Transactional(readOnly = true)
    public List<User> queryActiveUsers() {
        return userMapper.selectActiveUsers();
    }
}

// 3. 手动事务控制
@Service
public class ManualTransactionService {
    
    @Autowired
    private PlatformTransactionManager transactionManager;
    
    @Autowired
    private UserMapper userMapper;
    
    public void processWithManualTransaction() {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);
        
        try {
            userMapper.insert(new User("manual"));
            
            // 一些复杂的业务逻辑
            if (someCondition()) {
                transactionManager.commit(status);
            } else {
                transactionManager.rollback(status);
            }
        } catch (Exception e) {
            transactionManager.rollback(status);
            throw e;
        }
    }
    
    // 编程式事务模板
    @Autowired
    private TransactionTemplate transactionTemplate;
    
    public void processWithTransactionTemplate() {
        transactionTemplate.execute(status -> {
            userMapper.insert(new User("template"));
            
            if (someCondition()) {
                status.setRollbackOnly();
            }
            
            return null;
        });
    }
}
```

### 🎯 多数据源和读写分离如何实现？

多数据源实现主要基于Spring的AbstractRoutingDataSource：

 **实现方案**：

 **1. AbstractRoutingDataSource路由**：
 - 继承AbstractRoutingDataSource实现数据源路由
 - 通过determineCurrentLookupKey()方法决定使用哪个数据源
 - 结合ThreadLocal存储当前数据源标识

 **2. 注解 + AOP切面**：
 - 自定义@DataSource注解标记数据源
 - AOP切面拦截方法调用，设置数据源上下文
 - 支持方法级和类级的数据源切换

 **3. 读写分离实现**：
 - 主数据源处理写操作（INSERT、UPDATE、DELETE）
 - 从数据源处理读操作（SELECT）
 - 考虑主从延迟，关键业务读主库

 **4. 分布式事务处理**：
 - 轻量级：最终一致性方案（消息队列、事件驱动）
 - 强一致性：两阶段提交（Seata、XA事务）
 - 根据业务特性选择合适的方案

**💻 代码示例**：

```java
// 1. 动态数据源实现
@Component
public class DynamicDataSource extends AbstractRoutingDataSource {
    
    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceContextHolder.getDataSourceType();
    }
}

// 2. 数据源上下文管理
public class DataSourceContextHolder {
    
    public enum DataSourceType {
        MASTER, SLAVE
    }
    
    private static final ThreadLocal<DataSourceType> contextHolder = new ThreadLocal<>();
    
    public static void setDataSourceType(DataSourceType dataSourceType) {
        contextHolder.set(dataSourceType);
    }
    
    public static DataSourceType getDataSourceType() {
        return contextHolder.get();
    }
    
    public static void clearDataSourceType() {
        contextHolder.remove();
    }
}

// 3. 数据源注解
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface DataSource {
    DataSourceContextHolder.DataSourceType value() default DataSourceContextHolder.DataSourceType.MASTER;
}

// 4. 数据源切换切面
@Aspect
@Component
public class DataSourceAspect {
    
    @Around("@annotation(dataSource)")
    public Object around(ProceedingJoinPoint point, DataSource dataSource) throws Throwable {
        DataSourceContextHolder.DataSourceType currentType = DataSourceContextHolder.getDataSourceType();
        
        try {
            DataSourceContextHolder.setDataSourceType(dataSource.value());
            return point.proceed();
        } finally {
            if (currentType == null) {
                DataSourceContextHolder.clearDataSourceType();
            } else {
                DataSourceContextHolder.setDataSourceType(currentType);
            }
        }
    }
    
    @Around("execution(* com.example.service.*.*(..))")  
    public Object aroundService(ProceedingJoinPoint point) throws Throwable {
        String methodName = point.getSignature().getName();
        
        // 根据方法名自动判断读写操作
        if (methodName.startsWith("select") || methodName.startsWith("find") 
            || methodName.startsWith("get") || methodName.startsWith("query")) {
            DataSourceContextHolder.setDataSourceType(DataSourceContextHolder.DataSourceType.SLAVE);
        } else {
            DataSourceContextHolder.setDataSourceType(DataSourceContextHolder.DataSourceType.MASTER);
        }
        
        try {
            return point.proceed();
        } finally {
            DataSourceContextHolder.clearDataSourceType();
        }
    }
}

// 5. 多数据源配置
@Configuration
public class MultiDataSourceConfig {
    
    @Bean
    @ConfigurationProperties("app.datasource.master")
    public DataSource masterDataSource() {
        return DruidDataSourceBuilder.create().build();
    }
    
    @Bean
    @ConfigurationProperties("app.datasource.slave")
    public DataSource slaveDataSource() {
        return DruidDataSourceBuilder.create().build();
    }
    
    @Bean
    @Primary
    public DataSource dynamicDataSource() {
        DynamicDataSource dynamicDataSource = new DynamicDataSource();
        
        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put(DataSourceContextHolder.DataSourceType.MASTER, masterDataSource());
        dataSourceMap.put(DataSourceContextHolder.DataSourceType.SLAVE, slaveDataSource());
        
        dynamicDataSource.setTargetDataSources(dataSourceMap);
        dynamicDataSource.setDefaultTargetDataSource(masterDataSource());
        
        return dynamicDataSource;
    }
    
    @Bean
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dynamicDataSource());
        return factoryBean.getObject();
    }
}

// 6. Service层使用示例
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    // 读操作，使用从库
    @DataSource(DataSourceContextHolder.DataSourceType.SLAVE)
    @Transactional(readOnly = true)
    public List<User> findActiveUsers() {
        return userMapper.selectActiveUsers();
    }
    
    // 写操作，使用主库
    @DataSource(DataSourceContextHolder.DataSourceType.MASTER)
    @Transactional
    public void createUser(User user) {
        userMapper.insert(user);
    }
    
    // 重要操作，强制读主库
    @DataSource(DataSourceContextHolder.DataSourceType.MASTER)
    @Transactional
    public void transferBalance(Long fromUserId, Long toUserId, BigDecimal amount) {
        // 读取余额必须从主库读取，确保数据一致性
        User fromUser = userMapper.selectById(fromUserId);
        User toUser = userMapper.selectById(toUserId);
        
        if (fromUser.getBalance().compareTo(amount) < 0) {
            throw new BusinessException("余额不足");
        }
        
        // 更新余额
        fromUser.setBalance(fromUser.getBalance().subtract(amount));
        toUser.setBalance(toUser.getBalance().add(amount));
        
        userMapper.updateById(fromUser);
        userMapper.updateById(toUser);
    }
}

// 7. 分布式事务示例（Seata）
@Service
public class DistributedTransactionService {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private AccountService accountService;
    
    @GlobalTransactional(rollbackFor = Exception.class)
    public void createOrder(CreateOrderRequest request) {
        // 1. 创建订单
        orderService.createOrder(request.getOrderInfo());
        
        // 2. 扣减库存（可能调用不同的数据库）
        inventoryService.deductInventory(request.getProductId(), request.getQuantity());
        
        // 3. 扣减账户余额（可能调用不同的服务）
        accountService.deductBalance(request.getUserId(), request.getAmount());
        
        // 任何一个步骤失败，都会回滚所有操作
    }
}
```

```yaml
# application.yml 多数据源配置
app:
  datasource:
    master:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://master-db:3306/app_db?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      username: app_user
      password: app_password
      # Druid连接池配置
      initial-size: 5
      min-idle: 5
      max-active: 20
      max-wait: 60000
      time-between-eviction-runs-millis: 60000
      min-evictable-idle-time-millis: 300000
      validation-query: SELECT 1 FROM DUAL
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
      
    slave:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://slave-db:3306/app_db?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
      username: app_user
      password: app_password
      initial-size: 5
      min-idle: 5
      max-active: 20
      max-wait: 60000
      time-between-eviction-runs-millis: 60000
      min-evictable-idle-time-millis: 300000
      validation-query: SELECT 1 FROM DUAL
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false
```

---

## 🚀 六、性能与调优

 **核心理念**：MyBatis性能优化涉及多个层面，从SQL执行、连接池管理到批处理优化，需要系统性的调优策略来提升应用性能。

### 🎯 MyBatis有哪些性能调优手段？

MyBatis性能调优需要从多个维度进行系统性优化：

 **1. 分页查询优化**：
 - **物理分页vs逻辑分页**：优先使用物理分页（数据库级LIMIT），避免逻辑分页（内存分页）
 - **深分页问题**：使用游标分页或覆盖索引优化，避免OFFSET大偏移量性能问题
 - **PageHelper插件**：合理配置PageHelper，注意线程安全和参数清理

 **2. SQL执行优化**：
 - **预编译Statement**：使用#{}参数占位符，提高SQL执行效率和安全性
 - **批量操作优化**：使用BatchExecutor批量提交，合理设置batch.size大小
 - **避免N+1问题**：使用关联查询、延迟加载或批量查询解决

 **3. 缓存策略优化**：
 - 合理使用一级缓存（SqlSession级别）和二级缓存（namespace级别）
 - 避免缓存穿透和缓存雪崩问题
 - 设置合适的缓存失效策略和TTL

 **4. 连接池调优**：
 - 选择高性能连接池如HikariCP
 - 合理设置连接池大小和超时参数
 - 监控连接池状态，避免连接泄漏

 **5. Executor类型选择**：
 - SIMPLE：每次创建新Statement，适合单次操作
 - REUSE：复用PreparedStatement，适合重复查询
 - BATCH：批量执行，适合大批量操作

**💻 代码示例**：

```java
// 1. 分页查询优化示例
@Service
public class PaginationOptimizationService {
    
    @Autowired
    private UserMapper userMapper;
    
    // 物理分页 - 推荐方式
    public PageResult<User> getUsersByPage(PageParam pageParam) {
        // 使用PageHelper插件实现物理分页
        PageHelper.startPage(pageParam.getPageNum(), pageParam.getPageSize());
        List<User> users = userMapper.selectUsers();
        
        PageInfo<User> pageInfo = new PageInfo<>(users);
        return PageResult.of(users, pageInfo.getTotal(), pageParam.getPageNum(), pageParam.getPageSize());
    }
    
    // 深分页优化 - 使用覆盖索引和游标分页
    public List<User> getUsersByDeepPage(Long lastId, int limit) {
        return userMapper.selectUsersByIdRange(lastId, limit);
    }
}

// 2. 批处理操作优化
@Service
public class BatchOperationService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private SqlSessionFactory sqlSessionFactory;
    
    // 方案1：MyBatis批量插入（适用于中等数据量）
    @Transactional
    public void batchInsertUsers(List<User> users) {
        if (users.size() <= 1000) {
            userMapper.batchInsert(users);
        } else {
            // 分批处理大量数据
            int batchSize = 1000;
            for (int i = 0; i < users.size(); i += batchSize) {
                int endIndex = Math.min(i + batchSize, users.size());
                List<User> batch = users.subList(i, endIndex);
                userMapper.batchInsert(batch);
            }
        }
    }
    
    // 方案2：JDBC批处理（适用于大量数据）
    @Transactional
    public void jdbcBatchInsert(List<User> users) {
        try (SqlSession session = sqlSessionFactory.openSession(ExecutorType.BATCH, false)) {
            UserMapper mapper = session.getMapper(UserMapper.class);
            
            int batchSize = 1000;
            for (int i = 0; i < users.size(); i++) {
                mapper.insert(users.get(i));
                
                // 分批提交，避免内存溢出
                if ((i + 1) % batchSize == 0 || i == users.size() - 1) {
                    session.flushStatements();
                    session.clearCache(); // 清理一级缓存
                }
            }
            session.commit();
        }
    }
}

// 3. 连接池优化配置
@Configuration
public class DataSourceConfig {
    
    @Bean
    @Primary
    public DataSource hikariDataSource() {
        HikariConfig config = new HikariConfig();
        
        // 基本配置
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setJdbcUrl("jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC");
        config.setUsername("root");
        config.setPassword("password");
        
        // 连接池大小配置
        config.setMaximumPoolSize(20);        // 最大连接数
        config.setMinimumIdle(5);             // 最小空闲连接数
        
        // 超时配置
        config.setConnectionTimeout(30000);   // 连接超时时间30秒
        config.setIdleTimeout(600000);        // 空闲超时时间10分钟
        config.setMaxLifetime(1800000);       // 连接最大生命周期30分钟
        config.setLeakDetectionThreshold(60000); // 连接泄漏检测
        
        // MySQL性能优化参数
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.addDataSourceProperty("useServerPrepStmts", "true");
        config.addDataSourceProperty("useLocalSessionState", "true");
        config.addDataSourceProperty("rewriteBatchedStatements", "true");
        
        return new HikariDataSource(config);
    }
}

// 4. N+1问题解决方案
@Service
public class N1ProblemSolutionService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private OrderMapper orderMapper;
    
    // 问题方法：会产生N+1查询
    public List<User> getUsersWithOrdersBad() {
        // 1次查询：获取所有用户
        List<User> users = userMapper.selectAllUsers();
        
        // N次查询：为每个用户查询订单（N+1问题）
        for (User user : users) {
            List<Order> orders = orderMapper.selectByUserId(user.getId());
            user.setOrders(orders);
        }
        
        return users;
    }
    
    // 解决方案1：使用JOIN查询
    public List<User> getUsersWithOrdersJoin() {
        // 1次查询完成所有数据获取
        return userMapper.selectUsersWithOrdersByJoin();
    }
    
    // 解决方案2：分步查询 + 批量IN
    public List<User> getUsersWithOrdersBatch() {
        // 1次查询：获取所有用户
        List<User> users = userMapper.selectAllUsers();
        
        if (!users.isEmpty()) {
            // 提取所有用户ID
            List<Long> userIds = users.stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
            
            // 1次查询：批量获取所有订单
            List<Order> orders = orderMapper.selectByUserIds(userIds);
            
            // 内存中组装数据
            Map<Long, List<Order>> orderMap = orders.stream()
                    .collect(Collectors.groupingBy(Order::getUserId));
            
            users.forEach(user -> 
                user.setOrders(orderMap.getOrDefault(user.getId(), new ArrayList<>()))
            );
        }
        
        return users;
    }
}

// 5. SQL性能监控拦截器
@Intercepts({
    @Signature(type = StatementHandler.class, method = "query", args = {Statement.class, ResultHandler.class}),
    @Signature(type = StatementHandler.class, method = "update", args = {Statement.class})
})
@Component
public class SqlPerformanceInterceptor implements Interceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(SqlPerformanceInterceptor.class);
    private final long slowSqlThreshold = 1000; // 慢SQL阈值
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        BoundSql boundSql = statementHandler.getBoundSql();
        String sql = boundSql.getSql();
        
        long startTime = System.currentTimeMillis();
        String mappedStatementId = getMappedStatementId(statementHandler);
        
        try {
            Object result = invocation.proceed();
            
            long executeTime = System.currentTimeMillis() - startTime;
            
            // 记录SQL执行信息
            if (executeTime > slowSqlThreshold) {
                logger.warn("慢SQL告警 - 执行时间: {}ms, StatementId: {}, SQL: {}", 
                           executeTime, mappedStatementId, sql);
                
                // 可以在这里添加告警逻辑，如发送钉钉消息
                sendSlowSqlAlert(mappedStatementId, executeTime, sql);
            } else {
                logger.info("SQL执行 - 执行时间: {}ms, StatementId: {}", 
                           executeTime, mappedStatementId);
            }
            
            return result;
            
        } catch (Exception e) {
            long executeTime = System.currentTimeMillis() - startTime;
            logger.error("SQL执行异常 - 执行时间: {}ms, StatementId: {}, SQL: {}, 异常: {}", 
                        executeTime, mappedStatementId, sql, e.getMessage());
            throw e;
        }
    }
    
    private String getMappedStatementId(StatementHandler handler) {
        try {
            MetaObject metaObject = SystemMetaObject.forObject(handler);
            MappedStatement mappedStatement = 
                (MappedStatement) metaObject.getValue("delegate.mappedStatement");
            return mappedStatement.getId();
        } catch (Exception e) {
            return "Unknown";
        }
    }
    
    private void sendSlowSqlAlert(String statementId, long executeTime, String sql) {
        // 实现告警逻辑，如发送邮件、钉钉消息等
        // 这里仅作示例
        logger.warn("慢SQL告警：{} 执行时间 {}ms", statementId, executeTime);
    }
    
    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }
    
    @Override
    public void setProperties(Properties properties) {
        // 可以从配置文件读取慢SQL阈值等参数
    }
}

// 6. MyBatis配置优化
@Configuration
public class MyBatisOptimizationConfig {
    
    @Bean
    public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        
        // MyBatis配置优化
        org.apache.ibatis.session.Configuration configuration = 
            new org.apache.ibatis.session.Configuration();
        
        // 缓存配置
        configuration.setCacheEnabled(true);              // 开启二级缓存
        configuration.setLocalCacheScope(LocalCacheScope.SESSION); // 一级缓存范围
        
        // 延迟加载配置
        configuration.setLazyLoadingEnabled(true);        // 开启延迟加载
        configuration.setAggressiveLazyLoading(false);    // 关闭积极加载
        
        // 执行器类型配置
        configuration.setDefaultExecutorType(ExecutorType.REUSE); // 复用PreparedStatement
        
        // 结果集处理优化
        configuration.setMapUnderscoreToCamelCase(true);  // 自动驼峰转换
        configuration.setCallSettersOnNulls(true);        // 空值也调用setter
        
        factoryBean.setConfiguration(configuration);
        
        // 添加性能监控插件
        factoryBean.setPlugins(new SqlPerformanceInterceptor());
        
        return factoryBean;
    }
    
    // 分页插件配置
    @Bean
    public PageInterceptor pageInterceptor() {
        PageInterceptor pageInterceptor = new PageInterceptor();
        Properties props = new Properties();
        props.setProperty("helperDialect", "mysql");
        props.setProperty("reasonable", "true");         // 分页合理化
        props.setProperty("supportMethodsArguments", "true");
        props.setProperty("params", "count=countSql");
        pageInterceptor.setProperties(props);
        return pageInterceptor;
    }
}
```

### 🎯 如何定位和解决N+1查询问题？

N+1查询是MyBatis中常见的性能问题，需要系统性的识别和解决：

 **问题识别**：
 - 日志中出现大量相似的子查询
 - APM监控显示同一接口执行了多次相同SQL
 - 查询时间随数据量线性增长
 - 数据库连接数异常增长

 **根本原因**：
 - 关联查询设计不当，使用了嵌套查询而非连接查询
 - 延迟加载触发了意外的额外查询
 - 缺少合适的批量查询策略

 **解决策略**：
 1. **关联查询优化**：使用JOIN替代嵌套查询
 2. **resultMap嵌套**：一次查询获取所有数据
 3. **批量IN查询**：先查主表，再批量查询关联表
 4. **延迟加载控制**：合理配置懒加载策略
 5. **缓存机制**：使用适当的缓存减少重复查询

 **治理方案**：定期审查SQL日志，建立慢查询监控，制定关联查询规范。

**💻 代码示例**：

```xml
<!-- N+1问题示例和解决方案 -->
<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 7. 对应Java代码的Mapper XML配置 -->
    
    <!-- 基础用户查询 -->
    <select id="selectAllUsers" resultType="User">
        SELECT id, name, email, phone FROM user WHERE status = 1
    </select>
    
    <!-- 深分页优化查询 -->
    <select id="selectUsersByIdRange" resultType="User">
        SELECT id, name, email, phone 
        FROM user 
        WHERE id > #{lastId} AND status = 1
        ORDER BY id 
        LIMIT #{limit}
    </select>
    
    <!-- 批量插入 -->
    <insert id="batchInsert" parameterType="list" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user (name, email, phone, status) VALUES
        <foreach collection="list" item="user" separator=",">
            (#{user.name}, #{user.email}, #{user.phone}, #{user.status})
        </foreach>
    </insert>
    
    <!-- 单条插入 -->
    <insert id="insert" parameterType="User" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user (name, email, phone, status) 
        VALUES (#{name}, #{email}, #{phone}, #{status})
    </insert>
    
    <!-- 使用JOIN解决N+1问题 -->
    <resultMap id="UserWithOrdersMap" type="User">
        <id property="id" column="user_id"/>
        <result property="name" column="user_name"/>
        <result property="email" column="user_email"/>
        <collection property="orders" ofType="Order">
            <id property="id" column="order_id"/>
            <result property="orderNo" column="order_no"/>
            <result property="amount" column="amount"/>
            <result property="userId" column="user_id"/>
        </collection>
    </resultMap>
    
    <select id="selectUsersWithOrdersByJoin" resultMap="UserWithOrdersMap">
        SELECT 
            u.id as user_id,
            u.name as user_name,
            u.email as user_email,
            o.id as order_id,
            o.order_no,
            o.amount
        FROM user u 
        LEFT JOIN `order` o ON u.id = o.user_id
        WHERE u.status = 1
        ORDER BY u.id, o.id
    </select>
</mapper>

<!-- 订单Mapper配置 -->
<mapper namespace="com.example.mapper.OrderMapper">
    
    <!-- 根据用户ID查询订单（会产生N+1问题） -->
    <select id="selectByUserId" parameterType="long" resultType="Order">
        SELECT id, order_no, amount, user_id, create_time
        FROM `order`
        WHERE user_id = #{userId}
    </select>
    
    <!-- 批量根据用户ID查询订单（解决N+1问题） -->
    <select id="selectByUserIds" parameterType="list" resultType="Order">
        SELECT id, order_no, amount, user_id, create_time
        FROM `order`
        WHERE user_id IN
        <foreach collection="list" item="userId" open="(" close=")" separator=",">
            #{userId}
        </foreach>
    </select>
</mapper>

<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 问题SQL：会产生N+1查询 -->
    <resultMap id="UserWithOrdersN1" type="User">
        <id property="id" column="id"/>
        <result property="name" column="name"/>
        <!-- 每个用户都会执行一次查询订单的SQL -->
        <collection property="orders" column="id" 
                   select="com.example.mapper.OrderMapper.findByUserId"/>
    </resultMap>
    
    <select id="findUsersWithN1Problem" resultMap="UserWithOrdersN1">
        SELECT * FROM user  <!-- 查询N个用户 -->
        <!-- 然后为每个用户执行：SELECT * FROM order WHERE user_id = ? -->
    </select>
    
    <!-- 解决方案1：使用JOIN查询 -->
    <resultMap id="UserWithOrdersJoin" type="User">
        <id property="id" column="user_id"/>
        <result property="name" column="user_name"/>
        <collection property="orders" ofType="Order">
            <id property="id" column="order_id"/>
            <result property="orderNo" column="order_no"/>
            <result property="amount" column="amount"/>
        </collection>
    </resultMap>
    
    <select id="findUsersWithOrdersJoin" resultMap="UserWithOrdersJoin">
        SELECT 
            u.id as user_id,
            u.name as user_name,
            o.id as order_id,
            o.order_no,
            o.amount
        FROM user u 
        LEFT JOIN order o ON u.id = o.user_id
    </select>
    
    <!-- 解决方案2：批量查询 -->
    <select id="findAllUsers" resultType="User">
        SELECT * FROM user
    </select>
    
    <!-- 配合Service层批量查询订单 -->
    <select id="findOrdersByUserIds" resultType="Order">
        SELECT * FROM order 
        WHERE user_id IN
        <foreach collection="userIds" item="userId" open="(" close=")" separator=",">
            #{userId}
        </foreach>
    </select>
    
    <!-- 解决方案3：使用嵌套结果映射 -->
    <select id="findUsersWithOrdersNested" resultMap="UserWithOrdersJoin">
        <![CDATA[
        SELECT 
            u.id as user_id,
            u.name as user_name,
            o.id as order_id,
            o.order_no,
            o.amount
        FROM user u 
        LEFT JOIN order o ON u.id = o.user_id
        ORDER BY u.id
        ]]>
    </select>
</mapper>
```

### 🎯 MyBatis批处理和主键回填的最佳实践？

MyBatis批处理和主键回填需要根据场景选择合适的策略：

 **单条记录主键回填**：
 - 使用useGeneratedKeys=true + keyProperty配置
 - 适用于单条INSERT操作
 - 支持自增主键自动回填到对象

 **批量插入策略**：
 1. **MyBatis批量插入**：使用foreach生成多值INSERT
 2. **JDBC批处理**：ExecutorType.BATCH + 分批flush
 3. **数据库原生批量**：load data infile等

 **批量主键回填**：
 - MySQL：支持批量主键回填，依赖JDBC驱动版本
 - PostgreSQL：使用RETURNING子句
 - Oracle：使用序列或RETURNING INTO
 - 不同数据库厂商支持程度不同，需要测试验证

 **性能优化建议**：
 - 大批量操作优先使用JDBC批处理
 - 合理设置批次大小（建议1000-5000）
 - 关闭自动提交，手动控制事务
 - 监控内存使用，避免OOM

 **最佳实践**：根据数据量选择策略，小批量用MyBatis批量插入，大批量用JDBC批处理。

**💻 代码示例**：

```java
// 批处理和主键回填最佳实践
@Service
public class BatchInsertService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private SqlSessionFactory sqlSessionFactory;
    
    // 单条插入主键回填
    @Transactional
    public void insertSingleUser(User user) {
        userMapper.insertUser(user);
        System.out.println("插入用户ID: " + user.getId()); // 主键已自动回填
    }
    
    // 小批量插入（1000以内）
    @Transactional
    public void smallBatchInsert(List<User> users) {
        if (users.size() <= 1000) {
            userMapper.batchInsert(users);
        } else {
            // 分批处理
            int batchSize = 1000;
            for (int i = 0; i < users.size(); i += batchSize) {
                int endIndex = Math.min(i + batchSize, users.size());
                List<User> batch = users.subList(i, endIndex);
                userMapper.batchInsert(batch);
            }
        }
    }
    
    // 大批量JDBC批处理（推荐用于大量数据）
    @Transactional
    public int[] largeBatchInsert(List<User> users) {
        try (SqlSession session = sqlSessionFactory.openSession(ExecutorType.BATCH)) {
            UserMapper batchMapper = session.getMapper(UserMapper.class);
            
            int batchSize = 1000;
            int[] results = new int[users.size()];
            int resultIndex = 0;
            
            for (int i = 0; i < users.size(); i++) {
                batchMapper.insertUser(users.get(i));
                
                // 分批提交，避免内存溢出
                if ((i + 1) % batchSize == 0 || i == users.size() - 1) {
                    List<BatchResult> batchResults = session.flushStatements();
                    
                    // 处理批处理结果
                    for (BatchResult batchResult : batchResults) {
                        int[] updateCounts = batchResult.getUpdateCounts();
                        System.arraycopy(updateCounts, 0, results, resultIndex, updateCounts.length);
                        resultIndex += updateCounts.length;
                    }
                }
            }
            
            session.commit();
            return results;
        }
    }
    
    // 批量插入with主键回填（MySQL示例）
    @Transactional
    public void batchInsertWithKeyReturn(List<User> users) {
        // 使用MyBatis的batch insert with key return
        userMapper.batchInsertWithKeys(users);
        
        // 验证主键回填
        for (User user : users) {
            System.out.println("用户 " + user.getName() + " ID: " + user.getId());
        }
    }
    
    // 高性能批量插入（适用于超大批量）
    public void highPerformanceBatchInsert(List<User> users) {
        int batchSize = 5000;
        
        try (SqlSession session = sqlSessionFactory.openSession(ExecutorType.BATCH, false)) {
            UserMapper mapper = session.getMapper(UserMapper.class);
            
            for (int i = 0; i < users.size(); i++) {
                mapper.insertUser(users.get(i));
                
                if (i % batchSize == 0) {
                    session.flushStatements();
                    session.clearCache(); // 清理一级缓存，释放内存
                }
            }
            
            session.flushStatements();
            session.commit();
        } catch (Exception e) {
            throw new RuntimeException("批量插入失败", e);
        }
    }
    
    // 不同数据库的主键回填策略
    public void databaseSpecificKeyReturn() {
        // MySQL: 支持批量主键回填
        // useGeneratedKeys="true" keyProperty="id
        
        // PostgreSQL: 使用RETURNING
        // INSERT INTO user (name) VALUES (#{name}) RETURNING id
        
        // Oracle: 使用序列
        // <selectKey keyProperty="id" resultType="long" order="BEFORE">
        //   SELECT user_seq.NEXTVAL FROM dual
        // </selectKey>
        
        // SQL Server: 使用IDENTITY
        // useGeneratedKeys="true" keyProperty="id
    }
}

// 批处理性能监控
@Component
public class BatchPerformanceMonitor {
    
    public void monitorBatchPerformance() {
        System.out.println("=== 批处理性能监控要点 ===");
        
        System.out.println("1. 监控指标：");
        System.out.println("   - 批处理执行时间");
        System.out.println("   - 内存使用情况");
        System.out.println("   - 数据库连接数");
        System.out.println("   - 事务提交频率");
        
        System.out.println("2. 优化策略：");
        System.out.println("   - 合理设置批次大小");
        System.out.println("   - 及时清理一级缓存");
        System.out.println("   - 使用合适的执行器类型");
        System.out.println("   - 监控和调整JVM内存参数");
        
        System.out.println("3. 常见问题：");
        System.out.println("   - OOM：批次过大或缓存未清理");
        System.out.println("   - 死锁：并发批处理冲突");
        System.out.println("   - 超时：单批次数据量过大");
        System.out.println("   - 主键冲突：重复数据检查不充分");
    }
}


```

### 🎯 如何设计MyBatis的错误处理和异常机制？

MyBatis异常处理需要建立分层的异常处理机制：

 **异常分层设计**：
 1. **DAO层**：捕获MyBatis和数据库异常，转换为业务异常
 2. **Service层**：处理业务逻辑异常，记录操作日志
 3. **Controller层**：统一异常处理，返回友好错误信息

 **异常分类处理**：
 - **数据库连接异常**：记录详细日志，返回系统繁忙提示
 - **SQL语法异常**：记录SQL和参数，避免泄露敏感信息
 - **约束违反异常**：解析约束类型，返回具体业务提示
 - **超时异常**：记录执行时间，提供重试建议

 **日志记录规范**：
 - 记录traceId便于链路追踪
 - 记录SQL语句和参数值（脱敏处理）
 - 记录执行时间和影响行数
 - 敏感操作记录审计日志

 **监控告警机制**：
 - 慢SQL自动告警
 - 异常频率监控
 - 数据库连接池监控
 - 关键业务操作监控

 目标是让异常信息对开发者有用，对用户友好，对系统安全。

**💻 代码示例**：

```java
// 异常处理和监控示例
@Component
@Slf4j
public class MyBatisErrorHandler {
    
    // 统一异常转换
    public static RuntimeException convertException(Exception e, String operation) {
        String traceId = MDC.get("traceId");
        
        if (e instanceof DataIntegrityViolationException) {
            return handleDataIntegrityViolation((DataIntegrityViolationException) e, operation);
        } else if (e instanceof QueryTimeoutException) {
            return handleQueryTimeout((QueryTimeoutException) e, operation);
        } else if (e instanceof BadSqlGrammarException) {
            return handleBadSqlGrammar((BadSqlGrammarException) e, operation);
        } else if (e instanceof DataAccessResourceFailureException) {
            return handleResourceFailure((DataAccessResourceFailureException) e, operation);
        } else {
            log.error("未知数据访问异常, traceId: {}, operation: {}", traceId, operation, e);
            return new ServiceException("数据操作失败");
        }
    }
    
    private static RuntimeException handleDataIntegrityViolation(
            DataIntegrityViolationException e, String operation) {
        String message = e.getMessage();
        String traceId = MDC.get("traceId");
        
        log.warn("数据完整性约束违反, traceId: {}, operation: {}, message: {}", 
                traceId, operation, message);
        
        if (message.contains("Duplicate entry")) {
            String field = extractDuplicateField(message);
            return new BusinessException("数据重复，字段 " + field + " 已存在");
        } else if (message.contains("foreign key constraint")) {
            return new BusinessException("关联数据不存在或已被删除");
        } else if (message.contains("cannot be null")) {
            String field = extractNullField(message);
            return new BusinessException("必填字段 " + field + " 不能为空");
        }
        
        return new BusinessException("数据约束违反，请检查输入数据");
    }
    
    private static RuntimeException handleQueryTimeout(
            QueryTimeoutException e, String operation) {
        String traceId = MDC.get("traceId");
        
        log.error("查询超时, traceId: {}, operation: {}", traceId, operation, e);
        
        // 触发告警
        AlertManager.sendAlert("SQL_TIMEOUT", 
            String.format("查询超时: %s, traceId: %s", operation, traceId));
        
        return new ServiceException("查询超时，请稍后重试");
    }
    
    // SQL注入检测和防护
    @Component
    public static class SqlInjectionProtector {
        
        private static final List<String> SQL_INJECTION_PATTERNS = Arrays.asList(
            "union", "select", "insert", "update", "delete", "drop", "create", "alter",
            "exec", "execute", "--", "/*", "*/", "xp_", "sp_", "0x
        );
        
        public static void checkSqlInjection(String input) {
            if (StringUtils.isEmpty(input)) {
                return;
            }
            
            String lowerInput = input.toLowerCase();
            for (String pattern : SQL_INJECTION_PATTERNS) {
                if (lowerInput.contains(pattern)) {
                    String traceId = MDC.get("traceId");
                    log.error("检测到SQL注入攻击, traceId: {}, input: {}", traceId, input);
                    
                    // 记录安全日志
                    SecurityLog securityLog = SecurityLog.builder()
                            .traceId(traceId)
                            .attackType("SQL_INJECTION")
                            .attackContent(input)
                            .clientIp(getClientIp())
                            .build();
                    
                    SecurityLogService.record(securityLog);
                    
                    throw new SecurityException("检测到非法输入");
                }
            }
        }
    }
}

// 审计日志和追踪
@Component
@Slf4j
public class MyBatisAuditLogger {
    
    @EventListener
    public void handleDataChange(DataChangeEvent event) {
        String traceId = MDC.get("traceId");
        
        AuditLog auditLog = AuditLog.builder()
                .traceId(traceId)
                .operation(event.getOperation())
                .tableName(event.getTableName())
                .entityId(event.getEntityId())
                .oldValue(event.getOldValue())
                .newValue(event.getNewValue())
                .operatorId(event.getOperatorId())
                .operateTime(new Date())
                .clientIp(event.getClientIp())
                .userAgent(event.getUserAgent())
                .build();
        
        // 异步记录审计日志
        auditLogService.recordAsync(auditLog);
        
        log.info("数据变更审计, traceId: {}, operation: {}, table: {}, entityId: {}", 
                traceId, event.getOperation(), event.getTableName(), event.getEntityId());
    }
}

// 性能监控和告警
@Component
public class MyBatisPerformanceMonitor {
    
    private final MeterRegistry meterRegistry;
    private final Counter sqlExecuteCounter;
    private final Timer sqlExecuteTimer;
    
    public MyBatisPerformanceMonitor(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.sqlExecuteCounter = Counter.builder("mybatis.sql.execute.count")
                .description("SQL执行次数")
                .register(meterRegistry);
        this.sqlExecuteTimer = Timer.builder("mybatis.sql.execute.time")
                .description("SQL执行时间")
                .register(meterRegistry);
    }
    
    public void recordSqlExecution(String sqlId, long executionTime, boolean success) {
        // 记录执行次数
        sqlExecuteCounter.increment(
                Tags.of("sql_id", sqlId, "success", String.valueOf(success)));
        
        // 记录执行时间
        sqlExecuteTimer.record(executionTime, TimeUnit.MILLISECONDS);
        
        // 慢SQL告警
        if (executionTime > 2000) {
            AlertManager.sendSlowSqlAlert(sqlId, executionTime);
        }
        
        // 失败告警
        if (!success) {
            AlertManager.sendSqlErrorAlert(sqlId);
        }
    }
}
```



---

## 🧭 七、工程化与规范

 **核心理念**：建立MyBatis开发的工程化标准和最佳实践，确保代码质量、可维护性和团队协作效率。

### 🎯 MyBatis开发规范有哪些要点？

MyBatis开发规范涉及命名规范、代码规范、SQL规范和安全规范等多个层面：

 **1. 命名规范**：
 - Mapper接口：表名 + Mapper，如UserMapper、OrderMapper
 - XML文件：与Mapper接口同名，放在同包路径下
 - SQL ID：动词 + 实体 + 条件，如selectUserById、updateUserByCondition
 - 参数名称：使用@Param注解明确参数名

 **2. 代码组织规范**：
 - Mapper接口与XML文件一一对应
 - 复杂SQL抽取到XML中，简单查询可用注解
 - SQL片段复用，避免重复代码
 - 合理使用命名空间隔离不同业务模块

 **3. SQL编写规范**：
 - 禁止select *，明确指定需要的字段
 - WHERE条件必须有兜底条件，避免全表操作
 - 分页查询必须有排序字段，保证结果稳定性
 - 避免隐式类型转换，明确指定参数类型

 **4. 安全规范**：
 - 严格禁用${}拼接用户输入，必须使用#{}参数化
 - 动态表名、列名使用白名单校验
 - 敏感数据查询添加权限检查
 - SQL注入防护和参数校验

 **5. 性能规范**：
 - 合理使用索引，避免全表扫描
 - 限制查询结果集大小
 - 批量操作使用合适的批处理策略
 - 监控慢SQL并及时优化

 **6. 变更管理规范**：
 - 数据库变更必须向前兼容
 - 生产环境变更走正式发布流程
 - 重要变更需要灰度发布和回滚预案
 - 变更记录和审计追踪

**💻 代码示例**：

```java
// MyBatis开发规范示例
public class MyBatisBestPracticesDemo {
    
    // 1. 命名规范示例
    public interface UserMapper {
        // ✅ 好的命名：动词+实体+条件
        User selectUserById(@Param("id") Long id);
        List<User> selectUsersByCondition(@Param("condition") UserQueryCondition condition);
        int updateUserById(@Param("user") User user);
        int deleteUserById(@Param("id") Long id);
        
        // ❌ 不好的命名
        // User get(Long id);  // 动词不明确
        // List<User> list();  // 没有明确查询条件
    }
    
    // 2. 参数对象规范
    public static class UserQueryCondition {
        private String name;
        private Integer minAge;
        private Integer maxAge;
        private String email;
        private Integer status;
        private String sortField = "id";    // 默认排序字段
        private String sortOrder = "ASC";   // 默认排序方向
        
        // 参数校验
        public void validate() {
            if (StringUtils.isNotBlank(sortField)) {
                // 排序字段白名单校验
                List<String> allowedFields = Arrays.asList("id", "name", "createTime", "updateTime");
                if (!allowedFields.contains(sortField)) {
                    throw new IllegalArgumentException("不允许的排序字段: " + sortField);
                }
            }
        }
        
        // getters and setters...
    }
    
    // 3. Service层规范示例
    @Service
    @Slf4j
    public class UserService {
        
        @Autowired
        private UserMapper userMapper;
        
        // ✅ 规范的查询方法
        public PageResult<User> queryUsers(UserQueryCondition condition, PageParam pageParam) {
            // 参数校验
            condition.validate();
            pageParam.validate();
            
            // 记录查询日志
            String traceId = MDC.get("traceId");
            log.info("查询用户列表开始, traceId: {}, condition: {}", traceId, condition);
            
            long startTime = System.currentTimeMillis();
            try {
                // 查询总数
                int total = userMapper.countUsersByCondition(condition);
                if (total == 0) {
                    return PageResult.empty();
                }
                
                // 查询数据
                List<User> users = userMapper.selectUsersByConditionWithPage(condition, pageParam);
                
                // 性能监控
                long cost = System.currentTimeMillis() - startTime;
                if (cost > 1000) {
                    log.warn("慢查询告警, traceId: {}, cost: {}ms, condition: {}", 
                            traceId, cost, condition);
                }
                
                return PageResult.of(users, total, pageParam);
                
            } catch (Exception e) {
                log.error("查询用户列表失败, traceId: {}, condition: {}", traceId, condition, e);
                throw new ServiceException("查询用户失败", e);
            }
        }
        
        // ✅ 规范的更新方法
        @Transactional(rollbackFor = Exception.class)
        public void updateUser(User user) {
            String traceId = MDC.get("traceId");
            
            // 参数校验
            if (user == null || user.getId() == null) {
                throw new IllegalArgumentException("用户ID不能为空");
            }
            
            // 查询原数据（用于审计）
            User oldUser = userMapper.selectUserById(user.getId());
            if (oldUser == null) {
                throw new BusinessException("用户不存在");
            }
            
            // 执行更新
            int affected = userMapper.updateUserById(user);
            if (affected != 1) {
                throw new ServiceException("更新用户失败，影响行数: " + affected);
            }
            
            // 记录审计日志
            AuditLog auditLog = AuditLog.builder()
                    .traceId(traceId)
                    .operation("UPDATE_USER")
                    .entityId(user.getId().toString())
                    .oldValue(JSON.toJSONString(oldUser))
                    .newValue(JSON.toJSONString(user))
                    .operatorId(getCurrentUserId())
                    .build();
            
            auditLogService.record(auditLog);
            log.info("用户更新成功, traceId: {}, userId: {}", traceId, user.getId());
        }
    }
    
    // 4. 异常处理规范
    @RestControllerAdvice
    public class MyBatisExceptionHandler {
        
        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseResult handleDataIntegrityViolation(DataIntegrityViolationException e) {
            log.error("数据完整性约束违反", e);
            
            // 根据具体异常返回友好提示
            if (e.getMessage().contains("Duplicate entry")) {
                return ResponseResult.error("数据重复，请检查后重试");
            }
            
            return ResponseResult.error("数据操作失败，请联系管理员");
        }
        
        @ExceptionHandler(BadSqlGrammarException.class)
        public ResponseResult handleBadSqlGrammar(BadSqlGrammarException e) {
            log.error("SQL语法错误", e);
            return ResponseResult.error("系统内部错误，请稍后重试");
        }
        
        @ExceptionHandler(DataAccessException.class)
        public ResponseResult handleDataAccess(DataAccessException e) {
            log.error("数据访问异常", e);
            
            // 记录详细错误信息用于排查
            String traceId = MDC.get("traceId");
            ErrorLog errorLog = ErrorLog.builder()
                    .traceId(traceId)
                    .errorType("DATA_ACCESS")
                    .errorMessage(e.getMessage())
                    .stackTrace(ExceptionUtils.getStackTrace(e))
                    .build();
            
            errorLogService.record(errorLog);
            
            return ResponseResult.error("数据操作异常");
        }
    }
}

// 工程化配置示例
@Configuration
public class MyBatisEngineeringConfig {
    
    // SQL性能监控插件
    @Bean
    public SqlPerformanceInterceptor sqlPerformanceInterceptor() {
        SqlPerformanceInterceptor interceptor = new SqlPerformanceInterceptor();
        interceptor.setSlowSqlThreshold(1000L); // 慢SQL阈值1秒
        interceptor.setLogSlowSql(true);
        return interceptor;
    }
    
    // SQL注入防护插件
    @Bean
    public SqlInjectionInterceptor sqlInjectionInterceptor() {
        return new SqlInjectionInterceptor();
    }
    
    // 分页插件配置
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        PaginationInterceptor interceptor = new PaginationInterceptor();
        interceptor.setCountSqlParser(new JsqlParserCountOptimize(true));
        interceptor.setLimit(10000); // 最大分页限制
        return interceptor;
    }
}
```

---

## 🔄 八、ORM 生态对比

 **核心理念**：不同ORM框架各有特色，选择合适的ORM需要综合考虑业务特点、团队能力和系统要求，MyBatis与其他框架的组合使用是企业级应用的常见模式。

### 🎯 MyBatis vs JPA/Hibernate：各有什么特点？如何选择？

MyBatis和JPA/Hibernate代表了两种不同的ORM设计理念：

 **MyBatis特点**：

 **优势**：
 - **SQL透明可控**：手写SQL，完全掌控SQL执行逻辑和性能
 - **学习成本低**：接近原生JDBC，Java开发者容易上手
 - **性能调优空间大**：可以针对具体业务场景精确优化SQL
 - **复杂查询友好**：支持复杂的报表查询和统计分析SQL
 - **数据库特性利用充分**：可以使用数据库特有的函数和特性

 **劣势**：
 - **开发效率相对低**：需要手写大量SQL和映射配置
 - **SQL维护成本高**：数据库变更需要同步修改SQL
 - **移植性差**：SQL绑定特定数据库，跨数据库迁移困难
 - **对象关联复杂**：处理复杂对象关系需要更多代码

 **JPA/Hibernate特点**：

 **优势**：
 - **面向对象**：完全的OOP思维，实体关系映射自然
 - **开发效率高**：自动生成SQL，减少样板代码
 - **数据库无关性**：支持多数据库，迁移成本低
 - **功能丰富**：缓存、懒加载、脏检查等高级特性
 - **标准化**：JPA是Java EE标准，有良好的生态支持

 **劣势**：
 - **学习曲线陡峭**：概念复杂，需要深入理解ORM原理
 - **性能不透明**：自动生成的SQL可能不是最优的
 - **调优复杂**：性能问题定位困难，需要深入了解底层机制
 - **复杂查询局限**：某些复杂业务查询用JPQL/HQL表达困难

 **选择策略**：
 - **报表/分析系统**：选择MyBatis，SQL控制力强
 - **传统业务系统**：JPA/Hibernate，开发效率高
 - **性能敏感系统**：MyBatis，便于精确调优
 - **快速原型**：JPA，自动建表和CRUD
 - **混合架构**：核心业务用MyBatis，辅助模块用JPA

### 🎯 MyBatis-Plus能解决什么问题？有哪些最佳实践？

MyBatis-Plus是MyBatis的增强工具，在保持MyBatis特性的基础上提供了更多便利功能：

 **核心优势**：

 **1. 单表CRUD自动化**：
 - 继承BaseMapper接口即可获得完整的CRUD操作
 - 支持泛型，类型安全
 - 自动根据实体类生成对应的SQL操作

 **2. 强大的条件构造器**：
 - QueryWrapper和UpdateWrapper提供链式API
 - 支持复杂的动态查询条件
 - 避免手写动态SQL的复杂性

 **3. 内置分页插件**：
 - 自动处理COUNT查询和数据查询
 - 支持多种数据库的分页语法
 - 防止全表扫描的安全机制

 **4. 代码生成器**：
 - 根据数据库表自动生成Entity、Mapper、Service、Controller
 - 支持多种模板引擎
 - 大幅减少重复代码编写

 **5. 高级特性**：
 - **审计字段自动填充**：自动处理createTime、updateTime等字段
 - **逻辑删除**：软删除支持，数据安全
 - **乐观锁**：version字段自动处理
 - **多租户**：自动添加租户ID条件

 **使用注意事项**：

 **1. 通用方法的边界**：
 - 复杂业务逻辑仍需自定义SQL
 - 跨表操作需要手动处理
 - 批量操作性能需要特别关注

 **2. 安全性考虑**：
 - 避免在生产环境使用delete()等危险操作
 - 合理配置逻辑删除策略
 - 注意条件构造器的SQL注入风险

 **3. 性能优化**：
 - 合理使用索引，避免条件构造器生成低效SQL
 - 大数据量操作采用分页处理
 - 监控自动生成的SQL性能

 **最佳实践建议**：
 - 简单CRUD用MyBatis-Plus，复杂查询用原生MyBatis
 - 建立代码规范，统一团队使用方式
 - 做好单元测试，确保自动生成的SQL符合预期

**💻 代码示例**：

```java
// 1. MyBatis-Plus基础使用示例
@Entity
@TableName("user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("user_name")
    private String name;
    
    private String email;
    
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
    
    @TableLogic
    private Integer deleted;
    
    @Version
    private Integer version;
    
    // getters and setters...
}

// 2. Mapper接口 - 继承BaseMapper
public interface UserMapper extends BaseMapper<User> {
    
    // 自动获得完整的CRUD操作
    // insert(T entity)
    // deleteById(Serializable id)
    // updateById(T entity)
    // selectById(Serializable id)
    // selectList(Wrapper<T> queryWrapper)
    // ...
    
    // 自定义复杂查询仍使用MyBatis原生方式
    @Select("SELECT u.*, p.name as province_name FROM user u " +
            "LEFT JOIN province p ON u.province_id = p.id " +
            "WHERE u.status = #{status}")
    List<UserVO> selectUsersWithProvince(@Param("status") Integer status);
}

// 3. Service层 - 继承ServiceImpl
@Service
public class UserService extends ServiceImpl<UserMapper, User> {
    
    // 条件构造器示例
    public List<User> findActiveUsersByAge(Integer minAge, Integer maxAge) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", 1)
                   .between("age", minAge, maxAge)
                   .orderByDesc("create_time");
        
        return list(queryWrapper);
    }
    
    // Lambda条件构造器（类型安全）
    public List<User> findUsersByCondition(String name, String email) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(StringUtils.isNotEmpty(name), User::getName, name)
                   .eq(StringUtils.isNotEmpty(email), User::getEmail, email);
        
        return list(queryWrapper);
    }
    
    // 批量操作
    @Transactional
    public boolean batchUpdateUsers(List<User> users) {
        return updateBatchById(users);
    }
    
    // 分页查询
    public IPage<User> getUsersByPage(Integer pageNum, Integer pageSize, String keyword) {
        Page<User> page = new Page<>(pageNum, pageSize);
        
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (StringUtils.isNotEmpty(keyword)) {
            queryWrapper.and(wrapper -> 
                wrapper.like("name", keyword)
                       .or()
                       .like("email", keyword));
        }
        
        return page(page, queryWrapper);
    }
}

// 4. MyBatis-Plus配置
@Configuration
public class MybatisPlusConfig {
    
    // 分页插件
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
        
        // 设置请求的页面大于最大页后操作，true调回到首页，false继续请求
        paginationInterceptor.setOverflow(false);
        
        // 设置最大单页限制数量，默认500条，-1不受限制
        paginationInterceptor.setLimit(1000);
        
        return paginationInterceptor;
    }
    
    // 审计字段自动填充
    @Bean
    public MetaObjectHandler metaObjectHandler() {
        return new MetaObjectHandler() {
            @Override
            public void insertFill(MetaObject metaObject) {
                this.setFieldValByName("createTime", new Date(), metaObject);
                this.setFieldValByName("updateTime", new Date(), metaObject);
                this.setFieldValByName("createBy", getCurrentUserId(), metaObject);
            }
            
            @Override
            public void updateFill(MetaObject metaObject) {
                this.setFieldValByName("updateTime", new Date(), metaObject);
                this.setFieldValByName("updateBy", getCurrentUserId(), metaObject);
            }
            
            private Long getCurrentUserId() {
                // 从Spring Security或其他方式获取当前用户ID
                return UserContextHolder.getCurrentUserId();
            }
        };
    }
    
    // 多租户插件
    @Bean
    public TenantLineInnerInterceptor tenantLineInnerInterceptor() {
        return new TenantLineInnerInterceptor(new TenantLineHandler() {
            @Override
            public Expression getTenantId() {
                // 从上下文获取租户ID
                Long tenantId = TenantContextHolder.getTenantId();
                return new LongValue(tenantId);
            }
            
            @Override
            public String getTenantIdColumn() {
                return "tenant_id";
            }
            
            @Override
            public boolean ignoreTable(String tableName) {
                // 忽略系统表
                return Arrays.asList("sys_config", "sys_dict").contains(tableName);
            }
        });
    }
}

// 5. JPA vs MyBatis对比示例
// JPA方式
@Entity
@Table(name = "user")
public class JpaUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_name")
    private String name;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
    
    // JPA Repository
    public interface JpaUserRepository extends JpaRepository<JpaUser, Long> {
        
        // 方法名约定查询
        List<JpaUser> findByNameContainingAndStatus(String name, Integer status);
        
        // JPQL查询
        @Query("SELECT u FROM JpaUser u WHERE u.createTime > :startTime")
        List<JpaUser> findRecentUsers(@Param("startTime") Date startTime);
        
        // 原生SQL查询（复杂场景）
        @Query(value = "SELECT * FROM user u LEFT JOIN order o ON u.id = o.user_id " +
                      "WHERE u.status = ?1 GROUP BY u.id HAVING COUNT(o.id) > ?2", 
               nativeQuery = true)
        List<JpaUser> findUsersWithMultipleOrders(Integer status, Integer orderCount);
    }
}

// MyBatis方式对比
public interface MyBatisUserMapper extends BaseMapper<User> {
    
    // 更灵活的SQL控制
    @Select("<script>" +
            "SELECT u.* FROM user u " +
            "<where>" +
            "  <if test='name != null'>AND name LIKE CONCAT('%', #{name}, '%')</if>" +
            "  <if test='status != null'>AND status = #{status}</if>" +
            "</where>" +
            "</script>")
    List<User> findUsersByCondition(@Param("name") String name, 
                                   @Param("status") Integer status);
    
    // 复杂报表查询（JPA难以表达）
    List<UserStatisticsVO> getUserStatisticsReport(@Param("params") ReportParams params);
}

// 6. 混合使用示例 - 在同一项目中组合使用
@Service
public class HybridUserService {
    
    @Autowired
    private UserMapper mybatisMapper;  // MyBatis-Plus
    
    @Autowired
    private JpaUserRepository jpaRepository;  // JPA
    
    // 简单CRUD用MyBatis-Plus
    public User createUser(User user) {
        mybatisMapper.insert(user);
        return user;
    }
    
    // 复杂查询用MyBatis原生
    public List<UserStatisticsVO> getComplexReport(ReportParams params) {
        return mybatisMapper.getUserStatisticsReport(params);
    }
    
    // 对象关系映射用JPA
    public List<JpaUser> getUsersWithOrders() {
        return jpaRepository.findAll();  // 自动加载关联的orders
    }
    
    // 根据场景选择合适的工具
    public PageResult<User> searchUsers(UserSearchParams params) {
        if (params.isSimpleQuery()) {
            // 简单查询用MyBatis-Plus条件构造器
            QueryWrapper<User> wrapper = new QueryWrapper<>();
            wrapper.like("name", params.getKeyword());
            return PageResult.of(mybatisMapper.selectList(wrapper));
        } else {
            // 复杂查询用自定义SQL
            return mybatisMapper.searchUsersComplex(params);
        }
    }
}

// 7. 代码生成器示例
@Test
public void generateCode() {
    AutoGenerator generator = new AutoGenerator();
    
    // 全局配置
    GlobalConfig globalConfig = new GlobalConfig();
    globalConfig.setOutputDir(System.getProperty("user.dir") + "/src/main/java");
    globalConfig.setAuthor("MyBatis-Plus Generator");
    globalConfig.setOpen(false);
    globalConfig.setServiceName("%sService");  // 去除Service接口的首字母I
    
    // 数据源配置
    DataSourceConfig dataSourceConfig = new DataSourceConfig();
    dataSourceConfig.setUrl("jdbc:mysql://localhost:3306/test?serverTimezone=UTC");
    dataSourceConfig.setDriverName("com.mysql.cj.jdbc.Driver");
    dataSourceConfig.setUsername("root");
    dataSourceConfig.setPassword("password");
    
    // 包配置
    PackageConfig packageConfig = new PackageConfig();
    packageConfig.setParent("com.example");
    packageConfig.setEntity("model");
    packageConfig.setMapper("mapper");
    packageConfig.setService("service");
    packageConfig.setController("controller");
    
    // 策略配置
    StrategyConfig strategyConfig = new StrategyConfig();
    strategyConfig.setInclude("user", "order");  // 指定生成的表名
    strategyConfig.setNaming(NamingStrategy.underline_to_camel);
    strategyConfig.setColumnNaming(NamingStrategy.underline_to_camel);
    strategyConfig.setEntityLombokModel(true);
    strategyConfig.setLogicDeleteFieldName("deleted");
    strategyConfig.setVersionFieldName("version");
    strategyConfig.setTableFillList(Arrays.asList(
        new TableFill("create_time", FieldFill.INSERT),
        new TableFill("update_time", FieldFill.INSERT_UPDATE)
    ));
    
    generator.setGlobalConfig(globalConfig);
    generator.setDataSource(dataSourceConfig);
    generator.setPackageInfo(packageConfig);
    generator.setStrategy(strategyConfig);
    
    generator.execute();
}
```

### 🎯 混合架构的最佳实践是什么？

在企业级项目中，MyBatis和JPA的混合使用是常见且有效的架构模式：

 **架构分层策略**：

 **1. 按业务复杂度分层**：
 - **核心业务层**：使用MyBatis，精确控制SQL性能
 - **辅助功能层**：使用JPA/MyBatis-Plus，提高开发效率
 - **报表分析层**：使用MyBatis原生SQL，支持复杂统计查询

 **2. 按数据特征分层**：
 - **事务性数据**：MyBatis，保证数据一致性和性能
 - **配置性数据**：JPA，利用对象映射简化开发
 - **统计性数据**：原生SQL或存储过程，最大化查询效率

 **3. 技术选型矩阵**：
 - **简单CRUD + 快速开发** → MyBatis-Plus
 - **复杂业务逻辑 + 性能要求** → MyBatis
 - **领域建模 + 对象关系** → JPA/Hibernate
 - **数据分析 + 复杂报表** → MyBatis + 原生SQL

 **混合架构注意事项**：
 - 统一事务管理器，确保不同ORM在同一事务中工作
 - 建立清晰的分层边界，避免技术栈混乱
 - 统一异常处理和日志规范
 - 做好团队培训，确保开发人员熟悉各种工具的适用场景

---

## 🧪 高频面试题速览

- **🎯 MyBatis 执行器(Executor) 有哪些？各自适用场景？**
- **🎯 一级/二级缓存命中条件与失效场景？如何手动清理？**
- **🎯 #{} 与 ${} 的区别与使用边界？**
- **🎯 动态SQL常见坑（where多余and/逗号、空集合foreach）如何规避？**
- **🎯 分页实现：拦截器改SQL vs 改参数，哪种更合适？**
- **🎯 如何避免N+1问题？延迟加载与一次性装载如何取舍？**
- **🎯 批处理与主键回填在不同数据库（MySQL/PG/Oracle）下的差异？**
- **🎯 多数据源路由设计与事务一致性方案？**
- **🎯 如何为敏感字段做加解密并保证可检索性（前缀/哈希索引）？**
- **🎯 MyBatis 与 JPA/Hibernate/MP 组合使用的边界与实践？**

---

## 📝 面试话术模板

```
1) 先给出概念与定位（10-20秒）
2) 讲清核心原理/流程（30-60秒）
3) 结合优缺点与适用场景（20-30秒）
4) 补充一次亲历的实战与数据（20-30秒）
5) 若有时间，延展到性能/容错/工程化细节（加分）
```

- **缓存**："一级缓存是会话级，二级是命名空间级；我们开启了二级缓存并用失效策略保证一致性...
- **动态SQL**："大量使用 `<if>/<where>/<set>`，统一工具方法避免空集合foreach报错，重要SQL全覆盖单测...
- **分页**："采用物理分页插件，限制深翻页；热点列表采用游标分页并结合排序键...
- **调优**："批量写入使用 ExecutorType.BATCH 分批 flush，慢SQL定位靠链路trace + 执行计划...

---

## 🔍 扩展学习与实践

- 官方文档与源码：MyBatis、MyBatis-Spring、MyBatis-Plus
- 高质量实践：分页插件/PageHelper源码、租户插件、加解密插件
- 工具链：Druid/Hikari、p6spy、arthas/skywalking/APM
- 建议：核心SQL配套单测与回归；生产开启SQL审计与慢SQL告警

---

## 🎉 总结

- MyBatis 的强项在于“可控与透明”，用规范与工程化手段弥补“手写SQL”的成本
- 先选对ORM，再用对功能；以数据驱动取舍：性能、复杂度、可维护性优先
- 面试中用“原理 + 实战 + 数据结果”讲述你的选型与优化过程，效果最好
