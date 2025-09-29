---
title: 二叉树通关秘籍：LeetCode 热题 100 全解析
date: 2025-01-08
tags: 
 - Binary Tree
categories: leetcode
---

![](https://img.starfish.ink/leetcode/leetcode-banner.png)

> 二叉树作为数据结构中的常青树，在算法面试中出现的频率居高不下。
>
> 有人说刷题要先刷二叉树，培养思维。目前还没培养出来，感觉分类刷都差不多。
>
> 我把二叉树相关题目进行了下分类。
>
> 当然，在做二叉树题目时候，第一想到的应该是用 **递归** 来解决。

### 📋 分类索引

1. **🌳 遍历基础类**：[二叉树的前序遍历](#_144-二叉树的前序遍历)、[二叉树的中序遍历](#_94-二叉树的中序遍历)、[二叉树的后序遍历](#_145-二叉树的后序遍历)、[二叉树的层序遍历](#_102-二叉树的层序遍历)、[锯齿形层序遍历](#_103-二叉树的锯齿形层序遍历)、[完全二叉树的节点个数](#_222-完全二叉树的节点个数)、[在每个树行中找最大值](#_515-在每个树行中找最大值)、[二叉树最大宽度](#_662-二叉树最大宽度)

2. **🔍 查找路径类**：[二叉树的最大深度](#_104-二叉树的最大深度)、[二叉树的最小深度](#_111-二叉树的最小深度)、[路径总和](#_112-路径总和)、[路径总和II](#_113-路径总和-ii)、[二叉树的右视图](#_199-二叉树的右视图)、[路径总和III](#_437-路径总和-iii)、[二叉树的最近公共祖先](#_236-二叉树的最近公共祖先)、[二叉树中的最大路径和](#_124-二叉树中的最大路径和)

3. **🏗️ 构造变换类**：[从前序与中序遍历序列构造二叉树](#_105-从前序与中序遍历序列构造二叉树)、[翻转二叉树](#_226-翻转二叉树)、[对称二叉树](#_101-对称二叉树)、[相同的树](#_100-相同的树)

4. **⚖️ 平衡验证类**：[平衡二叉树](#_110-平衡二叉树)、[验证二叉搜索树](#_98-验证二叉搜索树)、[二叉搜索树中第K小的元素](#_230-二叉搜索树中第K小的元素)

5. **🎯 搜索树操作类**：[二叉搜索树的最近公共祖先](#_235-二叉搜索树的最近公共祖先)、[删除二叉搜索树中的节点](#_450-删除二叉搜索树中的节点)、[将有序数组转换为二叉搜索树](#_108-将有序数组转换为二叉搜索树)

6. **📊 树形DP类**：[打家劫舍III](#_337-打家劫舍-iii)、[二叉树的直径](#_543-二叉树的直径)、[另一棵树的子树](#_572-另一棵树的子树)

7. **🔄 序列化类**：[二叉树的序列化与反序列化](#_297-二叉树的序列化与反序列化)

8. **🚀 进阶技巧类**：[二叉树展开为链表](#_114-二叉树展开为链表)、[填充每个节点的下一个右侧节点指针](#_116-填充每个节点的下一个右侧节点指针)、[二叉树的完全性检验](#_958-二叉树的完全性检验)、[填充每个节点的下一个右侧节点指针II](#_117-填充每个节点的下一个右侧节点指针-ii)

## 🎯 核心考点概览

- **遍历技巧**：前序、中序、后序、层序遍历
- **递归思维**：分治思想、递归终止条件
- **路径问题**：根到叶子路径、任意路径求和
- **树的构造**：根据遍历序列重建二叉树
- **树的变换**：翻转、对称、平衡判断
- **搜索树性质**：BST的查找、插入、删除
- **动态规划**：树形DP的经典应用

## 💡 解题万能模板

### 🔄 递归遍历模板

```java
// 递归遍历通用模板
public void traverse(TreeNode root) {
    if (root == null) return;
    
    // 前序位置 - 在递归之前
    doSomething(root.val);
    
    traverse(root.left);
    
    // 中序位置 - 在左右递归之间  
    doSomething(root.val);
    
    traverse(root.right);
    
    // 后序位置 - 在递归之后
    doSomething(root.val);
}
```

### 🔍 层序遍历模板

```java
// BFS层序遍历模板
public void levelOrder(TreeNode root) {
    if (root == null) return;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            // 处理当前节点
            doSomething(node.val);
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
}
```

### 🎯 分治思想模板

```java
// 分治思想模板
public ResultType divide(TreeNode root) {
    if (root == null) return nullResult;
    
    // 分：递归处理左右子树
    ResultType leftResult = divide(root.left);
    ResultType rightResult = divide(root.right);
    
    // 治：合并左右结果
    ResultType result = merge(leftResult, rightResult, root);
    
    return result;
}
```

## 🛡️ 边界检查清单

- ✅ 空树处理：`root == null`
- ✅ 单节点树：`root.left == null && root.right == null`
- ✅ 递归终止：明确递归出口条件
- ✅ 返回值检查：确保每个递归分支都有返回值

## 💡 记忆口诀

- **遍历顺序**："前序根左右，中序左根右，后序左右根，层序逐层走"
- **递归思维**："递归三要素，终止、递推、返回值"
- **路径问题**："路径用回溯，求和用递归"
- **树的构造**："前中后序定根节点，中序划分左右树"
- **搜索树**："左小右大有序性，中序遍历是关键"
- **平衡判断**："高度差不超过一，递归检查每个节点"
- **最值问题**："深度优先找路径，广度优先找最近"

---

## 🌳 一、遍历基础类（核心中的核心）

### 💡 核心思想

- **递归遍历**：利用函数调用栈实现深度优先
- **迭代遍历**：手动维护栈模拟递归过程  
- **层序遍历**：队列实现广度优先搜索

### [144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：遍历基础**

> 前序遍历：根→左→右，`[1,null,2,3]` → `[1,2,3]`

**💡 核心思路**：递归 + 迭代两种实现

- 递归：root → left → right 的顺序访问
- 迭代：使用栈模拟递归过程

**🔑 记忆技巧**：

- **口诀**："前序根左右，栈中右先入"
- **形象记忆**：像读书一样，先看标题（根）再看内容（左右）

```java
// 递归解法
public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    preorder(root, result);
    return result;
}

private void preorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    
    result.add(root.val);        // 根
    preorder(root.left, result); // 左
    preorder(root.right, result);// 右
}
```

**🔧 迭代解法**：

```java
public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    
    Stack<TreeNode> stack = new Stack<>();
    stack.push(root);
    
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        result.add(node.val);
        
        // 先入右子树，再入左子树（栈是后进先出）
        if (node.right != null) stack.push(node.right);
        if (node.left != null) stack.push(node.left);
    }
    
    return result;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(h) - 递归栈深度，h为树高

### [94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：BST基础**

> 中序遍历：左→根→右，`[1,null,2,3]` → `[1,3,2]`

**💡 核心思路**：左→根→右的访问顺序

- 对于BST，中序遍历得到有序序列
- 迭代实现需要先处理完所有左子树

**🔑 记忆技巧**：

- **口诀**："中序左根右，BST变有序"
- **形象记忆**：像中国人读书从左到右的顺序

```java
// 递归解法
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    inorder(root, result);
    return result;
}

private void inorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    
    inorder(root.left, result);  // 左
    result.add(root.val);        // 根
    inorder(root.right, result); // 右
}
```

**🔧 迭代解法**：

```java
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    Stack<TreeNode> stack = new Stack<>();
    TreeNode current = root;
    
    while (current != null || !stack.isEmpty()) {
        // 一直向左走到底
        while (current != null) {
            stack.push(current);
            current = current.left;
        }
        
        // 处理栈顶节点
        current = stack.pop();
        result.add(current.val);
        
        // 转向右子树
        current = current.right;
    }
    
    return result;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(h) - 递归栈或显式栈的深度

### [145. 二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)

**🎯 考察频率：高 | 难度：简单 | 重要性：分治思想基础**

> 后序遍历：左→右→根，`[1,null,2,3]` → `[3,2,1]`

**💡 核心思路**：左→右→根的访问顺序

- 后序遍历常用于树的删除、计算等操作
- 迭代实现相对复杂，需要记录访问状态

**🔑 记忆技巧**：

- **口诀**："后序左右根，删除用后序"
- **形象记忆**：像拆房子，先拆左右房间，最后拆主体

```java
// 递归解法
public List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    postorder(root, result);
    return result;
}

private void postorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    
    postorder(root.left, result);  // 左
    postorder(root.right, result); // 右
    result.add(root.val);          // 根
}
```

**🔧 迭代解法（双栈法）**：

```java
public List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    
    Stack<TreeNode> stack1 = new Stack<>();
    Stack<TreeNode> stack2 = new Stack<>();
    
    stack1.push(root);
    
    while (!stack1.isEmpty()) {
        TreeNode node = stack1.pop();
        stack2.push(node);
        
        if (node.left != null) stack1.push(node.left);
        if (node.right != null) stack1.push(node.right);
    }
    
    while (!stack2.isEmpty()) {
        result.add(stack2.pop().val);
    }
    
    return result;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(h) - 递归栈深度

### [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：BFS经典**

> 层序遍历：按层从左到右，`[3,9,20,null,null,15,7]` → `[[3],[9,20],[15,7]]`

**💡 核心思路**：队列实现BFS

![](https://pic.leetcode-cn.com/94cd1fa999df0276f1dae77a9cca83f4cabda9e2e0b8571cd9550a8ee3545f56.gif)

- 使用队列保存每层的节点
- 记录每层的节点数量，分层处理

**🔑 记忆技巧**：

- **口诀**："层序用队列，按层逐个走"
- **形象记忆**：像楼房一样，一层一层地访问

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        
        result.add(level);
    }
    
    return result;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(w) - w为树的最大宽度

### [103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)

**🎯 考察频率：高 | 难度：中等 | 重要性：层序变种**

> 锯齿形遍历：奇数层从左到右，偶数层从右到左

**💡 核心思路**：层序遍历 + 奇偶层判断

- 基于普通层序遍历
- 偶数层需要反转结果

**🔑 记忆技巧**：

- **口诀**："锯齿形遍历，奇正偶反转"

```java
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean leftToRight = true;
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        
        if (!leftToRight) {
            Collections.reverse(level);
        }
        
        result.add(level);
        leftToRight = !leftToRight;
    }
    
    return result;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(w) - 队列存储的最大宽度

### [222. 完全二叉树的节点个数](https://leetcode.cn/problems/count-complete-tree-nodes/)

**🎯 考察频率：高 | 难度：中等 | 重要性：完全二叉树性质**

> 计算完全二叉树的节点个数，要求时间复杂度低于O(n)

**💡 核心思路**：利用完全二叉树性质 + 二分思想

- 如果左右子树高度相同，左子树是满二叉树
- 如果高度不同，右子树是满二叉树
- 递归计算 + 满二叉树节点数公式：2^h - 1

**🔑 记忆技巧**：

- **口诀**："完全二叉树性质，递归加二分优化"
- **形象记忆**：像找平衡点，一边总是满的

```java
public int countNodes(TreeNode root) {
    if (root == null) return 0;
    
    int leftHeight = getHeight(root.left);
    int rightHeight = getHeight(root.right);
    
    if (leftHeight == rightHeight) {
        // 左子树是满二叉树
        return (1 << leftHeight) + countNodes(root.right);
    } else {
        // 右子树是满二叉树
        return (1 << rightHeight) + countNodes(root.left);
    }
}

private int getHeight(TreeNode root) {
    int height = 0;
    while (root != null) {
        height++;
        root = root.left;
    }
    return height;
}
```

**🔧 朴素递归解法**：

```java
public int countNodes(TreeNode root) {
    if (root == null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}
```

**⏱️ 复杂度分析**：

- **优化解法**：
  - 时间复杂度：O(log²n) - 每次递归高度减半，计算高度O(logn)
  - 空间复杂度：O(logn) - 递归栈深度
- **朴素解法**：
  - 时间复杂度：O(n) - 访问每个节点
  - 空间复杂度：O(logn) - 递归栈深度

### [515. 在每个树行中找最大值](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：层序遍历变种**

> 返回树每一层的最大值：`[1,3,2,5,3,null,9]` → `[1,3,9]`

**💡 核心思路**：层序遍历 + 每层求最大值

- BFS遍历每一层
- 记录每层的最大值

**🔑 记忆技巧**：

- **口诀**："层序遍历找最大，每层记录一个值"

```java
public List<Integer> largestValues(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        int maxVal = Integer.MIN_VALUE;
        
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            maxVal = Math.max(maxVal, node.val);
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        
        result.add(maxVal);
    }
    
    return result;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 访问每个节点一次
- **空间复杂度**：O(w) - 队列存储的最大宽度

### [662. 二叉树最大宽度](https://leetcode.cn/problems/maximum-width-of-binary-tree/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：位置编码技巧**

> 计算二叉树的最大宽度（两个端点间的距离）

**💡 核心思路**：层序遍历 + 节点位置编码

- 给每个节点编号：根节点为1，左子节点为2*i，右子节点为2*i+1
- 每层的宽度 = 最右位置 - 最左位置 + 1

**🔑 记忆技巧**：

- **口诀**："位置编码层序遍历，左右相减计算宽度"

```java
public int widthOfBinaryTree(TreeNode root) {
    if (root == null) return 0;
    
    Queue<TreeNode> nodeQueue = new LinkedList<>();
    Queue<Integer> posQueue = new LinkedList<>();
    
    nodeQueue.offer(root);
    posQueue.offer(1);
    
    int maxWidth = 1;
    
    while (!nodeQueue.isEmpty()) {
        int size = nodeQueue.size();
        int start = posQueue.peek();
        int end = start;
        
        for (int i = 0; i < size; i++) {
            TreeNode node = nodeQueue.poll();
            int pos = posQueue.poll();
            end = pos;
            
            if (node.left != null) {
                nodeQueue.offer(node.left);
                posQueue.offer(2 * pos);
            }
            
            if (node.right != null) {
                nodeQueue.offer(node.right);
                posQueue.offer(2 * pos + 1);
            }
        }
        
        maxWidth = Math.max(maxWidth, end - start + 1);
    }
    
    return maxWidth;
}
```

**🔧 DFS解法**：

```java
private int maxWidth = 0;

public int widthOfBinaryTree(TreeNode root) {
    maxWidth = 0;
    List<Integer> startPositions = new ArrayList<>();
    dfs(root, 0, 1, startPositions);
    return maxWidth;
}

private void dfs(TreeNode root, int depth, int pos, List<Integer> startPositions) {
    if (root == null) return;
    
    // 记录每层第一个节点的位置
    if (depth == startPositions.size()) {
        startPositions.add(pos);
    }
    
    // 计算当前层的宽度
    maxWidth = Math.max(maxWidth, pos - startPositions.get(depth) + 1);
    
    // 递归左右子树
    dfs(root.left, depth + 1, 2 * pos, startPositions);
    dfs(root.right, depth + 1, 2 * pos + 1, startPositions);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 访问每个节点一次
- **空间复杂度**：O(w) - 队列存储的最大宽度

---

## 🔍 二、查找路径类

### 💡 核心思想

- **深度计算**：递归求解左右子树深度
- **路径追踪**：回溯法记录路径
- **路径和**：递归过程中累加计算

### [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：递归入门**

> 求二叉树的最大深度：`[3,9,20,null,null,15,7]` → `3`

**💡 核心思路**：递归分治

- 树的深度 = max(左子树深度, 右子树深度) + 1
- 空树深度为0

**🔑 记忆技巧**：

- **口诀**："左右取最大，根节点加一"
- **形象记忆**：像测量房子高度，选择最高的那一侧

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    
    int leftDepth = maxDepth(root.left);
    int rightDepth = maxDepth(root.right);
    
    return Math.max(leftDepth, rightDepth) + 1;
}
```

**🔧 BFS层序解法**：

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    int depth = 0;
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        depth++;
        
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    
    return depth;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 访问每个节点
- **空间复杂度**：O(h) - 递归栈深度

### [111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

**🎯 考察频率：高 | 难度：简单 | 重要性：递归理解**

> 求到叶子节点的最短路径长度：`[3,9,20,null,null,15,7]` → `2`

**💡 核心思路**：递归 + 特殊情况处理

- 叶子节点：深度为1
- 只有一个子树：取存在的子树深度
- 有左右子树：取较小值

**🔑 记忆技巧**：

- **口诀**："叶子节点深度一，单子树要特判，双子树取最小"

```java
public int minDepth(TreeNode root) {
    if (root == null) return 0;
    
    // 叶子节点
    if (root.left == null && root.right == null) {
        return 1;
    }
    
    // 只有右子树
    if (root.left == null) {
        return minDepth(root.right) + 1;
    }
    
    // 只有左子树
    if (root.right == null) {
        return minDepth(root.left) + 1;
    }
    
    // 有左右子树
    return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 最坏情况访问所有节点
- **空间复杂度**：O(h) - 递归栈深度

### [112. 路径总和](https://leetcode.cn/problems/path-sum/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：路径递归**

> 判断是否存在根到叶子路径和等于目标值：`sum = 22`

**💡 核心思路**：递归 + 目标值递减

- 每次递归减去当前节点值
- 到达叶子节点时检查目标值是否为节点值

**🔑 记忆技巧**：

- **口诀**："目标递减到叶子，相等即为找到路径"

```java
public boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    
    // 叶子节点，检查路径和
    if (root.left == null && root.right == null) {
        return targetSum == root.val;
    }
    
    // 递归检查左右子树
    return hasPathSum(root.left, targetSum - root.val) ||
           hasPathSum(root.right, targetSum - root.val);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 最坏情况访问所有节点
- **空间复杂度**：O(h) - 递归栈深度

### [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)

**🎯 考察频率：高 | 难度：中等 | 重要性：回溯算法**

> 找出所有根到叶子路径和等于目标值的路径

**💡 核心思路**：DFS + 回溯

- 使用列表记录当前路径
- 到达叶子节点时检查并保存路径
- 回溯时移除当前节点

**🔑 记忆技巧**：

- **口诀**："DFS记录路径，回溯恢复状态"

```java
public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    dfs(root, targetSum, path, result);
    return result;
}

private void dfs(TreeNode root, int targetSum, List<Integer> path, 
                 List<List<Integer>> result) {
    if (root == null) return;
    
    // 添加当前节点到路径
    path.add(root.val);
    
    // 叶子节点，检查路径和
    if (root.left == null && root.right == null && targetSum == root.val) {
        result.add(new ArrayList<>(path));
    } else {
        // 递归左右子树
        dfs(root.left, targetSum - root.val, path, result);
        dfs(root.right, targetSum - root.val, path, result);
    }
    
    // 回溯：移除当前节点
    path.remove(path.size() - 1);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n²) - 最坏情况每个节点都要复制路径
- **空间复杂度**：O(h) - 递归栈和路径存储

### [199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：层序遍历应用**

> 给定一个二叉树的 **根节点** `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
>
> ![img](https://assets.leetcode.com/uploads/2021/02/14/tree.jpg)
>
> `[1,2,3,null,5,null,4]` → `[1,3,4]`

**💡 核心思路**：

- 使用广度优先搜索（BFS）逐层遍历二叉树。
- 对于每一层，记录最后一个节点（即最右侧的节点）的值。
- 将每一层的最后一个节点的值加入结果列表。

**🔑 记忆技巧**：

- **口诀**："层序遍历看右侧，每层最后即所见"
- **形象记忆**：像站在树的右边看，每层只能看到最右边的节点

```java
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            
            // 每层的最后一个节点加入结果
            if (i == size - 1) {
                result.add(node.val);
            }
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    
    return result;
}
```

**🔧 DFS解法**：

```java
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, 0, result);
    return result;
}

private void dfs(TreeNode root, int depth, List<Integer> result) {
    if (root == null) return;
    
    // 第一次到达这个深度，记录右视图
    if (depth == result.size()) {
        result.add(root.val);
    }
    
    // 先遍历右子树，再遍历左子树
    dfs(root.right, depth + 1, result);
    dfs(root.left, depth + 1, result);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 访问每个节点一次
- **空间复杂度**：O(h) - 递归栈深度或队列空间

### [437. 路径总和 III](https://leetcode.cn/problems/path-sum-iii/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：前缀和在树中的应用**

> 找出路径和等于目标值的路径数量（路径不需要从根节点开始，也不需要在叶子节点结束）

**💡 核心思路**：前缀和 + DFS

- 使用前缀和思想，记录从根到当前节点的路径和
- 利用哈希表记录前缀和出现的次数
- 如果当前前缀和减去目标值在哈希表中存在，说明找到了一条路径

**🔑 记忆技巧**：

- **口诀**："前缀和思想用于树，哈希记录找路径"
- **形象记忆**：像数组前缀和一样，在树上也可以用同样的思想

```java
public int pathSum(TreeNode root, int targetSum) {
    Map<Long, Integer> prefixSumCount = new HashMap<>();
    prefixSumCount.put(0L, 1); // 前缀和为0的路径有1条（空路径）
    return dfs(root, 0L, targetSum, prefixSumCount);
}

private int dfs(TreeNode root, long currentSum, int targetSum, 
                Map<Long, Integer> prefixSumCount) {
    if (root == null) return 0;
    
    // 更新当前路径和
    currentSum += root.val;
    
    // 查看是否存在前缀和为 currentSum - targetSum 的路径
    int count = prefixSumCount.getOrDefault(currentSum - targetSum, 0);
    
    // 记录当前前缀和
    prefixSumCount.put(currentSum, 
        prefixSumCount.getOrDefault(currentSum, 0) + 1);
    
    // 递归左右子树
    count += dfs(root.left, currentSum, targetSum, prefixSumCount);
    count += dfs(root.right, currentSum, targetSum, prefixSumCount);
    
    // 回溯：移除当前节点的贡献
    prefixSumCount.put(currentSum, prefixSumCount.get(currentSum) - 1);
    
    return count;
}
```

**🔧 暴力解法（理解用）**：

```java
public int pathSum(TreeNode root, int targetSum) {
    if (root == null) return 0;
    
    // 以当前节点为起点的路径数 + 左子树的路径数 + 右子树的路径数
    return pathSumFrom(root, targetSum) + 
           pathSum(root.left, targetSum) + 
           pathSum(root.right, targetSum);
}

private int pathSumFrom(TreeNode root, long targetSum) {
    if (root == null) return 0;
    
    int count = 0;
    if (root.val == targetSum) count++;
    
    count += pathSumFrom(root.left, targetSum - root.val);
    count += pathSumFrom(root.right, targetSum - root.val);
    
    return count;
}
```

**⏱️ 复杂度分析**：

- **前缀和解法**：
  - 时间复杂度：O(n) - 每个节点访问一次
  - 空间复杂度：O(h) - 递归栈和哈希表
- **暴力解法**：
  - 时间复杂度：O(n²) - 每个节点都要向下搜索
  - 空间复杂度：O(h) - 递归栈深度

### [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：树的经典问题**

> 找到二叉树中两个节点的最近公共祖先

**💡 核心思路**：后序遍历 + 递归回溯

- 如果当前节点是p或q之一，返回当前节点
- 递归查找左右子树
- 如果左右子树都找到了节点，当前节点就是LCA
- 如果只有一边找到，返回找到的那一边

> - 两个节点的最近公共祖先其实就是这两个节点向根节点的「延长线」的交汇点
>
> - **如果一个节点能够在它的左右子树中分别找到**`p`**和**`q`**，则该节点为**`LCA`**节点**
>
> - 若 root 是 p,q 的 最近公共祖先 ，则只可能为以下情况之一：
>
>   - p 和 q 在 root 的子树中，且分列 root 的 异侧（即分别在左、右子树中）；
>   - p=root ，且 q 在 root 的左或右子树中；
>   - q=root ，且 p 在 root 的左或右子树中；![Picture2.png](https://pic.leetcode-cn.com/1599885247-mgYjRv-Picture2.png)

**🔑 记忆技巧**：

- **口诀**："后序遍历找祖先，左右都有即是它"
- **形象记忆**：像家族树找共同祖先，必须包含两个人的最小子树的根

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    // 递归终止条件
    if (root == null || root == p || root == q) {
        return root;
    }
    
    // 递归查找左右子树
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    
    // 如果左右子树都找到了节点，当前节点就是LCA
    if (left != null && right != null) {
        return root;
    }
    
    // 如果只有一边找到，返回找到的那一边
    return left != null ? left : right;
}
```

**🔧 存储父节点解法**：

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    Map<TreeNode, TreeNode> parent = new HashMap<>();
    Stack<TreeNode> stack = new Stack<>();
    
    parent.put(root, null);
    stack.push(root);
    
    // 构建父节点映射
    while (!parent.containsKey(p) || !parent.containsKey(q)) {
        TreeNode node = stack.pop();
        
        if (node.left != null) {
            parent.put(node.left, node);
            stack.push(node.left);
        }
        
        if (node.right != null) {
            parent.put(node.right, node);
            stack.push(node.right);
        }
    }
    
    // 收集p的所有祖先
    Set<TreeNode> ancestors = new HashSet<>();
    while (p != null) {
        ancestors.add(p);
        p = parent.get(p);
    }
    
    // 找q的祖先中第一个在p的祖先集合中的
    while (!ancestors.contains(q)) {
        q = parent.get(q);
    }
    
    return q;
}
```

**⏱️ 复杂度分析**：

- **递归解法**：
  - 时间复杂度：O(n) - 最坏情况访问所有节点
  - 空间复杂度：O(h) - 递归栈深度
- **存储父节点解法**：
  - 时间复杂度：O(n) - 遍历所有节点
  - 空间复杂度：O(n) - 存储父节点映射

### [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

**🎯 考察频率：极高 | 难度：困难 | 重要性：树形DP经典**

> 找任意节点到任意节点的最大路径和（可以不经过根节点）

**💡 核心思路**：后序遍历 + 状态维护

- 对每个节点，考虑经过该节点的最大路径和
- 返回值是从该节点向下的最大路径和
- 全局变量记录所有可能路径的最大值

**🔑 记忆技巧**：

- **口诀**："后序求贡献，全局记录最大值"

```java
private int maxSum = Integer.MIN_VALUE;

public int maxPathSum(TreeNode root) {
    maxSum = Integer.MIN_VALUE;
    maxGain(root);
    return maxSum;
}

private int maxGain(TreeNode node) {
    if (node == null) return 0;
    
    // 递归计算左右子树的最大贡献值
    // 只有在贡献值大于0时才选择该子树
    int leftGain = Math.max(maxGain(node.left), 0);
    int rightGain = Math.max(maxGain(node.right), 0);
    
    // 经过当前节点的最大路径和
    int pathSum = node.val + leftGain + rightGain;
    
    // 更新全局最大值
    maxSum = Math.max(maxSum, pathSum);
    
    // 返回从当前节点向下的最大路径和
    return node.val + Math.max(leftGain, rightGain);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(h) - 递归栈深度

---

## 🏗️ 三、构造变换类

### 💡 核心思想

- **递归构造**：根据遍历序列的性质递归建树
- **树的变换**：翻转、对称等操作
- **结构比较**：递归比较两树的结构和值

### [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：构造经典**

> 根据前序和中序遍历结果构造唯一二叉树

**💡 核心思路**：分治递归

- 前序第一个元素是根节点
- 在中序中找根节点位置，划分左右子树
- 递归构造左右子树

**🔑 记忆技巧**：

- **口诀**："前序定根节点，中序划左右"

```java
public TreeNode buildTree(int[] preorder, int[] inorder) {
    // 构建中序遍历的值到索引的映射
    Map<Integer, Integer> inorderMap = new HashMap<>();
    for (int i = 0; i < inorder.length; i++) {
        inorderMap.put(inorder[i], i);
    }
    
    return build(preorder, 0, preorder.length - 1,
                 inorder, 0, inorder.length - 1, inorderMap);
}

private TreeNode build(int[] preorder, int preStart, int preEnd,
                       int[] inorder, int inStart, int inEnd,
                       Map<Integer, Integer> inorderMap) {
    if (preStart > preEnd) return null;
    
    // 前序遍历第一个元素是根节点
    int rootVal = preorder[preStart];
    TreeNode root = new TreeNode(rootVal);
    
    // 在中序遍历中找到根节点的位置
    int rootIndex = inorderMap.get(rootVal);
    
    // 左子树的节点数量
    int leftSize = rootIndex - inStart;
    
    // 递归构造左右子树
    root.left = build(preorder, preStart + 1, preStart + leftSize,
                      inorder, inStart, rootIndex - 1, inorderMap);
    root.right = build(preorder, preStart + leftSize + 1, preEnd,
                       inorder, rootIndex + 1, inEnd, inorderMap);
    
    return root;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点创建一次
- **空间复杂度**：O(n) - 哈希表和递归栈

### [226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：基础操作**

> 翻转二叉树：交换每个节点的左右子树

**💡 核心思路**：递归交换

- 递归翻转左右子树
- 交换当前节点的左右子树

**🔑 记忆技巧**：

- **口诀**："递归翻转左右子树，交换当前左右指针"

```java
public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    
    // 递归翻转左右子树
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    
    // 交换左右子树
    root.left = right;
    root.right = left;
    
    return root;
}
```

**🔧 迭代解法**：

```java
public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        
        // 交换左右子树
        TreeNode temp = node.left;
        node.left = node.right;
        node.right = temp;
        
        if (node.left != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
    }
    
    return root;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 访问每个节点
- **空间复杂度**：O(h) - 递归栈深度

### [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：结构判断**

> 判断二叉树是否关于根节点对称

**💡 核心思路**：递归比较

- 比较左子树的左孩子和右子树的右孩子
- 比较左子树的右孩子和右子树的左孩子

**🔑 记忆技巧**：

- **口诀**："左左对右右，左右对右左"

```java
public boolean isSymmetric(TreeNode root) {
    if (root == null) return true;
    return isSymmetricHelper(root.left, root.right);
}

private boolean isSymmetricHelper(TreeNode left, TreeNode right) {
    // 都为空，对称
    if (left == null && right == null) return true;
    
    // 一个为空一个不为空，不对称
    if (left == null || right == null) return false;
    
    // 值不同，不对称
    if (left.val != right.val) return false;
    
    // 递归检查
    return isSymmetricHelper(left.left, right.right) &&
           isSymmetricHelper(left.right, right.left);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 最坏情况访问所有节点
- **空间复杂度**：O(h) - 递归栈深度

### [100. 相同的树](https://leetcode.cn/problems/same-tree/)

**🎯 考察频率：高 | 难度：简单 | 重要性：基础比较**

> 判断两棵二叉树是否相同

**💡 核心思路**：递归比较

- 比较当前节点值
- 递归比较左右子树

**🔑 记忆技巧**：

- **口诀**："值相同且结构同，递归比较左右树"

```java
public boolean isSameTree(TreeNode p, TreeNode q) {
    // 都为空
    if (p == null && q == null) return true;
    
    // 一个为空一个不为空
    if (p == null || q == null) return false;
    
    // 值不同
    if (p.val != q.val) return false;
    
    // 递归比较左右子树
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(min(m,n)) - m,n分别为两树的节点数
- **空间复杂度**：O(min(m,n)) - 递归栈深度

---

## ⚖️ 四、平衡验证类

### 💡 核心思想

- **平衡判断**：检查每个节点的左右子树高度差
- **BST验证**：利用中序遍历或范围检查
- **有序性利用**：BST的中序遍历是有序的

### [110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：平衡树理解**

> 判断二叉树是否为高度平衡的（每个节点的左右子树高度差不超过1）

**💡 核心思路**：后序遍历 + 高度计算

- 先递归计算左右子树高度
- 检查高度差是否超过1
- 返回当前树的高度

**🔑 记忆技巧**：

- **口诀**："后序算高度，高度差不超一"

```java
public boolean isBalanced(TreeNode root) {
    return height(root) >= 0;
}

private int height(TreeNode root) {
    if (root == null) return 0;
    
    int leftHeight = height(root.left);
    int rightHeight = height(root.right);
    
    // 左右子树有一个不平衡，或当前节点不平衡
    if (leftHeight == -1 || rightHeight == -1 || 
        Math.abs(leftHeight - rightHeight) > 1) {
        return -1;
    }
    
    return Math.max(leftHeight, rightHeight) + 1;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(h) - 递归栈深度

### [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：BST性质理解**

> 判断二叉树是否为有效的二叉搜索树

**💡 核心思路**：范围检查或中序遍历

- 方法1：递归时维护节点值的有效范围
- 方法2：中序遍历结果应该严格递增

**🔑 记忆技巧**：

- **口诀**："范围递归或中序，严格递增是关键"

```java
// 方法1：范围检查
public boolean isValidBST(TreeNode root) {
    return validate(root, null, null);
}

private boolean validate(TreeNode node, Integer lower, Integer upper) {
    if (node == null) return true;
    
    int val = node.val;
    
    // 检查当前节点是否在有效范围内
    if (lower != null && val <= lower) return false;
    if (upper != null && val >= upper) return false;
    
    // 递归检查左右子树
    return validate(node.left, lower, val) && 
           validate(node.right, val, upper);
}
```

**🔧 中序遍历法**：

```java
private Integer prev = null;

public boolean isValidBST(TreeNode root) {
    prev = null;
    return inorder(root);
}

private boolean inorder(TreeNode root) {
    if (root == null) return true;
    
    // 检查左子树
    if (!inorder(root.left)) return false;
    
    // 检查当前节点
    if (prev != null && root.val <= prev) return false;
    prev = root.val;
    
    // 检查右子树
    return inorder(root.right);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 访问每个节点
- **空间复杂度**：O(h) - 递归栈深度

### [230. 二叉搜索树中第K小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：BST应用**

> 找到二叉搜索树中第k小的元素

**💡 核心思路**：中序遍历

- BST的中序遍历结果是有序的
- 遍历到第k个元素时返回

**🔑 记忆技巧**：

- **口诀**："BST中序有序，第k个即答案"

```java
private int count = 0;
private int result = 0;

public int kthSmallest(TreeNode root, int k) {
    count = 0;
    inorder(root, k);
    return result;
}

private void inorder(TreeNode root, int k) {
    if (root == null) return;
    
    inorder(root.left, k);
    
    count++;
    if (count == k) {
        result = root.val;
        return;
    }
    
    inorder(root.right, k);
}
```

**🔧 迭代解法**：

```java
public int kthSmallest(TreeNode root, int k) {
    Stack<TreeNode> stack = new Stack<>();
    TreeNode current = root;
    
    while (current != null || !stack.isEmpty()) {
        while (current != null) {
            stack.push(current);
            current = current.left;
        }
        
        current = stack.pop();
        k--;
        if (k == 0) return current.val;
        
        current = current.right;
    }
    
    return -1; // 不会到达这里
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(h + k) - h为树高，k为目标位置
- **空间复杂度**：O(h) - 递归栈或显式栈

---

## 🎯 五、搜索树操作类

### 💡 核心思想

- **BST性质**：左小右大的有序性
- **查找效率**：利用有序性快速定位
- **递归操作**：插入、删除、查找的递归实现

### [235. 二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：BST应用**

> 找到BST中两个节点的最近公共祖先

**💡 核心思路**：利用BST性质

- 如果两个节点都在左子树，向左找
- 如果两个节点都在右子树，向右找
- 否则当前节点就是LCA

**🔑 记忆技巧**：

- **口诀**："同侧继续找，异侧即祖先"

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null) return null;
    
    // 两个节点都在左子树
    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestor(root.left, p, q);
    }
    
    // 两个节点都在右子树
    if (p.val > root.val && q.val > root.val) {
        return lowestCommonAncestor(root.right, p, q);
    }
    
    // 一个在左，一个在右，或者其中一个就是根节点
    return root;
}
```

**🔧 迭代解法**：

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    TreeNode current = root;
    
    while (current != null) {
        if (p.val < current.val && q.val < current.val) {
            current = current.left;
        } else if (p.val > current.val && q.val > current.val) {
            current = current.right;
        } else {
            return current;
        }
    }
    
    return null;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(h) - h为树的高度
- **空间复杂度**：O(1) - 迭代版本为常数空间

### [450. 删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/)

**🎯 考察频率：高 | 难度：中等 | 重要性：BST操作**

> 删除BST中的指定节点，保持BST性质

**💡 核心思路**：分情况讨论

- 叶子节点：直接删除
- 只有一个子树：用子树替代
- 有两个子树：用右子树最小值（或左子树最大值）替代

**🔑 记忆技巧**：

- **口诀**："叶子直删，单子替代，双子找后继"

```java
public TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    
    if (key < root.val) {
        // 在左子树中删除
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        // 在右子树中删除
        root.right = deleteNode(root.right, key);
    } else {
        // 找到要删除的节点
        if (root.left == null) {
            return root.right;
        } else if (root.right == null) {
            return root.left;
        } else {
            // 有两个子树，找右子树的最小值
            TreeNode minNode = findMin(root.right);
            root.val = minNode.val;
            root.right = deleteNode(root.right, minNode.val);
        }
    }
    
    return root;
}

private TreeNode findMin(TreeNode root) {
    while (root.left != null) {
        root = root.left;
    }
    return root;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(h) - h为树的高度
- **空间复杂度**：O(h) - 递归栈深度

### [108. 将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

**🎯 考察频率：高 | 难度：简单 | 重要性：BST构造**

> 将有序数组转换为高度平衡的BST

**💡 核心思路**：分治递归

- 选择数组中间元素作为根节点
- 递归构造左右子树

**🔑 记忆技巧**：

- **口诀**："中间作根，左右递归"

```java
public TreeNode sortedArrayToBST(int[] nums) {
    return helper(nums, 0, nums.length - 1);
}

private TreeNode helper(int[] nums, int left, int right) {
    if (left > right) return null;
    
    // 选择中间位置作为根节点
    int mid = left + (right - left) / 2;
    TreeNode root = new TreeNode(nums[mid]);
    
    // 递归构造左右子树
    root.left = helper(nums, left, mid - 1);
    root.right = helper(nums, mid + 1, right);
    
    return root;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个元素访问一次
- **空间复杂度**：O(logn) - 递归栈深度

---

## 📊 六、树形DP类

### 💡 核心思想

- **状态定义**：每个节点维护所需的状态信息
- **状态转移**：根据子树状态计算当前状态
- **最优子结构**：问题的最优解包含子问题的最优解

### [337. 打家劫舍 III](https://leetcode.cn/problems/house-robber-iii/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：树形DP经典**

> 在二叉树上进行打家劫舍，相邻节点不能同时被选择

**💡 核心思路**：树形DP

- 对每个节点维护两个状态：偷和不偷
- 偷当前节点：不能偷子节点
- 不偷当前节点：可以选择偷或不偷子节点

**🔑 记忆技巧**：

- **口诀**："偷根不偷子，不偷根选子树最优"

```java
public int rob(TreeNode root) {
    int[] result = robHelper(root);
    return Math.max(result[0], result[1]);
}

// 返回数组：[不偷当前节点的最大值, 偷当前节点的最大值]
private int[] robHelper(TreeNode root) {
    if (root == null) return new int[]{0, 0};
    
    int[] left = robHelper(root.left);
    int[] right = robHelper(root.right);
    
    // 不偷当前节点：可以选择偷或不偷子节点
    int notRob = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    
    // 偷当前节点：不能偷子节点
    int rob = root.val + left[0] + right[0];
    
    return new int[]{notRob, rob};
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(h) - 递归栈深度

### [543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：路径长度计算**

> 计算二叉树中任意两个节点路径长度的最大值

**💡 核心思路**：DFS + 路径计算

- 对每个节点，计算经过该节点的最长路径
- 路径长度 = 左子树深度 + 右子树深度
- 全局变量记录最大路径长度

**🔑 记忆技巧**：

- **口诀**："左深加右深，全局记最大"

```java
private int diameter = 0;

public int diameterOfBinaryTree(TreeNode root) {
    diameter = 0;
    depth(root);
    return diameter;
}

private int depth(TreeNode root) {
    if (root == null) return 0;
    
    int leftDepth = depth(root.left);
    int rightDepth = depth(root.right);
    
    // 更新直径：经过当前节点的路径长度
    diameter = Math.max(diameter, leftDepth + rightDepth);
    
    // 返回当前节点的深度
    return Math.max(leftDepth, rightDepth) + 1;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(h) - 递归栈深度

### [572. 另一棵树的子树](https://leetcode.cn/problems/subtree-of-another-tree/)

**🎯 考察频率：高 | 难度：简单 | 重要性：子树匹配**

> 判断一棵树是否为另一棵树的子树

**💡 核心思路**：递归 + 树匹配

- 遍历主树的每个节点
- 对每个节点检查是否与子树相同

**🔑 记忆技巧**：

- **口诀**："遍历主树每个点，相同判断为子树"

```java
public boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (root == null) return false;
    
    // 检查当前节点为根的树是否与subRoot相同
    if (isSame(root, subRoot)) return true;
    
    // 递归检查左右子树
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

private boolean isSame(TreeNode s, TreeNode t) {
    if (s == null && t == null) return true;
    if (s == null || t == null) return false;
    if (s.val != t.val) return false;
    
    return isSame(s.left, t.left) && isSame(s.right, t.right);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(m×n) - m,n分别为两树的节点数
- **空间复杂度**：O(max(h1,h2)) - 递归栈深度

---

## 🔄 七、序列化类

### 💡 核心思想

- **序列化**：将树结构转换为字符串
- **反序列化**：从字符串重建树结构
- **编码策略**：前序、层序等不同的编码方式

### [297. 二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/)

**🎯 考察频率：极高 | 难度：困难 | 重要性：综合能力考察**

> 设计算法来序列化和反序列化二叉树

**💡 核心思路**：前序遍历 + 递归构造

- 序列化：前序遍历，null用特殊符号表示
- 反序列化：根据前序遍历的性质递归构造

**🔑 记忆技巧**：

- **口诀**："前序序列化，递归反序列"

```java
public class Codec {
    private static final String NULL = "#";
    private static final String SEP = ",";
    
    // 序列化
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serialize(root, sb);
        return sb.toString();
    }
    
    private void serialize(TreeNode root, StringBuilder sb) {
        if (root == null) {
            sb.append(NULL).append(SEP);
            return;
        }
        
        sb.append(root.val).append(SEP);
        serialize(root.left, sb);
        serialize(root.right, sb);
    }
    
    // 反序列化
    public TreeNode deserialize(String data) {
        Queue<String> queue = new LinkedList<>(Arrays.asList(data.split(SEP)));
        return deserialize(queue);
    }
    
    private TreeNode deserialize(Queue<String> queue) {
        String val = queue.poll();
        if (NULL.equals(val)) return null;
        
        TreeNode root = new TreeNode(Integer.parseInt(val));
        root.left = deserialize(queue);
        root.right = deserialize(queue);
        
        return root;
    }
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 序列化和反序列化都是O(n)
- **空间复杂度**：O(n) - 存储序列化结果

---

## 🚀 八、进阶技巧类

### 💡 核心思想

- **原地操作**：在原树结构上进行变换
- **指针操作**：巧妙使用指针连接节点
- **空间优化**：常数空间完成复杂操作

### [114. 二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

**🎯 考察频率：高 | 难度：中等 | 重要性：树变链表**

> 将二叉树展开为单链表（按前序遍历顺序）

**💡 核心思路**：后序遍历 + 原地操作

- 先处理右子树，再处理左子树
- 将左子树插入到根节点和右子树之间

**🔑 记忆技巧**：

- **口诀**："后序处理，左插右连"

```java
public void flatten(TreeNode root) {
    if (root == null) return;
    
    // 先递归展开左右子树
    flatten(root.left);
    flatten(root.right);
    
    // 保存右子树
    TreeNode right = root.right;
    
    // 将左子树移到右边
    root.right = root.left;
    root.left = null;
    
    // 找到当前右子树的末尾，连接原来的右子树
    TreeNode current = root;
    while (current.right != null) {
        current = current.right;
    }
    current.right = right;
}
```

**🔧 前序遍历解法**：

```java
private TreeNode prev = null;

public void flatten(TreeNode root) {
    if (root == null) return;
    
    flatten(root.right);
    flatten(root.left);
    
    root.right = prev;
    root.left = null;
    prev = root;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(h) - 递归栈深度

### [116. 填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)

**🎯 考察频率：高 | 难度：中等 | 重要性：层序连接**

> 填充每个节点的next指针，指向其下一个右侧节点

**💡 核心思路**：层序遍历 + 指针连接

- 利用已建立的next指针遍历当前层
- 连接下一层的节点

**🔑 记忆技巧**：

- **口诀**："当前层遍历，下层建连接"

```java
public Node connect(Node root) {
    if (root == null) return null;
    
    Node leftmost = root;
    
    while (leftmost.left != null) {
        Node head = leftmost;
        
        while (head != null) {
            // 连接左右子节点
            head.left.next = head.right;
            
            // 连接右子节点和下一个节点的左子节点
            if (head.next != null) {
                head.right.next = head.next.left;
            }
            
            head = head.next;
        }
        
        leftmost = leftmost.left;
    }
    
    return root;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个节点访问一次
- **空间复杂度**：O(1) - 常数空间

### [958. 二叉树的完全性检验](https://leetcode.cn/problems/check-completeness-of-a-binary-tree/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：完全二叉树判断**

> 判断给定的二叉树是否是完全二叉树

**💡 核心思路**：层序遍历 + 空节点检查

- 完全二叉树的层序遍历中，一旦出现空节点，后面就不能再有非空节点
- 使用BFS，遇到第一个空节点后，检查后续是否都为空

**🔑 记忆技巧**：

- **口诀**："层序遍历遇空停，后续全空才完全"

```java
public boolean isCompleteTree(TreeNode root) {
    if (root == null) return true;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean foundNull = false;
    
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        
        if (node == null) {
            foundNull = true;
        } else {
            // 如果之前遇到过空节点，现在又遇到非空节点，不是完全二叉树
            if (foundNull) return false;
            
            queue.offer(node.left);
            queue.offer(node.right);
        }
    }
    
    return true;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 最坏情况访问所有节点
- **空间复杂度**：O(w) - 队列存储的最大宽度

### [117. 填充每个节点的下一个右侧节点指针 II](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/)

**🎯 考察频率：高 | 难度：中等 | 重要性：任意二叉树的指针连接**

> 填充每个节点的next指针，指向其下一个右侧节点（不是完全二叉树）

**💡 核心思路**：层序遍历或利用已建立的next指针

- 方法1：层序遍历，逐层连接
- 方法2：利用上层已建立的next指针遍历，连接下层

**🔑 记忆技巧**：

- **口诀**："层序连接或上层带下层"

```java
// 方法1：层序遍历
public Node connect(Node root) {
    if (root == null) return null;
    
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        Node prev = null;
        
        for (int i = 0; i < size; i++) {
            Node node = queue.poll();
            
            if (prev != null) {
                prev.next = node;
            }
            prev = node;
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    
    return root;
}
```

**🔧 O(1)空间解法**：

```java
public Node connect(Node root) {
    Node head = root;
    
    while (head != null) {
        Node dummy = new Node(0);
        Node tail = dummy;
        
        // 遍历当前层，连接下一层
        while (head != null) {
            if (head.left != null) {
                tail.next = head.left;
                tail = tail.next;
            }
            if (head.right != null) {
                tail.next = head.right;
                tail = tail.next;
            }
            head = head.next;
        }
        
        head = dummy.next;
    }
    
    return root;
}
```

**⏱️ 复杂度分析**：

- **层序遍历**：
  - 时间复杂度：O(n) - 每个节点访问一次
  - 空间复杂度：O(w) - 队列空间
- **O(1)空间解法**：
  - 时间复杂度：O(n) - 每个节点访问一次
  - 空间复杂度：O(1) - 常数空间

---

## 🏆 面试前15分钟速记表

| 题型分类       | 核心技巧  | 高频题目                                                     | 记忆口诀                                       | 难度  |
| -------------- | --------- | ------------------------------------------------------------ | ---------------------------------------------- | ----- |
| **遍历基础**   | 递归+迭代 | 前序遍历、中序遍历、后序遍历、层序遍历、锯齿形遍历、完全二叉树的节点个数、在每个树行中找最大值、二叉树最大宽度 | 前序根左右，中序左根右，后序左右根，层序逐层走 | ⭐⭐⭐   |
| **查找路径**   | DFS+回溯  | 最大深度、最小深度、路径总和、路径总和II、二叉树的右视图、路径总和III、二叉树的最近公共祖先、最大路径和 | 递归求深度，回溯记路径，路径和用DFS            | ⭐⭐⭐⭐  |
| **构造变换**   | 分治递归  | 从遍历序列构造树、翻转二叉树、对称二叉树、相同的树           | 前序定根节点，中序划左右，递归翻转左右子树     | ⭐⭐⭐⭐  |
| **平衡验证**   | 性质检查  | 平衡二叉树、验证BST、BST中第K小元素                          | 后序算高度，范围验证BST，中序遍历有序性        | ⭐⭐⭐⭐  |
| **搜索树操作** | BST性质   | BST的LCA、删除BST节点、有序数组转BST                         | 左小右大有序性，同侧继续找，异侧即祖先         | ⭐⭐⭐⭐  |
| **树形DP**     | 状态转移  | 打家劫舍III、二叉树直径、另一棵树的子树                      | 偷根不偷子，不偷根选最优，左深加右深           | ⭐⭐⭐⭐⭐ |
| **序列化**     | 编码重建  | 二叉树序列化与反序列化                                       | 前序序列化，递归反序列                         | ⭐⭐⭐⭐⭐ |
| **进阶技巧**   | 原地操作  | 展开为链表、填充next指针、二叉树的完全性检验、填充next指针II | 后序处理左插右连，当前层遍历下层建连接         | ⭐⭐⭐⭐⭐ |

### 按难度分级

- **⭐⭐⭐ 简单必会**：前序中序后序遍历、最大最小深度、翻转二叉树、对称二叉树、相同的树、平衡二叉树
- **⭐⭐⭐⭐ 中等重点**：层序遍历、锯齿形遍历、路径总和II、从遍历序列构造树、验证BST、BST第K小元素、打家劫舍III、二叉树直径
- **⭐⭐⭐⭐⭐ 困难经典**：最大路径和、序列化与反序列化、展开为链表

### 热题100核心优先级

1. **二叉树的中序遍历** - 递归和迭代两种写法
2. **二叉树的层序遍历** - BFS模板题
3. **二叉树的最大深度** - 递归入门
4. **翻转二叉树** - 基础操作
5. **对称二叉树** - 递归比较
6. **路径总和** - DFS应用
7. **从前序与中序构造二叉树** - 分治思想
8. **验证二叉搜索树** - BST性质
9. **二叉树中的最大路径和** - 树形DP经典
10. **二叉树的序列化与反序列化** - 综合能力

### 热题100题目统计

- **总题目数**：38+道热题100二叉树题目
- **新增重要题目**：LC199二叉树的右视图、LC437路径总和III、LC236二叉树的最近公共祖先、LC222完全二叉树的节点个数、LC515在每个树行中找最大值、LC662二叉树最大宽度、LC958二叉树的完全性检验、LC117填充每个节点的下一个右侧节点指针II
- **覆盖率**：100%覆盖热题100中的二叉树相关题目，并补充了重要的面试高频题
- **核心算法**：递归、DFS、BFS、分治、动态规划、前缀和、位置编码

### 常见陷阱提醒

- ⚠️ **空指针**：`root == null` 的边界处理
- ⚠️ **递归终止**：明确递归的出口条件
- ⚠️ **返回值**：确保每个递归分支都有返回值
- ⚠️ **全局变量**：多次调用时要重置全局变量
- ⚠️ **BST性质**：注意是严格大于/小于，不能相等

### 解题步骤提醒

1. **确定递归函数的定义**：明确函数的输入输出
2. **确定递归终止条件**：通常是`root == null`
3. **确定单层递归逻辑**：当前节点应该做什么
4. **考虑返回值**：是否需要返回值来传递信息

---

*🎯 备注：本总结涵盖了二叉树算法的核心知识点，建议配合实际编程练习，重点掌握递归思维和分治思想。*

