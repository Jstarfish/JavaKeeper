文章将围绕以下内容展开：

1. **DFS 算法简介与核心思想**
2. **DFS 常见应用场景**
3. **经典解题套路**
4. **LeetCode 热题示例与题解**
5. **总结与建议**

希望能帮助你更好地理解和运用 DFS 算法。

------

## 一、DFS 算法简介与核心思想

### 1. 什么是 DFS

- **DFS（Depth First Search）** 即**深度优先搜索**，是一种对图或树进行搜索和遍历的常用策略。
- 它的基本思路是：**从一个起点出发，尽可能深地搜索路径，直到无法继续再回溯到上一个节点**，继续未搜索的分支。

### 2. 核心思想

- 采用 **“递归”** 或 **“栈”** 实现。

- 先“深入”（explore）到某个分支的尽头，再回溯（backtrack）到分叉点，继续探索其他分支。

- 关键要点

  ：

  1. **标记已访问**（防止重复访问）。
  2. **回溯**（返回到上一层继续搜索其他未访问的路径）。

### 3. 时间复杂度与空间复杂度

- 对于 **图或树** 的 **DFS**，常见情况下时间复杂度是 **O(V+E)**（V 为节点数，E 为边数）。
- 如果是遍历一棵 **二叉树**，时间复杂度通常 **O(n)**。
- 空间复杂度通常与递归深度或栈的大小相关，最坏情况下可达 **O(n)**（如链式结构）。

------

## 二、DFS 常见应用场景

1. 图/树的遍历与连通性判断
   - 例如：判断图中是否存在一条路径、寻找连通分量、二叉树遍历等。
2. 回溯搜索
   - 例如：组合问题、排列问题、子集问题、数独、八皇后等。
3. 路径问题
   - 例如：在网格/图上寻找特定路径，或求最短/最长路径（可与 BFS、Dijkstra、A* 等其他算法配合）。
4. 拓扑排序（配合有向无环图）
   - 先 DFS 判断有无环，再进行逆后序输出拓扑序。
5. 树形动态规划的访问顺序
   - 先 DFS 以获取子树信息，再进行状态计算。

------

## 三、经典解题套路

1. **递归函数设计**
   - **函数参数**：记录当前位置，或已经搜索到的路径信息等。
   - **返回值**：有时需要返回布尔值（是否找到解决方案），有时需要返回路径或全局状态。
   - **递归结束条件**：边界越界、搜到目标、或无路可走时。
2. **回溯（Backtracking）**
   - 在当前路径做出某个**选择**，继续向下递归；若发现该选择无法满足要求，则**撤销**选择，回到上一层做别的选择。
   - 常见于 **组合/排列/子集/分割** 等问题。
3. **标记访问（visited 或 path）**
   - 在图或二维网格中，使用辅助数组 visited  或在当前节点做标记，以防走回头路（避免无限循环）。
4. **全局/局部变量**
   - 全局变量可用于记录**最终答案**或**最大/最小值**；局部变量在进入下一个递归栈时更新，在回溯时还原。

------

## 四、LeetCode 热题示例与题解

以下列举几个 LeetCode 热度较高、具有代表性的题目，简要说明题意与 DFS 解法思路，并给出部分核心代码或伪代码示例。你可以在正式代码中进行适配和完善。

### 1. **LeetCode 200. 岛屿数量 (Number of Islands)**

- **题意简述**：给你一个由 '1'（陆地）和 '0'（水）组成的二维网格，统计网格中岛屿的数量。岛屿被水包围，且同一岛屿中的土地可在水平方向或垂直方向上相连。

- DFS 思路

  ：

  1. 遍历二维网格，遇到 '1'（陆地）时岛屿数+1，并启动 DFS。
  2. DFS 会将与之相连的所有陆地标记为已访问，防止重复计数。
  3. 继续遍历下一个未访问的陆地。

- 核心伪代码

  ：

  ```
  java
  
  
  复制编辑
  int numIslands(char[][] grid) {
      int count = 0;
      for (int i = 0; i < grid.length; i++) {
          for (int j = 0; j < grid[0].length; j++) {
              if (grid[i][j] == '1') {
                  count++;
                  dfs(grid, i, j);  // 将连通的所有 '1' 变为 '0'
              }
          }
      }
      return count;
  }
  
  void dfs(char[][] grid, int r, int c) {
      // 判断边界
      if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
      if (grid[r][c] == '0') return;
      
      // 将当前陆地置为 '0'（标记访问）
      grid[r][c] = '0';
      
      // 四个方向搜索
      dfs(grid, r + 1, c);
      dfs(grid, r - 1, c);
      dfs(grid, r, c + 1);
      dfs(grid, r, c - 1);
  }
  ```

- **时间复杂度**：O(m * n)

- **空间复杂度**：O(m * n)（递归深度 & visited 标记）

------

### 2. **LeetCode 79. 单词搜索 (Word Search)**

- **题意简述**：给定一个字符网格 `board` 和一个字符串 `word`，判断 `word` 是否可以**按顺序**通过连续相邻（上下左右）的字母组成。

- DFS + 回溯思路

  ：

  1. 从网格中每个字符作为起点，若与 `word[0]` 匹配就启动 DFS。
  2. DFS 过程中，如果当前位置字符与 `word[index]` 匹配，则继续对四邻搜索 `word[index+1]`。
  3. 若某一步不匹配或越界，则回溯。
  4. 若成功匹配到 `word` 最后一个字符，返回 true。

- 核心伪代码

  ：

  ```
  java
  
  
  复制编辑
  boolean exist(char[][] board, String word) {
      for (int i = 0; i < board.length; i++) {
          for (int j = 0; j < board[0].length; j++) {
              if (dfs(board, word, 0, i, j)) {
                  return true;
              }
          }
      }
      return false;
  }
  
  boolean dfs(char[][] board, String word, int index, int r, int c) {
      // 判断越界或不匹配
      if (r < 0 || c < 0 || r >= board.length || c >= board[0].length 
          || board[r][c] != word.charAt(index)) {
          return false;
      }
      // 若 index 到达 word 末尾，说明全部匹配成功
      if (index == word.length() - 1) {
          return true;
      }
  
      // 做“访问”标记，避免重复使用
      char temp = board[r][c];
      board[r][c] = '#';
      
      // 四个方向继续搜索
      boolean res = dfs(board, word, index + 1, r + 1, c)
                 || dfs(board, word, index + 1, r - 1, c)
                 || dfs(board, word, index + 1, r, c + 1)
                 || dfs(board, word, index + 1, r, c - 1);
      
      // 回溯：恢复现场
      board[r][c] = temp;
      return res;
  }
  ```

- **时间复杂度**：最坏情况下 O(m * n * 4^k)（k 为字符串长度）

- **空间复杂度**：O(k)（递归深度）

------

### 3. **LeetCode 98. 验证二叉搜索树 (Validate Binary Search Tree)**

- **题意简述**：判断给定的二叉树是否是一棵有效的二叉搜索树（BST）。BST 的定义：节点的左子树只包含**小于**节点值的节点，右子树只包含**大于**节点值的节点，且左右子树都必须是 BST。

- DFS + 区间判断思路

  ：

  1. 对每个节点在递归中传入一个区间 [min, max]，表示当前节点必须满足 `min < node.val < max`。
  2. 若节点不在该区间内，则返回 false。
  3. 递归调用左子树时，**上界**变为 `node.val`；递归调用右子树时，**下界**变为 `node.val`。

- 核心伪代码

  ：

  ```
  java
  
  
  复制编辑
  boolean isValidBST(TreeNode root) {
      return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
  }
  
  boolean validate(TreeNode node, long min, long max) {
      if (node == null) return true;
      if (node.val <= min || node.val >= max) {
          return false;
      }
      return validate(node.left, min, node.val)
          && validate(node.right, node.val, max);
  }
  ```

- **时间复杂度**：O(n)

- **空间复杂度**：O(n)（递归栈）

------

### 4. **LeetCode 257. 二叉树的所有路径 (Binary Tree Paths)**

- **题意简述**：给你一棵二叉树，返回所有从根节点到叶子节点的路径列表。

- DFS 思路

  ：

  1. 从根节点出发，使用 DFS 路径搜索，将当前节点加入路径字符串。
  2. 当到达叶子节点时（左右子树均为空），将路径加入结果集。
  3. 回溯时需要恢复路径（可通过字符串拼接或使用 StringBuilder）。

- 核心伪代码

  ：

  ```
  java
  
  
  复制编辑
  List<String> binaryTreePaths(TreeNode root) {
      List<String> paths = new ArrayList<>();
      if (root != null) {
          dfs(root, "", paths);
      }
      return paths;
  }
  
  void dfs(TreeNode node, String path, List<String> paths) {
      // path 先加上当前节点
      path += node.val;
      // 如果是叶子节点，直接加入结果
      if (node.left == null && node.right == null) {
          paths.add(path);
          return;
      }
      // 非叶子节点，继续向下搜索
      if (node.left != null) {
          dfs(node.left, path + "->", paths);
      }
      if (node.right != null) {
          dfs(node.right, path + "->", paths);
      }
  }
  ```

- **时间复杂度**：O(n)

- **空间复杂度**：O(n)

------

### 5. 其他常见 DFS 场景

- **LeetCode 130. 被围绕的区域 (Surrounded Regions)**
- **LeetCode 417. 太平洋大西洋水流问题 (Pacific Atlantic Water Flow)**
- **LeetCode 417. 单词拆分 II (Word Break II)**【结合回溯】
- **LeetCode 301. 删除无效的括号 (Remove Invalid Parentheses)**【回溯】
- **LeetCode 543. 二叉树的直径 (Diameter of Binary Tree)**【DFS + 后序计算】
- ……

这些都可以通过 DFS 思路去解决。熟练掌握 DFS 对于处理各种图、树、回溯类问题都非常关键。

------

## 五、总结与建议

1. 熟悉递归写法
   - 多写几个 DFS 模板，用在网格、图、树等不同场景中，训练“递归思维”。
2. 注重“标记访问”
   - 如果是网格/图，一定要及时标记已访问的节点，防止无限循环。
3. 回溯思想是 DFS 的灵魂
   - 在做组合、排列、子集等题目时，一定要注意**选择-撤销-继续**的过程。
4. 熟练后可以灵活变通
   - 一些问题 DFS/BFS 皆可，需要根据题目要求（最短路径常用 BFS，搜索所有路径常用 DFS）。
5. 和其他算法结合
   - DFS 常与 **动态规划**、**二分**、**剪枝** 等技巧配合使用，解决更复杂的题目。

### 对刷题同学的建议

- 挑选 **“网格 DFS”** 类题目（如岛屿数量、被围绕的区域）和 **“树 DFS”** 类题目（如验证二叉搜索树、二叉树的所有路径）先上手。
- 做 **“回溯”** 类题目（组合、排列、子集、分割等），培养对回溯过程的理解。
- 难度更高的题（如删除无效括号、组合总和 II、单词拆分 II 等）都可以在熟悉回溯后轻松应对。

------

## 结语

**DFS** 作为基础的搜索算法，几乎每个算法学习者都会频繁接触。它在图论、树结构、回溯求解等方向都有极其广泛的应用。希望这篇文章能帮助你建立清晰的 DFS 知识体系，同时结合 **LeetCode 热题**深入理解和练习。

如果你在学习或刷题过程中遇到任何疑问，欢迎在评论区留言讨论。记得多动手写代码、调试、总结自己的思路与套路，相信经过一定的量变积累后，你定能在面试或实际项目中得心应手！

> **公众号/博客：**
> 喜欢的话，请帮忙**点赞**、**收藏**、或**一键三连**哦！这是对作者最大的支持！让我们一起加油吧！

祝各位学有所成，面试顺利！
