module.exports = {
  theme: require.resolve('./theme/vuepress-theme-reco'),
  //theme: 'reco',
  base: "/",
  title: 'JavaKeeper',
  //description: 'Keep On Growing：Java Keeper',
  head: [
  	["link", { rel: "icon", href: `/icon.svg` }],
  	['meta', { name: 'keywords', content: 'JavaKeeper,Java,Java开发,算法,blog' }],
    ['script', {}, `
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?a949a9b30eb86ac0159e735ff8670c03";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
            // 引入谷歌,不需要可删除这段
            var hm1 = document.createElement("script");
            hm1.src = "https://www.googletagmanager.com/gtag/js?id=UA-169923503-1";
            var s1 = document.getElementsByTagName("script")[0]; 
            s1.parentNode.insertBefore(hm1, s1);
        })();
        // 谷歌加载,不需要可删除
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-169923503-1');
    `],
  ],
  themeConfig: {
  	author: '海星',
  	repo: 'Jstarfish/JavaKeeper',
    //logo: './public/img/logo.png',
    subSidebar: 'auto',//在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
    nav: [
      { text: 'Java', link: '/java/' , icon: 'icon-java'},
      { text: '数据结构与算法', link: '/data-structure-algorithms/', icon: 'icon-tree' },
      { text: '设计模式', link: '/design-pattern/', icon: 'icon-design' },
      { text: '数据管理', link: '/data-management/', icon: 'icon-ic_datastores'},
      { text: '开发框架', link: '/framework/', icon: 'icon-framework1' },
      { text: '分布式架构', link: '/distribution/', icon: 'icon-distributed' },
      { text: '网络编程', link: '/network/' , icon: 'icon-network'},
      { text: '直击面试', link: '/interview/', icon: 'icon-interview' },
    ],
    sidebar: {
        "/java/": genJavaSidebar(),
        "/data-structure-algorithms/": genDSASidebar(),
        "/design-pattern/": genDesignPatternSidebar(),
        "/data-management/": genDataManagementSidebar(),
        "/framework/": genFrameworkSidebar(),
        "/distribution/": genDistributionSidebar(),
        "/network/": genNetworkSidebar(),
        "/interview/": genInterviewSidebar(),
    },
    blogConfig: {
    //   category: {
    //     location: 2,     // 在导航栏菜单中所占的位置，默认2
    //     text: 'Category' // 默认文案 “分类”
    //   },
    //   tag: {
    //     location: 3,     // 在导航栏菜单中所占的位置，默认3
    //     text: 'Tag'      // 默认文案 “标签”
    //   }
    }
  },
  plugins: [
	  ['@vuepress-reco/vuepress-plugin-bulletin-popover', {
	    width: '260px', // 默认 260px
	    title: '消息提示',
	    body: [
	      {
	        type: 'title',
	        content: '<h5>🐳 欢迎关注〖JavaKeeper〗🐳 </h5>  <h5>🎉 500 + Java开发电子书免费获取 🎉</h5> <br>',
	        style: 'text-aligin: center;width: 100%;'
	      },
	      {
	        type: 'image',
	        src: '/qcode.png'
	      }
	    ]
	    //,
	    // footer: [
	    //   {
	    //     type: 'button',
	    //     text: '打赏',
	    //     link: '/donate'
	    //   }
	    // ]
	  }],
	  [
      'vuepress-plugin-mathjax',
      {
        target: 'svg',
        macros: {
          '*': '\\times',
        },
      },
    ],
    ['@vuepress/last-updated']
	]
}

function genJavaSidebar() {
  return [
   {
      title: "Java",
      collapsable: true,
      children: [
        "Java-8",
        "Java-Throwable",
        "Online-Error-Check",
      ]
    },
    {
      title: "JVM",
      collapsable: true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: ["JVM/JVM-Java","JVM/Class-Loading","JVM/Runtime-Data-Areas","JVM/GC","JVM/GC-实战",
      "JVM/Java-Object", "JVM/JVM参数配置",
      "JVM/OOM","JVM/Reference","JVM/JVM性能监控和故障处理工具"]
    },
    {
      title: "JUC",
      collapsable: true,
      children: [
        ["JUC/readJUC","开篇——聊聊并发编程"],
        "JUC/Java-Memory-Model",
        "JUC/volatile","JUC/synchronized","JUC/CAS",
        ['JUC/Concurrent-Container','Collection 大局观'],
        "JUC/AQS",
        "JUC/ThreadLocal",
        "JUC/CountDownLatch、CyclicBarrier、Semaphore",
        ['JUC/BlockingQueue','阻塞队列'],
        "JUC/Thread-Pool",
        "JUC/Locks",
        "JUC/多个线程顺序执行问题",
      ]
    },
    {
      title: "Other",
      collapsable: true,
      children: [
        "other/Git-Specification",
      ]
    }
  ];
}

function genDSASidebar() {
  return [
    {
      title: "数据结构",
      collapsable: true,
      //sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        ['data-structure/Array','数组'],
        ['data-structure/Linked-List','链表'],
        ['data-structure/Stack','栈'],
        ['data-structure/Queue','队列'],
        ['data-structure/Binary-Tree','二叉树'],
        ['data-structure/Skip-List','跳表']
      ]
    },
    {
      title: "算法",
      collapsable: true,
      children: [
        "complexity",
        ['algorithm/Sort', '排序'],
        ['algorithm/Binary-Search', '二分查找'],
      	['algorithm/Recursion', '递归'],
        ['algorithm/Backtracking', '回溯'],
        ['algorithm/DFS-BFS', 'DFS vs BFS'],
        ['algorithm/Double-Pointer', '双指针'],
      	['algorithm/Dynamic-Programming', '动态规划']
      ]
    },
    {
      title: "刷题",
      collapsable: true,
      children: [
      	['soultion/Binary-Tree-Solution', '二叉树'],
      	['soultion/Array-Solution', '数组'],
      	['soultion/String-Solution', '字符串'],
      	['soultion/LinkedList-Soultion', '链表'],
        ['soultion/DFS-Solution', 'DFS'],
      	['soultion/Math-Solution', '数学'],
        ['soultion/stock-problems', '股票问题'],
        ['soultion/剑指offer', '剑指offer']
      ]
    }
  ];
}

function genDesignPatternSidebar() {
  return [
    ['Design-Pattern-Overview', '设计模式前传'],
    {
      title: "创建型模式", 
      collapsable: true,
      sidebarDepth: 3, // 可选的, 默认值是 1
      children: [
        ['Singleton-Pattern', '单例模式'],
        ['Factory-Pattern', '工厂模式'],
        ['Prototype-Pattern', '原型模式'],
        ['Builder-Pattern', '建造者模式']
      ]
    },
    {
      title: "结构型模式", 
      collapsable: true,
      sidebarDepth: 3, // 可选的, 默认值是 1
      children: [
        ['Decorator-Pattern', '装饰模式'],
        ['Proxy-Pattern', '代理模式'],
        ['Adapter-Pattern', '适配器模式']
      ]
    },
    {
      title: "行为模式", 
      collapsable: true,
      sidebarDepth: 2, // 可选的, 默认值是 1
      children: [
        ['Chain-of-Responsibility-Pattern', '责任链模式'],
        ['Observer-Pattern', '观察者模式'],
        ['Template-Pattern', '模板方法模式'],
        ['Strategy-Pattern', '策略模式'],
        ['Facade-Pattern', '外观模式']
      ]
    },
    ['Pipeline-Pattern', '管道模式'],
    ['Spring-Design.md', 'Spring 中的设计模式']
  ];
}

function genDataManagementSidebar(){
  return [
    {
      title: "MySQL",
      collapsable: true,
      //sidebarDepth: 1,    // 可选的, 默认值是 1
      children: [
        ['MySQL/MySQL-Framework', 'MySQL 架构介绍'],
        ['MySQL/MySQL-Storage-Engines', 'MySQL 存储引擎'],
        ['MySQL/MySQL-Index', 'MySQL 索引'],
        ['MySQL/MySQL-Transaction', 'MySQL 事务'],
        ['MySQL/MySQL-Log', 'MySQL 日志'],
        ['MySQL/MySQL-Lock', 'MySQL 锁'],
        ['MySQL/MySQL-Select', 'MySQL 查询'],
        ['MySQL/MySQL-Optimization', 'MySQL 优化'],
        ['MySQL/Three-Normal-Forms', '数据库三范式']
      ]
    },
    {
      title: "Redis",
      collapsable: true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        ['Redis/ReadRedis', 'Redis 开篇'],
        ['Redis/Redis-Datatype', 'Redis 数据类型'],
        ['Redis/Redis-Persistence', 'Redis 持久化'],
        ['Redis/Redis-Conf', 'Redis 配置'],
        ['Redis/Redis-Transaction', 'Redis 事务'],
        ['Redis/Redis-Lock', 'Redis 分布式锁'],
        ['Redis/Redis-Master-Slave', 'Redis 主从'],
        ['Redis/Redis-Sentinel', 'Redis 哨兵'],
        ['Redis/Redis-Cluster', 'Redis 集群'],
        ['Redis/Redis-MQ', 'Redis 消息队列方案'],
      ]
    },
    {
      title: "Big-Data",
      collapsable: true,
      children: [
        ['Big-Data/Hello-BigData', '大数据'],
        ['Big-Data/Hive', 'Hive'],
        ['Big-Data/Bloom-Filter', '布隆过滤器'],
        ['Big-Data/Kylin', 'Kylin'],
        ['Big-Data/HBase', 'HBase'],
        ['Big-Data/Phoenix', 'Phoneix']
      ]
    }
    
  ];
}

function genFrameworkSidebar(){
  return [
    {
      title: "Spring",
      collapsable: true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        ['Spring/Spring-IOC', 'Spring IOC'],
        ['Spring/Spring-IOC-Source', 'Spring IOC 源码解毒'],
        ['Spring/Spring-Cycle-Dependency', 'Spring 循环依赖'],
        ['Spring/Spring-AOP', 'Spring AOP'],
        ['Spring/Spring-MVC', 'Spring MVC'],
      ]
    },
    {
      title: "Spring Boot",
      collapsable: true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        ['SpringBoot/Hello-SpringBoot', 'Hello-SpringBoot'],
        // ['SpringBoot/Spring Boot 最流行的 16 条实践解读', 'Spring Boot 最流行的 16 条实践解读'],
        // ['SpringBoot/@Scheduled', '@Scheduled'],
      ]
    },
    {
      title: "Quartz",
      collapsable: true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        ['Quartz/Quartz', 'Hello Quartz'],
        ['Quartz/Quartz-MySQL', 'jobstore 数据库表结构'],
        // ['SpringBoot/@Scheduled', '@Scheduled'],
      ]
    },
     {
      title: "Logging",
      collapsable: true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        ['logging/Java-Logging', 'Hello Logging']
      ]
    }
  ];
}

function genDistributionSidebar(){
  return [
    {
      title: "Kafka",
      collapsable: true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        ['message-queue/Kafka/Hello-Kafka', 'Hello-Kafka'],
        ['message-queue/Kafka/Kafka-Version', 'Kafka版本问题'],
        ['message-queue/Kafka/Kafka-Workflow','Kafka-Workflow'],
        ['message-queue/Kafka/Kafka-Producer','Kafka-Producer'],
        ['message-queue/Kafka/Kafka-Consumer','Kafka-Consumer'],
        ['message-queue/Kafka/Kafka高效读写数据的原因','Kafka高效读写数据的原因']
      ]
    },
    {
      title: " Zookeeper",
      collapsable: true,
      children: [
        ['ZooKeeper/Consistency-Protocol','分布式一致性协议'],
        ['ZooKeeper/Hello-Zookeeper','Hello Zookeeper'],
        ['ZooKeeper/Zookeeper-Use','Zookeeper 实战'],
      ]
    },    
    {
      title: "RPC",
      collapsable: true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        ['rpc/Hello-Protocol-Buffers', 'Hello ProtocolBuffers'],
        ['rpc/Hello-RPC.md','Hello RPC'],
        ['rpc/Hello-gRPC','Hello gRPC'],
      ]
    },
  ];
}

function genNetworkSidebar(){
  return [
    ['RMI', 'RMI远程调用'],
  ];
}

function genInterviewSidebar(){
  return [
    ['Java-Basics-FAQ', 'Java基础部分'],
    ['Java-Collections-FAQ', 'Java集合部分'],
    ['JUC-FAQ', 'Java 多线程部分'],
    ['JVM-FAQ', 'JVM 部分'],
    ['MySQL-FAQ', 'MySQL 部分'],
    ['Redis-FAQ', 'Redis 部分'],
    ['Network-FAQ', '计算机网络部分'],
    ['Kafka-FAQ', 'Kafka 部分'],
    ['ZooKeeper-FAQ', 'Zookeeper 部分'],
    ['RPC-FAQ', 'RPC 部分'],
    ['MyBatis-FAQ', 'MyBatis 部分'],
    ['Spring-FAQ', 'Spring 部分'],
    ['Design-Pattern-FAQ', '设计模式部分'],
    ['Elasticsearch-FAQ', 'Elasticsearch 部分'],
  ];
}