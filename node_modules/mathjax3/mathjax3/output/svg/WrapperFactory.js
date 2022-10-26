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
var WrapperFactory_js_1 = require("../common/WrapperFactory.js");
var Wrappers_js_1 = require("./Wrappers.js");
var SVGWrapperFactory = (function (_super) {
    __extends(SVGWrapperFactory, _super);
    function SVGWrapperFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.jax = null;
        return _this;
    }
    return SVGWrapperFactory;
}(WrapperFactory_js_1.CommonWrapperFactory));
SVGWrapperFactory.defaultNodes = Wrappers_js_1.SVGWrappers;
exports.SVGWrapperFactory = SVGWrapperFactory;
//# sourceMappingURL=WrapperFactory.js.map