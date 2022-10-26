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
var scriptbase_js_1 = require("./scriptbase.js");
var msubsup_js_1 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_2 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_3 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_4 = require("../../../core/MmlTree/MmlNodes/msubsup.js");
var CHTMLmsub = (function (_super) {
    __extends(CHTMLmsub, _super);
    function CHTMLmsub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CHTMLmsub;
}(msubsup_js_1.CommonMsubMixin(scriptbase_js_1.CHTMLscriptbase)));
CHTMLmsub.kind = msubsup_js_4.MmlMsub.prototype.kind;
CHTMLmsub.useIC = false;
exports.CHTMLmsub = CHTMLmsub;
var CHTMLmsup = (function (_super) {
    __extends(CHTMLmsup, _super);
    function CHTMLmsup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CHTMLmsup;
}(msubsup_js_2.CommonMsupMixin(scriptbase_js_1.CHTMLscriptbase)));
CHTMLmsup.kind = msubsup_js_4.MmlMsup.prototype.kind;
CHTMLmsup.useIC = true;
exports.CHTMLmsup = CHTMLmsup;
var CHTMLmsubsup = (function (_super) {
    __extends(CHTMLmsubsup, _super);
    function CHTMLmsubsup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmsubsup.prototype.toCHTML = function (parent) {
        var chtml = this.standardCHTMLnode(parent);
        var _a = __read([this.baseChild, this.supChild, this.subChild], 3), base = _a[0], sup = _a[1], sub = _a[2];
        var _b = __read(this.getUVQ(base.getBBox(), sub.getBBox(), sup.getBBox()), 3), u = _b[0], v = _b[1], q = _b[2];
        var style = { 'vertical-align': this.em(v) };
        base.toCHTML(chtml);
        var stack = this.adaptor.append(chtml, this.html('mjx-script', { style: style }));
        sup.toCHTML(stack);
        this.adaptor.append(stack, this.html('mjx-spacer', { style: { 'margin-top': this.em(q) } }));
        sub.toCHTML(stack);
        var corebox = this.baseCore.bbox;
        if (corebox.ic) {
            this.adaptor.setStyle(sup.chtml, 'marginLeft', this.em(this.coreIC() / sup.bbox.rscale));
        }
    };
    return CHTMLmsubsup;
}(msubsup_js_3.CommonMsubsupMixin(scriptbase_js_1.CHTMLscriptbase)));
CHTMLmsubsup.kind = msubsup_js_4.MmlMsubsup.prototype.kind;
CHTMLmsubsup.styles = {
    'mjx-script': {
        display: 'inline-block',
        'padding-right': '.05em'
    },
    'mjx-script > *': {
        display: 'block'
    }
};
CHTMLmsubsup.useIC = false;
exports.CHTMLmsubsup = CHTMLmsubsup;
//# sourceMappingURL=msubsup.js.map