'use strict';

// interface Storage {
//   readonly attribute boolean async;
//   string getItem(string key);
//   void setItem(string key, string value);
//   void removeItem(string key);
//   void clear();
//   Promise getItemAsync(string key);
//   Promise setItemAsync(string key, string value);
//   Promise removeItemAsync(string key);
//   Promise clearAsync();
// }
var Storage = {};
var apiNames = ['getItem', 'setItem', 'removeItem', 'clear'];

var localStorage = global.localStorage;

try {
  var testKey = '__storejs__';
  localStorage.setItem(testKey, testKey);
  if (localStorage.getItem(testKey) != testKey) {
    throw new Error();
  }
  localStorage.removeItem(testKey);
} catch (e) {
  localStorage = require('localstorage-memory');
}

// in browser, `localStorage.async = false` will excute `localStorage.setItem('async', false)`
apiNames.forEach(function (apiName) {
  Storage[apiName] = function () {
    return localStorage[apiName].apply(localStorage, arguments);
  };
});
Storage.async = false;

module.exports = Storage;