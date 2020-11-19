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
var msqrt_js_1 = require("./msqrt.js");
var mroot_js_1 = require("../../common/Wrappers/mroot.js");
var mroot_js_2 = require("../../../core/MmlTree/MmlNodes/mroot.js");
var CHTMLmroot = (function (_super) {
    __extends(CHTMLmroot, _super);
    function CHTMLmroot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmroot.prototype.addRoot = function (ROOT, root, sbox) {
        root.toCHTML(ROOT);
        var _a = __read(this.getRootDimens(sbox), 3), x = _a[0], h = _a[1], dx = _a[2];
        var bbox = root.getBBox();
        this.adaptor.setStyle(ROOT, 'verticalAlign', this.em(h));
        this.adaptor.setStyle(ROOT, 'width', this.em(x));
        if (dx) {
            this.adaptor.setStyle(this.adaptor.firstChild(ROOT), 'paddingLeft', this.em(dx));
        }
    };
    return CHTMLmroot;
}(mroot_js_1.CommonMrootMixin(msqrt_js_1.CHTMLmsqrt)));
CHTMLmroot.kind = mroot_js_2.MmlMroot.prototype.kind;
exports.CHTMLmroot = CHTMLmroot;
//# sourceMappingURL=mroot.js.map