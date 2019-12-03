# MySQL锁

锁是计算机协调多个进程或线程并发访问某一资源的机制。

在数据库中，除传统的计算资源（如CPU、RAM、I/O等）的争用以外，数据也是一种供许多用户共享的资源。数据库锁定机制简单来说，就是数据库为了保证数据的一致性，而使各种共享资源在被并发访问变得有序所设计的一种规则



打个比方，我们到淘宝上买一件商品，商品只有一件库存，这个时候如果还有另一个人买，
那么如何解决是你买到还是另一个人买到的问题？


这里肯定要用到事物，我们先从库存表中取出物品数量，然后插入订单，付款后插入付款表信息，
然后更新商品数量。在这个过程中，使用锁可以对有限的资源进行保护，解决隔离和并发的矛盾。

 



### 锁的分类

#### 从对数据操作的类型分类：

- **读锁**（共享锁）：针对同一份数据，多个读操作可以同时进行，不会互相影响

- **写锁**（排他锁）：当前写操作没有完成前，它会阻断其他写锁和读锁。

#### 从对数据操作的粒度分类：


为了尽可能提高数据库的并发度，每次锁定的数据范围越小越好，理论上每次只锁定当前操作的数据的方案会得到最大的并发度，但是管理锁是很耗资源的事情（涉及获取，检查，释放锁等动作），因此数据库系统需要在高并发响应和系统性能两方面进行平衡，这样就产生了“锁粒度（Lock granularity）”的概念。

一种提高共享资源并发性的方式是让锁定对象更有选择性。尽量只锁定需要修改的部分数据，而不是所有的资源。更理想的方式是，只对会修改的数据片进行精确的锁定。任何时候，在给定的资源上，锁定的数据量越少，则系统的并发程度越高，只要相互之间不发生冲突即可。

- **表级锁**：开销小，加锁快；不会出现死锁；锁定粒度大，发生锁冲突的概率最高，并发度最低；

- **行级锁**：开销大，加锁慢；会出现死锁；锁定粒度最小，发生锁冲突的概率最低，并发度也最高；  

- **页面锁**：开销和加锁时间界于表锁和行锁之间；会出现死锁；锁定粒度界于表锁和行锁之间，并发度一般。

适用：从锁的角度来说，表级锁更适合于以查询为主，只有少量按索引条件更新数据的应用，如Web应用；而行级锁则更适合于有大量按索引条件并发更新少量不同数据，同时又有并发查询的应用，如一些在线事务处理（OLTP）系统。



### 表锁（偏读）

#### 特点：

**偏向MyISAM存储引擎，开销小，加锁快，无死锁；锁定粒度大，发生锁冲突的概率最高，并发度最低**

MyISAM在执行查询语句（SELECT）前，会自动给涉及的所有表加读锁，在执行增删改操作前，会自动给涉及的表加写锁。 
MySQL的表级锁有两种模式：

- 表共享读锁（Table Read Lock）
- 表独占写锁（Table Write Lock）

| 锁类型 | 可否兼容 | 读锁 | 写锁 |
| ------ | -------- | ---- | ---- |
| 读锁   | 是       | 是   | 否   |
| 写锁   | 是       | 否   | 否   |


 结合上表，所以对MyISAM表进行操作，会有以下情况： 

1. 对MyISAM表的读操作（加读锁），不会阻塞其他进程对同一表的读请求，但会阻塞对同一表的写请求。只有当读锁释放后，才会执行其它进程的写操作。 
2. 对MyISAM表的写操作（加写锁），会阻塞其他进程对同一表的读和写操作，只有当写锁释放后，才会执行其它进程的读写操作。

简而言之，就是读锁会阻塞写，但是不会堵塞读。而写锁则会把读和写都堵塞。

MyISAM表的读操作与写操作之间，以及写操作之间是串行的。当一个线程获得对一个表的写锁后，只有持有锁的线程可以对表进行更新操作。其他线程的读、写操作都会等待，直到锁被释放为止。

#### 如何加表锁

MyISAM在执行查询语句（SELECT）前，会自动给涉及的所有表加读锁，在执行更新操作（UPDATE、DELETE、INSERT等）前，会自动给涉及的表加写锁，这个过程并不需要用户干预，因此，用户一般不需要直接用LOCK TABLE命令给MyISAM表显式加锁。

#### MyISAM表锁优化建议

对于MyISAM存储引擎，虽然使用表级锁定在锁定实现的过程中比实现行级锁定或者页级锁所带来的附加成本都要小，锁定本身所消耗的资源也是最少。但是由于锁定的颗粒度比较大，所以造成锁定资源的争用情况也会比其他的锁定级别都要多，从而在较大程度上会降低并发处理能力。所以，在优化MyISAM存储引擎锁定问题的时候，最关键的就是如何让其提高并发度。由于锁定级别是不可能改变的了，所以我们首先需要**尽可能让锁定的时间变短**，然后就是让可能并发进行的操作尽可能的并发。

看看哪些表被加锁了:

```mysql
mysql>show open tables;
```

1. ##### 查询表级锁争用情况

MySQL内部有两组专门的状态变量记录系统内部锁资源争用情况：

```mysql
mysql> show status like 'table%';
```

![image-20191203171450621](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20191203171450621.png)

这里有两个状态变量记录MySQL内部表级锁定的情况，两个变量说明如下：

- Table_locks_immediate：产生表级锁定的次数，表示可以立即获取锁的查询次数，每立即获取锁值加1 

- Table_locks_waited：出现表级锁定争用而发生等待的次数(不能立即获取锁的次数，每等待一次锁值加1)，此值高则说明存在着较严重的表级锁争用情况

两个状态值都是从系统启动后开始记录，出现一次对应的事件则数量加1。如果这里的Table_locks_waited状态值比较高，那么说明系统中表级锁定争用现象比较严重，就需要进一步分析为什么会有较多的锁定资源争用了。

?>  此外，Myisam的读写锁调度是写优先，这也是myisam不适合做写为主表的引擎。因为写锁后，其他线程不能做任何操作，大量的更新会使查询很难得到锁，从而造成永远阻塞

2. **缩短锁定时间**

   如何让锁定时间尽可能的短呢？唯一的办法就是让我们的Query执行时间尽可能的短。

- **尽两减少大的复杂Query，将复杂Query分拆成几个小的Query分布进行；**
- **尽可能的建立足够高效的索引，让数据检索更迅速；**
- **尽量让MyISAM存储引擎的表只存放必要的信息，控制字段类型；**
- **利用合适的机会优化MyISAM表数据文件。**

3. 分离能并行的操作

   说到MyISAM的表锁，而且是读写互相阻塞的表锁，可能有些人会认为在MyISAM存储引擎的表上就只能是完全的串行化，没办法再并行了。大家不要忘记了，MyISAM的存储引擎还有一个非常有用的特性，那就是ConcurrentInsert（并发插入）的特性。

   MyISAM存储引擎有一个控制是否打开Concurrent Insert功能的参数选项：`concurrent_insert`，可以设置为0，1或者2。三个值的具体说明如下：

- concurrent_insert=2，无论MyISAM表中有没有空洞，都允许在表尾并发插入记录；

- concurrent_insert=1，如果MyISAM表中没有空洞（即表的中间没有被删除的行），MyISAM允许在一个进程读表的同时，另一个进程从表尾插入记录。这也是MySQL的默认设置；

- concurrent_insert=0，不允许并发插入。

  可以利用MyISAM存储引擎的并发插入特性，来解决应用中对同一表查询和插入的锁争用。例如，将concurrent_insert系统变量设为2，总是允许并发插入；同时，通过定期在系统空闲时段执行OPTIMIZE TABLE语句来整理空间碎片，收回因删除记录而产生的中间空洞。

4. 合理利用读写优先级

   MyISAM存储引擎的是读写互相阻塞的，那么，一个进程请求某个MyISAM表的读锁，同时另一个进程也请求同一表的写锁，MySQL如何处理呢？

   答案是写进程先获得锁。不仅如此，即使读请求先到锁等待队列，写请求后到，写锁也会插到读锁请求之前。

   这是因为MySQL的表级锁定对于读和写是有不同优先级设定的，默认情况下是写优先级要大于读优先级。

   所以，如果我们可以根据各自系统环境的差异决定读与写的优先级：

   通过执行命令SET LOW_PRIORITY_UPDATES=1，使该连接读比写的优先级高。如果我们的系统是一个以读为主，可以设置此参数，如果以写为主，则不用设置；

   通过指定INSERT、UPDATE、DELETE语句的LOW_PRIORITY属性，降低该语句的优先级。

   虽然上面方法都是要么更新优先，要么查询优先的方法，但还是可以用其来解决查询相对重要的应用（如用户登录系统）中，读锁等待严重的问题。

   另外，MySQL也提供了一种折中的办法来调节读写冲突，即给系统参数max_write_lock_count设置一个合适的值，当一个表的读锁达到这个值后，MySQL就暂时将写请求的优先级降低，给读进程一定获得锁的机会。

   这里还要强调一点：一些需要长时间运行的查询操作，也会使写进程“饿死”，因此，应用中应尽量避免出现长时间运行的查询操作，不要总想用一条SELECT语句来解决问题，因为这种看似巧妙的SQL语句，往往比较复杂，执行时间较长，在可能的情况下可以通过使用中间表等措施对SQL语句做一定的“分解”，使每一步查询都能在较短时间完成，从而减少锁冲突。如果复杂查询不可避免，应尽量安排在数据库空闲时段执行，比如一些定期统计可以安排在夜间执行。



### 行锁（偏写）

- 偏向InnoDB存储引擎，开销大，加锁慢；会出现死锁；锁定粒度最小，发生锁冲突的概率最低,并发度也最高。

- InnoDB与MyISAM的最大不同有两点：一是支持事务（TRANSACTION）；二是采用了行级锁



Innodb存储引擎由于实现了行级锁定，虽然在锁定机制的实现方面所带来的性能损耗可能比表级锁定会要更高一些，但是在整体并发处理能力方面要远远优于MyISAM的表级锁定的。当系统并发量较高的时候，Innodb的整体性能和MyISAM相比就会有比较明显的优势了。





1.InnoDB锁定模式及实现机制

考虑到行级锁定均由各个存储引擎自行实现，而且具体实现也各有差别，而InnoDB是目前事务型存储引擎中使用最为广泛的存储引擎，所以这里我们就主要分析一下InnoDB的锁定特性。

总的来说，InnoDB的锁定机制和Oracle数据库有不少相似之处。

InnoDB的行级锁定同样分为两种类型，**共享锁和排他锁**，而在锁定机制的实现过程中为了让行级锁定和表级锁定共存，InnoDB也同样使用了意向锁（表级锁定）的概念，也就有了意向共享锁和意向排他锁这两种。

当一个事务需要给自己需要的某个资源加锁的时候，如果遇到一个共享锁正锁定着自己需要的资源的时候，自己可以再加一个共享锁，不过不能加排他锁。但是，如果遇到自己需要锁定的资源已经被一个排他锁占有之后，则只能等待该锁定释放资源之后自己才能获取锁定资源并添加自己的锁定。而意向锁的作用就是当一个事务在需要获取资源锁定的时候，如果遇到自己需要的资源已经被排他锁占用的时候，该事务可以需要锁定行的表上面添加一个合适的意向锁。如果自己需要一个共享锁，那么就在表上面添加一个意向共享锁。而如果自己需要的是某行（或者某些行）上面添加一个排他锁的话，则先在表上面添加一个意向排他锁。意向共享锁可以同时并存多个，但是意向排他锁同时只能有一个存在。所以，可以说**InnoDB的锁定模式实际上可以分为四种：共享锁（S），排他锁（X），意向共享锁（IS）和意向排他锁（IX）**，我们可以通过以下表格来总结上面这四种所的共存逻辑关系：

![img](G:/youdaoLocalData/jstarfish@126.com/e78be9952e844cdd95279667202076c5/4-1417117507.png)

如果一个事务请求的锁模式与当前的锁兼容，InnoDB就将请求的锁授予该事务；反之，如果两者不兼容，该事务就要等待锁释放。

意向锁是InnoDB自动加的，不需用户干预。**对于UPDATE、DELETE和INSERT语句，InnoDB会自动给涉及数据集加排他锁**（X)；对于普通SELECT语句，InnoDB不会加任何锁；事务可以通过以下语句显示给记录集加共享锁或排他锁。

共享锁（S）：SELECT * FROM table_name WHERE ... LOCK IN SHARE MODE 排他锁（X)：SELECT * FROM table_name WHERE ... FOR UPDATE

用SELECT ... IN SHARE MODE获得共享锁，主要用在需要数据依存关系时来确认某行记录是否存在，并确保没有人对这个记录进行UPDATE或者DELETE操作。

但是如果当前事务也需要对该记录进行更新操作，则很有可能造成死锁，对于锁定行记录后需要进行更新操作的应用，应该使用SELECT... FOR UPDATE方式获得排他锁。

2.InnoDB行锁实现方式

**InnoDB行锁是通过给索引上的索引项加锁来实现的，只有通过索引条件检索数据，InnoDB才使用行级锁，否则，InnoDB将使用表锁**

在实际应用中，要特别注意InnoDB行锁的这一特性，不然的话，可能导致大量的锁冲突，从而影响并发性能。下面通过一些实际例子来加以说明。

（1）在不通过索引条件查询的时候，InnoDB确实使用的是表锁，而不是行锁。

（2）由于MySQL的行锁是针对索引加的锁，不是针对记录加的锁，所以虽然是访问不同行的记录，但是如果是使用相同的索引键，是会出现锁冲突的。

（3）当表有多个索引的时候，不同的事务可以使用不同的索引锁定不同的行，另外，不论是使用主键索引、唯一索引或普通索引，InnoDB都会使用行锁来对数据加锁。

（4）即便在条件中使用了索引字段，但是否使用索引来检索数据是由MySQL通过判断不同执行计划的代价来决定的，如果MySQL认为全表扫描效率更高，比如对一些很小的表，它就不会使用索引，这种情况下InnoDB将使用表锁，而不是行锁。因此，**在分析锁冲突时，别忘了检查SQL的执行计划，以确认是否真正使用了索引**。

3.间隙锁（Next-Key锁）

当我们用范围条件而不是相等条件检索数据，并请求共享或排他锁时，InnoDB会给符合条件的已有数据记录的索引项加锁；

对于键值在条件范围内但并不存在的记录，叫做“间隙（GAP)”，InnoDB也会对这个“间隙”加锁，这种锁机制就是所谓的间隙锁（Next-Key锁）。

例：

假如emp表中只有101条记录，其empid的值分别是 1,2,...,100,101，下面的SQL：

mysql> select * from emp where empid > **100** for update;

是一个范围条件的检索，InnoDB不仅会对符合条件的empid值为101的记录加锁，也会对empid大于101（这些记录并不存在）的“间隙”加锁。

InnoDB使用间隙锁的目的：

（1）防止幻读，以满足相关隔离级别的要求。对于上面的例子，要是不使用间隙锁，如果其他事务插入了empid大于100的任何记录，那么本事务如果再次执行上述语句，就会发生幻读；

（2）为了满足其恢复和复制的需要。

很显然，在使用范围条件检索并锁定记录时，即使某些不存在的键值也会被无辜的锁定，而造成在锁定的时候无法插入锁定键值范围内的任何数据。在某些场景下这可能会对性能造成很大的危害。

除了间隙锁给InnoDB带来性能的负面影响之外，通过索引实现锁定的方式还存在其他几个较大的性能隐患：

（1）当Query无法利用索引的时候，InnoDB会放弃使用行级别锁定而改用表级别的锁定，造成并发性能的降低；

（2）当Query使用的索引并不包含所有过滤条件的时候，数据检索使用到的索引键所只想的数据可能有部分并不属于该Query的结果集的行列，但是也会被锁定，因为间隙锁锁定的是一个范围，而不是具体的索引键；

（3）当Query在使用索引定位数据的时候，如果使用的索引键一样但访问的数据行不同的时候（索引只是过滤条件的一部分），一样会被锁定。

因此，**在实际应用开发中，尤其是并发插入比较多的应用，我们要尽量优化业务逻辑，尽量使用相等条件来访问更新数据，避免使用范围条件。**

还要特别说明的是，InnoDB除了通过范围条件加锁时使用间隙锁外，如果使用相等条件请求给一个不存在的记录加锁，InnoDB也会使用间隙锁。

4.死锁

上文讲过，MyISAM表锁是deadlock free的，这是因为MyISAM总是一次获得所需的全部锁，要么全部满足，要么等待，因此不会出现死锁。但在InnoDB中，除单个SQL组成的事务外，锁是逐步获得的，当两个事务都需要获得对方持有的排他锁才能继续完成事务，这种循环锁等待就是典型的死锁。

在InnoDB的事务管理和锁定机制中，有专门检测死锁的机制，会在系统中产生死锁之后的很短时间内就检测到该死锁的存在。当InnoDB检测到系统中产生了死锁之后，InnoDB会通过相应的判断来选这产生死锁的两个事务中较小的事务来回滚，而让另外一个较大的事务成功完成。

那InnoDB是以什么来为标准判定事务的大小的呢？MySQL官方手册中也提到了这个问题，实际上在InnoDB发现死锁之后，会计算出两个事务各自插入、更新或者删除的数据量来判定两个事务的大小。也就是说哪个事务所改变的记录条数越多，在死锁中就越不会被回滚掉。

但是有一点需要注意的就是，当产生死锁的场景中涉及到不止InnoDB存储引擎的时候，InnoDB是没办法检测到该死锁的，这时候就只能通过锁定超时限制参数InnoDB_lock_wait_timeout来解决。

需要说明的是，这个参数并不是只用来解决死锁问题，在并发访问比较高的情况下，如果大量事务因无法立即获得所需的锁而挂起，会占用大量计算机资源，造成严重性能问题，甚至拖跨数据库。我们通过设置合适的锁等待超时阈值，可以避免这种情况发生。

通常来说，死锁都是应用设计的问题，通过调整业务流程、数据库对象设计、事务大小，以及访问数据库的SQL语句，绝大部分死锁都可以避免。下面就通过实例来介绍几种避免死锁的常用方法：

（1）在应用中，如果不同的程序会并发存取多个表，应尽量约定以相同的顺序来访问表，这样可以大大降低产生死锁的机会。

（2）在程序以批量方式处理数据的时候，如果事先对数据排序，保证每个线程按固定的顺序来处理记录，也可以大大降低出现死锁的可能。

（3）在事务中，如果要更新记录，应该直接申请足够级别的锁，即排他锁，而不应先申请共享锁，更新时再申请排他锁，因为当用户申请排他锁时，其他事务可能又已经获得了相同记录的共享锁，从而造成锁冲突，甚至死锁。

（4）在REPEATABLE-READ隔离级别下，如果两个线程同时对相同条件记录用SELECT...FOR UPDATE加排他锁，在没有符合该条件记录情况下，两个线程都会加锁成功。程序发现记录尚不存在，就试图插入一条新记录，如果两个线程都这么做，就会出现死锁。这种情况下，将隔离级别改成READ COMMITTED，就可避免问题。

（5）当隔离级别为READ COMMITTED时，如果两个线程都先执行SELECT...FOR UPDATE，判断是否存在符合条件的记录，如果没有，就插入记录。此时，只有一个线程能插入成功，另一个线程会出现锁等待，当第1个线程提交后，第2个线程会因主键重出错，但虽然这个线程出错了，却会获得一个排他锁。这时如果有第3个线程又来申请排他锁，也会出现死锁。对于这种情况，可以直接做插入操作，然后再捕获主键重异常，或者在遇到主键重错误时，总是执行ROLLBACK释放获得的排他锁。

5.**什么时候使用表锁**

对于InnoDB表，在绝大部分情况下都应该使用行级锁，因为事务和行锁往往是我们之所以选择InnoDB表的理由。但在个别特殊事务中，也可以考虑使用表级锁：

（1）**事务需要更新大部分或全部数据，表又比较大，如果使用默认的行锁，不仅这个事务执行效率低，而且可能造成其他事务长时间锁等待和锁冲突，这种情况下可以考虑使用表锁来提高该事务的执行速度。**

（2）**事务涉及多个表，比较复杂，很可能引起死锁，造成大量事务回滚。这种情况也可以考虑一次性锁定事务涉及的表，从而避免死锁、减少数据库因事务回滚带来的开销。**

当然，应用中这两种事务不能太多，否则，就应该考虑使用MyISAM表了。

在InnoDB下，使用表锁要注意以下两点。

（1）使用LOCK TABLES虽然可以给InnoDB加表级锁，但必须说明的是，表锁不是由InnoDB存储引擎层管理的，而是由其上一层──MySQL Server负责的，仅当autocommit=0、InnoDB_table_locks=1（默认设置）时，InnoDB层才能知道MySQL加的表锁，MySQL Server也才能感知InnoDB加的行锁，这种情况下，InnoDB才能自动识别涉及表级锁的死锁，否则，InnoDB将无法自动检测并处理这种死锁。

（2）在用 LOCK TABLES对InnoDB表加锁时要注意，要将AUTOCOMMIT设为0，否则MySQL不会给表加锁；事务结束前，不要用UNLOCK TABLES释放表锁，因为UNLOCK TABLES会隐含地提交事务；COMMIT或ROLLBACK并不能释放用LOCK TABLES加的表级锁，必须用UNLOCK TABLES释放表锁。正确的方式见如下语句：

例如，如果需要写表t1并从表t读，可以按如下做：

SET AUTOCOMMIT=**0**; LOCK TABLES t1 WRITE, t2 READ, ...; [do something with tables t1 and t2 here]; COMMIT; UNLOCK TABLES;

6.InnoDB行锁优化建议

InnoDB存储引擎由于实现了行级锁定，虽然在锁定机制的实现方面所带来的性能损耗可能比表级锁定会要更高一些，但是在整体并发处理能力方面要远远优于MyISAM的表级锁定的。当系统并发量较高的时候，InnoDB的整体性能和MyISAM相比就会有比较明显的优势了。但是，InnoDB的行级锁定同样也有其脆弱的一面，当我们使用不当的时候，可能会让InnoDB的整体性能表现不仅不能比MyISAM高，甚至可能会更差。

（1）要想合理利用InnoDB的行级锁定，做到扬长避短，我们必须做好以下工作：

a)尽可能让所有的数据检索都通过索引来完成，从而避免InnoDB因为无法通过索引键加锁而升级为表级锁定；

b)合理设计索引，让InnoDB在索引键上面加锁的时候尽可能准确，尽可能的缩小锁定范围，避免造成不必要的锁定而影响其他Query的执行；

c)尽可能减少基于范围的数据检索过滤条件，避免因为间隙锁带来的负面影响而锁定了不该锁定的记录；

d)尽量控制事务的大小，减少锁定的资源量和锁定时间长度；

e)在业务环境允许的情况下，尽量使用较低级别的事务隔离，以减少MySQL因为实现事务隔离级别所带来的附加成本。

（2）由于InnoDB的行级锁定和事务性，所以肯定会产生死锁，下面是一些比较常用的减少死锁产生概率的小建议：

a)类似业务模块中，尽可能按照相同的访问顺序来访问，防止产生死锁；

b)在同一个事务中，尽可能做到一次锁定所需要的所有资源，减少死锁产生概率；

c)对于非常容易产生死锁的业务部分，可以尝试使用升级锁定颗粒度，通过表级锁定来减少死锁产生的概率。

（3）可以通过检查InnoDB_row_lock状态变量来分析系统上的行锁的争夺情况：

mysql> show status like 'InnoDB_row_lock%'; +-------------------------------+-------+| Variable_name         | Value |+-------------------------------+-------+| InnoDB_row_lock_current_waits | **0**   || InnoDB_row_lock_time     | **0**   || InnoDB_row_lock_time_avg   | **0**   || InnoDB_row_lock_time_max   | **0**   || InnoDB_row_lock_waits     | **0**   |+-------------------------------+-------+

InnoDB 的行级锁定状态变量不仅记录了锁定等待次数，还记录了锁定总时长，每次平均时长，以及最大时长，此外还有一个非累积状态量显示了当前正在等待锁定的等待数量。对各个状态量的说明如下：

InnoDB_row_lock_current_waits：当前正在等待锁定的数量；

InnoDB_row_lock_time：从系统启动到现在锁定总时间长度；

InnoDB_row_lock_time_avg：每次等待所花平均时间；

InnoDB_row_lock_time_max：从系统启动到现在等待最常的一次所花的时间；

InnoDB_row_lock_waits：系统启动后到现在总共等待的次数；

对于这5个状态变量，比较重要的主要是InnoDB_row_lock_time_avg（等待平均时长），InnoDB_row_lock_waits（等待总次数）以及InnoDB_row_lock_time（等待总时长）这三项。尤其是当等待次数很高，而且每次等待时长也不小的时候，我们就需要分析系统中为什么会有如此多的等待，然后根据分析结果着手指定优化计划。

如果发现锁争用比较严重，如InnoDB_row_lock_waits和InnoDB_row_lock_time_avg的值比较高，还可以通过设置InnoDB Monitors 来进一步观察发生锁冲突的表、数据行等，并分析锁争用的原因。

锁冲突的表、数据行等，并分析锁争用的原因。具体方法如下：

mysql> create table InnoDB_monitor(a INT) engine=InnoDB;

然后就可以用下面的语句来进行查看：

mysql> show engine InnoDB status;

监视器可以通过发出下列语句来停止查看：

mysql> drop table InnoDB_monitor;

设置监视器后，会有详细的当前锁等待的信息，包括表名、锁类型、锁定记录的情况等，便于进行进一步的分析和问题的确定。可能会有读者朋友问为什么要先创建一个叫InnoDB_monitor的表呢？因为创建该表实际上就是告诉InnoDB我们开始要监控他的细节状态了，然后InnoDB就会将比较详细的事务以及锁定信息记录进入MySQL的errorlog中，以便我们后面做进一步分析使用。打开监视器以后，默认情况下每15秒会向日志中记录监控的内容，如果长时间打开会导致.err文件变得非常的巨大，所以用户在确认问题原因之后，要记得删除监控表以关闭监视器，或者通过使用“--console”选项来启动服务器以关闭写日志文件。

锁，在现实生活中是为我们想要隐藏于外界所使用的一种工具。在计算机中，是协调多个进程或县城并发访问某一资源的一种机制。在数据库当中，除了传统的计算资源（CPU、RAM、I/O等等）的争用之外，数据也是一种供许多用户共享访问的资源。如何保证数据并发访问的一致性、有效性，是所有数据库必须解决的一个问题，锁的冲突也是影响数据库并发访问性能的一个重要因素。从这一角度来说，锁对于数据库而言就显得尤为重要。

**MySQL锁**

相对于其他的数据库而言，MySQL的锁机制比较简单，最显著的特点就是不同的存储引擎支持不同的锁机制。根据不同的存储引擎，MySQL中锁的特性可以大致归纳如下：

|        | 行锁 | 表锁 | 页锁 |
| ------ | ---- | ---- | ---- |
| MyISAM |      | √    |      |
| BDB    |      | √    | √    |
| InnoDB | √    | √    |      |

**开销、加锁速度、死锁、粒度、并发性能**

- 表锁： 开销小，加锁快；不会出现死锁；锁定力度大，发生锁冲突概率高，并发度最低
- 行锁： 开销大，加锁慢；会出现死锁；锁定粒度小，发生锁冲突的概率低，并发度高
- 页锁： 开销和加锁速度介于表锁和行锁之间；会出现死锁；锁定粒度介于表锁和行锁之间，并发度一般

从上述的特点课件，很难笼统的说哪种锁最好，只能根据具体应用的特点来说哪种锁更加合适。仅仅从锁的角度来说的话：

表锁更适用于以查询为主，只有少量按索引条件更新数据的应用；行锁更适用于有大量按索引条件并发更新少量不同数据，同时又有并发查询的应用。（PS：由于BDB已经被InnoDB所取代，我们只讨论MyISAM表锁和InnoDB行锁的问题）

**简而言之，就是读锁会阻塞写，但是不会阻塞读，而写锁则会把读和写都阻塞**

**MyISAM表锁**

MyISAM存储引擎只支持表锁，这也是MySQL开始几个版本中唯一支持的锁类型。随着应用对事务完整性和并发性要求的不断提高，MySQL才开始开发基于事务的存储引擎，后来慢慢出现了支持页锁的BDB存储引擎和支持行锁的InnoDB存储引擎（实际 InnoDB是单独的一个公司，现在已经被Oracle公司收购）。但是MyISAM的表锁依然是使用最为广泛的锁类型。本节将详细介绍MyISAM表锁的使用。

查询表级锁争用情况

可以通过检查table_locks_waited和table_locks_immediate状态变量来分析系统上的表锁定争夺：

mysql> show status like 'table%';

+-----------------------+-------+

| Variable_name     | Value |

+-----------------------+-------+

| Table_locks_immediate | 2979 |

| Table_locks_waited  | 0   |

+-----------------------+-------+

2 rows in set (0.00 sec))

如果Table_locks_waited的值比较高，则说明存在着较严重的表级锁争用情况。

MySQL表级锁的锁模式

MySQL的表级锁有两种模式：表共享读锁（Table Read Lock）和表独占写锁（Table Write Lock）。锁模式的兼容性如下表所示。 

​                     MySQL中的表锁兼容性        

| 请求锁模式 是否兼容 当前锁模式 | 是否兼容 | 读锁 | 写锁 |
| ------------------------------ | -------- | ---- | ---- |
| 读锁                           | 是       | 是   | 否   |
| 写锁                           | 是       | 否   | 否   |

可见，对MyISAM表的读操作，不会阻塞其他用户对同一表的读请求，但会阻塞对同一表的写请求；对 MyISAM表的写操作，则会阻塞其他用户对同一表的读和写操作；MyISAM表的读操作与写操作之间，以及写操作之间是串行的！根据如下表所示的例子可以知道，当一个线程获得对一个表的写锁后，只有持有锁的线程可以对表进行更新操作。其他线程的读、写操作都会等待，直到锁被释放为止。

​            MyISAM存储引擎的写阻塞读例子

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 获得表film_text的WRITE锁定 mysql> lock table film_text write; Query OK, 0 rows affected (0.00 sec) |                                                              |
| 当前session对锁定表的查询、更新、插入操作都可以执行： mysql> select film_id,title from film_text where film_id = 1001; +---------+-------------+ \| film_id \| title \| +---------+-------------+ \| 1001 \| Update Test \| +---------+-------------+ 1 row in set (0.00 sec) mysql> insert into film_text (film_id,title) values(1003,'Test'); Query OK, 1 row affected (0.00 sec) mysql> update film_text set title = 'Test' where film_id = 1001; Query OK, 1 row affected (0.00 sec) Rows matched: 1 Changed: 1 Warnings: 0 | 其他session对锁定表的查询被阻塞，需要等待锁被释放： mysql> select film_id,title from film_text where film_id = 1001; 等待 |
| 释放锁： mysql> unlock tables; Query OK, 0 rows affected (0.00 sec) | 等待                                                         |
|                                                              | Session2获得锁，查询返回： mysql> select film_id,title from film_text where film_id = 1001; +---------+-------+ \| film_id \| title \| +---------+-------+ \| 1001 \| Test \| +---------+-------+ 1 row in set (57.59 sec) |

如何加表锁

SAM在执行查询语句（SELECT）前，会自动给涉及的所有表加读锁，在执行更新操作（UPDATE、DELETE、INSERT等）前，会自动给涉及的表加写锁，这个过程并不需要用户干预，因此，用户一般不需要直接用LOCK TABLE命令给MyISAM表显式加锁。在本书的示例中，显式加锁基本上都是为了方便而已，并非必须如此。

给MyISAM表显示加锁，一般是为了在一定程度模拟事务操作，实现对某一时间点多个表的一致性读取。例如，有一个订单表orders，其中记录有各订单的总金额total，同时还有一个订单明细表order_detail，其中记录有各订单每一产品的金额小计 subtotal，假设我们需要检查这两个表的金额合计是否相符，可能就需要执行如下两条SQL：

Select sum(total) from orders;

Select sum(subtotal) from order_detail;

这时，如果不先给两个表加锁，就可能产生错误的结果，因为第一条语句执行过程中，order_detail表可能已经发生了改变。因此，正确的方法应该是：

Lock tables orders read local, order_detail read local;

Select sum(total) from orders;

Select sum(subtotal) from order_detail;

Unlock tables;

要特别说明以下两点内容。

- 上面的例子在LOCK TABLES时加了“local”选项，其作用就是在满足MyISAM表并发插入条件的情况下，允许其他用户在表尾并发插入记录，有关MyISAM表的并发插入问题，在后面的章节中还会进一步介绍。
- 在用LOCK TABLES给表显式加表锁时，必须同时取得所有涉及到表的锁，并且MySQL不支持锁升级。也就是说，在执行LOCK TABLES后，只能访问显式加锁的这些表，不能访问未加锁的表；同时，如果加的是读锁，那么只能执行查询操作，而不能执行更新操作。其实，在自动加锁的情况下也基本如此，MyISAM总是一次获得SQL语句所需要的全部锁。这也正是MyISAM表不会出现死锁（Deadlock Free）的原因。

在如下表所示的例子中，一个session使用LOCK TABLE命令给表film_text加了读锁，这个session可以查询锁定表中的记录，但更新或访问其他表都会提示错误；同时，另外一个session可以查询表中的记录，但更新就会出现锁等待。

MyISAM存储引擎的读阻塞写例子

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 获得表film_text的READ锁定 mysql> lock table film_text read; Query OK, 0 rows affected (0.00 sec) |                                                              |
| 当前session可以查询该表记录 mysql> select film_id,title from film_text where film_id = 1001; +---------+------------------+ \| film_id \| title \| +---------+------------------+ \| 1001 \| ACADEMY DINOSAUR \| +---------+------------------+ 1 row in set (0.00 sec) | 其他session也可以查询该表的记录 mysql> select film_id,title from film_text where film_id = 1001; +---------+------------------+ \| film_id \| title \| +---------+------------------+ \| 1001 \| ACADEMY DINOSAUR \| +---------+------------------+ 1 row in set (0.00 sec) |
| 当前session不能查询没有锁定的表 mysql> select film_id,title from film where film_id = 1001; ERROR 1100 (HY000): Table 'film' was not locked with LOCK TABLES | 其他session可以查询或者更新未锁定的表 mysql> select film_id,title from film where film_id = 1001; +---------+---------------+ \| film_id \| title \| +---------+---------------+ \| 1001 \| update record \| +---------+---------------+ 1 row in set (0.00 sec) mysql> update film set title = 'Test' where film_id = 1001; Query OK, 1 row affected (0.04 sec) Rows matched: 1 Changed: 1 Warnings: 0 |
| 当前session中插入或者更新锁定的表都会提示错误： mysql> insert into film_text (film_id,title) values(1002,'Test'); ERROR 1099 (HY000): Table 'film_text' was locked with a READ lock and can't be updated mysql> update film_text set title = 'Test' where film_id = 1001; ERROR 1099 (HY000): Table 'film_text' was locked with a READ lock and can't be updated | 其他session更新锁定表会等待获得锁： mysql> update film_text set title = 'Test' where film_id = 1001; 等待 |
| 释放锁 mysql> unlock tables; Query OK, 0 rows affected (0.00 sec) | 等待                                                         |
|                                                              | Session获得锁，更新操作完成： mysql> update film_text set title = 'Test' where film_id = 1001; Query OK, 1 row affected (1 min 0.71 sec) Rows matched: 1 Changed: 1 Warnings: 0 |

注意，当使用LOCK TABLES时，不仅需要一次锁定用到的所有表，而且，同一个表在SQL语句中出现多少次，就要通过与SQL语句中相同的别名锁定多少次，否则也会出错！举例说明如下。

（1）对actor表获得读锁：

mysql> lock table actor read;

Query OK, 0 rows affected (0.00 sec)

（2）但是通过别名访问会提示错误：

mysql> select a.first_name,a.last_name,b.first_name,b.last_name from actor a,actor b where a.first_name = b.first_name and a.first_name = 'Lisa' and a.last_name = 'Tom' and a.last_name <> b.last_name;

ERROR 1100 (HY000): Table 'a' was not locked with LOCK TABLES

（3）需要对别名分别锁定：

mysql> lock table actor as a read,actor as b read;

Query OK, 0 rows affected (0.00 sec)

（4）按照别名的查询可以正确执行：

mysql> select a.first_name,a.last_name,b.first_name,b.last_name from actor a,actor b where a.first_name = b.first_name and a.first_name = 'Lisa' and a.last_name = 'Tom' and a.last_name <> b.last_name;

+------------+-----------+------------+-----------+

| first_name | last_name | first_name | last_name |

+------------+-----------+------------+-----------+

| Lisa    | Tom    | LISA    | MONROE  |

+------------+-----------+------------+-----------+

1 row in set (0.00 sec)

![img](G:/youdaoLocalData/jstarfish@126.com/c4e9cd1896e64a8b80c71368ba376ee5/clipboard.png)

![img](G:/youdaoLocalData/jstarfish@126.com/91d5839d896749d6bf1c6ff1e1c1c82a/clipboard.png)

并发插入（Concurrent Inserts）

上文提到过MyISAM表的读和写是串行的，但这是就总体而言的。在一定条件下，MyISAM表也支持查询和插入操作的并发进行。

MyISAM存储引擎有一个系统变量concurrent_insert，专门用以控制其并发插入的行为，其值分别可以为0、1或2。

- 当concurrent_insert设置为0时，不允许并发插入。
- 当concurrent_insert设置为1时，如果MyISAM表中没有空洞（即表的中间没有被删除的行），MyISAM允许在一个进程读表的同时，另一个进程从表尾插入记录。这也是MySQL的默认设置。
- 当concurrent_insert设置为2时，无论MyISAM表中有没有空洞，都允许在表尾并发插入记录。

在如下表所示的例子中，session_1获得了一个表的READ LOCAL锁，该线程可以对表进行查询操作，但不能对表进行更新操作；其他的线程（session_2），虽然不能对表进行删除和更新操作，但却可以对该表进行并发插入操作，这里假设该表中间不存在空洞。

​       MyISAM存储引擎的读写（INSERT）并发例子

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 获得表film_text的READ LOCAL锁定 mysql> lock table film_text read local; Query OK, 0 rows affected (0.00 sec) |                                                              |
| 当前session不能对锁定表进行更新或者插入操作： mysql> insert into film_text (film_id,title) values(1002,'Test'); ERROR 1099 (HY000): Table 'film_text' was locked with a READ lock and can't be updated mysql> update film_text set title = 'Test' where film_id = 1001; ERROR 1099 (HY000): Table 'film_text' was locked with a READ lock and can't be updated | 其他session可以进行插入操作，但是更新会等待： mysql> insert into film_text (film_id,title) values(1002,'Test'); Query OK, 1 row affected (0.00 sec) mysql> update film_text set title = 'Update Test' where film_id = 1001; 等待 |
| 当前session不能访问其他session插入的记录： mysql> select film_id,title from film_text where film_id = 1002; Empty set (0.00 sec) |                                                              |
| 释放锁： mysql> unlock tables; Query OK, 0 rows affected (0.00 sec) | 等待                                                         |
| 当前session解锁后可以获得其他session插入的记录： mysql> select film_id,title from film_text where film_id = 1002; +---------+-------+ \| film_id \| title \| +---------+-------+ \| 1002 \| Test \| +---------+-------+ 1 row in set (0.00 sec) | Session2获得锁，更新操作完成： mysql> update film_text set title = 'Update Test' where film_id = 1001; Query OK, 1 row affected (1 min 17.75 sec) Rows matched: 1 Changed: 1 Warnings: 0 |

可以利用MyISAM存储引擎的并发插入特性，来解决应用中对同一表查询和插入的锁争用。例如，将concurrent_insert系统变量设为2，总是允许并发插入；同时，通过定期在系统空闲时段执行 OPTIMIZE TABLE语句来整理空间碎片，收回因删除记录而产生的中间空洞。有关OPTIMIZE TABLE语句的详细介绍，可以参见第18章中“两个简单实用的优化方法”一节的内容。

**MyISAM的锁调度**

前面讲过，MyISAM存储引擎的读锁和写锁是互斥的，读写操作是串行的。那么，一个进程请求某个 MyISAM表的读锁，同时另一个进程也请求同一表的写锁，MySQL如何处理呢？答案是写进程先获得锁。不仅如此，即使读请求先到锁等待队列，写请求后到，写锁也会插到读锁请求之前！这是因为MySQL认为写请求一般比读请求要重要。这也正是MyISAM表不太适合于有大量更新操作和查询操作应用的原因，因为，大量的更新操作会造成查询操作很难获得读锁，从而可能永远阻塞。这种情况有时可能会变得非常糟糕！幸好我们可以通过一些设置来调节MyISAM 的调度行为。

- 通过指定启动参数low-priority-updates，使MyISAM引擎默认给予读请求以优先的权利。
- 通过执行命令SET LOW_PRIORITY_UPDATES=1，使该连接发出的更新请求优先级降低。
- 通过指定INSERT、UPDATE、DELETE语句的LOW_PRIORITY属性，降低该语句的优先级。

虽然上面3种方法都是要么更新优先，要么查询优先的方法，但还是可以用其来解决查询相对重要的应用（如用户登录系统）中，读锁等待严重的问题。

另外，MySQL也提供了一种折中的办法来调节读写冲突，即给系统参数max_write_lock_count设置一个合适的值，当一个表的读锁达到这个值后，MySQL就暂时将写请求的优先级降低，给读进程一定获得锁的机会。

上面已经讨论了写优先调度机制带来的问题和解决办法。这里还要强调一点：一些需要长时间运行的查询操作，也会使写进程“饿死”！因此，应用中应尽量避免出现长时间运行的查询操作，不要总想用一条SELECT语句来解决问题，因为这种看似巧妙的SQL语句，往往比较复杂，执行时间较长，在可能的情况下可以通过使用中间表等措施对SQL语句做一定的“分解”，使每一步查询都能在较短时间完成，从而减少锁冲突。如果复杂查询不可避免，应尽量安排在数据库空闲时段执行，比如一些定期统计可以安排在夜间执行。

**InnoDB锁问题**

InnoDB与MyISAM的最大不同有两点：一是支持事务（TRANSACTION）；二是采用了行级锁。行级锁与表级锁本来就有许多不同之处，另外，事务的引入也带来了一些新问题。下面我们先介绍一点背景知识，然后详细讨论InnoDB的锁问题。

背景知识

1．事务（Transaction）及其ACID属性

事务是由一组SQL语句组成的逻辑处理单元，事务具有以下4个属性，通常简称为事务的ACID属性。

- 原子性（Atomicity）：事务是一个原子操作单元，其对数据的修改，要么全都执行，要么全都不执行。
- 一致性（Consistent）：在事务开始和完成时，数据都必须保持一致状态。这意味着所有相关的数据规则都必须应用于事务的修改，以保持数据的完整性；事务结束时，所有的内部数据结构（如B树索引或双向链表）也都必须是正确的。
- 隔离性（Isolation）：数据库系统提供一定的隔离机制，保证事务在不受外部并发操作影响的“独立”环境执行。这意味着事务处理过程中的中间状态对外部是不可见的，反之亦然。
- 持久性（Durable）：事务完成之后，它对于数据的修改是永久性的，即使出现系统故障也能够保持。

银行转帐就是事务的一个典型例子。

2．并发事务处理带来的问题

相对于串行处理来说，并发事务处理能大大增加数据库资源的利用率，提高数据库系统的事务吞吐量，从而可以支持更多的用户。但并发事务处理也会带来一些问题，主要包括以下几种情况。

- **更新丢失（Lost Update）：**当两个或多个事务选择同一行，然后基于最初选定的值更新该行时，由于每个事务都不知道其他事务的存在，就会发生丢失更新问题－－最后的更新覆盖了由其他事务所做的更新。例如，两个编辑人员制作了同一文档的电子副本。每个编辑人员独立地更改其副本，然后保存更改后的副本，这样就覆盖了原始文档。最后保存其更改副本的编辑人员覆盖另一个编辑人员所做的更改。如果在一个编辑人员完成并提交事务之前，另一个编辑人员不能访问同一文件，则可避免此问题。
- **脏读（Dirty Reads）：**一个事务正在对一条记录做修改，在这个事务完成并提交前，这条记录的数据就处于不一致状态；这时，另一个事务也来读取同一条记录，如果不加控制，第二个事务读取了这些“脏”数据，并据此做进一步的处理，就会产生未提交的数据依赖关系。这种现象被形象地叫做"脏读"。
- **不可重复读（Non-Repeatable Reads）：**一个事务在读取某些数据后的某个时间，再次读取以前读过的数据，却发现其读出的数据已经发生了改变、或某些记录已经被删除了！这种现象就叫做“不可重复读”。
- **幻读（Phantom Reads）：**一个事务按相同的查询条件重新读取以前检索过的数据，却发现其他事务插入了满足其查询条件的新数据，这种现象就称为“幻读”。

3．事务隔离级别

在上面讲到的并发事务处理带来的问题中**，“更新丢失”通常是应该完全避免的。但防止更新丢失，并不能单靠数据库事务控制器来解决，需要应用程序对要更新的数据加必要的锁来解决，因此，防止更新丢失应该是应用的责任。**

**“脏读”、“不可重复读”和“幻读”，其实都是数据库读一致性问题，必须由数据库提供一定的事务隔离机制来解决。**数据库实现事务隔离的方式，基本上可分为以下两种。

- 一种是在读取数据前，对其加锁，阻止其他事务对数据进行修改。
- 另一种是不用加任何锁，通过一定机制生成一个数据请求时间点的一致性数据快照（Snapshot)，并用这个快照来提供一定级别（语句级或事务级）的一致性读取。从用户的角度来看，好像是数据库可以提供同一数据的多个版本，因此，这种技术叫做数据**多版本并发控制**（MultiVersion Concurrency Control，简称MVCC或MCC），也经常称为多版本数据库。

数据库的事务隔离越严格，并发副作用越小，但付出的代价也就越大，因为事务隔离实质上就是使事务在一定程度上 “串行化”进行，这显然与“并发”是矛盾的。同时，不同的应用对读一致性和事务隔离程度的要求也是不同的，比如许多应用对“不可重复读”和“幻读”并不敏感，可能更关心数据并发访问的能力。

为了解决“隔离”与“并发”的矛盾，ISO/ANSI SQL92定义了4个事务隔离级别，每个级别的隔离程度不同，允许出现的副作用也不同，应用可以根据自己的业务逻辑要求，通过选择不同的隔离级别来平衡 “隔离”与“并发”的矛盾。下表很好地概括了这4个隔离级别的特性。

​                      4种隔离级别比较

| 读数据一致性及允许的并发副作用 隔离级别 | 读数据一致性                                 | 脏读   | 不可重复读 | 幻读   |
| --------------------------------------- | -------------------------------------------- | ------ | ---------- | ------ |
| **未提交读（Read uncommitted）**        | **最低级别，只能保证不读取物理上损坏的数据** | **是** | **是**     | **是** |
| **已提交度（Read committed）**          | **语句级**                                   | **否** | **是**     | **是** |
| **可重复读（Repeatable read）**         | **事务级**                                   | **否** | **否**     | **是** |
| **可序列化（Serializable）**            | **最高级别，事务级**                         | **否** | **否**     | **否** |

最后要说明的是：各具体数据库并不一定完全实现了上述4个隔离级别，例如，Oracle只提供Read committed和Serializable两个标准隔离级别，另外还提供自己定义的Read only隔离级别；SQL Server除支持上述ISO/ANSI SQL92定义的4个隔离级别外，还支持一个叫做“快照”的隔离级别，但严格来说它是一个用MVCC实现的Serializable隔离级别。MySQL 支持全部4个隔离级别，但在具体实现时，有一些特点，比如在一些隔离级别下是采用MVCC一致性读，但某些情况下又不是，这些内容在后面的章节中将会做进一步介绍。

获取InnoDB行锁争用情况  

可以通过检查InnoDB_row_lock状态变量来分析系统上的行锁的争夺情况：

mysql> **show status like 'innodb_row_lock%';**

+-------------------------------+-------+

| Variable_name         | Value |

+-------------------------------+-------+

| InnoDB_row_lock_current_waits | 0   |

| InnoDB_row_lock_time     | 0   |

| InnoDB_row_lock_time_avg   | 0   |

| InnoDB_row_lock_time_max   | 0   |

| InnoDB_row_lock_waits     | 0   |

+-------------------------------+-------+

5 rows in set (0.01 sec)

**如果发现锁争用比较严重，如InnoDB_row_lock_waits和InnoDB_row_lock_time_avg的值比较高**，还可以通过设置InnoDB Monitors来进一步观察发生锁冲突的表、数据行等，并分析锁争用的原因。

具体方法如下：

mysql> CREATE TABLE innodb_monitor(a INT) ENGINE=INNODB;

Query OK, 0 rows affected (0.14 sec)

然后就可以用下面的语句来进行查看：

mysql> Show innodb status\G;

*************************** 1. row ***************************

 Type: InnoDB

 Name:

Status:

…

…

\------------

TRANSACTIONS

\------------

Trx id counter 0 117472192

Purge done for trx's n:o < 0 117472190 undo n:o < 0 0

History list length 17

Total number of lock structs in row lock hash table 0

LIST OF TRANSACTIONS FOR EACH SESSION:

---TRANSACTION 0 117472185, not started, process no 11052, OS thread id 1158191456

MySQL thread id 200610, query id 291197 localhost root

---TRANSACTION 0 117472183, not started, process no 11052, OS thread id 1158723936

MySQL thread id 199285, query id 291199 localhost root

Show innodb status

…

监视器可以通过发出下列语句来停止查看：

mysql> DROP TABLE innodb_monitor;

Query OK, 0 rows affected (0.05 sec)

设置监视器后，在SHOW INNODB STATUS的显示内容中，会有详细的当前锁等待的信息，包括表名、锁类型、锁定记录的情况等，便于进行进一步的分析和问题的确定。打开监视器以后，默认情况下每15秒会向日志中记录监控的内容，如果长时间打开会导致.err文件变得非常的巨大，所以用户在确认问题原因之后，要记得删除监控表以关闭监视器，或者通过使用“--console”选项来启动服务器以关闭写日志文件。

**InnoDB的行锁模式及加锁方法**

InnoDB实现了以下两种类型的行锁。

- 共享锁（S）：允许一个事务去读一行，阻止其他事务获得相同数据集的排他锁。
- 排他锁（X)：允许获得排他锁的事务更新数据，阻止其他事务取得相同数据集的共享读锁和排他写锁。另外，为了允许行锁和表锁共存，实现多粒度锁机制，InnoDB还有两种内部使用的意向锁（Intention Locks），这两种意向锁都是表锁。
- 意向共享锁（IS）：事务打算给数据行加行共享锁，事务在给一个数据行加共享锁前必须先取得该表的IS锁。
- 意向排他锁（IX）：事务打算给数据行加行排他锁，事务在给一个数据行加排他锁前必须先取得该表的IX锁。

上述锁模式的兼容情况具体如下表所示。

​                     InnoDB行锁模式兼容性列表

| 请求锁模式 是否兼容 当前锁模式 | X    | IX   | S    | IS   |
| ------------------------------ | ---- | ---- | ---- | ---- |
| X                              | 冲突 | 冲突 | 冲突 | 冲突 |
| IX                             | 冲突 | 兼容 | 冲突 | 兼容 |
| S                              | 冲突 | 冲突 | 兼容 | 兼容 |
| IS                             | 冲突 | 兼容 | 兼容 | 兼容 |

如果一个事务请求的锁模式与当前的锁兼容，InnoDB就将请求的锁授予该事务；反之，如果两者不兼容，该事务就要等待锁释放。

意向锁是InnoDB自动加的，不需用户干预。对于UPDATE、DELETE和INSERT语句，InnoDB会自动给涉及数据集加排他锁（X)；对于普通SELECT语句，InnoDB不会加任何锁；事务可以通过以下语句显示给记录集加共享锁或排他锁。

- 共享锁（S）：SELECT * FROM table_name WHERE ... LOCK IN SHARE MODE。
- 排他锁（X)：SELECT * FROM table_name WHERE ... FOR UPDATE。

用SELECT ... IN SHARE MODE获得共享锁，主要用在需要数据依存关系时来确认某行记录是否存在，并确保没有人对这个记录进行UPDATE或者DELETE操作。但是如果当前事务也需要对该记录进行更新操作，则很有可能造成死锁，对于锁定行记录后需要进行更新操作的应用，应该使用SELECT... FOR UPDATE方式获得排他锁。

在如下表所示的例子中，使用了SELECT ... IN SHARE MODE加锁后再更新记录，看看会出现什么情况，其中actor表的actor_id字段为主键。

 **InnoDB存储引擎的共享锁例子**

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select actor_id,first_name,last_name from actor where actor_id = 178; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE \| +----------+------------+-----------+ 1 row in set (0.00 sec) | mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select actor_id,first_name,last_name from actor where actor_id = 178; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE \| +----------+------------+-----------+ 1 row in set (0.00 sec) |
| 当前session对actor_id=178的记录加share mode 的共享锁： mysql> select actor_id,first_name,last_name from actor where actor_id = 178lock in share mode; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE \| +----------+------------+-----------+ 1 row in set (0.01 sec) |                                                              |
|                                                              | 其他session仍然可以查询记录，并也可以对该记录加share mode的共享锁： mysql> select actor_id,first_name,last_name from actor where actor_id = 178lock in share mode; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE \| +----------+------------+-----------+ 1 row in set (0.01 sec) |
| 当前session对锁定的记录进行更新操作，等待锁： mysql> update actor set last_name = 'MONROE T' where actor_id = 178; 等待 |                                                              |
|                                                              | 其他session也对该记录进行更新操作，则会导致死锁退出： mysql> update actor set last_name = 'MONROE T' where actor_id = 178; ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction |
| 获得锁后，可以成功更新： mysql> update actor set last_name = 'MONROE T' where actor_id = 178; Query OK, 1 row affected (17.67 sec) Rows matched: 1 Changed: 1 Warnings: 0 |                                                              |

  当使用SELECT...FOR UPDATE加锁后再更新记录，出现如下表所示的情况。

 **InnoDB存储引擎的排他锁例子**

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select actor_id,first_name,last_name from actor where actor_id = 178; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE \| +----------+------------+-----------+ 1 row in set (0.00 sec) | mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select actor_id,first_name,last_name from actor where actor_id = 178; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE \| +----------+------------+-----------+ 1 row in set (0.00 sec) |
| 当前session对actor_id=178的记录加for update的排它锁： mysql> select actor_id,first_name,last_name from actor where actor_id = 178 for update; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE \| +----------+------------+-----------+ 1 row in set (0.00 sec) |                                                              |
|                                                              | 其他session可以查询该记录，但是不能对该记录加共享锁，会等待获得锁： mysql> select actor_id,first_name,last_name from actor where actor_id = 178; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE \| +----------+------------+-----------+ 1 row in set (0.00 sec) mysql> select actor_id,first_name,last_name from actor where actor_id = 178 for update; 等待 |
| 当前session可以对锁定的记录进行更新操作，更新后释放锁： mysql> update actor set last_name = 'MONROE T' where actor_id = 178; Query OK, 1 row affected (0.00 sec) Rows matched: 1 Changed: 1 Warnings: 0 mysql> commit; Query OK, 0 rows affected (0.01 sec) |                                                              |
|                                                              | 其他session获得锁，得到其他session提交的记录： mysql> select actor_id,first_name,last_name from actor where actor_id = 178 for update; +----------+------------+-----------+ \| actor_id \| first_name \| last_name \| +----------+------------+-----------+ \| 178 \| LISA \| MONROE T \| +----------+------------+-----------+ 1 row in set (9.59 sec) |

**InnoDB行锁实现方式**

**InnoDB行锁是通过给索引上的索引项加锁来实现的**，这一点MySQL与Oracle不同，后者是**通过在数据块中对相应数据行加锁来实现的。InnoDB这种行锁实现特点意味着：只有通过索引条件检索数据，InnoDB才使用行级锁，否则，InnoDB将使用表锁！**

**在实际应用中，要特别注意InnoDB行锁的这一特性，不然的话，可能导致大量的锁冲突，从而影响并发性能。**下面通过一些实际例子来加以说明。

（1）在不通过索引条件查询的时候，InnoDB确实使用的是表锁，而不是行锁。

在如下所示的例子中，开始tab_no_index表没有索引：

mysql> create table tab_no_index(id int,name varchar(10)) engine=innodb;

Query OK, 0 rows affected (0.15 sec)

mysql> insert into tab_no_index values(1,'1'),(2,'2'),(3,'3'),(4,'4');

Query OK, 4 rows affected (0.00 sec)

Records: 4 Duplicates: 0 Warnings: 0

  **InnoDB存储引擎的表在不使用索引时使用表锁例子**

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) mysql> select * from tab_no_index where id = 1 ; +------+------+ \| id \| name \| +------+------+ \| 1 \| 1 \| +------+------+ 1 row in set (0.00 sec) | mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) mysql> select * from tab_no_index where id = 2 ; +------+------+ \| id \| name \| +------+------+ \| 2 \| 2 \| +------+------+ 1 row in set (0.00 sec) |
| mysql> select * from tab_no_index where id = 1 for update; +------+------+ \| id \| name \| +------+------+ \| 1 \| 1 \| +------+------+ 1 row in set (0.00 sec) |                                                              |
|                                                              | mysql> select * from tab_no_index where id = 2 for update; 等待 |

在如上表所示的例子中，看起来session_1只给一行加了排他锁，但session_2在请求其他行的排他锁时，却出现了锁等待！原因就是在没有索引的情况下，InnoDB只能使用表锁。当我们给其增加一个索引后，InnoDB就只锁定了符合条件的行，如下表所示。

创建tab_with_index表，id字段有普通索引：

mysql> create table tab_with_index(id int,name varchar(10)) engine=innodb;

Query OK, 0 rows affected (0.15 sec)

mysql> alter table tab_with_index add index id(id);

Query OK, 4 rows affected (0.24 sec)

Records: 4 Duplicates: 0 Warnings: 0

  **InnoDB存储引擎的表在使用索引时使用行锁例子**

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) mysql> select * from tab_with_index where id = 1 ; +------+------+ \| id \| name \| +------+------+ \| 1 \| 1 \| +------+------+ 1 row in set (0.00 sec) | mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) mysql> select * from tab_with_index where id = 2 ; +------+------+ \| id \| name \| +------+------+ \| 2 \| 2 \| +------+------+ 1 row in set (0.00 sec) |
| mysql> select * from tab_with_index where id = 1 for update; +------+------+ \| id \| name \| +------+------+ \| 1 \| 1 \| +------+------+ 1 row in set (0.00 sec) |                                                              |
|                                                              | mysql> select * from tab_with_index where id = 2 for update; +------+------+ \| id \| name \| +------+------+ \| 2 \| 2 \| +------+------+ 1 row in set (0.00 sec) |

（2）**由于MySQL的行锁是针对索引加的锁，不是针对记录加的锁，所以虽然是访问不同行的记录，但是如果是使用相同的索引键，是会出现锁冲突的。**应用设计的时候要注意这一点。

在如下表所示的例子中，表tab_with_index的id字段有索引，name字段没有索引：

mysql> alter table tab_with_index drop index name;

Query OK, 4 rows affected (0.22 sec)

Records: 4 Duplicates: 0 Warnings: 0

mysql> insert into tab_with_index values(1,'4');

Query OK, 1 row affected (0.00 sec)

mysql> select * from tab_with_index where id = 1;

+------+------+

| id  | name |

+------+------+

| 1  | 1  |

| 1  | 4  |

+------+------+

2 rows in set (0.00 sec)

 

**索引失效行锁变表锁**  **InnoDB存储引擎使用相同索引键的阻塞例子**    

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) | mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) |
| mysql> select * from tab_with_index where id = 1 and name = '1' for update; +------+------+ \| id \| name \| +------+------+ \| 1 \| 1 \| +------+------+ 1 row in set (0.00 sec) |                                                              |
|                                                              | 虽然session_2访问的是和session_1不同的记录，但是因为使用了相同的索引，所以需要等待锁： mysql> select * from tab_with_index where id = 1 and name = '4' for update; 等待 |

（3）当表有多个索引的时候，不同的事务可以使用不同的索引锁定不同的行，另外，不论是使用主键索引、唯一索引或普通索引，InnoDB都会使用行锁来对数据加锁。

在如下表所示的例子中，表tab_with_index的id字段有主键索引，name字段有普通索引：

mysql> alter table tab_with_index add index name(name);

Query OK, 5 rows affected (0.23 sec)

Records: 5 Duplicates: 0 Warnings: 0

 **InnoDB存储引擎的表使用不同索引的阻塞例子**

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) | mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) |
| mysql> select * from tab_with_index where id = 1 for update; +------+------+ \| id \| name \| +------+------+ \| 1 \| 1 \| \| 1 \| 4 \| +------+------+ 2 rows in set (0.00 sec) |                                                              |
|                                                              | Session_2使用name的索引访问记录，因为记录没有被索引，所以可以获得锁： mysql> select * from tab_with_index where name = '2' for update; +------+------+ \| id \| name \| +------+------+ \| 2 \| 2 \| +------+------+ 1 row in set (0.00 sec) |
|                                                              | 由于访问的记录已经被session_1锁定，所以等待获得锁。： mysql> select * from tab_with_index where name = '4' for update; |

（4）即便在条件中使用了索引字段，但是否使用索引来检索数据是由MySQL通过判断不同执行计划的代价来决定的，如果MySQL认为全表扫描效率更高，比如对一些很小的表，它就不会使用索引，这种情况下InnoDB将使用表锁，而不是行锁。**因此，在分析锁冲突时，别忘了检查SQL的执行计划，以确认是否真正使用了索引。**

在下面的例子中，检索值的数据类型与索引字段不同，虽然MySQL能够进行数据类型转换，但却不会使用索引，从而导致InnoDB使用表锁。通过用explain检查两条SQL的执行**计划，我们可以清楚地看到了这一点。**

**例子中tab_with_index表的name字段有索引，但是name字段是varchar类型的，如果where条件中不是和varchar类型进行比较，则会对name进行类型转换，而执行的全表扫描。**

mysql> alter table tab_no_index add index name(name);

Query OK, 4 rows affected (8.06 sec)

Records: 4 Duplicates: 0 Warnings: 0

mysql> explain select * from tab_with_index where name = 1 \G

*************************** 1. row ***************************

​      id: 1

 select_type: SIMPLE

​    table: tab_with_index

​     type: ALL

possible_keys: name

​     key: NULL

   key_len: NULL

​     ref: NULL

​     rows: 4

​    Extra: Using where

1 row in set (0.00 sec)

mysql> explain select * from tab_with_index where name = '1' \G

*************************** 1. row ***************************

​      id: 1

 select_type: SIMPLE

​    table: tab_with_index

​     type: ref

possible_keys: name

​     key: name

   key_len: 23

​     ref: const

​     rows: 1

​    Extra: Using where

1 row in set (0.00 sec)

**间隙锁（Next-Key锁）**

当我们用范围条件而不是相等条件检索数据，并请求共享或排他锁时，InnoDB会给符合条件的已有数据记录的索引项加锁；对于键值在条件范围内但并不存在的记录，叫做“间隙（GAP)”，InnoDB也会对这个“间隙”加锁，这种锁机制就是所谓的间隙锁（Next-Key锁）。

举例来说，假如emp表中只有101条记录，其empid的值分别是 1,2,...,100,101，下面的SQL：

Select * from emp where empid > 100 for update;

是一个范围条件的检索，InnoDB不仅会对符合条件的empid值为101的记录加锁，也会对empid大于101（这些记录并不存在）的“间隙”加锁。

InnoDB使用间隙锁的目的，一方面是为了防止幻读，以满足相关隔离级别的要求，对于上面的例子，要是不使用间隙锁，如果其他事务插入了empid大于100的任何记录，那么本事务如果再次执行上述语句，就会发生幻读；另外一方面，是为了满足其恢复和复制的需要。有关其恢复和复制对锁机制的影响，以及不同隔离级别下InnoDB使用间隙锁的情况，在后续的章节中会做进一步介绍。

很显然，在使用范围条件检索并锁定记录时，InnoDB这种加锁机制会阻塞符合条件范围内键值的并发插入，这往往会造成严重的锁等待。因此，在实际应用开发中，尤其是并发插入比较多的应用，我们要尽量优化业务逻辑，尽量使用相等条件来访问更新数据，避免使用范围条件。

还要特别说明的是，InnoDB除了通过范围条件加锁时使用间隙锁外，如果使用相等条件请求给一个不存在的记录加锁，InnoDB也会使用间隙锁！

在如下表所示的例子中，假如emp表中只有101条记录，其empid的值分别是1,2,......,100,101。

​        InnoDB存储引擎的间隙锁阻塞例子

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> select @@tx_isolation; +-----------------+ \| @@tx_isolation \| +-----------------+ \| REPEATABLE-READ \| +-----------------+ 1 row in set (0.00 sec) mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) | mysql> select @@tx_isolation; +-----------------+ \| @@tx_isolation \| +-----------------+ \| REPEATABLE-READ \| +-----------------+ 1 row in set (0.00 sec) mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) |
| 当前session对不存在的记录加for update的锁： mysql> select * from emp where empid = 102 for update; Empty set (0.00 sec) |                                                              |
|                                                              | 这时，如果其他session插入empid为102的记录（注意：这条记录并不存在），也会出现锁等待： mysql>insert into emp(empid,...) values(102,...); 阻塞等待 |
| Session_1 执行rollback： mysql> rollback; Query OK, 0 rows affected (13.04 sec) |                                                              |
|                                                              | 由于其他session_1回退后释放了Next-Key锁，当前session可以获得锁并成功插入记录： mysql>insert into emp(empid,...) values(102,...); Query OK, 1 row affected (13.35 sec) |

恢复和复制的需要，对InnoDB锁机制的影响

MySQL通过BINLOG录执行成功的INSERT、UPDATE、DELETE等更新数据的SQL语句，并由此实现MySQL数据库的恢复和主从复制（可以参见本书“管理篇”的介绍）。MySQL的恢复机制（复制其实就是在Slave Mysql不断做基于BINLOG的恢复）有以下特点。

l 一是MySQL的恢复是SQL语句级的，也就是重新执行BINLOG中的SQL语句。这与Oracle数据库不同，Oracle是基于数据库文件块的。

l 二是MySQL的Binlog是按照事务提交的先后顺序记录的，恢复也是按这个顺序进行的。这点也与Oralce不同，Oracle是按照系统更新号（System Change Number，SCN）来恢复数据的，每个事务开始时，Oracle都会分配一个全局唯一的SCN，SCN的顺序与事务开始的时间顺序是一致的。

从上面两点可知，MySQL的恢复机制要求：在一个事务未提交前，其他并发事务不能插入满足其锁定条件的任何记录，也就是不允许出现幻读，这已经超过了ISO/ANSI SQL92“可重复读”隔离级别的要求，实际上是要求事务要串行化。这也是许多情况下，InnoDB要用到间隙锁的原因，比如在用范围条件更新记录时，无论在Read Commited或是Repeatable Read隔离级别下，InnoDB都要使用间隙锁，但这并不是隔离级别要求的，有关InnoDB在不同隔离级别下加锁的差异在下一小节还会介绍。

另外，对于“insert into target_tab select * from source_tab where ...”和“create table new_tab ...select ... From source_tab where ...(CTAS)”这种SQL语句，用户并没有对source_tab做任何更新操作，但MySQL对这种SQL语句做了特别处理。先来看如下表的例子。

​          CTAS操作给原表加锁例子

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select * from target_tab; Empty set (0.00 sec) mysql> select * from source_tab where name = '1'; +----+------+----+ \| d1 \| name \| d2 \| +----+------+----+ \| 4 \| 1 \| 1 \| \| 5 \| 1 \| 1 \| \| 6 \| 1 \| 1 \| \| 7 \| 1 \| 1 \| \| 8 \| 1 \| 1 \| +----+------+----+ 5 rows in set (0.00 sec) | mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select * from target_tab; Empty set (0.00 sec) mysql> select * from source_tab where name = '1'; +----+------+----+ \| d1 \| name \| d2 \| +----+------+----+ \| 4 \| 1 \| 1 \| \| 5 \| 1 \| 1 \| \| 6 \| 1 \| 1 \| \| 7 \| 1 \| 1 \| \| 8 \| 1 \| 1 \| +----+------+----+ 5 rows in set (0.00 sec) |
| mysql> insert into target_tab select d1,name from source_tab where name = '1'; Query OK, 5 rows affected (0.00 sec) Records: 5 Duplicates: 0 Warnings: 0 |                                                              |
|                                                              | mysql> update source_tab set name = '1' where name = '8'; 等待 |
| commit;                                                      |                                                              |
|                                                              | 返回结果 commit;                                             |

在上面的例子中，只是简单地读 source_tab表的数据，相当于执行一个普通的SELECT语句，用一致性读就可以了。ORACLE正是这么做的，它通过MVCC技术实现的多版本数据来实现一致性读，不需要给source_tab加任何锁。我们知道InnoDB也实现了多版本数据，对普通的SELECT一致性读，也不需要加任何锁；但这里InnoDB却给source_tab加了共享锁，并没有使用多版本数据一致性读技术！

MySQL为什么要这么做呢？其原因还是为了保证恢复和复制的正确性。因为不加锁的话，如果在上述语句执行过程中，其他事务对source_tab做了更新操作，就可能导致数据恢复的结果错误。为了演示这一点，我们再重复一下前面的例子，不同的是在session_1执行事务前，先将系统变量 innodb_locks_unsafe_for_binlog的值设置为“on”（其默认值为off），具体结果如下表所示。

​         CTAS操作不给原表加锁带来的安全问题例子

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql>set innodb_locks_unsafe_for_binlog='on' Query OK, 0 rows affected (0.00 sec) mysql> select * from target_tab; Empty set (0.00 sec) mysql> select * from source_tab where name = '1'; +----+------+----+ \| d1 \| name \| d2 \| +----+------+----+ \| 4 \| 1 \| 1 \| \| 5 \| 1 \| 1 \| \| 6 \| 1 \| 1 \| \| 7 \| 1 \| 1 \| \| 8 \| 1 \| 1 \| +----+------+----+ 5 rows in set (0.00 sec) | mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select * from target_tab; Empty set (0.00 sec) mysql> select * from source_tab where name = '1'; +----+------+----+ \| d1 \| name \| d2 \| +----+------+----+ \| 4 \| 1 \| 1 \| \| 5 \| 1 \| 1 \| \| 6 \| 1 \| 1 \| \| 7 \| 1 \| 1 \| \| 8 \| 1 \| 1 \| +----+------+----+ 5 rows in set (0.00 sec) |
| mysql> insert into target_tab select d1,name from source_tab where name = '1'; Query OK, 5 rows affected (0.00 sec) Records: 5 Duplicates: 0 Warnings: 0 |                                                              |
|                                                              | session_1未提交，可以对session_1的select的记录进行更新操作。 mysql> update source_tab set name = '8' where name = '1'; Query OK, 5 rows affected (0.00 sec) Rows matched: 5 Changed: 5 Warnings: 0 mysql> select * from source_tab where name = '8'; +----+------+----+ \| d1 \| name \| d2 \| +----+------+----+ \| 4 \| 8 \| 1 \| \| 5 \| 8 \| 1 \| \| 6 \| 8 \| 1 \| \| 7 \| 8 \| 1 \| \| 8 \| 8 \| 1 \| +----+------+----+ 5 rows in set (0.00 sec) |
|                                                              | 更新操作先提交 mysql> commit; Query OK, 0 rows affected (0.05 sec) |
| 插入操作后提交 mysql> commit; Query OK, 0 rows affected (0.07 sec) |                                                              |
| 此时查看数据，target_tab中可以插入source_tab更新前的结果，这符合应用逻辑： mysql> select * from source_tab where name = '8'; +----+------+----+ \| d1 \| name \| d2 \| +----+------+----+ \| 4 \| 8 \| 1 \| \| 5 \| 8 \| 1 \| \| 6 \| 8 \| 1 \| \| 7 \| 8 \| 1 \| \| 8 \| 8 \| 1 \| +----+------+----+ 5 rows in set (0.00 sec) mysql> select * from target_tab; +------+------+ \| id \| name \| +------+------+ \| 4 \| 1.00 \| \| 5 \| 1.00 \| \| 6 \| 1.00 \| \| 7 \| 1.00 \| \| 8 \| 1.00 \| +------+------+ 5 rows in set (0.00 sec) | mysql> select * from tt1 where name = '1'; Empty set (0.00 sec) mysql> select * from source_tab where name = '8'; +----+------+----+ \| d1 \| name \| d2 \| +----+------+----+ \| 4 \| 8 \| 1 \| \| 5 \| 8 \| 1 \| \| 6 \| 8 \| 1 \| \| 7 \| 8 \| 1 \| \| 8 \| 8 \| 1 \| +----+------+----+ 5 rows in set (0.00 sec) mysql> select * from target_tab; +------+------+ \| id \| name \| +------+------+ \| 4 \| 1.00 \| \| 5 \| 1.00 \| \| 6 \| 1.00 \| \| 7 \| 1.00 \| \| 8 \| 1.00 \| +------+------+ 5 rows in set (0.00 sec) |

从上可见，设置系统变量innodb_locks_unsafe_for_binlog的值为“on”后，InnoDB不再对source_tab加锁，结果也符合应用逻辑，但是如果分析BINLOG的内容：

......

SET TIMESTAMP=1169175130;

BEGIN;

\# at 274

\#070119 10:51:57 server id 1 end_log_pos 105  Query  thread_id=1   exec_time=0   error_code=0

SET TIMESTAMP=1169175117;

update source_tab set name = '8' where name = '1';

\# at 379

\#070119 10:52:10 server id 1 end_log_pos 406  Xid = 5

COMMIT;

\# at 406

\#070119 10:52:14 server id 1 end_log_pos 474  Query  thread_id=2   exec_time=0   error_code=0

SET TIMESTAMP=1169175134;

BEGIN;

\# at 474

\#070119 10:51:29 server id 1 end_log_pos 119  Query  thread_id=2   exec_time=0   error_code=0

SET TIMESTAMP=1169175089;

insert into target_tab select d1,name from source_tab where name = '1';

\# at 593

\#070119 10:52:14 server id 1 end_log_pos 620  Xid = 7

COMMIT;

......

  可以发现，在BINLOG中，更新操作的位置在INSERT...SELECT之前，如果使用这个BINLOG进行数据库恢复，恢复的结果与实际的应用逻辑不符；如果进行复制，就会导致主从数据库不一致！

通过上面的例子，我们就不难理解为什么MySQL在处理“Insert into target_tab select * from source_tab where ...”和“create table new_tab ...select ... From source_tab where ...”时要给source_tab加锁，而不是使用对并发影响最小的多版本数据来实现一致性读。还要特别说明的是，如果上述语句的SELECT是范围条件，InnoDB还会给源表加间隙锁（Next-Lock）。

**因此，INSERT...SELECT...和 CREATE TABLE...SELECT...语句，可能会阻止对源表的并发更新，造成对源表锁的等待。如果查询比较复杂的话，会造成严重的性能问题，我们在应用中应尽量避免使用。实际上，MySQL将这种SQL叫作不确定（non-deterministic）的SQL，不推荐使用。**

如果应用中一定要用这种SQL来实现业务逻辑，又不希望对源表的并发更新产生影响，可以采取以下两种措施：

- 一是采取上面示例中的做法，将innodb_locks_unsafe_for_binlog的值设置为“on”，强制MySQL使用多版本数据一致性读。但付出的代价是可能无法用binlog正确地恢复或复制数据，因此，不推荐使用这种方式。
- 二是通过使用“select * from source_tab ... Into outfile”和“load data infile ...”语句组合来间接实现，采用这种方式MySQL不会给source_tab加锁。

InnoDB在不同隔离级别下的一致性读及锁的差异

前面讲过，锁和多版本数据是InnoDB实现一致性读和ISO/ANSI SQL92隔离级别的手段，因此，在不同的隔离级别下，InnoDB处理SQL时采用的一致性读策略和需要的锁是不同的。同时，数据恢复和复制机制的特点，也对一些SQL的一致性读策略和锁策略有很大影响。将这些特性归纳成如下表所示的内容，以便读者查阅。

​                     InnoDB存储引擎中不同SQL在不同隔离级别下锁比较

| 隔离级别 一致性读和锁 SQL                | Read Uncommited                    | Read Commited            | Repeatable Read          | Serializable             |                 |
| ---------------------------------------- | ---------------------------------- | ------------------------ | ------------------------ | ------------------------ | --------------- |
| SQL                                      | 条件                               |                          |                          |                          |                 |
| select                                   | 相等                               | None locks               | Consisten read/None lock | Consisten read/None lock | Share locks     |
| 范围                                     | None locks                         | Consisten read/None lock | Consisten read/None lock | Share Next-Key           |                 |
| update                                   | 相等                               | exclusive locks          | exclusive locks          | exclusive locks          | Exclusive locks |
| 范围                                     | exclusive next-key                 | exclusive next-key       | exclusive next-key       | exclusive next-key       |                 |
| Insert                                   | N/A                                | exclusive locks          | exclusive locks          | exclusive locks          | exclusive locks |
| replace                                  | 无键冲突                           | exclusive locks          | exclusive locks          | exclusive locks          | exclusive locks |
| 键冲突                                   | exclusive next-key                 | exclusive next-key       | exclusive next-key       | exclusive next-key       |                 |
| delete                                   | 相等                               | exclusive locks          | exclusive locks          | exclusive locks          | exclusive locks |
| 范围                                     | exclusive next-key                 | exclusive next-key       | exclusive next-key       | exclusive next-key       |                 |
| Select ... from ... Lock in share mode   | 相等                               | Share locks              | Share locks              | Share locks              | Share locks     |
| 范围                                     | Share locks                        | Share locks              | Share Next-Key           | Share Next-Key           |                 |
| Select * from ... For update             | 相等                               | exclusive locks          | exclusive locks          | exclusive locks          | exclusive locks |
| 范围                                     | exclusive locks                    | Share locks              | exclusive next-key       | exclusive next-key       |                 |
| Insert into ... Select ... （指源表锁）  | innodb_locks_unsafe_for_binlog=off | Share Next-Key           | Share Next-Key           | Share Next-Key           | Share Next-Key  |
| innodb_locks_unsafe_for_binlog=on        | None locks                         | Consisten read/None lock | Consisten read/None lock | Share Next-Key           |                 |
| create table ... Select ... （指源表锁） | innodb_locks_unsafe_for_binlog=off | Share Next-Key           | Share Next-Key           | Share Next-Key           | Share Next-Key  |
| innodb_locks_unsafe_for_binlog=on        | None locks                         | Consisten read/None lock | Consisten read/None lock | Share Next-Key           |                 |

从上表可以看出：对于许多SQL，隔离级别越高，InnoDB给记录集加的锁就越严格（尤其是使用范围条件的时候），产生锁冲突的可能性也就越高，从而对并发性事务处理性能的影响也就越大。因此，我们在应用中，应该尽量使用较低的隔离级别，以减少锁争用的机率。实际上，通过优化事务逻辑，大部分应用使用Read Commited隔离级别就足够了。对于一些确实需要更高隔离级别的事务，可以通过在程序中执行SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ或SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE动态改变隔离级别的方式满足需求。

**什么时候使用表锁**

对于InnoDB表，在绝大部分情况下都应该使用行级锁，因为事务和行锁往往是我们之所以选择InnoDB表的理由。但在个别特殊事务中，也可以考虑使用表级锁。

- 第一种情况是：事务需要更新大部分或全部数据，表又比较大，如果使用默认的行锁，不仅这个事务执行效率低，而且可能造成其他事务长时间锁等待和锁冲突，这种情况下可以考虑使用表锁来提高该事务的执行速度。
- 第二种情况是：事务涉及多个表，比较复杂，很可能引起死锁，造成大量事务回滚。这种情况也可以考虑一次性锁定事务涉及的表，从而避免死锁、减少数据库因事务回滚带来的开销。

当然，应用中这两种事务不能太多，否则，就应该考虑使用MyISAM表了。

在InnoDB下，使用表锁要注意以下两点。

**（1）使用LOCK TABLES虽然可以给InnoDB加表级锁，但必须说明的是，表锁不是由InnoDB存储引擎层管理的，而是由其上一层──MySQL Server负责的，仅当autocommit=0、innodb_table_locks=1（默认设置）时，InnoDB层才能知道MySQL加的表锁，MySQL Server也才能感知InnoDB加的行锁，这种情况下，InnoDB才能自动识别涉及表级锁的死锁；否则，InnoDB将无法自动检测并处理这种死锁。有关死锁，下一小节还会继续讨论。**

**（2）在用 LOCK TABLES对InnoDB表加锁时要注意，要将AUTOCOMMIT设为0，否则MySQL不会给表加锁；事务结束前，不要用UNLOCK TABLES释放表锁，因为UNLOCK TABLES会隐含地提交事务；COMMIT或ROLLBACK并不能释放用LOCK TABLES加的表级锁，必须用UNLOCK TABLES释放表锁。**正确的方式见如下语句：

例如，如果需要写表t1并从表t读，可以按如下做：

SET AUTOCOMMIT=0;

LOCK TABLES t1 WRITE, t2 READ, ...;

[do something with tables t1 and t2 here];

COMMIT;

UNLOCK TABLES;

**关于死锁**

上文讲过，MyISAM表锁是deadlock free的，这是因为MyISAM总是一次获得所需的全部锁，要么全部满足，要么等待，因此不会出现死锁。但在InnoDB中，除单个SQL组成的事务外，锁是逐步获得的，这就决定了在InnoDB中发生死锁是可能的。如下所示的就是一个发生死锁的例子。

 **InnoDB存储引擎中的死锁例子**

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select * from table_1 where where id=1 for update; ... 做一些其他处理... | mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) mysql> select * from table_2 where id=1 for update; ... |
| select * from table_2 where id =1 for update; 因session_2已取得排他锁，等待 | 做一些其他处理...                                            |
|                                                              | mysql> select * from table_1 where where id=1 for update; 死锁 |

在上面的例子中，两个事务都需要获得对方持有的排他锁才能继续完成事务，这种循环锁等待就是典型的死锁。

**发生死锁后，InnoDB一般都能自动检测到，并使一个事务释放锁并回退，另一个事务获得锁，继续完成事务。但在涉及外部锁，或涉及表锁的情况下，InnoDB并不能完全自动检测到死锁，这需要通过设置锁等待超时参数 innodb_lock_wait_timeout来解决。需要说明的是，这个参数并不是只用来解决死锁问题，在并发访问比较高的情况下，如果大量事务因无法立即获得所需的锁而挂起，会占用大量计算机资源，造成严重性能问题，甚至拖跨数据库。我们通过设置合适的锁等待超时阈值，可以避免这种情况发生。**

通常来说，死锁都是应用设计的问题，通过调整业务流程、数据库对象设计、事务大小，以及访问数据库的SQL语句，绝大部分死锁都可以避免。下面就通过实例来介绍几种避免死锁的常用方法。

（1）在应用中，如果不同的程序会并发存取多个表，应尽量约定以相同的顺序来访问表，这样可以大大降低产生死锁的机会。在下面的例子中，由于两个session访问两个表的顺序不同，发生死锁的机会就非常高！但如果以相同的顺序来访问，死锁就可以避免。

​    InnoDB存储引擎中表顺序造成的死锁例子

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) | mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) |
| mysql> select first_name,last_name from actor where actor_id = 1 for update; +------------+-----------+ \| first_name \| last_name \| +------------+-----------+ \| PENELOPE \| GUINESS \| +------------+-----------+ 1 row in set (0.00 sec) |                                                              |
|                                                              | mysql> insert into country (country_id,country) values(110,'Test'); Query OK, 1 row affected (0.00 sec) |
| mysql> insert into country (country_id,country) values(110,'Test'); 等待 |                                                              |
|                                                              | mysql> select first_name,last_name from actor where actor_id = 1 for update; +------------+-----------+ \| first_name \| last_name \| +------------+-----------+ \| PENELOPE \| GUINESS \| +------------+-----------+ 1 row in set (0.00 sec) |
| mysql> insert into country (country_id,country) values(110,'Test'); ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction |                                                              |

（2）在程序以批量方式处理数据的时候，如果事先对数据排序，保证每个线程按固定的顺序来处理记录，也可以大大降低出现死锁的可能。

​    InnoDB存储引擎中表数据操作顺序不一致造成的死锁例子

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) | mysql> set autocommit=0; Query OK, 0 rows affected (0.00 sec) |
| mysql> select first_name,last_name from actor where actor_id = 1 for update; +------------+-----------+ \| first_name \| last_name \| +------------+-----------+ \| PENELOPE \| GUINESS \| +------------+-----------+ 1 row in set (0.00 sec) |                                                              |
|                                                              | mysql> select first_name,last_name from actor where actor_id = 3 for update; +------------+-----------+ \| first_name \| last_name \| +------------+-----------+ \| ED \| CHASE \| +------------+-----------+ 1 row in set (0.00 sec) |
| mysql> select first_name,last_name from actor where actor_id = 3 for update; 等待 |                                                              |
|                                                              | mysql> select first_name,last_name from actor where actor_id = 1 for update; ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction |
| mysql> select first_name,last_name from actor where actor_id = 3 for update; +------------+-----------+ \| first_name \| last_name \| +------------+-----------+ \| ED \| CHASE \| +------------+-----------+ 1 row in set (4.71 sec) |                                                              |

（3）在事务中，如果要更新记录，应该直接申请足够级别的锁，即排他锁，而不应先申请共享锁，更新时再申请排他锁，因为当用户申请排他锁时，其他事务可能又已经获得了相同记录的共享锁，从而造成锁冲突，甚至死锁。

​    （4）前面讲过，在REPEATABLE-READ隔离级别下，如果两个线程同时对相同条件记录用SELECT...FOR UPDATE加排他锁，在没有符合该条件记录情况下，两个线程都会加锁成功。程序发现记录尚不存在，就试图插入一条新记录，如果两个线程都这么做，就会出现死锁。这种情况下，将隔离级别改成READ COMMITTED，就可避免问题，如下所示。

 **InnoDB存储引擎中隔离级别引起的死锁例子1**

| session_1                                                    | session_2                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> select @@tx_isolation; +-----------------+ \| @@tx_isolation \| +-----------------+ \| REPEATABLE-READ \| +-----------------+ 1 row in set (0.00 sec) mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) | mysql> select @@tx_isolation; +-----------------+ \| @@tx_isolation \| +-----------------+ \| REPEATABLE-READ \| +-----------------+ 1 row in set (0.00 sec) mysql> set autocommit = 0; Query OK, 0 rows affected (0.00 sec) |
| 当前session对不存在的记录加for update的锁： mysql> select actor_id,first_name,last_name from actor where actor_id = 201 for update; Empty set (0.00 sec) |                                                              |
|                                                              | 其他session也可以对不存在的记录加for update的锁： mysql> select actor_id,first_name,last_name from actor where actor_id = 201 for update; Empty set (0.00 sec) |
| 因为其他session也对该记录加了锁，所以当前的插入会等待： mysql> insert into actor (actor_id , first_name , last_name) values(201,'Lisa','Tom'); 等待 |                                                              |
|                                                              | 因为其他session已经对记录进行了更新，这时候再插入记录就会提示死锁并退出： mysql> insert into actor (actor_id, first_name , last_name) values(201,'Lisa','Tom'); ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction |
| 由于其他session已经退出，当前session可以获得锁并成功插入记录： mysql> insert into actor (actor_id , first_name , last_name) values(201,'Lisa','Tom'); Query OK, 1 row affected (13.35 sec) |                                                              |

（5）**当隔离级别为READ COMMITTED时，如果两个线程都先执行SELECT...FOR UPDATE，判断是否存在符合条件的记录，如果没有，就插入记录。此时，只有一个线程能插入成功，另一个线程会出现锁等待，当第1个线程提交后，第2个线程会因主键重出错，但虽然这个线程出错了，却会获得一个排他锁！这时如果有第3个线程又来申请排他锁，也会出现死锁。**

对于这种情况，可以直接做插入操作，然后再捕获主键重异常，或者在遇到主键重错误时，总是执行ROLLBACK释放获得的排他锁，如下所示。

  **InnoDB存储引擎中隔离级别引起的死锁例子2**

| session_1                                                    | session_2                                                    | session_3                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| mysql> select @@tx_isolation; +----------------+ \| @@tx_isolation \| +----------------+ \| READ-COMMITTED \| +----------------+ 1 row in set (0.00 sec) mysql> set autocommit=0; Query OK, 0 rows affected (0.01 sec) | mysql> select @@tx_isolation; +----------------+ \| @@tx_isolation \| +----------------+ \| READ-COMMITTED \| +----------------+ 1 row in set (0.00 sec) mysql> set autocommit=0; Query OK, 0 rows affected (0.01 sec) | mysql> select @@tx_isolation; +----------------+ \| @@tx_isolation \| +----------------+ \| READ-COMMITTED \| +----------------+ 1 row in set (0.00 sec) mysql> set autocommit=0; Query OK, 0 rows affected (0.01 sec) |
| Session_1获得for update的共享锁： mysql> select actor_id, first_name,last_name from actor where actor_id = 201 for update; Empty set (0.00 sec) | 由于记录不存在，session_2也可以获得for update的共享锁： mysql> select actor_id, first_name,last_name from actor where actor_id = 201 for update; Empty set (0.00 sec) |                                                              |
| Session_1可以成功插入记录： mysql> insert into actor (actor_id,first_name,last_name) values(201,'Lisa','Tom'); Query OK, 1 row affected (0.00 sec) |                                                              |                                                              |
|                                                              | Session_2插入申请等待获得锁： mysql> insert into actor (actor_id,first_name,last_name) values(201,'Lisa','Tom'); 等待 |                                                              |
| Session_1成功提交： mysql> commit; Query OK, 0 rows affected (0.04 sec) |                                                              |                                                              |
|                                                              | Session_2获得锁，发现插入记录主键重，这个时候抛出了异常，但是并没有释放共享锁： mysql> insert into actor (actor_id,first_name,last_name) values(201,'Lisa','Tom'); ERROR 1062 (23000): Duplicate entry '201' for key 'PRIMARY' |                                                              |
|                                                              |                                                              | Session_3申请获得共享锁，因为session_2已经锁定该记录，所以session_3需要等待： mysql> select actor_id, first_name,last_name from actor where actor_id = 201 for update; 等待 |
|                                                              | 这个时候，如果session_2直接对记录进行更新操作，则会抛出死锁的异常： mysql> update actor set last_name='Lan' where actor_id = 201; ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction |                                                              |
|                                                              |                                                              | Session_2释放锁后，session_3获得锁： mysql> select first_name, last_name from actor where actor_id = 201 for update; +------------+-----------+ \| first_name \| last_name \| +------------+-----------+ \| Lisa \| Tom \| +------------+-----------+ 1 row in set (31.12 sec) |

尽管通过上面介绍的设计和SQL优化等措施，可以大大减少死锁，但死锁很难完全避免。因此，在程序设计中总是捕获并处理死锁异常是一个很好的编程习惯。

如果出现死锁，可以用SHOW INNODB STATUS命令来确定最后一个死锁产生的原因。返回结果中包括死锁相关事务的详细信息，如引发死锁的SQL语句，事务已经获得的锁，正在等待什么锁，以及被回滚的事务等。据此可以分析死锁产生的原因和改进措施。下面是一段SHOW INNODB STATUS输出的样例：

mysql> show innodb status \G

…….

\------------------------

LATEST DETECTED DEADLOCK

\------------------------

070710 14:05:16

*** (1) TRANSACTION:

TRANSACTION 0 117470078, ACTIVE 117 sec, process no 1468, OS thread id 1197328736 inserting

mysql tables in use 1, locked 1

LOCK WAIT 5 lock struct(s), heap size 1216

MySQL thread id 7521657, query id 673468054 localhost root update

insert into country (country_id,country) values(110,'Test')

………

*** (2) TRANSACTION:

TRANSACTION 0 117470079, ACTIVE 39 sec, process no 1468, OS thread id 1164048736 starting index read, thread declared inside InnoDB 500

mysql tables in use 1, locked 1

4 lock struct(s), heap size 1216, undo log entries 1

MySQL thread id 7521664, query id 673468058 localhost root statistics

select first_name,last_name from actor where actor_id = 1 for update

*** (2) HOLDS THE LOCK(S):

………

*** (2) WAITING FOR THIS LOCK TO BE GRANTED:

………

*** WE ROLL BACK TRANSACTION (1)

……

![img](G:/youdaoLocalData/jstarfish@126.com/fccbfbe8c2f74eee8c9336d70ff81a70/clipboard.png)

![img](G:/youdaoLocalData/jstarfish@126.com/30372d116f4e4bc784f1cd9f093bd305/clipboard.png)

![img](G:/youdaoLocalData/jstarfish@126.com/ccf2107e35af4266a836f0129ffad5df/clipboard.png)

![img](G:/youdaoLocalData/jstarfish@126.com/2627adca0efb4a339b0e874c97d3b413/clipboard.png)

![img](G:/youdaoLocalData/jstarfish@126.com/599c36f1ec1a40ccaee34adf9d6f6f2f/clipboard.png)





![image-20191129113956127](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20191129113956127.png)







































