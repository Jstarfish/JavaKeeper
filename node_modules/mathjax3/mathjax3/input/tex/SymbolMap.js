"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Symbol_js_1 = require("./Symbol.js");
var MapHandler_js_1 = require("./MapHandler.js");
var AbstractSymbolMap = (function () {
    function AbstractSymbolMap(_name, _parser) {
        this._name = _name;
        this._parser = _parser;
        MapHandler_js_1.MapHandler.register(this);
    }
    ;
    Object.defineProperty(AbstractSymbolMap.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    AbstractSymbolMap.prototype.parserFor = function (symbol) {
        return this.contains(symbol) ? this.parser : null;
    };
    AbstractSymbolMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        var parser = this.parserFor(symbol);
        var mapped = this.lookup(symbol);
        return (parser && mapped) ?
            parser(env, mapped) || true : null;
    };
    Object.defineProperty(AbstractSymbolMap.prototype, "parser", {
        get: function () {
            return this._parser;
        },
        set: function (parser) {
            this._parser = parser;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractSymbolMap;
}());
exports.AbstractSymbolMap = AbstractSymbolMap;
var RegExpMap = (function (_super) {
    __extends(RegExpMap, _super);
    function RegExpMap(name, parser, _regExp) {
        var _this = _super.call(this, name, parser) || this;
        _this._regExp = _regExp;
        return _this;
    }
    ;
    RegExpMap.prototype.contains = function (symbol) {
        return this._regExp.test(symbol);
    };
    RegExpMap.prototype.lookup = function (symbol) {
        return this.contains(symbol) ? symbol : null;
    };
    return RegExpMap;
}(AbstractSymbolMap));
exports.RegExpMap = RegExpMap;
var AbstractParseMap = (function (_super) {
    __extends(AbstractParseMap, _super);
    function AbstractParseMap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.map = new Map();
        return _this;
    }
    AbstractParseMap.prototype.lookup = function (symbol) {
        return this.map.get(symbol);
    };
    AbstractParseMap.prototype.contains = function (symbol) {
        return this.map.has(symbol);
    };
    AbstractParseMap.prototype.add = function (symbol, object) {
        this.map.set(symbol, object);
    };
    return AbstractParseMap;
}(AbstractSymbolMap));
exports.AbstractParseMap = AbstractParseMap;
var CharacterMap = (function (_super) {
    __extends(CharacterMap, _super);
    function CharacterMap(name, parser, json) {
        var _this = _super.call(this, name, parser) || this;
        try {
            for (var _a = __values(Object.keys(json)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                var value = json[key];
                var _c = __read((typeof (value) === 'string') ? [value, null] : value, 2), char = _c[0], attrs = _c[1];
                var character = new Symbol_js_1.Symbol(key, char, attrs);
                _this.add(key, character);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return _this;
        var e_1, _d;
    }
    ;
    return CharacterMap;
}(AbstractParseMap));
exports.CharacterMap = CharacterMap;
var DelimiterMap = (function (_super) {
    __extends(DelimiterMap, _super);
    function DelimiterMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DelimiterMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        return _super.prototype.parse.call(this, [env, '\\' + symbol]);
    };
    return DelimiterMap;
}(CharacterMap));
exports.DelimiterMap = DelimiterMap;
var MacroMap = (function (_super) {
    __extends(MacroMap, _super);
    function MacroMap(name, json, functionMap) {
        var _this = _super.call(this, name, null) || this;
        try {
            for (var _a = __values(Object.keys(json)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                var value = json[key];
                var _c = __read((typeof (value) === 'string') ? [value] : value), func = _c[0], attrs = _c.slice(1);
                var character = new Symbol_js_1.Macro(key, functionMap[func], attrs);
                _this.add(key, character);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return _this;
        var e_2, _d;
    }
    ;
    MacroMap.prototype.parserFor = function (symbol) {
        var macro = this.lookup(symbol);
        return macro ? macro.func : null;
    };
    MacroMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        var macro = this.lookup(symbol);
        var parser = this.parserFor(symbol);
        if (!macro || !parser) {
            return null;
        }
        return parser.apply(void 0, __spread([env, macro.symbol], macro.args)) || true;
    };
    return MacroMap;
}(AbstractParseMap));
exports.MacroMap = MacroMap;
var CommandMap = (function (_super) {
    __extends(CommandMap, _super);
    function CommandMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommandMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        var macro = this.lookup(symbol);
        var parser = this.parserFor(symbol);
        if (!macro || !parser) {
            return null;
        }
        var args = ['\\' + macro.symbol].concat(macro.args);
        if (!parser) {
            return null;
        }
        var saveCommand = env.currentCS;
        env.currentCS = '\\' + symbol;
        var result = parser.apply(void 0, __spread([env, '\\' + macro.symbol], macro.args));
        env.currentCS = saveCommand;
        return result || true;
    };
    return CommandMap;
}(MacroMap));
exports.CommandMap = CommandMap;
var EnvironmentMap = (function (_super) {
    __extends(EnvironmentMap, _super);
    function EnvironmentMap(name, parser, json, functionMap) {
        var _this = _super.call(this, name, json, functionMap) || this;
        _this.parser = parser;
        return _this;
    }
    ;
    EnvironmentMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        var macro = this.lookup(symbol);
        var envParser = this.parserFor(symbol);
        if (!macro || !envParser) {
            return null;
        }
        this.parser(env, macro.symbol, envParser, macro.args);
        return true;
    };
    return EnvironmentMap;
}(MacroMap));
exports.EnvironmentMap = EnvironmentMap;
//# sourceMappingURL=SymbolMap.js.map