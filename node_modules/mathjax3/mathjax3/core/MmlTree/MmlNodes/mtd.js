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
var Attributes_js_1 = require("../Attributes.js");
var MmlMtd = (function (_super) {
    __extends(MmlMtd, _super);
    function MmlMtd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMtd.prototype, "kind", {
        get: function () {
            return 'mtd';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMtd.prototype, "arity", {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMtd.prototype, "linebreakContainer", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MmlMtd.prototype.verifyChildren = function (options) {
        if (this.parent && !this.parent.isKind('mtr')) {
            this.mError(this.kind + ' can only be a child of an mtr or mlabeledtr', options, true);
            return;
        }
        _super.prototype.verifyChildren.call(this, options);
    };
    MmlMtd.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        this.childNodes[0].setTeXclass(null);
        return this;
    };
    return MmlMtd;
}(MmlNode_js_1.AbstractMmlBaseNode));
MmlMtd.defaults = __assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults, { rowspan: 1, columnspan: 1, rowalign: Attributes_js_1.INHERIT, columnalign: Attributes_js_1.INHERIT, groupalign: Attributes_js_1.INHERIT });
exports.MmlMtd = MmlMtd;
//# sourceMappingURL=mtd.js.map