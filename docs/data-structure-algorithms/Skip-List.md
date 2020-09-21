# 跳表──没听过但很犀利的数据结构

跳表(skip list) 对标的是平衡树(AVL Tree)，是一种 插入/删除/搜索 都是 `O(log n)` 的数据结构。它最大的优势是原理简单、容易实现、方便扩展、效率更高。因此在一些热门的项目里用来替代平衡树，如 redis, leveldb 等。

## 跳表的基本思想

首先，跳表处理的是有序的链表（一般是双向链表，下图未表示双向），如下：

![Linked List](https://lotabout.me/2018/skip-list/linked-list.svg)

这个链表中，如果要搜索一个数，需要从头到尾比较每个元素是否匹配，直到找到匹配的数为止，即时间复杂度是 $O(n)$。同理，插入一个数并保持链表有序，需要先找到合适的插入位置，再执行插入，总计也是 $O(n)$的时间。

那么如何提高搜索的速度呢？很简单，做个索引：

![Linked List With 2 level](https://lotabout.me/2018/skip-list/linked-list-2.svg)

如上图，我们新创建一个链表，它包含的元素为前一个链表的偶数个元素。这样在搜索一个元素时，我们先在上层链表进行搜索，当元素未找到时再到下层链表中搜索。例如搜索数字 `19` 时的路径如下图：

![Linked List Search Path](https://lotabout.me/2018/skip-list/linked-list-search-path.svg)

先在上层中搜索，到达节点 `17` 时发现下一个节点为 `21`，已经大于 `19`，于是转到下一层搜索，找到的目标数字 `19`。

我们知道上层的节点数目为 $n/2$，因此，有了这层索引，我们搜索的时间复杂度降为了：$O(n/2)$。同理，我们可以不断地增加层数，来减少搜索的时间：

![Linked List Level 4](https://lotabout.me/2018/skip-list/linked-list-4.svg)

在上面的 4 层链表中搜索 `25`，在最上层搜索时就可以直接跳过 `21` 之前的所有节点，因此十分高效。

更一般地，如果有 kk 层，我们需要的搜索次数会小于 $\frac{n}{2^3} + k$，这样当层数 $k$ 增加到 $\log_2n$时，搜索的时间复杂度就变成了 $logn$。其实这背后的原理和二叉搜索树或二分查找很类似，通过索引来跳过大量的节点，从而提高搜索效率。

## 跳表

上节的结构是“静态”的，即我们先拥有了一个链表，再在之上建了多层的索引。但是在实际使用中，我们的链表是通过多次插入/删除形成的，换句话说是“动态”的。上节的结构要求上层相邻节点与对应下层节点间的个数比是 `1:2`，随意插入/删除一个节点，这个要求就被被破坏了。

因此跳表（skip list）表示，我们就不强制要求 `1:2` 了，一个节点要不要被索引，建几层的索引，都在节点插入时由抛硬币决定。当然，虽然索引的节点、索引的层数是随机的，为了保证搜索的效率，要大致保证每层的节点数目与上节的结构相当。下面是一个随机生成的跳表：

![Skip List](https://lotabout.me/2018/skip-list/skip-list.svg)

可以看到它每层的节点数还和上节的结构差不多，但是上下层的节点的对应关系已经完全被打破了。

现在假设节点 `17` 是最后插入的，在插入之前，我们需要搜索得到插入的位置：

![Skip List Search Path](https://lotabout.me/2018/skip-list/skip-list-insert-17.svg)

接着，抛硬币决定要建立几层的索引，伪代码如下：

```
randomLevel()
    lvl := 1
    -- random() that returns a random value in [0...1)
    while random() < p and lvl < MaxLevel do
        lvl := lvl + 1
    return lvl
```

上面的伪代码相当于抛硬币，如果是正面（`random() < p`）则层数加一，直到抛出反面为止。其中的 `MaxLevel` 是防止如果运气太好，层数就会太高，而太高的层数往往并不会提供额外的性能，一般 $MaxLevel=\log_(\frac{1}{p})n$。现在假设 `randomLevel` 返回的结果是 `2`，那么就得到下面的结果。

![Skip List](https://lotabout.me/2018/skip-list/skip-list.svg)

如果要删除节点，则把节点和对应的所有索引节点全部删除即可。当然，要删除节点时需要先搜索得到该节点，搜索过程中可以把路径记录下来，这样删除索引层节点的时候就不需要多次搜索了。

显然，在最坏的情况下，所有节点都没有创建索引，时间复杂度为$O(n)$，但在平均情况下，搜索的时间复杂度却是 $O(logn)$，为什么呢？

## 简单的性能分析

一些严格的证明会涉及到比较复杂的概率统计学知识，所以这里只是简单地说明。

### 每层的节点数目

上面我们提到 `MaxLevel`，[原版论文 ](ftp://ftp.cs.umd.edu/pub/skipLists/skiplists.pdf)中用 `L(n)` 来表示，要求 `L(n)` 层有 `1/p` 个节点，在搜索时可以不理会比 `L(n)` 更高的层数，直接从 `L(n)` 层开始搜索，这样效率最高。

直观上看，第 l 层的节点中在第 $l+1$ 层也有索引的个数是 $n_{l+1}=n_lp$ 因此第 l 层的节点个数为：

$n_l=np^{l−1}$

于是代入 $n_{L(n)}=1/p$ 得到 $L(n)=log_{1/p}n$。

### 最高的层数

上面推导到每层的节点数目，直观上看，如果某一层的节点数目小于等于 1，则可以认为它是最高层了，代入 $np^{l−1}=1$ 得到层数 $Lmax=log_{1/p}n+1=L(n)+1=O(logn)$。

实际上这个问题并没有直接的解析解，我们能知道的是，当 $n$ 足够大时，最大能达到的层数为 $O(logn)$。

### 搜索的时间复杂度

为了计算搜索的时间复杂度，我们可以将查找的过程倒过来，从搜索最后的节点开始，一直向左或向上，直到最顶层。如下图，在路径上的每一点，都可能有两种情况：

![Skip List Search Backward](https://lotabout.me/2018/skip-list/skip-list-back-search.svg)

1. 节点有上一层的节点，向上。这种情况出现的概率是 `p`。
2. 节点没有上一层的节点，向左。出现的概率是 `1-p`。

于是，设 `C(k)` 为反向搜索爬到第 `k` 层的平均路径长度，则有：

```
C(0) = 0
C(k) = p * (情况1) + (1-p) * (情况2)
```

将两种情况也用 `C` 代入，有：

```
C(k) = p*(1 + C(k–1)) + (1–p)*(1 + C(k))
C(k) = C(k–1) + 1/p
C(k) = k/p
```

上式表明，搜索时，平均在每层上需要搜索的路径长度为 $1/p$，从平均的角度上和我们第一小节构造的“静态”结构相同（p 取 `1/2`）。

又注意到，上小节我们知道跳表的最大层数为 $O(logn)$，因此，搜索的复杂度 $O(logn)/p=O(logn)$。

P.S. 这里我们用到的是最大层数，原论文证明时用到的是 $L(n)$，然后再考虑从 $L(n)$ 层到最高层的平均节点个数。这里为了理解方便不再详细证明。

## 小结

1. 各种搜索结构提高效率的方式都是通过空间换时间得到的。
2. 跳表最终形成的结构和搜索树很相似。
3. 跳表通过随机的方式来决定新插入节点来决定索引的层数。
4. 跳表搜索的时间复杂度是 $O(logn)$，插入/删除也是。

想到快排(quick sort)与其它排序算法（如归并排序/堆排序）虽然时间复杂度是一样的，但复杂度的常数项较小；跳表的原论文也说跳表能提供一个常数项的速度提升，因此想着常数项小是不是随机算法的一个特点？这也它们大放异彩的重要因素吧。

> 来源：https://lotabout.me/2018/skip-list/

## 参考

- [ftp://ftp.cs.umd.edu/pub/skipLists/skiplists.pdf](ftp://ftp.cs.umd.edu/pub/skipLists/skiplists.pdf) 原论文
- https://ticki.github.io/blog/skip-lists-done-right/ skip list 的一些变种、优化
- https://eugene-eeo.github.io/blog/skip-lists.html skip list 的一些相关复杂度分析
- http://cglab.ca/~morin/teaching/5408/refs/p90b.pdf skip list cookbook，算是 skip list 各方面的汇总
- [一个可以在有序元素中实现快速查询的数据结构](https://juejin.im/entry/59b0eed46fb9a0249471f357) 包含 skip list 的 C++ 实现
- [Redis内部数据结构详解(6)——skiplist](http://zhangtielei.com/posts/blog-redis-skiplist.html) 图文并茂讲解 skip list，可与本文交叉对照
- https://www.youtube.com/watch?v=2g9OSRKJuzM MIT 关于 skip list 的课程
- https://courses.csail.mit.edu/6.046/spring04/handouts/skiplists.pdf MIT 课程讲义