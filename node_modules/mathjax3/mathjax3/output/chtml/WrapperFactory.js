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
var CHTMLWrapperFactory = (function (_super) {
    __extends(CHTMLWrapperFactory, _super);
    function CHTMLWrapperFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CHTMLWrapperFactory;
}(WrapperFactory_js_1.CommonWrapperFactory));
CHTMLWrapperFactory.defaultNodes = Wrappers_js_1.CHTMLWrappers;
exports.CHTMLWrapperFactory = CHTMLWrapperFactory;
//# sourceMappingURL=WrapperFactory.js.map