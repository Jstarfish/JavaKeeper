---
title: 二叉树通关秘籍：LeetCode 热题 100 全解析
date: 2025-01-08
tags: 
 - Binary Tree
categories: leetcode
---

![](https://img.starfish.ink/leetcode/binary-tree-banner.png)

> 二叉树作为数据结构中的常青树，在算法面试中出现的频率居高不下。
>
> 有人说刷题要先刷二叉树，培养思维。目前还没培养出来，感觉分类刷都差不多。
>
> 我把二叉树相关题目进行了下分类。
>
> 当然，在做二叉树题目时候，第一想到的应该是用 **递归** 来解决。

## 一、二叉树基本操作类

### 1.1 二叉树的遍历

#### [二叉树的前序遍历『144』](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

> 给你二叉树的根节点 `root` ，返回它节点值的 **前序** 遍历。

```java
public List<Integer> preorderTraversal(TreeNode root) {
  List<Integer> res = new ArrayList<>();
  preorder(root,res);
  return res;
}

public void preorder(TreeNode root,List<Integer> res){
  if(root == null){
    return;
  }
  res.add(root.val);
  preorder(root.left,res);
  preorder(root.right,res);
}
```



#### [二叉树的中序遍历『94』](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

```java
public void inorder(TreeNode root,List<Integer> res){
  if(root == null){
    return;
  }
  inorder(root.left,res);
  res.add(root.val);
  inorder(root.right,res);
}
```



#### [二叉树的后序遍历『145』](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

```java
public void postorder(TreeNode root, List<Integer> res) {
  if (root == null) {
    return;
  }
  postorder(root.left, res);
  postorder(root.right, res);
  res.add(root.val);
}
```



#### [ 二叉树的层序遍历『102』](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

> 给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** 。 （即逐层地，从左到右访问所有节点）。
>
> ![img](https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg)
>
> ```
> 输入：root = [3,9,20,null,null,15,7]
> 输出：[[3],[9,20],[15,7]]
> ```

**思路**：BFS 的思想。

![](https://pic.leetcode-cn.com/fdcd3bd27f4008948084f6ec86b58535e71f66862bd89a34bd6fe4cc42d68e89.gif)

借助一个队列，首先将二叉树的根结点入队，然后访问出队结点并出队，如果有左孩子结点，左孩子结点也入队；如果有右孩子结点，右孩子结点也入队。然后访问出队结点并出队，直到队列为空为止.

![](https://pic.leetcode-cn.com/94cd1fa999df0276f1dae77a9cca83f4cabda9e2e0b8571cd9550a8ee3545f56.gif)

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) {
        return result;  // 如果根节点为空，直接返回空的结果
    }

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);  // 根节点入队

    while (!queue.isEmpty()) {
        int levelSize = queue.size();  // 当前层节点数
        List<Integer> level = new ArrayList<>();

        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();  // 弹出队首节点
            level.add(node.val);

            // 左子节点入队
            if (node.left != null) {
                queue.offer(node.left);
            }
            // 右子节点入队
            if (node.right != null) {
                queue.offer(node.right);
            }
        }

        result.add(level);  // 将当前层的结果加入结果集
    }

    return result;
}
```



### 1.2 深度优先

#### [二叉树的右视图『199』](https://leetcode.cn/problems/binary-tree-right-side-view/)

> 给定一个二叉树的 **根节点** `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
>
> ![img](https://assets.leetcode.com/uploads/2021/02/14/tree.jpg)
>
> ```
> 输入: [1,2,3,null,5,null,4]
> 输出: [1, 3, 4]
> 解释:
>    1            <---
>  /   \
> 2     3         <---
>  \     \
>   5     4       <---
> ```

**思路**：  既可以用 BFS  也可以用 DFS 解此题。

1. **层序遍历（BFS）**：

   - 使用广度优先搜索（BFS）逐层遍历二叉树。
   - 对于每一层，记录最后一个节点（即最右侧的节点）的值。
   - 将每一层的最后一个节点的值加入结果列表。

   ```java
   public class Solution {
       public List<Integer> rightSideView(TreeNode root) {
           List<Integer> result = new ArrayList<>();
           if (root == null) {
               return result;
           }
   
           Queue<TreeNode> queue = new LinkedList<>();
           queue.offer(root);
   
           while (!queue.isEmpty()) {
               int levelSize = queue.size();
               for (int i = 0; i < levelSize; i++) {
                   TreeNode currentNode = queue.poll();
                   // 如果是当前层的最后一个节点，加入结果列表
                   if (i == levelSize - 1) {
                       result.add(currentNode.val);
                   }
                   // 将左右子节点加入队列
                   if (currentNode.left != null) {
                       queue.offer(currentNode.left);
                   }
                   if (currentNode.right != null) {
                       queue.offer(currentNode.right);
                   }
               }
           }
   
           return result;
       }
   }
   ```

2. **深度优先搜索（DFS）**：

   - 使用深度优先搜索（DFS）遍历二叉树。
   - 在遍历时，记录当前深度，并将每一层的第一个访问到的节点（即最右侧的节点）的值加入结果列表。

![](https://assets.leetcode-cn.com/solution-static/199/fig1.png)

使用深度优先遍历递归，一边遍历需要一边记录树的深度。先遍历右子树，当右子树有值的时候，肯定使用右子树的值，右子树遍历完后遍历左子树，对于左子树，只有当左子树的高度超过了当前结果长度时，才进行记录

```java
public class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, 0, result);
        return result;
    }

    private void dfs(TreeNode node, int depth, List<Integer> result) {
        if (node == null) {
            return;
        }
        // 如果当前深度等于结果列表的大小，说明是当前层第一个访问的节点（最右侧节点）
        if (depth == result.size()) {
            result.add(node.val);
        }
        // 先遍历右子树，再遍历左子树
        dfs(node.right, depth + 1, result);
        dfs(node.left, depth + 1, result);
    }
}
```



### 1.3 构造二叉树

**二叉树的构造问题一般都是使用「分解问题」的思路：构造整棵树 = 根节点 + 构造左子树 + 构造右子树**。

#### [最大二叉树『654』](https://leetcode-cn.com/problems/maximum-binary-tree/)

> 给定一个不重复的整数数组 nums 。 最大二叉树 可以用下面的算法从 nums 递归地构建:
>
> 1. 创建一个根节点，其值为 nums 中的最大值。
> 2. 递归地在最大值 左边 的 子数组前缀上 构建左子树。
>
> 3. 递归地在最大值 右边 的 子数组后缀上 构建右子树。
>
> 返回 nums 构建的 最大二叉树 。
>
> ![img](https://assets.leetcode.com/uploads/2020/12/24/tree1.jpg)
>
> ```
> 输入：nums = [3,2,1,6,0,5]
> 输出：[6,3,5,null,2,0,null,null,1]
> 解释：递归调用如下所示：
> - [3,2,1,6,0,5] 中的最大值是 6 ，左边部分是 [3,2,1] ，右边部分是 [0,5] 。
>     - [3,2,1] 中的最大值是 3 ，左边部分是 [] ，右边部分是 [2,1] 。
>         - 空数组，无子节点。
>         - [2,1] 中的最大值是 2 ，左边部分是 [] ，右边部分是 [1] 。
>             - 空数组，无子节点。
>             - 只有一个元素，所以子节点是一个值为 1 的节点。
>     - [0,5] 中的最大值是 5 ，左边部分是 [0] ，右边部分是 [] 。
>         - 只有一个元素，所以子节点是一个值为 0 的节点。
>         - 空数组，无子节点。
> ```

思路：最大二叉树：二叉树的根是数组 nums 中的最大元素。 左子树是通过数组中最大值左边部分递归构造出的最大二叉树。 右子树是通过数组中最大值右边部分递归构造出的最大二叉树。

- **递归构建**
  - 先找到当前数组 `nums` 中的最大值，并以其作为当前子树的根节点。
  - 递归处理最大值左侧的子数组，构建左子树。
  - 递归处理最大值右侧的子数组，构建右子树。

- **时间复杂度**

  - 每次找最大值需要遍历整个子数组，最坏情况（类似递增数组）会导致 **O(n²)** 的时间复杂度。

  - 但是，如果 `nums` 是类似 `[6, 5, 4, 3, 2, 1]` 这样单调递减的数组，树会变成链式结构，每次找到最大值都只会减少一个元素，导致递归深度为 `O(n)`。

```java
public class Solution {
    public TreeNode constructMaximumBinaryTree(int[] nums) {
        return buildTree(nums, 0, nums.length - 1);
    }

    private TreeNode buildTree(int[] nums, int left, int right) {
        if (left > right) return null;

        // 找到最大值的索引
        int maxIndex = left;
        for (int i = left; i <= right; i++) {
            if (nums[i] > nums[maxIndex]) {
                maxIndex = i;
            }
        }

        // 创建根节点
        TreeNode root = new TreeNode(nums[maxIndex]);

        // 递归构建左右子树
        root.left = buildTree(nums, left, maxIndex - 1);
        root.right = buildTree(nums, maxIndex + 1, right);

        return root;
    }
}
```



#### [从前序与中序遍历序列构造二叉树『105』](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

> 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
>
> ```
> 输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
> 输出: [3,9,20,null,null,15,7]
> 
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```

**思路**：

- 前序遍历顺序为【根节点 -> 左子树 -> 右子树】，那 `preorder[0]` 就是根节点的值

- 中序遍历顺序为【左子树 -> 根节点 -> 右子树】，在中序遍历中找到根节点后，可以将其左右两侧划分为左子树和右子树所在的区间

**构建过程**

- 在 `preorder` 第一个元素就是根节点的值 `rootVal`。
- 在 `inorder`中找到 `rootVal`的索引位置 `inIndex`。
  - `inIndex` 左侧的部分是**左子树**的中序遍历序列；右侧部分是**右子树**的中序遍历序列。
- 知道了左子树在中序数组中的区间 `[inStart, inIndex - 1]` 之后，可以确定左子树节点的数量，从而**切分**先序遍历中左子树和右子树对应的区间。
- 递归进行构建：
  - 左子树：先序遍历区间 + 中序遍历 `[inStart, inIndex - 1]`
  - 右子树：先序遍历区间 + 中序遍历 `[inIndex + 1, inEnd]`

```java
public class Solution {
    
    // 记录先序遍历中当前处理到的索引
    private int preIndex;
    // 中序遍历数值 -> 索引的映射
    private Map<Integer, Integer> indexMap;
    
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        // 参数合法性判断
        if (preorder == null || inorder == null || preorder.length != inorder.length) {
            return null;
        }
        
        // 初始化全局索引和哈希表
        preIndex = 0;
        indexMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            indexMap.put(inorder[i], i);
        }
        
        // 递归构造二叉树
        return buildSubTree(preorder, 0, inorder.length - 1);
    }
    
    /**
     * 根据先序数组和中序数组的区间，构造子树并返回根节点
     *
     * @param preorder 先序数组
     * @param inStart  中序数组的起始索引
     * @param inEnd    中序数组的结束索引
     * @return         子树根节点
     */
    private TreeNode buildSubTree(int[] preorder, int inStart, int inEnd) {
        // 若区间无效，返回 null
        if (inStart > inEnd) {
            return null;
        }
        
        // 先序遍历的当前元素即为根节点
        int rootVal = preorder[preIndex++];
        TreeNode root = new TreeNode(rootVal);
        
        // 在中序遍历中找到根节点的位置
        int inIndex = indexMap.get(rootVal);
        
        // 递归构建左子树
        root.left = buildSubTree(preorder, inStart, inIndex - 1);
        // 递归构建右子树
        root.right = buildSubTree(preorder, inIndex + 1, inEnd);
        
        return root;
    }
}
```



#### [从中序与后序遍历序列构造二叉树『106』](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

> 给定两个整数数组 inorder 和 postorder ，其中 inorder 是二叉树的中序遍历， postorder 是同一棵树的后序遍历，请你构造并返回这颗 二叉树 。
>
> ```
> 输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
> 输出：[3,9,20,null,null,15,7]
> 
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```

思路：

- **后序遍历 (Postorder)**：顺序为 **[左子树 -> 右子树 -> 根节点]**
  - `postorder` 数组的最后一个元素是当前子树的根节点。

- **中序遍历 (Inorder)**：顺序为 **[左子树 -> 根节点 -> 右子树]**
  - 在 `inorder` 中找到**根节点的位置**，可以划分**左子树**和**右子树**的范围。

**递归构建二叉树**

- 取 `postorder` **最后一个元素** 作为当前子树的**根节点**。
- 在 `inorder`中找到根节点的位置 `inIndex`，然后：
  - `inIndex` **左侧的部分**属于**左子树**。
  - `inIndex` **右侧的部分**属于**右子树**。
- 递归构造左子树和右子树：
  - **注意：因为后序遍历是 [左 -> 右 -> 根]，所以递归时要先构造右子树，再构造左子树！**
- **优化：用哈希表存储 `inorder` 的索引，快速查找根节点的位置**，避免 O(n²) 的查找时间。

```java
public class Solution {
    private int postIndex;
    private Map<Integer, Integer> inMap;

    public TreeNode buildTree(int[] inorder, int[] postorder) {
        if (inorder == null || postorder == null || inorder.length != postorder.length) {
            return null;
        }

        // 1. 构建哈希表存储 inorder 值的位置
        inMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inMap.put(inorder[i], i);
        }

        // 2. 初始化 postIndex 为 postorder 最后一个元素（即根节点）
        postIndex = postorder.length - 1;

        // 3. 递归构造二叉树
        return buildSubTree(postorder, 0, inorder.length - 1);
    }

    /**
     * 递归构造子树
     * @param postorder 后序遍历数组
     * @param inStart   当前子树的中序遍历范围（左边界）
     * @param inEnd     当前子树的中序遍历范围（右边界）
     * @return 返回子树根节点
     */
    private TreeNode buildSubTree(int[] postorder, int inStart, int inEnd) {
        // 递归终止条件
        if (inStart > inEnd) {
            return null;
        }

        // 1. 取出 postorder[postIndex] 作为根节点
        int rootVal = postorder[postIndex--];
        TreeNode root = new TreeNode(rootVal);

        // 2. 在 inorder 中找到 rootVal 的索引
        int inIndex = inMap.get(rootVal);

        // 3. 递归构造右子树（**先右后左，因为后序遍历是 [左 -> 右 -> 根]**）
        root.right = buildSubTree(postorder, inIndex + 1, inEnd);

        // 4. 递归构造左子树
        root.left = buildSubTree(postorder, inStart, inIndex - 1);

        return root;
    }
}
```



#### [根据前序和后序遍历构造二叉树『889』](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

> 给定两个整数数组，preorder 和 postorder ，其中 preorder 是一个具有 无重复 值的二叉树的前序遍历，postorder 是同一棵树的后序遍历，重构并返回二叉树。
>
> 如果存在多个答案，您可以返回其中 任何 一个。
>
> ```
> 输入：preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1]
> 输出：[1,2,3,4,5,6,7]
> 
>         1
>        / \
>       2   3
>      / \  / \
>     4  5 6  7
> ```

思路：这个的区别就是无法确定原始二叉树，可能有不同形式，所以我们可以通过控制左右子树的索引来构建

1. 首先把前序遍历结果的第一个元素或者后序遍历结果的最后一个元素确定为根节点的值。

2. 然后把前序遍历结果的第二个元素作为左子树的根节点的值。

3. 在后序遍历结果中寻找左子树根节点的值，从而确定了左子树的索引边界，进而确定右子树的索引边界，递归构造左右子树即可。

**关键点**

- `preorder[1]` 是左子树的根节点（如果存在左子树）。
- 在 `postorder` 中找到 `preorder[1]` 的位置，就可以确定左子树的范围。

**核心步骤**

1. 取 `preorder[0]` 作为当前子树的根节点 `root`。
2. **如果 `preorder.length == 1`，直接返回 `root`**。
3. 在 `postorder` 中找到 `preorder[1]` 的索引 `leftIndex`，它表示左子树的范围。
4. 递归构造左子树：
   - **左子树的 `preorder`**: `preorder[1 : leftIndex + 2]`
   - **左子树的 `postorder`**: `postorder[0 : leftIndex + 1]`
5. 递归构造右子树：
   - **右子树的 `preorder`**: `preorder[leftIndex + 2 : end]`
   - **右子树的 `postorder`**: `postorder[leftIndex + 1 : end-1]`

```java
public class Solution {
    private Map<Integer, Integer> postMap;
    private int preIndex;

    public TreeNode constructFromPrePost(int[] preorder, int[] postorder) {
        postMap = new HashMap<>();
        for (int i = 0; i < postorder.length; i++) {
            postMap.put(postorder[i], i);  // 存储 postorder 值和索引的映射
        }
        preIndex = 0;
        return buildTree(preorder, postorder, 0, postorder.length - 1);
    }

    private TreeNode buildTree(int[] preorder, int[] postorder, int postStart, int postEnd) {
        if (postStart > postEnd) {
            return null;
        }

        // 1. 取出 preorder 的当前索引值作为根节点
        TreeNode root = new TreeNode(preorder[preIndex++]);

        // 2. 递归结束条件
        if (postStart == postEnd) {
            return root;
        }

        // 3. 找到左子树的根（preorder[preIndex]）在 postorder 里的索引
        int leftRootIndex = postMap.get(preorder[preIndex]);

        // 4. 递归构建左子树
        root.left = buildTree(preorder, postorder, postStart, leftRootIndex);
        
        // 5. 递归构建右子树
        root.right = buildTree(preorder, postorder, leftRootIndex + 1, postEnd - 1);

        return root;
    }
}
```



## 二、树的结构操作类

### 2.1 树的深度计算

#### [ 二叉树的最大深度『104』](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

> 给定一个二叉树，找出其最大深度。
>
> 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
>
> 说明: 叶子节点是指没有子节点的节点。
>
> ```
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
public static int maxDepth(TreeNode root) {
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
    if (root == null) {
        return 0; // 空树的最小深度定义为0，但实际上这通常不会发生，因为至少有一个根节点
    }

    // 如果当前节点是叶子节点，则返回深度1
    if (root.left == null && root.right == null) {
        return 1;
    }

    // 递归计算左子树和右子树的最小深度
    int leftDepth = Integer.MAX_VALUE;
    int rightDepth = Integer.MAX_VALUE;

    if (root.left != null) {
        leftDepth = minDepth(root.left);
    }

    if (root.right != null) {
        rightDepth = minDepth(root.right);
    }

    // 返回左子树和右子树中较小深度的那个，并加上当前节点的深度1
    return Math.min(leftDepth, rightDepth) + 1;
}
```



### 2.2 判断树的结构特性

#### [翻转二叉树 『226』 ](https://leetcode-cn.com/problems/invert-binary-tree/)

> 翻转一棵二叉树。
>
> ![img](https://assets.leetcode.com/uploads/2021/03/14/invert1-tree.jpg)
>
> ```
> 输入：root = [4,2,7,1,3,6,9]
> 输出：[4,7,2,9,6,3,1]
> ```

**思路**：翻转整棵树其实就是交换每个节点的左右子节点，**只要把二叉树上的每一个节点的左右子节点进行交换，最后的结果就是完全翻转之后的二叉树**

在**前序位置操作**是为了确保在递归遍历时，首先处理当前节点的子树，具体是交换左右子树的顺序。这样做能够保证在遍历左右子树之前，当前节点的左右子节点已经被正确地交换。

```java
public TreeNode invertTree(TreeNode root) {
  if(root == null){
    return root;
  }

  /**** 前序遍历位置 ****/
  // 每一个节点需要做的事就是交换它的左右子节点
  TreeNode tmp = root.left;
  root.left = root.right;
  root.right = tmp;
  // 让左右子节点继续翻转它们的子节点
  invertTree(root.left);
  invertTree(root.right);
  return root;
}
```



#### [对称二叉树『101』 ）](https://leetcode-cn.com/problems/symmetric-tree/)

> 给定一个二叉树，检查它是否是镜像对称的。
>
> 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
>
> ![](https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg)

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
  //递归的终止条件是两个节点都为空
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



#### [合并二叉树『617』](https://leetcode-cn.com/problems/merge-two-binary-trees/)

> 给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。
>
> 你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点。
>
> ![img](https://assets.leetcode.com/uploads/2021/02/05/merge.jpg)
>
> ```
> 输入：root1 = [1,3,2,5], root2 = [2,1,3,null,4,null,7]
> 输出：[3,4,5,5,4,null,7]
> ```
>
> 注意: 合并必须从两个树的根节点开始。

思路：递归解法（深度优先搜索）

```java
public TreeNode mergeTrees(TreeNode node1, TreeNode node2) {
  if (node1 == null) {
    return node2;
  }
  if (node2 == null) {
    return node1;
  }
  TreeNode res = new TreeNode(node1.val + node2.val);
  res.left = mergeTrees(node1.left, node2.left);
  res.right = mergeTrees(node1.right, node2.right);
  return res;
}
```

**时间复杂度**：$O(min(m,n))$，仅需遍历两棵树中较小的一棵。

**空间复杂度**：$O(min(m,n))$，递归栈深度由较小的树高度决定



#### [平衡二叉树『110』](https://leetcode.cn/problems/balanced-binary-tree/)

> 给定一个二叉树，判断它是否是 平衡二叉树 
>
> ![img](https://assets.leetcode.com/uploads/2020/10/06/balance_1.jpg)
>
> ```
> 输入：root = [3,9,20,null,null,15,7]
> 输出：true
> ```

思路：递归计算左右子树高度差，并逐层向上传递结果

```java
public boolean isBalanced(TreeNode root) {
    return height(root) != -1;
}

private int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left);
    int right = height(node.right);
    if (left == -1 || right == -1 || Math.abs(left - right) > 1) {
        return -1; // 标记不平衡
    }
    //返回当前树的高度（当前节点的高度是左右子树高度的最大值+1）
    return Math.max(left, right) + 1;
}
```



#### [相同的树『100』](https://leetcode.cn/problems/same-tree/)

> 给你两棵二叉树的根节点 `p` 和 `q` ，编写一个函数来检验这两棵树是否相同。
>
> 如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。
>
> ![img](https://assets.leetcode.com/uploads/2020/12/20/ex2.jpg)
>
> ```
> 输入：p = [1,2], q = [1,null,2]
> 输出：false
> ```

思路：

```java
public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    return p.val == q.val 
           && isSameTree(p.left, q.left) 
           && isSameTree(p.right, q.right);
}
```





#### [二叉树展开为链表『114』](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

> 给你二叉树的根结点 `root` ，请你将它展开为一个单链表：
>
> - 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个结点，而左子指针始终为 `null` 。
> - 展开后的单链表应该与二叉树 [**先序遍历**](https://baike.baidu.com/item/先序遍历/6442839?fr=aladdin) 顺序相同。
>
> ![](https://assets.leetcode.com/uploads/2021/01/14/flaten.jpg)
>
> ```
> 输入：root = [1,2,5,3,4,null,6]
> 输出：[1,null,2,null,3,null,4,null,5,null,6]
> ```

思路：递归是一种解决此类问题的有效方法。我们可以从根节点开始，递归地处理每个节点：

- 如果当前节点为空，直接返回。
- 递归地将当前节点的左子树展开为列表。
- 将当前节点的左子树移动到右子树的位置。
- 将当前节点的原右子树接到新右子树的末尾。
- 将当前节点的左子节点置为空。

```java
public void flatten(TreeNode root) {
		if (root == null) {
        return; // 如果根节点为空，则直接返回
    }

    flatten(root.left); // 递归展开左子树
    flatten(root.right); // 递归展开右子树

    // 将左子树移到右子树的位置
    TreeNode temp = root.right;
    root.right = root.left;
    root.left = null;

    // 找到当前右子树的末尾节点
    TreeNode curr = root.right;
    while (curr.right != null) {
        curr = curr.right;
    }

    // 将原来的右子树接到当前右子树的末尾
    curr.right = temp;
  }
}
```



#### [填充每个节点的下一个右侧节点指针『116』](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node/)

> 给定一个 完美二叉树 ，其所有叶子节点都在同一层，每个父节点都有两个子节点。二叉树定义如下：
>
> ```
> struct Node {
> int val;
> Node *left;
> Node *right;
> Node *next;
> }
> ```
>
> 填充它的每个 next 指针，让这个指针指向其下一个右侧节点。如果找不到下一个右侧节点，则将 next 指针设置为 NULL。
>
> 初始状态下，所有 next 指针都被设置为 NULL。
>
> ![](https://assets.leetcode.com/uploads/2019/02/14/116_sample.png)
>
> ```
> 输入：root = [1,2,3,4,5,6,7]
> 输出：[1,#,2,3,#,4,5,6,7,#]
> 解释：给定二叉树如图 A 所示，你的函数应该填充它的每个 next 指针，以指向其下一个右侧节点，如图 B 所示。序列化的输出按层序遍历排列，同一层节点由 next 指针连接，'#' 标志着每一层的结束。
> ```

思路：用层序遍历的思想

```java
  public Node connect(Node root) {
    if (root == null) {
      return null;
    }
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
      int size = queue.size();
      for (int i = 0; i < size; i++) {
        Node node = queue.poll();
        if (i < size - 1) {
          node.next = queue.peek();
        }
        if (node.left != null) {
          queue.offer(node.left);
        }
        if (node.right != null) {
          queue.offer(node.right);
        }
      }
    }
    return root;
  }
```



#### [另一棵树的子树『572』](https://leetcode.cn/problems/subtree-of-another-tree/)

> 给你两棵二叉树 `root` 和 `subRoot` 。检验 `root` 中是否包含和 `subRoot` 具有相同结构和节点值的子树。如果存在，返回 `true` ；否则，返回 `false` 。
>
> 二叉树 `tree` 的一棵子树包括 `tree` 的某个节点和这个节点的所有后代节点。`tree` 也可以看做它自身的一棵子树。
>
> ![img](https://pic.leetcode.cn/1724998676-cATjhe-image.png)
>
> ```
> 输入：root = [3,4,5,1,2], subRoot = [4,1,2]
> 输出：true
> ```

思路：

```java
public boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (root == null) return subRoot == null;
    return isSame(root, subRoot) 
           || isSubtree(root.left, subRoot) 
           || isSubtree(root.right, subRoot);
}

private boolean isSame(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.val == b.val 
           && isSame(a.left, b.left) 
           && isSame(a.right, b.right);
}
```



### 2.3 路径问题

路径问题涵盖路径生成、路径总和及最长路径等类型

#### [二叉树的所有路径『257』](https://leetcode.cn/problems/binary-tree-paths/)

> 给你一个二叉树的根节点 `root` ，按 **任意顺序** ，返回所有从根节点到叶子节点的路径。
>
> **叶子节点** 是指没有子节点的节点。
>
> ![img](https://assets.leetcode.com/uploads/2021/03/12/paths-tree.jpg)
>
> ```
> 输入：root = [1,2,3,null,5]
> 输出：["1->2->5","1->3"]
> ```

思路：DFS 递归遍历，回溯时拼接路径字符串

```java
public List<String> binaryTreePaths(TreeNode root) {
    List<String> res = new ArrayList<>();
    dfs(root, "", res);
    return res;
}

private void dfs(TreeNode root, String path, List<String> res) {
    if (root == null) return;
    if (root.left == null && root.right == null) { // 叶子节点
        res.add(path + root.val);
        return;
    }
    String newPath = path + root.val + "->";
    dfs(root.left, newPath, res);
    dfs(root.right, newPath, res);
}
```

**关键点**：

1. **终止条件**：遇到叶子节点时保存路径。
2. **路径拼接**：递归时传递拼接后的新路径 `newPath`，避免回溯操作。
3.  **复杂度**：时间复杂度 O(n)，空间复杂度 O(n)（递归栈）



#### [路径总和『112』](https://leetcode.cn/problems/path-sum/)

> 给你二叉树的根节点 `root` 和一个表示目标和的整数 `targetSum` 。判断该树中是否存在 **根节点到叶子节点** 的路径，这条路径上所有节点值相加等于目标和 `targetSum` 。如果存在，返回 `true` ；否则，返回 `false` 。
>
> **叶子节点** 是指没有子节点的节点。
>
> ![img](https://assets.leetcode.com/uploads/2021/01/18/pathsum1.jpg)
>
> ```
> 输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
> 输出：true
> 解释：等于目标和的根节点到叶节点路径如上图所示。
> ```

思路：递归过程中逐层减去当前节点值，在叶子节点判断剩余值是否等于当前节点值

```java
public boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) 
        return root.val == targetSum;
    // 递归步骤：将问题拆解为两个子问题
    // 1. 向左子树寻找路径和等于 (targetSum - 当前节点值) 的路径
    // 2. 向右子树寻找路径和等于 (targetSum - 当前节点值) 的路径
    // 两者满足其一即可（用 || 连接）
    return hasPathSum(root.left, targetSum - root.val) 
        || hasPathSum(root.right, targetSum - root.val);
}
```



#### [路径总和 II『113』](https://leetcode.cn/problems/path-sum-ii/)

> 给你二叉树的根节点 `root` 和一个整数目标和 `targetSum` ，找出所有 **从根节点到叶子节点** 路径总和等于给定目标和的路径。
>
> **叶子节点** 是指没有子节点的节点。
>
> ![img](https://assets.leetcode.com/uploads/2021/01/18/pathsumii1.jpg)
>
> ```
> 输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
> 输出：[[5,4,11,2],[5,8,4,5]]
> ```

思路：使用 `List<Integer>` 记录路径，回溯时需删除当前节点值

```java
public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(root, targetSum, new ArrayList<>(), res);
    return res;
}

private void backtrack(TreeNode root, int sum, List<Integer> path, List<List<Integer>> res) {
    if (root == null) return;
    path.add(root.val);
    if (root.left == null && root.right == null && sum == root.val) {
        res.add(new ArrayList<>(path));
    }
    backtrack(root.left, sum - root.val, path, res);
    backtrack(root.right, sum - root.val, path, res);
    path.remove(path.size() - 1); // 回溯
}
```



#### [二叉树中的最大路径和『124』](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

>二叉树中的 **路径** 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 **至多出现一次** 。该路径 **至少包含一个** 节点，且不一定经过根节点。
>
>![img](https://assets.leetcode.com/uploads/2020/10/13/exx2.jpg)
>
>```
>输入：root = [-10,9,20,null,null,15,7]
>输出：42
>解释：最优路径是 15 -> 20 -> 7 ，路径和为 15 + 20 + 7 = 42
>```

思路：

```java
private int maxSum = Integer.MIN_VALUE;

public int maxPathSum(TreeNode root) {
    maxGain(root);
    return maxSum;
}

private int maxGain(TreeNode node) {
    if (node == null) return 0;
    int leftGain = Math.max(maxGain(node.left), 0); // 左子树贡献值（避免负数）
    int rightGain = Math.max(maxGain(node.right), 0);
    maxSum = Math.max(maxSum, node.val + leftGain + rightGain); // 更新全局最大值
    return node.val + Math.max(leftGain, rightGain); // 返回当前节点最大贡献值
}
```

1. **贡献值**：每个节点返回其所能提供的最大单边路径和。
2. **全局最大值**：路径可能跨越左右子树，因此需计算 `左贡献 + 右贡献 + 当前节点值`。 **复杂度**：时间复杂度 O(n)



#### [ 二叉树的直径『543』](https://leetcode-cn.com/problems/diameter-of-binary-tree/)

> 给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。
>
>    1
>   / \
>   2   3
>  / \     
>  4   5 
> 返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。
> 注意：两结点之间的路径长度是以它们之间边的数目表示。

思路：通过深度优先搜索（DFS）遍历每个节点，计算其左右子树的深度，并基于此更新最大直径

1. **递归终止条件** 当当前节点为空时，返回深度 0（表示无子树贡献边数） 。
2. **递归计算子树深度** 对当前节点的左子树和右子树分别递归调用 DFS，得到左子树深度 `left` 和右子树深度 `right`
3. **更新最大直径** 当前节点的**潜在直径**为 `left + right`（即左子树到右子树的路径边数）。将此值与全局变量 `maxDiameter` 比较并更新 
4. **返回当前子树深度** 当前节点的深度为 `max(left, right) + 1`（+1 表示从当前节点到父节点的边）

```java
public class Solution {
    private int result = 0; // 用于存储树的最大直径

    public int diameterOfBinaryTree(TreeNode root) {
        traverse(root); // 遍历树并计算直径
        return result; // 返回直径
    }

    private int traverse(TreeNode root) {
        if (root == null) {
            return 0; // 空节点的高度为 0
        }

        int left = traverse(root.left); // 递归计算左子树的高度
        int right = traverse(root.right); // 递归计算右子树的高度

        int diameter = left + right; // 通过当前节点的最长路径长度
        result = Math.max(diameter, result); // 更新最大直径

        return Math.max(left, right) + 1; // 返回当前节点的高度
    }
}
```



#### [最长同值路径『687』](https://leetcode.cn/problems/longest-univalue-path/)

> 给定一个二叉树的 `root` ，返回 *最长的路径的长度* ，这个路径中的 *每个节点具有相同值* 。 这条路径可以经过也可以不经过根节点。
>
> **两个节点之间的路径长度** 由它们之间的边数表示。
>
> ![img](https://assets.leetcode.com/uploads/2020/10/13/ex1.jpg)
>
> ```
> 输入：root = [5,4,5,1,1,5]
> 输出：2
> ```

思路：递归返回当前节点与子节点同值的单边最长路径，合并左右路径时更新全局最大值

```java
private int maxLength = 0;

public int longestUnivaluePath(TreeNode root) {
    dfs(root);
    return maxLength;
}

private int dfs(TreeNode root) {
    if (root == null) return 0;
    int left = dfs(root.left);
    int right = dfs(root.right);
    int arrowLeft = (root.left != null && root.left.val == root.val) ? left + 1 : 0;
    int arrowRight = (root.right != null && root.right.val == root.val) ? right + 1 : 0;
    maxLength = Math.max(maxLength, arrowLeft + arrowRight);
    return Math.max(arrowLeft, arrowRight);
}
```



## 三、二叉搜索树相关类

二叉搜索树（Binary Search Tree，后文简写 BST）的特性：

1、对于 BST 的每一个节点 `node`，左子树节点的值都比 `node` 的值要小，右子树节点的值都比 `node` 的值大。

2、对于 BST 的每一个节点 `node`，它的左侧子树和右侧子树都是 BST。

### 3.1 BST基础操作与验证

#### [二叉搜索树中的搜索『700』](https://leetcode.cn/problems/search-in-a-binary-search-tree/)

> 给定二叉搜索树（BST）的根节点 `root` 和一个整数值 `val`。
>
> 你需要在 BST 中找到节点值等于 `val` 的节点。 返回以该节点为根的子树。 如果节点不存在，则返回 `null` 。

```java
TreeNode searchBST(TreeNode root, int target) {
    if (root == null) {
        return null;
    }
    // 去左子树搜索
    if (root.val > target) {
        return searchBST(root.left, target);
    }
    // 去右子树搜索
    if (root.val < target) {
        return searchBST(root.right, target);
    }
    // 当前节点就是目标值
    return root;
}
```



#### [二叉搜索树中的插入操作『701』](https://leetcode.cn/problems/insert-into-a-binary-search-tree/)

> 给定二叉搜索树（BST）的根节点 `root` 和要插入树中的值 `value` ，将值插入二叉搜索树。 返回插入后二叉搜索树的根节点。 输入数据 **保证** ，新值和原始二叉搜索树中的任意节点值都不同。
>
> **注意**，可能存在多种有效的插入方式，只要树在插入后仍保持为二叉搜索树即可。 你可以返回 **任意有效的结果**。

```java
public TreeNode insertIntoBST(TreeNode root, int val) {
    if (root == null) {
        // 找到空位置插入新节点
        return new TreeNode(val);
    }

    // 去右子树找插入位置
    if (root.val < val) {
        root.right = insertIntoBST(root.right, val);
    }
    // 去左子树找插入位置
    if (root.val > val) {
        root.left = insertIntoBST(root.left, val);
    }
    // 返回 root，上层递归会接收返回值作为子节点
    return root;
}
```



#### [删除二叉搜索树中的节点『450』](https://leetcode.cn/problems/delete-node-in-a-bst/)

> 给定一个二叉搜索树的根节点 **root** 和一个值 **key**，删除二叉搜索树中的 **key** 对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。
>
> 一般来说，删除节点可分为两个步骤：
>
> 1. 首先找到需要删除的节点；
> 2. 如果找到了，删除它。
>
> ![img](https://assets.leetcode.com/uploads/2020/09/04/del_node_1.jpg)
>
> ```
> 输入：root = [5,3,6,2,4,null,7], key = 3
> 输出：[5,4,6,2,null,null,7]
> 解释：给定需要删除的节点值是 3，所以我们首先找到 3 这个节点，然后删除它。
> 一个正确的答案是 [5,4,6,2,null,null,7], 如下图所示。
> 另一个正确答案是 [5,2,6,null,4,null,7]。
> ```

思路：

```java
class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) {
            return null; // 树为空，直接返回
        }

        // 1. 查找要删除的节点
        if (key < root.val) {
            // 目标在左子树，递归处理左子树
            root.left = deleteNode(root.left, key);
        } else if (key > root.val) {
            // 目标在右子树，递归处理右子树
            root.right = deleteNode(root.right, key);
        } else {
            // 找到目标节点，根据子节点情况处理
            // 2. 情况1：只有一个子节点或无子节点
            if (root.left == null) {
                return root.right; // 用右子节点替代当前节点
            } else if (root.right == null) {
                return root.left;  // 用左子节点替代当前节点
            } else {
                // 3. 情况2：有两个子节点
                // 找到右子树的最小节点（后继节点）
                TreeNode minNode = findMin(root.right);
                // 用后继节点的值覆盖当前节点
                root.val = minNode.val;
                // 删除右子树中的后继节点（此时该节点值已被移动，相当于删除了原节点）
                root.right = deleteNode(root.right, minNode.val);
            }
        }
        return root; // 返回处理后的子树根节点
    }

    // 辅助方法：找到子树的最小节点（一直向左遍历）
    private TreeNode findMin(TreeNode node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
}
```

- **时间复杂度**：`O(h)`，其中 `h` 为树的高度。最坏情况需要遍历树的高度（例如单链树）。
- **空间复杂度**：`O(h)`，递归栈的深度与树高度相关



#### [二叉搜索树中第 K 小的元素『230』](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)

> 给定一个二叉搜索树的根节点 `root` ，和一个整数 `k` ，请你设计一个算法查找其中第 `k` 小的元素（从 1 开始计数）。
>
> ![img](https://assets.leetcode.com/uploads/2021/01/28/kthtree1.jpg)
>
> ```
> 输入：root = [3,1,4,null,2], k = 1
> 输出：1
> ```

**从做算法题的角度来看 BST，除了它的定义，还有一个重要的性质：BST 的中序遍历结果是有序的（升序）**。

也就是说，如果输入一棵 BST，以下代码可以将 BST 中每个节点的值升序打印出来：

```java
void traverse(TreeNode root) {
    if (root == null) return;
    traverse(root.left);
    // 中序遍历代码位置
    print(root.val);
    traverse(root.right);
}
```

该题题解：

```java
class Solution {
    int kthSmallest(TreeNode root, int k) {
        // 利用 BST 的中序遍历特性
        traverse(root, k);
        return res;
    }

    // 记录结果
    int res = 0;
    // 记录当前元素的排名
    int rank = 0;
    void traverse(TreeNode root, int k) {
        if (root == null) {
            return;
        }
        traverse(root.left, k);

        // 中序代码位置
        rank++;
        if (k == rank) {
            // 找到第 k 小的元素
            res = root.val;
            return;
        }

        traverse(root.right, k);
    }
}
```



#### [验证二叉搜索树『98』](https://leetcode-cn.com/problems/validate-binary-search-tree/)

> 给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。
>
> 有效 二叉搜索树定义如下：
>
> - 节点的左子树只包含 小于 当前节点的数。
> - 节点的右子树只包含 大于 当前节点的数。
> - 所有左子树和右子树自身必须也是二叉搜索树。
>
> ![img](https://assets.leetcode.com/uploads/2020/12/01/tree2.jpg)
>
> ```
> 输入：root = [5,1,4,null,null,3,6]
> 输出：false
> 解释：根节点的值是 5 ，但是右子节点的值是 4 。
> ```

思路：二叉搜索树「中序遍历」得到的值构成的序列一定是升序的。

所以在中序遍历的时候实时检查当前节点的值是否大于前一个中序遍历到的节点的值即可

`min` 和 `max` 用于记录当前节点可以拥有的值的范围。`Long.MIN_VALUE` 和 `Long.MAX_VALUE` 分别表示可能的最小值和最大值，用于初始化调用。

请注意，为了避免在比较时发生整数溢出，这里使用 `long` 类型来定义最小和最大值。如果节点值超出了 `int` 类型的范围，这种方法仍然有效。

```java
// 辅助函数，用于递归验证
public boolean isValidBST(TreeNode root, long min, long max) {
    // 空树是有效的 BST
    if (root == null) {
        return true;
    }

    // 当前节点的值必须在 min 和 max 之间
    if (root.val <= min || root.val >= max) {
        return false;
    }

    // 递归地验证左子树和右子树
    // 左子树的所有节点都必须小于当前节点的值
    // 右子树的所有节点都必须大于当前节点的值
    return isValidBST(root.left, min, root.val) && 
           isValidBST(root.right, root.val, max);
}

// 验证搜索二叉树的接口
public boolean isValidBST(TreeNode root) {
    return isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
```



#### [不同的二叉搜索树『96』](https://leetcode-cn.com/problems/unique-binary-search-trees/)

> 给你一个整数 `n` ，求恰由 `n` 个节点组成且节点值从 `1` 到 `n` 互不相同的 **二叉搜索树** 有多少种？返回满足题意的二叉搜索树的种数。
>
> ![img](https://assets.leetcode.com/uploads/2021/01/18/uniquebstn3.jpg)
>
> ```
> 输入：n = 3
> 输出：5
> ```

思路：动态规划 https://leetcode-cn.com/problems/unique-binary-search-trees/solution/shou-hua-tu-jie-san-chong-xie-fa-dp-di-gui-ji-yi-h/

- 如果整数1 ~ n中的 k 作为根节点值，则 1 ~ k-1 会去构建左子树，k+1 ~ n 会去构建右子树。
- 左子树出来的形态有 a 种，右子树出来的形态有 bb 种，则整个树的形态有 a * b 种。
  - 以 k 为根节点的 BST 种类数 = 左子树 BST 种类数 * 右子树 BST 种类数
  - 就好比，左手有编号1/2/3的手环，右手有编号5/6/7的手环，那搭配就有9种
- 问题变成：不同的 k 之下，等号右边的乘积，进行累加。

```java
public int numTrees(int n) {
  int[] dp = new int[n + 1];

  dp[0] = 1;
  dp[1] = 1;

  for (int i = 2; i <= n; i++) {
    for (int j = 1; j < i; j++) {
      dp[i] += dp[j - 1] * dp[i - j];
    }
  }
  return dp[n];
}
```



#### [把二叉搜索树转换为累加树『538』](https://leetcode-cn.com/problems/convert-bst-to-greater-tree/)

> 给出二叉 搜索 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。
>
> 提醒一下，二叉搜索树满足下列约束条件：
>
> - 节点的左子树仅包含键 小于 节点键的节点。
> - 节点的右子树仅包含键 大于 节点键的节点。
> - 左右子树也必须是二叉搜索树。
>
> ![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/05/03/tree.png)
>
> ```
> 输入：[4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]
> 输出：[30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]
> ```

思路：递归法

```java
class Solution {
    int sum = 0;
    public TreeNode convertBST(TreeNode root) {
        if (root == null) return null;
        convertBST(root.right);  // 处理右子树
        sum += root.val;         // 累加当前节点的值
        root.val = sum;          // 更新当前节点值
        convertBST(root.left);   // 处理左子树
        return root;
    }
}
```

- 时间复杂度：O(n)，每个节点遍历一次。
- 空间复杂度：O(n)，递归栈深度最坏为树的高度（链状树时为 O(n)）



## 四、其他

#### [打家劫舍 III『337』](https://leetcode-cn.com/problems/house-robber-iii/)

> 小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为 root 。
>
> 除了 root 之外，每栋房子有且只有一个“父“房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果 两个直接相连的房子在同一天晚上被打劫 ，房屋将自动报警。
>
> 给定二叉树的 root 。返回 在不触动警报的情况下 ，小偷能够盗取的最高金额 。
>
> ![img](https://assets.leetcode.com/uploads/2021/03/10/rob1-tree.jpg)
>
> ```
> 输入: root = [3,2,3,null,3,null,1]
> 输出: 7 
> 解释: 小偷一晚能够盗取的最高金额 3 + 3 + 1 = 7
> ```

思路：

```java
class Solution {
    public int rob(TreeNode root) {
        int[] result = dfs(root);
        return Math.max(result[0], result[1]);
    }
    
    // 返回数组：int[0]表示偷当前节点的最大值，int[1]表示不偷的最大值
    private int[] dfs(TreeNode node) {
        if (node == null) return new int[]{0, 0}; // 
        
        int[] left = dfs(node.left);   // 左子树偷/不偷的最大值
        int[] right = dfs(node.right); // 右子树偷/不偷的最大值
        
        // 偷当前节点：左右子节点必须不偷
        int robCurrent = node.val + left[1] + right[1]; 
        // 不偷当前节点：左右子节点可偷或不偷（取最大值）
        int skipCurrent = Math.max(left[0], left[1]) + Math.max(right[0], right[1]); 
        
        return new int[]{robCurrent, skipCurrent}; // 
    }
}
```



#### [二叉树的最近公共祖先『236』](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)

> 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
>
> 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”
>
> ![img](https://assets.leetcode.com/uploads/2018/12/14/binarytree.png)
>
> ```
> 输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
> 输出：5
> 解释：节点 5 和节点 4 的最近公共祖先是节点 5 。因为根据定义最近公共祖先节点可以为节点本身。
> ```

**思路：** 

- 两个节点的最近公共祖先其实就是这两个节点向根节点的「延长线」的交汇点

- **如果一个节点能够在它的左右子树中分别找到**`p`**和**`q`**，则该节点为**`LCA`**节点**

- 若 root 是 p,q 的 最近公共祖先 ，则只可能为以下情况之一：

  - p 和 q 在 root 的子树中，且分列 root 的 异侧（即分别在左、右子树中）；
  - p=root ，且 q 在 root 的左或右子树中；
  - q=root ，且 p 在 root 的左或右子树中；![Picture2.png](https://pic.leetcode-cn.com/1599885247-mgYjRv-Picture2.png)


```java
public class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // 如果当前节点为空，则返回null
        if (root == null) {
            return null;
        }
        // 如果当前节点是p或q，则返回当前节点
        if (root == p || root == q) {
            return root;
        }
        // 递归地在左子树中查找p和q
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        // 递归地在右子树中查找p和q
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // 根据left和right的值来判断最近公共祖先
        if (left != null && right != null) {
            // p和q分别位于左右子树中，当前节点是最近公共祖先
            return root;
        } else if (left != null) {
            // p和q都在左子树中，返回左子树的结果
            return left;
        } else {
            // p和q都在右子树中，返回右子树的结果
            return right;
        }
    }
}
```





