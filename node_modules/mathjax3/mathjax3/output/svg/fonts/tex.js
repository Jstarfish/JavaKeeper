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
Object.defineProperty(exports, "__esModule", { value: true });
var FontData_js_1 = require("../FontData.js");
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
    function TeXFont() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TeXFont.prototype, "styles", {
        get: function () {
            return {};
        },
        enumerable: true,
        configurable: true
    });
    return TeXFont;
}(FontData_js_1.FontData));
TeXFont.defaultVariants = FontData_js_1.FontData.defaultVariants.concat([
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
TeXFont.defaultDelimiters = delimiters_js_1.delimiters;
TeXFont.defaultSizeVariants = ['normal', '-smallop', '-largeop', '-size3', '-size4'];
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
exports.TeXFont = TeXFont;
//# sourceMappingURL=tex.js.map