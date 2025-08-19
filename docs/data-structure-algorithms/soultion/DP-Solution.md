---
title: 动态规划 通关秘籍
date: 2025-07-08
tags: 
 - DP
categories: leetcode
---

> 个人感觉动态规划是最难的，一会爬楼梯，一会兑零钱，一会又要去接雨水，炒股就不说了，还要去偷东西，太南了

![](https://cdn.nlark.com/yuque/0/2021/png/21674094/1639551516595-9b6a2bad-c55b-43e1-b172-ced36ffa96cc.png)

**解题心法**

1. **状态定义是核心**：明确`dp`数组的含义，确保子问题能被有效分解。
2. **转移方程从 "最后一步" 推导**：思考 " 计算`dp[i][j]`时，最后一步操作是什么 "（如编辑距离中的插入 / 删除 / 替换）。
3. **边界条件要清晰**：如`dp[0][j]`（空串与另一串的关系）、`dp[i][i]`（长度为 1 的区间）等。
4. **空间优化**：部分问题可通过滚动数组将二维`dp`优化为一维（如编辑距离、最长公共子序列）。



我们按分类，逐个攻破~

## 一、线性动态规划

线性动态规划的特点是**问题规模由单变量（或双变量）的位置表示**，状态推导按位置从小到大依次进行，较大规模的问题依赖较小规模的子问题。

### 1.1 单串问题

单串问题的输入为一个字符串或数组，状态通常定义为`dp[i]`，表示 " 考虑前`i`个元素（`[0..i]`）时的最优解 "。

**状态定义**：`dp[i]` 表示以第 `i` 个元素为结尾的子问题的解（如子序列、子数组）。

#### 1.1.1 依赖比 i 小的 O(1) 个子问题

`dp[i]` 仅与 `dp[i-1]` 等少数几个更小的子问题相关，时间复杂度通常为`O(n)`。

![状态推导方向1](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/08/09/2-2-1.png)

比如最大子数组和（53 题）：`dp[i]` 依赖 `dp[i-1]`，判断是否延续前序子数组。

##### [最大子数组和_53](https://leetcode.cn/problems/maximum-subarray/)

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

- 状态定义：`dp[i]` 表示以 `nums[i]`结尾的最大子数组和。

- 转移方程：若`dp[i-1]`为正，则将其与`nums[i]`拼接，否则仅保留`nums[i]`，即 `dp[i] = Math.max(nums[i], nums[i] + dp[i - 1]);`

```java
public int maxSubArray(int[] nums) {
    //特判
    if (nums == null || nums.length == 0) {
        return 0;
    }
    //初始化
    int length = nums.length;
    int[] dp = new int[length];
    // 初始值,只有一个元素的时候最大和即它本身
    dp[0] = nums[0];
    int ans = nums[0];
    // 状态转移
    for (int i = 1; i < length; i++) {
        // 取当前元素的值 和 当前元素的值加上一次结果的值 中最大数
        dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
        // 输出结果：和最大数对比 取大
        ans = Math.max(ans, dp[i]);
    }
    return ans;
}
```



##### [单词拆分_139](https://leetcode.cn/problems/word-break/)

> 给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 `s` 则返回 `true`。
>
> **注意：**不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。
>
> ```
> 输入: s = "applepenapple", wordDict = ["apple", "pen"]
> 输出: true
> 解释: 返回 true 因为 "applepenapple" 可以由 "apple" "pen" "apple" 拼接成。
>   注意，你可以重复使用字典中的单词。
> ```

思路：

1. 创建一个布尔数组`dp`，其中`dp[i]`表示字符串`s`的前`i`个字符（即子串`s.substring(0, i)`）是否可以被拆分。
2. 初始化`dp[0]`为`true`，表示空字符串可以被拆分。
3. 遍历每个位置`i`从 1 到字符串长度，对于每个`i`，再遍历所有可能的分割点`j`（`j`从 0 到`i-1`），检查子串`s.substring(j, i)`是否在字典中，并且前`j`个字符是否可以被拆分（即`dp[j]`是否为`true`）。

```java
public boolean wordBreak(String s, List<String> wordDict){
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    // 空字符串总是可以被拆分的
    dp[0] = true;

    // 遍历字符串的每个位置
    for(int i = 1; i< n; i++){
        // 尝试从当前位置向前拆分字符串
        for(int j = 0; j < i; j++){
            // 如果dp[j]为true，且s.substring(j, i)是字典中的一个单词
            if(dp[j] && wordDict.coitains(s.substring(j, i))){
                // 则设置dp[i]为true，表示s的前i个字符也可以被拆分
                dp[i] = true;
                // 找到一种拆分方式后，可以跳出内层循环
                break;
            }
        }
    }
    return dp[n];
}
```



##### [杨辉三角_118](https://leetcode.cn/problems/pascals-triangle/)

> 给定一个非负整数 *`numRows`，*生成「杨辉三角」的前 *`numRows`* 行。
>
> 在「杨辉三角」中，每个数是它左上方和右上方的数的和。
>
> ![img](https://pic.leetcode-cn.com/1626927345-DZmfxB-PascalTriangleAnimated2.gif)
>
> 
>
> ```
> 输入: numRows = 5
> 输出: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
> ```



```java
 public class Solution {
    public List<List<Integer>> generate(int numRows) {
        // 初始化动态规划数组
     Integer[][] dp = new Integer[numRows][];
        // 遍历每一行
    for (int i = 0; i < numRows; i++) {
        // 初始化当前行
        dp[i] = new Integer[i + 1];
        // 每一行的第一个和最后一个元素总是 1
        dp[i][0] = dp[i][i] = 1;
        // 计算中间元素
        for (int j = 1; j < i; j++) {
            // 中间元素等于上一行的相邻两个元素之和
            dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
        }
    }

    // 将动态规划数组转换为结果列表
    List<List<Integer>> result = new ArrayList<>();
    for (Integer[] row : dp) {
        result.add(Arrays.asList(row));
    }
    // 返回结果列表
    return result;
}
```

```java
public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> result = new ArrayList<>();

    // 处理0行的情况
    if (numRows == 0) return result;

    // 第一行总是 [1]
    result.add(new ArrayList<>());
    result.get(0).add(1);

    // 从第二行开始构建（索引1）
    for (int i = 1; i < numRows; i++) {
        List<Integer> currentRow = new ArrayList<>();
        List<Integer> prevRow = result.get(i - 1);

        // 每行第一个元素总是1
        currentRow.add(1);

        // 填充中间元素（数量 = 当前行索引 - 1）
        for (int j = 1; j < i; j++) {
            // 当前元素 = 上一行左上方元素 + 上一行正上方元素
            int value = prevRow.get(j - 1) + prevRow.get(j);
            currentRow.add(value);
        }

        // 每行最后一个元素总是1
        currentRow.add(1);

        result.add(currentRow);
      }
    return result;
  }
```





##### [乘积最大子数组_152](https://leetcode.cn/problems/maximum-product-subarray/)

> 给你一个整数数组 `nums` ，请你找出数组中乘积最大的非空连续 子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
>
> 测试用例的答案是一个 **32-位** 整数。
>
> ```
> 输入: nums = [2,3,-2,4]
> 输出: 6
> 解释: 子数组 [2,3] 有最大乘积 6。
> ```

思路：维护两个DP数组，一个记录当前位置为止的最大成绩，一个记录当前位置为止的最小乘机。因为负数✖️负数会得到正数，所以当前位置的最小乘积乘以下一个负数，可能会得到最大乘机。

```java
public int maxProduct(int[] nums) {
    int n = nums.length; // 获取数组的长度
    if (n == 0) return 0; // 如果数组为空，则直接返回0

    int[] maxProduct = new int[n]; // 用于存储到当前位置为止的最大乘积
    int[] minProduct = new int[n]; // 用于存储到当前位置为止的最小乘积（考虑负数情况）
    maxProduct[0] = nums[0]; // 初始化第一个元素的最大乘积
    minProduct[0] = nums[0]; // 初始化第一个元素的最小乘积
    int result = nums[0]; // 初始化最大乘积结果为第一个元素

    for (int i = 1; i < n; i++) { // 从第二个元素开始遍历数组
        // 如果当前元素是负数，则交换最大乘积和最小乘积（因为负数乘以负数得正数）
        if (nums[i] < 0) {
            int temp = maxProduct[i-1]; // 临时保存前一个位置的最大乘积
            maxProduct[i] = minProduct[i-1] * nums[i]; // 更新当前位置的最大乘积
            minProduct[i] = temp * nums[i]; // 更新当前位置的最小乘积
        } else {
            // 如果当前元素是非负数，则正常更新最大乘积和最小乘积
            maxProduct[i] = Math.max(nums[i], maxProduct[i-1] * nums[i]); // 更新当前位置的最大乘积
            minProduct[i] = Math.min(nums[i], minProduct[i-1] * nums[i]); // 更新当前位置的最小乘积
        }
        // 更新全局最大乘积结果
        result = Math.max(result, maxProduct[i]);
    }

    return result; // 返回全局最大乘积结果
}
```





#### 1.1.2 依赖比 i 小的 O(n) 个子问题

`dp[i]`需要遍历所有更小的`dp[j]`（`j < i`）才能计算，时间复杂度通常为`O(n²)`。

最长递增子序列（300 题）：`dp[i]` 需比较 `dp[0..i-1]` 中所有满足条件的子问题，取最大值加 1。



##### [最长递增子序列_300](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

> 给你一个整数数组 `nums` ，找到其中最长严格递增子序列的长度。
>
> **子序列** 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，`[3,6,2,7]` 是数组 `[0,3,1,6,2,2,7]` 的子序列。
>
> ```
> 输入：nums = [10,9,2,5,3,7,101,18]
> 输出：4
> 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
> ```

PS： 注意「子序列」和「子串」这两个名词的区别，子串一定是连续的，而子序列不一定是连续的

![image.png](https://pic.leetcode.cn/1717053793-JegWXx-image.png)

```java
 public int getLengthOfLIS(int[] nums) {

   if(nums == null || nums.length == 0){
     return 0;
   }
   
   int[] dp = new int[nums.length];
   Arrays.fill(dp, 1);

   int maxLength = 1;  //最长递增子序列的初始长度为1
   for (int i = 0; i < nums.length; i++) {
     for (int j = 0; j < i; j++) {  //遍历当前元素之前的所有元素
     //如果前面的元素小于当前元素，可以形成递增子序列。不是比较dp[i]和dp[j]
       if (nums[j] < nums[i]) {
         //这里要注意是 nums[i] 还是 dp[i]
         // 寻找 nums[0..j-1] 中比 nums[i] 小的元素
         // 把 nums[i] 接在后面，即可形成长度为 dp[j] + 1，
            // 且以 nums[i] 为结尾的递增子序列
         dp[i] = Math.max(dp[i], dp[j] + 1);   //更新dp[i]
       }
     }
     maxLength = Math.max(maxLength, dp[i]);
   }
   return res;
 }
```

![](https://writings.sh/assets/images/posts/algorithm-longest-increasing-subsequence/longest-increasing-subsequence-dp1-2.jpeg)

> 类似问题还有，最长递增子序列的个数、俄罗斯套娃信封问题



**例题 1：最长递增子序列（LeetCode 300）**

- 状态定义：`dp[i]`表示以`nums[i]`结尾的最长递增子序列长度。

- 转移方程：遍历所有`j < i`，若`nums[j] < nums[i]`，则`dp[i] = max(dp[i], dp[j] + 1)`。

  ```java
  public int lengthOfLIS(int[] nums) {
      int n = nums.length;
      int[] dp = new int[n];
      Arrays.fill(dp, 1);
      int max = 1;
      for (int i = 1; i < n; i++) {
          for (int j = 0; j < i; j++) {
              if (nums[j] < nums[i]) {
                  dp[i] = Math.max(dp[i], dp[j] + 1);
              }
          }
          max = Math.max(max, dp[i]);
      }
      return max;
  }
  ```

**例题 2：完全平方数（LeetCode 279）**

- 状态定义：`dp[i]`表示组成整数`i`所需的最少完全平方数个数。

- 转移方程：遍历所有小于`i`的完全平方数`j²`，则`dp[i] = min(dp[i], dp[i - j²] + 1)`。

  ```java
  public int numSquares(int n) {
      int[] dp = new int[n + 1];
      Arrays.fill(dp, n + 1); // 初始化最大值（最多n个1）
      dp[0] = 0;
      for (int i = 1; i <= n; i++) {
          for (int j = 1; j * j <= i; j++) {
              dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
          }
      }
      return dp[n];
  }
  ```

##### [完全平方数_279](https://leetcode.cn/problems/perfect-squares/)

> 给你一个整数 `n` ，返回 *和为 `n` 的完全平方数的最少数量* 。
>
> **完全平方数** 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，`1`、`4`、`9` 和 `16` 都是完全平方数，而 `3` 和 `11` 不是。
>
> ```
> 输入：n = 13
> 输出：2
> 解释：13 = 4 + 9
> ```

思路：这题和 coin change 类似。

```java
public int numSquares(int n) {
    // 创建dp数组，dp[i]表示组成i所需的最少完全平方数个数
    int[] dp = new int[n + 1];

    // 初始化dp数组，初始值设为最大值（n最多由n个1组成）
    Arrays.fill(dp, n + 1);
    dp[0] = 0;

  // 外层循环遍历从 1 到 n 的每个数字
      for (int i = 1; i <= n; i++) {
          // 内层循环遍历所有可能的完全平方数 j*j（其中 j 从 1 开始，直到 j*j 不再小于等于 i）
          for (int j = 1; j * j <= i; j++) {
              // 更新 dp[i] 为 dp[i] 和 dp[i - j*j] + 1 中的较小值
              // dp[i - j*j] + 1 表示将 j*j 加到 i-j*j 的最少完全平方数之和上，再加上当前的 j*j
              dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
          }
      }

    return dp[n];
}
```

- **`dp[i]`**：表示组成数字 `i` 所需的最少完全平方数个数
- **`j*j`**：当前尝试的完全平方数（如1, 4, 9, 16...）
- **`i - j*j`**：使用当前平方数后剩余的数值
- **`dp[i - j*j]`**：剩余数值所需的最少平方数个数
- 为什么加 "1"？
  - "+1" 表示当前使用的这个平方数（`j*j`）



#### 1.1.3 带维度的单串问题

状态需要额外维度（如 "交易次数"、"状态标识"），通常定义为`dp[i][k]`。

##### **股票系列问题**

以 "买卖股票的最佳时机 IV" 为例，需限制交易次数`k`：

- 状态定义：`dp[i][k][0]`表示第`i`天结束时，最多交易`k`次且不持有股票的最大利润；`dp[i][k][1]`表示持有股票的最大利润。

- 转移方程：

  ```plaintext
  dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][1] + prices[i])  // 不持有：要么前一天就不持有，要么今天卖出
  dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i])  // 持有：要么前一天就持有，要么今天买入（消耗一次交易）
  ```

> #### 单串相关练习题
>
> - 最经典单串 LIS 系列
> - 最大子数组和系列
> - 打家劫舍系列
> - 变形：需要两个位置的情况
> - 与其它算法配合
> - 其它单串 dp[i] 问题
> - 带维度单串 dp[i][k]
> - 股票系列
>
> 

### 1.2 双串问题

双串问题的输入为两个字符串或数组，状态通常定义为`dp[i][j]`，表示 " 考虑第一个串的前`i`个元素和第二个串的前`j`个元素时的最优解 "，时间复杂度通常为`O(mn)`（`m`、`n`为两串长度）。

![状态推导方向2](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/08/06/2-2-2.png)

**状态定义**：`dp[i][j]` 表示第一个串前 `i` 个元素与第二个串前 `j` 个元素的子问题的解。

- 最长公共子序列（1143 题）：`dp[i][j]` 依赖 `dp[i-1][j-1]`（两字符相等）或 `max(dp[i-1][j], dp[i][j-1])`（两字符不等）。

##### [最长公共子序列_1143](https://leetcode.cn/problems/longest-common-subsequence/)

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

- 状态定义：`dp[i][j]`表示`text1[0..i]`与`text2[0..j]`的最长公共子序列长度。

- 转移方程：

  ```plaintext
  if (text1[i] == text2[j]) {
      dp[i][j] = dp[i-1][j-1] + 1;  // 两字符相同，累加长度
  } else {
      dp[i][j] = max(dp[i-1][j], dp[i][j-1]);  // 取删除其中一个字符后的最大值
  }
  ```

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





##### [编辑距离_72](https://leetcode.cn/problems/edit-distance/)

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

- 状态定义：`dp[i][j]`表示将`word1[0..i]`转换为`word2[0..j]`的最少操作数。

- 转移方程：

  ```plaintext
  if (word1[i] == word2[j]) {
      dp[i][j] = dp[i-1][j-1];  // 字符相同，无需操作
  } else {
      // 插入（在word1后加word2[j]）、删除（删word1[i]）、替换（替换word1[i]为word2[j]）
      dp[i][j] = min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1]) + 1;
  }
  ```

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

> **双串相关练习题**
>
> 1. 最经典双串 LCS 系列
> 2. 字符串匹配系列
> 3. 其它双串 dp[i][j] 问题
> 4. 带维度双串 dp[i][j][k]
> 5. 712 两个字符串的最小 ASCII 删除和
>



## 二、背包问题（线性 DP 的变种）

| **特征**     | **线性DP**                           | **背包问题**                         |
| ------------ | ------------------------------------ | ------------------------------------ |
| **问题场景** | 依赖序列的线性结构（如数组、字符串） | 在容量限制下选择物品（组合优化）     |
| **状态定义** | 通常为`dp[i]`或`dp[i][j]`            | 通常为`dp[i][v]`（前i个物品，容量v） |
| **转移方向** | 沿线性方向递推（如从左到右）         | 依赖物品选择和容量消耗               |
| **典型例题** | 70. 爬楼梯、300. LIS                 | 416. 分割等和子集、322. 零钱兑换     |

**核心**：按物品和容量的线性顺序推进状态，本质是线性 DP 的扩展。

- **0-1 背包**：每个物品仅选一次，状态转移依赖上一轮（前 `i-1` 个物品）的解（如分割等和子集 416 题）。
- **完全背包**：每个物品可重复选，状态转移依赖本轮（前 `i` 个物品）的解（如零钱兑换 322 题、零钱兑换 II518 题）。

背包问题可抽象为：给定一组物品（每个物品有重量和价值）和一个容量固定的背包，如何选择物品放入背包，使总价值最大且总重量不超过背包容量。

常见类型：

- **0-1 背包**：每个物品只能选择一次（要么放入，要么不放入）
- **完全背包**：每个物品可以选择多次（无限重复使用）

### 0-1 背包问题

> 给定一个背包，容量为W。有n个物品，每个物品有重量wt[i]和价值val[i]。问在不超过背包容量的前提下，能装的最大价值是多少？

我们可以将 0-1 背包问题看作一个由 轮决策组成的过程，对于每个物体都有不放入和放入两种决策，因此该问题满足决策树模型。

该问题的目标是求解“在限定背包容量下能放入物品的最大价值”，因此较大概率是一个动态规划问题。

1. 定义dp数组`dp[i][w]`表示对于前i个物品，当前背包容量为w时，可以装的最大价值。

2. 状态转移方程：对于每个物品来说，不放入背包，背包容量不变；放入背包，背包容量减小

   当我们做出物品 的决策后，剩余的是前 个物品决策的子问题，可分为以下两种情况

   - **不放入物品** ：背包容量不变，最大价值 `dp[i][w] = dp[i-1][w]` ，继承之前的结果。
   - **放入物品** :  背包容量减少，则`dp[i][w] = dp[i-1][w - wt[i-1]] + val[i-1]`（注意：这里i-1是因为数组下标从0开始）
   - 因此：`dp[i][w] = max(dp[i-1][w], dp[i-1][w - wt[i-1]] + val[i-1])` 注意：只有w>=wt[i-1]时才能选择放入。

3. 初始化：

   - `dp[w] = 0`，表示0个物品时，价值为0。
   - `dp[i] = 0`，表示背包容量为0时，价值为0。

4. 最终答案：`dp[n][W]`

```java
/**
 * 0-1背包问题求解
 * @param capacity 背包最大容量
 * @param weights 物品重量数组
 * @param values 物品价值数组
 * @return 最大价值
 */
public static int solve(int capacity, int[] weights, int[] values) {
    // 边界条件判断
    if (capacity <= 0 || weights == null || values == null || 
        weights.length != values.length) {
        return 0;
    }

    int n = weights.length;
    int[] dp = new int[capacity + 1];

    // 初始化dp数组，默认为0即可

    // 遍历每个物品
    for (int i = 0; i < n; i++) {
        // 逆序遍历背包容量，防止物品重复使用
        for (int j = capacity; j >= weights[i]; j--) {
            // 状态转移方程
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}
```





##### [分割等和子集_416](https://leetcode.cn/problems/partition-equal-subset-sum/)

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



### 完全背包问题

完全背包中每种物品有无限个。状态转移方程稍有不同：
`dp[i][w] = max(dp[i-1][w], dp[i][w - wt[i-1]] + val[i-1]) `注意这里第二项是`dp[i][w-wt[i-1]]`，因为可以重复选择。

> 给定 n 个物品，第 i 个物品的重量为 *wgt[i-1]* 、价值为 *val[i-1]*，和一个容量为 *cap* 的背包。**每个物品可以重复选取**，问在限定背包容量下能放入物品的最大价值

思路：完全背包问题和 0-1 背包问题非常相似，**区别仅在于不限制物品的选择次数**

```java
/**
 * 完全背包问题求解
 * @param capacity 背包最大容量
 * @param weights 物品重量数组
 * @param values 物品价值数组
 * @return 最大价值
 */
public static int solve(int capacity, int[] weights, int[] values) {
    // 边界条件判断
    if (capacity <= 0 || weights == null || values == null || 
        weights.length != values.length) {
        return 0;
    }

    int n = weights.length;
    int[] dp = new int[capacity + 1];

    // 遍历每个物品
    for (int i = 0; i < n; i++) {
        // 正序遍历背包容量，允许物品重复使用
        for (int j = weights[i]; j <= capacity; j++) {
            // 状态转移方程
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}
```



##### [零钱兑换_322](https://leetcode.cn/problems/coin-change/)

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



##### [零钱兑换 II_518](https://leetcode.cn/problems/coin-change-ii/)

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



### [分割等和子集_416](https://leetcode.cn/problems/partition-equal-subset-sum/)

> 给你一个 **只包含正整数** 的 **非空** 数组 `nums` 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。
>
> ```
> 输入：nums = [1,5,11,5]
> 输出：true
> 解释：数组可以分割成 [1, 5, 5] 和 [11] 。
> ```

思路：将问题转化为**是否存在子集和为数组总和一半**的背包问题（`target = sum/2`）

我们可以定义一个二维数组 dp，其中 `dp[i][j]` 表示前 `i` 个元素是否能组成和 `j`。状态转移方程如下：

- 不选当前数，则问题转化为在前 i-1 个元素中是否存在和为 j 的子集：`dp[i][j] = dp[i-1][j]`
- 选当前数，则问题转化为在前 i-1 个元素中是否存在和为 j - nums[i-1] 的子集，：`dp[i][j] = dp[i-1][j - nums[i]]`（需 `j >= nums[i]`）

因此，状态转移方程可以综合为：

`dp[i][j] = dp[i-1][j] || dp[i-1][j - nums[i-1]]`

注意，当 j - nums[i-1] < 0 时，`dp[i-1][j - nums[i-1]]` 是不合法的，我们默认它为 false。

最终，我们需要判断 `dp[n][target]`是否为 true，其中 n 是数组 nums 的长度。如果为 true，则表示存在这样的子集划分；否则，不存在。

```JAVA
public boolean canPartition(int[] nums) {
    int sum = 0;
    for (int num : nums) {
        sum += num;
    }

    // 如果总和为奇数，则无法分割成两个和相等的子集
    if (sum % 2 != 0) {
        return false;
    }

    int target = sum / 2;
    int n = nums.length;
    boolean[][] dp = new boolean[n + 1][target + 1];

    // 初始化第一列，表示和为0时总是存在子集（空集）
    for (int i = 0; i <= n; i++) {
        dp[i][0] = true;
    }

    // 填充dp数组
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= target; j++) {
            if (j >= nums[i - 1]) {
                dp[i][j] = dp[i - 1][j] || dp[i - 1][j - nums[i - 1]];
            } else {
                dp[i][j] = dp[i - 1][j];
            }
        }
    }

    return dp[n][target];
}
```





## 三、区间动态规划

在输入为长度为 n 的数组时，子问题用区间 [i..j] 表示。状态的定义和转移都与区间有关，称为区间动态规划。

区间动态规划的特点是**状态与区间`[i..j]`相关**，状态定义为`dp[i][j]`，表示 " 区间`[i..j]`上的最优解 "，推导顺序通常按区间长度从小到大进行。

> 区间动态规划一般用在单串问题上，以区间 [i, j] 为单位思考状态的设计和转移。它与线性动态规划在状态设计和状态转移上都有明显的不同，但由于这两个方法都经常用在单串问题上，导致我们拿到一个单串的问题时，经常不能快速反映出应该用哪种方法。这是区间动态规划的难点之一，但是这个难点也是好解决的，就是做一定数量的练习题，因为区间动态规划的题目比线性动态规划少很多，并且区间动态规划的状态设计和转移都比较朴素，变化也比线性动态规划少很多，所以通过不多的题目数量就可以把区间动态规划常见的方法和变化看个大概了。



> 区间 DP 是状态的定义和转移都与区间有关，其中区间用两个端点表示。
>
> 状态定义 dp\[i][j] = [i..j] 上原问题的解。i 变大，j 变小都可以得到更小规模的子问题。
>
> 对于单串上的问题，我们可以对比一下线性动态规划和区间动态规划。线性动态规划, 一般是定义 dp[i]， 表示考虑到前 i 个元素，原问题的解，i 变小即得到更小规模的子问题，推导状态时候是从前往后，即 i 从小到大推的。区间动态规划，一般是定义 dp[i][j]，表示考虑 [i..j] 范围内的元素，原问题的解增加 i，减小 j 都可以得到更小规模的子问题。推导状态一般是按照区间长度从短到长推的。
>
> 区间动态规划的状态设计，状态转移都与线性动态规划有明显区别，但是由于这两种方法都经常用在单串问题上，拿到一个单串的问题时，往往不能快速地判断到底是用线性动态规划还是区间动态规划，这也是区间动态规划的难点之一。
>
> 状态转移，推导状态 dp\[i][j] 时，有两种常见情况
>
> #### 1. dp\[i][j] 仅与常数个更小规模子问题有关
>
> 一般是与 dp\[i + 1][j], dp\[i][j - 1], dp\[i + 1][j - 1] 有关。
>
> dp\[i][j] = f(dp\[i + 1][j], dp\[i][j - 1], dp\[i + 1][j - 1])
>
> ![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/08/06/4-1-1.png)
>
> 代码常见写法
>
> ```
> for len = 1..n
>     for i = i..len
>         j = i + len - 1
>         dp[i][j] = max(dp[i][j], f(dp[i+1][j], dp[i][j-1], dp[i+1][j-1]))
> 
> ```
>
> 时间复杂度和空间复杂度均为 O(n^{2})*O*(*n*2)
>
> 例如力扣第 516 题，详细过程参考下一节。
>
> 
>
> #### 2. dp\[i][j] 与 O(n) 个更小规模子问题有关
>
> 一般是枚举 [i,j] 的分割点，将区间分为 [i,k] 和 [k+1,j]，对每个 k 分别求解（下面公式的 f），再汇总（下面公式的 g）。
>
> dp\[i][j] = g(f(dp\[i][k], dp\[k + 1][j])) 其中 k = i .. j-1。
>
> ![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/08/06/4-1-2.png)
>
> 代码常见写法, 以下代码以 f 为 max 为例
>
> ```
> for len = 1..n
>     for i = i..len
>         j = i + len - 1
>         for k = i..j
>             dp[i][j] = max(dp[i][j], f(dp[i][k], dp[k][j]))
> ```
>
> 时间复杂度可以达到 O(n^3)，空间复杂度还是 O(n^2)
>
> 例如力扣第 664 题，详细过程参考下一节
>
> 

### 3.1 区间 DP 的核心

- 状态设计：`dp[i][j]`代表区间`[i..j]`的解，`i`和`j`分别为区间的左右端点。
- 推导顺序：先计算长度为 1 的区间（`i == j`），再计算长度为 2 的区间（`j = i+1`），直至长度为`n`的区间（`j = n-1`）。

### 3.2 经典问题分类

#### 3.2.1 依赖常数个子问题

`dp[i][j]`仅与`dp[i+1][j]`、`dp[i][j-1]`、`dp[i+1][j-1]`相关，时间复杂度`O(n²)`。

##### [最长回文子序列_516](https://leetcode.cn/problems/longest-palindromic-subsequence/)

> 给你一个字符串 `s` ，找出其中最长的回文子序列，并返回该序列的长度。
>
> 子序列定义为：不改变剩余字符顺序的情况下，删除某些字符或者不删除任何字符形成的一个序列。
>
> ```
> 输入：s = "bbbab"
> 输出：4
> 解释：一个可能的最长回文子序列为 "bbbb" 
> ```

- 状态定义：`dp[i][j]`表示`[i..j]`上的最长回文子序列长度。

- 转移方程：

  ```plaintext
  if (s[i] == s[j]) {
      dp[i][j] = dp[i+1][j-1] + 2;  // 两端字符相同，累加长度
  } else {
      dp[i][j] = max(dp[i+1][j], dp[i][j-1]);  // 取去掉一端后的最大值
  }
  ```

#### 3.2.2 依赖 O (n) 个子问题

`dp[i][j]`需要枚举区间内的分割点`k`（`i ≤ k < j`），通过`dp[i][k]`和`dp[k+1][j]`推导，时间复杂度`O(n³)`。

**例题：奇怪的打印机（LeetCode 664）**

- 状态定义：`dp[i][j]`表示打印`[i..j]`区间字符的最少次数。

- 转移方程：

  ```plaintext
  // 初始值：单独打印i位置
  dp[i][j] = dp[i+1][j] + 1;
  // 若存在k使得s[i] == s[k]，则可与k位置一起打印，减少次数
  for (int k = i+1; k <= j; k++) {
      if (s[i] == s[k]) {
          dp[i][j] = min(dp[i][j], dp[i+1][k] + dp[k+1][j]);
      }
  }
  ```



| 类型     | 状态定义   | 推导顺序               | 典型问题                     |
| -------- | ---------- | ---------------------- | ---------------------------- |
| 线性单串 | `dp[i]`    | 从左到右（i 从小到大） | 最大子数组和、最长递增子序列 |
| 线性双串 | `dp[i][j]` | 按 i 和 j 从小到大     | 最长公共子序列、编辑距离     |
| 区间 DP  | `dp[i][j]` | 按区间长度从小到大     | 最长回文子序列、奇怪的打印机 |

##### [最长回文子串_5](https://leetcode.cn/problems/longest-palindromic-substring/)

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







## 分治型动态规划

#### **核心特征**：

1. **问题目标**：生成所有满足条件的组合/排列（而非求最优解或计数）。
2. 解决方法：
   - **分治法**：将问题分解为子问题的组合（如括号生成中的`(inner)outer`）。
   - **回溯法**：通过递归+剪枝暴力搜索所有可能解。
3. 与经典DP的区别：
   - 经典DP通常用状态转移求极值（如最大值、最小值），而生成型DP直接构造解集。

**典型例题**：

| 问题                                                         | 解法        | 关键思路                                               |
| ------------------------------------------------------------ | ----------- | ------------------------------------------------------ |
| [22. 括号生成](https://leetcode.com/problems/generate-parentheses/) | 分治DP/回溯 | `dp[i] = ['('+x+')'+y for x in dp[j], y in dp[i-1-j]]` |
| [95. 不同的二叉搜索树 II](https://leetcode.com/problems/unique-binary-search-trees-ii/) | 分治DP      | 遍历根节点，左右子树递归生成                           |
| [17. 电话号码的字母组合](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | 回溯        | 递归拼接所有可能的字符组合                             |



##### [括号生成_22](https://leetcode-cn.com/problems/generate-parentheses/)

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





## 其他热题

