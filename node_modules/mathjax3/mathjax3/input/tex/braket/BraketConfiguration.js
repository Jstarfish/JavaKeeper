"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var BraketItems_js_1 = require("./BraketItems.js");
require("./BraketMappings.js");
exports.BraketConfiguration = Configuration_js_1.Configuration.create('braket', {
    handler: {
        character: ['Braket-characters'],
        macro: ['Braket-macros']
    },
    items: (_a = {},
        _a[BraketItems_js_1.BraketItem.prototype.kind] = BraketItems_js_1.BraketItem,
        _a)
});
var _a;
//# sourceMappingURL=BraketConfiguration.js.map