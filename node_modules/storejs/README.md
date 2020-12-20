JavaScript localStorage
---

[![Build Status](https://travis-ci.org/jaywcjlove/store.js.svg?branch=master)](https://travis-ci.org/jaywcjlove/store.js) [![Coverage Status](https://coveralls.io/repos/github/jaywcjlove/store.js/badge.svg?branch=master)](https://coveralls.io/github/jaywcjlove/store.js?branch=master) [![GitHub issues](https://img.shields.io/github/issues/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/issues) [![GitHub forks](https://img.shields.io/github/forks/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/network) [![GitHub stars](https://img.shields.io/github/stars/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/stargazers) [![](https://img.shields.io/github/release/jaywcjlove/store.js.svg)](https://github.com/jaywcjlove/store.js/releases) [![store.js](https://jaywcjlove.github.io/sb/lang/chinese.svg)](./README-zh.md)

A simple, lightweight JavaScript API for handling browser [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
, it is easy to pick up and use, has a reasonable footprint 2.08kb(gzipped: 0.97kb), and has no dependencies. It should not interfere with any JavaScript libraries or frameworks.

**Features:**

🚀 Has no dependencies  
🌱 Works in all browsers  
🔥 Heavily tested  
📦 Supports AMD/CommonJS  
💥 [store.min.js](dist/store.min.js) 2.08kb(gzipped: 0.97kb)  

## Usage

Installed via [npm](https://www.npmjs.com/package/storejs). You will need `Node.js` installed on your system.

```bash
$ npm install storejs --save
```

```js
import store from 'storejs';

store('test', 'tank', 1)
```

Or manually download and link `storejs` in your HTML, It can also be downloaded via [UNPKG](https://unpkg.com/storejs/dist/) or [jsDelivr CDN](https://www.jsdelivr.com/package/npm/storejs):

```html
<script src="https://unpkg.com/cookiejs/dist/cookie.min.js"></script>
<script type="text/javascript">
  store('test', 'tank');
</script>
```

## Basic Usage

```js
store(key, data);                 // Single storage string data
store({key: data, key2: data2});  // Bulk storage of multiple string data
store(key);             // Get `key` string data
store("?key");          // Determine if the `key` exists
store();                // Get all key/data
//store(false);🔫       // (Deprecated) because it is easy to empty the storage because of a null value or an error
//store(key, false); 🔫  // (Deprecated)

store.set(key, data[, overwrite]);    // === store(key, data);
store.set({key: data, key2: data2})   // === store({key: data, key2: data});
store.get(key[, alt]);                // === store(key);
store.get("?key");                    // Determine if the `key` exists
store.get("key1", "key2", "key3");    // Get `key1`,`key2`,`key3` data
store.remove(key);                    // ===store(key,false)
store.clear();                      // Clean all key/data
store.keys();                       // Returns an array of all the keys
store.forEach(callback);            // Loop traversal, return false to end traversal
store.search(string);               // Search method

store.has(key); //⇒ Determine if there is a return true/false

//⇒ Provide callback method to process data
store('test', (key,val) => {
  console.log(val) // Processing the data obtained through the test here
  return [3,4,5] // Return data and set store
})

store(['key', 'key2'], (key) => {
  // Get data processing of multiple keys, return and save;
  console.log('key:', key)
  return '逐个更改数据'
})
```

## Storage Event

Responding to storage changes with the [StorageEvent](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Responding_to_storage_changes_with_the_StorageEvent)

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

| Property | Type | Description |
| ----- | ---- | ---- |
|key|String|The named key that was added, removed, or moddified|
|oldValue|Any|The previous value(now overwritten), or null if a new item was added|
|newValue|Any|The new value, or null if an item was added|
|url/uri|String|The page that called the method that triggered this change|

## Chained Call

```js
store.set('ad', 234).get('ad')
```

## TODO

- [ ] `store.get([key,key2])` Get method, return json
- [ ] `store([key,key2])` Get method, return json
- [ ] `onStorage` Method test cases, and implementation

### License

Licensed under the MIT License.
