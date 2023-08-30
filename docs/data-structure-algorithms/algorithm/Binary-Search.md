---
title: 二分查找
date: 2023-02-09
tags: 
 - binary-search
categories: algorithms
---

![](https://img.starfish.ink/algorithm/binary-search-banner.png)

> 二分查找并不简单，Knuth 大佬（发明 KMP 算法的那位）都说二分查找：**思路很简单，细节是魔鬼**。很多人喜欢拿整型溢出的 bug 说事儿，但是二分查找真正的坑根本就不是那个细节问题，而是在于到底要给 `mid` 加一还是减一，while 里到底用 `<=` 还是 `<`。

### 二分查找基础框架

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

### [704. 二分查找](https://leetcode.cn/problems/binary-search/)（基本的二分搜索）

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

**2、为什么 `left = mid + 1`，`right = mid - 1`？我看有的代码是 `right = mid` 或者 `left = mid`，没有这些加加减减，到底怎么回事，怎么判断**？

答：这也是二分查找的一个难点，不过只要你能理解前面的内容，就能够很容易判断。

刚才明确了「搜索区间」这个概念，而且本算法的搜索区间是两端都闭的，即 `[left, right]`。那么当我们发现索引 `mid` 不是要找的 `target` 时，下一步应该去搜索哪里呢？

当然是去搜索区间 `[left, mid-1]` 或者区间 `[mid+1, right]` 对不对？**因为 `mid` 已经搜索过，应该从搜索区间中去除**。



> 比如说给你有序数组 `nums = [1,2,2,2,3]`，`target` 为 2，此算法返回的索引是 2，没错。但是如果我想得到 `target` 的左侧边界，即索引 1，或者我想得到 `target` 的右侧边界，即索引 3，这样的话此算法是无法处理的。
>
> 所以又有了下边两种左右边界的二分。

### 寻找左侧边界的二分搜索

```java
public int getLeftNums(int[] nums,int target) {
    int left = 0, right = nums.length - 1;
    // 搜索区间为 [left, right]
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
             // 收缩右侧边界
             right = mid - 1;
        } else if (nums[mid] > target) {
            // 搜索区间变为 [left, mid-1]
            right = mid - 1;
        } else if (nums[mid] < target) {
            // 搜索区间变为 [mid+1, right]
            left = mid + 1;
        }
    }
    // 判断 target 是否存在于 nums 中，防止数组越界
    // 此时 target 比所有数都大，返回 -1
    if (left == nums.length) return -1;
    // 判断一下 nums[left] 是不是 target
    return nums[left] == target ? left : -1;
}
```

> while 终止的条件是 `left == right`，所以返回 left 和 right 是一样的

### 寻找右侧边界的二分查找

```java
public int getRightNums(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            // 别返回，增大「搜索区间」的左边界，收缩左侧边界，
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        } else if (nums[mid] < target) {
					  left = mid + 1;
        }
    }
    if (right < 0) return -1;
    return nums[right] == target ? right : -1;
}
```



### [153. 寻找旋转排序数组中的最小值](https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/)

> 已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次 旋转 后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：
> 若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]
> 若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]
> 注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次 的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]] 。
>
> 给你一个元素值 互不相同 的数组 nums ，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的 最小元素 。
>
> 你必须设计一个时间复杂度为 $O(log n)$ 的算法解决此问题。
>
> ```
> 输入：nums = [3,4,5,1,2]
> 输出：1
> 解释：原数组为 [1,2,3,4,5] ，旋转 3 次得到输入数组。
> ```
>
> ```
> 输入：nums = [11,13,15,17]
> 输出：11
> 解释：原数组为 [11,13,15,17] ，旋转 4 次得到输入数组。
> ```

**思路**：

升序数组+旋转，仍然是部分有序，考虑用二分查找。

> 我们先搞清楚题目中的数组是通过怎样的变化得来的，基本上就是等于将整个数组向右平移

> 这种二分查找难就难在，arr[mid] 跟谁比。
>
> 我们的目的是：当进行一次比较时，一定能够确定答案在 mid 的某一侧。一次比较为 arr[mid] 跟谁比的问题。
> 一般的比较原则有：
>
> - 如果有目标值 target，那么直接让 arr[mid] 和 target 比较即可。
> - 如果没有目标值，一般可以考虑 **端点**

![fig1](https://assets.leetcode-cn.com/solution-static/153/1.png)

旋转数组，最小值右侧的元素肯定都小于数组中的最后一个元素 `nums[n-1]`，左侧元素都大于 `num[n-1]`

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



### [33. 搜索旋转排序数组](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/)

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
  int n = nums.length;
  //特例
  if (n == 0) {
    return -1;
  }
  if (n == 1) {
    return nums[0] == target ? 0 : -1;
  }

  int left = 0;
  int right = nums.length - 1;

  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (target == nums[mid]) {
      return mid;
    }
    //左侧有序的话
    if (nums[0] <= nums[mid]) {
      if (nums[0] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {  //右侧有序
      //注意这里是 n ,不是 right
      if (nums[mid] < target && target <= nums[n - 1]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}
```



### [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

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

两端探索方式（无法保证二分查找对数级的复杂度）

```java
public int[] query(int[] nums, int target) {
    // 暴力二分，找到后向找到的结果的两端探索
    // 确定左区间 [left,mid) 右区间 [mid, right)
    int length = nums.length;
    int left = 0;
    int right = length - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (target == nums[mid]) {
            // 向两边探索
            int l = mid;
            int r = mid;
            while (l > 0 && nums[l - 1] == target) {
                l--;
            }
            while (r < length - 1 && nums[r + 1] == target) {
                r++;
            }
            return new int[]{l, r};
        }
        if (target < nums[mid]) {
            // 区间左移
            right = mid - 1;
        } else {
            // 区间右移
            left = mid + 1;
        }
    }
    return new int[]{-1, -1};
}
```



### [287. 寻找重复数](https://leetcode-cn.com/problems/find-the-duplicate-number/)

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

二分查找的思路是先猜一个数（有效范围 [left..right] 里位于中间的数 mid），然后统计原始数组中 小于等于 mid 的元素的个数 cnt：

如果 cnt 严格大于 mid。根据抽屉原理，重复元素就在区间 [left..mid] 里；否则，重复元素就在区间 [mid + 1..right] 里。
与绝大多数使用二分查找问题不同的是，这道题正着思考是容易的，即：思考哪边区间存在重复数是容易的，因为有抽屉原理做保证。

> 抽屉原理：把 `10` 个苹果放进 `9` 个抽屉，至少有一个抽屉里至少放 `2` 个苹果。

```java
public int findDuplicate(int[] nums) {
  int len = nums.length;
  int left = 1;
  int right = len - 1;
  while (left < right) {
    int mid = left + (right - left) / 2;

    // nums 中小于等于 mid 的元素的个数
    int cnt = 0;
    for (int num : nums) {
      if (num <= mid) {
        cnt += 1;
      }
    }

    // 根据抽屉原理，小于等于 4 的个数如果严格大于 4 个，此时重复元素一定出现在 [1..4] 区间里
    if (cnt > mid) {
      // 重复元素位于区间 [left..mid]
      right = mid;
    } else {
      // if 分析正确了以后，else 搜索的区间就是 if 的反面区间 [mid + 1..right]
      left = mid + 1;
    }
  }
  return left;
}
```



### [162. 寻找峰值](https://leetcode-cn.com/problems/find-peak-element/)

> 峰值元素是指其值严格大于左右相邻值的元素。
>
> 给你一个整数数组 nums，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回 任何一个峰值 所在位置即可。
>
> 你可以假设 nums[-1] = nums[n] = -∞ 。
>
> 你必须实现时间复杂度为 O(log n) 的算法来解决此问题。
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

在二分查找中，每次会找到一个位置 midmid。我们发现，midmid 只有如下三种情况：

- midmid 为一个峰值，此时我们通过比较 midmid 位置元素与两边元素大小即可。
- midmid 在一个峰值右侧，此时有 nums[mid] < nums[mid + 1]nums[mid]<nums[mid+1]，此时我们向右调整搜索范围，在 [mid + 1, r][mid+1,r] 范围内继续查找。
- midmid 在一个峰值左侧，此时有 nums[mid] < nums[mid - 1]nums[mid]<nums[mid−1]，此时我们向左调整搜索范围，在 [l + 1, mid][l+1,mid] 范围内继续查找。

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



### [240. 搜索二维矩阵 II](https://leetcode-cn.com/problems/search-a-2d-matrix-ii/)

> [剑指 Offer 04. 二维数组中的查找](https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/) 一样的题目
>
> 在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
>
> 现有矩阵 matrix 如下：
>
> ```
> [
>   [1,   4,  7, 11, 15],
>   [2,   5,  8, 12, 19],
>   [3,   6,  9, 16, 22],
>   [10, 13, 14, 17, 24],
>   [18, 21, 23, 26, 30]
> ]
> ```
>
> 给定 target = 5，返回 true。
>
> 给定 target = 20，返回 false。
>

**思路**：

站在右上角看。这个矩阵其实就像是一个Binary Search Tree。然后，聪明的大家应该知道怎么做了。

```java
public static boolean findNumberIn2DArray(int[][] matrix, int target) {

  if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
    return false;
  }

  int rows = matrix.length;
  int columns = matrix[0].length;
  for (int i = 0; i < rows; i++) {
    for (int j = 0; j < columns; j++) {
      if (matrix[i][j] == target) {
        return true;
      }
    }
  }
  return false;
}
```

如果你写出这样的暴力解法，面试官可能就会反问你了：你还有什么想问的吗？

言归正传，有序的数组，我们首先应该想到二分

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        for (int[] row : matrix) {
            int index = search(row, target);
            if (index >= 0) {
                return true;
            }
        }
        return false;
    }

    public int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = (high - low) / 2 + low;
            int num = nums[mid];
            if (num == target) {
                return mid;
            } else if (num > target) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return -1;
    }
}
```

**Z 字形查找**

> 假设arr数组，val，tar如下图所示：
> 如果我们把二分值定在右上角或者左下角，就可以进行二分。这里以右上角为例，左下角可自行分析：
> ![图片说明](https://uploadfiles.nowcoder.com/images/20200324/2071677_1585021381982_89033DB5EFA905C7F9FCCA6E59C9BB2C)
> 1）我么设初始值为右上角元素，arr[0][5] = val，目标tar = arr[3][1]
> 2）接下来进行二分操作：
> 3）如果val == target,直接返回
> 4）如果 tar > val, 说明target在更大的位置，val左边的元素显然都是 < val，间接 < tar，说明第 0 行都是无效的，所以val下移到arr[1][5]
> 5）如果 tar < val, 说明target在更小的位置，val下边的元素显然都是 > val，间接 > tar，说明第 5 列都是无效的，所以val左移到arr[0][4]
> 6）继续步骤2）

```java
public static boolean findNumberIn2DArray(int[][] matrix, int target) {

  if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
    return false;
  }

  int rows = matrix.length;
  int columns = matrix[0].length;
  //右上角坐标
  int row = 0;
  int col = columns - 1;
  while (row < rows && col >= 0) {
    int num = matrix[row][col];
    if (num == target) {
      return true;
    } else if (target > num) {
      row++;
    } else {
      col--;
    }
  }
  return false;
}
```



### [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)



- https://labuladong.gitee.io/algo/2/22/61/
