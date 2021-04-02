> [官方文档](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Explain)



我们知道 MySQL 有执行计划，

Hive 的底层就是 MapReduce 的编程实现，我们可以通过执行计划详细的了解执行过程。

### 语法

Hive 和 MySQL 类似，也提供了一个 `EXPLAIN` 命令来显示查询语句的执行计划，如下

```sql
EXPLAIN [EXTENDED|CBO|AST|DEPENDENCY|AUTHORIZATION|LOCKS|VECTORIZATION|ANALYZE] query
```

`EXPLAIN + 可选参数 + 查询语句`

可选参数：

- EXTENDED：
- CBO：
- AST：
- DEPENDENCY：
- AUTHORIZATION：
- LOCKS：
- VECTORIZATION：
- ANALYZE：

### 示例

直接 `EXPLAN`，不加任何参数

```bash
hive> explain select * from xurilogall where dt='2020-03-01';
OK
STAGE DEPENDENCIES:
  Stage-0 is a root stage    //

STAGE PLANS:
  Stage: Stage-0
    Fetch Operator
      limit: -1
      Processor Tree:
        TableScan
          alias: xurilogall
          Statistics: Num rows: 3391560 Data size: 5860617060 Basic stats: COMPLETE Column stats: NONE
          Select Operator
            expressions: log_time (type: string), cpctranid (type: bigint), msg_type (type: int), accountid (type: bigint), cpcplanid (type: bigint), clickdate (type: string), cost (type: decimal(10,0)), costa (type: decimal(10,0)), costb (type: decimal(10,0)), costc (type: decimal(10,0)), servicetype (type: int), cpcid (type: bigint), keyword (type: string), position (type: bigint), cpcgrpid (type: bigint), ip (type: string), pid (type: string), istest (type: int), agentid (type: int), regioncode (type: int), type (type: int), msgid (type: string), account_budgetday (type: int), cpcplan_budgetday (type: int), validity (type: int), ideaid (type: bigint), querykey (type: string), codeid (type: int), domainid (type: int), topdomainid (type: int), subdomainid (type: int), clickdevice (type: int), clickdevicestat (type: int), cpcplan_devicetype (type: int), extraideaid (type: int), linkpicid (type: int), cpcstyle_type (type: int), complete_pid (type: string), place_holder (type: int), pattern_match (type: string), showregion (type: string), eesf (type: string), extend_reserved (type: bigint), cumulate_status (type: smallint), cumulate_amount (type: bigint), real_account_budget (type: bigint), plantype (type: int), matchtype (type: smallint), max_price (type: bigint), '2020-03-01' (type: string)
            outputColumnNames: _col0, _col1, _col2, _col3, _col4, _col5, _col6, _col7, _col8, _col9, _col10, _col11, _col12, _col13, _col14, _col15, _col16, _col17, _col18, _col19, _col20, _col21, _col22, _col23, _col24, _col25, _col26, _col27, _col28, _col29, _col30, _col31, _col32, _col33, _col34, _col35, _col36, _col37, _col38, _col39, _col40, _col41, _col42, _col43, _col44, _col45, _col46, _col47, _col48, _col49
            Statistics: Num rows: 3391560 Data size: 5860617060 Basic stats: COMPLETE Column stats: NONE
            ListSink

Time taken: 0.26 seconds, Fetched: 17 row(s)
```

