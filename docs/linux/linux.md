## 1.Linux的文件权限

在linux中的每个用户必须属于一个组，不能独立于组外。在linux中每个文件有所有者、所在组、其它组的概念

**ls -al（l）**:

ls -l(别名ll 就可以查看)

![linux-ls.png](https://i.loli.net/2019/11/19/FajuBx9hKcLfEiv.png)

从左到又每一列的信息依次为 **权限、 连接数、 所有者 、 用户组 、 文件容量 、 修改日期 、 文件名**

第一列的十位字母代表的是文件的类型和权限，第一个字符代表这个文件是“目录、文件或链接文件等”含义：

   d：代表是目录

  -：代表是文件

 	 l：代表是连接文件

 	 b：代表设备文件里可供存储的接口设备

 	 c：代表设备文件里面的串行端口设备。如键盘，鼠标等

后边9个字符，每3个字符为一组，“rwx”（可读、可写、可执行eXecute）这三个参数的组合，（rwx3者的顺序不能改变，换句话说，第一个要么是r,要么啥都没有，不能是w或者x），三个组合分别代表“文件所有者的权限”、“同用户组的权限”、“其他非本用户组的权限”。

![linux-permission.png](https://i.loli.net/2019/11/19/1rkOtD9GxQ7BAZ6.png)

**权限的重要性：**

系统保护的功能；

团队开发软件或数据共享的功能；

**改变文件属性和权限：**

- **chgrp**: 改变文件所属用户组(change group)

- - - chgrp [-R]  users  目录或文件 ： 将这个路径下的文件的用户组改成“users“
    - 这个新用户组一定得是/etc/group下有的，否则会报错。
    - 若最后一个参数是目录，则表示只将这个目录下的文件的用户组改成这个。
    - R表示若最后一个参数是目录，则将当前目录下的文件连同子目录下的所有文件的用户组都改成这个。

- **chown**: 改变文件所有者(change owner)

- - - chown [-R] 用户名 文件或目录 ： 将这个目录下的所有文件的所有者都改成这个用户名。
    - 这个用户名必须是/etc/passwd下有的才行。
    - 这个命令可以既修改文件主又修改用户组：
    - chown [-R] 用户名：用户组名 目录/文件（：和 . 都可以）
    - chown [-R] 用户名.用户组名 目录/文件
    - 由于用户名可以存在小数点，当出现含有小数点的用户名时，系统会发生误判，所以我们一般都使用：来连接用户名和用户组名。
    - 还可以仅修改用户组名：chown [-R] .用户组名 目录/文件

- **chmod**: 改变文件的权限

 改变文件的权限有两种方法：用数字或者符号进行权限的修改

a）用数字进行权限的修改

Linux文件的基本权限有9个，分别是owner、group、others三种身份各有自己的read、write、execute权限。在这种方式中，r＝4、w＝2、x＝1，将每一组的三个值加起来，组成一个三位数即可。例如：

文件主：rwx ＝ 4＋2＋1＝7；

同组用户：rwx＝4＋2＋1＝7；

其他人：－－－＝0＋0＋0＝0；

所以命令如下：

**chmod [-R] 770  文件/目录**

b）用符号进行权限的修改s

用u、g、o 代表user、group、others三种身份的权限，a 代表 all，也就是全部的身份。 +（加入），-（除去），=（设置）。

**chmod u/g/o/a +/-/= r/w/x 文件/目录**

例子：文件主能够读、写、执行；同组用户和其他用户能够读、执行。

**chmod u=rwx,go=rx 文件名**

假设原先不知道文件的属性，现在只想让所有的人能够执行这个文件，则：

**chmod a+x 文件/目录**

假设原先不知道文件的属性，现在只想让同组用户和其他用户无法写，则：

**chmod go-w 文件/目录**

**☆☆☆☆**

**目录和文件的权限意义：**

a）权限对文件的意义.

​            r：代表可读取此文件的实际内容

​      w：代表可以编辑、新增或者修改文件的内容（但是不包含删除文件）

​      x：代表该文件具有可以被系统执行的权限。<与windows不同，在Linux中判断一个文件是否可以执行，不是根据后缀名（如.exe ，.bat，.com），而是和这个文件是否具有“x”权限决定的。>

b）权限对目录的意义

​     r：代表具有读取目录结构列表的权限（你可以使用ls命令将目录下的所有列表读出来）

​     w：这个权限对目录来说可是很强大的，表示你具有更改该目录结构列表的权限

​        主要有：新建新的文件与目录

​              删除已经存在的文件或者目录（无论文件的权限是怎样的）

​              将已经存在的文件或者目录重命名

​              转移该目录内的文件、目录位置

​     x：目录虽然不可以被拿来执行，但是目录的x代表的是用户能否进入该目录成为工作目录的用途。（所谓工作目录就是你当下的目录，也就是时候，如果目录不具有x权限，那么你就不能通过cd命令进入到该目录下工作）。

能不能进入某一目录，只与该目录的x 权限有关。

 Linux的单一文件或者目录的最大容许文件名为255个字符,包含完整路径名记（/）的完整文件名为4096个字符。

------



## 2.Linux系统目录结构

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

- **绝对路径：**

路径的写法，由根目录 / 写起，例如： /usr/share/doc 这个目录。

- **相对路径：**

路径的写法，不是由 / 写起，例如由 /usr/share/doc 要到 /usr/share/man 底下时，可以写成： cd ../man 这就是相对路径的写法啦！

**目录的相关操作：**

**ls**（查看文件与目录）

**cd**（切换目录）  

**pwd**（显示当前所在目录）

**mkdir**（创建新目录）

*mkdir 【-mp】目录名称*

加了-p 参数，可以自行创建多层目录， 加了-m，可以强制设置属性。

case:

*mkdir test*

*mkdir -p test1/test2/test3/test4*

*mkdir -m 711 test2（给予新目录drwx--x--x的权限）*

**rmdir**（删除“空”目录）

*rmdir [-p] 目录名称（-p 可以连同上层空目录一起删除）*

*rmdir -p test1/test2/test3/test4*

**cp**（复制文件或目录）

*cp [-adfilprsu] 源文件（source） 目标文件（destination）*

**-a**：相当于-pdr的意思；

**-i**：若目标文件已经存在且无法开启，则删除后再尝试一次；

**-p**：连同文件的属性一起复制过去，而非使用默认属性（备份常用）；

**-r**：递归持续复制，用于**目录的复制行为**；

case:

*cp test testtest （将test文件***重命名***为testtest）*

*cp /var/log/wtmp* **.***（复制到当前目录.）*

*cp -r /etc/ /tmp（复制etc目录下的所有内容到/tmp下，权限可能被改变了）*

**rm**（移除文件或目录）

*rm [-fir] 文件或目录*

**-f**：force的意思，忽略不存在的文件，不会出现警告信息；

**-i**：互动模式，在删除前会询问用户是否操作；

**-r**：递归删除，危险

case:

*不能直接删除目录，删除目录的话需要加-r*

*rm -r /tmp/test （root用户默认会加入-i参数，询问，删除的是test文件，没有删除tmp）*

*touch  /tmp/aaa （新建空文件aaa）*

*rm /tmp/aaa（直接删除文件aaa）*

**mv**（移动文件与目录，或更名）

*mv [-fiu] source destination*

**-f**：force强制的意思，如果目标文件已经存在，不会询问而直接覆盖；

**-i**：若目标文件已经存在，就会询问是否覆盖；

**-u**：若目标文件已经存在，且source比较新，才会更新；

case:

*mv aaa test（将文件aaa移动到目录test中）*

*mv test mytest（将test重命名为mytest）*

*mv aaa bbb ccc test（将aaa、bbb、ccc多个源文件或目录全部移动到test目录中）*

**文件内容查阅**

**cat**：由第一行开始显示文件内容；

**tac**：从最后一行开始显示，可以看出tac是cat的倒写形式；

**nl**：显示的时候，顺便输出行号；

**more**：一页一页的显示文件内容；

**less**：与more类似，但是可以往前翻页；

**head**：只看开头几行；

**tail**：只看结尾几行；

**od**：以二进制的方式读取文件内容

**直接查看文件内容 cat、tac、nl**

**cat**（concatenate）

*cat [-AbEnTv] 文件*

**-A**：相当于-vET的整合参数，可列出一些特殊字符，而不是空白而已；

**-b**：列出行号，仅针对非空白行做行号显示，空白行不标行号；

**-E**：将结尾用断行字符 $ 显示出来；

**-n**：打印出行号，连同空白行也会有行号，区别于-b；

**-T**：将Tab按键以^T显示出来；

**-v**：列出一些看不出来的特殊字符

**cat -n 文件路径 | tail -n +5 | head -n 6  // 显示 5 ～ 10 行的内容， 包括5 和10**

**cat 文件路径 | head -n 10 | tail -n +5   //同上**

**tac**（反向显示）

**nl**（添加行号打印）

*nl [-bnw] 文件*

**可翻页查看文件内容 more和less**

**more**（一页一页翻动）

![linux-more.png](https://i.loli.net/2019/11/19/Tnex5WvCocU3p4m.png)

如果文件内容较多，more 命令之后，会继续等到后续操作

**空格键（Space）**：向下翻页；

**Enter**：向下滚动一行；

**/字符串**：在当前显示内容中，向下查询该字符串；

**:f**：显示出文件名以及目前显示的行数；

**q**：直接离开more，不再显示该文件内容；

**b**：往回翻页，只对文件有用，对管道无用

**less**（一页一页翻动）

 less可以用向上、下按键的功能前后翻页，也可以向上查询

**空格键（Space）**：向下翻页；

**[PageDown]**：向下翻动一页

**[PageUp]**：向上翻动一页

**Enter**：向下滚动一行；

**/字符串**：向下查询该字符串；

**?字符串**：向上查询该字符串；

**n**：重复前一个查询（与/或？有关）；

**N**：反向重复前一个查询（与/或？有关）；

**q**：直接离开less，不再显示该文件内容；

**数据选取查看 head和tail**

**head**（取出前面几行）

*head [-n number] 文件（默认显示十行）*

**-n**：后边接数字，代表显示几行的意思；

**tail**（取出后边几行）

*tail [-n number] 文件*

*tail [-f] 文件*

**-f**：表示持续监测后边所接的文件内容，一般用于查看日志进程，按下[ctrl]+c才会结束检测；

**touch**（修改文件时间或者创建新文件）

*touch [-acdmt] 文件*

**-a**：仅修改访问时间；

**-c**：仅修改访问时间，若该文件不存在则不创建新文件；

**-d**：后面可以接想要修改的日期而不用目前的日期；

**-m**：仅修改mtime；

**-t**：后面可以接想要修改的时间而不用目前的时间；



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

**vi的使用：**

vi共分为3种模式，分别是一般模式、编辑模式和命令行模式。

**一般模式**

以vi打开一个文件就直接进入一般模式（默认的模式）。在这个模式中， 你可以使用『上下左右』按键来移动光标，你可以使用『删除字符』或『删除整行』来处理档案内容， 也可以使用『复制、贴上』来处理你的文件数据。

**编辑模式**

在一般模式中可以进行删除、复制、粘贴等等的动作，但是却无法编辑文件内容的！ 要等到你按下『i, I, o, O, a, A, r, R』等任何一个字母之后才会进入编辑模式。注意了！通常在 Linux 中，按下这些按键时，在画面的左下方会出现『 INSERT 或 REPLACE 』的字样，此时才可以进行编辑。而如果要回到一般模式时， 则必须要按下『Esc』这个按键即可退出编辑模式。

**命令行模式**

在一般模式当中，输入『 : / ? 』三个中的任何一个按钮，就可以将光标移动到最底下那一行。在这个模式当中， 可以提供你『搜寻资料』的动作，而读取、存盘、大量取代字符、离开 vi 、显示行号等等的动作则是在此模式中达成的！

**一般模式与编辑模式及命令行模式可以互相转换，但编辑模式与命令行模式之间不可以互相转换**

**按键说明**

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

**vim的功能**

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



## 5.linux磁盘管理

Linux磁盘管理好坏管理直接关系到整个系统的性能问题。

Linux磁盘管理常用三个命令为df、du和fdisk。

- df：列出文件系统的整体磁盘使用量
- du：检查磁盘空间使用量
- fdisk：用于磁盘分区

**df**

df命令参数功能：检查文件系统的磁盘空间占用情况。可以利用该命令来获取硬盘被占用了多少空间，目前还剩下多少空间等信息。

语法：

df [-ahikHTm] [目录或文件名]

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

[root@www ~]# **df -h** Filesystem            Size  Used Avail Use% Mounted on /dev/hdc2             9.5G  3.7G  5.4G  41% / /dev/hdc3             4.8G  139M  4.4G   4% /home /dev/hdc1              99M   11M   83M  12% /boot tmpfs                 363M     0  363M   0% /dev/shm

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

**du**

Linux du命令也是查看使用空间的，但是与df命令不同的是Linux du命令是对文件和目录磁盘使用的空间的查看，还是和df命令有一些区别的，这里介绍Linux du命令。

语法：

du [-ahskm] 文件或目录名称

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

fdisk [-l] 装置名称

选项与参数：

- -l ：输出后面接的装置所有的分区内容。若仅有 fdisk -l 时， 则系统将会把整个系统内能够搜寻到的装置的分区均列出来。

**实例 1**

列出所有分区信息

```
[root@AY120919111755c246621 tmp]# fdisk -l

Disk /dev/xvda: 21.5 GB, 21474836480 bytes
255 heads, 63 sectors/track, 2610 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000

    Device Boot      Start         End      Blocks   Id  System
/dev/xvda1   *           1        2550    20480000   83  Linux
/dev/xvda2            2550        2611      490496   82  Linux swap / Solaris

Disk /dev/xvdb: 21.5 GB, 21474836480 bytes
255 heads, 63 sectors/track, 2610 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x56f40944

    Device Boot      Start         End      Blocks   Id  System
/dev/xvdb2               1        2610    20964793+  83  Linux
```

**实例 2**

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

磁盘分割完毕后自然就是要进行文件系统的格式化，格式化的命令非常的简单，使用 mkfs（make filesystem） 命令。

语法：

mkfs [-t 文件系统格式] 装置文件名

选项与参数：

- -t ：可以接文件系统格式，例如 ext3, ext2, vfat 等(系统有支持才会生效)

**实例 1**

查看 mkfs 支持的文件格式

[root@www ~]# mkfs[tab][tab] mkfs         mkfs.cramfs  mkfs.ext2    mkfs.ext3    mkfs.msdos   mkfs.vfat

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

fsck（file system check）用来检查和维护不一致的文件系统。

若系统掉电或磁盘发生问题，可利用fsck命令对文件系统进行检查。

语法：

fsck [-t 文件系统] [-ACay] 装置名称

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

[root@www ~]# fsck[tab][tab] fsck         fsck.cramfs  fsck.ext2    fsck.ext3    fsck.msdos   fsck.vfat

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

mount [-t 文件系统] [-L Label名] [-o 额外选项] [-n]  装置文件名  挂载点

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

umount [-fn] 装置文件名或挂载点

选项与参数：

- -f ：强制卸除！可用在类似网络文件系统 (NFS) 无法读取到的情况下；
- -n ：不升级 /etc/mtab 情况下卸除。

卸载/dev/hdc6

```
[root@www ~]# umount /dev/hdc6     
```



## 6.文件与文件系统的压缩与打包

Linux系统常见的压缩命令

 在linux环境中，压缩文件的扩展名大多是.tar, .tar.gz, .tgz, .gz, .Z, .bz2;

Linux支持的压缩命令很多，且不同的命令所用的压缩技术不同，彼此可能无法相互压缩/解压文件。

**tar**

-c: 建立压缩档案

-x：解压

-t：查看内容

-r：向压缩归档文件末尾追加文件

-u：更新原压缩包中的文件

这五个是独立的命令，压缩解压都要用到其中一个，可以和别的命令连用但只能用其中一个。下面的参数是根据需要在压缩或解压档案时可选的。

-z：有gzip属性的

-j：有bz2属性的

-Z：有compress属性的

-v：显示所有过程

-O：将文件解开到标准输出

下面的参数-f是必须的

**-f: 使用档案名字，切记，这个参数是最后一个参数，后面只能接档案名。**

\# tar -cf all.tar *.jpg

这条命令是将所有.jpg的文件打成一个名为all.tar的包。-c是表示产生新的包，-f指定包的文件名。

\# tar -rf all.tar *.gif

这条命令是将所有.gif的文件增加到all.tar的包里面去。-r是表示增加文件的意思。

\# tar -uf all.tar logo.gif

这条命令是更新原来tar包all.tar中logo.gif文件，-u是表示更新文件的意思。

\# tar -tf all.tar

这条命令是列出all.tar包中所有文件，-t是列出文件的意思

\# tar -xf all.tar

这条命令是解出all.tar包中所有文件，-t是解开的意思

**压缩**

tar -cvf jpg.tar *.jpg //将目录里所有jpg文件打包成tar.jpg 

tar -czf jpg.tar.gz *.jpg  //将目录里所有jpg文件打包成jpg.tar后，并且将其用gzip压缩，生成一个gzip压缩过的包，命名为jpg.tar.gz

 tar -cjf jpg.tar.bz2 *.jpg //将目录里所有jpg文件打包成jpg.tar后，并且将其用bzip2压缩，生成一个bzip2压缩过的包，命名为jpg.tar.bz2

tar -cZf jpg.tar.Z *.jpg  //将目录里所有jpg文件打包成jpg.tar后，并且将其用compress压缩，生成一个umcompress压缩过的包，命名为jpg.tar.Z

rar a jpg.rar *.jpg //rar格式的压缩，需要先下载rar for linux

zip jpg.zip *.jpg //zip格式的压缩，需要先下载zip for linux

**解压**

tar -xvf file.tar //解压 tar包

tar -xzvf file.tar.gz //解压tar.gz

tar -xjvf file.tar.bz2  //解压 tar.bz2

tar -xZvf file.tar.Z  //解压tar.Z

unrar e file.rar //解压rar

unzip file.zip //解压zip

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

tar -xzvf jdk-8u131-linux-x64.tar.gz -C /usr/local/java





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



