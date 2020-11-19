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
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var Wrapper_js_1 = require("../Wrapper.js");
var TextNode_js_1 = require("../../common/Wrappers/TextNode.js");
var CHTMLTextNode = (function (_super) {
    __extends(CHTMLTextNode, _super);
    function CHTMLTextNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLTextNode.prototype.toCHTML = function (parent) {
        var adaptor = this.adaptor;
        var variant = this.parent.variant;
        var text = this.node.getText();
        if (variant === '-explicitFont') {
            var font = this.jax.getFontData(this.parent.styles);
            adaptor.append(parent, this.jax.unknownText(text, variant, font));
        }
        else {
            var c = this.parent.stretch.c;
            var chars = this.parent.remapChars(c ? [c] : this.unicodeChars(text));
            try {
                for (var chars_1 = __values(chars), chars_1_1 = chars_1.next(); !chars_1_1.done; chars_1_1 = chars_1.next()) {
                    var n = chars_1_1.value;
                    var data = this.getVariantChar(variant, n)[3];
                    var node = (data.unknown ?
                        this.jax.unknownText(String.fromCharCode(n), variant) :
                        this.html('mjx-c', { c: this.char(n) }));
                    adaptor.append(parent, node);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (chars_1_1 && !chars_1_1.done && (_a = chars_1.return)) _a.call(chars_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        var e_1, _a;
    };
    return CHTMLTextNode;
}(TextNode_js_1.CommonTextNodeMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLTextNode.kind = MmlNode_js_1.TextNode.prototype.kind;
CHTMLTextNode.autoStyle = false;
CHTMLTextNode.styles = {
    'mjx-c, mjx-c::before': {
        display: 'inline-block'
    },
    'mjx-utext': {
        display: 'inline-block',
        padding: '.75em 0 .25em 0'
    },
    'mjx-measure-text': {
        position: 'absolute',
        'font-family': 'MJXZERO',
        'white space': 'nowrap',
        height: '1px',
        width: '1px',
        overflow: 'hidden'
    }
};
exports.CHTMLTextNode = CHTMLTextNode;
//# sourceMappingURL=TextNode.js.map