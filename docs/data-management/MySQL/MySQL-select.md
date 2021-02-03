## 常见通用的Join查询

### SQL执行顺序

- 手写

  ```mysql
  SELECT DISTINCT <select_list>
  FROM  <left_table> <join_type>
  JOIN  <right_table> ON <join_condition>
  WHERE  <where_condition>
  GROUP BY  <group_by_list>
  HAVING <having_condition>
  ORDER BY <order_by_condition>
  LIMIT <limit_number>
  ```

- 机读

  ```mysql
  FROM  <left_table>
  ON <join_condition>
  <join_type> JOIN  <right_table> 
  WHERE  <where_condition>
  GROUP BY  <group_by_list>
  HAVING <having_condition>
  SELECT
  DISTINCT <select_list>
  ORDER BY <order_by_condition>
  LIMIT <limit_number>
  ```

- 总结

  ![sql-parse](../../_images/mysql/sql-parse.png)

  

### Join图

![sql-joins](../../_images/mysql/sql-joins.jpg)

### demo

#### 建表SQL

```plsql
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

```

#### 7种JOIN

1. A、B两表共有

   ```mysql
   select * from tbl_emp a **inner join** tbl_dept b on a.deptId = b.id;
   ```

2. A、B两表共有+A的独有

   ```mysql
    select * from tbl_emp a **left join** tbl_dept b on a.deptId = b.id;
   ```

3. A、B两表共有+B的独有

   ```mysql
    select * from tbl_emp a **right join** tbl_dept b on a.deptId = b.id;
   ```

4. A的独有 

   ```mysql
   select * from tbl_emp a left join tbl_dept b on a.deptId = b.id where b.id is null; 
   ```

5. B的独有

   ```mysql
   select * from tbl_emp a right join tbl_dept b on a.deptId = b.id where a.deptId is null; 
   ```

6. AB全有
  

**MySQL Full Join的实现 因为MySQL不支持FULL JOIN,替代方法:left join + union(可去除重复数据)+ right join**

   ```mysql
   SELECT * FROM tbl_emp A LEFT JOIN tbl_dept B ON A.deptId = B.id
   UNION
   SELECT * FROM tbl_emp A RIGHT JOIN tbl_dept B ON A.deptId = B.id
   ```

7. A的独有+B的独有

   ```mysql
   SELECT * FROM tbl_emp A LEFT JOIN tbl_dept B ON A.deptId = B.id WHERE B.`id` IS NULL
   UNION
   SELECT * FROM tbl_emp A RIGHT JOIN tbl_dept B ON A.deptId = B.id WHERE A.`deptId` IS NULL;
   ```

   

