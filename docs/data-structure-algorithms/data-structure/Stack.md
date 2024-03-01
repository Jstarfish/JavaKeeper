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

注意：本文所说的栈是数据结构中的栈，而不是内存模型中栈。

栈（stack）是限定仅在表尾一端进行插入或删除操作的**特殊线性表**。又称为堆栈。

对于栈来说, 允许进行插入或删除操作的一端称为栈顶（top），而另一端称为栈底（bottom）。不含元素栈称为空栈，向栈中插入一个新元素称为入栈或压栈， 从栈中删除一个元素称为出栈或退栈。

假设有一个栈Ｓ＝（a1, a2, …, an)，a1先进栈， an最后进栈。称 a1 为栈底元素，an 为栈顶元素。出栈时只允许在栈顶进行，所以 an 先出栈，a1最后出栈。因此又称栈为后进先出（Last In First Out，LIFO）的线性表。

栈（stack），是一种线性存储结构，它有以下几个特点：

- 栈中数据是按照"后进先出（LIFO, Last In First Out）"方式进出栈的。
- 向栈中添加/删除数据时，只能从栈顶进行操作。

![](https://img.starfish.ink/data-structure/applications-of-stack-in-data-structure.png)



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

由于栈的操作都是在栈顶完成，因此在顺序栈的实现中需要附设一个指针 top 来动态地指示栈顶元素在数组中的位置。通常 top 可以用栈顶元素所在的数组下标来表示，`top=-1` 时表示空栈。

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

![](https://img.starfish.ink/data-structure/stack-linked.png)

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

### [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)

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

**思路**

左括号进栈，右括号匹配出栈

- 栈先入后出特点恰好与本题括号排序特点一致，即若遇到左括号时，把右括号入栈，遇到右括号时将对应栈顶元素与其对比并出栈，相同的话说明匹配，继续遍历，遍历完所有括号后 `stack` 仍然为空，说明是有效的。

```java
  public boolean isValid(String s) {
      if(s.isEmpty()) {
          return true;
      }
      Stack<Character> stack=new Stack<Character>();
      //字符串转为字符串数组 遍历
      for(char c:s.toCharArray()){
          if(c=='(') {
              stack.push(')');
          } else if(c=='{') {
              stack.push('}');
          } else if(c=='[') {
              stack.push(']');
          } else if(stack.empty()||c!=stack.pop()) {
              return false;
          }
      }
      return stack.empty();
  }
```



### [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)

>给定一个整数数组 `temperatures` ，表示每天的温度，返回一个数组 `answer` ，其中 `answer[i]` 是指对于第 `i`天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。
>
>```
>输入: temperatures = [73,74,75,71,69,72,76,73]
>输出: [1,1,4,2,1,1,0,0]
>```

**思路**：

维护一个存储下标的单调栈，从栈底到栈顶的下标对应的温度列表中的温度依次递减。如果一个下标在单调栈里，则表示尚未找到下一次温度更高的下标。

正向遍历温度列表。

1. 栈为空，先入栈
2. 如果栈内有元素，用栈顶元素对应的温度和当前温度比较，temperatures[i] > temperatures[pre] 的话，就把栈顶元素移除，把 pre 对应的天数设置为 i-pre，重复操作区比较，知道栈为空或者栈顶元素对应的温度小于当前问题，把当前温度索引入栈

```java
  public int[] dailyTemperatures_stack(int[] temperatures) {
      int length = temperatures.length;
      int[] result = new int[length];
      Stack<Integer> stack = new Stack<>();
      for (int i = 0; i < length; i++) {
          while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
              int pre = stack.pop();
              result[pre] = i - pre;
          }
          stack.add(i);
      }
      return result;
  }
```



### [150. 逆波兰表达式求值](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)

> 给你一个字符串数组 `tokens` ，表示一个根据 [逆波兰表示法](https://baike.baidu.com/item/逆波兰式/128437) 表示的算术表达式。
>
> 请你计算该表达式。返回一个表示表达式值的整数。
>
> **注意：**
>
> - 有效的算符为 `'+'`、`'-'`、`'*'` 和 `'/'` 。
> - 每个操作数（运算对象）都可以是一个整数或者另一个表达式。
> - 两个整数之间的除法总是 **向零截断** 。
> - 表达式中不含除零运算。
> - 输入是一个根据逆波兰表示法表示的算术表达式。
> - 答案及所有中间计算结果可以用 **32 位** 整数表示。
>
> ```
> 输入：tokens = ["4","13","5","/","+"]
> 输出：6
> 解释：该算式转化为常见的中缀算术表达式为：(4 + (13 / 5)) = 6
> ```

> **逆波兰表达式：**
>
> 逆波兰表达式是一种后缀表达式，所谓后缀就是指算符写在后面。
>
> - 平常使用的算式则是一种中缀表达式，如 `( 1 + 2 ) * ( 3 + 4 )` 。
> - 该算式的逆波兰表达式写法为 `( ( 1 2 + ) ( 3 4 + ) * )` 。
>
> 逆波兰表达式主要有以下两个优点：
>
> - 去掉括号后表达式无歧义，上式即便写成 `1 2 + 3 4 + * `也可以依据次序计算出正确结果。
> - 适合用栈操作运算：遇到数字则入栈；遇到算符则取出栈顶两个数字进行计算，并将结果压入栈中

**思路**：逆波兰表达式严格遵循「从左到右」的运算。

计算逆波兰表达式的值时，使用一个栈存储操作数，从左到右遍历逆波兰表达式，进行如下操作：

- 如果遇到操作数，则将操作数入栈；

- 如果遇到运算符，则将两个操作数出栈，其中先出栈的是右操作数，后出栈的是左操作数，使用运算符对两个操作数进行运算，将运算得到的新操作数入栈。

整个逆波兰表达式遍历完毕之后，栈内只有一个元素，该元素即为逆波兰表达式的值。

```java
  public int evalRPN(String[] tokens) {
      List<String> charts = Arrays.asList("+", "-", "*", "/");
      Stack<Integer> stack = new Stack<>();
      for (String s : tokens) {
          if (!charts.contains(s)) {
              stack.push(Integer.parseInt(s));
          } else {
              int num2 = stack.pop();
              int num1 = stack.pop();
              switch (s) {
                  case "+":
                      stack.push(num1 + num2);
                      break;
                  case "-":
                      stack.push(num1 - num2);
                      break;
                  case "*":
                      stack.push(num1 * num2);
                      break;
                  case "/":
                      stack.push(num1 / num2);
                      break;
              }
          }
      }
      return stack.peek();
  }
}
```



### [155. 最小栈](https://leetcode.cn/problems/min-stack/)

> 设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。
>
> 实现 `MinStack` 类:
>
> - `MinStack()` 初始化堆栈对象。
> - `void push(int val)` 将元素val推入堆栈。
> - `void pop()` 删除堆栈顶部的元素。
> - `int top()` 获取堆栈顶部的元素。
> - `int getMin()` 获取堆栈中的最小元素。

**思路**： 添加一个辅助栈，这个栈同时保存的是每个数字 `x` 进栈的时候的**值 与 插入该值后的栈内最小值**。

```java
import java.util.Stack;

public class MinStack {

    // 数据栈
    private Deque<Integer> data;
    // 辅助栈
    private  Deque<Integer> helper;

    public MinStack() {
        data = new LinkedList<Integer>();
        helper = new LinkedList<Integer>();
        helper.push(Integer.MAX_VALUE);
    }

    public void push(int x) {
        data.push(x);
        helper.push(Math.min(helper.peek(), x));
    }

    public void pop() {
        data.pop();
        helper.pop();
    }

    public int top() {
        return data.peek();
    }

    public int getMin() {
        return helper.peek();
    }

}
```



### [227. 基本计算器 II](https://leetcode.cn/problems/basic-calculator-ii/)

> 给你一个字符串表达式 `s` ，请你实现一个基本计算器来计算并返回它的值。
>
> 整数除法仅保留整数部分。
>
> 你可以假设给定的表达式总是有效的。所有中间结果将在 `[-231, 231 - 1]` 的范围内。
>
> **注意：**不允许使用任何将字符串作为数学表达式计算的内置函数，比如 `eval()` 。
>
> ```
> 输入：s = "3+2*2"
> 输出：7
> ```

**思路**：和逆波兰表达式有点像

- 加号：将数字压入栈；
- 减号：将数字的相反数压入栈；
- 乘除号：计算数字与栈顶元素，并将栈顶元素替换为计算结果。

> 这个得先知道怎么把字符串形式的正整数转成 int
>
> ```java
> String s = "458";
> 
> int n = 0;
> for (int i = 0; i < s.length(); i++) {
>     char c = s.charAt(i);
>     n = 10 * n + (c - '0');
> }
> // n 现在就等于 458
> ```
>
> 这个还是很简单的吧，老套路了。但是即便这么简单，依然有坑：**`(c - '0')` 的这个括号不能省略，否则可能造成整型溢出**。
>
> 因为变量 `c` 是一个 ASCII 码，如果不加括号就会先加后减，想象一下 `s` 如果接近 INT_MAX，就会溢出。所以用括号保证先减后加才行。

```java
  public static int calculate(String s) {
      Stack<Integer> stack = new Stack<>();
      int length = s.length();
      int num = 0;
      char operator = '+';
      for (int i = 0; i < length; i++) {
          if (Character.isDigit(s.charAt(i))) {
              // 转为 int
              num = num * 10 + (s.charAt(i) - '0');
          }
          // 计算符 （排除空格） 
          if (!Character.isDigit(s.charAt(i)) && s.charAt(i) != ' ' || i == length - 1) {
            // switch (s.charAt(i)){ 这里是要和操作符比对，考虑第一次
            switch (operator) {
                  case '+':
                      stack.push(num);
                      break;
                  case '-':
                      stack.push(-num);
                      break;
                  case '*':
                      stack.push(stack.pop() * num);
                      break;
                  default:
                      stack.push(stack.pop() / num);
              }
              operator = s.charAt(i);
              num = 0;
          }
      }
      int result = 0;
      while (!stack.isEmpty()) {
          result += stack.pop();
      }
      return result;
  }
```

