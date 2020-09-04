> 文章收录在 GitHub [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱

## 模板模式——独一无二的对象

模板，顾名思义，它是一个固定化、标准化的东西。



## 概述

在阎宏博士的《JAVA与模式》一书中开头是这样描述模板方法（Template Method）模式的：

> 模板方法模式是类的行为模式。准备一个抽象类，将部分逻辑以具体方法以及具体构造函数的形式实现，然后声明一些抽象方法来迫使子类实现剩余的逻辑。不同的子类可以以不同的方式实现这些抽象方法，从而对剩余的逻辑有不同的实现。这就是模板方法模式的用意。

模板方法模式是所有模式中最为常见的几个模式之一，是**基于继承**的代码复用的基本技术



![模板方法方案](https://sourcemaking.com/files/v2/content/patterns/Template_Method.png)



- FrameworkClass 包含 templateMethod() 方法，模板方法应该是 final 修饰的，不允许子类重写，
- **AbstractClass** contains the templateMethod() which should be made final so that it cannot be overridden. This template method makes use of other operations available in order to run the algorithm but is decoupled for the actual implementation of these methods. All operations used by this template method are made abstract, so their implementation is deferred to subclasses.
- **ConcreteClass** implements all the operations required by the templateMethod that were defined as abstract in the parent class. There can be many different ConcreteClasses.



![模板方法示例](https://sourcemaking.com/files/v2/content/patterns/Template_method_example.png)

我们以千篇一律的程序员日常为例，起床，挤地铁，工作（写代码，测试，），加班（Java程序员留下加班），睡觉









**优点：** 1、封装不变部分，扩展可变部分。 2、提取公共代码，便于维护。 3、行为由父类控制，子类实现。

**缺点：**每一个不同的实现都需要一个子类来实现，导致类的个数增加，使得系统更加庞大。

**使用场景：** 1、有多个子类共有的方法，且逻辑相同。 2、重要的、复杂的方法，可以考虑作为模板方法。

**注意事项：**为防止恶意操作，一般模板方法都加上 final 关键词。







参考：https://sourcemaking.com/design_patterns/template_method