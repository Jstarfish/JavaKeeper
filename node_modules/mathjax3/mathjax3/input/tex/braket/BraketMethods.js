"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseMethods_js_1 = require("../base/BaseMethods.js");
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var BraketMethods = {};
BraketMethods.Macro = BaseMethods_js_1.default.Macro;
BraketMethods.Braket = function (parser, name, open, close, stretchy, barmax) {
    parser.i++;
    parser.Push(parser.itemFactory.create('braket')
        .setProperties({ barmax: barmax, barcount: 0, open: open,
        close: close, stretchy: stretchy }));
};
BraketMethods.Bar = function (parser, name) {
    var c = name === '|' ? '|' : '\u2225';
    var top = parser.stack.Top();
    if (top.kind !== 'braket' ||
        top.getProperty('barcount') >= top.getProperty('barmax')) {
        var mml = parser.create('token', 'mo', { texClass: MmlNode_js_1.TEXCLASS.ORD, stretchy: false }, c);
        parser.Push(mml);
        return;
    }
    if (c === '|' && parser.GetNext() === '|') {
        parser.i++;
        c = '\u2225';
    }
    var stretchy = top.getProperty('stretchy');
    if (!stretchy) {
        var node_1 = parser.create('token', 'mo', { stretchy: false, braketbar: true }, c);
        parser.Push(node_1);
        return;
    }
    var node = parser.create('node', 'TeXAtom', [], { texClass: MmlNode_js_1.TEXCLASS.CLOSE });
    parser.Push(node);
    top.setProperty('barcount', top.getProperty('barcount') + 1);
    node = parser.create('token', 'mo', { stretchy: true, braketbar: true }, c);
    parser.Push(node);
    node = parser.create('node', 'TeXAtom', [], { texClass: MmlNode_js_1.TEXCLASS.OPEN });
    parser.Push(node);
};
exports.default = BraketMethods;
//# sourceMappingURL=BraketMethods.js.map