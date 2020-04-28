## 什么是 BloomFilter（布隆过滤器）

**布隆过滤器**（英语：Bloom Filter）是 1970 年由布隆提出的。它实际上是一个很长的二进制向量和一系列随机映射函数。主要用于判断一个元素是否在一个集合中。

通常我们会遇到很多要判断一个元素是否在某个集合中的业务场景，一般想到的是将集合中所有元素保存起来，然后通过比较确定。链表、树、散列表（又叫哈希表，Hash table）等等数据结构都是这种思路。但是随着集合中元素的增加，我们需要的存储空间也会呈现线性增长，最终达到瓶颈。同时检索速度也越来越慢，上述三种结构的检索时间复杂度分别为$O(n)$，$O(logn)$，$O(1)$。

布隆过滤器的原理是，当一个元素被加入集合时，通过**K个散列函数**将这个元素映射成一个**位数组**中的K个点，把它们置为1。检索时，我们只要看看这些点是不是都是1就（大约）知道集合中有没有它了：如果这些点有任何一个 0，则被检元素一定不在；如果都是1，则被检元素很可能在。这就是布隆过滤器的基本思想。

![](https://images2015.cnblogs.com/blog/1030776/201701/1030776-20170106143141784-1475031003.png)





## 布隆过滤器使用场景

在程序的世界中，布隆过滤器是程序员的一把利器，利用它可以快速地解决项目中一些比较棘手的问题。如网页 URL 去重、垃圾邮件识别、大集合中重复元素的判断和缓存穿透等问题。

先来看几个比较常见的例子

- 字处理软件中，需要检查一个英语单词是否拼写正确

- 在 FBI，一个嫌疑人的名字是否已经在嫌疑名单上

- 在网络爬虫里，一个网址是否被访问过

  我们在使用网页爬虫的时候（爬虫需谨慎），往往需要记录哪些 URL 是已经爬取过的，哪些还是没有爬取过，这个时候我们就可以采用 BloomFilter 来对已经爬取过的 URL 进行存储，这样在进行下一次爬取的时候就可以判断出这个 URL 是否爬取过。

- yahoo, gmail等邮箱垃圾邮件过滤功能

这几个例子有一个共同的特点： **如何判断一个元素是否存在一个集合中？**



Google 著名的分布式数据库 Bigtable 使用了布隆过滤器来查找不存在的行或列，以减少磁盘查找的IO次数。

Squid 网页代理缓存服务器在 cache digests 中使用了也布隆过滤器。

Venti 文档存储系统也采用布隆过滤器来检测先前存储的数据。

SPIN 模型检测器也使用布隆过滤器在大规模验证问题时跟踪可达状态空间。

Google Chrome浏览器使用了布隆过滤器加速安全浏览服务。

在很多Key-Value系统中也使用了布隆过滤器来加快查询过程，如 Hbase，Accumulo，Leveldb，一般而言，Value 保存在磁盘中，访问磁盘需要花费大量时间，然而使用布隆过滤器可以快速判断某个Key对应的Value是否存在，因此可以避免很多不必要的磁盘IO操作，只是引入布隆过滤器会带来一定的内存消耗



## 优点

相比于其它的数据结构，布隆过滤器在空间和时间方面都有巨大的优势。布隆过滤器存储空间和插入/查询时间都是常数 $O(K)$，另外，散列函数相互之间没有关系，方便由硬件并行实现。布隆过滤器不需要存储元素本身，在某些对保密要求非常严格的场合有优势。

布隆过滤器可以表示全集，其它任何数据结构都不能；

k 和 m 相同，使用同一组散列函数的两个布隆过滤器的交并[[来源请求\]](https://zh.wikipedia.org/wiki/Wikipedia:列明来源)运算可以使用位操作进行。

**它的优点是空间效率和查询时间都比一般的算法要好的多，缺点是有一定的误识别率和删除困难**。



## 缺点

但是布隆过滤器的缺点和优点一样明显。误算率是其中之一。随着存入的元素数量增加，误算率随之增加。但是如果元素数量太少，则使用散列表足矣。

另外，一般情况下不能从布隆过滤器中删除元素。我们很容易想到把位数组变成整数数组，每插入一个元素相应的计数器加1, 这样删除元素时将计数器减掉就可以了。然而要保证安全地删除元素并非如此简单。首先我们必须保证删除的元素的确在布隆过滤器里面。这一点单凭这个过滤器是无法保证的。另外计数器回绕也会造成问题。

在降低误算率方面，有不少工作，使得出现了很多布隆过滤器的变种。





### 布隆过滤器原理

了解布隆过滤器原理之前，先要知道Hash函数原理。

### 哈希函数

哈希函数的概念是：将任意大小的数据转换成特定大小的数据的函数，转换后的数据称为哈希值或哈希编码。下面是一幅示意图：

![img](https://images2015.cnblogs.com/blog/1030776/201701/1030776-20170106142012816-1867044021.png)

可以明显的看到，原始数据经过哈希函数的映射后称为了一个个的哈希编码，数据得到压缩。哈希函数是实现哈希表和布隆过滤器的基础。





布隆过滤器需要的是一个位数组（这个和位图有点类似）和k个映射函数（和Hash表类似），在初始状态时，对于长度为m的位数组array，它的所有位都被置为0，如下图所示：

![img](https://mmbiz.qpic.cn/mmbiz_jpg/RQueXibgo0KMSiaDpPqVTmhlMOF4WbajXE2zrFUicTBic8I7QWs28vBbLdy7k5p4PjM5CVKnvYTTtGLZY1UicOoiaGgA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

对于有n个元素的集合S={s1,s2......sn}，通过k个映射函数{f1,f2,......fk}，将集合S中的每个元素sj(1<=j<=n)映射为k个值{g1,g2......gk}，然后再将位数组array中相对应的array[g1],array[g2]......array[gk]置为1：

![img](https://mmbiz.qpic.cn/mmbiz_jpg/RQueXibgo0KMSiaDpPqVTmhlMOF4WbajXEqiccJDv1JATg3ul4JYoLQbDECSdzwBXRqkCfYI9IiahtkyRNtaEw1Y6A/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

如果要查找某个元素item是否在S中，则通过映射函数{f1,f2.....fk}得到k个值{g1,g2.....gk}，然后再判断array[g1],array[g2]......array[gk]是否都为1，若全为1，则item在S中，否则item不在S中。这个就是布隆过滤器的实现原理。





但是当只有一个hash函数时：很容易发生冲突



![img](https://user-gold-cdn.xitu.io/2019/6/9/16b3c609d901d6e3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



有三个hash函数和一个位数组，oracle经过三个hash函数，得到第1、4、5位为1，database同理得到2、5、10位1，这样如果我们需要判断oracle是否在此位数组中，则通过hash函数判断位数组的1、4、5位是否均为1，如果均为1，则判断oracle在此位数组中，database同理。这就是布隆过滤器判断元素是否在集合中的原理。

想必聪明的读者已经发现，如果bloom经过三个hash算法，需要判断 1、5、10位是否为1，恰好因为位数组中添加oracle和database导致1、5、10为1，则布隆过滤器会判断bloom会判断在集合中，这不是Bug吗，导致误判。但是可以保证的是，如果布隆过滤器判断一个元素不在一个集合中，那这个元素一定不会再集合中

布隆过滤器（Bloom Filter）的核心实现是一个超大的位数组和几个哈希函数。假设位数组的长度为m，哈希函数的个数为k

BloomFilter 是由一个固定大小的二进制向量或者位图（bitmap）和一系列（通常好几个）映射函数组成的。布隆过滤器的原理是，当一个变量被加入集合时，通过 K 个映射函数将这个变量映射成位图中的 K 个点，把它们置为 1。查询某个变量的时候我们只要看看这些点是不是都是 1 就可以大概率知道集合中有没有它了，如果这些点有任何一个 0，则被查询变量一定不在；如果都是 1，则被查询变量很**可能**在。注意，这里是可能存在，不一定一定存在！这就是布隆过滤器的基本思想。



为什么说是可能存在，而不是一定存在呢？那是因为映射函数本身就是散列函数，散列函数是会有碰撞的



以上图为例，具体的操作流程：假设集合里面有3个元素{x, y, z}，哈希函数的个数为3。首先将位数组进行初始化，将里面每个位都设置位0。对于集合里面的每一个元素，将元素依次通过3个哈希函数进行映射，每次映射都会产生一个哈希值，这个值对应位数组上面的一个点，然后将位数组对应的位置标记为1。查询W元素是否存在集合中的时候，同样的方法将W通过哈希映射到位数组上的3个点。如果3个点的其中有一个点不为1，则可以判断该元素一定不存在集合中。反之，如果3个点都为1，则该元素可能存在集合中。注意：此处不能判断该元素是否一定存在集合中，可能存在一定的误判率。可以从图中可以看到：假设某个元素通过映射对应下标为4，5，6这3个点。虽然这3个点都为1，但是很明显这3个点是不同元素经过哈希得到的位置，因此这种情况说明元素虽然不在集合中，也可能对应的都是1，这是误判率存在的原因。





#### 特性

所以通过上面的例子我们就可以明确

- **一个元素如果判断结果为存在的时候元素不一定存在，但是判断结果为不存在的时候则一定不存在**。
- **布隆过滤器可以添加元素，但是不能删除元素**。因为删掉元素会导致误判率增加。



### 布隆过滤器添加元素

- 将要添加的元素给k个哈希函数
- 得到对应于位数组上的k个位置
- 将这k个位置设为1

### 布隆过滤器查询元素

- 将要查询的元素给k个哈希函数
- 得到对应于位数组上的k个位置
- 如果k个位置有一个为0，则肯定不在集合中
- 如果k个位置全部为1，则可能在集合中





## Coding~

知道了布隆过滤去的原理，我们可以自己实现一个简单的布隆过滤器

### 自定义的 BloomFilter

```java
public class MyBloomFilter {

    /**
     * 一个长度为10 亿的比特位
     */
    private static final int DEFAULT_SIZE = 256 << 22;

    /**
     * 为了降低错误率，使用加法hash算法，所以定义一个8个元素的质数数组
     */
    private static final int[] seeds = {3, 5, 7, 11, 13, 31, 37, 61};

    /**
     * 相当于构建 8 个不同的hash算法
     */
    private static HashFunction[] functions = new HashFunction[seeds.length];

    /**
     * 初始化布隆过滤器的 bitmap
     */
    private static BitSet bitset = new BitSet(DEFAULT_SIZE);

    /**
     * 添加数据
     *
     * @param value 需要加入的值
     */
    public static void add(String value) {
        if (value != null) {
            for (HashFunction f : functions) {
                //计算 hash 值并修改 bitmap 中相应位置为 true
                bitset.set(f.hash(value), true);
            }
        }
    }

    /**
     * 判断相应元素是否存在
     * @param value 需要判断的元素
     * @return 结果
     */
    public static boolean contains(String value) {
        if (value == null) {
            return false;
        }
        boolean ret = true;
        for (HashFunction f : functions) {
            ret = bitset.get(f.hash(value));
            //一个 hash 函数返回 false 则跳出循环
            if (!ret) {
                break;
            }
        }
        return ret;
    }

    /**
     * 模拟用户是不是会员，或用户在不在线。。。
     */
    public static void main(String[] args) {

        for (int i = 0; i < seeds.length; i++) {
            functions[i] = new HashFunction(DEFAULT_SIZE, seeds[i]);
        }

        // 添加1亿数据
        for (int i = 0; i < 100000000; i++) {
            add(String.valueOf(i));
        }
        String id = "123456789";
        add(id);

        System.out.println(contains(id));   // true
        System.out.println("" + contains("234567890"));  //false
    }
}

class HashFunction {

    private int size;
    private int seed;

    public HashFunction(int size, int seed) {
        this.size = size;
        this.seed = seed;
    }

    public int hash(String value) {
        int result = 0;
        int len = value.length();
        for (int i = 0; i < len; i++) {
            result = seed * result + value.charAt(i);
        }
        int r = (size - 1) & result;
        return (size - 1) & result;
    }
}
```



> What？我们写的这些早有大牛帮我们实现，还造轮子，真是浪费时间，No，No，No，我们学习过程中是可以造轮子的，造轮子本身就是我们自己对设计和实现的具体落地过程，不仅能提高我们的编程能力，在造轮子的过程中肯定会遇到很多我们没有思考过的问题，成长看的见~~



> 实际项目使用的时候，领导和我说项目一定要稳定运行，没自信的我放弃了自己的轮子。

### Guava 中的 BloomFilter

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>23.0</version>
</dependency>
```

```java
public class GuavaBloomFilterDemo {

    public static void main(String[] args) {
        //后边两个参数：预计包含的数据量，和允许的误差值
        BloomFilter<Integer> bloomFilter = BloomFilter.create(Funnels.integerFunnel(), 100000, 0.01);
        for (int i = 0; i < 100000; i++) {
            bloomFilter.put(i);
        }
        System.out.println(bloomFilter.mightContain(1));
        System.out.println(bloomFilter.mightContain(2));
        System.out.println(bloomFilter.mightContain(3));
        System.out.println(bloomFilter.mightContain(100001));

        //bloomFilter.writeTo();
    }
}
```



分布式环境中，布隆过滤器肯定还需要考虑存放位置，这时候我们会想到 Redis，是的，Redis 也实现了布隆过滤器。

当然我们也可以把布隆过滤器写入一个文件，放入OSS、S3这类对象存储中。



### Redis 中的 BloomFilter

Redis提供的 bitMap 可以实现布隆过滤器，但是需要自己设计映射函数和一些细节，这和我们自定义没啥区别。

Redis 官方提供的布隆过滤器到了 Redis 4.0 提供了插件功能之后才正式登场。布隆过滤器作为一个插件加载到 Redis Server 中，给 Redis 提供了强大的布隆去重功能。

**直接编译进行安装**

```shell
git clone https://github.com/RedisBloom/RedisBloom.git
cd RedisBloom
make     #编译 会生成一个rebloom.so文件
redis-server --loadmodule /path/to/rebloom.so   #运行redis时加载布隆过滤器模块
redis-cli    # 连接容器中的 redis 服务
```



**使用Docker进行安装**

```shell
docker pull redislabs/rebloom:latest # 拉取镜像
docker run -p 6379:6379 --name redis-redisbloom redislabs/rebloom:latest #运行容器
docker exec -it redis-redisbloom bash
redis-cli     
```



**使用**

布隆过滤器基本指令：

- bf.add 添加元素到布隆过滤器
- bf.exists 判断元素是否在布隆过滤器
- bf.madd 添加多个元素到布隆过滤器，bf.add只能添加一个
- bf.mexists 判断多个元素是否在布隆过滤器

```
127.0.0.1:6379> bf.add user Tom
(integer) 1
127.0.0.1:6379> bf.add user John
(integer) 1
127.0.0.1:6379> bf.exists user Tom
(integer) 1
127.0.0.1:6379> bf.exists user Linda
(integer) 0
127.0.0.1:6379> bf.madd user Barry Jerry Mars
1) (integer) 1
2) (integer) 1
3) (integer) 1
127.0.0.1:6379> bf.mexists user Barry Linda
1) (integer) 1
2) (integer) 0
```

我们只有这几个参数，肯定不会有误判，当元素逐渐增多时，就会有一定的误判了，这里就不做这个实验了。

上面使用的布隆过滤器只是默认参数的布隆过滤器，它在我们第一次add的时候自动创建。

Redis 还提供了自定义参数的布隆过滤器，`bf.reserve 过滤器名 error_rate initial_size`

- error_rate：允许布隆过滤器的错误率，这个值越低过滤器的位数组的大小越大，占用空间也就越大
- initial_size：布隆过滤器可以储存的元素个数，当实际存储的元素个数超过这个值之后，过滤器的准确率会下降

但是这个操作需要在 add 之前显式创建。如果对应的 key 已经存在，bf.reserve 会报错

```
127.0.0.1:6379> bf.reserve user 0.01 100
(error) ERR item exists
127.0.0.1:6379> bf.reserve topic 0.01 1000
OK
```



我是一名 Javaer，肯定还要用 Java 来实现的，Java 的 Redis 客户端比较多，有些还没有提供指令扩展机制，笔者已知的 Redisson 和 lettuce 是可以使用布隆过滤器的，我们这里用 [Redisson](https://github.com/redisson/redisson/wiki/6.-分布式对象#68-布隆过滤器bloom-filter)

```java
public class RedissonBloomFilterDemo {

    public static void main(String[] args) {

        Config config = new Config();
        config.useSingleServer().setAddress("redis://127.0.0.1:6379");
        RedissonClient redisson = Redisson.create(config);

        RBloomFilter<String> bloomFilter = redisson.getBloomFilter("user");
        // 初始化布隆过滤器，预计统计元素数量为55000000，期望误差率为0.03
        bloomFilter.tryInit(55000000L, 0.03);
        bloomFilter.add("Tom");
        bloomFilter.add("Jack");
        System.out.println(bloomFilter.count());   //2
        System.out.println(bloomFilter.contains("Tom"));  //true
        System.out.println(bloomFilter.contains("Linda"));  //false
    }

}
```



## 扩展

为了解决布隆过滤器不能删除元素的问题，布谷鸟过滤器横空出世。论文《Cuckoo Filter：Better Than Bloom》作者将布谷鸟过滤器和布隆过滤器进行了深入的对比。相比布谷鸟过滤器而言布隆过滤器有以下不足：查询性能弱、空间利用效率低、不支持反向操作（删除）以及不支持计数。


由于使用较少，暂不深入。



## 参考与感谢

https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf

http://www.justdojava.com/2019/10/22/bloomfilter/

https://www.cnblogs.com/cpselvis/p/6265825.html

https://juejin.im/post/5cc5aa7ce51d456e431adac5