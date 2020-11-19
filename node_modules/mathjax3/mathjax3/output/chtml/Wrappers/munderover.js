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
Object.defineProperty(exports, "__esModule", { value: true });
var msubsup_js_1 = require("./msubsup.js");
var munderover_js_1 = require("../../common/Wrappers/munderover.js");
var munderover_js_2 = require("../../common/Wrappers/munderover.js");
var munderover_js_3 = require("../../common/Wrappers/munderover.js");
var munderover_js_4 = require("../../../core/MmlTree/MmlNodes/munderover.js");
var CHTMLmunder = (function (_super) {
    __extends(CHTMLmunder, _super);
    function CHTMLmunder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmunder.prototype.toCHTML = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toCHTML.call(this, parent);
            this.adaptor.setAttribute(this.chtml, 'limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        var base = this.adaptor.append(this.adaptor.append(this.chtml, this.html('mjx-row')), this.html('mjx-base'));
        var under = this.adaptor.append(this.adaptor.append(this.chtml, this.html('mjx-row')), this.html('mjx-under'));
        this.baseChild.toCHTML(base);
        this.script.toCHTML(under);
        var basebox = this.baseChild.getBBox();
        var underbox = this.script.getBBox();
        var _a = __read(this.getUnderKV(basebox, underbox), 2), k = _a[0], v = _a[1];
        var delta = this.getDelta(true);
        this.adaptor.setStyle(under, 'paddingTop', this.em(k));
        this.setDeltaW([base, under], this.getDeltaW([basebox, underbox], [0, -delta]));
        this.adjustUnderDepth(under, underbox);
    };
    return CHTMLmunder;
}(munderover_js_1.CommonMunderMixin(msubsup_js_1.CHTMLmsub)));
CHTMLmunder.kind = munderover_js_4.MmlMunder.prototype.kind;
CHTMLmunder.useIC = true;
CHTMLmunder.styles = {
    'mjx-over': {
        'text-align': 'left'
    },
    'mjx-munder:not([limits="false"])': {
        display: 'inline-table',
    },
    'mjx-munder > mjx-row': {
        'text-align': 'left'
    },
    'mjx-under': {
        'padding-bottom': '.1em'
    }
};
exports.CHTMLmunder = CHTMLmunder;
var CHTMLmover = (function (_super) {
    __extends(CHTMLmover, _super);
    function CHTMLmover() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmover.prototype.toCHTML = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toCHTML.call(this, parent);
            this.adaptor.setAttribute(this.chtml, 'limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        var over = this.adaptor.append(this.chtml, this.html('mjx-over'));
        var base = this.adaptor.append(this.chtml, this.html('mjx-base'));
        this.script.toCHTML(over);
        this.baseChild.toCHTML(base);
        var overbox = this.script.getBBox();
        var basebox = this.baseChild.getBBox();
        var _a = __read(this.getOverKU(basebox, overbox), 2), k = _a[0], u = _a[1];
        var delta = this.getDelta();
        this.adaptor.setStyle(over, 'paddingBottom', this.em(k));
        this.setDeltaW([base, over], this.getDeltaW([basebox, overbox], [0, delta]));
        this.adjustOverDepth(over, overbox);
    };
    return CHTMLmover;
}(munderover_js_2.CommonMoverMixin(msubsup_js_1.CHTMLmsup)));
CHTMLmover.kind = munderover_js_4.MmlMover.prototype.kind;
CHTMLmover.useIC = true;
CHTMLmover.styles = {
    'mjx-mover:not([limits="false"])': {
        'padding-top': '.1em'
    },
    'mjx-mover:not([limits="false"]) > *': {
        display: 'block',
        'text-align': 'left'
    }
};
exports.CHTMLmover = CHTMLmover;
var CHTMLmunderover = (function (_super) {
    __extends(CHTMLmunderover, _super);
    function CHTMLmunderover() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmunderover.prototype.toCHTML = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toCHTML.call(this, parent);
            this.adaptor.setAttribute(this.chtml, 'limits', 'false');
            return;
        }
        this.chtml = this.standardCHTMLnode(parent);
        var over = this.adaptor.append(this.chtml, this.html('mjx-over'));
        var table = this.adaptor.append(this.adaptor.append(this.chtml, this.html('mjx-box')), this.html('mjx-munder'));
        var base = this.adaptor.append(this.adaptor.append(table, this.html('mjx-row')), this.html('mjx-base'));
        var under = this.adaptor.append(this.adaptor.append(table, this.html('mjx-row')), this.html('mjx-under'));
        this.overChild.toCHTML(over);
        this.baseChild.toCHTML(base);
        this.underChild.toCHTML(under);
        var overbox = this.overChild.getBBox();
        var basebox = this.baseChild.getBBox();
        var underbox = this.underChild.getBBox();
        var _a = __read(this.getOverKU(basebox, overbox), 2), ok = _a[0], u = _a[1];
        var _b = __read(this.getUnderKV(basebox, underbox), 2), uk = _b[0], v = _b[1];
        var delta = this.getDelta();
        this.adaptor.setStyle(over, 'paddingBottom', this.em(ok));
        this.adaptor.setStyle(under, 'paddingTop', this.em(uk));
        this.setDeltaW([base, under, over], this.getDeltaW([basebox, underbox, overbox], [0, -delta, delta]));
        this.adjustOverDepth(over, overbox);
        this.adjustUnderDepth(under, underbox);
    };
    return CHTMLmunderover;
}(munderover_js_3.CommonMunderoverMixin(msubsup_js_1.CHTMLmsubsup)));
CHTMLmunderover.kind = munderover_js_4.MmlMunderover.prototype.kind;
CHTMLmunderover.useIC = true;
CHTMLmunderover.styles = {
    'mjx-munderover:not([limits="false"])': {
        'padding-top': '.1em'
    },
    'mjx-munderover:not([limits="false"]) > *': {
        display: 'block'
    },
};
exports.CHTMLmunderover = CHTMLmunderover;
//# sourceMappingURL=munderover.js.map