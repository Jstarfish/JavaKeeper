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
var msubsup_js_1 = require("./msubsup.js");
var munderover_js_1 = require("../../common/Wrappers/munderover.js");
var munderover_js_2 = require("../../common/Wrappers/munderover.js");
var munderover_js_3 = require("../../common/Wrappers/munderover.js");
var munderover_js_4 = require("../../../core/MmlTree/MmlNodes/munderover.js");
var SVGmunder = (function (_super) {
    __extends(SVGmunder, _super);
    function SVGmunder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmunder.prototype.toSVG = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toSVG.call(this, parent);
            return;
        }
        var svg = this.standardSVGnode(parent);
        var _a = __read([this.baseChild, this.script], 2), base = _a[0], script = _a[1];
        var _b = __read([base.getBBox(), script.getBBox()], 2), bbox = _b[0], sbox = _b[1];
        base.toSVG(svg);
        script.toSVG(svg);
        var delta = this.getDelta(true);
        var _c = __read(this.getUnderKV(bbox, sbox), 2), k = _c[0], v = _c[1];
        var _d = __read(this.getDeltaW([bbox, sbox], [0, -delta]), 2), bx = _d[0], sx = _d[1];
        base.place(bx, 0);
        script.place(sx, v);
    };
    return SVGmunder;
}(munderover_js_1.CommonMunderMixin(msubsup_js_1.SVGmsub)));
SVGmunder.kind = munderover_js_4.MmlMunder.prototype.kind;
SVGmunder.useIC = true;
exports.SVGmunder = SVGmunder;
var SVGmover = (function (_super) {
    __extends(SVGmover, _super);
    function SVGmover() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmover.prototype.toSVG = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toSVG.call(this, parent);
            return;
        }
        var svg = this.standardSVGnode(parent);
        var _a = __read([this.baseChild, this.script], 2), base = _a[0], script = _a[1];
        var _b = __read([base.getBBox(), script.getBBox()], 2), bbox = _b[0], sbox = _b[1];
        base.toSVG(svg);
        script.toSVG(svg);
        var delta = this.getDelta();
        var _c = __read(this.getOverKU(bbox, sbox), 2), k = _c[0], u = _c[1];
        var _d = __read(this.getDeltaW([bbox, sbox], [0, delta]), 2), bx = _d[0], sx = _d[1];
        base.place(bx, 0);
        script.place(sx, u);
    };
    return SVGmover;
}(munderover_js_2.CommonMoverMixin(msubsup_js_1.SVGmsup)));
SVGmover.kind = munderover_js_4.MmlMover.prototype.kind;
SVGmover.useIC = true;
exports.SVGmover = SVGmover;
var SVGmunderover = (function (_super) {
    __extends(SVGmunderover, _super);
    function SVGmunderover() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmunderover.prototype.toSVG = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toSVG.call(this, parent);
            return;
        }
        var svg = this.standardSVGnode(parent);
        var _a = __read([this.baseChild, this.overChild, this.underChild], 3), base = _a[0], over = _a[1], under = _a[2];
        var _b = __read([base.getBBox(), over.getBBox(), under.getBBox()], 3), bbox = _b[0], obox = _b[1], ubox = _b[2];
        base.toSVG(svg);
        under.toSVG(svg);
        over.toSVG(svg);
        var delta = this.getDelta();
        var _c = __read(this.getOverKU(bbox, obox), 2), ok = _c[0], u = _c[1];
        var _d = __read(this.getUnderKV(bbox, ubox), 2), uk = _d[0], v = _d[1];
        var _e = __read(this.getDeltaW([bbox, ubox, obox], [0, -delta, delta]), 3), bx = _e[0], ux = _e[1], ox = _e[2];
        base.place(bx, 0);
        under.place(ux, v);
        over.place(ox, u);
    };
    return SVGmunderover;
}(munderover_js_3.CommonMunderoverMixin(msubsup_js_1.SVGmsubsup)));
SVGmunderover.kind = munderover_js_4.MmlMunderover.prototype.kind;
SVGmunderover.useIC = true;
exports.SVGmunderover = SVGmunderover;
//# sourceMappingURL=munderover.js.map