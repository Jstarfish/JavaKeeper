module.exports = {
  //theme: require.resolve('./theme/vuepress-theme-reco'),
  theme: 'reco',
  base: "/",
  title: 'JavaKeeper',
  author: '海星',
  //description: 'Keep On Growing：Java Keeper',
  themeConfig: {

    //logo: './public/img/logo.png',
    nav: [
      { text: 'Java', link: '/java/' },
      { text: '数据存储与缓存', link: '/data-store' },
      { text: '数据结构与算法', link: '/data-structure' },
      { text: '直击面试', link: '/interview' },
    ],
    sidebar: {
        "/java/": genJavaSidebar(),
        "/data-store/": genDataStructureSidebar()
      },
    blogConfig: {
      // category: {
      //   location: 2,     // 在导航栏菜单中所占的位置，默认2
      //   text: 'Category' // 默认文案 “分类”
      // },
      // tag: {
      //   location: 3,     // 在导航栏菜单中所占的位置，默认3
      //   text: 'Tag'      // 默认文案 “标签”
      // }
    }
  },
  plugins: [
  ['@vuepress-reco/vuepress-plugin-bulletin-popover', {
    width: '200px', // 默认 260px
    title: '消息提示',
    body: [
      {
        type: 'title',
        content: '欢迎加入Java 技术有限委员会 🎉</br>500 + 电子书，30+ 视频教学和源码无套路获取',
        style: 'text-aligin: center;width: 100%;'
      },
      {
        type: 'image',
        src: '/qrcode.jpg'
      }
    ]
    ,
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
      //collapsable: true,
      sidebarDepth: 1,    // 可选的, 默认值是 1
      children: ["JVM/Runtime-Data-Areas", "JVM/OOM"]
    },
    {
      title: "JUC",
      //collapsable: false,
      children: [
        "JUC/Java-Memory-Model",
        "JUC/CountDownLatch、CyclicBarrier、Semaphore"
      ]
    }
  ];
}

function genDataStructureSidebar() {
  return [
    {
      title: "配置",
      collapsable: false,
      children: [""]
    }
  ];
}