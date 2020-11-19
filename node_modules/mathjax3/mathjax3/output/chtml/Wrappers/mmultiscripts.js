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
var mmultiscripts_js_1 = require("../../common/Wrappers/mmultiscripts.js");
var mmultiscripts_js_2 = require("../../../core/MmlTree/MmlNodes/mmultiscripts.js");
var CHTMLmmultiscripts = (function (_super) {
    __extends(CHTMLmmultiscripts, _super);
    function CHTMLmmultiscripts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmmultiscripts.prototype.toCHTML = function (parent) {
        var chtml = this.standardCHTMLnode(parent);
        var data = this.getScriptData();
        var sub = this.combinePrePost(data.sub, data.psub);
        var sup = this.combinePrePost(data.sup, data.psup);
        var _a = __read(this.getUVQ(data.base, sub, sup), 3), u = _a[0], v = _a[1], q = _a[2];
        if (data.numPrescripts) {
            this.addScripts(u, -v, true, data.psub, data.psup, this.firstPrescript, data.numPrescripts);
        }
        this.childNodes[0].toCHTML(chtml);
        if (data.numScripts) {
            this.addScripts(u, -v, false, data.sub, data.sup, 1, data.numScripts);
        }
    };
    CHTMLmmultiscripts.prototype.addScripts = function (u, v, isPre, sub, sup, i, n) {
        var adaptor = this.adaptor;
        var q = (u - sup.d) + (v - sub.h);
        var U = (u < 0 && v === 0 ? sub.h + u : u);
        var rowdef = (q > 0 ? { style: { height: this.em(q) } } : {});
        var tabledef = (U ? { style: { 'vertical-align': this.em(U) } } : {});
        var supRow = this.html('mjx-row');
        var sepRow = this.html('mjx-row', rowdef);
        var subRow = this.html('mjx-row');
        var name = 'mjx-' + (isPre ? 'pre' : '') + 'scripts';
        adaptor.append(this.chtml, this.html(name, tabledef, [supRow, sepRow, subRow]));
        var m = i + 2 * n;
        while (i < m) {
            this.childNodes[i++].toCHTML(adaptor.append(subRow, this.html('mjx-cell')));
            this.childNodes[i++].toCHTML(adaptor.append(supRow, this.html('mjx-cell')));
        }
    };
    return CHTMLmmultiscripts;
}(mmultiscripts_js_1.CommonMmultiscriptsMixin(msubsup_js_1.CHTMLmsubsup)));
CHTMLmmultiscripts.kind = mmultiscripts_js_2.MmlMmultiscripts.prototype.kind;
CHTMLmmultiscripts.styles = {
    'mjx-prescripts': {
        display: 'inline-table',
        'padding-left': '.05em'
    },
    'mjx-scripts': {
        display: 'inline-table',
        'padding-right': '.05em'
    },
    'mjx-prescripts > mjx-row > mjx-cell': {
        'text-align': 'right'
    }
};
exports.CHTMLmmultiscripts = CHTMLmmultiscripts;
//# sourceMappingURL=mmultiscripts.js.map