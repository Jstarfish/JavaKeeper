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
var Node_js_1 = require("./Node.js");
var AbstractVisitor = (function () {
    function AbstractVisitor(factory) {
        this.nodeHandlers = new Map();
        try {
            for (var _a = __values(factory.getKinds()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var kind = _b.value;
                var method = this[AbstractVisitor.methodName(kind)];
                if (method) {
                    this.nodeHandlers.set(kind, method);
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
        var e_1, _c;
    }
    AbstractVisitor.methodName = function (kind) {
        return 'visit' + (kind.charAt(0).toUpperCase() + kind.substr(1)).replace(/[^a-z0-9_]/ig, '_') + 'Node';
    };
    AbstractVisitor.prototype.visitTree = function (tree) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.visitNode.apply(this, __spread([tree], args));
    };
    AbstractVisitor.prototype.visitNode = function (node) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
        return handler.call.apply(handler, __spread([this, node], args));
    };
    AbstractVisitor.prototype.visitDefault = function (node) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (node instanceof Node_js_1.AbstractNode) {
            try {
                for (var _a = __values(node.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var child = _b.value;
                    this.visitNode.apply(this, __spread([child], args));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        var e_2, _c;
    };
    AbstractVisitor.prototype.setNodeHandler = function (kind, handler) {
        this.nodeHandlers.set(kind, handler);
    };
    AbstractVisitor.prototype.removeNodeHandler = function (kind) {
        this.nodeHandlers.delete(kind);
    };
    return AbstractVisitor;
}());
exports.AbstractVisitor = AbstractVisitor;
//# sourceMappingURL=Visitor.js.map