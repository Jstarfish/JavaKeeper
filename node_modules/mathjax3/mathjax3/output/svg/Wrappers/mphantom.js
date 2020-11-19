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
var mphantom_js_1 = require("../../../core/MmlTree/MmlNodes/mphantom.js");
var SVGmphantom = (function (_super) {
    __extends(SVGmphantom, _super);
    function SVGmphantom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmphantom.prototype.toSVG = function (parent) {
        this.standardSVGnode(parent);
    };
    return SVGmphantom;
}(Wrapper_js_1.SVGWrapper));
SVGmphantom.kind = mphantom_js_1.MmlMphantom.prototype.kind;
exports.SVGmphantom = SVGmphantom;
//# sourceMappingURL=mphantom.js.map