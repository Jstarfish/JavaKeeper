"use strict";
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
exports.V = 1;
exports.H = 2;
exports.NOSTRETCH = { dir: 0 };
var FontData = (function () {
    function FontData() {
        this.variant = {};
        this.delimiters = {};
        this.cssFontMap = {};
        this.remapChars = {};
        var CLASS = this.constructor;
        this.params = __assign({}, CLASS.defaultParams);
        this.sizeVariants = __spread(CLASS.defaultSizeVariants);
        this.cssFontMap = __assign({}, CLASS.defaultCssFonts);
        this.createVariants(CLASS.defaultVariants);
        this.defineDelimiters(CLASS.defaultDelimiters);
        try {
            for (var _a = __values(Object.keys(CLASS.defaultChars)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_1 = _b.value;
                this.defineChars(name_1, CLASS.defaultChars[name_1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _d = __values(Object.keys(CLASS.defaultVariantClasses)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var name_2 = _e.value;
                this.variant[name_2].classes = CLASS.defaultVariantClasses[name_2];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.defineRemap('accent', CLASS.defaultAccentMap);
        this.defineRemap('mo', CLASS.defaultMoMap);
        this.defineRemap('mn', CLASS.defaultMnMap);
        var e_1, _c, e_2, _f;
    }
    FontData.charOptions = function (font, n) {
        var char = font[n];
        if (char.length === 3) {
            char[3] = {};
        }
        return char[3];
    };
    FontData.prototype.createVariant = function (name, inherit, link) {
        if (inherit === void 0) { inherit = null; }
        if (link === void 0) { link = null; }
        var variant = {
            linked: [],
            chars: (inherit ? Object.create(this.variant[inherit].chars) : {})
        };
        if (link && this.variant[link]) {
            Object.assign(variant.chars, this.variant[link].chars);
            this.variant[link].linked.push(variant.chars);
            variant.chars = Object.create(variant.chars);
        }
        this.variant[name] = variant;
    };
    FontData.prototype.createVariants = function (variants) {
        try {
            for (var variants_1 = __values(variants), variants_1_1 = variants_1.next(); !variants_1_1.done; variants_1_1 = variants_1.next()) {
                var variant = variants_1_1.value;
                this.createVariant(variant[0], variant[1], variant[2]);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (variants_1_1 && !variants_1_1.done && (_a = variants_1.return)) _a.call(variants_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_3, _a;
    };
    FontData.prototype.defineChars = function (name, chars) {
        var variant = this.variant[name];
        Object.assign(variant.chars, chars);
        try {
            for (var _a = __values(variant.linked), _b = _a.next(); !_b.done; _b = _a.next()) {
                var link = _b.value;
                Object.assign(link, chars);
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
    FontData.prototype.defineDelimiters = function (delims) {
        Object.assign(this.delimiters, delims);
    };
    FontData.prototype.defineRemap = function (name, remap) {
        if (!this.remapChars.hasOwnProperty(name)) {
            this.remapChars[name] = {};
        }
        Object.assign(this.remapChars[name], remap);
    };
    FontData.prototype.getDelimiter = function (n) {
        return this.delimiters[n];
    };
    FontData.prototype.getSizeVariant = function (n, i) {
        if (this.delimiters[n].variants) {
            i = this.delimiters[n].variants[i];
        }
        return this.sizeVariants[i];
    };
    FontData.prototype.getChar = function (name, n) {
        return this.variant[name].chars[n];
    };
    FontData.prototype.getVariant = function (name) {
        return this.variant[name];
    };
    FontData.prototype.getCssFont = function (variant) {
        return this.cssFontMap[variant] || ['serif', false, false];
    };
    FontData.prototype.getRemappedChar = function (name, c) {
        var map = this.remapChars[name] || {};
        return map[c];
    };
    FontData.prototype.char = function (n, escape) {
        if (escape === void 0) { escape = false; }
        return (n >= 0x20 && n <= 0x7E && n !== 0x22 && n !== 0x27 && n !== 0x5C ?
            String.fromCharCode(n) : (escape ? '\\' : '') + n.toString(16).toUpperCase());
    };
    return FontData;
}());
FontData.OPTIONS = {};
FontData.defaultVariants = [
    ['normal'],
    ['bold', 'normal'],
    ['italic', 'normal'],
    ['bold-italic', 'italic', 'bold'],
    ['double-struck', 'bold'],
    ['fraktur', 'normal'],
    ['bold-fraktur', 'bold', 'fraktur'],
    ['script', 'normal'],
    ['bold-script', 'bold', 'script'],
    ['sans-serif', 'normal'],
    ['bold-sans-serif', 'bold', 'sans-serif'],
    ['sans-serif-italic', 'italic', 'sans-serif'],
    ['bold-sans-serif-italic', 'bold-italic', 'sans-serif'],
    ['monospace', 'normal']
];
FontData.defaultCssFonts = {
    normal: ['serif', false, false],
    bold: ['serif', false, true],
    italic: ['serif', true, false],
    'bold-italic': ['serif', true, true],
    'double-struck': ['serif', false, true],
    fraktur: ['serif', false, false],
    'bold-fraktur': ['serif', false, true],
    script: ['cursive', false, false],
    'bold-script': ['cursive', false, true],
    'sans-serif': ['sans-serif', false, false],
    'bold-sans-serif': ['sans-serif', false, true],
    'sans-serif-italic': ['sans-serif', true, false],
    'bold-sans-serif-italic': ['sans-serif', true, true],
    monospace: ['monospace', false, false]
};
FontData.defaultAccentMap = {
    0x0300: '\u02CB',
    0x0301: '\u02CA',
    0x0302: '\u02C6',
    0x0303: '\u02DC',
    0x0304: '\u02C9',
    0x0306: '\u02D8',
    0x0307: '\u02D9',
    0x0308: '\u00A8',
    0x030A: '\u02DA',
    0x030C: '\u02C7',
    0x2192: '\u20D7',
    0x2032: '\'',
    0x2033: '\'\'',
    0x2034: '\'\'\'',
    0x2035: '`',
    0x2036: '``',
    0x2037: '```',
    0x2057: '\'\'\'\'',
    0x20D0: '\u21BC',
    0x20D1: '\u21C0',
    0x20D6: '\u2190',
    0x20E1: '\u2194',
    0x20F0: '*',
    0x20DB: '...',
    0x20DC: '....',
    0x20EC: '\u21C1',
    0x20ED: '\u21BD',
    0x20EE: '\u2190',
    0x20EF: '\u2192'
};
FontData.defaultMoMap = {
    0x002D: '\u2212'
};
FontData.defaultMnMap = {
    0x002D: '\u2212'
};
FontData.defaultParams = {
    x_height: .442,
    quad: 1,
    num1: .676,
    num2: .394,
    num3: .444,
    denom1: .686,
    denom2: .345,
    sup1: .413,
    sup2: .363,
    sup3: .289,
    sub1: .15,
    sub2: .247,
    sup_drop: .386,
    sub_drop: .05,
    delim1: 2.39,
    delim2: 1.0,
    axis_height: .25,
    rule_thickness: .06,
    big_op_spacing1: .111,
    big_op_spacing2: .167,
    big_op_spacing3: .2,
    big_op_spacing4: .6,
    big_op_spacing5: .1,
    surd_height: .075,
    scriptspace: .05,
    nulldelimiterspace: .12,
    delimiterfactor: 901,
    delimitershortfall: .3,
    min_rule_thickness: 1.25
};
FontData.defaultDelimiters = {};
FontData.defaultChars = {};
FontData.defaultSizeVariants = [];
FontData.defaultVariantClasses = {};
exports.FontData = FontData;
//# sourceMappingURL=FontData.js.map