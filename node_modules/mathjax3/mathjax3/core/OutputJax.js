"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Options_js_1 = require("../util/Options.js");
var FunctionList_js_1 = require("../util/FunctionList.js");
var AbstractOutputJax = (function () {
    function AbstractOutputJax(options) {
        if (options === void 0) { options = {}; }
        this.adaptor = null;
        var CLASS = this.constructor;
        this.options = Options_js_1.userOptions(Options_js_1.defaultOptions({}, CLASS.OPTIONS), options);
        this.postFilters = new FunctionList_js_1.FunctionList();
    }
    Object.defineProperty(AbstractOutputJax.prototype, "name", {
        get: function () {
            return this.constructor.NAME;
        },
        enumerable: true,
        configurable: true
    });
    AbstractOutputJax.prototype.setAdaptor = function (adaptor) {
        this.adaptor = adaptor;
    };
    AbstractOutputJax.prototype.getMetrics = function (document) {
    };
    AbstractOutputJax.prototype.styleSheet = function (document) {
        return null;
    };
    AbstractOutputJax.prototype.executeFilters = function (filters, math, data) {
        var args = { math: math, data: data };
        filters.execute(args);
        return args.data;
    };
    return AbstractOutputJax;
}());
AbstractOutputJax.NAME = 'generic';
AbstractOutputJax.OPTIONS = {};
exports.AbstractOutputJax = AbstractOutputJax;
//# sourceMappingURL=OutputJax.js.map