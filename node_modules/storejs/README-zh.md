# store.js 

[![Build Status](https://travis-ci.org/jaywcjlove/store.js.svg?branch=master)](https://travis-ci.org/jaywcjlove/store.js) [![Coverage Status](https://coveralls.io/repos/github/jaywcjlove/store.js/badge.svg?branch=master)](https://coveralls.io/github/jaywcjlove/store.js?branch=master) [![GitHub issues](https://img.shields.io/github/issues/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/issues) [![GitHub forks](https://img.shields.io/github/forks/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/network) [![GitHub stars](https://img.shields.io/github/stars/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/stargazers) [![](https://img.shields.io/github/release/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/releases) [![store.js](https://jaywcjlove.github.io/sb/lang/english.svg)](./README-zh.md)


本地存储localStorage的封装，提供简单的API，没有依赖，压缩只有 2.48kb(gzipped: 1.07kb)。

## 安装

```bash
# npm 安装
npm install storejs
```

生成压缩文件和开发模式

```bash
$ npm run build    # 生成带UMD的js原文件 以及 min.js
$ npm run watch    # 监听文件改变自动压缩生成js
```

## 测试

```bash
$ npm test
$ npm run ssr

# 浏览器打开 http://localhost:1987/test/test.html
```

# 使用


或者在您的HTML中手动下载并引入 **store.min.js**，你也可以通过 [UNPKG](https://unpkg.com/storejs/dist/) 进行下载：

```html
<script src="https://unpkg.com/storejs/dist/store.min.js"></script>
<script type="text/javascript">
  store("test","tank");
</script>
```

or 

```js 
var store = require('storejs');
store("test","tank");
```

⚠️  原生方法调用获取数据，因为为了存储 JSON 对象，所以会先通过 JSON.stringify() 方法，将对象转换为一个 JSON 字符串

```js
JSON.parse(localStorage.getItem('test'))
```

## 本地存储APIs

```js
store(key, data);                 //单个存储字符串数据
store({key: data, key2: data2});  //批量存储多个字符串数据
store(key);               //获取key的字符串数据
store("?key");            //判断key是否存在
store();                  //获取所有key/data
//store(false);🔫         //（弃用）因为传入空值 或者报错很容易清空库
//store(key,false); 🔫    //（弃用）删除key包括key的字符串数据, 当val 为 0的时候无法存储...

store.set(key, data[, overwrite]);    // === store(key, data);
store.set({key: data, key2: data2})   // === store({key: data, key2: data});
store.get(key[, alt]);                // === store(key);
store.get("?key");                    // 判断key是否存在
store.get("key1", "key2", "key3");    // 获取 `key1`,`key2`,`key3` 数据
store.remove(key);                  //===store(key,false)
store.clear();                      //清空所有key/data
store.keys();                       //返回所有key的数组
store.forEach(callback);            //循环遍历，返回false结束遍历
store.search(string);                //搜索方法

store.has(key);         //⇒判断是否存在返回true/false          

//⇒ 提供callback方法处理数据
store("test",function(key,val){
  console.log(val)//这里处理 通过test获取的数据
  return [3,4,5]//返回数据并存储
})

store(["key","key2"],function(key){
  //获取多个key的数据处理，return 并保存；
  console.log("key:",key)
  return "逐个更改数据"
})

// 即创建/更新/删除数据项时，触发该事件
store.onStorage(function(key,val){
  console.log('onStorage:',key,val)
})
```


### set
单个存储或删除字符串数据  
`store.set(key, data[, overwrite]); `  
效果相同`store(key, data);`  

```js
store.set("wcj","1");   //⇒  1
store.set("wcj");       //⇒  删除wcj及字符串数据
```

### <del>setAll</del> 🔫

> 使用 `store.set({key: data, key2: data2})` 代替

批量存储多个字符串数据  
`store.setAll(data[, overwrite]) `  
效果相同`store({key: data, key2: data});`  

```js
store.setAll({
    "wcj1":123,
    "wcj2":345
}); // 存储两条字符串数据

store.setAll(["w1","w2","w3"]);
// 存储三条字符串数据 
//  0⇒ "w1"
//  1⇒ "w2"
//  2⇒ "w3"
```

### get
获取key的字符串数据  
`store.get(key[, alt])`  
效果相同`store(key)`  

```js
store.get("wcj1"); // 获取wcj1的字符串数据
store("wcj1"); // 功能同上
```

### <del>getAll</del> 🔫

> `store()` 和 `store.get()` 代替

获取所有 key/data `store.getAll()`  
与效果相同`store()`  

```js
store.getAll(); //⇒JSON
store(); //功能同上
```

### clear

清空所有 `key/data` `store.clear()`  

⚠️ 弃用 ~~store(false)~~ 因为传入空值 或者报错很容易清空库


```js
store.clear(); //
```

### keys

返回所有 `key` 的数组 `store.keys()`  

```js
store.keys(); //⇒["w1", "w2", "w3"]
```

### search

搜索方法 `store.search(string)`

```js 
store.search('key') //⇒ {"key":"keytest","key1":{"a":1},"key2":"逐个更改数据"}
```

### has

判断是否存在返回 `true/false` `store.has(key)`  

```js
store.has("w1"); //⇒true
```

### remove

删除key包括key的字符串数据 `store.remove(key)`

```js
store.remove("w1"); //删除w1 返回 w1的value

store("w1", false); //这样也是 删除w1
```

### forEach

循环遍历，返回 `false` 结束遍历

```js
store.forEach(function(k,d){
  console.log(k, d);
  if (k== 3) return false;
})
```

### 定时清除

(做个笔记，未来将定时清除封装起来，有思路)

```js
if (+new Date() > +new Date(2014, 11, 30)) {
  localStorage.removeItem("c");    //清除c的值
  // or localStorage.clear();
}
```


## storage事件

不知为毛不支持参看下面 [onStorage](#onstorage) =><s>HTML5的本地存储，还提供了一个storage事件，可以对键值对的改变进行监听，使用方法如下：</s>

```js
if(window.addEventListener){
  window.addEventListener("storage",handle_storage,false);
}else if(window.attachEvent){
  window.attachEvent("onstorage",handle_storage);
}
function handle_storage(e){
  if(!e){e=window.event;}
  //showStorage();
}
```

对于事件变量e，是一个StorageEvent对象，提供了一些实用的属性，可以很好的观察键值对的变化，如下表：

| Property | Type | Description |
| ----- | ---- | ---- |
|key|String|The named key that was added, removed, or moddified|
|oldValue|Any|The previous value(now overwritten), or null if a new item was added|
|newValue|Any|The new value, or null if an item was added|
|url/uri|String|The page that called the method that triggered this change|

## 链式书写

```js
store.set('ad',234).get('ad')

store.onStorage(function(type){
 console.log('type:',type)
}).set('wcj',12).clear().get('wcj')
//⇒ type: set
//⇒ type: clear
//⇒ type: set
```

## TODO

- [ ] `store.get([key,key2])` 获取方法，返回json
- [ ] `store([key,key2])` 获取方法，返回json
- [ ] `onStorage` 方法测试用例，以及实现

## 兼容

来源：[sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

| 特性 | Chrome | Firefox (Gecko) | Internet Explorer |  Opera  | Safari (WebKit)| iPhone(IOS) | Android | Opera Mobile | Window Phone |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
|localStorage|4+|3.5+| 8+ |10.50+|4+| 3.2+ | 2.1+ | 11+ | 8+ |
|sessionStorage|5+|2+| 8+ |10.50+|4+| 3.2+ | 2.1+ | 11+ | 8+ |


## 本地存储大小

`JSON.stringify(localStorage).length` 当前占用多大容量  

[检测localstore容量上限](https://arty.name/localstorage.html)  
