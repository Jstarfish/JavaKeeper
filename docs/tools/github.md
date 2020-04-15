# GitHub 竟然有这些骚操作，真是涨姿势

GitHub，不用过多介绍。一个面向开源及私有软件项目的托管平台，因为只支持 git 作为唯一的版本库格式进行托管，故名 GitHub。

作为「全球最大的程序员“交友”社区」，程序员的你，真的可以把它的使用发挥到极致吗？



> 文章收录在 GitHub [JavaKeeper](https://github.com/Jstarfish/JavaKeeper) ，N线互联网开发必备技能兵器谱

## 搜索

### 全局搜索

#### 傻瓜式搜索

比如我们要学习下秒杀（seckill）代码的实现，可以在整个 GitHub 站点全局搜索相关内容

![](https://tva1.sinaimg.cn/large/00831rSTly1gdkawng6mtj31hi0u0wnd.jpg)



但是这样的搜索范围太大，且项目质量参差不齐，所以在搜索结果页，还可以通过 Languages 选择实现语言，Sort 选择排序规则（按 Star 数量、Fork 数量、最近更新时间等）。



#### 精准搜索（技术范）

##### 1. in 关键词限制搜索范围

公式：`搜索词 in:name(/description/readme)`

搜索项目名称和自述文件中包含秒杀的仓库   **seckill in:name,readme**

| 限定符            | 示例                                                         |
| ----------------- | ------------------------------------------------------------ |
| `in:name`         | **`jquery in:name`** 匹配仓库名称包含 "jquery" 的内容        |
| `in:description`  | **`jquery in:name,description`** 匹配仓库名或描述中包含 "jquery" 的内容(组合使用) |
| `in:readme`       | **`jquery in:readme`** readme文件中包含"jquery"              |
| `repo:owner/name` | **`repo:octocat/hello-world`** 查询某人的某个项目（查octocat 的 hello-world 仓库） |

##### 2. 关键词查找

**搜索语法**：

- `>n`、`>=n`、`<n`、`<=n`：查询数量范围，可以是 starts、forks、topics......
- `n..*`、`*..n`：等同于 `>=n` 和 `<=n`
- `n..m`：取值范围 n 到 m

| **限定符**           | **示例**                                                     |
| -------------------- | ------------------------------------------------------------ |
| `stars:n`            | **stars:500** 匹配 500 个 stars 的项目<br>**stars:10..20** 匹配 starts 数量 10 到 20 的项目 |
| `followers:n`        | **`node followers:>=10000`** 匹配关注者大于等于 10000 的 node 仓库 |
| `forks:n`            | **seckill forks:5**  匹配有 5 个 forks 的秒杀项目            |
| `created:YYYY-MM-DD` | **seckill created:>2020-01-01** 创建时间在 2020-01-01 之后的秒杀项目 |
| `language:LANGUAGE`  | **seckill language:java** 匹配 java 语言编写的秒杀项目       |
| `user:name`          | **user:Jstarfish stars:>50** 匹配 Jstarfish 用户 stars 数大于 50 的仓库 |
| `location:LOCATION`  | **location:beijing** 匹配北京的朋友们                        |
| 互相组合使用         | **seckill stars:>=500 fork:true language:java** 匹配stars 数量大等于 500（包含 forks 数），且语言是 java 的秒杀项目<br>**location:beijing language:java** 北京做 Java 开发的大佬 |

##### 3. awesome 加强搜索

`awesome 关键字` ，awesome 系列，一般是用来收集学习，工具，书籍类相关的项目。比如我们要学习下 redis 相关的项目，包括框架、教程等，`awesome redis`

![](https://tva1.sinaimg.cn/large/00831rSTly1gdj8xkkn3rj31m00u0tin.jpg)



这几个其实也够用了，官方还给出了所有你能想得到的搜索方式：

https://help.github.com/en/github/searching-for-information-on-github/searching-on-github



### 项目内搜索

- 在项目页 输入小写 t
- github 快捷键 https://help.github.com/en/github/getting-started-with-github/keyboard-shortcuts

#### 文件搜索 

进入仓库主页面，有个 **Find file**，可以按文件名搜索

![](https://tva1.sinaimg.cn/large/00831rSTly1gdj3cgwimrj31jc0s6jyp.jpg)



## 快捷键

- `s` 或 `/`    定位到搜索框
- g + 操作，表示跳转
  - `g d` 前往我的主页
  - `g n` 前往通知面板 About notifications
  - `g c` 前往代码界面 Code tab（以下均在仓库页面）
  - `g i` 前往问题界面 About issues
  - `g w` 前往 About Wike

- `t`  激活文件查找，和 Find file 一样
- `w`  切换分支
- `l` 浏览代码时，快速跳转到指定行

官方提供：https://help.github.com/en/github/getting-started-with-github/keyboard-shortcuts





## 高亮显示代码

有时候我们要请教大佬，让大佬帮忙看看代码，可以使用高亮功能，在 GitHub 或 GitLab 中找到自己的代码，url 地址后加 `#L 数字` 表示高亮第几行，加 `#L 数字 -L数字` ，表示高亮代码区间（GitLab 上不需要第二个 L）

eg：

https://github.com/Jstarfish/starfish-learning/blob/master/starfish-learn-designpattern/src/decorator/Client.java#L16-L20

![](https://tva1.sinaimg.cn/large/00831rSTly1gdjvc3wbhnj31c00pcgqz.jpg)



## 查看 GitHub 热门趋势

https://github.com/trending  可以按语言，日期范围（本天、本周、本月）查看热度，有好多可供学习的热门项目。

![](https://tva1.sinaimg.cn/large/00831rSTly1gdkb5qrij2j31lh0u0wou.jpg)

## 插件

最后再推荐一个查看 GitHub 代码的浏览器插件。

octotree 用于将 Github 项目代码以树形格式展示，可以像 IDE 一样，看代码。而且在展示的列表中，我们可以下载指定的文件，而不需要下载整个项目。

![img](https://tva1.sinaimg.cn/large/007S8ZIlly1gdu75x2rj1j30hs0b4gn4.jpg)





![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdu79z432kj30ku0aumy2.jpg)