---
title: 二分查找
date: 2023-02-09
tags: 
 - binary-search
 - algorithms
categories: algorithms
---

![](https://img.starfish.ink/algorithm/binary-search-banner.png)

> 二分查找【折半查找】，一种简单高效的搜索算法，一般是利用有序数组的特性，通过逐步比较中间元素来快速定位目标值。
>
> 二分查找并不简单，Knuth 大佬（发明 KMP 算法的那位）都说二分查找：**思路很简单，细节是魔鬼**。比如二分查找让人头疼的细节问题，到底要给 `mid` 加一还是减一，while 里到底用 `<=` 还是 `<`。

## 一、二分查找基础框架

```java
int binarySearch(int[] nums, int target) {
    int left = 0, right = ...;

    while(...) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ...
        } else if (nums[mid] < target) {
            left = ...
        } else if (nums[mid] > target) {
            right = ...
        }
    }
    return ...;
}
```

**分析二分查找的一个技巧是：不要出现 else，而是把所有情况用 else if 写清楚，这样可以清楚地展现所有细节**。本文都会使用 else if，旨在讲清楚，读者理解后可自行简化。

其中 `...` 标记的部分，就是可能出现细节问题的地方，当你见到一个二分查找的代码时，首先注意这几个地方。

**另外提前说明一下，计算 `mid` 时需要防止溢出**，代码中 `left + (right - left) / 2` 就和 `(left + right) / 2` 的结果相同，但是有效防止了 `left` 和 `right` 太大，直接相加导致溢出的情况。



## 二、二分查找性能分析

**时间复杂度**：二分查找的时间复杂度为 $O(log n)$​，其中 n 是数组的长度。这是因为每次比较后，搜索范围都会减半，非常高效。

> logn 是一个非常“恐怖”的数量级，即便 n 非常非常大，对应的 logn 也很小。比如 n 等于 2 的 32 次方，这个数很大了吧？大约是 42 亿。也就是说，如果我们在 42 亿个数据中用二分查找一个数据，最多需要比较 32 次。

**空间复杂度**：

- 迭代法：$O(1)$，因为只需要常数级别的额外空间。
- 递归法：$O(log n)$，因为递归调用会占用栈空间。

**最坏情况**：最坏情况下，目标值位于数组两端或不存在，需要$log n$次比较才能确定。

**二分查找与其他搜索算法的比较**：

- 线性搜索：线性搜索简单，时间复杂度为$O(n)$，但在大规模数据集上效率较低。

- 哈希：哈希在查找上能提供平均$O(1)$的时间复杂度，但需要额外空间存储哈希表，且对数据有序性无要求。



## 三、刷刷热题

- 二分查找，可以用循环（迭代）实现，也可以用递归实现
- 二分查找依赖的事顺序表结构（也就是数组）
- 二分查找针对的是有序数组
- 数据量太小太大都不是很适用二分（太小直接顺序遍历就够了，太大的话对连续内存空间要求更高）

### [二分查找『704』](https://leetcode.cn/problems/binary-search/)（基本的二分搜索）

> 给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。
>

```java
int binarySearch(int[] nums, int target) {
    int left = 0; 
    int right = nums.length - 1; // 注意

    while(left <= right) {
        int mid = left + (right - left) / 2;
        if(nums[mid] == target)
            return mid; 
        else if (nums[mid] < target)
            left = mid + 1; // 注意
        else if (nums[mid] > target)
            right = mid - 1; // 注意
    }
    return -1;
}
```

**1、为什么 while 循环的条件中是 <=，而不是 <**？

答：因为初始化 `right` 的赋值是 `nums.length - 1`，即最后一个元素的索引，而不是 `nums.length`。

这二者可能出现在不同功能的二分查找中，区别是：前者相当于两端都闭区间 `[left, right]`，后者相当于左闭右开区间 `[left, right)`。因为索引大小为 `nums.length` 是越界的，所以我们把 `right` 这一边视为开区间。

我们这个算法中使用的是前者 `[left, right]` 两端都闭的区间。**这个区间其实就是每次进行搜索的区间**。

**2、为什么 `left = mid + 1`，`right = mid - 1`？我看有的代码是 `right = mid` 或者 `left = mid`，没有这些加加减减，到底怎么回事，怎么判断**？

答：这也是二分查找的一个难点，不过只要你能理解前面的内容，就能够很容易判断。

刚才明确了「搜索区间」这个概念，而且本算法的搜索区间是两端都闭的，即 `[left, right]`。那么当我们发现索引 `mid` 不是要找的 `target` 时，下一步应该去搜索哪里呢？

当然是去搜索区间 `[left, mid-1]` 或者区间 `[mid+1, right]` 对不对？**因为 `mid` 已经搜索过，应该从搜索区间中去除**。

> ##### 1. **左闭右闭区间 `[left, right]`**
>
> - **循环条件**：`while (left <= right)`，因为 `left == right` 时区间仍有意义。
> - 边界调整：
>   - `nums[mid] < target` → `left = mid + 1`（排除 `mid` 左侧）
>   - `nums[mid] > target` → `right = mid - 1`（排除 `mid` 右侧）
> - 适用场景：明确目标值存在于数组时，直接返回下标。
>
> ##### 2. **左闭右开区间 `[left, right)`**
>
> - **初始化**：`right = nums.length`。
> - **循环条件**：`while (left < right)`，因为 `left == right` 时区间为空。
> - 边界调整：
>   - `nums[mid] < target` → `left = mid + 1`
>   - `nums[mid] > target` → `right = mid`（右开，不包含 `mid`）
> - **适用场景**：需要处理目标值可能不在数组中的情况，例如插入位置问题

> 比如说给你有序数组 `nums = [1,2,2,2,3]`，`target` 为 2，此算法返回的索引是 2，没错。但是如果我想得到 `target` 的左侧边界，即索引 1，或者我想得到 `target` 的右侧边界，即索引 3，这样的话此算法是无法处理的。
>
> 所以又有了一些含有重复元素，带有边界问题的二分。

### 寻找左侧边界的二分搜索

```java
public int leftBound(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left <= right) {
        int mid = (right - left) / 2 + left;
        if (nums[mid] > target) {
            right = mid - 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            //mid 是第一个元素，或者前一个元素不等于查找值，锁定，且返回的是mid
            if (mid == 0 || nums[mid - 1] != target) return mid;
            else right = mid - 1;
        }
    }
    return -1;
}
```

### 寻找右侧边界的二分查找

```java
public int rightBound(int[] nums, int target){
    int left = 0;
    int right = nums.length - 1;
    while(left <= right){
        int mid = left + (right - left)/2;
        if(nums[mid] > target){
            right = mid - 1;
        }else if(nums[mid] < target){
            left = mid +1;
        }else{
            if(mid == nums.length - 1 || nums[mid +1] != target) return mid;
            else left = mid + 1;
        }
    }
    return -1;
}
```

### 查找第一个大于等于给定值的元素

```JAVA
//查找第一个大于等于给定值的元素  1,3,5,7,9 找出第一个大于等于5的元素
public int firstNum(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            if (mid == 0 || nums[mid - 1] < target) return mid;
            else right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return -1;
}
```



### [搜索旋转排序数组『33』](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/)

> 整数数组 nums 按升序排列，数组中的值 互不相同 。
>
> 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。
>
> 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
>
> ```
> 输入：nums = [4,5,6,7,0,1,2], target = 0
> 输出：4
> ```
>
> ```
> 输入：nums = [4,5,6,7,0,1,2], target = 3
> 输出：-1
> ```

**思路**：

对于有序数组（部分有序也可以），可以使用二分查找的方法查找元素。

旋转数组后，依然是局部有序，从数组中间分成左右两部分后，一定有一部分是有序的

- 如果 [L, mid - 1] 是有序数组，且 target 的大小满足 [nums[L],nums[mid]，则我们应该将搜索范围缩小至 [L, mid - 1]，否则在 [mid + 1, R] 中寻找。
- 如果 [mid, R] 是有序数组，且 target 的大小满足 ({nums}[mid+1],{nums}[R]]，则我们应该将搜索范围缩小至 [mid + 1, R]，否则在 [l, mid - 1] 中寻找。

```java
public static int search(int[] nums,int target) {
      if(nums.length == 0) return -1;
      if(nums.length == 1) return target == nums[0] ? 0 : -1;
      int left = 0, right = nums.length - 1;
      while(left <= right){
          int mid = left + (right - left)/2;
          if(target == nums[mid]) return mid;
        
          //左侧有序，注意是小于等于，处理最后只剩两个数的时候
          if(nums[left] <= nums[mid]){  // 左半部分 [left..mid] 有序
              if(nums[left] <= target && target < nums[mid]){ // target 在左半部分
                  right = mid - 1;
              }else{
                  left = mid + 1;
              }
          }else{
              if(nums[mid] < target && target <= nums[right]){
                  left = mid +1;
              }else{
                  right = mid - 1;
              }
          }
      }
      return -1;
  }
```



### [在排序数组中查找元素的第一个和最后一个位置『34』](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

> 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。
>
> 如果数组中不存在目标值 target，返回 [-1, -1]。
>
> 你可以设计并实现时间复杂度为 $O(log n)$ 的算法解决此问题吗？
>
> ```
> 输入：nums = [5,7,7,8,8,10], target = 8
> 输出：[3,4]
> ```
>
> ```
> 输入：nums = [5,7,7,8,8,10], target = 6
> 输出：[-1,-1]
> ```

**思路**：二分法寻找左右边界值

```java
public int[] searchRange(int[] nums, int target) {
  int first = binarySearch(nums, target, true);
  int last = binarySearch(nums, target, false);
  return new int[]{first, last};
}

public int binarySearch(int[] nums, int target, boolean findLast) {
  int length = nums.length;
  int left = 0, right = length - 1;
  //结果，因为可能有多个值，所以需要先保存起来
  int index = -1;
  while (left <= right) {
    //取中间值
    int middle = left + (right - left) / 2;

    //找到相同的值（只有这个地方和普通二分查找有不同）
    if (nums[middle] == target) {
      //先赋值一下，肯定是找到了，只是不知道这个值是不是在区域的边界内
      index = middle;
      //如果是查找最后的
      if (findLast) {
        //那我们将浮标移动到下一个值试探一下后面的值还是否有target
        left = middle + 1;
      } else {
        //否则，就是查找第一个值，也是同理，移动指针到上一个值去试探一下上一个值是不是等于target
        right = middle - 1;
      }

      //下面2个就是普通的二分查找流程，大于小于都移动指针
    } else if (nums[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }

  }
  return index;
}
```



### [寻找旋转排序数组中的最小值『153』](https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/)

> 已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
> 若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]        若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]
> 注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。
> 
>给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。
> 
>你必须设计一个时间复杂度为 $O(log n)$ 的算法解决此问题。
> 
>```
> 输入：nums = [3,4,5,1,2]
> 输出：1
> 解释：原数组为 [1,2,3,4,5] ，旋转 3 次得到输入数组。
> ```
> 
>```
> 输入：nums = [11,13,15,17]
> 输出：11
> 解释：原数组为 [11,13,15,17] ，旋转 4 次得到输入数组。
> ```

**思路**：

升序数组+旋转，仍然是部分有序，考虑用二分查找。

![](https://assets.leetcode-cn.com/solution-static/153/1.png)

> 我们先搞清楚题目中的数组是通过怎样的变化得来的，基本上就是等于将整个数组向右平移

> 这种二分查找难就难在，arr[mid] 跟谁比。
>
> 我们的目的是：当进行一次比较时，一定能够确定答案在 mid 的某一侧。一次比较为 arr[mid] 跟谁比的问题。
> 一般的比较原则有：
>
> - 如果有目标值 target，那么直接让 arr[mid] 和 target 比较即可。
> - 如果没有目标值，一般可以考虑 **端点**
>
> 如果中值 < 右值，则最小值在左半边，可以收缩右边界。
> 如果中值 > 右值，则最小值在右半边，可以收缩左边界。

旋转数组，最小值右侧的元素肯定都小于或等于数组中的最后一个元素 `nums[n-1]`，左侧元素都大于 `num[n-1]`

```java
public static int findMin(int[] nums) {
  int left = 0;
  int right = nums.length - 1;
  //左闭右开
  while (left < right) {
    int mid = left + (right - left) / 2;
    //疑问：为什么right = mid;而不是 right = mid-1;
    //解答：{4,5,1,2,3}，如果right = mid-1，则丢失了最小值1
    if (nums[mid] < nums[right]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  //循环结束条件，left = right，最小值输出nums[left]或nums[right]均可 
  return nums[left];
}
```

**如果是求旋转数组中的最大值呢**

```java
public static int findMax(int[] nums) {
  int left = 0;
  int right = nums.length - 1;

  while (left < right) {
    int mid = left + (right - left) >> 1;

    //因为向下取整，left可能会等于mid，所以要考虑
    if (nums[left] < nums[right]) {
      return nums[right];
    }

    //[left,mid] 是递增的，最大值只会在[mid,right]中
    if (nums[left] < nums[mid]) {
      left = mid;
    } else {
      //[mid,right]递增，最大值只会在[left, mid-1]中
      right = mid - 1;
    }
  }
  return nums[left];
}
```

### [寻找重复数『287』](https://leetcode-cn.com/problems/find-the-duplicate-number/)

> 给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。
>
> 假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。
>
> 你设计的解决方案必须 不修改 数组 nums 且只用常量级 $O(1)$ 的额外空间。
>
> ```
> 输入：nums = [1,3,4,2,2]
> 输出：2
> ```
>
> ```
> 输入：nums = [3,1,3,4,2]
> 输出：3
> ```

**思路**：

这里二分的不是数组中的数，而是[1,n]中用来度量的数

二分查找的思路是先猜一个数（有效范围 [left..right] 里位于中间的数 mid），然后统计原始数组中 小于等于 mid 的元素的个数 cnt：

如果 cnt 严格大于 mid。根据抽屉原理，重复元素就在区间 [left..mid] 里；否则，重复元素就在区间 [mid + 1..right] 里。

> 抽屉原理：把 `10` 个苹果放进 `9` 个抽屉，至少有一个抽屉里至少放 `2` 个苹果。

```java
public int findDuplicate(int[] nums) {
  int left = 0;
  int right = nums.length - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;

    // nums 中小于等于 mid 的元素的个数
    int count = 0;
    for (int num : nums) {
      //看这里，是 <= mid，而不是 nums[mid]
      if (num <= mid) {
         count += 1;
      }
    }

    // 根据抽屉原理，小于等于 4 的个数如果严格大于 4 个，此时重复元素一定出现在 [1..4] 区间里
    if (count > mid) {
      // 重复元素位于区间 [left..mid]
      right = mid - 1;
    } else {
      // if 分析正确了以后，else 搜索的区间就是 if 的反面区间 [mid + 1..right]
      left = mid + 1;
    }
  }
  return left;
}
```



### [寻找峰值『162』](https://leetcode-cn.com/problems/find-peak-element/)

> 峰值元素是指其值严格大于左右相邻值的元素。
>
> 给你一个整数数组 nums，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回 任何一个峰值 所在位置即可。
>
> 你可以假设 nums[-1] = nums[n] = -∞ 。
>
> 你必须实现时间复杂度为 $O(log n) $的算法来解决此问题。
>
> ```
> 输入：nums = [1,2,3,1]
> 输出：2
> 解释：3 是峰值元素，你的函数应该返回其索引 2。
> ```
>
> ```
> 输入：nums = [1,2,1,3,5,6,4]
> 输出：1 或 5 
> 解释：你的函数可以返回索引 1，其峰值元素为 2；
>      或者返回索引 5， 其峰值元素为 6。
> ```

**思路**：

这题，最简单的思路就是直接找最大值，但这样复杂度是 $O(n)$

在二分查找中，每次会找到一个位置 mid。我们发现，mid 只有如下三种情况：

- mid 为一个峰值，此时我们通过比较 mid 位置元素与两边元素大小即可。
- mid 在一个峰值右侧，此时有 nums[mid] < nums[mid + 1]，此时我们向右调整搜索范围，在 [mid + 1, r] 范围内继续查找。
- mid 在一个峰值左侧，此时有 nums[mid] < nums[mid - 1]，此时我们向左调整搜索范围，在 [l + 1, mid] 范围内继续查找。

```java
public int findPeakElement(int[] nums) {
  int n = nums.length;
  if (n == 1) {
    return 0;
  }

  // 先特判两边情况
  if (nums[0] > nums[1]) return 0;
  if (nums[n - 1] > nums[n - 2]) return n - 1;

  int l = 0, r = n - 1;
  while (l <= r) {
    int mid = (l + r) / 2;

    // 当前为峰值
    if (mid >= 1 && mid < n - 1 && nums[mid] > nums[mid - 1] && nums[mid] > nums[mid + 1]) {
      return mid;
    } else if (mid >= 1 && nums[mid] < nums[mid - 1]) {
      // 峰值在 mid 左侧
      r = mid - 1;
    } else if (mid < n - 1 && nums[mid] < nums[mid + 1]) {
      // 峰值在 mid 右侧
      l = mid + 1;
    }
  }
  return -1;
}
```



### [搜索二维矩阵 II『240』](https://leetcode-cn.com/problems/search-a-2d-matrix-ii/)

> [剑指 Offer 04. 二维数组中的查找](https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/) 一样的题目
>
> 在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
>
> 现有矩阵 matrix 如下：
>
> ![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/11/25/searchgrid2.jpg)
> 
>   ```
>   输入：matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5
>   输出：true
>   ```

**思路**：

站在左下角或者右上角看。这个矩阵其实就像是一个Binary Search Tree。然后，聪明的大家应该知道怎么做了。

![](https://img.starfish.ink/data-structure/searchgrid2-solution.jpg)

有序的数组，我们首先应该想到二分

```java
  public boolean searchMatrix(int[][] matrix, int target) {
      if (matrix == null || matrix.length < 1 || matrix[0].length < 1) {
          return false;
      }
      //行，列
      int col = matrix[0].length;
      int row = matrix.length;
      //从左下角开始，根据大小选择走的方向
      int x = row - 1, y = 0;
      while (x >= 0 && y < row) {
          if (target == matrix[x][y]) return true;
          else if (target > matrix[x][y]) y++;
          else x--;
      }
      return false;
  }
```



### [搜索插入位置『35』](https://leetcode.cn/problems/search-insert-position/)

> 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。请必须使用时间复杂度为 `O(log n)` 的算法。
>
> ```
> 输入: nums = [1,3,5,6], target = 2
> 输出: 1
> ```

```java
public int searchInsert(int[] nums, int target) {
      int left = 0;
      int right = nums.length - 1;
  		//注意：特例处理
      if (nums[left] > target) return 0;
      if (nums[right] < target) return right + 1;
      while (left <= right) {
          int mid = left + (right - left) / 2;
          if (nums[mid] > target) {
              right = mid - 1;
          } else if (nums[mid] < target) {
              left = mid + 1;
          } else {
              return mid;
          }
      }
  		//注意：这里如果没有查到，返回left,也就是需要插入的位置
      return left;
  }
```



### [最长递增子序列『300』](https://leetcode.cn/problems/longest-increasing-subsequence/)

> 给你一个整数数组 `nums` ，找到其中最长严格递增子序列的长度。
>
> **子序列** 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，`[3,6,2,7]`是数组 `[0,3,1,6,2,2,7]` 的子序列。
>
> ```
> 输入：nums = [10,9,2,5,3,7,101,18]
> 输出：4
> 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4。
> ```

**思路**：

- 优先使用动态规划



### [寻找两个正序数组的中位数『4』](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

> 给定两个大小分别为 `m` 和 `n` 的正序（从小到大）数组 `nums1` 和 `nums2`。请你找出并返回这两个正序数组的 **中位数** 。
>
> 算法的时间复杂度应该为 `O(log (m+n))` 。
>
> ```
> 输入：nums1 = [1,3], nums2 = [2]
> 输出：2.00000
> 解释：合并数组 = [1,2,3] ，中位数 2
> ```

**思路**：

中位数是指将一组数据从小到大排序后，位于中间位置的数值。如果数据集中的元素数量是奇数，中位数就是中间的那个元素；如果是偶数，则中位数是中间两个元素的平均值。

