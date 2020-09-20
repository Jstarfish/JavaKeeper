'use strict';

var _ = require('underscore');
var Promise = require('../promise');

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

var AsyncStorage = require('react-native').AsyncStorage;
_(apiNames).each(function (apiName) {
  Storage[apiName + 'Async'] = function () {
    return Promise.resolve(AsyncStorage[apiName].apply(AsyncStorage, arguments));
  };
});
Storage.async = true;

module.exports = Storage;