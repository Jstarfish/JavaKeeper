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

Javaer 一般这么表示：

```java
int left = 0;
int right = arr.length - 1;
while(left < right)
  ***
```

这两个指针 **相向交替移动**， 看着像二分查找是吧，二分也属于左右指针。



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
public int[] twoSum(int[] nums, int target) {
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
    - `nums[i] == nums[i - 1]`  直接跳过本次遍历
    
      > **避免重复三元组：**
      >
      > - 我们从第一个元素开始遍历数组，逐步往后移动。如果当前的 `nums[i]` 和前一个 `nums[i - 1]` 相同，说明我们已经处理过以 `nums[i - 1]` 为起点的组合（即已经找过包含 `nums[i - 1]` 的三元组），此时再处理 `nums[i]` 会导致生成重复的三元组，因此可以跳过。
      > - 如果我们检查 `nums[i] == nums[i + 1]`，由于 `nums[i + 1]` 还没有被处理，这种方式无法避免重复，并且会产生错误的逻辑。
    
    - `nums[left] == nums[left + 1]`  移动指针，即去重
    
    - `nums[right] == nums[right - 1]`  移动指针
    
      > **避免重复的配对：**
      >
      > 在每次固定一个 `nums[i]` 后，剩下的两数之和问题通常使用双指针法来解决。双指针的左右指针 `left` 和 `right` 分别从数组的两端向中间逼近，寻找合适的配对。
      >
      > 为了**避免相同的数字被重复使用**，导致重复的三元组，双指针法中也需要跳过相同的元素。
      >
      > - 左指针跳过重复元素：
      >   - 如果 `nums[left] == nums[left + 1]`，说明接下来的数字与之前处理过的数字相同。为了避免生成相同的三元组，我们将 `left` 向右移动跳过这个重复的数字。
      > - 右指针跳过重复元素：
      >   - 同样地，`nums[right] == nums[right - 1]` 也会导致重复的配对，因此右指针也要向左移动，跳过这个重复数字。

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

            //去重, 不能是 nums[i] == nums[i +1 ]，因为顺序遍历的逻辑使得前一个元素已经被处理过，而后续的元素还没有处理
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
                    //移动指针, 必须在去重后再移动
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
> ![](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

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
    // 转换为小写并去掉非字母和数字的字符
    int left = 0, right = s.length() - 1;

    while (left < right) {
        // 忽略左边非字母和数字字符
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
            left++;
        }
        // 忽略右边非字母和数字字符
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
            right--;
        }
        // 比较两边字符
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        left++;
        right--;
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

「快慢指针」，也称为「同步指针」，所谓快慢指针，就是两个指针同向而行，一快一慢。快慢指针处理的大都是链表问题。

![](https://img.starfish.ink/leetcode/fast-slow-point.png)

### [环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)

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



### [环形链表II](https://leetcode-cn.com/problems/linked-list-cycle-ii)

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

  ![fig1](https://assets.leetcode-cn.com/solution-static/142/142_fig1.png)

1. **检测是否有环**：通过快慢指针来判断链表中是否存在环。慢指针一次走一步，快指针一次走两步。如果链表中有环，两个指针最终会相遇；如果没有环，快指针会到达链表末尾。

2. **找到环的起点**：

   - 当快慢指针相遇时，我们已经确认链表中存在环。

   - 从相遇点开始，慢指针保持不动，快指针回到链表头部，此时两个指针每次都走一步。两个指针会在环的起点再次相遇。

```java
public ListNode detectCycle(ListNode head) {
    if (head == null || head.next == null) {
        return null;
    }

    ListNode slow = head;
    ListNode fast = head;

    // 判断是否有环
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        // 快慢指针相遇，说明有环
        if (slow == fast) {
            break;
        }
    }

    // 如果没有环
    if (fast == null || fast.next == null) {
        return null;
    }

    // 快指针回到起点，慢指针保持在相遇点
    fast = head;
    while (fast != slow) {
        fast = fast.next;
        slow = slow.next;
    }

    // 此时快慢指针相遇的地方就是环的起点
    return slow;
}
```



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



### 删除链表的倒数第 N 个结点

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

![](https://img.starfish.ink/mysql/1*m1WP0k9cHRkcTixpfayOdA.gif)

滑动窗口，就是两个指针齐头并进，好像一个窗口一样，不断往前滑。

子串问题，几乎都是滑动窗口。滑动窗口算法技巧的思路，就是维护一个窗口，不断滑动，然后更新答案，该算法的大致逻辑如下：

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

#### [子数组最大平均数 I（643）](https://leetcode-cn.com/problems/maximum-average-subarray-i/)

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

#### [无重复字符的最长子串_3](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

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

```java
int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> window = new HashMap<>();

    int left = 0, right = 0;
    int res = 0; // 记录结果
    while (right < s.length()) {
        char c = s.charAt(right);
        right++;
        // 进行窗口内数据的一系列更新
        window.put(c, window.getOrDefault(c, 0) + 1);
        // 判断左侧窗口是否要收缩
        while (window.get(c) > 1) {
            char d = s.charAt(left);
            left++;
            // 进行窗口内数据的一系列更新
            window.put(d, window.get(d) - 1);
        }
        // 在这里更新答案
        res = Math.max(res, right - left);
    }
    return res;
}
```



#### [最小覆盖子串（76）](https://leetcode-cn.com/problems/minimum-window-substring/)

> 给你一个字符串 `s` 、一个字符串 `t` 。返回 `s` 中涵盖 `t` 所有字符的最小子串。如果 `s` 中不存在涵盖 `t` 所有字符的子串，则返回空字符串 `""` 。
>
> ```
> 输入：s = "ADOBECODEBANC", t = "ABC"
> 输出："BANC"
> ```

思路：

1. 我们在字符串 `S` 中使用双指针中的左右指针技巧，初始化 `left = right = 0`，把索引**左闭右开**区间 `[left, right)` 称为一个「窗口」。

   > [!IMPORTANT]
   >
   > 为什么要「左闭右开」区间
   >
   > **理论上你可以设计两端都开或者两端都闭的区间，但设计为左闭右开区间是最方便处理的**。
   >
   > 因为这样初始化 `left = right = 0` 时区间 `[0, 0)` 中没有元素，但只要让 `right` 向右移动（扩大）一位，区间 `[0, 1)` 就包含一个元素 `0` 了。
   >
   > 如果你设置为两端都开的区间，那么让 `right` 向右移动一位后开区间 `(0, 1)` 仍然没有元素；如果你设置为两端都闭的区间，那么初始区间 `[0, 0]` 就包含了一个元素。这两种情况都会给边界处理带来不必要的麻烦。

2. 我们先不断地增加 `right` 指针扩大窗口 `[left, right)`，直到窗口中的字符串符合要求（包含了 `T` 中的所有字符）。

3. 此时，我们停止增加 `right`，转而不断增加 `left` 指针缩小窗口 `[left, right)`，直到窗口中的字符串不再符合要求（不包含 `T` 中的所有字符了）。同时，每次增加 `left`，我们都要更新一轮结果。

4. 重复第 2 和第 3 步，直到 `right` 到达字符串 `S` 的尽头。

```java
public String minWindow(String s, String t) {
    // 两个map，window 记录窗口中的字符频率，need 记录t中字符的频率
    HashMap<Character, Integer> window = new HashMap<>();
    HashMap<Character, Integer> need = new HashMap<>();

    for (int i = 0; i < t.length(); i++) {
        char c = t.charAt(i);
        //算出每个字符的数量，有可能有重复的
        need.put(c, need.getOrDefault(c, 0) + 1);
    }

    //左开右闭的区间，然后创建移动窗口
    int left = 0, right = 0;
    // 窗口中满足need条件的字符个数， valid == need.size 说明窗口满足条件
    int valid = 0;
    //记录最小覆盖子串的开始索引和长度
    int start = 0, len = Integer.MAX_VALUE;
    while (right < s.length()) {
        // c 代表将移入窗口的字符
        char c = s.charAt(right);
        //扩大窗口
        right++;

        if (need.containsKey(c)) {
            window.put(c, window.getOrDefault(c, 0) + 1);
            if (window.get(c).equals(need.get(c))) {
                valid++;
            }
        }
        //判断左窗口是否需要收缩
        while (valid == need.size()) {
            if (right - left < len) {
                start = left;
                len = right - left;
            }
            //d 是将移除窗口的字符
            char d = s.charAt(left);
            left++;  //缩小窗口

            //更新窗口
            if (need.containsKey(d)) {
                if (window.get(d).equals(need.get(d))) {
                    valid--;
                    window.put(d, window.get(d) - 1);
                }
            }
        }
    }
    //返回最小覆盖子串
    return len == Integer.MAX_VALUE ? "" : s.substring(start, start + len);
}
```



#### [字符串的排列（567）](https://leetcode.cn/problems/permutation-in-string/description/)

> 给你两个字符串 `s1` 和 `s2` ，写一个函数来判断 `s2` 是否包含 `s1` 的排列。如果是，返回 `true` ；否则，返回 `false` 。
>
> 换句话说，`s1` 的排列之一是 `s2` 的 **子串** 。
>
> ```
> 输入：s1 = "ab" s2 = "eidbaooo"
> 输出：true
> 解释：s2 包含 s1 的排列之一 ("ba").
> ```

思路：

通过滑动窗口（Sliding Window）和字符频率统计来解决

和上一题基本一致，只是 移动 `left` 缩小窗口的时机是窗口大小大于 `t.length()` 时，当发现 `valid == need.size()` 时，就说明窗口中就是一个合法的排列

```java
class Solution {
    // 判断 s 中是否存在 t 的排列
    public boolean checkInclusion(String t, String s) {
        Map<Character, Integer> need = new HashMap<>();
        Map<Character, Integer> window = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.put(c, need.getOrDefault(c, 0) + 1);
        }

        int left = 0, right = 0;
        int valid = 0;
        while (right < s.length()) {
            char c = s.charAt(right);
            right++;
            // 进行窗口内数据的一系列更新
            if (need.containsKey(c)) {
                window.put(c, window.getOrDefault(c, 0) + 1);
                if (window.get(c).intValue() == need.get(c).intValue())
                    valid++;
            }

            // 判断左侧窗口是否要收缩
            while (right - left >= t.length()) {
                // 在这里判断是否找到了合法的子串
                if (valid == need.size())
                    return true;
                char d = s.charAt(left);
                left++;
                // 进行窗口内数据的一系列更新
                if (need.containsKey(d)) {
                    if (window.get(d).intValue() == need.get(d).intValue())
                        valid--;
                    window.put(d, window.get(d) - 1);
                }
            }
        }
        // 未找到符合条件的子串
        return false;
    }
}
```



#### [替换后的最长重复字符（424）](https://leetcode-cn.com/problems/longest-repeating-character-replacement/)

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

#### [最长回文子串_5](https://leetcode.cn/problems/longest-palindromic-substring/)

> 给你一个字符串 `s`，找到 `s` 中最长的 回文子串。

```java
public static String longestPalindrome(String s){
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

private static  int centerExpand(String s, int left, int right){
    while(left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)){
        left --;
        right ++;
    }
    //这个的含义： 假设扩展过程中，left 和 right 已经超出了回文返回， 此时回文范围是 (left+1,right-1), 那么回文长度= (right-1)-(left+1)+1=right-left-1
    return right - left - 1;
}
```



#### [合并两个有序数组_88](https://leetcode-cn.com/problems/merge-sorted-array/)



#### [下一个排列_31](https://leetcode.cn/problems/next-permutation/)

> 整数数组的一个 **排列** 就是将其所有成员以序列或线性顺序排列。
>
> - 例如，`arr = [1,2,3]` ，以下这些都可以视作 `arr` 的排列：`[1,2,3]`、`[1,3,2]`、`[3,1,2]`、`[2,3,1]` 。
>
> 整数数组的 **下一个排列** 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 **下一个排列** 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。
>
> - 例如，`arr = [1,2,3]` 的下一个排列是 `[1,3,2]` 。
> - 类似地，`arr = [2,3,1]` 的下一个排列是 `[3,1,2]` 。
> - 而 `arr = [3,2,1]` 的下一个排列是 `[1,2,3]` ，因为 `[3,2,1]` 不存在一个字典序更大的排列。
>
> 给你一个整数数组 `nums` ，找出 `nums` 的下一个排列。
>
> 必须**[ 原地 ](https://baike.baidu.com/item/原地算法)**修改，只允许使用额外常数空间。

**Approach**: 

1. 我们希望下一个数 比当前数大，这样才满足 “下一个排列” 的定义。因此只需要 将后面的「大数」与前面的「小数」交换，就能得到一个更大的数。比如 123456，将 5 和 6 交换就能得到一个更大的数 123465。
2. 我们还希望下一个数 增加的幅度尽可能的小，这样才满足“下一个排列与当前排列紧邻“的要求。为了满足这个要求，我们需要：
   - 在 尽可能靠右的低位 进行交换，需要 从后向前 查找
   - 将一个 尽可能小的「大数」 与前面的「小数」交换。比如 123465，下一个排列应该把 5 和 4 交换而不是把 6 和 4 交换
   - 将「大数」换到前面后，需要将「大数」后面的所有数 重置为升序

该算法可以分为三个步骤：

1. **从右向左找到第一个升序对**（即`nums[i] < nums[i + 1]`），记为`i`。如果找不到，则说明数组已经是最大的排列，直接将数组反转为最小的排列。
2. **从右向左找到第一个比`nums[i]`大的数**，记为`j`，然后交换`nums[i]`和`nums[j]`。
3. **反转`i + 1`之后的数组**，使其变成最小的排列。

```java
public void nextPermutation(int[] nums){

    //为什么从倒数第二个元素开始，因为我们第一步要从右往左找到第一个“升序对”，
    int i = nums.length - 2;
    //step 1： 找到第一个下降的元素
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    //step2 : 如果找到了 i, 找到第一个比 nums[i] 大的元素 j
    if (i > 0) {
        int j = nums.length - 1;
        while (j >= 0 && nums[j] <= nums[i]) {
            j--;
        }
        //交换i 和 j 的位置
        swap(nums, i, j);

    }

    // step3: 反转从 start 开始到末尾的部分（不需要重新排序，是因为这半部分再交换前就是降序的，我们第一步找的升序对）
    reverse(nums, i+1);
}

private void swap(int[] nums, int i, int j){
    int tmp = nums[i];
    nums[i] = nums[j];
    nums[j] = tmp;
}

private void reverse(int[] nums, int start){
    int end = nums.length - 1;
    while(start < end){
        swap(nums, start, end);
        start ++;
        end --;
    }
}
```



#### [颜色分类_75](https://leetcode.cn/problems/sort-colors/)

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

**Approach**: 

荷兰国旗问题

我们可以使用三个指针：`low`、`mid` 和 `high`，分别用来处理 0、1 和 2 的排序问题。

- `low` 表示红色 (0) 的边界，指向的元素是 1 的位置，即把所有 0 放在 `low` 的左边。
- `mid` 表示当前处理的元素索引。
- `high` 表示蓝色 (2) 的边界，指向的元素是 2 的位置，把所有 2 放在 `high` 的右边。

**算法步骤：**

1. 初始化：`low = 0`，`mid = 0`，`high = nums.length - 1`。
2. 当  `mid <= high` 时，进行以下判断：
   - 如果 `nums[mid] == 0`，将其与 `nums[low]` 交换，并将 `low` 和 `mid` 都加 1。
   - 如果 `nums[mid] == 1`，只需将 `mid` 加 1，因为 1 已经在正确的位置。
   - 如果 `nums[mid] == 2`，将其与 `nums[high]` 交换，并将 `high` 减 1，但 `mid` 不动，因为交换过来的数还未处理。

```java
public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;

    while (mid <= high) {
        if (nums[mid] == 0) {
            // 交换 nums[mid] 和 nums[low]
            swap(nums, low, mid);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else if (nums[mid] == 2) {
            // 交换 nums[mid] 和 nums[high]
            swap(nums, mid, high);
            high--;
        }
    }
}

private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

```

- 时间复杂度：O(n)，每个元素只遍历一次。

- 空间复杂度：O(1)，不需要额外的空间，只在原数组中进行操作。

双指针方法的话，就是两次遍历。

```java
public void sortColors(int[] nums) {
    int left = 0;
    int right = nums.length - 1;

    // 第一次遍历，把 0 移动到数组的左边
    for (int i = 0; i <= right; i++) {
        if (nums[i] == 0) {
            swap(nums, i, left);
            left++;
        }
    }

    // 第二次遍历，把 2 移动到数组的右边
    for (int i = nums.length - 1; i >= left; i--) {
        if (nums[i] == 2) {
            swap(nums, i, right);
            right--;
        }
    }
}

private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

```



#### [排序链表_148](https://leetcode.cn/problems/sort-list/description/)

> 给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。
>
> ```
> 输入：head = [4,2,1,3]
> 输出：[1,2,3,4]
> ```

**Approach**: 要将链表排序，并且时间复杂度要求为 O(nlog⁡n)O(n \log n)O(nlogn)，这提示我们需要使用 **归并排序**。归并排序的特点就是时间复杂度是 O(nlog⁡n)O(n \log n)O(nlogn)，并且它在链表上的表现很好，因为链表的分割和合并操作相对容易。

具体实现步骤：

1. **分割链表**：我们可以使用 **快慢指针** 来找到链表的中点，从而将链表一分为二。
2. **递归排序**：分别对左右两部分链表进行排序。
3. **合并有序链表**：最后将两个已经排序好的链表合并成一个有序链表。

```java

public ListNode sortList(ListNode head) {
    // base case: if the list is empty or contains a single element, it's already sorted
    if (head == null || head.next == null) {
        return head;
    }

    // Step 1: split the linked list into two halves
    ListNode mid = getMiddle(head);
   // right 为链表右半部分的头结点
    ListNode right = mid.next;
    mid.next = null;  //断开

    // Step 2: recursively sort both halves
    ListNode leftSorted = sortList(head);
    ListNode rightSorted = sortList(right);

    // Step 3: merge the sorted halves
    return mergeTwoLists(leftSorted, rightSorted);
}

// Helper method to find the middle node of the linked list
private ListNode getMiddle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}

// Helper method to merge two sorted linked lists
private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(-1);
    ListNode current = dummy;

    while (l1 != null && l2 != null) {
        if (l1.val < l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }

    // Append the remaining elements of either list
    if (l1 != null) {
        current.next = l1;
    } else {
        current.next = l2;
    }

    return dummy.next;
}
```



### 总结

区间不同的定义决定了不同的初始化逻辑、遍历过程中的逻辑。

- 移除元素
- 删除排序数组中的重复项 II
- 移动零



