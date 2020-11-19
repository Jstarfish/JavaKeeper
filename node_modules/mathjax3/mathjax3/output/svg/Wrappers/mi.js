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
var SVGmi = (function (_super) {
    __extends(SVGmi, _super);
    function SVGmi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SVGmi;
}(mi_js_1.CommonMiMixin(Wrapper_js_1.SVGWrapper)));
SVGmi.kind = mi_js_2.MmlMi.prototype.kind;
exports.SVGmi = SVGmi;
//# sourceMappingURL=mi.js.map