---
title: MySQL  是怎么想的，搞这么多种日志
date: 2022-08-01
tags: 
 - MySQL
 - MySQL  日志
categories: MySQL
---

![](https://img.starfish.ink/mysql/banner-mysql-log.png)

> Hello，我是海星。
>
> 不管是 DB 还是其他组件，很多看似奇怪的问题，答案往往就藏在日志里。
>
> 这一篇聊聊 MySQL 的一些日志文件

MySQL日志文件：用来记录 MySQL 实例对某种条件做出响应时写入的文件，大概可分为：通用查询日志、慢查询日志、错误日志、二进制日志、中继日志、重做日志和回滚日志。

他们都有什么作用和关联，我们一起捋一捋（基于 InnoDB）

![](https://img.starfish.ink/mysql/logs.png)

我们从一条 SQL 语句说起吧

```mysql
UPDATE fish SET type = 2 WHERE name = 'starfish';
```

先说个不怎么被提到的，通用查询日志

## 一、通用查询日志(general log)

通用查询日志记录了所有用户的连接开始时间和截止时间，以及发给 MySQL 数据库服务器的所有 SQL 指令。当我们的数据发生异常时，开启通用查询日志，还原操作时的具体场景，可以帮助我们准确定位问题。

```mysql
mysql> SHOW VARIABLES LIKE '%general%';
+------------------+-------------------------------------------------+
| Variable_name    | Value                                           |
+------------------+-------------------------------------------------+
| general_log      | OFF                                             |
| general_log_file | /usr/local/mysql/data/starfishdeMacBook-Pro.log |
+------------------+-------------------------------------------------+
2 rows in set (0.00 sec)
```

通用日志默认是关闭的，我们开启后看下效果

```mysql
SET GLOBAL general_log = 'ON'
## SET @@gobal.generl_log_file = /usr/local/mysql/data/starfishdeMacBook-Pro.log
```

客户端执行 update 指令，查看日志目录如下，这玩意会记录从数据库连接到终止之间的所有记录，而且都是文本数据，太占资源了，所以一般没有开启的。

![](https://img.starfish.ink/mysql/generl_log.png)



## 二、重做日志(redo log)

了解这块知识，我们先要知道这么几个前置知识点，先看下官网的 InnoDB 架构图，有个大概印象

![](https://img.starfish.ink/mysql/innodb-architecture.png)

> #### 什么是 随机 IO 和 顺序 IO 
>
> 磁盘读写数据的两种方式。随机 IO 需要先找到地址，再读写数据，每次拿到的地址都是随机的。比如 MySQL 执行增删改操作时。就像送外卖，每一单送的地址都不一样，到处跑，效率极低。而顺序 IO，由于地址是连贯的，找到地址后，一次可以读写许多数据，效率比较高，比如在末尾追加日志这种。就像送外卖，所有的单子地址都在一栋楼，一下可以送很多，效率很高。

> ####  什么是数据页？
>
> MySQL 的 InnoDB 存储引擎以 Data Page（数据页）作为磁盘和内存之间交互的基本单位，他的大小一般为默认值 16K。
>
> 从数据页的作用来分，可以分为 Free Page（空闲页）、Clean Page（干净页）、Dirty Page（脏页）；
>
> - **当内存数据页 和 磁盘数据页内容不一致的时候，这个内存页 就为 “脏页”**。将内存中的数据同步到磁盘中的这个过程就被称为**“刷脏”**
> - **内存数据页写入磁盘后，内存数据页 和 磁盘数据页内容一致，称之为 “干净页”**
>
> 从类型来分的话，还可以分成存放 UNDO 日志的页、存放 INODE 信息的页、存放表空间头部信息的页等。

> #### 什么是缓冲池 | buffer pool？
>
> 关系型数据库的特点就是需要对磁盘中大量的数据进行存取，所以有时候也被叫做基于磁盘的数据库。正是因为数据库需要频繁对磁盘进行 IO 操作，为了改善因为直接读写磁盘导致的 IO 性能问题，所以引入了缓冲池。
>
> 不过不论是什么类型的页面，每当我们从页面中读取或写入数据时，都必须先将其从硬盘上加载到内存中的`buffer pool`中（也就是说内存中的页面其实就是硬盘中页面的一个副本），然后才能对内存中页面进行读取或写入。如果要修改内存中的页面，为了减少磁盘 I/O，修改后的页面并不立即同步到磁盘，而是作为`脏页`继续呆在内存中，等待后续合适时机将其刷新到硬盘（一般是有后台线程异步刷新），将该页刷到磁盘的操作称为 刷脏页 （本句是重点，后面要吃）。
>
> > #### 内存缓冲区
>>
> > InnoDB 存储引擎是基于磁盘存储的，并将其中的记录按照页的方式进行管理。由于 CPU 速度与磁盘速度之间的鸿沟，基于磁盘的数据库系统通常使用内存缓冲区技术来提高数据库的整体性能。
> >
> > ##### Page Cache
> >
> > InnoDB 会将读取过的页缓存在内存中，并采取最近最少使用（Least Recently Used，LRU） 算法将缓冲池作为列表进行管理，以增加缓存命中率。
> >
> > InnoDB 对 LRU 算法进行了一定的改进，执行**中点插入策略**，默认前 5/8 为`New Sublist`，存储经常被使用的热点页，后 3/8 为`Old Sublist`。新读入的 page 默认被加在`old Sublist`的头部，如果在运行过程中 `old Sublist` 的数据被访问到了，那么这个页就会被移动到 `New Sublist` 的头部。
> >
> > ![](https://img.starfish.ink/mysql/lru-buffer-pool.png)
> >
> > 每当 InnoDB 缓存新的数据页时，会优先从 `Free List` 中查找空余的缓存区域，如果不存在，那么就需要从 `LRU List` 淘汰一定的尾部节点。不管数据页位于 `New Sublist` 还是 `Old Sublist`，如果没有被访问到，那么最终都会被移动到 `LRU List` 的尾部作为牺牲者。
> >
> > ##### Change Buffer
> >
> > Change Buffer 用于记录数据的修改，因为 InnoDB 的辅助索引不同于聚集索引的顺序插入，如果每次修改二级索引都直接写入磁盘，则会有大量频繁的随机 IO。
> >
> > InnoDB 从 1.0.x 版本开始引入了 Change Buffer，主要目的是将对**非唯一辅助索引**页的操作缓存下来，如果辅助索引页已经在缓冲区了，则直接修改；如果不在，则先将修改保存到 Change Buffer。当对应辅助索引页读取到缓冲区时，才将 Change Buffer 的数据合并到真正的辅助索引页中，以此减少辅助索引的随机 IO，并达到操作合并的效果。
> >
> > ![](https://img.starfish.ink/mysql/innodb-change-buffer.png)
> >
> > 在 MySQL 5.5 之前 Change Buffer 其实叫 Insert Buffer，最初只支持 INSERT 操作的缓存，随着支持操作类型的增加，改名为 Change Buffer，现在 InnoDB 存储引擎可以对 INSERT、DELETE、UPDATE 都进行缓冲，对应着：Insert Buffer、Delete Buffer、Purge buffer。
> >
> > ##### Double Write Buffer
> >
> > 当发生数据库宕机时，可能存储引擎正在写入某个页到表中，而这个页只写了一部分，比如 16KB 的页，只写了前 4KB，之后就发生了宕机。虽然可以通过日志进行数据恢复，但是如果这个页本身已经发生了损坏，再对其进行重新写入是没有意义的。因此 InnoDB 引入 Double Write Buffer 解决数据页的半写问题。
> >
> > Double Write Buffer 大小默认为 2M，即 128 个数据页。其中分为两部分，一部分留给`batch write`，提供批量刷新脏页的操作，另一部分是`single page write`，留给用户线程发起的单页刷脏操作。
> >
> > 在对缓冲池的脏页进行刷新时，脏页并不是直接写到磁盘，而是会通过`memcpy()`函数将脏页先复制到内存中的 Double Write Buffer 中，如果 Double Write Buffer 写满了，那么就会调用`fsync()`系统调用，一次性将 Double Write Buffer 所有的数据写入到磁盘中，因为这个过程是顺序写入，开销几乎可以忽略。在确保写入成功后，再使用异步 IO 把各个数据页写回自己的表空间中。

### 2.1 为什么需要 redo log

好了，我们步入主题 redo log，这里比较喜欢丁奇老师的比喻

> 酒店掌柜有一个粉板，专门用来记录客人的赊账记录。如果赊账的人不多，可以把顾客名和账目写在板上。但如果赊账的人多了，粉板总会有记不下的时候，这个时候掌柜一定还有一个专门记录赊账的账本。
>
> 如果有人要赊账或者还账的话，掌柜一般有两种做法：
>
> - 一种做法是直接把账本翻出来，把这次赊的账加上去或者扣除掉；
> - 另一种做法是先在粉板上记下这次的账，等打烊以后再把账本翻出来核算。
>
> 在生意红火柜台很忙时，掌柜一定会选择后者，因为前者操作实在是太麻烦了。首先，你得找到这个人的赊账总额那条记录。你想想，密密麻麻几十页，掌柜要找到那个名字，可能还得带上老花镜慢慢找，找到之后再拿出算盘计算，最后再将结果写回到账本上。
>
> 这整个过程想想都麻烦。相比之下，还是先在粉板上记一下方便。你想想，如果掌柜没有粉板的帮助，每次记账都得翻账本，效率是不是低得让人难以忍受？
>

- 同样，在 MySQL 里也有这个问题，Innodb 是以`页`为单位进行磁盘交互的，而一个事务很可能只修改一个数据页里面的几个字节，这个时候将完整的数据页刷到磁盘的话，整个过程 IO 成本、查找成本都很高。

- 一个事务可能涉及修改多个数据页，并且这些数据页在物理上并不连续，使用随机 IO 写入性能太差！

这样的性能问题，我们是不能忍的，前面我们讲到数据页在缓冲池中被修改会变成脏页。如果这时宕机，脏页就会失效，这就导致我们修改的数据丢失了，也就无法保证事务的**<mark>持久性</mark>**。

为了解决这些问题，MySQL 的设计者就用了类似酒店掌柜粉板的思路，设计了`redo log`，**具体来说就是只记录事务对数据页做了哪些修改**，这样就能完美地解决性能问题了(相对而言文件更小并且是顺序 IO)。

而粉板和账本配合的整个过程，其实就类似 MySQL 里经常说到的 **WAL 技术**（Write-Ahead Loging），它的关键点就是**先写日志，再写磁盘**，也就是先写粉板，等不忙的时候再写账本。这又解决了我们的持久性问题。

具体来说，当有一条记录需要更新的时候，InnoDB 引擎就会先把记录写到 `redo log`（粉板）里面，并更新内存，这个时候更新就算完成了。同时，InnoDB 引擎会在适当的时候，将这个操作记录更新到磁盘里面，而这个更新往往是在系统比较空闲的时候做，这就像打烊以后掌柜做的事。

> DBA 口中的日志先行说的就是这个 WAL 技术。
>
> 记录下对磁盘中某某页某某位置数据的修改结果的 redo log，这种日志被称为**物理日志**，可以节省很多磁盘空间。
>
> 最开始看到的通用查询日志，记录了所有数据库的操作，我们叫**逻辑日志**，还有下边会说的 binlog、undo log 也都属于逻辑日志。



### 2.2 组织 redo log 

#### 「redo log 结构」

MySQL redo日志是一组日志文件，在 MySQL 8.0.30  版本中，MySQL 会生成 32 个 redo log 文件（老版本默认 2 个）

![](https://img.starfish.ink/mysql/ib_redo-file.png)

> [`innodb_log_file_size`](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_log_file_size) and [`innodb_log_files_in_group`](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_log_files_in_group) are deprecated in MySQL 8.0.30. These variables are superseded by [`innodb_redo_log_capacity`](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_redo_log_capacity). For more information, see [Section 15.6.5, “Redo Log”](https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log.html).

为了应对 InnoDB 各种各样不同的需求，到 MySQL 8.0 为止，已经有多达 65 种的 REDO 记录，每种都不太一样，我们看下比较通用的结构了解了解就 OK（主要有作用于 Page，作用于 Space 以及提供额外信息的 Logic 类型的三大类）

![](https://img.starfish.ink/mysql/redolog-content.png)

比如 `MLOG_WRITE_STRING` 类型的 REDO 表示写入一串数据，但是因为不能确定写入的数据占多少字节，所以需要在日志结构中添加一个长度字段来表示写入了多长的数据。

除此之外，还有一些复杂的 REDO 类型来记录一些复杂的操作。例如插入一条数据，并不仅仅只是在数据页中插入一条数据，还可能会导致数据页和索引页的分裂，可能要修改数据页中的头信息（Page Header）、目录槽信息（Page Directory）等等。

#### 「Mini-Transaction」

一个事务中可能有多个增删改的 SQL语句，而一个 SQL 语句在执行过程中可能修改若干个页面，会有多个操作。

> 例如一个 INSERT 语句：
>
> - 如果表没有主键，会去更新内存中的 `Max Row ID` 属性，并在其值为 `256` 的倍数时，将其刷新到`系统表空间`的页号为 `7` 的`Max Row ID `属性处。
> - 接着向聚簇索引插入数据，这个过程要根据索引找到要插入的缓存页位置，向数据页插入记录。这个过程还可能会涉及数据页和索引页的分裂，那就会增加或修改一些缓存页，移动页中的记录。
> - 如果有二级索引，还会向二级索引中插入记录。
>
> 最后还可能要改动一些系统页面，比如要修改各种段、区的统计信息，各种链表的统计信息等等。

所以 InnoDB 将执行语句的过程中产生的 `redo log` 划分成了若干个不可分割的组，一组 `redo log` 就是对底层页面的一次原子访问，这个原子访问也称为 `Mini-Transaction`，简称 **mtr**。一个 `mtr` 就包含一组 `redo log`，在崩溃恢复时这一组 `redo log` 就是一个不可分割的整体。

#### 「redo log block」

`redo log` 并不是一条一条写入磁盘的日志文件中的，而且一个原子操作的 `mtr` 包含一组 `redo log`，一条一条的写就无法保证写磁盘的原子性了。

磁盘是块设备，InnoDB 中也用 Block 的概念来读写数据，设计了一个 `redo log block` 的数据结构，称为重做日志块（`block`），重做日志块跟缓存页有点类似，只不过日志块记录的是一条条 redo log。

`S_FILE_LOG_BLOCK_SIZE` 等于磁盘扇区的大小 512B，每次 IO 读写的最小单位都是一个 Block。

一个 `redo log block` 固定 `512字节` 大小，由三个部分组成：

- 12 字节的**Block Header**，主要记录一些额外的信息，包括文件信息、log 版本、lsn 等
- Block 中剩余的中间 498 个字节就是 REDO 真正内容的存放位置

- Block 末尾是 4 字节的 **Block Tailer**，记录当前 Block 的 Checksum，通过这个值，读取 Log 时可以明确 Block 数据有没有被完整写盘。

#### 「redo log 组成」

前置知识点说了，缓冲池有提效的功效，所以 redo log 也不是直接干到日志文件（磁盘中），而是有个类似缓冲池的 `redo log buffer`（内存中），在写 redo log 时会先写 `redo log buffer`

> 用户态下的缓冲区数据是无法直接写入磁盘的。因为中间必须经过操作系统的内核空间缓冲区（OS Buffer）。

写入 `redo log buffer` 后，再写入 `OS Buffer`，然后操作系统调用 `fsync()` 函数将日志刷到磁盘。

![](https://img.starfish.ink/mysql/redolog-buf.png)

> 扩展点：
>
> - redo log buffer 里面的内容，既然是在操作系统调用 fsync() 函数持久化到磁盘的，那如果事务执行期间 MySQL 发生异常重启，那这部分日志就丢了。由于事务并没有提交，所以这时日志丢了也不会有损失。
> - fsync() 的时机不是我们控制的，那就有可能在事务还没提交的时候，redo log buffer 中的部分日志被持久化到磁盘中
>
> 所以，redo log 是存在不同状态的
>
> 这三种状态分别是：
>
> 1. 存在 redo log buffer 中，物理上是在 MySQL 进程内存中；
> 2. 写到磁盘 (write)，但是没有持久化（fsync)，物理上是在文件系统的 page cache 里面；
> 3. 持久化到磁盘，对应的是 hard disk。
>
> ![](https://img.starfish.ink/mysql/redo-status.png)
>
> 日志写到 redo log buffer 是很快的，wirte 到 page cache 也差不多，但是持久化到磁盘的速度就慢多了。
>
> 为了控制 redo log 的写入策略，InnoDB 提供了 `innodb_flush_log_at_trx_commit` 参数，它有三种可能取值（刷盘策略还会说到）：
>
> 1. 设置为 0 的时候，表示每次事务提交时都只是把 redo log 留在 redo log buffer 中 ;
> 2. 设置为 1 的时候，表示每次事务提交时都将 redo log 直接持久化到磁盘；
> 3. 设置为 2 的时候，表示每次事务提交时都只是把 redo log 写到 page cache。
>
> InnoDB 有一个后台线程，每隔 1 秒，就会把 redo log buffer 中的日志，调用 write 写到文件系统的 page cache，然后调用 fsync 持久化到磁盘。
>
> 注意，事务执行中间过程的 redo log 也是直接写在 redo log buffer 中的，这些 redo log 也会被后台线程一起持久化到磁盘。也就是说，一个没有提交的事务的 redo log，也是可能已经持久化到磁盘的。

写完 redo log buffer 后，我们就要顺序追加日志了，可是每次往哪里写，肯定需要个标识的，类似 offset，小结一下接着聊。



#### 「redo 结构小结」

我们把这几个 redo 内容串起来，其实就是 redo log 有 32 个文件，每个文件以 Block 为单位划分，多个文件首尾相连顺序写入 REDO 内容，Redo 又按不同类型有不同内容。

一个 `mtr` 中的 redo log 实际上是先写到 redo log buffer，然后再”找机会“ 将一个个 mtr 的日志记录复制到`block`中，最后在一些时机将`block`刷新到磁盘日志文件中。

redo 文件结构大致是下图这样：

![](https://img.starfish.ink/mysql/redolog-flow.png)



### 2.3 写入 redo log

刚才说了，会找机会将 block 刷盘，那到底是什么时候呢？

#### 刷盘时机

写入到日志文件（刷新到磁盘）的时机有这么 3 种：

- MySQL 正常关闭时
- 每秒刷新一次
- redo log buffer 剩余空间小于 1/2 时（内存不够用了，要先将脏页写到磁盘）

每次事务提交时都将缓存在 redo log buffer 里的 redo log 直接持久化到磁盘，这个策略可由 `innodb_flush_log_at_trx_commit` 参数控制

#### 刷盘策略

`innodb_flush_log_at_trx_commit` 的值可以是 1、2、0

- 当设置该值为 1 时，每次事务提交都要做一次 fsync，这是最安全的配置，即使宕机也不会丢失事务，这是默认值；

- 当设置为 2 时，则在事务提交时只做 write 操作，只保证写到系统的 page cache，因此实例 crash 不会丢失事务，但宕机则可能丢失事务；

- 当设置为 0 时，事务提交不会触发 redo 写操作，而是留给后台线程每秒一次的刷盘操作，因此实例 crash 最多丢失 1 秒钟内的事务

  ![](https://img.starfish.ink/mysql/redolog-flush.png)
  

#### 日志逻辑序列号（log sequence number，LSN）

刷盘时机、刷盘策略看着好像挺合适，如果刷盘还没结束，服务器 GG（宕机）了呢？ 知道你不慌，redo 可以用来保证持久性嘛~

重启服务后，我们肯定需要通过 redo 重放来恢复数据，但是从哪开始恢复呢？

为解决这个问题 InnoDB 为 redo log 记录了序列号，这被称为 LSN（Log Sequence Number），可以理解为偏移量。

在 MySQL Innodb 引擎中 LSN 是一个非常重要的概念，表示从日志记录创建开始到特定的日志记录已经写入的字节数，LSN 的计算是包含每个 BLOCK 的头和尾字段的。

在 InnoDB 的日志系统中，LSN 无处不在，它既用于表示修改脏页时的日志序号，也用于记录 checkpoint，通过 LSN，可以具体的定位到其在 redo log 文件中的位置。

> 那如何由一个给定 LSN 的日志，在日志文件中找到它存储的位置的偏移量并能正确的读出来呢。所有的日志文件要属于日志组，而在 log_group_t 里的 lsn 和 lsn_offset 字段已经记录了某个日志 lsn 和其存放在文件内的偏移量之间的对应关系。我们可以利用存储在 group 内的 lsn 和给定 lsn 之间的相对位置，来计算出给定 lsn 在文件中的存储位置。(具体怎么算我们先不讨论)

LSN 是单调递增的，用来对应 redo log 的一个个写入点。每次写入长度为 length 的 redo log， LSN 的值就会加上 length。越新的日志 LSN 越大。

InnoDB 用检查点（ checkpoint_lsn ）指示未被刷盘的数据从这里开始，用 lsn 指示下一个应该被写入日志的位置。不过由于有 redo log buffer 的缘故，实际被写入磁盘的位置往往比 lsn 要小。

redo log 采用逻辑环形结构来复用空间（循环写入），这种环形结构一般需要几个指针去配合使用

![](https://img.starfish.ink/mysql/redolog-lsn.png)



如果 lsn 追上了 checkpoint，就意味着 **redo log 文件满了，这时 MySQL 不能再执行新的更新操作，也就是说 MySQL 会被阻塞**（*所以针对并发量大的系统，适当设置 redo log 的文件大小非常重要*），此时**会停下来将 Buffer Pool 中的脏页刷新到磁盘中，然后标记 redo log 哪些记录可以被擦除，接着对旧的 redo log 记录进行擦除，等擦除完旧记录腾出了空间，checkpoint 就会往后移动（图中顺时针）**，然后 MySQL 恢复正常运行，继续执行新的更新操作。

> #### 组提交（group commit）
>
> redo log 的刷盘操作将会是最终影响 MySQL TPS 的瓶颈所在。为了缓解这一问题，MySQL 使用了组提交，将多个刷盘操作合并成一个，如果说 10 个事务依次排队刷盘的时间成本是 10，那么将这 10 个事务一次性一起刷盘的时间成本则近似于 1。
>
> 当开启 binlog 时（下边还会介绍）
>
> 为了保证 redo log 和 binlog 的数据一致性，MySQL 使用了二阶段提交，由 binlog 作为事务的协调者。而引入二阶段提交使得binlog 又成为了性能瓶颈，先前的 Redo log 组提交也成了摆设。为了再次缓解这一问题，MySQL 增加了 binlog 的组提交，目的同样是将 binlog 的多个刷盘操作合并成一个，结合 redo log 本身已经实现的组提交，分为三个阶段(Flush 阶段、Sync 阶段、Commit 阶段)完成 binlog 组提交，最大化每次刷盘的收益，弱化磁盘瓶颈，提高性能。
>
> 通常我们说 MySQL 的“双 1”配置，指的就是 sync_binlog 和 innodb_flush_log_at_trx_commit 都设置成 1。也就是说，一个事务完整提交前，需要等待两次刷盘，一次是 redo log（prepare 阶段），一次是 binlog。
>
> 这时候，你可能有一个疑问，这意味着我从 MySQL 看到的 TPS 是每秒两万的话，每秒就会写四万次磁盘。但是，我用工具测试出来，磁盘能力也就两万左右，怎么能实现两万的 TPS？
>
> 解释这个问题，就要用到组提交（group commit）机制了。假设有三个并发事务 (trx1, trx2, trx3) 在 prepare 阶段，都写完 redo log buffer，持久化到磁盘的过程，对应的 LSN 分别是 50、120 和 160。
>
> 1. trx1 是第一个到达的，会被选为这组的 leader；
> 2. 等 trx1 要开始写盘的时候，这个组里面已经有了三个事务，这时候 LSN 也变成了 160；
> 3. trx1 去写盘的时候，带的就是 LSN=160，因此等 trx1 返回时，所有 LSN 小于等于 160 的 redo log，都已经被持久化到磁盘；
> 4. 这时候 trx2 和 trx3 就可以直接返回了。
>
> 所以，一次组提交里面，组员越多，节约磁盘 IOPS 的效果越好。

#### Checkpoint

CheckPoint 的意思是检查点，用于推进 Redo Log 的失效。当触发 Checkpoint 后，会去看 Flush List 中最早的那个节点 old_lsn 是多少，也就是说当前 Flush List 还剩的最早被修改的数据页的 redo log lsn 是多少，并且将这个 lsn 记录到 Checkpoint 中，因为在这之前被修改的数据页都已经刷新到磁盘了，对应的 redo log 也就无效了，所以说之后在这个 old_lsn 之后的 redo log 才是有用的。这就解释了之前说的 redo log 文件组如何覆盖无效日志。



#### 一个重做全过程的示例

我们小结下 redo log 的过程

![](https://img.starfish.ink/mysql/redolog-write.png)

以更新事务为例

1. 将原始数据读入内存，修改数据的内存副本。

2. 先将内存中 Buffer pool 的脏页写入到 Redo log buffer 当中**记录数据的变化**。然后再将 redo log buffer 当中记录数据变化的日志通过**顺序IO**刷新到磁盘的 redo log file 当中 

   > 在缓冲池中有一条 Flush 链表用来维护被修改的数据页面，也就是脏页所组成的链表。

3. 写入操作系统 **Page Cache**

4. 刷盘，将重做日志缓冲区中的内容刷新到重做日志文件（如果此时脏页没刷完，会通过redo log 重放来恢复数据）

5. 唤醒用户线程完成 commit

6. 随后正常将内存中的脏页刷回磁盘。

### 2.4 redo 小结

有了 redo log，InnoDB 就可以保证即使数据库发生异常重启，之前提交的记录都不会丢失，这个能力称为 **crash-safe**。

所以有了 redo log，再通过 WAL 技术，InnoDB 就可以保证即使数据库发生异常重启，之前已提交的记录都不会丢失，这个能力称为 **crash-safe**（崩溃恢复）。可以看出来， **redo log 保证了事务四大特性中的持久性**。

redo log 作用：

- **实现事务的持久性，让 MySQL 有 crash-safe 的能力**，能够保证 MySQL 在任何时间段突然崩溃，重启后之前已提交的记录都不会丢失；
- **将写操作从「随机写」变成了「顺序写」**，提升 MySQL 写入磁盘的性能。



## 三、回滚日志(undo log)

回滚日志的作用是进行事务回滚，是 Innodb 存储引擎层生成的日志，实现了事务中的**原子性**，主要**用于事务回滚和 MVCC**。

当事务执行的时候，回滚日志中记录了事务中每次数据更新前的状态。当事务需要回滚的时候，可以通过读取回滚日志，恢复到指定的位置。另一方面，回滚日志也可以让其他的事务读取到这个事务对数据更改之前的值，从而确保了其他事务可以不受这个事务修改数据的影响。

> undo Log 是 InnoDB 十分重要的组成部分，它的作用横贯 InnoDB 中两个最主要的部分，并发控制（Concurrency Control）和故障恢复（Crash Recovery）。
>
> - Undo Log 用来记录每次修改之前的历史值，配合 Redo Log 用于故障恢复

#### 3.1 为什么需要 undo log

##### 事务回滚

由于如硬件故障，软件 Bug，运维操作等原因的存在，数据库在任何时刻都有突然崩溃的可能。

这个时候没有完成提交的事务可能已经有部分数据写入了磁盘，如果不加处理，会违反数据库对**原子性**的保证。

针对这个问题，直观的想法是等到事务真正提交时，才能允许这个事务的任何修改落盘，也就是 No-Steal 策略。显而易见，这种做法一方面造成很大的内存空间压力，另一方面提交时的大量随机 IO 会极大的影响性能。因此，数据库实现中通常会在正常事务进行中，就不断的连续写入 Undo Log，来记录本次修改之前的历史值。当 Crash 真正发生时，可以在 Recovery 过程中通过回放 Undo Log 将未提交事务的修改抹掉。InnoDB 采用的就是这种方式。

##### MVCC（Multi-Versioin Concurrency Control）

用于 MVCC（实现非锁定读），读取一行记录时，若已被其他事务占据，则通过 undo 读取之前的版本。

为了避免只读事务与写事务之间的冲突，避免写操作等待读操作，几乎所有的主流数据库都采用了多版本并发控制（MVCC）的方式，也就是为每条记录保存多份历史数据供读事务访问，新的写入只需要添加新的版本即可，无需等待。

InnoDB 在这里复用了 Undo Log 中已经记录的历史版本数据来满足 MVCC 的需求。

InnoDB 中其实是把 Undo 当做一种数据来维护和使用的，也就是说，Undo Log 日志本身也像其他的数据库数据一样，会写自己对应的Redo Log，通过 Redo Log 来保证自己的原子性。因此，更合适的称呼应该是 **Undo Data**。



> 我们在执行执行一条“增删改”语句的时候，虽然没有输入 begin 开启事务和 commit 提交事务，但是 MySQL 会**隐式开启事务**来执行“增删改”语句的，执行完就自动提交事务的，这样就保证了执行完“增删改”语句后，我们可以及时在数据库表看到“增删改”的结果了。
>
> 执行一条语句是否自动提交事务，是由 `autocommit` 参数决定的，默认是开启。所以，执行一条 update 语句也是会使用事务的。
>



#### 3.2 组织 undo log

> 前边我们简单提过下，Undo Log 属于逻辑日志，为什么不用物理日志呢？
>
> Undo Log 需要的是事务之间的并发，以及方便的多版本数据维护，其重放逻辑不希望因 DB 的物理存储变化而变化。因此，InnoDB 中的 Undo Log 采用了基于事务的 **Logical Logging** 的方式。
>

![](https://img.starfish.ink/mysql/innodb-architecture-undo.png)

> 各个版本的 MySQL，undo tablespaces 存储有一些差距，我们以 8.0 版本说明

#### 「undo log 的两种类型」

根据行为的不同，undo log 分为两种：insert undo log 和 update undo log

- **insert undo log，是在 insert 操作中产生的。**

  insert 操作的记录只对事务本身可见，对于其它事务此记录是不可见的，所以 insert undo log 可以在事务提交后直接删除而不需要进行purge操作。

  Insert Undo Record 仅仅是为了可能的事务回滚准备的，并不在 MVCC 功能中承担作用。

  ![](https://img.starfish.ink/mysql/insert-undo-log.png)

  存在一组长度不定的 Key Fields，因为对应表的主键可能由多个 field 组成，这里需要记录 Record 完整的主键信息，回滚的时候可以通过这个信息在索引中定位到对应的 Record。

- **update undo log 是 update 或 delete 操作中产生。**

  由于 MVCC 需要保留 Record 的多个历史版本，当某个 Record 的历史版本还在被使用时，这个 Record 是不能被真正的删除的。

  因此，当需要删除时，其实只是修改对应 Record 的Delete Mark标记。对应的，如果这时这个Record又重新插入，其实也只是修改一下Delete Mark标记，也就是将这两种情况的delete和insert转变成了update操作。再加上常规的Record修改，因此这里的Update Undo Record会对应三种Type：

  - TRX_UNDO_UPD_EXIST_REC
  - TRX_UNDO_DEL_MARK_REC
  - TRX_UNDO_UPD_DEL_REC。

  他们的存储内容也类似，我们看下 TRX_UNDO_UPD_EXIST_REC

  ![](https://img.starfish.ink/mysql/update-undo-log.png)

  除了跟 Insert Undo Record 相同的头尾信息，以及主键 Key Fileds 之外，Update Undo Record 增加了：

  - Transaction Id记录了产生这个历史版本事务Id，用作后续MVCC中的版本可见性判断
  - Rollptr指向的是该记录的上一个版本的位置，包括space number，page number和page内的offset。沿着Rollptr可以找到一个Record的所有历史版本。
  - Update Fields中记录的就是当前这个Record版本相对于其之后的一次修改的Delta信息，包括所有被修改的Field的编号，长度和历史值。

  > 因为会对已经存在的记录产生影响，为了提供 MVCC机制，因此 update undo log 不能在事务提交时就进行删除，而是将事务提交时放到入 history list 上，等待 purge 线程进行最后的删除操作
  >
  > 为了更好的支持并发，InnoDB的多版本一致性读是采用了基于回滚段的的方式。另外，对于更新和删除操作，InnoDB并不是真正的删除原来的记录，而是设置记录的delete mark为1。因此为了解决数据Page和Undo Log膨胀的问题，需要引入purge机制进行回收
  >
  > 为了保证事务并发操作时，在写各自的undo log时不产生冲突，InnoDB采用回滚段的方式来维护undo log的并发写入和持久化。回滚段实际上是一种 Undo 文件组织方式



每当 InnoDB 中需要修改某个 Record 时，都会将其历史版本写入一个 Undo Log 中，对应的 Undo Record 是 Update 类型。

当插入新的 Record 时，还没有一个历史版本，但为了方便事务回滚时做逆向（Delete）操作，这里还是会写入一个 Insert 类型的 Undo Record。

#### 「组织方式」

每一次的修改都会产生至少一个 Undo Record，那么大量 Undo Record 如何组织起来，来支持高效的访问和管理呢？

每个事务其实会修改一组的 Record，对应的也就会产生一组 Undo Record，这些 Undo Record 首尾相连就组成了这个事务的**Undo Log**。除了一个个的 Undo Record 之外，还在开头增加了一个Undo Log Header 来记录一些必要的控制信息，因此，一个 Undo Log 的结构如下所示：

![](https://img.starfish.ink/mysql/undo-log-header.png)

- Trx Id：事务Id
- Trx No：事务的提交顺序，也会用这个来判断是否能Purge
- Delete Mark：标明该Undo Log中有没有TRX_UNDO_DEL_MARK_REC类型的Undo Record，避免Purge时不必要的扫描
- Log Start Offset：记录Undo Log Header的结束位置，方便之后Header中增加内容时的兼容
- Xid and DDL Flags：Flag信息
- Table ID if DDL：表ID
- Next Undo Log：标记后边的Undo Log
- Prev Undo Log：标记前边的Undo Log
- History List Node：

索引中的同一个 Record 被不同事务修改，会产生不同的历史版本，这些历史版本又通过 **Rollptr** 串成一个链表，供 MVCC 使用。如下图所示：

![](https://img.starfish.ink/mysql/undo-log-logicial.png)

> 示例中有三个事务操作了表 t 上，主键 id 是 1 的记录，首先事务 X 插入了一条记录，事务 Y、Z 去修改了这条记录。X，Y，Z 三个事务分别有自己的逻辑上连续的三条 Undo Log，每条 Undo Log 有自己的 Undo Log Header。从索引中的这条 Record 沿着 Rollptr 可以依次找到这三个事务 Undo Log 中关于这条记录的历史版本。同时可以看出，Insert 类型 Undo Record 中只记录了对应的主键值：id=1，而 Update 类型的 Undo Record 中还记录了对应的历史版本的生成事务 Trx_id，以及被修改的 name 的历史值。

undo 是逻辑日志，只是将数据库**逻辑的**恢复到执行语句或事务之前。

我们知道 InnoDB 中默认以 块 为单位存储，一个块默认是 16KB。那么如何用固定的块大小承载不定长的 Undo Log，以实现高效的空间分配、复用，避免空间浪费。InnoDB 的**基本思路**是让多个较小的 Undo Log 紧凑存在一个 Undo Page 中，而对较大的 Undo Log 则随着不断的写入，按需分配足够多的 Undo Page 分散承载

![](https://img.starfish.ink/mysql/undo-log-physical.png)

Undo 的物理组织格式是—— Undo Segment，它会持有至少一个 Undo Page。

InnoDB 中的 Undo 文件中准备了大量的 Undo Segment 的槽位，按照1024一组划分为**Rollback Segment**。

Undo 的文件组织格式是——Undo Tablespace，每个 Undo Tablespace 最多会包含 128 个 Rollback Segment。MySQL 8.0 最多支持 127 个独立的 Undo Tablespace。

在内存中也会维护对应的数据结构来管理 Undo Log，我们就不深入了。



#### 3.3 MVCC  是如何实现的

多版本的目的是为了避免写事务和读事务的互相等待，那么每个读事务都需要在不对 Record 加 Lock 的情况下， 找到对应的应该看到的历史版本。所谓历史版本就是假设在该只读事务开始的时候对整个 DB 打一个快照，之后该事务的所有读请求都从这个快照上获取。当然实现上不能真正去为每个事务打一个快照，这个时间空间成本都太高了。

> MVCC 的实现还有一个概念：快照读，快照信息就记录在 undo 中
>
> 所谓快照读，就是读取的是快照数据，即快照生成的那一刻的数据，像我们常用的**普通的SELECT语句在不加锁情况下就是快照读**。如：
>
> ```mysql
> SELECT * FROM t WHERE ...
> ```
>
> 和快照读相对应的另外一个概念叫做当前读，当前读就是读取最新数据，所以，**加锁的 SELECT，或者对数据进行增删改都会进行当前读**，比如：
>
> ```mysql
> SELECT * FROM t LOCK IN SHARE MODE;
> 
> SELECT * FROM t FOR UPDATE;
> 
> INSERT INTO t ...
> 
> DELETE FROM t ...
> 
> UPDATE t ...
> ```

InnoDB **通过 ReadView + undo log 实现 MVCC**

对于「读提交」和「可重复读」隔离级别的事务来说，它们的快照读（普通 select 语句）是通过 Read View + undo log 来实现的，它们的区别在于创建 Read View 的时机不同：

- 「读提交」隔离级别是在每个 select 都会生成一个新的 Read View，也意味着，事务期间的多次读取同一条数据，前后两次读的数据可能会出现不一致，因为可能这期间另外一个事务修改了该记录，并提交了事务。
- 「可重复读」隔离级别是启动事务时生成一个 Read View，然后整个事务期间都在用这个 Read View，这样就保证了在事务期间读到的数据都是事务启动前的记录。

这两个隔离级别实现是通过「事务的 Read View 里的字段」和「记录中的两个隐藏列（trx_id 和 roll_pointer）」的比对，如果不满足可见性，就会顺着 undo log 版本链里找到满足其可见性的记录，从而控制并发事务访问同一个记录时的行为，这就叫 MVCC（多版本并发控制）。

InnoDB 的做法，是在读事务第一次读取的时候获取一份 ReadView，并一直持有，其中记录所有当前活跃的写事务 ID，由于写事务的 ID 是自增分配的，通过这个 ReadView 我们可以知道在这一瞬间，哪些事务已经提交哪些还在运行，根据 Read Committed 的要求，未提交的事务的修改就是不应该被看见的，对应地，已经提交的事务的修改应该被看到。

> **Read View 主要来帮我们解决可见性的问题的**, 即他会来告诉我们本次事务应该看到哪个快照，不应该看到哪个快照。
>
> 在 Read View 中有几个重要的属性：
>
> - trx_ids，系统当前未提交的事务 ID 的列表。
> - low_limit_id，未提交的事务中最大的事务 ID。
> - up_limit_id，未提交的事务中最小的事务 ID。
> - creator_trx_id，创建这个 Read View 的事务 ID。
>
> 每开启一个事务，我们都会从数据库中获得一个事务 ID，这个事务 ID 是自增长的，通过 ID 大小，我们就可以判断事务的时间顺序。

作为存储历史版本的 Undo Record，其中记录的 trx_id 就是做这个可见性判断的，对应的主索引的 Record 上也有这个值。当一个读事务拿着自己的 ReadView 访问某个表索引上的记录时，会通过比较 Record 上的 trx_id 确定是否是可见的版本，如果不可见就沿着 Record 或 Undo Record 中记录的 rollptr 一路找更老的历史版本。

具体的事务 id，指向 undo log 的指针 rollptr，这些信息是放在哪里呢，这就是我们常说的 InnoDB 隐藏字段了

> #### InnoDB存储引擎的行结构
>
> InnoDB 表数据的组织方式为主键聚簇索引，二级索引中采用的是(索引键值, 主键键值)的组合来唯一确定一条记录。
> InnoDB表数据为主键聚簇索引,mysql默认为每个索引行添加了4个隐藏的字段,分别是：
>
> - DB_ROW_ID：InnoDB引擎中一个表只能有一个主键,用于聚簇索引,如果表没有定义主键会选择第一个非Null 的唯一索引作为主键,如果还没有,生成一个隐藏的DB_ROW_ID作为主键构造聚簇索引。
> - DB_TRX_ID：最近更改该行数据的事务ID。
> - DB_ROLL_PTR：回滚指针，指向这条记录的上一个版本，其实他指向的就是 Undo Log 中的上一个版本的快照的地址
> - DELETE BIT：索引删除标志，如果DB删除了一条数据,是优先通知索引将该标志位设置为1,然后通过(purge)清除线程去异步删除真实的数据。
>

如下图所示，事务 R 需要查询表 t 上的 id 为 1 的记录，R 开始时事务 X 已经提交，事务 Y 还在运行，事务 Z 还没开始，这些信息都被记录在了事务 R 的 ReadView 中。事务 R 从索引中找到对应的这条 Record[1, stafish]，对应的 trx_id 是 Z，不可见。沿着 Rollptr 找到Undo 中的前一版本[1, fish]，对应的 trx_id 是 Y，不可见。继续沿着 Rollptr 找到[1, star]，trx_id是 X 可见，返回结果。

![](https://img.starfish.ink/mysql/undo-log-mvcc.png)

前面提到过，作为 Logical Log，Undo 中记录的其实是前后两个版本的 diff 信息，而读操作最终是要获得完整的 Record 内容的，也就是说这个沿着 rollptr 指针一路查找的过程中需要用 Undo Record 中的 diff 内容依次构造出对应的历史版本，这个过程在函数 **row_search_mvcc **中，其中 **trx_undo_prev_version_build** 会根据当前的 rollptr 找到对应的 Undo Record 位置，这里如果是 rollptr指向的是 insert 类型，或者找到了已经 Purge 了的位置，说明到头了，会直接返回失败。否则，就会解析对应的 Undo Record，恢复出trx_id、指向下一条 Undo Record 的 rollptr、主键信息，diff 信息 update vector 等信息。之后通过 **row_upd_rec_in_place**，用update vector 修改当前持有的 Record 拷贝中的信息，获得 Record 的这个历史版本。之后调用自己 ReadView 的 **changes_visible** 判断可见性，如果可见则返回用户。完成这个历史版本的读取。



#### 3.4 Undo Log 清理

我们已经知道，InnoDB 在 Undo Log 中保存了多份历史版本来实现 MVCC，当某个历史版本已经确认不会被任何现有的和未来的事务看到的时候，就应该被清理掉。

InnoDB中每个写事务结束时都会拿一个递增的编号**trx_no**作为事务的提交序号，而每个读事务会在自己的ReadView中记录自己开始的时候看到的最大的trx_no为**m_low_limit_no**。那么，如果一个事务的trx_no小于当前所有活跃的读事务Readview中的这个**m_low_limit_no**，说明这个事务在所有的读开始之前已经提交了，其修改的新版本是可见的， 因此不再需要通过undo构建之前的版本，这个事务的Undo Log也就可以被清理了。



> redo log 和 undo log 区别在哪？
>
> - redo log 记录了此次事务「**完成后**」的数据状态，记录的是更新**之后**的值；
> - undo log 记录了此次事务「**开始前**」的数据状态，记录的是更新**之前**的值；



## 四、二进制日志(binlog)

前面我们讲过，MySQL 整体来看，其实就有两块：一块是 Server 层，它主要做的是 MySQL 功能层面的事情；还有一块是引擎层，负责存储相关的具体事宜。上面我们聊到的 redo log 和 undo log 是 InnoDB 引擎特有的日志，而 Server 层也有自己的日志，称为 binlog（二进制日志）。

二进制日志，也被叫做「归档日志」，主要**用于数据备份和主从复制**

- **主从复制**：在 `Master` 端开启 `binlog`，然后将 `binlog` 发送到各个 `Slave` 端，`Slave` 端重放 `binlog` 从而达到主从数据一致
- **数据恢复**：可以用 `mysqldump` 做数据备份，binlog 格式是二进制日志，可以使用 `mysqlbinlog` 工具解析，实现数据恢复

二进制日志主要记录数据库的更新事件，比如创建数据表、更新表中的数据、数据更新所花费的时长等信息。通过这些信息，我们可以再现数据更新操作的全过程。而且，由于日志的延续性和时效性，我们还可以利用日志，完成无损失的数据恢复和主从服务器之间的数据同步。



### 4.1 binlog VS redolog

是不会有点疑惑，binlog 和 redo log 是不是有点重复？这个问题跟 MySQL 的时间线有关系。

因为最开始 MySQL 里并没有 InnoDB 引擎。MySQL 自带的引擎是 MyISAM，但是 MyISAM 没有 crash-safe 的能力，binlog 日志只能用于归档。而 InnoDB 是另一个公司以插件形式引入 MySQL 的，既然只依靠 binlog 是没有 crash-safe 能力的，所以 InnoDB 使用另外一套日志系统——也就是 redo log 来实现 crash-safe 能力。

这两种日志有以下四点区别。

1. redo log 是 InnoDB 引擎特有的；binlog 是 MySQL 的 Server 层实现的，所有引擎都可以使用。
2. redo log 是物理日志，记录的是“在某个数据页上做了什么修改”；binlog 是逻辑日志，记录的是这个语句的原始逻辑，比如“给 ID=2 这一行的 c 字段加 1 ”。
3. redo log 是循环写的，空间固定会用完；binlog 是可以追加写入的。“追加写”是指 binlog 文件写到一定大小后会切换到下一个，并不会覆盖以前的日志。
4. redo log 用于掉电等故障恢复。binlog 用于备份恢复、主从复制



### 4.2 查看 binlog

查看二进制日志主要有 3 种情况，分别是查看当前正在写入的二进制日志、查看所有的二进制日志和查看二进制日志中的所有数据更新事件。

```mysql
mysql> show master status;
+---------------+----------+--------------+------------------+-------------------+
| File          | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+---------------+----------+--------------+------------------+-------------------+
| binlog.000002 |    27736 |              |                  |                   |
+---------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)
```

```mysql
mysql> show binary logs;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000001 |       638 | No        |
| binlog.000002 |     27736 | No        |
+---------------+-----------+-----------+
2 rows in set (0.01 sec)
```

```mysql
mysql> show variables like '%binlog_format%';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| binlog_format | ROW   |
+---------------+-------+
1 row in set (0.00 sec)
```



### 4.3 Binary logging formats

`binlog`日志有三种格式，分别为`STATMENT`、`ROW`和`MIXED`。

> 在 `MySQL 5.7.7`之前，默认的格式是`STATEMENT`，`MySQL 5.7.7`之后，默认值是 `ROW`。日志格式通过 `binlog-format` 指定。

- `STATMENT` ：基于 SQL 语句的复制(`statement-based replication, SBR`)，每一条会修改数据的 sql 语句会记录到 binlog 中**。**
  - 优点：不需要记录每一行的变化，减少了 binlog 日志量，节约了 IO, 从而提高了性能； 
  - 缺点：在某些情况下会导致主从数据不一致，比如执行`sysdate()`、`slepp()`等。

- `ROW` ：基于行的复制(`row-based replication, RBR`)，不记录每条sql语句的上下文信息，仅需记录哪条数据被修改了**。 **
  - 优点：不会出现某些特定情况下的存储过程、或function、或trigger的调用和触发无法被正确复制的问题**；**
  - 缺点：会产生大量的日志，尤其是 `alter table` 的时候会让日志暴涨

- `MIXED` ：基于 STATMENT 和 ROW 两种模式的混合复制(`mixed-based replication, MBR`)，mixed 格式的意思是，MySQL 自己会判断这条 SQL 语句是否可能引起主备不一致，如果有可能，就用 row 格式，否则就用 statement 格式

> ```
>SET GLOBAL binlog_format = 'STATEMENT';
> SET GLOBAL binlog_format = 'ROW';
> SET GLOBAL binlog_format = 'MIXED';
> ```
>



### 4.4 binlog 的写入机制

binlog 的写入逻辑比较简单：事务执行过程中，先把日志写到 binlog cache，事务提交的时候，再把 binlog cache 写到 binlog 文件中。

一个事务的 binlog 是不能被拆开的，因此不论这个事务多大，也要确保一次性写入。这就涉及到了 binlog cache 的保存问题。

系统给 binlog cache 分配了一片内存，每个线程一个，参数 `binlog_cache_size` 用于控制单个线程内 binlog cache 所占内存的大小。如果超过了这个参数规定的大小，就要暂存到磁盘。

事务提交的时候，执行器把 binlog cache 里的完整事务写入到 binlog 中，并清空 binlog cache。

![](https://img.starfish.ink/mysql/binlog-cache.png)



可以看到，每个线程有自己 binlog cache，但是共用同一份 binlog 文件。

- 图中的 write，指的就是指把日志写入到文件系统的 page cache，并没有把数据持久化到磁盘，所以速度比较快。
- 图中的 fsync，才是将数据持久化到磁盘的操作。一般情况下，我们认为 fsync 才占磁盘的 IOPS。

write 和 fsync 的时机，是由参数 sync_binlog 控制的：

1. sync_binlog=0 的时候，表示每次提交事务都只 write，不 fsync；
2. sync_binlog=1 的时候，表示每次提交事务都会执行 fsync；
3. sync_binlog=N(N>1) 的时候，表示每次提交事务都 write，但累积 N 个事务后才 fsync。

因此，在出现 IO 瓶颈的场景里，将 sync_binlog 设置成一个比较大的值，可以提升性能。在实际的业务场景中，考虑到丢失日志量的可控性，一般不建议将这个参数设成 0，比较常见的是将其设置为 100~1000 中的某个数值。

但是，将 sync_binlog 设置为 N，对应的风险是：如果主机发生异常重启，会丢失最近 N 个事务的 binlog 日志。



### 4.5 update 语句执行过程

比较重要的 undo、redo、binlog 都介绍完了，我们来看执行器和 InnoDB 引擎在执行一个简单的 update 语句时的内部流程。`update t set name='starfish' where id = 1;`

1. 执行器先找引擎取 id=1 这一行。id 是主键，引擎直接用树搜索找到这一行。如果 id=1 这一行所在的数据页本来就在内存（buffer pool）中，就直接返回给执行器；否则，需要先从磁盘读入内存，然后再返回。
2. 执行器拿到引擎给的行数据，更新行数据，再调用引擎接口写入这行新数据。
3. 引擎将这行新数据更新到内存中，同时将这个更新操作记录到 redo log 里面，此时 redo log 处于 prepare 状态。然后告知执行器执行完成了，随时可以提交事务。
4. 执行器生成这个操作的 binlog，并把 binlog 写入磁盘。
5. 执行器调用引擎的提交事务接口，引擎把刚刚写入的 redo log 改成提交（commit）状态，更新完成。

这里我给出这个 update 语句的执行流程图，图中浅色框表示是在 InnoDB 内部执行的，深色框表示是在执行器中执行的。

![](https://img.starfish.ink/mysql/update-flow.png)

你可能注意到了，最后三步看上去有点“绕”，将 redo log 的写入拆成了两个步骤：prepare 和 commit，这就是"两阶段提交"。

### 4.6 两阶段提交

为什么必须有“两阶段提交”呢？这是为了让两份日志之间的逻辑一致。要说明这个问题，我们得从文章开头的那个问题说起：**怎样让数据库恢复到半个月内任意一秒的状态？**

前面我们说过了，binlog 会记录所有的逻辑操作，并且是采用“追加写”的形式。如果你的 DBA 承诺说半个月内可以恢复，那么备份系统中一定会保存最近半个月的所有 binlog，同时系统会定期做整库备份。这里的“定期”取决于系统的重要性，可以是一天一备，也可以是一周一备。

当需要恢复到指定的某一秒时，比如某天下午两点发现中午十二点有一次误删表，需要找回数据，那你可以这么做：

- 首先，找到最近的一次全量备份，如果你运气好，可能就是昨天晚上的一个备份，从这个备份恢复到临时库；
- 然后，从备份的时间点开始，将备份的 binlog 依次取出来，重放到中午误删表之前的那个时刻。

这样你的临时库就跟误删之前的线上库一样了，然后你可以把表数据从临时库取出来，按需要恢复到线上库去。

好了，说完了数据恢复过程，我们回来说说，为什么日志需要“两阶段提交”。这里不妨用反证法来进行解释。

由于 redo log 和 binlog 是两个独立的逻辑，如果不用两阶段提交，要么就是先写完 redo log 再写 binlog，或者采用反过来的顺序。我们看看这两种方式会有什么问题。

仍然用前面的 update 语句来做例子。假设当前 ID=2 的行，字段 c 的值是 0，再假设执行 update 语句过程中在写完第一个日志后，第二个日志还没有写完期间发生了 crash，会出现什么情况呢？

1. **先写 redo log 后写 binlog**。假设在 redo log 写完，binlog 还没有写完的时候，MySQL 进程异常重启。由于我们前面说过的，redo log 写完之后，系统即使崩溃，仍然能够把数据恢复回来，所以恢复后这一行 c 的值是 1。
   但是由于 binlog 没写完就 crash 了，这时候 binlog 里面就没有记录这个语句。因此，之后备份日志的时候，存起来的 binlog 里面就没有这条语句。
   然后你会发现，如果需要用这个 binlog 来恢复临时库的话，由于这个语句的 binlog 丢失，这个临时库就会少了这一次更新，恢复出来的这一行 c 的值就是 0，与原库的值不同。
2. **先写 binlog 后写 redo log**。如果在 binlog 写完之后 crash，由于 redo log 还没写，崩溃恢复以后这个事务无效，所以这一行 c 的值是 0。但是 binlog 里面已经记录了“把 c 从 0 改成 1”这个日志。所以，在之后用 binlog 来恢复的时候就多了一个事务出来，恢复出来的这一行 c 的值就是 1，与原库的值不同。

可以看到，如果不使用“两阶段提交”，那么数据库的状态就有可能和用它的日志恢复出来的库的状态不一致。

你可能会说，这个概率是不是很低，平时也没有什么动不动就需要恢复临时库的场景呀？

其实不是的，不只是误操作后需要用这个过程来恢复数据。当你需要扩容的时候，也就是需要再多搭建一些备库来增加系统的读能力的时候，现在常见的做法也是用全量备份加上应用 binlog 来实现的，这个“不一致”就会导致你的线上出现主从数据库不一致的情况。

简单说，redo log 和 binlog 都可以用于表示事务的提交状态，而两阶段提交就是让这两个状态保持逻辑上的一致。



### 4.7 主从同步

MySQL主从同步的作用主要有以下几点：

- 故障切换。
- 提供一定程度上的备份服务。
- 实现MySQL数据库的读写分离。

MySQL 的主从复制依赖于 binlog ，也就是记录 MySQL 上的所有变化并以二进制形式保存在磁盘上。复制的过程就是将 binlog 中的数据从主库传输到从库上。

这个过程一般是**异步**的，也就是主库上执行事务操作的线程不会等待复制 binlog 的线程同步完成。

![](https://img.starfish.ink/mysql/master-slave.png)

具体详细过程如下：

- MySQL 主库在收到客户端提交事务的请求之后，会先写入 binlog，再提交事务，更新存储引擎中的数据，事务提交完成后，返回给客户端“操作成功”的响应。
- 从库会创建一个专门的 I/O 线程，连接主库的 log dump 线程，来接收主库的 binlog 日志，再把 binlog 信息写入 relay log 的中继日志里，再返回给主库“复制成功”的响应。
- 从库会创建一个用于回放 binlog 的线程，去读 relay log 中继日志，然后回放 binlog 更新存储引擎中的数据，最终实现主从的数据一致性。

在完成主从复制之后，你就可以在写数据时只写主库，在读数据时只读从库，这样即使写请求会锁表或者锁记录，也不会影响读请求的执行。

> #### 中继日志(relay log)
>
> 中继日志只在主从服务器架构的从服务器上存在。从服务器为了与主服务器保持一致，要从主服务器读取二进制日志的内容，并且把读取到的信息写入本地的日志文件中，这个从服务器本地的日志文件就叫中继日志。然后，从服务器读取中继日志，并根据中继日志的内容对从服务器的数据进行更新，完成主从服务器的数据同步。
>
> Relay log(中继日志)是在MySQL主从复制时产生的日志，在MySQL的主从复制主要涉及到三个线程:
>
> 1) Log dump线程：向从库的IO线程传输主库的Binlog日志
>
> 2) IO线程：向主库请求Binlog日志，并将Binlog日志写入到本地的relay log中。
>
> 3) SQL线程：读取Relay log日志，将其解析为SQL语句并逐一执行。
>
> 

> MySQL 主从复制还有哪些模型？

主要有三种：

- **同步复制**：MySQL 主库提交事务的线程要等待所有从库的复制成功响应，才返回客户端结果。这种方式在实际项目中，基本上没法用，原因有两个：一是性能很差，因为要复制到所有节点才返回响应；二是可用性也很差，主库和所有从库任何一个数据库出问题，都会影响业务。
- **异步复制**（默认模型）：MySQL 主库提交事务的线程并不会等待 binlog 同步到各从库，就返回客户端结果。这种模式一旦主库宕机，数据就会发生丢失。
- **半同步复制**：MySQL 5.7 版本之后增加的一种复制方式，介于两者之间，事务线程不用等待所有的从库复制成功响应，只要一部分复制成功响应回来就行，比如一主二从的集群，只要数据成功复制到任意一个从库上，主库的事务线程就可以返回给客户端。这种**半同步复制的方式，兼顾了异步复制和同步复制的优点，即使出现主库宕机，至少还有一个从库有最新的数据，不存在数据丢失的风险**。



## 五、错误日志(error log)

错误日志记录了 MySQL 服务器启动、停止运行的时间，以及系统启动、运行和停止过程中的诊断信息，包括错误、警告和提示等。当我们的数据库服务器发生系统故障时，错误日志是发现问题、解决故障的首选。

错误日志默认是开启的

```mysql
mysql> show variables like '%log_error%';
+----------------------------+----------------------------------------+
| Variable_name              | Value                                  |
+----------------------------+----------------------------------------+
| binlog_error_action        | ABORT_SERVER                           |
| log_error                  | /usr/local/mysql/data/mysqld.local.err |
| log_error_services         | log_filter_internal; log_sink_internal |
| log_error_suppression_list |                                        |
| log_error_verbosity        | 2                                      |
+----------------------------+----------------------------------------+
5 rows in set (0.01 sec)
```

我们可以看到错误日志的地址，当出现数据库不能正常启动、使用的时候，第一个查的就是错误日志，有时候错误日志中也会有些优化信息，比如告诉我们需要增大 InnoDB 引擎的 redo log 这种。



## 六、慢查询日志(slow query log)

慢查询日志用来记录执行时间超过指定时长的查询。它的主要作用是，帮助我们发现那些执行时间特别长的 SQL 查询，并且有针对性地进行优化，从而提高系统的整体效率。当我们的数据库服务器发生阻塞、运行变慢的时候，检查一下慢查询日志，找到那些慢查询，对解决问题很有帮助。

```mysql
mysql> show variables like '%slow_query%';
+---------------------+------------------------------------------------------+
| Variable_name       | Value                                                |
+---------------------+------------------------------------------------------+
| slow_query_log      | OFF                                                  |
| slow_query_log_file | /usr/local/mysql/data/starfishdeMacBook-Pro-slow.log |
+---------------------+------------------------------------------------------+
2 rows in set (0.02 sec)
```

默认也是关闭的，其实我们说的慢查询日志，有两个值

> Mac 没有 my.ini/my.cnf 文件，需要自己搞，我们只对本次生效吧。`set global slow_query_log=1`

```mysql
mysql> show variables like '%long_query_time%';
+-----------------+-----------+
| Variable_name   | Value     |
+-----------------+-----------+
| long_query_time | 10.000000 |
+-----------------+-----------+
1 row in set (0.01 sec)

mysql> show variables like '%row_limit%';
+------------------------+-------+
| Variable_name          | Value |
+------------------------+-------+
| min_examined_row_limit | 0     |
+------------------------+-------+
1 row in set (0.01 sec)
```

`long_query_time`：慢查询的时间阈值

`min_examined_row_limit`：查询扫描过的最少记录数，因为这个值默认是 0，所以常被我们忽略

查询的执行时间和最少扫描记录，共同组成了判别一个查询是否是慢查询的条件。如果查询扫描过的记录数大于等于这个变量的值，并且查询执行时间超过 long_query_time 的值，那么，这个查询就被记录到慢查询日志中；反之，则不被记录到慢查询日志中。



## 小结

感谢你读到这里，送你两道面试题吧

### 说下 一条 MySQL 更新语句的执行流程是怎样的吧？

```
mysql> update t set name='starfish' where salary > 999999;
```

server层和InnoDB层之间是如何沟通：

1. salary 有二级索引，行器先找引擎取扫描区间的第一行。根据这条二级索引记录中的主键值执行回表操作（即通过聚簇索引的B+树根节点一层一层向下找，直到在叶子节点中找到相应记录），将获取到的聚簇索引记录返回给server层。
2. server层得到聚簇索引记录后，会看一下更新前的记录和更新后的记录是否一样，如果一样的话就不更新了，如果不一样的话就把更新前的记录和更新后的记录都当作参数传给InnoDB层，让InnoDB真正的执行更新记录的操作
3. InnoDB收到更新请求后，先更新记录的聚簇索引记录，再更新记录的二级索引记录。最后将更新结果返回给server层
4. server层继续向InnoDB索要下一条记录，由于已经通过B+树定位到二级索引扫描区间`[999999, +∞)`的第一条二级索引记录，而记录又是被串联成单向链表，所以InnoDB直接通过记录头信息的`next_record`的属性即可获取到下一条二级索引记录。然后通过该二级索引的主键值进行回表操作，获取到完整的聚簇索引记录再返回给server层。
5. 就这样一层一层的处理

具体执行流程：

1. 先在B+树中定位到该记录（这个过程也被称作加锁读），如果该记录所在的页面不在buffer pool里，先将其加载到 buffer pool 里再读取。

2. 首先更新聚簇索引记录。 更新聚簇索引记录时： 

   ① 先向Undo页面写undo日志。不过由于这是在更改页面，所以修改 Undo 页面前需要先记录一下相应的 redo 日志。 

   ② 将这个更新操作记录到 redo log 里面，此时 redo log 处于 prepare 状态。然后告知执行器执行完成了，随时可以提交事务。

3. 更新其他的二级索引记录。

4. 记录该语句对应的 binlog 日志，此时记录的binlog并没有刷新到硬盘上的binlog日志文件，在事务提交时才会统一将该事务运行过程中的所有binlog日志刷新到硬盘。

5. 引擎把刚刚写入的 redo log 改成提交（commit）状态，更新完成。



### 为什么需要记录REDO

redo log 是 Innodb 存储引擎层生成的日志，实现了事务中的**持久性**，主要**用于掉电等故障恢复**：

1. 在系统遇到故障的恢复过程中，可以修复未完成的事务修改的数据。
2. InnoDB 为了提高数据存取的效率，减少磁盘操作的频率，对数据的更新操作不会立即写到磁盘上，而是把数据更新先保存在内存中(**InnoDB Buffer Pool**)，积累到一定程度，再集中进行磁盘读写操作。这样就存在一个问题：一旦出现宕机或者停电等异常情况，内存中保存的数据更新操作可能会丢失。为了保证数据库本身的一致性和**持久性**，InnoDB 维护了 REDO LOG。修改 Page 之前需要先将修改的内容记录到 REDO 中，并保证 REDO LOG 早于对应的 Page 落盘，也就是常说的 WAL。当故障发生导致内存数据丢失后，InnoDB 会在重启时，通过重放 REDO，将 Page 恢复到崩溃前的状态。

回答面试官问题时候，如果能指明不同版本的差异，会加分的



## References

- https://dev.mysql.com/doc/refman/8.0/en/server-logs.html
- https://dev.mysql.com/doc/dev/mysql-server/latest/PAGE_INNODB_REDO_LOG_THREADS.html
- https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log.html
- [《庖丁解InnoDB之UNDO LOG》](http://mysql.taobao.org/monthly/2021/10/01/)
- [庖丁解InnoDB之Undo LOG](http://catkang.github.io/2021/10/30/mysql-undo.html)
- https://www.51cto.com/article/639652.html