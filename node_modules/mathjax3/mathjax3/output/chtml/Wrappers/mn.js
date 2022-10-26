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
var mn_js_1 = require("../../common/Wrappers/mn.js");
var mn_js_2 = require("../../../core/MmlTree/MmlNodes/mn.js");
var CHTMLmn = (function (_super) {
    __extends(CHTMLmn, _super);
    function CHTMLmn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CHTMLmn;
}(mn_js_1.CommonMnMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLmn.kind = mn_js_2.MmlMn.prototype.kind;
exports.CHTMLmn = CHTMLmn;
//# sourceMappingURL=mn.js.map