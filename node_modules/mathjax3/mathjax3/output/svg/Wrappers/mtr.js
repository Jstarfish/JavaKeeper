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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../Wrapper.js");
var mtr_js_1 = require("../../common/Wrappers/mtr.js");
var mtr_js_2 = require("../../common/Wrappers/mtr.js");
var mtr_js_3 = require("../../../core/MmlTree/MmlNodes/mtr.js");
var SVGmtr = (function (_super) {
    __extends(SVGmtr, _super);
    function SVGmtr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmtr.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        this.placeCells(svg);
        this.placeColor(svg);
    };
    SVGmtr.prototype.placeCells = function (svg) {
        var cSpace = this.parent.getColumnHalfSpacing();
        var cLines = __spread([this.parent.fLine], this.parent.cLines, [this.parent.fLine]);
        var cWidth = this.parent.getComputedWidths();
        var _a = __read([this.tLine / 2, this.bLine / 2], 2), T = _a[0], B = _a[1];
        var x = cLines[0];
        for (var i = 0; i < this.numCells; i++) {
            var child = this.getChild(i);
            child.toSVG(svg);
            x += this.placeCell(child, {
                x: x, y: 0, lSpace: cSpace[i], rSpace: cSpace[i + 1], w: cWidth[i],
                lLine: cLines[i], rLine: cLines[i + 1]
            });
        }
    };
    SVGmtr.prototype.placeCell = function (cell, sizes) {
        var x = sizes.x, y = sizes.y, lSpace = sizes.lSpace, w = sizes.w, rSpace = sizes.rSpace, lLine = sizes.lLine, rLine = sizes.rLine;
        var _a = __read(cell.placeCell(x + lSpace, y, w, this.H, this.D), 2), dx = _a[0], dy = _a[1];
        var W = lSpace + w + rSpace;
        var _b = __read([this.H + this.tSpace, this.D + this.bSpace], 2), H = _b[0], D = _b[1];
        cell.placeColor(-(dx + lSpace + lLine / 2), -(D + this.bLine / 2 + dy), W + (lLine + rLine) / 2, H + D + (this.tLine + this.bLine) / 2);
        return W + rLine;
    };
    SVGmtr.prototype.placeColor = function (svg) {
        var adaptor = this.adaptor;
        var child = adaptor.firstChild(this.element);
        if (child && adaptor.kind(child) === 'rect' && adaptor.getAttribute(child, 'data-bgcolor')) {
            var _a = __read([this.tLine / 2, this.bLine / 2], 2), TL = _a[0], BL = _a[1];
            var _b = __read([this.tSpace, this.bSpace], 2), TS = _b[0], BS = _b[1];
            var _c = __read([this.H, this.D], 2), H = _c[0], D = _c[1];
            adaptor.setAttribute(child, 'y', this.fixed(-(D + BS + BL)));
            adaptor.setAttribute(child, 'width', this.fixed(this.parent.getWidth()));
            adaptor.setAttribute(child, 'height', this.fixed(TL + TS + H + D + BS + BL));
        }
    };
    return SVGmtr;
}(mtr_js_1.CommonMtrMixin(Wrapper_js_1.SVGWrapper)));
SVGmtr.kind = mtr_js_3.MmlMtr.prototype.kind;
exports.SVGmtr = SVGmtr;
var SVGmlabeledtr = (function (_super) {
    __extends(SVGmlabeledtr, _super);
    function SVGmlabeledtr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmlabeledtr.prototype.toSVG = function (parent) {
        _super.prototype.toSVG.call(this, parent);
        var child = this.childNodes[0];
        if (child) {
            child.toSVG(this.parent.labels);
        }
    };
    return SVGmlabeledtr;
}(mtr_js_2.CommonMlabeledtrMixin(SVGmtr)));
SVGmlabeledtr.kind = mtr_js_3.MmlMlabeledtr.prototype.kind;
exports.SVGmlabeledtr = SVGmlabeledtr;
//# sourceMappingURL=mtr.js.map