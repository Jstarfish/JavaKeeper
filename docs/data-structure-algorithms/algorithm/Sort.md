---
title: 排序
date: 2023-10-09
tags: 
 - Algorithm
categories: Algorithm
---

![img](https://miro.medium.com/v2/resize:fit:1400/1*ZY2e2BNXTYBf9aBBHALCAw.png)

排序算法可以分为内部排序和外部排序，内部排序是数据记录在内存中进行排序，而外部排序是因排序的数据很大，一次不能容纳全部的排序记录，在排序过程中需要访问外存。常见的内部排序算法有：**插入排序、希尔排序、选择排序、冒泡排序、归并排序、快速排序、堆排序、基数排序**等。

|         排序算法         | 平均时间复杂度 | 最好情况                                              | 最坏情况                                            | 空间复杂度                                                 | 稳定性                                         |
| :----------------------: | -------------- | ----------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
|   冒泡排序-Bubble Sort   | $O(n²)$        | $O(n)$（当数组已经有序时，只需遍历一次）              | $O(n²)$（当数组是逆序时，需要多次交换）             | $O(1)$（原地排序）                                         | 稳定                                           |
| 选择排序-Selection Sort  | $O(n²)$        | $O(n²)$                                               | $O(n²)$                                             | $O(1)$（原地排序）                                         | 不稳定（交换元素时可能破坏相对顺序）           |
| 插入排序-Insertion Sort  | $O(n²)$        | $O(n)$（当数组已经有序时）                            | $O(n²)$（当数组是逆序时）                           | $O(1)$（原地排序）                                         | 稳定                                           |
|   希尔排序-Shell Sort    | $O(n \log² n)$ | $O(n \log n)$                                         | $O(n²)$（不同的增量序列有不同的最坏情况）           | $O(1)$（原地排序）                                         | 不稳定                                         |
|   归并排序-Merge Sort    | $O(n \log n)$  | $O(n \log n)$                                         | $O(n \log n)$                                       | $O(n)$（需要额外的空间用于辅助数组）                       | 稳定                                           |
|   快速排序-Quick Sort    | $O(n \log n)$  | $O(n \log n)$（每次划分的子数组大小相等）             | $O(n²)$（每次选取的基准值使得数组划分非常不平衡）   | $O(\log n)$（对于递归栈） $O(n)$（最坏情况递归栈深度为 n） | 不稳定（交换可能改变相同元素的相对顺序）       |
|     堆排序-Heap Sort     | $O(n \log n)$  | $O(n \log n)$                                         | $O(n \log n)$                                       | $O(1)$（原地排序）                                         | 不稳定（在调整堆时可能改变相同元素的相对顺序） |
| 计数排序-Counting Sort） | $O(n + k)$     | $O(n + k)$（k 是数组中元素的取值范围）                | $O(n + k)$                                          | $O(n + k)$（需要额外的数组来存储计数结果）                 | 稳定                                           |
|   桶排序-Bucket Sort）   | $O(n + k)$     | $O(n + k)$（k 是桶的数量，n 是元素数量）              | $O(n²)$（所有元素都集中到一个桶里，退化成冒泡排序） | $O(n + k)$                                                 | 稳定                                           |
|   基数排序-Radix Sort    | $O(d(n + k))$  | $O(d(n + k))$（d 是位数，k 是取值范围，n 是元素数量） | $O(d(n + k))$                                       | $O(n + k)$                                                 | 稳定                                           |

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

![img](https://www.runoob.com/wp-content/uploads/2019/03/bubbleSort.gif)



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

冒泡的过程只涉及相邻数据的交换操作，只需要常量级的临时空间，所以它的空间复杂度是 $O(1)$，是一个原地排序算法。



## 选择排序

选择排序的思路是这样的：首先，找到数组中最小的元素，拎出来，将它和数组的第一个元素交换位置，第二步，在剩下的元素中继续寻找最小的元素，拎出来，和数组的第二个元素交换位置，如此循环，直到整个数组排序完成。

选择排序是一种简单直观的排序算法，无论什么数据进去都是 $O(n²)$ 的时间复杂度。所以用到它的时候，数据规模越小越好。唯一的好处可能就是不占用额外的内存空间了吧。

### 1. 算法步骤

1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
3. 重复第二步，直到所有元素均排序完毕。

### 2. 动图演示

![img](https://www.runoob.com/wp-content/uploads/2019/03/selectionSort.gif)

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

插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，但它的原理应该是最容易理解的了，因为只要打过扑克牌的人都应该能够秒懂。

它的工作原理为将待排列元素划分为「已排序」和「未排序」两部分，每次从「未排序的」元素中选择一个插入到「已排序的」元素中的正确位置。![insertion sort animate example](https://oi-wiki.org/basic/images/insertion-sort-animate.svg)

插入排序和冒泡排序一样，也有一种优化算法，叫做拆半插入。

### 1. 算法步骤

1. 从第一个元素开始（下标为 0 的元素），该元素可以认为已经被排序；
2. 取出下一个元素，在已经排序的元素序列中**从后向前**扫描；
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置；
4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
5. 将新元素插入到该位置后；
6. 重复步骤2~5。

### 2. 动图演示

![img](https://www.runoob.com/wp-content/uploads/2019/03/insertionSort.gif)

```java
public void insertionSort(int[] arr) {
    // 从下标为1的元素开始选择合适的位置插入，因为下标为0的只有一个元素，默认是有序的
    for (int i = 1; i < arr.length; i++) {

        // 记录要插入的数据
        int tmp = arr[i];

        // 从已经排序的序列最右边的开始比较，找到比其小的数
        int j = i - 1;
        //内循环：将 tmp 插入到已排序区间 [0, i-1] 中的正确位置
        while (j >= 0 && arr[j] > tmp) {
            arr[j + 1] = arr[j];
            j--;
        }
        // 存在比其小的数，插入(将 tmp 赋值到正确位置)
        arr[j + 1] = tmp;
    }
}
```



## 快速排序

快速排序的核心思想是分治法，分而治之。它的实现方式是每次从序列中选出一个基准值，其他数依次和基准值做比较，比基准值大的放右边，比基准值小的放左边，然后再对左边和右边的两组数分别选出一个基准值，进行同样的比较移动，重复步骤，直到最后都变成单个元素，整个数组就成了有序的序列。

> 快速排序的最坏运行情况是 $O(n²)$，比如说顺序数列的快排。但它的平摊期望时间是 $O(nlogn)$，且 $O(nlogn)$ 记号中隐含的常数因子很小，比复杂度稳定等于 $O(nlogn) $的归并排序要小很多。所以，对绝大多数顺序性较弱的随机数列而言，快速排序总是优于归并排序。
>
> ![img](https://miro.medium.com/v2/resize:fit:1400/1*DXQsNsa-DeGjsMtp7V6z9A.png)

### 1. 算法步骤

1. **选择基准值**：从数组中选择一个元素作为基准值（pivot）。常见的选择方法有选取第一个元素、最后一个元素、中间元素或随机选取一个元素。
2. **分区（Partition）**：遍历数组，将所有小于基准值的元素放在基准值的左侧，大于基准值的元素放在右侧。基准值放置在它的正确位置上。
3. **递归排序**：对基准值左右两边的子数组分别进行递归排序，直到每个子数组的元素个数为0或1，此时数组已经有序。

递归的最底部情形，是数列的大小是零或一，也就是数组都已经被排序好了。虽然一直递归下去，但是这个算法总会退出，因为在每次的迭代（iteration）中，它至少会把一个元素摆到它最后的位置去。

### 2. 动图演示

![img](https://www.runoob.com/wp-content/uploads/2019/03/quickSort.gif)

我们选最后一个数作为基准值，然后从数组左右两边进行扫描，先从左往右找到一个大于基准值的元素，将下标指针记录下来，然后转到从右往左扫描，找到一个小于基准值的元素，交换这两个元素的位置，重复步骤，直到左右两个指针相遇，再将基准值与左侧最右边的元素交换。

```java
// 快速排序方法
public void quickSort(int[] arr) {
  quickSortC(arr, 0, arr.length-1);
}

public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        // pivot 是 partitioning index，arr[pi] 现在处于正确位置
        int pivot = partition(arr, low, high);

        // 递归地对基准左侧和右侧的子数组进行排序
        quickSort(arr, low, pivot - 1);  // 排序基准左侧的子数组
        quickSort(arr, pivot + 1, high); // 排序基准右侧的子数组
    }
}

// 用于找到基准元素的正确位置并进行分区
private int partition(int[] arr, int low, int high) {
    int pivot = arr[high];    // 选择最后一个元素作为基准
    int i = low - 1;      // i是已处理区域的最后一个元素下标

    for (int j = low; j < high; j++) {
        // 如果当前元素小于或等于基准值，将它放到左侧
        if (arr[j] <= pivot) {
            i++;
            // 交换 arr[i] 和 arr[j]
            swap(arr, i, j);
        }
    }

    // 交换 arr[i+1] 和 arr[high] (或 pivot)
    // 将基准值放到正确位置，即i + 1处
    swap(arr, i + 1, high);
    
    return i + 1;  // 返回基准值的位置
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

1. **分解**：将数组分成两半，递归地对每一半进行归并排序，直到每个子数组的大小为1（单个元素是有序的）。

2. **合并**：将两个有序子数组合并成一个有序数组。

### 2. 动图演示

![img](https://www.runoob.com/wp-content/uploads/2019/03/mergeSort.gif)



```java
public class MergeSort {
    // 主排序函数
    public static void mergeSort(int[] arr) {
        if (arr.length < 2) return; // 基本情况
        int mid = arr.length / 2;

        // 分解
        int[] left = new int[mid];
        int[] right = new int[arr.length - mid];

        // 填充左子数组
        for (int i = 0; i < mid; i++) {
            left[i] = arr[i];
        }

        // 填充右子数组
        for (int i = mid; i < arr.length; i++) {
            right[i - mid] = arr[i];
        }

        // 递归排序
        mergeSort(left);
        mergeSort(right);

        // 合并已排序的子数组
        merge(arr, left, right);
    }

    // 合并两个有序数组
    private static void merge(int[] arr, int[] left, int[] right) {
      // i、j、k 分别代表左子数组、右子数组、合并数组的指针  
      int i = 0, j = 0, k = 0;

        // 合并两个有序数组，直到子数组都插入到合并数组
        while (i < left.length && j < right.length) {
          //比较 left[i] 和 right[j], 左右哪边小的，就放入合并数组，指针要 +1
            if (left[i] <= right[j]) {
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
            }
        }

        // 复制剩余元素
        while (i < left.length) {
            arr[k++] = left[i++];
        }
        while (j < right.length) {
            arr[k++] = right[j++];
        }
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(arr);
        System.out.println("排序后的数组:");
        for (int num : arr) {
            System.out.print(num + " ");
        }
    }
}

```

![img](https://miro.medium.com/v2/resize:fit:1400/1*rx1sSHQEwVI0H9_6DP0S-Q.png)



## 堆排序

> ![img](https://miro.medium.com/v2/resize:fit:1400/1*FNfDwQYa3wN-zcma1c1bfQ.png)

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序可以说是一种利用堆的概念来排序的选择排序。分为两种方法：

1. 大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
2. 小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

堆排序的平均时间复杂度为 $Ο(nlogn)$。

### 1. 算法步骤

1. **构建最大堆**：

   - 首先将无序数组转换为一个**最大堆**。最大堆是一个完全二叉树，其中每个节点的值都大于或等于其子节点的值。

   - 最大堆的根节点（堆顶）是整个堆中的最大元素。

2. **反复取出堆顶元素**：

   - 将堆顶元素（最大值）与堆的最后一个元素交换，然后减少堆的大小，堆顶元素移到数组末尾。

   - 调整剩余的元素使其重新成为一个最大堆。

   - 重复这个过程，直到所有元素有序。

### 2. 动图演示

[![动图演示](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/heapSort.gif)](https://github.com/hustcc/JS-Sorting-Algorithm/blob/master/res/heapSort.gif)

```java
public class HeapSort {
    // 主排序函数
    public static void heapSort(int[] arr) {
        int n = arr.length;

        // 1. 构建最大堆
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // 2. 逐步将堆顶元素与末尾元素交换，并缩小堆的范围
        for (int i = n - 1; i > 0; i--) {
            // 将当前堆顶（最大值）移到末尾
            swap(arr, 0, i);

            // 重新调整堆，使剩余元素保持最大堆性质
            heapify(arr, i, 0);
        }
    }

    // 调整堆的函数
    private static void heapify(int[] arr, int n, int i) {
        int largest = i; // 设当前节点为最大值
        int left = 2 * i + 1; // 左子节点
        int right = 2 * i + 2; // 右子节点

        // 如果左子节点比当前最大值大
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // 如果右子节点比当前最大值大
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // 如果最大值不是根节点，则交换，并递归调整
        if (largest != i) {
            swap(arr, i, largest);
            heapify(arr, n, largest);
        }
    }

    // 交换两个元素的值
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

```



## 计数排序

**计数排序（Counting Sort）** 是一种基于计数的非比较排序算法，适用于对**非负整数**进行排序。计数排序通过统计每个元素出现的次数，然后利用这些信息将元素直接放到它们在有序数组中的位置，从而实现排序。

计数排序的时间复杂度为 `O(n + k)`，其中 `n` 是输入数据的大小，`k` 是数据范围的大小。它特别适用于数据范围不大但数据量较多的场景。

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

### 1. 算法步骤

1. **找到最大值和最小值**：找到数组中最大值和最小值，以确定计数数组的范围。
2. **创建计数数组**：创建一个计数数组，数组长度为 `max - min + 1`，用来记录每个元素出现的次数。
3. **统计每个元素的出现次数**：遍历原数组，将每个元素出现的次数记录在计数数组中。
4. **累积计数**：将计数数组变为累积计数数组，使其表示元素在有序数组中的位置。
5. **回填到结果数组**：根据累积计数数组，回填到结果数组，得到最终的排序结果。

### 2. 动图演示

[![动图演示](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/countingSort.gif)](https://github.com/hustcc/JS-Sorting-Algorithm/blob/master/res/countingSort.gif)

```java
import java.util.Arrays;

public class CountingSort {
    // 计数排序函数
    public static void countingSort(int[] arr) {
        if (arr.length == 0) return;

        // 1. 找到数组中的最大值和最小值
        int max = arr[0];
        int min = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            } else if (arr[i] < min) {
                min = arr[i];
            }
        }

        // 2. 创建计数数组
        int range = max - min + 1;
        int[] count = new int[range];

        // 3. 统计每个元素的出现次数
        for (int i = 0; i < arr.length; i++) {
            count[arr[i] - min]++;
        }

        // 4. 计算累积计数，确定元素的最终位置
        for (int i = 1; i < count.length; i++) {
            count[i] += count[i - 1];
        }

        // 5. 创建结果数组，并根据累积计数将元素放到正确位置
        int[] output = new int[arr.length];
        for (int i = arr.length - 1; i >= 0; i--) {
            output[count[arr[i] - min] - 1] = arr[i];
            count[arr[i] - min]--;
        }

        // 6. 将排序好的结果复制回原数组
        for (int i = 0; i < arr.length; i++) {
            arr[i] = output[i];
        }
    }
}

```



## 桶排序

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。

桶排序（Bucket Sort）是一种基于**分配**的排序算法，尤其适用于**均匀分布**的数据。它通过将元素分布到多个桶中，分别对每个桶进行排序，最后将各个桶中的元素合并起来，得到一个有序数组。

桶排序的平均时间复杂度为 `O(n + k)`，其中 `n` 是数据的数量，`k` 是桶的数量。桶排序通常适用于小范围的、均匀分布的浮点数或整数。

为了使桶排序更加高效，我们需要做到这两点：

1. 在额外空间充足的情况下，尽量增大桶的数量
2. 使用的映射函数能够将输入的 N 个数据均匀的分配到 K 个桶中

同时，对于桶中元素的排序，选择何种比较排序算法对于性能的影响至关重要。

### 1. 算法步骤

1. **创建桶**：创建若干个桶，每个桶表示一个数值范围。
2. **将元素分配到桶中**：根据元素的大小，将它们分配到对应的桶中。
3. **对每个桶内部排序**：对每个桶中的元素分别进行排序（可以使用插入排序、快速排序等）。
4. **合并所有桶中的元素**：依次将每个桶中的元素合并起来，得到最终的有序数组。

![img](https://miro.medium.com/v2/resize:fit:1400/1*LwRT4hPsAKJ5iPrjGTwwMg.png)

```java
import java.util.ArrayList;
import java.util.Collections;

public class BucketSort {
    // 主函数：进行桶排序
    public static void bucketSort(float[] arr, int n) {
        if (n <= 0) return;

        // 1. 创建 n 个桶，每个桶是一个空的 ArrayList
        ArrayList<Float>[] buckets = new ArrayList[n];

        for (int i = 0; i < n; i++) {
            buckets[i] = new ArrayList<Float>();
        }

        // 2. 将数组中的元素分配到各个桶中
        for (int i = 0; i < n; i++) {
            int bucketIndex = (int) arr[i] * n; // 根据值分配桶
            buckets[bucketIndex].add(arr[i]);
        }

        // 3. 对每个桶中的元素进行排序
        for (int i = 0; i < n; i++) {
            Collections.sort(buckets[i]); // 可以使用任意内置排序算法
        }

        // 4. 合并所有桶中的元素，形成最终的排序数组
        int index = 0;
        for (int i = 0; i < n; i++) {
            for (Float value : buckets[i]) {
                arr[index++] = value;
            }
        }
    }

    // 测试主函数
    public static void main(String[] args) {
        float[] arr = { (float)0.42, (float)0.32, (float)0.33, (float)0.52, (float)0.37, (float)0.47, (float)0.51 };
        int n = arr.length;
        bucketSort(arr, n);

        System.out.println("排序后的数组：");
        for (float value : arr) {
            System.out.print(value + " ");
        }
    }
}

```

- 什么时候最快：当输入的数据可以均匀的分配到每一个桶中。
- 什么时候最慢：当输入的数据被分配到了同一个桶中。

> 思路一定要理解了，不背题哈，比如有些直接问你
>
> 已知一组记录的排序码为（46，79，56，38，40，80, 95，24），写出对其进行快速排序的第一趟的划分结果



## 基数排序

**基数排序（Radix Sort）** 是一种**非比较排序算法**，用于对整数或字符串等进行排序。它的核心思想是将数据按位（如个位、十位、百位等）进行排序，从低位到高位依次进行。基数排序的时间复杂度为 `O(n * k)`，其中 `n` 是待排序元素的个数，`k` 是数字的最大位数或字符串的长度。由于它不涉及比较操作，基数排序适用于一些特定的场景，如排序长度相同的字符串或范围固定的整数。

基数排序有两种实现方式：

- **LSD（Least Significant Digit）**：从最低位（个位）开始排序，常用的实现方式。
- **MSD（Most Significant Digit）**：从最高位开始排序。

基数排序是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也不是只能使用于整数。

### 1. 算法步骤（LSD 实现）

1. **确定最大位数**：找出待排序数据中最大数的位数。
2. **按位排序**：从最低位到最高位，对每一位进行排序。每次排序使用**稳定的排序算法**（如计数排序或桶排序），确保相同位数的元素相对位置不变。

### 2. 动图演示

[![动图演示](https://github.com/hustcc/JS-Sorting-Algorithm/raw/master/res/radixSort.gif)](https://github.com/hustcc/JS-Sorting-Algorithm/blob/master/res/radixSort.gif)

```java
import java.util.Arrays;

public class RadixSort {
    // 主函数：进行基数排序
    public static void radixSort(int[] arr) {
        // 找到数组中的最大数，确定最大位数
        int max = getMax(arr);

        // 从个位开始，对每一位进行排序
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countingSortByDigit(arr, exp);
        }
    }

    // 找到数组中的最大值
    private static int getMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }

    // 根据当前位数进行计数排序
    private static void countingSortByDigit(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n]; // 输出数组
        int[] count = new int[10]; // 计数数组（0-9，用于处理每一位上的数字）

        // 1. 统计每个数字在当前位的出现次数
        for (int i = 0; i < n; i++) {
            int digit = (arr[i] / exp) % 10;
            count[digit]++;
        }

        // 2. 计算累积计数
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // 3. 从右到左遍历数组，按当前位将元素放入正确位置
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }

        // 4. 将排序好的结果复制回原数组
        for (int i = 0; i < n; i++) {
            arr[i] = output[i];
        }
    }

}

```



## 希尔排序

希尔排序这个名字，来源于它的发明者希尔，也称作“缩小增量排序”，是插入排序的一种更高效的改进版本。但希尔排序是非稳定排序算法。

**希尔排序（Shell Sort）** 是一种**基于插入排序**的排序算法，又称为**缩小增量排序**，它通过将数组按一定间隔分成若干个子数组，分别进行插入排序，逐步缩小间隔，最终进行一次标准的插入排序。通过这种方式，希尔排序能够减少数据移动次数，使得整体排序过程更为高效。

希尔排序的时间复杂度依赖于**增量序列**的选择，通常在 `O(n^1.3)` 到 `O(n^2)` 之间。

### 1. 算法步骤

1. **确定增量序列**：首先确定一个增量序列 `gap`，通常初始的 `gap` 为数组长度的一半，然后逐步缩小。
2. **分组排序**：将数组按 `gap` 分组，对每个分组进行插入排序。`gap` 表示当前元素与其分组中的前一个元素的间隔。
3. **缩小增量并继续排序**：每次将 `gap` 缩小一半，重复分组排序过程，直到 `gap = 1`，即对整个数组进行一次标准的插入排序。
4. **最终排序完成**：当 `gap` 变为 1 时，希尔排序相当于执行了一次插入排序，此时数组已经接近有序，因此插入排序的效率非常高。

### 2. 动图演示

![img](https://mmbiz.qpic.cn/mmbiz_gif/951TjTgiabkzow2ORRzgpfHIGAKIAWlXm6GpRDRhiczgOdibbGBtpibtIhX4YRzibicUyEOSVh3JZBHtiaZPN30X1WOhA/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)

```java
import java.util.Arrays;

public class ShellSort {
    // 主函数：希尔排序
    public static void shellSort(int[] arr) {
        int n = arr.length;

        // 1. 初始 gap 为数组长度的一半
        for (int gap = n / 2; gap > 0; gap /= 2) {
            // 2. 对每个子数组进行插入排序
            for (int i = gap; i < n; i++) {
                int temp = arr[i];
                int j = i;

                // 3. 对当前分组进行插入排序
                while (j >= gap && arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                }

                // 将 temp 插入到正确的位置
                arr[j] = temp;
            }
        }
    }
}
```





## Reference:

- https://yuminlee2.medium.com/sorting-algorithms-summary-f17ea88a9174
