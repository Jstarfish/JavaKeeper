---
title: DFS-热题
date: 2025-04-08
tags: 
 - DFS
 - algorithms
categories: leetcode
---

![](https://img.starfish.ink/leetcode/leetcode-banner.png)

> **导读**：深度优先搜索(DFS)是最重要的图论算法之一，也是面试中的高频考点。从简单的图遍历到复杂的回溯问题，DFS的应用无处不在。掌握DFS的核心思想和常见模板，是解决树、图、回溯等问题的关键。
>
> **关键词**：深度优先搜索、回溯算法、树遍历、图遍历、递归

### 📋 分类索引

1. **🔥 基础DFS应用类（4题）**：[岛屿数量](#_200-岛屿数量)、[单词搜索](#_79-单词搜索)、[岛屿的最大面积](#_695-岛屿的最大面积)、[被围绕的区域](#_130-被围绕的区域)
2. **🌳 树的DFS应用类（9题）**：[二叉树的最大深度](#_104-二叉树的最大深度)、[验证二叉搜索树](#_98-验证二叉搜索树)、[二叉树的直径](#_543-二叉树的直径)、[对称二叉树](#_101-对称二叉树)、[二叉树的最小深度](#_111-二叉树的最小深度)、[路径总和III](#_437-路径总和-iii)、[把二叉搜索树转换为累加树](#_538-把二叉搜索树转换为累加树)、[二叉树中的最大路径和](#_124-二叉树中的最大路径和)、[从前序与中序遍历序列构造二叉树](#_105-从前序与中序遍历序列构造二叉树)
3. **🔄 回溯算法类（7题）**：[全排列](#_46-全排列)、[组合总和](#_39-组合总和)、[子集](#_78-子集)、[括号生成](#_22-括号生成)、[电话号码的字母组合](#_17-电话号码的字母组合)、[分割回文串](#_131-分割回文串)、[目标和](#_494-目标和)
4. **🔍 图论算法类（2题）**：[课程表II](#_210-课程表ii)
5. **🌟 高级技巧类（1题）**：[单词拆分](#_139-单词拆分)

### 🎯 核心考点概览

- **基础DFS遍历**：图和矩阵的深度优先搜索，连通性检测
- **树的DFS应用**：前中后序遍历，路径搜索，树的性质验证
- **回溯算法**：全排列、组合、子集等搜索所有可能解
- **图论应用**：环检测、拓扑排序、最长路径搜索

我们按分类，逐个攻破~

### 📝  必掌握模板

```java
// 基础DFS遍历模板
void dfs(int[][] grid, int i, int j) {
    // 边界条件检查
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length) {
        return;
    }
    // 标记已访问
    grid[i][j] = visited_mark;
    
    // 向四个方向递归
    dfs(grid, i + 1, j); // 下
    dfs(grid, i - 1, j); // 上  
    dfs(grid, i, j + 1); // 右
    dfs(grid, i, j - 1); // 左
}

// 回溯DFS模板
void backtrack(参数列表) {
    if (终止条件) {
        收集结果;
        return;
    }
    
    for (选择 : 选择列表) {
        做选择;
        backtrack(参数列表);
        撤销选择;
    }
}
```

#### 边界检查清单

- ✅ 数组越界：确保索引在有效范围内
- ✅ 访问标记：避免重复访问同一节点
- ✅ 终止条件：明确递归的出口
- ✅ 状态恢复：回溯时正确恢复状态

#### 💡 记忆口诀（朗朗上口版）

- **基础DFS**：\"边界检查要仔细，标记访问防重复\"
- **树的遍历**：\"左右子树递归走，根据题意选时机\"
- **回溯算法**：\"做选择，递归下，撤选择，要记下\"
- **图的搜索**：\"四方向，都要走，条件满足才递归\"

**最重要的一个技巧就是，你得行动，写起来**

---

## 一、DFS 算法简介与核心思想

### 💡 核心思想

- **递归或栈实现**：通过递归隐式利用系统栈，或显式使用栈数据结构
- **标记与回溯**：访问节点后标记防止重复，搜索到底后回溯到分叉点继续其他分支
- **深度优先**：尽可能深地探索每个分支，直到无法继续再回溯探索其他分支

### 🎯 常见应用场景

1. **图的连通性检测**：如岛屿数量、被围绕的区域、判断图中是否存在一条路径
2. **回溯问题**：组合、排列、子集、分割、数独、八皇后等
3. **树的相关问题**：路径和、验证二叉搜索树、序列化等
4. **矩阵搜索问题**：单词搜索、黄金矿工问题
5. **拓扑排序与环检测**：课程表问题

### ⚡ 复杂度分析

- **时间复杂度**：通常为 $O(N)$ 或 $O(N+M)$（N 为节点数，M 为边数）
- **空间复杂度**：与递归深度相关，最坏情况 $O(N)$（如链表结构）

---

## 二、基础DFS应用类（核心中的核心）🔥

**💡 核心思想**

- **图的遍历**：深度优先遍历图或矩阵，标记已访问节点
- **连通性检测**：判断图中节点的连通性，如岛屿数量问题
- **路径搜索**：在图或矩阵中搜索满足条件的路径

**🎯 必掌握模板**

```java
// 基础DFS遍历模板（四方向）
void dfs(int[][] grid, int i, int j) {
    // 边界条件检查
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] == 0) {
        return;
    }
    // 标记已访问
    grid[i][j] = 0; // 或其他标记值
    
    // 向四个方向递归
    dfs(grid, i + 1, j); // 下
    dfs(grid, i - 1, j); // 上  
    dfs(grid, i, j + 1); // 右
    dfs(grid, i, j - 1); // 左
}
```

### [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：DFS基础经典**

> 给你一个由 `'1'`（陆地）和 `'0'`（水）组成的的二维网格，请你计算网格中岛屿的数量。
>
> 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
>
> 此外，你可以假设该网格的四条边均被水包围。
>
> ```
> 输入：grid = [
>   ['1','1','0','0','0'],
>   ['1','1','0','0','0'],
>   ['0','0','1','0','0'],
>   ['0','0','0','1','1']
> ]
> 输出：3
> ```

**💡 核心思路**：DFS + 标记已访问。为了求出岛屿的数量，我们可以扫描整个二维网格。如果一个位置为 1，则以其为起始节点开始进行深度优先搜索。在深度优先搜索的过程中，每个搜索到的 1 都会被重新标记为 0。

最终岛屿的数量就是我们进行深度优先搜索的次数。

```java
public class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                // 如果当前是陆地，才开始一次DFS遍历
                if (grid[i][j] == '1') {
                    dfs(grid, i, j);
                    count++;
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int r, int c) {
        // 边界检查和当前位置是否为陆地
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') {
            return;
        }
        // 将当前位置标记为已访问
        grid[r][c] = '0'; // 淹没陆地
        
        // 访问上、下、左、右四个相邻结点
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}
```

**⏱️ 复杂度分析**：
- **时间复杂度**：O(MN) - 每个格子最多访问一次
- **空间复杂度**：O(MN) - 最坏情况下递归栈深度

### [79. 单词搜索](https://leetcode.cn/problems/word-search/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：DFS + 回溯经典**

> 给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word`。如果 `word` 存在于网格中，返回 `true`；否则，返回 `false`。
>
> 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中"相邻"单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

**💡 核心思路**：DFS + 回溯，从每个起点出发四方向搜索匹配字符

```java
public boolean exist(char[][] board, String word) {
    // 遍历网格中的每一个单元格作为起始点
    for (int i = 0; i < board.length; i++) {
        for (int j = 0; j < board[0].length; j++) {
            if (dfs(board, word, 0, i, j)) {
                return true; // 找到路径立即返回
            }
        }
    }
    return false; // 全部遍历后仍未找到
}

private boolean dfs(char[][] board, String word, int idx, int r, int c) {
    // 成功条件：已匹配完所有字符
    if (idx == word.length()) return true;
    
    // 边界检查 + 剪枝（当前字符不匹配）
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length 
        || board[r][c] != word.charAt(idx)) {
        return false;
    }
    
    // 标记已访问（防止重复使用）
    char tmp = board[r][c];
    board[r][c] = '#'; 
    
    // 向四个方向递归搜索
    boolean res = dfs(board, word, idx + 1, r + 1, c)  // 向下
               || dfs(board, word, idx + 1, r - 1, c)  // 向上
               || dfs(board, word, idx + 1, r, c + 1)  // 向右
               || dfs(board, word, idx + 1, r, c - 1); // 向左
    
    // 回溯：恢复现场
    board[r][c] = tmp;
    
    return res;
}
```

**⏱️ 复杂度分析**：
- **时间复杂度**：O(MN × 3^L) - L为单词长度，每个位置最多3个方向（不回头）
- **空间复杂度**：O(L) - 递归栈深度

### [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/)

**🎯 考察频率：高 | 难度：中等 | 重要性：DFS计数应用**

> 给你一个大小为 `m x n` 的二进制矩阵 `grid`。**岛屿**是由一些相邻的 `1` (代表土地) 构成的组合，这里的「相邻」要求两个 `1` 必须在 **水平或者竖直的四个方向上** 相邻。你可以假设 `grid` 的四个边缘都被 `0`（代表水）包围着。
>
> 岛屿的面积是岛上值为 `1` 的单元格的数目。计算并返回 `grid` 中最大的岛屿面积。如果没有岛屿，则返回面积为 `0` 。

**💡 核心思路**：DFS计算每个岛屿面积，取最大值

```java
public int maxAreaOfIsland(int[][] grid) {
    int maxArea = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == 1) {
                maxArea = Math.max(maxArea, dfs(grid, i, j));
            }
        }
    }
    return maxArea;
}

private int dfs(int[][] grid, int r, int c) {
    // 边界检查
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != 1) {
        return 0;
    }
    
    grid[r][c] = 0; // 标记为已访问
    
    // 当前面积1 + 四个方向的面积
    return 1 + dfs(grid, r + 1, c) + dfs(grid, r - 1, c) 
             + dfs(grid, r, c + 1) + dfs(grid, r, c - 1);
}
```

### [130. 被围绕的区域](https://leetcode.cn/problems/surrounded-regions/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：DFS + 边界处理**

> 给你一个 `m x n` 的矩阵 `board` ，由若干字符 `'X'` 和 `'O'` ，找到所有被 `'X'` 围绕的区域，并将这些区域里所有的 `'O'` 用 `'X'` 填充。

**💡 核心思路**：从边界开始DFS，标记不被围绕的'O'

```java
public void solve(char[][] board) {
    int m = board.length, n = board[0].length;
    
    // 从边界的'O'开始DFS，标记为'A'
    for (int i = 0; i < m; i++) {
        if (board[i][0] == 'O') dfs(board, i, 0);
        if (board[i][n-1] == 'O') dfs(board, i, n-1);
    }
    for (int j = 0; j < n; j++) {
        if (board[0][j] == 'O') dfs(board, 0, j);
        if (board[m-1][j] == 'O') dfs(board, m-1, j);
    }
    
    // 处理结果：'A'改回'O'，'O'改为'X'
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (board[i][j] == 'A') {
                board[i][j] = 'O';
            } else if (board[i][j] == 'O') {
                board[i][j] = 'X';
            }
        }
    }
}

private void dfs(char[][] board, int i, int j) {
    if (i < 0 || j < 0 || i >= board.length || j >= board[0].length || board[i][j] != 'O') {
        return;
    }
    
    board[i][j] = 'A'; // 标记为不被围绕
    
    dfs(board, i + 1, j);
    dfs(board, i - 1, j);
    dfs(board, i, j + 1);
    dfs(board, i, j - 1);
}
```

**⏱️ 复杂度分析**：
- **时间复杂度**：O(MN) - 每个位置最多访问一次
- **空间复杂度**：O(MN) - 最坏情况递归栈深度

---

## 三、树的DFS应用类（结构化思维）🌳

**💡 核心思想**

- **前中后序遍历**：根据访问根节点的时机不同，处理不同类型的问题
- **路径搜索**：从根到叶或任意节点间的路径问题
- **树的性质验证**：利用DFS验证二叉搜索树、对称性等性质
- **信息向上传递**：子树信息向父节点传递，如高度、直径等

**🎯 必掌握模板**

```java
// 树的DFS模板（后序遍历获取子树信息）
int dfs(TreeNode root) {
    if (root == null) return 0;
    
    int left = dfs(root.left);   // 左子树信息
    int right = dfs(root.right); // 右子树信息
    
    // 基于子树信息处理当前节点
    int currentResult = processNode(root, left, right);
    
    return currentResult; // 向上传递信息
}
```

### [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：DFS基础**

> 给定一个二叉树，找出其最大深度。
>
> 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**💡 核心思路**：后序遍历，子树深度+1

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    
    int leftHeight = maxDepth(root.left);
    int rightHeight = maxDepth(root.right);
    
    return Math.max(leftHeight, rightHeight) + 1;
}
```

### [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：DFS + 边界控制**

> 给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。

**💡 核心思路**：DFS + 维护上下界范围

```java
public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long min, long max) {
    if (node == null) return true;
    
    if (node.val <= min || node.val >= max) return false;
    
    return validate(node.left, min, node.val) 
        && validate(node.right, node.val, max);
}
```

### [543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)

**🎯 考察频率：高 | 难度：简单 | 重要性：DFS信息传递**

> 给你一棵二叉树的根节点，返回该树的直径。二叉树的直径是指树中任意两个节点之间最长路径的长度。

**💡 核心思路**：后序遍历，计算经过每个节点的最长路径

```java
class Solution {
    private int maxDiameter = 0;
    
    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return maxDiameter;
    }
    
    private int height(TreeNode node) {
        if (node == null) return 0;
        
        int left = height(node.left);
        int right = height(node.right);
        
        // 更新最大直径
        maxDiameter = Math.max(maxDiameter, left + right);
        
        return Math.max(left, right) + 1;
    }
}
```

### [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

**🎯 考察频率：高 | 难度：简单 | 重要性：DFS + 递归对比**

> 给你一个二叉树的根节点 root ，检查它是否轴对称。

**💡 核心思路**：递归比较左右子树的镜像关系

```java
public boolean isSymmetric(TreeNode root) {
    if (root == null) return true;
    return check(root.left, root.right);
}

public boolean check(TreeNode left, TreeNode right) {
    // 都为空，对称
    if (left == null && right == null) return true;
    // 一个为空，不对称
    if (left == null || right == null) return false;
    // 值不等，不对称
    if (left.val != right.val) return false;
    
    // 递归检查：左的左 vs 右的右，左的右 vs 右的左
    return check(left.left, right.right) && check(left.right, right.left);
}
```

### [111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

**🎯 考察频率：中等 | 难度：简单 | 重要性：DFS边界处理**

> 给定一个二叉树，找出其最小深度。最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

**💡 核心思路**：DFS递归，注意单子树的情况

```java
public int minDepth(TreeNode root) {
    if (root == null) return 0;
    
    // 叶子节点
    if (root.left == null && root.right == null) return 1;
    
    // 只有右子树
    if (root.left == null) return minDepth(root.right) + 1;
    // 只有左子树  
    if (root.right == null) return minDepth(root.left) + 1;
    
    // 都有子树，取最小值
    return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
}
```

### [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

**🎯 考察频率：极高 | 难度：困难 | 重要性：DFS + 全局变量**

> 路径被定义为一条从树中任意节点出发，沿父节点-子节点连接，达到任意节点的序列。同一个节点在一条路径序列中至多出现一次。路径至少包含一个节点，且不一定经过根节点。

**💡 核心思路**：DFS后序遍历，维护全局最大值

```java
class Solution {
    private int maxSum = Integer.MIN_VALUE;
    
    public int maxPathSum(TreeNode root) {
        maxGain(root);
        return maxSum;
    }
    
    private int maxGain(TreeNode node) {
        if (node == null) return 0;
        
        // 递归计算左右子节点的最大贡献值
        // 只有在最大贡献值大于0时，才会选取对应子节点
        int leftGain = Math.max(maxGain(node.left), 0);
        int rightGain = Math.max(maxGain(node.right), 0);
        
        // 节点的最大路径和取决于该节点的值与该节点的左右子节点的最大贡献值
        int priceNewPath = node.val + leftGain + rightGain;
        
        // 更新答案
        maxSum = Math.max(maxSum, priceNewPath);
        
        // 返回节点的最大贡献值
        return node.val + Math.max(leftGain, rightGain);
    }
}
```

### [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

**🎯 考察频率：高 | 难度：中等 | 重要性：DFS + 分治**

> 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。

**💡 核心思路**：DFS分治，前序确定根，中序确定左右子树

```java
public TreeNode buildTree(int[] preorder, int[] inorder) {
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
    
    int rootVal = preorder[preStart];
    TreeNode root = new TreeNode(rootVal);
    
    int rootIndex = inorderMap.get(rootVal);
    int leftSize = rootIndex - inStart;
    
    root.left = build(preorder, preStart + 1, preStart + leftSize,
                     inorder, inStart, rootIndex - 1, inorderMap);
    root.right = build(preorder, preStart + leftSize + 1, preEnd,
                      inorder, rootIndex + 1, inEnd, inorderMap);
    
    return root;
}
```

### [538. 把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：DFS + 中序遍历变形**

> 给出二叉搜索树的根节点，该树的节点值各不相同，请你将其转换为累加树，使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。

**💡 核心思路**：反向中序遍历（右-根-左）

```java
class Solution {
    private int sum = 0;
    
    public TreeNode convertBST(TreeNode root) {
        traverse(root);
        return root;
    }
    
    private void traverse(TreeNode node) {
        if (node == null) return;
        
        traverse(node.right); // 先遍历右子树
        
        node.val += sum; // 更新当前节点值
        sum = node.val;  // 更新累加和
        
        traverse(node.left); // 再遍历左子树
    }
}
```

### [437. 路径总和 III](https://leetcode.cn/problems/path-sum-iii/)

**🎯 考察频率：高 | 难度：中等 | 重要性：DFS + 前缀和**

> 给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的路径的数目。

**💡 核心思路**：双重DFS，每个节点都可能是路径起点

```java
public int pathSum(TreeNode root, int targetSum) {
    if (root == null) return 0;
    
    // 以root为起点的路径数 + 左子树中的路径数 + 右子树中的路径数
    return dfs(root, targetSum) 
         + pathSum(root.left, targetSum)
         + pathSum(root.right, targetSum);
}

private int dfs(TreeNode node, long target) {
    if (node == null) return 0;
    
    int count = 0;
    if (node.val == target) count++;
    
    count += dfs(node.left, target - node.val);
    count += dfs(node.right, target - node.val);
    
    return count;
}
```

### 

---

## 四、回溯算法类（搜索所有可能）🔄

**💡 核心思想**

- **搜索空间遍历**：系统性地搜索所有可能的解
- **选择与回溯**：做选择→递归→撤销选择的三步骤
- **剪枝优化**：提前终止不可能产生解的分支
- **状态恢复**：确保每个选择互不影响

**🎯 必掌握模板**

```java
// 回溯算法标准模板
void backtrack(路径, 选择列表) {
    if (满足终止条件) {
        结果.add(new ArrayList<>(路径));
        return;
    }
    
    for (选择 : 选择列表) {
        // 做选择
        路径.add(选择);
        
        // 递归下一层
        backtrack(路径, 新的选择列表);
        
        // 撤销选择
        路径.remove(路径.size() - 1);
    }
}
```

### [46. 全排列](https://leetcode.cn/problems/permutations/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：回溯入门经典**

> 给定一个不含重复数字的数组 nums ，返回其所有可能的全排列。

**💡 核心思路**：回溯，维护已使用元素列表

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    
    backtrack(nums, path, used, res);
    return res;
}

private void backtrack(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path));
        return;
    }
    
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        
        path.add(nums[i]);
        used[i] = true;
        backtrack(nums, path, used, res);
        used[i] = false;
        path.remove(path.size() - 1);
    }
}
```

### [39. 组合总和](https://leetcode.cn/problems/combination-sum/)

**🎯 考察频率：高 | 难度：中等 | 重要性：回溯 + 剪枝**

> 给你一个无重复元素的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的所有不同组合。

**💡 核心思路**：回溯 + 剪枝，允许重复使用元素

```java
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> res = new ArrayList<>();
    Arrays.sort(candidates); // 排序便于剪枝
    backtrack(candidates, target, 0, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] nums, int remain, int start, List<Integer> path, List<List<Integer>> res) {
    if (remain == 0) {
        res.add(new ArrayList<>(path));
        return;
    }
    
    for (int i = start; i < nums.length; i++) {
        if (nums[i] > remain) break; // 剪枝
        
        path.add(nums[i]);
        backtrack(nums, remain - nums[i], i, path, res); // i不是i+1，允许重复
        path.remove(path.size() - 1);
    }
}
```

### [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：回溯 + 约束条件**

> 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且有效的括号组合。

**💡 核心思路**：回溯，维护左右括号数量约束

```java
public List<String> generateParenthesis(int n) {
    List<String> res = new ArrayList<>();
    backtrack(n, 0, 0, new StringBuilder(), res);
    return res;
}

private void backtrack(int n, int left, int right, StringBuilder sb, List<String> res) {
    if (sb.length() == 2 * n) {
        res.add(sb.toString());
        return;
    }
    
    if (left < n) {
        sb.append('(');
        backtrack(n, left + 1, right, sb, res);
        sb.deleteCharAt(sb.length() - 1);
    }
    
    if (right < left) {
        sb.append(')');
        backtrack(n, left, right + 1, sb, res);
        sb.deleteCharAt(sb.length() - 1);
    }
}
```

### [78. 子集](https://leetcode.cn/problems/subsets/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：回溯基础经典**

> 给你一个整数数组 nums ，数组中的元素互不相同。返回该数组所有可能的子集（幂集）。

**💡 核心思路**：回溯，每个元素选择加入或不加入

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path)); // 每个状态都是一个子集
    
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}
```

### [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

**🎯 考察频率：高 | 难度：中等 | 重要性：回溯 + 映射**

> 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按任意顺序返回。

**💡 核心思路**：回溯 + 哈希映射

```java
public List<String> letterCombinations(String digits) {
    List<String> res = new ArrayList<>();
    if (digits.length() == 0) return res;
    
    String[] mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    backtrack(digits, 0, new StringBuilder(), res, mapping);
    return res;
}

private void backtrack(String digits, int index, StringBuilder path, 
                      List<String> res, String[] mapping) {
    if (index == digits.length()) {
        res.add(path.toString());
        return;
    }
    
    String letters = mapping[digits.charAt(index) - '0'];
    for (char c : letters.toCharArray()) {
        path.append(c);
        backtrack(digits, index + 1, path, res, mapping);
        path.deleteCharAt(path.length() - 1);
    }
}
```

### [131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：回溯 + 预处理**

> 给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是回文串。返回 s 所有可能的分割方案。

**💡 核心思路**：回溯 + 动态规划预处理回文串

```java
public List<List<String>> partition(String s) {
    List<List<String>> res = new ArrayList<>();
    boolean[][] isPalindrome = preprocess(s);
    backtrack(s, 0, new ArrayList<>(), res, isPalindrome);
    return res;
}

private boolean[][] preprocess(String s) {
    int n = s.length();
    boolean[][] dp = new boolean[n][n];
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            if (s.charAt(i) == s.charAt(j) && (i - j <= 2 || dp[j + 1][i - 1])) {
                dp[j][i] = true;
            }
        }
    }
    return dp;
}

private void backtrack(String s, int start, List<String> path, 
                      List<List<String>> res, boolean[][] isPalindrome) {
    if (start == s.length()) {
        res.add(new ArrayList<>(path));
        return;
    }
    
    for (int end = start; end < s.length(); end++) {
        if (isPalindrome[start][end]) {
            path.add(s.substring(start, end + 1));
            backtrack(s, end + 1, path, res, isPalindrome);
            path.remove(path.size() - 1);
        }
    }
}
```

### [494. 目标和](https://leetcode.cn/problems/target-sum/)

**🎯 考察频率：高 | 难度：中等 | 重要性：DFS + 动态规划**

> 给你一个整数数组 nums 和一个整数 target。向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个表达式。返回可以通过上述方法构造的、运算结果等于 target 的不同表达式的数目。

**💡 核心思路**：DFS枚举所有可能，或转化为背包问题

```java
// 方法1：DFS回溯
public int findTargetSumWays(int[] nums, int target) {
    return dfs(nums, target, 0, 0);
}

private int dfs(int[] nums, int target, int index, int sum) {
    if (index == nums.length) {
        return sum == target ? 1 : 0;
    }
    
    return dfs(nums, target, index + 1, sum + nums[index])
         + dfs(nums, target, index + 1, sum - nums[index]);
}
```

---

## 六、图论算法类（关系网络处理）🔍

### [210. 课程表 II](https://leetcode.cn/problems/course-schedule-ii/)

**🎯 考察频率：高 | 难度：中等 | 重要性：DFS + 拓扑排序**

> 现在你总共有 numCourses 门课需要选，记为 0 到 numCourses - 1。给你一个数组 prerequisites ，其中 prerequisites[i] = [ai, bi] ，表示在选修课程 ai 前必须先选修 bi 。返回你为了学完所有课程所安排的学习顺序。

**💡 核心思路**：DFS + 后序遍历得到拓扑序列

```java
class Solution {
    private List<List<Integer>> graph;
    private int[] colors; // 0-白色, 1-灰色, 2-黑色
    private List<Integer> result;
    private boolean hasCycle = false;
    
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        graph = new ArrayList<>();
        colors = new int[numCourses];
        result = new ArrayList<>();
        
        // 构建邻接表
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] pre : prerequisites) {
            graph.get(pre[1]).add(pre[0]);
        }
        
        // DFS检测环并生成拓扑序列
        for (int i = 0; i < numCourses; i++) {
            if (colors[i] == 0) {
                dfs(i);
            }
        }
        
        if (hasCycle) return new int[0];
        
        Collections.reverse(result);
        return result.stream().mapToInt(i -> i).toArray();
    }
    
    private void dfs(int node) {
        colors[node] = 1; // 标记为正在访问
        
        for (int neighbor : graph.get(node)) {
            if (colors[neighbor] == 1) {
                hasCycle = true; // 发现环
                return;
            }
            if (colors[neighbor] == 0) {
                dfs(neighbor);
            }
        }
        
        colors[node] = 2; // 标记为已完成
        result.add(node); // 后序遍历添加到结果
    }
}
```

### [130. 被围绕的区域](https://leetcode.cn/problems/surrounded-regions/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：DFS + 边界处理**

> 给你一个 m x n 的矩阵 board ，由若干字符 'X' 和 'O' ，找到所有被 'X' 围绕的区域，并将这些区域里所有的 'O' 用 'X' 填充。

**💡 核心思路**：从边界开始DFS，标记不被围绕的'O'

```java
public void solve(char[][] board) {
    int m = board.length, n = board[0].length;
    
    // 从边界的'O'开始DFS，标记为'A'
    for (int i = 0; i < m; i++) {
        if (board[i][0] == 'O') dfs(board, i, 0);
        if (board[i][n-1] == 'O') dfs(board, i, n-1);
    }
    for (int j = 0; j < n; j++) {
        if (board[0][j] == 'O') dfs(board, 0, j);
        if (board[m-1][j] == 'O') dfs(board, m-1, j);
    }
    
    // 处理结果：'A'改回'O'，'O'改为'X'
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (board[i][j] == 'A') {
                board[i][j] = 'O';
            } else if (board[i][j] == 'O') {
                board[i][j] = 'X';
            }
        }
    }
}

private void dfs(char[][] board, int i, int j) {
    if (i < 0 || j < 0 || i >= board.length || j >= board[0].length || board[i][j] != 'O') {
        return;
    }
    
    board[i][j] = 'A'; // 标记为不被围绕
    
    dfs(board, i + 1, j);
    dfs(board, i - 1, j);
    dfs(board, i, j + 1);
    dfs(board, i, j - 1);
}
```

---

## 七、高级技巧类（优化与变形）🌟

### [139. 单词拆分](https://leetcode.cn/problems/word-break/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：DFS + 记忆化**

> 给你一个字符串 s 和一个字符串列表 wordDict，判断 s 是否可以由空格拆分为一个或多个在字典中出现的单词。

**💡 核心思路**：DFS + 记忆化搜索，或动态规划

```java
// 方法1：DFS + 记忆化
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    Boolean[] memo = new Boolean[s.length()];
    return dfs(s, 0, wordSet, memo);
}

private boolean dfs(String s, int start, Set<String> wordSet, Boolean[] memo) {
    if (start == s.length()) return true;
    if (memo[start] != null) return memo[start];
    
    for (int end = start + 1; end <= s.length(); end++) {
        String word = s.substring(start, end);
        if (wordSet.contains(word) && dfs(s, end, wordSet, memo)) {
            memo[start] = true;
            return true;
        }
    }
    
    memo[start] = false;
    return false;
}
```



## 🚀 DFS算法速记表

### 核心模板（必背）

```java
// 1. 基础DFS（四方向遍历）
void dfs(int[][] grid, int i, int j) {
    if (边界检查 || 访问检查) return;
    标记已访问;
    dfs(grid, i+1, j); dfs(grid, i-1, j);
    dfs(grid, i, j+1); dfs(grid, i, j-1);
}

// 2. 回溯算法模板
void backtrack(路径, 选择列表) {
    if (终止条件) { 收集结果; return; }
    for (选择 : 选择列表) {
        做选择; backtrack(参数); 撤销选择;
    }
}

// 3. 树的DFS模板
int dfs(TreeNode root) {
    if (root == null) return 默认值;
    int left = dfs(root.left);
    int right = dfs(root.right);
    return 处理当前节点(root, left, right);
}

// 4. 图的环检测模板（三色标记法）
boolean hasCycle(int node) {
    colors[node] = GRAY; // 正在访问
    for (neighbor : graph.get(node)) {
        if (colors[neighbor] == GRAY) return true; // 发现环
        if (colors[neighbor] == WHITE && hasCycle(neighbor)) return true;
    }
    colors[node] = BLACK; // 访问完成
    return false;
}
```

### 题型速查表

| 题型分类 | 核心技巧 | 高频题目 | 记忆口诀 | 难度 |
|----------|----------|----------|----------|------|
| **基础DFS** | 四方向遍历+标记 | 岛屿数量、单词搜索、被围绕的区域、岛屿最大面积 | 边界检查要仔细，标记访问防重复 | ⭐⭐⭐ |
| **树的DFS** | 前中后序遍历 | 最大深度、验证BST、二叉树直径、对称二叉树、路径总和 | 左右子树递归走，根据题意选时机 | ⭐⭐⭐ |
| **回溯算法** | 选择+回溯+剪枝 | 全排列、组合总和、括号生成、子集、电话号码字母组合 | 做选择，递归下，撤选择，要记下 | ⭐⭐⭐⭐ |
| **图论应用** | 三色标记法 | 课程表、课程表II、拓扑排序 | 白色未访问，灰色正在访，黑色已完成 | ⭐⭐⭐⭐⭐ |
| **高级技巧** | 记忆化+优化 | 单词拆分、二叉树最大路径和、目标和 | 记忆化搜索避重复，全局变量传信息 | ⭐⭐⭐⭐⭐ |

### 热题100 DFS完整清单

#### 🔥 基础DFS应用类（4题）
- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/) - DFS基础经典 ⭐⭐⭐
- [79. 单词搜索](https://leetcode.cn/problems/word-search/) - DFS + 回溯 ⭐⭐⭐⭐
- [130. 被围绕的区域](https://leetcode.cn/problems/surrounded-regions/) - 边界DFS ⭐⭐⭐
- [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/) - DFS计数 ⭐⭐⭐

#### 🌳 树的DFS应用类（9题）
- [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/) - DFS基础 ⭐⭐
- [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/) - DFS + 边界 ⭐⭐⭐⭐
- [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/) - DFS递归对比 ⭐⭐⭐
- [111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/) - DFS边界处理 ⭐⭐
- [437. 路径总和III](https://leetcode.cn/problems/path-sum-iii/) - 双重DFS ⭐⭐⭐⭐
- [543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/) - DFS信息传递 ⭐⭐⭐
- [538. 把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/) - 反向中序 ⭐⭐⭐
- [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/) - DFS + 全局变量 ⭐⭐⭐⭐⭐
- [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) - DFS分治 ⭐⭐⭐⭐

#### 🔄 回溯算法类（7题）
- [46. 全排列](https://leetcode.cn/problems/permutations/) - 回溯入门 ⭐⭐⭐⭐
- [78. 子集](https://leetcode.cn/problems/subsets/) - 回溯基础 ⭐⭐⭐⭐
- [39. 组合总和](https://leetcode.cn/problems/combination-sum/) - 回溯 + 剪枝 ⭐⭐⭐⭐
- [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/) - 回溯 + 约束 ⭐⭐⭐⭐
- [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/) - 回溯 + 映射 ⭐⭐⭐
- [131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/) - 回溯 + 预处理 ⭐⭐⭐⭐
- [494. 目标和](https://leetcode.cn/problems/target-sum/) - DFS枚举 ⭐⭐⭐⭐

#### 🔍 图论算法类（2题）
- [207. 课程表](https://leetcode.cn/problems/course-schedule/) - DFS环检测 ⭐⭐⭐⭐⭐
- [210. 课程表II](https://leetcode.cn/problems/course-schedule-ii/) - DFS拓扑排序 ⭐⭐⭐⭐⭐

#### 🌟 高级技巧类（1题）
- [139. 单词拆分](https://leetcode.cn/problems/word-break/) - DFS + 记忆化 ⭐⭐⭐⭐⭐

### 核心题目优先级（面试前重点复习）

**🏆 必须掌握（10题）**
1. **岛屿数量** - DFS基础，四方向遍历模板
2. **单词搜索** - DFS + 回溯，状态恢复经典
3. **全排列** - 回溯算法入门，选择与撤销
4. **验证二叉搜索树** - 树的DFS + 边界控制
5. **二叉树的最大深度** - 树的DFS最简单应用
6. **括号生成** - 回溯 + 约束条件
7. **课程表** - 图环检测，三色标记法
8. **组合总和** - 回溯 + 剪枝优化
9. **对称二叉树** - 递归对比经典
10. **子集** - 回溯所有可能解

**⚡ 进阶强化（13题）**
- 二叉树的直径、路径总和III、岛屿最大面积
- 电话号码字母组合、分割回文串、目标和
- 被围绕的区域、课程表II、单词拆分
- 二叉树中的最大路径和、从前序中序构造二叉树
- 把二叉搜索树转换为累加树、二叉树的最小深度

### 常见陷阱提醒

- ⚠️ **忘记标记访问**：DFS遍历图时必须标记已访问节点，防止无限循环
- ⚠️ **回溯忘记恢复**：回溯时必须撤销之前的选择，确保状态独立
- ⚠️ **边界条件错误**：数组越界、空树处理、单子树情况要仔细
- ⚠️ **重复计算**：可以考虑记忆化搜索优化，特别是树的问题
- ⚠️ **栈溢出**：深度过大时考虑改用迭代实现或优化递归
- ⚠️ **三色标记混乱**：图的环检测要正确使用WHITE、GRAY、BLACK三种状态

### 时间复杂度总结

- **基础DFS遍历**：O(V + E) - V为节点数，E为边数
- **矩阵DFS**：O(MN) - M×N矩阵，每个格子最多访问一次
- **回溯算法**：O(N!) ~ O(2^N) - 取决于解空间大小
- **树的DFS**：O(N) - N为树的节点数
- **图的环检测**：O(V + E) - 每个节点和边最多访问一次

**最重要的一个技巧就是，你得行动，写起来**
