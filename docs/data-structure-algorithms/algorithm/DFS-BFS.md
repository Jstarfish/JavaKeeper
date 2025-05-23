---
title: DFS 与 BFS
date: 2025-03-09
tags: 
 - Algorithm
categories: BFS DFS
---

![](https://images.pexels.com/photos/3769697/pexels-photo-3769697.jpeg?auto=compress&cs=tinysrgb&w=1200)

> 在线性结构中，按照顺序一个一个地看到所有的元素，称为线性遍历。在非线性结构中，由于元素之间的组织方式变得复杂，就有了不同的遍历行为。其中最常见的遍历有：**深度优先遍历**（Depth-First-Search）和**广度优先遍历**（Breadth-First-Search）。它们的思想非常简单，但是在算法的世界里发挥着巨大的作用，也是面试高频考点。
>

「遍历」和「搜索」可以看作是两个等价概念，通过遍历 **所有** 的可能的情况达到搜索的目的。遍历是手段，搜索是目的。因此「优先遍历」也叫「优先搜索」。



## 一、DFS 与 BFS的核心原理

![](https://img.starfish.ink/leetcode/DFS%20AND%20BFS.png)

1. **DFS（深度优先搜索）**

   - 核心思想：优先沿一条路径深入探索，直到无法继续再回溯到上一个节点继续搜索，类似“不撞南墙不回头”。
   - **适用场景**：寻找所有可能路径、拓扑排序、连通性问题等。
   - **实现方式**：递归（隐式栈）或显式栈。

   ```Java
   void dfs(TreeNode node) {
       if (node == null) return;
       // 处理当前节点
       dfs(node.left);  // 深入左子树
       dfs(node.right); // 深入右子树
   }
   ```

2. **BFS（广度优先搜索）**

   - 核心思想：按层次逐层遍历，优先访问同一层的所有节点，常用于最短路径问题。
   - **适用场景**：层序遍历、最短路径（无权图）、扩散类问题。
   - **实现方式**：队列（FIFO）。

   ```Java
   void bfs(TreeNode root) {
       Queue<TreeNode> queue = new LinkedList<>();
       queue.offer(root);
       while (!queue.isEmpty()) {
           int size = queue.size();
           for (int i = 0; i < size; i++) {
               TreeNode node = queue.poll();
               // 处理当前节点
               if (node.left != null) queue.offer(node.left);
               if (node.right != null) queue.offer(node.right);
           }
       }
   }
   ```

只是比较两段代码的话，最直观的感受就是：DFS 遍历的代码比 BFS 简洁太多了！这是因为递归的方式隐含地使用了系统的 栈，我们不需要自己维护一个数据结构。如果只是简单地将二叉树遍历一遍，那么 DFS 显然是更方便的选择。



## 二、勇往直前的深度优先搜索

### 2.1 深度优先遍历的形象描述

「一条路走到底，不撞南墙不回头」是对「深度优先遍历」的最直观描述。

说明：

- 深度优先遍历只要前面有可以走的路，就会一直向前走，直到无路可走才会回头；
- 「无路可走」有两种情况：① 遇到了墙；② 遇到了已经走过的路；
- 在「无路可走」的时候，沿着原路返回，直到回到了还有未走过的路的路口，尝试继续走没有走过的路径；
- 有一些路径没有走到，这是因为找到了出口，程序就停止了；
- 「深度优先遍历」也叫「深度优先搜索」，遍历是行为的描述，搜索是目的（用途）；
- 遍历不是很深奥的事情，把 **所有** 可能的情况都看一遍，才能说「找到了目标元素」或者「没找到目标元素」。遍历也称为 **穷举**，穷举的思想在人类看来虽然很不起眼，但借助 **计算机强大的计算能力**，穷举可以帮助我们解决很多专业领域知识不能解决的问题。



### 2.2 树的深度优先遍历

我们以「二叉树」的深度优先遍历为例，介绍树的深度优先遍历。

二叉树的深度优先遍历从「根结点」开始，依次 「递归地」 遍历「左子树」的所有结点和「右子树」的所有结点。

![](https://pic.leetcode-cn.com/1614684442-vUBRvf-image.png)

> 事实上，「根结点 → 右子树 → 左子树」也是一种深度优先遍历的方式，为了符合人们「先左再右」的习惯。如果没有特别说明，树的深度优先遍历默认都按照 「根结点 → 左子树 → 右子树」 的方式进行。

**二叉树深度优先遍历的递归终止条件**：遍历完一棵树的 **所有** 叶子结点，等价于遍历到 **空结点**。

二叉树的深度优先遍历可以分为：前序遍历、中序遍历和后序遍历。

![img](https://writings.sh/assets/images/posts/binary-tree-traversal/binary-tree-dfs-order.jpg)

- 前序遍历：根节点 → 左子树 → 右子树
- 中序遍历： 左子树 → 根节点 → 右子树 
- 后序遍历：左子树 → 右子树 → 根节点

> 友情提示：后序遍历是非常重要的遍历方式，解决很多树的问题都采用了后序遍历的思想，请大家务必重点理解「后序遍历」一层一层向上传递信息的遍历方式。并在做题的过程中仔细体会「后序遍历」思想的应用。

**为什么前、中、后序遍历都是深度优先遍历**

可以把树的深度优先遍历想象成一只蚂蚁，从根结点绕着树的外延走一圈。每一个结点的外延按照下图分成三个部分：前序遍历是第一部分，中序遍历是第二部分，后序遍历是第三部分。



**重要性质**

根据定义不难得到以下性质。

  - 性质 1：二叉树的 前序遍历 序列，根结点一定是 最先 访问到的结点；
  - 性质 2：二叉树的 后序遍历 序列，根结点一定是 最后 访问到的结点；
  - 性质 3：根结点把二叉树的 中序遍历 序列划分成两个部分，第一部分的所有结点构成了根结点的左子树，第二部分的所有结点构成了根结点的右子树。

> 根据这些性质，可以完成「力扣」第 105 题、第 106 题



### 2.3 图的深度优先遍历

深度优先遍历有「回头」的过程，在树中由于不存在「环」（回路），对于每一个结点来说，每一个结点只会被递归处理一次。而「图」中由于存在「环」（回路），就需要 记录已经被递归处理的结点（通常使用布尔数组或者哈希表），以免结点被重复遍历到。

**说明**：深度优先遍历的结果通常与图的顶点如何存储有关，所以图的深度优先遍历的结果并不唯一。

#### [课程表](https://leetcode.cn/problems/course-schedule/)

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
> 解释：总共有 2 门课程。学习课程 1 之前，你需要先完成​课程 0 ；并且学习课程 0 之前，你还应先完成课程 1 。这是不可能的。
> ```

思路：对于课程表问题，实际上是在寻找一个有向无环图（DAG）的环，以确定是否存在一个有效的课程学习顺序。

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



### 2.4 深度优先遍历的两种实现方式

在深度优先遍历的过程中，需要将 当前遍历到的结点 的相邻结点 暂时保存 起来，以便在回退的时候可以继续访问它们。遍历到的结点的顺序呈现「后进先出」的特点，因此 深度优先遍历可以通过「栈」实现。

再者，深度优先遍历有明显的递归结构。我们知道支持递归实现的数据结构也是栈。因此实现深度优先遍历有以下两种方式：

- 编写递归方法；
- 编写栈，通过迭代的方式实现。

![image.png](https://pic.leetcode-cn.com/1608890373-CFNdrG-image.png)

### 2.5  DFS  算法框架

#### **1. 基础模板（以全排列为例）**

```java
// 全局变量：记录结果和路径
List<List<Integer>> result = new ArrayList<>();
List<Integer> path = new ArrayList<>();
boolean[] visited; // 访问标记数组

void dfs(int[] nums, int depth) {
    // 终止条件：路径长度达到要求
    if (depth == nums.length) {
        result.add(new ArrayList<>(path));
        return;
    }
    
    // 遍历选择列表
    for (int i = 0; i < nums.length; i++) {
        if (!visited[i]) {
            // 做选择：标记已访问，加入路径
            visited[i] = true;
            path.add(nums[i]);
            // 递归进入下一层
            dfs(nums, depth + 1);
            // 撤销选择：回溯
            visited[i] = false;
            path.remove(path.size() - 1);
        }
    }
}
```

**关键点**：

- **路径记录**：通过`path`列表保存当前路径。
- **访问标记**：使用`visited`数组避免重复访问。
- **递归与回溯**：递归调用后必须撤销选择以恢复状态

#### **2. 二维矩阵遍历框架（如岛屿问题）**

```java
void dfs(int[][] grid, int i, int j) {
    // 边界检查
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length) return;
    // 终止条件：遇到非陆地或已访问
    if (grid[i][j] != '1') return;
    
    // 标记为已访问（直接修改原矩阵）
    grid[i][j] = '0';
    // 四个方向递归
    dfs(grid, i + 1, j); // 下
    dfs(grid, i - 1, j); // 上
    dfs(grid, i, j + 1); // 右
    dfs(grid, i, j - 1); // 左
}
```

**适用场景**：矩阵中的连通性问题（如岛屿数量、迷宫路径）



### 2.6 练习

> https://leetcode.cn/problem-list/depth-first-search/

请大家通过这些问题体会 「**如何设计递归函数的返回值**」 帮助我们解决问题。并理解这些简单的问题其实都是「深度优先遍历」的思想中「后序遍历」思想的体现，真正程序在执行的时候，是通过「一层一层向上汇报」的方式，最终在根结点汇总整棵树遍历的结果。

1. 完成「力扣」第 104 题：二叉树的最大深度（简单）：设计递归函数的返回值；
2. 完成「力扣」第 111 题：二叉树的最小深度（简单）：设计递归函数的返回值；
3. 完成「力扣」第 112 题：路径总和（简单）：设计递归函数的返回值；
4. 完成「力扣」第 226 题：翻转二叉树（简单）：前中后序遍历、广度优先遍历均可，中序遍历有一个小小的坑；
5. 完成「力扣」第 100 题：相同的树（简单）：设计递归函数的返回值；
6. 完成「力扣」第 101 题：对称二叉树（简单）：设计递归函数的返回值；
7. 完成「力扣」第 129 题：求根到叶子节点数字之和（中等）：设计递归函数的返回值。
8. 完成「力扣」第 236 题：二叉树的最近公共祖先（中等）：使用后序遍历的典型问题。

请大家完成下面这些树中的问题，加深对前序遍历序列、中序遍历序列、后序遍历序列的理解。

9. 完成「力扣」第 105 题：从前序与中序遍历序列构造二叉树（中等）；
10. 完成「力扣」第 106 题：从中序与后序遍历序列构造二叉树（中等）；
11. 完成「力扣」第 1008 题：前序遍历构造二叉搜索树（中等）；

12. 完成「力扣」第 1028 题：从先序遍历还原二叉树（困难）。

> 友情提示：需要用到后序遍历思想的一些经典问题，这些问题可能有一些难度，可以不用急于完成。先做后面的问题，见多了类似的问题以后，慢慢理解「后序遍历」一层一层向上汇报，在根结点汇总的遍历思想。



### 2.7 总结

- 遍历可以用于搜索，思想是穷举，遍历是实现搜索的手段；
- 树的「前、中、后」序遍历都是深度优先遍历；
- 树的后序遍历很重要；
- 由于图中存在环（回路），图的深度优先遍历需要记录已经访问过的结点，以避免重复访问；
- 遍历是一种简单、朴素但是很重要的算法思想，很多树和图的问题就是在树和图上执行一次遍历，在遍历的过程中记录有用的信息，得到需要结果，区别在于为了解决不同的问题，在遍历的时候传递了不同的 与问题相关 的数据。





## 三、齐头并进的广度优先搜索

> DFS（深度优先搜索）和 BFS（广度优先搜索）就像孪生兄弟，提到一个总是想起另一个。然而在实际使用中，我们用 DFS 的时候远远多于 BFS。那么，是不是 BFS 就没有什么用呢？
>
> 如果我们使用 DFS/BFS 只是为了遍历一棵树、一张图上的所有结点的话，那么 DFS 和 BFS 的能力没什么差别，我们当然更倾向于更方便写、空间复杂度更低的 DFS 遍历。不过，某些使用场景是 DFS 做不到的，只能使用 BFS 遍历。
>

![image.png](https://pic.leetcode-cn.com/1611483686-FJqdzm-image.png)

「广度优先遍历」的思想在生活中随处可见：

如果我们要找一个医生或者律师，我们会先在自己的一度人脉中遍历（查找），如果没有找到，继续在自己的二度人脉中遍历（查找），直到找到为止。

### 3.1 广度优先遍历借助「队列」实现

广度优先遍历呈现出「一层一层向外扩张」的特点，**先看到的结点先遍历，后看到的结点后遍历**，因此「广度优先遍历」可以借助「队列」实现。

![11-01-05.gif](https://pic.leetcode-cn.com/1609663109-jjxZav-11-01-05.gif)

**说明**：遍历到一个结点时，如果这个结点有左（右）孩子结点，依次将它们加入队列。

> 友情提示：广度优先遍历的写法相对固定，我们不建议大家背代码、记模板。在深刻理解广度优先遍历的应用场景（找无权图的最短路径），借助「队列」实现的基础上，多做练习，写对代码就是自然而然的事情了

我们先介绍「树」的广度优先遍历，再介绍「图」的广度优先遍历。事实上，它们是非常像的。



### 3.2 树的广度优先遍历

二叉树的层序遍历

> 给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。
>

思路分析：

- 题目要求我们一层一层输出树的结点的值，很明显需要使用「广度优先遍历」实现；
- 广度优先遍历借助「队列」实现；

- 注意：
  - 这样写 `for (int i = 0; i < queue.size(); i++) { `代码是不能通过测评的，这是因为 `queue.size()` 在循环中是变量。正确的做法是：每一次在队列中取出元素的个数须要先暂存起来；
  - 子结点入队的时候，非空的判断很重要：在队列的队首元素出队的时候，一定要在左（右）子结点非空的时候才将左（右）子结点入队。
- 树的广度优先遍历的写法模式相对固定：
  - 使用队列；
  - 在队列非空的时候，动态取出队首元素；
  - 取出队首元素的时候，把队首元素相邻的结点（非空）加入队列。

大家在做题的过程中需要多加练习，融汇贯通，不须要死记硬背。

![img](https://pic.leetcode-cn.com/94cd1fa999df0276f1dae77a9cca83f4cabda9e2e0b8571cd9550a8ee3545f56.gif)

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>(); // 存储遍历结果的列表
    if (root == null) {
        return result; // 如果树为空，直接返回空列表
    }

    Queue<TreeNode> queue = new LinkedList<>(); // 创建一个队列用于层序遍历
    queue.offer(root); // 将根节点加入队列

    while (!queue.isEmpty()) { // 当队列不为空时继续遍历
        int levelSize = queue.size(); // 当前层的节点数
        List<Integer> currentLevel = new ArrayList<>(); // 存储当前层节点值的列表

        for (int i = 0; i < levelSize; i++) {
            TreeNode currentNode = queue.poll(); // 从队列中取出一个节点
            currentLevel.add(currentNode.val); // 将节点值加入当前层列表

            // 如果左子节点不为空，将其加入队列
            if (currentNode.left != null) {
                queue.offer(currentNode.left);
            }
            // 如果右子节点不为空，将其加入队列
            if (currentNode.right != null) {
                queue.offer(currentNode.right);
            }
        }

        result.add(currentLevel); // 将当前层列表加入结果列表
    }

    return result; // 返回遍历结果
}
```



### 3.3 BFS  算法框架

**基础模板（队列+访问标记）**

```java
public int bfs(Node start, Node target) {
    Queue<Node> queue = new LinkedList<>(); // 核心队列结构
    Set<Node> visited = new HashSet<>();     // 防止重复访问
    int step = 0;                            // 记录扩散步数
    
    queue.offer(start);
    visited.add(start);
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size(); // 当前层节点数
        for (int i = 0; i < levelSize; i++) { // 遍历当前层所有节点
            Node cur = queue.poll();
            // 终止条件（根据问题场景调整）
            if (cur.equals(target)) return step;
            
            // 扩散相邻节点（根据数据结构调整）
            for (Node neighbor : getNeighbors(cur)) {
                if (!visited.contains(neighbor)) {
                    queue.offer(neighbor);
                    visited.add(neighbor);
                }
            }
        }
        step++; // 步数递增
    }
    return -1; // 未找到目标
}
```

**关键点**  ：

- **队列控制层次**：通过 `levelSize` 逐层遍历，保证找到最短路径。
- **访问标记**：避免重复访问（如矩阵问题可改为修改原数据）。
- **扩散逻辑**：`getNeighbors()` 需根据具体数据结构实现（如二叉树、图、网格等）。



### 3.4 使用广度优先遍历得到无权图的最短路径

在 无权图 中，由于广度优先遍历本身的特点，假设源点为 source，只有在遍历到 所有 距离源点 source 的距离为 d 的所有结点以后，才能遍历到所有 距离源点 source 的距离为 d + 1 的所有结点。也可以使用「两点之间、线段最短」这条经验来辅助理解如下结论：从源点 source 到目标结点 target 走直线走过的路径一定是最短的。

> 在一棵树中，一个结点到另一个结点的路径是唯一的，但在图中，结点之间可能有多条路径，其中哪条路最近呢？这一类问题称为最短路径问题。最短路径问题也是 BFS 的典型应用，而且其方法与层序遍历关系密切。
>
> 在二叉树中，BFS 可以实现一层一层的遍历。在图中同样如此。从源点出发，BFS 首先遍历到第一层结点，到源点的距离为 1，然后遍历到第二层结点，到源点的距离为 2…… 可以看到，用 BFS 的话，距离源点更近的点会先被遍历到，这样就能找到到某个点的最短路径了。
>
> ![层序遍历与最短路径](https://pic.leetcode-cn.com/01a3617511b1070216582ae59136888072116ccba360ab7c2aa60fc273351b85.jpg)
>
> 小贴士：
>
> 很多同学一看到「最短路径」，就条件反射地想到「Dijkstra 算法」。为什么 BFS 遍历也能找到最短路径呢？
>
> 这是因为，Dijkstra 算法解决的是带权最短路径问题，而我们这里关注的是无权最短路径问题。也可以看成每条边的权重都是 1。这样的最短路径问题，用 BFS 求解就行了。
>
> 在面试中，你可能更希望写 BFS 而不是 Dijkstra。毕竟，敢保证自己能写对 Dijkstra 算法的人不多。
>
> 最短路径问题属于图算法。由于图的表示和描述比较复杂，本文用比较简单的网格结构代替。网格结构是一种特殊的图，它的表示和遍历都比较简单，适合作为练习题。在 LeetCode 中，最短路径问题也以网格结构为主。



### 3.5 图论中的最短路径问题概述

在图中，由于 图中存在环，和深度优先遍历一样，广度优先遍历也需要在遍历的时候记录已经遍历过的结点。特别注意：将结点添加到队列以后，一定要马上标记为「已经访问」，否则相同结点会重复入队，这一点在初学的时候很容易忽略。如果很难理解这样做的必要性，建议大家在代码中打印出队列中的元素进行调试：在图中，如果入队的时候不马上标记为「已访问」，相同的结点会重复入队，这是不对的。

另外一点还需要强调，广度优先遍历用于求解「无权图」的最短路径，因此一定要认清「无权图」这个前提条件。如果是带权图，就需要使用相应的专门的算法去解决它们。事实上，这些「专门」的算法的思想也都基于「广度优先遍历」的思想，我们为大家例举如下：

- 带权有向图、且所有权重都非负的单源最短路径问题：使用 Dijkstra 算法；
- 带权有向图的单源最短路径问题：Bellman-Ford 算法；

- 一个图的所有结点对的最短路径问题：Floy-Warshall 算法。

这里列出的以三位计算机科学家的名字命名的算法，大家可以在《算法导论》这本经典著作的第 24 章、第 25 章找到相关知识的介绍。值得说明的是：应用任何一种算法，都需要认清使用算法的前提，不满足前提直接套用算法是不可取的。深刻理解应用算法的前提，也是学习算法的重要方法。例如我们在学习「二分查找」算法、「滑动窗口」算法的时候，就可以问自己，这个问题为什么可以使用「二分查找」，为什么可以使用「滑动窗口」。我们知道一个问题可以使用「优先队列」解决，是什么样的需求促使我们想到使用「优先队列」，而不是「红黑树（平衡二叉搜索树）」，想清楚使用算法（数据结构）的前提更重要。

> [无向图中连通分量的数目『323』](https://leetcode.cn/problems/number-of-connected-components-in-an-undirected-graph/)
>
> 你有一个包含 `n` 个节点的图。给定一个整数 `n` 和一个数组 `edges` ，其中 `edges[i] = [ai, bi]` 表示图中 `ai` 和 `bi` 之间有一条边。
>
> 返回 *图中已连接分量的数目* 。
>
> ![img](https://assets.leetcode.com/uploads/2021/03/14/conn1-graph.jpg)
>
> ```
> 输入: n = 5, edges = [[0, 1], [1, 2], [3, 4]]
> 输出: 2
> ```
>
> 思路分析：
>
> 首先需要对输入数组进行处理，由于 n 个结点的编号从 0 到 n - 1 ，因此可以使用「嵌套数组」表示邻接表，具体实现请见参考代码；
> 然后遍历每一个顶点，对每一个顶点执行一次广度优先遍历，注意：在遍历的过程中使用 visited 布尔数组记录已经遍历过的结点。
>
> ```java
> public int countComponents(int n, int[][] edges) {
>  // 第 1 步：构建图
>  List<Integer>[] adj = new ArrayList[n];
>  for (int i = 0; i < n; i++) {
>      adj[i] = new ArrayList<>();
>  }
>  // 无向图，所以需要添加双向引用
>  for (int[] edge : edges) {
>      adj[edge[0]].add(edge[1]);
>      adj[edge[1]].add(edge[0]);
>  }
> 
>  // 第 2 步：开始广度优先遍历
>  int res = 0;
>  boolean[] visited = new boolean[n];
>  for (int i = 0; i < n; i++) {
>      if (!visited[i]) {
>          bfs(adj, i, visited);
>          res++;
>      }
>  }
>  return res;
> }
> 
> /**
>  * @param adj     邻接表
>  * @param u       从 u 这个顶点开始广度优先遍历
>  * @param visited 全局使用的 visited 布尔数组
>  */
> private void bfs(List<Integer>[] adj, int u, boolean[] visited) {
>     Queue<Integer> queue = new LinkedList<>();
>     queue.offer(u);
>     visited[u] = true;
> 
>     while (!queue.isEmpty()) {
>         Integer front = queue.poll();
>         // 获得队首结点的所有后继结点
>         List<Integer> successors = adj[front];
>         for (int successor : successors) {
>             if (!visited[successor]) {
>                 queue.offer(successor);
>                 // 特别注意：在加入队列以后一定要将该结点标记为访问，否则会出现结果重复入队的情况
>                 visited[successor] = true;
>             }
>         }
>     }
> }
> ```
>
> 复杂度分析：
>
> - 时间复杂度：O(V + E)O(V+E)，这里 EE 是边的条数，即数组 edges 的长度，初始化的时候遍历数组得到邻接表。这里 VV 为输入整数 n，遍历的过程是每一个结点执行一次深度优先遍历，时间复杂度为 O(V)O(V)；
> - 空间复杂度：O(V + E)O(V+E)，综合考虑邻接表 O(V + E)O(V+E)、visited 数组 O(V)O(V)、队列的长度 O(V)O(V) 三者得到。
>   说明：和深度优先遍历一样，图的广度优先遍历的结果并不唯一，与每个结点的相邻结点的访问顺序有关。

### 3.6 练习

> 友情提示：第 1 - 4 题是广度优先遍历的变形问题，写对这些问题有助于掌握广度优先遍历的代码编写逻辑和细节。

1. 完成「力扣」第 107 题：二叉树的层次遍历 II（简单）；
2. 完成《剑指 Offer》第 32 - I 题：从上到下打印二叉树（中等）；
3. 完成《剑指 Offer》第 32 - III 题：从上到下打印二叉树 III（中等）；
4. 完成「力扣」第 103 题：二叉树的锯齿形层次遍历（中等）；
5. 完成「力扣」第 429 题：N 叉树的层序遍历（中等）；
6. 完成「力扣」第 993 题：二叉树的堂兄弟节点（中等）；



#### 二维矩阵遍历（岛屿问题）

```java
void bfs(char[][] grid, int x, int y) {
    int[][] dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{x, y});
    grid[x][y] = '0'; // 直接修改矩阵代替visited
    
    while (!queue.isEmpty()) {
        int[] pos = queue.poll();
        for (int[] d : dirs) {
            int nx = pos[0] + d[0], ny = pos[1] + d[1];
            if (nx >=0 && ny >=0 && nx < grid.length && ny < grid[0].length 
                && grid[nx][ny] == '1') {
                queue.offer(new int[]{nx, ny});
                grid[nx][ny] = '0'; // 标记为已访问
            }
        }
    }
}
```

**优化点**  ：

- 直接修改原矩阵代替`visited`集合，节省空间。
- 四方向扩散的坐标计算。

#### 图的邻接表遍历

```java
public void bfsGraph(Map<Integer, List<Integer>> graph, int start) {
    Queue<Integer> queue = new LinkedList<>();
    boolean[] visited = new boolean[graph.size()];
    queue.offer(start);
    visited[start] = true;

    while (!queue.isEmpty()) {
        int node = queue.poll();
        System.out.print(node + " ");
        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                queue.offer(neighbor);
                visited[neighbor] = true;
            }
        }
    }
}
```

**数据结构** ：

- 使用`Map`或邻接表存储图结构。
- 通过布尔数组标记访问状态。



## Reference

- https://leetcode-cn.com/problems/binary-tree-level-order-traversal/solution/bfs-de-shi-yong-chang-jing-zong-jie-ceng-xu-bian-l/
