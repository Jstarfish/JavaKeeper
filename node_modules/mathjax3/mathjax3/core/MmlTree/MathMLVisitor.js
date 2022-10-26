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
var MathMLVisitor = (function (_super) {
    __extends(MathMLVisitor, _super);
    function MathMLVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.document = null;
        return _this;
    }
    MathMLVisitor.prototype.visitTree = function (node, document) {
        this.document = document;
        var root = document.createElement('top');
        this.visitNode(node, root);
        this.document = null;
        return root.firstChild;
    };
    MathMLVisitor.prototype.visitTextNode = function (node, parent) {
        parent.appendChild(this.document.createTextNode(node.getText()));
    };
    MathMLVisitor.prototype.visitXMLNode = function (node, parent) {
        parent.appendChild(node.getXML().cloneNode(true));
    };
    MathMLVisitor.prototype.visitInferredMrowNode = function (node, parent) {
        try {
            for (var _a = __values(node.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                this.visitNode(child, parent);
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
    };
    MathMLVisitor.prototype.visitDefault = function (node, parent) {
        var mml = this.document.createElement(node.kind);
        this.addAttributes(node, mml);
        try {
            for (var _a = __values(node.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                this.visitNode(child, mml);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        parent.appendChild(mml);
        var e_2, _c;
    };
    MathMLVisitor.prototype.addAttributes = function (node, mml) {
        var attributes = node.attributes;
        var names = attributes.getExplicitNames();
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                mml.setAttribute(name_1, attributes.getExplicit(name_1).toString());
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_3, _a;
    };
    return MathMLVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.MathMLVisitor = MathMLVisitor;
//# sourceMappingURL=MathMLVisitor.js.map