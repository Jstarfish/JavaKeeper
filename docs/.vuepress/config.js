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
      { text: 'Java', link: '/java/' },
      { text: '数据结构与算法', link: '/data-structure-algorithms/' },
      { text: '设计模式', link: '/design-pattern/' },
      { text: '数据存储与缓存', link: '/data-store/' },
      { text: '直击面试', link: '/interview/' },
    ],
    sidebar: {
        "/java/": genJavaSidebar(),
        "/data-structure-algorithms/": genDSASidebar(),
        "/design-pattern/": genDesignPatternSidebar(),
        //"/data-store/": genDataStoreSidebar(),
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
	        content: '<h5>🐳欢迎关注〖JavaKeeper〗🐳 </h5>  <h5>🎉500 + Java开发电子书免费获取🎉</h5> <br>',
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
	  }]
	]
}

function genJavaSidebar() {
  return [
    {
      title: "JVM",
      collapsable: false,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: ["JVM/JVM-Java","JVM/Class-Loading","JVM/Runtime-Data-Areas","JVM/Java-Object","JVM/OOM","JVM/Reference"]
    },
    {
      title: "JUC",
      collapsable: false,
      children: [
        "JUC/Java-Memory-Model",
        "JUC/volatile","JUC/synchronized","JUC/CAS",
        ['JUC/Concurrent-Container','Collection 大局观'],
        "JUC/AQS",
        'JUC/Reentrantlock', 
        "JUC/ThreadLocal",
        "JUC/CountDownLatch、CyclicBarrier、Semaphore",
        ['JUC/BlockingQueue','阻塞队列'],
        "JUC/Thread-Pool",
        "JUC/Locks",
      ]
    }
  ];
}

function genDSASidebar() {
  return [
    {
      title: "数据结构",
      collapsable: false,
      sidebarDepth: 1,    // 可选的, 默认值是 1
      children: ["","Array", "Stack"]
    },
    {
      title: "算法",
      collapsable: false,
      children: [
      	['Recursion', '递归'],
      	['Dynamic-Programming', '动态规划']
      ]
    }
  ];
}

function genDesignPatternSidebar() {
  return [
    ['Design-Pattern-Overview', '设计模式前传'],
    ['Singleton-Pattern', '单例模式'],
    ['Factory-Pattern', '工厂模式'],
    ['Prototype-Pattern', '原型模式'],
    ['Decorator-Pattern', '装饰模式'],
    ['Proxy-Pattern', '代理模式'],
    ['Adapter-Pattern', '适配器模式'],
    ['Chain-of-Responsibility-Pattern', '责任链模式'],
    ['Observer-Pattern', '观察者模式'],
    ['Facade-Pattern', '外观模式']
  ];
}

function genDataStoreSidebar(){
  return [
    {
      title: "数据结构",
      collapsable: false,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: ["hello-dataStructure.md","Array", "Stack"]
    },
    {
      title: "算法",
      collapsable: false,
      children: [
        "JUC/Java-Memory-Model",
        "JUC/CountDownLatch、CyclicBarrier、Semaphore"
      ]
    }
  ];
}



function genInterviewSidebar(){
  return [
    ['Collections-FAQ', 'Java集合面试'],
    ['JUC-FAQ', 'Java 多线程面试'],
    ['JVM-FAQ', 'JVM 面试'],
    ['MySQL-FAQ', 'MySQL 面试'],
    ['Redis-FAQ', 'Redis 面试'],
    ['Network-FAQ', '计算机网络面试'],
    ['Kafka-FAQ', 'Kafka 面试'],
    ['ZooKeeper-FAQ', 'Zookeeper 面试'],
    ['MyBatis-FAQ', 'MyBatis 面试'],
    ['Spring-FAQ', 'Spring 面试'],
    ['Design-Pattern-FAQ', '设计模式面试'],
    ['Tomcat-FAQ', 'Tomcat 面试'],
  ];
}