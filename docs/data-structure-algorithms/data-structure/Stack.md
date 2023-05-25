---
title: Stack
date: 2023-05-09
tags: 
 - Stack
categories: data-structure
---

![](https://img.starfish.ink/spring/stack-banner.png)

> 栈（stack）又名堆栈，它是**一种运算受限的线性表**。 限定仅在表尾进行插入和删除操作的线性表。 



## 一、概述

### 定义

注意：本文所说的栈是数据结构中的栈，而不是内存模型中栈

栈（stack）是限定仅在表尾一端进行插入或删除操作的**特殊线性表**。又称为堆栈。

对于栈来说, 允许进行插入或删除操作的一端称为栈顶（top），而另一端称为栈底（bottom）。不含元素栈称为空栈，向栈中插入一个新元素称为入栈或压栈， 从栈中删除一个元素称为出栈或退栈。

假设有一个栈Ｓ＝（a1, a2, …, an)，a1先进栈， an最后进栈。称 a1 为栈底元素，an 为栈顶元素。出栈时只允许在栈顶进行，所以 an 先出栈，a1最后出栈。因此又称栈为后进先出（Last In First Out，LIFO）的线性表。

栈（stack），是一种线性存储结构，它有以下几个特点：

- 栈中数据是按照"后进先出（LIFO, Last In First Out）"方式进出栈的。
- 向栈中添加/删除数据时，只能从栈顶进行操作。

![](https://static.javatpoint.com/ds/images/applications-of-stack-in-data-structure.png)



### 基本操作

栈的基本操作除了进栈 `push()`，出栈 `pop()` 之外，还有判空 `isEmpty()`、取栈顶元素 `peek()` 等操作。

抽象成接口如下：

```java
public interface MyStack {

    /**
     * 返回堆栈的大小
     */
    public int getSize();

    /**
     * 判断堆栈是否为空
     */
    public boolean isEmpty();

    /**
     * 入栈
     */
    public void push(Object e);

    /**
     * 出栈，并删除
     */
    public Object pop();

    /**
     * 返回栈顶元素
     */
    public Object peek();
}
```



和线性表类似，栈也有两种存储结构：顺序存储和链式存储。

实际上，栈既可以用数组来实现，也可以用链表来实现。用数组实现的栈，我们叫作**顺序栈**，用链表实现的栈，我们叫作**链式栈**。

## 二、栈的顺序存储与实现

顺序栈是使用顺序存储结构实现的栈，即利用一组地址连续的存储单元依次存放栈中的数据元素。由于栈是一种特殊的线性表，因此在线性表的顺序存储结构的基础上，选择线性表的一端作为栈顶即可。那么根据数组操作的特性，选择数组下标大的一端，即线性表顺序存储的表尾来作为栈顶，此时入栈、出栈操作可以 $O(1)$ 时间完成。

由于栈的操作都是在栈顶完成，因此在顺序栈的实现中需要附设一个指针 top 来动态地指示栈顶元素在数组中的位置。通常 top 可以用栈顶元素所在的数组下标来表示，top=-1时表示空栈。

栈在使用过程中所需的最大空间难以估计，所以，一般构造栈的时候不应设定最大容量。一种合理的做法和线性表类似，先为栈分配一个基本容量，然后在实际的使用过程中，当栈的空间不够用时再倍增存储空间。

```java
public class MyArrayStack implements MyStack {

    private final int capacity = 2;  //默认容量
    private Object[] arrs;   //数据元素数组
    private int top;   //栈顶指针

    MyArrayStack(){
        top = -1;
        arrs = new Object[capacity];
    }

    public int getSize() {
        return top + 1;
    }

    public boolean isEmpty() {
        return top < 0;
    }

    public void push(Object e) {
        if(getSize() >= arrs.length){
           expandSapce();  //扩容
        }
        arrs[++top]=e;
    }

    private void expandSapce() {
        Object[] a = new Object[arrs.length * 2];
        for (int i = 0; i < arrs.length; i++) {
            a[i] = arrs[i];
        }
        arrs = a;
    }

    public Object pop() {
        if(getSize()<1){
            throw new RuntimeException("栈为空");
        }
        Object obj = arrs[top];
        arrs[top--] = null;
        return obj;
    }

    public Object peek() {
        if(getSize()<1){
            throw new RuntimeException("栈为空");
        }
        return arrs[top];
    }
}
```

以上基于数据实现的栈代码并不难理解。由于有 top 指针的存在，所以`size()`、`isEmpty()`方法均可在 $O(1) $ 时间内完成。`push()`、`pop()`和`peek()`方法，除了需要`ensureCapacity()`外，都执行常数基本操作，因此它们的运行时间也是 $O(1)$



## 三、栈的链式存储与实现

栈的链式存储即采用链表实现栈。当采用单链表存储线性表后，根据单链表的操作特性选择单链表的头部作为栈顶，此时，入栈和出栈等操作可以在  $O(1)$ 时间内完成。

由于栈的操作只在线性表的一端进行，在这里使用带头结点的单链表或不带头结点的单链表都可以。使用带头结点的单链表时，结点的插入和删除都在头结点之后进行；使用不带头结点的单链表时，结点的插入和删除都在链表的首结点上进行。

下面以不带头结点的单链表为例实现栈，如下示意图所示：

![不带头结点单链表栈示意图](https://tva1.sinaimg.cn/large/007S8ZIlly1gh4n6ws71lj3106050aa4.jpg)

在上图中，top 为栈顶结点的引用，始终指向当前栈顶元素所在的结点。若 top 为null，则表示空栈。入栈操作是在 top 所指结点之前插入新的结点，使新结点的 next 域指向 top，top 前移即可；出栈则直接让 top 后移即可。

```java
public class MyLinkedStack implements MyStack {

    class Node {
        private Object element;
        private Node next;

        public Node() {
            this(null, null);
        }

        public Node(Object ele, Node next) {
            this.element = ele;
            this.next = next;
        }

        public Node getNext() {
            return next;
        }

        public void setNext(Node next) {
            this.next = next;
        }

        public Object getData() {
            return element;
        }

        public void setData(Object obj) {
            element = obj;
        }
    }

    private Node top;
    private int size;

    public MyLinkedStack() {
        top = null;
        size = 0;
    }

    public int getSize() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public void push(Object e) {
        Node node = new Node(e, top);
        top = node;
        size++;
    }

    public Object pop() {
        if (size < 1) {
            throw new RuntimeException("堆栈为空");
        }
        Object obj = top.getData();
        top = top.getNext();
        size--;
        return obj;
    }

    public Object peek() {
        if (size < 1) {
            throw new RuntimeException("堆栈为空");
        }
        return top.getData();
    }
}
```

上述 `MyLinkedStack` 类中有两个成员变量，其中 `top` 表示首结点，也就是栈顶元素所在的结点；`size` 指示栈的大小，即栈中数据元素的个数。不难理解，所有的操作均可以在 $O(1)$ 时间内完成。



## 四、JDK  中的栈实现 Stack

Java 工具包中的 Stack 是继承于 Vector(矢量队列)的，由于 Vector 是通过数组实现的，这就意味着，Stack 也是通过数组实现的，而非链表。当然，我们也可以将 LinkedList 当作栈来使用。

### Stack的继承关系

```java
java.lang.Object
     java.util.AbstractCollection<E>
        java.util.AbstractList<E>
            java.util.Vector<E>
                 java.util.Stack<E>

public class Stack<E> extends Vector<E> {}
```





## 五、栈应用

栈有一个很重要的应用，在程序设计语言里实现了递归。

### 有效的括号

>给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串，判断字符串是否有效。
>
>有效字符串需满足：
>
>1. 左括号必须用相同类型的右括号闭合。
>2. 左括号必须以正确的顺序闭合。
>
>注意空字符串可被认为是有效字符串。
>
>```
>输入: "{[]}"
>输出: true
>输入: "([)]"
>输出: false
>```







>请根据每日 `气温` 列表，重新生成一个列表。对应位置的输出为：要想观测到更高的气温，至少需要等待的天数。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。
>
>例如，给定一个列表 `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`，你的输出应该是 `[1, 1, 4, 2, 1, 1, 0, 0]`。
>
>**提示：**`气温` 列表长度的范围是 `[1, 30000]`。每个气温的值的均为华氏度，都是在 `[30, 100]` 范围内的整数。





> 逆波兰表达式求值