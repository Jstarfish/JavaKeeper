---
title: 动态规划 通关秘籍
date: 2025-07-08
tags: 
 - DP
categories: leetcode
---

> 个人感觉动态规划是最难的，一会爬楼梯，一会兑零钱，一会又要去接雨水，炒股就不说了，还要去偷东西，哎，我太南了

![](https://cdn.nlark.com/yuque/0/2021/png/21674094/1639551516595-9b6a2bad-c55b-43e1-b172-ced36ffa96cc.png)

## 子序列问题

一旦涉及到子序列和最值，那几乎可以肯定，**考察的是动态规划技巧，时间复杂度一般都是 $O(n^2)$**

两种思路

**1、第一种思路模板是一个一维的 dp 数组**

```java
int n = array.length;
int[] dp = new int[n];

for (int i = 1; i < n; i++) {
    for (int j = 0; j < i; j++) {
        dp[i] = 最值(dp[i], dp[j] + ...)
    }
}

```

**2、第二种思路模板是一个二维的 dp 数组**：

```java
int n = arr.length;
int[][] dp = new dp[n][n];

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        if (arr[i] == arr[j]) 
            dp[i][j] = dp[i][j] + ...
        else
            dp[i][j] = 最值(...)
    }
}

```



### [最长上升子序列_300](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

> 给定一个无序的整数数组，找到其中最长上升子序列的长度。
>
> ```
> 输入: [10,9,2,5,3,7,101,18]
> 输出: 4
> 解释: 最长的上升子序列是 [2,3,7,101]，它的长度是4。
> ```

PS： 注意「子序列」和「子串」这两个名词的区别，子串一定是连续的，而子序列不一定是连续的

![](https://writings.sh/assets/images/posts/algorithm-longest-increasing-subsequence/longest-increasing-subsequence-dp1-2.jpeg)

```java
 public int getLengthOfLIS(int[] nums) {

   int[] dp = new int[nums.length];
   Arrays.fill(dp, 1);

   int maxLength = 1;
   for (int i = 0; i < nums.length; i++) {
     for (int j = 0; j < i; j++) {
     //当 nums[i] <= nums[j] 时： nums[i] 无法接在 nums[j]之后，此情况上升子序列不成立，跳过，不是比较dp[i]和dp[j]
       if (nums[i] > nums[j]) {
         //这里要注意是 nums[i] 还是 dp[i]
         // 寻找 nums[0..j-1] 中比 nums[i] 小的元素
         // 把 nums[i] 接在后面，即可形成长度为 dp[j] + 1，
            // 且以 nums[i] 为结尾的递增子序列
         dp[i] = Math.max(dp[i], dp[j] + 1);
       }
     }
     maxLength = Math.max(maxLength, dp[i]);
   }
   return res;
 }
```

> 类似问题还有，最长递增子序列的个数、俄罗斯套娃信封问题



### [最大子数组和_53](https://leetcode.cn/problems/maximum-subarray/)

> 给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
>
> **子数组**  是数组中的一个连续部分。
>
> ```
> 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
> 输出：6
> 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
> ```

思路：

`dp[i]` 有两种「选择」，要么与前面的相邻子数组连接，形成一个和更大的子数组；要么不与前面的子数组连接，自成一派，自己作为一个子数组。
`dp[i] = Math.max(nums[i], nums[i] + dp[i - 1]);`

```java
int maxSubArray(int[] nums) {
    int n = nums.length;
    if (n == 0) return 0;
    int[] dp = new int[n];
    // base case
    // 第一个元素前面没有子数组
    dp[0] = nums[0];
    // 状态转移方程
    for (int i = 1; i < n; i++) {
        dp[i] = Math.max(nums[i], nums[i] + dp[i - 1]);
    }
    // 得到 nums 的最大子数组
    int res = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        res = Math.max(res, dp[i]);
    }
    return res;
}

```



### [最长公共子序列_1143](https://leetcode.cn/problems/longest-common-subsequence/)

> 给定两个字符串 `text1` 和 `text2`，返回这两个字符串的最长 **公共子序列** 的长度。如果不存在 **公共子序列** ，返回 `0` 。
>
> 一个字符串的 **子序列** 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
>
> - 例如，`"ace"` 是 `"abcde"` 的子序列，但 `"aec"` 不是 `"abcde"` 的子序列。
>
> 两个字符串的 **公共子序列** 是这两个字符串所共同拥有的子序列。
>
> ```
> 输入：text1 = "abcde", text2 = "ace" 
> 输出：3  
> 解释：最长公共子序列是 "ace" ，它的长度为 3 。
> ```

思路：

两个字符串这种，算是典型的二维动态规划问题

![img](https://gitee.com/labuladong/pictures/raw/master/LCS/dp.png)为了方便理解此表，我们暂时认为索引是从 1 开始的，待会的代码中只要稍作调整即可。其中，`dp[i][j]` 的含义是：对于 `s1[1..i]` 和 `s2[1..j]`，它们的 LCS 长度是 `dp[i][j]`。

比如上图的例子，d[2][4] 的含义就是：对于 `"ac"` 和 `"babc"`，它们的 LCS 长度是 2。我们最终想得到的答案应该是 `dp[3][6]`。

![img](https://gitee.com/labuladong/pictures/raw/master/LCS/lcs.png)求 `s1` 和 `s2` 的最长公共子序列，不妨称这个子序列为 `lcs`。那么对于 `s1` 和 `s2` 中的每个字符，有什么选择？很简单，两种选择，要么在 `lcs` 中，要么不在。这个「在」和「不在」就是选择，关键是，应该如何选择呢？这个需要动点脑筋：如果某个字符应该在 `lcs` 中，那么这个字符肯定同时存在于 `s1` 和 `s2` 中，因为 `lcs` 是最长**公共**子序列嘛

用两个指针 `i` 和 `j` 从后往前遍历 `s1` 和 `s2`，如果 `s1[i]==s2[j]`，那么这个字符**一定在 `lcs` 中**；否则的话，`s1[i]`和 `s2[j]` 这两个字符**至少有一个不在 `lcs` 中**，需要丢弃一个

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int n = text1.length(), m =  text2.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= m; ++j) {
               //这边找到一个 lcs 的元素，继续往前找
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = f[i - 1][j - 1] + 1;
                } else {
                    //谁能让 lcs 最长，就听谁的
                    dp[i][j] = Math.max(f[i - 1][j], f[i][j - 1]);
                }
            }
        }
        return dp[n][m];
    }
}

```



### [最长回文子序列_516](https://leetcode.cn/problems/longest-palindromic-subsequence/)

> 给你一个字符串 `s` ，找出其中最长的回文子序列，并返回该序列的长度。
>
> 子序列定义为：不改变剩余字符顺序的情况下，删除某些字符或者不删除任何字符形成的一个序列。
>
> ```
> 输入：s = "bbbab"
> 输出：4
> 解释：一个可能的最长回文子序列为 "bbbb" 
> ```





## 背包问题

### 0-1 背包问题

> 给定 n 个物品，第 个物品的重量为 wgt[i-1]、价值为 val[i-1] ，和一个容量为 cap 的背包。每个物品只能选择一次，问在限定背包容量下能放入物品的最大价值。
>

![](https://www.hello-algo.com/chapter_dynamic_programming/knapsack_problem.assets/knapsack_example.png)

我们可以将 0-1 背包问题看作一个由 轮决策组成的过程，对于每个物体都有不放入和放入两种决策，因此该问题满足决策树模型。

该问题的目标是求解“在限定背包容量下能放入物品的最大价值”，因此较大概率是一个动态规划问题。

1. 定义状态：当前物品编号 i 和背包容量  c，记为 `[i,c]`。**前 i 个物品在容量为 c 的背包中的最大价值**，记为 `dp[i,c]`

2. 转移方程：对于每个物品来说，不放入背包，背包容量不变；放入背包，背包容量减小

   当我们做出物品 的决策后，剩余的是前 个物品决策的子问题，可分为以下两种情况

   - **不放入物品** ：背包容量不变，最大价值 `dp[i][c]` 应该等于 `dp[i-1][c]`，继承之前的结果。
   - **放入物品** ：背包容量减少 `wgt[i-1]`，价值增加 `val[i-1]`，状态变化为 `[i-1, c-w[i-1]]`

​	`dp[i,c] = Math.max(dp[i-1][c],dp[i-1, c-wgt[i-1]]+val[i+1])`

​	若当前物品重量 `wgt[i-1]` 超出剩余背包容量 c，则只能选择不放入背包

3. 确定 base case：`dp[0][..] = dp[..][0] = 0`，因为没有物品或者背包没有空间的时候，能装的最大价值就是 0。

```java
int knapsackDP(int[] wgt, int[] val, int cap) {
    int n = wgt.length;
    // 初始化 dp 表
    int[][] dp = new int[n + 1][cap + 1];
    // 状态转移
    for (int i = 1; i <= n; i++) {
        for (int c = 1; c <= cap; c++) {
            if (wgt[i - 1] > c) {
                // 若超过背包容量，则不选物品 i
                dp[i][c] = dp[i - 1][c];
            } else {
                // 不选和选物品 i 这两种方案的较大值
                dp[i][c] = Math.max(dp[i - 1][c], dp[i - 1][c - wgt[i - 1]] + val[i - 1]);
            }
        }
    }
    return dp[n][cap];
}
```



### 完全背包问题

> 给定 n 个物品，第 i 个物品的重量为 *wgt[i-1]* 、价值为 *val[i-1]*，和一个容量为 *cap* 的背包。**每个物品可以重复选取**，问在限定背包容量下能放入物品的最大价值![](https://www.hello-algo.com/chapter_dynamic_programming/unbounded_knapsack_problem.assets/unbounded_knapsack_example.png)

思路：完全背包问题和 0-1 背包问题非常相似，**区别仅在于不限制物品的选择次数**

```java
/* 完全背包：动态规划 */
int unboundedKnapsackDP(int[] wgt, int[] val, int cap) {
    int n = wgt.length;
    // 初始化 dp 表
    int[][] dp = new int[n + 1][cap + 1];
    // 状态转移
    for (int i = 1; i <= n; i++) {
        for (int c = 1; c <= cap; c++) {
            if (wgt[i - 1] > c) {
                // 若超过背包容量，则不选物品 i
                dp[i][c] = dp[i - 1][c];
            } else {
                // 不选和选物品 i 这两种方案的较大值
                dp[i][c] = Math.max(dp[i - 1][c], dp[i][c - wgt[i - 1]] + val[i - 1]);
            }
        }
    }
    return dp[n][cap];
}
```



### [分割等和子集_416](https://leetcode.cn/problems/partition-equal-subset-sum/)

> 给你一个 **只包含正整数** 的 **非空** 数组 `nums` 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。
>
> ```
> 输入：nums = [1,5,11,5]
> 输出：true
> 解释：数组可以分割成 [1, 5, 5] 和 [11] 。
> ```

思路：这也算背包问题，要转化下想法，**给一个可装载重量为 `sum / 2` 的背包和 `N` 个物品，每个物品的重量为 `nums[i]`。现在让你装物品，是否存在一种装法，能够恰好将背包装满**？  现在变成了背包问题

1. 定义状态：**`dp[i][j] = x` 表示，对于前 `i` 个物品（`i` 从 1 开始计数），当前背包的容量为 `j` 时，若 `x`为 `true`，则说明可以恰好将背包装满，若 `x` 为 `false`，则说明不能恰好将背包装满** `boolean[][] dp = new boolean[n + 1][sum + 1];`

2. 转移方程：以 `nums[i]` 算不算入子集来看

   - **不算（不放入背包）** ：不把这第 `i` 个物品装入背包，而且还装满背包，那就看上一个状态 `dp[i-1][j]`，继承之前的结果

   - **算入子集（放入物品）** ：是否能够恰好装满背包，取决于状态 `dp[i-1][j-nums[i-1]]`

3. base case： `dp[..][0] = true` 和 `dp[0][..] = false`

```java
public boolean canPartition(int[] nums) {
      int sum = 0;
      for (int num : nums) sum += num;
      // 和为奇数时，不可能划分成两个和相等的集合
      if (sum % 2 != 0) return false;
      int n = nums.length;
      sum = sum / 2;
      boolean[][] dp = new boolean[n + 1][sum + 1];
      // base case
      for (int i = 0; i <= n; i++)
          dp[i][0] = true;

      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= sum; j++) {
              if (j - nums[i - 1] < 0) {
                  // 背包容量不足，不能装入第 i 个物品
                  dp[i][j] = dp[i - 1][j];
              } else {
                  // 装入或不装入背包
                  dp[i][j] = dp[i - 1][j] || dp[i - 1][j - nums[i - 1]];
              }
          }
      }
      return dp[n][sum];
}

```

空间优化，**`dp[i][j]` 都是通过上一行 `dp[i-1][..]` 转移过来的**，之前的数据都不会再使用了。

```java
public boolean canPartition(int[] nums) {
      int sum = 0;
      for (int num : nums) sum += num;
      // 和为奇数时，不可能划分成两个和相等的集合
      if (sum % 2 != 0) return false;
      int n = nums.length;
      sum = sum / 2;
      boolean[] dp = new boolean[sum + 1];

      // base case
      dp[0] = true;

      for (int i = 0; i < n; i++) {
          for (int j = sum; j >= 0; j--) {
              if (j - nums[i] >= 0) {
                  dp[j] = dp[j] || dp[j - nums[i]];
              }
          }
      }
      return dp[sum];
}
```



### [零钱兑换_322](https://leetcode.cn/problems/coin-change/)

> 给你一个整数数组 `coins` ，表示不同面额的硬币；以及一个整数 `amount` ，表示总金额。
>
> 计算并返回可以凑成总金额所需的 **最少的硬币个数** 。如果没有任何一种硬币组合能组成总金额，返回 `-1` 。
>
> 你可以认为每种硬币的数量是无限的。
>
> ```
> 输入：coins = [1, 2, 5], amount = 11
> 输出：3 
> 解释：11 = 5 + 5 + 1
> ```

思路：

**零钱兑换可以看作完全背包问题的一种特殊情况**

- “物品”对应“硬币”、“物品重量”对应“硬币面值”、“背包容量”对应“目标金额”。
- 优化目标相反，完全背包问题是要最大化物品价值，零钱兑换问题是要最小化硬币数量

1. 定义状态：只使用 `coins` 中的前 `i` 个（`i` 从 1 开始计数）硬币的面值，若想凑出金额 `j`，最少有 `dp[i][j]` 种凑法
2. 状态转移方程：`dp[i][j] = Math.min(dp[i-1][j],dp[i,j-coins[i-1]+1])`
3. base case：`dp[0][a] = MAX`



```java
/* 零钱兑换：动态规划 */
int coinChangeDP(int[] coins, int amt) {
    int n = coins.length;
    //amt + 1 表示无效解
    int MAX = amt + 1;
    // 初始化 dp 表
    int[][] dp = new int[n + 1][amt + 1];
    // 状态转移：首行首列
    for (int a = 1; a <= amt; a++) {
        dp[0][a] = MAX;
    }
    // 状态转移：其余行和列
    for (int i = 1; i <= n; i++) {
        for (int a = 1; a <= amt; a++) {
            if (coins[i - 1] > a) {
                // 若超过目标金额，则不选硬币 i
                dp[i][a] = dp[i - 1][a];
            } else {
                // 不选和选硬币 i 这两种方案的较小值  ，硬币数量而非商品价值，因此在选中硬币时执行 +1 
                dp[i][a] = Math.min(dp[i - 1][a], dp[i][a - coins[i - 1]] + 1);
            }
        }
    }
    return dp[n][amt] != MAX ? dp[n][amt] : -1;
}
```

![](https://www.hello-algo.com/chapter_dynamic_programming/unbounded_knapsack_problem.assets/coin_change_dp_step1.png)空间优化后

```java
/* 零钱兑换：空间优化后的动态规划 */
int coinChangeDPComp(int[] coins, int amt) {
    int n = coins.length;
    int MAX = amt + 1;
    // 初始化 dp 表
    int[] dp = new int[amt + 1];
    Arrays.fill(dp, MAX);
    dp[0] = 0;
    // 状态转移
    for (int i = 1; i <= n; i++) {
        for (int a = 1; a <= amt; a++) {
            if (coins[i - 1] > a) {
                // 若超过目标金额，则不选硬币 i
                dp[a] = dp[a];
            } else {
                // 不选和选硬币 i 这两种方案的较小值
                dp[a] = Math.min(dp[a], dp[a - coins[i - 1]] + 1);
            }
        }
    }
    return dp[amt] != MAX ? dp[amt] : -1;
}
```



### [零钱兑换 II_518](https://leetcode.cn/problems/coin-change-ii/)

> 给你一个整数数组 `coins` 表示不同面额的硬币，另给一个整数 `amount` 表示总金额。
>
> 请你计算并返回可以凑成总金额的硬币组合数。如果任何硬币组合都无法凑出总金额，返回 `0` 。
>
> 假设每一种面额的硬币有无限个。 
>
> 题目数据保证结果符合 32 位带符号整数。
>
> ```
> 输入：amount = 5, coins = [1, 2, 5]
> 输出：4
> 解释：有四种方式可以凑成总金额：
> 5=5
> 5=2+2+1
> 5=2+1+1+1
> 5=1+1+1+1+1
> ```

思路：

可以把这个问题转化为背包问题的描述形式：

有一个背包，最大容量为 `amount`，有一系列物品 `coins`，每个物品的重量为 `coins[i]`，**每个物品的数量无限**。请问有多少种方法，能够把背包恰好装满？

这个问题和我们前面讲过的两个背包问题，有一个最大的区别就是，每个物品的数量是无限的，这也就是传说中的「**完全背包问题**」，

1. 定义状态：**若只使用 `coins` 中的前 `i` 个（`i` 从 1 开始计数）硬币的面值，若想凑出金额 `j`，有 `dp[i][j]` 种凑法**。
2. base case 为 `dp[0][..] = 0, dp[..][0] = 1`。`i = 0` 代表不使用任何硬币面值，这种情况下显然无法凑出任何金额；`j = 0` 代表需要凑出的目标金额为 0，那么什么都不做就是唯一的一种凑法





### [最小路径和_64](https://leetcode.cn/problems/minimum-path-sum/)

> 给定一个包含非负整数的 `m * x ` 网格 `grid` ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
>
> **说明：**每次只能向下或者向右移动一步。
>
> ![img](https://assets.leetcode.com/uploads/2020/11/05/minpath.jpg)
>
> ```
> 输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
> 输出：7
> 解释：因为路径 1→3→1→1→1 的总和最小。
> ```

思路：

递归解法，dp[i][l]

```java
int dp(int[][] grid, int i, int j) {
    // base case
    if (i == 0 && j == 0) {
        return grid[0][0];
    }
    // 如果索引出界，返回一个很大的值，
    // 保证在取 min 的时候不会被取到
    if (i < 0 || j < 0) {
        return Integer.MAX_VALUE;
    }

    // 左边和上面的最小路径和加上 grid[i][j]
    // 就是到达 (i, j) 的最小路径和
    return Math.min(
            dp(grid, i - 1, j), 
            dp(grid, i, j - 1)
        ) + grid[i][j];
}
```



## 股票问题

 [[stock-problems]]





## 其他热题

### [编辑距离_72](https://leetcode.cn/problems/edit-distance/)

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

思路：

编辑距离，也称 Levenshtein 距离，指两个字符串之间互相转换的最少修改次数，通常用于在信息检索和自然语言处理中度量两个序列的相似度。

1. 定义状态：设字符串 s 和 t 的长度分别为 m 和 n ，我们先考虑两字符串尾部的字符 *s[m-1]* 和 *t[n-1]*。

   - 若 *s[m-1]* 和  *t[n-1]* 相同，我们可以跳过它们，直接考虑  *s[m-2]*  和  *t[n-2]*。
   - 若 *s[m-1]* 和  *t[n-1]*  不同，我们需要对 s 进行一次编辑（插入、删除、替换），使得两字符串尾部的字符相同，从而可以跳过它们，考虑规模更小的问题

   也就是说，我们在字符串 中进行的每一轮决策（编辑操作），都会使得 s 和 t 中剩余的待匹配字符发生变化。因此，状态为当前在 s和 t 中考虑的第 i 和第 j  个字符，记为 `dp[i][j]`。

2. 状态转移方程：`dp[i][j]` 对应的两个字符串的尾部字符 `s[i-1]` 和 `t[j-1]` ，根据不同的编辑操作（增、删、改）可以有 3 种情况

   - 在  `s[i-1]`  之后添加 `t[j-1]` ，剩余子问题 `dp[i][j-1]`
   - 删除 `t[j-1]`，剩余子问题 `dp[i-1][j]`
   - 把 `s[i-1]`  替换为 `t[j-1]` ，剩余子问题 `dp[i-1][j-1]`

   最优步数是这 3 种情况的最小值，`dp[i][j] = Math.min(Math.min(dp[i][j - 1], dp[i - 1][j]), dp[i - 1][j - 1]) + 1`

   3. base case :  `dp[i][0] = i;`  `dp[0][j] = j;`

```java
/* 编辑距离：动态规划 */
int editDistanceDP(String s, String t) {
    int n = s.length(), m = t.length();
    int[][] dp = new int[n + 1][m + 1];
    // 状态转移：首行首列
    for (int i = 1; i <= n; i++) {
        dp[i][0] = i;
    }
    for (int j = 1; j <= m; j++) {
        dp[0][j] = j;
    }
    // 状态转移：其余行和列
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                // 若两字符相等，则直接跳过此两字符
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // 最少编辑步数 = 插入、删除、替换这三种操作的最少编辑步数 + 1
                dp[i][j] = Math.min(Math.min(dp[i][j - 1], dp[i - 1][j]), dp[i - 1][j - 1]) + 1;
            }
        }
    }
    return dp[n][m];
}
```



### [括号生成_22](https://leetcode-cn.com/problems/generate-parentheses/)

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

思路：属于dfs



### [最长回文子串_5](https://leetcode.cn/problems/longest-palindromic-substring/)

> 给你一个字符串 `s`，找到 `s` 中最长的 回文子串。
>
> ```
> 输入：s = "babad"
> 输出："bab"
> 解释："aba" 同样是符合题意的答案。
> ```

**思路**：**中心扩散法**，「中心扩散法」的基本思想是：遍历每一个下标，以这个下标为中心，利用「回文串」中心对称的特点，往两边扩散，直到不再满足回文的条件。

细节：回文串在长度为奇数和偶数的时候，「回文中心」的形态不一样：

- 奇数回文串的「中心」是一个具体的字符，例如：回文串 "aba" 的中心是字符 "b"；
- 偶数回文串的「中心」是位于中间的两个字符的「空隙」，例如：回文串 "abba" 的中心是两个 "b"，也可以看成两个 "b" 中间的空隙。

```java
public String longestPalindrome(String s){
    //处理边界
    if(s == null || s.length() < 2){
        return s;
    }

    //初始化start和maxLength变量，用来记录最长回文子串的起始位置和长度
    int start = 0, maxLength = 0;

    //遍历每个字符
    for (int i = 0; i < s.length(); i++) {
        //以当前字符为中心的奇数长度回文串
        int len1 = centerExpand(s, i, i);
        //以当前字符和下一个字符之间的中心的偶数长度回文串
        int len2 = centerExpand(s, i, i+1);

        int len = Math.max(len1, len2);

        //当前找到的回文串大于之前的记录，更新start和maxLength
        if(len > maxLength){
            // i 是当前扩展的中心位置， len 是找到的回文串的总长度，我们要用这两个值计算出起始位置 start
            // （len - 1)/2 为什么呢，计算中心到回文串起始位置的距离， 为什么不用 len/2， 这里考虑的是奇数偶数的通用性，比如'abcba' 和 'abba' 或者 'cabbad'，巧妙的同时处理两种，不需要分别考虑
            start = i - (len - 1)/2;
            maxLength = len;
        }

    }

    return s.substring(start, start + maxLength);
}

private int centerExpand(String s, int left, int right){
    while(left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)){
        left --;
        right ++;
    }
    //这个的含义： 假设扩展过程中，left 和 right 已经超出了回文返回， 此时回文范围是 (left+1,right-1), 那么回文长度= (right-1)-(left+1)+1=right-left-1
    return right - left - 1;
}
```



![img](https://pic.leetcode-cn.com/2f205fcd0493818129e8d3604b2d84d94678fda7708c0e9831f192e21abb1f34.png)
