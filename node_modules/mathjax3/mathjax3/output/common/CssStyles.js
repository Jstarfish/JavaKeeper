"use strict";
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
var CssStyles = (function () {
    function CssStyles(styles) {
        if (styles === void 0) { styles = null; }
        this.styles = {};
        this.addStyles(styles);
    }
    Object.defineProperty(CssStyles.prototype, "cssText", {
        get: function () {
            return this.getStyleString();
        },
        enumerable: true,
        configurable: true
    });
    CssStyles.prototype.addStyles = function (styles) {
        if (!styles)
            return;
        try {
            for (var _a = __values(Object.keys(styles)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var style = _b.value;
                if (!this.styles[style]) {
                    this.styles[style] = {};
                }
                Object.assign(this.styles[style], styles[style]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _c;
    };
    CssStyles.prototype.removeStyles = function () {
        var selectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selectors[_i] = arguments[_i];
        }
        try {
            for (var selectors_1 = __values(selectors), selectors_1_1 = selectors_1.next(); !selectors_1_1.done; selectors_1_1 = selectors_1.next()) {
                var selector = selectors_1_1.value;
                delete this.styles[selector];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (selectors_1_1 && !selectors_1_1.done && (_a = selectors_1.return)) _a.call(selectors_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var e_2, _a;
    };
    CssStyles.prototype.getStyleString = function () {
        var selectors = Object.keys(this.styles);
        var defs = new Array(selectors.length);
        var i = 0;
        try {
            for (var selectors_2 = __values(selectors), selectors_2_1 = selectors_2.next(); !selectors_2_1.done; selectors_2_1 = selectors_2.next()) {
                var selector = selectors_2_1.value;
                defs[i++] = selector + ' {\n' + this.getStyleDefString(this.styles[selector]) + '\n}';
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (selectors_2_1 && !selectors_2_1.done && (_a = selectors_2.return)) _a.call(selectors_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return defs.join('\n\n');
        var e_3, _a;
    };
    CssStyles.prototype.getStyleDefString = function (styles) {
        var properties = Object.keys(styles);
        var values = new Array(properties.length);
        var i = 0;
        try {
            for (var properties_1 = __values(properties), properties_1_1 = properties_1.next(); !properties_1_1.done; properties_1_1 = properties_1.next()) {
                var property = properties_1_1.value;
                values[i++] = '  ' + property + ': ' + styles[property] + ';';
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (properties_1_1 && !properties_1_1.done && (_a = properties_1.return)) _a.call(properties_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return values.join('\n');
        var e_4, _a;
    };
    return CssStyles;
}());
exports.CssStyles = CssStyles;
//# sourceMappingURL=CssStyles.js.map