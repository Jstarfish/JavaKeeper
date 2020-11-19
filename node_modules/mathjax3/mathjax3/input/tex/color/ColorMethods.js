"use strict";
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
var NodeUtil_js_1 = require("../NodeUtil.js");
var ParseUtil_js_1 = require("../ParseUtil.js");
var TexError_js_1 = require("../TexError.js");
var ColorConstants_js_1 = require("./ColorConstants.js");
function padding(colorPadding) {
    var pad = "+" + colorPadding;
    var unit = colorPadding.replace(/^.*?([a-z]*)$/, '$1');
    var pad2 = 2 * parseFloat(pad);
    return {
        width: "+" + pad2 + unit,
        height: pad,
        depth: pad,
        lspace: colorPadding,
    };
}
;
exports.ColorModelProcessors = {};
function getColor(parserOptions, model, def) {
    if (!model) {
        model = 'named';
    }
    if (exports.ColorModelProcessors.hasOwnProperty(model)) {
        var modelProcessor = exports.ColorModelProcessors[model];
        return modelProcessor(parserOptions, def);
    }
    else {
        throw new TexError_js_1.default('UndefinedColorModel', 'Color model \'%1\' not defined', model);
    }
}
exports.getColor = getColor;
exports.ColorModelProcessors.named = function (parserOptions, name) {
    if (parserOptions.definedColors && parserOptions.definedColors.has(name)) {
        return parserOptions.definedColors.get(name);
    }
    else if (ColorConstants_js_1.COLORS.has(name)) {
        return ColorConstants_js_1.COLORS.get(name);
    }
    else {
        return name;
    }
};
exports.ColorModelProcessors.rgb = function (parserOptions, rgb) {
    var rgbParts = rgb.trim().split(/\s*,\s*/);
    var RGB = '#';
    if (rgbParts.length !== 3) {
        throw new TexError_js_1.default('ModelArg1', 'Color values for the %1 model require 3 numbers', 'rgb');
    }
    try {
        for (var rgbParts_1 = __values(rgbParts), rgbParts_1_1 = rgbParts_1.next(); !rgbParts_1_1.done; rgbParts_1_1 = rgbParts_1.next()) {
            var rgbPart = rgbParts_1_1.value;
            if (!rgbPart.match(/^(\d+(\.\d*)?|\.\d+)$/)) {
                throw new TexError_js_1.default('InvalidDecimalNumber', 'Invalid decimal number');
            }
            var n = parseFloat(rgbPart);
            if (n < 0 || n > 1) {
                throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'rgb', '0', '1');
            }
            var pn = Math.floor(n * 255).toString(16);
            if (pn.length < 2) {
                pn = '0' + pn;
            }
            RGB += pn;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rgbParts_1_1 && !rgbParts_1_1.done && (_a = rgbParts_1.return)) _a.call(rgbParts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return RGB;
    var e_1, _a;
};
exports.ColorModelProcessors.RGB = function (parserOptions, rgb) {
    var rgbParts = rgb.trim().split(/\s*,\s*/);
    var RGB = '#';
    if (rgbParts.length !== 3) {
        throw new TexError_js_1.default('ModelArg1', 'Color values for the %1 model require 3 numbers', 'RGB');
    }
    try {
        for (var rgbParts_2 = __values(rgbParts), rgbParts_2_1 = rgbParts_2.next(); !rgbParts_2_1.done; rgbParts_2_1 = rgbParts_2.next()) {
            var rgbPart = rgbParts_2_1.value;
            if (!rgbPart.match(/^\d+$/)) {
                throw new TexError_js_1.default('InvalidNumber', 'Invalid number');
            }
            var n = parseInt(rgbPart);
            if (n > 255) {
                throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'RGB', '0', '255');
            }
            var pn = n.toString(16);
            if (pn.length < 2) {
                pn = '0' + pn;
            }
            RGB += pn;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (rgbParts_2_1 && !rgbParts_2_1.done && (_a = rgbParts_2.return)) _a.call(rgbParts_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return RGB;
    var e_2, _a;
};
exports.ColorModelProcessors.gray = function (parserOptions, gray) {
    if (!gray.match(/^\s*(\d+(\.\d*)?|\.\d+)\s*$/)) {
        throw new TexError_js_1.default('InvalidDecimalNumber', 'Invalid decimal number');
    }
    var n = parseFloat(gray);
    if (n < 0 || n > 1) {
        throw new TexError_js_1.default('ModelArg2', 'Color values for the %1 model must be between %2 and %3', 'gray', '0', '1');
    }
    var pn = Math.floor(n * 255).toString(16);
    if (pn.length < 2) {
        pn = '0' + pn;
    }
    return "#" + pn + pn + pn;
};
exports.ColorMethods = {};
exports.ColorMethods.Color = function (parser, name) {
    var model = parser.GetBrackets(name, '');
    var colorDef = parser.GetArgument(name);
    var color = getColor(parser.options, model, colorDef);
    var style = parser.itemFactory.create('style')
        .setProperties({ styles: { mathcolor: color } });
    parser.stack.env['color'] = color;
    parser.Push(style);
};
exports.ColorMethods.TextColor = function (parser, name) {
    var model = parser.GetBrackets(name, '');
    var colorDef = parser.GetArgument(name);
    var color = getColor(parser.options, model, colorDef);
    var old = parser.stack.env['color'];
    parser.stack.env['color'] = color;
    var math = parser.ParseArg(name);
    if (old) {
        parser.stack.env['color'] = old;
    }
    else {
        delete parser.stack.env['color'];
    }
    var node = parser.configuration.nodeFactory.create('node', 'mstyle', [math], { mathcolor: color });
    parser.Push(node);
};
exports.ColorMethods.DefineColor = function (parser, name) {
    var cname = parser.GetArgument(name), model = parser.GetArgument(name), def = parser.GetArgument(name);
    if (!parser.options.definedColors) {
        parser.options.definedColors = new Map();
    }
    parser.options.definedColors.set(cname, getColor(parser.options, model, def));
};
exports.ColorMethods.ColorBox = function (parser, name) {
    var cname = parser.GetArgument(name), math = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name));
    var node = parser.configuration.nodeFactory.create('node', 'mpadded', math, {
        mathbackground: getColor(parser.options, 'named', cname)
    });
    NodeUtil_js_1.default.setProperties(node, padding(parser.options.colorPadding));
    parser.Push(node);
};
exports.ColorMethods.FColorBox = function (parser, name) {
    var fname = parser.GetArgument(name), cname = parser.GetArgument(name), math = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name));
    var node = parser.configuration.nodeFactory.create('node', 'mpadded', math, {
        mathbackground: getColor(parser.options, 'named', cname),
        style: "border: " + parser.options.colorBorderWidth + " solid " + getColor(parser.options, 'named', fname)
    });
    NodeUtil_js_1.default.setProperties(node, padding(parser.options.colorPadding));
    parser.Push(node);
};
//# sourceMappingURL=ColorMethods.js.map