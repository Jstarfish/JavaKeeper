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
var MathDocument_js_1 = require("./MathDocument.js");
var DefaultMathDocument = (function (_super) {
    __extends(DefaultMathDocument, _super);
    function DefaultMathDocument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DefaultMathDocument;
}(MathDocument_js_1.AbstractMathDocument));
var AbstractHandler = (function () {
    function AbstractHandler(adaptor, priority) {
        if (priority === void 0) { priority = 5; }
        this.documentClass = DefaultMathDocument;
        this.adaptor = adaptor;
        this.priority = priority;
    }
    Object.defineProperty(AbstractHandler.prototype, "name", {
        get: function () {
            return this.constructor.NAME;
        },
        enumerable: true,
        configurable: true
    });
    AbstractHandler.prototype.handlesDocument = function (document) {
        return false;
    };
    AbstractHandler.prototype.create = function (document, options) {
        return new this.documentClass(document, this.adaptor, options);
    };
    return AbstractHandler;
}());
AbstractHandler.NAME = 'generic';
exports.AbstractHandler = AbstractHandler;
//# sourceMappingURL=Handler.js.map