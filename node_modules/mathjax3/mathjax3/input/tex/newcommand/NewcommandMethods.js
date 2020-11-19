"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TexError_js_1 = require("../TexError.js");
var sm = require("../SymbolMap.js");
var BaseMethods_js_1 = require("../base/BaseMethods.js");
var ParseUtil_js_1 = require("../ParseUtil.js");
var NewcommandUtil_js_1 = require("./NewcommandUtil.js");
var NewcommandMethods = {};
NewcommandMethods.NewCommand = function (parser, name) {
    var cs = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    var n = parser.GetBrackets(name);
    var opt = parser.GetBrackets(name);
    var def = parser.GetArgument(name);
    if (cs.charAt(0) === '\\') {
        cs = cs.substr(1);
    }
    if (!cs.match(/^(.|[a-z]+)$/i)) {
        throw new TexError_js_1.default('IllegalControlSequenceName', 'Illegal control sequence name for %1', name);
    }
    if (n) {
        n = ParseUtil_js_1.default.trimSpaces(n);
        if (!n.match(/^[0-9]+$/)) {
            throw new TexError_js_1.default('IllegalParamNumber', 'Illegal number of parameters specified in %1', name);
        }
    }
    NewcommandUtil_js_1.default.addMacro(parser, cs, NewcommandMethods.Macro, [def, n, opt]);
};
NewcommandMethods.NewEnvironment = function (parser, name) {
    var env = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    var n = parser.GetBrackets(name);
    var opt = parser.GetBrackets(name);
    var bdef = parser.GetArgument(name);
    var edef = parser.GetArgument(name);
    if (n) {
        n = ParseUtil_js_1.default.trimSpaces(n);
        if (!n.match(/^[0-9]+$/)) {
            throw new TexError_js_1.default('IllegalParamNumber', 'Illegal number of parameters specified in %1', name);
        }
    }
    NewcommandUtil_js_1.default.addEnvironment(parser, env, NewcommandMethods.BeginEnv, [true, bdef, edef, n, opt]);
};
NewcommandMethods.MacroDef = function (parser, name) {
    var cs = NewcommandUtil_js_1.default.GetCSname(parser, name);
    var params = NewcommandUtil_js_1.default.GetTemplate(parser, name, '\\' + cs);
    var def = parser.GetArgument(name);
    !(params instanceof Array) ?
        NewcommandUtil_js_1.default.addMacro(parser, cs, NewcommandMethods.Macro, [def, params]) :
        NewcommandUtil_js_1.default.addMacro(parser, cs, NewcommandMethods.MacroWithTemplate, [def].concat(params));
};
NewcommandMethods.Let = function (parser, name) {
    var cs = NewcommandUtil_js_1.default.GetCSname(parser, name);
    var c = parser.GetNext();
    if (c === '=') {
        parser.i++;
        c = parser.GetNext();
    }
    var handlers = parser.configuration.handlers;
    if (c === '\\') {
        name = NewcommandUtil_js_1.default.GetCSname(parser, name);
        var macro_1 = handlers.get('delimiter').lookup('\\' + name);
        if (macro_1) {
            NewcommandUtil_js_1.default.addDelimiter(parser, '\\' + cs, macro_1.char, macro_1.attributes);
            return;
        }
        var map_1 = handlers.get('macro').applicable(name);
        if (!map_1) {
            return;
        }
        if (map_1 instanceof sm.MacroMap) {
            var macro_2 = map_1.lookup(name);
            NewcommandUtil_js_1.default.addMacro(parser, cs, macro_2.func, macro_2.args, macro_2.symbol);
            return;
        }
        macro_1 = map_1.lookup(name);
        var newArgs = NewcommandUtil_js_1.default.disassembleSymbol(cs, macro_1);
        var method = function (p, cs) {
            var rest = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                rest[_i - 2] = arguments[_i];
            }
            var symb = NewcommandUtil_js_1.default.assembleSymbol(rest);
            return map_1.parser(p, symb);
        };
        NewcommandUtil_js_1.default.addMacro(parser, cs, method, newArgs);
        return;
    }
    parser.i++;
    var macro = handlers.get('delimiter').lookup(c);
    if (macro) {
        NewcommandUtil_js_1.default.addDelimiter(parser, '\\' + cs, macro.char, macro.attributes);
        return;
    }
    NewcommandUtil_js_1.default.addMacro(parser, cs, NewcommandMethods.Macro, [c]);
};
NewcommandMethods.MacroWithTemplate = function (parser, name, text, n) {
    var params = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        params[_i - 4] = arguments[_i];
    }
    var argCount = parseInt(n, 10);
    if (argCount) {
        var args = [];
        parser.GetNext();
        if (params[0] && !NewcommandUtil_js_1.default.MatchParam(parser, params[0])) {
            throw new TexError_js_1.default('MismatchUseDef', 'Use of %1 doesn\'t match its definition', name);
        }
        for (var i = 0; i < argCount; i++) {
            args.push(NewcommandUtil_js_1.default.GetParameter(parser, name, params[i + 1]));
        }
        text = ParseUtil_js_1.default.substituteArgs(parser, args, text);
    }
    parser.string = ParseUtil_js_1.default.addArgs(parser, text, parser.string.slice(parser.i));
    parser.i = 0;
    if (++parser.macroCount > parser.configuration.options['maxMacros']) {
        throw new TexError_js_1.default('MaxMacroSub1', 'MathJax maximum macro substitution count exceeded; ' +
            'is here a recursive macro call?');
    }
};
NewcommandMethods.BeginEnv = function (parser, begin, bdef, edef, n, def) {
    if (begin.getProperty('end') && parser.stack.env['closing'] === begin.getName()) {
        delete parser.stack.env['closing'];
        var rest = parser.string.slice(parser.i);
        parser.string = edef;
        parser.i = 0;
        parser.Parse();
        parser.string = rest;
        parser.i = 0;
        return parser.itemFactory.create('end').setProperty('name', begin.getName());
    }
    if (n) {
        var args = [];
        if (def != null) {
            var optional = parser.GetBrackets('\\begin{' + begin.getName() + '}');
            args.push(optional == null ? def : optional);
        }
        for (var i = args.length; i < n; i++) {
            args.push(parser.GetArgument('\\begin{' + begin.getName() + '}'));
        }
        bdef = ParseUtil_js_1.default.substituteArgs(parser, args, bdef);
        edef = ParseUtil_js_1.default.substituteArgs(parser, [], edef);
    }
    parser.string = ParseUtil_js_1.default.addArgs(parser, bdef, parser.string.slice(parser.i));
    parser.i = 0;
    return parser.itemFactory.create('beginEnv').setProperty('name', begin.getName());
};
NewcommandMethods.Macro = BaseMethods_js_1.default.Macro;
exports.default = NewcommandMethods;
//# sourceMappingURL=NewcommandMethods.js.map