"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sm = require("../SymbolMap.js");
var ParseMethods_js_1 = require("../ParseMethods.js");
var AmsCdMethods_js_1 = require("./AmsCdMethods.js");
new sm.EnvironmentMap('amsCd_environment', ParseMethods_js_1.default.environment, { CD: 'CD' }, AmsCdMethods_js_1.default);
new sm.CommandMap('amsCd_macros', {
    minwidth: 'minwidth',
    minheight: 'minheight',
}, AmsCdMethods_js_1.default);
new sm.MacroMap('amsCd_special', { '@': 'arrow' }, AmsCdMethods_js_1.default);
//# sourceMappingURL=AmsCdMappings.js.map