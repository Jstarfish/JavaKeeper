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
var SVGTextNode = (function (_super) {
    __extends(SVGTextNode, _super);
    function SVGTextNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGTextNode.prototype.toSVG = function (parent) {
        var text = this.node.getText();
        if (this.parent.variant === '-explicitFont') {
            this.adaptor.append(parent, this.jax.unknownText(text, this.parent.variant));
        }
        else {
            var c = this.parent.stretch.c;
            var chars = this.parent.remapChars(c ? [c] : this.unicodeChars(text));
            var x = 0;
            try {
                for (var chars_1 = __values(chars), chars_1_1 = chars_1.next(); !chars_1_1.done; chars_1_1 = chars_1.next()) {
                    var n = chars_1_1.value;
                    x += this.placeChar(n, x, 0, parent, this.parent.variant);
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
        this.element = this.adaptor.lastChild(parent);
        var e_1, _a;
    };
    return SVGTextNode;
}(TextNode_js_1.CommonTextNodeMixin(Wrapper_js_1.SVGWrapper)));
SVGTextNode.kind = MmlNode_js_1.TextNode.prototype.kind;
SVGTextNode.styles = {
    '.MathJax path': {
        'stroke-width': 3
    }
};
exports.SVGTextNode = SVGTextNode;
//# sourceMappingURL=TextNode.js.map