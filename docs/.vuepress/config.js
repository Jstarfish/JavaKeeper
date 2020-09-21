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
      { text: '数据存储与缓存', link: '/data-store' },
      { text: '直击面试', link: '/interview/' },
    ],
    sidebar: {
        "/java/": genJavaSidebar(),
        "/data-structure-algorithms/": genDSASidebar(),
        "/data-store/": genDataStoreSidebar(),
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
	        content: '<h4>欢迎加入Java 技术有限委员会 🎉</h4> <h4>500 + 电子书，30+ 视频教学和源码无套路获取</h4>',
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
      children: ["JVM/Runtime-Data-Areas", "JVM/OOM"]
    },
    {
      title: "JUC",
      collapsable: false,
      children: [
        "JUC/Java-Memory-Model",
        "JUC/CountDownLatch、CyclicBarrier、Semaphore"
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
    ['Kafka-FAQ', 'Kafka 面试'],
    ['JVM-FAQ', 'JVM 面试'],
     
    
  ];
}