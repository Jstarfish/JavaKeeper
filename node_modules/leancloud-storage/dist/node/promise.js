'use strict';

var Promise = require('es6-promise').Promise;

Promise._continueWhile = function (predicate, asyncFunction) {
  if (predicate()) {
    return asyncFunction().then(function () {
      return Promise._continueWhile(predicate, asyncFunction);
    });
  }
  return Promise.resolve();
};

module.exports = Promise;