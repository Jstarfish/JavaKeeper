---
title: 股票买卖问题-套路解题
date: 2022-03-09
tags: 
 - DP
categories: leetcode
---

![](https://img.starfish.ink/leetcode/stock-profit-banner.png)

> 刷 labuladong-东哥 的文章时，发现这么宝藏的一篇，真是一个套路解决所有股票问题（文章主要来自英文版 leetcode 的题解翻译）
>
> - https://labuladong.gitee.io/algo/1/12/
>
> - https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/discuss/108870/Most-consistent-ways-of-dealing-with-the-series-of-stock-problems



leetcode 的股票问题目前总共有这么 6 题

- [121. 买卖股票的最佳时机（简单）](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

- [122. 买卖股票的最佳时机 II（简单）](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

- [123. 买卖股票的最佳时机 III（困难）](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)

- [188. 买卖股票的最佳时机 IV（困难）](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/)

- [309. 最佳买卖股票时机含冷冻期（中等）](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

- [714. 买卖股票的最佳时机含手续费（中等）](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)



不管是按热题去刷还是按 DP 分类去刷，这几道题都是避不开的，本文介绍的方法算是一个极其通用的“公式”，我们只需要搞清楚每个题目的“特例”后，套“公式”真的可以闭眼写出来，废话不多说了，直接解释

- prices[i] 存储股票第 i 天的价格，长度为 `prices.length`

- k 表示最大交易次数

- `dp[i][k]` 表示第 i 天，k 次交易的最大利润

- 特例：`dp[-1][k] = dp[i][0] = 0 `（没有股票或没有交易，就没有利润）

我们可以有多少种操作呢？ 答案是三种：buy, sell, rest，分别表示买入、卖出、不操作（休息）

那今天到底是哪个操作会是最大利润呢，求最值问题，想到用动态规划、max 函数

这里有一个隐藏的条件是，就是这三种操作有个先后顺序：

- buy 必须是在没有持仓的情况下
- sell 必须是在手里持仓为 1 的情况

![](https://img.starfish.ink/leetcode/stock-maxProfit.png)

所以 `dp[i][k]` 可以拆成两部分，用三维数组来表示：`dp[i][k][0]` 和 `dp[i][k][1]` ，意思是手里没有股票和手里有股票的最大利润

先考虑特例：

```java
dp[-1][k][0] = 0, dp[-1][k][1] = -Infinity
dp[i][0][0] = 0, dp[i][0][1] = -Infinity
```

> `dp[-1][k][0] = dp[i][0][0] = 0` 代表没有股票或者没有交易，又不持仓，肯定是没有利润
>
> `dp[-1][k][1] = dp[i][0][1] = -Infinity`  没有股票或者没有交易，不可能持仓吧?

递推关系（也就是 DP 中的状态转移方程）

```java
dp[i][k][0] = max(dp[i-1][k][0],dp[i-1][k][1] + prices[i]);
dp[i][k][1] = max(dp[i-1][k][1],dp[i-1][k-1][0] - prices[i]);
```

> `dp[i][k][0]`，今天的持仓是 0 ，所以今天不能是买入，只能是卖出或者不操作 取最大值：
>
> - 昨天就不持有了，也就是 `dp[i-1][k][0]`，我今天才可能持仓为 0
>   - 不管是昨天卖了还是昨天没动都是不持有，如果昨天是卖了的话，为什么不是 k-1 呢，因为一次交易对应的是一对操作，买入 + 卖出，只有买入算是开启一次新交易，才会改变最大交易次数
>
> - 今天卖出的话，昨天就必须持有才行，`dp[i-1][k][1]`，为什么还有个 `+ prices[i]`呢，最开始我有点迷糊，这怎么利润还算上股价了，这里是这么算的，我们第一天买入的话，利润就是 `-prices[i]` 了，所以最后如果卖出的话，要加上今日股价
>
> `dp[i][k][1]`，今天的持仓是 1 ，所以今天不能卖出，只能是买入或者昨天就持有 取最大值：
>
> - 昨天就持有，最大交易次数 k，也就是 `dp[i-1][k][1]`
> - 今天买入的话，昨天就不能持有，而且要满足今日最大交易次数是 k 的限制，所以昨天是 k-1 次交易，也就是 `dp[i-1][k-1][0]`，再减去今日股价



###  [121. 买卖股票的最佳时机 | k = 1](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

> 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
>
> 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
>
> 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
>
> ```
> 输入：[7,1,5,3,6,4]
> 输出：5
> 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
>   注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
> ```

Case 1，k = 1

```
dp[i][1][0] = max(dp[i-1][1][0], dp[i-1][1][1] + prices[i])
dp[i][1][1] = max(dp[i-1][1][1], dp[i-1][0][0] - prices[i]) 
            = max(dp[i-1][1][1], -prices[i])
解释：k = 0 的 base case，所以 dp[i-1][0][0] = 0。

现在发现 k 都是 1，不会改变，即 k 对状态转移已经没有影响了。
可以进行进一步化简去掉所有 k：
dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])
dp[i][1] = max(dp[i-1][1], -prices[i])
```

套用公式，写出代码：

```java
// 原始版本
int maxProfit_k_1(int[] prices) {
  int n = prices.length;
  int[][] dp = new int[n][2];
  //特例
  dp[0][0] = 0;
  dp[0][1] = -prices[0];

  for(int i = 1;i<n;i++){
    dp[i][0] = Math.max(dp[i-1][0],dp[i-1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i-1][1],-prices[i]);
  }
  return dp[n-1][0];
}
```

空间复杂度优化版本

```java
int maxProfit_k_1(int[] prices) {
    int n = prices.length;
    // base case: dp[-1][0] = 0, dp[-1][1] = -infinity
    int dp_i_0 = 0, dp_i_1 = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        // dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])
        dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i]);
        // dp[i][1] = max(dp[i-1][1], -prices[i])
        dp_i_1 = Math.max(dp_i_1, -prices[i]);
    }
    return dp_i_0;
}
```

再整理一下，完美

```java
public int maxProfit(int[] prices) {
  int maxCur = 0, maxSoFar = 0;
  for(int i = 1; i < prices.length; i++) {
    maxCur = Math.max(0, maxCur += prices[i] - prices[i-1]);
    maxSoFar = Math.max(maxCur, maxSoFar);
  }
  return maxSoFar;
}
```



### [122. 买卖股票的最佳时机 II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/) | k 不限制

> 给定一个数组 prices ，其中 prices[i] 表示股票第 i 天的价格。
>
> 在每一天，你可能会决定购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以购买它，然后在 同一天 出售。
> 返回 你能获得的 最大 利润 。
>
> ```java
> 输入: prices = [7,1,5,3,6,4]
> 输出: 7
> 解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
>      随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
> ```

题目中说可以随便交易，也就是 k 不限制了，当天买了当天就能卖（T+0），假设 k 无穷大，那就可以认为 k 和 k-1 是一样的，套公式

```java
dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][1] + prices[i])
dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i]) = max(dp[i-1][k][1], dp[i-1][k][0] - prices[i])

k 和 k-1 相同时，发现数组中的 k 其实没有变化，也就可以不记录 k 这个状态了
dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])
dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i])  
```

直接上代码：

```java
// 原始版本
int maxProfit_k_inf(int[] prices) {
    int n = prices.length;
    int[][] dp = new int[n][2];
    dp[0][0] = 0;
    dp[0][1] = -prices[0];
    for (int i = 1; i < n; i++) {
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][1] + prices[i]);
        // 这一步是和k=1 不一样的地方
        dp[i][1] = Math.max(dp[i-1][1], dp[i-1][0] - prices[i]);
    }
    return dp[n - 1][0];
}

// 空间复杂度优化版本
//每一天的状态只与前一天的状态有关，而与更早的状态都无关，因此我们不必存储这些无关的状态，
//只需要将 dp[i-1][0] 和 dp[i−1][1] 存放在两个变量中
int maxProfit_k_inf(int[] prices) {
    int n = prices.length;
    int dp_i_0 = 0, dp_i_1 = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        int temp = dp_i_0;
        dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i]);
        dp_i_1 = Math.max(dp_i_1, temp - prices[i]);
    }
    return dp_i_0;
}
```



### [123. 买卖股票的最佳时机 III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/) | k = 2

> 给定一个数组，它的第 i 个元素是一支给定的股票在第 i 天的价格。
>
> 设计一个算法来计算你所能获取的最大利润。你最多可以完成 两笔 交易。
>
> 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
>
> ```
> 输入：prices = [3,3,5,0,0,3,1,4]
> 输出：6
> 解释：在第 4 天（股票价格 = 0）的时候买入，在第 6 天（股票价格 = 3）的时候卖出，这笔交易所能获得利润 = 3-0 = 3 。
>      随后，在第 7 天（股票价格 = 1）的时候买入，在第 8 天 （股票价格 = 4）的时候卖出，这笔交易所能获得利润 = 4-1 = 3 。
> ```

这道题是 k = 2，前两道我们都消除了 k ，换成了二维数组

这道题，我们不能消除 k，而且题目说最多两次交易，那我们要穷举出 1 次交易 和 2 次交易的结果，才能知道哪种收益最高

```java
public static int getMaxProfit(int[] prices){
  int max_k = 2;
  int n = prices.length;
  int dp[][][] = new int[n][3][2];

  //特例
  // dp[0][1][0] = 0;
  // dp[0][1][1] = - prices[0];
  // dp[0][2][0] = 0;
  // dp[0][2][1] = - prices[0];

  for (int i = 0; i < prices.length; i++) {
    for (int k = 1; k <= max_k; k++) {
      //特例
      if (i == 0) {
        dp[0][k][0] = 0;
        dp[0][k][1] = -prices[i];
        continue;
      }
      
      dp[i][k][0] = Math.max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);
      dp[i][k][1] = Math.max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);
    }
  }
  return dp[n - 1][max_k][0];
}
```



### [188. 买卖股票的最佳时机 IV](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/) | k 不限制

> 给定一个整数数组 prices ，它的第 i 个元素 prices[i] 是一支给定的股票在第 i 天的价格。
>
> 设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。
>
> 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
>
> ```
> 输入：k = 2, prices = [3,2,6,5,0,3]
> 输出：7
> 解释：在第 2 天 (股票价格 = 2) 的时候买入，在第 3 天 (股票价格 = 6) 的时候卖出, 这笔交易所能获得利润 = 6-2 = 4 。
>   随后，在第 5 天 (股票价格 = 0) 的时候买入，在第 6 天 (股票价格 = 3) 的时候卖出, 这笔交易所能获得利润 = 3-0 = 3 。
> ```

这个题目的 k 看似也是不限制，和 122 有点像，我们处理 122 的时候，把 k 看做无穷大，直接过滤了，我们看作是 T+0 交易，这道题是有限制的，不能同时参与多笔交易，其实就是 T+1

一次交易由买入和卖出构成，至少需要两天。如果 prices 数组长度 n，那其实买卖最多 n/2 次，也就是 k <= n/2

```java
public static int getMaxProfit(int max_k, int[] prices) {
  int n = prices.length;

  if (n <= 1) {
    return 0;
  }

  //因为一次交易至少涉及两天，所以如果k大于总天数的一半，就直接取天数一半即可，多余的交易次数是无意义的
  max_k = Math.min(max_k, n / 2);

  int[][][] dp = new int[n][max_k + 1][2];
  //特例:第1天，不持有随便交易 0，持有的话就是 -prices[0]
  for (int k = 0; k <= max_k; k++) {
    dp[0][k][0] = 0;
    dp[0][k][1] = -prices[0];
  }

  for (int i = 1; i < n; i++) {
    for (int k = 1; k <= max_k; k++) {
      dp[i][k][0] = Math.max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);
      dp[i][k][1] = Math.max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);
    }
  }
  return dp[n - 1][max_k][0];
}

```



### [309. 最佳买卖股票时机含冷冻期](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

> 给定一个整数数组prices，其中第  prices[i] 表示第 i 天的股票价格 。
>
> 设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）:
>
> 卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。
> 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
>
> ```
> 输入: prices = [1,2,3,0,2]
> 输出: 3 
> 解释: 对应的交易状态为: [买入, 卖出, 冷冻期, 买入, 卖出]
> ```

这里加了一个冷冻期的概念，sell 后不能 直接 buy，需要冷静冷静，也是不限次数 k，思路和 122 一样，加一个冷冻期的状态

拿出我们的万能公式再看一眼

```
dp[i][k][0] = max(dp[i-1][k][0],dp[i-1][k][1] + prices[i]);
dp[i][k][1] = max(dp[i-1][k][1],dp[i-1][k-1][0] - prices[i]);
```

 因为有冷冻期的存在，如果我们不能在 i-1 天买入，要 buy 的话，必须等 1 天，也就是持仓公式中 `dp[i-1][k-1][0]` 买入的话，需要再往前1 天才能买入，即 `dp[i-2][k-1][0]`

```
dp[i][k][1] = max(dp[i-1][k][1],dp[i-2][k-1][0] - prices[i]);
```

剩下得就是套公式，和 122 一样了

```java
public static int maxProfit(int[] prices) {
  int len = prices.length;
  if (len < 2) {
    return 0;
  }
  //特例
  int[][] dp = new int[len][2];
  dp[0][0] = 0;
  dp[0][1] = -prices[0];
  for (int i = 1; i < len; i++) {
    // 卖出状态
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    // 买入状态，比122 多加了一个if-else
    if (i < 2) {
      // 前三天不用考虑冷冻期的问题，因为不可能出现冷冻期
      dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
    } else {
      // 从第4天开始，买入考虑一天的冷冻期
      dp[i][1] = Math.max(dp[i - 1][1], dp[i - 2][0] - prices[i]);
    }
  }
  return dp[len - 1][0];
}
```



### [714. 买卖股票的最佳时机含手续费](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

> 给定一个整数数组 prices，其中 prices[i] 表示第 i 天的股票价格 ；整数 fee 代表了交易股票的手续费用。
>
> 你可以无限次地完成交易，但是你每笔交易都需要付手续费。如果你已经购买了一个股票，在卖出它之前你就不能再继续购买股票了。
>
> 返回获得利润的最大值。
>
> 注意：这里的一笔交易指买入持有并卖出股票的整个过程，每笔交易你只需要为支付一次手续费。
>
> ```
> 输入：prices = [1, 3, 2, 8, 4, 9], fee = 2
> 输出：8
> 解释：能够达到的最大利润:  
> 在此处买入 prices[0] = 1
> 在此处卖出 prices[3] = 8
> 在此处买入 prices[4] = 4
> 在此处卖出 prices[5] = 9
> 总利润: ((8 - 1) - 2) + ((9 - 4) - 2) = 8
> ```

这个题，其实又是和 122 类似，k 不限制，只是多了一个手续费，这个手续费我们可以选择在买入时候交，也可以选择再卖出时候交，那通用公式就可以变成

```
dp[i][k][0] = max(dp[i-1][k][0],dp[i-1][k][1] + prices[i]);
dp[i][k][1] = max(dp[i-1][k][1],dp[i-1][k-1][0] - prices[i] - free);   //买入时候交
```

或者卖出时候交

```
dp[i][k][0] = max(dp[i-1][k][0],dp[i-1][k][1] + prices[i] - free);
dp[i][k][1] = max(dp[i-1][k][1],dp[i-1][k-1][0] - prices[i]);   //买入时候交
```

直接上代码吧

```java
public static int getMaxProfit(int[] prices, int fee) {
  int n = prices.length;
  int[][] dp = new int[n][2];

  dp[0][0] = 0;
  dp[0][1] = -prices[0];

  for (int i = 1; i < n; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i] - fee);
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
  }
  return dp[n - 1][0];
}
```

