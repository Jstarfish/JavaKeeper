> maven package和maven install 有什么区别？
>
> 你常用的maven命令有哪些？
>
> \<dependencyManagement> 是干什么的？
>
>  还有用过其它构建工具吗? 和maven有啥区别？

![](https://i03piccdn.sogoucdn.com/90a66482fb523d81)

这几个问题都可以脱口而出，你应该是有点 maven 能耐，写代码去吧，不用看了

> 点赞+收藏 就学会系列，文章收录在 GitHub [JavaEgg](https://github.com/Jstarfish/JavaEgg) ，N线互联网开发必备技能兵器谱



## 1.Maven是啥：

Maven是Apache软件基金会唯一维护的一款**自动化构建工具**，专注于服务Java平台的**项目构建**和**依赖管理**。

Maven是基于项目对象模型（POM），可以通过一小段描述信息来管理项目的构建、报告和文档的软件项目管理工具。



## 2.Maven可以干啥：

- 添加第三方jar包
- jar包之间的依赖关系： Maven 可以替我们自动的将当前 jar 包所依赖的其他所有 jar 包全部导入进来
- 获取第三方jar包： Maven 提供了一个完全统一规范的 jar 包管理体系，只需要在项目中以坐标的方式依赖一个 jar 包，Maven 就会自动从中央仓库进行下载到本地仓库
- 将项目拆分成多个工程模块
- 构建项目（打包，编译等）



## 3.构建项目的几个主要环节：   

- 清理（clean）：删除以前的编译结果，为重新编译做好准备
- 编译（compile）：将Java 源程序编译为字节码文件
- 测试（test）：针对项目中的关键点进行测试，确保项目在迭代开发过程中关键点的正确性
- 报告（）：在每一次测试后以标准的格式记录和展示测试结果
- 打包（package）：将一个包含诸多文件的工程封装为一个压缩文件用于安装或部署。Java 工程对应 jar 包，Web工程对应 war 包。 
- 安装（install）：在 Maven 环境下特指将打包的结果——jar 包或 war 包安装到本地仓库中。
- 部署（deploy）：将打包的结果部署到远程仓库或将 war 包部署到服务器上运行。



## 4.Maven常用命令

- **mvn -version/-v** —— 显示版本信息
- **mvn clean** —— 清空生成的文件
- mvn compile  ——  编译 
- mvn test  ——  编译并测试 
- mvn package  ——  生成target目录，编译、测试代码，生成测试报告，生成jar/war文件 
- mvn site  ——  生成项目相关信息的网站 
- mvn clean compile  —— 表示先运行清理之后运行编译，会将代码编译到target文件夹中 
- mvn clean package  —— 运行清理和打包 
- mvn clean install ——  运行清理和安装，会将打好的包安装到本地仓库中，以便其他的项目可以调用
- mvn clean deploy  —— 运行清理和发布 



## 5.Maven核心概念

Maven 能够实现自动化构建是和它的内部原理分不开的，这里我们从 Maven 的九个核心概念入手， 看看 Maven 是如何实现自动化构建的 

- POM 
- 约定的目录结构
- 坐标
- 依赖管理
- 仓库管理 
- 生命周期 
- 插件和目标 
- 继承
- 聚合

**Maven 的核心程序中仅仅定义了抽象的生命周期，而具体的操作则是由 Maven 的插件来完成的**。可是 Maven 的插件并不包含在 Maven 的核心程序中，在首次使用时需要联网下载。 下载得到的插件会被保存到本地仓库中。本地仓库默认的位置是：~\.m2\repository。 



### 5.1. Maven约定的工程目录：

![maven-project.png](https://i.loli.net/2020/01/17/Eoz7YWU89g54jlv.png)



Java开发领域普遍认同的一个观点：**约定>配置>编码**（能用配置解决的问题就不编码，能基于约定的就不配置）



### 5.2. POM

**Project Object Model：项目对象模型**。将 Java 工程的相关信息封装为对象作为便于操作和管理的模型。 

Maven 工程的核心配置。



### 5.3. 坐标

- Maven 的坐标 使用如下三个向量在 Maven 的仓库中唯一的确定一个 Maven 工程。 
- - groupid：公司或组织的域名倒序+当前项目名称 
  - artifactId：当前项目的模块名称 
  - version：当前模块的版本 

```xml
  <groupId>net.lazyegg.maven</groupId>
  <artifactId>Hello</artifactId>
  <version>0.0.1-SNAPSHOT</version>
```

- 如何通过坐标到仓库中查找 jar 包？

  -  将 gav 三个向量连起来  

  ```
  net.lazyegg.maven+Hello+0.0.1-SNAPSHOT
  ```

  -  以连起来的字符串作为目录结构到仓库中查找 

      net/lazyegg/maven/Hello/0.0.1-SNAPSHOT/Hello-0.0.1-SNAPSHOT.jar

 ※ 注意：我们自己的 Maven 工程必须执行安装操作才会进入仓库。安装的命令是：**mvn install**



### 5.4. 依赖

Maven 中最关键的部分，我们使用 Maven 最主要的就是使用它的依赖管理功能。要理解和掌握 Maven 的依赖管理，我们只需要解决以下几个问题： 

##### ① 依赖的目的是什么 

当 A jar 包用到了 B jar 包中的某些类时，A 就对 B 产生了依赖，这是概念上的描述。那么如何在项目中以依赖的方式引入一个我们需要的 jar 包呢？ 答案非常简单，就是使用 `dependency` 标签指定被依赖 jar 包的坐标就可以了。

```xml
<dependency>
    <groupId>net.lazyegg.maven</groupId>
    <artifactId>Hello</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <scope>compile</scope>            
</dependency>
```

##### ② 依赖的范围 

有时依赖信息中除了目标 jar 包的坐标还有一个 scope 设置，这就是依赖的范围。依赖的范围有几个可选值，常用的有：compile、test、provided 三个，当然还有不常用的 runtime、system..

- **compile**：**默认范围**，编译测试运行都有效
- **provided**：在编译和测试时有效
- **runtime**：在测试和运行时有效
- **test：**只在测试时有效
- **system**：在编译和测试时有效，与本机系统关联，可移植性差

- 常用依赖范围有效性总结 

|          | compile | test | provided |
| -------- | ------- | ---- | -------- |
| 主程序   | √       | ×    | √        |
| 测试程序 | √       | √    | √        |
| 参与部署 | √       | ×    | ×        |

##### ③ 依赖的传递性 

A 依赖 B，B 依赖 C，A 能否使用 C 呢？那要看 B 依赖 C 的范围是不是 compile，如果是则可用，否则不可用。

##### ④ 依赖的排除 

如果我们在当前工程中引入了一个依赖是 A，而 A 又依赖了 B，那么 Maven 会自动将 A 依赖的 B 引入当 前工程，但是个别情况下 B 有可能是一个不稳定版，或对当前工程有不良影响。这时我们可以在引入 A 的时候将 B 排除。 

```xml
<dependency>
	<groupId>net.lazyegg.maven</groupId>
	<artifactId>Hello</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<scope>compile</scope>
	<exclusions>
		<exclusion>
			<groupId>commons-logging</groupId>
			<artifactId>commons-logging</artifactId>
			</exclusion>
	</exclusions>
</dependency>
```

##### ⑤ 统一管理所依赖 jar 包的版本，对同一个框架的一组 jar 包最好使用相同的版本。为了方便升级框架，可以将 jar 包的版本信息统一提取出来 

- 统一声明版本号 

```xml
<properties>
	<starfish.spring.version>4.1.1.RELEASE</starfish.spring.version>
	<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

- 引用前面声明的版本号    

```xml
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-core</artifactId>
	<version>${starfish.spring.version}</version>
	<scope>compile</scope>
</dependency>
```

##### ⑥ 依赖的原则：解决 jar 包冲突
- 路径最短者优先 
- 路径相同时先声明者优先

项目版本冲突时候的那种蛋疼的感觉，只有疼过的才知道，所以，我们来看看疼过的人是怎么解决的，推荐一个IDEA插件，Maven Helper，比自带的好用，一目了然

![maven-helper.png](https://i.loli.net/2020/01/17/Gab3wEMkTJdsjum.png)

### 5.5. 仓库

-  分类 
  -  本地仓库：为当前本机电脑上的所有 Maven 工程服务
  -  远程仓库 
    -  **私服**：架设在当前局域网环境下，为当前局域网范围内的所有 Maven 工程服务
    -  **中央仓库**：架设在 Internet 上，为全世界所有 Maven 工程服务
    -  **中央仓库的镜像**：架设在各个大洲，为中央仓库分担流量。减轻中央仓库的压力，同时更快的响应用户请求，比如阿里的镜像
-  仓库中的文件
  -  Maven 的插件
  -  我们自己开发的项目的模块
  -  第三方框架或工具的 jar 包
 ※ 不管是什么样的 jar 包，在仓库中都是按照坐标生成目录结构，所以可以通过统一的方式查询或依赖，查询地址：http://mvnrepository.com/ 



### 5.6. 生命周期

#### 5.6.1. 什么是 Maven 的生命周期？

 Maven 生命周期定义了各个构建环节的执行顺序，有了这个清单，Maven 就可以自动化的执行构建命令了。

 Maven 有三套相互独立的生命周期，分别是： 

- **Clean Lifecycle**       在进行真正的构建之前进行一些清理工作 
- **Default Lifecycle**   构建的核心部分，编译，测试，打包，安装，部署等等
- **Site Lifecycle**           生成项目报告，站点，发布站点

它们是相互独立的，你可以仅仅调用 clean 来清理工作目录，仅仅调用 site 来生成站点。当然你也可以直接运行 **mvn clean install site** 运行所有这三套生命周期。 每套生命周期都由一组阶段(Phase)组成，我们平时在命令行输入的命令总会对应于一个特定的阶段。比 如，运行 mvn clean，这个 clean 是 Clean 生命周期的一个阶段。有 Clean 生命周期，也有 clean 阶段。 

#### 5.6.2. Clean 生命周期 

Clean 生命周期一共包含了三个阶段： 

- pre-clean   执行一些需要在 clean 之前完成的工作 
- clean           移除所有上一次构建生成的文件
- post-clean  执行一些需要在 clean 之后立刻完成的工作 

#### 5.6.3. Site 生命周期 

- pre-site        执行一些需要在生成站点文档之前完成的工作 
- site  		     生成项目的站点文档 
- post-site      执行一些需要在生成站点文档之后完成的工作，并且为部署做准备 
- site-deploy   将生成的站点文档部署到特定的服务器上 这里经常用到的是 site 阶段和 site-deploy 阶段，用以生成和发布 Maven 站点，这可是 Maven 相当强大 的功能，Manager 比较喜欢，文档及统计数据自动生成，很好看。

#### 5.6.4. Default 生命周期

Default 生命周期是 Maven 生命周期中最重要的一个，绝大部分工作都发生在这个生命周期中（列出一些重要阶段）

- validate：验证工程是否正确，所有需要的资源是否可用。
- compile：编译项目的源代码。
- test：使用合适的单元测试框架来测试已编译的源代码。这些测试不需要已打包和布署。
- package：把已编译的代码打包成可发布的格式，比如 jar、war 等。
- integration-test：如有需要，将包处理和发布到一个能够进行集成测试的环境。
- verify：运行所有检查，验证包是否有效且达到质量标准。
- install：把包安装到maven本地仓库，可以被其他工程作为依赖来使用。
- deploy：在集成或者发布环境下执行，将最终版本的包拷贝到远程的repository，使得其他的开发者或者工程可以共享

#### 5.6.5. 生命周期与自动化构建 

**运行任何一个阶段的时候，它前面的所有阶段都会被运行**，例如我们运行 mvn install 的时候，代码会被编译，测试，打包。这就是 Maven 为什么能够自动执行构建过程的各个环节的原因。此外，Maven 的插件机制是完全依赖 Maven 的生命周期的，因此理解生命周期至关重要。



### 5.7. 插件和目标

- Maven 的核心仅仅定义了抽象的生命周期，具体的任务都是交由插件完成的
- 每个插件都能实现多个功能，每个功能就是一个插件目标
- Maven 的生命周期与插件目标相互绑定，以完成某个具体的构建任务
   例如：compile 就是插件 maven-compiler-plugin 的一个目标；pre-clean 是插件 maven-clean-plugin 的一个目标



### 5.8. 继承

- 为什么需要继承机制？ 
  由于非 compile 范围的依赖信息是不能在“依赖链”中传递的，所以有需要的工程只能单独配置
- 创建父工程 创建父工程和创建一般的 Java 工程操作一致，唯一需要注意的是：打包方式处要设置为 pom 
- 在子工程中引用父工程 ，从当前目录到父项目的 pom.xml 文件的相对路径 

```xml
 <parent>
 	<groupId>com.starfish.maven</groupId>
	<artifactId>Parent</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<!-- 以当前文件为基准的父工程pom.xml文件的相对路径 -->
	<relativePath>../Parent/pom.xml</relativePath>
</parent>
```

此时如果子工程的 groupId 和 version 如果和父工程重复则可以删除。 

- 在父工程中管理依赖 将 Parent 项目中的 dependencies 标签，用 **dependencyManagement** 标签括起来

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.9</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</dependencyManagement> 
```

在子项目中重新指定需要的依赖，删除范围和版本号

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
</dependency>
```



### 5.9. 聚合

- 为什么要使用聚合？ 

将多个工程拆分为模块后，需要手动逐个安装到仓库后依赖才能够生效。修改源码后也需要逐个手动进 行 clean 操作。而使用了聚合之后就可以批量进行 Maven 工程的安装、清理工作。 

 如何配置聚合？ 在总的聚合工程中使用 modules/module 标签组合，指定模块工程的相对路径即可 

```xml
<!-- 配置聚合 -->
<modules>
    <!-- 指定各个子工程的相对路径 -->
    <module>starfish-learn-grpc</module>
    <module>starfish-learn-kafka</module>
    <module>starfish-web-demo</module>
</modules>
```



![](https://i02piccdn.sogoucdn.com/15a7c08fbef53222)