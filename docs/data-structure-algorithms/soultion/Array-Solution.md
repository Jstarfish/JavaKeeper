---
title: 数组热题
date: 2025-01-08
tags: 
 - Array
 - algorithms
 - leetcode
categories: leetcode
---

![](https://cdn.pixabay.com/photo/2019/12/04/18/40/machined-parts-4673364_1280.jpg)

### [1. 两数之和](https://leetcode-cn.com/problems/two-sum/)

> 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。
>
> 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
>
> ```text
> 输入：nums = [2,7,11,15], target = 9
> 输出：[0,1]
> 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
> ```

**思路**：哈希表

```java
public static int[] twoSum(int[] nums,int target){
  Map<Integer,Integer> map = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    int temp = target - nums[i];
    if(map.containsKey(temp)){
      return new int[]{map.get(temp),i};
    }
    map.put(nums[i],i);
  }
  return new int[]{-1,-1};
}
```

时间复杂度：$O(N)$，其中 N 是数组中的元素数量。对于每一个元素 x，我们可以 $O(1)$ 地寻找 target - x。

空间复杂度：$O(N)$，其中 N 是数组中的元素数量。主要为哈希表的开销。



### [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)

> 给你一个字符串数组，请你将 **字母异位词** 组合在一起。可以按任意顺序返回结果列表。
>
> **字母异位词** 是由重新排列源单词的所有字母得到的一个新单词。
>
> ```
> 输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
> 输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
> ```

**思路**：哈希表。键是字符串中的字符排序后的字符串，值是具有相同键的原始字符串列表

```java
public List<List<String>> groupAnagrams(String[] strs) {
      Map<String, List<String>> map = new HashMap<>();

      for (String str : strs) {
          // 将字符串转换为字符数组并排序
          char[] chars = str.toCharArray();
          Arrays.sort(chars);

          // 将排序后的字符数组转换回字符串，作为哈希表的键
          String key = new String(chars);

          // 如果键不存在于哈希表中，则创建新的列表并添加到哈希表中
          if (!map.containsKey(key)) {
              map.put(key, new ArrayList<>());
          }

          // 将原始字符串添加到对应的列表中
          map.get(key).add(str);
      }

      // 返回哈希表中所有值的列表
      return new ArrayList<>(map.values());
  }
```

- 时间复杂度：$O(nklogk)$，其中 n 是 strs 中的字符串的数量，k 是 strs 中的字符串的的最大长度。需要遍历 n 个字符串，对于每个字符串，需要 O(klogk) 的时间进行排序以及 O(1) 的时间更新哈希表，因此总时间复杂度是 O(nklogk)。

- 空间复杂度：$O(nk)$，其中 n 是 strs 中的字符串的数量，k 是 strs 中的字符串的的最大长度。需要用哈希表存储全部字符串



### [128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)

> 给定一个未排序的整数数组 `nums` ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
>
> 请你设计并实现时间复杂度为 `O(n)` 的算法解决此问题。
>
> ```
> 输入：nums = [100,4,200,1,3,2]
> 输出：4
> 解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
> ```

**思路**：哈希表，**每个数都判断一次这个数是不是连续序列的开头那个数**

```java
public int longestConsecutive(int[] nums) {
    Set<Integer> numSet = new HashSet<>();
    int longestStreak = 0;

    // 将数组中的所有数字添加到哈希表中
    for (int num : nums) {
        numSet.add(num);
    }

    // 遍历哈希表中的每个数字
    for (int num : numSet) {
        // 如果 num-1 不在哈希表中，说明 num 是一个连续序列的起点
        if (!numSet.contains(num - 1)) {
            int currentNum = num;
            int currentStreak = 1;

            // 检查 num+1, num+2, ... 是否在哈希表中，并计算连续序列的长度
            while (numSet.contains(currentNum + 1)) {
                currentNum++;
                currentStreak++;
            }

            // 更新最长连续序列的长度
            longestStreak = Math.max(longestStreak, currentStreak);
        }
    }

    return longestStreak;
}
```



### [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

> 给你一个整数数组 `nums` 和一个整数 `k` ，请你统计并返回 *该数组中和为 `k` 的子数组的个数* 。
>
> 子数组是数组中元素的连续非空序列。
>
> ```
> 输入：nums = [1,2,3], k = 3
> 输出：2
> ```

思路：**前缀和 + 哈希表**

1. **遍历数组**，逐步计算前缀和（表示从数组起始位置到当前位置的所有元素之和） `prefixSum`。
2. 检查哈希表中是否存在 `prefixSum - k`：
   - 若存在，累加其出现次数到结果 `count`。
3. **更新哈希表**：将当前前缀和存入哈希表，若已存在则次数加 1。![](https://assets.leetcode-cn.com/solution-static/560/3.PNG)

```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        int count = 0;
        int prefixSum = 0;
        Map<Integer, Integer> sumMap = new HashMap<>();
        sumMap.put(0, 1); // 初始化前缀和为0的计数为1

        for (int num : nums) {
            prefixSum += num;
            // 检查是否存在前缀和为 prefixSum - k 的键
            if (sumMap.containsKey(prefixSum - k)) {
                count += sumMap.get(prefixSum - k);
            }
            // 更新当前前缀和的次数
            sumMap.put(prefixSum, sumMap.getOrDefault(prefixSum, 0) + 1);
        }
        return count;
    }
}
```

- **时间复杂度**：O(n)，每个元素遍历一次。
- **空间复杂度**：O(n)，哈希表最多存储 n 个不同的前缀和。



### [14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/)

> 编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 `""`。
>
> ```
> 输入：strs = ["flower","flow","flight"]
> 输出："fl"
> ```

```java
public String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) {
        return "";
    }

    String prefix = strs[0];
    for (int i = 1; i < strs.length; i++) {
        int j = 0;
        // Compare characters one by one
        while (j < prefix.length() && j < strs[i].length() && prefix.charAt(j) == strs[i].charAt(j)) {
            j++;
        }
        // prefix should be shortened to the common prefix found so far
        prefix = prefix.substring(0, j);
        // If prefix becomes empty, there is no common prefix
        if (prefix.isEmpty()) {
            return "";
        }
    }
    return prefix;
}
```



### [15. 三数之和](https://leetcode-cn.com/problems/3sum/)

> 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
>
> 注意：答案中不可以包含重复的三元组。
>
> ```java
> 输入：nums = [-1,0,1,2,-1,-4]
> 输出：[[-1,-1,2],[-1,0,1]]
> ```

**思路**：排序后双指针

```java
public List<List<Integer>> threeSum(int[] nums) {
  //存放结果list
  List<List<Integer>> result = new ArrayList<>();
  int length = nums.length;
  //特例判断
  if (length < 3) {
    return result;
  }
  Arrays.sort(nums);
  for (int i = 0; i < length; i++) {
    //排序后的第一个数字就大于0，就说明没有符合要求的结果
    if (nums[i] > 0) break;

    //去重，当起始的值等于前一个元素，那么得到的结果将会和前一次相同，不能是 nums[i] == nums[i +1 ]，会造成遗漏
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    //左右指针
    int l = i + 1;
    int r = length - 1;
    while (l < r) {
      int sum = nums[i] + nums[l] + nums[r];
      if (sum == 0) {
        result.add(Arrays.asList(nums[i], nums[l], nums[r]));
        //去重（相同数字的话就移动指针）
        //在将左指针和右指针移动的时候，先对左右指针的值，进行判断,以防[0,0,0]这样的造成数组越界
        //不要用成 if 判断，只跳过 1 条，还会有重复的
        while (l< r && nums[l] == nums[l + 1]) l++;
        while (l< r && nums[r] == nums[r - 1]) r--;
        //移动指针
        l++;
        r--;
      } else if (sum < 0) l++;
 		else if (sum > 0) r--;
    }
  }
  return result;
}
```



### [217. 存在重复元素](https://leetcode-cn.com/problems/contains-duplicate/)

> 给定一个整数数组，判断是否存在重复元素。如果存在一值在数组中出现至少两次，函数返回 `true` 。如果数组中每个元素都不相同，则返回 `false` 。
>
> ```
> 输入: [1,2,3,1]
> 输出: true
> ```
>
> ```
> 输入: [1,2,3,4]
> 输出: false
> ```

**思路**：哈希，和两数之和的思路一样 | 或者排序

```java
public boolean containsDuplicate(int[] nums){
  Map<Integer,Integer> map = new HashMap<>();
  for(int i=0;i<nums.length;i++){
    if(map.containsKey(nums[i])){
      return true;
    }
    map.put(nums[i],i);
  }
  return false;
}
```



### [56. 合并区间](https://leetcode.cn/problems/merge-intervals/)

> 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。
>
> ```
> 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
> 输出：[[1,6],[8,10],[15,18]]
> 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
> ```

**思路**：



### [121. 买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

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
>      注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
> ```

**思路**：暴力法，双循环

```java
public static int maxProfit_1(int[] nums){
  int maxProfit=0;
  //第一层不需要遍历到最后，第二层从i+1 开始就可以
  for(int i=0;i<nums.length-1;i++){
    for(int j=1;j<nums.length-1;j++){
      // 比较的是数据的值，不是下标，别写成maxProfit < j-i
      if(maxProfit < nums[j] - nums[i]){
        maxProfit = nums[j] - nums[i];
      }
    }
  }
  return maxProfit;
}
```



### [11. 盛最多水的容器](https://leetcode-cn.com/problems/container-with-most-water/)

> 给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
>
> ![](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)
>
> ```
> 输入：[1,8,6,2,5,4,8,3,7]
> 输出：49 
> 解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
> ```

**思路**：双指针

水量 = 两个指针指向的数字中较小值∗指针之间的距离

一开始两个指针一个指向开头一个指向结尾，此时容器的底是最大的，随着我们移动两个指针，想要让指针移动后的容器面积增大，就要使移动后的容器的高尽量大，所以我们选择指针所指的高较小的那个指针进行移动，这样我们就保留了容器较高的那条边，放弃了较小的那条边

```java
public int maxArea(int[] height){
  int l = 0;
  int r = height.length - 1;
  int ans = 0;
  while(l < r){
    int area = Math.min(height[l], height[r]) * (r - l);
    ans = Math.max(ans,area);
    if(height[l] < height[r]){
      l ++;
    }else {
      r --;
    }
  }
  return ans;
}
```



### [53. 最大子数组和](https://leetcode-cn.com/problems/maximum-subarray/)

> 给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
>
> **子数组** 是数组中的一个连续部分。
>
> ```
> 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
> 输出：6
> 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
> ```

**思路**：「连续」子数组，题目要求的是返回结果，用 [动态规划、分治]

```java
public static int maxSubArray(int[] nums) {
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
    // 和最大数对比 取大
    ans = Math.max(ans, dp[i]);
  }
  return ans;
}

//优化版
public int maxSubArray(int[] nums) {
  int pre = 0, maxAns = nums[0];
  for (int x : nums) {
    pre = Math.max(pre + x, x);
    maxAns = Math.max(maxAns, pre);
  }
  return maxAns;
}
```



### [56. 合并区间](https://leetcode.cn/problems/merge-intervals/)

> 以数组 `intervals` 表示若干个区间的集合，其中单个区间为 `intervals[i] = [starti, endi]` 。请你合并所有重叠的区间，并返回 *一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间* 。
>
> ```
> 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
> 输出：[[1,6],[8,10],[15,18]]
> 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
> ```

思路：

1. **排序** 将区间按起始位置升序排列，使可能重叠的区间相邻，便于合并操作

   ![](https://pic.leetcode-cn.com/50417462969bd13230276c0847726c0909873d22135775ef4022e806475d763e-56-2.png)

2. **合并逻辑**

   **遍历判断**：依次遍历排序后的区间，比较当前区间与结果列表中的最后一个区间是否重叠：

   - 重叠条件：当前区间起始 ≤ 结果列表中最后一个区间的结束。
   - 合并操作：更新结果列表中最后一个区间的结束值为两者的最大值。
   - **非重叠条件**：直接将当前区间加入结果列表

```java
public int[][] merge(int[][] intervals) {
     // 边界条件：空数组直接返回空
    if (intervals.length == 0) return new int[0][];

    // 按区间起始点升序排序
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    // 结果列表
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]); // 初始化第一个区间

    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int[] current = intervals[i];

        if (current[0] <= last[1]) { // 重叠，合并区间
            last[1] = Math.max(last[1], current[1]); // 更新结束值为较大值
        } else { // 不重叠，直接添加
            merged.add(current);
        }
    }

    return merged.toArray(new int[merged.size()][]); // 转换为二维数组
}
```



### [283. 移动零](https://leetcode-cn.com/problems/move-zeroes/)

> 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
>
> ```
> 输入: [0,1,0,3,12]
> 输出: [1,3,12,0,0]
> ```
>
> 1. 必须在原数组上操作，不能拷贝额外的数组。
> 2. 尽量减少操作次数。

![283_2.gif](https://pic.leetcode-cn.com/36d1ac5d689101cbf9947465e94753c626eab7fcb736ae2175f5d87ebc85fdf0-283_2.gif)

思路：双指针法，当快指针指向非零元素时，将其与慢指针指向的元素交换，然后慢指针向前移动一位。最后将慢指针之后的所有元素置为0。

```java
public void moveZero(int[] nums) {
    int j = 0;   //慢指针
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            nums[j++] = nums[i]; // 直接将非零元素放到j指针位置，并移动j指针
        }
    }
    // 将j指针之后的所有元素置为零
    for (int i = j; i < nums.length; i++) {
        nums[i] = 0;
    }
}
```

- 时间复杂度：$O(n)$，其中 *n* 为序列长度。
- 空间复杂度：$O(1)$。只需要常数的空间存放若干变量。



### [448. 找到所有数组中消失的数字](https://leetcode-cn.com/problems/find-all-numbers-disappeared-in-an-array/)

> 给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字，并以数组的形式返回结果。
>
> ```
> 输入：nums = [4,3,2,7,8,2,3,1]
> 输出：[5,6]
> ```
>
> ```
> 输入：nums = [1,1]
> 输出：[2]
> ```

```java
public static List<Integer> findNumbers(int[] nums){
  List<Integer> list = new ArrayList<>();
  int[] x = new int[nums.length + 1];
  //用一个新的数组，占位，数据长度大1，原数组元素放在对应的下边下，最后数组位是0的就是缺失元素
  for (int i = 0; i < nums.length; i++) {
    x[nums[i]]++;
  }
  for (int i = 1; i < x.length; i++) {
    if(x[i] == 0){
      list.add(i);
    }
  }
  return list;
}
```



### [215. 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

> 给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。
>
> 请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。
>
> ```
> 输入: [3,2,1,5,6,4] 和 k = 2
> 输出: 5
> ```
>
> ```
> 输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
> 输出: 4
> ```

**思路**：减而治之（逐渐缩小问题规模） 基于快排

```java
class Solution {
    Random random = new Random();

    public int findKthLargest(int[] nums, int k) {
        return quickSelect(nums, 0, nums.length - 1, nums.length - k);
    }

    public int quickSelect(int[] a, int l, int r, int index) {
        int q = randomPartition(a, l, r);
        if (q == index) {
            return a[q];
        } else {
            return q < index ? quickSelect(a, q + 1, r, index) : quickSelect(a, l, q - 1, index);
        }
    }

    public int randomPartition(int[] a, int l, int r) {
        int i = random.nextInt(r - l + 1) + l;
        swap(a, i, r);
        return partition(a, l, r);
    }

    public int partition(int[] a, int l, int r) {
        int x = a[r], i = l - 1;
        for (int j = l; j < r; ++j) {
            if (a[j] <= x) {
                swap(a, ++i, j);
            }
        }
        swap(a, i + 1, r);
        return i + 1;
    }

    public void swap(int[] a, int i, int j) {
        int temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}
```





### [31. 下一个排列](https://leetcode.cn/problems/next-permutation/)

> 整数数组的一个 排列  就是将其所有成员以序列或线性顺序排列。
>
> 例如，arr = [1,2,3] ，以下这些都可以视作 arr 的排列：[1,2,3]、[1,3,2]、[3,1,2]、[2,3,1] 。
> 整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 下一个排列 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。
>
> - 例如，arr = [1,2,3] 的下一个排列是 [1,3,2] 。
> - 类似地，arr = [2,3,1] 的下一个排列是 [3,1,2] 。
> - 而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。
>
> 给你一个整数数组 nums ，找出 nums 的下一个排列。
>
> > 题干的意思就是：找出这个数组排序出的所有数中，刚好比当前数大的那个数
>
> 必须 原地 修改，只允许使用额外常数空间。
>
> ```
> 输入：nums = [1,2,3]
> 输出：[1,3,2]
> ```
>
> ```
> 输入：nums = [3,2,1]
> 输出：[1,2,3]
> ```

**思路**：





### [88. 合并两个有序数组](https://leetcode-cn.com/problems/merge-sorted-array/)

> 给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
>
> 请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
>
> 注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。
>
> ```
> 输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
> 输出：[1,2,2,3,5,6]
> 解释：需要合并 [1,2,3] 和 [2,5,6] 。
> 合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。
> ```

**思路**：

- 直接合并后排序
- 双指针

```java
public void merge(int[] nums1, int m, int[] nums2, int n) {
  for (int i = 0; i != n; ++i) {
    nums1[m + i] = nums2[i];
  }
  Arrays.sort(nums1);
}
```



### [136. 只出现一次的数字](https://leetcode.cn/problems/single-number/)

> 给你一个 **非空** 整数数组 `nums` ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
>
> 你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
>
> ```
> 输入：nums = [4,1,2,1,2]
> 
> 输出：4
> ```

思路：**异或运算**

异或运算（`^`）有以下几个重要性质：

1. 任何数和 `0` 做异或运算，结果仍然是原来的数，即 `a ^ 0 = a`。
2. 任何数和其自身做异或运算，结果是 `0`，即 `a ^ a = 0`。
3. 异或运算满足交换律和结合律，即 `a ^ b ^ c = a ^ (b ^ c) = (a ^ b) ^ c`。

```java
public int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;
}
```



### [169. 多数元素](https://leetcode.cn/problems/majority-element/)

> 给定一个大小为 `n` 的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 **大于** `⌊ n/2 ⌋` 的元素。
>
> 你可以假设数组是非空的，并且给定的数组总是存在多数元素。
>
> ```
> 输入：nums = [2,2,1,1,1,2,2]
> 输出：2
> ```

思路：排序后取中间元素，如果将数组 `nums` 中的所有元素按照单调递增或单调递减的顺序排序，那么下标为 ⌊2*n*⌋ 的元素（下标从 `0` 开始）一定是众数。

```java
class Solution {
    public int majorityElement(int[] nums) {
        Arrays.sort(nums);
        return nums[nums.length / 2];
    }
}
```



### [75. 颜色分类](https://leetcode.cn/problems/sort-colors/)

> 给定一个包含红色、白色和蓝色、共 `n` 个元素的数组 `nums` ，**[原地](https://baike.baidu.com/item/原地算法)** 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
>
> 我们使用整数 `0`、 `1` 和 `2` 分别表示红色、白色和蓝色。
>
> 必须在不使用库内置的 sort 函数的情况下解决这个问题。
>
> ```
> 输入：nums = [2,0,2,1,1,0]
> 输出：[0,0,1,1,2,2]
> ```

思路：双指针（荷兰国旗问题）。用 3 个指针遍历数组，过程中，移动 left 、right 和 curr 指针即可。

```java
public void sortColors(int[] nums) {
    // 初始化三个指针
    int left = 0; // 左指针，指向当前遍历到的最左边的一个0的右侧
    int right = nums.length - 1; // 右指针，指向当前遍历到的最右边的一个2的左侧
    int curr = 0; // 当前遍历指针

    // 遍历数组
    while (curr <= right) {
        // 如果当前元素是0，则将其与左指针指向的元素交换，并将左指针和右指针都向右移动一位
        if (nums[curr] == 0) {
            swap(nums, curr, left);
            left++;
            curr++;
        } 
        // 如果当前元素是2，则将其与右指针指向的元素交换，但只将右指针向左移动一位
        // 因为交换过来的元素可能是0或1，需要再次判断
        else if (nums[curr] == 2) {
            swap(nums, curr, right);
            right--;
        } 
        // 如果当前元素是1，则只需将当前指针向右移动一位
        else {
            curr++;
        }
    }
}

// 交换数组中两个元素的位置
private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
```



### [287. 寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/)

> 给定一个包含 `n + 1` 个整数的数组 `nums` ，其数字都在 `[1, n]` 范围内（包括 `1` 和 `n`），可知至少存在一个重复的整数。
>
> 假设 `nums` 只有 **一个重复的整数** ，返回 **这个重复的数** 。
>
> 你设计的解决方案必须 **不修改** 数组 `nums` 且只用常量级 `O(1)` 的额外空间。
>
> ```
> 输入：nums = [1,3,4,2,2]
> 输出：2
> ```

**思路**：由于题目要求不能修改原数组（不能排序），且空间复杂度为$O(1)$，时间复杂度低于$O(n^2)$，我们可以使用二分查找或者快慢指针（循环检测）的方法。

1. 二分查找（基于抽屉原理）

   抽屉原理：如果有 n 个抽屉和 n+1 个物品，那么至少有一个抽屉有至少两个物品。

   我们不是在原始数组上进行二分，而是在数字范围上进行二分。数字的范围是 [1, n]。
   对于中间数 mid，统计数组中 <= mid 的元素的个数 count：

   - 如果 count <= mid，那么重复元素一定在 [mid+1, n] 之间。

   - 否则，重复元素在 [1, mid] 之间。

   ```java
   public int findDuplicate(int[] nums) {
       int left = 1;
       int right = nums.length - 1;
       while (left < right) {
           int mid = left + (right - left) / 2;
           int count = 0;
           for (int num : nums) {
               if (num <= mid) {
                   count++;
               }
           }
           if (count > mid) {
               right = mid;
           } else {
               left = mid + 1;
           }
       }
       return left;
   }
   ```

2. 快慢指针法

   把数组`nums`看成一个特殊的链表，数组的索引是链表节点的编号，数组的值是指向下一个节点的指针。因为存在重复数字，所以链表中必然存在环，那么问题就转化为寻找链表环的入口，该入口对应的数字就是重复的数。

   - 初始化两个指针`slow`和`fast`，都指向数组的第一个元素，即`nums[0]`。
   - 让`slow`指针每次走一步（`slow = nums[slow]`），`fast`指针每次走两步（`fast = nums[nums[fast]]`），直到`slow`和`fast`相遇。
   - 相遇后，将`fast`指针重新指向`nums[0]`，然后`slow`和`fast`指针每次都走一步，当它们再次相遇时，相遇点对应的数字就是重复的数。

   ```java
   public int findDuplicate(int[] nums) {
       int slow = nums[0];
       int fast = nums[0];
       // 第一轮，找到相遇点
       do {
           slow = nums[slow];
           fast = nums[nums[fast]];
       } while (slow != fast);
   
       // 重置其中一个指针到起点
       fast = nums;
       // 两个指针都每次一步移动，直到相遇
       while (slow != fast) {
           slow = nums[slow];
           fast = nums[fast];
       }
       return slow; // 或者fast，此时它们相等
   }
   ```

   
