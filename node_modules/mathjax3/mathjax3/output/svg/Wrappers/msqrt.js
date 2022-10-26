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
var msqrt_js_1 = require("../../common/Wrappers/msqrt.js");
var msqrt_js_2 = require("../../../core/MmlTree/MmlNodes/msqrt.js");
var SVGmsqrt = (function (_super) {
    __extends(SVGmsqrt, _super);
    function SVGmsqrt() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dx = 0;
        return _this;
    }
    SVGmsqrt.prototype.toSVG = function (parent) {
        var surd = this.childNodes[this.surd];
        var base = this.childNodes[this.base];
        var root = (this.root ? this.childNodes[this.root] : null);
        var rbox = this.getBBox();
        var sbox = surd.getBBox();
        var bbox = base.getBBox();
        var t = this.font.params.rule_thickness * this.bbox.scale;
        var SVG = this.standardSVGnode(parent);
        var BASE = this.adaptor.append(SVG, this.svg('g'));
        this.addRoot(SVG, root, sbox);
        surd.toSVG(SVG);
        surd.place(this.dx, rbox.h - sbox.h - t);
        base.toSVG(BASE);
        base.place(this.dx + sbox.w, 0);
        var RULE = this.adaptor.append(SVG, this.svg('rect', {
            width: this.fixed(bbox.w), height: this.fixed(t),
            x: this.fixed(this.dx + sbox.w), y: this.fixed(rbox.h - 2 * t)
        }));
    };
    SVGmsqrt.prototype.addRoot = function (ROOT, root, sbox) {
    };
    return SVGmsqrt;
}(msqrt_js_1.CommonMsqrtMixin(Wrapper_js_1.SVGWrapper)));
SVGmsqrt.kind = msqrt_js_2.MmlMsqrt.prototype.kind;
exports.SVGmsqrt = SVGmsqrt;
//# sourceMappingURL=msqrt.js.map