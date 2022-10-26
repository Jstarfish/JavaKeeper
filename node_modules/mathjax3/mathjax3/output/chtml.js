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
Object.defineProperty(exports, "__esModule", { value: true });
var OutputJax_js_1 = require("./common/OutputJax.js");
var WrapperFactory_js_1 = require("./chtml/WrapperFactory.js");
var tex_js_1 = require("./chtml/fonts/tex.js");
var CHTML = (function (_super) {
    __extends(CHTML, _super);
    function CHTML(options) {
        if (options === void 0) { options = null; }
        return _super.call(this, options, WrapperFactory_js_1.CHTMLWrapperFactory, tex_js_1.TeXFont) || this;
    }
    CHTML.prototype.escaped = function (math, html) {
        this.setDocument(html);
        return this.html('span', {}, [this.text(math.math)]);
    };
    CHTML.prototype.styleSheet = function (html) {
        var sheet = _super.prototype.styleSheet.call(this, html);
        this.adaptor.setAttribute(sheet, 'id', 'CHTML-styles');
        return sheet;
    };
    CHTML.prototype.addClassStyles = function (CLASS) {
        if (CLASS.autoStyle && CLASS.kind !== 'unknown') {
            this.cssStyles.addStyles((_a = {},
                _a['mjx-' + CLASS.kind] = {
                    display: 'inline-block',
                    'text-align': 'left'
                },
                _a));
        }
        _super.prototype.addClassStyles.call(this, CLASS);
        var _a;
    };
    CHTML.prototype.processMath = function (math, parent) {
        this.factory.wrap(math).toCHTML(parent);
    };
    CHTML.prototype.unknownText = function (text, variant) {
        var styles = {};
        var scale = 100 / this.math.metrics.scale;
        if (scale !== 100) {
            styles['font-size'] = this.fixed(scale, 1) + '%';
        }
        if (variant !== '-explicitFont') {
            this.cssFontStyles(this.font.getCssFont(variant), styles);
        }
        return this.html('mjx-utext', { variant: variant, style: styles }, [this.text(text)]);
    };
    CHTML.prototype.measureTextNode = function (text) {
        var adaptor = this.adaptor;
        text = adaptor.clone(text);
        var node = this.html('mjx-measure-text', {}, [text]);
        adaptor.append(adaptor.parent(this.math.start.node), this.container);
        adaptor.append(this.container, node);
        var w = adaptor.nodeSize(text, this.math.metrics.em)[0] / this.math.metrics.scale;
        adaptor.remove(this.container);
        adaptor.remove(node);
        return { w: w, h: .75, d: .25 };
    };
    CHTML.prototype.getFontData = function (styles) {
        var font = _super.prototype.getFontData.call(this, styles);
        font[0] = 'MJXZERO, ' + font[0];
        return font;
    };
    return CHTML;
}(OutputJax_js_1.CommonOutputJax));
CHTML.NAME = 'CHTML';
CHTML.OPTIONS = __assign({}, OutputJax_js_1.CommonOutputJax.OPTIONS);
exports.CHTML = CHTML;
//# sourceMappingURL=chtml.js.map