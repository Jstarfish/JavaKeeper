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
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../Wrapper.js");
var semantics_js_1 = require("../../common/Wrappers/semantics.js");
var semantics_js_2 = require("../../../core/MmlTree/MmlNodes/semantics.js");
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var SVGsemantics = (function (_super) {
    __extends(SVGsemantics, _super);
    function SVGsemantics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGsemantics.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        if (this.childNodes.length) {
            this.childNodes[0].toSVG(svg);
        }
    };
    return SVGsemantics;
}(semantics_js_1.CommonSemanticsMixin(Wrapper_js_1.SVGWrapper)));
SVGsemantics.kind = semantics_js_2.MmlSemantics.prototype.kind;
exports.SVGsemantics = SVGsemantics;
var SVGannotation = (function (_super) {
    __extends(SVGannotation, _super);
    function SVGannotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGannotation.prototype.toSVG = function (parent) {
        _super.prototype.toSVG.call(this, parent);
    };
    SVGannotation.prototype.computeBBox = function () {
        return this.bbox;
    };
    return SVGannotation;
}(Wrapper_js_1.SVGWrapper));
SVGannotation.kind = semantics_js_2.MmlAnnotation.prototype.kind;
exports.SVGannotation = SVGannotation;
var SVGannotationXML = (function (_super) {
    __extends(SVGannotationXML, _super);
    function SVGannotationXML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SVGannotationXML;
}(Wrapper_js_1.SVGWrapper));
SVGannotationXML.kind = semantics_js_2.MmlAnnotationXML.prototype.kind;
exports.SVGannotationXML = SVGannotationXML;
var SVGxml = (function (_super) {
    __extends(SVGxml, _super);
    function SVGxml() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGxml.prototype.toSVG = function (parent) {
        var xml = this.adaptor.clone(this.node.getXML());
        this.adaptor.append(parent, this.svg('foreignObject', {}, [xml]));
    };
    SVGxml.prototype.computeBBox = function () {
        return this.bbox;
    };
    SVGxml.prototype.getStyles = function () { };
    SVGxml.prototype.getScale = function () { };
    SVGxml.prototype.getVariant = function () { };
    return SVGxml;
}(Wrapper_js_1.SVGWrapper));
SVGxml.kind = MmlNode_js_1.XMLNode.prototype.kind;
SVGxml.autoStyle = false;
exports.SVGxml = SVGxml;
//# sourceMappingURL=semantics.js.map