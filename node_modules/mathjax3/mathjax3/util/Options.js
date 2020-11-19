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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var OBJECT = {}.constructor;
function isObject(obj) {
    return typeof obj === 'object' && obj !== null && obj.constructor === OBJECT;
}
exports.APPEND = Symbol('Append to option array');
function makeArray(x) {
    return Array.isArray(x) ? x : [x];
}
exports.makeArray = makeArray;
function keys(def) {
    if (!def) {
        return [];
    }
    return Object.keys(def).concat(Object.getOwnPropertySymbols(def));
}
exports.keys = keys;
function copy(def) {
    var props = {};
    try {
        for (var _a = __values(keys(def)), _b = _a.next(); !_b.done; _b = _a.next()) {
            var key = _b.value;
            var prop = Object.getOwnPropertyDescriptor(def, key);
            var value = prop.value;
            if (Array.isArray(value)) {
                prop.value = insert([], value, false);
            }
            else if (isObject(value)) {
                prop.value = copy(value);
            }
            if (prop.enumerable) {
                props[key] = prop;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Object.defineProperties({}, props);
    var e_1, _c;
}
exports.copy = copy;
function insert(dst, src, warn) {
    if (warn === void 0) { warn = true; }
    try {
        for (var _a = __values(keys(src)), _b = _a.next(); !_b.done; _b = _a.next()) {
            var key = _b.value;
            if (warn && dst[key] === undefined) {
                if (typeof key === 'symbol') {
                    key = key.toString();
                }
                throw new Error('Invalid option "' + key + '" (no default value).');
            }
            var sval = src[key], dval = dst[key];
            if (isObject(sval) && dval !== null &&
                (typeof dval === 'object' || typeof dval === 'function')) {
                if (Array.isArray(dval) && Array.isArray(sval[exports.APPEND]) && keys(sval).length === 1) {
                    dval.push.apply(dval, __spread(sval[exports.APPEND]));
                }
                else {
                    insert(dval, sval, warn);
                }
            }
            else if (Array.isArray(sval)) {
                dst[key] = [];
                insert(dst[key], sval, false);
            }
            else if (isObject(sval)) {
                dst[key] = copy(sval);
            }
            else {
                dst[key] = sval;
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
    return dst;
    var e_2, _c;
}
exports.insert = insert;
function defaultOptions(options) {
    var defs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        defs[_i - 1] = arguments[_i];
    }
    defs.forEach(function (def) { return insert(options, def, false); });
    return options;
}
exports.defaultOptions = defaultOptions;
function userOptions(options) {
    var defs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        defs[_i - 1] = arguments[_i];
    }
    defs.forEach(function (def) { return insert(options, def, true); });
    return options;
}
exports.userOptions = userOptions;
function selectOptions(options) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    var subset = {};
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            if (options.hasOwnProperty(key)) {
                subset[key] = options[key];
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return subset;
    var e_3, _a;
}
exports.selectOptions = selectOptions;
function selectOptionsFromKeys(options, object) {
    return selectOptions.apply(void 0, __spread([options], Object.keys(object)));
}
exports.selectOptionsFromKeys = selectOptionsFromKeys;
function separateOptions(options) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    var results = [];
    try {
        for (var objects_1 = __values(objects), objects_1_1 = objects_1.next(); !objects_1_1.done; objects_1_1 = objects_1.next()) {
            var object = objects_1_1.value;
            var exists = {}, missing = {};
            try {
                for (var _a = __values(Object.keys(options || {})), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    (object[key] === undefined ? missing : exists)[key] = options[key];
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_4) throw e_4.error; }
            }
            results.push(exists);
            options = missing;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (objects_1_1 && !objects_1_1.done && (_d = objects_1.return)) _d.call(objects_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    results.unshift(options);
    return results;
    var e_5, _d, e_4, _c;
}
exports.separateOptions = separateOptions;
//# sourceMappingURL=Options.js.map