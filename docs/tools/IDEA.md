工欲善其事，必先利其器 ，当下有数不清的 Java 程序员将石器时代的 Eclipse 替换成了现代化的智能开发工具 InteliJ IDEA ，写代码的小日子过得不亦乐乎（玩笑话，两者各有千秋，看个人习惯使用）

可每次看到别人用IDEA 的时候，都会发现，哇哦，还能这样操作，还有每次注册码失效的时候，我都为自己在用盗版软件而“悔恨为什么不多赚钱买正版”，然后到处找注册码，所以这篇文章被来啦来啦~~。。。安装和写hello world 部署到服务器这些就不记录了，

![](https://i03piccdn.sogoucdn.com/61d2ed1ddc107ba6)

> 点赞+收藏 就学会系列，文章收录在 GitHub [JavaEgg](https://github.com/Jstarfish/JavaEgg) ，N线互联网开发必备技能兵器谱



## InteliJ IDEA 介绍

IDEA，全称 IntelliJ IDEA，是 Java 语言的集成开发环境，IDEA 在业界被公认为是最好的 java 开发工具之一，尤其在智能代码助手、代码自动提示、重构、J2EE 支持、Ant、JUnit、CVS 整合、代码审查、创新的 GUI 设计等方面的功能可以说是超常的。 

IDEA(https://www.jetbrains.com/idea/) 是 JetBrains 公司的产品，公司旗下还有其它产品，比如： WebStorm、DataGrip、GoLand...



## 优势

- 强大的整合能力。比如：Git、Maven、Spring 等 
- 提示功能的快速、便捷 
- 提示功能的范围广 
- 好用的快捷键和代码模板 private static final psf 
- 精准搜索（ IDEA 会将您的源代码编入索引 ）
- 不需要频繁的Ctrl+S（自动保存）
- 自带反编译器，方便查看源码



在 Eclipse 中我们有 Workspace（工作空间）和 Project（工程）的概念，在 IDEA 中只有 Project（工程）和 Module（模块）的概念 。Eclipse 中 workspace 相当于 IDEA 中的 Project ，Eclipse 中 Project 相当于 IDEA 中的 Module 

IDEA 和 Eclipse 的术语对比

| Eclipse            | IntelliJ IDEA |
| ------------------ | ------------- |
| Workspace          | Project       |
| Project            | Module        |
| Facet              | Facet         |
| Library            | Library       |
| JRE                | SDK           |
| Classpath variable | Path variable |



## 模板

实时代码模板 (Live Templates)

![idea-live-templates](https://tva1.sinaimg.cn/large/006tNbRwly1gb3djwtijhg30ow05u190.gif)

它的原理就是配置一些常用代码字母缩写，在输入简写时可以出现你预定义的固 定模式的代码，使得开发效率大大提高，同时也可以增加个性化。最简单的例子 就是在 Java 中输入 sout 会出现 System.out.println(); 

**Editor – General – Postfix Completion**  查看已经存在的模板（不可修改）

![idea-templates1](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dai5462j30wr0lvdi9.jpg)

 **Editor — Live Templates**  查看或自定义模板（可以添加方式注释、类注释）

![idea-templates2](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dc5zx6gj30wm0lrq4n.jpg)

![idea-templates4](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dcc5j5rj30wi0phdi0.jpg)

```
*
 * @description:
 * @param $param$
 * @return $return$
 * @date $time$ $date$
 **/
```

类注释一般通过 **File — Setting — Editor — Live Templates — File and Code Templates** 设置

![idea-templates3](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dcijz88j30we0imq56.jpg)



## 断点调试 

程序猿么，每天都在写bug，所以这个功能一定得用的溜

配置通用调试属性和行为 ： **Settings/Preferences | Build, Execution, Deployment | Debugger**

#### 1. 断点类型

断点有四种类型：

1. 行断点（Line Breakpoints）：最经常用的方式， 可以设置在任何可执行的代码行上 
2. 方法断点（Method Breakpoints）： 在进入或退出指定的方法或其实现之一时挂起程序，允许您检查方法的进入/退出条件
3. 字段断点（Field Watchpoints）： 当指定的字段被读取或写入时，挂起程序。需要注意的是，默认只有写才会停下，想要让读取时也停下，需要右击断点，在**Watch**的**Field access**上打勾才行
4. 异常断点（Exception Breakpoints）： 当抛出Throwable或其子类时挂起程序 。可以在 **Run — View Breakpoints **中的Java Exception Breakpoints 里添加异常的具体类型。这样的话，程序中一旦发生了这种异常马上就会停下来

#### 2. 设置断点

左键点击行号栏（快捷键： `Ctrl+F8` ）

![image-20200120113747367](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dcn5xgnj30oo0eu3z8.jpg)

##### 设置异常断点

点击**Debug**工具窗口左侧的的 **View Breakpoints** ![](https://tva1.sinaimg.cn/large/006tNbRwly1gb3e1iqmy8j300w00w0br.jpg) 或者快捷键 `Ctrl+Shift+F8` ，可以新建异常检测，或者检测所有异常（**Any Exception**） 情况，这样只要程序有相应异常，就会挂起

![image-20200120115152419](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dcv7jh2j317e0iiq7g.jpg)

##### 条件断点

有时候我们在循环处理数据时候，可能只关心某个条件的数据，就可以在断点位置右键，设置**断点条件**，（下图，在i==6 的时候挂起程序）

![idea-break-cond.jpg](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dd05wjkj30q00g8aac.jpg)

##### 多线程断点

在调试多线程代码时候，只能串行调试，因为IDEA在Debug时默认阻塞级别是ALL，会阻塞其它线程，只有在当前调试线程走完时才会走其它线程。如果像下图一样是lambda表达式的行，可以选择断点类型。

![idea-break-thread1](https://tva1.sinaimg.cn/large/006tNbRwly1gb3ddnim60j30r50cfmxt.jpg)

可以在 View Breakpoints 里选择 Thread （右键断点），这样就可以Frames 切换线程debug了。

![idea-break-thread2](https://tva1.sinaimg.cn/large/006tNbRwly1gb3ddyql2lj30zg0l7whg.jpg)



#### 3. 逐步执行程序

![idea-step](https://tva1.sinaimg.cn/large/006tNbRwly1gb3de46cw6j30bg00xwea.jpg)

- ![idea-step-over](https://tva1.sinaimg.cn/large/006tNbRwly1gb3deexlofj300w00w098.jpg) **step over** —— 步过，如果当前行断点是一个方法，则不进入当前方法体内 
-  ![idea-step-into](https://tva1.sinaimg.cn/large/006tNbRwly1gb3deki3euj300w00w053.jpg) **step into** —— 步入，如果当前行断点是一个方法，则进入当前方法体内，一般用于进入自定义方法内，不会进入官方类库的方法 
-  ![idea-force-step](https://tva1.sinaimg.cn/large/006tNbRwly1gb3depxltpj300w00w054.jpg) **force step into** `Shift+Alt+F7` ——  强制步入，能进入任何方法，查看底层源码的时候可以用这个进入官方类库的方法 
-  ![idea-step-out](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dexsu5jj300w00w056.jpg) **step out**  `Shift+F8` —— 步出， 从步入的方法内退出到方法调用处 
-  ![idea-drop-frame](https://tva1.sinaimg.cn/large/006tNbRwly1gb3df26zpvj300w00w07w.jpg)  **Drop frame** —— 回退到上一步
-   ![idea-run-curson](https://tva1.sinaimg.cn/large/006tNbRwly1gb3df6yrw3j300w00w07t.jpg) **Run to cursor**  `Alt+F9`  ——  运行到光标处，可以将光标定位到你需要查看的那一行，然后使用这个功能，代码会运行至光标行，而不需要打断点 



断点这块有好多功能，可以分析JVM中堆对象、Java8的Stream操作，留个传送门。。。TODO

某大佬总结的： [在Intellij IDEA中使用Debug](https://www.cnblogs.com/chiangchou/p/idea-debug.html)

官方教程： https://www.jetbrains.com/help/idea/debugging-code.html 



## 配置Tomcat远程调试

有时候会有一些服务器差异问题导致的问题，不好排查，这个时候就想远程调试下服务器上的代码。

① 配置tomcat， 在tomcat/bin下的 catalina.sh 上边添加下边的一段设置 

`-Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=9527`

![image-20200120174529907](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dfbv8c7j30v80ccgme.jpg)

② IDEA设置

![idea-remote-idea](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dfgaic2j30t00iojt3.jpg)



③ 启动tomcat后，在IDEA运行远程Tomcat就能debug了

还有一种复制Startup/Connection 中的内容到 JAVA_OPTS 中，没有尝试

![idea-remote-idea-debug](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dfk23g0j30t80hejsj.jpg)



## 书签

书签在翻看源码或者大佬代码的时候，可以方便记录代码的调用链路。

书签有匿名书签（可以有无数个）和标记书签（有数字或者字母助记符的书签）两种

操作书签：**Navigate | Bookmarks** 可以创建匿名书签 Toggle Bookmark。创建标技书签 Toggle Bookmark With Mnemonic，查看标签 Show Bookmarks

![idea-bookmark.png](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dfouqc0j30w40j33z9.jpg)



## 插件

- **Lombok** —— 开发神器，可以简化你的实体类 

- **Maven Helper** ——  方便显示maven的依赖树，处理冲突的好帮手 

- .**ignore** —— 忽略不需要提交的文件

- **FindBugs-IDEA** ——  代码审查 

- **Alibaba Java Coding Guidelines** ——  阿里的开发设计规范 

- **Alibaba Cloud Toolkit** ——  帮助开发者更高效地开发、测试、诊断并部署应用。通过插件，可以将本地应用一键部署到任意服务器或云端；并且还内置了 Arthas 诊断、Dubbo工具、Terminal 终端、文件上传、函数计算和 MySQL 执行器等工具 

- **Easy Code** ——  支持自定义模板的代码生成插件

- **RestfulToolkit** ——  RESTful 服务开发辅助工具集（安利，可以直接在右侧的RestServices查看，所有项目的restful接口，还可以通过 `Ctrl \` 全局搜索 ）

  ![idea-plugin-restful](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dfv5ntbj31cu0l5k1m.jpg)

IDEA 主题和插件排行榜： https://plugins.jetbrains.com/search?orderBy=downloads&products=idea  



## 激活

仅供个人学习使用~~

1. 下载补丁文件 **`jetbrains-agent.jar`** 并将它放置到 Idea安装目录的bin目录下，https://pan.baidu.com/s/1Zy-vQGOdKoqDdB8sWIcQOg

2. 免费试用，进入IDEA, 点击最上面的菜单栏中的 **Help - Edit Custom VM Options **，在`idea.exw.vmoptionos`文件中加入`-javaagent:D:\Program Files\JetBrains\IntelliJ IDEA 2019.2.4\bin\jetbrains-agent.jar`(换成你的jar包目录)，重启

   ![idea-acativate1](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dimgueyj30yv0lkdk8.jpg)

3. 重启IDEA 后，打开**Help — Register **，在License Server 填上， http://jetbrains-license-server ，失败的话就输入下边的注册码

   ![idea-acativate2.png](https://i.loli.net/2020/01/20/koxyXB7zPRITMCg.png)

```
520E5894E2-eyJsaWNlbnNlSWQiOiI1MjBFNTg5NEUyIiwibGljZW5zZWVOYW1lIjoicGlnNiIsImFzc2lnbmVlTmFtZSI6IiIsImFzc2lnbmVlRW1haWwiOiIiLCJsaWNlbnNlUmVzdHJpY3Rpb24iOiJVbmxpbWl0ZWQgbGljZW5zZSB0aWxsIGVuZCBvZiB0aGUgY2VudHVyeS4iLCJjaGVja0NvbmN1cnJlbnRVc2UiOmZhbHNlLCJwcm9kdWN0cyI6W3siY29kZSI6IklJIiwicGFpZFVwVG8iOiIyMDg5LTA3LTA3In0seyJjb2RlIjoiUlMwIiwicGFpZFVwVG8iOiIyMDg5LTA3LTA3In0seyJjb2RlIjoiV1MiLCJwYWlkVXBUbyI6IjIwODktMDctMDcifSx7ImNvZGUiOiJSRCIsInBhaWRVcFRvIjoiMjA4OS0wNy0wNyJ9LHsiY29kZSI6IlJDIiwicGFpZFVwVG8iOiIyMDg5LTA3LTA3In0seyJjb2RlIjoiREMiLCJwYWlkVXBUbyI6IjIwODktMDctMDcifSx7ImNvZGUiOiJEQiIsInBhaWRVcFRvIjoiMjA4OS0wNy0wNyJ9LHsiY29kZSI6IlJNIiwicGFpZFVwVG8iOiIyMDg5LTA3LTA3In0seyJjb2RlIjoiRE0iLCJwYWlkVXBUbyI6IjIwODktMDctMDcifSx7ImNvZGUiOiJBQyIsInBhaWRVcFRvIjoiMjA4OS0wNy0wNyJ9LHsiY29kZSI6IkRQTiIsInBhaWRVcFRvIjoiMjA4OS0wNy0wNyJ9LHsiY29kZSI6IkdPIiwicGFpZFVwVG8iOiIyMDg5LTA3LTA3In0seyJjb2RlIjoiUFMiLCJwYWlkVXBUbyI6IjIwODktMDctMDcifSx7ImNvZGUiOiJDTCIsInBhaWRVcFRvIjoiMjA4OS0wNy0wNyJ9LHsiY29kZSI6IlBDIiwicGFpZFVwVG8iOiIyMDg5LTA3LTA3In0seyJjb2RlIjoiUlNVIiwicGFpZFVwVG8iOiIyMDg5LTA3LTA3In1dLCJoYXNoIjoiODkwNzA3MC8wIiwiZ3JhY2VQZXJpb2REYXlzIjowLCJhdXRvUHJvbG9uZ2F0ZWQiOmZhbHNlLCJpc0F1dG9Qcm9sb25nYXRlZCI6ZmFsc2V9-DZ/oNHBfyho0XrrCJJvAOKg5Q1tLBgOdbCmzCKwkuM+Yryce0RoOi3OOmH6Ba/uTcCh/L37meyD0FJdJIprv59y4+n+k2kIeF/XKrKqg0dEsDUQRw0lUqqMt99ohqa+zmbJ44Yufdwwx/F1CtoRGvEQ2Mn0QjuqRoZJZ3wiT5Am22JiJW8MaNUl3wg9YPj+OPGARKKJUdUJ0NGUDQBcBAv5ds8LhbSbJSbPkbkwH/a1QMz4nEdn6lRDKI1aFIn43QhBSCFqvUq6TPJlbIJ0ZjE+PyZjHFBKCgkry0DHPXU2BbtIZPsksQnN3fx240a9K6sN7peZnLpEoMoq23FEz4g==-MIIElTCCAn2gAwIBAgIBCTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTE4MTEwMTEyMjk0NloXDTIwMTEwMjEyMjk0NlowaDELMAkGA1UEBhMCQ1oxDjAMBgNVBAgMBU51c2xlMQ8wDQYDVQQHDAZQcmFndWUxGTAXBgNVBAoMEEpldEJyYWlucyBzLnIuby4xHTAbBgNVBAMMFHByb2QzeS1mcm9tLTIwMTgxMTAxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5ndaik1GD0nyTdqkZgURQZGW+RGxCdBITPXIwpjhhaD0SXGa4XSZBEBoiPdY6XV6pOfUJeyfi9dXsY4MmT0D+sKoST3rSw96xaf9FXPvOjn4prMTdj3Ji3CyQrGWeQU2nzYqFrp1QYNLAbaViHRKuJrYHI6GCvqCbJe0LQ8qqUiVMA9wG/PQwScpNmTF9Kp2Iej+Z5OUxF33zzm+vg/nYV31HLF7fJUAplI/1nM+ZG8K+AXWgYKChtknl3sW9PCQa3a3imPL9GVToUNxc0wcuTil8mqveWcSQCHYxsIaUajWLpFzoO2AhK4mfYBSStAqEjoXRTuj17mo8Q6M2SHOcwIDAQABo4GZMIGWMAkGA1UdEwQCMAAwHQYDVR0OBBYEFGEpG9oZGcfLMGNBkY7SgHiMGgTcMEgGA1UdIwRBMD+AFKOetkhnQhI2Qb1t4Lm0oFKLl/GzoRykGjAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBggkA0myxg7KDeeEwEwYDVR0lBAwwCgYIKwYBBQUHAwEwCwYDVR0PBAQDAgWgMA0GCSqGSIb3DQEBCwUAA4ICAQBonMu8oa3vmNAa4RQP8gPGlX3SQaA3WCRUAj6Zrlk8AesKV1YSkh5D2l+yUk6njysgzfr1bIR5xF8eup5xXc4/G7NtVYRSMvrd6rfQcHOyK5UFJLm+8utmyMIDrZOzLQuTsT8NxFpbCVCfV5wNRu4rChrCuArYVGaKbmp9ymkw1PU6+HoO5i2wU3ikTmRv8IRjrlSStyNzXpnPTwt7bja19ousk56r40SmlmC04GdDHErr0ei2UbjUua5kw71Qn9g02tL9fERI2sSRjQrvPbn9INwRWl5+k05mlKekbtbu2ev2woJFZK4WEXAd/GaAdeZZdumv8T2idDFL7cAirJwcrbfpawPeXr52oKTPnXfi0l5+g9Gnt/wfiXCrPElX6ycTR6iL3GC2VR4jTz6YatT4Ntz59/THOT7NJQhr6AyLkhhJCdkzE2cob/KouVp4ivV7Q3Fc6HX7eepHAAF/DpxwgOrg9smX6coXLgfp0b1RU2u/tUNID04rpNxTMueTtrT8WSskqvaJd3RH8r7cnRj6Y2hltkja82HlpDURDxDTRvv+krbwMr26SB/40BjpMUrDRCeKuiBahC0DCoU/4+ze1l94wVUhdkCfL0GpJrMSCDEK+XEurU18Hb7WT+ThXbkdl6VpFdHsRvqAnhR2g4b+Qzgidmuky5NUZVfEaZqV/g==
```

4. **Help — About**，搞定 

![idea-acativate3.png](https://tva1.sinaimg.cn/large/006tNbRwly1gb3dgqb6xzj30oo0gntc2.jpg)



## 参考

IntelliJ IDEA 2019.3官方指南  https://www.jetbrains.com/help/idea/installation-guide.html 

idea2019激活  https://segmentfault.com/a/1190000021488264 



