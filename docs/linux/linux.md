![](https://www.w3cschool.cn/attachments/image/20170622/1498118505466168.jpg)

 Linux是一个基于POSIX和Unix的多用户、多任务、支持多线程和多CPU的性能稳定的操作系统，可免费使用并自由传播。 

Linux是众多操作系统之一 , 目前流行的服务器和 PC 端操作系统有 Linux、Windows、UNIX 等 

Linux**的创始人** Linus Torvalds  林纳斯 (也是git的开发者)

![image-20191124110919540](/Users/starfish/Library/Application Support/typora-user-images/image-20191124110919540.png)





Linux主要的发行版:

Ubuntu(乌班图)、RedHat(红帽)、**CentOS**、Debain[蝶变]、Fedora、SuSE、OpenSUSE







uinux是怎么来的

![image-20191124145033592](/Users/starfish/Library/Application Support/typora-user-images/image-20191124145033592.png)





**伟大的GNU计划**

•在自由的时代用户应该免费享有对软件源代码阅读、修改的权利。

•软件公司可以靠提供服务和训练获得盈利。



![image-20191124105748086](/Users/starfish/Library/Application Support/typora-user-images/image-20191124105748086.png)

Linux和Unix的关系

![image-20191124110547808](/Users/starfish/Library/Application Support/typora-user-images/image-20191124110547808.png)

（Redhat又衍生出两个版本，redhat和centOS）



W2Cschool https://www.w3cschool.cn/linux/ 

 http://c.biancheng.net/linux_tutorial/ 

鸟哥的Linux私房菜 http://linux.vbird.org/linux_basic/ 





## 1.Linux的文件权限

在linux中的每个用户必须属于一个组，不能独立于组外。在linux中每个文件有所有者、所在组、其它组的概念

**ls -al（l）**:

ls -l(别名ll 就可以查看)

![linux-ls.png](https://i.loli.net/2019/11/19/FajuBx9hKcLfEiv.png)

从左到又每一列的信息依次为 **权限、 连接数、 所有者 、 用户组 、 文件容量 、 修改日期 、 文件名**

第一列的十位字母代表的是文件的类型和权限，第一个字符代表这个文件是“目录、文件或链接文件等”含义：

- d：代表是目录

-  -：代表是文件

- l：代表是连接文件

- b：代表设备文件里可供存储的接口设备

- c：代表设备文件里面的串行端口设备。如键盘，鼠标等


后边9个字符，每3个字符为一组，“rwx”（可读、可写、可执行eXecute）这三个参数的组合，（rwx3者的顺序不能改变，换句话说，第一个要么是r,要么啥都没有，不能是w或者x），三个组合分别代表“文件所有者的权限”、“同用户组的权限”、“其他非本用户组的权限”。

![linux-permission.png](https://i.loli.net/2019/11/19/1rkOtD9GxQ7BAZ6.png)

**权限的重要性：**

- 系统保护的功能；

- 团队开发软件或数据共享的功能；


**改变文件属性和权限：**

- <font color=red>**chgrp**</font>: 改变文件所属用户组(change group)

  - chgrp [-R]  users  目录或文件 ： 将这个路径下的文件的用户组改成“users“
  - 这个新用户组一定得是/etc/group下有的，否则会报错。
  - 若最后一个参数是目录，则表示只将这个目录下的文件的用户组改成这个。
  - R表示若最后一个参数是目录，则将当前目录下的文件连同子目录下的所有文件的用户组都改成这个。

- <font color=red>**chown**</font>: 改变文件所有者(change owner)

  - chown [-R] 用户名 文件或目录 ： 将这个目录下的所有文件的所有者都改成这个用户名。
  - 这个用户名必须是/etc/passwd下有的才行。
  - 这个命令可以既修改文件主又修改用户组：
  - chown [-R] 用户名：用户组名 目录/文件（：和 . 都可以）
  - chown [-R] 用户名.用户组名 目录/文件
  - 由于用户名可以存在小数点，当出现含有小数点的用户名时，系统会发生误判，所以我们一般都使用：来连接用户名和用户组名。
  - 还可以仅修改用户组名：chown [-R] .用户组名 目录/文件

- **<font color=red>chmod</font>**: 改变文件的权限

   改变文件的权限有两种方法：用数字或者符号进行权限的修改

  1. ##### 用数字进行权限的修改

  ​		Linux文件的基本权限有9个，分别是owner、group、others三种身份各有自己的read、write、execute		权限。在这种方式中，r＝4、w＝2、x＝1，将每一组的三个值加起来，组成一个三位数即可。例如：

  ​		文件主：rwx ＝ 4＋2＋1＝7；

  ​		同组用户：rwx＝4＋2＋1＝7；

  ​		其他人：－－－＝0＋0＋0＝0；

  ​		所以命令如下：

     **chmod [-R] 770  文件/目录**

  2. **用符号进行权限的修改**

     用u、g、o 代表user、group、others三种身份的权限，a 代表 all，也就是全部的身份。 +（加入），-（除去），=（设置）。

  ​       **chmod u/g/o/a +/-/= r/w/x 文件/目录**

  ​       例子：文件主能够读、写、执行；同组用户和其他用户能够读、执行。

  ​       **chmod u=rwx,go=rx 文件名**

  ​       假设原先不知道文件的属性，现在只想让所有的人能够执行这个文件，则：

  ​      **chmod a+x 文件/目录**

  ​      假设原先不知道文件的属性，现在只想让同组用户和其他用户无法写，则：

  ​     **chmod go-w 文件/目录**

<font color=blue>**目录和文件的权限意义：**</font>

- 权限对文件的意义.
  - r：代表可读取此文件的实际内容
  - w：代表可以编辑、新增或者修改文件的内容（但是不包含删除文件）
  - x：代表该文件具有可以被系统执行的权限。<与windows不同，在Linux中判断一个文件是否可以执行，不是根据后缀名（如.exe ，.bat，.com），而是和这个文件是否具有“x”权限决定的。>

- 权限对目录的意义
  -  r：代表具有读取目录结构列表的权限（你可以使用ls命令将目录下的所有列表读出来）

  - w：这个权限对目录来说可是很强大的，表示你具有更改该目录结构列表的权限

    主要有：

    - 新建新的文件与目录
    - 删除已经存在的文件或者目录（无论文件的权限是怎样的）
    - 将已经存在的文件或者目录重命名
    - 转移该目录内的文件、目录位置

  - x：目录虽然不可以被拿来执行，但是目录的x代表的是用户能否进入该目录成为工作目录的用途。（所谓工作目录就是你当下的目录，也就是时候，如果目录不具有x权限，那么你就不能通过cd命令进入到该目录下工作）。

能不能进入某一目录，只与该目录的x 权限有关。

 Linux的单一文件或者目录的最大容许文件名为255个字符,包含完整路径名记（/）的完整文件名为4096个字符。

------



## 2.Linux系统目录结构

<font color=blue>linux的文件系统是采用**级层式**的树状目录结构，在此结构中的最上层是根目录“/”，然后在此目录下再创建其他的目录。在Linux世界里，一切皆文件</font>

【**Linux系统目录结构**】

登录系统后，在当前命令窗口下输入 ls / 你会看到

![linux-catalog.png](https://i.loli.net/2019/11/19/39qx8kwHeXCv6nm.png)

以下是对这些目录的解释：

**/bin** bin是Binary的缩写。这个目录存放着最经常使用的命令。

**/boot** 这里存放的是启动Linux时使用的一些核心文件，包括一些连接文件以及镜像文件。

**/dev**  dev是Device(设备)的缩写。该目录下存放的是Linux的外部设备，在Linux中访问设备的方式和访问文件的方式是相同的。

**/etc** 这个目录用来存放所有的系统管理所需要的配置文件和子目录。

**/home** 用户的主目录，在Linux中，每个用户都有一个自己的目录，一般该目录名是以用户的账号命名的。

**/lib** 这个目录里存放着系统最基本的动态连接共享库，其作用类似于Windows里的DLL文件。几乎所有的应用程序都需要用到这些共享库。

**/lost+found**  这个目录一般情况下是空的，当系统非法关机后，这里就存放了一些文件。

**/media linux** 系统会自动识别一些设备，例如U盘、光驱等等，当识别后，linux会把识别的设备挂载到这个目录下。

**/mnt** 系统提供该目录是为了让用户临时挂载别的文件系统的，我们可以将光驱挂载在/mnt/上，然后进入该目录就可以查看光驱里的内容了。

**/opt** 这是给主机额外安装软件所摆放的目录。比如你安装一个ORACLE数据库则就可以放到这个目录下。默认是空的。

**/proc** 这个目录是一个虚拟的目录，它是系统内存的映射，我们可以通过直接访问这个目录来获取系统信息。这个目录的内容不在硬盘上而是在内存里，我们也可以直接修改里面的某些文件，比如可以通过下面的命令来屏蔽主机的ping命令，使别人无法ping你的机器： echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all。

**/root** 该目录为系统管理员，也称作超级权限者的用户主目录。

**/sbin** s就是Super User的意思，这里存放的是系统管理员使用的系统管理程序。

**/selinux** 这个目录是Redhat/CentOS所特有的目录，Selinux是一个安全机制，类似于windows的防火墙，但是这套机制比较复杂，这个目录就是存放selinux相关的文件的。

**/srv** 该目录存放一些服务启动之后需要提取的数据。

**/sys** 这是linux2.6内核的一个很大的变化。该目录下安装了2.6内核中新出现的一个文件系统 sysfs ，sysfs文件系统集成了下面3种文件系统的信息：针对进程信息的proc文件系统、针对设备的devfs文件系统以及针对伪终端的devpts文件系统。该文件系统是内核设备树的一个直观反映。当一个内核对象被创建的时候，对应的文件和目录也在内核对象子系统中被创建。

**/tmp** 这个目录是用来存放一些临时文件的。

**/usr** 这是一个非常重要的目录，用户的很多应用程序和文件都放在这个目录下，类似与windows下的program files目录。

/usr/bin：系统用户使用的应用程序。

/usr/sbin：超级用户使用的比较高级的管理程序和系统守护程序。

/usr/src：内核源代码默认的放置目录。

**/var**  这个目录中存放着在不断扩充着的东西，我们习惯将那些经常被修改的目录放在这个目录下。包括各种日志文件。

在linux系统中，有几个目录是比较重要的，平时需要注意不要误删除或者随意更改内部文件。/etc： 上边也提到了，这个是系统中的配置文件，如果你更改了该目录下的某个文件可能会导致系统不能启动。/bin, /sbin, /usr/bin, /usr/sbin: 这是系统预设的执行文件的放置目录，比如 ls 就是在/bin/ls 目录下的。值得提出的是，/bin, /usr/bin 是给系统用户使用的指令（除root外的通用户），而/sbin, /usr/sbin 则是给root使用的指令。 /var： 这是一个非常重要的目录，系统上跑了很多程序，那么每个程序都会有相应的日志产生，而这些日志就被记录到这个目录下，具体在/var/log 目录下，另外mail的预设放置也是在这里。

------



## 3.Linux文件与目录操作

**绝对路径：**

路径的写法，由根目录 / 写起，例如： /usr/share/doc 这个目录。

**相对路径：**

路径的写法，不是由 / 写起，例如由 /usr/share/doc 要到 /usr/share/man 底下时，可以写成： cd ../man 这就是相对路径的写法啦！

### 目录的相关操作

**ls**（查看文件与目录）

**cd**（切换目录）  

**pwd**（显示当前所在目录）

**mkdir**（创建新目录）

*mkdir 【-mp】目录名称*

加了-p 参数，可以自行创建多层目录， 加了-m，可以强制设置属性。

```shell
mkdir test
mkdir -p test1/test2/test3/test4*
mkdir -m 711 test2（给予新目录drwx--x--x的权限）
```

**rmdir**（删除“空”目录）

`rmdir [-p] 目录名称（-p 可以连同上层空目录一起删除）`

```shell
rmdir -p test1/test2/test3/test4
```

<font color=red>**cp**</font>（复制文件或目录）

```shell
cp [-adfilprsu] 源文件（source） 目标文件（destination
```

- **-a**：相当于-pdr的意思；
- **-i**：若目标文件已经存在且无法开启，则删除后再尝试一次；

- **-p**：连同文件的属性一起复制过去，而非使用默认属性（备份常用）；
- **-r**：递归持续复制，用于**目录的复制行为**；

```shell
cp test testtest （将test文件重命名为testtest）
cp /var/log/wtmp .（复制到当前目录.）
cp -r /etc/ /tmp（复制etc目录下的所有内容到/tmp下，权限可能被改变了）
```

<font color=red>**rm**</font>（移除文件或目录）

```shell
rm [-fir] 文件或目录
```

- **-f**：force的意思，忽略不存在的文件，不会出现警告信息；
- **-i**：互动模式，在删除前会询问用户是否操作；
- **-r**：递归删除，危险

```shell
#不能直接删除目录，删除目录的话需要加-r
rm -r /tmp/test （root用户默认会加入-i参数，询问，删除的是test文件，没有删除tmp）
touch  /tmp/aaa （新建空文件aaa）
rm /tmp/aaa（直接删除文件aaa）
```

<font color=red>**mv**</font>（移动文件与目录，或更名）

```shell
mv [-fiu] source destination
```

- **-f**：force强制的意思，如果目标文件已经存在，不会询问而直接覆盖；
- **-i**：若目标文件已经存在，就会询问是否覆盖；
- **-u**：若目标文件已经存在，且source比较新，才会更新；

```shell
mv aaa test（将文件aaa移动到目录test中）
mv test mytest（将test重命名为mytest）
mv aaa bbb ccc test（将aaa、bbb、ccc多个源文件或目录全部移动到test目录中）
```

### 文件内容查阅

**cat**：由第一行开始显示文件内容；

**tac**：从最后一行开始显示，可以看出tac是cat的倒写形式；

**nl**：显示的时候，顺便输出行号；

**more**：一页一页的显示文件内容；

**less**：与more类似，但是可以往前翻页；

**head**：只看开头几行；

**tail**：只看结尾几行；

**od**：以二进制的方式读取文件内容

**直接查看文件内容 cat、tac、nl**

<font color=red>**cat**</font>（concatenate）

```shell
cat [-AbEnTv] 文件
```

- **-A**：相当于-vET的整合参数，可列出一些特殊字符，而不是空白而已；
- **-b**：列出行号，仅针对非空白行做行号显示，空白行不标行号；
- **-E**：将结尾用断行字符 $ 显示出来；
- **-n**：打印出行号，连同空白行也会有行号，区别于-b；
- **-T**：将Tab按键以^T显示出来；

- **-v**：列出一些看不出来的特殊字符

**cat -n 文件路径 | tail -n +5 | head -n 6  // 显示 5 ～ 10 行的内容， 包括5 和10**

**cat 文件路径 | head -n 10 | tail -n +5   //同上**

**tac**（反向显示）

**nl**（添加行号打印）

```shell
nl [-bnw] 文件
```

**可翻页查看文件内容 more和less**

**<font color=red>more</font>**（一页一页翻动）

![linux-more.png](https://i.loli.net/2019/11/19/Tnex5WvCocU3p4m.png)

如果文件内容较多，more 命令之后，会继续等到后续操作

- **空格键（Space）**：向下翻页；
- **Enter**：向下滚动一行；
- **/字符串**：在当前显示内容中，向下查询该字符串；
- **:f**：显示出文件名以及目前显示的行数；

- **q**：直接离开more，不再显示该文件内容；
- **b**：往回翻页，只对文件有用，对管道无用
- **less**（一页一页翻动）

**less可以用向上、下按键的功能前后翻页，也可以向上查询**

- **空格键（Space）**：向下翻页；
- **[PageDown]**：向下翻动一页

- **[PageUp]**：向上翻动一页

- **Enter**：向下滚动一行；

- **/字符串**：向下查询该字符串；
- **?字符串**：向上查询该字符串；

- **n**：重复前一个查询（与/或？有关）；

- **N**：反向重复前一个查询（与/或？有关）；

- **q**：直接离开less，不再显示该文件内容；

**数据选取查看 head和tail**

**<font color=red>head</font>**（取出前面几行）

```shell
head [-n number] 文件（默认显示十行）
```

- **-n**：后边接数字，代表显示几行的意思；

**<font color=red>tail</font>**（取出后边几行）

```shell
tail [-n number] 文件
tail [-f] 文件
```

- **-f**：表示持续监测后边所接的文件内容，一般用于查看日志进程，按下[ctrl]+c才会结束检测；

**<font color=red>touch</font>**（修改文件时间或者创建新文件）

```shell
touch [-acdmt] 文件
```

- **-a**：仅修改访问时间；
- **-c**：仅修改访问时间，若该文件不存在则不创建新文件；
- **-d**：后面可以接想要修改的日期而不用目前的日期；

- **-m**：仅修改mtime；

- **-t**：后面可以接想要修改的时间而不用目前的时间；

------



## 4.vim程序编辑器

在Linux的系统中使用文本编辑器来编辑Linux参数配置文件是一件相当重要的事情，所以至少要熟悉一种文本编辑器。

那为什么一定要学会vim呢。因为：

- 所有的UNIX Like系统都会内置vi文本编辑器，其它的文本编辑器则不一定存在；
- 很多软件的编辑接口都会主动调用vi；
- vim具有程序编辑的能力，可以主动以字体颜色辨别语法的正确性，方便程序设计；
- 程序简单，编辑速度相当快速。

vim 键盘图：

![linux-vim.png](https://i.loli.net/2019/11/19/cufhFxXA1V3oTgC.gif)

vim其实可以视为vi的高级版本。

### vi的使用

<font color=blue>vi共分为3种模式，分别是一般模式、编辑模式和命令行模式。</font>

**一般模式**

以vi打开一个文件就直接进入一般模式（默认的模式）。在这个模式中， 你可以使用『上下左右』按键来移动光标，你可以使用『删除字符』或『删除整行』来处理档案内容， 也可以使用『复制、贴上』来处理你的文件数据。

**编辑模式**

在一般模式中可以进行删除、复制、粘贴等等的动作，但是却无法编辑文件内容的！ 要等到你按下<font color=blue>『i, I, o, O, a, A, r, R』</font>等任何一个字母之后才会进入编辑模式。注意了！通常在 Linux 中，按下这些按键时，在画面的左下方会出现『 INSERT 或 REPLACE 』的字样，此时才可以进行编辑。而如果要回到一般模式时， 则必须要按下『Esc』这个按键即可退出编辑模式。

**命令行模式**

在一般模式当中，输入<font color=blue>『 : / ? 』</font>三个中的任何一个按钮，就可以将光标移动到最底下那一行。在这个模式当中， 可以提供你『搜寻资料』的动作，而读取、存盘、大量取代字符、离开 vi 、显示行号等等的动作则是在此模式中达成的！

**一般模式与编辑模式及命令行模式可以互相转换，但编辑模式与命令行模式之间不可以互相转换**

### 按键说明

- 第一部份：一般模式可用的按钮说明，光标移动、复制贴上、搜寻取代等

| **移动光标的方法**                                           |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| h 或 向左箭头键(←)                                           | 光标向左移动一个字符                                         |
| j 或 向下箭头键(↓)                                           | 光标向下移动一个字符                                         |
| k 或 向上箭头键(↑)                                           | 光标向上移动一个字符                                         |
| l 或 向右箭头键(→)                                           | 光标向右移动一个字符                                         |
| 如果你将右手放在键盘上的话，你会发现 hjkl 是排列在一起的，因此可以使用这四个按钮来移动光标。 如果想要进行多次移动的话，例如向下移动 30 行，可以使用 "30j" 或 "30↓" 的组合按键， 亦即加上想要进行的次数(数字)后，按下动作即可！ |                                                              |
| [Ctrl] + [f]                                                 | 屏幕『向下』移动一页，相当于 [Page Down]按键 (常用)          |
| [Ctrl] + [b]                                                 | 屏幕『向上』移动一页，相当于 [Page Up] 按键 (常用)           |
| [Ctrl] + [d]                                                 | 屏幕『向下』移动半页                                         |
| [Ctrl] + [u]                                                 | 屏幕『向上』移动半页                                         |
| +                                                            | 光标移动到非空格符的下一列                                   |
| -                                                            | 光标移动到非空格符的上一列                                   |
| n<space>                                                     | 那个 n 表示『数字』，例如 20 。按下数字后再按空格键，光标会向右移动这一行的 n 个字符。例如 20<space> 则光标会向后面移动 20 个字符距离。 |
| **0 或功能键[Home]**                                         | 这是数字『 0 』：移动到这一行的最前面字符处 (常用)           |
| **$ 或功能键[End]**                                          | 移动到这一行的最后面字符处(常用)                             |
| **H**                                                        | 光标移动到这个屏幕的最上方那一行的第一个字符                 |
| M                                                            | 光标移动到这个屏幕的中央那一行的第一个字符                   |
| L                                                            | 光标移动到这个屏幕的最下方那一行的第一个字符                 |
| **G**                                                        | 移动到这个档案的最后一行(常用)                               |
| nG                                                           | n 为数字。移动到这个档案的第 n 行。例如 20G 则会移动到这个档案的第 20 行(可配合 :set nu) |
| **gg**                                                       | 移动到这个档案的第一行，相当于 1G 啊！ (常用)                |
| n<Enter>                                                     | n 为数字。光标向下移动 n 行(常用)                            |
| **查找与替换**                                               |                                                              |
| **/word**                                                    | 向光标之下寻找一个名称为 word 的字符串。例如要在档案内搜寻 vbird 这个字符串，就输入 /vbird 即可！ (常用) |
| **?word**                                                    | 向光标之上寻找一个字符串名称为 word 的字符串。               |
| **n**                                                        | 这个 n 是英文按键。代表『重复前一个搜寻的动作』。举例来说， 如果刚刚我们执行 /vbird 去向下搜寻 vbird 这个字符串，则按下 n 后，会向下继续搜寻下一个名称为 vbird 的字符串。如果是执行 ?vbird 的话，那么按下 n 则会向上继续搜寻名称为 vbird 的字符串！ |
| N                                                            | 这个 N 是英文按键。与 n 刚好相反，为『反向』进行前一个搜寻动作。 例如 /vbird 后，按下 N 则表示『向上』搜寻 vbird 。 |
| 使用 /word 配合 n 及 N 是非常有帮助的！可以让你重复的找到一些你搜寻的关键词！ |                                                              |
| **:n1,n2s/word1/word2/g**                                    | n1 与 n2 为数字。在第 n1 与 n2 行之间寻找 word1 这个字符串，并将该字符串取代为 word2 ！举例来说，在 100 到 200 行之间搜寻 vbird 并取代为 VBIRD 则： 『:100,200s/vbird/VBIRD/g』。(常用) |
| **:1,$s/word1/word2/g**                                      | 从第一行到最后一行寻找 word1 字符串，并将该字符串取代为 word2 ！(常用) |
| **:1,$s/word1/word2/gc**                                     | 从第一行到最后一行寻找 word1 字符串，并将该字符串取代为 word2 ！且在取代前显示提示字符给用户确认 (confirm) 是否需要取代！(常用) |
| **删除、复制和粘贴**                                         |                                                              |
| **x, X**                                                     | 在一行字当中，x 为向后删除一个字符 (相当于 [del] 按键)， X 为向前删除一个字符(相当于 [backspace] 亦即是退格键) (常用) |
| nx                                                           | n 为数字，连续向后删除 n 个字符。举例来说，我要连续删除 10 个字符， 『10x』。 |
| **dd**                                                       | 剪切游标所在的那一行(常用)                                   |
| **D**                                                        | 删除从当前光标到光标所在行尾的全部字符                       |
| **ndd**                                                      | n 为数字。删除光标所在的向下 n 列，例如 20dd 则是删除 20 列 (常用) |
| d1G                                                          | 删除光标所在到第一行的所有数据                               |
| dG                                                           | 删除光标所在到最后一行的所有数据                             |
| d$                                                           | 删除游标所在处，到该行的最后一个字符                         |
| d0                                                           | 那个是数字的 0 ，删除游标所在处，到该行的最前面一个字符      |
| **yy**                                                       | 复制游标所在的那一行(常用)                                   |
| nyy                                                          | n 为数字。复制光标所在的向下 n 列，例如 20yy 则是复制 20 列(常用) |
| y1G                                                          | 复制游标所在列到第一列的所有数据                             |
| yG                                                           | 复制游标所在列到最后一列的所有数据                           |
| y0                                                           | 复制光标所在的那个字符到该行行首的所有数据                   |
| y$                                                           | 复制光标所在的那个字符到该行行尾的所有数据                   |
| **p, P**                                                     | p 为将已复制的数据在光标下一行贴上，P 则为贴在游标上一行！ 举例来说，我目前光标在第 20 行，且已经复制了 10 行数据。则按下 p 后， 那 10 行数据会贴在原本的 20 行之后，亦即由 21 行开始贴。但如果是按下 P 呢？ 那么原本的第 20 行会被推到变成 30 行。 (常用) 粘贴到光标上一行(p)，下一行（P） |
| J                                                            | 将光标所在列与下一列的数据结合成同一列                       |
| c                                                            | 重复删除多个数据，例如向下删除 10 行，[ 10cj ]               |
| **u**                                                        | 复原前一个动作。撤销(常用)                                   |
| [Ctrl]+r                                                     | 重做上一个动作。(常用)                                       |
| 这个 u 与 [Ctrl]+r 是很常用的指令！一个是复原，另一个则是重做一次～ 利用这两个功能按键，你的编辑，嘿嘿！很快乐的啦！ |                                                              |
| .                                                            | 不要怀疑！这就是小数点！意思是重复前一个动作的意思。 如果你想要重复删除、重复贴上等等动作，按下小数点『.』就好了！ (常用) |

- 第二部份：一般模式切换到编辑模式的可用的按钮说明

| **进入插入或替换的编辑模式**                                 |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| i, I                                                         | 进入插入模式(Insert mode)： i 为『从目前光标所在处插入』， I 为『在目前所在行的第一个非空格符处开始插入』。 (常用) |
| a, A                                                         | 进入插入模式(Insert mode)： a 为『从目前光标所在的下一个字符处开始插入』， A 为『从光标所在行的最后一个字符处开始插入』。(常用) |
| o, O                                                         | 进入插入模式(Insert mode)： 这是英文字母 o 的大小写。o 为『在目前光标所在的下一行处插入新的一行』； O 为在目前光标所在处的上一行插入新的一行！(常用) |
| r, R                                                         | 进入取代模式(Replace mode)： r 只会取代光标所在的那一个字符一次；R会一直取代光标所在的文字，直到按下 ESC 为止；(常用) |
| 上面这些按键中，在 vi 画面的左下角处会出现『--INSERT--』或『--REPLACE--』的字样。 由名称就知道该动作了吧！！特别注意的是，我们上面也提过了，你想要在档案里面输入字符时， 一定要在左下角处看到 INSERT 或 REPLACE 才能输入喔！ |                                                              |
| [Esc]                                                        | 退出编辑模式，回到一般模式中(常用)                           |

- 第三部份：一般模式切换到指令列模式的可用的按钮说明

| **进命令行的保存、离开等命令**                               |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **:w**                                                       | 将编辑的数据写入硬盘档案中(常用)                             |
| **:w!**                                                      | 若文件属性为『只读』时，强制写入该档案。不过，到底能不能写入， 还是跟你对该档案的档案权限有关啊！ |
| **:q**                                                       | 离开 vi (常用)                                               |
| **:q!**                                                      | 若曾修改过档案，又不想储存，使用 ! 为强制离开不储存档案。    |
| 注意一下啊，那个惊叹号 (!) 在 vi 当中，常常具有『强制』的意思～ |                                                              |
| **:wq**                                                      | 储存后离开，若为 :wq! 则为强制储存后离开 (常用)              |
| ZZ                                                           | 这是大写的 Z 喔！若档案没有更动，则不储存离开，若档案已经被更动过，则储存后离开！ |
| :w [filename]                                                | 将编辑的数据储存成另一个档案（类似另存新档）                 |
| :r [filename]                                                | 在编辑的数据中，读入另一个档案的数据。亦即将 『filename』 这个档案内容加到游标所在行后面 |
| :n1,n2 w [filename]                                          | 将 n1 到 n2 的内容储存成 filename 这个档案。                 |
| :! command                                                   | 暂时离开 vi 到指令列模式下执行 command 的显示结果！例如 『:! ls /home』即可在 vi 当中察看 /home 底下以 ls 输出的档案信息！ |
| :set nu                                                      | 显示行号，设定之后，会在每一行的前缀显示该行的行号           |
| :set nonu                                                    | 与 set nu 相反，为取消行号！                                 |

### vim的功能

**块选择**

当我们按下v或者V或者【Ctrl】+v的时候，光标移动过的地方会开始反白

| **块选择的按键意义** |                                        |
| -------------------- | -------------------------------------- |
| v                    | 字符选择，会将光标经过的地方反白选择！ |
| V                    | 行选择，会将光标经过的行反白选择！     |
| [Ctrl]+v             | 区块选择，可以用长方形的方式选择资料   |
| y                    | 将反白的地方复制起来                   |
| d                    | 将反白的地方删除掉                     |

**多文件编辑**

我们可以使用vim后面同时接好几个文件来同时打开

| **多文件编辑的按键** |                                   |
| -------------------- | --------------------------------- |
| :n                   | 编辑下一个档案                    |
| :N                   | 编辑上一个档案                    |
| :files               | 列出目前这个 vim 的开启的所有档案 |

**多窗口功能**

| **多窗口编辑按键**    |                                                              |
| --------------------- | ------------------------------------------------------------ |
| :sp [filename]        | 开启一个新窗口，如果有加 filename， 表示在新窗口开启一个新档案，否则表示两个窗口为同一个档案内容(同步显示)。 |
| [ctrl]+w+ j[ctrl]+w+↓ | 按键的按法是：先按下 [ctrl] 不放， 再按下 w 后放开所有的按键，然后再按下 j (或向下箭头键)，则光标可移动到下方的窗口。 |
| [ctrl]+w+ k[ctrl]+w+↑ | 同上，不过光标移动到上面的窗口。                             |
| [ctrl]+w+ q           | 其实就是 :q 结束离开啦！ 举例来说，如果我想要结束下方的窗口，那么利用 [ctrl]+w+↓ 移动到下方窗口后，按下 :q 即可离开， 也可以按下 [ctrl]+w+q 啊！ |

------



## 5.linux磁盘管理

Linux磁盘管理好坏管理直接关系到整个系统的性能问题。

Linux磁盘管理常用三个命令为df、du和fdisk。

- df：列出文件系统的整体磁盘使用量
- du：检查磁盘空间使用量
- fdisk：用于磁盘分区

**<font color=red>df</font>**

df命令参数功能：检查文件系统的磁盘空间占用情况。可以利用该命令来获取硬盘被占用了多少空间，目前还剩下多少空间等信息。

语法：

`df [-ahikHTm] [目录或文件名]`

选项与参数：

- -a ：列出所有的文件系统，包括系统特有的 /proc 等文件系统；
- -k ：以 KBytes 的容量显示各文件系统；
- -m ：以 MBytes 的容量显示各文件系统；
- -h ：以人们较易阅读的 GBytes, MBytes, KBytes 等格式自行显示；
- -H ：以 M=1000K 取代 M=1024K 的进位方式；
- -T ：显示文件系统类型, 连同该 partition 的 filesystem 名称 (例如 ext3) 也列出；
- -i ：不用硬盘容量，而以 inode 的数量来显示

**实例 1**

将系统内所有的文件系统列出来！

```
[root@www ~]# df
Filesystem      1K-blocks      Used Available Use% Mounted on
/dev/hdc2         9920624   3823112   5585444  41% /
/dev/hdc3         4956316    141376   4559108   4% /home
/dev/hdc1          101086     11126     84741  12% /boot
tmpfs              371332         0    371332   0% /dev/shm
```

在 Linux 底下如果 df 没有加任何选项，那么默认会将系统内所有的 (不含特殊内存内的文件系统与 swap) 都以 1 Kbytes 的容量来列出来！

**实例 2**

将容量结果以易读的容量格式显示出来

```
[root@www ~]# df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/hdc2             9.5G  3.7G  5.4G  41% /
/dev/hdc3             4.8G  139M  4.4G   4% /home
/dev/hdc1              99M   11M   83M  12% /boot
tmpfs                 363M     0  363M   0% /dev/shm
```

**实例 3**

将系统内的所有特殊文件格式及名称都列出来

```
[root@www ~]# df -aT
Filesystem    Type 1K-blocks    Used Available Use% Mounted on
/dev/hdc2     ext3   9920624 3823112   5585444  41% /
proc          proc         0       0         0   -  /proc
sysfs        sysfs         0       0         0   -  /sys
devpts      devpts         0       0         0   -  /dev/pts
/dev/hdc3     ext3   4956316  141376   4559108   4% /home
/dev/hdc1     ext3    101086   11126     84741  12% /boot
tmpfs        tmpfs    371332       0    371332   0% /dev/shm
none   binfmt_misc         0       0         0   -  /proc/sys/fs/binfmt_misc
sunrpc  rpc_pipefs         0       0         0   -  /var/lib/nfs/rpc_pipefs
```

**实例 4**

将 /etc 底下的可用的磁盘容量以易读的容量格式显示

```linux
[root@www ~]# df -h /etc
Filesystem            Size  Used Avail Use% Mounted on
/dev/hdc2             9.5G  3.7G  5.4G  41% /
```

**<font color=red>du</font>**

Linux du命令也是查看使用空间的，但是与df命令不同的是Linux du命令是对文件和目录磁盘使用的空间的查看，还是和df命令有一些区别的，这里介绍Linux du命令。

语法：

`du [-ahskm] 文件或目录名称`

选项与参数：

- -a ：列出所有的文件与目录容量，因为默认仅统计目录底下的文件量而已。
- -h ：以人们较易读的容量格式 (G/M) 显示；
- -s ：列出总量而已，而不列出每个各别的目录占用容量；
- -S ：不包括子目录下的总计，与 -s 有点差别。
- -k ：以 KBytes 列出容量显示；
- -m ：以 MBytes 列出容量显示；

**实例 1**

列出目前目录下的所有文件容量

```
[root@www ~]# du
8       ./test4     <==每个目录都会列出来
8       ./test2
....中间省略....
12      ./.gconfd   <==包括隐藏文件的目录
220     .           <==这个目录(.)所占用的总量
```

直接输入 du 没有加任何选项时，则 du 会分析当前所在目录的文件与目录所占用的硬盘空间。

**实例 2**

将文件的容量也列出来

```
[root@www ~]# du -a
12      ./install.log.syslog   <==有文件的列表了
8       ./.bash_logout
8       ./test4
8       ./test2
....中间省略....
12      ./.gconfd
220     .
```

**实例 3**

检查根目录底下每个目录所占用的容量

```
[root@www ~]# du -sm /*
7       /bin
6       /boot
.....中间省略....
0       /proc
.....中间省略....
1       /tmp
3859    /usr     <==系统初期最大就是他了啦！
77      /var
```

通配符 * 来代表每个目录。

与 df 不一样的是，du 这个命令其实会直接到文件系统内去搜寻所有的文件数据。

**fdisk**

fdisk 是 Linux 的磁盘分区表操作工具。

语法：

`fdisk [-l] 装置名称`

选项与参数：

- -l ：输出后面接的装置所有的分区内容。若仅有 fdisk -l 时， 则系统将会把整个系统内能够搜寻到的装置的分区均列出来。

**实例 1

找出你系统中的根目录所在磁盘，并查阅该硬盘内的相关信息

```
[root@www ~]# df /            <==注意：重点在找出磁盘文件名而已
Filesystem           1K-blocks      Used Available Use% Mounted on
/dev/hdc2              9920624   3823168   5585388  41% /

[root@www ~]# fdisk /dev/hdc  <==仔细看，不要加上数字喔！
The number of cylinders for this disk is set to 5005.
There is nothing wrong with that, but this is larger than 1024,
and could in certain setups cause problems with:
1) software that runs at boot time (e.g., old versions of LILO)
2) booting and partitioning software from other OSs
   (e.g., DOS FDISK, OS/2 FDISK)

Command (m for help):     <==等待你的输入！
输入 m 后，就会看到底下这些命令介绍
Command (m for help): m   <== 输入 m 后，就会看到底下这些命令介绍
Command action
   a   toggle a bootable flag
   b   edit bsd disklabel
   c   toggle the dos compatibility flag
   d   delete a partition            <==删除一个partition
   l   list known partition types
   m   print this menu
   n   add a new partition           <==新增一个partition
   o   create a new empty DOS partition table
   p   print the partition table     <==在屏幕上显示分割表
   q   quit without saving changes   <==不储存离开fdisk程序
   s   create a new empty Sun disklabel
   t   change a partition's system id
   u   change display/entry units
   v   verify the partition table
   w   write table to disk and exit  <==将刚刚的动作写入分割表
   x   extra functionality (experts only)
```

离开 fdisk 时按下 q，那么所有的动作都不会生效！相反的， 按下w就是动作生效的意思。

```
Command (m for help): p  <== 这里可以输出目前磁盘的状态

Disk /dev/hdc: 41.1 GB, 41174138880 bytes        <==这个磁盘的文件名与容量
255 heads, 63 sectors/track, 5005 cylinders      <==磁头、扇区与磁柱大小
Units = cylinders of 16065 * 512 = 8225280 bytes <==每个磁柱的大小

   Device Boot      Start         End      Blocks   Id  System
/dev/hdc1   *           1          13      104391   83  Linux
/dev/hdc2              14        1288    10241437+  83  Linux
/dev/hdc3            1289        1925     5116702+  83  Linux
/dev/hdc4            1926        5005    24740100    5  Extended
/dev/hdc5            1926        2052     1020096   82  Linux swap / Solaris
# 装置文件名 启动区否 开始磁柱    结束磁柱  1K大小容量 磁盘分区槽内的系统

Command (m for help): q
```

想要不储存离开吗？按下 q 就对了！不要随便按 w 啊！

使用 p 可以列出目前这颗磁盘的分割表信息，这个信息的上半部在显示整体磁盘的状态。

**磁盘格式化**

磁盘分割完毕后自然就是要进行文件系统的格式化，格式化的命令非常的简单，使用 **mkfs**（make filesystem） 命令。

语法：

`mkfs [-t 文件系统格式] 装置文件名`

选项与参数：

- -t ：可以接文件系统格式，例如 ext3, ext2, vfat 等(系统有支持才会生效)

**实例 1**

查看 mkfs 支持的文件格式

```
[root@www ~]# mkfs[tab][tab]
mkfs         mkfs.cramfs  mkfs.ext2    mkfs.ext3    mkfs.msdos   mkfs.vfat
```

按下两个[tab]，会发现 mkfs 支持的文件格式如上所示。

**实例 2**

将分区 /dev/hdc6（可指定你自己的分区） 格式化为 ext3 文件系统：

```
[root@www ~]# mkfs -t ext3 /dev/hdc6
mke2fs 1.39 (29-May-2006)
Filesystem label=                <==这里指的是分割槽的名称(label)
OS type: Linux
Block size=4096 (log=2)          <==block 的大小配置为 4K 
Fragment size=4096 (log=2)
251392 inodes, 502023 blocks     <==由此配置决定的inode/block数量
25101 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=515899392
16 block groups
32768 blocks per group, 32768 fragments per group
15712 inodes per group
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912

Writing inode tables: done
Creating journal (8192 blocks): done <==有日志记录
Writing superblocks and filesystem accounting information: done

This filesystem will be automatically checked every 34 mounts or
180 days, whichever comes first.  Use tune2fs -c or -i to override.
# 这样就创建起来我们所需要的 Ext3 文件系统了！简单明了！
```

**磁盘检验**

**fsck**（file system check）用来检查和维护不一致的文件系统。

若系统掉电或磁盘发生问题，可利用fsck命令对文件系统进行检查。

语法：

`fsck [-t 文件系统] [-ACay] 装置名称`

选项与参数：

- -t : 给定档案系统的型式，若在 /etc/fstab 中已有定义或 kernel 本身已支援的则不需加上此参数
- -s : 依序一个一个地执行 fsck 的指令来检查
- -A : 对/etc/fstab 中所有列出来的 分区（partition）做检查
- -C : 显示完整的检查进度
- -d : 打印出 e2fsck 的 debug 结果
- -p : 同时有 -A 条件时，同时有多个 fsck 的检查一起执行
- -R : 同时有 -A 条件时，省略 / 不检查
- -V : 详细显示模式
- -a : 如果检查有错则自动修复
- -r : 如果检查有错则由使用者回答是否修复
- -y : 选项指定检测每个文件是自动输入yes，在不确定那些是不正常的时候，可以执行 # fsck -y 全部检查修复。

**实例 1**

查看系统有多少文件系统支持的 fsck 命令：

```
[root@www ~]# fsck[tab][tab]
fsck         fsck.cramfs  fsck.ext2    fsck.ext3    fsck.msdos   fsck.vfat
```

**实例 2**

强制检测 /dev/hdc6 分区:

```
[root@www ~]# fsck -C -f -t ext3 /dev/hdc6 
fsck 1.39 (29-May-2006)
e2fsck 1.39 (29-May-2006)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
vbird_logical: 11/251968 files (9.1% non-contiguous), 36926/1004046 blocks
```

如果没有加上 -f 的选项，则由于这个文件系统不曾出现问题，检查的经过非常快速！若加上 -f 强制检查，才会一项一项的显示过程。

**磁盘挂载与卸除**

Linux 的磁盘挂载使用 mount 命令，卸载使用 umount 命令。

磁盘挂载语法：

`mount [-t 文件系统] [-L Label名] [-o 额外选项] [-n]  装置文件名  挂载点`

**实例 1**

用默认的方式，将刚刚创建的 /dev/hdc6 挂载到 /mnt/hdc6 上面！

```
[root@www ~]# mkdir /mnt/hdc6
[root@www ~]# mount /dev/hdc6 /mnt/hdc6
[root@www ~]# df
Filesystem           1K-blocks      Used Available Use% Mounted on
.....中间省略.....
/dev/hdc6              1976312     42072   1833836   3% /mnt/hdc6
```

`umount [-fn] 装置文件名或挂载点`

选项与参数：

- -f ：强制卸除！可用在类似网络文件系统 (NFS) 无法读取到的情况下；
- -n ：不升级 /etc/mtab 情况下卸除。

卸载/dev/hdc6

```
[root@www ~]# umount /dev/hdc6     
```

------



## 6.文件与文件系统的压缩与打包

Linux系统常见的压缩命令

 在linux环境中，压缩文件的扩展名大多是.tar, .tar.gz, .tgz, .gz, .Z, .bz2;

Linux支持的压缩命令很多，且不同的命令所用的压缩技术不同，彼此可能无法相互压缩/解压文件。

**tar**

- -c: 建立压缩档案
- -x：解压
- -t：查看内容
- -r：向压缩归档文件末尾追加文件
- -u：更新原压缩包中的文件

这五个是独立的命令，压缩解压都要用到其中一个，可以和别的命令连用但只能用其中一个。下面的参数是根据需要在压缩或解压档案时可选的。

- -z：有gzip属性的
- -j：有bz2属性的
- -Z：有compress属性的
- -v：显示所有过程
- -O：将文件解开到标准输出
- **-f: 使用档案名字，切记，这个参数是最后一个参数，且是必须的，后面只能接档案名。**

```shell
# tar -cf all.tar *.jpg
```

这条命令是将所有.jpg的文件打成一个名为all.tar的包。-c是表示产生新的包，-f指定包的文件名。

```shell
# tar -cf all.tar *.jpg# tar -rf all.tar *.gif
```

这条命令是将所有.gif的文件增加到all.tar的包里面去。-r是表示增加文件的意思。

```shell
# tar -uf all.tar logo.gif
```

这条命令是更新原来tar包all.tar中logo.gif文件，-u是表示更新文件的意思。

```shell
# tar -tf all.tar
```

这条命令是列出all.tar包中所有文件，-t是列出文件的意思

```shell
# tar -xf all.tar
```

这条命令是解出all.tar包中所有文件，-t是解开的意思

**压缩**

`tar -cvf jpg.tar *.jpg`      //将目录里所有jpg文件打包成tar.jpg 

`tar -czf jpg.tar.gz *.jpg`  //将目录里所有jpg文件打包成jpg.tar后，并且将其用gzip压缩，生成一个gzip压缩过的包，命名为jpg.tar.gz

 `tar -cjf jpg.tar.bz2 *.jpg` //将目录里所有jpg文件打包成jpg.tar后，并且将其用bzip2压缩，生成一个bzip2压缩过的包，命名为jpg.tar.bz2

`tar -cZf jpg.tar.Z *.jpg`  //将目录里所有jpg文件打包成jpg.tar后，并且将其用compress压缩，生成一个umcompress压缩过的包，命名为jpg.tar.Z

`rar a jpg.rar *.jpg` //rar格式的压缩，需要先下载rar for linux

`zip jpg.zip *.jpg` //zip格式的压缩，需要先下载zip for linux

**解压**

`tar -xvf file.tar` //解压 tar包

`tar -xzvf file.tar.gz` //解压tar.gz

`tar -xjvf file.tar.bz2`  //解压 tar.bz2

`tar -xZvf file.tar.Z`  //解压tar.Z

`unrar e file.rar` //解压rar

`unzip file.zip` //解压zip

**总结**

1、*.tar 用 tar -xvf 解压

2、*.gz 用 gzip -d或者gunzip 解压

3、*.tar.gz和*.tgz 用 tar -xzf 解压

4、*.bz2 用 bzip2 -d或者用bunzip2 解压

5、*.tar.bz2用tar -xjf 解压

6、*.Z 用 uncompress 解压

7、*.tar.Z 用tar -xZf 解压

8、*.rar 用 unrar e解压

9、*.zip 用 unzip 解压

解压jdk到指定文件夹：

```
tar -xzvf jdk-8u131-linux-x64.tar.gz -C /usr/local/java
```



## 8.软件包管理

### RPM

#### RPM概述

RPM（RedHat Package Manager），RedHat软件包管理工具，类似windows里面的setup.exe

 是Linux这系列操作系统里面的打包安装工具，它虽然是RedHat的标志，但理念是通用的。

RPM包的名称格式:  Apache-1.3.23-11.i386.rpm

- “apache” 软件名称
- “1.3.23-11”软件的版本号，主版本和此版本
- “i386”是软件所运行的硬件平台，Intel 32位微处理器的统称
-  “rpm”文件扩展名，代表RPM包

#### RPM查询命令（rpm -qa）

`rpm -qa`                         （功能描述：查询所安装的所有rpm软件包）

由于软件包比较多，一般都会采取过滤。rpm -qa | grep rpm软件包

```
pm -qa |grep firefox  #查询firefox软件安装情况
```

#### RPM卸载命令（rpm -e）

`rpm -e RPM软件包`  

`rpm -e --nodeps 软件包`  

| 选项     | 功能                                                         |
| -------- | ------------------------------------------------------------ |
| -e       | 卸载软件包                                                   |
| --nodeps | 卸载软件时，不检查依赖。这样的话，那些使用该软件包的软件在此之后可能就不能正常工作了。 |

```sh
rpm -e firefox #卸载firefox软件
```

#### RPM安装命令（rpm -ivh）

` rpm -ivh RPM包全名`

| 选项     | 功能                     |
| :------- | :----------------------- |
| -i       | -i=install，安装         |
| -v       | -v=verbose，显示详细信息 |
| -h       | -h=hash，进度条          |
| --nodeps | --nodeps，不检测依赖进度 |

### YUM仓库配置

#### YUM概述

YUM（全称为Yellow dog Updater, Modified）是一个在Fedora和RedHat以及CentOS中的Shell前端软件包管理器。基于RPM包管理，能够从指定的服务器自动下载RPM包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包，无须繁琐地一次次下载、安装。

#### YUM的常用命令

`yum [-y] [参数]`  -y表示对所有提问都回答“yes”

| 参数         | 功能                          |
| :----------- | :---------------------------- |
| install      | 安装rpm软件包                 |
| update       | 更新rpm软件包                 |
| check-update | 检查是否有可用的更新rpm软件包 |
| remove       | 删除指定的rpm软件包           |
| list         | 显示软件包信息                |
| clean        | 清理yum过期的缓存             |
| deplist      | 显示yum软件包的所有依赖关系   |

#### 修改网络YUM源

默认的系统YUM源，需要连接国外apache网站，网速比较慢，可以修改关联的网络YUM源为国内镜像的网站，比如网易163。



## 9.linux常用命令

| 常用快捷键  | 功能                         |
| :---------- | :--------------------------- |
| ctrl + c    | 停止进程                     |
| ctrl+l      | 清屏；彻底清屏是：reset      |
| ctrl + q    | 退出                         |
| 善于用tab键 | 提示(更重要的是可以防止敲错) |
| 上下键      | 查找执行过的命令             |
| ctrl +alt   | linux和Windows之间切换       |

### 帮助命令

#### man 获得帮助信息

`man [命令或配置文件]`          （功能描述：获得帮助信息）

```
man ls
```

#### help 获得shell内置命令的帮助信息

 `help 命令`       （功能描述：获得shell内置命令的帮助信息）

```
[root@hadoop101 ~]# help cd
```

### 文件目录类

##### cd 切换目录

`cd:Change Directory切换路径`

| 参数        | 功能                                 |
| ----------- | ------------------------------------ |
| cd 绝对路径 | 切换路径                             |
| cd相对路径  | 切换路径                             |
| cd ~或者cd  | 回到自己的家目录                     |
| cd -        | 回到上一次所在目录                   |
| cd ..       | 回到当前目录的上一级目录             |
| cd -P       | 跳转到实际物理路径，而非快捷方式路径 |

##### mkdir 创建新目录

`mkdir [-p] 要创建的目录`

```shell
mkdir test  #创建test目录
mkfir -p test/starfish   #创建多级目录
```

##### rmdir 删除空目录

```shell
rmdir test/starfish     #删除test下的空文件夹starfish
```

##### touch 创建空文件

```shell
touch test/helloworld.txt   #test文件夹下创建helloworld.txt文件
```

##### cp 复制文件或目录

`cp [-r] source dest`  复制source文件到dest

```shell
cp -r ~/home/sys/tmp/ .    #复制文件夹的所有文件到当前目录
```

##### rm 移除文件或目录

rm [选项] deleteFile               （功能描述：递归删除目录中所有内容）

| 选项 | 功能                                     |
| ---- | ---------------------------------------- |
| -r   | 递归删除目录中所有内容                   |
| -f   | 强制执行删除操作，而不提示用于进行确认。 |
| -v   | 显示指令的详细执行过程                   |

```shell
rm -rf dssz/   #递归删除目录中所有内容
```

##### mv 移动文件与目录或重命名

`mv oldNameFile newNameFile`      （功能描述：重命名）

`mv /temp/movefile /targetFolder`    （功能描述：移动文件）

```shell
mv tets.txt test.txt #重命名
mv /home/star/test.txt .  #移动文件到当前目录
```

##### cat 查看文件内容

`cat [-n] 要查看的文件`  可显示行号查看文件

##### more 文件内容分屏查看器

more指令是一个基于VI编辑器的文本过滤器，它以全屏幕的方式按页显示文本文件的内容。more指令中内置了若干快捷键，详见操作说明。

 `more 要查看的文件`

| 操作          | 功能说明                                |
| ------------- | --------------------------------------- |
| 空白键(space) | 代表向下翻一页；                        |
| Enter         | 代表向下翻『一行』；                    |
| q             | 代表立刻离开more ，不再显示该文件内容。 |
| Ctrl+F        | 向下滚动一屏                            |
| Ctrl+B        | 返回上一屏                              |
| =             | 输出当前行的行号                        |
| :f            | 输出文件名和当前行的行号                |

##### less 分屏显示文件内容

​       less指令用来分屏查看文件内容，它的功能与more指令类似，但是比more指令更加强大，支持各种显示终端。less指令在显示文件内容时，并不是一次将整个文件加载之后才显示，而是根据显示需要加载内容，对于显示大型文件具有较高的效率。

`less 要查看的文件`

| 操作       | 功能说明                                           |
| ---------- | -------------------------------------------------- |
| 空白键     | 向下翻动一页；                                     |
| [pagedown] | 向下翻动一页                                       |
| [pageup]   | 向上翻动一页；                                     |
| /字串      | 向下搜寻『字串』的功能；n：向下查找；N：向上查找； |
| ?字串      | 向上搜寻『字串』的功能；n：向上查找；N：向下查找； |
| q          | 离开less 这个程序；                                |

##### echo 输出内容到控制台

`echo [-e] [输出内容]`     -e： 支持反斜线控制的字符转换

| 控制字符 | 作用                |
| -------- | ------------------- |
| \\       | 输出\本身           |
| \n       | 换行符              |
| \t       | 制表符，也就是Tab键 |

```shell
[starfish:Technical-Learning$ echo -e "hello\tworld"

hello	world
```

##### head 显示文件头部内容

head用于显示文件的开头部分内容，默认情况下head指令显示文件的前10行内容。

`head 文件`             （功能描述：查看文件头10行内容）

`head -n 5 文件`      （功能描述：查看文件头5行内容，5可以是任意行数）

##### tail 输出文件尾部内容

tail用于输出文件中尾部的内容，默认情况下tail指令显示文件的最后10行内容。

`tail  文件`                  （功能描述：查看文件头10行内容）

`tail  -n 5 文件`           （功能描述：查看文件头5行内容，5可以是任意行数）

`tail  -f  文件`              （功能描述：实时追踪该文档的所有更新）

##### 输出重定向和>> 追加

`ls -l>文件`            （功能描述：列表的内容写入文件a.txt中（**覆盖写**））

`ls -al >>文件`        （功能描述：列表的内容**追加**到文件aa.txt的末尾）

`cat 文件1 > 文件2`      （功能描述：将文件1的内容覆盖到文件2）

`echo “内容” >> 文件`

2．案例实操

```sh
ls -l>houge.txt #将ls查看信息写入到文件中
ls -l>>houge.txt #将ls查看信息写入到文件中
echo hello>>houge.txt #采用echo将hello单词追加到文件中
```

##### ln 软链接

软链接也成为符号链接，类似于windows里的快捷方式，有自己的数据块，主要存放了链接其他文件的路径。

`ln -s [原文件或目录] [软链接名]`           （功能描述：给原文件创建一个软链接）

##### history 查看已经执行过历史命令

`history`             （功能描述：查看已经执行过历史命令）

### 时间日期类

`date [OPTION]... [+FORMAT]`

| 选项           | 功能                                           |
| -------------- | ---------------------------------------------- |
| -d<时间字符串> | 显示指定的“时间字符串”表示的时间，而非当前时间 |
| -s<日期时间>   | 设置系统日期时间                               |

| 参数            | 功能                         |
| --------------- | ---------------------------- |
| <+日期时间格式> | 指定显示时使用的日期时间格式 |

##### date 显示当前时间

`date `                         （功能描述：显示当前时间）

`date +%Y `               （功能描述：显示当前年份）

`date +%m`                （功能描述：显示当前月份）

`date +%d`                 （功能描述：显示当前是哪一天）

 `date "+%Y-%m-%d %H:%M:%S"`         （功能描述：显示年月日时分秒）

`date -d '1 days ago'`               （功能描述：显示前一天时间）

`date -d '-1 days ago' `                    （功能描述：显示明天时间）

##### cal 查看日历

`cal [具体某一年]`               （功能描述：不加选项，显示本月日历）

```sh
cal 2019  #显示2019年日历
```

### 用户管理命令

Linux系统是一个多用户多任务的操作系统，任何一个要使用系统资源的用户，都必须首先向**系统管理员申请一个账**号，然后以这个账号的身份进入系统。

**用户和组的相关文件**

**<font color=red>/etc/passwd</font>文件**

用户（user）的配置文件，记录用户的各种信息

每行的含义：用户名:口令:用户标识号:组标识号:注释性描述:主目录:登录Shell

 **<font color=red>/etc/shadow </font>文件**

口令的配置文件

每行的含义：登录名:加密口令:最后一次修改时间:最小时间间隔:最大时间间隔:警告时间:不活动时间:失效时间:保留

**<font color=red>/etc/group</font>文件**

组(group)的配置文件，记录Linux包含的组的信息

每行含义：组名:口令:组标识号:组内用户列表

##### useradd 添加新用户

`useradd 用户名`                    （功能描述：添加新用户）

`useradd -g 组名用户名`      （功能描述：添加新用户到某个组）

##### passwd 设置用户密码

`passwd 用户名`       （功能描述：设置用户密码）

##### id 查看用户是否存在

`id 用户名`

##### cat /etc/passwd 查看创建了哪些用户

```sh
cat  /etc/passwd
```

##### su 切换用户

`su 用户名称 `  （功能描述：切换用户，只能获得用户的执行权限，不能获得环境变量）

`su - 用户名称`        （功能描述：切换到用户并获得该用户的环境变量及执行权限）

- 从权限高的用户切换到权限低的用户，不需要输入密码，反之需要。

- 当需要返回到原来用户时，使用exit指令

- 如果su – 没有带用户名，则默认切换到root用户

##### userdel 删除用户

`userdel  用户名`           （功能描述：删除用户但保存用户主目录）

`userdel -r 用户名`          （功能描述：用户和用户主目录都删除,删除用户的同时，删除与用户相关的所有文件）

##### who 查看登录用户信息

 `whoami `               （功能描述：显示自身用户名称）

`who am i`              （功能描述：显示登录用户的用户名）

##### sudo 设置普通用户具有root权限

1．添加sysnc360用户，并对其设置密码。

```shell
useradd sysnc360
passwd sysnc360
```

2．修改配置文件

```sh
vi /etc/sudoers
```

修改/etc/sudoers 文件，找到下面一行(91行)，在root下面添加一行，如下所示：

```sh
## Allow root to run any commands anywhere
root    ALL=(ALL)     ALL
sysnc360   ALL=(ALL)    ALL
```

或者配置成采用sudo命令时，不需要输入密码

```sh
## Allow root to run any commands anywhere
root      ALL=(ALL)     ALL
sysnc360   ALL=(ALL)    NOPASSWD:ALL
```

修改完毕，现在可以用sysnc360帐号登录，然后用命令sudo ，即可获得root权限进行操作。

```sh
sudo mkdir module  #用普通用户在/opt目录下创建一个文件夹
chown atguigu:atguigu module/
```

##### usermod 修改用户

`usermod -g 用户组用户名`

| 选项 | 功能                                                  |
| ---- | ----------------------------------------------------- |
| -g   | 修改用户的初始登录组，给定的组必须存在。默认组id是1。 |

```sh
usermod -g root starfish #将用户加入到用户组
```

### 用户组管理命令

每个用户都有一个用户组，系统可以对一个用户组中的所有用户进行集中管理。不同Linux 系统对用户组的规定有所不同，

如Linux下的用户属于与它同名的用户组，这个用户组在创建用户时同时创建。

用户组的管理涉及用户组的添加、删除和修改。组的增加、删除和修改实际上就是对/etc/group文件的更新。

##### groupadd 新增组

`groupadd 组名`

##### groupdel 删除组

`groupdel 组名`

##### groupmod 修改组

`groupmod -n 新组名 老组名`

```sh
groupmod -n sysnc360 starfish #修改sysnc360组名称为starfish
```

##### cat /etc/group 查看创建了哪些组

```sh
cat  /etc/group
```



### 文件权限操作

##### chmod 改变权限

`chmod  [{ugoa}{+-=}{rwx}] 文件或目录`

`chmod  [mode=421 ] [文件或目录]`

经验技巧

​	u:所有者  g:所有组 o:其他人  a:所有人(u、g、o的总和)

r=4 w=2 x=1        rwx=4+2+1=7

```sh
chmod u+x test.txt #修改文件使其所属主用户具有执行权限

chmod g+x test.txt #修改文件使其所属组用户具有执行权限

chmod u-x,o+x test.txt #修改文件所属主用户执行权限,并使其他用户具有执行权限

chmod 777 test.txt #采用数字的方式，设置文件所有者、所属组、其他用户都具有可读可写可执行权限

chmod -R 777 test/ #采用数字的方式，设置文件所有者、所属组、其他用户都具有可读可写可执行权限
```



##### chown 改变所有者

`chown [-r] [最终用户] [文件或目录] `        （功能描述：改变文件或者目录的所有者）

##### chgrp 改变所属组

`chgrp [最终用户组] [文件或目录]` （功能描述：改变文件或者目录的所属组）

### 搜索查找类

##### find 查找文件或者目录

find指令将从指定目录向下递归地遍历其各个子目录，将满足条件的文件显示在终端。

`find [搜索范围] [选项]`

| 选项            | 功能                             |
| --------------- | -------------------------------- |
| -name<查询方式> | 按照指定的文件名查找模式查找文件 |
| -user<用户名>   | 查找属于指定用户名所有文件       |
| -size<文件大小> | 按照指定的文件大小查找文件。     |

按文件名：

```sh
find opt/ -name *.txt #根据名称查找/目录下的filename.txt文件
find opt/ -user test #查找/opt目录下，用户名称为-user的文件
find /home -size +204800 #在/home目录下查找大于200m的文件（+n 大于  -n小于   n等于）
```

##### locate快速定位文件路径

locate指令利用事先建立的系统中所有文件名称及路径的locate数据库实现快速定位给定的文件。Locate指令无需遍历整个文件系统，查询速度较快。为了保证查询结果的准确度，管理员必须定期更新locate时刻。

` locate 搜索文件`

经验技巧:由于locate指令基于数据库进行查询，所以第一次运行前，必须使用updatedb指令创建locate数据库。

```sh
updatedb
locate tmp
```

##### grep 过滤查找及“|”管道符

管道符，“|”，表示将前一个命令的处理结果输出传递给后面的命令处理

`grep [-n] 查找内容源文件(-n可显示行号)`

### 压缩和解压类

##### gzip/gunzip 压缩

`gzip 文件`              （功能描述：压缩文件，只能将文件压缩为*.gz文件）

`gunzip 文件.gz`       （功能描述：解压缩文件命令）

经验技巧

- 只能压缩文件不能压缩目录

- 不保留原来的文件

##### zip/unzip 压缩

`zip  [选项] XXX.zip  将要压缩的内容`             （功能描述：压缩文件和目录的命令）

`unzip [选项] XXX.zip `                                      （功能描述：解压缩文件）

| zip选项 | 功能     |
| ------- | -------- |
| -r      | 压缩目录 |

| unzip选项 | 功能                     |
| --------- | ------------------------ |
| -d<目录>  | 指定解压后文件的存放目录 |

经验技巧

zip 压缩命令在window/linux都通用，可以压缩目录且保留源文件。

##### tar 打包

`tar  [选项]  XXX.tar.gz 将要打包进去的内容`          （功能描述：打包目录，压缩后的文件格式.tar.gz）

| 选项 | 功能               |
| ---- | ------------------ |
| -c   | 产生.tar打包文件   |
| -v   | 显示详细信息       |
| -f   | 指定压缩后的文件名 |
| -z   | 打包同时压缩       |
| -x   | 解包.tar文件       |

```sh
tar -zcvf houma.tar.gz aa.txt bb.txt  #压缩文件aa和bb
tar -zcvf test.tar.gz test/ #压缩目录
tar -zxvf test.tar.gz #解压到当前目录
tar -zxvf test.tar.gz -C /opt #解压到指定目录
```



### 磁盘分区类

##### df 查看磁盘空间使用情况 df: disk free 空余硬盘

`df 选项`（功能描述：列出文件系统的整体磁盘使用量，检查文件系统的磁盘空间占用情况）

| 选项 | 功能                                                    |
| ---- | ------------------------------------------------------- |
| -h   | 以人们较易阅读的GBytes, MBytes, KBytes 等格式自行显示； |

```sh
df -h #查看磁盘使用情况
```

##### fdisk 查看分区

`fdisk -l `                 （功能描述：查看磁盘分区详情,该命令必须在root用户下才能使用）

功能说明

- Linux分区(类比wins的C,D,E盘)
  - Device：分区序列
  - Boot：引导
  - Start：从X磁柱开始
  - End：到Y磁柱结束
  - Blocks：容量
  - Id：分区类型ID
  - System：分区类型

##### mount/umount 挂载/卸载

对于Linux用户来讲，不论有几个分区，分别分给哪一个目录使用，它总归就是一个根目录、一个独立且唯一的文件结构。

Linux中每个分区都是用来组成整个文件系统的一部分，它在用一种叫做“挂载”的处理方法，它整个文件系统中包含了一整套的文件和目录，并将一个分区和一个目录联系起来，要载入的那个分区将使它的存储空间在这个目录下获得。

`mount [-t vfstype] [-o options] device dir`（功能描述：挂载设备）

`umount设备文件名或挂载点`                     （功能描述：卸载设备）

| 参数       | 功能                                                         |
| ---------- | ------------------------------------------------------------ |
| -t vfstype | 指定文件系统的类型，通常不必指定。mount 会自动选择正确的类型。常用类型有：光盘或光盘镜像：iso9660DOS fat16文件系统：msdos[Windows](http://blog.csdn.net/hancunai0017/article/details/6995284) 9x fat32文件系统：vfatWindows NT ntfs文件系统：ntfsMount Windows文件[网络](http://blog.csdn.net/hancunai0017/article/details/6995284)共享：smbfs[UNIX](http://blog.csdn.net/hancunai0017/article/details/6995284)(LINUX) 文件网络共享：nfs |
| -o options | 主要用来描述设备或档案的挂接方式。常用的参数有：loop：用来把一个文件当成硬盘分区挂接上系统ro：采用只读方式挂接设备rw：采用读写方式挂接设备　  iocharset：指定访问文件系统所用字符集 |
| device     | 要挂接(mount)的设备                                          |
| dir        | 设备在系统上的挂接点(mount point)                            |

### 进程线程类

进程是正在执行的一个程序或命令，每一个进程都是一个运行的实体，都有自己的地址空间，并占用一定的系统资源。

##### ps 查看当前系统进程状态

ps:process status 进程状态

`ps aux | grep xxx`            （功能描述：查看系统中所有进程）

 `ps -ef| grep xxx`             （功能描述：可以查看子父进程之间的关系）

| 选项 | 功能                   |
| ---- | ---------------------- |
| -a   | 选择所有进程           |
| -u   | 显示所有用户的所有进程 |
| -x   | 显示没有终端的进程     |

3．功能说明

​       （1）ps aux显示信息说明

- USER：该进程是由哪个用户产生的
- PID：进程的ID号
- %CPU：该进程占用CPU资源的百分比，占用越高，进程越耗费资源；
- %MEM：该进程占用物理内存的百分比，占用越高，进程越耗费资源；
- VSZ：该进程占用虚拟内存的大小，单位KB；
- RSS：该进程占用实际物理内存的大小，单位KB；
- TTY：该进程是在哪个终端中运行的。其中tty1-tty7代表本地控制台终端，tty1-tty6是本地的字符界面终端，tty7是图形终端。pts/0-255代表虚拟终端。
- STAT：进程状态。常见的状态有：R：运行、S：睡眠、T：停止状态、s：包含子进程、+：位于后台
- START：该进程的启动时间
- TIME：该进程占用CPU的运算时间，注意不是系统时间
- COMMAND：产生此进程的命令名

（2）ps -ef显示信息说明

- UID：用户ID 
- PID：进程ID 
- PPID：父进程ID 
- C：CPU用于计算执行优先级的因子。数值越大，表明进程是CPU密集型运算，执行优先级会降低；数值越小，表明进程是I/O密集型运算，执行优先级会提高
- STIME：进程启动的时间
- TTY：完整的终端名称
- TIME：CPU时间
- CMD：启动进程所用的命令和参数

如果想查看进程的CPU占用率和内存占用率，可以使用aux;

如果想查看进程的父进程ID可以使用ef;

```sh
ps aux|grep java

ps -ef|grep tomcat
```

##### kill 终止进程

`kill [-9] 进程号`              （功能描述：通过进程号杀死进程,-9表示强迫进程立即停止）

`killall 进程名称`                   （功能描述：通过进程名称杀死进程，也支持通配符，这在系统因负载过大而变得很慢时很有用）    

##### pstree 查看进程树

 `pstree [选项]`

| 选项 | 功能               |
| ---- | ------------------ |
| -p   | 显示进程的PID      |
| -u   | 显示进程的所属用户 |

##### top 查看系统健康状态

` top [选项]  ` 

| 选项    | 功能                                                         |
| ------- | ------------------------------------------------------------ |
| -d 秒数 | 指定top命令每隔几秒更新。默认是3秒在top命令的交互模式当中可以执行的命令： |
| -i      | 使top不显示任何闲置或者僵死进程。                            |
| -p      | 通过指定监控进程ID来仅仅监控某个进程的状态。                 |

| 操作 | 功能                          |
| ---- | ----------------------------- |
| P    | 以CPU使用率排序，默认就是此项 |
| M    | 以内存的使用率排序            |
| N    | 以PID排序                     |
| q    | 退出top                       |

###### 查询结果字段解释

第一行信息为任务队列信息

| 内容                            | 说明                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| 12:26:46                        | 系统当前时间                                                 |
| up 1 day, 13:32                 | 系统的运行时间，本机已经运行1天13小时32分钟                  |
| 2 users                         | 当前登录了两个用户                                           |
| load  average: 0.00, 0.00, 0.00 | 系统在之前1分钟，5分钟，15分钟的平均负载。一般认为小于1时，负载较小。如果大于1，系统已经超出负荷。 |

第二行为进程信息

| Tasks:  95 total | 系统中的进程总数                          |
| ---------------- | ----------------------------------------- |
| 1 running        | 正在运行的进程数                          |
| 94 sleeping      | 睡眠的进程                                |
| 0 stopped        | 正在停止的进程                            |
| 0 zombie         | 僵尸进程。如果不是0，需要手工检查僵尸进程 |

第三行为CPU信息

| Cpu(s):  0.1%us | 用户模式占用的CPU百分比                                      |
| --------------- | ------------------------------------------------------------ |
| 0.1%sy          | 系统模式占用的CPU百分比                                      |
| 0.0%ni          | 改变过优先级的用户进程占用的CPU百分比                        |
| 99.7%id         | 空闲CPU的CPU百分比                                           |
| 0.1%wa          | 等待输入/输出的进程的占用CPU百分比                           |
| 0.0%hi          | 硬中断请求服务占用的CPU百分比                                |
| 0.1%si          | 软中断请求服务占用的CPU百分比                                |
| 0.0%st          | st（Steal  time）虚拟时间百分比。就是当有虚拟机时，虚拟CPU等待实际CPU的时间百分比。 |

第四行为物理内存信息

| Mem:    625344k total | 物理内存的总量，单位KB                                       |
| --------------------- | ------------------------------------------------------------ |
| 571504k used          | 已经使用的物理内存数量                                       |
| 53840k free           | 空闲的物理内存数量，我们使用的是虚拟机，总共只分配了628MB内存，所以只有53MB的空闲内存了 |
| 65800k buffers        | 作为缓冲的内存数量                                           |

第五行为交换分区（swap）信息

| Swap:   524280k total | 交换分区（虚拟内存）的总大小 |
| --------------------- | ---------------------------- |
| 0k used               | 已经使用的交互分区的大小     |
| 524280k free          | 空闲交换分区的大小           |
| 409280k cached        | 作为缓存的交互分区的大小     |

```sh
top -d 1
top -i
top -p 2575

# 执行上述命令后，可以按P、M、N对查询出的进程结果进行排序。
```

##### netstat 显示网络统计信息和端口占用情况

`netstat -anp |grep 进程号`（功能描述：查看该进程网络信息）

`netstat -nlp      | grep 端口号`  （功能描述：查看网络端口号占用情况）

| 选项 | 功能                                     |
| ---- | ---------------------------------------- |
| -n   | 拒绝显示别名，能显示数字的全部转化成数字 |
| -l   | 仅列出有在listen（监听）的服务状态       |
| -p   | 表示显示哪个进程在调用                   |

```sh
netstat -anp | grep java #通过进程号查看该进程的网络信息

netstat -nlp | grep **20670 **#查看某端口号是否被占用
```



### crond 系统定时任务

##### crond 服务管理

```sh
service crond restart #重新启动crond服务
```

##### crontab 定时任务设置

`crontab [选项]`

| 选项 | 功能                                      |
| ---- | ----------------------------------------- |
| -e   | 编辑crontab定时任务,会打开vim编辑你的工作 |
| -l   | 查询crontab任务                           |
| -r   | 删除当前用户所有的crontab任务             |

| 项目      | 含义                 | 范围                    |
| --------- | -------------------- | ----------------------- |
| 第一个“*” | 一小时当中的第几分钟 | 0-59                    |
| 第二个“*” | 一天当中的第几小时   | 0-23                    |
| 第三个“*” | 一个月当中的第几天   | 1-31                    |
| 第四个“*” | 一年当中的第几月     | 1-12                    |
| 第五个“*” | 一周当中的星期几     | 0-7（0和7都代表星期日） |

| 特殊符号 | 含义                                                         |
| -------- | ------------------------------------------------------------ |
| *        | 代表任何时间。比如第一个“*”就代表一小时中每分钟都执行一次的意思。 |
| ，       | 代表不连续的时间。比如“0 8,12,16 * * * 命令”，就代表在每天的8点0分，12点0分，16点0分都执行一次命令 |
| -        | 代表连续的时间范围。比如“0 5  *  *  1-6命令”，代表在周一到周六的凌晨5点0分执行命令 |
| */n      | 代表每隔多久执行一次。比如“*/10  *  *  *  *  命令”，代表每隔10分钟就执行一遍命令 |

| 时间              | 含义                                                         |
| ----------------- | ------------------------------------------------------------ |
| 45 22 * * * 命令  | 在22点45分执行命令                                           |
| 0 17 * * 1 命令   | 每周1 的17点0分执行命令                                      |
| 0 5 1,15 * * 命令 | 每月1号和15号的凌晨5点0分执行命令                            |
| 40 4 * * 1-5 命令 | 每周一到周五的凌晨4点40分执行命令                            |
| */10 4 * * * 命令 | 每天的凌晨4点，每隔10分钟执行一次命令                        |
| 0 0 1,15 * 1 命令 | 每月1号和15号，每周1的0点0分都会执行命令。注意：星期几和几号最好不要同时出现，因为他们定义的都是天。非常容易让管理员混乱。 |





# 第9章常见错误及解决方案

\1.     虚拟化支持异常情况如下几种情况



图1-168



图1-169



图1-170



图1-171

问题原因：宿主机BIOS设置中的硬件虚拟化被禁用了

解决办法：需要打开笔记本BIOS中的IVT对虚拟化的支持



图1-172

第10







## FAQ

1. Linux系统下你关注过哪些内核参数，说说你知道的。
2. Linux下IO模型有几种，各自的含义是什么。
3. epoll和poll有什么区别。
4. 平时用到哪些Linux命令。
5. 用一行命令查看文件的最后五行。
6. 用一行命令输出正在运行的java进程。
7. 介绍下你理解的操作系统中线程切换过程。
8. 进程和线程的区别。
9. top 命令之后有哪些内容，有什么作用。
10. 线上CPU爆高，请问你如何找到问题所在
11.  linux系统日志在哪里看 
12.  如何查看网络进程 



