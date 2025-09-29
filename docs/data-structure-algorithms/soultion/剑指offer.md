# 剑指Offer 热门题目汇总

> **导读**：剑指Offer是面试中的经典题目集合，涵盖了数据结构与算法的各个重要知识点。这些题目不仅考查基础知识，更注重解题思路和代码实现的优雅性。
>
> **关键词**：数组、字符串、链表、二叉树、栈队列、动态规划、搜索回溯

## 数组相关

### [剑指 Offer 03. 数组中重复的数字](https://leetcode-cn.com/problems/shu-zu-zhong-zhong-fu-de-shu-zi-lcof/)

**🎯 考察频率：高 | 难度：简单 | 重要性：数组基础**

> 找出数组中重复的数字。在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。
>
> ```
> 输入：[2, 3, 1, 0, 2, 5, 3]
> 输出：2 或 3 
> ```

**💡 核心思路**：利用数组索引，原地交换

由于数组中的数字都在0～n-1范围内，可以将每个数字放到对应的索引位置上。当发现某个位置上已经有正确的数字时，说明找到了重复数字。

```java
public int findRepeatNumber(int[] nums) {
    int i = 0;
    while (i < nums.length) {
        // 如果当前位置的数字等于索引，继续下一个
        if (nums[i] == i) {
            i++;
            continue;
        }
        // 如果nums[i]位置上已经有正确的数字，找到重复
        if (nums[nums[i]] == nums[i]) {
            return nums[i];
        }
        // 否则交换到正确位置
        int temp = nums[i];
        nums[i] = nums[temp];
        nums[temp] = temp;
    }
    return -1;
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

### [剑指 Offer 04. 二维数组中的查找](https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：二维数组经典**

> 在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。
>
> ```
> 现有矩阵 matrix 如下：
> [
>   [1,   4,  7, 11, 15],
>   [2,   5,  8, 12, 19],
>   [3,   6,  9, 16, 22],
>   [10, 13, 14, 17, 24],
>   [18, 21, 23, 26, 30]
> ]
> 给定 target = 5，返回 true。
> ```

**💡 核心思路**：从右上角开始搜索

利用矩阵的有序性质，从右上角开始：
- 如果当前元素等于target，找到答案
- 如果当前元素大于target，向左移动（排除当前列）
- 如果当前元素小于target，向下移动（排除当前行）

```java
public boolean findNumberIn2DArray(int[][] matrix, int target) {
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return false;
    }
    
    int rows = matrix.length;
    int cols = matrix[0].length;
    
    // 从右上角开始
    int row = 0;
    int col = cols - 1;
    
    while (row < rows && col >= 0) {
        if (matrix[row][col] == target) {
            return true;
        } else if (matrix[row][col] > target) {
            col--; // 当前数字大于target，排除当前列
        } else {
            row++; // 当前数字小于target，排除当前行
        }
    }
    
    return false;
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(m + n)
- 空间复杂度：O(1)

### [剑指 Offer 45. 把数组排成最小的数](https://leetcode-cn.com/problems/ba-shu-zu-pai-cheng-zui-xiao-de-shu-lcof/)

**🎯 考察频率：高 | 难度：中等 | 重要性：自定义排序**

> 输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。
>
> ```
> 输入: [10,2]
> 输出: "102"
> ```
>
> ```
> 输入: [3,30,34,5,9]
> 输出: "3033459"
> ```

**💡 核心思路**：自定义排序规则

关键在于定义比较规则：对于两个数字a和b，如果拼接后ab < ba，则a应该排在b前面。

```java
public String minNumber(int[] nums) {
    String[] strs = new String[nums.length];
    for (int i = 0; i < nums.length; i++) {
        strs[i] = String.valueOf(nums[i]);
    }
    
    // 自定义排序规则
    Arrays.sort(strs, (x, y) -> (x + y).compareTo(y + x));
    
    StringBuilder res = new StringBuilder();
    for (String s : strs) {
        res.append(s);
    }
    
    return res.toString();
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n log n)，排序的时间复杂度
- 空间复杂度：O(n)，存储字符串数组

## 字符串相关

### [剑指 Offer 05. 替换空格](https://leetcode-cn.com/problems/ti-huan-kong-ge-lcof/)

**🎯 考察频率：中等 | 难度：简单 | 重要性：字符串基础**

> 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
>
> ```
> 输入：s = "We are happy."
> 输出："We%20are%20happy."
> ```

**💡 核心思路**：StringBuilder或字符数组

```java
public String replaceSpace(String s) {
    StringBuilder result = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (c == ' ') {
            result.append("%20");
        } else {
            result.append(c);
        }
    }
    return result.toString();
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(n)

### [剑指 Offer 58. 左旋转字符串](https://leetcode-cn.com/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/)

**🎯 考察频率：中等 | 难度：简单 | 重要性：字符串操作**

> 字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。
>
> ```
> 输入: s = "abcdefg", k = 2
> 输出: "cdefgab"
> ```

**💡 核心思路**：字符串拼接

```java
public String reverseLeftWords(String s, int n) {
    return s.substring(n) + s.substring(0, n);
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(n)

## 链表相关

### [剑指 Offer 06. 从尾到头打印链表](https://leetcode-cn.com/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

**🎯 考察频率：高 | 难度：简单 | 重要性：链表遍历**

> 输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。
>
> ```
> 输入：head = [1,3,2]
> 输出：[2,3,1]
> ```

**💡 核心思路**：栈或递归

```java
// 方法1：使用栈
public int[] reversePrint(ListNode head) {
    Stack<Integer> stack = new Stack<>();
    ListNode cur = head;
    
    // 遍历链表，入栈
    while (cur != null) {
        stack.push(cur.val);
        cur = cur.next;
    }
    
    // 出栈到数组
    int[] result = new int[stack.size()];
    for (int i = 0; i < result.length; i++) {
        result[i] = stack.pop();
    }
    
    return result;
}

// 方法2：递归
List<Integer> tmp = new ArrayList<>();
public int[] reversePrint(ListNode head) {
    recur(head);
    int[] res = new int[tmp.size()];
    for (int i = 0; i < res.length; i++) {
        res[i] = tmp.get(i);
    }
    return res;
}

void recur(ListNode head) {
    if (head == null) return;
    recur(head.next);
    tmp.add(head.val);
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(n)

### [剑指 Offer 18. 删除链表的节点](https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

**🎯 考察频率：高 | 难度：简单 | 重要性：链表操作**

> 给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。
>
> ```
> 输入: head = [4,5,1,9], val = 5
> 输出: [4,1,9]
> ```

**💡 核心思路**：双指针，注意删除头节点的特殊情况

```java
public ListNode deleteNode(ListNode head, int val) {
    // 删除头节点
    if (head.val == val) return head.next;
    
    ListNode pre = head, cur = head.next;
    while (cur != null && cur.val != val) {
        pre = cur;
        cur = cur.next;
    }
    
    if (cur != null) {
        pre.next = cur.next;
    }
    
    return head;
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

### [剑指 Offer 22. 链表中倒数第k个节点](https://leetcode-cn.com/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：双指针经典**

> 输入一个链表，输出该链表中倒数第k个节点。
>
> ```
> 给定一个链表: 1->2->3->4->5, 和 k = 2.
> 返回链表 4->5.
> ```

**💡 核心思路**：双指针，快慢指针

快指针先走k步，然后快慢指针同时移动，当快指针到达末尾时，慢指针正好指向倒数第k个节点。

```java
public ListNode getKthFromEnd(ListNode head, int k) {
    ListNode former = head, latter = head;
    
    // 快指针先走k步
    for (int i = 0; i < k; i++) {
        former = former.next;
    }
    
    // 快慢指针同时移动
    while (former != null) {
        former = former.next;
        latter = latter.next;
    }
    
    return latter;
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

## 二叉树相关

### [剑指 Offer 07. 重建二叉树](https://leetcode-cn.com/problems/zhong-jian-er-cha-shu-lcof/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：树的构建**

> 输入某二叉树的前序遍历和中序遍历的结果，请重建该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。
>
> ```
> 前序遍历 preorder = [3,9,20,15,7]
> 中序遍历 inorder = [9,3,15,20,7]
> 
> 返回如下的二叉树：
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```

**💡 核心思路**：递归 + 哈希表优化

前序遍历的第一个节点是根节点，在中序遍历中找到这个根节点，就能确定左右子树。

```java
Map<Integer, Integer> indexMap;

public TreeNode buildTree(int[] preorder, int[] inorder) {
    int n = preorder.length;
    // 构造哈希映射快速定位根节点
    indexMap = new HashMap<>();
    for (int i = 0; i < n; i++) {
        indexMap.put(inorder[i], i);
    }
    return myBuildTree(preorder, inorder, 0, n - 1, 0, n - 1);
}

public TreeNode myBuildTree(int[] preorder, int[] inorder, 
                           int preorder_left, int preorder_right,
                           int inorder_left, int inorder_right) {
    if (preorder_left > preorder_right) {
        return null;
    }
    
    // 前序遍历中的第一个节点就是根节点
    int preorder_root = preorder_left;
    // 在中序遍历中定位根节点
    int inorder_root = indexMap.get(preorder[preorder_root]);
    
    // 先把根节点建立出来
    TreeNode root = new TreeNode(preorder[preorder_root]);
    // 得到左子树中的节点数目
    int size_left_subtree = inorder_root - inorder_left;
    
    // 递归地构造左子树，并连接到根节点
    root.left = myBuildTree(preorder, inorder, 
                           preorder_left + 1, 
                           preorder_left + size_left_subtree,
                           inorder_left, 
                           inorder_root - 1);
    
    // 递归地构造右子树，并连接到根节点
    root.right = myBuildTree(preorder, inorder, 
                            preorder_left + size_left_subtree + 1, 
                            preorder_right,
                            inorder_root + 1, 
                            inorder_right);
    
    return root;
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(n)

### [剑指 Offer 26. 树的子结构](https://leetcode-cn.com/problems/shu-de-zi-jie-gou-lcof/)

**🎯 考察频率：高 | 难度：中等 | 重要性：树的遍历**

> 输入两棵二叉树A和B，判断B是不是A的子结构。
>
> ```
> 给定的树 A:
>      3
>     / \
>    4   5
>   / \
>  1   2
> 
> 给定的树 B:
>    4 
>   /
>  1
> 
> 返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。
> ```

**💡 核心思路**：递归遍历 + 匹配判断

先在A中找到与B根节点相同的节点，然后判断以该节点为根的子树是否与B相同。

```java
public boolean isSubStructure(TreeNode A, TreeNode B) {
    return (A != null && B != null) && (recur(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B));
}

boolean recur(TreeNode A, TreeNode B) {
    if (B == null) return true;
    if (A == null || A.val != B.val) return false;
    return recur(A.left, B.left) && recur(A.right, B.right);
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(MN)，M、N分别为树A和树B的节点数量
- 空间复杂度：O(M)

### [剑指 Offer 32. 从上到下打印二叉树](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/)

**🎯 考察频率：高 | 难度：中等 | 重要性：BFS经典**

> 从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。
>
> ```
> 给定二叉树: [3,9,20,null,null,15,7],
>     3
>    / \
>   9  20
>     /  \
>    15   7
> 
> 返回：[3,9,20,15,7]
> ```

**💡 核心思路**：广度优先遍历（BFS）

使用队列实现BFS，逐层遍历二叉树。

```java
public int[] levelOrder(TreeNode root) {
    if (root == null) return new int[0];
    
    Queue<TreeNode> queue = new LinkedList<>();
    ArrayList<Integer> ans = new ArrayList<>();
    
    queue.add(root);
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        ans.add(node.val);
        if (node.left != null) queue.add(node.left);
        if (node.right != null) queue.add(node.right);
    }
    
    int[] res = new int[ans.size()];
    for (int i = 0; i < ans.size(); i++) {
        res[i] = ans.get(i);
    }
    
    return res;
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(n)

## 栈和队列

### [剑指 Offer 09. 用两个栈实现队列](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：数据结构设计**

> 用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。
>
> ```
> 输入：
> ["CQueue","appendTail","deleteHead","deleteHead"]
> [[],[3],[],[]]
> 输出：[null,null,3,-1]
> ```

**💡 核心思路**：双栈模拟

一个栈用于入队，一个栈用于出队。当出队栈为空时，将入队栈的所有元素倒入出队栈。

```java
class CQueue {
    Stack<Integer> stack1;
    Stack<Integer> stack2;
    
    public CQueue() {
        stack1 = new Stack<Integer>();
        stack2 = new Stack<Integer>();
    }
    
    public void appendTail(int value) {
        stack1.push(value);
    }
    
    public int deleteHead() {
        if (!stack2.isEmpty()) {
            return stack2.pop();
        }
        
        if (stack1.isEmpty()) {
            return -1;
        }
        
        // 将stack1中的元素倒入stack2
        while (!stack1.isEmpty()) {
            stack2.push(stack1.pop());
        }
        
        return stack2.pop();
    }
}
```

**🔍 复杂度分析**：
- 时间复杂度：appendTail 为 O(1)，deleteHead 的平均复杂度为 O(1)
- 空间复杂度：O(n)

### [剑指 Offer 30. 包含min函数的栈](https://leetcode-cn.com/problems/bao-han-minhan-shu-de-zhan-lcof/)

**🎯 考察频率：高 | 难度：简单 | 重要性：数据结构设计**

> 定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。
>
> ```
> MinStack minStack = new MinStack();
> minStack.push(-2);
> minStack.push(0);
> minStack.push(-3);
> minStack.min();   --> 返回 -3.
> minStack.pop();
> minStack.top();      --> 返回 0.
> minStack.min();   --> 返回 -2.
> ```

**💡 核心思路**：辅助栈保存最小值

使用一个辅助栈来保存当前栈中的最小值。

```java
class MinStack {
    Stack<Integer> A, B;
    
    public MinStack() {
        A = new Stack<>();
        B = new Stack<>();
    }
    
    public void push(int x) {
        A.add(x);
        if (B.empty() || B.peek() >= x) {
            B.add(x);
        }
    }
    
    public void pop() {
        if (A.pop().equals(B.peek())) {
            B.pop();
        }
    }
    
    public int top() {
        return A.peek();
    }
    
    public int min() {
        return B.peek();
    }
}
```

**🔍 复杂度分析**：
- 时间复杂度：所有操作都是 O(1)
- 空间复杂度：O(n)

## 动态规划

#### [剑指 Offer 10. 斐波那契数列](https://leetcode-cn.com/problems/fei-bo-na-qi-shu-lie-lcof/)

> 写一个函数，输入 n ，求斐波那契数列的第 n 项。
>
> ```
> 输入：n = 2
> 输出：1
> 
> 输入：n = 5
> 输出：5
> ```

#### [剑指 Offer 42. 连续子数组的最大和](https://leetcode-cn.com/problems/lian-xu-zi-shu-zu-de-zui-da-he-lcof/)

> 输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。
>
> ```
> 输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
> 输出: 6
> 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
> ```

#### [剑指 Offer 47. 礼物的最大价值](https://leetcode-cn.com/problems/li-wu-de-zui-da-jie-zhi-lcof/)

> 在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？
>
> ```
> 输入: 
> [
>   [1,3,1],
>   [1,5,1],
>   [4,2,1]
> ]
> 输出: 12
> 解释: 路径 1→3→5→2→1 可以拿到最多价值的礼物
> ```

## 搜索与回溯

#### [剑指 Offer 12. 矩阵中的路径](https://leetcode-cn.com/problems/ju-zhen-zhong-de-lu-jing-lcof/)

> 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
>
> ```
> board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
> 输出：true
> ```

#### [剑指 Offer 13. 机器人的运动范围](https://leetcode-cn.com/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof/)

> 地上有一个m行n列的方格，从坐标 [0,0] 到坐标 [m-1,n-1] 。一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于k的格子。
>
> ```
> 输入：m = 2, n = 3, k = 1
> 输出：3
> ```

## 数学相关

### [剑指 Offer 14. 剪绳子](https://leetcode-cn.com/problems/jian-sheng-zi-lcof/)

**🎯 考察频率：高 | 难度：中等 | 重要性：数学推理**

> 给你一根长度为 n 的绳子，请把绳子剪成整数长度的 m 段（m、n都是整数，n>1并且m>1），每段绳子的长度记为 k[0],k[1]...k[m-1] 。请问 k[0]*k[1]*...*k[m-1] 可能的最大乘积是多少？
>
> ```
> 输入: 2
> 输出: 1
> 解释: 2 = 1 + 1, 1 × 1 = 1
> 
> 输入: 10
> 输出: 36
> 解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36
> ```

**💡 核心思路**：数学规律 + 贪心

数学推导：尽可能多地剪出长度为3的绳子段，当剩余长度为4时剪成两段2。

```java
public int cuttingRope(int n) {
    if (n <= 3) return n - 1;
    
    int a = n / 3, b = n % 3;
    
    if (b == 0) {
        return (int) Math.pow(3, a);
    } else if (b == 1) {
        return (int) Math.pow(3, a - 1) * 4;
    } else {
        return (int) Math.pow(3, a) * 2;
    }
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(1)
- 空间复杂度：O(1)

### [剑指 Offer 39. 数组中出现次数超过一半的数字](https://leetcode-cn.com/problems/shu-zu-zhong-chu-xian-ci-shu-chao-guo-yi-ban-de-shu-zi-lcof/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：摩尔投票算法**

> 数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。
>
> ```
> 输入: [1, 2, 3, 2, 2, 2, 5, 4, 2]
> 输出: 2
> ```

**💡 核心思路**：摩尔投票算法

摩尔投票算法：维持一个候选人和计数器，遇到相同的数字计数+1，不同的-1，计数为0时更换候选人。

```java
public int majorityElement(int[] nums) {
    int x = 0, votes = 0;
    
    for (int num : nums) {
        if (votes == 0) x = num;
        votes += num == x ? 1 : -1;
    }
    
    return x;
}
```

**🔍 复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

### [剑指 Offer 62. 圆圈中最后剩下的数字](https://leetcode-cn.com/problems/yuan-quan-zhong-zui-hou-sheng-xia-de-shu-zi-lcof/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：约瑟夫环经典问题**

> 0,1,···,n-1这n个数字排成一个圆圈，从数字0开始，每次从这个圆圈里删除第m个数字（删除后从下一个数字开始计数）。求出这个圆圈里剩下的最后一个数字。
>
> ```
> 输入: n = 5, m = 3
> 输出: 3
> 解释: 0,1,2,3,4围成一个圆圈，每次删除第3个数字：
> 删除2：0,1,3,4
> 删除0：1,3,4  
> 删除4：1,3
> 删除1：3
> ```

**💡 核心思路**：约瑟夫环数学解法

这是经典的约瑟夫环问题。通过数学推导可以得出递推公式：
- f(n,m) = (f(n-1,m) + m) % n
- 边界条件：f(1,m) = 0

```java
public int lastRemaining(int n, int m) {
    int pos = 0; // 最终留下那个人的初始位置
    for (int i = 2; i <= n; i++) {
        pos = (pos + m) % i;  // 每次重新计算位置
    }
    return pos;
}
```

**递归解法（更直观理解）**：
```java
/**
 * 约瑟夫问题的递归解。
 * 定义 f(i, m) 表示 “i 个人、步长为 m” 时，幸存者在当前圈中的 **相对编号**。
 * 初始问题规模是 n，最终要的答案就是 f(n, m)。
 */
private int f(int n, int m) {
    if (n == 1) {            // 边界：只剩 1 人，他当然在自己圈里排 0 号
        return 0;
    }
    // 先算 “i-1 个人” 的子问题幸存者编号
    int x = f(n - 1, m);     // x 是 “n-1 圈” 里的幸存位置
    // 把子问题的答案映射到 “n 个人” 的圈上：
    // 上一轮出局的是 (m-1)%n 位置，整个圈从那里断开并重新编号，
    // 所以新编号 = (旧编号 + m) % n
    return (m + x) % n;      // 映射回当前圈，得到真正的幸存位置
}
```

**模拟法（使用 `ArrayList`）**

```java
public static int lastRemaining(int n, int k) {
    if (n <= 0 || k <= 0) {
        throw new IllegalArgumentException("n and k must be positive integers.");
    }

    List<Integer> people = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        people.add(i);
    }

    int currentIndex = 0; // 从第一个人(索引0)开始计数

    while (people.size() > 1) {
        // 计算要淘汰的人的索引
        // (currentIndex + k - 1) % people.size()
        int eliminateIndex = (currentIndex + k - 1) % people.size();

        // 移除被淘汰的人
        people.remove(eliminateIndex);

        // 更新下一次计数的起始索引，就是被淘汰者的下一个位置
        currentIndex = eliminateIndex % people.size(); // 当删除最后一个元素时，取模确保索引正确
    }

    return people.get(0);
}
```

**🔍 复杂度分析**：

- 时间复杂度：O(n)
- 空间复杂度：O(1) 迭代解法，O(n) 递归解法

---

## 📝 总结

剑指Offer题目涵盖了算法和数据结构的各个重要知识点，是面试准备的经典题集。通过精通这些题目，可以显著提升编程能力和算法思维。

### 🎆 核心技巧总结：

1. **数组操作**：双指针、原地交换、自定义排序
2. **链表技巧**：快慢指针、虚拟头节点、递归与迭代
3. **树的遍历**：前中后序递归、层序遍历、树的构建
4. **栈队列**：双栈模拟、辅助栈的设计模式
5. **动态规划**：状态定义、转移方程、空间优化
6. **搜索回溯**：DFS模板、状态恢复、剪枝优化
7. **数学问题**：数学规律发现、特殊算法（如摩尔投票）

掌握这些核心技巧，就能应对大部分的算法面试题目！