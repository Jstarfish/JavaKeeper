# 队列

## 一、前言

队列（queue）是一种采用先进先出(FIFO)策略的抽象数据结构，它的想法来自于生活中排队的策略。顾客在付款结账的时候，按照到来的先后顺序排队结账，先来的顾客先结账，后来的顾客后结账。

队列是只允许在一端进行插入操作，而在另一端进行删除操作的线性表。简称FIFO。允许插入的一端称为队尾，允许删除的一端称为队头。

![这里写图片描述](https://img-blog.csdn.net/20160509165022899)

1. 队列是一个有序列表，可以用数组或是链表来实现。

2. 遵循先入先出的原则。即:先存入队列的数据，要先取出。后存入的要后取出 

3. 示意图:(使用数组模拟队列示意图)

   ![image-20200720104833994](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200720104833994.png)

![img](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/08/14/screen-shot-2018-05-03-at-151021.png)

在 FIFO 数据结构中，将`首先处理添加到队列中的第一个元素`。

如上图所示，队列是典型的 FIFO 数据结构。插入（insert）操作也称作入队（enqueue），新元素始终被添加在`队列的末尾`。 删除（delete）操作也被称为出队（dequeue)。 你只能移除`第一个元素`。



## 二、基本属性

队列的核心理念是：**先进先出**，思考下我们可以对一个队列进行哪些操作

![img](https://i04piccdn.sogoucdn.com/9e55578c2bf71dfc)

普通队列的实现应该支持如下属性和操作：

- int front：队头

- int rear：队尾
- maxSize：队列最大容量 (可有可无，看你实现的是有界队列还是无界队列)

- `enqueue(value)`：向队列插入一个元素
- `dequeue`：从队列中取出一个元素
- `isEmpty()`：检查队列是否为空
- `isFull()`：检查队列是否已满
- `getSize()`：返回队列大小，即数据元素个数

抽象成一个接口如下：

```java
public interface MyQueue {

    /**
     * 返回队列大小
     */
    public int getSize();

    /**
     * 判断队列是否为空
     */
    public boolean isEmpty();

    /**
     * 判断队列是否已满
     */
    public boolean isFull();

    /**
     * 数据元素e进入队列
     */
    public void enqueue(Object e);

    /**
     * 队首出队元素
     */
    public Object dequeue();

    /**
     * 取队首元素
     */
    public Object peek();
}
```

看到这里，我那刚学 Java 的大一小弟弟指导我说，这可以用数组实现的。。。。。



## 三、实现

### 3.1 基于数组实现的队列

- 队列本身是有序列表，若使用数组的结构来存储队列的数据，则队列数组的声明如下图，其中 capacity是该队列的最大容量。
- 因为队列的输出、输入是分别从前后端来处理，因此需要两个变量 front 及 rear 分别记录队列前后端的下标， **front 会随着数据输出而改变，而 rear 则是随着数据输入而改变**，如图所示：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ggwdz93z62j30jk074whg.jpg)

- 当我们将数据存入队列时的处理需要有两个步骤:
  1. 将尾指针往后移：`rear+1` , 当 `front == rear`队列为空
  2. 若尾指针 rear 小于队列的最大下标 `capacity-1`，则将数据存入 rear 所指的数组元素中，否则无法存入数据，即队列满了。

```java
public class MyArrayQueue implements MyQueue {

    private int capacity; // 表示数组的最大容量
    private int front; // 队列头
    private int rear; // 队列尾
    private Object[] arr; // 该数据用于存放数据, 模拟队列

    // 创建队列的构造器
    public MyArrayQueue(int capacity) {
        this.capacity = capacity;
        arr = new Object[capacity];
        front = -1; // 指向队列头部，分析出front是指向队列头的前一个位置.
        rear = -1; // 指向队列尾，指向队列尾的数据(即就是队列最后一个数据)
    }

    public int getSize() {
        return rear - front;
    }

    public boolean isEmpty() {
        return rear == front;
    }

    public boolean isFull() {
        return rear == capacity - 1;
    }

    public void enqueue(Object e) {
        if (isFull()) {
            System.out.println("队列满，不能加入数据~");
            return;
        }
        rear++; // 让rear 后移
        arr[rear] = e;
    }

    public Object dequeue() {
        if (isEmpty()) {
            throw new RuntimeException("队列空，不能取数据");
        }
        front++; // front后移
        return arr[front];
    }

    public Object peek() {
        // 判断
        if (isEmpty()) {
            throw new RuntimeException("队列空的，没有数据~~");
        }
        return arr[front + 1];
    }
}
```



**缺点**

上面的实现很简单，但在某些情况下效率很低。 

假设我们分配一个最大长度为 5 的数组。当队列满时，我们想要循环利用的空间的话，在执行取出队首元素的时候，我们就必须将数组中其他所有元素都向前移动一个位置，时间复杂度就变成了 $O(n)$



![img](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/21/screen-shot-2018-07-21-at-153713.png)


为了解决这个问题就引出了我们接下来要说的循环队列。



### 3.2 循环队列

为了提高运算的效率，我们用另一种方式来表达数组中各单元的位置关系，将数组看做是一个环形的。当 rear 到达数组的最大下标时，重新指回数组下标为`0`的位置，这样就避免了数据迁移的低效率问题。

![image-20200720140533762](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200720140533762.png)

用循环数组实现的队列称为循环队列，我们将循环队列中从对首到队尾的元素按逆时针方向存放在循环数组中的一段连续的单元中。当新元素入队时，将队尾指针 rear 按逆时针方向移动一位即可，出队操作也很简单，只要将对首指针 front 逆时针方向移动一位即可。

可以看出用循环队列来实现队列可以在 $O(1)$ 时间内完成入队和出队操作。

当然队首和队尾指针也可以有不同的指向，例如也可以用队首指针 front 指向队首元素所在单元的前一个单元，或者用队尾指针 rear 指向队尾元素所在单元的方法来表示队列在循环数组中的位置。但是不论使用哪一种方法来指示队首与队尾元素，我们都要解决一个细节问题，即如何表示满队列和空队列。

当循环队列为空或者满的时候都会出现 front == rear 的情况，即无法通过条件 front == rear 来判别队列是”空”还是”满”。

解决这个问题的方法至少有三种：

1. 另设一布尔变量或标志变量以区别队列的空和满；

2. 使用一个计数器记录队列中元素的总数（即队列长度）。

3. 保留一个元素空间。也就是说，当队尾指针的下一个元素就是队首指针所指单元时，就停止入队。队列满时，数组中还有一个空闲单元。

   - 这种方式的话，由于 rear 可能比 front 大，也可能比 front 小，所以尽管他们只相差一个位置时是满的情况，但也可能是相差整整一圈。所以若队列的最大长度是 maxSize，那么队满的条件是 `(rear + 1) % maxSize == front`（取模的目的就是为了整合 rear 和 front 大小的问题），如下两种情况都是队满。

   - 此时判空条件仍是 front == rear，只是判满条件改变；

   ![img](https://alleniverson.gitbooks.io/data-structure-and-algorithms/4.%E9%98%9F%E5%88%97/img/%E5%BE%AA%E7%8E%AF%E9%98%9F%E5%88%97.png)

   ![image-20200720110825405](C:\Users\jiahaixin\AppData\Roaming\Typora\typora-user-images\image-20200720110825405.png)

   

3. ![](https://tva1.sinaimg.cn/large/007S8ZIlly1ggwer7ntcmj30f405etae.jpg)

```java
public class MyArrayQueue implements MyQueue {

    private int capacity;
    private int front;
    private int rear;
    private Object[] arr;

    // 创建队列的构造器
    public MyArrayQueue(int capacity) {
        this.capacity = capacity;
        arr = new Object[capacity];
        front = -1; // 指向队列头部，分析出front是指向队列头的前一个位置.
        rear = -1; // 指向队列尾，指向队列尾的数据(即就是队列最后一个数据)
    }

    public int getSize() {
        return rear - front;
    }

    public boolean isEmpty() {
        return rear == front;
    }

    public boolean isFull() {
        return rear == capacity - 1;
    }

    public void enqueue(Object e) {
        if (isFull()) {
            System.out.println("队列满，不能加入数据~");
            return;
        }
        rear++; // 让rear 后移
        arr[rear] = e;
    }

    public Object dequeue() {
        if (isEmpty()) {
            // 通过抛出异常
            throw new RuntimeException("队列空，不能取数据");
        }
        front++; // front后移
        return arr[front];
    }

    public Object peek() {
        if (isEmpty()) {
            throw new RuntimeException("队列空的，没有数据~~");
        }
        return arr[front + 1];
    }
}
```



### 3.3 链式队列

队列的链式存储结构，其实就是线性表的单链表，只不过它只能尾进头出而已，我们把它简称为链队列。

根据单链表的特点，选择链表的头部作为队首，链表的尾部作为队尾。除了链表头结点需要通过一个引用来指向之外，还需要一个对链表尾结点的引用，以方便队列的入队操作的实现。为此一共设置两个指针，一个队首指针和一个队尾指针。队首指针指向队首元素的前一个结点，即始终指向链表空的头结点，队尾指针指向队列当前队尾元素所在的结点。当队列为空时，队首指针与队尾指针均指向空的头结点。



**队头指针( front )**指向链队列的头结点，而**队尾指针( rear )**指向终端结点。非空链队列如下所示。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh1bmzvkjnj31860bngmm.jpg)

当**队列为空**时，front和rear都指向头结点。
<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gh1bpyg5ebj30e20bp0t0.jpg" alt="空链队列" style="zoom: 50%;" />

```java
public class MyLinkedQueue implements MyQueue {

    /**
     * 链表结构，肯定要先有个Node,放结点信息
     */
    class Node {
        private Object element;
        private Node next;

        public Node() {
            this(null,null);
        }

        public Node(Object ele, Node next){
            this.element = ele;
            this.next = next;
        }

        public Node getNext(){
            return next;
        }

        public void setNext(Node next){
            this.next = next;
        }
        public Object getData() {
            return element;
        }

        public void setData(Object obj) {
            element = obj;
        }
    }

    private Node front;
    private Node rear;
    private int size;

    public MyLinkedQueue() {
        this.front = new Node();
        this.rear = front;
        this.size = 0;
    }

    public int getSize() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public boolean isFull() {
        return false;
    }

    public void enqueue(Object e) {
        Node node = new Node(e, null);
        rear.setNext(node);
        rear = node;
        size++;
    }

    public Object dequeue() {
        if (size < 1) {
            throw new RuntimeException("队列空的，没有数据~~");
        }
        Node p = front.getNext();
        front.setNext(p.getNext());
        size--;
        if (size < 1) {
            rear = front;//如果队列为空，
        }
        return p.getData();
    }

    public Object peek() {
        Node node = front;
        if (size < 1) {
            throw new RuntimeException("队列空的，没有数据~~");
        }
        return front.getNext().getData();
    }
}
```



### 3.4 双端队列

双端队列是一种队头、队尾都可以进行入队、出队操作的队列，双端队列采用双向链表来实现，Java 中的`Deque` 接口是 double ended queue 的缩写，即双端队列，支持在队列的两端插入和删除元素，继承 `Queue`接口。具体实现方式，可以参考**`ArrayDeque` 和 `LinkedList`** 。

- `ArrayDeque` 类由数组支持。适合当作堆栈使用。
- `LinkedList` 类由链表支持。适合当作FIFO队列使用。



### 3.5 优先队列

优先队列为一种不必遵循队列先进先出(FIFO)特性的特殊队列，优先队列跟普通队列一样都只有一个队头和一个队尾并且也是从队头出队，队尾入队，不过在优先队列中，每次入队时，都会按照入队数据项的关键值进行排序(从大到小、从小到大)，这样保证了关键字最小的或者最大的项始终在队头，出队的时候优先级最高的就最先出队。

优先级队列可以用数组实现也可以用堆来实现。一般来说，用堆实现的效率更高。

Java 中的 PriorityQueue 就是优先队列的实现。下边我们用数组实现一个简单的优先队列，让最小值得元素始终在队头。

```java
public class MyPriorityQueue {

    private int maxSize;
    private long[] queArray;
    private int nItems;

    public MyPriorityQueue(int s) {
        maxSize = s;
        queArray = new long[maxSize];
        nItems = 0;
    }


    public int getSize() {
        return queArray.length;
    }

    public boolean isEmpty() {
        return (nItems == 0);
    }

    public boolean isFull() {
        return (nItems == maxSize);
    }

    public void enqueue(long e) {
        int j;
        if (nItems == 0) {
            queArray[nItems++] = e;
        } else {
            for (j = nItems - 1; j >= 0; j--) {
                if (e > queArray[j]) {
                    queArray[j + 1] = queArray[j];
                } else {
                    break;
                }
            }
            queArray[j + 1] = e;
            nItems++;
        }
    }

    public Object dequeue() {
        return queArray[--nItems];
    }

    public Object peek() {
        return queArray[nItems - 1];
    }
}
```





## 队列的应用





## 队列的广度优先搜索







## 







