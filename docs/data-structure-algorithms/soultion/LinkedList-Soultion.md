---
title: 链表-热题
date: 2022-06-08
tags: 
 - LikedList
 - algorithms
categories: leetcode
---

![](https://cdn.pixabay.com/photo/2018/06/17/20/35/chain-3481377_1280.jpg)

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

**最重要的一个技巧就是，你得行动，写起来**

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
public ListNode reverseList(ListNode head){
  if(head == null || head.next == null){
    return head;
  }
  //申请节点，pre和 cur，pre指向null
  ListNode pre = null;
  ListNode cur = head;

  while(cur != null) {
    //记录当前节点的下一个节点 
    //每一步都需要调整当前阶段 cur 的 next 指针，使其指向前一个节点 pre，然而，调整之前需要先保存 cur 的下一个节点
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

```java
public ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) {
        return head; // 基本情况：空链表或只有一个节点
    }
    ListNode p = reverseList(head.next); // 递归反转子链表
    head.next.next = head; // 将当前节点的下一个节点的next指回当前节点
    head.next = null; // 将当前节点的next设为null，防止循环引用
    return p; // 返回新的头节点
}
```



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

**思路**：

1. 判断环的存在：
   - 快指针 `fast`（每次走 2 步）和慢指针 `slow`（每次走 1 步）从链表头节点出发。
   - 若两指针相遇，说明链表有环；若 `fast` 遇到 `null`，说明无环。
2. **找到环的入口**：
   - 相遇后，将 `fast` 重新指向头节点，`slow` 留在相遇点。
   - 两指针以相同速度（每次 1 步）移动，再次相遇的节点即为环的入口。

如下图所示，设链表中环外部分的长度为 a。slow 指针进入环后，又走了 b 的距离与 fast 相遇。此时，fast 指针已经走完了环的 n 圈，因此它走过的总距离为 `a+n(b+c)+b=a+(n+1)b+nc`。

![fig1](https://assets.leetcode-cn.com/solution-static/142/142_fig1.png)

根据题意，任意时刻，fast 指针走过的距离都为 slow 指针的 2 倍。因此，我们有
`a+(n+1)b+nc=2(a+b)⟹a=c+(n−1)(b+c)`

有了 a=c+(n-1)(b+c) 的等量关系，我们会发现：从相遇点到入环点的距离加上 n-1 圈的环长，恰好等于从链表头部到入环点的距离。

因此，当发现 slow 与 fast 相遇时，我们再额外使用一个指针 ptr。起始，它指向链表头部；随后，它和 slow 每次向后移动一个位置。最终，它们会在入环点相遇。

```java
public ListNode detectCycle(ListNode head) {
    if (head == null || head.next == null) {
        return null;
    }

    ListNode slow = head;
    ListNode fast = head;

    // 检测环是否存在
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            break;
        }
    }

    // 如果fast或fast.next为null，说明没有环
    if (fast == null || fast.next == null) {
        return null;
    }

    // 寻找环的入口节点
    ListNode ptr1 = head;
    ListNode ptr2 = slow; // 此时slow和fast相遇，可以从slow或fast开始
    while (ptr1 != ptr2) {
        ptr1 = ptr1.next;
        ptr2 = ptr2.next;
    }

    return ptr1; // 或返回ptr2，此时ptr1和ptr2相等，都指向环的入口节点
}
```



### [160. 相交链表](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)

> 给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null` 。
>
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

思路：

- 使用栈：遍历链表，将节点值依次压入栈中，然后再遍历链表，将节点值与栈顶元素进行比较，如果都相等，则是回文链表。
- 使用额外数组：遍历链表，将节点值存入一个数组中，然后双指针检查数组是否为回文数组。

```java
public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) {
        return true; // 空链表或单个节点是回文
    }

    List<Integer> list = new ArrayList<>();
    while (head != null) {
        list.add(head.val);
        head = head.next;
    }

    int left = 0;
    int right = list.size() - 1;

    while (left < right) {
        if (!list.get(left).equals(list.get(right))) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}
```



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
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    // 创建一个虚拟头节点，用于简化头节点可能发生变化的情况
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;

    // 初始化进位为0
    int carry = 0;

    // 当两个链表都不为空或者存在进位时，继续循环
    while (l1 != null || l2 != null || carry > 0) {
        // 获取两个链表当前节点的值，如果链表为空则视为0
        int x = (l1 != null) ? l1.val : 0;
        int y = (l2 != null) ? l2.val : 0;

        // 计算当前位的和以及新的进位
        int sum = carry + x + y;
        carry = sum / 10;

        // 创建新节点存储当前位的值
        current.next = new ListNode(sum % 10);
        current = current.next;

        // 移动到两个链表的下一个节点
        if (l1 != null) l1 = l1.next;
        if (l2 != null) l2 = l2.next;
    }

    // 返回虚拟头节点的下一个节点，即实际结果的头节点
    return dummy.next;
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

思路：LRU 缓存机制可以通过哈希表（HashMap）和双向链表（Doubly Linked List）的组合来实现。哈希表用于快速查找缓存中的元素，而双向链表用于维护元素的访问顺序。

- 哈希表：键为缓存的键，值为双向链表中的节点。这样可以在 O(1) 时间内通过键找到对应的节点。
- 双向链表：每个节点存储键、值和指向前一个节点、后一个节点的指针。链表按照访问顺序排序，最近访问的节点放在链表尾部，最久未访问的节点放在链表头部。

```java
import java.util.HashMap;
import java.util.Map;

class LRUCache {
    private final int capacity;
    private final Map<Integer, DLinkedNode> cache;
    private final int size;
    private final DLinkedNode head, tail;

    // 使用伪头部和伪尾部节点
    class DLinkedNode {
        int key;
        int value;
        DLinkedNode prev;
        DLinkedNode next;

        DLinkedNode() {}

        DLinkedNode(int key, int value) { this.key = key; this.value = value; }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.size = 0;
        // 使用伪头部和伪尾部节点
        head = new DLinkedNode();
        tail = new DLinkedNode();
        head.next = tail;
        tail.prev = head;
        cache = new HashMap<>(capacity);
    }

    public int get(int key) {
        DLinkedNode node = cache.get(key);
        if (node == null) {
            return -1;
        }
        // 移动到头部
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        DLinkedNode node = cache.get(key);
        if (node == null) {
            // 如果 key 不存在，创建一个新的节点
            DLinkedNode newNode = new DLinkedNode(key, value);
            // 添加进哈希表
            cache.put(key, newNode);
            // 添加至双向链表的头部
            addToHead(newNode);
            ++size;
            if (size > capacity) {
                // 如果超出容量，删除双向链表的尾部节点
                DLinkedNode tail = removeTail();
                // 删除哈希表中对应的项
                cache.remove(tail.key);
                --size;
            }
        } else {
            // 如果 key 存在，先通过哈希表定位，再修改 value，并移动到头部
            node.value = value;
            moveToHead(node);
        }
    }

    private void addToHead(DLinkedNode node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(DLinkedNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void moveToHead(DLinkedNode node) {
        removeNode(node);
        addToHead(node);
    }

    private DLinkedNode removeTail() {
        DLinkedNode res = tail.prev;
        removeNode(res);
        return res;
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


```java
public ListNode removeNthFromEnd(ListNode head, int n) {
   // 创建一个虚拟头结点，方便处理头结点的删除情况
    ListNode dummyHead = new ListNode(0, head);
    //dummyHead.next = head;

    ListNode first = dummyHead;
    ListNode second = dummyHead;

    // 将 first 指针向前移动 n+1 步
    for (int i = 0; i <= n; i++) {
        first = first.next;
    }

    // 同时移动 first 和 second 指针，直到 first 到达链表末尾
    while (first != null) {
        first = first.next;
        second = second.next;
    }

    // 删除倒数第 N 个节点
    second.next = second.next.next;

    return dummyHead.next; // 返回新的头结点
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

思路：题目要求常数级空间复杂度，我们不能使用额外数组来存储数据，排除了递归快速排序的可能性。因此使用归并排序，可以通过迭代完成排序。

```java
public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) {
        return head; // 空链表或只有一个节点的链表已经是排序好的
    }

    // 使用快慢指针找到链表的中间节点
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    ListNode mid = slow.next; // mid 是中间节点
    slow.next = null; // 将链表分成两半

    // 递归或迭代地对两半链表进行排序
    ListNode left = sortList(head); // 排序左半部分
    ListNode right = sortList(mid); // 排序右半部分

    // 合并两个已排序的链表
    ListNode sortedList = mergeTwoLists(left, right);
    return sortedList;
}

// 合并两个已排序的链表
private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0); // 创建一个虚拟头结点
    ListNode tail = dummy; // tail 用于追踪合并后的链表的尾部

    while (l1 != null && l2 != null) {
        if (l1.val < l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }

    // 如果其中一个链表已经遍历完，直接将另一个链表的剩余部分接到合并后的链表后面
    if (l1 != null) {
        tail.next = l1;
    } else {
        tail.next = l2;
    }

    return dummy.next; // 返回合并后的链表的头结点（跳过虚拟头结点）
}
```



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

思路：对于合并 K 个排序链表的问题，有几种常见的解决方案：
- 逐个合并：我们可以先将前两个链表合并，然后将结果与第三个链表合并，以此类推，直到合并完所有链表。这种方法的时间复杂度是 $O(K^2 * N)$，其中 K 是链表的个数，N 是链表中节点的平均个数。当 K 较大时，效率较低。
- 使用优先队列（最小堆）：我们可以将所有的链表节点放入一个最小堆中，然后每次从堆中取出最小的节点，将其添加到结果链表中，并继续将取出节点的下一个节点（如果存在）放入堆中。这种方法的时间复杂度是 $O(K * N * log K)$，其中 K 是链表的个数，N 是链表中节点的平均个数。由于堆的操作（插入和删除最小值）是 $O(log K)$ 的，这种方法在 K 较大时比逐个合并更高效。
- 分治法：我们可以将 K 个链表分成两组，分别合并这两组链表，然后再将合并后的两个链表合并。这种方法的时间复杂度是 $O(N * log K)$，其中 N 是所有链表中节点的总数。这种方法与快速排序类似，利用了分治的思想来降低时间复杂度。
在 Java 中，我们可以选择使用优先队列（通过 PriorityQueue 类实现）来解决这个问题，因为它相对容易实现且效率较高。

```java
public ListNode mergeKLists(ListNode[] lists) {
    // 创建一个最小堆，用于存储链表节点
    PriorityQueue<ListNode> pq = new PriorityQueue<>(Comparator.comparingInt(node -> node.val));

    // 将所有链表的头节点加入最小堆
    for (ListNode head : lists) {
        if (head != null) {
            pq.offer(head);
        }
    }

    // 创建一个虚拟头结点，方便处理合并后的链表
    ListNode dummy = new ListNode(0);
    ListNode curr = dummy;

    // 当最小堆不为空时，继续合并链表
    while (!pq.isEmpty()) {
        // 从最小堆中取出最小的节点
        ListNode node = pq.poll();
        // 将该节点添加到结果链表中
        curr.next = node;
        curr = curr.next;
        // 如果该节点有下一个节点，则将其加入最小堆
        if (node.next != null) {
            pq.offer(node.next);
        }
    }

    // 返回合并后的链表的头结点（跳过虚拟头结点）
    return dummy.next;
}
}
```



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

**思路**：

- 思路一：逐节点反转法。遍历找到哦啊 left 和 right 的位置，然后对这部分链表进行反转。反转完成后，调整反转部分和前后链表的连接关系
- 思路二：头插法。创建一个新的虚拟节点，然后将需要反转的部分逐个插入到新链表的前端，实现反转

```java
public ListNode reverseBetween(ListNode head, int left, int right) {
    // 如果链表为空或left等于right，则无需反转，直接返回原链表头节点
    if (head == null || left == right) {
        return head;
    }

    // 创建虚拟头节点，其next指向原链表头节点
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    // 定位到left位置的前一个节点
    ListNode pre = dummy;
    for (int i = 1; i < left; i++) {
        pre = pre.next;
    }

    // start指向需要反转的链表部分的起始节点
    ListNode start = pre.next;

    // 初始化反转链表部分所需的指针
    ListNode prev = null;
    ListNode current = start;

    //使用right - left + 1来计算k
    int k = right - left + 1;

    // 反转k个节点
    for (int i = 0; i < k; i++) {
        ListNode next = current.next; // 保存current的下一个节点
        current.next = prev; // 将current的next指向prev，实现反转
        // 移动prev和current指针
        prev = current;
        current = next;
    }

    // 连接反转后的链表部分与原链表剩余部分
    // pre.next指向反转后的链表头节点（即原链表的第right个节点）
    pre.next = prev;
    // start.next指向反转后的链表尾节点的下一个节点（即原链表的第right+1个节点）
    start.next = current;

    // 返回反转后的链表头节点（虚拟头节点的下一个节点）
    return dummy.next;
}
```

