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
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMrow = (function (_super) {
    __extends(MmlMrow, _super);
    function MmlMrow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._core = null;
        return _this;
    }
    Object.defineProperty(MmlMrow.prototype, "kind", {
        get: function () {
            return 'mrow';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMrow.prototype, "isSpacelike", {
        get: function () {
            try {
                for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var child = _b.value;
                    if (!child.isSpacelike) {
                        return false;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
            var e_1, _c;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMrow.prototype, "isEmbellished", {
        get: function () {
            var embellished = false;
            var i = 0;
            try {
                for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var child = _b.value;
                    if (child) {
                        if (child.isEmbellished) {
                            if (embellished) {
                                return false;
                            }
                            embellished = true;
                            this._core = i;
                        }
                        else if (!child.isSpacelike) {
                            return false;
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return embellished;
            var e_2, _c;
        },
        enumerable: true,
        configurable: true
    });
    MmlMrow.prototype.core = function () {
        if (!this.isEmbellished || this._core == null) {
            return this;
        }
        return this.childNodes[this._core];
    };
    MmlMrow.prototype.coreMO = function () {
        if (!this.isEmbellished || this._core == null) {
            return this;
        }
        return this.childNodes[this._core].coreMO();
    };
    MmlMrow.prototype.nonSpaceLength = function () {
        var n = 0;
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                if (child && !child.isSpacelike) {
                    n++;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return n;
        var e_3, _c;
    };
    MmlMrow.prototype.firstNonSpace = function () {
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                if (child && !child.isSpacelike) {
                    return child;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return null;
        var e_4, _c;
    };
    MmlMrow.prototype.lastNonSpace = function () {
        var i = this.childNodes.length;
        while (--i >= 0) {
            var child = this.childNodes[i];
            if (child && !child.isSpacelike) {
                return child;
            }
        }
        return null;
    };
    MmlMrow.prototype.setTeXclass = function (prev) {
        if ((this.getProperty('open') != null || this.getProperty('close') != null) &&
            (!prev || prev.getProperty('fnOp') != null)) {
            this.getPrevClass(prev);
            prev = null;
            try {
                for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var child = _b.value;
                    prev = child.setTeXclass(prev);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_5) throw e_5.error; }
            }
            if (this.texClass == null) {
                this.texClass = MmlNode_js_1.TEXCLASS.INNER;
            }
        }
        else {
            try {
                for (var _d = __values(this.childNodes), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var child = _e.value;
                    prev = child.setTeXclass(prev);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
                }
                finally { if (e_6) throw e_6.error; }
            }
            if (this.childNodes[0]) {
                this.updateTeXclass(this.childNodes[0]);
            }
        }
        return prev;
        var e_5, _c, e_6, _f;
    };
    return MmlMrow;
}(MmlNode_js_1.AbstractMmlNode));
MmlMrow.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults);
exports.MmlMrow = MmlMrow;
var MmlInferredMrow = (function (_super) {
    __extends(MmlInferredMrow, _super);
    function MmlInferredMrow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlInferredMrow.prototype, "kind", {
        get: function () {
            return 'inferredMrow';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlInferredMrow.prototype, "isInferred", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlInferredMrow.prototype, "notParent", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MmlInferredMrow.prototype.toString = function () {
        return '[' + this.childNodes.join(',') + ']';
    };
    return MmlInferredMrow;
}(MmlMrow));
MmlInferredMrow.defaults = MmlMrow.defaults;
exports.MmlInferredMrow = MmlInferredMrow;
//# sourceMappingURL=mrow.js.map