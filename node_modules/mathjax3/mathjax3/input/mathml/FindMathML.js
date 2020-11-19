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
var FindMath_js_1 = require("../../core/FindMath.js");
var NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
var FindMathML = (function (_super) {
    __extends(FindMathML, _super);
    function FindMathML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FindMathML.prototype.findMath = function (node) {
        var set = new Set();
        this.findMathNodes(node, set);
        this.findMathPrefixed(node, set);
        var html = this.adaptor.root(this.adaptor.document);
        if (this.adaptor.kind(html) === 'html' && set.size === 0) {
            this.findMathNS(node, set);
        }
        return this.processMath(set);
    };
    FindMathML.prototype.findMathNodes = function (node, set) {
        try {
            for (var _a = __values(this.adaptor.tags(node, 'math')), _b = _a.next(); !_b.done; _b = _a.next()) {
                var math = _b.value;
                set.add(math);
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
    FindMathML.prototype.findMathPrefixed = function (node, set) {
        var html = this.adaptor.root(this.adaptor.document);
        try {
            for (var _a = __values(this.adaptor.allAttributes(html)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var attr = _b.value;
                if (attr.name.substr(0, 6) === 'xmlns:' && attr.value === NAMESPACE) {
                    var prefix = attr.name.substr(6);
                    try {
                        for (var _c = __values(this.adaptor.tags(node, prefix + ':math')), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var math = _d.value;
                            set.add(math);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_3, _f, e_2, _e;
    };
    FindMathML.prototype.findMathNS = function (node, set) {
        try {
            for (var _a = __values(this.adaptor.tags(node, 'math', NAMESPACE)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var math = _b.value;
                set.add(math);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var e_4, _c;
    };
    FindMathML.prototype.processMath = function (set) {
        var math = [];
        try {
            for (var _a = __values(Array.from(set)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var mml = _b.value;
                var display = (this.adaptor.getAttribute(mml, 'display') === 'block' ||
                    this.adaptor.getAttribute(mml, 'mode') === 'display');
                var start = { node: mml, n: 0, delim: '' };
                var end = { node: mml, n: 0, delim: '' };
                math.push({ math: this.adaptor.outerHTML(mml), start: start, end: end, display: display });
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return math;
        var e_5, _c;
    };
    return FindMathML;
}(FindMath_js_1.AbstractFindMath));
FindMathML.OPTIONS = {};
exports.FindMathML = FindMathML;
//# sourceMappingURL=FindMathML.js.map