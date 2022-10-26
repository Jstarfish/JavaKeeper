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
var mmultiscripts_js_1 = require("../../common/Wrappers/mmultiscripts.js");
var mmultiscripts_js_2 = require("../../../core/MmlTree/MmlNodes/mmultiscripts.js");
var SVGmmultiscripts = (function (_super) {
    __extends(SVGmmultiscripts, _super);
    function SVGmmultiscripts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmmultiscripts.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        var data = this.getScriptData();
        var sub = this.combinePrePost(data.sub, data.psub);
        var sup = this.combinePrePost(data.sup, data.psup);
        var _a = __read(this.getUVQ(data.base, sub, sup), 3), u = _a[0], v = _a[1], q = _a[2];
        var x = 0;
        if (data.numPrescripts) {
            x = this.addScripts(.05, u, v, true, this.firstPrescript, data.numPrescripts);
        }
        var base = this.baseChild;
        base.toSVG(svg);
        base.place(x, 0);
        x += base.getBBox().w;
        if (data.numScripts) {
            this.addScripts(x, u, v, false, 1, data.numScripts);
        }
    };
    SVGmmultiscripts.prototype.addScripts = function (x, u, v, isPre, i, n) {
        var adaptor = this.adaptor;
        var supRow = adaptor.append(this.element, this.svg('g'));
        var subRow = adaptor.append(this.element, this.svg('g'));
        this.place(x, u, supRow);
        this.place(x, v, subRow);
        var m = i + 2 * n, child;
        var dx = 0;
        while (i < m) {
            var _a = __read([this.childNodes[i++], this.childNodes[i++]], 2), sub = _a[0], sup = _a[1];
            var _b = __read([sub.getBBox(), sup.getBBox()], 2), subbox = _b[0], supbox = _b[1];
            var _c = __read([subbox.rscale, supbox.rscale], 2), subr = _c[0], supr = _c[1];
            var w = Math.max(subbox.w * subr, supbox.w * supr);
            sub.toSVG(subRow);
            sup.toSVG(supRow);
            sub.place(dx + (isPre ? w - subbox.w * subr : 0), 0);
            sup.place(dx + (isPre ? w - supbox.w * supr : 0), 0);
            dx += w;
        }
        return x + dx;
    };
    return SVGmmultiscripts;
}(mmultiscripts_js_1.CommonMmultiscriptsMixin(msubsup_js_1.SVGmsubsup)));
SVGmmultiscripts.kind = mmultiscripts_js_2.MmlMmultiscripts.prototype.kind;
exports.SVGmmultiscripts = SVGmmultiscripts;
//# sourceMappingURL=mmultiscripts.js.map