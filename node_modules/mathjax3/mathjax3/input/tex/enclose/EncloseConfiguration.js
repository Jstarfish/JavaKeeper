"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var ParseUtil_js_1 = require("../ParseUtil.js");
var ALLOWED = {
    arrow: 1,
    color: 1, mathcolor: 1,
    background: 1, mathbackground: 1,
    padding: 1,
    thickness: 1
};
exports.EncloseMethods = {};
exports.EncloseMethods.Enclose = function (parser, name) {
    var notation = parser.GetArgument(name).replace(/,/g, ' ');
    var attr = parser.GetBrackets(name, '');
    var math = parser.ParseArg(name);
    var def = ParseUtil_js_1.default.splitPackageOptions(attr, ALLOWED);
    def.notation = notation;
    if (def.arrow) {
        def.notation += ' updiagonalarrow';
        delete def.arrow;
    }
    parser.Push(parser.create('node', 'menclose', [math], def));
};
new SymbolMap_js_1.CommandMap('enclose', { enclose: 'Enclose' }, exports.EncloseMethods);
exports.EncloseConfiguration = Configuration_js_1.Configuration.create('enclose', { handler: { macro: ['enclose'] } });
//# sourceMappingURL=EncloseConfiguration.js.map