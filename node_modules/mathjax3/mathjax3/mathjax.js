"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HandlerList_js_1 = require("./core/HandlerList.js");
var Retries_js_1 = require("./util/Retries.js");
exports.MathJax = {
    version: '3.0.0',
    handlers: new HandlerList_js_1.HandlerList(),
    document: function (document, options) {
        return exports.MathJax.handlers.document(document, options);
    },
    handleRetriesFor: Retries_js_1.handleRetriesFor,
    retryAfter: Retries_js_1.retryAfter
};
//# sourceMappingURL=mathjax.js.map