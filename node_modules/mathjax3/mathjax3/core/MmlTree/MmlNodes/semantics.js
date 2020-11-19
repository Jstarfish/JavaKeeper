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
Object.defineProperty(exports, "__esModule", { value: true });
var MmlNode_js_1 = require("../MmlNode.js");
var MmlSemantics = (function (_super) {
    __extends(MmlSemantics, _super);
    function MmlSemantics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlSemantics.prototype, "kind", {
        get: function () {
            return 'semantics';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlSemantics.prototype, "arity", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlSemantics.prototype, "notParent", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return MmlSemantics;
}(MmlNode_js_1.AbstractMmlBaseNode));
MmlSemantics.defaults = __assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults, { definitionUrl: null, encoding: null });
exports.MmlSemantics = MmlSemantics;
var MmlAnnotationXML = (function (_super) {
    __extends(MmlAnnotationXML, _super);
    function MmlAnnotationXML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlAnnotationXML.prototype, "kind", {
        get: function () {
            return 'annotation-xml';
        },
        enumerable: true,
        configurable: true
    });
    MmlAnnotationXML.prototype.setChildInheritedAttributes = function () { };
    return MmlAnnotationXML;
}(MmlNode_js_1.AbstractMmlNode));
MmlAnnotationXML.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults, { definitionUrl: null, encoding: null, cd: 'mathmlkeys', name: '', src: null });
exports.MmlAnnotationXML = MmlAnnotationXML;
var MmlAnnotation = (function (_super) {
    __extends(MmlAnnotation, _super);
    function MmlAnnotation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.properties = {
            isChars: true
        };
        return _this;
    }
    Object.defineProperty(MmlAnnotation.prototype, "kind", {
        get: function () {
            return 'annotation';
        },
        enumerable: true,
        configurable: true
    });
    return MmlAnnotation;
}(MmlAnnotationXML));
MmlAnnotation.defaults = __assign({}, MmlAnnotationXML.defaults);
exports.MmlAnnotation = MmlAnnotation;
//# sourceMappingURL=semantics.js.map