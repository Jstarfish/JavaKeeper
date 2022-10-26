"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Symbol = (function () {
    function Symbol(_symbol, _char, _attributes) {
        this._symbol = _symbol;
        this._char = _char;
        this._attributes = _attributes;
    }
    Object.defineProperty(Symbol.prototype, "symbol", {
        get: function () {
            return this._symbol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Symbol.prototype, "char", {
        get: function () {
            return this._char;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Symbol.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        enumerable: true,
        configurable: true
    });
    return Symbol;
}());
exports.Symbol = Symbol;
;
var Macro = (function () {
    function Macro(_symbol, _func, _args) {
        if (_args === void 0) { _args = []; }
        this._symbol = _symbol;
        this._func = _func;
        this._args = _args;
    }
    Object.defineProperty(Macro.prototype, "symbol", {
        get: function () {
            return this._symbol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Macro.prototype, "func", {
        get: function () {
            return this._func;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Macro.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    return Macro;
}());
exports.Macro = Macro;
;
//# sourceMappingURL=Symbol.js.map