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
var Attributes_js_1 = require("./Attributes.js");
var Node_js_1 = require("../Tree/Node.js");
exports.TEXCLASS = {
    ORD: 0,
    OP: 1,
    BIN: 2,
    REL: 3,
    OPEN: 4,
    CLOSE: 5,
    PUNCT: 6,
    INNER: 7,
    VCENTER: 8,
    NONE: -1
};
exports.TEXCLASSNAMES = ['ORD', 'OP', 'BIN', 'REL', 'OPEN', 'CLOSE', 'PUNCT', 'INNER', 'VCENTER'];
var TEXSPACELENGTH = ['', 'thinmathspace', 'mediummathspace', 'thickmathspace'];
var TEXSPACE = [
    [0, -1, 2, 3, 0, 0, 0, 1],
    [-1, -1, 0, 3, 0, 0, 0, 1],
    [2, 2, 0, 0, 2, 0, 0, 2],
    [3, 3, 0, 0, 3, 0, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, -1, 2, 3, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1],
    [1, -1, 2, 3, 1, 0, 1, 1]
];
exports.indentAttributes = [
    'indentalign', 'indentalignfirst',
    'indentshift', 'indentshiftfirst'
];
var AbstractMmlNode = (function (_super) {
    __extends(AbstractMmlNode, _super);
    function AbstractMmlNode(factory, attributes, children) {
        if (attributes === void 0) { attributes = {}; }
        if (children === void 0) { children = []; }
        var _this = _super.call(this, factory) || this;
        _this.texClass = null;
        _this.prevClass = null;
        _this.prevLevel = null;
        if (_this.arity < 0) {
            _this.childNodes = [factory.create('inferredMrow')];
            _this.childNodes[0].parent = _this;
        }
        _this.setChildren(children);
        _this.attributes = new Attributes_js_1.Attributes(factory.getNodeClass(_this.kind).defaults, factory.getNodeClass('math').defaults);
        _this.attributes.setList(attributes);
        return _this;
    }
    Object.defineProperty(AbstractMmlNode.prototype, "isToken", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "isEmbellished", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "isSpacelike", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "linebreakContainer", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "hasNewLine", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "arity", {
        get: function () {
            return Infinity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "isInferred", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "Parent", {
        get: function () {
            var parent = this.parent;
            while (parent && parent.notParent) {
                parent = parent.Parent;
            }
            return parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "notParent", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMmlNode.prototype.setChildren = function (children) {
        if (this.arity < 0) {
            return this.childNodes[0].setChildren(children);
        }
        return _super.prototype.setChildren.call(this, children);
    };
    AbstractMmlNode.prototype.appendChild = function (child) {
        if (this.arity < 0) {
            this.childNodes[0].appendChild(child);
            return child;
        }
        return _super.prototype.appendChild.call(this, child);
    };
    AbstractMmlNode.prototype.replaceChild = function (newChild, oldChild) {
        if (this.arity < 0) {
            this.childNodes[0].replaceChild(newChild, oldChild);
            return newChild;
        }
        return _super.prototype.replaceChild.call(this, newChild, oldChild);
    };
    AbstractMmlNode.prototype.core = function () {
        return this;
    };
    AbstractMmlNode.prototype.coreMO = function () {
        return this;
    };
    AbstractMmlNode.prototype.coreIndex = function () {
        return 0;
    };
    AbstractMmlNode.prototype.childPosition = function () {
        var child = this;
        var parent = child.parent;
        while (parent && parent.notParent) {
            child = parent;
            parent = parent.parent;
        }
        if (parent) {
            var i = 0;
            try {
                for (var _a = __values(parent.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var node = _b.value;
                    if (node === child) {
                        return i;
                    }
                    i++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return null;
        var e_1, _c;
    };
    AbstractMmlNode.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        return (this.texClass != null ? this : prev);
    };
    AbstractMmlNode.prototype.updateTeXclass = function (core) {
        if (core) {
            this.prevClass = core.prevClass;
            this.prevLevel = core.prevLevel;
            core.prevClass = core.prevLevel = null;
            this.texClass = core.texClass;
        }
    };
    AbstractMmlNode.prototype.getPrevClass = function (prev) {
        if (prev) {
            this.prevClass = prev.texClass;
            this.prevLevel = prev.attributes.get('scriptlevel');
        }
    };
    AbstractMmlNode.prototype.texSpacing = function () {
        var prevClass = (this.prevClass != null ? this.prevClass : exports.TEXCLASS.NONE);
        var texClass = this.texClass || exports.TEXCLASS.ORD;
        if (prevClass === exports.TEXCLASS.NONE || texClass === exports.TEXCLASS.NONE) {
            return '';
        }
        if (prevClass === exports.TEXCLASS.VCENTER) {
            prevClass = exports.TEXCLASS.ORD;
        }
        if (texClass === exports.TEXCLASS.VCENTER) {
            texClass = exports.TEXCLASS.ORD;
        }
        var space = TEXSPACE[prevClass][texClass];
        if (this.prevLevel > 0 && this.attributes.get('scriptlevel') > 0 && space >= 0) {
            return '';
        }
        return TEXSPACELENGTH[Math.abs(space)];
    };
    AbstractMmlNode.prototype.hasSpacingAttributes = function () {
        return this.isEmbellished && this.coreMO().hasSpacingAttributes();
    };
    AbstractMmlNode.prototype.setInheritedAttributes = function (attributes, display, level, prime) {
        if (attributes === void 0) { attributes = {}; }
        if (display === void 0) { display = false; }
        if (level === void 0) { level = 0; }
        if (prime === void 0) { prime = false; }
        var defaults = this.attributes.getAllDefaults();
        try {
            for (var _a = __values(Object.keys(attributes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                if (defaults.hasOwnProperty(key)) {
                    var _c = __read(attributes[key], 2), node = _c[0], value = _c[1];
                    var noinherit = (AbstractMmlNode.noInherit[node] || {})[this.kind] || {};
                    if (!noinherit[key]) {
                        this.attributes.setInherited(key, value);
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var displaystyle = this.attributes.getExplicit('displaystyle');
        if (displaystyle === undefined) {
            this.attributes.setInherited('displaystyle', display);
        }
        var scriptlevel = this.attributes.getExplicit('scriptlevel');
        if (scriptlevel === undefined) {
            this.attributes.setInherited('scriptlevel', level);
        }
        if (prime) {
            this.setProperty('texprimestyle', prime);
        }
        var arity = this.arity;
        if (arity >= 0 && arity !== Infinity && ((arity === 1 && this.childNodes.length === 0) ||
            (arity !== 1 && this.childNodes.length !== arity))) {
            if (arity < this.childNodes.length) {
                this.childNodes = this.childNodes.slice(0, arity);
            }
            else {
                while (this.childNodes.length < arity) {
                    this.appendChild(this.factory.create('mrow'));
                }
            }
        }
        this.setChildInheritedAttributes(attributes, display, level, prime);
        var e_2, _d;
    };
    AbstractMmlNode.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                child.setInheritedAttributes(attributes, display, level, prime);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var e_3, _c;
    };
    AbstractMmlNode.prototype.addInheritedAttributes = function (current, attributes) {
        var updated = __assign({}, current);
        try {
            for (var _a = __values(Object.keys(attributes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_1 = _b.value;
                if (name_1 !== 'displaystyle' && name_1 !== 'scriptlevel' && name_1 !== 'style') {
                    updated[name_1] = [this.kind, attributes[name_1]];
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
        return updated;
        var e_4, _c;
    };
    AbstractMmlNode.prototype.inheritAttributesFrom = function (node) {
        var attributes = node.attributes;
        var display = attributes.get('display');
        var scriptlevel = attributes.get('scriptlevel');
        var defaults = {
            mathsize: ['math', attributes.get('mathsize')]
        };
        var prime = node.getProperty('texprimestyle') || false;
        this.setInheritedAttributes(defaults, display, scriptlevel, prime);
    };
    AbstractMmlNode.prototype.verifyTree = function (options) {
        if (options === void 0) { options = null; }
        if (options === null) {
            return;
        }
        this.verifyAttributes(options);
        var arity = this.arity;
        if (options['checkArity']) {
            if (arity >= 0 && arity !== Infinity &&
                ((arity === 1 && this.childNodes.length === 0) ||
                    (arity !== 1 && this.childNodes.length !== arity))) {
                this.mError('Wrong number of children for "' + this.kind + '" node', options, true);
            }
        }
        this.verifyChildren(options);
    };
    AbstractMmlNode.prototype.verifyAttributes = function (options) {
        if (options['checkAttributes']) {
            var attributes = this.attributes;
            var bad = [];
            try {
                for (var _a = __values(attributes.getExplicitNames()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var name_2 = _b.value;
                    if (name_2.substr(0, 5) !== 'data-' && attributes.getDefault(name_2) === undefined &&
                        !name_2.match(/^(?:class|style|id|(?:xlink:)?href)$/)) {
                        bad.push(name_2);
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_5) throw e_5.error; }
            }
            if (bad.length) {
                this.mError('Unknown attributes for ' + this.kind + ' node: ' + bad.join(', '), options);
            }
        }
        var e_5, _c;
    };
    AbstractMmlNode.prototype.verifyChildren = function (options) {
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                child.verifyTree(options);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_6) throw e_6.error; }
        }
        var e_6, _c;
    };
    AbstractMmlNode.prototype.mError = function (message, options, short) {
        if (short === void 0) { short = false; }
        if (this.parent && this.parent.isKind('merror')) {
            return;
        }
        var merror = this.factory.create('merror');
        if (options['fullErrors'] || short) {
            var mtext = this.factory.create('mtext');
            var text = this.factory.create('text');
            text.setText(options['fullErrors'] ? message : this.kind);
            mtext.appendChild(text);
            merror.appendChild(mtext);
            this.parent.replaceChild(merror, this);
        }
        else {
            this.parent.replaceChild(merror, this);
            merror.appendChild(this);
        }
        return merror;
    };
    return AbstractMmlNode;
}(Node_js_1.AbstractNode));
AbstractMmlNode.defaults = {
    mathbackground: Attributes_js_1.INHERIT,
    mathcolor: Attributes_js_1.INHERIT,
    mathsize: Attributes_js_1.INHERIT,
    dir: Attributes_js_1.INHERIT
};
AbstractMmlNode.noInherit = {
    mstyle: {
        mpadded: { width: true, height: true, depth: true, lspace: true, voffset: true },
        mtable: { width: true, height: true, depth: true, align: true }
    },
    maligngroup: {
        mrow: { groupalign: true },
        mtable: { groupalign: true }
    }
};
AbstractMmlNode.verifyDefaults = {
    checkArity: true,
    checkAttributes: false,
    fullErrors: false,
    fixMmultiscripts: true,
    fixMtables: true
};
exports.AbstractMmlNode = AbstractMmlNode;
var AbstractMmlTokenNode = (function (_super) {
    __extends(AbstractMmlTokenNode, _super);
    function AbstractMmlTokenNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractMmlTokenNode.prototype, "isToken", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMmlTokenNode.prototype.getText = function () {
        var text = '';
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                if (child instanceof TextNode) {
                    text += child.getText();
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return text;
        var e_7, _c;
    };
    AbstractMmlTokenNode.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                if (child instanceof AbstractMmlNode) {
                    child.setInheritedAttributes(attributes, display, level, prime);
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_8) throw e_8.error; }
        }
        var e_8, _c;
    };
    AbstractMmlTokenNode.prototype.walkTree = function (func, data) {
        func(this, data);
        try {
            for (var _a = __values(this.childNodes), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                if (child instanceof AbstractMmlNode) {
                    child.walkTree(func, data);
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return data;
        var e_9, _c;
    };
    return AbstractMmlTokenNode;
}(AbstractMmlNode));
AbstractMmlTokenNode.defaults = __assign({}, AbstractMmlNode.defaults, { mathvariant: 'normal', mathsize: Attributes_js_1.INHERIT });
exports.AbstractMmlTokenNode = AbstractMmlTokenNode;
var AbstractMmlLayoutNode = (function (_super) {
    __extends(AbstractMmlLayoutNode, _super);
    function AbstractMmlLayoutNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractMmlLayoutNode.prototype, "isSpacelike", {
        get: function () {
            return this.childNodes[0].isSpacelike;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlLayoutNode.prototype, "isEmbellished", {
        get: function () {
            return this.childNodes[0].isEmbellished;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlLayoutNode.prototype, "arity", {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMmlLayoutNode.prototype.core = function () {
        return this.childNodes[0];
    };
    AbstractMmlLayoutNode.prototype.coreMO = function () {
        return this.childNodes[0].coreMO();
    };
    AbstractMmlLayoutNode.prototype.setTeXclass = function (prev) {
        prev = this.childNodes[0].setTeXclass(prev);
        this.updateTeXclass(this.childNodes[0]);
        return prev;
    };
    return AbstractMmlLayoutNode;
}(AbstractMmlNode));
AbstractMmlLayoutNode.defaults = AbstractMmlNode.defaults;
exports.AbstractMmlLayoutNode = AbstractMmlLayoutNode;
var AbstractMmlBaseNode = (function (_super) {
    __extends(AbstractMmlBaseNode, _super);
    function AbstractMmlBaseNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractMmlBaseNode.prototype, "isEmbellished", {
        get: function () {
            return this.childNodes[0].isEmbellished;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMmlBaseNode.prototype.core = function () {
        return this.childNodes[0];
    };
    AbstractMmlBaseNode.prototype.coreMO = function () {
        return this.childNodes[0].coreMO();
    };
    AbstractMmlBaseNode.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        this.texClass = exports.TEXCLASS.NONE;
        var base = this.childNodes[0];
        if (base) {
            if (this.isEmbellished || base.isKind('mi')) {
                prev = base.setTeXclass(prev);
                this.updateTeXclass(this.core());
            }
            else {
                base.setTeXclass(null);
                prev = this;
            }
        }
        else {
            prev = this;
        }
        try {
            for (var _a = __values(this.childNodes.slice(1)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                if (child) {
                    child.setTeXclass(null);
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return prev;
        var e_10, _c;
    };
    return AbstractMmlBaseNode;
}(AbstractMmlNode));
AbstractMmlBaseNode.defaults = AbstractMmlNode.defaults;
exports.AbstractMmlBaseNode = AbstractMmlBaseNode;
var AbstractMmlEmptyNode = (function (_super) {
    __extends(AbstractMmlEmptyNode, _super);
    function AbstractMmlEmptyNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "isToken", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "isEmbellished", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "isSpacelike", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "linebreakContainer", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "hasNewLine", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "arity", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "isInferred", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "notParent", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "Parent", {
        get: function () {
            return this.parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "texClass", {
        get: function () {
            return exports.TEXCLASS.NONE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "prevClass", {
        get: function () {
            return exports.TEXCLASS.NONE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "prevLevel", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMmlEmptyNode.prototype.hasSpacingAttributes = function () {
        return false;
    };
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "attributes", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    AbstractMmlEmptyNode.prototype.core = function () {
        return this;
    };
    AbstractMmlEmptyNode.prototype.coreMO = function () {
        return this;
    };
    AbstractMmlEmptyNode.prototype.coreIndex = function () {
        return 0;
    };
    AbstractMmlEmptyNode.prototype.childPosition = function () {
        return 0;
    };
    AbstractMmlEmptyNode.prototype.setTeXclass = function (prev) {
        return prev;
    };
    AbstractMmlEmptyNode.prototype.texSpacing = function () {
        return '';
    };
    AbstractMmlEmptyNode.prototype.setInheritedAttributes = function (attributes, display, level, prime) { };
    AbstractMmlEmptyNode.prototype.inheritAttributesFrom = function (node) { };
    AbstractMmlEmptyNode.prototype.verifyTree = function (options) { };
    AbstractMmlEmptyNode.prototype.mError = function (message, options, short) {
        if (short === void 0) { short = false; }
    };
    return AbstractMmlEmptyNode;
}(Node_js_1.AbstractEmptyNode));
exports.AbstractMmlEmptyNode = AbstractMmlEmptyNode;
var TextNode = (function (_super) {
    __extends(TextNode, _super);
    function TextNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = '';
        return _this;
    }
    Object.defineProperty(TextNode.prototype, "kind", {
        get: function () {
            return 'text';
        },
        enumerable: true,
        configurable: true
    });
    TextNode.prototype.getText = function () {
        return this.text;
    };
    TextNode.prototype.setText = function (text) {
        this.text = text;
        return this;
    };
    TextNode.prototype.toString = function () {
        return this.text;
    };
    return TextNode;
}(AbstractMmlEmptyNode));
exports.TextNode = TextNode;
var XMLNode = (function (_super) {
    __extends(XMLNode, _super);
    function XMLNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.xml = null;
        return _this;
    }
    Object.defineProperty(XMLNode.prototype, "kind", {
        get: function () {
            return 'XML';
        },
        enumerable: true,
        configurable: true
    });
    XMLNode.prototype.getXML = function () {
        return this.xml;
    };
    XMLNode.prototype.setXML = function (xml) {
        this.xml = xml;
        return this;
    };
    XMLNode.prototype.toString = function () {
        return 'XML data';
    };
    return XMLNode;
}(AbstractMmlEmptyNode));
exports.XMLNode = XMLNode;
//# sourceMappingURL=MmlNode.js.map