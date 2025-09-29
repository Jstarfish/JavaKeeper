---
title: 数组-热题
date: 2025-01-08
tags: 
 - Array
 - algorithms
categories: leetcode
---

![](https://img.starfish.ink/leetcode/leetcode-banner.png)

> **导读**：数组是最基础的数据结构，也是面试中最高频的考点。数组题目看似简单，但往往需要巧妙的算法技巧才能高效解决。掌握双指针、滑动窗口、前缀和等核心技巧是解决数组问题的关键。
>
> **关键词**：双指针、滑动窗口、前缀和、哈希表、排序


### 📋 分类索引

1. **🔥 双指针技巧类**：[三数之和](#_15-三数之和)、[盛最多水的容器](#_11-盛最多水的容器)、[移动零](#_283-移动零)、[颜色分类](#_75-颜色分类)、[接雨水](#_42-接雨水)
2. **🔍 哈希表优化类**：[两数之和](#_1-两数之和)、[字母异位词分组](#_49-字母异位词分组)、[最长连续序列](#_128-最长连续序列)、[存在重复元素](#_217-存在重复元素)
3. **🪟 滑动窗口类**：[无重复字符的最长子串](#_3-无重复字符的最长子串)、最小覆盖子串
4. **📊 前缀和技巧类**：[和为K的子数组](#_560-和为-k-的子数组)、[最大子数组和](#_53-最大子数组和)、[除自身以外数组的乘积](#_238-除自身以外数组的乘积)
5. **🔄 排序与搜索类**：[合并区间](#_56-合并区间)、[数组中的第K个最大元素](#_215-数组中的第k个最大元素)、[寻找重复数](#_287-寻找重复数)、[下一个排列](#_31-下一个排列)、[搜索旋转排序数组](#_33-搜索旋转排序数组)
6. **⚡ 原地算法类**：[合并两个有序数组](#_88-合并两个有序数组)、[旋转数组](#_189-旋转数组)
7. **🧮 数学技巧类**：[只出现一次的数字](#_136-只出现一次的数字)、[多数元素](#_169-多数元素)、[找到所有数组中消失的数字](#_448-找到所有数组中消失的数字)、[缺失的第一个正数](#_41-缺失的第一个正数)
8. **🎯 综合应用类**：[买卖股票的最佳时机](#_121-买卖股票的最佳时机)、[乘积最大子数组](#_152-乘积最大子数组)、[子集](#_78-子集)、[跳跃游戏](#_55-跳跃游戏)、[跳跃游戏 II](#_45-跳跃游戏-ii)、[最长公共前缀](#_14-最长公共前缀)、[螺旋矩阵](#_54-螺旋矩阵)

### 🎯 核心考点概览

- **双指针技巧**：快慢指针、左右指针、滑动窗口
- **哈希表优化**：空间换时间，$O(1)$查找
- **前缀和技巧**：区间求和，子数组问题
- **排序与搜索**：二分查找、快速选择
- **原地算法**：$O(1)$空间复杂度优化

### 📝 解题万能模板

#### 基础模板

```java
// 双指针模板
int left = 0, right = nums.length - 1;
while (left < right) {
    if (condition) {
        left++;
    } else {
        right--;
    }
}

// 滑动窗口模板  
int left = 0, right = 0;
while (right < nums.length) {
    // 扩展窗口
    window.add(nums[right]);
    right++;
    
    while (window needs shrink) {
        // 收缩窗口
        window.remove(nums[left]);
        left++;
    }
}

// 前缀和模板
int[] prefixSum = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefixSum[i + 1] = prefixSum[i] + nums[i];
}
```

#### 边界检查清单

- ✅ 空数组：`if (nums == null || nums.length == 0) return ...`
- ✅ 单元素：`if (nums.length == 1) return ...`
- ✅ 数组越界：确保索引在有效范围内
- ✅ 整数溢出：使用long或检查边界

#### 💡 记忆口诀（朗朗上口版）

- **双指针**："左右夹逼找目标，快慢追踪解环题"
- **滑动窗口**："右扩左缩维护窗，条件满足就更新"
- **前缀和**："累积求和建数组，区间相减得答案"
- **哈希表**："空间换时间来优化，常数查找是关键"
- **二分查找**："有序数组用二分，对数时间最高效"
- **原地算法**："双指针巧妙来交换，空间复杂度为一"

**最重要的一个技巧就是，你得行动，写起来**



## 一、双指针技巧类（核心中的核心）🔥 

**💡 核心思想**

- **左右指针**：从两端向中间逼近，解决对撞类问题
- **快慢指针**：不同速度遍历，解决环形、去重问题
- **滑动窗口**：双指针维护窗口，解决子数组问题

**🎯 必掌握模板**

```java
// 左右指针模板
int left = 0, right = nums.length - 1;
while (left < right) {
    if (sum < target) {
        left++;
    } else if (sum > target) {
        right--;
    } else {
        // 找到答案
        return ...;
    }
}
```

### [15. 三数之和](https://leetcode-cn.com/problems/3sum/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：双指针经典**

> 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

**💡 核心思路**：排序后双指针

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

### [11. 盛最多水的容器](https://leetcode-cn.com/problems/container-with-most-water/)

**🎯 考察频率：高 | 难度：中等 | 重要性：双指针应用**

> 给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

**💡 核心思路**：双指针

水量 = 两个指针指向的数字中较小值∗指针之间的距离

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

### [283. 移动零](https://leetcode-cn.com/problems/move-zeroes/)

**🎯 考察频率：高 | 难度：简单 | 重要性：双指针基础**

> 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

**💡 核心思路**：双指针法，当快指针指向非零元素时，将其与慢指针指向的元素交换，然后慢指针向前移动一位。

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

### [75. 颜色分类](https://leetcode.cn/problems/sort-colors/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：三指针技巧**

> 给定一个包含红色（0）、白色（1）、蓝色（2）的数组 `nums`，要求你对它们进行排序，使得相同颜色相邻，并按照红、白、蓝的顺序排列。

**💡 核心思路**：双指针（荷兰国旗问题）。用 3 个指针遍历数组。

这题被称为 **荷兰国旗问题 (Dutch National Flag Problem)**。
 用 **三个指针** 解决：

- `low`：下一个 0 应该放置的位置
- `high`：下一个 2 应该放置的位置
- `i`：当前遍历位置

规则：

1. 如果 `nums[i] == 0` → 和 `nums[low]` 交换，`low++，i++`
2. 如果 `nums[i] == 1` → 正常情况，`i++`
3. 如果 `nums[i] == 2` → 和 `nums[high]` 交换，`high--`，**但 i 不++**，因为换过来的数还要检查

这样一次遍历就能完成排序。

```java
public void sortColors(int[] nums) {
    int left = 0, right = nums.length - 1, curr = 0;
    while (curr <= right) {
        if (nums[curr] == 0) {
            swap(nums, curr++, left++);
        } else if (nums[curr] == 2) {
            swap(nums, curr, right--);
        } else {
            curr++;
        }
    }
}

private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
```

### [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)

**🎯 考察频率：极高 | 难度：困难 | 重要性：双指针+贪心**

> 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能够接多少雨水。

**💡 核心思路**：双指针法

```java
public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0;
    int result = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                result += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                result += rightMax - height[right];
            }
            right--;
        }
    }
    return result;
}
```



---

## 二、哈希表优化类（空间换时间）🔍 

**💡 核心思想**

- **O(1)查找**：利用哈希表常数时间查找特性
- **空间换时间**：用额外空间降低时间复杂度
- **去重与计数**：处理重复元素和频次统计

**🎯 必掌握模板**

```java
// 哈希表查找模板
Map<Integer, Integer> map = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    if (map.containsKey(target - nums[i])) {
        // 找到答案
        return new int[]{map.get(target - nums[i]), i};
    }
    map.put(nums[i], i);
}
```

### [1. 两数之和](https://leetcode-cn.com/problems/two-sum/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：哈希表经典**

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

**⏱️ 复杂度分析**：

- **时间复杂度**：O(N)，其中 N 是数组中的元素数量。对于每一个元素 x，我们可以 O(1) 地寻找 target - x。
- **空间复杂度**：O(N)，其中 N 是数组中的元素数量。主要为哈希表的开销。

### [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)

**🎯 考察频率：高 | 难度：中等 | 重要性：分组统计经典**

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

### [217. 存在重复元素](https://leetcode-cn.com/problems/contains-duplicate/)

**🎯 考察频率：简单 | 难度：简单 | 重要性：哈希表基础**

> 给定一个整数数组，判断是否存在重复元素。如果存在一值在数组中出现至少两次，函数返回 `true` 。如果数组中每个元素都不相同，则返回 `false` 。

**💡 核心思路**：哈希表，和两数之和的思路一样 | 或者排序

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

### [128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)

**🎯 考察频率：高 | 难度：中等 | 重要性：哈希表高效查找**

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

### [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：滑动窗口经典**

> 给定一个字符串 s ，请你找出其中不含有重复字符的最长子串的长度。

**💡 核心思路**：滑动窗口 + 哈希表

```java
public int lengthOfLongestSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int left = 0, maxLen = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        while (window.contains(c)) {
            window.remove(s.charAt(left));
            left++;
        }
        window.add(c);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

**⏱️ 复杂度分析**：
- **时间复杂度**：O(n) - 每个字符最多被访问两次（一次by right，一次by left）
- **空间复杂度**：O(min(m,n)) - m是字符集大小，n是字符串长度


---

## 三、前缀和技巧类（区间计算利器）📊 

**💡 核心思想**

- **累积求和**：预处理前缀和数组，快速计算区间和
- **差值技巧**：利用前缀和差值解决子数组问题
- **哈希优化**：结合哈希表优化前缀和查找

**🎯 必掌握模板**

```java
// 前缀和模板
int[] prefixSum = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefixSum[i + 1] = prefixSum[i] + nums[i];
}
// 区间[i,j]的和 = prefixSum[j+1] - prefixSum[i]

// 前缀和+哈希表模板
Map<Integer, Integer> map = new HashMap<>();
map.put(0, 1); // 前缀和为0出现1次
int prefixSum = 0;
for (int num : nums) {
    prefixSum += num;
    if (map.containsKey(prefixSum - k)) {
        count += map.get(prefixSum - k);
    }
    map.put(prefixSum, map.getOrDefault(prefixSum, 0) + 1);
}
```

### [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：前缀和+哈希表经典**

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
```

- **时间复杂度**：O(n)，每个元素遍历一次。
- **空间复杂度**：O(n)，哈希表最多存储 n 个不同的前缀和。

### [238. 除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：前缀乘积**

> 给你一个整数数组 nums，返回数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积。

**💡 核心思路**：左右乘积数组

```java
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];
    
    // 计算左侧所有元素的乘积
    answer[0] = 1;
    for (int i = 1; i < n; i++) {
        answer[i] = nums[i - 1] * answer[i - 1];
    }
    
    // 计算右侧所有元素的乘积并更新答案
    int rightProduct = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] = answer[i] * rightProduct;
        rightProduct *= nums[i];
    }
    
    return answer;
}
```


---



## 四、排序与搜索类（有序数据处理）🔄 

**💡 核心思想**

- **预排序**：先排序再处理，降低问题复杂度
- **二分查找**：在有序数组中快速定位
- **快速选择**：基于快排的选择算法
- **区间处理**：排序后处理重叠区间问题

**🎯 必掌握模板**

```java
// 排序+双指针模板
Arrays.sort(nums);
int left = 0, right = nums.length - 1;
while (left < right) {
    // 处理逻辑
}

// 二分查找模板
int left = 0, right = nums.length - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
}
```

### [31. 下一个排列](https://leetcode.cn/problems/next-permutation/)

**🎯 考察频率：高 | 难度：中等 | 重要性：字典序算法**

> 整数数组的一个 **排列** 就是将其所有成员以序列或线性顺序排列。
>
> 例如，arr = [1,2,3] ，以下这些都可以视作 arr 的排列：[1,2,3]、[1,3,2]、[3,1,2]、[2,3,1] 。
> 整数数组的 **下一个排列** 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 **下一个排列** 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。
>
> - 例如，arr = [1,2,3] 的下一个排列是 [1,3,2] 。
> - 类似地，arr = [2,3,1] 的下一个排列是 [3,1,2] 。
> - 而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。
>
> 给你一个整数数组 nums ，找出 nums 的下一个排列。
>
> **题干的意思就是**：找出这个数组排序出的所有数中，刚好比当前数大的那个数
>
> 必须 **原地** 修改，只允许使用额外常数空间。
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

**💡 核心思路**：两遍扫描算法

1. **从右往左找第一个逆序对**：找到 nums[i] < nums[i+1] 的位置 i
2. **从右往左找第一个大于nums[i]的数**：找到位置 j，满足 nums[j] > nums[i]
3. **交换 nums[i] 和 nums[j]**
4. **反转 i+1 到末尾的部分**：使其变为最小的字典序

```java
public void nextPermutation(int[] nums) {
    // 步骤1：从右向左找到第一个比右边元素小的元素
    int i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    // 步骤2：如果找到这样的元素，再从右向左找第一个比它大的元素并交换
    if (i >= 0) {
        int j = nums.length - 1;
        while (nums[j] <= nums[i]) {
            j--;
        }
        swap(nums, i, j);
    }

    // 步骤3：反转i后面的元素，使其成为最小排列
    reverse(nums, i + 1);
}

// 交换数组中两个位置的元素
private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

// 反转数组中从start位置到末尾的元素
private void reverse(int[] nums, int start) {
    int left = start;
    int right = nums.length - 1;
    while (left < right) {
        swap(nums, left, right);
        left++;
        right--;
    }
}
```

**⏱️ 复杂度分析**：
- **时间复杂度**：O(n) - 最多遍历数组3次
- **空间复杂度**：O(1) - 只使用了常数级别的额外空间



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

### [215. 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：快速选择算法**

> 给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

**💡 核心思路**：快速选择算法（基于快排的分治思想）

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

### [287. 寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/)

**🎯 考察频率：高 | 难度：中等 | 重要性：二分查找应用**

> 给定一个包含 `n + 1` 个整数的数组 `nums` ，其数字都在 `[1, n]` 范围内，可知至少存在一个重复的整数。

**💡 核心思路**：二分查找（基于抽屉原理）

- 利用二分查找的思路，统计数组中小于等于中间值的数的个数
- 如果个数大于中间值，说明重复数在左半部分，否则在右半部分

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

### [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：二分查找变体**

> 整数数组 nums 按升序排列，数组中的值互不相同。在传递给函数之前，nums 在预先未知的某个下标 k 上进行了旋转。

**💡 核心思路**：二分查找，判断哪一边是有序的

```java
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        }
        
        // 判断左半部分是否有序
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else { // 右半部分有序
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}
```

---

## 五、数学技巧类（巧妙算法优化）🧮 

**💡 核心思想**

- **位运算技巧**：利用异或、与运算等特性
- **数学性质**：利用数组特殊性质简化问题
- **原地标记**：不使用额外空间的标记方法

**🎯 必掌握模板**

```java
// 异或运算模板（找单独元素）
int result = 0;
for (int num : nums) {
    result ^= num; // 相同元素异或为0，单独元素保留
}

// 原地标记模板（数组作为哈希表）
for (int i = 0; i < nums.length; i++) {
    int index = Math.abs(nums[i]) - 1;
    if (nums[index] > 0) {
        nums[index] = -nums[index]; // 标记已访问
    }
}
```

### [136. 只出现一次的数字](https://leetcode.cn/problems/single-number/)

**🎯 考察频率：高 | 难度：简单 | 重要性：异或运算经典**

> 给你一个非空整数数组 `nums` ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

**💡 核心思路**：异或运算

- 初始化结果：result = 0, 任何数和 0 异或都是它本身
- 由于异或运算的性质，出现两次的数字会被互相抵消，最终 result 就是只出现一次的数字

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

**🎯 考察频率：高 | 难度：简单 | 重要性：Boyer-Moore算法**

> 给定一个大小为 `n` 的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数大于 `⌊ n/2 ⌋` 的元素。

**💡 核心思路**：排序后取中间元素

```java
class Solution {
    public int majorityElement(int[] nums) {
        Arrays.sort(nums);
        return nums[nums.length / 2];
    }
}
```

### [448. 找到所有数组中消失的数字](https://leetcode-cn.com/problems/find-all-numbers-disappeared-in-an-array/)

**🎯 考察频率：中等 | 难度：简单 | 重要性：原地标记**

> 给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字。

**💡 核心思路**：原地标记法

```java
public static List<Integer> findNumbers(int[] nums){
    List<Integer> list = new ArrayList<>();
    int[] x = new int[nums.length + 1]; 
    // 新建一个数组 x，用来做哈希表，占位标记。
    // 注意：长度是 nums.length + 1，因为我们希望下标范围 0..n，
    // 这样 1..n 的数字就能直接映射到数组下标。
    
    // 1. 遍历 nums，把出现的数字对应位置标记
    for (int i = 0; i < nums.length; i++) {
        x[nums[i]]++; // 出现一次就加一
    }
    
    // 2. 再遍历 x，找到没出现过的数字
    for (int i = 1; i < x.length; i++) { // 注意从 1 开始，因为 0 不是合法数字
        if(x[i] == 0){
            list.add(i); // 没出现的数字加入结果集
        }
    }
    
    return list;
}
```

### [41. 缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/)

**🎯 考察频率：高 | 难度：困难 | 重要性：原地哈希**

> 给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

**💡 核心思路**：原地哈希，将数组本身作为哈希表

```java
public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    
    // 将不在范围[1,n]的数字置为n+1
    for (int i = 0; i < n; i++) {
        if (nums[i] <= 0 || nums[i] > n) {
            nums[i] = n + 1;
        }
    }
    
    // 用数组下标标记数字是否出现
    for (int i = 0; i < n; i++) {
        int num = Math.abs(nums[i]);
        if (num <= n) {
            nums[num - 1] = -Math.abs(nums[num - 1]);
        }
    }
    
    // 找第一个正数的位置
    for (int i = 0; i < n; i++) {
        if (nums[i] > 0) {
            return i + 1;
        }
    }
    
    return n + 1;
}
```

---

## 六、原地算法类（空间优化大师）⚡ 

**💡 核心思想**

- **双指针交换**：使用双指针原地重排元素
- **环形替换**：循环移动元素到正确位置
- **分区思想**：将数组分为不同区域处理

### [88. 合并两个有序数组](https://leetcode-cn.com/problems/merge-sorted-array/)

**🎯 考察频率：高 | 难度：简单 | 重要性：原地合并**

> 给你两个按非递减顺序排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
>
> 注意：
>
> - `nums1` 的长度为 `m + n`，其中前 `m` 个元素表示有效部分，后 `n` 个元素为空（用来存放 `nums2` 的元素）。
> - `nums2` 的长度为 `n`。
>
> ```
> 输入:
> nums1 = [1,2,3,0,0,0], m = 3
> nums2 = [2,5,6], n = 3
> 
> 输出:
> [1,2,2,3,5,6]
> ```

**💡 核心思路**：直接合并后排序 或 从后往前双指针合并

```java
public void merge(int[] nums1, int m, int[] nums2, int n) {
  for (int i = 0; i != n; ++i) {
    nums1[m + i] = nums2[i];
  }
  Arrays.sort(nums1);
}
```

### [189. 旋转数组](https://leetcode.cn/problems/rotate-array/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：原地算法**

> 给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。

**💡 核心思路**：三次反转

```java
public void rotate(int[] nums, int k) {
    k %= nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
}

private void reverse(int[] nums, int start, int end) {
    while (start < end) {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}
```

---

## 七、综合应用类（面试高频）🎯 

**💡 核心思想**

- **多技巧结合**：综合运用多种数组处理技巧
- **实际应用场景**：贴近实际开发中的问题

### [53. 最大子数组和](https://leetcode-cn.com/problems/maximum-subarray/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：动态规划经典**

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

### [121. 买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：动态规划入门**

> 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。

**💡 核心思路**：一次遍历，记录最低价格和最大利润

```java
public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    
    return maxProfit;
}
```

### [152. 乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/)

**🎯 考察频率：高 | 难度：中等 | 重要性：动态规划变体**

> 给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续子数组，并返回该子数组所对应的乘积。

**💡 核心思路**：动态规划，同时维护最大值和最小值

```java
public int maxProduct(int[] nums) {
    int maxSoFar = nums[0];
    int minSoFar = nums[0];
    int result = maxSoFar;
    
    for (int i = 1; i < nums.length; i++) {
        int curr = nums[i];
        int tempMaxSoFar = Math.max(curr, Math.max(maxSoFar * curr, minSoFar * curr));
        minSoFar = Math.min(curr, Math.min(maxSoFar * curr, minSoFar * curr));
        
        maxSoFar = tempMaxSoFar;
        result = Math.max(maxSoFar, result);
    }
    
    return result;
}
```

### [78. 子集](https://leetcode.cn/problems/subsets/)

**🎯 考察频率：高 | 难度：中等 | 重要性：回溯算法**

> 给你一个整数数组 nums ，数组中的元素互不相同。返回该数组所有可能的子集（幂集）。

**💡 核心思路**：回溯算法

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(result, new ArrayList<>(), nums, 0);
    return result;
}

private void backtrack(List<List<Integer>> result, List<Integer> tempList, int[] nums, int start) {
    result.add(new ArrayList<>(tempList));
    for (int i = start; i < nums.length; i++) {
        tempList.add(nums[i]);
        backtrack(result, tempList, nums, i + 1);
        tempList.remove(tempList.size() - 1);
    }
}
```

### [55. 跳跃游戏](https://leetcode.cn/problems/jump-game/)

**🎯 考察频率：高 | 难度：中等 | 重要性：贪心算法**

> 给定一个非负整数数组 nums ，你最初位于数组的第一个下标。数组中的每个元素代表你在该位置可以跳跃的最大长度。

**💡 核心思路**：贪心算法，维护能到达的最远位置

```java
public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            return false;
        }
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}
```

### [45. 跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/)

**🎯 考察频率：中等 | 难度：中等 | 重要性：贪心优化**

> 给定一个长度为 n 的 0 索引整数数组 nums。初始位置为 nums[0]。每个元素 nums[i] 表示从索引 i 向前跳转的最大长度。

**💡 核心思路**：贪心算法，在能跳到的范围内选择能跳得最远的

```java
public int jump(int[] nums) {
    int jumps = 0;
    int currentEnd = 0;
    int farthest = 0;
    
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
        }
    }
    
    return jumps;
}
```


### [14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/)

**🎯 考察频率：中等 | 难度：简单 | 重要性：字符串处理**

> 编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 `""`。

**💡 核心思路**：逐个字符比较

```java
public String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) {
        return "";
    }

    String prefix = strs[0];
    for (int i = 1; i < strs.length; i++) {
        int j = 0;
        while (j < prefix.length() && j < strs[i].length() && prefix.charAt(j) == strs[i].charAt(j)) {
            j++;
        }
        prefix = prefix.substring(0, j);
        if (prefix.isEmpty()) {
            return "";
        }
    }
    return prefix;
}
```

### [54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)

**🎯 考察频率：高 | 难度：中等 | 重要性：矩阵遍历**

> 给你一个 m 行 n 列的矩阵 matrix ，请按照顺时针螺旋顺序，返回矩阵中的所有元素。

**💡 核心思路**：模拟螺旋过程，维护边界

```java
public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> result = new ArrayList<>();
    if (matrix.length == 0) return result;
    
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // 从左到右
        for (int j = left; j <= right; j++) {
            result.add(matrix[top][j]);
        }
        top++;
        
        // 从上到下
        for (int i = top; i <= bottom; i++) {
            result.add(matrix[i][right]);
        }
        right--;
        
        if (top <= bottom) {
            // 从右到左
            for (int j = right; j >= left; j--) {
                result.add(matrix[bottom][j]);
            }
            bottom--;
        }
        
        if (left <= right) {
            // 从下到上
            for (int i = bottom; i >= top; i--) {
                result.add(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
}
```

---

## 🚀 面试前15分钟速记表

### 核心模板（必背）

```java
// 1. 双指针模板
int left = 0, right = nums.length - 1;
while (left < right) {
    // 处理逻辑
}

// 2. 滑动窗口模板
int left = 0;
for (int right = 0; right < nums.length; right++) {
    // 扩展窗口
    while (窗口需要收缩) {
        // 收缩窗口
        left++;
    }
}

// 3. 前缀和模板
int[] prefixSum = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefixSum[i + 1] = prefixSum[i] + nums[i];
}
```

### 题型速查表

| 题型分类 | 核心技巧 | 高频题目 | 记忆口诀 | 难度 |
|----------|----------|----------|----------|------|
| **双指针类** | 左右指针/快慢指针 | 两数之和、三数之和、盛水容器、移动零、颜色分类 | 左右夹逼找目标，快慢追踪解环题 | ⭐⭐⭐ |
| **哈希表类** | 空间换时间 | 字母异位词分组、最长连续序列、存在重复元素 | 空间换时间来优化，常数查找是关键 | ⭐⭐⭐ |
| **前缀和类** | 累积求和 | 和为K的子数组、最大子数组和、除自身以外数组的乘积 | 累积求和建数组，区间相减得答案 | ⭐⭐⭐⭐ |
| **排序搜索** | 预排序/二分 | 合并区间、第K大元素、寻找重复数、搜索旋转数组 | 有序数组用二分，对数时间最高效 | ⭐⭐⭐⭐ |
| **原地算法** | 双指针交换 | 移动零、颜色分类、合并有序数组、旋转数组 | 双指针巧妙来交换，空间复杂度为一 | ⭐⭐⭐⭐ |
| **数学技巧** | 位运算/性质 | 只出现一次的数字、多数元素、消失的数字 | 数学性质巧运用，位运算显神通 | ⭐⭐⭐ |
| **综合应用** | 多技巧结合 | 买卖股票、跳跃游戏、子集、乘积最大子数组 | 多技巧组合显神通，复杂问题巧拆解 | ⭐⭐⭐⭐⭐ |

### 核心题目优先级（面试前重点复习）

1. **两数之和** - 哈希表基础，必须熟练掌握
2. **三数之和** - 双指针经典，排序+双指针
3. **最大子数组和** - 动态规划入门，Kadane算法
4. **合并区间** - 排序应用，区间处理
5. **盛最多水的容器** - 双指针对撞，贪心思想
6. **颜色分类** - 三指针技巧，荷兰国旗问题
7. **搜索旋转排序数组** - 二分查找变体
8. **除自身以外数组的乘积** - 前缀乘积，空间优化

### 常见陷阱提醒

- ⚠️ **数组越界**：`i < nums.length`，确保索引在有效范围内
- ⚠️ **整数溢出**：使用long或检查边界，特别是乘积运算
- ⚠️ **空数组处理**：`if (nums == null || nums.length == 0)`
- ⚠️ **双指针边界**：确保`left < right`，避免死循环
- ⚠️ **滑动窗口**：正确维护窗口边界，注意收缩条件
- ⚠️ **前缀和**：注意数组长度为n+1，处理边界情况

### 时间复杂度总结

- **遍历类**：O(n) - 一次遍历
- **双指针**：O(n) - 同时移动或对撞指针  
- **排序类**：O(n log n) - 基于比较的排序
- **哈希表**：O(n) - 平均情况下常数时间查找
- **二分查找**：O(log n) - 每次缩小一半搜索空间

### 面试答题套路

1. **理解题意**：确认输入输出，边界情况，时间空间复杂度要求
2. **选择方法**：根据题型选择对应技巧（双指针、哈希表、前缀和等）
3. **画图分析**：手动模拟小规模测试用例，验证思路
4. **编码实现**：套用对应模板，注意边界条件处理
5. **优化分析**：考虑时间空间复杂度优化可能性
6. **测试验证**：空数组、单元素、正常情况、边界情况

**最重要的一个技巧就是，你得行动，写起来**
