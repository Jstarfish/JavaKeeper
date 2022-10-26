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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMfrac = (function (_super) {
    __extends(MmlMfrac, _super);
    function MmlMfrac() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMfrac.prototype, "kind", {
        get: function () {
            return 'mfrac';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMfrac.prototype, "arity", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMfrac.prototype, "linebreakContainer", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MmlMfrac.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                child.setTeXclass(null);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (this.isEmbellished) {
            this.updateTeXclass(this.core());
        }
        return this;
        var e_1, _c;
    };
    MmlMfrac.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        if (!display || level > 0) {
            level++;
        }
        this.childNodes[0].setInheritedAttributes(attributes, false, level, prime);
        this.childNodes[1].setInheritedAttributes(attributes, false, level, true);
    };
    return MmlMfrac;
}(MmlNode_js_1.AbstractMmlBaseNode));
MmlMfrac.defaults = __assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults, { linethickness: 'medium', numalign: 'center', denomalign: 'center', bevelled: false });
exports.MmlMfrac = MmlMfrac;
//# sourceMappingURL=mfrac.js.map