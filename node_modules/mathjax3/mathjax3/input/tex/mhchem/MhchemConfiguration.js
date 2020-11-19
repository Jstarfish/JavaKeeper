"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var TexError_js_1 = require("../TexError.js");
var BaseMethods_js_1 = require("../base/BaseMethods.js");
var AmsMethods_js_1 = require("../ams/AmsMethods.js");
require("./mhchem_parser.js");
var MhchemMethods = {};
MhchemMethods.Macro = BaseMethods_js_1.default.Macro;
MhchemMethods.xArrow = AmsMethods_js_1.default.xArrow;
MhchemMethods.Machine = function (parser, name, machine) {
    try {
        var arg = parser.GetArgument(name);
        var data = mhchemParser.go(arg, machine);
        var tex = texify.go(data);
        parser.string = tex + parser.string.substr(parser.i);
        parser.i = 0;
    }
    catch (err) {
        throw new TexError_js_1.default(err[0], err[1], err.slice(2));
    }
};
new SymbolMap_js_1.CommandMap('mhchem', { ce: ['Machine', 'ce'],
    pu: ['Machine', 'pu'],
    longrightleftharpoons: ['Macro',
        '\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}'],
    longRightleftharpoons: ['Macro',
        '\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{\\leftharpoondown}}'],
    longLeftrightharpoons: ['Macro',
        '\\stackrel{\\textstyle\\vphantom{{-}}{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}'],
    longleftrightarrows: ['Macro',
        '\\stackrel{\\longrightarrow}{\\smash{\\longleftarrow}\\Rule{0px}{.25em}{0px}}'],
    tripledash: ['Macro',
        '\\vphantom{-}\\raise2mu{\\kern2mu\\tiny\\text{-}\\kern1mu\\text{-}\\kern1mu\\text{-}\\kern2mu}'],
    xrightarrow: ['xArrow', 0x2192, 5, 6],
    xleftarrow: ['xArrow', 0x2190, 7, 3],
    xleftrightarrow: ['xArrow', 0x2194, 6, 6],
    xrightleftharpoons: ['xArrow', 0x21CC, 5, 7],
    xRightleftharpoons: ['xArrow', 0x21CC, 5, 7],
    xLeftrightharpoons: ['xArrow', 0x21CC, 5, 7]
}, MhchemMethods);
exports.MhchemConfiguration = Configuration_js_1.Configuration.create('mhchem', { handler: { macro: ['mhchem'] } });
//# sourceMappingURL=MhchemConfiguration.js.map