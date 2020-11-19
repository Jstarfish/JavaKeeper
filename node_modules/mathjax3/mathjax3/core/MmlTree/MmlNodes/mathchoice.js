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
var mathchoice = (function (_super) {
    __extends(mathchoice, _super);
    function mathchoice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(mathchoice.prototype, "kind", {
        get: function () {
            return 'mathchoice';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(mathchoice.prototype, "arity", {
        get: function () {
            return 4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(mathchoice.prototype, "notParent", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    mathchoice.prototype.setInheritedAttributes = function (attributes, display, level, prime) {
        var selection = (display ? 0 : Math.max(0, Math.min(level, 2)) + 1);
        var child = this.childNodes[selection] || this.factory.create('mrow');
        this.parent.replaceChild(child, this);
        child.setInheritedAttributes(attributes, display, level, prime);
    };
    return mathchoice;
}(MmlNode_js_1.AbstractMmlBaseNode));
mathchoice.defaults = __assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults);
exports.mathchoice = mathchoice;
//# sourceMappingURL=mathchoice.js.map