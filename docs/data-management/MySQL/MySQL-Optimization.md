---
title: MySQL 优化
date: 2024-05-09
tags: 
 - MySQL
categories: MySQL
---

![](https://img.starfish.ink/mysql/banner-mysql-optimization.png)

> 《高性能MySQL》给出的性能定义：完成某件任务所需要的的时间度量，性能既响应时间。
>
> 我们主要探讨 Select 的优化，包括 MySQL Server 做了哪些工作以及我们作为开发，如何定位问题，以及如何优化，怎么写出高性能 SQL



## 一、MySQL  Server 优化了什么 

### MySQL Query Optimizer

MySQL 中有专门负责优化 SELECT 语句的优化器模块，主要功能：通过计算分析系统中收集到的统计信息，为客户端请求的 Query 提供他认为最优的执行计划（他认为最优的数据检索方式，但不见得是DBA认为是最优的，这部分最耗费时间）

当客户端向 MySQL 请求一条 Query，命令解析器模块完成请求分类，区别出是 SELECT 并转发给 MySQL Query Optimizer 时，MySQL Query Optimizer 首先会对整条 Query 进行优化，处理掉一些常量表达式的预算，直接换算成常量值。并对 Query 中的查询条件进行简化和转换，如去掉一些无用或显而易见的条件、结构调整等。然后分析 Query 中的 Hint 信息（如果有），看显示 Hint 信息是否可以完全确定该 Query 的执行计划。如果没有 Hint 或Hint 信息还不足以完全确定执行计划，则会读取所涉及对象的统计信息，根据 Query 进行写相应的计算分析，然后再得出最后的执行计划。

MySQL 查询优化器是一个复杂的组件，它的主要任务是确定执行给定查询的最优方式。以下是 MySQL 查询优化器在处理查询时所进行的一些关键活动：

#### 1.1 解析查询：

优化器首先解析查询语句，理解其语法和语义。

#### 1.2 词法和语法分析：

检查查询语句是否符合SQL语法规则。

#### 1.3 语义分析：

确保查询引用的所有数据库对象（如表、列、别名等）都是存在的，并且用户具有相应的访问权限。

#### 1.4 查询重写：

可能对查询进行一些变换，以提高其效率。例如，使用等价变换简化查询或应用数据库的视图定义。

#### 1.5 确定执行计划：

优化器会生成一个或多个可能的执行计划，并估算每个计划的成本（如I/O操作、CPU使用等）。

#### 1.6 选择最佳执行计划：

执行成本包括 I/O 成本和 CPU 成本。MySQL 有一套自己的计算公式，在一条单表查询语句真正执行之前，MySQL  的查询优化器会找出执行该语句所有可能使用的方案，对比之后找出成本最低的方案，这个成本最低的方案就是所谓的`执行计划`，之后才会调用存储引擎提供的接口真正的执行查询。

#### 1.7 索引选择：

确定是否使用索引以及使用哪个索引。考虑因素包括索引的选择性、查询条件、索引的前缀等。

#### 1.8 表访问顺序：

对于涉及多个表的查询，优化器决定最佳的表访问顺序，以减少数据的访问量。

#### 1.9 连接算法选择：

join 我们每天都在用，左、右连接、内连接就不详细介绍了

![img](https://res.cloudinary.com/practicaldev/image/fetch/s--c4weS2Kt--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rscdema0dwgx4n91eg0p.png)

对于连接操作，优化器会选择最合适的算法，如嵌套循环、块嵌套循环、哈希连接等。

- **嵌套循环连接（Nested-Loop Join）**：驱动表只访问一次，但被驱动表却可能被多次访问，访问次数取决于对驱动表执行单表查询后的结果集中的记录条数的连接执行方式称之为`嵌套循环连接`。

  左（外）连接的驱动表就是左边的那个表，右（外）连接的驱动表就是右边的那个表。内连接驱动表就无所谓了。

- **基于块的嵌套循环连接（Block Nested-Loop Join）**: 块嵌套循环连接是嵌套循环连接的优化版本。每次访问被驱动表，被驱动表的记录会被加载到内存中，与驱动表匹配，然后清理内存，然后再取下一条，这样 I/O 成本是超级高的。

  所以为了减少了对被驱动表的访问次数，引入了 `join buffer` 的概念，执行连接查询前申请的一块固定大小的内存，先把若干条驱动表结果集中的记录装在这个`join buffer`中，然后开始扫描被驱动表，每一条被驱动表的记录一次性和`join buffer`中的多条驱动表记录做匹配，因为匹配的过程都是在内存中完成的，所以这样可以显著减少被驱动表的`I/O`代价。

#### 1.10 子查询优化：

对于子查询，优化器决定是将其物化、转换为半连接、还是其他形式。

#### 1.11 谓词下推：

将查询条件（谓词）尽可能地下推到存储引擎层面，以便尽早过滤数据。

#### 1.12 分区修剪：

如果表被分区，优化器会识别出只需要扫描的分区。

#### 1.13 排序和分组优化：

优化器会考虑使用索引来执行排序和分组操作。

#### 1.14 临时表和物化：

优化器可能会决定使用临时表来存储中间结果，以简化查询。

#### 1.15 并行查询执行：

对于某些查询，优化器可以决定使用并行执行来提高性能。

#### 1.16 执行计划缓存：

如果可能，优化器会重用之前缓存的执行计划，以减少解析和优化的开销。

#### 1.17 生成执行语句：

最终，优化器生成用于执行查询的底层指令。

#### 1.18 监控和调整：

优化器的行为可以通过各种参数进行调整，以适应特定的工作负载和系统配置。

#### 1.19 统计信息更新：

优化器依赖于表和索引的统计信息来做出决策，因此需要确保统计信息是最新的。

InnoDB存储引擎的统计数据收集是数据库性能优化的重要组成部分，因为这些统计数据会被MySQL查询优化器用来生成查询执行计划。以下是InnoDB统计数据收集的一些关键点：

1. **统计数据存储方式**：
   - InnoDB提供了两种存储统计数据的方式：永久性统计数据和非永久性统计数据。
   - 永久性统计数据存储在磁盘上，服务器重启后依然存在。
   - 非永久性统计数据存储在内存中，服务器关闭时会被清除。
2. **系统变量控制**：
   - `innodb_stats_persistent`：控制是否使用永久性统计数据，默认在MySQL 5.6.6之后的版本中为ON。
   - `innodb_stats_persistent_sample_pages`：控制永久性统计数据采样的页数，默认值为2012。
   - `innodb_stats_transient_sample_pages`：控制非永久性统计数据采样的页数，默认值为82。
3. **统计信息的更新**：
   - `ANALYZE TABLE`：可以用于手动更新统计信息，它将重新计算表的统计数据3。
   - `innodb_stats_auto_recalc`：控制是否自动重新计算统计数据，默认为ON24。
4. **统计数据的收集**：
   - InnoDB通过采样页面来估计表中的行数和其他统计信息24。
   - `innodb_table_stats`和`innodb_index_stats`：这两个内部表存储了关于表和索引的统计数据24。
5. **特定表的统计数据属性**：
   - 在创建或修改表时，可以通过`STATS_PERSISTENT`、`STATS_AUTO_RECALC`和`STATS_SAMPLE_PAGES`属性来控制表的统计数据行为234。
6. **NULL值的处理**：
   - `innodb_stats_method`变量决定了在统计索引列不重复值的数量时如何对待NULL值310。
7. **手动更新统计数据**：
   - 可以手动更新`innodb_table_stats`和`innodb_index_stats`表中的统计数据，之后需要使用`FLUSH TABLE`命令让优化器重新加载统计信息4。
8. **非永久性统计数据**：
   - 当`innodb_stats_persistent`设置为OFF时，新创建的表将使用非永久性统计数据，这些数据存储在内存中45。
9. **统计数据的自动更新**：
   - 如果表中数据变动超过一定比例（默认10%），并且`innodb_stats_auto_recalc`为ON，InnoDB将自动更新统计数据34。

通过以上信息，我们了解到 InnoDB 的统计数据收集是一个动态的过程，旨在帮助优化器做出更好的查询执行计划决策。数据库管理员可以根据系统的具体需求和性能指标来调整相关的系统变量，以优化统计数据的收集和使用。

> 问个问题：为什么 InnoDB `rows`这个统计项的值是估计值呢？
>
> `InnoDB`统计一个表中有多少行记录的套路大概是这样的：按照一定算法（并不是纯粹随机的）选取几个叶子节点页面，计算每个页面中主键值记录数量，然后计算平均一个页面中主键值的记录数量乘以全部叶子节点的数量就算是该表的`n_rows`值。

通过`EXPLAIN`或`EXPLAIN ANALYZE`命令可以查看查询优化器的执行计划，这有助于理解查询的执行方式，并据此进行优化。优化器的目标是找到最快、最高效的执行计划，但有时它也可能做出不理想的决策，特别是在数据量变化或统计信息不准确时。在这种情况下，可以通过调整索引、修改查询或使用SQL提示词来引导优化器做出更好的选择。



## 二、业务开发者可以优化什么

![](https://miro.medium.com/v2/resize:fit:1002/1*cegOtzJsnsPmLxZWHU1gWg.png)





假设性能优化就是在一定负载下尽可能的降低响应时间。那我们作为一名业务开发，想优化 MySQL，一般就是优化 CRUD 性能，那优化的前提肯定是比较烂，才优化，要么是服务器或者网络烂，要么是 DB 设计的烂，当然更多的一般是 SQL 写的烂。

![](https://image.dbbqb.com/202405181617/c383939ea6ba00933fd84e2989230659/pXOzq)

### 2.1 影响 MySQL 的性能因素 | 常见瓶颈

- ##### 硬件资源

  - CPU：CPU 的性能直接影响到 MySQL 的计算速度。多核 CPU 可以提高并发处理能力

  - 内存：足够的内存可以有效减少磁盘 I/O，提高缓存效率

  - 磁盘：磁盘的 I/O 性能对数据库读写速度有显著影响，特别是对于读密集型操作。比如装入数据远大于内存容量的时候，磁盘 I/O 就会达到瓶颈

- ##### 网络

​	网络带宽和延迟也会影响分布式数据库或应用服务器与数据库服务器之间的通信效率

- ##### DB 设计

  - 存储引擎的选择
  - 参数配置，如 `innodb_buffer_pool_size`，对数据库性能有决定性影响

- ##### 连接数和线程管理：

  - 高并发时，连接数和线程的高效管理对性能至关重要

- ##### 数据库设计

  - 合理的表结构设计、索引优化、数据类型选择等都会影响性能
    - 比如哪种超大文本、二进制媒体数据啥的就别往 MySQL 放了

- ##### 开发的技术水平

  - 开发的水平对性能的影响，查询语句写的烂，比如不管啥上来就 `SELECT *`，一个劲的 `left join`
  - 索引失效（单值 复合）

当然锁、长事务这类使用中的坑，会对性能造成影响，我也举不全。



### 2.2 性能分析

#### 先查外忧

外忧，就是我们业务开发，一般情况下不用解决，或者一般这锅背不到我们头上的问题，比如硬件、网络这种

> 查看 Linux 系统性能的常用命令
>
> MySQL 数据库是常见的两个瓶颈是 CPU 和 I/O 的瓶颈。CPU 在饱和的时候一般发生在数据装入内存或从磁盘上读取数据时候，磁盘 I/O 瓶颈发生在装入数据远大于内存容量的时候，如果应用分布在网络上，那么查询量相当大的时候那么瓶颈就会出现在网络上。Linux 中我们常用 mpstat、vmstat、iostat、sar 和 top 来查看系统的性能状态。
>
> `mpstat`： mpstat 是 Multiprocessor Statistics 的缩写，是实时系统监控工具。其报告为 CPU 的一些统计信息，这些信息存放在 /proc/stat 文件中。在多CPUs系统里，其不但能查看所有CPU的平均状况信息，而且能够查看特定CPU的信息。mpstat最大的特点是可以查看多核心cpu中每个计算核心的统计数据，而类似工具vmstat只能查看系统整体cpu情况。
>
> `vmstat`：vmstat 命令是最常见的 Linux/Unix 监控工具，可以展现给定时间间隔的服务器的状态值，包括服务器的 CPU 使用率，内存使用，虚拟内存交换情况，IO 读写情况。这个命令是我查看 Linux/Unix 最喜爱的命令，一个是 Linux/Unix 都支持，二是相比top，我可以看到整个机器的CPU、内存、IO的使用情况，而不是单单看到各个进程的CPU使用率和内存使用率(使用场景不一样)。
>
> `iostat`: 主要用于监控系统设备的 IO 负载情况，iostat 首次运行时显示自系统启动开始的各项统计信息，之后运行 iostat 将显示自上次运行该命令以后的统计信息。用户可以通过指定统计的次数和时间来获得所需的统计信息。
>
> `sar`： sar（System Activity Reporter系统活动情况报告）是目前 Linux 上最为全面的系统性能分析工具之一，可以从多方面对系统的活动进行报告，包括：文件的读写情况、系统调用的使用情况、磁盘 I/O、CPU效率、内存使用状况、进程活动及 IPC 有关的活动等。
>
> `top`：top 命令是 Linux 下常用的性能分析工具，能够实时显示系统中各个进程的资源占用状况，类似于 Windows 的任务管理器。top 显示系统当前的进程和其他状况，是一个动态显示过程,即可以通过用户按键来不断刷新当前状态.如果在前台执行该命令，它将独占前台，直到用户终止该程序为止。比较准确的说，top 命令提供了实时的对系统处理器的状态监视。它将显示系统中 CPU 最“敏感”的任务列表。该命令可以按 CPU 使用。内存使用和执行时间对任务进行排序；而且该命令的很多特性都可以通过交互式命令或者在个人定制文件中进行设定。

除了服务器硬件的性能瓶颈，对于 MySQL 系统本身，我们可以使用工具来优化数据库的性能，通常有三种：使用索引，使用 EXPLAIN 分析查询以及调整 MySQL 的内部配置。



#### 再定内患 | MySQL 常见性能分析手段

在优化 MySQL 时，通常需要对数据库进行分析，常见的分析手段有**慢查询日志**，**EXPLAIN 分析查询**，**profiling 分析**以及**show命令查询系统状态及系统变量**，通过定位分析性能的瓶颈，才能更好的优化数据库系统的性能。

#####  2.2.1 性能瓶颈定位 

我们可以通过 show 命令查看 MySQL 状态及变量，找到系统的瓶颈：

```mysql
Mysql> show status ——显示状态信息（扩展show status like ‘XXX’）

Mysql> show variables ——显示系统变量（扩展show variables like ‘XXX’）

Mysql> show innodb status ——显示InnoDB存储引擎的状态

Mysql> show processlist ——查看当前SQL执行，包括执行状态、是否锁表等

Shell> mysqladmin variables -u username -p password——显示系统变量

Shell> mysqladmin extended-status -u username -p password——显示状态信息
```



##### 2.2.2 Explain(执行计划)

- 是什么：使用 Explain 关键字可以模拟优化器执行 SQL 查询语句，从而知道 MySQL 是如何处理你的 SQL 语句的。分析你的查询语句或是表结构的性能瓶颈
- 能干吗
  - 表的读取顺序
  - 数据读取操作的操作类型
  - 哪些索引可以使用
  - 哪些索引被实际使用
  - 表之间的引用
  - 每张表有多少行被优化器查询

- 怎么玩

  - Explain + SQL语句
  - 执行计划包含的信息
  
  这里我建两个一样的表 t1、t2 用于示例说明
  
  ```mysql
  CREATE TABLE t1 (
      id INT NOT NULL AUTO_INCREMENT,
      col1 VARCHAR(100),
      col2 INT,
      col3 VARCHAR(100),
      part1 VARCHAR(100),
      part2 VARCHAR(100),
      part3 VARCHAR(100),
      common_field VARCHAR(100),
      PRIMARY KEY (id),
      KEY idx_key1 (col1),
      UNIQUE KEY idx_key2 (col2),
      KEY idx_key3 (col3),
      KEY idx_key_part(part1, part2, part3)
  ) Engine=InnoDB CHARSET=utf8;
  ```

- 各字段解释

  - <mark>**id**</mark>（select 查询的序列号，包含一组数字，表示查询中执行 select 子句或操作表的顺序）

    - id 相同，执行顺序从上往下
    - id 不同，如果是子查询，id 的序号会递增，id 值越大优先级越高，越先被执行
    - id 相同不同，同时存在，相同的属于一组，从上往下执行

  - <mark> **select_type**</mark>（查询的类型，用于区别普通查询、联合查询、子查询等复杂查询）

    - **SIMPLE** ：简单的 select 查询，查询中不包含子查询或 UNION
    -  **PRIMARY**：查询中若包含任何复杂的子部分，最外层查询被标记为 PRIMARY
    -  **SUBQUERY**：在 select 或 where 列表中包含了子查询
    - **DERIVED**：在 from 列表中包含的子查询被标记为 DERIVED，mysql 会递归执行这些子查询，把结果放在临时表里
    -  **UNION**：若第二个 select 出现在 UNION 之后，则被标记为 UNION，若 UNION 包含在 from 子句的子查询中，外层 select 将被标记为 DERIVED
    -  **UNION RESULT**：从 UNION 表获取结果的 select

  - <mark> **table**</mark>（显示这一行的数据是关于哪张表的）

  - <mark> **partitions**</mark>（匹配的分区信息，高版本才有的）

  - <mark> **type**</mark>（显示查询使用了那种类型，从最好到最差依次排列 **system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL** ）

    - system：表只有一行记录（等于系统表），是 const 类型的特例，平时不会出现
    - const：表示通过索引一次就找到了，const 用于比较 primary key 或 unique 索引，因为只要匹配一行数据，所以很快，如将主键置于 where 列表中，mysql 就能将该查询转换为一个常量
    - eq_ref：唯一性索引扫描，对于每个索引键，表中只有一条记录与之匹配，常见于主键或唯一索引扫描
    - ref：非唯一性索引扫描，范围匹配某个单独值得所有行。本质上也是一种索引访问，他返回所有匹配某个单独值的行，然而，它可能也会找到多个符合条件的行，多以他应该属于查找和扫描的混合体
    - ref_or_null：当对普通二级索引进行等值匹配查询，该索引列的值也可以是`NULL`值时，那么对该表的访问方法就可能是ref_or_null
    - index_merge: 在某些场景下可以使用`Intersection`、`Union`、`Sort-Union`这三种索引合并的方式来执行查询
    - range：只检索给定范围的行，使用一个索引来选择行。key 列显示使用了哪个索引，一般就是在你的 where 语句中出现了between、<、>、in等的查询，这种范围扫描索引比全表扫描要好，因为它只需开始于索引的某一点，而结束于另一点，不用扫描全部索引
    - index：Full Index Scan，index 于 ALL 区别为 index 类型只遍历索引树。通常比 ALL 快，因为索引文件通常比数据文件小。（**也就是说虽然 all 和 index 都是读全表，但 index 是从索引中读取的，而 all 是从硬盘中读的**）
    - all：Full Table Scan，将遍历全表找到匹配的行

    > 一般来说，得保证查询至少达到 range 级别，最好到达 ref

  - <mark> **possible_keys**</mark>（显示可能应用在这张表中的索引，一个或多个，查询涉及到的字段若存在索引，则该索引将被列出，但不一定被查询实际使用）
    
  - <mark> **key**</mark> 

    - 实际使用的索引，如果为NULL，则没有使用索引

    - **查询中若指定了使用了覆盖索引，则该索引和查询的 select 字段重叠，仅出现在 key 列表中**![](https://img.starfish.ink/mysql/explain-key.png)

  - <mark> **key_len**</mark>
    
    - 表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度。在不损失精确性的情况下，长度越短越好
    - key_len 显示的值为索引字段的最大可能长度，并非实际使用长度，即 key_len 是根据表定义计算而得，不是通过表内检索出的
    
  - <mark> **ref**</mark> （显示索引的哪一列被使用了，如果可能的话，是一个常数。哪些列或常量被用于查找索引列上的值）![](https://img.starfish.ink/mysql/explain-ref.png)

  - <mark> **rows**</mark> （根据表统计信息及索引选用情况，大致估算找到所需的记录所需要读取的行数）

  - <mark> **filtered**</mark>（某个表经过搜索条件过滤后剩余记录条数的百分比）

  - <mark> **Extra**</mark>（包含不适合在其他列中显示但十分重要的额外信息）

    额外信息有好几十个，我们看几个常见的

    1. <font color=red>`using filesort`</font>：说明 MySQL 会对数据使用一个外部的索引排序，不是按照表内的索引顺序进行读取。MySQL 中无法利用索引完成的排序操作称为“文件排序”![](https://img.starfish.ink/mysql/explain-extra-using-filesort.png)

    2. <font color=red>`Using temporary`</font>：使用了临时表保存中间结果，比如去重、排序之类的，比如我们在执行许多包含`DISTINCT`、`GROUP BY`、`UNION`等子句的查询过程中，如果不能有效利用索引来完成查询，`MySQL`很有可能寻求通过建立内部的临时表来执行查询。![](https://img.starfish.ink/mysql/explain-extra-using-tmp.png)

    3. <font color=red>`using index`</font>：表示相应的 select 操作中使用了覆盖索引，避免访问了表的数据行，效率不错，如果同时出现 `using where`，表明索引被用来执行索引键值的查找；否则索引被用来读取数据而非执行查找操作![](https://img.starfish.ink/mysql/explain-extra-using-index.png)

    4. `using where`：当某个搜索条件需要在`server层`进行判断时![](https://img.starfish.ink/mysql/explain-extra-using-where.png)

    5. `using join buffer`：使用了连接缓存![](https://img.starfish.ink/mysql/explain-extra-using-join-buffer.png)

    6. `impossible where`：where 子句的值总是 false，不能用来获取任何元祖![](https://img.starfish.ink/mysql/explain-extra-impossible-where.png)

    7. `Using index condition` : 查询使用了索引，但是查询条件不能完全由索引本身来满足![](https://img.starfish.ink/mysql/explain-extra-using-index-condition.png)

       `Using index condition `通常出现在以下几种情况：
    
       - **索引条件下推（Index Condition Pushdown, ICP）**：这是 MySQL 的一个优化策略，它将查询条件的过滤逻辑“下推”到存储引擎层，而不是在服务器层处理。这样可以减少从存储引擎检索的数据量，从而提高查询效率。
       - **部分索引**：当查询条件只涉及索引的一部分列时，MySQL 可以使用索引来快速定位到满足条件的行，但是可能需要回表（即访问表的实际数据行）来检查剩余的条件。
       - **复合索引**：在使用复合索引（即索引包含多个列）的情况下，如果查询条件只匹配索引的前几列，那么剩余的列可能需要通过 `Using index condition` 来进一步过滤。
    
    8. `select tables optimized away`：在没有group by子句的情况下，基于索引优化操作或对于MyISAM存储引擎优化COUNT(*)操作，不必等到执行阶段再进行计算，查询执行计划生成的阶段即完成优化
    
    9. `distinct`：优化distinct操作，在找到第一匹配的元祖后即停止找同样值的动作

  > **Json格式的执行计划**
  >
  > MySQL 5.7及以上版本支持使用`EXPLAIN FORMAT=JSON`命令，该命令返回查询的执行计划，以 JSON 格式展示。
  >
  > `EXPLAIN` 的 JSON 输出包含了多个层次和字段，以下是一些主要的字段：
  >
  > - **`query_block`**: 表示查询块，对应于`EXPLAIN`表格中的一行。对于简单查询，只有一个查询块；对于包含子查询或UNION的复杂查询，会有多个查询块。
  >   - **`select_id`**: 查询块的唯一标识符。
  >   - **`select_type`**: 查询类型（如`SIMPLE`、`PRIMARY`、`UNION`等）。
  >   - **`table`**: 正在访问的表名。
  >   - **`partitions`**: 表分区信息。
  >   - **`join`**: 如果是连接查询，这里会提供连接的详细信息。
  >   - **`condition`**: 应用的条件。
  >   - **`used_columns`**: 实际使用到的列。
  >   - **`attached_condition`**: 附加条件，如`WHERE`子句或`ON`子句的条件。
  > - **`output`**: 表示查询块的输出，通常是一个子查询或派生表。
  > - **`cost_model`**: 包含成本模型相关的信息，如：
  >   - **`rows_estimated`**: 估计需要读取的行数。
  >   - **`rows_examined`**: 实际检查的行数。
  >   - **`cost`**: 查询的成本。
  > - **`execution_info`**: 包含执行信息，如：
  >   - **`execution_mode`**: 执行模式（如`PACKET_BASED`或`ROW_BASED`）。
  >
  > ```mysql
  > mysql> EXPLAIN FORMAT=JSON SELECT * FROM t1 INNER JOIN t2 ON t1.col1 = t2.col2 WHERE t1.common_field = 'a'\G
  > *************************** 1. row ***************************
  > EXPLAIN: {
  >   "query_block": {
  >     "select_id": 1,
  >     "cost_info": {
  >       "query_cost": "0.70"
  >     },
  >     "nested_loop": [
  >       {
  >         "table": {
  >           "table_name": "t1",   # t1表是驱动表
  >           "access_type": "ALL", # 访问方法为ALL，意味着使用全表扫描访问
  >           "possible_keys": [    # 可能使用的索引
  >             "idx_key1"
  >           ],
  >           "rows_examined_per_scan": 1,
  >           "rows_produced_per_join": 1,
  >           "filtered": "100.00",
  >           "cost_info": {
  >             "read_cost": "0.25",
  >             "eval_cost": "0.10",
  >             "prefix_cost": "0.35",
  >             "data_read_per_join": "1K"
  >           },
  >           "used_columns": [
  >             "id",
  >             "col1",
  >             "col2",
  >             "col3",
  >             "part1",
  >             "part2",
  >             "part3",
  >             "common_field"
  >           ],
  >           "attached_condition": "((`fish`.`t1`.`common_field` = 'a') and (`fish`.`t1`.`col1` is not null))"
  >         }
  >       },
  >       {
  >         "table": {
  >           "table_name": "t2",
  >           "access_type": "eq_ref",
  >           "possible_keys": [
  >             "idx_key2"
  >           ],
  >           "key": "idx_key2",
  >           "used_key_parts": [
  >             "col2"
  >           ],
  >           "key_length": "5",
  >           "ref": [
  >             "fish.t1.col1"
  >           ],
  >           "rows_examined_per_scan": 1,
  >           "rows_produced_per_join": 1,
  >           "filtered": "100.00",
  >           "index_condition": "(cast(`fish`.`t1`.`col1` as double) = cast(`fish`.`t2`.`col2` as double))",
  >           "cost_info": {
  >             "read_cost": "0.25",
  >             "eval_cost": "0.10",
  >             "prefix_cost": "0.70",
  >             "data_read_per_join": "1K"
  >           },
  >           "used_columns": [
  >             "id",
  >             "col1",
  >             "col2",
  >             "col3",
  >             "part1",
  >             "part2",
  >             "part3",
  >             "common_field"
  >           ]
  >         }
  >       }
  >     ]
  >   }
  > }
  > ```

##### 2.2.3 OPTIMIZER TRACE

MySQL 的 `OPTIMIZER TRACE` 特性提供了一种深入理解查询优化器如何决定执行计划的方法。通过这个特性，你可以获取关于查询优化过程的详细信息，包括优化器所做的选择、考虑的替代方案、成本估算等

MySQL 5.6.3 版本开始，`OPTIMIZER TRACE` 作为一个系统变量引入。要使用它，你需要设置 `optimizer_trace` 变量为 `ON`，并确保你有 `TRACE` 权限。

启用 `OPTIMIZER TRACE`：

```mysql
SET optimizer_trace="enabled=on";
```

执行你的查询后，获取优化器跟踪结果：

```mysql
SELECT * FROM information_schema.OPTIMIZER_TRACE;
```

`OPTIMIZER_TRACE `表包含了多个列，提供了优化器决策过程的详细信息。以下是一些关键列：

- **`query`**: 执行的SQL查询。
- **`trace`**: 优化过程的详细跟踪信息，通常以JSON格式展示。
- **`missed_uses`**: 优化器未能使用的潜在优化。
- **`step`**: 优化过程中的步骤编号。
- **`level`**: 跟踪信息的层次级别。
- **`OK`**: 指示步骤是否成功完成。
- **`reason`**: 如果步骤未成功，原因说明。



##### 2.2.4 慢查询日志

MySQL 的慢查询日志是 MySQL 提供的一种日志记录，它用来记录在 MySQL 中响应时间超过阈值的语句，具体指运行时间超过`long_query_time` 值的SQL，则会被记录到慢查询日志中。

- `long_query_time` 的默认值为10，意思是运行10 秒以上的语句。
- 默认情况下，MySQL 数据库没有开启慢查询日志，需要手动设置参数开启。
- 如果不是调优需要的话，一般不建议启动该参数。

**开启慢查询日志**

临时配置：

```mysql
mysql> set global slow_query_log='ON';
mysql> set global slow_query_log_file='/var/lib/mysql/hostname-slow.log';
mysql> set global long_query_time=2;
```

可以用 `select sleep(4)` 验证是否成功开启。

在生产环境中，如果手工分析日志，查找、分析SQL，还是比较费劲的，所以 MySQL 提供了日志分析工具 `mysqldumpslow`。

> 通过 mysqldumpslow --help 查看操作帮助信息
>
> - 得到返回记录集最多的10个SQL
>
>   `mysqldumpslow -s r -t 10 /var/lib/mysql/hostname-slow.log`
>
> - 得到访问次数最多的10个SQL
>
>   `mysqldumpslow -s c -t 10 /var/lib/mysql/hostname-slow.log`
>
> - 得到按照时间排序的前10条里面含有左连接的查询语句
>
>   `mysqldumpslow -s t -t 10 -g "left join" /var/lib/mysql/hostname-slow.log`
>
> - 也可以和管道配合使用
>
>   `mysqldumpslow -s r -t 10 /var/lib/mysql/hostname-slow.log | more`

**也可使用 pt-query-digest 分析 RDS MySQL 慢查询日志**



##### 2.2.5 Show Profile 分析查询

通过慢日志查询可以知道哪些 SQL 语句执行效率低下，通过 explain 我们可以得知 SQL 语句的具体执行情况，索引使用等，还可以结合`Show Profile` 命令查看执行状态。

- `Show Profile`是 MySQL 提供可以用来分析当前会话中语句执行的资源消耗情况。可以用于 SQL 的调优的测量
- 默认情况下，参数处于关闭状态，并保存最近 15 次的运行结果
- 分析步骤

1. 启用profiling并执行查询：

   ```mysql
   SET profiling = 1;
   SELECT * FROM t1 WHERE col1 = 'a';
   ```

2. 查看所有PROFILES：

   ```mysql
   SHOW PROFILES;
   ```

3. 查看特定查询的 PROFILE, 进行诊断：

   ```mysql
   SHOW PROFILE CPU, BLOCK IO FOR QUERY query_id;
   ```

![](https://img.starfish.ink/mysql/show-profile.png)



#### 2.3 性能优化

##### 2.3.1 索引优化

1. **选择合适的索引类型**：根据查询需求，选择适合的索引类型，如普通索引、唯一索引、全文索引等。
2. **合理设计索引**：创建索引时，应考虑列的选择性，即不同值的比例，选择性高的列更应优先索引。
3. **使用覆盖索引**：创建覆盖索引，使得查询可以直接从索引中获取所需的数据，而无需回表查询。
4. **遵循最左前缀匹配原则**：在使用复合索引时，查询条件应该包含索引最左边的列，以确保索引的有效使用。
5. **避免冗余和重复索引**：定期检查并删除重复或冗余的索引，以减少维护成本和提高性能。
6. **使用索引条件下推（ICP）**：在MySQL 5.6及以上版本，利用索引条件下推减少服务器层的数据处理。
7. **索引维护**：定期对索引进行维护，如重建索引，以保持索引的性能和效率。
8. **使用EXPLAIN分析查询**：通过EXPLAIN命令分析查询的执行计划，确保索引被正确使用。
9. **避免在索引列上进行运算或使用函数**：这会导致索引失效，从而进行全表扫描。
10. **负向条件索引**：负向条件查询（如不等于、not in等）不会使用索引，建议用in查询优化。
11. **对文本建立前缀索引**：对于长文本字段，考虑建立前缀索引以减少索引大小并提高效率。
12. **建立索引的列不为NULL**：NULL值会影响索引的有效性，尽量确保索引列不包含NULL值。
13. **明确知道只会返回一条记录时，使用limit 1**：这可以提高查询效率。
14. **范围查询字段放最后**：在复合索引中，将范围查询的字段放在最后，以提高查询效率。
15. **尽量全值匹配**：尽量使用索引列的全值匹配，以提高索引的使用效率。
16. **Like查询时，左侧不要加%**：这会导致索引失效，应尽量避免。
17. **注意null/not null对索引的影响**：null值可能会影响索引的使用，需要特别注意。
18. **字符类型务必加上引号**：确保字符类型的值在使用时加上引号，以利用索引。
19. **OR关键字左右尽量都为索引列**：确保OR条件的两侧字段都是索引列，以提高查询效率。

这些策略可以帮助提高 MySQL 数据库的性能，但应根据具体的数据分布和查询模式来设计索引。索引不是越多越好，不恰当的索引可能会降低数据库的插入、更新和删除性能



##### 2.3.2 查询优化

1. **减少返回的列**：避免使用`SELECT *`，只选择需要的列。
2. **减少返回的行**：使用WHERE子句精确过滤数据、使用LIMIT子句限制返回结果的数量。
3. **优化JOIN操作**：
   - 确保JOIN操作中的表已经正确索引。
   - 使用小表驱动大表的原则。
   - 考虑表的连接顺序，减少中间结果集的大小。
4. **优化子查询**：将子查询转换为连接（JOIN）操作，以减少数据库的嵌套查询开销。
5. **使用临时表或派生表**：对于复杂的子查询，可以考虑使用临时表或派生表来简化查询。
6. **使用聚合函数和GROUP BY优化**：
   - 在适当的情况下使用聚合函数减少数据量。
   - 确保GROUP BY子句中的列上有索引。
7. **避免在WHERE子句中使用函数**：这可能导致索引失效，从而进行全表扫描。
8. **优化ORDER BY子句**：如果可能，使用索引排序来优化排序操作。
9. **使用UNION ALL代替UNION**：如果不需要去重，使用UNION ALL可以提高性能。
10. **优化数据表结构**：避免冗余字段，使用合适的数据类型。
11. **使用分区表**：对于非常大的表，使用分区可以提高查询效率。
12. **使用缓存**：对于重复查询的数据，使用缓存来减少数据库的访问。
13. **避免使用SELECT DISTINCT**：DISTINCT操作会降低查询性能，仅在必要时使用。
14. **优化LIKE语句**：避免在LIKE语句中使用前导通配符（如'%keyword'）。
15. **使用合适的事务隔离级别**：降低事务隔离级别可以减少锁的竞争，但要注意数据一致性。
16. **监控和优化慢查询**：开启慢查询日志，定期分析慢查询，找出性能瓶颈。
17. **批量操作**：对于插入或更新操作，尽量使用批量操作来减少事务开销。
18. **避免在索引列上使用OR条件**：OR条件可能导致查询优化器放弃使用索引。
19. **使用物化视图**：对于复杂的查询，可以考虑使用物化视图来预先计算并存储结果。



##### 2.3.3 数据类型优化

MySQL 支持的数据类型非常多，选择正确的数据类型对于获取高性能至关重要。不管存储哪种类型的数据，下面几个简单的原则都有助于做出更好的选择。

- 更小的通常更好：一般情况下，应该尽量使用可以正确存储数据的最小数据类型。

  简单就好：简单的数据类型通常需要更少的CPU周期。例如，整数比字符操作代价更低，因为字符集和校对规则（排序规则）使字符比较比整型比较复杂。

- 尽量避免NULL：通常情况下最好指定列为NOT NULL

 

> 规范：
>
> - 必须把字段定义为NOT NULL并且提供默认值
>   - null的列使索引/索引统计/值比较都更加复杂，对MySQL来说更难优化
>   - null 这种类型MySQL内部需要进行特殊处理，增加数据库处理记录的复杂性；同等条件下，表中有较多空字段的时候，数据库的处理性能会降低很多
>   - null值需要更多的存储空，无论是表还是索引中每行中的null的列都需要额外的空间来标识
>   - 对null 的处理时候，只能采用is null或is not null，而不能采用=、in、<、<>、!=、not in这些操作符号。如：where name!=’shenjian’，如果存在name为null值的记录，查询结果就不会包含name为null值的记录
>
> - **禁止使用TEXT、BLOB类型**：会浪费更多的磁盘和内存空间，非必要的大量的大字段查询会淘汰掉热数据，导致内存命中率急剧降低，影响数据库性能
>
> - **禁止使用小数存储货币**
> - 必须使用varchar(20)存储手机号
>
> - **禁止使用ENUM，可使用TINYINT代替**
>
> - 禁止在更新十分频繁、区分度不高的属性上建立索引
>
> - 禁止使用INSERT INTO t_xxx VALUES(xxx)，必须显示指定插入的列属性
>
> - 禁止使用属性隐式转换：SELECT uid FROM t_user WHERE phone=13812345678 会导致全表扫描
>
> - 禁止在WHERE条件的属性上使用函数或者表达式
>
>   - `SELECT uid FROM t_user WHERE from_unixtime(day)>='2017-02-15' `会导致全表扫描
>
>   - 正确的写法是：`SELECT uid FROM t_user WHERE day>= unix_timestamp('2017-02-15 00:00:00')`
>
> - 建立组合索引，必须把区分度高的字段放在前面
>
> - 禁止负向查询，以及%开头的模糊查询
>
>   - 负向查询条件：NOT、!=、<>、!<、!>、NOT IN、NOT LIKE等，会导致全表扫描
>   - %开头的模糊查询，会导致全表扫描
>
> - 禁止大表使用JOIN查询，禁止大表使用子查询：会产生临时表，消耗较多内存与CPU，极大影响数据库性能
>

### References

- [58到家数据库30条军规解读](https://mp.weixin.qq.com/s?__biz=MjM5ODYxMDA5OQ==&mid=2651959906&idx=1&sn=2cbdc66cfb5b53cf4327a1e0d18d9b4a&chksm=bd2d07be8a5a8ea86dc3c04eced3f411ee5ec207f73d317245e1fefea1628feb037ad71531bc&scene=21#wechat_redirect)





