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
var mo_js_1 = require("../../common/Wrappers/mo.js");
var mo_js_2 = require("../../../core/MmlTree/MmlNodes/mo.js");
var BBox_js_1 = require("../BBox.js");
var VFUZZ = 0.1;
var HFUZZ = 0.1;
var SVGmo = (function (_super) {
    __extends(SVGmo, _super);
    function SVGmo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmo.prototype.toSVG = function (parent) {
        var attributes = this.node.attributes;
        var symmetric = attributes.get('symmetric') && this.stretch.dir !== 2;
        var stretchy = this.stretch.dir !== 0;
        if (stretchy && this.size === null) {
            this.getStretchedVariant([]);
        }
        var svg = this.standardSVGnode(parent);
        if (stretchy && this.size < 0) {
            this.stretchSVG(svg, symmetric);
        }
        else {
            if (symmetric || attributes.get('largeop')) {
                var bbox = BBox_js_1.BBox.empty();
                _super.prototype.computeBBox.call(this, bbox);
                var u = this.fixed((bbox.d - bbox.h) / 2 + this.font.params.axis_height);
                if (u !== '0') {
                    this.adaptor.setAttribute(svg, 'transform', 'translate(0 ' + u + ')');
                }
            }
            this.addChildren(svg);
        }
    };
    SVGmo.prototype.stretchSVG = function (svg, symmetric) {
        var stretch = this.stretch.stretch;
        var bbox = this.getBBox();
        if (this.stretch.dir === 1) {
            this.stretchVertical(stretch, bbox);
        }
        else {
            this.stretchHorizontal(stretch, bbox);
        }
    };
    SVGmo.prototype.stretchVertical = function (stretch, bbox) {
        var h = bbox.h, d = bbox.d, w = bbox.w;
        var T = this.addTop(stretch[0], h, w);
        var B = this.addBot(stretch[2], d, w);
        if (stretch.length === 4) {
            var _a = __read(this.addMidV(stretch[3], w), 2), H = _a[0], D = _a[1];
            this.addExtV(stretch[1], h, 0, T, H, w);
            this.addExtV(stretch[1], 0, d, D, B, w);
        }
        else {
            this.addExtV(stretch[1], h, d, T, B, w);
        }
    };
    SVGmo.prototype.stretchHorizontal = function (stretch, bbox) {
        var h = bbox.h, d = bbox.d, w = bbox.w;
        var L = this.addLeft(stretch[0]);
        var R = this.addRight(stretch[2], w);
        if (stretch.length === 4) {
            var _a = __read(this.addMidH(stretch[3], w), 2), x1 = _a[0], x2 = _a[1];
            var w2 = w / 2;
            this.addExtH(stretch[1], w2, L, w2 - x1);
            this.addExtH(stretch[1], w2, x2 - w2, R, w2);
        }
        else {
            this.addExtH(stretch[1], w, L, R);
        }
    };
    SVGmo.prototype.getChar = function (n) {
        var char = this.font.getChar('-size4', n) || [0, 0, 0, null];
        return [char[0], char[1], char[2], char[3] || {}];
    };
    SVGmo.prototype.addGlyph = function (n, x, y, parent) {
        if (parent === void 0) { parent = null; }
        return this.placeChar(n, x, y, parent || this.element, '-size4');
    };
    SVGmo.prototype.addTop = function (n, H, W) {
        if (!n)
            return 0;
        var _a = __read(this.getChar(n), 3), h = _a[0], d = _a[1], w = _a[2];
        this.addGlyph(n, (W - w) / 2, H - h);
        return h + d;
    };
    SVGmo.prototype.addExtV = function (n, H, D, T, B, W) {
        var _this = this;
        if (!n)
            return;
        T = Math.max(0, T - VFUZZ);
        B = Math.max(0, B - VFUZZ);
        var adaptor = this.adaptor;
        var _a = __read(this.getChar(n), 3), h = _a[0], d = _a[1], w = _a[2];
        var Y = H + D - T - B;
        var s = 1.5 * Y / (h + d);
        var y = (s * (h - d) - Y) / 2;
        var svg = this.svg('svg', {
            width: this.fixed(w), height: this.fixed(Y),
            y: this.fixed(B - D), x: this.fixed((W - w) / 2),
            viewBox: [0, y, w, Y].map(function (x) { return _this.fixed(x); }).join(' ')
        });
        this.addGlyph(n, 0, 0, svg);
        var glyph = adaptor.lastChild(svg);
        adaptor.setAttribute(glyph, 'transform', 'scale(1, ' + this.jax.fixed(s) + ')');
        adaptor.append(this.element, svg);
    };
    SVGmo.prototype.addBot = function (n, D, W) {
        if (!n)
            return 0;
        var _a = __read(this.getChar(n), 3), h = _a[0], d = _a[1], w = _a[2];
        this.addGlyph(n, (W - w) / 2, d - D);
        return h + d;
    };
    SVGmo.prototype.addMidV = function (n, W) {
        if (!n)
            return [0, 0];
        var _a = __read(this.getChar(n), 3), h = _a[0], d = _a[1], w = _a[2];
        var y = (d - h) / 2 + this.font.params.axis_height;
        this.addGlyph(n, (W - w) / 2, y);
        return [h + y, d - y];
    };
    SVGmo.prototype.addLeft = function (n) {
        return (n ? this.addGlyph(n, 0, 0) : 0);
    };
    SVGmo.prototype.addExtH = function (n, W, L, R, x) {
        var _this = this;
        if (x === void 0) { x = 0; }
        if (!n)
            return;
        R = Math.max(0, R - HFUZZ);
        L = Math.max(0, L - HFUZZ);
        var adaptor = this.adaptor;
        var _a = __read(this.getChar(n), 3), h = _a[0], d = _a[1], w = _a[2];
        var X = W - L - R;
        var Y = h + d + 2 * VFUZZ;
        var s = 1.5 * (X / w);
        var svg = this.svg('svg', {
            width: this.fixed(X), height: this.fixed(Y),
            x: this.fixed(x + L), y: this.fixed(-VFUZZ),
            viewBox: [(s * w - X) / 2, -VFUZZ, X, Y].map(function (x) { return _this.fixed(x); }).join(' ')
        });
        this.addGlyph(n, 0, 0, svg);
        var glyph = this.adaptor.lastChild(svg);
        this.adaptor.setAttribute(glyph, 'transform', 'scale(' + this.jax.fixed(s) + ', 1)');
        this.adaptor.append(this.element, svg);
    };
    SVGmo.prototype.addRight = function (n, W) {
        if (!n)
            return 0;
        var _a = __read(this.getChar(n), 3), h = _a[0], d = _a[1], w = _a[2];
        return this.addGlyph(n, W - w, 0);
    };
    SVGmo.prototype.addMidH = function (n, W) {
        if (!n)
            return [0, 0];
        var _a = __read(this.getChar(n), 3), h = _a[0], d = _a[1], w = _a[2];
        this.addGlyph(n, (W - w) / 2, 0);
        return [(W - w) / 2, (W + w) / 2];
    };
    return SVGmo;
}(mo_js_1.CommonMoMixin(Wrapper_js_1.SVGWrapper)));
SVGmo.kind = mo_js_2.MmlMo.prototype.kind;
exports.SVGmo = SVGmo;
//# sourceMappingURL=mo.js.map