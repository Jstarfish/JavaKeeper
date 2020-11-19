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
Object.defineProperty(exports, "__esModule", { value: true });
var SerializedMmlVisitor_js_1 = require("./SerializedMmlVisitor.js");
var TestMmlVisitor = (function (_super) {
    __extends(TestMmlVisitor, _super);
    function TestMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestMmlVisitor.prototype.visitDefault = function (node, space) {
        var kind = node.kind;
        var _a = __read((node.isToken || node.childNodes.length === 0 ? ['', ''] : ['\n', space]), 2), nl = _a[0], endspace = _a[1];
        var mml = space + '<' + kind + this.getAttributes(node) +
            this.getInherited(node) + this.getProperties(node) + '\n' + space + '   ' +
            this.attributeString({
                isEmbellished: node.isEmbellished,
                isSpacelike: node.isSpacelike,
                texClass: node.texClass
            }, '{', '}') +
            '>' + nl;
        space += '  ';
        try {
            for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                mml += this.visitNode(child, space) + nl;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        mml += endspace + '</' + kind + '>';
        return mml;
        var e_1, _d;
    };
    TestMmlVisitor.prototype.getAttributes = function (node) {
        return this.attributeString(node.attributes.getAllAttributes(), '', '');
    };
    TestMmlVisitor.prototype.getInherited = function (node) {
        return this.attributeString(node.attributes.getAllInherited(), '[', ']');
    };
    TestMmlVisitor.prototype.getProperties = function (node) {
        return this.attributeString(node.getAllProperties(), '[[', ']]');
    };
    TestMmlVisitor.prototype.attributeString = function (attributes, open, close) {
        var ATTR = '';
        try {
            for (var _a = __values(Object.keys(attributes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_1 = _b.value;
                ATTR += ' ' + open + name_1 + '="' + this.quoteHTML(String(attributes[name_1])) + '"' + close;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return ATTR;
        var e_2, _c;
    };
    return TestMmlVisitor;
}(SerializedMmlVisitor_js_1.SerializedMmlVisitor));
exports.TestMmlVisitor = TestMmlVisitor;
//# sourceMappingURL=TestMmlVisitor.js.map