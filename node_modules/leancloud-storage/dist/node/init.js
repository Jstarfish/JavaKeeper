'use strict';

var AV = require('./av');
var AppRouter = require('./app-router');

var _require = require('./utils'),
    isNullOrUndefined = _require.isNullOrUndefined;

var _require2 = require('underscore'),
    extend = _require2.extend,
    isObject = _require2.isObject;

var fillServerURLs = function fillServerURLs(url) {
  return {
    push: url,
    stats: url,
    engine: url,
    api: url,
    rtm: url
  };
};

function getDefaultServerURLs(appId) {
  var domain = void 0;
  var id = appId.slice(0, 8).toLowerCase();
  switch (appId.slice(-9)) {
    case '-9Nh9j0Va':
      // TAB
      domain = 'lncldapi.com';
      break;
    case '-MdYXbMMI':
      // US
      domain = 'lncldglobal.com';
      break;
    default:
      domain = 'lncld.net';
  }
  return {
    push: 'https://' + id + '.push.' + domain,
    stats: 'https://' + id + '.stats.' + domain,
    engine: 'https://' + id + '.engine.' + domain,
    api: 'https://' + id + '.api.' + domain,
    rtm: 'https://' + id + '.rtm.' + domain
  };
}

var _disableAppRouter = false;

/**
 * URLs for services
 * @typedef {Object} ServerURLs
 * @property {String} [api] serverURL for API service
 * @property {String} [engine] serverURL for engine service
 * @property {String} [stats] serverURL for stats service
 * @property {String} [push] serverURL for push service
 * @property {String} [rtm] serverURL for LiveQuery service
 */

/**
 * Call this method first to set up your authentication tokens for AV.
 * You can get your app keys from the LeanCloud dashboard on http://leancloud.cn .
 * @function AV.init
 * @param {Object} options
 * @param {String} options.appId application id
 * @param {String} options.appKey application key
 * @param {String} [options.masterKey] application master key
 * @param {Boolean} [options.production]
 * @param {String|ServerURLs} [options.serverURLs] URLs for services. if a string was given, it will be applied for all services.
 * @param {Boolean} [options.disableCurrentUser]
 */
AV.init = function init(options) {
  if (!isObject(options)) {
    return AV.init({
      appId: options,
      appKey: arguments.length <= 1 ? undefined : arguments[1],
      masterKey: arguments.length <= 2 ? undefined : arguments[2]
    });
  }
  var appId = options.appId,
      appKey = options.appKey,
      masterKey = options.masterKey,
      hookKey = options.hookKey,
      serverURLs = options.serverURLs,
      disableCurrentUser = options.disableCurrentUser,
      production = options.production,
      realtime = options.realtime;

  if (AV.applicationId) throw new Error('SDK is already initialized.');
  if (!appId) throw new TypeError('appId must be a string');
  if (!appKey) throw new TypeError('appKey must be a string');
  if (process.env.CLIENT_PLATFORM && masterKey) console.warn('MasterKey is not supposed to be used in browser.');
  AV._config.applicationId = appId;
  AV._config.applicationKey = appKey;
  AV._config.masterKey = masterKey;
  if (!process.env.CLIENT_PLATFORM) AV._config.hookKey = hookKey || process.env.LEANCLOUD_APP_HOOK_KEY;
  if (typeof production !== 'undefined') AV._config.production = production;
  if (typeof disableCurrentUser !== 'undefined') AV._config.disableCurrentUser = disableCurrentUser;
  AV._appRouter = new AppRouter(AV);
  var disableAppRouter = _disableAppRouter || typeof serverURLs !== 'undefined';
  AV._setServerURLs(extend({}, getDefaultServerURLs(appId), AV._config.serverURLs, typeof serverURLs === 'string' ? fillServerURLs(serverURLs) : serverURLs), disableAppRouter);
  if (realtime) {
    AV._config.realtime = realtime;
  } else if (AV._sharedConfig.liveQueryRealtime) {
    var _AV$_config$serverURL = AV._config.serverURLs,
        api = _AV$_config$serverURL.api,
        rtm = _AV$_config$serverURL.rtm;

    AV._config.realtime = new AV._sharedConfig.liveQueryRealtime({
      appId: appId,
      appKey: appKey,
      server: {
        api: api,
        RTMRouter: rtm
      }
    });
  }
};

// If we're running in node.js, allow using the master key.
if (!process.env.CLIENT_PLATFORM) {
  AV.Cloud = AV.Cloud || {};
  /**
   * Switches the LeanCloud SDK to using the Master key.  The Master key grants
   * priveleged access to the data in LeanCloud and can be used to bypass ACLs and
   * other restrictions that are applied to the client SDKs.
   * <p><strong><em>Available in Cloud Code and Node.js only.</em></strong>
   * </p>
   */
  AV.Cloud.useMasterKey = function () {
    AV._config.useMasterKey = true;
  };
}

/**
 * Call this method to set production environment variable.
 * @function AV.setProduction
 * @param {Boolean} production True is production environment,and
 *  it's true by default.
 */
AV.setProduction = function (production) {
  if (!isNullOrUndefined(production)) {
    AV._config.production = production ? 1 : 0;
  } else {
    // change to default value
    AV._config.production = null;
  }
};

AV._setServerURLs = function (urls) {
  var disableAppRouter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (typeof urls !== 'string') {
    extend(AV._config.serverURLs, urls);
  } else {
    AV._config.serverURLs = fillServerURLs(urls);
  }
  if (disableAppRouter) {
    if (AV._appRouter) {
      AV._appRouter.disable();
    } else {
      _disableAppRouter = true;
    }
  }
};
/**
 * Set server URLs for services.
 * @function AV.setServerURLs
 * @since 3.0.0
 * @param {String|ServerURLs} urls URLs for services. if a string was given, it will be applied for all services.
 * You can also set them when initializing SDK with `options.serverURLs`
 */
AV.setServerURLs = function (urls) {
  return AV._setServerURLs(urls);
};

AV.keepErrorRawMessage = function (value) {
  AV._sharedConfig.keepErrorRawMessage = value;
};

/**
 * Set a deadline for requests to complete.
 * Note that file upload requests are not affected.
 * @function AV.setRequestTimeout
 * @since 3.6.0
 * @param {number} ms
 */
AV.setRequestTimeout = function (ms) {
  AV._config.requestTimeout = ms;
};

// backword compatible
AV.initialize = AV.init;

var defineConfig = function defineConfig(property) {
  return Object.defineProperty(AV, property, {
    get: function get() {
      return AV._config[property];
    },
    set: function set(value) {
      AV._config[property] = value;
    }
  });
};

['applicationId', 'applicationKey', 'masterKey', 'hookKey'].forEach(defineConfig);