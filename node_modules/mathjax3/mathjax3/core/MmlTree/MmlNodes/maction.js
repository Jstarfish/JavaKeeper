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
Object.defineProperty(exports, "__esModule", { value: true });
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMaction = (function (_super) {
    __extends(MmlMaction, _super);
    function MmlMaction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMaction.prototype, "kind", {
        get: function () {
            return 'maction';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMaction.prototype, "arity", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMaction.prototype, "selected", {
        get: function () {
            var selection = this.attributes.get('selection');
            var i = Math.max(1, Math.min(this.childNodes.length, selection)) - 1;
            return this.childNodes[i] || this.factory.create('mrow');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMaction.prototype, "isEmbellished", {
        get: function () {
            return this.selected.isEmbellished;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlMaction.prototype, "isSpacelike", {
        get: function () {
            return this.selected.isSpacelike;
        },
        enumerable: true,
        configurable: true
    });
    MmlMaction.prototype.core = function () {
        return this.selected.core();
    };
    MmlMaction.prototype.coreMO = function () {
        return this.selected.coreMO();
    };
    MmlMaction.prototype.verifyAttributes = function (options) {
        _super.prototype.verifyAttributes.call(this, options);
        if (this.attributes.get('actiontype') !== 'toggle' &&
            this.attributes.getExplicit('selection') !== undefined) {
            var attributes = this.attributes.getAllAttributes();
            delete attributes.selection;
        }
    };
    MmlMaction.prototype.setTeXclass = function (prev) {
        if (this.attributes.get('actiontype') === 'tooltip' && this.childNodes[1]) {
            this.childNodes[1].setTeXclass(null);
        }
        var selected = this.selected;
        prev = selected.setTeXclass(prev);
        this.updateTeXclass(selected);
        return prev;
    };
    MmlMaction.prototype.nextToggleSelection = function () {
        var selection = Math.max(1, this.attributes.get('selection') + 1);
        if (selection > this.childNodes.length) {
            selection = 1;
        }
        this.attributes.set('selection', selection);
    };
    return MmlMaction;
}(MmlNode_js_1.AbstractMmlNode));
MmlMaction.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults, { actiontype: 'toggle', selection: 1 });
exports.MmlMaction = MmlMaction;
//# sourceMappingURL=maction.js.map