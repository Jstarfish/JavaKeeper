我们在做二叉树题目时候，第一想到的应该是用 **递归** 来解决。



### 前、中、后序遍历





### 翻转二叉树（226）

> 翻转一棵二叉树。
>
> **示例：**
>
> 输入：
>
> ```
>      4
>    /   \
>   2     7
>  / \   / \
> 1   3 6   9
> ```
>
> 输出：
>
> ```
>      4
>    /   \
>   7     2
>  / \   / \
> 9   6 3   1
> ```
>
> 思路：从根节点开始，递归地对树进行遍历，并从叶子节点先开始翻转

![226_2.gif](https://pic.leetcode-cn.com/0f91f7cbf5740de86e881eb7427c6c3993f4eca3624ca275d71e21c5e3e2c550-226_2.gif)



```java
public static TreeNode invertTree(TreeNode root) {
    if(root == null){
        return root;
    }
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
}
```



### 对称二叉树（101）

> 给定一个二叉树，检查它是否是镜像对称的。
>
> 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
>
>         1
>        / \
>       2   2
>      / \ / \
>     3  4 4  3
>
> 但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:
>
>         1
>        / \
>       2   2
>        \   \
>        3    3





### [ 二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

> 给定一个二叉树，找出其最大深度。
>
> 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
>
> 说明: 叶子节点是指没有子节点的节点。
>
> 示例：
> 给定二叉树 [3,9,20,null,null,15,7]，
>
>         3
>        / \
>       9  20
>         /  \
>        15   7
>
> 返回它的最大深度 3 。





### [合并二叉树](https://leetcode-cn.com/problems/merge-two-binary-trees/)

> 给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。
>
> 你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点。
>
> 示例 1:
>
> 输入: 
> 	Tree 1                     Tree 2                  
>           1                         2                             
>          / \                       / \                            
>         3   2                     1   3                        
>        /                           \   \                      
>       5                             4   7                  
> 输出: 
> 合并后的树:
> 	     3
> 	    / \
> 	   4   5
> 	  / \   \ 
> 	 5   4   7
> 注意: 合并必须从两个树的根节点开始。









### [ 二叉树的直径](https://leetcode-cn.com/problems/diameter-of-binary-tree/)

> 给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。
>
>  示例 :
> 给定二叉树
>
>           1
>          / \
>         2   3
>        / \     
>       4   5    
> 返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。 
>
> 注意：两结点之间的路径长度是以它们之间边的数目表示。
>





### [二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

> 给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。
>
>  示例：
> 二叉树：[3,9,20,null,null,15,7],
>
>         3
>        / \
>       9  20
>         /  \
>        15   7
> 
> 返回其层序遍历结果：
>
> ```
> [
>   [3],
>   [9,20],
>   [15,7]
> ]
> ```









### [不同的二叉搜索树](https://leetcode-cn.com/problems/unique-binary-search-trees/)

> 给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？返回满足题意的二叉搜索树的种数。
>
>  
>
> 示例 1：
>
> ![img](https://assets.leetcode.com/uploads/2021/01/18/uniquebstn3.jpg)
>
> ```
> 输入：n = 3
> 输出：5
> ```
>
> 示例 2：
>
> ```
> 输入：n = 1
> 输出：1
> ```



