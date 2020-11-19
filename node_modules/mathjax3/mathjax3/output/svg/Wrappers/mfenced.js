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
var Wrapper_js_1 = require("../Wrapper.js");
var mfenced_js_1 = require("../../common/Wrappers/mfenced.js");
var mfenced_js_2 = require("../../../core/MmlTree/MmlNodes/mfenced.js");
var SVGmfenced = (function (_super) {
    __extends(SVGmfenced, _super);
    function SVGmfenced() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmfenced.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        this.setChildrenParent(this.mrow);
        this.mrow.toSVG(svg);
        this.setChildrenParent(this);
    };
    SVGmfenced.prototype.setChildrenParent = function (parent) {
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                child.parent = parent;
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
    return SVGmfenced;
}(mfenced_js_1.CommonMfencedMixin(Wrapper_js_1.SVGWrapper)));
SVGmfenced.kind = mfenced_js_2.MmlMfenced.prototype.kind;
exports.SVGmfenced = SVGmfenced;
//# sourceMappingURL=mfenced.js.map