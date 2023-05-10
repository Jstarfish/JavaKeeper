---
title: 字符串-热题
date: 2023-05-08
tags: 
 - String
categories: leetcode
---

> 字符串的题目，和数组的题目大差不大

### [20. 有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)

> 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。有效字符串需满足：
>
> 左括号必须用相同类型的右括号闭合。
> 左括号必须以正确的顺序闭合。
>
> ```
> 输入：s = "()"
> 输出：true
> ```
>
> ```
> 输入：s = "()[]{}"
> 输出：true
> ```
>
> ```
> 输入：s = "([)]"
> 输出：false
> ```

思路：栈

```java
public boolean isValid(String s) {
        int n = s.length();

        if (n / 2 == 1) {
            return false;
        }

        Map<Character, Character> pairs = new HashMap<Character, Character>() {{
            put(')', '(');
            put(']', '[');
            put('}', '{');
        }};
        Deque<Character> stack = new LinkedList<Character>();
        for (int i = 0; i < n; i++) {
            char ch = s.charAt(i);
            if (pairs.containsKey(ch)) {
                if (stack.isEmpty() || stack.peek() != pairs.get(ch)) {
                    return false;
                }
                stack.pop();
            } else {
                stack.push(ch);
            }
        }
        return stack.isEmpty();
    }
```



### [3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

> 给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。
>
> ```
> 输入: s = "abcabcbb"
> 输出: 3 
> 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
> ```
>
> ```
> 输入: s = "bbbbb"
> 输出: 1
> 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
> ```

**思路**：滑动窗口

```java
public static int lengthOfLongestSubstring(String s) {
  if (s.length()==0) {
    return 0;
  }
  // 哈希集合，记录每个字符是否出现过
  HashMap<Character, Integer> map = new HashMap<Character, Integer>();
  int max = 0;
  int left = 0;
  for(int i = 0; i < s.length(); i ++){
    if(map.containsKey(s.charAt(i))){
      left = Math.max(left,map.get(s.charAt(i)) + 1);
    }
    map.put(s.charAt(i),i);
    max = Math.max(max,i-left+1);
  }
  return max;
}
```

> 滑动窗口题目：
>
> https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/solution/hua-dong-chuang-kou-by-powcai/
>
> [3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)
>
> [30. 串联所有单词的子串](https://leetcode-cn.com/problems/substring-with-concatenation-of-all-words/)
>
> [76. 最小覆盖子串](https://leetcode-cn.com/problems/minimum-window-substring/)
>
> [159. 至多包含两个不同字符的最长子串](https://leetcode-cn.com/problems/longest-substring-with-at-most-two-distinct-characters/)
>
> [209. 长度最小的子数组](https://leetcode-cn.com/problems/minimum-size-subarray-sum/)
>
> [239. 滑动窗口最大值](https://leetcode-cn.com/problems/sliding-window-maximum/)
>
> [567. 字符串的排列](https://leetcode-cn.com/problems/permutation-in-string/)
>
> [632. 最小区间](https://leetcode-cn.com/problems/smallest-range/)
>
> [727. 最小窗口子序列](https://leetcode-cn.com/problems/minimum-window-subsequence/)



### [76. 最小覆盖子串](https://leetcode-cn.com/problems/minimum-window-substring/)

> 给你一个字符串 `s` 、一个字符串 `t` 。返回 `s` 中涵盖 `t` 所有字符的最小子串。如果 `s` 中不存在涵盖 `t` 所有字符的子串，则返回空字符串 `""` 。
>
> **注意：**
>
> - 对于 `t` 中重复字符，我们寻找的子字符串中该字符数量必须不少于 `t` 中该字符数量。
> - 如果 `s` 中存在这样的子串，我们保证它是唯一的答案。
>
> ```
> 输入：s = "ADOBECODEBANC", t = "ABC"
> 输出："BANC"
> ```
>
> ```
> 输入: s = "a", t = "aa"
> 输出: ""
> ```

**滑动窗口算法的思路是这样**：

> 1、我们在字符串 `S` 中使用双指针中的左右指针技巧，初始化 `left = right = 0`，把索引**左闭右开**区间 `[left, right)` 称为一个「窗口」。
>
> 2、我们先不断地增加 `right` 指针扩大窗口 `[left, right)`，直到窗口中的字符串符合要求（包含了 `T` 中的所有字符）。
>
> 3、此时，我们停止增加 `right`，转而不断增加 `left` 指针缩小窗口 `[left, right)`，直到窗口中的字符串不再符合要求（不包含 `T` 中的所有字符了）。同时，每次增加 `left`，我们都要更新一轮结果。
>
> 4、重复第 2 和第 3 步，直到 `right` 到达字符串 `S` 的尽头。
>
> 这个思路其实也不难，**第 2 步相当于在寻找一个「可行解」，然后第 3 步在优化这个「可行解」，最终找到最优解**，也就是最短的覆盖子串。左右指针轮流前进，窗口大小增增减减，窗口不断向右滑动，这就是「滑动窗口」这个名字的来历。
>
> 下面画图理解一下，`needs` 和 `window` 相当于计数器，分别记录 `T` 中字符出现次数和「窗口」中的相应字符的出现次数。
>
> 初始状态：
>
> ![img](https://labuladong.gitee.io/algo/images/slidingwindow/1.png)
>
> 增加 `right`，直到窗口 `[left, right]` 包含了 `T` 中所有字符：
>
> [![img](https://labuladong.gitee.io/algo/images/slidingwindow/2.png)](https://labuladong.gitee.io/algo/images/slidingwindow/2.png)
>
> 现在开始增加 `left`，缩小窗口 `[left, right]`：
> ![img](https://labuladong.gitee.io/algo/images/slidingwindow/3.png)
>
> 直到窗口中的字符串不再符合要求，`left` 不再继续移动：
>
> ![img](https://labuladong.gitee.io/algo/images/slidingwindow/4.png)
>
> 之后重复上述过程，先移动 `right`，再移动 `left`…… 直到 `right` 指针到达字符串 `S` 的末端，算法结束。

![fig1](https://assets.leetcode-cn.com/solution-static/76/76_fig1.gif)









### [5. 最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/)

> 给你一个字符串 `s`，找到 `s` 中最长的回文子串。
>
> ```
> 输入：s = "babad"
> 输出："bab"
> 解释："aba" 同样是符合题意的答案。
> ```

**思路**：动态规划、中心扩散法





### [93. 复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/)

> 有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
>
> 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。
> 给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入 '.' 来形成。你 不能 重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。
>
> ```
> 输入：s = "25525511135"
> 输出：["255.255.11.135","255.255.111.35"]
> ```
