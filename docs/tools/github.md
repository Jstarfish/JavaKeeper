github 骚操作

你真的会用 github 吗



## 常用词含义

- watch：会持续收到该项目的动态
- fork：复制某个项目到自己的 Github仓库上
- star：点赞数
- clone：将项目下载到本地
- follow：关注感兴趣的作者



## in 关键词限制搜索范围

公式：xxx关键词 in:name(/description/readme)

xxx in:name 项目名包含 xxx

xxx in:description 项目描述包含 xxx

xxx in:readme 项目的 readme 文件包含 xxx

组合使用：

​	搜索项目名或者readme 中包含秒杀的项目

​	seckill in:name,readme



## stars或者fork 数量关键词查找

公式 

- xxx 关键词 stars 通配符  :> 或者  :>=
- 区间范围数字  数字1.. 数字 2

实例

- 查找stars 数大于等于 5000 的 SpringBoot 项目：springboot stars:>=5000
- 查找 ford数大于 500 的 springboot项目：springboot forks:>500

组合使用

- 查找 fork在 100 到 200之间且 star数在 80到100 之间的 springboot项目： 

  springboot forks:100..200 stars:80..100

## awesome加强搜索

公式 

- awesome 关键字

- awesome 系列，一般是用来收集学习，工具，书籍类相关的项目

实例

- 搜索优秀 redis 相关的项目，包括框架、教程等  awesome redis



## 高亮显示某一行代码

公式

- 1 行   地址后紧跟 #L数字
- 多行  地址后紧跟 #L数字-L数字

## 项目内搜索

- 在项目页 输入小写 t
- github 快捷键 https://help.github.com/en/github/getting-started-with-github/keyboard-shortcuts



## gayhub 肯定要有交友功能的

公式

- location:地区
- language:语言

北京地区的 Java 用户

location:beijing language:java