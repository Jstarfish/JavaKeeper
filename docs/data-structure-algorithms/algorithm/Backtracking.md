---
title: 回溯算法
date: 2023-05-09
tags: 
 - back tracking
categories: Algorithm
---

![](https://img.starfish.ink/leetcode/backtracking-banner.png)

> 「回溯算法」是解决很多算法问题的常见思想，它也是传统的人工智能的方法，其本质是 **在树形问题中寻找解** 。
>
> 回溯算法实际上一个类似枚举的搜索尝试过程，主要是在搜索尝试过程中寻找问题的解，当发现已不满足求解条件时，就“回溯”返回，尝试别的路径。所以也可以叫做**回溯搜索法**。
>
> 回溯是递归的副产品，只要有递归就会有回溯。

# 一、回溯算法

## 基本思想

**回溯法** 采用试错的思想，它尝试分步的去解决一个问题。

回溯算法（Backtracking）是一种系统地搜索解问题空间的算法，主要用于解决组合问题。

其基本思想是通过构建一个问题的解空间树（Solution Space Tree），逐步构造候选解，并在构造过程中判断候选解是否满足约束条件。如果满足，则继续向下构造；如果不满足，则回溯（Backtrack）到上一步，尝试其他候选解。

回溯法通常用最简单的递归方法来实现，在反复重复上述的步骤后可能出现两种情况：

- 找到一个可能存在的正确的答案；
- 在尝试了所有可能的分步方法后宣告该问题没有答案。



我刚开始学习「回溯算法」的时候觉得很抽象，一直不能理解为什么 **递归之后需要做和递归之前相同的逆向操作**，在做了很多相关的问题以后，我发现其实「回溯算法」与「 **深度优先遍历** 」有着千丝万缕的联系。

> **深度优先搜索** 算法（英语：Depth-First-Search，DFS）是一种用于遍历或搜索树或图的算法。这个算法会 **尽可能深** 的搜索树的分支。当结点 `v` 的所在边都己被探寻过，搜索将 **回溯** 到发现结点 `v` 的那条边的起始结点。这一过程一直进行到已发现从源结点可达的所有结点为止。如果还存在未被发现的结点，则选择其中一个作为源结点并重复以上过程，整个进程反复进行直到所有结点都被访问为止。

回溯法，一般可以解决如下几种问题：

- 组合问题：N个数里面按一定规则找出k个数的集合
- 切割问题：一个字符串按一定规则有几种切割方式
- 子集问题：一个N个数的集合里有多少符合条件的子集
- 排列问题：N个数按一定规则全排列，有几种排列方式
- 棋盘问题：N皇后，解数独等等



## 回溯算法的基本框架

回溯算法的基本框架可以用递归来实现，通常包含以下几个步骤：

1. **选择和扩展**：选择一个可行的扩展步骤，扩展当前的解。
2. **约束检查**：检查当前扩展后的解是否满足问题的约束条件。
3. **递归调用**：如果当前解满足约束条件，则递归地尝试扩展该解。
4. **回溯**：如果当前解不满足约束条件，或所有扩展步骤都已经尝试，则回溯到上一步，尝试其他可能的扩展步骤。

以下是回溯算法的一般伪代码：

```java
result = []
function backtrack(solution, candidates):  //入参可以理解为 路径, 选择列表
    if solution 是一个完整解:  //满足结束条件
        result.add(solution)  // 处理当前完整解
        return
    for candidate in candidates:
        if candidate 满足约束条件:
            solution.add(candidate)  // 扩展解
            backtrack(solution, new_candidates)  // 递归调用
            solution.remove(candidate)  // 回溯,撤销选择

```

**其核心就是 for 循环里面的递归，在递归调用之前「做选择」，在递归调用之后「撤销选择」**



# 二、热门面试题

## 排列、组合类

> 无论是排列、组合还是子集问题，简单说无非就是让你从序列 `nums` 中以给定规则取若干元素，主要有以下几种变体：
>
> **元素无重不可复选，即 `nums` 中的元素都是唯一的，每个元素最多只能被使用一次，这也是最基本的形式**。
>
> - 以组合为例，如果输入 `nums = [2,3,6,7]`，和为 7 的组合应该只有 `[7]`。
>
> **元素可重不可复选，即 `nums` 中的元素可以存在重复，每个元素最多只能被使用一次**。
>
> - 以组合为例，如果输入 `nums = [2,5,2,1,2]`，和为 7 的组合应该有两种 `[2,2,2,1]` 和 `[5,2]`。
>
> **元素无重可复选，即 `nums` 中的元素都是唯一的，每个元素可以被使用若干次**。
>
> - 以组合为例，如果输入 `nums = [2,3,6,7]`，和为 7 的组合应该有两种 `[2,2,3]` 和 `[7]`。
>
> 当然，也可以说有第四种形式，即元素可重可复选。但既然元素可复选，那又何必存在重复元素呢？元素去重之后就等同于形式三，所以这种情况不用考虑。
>
> 上面用组合问题举的例子，但排列、组合、子集问题都可以有这三种基本形式，所以共有 9 种变化。
>
> 除此之外，题目也可以再添加各种限制条件，比如让你求和为 `target` 且元素个数为 `k` 的组合，那这么一来又可以衍生出一堆变体，怪不得面试笔试中经常考到排列组合这种基本题型。
>
> **但无论形式怎么变化，其本质就是穷举所有解，而这些解呈现树形结构，所以合理使用回溯算法框架，稍改代码框架即可把这些问题一网打尽**。



### 一、元素无重不可复选

#### [子集_78](https://leetcode.cn/problems/subsets/)

> 给你一个整数数组 `nums` ，数组中的元素 **互不相同** 。返回该数组所有可能的子集（幂集）。
>
> 解集 **不能** 包含重复的子集。你可以按 **任意顺序** 返回解集。
>
> ```
> 输入：nums = [1,2,3]
> 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
> ```

思路：

**子集的特性**：

- 对于给定的数组 `[1, 2, 3]`，它的所有子集应该包括空集、单个元素的子集、两个元素的组合和完整数组。
- 每个元素都有两种选择：要么加入子集，要么不加入子集。

**回溯算法**：

- 使用回溯的方式可以从空集开始，逐步添加元素来生成所有子集。
- 从当前的元素出发，尝试包含它或者不包含它，然后递归地处理下一个元素。

参数定义：

- `res`：一个列表，存储最终的所有子集，类型是 `List<List<Integer>>`。

- `track`：一个临时列表，记录当前路径（即当前递归中形成的子集）。
-  `start`：当前递归要开始的位置（即考虑从哪个位置开始生成子集）。这个 `start` 是非常重要的，它确保了我们在递归时不会重复生成相同的子集。

完成回溯树的遍历就收集了所有子集。

![](https://img.starfish.ink/leetcode/leetcode-78.png)

```java
class Solution {

    List<List<Integer>> res = new LinkedList<>();
    // 记录回溯算法的递归路径
    LinkedList<Integer> track = new LinkedList<>();

    // 主函数
    public List<List<Integer>> subsets(int[] nums) {
        backtrack(nums, 0);
        return res;
    }

    // 回溯算法核心函数，遍历子集问题的回溯树
    void backtrack(int[] nums, int start) {

        // 前序位置，每个节点的值都是一个子集
        res.add(new LinkedList<>(track));
        
        // 回溯算法标准框架
        for (int i = start; i < nums.length; i++) {
            // 做选择
            track.addLast(nums[i]);
            // 通过 start 参数控制树枝的遍历，避免产生重复的子集
            backtrack(nums, i + 1);
            // 撤销选择
            track.removeLast();
        }
    }
}
```



#### [组合_77](https://leetcode.cn/problems/combinations/)

> 给定两个整数 `n` 和 `k`，返回范围 `[1, n]` 中所有可能的 `k` 个数的组合。你可以按 **任何顺序** 返回答案。
>
> ```
> 输入：n = 4, k = 2
> 输出：
> [
> [2,4],
> [3,4],
> [2,3],
> [1,2],
> [1,3],
> [1,4],
> ]
> ```

思路：翻译一下就变成子集问题了：**给你输入一个数组 `nums = [1,2..,n]` 和一个正整数 `k`，请你生成所有大小为 `k` 的子集**。

![](https://img.starfish.ink/leetcode/leetcode-77.png)

反映到代码上，只需要稍改 base case，控制算法仅仅收集第 `k` 层节点的值即可：

```java
class Solution {

    List<List<Integer>> res = new LinkedList<>();
    // 记录回溯算法的递归路径
    LinkedList<Integer> track = new LinkedList<>();

    // 主函数
    public List<List<Integer>> combine(int n, int k) {
        // start 从 1 开始即可
        backtrack(1, n, k);
        return res;
    }

    void backtrack(int start, int n, int k) {
        // base case
        if (k == track.size()) {
            // 遍历到了第 k 层，收集当前节点的值
            res.add(new LinkedList<>(track));
            return;
        }
        
        // 回溯算法标准框架
        for (int i = start; i <= n; i++) {
            // 选择
            track.addLast(i);
            // 通过 start 参数控制树枝的遍历，避免产生重复的子集
            backtrack(i + 1, n, k);
            // 撤销选择
            track.removeLast();
        }
    }
}
```



#### [全排列_46](https://leetcode.cn/problems/permutations/description/)

> 给定一个不含重复数字的数组 `nums` ，返回其 *所有可能的全排列* 。你可以 **按任意顺序** 返回答案。
>
> ```
> 输入：nums = [1,2,3]
> 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
> ```

思路：组合/子集问题使用 `start` 变量保证元素 `nums[start]` 之后只会出现 `nums[start+1..]`中的元素，通过固定元素的相对位置保证不出现重复的子集。

**但排列问题本身就是让你穷举元素的位置，`nums[i]` 之后也可以出现 `nums[i]` 左边的元素，所以之前的那一套玩不转了，需要额外使用 `used` 数组来标记哪些元素还可以被选择**。

全排列共有 `n!` 个，我们可以按阶乘举例的思想，画出「回溯树」

![](https://img.starfish.ink/leetcode/leetcode-46.png)

> 回溯树是一种树状结构，树的每个节点表示一个状态（即当前的选择或部分解），树的每条边表示一次决策的选择。在回溯过程中，我们从根节点开始，递归地选择下一个数字，每次递归都相当于进入树的下一层。

> **东哥称为 决策树，你在每个节点上其实都在做决策**。因为比如你选了 2 之后，只能再选 1 或者 3，全排列是不允许重复使用数字的。**`[2]` 就是「路径」，记录你已经做过的选择；`[1,3]` 就是「选择列表」，表示你当前可以做出的选择；「结束条件」就是遍历到树的底层叶子节点，这里也就是选择列表为空的时候**。

```java
class Solution {
    List<List<Integer>> res = new LinkedList<>();

    /* 主函数，输入一组不重复的数字，返回它们的全排列 */
    List<List<Integer>> permute(int[] nums) {
        // 记录「路径」
        LinkedList<Integer> track = new LinkedList<>();
        // 「路径」中的元素会被标记为 true，避免重复使用
        boolean[] used = new boolean[nums.length];
        
        backtrack(nums, track, used);
        return res;
    }

    // 路径：记录在 track 中
    // 选择列表：nums 中不存在于 track 的那些元素（used[i] 为 false）
    // 结束条件：nums 中的元素全都在 track 中出现
    void backtrack(int[] nums, LinkedList<Integer> track, boolean[] used) {
        // 触发结束条件
        if (track.size() == nums.length) {
            res.add(new LinkedList(track));
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            // 排除不合法的选择
            if (used[i]) {
                // nums[i] 已经在 track 中，跳过
                continue;
            }
            // 做选择
            track.add(nums[i]);
            used[i] = true;
            System.out.println("递归之前-》" + track);
            // 进入下一层决策树
            backtrack(nums, track, used);
            // 取消选择
            track.removeLast();
            used[i] = false;
           System.out.println("递归之后-》" + track);
        }
    }
}
```



### 二、元素可重不可复选

#### [子集 II_90](https://leetcode.cn/problems/subsets-ii/) 

> 给你一个整数数组 `nums` ，其中可能包含重复元素，请你返回该数组所有可能的 子集（幂集）。
>
> 解集 **不能** 包含重复的子集。返回的解集中，子集可以按 **任意顺序** 排列。
>
> ```
> 输入：nums = [1,2,2]
> 输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]
> ```

思路：该问题的关键是**去重**（剪枝），**体现在代码上，需要先进行排序，让相同的元素靠在一起，如果发现 `nums[i] == nums[i-1]`，则跳过**

```java
class Solution {

    List<List<Integer>> res = new LinkedList<>();
    LinkedList<Integer> track = new LinkedList<>();

    public List<List<Integer>> subsetsWithDup(int[] nums) {
        // 先排序，让相同的元素靠在一起
        Arrays.sort(nums);
        backtrack(nums, 0);
        return res;
    }

    void backtrack(int[] nums, int start) {
        // 前序位置，每个节点的值都是一个子集
        res.add(new LinkedList<>(track));
        
        for (int i = start; i < nums.length; i++) {
            // 剪枝逻辑，值相同的相邻树枝，只遍历第一条
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }
            track.addLast(nums[i]);
            backtrack(nums, i + 1);
            track.removeLast();
        }
    }
}
```



#### [组合总和 II_40](https://leetcode.cn/problems/combination-sum-ii/)

> 给定一个候选人编号的集合 `candidates` 和一个目标数 `target` ，找出 `candidates` 中所有可以使数字和为 `target` 的组合。
>
> `candidates` 中的每个数字在每个组合中只能使用 **一次** 。
>
> **注意：**解集不能包含重复的组合。 
>
> ```
> 输入: candidates = [10,1,2,7,6,1,5], target = 8,
> 输出:
> [
> [1,1,6],
> [1,2,5],
> [1,7],
> [2,6]
> ]
> ```

思路：说这是一个组合问题，其实换个问法就变成子集问题了：请你计算 `candidates` 中所有和为 `target` 的子集。

1. **排序**：首先对 `candidates` 数组进行排序，排序后的数组方便处理重复数字。
2. **递归选择**：在递归过程中，确保如果当前数字和上一个数字相同，且上一个数字没有被选择过，则跳过当前数字，从而避免重复组合。
3. **递归终止条件**：如果 `target` 变为 0，表示找到了一个符合条件的组合；如果 `target` 小于 0，表示当前路径不合法，应该回溯。

可以额外用一个 `trackSum` 变量记录回溯路径上的元素和，或者做减法，target == 0 递归结束也可以。

```java
class Solution {

    List<List<Integer>> res = new LinkedList<>();
    // 记录回溯的路径
    LinkedList<Integer> track = new LinkedList<>();
    // 记录 track 中的元素之和
    int trackSum = 0;

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        if (candidates.length == 0) {
            return res;
        }
        // 先排序，让相同的元素靠在一起
        Arrays.sort(candidates);
        backtrack(candidates, 0, target);
        return res;
    }

    // 回溯算法主函数
    void backtrack(int[] nums, int start, int target) {
        // base case，达到目标和，找到符合条件的组合
        if (trackSum == target) {
            res.add(new LinkedList<>(track));
            return;
        }
        // base case，超过目标和，直接结束
        if (trackSum > target) {
            return;
        }

        // 回溯算法标准框架
        for (int i = start; i < nums.length; i++) {
            // 剪枝逻辑，值相同的树枝，只遍历第一条
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }
            // 做选择
            track.add(nums[i]);
            trackSum += nums[i];
            // 递归遍历下一层回溯树
            backtrack(nums, i + 1, target);
            // 撤销选择
            track.removeLast();
            trackSum -= nums[i];
        }
    }
}
```



#### [全排列 II_47](https://leetcode.cn/problems/permutations-ii/)

> 给定一个可包含重复数字的序列 `nums` ，***按任意顺序*** 返回所有不重复的全排列。
>
> ```
> 输入：nums = [1,1,2]
> 输出：
> [[1,1,2],
>  [1,2,1],
>  [2,1,1]]
> ```

思路：典型的回溯

1. **排序**：首先对 `nums` 进行排序。

2. **回溯生成排列**：

   - 递归生成排列时，每次递归时选择一个数字。

   - 如果选择了当前数字，递归处理下一个数字。

   - 每次递归前，判断是否跳过重复数字。

3. **记录结果**：每当一个排列完成时，将其加入结果中。

```java
class Solution {

    List<List<Integer>> res = new LinkedList<>();
    LinkedList<Integer> track = new LinkedList<>();
    boolean[] used;

    public List<List<Integer>> permuteUnique(int[] nums) {
        // 先排序，让相同的元素靠在一起
        Arrays.sort(nums);
        used = new boolean[nums.length];
        backtrack(nums);
        return res;
    }

    void backtrack(int[] nums) {
        if (track.size() == nums.length) {
            res.add(new LinkedList(track));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) {
                continue;
            }
            // 新添加的剪枝逻辑，固定相同的元素在排列中的相对位置
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) {
                continue;
            }
            track.add(nums[i]);
            used[i] = true;
            backtrack(nums);
            track.removeLast();
            used[i] = false;
        }
    }
}
```



### 三、元素无重复可复选

输入数组无重复元素，但每个元素可以被无限次使用

#### [组合总和_39](https://leetcode.cn/problems/combination-sum/)

> 给你一个 **无重复元素** 的整数数组 `candidates` 和一个目标整数 `target` ，找出 `candidates` 中可以使数字和为目标数 `target` 的 所有 **不同组合** ，并以列表形式返回。你可以按 **任意顺序** 返回这些组合。
>
> `candidates` 中的 **同一个** 数字可以 **无限制重复被选取** 。如果至少一个数字的被选数量不同，则两种组合是不同的。 
>
> 对于给定的输入，保证和为 `target` 的不同组合数少于 `150` 个。
>
> ```
> 输入：candidates = [2,3,6,7], target = 7
> 输出：[[2,2,3],[7]]
> 解释：
> 2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
> 7 也是一个候选， 7 = 7 。
> 仅有这两种组合。
> ```

思路：**元素无重可复选，即 `nums` 中的元素都是唯一的，每个元素可以被使用若干次**，只要删掉去重逻辑即可

```java
class Solution {

    List<List<Integer>> res = new LinkedList<>();
    // 记录回溯的路径
    LinkedList<Integer> track = new LinkedList<>();
    // 记录 track 中的路径和
    int trackSum = 0;

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        if (candidates.length == 0) {
            return res;
        }
        backtrack(candidates, 0, target);
        return res;
    }

    // 回溯算法主函数
    void backtrack(int[] nums, int start, int target) {
        // base case，找到目标和，记录结果
        if (trackSum == target) {
            res.add(new LinkedList<>(track));
            return;
        }
        // base case，超过目标和，停止向下遍历
        if (trackSum > target) {
            return;
        }
        // 回溯算法标准框架
        for (int i = start; i < nums.length; i++) {
            // 选择 nums[i]
            trackSum += nums[i];
            track.add(nums[i]);
            // 递归遍历下一层回溯树
            backtrack(nums, i, target);
            // 同一元素可重复使用，注意参数
            // 撤销选择 nums[i]
            trackSum -= nums[i];
            track.removeLast();
        }
    }
}
```



## 其他问题

### [电话号码的字母组合_17](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

> 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。
>
> 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
>
> ![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/11/09/200px-telephone-keypad2svg.png)
>
> ```
> 输入：digits = "23"
> 输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
> ```

思路：回溯，递归地尝试每一位数字对应的所有字母，直到找出所有有效的组合

首先，我们需要将每个数字 2 到 9 映射到其对应的字母

**递归终止条件**：当当前组合的长度与输入的数字字符串长度相同，就说明我们已经得到了一个有效的组合，可以将其加入结果集。

![](http://img.starfish.ink/leetcode/leetcode-letterCombinations.png)

```java
class Solution {
    List<String> result = new ArrayList<>();
    StringBuilder track = new StringBuilder();
    public List<String> letterCombinations(String digits) {

        if(digits == null || digits.length() < 1){
            return result;
        }

        //也可以用数组做映射
        Map<Character,String> digitToLetters = new HashMap<>();
        digitToLetters.put('2', "abc");
        digitToLetters.put('3', "def");
        digitToLetters.put('4', "ghi");
        digitToLetters.put('5', "jkl");
        digitToLetters.put('6', "mno");
        digitToLetters.put('7', "pqrs");
        digitToLetters.put('8', "tuv");
        digitToLetters.put('9', "wxyz");

        backtrack(digits, 0, digitToLetters);
        return result;
    }

    private void backtrack(String digits, int index, Map<Character, String> digitToLetters) {
        if(index == digits.length()){
            result.add(track.toString());
            return;
        }
        // 获取当前数字对应的字母
        String letters = digitToLetters.get(digits.charAt(index));
        for (char letter : letters.toCharArray()) {
            //选择一个字母
            track.append(letter);
            backtrack(digits, index + 1, digitToLetters);
            track.deleteCharAt(track.length() - 1);
        }

    }
}
```



### [括号生成_22](https://leetcode.cn/problems/generate-parentheses/)

> 数字 `n` 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。
>
> ```
> 输入：n = 3
> 输出：["((()))","(()())","(())()","()(())","()()()"]
> ```

思路：

![](http://img.starfish.ink/leetcode/leetcode-generate-parentheses.png)

```java
class Solution {
    // 回溯过程中的路径
    StringBuilder track = new StringBuilder();
    // 记录所有合法的括号组合
    List<String> res = new ArrayList<>();

    public List<String> generateParenthesis(int n) {
        if (n == 0) return res;
        // 可用的左括号和右括号数量初始化为 n
        backtrack(n, n);
        return res;
    }

    // 可用的左括号数量为 left 个，可用的右括号数量为 right 个
    private void backtrack(int left, int right) {
        // 若左括号剩下的多，说明不合法
        if (right < left) return;
        // 数量小于 0 肯定是不合法的
        if (left < 0 || right < 0) return;
        // 当所有括号都恰好用完时，得到一个合法的括号组合
        if (left == 0 && right == 0) {
            res.add(track.toString());
            return;
        }

        // 做选择，尝试放一个左括号
        track.append('(');
        backtrack(left - 1, right);
        // 撤消选择
        track.deleteCharAt(track.length() - 1);

        // 做选择，尝试放一个右括号
        track.append(')');
        backtrack(left, right - 1);
        // 撤销选择
        track.deleteCharAt(track.length() - 1);
    }
}
```

dfs 思路：由于一共要填 2n 个括号，那么当我们递归到终点时：

- 如果左括号少于 n 个，那么右括号也会少于 n 个，与 i == m 矛盾，因为每填一个括号 i 都会增加 1。
- 如果左括号超过 n 个，与 if open < n 矛盾，这行代码限制了左括号至多填 n 个。
- 所以递归到终点时，左括号恰好填了 n 个，此时右括号填了 2n−n=n 个。

```java
class Solution {
    private int n;
    private char[] path;
    private final List<String> ans = new ArrayList<>();

    public List<String> generateParenthesis(int n) {
        this.n = n;
        path = new char[n * 2]; // 所有括号长度都是一样的 n*2
        dfs(0, 0);
        return ans;
    }

    // i=目前填了多少个括号
    // open=左括号个数，i-open=右括号个数
    private void dfs(int i, int open) {
        if (i == n * 2) { // 括号构造完毕
            ans.add(new String(path)); // 加入答案
            return;
        }
        if (open < n) { // 可以填左括号
            path[i] = '('; // 直接覆盖
            dfs(i + 1, open + 1); // 多了一个左括号
        }
        if (i - open < open) { // 可以填右括号
            path[i] = ')'; // 直接覆盖
            dfs(i + 1, open);
        }
    }
}
```



### [N 皇后_51](https://leetcode.cn/problems/n-queens/)

> 按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。
>
> **n 皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。
>
> 给你一个整数 `n` ，返回所有不同的 **n 皇后问题** 的解决方案。
>
> 每一种解法包含一个不同的 **n 皇后问题** 的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。
>
> **示例 1：**
>
> ![img](https://assets.leetcode.com/uploads/2020/11/13/queens.jpg)
>
> ```
> 输入：n = 4
> 输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
> 解释：如上图所示，4 皇后问题存在两个不同的解法。
> ```

```java
class Solution {
    List<List<String>> res = new ArrayList<>();

    /* 输入棋盘边长 n，返回所有合法的放置 */
    public List<List<String>> solveNQueens(int n) {
        // '.' 表示空，'Q' 表示皇后，初始化空棋盘
        List<String> board = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) {
                sb.append('.');
            }
            board.add(sb.toString());
        }
        backtrack(board, 0);
        return res;
    }

    // 路径：board 中小于 row 的那些行都已经成功放置了皇后
    // 选择列表：第 row 行的所有列都是放置皇后的选择
    // 结束条件：row 超过 board 的最后一行
    void backtrack(List<String> board, int row) {
        // 触发结束条件
        if (row == board.size()) {
            res.add(new ArrayList<>(board));
            return;
        }
        
        int n = board.get(row).length();
        for (int col = 0; col < n; col++) {
            // 排除不合法选择
            if (!isValid(board, row, col)) {
                continue;
            }
            // 做选择
            StringBuilder sb = new StringBuilder(board.get(row));
            sb.setCharAt(col, 'Q');
            board.set(row, sb.toString());

            // 进入下一行决策
            backtrack(board, row + 1);
            // 撤销选择
            sb.setCharAt(col, '.');
            board.set(row, sb.toString());
        }
    }

    /* 是否可以在 board[row][col] 放置皇后？ */
    boolean isValid(List<String> board, int row, int col) {
        int n = board.size();

        /* 检查列是否有皇后互相冲突 */
        for (int i = 0; i < n; i++) {
            if (board.get(i).charAt(col) == 'Q') {
                return false;
            }
        }

        /* 检查右上方是否有皇后互相冲突 */
        for (int i = row - 1, j = col + 1;
             i >= 0 && j < n; i--, j++) {
            if (board.get(i).charAt(j) == 'Q') {
                return false;
            }
        }

        /* 检查左上方是否有皇后互相冲突 */
        for (int i = row - 1, j = col - 1;
             i >= 0 && j >= 0; i--, j--) {
            if (board.get(i).charAt(j) == 'Q') {
                return false;
            }
        }

        return true;
    }
}
```

> 我们为什么不检查左下角，右下角和下方的格子，只检查了左上角，右上角和上方的格子呢？
>
> 因为皇后是一行一行从上往下放的，所以左下方，右下方和正下方不用检查（还没放皇后）；因为一行只会放一个皇后，所以每行不用检查。也就是最后只用检查上面，左上，右上三个方向。

函数 `backtrack` 依然像个在决策树上游走的指针，通过 `row` 和 `col` 就可以表示函数遍历到的位置，通过 `isValid` 函数可以将不符合条件的情况剪枝：

![img](https://labuladong.online/algo/images/backtracking/7.jpg)





## 参考与感谢：

- https://yuminlee2.medium.com/combinations-and-combination-sum-3ed2accc8d12
- https://medium.com/@sunshine990316/leetcode-python-backtracking-summary-medium-1-e8ae88839e85
- https://blog.devgenius.io/10-daily-practice-problems-day-18-f7293b55224d
