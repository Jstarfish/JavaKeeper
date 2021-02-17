![Multicolored Abacus Photography](https://images.pexels.com/photos/1019470/abacus-mathematics-addition-subtraction-1019470.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260)

# 1. 两数之和

题目来源于 LeetCode 上第 1 号问题：两数之和。题目难度为 Easy 。

### 题目描述

给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。

**示例:**

```
给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

### 代码实现

#### 方法一：暴力法

暴力法很简单，遍历每个元素 x，并查找是否存在一个值与`xtarget−x` 相等的目标元素。

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[j] == target - nums[i]) {
                    return new int[] { i, j };
                }
            }
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}
```

复杂度分析：

- 时间复杂度 $O(n^2)$：
  对于每个元素，我们试图通过遍历数组的其余部分来寻找它所对应的目标元素，这将耗费 $O(n)$ 的时间。因此时间复杂度为 $O(n^2)$
- 空间复杂度：$O(1)$

#### 方法二：两遍哈希表

为了对运行时间复杂度进行优化，我们需要一种更有效的方法来检查数组中是否存在目标元素。如果存在，我们需要找出它的索引。保持数组中的每个元素与其索引相互对应的最好方法是什么？哈希表。

通过以空间换取速度的方式，我们可以将查找时间从 $O(n)$降低到 $O(1)$。哈希表正是为此目的而构建的，它支持以近似恒定的时间进行快速查找。我用“近似”来描述，是因为一旦出现冲突，查找用时可能会退化到 $O(n)$。

一个简单的实现使用了两次迭代。在第一次迭代中，我们将每个元素的值和它的索引添加到表中。然后，在第二次迭代中，我们将检查每个元素所对应的目标元素$（target - nums[i]）$是否存在于表中。注意，该目标元素不能是 $nums[i]$ 本身！

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            map.put(nums[i], i);
        }
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement) && map.get(complement) != i) {
                return new int[] { i, map.get(complement) };
            }
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}
```

复杂度分析：

- 时间复杂度：$O(n)$，
  我们把包含有 nn 个元素的列表遍历两次。由于哈希表将查找时间缩短到 $O(1)$ ，所以时间复杂度为 $O(n)$。
- 空间复杂度：$O(n)$，
  所需的额外空间取决于哈希表中存储的元素数量，该表中存储了 nn 个元素。

#### 方法三：一遍哈希表

事实证明，我们可以一次完成。在进行迭代并将元素插入到表中的同时，我们还会回过头来检查表中是否已经存在当前元素所对应的目标元素。如果它存在，那我们已经找到了对应解，并立即将其返回。

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}
```

复杂度分析：

- 时间复杂度：$O(n)$
  我们只遍历了包含有 nn 个元素的列表一次。在表中进行的每次查找只花费 $O(1)$的时间。
- 空间复杂度：$O(n)$
  所需的额外空间取决于哈希表中存储的元素数量，该表最多需要存储 n 个元素。