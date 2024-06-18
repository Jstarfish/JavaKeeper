> 我们在做二叉树题目时候，第一想到的应该是用 **递归** 来解决。



### 前、中、后序遍历

### [二叉树的前序遍历（144）](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

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



### [二叉树的中序遍历（94）](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

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



### [二叉树的后序遍历（145）](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

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
  List<List<Integer>> res = new ArrayList<>();
  //用LinkedList 实现类
  Queue<TreeNode> queue = new LinkedList<TreeNode>();
  queue.offer(treeNode);
  // 当队列不为空时，遍历每一层
  while (!queue.isEmpty()) {
    int size = queue.size();
    List<Integer> currentList = new ArrayList<>();
    // 从左到右遍历每一层的每个节点
    for (int i = 0; i < size; i++) {
      //取出队头元素
      TreeNode node = queue.poll();
      // 将下一层节点放入队列
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
> ![img](https://assets.leetcode.com/uploads/2021/03/14/invert1-tree.jpg)
>
> ```
>    输入：root = [4,2,7,1,3,6,9]
>    输出：[4,7,2,9,6,3,1]
>    ```
>    

思路：翻转整棵树其实就是交换每个节点的左右子节点，**只要把二叉树上的每一个节点的左右子节点进行交换，最后的结果就是完全翻转之后的二叉树**

```java
public static TreeNode invertTree(TreeNode root) {
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



### [对称二叉树（101 ）](https://leetcode-cn.com/problems/symmetric-tree/)

> 给定一个二叉树，检查它是否是镜像对称的。
>
> 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
>
>    ![](https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg)
>    

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
>               1
>              / \
>             2   3
>            / \     
>           4   5   
>      
>      返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。
>      注意：两结点之间的路径长度是以它们之间边的数目表示。

思路：**每一条二叉树的「直径」长度，就是一个节点的左右子树的最大深度之和**

```java
int maxDiameter = 0;

public int diameterOfBinaryTree(TreeNode root) {
    traverse(root);
    return maxDiameter;
}

//辅助函数
public int traverse(TreeNode root) {
    //Base Case
    if (root == null) {
        return 0;
    }
    //Height of left、right subtree
    int leftMax = traverse(root.left);
    int rightMax = traverse(root.right);
    int diameter = leftMax + rightMax;
    //Update Diameter
    maxDiameter = Math.max(maxDiameter, diameter);
    //Return current subtree height
    return Math.max(leftMax, rightMax) + 1;
}
```



### [ 二叉树的最大深度（104）](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

> 给定一个二叉树，找出其最大深度。
>
> 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
>
> 说明: 叶子节点是指没有子节点的节点。
>
> ```
>  给定二叉树 [3,9,20,null,null,15,7]，
>   			 3
>  			/ \
>  		 9  20
> 			 /  \
> 			15   7
> 返回它的最大深度 3 
> ```

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



## 构造二叉树

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
public TreeNode constructMaximumBinaryTree(int[] nums){
  return build(nums,0,nums.length - 1);
}

private TreeNode build(int[] nums, int l, int r) {
  //找到终止条件
  if (l > r) {
    return null;
  }

  //找出数组中最大索引
  int max = Integer.MIN_VALUE;
  int maxIndex = l;
  for (int i = l; i <= r; i++) {
    if (max < nums[l]) {
      max = nums[l];
      maxIndex = i;
    }
  }
  //构建结果树
  TreeNode root = new TreeNode(nums[maxIndex]);
  build(nums, l, maxIndex - 1);
  build(nums, maxIndex + 1, r);
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

思路：前序遍历的第一个值 `preorder[0]` 就是根节点的值

![img](https://labuladong.gitee.io/algo/images/%e4%ba%8c%e5%8f%89%e6%a0%91%e7%b3%bb%e5%88%972/4.jpeg)

```java
private Map<Integer,Integer> indexMap;

public TreeNode buildTree(int[] preorder, int[] inorder) {

  int n = preorder.length;
  // 构造哈希映射，帮助我们快速定位根节点
  indexMap = new HashMap<>();
  for (int i = 0; i < n; i++) {
    indexMap.put(inorder[i], i);
  }
  return build(preorder, 0, n - 1 , inorder, 0, n - 1);
}

public TreeNode build(int[] preorder, int preStart, int preEnd,
                      int[] inorder, int inStart, int inEnd) {
  if (preStart > preEnd) {
    return null;
  }
  // 前序遍历中的第一个节点就是根节点
  int rootVal = preorder[preStart];
  // 在中序遍历中定位根节点
  int index = indexMap.get(rootVal);

  // 先把根节点建立出来
  TreeNode root = new TreeNode(preorder[index]);
  // 得到左子树中的节点数目
  int leftSize = index - inStart;
  // 递归地构造左子树，并连接到根节点
  // 先序遍历中「从 左边界+1 开始的 size_left_subtree」个元素就对应了中序遍历中「从 左边界 开始到 根节点定位-1」的元素
  root.left = build(preorder, preStart + 1, preStart + leftSize, inorder, inStart, index - 1);
  // 递归地构造右子树，并连接到根节点
  // 先序遍历中「从 左边界+1+左子树节点数目 开始到 右边界」的元素就对应了中序遍历中「从 根节点定位+1 到 右边界」的元素
  root.right = build(preorder, preStart + leftSize + 1, preEnd, inorder, index + 1, inEnd);
  return root;
}
```



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



## 二叉搜索树

### [96. 不同的二叉搜索树](https://leetcode-cn.com/problems/unique-binary-search-trees/)

> 给你一个整数 `n` ，求恰由 `n` 个节点组成且节点值从 `1` 到 `n` 互不相同的 **二叉搜索树** 有多少种？返回满足题意的二叉搜索树的种数。
>
> ![img](https://assets.leetcode.com/uploads/2021/01/18/uniquebstn3.jpg)
>
> ```
> 输入：n = 3
> 输出：5
> ```



### [98. 验证二叉搜索树](https://leetcode-cn.com/problems/validate-binary-search-tree/)

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



### [538. 把二叉搜索树转换为累加树](https://leetcode-cn.com/problems/convert-bst-to-greater-tree/)

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





## 其他

### [337. 打家劫舍 III](https://leetcode-cn.com/problems/house-robber-iii/)

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





### [124. 二叉树中的最大路径和](https://leetcode-cn.com/problems/binary-tree-maximum-path-sum/)

> 路径 被定义为一条从树中任意节点出发，沿父节点-子节点连接，达到任意节点的序列。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。
>
> 路径和 是路径中各节点值的总和。
>
> 给你一个二叉树的根节点 root ，返回其 最大路径和 。
>
> ![img](https://assets.leetcode.com/uploads/2020/10/13/exx2.jpg)
>
> ```
> 输入：root = [-10,9,20,null,null,15,7]
> 输出：42
> 解释：最优路径是 15 -> 20 -> 7 ，路径和为 15 + 20 + 7 = 42
> ```





### [236. 二叉树的最近公共祖先](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)

> 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
>
> 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”
>
> ![img](https://assets.leetcode.com/uploads/2018/12/14/binarytree.png)
>
> ```
> 输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
> 输出：3
> 解释：节点 5 和节点 1 的最近公共祖先是节点 3 。
> ```



### [437. 路径总和 III](https://leetcode-cn.com/problems/path-sum-iii/)

> 给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。
>
> 路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
>
> ![img](https://assets.leetcode.com/uploads/2021/04/09/pathsum3-1-tree.jpg)
>
> ```
> 输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
> 输出：3
> 解释：和等于 8 的路径有 3 条，如图所示。
> ```





### [297. 二叉树的序列化与反序列化](https://leetcode-cn.com/problems/serialize-and-deserialize-binary-tree/)

> 序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。
>
> 请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。
>
> 提示: 输入输出格式与 LeetCode 目前使用的方式一致，详情请参阅 LeetCode 序列化二叉树的格式。你并非必须采取这种方式，你也可以采用其他的方法解决这个问题。
>
> ![img](https://assets.leetcode.com/uploads/2020/09/15/serdeser.jpg)
>
> ```
> 输入：root = [1,2,3,null,null,4,5]
> 输出：[1,2,3,null,null,4,5]
> ```







### [114. 二叉树展开为链表](https://leetcode-cn.com/problems/flatten-binary-tree-to-linked-list/)

> 给你二叉树的根结点 root ，请你将它展开为一个单链表：
>
> - 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
> - 展开后的单链表应该与二叉树 先序遍历 顺序相同。
>
> ![img](https://assets.leetcode.com/uploads/2021/01/14/flaten.jpg)
>
> ```
> 输入：root = [1,2,5,3,4,null,6]
> 输出：[1,null,2,null,3,null,4,null,5,null,6]
> ```

思路：前序遍历后，得到顺序，然后遍历结果，重建一个 TreeNode，左子树都置为 null

```java
public void flatten(TreeNode node) {
  List<TreeNode> res = new ArrayList<>();
  preorder(node, res);
  int size = res.size();
  for (int i = 0; i < size; i++) {
    TreeNode pre = res.get(i);
    TreeNode curr = res.get(i + 1);
    pre.left = null;
    pre.right = curr;
  }
}

private void preorder(TreeNode node, List<TreeNode> res) {
  if (node == null) {
    return;
  }
  res.add(node);
  preorder(node.left, res);
  preorder(node.right, res);
}
```



