'use strict';

var AV = require('./index');

var _require = require('leancloud-realtime/core'),
    Realtime = _require.Realtime;

var _require2 = require('leancloud-realtime-plugin-live-query'),
    LiveQueryPlugin = _require2.LiveQueryPlugin;

Realtime.__preRegisteredPlugins = [LiveQueryPlugin];
AV._sharedConfig.liveQueryRealtime = Realtime;

module.exports = AV;