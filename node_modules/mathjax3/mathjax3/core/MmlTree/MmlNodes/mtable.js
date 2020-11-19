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
var string_js_1 = require("../../../util/string.js");
var MmlMtable = (function (_super) {
    __extends(MmlMtable, _super);
    function MmlMtable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.properties = {
            useHeight: 1
        };
        _this.texClass = MmlNode_js_1.TEXCLASS.ORD;
        return _this;
    }
    Object.defineProperty(MmlMtable.prototype, "kind", {
        get: function () {
            return 'mtable';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMtable.prototype, "linebreakContainer", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MmlMtable.prototype.setInheritedAttributes = function (attributes, display, level, prime) {
        try {
            for (var indentAttributes_1 = __values(MmlNode_js_1.indentAttributes), indentAttributes_1_1 = indentAttributes_1.next(); !indentAttributes_1_1.done; indentAttributes_1_1 = indentAttributes_1.next()) {
                var name_1 = indentAttributes_1_1.value;
                if (attributes[name_1]) {
                    this.attributes.setInherited(name_1, attributes[name_1][1]);
                }
                if (this.attributes.getExplicit(name_1) !== undefined) {
                    delete (this.attributes.getAllAttributes())[name_1];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (indentAttributes_1_1 && !indentAttributes_1_1.done && (_a = indentAttributes_1.return)) _a.call(indentAttributes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        _super.prototype.setInheritedAttributes.call(this, attributes, display, level, prime);
        var e_1, _a;
    };
    ;
    MmlMtable.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                if (!child.isKind('mtr')) {
                    this.replaceChild(this.factory.create('mtr'), child)
                        .appendChild(child);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        display = !!(this.attributes.getExplicit('displaystyle') || this.attributes.getDefault('displaystyle'));
        attributes = this.addInheritedAttributes(attributes, {
            columnalign: this.attributes.get('columnalign'),
            rowalign: 'center'
        });
        var ralign = string_js_1.split(this.attributes.get('rowalign'));
        try {
            for (var _d = __values(this.childNodes), _e = _d.next(); !_e.done; _e = _d.next()) {
                var child = _e.value;
                attributes.rowalign[1] = ralign.shift() || attributes.rowalign[1];
                child.setInheritedAttributes(attributes, display, level, prime);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_2, _c, e_3, _f;
    };
    MmlMtable.prototype.verifyChildren = function (options) {
        if (!options['fixMtables']) {
            try {
                for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var child = _b.value;
                    if (!child.isKind('mtr')) {
                        this.mError('Children of ' + this.kind + ' must be mtr or mlabeledtr', options);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        _super.prototype.verifyChildren.call(this, options);
        var e_4, _c;
    };
    MmlMtable.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                child.setTeXclass(null);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return this;
        var e_5, _c;
    };
    return MmlMtable;
}(MmlNode_js_1.AbstractMmlNode));
MmlMtable.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults, { align: 'axis', rowalign: 'baseline', columnalign: 'center', groupalign: '{left}', alignmentscope: true, columnwidth: 'auto', width: 'auto', rowspacing: '1ex', columnspacing: '.8em', rowlines: 'none', columnlines: 'none', frame: 'none', framespacing: '0.4em 0.5ex', equalrows: false, equalcolumns: false, displaystyle: false, side: 'right', minlabelspacing: '0.8em' });
exports.MmlMtable = MmlMtable;
//# sourceMappingURL=mtable.js.map