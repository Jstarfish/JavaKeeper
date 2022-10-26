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
Object.defineProperty(exports, "__esModule", { value: true });
var InputJax_js_1 = require("../core/InputJax.js");
var AsciiMath_js_1 = require("../../mathjax2/input/AsciiMath.js");
var Options_js_1 = require("../util/Options.js");
var FindAsciiMath_js_1 = require("./asciimath/FindAsciiMath.js");
var AsciiMath = (function (_super) {
    __extends(AsciiMath, _super);
    function AsciiMath(options) {
        var _this = this;
        var _a = __read(Options_js_1.separateOptions(options, FindAsciiMath_js_1.FindAsciiMath.OPTIONS), 2), am = _a[0], find = _a[1];
        _this = _super.call(this, am) || this;
        _this.findAsciiMath = _this.options['FindAsciiMath'] || new FindAsciiMath_js_1.FindAsciiMath(find);
        return _this;
    }
    AsciiMath.prototype.compile = function (math) {
        return AsciiMath_js_1.LegacyAsciiMath.Compile(math.math, math.display);
    };
    AsciiMath.prototype.findMath = function (strings) {
        return this.findAsciiMath.findMath(strings);
    };
    return AsciiMath;
}(InputJax_js_1.AbstractInputJax));
AsciiMath.NAME = 'AsciiMath';
AsciiMath.OPTIONS = __assign({}, InputJax_js_1.AbstractInputJax.OPTIONS, { FindAsciiMath: null });
exports.AsciiMath = AsciiMath;
//# sourceMappingURL=asciimath.js.map