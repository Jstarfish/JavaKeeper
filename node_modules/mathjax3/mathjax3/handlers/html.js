"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mathjax_js_1 = require("../mathjax.js");
var HTMLHandler_js_1 = require("./html/HTMLHandler.js");
function RegisterHTMLHandler(adaptor) {
    var handler = new HTMLHandler_js_1.HTMLHandler(adaptor);
    mathjax_js_1.MathJax.handlers.register(handler);
    return handler;
}
exports.RegisterHTMLHandler = RegisterHTMLHandler;
//# sourceMappingURL=html.js.map