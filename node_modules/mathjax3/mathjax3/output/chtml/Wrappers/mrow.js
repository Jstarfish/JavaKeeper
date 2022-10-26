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
var mrow_js_1 = require("../../common/Wrappers/mrow.js");
var mrow_js_2 = require("../../common/Wrappers/mrow.js");
var mrow_js_3 = require("../../../core/MmlTree/MmlNodes/mrow.js");
var CHTMLmrow = (function (_super) {
    __extends(CHTMLmrow, _super);
    function CHTMLmrow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmrow.prototype.toCHTML = function (parent) {
        var chtml = (this.node.isInferred ? (this.chtml = parent) : this.standardCHTMLnode(parent));
        var hasNegative = false;
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                child.toCHTML(chtml);
                if (child.bbox.w < 0) {
                    hasNegative = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (hasNegative) {
            var w = this.getBBox().w;
            if (w) {
                this.adaptor.setStyle(chtml, 'width', this.em(Math.max(0, w)));
                if (w < 0) {
                    this.adaptor.setStyle(chtml, 'marginRight', this.em(w));
                }
            }
        }
        var e_1, _c;
    };
    return CHTMLmrow;
}(mrow_js_1.CommonMrowMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLmrow.kind = mrow_js_3.MmlMrow.prototype.kind;
exports.CHTMLmrow = CHTMLmrow;
var CHTMLinferredMrow = (function (_super) {
    __extends(CHTMLinferredMrow, _super);
    function CHTMLinferredMrow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CHTMLinferredMrow;
}(mrow_js_2.CommonInferredMrowMixin(CHTMLmrow)));
CHTMLinferredMrow.kind = mrow_js_3.MmlInferredMrow.prototype.kind;
exports.CHTMLinferredMrow = CHTMLinferredMrow;
//# sourceMappingURL=mrow.js.map