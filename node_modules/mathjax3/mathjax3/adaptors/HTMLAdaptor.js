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
var DOMAdaptor_js_1 = require("../core/DOMAdaptor.js");
var HTMLAdaptor = (function (_super) {
    __extends(HTMLAdaptor, _super);
    function HTMLAdaptor(window) {
        var _this = _super.call(this, window.document) || this;
        _this.window = window;
        _this.parser = new window.DOMParser();
        return _this;
    }
    HTMLAdaptor.prototype.parse = function (text, format) {
        if (format === void 0) { format = 'text/html'; }
        return this.parser.parseFromString(text, format);
    };
    HTMLAdaptor.prototype.create = function (kind, ns) {
        return (ns ?
            this.document.createElementNS(ns, kind) :
            this.document.createElement(kind));
    };
    HTMLAdaptor.prototype.text = function (text) {
        return this.document.createTextNode(text);
    };
    HTMLAdaptor.prototype.head = function (doc) {
        return doc.head;
    };
    HTMLAdaptor.prototype.body = function (doc) {
        return doc.body;
    };
    HTMLAdaptor.prototype.root = function (doc) {
        return doc.documentElement;
    };
    HTMLAdaptor.prototype.tags = function (node, name, ns) {
        if (ns === void 0) { ns = null; }
        var nodes = (ns ? node.getElementsByTagNameNS(ns, name) : node.getElementsByTagName(name));
        return Array.from(nodes);
    };
    HTMLAdaptor.prototype.getElements = function (nodes, document) {
        var containers = [];
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                if (typeof (node) === 'string') {
                    containers = containers.concat(Array.from(this.document.querySelectorAll(node)));
                }
                else if (Array.isArray(node)) {
                    containers = containers.concat(Array.from(node));
                }
                else if (node instanceof this.window.NodeList || node instanceof this.window.HTMLCollection) {
                    containers = containers.concat(Array.from(node));
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
    HTMLAdaptor.prototype.parent = function (node) {
        return node.parentNode;
    };
    HTMLAdaptor.prototype.append = function (node, child) {
        return node.appendChild(child);
    };
    HTMLAdaptor.prototype.insert = function (nchild, ochild) {
        return this.parent(ochild).insertBefore(nchild, ochild);
    };
    HTMLAdaptor.prototype.remove = function (child) {
        return this.parent(child).removeChild(child);
    };
    HTMLAdaptor.prototype.replace = function (nnode, onode) {
        return this.parent(onode).replaceChild(nnode, onode);
    };
    HTMLAdaptor.prototype.clone = function (node) {
        return node.cloneNode(true);
    };
    HTMLAdaptor.prototype.split = function (node, n) {
        return node.splitText(n);
    };
    HTMLAdaptor.prototype.next = function (node) {
        return node.nextSibling;
    };
    HTMLAdaptor.prototype.previous = function (node) {
        return node.previousSibling;
    };
    HTMLAdaptor.prototype.firstChild = function (node) {
        return node.firstChild;
    };
    HTMLAdaptor.prototype.lastChild = function (node) {
        return node.lastChild;
    };
    HTMLAdaptor.prototype.childNodes = function (node) {
        return Array.from(node.childNodes);
    };
    HTMLAdaptor.prototype.childNode = function (node, i) {
        return node.childNodes[i];
    };
    HTMLAdaptor.prototype.kind = function (node) {
        return node.nodeName.toLowerCase();
    };
    HTMLAdaptor.prototype.value = function (node) {
        return node.nodeValue || '';
    };
    HTMLAdaptor.prototype.textContent = function (node) {
        return node.textContent;
    };
    HTMLAdaptor.prototype.innerHTML = function (node) {
        return node.innerHTML;
    };
    HTMLAdaptor.prototype.outerHTML = function (node) {
        return node.outerHTML;
    };
    HTMLAdaptor.prototype.setAttribute = function (node, name, value) {
        return node.setAttribute(name, value);
    };
    HTMLAdaptor.prototype.getAttribute = function (node, name) {
        return node.getAttribute(name);
    };
    HTMLAdaptor.prototype.removeAttribute = function (node, name) {
        return node.removeAttribute(name);
    };
    HTMLAdaptor.prototype.hasAttribute = function (node, name) {
        return node.hasAttribute(name);
    };
    HTMLAdaptor.prototype.allAttributes = function (node) {
        return Array.from(node.attributes).map(function (x) {
            return { name: x.name, value: x.value };
        });
    };
    HTMLAdaptor.prototype.addClass = function (node, name) {
        node.classList.add(name);
    };
    HTMLAdaptor.prototype.removeClass = function (node, name) {
        return node.classList.remove(name);
    };
    HTMLAdaptor.prototype.hasClass = function (node, name) {
        return node.classList.contains(name);
    };
    HTMLAdaptor.prototype.setStyle = function (node, name, value) {
        node.style[name] = value;
    };
    HTMLAdaptor.prototype.getStyle = function (node, name) {
        return node.style[name];
    };
    HTMLAdaptor.prototype.allStyles = function (node) {
        return node.style.cssText;
    };
    HTMLAdaptor.prototype.fontSize = function (node) {
        var style = this.window.getComputedStyle(node);
        return parseFloat(style.fontSize);
    };
    HTMLAdaptor.prototype.nodeSize = function (node, em, local) {
        if (em === void 0) { em = 1; }
        if (local === void 0) { local = false; }
        if (local && node.getBBox) {
            var _a = node.getBBox(), width = _a.width, height = _a.height;
            return [width / em, height / em];
        }
        return [node.offsetWidth / em, node.offsetHeight / em];
    };
    HTMLAdaptor.prototype.nodeBBox = function (node) {
        var _a = node.getBoundingClientRect(), left = _a.left, right = _a.right, top = _a.top, bottom = _a.bottom;
        return { left: left, right: right, top: top, bottom: bottom };
    };
    return HTMLAdaptor;
}(DOMAdaptor_js_1.AbstractDOMAdaptor));
exports.HTMLAdaptor = HTMLAdaptor;
//# sourceMappingURL=HTMLAdaptor.js.map