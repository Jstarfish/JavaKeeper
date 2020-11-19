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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var OutputJax_js_1 = require("./common/OutputJax.js");
var WrapperFactory_js_1 = require("./svg/WrapperFactory.js");
var tex_js_1 = require("./svg/fonts/tex.js");
exports.SVGNS = "http://www.w3.org/2000/svg";
var SVG = (function (_super) {
    __extends(SVG, _super);
    function SVG(options) {
        if (options === void 0) { options = null; }
        var _this = _super.call(this, options, WrapperFactory_js_1.SVGWrapperFactory, tex_js_1.TeXFont) || this;
        _this.shift = 0;
        return _this;
    }
    SVG.prototype.setScale = function (node) {
    };
    SVG.prototype.escaped = function (math, html) {
        this.setDocument(html);
        return this.html('span', {}, [this.text(math.math)]);
    };
    SVG.prototype.styleSheet = function (html) {
        var sheet = _super.prototype.styleSheet.call(this, html);
        this.adaptor.setAttribute(sheet, 'id', 'SVG-styles');
        return sheet;
    };
    SVG.prototype.addClassStyles = function (CLASS) {
        _super.prototype.addClassStyles.call(this, CLASS);
    };
    SVG.prototype.processMath = function (math, parent) {
        var container = this.container;
        this.container = parent;
        var wrapper = this.factory.wrap(math);
        var _a = wrapper.getBBox(), w = _a.w, h = _a.h, d = _a.d, pwidth = _a.pwidth;
        var W = Math.max(w, .001);
        var g = this.svg('g', {
            stroke: 'currentColor', fill: 'currentColor',
            'stroke-width': 0, transform: 'matrix(1 0 0 -1 0 0)'
        });
        var adaptor = this.adaptor;
        var svg = adaptor.append(parent, this.svg('svg', {
            xmlns: exports.SVGNS,
            width: this.ex(w), height: this.ex(h + d),
            style: { 'vertical-align': this.ex(-d) },
            viewBox: [0, this.fixed(-h * 1000, 1), this.fixed(w * 1000, 1), this.fixed((h + d) * 1000, 1)].join(' ')
        }, [g]));
        if (W === .001) {
            adaptor.setAttribute(svg, 'preserveAspectRatio', 'xMidYMid slice');
            if (w < 0) {
                adaptor.setStyle(parent, 'margin-right', this.ex(w));
            }
        }
        if (pwidth) {
            adaptor.setAttribute(svg, 'width', pwidth);
            adaptor.removeAttribute(svg, 'viewBox');
            var scale = wrapper.metrics.ex / (this.font.params.x_height * 1000);
            adaptor.setAttribute(g, 'transform', 'matrix(1 0 0 -1 0 0) scale(' +
                this.fixed(scale, 6) + ') translate(0, ' + this.fixed(-h * 1000, 1) + ')');
        }
        this.shift = 0;
        wrapper.toSVG(g);
        if (wrapper.bbox.pwidth) {
            adaptor.setStyle(svg, 'minWidth', this.ex(wrapper.bbox.w));
        }
        else if (this.shift) {
            var align = adaptor.getAttribute(parent, 'justify') || 'center';
            this.setIndent(svg, align, this.shift);
        }
        this.container = container;
    };
    SVG.prototype.setIndent = function (svg, align, shift) {
        if (align === 'center' || align === 'left') {
            this.adaptor.setStyle(svg, 'margin-left', this.ex(shift));
        }
        if (align === 'center' || align === 'right') {
            this.adaptor.setStyle(svg, 'margin-right', this.ex(-shift));
        }
    };
    SVG.prototype.ex = function (m) {
        m /= this.font.params.x_height;
        if (Math.abs(m) < .001)
            return '0';
        return (m.toFixed(3).replace(/\.?0+$/, '')) + 'ex';
    };
    SVG.prototype.svg = function (kind, properties, children) {
        if (properties === void 0) { properties = {}; }
        if (children === void 0) { children = []; }
        return this.html(kind, properties, children, exports.SVGNS);
    };
    SVG.prototype.unknownText = function (text, variant) {
        var metrics = this.math.metrics;
        var scale = this.font.params.x_height / metrics.ex * metrics.em * 1000;
        var svg = this.svg('text', {
            'data-variant': variant,
            transform: 'matrix(1 0 0 -1 0 0)', 'font-size': this.fixed(scale, 1) + 'px'
        }, [this.text(text)]);
        var adaptor = this.adaptor;
        if (variant !== '-explicitFont') {
            var _a = __read(this.font.getCssFont(variant), 3), family = _a[0], italic = _a[1], bold = _a[2];
            adaptor.setAttribute(svg, 'font-family', family);
            if (italic) {
                adaptor.setAttribute(svg, 'font-style', 'italic');
            }
            if (bold) {
                adaptor.setAttribute(svg, 'font-weight', 'bold');
            }
        }
        return svg;
    };
    SVG.prototype.measureTextNode = function (text) {
        var adaptor = this.adaptor;
        text = adaptor.clone(text);
        adaptor.removeAttribute(text, 'transform');
        var ex = this.fixed(this.font.params.x_height * 1000, 1);
        var svg = this.svg('svg', {
            position: 'absolute', visibility: 'hidden',
            width: '1ex', height: '1ex',
            viewBox: [0, 0, ex, ex].join(' ')
        }, [text]);
        adaptor.append(adaptor.body(adaptor.document), svg);
        var w = adaptor.nodeSize(text, 1000, true)[0];
        adaptor.remove(svg);
        return { w: w, h: .75, d: .25 };
    };
    return SVG;
}(OutputJax_js_1.CommonOutputJax));
SVG.NAME = 'SVG';
SVG.OPTIONS = __assign({}, OutputJax_js_1.CommonOutputJax.OPTIONS);
exports.SVG = SVG;
//# sourceMappingURL=svg.js.map