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
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../Wrapper.js");
var mtd_js_1 = require("../../common/Wrappers/mtd.js");
var mtd_js_2 = require("../../../core/MmlTree/MmlNodes/mtd.js");
var CHTMLmtd = (function (_super) {
    __extends(CHTMLmtd, _super);
    function CHTMLmtd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmtd.prototype.toCHTML = function (parent) {
        _super.prototype.toCHTML.call(this, parent);
        var ralign = this.node.attributes.get('rowalign');
        var calign = this.node.attributes.get('columnalign');
        var palign = this.parent.node.attributes.get('rowalign');
        if (ralign !== palign) {
            this.adaptor.setAttribute(this.chtml, 'rowalign', ralign);
        }
        if (calign !== 'center' &&
            (this.parent.kind !== 'mlabeledtr' || this !== this.parent.childNodes[0] ||
                calign !== this.parent.parent.node.attributes.get('side'))) {
            this.adaptor.setStyle(this.chtml, 'textAlign', calign);
        }
        this.adaptor.append(this.chtml, this.html('mjx-tstrut'));
    };
    return CHTMLmtd;
}(mtd_js_1.CommonMtdMixin(Wrapper_js_1.CHTMLWrapper)));
CHTMLmtd.kind = mtd_js_2.MmlMtd.prototype.kind;
CHTMLmtd.styles = {
    'mjx-mtd': {
        display: 'table-cell',
        'text-align': 'center',
        'padding': '.215em .4em'
    },
    'mjx-mtd:first-child': {
        'padding-left': 0
    },
    'mjx-mtd:last-child': {
        'padding-right': 0
    },
    'mjx-mtable > * > mjx-itable > *:first-child > mjx-mtd': {
        'padding-top': 0
    },
    'mjx-mtable > * > mjx-itable > *:last-child > mjx-mtd': {
        'padding-bottom': 0
    },
    'mjx-tstrut': {
        display: 'inline-block',
        height: '1em',
        'vertical-align': '-.25em'
    },
    'mjx-labels[align="left"] > mjx-mtr > mjx-mtd': {
        'text-align': 'left'
    },
    'mjx-labels[align="right"] > mjx-mtr > mjx-mtd': {
        'text-align': 'right'
    },
    'mjx-mtr mjx-mtd[rowalign="top"], mjx-mlabeledtr mjx-mtd[rowalign="top"]': {
        'vertical-align': 'top'
    },
    'mjx-mtr mjx-mtd[rowalign="center"], mjx-mlabeledtr mjx-mtd[rowalign="center"]': {
        'vertical-align': 'middle'
    },
    'mjx-mtr mjx-mtd[rowalign="bottom"], mjx-mlabeledtr mjx-mtd[rowalign="bottom"]': {
        'vertical-align': 'bottom'
    },
    'mjx-mtr mjx-mtd[rowalign="baseline"], mjx-mlabeledtr mjx-mtd[rowalign="baseline"]': {
        'vertical-align': 'baseline'
    },
    'mjx-mtr mjx-mtd[rowalign="axis"], mjx-mlabeledtr mjx-mtd[rowalign="axis"]': {
        'vertical-align': '.25em'
    }
};
exports.CHTMLmtd = CHTMLmtd;
//# sourceMappingURL=mtd.js.map