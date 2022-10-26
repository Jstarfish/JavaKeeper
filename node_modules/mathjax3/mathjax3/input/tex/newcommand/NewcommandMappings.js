"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NewcommandMethods_js_1 = require("./NewcommandMethods.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
new SymbolMap_js_1.CommandMap('Newcommand-macros', {
    newcommand: 'NewCommand',
    renewcommand: 'NewCommand',
    newenvironment: 'NewEnvironment',
    renewenvironment: 'NewEnvironment',
    def: 'MacroDef',
    'let': 'Let'
}, NewcommandMethods_js_1.default);
//# sourceMappingURL=NewcommandMappings.js.map