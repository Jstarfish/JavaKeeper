"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Options_js_1 = require("../util/Options.js");
var FunctionList_js_1 = require("../util/FunctionList.js");
var AbstractInputJax = (function () {
    function AbstractInputJax(options) {
        if (options === void 0) { options = {}; }
        this.adaptor = null;
        this.mmlFactory = null;
        var CLASS = this.constructor;
        this.options = Options_js_1.userOptions(Options_js_1.defaultOptions({}, CLASS.OPTIONS), options);
        this.preFilters = new FunctionList_js_1.FunctionList();
        this.postFilters = new FunctionList_js_1.FunctionList();
    }
    Object.defineProperty(AbstractInputJax.prototype, "name", {
        get: function () {
            return this.constructor.NAME;
        },
        enumerable: true,
        configurable: true
    });
    AbstractInputJax.prototype.setAdaptor = function (adaptor) {
        this.adaptor = adaptor;
    };
    AbstractInputJax.prototype.setMmlFactory = function (mmlFactory) {
        this.mmlFactory = mmlFactory;
    };
    Object.defineProperty(AbstractInputJax.prototype, "processStrings", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    AbstractInputJax.prototype.findMath = function (node, options) {
        return [];
    };
    AbstractInputJax.prototype.executeFilters = function (filters, math, data) {
        var args = { math: math, data: data };
        filters.execute(args);
        return args.data;
    };
    return AbstractInputJax;
}());
AbstractInputJax.NAME = 'generic';
AbstractInputJax.OPTIONS = {};
exports.AbstractInputJax = AbstractInputJax;
//# sourceMappingURL=InputJax.js.map