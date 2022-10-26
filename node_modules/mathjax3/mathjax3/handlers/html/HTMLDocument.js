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
var MathDocument_js_1 = require("../../core/MathDocument.js");
var Options_js_1 = require("../../util/Options.js");
var HTMLMathItem_js_1 = require("./HTMLMathItem.js");
var HTMLMathList_js_1 = require("./HTMLMathList.js");
var HTMLDomStrings_js_1 = require("./HTMLDomStrings.js");
var HTMLDocument = (function (_super) {
    __extends(HTMLDocument, _super);
    function HTMLDocument(document, adaptor, options) {
        var _this = this;
        var _a = __read(Options_js_1.separateOptions(options, HTMLDomStrings_js_1.HTMLDomStrings.OPTIONS), 2), html = _a[0], dom = _a[1];
        _this = _super.call(this, document, adaptor, html) || this;
        _this.domStrings = _this.options['DomStrings'] || new HTMLDomStrings_js_1.HTMLDomStrings(dom);
        _this.domStrings.adaptor = adaptor;
        return _this;
    }
    HTMLDocument.prototype.findPosition = function (N, index, delim, nodes) {
        try {
            for (var _a = __values(nodes[N]), _b = _a.next(); !_b.done; _b = _a.next()) {
                var list = _b.value;
                var _c = __read(list, 2), node = _c[0], n = _c[1];
                if (index <= n) {
                    return { node: node, n: index, delim: delim };
                }
                index -= n;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return { node: null, n: 0, delim: delim };
        var e_1, _d;
    };
    HTMLDocument.prototype.mathItem = function (item, jax, nodes) {
        var math = item.math;
        var start = this.findPosition(item.n, item.start.n, item.open, nodes);
        var end = this.findPosition(item.n, item.end.n, item.close, nodes);
        return new this.options.MathItem(math, jax, item.display, start, end);
    };
    HTMLDocument.prototype.findMath = function (options) {
        if (!this.processed.isSet('findMath')) {
            this.adaptor.document = this.document;
            options = Options_js_1.userOptions({ elements: [this.adaptor.body(this.document)] }, options);
            try {
                for (var _a = __values(this.adaptor.getElements(options['elements'], this.document)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var container = _b.value;
                    var _c = __read([null, null], 2), strings = _c[0], nodes = _c[1];
                    try {
                        for (var _d = __values(this.inputJax), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var jax = _e.value;
                            var list = new (this.options['MathList'])();
                            if (jax.processStrings) {
                                if (strings === null) {
                                    _f = __read(this.domStrings.find(container), 2), strings = _f[0], nodes = _f[1];
                                }
                                try {
                                    for (var _g = __values(jax.findMath(strings)), _h = _g.next(); !_h.done; _h = _g.next()) {
                                        var math = _h.value;
                                        list.push(this.mathItem(math, jax, nodes));
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_h && !_h.done && (_j = _g.return)) _j.call(_g);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                            }
                            else {
                                try {
                                    for (var _k = __values(jax.findMath(container)), _l = _k.next(); !_l.done; _l = _k.next()) {
                                        var math = _l.value;
                                        var item = new this.options.MathItem(math.math, jax, math.display, math.start, math.end);
                                        list.push(item);
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_l && !_l.done && (_m = _k.return)) _m.call(_k);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                            }
                            this.math.merge(list);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_o = _d.return)) _o.call(_d);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_p = _a.return)) _p.call(_a);
                }
                finally { if (e_5) throw e_5.error; }
            }
            this.processed.set('findMath');
        }
        return this;
        var e_5, _p, e_4, _o, _f, e_2, _j, e_3, _m;
    };
    HTMLDocument.prototype.updateDocument = function () {
        if (!this.processed.isSet('updateDocument')) {
            _super.prototype.updateDocument.call(this);
            var sheet = this.documentStyleSheet();
            if (sheet) {
                var head = this.adaptor.head(this.document);
                var styles = this.findSheet(head, this.adaptor.getAttribute(sheet, 'id'));
                if (styles) {
                    this.adaptor.replace(sheet, styles);
                }
                else {
                    this.adaptor.append(head, sheet);
                }
            }
            this.processed.set('updateDocument');
        }
        return this;
    };
    HTMLDocument.prototype.findSheet = function (head, id) {
        if (id) {
            try {
                for (var _a = __values(this.adaptor.tags(head, 'style')), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var sheet = _b.value;
                    if (this.adaptor.getAttribute(sheet, 'id') === id) {
                        return sheet;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        return null;
        var e_6, _c;
    };
    HTMLDocument.prototype.removeFromDocument = function (restore) {
        if (restore === void 0) { restore = false; }
        if (this.processed.isSet('updateDocument')) {
            try {
                for (var _a = __values(this.math), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var math = _b.value;
                    if (math.state() >= STATE.INSERTED) {
                        math.state(STATE.TYPESET, restore);
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        this.processed.clear('updateDocument');
        return this;
        var e_7, _c;
    };
    HTMLDocument.prototype.documentStyleSheet = function () {
        return this.outputJax.styleSheet(this);
    };
    HTMLDocument.prototype.TestMath = function (text, display) {
        if (display === void 0) { display = true; }
        if (!this.processed.isSet('TestMath')) {
            var math = new this.options.MathItem(text, this.inputJax[0], display);
            math.setMetrics(16, 8, 1000000, 1000000, 1);
            this.math.push(math);
            this.processed.set('TestMath');
        }
        return this;
    };
    return HTMLDocument;
}(MathDocument_js_1.AbstractMathDocument));
HTMLDocument.KIND = 'HTML';
HTMLDocument.OPTIONS = __assign({}, MathDocument_js_1.AbstractMathDocument.OPTIONS, { MathList: HTMLMathList_js_1.HTMLMathList, MathItem: HTMLMathItem_js_1.HTMLMathItem, DomStrings: null });
HTMLDocument.STATE = MathDocument_js_1.AbstractMathDocument.STATE;
exports.HTMLDocument = HTMLDocument;
MathDocument_js_1.AbstractMathDocument.ProcessBits.allocate('TestMath');
var STATE = HTMLDocument.STATE;
//# sourceMappingURL=HTMLDocument.js.map