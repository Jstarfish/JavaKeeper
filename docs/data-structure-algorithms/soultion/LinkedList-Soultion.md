---
title: 链表-热题
date: 2022-06-08
tags: 
 - LikedList
categories: leetcode
---

> **导读**：无法高效获取长度，无法根据偏移快速访问元素，是链表的两个劣势。然而面试的时候经常碰见诸如获取倒数第 k 个元素，获取中间位置的元素，判断链表是否存在环，判断环的长度等和长度与位置有关的问题。这些问题都可以通过灵活运用双指针来解决。
>
> **关键词**：双指针、快慢指针

### 小技巧

使用哑结点（哨兵节点、带头链表）

注意边界处理：

- 如果链表为空时，代码是否能正常工作？
- 如果链表只包含一个结点时，代码是否能正常工作？
- 如果链表只包含两个结点时，代码是否能正常工作？
- 代码逻辑在处理头结点和尾结点的时候，是否能正常工作？

最重要的一个技巧就是，你得行动，写起来

### [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)

>反转一个单链表。
>
>```
>输入: 1->2->3->4->5->NULL
>输出: 5->4->3->2->1->NULL
>```

**进阶:** 你可以迭代或递归地反转链表。你能否用两种方法解决这道题？

**动画描述**

![迭代.gif](https://pic.leetcode-cn.com/7d8712af4fbb870537607b1dd95d66c248eb178db4319919c32d9304ee85b602-%E8%BF%AD%E4%BB%A3.gif)

两个指针，最开始就把指针位置倒着放，然后遍历替换数字，最后返回 pre 就行

**思路**：迭代

假设链表为 1→2→3→∅，我们想要把它改成  ∅←1←2←3。

在遍历链表时，将当前节点的 next 指针改为指向前一个节点。由于节点没有引用其前一个节点，因此必须事先存储其前一个节点。在更改引用之前，还需要存储后一个节点。最后返回新的头引用。

```java
public ListNode reverseList_1(ListNode head){
  if(head == null || head.next == null){
    return head;
  }
  //申请节点，pre和 cur，pre指向null
  ListNode cur = head;
  ListNode pre = null;
  while(cur != null) {
    //记录当前节点的下一个节点
    ListNode tmp = cur.next;
    //然后将该节点指向pre
    cur.next = pre;
    //pre和cur节点都前进一位
    pre = cur;
    cur = tmp;
  }
  return pre;
}
```

**思路**：递归 (https://leetcode.cn/problems/reverse-linked-list/solution/shi-pin-jiang-jie-die-dai-he-di-gui-hen-hswxy/)



### [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)

> 给定一个链表，判断链表中是否有环。
>
> 为了表示给定链表中的环，我们使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 `pos` 是 `-1`，则在该链表中没有环。
>
> ```
> 输入：head = [3,2,0,-4], pos = 1
> 输出：true
> 解释：链表中有一个环，其尾部连接到第二个节点。
> ```
>
> ![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

**题目解析**

这道题是快慢指针的**经典应用**。（当然还可以遍历所有节点，用哈希表存储已经访问过的节点，然后判断是否存在哈希表中即可）

设置两个指针，一个每次走一步的**慢指针**和一个每次走两步的**快指针**。

- 如果不含有环，跑得快的那个指针最终会遇到 null，说明链表不含环
- 如果含有环，快指针会超慢指针一圈，和慢指针相遇，说明链表含有环。

```java
public boolean hasCycle(ListNode head) {
  if (head == null || head.next == null) {
    return false;
  }
  // 龟兔起跑
  ListNode fast = head;
  ListNode slow = head;

  //while 条件需要注意,如果不含有环，不管是快的还是慢的都会遇到null,
  // 如果不含有环的情况用slow！=null 判断的话，fast.next.next 走那么快，没值，不就空指针了
  while (fast != null && fast.next != null) {
    // 龟走一步
    slow = slow.next;
    // 兔走两步
    fast = fast.next.next;
    if (slow == fast) return true;
  }
  return false;
}
```

如果存在环，如何判断环的长度呢？方法是，快慢指针相遇后继续移动，直到第二次相遇。两次相遇间的移动次数即为环的长度。



### [142. 环形链表 II](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

> 给定一个链表的头节点  head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
>
> 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。
>
> 不允许修改 链表。
>
> ```
> 输入：head = [3,2,0,-4], pos = 1
> 输出：返回索引为 1 的链表节点
> 解释：链表中有一个环，其尾部连接到第二个节点。
> ```

如下图所示，设链表中环外部分的长度为 a。slow 指针进入环后，又走了 b 的距离与 fast 相遇。此时，fast 指针已经走完了环的 n 圈，因此它走过的总距离为 `a+n(b+c)+b=a+(n+1)b+nc`。

![fig1](https://assets.leetcode-cn.com/solution-static/142/142_fig1.png)

根据题意，任意时刻，fast 指针走过的距离都为 slow 指针的 2 倍。因此，我们有
`a+(n+1)b+nc=2(a+b)⟹a=c+(n−1)(b+c)`

有了 a=c+(n-1)(b+c) 的等量关系，我们会发现：从相遇点到入环点的距离加上 n-1 圈的环长，恰好等于从链表头部到入环点的距离。

因此，当发现 slow 与 fast 相遇时，我们再额外使用一个指针 ptr。起始，它指向链表头部；随后，它和 slow 每次向后移动一个位置。最终，它们会在入环点相遇。

```java
public ListNode detectCycle_me(ListNode head) {
  if (head == null || head.next == null) {
    return null;
  }
  ListNode fast = head;
  ListNode slow = head;
  while (fast != null && fast.next != null) {
    fast = fast.next.next;
    slow = slow.next;
    if (fast == slow) {
      //前边和判断是否有环，一样，只是这里不返回true
      //构建第二轮相遇，slow指针 位置不变 ，将fast指针重新 指向链表头部节点或者重新构建一个指针 ；slow和fast同时每轮向前走 1 步；
      ListNode ptr = head;

      while (ptr != slow) {
        ptr = ptr.next;
        slow = slow.next;
      }
      return ptr;
    }
  }
  return null;
}
```



### [160. 相交链表](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)

> ![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_example_1.png)
>
> ```
> 输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
> 输出：Intersected at '8'
> 解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。
> 从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。
> 在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
> ```

**题目解析** 

为满足题目时间复杂度和空间复杂度的要求，我们可以使用双指针法。

- 创建两个指针 pA 和 pB 分别指向链表的头结点 headA 和 headB。

- 当 pA 到达链表的尾部时，将它重新定位到链表 B 的头结点 headB，同理，当 pB 到达链表的尾部时，将它重新定位到链表 A 的头结点 headA。

- 当 pA 与 pB 相等时便是两个链表第一个相交的结点。 这里其实就是相当于把两个链表拼在一起了。pA 指针是按 B 链表拼在 A 链表后面组成的新链表遍历，而 pB 指针是按A链表拼在B链表后面组成的新链表遍历。

  举个简单的例子： A链表：{1,2,3,4}  B链表：{6,3,4} pA按新拼接的链表{1,2,3,4,6,3,4}遍历 pB按新拼接的链表{6,3,4,1,2,3,4}遍历

> 力扣有这么两个评论：
>
> - 这道题记住一句歌词就成了：我吹过你吹过的晚风
>- 走到尽头见不到你，于是走过你来时的路，等到相遇时才发现，你也走过我来时的路

```java
public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    if (headA == null || headB == null) {
        return null;
    }
    ListNode pA = headA, pB = headB;
    while (pA != pB) {
      	//这里注意 如果pA 到了尾结点后要转向headB，而不是 pB
        pA = pA == null ? headB : pA.next;
        pB = pB == null ? headA : pB.next;
    }
   //如果没有相交，这里会返回 null
    return pA;
}
```



### [21. 合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

> 将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
>
> ```
> 输入：1->2->4, 1->3->4
> 输出：1->1->2->3->4->4
> ```

**思路**：如果 l1 或者 l2 一开始就是空链表 ，那么没有任何操作需要合并，所以我们只需要返回非空链表。否则，我们要判断 l1 和 l2 哪一个链表的头节点的值更小，然后递归地决定下一个添加到结果里的节点。如果两个链表有一个为空，递归结束。

![img](https://pic.leetcode-cn.com/fe5eca7edea29a76316f7e8529f73a90ae4990fd66fea093c6ee91567788e482-%E5%B9%BB%E7%81%AF%E7%89%874.JPG)

```java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if (l1 == null) {
        return l2;
    } else if (l2 == null) {
        return l1;
    } else if (l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
}
```

**复杂度分析**

- 时间复杂度：$O(n+m)$，其中 n 和 m 分别为两个链表的长度。因为每次调用递归都会去掉 l1 或者 l2 的头节点（直到至少有一个链表为空），函数 mergeTwoList 至多只会递归调用每个节点一次。因此，时间复杂度取决于合并后的链表长度，即 $O(n+m)$。

- 空间复杂度：$O(n + m)$，其中 n 和 m 分别为两个链表的长度。递归调用 mergeTwoLists 函数时需要消耗栈空间，栈空间的大小取决于递归调用的深度。结束递归调用时 mergeTwoLists 函数最多调用 n+m 次，因此空间复杂度为 $O(n+m)$。

迭代法：

```java
  public ListNode mergeList(ListNode n1,ListNode n2){
      if(n1 == null) return n2;
      if(n2 == null) return n1;

      ListNode dummy = new ListNode(-1);
      ListNode p = dummy;

      // 比较 p1 和 p2 两个指针
      // 将值较小的的节点接到 p 指针
      while (n1 != null && n2 != null){
          if(n1.val <= n2.val) {
              p.next = n1;
              n1 = n1.next;
          }else {
              p.next = n2;
              n2 = n2.next;
          }
          // p 指针不断前进
          p = p.next;
      }

      //处理比较后较长的链表剩余部分
      if (n1 != null) {
          p.next = n1;
      }

      if (n2 != null) {
          p.next = n2;
      }
      return dummy.next;
  }
```



### [234. 回文链表](https://leetcode-cn.com/problems/palindrome-linked-list/)

> 请判断一个链表是否为回文链表。
>
> ```
> 输入: 1->2
> 输出: false
> ```
>
> ```
> 输入: 1->2->2->1
> 输出: true
> ```
>
> ![img](http://img.starfish.ink/data-structure/pal1linked-list.jpg)



**解法1：**

1. 复制链表值到数组列表中。
2. 使用双指针法判断是否为回文。

```java
public static boolean isPalindrome_me(ListNode head){
  if(head == null || head.next == null){
    return false;
  }
  List<Integer> list = new ArrayList<>();
  while(head != null){
    list.add(head.val);
    head = head.next;
  }
  Integer[] arrs = list.toArray(new Integer[list.size()]);

  int tmp = 0;
  for(int i=0;i<arrs.length/2;i++){ //注意这里只遍历到一半就可以了
    if(arrs[i]== arrs[arrs.length-i-1]){
      tmp++;
    }
  }
  // 双指针，tmp 一直往前走，都相等的话肯定等于数据的一半
  return tmp == arrs.length / 2;
}
```

**解法2：**

我们先找到链表的中间结点，然后将中间结点后面的链表进行反转（206），反转之后再和前半部分链表进行比较，如果相同则表示该链表属于回文链表，返回true；否则，否则返回false



### [2. 两数相加](https://leetcode-cn.com/problems/add-two-numbers/)

> 给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
>
> 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
>
> 您可以假设除了数字 0 之外，这两个数都不会以 0 开头。
>
> ```
> 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
> 输出：7 -> 0 -> 8
> 原因：342 + 465 = 807
> ```

**思路**：看例子中的原因就会很迷糊，直接从各自第一位 `l1.va、l2.val` 相加（也就是个位），正常进位就行，然后按顺序返回链表

- 每一位计算的同时需要考虑上一位的进位问题，而当前位计算结束后同样需要更新进位值
- 如果两个链表全部遍历完毕后，进位值为 1，则在新链表最前方添加节点 1
- 小技巧：对于链表问题，返回结果为头结点时，通常需要先初始化一个预先指针 pre，该指针的下一个节点指向真正的头结点 head。使用预先指针的目的在于链表初始化时无可用节点值，而且链表构造过程需要指针移动，进而会导致头指针丢失，无法返回结果。

![](https://pic.leetcode-cn.com/2519bd7f7da0f3bd51dd0f06e6363f4f62bfb25472c5ec233cf969e5c1472e33-file_1559748028103)


```java
public static ListNode addTwoNumbers(ListNode l1, ListNode l2) {
  //定义一个新链表伪指针，用来指向头指针，返回结果，不动
  ListNode pre = new ListNode(0);
  //定义一个可移动的指针，指向头结点，动他
  ListNode cur = pre;
  //进位
  int carry = 0;
  while (l1 != null || l2 != null) {
    int x = l1 == null ? 0 : l1.val;
    int y = l2 == null ? 0 : l2.val;
    int sum = x + y + carry;

    //如果大于10了，就进位，除以10来计算进位数
    carry = sum / 10;1
    //进位后剩下的余数
    sum = sum % 10;
    //进位后的数据
    //将求和数赋值给新链表的节点，
    //注意这个时候不能直接将sum赋值给cur.next = sum。这时候会报，类型不匹配。
    //所以这个时候要创一个新的节点，将值赋予节点
    cur.next = new ListNode(sum);
    //将新链表的节点后移
    cur = cur.next;
    //往后移动
    if (l1 != null) {
      l1 = l1.next;
    }
    if (l2 != null) {
      l2 = l2.next;
    }
  }
  //如果最后一位还有进位的话，再往后增加一个节点
  if (carry == 1) {
    cur.next = new ListNode(carry);
  }
  return pre.next;
}
```



### [146.LRU 缓存机制](https://leetcode-cn.com/problems/lru-cache/)

> 运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制 。实现 LRUCache 类：
>
> - LRUCache(int capacity) 以正整数作为容量 capacity 初始化 LRU 缓存
> - int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
> - void put(int key, int value) 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字-值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。
>
> ```
> 输入
> ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
> [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
> 输出
> [null, null, null, 1, null, -1, null, -1, 3, 4]
> 
> 解释
> LRUCache lRUCache = new LRUCache(2);
> lRUCache.put(1, 1); // 缓存是 {1=1}
> lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
> lRUCache.get(1);    // 返回 1
> lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
> lRUCache.get(2);    // 返回 -1 (未找到)
> lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
> lRUCache.get(1);    // 返回 -1 (未找到)
> lRUCache.get(3);    // 返回 3
> lRUCache.get(4);    // 返回 4
> ```

分析上面的操作过程，要让 put 和 get 方法的时间复杂度为 O(1)，我们可以总结出 cache 这个数据结构必要的条件：查找快，插入快，删除快，有顺序之分。

因为显然 cache 必须有顺序之分，以区分最近使用的和久未使用的数据；而且我们要在 cache 中查找键是否已存在；如果容量满了要删除最后一个数据；每次访问还要把数据插入到队头。

那么，什么数据结构同时符合上述条件呢？哈希表查找快，但是数据无固定顺序；链表有顺序之分，插入删除快，但是查找慢。所以结合一下，形成一种新的数据结构：**哈希链表**。

![HashLinkedList](https://pic.leetcode-cn.com/b84cf65debb43b28bd212787ca63d34c9962696ed427f638763be71a3cb8f89d.jpg)

```java
// key 映射到 Node(key, val)
HashMap<Integer, Node> map;
// Node(k1, v1) <-> Node(k2, v2)...
DoubleList cache;

int get(int key) {
    if (key 不存在) {
        return -1;
    } else {        
        将数据 (key, val) 提到开头；
        return val;
    }
}

void put(int key, int val) {
    Node x = new Node(key, val);
    if (key 已存在) {
        把旧的数据删除；
        将新节点 x 插入到开头；
    } else {
        if (cache 已满) {
            删除链表的最后一个数据腾位置；
            删除 map 中映射到该数据的键；
        } 
        将新节点 x 插入到开头；
        map 中新建 key 对新节点 x 的映射；
    }
}
```





### [19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

> 给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。
>
> ```
> 给定一个链表: 1->2->3->4->5, 和 n = 2.
> 
> 当删除了倒数第二个节点后，链表变为 1->2->3->5.
> ```

**思路**：

- 先计算链表长度（遍历），获取链表长度 L，之后再次遍历，遍历到 L-n+1 时，就是删除的节点

```java
public ListNode removeNthFromEnd_1(ListNode head, int n) {
        ListNode pre = new ListNode(0,head);
        int length = getLength(head);
        
  			cur = pre;
        //遍历到需要删除的位置的前一个，比如1，2，3，4，5 遍历到第 < 4 就可以了,且 i 从 1 开始
        for (int i=1;i<length-n+1;i++){
            cur = cur.next;
        }
        // 删除节点，返回哑结点后的结果即可
        cur.next = cur.next.next;
        return pre.next;
    }

    public int getLength(ListNode head){
        int length = 0;
        while (head != null){
            //这里不能是 length++
            ++length;
            head=head.next;
        }
        return length;
    }
```

- 双指针法，整体思路是让前面的指针先移动`n`步，之后前后指针共同移动直到前面的指针到尾部为止

  ![](https://assets.leetcode-cn.com/solution-static/19/p3.png)

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
  ListNode dummy = new ListNode(0, head);
  ListNode first = head;
  ListNode second = dummy;

  //让 first 指针先移动 n 步
  for (int i = 0; i < n; ++i) {
    first = first.next;
  }
  while (first != null) {
    first = first.next;
    second = second.next;
  }
  second.next = second.next.next;
  return dummy.next;
}
```



### [148. 排序链表](https://leetcode.cn/problems/sort-list/)

> 给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。
>
> 在 *O*(*n* log *n*) 时间复杂度和常数级空间复杂度下，对链表进行排序。
>
> **示例 1:**
>
> ```
> 输入: 4->2->1->3
> 输出: 1->2->3->4
> ```

**解答一：归并排序（递归法）**

**解答二：归并排序（从底至顶直接合并）**





### [86. 分隔链表](https://leetcode.cn/problems/partition-list/)

> 给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。
>
> 你应当 保留 两个分区中每个节点的初始相对位置。
>
> ![img](https://assets.leetcode.com/uploads/2021/01/04/partition.jpg)
>
> ```
> 输入：head = [1,4,3,2,5,2], x = 3
> 输出：[1,2,2,4,3,5]
> ```

```java
public ListNode partition(ListNode head, int x) {
   // 存放小于 x 的链表的虚拟头结点
    ListNode dummy1 = new ListNode(-1);
    // 存放大于等于 x 的链表的虚拟头结点
    ListNode dummy2 = new ListNode(-1);
    // p1, p2 指针负责生成结果链表
    ListNode p1 = dummy1, p2 = dummy2;
    // p 负责遍历原链表，类似合并两个有序链表的逻辑
    // 这里是将一个链表分解成两个链表
    ListNode p = head;
    while (p != null) {
        if (p.val >= x) {
            p2.next = p;
            p2 = p2.next;
        } else {
            p1.next = p;
            p1 = p1.next;
        }
        // 不能直接让 p 指针前进，
        // p = p.next
        // 断开原链表中的每个节点的 next 指针
        ListNode temp = p.next;
        p.next = null;
        p = temp;
    }
    // 连接两个链表
    p1.next = dummy2.next;

    return dummy1.next;
 }
```





### [23. 合并K个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists)

> 给你一个链表数组，每个链表都已经按升序排列。
>
> 请你将所有链表合并到一个升序链表中，返回合并后的链表。
>
> ```
> 输入：lists = [[1,4,5],[1,3,4],[2,6]]
> 输出：[1,1,2,3,4,4,5,6]
> 解释：链表数组如下：
> [
>   1->4->5,
>   1->3->4,
>   2->6
> ]
> 将它们合并到一个有序链表中得到。
> 1->1->2->3->4->4->5->6
> ```





### [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)

> 给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。
>
> ![img](https://assets.leetcode.com/uploads/2021/02/19/rev2ex2.jpg)
>
> ```
> 输入：head = [1,2,3,4,5], left = 2, right = 4
> 输出：[1,4,3,2,5]
> ```
>
> **索引是从 1 开始的**
