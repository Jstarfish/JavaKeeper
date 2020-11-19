"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
require("./AmsCdMappings.js");
exports.AmsCdConfiguration = Configuration_js_1.Configuration.create('amsCd', { handler: {
        character: ['amsCd_special'],
        macro: ['amsCd_macros'],
        environment: ['amsCd_environment']
    },
    options: {
        colspace: '5pt',
        rowspace: '5pt',
        harrowsize: '2.75em',
        varrowsize: '1.75em',
        hideHorizontalLabels: false
    } });
//# sourceMappingURL=AmsCdConfiguration.js.map