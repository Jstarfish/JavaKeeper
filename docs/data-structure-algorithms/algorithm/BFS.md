





### [二叉树的最小深度_111](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

> 给定一个二叉树，找出其最小深度。
>
> 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
>
> 说明：叶子节点是指没有子节点的节点。
>
> 示例 1：
>
> ![img](https://assets.leetcode.com/uploads/2020/10/12/ex_depth.jpg)
>
> ```
> 输入：root = [3,9,20,null,null,15,7]
> 输出：2
> ```
>

思路：这里注意这个 `while` 循环和 `for` 循环的配合，**`while` 循环控制一层一层往下走，`for` 循环利用 `sz` 变量控制从左到右遍历每一层二叉树节点**：

![img](https://labuladong.online/algo/images/dijkstra/1.jpeg)

```java
class Solution {
    public int minDepth(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        // root 本身就是一层，depth 初始化为 1
        int depth = 1;
        
        while (!q.isEmpty()) {
            int sz = q.size();
            // 将当前队列中的所有节点向四周扩散
            for (int i = 0; i < sz; i++) {
                TreeNode cur = q.poll();
                // 判断是否到达终点
                if (cur.left == null && cur.right == null) 
                    return depth;
                // 将 cur 的相邻节点加入队列
                if (cur.left != null)
                    q.offer(cur.left);
                if (cur.right != null) 
                    q.offer(cur.right);
            }
            // 这里增加步数
            depth++;
        }
        return depth;
    }
}
```

