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
var tex_js_1 = require("../../common/fonts/tex.js");
var Options_js_1 = require("../../../util/Options.js");
var bold_italic_js_1 = require("./tex/bold-italic.js");
var bold_js_1 = require("./tex/bold.js");
var double_struck_js_1 = require("./tex/double-struck.js");
var fraktur_bold_js_1 = require("./tex/fraktur-bold.js");
var fraktur_js_1 = require("./tex/fraktur.js");
var italic_js_1 = require("./tex/italic.js");
var largeop_js_1 = require("./tex/largeop.js");
var monospace_js_1 = require("./tex/monospace.js");
var normal_js_1 = require("./tex/normal.js");
var sans_serif_bold_italic_js_1 = require("./tex/sans-serif-bold-italic.js");
var sans_serif_bold_js_1 = require("./tex/sans-serif-bold.js");
var sans_serif_italic_js_1 = require("./tex/sans-serif-italic.js");
var sans_serif_js_1 = require("./tex/sans-serif.js");
var script_bold_js_1 = require("./tex/script-bold.js");
var script_js_1 = require("./tex/script.js");
var smallop_js_1 = require("./tex/smallop.js");
var tex_caligraphic_bold_js_1 = require("./tex/tex-caligraphic-bold.js");
var tex_caligraphic_js_1 = require("./tex/tex-caligraphic.js");
var tex_mathit_js_1 = require("./tex/tex-mathit.js");
var tex_oldstyle_bold_js_1 = require("./tex/tex-oldstyle-bold.js");
var tex_oldstyle_js_1 = require("./tex/tex-oldstyle.js");
var tex_size3_js_1 = require("./tex/tex-size3.js");
var tex_size4_js_1 = require("./tex/tex-size4.js");
var tex_variant_js_1 = require("./tex/tex-variant.js");
var delimiters_js_1 = require("../../common/fonts/tex/delimiters.js");
var TeXFont = (function (_super) {
    __extends(TeXFont, _super);
    function TeXFont(options) {
        if (options === void 0) { options = null; }
        var _this = _super.call(this) || this;
        var CLASS = _this.constructor;
        _this.options = Options_js_1.userOptions(Options_js_1.defaultOptions({}, CLASS.OPTIONS), options);
        return _this;
    }
    Object.defineProperty(TeXFont.prototype, "styles", {
        get: function () {
            var CLASS = this.constructor;
            var styles = __assign({}, CLASS.defaultStyles);
            this.addFontURLs(styles, CLASS.defaultFonts, this.options.fontURL);
            try {
                for (var _a = __values(Object.keys(this.delimiters)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var n = _b.value;
                    var N = parseInt(n);
                    this.addDelimiterStyles(styles, N, this.delimiters[N]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.addVariantChars(styles);
            return styles;
            var e_1, _c;
        },
        enumerable: true,
        configurable: true
    });
    TeXFont.prototype.addVariantChars = function (styles) {
        try {
            for (var _a = __values(Object.keys(this.variant)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_1 = _b.value;
                var variant = this.variant[name_1];
                var vclass = (name_1 === 'normal' ? '' : ' .' + variant.classes.replace(/ /g, '.'));
                try {
                    for (var _c = __values(Object.keys(variant.chars)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var n = _d.value;
                        var N = parseInt(n);
                        if (variant.chars[N].length === 4) {
                            this.addCharStyles(styles, vclass, N, variant.chars[N]);
                        }
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
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_3, _f, e_2, _e;
    };
    TeXFont.prototype.addFontURLs = function (styles, fonts, url) {
        try {
            for (var _a = __values(Object.keys(fonts)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_2 = _b.value;
                var font = __assign({}, fonts[name_2]);
                font.src = font.src.replace(/%%URL%%/, url);
                styles[name_2] = font;
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
    TeXFont.prototype.addDelimiterStyles = function (styles, n, data) {
        var c = this.char(n);
        if (data.c && data.c !== n) {
            styles['.MJX-TEX .mjx-stretched mjx-c[c="' + c + '"]::before'] = {
                content: '"' + this.char(data.c, true) + '"'
            };
        }
        if (!data.stretch)
            return;
        if (data.dir === 1) {
            this.addDelimiterVStyles(styles, c, data);
        }
        else {
            this.addDelimiterHStyles(styles, c, data);
        }
    };
    TeXFont.prototype.addDelimiterVStyles = function (styles, c, data) {
        var W = data.HDW[2];
        var _a = __read(data.stretch, 4), beg = _a[0], ext = _a[1], end = _a[2], mid = _a[3];
        var Hb = this.addDelimiterVPart(styles, c, W, 'beg', beg);
        this.addDelimiterVPart(styles, c, W, 'ext', ext);
        var He = this.addDelimiterVPart(styles, c, W, 'end', end);
        var css = {};
        if (mid) {
            var Hm = this.addDelimiterVPart(styles, c, W, 'mid', mid);
            css.height = '50%';
            styles['.MJX-TEX mjx-stretchy-v[c="' + c + '"] > mjx-mid'] = {
                'margin-top': this.em(-Hm / 2),
                'margin-bottom': this.em(-Hm / 2)
            };
        }
        if (Hb) {
            css['border-top-width'] = this.em0(Hb - .03);
        }
        if (He) {
            css['border-bottom-width'] = this.em0(He - .03);
            styles['.MJX-TEX mjx-stretchy-v[c="' + c + '"] > mjx-end'] = { 'margin-top': this.em(-He) };
        }
        if (Object.keys(css).length) {
            styles['.MJX-TEX mjx-stretchy-v[c="' + c + '"] > mjx-ext'] = css;
        }
    };
    TeXFont.prototype.addDelimiterVPart = function (styles, c, W, part, n) {
        if (!n)
            return 0;
        var data = this.getDelimiterData(n);
        var dw = (W - data[2]) / 2;
        var css = { content: '"' + this.char(n, true) + '"', width: this.em0(W - dw) };
        if (part !== 'ext') {
            css.padding = this.em0(data[0]) + ' 0 ' + this.em0(data[1]) + (dw ? ' ' + this.em0(dw) : '');
        }
        else if (dw) {
            css['padding-left'] = this.em0(dw);
        }
        styles['.MJX-TEX mjx-stretchy-v[c="' + c + '"] mjx-' + part + ' mjx-c::before'] = css;
        return data[0] + data[1];
    };
    TeXFont.prototype.addDelimiterHStyles = function (styles, c, data) {
        var _a = __read(data.stretch, 4), beg = _a[0], ext = _a[1], end = _a[2], mid = _a[3];
        this.addDelimiterHPart(styles, c, 'beg', beg);
        this.addDelimiterHPart(styles, c, 'ext', ext, !(beg || end));
        this.addDelimiterHPart(styles, c, 'end', end);
        if (mid) {
            this.addDelimiterHPart(styles, c, 'mid', mid);
            styles['.MJX-TEX mjx-stretchy-h[c="' + c + '"] > mjx-ext'] = { width: '50%' };
        }
    };
    TeXFont.prototype.addDelimiterHPart = function (styles, c, part, n, force) {
        if (force === void 0) { force = false; }
        if (!n) {
            return 0;
        }
        var data = this.getDelimiterData(n);
        var options = data[3];
        var C = (options && options.c ? options.c : this.char(n, true));
        var css = { content: '"' + C + '"' };
        if (part !== 'ext' || force) {
            css.padding = this.em0(data[0]) + ' 0 ' + this.em0(data[1]);
        }
        styles['.MJX-TEX mjx-stretchy-h[c="' + c + '"] mjx-' + part + ' mjx-c::before'] = css;
    };
    TeXFont.prototype.addCharStyles = function (styles, vclass, n, data) {
        var _a = __read(data, 4), h = _a[0], d = _a[1], w = _a[2], options = _a[3];
        var css = {};
        if (options.css) {
            if (options.css & 1) {
                css.width = this.em(w);
            }
            if (options.css & 2) {
                css.padding = this.em0(h) + ' 0 ' + this.em0(d);
            }
            if (options.css & 4) {
                css.content = '"' + (options.c || this.char(n, true)) + '"';
            }
        }
        if (options.f !== undefined)
            css['font-family'] = 'MJXZERO, MJXTEX' + (options.f ? '-' + options.f : '');
        var char = vclass + ' mjx-c[c="' + this.char(n) + '"]';
        styles['.MJX-TEX' + char + '::before'] = css;
        if (options.ic) {
            var _b = __read(['.MJX-TEX mjx-', ':not([noIC="true"])' + char.substr(1) + ':last-child::before'], 2), MJX = _b[0], noIC = _b[1];
            styles[MJX + 'mi' + noIC] =
                styles[MJX + 'mo' + noIC] = {
                    width: this.em(w + options.ic)
                };
        }
    };
    return TeXFont;
}(tex_js_1.CommonTeXFont));
TeXFont.OPTIONS = {
    fontURL: 'mathjax2/css/'
};
TeXFont.defaultVariantClasses = {
    'normal': 'mjx-n',
    'bold': 'mjx-b',
    'italic': 'mjx-i',
    'bold-italic': 'mjx-b mjx-i',
    'double-struck': 'mjx-ds',
    'fraktur': 'mjx-fr',
    'bold-fraktur': 'mjx-fr mjx-b',
    'script': 'mjx-sc',
    'bold-script': 'mjx-sc mjx-b',
    'sans-serif': 'mjx-ss',
    'bold-sans-serif': 'mjx-ss mjx-b',
    'sans-serif-italic': 'mjx-ss mjx-i',
    'bold-sans-serif-italic': 'mjx-ss mjx-b mjx-i',
    'monospace': 'mjx-ty',
    '-smallop': 'mjx-sop',
    '-largeop': 'mjx-lop',
    '-size3': 'mjx-s3',
    '-size4': 'mjx-s4',
    '-tex-caligraphic': 'mjx-cal',
    '-tex-bold-caligraphic': 'mjx-cal mjx-b',
    '-tex-mathit': 'mjx-mit',
    '-tex-oldstyle': 'mjx-os',
    '-tex-bold-oldstyle': 'mjx-os mjx-b',
    '-tex-variant': 'mjx-v'
};
TeXFont.defaultDelimiters = delimiters_js_1.delimiters;
TeXFont.defaultChars = {
    'normal': normal_js_1.normal,
    'bold': bold_js_1.bold,
    'italic': italic_js_1.italic,
    'bold-italic': bold_italic_js_1.boldItalic,
    'double-struck': double_struck_js_1.doubleStruck,
    'fraktur': fraktur_js_1.fraktur,
    'bold-fraktur': fraktur_bold_js_1.frakturBold,
    'script': script_js_1.script,
    'bold-script': script_bold_js_1.scriptBold,
    'sans-serif': sans_serif_js_1.sansSerif,
    'bold-sans-serif': sans_serif_bold_js_1.sansSerifBold,
    'sans-serif-italic': sans_serif_italic_js_1.sansSerifItalic,
    'bold-sans-serif-italic': sans_serif_bold_italic_js_1.sansSerifBoldItalic,
    'monospace': monospace_js_1.monospace,
    '-smallop': smallop_js_1.smallop,
    '-largeop': largeop_js_1.largeop,
    '-size3': tex_size3_js_1.texSize3,
    '-size4': tex_size4_js_1.texSize4,
    '-tex-caligraphic': tex_caligraphic_js_1.texCaligraphic,
    '-tex-bold-caligraphic': tex_caligraphic_bold_js_1.texCaligraphicBold,
    '-tex-mathit': tex_mathit_js_1.texMathit,
    '-tex-oldstyle': tex_oldstyle_js_1.texOldstyle,
    '-tex-bold-oldstyle': tex_oldstyle_bold_js_1.texOldstyleBold,
    '-tex-variant': tex_variant_js_1.texVariant
};
TeXFont.defaultStyles = {
    '.MJX-TEX .mjx-n mjx-c': {
        'font-family': 'MJXZERO, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-i mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-b mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-b.mjx-i mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-BI, MJXTEX-B, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-cal mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-C, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-cal.mjx-b mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-C-B, MJXTEX-C, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-ds mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-A, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1'
    },
    '.MJX-TEX .mjx-fr mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-FR, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-fr.mjx-b mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-FR-B, MJXTEX-FR, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-sc mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-SC, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-sc.mjx-b mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-SC-B, MJXTEX-SC, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-ss mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-SS, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-ss.mjx-b mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-SS-B, MJXTEX-SS, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-ss.mjx-i mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-SS-I, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-ss.mjx-b.mjx-i mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-SS-B, MJXTEX-SS-I, MJXTEX-BI, MJXTEX-B, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-ty mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-T, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-var mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-A, MJXTEX, MJXTEX-I, MJXTEX-S1'
    },
    '.MJX-TEX .mjx-os mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-C, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-os.mjx-b mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-C-B, MJXTEX-C, MJXTEX-B, MJXTEX-BI, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-mit mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-MI, MJXTEX-I, MJXTEX, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-lop mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-S2, MJXTEX-S1, MJXTEX, MJXTEX-I, MJXTEX-A'
    },
    '.MJX-TEX .mjx-sop mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-S1, MJXTEX, MJXTEX-I, MJXTEX-A'
    },
    '.MJX-TEX .mjx-s3 mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-S3, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX .mjx-s4 mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-S4, MJXTEX, MJXTEX-I, MJXTEX-S1, MJXTEX-A'
    },
    '.MJX-TEX': {
        'font-family': 'MJXZERO'
    },
    '.MJX-TEX mjx-stretchy-v mjx-c, .MJX-TEX mjx-stretchy-h mjx-c': {
        'font-family': 'MJXZERO, MJXTEX-S1, MJXTEX-S4, MJXTEX, MJXTEX-A ! important'
    }
};
TeXFont.defaultFonts = {
    '@font-face /* 0 */': {
        'font-family': 'MJXZERO',
        src: 'url("%%URL%%/otf/MathJax_Zero.otf") format("opentype")'
    },
    '@font-face /* 1 */': {
        'font-family': 'MJXTEX',
        src: 'url("%%URL%%/woff/MathJax_Main-Regular.woff") format("woff")'
    },
    '@font-face /* 2 */': {
        'font-family': 'MJXTEX-B',
        src: 'url("%%URL%%/woff/MathJax_Main-Bold.woff") format("woff")'
    },
    '@font-face /* 3 */': {
        'font-family': 'MJXTEX-MI',
        src: 'url("%%URL%%/woff/MathJax_Main-Italic.woff") format("woff")'
    },
    '@font-face /* 4 */': {
        'font-family': 'MJXTEX-I',
        src: 'url("%%URL%%/woff/MathJax_Math-Italic.woff") format("woff")'
    },
    '@font-face /* 5 */': {
        'font-family': 'MJXTEX-BI',
        src: 'url("%%URL%%/woff/MathJax_Math-BoldItalic.woff") format("woff")'
    },
    '@font-face /* 6 */': {
        'font-family': 'MJXTEX-S1',
        src: 'url("%%URL%%/woff/MathJax_Size1-Regular.woff") format("woff")'
    },
    '@font-face /* 7 */': {
        'font-family': 'MJXTEX-S2',
        src: 'url("%%URL%%/woff/MathJax_Size2-Regular.woff") format("woff")'
    },
    '@font-face /* 8 */': {
        'font-family': 'MJXTEX-S3',
        src: 'url("%%URL%%/woff/MathJax_Size3-Regular.woff") format("woff")'
    },
    '@font-face /* 9 */': {
        'font-family': 'MJXTEX-S4',
        src: 'url("%%URL%%/woff/MathJax_Size4-Regular.woff") format("woff")'
    },
    '@font-face /* 10 */': {
        'font-family': 'MJXTEX-A',
        src: 'url("%%URL%%/woff/MathJax_AMS-Regular.woff") format("woff")'
    },
    '@font-face /* 11 */': {
        'font-family': 'MJXTEX-C',
        src: 'url("%%URL%%/woff/MathJax_Caligraphic-Regular.woff") format("woff")'
    },
    '@font-face /* 12 */': {
        'font-family': 'MJXTEX-C-B',
        src: 'url("%%URL%%/woff/MathJax_Caligraphic-Bold.woff") format("woff")'
    },
    '@font-face /* 13 */': {
        'font-family': 'MJXTEX-FR',
        src: 'url("%%URL%%/woff/MathJax_Fraktur-Regular.woff") format("woff")'
    },
    '@font-face /* 14 */': {
        'font-family': 'MJXTEX-FR-B',
        src: 'url("%%URL%%/woff/MathJax_Fraktur-Bold.woff") format("woff")'
    },
    '@font-face /* 15 */': {
        'font-family': 'MJXTEX-SS',
        src: 'url("%%URL%%/woff/MathJax_SansSerif-Regular.woff") format("woff")'
    },
    '@font-face /* 16 */': {
        'font-family': 'MJXTEX-SS-B',
        src: 'url("%%URL%%/woff/MathJax_SansSerif-Bold.woff") format("woff")'
    },
    '@font-face /* 17 */': {
        'font-family': 'MJXTEX-SS-I',
        src: 'url("%%URL%%/woff/MathJax_SansSerif-Italic.woff") format("woff")'
    },
    '@font-face /* 18 */': {
        'font-family': 'MJXTEX-SC',
        src: 'url("%%URL%%/woff/MathJax_Script-Regular.woff") format("woff")'
    },
    '@font-face /* 19 */': {
        'font-family': 'MJXTEX-T',
        src: 'url("%%URL%%/woff/MathJax_Typewriter-Regular.woff") format("woff")'
    },
    '@font-face /* 20 */': {
        'font-family': 'MJXTEX-V',
        src: 'url("%%URL%%/woff/MathJax_Vector-Regular.woff") format("woff")'
    },
    '@font-face /* 21 */': {
        'font-family': 'MJXTEX-VB',
        src: 'url("%%URL%%/woff/MathJax_Vector-Bold.woff") format("woff")'
    },
};
exports.TeXFont = TeXFont;
//# sourceMappingURL=tex.js.map