我们在做二叉树题目时候，第一想到的应该是用 **递归** 来解决。



### 前、中、后序遍历



### [ 二叉树的层序遍历（102）](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

> 给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** 。 （即逐层地，从左到右访问所有节点）。
>
> ![img](https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg)
>
> ```
> 输入：root = [3,9,20,null,null,15,7]
> 输出：[[3],[9,20],[15,7]]
> ```

BFS 的思想

```java
public static List<List<Integer>> levelOrder5(TreeNode treeNode) {
  if (treeNode == null) {
    return null;
  }
  //用LinkedList 实现类
  Queue<TreeNode> queue = new LinkedList<TreeNode>();
  List<List<Integer>> res = new ArrayList<>();
  queue.offer(treeNode);
  while (!queue.isEmpty()) {
    int size = queue.size();
    List<Integer> currentList = new ArrayList<>();
    for (int i = 0; i < size; i++) {
      TreeNode node = queue.poll();
      if (node.left != null) {
        queue.offer(node.left);
      }
      if (node.right != null) {
        queue.offer(node.right);
      }
      currentList.add(node.val);
    }
    res.add(currentList);
  }
  return res;
}
```



### [翻转二叉树（226）](https://leetcode-cn.com/problems/invert-binary-tree/)

> 翻转一棵二叉树。
>
> 输入：
>
> ```
>     4
>    /   \
>      2     7
>     / \   / \
>   1   3 6   9
>  ```
> 
> 输出：
>
> ```
>     4
>    /   \
>      7     2
>     / \   / \
>   9   6 3   1
>  ```
> 

思路：翻转整棵树其实就是交换每个节点的左右子节点，**只要把二叉树上的每一个节点的左右子节点进行交换，最后的结果就是完全翻转之后的二叉树**

![226_2.gif](https://pic.leetcode-cn.com/0f91f7cbf5740de86e881eb7427c6c3993f4eca3624ca275d71e21c5e3e2c550-226_2.gif)



```java
public static TreeNode invertTree(TreeNode root) {
  if(root == null){
    return root;
  }

  /**** 前序遍历位置 ****/
  // root 节点需要交换它的左右子节点
  TreeNode tmp = root.left;
  root.left = root.right;
  root.right = tmp;
  // 让左右子节点继续翻转它们的子节点
  invertTree(root.left);
  invertTree(root.right);
  return root;
}
```



### [对称二叉树（101 ）](https://leetcode-cn.com/problems/symmetric-tree/)

> 给定一个二叉树，检查它是否是镜像对称的。
>
> 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
>
>          1
>         / \
>        2   2
>       / \ / \
>      3  4 4  3

思路：递归的思想，画个图左右左右比较

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



### [ 二叉树的直径（543）](https://leetcode-cn.com/problems/diameter-of-binary-tree/)

> 给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。
>
> 给定二叉树
>
>        1
>       / \
>      2   3
>     / \     
>     4   5    
>     
>
> 返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。 
>
> 注意：两结点之间的路径长度是以它们之间边的数目表示。



### [ 二叉树的最大深度（104）](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

> 给定一个二叉树，找出其最大深度。
>
> 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
>
> 说明: 叶子节点是指没有子节点的节点。
>
>     给定二叉树 [3,9,20,null,null,15,7]，
>     3
>     / \
>     9  20
>     /  \
>     15   7
> 返回它的最大深度 3 。

思路：深度优先搜索

```java
public static int maxDepth(TreeNode root) {
  if (root == null) {
    return 0;
  } else {
    int leftHeight = maxDepth(root.left);
    int rightHeight = maxDepth(root.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }
}
```



### [合并二叉树（617）](https://leetcode-cn.com/problems/merge-two-binary-trees/)

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

思路：DFS

```java
public TreeNode mergeTree5(TreeNode node1, TreeNode node2) {
  if (node1 == null) {
    return node2;
  }
  if (node2 == null) {
    return node1;
  }
  TreeNode res = new TreeNode(node1.val + node2.val);
  res.left = mergeTrees(node1.left, node2.left);
  res.right = mergeTree5(node1.right, node2.right);
  return res;
}
```



### [填充每个节点的下一个右侧节点指针（116）](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node/)

> 给定一个 完美二叉树 ，其所有叶子节点都在同一层，每个父节点都有两个子节点。二叉树定义如下：
>
> ```
> struct Node {
>   int val;
>   Node *left;
>   Node *right;
>   Node *next;
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
public class Connect_116 {
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



### [不同的二叉搜索树（96）](https://leetcode-cn.com/problems/unique-binary-search-trees/)

> 给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？返回满足题意的二叉搜索树的种数。
>
>  ![img](https://assets.leetcode.com/uploads/2021/01/18/uniquebstn3.jpg)
>
> ```
>输入：n = 3
> 输出：5
>```
> 
> ```
> 输入：n = 1
> 输出：1
>```

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



## 构造二叉树相关题目

> [654. 最大二叉树（中等）](https://leetcode-cn.com/problems/maximum-binary-tree/)
>
> [105. 从前序与中序遍历序列构造二叉树（中等）](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
>
> [106. 从中序与后序遍历序列构造二叉树（中等）](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
>
> [889. 根据前序和后序遍历构造二叉树（中等）](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)



### [最大二叉树（654）](https://leetcode-cn.com/problems/maximum-binary-tree/)

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

思路：递归，**对于每个根节点，只需要找到当前 `nums` 中的最大值和对应的索引，然后递归调用左右数组构造左右子树即可**

最大二叉树：二叉树的根是数组 nums 中的最大元素。 左子树是通过数组中最大值左边部分递归构造出的最大二叉树。 右子树是通过数组中最大值右边部分递归构造出的最大二叉树。

```java
public TreeNode constructMaximumBinaryTree(int[] nums) {
  return bulid(nums, 0, nums.length - 1);
}

private TreeNode bulid(int[] nums, int lo, int hi) {
  if (lo > hi) {
    return null;
  }
  int index = -1;
  int maxVal = Integer.MIN_VALUE;

  //找出最大索引
  for (int i = lo; i < hi; i++) {
    if (maxVal < nums[i]) {
      index = i;
      maxVal = nums[i];
    }
  }

  //构建
  TreeNode root = new TreeNode(maxVal);
  //递归调用构造左右子树
  root.left = bulid(nums, lo, index - 1);
  root.right = bulid(nums, index + 1, hi);
  return root;
}
```



### [从前序与中序遍历序列构造二叉树（105）](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

> 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
>
> ![img](https://assets.leetcode.com/uploads/2021/02/19/tree.jpg)
>
> ```
> 输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
> 输出: [3,9,20,null,null,15,7]
> ```



### [从中序与后序遍历序列构造二叉树（106）](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

> 给定两个整数数组 inorder 和 postorder ，其中 inorder 是二叉树的中序遍历， postorder 是同一棵树的后序遍历，请你构造并返回这颗 二叉树 。
>
> ```
> 输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
> 输出：[3,9,20,null,null,15,7]
> ```





### [根据前序和后序遍历构造二叉树（889）](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

> 给定两个整数数组，preorder 和 postorder ，其中 preorder 是一个具有 无重复 值的二叉树的前序遍历，postorder 是同一棵树的后序遍历，重构并返回二叉树。
>
> 如果存在多个答案，您可以返回其中 任何 一个。
>
> ![img](https://assets.leetcode.com/uploads/2021/07/24/lc-prepost.jpg)
>
> ```
> 输入：preorder = [1,2,4,5,3,6,7], postorder = [4,5,2,6,7,3,1]
> 输出：[1,2,3,4,5,6,7]
> ```

思路：这个的区别就是无法确定原始二叉树，可能有不同形式，所以我们可以通过控制左右子树的索引来构建

1. 首先把前序遍历结果的第一个元素或者后序遍历结果的最后一个元素确定为根节点的值。

2. 然后把前序遍历结果的第二个元素作为左子树的根节点的值。

3. 在后序遍历结果中寻找左子树根节点的值，从而确定了左子树的索引边界，进而确定右子树的索引边界，递归构造左右子树即可。

这样就和前两道解法相似了
