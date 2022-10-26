"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var TexConstants_js_1 = require("../TexConstants.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var ParseUtil_js_1 = require("../ParseUtil.js");
var ALLOWED = {
    color: 1, mathcolor: 1,
    background: 1, mathbackground: 1,
    padding: 1,
    thickness: 1
};
exports.CancelMethods = {};
exports.CancelMethods.Cancel = function (parser, name, notation) {
    var attr = parser.GetBrackets(name, '');
    var math = parser.ParseArg(name);
    var def = ParseUtil_js_1.default.splitPackageOptions(attr, ALLOWED);
    def['notation'] = notation;
    parser.Push(parser.create('node', 'menclose', [math], def));
};
exports.CancelMethods.CancelTo = function (parser, name) {
    var attr = parser.GetBrackets(name, '');
    var value = parser.ParseArg(name);
    var math = parser.ParseArg(name);
    var def = ParseUtil_js_1.default.splitPackageOptions(attr, ALLOWED);
    def['notation'] = TexConstants_js_1.TexConstant.Notation.UPDIAGONALSTRIKE + ' ' +
        TexConstants_js_1.TexConstant.Notation.UPDIAGONALARROW;
    value = parser.create('node', 'mpadded', [value], { depth: '-.1em', height: ' + .1em', voffset: '.1em' });
    parser.Push(parser.create('node', 'msup', [parser.create('node', 'menclose', [math], def), value]));
};
new SymbolMap_js_1.CommandMap('cancel', {
    cancel: ['Cancel', TexConstants_js_1.TexConstant.Notation.UPDIAGONALSTRIKE],
    bcancel: ['Cancel', TexConstants_js_1.TexConstant.Notation.DOWNDIAGONALSTRIKE],
    xcancel: ['Cancel', TexConstants_js_1.TexConstant.Notation.UPDIAGONALSTRIKE + ' ' +
            TexConstants_js_1.TexConstant.Notation.DOWNDIAGONALSTRIKE],
    cancelto: 'CancelTo'
}, exports.CancelMethods);
exports.CancelConfiguration = Configuration_js_1.Configuration.create('cancel', { handler: { macro: ['cancel'] } });
//# sourceMappingURL=CancelConfiguration.js.map