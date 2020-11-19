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
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../Wrapper.js");
var mpadded_js_1 = require("../../common/Wrappers/mpadded.js");
var mpadded_js_2 = require("../../../core/MmlTree/MmlNodes/mpadded.js");
var SVGmpadded = (function (_super) {
    __extends(SVGmpadded, _super);
    function SVGmpadded() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmpadded.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        var _a = __read(this.getDimens(), 9), H = _a[0], D = _a[1], W = _a[2], dh = _a[3], dd = _a[4], dw = _a[5], x = _a[6], y = _a[7], dx = _a[8];
        var align = this.node.attributes.get('data-align') || 'left';
        var X = x + dx - (dw < 0 && align !== 'left' ? align === 'center' ? dw / 2 : dw : 0);
        if (X || y) {
            svg = this.adaptor.append(svg, this.svg('g'));
            this.place(X, y, svg);
        }
        this.addChildren(svg);
    };
    return SVGmpadded;
}(mpadded_js_1.CommonMpaddedMixin(Wrapper_js_1.SVGWrapper)));
SVGmpadded.kind = mpadded_js_2.MmlMpadded.prototype.kind;
exports.SVGmpadded = SVGmpadded;
//# sourceMappingURL=mpadded.js.map