'use strict';

var Storage = require('localstorage-memory');
Storage.async = false;

module.exports = Storage;