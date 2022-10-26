"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParseUtil_js_1 = require("../ParseUtil.js");
var NodeUtil_js_1 = require("../NodeUtil.js");
var TexConstants_js_1 = require("../TexConstants.js");
var TexParser_js_1 = require("../TexParser.js");
var TexError_js_1 = require("../TexError.js");
var Symbol_js_1 = require("../Symbol.js");
var MapHandler_js_1 = require("../MapHandler.js");
var BaseMethods_js_1 = require("../base/BaseMethods.js");
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var AmsMethods = {};
AmsMethods.AmsEqnArray = function (parser, begin, numbered, taggable, align, spacing, style) {
    var args = parser.GetBrackets('\\begin{' + begin.getName() + '}');
    var array = BaseMethods_js_1.default.EqnArray(parser, begin, numbered, taggable, align, spacing, style);
    return ParseUtil_js_1.default.setArrayAlign(array, args);
};
AmsMethods.AlignAt = function (parser, begin, numbered, taggable) {
    var name = begin.getName();
    var n, valign, align = '', spacing = [];
    if (!taggable) {
        valign = parser.GetBrackets('\\begin{' + name + '}');
    }
    n = parser.GetArgument('\\begin{' + name + '}');
    if (n.match(/[^0-9]/)) {
        throw new TexError_js_1.default('PositiveIntegerArg', 'Argument to %1 must me a positive integer', '\\begin{' + name + '}');
    }
    var count = parseInt(n, 10);
    while (count > 0) {
        align += 'rl';
        spacing.push('0em 0em');
        count--;
    }
    var spaceStr = spacing.join(' ');
    if (taggable) {
        return AmsMethods.EqnArray(parser, begin, numbered, taggable, align, spaceStr);
    }
    var array = AmsMethods.EqnArray(parser, begin, numbered, taggable, align, spaceStr);
    return ParseUtil_js_1.default.setArrayAlign(array, valign);
};
AmsMethods.Multline = function (parser, begin, numbered) {
    parser.Push(begin);
    ParseUtil_js_1.default.checkEqnEnv(parser);
    var item = parser.itemFactory.create('multline', numbered, parser.stack);
    item.arraydef = {
        displaystyle: true,
        rowspacing: '.5em',
        columnwidth: '100%',
        width: parser.options['MultLineWidth'],
        side: parser.options['TagSide'],
        minlabelspacing: parser.options['TagIndent']
    };
    return item;
};
AmsMethods.HandleDeclareOp = function (parser, name) {
    var limits = (parser.GetStar() ? '' : '\\nolimits\\SkipLimits');
    var cs = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    if (cs.charAt(0) === '\\') {
        cs = cs.substr(1);
    }
    var op = parser.GetArgument(name);
    op = op.replace(/\*/g, '\\text{*}').replace(/-/g, '\\text{-}');
    MapHandler_js_1.MapHandler.getMap('new-Command').
        add(cs, new Symbol_js_1.Macro(cs, AmsMethods.Macro, ['\\mathop{\\rm ' + op + '}' + limits]));
};
AmsMethods.HandleOperatorName = function (parser, name) {
    var limits = (parser.GetStar() ? '' : '\\nolimits\\SkipLimits');
    var op = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    op = op.replace(/\*/g, '\\text{*}').replace(/-/g, '\\text{-}');
    parser.string = '\\mathop{\\rm ' + op + '}' + limits + ' ' +
        parser.string.slice(parser.i);
    parser.i = 0;
};
AmsMethods.SkipLimits = function (parser, name) {
    var c = parser.GetNext(), i = parser.i;
    if (c === '\\' && ++parser.i && parser.GetCS() !== 'limits') {
        parser.i = i;
    }
};
AmsMethods.MultiIntegral = function (parser, name, integral) {
    var next = parser.GetNext();
    if (next === '\\') {
        var i = parser.i;
        next = parser.GetArgument(name);
        parser.i = i;
        if (next === '\\limits') {
            if (name === '\\idotsint') {
                integral = '\\!\\!\\mathop{\\,\\,' + integral + '}';
            }
            else {
                integral = '\\!\\!\\!\\mathop{\\,\\,\\,' + integral + '}';
            }
        }
    }
    parser.string = integral + ' ' + parser.string.slice(parser.i);
    parser.i = 0;
};
AmsMethods.xArrow = function (parser, name, chr, l, r) {
    var def = { width: '+' + (l + r) + 'mu', lspace: l + 'mu' };
    var bot = parser.GetBrackets(name);
    var first = parser.ParseArg(name);
    var arrow = parser.create('token', 'mo', { stretchy: true, texClass: MmlNode_js_1.TEXCLASS.REL }, String.fromCharCode(chr));
    var mml = parser.create('node', 'munderover', [arrow]);
    var mpadded = parser.create('node', 'mpadded', [first], def);
    NodeUtil_js_1.default.setAttribute(mpadded, 'voffset', '.15em');
    NodeUtil_js_1.default.setChild(mml, mml.over, mpadded);
    if (bot) {
        var bottom = new TexParser_js_1.default(bot, parser.stack.env, parser.configuration).mml();
        mpadded = parser.create('node', 'mpadded', [bottom], def);
        NodeUtil_js_1.default.setAttribute(mpadded, 'voffset', '-.24em');
        NodeUtil_js_1.default.setChild(mml, mml.under, mpadded);
    }
    NodeUtil_js_1.default.setProperty(mml, 'subsupOK', true);
    parser.Push(mml);
};
AmsMethods.HandleShove = function (parser, name, shove) {
    var top = parser.stack.Top();
    if (top.kind !== 'multline') {
        throw new TexError_js_1.default('CommandOnlyAllowedInEnv', '%1 only allowed in %2 environment', parser.currentCS, 'multline');
    }
    if (top.Size()) {
        throw new TexError_js_1.default('CommandAtTheBeginingOfLine', '%1 must come at the beginning of the line', parser.currentCS);
    }
    top.setProperty('shove', shove);
};
AmsMethods.CFrac = function (parser, name) {
    var lr = ParseUtil_js_1.default.trimSpaces(parser.GetBrackets(name, ''));
    var num = parser.GetArgument(name);
    var den = parser.GetArgument(name);
    var lrMap = {
        l: TexConstants_js_1.TexConstant.Align.LEFT, r: TexConstants_js_1.TexConstant.Align.RIGHT, '': ''
    };
    var numNode = new TexParser_js_1.default('\\strut\\textstyle{' + num + '}', parser.stack.env, parser.configuration).mml();
    var denNode = new TexParser_js_1.default('\\strut\\textstyle{' + den + '}', parser.stack.env, parser.configuration).mml();
    var frac = parser.create('node', 'mfrac', [numNode, denNode]);
    lr = lrMap[lr];
    if (lr == null) {
        throw new TexError_js_1.default('IllegalAlign', 'Illegal alignment specified in %1', parser.currentCS);
    }
    if (lr) {
        NodeUtil_js_1.default.setProperties(frac, { numalign: lr, denomalign: lr });
    }
    parser.Push(frac);
};
AmsMethods.Genfrac = function (parser, name, left, right, thick, style) {
    if (left == null) {
        left = parser.GetDelimiterArg(name);
    }
    if (right == null) {
        right = parser.GetDelimiterArg(name);
    }
    if (thick == null) {
        thick = parser.GetArgument(name);
    }
    if (style == null) {
        style = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    }
    var num = parser.ParseArg(name);
    var den = parser.ParseArg(name);
    var frac = parser.create('node', 'mfrac', [num, den]);
    if (thick !== '') {
        NodeUtil_js_1.default.setAttribute(frac, 'linethickness', thick);
    }
    if (left || right) {
        NodeUtil_js_1.default.setProperty(frac, 'withDelims', true);
        frac = ParseUtil_js_1.default.fixedFence(parser.configuration, left, frac, right);
    }
    if (style !== '') {
        var styleDigit = parseInt(style, 10);
        var styleAlpha = ['D', 'T', 'S', 'SS'][styleDigit];
        if (styleAlpha == null) {
            throw new TexError_js_1.default('BadMathStyleFor', 'Bad math style for %1', parser.currentCS);
        }
        frac = parser.create('node', 'mstyle', [frac]);
        if (styleAlpha === 'D') {
            NodeUtil_js_1.default.setProperties(frac, { displaystyle: true, scriptlevel: 0 });
        }
        else {
            NodeUtil_js_1.default.setProperties(frac, { displaystyle: false,
                scriptlevel: styleDigit - 1 });
        }
    }
    parser.Push(frac);
};
AmsMethods.HandleTag = function (parser, name) {
    if (!parser.tags.currentTag.taggable && parser.tags.env) {
        throw new TexError_js_1.default('CommandNotAllowedInEnv', '%1 not allowed in %2 environment', parser.currentCS, parser.tags.env);
    }
    if (parser.tags.currentTag.tag) {
        throw new TexError_js_1.default('MultipleCommand', 'Multiple %1', parser.currentCS);
    }
    var star = parser.GetStar();
    var tagId = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    parser.tags.tag(tagId, star);
};
AmsMethods.HandleNoTag = BaseMethods_js_1.default.HandleNoTag;
AmsMethods.HandleRef = BaseMethods_js_1.default.HandleRef;
AmsMethods.Macro = BaseMethods_js_1.default.Macro;
AmsMethods.Accent = BaseMethods_js_1.default.Accent;
AmsMethods.Tilde = BaseMethods_js_1.default.Tilde;
AmsMethods.Array = BaseMethods_js_1.default.Array;
AmsMethods.Spacer = BaseMethods_js_1.default.Spacer;
AmsMethods.NamedOp = BaseMethods_js_1.default.NamedOp;
AmsMethods.EqnArray = BaseMethods_js_1.default.EqnArray;
exports.default = AmsMethods;
//# sourceMappingURL=AmsMethods.js.map