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
var NodeUtil_js_1 = require("./NodeUtil.js");
var Stack = (function () {
    function Stack(_factory, _env, inner) {
        this._factory = _factory;
        this._env = _env;
        this.global = {};
        this.stack = [];
        this.global = { isInner: inner };
        this.stack = [this._factory.create('start', this.global)];
        if (_env) {
            this.stack[0].env = _env;
        }
        this.env = this.stack[0].env;
    }
    Object.defineProperty(Stack.prototype, "env", {
        get: function () {
            return this._env;
        },
        set: function (env) {
            this._env = env;
        },
        enumerable: true,
        configurable: true
    });
    Stack.prototype.Push = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var node = args_1_1.value;
                if (!node) {
                    continue;
                }
                var item = NodeUtil_js_1.default.isNode(node) ?
                    this._factory.create('mml', node) : node;
                item.global = this.global;
                var _a = __read(this.stack.length ? this.Top().checkItem(item) : [null, true], 2), top_1 = _a[0], success = _a[1];
                if (!success) {
                    continue;
                }
                if (top_1) {
                    this.Pop();
                    this.Push.apply(this, __spread(top_1));
                    continue;
                }
                this.stack.push(item);
                if (item.env) {
                    Object.assign(item.env, this.env);
                    this.env = item.env;
                }
                else {
                    item.env = this.env;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (args_1_1 && !args_1_1.done && (_b = args_1.return)) _b.call(args_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _b;
    };
    Stack.prototype.Pop = function () {
        var item = this.stack.pop();
        if (!item.isOpen) {
            delete item.env;
        }
        this.env = (this.stack.length ? this.Top().env : {});
        return item;
    };
    Stack.prototype.Top = function (n) {
        if (n === void 0) { n = 1; }
        return this.stack.length < n ? null : this.stack[this.stack.length - n];
    };
    Stack.prototype.Prev = function (noPop) {
        var top = this.Top();
        return noPop ? top.First : top.Pop();
    };
    Stack.prototype.toString = function () {
        return 'stack[\n  ' + this.stack.join('\n  ') + '\n]';
    };
    return Stack;
}());
exports.default = Stack;
//# sourceMappingURL=Stack.js.map