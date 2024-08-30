> 个人感觉动态规划是最难的，一会爬楼梯，一会兑零钱，一会又要去接雨水，炒股就不说了，还要去偷东西，哎，我太南了

![](https://cdn.nlark.com/yuque/0/2021/png/21674094/1639551516595-9b6a2bad-c55b-43e1-b172-ced36ffa96cc.png)

## 子序列问题

### [最长上升子序列_300](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

> 给定一个无序的整数数组，找到其中最长上升子序列的长度。
>
> ```
> 输入: [10,9,2,5,3,7,101,18]
> 输出: 4
> 解释: 最长的上升子序列是 [2,3,7,101]，它的长度是4。
> ```

PS： 注意「子序列」和「子串」这两个名词的区别，子串一定是连续的，而子序列不一定是连续的

> https://leetcode-cn.com/problems/longest-increasing-subsequence/solution/zui-chang-shang-sheng-zi-xu-lie-dong-tai-gui-hua-2/

这种题目看懂需要看动图

![img](https://labuladong.gitee.io/algo/images/%e6%9c%80%e9%95%bf%e9%80%92%e5%a2%9e%e5%ad%90%e5%ba%8f%e5%88%97/gif1.gif)

```java
 public static int getLengthOfLIS(int[] nums) {

   int len = nums.length;
   if (len < 2) {
     return len;
   }

   int[] dp = new int[len];
   Arrays.fill(dp, 1);

   for (int i = 0; i < len; i++) {
     for (int j = 0; j < i; j++) {
  //当 nums[i] <= nums[j]nums[i]<=nums[j] 时： nums[i]nums[i] 无法接在 nums[j]nums[j] 之后，此情况上升子序列不成立，跳过
       if (nums[i] > nums[j]) {
         //这里要注意是 nums[i] 还是 dp[i]
         dp[i] = Math.max(dp[i], dp[j] + 1);
       }
     }
   }
   int res = 0;
   for (int i = 0; i < len; i++) {
     res = Math.max(res, dp[i]);
   }
   return res;
 }
```

> 类似问题还有，最长递增子序列的个数、俄罗斯套娃信封问题





### [编辑距离（72）](https://leetcode.cn/problems/edit-distance/)

> 给你两个单词 `word1` 和 `word2`， *请返回将 `word1` 转换成 `word2` 所使用的最少操作数* 。
>
> 你可以对一个单词进行如下三种操作：
>
> - 插入一个字符
> - 删除一个字符
> - 替换一个字符
>
> ```
> 输入：word1 = "intention", word2 = "execution"
> 输出：5
> 解释：
> intention -> inention (删除 't')
> inention -> enention (将 'i' 替换为 'e')
> enention -> exention (将 'n' 替换为 'x')
> exention -> exection (将 'n' 替换为 'c')
> exection -> execution (插入 'u')
> ```





## [括号生成_22](https://leetcode-cn.com/problems/generate-parentheses/)

> 数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。
>
> ```
> 输入：n = 3
> 输出：["((()))","(()())","(())()","()(())","()()()"]
> ```
>
> ```
> 输入：n = 1
> 输出：["()"]
> ```

属于dfs





## 背包问题

### 0-1 背包问题

> 给你一个可装载重量为 `W` 的背包和 `N` 个物品，每个物品有重量和价值两个属性。其中第 `i` 个物品的重量为 `w[i]`，价值为 `v[i]`，现在让你用这个背包装物品，最多能装的价值是多少？
>
> ```
> 输入:W=5,N=3
> 	  w = [3, 2, 1], v = [5, 2, 3]
> 输出:8
> 解释:选择 i=0 和 i=2 这两件物品装进背包。它们的总重量 4 小于 W，同时可以获得最大价值 8。
> ```

