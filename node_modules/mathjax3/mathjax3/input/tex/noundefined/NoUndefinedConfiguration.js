"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
function noUndefined(parser, name) {
    var textNode = parser.create('text', '\\' + name);
    parser.Push(parser.create('node', 'mtext', [], { mathcolor: 'red' }, textNode));
}
;
exports.NoUndefinedConfiguration = Configuration_js_1.Configuration.create('noundefined', { fallback: { macro: noUndefined } });
//# sourceMappingURL=NoUndefinedConfiguration.js.map