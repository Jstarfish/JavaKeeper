---
title: 链表-热题
date: 2022-06-08
tags: 
 - LikedList
 - algorithms
categories: leetcode
---

![](https://img.starfish.ink/leetcode/leetcode-banner.png)

> **导读**：无法高效获取长度，无法根据偏移快速访问元素，是链表的两个劣势。然而面试的时候经常碰见诸如获取倒数第 k 个元素，获取中间位置的元素，判断链表是否存在环，判断环的长度等和长度与位置有关的问题。这些问题都可以通过灵活运用双指针来解决。
>
> **关键词**：双指针、快慢指针

### 🎯 核心考点概览

- **双指针技巧**：快慢指针、前后指针
- **哨兵节点**：简化边界处理
- **递归思维**：分治与回溯
- **空间优化**：O(1)空间复杂度

### 📝 解题万能模板

#### 基础模板

```java
// 哨兵节点模板
ListNode dummy = new ListNode(0);
dummy.next = head;

// 双指针模板  
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
```

#### 边界检查清单

- ✅ 空链表：`head == null`
- ✅ 单节点：`head.next == null` 
- ✅ 双节点：`head.next.next == null`
- ✅ 头尾节点：使用哨兵节点

#### 💡 记忆口诀（朗朗上口版）

- **快慢指针**："快二慢一找中点，有环必定会相遇"
- **反转链表**："断链之前存next，三指针来回倒腾"
- **合并链表**："小的先走大的等，递归合并最轻松"
- **删除节点**："哨兵开路找前驱，一指断链二连接"
- **双指针**："两头并进各有责，相遇之时是答案"
- **分治算法**："大化小来小化了，分而治之最高效"

**最重要的一个技巧就是，你得行动，写起来**



### 📋 分类索引

1. **🔥 双指针技巧类**：[环形链表](#_环形链表141)、[环形链表II](#_142-环形链表-ii)、[链表中间节点](#_876-链表的中间结点)、[删除倒数第N个](#_19-删除链表的倒数第n个结点)、[旋转链表](#_61-旋转链表)
2. **🔄 反转与重排类**：[反转链表](#_206-反转链表)、[反转链表II](#_92-反转链表-ii)、[K个一组翻转](#_25-k个一组翻转链表)、[重排链表](#_143-重排链表)、[两两交换](#_24-两两交换链表中的节点)
3. **🔗 相交与合并类**：[相交链表](#_160-相交链表)、[合并两个有序链表](#_21-合并两个有序链表)、[合并K个升序链表](#_23-合并k个升序链表)
4. **🗑️ 删除与去重类**：[移除链表元素](#_203-移除链表元素)、[删除重复元素](#_83-删除排序链表中的重复元素)、[删除重复元素II](#_82-删除排序链表中的重复元素-ii)
5. **🧮 数学运算类**：[两数相加](#_2-两数相加)、[两数相加II](#_445-两数相加-ii)
6. **🔍 特殊结构类**：[LRU缓存](#_146-lru缓存)、[复制带随机指针链表](#_138-复制带随机指针的链表)、[回文链表](#_234-回文链表)
7. **🎯 综合应用类**：[排序链表](#_148-排序链表)、[分隔链表](#_86-分隔链表)、[奇偶链表](#_328-奇偶链表)、[分隔链表2](#_725-分隔链表)
8. **🚀 进阶变体类**：[扁平化多级双向链表](#_430-扁平化多级双向链表)、[有序链表转BST](#_109-有序链表转换二叉搜索树)、[合并两个链表](#_1669-合并两个链表)

---

## 一、双指针技巧类（核心中的核心）🔥 

### 💡 核心思想

- **快慢指针**：解决环形、中点、倒数第k个问题
- **前后指针**：解决删除、窗口问题
- **双链表指针**：解决相交、合并问题

### 🎯 必掌握模板

```java
// 快慢指针模板
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
```



### [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/) 

**🎯 考察频率：极高 | 难度：简单 | 重要性：双指针经典**

> 判断链表是否有环
>
> ![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

**💡 核心思路**：快慢指针（Floyd判圈算法）

- **快指针**：每次走2步（兔子）
- **慢指针**：每次走1步（乌龟）
- **有环**：快慢指针会相遇
- **无环**：快指针先到达null

**🔑 记忆技巧**：

- **口诀**："快二慢一找中点，有环必定会相遇"
- **形象记忆**：操场跑步，快的总能追上慢的

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

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 最多遍历链表两次
- **空间复杂度**：O(1) - 只使用了两个指针

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

**💡 核心思路**：两阶段检测法

1. **第一阶段**：快慢指针检测环的存在
2. **第二阶段**：重置快指针到头节点，同速前进找入口

**🔑 记忆技巧**：

- **口诀**："相遇重置到起点，同步前进找入口"
- **数学原理**：从头到入口的距离 = 从相遇点到入口的距离

如下图所示，设链表中环外部分的长度为 a。slow 指针进入环后，又走了 b 的距离与 fast 相遇。此时，fast 指针已经走完了环的 n 圈，因此它走过的总距离为 `a+n(b+c)+b=a+(n+1)b+nc`。

![fig1](https://assets.leetcode-cn.com/solution-static/142/142_fig1.png)

根据题意，任意时刻，fast 指针走过的距离都为 slow 指针的 2 倍。因此，我们有
`a+(n+1)b+nc=2(a+b)⟹a=c+(n−1)(b+c)`

有了 a=c+(n-1)(b+c) 的等量关系，我们会发现：从相遇点到入环点的距离加上 n-1 圈的环长，恰好等于从链表头部到入环点的距离。

因此，当发现 slow 与 fast 相遇时，我们再额外使用一个指针 ptr。起始，它指向链表头部；随后，它和 slow 每次向后移动一个位置。最终，它们会在入环点相遇。

```java
public ListNode detectCycle(ListNode head){
    if (head == null || head.next == null) {
        return null;
    }

    // 初始化快慢指针
    ListNode slow = head, fast = head;

    // 第一步：检测环的存在
    while (fast != null && fast.next != null) {
        slow = slow.next;  // 慢指针移动一步
        fast = fast.next.next;  // 快指针移动两步

        // 如果快慢指针相遇，说明链表中存在环
        if (slow == fast) {
            // 第二步：找到环的起始节点
            ListNode ptr = head;  // 初始化一个指针ptr到链表头部
            while (ptr != slow) {
                ptr = ptr.next;  // ptr指针每次移动一步
                slow = slow.next;  // slow指针也每次移动一步
            }
            // 当ptr和slow再次相遇时，即为环的起始节点
            return ptr;
        }
    }

    // 如果循环结束都没有检测到环，则返回null
    return null;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 最多遍历链表两次，第一次检测环，第二次找入口
- **空间复杂度**：O(1) - 只使用了常数个指针



### [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)

**🎯 考察频率：高 | 难度：简单 | 重要性：快慢指针基础**

> 找到链表的中间节点，如果有两个中间节点，返回第二个

**💡 核心思路**：快慢指针

- 快指针走2步，慢指针走1步
- 快指针到末尾时，慢指针在中间

**🔑 记忆技巧**：

- **口诀**："快二慢一找中点，快到头时慢在中"
- **形象记忆**：跑步比赛，快的跑完全程，慢的刚好跑到一半

```java
public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历链表一次
- **空间复杂度**：O(1) - 只使用了两个指针



### [19. 删除链表的倒数第N个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) 

**🎯 考察频率：极高 | 难度：中等 | 重要性：双指针经典**

> 删除倒数第n个节点：`1->2->3->4->5`, n=2 → `1->2->3->5`

**💡 核心思路**：前后指针

- 前指针先走n+1步
- 然后前后指针同时走
- 前指针到末尾时，后指针在待删除节点的前一个

**🔑 记忆技巧**：

- **口诀**："前指先行n+1步，同步到尾删倒数"
- **形象记忆**：两人相距n步走路，前面的人到终点时，后面的人距终点还有n步

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    ListNode first = dummy, second = dummy;
    
    // 前指针先走 n+1 步
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
    return dummy.next;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 只需要遍历链表一次
- **空间复杂度**：O(1) - 只使用了常数个指针



### [61. 旋转链表](https://leetcode.cn/problems/rotate-list/) 

**🎯 考察频率：中等 | 难度：中等 | 重要性：双指针应用**

> 给你一个链表的头节点 `head` ，旋转链表，将链表每个节点向右移动 `k` 个位置。
>
> `1->2->3->4->5`, k=2 → `4->5->1->2->3`

**💡 核心思路**：

1. 先成环：尾节点连接头节点
2. 找断点：倒数第k个位置断开
3. 重新设置头尾

```java
public ListNode rotateRight(ListNode head, int k) {
    if (head == null || head.next == null || k == 0) return head;
    
    // 计算长度并成环
    ListNode tail = head;
    int len = 1;
    while (tail.next != null) {
        tail = tail.next;
        len++;
    }
    tail.next = head; // 成环
    
    // 找新的尾节点（倒数第k+1个）
    k = k % len; // 处理k大于链表长度的情况
    int stepsToNewTail = len - k;
    
    ListNode newTail = head;
    for (int i = 1; i < stepsToNewTail; i++) {
        newTail = newTail.next;
    }
    
    ListNode newHead = newTail.next;
    newTail.next = null; // 断环
    
    return newHead;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 需要遍历链表两次，一次计算长度，一次找断点
- **空间复杂度**：O(1) - 只使用了常数个指针

---



## 二、反转与重排类（高频考点）🔄 

### 💡 核心思想

- **三指针反转**：prev、curr、next三指针配合
- **递归反转**：分治思想，先处理子问题
- **局部反转**：找到边界，局部应用反转技巧

### 🎯 必掌握模板

```java
// 反转链表核心模板
ListNode prev = null, curr = head;
while (curr != null) {
    ListNode next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
}
return prev;
```

### [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/) 

**🎯 考察频率：极高 | 难度：简单 | 重要性：基础必会**

> 反转单链表：`1->2->3->4->5` 变成 `5->4->3->2->1`

**💡 核心思路**：三指针法（prev、curr、next）

- 记住口诀："**断链前，先保存next**"

- 像翻书一样，一页一页往前翻

  ![迭代.gif](https://pic.leetcode-cn.com/7d8712af4fbb870537607b1dd95d66c248eb178db4319919c32d9304ee85b602-%E8%BF%AD%E4%BB%A3.gif)

```java
// 迭代版本
public ListNode reverseList(ListNode head){
    if(head == null || head.next == null){
        return head;
    }
    
    ListNode prev = null;
    ListNode curr = head;

    while(curr != null) {
        ListNode next = curr.next;  // 保存下一个节点
        curr.next = prev;           // 反转当前节点
        prev = curr;                // prev前进
        curr = next;                // curr前进
    }
    return prev;
}

// 递归版本
public ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) {
        return head;
    }
    ListNode newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历链表中的每个节点一次
- **空间复杂度**：迭代版O(1)，递归版O(n) - 递归调用栈的深度



### [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/) 

**🎯 考察频率：高 | 难度：中等 | 重要性：局部反转经典**

> 反转第left到right个节点：`1->2->3->4->5`, left=2, right=4 → `1->4->3->2->5`

**💡 核心思路**：

1. 找到反转区间的前一个节点
2. 对区间内节点进行反转
3. 重新连接前后部分

> 思路二：头插法。创建一个新的虚拟节点，然后将需要反转的部分逐个插入到新链表的前端，实现反转

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

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历链表一次
- **空间复杂度**：O(1) - 只使用了常数个指针



### [25. K个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/) 

**🎯 考察频率：高 | 难度：困难 | 重要性：分组反转**

> 每k个节点一组反转：`1->2->3->4->5`, k=3 → `3->2->1->4->5`

**💡 核心思路**：

1. 检查是否有k个节点可反转
2. 反转这k个节点
3. 递归处理剩余部分

```java
public ListNode reverseKGroup(ListNode head, int k) {
    // 检查是否有k个节点
    ListNode curr = head;
    int count = 0;
    while (curr != null && count < k) {
        curr = curr.next;
        count++;
    }
    
    if (count == k) {
        // 反转前k个节点
        curr = reverseKGroup(curr, k); // 递归处理后续
        
        // 反转当前k个节点
        while (count-- > 0) {
            ListNode tmp = head.next;
            head.next = curr;
            curr = head;
            head = tmp;
        }
        head = curr;
    }
    
    return head;
}
```



### [143. 重排链表](https://leetcode.cn/problems/reorder-list/) 

**🎯 考察频率：中等 | 难度：中等 | 重要性：综合应用**

> 给定一个单链表 `L` 的头节点 `head` ，单链表 `L` 表示为：
>
> ```
> L0 → L1 → … → Ln - 1 → Ln
> ```
>
> 请将其重新排列后变为：
>
> ```
> L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …
> ```
>
> 不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。
>
> 重新排列：`1->2->3->4->5` → `1->5->2->4->3`

**💡 核心思路**：

1. 找中点切分链表
2. 反转后半部分
3. 交替合并两部分

```java
public void reorderList(ListNode head) {
    if (head == null || head.next == null) return;
    
    // 1. 找中点
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 2. 切分并反转后半部分
    ListNode secondHalf = reverseList(slow.next);
    slow.next = null;
    
    // 3. 交替合并
    ListNode first = head;
    while (secondHalf != null) {
        ListNode temp1 = first.next;
        ListNode temp2 = secondHalf.next;
        
        first.next = secondHalf;
        secondHalf.next = temp1;
        
        first = temp1;
        secondHalf = temp2;
    }
}

private ListNode reverseList(ListNode head) {
    ListNode prev = null;
    while (head != null) {
        ListNode next = head.next;
        head.next = prev;
        prev = head;
        head = next;
    }
    return prev;
}
```

### [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/) 

**🎯 考察频率：中等 | 难度：中等 | 重要性：指针操作**

> 两两交换相邻节点：`1->2->3->4` → `2->1->4->3`

**💡 核心思路**：三指针操作

- 使用虚拟头节点简化边界处理
- 每次处理一对节点的交换

**🔑 记忆技巧**：

- **口诀**："两两交换用三指，前中后来做舞蹈"

```java
public ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;

    while (prev.next != null && prev.next.next != null) {
        ListNode first = prev.next;
        ListNode second = prev.next.next;

        // 交换节点
        first.next = second.next;
        second.next = first;
        prev.next = second;

        // 移动指针
        prev = first;
    }

    return dummy.next;
}
```

---



## 三、相交与合并类🔗 

### 💡 核心思想

- **双指针遍历**：两个链表同时遍历，路径互换
- **归并思想**：有序链表的合并策略
- **分治算法**：多个链表的合并优化

### [160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/) 

**🎯 考察频率：高 | 难度：简单 | 重要性：双指针经典**

> 找两个链表的相交节点
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

**💡 核心思路**：路径互换双指针法

- 两个指针分别从两个链表头开始遍历
- 到达尾部时，跳转到另一个链表的头部
- 相遇点就是交点（如果有的话）

**🔑 记忆技巧**：

- **口诀**："你走我的路，我走你的路，相遇便是交点处"
- **诗意版本**："走到尽头见不到你，于是走过你来时的路"
- **数学原理**：两指针走过的总路径长度相等

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

**⏱️ 复杂度分析**：

- **时间复杂度**：O(m+n) - 最多遍历两个链表各一次
- **空间复杂度**：O(1) - 只使用了两个指针



### [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/) 

**🎯 考察频率：极高 | 难度：简单 | 重要性：合并算法基础**

> 合并两个升序链表：`1->2->4` + `1->3->4` = `1->1->2->3->4->4`

**💡 核心思路**：比较头节点，选小的

- 递归版本：选小的节点，剩下的交给递归处理

  ![](https://pic.leetcode-cn.com/fe5eca7edea29a76316f7e8529f73a90ae4990fd66fea093c6ee91567788e482-%E5%B9%BB%E7%81%AF%E7%89%874.JPG)

- 迭代版本：用哨兵节点，逐个比较拼接

**🔑 记忆技巧**：

- **口诀**："小的先走大的等，递归合并最轻松"
- **形象记忆**：两队人排队，总是让矮的人先走

```java
// 递归版本
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if (l1 == null) return l2;
    if (l2 == null) return l1;
    
    if (l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
}

// 迭代版本
public ListNode mergeTwoLists(ListNode l1, ListNode l2){
    ListNode dummy = new ListNode(0); // 创建哨兵节点
    ListNode cur = dummy; // 当前指针，指向哨兵节点
    while(l1 != null && l2 != null){
        if(l1.val < l2.val){
            cur.next = l1; // 将较小节点接到当前指针后面
            l1 = l1.next; // 移动l1指针
        }else{
            cur.next = l2;
            l2 = l2.next;
        }
        cur = cur.next;  // 移动当前指针
    }
    cur.next = l1 != null ? l1 : l2; // 拼接剩余部分
    return dummy.next; // 返回合并后的链表头节点

}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：递归版O(m+n)，迭代版O(m+n) - m和n分别为两个链表的长度
- **空间复杂度**：递归版O(m+n)，迭代版O(1) - 递归版需要栈空间



### [23. 合并K个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/) 

**🎯 考察频率：极高 | 难度：困难 | 重要性：分治算法经典**

> 合并K个有序链表：`[[1,4,5],[1,3,4],[2,6]]` → `[1,1,2,3,4,4,5,6]`

**💡 核心思路**：优先队列（最小堆）

- 将所有链表的头节点放入最小堆
- 每次取出最小值，将其next节点放入堆
- 重复直到堆为空

**🔑 记忆技巧**：

- **口诀**："K链合并用小堆，最小优先逐个取"
- **形象记忆**：多路归并，就像多条河流汇入大海

```java
public ListNode mergeKLists(ListNode[] lists) {
    if (lists == null || lists.length == 0) return null;
    
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
    
    // 将所有链表的头节点加入堆
    for (ListNode head : lists) {
        if (head != null) {
            pq.offer(head);
        }
    }
    
    ListNode dummy = new ListNode(0);
    ListNode curr = dummy;
    
    //当前最小堆不为空，继续合并
    while (!pq.isEmpty()) {
        ListNode node = pq.poll();  //从最小堆中取出最小节点
        curr.next = node;           //将取出的链表加到合并后的链表中
        curr = curr.next;						//移动指针
        
        //如果取出的节点有下一个节点，将其加入到最小堆中
        if (node.next != null) {
            pq.offer(node.next);
        }
    }
    
    return dummy.next;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(N×log k) - N是所有节点总数，k是链表个数，堆操作log k
- **空间复杂度**：O(k) - 优先队列最多存储k个节点

---



## 四、删除与去重类 🗑️ 

### 💡 核心思想

- **哨兵节点**：简化头节点的删除操作
- **双指针**：一个用于遍历，一个用于连接
- **递归删除**：自然的递归结构

### 🎯 必掌握模板

```java
// 删除节点模板
ListNode dummy = new ListNode(0);
dummy.next = head;
ListNode prev = dummy, curr = head;

while (curr != null) {
    if (shouldDelete(curr)) {
        prev.next = curr.next; // 删除curr
    } else {
        prev = curr; // prev前进
    }
    curr = curr.next; // curr前进
}
return dummy.next;
```

### [203. 移除链表元素](https://leetcode.cn/problems/remove-linked-list-elements/)

**🎯 考察频率：中等 | 难度：简单 | 重要性：删除基础**

> 删除所有值等于val的节点：`1->2->6->3->4->5->6`, val=6 → `1->2->3->4->5`

**🔑 记忆技巧**：

- **口诀**："哨兵开路双指针，遇到目标就跳过"

```java
public ListNode removeElements(ListNode head, int val) {
  // 创建一个哑节点作为链表的前驱，避免处理头节点的特殊情况
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    // 初始化两个指针，pre指向哑节点，cur指向头节点
    ListNode pre = dummy;
    ListNode cur = head;

    // 遍历链表
    while (cur != null) {
        // 如果当前节点的值等于val，则删除该节点
        if (cur.val == val) {
            pre.next = cur.next; // 跳过当前节点，连接pre和cur的下一个节点
        } else {
            // 如果当前节点的值不等于val，则移动pre指针到当前节点
            pre = cur;
        }
        // 移动cur指针到下一个节点
        cur = cur.next;
    }

    // 返回更新后的头节点（可能是哑节点的下一个节点）
    return dummy.next;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历链表一次
- **空间复杂度**：O(1) - 只使用了常数个指针



### [83. 删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/) 

**🎯 考察频率：中等 | 难度：简单 | 重要性：去重基础**

> **问题1：保留一个重复元素**
> 输入：`1->1->2->3->3` → 输出：`1->2->3`

**💡 核心思路**：单指针遍历法

- 遍历链表，比较当前节点与下一个节点的值
- 如果相等，跳过下一个节点（`curr.next = curr.next.next`）
- 如果不等，移动到下一个节点

**🔑 记忆技巧**：

- **口诀**："相邻比较去重复，保留一个删后续"
- **关键点**：只有当值不相等时，curr指针才前进

```java
public ListNode deleteDuplicates(ListNode head) {
    if (head == null) return head;
    
    ListNode curr = head;
    while (curr != null && curr.next != null) {
        if (curr.val == curr.next.val) {
            // 跳过重复节点，curr不前进
            curr.next = curr.next.next;
        } else {
            // 值不相等，curr前进
            curr = curr.next;
        }
    }
    return head;
}
```

**🔍 详细步骤示例**：

```
原链表：1->1->2->3->3->null
步骤1：curr=1, next=1 (相等) → 跳过 → 1->2->3->3->null
步骤2：curr=1, next=2 (不等) → curr前进 → curr=2
步骤3：curr=2, next=3 (不等) → curr前进 → curr=3
步骤4：curr=3, next=3 (相等) → 跳过 → 1->2->3->null
结果：1->2->3->null
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历链表一次
- **空间复杂度**：O(1) - 只使用了常数个指针

### [82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/) 

**🎯 考察频率：高 | 难度：中等 | 重要性：完全去重**

> **问题2：删除所有重复元素**
> 输入：`1->2->3->3->4->4->5` → 输出：`1->2->5`

**💡 核心思路**：虚拟头节点 + 双指针法

- 使用虚拟头节点处理头节点可能被删除的情况
- prev指针：指向最后一个确定保留的节点
- curr指针：用于遍历和检测重复

**🔑 记忆技巧**：

- **口诀**："发现重复全跳过，哨兵记住前驱位"
- **关键点**：只有当前节点不重复时，prev指针才前进

```java
public ListNode deleteDuplicates(ListNode head) {
   // 处理空链表情况
  if(head == null){
      return null;
  }

  ListNode dummy = new ListNode(0);
  dummy.next = head;

  // pre指向当前确定不重复的最后一个节点，cur用于遍历
  ListNode pre = dummy, cur = head;

  while(cur != null && cur.next != null){
      // 发现重复节点
      if(cur.val == cur.next.val){
          // 跳过所有重复节点（至少有两个相同值节点）
          while(cur.next != null && cur.val == cur.next.val){
              cur = cur.next;
          }
          // 删除重复节点（pre.next直接指向重复节点后的第一个不同节点）
          pre.next = cur.next;
          // 移动cur到下一个待检查节点
          cur = cur.next;
      }else{
          // 当前节点不重复，正常移动pre和cur指针
          pre = cur;
          cur = cur.next;
      }
   }
 return dummy.next;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历链表一次
- **空间复杂度**：O(1) - 只使用了常数个指针

**⚡ 两题对比总结**：

| 题目 | 处理方式     | 关键区别                 | 返回值         |
| ---- | ------------ | ------------------------ | -------------- |
| LC83 | 保留一个重复 | curr指针控制，不需虚拟头 | 直接返回head   |
| LC82 | 删除所有重复 | prev指针控制，需要虚拟头 | 返回dummy.next |

**🎯 面试常考变体**：

1. **无序链表去重**：需要先排序或使用HashSet
2. **保留最后一个重复元素**：类似LC83，但从后往前处理
3. **统计重复元素个数**：在删除过程中计数
4. **删除指定值的所有节点**：类似LC203

**💡 解题心得**：

- **LC83核心**：遇到重复就跳过，curr只在不重复时前进
- **LC82核心**：遇到重复就全删，prev只在确认安全时前进
- **记忆方法**：83保留(Keep one)，82全删(Remove all)
- **调试技巧**：画图模拟指针移动过程，特别注意边界情况

---



## 五、数学运算类 🧮 

### 💡 核心思想

- **进位处理**：模拟手工计算的进位过程
- **链表表示数字**：低位在前，高位在后
- **边界处理**：不同长度链表的处理

### [2. 两数相加](https://leetcode-cn.com/problems/add-two-numbers/) 

**🎯 考察频率：极高 | 难度：中等 | 重要性：数学计算经典**

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

**💡 核心思路**：模拟手算加法

- 同时遍历两个链表，逐位相加
- 处理进位carry，满10进1
- 注意最后可能还有进位

**🔑 记忆技巧**：

- **口诀**："逐位相加记进位，链表模拟手算法"
- **形象记忆**：小学数学竖式加法，从右到左逐位计算


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



### [445. 两数相加 II](https://leetcode.cn/problems/add-two-numbers-ii/) 

**🎯 考察频率：中等 | 难度：中等 | 重要性：逆序处理**

> 高位在前的链表相加：`(7->2->4->3) + (5->6->4)` 表示 `7243 + 564 = 7807` → `7->8->0->7`

**💡 核心思路**：

1. 使用栈存储数字
2. 从栈顶开始计算（相当于从低位开始）
3. 头插法构建结果链表

```java
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    Stack<Integer> stack1 = new Stack<>();
    Stack<Integer> stack2 = new Stack<>();
    
    // 将链表值压入栈中
    while (l1 != null) {
        stack1.push(l1.val);
        l1 = l1.next;
    }
    while (l2 != null) {
        stack2.push(l2.val);
        l2 = l2.next;
    }
    
    ListNode result = null;
    int carry = 0;
    
    while (!stack1.isEmpty() || !stack2.isEmpty() || carry > 0) {
        int x = stack1.isEmpty() ? 0 : stack1.pop();
        int y = stack2.isEmpty() ? 0 : stack2.pop();
        
        int sum = x + y + carry;
        carry = sum / 10;
        
        // 头插法
        ListNode newNode = new ListNode(sum % 10);
        newNode.next = result;
        result = newNode;
    }
    
    return result;
}
```

---



## 六、特殊结构类 🔍 

### 💡 核心思想

- **哈希表优化**：O(1)时间访问
- **双向链表**：支持前后遍历
- **设计数据结构**：LRU、LFU等缓存机制

### [146. LRU缓存](https://leetcode.cn/problems/lru-cache/) 

**🎯 考察频率：极高 | 难度：中等 | 重要性：系统设计经典**

> 实现LRU（最近最少使用）缓存机制

**💡 核心思路**：哈希表 + 双向链表

- 哈希表：O(1)查找节点
- 双向链表：O(1)插入删除，维护访问顺序
- 最新访问的放头部，最久未用的在尾部

**🔑 记忆技巧**：

- **口诀**："哈希定位双链调，头部最新尾最老"
- **形象记忆**：图书管理员，用卡片索引快速找书，用链表记录借阅顺序

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

**⏱️ 复杂度分析**：

- **时间复杂度**：get和put操作都是O(1) - 哈希表查找O(1)，双向链表插入删除O(1)
- **空间复杂度**：O(capacity) - 哈希表和双向链表存储最多capacity个节点

### [138. 复制带随机指针的链表](https://leetcode.cn/problems/copy-list-with-random-pointer/) 

**🎯 考察频率：极高 | 难度：中等 | 重要性：特殊结构经典**

> 深拷贝带有random指针的链表，每个节点有next和random两个指针

**💡 核心思路**：

- **方法一**：哈希表映射（空间O(n)）
- **方法二**：原地复制法（空间O(1)）

**🔑 记忆技巧**：

- **口诀**："哈希建表存映射，原地复制巧连接"
- **形象记忆**：复印文件，先建立对照表，再复制内容

```java
// 方法一：哈希表法（推荐，思路清晰）
public Node copyRandomList(Node head) {
    if (head == null) return null;
    
    Map<Node, Node> map = new HashMap<>();
    Node curr = head;
    
    // 第一遍：创建所有新节点，建立映射关系
    while (curr != null) {
        map.put(curr, new Node(curr.val));
        curr = curr.next;
    }
    
    // 第二遍：设置next和random指针
    curr = head;
    while (curr != null) {
        Node newNode = map.get(curr);
        newNode.next = map.get(curr.next);
        newNode.random = map.get(curr.random);
        curr = curr.next;
    }
    
    return map.get(head);
}

// 方法二：原地复制法（空间优化）
public Node copyRandomList(Node head) {
    if (head == null) return null;
    
    // 第一步：复制节点，A->A'->B->B'->C->C'
    Node curr = head;
    while (curr != null) {
        Node copy = new Node(curr.val);
        copy.next = curr.next;
        curr.next = copy;
        curr = copy.next;
    }
    
    // 第二步：设置random指针
    curr = head;
    while (curr != null) {
        if (curr.random != null) {
            curr.next.random = curr.random.next;
        }
        curr = curr.next.next;
    }
    
    // 第三步：分离两个链表
    Node dummy = new Node(0);
    Node copyPrev = dummy;
    curr = head;
    
    while (curr != null) {
        Node copy = curr.next;
        curr.next = copy.next;
        copyPrev.next = copy;
        copyPrev = copy;
        curr = curr.next;
    }
    
    return dummy.next;
}
```

**🔍 解法对比**：

| 方法       | 时间复杂度 | 空间复杂度 | 优缺点             |
| ---------- | ---------- | ---------- | ------------------ |
| 哈希表法   | O(n)       | O(n)       | 思路清晰，易理解   |
| 原地复制法 | O(n)       | O(1)       | 空间优化，但较复杂 |



### [234. 回文链表](https://leetcode.cn/problems/palindrome-linked-list/) 

**🎯 考察频率：高 | 难度：简单 | 重要性：综合应用**

> 判断链表是否为回文：`1->2->2->1` → true

**💡 核心思路**：三步走策略

1. 快慢指针找中点，切分链表
2. 反转后半部分链表
3. 双指针同时比较前后两部分

> 使用栈：遍历链表，将节点值依次压入栈中，然后再遍历链表，将节点值与栈顶元素进行比较，如果都相等，则是回文链表。
>
> 使用额外数组：遍历链表，将节点值存入一个数组中，然后双指针检查数组是否为回文数组。

**🔑 记忆技巧**：

- **口诀**："中点切分反转后，双指同比判回文"
- **形象记忆**：对折纸条，看两面是否完全重合

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

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历链表两次，一次存储值，一次比较
- **空间复杂度**：O(n) - 使用额外数组存储所有节点值

---



## 七、综合应用类 🎯 

### 💡 核心思想

- **分治递归**：大问题分解成小问题
- **多技巧结合**：快慢指针+反转+合并等
- **优化策略**：时间空间复杂度的权衡

### [148. 排序链表](https://leetcode.cn/problems/sort-list/) 

**🎯 考察频率：高 | 难度：中等 | 重要性：归并排序应用**

> 在O(n log n)时间和常数空间内排序链表：`4->2->1->3` → `1->2->3->4`

**💡 核心思路**：归并排序

1. 找中点切分链表（快慢指针）
2. 递归排序左右两部分
3. 合并两个有序链表

**🔑 记忆技巧**：

- **口诀**："找中点，递归排，合并完"
- **形象记忆**：分治策略，先分后治，各个击破

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

**🎯 考察频率：中等 | 难度：中等 | 重要性：双链表技巧**

> 按值x分隔链表：`1->4->3->2->5->2`, x=3 → `1->2->2->4->3->5`

**💡 核心思路**：双链表分离

1. 创建两个虚拟头节点
2. 遍历原链表，按条件分配到两个链表
3. 连接两个链表

**🔑 记忆技巧**：

- **口诀**："双链分离按条件，小大分开再拼接"
- **形象记忆**：分拣包裹，小的一堆，大的一堆，最后拼接

```java
public ListNode partition(ListNode head, int x) {
    ListNode beforeHead = new ListNode(0);
    ListNode before = beforeHead;
    ListNode afterHead = new ListNode(0);
    ListNode after = afterHead;
    
    while (head != null) {
        if (head.val < x) {
            before.next = head;
            before = before.next;
    } else {
            after.next = head;
            after = after.next;
        }
        head = head.next;
    }
    
    after.next = null; // 避免环
    before.next = afterHead.next;
    
    return beforeHead.next;
}
```

### [328. 奇偶链表](https://leetcode.cn/problems/odd-even-linked-list/) 

**🎯 考察频率：中等 | 难度：中等 | 重要性：指针操作**

> 奇偶位置重排：`1->2->3->4->5` → `1->3->5->2->4`

**💡 核心思路**：

1. 分离奇偶位置节点
2. 连接奇数链表和偶数链表

```java
public ListNode oddEvenList(ListNode head) {
    if (head == null || head.next == null) return head;
    
    ListNode odd = head;
    ListNode even = head.next;
    ListNode evenHead = even;
    
    while (even != null && even.next != null) {
        odd.next = even.next;
        odd = odd.next;
        even.next = odd.next;
        even = even.next;
    }
    
    odd.next = evenHead;
    return head;
}
```

### [725. 分隔链表](https://leetcode.cn/problems/split-linked-list-in-parts/) 

**🎯 考察频率：低 | 难度：中等 | 重要性：数学计算**

> 将链表分隔成k部分，尽可能平均

**💡 核心思路**：

1. 计算链表长度
2. 计算每部分的长度
3. 按计算结果切分

```java
public ListNode[] splitListToParts(ListNode root, int k) {
    // 计算长度
    int len = 0;
    ListNode curr = root;
    while (curr != null) {
        len++;
        curr = curr.next;
    }
    
    int partSize = len / k; // 每部分基本长度
    int remainder = len % k; // 前remainder部分需要+1
    
    ListNode[] result = new ListNode[k];
    curr = root;
    
    for (int i = 0; i < k; i++) {
        result[i] = curr;
        
        // 当前部分的长度
        int currentPartSize = partSize + (i < remainder ? 1 : 0);
        
        // 移动到当前部分的末尾
        for (int j = 0; j < currentPartSize - 1 && curr != null; j++) {
            curr = curr.next;
        }
        
        // 切断连接
        if (curr != null) {
            ListNode next = curr.next;
            curr.next = null;
            curr = next;
        }
    }
    
    return result;
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







### [109. 有序链表转换二叉搜索树](https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree/) 

**🎯 考察频率：中等 | 难度：中等 | 重要性：链表与树的结合**

> 将有序链表转换为平衡二叉搜索树

**💡 核心思路**：

1. 快慢指针找中点作为根节点
2. 递归构建左右子树
3. 或者先转数组再构建

```java
public TreeNode sortedListToBST(ListNode head) {
    if (head == null) return null;
    if (head.next == null) return new TreeNode(head.val);
    
    // 找中点的前一个节点
    ListNode slow = head, fast = head, prev = null;
    while (fast != null && fast.next != null) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 断开左半部分
    prev.next = null;
    
    TreeNode root = new TreeNode(slow.val);
    root.left = sortedListToBST(head);
    root.right = sortedListToBST(slow.next);
    
    return root;
}
```



---

## 八、进阶与变体类 🚀 

### 💡 核心思想

- **算法变体**：经典题目的变形和扩展
- **边界优化**：特殊情况的处理
- **复合应用**：多种技巧的综合运用

### [430. 扁平化多级双向链表](https://leetcode.cn/problems/flatten-a-multilevel-doubly-linked-list/)

**🎯 考察频率：低 | 难度：中等 | 重要性：递归应用**

> 扁平化带有子链表的双向链表

**💡 核心思路**：DFS深度优先

1. 遇到有child的节点时，先处理child分支
2. 用栈保存当前节点的next
3. 递归处理完child后，连接栈中保存的next

```java
public Node flatten(Node head) {
    if (head == null) return head;
    
    Stack<Node> stack = new Stack<>();
    Node curr = head;
    
    while (curr != null) {
        if (curr.child != null) {
            // 如果有next节点，先保存到栈中
            if (curr.next != null) {
                stack.push(curr.next);
            }
            
            // 连接child
            curr.next = curr.child;
            curr.child.prev = curr;
            curr.child = null;
        }
        
        // 如果当前节点没有next，但栈不为空
        if (curr.next == null && !stack.isEmpty()) {
            Node next = stack.pop();
            curr.next = next;
            next.prev = curr;
        }
        
        curr = curr.next;
    }
    
    return head;
}
```



### [1669. 合并两个链表](https://leetcode.cn/problems/merge-in-between-linked-lists/) 

**🎯 考察频率：低 | 难度：中等 | 重要性：指针操作**

> 将list2插入到list1的第a到第b个节点之间

**💡 核心思路**：

1. 找到第a-1个和第b+1个节点
2. 连接三段：前段+list2+后段

```java
public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {
    // 找到第a-1个节点
    ListNode prevA = list1;
    for (int i = 0; i < a - 1; i++) {
        prevA = prevA.next;
    }
    
    // 找到第b+1个节点
    ListNode afterB = prevA;
    for (int i = 0; i < b - a + 2; i++) {
        afterB = afterB.next;
    }
    
    // 连接
    prevA.next = list2;
    
    // 找到list2的尾节点
    while (list2.next != null) {
        list2 = list2.next;
    }
    list2.next = afterB;
    
    return list1;
}
```

---

## 九、进阶操作类

---

## 🚀 面试前15分钟速记表

### 核心模板（必背）

```java
// 1. 哨兵节点模板
ListNode dummy = new ListNode(0);
dummy.next = head;

// 2. 快慢指针模板
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}

// 3. 反转链表模板
ListNode prev = null, curr = head;
while (curr != null) {
    ListNode next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
}
```

### 题型速查表

| 题型分类     | 核心技巧        | 高频题目                                                    | 记忆口诀                         | 难度  |
| ------------ | --------------- | ----------------------------------------------------------- | -------------------------------- | ----- |
| **双指针类** | 快慢指针        | 环形链表、环形链表II、链表中间节点、删除倒数第N个、旋转链表 | 快二慢一找中点，有环必定会相遇   | ⭐⭐⭐   |
| **反转重排** | 三指针法        | 反转链表、反转链表II、K个一组翻转、重排链表、两两交换       | 断链之前存next，三指针来回倒腾   | ⭐⭐⭐⭐  |
| **相交合并** | 双路遍历        | 相交链表、合并两个有序链表、合并K个升序链表                 | 你走我的路，我走你的路           | ⭐⭐⭐   |
| **删除去重** | 哨兵节点        | 移除链表元素、删除重复元素、删除重复元素II                  | 哨兵开路找前驱，一指断链二连接   | ⭐⭐⭐   |
| **数学运算** | 进位处理        | 两数相加、两数相加II                                        | 逐位相加记进位，链表模拟手算法   | ⭐⭐⭐⭐  |
| **特殊结构** | 哈希表+特殊指针 | LRU缓存、复制带随机指针链表、回文链表                       | 哈希定位双链调，头部最新尾最老   | ⭐⭐⭐⭐⭐ |
| **综合应用** | 分治递归        | 排序链表、分隔链表、奇偶链表、分隔链表                      | 大化小来小化了，分而治之最高效   | ⭐⭐⭐⭐  |
| **进阶变体** | 复合技巧        | 扁平化多级双向链表、有序链表转BST、合并两个链表             | 多技巧组合显神通，复杂问题巧拆解 | ⭐⭐⭐⭐  |

### 按难度分级

- **⭐⭐⭐ 简单必会**：反转链表、环形链表、合并两个有序链表、删除重复元素、链表的中间结点
- **⭐⭐⭐⭐ 中等重点**：环形链表II、删除倒数第N个、反转链表II、相交链表、两数相加、复制带随机指针链表、回文链表
- **⭐⭐⭐⭐⭐ 困难经典**：K个一组翻转链表、合并K个升序链表、LRU缓存

### 核心题目优先级（面试前重点复习）

1. **反转链表** - 基础中的基础，必须熟练掌握
2. **环形链表** - 快慢指针入门，双指针经典
3. **合并两个有序链表** - 归并算法基础，递归思维
4. **两数相加** - 数学计算经典，进位处理
5. **删除链表的倒数第N个结点** - 双指针应用典型
6. **LRU缓存** - 系统设计经典，哈希表+双向链表
7. **复制带随机指针的链表** - 特殊结构经典，深拷贝
8. **合并K个升序链表** - 分治算法进阶，优先队列

### 常见陷阱提醒

- ⚠️ **空链表检查**：`if (head == null) return ...`
- ⚠️ **单节点处理**：`if (head.next == null) return ...`
- ⚠️ **快指针越界**：`while (fast != null && fast.next != null)`
- ⚠️ **哨兵节点**：处理头节点变化时必用
- ⚠️ **返回值**：注意返回`dummy.next`还是`head`

### 时间复杂度总结

- **遍历类**：O(n) - 一次遍历
- **快慢指针**：O(n) - 最多两次遍历  
- **双指针**：O(n) - 同时移动
- **递归**：O(n) - 栈空间O(n)
- **排序**：O(n log n) - 归并排序

### 面试答题套路

1. **理解题意**：确认输入输出，边界情况
2. **选择方法**：根据题型选择对应技巧
3. **画图分析**：手动模拟2-3个节点的情况
4. **编码实现**：套用模板，注意边界
5. **测试验证**：空链表、单节点、正常情况

**最后提醒**：链表题重在理解指针操作，多画图，多动手！



