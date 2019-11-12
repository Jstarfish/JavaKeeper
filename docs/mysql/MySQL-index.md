

- 索引简介

- - 是什么

- - - MYSQL官方对索引的定义为：索引（Index）是帮助MySQL高效获取数据的数据结构，所以说索引的本质是：数据结构
    - 可以简单的理解为“排好序的快速查找数据结构”，数据本身之外，数据库还维护者一个满足特定查找算法的数据结构，这些数据结构以某种方式指向数据，这就是索引

![img](G:/youdaoLocalData/jstarfish@126.com/40c78d2b685845edaaa726fa89a359af/4694-707872.jpeg)

- - - 索引本身也很大，不可能全部存储在内存中，**一般以索引文件的形式存储在磁盘上**
    - 平常说的索引，没有特别指明的话，就是B树（多路搜索树，不一定是二叉树）结构组织的索引。其中聚集索引，次要索引，覆盖索引，符合索引，前缀索引，唯一索引默认都是使用B+树索引，统称索引。此外还有哈希索引等。

- - 优势

- - - **提高数据检索效率，降低数据库IO成本**
    - **降低数据排序的成本，降低CPU的消耗**

- - 劣势

- - - 索引也是一张表，保存了主键和索引字段，并指向实体表的记录，所以也需要占用内存
    - 虽然提高了查询效率，但也降低了更新表的效率（更新表时，MySQL不仅要保存数据，还要保存一下索引文件每次更新添加索引列的字段）

- - mysql索引分类

- - - **单值索引**：一个索引只包含单个列，一个表可以有多个单列索引
    - **唯一索引**：索引列的值必须唯一，但允许有空值
    - **复合索引**：一个索引包含多个列
    - 基本语法：

- - - - 创建：

- - - - - 创建索引：CREATE [UNIQUE] INDEX indexName ON mytable(username(length));
        - 如果是CHAR，VARCHAR类型，length可以小于字段实际长度；如果是BLOB和TEXT类型，必须指定 length。
        - 修改表结构(添加索引)：ALTER table tableName ADD [UNIQUE] INDEX indexName(columnName)

- - - - 删除：

- - - - - DROP INDEX [indexName] ON mytable;

- - - - 查看：

- - - - - SHOW INDEX FROM table_name; \G   --可以通过添加 \G 来格式化输出信息。

- - - - 使用ALERT命令

- - - - - **ALTER TABLE tbl_name ADD PRIMARY KEY (column_list):** 该语句添加一个主键，这意味着索引值必须是唯一的，且不能为NULL。
        - **ALTER TABLE tbl_name ADD UNIQUE index_name (column_list):** 这条语句创建索引的值必须是唯一的（除了NULL外，NULL可能会出现多次）。
        - **ALTER TABLE tbl_name ADD INDEX index_name (column_list):** 添加普通索引，索引值可出现多次。
        - **ALTER TABLE tbl_name ADD FULLTEXT index_name (column_list):**该语句指定了索引为 FULLTEXT ，用于全文索引。

- - mysql索引结构（https://blog.csdn.net/zhangliangzi/article/details/51366345）默认使用的好像是Btree

- - - BTree索引
    - Hash索引
    - full-text全文索引
    - R-Tree索引

- - 哪些情况需要创建索引

- - - 1、主键自动建立唯一索引
    - 2、频繁作为查询条件的字段
    - 3、查询中与其他表关联的字段，外键关系建立索引
    - 4、单键/组合索引的选择问题，who?高并发下倾向创建组合索引
    - 5、查询中排序的字段，排序字段通过索引访问大幅提高排序速度
    - 6、查询中统计或分组字段

- - 哪些情况不要创建索引

- - - 1、表记录太少
    - 2、经常增删改的表
    - 3、数据重复且分布均匀的表字段，只应该为最经常查询和最经常排序的数据列建立索引（如果某个数据类包含太多的重复数据，建立索引没有太大意义）
    - 4、频繁更新的字段不适合创建索引（会加重IO负担）
    - 5、where条件里用不到的字段不创建索引