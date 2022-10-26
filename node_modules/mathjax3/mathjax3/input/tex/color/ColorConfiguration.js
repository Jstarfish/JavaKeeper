"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SymbolMap_js_1 = require("../SymbolMap.js");
var Configuration_js_1 = require("../Configuration.js");
var ColorMethods_js_1 = require("./ColorMethods.js");
new SymbolMap_js_1.CommandMap('color', {
    color: 'Color',
    textcolor: 'TextColor',
    definecolor: 'DefineColor',
    colorbox: 'ColorBox',
    fcolorbox: 'FColorBox'
}, ColorMethods_js_1.ColorMethods);
exports.ColorConfiguration = Configuration_js_1.Configuration.create('color', {
    handler: {
        macro: ['color'],
    }, options: {
        colorPadding: '5px',
        colorBorderWidth: '2px',
    }
});
//# sourceMappingURL=ColorConfiguration.js.map