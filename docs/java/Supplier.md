## 函数式接口

### 1. 什么是函数式接口

- 只包含一个抽象方法的接口，称为函数式接口，该抽象方法也被称为函数方法。 我们熟知的Comparator和Runnable、Callable就属于函数式接口。
- 这样的接口这么简单，都不值得在程序中定义，所以，JDK8在 `java.util.function` 中定义了几个标准的函数式接口，供我们使用。[Package java.util.function](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)
- 可以通过 Lambda 表达式来创建该接口的对象。（若 Lambda 表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方法上进行声明）。
- 我们可以在任意函数式接口上使用 **@FunctionalInterface** 注解， 这样做可以检查它是否是一个函数式接口，同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口。



### 2. 自定义函数式接口

```java
@FunctionalInterface    //@FunctionalInterface标注该接口会被设计成一个函数式接口，否则会编译错误
public interface MyFunc<T> {
    T getValue(T t);
}
public static String toUpperString(MyFunc<String> myFunc, String str) {
    return myFunc.getValue(str);
}

public static void main(String[] args) {
    String newStr = toUpperString((str) -> str.toUpperCase(), "abc");
    System.out.println(newStr);
}
```

作为参数传递 Lambda 表达式：为了将 Lambda 表达式作为参数传递，**接收Lambda 表达式的参数类型必须是与该 Lambda 表达式兼容的函数式接口的类型**。

函数接口为lambda表达式和方法引用提供目标类型

### 3. Java 内置四大核心函数式接口

| 函数式接口    | 参数类型 | 返回类型 | 用途                                                         |
| ------------- | -------- | -------- | ------------------------------------------------------------ |
| Consumer<T>   | T        | void     | 对类型为T的对象应用操作，包含方法：void accept(T t)          |
| Supplier<T>   | 无       | T        | 返回类型为T的对象，包 含方法：T get();                       |
| Function<T,R> | T        | R        | 对类型为T的对象应用操作，并返回结果。结果是R类型的对象。包含方法：R apply(T t); |
| Predicate<T>  | T        | boolean  | 确定类型为T的对象是否满足某约束，并返回 boolean 值。包含方法 boolean test(T t); |

```java
import org.junit.Test;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

/*
 * Java8 内置的四大核心函数式接口
 * Consumer<T> : 消费型接口  void accept(T t);
 * Supplier<T> : 供给型接口   T get();
 * Function<T, R> : 函数型接口  R apply(T t);
 * Predicate<T> : 断言型接口   boolean test(T t);
 */
public class FunctionalInterfaceTest {

    //Predicate<T> 断言型接口：将满足条件的字符串放入集合
    public List<String> filterStr(List<String> list, Predicate<String> predicate) {
        List<String> newList = new ArrayList<>();
        for (String s : list) {
            if (predicate.test(s)) {
                newList.add(s);
            }
        }
        return newList;
    }

    @Test
    public void testPredicate() {
        List<String> list = Arrays.asList("hello", "java8", "function", "predicate");
        List<String> newList = filterStr(list, s -> s.length() > 5);
        for (String s : newList) {
            System.out.println(s);
        }
    }

    // Function<T, R> 函数型接口：处理字符串
    public String strHandler(String str, Function<String, String> function) {
        return function.apply(str);
    }

    @Test
    public void testFunction() {
        String str1 = strHandler("测试内置函数式接口", s -> s.substring(2));
        System.out.println(str1);

        String str2 = strHandler("abcdefg", s -> s.toUpperCase());
        System.out.println(str2);
    }

    //Supplier<T> 供给型接口 :产生指定个数的整数，并放入集合
    public List<Integer> getNumList(int num, Supplier<Integer> supplier) {
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            Integer n = supplier.get();
            list.add(n);
        }
        return list;
    }

    @Test
    public void testSupplier() {
        List<Integer> numList = getNumList(10, () -> (int) (Math.random() * 100));

        for (Integer num : numList) {
            System.out.println(num);
        }
    }

    //Consumer<T> 消费型接口 :修改参数
    public void modifyValue(Integer value, Consumer<Integer> consumer) {
        consumer.accept(value);
    }

    @Test
    public void testConsumer() {
        modifyValue(3, s -> System.out.println(s * 3));
    }
}
```

**Package java.util.function** 包下还提供了很多其他的演变方法。

![java8-function.png](https://i.loli.net/2019/12/31/tzNWejl7gdnvSrK.png)

**?> Tip**

Java类型要么是引用类型（Byte、Integer、Objuct、List），要么是原始类型（int、double、byte、char）。但是泛型只能绑定到引用类型。将原始类型转换为对应的引用类型，叫**装箱**，相反，将引用类型转换为对应的原始类型，叫**拆箱**。当然Java提供了自动装箱机制帮我们执行了这一操作。

```java
List<Integer> list = new ArrayList();
	for (int i = 0; i < 10; i++) {
	list.add(i);    //int被装箱为Integer
}
```

但这在性能方面是要付出代价的。装箱后的值本质上就是把原始类型包裹起来，并保存在堆里。因此，装箱后的值需要更多的内存，并需要额外的内存搜索来获取被包裹的原始值。

以上funciton包中的**IntPredicate、DoubleConsumer、LongBinaryOperator、ToDoubleFuncation等就是避免自动装箱的操作**。一般，针对专门的输入参数类型的函数式接口的名称都要加上对应的原始类型前缀。



## 函数式接口有必要吗

方法也可以当做参数传递，

有必要存在，这样就可以方便传函数对象了

函数式接口 可以更方便的达到设计模式中模板方法模式一样的效果，即让模板方法在不改变算法整体结构的情况下，重新定义算法中的某些步骤

lambda和函数式接口是用来配合简化写 Java **异步回调**的。包括 Java 内置的最常见的函数式接口，Runable、Callable 也是用来写异步/多线程的，不写多线程，就没必要写成函数式。



Java8 以前，guava 其实就已经提供了函数式接口(guava-18)

```java
package com.google.common.base;

import com.google.common.annotations.GwtCompatible;
import javax.annotation.Nullable;

@GwtCompatible
public interface Function<F, T> {
    @Nullable
    T apply(@Nullable F var1);

    boolean equals(@Nullable Object var1);
}
```

Java 8 出现后，guava 的函数式接口开始就继承 Java 了

```java
package com.google.common.base;

import com.google.common.annotations.GwtCompatible;
import com.google.errorprone.annotations.CanIgnoreReturnValue;
import javax.annotation.Nullable;

@FunctionalInterface
@GwtCompatible
public interface Function<F, T> extends java.util.function.Function<F, T> {
    @Nullable
    @CanIgnoreReturnValue
    T apply(@Nullable F var1);

    boolean equals(@Nullable Object var1);
}
```



最常用的可能有 Supplier

Guava 还提供了  Suppliers 

1. Suppliers.ofInstance(T instance) 方法

   该种调用方式为最简单的实现方式，在调用`get`方法时会直接将传递的instance返回。

2. Suppliers.memoize(Supplier delegate)方法

   该方法返回的`Supplier`会通过传递的`delegate`参数来获取值并缓存，之后再次调用`get`方法时会直接将缓存中的值返回。

3. Suppliers.memoizeWithExpiration(Supplier delegate, long duration, TimeUnit unit)方法

   该方法会根据指定的duration 和 unit每隔指定时间调用delegate的get方法一次，相当于是定时刷新结果值。

4. Suppliers.synchronizedSupplier(Supplier delegate)方法

   该方法会以`synchronized`的方式实现线程安全的调用，并且每次都会执行delegate的get方法来获取值。

5. Suppliers.compose(Function<? super F, T> function, Supplier delegate)方法

   每次获取值都会调用`delegate`的`get`方法，并且使用传递的`function`对返回值进行处理。



