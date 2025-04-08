---
title: MyBatis 面试
date: 2024-1-9
tags: 
 - MyBatis
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> MyBatis是一个支持**普通SQL查询**，**存储过程**和**高级映射**的优秀**持久层框架**。MyBatis消除了几乎所有的JDBC代码和参数的手工设置以及对结果集的检索封装。MyBatis可以使用简单的**XML或注解**用于配置和原始映射，将接口和Java的POJO（Plain Old Java Objects，普通的Java对象）映射成数据库中的记录。



### JDBC 有几个步骤？

JDBC（Java DataBase Connectivity）是 Java 程序与关系型数据库交互的统一 API

JDBC 大致可以分为六个步骤：

1. 注册数据库驱动类，指定数据库地址，其中包括 DB 的用户名、密码及其他连接信息；
2. 调用 `DriverManager.getConnection()` 方法创建 Connection 连接到数据库；
3. 调用 Connection 的 `createStatement() `或 `prepareStatement()` 方法，创建 Statement 对象，此时会指定 SQL（或是 SQL 语句模板 + SQL 参数）；
4. 通过 Statement 对象执行 SQL 语句，得到 ResultSet 对象，也就是查询结果集；
5. 遍历 ResultSet，从结果集中读取数据，并将每一行数据库记录转换成一个 JavaBean 对象；
6. 关闭 ResultSet 结果集、Statement 对象及数据库 Connection，从而释放这些对象占用的底层资源。



> 无论是执行查询操作，还是执行其他 DML 操作，1、2、3、4、6 这些步骤都会重复出现。为了简化重复逻辑，提高代码的可维护性，可以将上述重复逻辑封装到一个类似 DBUtils 的工具类中，在使用时只需要调用 DBUtils 工具类中的方法即可。当然，我们也可以使用“反射+配置”的方式，将步骤 5 中关系模型到对象模型的转换进行封装，但是这种封装要做到通用化且兼顾灵活性，就需要一定的编程功底。
>
> 为了处理上述代码重复的问题以及后续的维护问题，我们在实践中会进行一系列评估，选择一款适合项目需求、符合人员能力的 ORM（Object Relational Mapping，对象-关系映射）框架来封装 1~6 步的重复性代码，实现对象模型、关系模型之间的转换。这正是**ORM 框架的核心功能：根据配置（配置文件或是注解）实现对象模型、关系模型两者之间无感知的映射**（如下图）。
>
> ![](https://s0.lgstatic.com/i/image/M00/91/5F/CgqCHmAON9CAWnMJAACJd8-3Mcg506.png)
>
> 在生产环境中，数据库一般都是比较稀缺的，数据库连接也是整个服务中比较珍贵的资源之一。建立数据库连接涉及鉴权、握手等一系列网络操作，是一个比较耗时的操作，所以我们不能像上述 JDBC 基本操作流程那样直接释放掉数据库连接，否则持久层很容易成为整个系统的性能瓶颈。
>
> Java 程序员一般会使用数据库连接池的方式进行优化，此时就需要引入第三方的连接池实现，当然，也可以自研一个连接池，但是要处理连接活跃数、控制连接的状态等一系列操作还是有一定难度的。另外，有一些查询返回的数据是需要本地缓存的，这样可以提高整个程序的查询性能，这就需要缓存的支持。
>
> 如果没有 ORM 框架的存在，这就需要我们 Java 开发者熟悉相关连接池、缓存等组件的 API 并手动编写一些“黏合”代码来完成集成，而且这些代码重复度很高，这显然不是我们希望看到的结果。
>
> 很多 ORM 框架都支持集成第三方缓存、第三方数据源等常用组件，并对外提供统一的配置接入方式，这样我们只需要使用简单的配置即可完成第三方组件的集成。当我们需要更换某个第三方组件的时候，只需要引入相关依赖并更新配置即可，这就大大提高了开发效率以及整个系统的可维护性。



### 什么是 Mybatis？

如果在面试的时候被问到，只要你说出下面三种即可：

> MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。
>
> MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。
>
> MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

MyBatis 封装重复性代码的方式是通过 Mapper 映射配置文件以及相关注解，将 ResultSet 结果映射为 Java 对象，在具体的映射规则中可以嵌套其他映射规则和必要的子查询，这样就可以轻松实现复杂映射的逻辑，当然，也能够实现一对一、一对多、多对多关系映射以及相应的双向关系映射。



### 什么是 ORM?

全称为 Object Relational Mapping。对象-映射-关系型数据库。对象关系映射(简称 ORM，或 O/RM，或 O/R mapping)，用于实现面向对象编程语言里不同类型系统的数据之间的转换。简单的说，ORM 是通过使用描述对象和数据库之间映射的元数据，将程序中的对象与关系数据库相互映射。

ORM 提供了实现持久化层的另一种模式，它采用映射元数据来描述对象关系的映射，使得 ORM 中间件能在任何一个应用的业务逻辑层和数据库层之间充当桥梁。



### 为什么说Mybatis是半自动ORM映射工具？它与全自动的区别在哪里？

ORM（Object Relational Mapping），对象关系映射，是一种为了解决关系型数据库数据与简单Java对象（POJO）的映射关系的技术。

Hibernate属于全自动ORM映射工具，使用Hibernate查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。

Mybatis在查询关联对象或关联集合对象时，需要手动编写sql来完成，所以，称之为半自动ORM映射工具。



### Mybatis优缺点

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



### Hibernate 和 MyBatis 的区别

**相同点**

都是对jdbc的封装，都是持久层的框架，都用于dao层的开发。

**不同点**

映射关系

- MyBatis 是一个半自动映射的框架，配置Java对象与sql语句执行结果的对应关系，多表关联关系配置简单
- Hibernate 是一个全表映射的框架，配置Java对象与数据库表的对应关系，多表关联关系配置复杂

SQL优化和移植性

- Hibernate 对SQL语句封装，提供了日志、缓存、级联（级联比 MyBatis 强大）等特性，此外还提供 HQL（Hibernate Query Language）操作数据库，数据库无关性支持好，但会多消耗性能。如果项目需要支持多种数据库，代码开发量少，但SQL语句优化困难。
- MyBatis 需要手动编写 SQL，支持动态 SQL、处理列表、动态生成表名、支持存储过程。开发工作量相对大些。直接使用SQL语句操作数据库，不支持数据库无关性，但sql语句优化容易。

开发难易程度和学习成本

- Hibernate 是重量级框架，学习使用门槛高，适合于需求相对稳定，中小型的项目，比如：办公自动化系统
- MyBatis 是轻量级框架，学习使用门槛低，适合于需求变化频繁，大型的项目，比如：互联网电子商务系统





### MyBatis的工作原理

![MyBatis框架的执行流程图](https://tva1.sinaimg.cn/large/e6c9d24ely1h31snxsuxbj20kd0n3abk.jpg)

1. 读取 MyBatis 配置文件：mybatis-config.xml 为 MyBatis 的全局配置文件，包含了 MyBatis 行为的设置和属性信息，例如数据库连接信息和映射文件。（我们一般是通过Spring 整合，用 SqlSessionFactoryBean 配置 dataSource 和 mapper 地址等，其实现了InitializingBean 、FactoryBean、ApplicationListener 三个接口 ）
2. 加载映射文件mapper.xml。映射文件即 SQL 映射文件，该文件中配置了操作数据库的 SQL 语句，需要在 MyBatis 配置文件 mybatis-config.xml 中加载。mybatis-config.xml 文件可以加载多个映射文件，每个文件对应数据库中的一张表（MyBatis 会将 Mapper 映射文件中定义的 SQL 语句解析成 SqlSource 对象，其中的动态标签、SQL 语句文本等，会解析成对应类型的 SqlNode 对象）。
3. 构造会话工厂：通过 MyBatis 的环境等配置信息构建会话工厂 SqlSessionFactory。 
4. 创建会话对象：由会话工厂创建 SqlSession 对象，该对象中包含了执行 SQL 语句的所有方法。
5. Executor 执行器：MyBatis 底层定义了一个 Executor 接口来操作数据库，它将根据 SqlSession 传递的参数动态地生成需要执行的 SQL 语句，同时负责查询缓存的维护。
6. MappedStatement 对象：在 Executor 接口的执行方法中有一个 MappedStatement 类型的参数，该参数是对映射信息的封装，用于存储要映射的 SQL 语句的 id、参数等信息。
7. 输入参数映射：输入参数类型可以是 Map、List 等集合类型，也可以是基本数据类型和 POJO 类型。输入参数映射过程类似于 JDBC 对 preparedStatement 对象设置参数的过程。
8. 输出结果映射：输出结果类型可以是 Map、 List 等集合类型，也可以是基本数据类型和 POJO 类型。输出结果映射过程类似于 JDBC 对结果集的解析过程。



### MyBatis的架构设计是怎样的

![](https://s0.lgstatic.com/i/image2/M01/0B/1B/CgpVE2AT9G2AXu4RAAM4svUMBPc909.png)

![img](https://oss-emcsprod-public.modb.pro/wechatSpider/modb_20210809_cd427228-f90f-11eb-8882-00163e068ecd.png)

我们把Mybatis的功能架构分为四层：

- API接口层：提供给外部使用的接口API，开发人员通过这些本地API来操纵数据库。接口层一接收到调用请求就会调用数据处理层来完成具体的数据处理。
- 数据处理层：负责具体的SQL查找、SQL解析、SQL执行和执行结果映射处理等。它主要的目的是根据调用的请求完成一次数据库操作。
- 基础支撑层：负责最基础的功能支撑，包括连接管理、事务管理、配置加载和缓存处理，这些都是共用的东西，将他们抽取出来作为最基础的组件。为上层的数据处理层提供最基础的支撑。
- 引导层：加载xml配置和Java配置



### #{}和${}的区别

- \#{}是占位符，预编译处理，可以防止SQL注入；${}是拼接符，字符串替换，没有预编译处理，不能防止SQL注入。
- Mybatis在处理#{}时，#{}传入参数是以字符串传入，会将SQL中的#{}替换为?号，调用PreparedStatement的set方法来赋值；Mybatis在处理\${}时，是原值传入，就是把${}替换成变量的值，相当于JDBC中的Statement编译
- \#{} 的变量替换是在DBMS 中，变量替换后，#{} 对应的变量自动加上单引号；\${} 的变量替换是在 DBMS 外，变量替换后，${} 对应的变量不会加上单引号



### 模糊查询like语句该怎么写

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



### 当实体类中的属性名和表中的字段名不一样 ，怎么办

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



### 什么是MyBatis的接口绑定？有哪些实现方式？

接口绑定，就是在MyBatis中任意定义接口，然后把接口里面的方法和SQL语句绑定，我们调用接口方法的时候，最终会执行绑定的SQL语句。

接口绑定有两种实现方式，当Sql语句比较简单时候，可以使用注解绑定，当SQL语句比较复杂时候，一般用xml绑定的比较多。

- 通过注解绑定，就是在接口的方法上面加上 @Select、@Update等注解，里面包含Sql语句来实现接口绑定；
- 通过在xml里面写SQL语句来实现绑定， 在这种情况下，要指定xml映射文件里面的namespace必须为接口的全路径名，同时接口的方法名和SQL语句的id一一对应。



### 使用MyBatis的mapper接口调用时有哪些要求？

- Mapper.xml文件中的namespace即是mapper接口的全限定类名。
- Mapper接口方法名和mapper.xml中定义的sql语句id一一对应。
- Mapper接口方法的输入参数类型和mapper.xml中定义的每个sql语句的parameterType的类型相同。
- Mapper接口方法的输出参数类型和mapper.xml中定义的每个sql语句的resultType的类型相同。



### MyBatis动态sql是做什么的？都有哪些动态sql？能简述一下动态sql的执行原理不？

Mybatis动态sql可以让我们在xml映射文件内，以标签的形式编写动态sql，完成逻辑判断和动态拼接sql的功能，Mybatis提供了9种动态sql标签trim|where|set|foreach|if|choose|when|otherwise|bind。

其执行原理为，使用OGNL从sql参数对象中计算表达式的值，根据表达式的值动态拼接sql，以此来完成动态sql的功能。



### MyBatis是如何进行分页的？分页插件的原理是什么？

Mybatis使用RowBounds对象进行分页，它是针对ResultSet结果集执行的内存分页，而非物理分页，可以在sql内直接书写带有物理分页的参数来完成物理分页功能，也可以使用分页插件来完成物理分页。

分页插件的基本原理是使用Mybatis提供的插件接口，实现自定义插件，通过jdk动态代理在插件的拦截方法内拦截待执行的sql，然后重写sql，根据dialect方言，添加对应的物理分页语句和参数。

举例：select * from student，拦截sql后重写为：select t.* from (select * from student) t limit 0, 10



### MyBatis的一级、二级缓存?

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
> ![img](https://tva1.sinaimg.cn/large/e6c9d24ely1h322koh4wxj20qu0dx750.jpg)
>
> 当开启缓存后，数据的查询执行的流程就是 二级缓存 -> 一级缓存 -> 数据库

1. 一级缓存: 基于 PerpetualCache 的 HashMap 本地缓存，其存储作用域为 Session，当 Session flush 或 close 之后，该 Session 中的所有 Cache 就将清空，MyBatis默认打开一级缓存。

2. 二级缓存与一级缓存机制相同，默认也是采用 PerpetualCache，HashMap 存储，不同之处在于其存储作用域为 Mapper(Namespace)，并且可自定义存储源，如 Ehcache。默认不打开二级缓存，要开启二级缓存，使用二级缓存属性类需要实现Serializable序列化接口(可用来保存对象的状态)，可在它的映射文件中配置`<cache/>`
    标签；

3. 对于缓存数据更新机制，当某一个作用域(一级缓存 Session/二级缓存Namespaces)进行了C/U/D 操作后，默认该作用域下所有缓存将被清理掉。



### 通常一个 Xml 映射文件，都会写一个 Dao 接口与之对应, Dao 的工作原理，是否可以重 载?

不能重载，因为通过 Dao 寻找 Xml 对应的 sql 的时候全限名+方法名的保存和寻找策略。接口工作原理为 jdk 动态代理原理，运行时会为 dao 生成 proxy，代理对象会拦截接口 方法，去执行对应的 sql 返回数据。



### Mybatis 中如何执行批处理?

使用 BatchExecutor 完成批处理。



### Mybatis 都有哪些 Executor 执行器?它们之间的区别是什么?

Mybatis 有三种基本的 Executor 执行器，SimpleExecutor、ReuseExecutor、 BatchExecutor。

1. SimpleExecutor:每执行一次 update 或 select，就开启一个 Statement 对 象，用完立刻关闭 Statement 对象。
2. ReuseExecutor:执行 update 或 select，以 sql 作为 key 查找 Statement 对象，存在就使用，不存在就创建，用完后，不关闭 Statement 对象， 而是放置于 Map
3. BatchExecutor:完成批处理。



### resultType resultMap 的区别?

- 类的名字和数据库相同时，可以直接设置 resultType 参数为 Pojo 类

- 若不同，需要设置 resultMap 将结果名字和 Pojo 名字进行转换