"use strict";
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
var NodeFactory = (function () {
    function NodeFactory() {
        this.mmlFactory = null;
        this.factory = { 'node': NodeFactory.createNode,
            'token': NodeFactory.createToken,
            'text': NodeFactory.createText,
            'error': NodeFactory.createError
        };
    }
    NodeFactory.prototype.setMmlFactory = function (mmlFactory) {
        this.mmlFactory = mmlFactory;
    };
    NodeFactory.createNode = function (factory, kind, children, def, text) {
        if (children === void 0) { children = []; }
        if (def === void 0) { def = {}; }
        var node = factory.mmlFactory.create(kind);
        var arity = node.arity;
        if (arity === Infinity || arity === -1) {
            if (children.length === 1 && children[0].isInferred) {
                node.setChildren(NodeUtil_js_1.default.getChildren(children[0]));
            }
            else {
                node.setChildren(children);
            }
        }
        else {
            var cleanChildren = [];
            for (var i = 0, child = void 0; child = children[i]; i++) {
                if (child.isInferred) {
                    var mrow = factory.mmlFactory.create('mrow', {}, NodeUtil_js_1.default.getChildren(child));
                    NodeUtil_js_1.default.copyAttributes(child, mrow);
                    cleanChildren.push(mrow);
                }
                else {
                    cleanChildren.push(child);
                }
            }
            node.setChildren(cleanChildren);
        }
        if (text) {
            node.appendChild(text);
        }
        NodeUtil_js_1.default.setProperties(node, def);
        return node;
    };
    ;
    NodeFactory.createToken = function (factory, kind, def, text) {
        if (def === void 0) { def = {}; }
        if (text === void 0) { text = ''; }
        var textNode = factory.create('text', text);
        return factory.create('node', kind, [], def, textNode);
    };
    NodeFactory.createText = function (factory, text) {
        if (text == null) {
            return null;
        }
        return factory.mmlFactory.create('text').setText(text);
    };
    ;
    NodeFactory.createError = function (factory, message) {
        var text = factory.create('text', message);
        var mtext = factory.create('node', 'mtext', [], {}, text);
        var error = factory.create('node', 'merror', [mtext]);
        return error;
    };
    ;
    NodeFactory.prototype.set = function (kind, func) {
        this.factory[kind] = func;
    };
    NodeFactory.prototype.setCreators = function (maps) {
        for (var kind in maps) {
            this.set(kind, maps[kind]);
        }
    };
    NodeFactory.prototype.create = function (kind) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var func = this.factory[kind] || this.factory['node'];
        var node = func.apply(void 0, __spread([this, rest[0]], rest.slice(1)));
        this.configuration.addNode(rest[0], node);
        return node;
    };
    return NodeFactory;
}());
exports.NodeFactory = NodeFactory;
//# sourceMappingURL=NodeFactory.js.map