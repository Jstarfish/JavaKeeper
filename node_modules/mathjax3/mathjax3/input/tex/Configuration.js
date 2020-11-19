"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ParseMethods_js_1 = require("./ParseMethods.js");
var MapHandler_js_1 = require("./MapHandler.js");
var Options_js_1 = require("../../util/Options.js");
var sm = require("./SymbolMap.js");
var Configuration = (function () {
    function Configuration(name, handler, fallback, items, tags, options, nodes, preprocessors, postprocessors) {
        if (handler === void 0) { handler = {}; }
        if (fallback === void 0) { fallback = {}; }
        if (items === void 0) { items = {}; }
        if (tags === void 0) { tags = {}; }
        if (options === void 0) { options = {}; }
        if (nodes === void 0) { nodes = {}; }
        if (preprocessors === void 0) { preprocessors = []; }
        if (postprocessors === void 0) { postprocessors = []; }
        this.name = name;
        this.handler = handler;
        this.fallback = fallback;
        this.items = items;
        this.tags = tags;
        this.options = options;
        this.nodes = nodes;
        this.preprocessors = preprocessors;
        this.postprocessors = postprocessors;
        this.handler = Object.assign({ character: [], delimiter: [], macro: [], environment: [] }, handler);
        ConfigurationHandler.set(name, this);
    }
    Configuration.create = function (name, config) {
        if (config === void 0) { config = {}; }
        return new Configuration(name, config.handler || {}, config.fallback || {}, config.items || {}, config.tags || {}, config.options || {}, config.nodes || {}, config.preprocessors || [], config.postprocessors || []);
    };
    Configuration.empty = function () {
        return Configuration.create('empty');
    };
    ;
    Configuration.extension = function () {
        new sm.MacroMap(MapHandler_js_1.ExtensionMaps.NEW_MACRO, {}, {});
        new sm.DelimiterMap(MapHandler_js_1.ExtensionMaps.NEW_DELIMITER, ParseMethods_js_1.default.delimiter, {});
        new sm.CommandMap(MapHandler_js_1.ExtensionMaps.NEW_COMMAND, {}, {});
        new sm.EnvironmentMap(MapHandler_js_1.ExtensionMaps.NEW_ENVIRONMENT, ParseMethods_js_1.default.environment, {}, {});
        return Configuration.create('extension', { handler: { character: [],
                delimiter: [MapHandler_js_1.ExtensionMaps.NEW_DELIMITER],
                macro: [MapHandler_js_1.ExtensionMaps.NEW_DELIMITER,
                    MapHandler_js_1.ExtensionMaps.NEW_COMMAND,
                    MapHandler_js_1.ExtensionMaps.NEW_MACRO],
                environment: [MapHandler_js_1.ExtensionMaps.NEW_ENVIRONMENT]
            } });
    };
    ;
    Configuration.prototype.append = function (config) {
        var handlers = Object.keys(config.handler);
        try {
            for (var handlers_1 = __values(handlers), handlers_1_1 = handlers_1.next(); !handlers_1_1.done; handlers_1_1 = handlers_1.next()) {
                var key = handlers_1_1.value;
                try {
                    for (var _a = __values(config.handler[key]), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var map = _b.value;
                        this.handler[key].unshift(map);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (handlers_1_1 && !handlers_1_1.done && (_d = handlers_1.return)) _d.call(handlers_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        Object.assign(this.fallback, config.fallback);
        Object.assign(this.items, config.items);
        Object.assign(this.tags, config.tags);
        Options_js_1.defaultOptions(this.options, config.options);
        Object.assign(this.nodes, config.nodes);
        try {
            for (var _e = __values(config.preprocessors), _f = _e.next(); !_f.done; _f = _e.next()) {
                var pre = _f.value;
                this.preprocessors.push(pre);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_g = _e.return)) _g.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
        ;
        try {
            for (var _h = __values(config.postprocessors), _j = _h.next(); !_j.done; _j = _h.next()) {
                var post = _j.value;
                this.postprocessors.push(post);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_k = _h.return)) _k.call(_h);
            }
            finally { if (e_4) throw e_4.error; }
        }
        ;
        var e_2, _d, e_1, _c, e_3, _g, e_4, _k;
    };
    return Configuration;
}());
exports.Configuration = Configuration;
;
var ConfigurationHandler;
(function (ConfigurationHandler) {
    var maps = new Map();
    ConfigurationHandler.set = function (name, map) {
        maps.set(name, map);
    };
    ConfigurationHandler.get = function (name) {
        return maps.get(name);
    };
    ConfigurationHandler.keys = function () {
        return maps.keys();
    };
})(ConfigurationHandler = exports.ConfigurationHandler || (exports.ConfigurationHandler = {}));
//# sourceMappingURL=Configuration.js.map