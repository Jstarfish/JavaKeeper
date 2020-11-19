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
var Factory_js_1 = require("./Factory.js");
var AbstractNodeFactory = (function (_super) {
    __extends(AbstractNodeFactory, _super);
    function AbstractNodeFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractNodeFactory.prototype.create = function (kind, properties, children) {
        if (properties === void 0) { properties = {}; }
        if (children === void 0) { children = []; }
        return this.node[kind](properties, children);
    };
    return AbstractNodeFactory;
}(Factory_js_1.AbstractFactory));
exports.AbstractNodeFactory = AbstractNodeFactory;
//# sourceMappingURL=NodeFactory.js.map