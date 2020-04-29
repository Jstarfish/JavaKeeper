## 简单介绍

**units单位**

- 配置大小单位,开头定义了一些基本的度量单位，只支持bytes，不支持bit
- 对大小写不敏感



### INCLUDES包含

- 和我们的Struts2配置文件类似，可以通过includes包含，redis.conf可以作为总闸，包含其他



### GENERAL通用

- daemonize
- pidfile
- port
- tcp-backlog：

设置tcp的backlog，backlog其实是一个连接队列，backlog队列总和=未完成三次握手队列 + 已经完成三次握手队列。

在高并发环境下你需要一个高backlog值来避免慢客户端连接问题。注意Linux内核会将这个值减小到/proc/sys/net/core/somaxconn的值，所以需要确认增大somaxconn和tcp_max_syn_backlog两个值来达到想要的效果

- timeout
- bind 
- tcp-keepalive：单位为秒，如果设置为0，则不会进行Keepalive检测，建议设置成60 
- loglevel
- logfile
- syslog-enabled：是否把日志输出到syslog中
- syslog-ident：指定syslog里的日志标志
- syslog-facility：指定syslog设备，值可以是USER或LOCAL0-LOCAL7
- databases



### SNAPSHOTTING快照

- save    


RDB是整个内存的压缩过的Snapshot，RDB的数据结构，可以配置复合的快照触发条件，

默认

save 900 1             是1分钟内改了1万次， 	
save 300 10          或5分钟内改了10次，
save 60 10000     或15分钟内改了1次。

- 禁用   如果想禁用RDB持久化的策略，只要不设置任何save指令，或者给save传入一个空字符串参数也可以 **save** ""

 想要马上备份的话，在操作后输入 save 命令 就会直接备份到dump.rdb文件中

- stop-writes-on-bgsave-error：如果配置成no，表示你不在乎数据不一致或者有其他的手段发现和控制

-  rdbcompression：对于存储到磁盘中的快照，可以设置是否进行压缩存储。如果是的话，redis会采用LZF算法进行压缩。如果你不想消耗CPU来进行压缩的话，可以设置为关闭此功能

-  rdbchecksum：在存储快照后，还可以让redis使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能

- dbfilename

- dir：本地数据库存放目录



### REPLICATION**复制**

### SECURITY安全

访问密码的查看、设置和取消



**LIMITS限制**

- maxclients：设置redis同时可以与多少个客户端进行连接。默认情况下为10000个客户端。当你无法设置进程文件句柄限制时，redis会设置为当前的文件句柄限制值减去32，因为redis会为自身内部处理逻辑留一些句柄出来。如果达到了此限制，redis则会拒绝新的连接请求，并且向这些连接请求方发出“max number of clients reached”以作回应。

- maxmemory：设置redis可以使用的内存量。一旦到达内存使用上限，redis将会试图移除内部数据，移除规则可以通过**maxmemory-policy**来指定。如果redis无法根据移除规则来移除内存中的数据，或者设置了“不允许移除”，那么redis则会针对那些需要申请内存的指令返回错误信息，比如SET、LPUSH等。

但是对于无内存申请的指令，仍然会正常响应，比如GET等。如果你的redis是主redis（说明你的redis有从redis），那么在设置内存使用上限时，需要在系统中留出一些内存空间给同步队列缓存，只有在你设置的是“不移除”的情况下，才不用考虑这个因素



- maxmemory-policy：

1. **volatile-lru** -> remove the key with an expire set using an LRU algorithm 使用LRU算法移除key，只对设置了过期时间的键
2. **allkeys-lru** -> remove any key according to the LRU algorithm 使用LRU算法移除key
3. **volatile-random** -> remove a random key with an expire set 在过期集合中移除随机的key，只对设置了过期时间的键
4. **allkeys-random** -> remove a random key, any key 移除随机的key
5. **volatile-ttl** -> remove the key with the nearest expire time (minor TTL)  移除那些TTL值最小的key，即那些最近要过期的key
6. **noeviction** -> don't expire at all, just return an error on write operations  不进行移除。针对写操作，只是返回错误信息



- maxmemory-samples：设置样本数量，LRU算法和最小TTL算法都并非是精确的算法，而是估算值，所以你可以设置样本的大小，redis默认会检查这么多个key并选择其中LRU的那个



### APPEND ONLY MODE追加

- appendonly
- appendfilename
- appendfsync：

1. always：同步持久化 每次发生数据变更会被立即记录到磁盘  性能较差但数据完整性比较好
2. everysec：出厂默认推荐，异步操作，每秒记录   如果一秒内宕机，有数据丢失
3. no

- no-appendfsync-on-rewrite：重写时是否可以运用Appendfsync，用默认no即可，保证数据安全性。

- auto-aof-rewrite-min-size：设置重写的基准值

- auto-aof-rewrite-percentage：设置重写的基准值



## 常见配置redis.conf介绍

参数说明

redis.conf 配置项说明如下：

1. Redis默认不是以守护进程的方式运行，可以通过该配置项修改，使用yes启用守护进程

     **daemonize no**

2. 当Redis以守护进程方式运行时，Redis默认会把pid写入/var/run/redis.pid文件，可以通过pidfile指定

     **pidfile /var/run/redis.pid**

3. 指定Redis监听端口，默认端口为6379，作者在自己的一篇博文中解释了为什么选用6379作为默认端口，因为6379在手机按键上MERZ对应的号码，而MERZ取自意大利歌女Alessia Merz的名字

     **port 6379**

4. 绑定的主机地址

     **bind 127.0.0.1**

5.当 客户端闲置多长时间后关闭连接，如果指定为0，表示关闭该功能

​	  **timeout 300**

6. 指定日志记录级别，Redis总共支持四个级别：debug、verbose、notice、warning，默认为verbose

     **loglevel verbose**

7. 日志记录方式，默认为标准输出，如果配置Redis为守护进程方式运行，而这里又配置为日志记录方式为标准输出，则日志将会发送给/dev/null

     **logfile stdout**

8. 设置数据库的数量，默认数据库为0，可以使用SELECT <dbid>命令在连接上指定数据库id

     **databases 16**

9. 指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合  save <seconds> <changes>

  Redis默认配置文件中提供了三个条件：

​	  **save 900 1**

​	  **save 300 10**

​	  **save 60 10000**

  分别表示900秒（15分钟）内有1个更改，300秒（5分钟）内有10个更改以及60秒内有10000个更改。

 

10. 指定存储至本地数据库时是否压缩数据，默认为yes，Redis采用LZF压缩，如果为了节省CPU时间，可以关闭该选项，但会导致数据库文件变的巨大

      **rdbcompression yes**

11. 指定本地数据库文件名，默认值为dump.rdb

      **dbfilename dump.rdb**

12. 指定本地数据库存放目录

      **dir ./**

13. 设置当本机为slav服务时，设置master服务的IP地址及端口，在Redis启动时，它会自动从master进行数据同步

      **slaveof <masterip> <masterport>**

14. 当master服务设置了密码保护时，slav服务连接master的密码

      **masterauth <master-password>**

15. 设置Redis连接密码，如果配置了连接密码，客户端在连接Redis时需要通过AUTH <password>命令提供密码，默认关闭

      **requirepass foobared**

16. 设置同一时间最大客户端连接数，默认无限制，Redis可以同时打开的客户端连接数为Redis进程可以打开的最大文件描述符数，如果设置 maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis会关闭新的连接并向客户端返回max number of clients reached错误信息

      **maxclients 128**

17. 指定Redis最大内存限制，Redis在启动时会把数据加载到内存中，达到最大内存后，Redis会先尝试清除已到期或即将到期的Key，当此方法处理 后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。Redis新的vm机制，会把Key存放内存，Value会存放在swap区

      **maxmemory <bytes>**

18. 指定是否在每次更新操作后进行日志记录，Redis在默认情况下是异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为 redis本身同步数据文件是按上面save条件来同步的，所以有的数据会在一段时间内只存在于内存中。默认为no

      **appendonly no**

19. 指定更新日志文件名，默认为appendonly.aof

       **appendfilename appendonly.aof**

20. 指定更新日志条件，共有3个可选值： 

      no：表示等操作系统进行数据缓存同步到磁盘（快） 

      always：表示每次更新操作后手动调用fsync()将数据写到磁盘（慢，安全） 

      everysec：表示每秒同步一次（折衷，默认值）

      **appendfsync everysec**

21. 指定是否启用虚拟内存机制，默认值为no，简单的介绍一下，VM机制将数据分页存放，由Redis将访问量较少的页即冷数据swap到磁盘上，访问多的页面由磁盘自动换出到内存中（在后面的文章我会仔细分析Redis的VM机制）

       **vm-enabled no**

22. 虚拟内存文件路径，默认值为/tmp/redis.swap，不可多个Redis实例共享

       **vm-swap-file /tmp/redis.swap**

23. 将所有大于vm-max-memory的数据存入虚拟内存,无论vm-max-memory设置多小,所有索引数据都是内存存储的(Redis的索引数据 就是keys),也就是说,当vm-max-memory设置为0的时候,其实是所有value都存在于磁盘。默认值为0

       **vm-max-memory 0**

24. Redis swap文件分成了很多的page，一个对象可以保存在多个page上面，但一个page上不能被多个对象共享，vm-page-size是要根据存储的 数据大小来设定的，作者建议如果存储很多小对象，page大小最好设置为32或者64bytes；如果存储很大大对象，则可以使用更大的page，如果不 确定，就使用默认值

       **vm-page-size 32**

25. 设置swap文件中的page数量，由于页表（一种表示页面空闲或使用的bitmap）是在放在内存中的，，在磁盘上每8个pages将消耗1byte的内存。

       **vm-pages 134217728**

26. 设置访问swap文件的线程数,最好不要超过机器的核数,如果设置为0,那么所有对swap文件的操作都是串行的，可能会造成比较长时间的延迟。默认值为4

       **vm-max-threads 4**

27. 设置在向客户端应答时，是否把较小的包合并为一个包发送，默认为开启

      **glueoutputbuf yes**

28. 指定在超过一定的数量或者最大的元素超过某一临界值时，采用一种特殊的哈希算法

      **hash-max-zipmap-entries 64**

      **hash-max-zipmap-value 512**

29. 指定是否激活重置哈希，默认为开启（后面在介绍Redis的哈希算法时具体介绍）

      **activerehashing yes**

30. 指定包含其它的配置文件，可以在同一主机上多个Redis实例之间使用同一份配置文件，而同时各个实例又拥有自己的特定配置文件

      **include /path/to/local.conf**







## 配置文件实例

```
# Redis configuration file example

# Note on units: when memory size is needed, it is possible to specifiy
# it in the usual form of 1k 5GB 4M and so forth:
# 当你需要为某个配置项指定内存大小的时候，必须要带上单位， # 通常的格式就是 1k 5gb 4m 等酱紫：
#
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
#
# units are case insensitive so 1GB 1Gb 1gB are all the same.

# 单位是不区分大小写的，1GB 1Gb 1gB是一样的
# By default Redis does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.
# 默认情况下 redis 不是作为守护进程运行的，如果你想让它在后台运行，你就把它改成 yes。 # 当redis作为守护进程运行的时候，它会写一个 pid 到 /var/run/redis.pid 文件里面。

daemonize no

# When running daemonized, Redis writes a pid file in /var/run/redis.pid by
# default. You can specify a custom pid file location here.
# 当redis作为守护进程运行的时候，它会把 pid 默认写到 /var/run/redis.pid 文件里面， # 但是你可以在这里自己制定它的文件位置。

pidfile /var/run/redis.pid

# Accept connections on the specified port, default is 6379.
# If port 0 is specified Redis will not listen on a TCP socket.
# 监听端口号，默认为 6379，如果你设为 0 ，redis 将不在 socket 上监听任何客户端连接。

port 6379

# If you want you can bind a single interface, if the bind option is not
# specified all the interfaces will listen for incoming connections.
# 默认情况下，redis 在 server 上所有有效的网络接口上监听客户端连接。
# 你如果只想让它在一个网络接口上监听，那你就绑定一个IP或者多个IP。
# 示例，多个IP用空格隔开:
# bind 192.168.1.100 10.0.0.1

# bind 127.0.0.1

# Specify the path for the unix socket that will be used to listen for
# incoming connections. There is no default, so Redis will not listen
# on a unix socket when not specified.

# 指定 unix socket 的路径。
# unixsocket /tmp/redis.sock
# unixsocketperm 755

# Close the connection after a client is idle for N seconds (0 to disable)
# 指定在一个 client 空闲多少秒之后关闭连接（0 就是不管它）

timeout 0

# Set server verbosity to 'debug'
# it can be one of:
# debug (a lot of information, useful for development/testing)
# verbose (many rarely useful info, but not a mess like the debug level)
# notice (moderately verbose, what you want in production probably)
# warning (only very important / critical messages are logged)

# 定义日志级别。
# 可以是下面的这些值：
# debug (适用于开发或测试阶段)
# verbose (many rarely useful info, but not a mess like the debug level)
# notice (适用于生产环境)
# warning (仅仅一些重要的消息被记录)

loglevel verbose

# Specify the log file name. Also 'stdout' can be used to force
# Redis to log on the standard output. Note that if you use standard
# output for logging but daemonize, logs will be sent to /dev/null
# 指定日志文件的位置

logfile stdout

# To enable logging to the system logger, just set 'syslog-enabled' to yes,
# and optionally update the other syslog parameters to suit your needs.
# 要想把日志记录到系统日志，就把它改成 yes， # 也可以可选择性的更新其他的syslog 参数以达到你的要求
# syslog-enabled no

# Specify the syslog identity.
设置 syslog 的 identity。

# syslog-ident redis
# Specify the syslog facility.  Must be USER or between LOCAL0-LOCAL7.
# 设置 syslog 的 facility，必须是 USER 或者是 LOCAL0-LOCAL7 之间的值
# syslog-facility local0


# Set the number of databases. The default database is DB 0, you can select
# a different one on a per-connection basis using SELECT <dbid> where
# dbid is a number between 0 and 'databases'-1
# 设置数据库的数目。 # 默认数据库是 DB 0，你可以在每个连接上使用 select <dbid> 命令选择一个不同的数据库， # 但是 dbid 必须是一个介于 0 到 databasees - 1 之间的值

databases 16

################################ SNAPSHOTTING 快照 #################################
# Save the DB on disk:
#   save <seconds> <changes>
#   Will save the DB if both the given number of seconds and the given
#   number of write operations against the DB occurred.
#   In the example below the behaviour will be to save:
#   after 900 sec (15 min) if at least 1 key changed
#   after 300 sec (5 min) if at least 10 keys changed
#   after 60 sec if at least 10000 keys changed

#   下面的例子的意思是： #   900 秒内如果至少有 1 个 key 的值变化，则保存 #   300 秒内如果至少有 10 个 key 的值变化，则保存 #   60 秒内如果至少有 10000 个 key 的值变化，则保存

#   Note: you can disable saving at all commenting all the "save" lines.
#   注意：你可以注释掉所有的 save 行来停用保存功能。 #   也可以直接一个空字符串来实现停用： #   save ""

save 900 1

save 300 10

save 60 10000

# Compress string objects using LZF when dump .rdb databases?
# For default that's set to 'yes' as it's almost always a win.
# If you want to save some CPU in the saving child set it to 'no' but
# the dataset will likely be bigger if you have compressible values or keys.

# 是否在 dump .rdb 数据库的时候使用 LZF 压缩字符串 # 默认都设为 yes # 如果你希望保存子进程节省点 cpu ，你就设置它为 no ， # 不过这个数据集可能就会比较大

rdbcompression yes

# The filename where to dump the DB
# 设置 dump 的文件位置
dbfilename dump.rdb

# The working directory.
# The DB will be written inside this directory, with the filename specified
# above using the 'dbfilename' configuration directive.
# 
# Also the Append Only File will be created inside this directory.
# Note that you must specify a directory here, not a file name.

# 工作目录 # 例如上面的 dbfilename 只指定了文件名， # 但是它会写入到这个目录下。这个配置项一定是个目录，而不能是文件名

dir ./

################################# REPLICATION  主从复制#################################

# Master-Slave replication. Use slaveof to make a Redis instance a copy of
# another Redis server. Note that the configuration is local to the slave
# so for example it is possible to configure the slave to save the DB with a
# different interval, or to listen to another port, and so on.
# 主从复制。使用 slaveof 来让一个 redis 实例成为另一个reids 实例的副本。 # 注意这个只需要在 slave 上配置。

# slaveof <masterip> <masterport>

# If the master is password protected (using the "requirepass" configuration
# directive below) it is possible to tell the slave to authenticate before
# starting the replication synchronization process, otherwise the master will
# refuse the slave request.
# 如果 master 需要密码认证，就在这里设置
# masterauth <master-password>

# When a slave lost the connection with the master, or when the replication
# is still in progress, the slave can act in two different ways:
#
# 1) if slave-serve-stale-data is set to 'yes' (the default) the slave will
#    still reply to client requests, possibly with out of data data, or the
#    data set may just be empty if this is the first synchronization.

# 2) if slave-serve-stale data is set to 'no' the slave will reply with
#    an error "SYNC with master in progress" to all the kind of commands

#    but to INFO and SLAVEOF.
# 当一个 slave 与 master 失去联系，或者复制正在进行的时候，
# slave 可能会有两种表现：
#
# 1) 如果为 yes ，slave 仍然会应答客户端请求，但返回的数据可能是过时，
#    或者数据可能是空的在第一次同步的时候
# 2) 如果为 no ，在你执行除了 info he salveof 之外的其他命令时，
#    slave 都将返回一个 "SYNC with master in progress" 的错误，

slave-serve-stale-data yes

# Slaves send PINGs to server in a predefined interval. It's possible to change
# this interval with the repl_ping_slave_period option. The default value is 10
# seconds.
# repl-ping-slave-period 10

# The following option sets a timeout for both Bulk transfer I/O timeout and
# master data or ping response timeout. The default value is 60 seconds.
# It is important to make sure that this value is greater than the value

# specified for repl-ping-slave-period otherwise a timeout will be detected
# every time there is low traffic between the master and the slave.

# 设置主从复制过期时间

# repl-timeout 60

################################## SECURITY  安全 ###################################

# Require clients to issue AUTH <PASSWORD> before processing any other
# commands.  This might be useful in environments in which you do not trust
# others with access to the host running redis-server.
# This should stay commented out for backward compatibility and because most

# people do not need auth (e.g. they run their own servers).
# Warning: since Redis is pretty fast an outside user can try up to

# 150k passwords per second against a good box. This means that you should
# use a very strong password otherwise it will be very easy to break.

# 设置认证密码

# requirepass foobared

# Command renaming.
# It is possilbe to change the name of dangerous commands in a shared
# environment. For instance the CONFIG command may be renamed into something
# of hard to guess so that it will be still available for internal-use
# tools but not available for general clients.
# Example:
# rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52

#
# It is also possilbe to completely kill a command renaming it into
# an empty string:

# rename-command CONFIG ""


################################### LIMITS  限制 ####################################


# Set the max number of connected clients at the same time. By default there
# is no limit, and it's up to the number of file descriptors the Redis process
# is able to open. The special value '0' means no limits.
# Once the limit is reached Redis will close all the new connections sending
# an error 'max number of clients reached'.
# 一旦达到最大限制，redis 将关闭所有的新连接 # 并发送一个‘max number of clients reached’的错误。
# maxclients 128

# Don't use more memory than the specified amount of bytes.
# When the memory limit is reached Redis will try to remove keys with an
# EXPIRE set. It will try to start freeing keys that are going to expire
# in little time and preserve keys with a longer time to live.
# Redis will also try to remove objects from free lists if possible.


 # 最大使用内存

# maxmemory <bytes>

# MAXMEMORY POLICY: how Redis will select what to remove when maxmemory
# is reached? You can select among five behavior:
# volatile-lru -> remove the key with an expire set using an LRU algorithm
# allkeys-lru -> remove any key accordingly to the LRU algorithm
# volatile-random -> remove a random key with an expire set
# allkeys->random -> remove a random key, any key
# volatile-ttl -> remove the key with the nearest expire time (minor TTL)
# maxmemory-samples 3



############################## APPEND ONLY MODE ###############################



# By default Redis asynchronously dumps the dataset on disk. If you can live
# with the idea that the latest records will be lost if something like a crash
# happens this is the preferred way to run Redis. If instead you care a lot
# about your data and don't want to that a single record can get lost you should
# enable the append only mode: when this mode is enabled Redis will append
# every write operation received in the file appendonly.aof. This file will
# be read on startup in order to rebuild the full dataset in memory.
# Note that you can have both the async dumps and the append only file if you
# like (you have to comment the "save" statements above to disable the dumps).
# Still if append only mode is enabled Redis will load the data from the
# log file at startup ignoring the dump.rdb file.
#
# IMPORTANT: Check the BGREWRITEAOF to check how to rewrite the append
# log file in background when it gets too big.

appendonly no

# The name of the append only file (default: "appendonly.aof")
# appendfilename appendonly.aof
# The fsync() call tells the Operating System to actually write data on disk
# instead to wait for more data in the output buffer. Some OS will really flush 
# data on disk, some other OS will just try to do it ASAP.
#
# Redis supports three different modes:
# no: don't fsync, just let the OS flush the data when it wants. Faster.
# always: fsync after every write to the append only log . Slow, Safest.
# everysec: fsync only if one second passed since the last fsync. Compromise
# The default is "everysec" that's usually the right compromise between
# speed and data safety. It's up to you to understand if you can relax this to
# "no" that will will let the operating system flush the output buffer when
# it wants, for better performances (but if you can live with the idea of
# some data loss consider the default persistence mode that's snapshotting),
# or on the contrary, use "always" that's very slow but a bit safer than
# everysec.
#
# If unsure, use "everysec".

# appendfsync always

appendfsync everysec

# appendfsync no


# If you have latency problems turn this to "yes". Otherwise leave it as
# "no" that is the safest pick from the point of view of durability.

no-appendfsync-on-rewrite no

auto-aof-rewrite-percentage 100

auto-aof-rewrite-min-size 64mb



################################## SLOW LOG ###################################

# The Redis Slow Log is a system to log queries that exceeded a specified
# execution time. The execution time does not include the I/O operations
# like talking with the client, sending the reply and so forth,
# but just the time needed to actually execute the command (this is the only
# stage of command execution where the thread is blocked and can not serve
# other requests in the meantime).
# 
# You can configure the slow log with two parameters: one tells Redis
# what is the execution time, in microseconds, to exceed in order for the
# command to get logged, and the other parameter is the length of the
# slow log. When a new command is logged the oldest one is removed from the
# queue of logged commands
# The following time is expressed in microseconds, so 1000000 is equivalent
# to one second. Note that a negative number disables the slow log, while
# a value of zero forces the logging of every command.

slowlog-log-slower-than 10000


# There is no limit to this length. Just be aware that it will consume memory.
# You can reclaim memory used by the slow log with SLOWLOG RESET.

slowlog-max-len 1024


################################ VIRTUAL MEMORY ###############################

### WARNING! Virtual Memory is deprecated in Redis 2.4
### The use of Virtual Memory is strongly discouraged.
### WARNING! Virtual Memory is deprecated in Redis 2.4
### The use of Virtual Memory is strongly discouraged.

# Virtual Memory allows Redis to work with datasets bigger than the actual
# amount of RAM needed to hold the whole dataset in memory.
# In order to do so very used keys are taken in memory while the other keys
# are swapped into a swap file, similarly to what operating systems do
# with memory pages.
# To enable VM just set 'vm-enabled' to yes, and set the following three
# VM parameters accordingly to your needs.

vm-enabled no

# vm-enabled yes
# This is the path of the Redis swap file. As you can guess, swap files
# can't be shared by different Redis instances, so make sure to use a swap
# file for every redis process you are running. Redis will complain if the
# swap file is already in use.
# The best kind of storage for the Redis swap file (that's accessed at random) 
# is a Solid State Disk (SSD).
# *** WARNING *** if you are using a shared hosting the default of putting
# the swap file under /tmp is not secure. Create a dir with access granted
# only to Redis user and configure Redis to create the swap file there.

vm-swap-file /tmp/redis.swap


# vm-max-memory configures the VM to use at max the specified amount of
# RAM. Everything that deos not fit will be swapped on disk *if* possible, that
# is, if there is still enough contiguous space in the swap file.
# With vm-max-memory 0 the system will swap everything it can. Not a good
# default, just specify the max amount of RAM you can in bytes, but it's
# better to leave some margin. For instance specify an amount of RAM
# that's more or less between 60 and 80% of your free RAM.

vm-max-memory 0

# Redis swap files is split into pages. An object can be saved using multiple
# contiguous pages, but pages can't be shared between different objects.
# So if your page is too big, small objects swapped out on disk will waste
# a lot of space. If you page is too small, there is less space in the swap
# file (assuming you configured the same number of total swap file pages).
# If you use a lot of small objects, use a page size of 64 or 32 bytes.
# If you use a lot of big objects, use a bigger page size.
# If unsure, use the default :)

vm-page-size 32

# Number of total memory pages in the swap file.
# Given that the page table (a bitmap of free/used pages) is taken in memory,
# every 8 pages on disk will consume 1 byte of RAM.
# The total swap size is vm-page-size * vm-pages
# With the default of 32-bytes memory pages and 134217728 pages Redis will
# use a 4 GB swap file, that will use 16 MB of RAM for the page table.

# It's better to use the smallest acceptable value for your application,
# but the default is large in order to work in most conditions.

vm-pages 134217728

# Max number of VM I/O threads running at the same time.
# This threads are used to read/write data from/to swap file, since they
# also encode and decode objects from disk to memory or the reverse, a bigger
# number of threads can help with big objects even if they can't help with
# I/O itself as the physical device may not be able to couple with many
# reads/writes operations at the same time.
#
# The special value of 0 turn off threaded I/O and enables the blocking
# Virtual Memory implementation.

vm-max-threads 4

############################### ADVANCED CONFIG ###############################

# Hashes are encoded in a special way (much more memory efficient) when they
# have at max a given numer of elements, and the biggest element does not
# exceed a given threshold. You can configure this limits with the following
# configuration directives.

hash-max-zipmap-entries 512

hash-max-zipmap-value 64

# Similarly to hashes, small lists are also encoded in a special way in order
# to save a lot of space. The special representation is only used when
# you are under the following limits:

list-max-ziplist-entries 512

list-max-ziplist-value 64

# Sets have a special encoding in just one case: when a set is composed
# of just strings that happens to be integers in radix 10 in the range
# of 64 bit signed integers.
# The following configuration setting sets the limit in the size of the
# set in order to use this special memory saving encoding.

set-max-intset-entries 512

# Similarly to hashes and lists, sorted sets are also specially encoded in
# order to save a lot of space. This encoding is only used when the length and
# elements of a sorted set are below the following limits:

zset-max-ziplist-entries 128

zset-max-ziplist-value 64

# Active rehashing uses 1 millisecond every 100 milliseconds of CPU time in
# order to help rehashing the main Redis hash table (the one mapping top-level
# keys to values). The hash table implementation redis uses (see dict.c)
# performs a lazy rehashing: the more operation you run into an hash table
# that is rhashing, the more rehashing "steps" are performed, so if the
# server is idle the rehashing is never complete and some more memory is used
# by the hash table.


# The default is to use this millisecond 10 times every second in order to
# active rehashing the main dictionaries, freeing memory when possible.
#

# If unsure:
# use "activerehashing no" if you have hard latency requirements and it is
# not a good thing in your environment that Redis can reply form time to time
# to queries with 2 milliseconds delay.

#
# use "activerehashing yes" if you don't have such hard requirements but
# want to free memory asap when possible.

activerehashing yes


################################## INCLUDES ###################################


# Include one or more other config files here.  This is useful if you
# have a standard template that goes to all redis server but also need
# to customize a few per-server settings.  Include files can include
# other files, so use this wisely.
# 假如说你有一个可用于所有的 redis server 的标准配置模板，
# 但针对某些 server 又需要一些个性化的设置，
# 你可以使用 include 来包含一些其他的配置文件，这对你来说是非常有用的。
#
# 但是要注意哦，include 是不能被 config rewrite 命令改写的
# 由于 redis 总是以最后的加工线作为一个配置指令值，所以你最好是把 include 放在这个文件的最前面，
# 以避免在运行时覆盖配置的改变，相反，你就把它放在后面（外国人真啰嗦）。

# include /path/to/local.conf
# include /path/to/other.conf
```