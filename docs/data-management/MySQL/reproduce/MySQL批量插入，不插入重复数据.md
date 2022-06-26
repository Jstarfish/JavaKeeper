> 知识这个东西，看来真的要温故而知新，一直不用，都要忘记了。
>
> 业务很简单：需要批量插入一些数据，数据来源可能是其他数据库的表，也可能是一个外部excel的导入。
>
> 那么问题来了，是不是每次插入之前都要查一遍，看看重不重复，在代码里筛选一下数据，重复的就过滤掉呢？
>
> 向大数据数据库中插入值时，还要判断插入是否重复，然后插入。如何提高效率？

解决的办法有很多种，不同的场景解决方案也不一样，数据量很小的情况下，怎么搞都行，但是数据量很大的时候，这就不是一个简单的问题了。

几百万的数据，不可能查出来去重处理！

看一下常用到的解决方案。

### 1、insert ignore into

> 当插入数据时，如出现错误时，如重复数据，将不返回错误，只以警告形式返回。所以使用ignore请确保语句本身没有问题，否则也会被忽略掉。例如：

```mysql
INSERT IGNORE INTO user (name) VALUES ('telami') 
```

> 这种方法很简便，但是有一种可能，就是插入不是因为重复数据报错，而是因为其他原因报错的，也同样被忽略了～

### 2、on duplicate key update

当primary或者unique重复时，则执行update语句，如update后为无用语句，如id=id，则同1功能相同，但错误不会被忽略掉。

在公众号后端架构师后台回复“架构整洁”，获取一份惊喜礼包。

例如，为了实现name重复的数据插入不报错，可使用一下语句：

```mysql
INSERT INTO user (name) VALUES ('telami') ON duplicate KEY UPDATE id = id 
```

这种方法有个前提条件，就是，需要插入的约束，需要是主键或者唯一约束（在你的业务中那个要作为唯一的判断就将那个字段设置为唯一约束也就是unique key）。

### 3、insert … select … where not exist

根据select的条件判断是否插入，可以不光通过primary 和unique来判断，也可通过其它条件。例如：

```mysql
INSERT INTO user (name) SELECT 'telami' FROM dual WHERE NOT EXISTS (SELECT id FROM user WHERE id = 1) 
```

这种方法其实就是使用了mysql的一个临时表的方式，但是里面使用到了子查询，效率也会有一点点影响，如果能使用上面的就不使用这个。

### 4、replace into

如果存在primary or unique相同的记录，则先删除掉。再插入新记录。

```mysql
REPLACE INTO user SELECT 1, 'telami' FROM books 
```

这种方法就是不管原来有没有相同的记录，都会先删除掉然后再插入。

### 实践

选择的是第二种方式

```xml
<insert id="batchSaveUser" parameterType="list">
    insert into user (id,username,mobile_number)
    values
    <foreach collection="list" item="item" index="index" separator=",">
        (
            #{item.id},
            #{item.username},
            #{item.mobileNumber}
        )
    </foreach>
    ON duplicate KEY UPDATE id = id
</insert>
```

这里用的是Mybatis，批量插入的一个操作，**mobile_number**已经加了唯一约束。这样在批量插入时，如果存在手机号相同的话，是不会再插入了的。