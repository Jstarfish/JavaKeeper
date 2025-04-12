---
title: DFS 通关秘籍
date: 2025-04-08
tags: 
 - DFS
categories: leetcode
---

![Depth First Search — DFS Algorithm](https://miro.medium.com/v2/resize:fit:1400/1*nMRjmPilq9qeoP09ou2syA.jpeg)

> 文章将围绕以下内容展开：
>
> 1. **DFS 算法简介与核心思想**
> 2. **DFS 常见应用场景**
> 3. **经典解题套路**
> 4. **LeetCode 热题示例与题解**
> 5. **总结与建议**
>
> 希望能帮助你更好地理解和运用 DFS 算法。

## 一、DFS 算法简介与核心思想

### 1. 什么是 DFS

- **DFS（深度优先搜索）** 是一种用于遍历或搜索图、树的算法。其核心策略是尽可能深地探索每个分支，直到无法继续再回溯探索其他分支。
- 与 BFS 的“广度优先”不同，DFS 以“深度”为优先，适合寻找所有可能路径或解决回溯问题。

### 2. 核心思想

- **递归或栈实现**：通过递归隐式利用系统栈，或显式使用栈数据结构。
- **标记与回溯**：访问节点后标记防止重复，搜索到底后回溯到分叉点继续其他分支。
- 核心步骤：
  1. 访问当前节点。
  2. 递归访问相邻未访问节点。
  3. 回溯并重复。

### 3. 复杂度分析

- **时间复杂度**：通常为 $O(N)$ 或 $O(N+M)$（N 为节点数，M 为边数）。
- **空间复杂度**：空间复杂度通常与递归深度或栈的大小相关，最坏情况 $O(N)$（如链表结构）。



## 二、DFS 常见应用场景

1. **图的连通性检测**：如岛屿数量、被围绕的区域、判断图中是否存在一条路径、寻找连通分量、二叉树遍历等。
2. **回溯问题**：组合、排列、子集、分割、数独、八皇后等。
3. **树的相关问题**：路径和、验证二叉搜索树、序列化等。
4. **矩阵搜索问题**：单词搜索、黄金矿工问题。
5. **拓扑排序与环检测**：课程表问题。



## 三、经典解题套路

1. 递归函数设计

   - **参数**：当前状态（如坐标、路径、当前和）。
   - **终止条件**：边界越界、搜到目标、或无路可走时。
   - **递归方向**：明确下一步可能的方向（如四邻、子节点），还有返回值，有时需要返回布尔值（是否找到解决方案），有时需要返回路径或全局状态。

2. 回溯框架

   ```java
   void backtrack(路径, 选择列表) {
       if (满足终止条件) {
           加入结果集;
           return;
       }
       for (选择 : 选择列表) {
           做选择;
           backtrack(新路径, 新选择列表);
           撤销选择;
       }
   }
   ```

3. 剪枝优化

   - 提前终止不符合条件的分支（如组合总和去重）。
   - 记忆化搜索避免重复计算。



## 四、LeetCode 热题示例与题解

> [leetcode深度优先搜索专题](https://leetcode.cn/problem-list/depth-first-search/)

### 4.1 基础 DFS 应用

#### [岛屿数量『200』](https://leetcode.cn/problems/number-of-islands/)

> 给你一个由 `'1'`（陆地）和 `'0'`（水）组成的的二维网格，请你计算网格中岛屿的数量。
>
> 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
>
> 此外，你可以假设该网格的四条边均被水包围。![](https://pic.leetcode-cn.com/c36f9ee4aa60007f02ff4298bc355fd6160aa2b0d628c3607c9281ce864b75a2.jpg)
>
> ```
> 输入：grid = [
>   ["1","1","1","1","0"],
>   ["1","1","0","1","0"],
>   ["1","1","0","0","0"],
>   ["0","0","0","0","0"]
> ]
> 输出：1
> ```

**思路**：

- 遍历网格，遇到未访问的`'1'`时启动DFS，将该岛屿所有相连陆地标记为已访问。
- **标记方式**：直接修改原数组（如`'1'`→`'0'`），或使用独立`visited`数组

```java
public Class Soultion{
  public int numIslands(char[][] grid) {
    int count = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            //如果当前是陆地，才开始一次DFS遍历
            if (grid[i][j] == '1') {
                dfs(grid, i, j);
                count++;
            }
        }
    }
    return count;
 }	

  private void dfs(char[][] grid, int r, int c) {
       // 判断 base case
      // 检查边界条件和当前位置是否为陆地
      if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;
      //将当前位置标记为已访问
      grid[r][c] = '0'; // 淹没陆地
      // 访问上、下、左、右四个相邻结点
      dfs(grid, r + 1, c);
      dfs(grid, r - 1, c);
      dfs(grid, r, c + 1);
      dfs(grid, r, c - 1);
  }
}

---单测
@Test
public void testNumIslands_singleIsland() {
    char[][] grid = {
            {'1', '1', '1', '1', '0'},
            {'1', '1', '0', '1', '0'},
            {'1', '1', '0', '0', '0'},
            {'0', '0', '0', '0', '0'}
    };
    DfsSolution solution = new DfsSolution();
    int result = solution.numIslands(grid);
    assertEquals(1, result);
}
```

- **复杂度**：时间 $O(MN)$，空间 $O(MN)$（递归栈）。

> [岛屿问题一网打尽](https://leetcode.cn/problems/number-of-islands/solutions/211211/dao-yu-lei-wen-ti-de-tong-yong-jie-fa-dfs-bian-li-/?envType=problem-list-v2&envId=depth-first-search)

#### [单词搜索『79』](https://leetcode.cn/problems/word-search/)

> 给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word` 。如果 `word` 存在于网格中，返回 `true` ；否则，返回 `false` 。
>
> 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
>
> ![img](https://assets.leetcode.com/uploads/2020/11/04/word2.jpg)
>
> ```
> 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
> 输出：true
> ```

思路：本问题是典型的回溯问题，需要使用**深度优先搜索（DFS）+ 剪枝**解决。

**DFS 思路**：从每个起点出发，四方向搜索匹配字符，回溯恢复现场。

```java
public boolean exist(char[][] board, String word) {
    // 遍历网格中的每一个单元格作为起始点
    for (int i = 0; i < board.length; i++) {
        for (int j = 0; j < board[0].length; j++) {
            // 注意：此处缺少首字符过滤，会进入不必要的递归，但最终结果正确
            if (dfs(board, word, 0, i, j)) 
                return true; // 找到路径立即返回
        }
    }
    return false; // 全部遍历后仍未找到
}

/**
 * 深度优先搜索核心方法
 * @param board 二维字符网格
 * @param word 目标单词
 * @param idx 当前需要匹配的字符索引
 * @param r 当前行坐标
 * @param c 当前列坐标
 * @return 是否找到有效路径
 */
private boolean dfs(char[][] board, String word, int idx, int r, int c) {
    // 成功条件：已匹配完所有字符
    if (idx == word.length()) return true;
    
    // 边界检查 + 剪枝（当前字符不匹配）
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length 
        || board[r][c] != word.charAt(idx)) 
        return false;
    
    // 标记已访问（防止重复使用）
    char tmp = board[r][c];
    board[r][c] = '#'; 
    
    // 向四个方向递归搜索（顺序：下、上、右、左）
    boolean res = dfs(board, word, idx + 1, r + 1, c)  // 向下
               || dfs(board, word, idx + 1, r - 1, c)  // 向上
               || dfs(board, word, idx + 1, r, c + 1)  // 向右
               || dfs(board, word, idx + 1, r, c - 1); // 向左
    
    // 回溯：恢复现场，让其他路径能重新访问该节点
    board[r][c] = tmp;
    
    return res;
}
```

- **复杂度**：时间 $O(mn × 3ᴸ)$，空间 $O(L)$（L 为单词长度）。



### 4.2 树相关 DFS 问题

#### [二叉树的最大深度『104』](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

> 给定一个二叉树，找出其最大深度。
>
> 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
>
> 说明: 叶子节点是指没有子节点的节点。
>
> ```text
> 给定二叉树 [3,9,20,null,null,15,7]，
> 			 3
> 			/ \
> 		 9  20
> 			 /  \
> 			15   7
> 返回它的最大深度 3 
> ```

思路：深度优先搜索

```java
public int maxDepth(TreeNode root) {
  if (root == null) {
    return 0;
  } 
    int leftHeight = maxDepth(root.left);
    int rightHeight = maxDepth(root.right);
    return Math.max(leftHeight, rightHeight) + 1;
}
```



#### [ 二叉树的最小深度『111』](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

> 给定一个二叉树，找出其最小深度。
>
> 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

```java
public int minDepth(TreeNode root) {
    //处理空树
    if (root == null) return 0;
    //如果当前节点是叶子节点，返回深度1
    if (root.left == null && root.right == null) return 1;
    //递归计算左右子树最小深度
    if (root.left == null) return minDepth(root.right) + 1;
    if (root.right == null) return minDepth(root.left) + 1;
    return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
}
```



#### [对称二叉树『101 』](https://leetcode-cn.com/problems/symmetric-tree/)

> 给定一个二叉树，检查它是否是镜像对称的。
>
> 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
>
> ![img](https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg)

**思路**：递归的思想，画个图左右左右比较

```java
public boolean isSymmetric(TreeNode root){
  if(root == null){
    return true;
  }
  //调用递归函数，比较左节点，右节点
  return check(root.left,root.right);
}

public boolean check(TreeNode left,TreeNode right){
  //递归的终止条件是两个节点都为空,必须先判断这个，确保都为null
  //或者两个节点中有一个为空
  //或者两个节点的值不相等
  if(left==null && right==null){
    return true;
  }
  if(left == null || right == null){
    return false;
  }
  return left.val == right.val && check(left.left,right.right) && check(left.right,right.left);
}
```



#### [验证二叉搜索树『98』](https://leetcode.cn/problems/validate-binary-search-tree/)

> **问题描述**：判断二叉树是否满足 BST 性质。
>
> **有效** 二叉搜索树定义如下：
>
> - 节点的左子树只包含 **小于** 当前节点的数。
> - 节点的右子树只包含 **大于** 当前节点的数。
> - 所有左子树和右子树自身必须也是二叉搜索树。

思路：**DFS 思路**：我们可以在遍历的过程中维护一个范围（最大值到最小值），并检查每个节点的值是否落在这个范围内。

- 代码实现：

  ```java
  public boolean isValidBST(TreeNode root) {
      return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
  }
  
  private boolean validate(TreeNode node, long min, long max) {
      //叶子结点为空，说明不违反BST性质，true
      if (node == null) return true;
      //当前节点小于等于最小值或大于等于最大值，不满足
      if (node.val <= min || node.val >= max) return false;
      //递归左右子树，左子树的话，传递当前值为最大值，这里要用 && 且
      return validate(node.left, min, node.val) 
          && validate(node.right, node.val, max);
  }
  ```

- **复杂度**：时间 $O(N)$，空间 $O(N)$（递归栈）。



#### [路径总和 III『437』](https://leetcode.cn/problems/path-sum-iii/)

- **问题描述**：找出二叉树中路径和等于目标值的路径数量（路径无需从根开始）。

- **DFS 思路**：双递归——外层遍历所有节点，内层计算以当前节点为起点的路径和。

- 代码实现：

  ```java
  public int pathSum(TreeNode root, int targetSum) {
      if (root == null) return 0;
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

- **复杂度**：时间 $O(N^2)$，空间 $O(N)$。

### 4.3 回溯算法经典问题

#### [全排列『46』](https://leetcode.cn/problems/permutations/description/)

- **问题描述**：给定不含重复数字的数组，返回所有可能的全排列。

- **回溯思路**：递归交换元素，维护已选元素列表。

- 代码实现：

  ```java
  public List<List<Integer>> permute(int[] nums) {
      List<List<Integer>> res = new ArrayList<>();
      backtrack(nums, new ArrayList<>(), res);
      return res;
  }
  
  private void backtrack(int[] nums, List<Integer> path, List<List<Integer>> res) {
      if (path.size() == nums.length) {
          res.add(new ArrayList<>(path));
          return;
      }
      for (int num : nums) {
          if (path.contains(num)) continue; // 已选则跳过
          path.add(num);
          backtrack(nums, path, res);
          path.remove(path.size() - 1);
      }
  }
  ```

- **复杂度**：时间 O(N·N!)，空间 O(N)。

#### [ 组合总和『39』](https://leetcode.cn/problems/combination-sum/)

- **问题描述**：找出数组中所有和为 target 的组合（元素可重复使用）。

- **回溯思路**：排序后剪枝，避免重复组合。

- 代码实现：

  ```java
  public List<List<Integer>> combinationSum(int[] candidates, int target) {
      Arrays.sort(candidates);
      List<List<Integer>> res = new ArrayList<>();
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
          backtrack(nums, remain - nums[i], i, path, res); // 允许重复
          path.remove(path.size() - 1);
      }
  }
  ```

- **复杂度**：时间 O(N^(T/M + 1))（T 为 target，M 为最小元素），空间 O(T/M)。

#### [子集『78』](https://leetcode.cn/problems/subsets/)

- **问题描述**：返回数组所有可能的子集。

- **回溯思路**：每个元素有选与不选两种选择，递归构建所有可能。

- 代码实现：

  ```java
  public List<List<Integer>> subsets(int[] nums) {
      List<List<Integer>> res = new ArrayList<>();
      backtrack(nums, 0, new ArrayList<>(), res);
      return res;
  }
  
  private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
      res.add(new ArrayList<>(path));
      for (int i = start; i < nums.length; i++) {
          path.add(nums[i]);
          backtrack(nums, i + 1, path, res);
          path.remove(path.size() - 1);
      }
  }
  ```

- **复杂度**：时间 O(N·2^N)，空间 O(N)。

### 4.4 其他经典问题

#### [括号生成『22』](https://leetcode.cn/problems/generate-parentheses/)

- **问题描述**：生成所有有效的 n 对括号组合。

- **回溯思路**：维护左右括号数量，确保左括号数 ≥ 右括号数。

- 代码实现：

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

- **复杂度**：时间 O(4^N/√N)，空间 O(N)。



#### [课程表『207』](https://leetcode.cn/problems/course-schedule/)

> 你这个学期必须选修 `numCourses` 门课程，记为 `0` 到 `numCourses - 1` 。
>
> 在选修某些课程之前需要一些先修课程。 先修课程按数组 `prerequisites` 给出，其中 `prerequisites[i] = [ai, bi]` ，表示如果要学习课程 `ai` 则 **必须** 先学习课程 `bi` 。
>
> - 例如，先修课程对 `[0, 1]` 表示：想要学习课程 `0` ，你需要先完成课程 `1` 。
>
> 请你判断是否可能完成所有课程的学习？如果可以，返回 `true` ；否则，返回 `false` 。
>
> ```
> 输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
> 输出：false
> 解释：总共有 2 门课程。学习课程 1 之前，你需要先完成 课程 0 ；并且学习课程 0 之前，你还应先完成课程 1 。这是不可能的。
> ```

思路：要检测有向图中的环，我们可以使用DFS遍历图，并记录访问状态。在遍历过程中，如果我们遇到一个已经访问过的节点，并且它不是当前节点的父节点（在递归调用中），那么我们就找到了一个环。

```java
public class Solution {
    private boolean hasCycle = false;

    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // 构建图的邻接表表示
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] prerequisite : prerequisites) {
            int course = prerequisite[0];
            int prerequisiteCourse = prerequisite[1];
            graph.get(prerequisiteCourse).add(course);
        }

        // 初始化访问状态数组
        boolean[] visited = new boolean[numCourses];
        boolean[] recursionStack = new boolean[numCourses];

        // 对每个节点进行DFS遍历
        for (int i = 0; i < numCourses; i++) {
            if (!visited[i]) {
                dfs(graph, visited, recursionStack, i);
            }
            // 如果在DFS过程中检测到了环，则提前返回false
            if (hasCycle) {
                return false;
            }
        }

        // 如果没有检测到环，则返回true
        return true;
    }

    private void dfs(List<List<Integer>> graph, boolean[] visited, boolean[] recursionStack, int node) {
        // 将当前节点标记为已访问
        visited[node] = true;
        // 将当前节点加入递归栈
        recursionStack[node] = true;

        // 遍历当前节点的所有邻接节点
        for (int neighbor : graph.get(node)) {
            // 如果邻接节点未被访问，则递归访问
            if (!visited[neighbor]) {
                dfs(graph, visited, recursionStack, neighbor);
            } else if (recursionStack[neighbor]) {
                // 如果邻接节点已经在递归栈中，说明存在环
                hasCycle = true;
            }
        }

        // 将当前节点从递归栈中移除
        recursionStack[node] = false;
    }
}
```



#### [目标和『494』](https://leetcode.cn/problems/target-sum/)

- **问题描述**：向数组中的每个数前添加 '+' 或 '-'，使得总和等于 target。

- **DFS 思路**：递归枚举所有符号组合，计算和。

- **代码优化**：记忆化搜索或动态规划（此处给出回溯代码）。

- 代码实现：

  ```java
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

- **复杂度**：时间 O(2^N)，空间 O(N)。



- **LeetCode 130. 被围绕的区域 (Surrounded Regions)**
- **LeetCode 417. 太平洋大西洋水流问题 (Pacific Atlantic Water Flow)**
- **LeetCode 417. 单词拆分 II (Word Break II)**【结合回溯】
- **LeetCode 301. 删除无效的括号 (Remove Invalid Parentheses)**【回溯】
- **LeetCode 543. 二叉树的直径 (Diameter of Binary Tree)**【DFS + 后序计算】
- ……

这些都可以通过 DFS 思路去解决。熟练掌握 DFS 对于处理各种图、树、回溯类问题都非常关键。



**附：LeetCode 热题 100 DFS 题目列表**

- 基础应用：200, 79, 695
- 树问题：98, 101, 104, 105, 114, 124, 226, 236, 437, 538
- 回溯问题：17, 22, 39, 46, 78, 131, 301, 494
- 图与拓扑排序：207, 210



## 五、总结与建议

1. **掌握模板，灵活应用**：DFS 与回溯的框架高度相似，需熟记核心步骤。
2. **画图分析递归树**：复杂问题通过画递归树理解选择与剪枝。
3. 注重“标记访问”：如果是网格/图，一定要及时标记已访问的节点，防止无限循环
4. **注意剪枝与优化**：合理剪枝可大幅降低时间复杂度（如组合总和排序后剪枝）。
5. **多维度练习**：从树、图到回溯问题，覆盖不同场景提升适应性。
6. 和其他算法结合：DFS 常与 **动态规划**、**二分**、**剪枝** 等技巧配合使用，解决更复杂的题目
7. 实战技巧：
   - 树问题多用后序遍历获取子树信息。
   - 回溯问题注意去重条件（如子集 II 需跳过重复元素）。
   - 矩阵问题标记已访问防止循环。
   - 熟练后可以灵活变通，一些问题 DFS/BFS 皆可，需要根据题目要求（最短路径常用 BFS，搜索所有路径常用 DFS）



### 对刷题同学的建议

- 挑选 **“网格 DFS”** 类题目（如岛屿数量、被围绕的区域）和 **“树 DFS”** 类题目（如验证二叉搜索树、二叉树的所有路径）先上手。
- 做 **“回溯”** 类题目（组合、排列、子集、分割等），培养对回溯过程的理解。
- 难度更高的题（如删除无效括号、组合总和 II、单词拆分 II 等）都可以在熟悉回溯后轻松应对。



## 结语

**DFS** 作为基础的搜索算法，几乎每个算法学习者都会频繁接触。它在图论、树结构、回溯求解等方向都有极其广泛的应用。希望这篇文章能帮助你建立清晰的 DFS 知识体系，同时结合 **LeetCode 热题**深入理解和练习。

如果你在学习或刷题过程中遇到任何疑问，欢迎在评论区留言讨论。记得多动手写代码、调试、总结自己的思路与套路，相信经过一定的量变积累后，你定能在面试或实际项目中得心应手！
