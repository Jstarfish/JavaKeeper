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
> 回溯算法实际上一个类似枚举的搜索尝试过程，主要是在**搜索尝试**过程中寻找问题的解，当发现已不满足求解条件时，就“**回溯**”返回，尝试别的路径。所以也可以叫做**回溯搜索法**。
>
> 回溯是递归的副产品，只要有递归就会有回溯。

# 一、回溯算法

回溯算法是一种**深度优先搜索**（DFS）的算法，它通过递归的方式，逐步建立解空间树，从根节点开始，逐层深入，直到找到一个解或路径不可行时回退到上一个状态（即回溯）。每一步的尝试可能会有多个选择，回溯算法通过剪枝来减少不必要的计算。

> **深度优先搜索** 算法（英语：Depth-First-Search，DFS）是一种用于遍历或搜索树或图的算法。这个算法会 **尽可能深** 的搜索树的分支。当结点 `v` 的所在边都己被探寻过，搜索将 **回溯** 到发现结点 `v` 的那条边的起始结点。这一过程一直进行到已发现从源结点可达的所有结点为止。如果还存在未被发现的结点，则选择其中一个作为源结点并重复以上过程，整个进程反复进行直到所有结点都被访问为止。

回溯的基本步骤通常包含以下几个要素：

- **选择**：在当前状态下，做出一个选择，进入下一个状态。
- **约束**：每一步的选择必须满足问题的约束条件。
- **目标**：找到一个解或判断是否无法继续。
- **回溯**：如果当前的选择不符合目标，撤销当前的选择，回到上一状态继续尝试其他可能的选择。

### 核心思想

**回溯法** 采用试错的思想，它尝试分步的去解决一个问题。

1. **穷举所有可能的解**：回溯法通过在每个状态下尝试不同的选择，来遍历解空间树。每个分支代表着做出的一个选择，每次递归都尝试不同的路径，直到找到一个解或回到根节点。
2. **剪枝**：在回溯过程中，我们可能会遇到一些不符合约束条件的选择，这时候可以及时退出当前分支，避免无谓的计算，这被称为“剪枝”。剪枝是提高回溯算法效率的关键，能减少不必要的计算。
3. **深度优先搜索（DFS）**：回溯算法在解空间树中深度优先遍历，尝试选择每个分支。直到走到树的叶子节点或回溯到一个不满足条件的节点。



### 基本框架

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

对应到 java 的一般框架如下：

```java
public void backtrack(List<Integer> tempList, int start, int[] nums) {
    // 1. 终止条件
    if (tempList.size() == nums.length) {
        // 找到一个解
        result.add(new ArrayList<>(tempList));
        return;
    }

    for (int i = start; i < nums.length; i++) {
        // 2. 剪枝：跳过相同的数字，避免重复
        if (i > start && nums[i] == nums[i - 1]) {
            continue;
        }

        // 3. 做出选择
        tempList.add(nums[i]);

        // 4. 递归
        backtrack(tempList, i + 1, nums);

        // 5. 撤销选择
        tempList.remove(tempList.size() - 1);
    }
}
```

**其实就是 for 循环里面的递归，在递归调用之前「做选择」，在递归调用之后「撤销选择」**



### 常见题型

回溯法，一般可以解决如下几种问题：

- 组合问题：N个数里面按一定规则找出k个数的集合

  - **题目示例**：`LeetCode 39. 组合总和`，`LeetCode 40. 组合总和 II`，`LeetCode 77. 组合`
  - **解题思路**： 组合问题要求我们在给定的数组中选取若干个数字，组合成目标值或某种形式的子集。回溯算法的基本思路是从一个起点开始，选择当前数字或者跳过当前数字，直到找到一个合法的组合。组合问题通常有**去重**的要求，避免重复的组合。

- 排列问题：N个数按一定规则全排列，有几种排列方式

  - **题目示例**：`LeetCode 46. 全排列`，`LeetCode 47. 全排列 II`，`LeetCode 31. 下一个排列`
  - **解题思路**： 排列问题要求我们通过给定的数字生成所有可能的排列。回溯算法通过递归生成所有排列，通过交换位置来改变元素的顺序。对于全排列 II 这类题目，必须处理重复元素的问题，确保生成的排列不重复。

- 子集问题：一个N个数的集合里有多少符合条件的子集

  - **题目示例**：`LeetCode 78. 子集`，`LeetCode 90. 子集 II`
  - **解题思路**： 子集问题要求我们生成数组的所有子集，回溯算法通过递归生成每个可能的子集。在生成子集时，每个元素有两种选择——要么包含它，要么不包含它。因此，回溯法通过逐步选择来生成所有的子集。

- 切割问题：一个字符串按一定规则有几种切割方式

  - 题目实例：` LeetCode 416. Partition Equal Subset Sum`，`LeetCode 698. Partition to K Equal Sum Subsets`
  - 解题思路：回溯法适用于切割问题中的“探索所有可能的分割方式”的场景。特别是在无法直接通过动态规划推导出最优解时，回溯法通过递归尝试所有可能的分割方式，并通过剪枝减少不必要的计算

- 棋盘问题：

  - **题目示例**：`LeetCode 37. 解数独`，`LeetCode 51. N 皇后`，`LeetCode 52. N 皇后 II`

    **解题思路**： 棋盘问题常常涉及到在二维数组中进行回溯搜索，比如在数独中填入数字，或者在 N 皇后问题中放置皇后。回溯法在这里用于逐步尝试每个位置，满足棋盘的约束条件，直到找到一个解或者回溯到一个合法的状态。

- 图的遍历问题：`LeetCode 79. 单词搜索`，`LeetCode 130. 被围绕的区域`

  - **题目示例**：`LeetCode 79. 单词搜索`，`LeetCode 130. 被围绕的区域`
  - **解题思路**： 回溯算法在图遍历中的应用主要是通过递归搜索路径。常见的问题是从某个起点出发，寻找是否存在某个目标路径。通过回溯算法，可以逐步尝试每一个可能的路径，直到找到符合条件的解。




### 回溯算法的优化技巧

1. **剪枝**：在递归过程中，如果当前路径不符合问题约束，就提前返回，避免继续深入。例如在排列问题中，遇到重复的数字时可以跳过该分支。
2. **排序**：对输入数据进行排序，有助于我们在递归时判断是否可以剪枝，尤其是在去重的场景下。
3. **状态压缩**：在一些问题中，使用位运算或其他方式对状态进行压缩，可以显著减少存储空间和计算时间。例如在解决旅行商问题时，常常使用状态压缩来存储已经访问的节点。
4. **提前终止**：如果在递归过程中发现某条路径不可能达到目标（例如目标已经超过了剩余可用值），可以直接结束该分支，节省时间。



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
public List<List<Integer>> subsets(int[] nums) {
  List<List<Integer>> res = new ArrayList<>();
  // 记录回溯算法的递归路径
  List<Integer> track = new ArrayList<>();

  if (nums.length == 0) {
      return res;
  }

  backtrack(nums, 0, res, track);
  return res;
}

private void backtrack(int[] nums, int index, List<List<Integer>> res, List<Integer> track) {

    res.add(new ArrayList<>(track));

   // 回溯算法标准框架
    for (int i = index; i < nums.length; i++) {
        // 做选择
        track.add(nums[i]);
        // 通过 start 参数控制树枝的遍历，避免产生重复的子集
        backtrack(nums, i + 1, res, track);
        // 撤销选择
        track.remove(track.size() - 1);
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
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> res = new ArrayList<>();
    // 记录回溯算法的递归路径
    List<Integer> track = new ArrayList<>();
    // start 从 1 开始即可
    backtrack(n, k, 1, track, res);
    return res;
}

private void backtrack(int n, int k, int start, List<Integer> track, List<List<Integer>> res) {
    // 遍历到了第 k 层，收集当前节点的值
    if (track.size() == k) {
        res.add(new ArrayList<>(track));  // 深拷贝
        return;
    }
    
    // 从当前数字开始尝试
    for (int i = start; i <= n; i++) {
        track.add(i);
        // 通过 start 参数控制树枝的遍历，避免产生重复的子集
        backtrack(n, k, i + 1, track, res);  // 递归选下一个数字
        track.remove(track.size() - 1);  // 撤销选择
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

> **labuladong 称为 决策树，你在每个节点上其实都在做决策**。因为比如你选了 2 之后，只能再选 1 或者 3，全排列是不允许重复使用数字的。**`[2]` 就是「路径」，记录你已经做过的选择；`[1,3]` 就是「选择列表」，表示你当前可以做出的选择；「结束条件」就是遍历到树的底层叶子节点，这里也就是选择列表为空的时候**。

```java
public class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        // 记录「路径」
        List<Integer> track = new ArrayList<>();
        boolean[] used = new boolean[nums.length];  // 标记数字是否被使用过
        backtrack(nums, used, track, res);
        return res;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> track, List<List<Integer>> res) {
        // 当排列的大小达到nums.length时，说明当前排列完成
        if (track.size() == nums.length) {
            res.add(new ArrayList<>(track));  // 将当前排列加入结果
            return;
        }

        // 尝试每一个数字
        for (int i = 0; i < nums.length; i++) {
            if (visited[i]) continue;  // 如果当前数字已经被使用过，则跳过，剪枝操作

            // 做选择
            track.add(nums[i]);
            used[i] = true;  // 标记当前数字为已使用

            // 递归进入下一层
            backtrack(nums, used, track, res);

            // 撤销选择
            track.remove(track.size() - 1);
            used[i] = false;  // 回溯时将当前数字标记为未使用
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

> LeetCode 78 **Subsets** 问题并没有重复的子集。我们生成的是所有可能的子集，并且不需要考虑去除重复的子集，因为给定的数组 `nums` 不含重复元素。而在 **Subsets II** 中，由于输入数组可能包含重复元素，所以我们需要特殊处理来避免生成重复的子集。

```java
public class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);  // 排序，确保相同的元素相邻
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, int start, List<Integer> track, List<List<Integer>> res) {
        // 每次递归时，将当前的track添加到结果中
        res.add(new ArrayList<>(track));

        // 从start位置开始遍历
        for (int i = start; i < nums.length; i++) {
            // 如果当前元素与前一个元素相同，并且前一个元素没有被选择，跳过当前元素
            if (i > start && nums[i] == nums[i - 1]) {
                continue;  // 剪枝
            }

            // 做选择
            track.add(nums[i]);
            // 递归进入下一层
            backtrack(nums, i + 1, track, res);
            // 撤销选择
            track.remove(track.size() - 1);
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

```java
public class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(candidates);  // 排序，便于后续去重
        backtrack(candidates, target, 0, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] candidates, int target, int start, List<Integer> track, List<List<Integer>> res) {
        // 当目标值为0时，找到一个符合条件的组合
        if (target == 0) {
            res.add(new ArrayList<>(track));  // 复制当前组合并加入结果
            return;
        }

        // 遍历候选数组
        for (int i = start; i < candidates.length; i++) {
            // 剪枝：当前数字大于目标值，后续不可能有合法的组合
            if (candidates[i] > target) {
                break;
            }
            // 剪枝：跳过重复的数字
            if (i > start && candidates[i] == candidates[i - 1]) {
                continue;
            }

            // 做选择：选择当前数字
            track.add(candidates[i]);
            // 递归，注意i + 1表示下一个位置，确保每个数字只使用一次
            backtrack(candidates, target - candidates[i], i + 1, track, res);
            // 撤销选择
            track.remove(track.size() - 1);
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
public class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);  // 排序，确保相同元素相邻
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> track, List<List<Integer>> res) {
        // 当排列的大小达到nums.length时，找到一个合法排列
        if (track.size() == nums.length) {
            res.add(new ArrayList<>(track));  // 加入当前排列
            return;
        }

        // 遍历数组，递归生成排列
        for (int i = 0; i < nums.length; i++) {
            // 剪枝：当前元素已经被使用过，跳过
            if (used[i]) continue;
            // 剪枝：跳过相同的元素，避免生成重复排列
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;

            // 做选择
            track.add(nums[i]);
            used[i] = true;  // 标记当前元素已使用

            // 递归
            backtrack(nums, used, track, res);

            // 撤销选择
            track.remove(track.size() - 1);
            used[i] = false;  // 标记当前元素未使用
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
public class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> track = new ArrayList<>();
        backtrack(candidates, target, 0, track, res);
        return res;
    }

    private void backtrack(int[] candidates, int target, int start, List<Integer> track, List<List<Integer>> res) {
        // 如果目标值为0，表示当前组合符合条件
        if (target == 0) {
            res.add(new ArrayList<>(track));  // 将当前组合加入结果
            return;
        }

        // 遍历候选数组
        for (int i = start; i < candidates.length; i++) {
            // 如果当前数字大于目标值，跳过
            if (candidates[i] > target) continue;

            // 做选择：选择当前数字
            track.add(candidates[i]);

            // 递归，注意这里传入 i，因为可以重复选择当前数字
            backtrack(candidates, target - candidates[i], i, track, res);

            // 撤销选择
            track.remove(track.size() - 1);
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

首先，我们需要将每个数字 2 到 9 映射到其对应的字母，可以用 Map ,  也可以用数组。然后就是递归处理。

**递归终止条件**：当当前组合的长度与输入的数字字符串长度相同，就说明我们已经得到了一个有效的组合，可以将其加入结果集。

![](http://img.starfish.ink/leetcode/leetcode-letterCombinations.png)

```java
public class Solution {
    public List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (digits == null || digits.length() == 0) {
            return res;  // 如果输入为空，返回空结果
        }

        // 数字到字母的映射
        String[] mapping = {
            "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
        };

        // 使用回溯法生成字母组合
        backtrack(digits, 0, mapping, new StringBuilder(), res);
        return res;
    }

    private void backtrack(String digits, int index, String[] mapping, StringBuilder current, List<String> res) {
        // 如果当前组合的长度等于输入的长度，说明已经生成了一个有效的字母组合
        if (index == digits.length()) {
            res.add(current.toString());
            return;
        }

        // 获取当前数字对应的字母
        String letters = mapping[digits.charAt(index) - '0'];

        // 递归选择字母
        for (char letter : letters.toCharArray()) {
            current.append(letter);  // 选择一个字母
            backtrack(digits, index + 1, mapping, current, res);  // 递归处理下一个数字
            current.deleteCharAt(current.length() - 1);  // 撤销选择
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

public List<String> generateParenthesis(int n) {
      List<String> res = new ArrayList<>();
      // 回溯过程中的路径
      StringBuilder track = new StringBuilder();
      if (n == 0) {
          return res;
      }
      trackback(n, n, res, track);
      return res;
  }

 // 可用的左括号数量为 left 个，可用的右括号数量为 right 个
  private void trackback(int left, int right, List<String> res, StringBuilder track) {
      //如果剩余的左括号数量大于右括号数量
      if (left < 0 || right < 0 || left > right) {
          return;
      }

     // 当所有括号都恰好用完时，得到一个合法的括号组合
      if (left == 0 && right == 0) {
          res.add(track.toString());
          return;
      }

      // 做选择，尝试放一个左括号
      track.append('(');
      trackback(left - 1, right, res, track);
      // 撤销选择
      track.deleteCharAt(track.length() - 1);

      track.append(')');
      trackback(left, right - 1, res, track);
      track.deleteCharAt(track.length() - 1);
      
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
> ![](https://assets.leetcode.com/uploads/2020/11/13/queens.jpg)
>
> ```
>输入：n = 4
> 输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
> 解释：如上图所示，4 皇后问题存在两个不同的解法。
> ```

思路：通过回溯算法逐行放置皇后，每次递归时确保当前行、列和对角线不被其他皇后攻击。通过标记已占用的列和对角线，避免重复搜索，最终生成所有合法的解。

- 如果在某一列或对角线处已有皇后，就不能在该位置放置皇后。我们可以使用三个辅助数组来追踪列和对角线的使用情况：
  - `cols[i]`：表示第 `i` 列是否已经放置了皇后。
  - `diag1[i]`：表示从左上到右下的对角线（`row - col`）是否已经有皇后。
  - `diag2[i]`：表示从右上到左下的对角线（`row + col`）是否已经有皇后。

- 主对角线是从左上角到右下角的对角线、副对角线是从右上角到左下角的对角线

```java
public class NQueens {

    public List<List<String>> solveNQueens(int N) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[N][N];
        
        // 初始化棋盘，每个位置设为'.'
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                board[i][j] = '.';
            }
        }
        
        // 用来记录列、主对角线、副对角线是否已被占用
        boolean[] cols = new boolean[N];  // 列占用标记
        boolean[] diag1 = new boolean[2 * N - 1];  // 主对角线占用标记
        boolean[] diag2 = new boolean[2 * N - 1];  // 副对角线占用标记
        
        backtrack(N, 0, board, cols, diag1, diag2, result);
        return result;
    }

    // 回溯函数
    private void backtrack(int N, int row, char[][] board, boolean[] cols, boolean[] diag1, boolean[] diag2, List<List<String>> result) {
        if (row == N) {  // 如果已经放置了 N 个皇后
            List<String> solution = new ArrayList<>();
            for (int i = 0; i < N; i++) {
                solution.add(new String(board[i]));  // 将每一行转化为字符串并添加到结果中
            }
            result.add(solution);
            return;
        }

        // 遍历每一列，尝试放置皇后
        for (int col = 0; col < N; col++) {
            // 判断当前位置是否可以放置皇后
            if (cols[col] || diag1[row - col + (N - 1)] || diag2[row + col]) {
                continue;  // 如果列、主对角线或副对角线已被占用，跳过当前列
            }
            
            // 放置皇后
            board[row][col] = 'Q';
            cols[col] = true;  // 标记该列已被占用
            diag1[row - col + (N - 1)] = true;  // 标记主对角线已被占用
            diag2[row + col] = true;  // 标记副对角线已被占用

            // 递归放置下一行的皇后
            backtrack(N, row + 1, board, cols, diag1, diag2, result);

            // 回溯，撤销当前位置的选择
            board[row][col] = '.';
            cols[col] = false;
            diag1[row - col + (N - 1)] = false;
            diag2[row + col] = false;
        }
    }

    // 打印结果
    public void printSolutions(List<List<String>> solutions) {
        for (List<String> solution : solutions) {
            for (String row : solution) {
                System.out.println(row);
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        NQueens nq = new NQueens();
        List<List<String>> solutions = nq.solveNQueens(4);
        nq.printSolutions(solutions);
    }
}

```





## 参考与感谢：

- https://yuminlee2.medium.com/combinations-and-combination-sum-3ed2accc8d12
- https://medium.com/@sunshine990316/leetcode-python-backtracking-summary-medium-1-e8ae88839e85
- https://blog.devgenius.io/10-daily-practice-problems-day-18-f7293b55224d
- [hello 算法- 回溯算法](https://www.hello-algo.com/chapter_backtracking/backtracking_algorithm/#1312)
