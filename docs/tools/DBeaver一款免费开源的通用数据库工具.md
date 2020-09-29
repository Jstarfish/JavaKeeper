DBeaver 是一个基于 Java 开发，免费开源的通用数据库管理和开发工具，使用非常友好的 [ASL](https://dbeaver.io/files/dbeaver_license.txt) 协议。可以通过[官方网站](https://dbeaver.io/)或者 [Github](https://github.com/dbeaver/dbeaver/) 进行下载。

由于 DBeaver 基于 Java 开发，可以运行在各种操作系统上，包括：Windows、Linux、macOS 等。DBeaver 采用 Eclipse 框架开发，支持插件扩展，并且提供了许多数据库管理工具：ER 图、数据导入/导出、数据库比较、模拟数据生成等。

DBeaver 通过 JDBC 连接到数据库，可以支持几乎所有的数据库产品，包括：MySQL、PostgreSQL、MariaDB、SQLite、Oracle、Db2、SQL Server、Sybase、MS Access、Teradata、Firebird、Derby 等等。[商业版本](https://dbeaver.com/)更是可以支持各种 NoSQL 和大数据平台：MongoDB、InfluxDB、Apache Cassandra、Redis、Apache Hive 等。

### 下载与安装

DBeaver 社区版可以通过[官方网站](https://dbeaver.io/download/)或者 [Github](https://github.com/dbeaver/dbeaver/releases) 进行下载。两者都为不同的操作系统提供了安装包或者解压版，可以选择是否需要同时安装 JRE。另外，官方网站还提供了 DBeaver 的 Eclipse 插件，可以在 Eclipse 中进行集成。

DBeaver 支持中文，安装过程非常简单，不多说，唯一需要注意的是 DBeaver 的运行依赖于 JRE。不出意外，安装完成后运行安装目录下的 dbeaver.exe 可以看到以下界面（Windows 10）：

![new_connection](https://img-blog.csdnimg.cn/2019043017554476.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
这个界面其实是新建数据库连接，我们可以看到它支持的各种数据平台；先点击“**取消**”按钮，进入主窗口界面。

此时，它会提示我们是否建立一个示例数据库。

![create_database](https://img-blog.csdnimg.cn/20190430180321861.JPG#pic_center)
如果点击“是(Y)”，它会创建一个默认的 SQLite 示例数据库。下图是它的主窗口界面。

![DBeaver](https://img-blog.csdnimg.cn/20190430202853429.JPG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70)
DBeaver 和我们常用的软件类似，最上面是菜单项和快捷工具，左侧是已经建立的数据库连接和项目信息，右侧是主要的工作区域。

### 连接数据库

打开 DBeaver 之后，首先要做的就是创建数据库连接。可以通过菜单“**数据库**” -> “**新建连接**”打开新建连接向导窗口，也就是我们初次运行 DBeaver 时弹出的窗口。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190430204330601.JPG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
我们以 PostgreSQL 为例，新建一个数据库连接。选择 PostgreSQL 图标，点击“**下一步(N)**”。

![connection](https://img-blog.csdnimg.cn/20190430205252763.JPG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
然后是设置数据库的连接信息：主机、端口、数据库、用户、密码。“**Advanced settings**”高级设置选项可以配置 SSH、SSL 以及代理等，也可以为连接指定自己的名称和连接类型（开发、测试、生产）。

点击最下面的“**测试链接(T)**”可以测试连接配置的正确性。初次创建某种数据库的连接时，会提示下载相应的 JDBC 驱动。

![driver](https://img-blog.csdnimg.cn/20190430210119221.JPG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
它已经为我们查找到了相应的驱动，只需要点击“**下载**”即可，非常方便。下载完成后，如果连接信息正确，可以看到连接成功的提示。

![success](https://img-blog.csdnimg.cn/20190430210536891.JPG#pic_center)
确认后完成连接配置即可。左侧的数据库导航中会增加一个新的数据库连接。

由于某些数据库（例如 Oracle、Db2）的 JDBC 驱动需要登录后才能下载，因此可以使用手动的方式进行配置。选择菜单“**数据库**” -> “**驱动管理器**”。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190430211557737.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
选择 Oracle ，点击“**编辑(E)…**”按钮。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190430211734232.JPG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
通过界面提示的网址，手动下载 Oracle 数据库的 JDBC 驱动文件，例如 ojdbc8.jar。然后点击“**添加文件(F)**”按钮，选择并添加该文件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190430212156376.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
下次建立 Oracle 数据库连接时即可使用该驱动。

新建连接之后，就可以通过这些连接访问相应的数据库，查看和编辑数据库中的对象，执行 SQL 语句，完成各种管理和开发工作。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190430212552322.JPG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70)

### 生成 ER 图

最后介绍一下如何生成数据库对象的 ER 图。点击窗口左侧“**数据库导航**”旁边的“**项目**”视图。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190430214154882.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
其中有个“**ER Diagrams**”，就是实体关系图。右击该选项，点击“**创建新的 ER 图**”。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190430214817578.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70#pic_center)
输入一个名称并选择数据库连接和需要展示的对象，然后点击“**完成**”，即可生成相应的 ER 图。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190430215113385.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hvcnNlcw==,size_16,color_FFFFFF,t_70)
ER 图可以进行排版和显示设置，也支持打印为图片。DBeaver 目前还不支持自己创建 ER 图，只能从现有的数据库中生成。

对于图形工具，很多功能我们都可以自己去使用体会；当然，DBeaver 也提供了[用户指南](https://github.com/dbeaver/dbeaver/wiki)，自行参考。