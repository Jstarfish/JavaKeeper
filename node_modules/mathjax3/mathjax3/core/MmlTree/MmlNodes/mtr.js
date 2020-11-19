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
var Attributes_js_1 = require("../Attributes.js");
var string_js_1 = require("../../../util/string.js");
var MmlMtr = (function (_super) {
    __extends(MmlMtr, _super);
    function MmlMtr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMtr.prototype, "kind", {
        get: function () {
            return 'mtr';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMtr.prototype, "linebreakContainer", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MmlMtr.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                if (!child.isKind('mtd')) {
                    this.replaceChild(this.factory.create('mtd'), child)
                        .appendChild(child);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var calign = string_js_1.split(this.attributes.get('columnalign'));
        if (this.arity === 1) {
            calign.unshift(this.parent.attributes.get('side'));
        }
        attributes = this.addInheritedAttributes(attributes, {
            rowalign: this.attributes.get('rowalign'),
            columnalign: 'center'
        });
        try {
            for (var _d = __values(this.childNodes), _e = _d.next(); !_e.done; _e = _d.next()) {
                var child = _e.value;
                attributes.columnalign[1] = calign.shift() || attributes.columnalign[1];
                child.setInheritedAttributes(attributes, display, level, prime);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var e_1, _c, e_2, _f;
    };
    MmlMtr.prototype.verifyChildren = function (options) {
        if (this.parent && !this.parent.isKind('mtable')) {
            this.mError(this.kind + ' can only be a child of an mtable', options, true);
            return;
        }
        if (!options['fixMtables']) {
            try {
                for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var child = _b.value;
                    if (!child.isKind('mtd')) {
                        var mtr = this.replaceChild(this.factory.create('mtr'), child);
                        mtr.mError('Children of ' + this.kind + ' must be mtd', options, true);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        _super.prototype.verifyChildren.call(this, options);
        var e_3, _c;
    };
    MmlMtr.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                child.setTeXclass(null);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return this;
        var e_4, _c;
    };
    return MmlMtr;
}(MmlNode_js_1.AbstractMmlNode));
MmlMtr.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults, { rowalign: Attributes_js_1.INHERIT, columnalign: Attributes_js_1.INHERIT, groupalign: Attributes_js_1.INHERIT });
exports.MmlMtr = MmlMtr;
var MmlMlabeledtr = (function (_super) {
    __extends(MmlMlabeledtr, _super);
    function MmlMlabeledtr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMlabeledtr.prototype, "kind", {
        get: function () {
            return 'mlabeledtr';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMlabeledtr.prototype, "arity", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    return MmlMlabeledtr;
}(MmlMtr));
exports.MmlMlabeledtr = MmlMlabeledtr;
//# sourceMappingURL=mtr.js.map