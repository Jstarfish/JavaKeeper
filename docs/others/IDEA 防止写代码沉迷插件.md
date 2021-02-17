## 前言

当初年少懵懂，那年夏天填志愿选专业，父母听其他长辈说选择计算机专业好。从那以后，我的身上就有了计院深深的烙印。从寝室到机房，从机房到图书馆，C、C++、Java、只要是想写点自己感兴趣的东西，一坐就是几个小时，但那时年轻，起身，收拾，一路小跑会女神，轻轻松松。现在工作了，毫无意外的做着开发的工作，长时间久坐。写代码一忙起来就忘了起来活动一下，也不怎么喝水。经常等到忙完了就感觉腰和腿不舒服。直到今年的体检报告一下来，才幡然醒：:没有一个好身体,就不能好好打工，让老板过上他自己想要的生活了.

试过用手机提醒自己，但是没用。小米手环的久坐提醒功能也开着，有时候写代码正入神的，时间到了也就点一下就关了，还是没什么作用。所以我想究竟是我太赖了，还是用Idea写代码容易沉迷，总之不可能是改需求有意思。所以打算为自己开发一款小小的Idea防沉迷插件，我叫她【StopCoding】。她应该可以设置每隔多少分钟，就弹出一个提醒对话框，一旦对话框弹出来，idea 的代码编辑框就自动失去了焦点，什么都不能操作，到这还不算完，关键是这个对话框得关不了，并且还显示着休息倒计时，还有即使我修改了系统时间，这个倒计时也依然有效，除非我打开任务管理器，关闭 Idea 的进程，然后再重新启动 Idea。但是想一下想，idea 都都关了，还是休息一下吧。

下面就介绍一下她简单的使用教程和开发教程

## 安装使用教程

### 安装

1. 在idea中直接搜索安装StopCoding插件(官方已经审核通过)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7c4529d9ad74e52b25c9e3ff8bde987~tplv-k3u1fbpfcp-watermark.image) 

2. 内网开发的小伙伴 可以下载之后进行本地安装 ：https://github.com/jogeen/StopCoding/releases/tag/20210104-V1.0

- 本地安装：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3a879d9342042f1889177c5417119d1~tplv-k3u1fbpfcp-watermark.image)

### 使用

- Step1. 然后在菜单栏中tools->StopCoding

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d444991c76a64791af61f506b1c4ae16~tplv-k3u1fbpfcp-watermark.image)

- Step2. 设置适合你的参数然后保存。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e55c783876e40728480b34aa3f326cf~tplv-k3u1fbpfcp-watermark.image)

- Step3. 然后快乐的Coding吧，再不用担心自己会沉迷了。工作时间结束,她会弹出下框进行提醒,当然,这个框是关不掉的.只有你休息了足够的时间它才会自动关闭.

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38cef698f7084ec69fb9d7a862119aec~tplv-k3u1fbpfcp-watermark.image)

## 开发教程

这个插件非常的简约,界面操作也很简单。所使用的技术基本上都是java的基础编程知识。所以小伙伴感兴趣的话，一起看看吧。

### 技术范围

- 插件工程的基本结构
- Swing 主要负责两个对话框的交互
- Timer 作为最基本的定时器选择

### 插件工程结构

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6fe38bd434f44659072012a56d238fd~tplv-k3u1fbpfcp-watermark.image)

- plugin.xml

这是插件工程的核心配置文件，里面每一项的解释，可以参考第一篇的介绍[核心配置文件说明](https://juejin.cn/post/6844904127990857742)。

- data包
  - SettingData,配置信息对应model
  - DataCenter,作为运行时的数据中心，都是些静态的全局变量
- service
  - TimerService 这个定时计算的核心代码
- task
  - RestTask 休息时的定时任务
  - WorkTask 工作时的定时任务
- ui
  - SettingDialog 设置信息的对话框
  - TipsDialog	休息时提醒的对话框
- StopCodingSettingAction 启动入口的action

### Swing

其实在idea中开发Swing项目的界面非常简单。因为idea提供了一系列可视化的操作，以及控件布局的拖拽。接下来就简单的介绍一下对话框的创建过程和添加事件。

#### 创建对话框

- Step1

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63ee7f02dd04402c81c7a228f96ca49f~tplv-k3u1fbpfcp-watermark.image)

- Step2

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18ce507706784d348edbb459f8e8f46e~tplv-k3u1fbpfcp-watermark.image)

- Step3

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43d91050e4f145b48319e88f075af49d~tplv-k3u1fbpfcp-watermark.image)

- 注：这里并没有详细的展开Swing的讲解，因为界面的这个东西，需要大家多去自己实践。这里就不做手册式的赘述了。

#### 添加事件

其实，刚才创建的这个对话框里的两个按钮都是默认已经创建好了点击事件的。

```java
public class TestDialog extends JDialog {
    private JPanel contentPane;
    private JButton buttonOK;
    private JButton buttonCancel;

    public TestDialog() {
        setContentPane(contentPane);
        setModal(true);
        getRootPane().setDefaultButton(buttonOK);

        buttonOK.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                onOK();
            }
        }); //这是给OK按钮绑定点击事件的监听器

        buttonCancel.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                onCancel();
            }
        });//这是给取消按钮绑定点击事件的监听器
    //其他代码
    }
```

当然我们也可以其它任何控件去创建不同的事件监听器。这里可以通过界面操作创建很多种监听器，只要你需要，就可以使用。

- step1

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2799b4f1cb724270a8ee561d5dc8040b~tplv-k3u1fbpfcp-watermark.image)

- step2

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ef64de972ef41dfaa95d325fe9ceccb~tplv-k3u1fbpfcp-watermark.image)

### Timer定时器

在这个插件里面，需要用到定时的功能，同时去计算公国和休息的时间。所以使用JDK自带的Timer，非常的方便。下面我Timer的常用的api放在这里，就清楚它的使用了。

- 构造方法

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a074e309ff846fb94b09fc2ae94efca~tplv-k3u1fbpfcp-watermark.image)

- 成员防范

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a576b3deae2b423990c37fb3be1982f6~tplv-k3u1fbpfcp-watermark.image)

- 主要是schedule去添加一个定时任务，和使用cancel去取消任务停止定时器。

### 最后

相信有了这些基本介绍，感谢兴趣的小伙伴想去看看源码和尝试自己写一个小插件就没什么大问题了。不说了，我得休息了。希望这个插件能帮到作为程序员得你，和这篇文章对你有一点点启发。当然麻烦小伙伴点个赞，鼓励一下打工人。