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
var NodeFactory_js_1 = require("../Tree/NodeFactory.js");
var MML_js_1 = require("./MML.js");
var MmlFactory = (function (_super) {
    __extends(MmlFactory, _super);
    function MmlFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlFactory.prototype, "MML", {
        get: function () {
            return this.node;
        },
        enumerable: true,
        configurable: true
    });
    return MmlFactory;
}(NodeFactory_js_1.AbstractNodeFactory));
MmlFactory.defaultNodes = MML_js_1.MML;
exports.MmlFactory = MmlFactory;
//# sourceMappingURL=MmlFactory.js.map