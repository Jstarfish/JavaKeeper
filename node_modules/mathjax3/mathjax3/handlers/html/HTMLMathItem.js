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
var MathItem_js_1 = require("../../core/MathItem.js");
var HTMLMathItem = (function (_super) {
    __extends(HTMLMathItem, _super);
    function HTMLMathItem(math, jax, display, start, end) {
        if (display === void 0) { display = true; }
        if (start === void 0) { start = { node: null, n: 0, delim: '' }; }
        if (end === void 0) { end = { node: null, n: 0, delim: '' }; }
        return _super.call(this, math, jax, display, start, end) || this;
    }
    Object.defineProperty(HTMLMathItem.prototype, "adaptor", {
        get: function () {
            return this.inputJax.adaptor;
        },
        enumerable: true,
        configurable: true
    });
    HTMLMathItem.prototype.updateDocument = function (html) {
        if (this.state() < STATE.INSERTED) {
            if (this.inputJax.processStrings) {
                var node = this.start.node;
                if (node === this.end.node) {
                    if (this.end.n && this.end.n < this.adaptor.value(this.end.node).length) {
                        this.adaptor.split(this.end.node, this.end.n);
                    }
                    if (this.start.n) {
                        node = this.adaptor.split(this.start.node, this.start.n);
                    }
                    this.adaptor.replace(this.typesetRoot, node);
                }
                else {
                    if (this.start.n) {
                        node = this.adaptor.split(node, this.start.n);
                    }
                    while (node !== this.end.node) {
                        var next = this.adaptor.next(node);
                        this.adaptor.remove(node);
                        node = next;
                    }
                    this.adaptor.insert(this.typesetRoot, node);
                    if (this.end.n < this.adaptor.value(node).length) {
                        this.adaptor.split(node, this.end.n);
                    }
                    this.adaptor.remove(node);
                }
            }
            else {
                this.adaptor.replace(this.typesetRoot, this.start.node);
            }
            this.start.node = this.end.node = this.typesetRoot;
            this.start.n = this.end.n = 0;
            this.state(STATE.INSERTED);
        }
    };
    HTMLMathItem.prototype.removeFromDocument = function (restore) {
        if (restore === void 0) { restore = false; }
        if (this.state() >= STATE.TYPESET) {
            var node = this.start.node;
            var math = this.adaptor.text('');
            if (restore) {
                var text = this.start.delim + this.math + this.end.delim;
                if (this.inputJax.processStrings) {
                    math = this.adaptor.text(text);
                }
                else {
                    var doc = this.adaptor.parse(text, 'text/html');
                    math = this.adaptor.firstChild(this.adaptor.body(doc));
                }
            }
            this.adaptor.replace(math, node);
            this.start.node = this.end.node = math;
            this.start.n = this.end.n = 0;
        }
    };
    return HTMLMathItem;
}(MathItem_js_1.AbstractMathItem));
HTMLMathItem.STATE = MathItem_js_1.AbstractMathItem.STATE;
exports.HTMLMathItem = HTMLMathItem;
var STATE = HTMLMathItem.STATE;
//# sourceMappingURL=HTMLMathItem.js.map