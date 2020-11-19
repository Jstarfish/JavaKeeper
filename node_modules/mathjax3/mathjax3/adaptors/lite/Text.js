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
var LiteText = (function () {
    function LiteText(text) {
        if (text === void 0) { text = ""; }
        this.value = text;
    }
    Object.defineProperty(LiteText.prototype, "kind", {
        get: function () {
            return '#text';
        },
        enumerable: true,
        configurable: true
    });
    return LiteText;
}());
exports.LiteText = LiteText;
var LiteComment = (function (_super) {
    __extends(LiteComment, _super);
    function LiteComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LiteComment.prototype, "kind", {
        get: function () {
            return '#comment';
        },
        enumerable: true,
        configurable: true
    });
    return LiteComment;
}(LiteText));
exports.LiteComment = LiteComment;
//# sourceMappingURL=Text.js.map