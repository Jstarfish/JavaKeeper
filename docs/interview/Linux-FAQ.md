---
title: Linux 面试
date: 2025-04-08
tags: 
 - Linux
 - Interview
categories: Interview
---

![](https://img.starfish.ink/common/faq-banner.png)

> Linux 面试题通常会考察你对操作系统的理解，尤其是在系统管理、性能调优、文件系统、进程管理、网络配置、安全性等方面的知识。以下是一些常见的 Linux 面试题知识点和常见面试题的总结。

## 一、Linux 知识点

1. **文件系统**：Linux 文件系统采用树形结构，从根目录 `/` 开始，并向下分支到各个子目录，如 `/home`、`/etc`、`/usr` 等。
2. **权限管理**：文件权限、修改权限和所有者。
3. **网络管理**：查看网络配置和网络排障工具。
4. **系统安全**：如何查看系统日志、检查系统资源使用情况、配置静态 IP、创建和管理用户、查看和管理服务、设置定时任务、检测和修复文件系统错误、压缩和解压文件、查看和设置环境变量、查找文件和目录、监控系统性能等。



### **1. Linux 基础知识**

**操作系统概述**

- Linux 是一个开放源代码的操作系统内核，最初由 Linus Torvalds 开发。它采用了类 Unix 的设计理念。
- 常见的 Linux 发行版包括 Ubuntu、CentOS、Fedora、Debian、Arch Linux 等。
- **Linux 的文件结构和根目录结构**
  - `/`: 根目录，所有文件的起点。
  - `/home`: 用户目录。
  - `/etc`: 配置文件目录。
  - `/var`: 可变数据，如日志文件。
  - `/tmp`: 临时文件。
  - `/bin`: 二进制可执行文件。
  - `/lib`: 库文件。

**Linux 用户与权限**

- Linux 的用户与组管理
  - `useradd`、`usermod`、`userdel` 等命令用于管理用户。
  - `groupadd`、`groupdel`、`groupmod` 用于管理用户组。
  - **文件权限**: `rwx` 权限设置（读取、写入、执行），用 `chmod` 更改权限。
- 文件权限与属主
  - `ls -l` 命令显示文件详细信息，包括权限、属主和属组。
  - 文件权限：`r` (读), `w` (写), `x` (执行)。

**常用命令**

- 文件管理命令：`ls`, `cp`, `mv`, `rm`, `mkdir`, `rmdir`, `find`, `locate`, `which`。
- 系统管理命令：`top`, `ps`, `kill`, `htop`, `df`, `du`, `free`, `uptime`, `dmesg`。
- 文件权限与用户命令：`chmod`, `chown`, `chgrp`, `passwd`, `id`, `groups`。
- 查看和编辑文件命令：`cat`, `less`, `more`, `grep`, `vim`, `nano`。

### 2. 进程管理与调度

- 进程与线程的区别
  - 进程是操作系统进行资源分配和调度的基本单位。
  - 线程是进程中的执行单元，线程共享进程的资源。
- 常见进程命令
  - `ps`: 查看当前进程状态。
  - `top`: 动态查看进程和系统状态。
  - `kill`: 终止进程。
  - `nice`/`renice`: 设置进程的优先级。
  - `bg`, `fg`, `jobs`: 后台与前台进程管理。

- 常见的进程状态：
  - `R`: 运行中。
  - `S`: 睡眠状态。
  - `Z`: 僵尸状态。
  - `T`: 停止状态。

**进程调度**

- Linux 调度策略：
  - Linux 使用 CFS（Completely Fair Scheduler）作为默认调度器。
  - 调度器通过 `nice` 值来调整进程优先级。

### 3. 内存管理

**虚拟内存**

- 分页与分段：
  - Linux 采用分页机制来管理内存，不使用分段。
  - 页表用于虚拟地址到物理地址的映射。

**内存管理命令**

- `free`: 查看内存使用情况。
- `vmstat`: 查看虚拟内存统计。
- `top`: 查看进程和内存使用情况。

**交换空间**

- Swap 分区和 Swap 文件：
  - 当物理内存不足时，Linux 使用交换空间（Swap）来存储不常用的内存页面。
  - `swapon` / `swapoff`：启用/禁用交换空间。

### 4. 文件系统

**文件系统类型**

- 常见文件系统：
  - ext4: 常用的 Linux 文件系统。
  - xfs: 高性能文件系统。
  - btrfs: 新一代文件系统，支持快照和子卷。

**挂载与卸载**

- `mount`: 挂载文件系统。
- `umount`: 卸载文件系统。
- `fstab`: 配置文件，定义了系统启动时自动挂载的文件系统。

**文件系统命令**

- `df`: 查看磁盘空间使用情况。
- `du`: 查看磁盘使用的目录空间。
- `fsck`: 检查文件系统的完整性。

### 5. 网络管理

**网络配置**

- 配置文件：
  - `/etc/network/interfaces`（Debian/Ubuntu 系统）。
  - `/etc/sysconfig/network-scripts/`（CentOS/RHEL 系统）。

**常用网络命令**

- `ip addr`: 查看或配置 IP 地址。
- `ping`: 测试网络连通性。
- `netstat`: 查看网络连接和端口状态。
- `ss`: 查看套接字状态。
- `ifconfig`: 网络接口配置（已逐渐被 `ip` 命令取代）。
- `traceroute`: 路由跟踪。
- `curl`/`wget`: 下载文件。

**网络工具**

- **iptables**: 配置防火墙。
- **firewalld**: 动态防火墙管理工具。
- **nmap**: 网络扫描工具。

### 6. 系统性能调优

**系统监控工具**

- **top/htop**：实时查看系统资源使用情况。
- **iotop**：实时查看磁盘 IO。
- **atop**：高级的系统和进程监控工具。

**优化技巧**

- **内存管理**：
  - 使用 `vmstat`、`free` 查看内存使用情况。
  - 调整 `swappiness` 参数，优化交换空间的使用。
- **磁盘性能**：
  - 使用 `iostat` 监控磁盘性能。
  - 优化磁盘 I/O 性能。
- **网络优化**：
  - 使用 `sysctl` 配置内核参数（例如调节 `tcp_rmem`、`tcp_wmem`）。

### 7. 安全与用户管理

**SELinux 和 AppArmor**

- **SELinux**（Security-Enhanced Linux）和 **AppArmor** 是两种内核级别的安全模块，用于增强系统的安全性。

**防火墙**

- **iptables** 和 **firewalld** 用于配置防火墙规则，控制网络访问。

**用户与组管理**

- **sudo**：控制用户的特权。
- **passwd**：修改用户密码。
- **groupadd**、**useradd**：添加用户和用户组。



## 二、常见面试题

### Linux 中如何查看系统资源的使用情况？

- `top`, `free`, `df`, `du`, `ps`, `vmstat`, `iotop`。



### 如何查找一个文件并搜索文件内容？

- `find /path/to/search -name "filename"` 查找文件。
- `grep "pattern" file` 搜索文件内容。



### 如何查看进程使用的内存和 CPU？

- `top` 或 `ps aux`。

  

### 如何查看和设置文件权限？

- `ls -l` 查看文件权限。
- `chmod` 修改权限，`chown` 修改文件属主。



### 如何管理磁盘空间和挂载文件系统？

- 使用 `df`、`du`、`mount`、`umount` 等命令。



### 什么是僵尸进程？如何处理？

- 僵尸进程是已终止但父进程尚未收集其退出状态的进程。通过 `kill` 或者让父进程调用 `wait()` 来清理。



### **如何管理系统日志？**

- 系统日志存放在 `/var/log` 中，可以使用 `tail -f /var/log/syslog` 实时查看日志。



### **如何禁用 SELinux？**

- 修改 `/etc/selinux/config` 文件，设置 `SELINUX=disabled`。



### 怎么查找定位到第10行？

要查找并定位文件的第10行，你可以使用多种命令和方法，具体取决于你使用的工具和目的。以下是一些常见的方法：

1. 使用 `sed` 命令

   `sed` 是一个流编辑器，可以用于按行处理文件。

   ```bash
   sed -n '10p' filename
   ```

   - `-n`: 禁止默认输出。

   - `'10p'`: 表示输出文件中的第 10 行。

2. 使用 `head` 和 `tail` 命令

   你可以组合使用 `head` 和 `tail` 命令来显示特定行。

   ```bash
   head -n 10 filename | tail -n 1
   ```

   - `head -n 10`: 显示文件的前 10 行。

   - `tail -n 1`: 从 `head` 输出的内容中显示最后一行，即第 10 行。

3. 使用 `awk` 命令

   `awk` 是一个强大的文本处理工具，适用于基于模式的行操作。

   ```bash
   awk 'NR==10' filename
   ```

   - `NR==10`: `NR` 是 `awk` 内部的行号变量，这个命令会输出第 10 行。



### cpu使用率怎么看? 内存使用情况怎们看?

- `top` 是一个实时的系统监控工具，可以显示 CPU 使用率以及其他系统资源的使用情况。

- `vmstat` 提供了 CPU、内存、交换空间、I/O 等的统计信息。

  ```bash
  vmstat 1
  ```

   表示每隔 1 秒输出一次系统统计信息。输出会显示 CPU 使用情况，其中包括：

  - **r**: 就绪队列中的进程数。
  - **b**: 阻塞状态的进程数。
  - **us**: 用户空间使用的 CPU 时间（以百分比表示）。
  - **sy**: 内核空间使用的 CPU 时间（以百分比表示）。
  - **id**: CPU 空闲时间（以百分比表示）。

- `free` 是一个简单实用的命令，用于查看系统的内存使用情况。

  ```bash
  free -h
  ```

  - `-h` 参数使输出更加人性化，使用易读的单位（KB, MB, GB）。

- 使用 `ps` 命令查看特定进程的资源使用情况

  ```bash
  ps aux | grep <process_name>
  ```

  

### 绝对路径用什么符号表示？当前目录、上层目录用什么表示？主目录用什么表示? 切换目录用什么命令？  

- 绝对路径： 如/etc/init.d    
- 当前目录和上层目录：./ …/    
- 主目录： ~/    
- 切换目录：cd    

### 怎么查看当前进程？怎么执行退出？怎么查看当前路径？  

-  查看当前进程：ps    
- 执行退出：exit    
- 查看当前路径：pwd    



### 怎么清屏？怎么退出当前命令？怎么执行睡眠？怎么查看当前用户 id？查看指定帮助用什么命令？

- 清屏：clear    

- 退出当前命令：ctrl+c 彻底退出    

- 执行睡眠 ：ctrl+z挂起当前进程 fg恢复后台查看当前用户id：”id“：查看显示目前登陆账户的uid和gid及所属分组及用户名    

- 查看指定帮助：如man adduser这个很全 而且有例子；adduser–help这个告诉你一些常用参数；info adduesr；   

  

###  Ls命令执行什么功能？ 可以带哪些参数，有什么区别？  

 `ls`（**list**）是 Linux 中用来列出目录内容的基本命令，通常用于显示指定目录下的文件和文件夹。

- **`ls -a`**：列出所有文件，包括隐藏文件。
- **`ls -A`**：列出所有文件，但不包括 `.` 和 `..`（当前目录和上级目录的引用）。
- **`ls -l`**：以长格式列出信息，包括文件的权限、所有者、组、大小、最后修改时间和文件名。



### 你平时是怎么查看日志的？  

Linux查看日志的命令有多种：tail、cat、tac、head、echo等，只介绍几种常用的方法。    

- tail  最常用的一种查看方式          

   一般还会配合着grep搜索用，例如;

  ```
  tail -fn 1000 test.log | grep '关键字'
  ```

- head   跟tail是相反的head是看前多少行日志   

  ```
  head -n 10 test.log 查询日志文件中的头10行日志; head -n -10 test.log 查询日志文件除了最后10行的其他所有日志; 
  ```

- cat  

  cat 是由第一行到最后一行连续显示在屏幕上   一次显示整个文件：   

  ```
  $ cat filename
  ```

- more

   more命令是一个基于vi编辑器文本过滤器，它以全屏幕的方式按页显示文本文件的内容，支持vi中的关键字定位操作。more名单中内置了若干快捷键，常用的有H（获得帮助信息），Enter（向下翻滚一行），空格（向下滚动一屏），Q（退出命令）。more命令从前向后读取文件，因此在启动时就加载整个文件。

 

### 硬链接和软链接的区别?

硬链接与软链接是Linux系统中两种不同的文件链接机制。

1. **硬链接**
   - 本质：是同一文件的不同别名，共享相同的inode和数据块，相当于多个指针指向同一物理文件。
   - 特点：
     - 所有硬链接与原文件权限、大小、修改时间等属性完全一致。
     - 删除任一硬链接仅减少inode的引用计数，数据块保留至所有链接被删除。
   - 适用场景：
     - 数据备份与同步：通过硬链接节省空间，多个链接自动同步数据
     - 同一文件系统内多路径访问：如多个用户共享同一配置文件
2. **软链接（符号链接）**
   - 本质：是独立的文件，存储目标文件的路径信息，相当于快捷方式。
   - 特点：
     - 拥有独立的inode，文件内容为路径字符串。
     - 若目标文件被删除，软链接成为“悬空链接
   - 适用场景：
     - 跨文件系统或设备：例如链接网络存储中的文件
     - 快捷方式与路径管理：简化复杂路径访问，如版本切换（`/opt/app -> /opt/app-v2`。
     - **动态指向更新**：通过修改软链接路径切换目标



### inode是什么?

**inode**（Index Node，索引节点）是Linux/类Unix文件系统中用于存储文件或目录**元数据**（metadata）的核心数据结构。每个文件或目录在创建时都会被分配一个唯一的inode，其作用类似于文件的“身份证”，记录除文件名以外的所有属性信息，并通过指针关联文件的实际数据块。



### 建立软链接(快捷方式)，以及硬链接的命令   

- 软链接： ln -s slink source
- 硬链接： ln link source



### 如何编写一个备份日志的 Shell 脚本？

```shell
#!/bin/bash
# 备份 /var/log 目录下的 .log 文件到 /backup 目录，保留7天
BACKUP_DIR="/backup"
LOG_DIR="/var/log"
DATE=$(date +%Y%m%d)

find $LOG_DIR -name "*.log" -exec cp {} $BACKUP_DIR/logs_$DATE \;
find $BACKUP_DIR -name "logs_*" -mtime +7 -exec rm -f {} \;
```



### 如何快速定位 CPU 100% 问题？

1. 定位高负载进程

   ```bash
   top -c          # 按P排序CPU使用
   pidstat 1 5     # 细粒度进程统计
   ```

2. 分析线程状态

   ```bash
   top -H -p [PID]   # 查看线程
   printf "%x\n" [TID]  # 将线程ID转为16进制
   ```

3. 结合 jstack/gdb 查看堆栈

   ```bash
   jstack [PID] | grep -A20 [nid]  # Java进程
   gdb -p [PID] -ex "thread apply all bt" -batch  # 原生进程
   ```

   

### 如何优化内存使用？

```bash
# 清除缓存（生产环境慎用）
echo 3 > /proc/sys/vm/drop_caches

# 调整swappiness
sysctl vm.swappiness=10

# 透明大页禁用
echo never > /sys/kernel/mm/transparent_hugepage/enabled
```



### 磁盘空间满的快速处理

1. 定位大文件

   ```bash
   du -h --max-depth=1 / 2>/dev/null | sort -hr
   ```

2. 清理日志文件

   ```bash
   find /var/log -name "*.log" -size +100M -exec truncate -s 0 {} \;
   ```

3. 处理已删除但未释放空间的文件

   ```bash
   lsof | grep deleted   # 查找被删除但未释放的文件
   kill -9 [PID]         # 重启相关进程
   ```



### **情景模拟题**

**场景**：服务器响应缓慢，SSH 连接困难，请描述排查思路

**排查步骤**：

1. 快速登陆后使用 `w` 查看系统负载
2. `dmesg -T | tail` 检查硬件/驱动错误
3. `vmstat 1` 查看 CPU、内存、IO 综合情况
4. `iostat -x 1` 定位磁盘瓶颈
5. `sar -n DEV 1` 分析网络流量
6. `pidstat -d 1` 找到高 IO 进程
7. `strace -p [PID]` 跟踪进程系统调用
8. 结合业务日志分析异常请求
