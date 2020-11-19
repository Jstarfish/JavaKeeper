"use strict";
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
var MmlNode_js_1 = require("../../core/MmlTree/MmlNode.js");
var NodeUtil_js_1 = require("./NodeUtil.js");
var TexParser_js_1 = require("./TexParser.js");
var TexError_js_1 = require("./TexError.js");
var Entities_js_1 = require("../../util/Entities.js");
require("../../util/entities/n.js");
var ParseUtil;
(function (ParseUtil) {
    var emPerInch = 7.2;
    var pxPerInch = 72;
    var UNIT_CASES = {
        'em': function (m) { return m; },
        'ex': function (m) { return m * .43; },
        'pt': function (m) { return m / 10; },
        'pc': function (m) { return m * 1.2; },
        'px': function (m) { return m * emPerInch / pxPerInch; },
        'in': function (m) { return m * emPerInch; },
        'cm': function (m) { return m * emPerInch / 2.54; },
        'mm': function (m) { return m * emPerInch / 25.4; },
        'mu': function (m) { return m / 18; },
    };
    var num = '([-+]?([.,]\\d+|\\d+([.,]\\d*)?))';
    var unit = '(pt|em|ex|mu|px|mm|cm|in|pc)';
    var dimenEnd = RegExp('^\\s*' + num + '\\s*' + unit + '\\s*$');
    var dimenRest = RegExp('^\\s*' + num + '\\s*' + unit + ' ?');
    function matchDimen(dim, rest) {
        if (rest === void 0) { rest = false; }
        var match = dim.match(rest ? dimenRest : dimenEnd);
        return match ? [match[1].replace(/,/, '.'), match[4], match[0].length] :
            [null, null, 0];
    }
    ParseUtil.matchDimen = matchDimen;
    function dimen2em(dim) {
        var _a = __read(matchDimen(dim), 3), value = _a[0], unit = _a[1], _ = _a[2];
        var m = parseFloat(value || '1');
        var func = UNIT_CASES[unit];
        return func ? func(m) : 0;
    }
    ParseUtil.dimen2em = dimen2em;
    function Em(m) {
        if (Math.abs(m) < .0006) {
            return '0em';
        }
        return m.toFixed(3).replace(/\.?0+$/, '') + 'em';
    }
    ParseUtil.Em = Em;
    function fenced(configuration, open, mml, close) {
        var nf = configuration.nodeFactory;
        var mrow = nf.create('node', 'mrow', [], { open: open, close: close, texClass: MmlNode_js_1.TEXCLASS.INNER });
        var openNode = nf.create('text', open);
        var mo = nf.create('node', 'mo', [], { fence: true, stretchy: true, symmetric: true, texClass: MmlNode_js_1.TEXCLASS.OPEN }, openNode);
        NodeUtil_js_1.default.appendChildren(mrow, [mo]);
        if (NodeUtil_js_1.default.isType(mml, 'mrow') && NodeUtil_js_1.default.isInferred(mml)) {
            NodeUtil_js_1.default.appendChildren(mrow, NodeUtil_js_1.default.getChildren(mml));
        }
        else {
            NodeUtil_js_1.default.appendChildren(mrow, [mml]);
        }
        var closeNode = nf.create('text', close);
        mo = nf.create('node', 'mo', [], { fence: true, stretchy: true, symmetric: true, texClass: MmlNode_js_1.TEXCLASS.CLOSE }, closeNode);
        NodeUtil_js_1.default.appendChildren(mrow, [mo]);
        return mrow;
    }
    ParseUtil.fenced = fenced;
    function fixedFence(configuration, open, mml, close) {
        var mrow = configuration.nodeFactory.create('node', 'mrow', [], { open: open, close: close, texClass: MmlNode_js_1.TEXCLASS.ORD });
        if (open) {
            NodeUtil_js_1.default.appendChildren(mrow, [mathPalette(configuration, open, 'l')]);
        }
        if (NodeUtil_js_1.default.isType(mml, 'mrow')) {
            NodeUtil_js_1.default.appendChildren(mrow, NodeUtil_js_1.default.getChildren(mml));
        }
        else {
            NodeUtil_js_1.default.appendChildren(mrow, [mml]);
        }
        if (close) {
            NodeUtil_js_1.default.appendChildren(mrow, [mathPalette(configuration, close, 'r')]);
        }
        return mrow;
    }
    ParseUtil.fixedFence = fixedFence;
    function mathPalette(configuration, fence, side) {
        if (fence === '{' || fence === '}') {
            fence = '\\' + fence;
        }
        var D = '{\\bigg' + side + ' ' + fence + '}';
        var T = '{\\big' + side + ' ' + fence + '}';
        return new TexParser_js_1.default('\\mathchoice' + D + T + T + T, {}, configuration).mml();
    }
    ParseUtil.mathPalette = mathPalette;
    function fixInitialMO(configuration, nodes) {
        for (var i = 0, m = nodes.length; i < m; i++) {
            var child = nodes[i];
            if (child && (!NodeUtil_js_1.default.isType(child, 'mspace') &&
                (!NodeUtil_js_1.default.isType(child, 'TeXAtom') ||
                    (NodeUtil_js_1.default.getChildren(child)[0] &&
                        NodeUtil_js_1.default.getChildren(NodeUtil_js_1.default.getChildren(child)[0]).length)))) {
                if (NodeUtil_js_1.default.isEmbellished(child)) {
                    var mi = configuration.nodeFactory.create('node', 'mi');
                    nodes.unshift(mi);
                }
                break;
            }
        }
    }
    ParseUtil.fixInitialMO = fixInitialMO;
    function mi2mo(parser, mi) {
        var mo = parser.create('node', 'mo');
        NodeUtil_js_1.default.copyChildren(mi, mo);
        NodeUtil_js_1.default.copyAttributes(mi, mo);
        NodeUtil_js_1.default.setProperties(mo, { lspace: '0', rspace: '0' });
        NodeUtil_js_1.default.removeProperties(mo, 'movesupsub');
        return mo;
    }
    ParseUtil.mi2mo = mi2mo;
    function internalMath(parser, text, level) {
        var def = (parser.stack.env['font'] ? { mathvariant: parser.stack.env['font'] } : {});
        var mml = [], i = 0, k = 0, c, node, match = '', braces = 0;
        if (text.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
            while (i < text.length) {
                c = text.charAt(i++);
                if (c === '$') {
                    if (match === '$' && braces === 0) {
                        node = parser.create('node', 'TeXAtom', [(new TexParser_js_1.default(text.slice(k, i - 1), {}, parser.configuration)).mml()]);
                        mml.push(node);
                        match = '';
                        k = i;
                    }
                    else if (match === '') {
                        if (k < i - 1) {
                            mml.push(internalText(parser, text.slice(k, i - 1), def));
                        }
                        match = '$';
                        k = i;
                    }
                }
                else if (c === '{' && match !== '') {
                    braces++;
                }
                else if (c === '}') {
                    if (match === '}' && braces === 0) {
                        var atom = (new TexParser_js_1.default(text.slice(k, i), {}, parser.configuration)).mml();
                        node = parser.create('node', 'TeXAtom', [atom], def);
                        mml.push(node);
                        match = '';
                        k = i;
                    }
                    else if (match !== '') {
                        if (braces) {
                            braces--;
                        }
                    }
                }
                else if (c === '\\') {
                    if (match === '' && text.substr(i).match(/^(eq)?ref\s*\{/)) {
                        var len = RegExp['$&'].length;
                        if (k < i - 1) {
                            mml.push(internalText(parser, text.slice(k, i - 1), def));
                        }
                        match = '}';
                        k = i - 1;
                        i += len;
                    }
                    else {
                        c = text.charAt(i++);
                        if (c === '(' && match === '') {
                            if (k < i - 2) {
                                mml.push(internalText(parser, text.slice(k, i - 2), def));
                            }
                            match = ')';
                            k = i;
                        }
                        else if (c === ')' && match === ')' && braces === 0) {
                            node = parser.create('node', 'TeXAtom', [(new TexParser_js_1.default(text.slice(k, i - 2), {}, parser.configuration)).mml()]);
                            mml.push(node);
                            match = '';
                            k = i;
                        }
                        else if (c.match(/[${}\\]/) && match === '') {
                            i--;
                            text = text.substr(0, i - 1) + text.substr(i);
                        }
                    }
                }
            }
            if (match !== '') {
                throw new TexError_js_1.default('MathNotTerminated', 'Math not terminated in text box');
            }
        }
        if (k < text.length) {
            mml.push(internalText(parser, text.slice(k), def));
        }
        if (level != null) {
            mml = [parser.create('node', 'mstyle', mml, { displaystyle: false, scriptlevel: level })];
        }
        else if (mml.length > 1) {
            mml = [parser.create('node', 'mrow', mml)];
        }
        return mml;
    }
    ParseUtil.internalMath = internalMath;
    function internalText(parser, text, def) {
        text = text.replace(/^\s+/, Entities_js_1.entities.nbsp).replace(/\s+$/, Entities_js_1.entities.nbsp);
        var textNode = parser.create('text', text);
        return parser.create('node', 'mtext', [], def, textNode);
    }
    function trimSpaces(text) {
        if (typeof (text) !== 'string') {
            return text;
        }
        var TEXT = text.trim();
        if (TEXT.match(/\\$/) && text.match(/ $/)) {
            TEXT += ' ';
        }
        return TEXT;
    }
    ParseUtil.trimSpaces = trimSpaces;
    function setArrayAlign(array, align) {
        align = ParseUtil.trimSpaces(align || '');
        if (align === 't') {
            array.arraydef.align = 'baseline 1';
        }
        else if (align === 'b') {
            array.arraydef.align = 'baseline -1';
        }
        else if (align === 'c') {
            array.arraydef.align = 'center';
        }
        else if (align) {
            array.arraydef.align = align;
        }
        return array;
    }
    ParseUtil.setArrayAlign = setArrayAlign;
    function substituteArgs(parser, args, str) {
        var text = '';
        var newstring = '';
        var i = 0;
        while (i < str.length) {
            var c = str.charAt(i++);
            if (c === '\\') {
                text += c + str.charAt(i++);
            }
            else if (c === '#') {
                c = str.charAt(i++);
                if (c === '#') {
                    text += c;
                }
                else {
                    if (!c.match(/[1-9]/) || parseInt(c, 10) > args.length) {
                        throw new TexError_js_1.default('IllegalMacroParam', 'Illegal macro parameter reference');
                    }
                    newstring = addArgs(parser, addArgs(parser, newstring, text), args[parseInt(c, 10) - 1]);
                    text = '';
                }
            }
            else {
                text += c;
            }
        }
        return addArgs(parser, newstring, text);
    }
    ParseUtil.substituteArgs = substituteArgs;
    function addArgs(parser, s1, s2) {
        if (s2.match(/^[a-z]/i) && s1.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {
            s1 += ' ';
        }
        if (s1.length + s2.length > parser.configuration.options['maxBuffer']) {
            throw new TexError_js_1.default('MaxBufferSize', 'MathJax internal buffer size exceeded; is there a' +
                ' recursive macro call?');
        }
        return s1 + s2;
    }
    ParseUtil.addArgs = addArgs;
    function checkEqnEnv(parser) {
        if (parser.stack.global.eqnenv) {
            throw new TexError_js_1.default('ErroneousNestingEq', 'Erroneous nesting of equation structures');
        }
        parser.stack.global.eqnenv = true;
    }
    ParseUtil.checkEqnEnv = checkEqnEnv;
    ;
    function MmlFilterAttribute(parser, name, value) {
        return value;
    }
    ParseUtil.MmlFilterAttribute = MmlFilterAttribute;
    ;
    function getFontDef(parser) {
        var font = parser.stack.env['font'];
        return (font ? { mathvariant: font } : {});
    }
    ParseUtil.getFontDef = getFontDef;
    ;
    function splitPackageOptions(attrib, allowed) {
        if (allowed === void 0) { allowed = {}; }
        var def = {};
        if (attrib !== '') {
            var attr = attrib.replace(/ /g, '').split(/,/);
            for (var i = 0, m = attr.length; i < m; i++) {
                var keyvalue = attr[i].split(/[:=]/);
                if (allowed[keyvalue[0]]) {
                    var value = keyvalue[1];
                    def[keyvalue[0]] = (value === 'true') ? true :
                        (value === 'false') ? false : value;
                }
            }
        }
        return def;
    }
    ParseUtil.splitPackageOptions = splitPackageOptions;
})(ParseUtil || (ParseUtil = {}));
exports.default = ParseUtil;
//# sourceMappingURL=ParseUtil.js.map