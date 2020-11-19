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
var math_js_1 = require("../../common/Wrappers/math.js");
var math_js_2 = require("../../../core/MmlTree/MmlNodes/math.js");
var CHTMLmath = (function (_super) {
    __extends(CHTMLmath, _super);
    function CHTMLmath() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmath.prototype.toCHTML = function (parent) {
        _super.prototype.toCHTML.call(this, parent);
        var chtml = this.chtml;
        var adaptor = this.adaptor;
        var attributes = this.node.attributes;
        var display = (attributes.get('display') === 'block');
        if (display) {
            adaptor.setAttribute(chtml, 'display', 'true');
            adaptor.setAttribute(parent, 'display', 'true');
        }
        else {
            var margin = adaptor.getStyle(chtml, 'margin-right');
            if (margin) {
                adaptor.setStyle(chtml, 'margin-right', '');
                adaptor.setStyle(parent, 'margin-right', margin);
                adaptor.setStyle(parent, 'width', '0');
            }
        }
        adaptor.addClass(chtml, 'MJX-TEX');
        var _a = __read(this.getAlignShift(), 2), align = _a[0], shift = _a[1];
        if (align !== 'center') {
            adaptor.setAttribute(parent, 'justify', align);
        }
        if (display && shift && !adaptor.hasAttribute(chtml, 'width')) {
            this.setIndent(chtml, align, shift);
        }
    };
    CHTMLmath.prototype.setChildPWidths = function (recompute, w, clear) {
        if (w === void 0) { w = null; }
        if (clear === void 0) { clear = true; }
        return (this.parent ? _super.prototype.setChildPWidths.call(this, recompute, w) : false);
    };
    return CHTMLmath;
}(math_js_1.CommonMathMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLmath.kind = math_js_2.MmlMath.prototype.kind;
CHTMLmath.styles = {
    'mjx-math': {
        'line-height': 0,
        'text-align': 'left',
        'text-indent': 0,
        'font-style': 'normal',
        'font-weight': 'normal',
        'font-size': '100%',
        'font-size-adjust': 'none',
        'letter-spacing': 'normal',
        'word-wrap': 'normal',
        'word-spacing': 'normal',
        'white-space': 'nowrap',
        'direction': 'ltr',
        'padding': '1px 0'
    },
    'mjx-container[jax="CHTML"][display="true"]': {
        display: 'block',
        'text-align': 'center',
        margin: '1em 0'
    },
    'mjx-container[jax="CHTML"][display="true"] mjx-math': {
        padding: 0
    },
    'mjx-container[jax="CHTML"][justify="left"]': {
        'text-align': 'left'
    },
    'mjx-container[jax="CHTML"][justify="right"]': {
        'text-align': 'right'
    }
};
exports.CHTMLmath = CHTMLmath;
//# sourceMappingURL=math.js.map