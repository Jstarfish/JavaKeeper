---
title: 动态规划-热题
date: 2025-01-08
tags: 
 - DP
 - algorithms
categories: leetcode
---

![](https://img.starfish.ink/leetcode/leetcode-banner.png)

> **导读**：个人感觉动态规划是最难的，一会爬楼梯，一会兑零钱，一会又要去接雨水，炒股就不说了，还要去偷东西，太南了
>
> 动态规划确实是算法面试的"终极boss"，但掌握了核心思路后，这些看似复杂的问题都有迹可循。从状态定义到转移方程，从边界条件到空间优化，让我们一步步征服DP的各个击破点。
>
> **关键词**：状态定义、转移方程、记忆化搜索、空间优化、最优子结构

### 📋 分类索引

1. **🎯 线性DP类（基础核心）**
   - **1.1 单串问题**
     - 1.1.1 依赖比i小的O(1)个子问题：[爬楼梯](#_70-爬楼梯)、[打家劫舍](#_198-打家劫舍)、[最大子数组和](#_53-最大子数组和)、[单词拆分](#_139-单词拆分)、[杨辉三角](#_118-杨辉三角)、[乘积最大子数组](#_152-乘积最大子数组)
     - 1.1.2 依赖比i小的O(n)个子问题：[最长递增子序列](#_300-最长递增子序列)、[完全平方数](#_279-完全平方数)
     - 1.1.3 带维度的单串问题：[买卖股票的最佳时机](#_121-买卖股票的最佳时机)
   - **1.2 双串问题**：[最长公共子序列](#_1143-最长公共子序列)、[编辑距离](#_72-编辑距离)

2. **🎒 背包DP类（线性DP的变种）**
   - **0-1背包问题**：[分割等和子集](#_416-分割等和子集)
   - **完全背包问题**：[零钱兑换](#_322-零钱兑换)、[零钱兑换II](#_518-零钱兑换ii)、[完全平方数](#_279-完全平方数)、[目标和](#_494-目标和)
   - **背包应用**：[不同路径](#_62-不同路径)、[最小路径和](#_64-最小路径和)

3. **🔄 区间动态规划**
   - **3.1 区间DP核心**：状态设计与推导顺序
   - **3.2 经典问题分类**
     - 3.2.1 依赖常数个子问题：[不同的二叉搜索树](#_96-不同的二叉搜索树)、[最长回文子序列](#_最长回文子序列516)
     - 3.2.2 依赖O(n)个子问题：[最长回文子串](#_最长回文子串5)、[最大正方形](#_221-最大正方形)

4. **🔗 分治型动态规划**：[括号生成](#_括号生成22)

### 🎯 核心考点概览

- **状态设计**：一维dp[i]、二维dp[i][j]、多维状态转移
- **转移方程**：从"最后一步"推导状态转移关系
- **边界条件**：base case的正确设置和处理  
- **空间优化**：滚动数组、压缩状态降低空间复杂度
- **决策树模型**：理解最优子结构和无后效性

### 📝 解题万能模板

#### 基础模板

```java
// 一维DP模板
int[] dp = new int[n + 1];
dp[0] = baseCase; // 边界条件
for (int i = 1; i <= n; i++) {
    dp[i] = Math.max(dp[i-1] + nums[i], nums[i]); // 状态转移
}

// 二维DP模板  
int[][] dp = new int[m + 1][n + 1];
// 初始化边界条件
for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]); // 状态转移
    }
}

// 背包问题模板
int[] dp = new int[capacity + 1];
for (int i = 0; i < items.length; i++) {
    for (int j = capacity; j >= weight[i]; j--) { // 0-1背包逆序
        dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
    }
}
```

#### 边界检查清单

- ✅ 数组越界：确保索引在有效范围内
- ✅ 边界条件：正确设置dp[0]、dp[i][0]等base case
- ✅ 状态转移：确保每个状态都能从更小的子问题推导
- ✅ 空间优化：考虑是否可以用滚动数组降低空间复杂度

#### 💡 记忆口诀（朗朗上口版）

- **状态定义**："定义状态含义清，子问题规模要递减"
- **转移方程**："最后一步怎么走，前面状态来推导"
- **边界条件**："边界条件要设好，递推基础不能少"
- **空间优化**："前后依赖看得清，滚动数组省空间"
- **背包问题**："物品容量两维度，选或不选做决策"
- **区间DP**："区间长度小到大，分割点上做文章"

**解题心法**

1. **状态定义是核心**：明确`dp`数组的含义，确保子问题能被有效分解。
2. **转移方程从 "最后一步" 推导**：思考 " 计算`dp[i][j]`时，最后一步操作是什么 "（如编辑距离中的插入 / 删除 / 替换）。
3. **边界条件要清晰**：如`dp[0][j]`（空串与另一串的关系）、`dp[i][i]`（长度为 1 的区间）等。
4. **空间优化**：部分问题可通过滚动数组将二维`dp`优化为一维（如编辑距离、最长公共子序列）。

**最重要的一个技巧就是，你得行动，写起来**

## 一、线性DP类（基础核心）🎯 

### 💡 核心思想

- **一维状态**：dp[i]表示考虑前i个元素的最优解
- **递推关系**：dp[i]依赖前面的状态dp[i-1]、dp[i-2]等
- **时间复杂度**：通常为O(n)或O(n²)

### 🎯 必掌握模板

```java
// 基础线性DP模板
int[] dp = new int[n + 1];
dp[0] = baseCase; // 设置边界条件

for (int i = 1; i <= n; i++) {
    dp[i] = optimizeFunction(dp[i-1], dp[i-2], ...); // 状态转移
}
return dp[n]; // 或者返回过程中的最优值
```

线性动态规划的特点是**问题规模由单变量（或双变量）的位置表示**，状态推导按位置从小到大依次进行，较大规模的问题依赖较小规模的子问题。

### 1.1 单串问题

单串问题的输入为一个字符串或数组，状态通常定义为`dp[i]`，表示 " 考虑前`i`个元素（`[0..i]`）时的最优解 "。

**状态定义**：`dp[i]` 表示以第 `i` 个元素为结尾的子问题的解（如子序列、子数组）。

#### 1.1.1 依赖比 i 小的 O(1) 个子问题

`dp[i]` 仅与 `dp[i-1]` 等少数几个更小的子问题相关，时间复杂度通常为`O(n)`。

![状态推导方向1](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/08/09/2-2-1.png)

比如最大子数组和（53 题）：`dp[i]` 依赖 `dp[i-1]`，判断是否延续前序子数组。

##### [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

> 假设你正在爬楼梯。需要 `n` 阶你才能到达楼顶。
>
> 每次你可以爬 `1` 或 `2` 个台阶。你有多少种不同的方法可以爬到楼顶呢？
>
> ```
> 输入：n = 3
> 输出：3
> 解释：有三种方法可以爬到楼顶。
> 1. 1 阶 + 1 阶 + 1 阶
> 2. 1 阶 + 2 阶
> 3. 2 阶 + 1 阶
> ```

**思路**：典型的斐波那契数列问题

- 状态定义：`dp[i]` 表示爬到第 `i` 阶楼梯的方法数
- 转移方程：`dp[i] = dp[i-1] + dp[i-2]` （可以从第i-1阶爬1步，或从第i-2阶爬2步）
- 边界条件：`dp[0] = 1, dp[1] = 1`

```java
public int climbStairs(int n) {
    if (n <= 1) return 1;
    
    int[] dp = new int[n + 1];
    dp[0] = 1; // 0阶有1种方法（不爬）
    dp[1] = 1; // 1阶有1种方法
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// 空间优化版本
public int climbStairs(int n) {
    if (n <= 1) return 1;
    
    int prev2 = 1, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

##### [198. 打家劫舍](https://leetcode.cn/problems/house-robber/)

> 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
>
> 给定一个代表每个房屋存放金额的非负整数数组，计算你不触动警报装置的情况下 ，一夜之间能够偷窃到的最高金额。
>
> ```
> 输入：[2,7,9,3,1]
> 输出：12
> 解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
>      偷窃到的最高金额 = 2 + 9 + 1 = 12 。
> ```

**思路**：状态机DP的简化版

- 状态定义：`dp[i]` 表示偷窃前 `i+1` 间房屋能获得的最高金额
- 转移方程：`dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i])` （不偷第i间房 vs 偷第i间房）
- 边界条件：`dp[0] = nums[0]`, `dp[1] = Math.max(nums[0], nums[1])`

```java
public int rob(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    
    int n = nums.length;
    int[] dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    
    for (int i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    
    return dp[n - 1];
}

// 空间优化版本
public int rob(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    
    int prev2 = nums[0];
    int prev1 = Math.max(nums[0], nums[1]);
    
    for (int i = 2; i < nums.length; i++) {
        int current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}
```

##### [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

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



##### [139. 单词拆分](https://leetcode.cn/problems/word-break/)

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



##### [118. 杨辉三角](https://leetcode.cn/problems/pascals-triangle/)

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

思路：

杨辉三角的特性：

1. 第n行有n个数字
2. 每行的第一个和最后一个数字都是1
3. 其他数字等于上一行同位置和前一个位置数字之和

动态规划解法：

- 状态定义：dp[i][j]表示第i行第j列的数字
- 递推关系：
  - `dp[i] = 1` (每行第一个数字)
  - `dp[i][i] = 1` (每行最后一个数字)
  - `dp[i][j] = dp[i-1][j-1] + dp[i-1`][j] (其他情况)
- 空间优化：可以只使用一维数组，从后向前更新

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



##### [152. 乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/)

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



##### [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

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
   for (int i = 0; i < nums.length; i++) { //外层循环 (i): 遍历数组中的每个元素
     for (int j = 0; j < i; j++) {  //内层循环 (j): 对于每个 i，遍历 0 到 i-1 的所有元素
     //当发现 nums[j] < nums[i] 时，说明 nums[i] 可以接在 nums[j] 后面形成更长的递增子序列
       if (nums[j] < nums[i]) {
         //这里要注意是 nums[i] 还是 dp[i]
         // 把 nums[i] 接在后面，即可形成长度为 dp[j] + 1，且以 nums[i] 为结尾的递增子序列
         //dp[j] + 1 表示以 nums[j] 结尾的子序列长度加上 nums[i] 后的新长度
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



##### [279. 完全平方数](https://leetcode.cn/problems/perfect-squares/)

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

- 状态定义：`dp[i]`表示组成整数`i`所需的最少完全平方数个数。

- 转移方程：遍历所有小于`i`的完全平方数`j²`，则`dp[i] = min(dp[i], dp[i - j²] + 1)`。

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



### 1.2 双串问题

双串问题的输入为两个字符串或数组，状态通常定义为`dp[i][j]`，表示 " 考虑第一个串的前`i`个元素和第二个串的前`j`个元素时的最优解 "，时间复杂度通常为`O(mn)`（`m`、`n`为两串长度）。

![状态推导方向2](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/08/06/2-2-2.png)

**状态定义**：`dp[i][j]` 表示第一个串前 `i` 个元素与第二个串前 `j` 个元素的子问题的解。

- 最长公共子序列（1143 题）：`dp[i][j]` 依赖 `dp[i-1][j-1]`（两字符相等）或 `max(dp[i-1][j], dp[i][j-1])`（两字符不等）。

##### [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

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

![img](https://miro.medium.com/v2/resize:fit:914/0*7Uhq4ZGfoxs1Ww3Z)

```java
public int longestCommonSubsequence(String str1, String str2) {
    // 获取两个字符串的长度
    int s1l = str1.length();
    int s2l = str2.length();

    // 创建动态规划表，dp[i][j]表示str1前i个字符和str2前j个字符的LCS长度
    // 大小设为(s1l+1)×(s2l+1)是为了方便处理边界条件（空字符串的情况）
    int [][]dp = new int[s1l+1][s2l+1];
      
    // 动态规划填表过程
    for(int i=1; i<=s1l; i++){          // 遍历str1的每个字符
        for(int j=1; j<=s2l; j++){      // 遍历str2的每个字符
            //当前字符是公共子序列的一部分
            if(str1.charAt(i-1) == str2.charAt(j-1)){
                // 当前字符匹配，LCS长度等于左上角值加1
                dp[i][j] = 1 + dp[i-1][j-1];
            }else{
                // 当前字符不匹配，取上方或左方的较大值
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }   
    }
    
    // 返回整个字符串的LCS长度，即dp表的右下角值
    return dp[s1l][s2l];
}
```



##### [72. 编辑距离](https://leetcode.cn/problems/edit-distance/)

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





##### [416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)

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



##### [322. 零钱兑换](https://leetcode.cn/problems/coin-change/)

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



##### [518. 零钱兑换 II](https://leetcode.cn/problems/coin-change-ii/)

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



### 背包应用

##### [494. 目标和](https://leetcode.cn/problems/target-sum/)

**🎯 考察频率：高 | 难度：中等 | 重要性：01背包变体**

> 给你一个整数数组 nums 和一个整数 target 。
>
> 向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：
>
> 例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
> 返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。
>
> ```
> 输入：nums = [1,1,1,1,1], target = 3
> 输出：5
> 解释：一共有 5 种方法让最终目标和为 3 。
> -1 + 1 + 1 + 1 + 1 = 3
> +1 - 1 + 1 + 1 + 1 = 3
> +1 + 1 - 1 + 1 + 1 = 3
> +1 + 1 + 1 - 1 + 1 = 3
> +1 + 1 + 1 + 1 - 1 = 3
> ```

**思路**：转化为01背包问题

设添加"+"号的数字和为P，添加"-"号的数字和为N，则：
- P + N = sum（数组总和）
- P - N = target（目标和）

解得：P = (sum + target) / 2

问题转化为：从数组中选择一些数字，使其和等于P的方案数。这是典型的01背包计数问题。

```java
public int findTargetSumWays(int[] nums, int target) {
    int sum = 0;
    for (int num : nums) {
        sum += num;
    }
    
    // 边界条件检查
    if (sum < Math.abs(target) || (sum + target) % 2 == 1) {
        return 0;
    }
    
    int targetSum = (sum + target) / 2;
    
    // dp[i]表示和为i的方案数
    int[] dp = new int[targetSum + 1];
    dp[0] = 1; // 和为0的方案数为1（什么都不选）
    
    for (int num : nums) {
        // 01背包，逆序遍历
        for (int j = targetSum; j >= num; j--) {
            dp[j] += dp[j - num];
        }
    }
    
    return dp[targetSum];
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n × target_sum) - n为数组长度，target_sum为目标正数和
- **空间复杂度**：O(target_sum) - dp数组的空间

### 背包应用

##### [62. 不同路径](https://leetcode.cn/problems/unique-paths/)

> 一个机器人位于一个 `m x n` 网格的左上角 （起始点在下图中标记为 "Start" ）。
>
> 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 "Finish" ）。
>
> 问总共有多少条不同的路径？
>
> ```
> 输入：m = 3, n = 7
> 输出：28
> ```

**思路**：典型的二维DP问题

- 状态定义：`dp[i][j]` 表示到达位置 `(i, j)` 的不同路径数
- 转移方程：`dp[i][j] = dp[i-1][j] + dp[i][j-1]` （只能从上方或左方到达）
- 边界条件：`dp[0][j] = 1`, `dp[i][0] = 1` （第一行和第一列都只有一条路径）

```java
public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    
    // 初始化边界条件
    for (int i = 0; i < m; i++) {
        dp[i][0] = 1; // 第一列只有一条路径
    }
    for (int j = 0; j < n; j++) {
        dp[0][j] = 1; // 第一行只有一条路径
    }
    
    // 状态转移
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}

// 空间优化版本（一维数组）
public int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1); // 第一行都是1
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[j] = dp[j] + dp[j - 1]; // dp[j]代表上方，dp[j-1]代表左方
        }
    }
    
    return dp[n - 1];
}
```

##### [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

> 给定一个数组 `prices` ，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格。
>
> 你只能选择 **某一天** 买入这只股票，并选择在 **未来的某一个不同的日子** 卖出该股票。设计一个算法来计算你所能获取的最大利润。
>
> 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0` 。
>
> ```
> 输入：[7,1,5,3,6,4]
> 输出：5
> 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
>      注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
> ```

**思路**：一次遍历找最低买入价和最大利润

- 状态定义：维护到当前位置的最低价格和最大利润
- 转移方程：
  - `minPrice = Math.min(minPrice, prices[i])`
  - `maxProfit = Math.max(maxProfit, prices[i] - minPrice)`

```java
public int maxProfit(int[] prices) {
    if (prices == null || prices.length <= 1) return 0;
    
    int minPrice = prices[0]; // 记录到目前为止的最低价格
    int maxProfit = 0;        // 记录到目前为止的最大利润
    
    for (int i = 1; i < prices.length; i++) {
        // 更新最低价格
        minPrice = Math.min(minPrice, prices[i]);
        // 更新最大利润（今天卖出的利润 vs 之前的最大利润）
        maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
    
    return maxProfit;
}

// DP思路版本
public int maxProfit(int[] prices) {
    if (prices == null || prices.length <= 1) return 0;
    
    // dp[i][0] 表示第i天不持有股票的最大利润
    // dp[i][1] 表示第i天持有股票的最大利润
    int n = prices.length;
    int[][] dp = new int[n][2];
    
    dp[0][0] = 0;           // 第0天不持有股票，利润为0
    dp[0][1] = -prices[0];  // 第0天持有股票，利润为-prices[0]
    
    for (int i = 1; i < n; i++) {
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][1] + prices[i]); // 不持有：要么昨天就不持有，要么今天卖出
        dp[i][1] = Math.max(dp[i-1][1], -prices[i]);            // 持有：要么昨天就持有，要么今天买入
    }
    
    return dp[n-1][0]; // 最后一天不持有股票的最大利润
}
```

##### [64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/)

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

##### [96. 不同的二叉搜索树](https://leetcode.cn/problems/unique-binary-search-trees/)

> 给你一个整数 `n` ，求恰由 `n` 个节点组成且节点值从 `1` 到 `n` 互不相同的 **二叉搜索树** 有多少种？返回满足题意的二叉搜索树的种数。
>
> ```
> 输入：n = 3
> 输出：5
> 解释：给定 n = 3, 一共有 5 种不同结构的二叉搜索树
> ```

**思路**：卡特兰数/区间DP

当我们确定根节点为 i 时：
- 左子树包含 [1, i-1] 共 i-1 个节点
- 右子树包含 [i+1, n] 共 n-i 个节点  
- 左子树的不同结构数为 `dp[i-1]`
- 右子树的不同结构数为 `dp[n-i]`
- 以 i 为根的不同BST数为 `dp[i-1] * dp[n-i]`

- 状态定义：`dp[i]` 表示 i 个节点组成的不同BST数量
- 转移方程：`dp[i] = sum(dp[j-1] * dp[i-j])` for j in [1, i]
- 边界条件：`dp[0] = 1, dp[1] = 1`

```java
public int numTrees(int n) {
    // dp[i] 表示i个节点组成的不同BST的数量
    int[] dp = new int[n + 1];
    
    // 边界条件
    dp[0] = 1; // 空树有1种结构
    dp[1] = 1; // 一个节点有1种结构
    
    // 计算dp[2]到dp[n]
    for (int i = 2; i <= n; i++) {
        // 枚举根节点j的位置（从1到i）
        for (int j = 1; j <= i; j++) {
            // j为根节点时：
            // 左子树有j-1个节点，右子树有i-j个节点
            dp[i] += dp[j - 1] * dp[i - j];
        }
    }
    
    return dp[n];
}

// 数学公式版本（卡特兰数第n项）
public int numTrees(int n) {
    long result = 1;
    for (int i = 0; i < n; i++) {
        result = result * 2 * (2 * i + 1) / (i + 2);
    }
    return (int) result;
}
```

##### [516. 最长回文子序列](https://leetcode.cn/problems/longest-palindromic-subsequence/)

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

##### [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

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

##### [221. 最大正方形](https://leetcode.cn/problems/maximal-square/)

**🎯 考察频率：高 | 难度：中等 | 重要性：二维DP经典**

> 在一个由 '0' 和 '1' 组成的二维矩阵内，找到只包含 '1' 的最大正方形，并返回其面积。
>
> ```
> 输入：matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
> 输出：4
> 解释：最大正方形的边长为2，面积为4
> ```

**思路**：二维DP

- 状态定义：`dp[i][j]` 表示以 `(i,j)` 为右下角的最大正方形的边长
- 转移方程：如果 `matrix[i][j] == '1'`，则：
  ```
  dp[i][j] = Math.min(dp[i-1][j], Math.min(dp[i][j-1], dp[i-1][j-1])) + 1
  ```
- 边界条件：第一行和第一列直接根据matrix[i][j]设置

```java
public int maximalSquare(char[][] matrix) {
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return 0;
    }
    
    int m = matrix.length;
    int n = matrix[0].length;
    int[][] dp = new int[m][n];
    int maxSide = 0;
    
    // 初始化第一行和第一列
    for (int i = 0; i < m; i++) {
        dp[i][0] = matrix[i][0] - '0';
        maxSide = Math.max(maxSide, dp[i][0]);
    }
    
    for (int j = 0; j < n; j++) {
        dp[0][j] = matrix[0][j] - '0';
        maxSide = Math.max(maxSide, dp[0][j]);
    }
    
    // 填充dp数组
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][j] == '1') {
                dp[i][j] = Math.min(dp[i-1][j], Math.min(dp[i][j-1], dp[i-1][j-1])) + 1;
                maxSide = Math.max(maxSide, dp[i][j]);
            }
        }
    }
    
    return maxSide * maxSide;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(mn) - 遍历整个矩阵一次
- **空间复杂度**：O(mn) - dp数组，可优化为O(n)




## 四、分治型动态规划

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
| [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/) | 分治DP/回溯 | `dp[i] = ['('+x+')'+y for x in dp[j], y in dp[i-1-j]]` |
| [95. 不同的二叉搜索树 II](https://leetcode.cn/problems/unique-binary-search-trees-ii/) | 分治DP      | 遍历根节点，左右子树递归生成                           |
| [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/) | 回溯        | 递归拼接所有可能的字符组合                             |



##### [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/)

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





## 🚀 面试前15分钟速记表

### 核心模板（必背）

```java
// 1. 一维DP模板
int[] dp = new int[n + 1];
dp[0] = baseCase; // 边界条件
for (int i = 1; i <= n; i++) {
    dp[i] = Math.max(dp[i-1] + nums[i], nums[i]); // 状态转移
}

// 2. 二维DP模板  
int[][] dp = new int[m + 1][n + 1];
// 初始化边界条件
for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]); // 状态转移
    }
}

// 3. 背包问题模板
int[] dp = new int[capacity + 1];
for (int i = 0; i < items.length; i++) {
    for (int j = capacity; j >= weight[i]; j--) { // 0-1背包逆序
        dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
    }
}
```

### 题型速查表

| 题型分类 | 核心技巧 | 高频题目 | 记忆口诀 | 难度 |
|----------|----------|----------|----------|------|
| **线性DP-单串类** | 一维状态转移 | 爬楼梯、打家劫舍、最大子数组和、单词拆分、最长递增子序列、乘积最大子数组、买卖股票的最佳时机 | 状态定义含义清，子问题规模要递减 | ⭐⭐⭐ |
| **线性DP-双串类** | 二维状态比较 | 最长公共子序列、编辑距离 | 最后一步怎么走，前面状态来推导 | ⭐⭐⭐⭐ |
| **背包DP类** | 容量限制选择 | 分割等和子集、零钱兑换、零钱兑换II、完全平方数、不同路径 | 物品容量两维度，选或不选做决策 | ⭐⭐⭐⭐ |
| **区间DP类** | 区间分割优化 | 不同的二叉搜索树、最长回文子序列、最长回文子串 | 区间长度小到大，分割点上做文章 | ⭐⭐⭐⭐ |
| **分治型DP类** | 递归分解 | 括号生成 | 大化小来小化了，分而治之最高效 | ⭐⭐⭐⭐ |

### 核心题目优先级（面试前重点复习）

#### ⭐⭐⭐ 入门必会
1. **爬楼梯70** - DP入门，斐波那契数列变体
2. **打家劫舍198** - 状态机DP简化版，选择问题
3. **最大子数组和53** - Kadane算法，经典一维DP
4. **买卖股票的最佳时机121** - 最简单的股票DP，贪心思想
5. **不同路径62** - 二维DP入门，网格路径问题

#### ⭐⭐⭐⭐ 核心重点  
1. **零钱兑换322** - 完全背包经典，BFS和DP两种思路
2. **分割等和子集416** - 0-1背包变体，子集和问题
3. **最长公共子序列1143** - 双串DP经典，编辑距离前置
4. **最长递增子序列300** - O(n²)和O(nlogn)两种解法
5. **不同的二叉搜索树96** - 卡特兰数/区间DP，递归思想
6. **乘积最大子数组152** - 同时维护最大最小值

#### ⭐⭐⭐⭐⭐ 高频困难
1. **编辑距离72** - 双串DP进阶，三种操作优化
2. **最长回文子序列516** - 区间DP经典
3. **零钱兑换II518** - 完全背包计数问题
4. **单词拆分139** - 字符串DP，记忆化搜索
5. **最长回文子串5** - 中心扩散法和DP两种解法
6. **目标和494** - 01背包变体，数学转化
7. **最大正方形221** - 二维DP经典

### 解题思路总结

#### 🔑 DP问题识别特征
- **最优子结构**：大问题的最优解包含子问题的最优解
- **重叠子问题**：递归过程中存在重复计算
- **无后效性**：当前状态确定后，未来的决策不依赖过去的状态

#### 💡 状态设计原则
1. **状态含义要明确**：`dp[i]`表示什么要一清二楚
2. **状态转移要自然**：从小状态推导大状态的逻辑要合理
3. **边界条件要正确**：base case的设置决定算法正确性
4. **空间优化要恰当**：能用滚动数组就不用二维数组

#### 🎯 常见状态设计模式
- **以位置为状态**：`dp[i]`表示考虑前i个元素
- **以值为状态**：`dp[i]`表示值为i时的最优解  
- **以区间为状态**：`dp[i][j]`表示区间[i,j]的最优解
- **多维状态**：`dp[i][j][k]`表示多个约束条件下的最优解

### 常见陷阱提醒

- ⚠️ **状态转移方程错误**：仔细分析最后一步的所有可能性
- ⚠️ **边界条件遗漏**：dp[0]、dp[i][0]等边界要正确初始化  
- ⚠️ **数组越界**：确保索引在有效范围内，特别是i-1、j-1
- ⚠️ **整数溢出**：结果可能很大时要考虑取模或使用long
- ⚠️ **空间优化错误**：滚动数组时要注意更新顺序
- ⚠️ **背包问题搞混**：0-1背包逆序，完全背包正序

### 时间复杂度速记

- **一维DP**：O(n) - 线性遍历
- **二维DP**：O(mn) - 双重循环
- **背包问题**：O(nW) - n个物品，W容量
- **区间DP**：O(n³) - 三重循环，枚举分割点
- **树形DP**：O(n) - 树的遍历

### 面试答题套路

1. **分析问题特征**
   - 是否有最优子结构？
   - 是否有重叠子问题？
   - 状态空间有多大？

2. **设计状态和转移**
   - 状态定义要清晰
   - 转移方程要正确
   - 边界条件要完整

3. **编码实现**
   - 先写暴力递归
   - 再加记忆化搜索
   - 最后改成迭代DP

4. **优化分析**
   - 能否空间优化？
   - 能否时间优化？
   - 特殊情况处理？

**最重要的心得**：DP的核心是**状态定义**和**状态转移**，把这两点想清楚，代码就是水到渠成的事情！

---

**最重要的一个技巧就是，你得行动，写起来**

