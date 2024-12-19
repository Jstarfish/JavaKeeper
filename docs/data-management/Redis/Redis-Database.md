# Redis-Database

Redis 如何表示一个数据库？数据库操作是如何实现的？

> 这篇文章是基于源码来让我们理解 Redis 的，不管是我们自己下载 redis 还是直接在 Github 上看源码，我们先要了解下 redis 根目录下的重要目录
>
> - `src`：用C编写的Redis实现
> - `tests`：包含在Tcl中实现的单元测试
> - `deps`：包含Redis使用的库。编译Redis所需的所有文件都在此目录中
>
> 我们深入学习只需要看 src 目录就可以了。



## 数据库结构

理解程序如何工作的最简单方法是理解它使用的数据结构。 从 `redis/src` 目录下可以看到 server 的源码文件（基于 `redis-6.0.5`，redis3.0 叫 `redis.c` 和 `redis.h`）。

Redis的主头文件 `server.h`  中定义了各种结构体，比如Redis 对象`redisObject` 、存储结构`redisDb `、客户端`client` 等等。

```c
/* Redis database representation. There are multiple databases identified
 * by integers from 0 (the default database) up to the max configured
 * database. The database number is the 'id' field in the structure. */
typedef struct redisDb {
  	// 数据库键空间，保存着数据库中的所有键值对
    dict *dict;                 /* The keyspace for this DB */
  	// 键的过期时间，字典的键为键，字典的值为过期事件 UNIX 时间戳
    dict *expires;              /* Timeout of keys with a timeout set */
  	// 正处于阻塞状态的键
    dict *blocking_keys;        /* Keys with clients waiting for data (BLPOP)*/
  	// 可以解除阻塞的键
    dict *ready_keys;           /* Blocked keys that received a PUSH */
  	// 正在被 WATCH 命令监视的键
    dict *watched_keys;         /* WATCHED keys for MULTI/EXEC CAS */
  	// 数据库号码
    int id;                     /* Database ID */
 	 // 数据库的键的平均 TTL ，统计信息
    long long avg_ttl;          /* Average TTL, just for stats */
    unsigned long expires_cursor; /* Cursor of the active expire cycle. */
    list *defrag_later;         /* List of key names to attempt to defrag one by one, gradually. */
} redisDb;
```

所有的服务器配置均定义在 `server` 结构体中

```c
struct redisServer {
    /* General */
    pid_t pid;                  /* Main process pid. */
    char *configfile;           /* Absolute config file path, or NULL */
    char *executable;           /* Absolute executable file path. */
    char **exec_argv;           /* Executable argv vector (copy). */
    int dynamic_hz;             /* Change hz value depending on # of clients. */
    int config_hz;              /* Configured HZ value. May be different than
                                   the actual 'hz' field value if dynamic-hz
                                   is enabled. */
    int hz;                     /* serverCron() calls frequency in hertz */
    redisDb *db;             //
    dict *commands;             /* Command table */
    dict *orig_commands;        /* Command table before command renaming. */
    aeEventLoop *el;
    _Atomic unsigned int lruclock; /* Clock for LRU eviction */
    int shutdown_asap;          /* SHUTDOWN needed ASAP */
  
  	//......
};
```



## 数据库键空间

因为 Redis 是一个键值对数据库（key-value pairs database）， 所以它的数据库本身也是一个字典（俗称 keyspace）：

- 字典的键是一个字符串对象。
- 字典的值则可以是包括字符串、列表、哈希表、集合或有序集在内的任意一种 Redis 类型对象。

在 `redisDb` 结构的 `dict` 属性中，保存着数据库的所有键值对数据。

`redis/src/dict.h` 是一个非阻塞哈希表的实现，包含字典的结构体定义

```c
typedef struct dict {
    dictType *type;   // 类型特定函数
    void *privdata;   // 私有数据
    dictht ht[2];     // 哈希表
    long rehashidx;  // rehash 索引,当 rehash 不在进行时，值为 -1
    unsigned long iterators; // 当前运行的迭代器的数量
} dict;
```

Redis 的字典使用哈希表作为其底层实现。dict 类型使用的两个指向哈希表的指针，其中 0 号哈希表（ht[0]）主要用于存储数据库的所有键值，而1号哈希表主要用于程序对 0 号哈希表进行 rehash 时使用。所以 Redis 中查找一个 key，其实就是对进行该 dict 结构中的 ht[0] 进行查找操作。


既然是哈希，那当多个键哈希之后为同一个值，也就是哈希碰撞的时候，怎么办呢？

Redis 解决哈希碰撞的方式 和 Java 中的 HashMap 类似，采取链表的方式来存储多个哈希碰撞的键。也就是说，当根据 key 的哈希值找到该列表后，如果列表的长度大于1，那么我们需要遍历该链表来找到我们所查找的 key。当然，一般情况下链表长度都为是1，所以时间复杂度可看作o(1)



## Redis 的 Key 是如何寻址的？

1. 当拿到一个key后， redis 先判断当前库的0号哈希表是否为空，即：if (dict->ht[0].size == 0)。如果为true直接返回NULL。
2. 判断该0号哈希表是否需要rehash，因为如果在进行rehash，那么两个表中者有可能存储该key。如果正在进行rehash，将调用一次_dictRehashStep方法，_dictRehashStep 用于对数据库字典、以及哈希键的字典进行被动 rehash，这里不作赘述。
3. 计算哈希表，根据当前字典与key进行哈希值的计算。
4. 根据哈希值与当前字典计算哈希表的索引值。
5. 根据索引值在哈希表中取出链表，遍历该链表找到key的位置。一般情况，该链表长度为1。
6. 当 ht[0] 查找完了之后，再进行了次rehash判断，如果未在rehashing，则直接结束，否则对ht[1]重复345步骤。

到此我们就找到了key在内存中的位置了。





> https://redisbook.readthedocs.io/en/latest/index.html
