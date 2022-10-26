var jsonp = require('../');
var querystring = require('querystring');
var test = require('tape');

// See http://doc.jsfiddle.net/use/echo.html
var ENDPOINT = 'http://jsfiddle.net/echo/jsonp/';

test('basic jsonp', function (t) {
  t.plan(1);
  var obj = {
    beep: 'boop',
    yo: 'dawg'
  };
  var q = querystring.encode(obj);
  jsonp(ENDPOINT + '?' + q, function (err, data) {
    if (err) throw err;
    t.deepEqual(data, obj);
  });
});

test('timeout', function (t) {
  t.plan(1);
  var obj = {
    delay: 5 // time in seconds after which data should be returned
  };
  var q = querystring.encode(obj);
  jsonp(ENDPOINT + '?' + q, { timeout: 3000 }, function (err, data) {
    t.ok(err instanceof Error);
  });
});

test('named callback', function (t) {
  t.plan(1);
  var obj = {
    beep: 'boop',
    yo: 'dawg'
  };
  var q = querystring.encode(obj);
  jsonp(ENDPOINT + '?' + q, { name: 'namedCb' }, function (err, data) {
    if (err) throw err;
    t.deepEqual(data, obj);
  });
});
