---
title: 排序
date: 2023-10-09
tags: 
 - Algorithm
categories: Algorithm
---

![img](https://miro.medium.com/v2/resize:fit:1400/1*ZY2e2BNXTYBf9aBBHALCAw.png)

> 排序算法可以分为内部排序和外部排序，内部排序是数据记录在内存中进行排序，而外部排序是因排序的数据很大，一次不能容纳全部的排序记录，在排序过程中需要访问外存。常见的内部排序算法有：**插入排序、希尔排序、选择排序、冒泡排序、归并排序、快速排序、堆排序、基数排序**等。用一张图概括：
>
> ![十大经典排序算法 概览截图](https://ask.qcloudimg.com/http-save/yehe-1196009/nky6kqzm0o.png)

**关于时间复杂度**：

1. 平方阶 ($O(n2)$) 排序 各类简单排序：直接插入、直接选择和冒泡排序。
2. 线性对数阶 (O(nlog2n)) 排序： 快速排序、堆排序和归并排序；
3. O(n1+§) 排序，§ 是介于 0 和 1 之间的常数。 希尔排序
4. 线性阶 (O(n)) 排序： 基数排序，此外还有桶、箱排序。

**关于稳定性**：

稳定的排序算法：冒泡排序、插入排序、归并排序和基数排序

不稳定的排序算法：选择排序、快速排序、希尔排序、堆排序

**名词解释**：

**n**：数据规模

**k**：“桶”的个数

**In-place**：占用常数内存，不占用额外内存

**Out-place**：占用额外内存

**稳定性**：排序后 2 个相等键值的顺序和排序之前它们的顺序相同



十种常见排序算法可以分为两大类：

**非线性时间比较类排序**：通过比较来决定元素间的相对次序，由于其时间复杂度不能突破$O(nlogn)$，因此称为非线性时间比较类排序。

**线性时间非比较类排序**：不通过比较来决定元素间的相对次序，它可以突破基于比较排序的时间下界，以线性时间运行，因此称为线性时间非比较类排序。



## 冒泡排序

冒泡排序（Bubble Sort）也是一种简单直观的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

作为最简单的排序算法之一，冒泡排序给我的感觉就像 Abandon 在单词书里出现的感觉一样，每次都在第一页第一位，所以最熟悉。冒泡排序还有一种优化算法，就是立一个 flag，当在一趟序列遍历中元素没有发生交换，则证明该序列已经有序。但这种改进对于提升性能来说并没有什么太大作用。

### 1. 算法步骤

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 重复步骤1~3，直到排序完成。

### 2. 动图演示

![img](https://miro.medium.com/max/300/1*LllBj5cbV91URiuzAB-xzw.gif)



- **什么时候最快**：当输入的数据已经是正序时（都已经是正序了，我还要你冒泡排序有何用啊）。

- **什么时候最慢**：当输入的数据是反序时（写一个 for 循环反序输出数据不就行了，干嘛要用你冒泡排序呢，我是闲的吗）。

```java
//冒泡排序，a 表示数组， n 表示数组大小
public void bubbleSort(int[] a) {
  int n = a.length;
  if (n <= 1) return;
  // 外层循环遍历每一个元素
  for (int i = 0; i < n; i++) {
    //提前退出冒泡循环的标志位
    boolean flag = false;
    // 内层循环进行元素的比较与交换
    for (int j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j+1]) {
        int temp = a[j];
        a[j] = a[j+1];
        a[j+1] = temp;
        flag = true; //表示有数据交换
      }
    }
    if (!flag) break; //没有数据交换，提前退出。
  }
}
```

嵌套循环，应该立马就可以得出这个算法的时间复杂度为 $O(n²)$。

冒泡的过程只涉及相邻数据的交换操作，只需要常量级的临时空间，所以它的空间复杂度是O(1)，是一个原地排序算法。



## 选择排序

选择排序的思路是这样的：首先，找到数组中最小的元素，拎出来，将它和数组的第一个元素交换位置，第二步，在剩下的元素中继续寻找最小的元素，拎出来，和数组的第二个元素交换位置，如此循环，直到整个数组排序完成。

选择排序是一种简单直观的排序算法，无论什么数据进去都是 $O(n²)$ 的时间复杂度。所以用到它的时候，数据规模越小越好。唯一的好处可能就是不占用额外的内存空间了吧。

### 1. 算法步骤

1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
3. 重复第二步，直到所有元素均排序完毕。

### 2. 动图演示

![img](https://miro.medium.com/max/551/1*OA7a3OGWmGMRJQmwkGIwAw.gif)

```java
public void selectionSort(int [] arrs) {
      for (int i = 0; i < arrs.length; i++) {
          //最小元素下标
          int min = i;
          for (int j = i +1; j < arrs.length; j++) {
              if (arrs[j] < arrs[min]) {
                  min = j;
              }
          }
          //交换位置
          int temp = arrs[i];
          arrs[i] = arrs[min];
          arrs[min] = temp;
      }
  }
}
```



## 插入排序

插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，但它的原理应该是最容易理解的了，因为只要打过扑克牌的人都应该能够秒懂。插入排序是一种最简单直观的排序算法，它的工作原理为将待排列元素划分为「已排序」和「未排序」两部分，每次从「未排序的」元素中选择一个插入到「已排序的」元素中的正确位置。![insertion sort animate example](https://oi-wiki.org/basic/images/insertion-sort-animate.svg)

插入排序和冒泡排序一样，也有一种优化算法，叫做拆半插入。

### 1. 算法步骤

1. 从第一个元素开始，该元素可以认为已经被排序；
2. 取出下一个元素，在已经排序的元素序列中**从后向前**扫描；
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置；
4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
5. 将新元素插入到该位置后；
6. 重复步骤2~5。

### 2. 动图演示

![](https://miro.medium.com/max/500/1*onU9OmVftR5WeoLWh14iZw.gif)

```java
public void insertionSort(int[] arr) {
    // 从下标为1的元素开始选择合适的位置插入，因为下标为0的只有一个元素，默认是有序的
    for (int i = 1; i < arr.length; i++) {

        // 记录要插入的数据
        int tmp = arr[i];

        // 从已经排序的序列最右边的开始比较，找到比其小的数
        int j = i - 1;
        while (j > 0 && arr[j] > tmp) {
            arr[j + 1] = arr[j];
            j--;
        }
        // 存在比其小的数，插入
        arr[j + 1] = tmp;
    }
}
```



## 快速排序

这篇很好：https://www.cxyxiaowu.com/5262.html

快速排序的核心思想也是分治法，分而治之。它的实现方式是每次从序列中选出一个基准值，其他数依次和基准值做比较，比基准值大的放右边，比基准值小的放左边，然后再对左边和右边的两组数分别选出一个基准值，进行同样的比较移动，重复步骤，直到最后都变成单个元素，整个数组就成了有序的序列。

> 快速排序的最坏运行情况是 O(n²)，比如说顺序数列的快排。但它的平摊期望时间是 O(nlogn)，且 O(nlogn) 记号中隐含的常数因子很小，比复杂度稳定等于 O(nlogn) 的归并排序要小很多。所以，对绝大多数顺序性较弱的随机数列而言，快速排序总是优于归并排序。
>
> ![img](https://miro.medium.com/v2/resize:fit:1400/1*DXQsNsa-DeGjsMtp7V6z9A.png)

### 1. 算法步骤

1. 从数列中挑出一个元素，称为 “基准”（pivot）;
2. 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；
3. 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序；

递归的最底部情形，是数列的大小是零或一，也就是数组都已经被排序好了。虽然一直递归下去，但是这个算法总会退出，因为在每次的迭代（iteration）中，它至少会把一个元素摆到它最后的位置去。

### 2. 动图演示

![img](https://miro.medium.com/max/300/1*hk2TL8m8Kn1TVvewAbAclQ.gif)

### 单边扫描

快速排序的关键之处在于切分，切分的同时要进行比较和移动，这里介绍一种叫做单边扫描的做法。

我们随意抽取一个数作为基准值，同时设定一个标记 mark 代表左边序列最右侧的下标位置，当然初始为 0 ，接下来遍历数组，如果元素大于基准值，无操作，继续遍历，如果元素小于基准值，则把 mark + 1 ，再将 mark 所在位置的元素和遍历到的元素交换位置，mark 这个位置存储的是比基准值小的数据，当遍历结束后，将基准值与 mark 所在元素交换位置即可。

```java
public static void sort(int[] arrs, int startIndex, int endIndex) {
  if (startIndex > endIndex) {
    return;
  }
  int pivotIndex = partion(arrs, startIndex, endIndex);
  sort(arrs, startIndex, pivotIndex - 1);
  sort(arrs, pivotIndex + 1, endIndex);
}

public static int partion(int[] arrs, int startIndex, int endIndex) {
  int pivot = arrs[startIndex];
  int mark = startIndex;

  for (int i = startIndex + 1; i < arrs.length; i++) {
    if (arrs[i] < pivot) {
      mark++;
      int tmp = arrs[mark];
      arrs[mark] = arrs[i];
      arrs[i] = tmp;
    }
  }
  arrs[startIndex] = arrs[mark];
  arrs[mark] = pivot;
  return mark;
}
```

### 双边扫描

另外还有一种双边扫描的做法，看起来比较直观：我们随意抽取一个数作为基准值，然后从数组左右两边进行扫描，先从左往右找到一个大于基准值的元素，将下标指针记录下来，然后转到从右往左扫描，找到一个小于基准值的元素，交换这两个元素的位置，重复步骤，直到左右两个指针相遇，再将基准值与左侧最右边的元素交换。

我们来看一下实现代码，不同之处只有 partition 方法：

```java
// 快速排序方法
public void quickSort(int[] arr) {
  quickSortC(arr, 0, arr.length-1);
}

public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        // pi 是 partitioning index，arr[pi] 现在处于正确位置
        int pi = partition(arr, low, high);

        // 递归地对基准左侧和右侧的子数组进行排序
        quickSort(arr, low, pi - 1);  // 排序基准左侧的子数组
        quickSort(arr, pi + 1, high); // 排序基准右侧的子数组
    }
}

// 用于找到基准元素的正确位置并进行分区
private int partition(int[] arr, int low, int high) {
    int pivot = arr[high];    // 选择最后一个元素作为基准
    int i = low - 1;  // i是较小元素的索引，小于基准元素的区间右边界

    for (int j = low; j < high; j++) {
        // 如果当前元素小于或等于pivot
        if (arr[j] <= pivot) {
            i++;
            // 交换 arr[i] 和 arr[j]
            swap(arr, i, j);
        }
    }

    // 交换 arr[i+1] 和 arr[high] (或 pivot)
    // 将基准元素放到正确位置
    swap(arr, i + 1, right);

    return i + 1;
}

  // 交换数组中的两个元素
  private static void swap(int[] arr, int i, int j) {
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
```



## 归并排序

> ![img](https://miro.medium.com/v2/resize:fit:1400/1*1gyAaMcfcGIuZqrLJNDmgA.png)

归并排序（Merge sort）是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。

分治，就是分而治之，将一个大问题分解成小的子问题来解决。小的问题解决了，大问题也就解决了。

分治思想和递归思想很像。分治算法一般都是用递归来实现的。**分治是一种解决问题的处理思想，递归是一种编程技巧**，这两者并不冲突。

作为一种典型的分而治之思想的算法应用，归并排序的实现由两种方法：

- 自上而下的递归
- 自下而上的迭代（所有递归的方法都可以用迭代重写，所以就有了第 2 种方法）

和选择排序一样，归并排序的性能不受输入数据的影响，但表现比选择排序好的多，因为始终都是 $O(nlogn)$ 的时间复杂度。代价是需要额外的内存空间。

### 1. 算法步骤

1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列；
2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置；
3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置；
4. 重复步骤 3 直到某一指针达到序列尾；
5. 将另一序列剩下的所有元素直接复制到合并序列尾。

### 2. 动图演示

![img](https://miro.medium.com/max/300/1*fE7yGW2WPaltJWo6OnZ8LQ.gif)

```java
/* 合并左子数组和右子数组 */
void merge(int[] nums, int left, int mid, int right) {
    // 左子数组区间为 [left, mid], 右子数组区间为 [mid+1, right]
    // 创建一个临时数组 tmp ，用于存放合并后的结果
    int[] tmp = new int[right - left + 1];
    // 初始化左子数组和右子数组的起始索引
    int i = left, j = mid + 1, k = 0;
    // 当左右子数组都还有元素时，进行比较并将较小的元素复制到临时数组中
    while (i <= mid && j <= right) {
        if (nums[i] <= nums[j])
            tmp[k++] = nums[i++];
        else
            tmp[k++] = nums[j++];
    }
    // 将左子数组和右子数组的剩余元素复制到临时数组中
    while (i <= mid) {
        tmp[k++] = nums[i++];
    }
    while (j <= right) {
        tmp[k++] = nums[j++];
    }
    // 将临时数组 tmp 中的元素复制回原数组 nums 的对应区间
    for (k = 0; k < tmp.length; k++) {
        nums[left + k] = tmp[k];
    }
}

/* 归并排序 */
void mergeSort(int[] nums, int left, int right) {
    // 终止条件
    if (left >= right)
        return; // 当子数组长度为 1 时终止递归
    // 划分阶段
    int mid = left + (right - left) / 2; // 计算中点
    mergeSort(nums, left, mid); // 递归左子数组
    mergeSort(nums, mid + 1, right); // 递归右子数组
    // 合并阶段
    merge(nums, left, mid, right);
}
```

![img](https://miro.medium.com/v2/resize:fit:1400/1*rx1sSHQEwVI0H9_6DP0S-Q.png)



## 希尔排序

希尔排序这个名字，来源于它的发明者希尔，也称作“缩小增量排序”，是插入排序的一种更高效的改进版本。但希尔排序是非稳定排序算法。

希尔排序是基于插入排序的以下两点性质而提出改进方法的：

- 插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率；
- 但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位；

希尔排序的基本思想是：先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行依次直接插入排序。

### 1. 算法步骤

1. 选择一个增量序列 t1，t2，……，tk，其中 ti > tj, tk = 1；
2. 按增量序列个数 k，对序列进行 k 趟排序；
3. 每趟排序，根据对应的增量 ti，将待排序列分割成若干长度为 m 的子序列，分别对各子表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

### 2. 动图演示

![img](https://mmbiz.qpic.cn/mmbiz_gif/951TjTgiabkzow2ORRzgpfHIGAKIAWlXm6GpRDRhiczgOdibbGBtpibtIhX4YRzibicUyEOSVh3JZBHtiaZPN30X1WOhA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)





## 堆排序

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序可以说是一种利用堆的概念来排序的选择排序。分为两种方法：

1. 大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
2. 小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

堆排序的平均时间复杂度为 Ο(nlogn)。

### 1. 算法步骤

1. 将待排序序列构建成一个堆 H[0……n-1]，根据（升序降序需求）选择大顶堆或小顶堆；
2. 把堆首（最大值）和堆尾互换；
3. 把堆的尺寸缩小 1，并调用 shift_down(0)，目的是把新的数组顶端数据调整到相应位置；
4. 重复步骤 2，直到堆的尺寸为 1。

### 2. 动图演示

[![动图演示](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/heapSort.gif)](https://github.com/hustcc/JS-Sorting-Algorithm/blob/master/res/heapSort.gif)





## 计数排序

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

### 1. 动图演示

[![动图演示](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/countingSort.gif)](https://github.com/hustcc/JS-Sorting-Algorithm/blob/master/res/countingSort.gif)





## 桶排序

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。为了使桶排序更加高效，我们需要做到这两点：

1. 在额外空间充足的情况下，尽量增大桶的数量
2. 使用的映射函数能够将输入的 N 个数据均匀的分配到 K 个桶中

同时，对于桶中元素的排序，选择何种比较排序算法对于性能的影响至关重要。

### 1. 什么时候最快

当输入的数据可以均匀的分配到每一个桶中。

### 2. 什么时候最慢

当输入的数据被分配到了同一个桶中。



## 基数排序

基数排序是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也不是只能使用于整数。

### 1. 基数排序 vs 计数排序 vs 桶排序

基数排序有两种方法：

这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异案例看大家发的：

- 基数排序：根据键值的每位数字来分配桶；
- 计数排序：每个桶只存储单一键值；
- 桶排序：每个桶存储一定范围的数值；

### 2. LSD 基数排序动图演示

[![动图演示](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/radixSort.gif)](https://github.com/hustcc/JS-Sorting-Algorithm/blob/master/res/radixSort.gif)





## Reference:

- https://yuminlee2.medium.com/sorting-algorithms-summary-f17ea88a9174
