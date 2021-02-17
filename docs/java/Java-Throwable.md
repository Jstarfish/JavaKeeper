# Java 中的异常机制

> 先问大家个面试题：在 Java 中，为什么有些异常，我们必须抛出或者 `try/catch`，像 `Thread.sleep(1000);` 这种必须处理 InterruptedException，否则编译都通过不了，而 NullPointerException 这类异常却“无所谓”？

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20201030111326.png)



## 概述

异常，就是我们 **写代码** 或者 **编译、运行代码** 时候遇到的各种状况，比如：参数不合法、找不到该类或该方法、数组下标越界、空指针异常等等。

作为一名合格的程序员，我们肯定要预见异常、处理异常。

Java 通过 Throwable 类的众多子类描述各种不同的异常。所以，**Java 异常都是对象，是 Throwable 子类的实例，描述了出现在一段编码中的错误条件**。当条件生成时，错误将引发异常。

Throwable 类是所以异常的“祖先”，他有两个“女儿”：Exception（异常）和 Error（错误），她两又有好多“子孙”。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20201030153338.png)

## Error

先说大女儿 Error（错误），她比较厉害，从名字就能看出，她都不算“异常”，是“错误”。是程序无法处理的错误，表示运行应用程序中较严重问题。

她代表的大多数错误和我们这些 Coder 执行的操作关系不大，而是指代码运行时 JVM 出现的问题。比如上图中的虚拟机错误、内存溢出、线程死锁这些，这些错误是不可查的，我们写代码时候可不好把控。

当遇到这类错误的时候，JVM 一般会选择终止线程。可以说这个对象很是棘手。

> 对于设计合理的应用程序来说，即使确实发生了错误，本质上也不应该试图去处理它所引起的异常状况。



## Exception

接着说二女儿 Exception，Exception（异常）的“子女”又分两大阵营：**运行时异常（RuntimeException，又叫非检查异常)**和**非运行时异常**(编译异常，也叫检查异常)。

程序中应当尽可能去处理这些异常。

### 运行时异常

运行时异常都是 RuntimeException 类及其子类，比如 NullPointerException、IndexOutOfBoundsException 等

这些异常是不检查异常，程序中可以选择捕获处理，也可以不处理。比如遇到这些错误，我们再 IDEA 中也不会报错，这类错误一般都是由于我们程序逻辑错误造成的，比如数组长度明明只有 10，你却要获取索引是 11 的元素，这类错误应该在 Coding 的时候就避免掉。

运行时异常的特点是 Java 编译器不会检查它，也就是说，当程序中可能出现这类异常，即使没有用 try-catch 语句捕获它，也没有用 throws 子句声明抛出它，也会编译通过。

### 非运行时异常 （编译异常、检查异常）

RuuntimeException 以外的异常，都属于检查异常。也就是必须处理的异常，否则程序无法正常编译。这个我们代码中就随处可见了，比如 IOException、ClassNotFoundException 这类必须抛出或处理的类异常。

当然，我们写代码一般通过 IDEA，这类检查异常，都会在编译器中报错，所以也很好识别。



最后附一张完整的图：

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20201030153846.png)

## 异常处理最佳实践

#### 不要忽略捕捉的异常

```java
catch (NoSuchMethodException e) {
   return null;
}
```

虽然捕捉了异常但是却没有做任何处理，除非你确信这个异常可以忽略，不然不应该这样做。这样会导致外面无法知晓该方法发生了错误，无法确定定位错误原因。

#### 在你的方法里抛出定义具体的检查性异常

```java
public void foo() throws Exception { //错误方式
}
```

一定要避免出现上面的代码示例，它破坏了检查性异常的目的。 声明你的方法可能抛出的具体检查性异常，如果只有太多这样的检查性异常，你应该把它们包装在你自己的异常中，并在异常消息中添加信息。 如果可能的话，你也可以考虑代码重构。

```java
public void foo() throws SpecificException1, SpecificException2 { //正确方式
}
```

#### 捕获具体的子类而不是捕获 Exception 类

```java
try {
   someMethod();
} catch (Exception e) { //错误方式
   LOGGER.error("method has failed", e);
}
```

捕获异常的问题是，如果稍后调用的方法为其方法声明添加了新的检查性异常，则开发人员的意图是应该处理具体的新异常。如果你的代码只是捕获异常（或 Throwable），永远不会知道这个变化，以及你的代码现在是错误的，并且可能会在运行时的任何时候中断。

#### 永远不要捕获 Throwable 类

这是一个更严重的麻烦，因为 Java Error 也是 Throwable 的子类，Error 是 JVM 本身无法处理的不可逆转的条件，对于某些 JVM 的实现，JVM 可能实际上甚至不会在 Error 上调用 catch 子句。

#### 始终正确包装自定义异常中的异常，以便堆栈跟踪不会丢失

```java
catch (NoSuchMethodException e) {
   throw new MyServiceException("Some information: " + e.getMessage());  //错误方式
}
```

这破坏了原始异常的堆栈跟踪，并且始终是错误的，正确的做法是：

```java
catch (NoSuchMethodException e) {
   throw new MyServiceException("Some information: " , e);  //正确方式
}复
```

#### 要么记录异常要么抛出异常，但不要一起执行

```java
catch (NoSuchMethodException e) {  
//错误方式 
   LOGGER.error("Some information", e);
   throw e;
}
```

正如上面的代码中，记录和抛出异常会在日志文件中产生多条日志消息，代码中存在单个问题，并且对尝试分析日志的同事很不友好。

#### finally 块中永远不要抛出任何异常

```java
try {
  someMethod();  //Throws exceptionOne
} finally {
  cleanUp();    //如果finally还抛出异常，那么exceptionOne将永远丢失
}
```

只要 cleanUp() 永远不会抛出任何异常，上面的代码没有问题，但是如果 someMethod() 抛出一个异常，并且在 finally 块中，cleanUp() 也抛出另一个异常，那么程序只会把第二个异常抛出来，原来的第一个异常（正确的原因）将永远丢失。如果在 finally 块中调用的代码可能会引发异常，请确保要么处理它，要么将其记录下来。永远不要让它从 finally 块中抛出来。

#### 始终只捕获实际可处理的异常

```java
catch (NoSuchMethodException e) {
   throw e; //避免这种情况，因为它没有任何帮助
}
```

这是最重要的概念，不要为了捕捉异常而捕捉，只有在想要处理异常时才捕捉异常，或者希望在该异常中提供其他上下文信息。如果你不能在 catch 块中处理它，那么最好的建议就是不要只为了重新抛出它而捕获它。

#### 不要使用 printStackTrace() 语句或类似的方法

完成代码后，切勿忽略 printStackTrace()，最终别人可能会得到这些堆栈，并且对于如何处理它完全没有任何方法，因为它不会附加任何上下文信息。

#### 对于不打算处理的异常，直接使用 finally

```java
try {
  someMethod();  //Method 2
} finally {
  cleanUp();    //do cleanup here
}
```

这是一个很好的做法，如果在你的方法中你正在访问 Method 2，而 Method 2 抛出一些你不想在 Method 1 中处理的异常，但是仍然希望在发生异常时进行一些清理，然后在 finally 块中进行清理，不要使用 catch 块。

#### 记住早 throw 晚 catch 原则

这可能是关于异常处理最著名的原则，简单说，应该尽快抛出(throw)异常，并尽可能晚地捕获(catch)它。应该等到有足够的信息来妥善处理它。

这个原则隐含地说，你将更有可能把它放在低级方法中，在那里你将检查单个值是否为空或不适合。而且你会让异常堆栈跟踪上升好几个级别，直到达到足够的抽象级别才能处理问题。

#### 在异常处理后清理资源

如果你正在使用数据库连接或网络连接等资源，请确保清除它们。如果你正在调用的 API 仅使用非检查性异常，则仍应使用 try-finally 块来清理资源。 在 try 模块里面访问资源，在 finally 里面最后关闭资源。即使在访问资源时发生任何异常，资源也会优雅地关闭。

#### 只抛出和方法相关的异常

相关性对于保持应用程序清洁非常重要。一种尝试读取文件的方法，如果抛出 NullPointerException，那么它不会给用户任何相关的信息。相反，如果这种异常被包裹在自定义异常中，则会更好。NoSuchFileFoundException 则对该方法的用户更有用。

#### 切勿在程序中使用异常来进行流程控制

不要在项目中出现使用异常来处理应用程序逻辑。永远不要这样做，它会使代码很难阅读和理解。

#### 尽早验证用户输入以在请求处理的早期捕获异常

始终要在非常早的阶段验证用户输入，甚至在达到 controller 之前，它将帮助你把核心应用程序逻辑中的异常处理代码量降到最低。如果用户输入出现错误，还可以保证与应用程序一致。

例如：如果在用户注册应用程序中，遵循以下逻辑：

1. 验证用户
2. 插入用户
3. 验证地址
4. 插入地址
5. 如果出问题回滚一切

这是不正确的做法，它会使数据库在各种情况下处于不一致的状态，应该首先验证所有内容，然后将用户数据置于 dao 层并进行数据库更新。正确的做法是：

1. 验证用户
2. 验证地址
3. 插入用户
4. 插入地址
5. 如果问题回滚一切

#### 一个异常只能包含在一个日志中

```java
LOGGER.debug("Using cache sector A");
LOGGER.debug("Using retry sector B");复制代码
```

不要像上面这样做，对多个 `LOGGER.debug()` 调用使用多行日志消息可能在你的测试用例中看起来不错，但是当它在具有 100 个并行运行的线程的应用程序服务器的日志文件中显示时，所有信息都输出到相同的日志文件，即使它们在实际代码中为前后行，但是在日志文件中这两个日志消息可能会间隔 100 多行。应该这样做：

```java
LOGGER.debug("Using cache sector A, using retry sector B");复制代码
```

#### 将所有相关信息尽可能地传递给异常

有用的异常消息和堆栈跟踪非常重要，如果你的日志不能定位异常位置，那要日志有什么用呢？

#### 终止掉被中断线程

```java
while (true) {
  try {
    Thread.sleep(100000);
  } catch (InterruptedException e) {} //别这样做
  doSomethingCool();
}
```

InterruptedException 异常提示应该停止程序正在做的事情，比如事务超时或线程池被关闭等。

应该尽最大努力完成正在做的事情，并完成当前执行的线程，而不是忽略 InterruptedException。修改后的程序如下：

```java
while (true) {
  try {
    Thread.sleep(100000);
  } catch (InterruptedException e) {
    break;
  }
}
doSomethingCool();
```

#### 对于重复的 try-catch，使用模板方法

在代码中有许多类似的 catch 块是无用的，只会增加代码的重复性，针对这样的问题可以使用模板方法。

例如，在尝试关闭数据库连接时的异常处理。

```java
class DBUtil{
    public static void closeConnection(Connection conn){
        try{
            conn.close();
        } catch(Exception ex){
            //Log Exception - Cannot close connection
        }
    }
}
```

这类的方法将在应用程序很多地方使用。不要把这块代码放的到处都是，而是定义上面的方法，然后像下面这样使用它：

```java
public void dataAccessCode() {
    Connection conn = null;
    try{
        conn = getConnection();
        ....
    } finally{
        DBUtil.closeConnection(conn);
    }
}
```

#### 使用 JavaDoc 中记录应用程序中的所有异常

把用 JavaDoc 记录运行时可能抛出的所有异常作为一种习惯，其中也尽量包括用户应该遵循的操作，以防这些异常发生。




### 参考与来源：

https://blog.csdn.net/fuzhongmin05/article/details/77600410

https://juejin.im/post/6844903981299433479



