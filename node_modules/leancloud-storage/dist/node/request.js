'use strict';

var _ = require('underscore');
var md5 = require('md5');

var _require = require('underscore'),
    extend = _require.extend;

var Promise = require('./promise');
var AV = require('./av');

var _require2 = require('./utils'),
    getSessionToken = _require2.getSessionToken,
    ajax = _require2.ajax;

// 计算 X-LC-Sign 的签名方法


var sign = function sign(key, isMasterKey) {
  var now = new Date().getTime();
  var signature = md5(now + key);
  if (isMasterKey) {
    return signature + ',' + now + ',master';
  }
  return signature + ',' + now;
};

var setAppKey = function setAppKey(headers, signKey) {
  if (signKey) {
    headers['X-LC-Sign'] = sign(AV.applicationKey);
  } else {
    headers['X-LC-Key'] = AV.applicationKey;
  }
};

var setHeaders = function setHeaders() {
  var authOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var signKey = arguments[1];

  var headers = {
    'X-LC-Id': AV.applicationId,
    'Content-Type': 'application/json;charset=UTF-8'
  };
  var useMasterKey = false;
  if (typeof authOptions.useMasterKey === 'boolean') {
    useMasterKey = authOptions.useMasterKey;
  } else if (typeof AV._config.useMasterKey === 'boolean') {
    useMasterKey = AV._config.useMasterKey;
  }
  if (useMasterKey) {
    if (AV.masterKey) {
      if (signKey) {
        headers['X-LC-Sign'] = sign(AV.masterKey, true);
      } else {
        headers['X-LC-Key'] = AV.masterKey + ',master';
      }
    } else {
      console.warn('masterKey is not set, fall back to use appKey');
      setAppKey(headers, signKey);
    }
  } else {
    setAppKey(headers, signKey);
  }
  if (AV.hookKey) {
    headers['X-LC-Hook-Key'] = AV.hookKey;
  }
  if (AV._config.production !== null) {
    headers['X-LC-Prod'] = String(AV._config.production);
  }
  headers[!process.env.CLIENT_PLATFORM ? 'User-Agent' : 'X-LC-UA'] = AV._sharedConfig.userAgent;

  return Promise.resolve().then(function () {
    // Pass the session token
    var sessionToken = getSessionToken(authOptions);
    if (sessionToken) {
      headers['X-LC-Session'] = sessionToken;
    } else if (!AV._config.disableCurrentUser) {
      return AV.User.currentAsync().then(function (currentUser) {
        if (currentUser && currentUser._sessionToken) {
          headers['X-LC-Session'] = currentUser._sessionToken;
        }
        return headers;
      });
    }
    return headers;
  });
};

var createApiUrl = function createApiUrl(_ref) {
  var _ref$service = _ref.service,
      service = _ref$service === undefined ? 'api' : _ref$service,
      _ref$version = _ref.version,
      version = _ref$version === undefined ? '1.1' : _ref$version,
      path = _ref.path;

  var apiURL = AV._config.serverURLs[service];

  if (!apiURL) throw new Error('undefined server URL for ' + service);

  if (apiURL.charAt(apiURL.length - 1) !== '/') {
    apiURL += '/';
  }
  apiURL += version;
  if (path) {
    apiURL += path;
  }

  return apiURL;
};

/**
 * Low level REST API client. Call REST endpoints with authorization headers.
 * @function AV.request
 * @since 3.0.0
 * @param {Object} options
 * @param {String} options.method HTTP method
 * @param {String} options.path endpoint path, e.g. `/classes/Test/55759577e4b029ae6015ac20`
 * @param {Object} [options.query] query string dict
 * @param {Object} [options.data] HTTP body
 * @param {AuthOptions} [options.authOptions]
 * @param {String} [options.service = 'api']
 * @param {String} [options.version = '1.1']
 */
var request = function request(_ref2) {
  var service = _ref2.service,
      version = _ref2.version,
      method = _ref2.method,
      path = _ref2.path,
      query = _ref2.query,
      data = _ref2.data,
      authOptions = _ref2.authOptions,
      _ref2$signKey = _ref2.signKey,
      signKey = _ref2$signKey === undefined ? true : _ref2$signKey;

  if (!(AV.applicationId && (AV.applicationKey || AV.masterKey))) {
    throw new Error('Not initialized');
  }
  AV._appRouter.refresh();
  var timeout = AV._config.requestTimeout;

  var url = createApiUrl({ service: service, path: path, version: version });
  return setHeaders(authOptions, signKey).then(function (headers) {
    return ajax({ method: method, url: url, query: query, data: data, headers: headers, timeout: timeout }).catch(function (error) {
      var errorJSON = {
        code: error.code || -1,
        error: error.message || error.responseText
      };
      if (error.response && error.response.code) {
        errorJSON = error.response;
      } else if (error.responseText) {
        try {
          errorJSON = JSON.parse(error.responseText);
        } catch (e) {
          // If we fail to parse the error text, that's okay.
        }
      }
      errorJSON.rawMessage = errorJSON.rawMessage || errorJSON.error;
      if (!AV._sharedConfig.keepErrorRawMessage) {
        errorJSON.error += ' [' + (error.statusCode || 'N/A') + ' ' + method + ' ' + url + ']';
      }
      // Transform the error into an instance of AVError by trying to parse
      // the error string as JSON.
      var err = new Error(errorJSON.error);
      delete errorJSON.error;
      throw _.extend(err, errorJSON);
    });
  });
};

// lagecy request
var _request = function _request(route, className, objectId, method, data, authOptions, query) {
  var path = '';
  if (route) path += '/' + route;
  if (className) path += '/' + className;
  if (objectId) path += '/' + objectId;
  // for migeration
  if (data && data._fetchWhenSave) throw new Error('_fetchWhenSave should be in the query');
  if (data && data._where) throw new Error('_where should be in the query');
  if (method && method.toLowerCase() === 'get') {
    query = extend({}, query, data);
    data = null;
  }
  return request({
    method: method,
    path: path,
    query: query,
    data: data,
    authOptions: authOptions
  });
};

AV.request = request;

module.exports = {
  _request: _request,
  request: request
};