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
var Configuration_js_1 = require("../Configuration.js");
var MapHandler_js_1 = require("../MapHandler.js");
var TexError_js_1 = require("../TexError.js");
var NodeUtil_js_1 = require("../NodeUtil.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var bitem = require("./BaseItems.js");
var Tags_js_1 = require("../Tags.js");
require("./BaseMappings.js");
new SymbolMap_js_1.CharacterMap('remap', null, {
    '-': '\u2212',
    '*': '\u2217',
    '`': '\u2018'
});
function Other(parser, char) {
    var font = parser.stack.env['font'];
    var def = font ?
        { mathvariant: parser.stack.env['font'] } : {};
    var remap = MapHandler_js_1.MapHandler.getMap('remap').
        lookup(char);
    var mo = parser.create('token', 'mo', def, (remap ? remap.char : char));
    NodeUtil_js_1.default.setProperty(mo, 'fixStretchy', true);
    parser.configuration.addNode('fixStretchy', mo);
    parser.Push(mo);
}
exports.Other = Other;
;
function csUndefined(parser, name) {
    throw new TexError_js_1.default('UndefinedControlSequence', 'Undefined control sequence %1', '\\' + name);
}
;
function envUndefined(parser, env) {
    throw new TexError_js_1.default('UnknownEnv', 'Unknown environment \'%1\'', env);
}
;
var BaseTags = (function (_super) {
    __extends(BaseTags, _super);
    function BaseTags() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseTags;
}(Tags_js_1.AbstractTags));
exports.BaseTags = BaseTags;
exports.BaseConfiguration = Configuration_js_1.Configuration.create('base', { handler: {
        character: ['command', 'special', 'letter', 'digit'],
        delimiter: ['delimiter'],
        macro: ['delimiter', 'macros', 'mathchar0mi', 'mathchar0mo', 'mathchar7'],
        environment: ['environment']
    },
    fallback: {
        character: Other,
        macro: csUndefined,
        environment: envUndefined
    },
    items: (_a = {},
        _a[bitem.StartItem.prototype.kind] = bitem.StartItem,
        _a[bitem.StopItem.prototype.kind] = bitem.StopItem,
        _a[bitem.OpenItem.prototype.kind] = bitem.OpenItem,
        _a[bitem.CloseItem.prototype.kind] = bitem.CloseItem,
        _a[bitem.PrimeItem.prototype.kind] = bitem.PrimeItem,
        _a[bitem.SubsupItem.prototype.kind] = bitem.SubsupItem,
        _a[bitem.OverItem.prototype.kind] = bitem.OverItem,
        _a[bitem.LeftItem.prototype.kind] = bitem.LeftItem,
        _a[bitem.RightItem.prototype.kind] = bitem.RightItem,
        _a[bitem.BeginItem.prototype.kind] = bitem.BeginItem,
        _a[bitem.EndItem.prototype.kind] = bitem.EndItem,
        _a[bitem.StyleItem.prototype.kind] = bitem.StyleItem,
        _a[bitem.PositionItem.prototype.kind] = bitem.PositionItem,
        _a[bitem.CellItem.prototype.kind] = bitem.CellItem,
        _a[bitem.MmlItem.prototype.kind] = bitem.MmlItem,
        _a[bitem.FnItem.prototype.kind] = bitem.FnItem,
        _a[bitem.NotItem.prototype.kind] = bitem.NotItem,
        _a[bitem.DotsItem.prototype.kind] = bitem.DotsItem,
        _a[bitem.ArrayItem.prototype.kind] = bitem.ArrayItem,
        _a[bitem.EqnArrayItem.prototype.kind] = bitem.EqnArrayItem,
        _a[bitem.EquationItem.prototype.kind] = bitem.EquationItem,
        _a),
    options: { maxMacros: 1000,
        baseURL: (typeof (document) === 'undefined' ||
            document.getElementsByTagName('base').length === 0) ?
            '' : String(document.location).replace(/#.*$/, '')
    },
    tags: { base: BaseTags } });
var _a;
//# sourceMappingURL=BaseConfiguration.js.map