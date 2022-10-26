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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var MapHandler;
(function (MapHandler) {
    var maps = new Map();
    MapHandler.register = function (map) {
        maps.set(map.name, map);
    };
    MapHandler.getMap = function (name) {
        return maps.get(name);
    };
})(MapHandler = exports.MapHandler || (exports.MapHandler = {}));
exports.ExtensionMaps = {
    NEW_MACRO: 'new-Macro',
    NEW_DELIMITER: 'new-Delimiter',
    NEW_COMMAND: 'new-Command',
    NEW_ENVIRONMENT: 'new-Environment'
};
var SubHandler = (function () {
    function SubHandler(maps, _fallback) {
        this._fallback = _fallback;
        this._configuration = [];
        try {
            for (var maps_1 = __values(maps), maps_1_1 = maps_1.next(); !maps_1_1.done; maps_1_1 = maps_1.next()) {
                var name_1 = maps_1_1.value;
                this.add(name_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (maps_1_1 && !maps_1_1.done && (_a = maps_1.return)) _a.call(maps_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    }
    SubHandler.prototype.add = function (name) {
        var map = MapHandler.getMap(name);
        if (!map) {
            this.warn('Configuration ' + name + ' not found! Omitted.');
            return;
        }
        this._configuration.push(map);
    };
    SubHandler.prototype.parse = function (input) {
        try {
            for (var _a = __values(this._configuration), _b = _a.next(); !_b.done; _b = _a.next()) {
                var map = _b.value;
                var result = map.parse(input);
                if (result) {
                    return result;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var _d = __read(input, 2), env = _d[0], symbol = _d[1];
        this._fallback(env, symbol);
        var e_2, _c;
    };
    SubHandler.prototype.lookup = function (symbol) {
        var map = this.applicable(symbol);
        return map ? map.lookup(symbol) : null;
    };
    SubHandler.prototype.contains = function (symbol) {
        return this.applicable(symbol) ? true : false;
    };
    SubHandler.prototype.toString = function () {
        return this._configuration
            .map(function (x) { return x.name; })
            .join(', ');
    };
    SubHandler.prototype.applicable = function (symbol) {
        try {
            for (var _a = __values(this._configuration), _b = _a.next(); !_b.done; _b = _a.next()) {
                var map = _b.value;
                if (map.contains(symbol)) {
                    return map;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return null;
        var e_3, _c;
    };
    SubHandler.prototype.retrieve = function (name) {
        return this._configuration.find(function (x) { return x.name === name; });
    };
    SubHandler.prototype.warn = function (message) {
        console.log('TexParser Warning: ' + message);
    };
    return SubHandler;
}());
exports.SubHandler = SubHandler;
var SubHandlers = (function () {
    function SubHandlers(config) {
        this.map = new Map();
        try {
            for (var _a = __values(Object.keys(config.handler)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                var name_2 = key;
                var subHandler = new SubHandler(config.handler[name_2] || [], config.fallback[name_2]);
                this.set(name_2, subHandler);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var e_4, _c;
    }
    SubHandlers.prototype.set = function (name, subHandler) {
        this.map.set(name, subHandler);
    };
    SubHandlers.prototype.get = function (name) {
        return this.map.get(name);
    };
    SubHandlers.prototype.retrieve = function (name) {
        try {
            for (var _a = __values(this.map.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var handler = _b.value;
                var map = handler.retrieve(name);
                if (map) {
                    return map;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return null;
        var e_5, _c;
    };
    SubHandlers.prototype.keys = function () {
        return this.map.keys();
    };
    return SubHandlers;
}());
exports.SubHandlers = SubHandlers;
//# sourceMappingURL=MapHandler.js.map