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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FontData_js_1 = require("../FontData.js");
var lengths_js_1 = require("../../../util/lengths.js");
var CommonTeXFont = (function (_super) {
    __extends(CommonTeXFont, _super);
    function CommonTeXFont() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CommonTeXFont.prototype, "styles", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    CommonTeXFont.prototype.em = function (n) {
        return lengths_js_1.em(n);
    };
    CommonTeXFont.prototype.em0 = function (n) {
        return lengths_js_1.em(Math.max(0, n));
    };
    CommonTeXFont.prototype.getDelimiterData = function (n) {
        return this.getChar('-smallop', n) || this.getChar('-size4', n);
    };
    return CommonTeXFont;
}(FontData_js_1.FontData));
CommonTeXFont.defaultVariants = __spread(FontData_js_1.FontData.defaultVariants, [
    ['-smallop', 'normal'],
    ['-largeop', 'normal'],
    ['-size3', 'normal'],
    ['-size4', 'normal'],
    ['-tex-caligraphic', 'italic'],
    ['-tex-bold-caligraphic', 'bold-italic'],
    ['-tex-oldstyle', 'normal'],
    ['-tex-bold-oldstyle', 'bold'],
    ['-tex-mathit', 'italic'],
    ['-tex-variant', 'normal']
]);
CommonTeXFont.defaultCssFonts = __assign({}, FontData_js_1.FontData.defaultCssFonts, { '-tex-caligraphic': ['cursive', true, false], '-tex-bold-caligraphic': ['cursive', true, true], '-tex-oldstyle': ['serif', false, false], '-tex-bold-oldstyle': ['serif', false, true], '-tex-mathit': ['serif', true, false] });
CommonTeXFont.defaultVariantClasses = {};
CommonTeXFont.defaultSizeVariants = ['normal', '-smallop', '-largeop', '-size3', '-size4'];
exports.CommonTeXFont = CommonTeXFont;
//# sourceMappingURL=tex.js.map