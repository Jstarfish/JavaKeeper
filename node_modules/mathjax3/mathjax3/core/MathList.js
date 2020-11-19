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
var LinkedList_js_1 = require("../util/LinkedList.js");
var AbstractMathList = (function (_super) {
    __extends(AbstractMathList, _super);
    function AbstractMathList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractMathList.prototype.isBefore = function (a, b) {
        return (a.start.i < b.start.i || (a.start.i === b.start.i && a.start.n < b.start.n));
    };
    return AbstractMathList;
}(LinkedList_js_1.LinkedList));
exports.AbstractMathList = AbstractMathList;
//# sourceMappingURL=MathList.js.map