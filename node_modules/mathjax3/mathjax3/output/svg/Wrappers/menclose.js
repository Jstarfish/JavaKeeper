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
var menclose_js_1 = require("../../common/Wrappers/menclose.js");
var Notation = require("../Notation.js");
var menclose_js_2 = require("../../../core/MmlTree/MmlNodes/menclose.js");
var SVGmenclose = (function (_super) {
    __extends(SVGmenclose, _super);
    function SVGmenclose() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmenclose.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        var left = this.getBBoxExtenders()[3];
        var def = {};
        if (left > 0) {
            def.transform = 'translate(' + this.fixed(left) + ', 0)';
        }
        var block = this.adaptor.append(svg, this.svg('g', def));
        if (this.renderChild) {
            this.renderChild(this, block);
        }
        else {
            this.childNodes[0].toSVG(block);
        }
        try {
            for (var _a = __values(Object.keys(this.notations)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_1 = _b.value;
                var notation = this.notations[name_1];
                !notation.renderChild && notation.renderer(this, svg);
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
    SVGmenclose.prototype.arrow = function (W, a, double) {
        if (double === void 0) { double = false; }
        var _a = this.getBBox(), w = _a.w, h = _a.h, d = _a.d;
        var dw = (W - w) / 2;
        var m = (h - d) / 2;
        var t = this.thickness;
        var _b = __read([t * this.arrowhead.x, t * this.arrowhead.y, t * this.arrowhead.dx], 3), x = _b[0], y = _b[1], dx = _b[2];
        var arrow = (double ?
            this.fill('M', w + dw, m, 'l', -(x + dx), y, 'l', dx, t / 2 - y, 'L', x - dw, m + t / 2, 'l', dx, y - t / 2, 'l', -(x + dx), -y, 'l', x + dx, -y, 'l', -dx, y - t / 2, 'L', w + dw - x, m - t / 2, 'l', -dx, t / 2 - y, 'Z') :
            this.fill('M', w + dw, m, 'l', -(x + dx), y, 'l', dx, t / 2 - y, 'L', -dw, m + t / 2, 'l', 0, -t, 'L', w + dw - x, m - t / 2, 'l', -dx, t / 2 - y, 'Z'));
        if (a) {
            var A = this.jax.fixed(-a * 180 / Math.PI);
            this.adaptor.setAttribute(arrow, 'transform', 'rotate(' + [A, this.fixed(w / 2), this.fixed(m)].join(' ') + ')');
        }
        return arrow;
    };
    SVGmenclose.prototype.line = function (pq) {
        var _a = __read(pq, 4), x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
        return this.svg('line', {
            x1: this.fixed(x1), y1: this.fixed(y1),
            x2: this.fixed(x2), y2: this.fixed(y2),
            'stroke-width': this.fixed(this.thickness)
        });
    };
    SVGmenclose.prototype.box = function (w, h, d, r) {
        if (r === void 0) { r = 0; }
        var t = this.thickness;
        var def = {
            x: this.fixed(t / 2), y: this.fixed(t / 2 - d),
            width: this.fixed(w - t), height: this.fixed(h + d - t),
            fill: 'none', 'stroke-width': this.fixed(t)
        };
        if (r) {
            def.rx = this.fixed(r);
        }
        return this.svg('rect', def);
    };
    SVGmenclose.prototype.ellipse = function (w, h, d) {
        var t = this.thickness;
        return this.svg('ellipse', {
            rx: this.fixed((w - t) / 2), ry: this.fixed((h + d - t) / 2),
            cx: this.fixed(w / 2), cy: this.fixed((h - d) / 2),
            'fill': 'none', 'stroke-width': this.fixed(t)
        });
    };
    SVGmenclose.prototype.path = function (join) {
        var _this = this;
        var P = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            P[_i - 1] = arguments[_i];
        }
        return this.svg('path', {
            d: P.map(function (x) { return (typeof x === 'string' ? x : _this.fixed(x)); }).join(' '),
            style: { 'stroke-width': this.fixed(this.thickness) },
            'stroke-linecap': 'round', 'stroke-linejoin': join,
            fill: 'none'
        });
    };
    SVGmenclose.prototype.fill = function () {
        var _this = this;
        var P = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            P[_i] = arguments[_i];
        }
        return this.svg('path', {
            d: P.map(function (x) { return (typeof x === 'string' ? x : _this.fixed(x)); }).join(' ')
        });
    };
    return SVGmenclose;
}(menclose_js_1.CommonMencloseMixin(Wrapper_js_1.SVGWrapper)));
SVGmenclose.kind = menclose_js_2.MmlMenclose.prototype.kind;
SVGmenclose.notations = new Map([
    Notation.Border('top'),
    Notation.Border('right'),
    Notation.Border('bottom'),
    Notation.Border('left'),
    Notation.Border2('actuarial', 'top', 'right'),
    Notation.Border2('madruwb', 'bottom', 'right'),
    Notation.DiagonalStrike('up'),
    Notation.DiagonalStrike('down'),
    ['horizontalstrike', {
            renderer: Notation.RenderLine('horizontal'),
            bbox: function (node) { return [0, node.padding, 0, node.padding]; }
        }],
    ['verticalstrike', {
            renderer: Notation.RenderLine('vertical'),
            bbox: function (node) { return [node.padding, 0, node.padding, 0]; }
        }],
    ['box', {
            renderer: function (node, child) {
                var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                node.adaptor.append(node.element, node.box(w, h, d));
            },
            bbox: Notation.fullBBox,
            border: Notation.fullBorder,
            remove: 'left right top bottom'
        }],
    ['roundedbox', {
            renderer: function (node, child) {
                var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                var r = node.thickness + node.padding;
                node.adaptor.append(node.element, node.box(w, h, d, r));
            },
            bbox: Notation.fullBBox
        }],
    ['circle', {
            renderer: function (node, child) {
                var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                node.adaptor.append(node.element, node.ellipse(w, h, d));
            },
            bbox: Notation.fullBBox
        }],
    ['phasorangle', {
            renderer: function (node, child) {
                var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                var _b = __read(node.getArgMod(1.75 * node.padding, h + d), 2), a = _b[0], W = _b[1];
                var t = node.thickness / 2;
                var HD = h + d;
                node.adaptor.append(node.element, node.path('mitre', 'M', w, t - d, 'L', t + Math.cos(a) * t, t - d, 'L', Math.cos(a) * HD + t, HD - d - t));
            },
            bbox: function (node) {
                var p = node.padding / 2;
                var t = node.thickness;
                return [2 * p, p, p + t, 3 * p + t];
            },
            border: function (node) { return [0, 0, node.thickness, 0]; },
            remove: 'bottom'
        }],
    Notation.Arrow('up'),
    Notation.Arrow('down'),
    Notation.Arrow('left'),
    Notation.Arrow('right'),
    Notation.Arrow('updown'),
    Notation.Arrow('leftright'),
    Notation.DiagonalArrow('updiagonal'),
    Notation.DiagonalArrow('northeast'),
    Notation.DiagonalArrow('southeast'),
    Notation.DiagonalArrow('northwest'),
    Notation.DiagonalArrow('southwest'),
    Notation.DiagonalArrow('northeastsouthwest'),
    Notation.DiagonalArrow('northwestsoutheast'),
    ['longdiv', {
            renderer: function (node, child) {
                var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                var t = node.thickness / 2;
                var p = node.padding;
                node.adaptor.append(node.element, node.path('round', 'M', t, t - d, 'a', p - t / 2, (h + d) / 2 - 4 * t, 0, '0,1', 0, h + d - 2 * t, 'L', w - t, h - t));
            },
            bbox: function (node) {
                var p = node.padding;
                var t = node.thickness;
                return [p + t, p, p, 2 * p + t / 2];
            }
        }],
    ['radical', {
            renderer: function (node, child) {
                node.msqrt.toSVG(child);
                var left = node.sqrtTRBL()[3];
                node.place(-left, 0, child);
            },
            init: function (node) {
                node.msqrt = node.createMsqrt(node.childNodes[0]);
            },
            bbox: function (node) { return node.sqrtTRBL(); },
            renderChild: true
        }]
]);
exports.SVGmenclose = SVGmenclose;
//# sourceMappingURL=menclose.js.map