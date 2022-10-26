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
var DELTA = 1.5;
function CommonScriptbaseMixin(Base) {
    return _a = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, __spread(args)) || this;
                var core = _this.baseCore = _this.childNodes[0];
                if (!core)
                    return _this;
                while (core.childNodes.length === 1 &&
                    (core.node.isKind('mrow') || core.node.isKind('TeXAtom') ||
                        core.node.isKind('mstyle') || core.node.isKind('mpadded') ||
                        core.node.isKind('mphantom') || core.node.isKind('semantics'))) {
                    core = core.childNodes[0];
                    if (!core)
                        return _this;
                }
                if (!('noIC' in core))
                    return _this;
                _this.baseCore = core;
                if (!_this.constructor.useIC) {
                    core.noIC = true;
                }
                return _this;
            }
            Object.defineProperty(class_1.prototype, "baseChild", {
                get: function () {
                    return this.childNodes[this.node.base];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(class_1.prototype, "script", {
                get: function () {
                    return this.childNodes[1];
                },
                enumerable: true,
                configurable: true
            });
            class_1.prototype.computeBBox = function (bbox, recompute) {
                if (recompute === void 0) { recompute = false; }
                var basebox = this.baseChild.getBBox();
                var scriptbox = this.script.getBBox();
                var _a = __read(this.getOffset(basebox, scriptbox), 2), x = _a[0], y = _a[1];
                bbox.append(basebox);
                bbox.combine(scriptbox, bbox.w + x, y);
                bbox.w += this.font.params.scriptspace;
                bbox.clean();
                this.setChildPWidths(recompute);
            };
            class_1.prototype.coreIC = function () {
                var corebox = this.baseCore.getBBox();
                return (corebox.ic ? 1.2 * corebox.ic + .05 : 0);
            };
            class_1.prototype.isCharBase = function () {
                var base = this.baseChild;
                if ((base.node.isKind('mstyle') || base.node.isKind('mrow')) && base.childNodes.length === 1) {
                    base = base.childNodes[0];
                }
                return ((base.node.isKind('mo') || base.node.isKind('mi') || base.node.isKind('mn')) &&
                    base.bbox.rscale === 1 && base.getText().length === 1 &&
                    !base.node.attributes.get('largeop'));
            };
            class_1.prototype.getOffset = function (bbox, sbox) {
                return [0, 0];
            };
            class_1.prototype.getV = function (bbox, sbox) {
                var tex = this.font.params;
                var subscriptshift = this.length2em(this.node.attributes.get('subscriptshift'), tex.sub1);
                return Math.max(this.isCharBase() ? 0 : bbox.d + tex.sub_drop * sbox.rscale, subscriptshift, sbox.h * sbox.rscale - (4 / 5) * tex.x_height);
            };
            class_1.prototype.getU = function (bbox, sbox) {
                var tex = this.font.params;
                var attr = this.node.attributes.getList('displaystyle', 'texprimestyle', 'superscriptshift');
                var p = (attr.displaystyle ? tex.sup1 : attr.texprimestyle ? tex.sup3 : tex.sup2);
                var superscriptshift = this.length2em(attr.superscriptshift, p);
                return Math.max(this.isCharBase() ? 0 : bbox.h - tex.sup_drop * sbox.rscale, superscriptshift, sbox.d * sbox.rscale + (1 / 4) * tex.x_height);
            };
            class_1.prototype.hasMovableLimits = function () {
                var display = this.node.attributes.get('displaystyle');
                return (!display && (this.node.getProperty('movablelimits') ||
                    this.node.attributes.get('movablelimits') ||
                    this.baseChild.coreMO().node.attributes.get('movablelimits')));
            };
            class_1.prototype.getOverKU = function (basebox, overbox) {
                var accent = this.node.attributes.get('accent');
                var tex = this.font.params;
                var d = overbox.d * overbox.rscale;
                var k = (accent ? tex.rule_thickness :
                    Math.max(tex.big_op_spacing1, tex.big_op_spacing3 - Math.max(0, d))) -
                    (this.baseChild.node.isKind('munderover') ? .1 : 0);
                return [k, basebox.h * basebox.rscale + k + d];
            };
            class_1.prototype.getUnderKV = function (basebox, underbox) {
                var accent = this.node.attributes.get('accentunder');
                var tex = this.font.params;
                var h = underbox.h * underbox.rscale;
                var k = (accent ? tex.rule_thickness :
                    Math.max(tex.big_op_spacing2, tex.big_op_spacing4 - h)) -
                    (this.baseChild.node.isKind('munderover') ? .1 : 0);
                return [k, -(basebox.d * basebox.rscale + k + h)];
            };
            class_1.prototype.getDeltaW = function (boxes, delta) {
                if (delta === void 0) { delta = [0, 0, 0]; }
                var align = this.node.attributes.get('align');
                var widths = boxes.map(function (box) { return box.w * box.rscale; });
                var w = Math.max.apply(Math, __spread(widths));
                var dw = [];
                var m = 0;
                try {
                    for (var _a = __values(widths.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var i = _b.value;
                        dw[i] = (align === 'center' ? (w - widths[i]) / 2 :
                            align === 'right' ? w - widths[i] : 0) + delta[i];
                        if (dw[i] < m) {
                            m = -dw[i];
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
                if (m) {
                    try {
                        for (var _d = __values(dw.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var i = _e.value;
                            dw[i] += m;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                return dw;
                var e_1, _c, e_2, _f;
            };
            class_1.prototype.getDelta = function (noskew) {
                if (noskew === void 0) { noskew = false; }
                var accent = this.node.attributes.get('accent');
                var ddelta = (accent && !noskew ? this.baseChild.coreMO().bbox.sk : 0);
                return DELTA * this.baseCore.bbox.ic / 2 + ddelta;
            };
            class_1.prototype.stretchChildren = function () {
                var stretchy = [];
                try {
                    for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var child = _b.value;
                        if (child.canStretch(2)) {
                            stretchy.push(child);
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
                var count = stretchy.length;
                var nodeCount = this.childNodes.length;
                if (count && nodeCount > 1) {
                    var W = 0;
                    var all = (count > 1 && count === nodeCount);
                    try {
                        for (var _d = __values(this.childNodes), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var child = _e.value;
                            var noStretch = (child.stretch.dir === 0);
                            if (all || noStretch) {
                                var _f = child.getBBox(noStretch), w = _f.w, rscale = _f.rscale;
                                if (w * rscale > W)
                                    W = w * rscale;
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_g = _d.return)) _g.call(_d);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    try {
                        for (var stretchy_1 = __values(stretchy), stretchy_1_1 = stretchy_1.next(); !stretchy_1_1.done; stretchy_1_1 = stretchy_1.next()) {
                            var child = stretchy_1_1.value;
                            child.coreMO().getStretchedVariant([W / child.bbox.rscale]);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (stretchy_1_1 && !stretchy_1_1.done && (_h = stretchy_1.return)) _h.call(stretchy_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
                var e_3, _c, e_4, _g, e_5, _h;
            };
            return class_1;
        }(Base)),
        _a.useIC = false,
        _a;
    var _a;
}
exports.CommonScriptbaseMixin = CommonScriptbaseMixin;
//# sourceMappingURL=scriptbase.js.map