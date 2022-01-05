![](/Users/apple/Desktop/screenshot/截屏2022-01-04 下午4.19.16.png)

归纳下双指针算法，其实总共就三类

- 左右指针，数组和字符串问题
- 快慢指针，主要是成环问题
- 滑动窗口，针对子串问题



#### [42. 接雨水](https://leetcode-cn.com/problems/trapping-rain-water/)





## 一、左右指针

左右指针在数组中其实就是两个索引值，

TODO: 一般都是有序数组？或者先排序后？

Javaer 一般这么表示：

```java
int left = i + 1;
int right = nums.length - 1;
while(left < right)
  ***
```

这两个指针 **相向交替移动**

![](https://storage.googleapis.com/algodailyrandomassets/curriculum/arrays/two-pointer-2.svg)



> [11. 盛最多水的容器](https://leetcode-cn.com/problems/container-with-most-water/)
>
> [15. 三数之和](https://leetcode-cn.com/problems/3sum/)
>
> [167. 两数之和 II - 输入有序数组](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/)
>
> [125. 验证回文串](https://leetcode-cn.com/problems/valid-palindrome/)
>
> [344. 反转字符串](https://leetcode-cn.com/problems/reverse-string/)
>
> [283. 移动零](https://leetcode-cn.com/problems/move-zeroes/)
>
> [704. 二分查找](https://leetcode-cn.com/problems/binary-search/)
>
> [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

TODO: 画图对比各个算法

### 两数之和 II - 输入有序数组

> 给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** *`target`* 的那 **两个** 整数，并返回它们的数组下标。
>
> 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
>
> 你可以按任意顺序返回答案。
>
> ```
> 输入：nums = [2,7,11,15], target = 9
> 输出：[0,1]
> 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
> ```

直接用左右指针套就可以

```java
public static int[] towSum(int[] nums, int target) {
    int left = 0;
    int rigth = nums.length - 1;
    while(left < rigth){
        int tmp = nums[left] + nums[rigth];
        if (target == tmp) {
            return new int[]{left, rigth};
        } else if (tmp > target) {
            rigth--; //右移
        } else {
            left++;  //左移
        }
    }
    return new int[]{-1, -1};
}
```



### 三数之和

**排序、双指针、去重**

第一个想法是，这三个数，两个指针？

- 对数组排序，固定一个数 $nums[i]$ ，然后遍历数组，并移动左右指针求和，判断是否有等于 0 的情况
- 特例：
  - 排序后第一个数就大于 0，不干了
  - 有三个需要去重的地方
    - nums[i] == nums[i - 1]  直接跳过本次遍历
    - nums[left] == nums[left + 1]  移动指针，即去重
    - nums[right] == nums[right - 1]  移动指针





![img](https://pic.leetcode-cn.com/00a09d9a4652c19ca3d1022b99a2395ae2f874bc4e41d19a4c61434566b156ec-2.png)

```java
public static List<List<Integer>> threeSum(int[] nums) {
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

    //去重
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    //左右指针
    int l = i + 1;
    int r = length - 1;
    while (l < r) {
      int sum = nums[i] + nums[l] + nums[r];
      if (sum == 0) {
        result.add(Arrays.asList(nums[i], nums[l], nums[r]));
        //去重（相同数字的话就移动指针）
        while (nums[l] == nums[l + 1]) l++;
        while (nums[r] == nums[r - 1]) r--;
        //移动指针
        l++;
        r--;
      } else if (sum < 0) {
        l++;
      } else if (sum > 0) {
        r--;
      }
    }
  }
  return result;
}
```



### 盛最多水的容器

> 给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
>
> ```
> 输入：[1,8,6,2,5,4,8,3,7]
> 输出：49 
> 解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
> ```
>
> ![img](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

思路：

- 求得是水量，水量 = 两个指针指向的数字中较小值 * 指针之间的距离（水桶原理，最短的板才不会漏水）
- 为了求最大水量，我们需要存储所有条件的水量，进行比较才行
- **双指针相向移动**，循环收窄，直到两个指针相遇
- 往哪个方向移动，需要考虑清楚，如果我们移动数字较大的那个指针，那么前者「两个指针指向的数字中较小值」不会增加，后者「指针之间的距离」会减小，那么这个乘积会更小，所以我们移动**数字较小的那个指针**

```java
public int maxArea(int[] height){
  int left = 0;
  int right = height.length - 1;
  //需要保存各个阶段的值
  int result = 0;
  while(left < right){
    //水量 = 两个指针指向的数字中较小值∗指针之间的距离
    int area = Math.min(height[left],height[right]) * (right - left);
    result = Math.max(result,area);
    //移动数字较小的指针
    if(height[left] <= height[right]){
      left ++;
    }else{
      right--;
    }
  }
  return result;
}
```



### 验证回文串

> 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
>
> 说明：本题中，我们将空字符串定义为有效的回文串。
>
> ```
> 输入: "A man, a plan, a canal: Panama"
> 输出: true
> 解释："amanaplanacanalpanama" 是回文串
> ```

思路：

- 没看题解前，因为这个例子中有各种逗号、空格啥的，我第一想到的其实就是先遍历放在一个数组里，然后再去判断，看题解可以在原字符串完成，降低了空间复杂度
- 首先需要知道三个 API
  - `Character.isLetterOrDigit`  确定指定的字符是否为字母或数字
  - `Character.toLowerCase`  将大写字符转换为小写
  - `public char charAt(int index)` String 中的方法，用于返回指定索引处的字符
- 双指针，每移动一步，判断这两个值是不是相同
- 两个指针相遇，则是回文串

```java
public boolean isPalindrome(String s) {
  int left = 0;
  int right = s.length() - 1;
  while (left < right) {
    //这里还得加个left<right，小心while死循环,这两步就是用来过滤非字符，逗号啥的
    while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
      left++;
    }
    while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
      right--;
    }

    if (left < right) {
      if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
        return false;
      }
      //同时相向移动指针
      left++;
      right--;
    }
  }
  return true;
}
```



### 反转字符串

> 编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 char[] 的形式给出。
>
> 不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。
>
> 你可以假设数组中的所有字符都是 ASCII 码表中的可打印字符。
>
> ```
> 输入：["h","e","l","l","o"]
> 输出：["o","l","l","e","h"]
> ```
>
> ```
> 输入：["H","a","n","n","a","h"]
> 输出：["h","a","n","n","a","H"]
> ```

思路：

- 因为要反转，所以就不需要相向移动了，如果用双指针思路的话，其实就是遍历中交换左右指针的字符

```java
public void reverseString(char[] s) {
  int left = 0;
  int right = s.length - 1;
  while (left < right){
    char tmp = s[left];
    s[left] = s[right];
    s[right] = tmp;
    left++;
    right--;
  }
}
```



### 二分查找

有重复数字的话，返回的其实就是最右匹配

```java
public static int search(int[] nums, int target) {
  int left = 0;
  int right = nums.length - 1;
  while (left <= right) {
    //不直接使用（right+left）/2 是考虑数据大的时候溢出
    int mid = (right - left) / 2 + left;
    int tmp = nums[mid];
    if (tmp == target) {
      return mid;
    } else if (tmp > target) {
      //右指针移到中间位置 - 1,也避免不存在的target造成死循环
      right = mid - 1;
    } else {
      //
      left = mid + 1;
    }
  }
  return -1;
}
```



## 二、快慢指针

「快慢指针」，也称为「同步指针」

> ### 环形链表
>
> [19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)
>
> ### 链表的中间结点
>
> ### 删除有序数组中的重复项

### 删除链表的倒数第 N 个结点

给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```



### 链表的中间结点

> 给定一个头结点为 `head` 的非空单链表，返回链表的中间结点。
>
> 如果有两个中间结点，则返回第二个中间结点。(给定链表的结点数介于 `1` 和 `100` 之间。)
>
> ```
> 输入：[1,2,3,4,5]
> 输出：此列表中的结点 3 (序列化形式：[3,4,5])
> 返回的结点值为 3 。 (测评系统对该结点序列化表述是 [3,4,5])。
> 注意，我们返回了一个 ListNode 类型的对象 ans，这样：
> ans.val = 3, ans.next.val = 4, ans.next.next.val = 5, 以及 ans.next.next.next = NULL.
> ```





## 三、滑动窗口

### 3.1 同向交替移动的两个变量

#### 子数组最大平均数 I

#### 爱生气的书店老板



### 3.2 不定长度的滑动窗口

有一类数组上的问题，需要使用两个指针变量（我们称为左指针和右指针），同向、交替向右移动完成任务。这样的过程像极了一个窗口在平面上滑动的过程，因此我们将解决这一类问题的算法称为「滑动窗口」问题

![img](http://img.pkdoutu.com/production/uploads/image/2017/04/04/20170404308618_ZzXJwE.gif)



#### 最小覆盖子串

#### 替换后的最长重复字符



### 3.3 计数问题

> ### 至多包含两个不同字符的最长子串
>
> ### 至多包含 K 个不同字符的最长子串
>
> ### 区间子数组个数
>
> ### K 个不同整数的子数组



### 3.4 使用数据结构维护窗口性质

有一类问题只是名字上叫「滑动窗口」，但解决这一类问题需要用到常见的数据结构。这一节给出的问题可以当做例题进行学习，一些比较复杂的问题是基于这些问题衍生出来的。

#### 滑动窗口最大值

#### 滑动窗口中位数





## 四、其他双指针问题

#### [88. 合并两个有序数组](https://leetcode-cn.com/problems/merge-sorted-array/)







画图分析；
通过具体的、恰当的例子归纳解题思路；
遇到问题的时候一定不能急躁，在代码中打印出变量中的值，观察变量的值是不是按照我们设计的逻辑进行的，这样的办法也是最有效的办法；
理解「循环不变量」，并利用好「循环不变量」，这个非常朴素的、在写对代码的过程中一定需要保证的性质。





这一专题我们介绍在数组和链表的问题里经常考察的两类问题：「滑动窗口」和「双指针」，其实「滑动窗口」也可以称为「双指针」，我们在这个专题里会着重介绍这两类题型的思考路径。

我们在学习它们之前，我们先向大家介绍「循环不变量」。



## 循环不变量

循环前、中、后保持不变

「循环不变量」不是很高深的概念，在「算法」和「数据结构」的世界里，到处都有它的身影。

「循环不变量」是指我们在编写代码的过程中，要一直循序不变的性质，这样的性质是根据要解决的问题，由我们自己定义的。「循环不变量」是我们写对一个问题的基础，保证了在「初始化」「循环遍历」「结束」这三个阶段相同的性质，使得一个问题能够被正确解决。



### 例题：删除有序数组中的重复项

> 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。
>
> 不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。
>
> 说明:
>
> 为什么返回数值是整数，但输出的答案是数组呢?
>
> 请注意，输入数组是以**「引用」**方式传递的，这意味着在函数里修改输入数组对于调用者是可见的。
>
> 你可以想象内部操作如下:
>
> ```java
> // nums 是以“引用”方式传递的。也就是说，不对实参做任何拷贝
> int len = removeDuplicates(nums);
> // 在函数里修改输入数组对于调用者是可见的。
> // 根据你的函数返回的长度, 它会打印出数组中 该长度范围内 的所有元素。
> for (int i = 0; i < len; i++) {
>     	print(nums[i]);
> }
> ```
>
> ```
> 输入：nums = [1,1,2]
> 输出：2, nums = [1,2]
> 解释：函数应该返回新的长度 2 ，并且原数组 nums 的前两个元素被修改为 1, 2 。不需要考虑数组中超出新长度后面的元素。
> ```
>
> ```
> 输入：nums = [0,0,1,1,1,2,2,3,3,4]
> 输出：5, nums = [0,1,2,3,4]
> 解释：函数应该返回新的长度 5 ， 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4 。不需要考虑数组中超出新长度后面的元素。
> ```

**思路分析**：这个问题并不难，相信大家一定可以独立做出来。我们给出两种写法，两种写法里 i 都是用于遍历的下标，而 j 的含义不同，请大家分别比较两者代码的差异。

**定义 1**：j 指向马上要赋值的元素的下标，因此我们定义区间 [0..j) （注意是左闭右开区间，j 不能取到）里没有重复元素。pre 永远指向第 1 个不重复的数字；

- 初始化：为了保证区间 [0..j) （注意这里是左闭右开区间）里没有重复元素。初始的时候，i = 0 ，下标为 0 的位置只有一个数，区间 [0..j) 一定不会出现重复，这件事情表示为区间 [0..0] 没有重复数字，即区间 [0..1) 没有重复数字，因此 j 初始化的时候需要等于 1；
- 保持：遇到和 pre 指向的数字相等元素，i++ 直接看到下一个元素，如果 nums[i] != pre ，表示程序看到了第 1 个不重复的数字，此时需要赋值 nums[j] = nums[i] 和 pre = nums[j] ，然后让 j++ 指向下一个需要赋值的下标；
- 终止：循环结束以后 i = len ，程序看完了输入数组的所有元素，此时区间 [0..j) 里没有重复元素，它的长度为 j ，返回 j。

参考代码 1：

```java
public int removeDuplicates(int[] nums) {
    int len = nums.length;
    if (len < 2) {
        return len;
    }
    int j = 1;
    int pre = nums[0];
    for (int i = 1; i < len; i++) {
        if (nums[i] != pre) {
            nums[j] = nums[i];
            pre = nums[j];
            j++;
        }
    }
    return j;
}
```

**定义 2**：我们定义：区间 [0..j] （注意这里是左闭右闭区间）没有出现重复元素，此时变量 j 是上一轮找到的第 1 次出现的元素的下标。因此我们不需要像「定义 1」一样给 pre 定义。循环变量 i 看到的数值 nums[i] 永远和变量 j 看到的数值 nums[j] 进行比较。 大家可以对照上面的「定义 1」自行写出「初始化」「保持」「终止」的逻辑。

参考代码 2：

```java
public int removeDuplicates(int[] nums) {
    int len = nums.length;
    if (len < 2) {
        return len;
    }
    int j = 0;
    for (int i = 1; i < len; i++) {
        if (nums[i] != nums[j]) {
            j++;
            nums[j] = nums[i];
        }
    }
    return j + 1;
}
```

复杂度分析：

- 时间复杂度：O(N)，这里数组的长度是 N， i 和 j 分别最多走 N 步；
- 空间复杂度：O(1)。



### 例题：最长连续递增序列

> 给定一个未经排序的整数数组，找到最长且 连续递增的子序列，并返回该序列的长度。
>
> 连续递增的子序列 可以由两个下标 l 和 r（l < r）确定，如果对于每个 l <= i < r，都有 nums[i] < nums[i + 1] ，那么子序列 [nums[l], nums[l + 1], ..., nums[r - 1], nums[r]] 就是连续递增子序列。
>
> ```
> 输入：nums = [1,3,5,4,7]
> 输出：3
> 解释：最长连续递增序列是 [1,3,5], 长度为3。尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。 
> ```

思路分析：题目要求我们找的子序列是 连续 的，并且子序列里的元素要求 严格单调递增。在遍历的时候，从第 2 个元素开始；

如果当前遍历到的元素比它左边的那一个元素要严格大，「连续递增」的长度就加 11；
否则「连续递增」的起始位置就需要重新开始计算。
我们给出了两版参考代码，分别对应了不同的循环不变量。请大家体会它们的不同。

参考代码 1：

```java
public int findLengthOfLCIS(int[] nums) {
    int len = nums.length;
    int res = 0;
    int i = 0;
    int j = 0;
    // 循环不变量 [i..j) 严格单调递增
    while (j < len) {
        if (j > 0 && nums[j - 1] >= nums[j]) {
            i = j;
        }
        j++;
        res = Math.max(res, j - i);
    }
    return res;
}
```

说明：这一版代码循环不变量为：[i..j) 严格单调递增，初始化的时候 i = 0，j = 0 ，空区间符合严格单调递增的定义。j 左边的元素表示程序已经看到，所以先 j++，计算严格单调递增的区间的长度的时候，长度为 j - i。

参考代码 2：

```java
public int findLengthOfLCIS(int[] nums) {
    int len = nums.length;
    int res = 0;
    int i = 0;
    int j = 0;
    // 循环不变量 [i..j] 严格单调递增
    while (j < len) {
        if (j > 0 && nums[j - 1] >= nums[j]) {
            i = j;
        }
        res = Math.max(res, j - i + 1);
        j++;
    }
    return res;
}
```
说明：这一版代码循环不变量为：[i..j] 严格单调递增，初始化的时候 i = 0，j = 0 ，只有一个元素的区间符合严格单调递增的定义。j 的含义与「参考代码 1」不同，j 以及 j 左边的元素表示程序已经看到，所以先计算区间的长度 j - i + 1，然后 j++。

复杂度分析：

时间复杂度：O(N)，其中 N 是数组 nums 的长度，程序需要遍历数组一次；

空间复杂度：O(1)。额外使用的空间为常数。



### 总结

区间不同的定义决定了不同的初始化逻辑、遍历过程中的逻辑。

- 移除元素
- 删除排序数组中的重复项 II
- 移动零



## 使用循环不变量写对代码

这一节我们讲解两个非常基础且常考的问题，向大家展示：我们在写代码的时候一定要明确自己对变量以及区间的定义是什么，并且在编写代码的过程中保持定义不变。

https://leetcode-cn.com/leetbook/read/sliding-window-and-two-pointers/rl5i7m/











#### [344. 反转字符串](https://leetcode-cn.com/problems/reverse-string/)

> 编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出。
>
> 不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。
>
> ```
> 输入：s = ["h","e","l","l","o"]
> 输出：["o","l","l","e","h"]
> ```

**思路**：双指针

1. 将 left 指向字符数组首元素，right 指向字符数组尾元素。
2. 当 left < right：
   - 交换 s[left] 和 s[right]；
   - left 指针右移一位，即 left = left + 1；
   - right 指针左移一位，即 right = right - 1。
3. 当 left >= right，反转结束，返回字符数组即可。

```java
public void reverseString(char[] s) {
  int n = s.length;
  for (int left = 0, right = n - 1; left < right; ++left, --right) {
    char tmp = s[left];
    s[left] = s[right];
    s[right] = tmp;
  }
}
```



#### [557. 反转字符串中的单词 III](https://leetcode-cn.com/problems/reverse-words-in-a-string-iii/)

> 给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。
>
> ```
> 输入："Let's take LeetCode contest"
> 输出："s'teL ekat edoCteeL tsetnoc"
> ```

思路：开辟一个新字符串。然后从头到尾遍历原字符串，直到找到空格为止，此时找到了一个单词，并能得到单词的起止位置。随后，根据单词的起止位置，可以将该单词逆序放到新字符串当中。如此循环多次，直到遍历完原字符串，就能得到翻转后的结果。

```java
public String reverseWords(String s) {
  StringBuffer ret = new StringBuffer();
  int length = s.length();
  int i = 0;
  while (i < length) {
    int start = i;
    while (i < length && s.charAt(i) != ' ') {
      i++;
    }
    for (int p = start; p < i; p++) {
      ret.append(s.charAt(start + i - 1 - p));
    }
    while (i < length && s.charAt(i) == ' ') {
      i++;
      ret.append(' ');
    }
  }
  return ret.toString();
}
```

