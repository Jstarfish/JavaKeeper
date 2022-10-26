"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var InputJax_js_1 = require("../core/InputJax.js");
var Options_js_1 = require("../util/Options.js");
var FindTeX_js_1 = require("./tex/FindTeX.js");
var FilterUtil_js_1 = require("./tex/FilterUtil.js");
var NodeUtil_js_1 = require("./tex/NodeUtil.js");
var TexParser_js_1 = require("./tex/TexParser.js");
var TexError_js_1 = require("./tex/TexError.js");
var ParseOptions_js_1 = require("./tex/ParseOptions.js");
var Tags_js_1 = require("./tex/Tags.js");
var Configuration_js_1 = require("./tex/Configuration.js");
require("./tex/base/BaseConfiguration.js");
var TeX = (function (_super) {
    __extends(TeX, _super);
    function TeX(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var packages = options['packages'] || TeX.OPTIONS['packages'];
        var configuration = TeX.configure(packages);
        var parseOptions = new ParseOptions_js_1.default(configuration, [TeX.OPTIONS, Tags_js_1.TagsFactory.OPTIONS, { 'packages': packages }]);
        var _a = __read(Options_js_1.separateOptions(options, FindTeX_js_1.FindTeX.OPTIONS, parseOptions.options), 3), tex = _a[0], find = _a[1], rest = _a[2];
        _this = _super.call(this, tex) || this;
        Options_js_1.userOptions(parseOptions.options, rest);
        TeX.tags(parseOptions, configuration);
        _this._parseOptions = parseOptions;
        _this.configuration = configuration;
        try {
            for (var _b = __values(configuration.preprocessors), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pre = _c.value;
                typeof pre === 'function' ? _this.preFilters.add(pre) :
                    _this.preFilters.add(pre[0], pre[1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values(configuration.postprocessors), _f = _e.next(); !_f.done; _f = _e.next()) {
                var post = _f.value;
                typeof post === 'function' ? _this.postFilters.add(post) :
                    _this.postFilters.add(post[0], post[1]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_g = _e.return)) _g.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        _this.postFilters.add(FilterUtil_js_1.default.cleanSubSup, -4);
        _this.postFilters.add(FilterUtil_js_1.default.cleanStretchy, -3);
        _this.postFilters.add(FilterUtil_js_1.default.cleanAttributes, -2);
        _this.postFilters.add(FilterUtil_js_1.default.combineRelations, -1);
        _this.findTeX = _this.parseOptions.options['FindTeX'] || new FindTeX_js_1.FindTeX(find);
        return _this;
        var e_1, _d, e_2, _g;
    }
    TeX.configure = function (packages) {
        var configuration = Configuration_js_1.Configuration.empty();
        try {
            for (var packages_1 = __values(packages), packages_1_1 = packages_1.next(); !packages_1_1.done; packages_1_1 = packages_1.next()) {
                var key = packages_1_1.value;
                var conf = Configuration_js_1.ConfigurationHandler.get(key);
                if (conf) {
                    configuration.append(conf);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (packages_1_1 && !packages_1_1.done && (_a = packages_1.return)) _a.call(packages_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        configuration.append(Configuration_js_1.Configuration.extension());
        return configuration;
        var e_3, _a;
    };
    TeX.tags = function (options, configuration) {
        Tags_js_1.TagsFactory.addTags(configuration.tags);
        Tags_js_1.TagsFactory.setDefault(options.options.tags);
        options.tags = Tags_js_1.TagsFactory.getDefault();
        options.tags.configuration = options;
    };
    TeX.prototype.setMmlFactory = function (mmlFactory) {
        _super.prototype.setMmlFactory.call(this, mmlFactory);
        this._parseOptions.nodeFactory.setMmlFactory(mmlFactory);
    };
    Object.defineProperty(TeX.prototype, "parseOptions", {
        get: function () {
            return this._parseOptions;
        },
        enumerable: true,
        configurable: true
    });
    TeX.prototype.compile = function (math) {
        this.parseOptions.clear();
        var node;
        var parser;
        var display = math.display;
        this.executeFilters(this.preFilters, math, this.parseOptions);
        this.latex = math.math;
        try {
            parser = new TexParser_js_1.default(this.latex, { display: display, isInner: false }, this.parseOptions);
            node = parser.mml();
        }
        catch (err) {
            if (!(err instanceof TexError_js_1.default)) {
                throw err;
            }
            this.parseOptions.error = true;
            node = this.formatError(err);
        }
        node = this.parseOptions.nodeFactory.create('node', 'math', [node]);
        if (display) {
            NodeUtil_js_1.default.setAttribute(node, 'display', 'block');
        }
        this.parseOptions.root = node;
        this.executeFilters(this.postFilters, math, this.parseOptions);
        if (this.parseOptions.error) {
            this.parseOptions.root.setInheritedAttributes({}, display, 0, false);
        }
        this.mathNode = this.parseOptions.root;
        return this.mathNode;
    };
    ;
    TeX.prototype.findMath = function (strings) {
        return this.findTeX.findMath(strings);
    };
    TeX.prototype.formatError = function (err) {
        var message = err.message.replace(/\n.*/, '');
        return this.parseOptions.nodeFactory.create('error', message, err.id, this.latex);
    };
    ;
    return TeX;
}(InputJax_js_1.AbstractInputJax));
TeX.NAME = 'TeX';
TeX.OPTIONS = __assign({}, InputJax_js_1.AbstractInputJax.OPTIONS, { FindTeX: null, packages: ['base'], digits: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)?|\.[0-9]+)/, maxBuffer: 5 * 1024 });
exports.TeX = TeX;
//# sourceMappingURL=tex.js.map