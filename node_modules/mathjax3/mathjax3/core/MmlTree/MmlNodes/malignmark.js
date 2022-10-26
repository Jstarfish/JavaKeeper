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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMalignmark = (function (_super) {
    __extends(MmlMalignmark, _super);
    function MmlMalignmark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMalignmark.prototype, "kind", {
        get: function () {
            return 'malignmark';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMalignmark.prototype, "arity", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMalignmark.prototype, "isSpacelike", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return MmlMalignmark;
}(MmlNode_js_1.AbstractMmlNode));
MmlMalignmark.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults, { edge: 'left' });
exports.MmlMalignmark = MmlMalignmark;
//# sourceMappingURL=malignmark.js.map