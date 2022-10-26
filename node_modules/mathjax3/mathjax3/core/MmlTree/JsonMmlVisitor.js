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
var MmlVisitor_js_1 = require("./MmlVisitor.js");
var JsonMmlVisitor = (function (_super) {
    __extends(JsonMmlVisitor, _super);
    function JsonMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonMmlVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node);
    };
    JsonMmlVisitor.prototype.visitTextNode = function (node) {
        return { kind: node.kind, text: node.getText() };
    };
    JsonMmlVisitor.prototype.visitXMLNode = function (node) {
        return { kind: node.kind, xml: node.getXML() };
    };
    JsonMmlVisitor.prototype.visitDefault = function (node) {
        var json = {
            kind: node.kind.replace(/inferredM/, 'm'),
            texClass: node.texClass,
            attributes: this.getAttributes(node),
            inherited: this.getInherited(node),
            properties: this.getProperties(node),
            childNodes: this.getChildren(node)
        };
        if (node.isInferred) {
            json.isInferred = true;
        }
        if (node.isEmbellished) {
            json.isEmbellished = true;
        }
        if (node.isSpacelike) {
            json.isSpacelike = true;
        }
        return json;
    };
    JsonMmlVisitor.prototype.getChildren = function (node) {
        var children = [];
        try {
            for (var _a = __values(node.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                children.push(this.visitNode(child));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return children;
        var e_1, _c;
    };
    JsonMmlVisitor.prototype.getAttributes = function (node) {
        return Object.assign({}, node.attributes.getAllAttributes());
    };
    JsonMmlVisitor.prototype.getInherited = function (node) {
        return Object.assign({}, node.attributes.getAllInherited());
    };
    JsonMmlVisitor.prototype.getProperties = function (node) {
        return Object.assign({}, node.getAllProperties());
    };
    return JsonMmlVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.JsonMmlVisitor = JsonMmlVisitor;
//# sourceMappingURL=JsonMmlVisitor.js.map