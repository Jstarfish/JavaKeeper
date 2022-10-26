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
var merror_js_1 = require("../../../core/MmlTree/MmlNodes/merror.js");
var SVGmerror = (function (_super) {
    __extends(SVGmerror, _super);
    function SVGmerror() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmerror.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        var _a = this.getBBox(), h = _a.h, d = _a.d, w = _a.w;
        this.adaptor.append(this.element, this.svg('rect', {
            'data-background': true,
            width: this.fixed(w), height: this.fixed(h + d), y: this.fixed(-d)
        }));
        this.addChildren(svg);
    };
    return SVGmerror;
}(Wrapper_js_1.SVGWrapper));
SVGmerror.kind = merror_js_1.MmlMerror.prototype.kind;
SVGmerror.styles = {
    'g[data-mml-node="merror"] > g': {
        fill: 'red',
        stroke: 'red'
    },
    'g[data-mml-node="merror"] > rect[data-background]': {
        fill: 'yellow',
        stroke: 'none'
    }
};
exports.SVGmerror = SVGmerror;
//# sourceMappingURL=merror.js.map