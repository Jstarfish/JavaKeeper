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
var AbstractFactory = (function () {
    function AbstractFactory(nodes) {
        if (nodes === void 0) { nodes = null; }
        this.defaultKind = 'unknown';
        this.nodeMap = new Map();
        this.node = {};
        if (nodes === null) {
            nodes = this.constructor.defaultNodes;
        }
        try {
            for (var _a = __values(Object.keys(nodes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var kind = _b.value;
                this.setNodeClass(kind, nodes[kind]);
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
    AbstractFactory.prototype.create = function (kind) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (this.node[kind] || this.node[this.defaultKind]).apply(void 0, __spread(args));
    };
    AbstractFactory.prototype.setNodeClass = function (kind, nodeClass) {
        this.nodeMap.set(kind, nodeClass);
        var THIS = this;
        var KIND = this.nodeMap.get(kind);
        this.node[kind] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new (KIND.bind.apply(KIND, __spread([void 0, THIS], args)))();
        };
    };
    AbstractFactory.prototype.getNodeClass = function (kind) {
        return this.nodeMap.get(kind);
    };
    AbstractFactory.prototype.deleteNodeClass = function (kind) {
        this.nodeMap.delete(kind);
        delete this.node[kind];
    };
    AbstractFactory.prototype.nodeIsKind = function (node, kind) {
        return (node instanceof this.getNodeClass(kind));
    };
    AbstractFactory.prototype.getKinds = function () {
        return Array.from(this.nodeMap.keys());
    };
    return AbstractFactory;
}());
AbstractFactory.defaultNodes = {};
exports.AbstractFactory = AbstractFactory;
//# sourceMappingURL=Factory.js.map