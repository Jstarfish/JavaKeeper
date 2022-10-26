"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Options_js_1 = require("../util/Options.js");
var AbstractFindMath = (function () {
    function AbstractFindMath(options) {
        var CLASS = this.constructor;
        this.options = Options_js_1.userOptions(Options_js_1.defaultOptions({}, CLASS.OPTIONS), options);
    }
    return AbstractFindMath;
}());
AbstractFindMath.OPTIONS = {};
exports.AbstractFindMath = AbstractFindMath;
//# sourceMappingURL=FindMath.js.map