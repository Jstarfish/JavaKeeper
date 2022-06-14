### [9. 回文数](https://leetcode.cn/problems/palindrome-number/)

> 给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。
>
> 回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
>
> 例如，121 是回文，而 123 不是。
>

**思路**：

解法1：转成字符串后反转并比较

```java
public boolean isPalindrome(int num){
  String revertNum = new StringBuilder(""+num).reverse().toString();
  return revertNum.equals(num+"");
}
```

解法2：反转一半数字（数学法）

例如，输入 1221，我们可以将数字 “1221” 的后半部分从 “21” 反转为 “12”，并将其与前半部分 “12” 进行比较，因为二者相同，我们得知数字 1221 是回文。

![fig1](https://tva1.sinaimg.cn/large/e6c9d24ely1h35m91kil7j20zk0k00uc.jpg)

1. 每次进行取余操作 （ %10），取出最低的数字：y = x % 10
2. 将最低的数字加到取出数的末尾：revertNum = revertNum * 10 + y
3. 每取一个最低位数字，x 都要自除以 10
4. 判断 x 是不是小于 revertNum ，当它小于的时候，说明数字已经对半或者过半了
5. 最后，判断奇偶数情况：如果是偶数的话，revertNum 和 x 相等；如果是奇数的话，最中间的数字就在revertNum 的最低位上，将它除以 10 以后应该和 x 相等。

```java
public boolean isPalindrome(int num){
        //所有负数、所有大于 0 且个位是 0 的数字都不可能是回文
        if(num < 0 || (num > 0 &&  num % 10 == 0)){
            return false;
        }
        int tmp = 0;
        while(num > tmp){
            tmp = tmp * 10 + tmp % 10;
            num = num / 10;
        }
        return num == tmp || num == tmp / 10;
    }
```

