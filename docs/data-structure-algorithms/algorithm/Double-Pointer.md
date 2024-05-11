---
title: 双指针
date: 2023-05-17
tags: 
 - pointers
categories: LeetCode
---

![](https://img.starfish.ink/leetcode/two-pointer-banner.png)

> 在数组中并没有真正意义上的指针，但我们可以把索引当做数组中的指针
>
> 归纳下双指针算法，其实总共就三类
>
> - 左右指针，数组和字符串问题
> - 快慢指针，主要是成环问题
> - 滑动窗口，针对子串问题



## 一、左右指针

![](https://img.starfish.ink/leetcode/two-point.png)

左右指针在数组中其实就是两个索引值，两个指针相向而行或者相背而行

TODO: 一般都是有序数组？或者先排序后？

Javaer 一般这么表示：

```java
int left = 0;
int right = arr.length - 1;
while(left < right)
  ***
```

这两个指针 **相向交替移动**



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



### [反转字符串](https://leetcode.cn/problems/reverse-string/)

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

简化一下

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



### [两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)

> 给你一个下标从 1 开始的整数数组 numbers ，该数组已按 非递减顺序排列  ，请你从数组中找出满足相加之和等于目标数 target 的两个数。如果设这两个数分别是 numbers[index1] 和 numbers[index2] ，则 1 <= index1 < index2 <= numbers.length 。
>
> 以长度为 2 的整数数组 [index1, index2] 的形式返回这两个整数的下标 index1 和 index2。
>
> 你可以假设每个输入 只对应唯一的答案 ，而且你 不可以 重复使用相同的元素。
>
> 你所设计的解决方案必须只使用常量级的额外空间。
>
> ```
> 输入：numbers = [2,7,11,15], target = 9
> 输出：[1,2]
> 解释：2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。返回 [1, 2] 。
> ```

直接用左右指针套就可以

```java
public static int[] towSum(int[] nums, int target) {
  int left = 0;
  int rigth = nums.length - 1;
  while (left < rigth) {
    int tmp = nums[left] + nums[rigth];
    if (target == tmp) {
      //数组下标是从1开始的
      return new int[]{left + 1, rigth + 1};
    } else if (tmp > target) {
      rigth--; //右移
    } else {
      left++;  //左移
    }
  }
  return new int[]{-1, -1};
}
```



### [三数之和](https://leetcode.cn/problems/3sum/)

> 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请你返回所有和为 0 且不重复的三元组。
>
> 注意：答案中不可以包含重复的三元组。
>

思路：**排序、双指针、去重**

第一个想法是，这三个数，两个指针？

- 对数组排序，固定一个数 $nums[i]$ ，然后遍历数组，并移动左右指针求和，判断是否有等于 0 的情况
- 特例：
  - 排序后第一个数就大于 0，不干了
  - 有三个需要去重的地方
    - nums[i] == nums[i - 1]  直接跳过本次遍历
    - nums[left] == nums[left + 1]  移动指针，即去重
    - nums[right] == nums[right - 1]  移动指针

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

            //去重, 不能是 nums[i] == nums[i +1 ]，会造成遗漏
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
                    //不要用成 if 判断，只跳过 1 条，还会有重复的，且需要再加上 l<r，以防死循环
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    //移动指针
                    l++;
                    r--;
                }
                else if (sum < 0) l++;
                else if (sum > 0) r--;
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

**思路**：

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



### [验证回文串](https://leetcode.cn/problems/valid-palindrome/)

> 如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样。则可以认为该短语是一个 回文串 。
>
> 字母和数字都属于字母数字字符。
>
> 给你一个字符串 s，如果它是 回文串 ，返回 true ；否则，返回 false 。
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

「快慢指针」，也称为「同步指针」，所谓快慢指针，就是两个指针同向而行，一快一慢

![](https://img.starfish.ink/leetcode/fast-slow-point.png)

> [141. 环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)
>
> [142. 环形链表II](https://leetcode-cn.com/problems/linked-list-cycle-ii)
>
> [19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)
>
> [876. 链表的中间结点](https://leetcode-cn.com/problems/middle-of-the-linked-list/)
>
> [26. 删除有序数组中的重复项](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)

### 环形链表

> 给你一个链表的头节点 head ，判断链表中是否有环。
>
> 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。
>
> 如果链表中存在环 ，则返回 true 。 否则，返回 false 。
>
> ![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

思路：

- 快慢指针，两个指针，一快一慢的话，慢指针每次只移动一步，而快指针每次移动两步。初始时，慢指针在位置 head，而快指针在位置 head.next。这样一来，如果在移动的过程中，快指针反过来追上慢指针，就说明该链表为环形链表。否则快指针将到达链表尾部，该链表不为环形链表。

```java
public boolean hasCycle(ListNode head) {
  if (head == null || head.next == null) {
    return false;
  }
  // 龟兔起跑
  ListNode fast = head;
  ListNode slow = head;

  while (fast != null && fast.next != null) {
    // 龟走一步
    slow = slow.next;
    // 兔走两步
    fast = fast.next.next;
    if (slow == fast) {
      return true;
    }
  }
  return false;
}
```



### 环形链表 II

> 给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。
>
> ```
> 输入：head = [3,2,0,-4], pos = 1
> 输出：返回索引为 1 的链表节点
> 解释：链表中有一个环，其尾部连接到第二个节点。
> ```

思路：

- 最初，我就把有环理解错了，看题解觉得快慢指针相交的地方就是入环的节点
- 假设环是这样的，slow 指针进入环后，又走了 b 的距离与 fast 相遇
- ![fig1](https://assets.leetcode-cn.com/solution-static/142/142_fig1.png)



### [链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)

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

思路：

- 快慢指针遍历，当 `fast` 到达链表的末尾时，`slow` 必然位于中间

```java
public ListNode middleNode(ListNode head) {
  ListNode fast = head;
  ListNode slow = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```



### [ 回文链表](https://leetcode.cn/problems/palindrome-linked-list/)

> 给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 
>
> ```
> 输入：head = [1,2,2,1]
> 输出：true
> ```

思路：

- 双指针：将值复制到数组中后用双指针法
- 或者使用快慢指针来确定中间结点，然后反转后半段链表，将前半部分链表和后半部分进行比较

```java
public boolean isPalindrome(ListNode head) {
  List<Integer> vals = new ArrayList<Integer>();

  // 将链表的值复制到数组中
  ListNode currentNode = head;
  while (currentNode != null) {
    vals.add(currentNode.val);
    currentNode = currentNode.next;
  }

  // 使用双指针判断是否回文
  int front = 0;
  int back = vals.size() - 1;
  while (front < back) {
    if (!vals.get(front).equals(vals.get(back))) {
      return false;
    }
    front++;
    back--;
  }
  return true;
}
```



### [删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

> 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
>
> ```
> 输入：head = [1,2,3,4,5], n = 2
> 输出：[1,2,3,5]
> ```

思路：

1. 计算链表长度：从头节点开始对链表进行一次遍历，得到链表的长度，随后我们再从头节点开始对链表进行一次遍历，当遍历到第 L−n+1 个节点时，它就是我们需要删除的节点（为了与题目中的 n 保持一致，节点的编号从 1 开始）
2. 栈：根据栈「先进后出」的原则，我们弹出栈的第 n 个节点就是需要删除的节点，并且目前栈顶的节点就是待删除节点的前驱节点
3. 双指针：由于我们需要找到倒数第 n 个节点，因此我们可以使用两个指针 first 和 second 同时对链表进行遍历，并且 first 比 second 超前 n 个节点。当 first 遍历到链表的末尾时，second 就恰好处于倒数第 n 个节点。

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
  ListNode dummy = new ListNode(0, head);
  ListNode first = head;
  ListNode second = dummy;

  //让 first 指针先移动 n 步
  for (int i = 0; i < n; ++i) {
    first = first.next;
  }
  while (first != null) {
    first = first.next;
    second = second.next;
  }
  second.next = second.next.next;
  return dummy.next;
}
```



### [删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

> 给你一个 升序排列 的数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。元素的 相对顺序 应该保持 一致 。
>
> 由于在某些语言中不能改变数组的长度，所以必须将结果放在数组nums的第一部分。更规范地说，如果在删除重复项之后有 k 个元素，那么 nums 的前 k 个元素应该保存最终结果。
>
> 将最终结果插入 nums 的前 k 个位置后返回 k 。
>
> 不要使用额外的空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。
>
> ```
> 输入：nums = [1,1,2]
> 输出：2, nums = [1,2,_]
> 解释：函数应该返回新的长度 2 ，并且原数组 nums 的前两个元素被修改为 1, 2 。不需要考虑数组中超出新长度后面的元素。
> ```

**思路**：

- 数组有序，那相等的元素在数组中的下标一定是连续的
- 使用快慢指针，快指针表示遍历数组到达的下标位置，慢指针表示下一个不同元素要填入的下标位置
- 第一个元素不需要删除，所有快慢指针都从下标 1 开始

```java
public static int removeDuplicates(int[] nums) {
  if (nums == null) {
    return 0;
  }
  int fast = 1;
  int slow = 1;
  while (fast < nums.length) {
    //和前一个值比较
    if (nums[fast] != nums[fast - 1]) {
      //不一样的话，把快指针的值放在慢指针上，实现了去重，并往前移动慢指针
      nums[slow] = nums[fast];
      ++slow;
    }
    //相等的话，移动快指针就行
    ++fast;
  }
  //慢指针的位置就是不重复的数量
  return slow;
}
```



### 最长连续递增序列

> 给定一个未经排序的整数数组，找到最长且 连续递增的子序列，并返回该序列的长度。
>
> 连续递增的子序列 可以由两个下标 l 和 r（l < r）确定，如果对于每个 l <= i < r，都有 nums[i] < nums[i + 1] ，那么子序列 [nums[l], nums[l + 1], ..., nums[r - 1], nums[r]] 就是连续递增子序列。
>
> ```
> 输入：nums = [1,3,5,4,7]
> 输出：3
> 解释：最长连续递增序列是 [1,3,5], 长度为3。尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。 
> ```

思路分析：

- 这个题的思路和删除有序数组中的重复项，很像

```java
public int findLengthOfLCIS(int[] nums) {
  int result = 0;
  int fast = 0;
  int slow = 0;
  while (fast < nums.length) {
    //前一个数大于后一个数的时候
    if (fast > 0 || nums[fast - 1] > nums[fast]) {
      slow = fast;
    }
    fast++;
    result = Math.max(result, fast - slow);
  }
  return result;
}
```



## 三、滑动窗口

有一类数组上的问题，需要使用两个指针变量（我们称为左指针和右指针），同向、交替向右移动完成任务。这样的过程像极了一个窗口在平面上滑动的过程，因此我们将解决这一类问题的算法称为「滑动窗口」问题



![img](http://img.pkdoutu.com/production/uploads/image/2017/04/04/20170404308618_ZzXJwE.gif)

滑动窗口，就是两个指针齐头并进，好像一个窗口一样，不断往前滑

子串问题，几乎都是滑动窗口

> [643. 子数组最大平均数 I](https://leetcode-cn.com/problems/maximum-average-subarray-i/)
>
> [1052. 爱生气的书店老板](https://leetcode-cn.com/problems/grumpy-bookstore-owner/)
>
> [3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)
>
> [76. 最小覆盖子串](https://leetcode-cn.com/problems/minimum-window-substring/)
>
> [424. 替换后的最长重复字符](https://leetcode-cn.com/problems/longest-repeating-character-replacement/)
>
> 

```java
int left = 0, right = 0;

while (right < s.size()) {
    // 增大窗口
    window.add(s[right]);
    right++;
    
    while (window needs shrink) {
        // 缩小窗口
        window.remove(s[left]);
        left++;
    }
}
```



### 3.1 同向交替移动的两个变量

有一类数组上的问题，问我们固定长度的滑动窗口的性质，这类问题还算相对简单。

#### 子数组最大平均数 I

> 给定 `n` 个整数，找出平均数最大且长度为 `k` 的连续子数组，并输出该最大平均数。
>
> ```
> 输入：[1,12,-5,-6,50,3], k = 4
> 输出：12.75
> 解释：最大平均数 (12-5-6+50)/4 = 51/4 = 12.75
> ```

**思路**：

- 长度为固定的 K，想到用滑动窗口
- 保存每个窗口的值，取这 k 个数的最大和就可以得出最大平均数
- 怎么保存每个窗口的值，这一步

```java
public static double getMaxAverage(int[] nums, int k) {
  int sum = 0;
  //先求出前k个数的和
  for (int i = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  //目前最大的数是前k个数
  int result = sum;
  //然后从第 K 个数开始移动，保存移动中的和值，返回最大的
  for (int i = k; i < nums.length; i++) {
    sum = sum - nums[i - k] + nums[i];
    result = Math.max(result, sum);
  }
  //返回的是double
  return 1.0 * result / k;
}
```



### 3.2 不定长度的滑动窗口

#### 无重复字符的最长子串

> 给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。
>
> ```
> 输入: s = "abcabcbb"
> 输出: 3 
> 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
> ```

思路：

- 滑动窗口，其实就是一个队列，比如例题中的 abcabcbb，进入这个队列（窗口）为 abc 满足题目要求，当再进入 a，队列变成了 abca，这时候不满足要求。所以，我们要移动这个队列
- 如何移动？我们只要把队列的左边的元素移出就行了，直到满足题目要求！
- 一直维持这样的队列，找出队列出现最长的长度时候，求出解！

```java
public static int lengthOfLongestSubstring(String s){
  HashMap<Character, Integer> map = new HashMap<>();
  int result = 0;
  int left = 0;
  //为了有左右指针的思想，我把我们常用的 i 写成了 right
  for (int right = 0; right < s.length(); right++) {
    //当前字符包含在当前有效的子段中，如：abca，当我们遍历到第二个a，当前有效最长子段是 abc，我们又遍历到a，
    //那么此时更新 left 为 map.get(a)+1=1，当前有效子段更新为 bca；
    //相当于左指针往前移动了一位
    if (map.containsKey(s.charAt(right))) {
      left = Math.max(left, map.get(s.charAt(right)) + 1);
    }
    //右指针一直往前移动
    map.put(s.charAt(right), right);
    result = Math.max(result, right - left + 1);
  }
  return result;
}
```



#### 最小覆盖子串

> 给你一个字符串 `s` 、一个字符串 `t` 。返回 `s` 中涵盖 `t` 所有字符的最小子串。如果 `s` 中不存在涵盖 `t` 所有字符的子串，则返回空字符串 `""` 。
>
> ```
> 输入：s = "ADOBECODEBANC", t = "ABC"
> 输出："BANC"
> ```





#### 替换后的最长重复字符

> 给你一个仅由大写英文字母组成的字符串，你可以将任意位置上的字符替换成另外的字符，总共可最多替换 k 次。在执行上述操作后，找到包含重复字母的最长子串的长度。
>
> 注意：字符串长度 和 k 不会超过 10^4
>
> ```
> 输入：s = "ABAB", k = 2
> 输出：4
> 解释：用两个'A'替换为两个'B',反之亦然。
> ```
>
> ```
> 输入：s = "AABABBA", k = 1
> 输出：4
> 解释：将中间的一个'A'替换为'B',字符串变为 "AABBBBA"。子串 "BBBB" 有最长重复字母, 答案为 4。
> ```

思路：

- 



```java
public int characterReplacement(String s, int k) {
  int len = s.length();
  if (len < 2) {
    return len;
  }

  char[] charArray = s.toCharArray();
  int left = 0;
  int right = 0;

  int res = 0;
  int maxCount = 0;
  int[] freq = new int[26];
  // [left, right) 内最多替换 k 个字符可以得到只有一种字符的子串
  while (right < len){
    freq[charArray[right] - 'A']++;
    // 在这里维护 maxCount，因为每一次右边界读入一个字符，字符频数增加，才会使得 maxCount 增加
    maxCount = Math.max(maxCount, freq[charArray[right] - 'A']);
    right++;

    if (right - left > maxCount + k){
      // 说明此时 k 不够用
      // 把其它不是最多出现的字符替换以后，都不能填满这个滑动的窗口，这个时候须要考虑左边界向右移动
      // 移出滑动窗口的时候，频数数组须要相应地做减法
      freq[charArray[left] - 'A']--;
      left++;
    }
    res = Math.max(res, right - left);
  }
  return res;
}
```



### 3.3 计数问题

> ### 至多包含两个不同字符的最长子串
>
> ### 至多包含 K 个不同字符的最长子串
>
> ### 区间子数组个数
>
> ### K 个不同整数的子数组

#### 至多包含两个不同字符的最长子串

> 给定一个字符串 `s`，找出 **至多** 包含两个不同字符的最长子串 `t` ，并返回该子串的长度。
>
> ```
> 输入: "eceba"
> 输出: 3
> 解释: t 是 "ece"，长度为3。
> ```

思路：

- 这种字符串用滑动窗口的题目，一般用 `toCharArray()` 先转成字符数组



#### 至多包含 K 个不同字符的最长子串

> 给定一个字符串 `s`，找出 **至多** 包含 `k` 个不同字符的最长子串 `T`。
>
> ```
> 输入: s = "eceba", k = 2
> 输出: 3
> 解释: 则 T 为 "ece"，所以长度为 3。
> ```



#### 区间子数组个数

> 给定一个元素都是正整数的数组`A` ，正整数 `L` 以及 `R` (`L <= R`)。
>
> 求连续、非空且其中最大元素满足大于等于`L` 小于等于`R`的子数组个数。
>
> ```
> 例如 :
> 输入: 
> A = [2, 1, 4, 3]
> L = 2
> R = 3
> 输出: 3
> 解释: 满足条件的子数组: [2], [2, 1], [3].
> ```



#### K 个不同整数的子数组

> 



### 3.4 使用数据结构维护窗口性质

有一类问题只是名字上叫「滑动窗口」，但解决这一类问题需要用到常见的数据结构。这一节给出的问题可以当做例题进行学习，一些比较复杂的问题是基于这些问题衍生出来的。

#### 滑动窗口最大值

#### 滑动窗口中位数





## 四、其他双指针问题

#### [88. 合并两个有序数组](https://leetcode-cn.com/problems/merge-sorted-array/)







### 总结

区间不同的定义决定了不同的初始化逻辑、遍历过程中的逻辑。

- 移除元素
- 删除排序数组中的重复项 II
- 移动零



