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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var DOMAdaptor_js_1 = require("../core/DOMAdaptor.js");
var Document_js_1 = require("./lite/Document.js");
var Element_js_1 = require("./lite/Element.js");
var Text_js_1 = require("./lite/Text.js");
var Window_js_1 = require("./lite/Window.js");
var Parser_js_1 = require("./lite/Parser.js");
var Styles_js_1 = require("../util/Styles.js");
var Options_js_1 = require("../util/Options.js");
var LiteAdaptor = (function (_super) {
    __extends(LiteAdaptor, _super);
    function LiteAdaptor(options) {
        if (options === void 0) { options = null; }
        var _this = _super.call(this) || this;
        var CLASS = _this.constructor;
        _this.options = Options_js_1.userOptions(Options_js_1.defaultOptions({}, CLASS.OPTIONS), options);
        _this.parser = new Parser_js_1.LiteParser();
        _this.window = new Window_js_1.LiteWindow();
        return _this;
    }
    LiteAdaptor.prototype.parse = function (text, format) {
        return this.parser.parseFromString(text, format, this);
    };
    ;
    LiteAdaptor.prototype.create = function (kind, ns) {
        if (ns === void 0) { ns = null; }
        return new Element_js_1.LiteElement(kind);
    };
    LiteAdaptor.prototype.text = function (text) {
        return new Text_js_1.LiteText(text);
    };
    LiteAdaptor.prototype.comment = function (text) {
        return new Text_js_1.LiteComment(text);
    };
    LiteAdaptor.prototype.createDocument = function () {
        return new Document_js_1.LiteDocument();
    };
    LiteAdaptor.prototype.head = function (doc) {
        return doc.head;
    };
    LiteAdaptor.prototype.body = function (doc) {
        return doc.body;
    };
    LiteAdaptor.prototype.root = function (doc) {
        return doc.root;
    };
    LiteAdaptor.prototype.tags = function (node, name, ns) {
        if (ns === void 0) { ns = null; }
        var stack = [];
        var tags = [];
        if (ns) {
            return tags;
        }
        var n = node;
        while (n) {
            var kind = n.kind;
            if (kind !== '#text' && kind !== '#comment') {
                n = n;
                if (kind === name) {
                    tags.push(n);
                }
                if (n.children.length) {
                    stack = n.children.concat(stack);
                }
            }
            n = stack.shift();
        }
        return tags;
    };
    LiteAdaptor.prototype.elementById = function (node, id) {
        var stack = [];
        var n = node;
        while (n) {
            if (n.kind !== '#text' && n.kind !== '#comment') {
                n = n;
                if (n.attributes['id'] === id) {
                    return n;
                }
                if (n.children.length) {
                    stack = n.children.concat(stack);
                }
            }
            n = stack.shift();
        }
        return null;
    };
    LiteAdaptor.prototype.elementsByClass = function (node, name) {
        var stack = [];
        var tags = [];
        var n = node;
        while (n) {
            if (n.kind !== '#text' && n.kind !== '#comment') {
                n = n;
                var classes = (n.attributes['class'] || '').split(/ /);
                if (classes.find(name)) {
                    var tags_1 = [];
                }
                if (n.children.length) {
                    stack = n.children.concat(stack);
                }
            }
            n = stack.shift();
        }
        return tags;
    };
    LiteAdaptor.prototype.getElements = function (nodes, document) {
        var containers = [];
        var body = this.body(this.document);
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                if (typeof (node) === 'string') {
                    if (node.charAt(0) === '#') {
                        var n = this.elementById(body, node.slice(1));
                        if (n) {
                            containers.push(n);
                        }
                    }
                    else if (node.charAt(0) === '.') {
                        containers = containers.concat(this.elementsByClass(body, node.slice(1)));
                    }
                    else if (node.match(/^[-a-z][-a-z0-9]*$/i)) {
                        containers = containers.concat(this.tags(body, node));
                    }
                }
                else if (Array.isArray(node)) {
                    containers = containers.concat(node);
                }
                else if (node instanceof this.window.NodeList || node instanceof this.window.HTMLCollection) {
                    containers = containers.concat(node.nodes);
                }
                else {
                    containers.push(node);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return containers;
        var e_1, _a;
    };
    LiteAdaptor.prototype.parent = function (node) {
        return node.parent;
    };
    LiteAdaptor.prototype.childIndex = function (node) {
        return (node.parent ? node.parent.children.findIndex(function (n) { return n === node; }) : -1);
    };
    LiteAdaptor.prototype.append = function (node, child) {
        if (child.parent) {
            this.remove(child);
        }
        node.children.push(child);
        child.parent = node;
        return child;
    };
    LiteAdaptor.prototype.insert = function (nchild, ochild) {
        if (nchild.parent) {
            this.remove(nchild);
        }
        if (ochild && ochild.parent) {
            var i = this.childIndex(ochild);
            ochild.parent.children.splice(i, 0, nchild);
            nchild.parent = ochild.parent;
        }
    };
    LiteAdaptor.prototype.remove = function (child) {
        var i = this.childIndex(child);
        if (i >= 0) {
            child.parent.children.splice(i, 1);
        }
        child.parent = null;
        return child;
    };
    LiteAdaptor.prototype.replace = function (nnode, onode) {
        var i = this.childIndex(onode);
        if (i >= 0) {
            onode.parent.children[i] = nnode;
        }
        return onode;
    };
    LiteAdaptor.prototype.clone = function (node) {
        var _this = this;
        var nnode = new Element_js_1.LiteElement(node.kind);
        nnode.attributes = __assign({}, node.attributes);
        nnode.children = node.children.map(function (n) {
            if (n.kind === '#text') {
                return new Text_js_1.LiteText(n.value);
            }
            else if (n.kind === '#comment') {
                return new Text_js_1.LiteComment(n.value);
            }
            else {
                var m = _this.clone(n);
                m.parent = nnode;
                return m;
            }
        });
        return nnode;
    };
    LiteAdaptor.prototype.split = function (node, n) {
        var text = new Text_js_1.LiteText(node.value.slice(n));
        node.value = node.value.slice(0, n);
        node.parent.children.splice(this.childIndex(node) + 1, 0, text);
        text.parent = node.parent;
        return text;
    };
    LiteAdaptor.prototype.next = function (node) {
        var parent = node.parent;
        if (!parent)
            return;
        var i = this.childIndex(node) + 1;
        return (i >= 0 && i < parent.children.length ? parent.children[i] : null);
    };
    LiteAdaptor.prototype.previous = function (node) {
        var parent = node.parent;
        if (!parent)
            return;
        var i = this.childIndex(node) - 1;
        return (i >= 0 ? parent.children[i] : null);
    };
    LiteAdaptor.prototype.firstChild = function (node) {
        return node.children[0];
    };
    LiteAdaptor.prototype.lastChild = function (node) {
        return node.children[node.children.length - 1];
    };
    LiteAdaptor.prototype.childNodes = function (node) {
        return __spread(node.children);
    };
    LiteAdaptor.prototype.childNode = function (node, i) {
        return node.children[i];
    };
    LiteAdaptor.prototype.kind = function (node) {
        return node.kind;
    };
    LiteAdaptor.prototype.value = function (node) {
        return (node.kind === '#text' ? node.value : '');
    };
    LiteAdaptor.prototype.textContent = function (node) {
        var _this = this;
        return node.children.reduce(function (s, n) {
            return s + (n.kind === '#text' ? n.value :
                n.kind === '#comment' ? '' : _this.textContent(n));
        }, "");
    };
    LiteAdaptor.prototype.innerHTML = function (node) {
        return this.parser.serializeInner(this, node);
    };
    LiteAdaptor.prototype.outerHTML = function (node) {
        return this.parser.serialize(this, node);
    };
    LiteAdaptor.prototype.setAttribute = function (node, name, value) {
        if (typeof value !== 'string') {
            value = String(value);
        }
        node.attributes[name] = value;
        if (name === 'style') {
            node.styles = null;
        }
    };
    LiteAdaptor.prototype.getAttribute = function (node, name) {
        return node.attributes[name];
    };
    LiteAdaptor.prototype.removeAttribute = function (node, name) {
        delete node.attributes[name];
    };
    LiteAdaptor.prototype.hasAttribute = function (node, name) {
        return node.attributes.hasOwnProperty(name);
    };
    LiteAdaptor.prototype.allAttributes = function (node) {
        var attributes = node.attributes;
        var list = [];
        try {
            for (var _a = __values(Object.keys(attributes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_1 = _b.value;
                list.push({ name: name_1, value: attributes[name_1] });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return list;
        var e_2, _c;
    };
    LiteAdaptor.prototype.addClass = function (node, name) {
        var classes = (node.attributes['class'] || '').split(/ /);
        if (!classes.find(function (n) { return n === name; })) {
            classes.push(name);
            node.attributes['class'] = classes.join(' ');
        }
    };
    LiteAdaptor.prototype.removeClass = function (node, name) {
        var classes = (node.attributes['class'] || '').split(/ /);
        var i = classes.findIndex(function (n) { return n === name; });
        if (i >= 0) {
            classes.splice(i, 1);
            node.attributes['class'] = classes.join(' ');
        }
    };
    LiteAdaptor.prototype.hasClass = function (node, name) {
        var classes = (node.attributes['class'] || '').split(/ /);
        return !!classes.find(function (n) { return n === name; });
    };
    LiteAdaptor.prototype.setStyle = function (node, name, value) {
        if (!node.styles) {
            node.styles = new Styles_js_1.Styles(this.getAttribute(node, 'style'));
        }
        node.styles.set(name, value);
        node.attributes['style'] = node.styles.cssText;
    };
    LiteAdaptor.prototype.getStyle = function (node, name) {
        if (!node.styles) {
            var style = this.getAttribute(node, 'style');
            if (!style) {
                return '';
            }
            node.styles = new Styles_js_1.Styles(style);
        }
        return node.styles.get(name);
    };
    LiteAdaptor.prototype.allStyles = function (node) {
        return this.getAttribute(node, 'style');
    };
    LiteAdaptor.prototype.fontSize = function (node) {
        return this.options.fontSize;
    };
    LiteAdaptor.prototype.nodeSize = function (node, em, local) {
        if (em === void 0) { em = 1; }
        if (local === void 0) { local = null; }
        var text = this.textContent(node);
        return [.6 * text.length, 0];
    };
    LiteAdaptor.prototype.nodeBBox = function (node) {
        return { left: 0, right: 0, top: 0, bottom: 0 };
    };
    return LiteAdaptor;
}(DOMAdaptor_js_1.AbstractDOMAdaptor));
LiteAdaptor.OPTIONS = {
    fontSize: 16,
};
exports.LiteAdaptor = LiteAdaptor;
function liteAdaptor(options) {
    if (options === void 0) { options = null; }
    return new LiteAdaptor(options);
}
exports.liteAdaptor = liteAdaptor;
//# sourceMappingURL=liteAdaptor.js.map