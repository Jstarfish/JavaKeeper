## 影响mysql的性能因素

### 1. 业务需求对mysql的影响(合适合度)

### 2. 存储定位对mysql的影响

- 不适合放进mysql的数据
  - 二进制多媒体数据
  - 流水队列数据
  - 超大文本数据
- 需要放进缓存的数据
  - 系统各种配置及规则数据
  - 活跃用户的基本信息数据
  - 活跃用户的个性化定制信息数据
  - 准实时的统计信息数据
  - 其他一些访问频繁但变更较少的数据

### 3. Schema设计对系统的性能影响

- 尽量减少对数据库访问的请求
- 尽量减少无用数据的查询请求

### 4. 硬件环境对系统性能的影响

**典型OLTP应用系统**

什么是OLTP：OLTP即联机事务处理，就是我们经常说的关系数据库，意即记录即时的增、删、改、查，就是我们经常应用的东西，这是数据库的基础

对于各种数据库系统环境中大家最常见的OLTP系统，其特点是并发量大，整体数据量比较多，但每次访问的数据比较少，且访问的数据比较离散，活跃数据占总体数据的比例不是太大。对于这类系统的数据库实际上是最难维护，最难以优化的，对主机整体性能要求也是最高的。因为不仅访问量很高，数据量也不小。

针对上面的这些特点和分析，我们可以对OLTP的得出一个大致的方向。 虽然系统总体数据量较大，但是系统活跃数据在数据总量中所占的比例不大，那么我们可以通过扩大内存容量来尽可能多的将活跃数据cache到内存中； 虽然IO访问非常频繁，但是每次访问的数据量较少且很离散，那么我们对磁盘存储的要求是IOPS表现要很好，吞吐量是次要因素； 并发量很高，CPU每秒所要处理的请求自然也就很多，所以CPU处理能力需要比较强劲； 虽然与客户端的每次交互的数据量并不是特别大，但是网络交互非常频繁，所以主机与客户端交互的网络设备对流量能力也要求不能太弱。

**典型OLAP应用系统**

用于数据分析的OLAP系统的主要特点就是数据量非常大，并发访问不多，但每次访问所需要检索的数据量都比较多，而且数据访问相对较为集中，没有太明显的活跃数据概念。

什么是OLAP：OLAP即联机分析处理，是数据仓库的核心部心，所谓数据仓库是对于大量已经由OLTP形成的数据的一种分析型的数据库，用于处理商业智能、决策支持等重要的决策信息；数据仓库是在数据库应用到一定程序之后而对历史数据的加工与分析 基于OLAP系统的各种特点和相应的分析，针对OLAP系统硬件优化的大致策略如下： 数据量非常大，所以磁盘存储系统的单位容量需要尽量大一些； 单次访问数据量较大，而且访问数据比较集中，那么对IO系统的性能要求是需要有尽可能大的每秒IO吞吐量，所以应该选用每秒吞吐量尽可能大的磁盘； 虽然IO性能要求也比较高，但是并发请求较少，所以CPU处理能力较难成为性能瓶颈，所以CPU处理能力没有太苛刻的要求；

虽然每次请求的访问量很大，但是执行过程中的数据大都不会返回给客户端，最终返回给客户端的数据量都较小，所以和客户端交互的网络设备要求并不是太高；

此外，由于OLAP系统由于其每次运算过程较长，可以很好的并行化，所以一般的OLAP系统都是由多台主机构成的一个集群，而集群中主机与主机之间的数据交互量一般来说都是非常大的，所以在集群中主机之间的网络设备要求很高。





## 查询与索引优化分析



- 性能下降SQL慢 执行时间长 等待时间长 原因分析

- - 查询语句写的烂
  - 索引失效（单值 复合）
  - 关联查询太多join（设计缺陷或不得已的需求）
  - 服务器调优及各个参数设置（缓冲、线程数等）



- 常见通用的Join查询

- - SQL执行顺序

- - - 手写

      ![image-20191128171211466](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20191128171211466.png)

    - 机读

      ![image-20191128171220678](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20191128171220678.png)

    - 总结

      ![image-20191128171158775](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20191128171158775.png)

- - Join图

    ![image-20191128171235320](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20191128171235320.png)

  - 建表SQL

    CREATE TABLE `tbl_dept` (
     `id` INT(11) NOT NULL AUTO_INCREMENT,
     `deptName` VARCHAR(30) DEFAULT NULL,
     `locAdd` VARCHAR(40) DEFAULT NULL,
     PRIMARY KEY (`id`)
    ) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

    CREATE TABLE `tbl_emp` (
     `id` INT(11) NOT NULL AUTO_INCREMENT,
     `name` VARCHAR(20) DEFAULT NULL,
     `deptId` INT(11) DEFAULT NULL,
     PRIMARY KEY (`id`),
     KEY `fk_dept_id` (`deptId`)
     #CONSTRAINT `fk_dept_id` FOREIGN KEY (`deptId`) REFERENCES `tbl_dept` (`id`)
    ) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

     

    INSERT INTO tbl_dept(deptName,locAdd) VALUES('RD',11);
    INSERT INTO tbl_dept(deptName,locAdd) VALUES('HR',12);
    INSERT INTO tbl_dept(deptName,locAdd) VALUES('MK',13);
    INSERT INTO tbl_dept(deptName,locAdd) VALUES('MIS',14);
    INSERT INTO tbl_dept(deptName,locAdd) VALUES('FD',15);


    INSERT INTO tbl_emp(NAME,deptId) VALUES('z3',1);
    INSERT INTO tbl_emp(NAME,deptId) VALUES('z4',1);
    INSERT INTO tbl_emp(NAME,deptId) VALUES('z5',1);

    INSERT INTO tbl_emp(NAME,deptId) VALUES('w5',2);
    INSERT INTO tbl_emp(NAME,deptId) VALUES('w6',2);

    INSERT INTO tbl_emp(NAME,deptId) VALUES('s7',3);

    INSERT INTO tbl_emp(NAME,deptId) VALUES('s8',4);

    INSERT INTO tbl_emp(NAME,deptId) VALUES('s9',51);

  - 7种JOIN

    1 A、B两表共有
     select * from tbl_emp a **inner join** tbl_dept b on a.deptId = b.id;

    2 A、B两表共有+A的独有
     select * from tbl_emp a **left join** tbl_dept b on a.deptId = b.id;

    3 A、B两表共有+B的独有
     select * from tbl_emp a **right join** tbl_dept b on a.deptId = b.id;

    4 A的独有 
    select * from tbl_emp a left join tbl_dept b on a.deptId = b.id where b.id is null; 

    5 B的独有
     select * from tbl_emp a right join tbl_dept b on a.deptId = b.id where a.deptId is null; #B的独有

    6 AB全有
    #MySQL Full Join的实现 因为MySQL不支持FULL JOIN,下面是替代方法
     #left join + union(可去除重复数据)+ right join
    SELECT * FROM tbl_emp A LEFT JOIN tbl_dept B ON A.deptId = B.id
    UNION
    SELECT * FROM tbl_emp A RIGHT JOIN tbl_dept B ON A.deptId = B.id

    7 A的独有+B的独有
    SELECT * FROM tbl_emp A LEFT JOIN tbl_dept B ON A.deptId = B.id WHERE B.`id` IS NULL
    UNION
    SELECT * FROM tbl_emp A RIGHT JOIN tbl_dept B ON A.deptId = B.id WHERE A.`deptId` IS NULL;











### 1.1 性能分析

#### 1.1.1 MySql Query Optimizer




1 Mysql中有专门负责优化SELECT语句的优化器模块，主要功能：通过计算分析系统中收集到的统计信息，为客户端请求的Query提供他认为最优的执行计划（他认为最优的数据检索方式，但不见得是DBA认为是最优的，这部分最耗费时间）

2 当客户端向MySQL 请求一条Query，命令解析器模块完成请求分类，区别出是 SELECT 并转发给MySQL Query Optimizer时，MySQL Query Optimizer 首先会对整条Query进行优化，处理掉一些常量表达式的预算，直接换算成常量值。并对 Query 中的查询条件进行简化和转换，如去掉一些无用或显而易见的条件、结构调整等。然后分析 Query 中的 Hint 信息（如果有），看显示Hint信息是否可以完全确定该Query 的执行计划。如果没有 Hint 或Hint 信息还不足以完全确定执行计划，则会读取所涉及对象的统计信息，根据 Query 进行写相应的计算分析，然后再得出最后的执行计划。



#### 1.1.1 MySQL常见瓶颈

1.1.1.1 CPU：CPU在饱和的时候一般发生在数据装入内存或从磁盘上读取数据时候

1.1.1.2 IO：磁盘I/O瓶颈发生在装入数据远大于内存容量的时候

1.1.1.3 服务器硬件的性能瓶颈：top,free, iostat和vmstat来查看系统的性能状态





#### 1.1.1 Explain

- - **Explain**（执行计划）

- - - 是什么：使用Explain关键字可以模拟优化器执行SQL查询语句，从而知道MySQL是如何处理你的SQL语句的。分析你的查询语句或是表结构的性能瓶颈
    - 能干吗

- - - - 表的读取顺序
      - 数据读取操作的操作类型
      - 哪些索引可以使用
      - 哪些索引被实际使用
      - 表之间的引用
      - 每张表有多少行被优化器查询

- - - 怎么玩

- - - - Explain + SQL语句
      - 执行计划包含的信息

![img](G:/youdaoLocalData/jstarfish@126.com/2cb5dd414e4e45c39a5f3bfa99ddefb3/b3b3-707872.jpeg)

- - - - 各字段解释

- - - - - id（select查询的序列号，包含一组数字，表示查询中执行select子句或操作表的顺序）

- - - - - - id相同，执行顺序从上往下
          - id不同，如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行
          - id相同不同，同时存在

- - - - - select_type（查询的类型，用于区别普通查询、联合查询、子查询等复杂查询）

- - - - - - SIMPLE ：简单的select查询，查询中不包含子查询或UNION
          - PRIMARY：查询中若包含任何复杂的子部分，最外层查询被标记为PRIMARY
          - SUBQUERY：在select或where列表中包含了子查询
          - DERIVED：在from列表中包含的子查询被标记为DERIVED，mysql会递归执行这些子查询，把结果放在临时表里
          - UNION：若第二个select出现在UNION之后，则被标记为UNION，若UNION包含在from子句的子查询中，外层select将被标记为DERIVED
          - UNION RESULT：从UNION表获取结果的select

- - - - - table（显示这一行的数据是关于哪张表的）
        - type（显示查询使用了那种类型，从最好到最差依次排列**system>const>eq_ref>ref>range>index>all**）

- - - - - - system：表只有一行记录（等于系统表），是const类型的特例，平时不会出现
          - const：表示通过索引一次就找到了，const用于比较primary key或unique索引，因为只要匹配一行数据，所以很快，如将主键置于where列表中，mysql就能将该查询转换为一个常量
          - eq_ref：唯一性索引扫描，对于每个索引键，表中只有一条记录与之匹配，常见于主键或唯一索引扫描
          - ref：非唯一性索引扫描，范围匹配某个单独值得所有行。本质上也是一种索引访问，他返回所有匹配某个单独值的行，然而，它可能也会找到多个符合条件的行，多以他应该属于查找和扫描的混合体
          - range：只检索给定范围的行，使用一个索引来选择行。key列显示使用了哪个索引，一般就是在你的where语句中出现了between、<、>、in等的查询，这种范围扫描索引比全表扫描要好，因为它只需开始于索引的某一点，而结束于另一点，不用扫描全部索引
          - index：Full Index Scan，index于ALL区别为index类型只遍历索引树。通常比ALL快，因为索引文件通常比数据文件小。（**也就是说虽然all和index都是读全表，但index是从索引中读取的，而all是从硬盘中读的**）
          - all：Full Table Scan，将遍历全表找到匹配的行
          - **一般来说，得保证查询至少达到range级别，最好到达ref**

- - - - - possible_keys（显示可能应用在这张表中的索引，一个或多个，查询涉及到的字段若存在索引，则该索引将被列出，但不一定被查询实际使用）
        - key 
          - （实际使用的索引，如果为NULL，则没有使用索引）

- - - - - - **查询中若使用了覆盖索引，则该索引和查询的select字段重叠，仅出现在key列表中**

            ![image-20191128171937630](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20191128171937630.png)

- - - - - key_len
          - 表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度。在不损失精确性的情况下，长度越短越好
          - key_len显示的值为索引字段的最大可能长度，并非实际使用长度，即key_len是根据表定义计算而得，不是通过表内检索出的
        - ref （显示索引的哪一列被使用了，如果可能的话，是一个常数。哪些列或常量被用于查找索引列上的值）
        - rows （根据表统计信息及索引选用情况，大致估算找到所需的记录所需要读取的行数）
        - Extra（包含不适合在其他列中显示但十分重要的额外信息）

- - - - - - using filesort: 说明mysql会对数据使用一个外部的索引排序，不是按照表内的索引顺序进行读取。mysql中无法利用索引完成的排序操作称为“文件排序”

![img](G:/youdaoLocalData/jstarfish@126.com/8335329f6c924e868ac00c755441e7e5/clipboard.png)

- - - - - - Using temporary：使用了临时表保存中间结果，mysql在对查询结果排序时使用临时表。常见于排序order by和分组查询group by。

![img](G:/youdaoLocalData/jstarfish@126.com/9104b3c648fa42d5ba6b2469e8436817/clipboard.png)

- - - - - - using index：表示相应的select操作中使用了覆盖索引，避免访问了表的数据行，效率不错，如果同时出现using where，表明索引被用来执行索引键值的查找；否则索引被用来读取数据而非执行查找操作

![img](G:/youdaoLocalData/jstarfish@126.com/69517a309e6f47e39973490ea7aa876a/clipboard.png)

- - - - - - 覆盖索引（Covering Index）

![img](G:/youdaoLocalData/jstarfish@126.com/151524bb2d634dd1b1c92cbd0af458f7/clipboard.png)

- - - - - - using where：使用了where过滤
          - using join buffer：使用了连接缓存
          - impossible where：where子句的值总是false，不能用来获取任何元祖
          - select tables optimized away：在没有group by子句的情况下，基于索引优化操作或对于MyISAM存储引擎优化COUNT(*)操作，不必等到执行阶段再进行计算，查询执行计划生成的阶段即完成优化
          - distinct：优化distinct操作，在找到第一匹配的元祖后即停止找同样值的动作

- - - - case:

![img](G:/youdaoLocalData/jstarfish@126.com/956423315c5a441481852d9fbc74674e/clipboard.png)

 

第一行（执行顺序4）：id列为1，表示是union里的第一个select，select_type列的primary表 示该查询为外层查询，table列被标记为<derived3>，表示查询结果来自一个衍生表，其中derived3中3代表该查询衍生自第三个select查询，即id为3的select。【select d1.name......】
第二行（执行顺序2）：id为3，是整个查询中第三个select的一部分。因查询包含在from中，所以为derived。【select id,name from t1 where other_column=''】
第三行（执行顺序3）：select列表中的子查询select_type为subquery，为整个查询中的第二个select。【select id from t3】
第四行（执行顺序1）：select_type为union，说明第四个select是union里的第二个select，最先执行【select name,id from t2】
第五行（执行顺序5）：代表从union的临时表中读取行的阶段，table列的<union1,4>表示用第一个和第四个select的结果进行union操作。【两个结果union操作】





慢查询日志

