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
var MmlMenclose = (function (_super) {
    __extends(MmlMenclose, _super);
    function MmlMenclose() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.texClass = MmlNode_js_1.TEXCLASS.ORD;
        return _this;
    }
    Object.defineProperty(MmlMenclose.prototype, "kind", {
        get: function () {
            return 'menclose';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMenclose.prototype, "arity", {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMenclose.prototype, "linebreakContininer", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MmlMenclose.prototype.setTeXclass = function (prev) {
        prev = this.childNodes[0].setTeXclass(prev);
        this.updateTeXclass(this.childNodes[0]);
        return prev;
    };
    return MmlMenclose;
}(MmlNode_js_1.AbstractMmlNode));
MmlMenclose.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults, { notation: 'longdiv' });
exports.MmlMenclose = MmlMenclose;
//# sourceMappingURL=menclose.js.map