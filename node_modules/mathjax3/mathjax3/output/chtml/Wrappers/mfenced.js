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
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../Wrapper.js");
var mfenced_js_1 = require("../../common/Wrappers/mfenced.js");
var mfenced_js_2 = require("../../../core/MmlTree/MmlNodes/mfenced.js");
var CHTMLmfenced = (function (_super) {
    __extends(CHTMLmfenced, _super);
    function CHTMLmfenced() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmfenced.prototype.toCHTML = function (parent) {
        var chtml = this.standardCHTMLnode(parent);
        this.mrow.toCHTML(chtml);
    };
    return CHTMLmfenced;
}(mfenced_js_1.CommonMfencedMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLmfenced.kind = mfenced_js_2.MmlMfenced.prototype.kind;
exports.CHTMLmfenced = CHTMLmfenced;
//# sourceMappingURL=mfenced.js.map