"use strict";
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
var MmlNode_js_1 = require("../../core/MmlTree/MmlNode.js");
var Options_js_1 = require("../../util/Options.js");
var Entities = require("../../util/Entities.js");
var MathMLCompile = (function () {
    function MathMLCompile(options) {
        if (options === void 0) { options = {}; }
        var Class = this.constructor;
        this.options = Options_js_1.userOptions(Options_js_1.defaultOptions({}, Class.OPTIONS), options);
        if (this.options['verify']) {
            this.options['verify'] = Options_js_1.userOptions(Options_js_1.defaultOptions({}, Class.VERIFY), this.options['verify']);
        }
    }
    MathMLCompile.prototype.setMmlFactory = function (mmlFactory) {
        this.factory = mmlFactory;
    };
    MathMLCompile.prototype.compile = function (node) {
        var mml = this.makeNode(node);
        mml.verifyTree(this.options['verify']);
        mml.setInheritedAttributes({}, false, 0, false);
        mml.walkTree(this.markMrows);
        return mml;
    };
    MathMLCompile.prototype.makeNode = function (node) {
        var limits = false, texClass = '';
        var type = this.adaptor.kind(node).replace(/^.*:/, '');
        try {
            for (var _a = __values(this.adaptor.allClasses(node)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_1 = _b.value;
                if (name_1.match(/^MJX-TeXAtom-/)) {
                    texClass = name_1.substr(12);
                    type = 'TeXAtom';
                }
                else if (name_1 === 'MJX-fixedlimits') {
                    limits = true;
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
        this.factory.getNodeClass(type) || this.error('Unknown node type "' + type + '"');
        var mml = this.factory.create(type);
        if (texClass) {
            this.texAtom(mml, texClass, limits);
        }
        this.addAttributes(mml, node);
        this.checkClass(mml, node);
        this.addChildren(mml, node);
        return mml;
        var e_1, _c;
    };
    MathMLCompile.prototype.addAttributes = function (mml, node) {
        try {
            for (var _a = __values(this.adaptor.allAttributes(node)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var attr = _b.value;
                var name_2 = attr.name;
                if (name_2 !== 'class') {
                    var value = this.filterAttribute(name_2, attr.value);
                    if (value !== null) {
                        var val = value.toLowerCase();
                        if (val === 'true' || val === 'false') {
                            mml.attributes.set(name_2, val === 'true');
                        }
                        else {
                            mml.attributes.set(name_2, value);
                        }
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
        var e_2, _c;
    };
    MathMLCompile.prototype.filterAttribute = function (name, value) {
        return value;
    };
    MathMLCompile.prototype.addChildren = function (mml, node) {
        if (mml.arity === 0) {
            return;
        }
        try {
            for (var _a = __values(this.adaptor.childNodes((node))), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                var name_3 = this.adaptor.kind(child);
                if (name_3 === '#comment') {
                    continue;
                }
                if (name_3 === '#text') {
                    this.addText(mml, child);
                }
                else if (mml.isKind('annotation-xml')) {
                    mml.appendChild(this.factory.create('XML').setXML(child));
                }
                else {
                    var childMml = mml.appendChild(this.makeNode(child));
                    if (childMml.arity === 0 && this.adaptor.childNodes(child).length) {
                        if (this.options['fixMisplacedChildren']) {
                            this.addChildren(mml, child);
                        }
                        else {
                            childMml.mError('There should not be children for ' + childMml.kind + ' nodes', this.options['verify'], true);
                        }
                    }
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
        var e_3, _c;
    };
    MathMLCompile.prototype.addText = function (mml, child) {
        var text = this.adaptor.value(child);
        if ((mml.isToken || mml.getProperty('isChars')) && mml.arity) {
            if (mml.isToken) {
                text = Entities.translate(text);
                text = this.trimSpace(text);
            }
            mml.appendChild(this.factory.create('text').setText(text));
        }
        else if (text.match(/\S/)) {
            this.error('Unexpected text node "' + text + '"');
        }
    };
    MathMLCompile.prototype.checkClass = function (mml, node) {
        var classList = [];
        try {
            for (var _a = __values(this.adaptor.allClasses(node)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_4 = _b.value;
                if (name_4.substr(0, 4) === 'MJX-') {
                    if (name_4 === 'MJX-variant') {
                        mml.setProperty('variantForm', true);
                    }
                    else if (name_4.substr(0, 11) !== 'MJX-TeXAtom') {
                        mml.attributes.set('mathvariant', name_4.substr(3));
                    }
                }
                else {
                    classList.push(name_4);
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
        if (classList.length) {
            mml.attributes.set('class', classList.join(' '));
        }
        var e_4, _c;
    };
    MathMLCompile.prototype.texAtom = function (mml, texClass, limits) {
        mml.texClass = MmlNode_js_1.TEXCLASS[texClass];
        if (texClass === 'OP' && !limits) {
            mml.setProperty('movesupsub', true);
            mml.attributes.setInherited('movablelimits', true);
        }
    };
    MathMLCompile.prototype.markMrows = function (mml) {
        if (mml.isKind('mrow') && !mml.isInferred && mml.childNodes.length >= 2) {
            var first = mml.childNodes[0];
            var last = mml.childNodes[mml.childNodes.length - 1];
            if (first.isKind('mo') && first.attributes.get('fence') &&
                last.isKind('mo') && last.attributes.get('fence')) {
                if (first.childNodes.length) {
                    mml.setProperty('open', first.getText());
                }
                if (last.childNodes.length) {
                    mml.setProperty('close', last.getText());
                }
            }
        }
    };
    MathMLCompile.prototype.trimSpace = function (text) {
        return text.replace(/[\t\n\r]/g, ' ')
            .trim()
            .replace(/  +/g, ' ');
    };
    MathMLCompile.prototype.error = function (message) {
        throw new Error(message);
    };
    return MathMLCompile;
}());
MathMLCompile.OPTIONS = {
    MmlFactory: null,
    fixMisplacedChildren: true,
    verify: {},
    translateEntities: true
};
MathMLCompile.VERIFY = __assign({}, MmlNode_js_1.AbstractMmlNode.verifyDefaults);
exports.MathMLCompile = MathMLCompile;
//# sourceMappingURL=MathMLCompile.js.map