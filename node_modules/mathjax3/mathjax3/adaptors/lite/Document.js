"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Element_js_1 = require("./Element.js");
var LiteDocument = (function () {
    function LiteDocument() {
        this.root = new Element_js_1.LiteElement('html', {}, [
            this.head = new Element_js_1.LiteElement('head'),
            this.body = new Element_js_1.LiteElement('body')
        ]);
    }
    Object.defineProperty(LiteDocument.prototype, "kind", {
        get: function () {
            return '#document';
        },
        enumerable: true,
        configurable: true
    });
    return LiteDocument;
}());
exports.LiteDocument = LiteDocument;
//# sourceMappingURL=Document.js.map