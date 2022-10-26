"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var NewcommandItems_js_1 = require("./NewcommandItems.js");
require("./NewcommandMappings.js");
exports.NewcommandConfiguration = Configuration_js_1.Configuration.create('newcommand', { handler: {
        macro: ['Newcommand-macros']
    },
    items: (_a = {},
        _a[NewcommandItems_js_1.BeginEnvItem.prototype.kind] = NewcommandItems_js_1.BeginEnvItem,
        _a),
    options: { maxMacros: 1000 }
});
var _a;
//# sourceMappingURL=NewcommandConfiguration.js.map