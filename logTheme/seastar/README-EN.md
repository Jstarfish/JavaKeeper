# Claudia

简体中文 | [English](./README.md)

[点我查看项目演示](https://haojen.github.io/Claudia-theme-blog/)

![cover](./screenshot/claudia-cover.png)

## Bug fix (2018.12.29)

fix embed element height auto issues


## 使用

### 使用评论系统
> 在本主题的`_config.yml`配置文件

## livere (来比力)

	use_livere: true
	livere_uid: 你注册的来比力 uid

## Disqus

	use_disqus: true
	disqus_url: 你的 Disqus 链接

### 配置博文封面图

将 img 的 `alt` 属性设置为 `post-cover` 即可

### 配置右上角导航栏菜单项

注意: 必须在主题的 `_config.yml` 中配置以下信息, 而非博客根目录下的 `_config.yml`

    menu:
      Home: / #页面所在的路径
      My Works: /works
      About: /about
      #Tags: /tags


## 用户信息配置

注意: 必须在主题的 `_config.yml` 中配置以下信息, 而非博客根目录下的 `_config.yml`

	user_name: your name
	user_avatar: your avatar
	user_location: your location
	user_description: about you introduction
	
	// this info will show About page
	user_contact: 
	user_introduction
	
	// config you share info
	weibo_username: 
	zhihu_username: 
	github_username:
	twitter_username: 
	facebook_username: 
	linkedin_username: 

## 配置代码高亮

在theme主题目录下, 可以通过 `_config.yml` 文件(注意不是hexo根目录), 配置代码高亮的style, 步骤如下:
首先在您的hexo根目录下 `_config.yml` , 关闭内置的着色器:
```
highlight:
  enable: false
  line_number: false
  auto_detect: false
  tab_replace: false
```
然后在主题的 `_config.yml` 中配置 `block_highlight` 字段, 例如:
```
block_highlight: highlight_rainbow
```
目前提供一下几种选择, 并且一旦您关闭内嵌的风格, 最好要选一种:
* highlight_default
* highlight_light
* highlight_github
* highlight_rainbow
* highlight_vs
* highlight_atom


	
## 创建 About 页面
在博客根目录下的 `source` 文件夹里创建一个 `about` 文件夹, 然后打开该文件夹, 新建一个 `index.md`, 打开, 将下面这段文本复制到 `index.md` 里保存
	
	title: about
	date: 2017-05-31 10:05:56
	layout: about
	---

## 创建 Works 页面
创建的方式和上述创建 About 页面相同, 只不过是 `index.md` 内容略有不同, works 页面的 `index.md` 如下:

```
title: My Works
date: 2017-05-31 10:05:56
layout: works
---
```

然后再在博客根目录下的 `source` 文件夹下创建一个 `_data` 文件夹, 然后打开, 在里面新建一个 `project.json` 文件

project.json 文件格式范本:

	{
	  "Apple 官网临摹": {
	    "title": "Apple 官网临摹",
	    "subTitle": "根据美版apple官网临摹",
	    "img_link": "http://o7bkkhiex.bkt.clouddn.com/item-apple.jpg",
	    "use" : ["jQuery"],
	    "link": "http://haojen.github.io/apple-linmo/",
	    "data":"2016.3",
	    "direction": "临摹 2016 年三月份 Apple 美版单页面。"
	  },
	   "Anisina (阿尼丝娜)": {
	    "title": "Anisina",
	    "subTitle": "基于 Hexo 制作的个人博客主题",
	    "img_link": "http://o7bkkhiex.bkt.clouddn.com/Anisina.png",
	    "use" : ["jQuery","Bootstrap","Node.js","EJS","Hexo","SASS"],
	    "link": "http://haojen.github.io/",
	    "data": "2016.5",
	    "direction":
	        "Hexo 是某位台湾友人基于 Node.js 编写的博客框架"
	  }
	}
	
## 功能配置
可以依次在主题的根目录中执行终端命令, 根据自身需求分别安装依赖
	
	// 流程图功能
    npm install hexo-filter-flowchart --save
    
    // Emoji
    npm install hexo-filter-github-emojis --save
    
    // 搜索功能
    npm install hexo-generator-search --save
    
    // 数学公式
    npm install hexo-renderer-mathjax --save
    
具体的使用教程, 请参阅 [博客中对应的文章](https://haojen.github.io/Claudia-theme-blog/)    

## 💙 最后

如果遇到任何问题, 可以提交 issue , 你的反馈对我很重要!
另外,喜欢的话不妨给个 Star 😍

## License

MIT © [haojen ma](http://haojen.github.io)
