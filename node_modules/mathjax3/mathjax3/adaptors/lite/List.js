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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var LiteList = (function () {
    function LiteList(children) {
        this.nodes = [];
        this.nodes = __spread(children);
    }
    LiteList.prototype.append = function (node) {
        this.nodes.push(node);
    };
    LiteList.prototype[Symbol.iterator] = function () {
        var i = 0;
        return {
            next: function () {
                return (i === this.nodes.length ?
                    { value: null, done: true } :
                    { value: this.nodes[i++], done: false });
            }
        };
    };
    return LiteList;
}());
exports.LiteList = LiteList;
//# sourceMappingURL=List.js.map