---
title: MySQL Storage Engine
date: 2023-05-31
tags: 
 - MySQL
categories: MySQL
---

![img](https://dbastack.com/wp-content/uploads/2024/09/MySQL-Storage-Engine-3.png.webp)

> 存储引擎是 MySQL 的组件，用于处理不同表类型的 SQL 操作。不同的存储引擎提供不同的存储机制、索引技巧、锁定水平等功能，使用不同的存储引擎，还可以获得特定的功能。
>
> 使用哪一种引擎可以灵活选择，**<font color=red>一个数据库中多个表可以使用不同引擎以满足各种性能和实际需求</font>**，使用合适的存储引擎，将会提高整个数据库的性能 。
>
>  MySQL 服务器使用可插拔的存储引擎体系结构，可以从运行中的MySQL服务器加载或卸载存储引擎 。

> [MySQL 5.7 可供选择的存储引擎](https://dev.mysql.com/doc/refman/5.7/en/storage-engines.html)

## 一、存储引擎的作用与架构

MySQL 存储引擎是数据库的底层核心组件，负责数据的**存储、检索、事务控制**以及**并发管理**。其架构采用**插件式设计**，允许用户根据业务需求灵活选择引擎类型，例如 InnoDB、MyISAM、Memory 等。这种设计将**查询处理**与**数据存储**解耦，提升了系统的可扩展性和灵活性 。

MySQL  的体系架构分为四层：

- **连接层**：管理客户端连接、认证与线程分配，支持 SSL 安全协议。
- **核心服务层**：处理 SQL 解析、优化、缓存及内置函数执行。
- **存储引擎层**：实际负责数据的存储和提取，支持多引擎扩展。
- **数据存储层**：通过文件系统与存储引擎交互，管理物理文件。



## 二、核心存储引擎详解

### 2.1 常用存储引擎

**查看存储引擎**

```mysql
-- 查看支持的存储引擎
SHOW ENGINES

-- 查看默认存储引擎
SHOW VARIABLES LIKE 'storage_engine'

--查看具体某一个表所使用的存储引擎，这个默认存储引擎被修改了！
show create table tablename

--准确查看某个数据库中的某一表所使用的存储引擎
show table status like 'tablename'
show table status from database where name="tablename"
```

以下是 MySQL 主要存储引擎的对比表格，整合了各引擎的核心特性及适用场景，结合最新版本（MySQL 8.0+）特性更新：

| **存储引擎**           | **核心特性**                                                 | **事务支持** | **锁级别**     | **索引类型**            | **文件结构**                           | **适用场景**                     |
| ---------------------- | ------------------------------------------------------------ | ------------ | -------------- | ----------------------- | -------------------------------------- | -------------------------------- |
| **InnoDB**             | 支持ACID事务、行级锁、MVCC、外键约束，具备崩溃恢复能力，默认使用聚簇索引 | ✅            | 行锁/表锁      | B+Tree/全文索引（5.6+） | `.ibd`（数据+索引）、`.frm`（表结构）  | 高并发OLTP（电商交易、金融系统） |
| **MyISAM**             | 非事务型，表级锁，支持全文索引和压缩表，查询速度快           | ❌            | 表锁           | B+Tree/全文索引         | `.MYD`（数据）、`.MYI`（索引）、`.frm` | 静态报表、日志分析、只读业务     |
| **Memory**             | 数据全内存存储，哈希索引加速查询，重启后数据丢失             | ❌            | 表锁           | Hash/B-Tree             | `.frm`（仅表结构）                     | 临时表、会话缓存、高速缓存层     |
| **Archive**            | 仅支持INSERT/SELECT，Zlib压缩存储（压缩率10:1），无索引      | ❌            | 行锁（仅插入） | ❌                       | `.ARZ`（数据）、`.ARM`（元数据）       | 历史数据归档、审计日志           |
| **CSV**                | 数据以CSV格式存储，可直接文本编辑，不支持索引                | ❌            | 表锁           | ❌                       | `.CSV`（数据）、`.CSM`（元数据）       | 数据导入/导出中间表              |
| **Blackhole**          | 写入数据即丢弃，仅保留二进制日志，用于复制链路中继           | ❌            | ❌              | ❌                       | `.frm`（仅表结构）                     | 主从复制中继、性能测试           |
| **Federated**          | 代理访问远程表，本地无实际数据存储                           | ❌            | 依赖远程表引擎 | 依赖远程表引擎          | `.frm`（仅表结构）                     | 分布式数据聚合                   |
| **NDB**                | 集群式存储引擎，支持数据自动分片和高可用性                   | ✅            | 行锁           | Hash/B-Tree             | 数据存储在集群节点                     | MySQL Cluster分布式系统          |
| **Merge**              | 聚合多个MyISAM表，逻辑上作为单个表操作                       | ❌            | 表锁           | B-Tree                  | `.MRG`（聚合定义）、底层使用MyISAM文件 | 分库分表聚合查询                 |
| **Performance Schema** | 内置性能监控引擎，采集服务器运行时指标                       | ❌            | ❌              | ❌                       | 内存存储，无物理文件                   | 性能监控与诊断                   |



### 2.2 存储引擎架构演进

**1. MySQL 8.0 关键改进**

- 原子 DDL：DDL操作（如CREATE TABLE）具备事务性，失败时自动回滚元数据变更
- 数据字典升级：系统表全部转为InnoDB引擎，替代原有的.frm文件，实现事务化元数据管理
- Redo日志优化：MySQL 8.0.30+ 引入 `innodb_redo_log_capacity` 参数替代旧版日志配置，支持动态调整redo日志大小

 **2.  物理文件结构变化**

| 文件类型       | 5.7及之前版本 | 8.0+版本           | 作用               |
| -------------- | ------------- | ------------------ | ------------------ |
| 表结构定义文件 | .frm          | .sdi (JSON格式)    | 存储表结构元数据 6 |
| 事务日志       | ibdata1       | undo_001, undo_002 | 独立UNDO表空间     |
| 数据文件       | .ibd          | .ibd               | 表数据与索引存储   |
| 临时文件       | ibtmp1        | ibtmp1             | 临时表空间         |

> 示例：通过 `SHOW CREATE TABLE` 可查看SDI元数据，支持 JSON 格式导出



### 2.3 Innodb 引擎的 4 大特性

#### **1. 插入缓冲（Insert Buffer / Change Buffer）**

- **作用**：优化非唯一二级索引的插入、删除、更新（即 DML 操作）性能，减少磁盘随机 I/O 开销。
- 原理：
  - 当非唯一索引页不在内存中时，操作会被暂存到 Change Buffer（内存区域）中，而非直接写入磁盘。
  - 后续通过合并（Merge）操作，将多个离散的修改批量写入磁盘，减少 I/O 次数。
- 适用条件：
  - 仅针对非唯一二级索引。
  - 可通过参数 `innodb_change_buffer_max_size` 调整缓冲区大小（默认 25% 缓冲池）。

#### 2. 二次写（Double Write）

- 作用：防止因部分页写入（Partial Page Write）导致的数据页损坏，确保崩溃恢复的可靠性。
- 流程：
  - 脏页刷盘时，先写入内存的 Doublewrite Buffer，再分两次（每次 1MB）顺序写入共享表空间的连续磁盘区域。
  - 若数据页写入过程中崩溃，恢复时从共享表空间副本还原损坏页，再通过 Redo Log 恢复。
- 意义：牺牲少量顺序 I/O 换取数据完整性，避免因随机 I/O 中断导致数据丢失。

#### 3. 自适应哈希索引（Adaptive Hash Index, AHI）

- 作用：自动为高频访问的索引页创建哈希索引，加速查询速度（尤其等值查询）。

- 触发条件：

  - 同一索引被连续访问 17 次以上。
  - 某页被访问超过 100 次，且访问模式一致（如固定 WHERE 条件）。

- 限制

  ：仅对热点数据生效，无法手动指定，可通过参数 `innodb_adaptive_hash_index` 启用或关闭。

#### 4. 预读（Read Ahead）

- 作用：基于空间局部性原理，异步预加载相邻数据页到缓冲池，减少未来查询的磁盘 I/O。
- 模式：
  - 线性预读：按顺序访问的页超过阈值时，预加载下一批连续页（默认 64 页为一个块）。
  - 随机预读（已废弃）：当某块中部分页在缓冲池时，预加载剩余页，但因性能问题被弃用。

#### 其他重要特性补充

尽管上述四点是核心性能优化特性，但 InnoDB 的其他关键能力也值得注意：

- 事务支持：通过 ACID 特性（原子性、一致性、隔离性、持久性）保障数据一致性。
- 行级锁与外键约束：支持高并发与数据完整性。
- **崩溃恢复**：结合 Redo Log 和 Double Write 实现快速恢复



### 2.4 数据的存储

在整个数据库体系结构中，我们可以使用不同的存储引擎来存储数据，而绝大多数存储引擎都以二进制的形式存储数据；我们来看下InnoDB 中对数据是如何存储的。

在 InnoDB 存储引擎中，所有的数据都被逻辑地存放在表空间中，表空间（tablespace）是存储引擎中最高的存储逻辑单位，在表空间的下面又包括段（segment）、区（extent）、页（page）

![](https://img.starfish.ink/mysql/table-space.jpg)

 

 同一个数据库实例的所有表空间都有相同的页大小；默认情况下，表空间中的页大小都为 16KB，当然也可以通过改变 `innodb_page_size` 选项对默认大小进行修改，需要注意的是不同的页大小最终也会导致区大小的不同 

对于 16KB 的页来说，连续的 64 个页就是一个区，也就是 1 个区默认占用 1 MB 空间的大小。

#### 数据页结构

页是 InnoDB 存储引擎管理数据的最小磁盘单位，一个页的大小一般是 `16KB`。

`InnoDB` 为了不同的目的而设计了许多种不同类型的`页`，比如存放表空间头部信息的页，存放 `Insert Buffer` 信息的页，存放 `INODE`信息的页，存放 `undo` 日志信息的页等等等等。

 B-Tree 节点就是实际存放表中数据的页面，我们在这里将要介绍页是如何组织和存储记录的；首先，一个 InnoDB 页有以下七个部分：

![](https://img.starfish.ink/mysql/innodb-b-tree-node.jpg)

有的部分占用的字节数是确定的，有的部分占用的字节数是不确定的。

| 名称                 | 中文名             | 占用空间大小 | 简单描述                 |
| -------------------- | ------------------ | ------------ | ------------------------ |
| `File Header`        | 文件头部           | `38`字节     | 页的一些通用信息         |
| `Page Header`        | 页面头部           | `56`字节     | 数据页专有的一些信息     |
| `Infimum + Supremum` | 最小记录和最大记录 | `26`字节     | 两个虚拟的行记录         |
| `User Records`       | 用户记录           | 不确定       | 实际存储的行记录内容     |
| `Free Space`         | 空闲空间           | 不确定       | 页中尚未使用的空间       |
| `Page Directory`     | 页面目录           | 不确定       | 页中的某些记录的相对位置 |
| `File Trailer`       | 文件尾部           | `8`字节      | 校验页是否完整           |

在页的 7 个组成部分中，我们自己存储的记录会按照我们指定的`行格式`存储到 `User Records` 部分。但是在一开始生成页的时候，其实并没有 `User Records` 这个部分，每当我们插入一条记录，都会从 `Free Space` 部分，也就是尚未使用的存储空间中申请一个记录大小的空间划分到 `User Records` 部分，当 `Free Space` 部分的空间全部被 `User Records` 部分替代掉之后，也就意味着这个页使用完了，如果还有新的记录插入的话，就需要去申请新的页了，这个过程的图示如下：

![](https://img.starfish.ink/mysql/page-application-record.png)



#### 如何存储表

MySQL 使用 InnoDB 存储表时，会将表的定义和数据索引等信息分开存储，其中前者存储在 `.frm` 文件中，后者存储在 `.ibd` 文件中。

#### .frm 文件

无论在 MySQL 中选择了哪个存储引擎，所有的 MySQL 表都会在硬盘上创建一个 `.frm` 文件用来描述表的格式或者说定义；`.frm` 文件的格式在不同的平台上都是相同的。

> MySQL 官方文档中的 [11.1 MySQL .frm File Format](https://dev.mysql.com/doc/internals/en/frm-file-format.html) 一文对于 `.frm` 文件格式中的二进制的内容有着非常详细的表述。

#### .ibd 文件

InnoDB 中用于存储数据的文件总共有两个部分，一是系统表空间文件，包括 `ibdata1`、`ibdata2` 等文件，其中存储了 InnoDB 系统信息和用户数据库表数据和索引，是所有表公用的。

当打开 `innodb_file_per_table` 选项时，`.ibd` 文件就是每一个表独有的表空间，文件存储了当前表的数据和相关的索引数据。

#### 如何存储记录 | InnoDB  行格式

InnoDB 存储引擎和大多数数据库一样，记录是以行的形式存储的，每个 16KB 大小的页中可以存放多条行记录。

它可以使用不同的行格式进行存储。

InnoDB 早期的文件格式为 `Antelope`，可以定义两种行记录格式，分别是 `Compact` 和 `Redundant`，InnoDB 1.0.x 版本开始引入了新的文件格式 `Barracuda`。`Barracuda `文件格式下拥有两种新的行记录格式：`Compressed` 和 `Dynamic`。

> [InnoDB Row Formats](https://dev.mysql.com/doc/refman/5.7/en/innodb-row-format.html#innodb-row-format-redundant)

![](https://img.starfish.ink/mysql/innodb-row-format.png)

MySQL 5.7 版本支持以上格式的行存储方式。

我们可以在创建或修改表的语句中指定行格式：

```mysql
CREATE TABLE 表名 (列的信息) ROW_FORMAT=行格式名称
    
ALTER TABLE 表名 ROW_FORMAT=行格式名称
```

`Compact `行记录格式是在 MySQL 5.0 中引入的，其首部是一个非 NULL 变长列长度列表，并且是逆序放置的，其长度为：

- 若列的长度小于等于 255 字节，用 1 个字节表示；
- 若列的长度大于 255 字节，用 2 个字节表示。

![Compact row format](https://miro.medium.com/v2/resize:fit:1400/1*wNIUPIn4jo9kKbLvsmSUDQ.png)

变长字段的长度最大不可以超过 2 字节，这是因为 MySQL 数据库中 VARCHAR 类型的最大长度限制为 65535。变长字段之后的第二个部分是 NULL 标志位，该标志位指示了该行数据中某列是否为 NULL 值，有则用 1 表示，NULL 标志位也是不定长的。接下来是记录头部信息，固定占用 5 字节。

`Redundant` 是 MySQL 5.0 版本之前 InnoDB 的行记录格式，`Redundant` 行记录格式的首部是每一列长度偏移列表，同样是逆序存放的。从整体上看，`Compact `格式的存储空间减少了约 20%，但代价是某些操作会增加 CPU 的使用。

`Dynamic` 和 `Compressed `是 `Compact `行记录格式的变种，`Compressed `会对存储在其中的行数据会以 `zlib` 的算法进行压缩，因此对于 BLOB、TEXT、VARCHAR 这类大长度类型的数据能够进行非常有效的存储。

> 高版本，比如 8.3 默认使用的是 Dynamic
>
> ```sql
> SELECT @@innodb_default_row_format;
> ```



#### 行溢出数据

当 InnoDB 存储极长的 TEXT 或者 BLOB 这类大对象时，MySQL 并不会直接将所有的内容都存放在数据页中。因为 InnoDB 存储引擎使用 B+Tree 组织索引，每个页中至少应该有两条行记录，因此，如果页中只能存放下一条记录，那么 InnoDB 存储引擎会自动将行数据存放到溢出页中。

如果我们使用 `Compact` 或 `Redundant` 格式，那么会将行数据中的前  768  个字节存储在数据页中，后面的数据会通过指针指向 Uncompressed BLOB Page。

但是如果我们使用新的行记录格式 `Compressed` 或者 `Dynamic` 时只会在行记录中保存 20 个字节的指针，实际的数据都会存放在溢出页面中。



### 参考与引用：

- https://www.linkedin.com/pulse/leverage-innodb-architecture-optimize-django-model-design-bouslama
- [踏雪无痕-InnoDB存储引擎](https://www.cnblogs.com/chenpingzhao/p/9177324.html) 
- [MySQL 与 InnoDB 存储引擎总结](https://wingsxdu.com/posts/database/mysql/innodb/)

