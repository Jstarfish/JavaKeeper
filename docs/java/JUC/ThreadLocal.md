## ThreadLocal

ThreadLocal是一个关于创建线程局部变量的类。是`java.lang` 包下的类

通常情况下，我们创建的变量是可以被任何一个线程访问并修改的。而使用ThreadLocal创建的变量只能被当前线程访问，其他线程则无法访问和修改。



# ThreadLocal解决什么问题

由于 ThreadLocal 支持范型，如 ThreadLocal< StringBuilder >，为表述方便，后文用 **变量** 代表 ThreadLocal 本身，而用 **实例** 代表具体类型（如 StringBuidler ）的实例。

## 不恰当的理解

写这篇文章的一个原因在于，网上很多博客关于 ThreadLocal 的适用场景以及解决的问题，描述的并不清楚，甚至是错的。下面是常见的对于 ThreadLocal的介绍

> ThreadLocal为解决多线程程序的并发问题提供了一种新的思路
> ThreadLocal的目的是为了解决多线程访问资源时的共享问题

还有很多文章在对比 ThreadLocal 与 synchronize 的异同。既然是作比较，那应该是认为这两者解决相同或类似的问题。

上面的描述，问题在于，ThreadLocal 并不解决多线程 **共享** 变量的问题。既然变量不共享，那就更谈不上同步的问题。

## 合理的理解

ThreadLoal 变量，它的基本原理是，同一个 ThreadLocal 所包含的对象（对ThreadLocal< String >而言即为 String 类型变量），在不同的 Thread 中有不同的副本（实际是不同的实例，后文会详细阐述）。这里有几点需要注意

- 因为每个 Thread 内有自己的实例副本，且该副本只能由当前 Thread 使用。这是也是 ThreadLocal 命名的由来
- 既然每个 Thread 有自己的实例副本，且其它 Thread 不可访问，那就不存在多线程间共享的问题
- 既无共享，何来同步问题，又何来解决同步问题一说？



那 ThreadLocal 到底解决了什么问题，又适用于什么样的场景？

ThreadLocal 提供了线程本地的实例。它与普通变量的区别在于，每个使用该变量的线程都会初始化一个完全独立的实例副本。ThreadLocal 变量通常被`private static`修饰。当一个线程结束时，它所使用的所有 ThreadLocal 相对的实例副本都可被回收。



总的来说，**ThreadLocal 适用于每个线程需要自己独立的实例且该实例需要在多个方法中被使用，也即变量在线程间隔离而在方法或类间共享的场景。**后文会通过实例详细阐述该观点。另外，该场景下，并非必须使用 ThreadLocal ，其它方式完全可以实现同样的效果，只是 ThreadLocal 使得实现更简洁。





# ThreadLocal原理







## 参考

http://www.jasongj.com/java/threadlocal/