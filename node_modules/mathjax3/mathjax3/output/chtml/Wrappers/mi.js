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
var mi_js_1 = require("../../common/Wrappers/mi.js");
var mi_js_2 = require("../../../core/MmlTree/MmlNodes/mi.js");
var CHTMLmi = (function (_super) {
    __extends(CHTMLmi, _super);
    function CHTMLmi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmi.prototype.toCHTML = function (parent) {
        _super.prototype.toCHTML.call(this, parent);
        if (this.noIC) {
            this.adaptor.setAttribute(this.chtml, 'noIC', 'true');
        }
    };
    return CHTMLmi;
}(mi_js_1.CommonMiMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLmi.kind = mi_js_2.MmlMi.prototype.kind;
exports.CHTMLmi = CHTMLmi;
//# sourceMappingURL=mi.js.map