"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function protoItem(open, math, close, n, start, end, display) {
    if (display === void 0) { display = null; }
    var item = { open: open, math: math, close: close,
        n: n, start: { n: start }, end: { n: end }, display: display };
    return item;
}
exports.protoItem = protoItem;
var AbstractMathItem = (function () {
    function AbstractMathItem(math, jax, display, start, end) {
        if (display === void 0) { display = true; }
        if (start === void 0) { start = { i: 0, n: 0, delim: '' }; }
        if (end === void 0) { end = { i: 0, n: 0, delim: '' }; }
        this.root = null;
        this.typesetRoot = null;
        this._state = STATE.UNPROCESSED;
        this.metrics = {};
        this.bbox = {};
        this.inputData = {};
        this.outputData = {};
        this.math = math;
        this.inputJax = jax;
        this.display = display;
        this.start = start;
        this.end = end;
        this.root = null;
        this.typesetRoot = null;
        this.metrics = {};
        this.bbox = {};
        this.inputData = {};
        this.outputData = {};
    }
    AbstractMathItem.prototype.compile = function (document) {
        if (this.state() < STATE.COMPILED) {
            this.root = this.inputJax.compile(this);
            this.state(STATE.COMPILED);
        }
    };
    AbstractMathItem.prototype.typeset = function (document) {
        if (this.state() < STATE.TYPESET) {
            this.typesetRoot = document.outputJax[this.display === null ? 'escaped' : 'typeset'](this, document);
            this.state(STATE.TYPESET);
        }
    };
    AbstractMathItem.prototype.rerender = function (document) {
        this.state(AbstractMathItem.STATE.COMPILED);
        this.typeset(document);
        this.updateDocument(document);
    };
    AbstractMathItem.prototype.updateDocument = function (document) { };
    AbstractMathItem.prototype.removeFromDocument = function (restore) {
        if (restore === void 0) { restore = false; }
    };
    AbstractMathItem.prototype.setMetrics = function (em, ex, cwidth, lwidth, scale) {
        this.metrics = {
            em: em, ex: ex,
            containerWidth: cwidth,
            lineWidth: lwidth,
            scale: scale
        };
    };
    AbstractMathItem.prototype.state = function (state, restore) {
        if (state === void 0) { state = null; }
        if (restore === void 0) { restore = false; }
        if (state != null) {
            if (state < STATE.INSERTED && this._state >= STATE.INSERTED) {
                this.removeFromDocument(restore);
            }
            if (state < STATE.TYPESET && this._state >= STATE.TYPESET) {
                this.bbox = {};
                this.outputData = {};
            }
            if (state < STATE.COMPILED && this._state >= STATE.COMPILED) {
                this.inputData = {};
            }
            this._state = state;
        }
        return this._state;
    };
    return AbstractMathItem;
}());
AbstractMathItem.STATE = {
    UNPROCESSED: 0,
    COMPILED: 1,
    TYPESET: 2,
    INSERTED: 3
};
exports.AbstractMathItem = AbstractMathItem;
var STATE = AbstractMathItem.STATE;
//# sourceMappingURL=MathItem.js.map