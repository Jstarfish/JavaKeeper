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
function CommonMsubMixin(Base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(class_1.prototype, "script", {
            get: function () {
                return this.childNodes[this.node.sub];
            },
            enumerable: true,
            configurable: true
        });
        class_1.prototype.getOffset = function (bbox, sbox) {
            return [0, -this.getV(bbox, sbox)];
        };
        return class_1;
    }(Base));
}
exports.CommonMsubMixin = CommonMsubMixin;
function CommonMsupMixin(Base) {
    return (function (_super) {
        __extends(class_2, _super);
        function class_2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(class_2.prototype, "script", {
            get: function () {
                return this.childNodes[this.node.sup];
            },
            enumerable: true,
            configurable: true
        });
        class_2.prototype.getOffset = function (bbox, sbox) {
            var x = (this.baseCore.bbox.ic ? .2 * this.baseCore.bbox.ic + .05 : 0);
            return [x, this.getU(bbox, sbox)];
        };
        return class_2;
    }(Base));
}
exports.CommonMsupMixin = CommonMsupMixin;
function CommonMsubsupMixin(Base) {
    return (function (_super) {
        __extends(class_3, _super);
        function class_3() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.UVQ = null;
            return _this;
        }
        Object.defineProperty(class_3.prototype, "subChild", {
            get: function () {
                return this.childNodes[this.node.sub];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_3.prototype, "supChild", {
            get: function () {
                return this.childNodes[this.node.sup];
            },
            enumerable: true,
            configurable: true
        });
        class_3.prototype.computeBBox = function (bbox, recompute) {
            if (recompute === void 0) { recompute = false; }
            var basebox = this.baseChild.getBBox();
            var subbox = this.subChild.getBBox();
            var supbox = this.supChild.getBBox();
            bbox.empty();
            bbox.append(basebox);
            var w = bbox.w;
            var _a = __read(this.getUVQ(basebox, subbox, supbox), 3), u = _a[0], v = _a[1], q = _a[2];
            bbox.combine(subbox, w, v);
            bbox.combine(supbox, w + this.coreIC(), u);
            bbox.w += this.font.params.scriptspace;
            bbox.clean();
            this.setChildPWidths(recompute);
        };
        class_3.prototype.getUVQ = function (basebox, subbox, supbox) {
            if (this.UVQ)
                return this.UVQ;
            var tex = this.font.params;
            var t = 3 * tex.rule_thickness;
            var subscriptshift = this.length2em(this.node.attributes.get('subscriptshift'), tex.sub2);
            var drop = (this.isCharBase() ? 0 : basebox.d + tex.sub_drop * subbox.rscale);
            var _a = __read([this.getU(basebox, supbox), Math.max(drop, subscriptshift)], 2), u = _a[0], v = _a[1];
            var q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
            if (q < t) {
                v += t - q;
                var p = (4 / 5) * tex.x_height - (u - supbox.d * supbox.rscale);
                if (p > 0) {
                    u += p;
                    v -= p;
                }
            }
            u = Math.max(this.length2em(this.node.attributes.get('superscriptshift'), u), u);
            v = Math.max(this.length2em(this.node.attributes.get('subscriptshift'), v), v);
            q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
            this.UVQ = [u, -v, q];
            return this.UVQ;
        };
        return class_3;
    }(Base));
}
exports.CommonMsubsupMixin = CommonMsubsupMixin;
//# sourceMappingURL=msubsup.js.map