"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
require("./PhysicsMappings.js");
exports.PhysicsConfiguration = Configuration_js_1.Configuration.create('physics', {
    handler: {
        macro: [
            'Physics-automatic-bracing-macros',
            'Physics-expressions-macros',
            'Physics-quick-quad-macros'
        ]
    }
});
//# sourceMappingURL=PhysicsConfiguration.js.map