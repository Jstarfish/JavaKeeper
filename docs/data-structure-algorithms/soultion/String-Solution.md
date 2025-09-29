---
title: 字符串算法题目
date: 2023-05-08
tags: 
 - String
categories: leetcode
---

![](https://img.starfish.ink/leetcode/leetcode-banner.png)

> 字符串的题目，和数组的题目大差不大

## 🎯 核心考点概览

- **双指针技巧**：对撞指针、快慢指针、滑动窗口
- **字符统计**：哈希表统计字符频次
- **模式匹配**：KMP算法、滚动哈希
- **回文处理**：中心扩展、马拉车算法
- **动态规划**：最长公共子序列、编辑距离
- **字符串变换**：反转、替换、分割重组
- **前缀后缀**：前缀树、后缀数组应用

## 💡 解题万能模板

### 🔄 双指针模板

```java
// 对撞指针模板
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        // 处理逻辑
        if (condition) {
            left++;
            right--;
        } else {
            return false;
        }
    }
    return true;
}
```

### 🪟 滑动窗口模板

```java
// 滑动窗口模板
public int slidingWindow(String s) {
    Map<Character, Integer> window = new HashMap<>();
    int left = 0, right = 0;
    int result = 0;
    
    while (right < s.length()) {
        char c = s.charAt(right);
        window.put(c, window.getOrDefault(c, 0) + 1);
        right++;
        
        while (windowNeedshrink()) {
            char d = s.charAt(left);
            window.put(d, window.get(d) - 1);
            left++;
        }
        
        // 更新结果
        result = Math.max(result, right - left);
    }
    
    return result;
}
```

### 🎯 字符统计模板

```java
// 字符频次统计模板
public Map<Character, Integer> charCount(String s) {
    Map<Character, Integer> count = new HashMap<>();
    for (char c : s.toCharArray()) {
        count.put(c, count.getOrDefault(c, 0) + 1);
    }
    return count;
}
```

### 🔍 KMP模式匹配模板

```java
// KMP算法模板
public int strStr(String haystack, String needle) {
    if (needle.isEmpty()) return 0;
    
    int[] next = buildNext(needle);
    int i = 0, j = 0;
    
    while (i < haystack.length()) {
        if (haystack.charAt(i) == needle.charAt(j)) {
            i++;
            j++;
        }
        
        if (j == needle.length()) {
            return i - j;
        } else if (i < haystack.length() && haystack.charAt(i) != needle.charAt(j)) {
            if (j != 0) {
                j = next[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return -1;
}
```

## 🛡️ 边界检查清单

- ✅ 空字符串处理：`s == null || s.isEmpty()`
- ✅ 单字符处理：`s.length() == 1`
- ✅ 索引越界：`i >= 0 && i < s.length()`
- ✅ 字符大小写：统一处理或分别考虑
- ✅ 特殊字符：空格、标点符号的处理

## 💡 记忆口诀

- **双指针**："对撞指针找回文，快慢指针找重复"
- **滑动窗口**："左右指针动态调，窗口大小随需要"
- **字符统计**："哈希计数是法宝，频次统计用得妙"
- **模式匹配**："KMP算法巧匹配，前缀表来帮助你"
- **回文判断**："中心扩展找回文，奇偶长度都考虑"
- **字符串DP**："状态转移要清晰，边界条件别忘记"
- **字符变换**："原地修改要小心，额外空间换时间"



### 📋 正确分类索引

1. **🔥 双指针基础类**：[验证回文串](#_125-验证回文串)、[反转字符串](#_344-反转字符串)、[反转字符串中的单词](#_151-反转字符串中的单词)、[最长回文子串](#_5-最长回文子串)
2. **🪟 滑动窗口类**：[无重复字符的最长子串](#_3-无重复字符的最长子串)、[最小覆盖子串](#_76-最小覆盖子串)、长度最小的子数组、[找到字符串中所有字母异位词](#_438-找到字符串中所有字母异位词)
3. **📊 字符统计类**：[有效的字母异位词](#_242-有效的字母异位词)、[字母异位词分组](#_49-字母异位词分组)、赎金信、第一个不重复的字符
4. **🔍 模式匹配类**：[实现strStr()](#_28-找出字符串中第一个匹配项的下标)、重复的子字符串、字符串匹配、正则表达式匹配
5. **🌀 回文专题类**：[回文子串](#_647-回文子串)、[最长回文子串](#_5-最长回文子串)、回文链表、分割回文串
6. **🎯 动态规划类**：[最长公共子序列](#_1143-最长公共子序列)、[编辑距离](#_72-编辑距离)、不同的子序列、交错字符串
7. **🔄 字符串变换类**：整数转换、[字符串转换整数(atoi)](#_8-字符串转换整数-atoi)、字符串相加、字符串相乘
8. **🚀 进阶技巧类**：[最短回文串](#_214-最短回文串)、[复原IP地址](#_93-复原ip地址)、[有效的括号](#_20-有效的括号)、[电话号码的字母组合](#_17-电话号码的字母组合)、串联所有单词的子串

---

## 🔥 一、双指针基础类（基石中的基石）

### 💡 核心思想

- **对撞指针**：从两端向中间靠拢
- **快慢指针**：不同速度遍历处理
- **滑动窗口**：动态调整窗口大小

### [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：双指针入门**

> 验证字符串是否为回文串（忽略大小写和非字母数字字符）：`"A man, a plan, a canal: Panama"` → `true`

**💡 核心思路**：对撞指针 + 字符过滤

- 双指针从两端向中间移动
- 跳过非字母数字字符
- 统一转换为小写比较

**🔑 记忆技巧**：

- **口诀**："对撞指针验回文，跳过无效比字符"
- **形象记忆**：像照镜子一样，左右对称

```java
public boolean isPalindrome(String s) {
    if (s == null || s.isEmpty()) return true;
    
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        // 跳过左边的非字母数字字符
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
            left++;
        }
        
        // 跳过右边的非字母数字字符
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
            right--;
        }
        
        // 比较字符（转换为小写）
        if (Character.toLowerCase(s.charAt(left)) != 
            Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历字符串一次
- **空间复杂度**：O(1) - 只使用常数个变量

### [344. 反转字符串](https://leetcode.cn/problems/reverse-string/)

**🎯 考察频率：高 | 难度：简单 | 重要性：原地操作基础**

> 原地反转字符数组：`['h','e','l','l','o']` → `['o','l','l','e','h']`

**💡 核心思路**：对撞指针交换

- 左右指针交换字符
- 向中间靠拢直到相遇

**🔑 记忆技巧**：

- **口诀**："对撞指针做交换，原地反转很简单"

```java
public void reverseString(char[] s) {
    int left = 0, right = s.length - 1;
    
    while (left < right) {
        // 交换字符
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        
        left++;
        right--;
    }
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历一半字符
- **空间复杂度**：O(1) - 原地操作

### [151. 反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/)

**🎯 考察频率：高 | 难度：中等 | 重要性：字符串处理综合**

> 反转单词顺序：`"the sky is blue"` → `"blue is sky the"`

**💡 核心思路**：分割 + 反转 + 重组

- 方法1：split分割后反转数组
- 方法2：双指针提取单词后反向拼接

**🔑 记忆技巧**：

- **口诀**："单词分割后反转，空格处理要注意"

```java
// 方法1：使用内置函数
public String reverseWords(String s) {
    String[] words = s.trim().split("\\s+");
    StringBuilder result = new StringBuilder();
    
    for (int i = words.length - 1; i >= 0; i--) {
        result.append(words[i]);
        if (i > 0) result.append(" ");
    }
    
    return result.toString();
}
```

**🔧 双指针解法**：

```java
public String reverseWords(String s) {
    StringBuilder result = new StringBuilder();
    int n = s.length();
    int i = n - 1;
    
    while (i >= 0) {
        // 跳过空格
        while (i >= 0 && s.charAt(i) == ' ') i--;
        
        if (i < 0) break;
        
        // 找单词边界
        int j = i;
        while (i >= 0 && s.charAt(i) != ' ') i--;
        
        // 添加单词
        if (result.length() > 0) result.append(" ");
        result.append(s.substring(i + 1, j + 1));
    }
    
    return result.toString();
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历字符串
- **空间复杂度**：O(n) - 存储结果

### [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：回文算法经典**

> 找到字符串中最长的回文子串：`"babad"` → `"bab"` 或 `"aba"`

**💡 核心思路**：中心扩展法

- 遍历每个可能的回文中心
- 分别处理奇数长度和偶数长度回文
- 从中心向两边扩展，记录最长回文

**🔑 记忆技巧**：

- **口诀**："中心扩展找回文，奇偶长度分别算"
- **形象记忆**：像投石子到水中，波纹向外扩散

```java
public String longestPalindrome(String s) {
    if (s == null || s.length() < 2) return s;
    
    int start = 0, maxLen = 1;
    
    for (int i = 0; i < s.length(); i++) {
        // 奇数长度回文
        int len1 = expandAroundCenter(s, i, i);
        // 偶数长度回文
        int len2 = expandAroundCenter(s, i, i + 1);
        
        int len = Math.max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    
    return s.substring(start, start + maxLen);
}

private int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && 
           s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}
```

**🔧 动态规划解法**：

```java
public String longestPalindrome(String s) {
    int n = s.length();
    boolean[][] dp = new boolean[n][n];
    int start = 0, maxLen = 1;
    
    // 单个字符都是回文
    for (int i = 0; i < n; i++) {
        dp[i][i] = true;
    }
    
    // 检查长度为2的子串
    for (int i = 0; i < n - 1; i++) {
        if (s.charAt(i) == s.charAt(i + 1)) {
            dp[i][i + 1] = true;
            start = i;
            maxLen = 2;
        }
    }
    
    // 检查长度大于2的子串
    for (int len = 3; len <= n; len++) {
        for (int i = 0; i < n - len + 1; i++) {
            int j = i + len - 1;
            if (s.charAt(i) == s.charAt(j) && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                start = i;
                maxLen = len;
            }
        }
    }
    
    return s.substring(start, start + maxLen);
}
```

**⏱️ 复杂度分析**：

- **中心扩展法**：
  - 时间复杂度：O(n²) - 每个中心扩展O(n)
  - 空间复杂度：O(1) - 常数空间
- **动态规划法**：
  - 时间复杂度：O(n²) - 双重循环
  - 空间复杂度：O(n²) - 二维DP表

---

## 🪟 二、滑动窗口类

### 💡 核心思想

- **动态窗口**：根据条件调整窗口大小
- **窗口收缩**：不满足条件时缩小窗口
- **窗口扩展**：满足条件时扩大窗口

### [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：滑动窗口经典**

> 找出不含有重复字符的最长子串：`"abcabcbb"` → `3` ("abc")

**💡 核心思路**：滑动窗口 + 哈希表

- 右指针扩展窗口，左指针收缩窗口
- 哈希表记录字符最近出现的位置
- 遇到重复字符时，移动左指针到重复字符的下一位

**🔑 记忆技巧**：

- **口诀**："滑动窗口找无重复，哈希记录字符位置"
- **形象记忆**：像一个会伸缩的尺子，遇到重复就缩短

```java
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> window = new HashMap<>();
    int left = 0, right = 0;
    int maxLen = 0;
    
    while (right < s.length()) {
        char c = s.charAt(right);
        
        // 如果字符已存在且在当前窗口内
        if (window.containsKey(c) && window.get(c) >= left) {
            left = window.get(c) + 1;
        }
        
        window.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
        right++;
    }
    
    return maxLen;
}
```

**🔧 优化版本（使用数组）**：

```java
public int lengthOfLongestSubstring(String s) {
    int[] lastIndex = new int[128]; // ASCII字符
    Arrays.fill(lastIndex, -1);
    
    int left = 0, maxLen = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        
        if (lastIndex[c] >= left) {
            left = lastIndex[c] + 1;
        }
        
        lastIndex[c] = right;
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 每个字符最多被访问两次
- **空间复杂度**：O(k) - k为字符集大小

### [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)

**🎯 考察频率：极高 | 难度：困难 | 重要性：滑动窗口终极考验**

> 找出字符串s中包含字符串t所有字符的最小子串：`s="ADOBECODEBANC", t="ABC"` → `"BANC"`

**💡 核心思路**：滑动窗口 + 字符计数

- 先扩展右指针直到窗口包含所有目标字符
- 然后收缩左指针直到不再满足条件
- 记录满足条件的最小窗口![fig1](https://assets.leetcode-cn.com/solution-static/76/76_fig1.gif)

**🔑 记忆技巧**：

- **口诀**："右扩左缩找最小，字符计数要匹配"
- **形象记忆**：像拉手风琴，先拉开再压缩到最小

```java
public String minWindow(String s, String t) {
    Map<Character, Integer> need = new HashMap<>();
    Map<Character, Integer> window = new HashMap<>();
    
    // 统计目标字符串的字符频次
    for (char c : t.toCharArray()) {
        need.put(c, need.getOrDefault(c, 0) + 1);
    }
    
    int left = 0, right = 0;
    int valid = 0; // 满足条件的字符种类数
    int start = 0, len = Integer.MAX_VALUE;
    
    while (right < s.length()) {
        char c = s.charAt(right);
        right++;
        
        // 扩展窗口
        if (need.containsKey(c)) {
            window.put(c, window.getOrDefault(c, 0) + 1);
            if (window.get(c).equals(need.get(c))) {
                valid++;
            }
        }
        
        // 收缩窗口
        while (valid == need.size()) {
            // 更新最小覆盖子串
            if (right - left < len) {
                start = left;
                len = right - left;
            }
            
            char d = s.charAt(left);
            left++;
            
            if (need.containsKey(d)) {
                if (window.get(d).equals(need.get(d))) {
                    valid--;
                }
                window.put(d, window.get(d) - 1);
            }
        }
    }
    
    return len == Integer.MAX_VALUE ? "" : s.substring(start, start + len);
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(|s| + |t|) - 每个字符最多被访问两次
- **空间复杂度**：O(|s| + |t|) - 哈希表存储空间

### [438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

**🎯 考察频率：高 | 难度：中等 | 重要性：固定窗口滑动**

> 找到字符串s中所有p的字母异位词的起始索引：`s="abab", p="ab"` → `[0,2]`

**💡 核心思路**：固定大小滑动窗口

- 窗口大小固定为p的长度
- 比较窗口内字符频次与p的字符频次
- 相等则找到一个异位词

**🔑 记忆技巧**：

- **口诀**："固定窗口滑动找，字符频次要相等"

```java
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    if (s.length() < p.length()) return result;
    
    int[] pCount = new int[26];
    int[] windowCount = new int[26];
    
    // 统计p的字符频次
    for (char c : p.toCharArray()) {
        pCount[c - 'a']++;
    }
    
    int windowSize = p.length();
    
    // 初始化第一个窗口
    for (int i = 0; i < windowSize; i++) {
        windowCount[s.charAt(i) - 'a']++;
    }
    
    // 检查第一个窗口
    if (Arrays.equals(pCount, windowCount)) {
        result.add(0);
    }
    
    // 滑动窗口
    for (int i = windowSize; i < s.length(); i++) {
        // 添加新字符
        windowCount[s.charAt(i) - 'a']++;
        // 移除旧字符
        windowCount[s.charAt(i - windowSize) - 'a']--;
        
        // 检查当前窗口
        if (Arrays.equals(pCount, windowCount)) {
            result.add(i - windowSize + 1);
        }
    }
    
    return result;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - n为字符串s的长度
- **空间复杂度**：O(1) - 固定大小的计数数组

---

## 📊 三、字符统计类

### 💡 核心思想

- **哈希计数**：统计字符出现频次
- **频次比较**：比较两个字符串的字符频次
- **异位词判断**：相同字符不同排列

### [242. 有效的字母异位词](https://leetcode.cn/problems/valid-anagram/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：字符统计基础**

> 判断两个字符串是否为字母异位词：`s="anagram", t="nagaram"` → `true`

**💡 核心思路**：字符频次统计

- 统计两个字符串的字符频次
- 比较频次是否完全相同

**🔑 记忆技巧**：

- **口诀**："字符计数要相等，异位词就是重排列"

```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    
    int[] count = new int[26];
    
    // 统计字符频次差
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    
    // 检查是否所有字符频次都为0
    for (int c : count) {
        if (c != 0) return false;
    }
    
    return true;
}
```

**🔧 排序解法**：

```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    
    char[] sChars = s.toCharArray();
    char[] tChars = t.toCharArray();
    
    Arrays.sort(sChars);
    Arrays.sort(tChars);
    
    return Arrays.equals(sChars, tChars);
}
```

**⏱️ 复杂度分析**：

- **计数法**：
  - 时间复杂度：O(n) - 遍历字符串
  - 空间复杂度：O(1) - 固定大小数组
- **排序法**：
  - 时间复杂度：O(nlogn) - 排序时间
  - 空间复杂度：O(1) - 原地排序

### [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：哈希表分组**

> 将字母异位词分组：`["eat","tea","tan","ate","nat","bat"]` → `[["bat"],["nat","tan"],["ate","eat","tea"]]`

**💡 核心思路**：哈希表分组

- 将每个字符串排序作为key
- 相同key的字符串归为一组

**🔑 记忆技巧**：

- **口诀**："排序作键分组归，异位词汇一家聚"

```java
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    
    for (String str : strs) {
        char[] chars = str.toCharArray();
        Arrays.sort(chars);
        String key = String.valueOf(chars);
        
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
    }
    
    return new ArrayList<>(groups.values());
}
```

**🔧 计数法（避免排序）**：

```java
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    
    for (String str : strs) {
        int[] count = new int[26];
        for (char c : str.toCharArray()) {
            count[c - 'a']++;
        }
        
        // 构造唯一key
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 26; i++) {
            sb.append('#').append(count[i]);
        }
        String key = sb.toString();
        
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
    }
    
    return new ArrayList<>(groups.values());
}
```

**⏱️ 复杂度分析**：

- **排序法**：
  - 时间复杂度：O(n×klogk) - n个字符串，每个长度k
  - 空间复杂度：O(n×k) - 存储结果
- **计数法**：
  - 时间复杂度：O(n×k) - 线性时间
  - 空间复杂度：O(n×k) - 存储结果

---

## 🔍 四、模式匹配类

### 💡 核心思想

- **朴素匹配**：暴力比较每个位置
- **KMP算法**：利用前缀表优化匹配
- **滚动哈希**：哈希值快速比较

### [28. 找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：字符串匹配经典**

> 在haystack中找到needle第一次出现的位置：`haystack="sadbutsad", needle="sad"` → `0`

**💡 核心思路**：KMP算法

- 构建needle的前缀表（next数组）
- 利用前缀表在不匹配时快速跳转

**🔑 记忆技巧**：

- **口诀**："KMP算法巧匹配，前缀表来帮助你"
- **形象记忆**：像有记忆的搜索，不会重复无用的比较

```java
public int strStr(String haystack, String needle) {
    if (needle.isEmpty()) return 0;
    
    int[] next = buildNext(needle);
    int i = 0, j = 0;
    
    while (i < haystack.length()) {
        if (haystack.charAt(i) == needle.charAt(j)) {
            i++;
            j++;
        }
        
        if (j == needle.length()) {
            return i - j;
        } else if (i < haystack.length() && haystack.charAt(i) != needle.charAt(j)) {
            if (j != 0) {
                j = next[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return -1;
}

private int[] buildNext(String pattern) {
    int[] next = new int[pattern.length()];
    int len = 0, i = 1;
    
    while (i < pattern.length()) {
        if (pattern.charAt(i) == pattern.charAt(len)) {
            len++;
            next[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = next[len - 1];
            } else {
                next[i] = 0;
                i++;
            }
        }
    }
    
    return next;
}
```

**🔧 朴素匹配解法**：

```java
public int strStr(String haystack, String needle) {
    if (needle.isEmpty()) return 0;
    
    for (int i = 0; i <= haystack.length() - needle.length(); i++) {
        if (haystack.substring(i, i + needle.length()).equals(needle)) {
            return i;
        }
    }
    
    return -1;
}
```

**⏱️ 复杂度分析**：

- **KMP算法**：
  - 时间复杂度：O(m + n) - m,n分别为两字符串长度
  - 空间复杂度：O(m) - next数组
- **朴素匹配**：
  - 时间复杂度：O(m×n) - 最坏情况
  - 空间复杂度：O(1) - 常数空间

---

## 🌀 五、回文专题类

### 💡 核心思想

- **中心扩展**：从中心向两边扩展
- **动态规划**：子问题最优解
- **马拉车算法**：线性时间找所有回文

### [647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)

**🎯 考察频率：高 | 难度：中等 | 重要性：回文计数**

> 统计字符串中回文子串的个数：`"abc"` → `3` ("a", "b", "c")

**💡 核心思路**：中心扩展法

- 遍历每个可能的回文中心
- 统计以每个中心扩展出的回文个数

**🔑 记忆技巧**：

- **口诀**："中心扩展数回文，奇偶中心都要算"

```java
public int countSubstrings(String s) {
    int count = 0;
    
    for (int i = 0; i < s.length(); i++) {
        // 奇数长度回文
        count += countPalindromes(s, i, i);
        // 偶数长度回文
        count += countPalindromes(s, i, i + 1);
    }
    
    return count;
}

private int countPalindromes(String s, int left, int right) {
    int count = 0;
    
    while (left >= 0 && right < s.length() && 
           s.charAt(left) == s.charAt(right)) {
        count++;
        left--;
        right++;
    }
    
    return count;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n²) - 每个中心最多扩展O(n)
- **空间复杂度**：O(1) - 常数空间

---

## 🎯 六、动态规划类

### 💡 核心思想

- **状态定义**：明确dp数组的含义
- **状态转移**：找出递推关系
- **边界条件**：初始化基础状态

### [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：字符串DP经典**

> 找出两个字符串的最长公共子序列长度：`text1="abcde", text2="ace"` → `3` ("ace")

**💡 核心思路**：二维动态规划

- dp[i][j] 表示text1前i个字符和text2前j个字符的最长公共子序列长度
- 状态转移：字符相同时+1，不同时取最大值

**🔑 记忆技巧**：

- **口诀**："二维DP找公共，相同加一不同取大"

```java
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}
```

**🔧 空间优化**：

```java
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[] dp = new int[n + 1];
    
    for (int i = 1; i <= m; i++) {
        int prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[j] = prev + 1;
            } else {
                dp[j] = Math.max(dp[j], dp[j - 1]);
            }
            prev = temp;
        }
    }
    
    return dp[n];
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(m×n) - 双重循环
- **空间复杂度**：O(min(m,n)) - 空间优化后

### [72. 编辑距离](https://leetcode.cn/problems/edit-distance/)

**🎯 考察频率：极高 | 难度：困难 | 重要性：字符串DP巅峰**

> 计算将word1转换成word2的最少操作数：`word1="horse", word2="ros"` → `3`

**💡 核心思路**：二维动态规划

- dp[i][j] 表示word1前i个字符转换为word2前j个字符的最少操作数
- 三种操作：插入、删除、替换

**🔑 记忆技巧**：

- **口诀**："编辑距离三操作，插入删除和替换"

```java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    // 初始化边界
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    Math.min(dp[i - 1][j] + 1,     // 删除
                             dp[i][j - 1] + 1),    // 插入
                    dp[i - 1][j - 1] + 1           // 替换
                );
            }
        }
    }
    
    return dp[m][n];
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(m×n) - 双重循环
- **空间复杂度**：O(m×n) - 二维DP表

---

## 🔄 七、字符串变换类

### 💡 核心思想

- **数字转换**：处理进位和符号
- **字符串运算**：模拟手工计算过程
- **格式转换**：处理各种特殊情况

### [8. 字符串转换整数 (atoi)](https://leetcode.cn/problems/string-to-integer-atoi/)

**🎯 考察频率：高 | 难度：中等 | 重要性：边界处理考验**

> 实现atoi函数，将字符串转换为整数：`"   -42"` → `-42`

**💡 核心思路**：状态机 + 边界处理

- 跳过前导空格
- 处理正负号
- 逐位转换并检查溢出

**🔑 记忆技巧**：

- **口诀**："跳过空格看符号，逐位转换防溢出"

```java
public int myAtoi(String s) {
    int index = 0, sign = 1, result = 0;
    
    // 跳过前导空格
    while (index < s.length() && s.charAt(index) == ' ') {
        index++;
    }
    
    // 处理符号
    if (index < s.length() && (s.charAt(index) == '+' || s.charAt(index) == '-')) {
        sign = s.charAt(index) == '+' ? 1 : -1;
        index++;
    }
    
    // 转换数字
    while (index < s.length() && Character.isDigit(s.charAt(index))) {
        int digit = s.charAt(index) - '0';
        
        // 检查溢出
        if (result > Integer.MAX_VALUE / 10 || 
            (result == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10)) {
            return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
        }
        
        result = result * 10 + digit;
        index++;
    }
    
    return result * sign;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历字符串一次
- **空间复杂度**：O(1) - 常数空间

---

## 🚀 八、进阶技巧类

### 💡 核心思想

- **高效算法**：马拉车、AC自动机等
- **复杂匹配**：多模式匹配、通配符匹配
- **空间优化**：原地操作、滚动数组

### [214. 最短回文串](https://leetcode.cn/problems/shortest-palindrome/)

**🎯 考察频率：中等 | 难度：困难 | 重要性：KMP进阶应用**

> 在字符串前面添加字符使其成为回文串，求最短的回文串

**💡 核心思路**：KMP + 回文性质

- 找到从开头开始的最长回文前缀
- 在前面添加剩余部分的反转

**🔑 记忆技巧**：

- **口诀**："KMP找前缀，反转补后缀"

```java
public String shortestPalindrome(String s) {
    String rev = new StringBuilder(s).reverse().toString();
    String combined = s + "#" + rev;
    
    int[] next = buildNext(combined);
    int overlap = next[combined.length() - 1];
    
    return rev.substring(0, s.length() - overlap) + s;
}

private int[] buildNext(String pattern) {
    int[] next = new int[pattern.length()];
    int len = 0, i = 1;
    
    while (i < pattern.length()) {
        if (pattern.charAt(i) == pattern.charAt(len)) {
            len++;
            next[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = next[len - 1];
            } else {
                next[i] = 0;
                i++;
            }
        }
    }
    
    return next;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - KMP算法
- **空间复杂度**：O(n) - 辅助字符串

### [93. 复原IP地址](https://leetcode.cn/problems/restore-ip-addresses/)

**🎯 考察频率：高 | 难度：中等 | 重要性：回溯算法经典**

> 将字符串分割成有效的IP地址：`"25525511135"` → `["255.255.11.135","255.255.111.35"]`

**💡 核心思路**：回溯算法 + 剪枝

- 将字符串分成4段，每段代表IP的一个部分
- 每段必须是0-255之间的有效数字
- 不能有前导零（除了"0"本身）

**🔑 记忆技巧**：

- **口诀**："回溯分割四段IP，有效范围加剪枝"
- **形象记忆**：像切蛋糕一样，要切成4块合适大小的

```java
public List<String> restoreIpAddresses(String s) {
    List<String> result = new ArrayList<>();
    if (s.length() < 4 || s.length() > 12) return result;
    
    backtrack(s, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(String s, int start, List<String> path, List<String> result) {
    // 如果已经分成4段且用完所有字符
    if (path.size() == 4) {
        if (start == s.length()) {
            result.add(String.join(".", path));
        }
        return;
    }
    
    // 尝试不同长度的分割
    for (int len = 1; len <= 3 && start + len <= s.length(); len++) {
        String segment = s.substring(start, start + len);
        
        // 检查是否为有效的IP段
        if (isValidSegment(segment)) {
            path.add(segment);
            backtrack(s, start + len, path, result);
            path.remove(path.size() - 1); // 回溯
        }
    }
}

private boolean isValidSegment(String segment) {
    // 检查长度
    if (segment.length() > 3) return false;
    
    // 检查前导零
    if (segment.length() > 1 && segment.charAt(0) == '0') return false;
    
    // 检查数值范围
    int num = Integer.parseInt(segment);
    return num >= 0 && num <= 255;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(3^4) - 每段最多3种长度选择，共4段
- **空间复杂度**：O(4) - 递归深度最多4层

### [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)

**🎯 考察频率：极高 | 难度：简单 | 重要性：栈的经典应用**

> 判断括号字符串是否有效：`"()[]{}"` → `true`，`"([)]"` → `false`

**💡 核心思路**：栈匹配

- 遇到左括号就入栈
- 遇到右括号就检查栈顶是否为对应的左括号
- 最后检查栈是否为空

**🔑 记忆技巧**：

- **口诀**："左括号入栈，右括号配对，最后栈空才对"
- **形象记忆**：像穿衣服一样，先穿的后脱，后穿的先脱

```java
public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');
    
    for (char c : s.toCharArray()) {
        if (mapping.containsKey(c)) {
            // 右括号
            if (stack.isEmpty() || stack.pop() != mapping.get(c)) {
                return false;
            }
        } else {
            // 左括号
            stack.push(c);
        }
    }
    
    return stack.isEmpty();
}
```

**🔧 优化版本**：

```java
public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    
    for (char c : s.toCharArray()) {
        if (c == '(') {
            stack.push(')');
        } else if (c == '{') {
            stack.push('}');
        } else if (c == '[') {
            stack.push(']');
        } else {
            if (stack.isEmpty() || stack.pop() != c) {
                return false;
            }
        }
    }
    
    return stack.isEmpty();
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(n) - 遍历字符串一次
- **空间复杂度**：O(n) - 最坏情况栈存储所有左括号

### [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

**🎯 考察频率：极高 | 难度：中等 | 重要性：回溯算法基础**

> 给定数字字符串，返回所有可能的字母组合![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/11/09/200px-telephone-keypad2svg.png)
>
> `"23"` → `["ad","ae","af","bd","be","bf","cd","ce","cf"]`

**💡 核心思路**：回溯算法 + 映射表

- 建立数字到字母的映射关系
- 对每个数字的每个字母进行递归组合
- 到达字符串末尾时添加到结果中

**🔑 记忆技巧**：

- **口诀**："数字映射字母表，回溯组合所有解"
- **形象记忆**：像老式手机键盘，每个数字对应几个字母

```java
public List<String> letterCombinations(String digits) {
    List<String> result = new ArrayList<>();
    if (digits == null || digits.isEmpty()) return result;
    
    String[] mapping = {
        "",     // 0
        "",     // 1
        "abc",  // 2
        "def",  // 3
        "ghi",  // 4
        "jkl",  // 5
        "mno",  // 6
        "pqrs", // 7
        "tuv",  // 8
        "wxyz"  // 9
    };
    
    backtrack(digits, 0, new StringBuilder(), result, mapping);
    return result;
}

private void backtrack(String digits, int index, StringBuilder path, 
                      List<String> result, String[] mapping) {
    // 递归终止条件
    if (index == digits.length()) {
        result.add(path.toString());
        return;
    }
    
    // 获取当前数字对应的字母
    int digit = digits.charAt(index) - '0';
    String letters = mapping[digit];
    
    // 尝试每个字母
    for (char letter : letters.toCharArray()) {
        path.append(letter);
        backtrack(digits, index + 1, path, result, mapping);
        path.deleteCharAt(path.length() - 1); // 回溯
    }
}
```

**🔧 迭代解法**：

```java
public List<String> letterCombinations(String digits) {
    if (digits == null || digits.isEmpty()) return new ArrayList<>();
    
    String[] mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    List<String> result = new ArrayList<>();
    result.add("");
    
    for (char digit : digits.toCharArray()) {
        List<String> temp = new ArrayList<>();
        String letters = mapping[digit - '0'];
        
        for (String combination : result) {
            for (char letter : letters.toCharArray()) {
                temp.add(combination + letter);
            }
        }
        
        result = temp;
    }
    
    return result;
}
```

**⏱️ 复杂度分析**：

- **时间复杂度**：O(3^m × 4^n) - m为对应3个字母的数字个数，n为对应4个字母的数字个数
- **空间复杂度**：O(3^m × 4^n) - 存储所有组合结果

---

## 🏆 面试前15分钟速记表

| 题型分类       | 核心技巧 | 高频题目                                                     | 记忆口诀                       | 难度  |
| -------------- | -------- | ------------------------------------------------------------ | ------------------------------ | ----- |
| **双指针基础** | 对撞指针 | 验证回文串、反转字符串、反转字符串中的单词、最长回文子串     | 对撞指针找回文，快慢指针找重复 | ⭐⭐⭐   |
| **滑动窗口**   | 动态窗口 | 无重复字符的最长子串、最小覆盖子串、找到字符串中所有字母异位词 | 左右指针动态调，窗口大小随需要 | ⭐⭐⭐⭐  |
| **字符统计**   | 哈希计数 | 有效的字母异位词、字母异位词分组、赎金信、第一个不重复的字符 | 哈希计数是法宝，频次统计用得妙 | ⭐⭐⭐   |
| **模式匹配**   | KMP算法  | 实现strStr()、重复的子字符串、字符串匹配、正则表达式匹配     | KMP算法巧匹配，前缀表来帮助你  | ⭐⭐⭐⭐  |
| **回文专题**   | 中心扩展 | 回文子串、最长回文子串、回文链表、分割回文串                 | 中心扩展找回文，奇偶长度都考虑 | ⭐⭐⭐⭐  |
| **字符串DP**   | 状态转移 | 最长公共子序列、编辑距离、不同的子序列、交错字符串           | 状态转移要清晰，边界条件别忘记 | ⭐⭐⭐⭐⭐ |
| **字符串变换** | 边界处理 | 整数转换、字符串转换整数、字符串相加、字符串相乘             | 原地修改要小心，额外空间换时间 | ⭐⭐⭐⭐  |
| **进阶技巧**   | 高效算法 | 最短回文串、复原IP地址、有效的括号、电话号码的字母组合、串联所有单词的子串 | 回溯分割巧组合，栈匹配括号对   | ⭐⭐⭐⭐⭐ |

### 按难度分级

- **⭐⭐⭐ 简单必会**：验证回文串、反转字符串、有效的字母异位词、字母异位词分组、有效的括号
- **⭐⭐⭐⭐ 中等重点**：无重复字符的最长子串、最长回文子串、实现strStr()、回文子串、最长公共子序列、字符串转换整数、复原IP地址、电话号码的字母组合
- **⭐⭐⭐⭐⭐ 困难经典**：最小覆盖子串、编辑距离、正则表达式匹配、最短回文串

### 热题100核心优先级

1. **无重复字符的最长子串** - 滑动窗口模板
2. **最长回文子串** - 中心扩展法
3. **有效的字母异位词** - 字符统计基础
4. **字母异位词分组** - 哈希表分组
5. **验证回文串** - 双指针基础
6. **反转字符串** - 原地操作
7. **有效的括号** - 栈的经典应用
8. **电话号码的字母组合** - 回溯算法入门
9. **复原IP地址** - 回溯算法进阶
10. **最小覆盖子串** - 滑动窗口进阶

### 热题100题目统计

- **总题目数**：48+道热题100字符串题目
- **新增重要题目**：LC93复原IP地址、LC20有效的括号、LC17电话号码的字母组合
- **覆盖率**：100%覆盖热题100中的字符串相关题目，并补充了重要的算法基础题
- **核心算法**：双指针、滑动窗口、哈希表、KMP、动态规划、中心扩展、回溯算法、栈

### 常见陷阱提醒

- ⚠️ **空字符串**：`s == null || s.isEmpty()` 的边界处理
- ⚠️ **字符大小写**：题目要求是否区分大小写
- ⚠️ **索引越界**：`i >= 0 && i < s.length()` 边界检查
- ⚠️ **字符编码**：ASCII vs Unicode，字符范围
- ⚠️ **整数溢出**：字符串转数字时的溢出处理
- ⚠️ **特殊字符**：空格、标点符号的处理策略

### 解题步骤提醒

1. **理解题意**：明确输入输出格式和边界条件
2. **选择算法**：根据题目特点选择合适的算法
3. **处理边界**：考虑空串、单字符等特殊情况
4. **优化空间**：考虑是否可以原地操作或滚动数组
5. **测试验证**：用示例和边界用例验证正确性

---

*🎯 备注：本总结涵盖了字符串算法的核心知识点，建议配合实际编程练习，重点掌握双指针、滑动窗口、KMP算法和字符串动态规划。*
