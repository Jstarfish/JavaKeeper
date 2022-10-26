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
var PrioritizedList_js_1 = require("../util/PrioritizedList.js");
var HandlerList = (function (_super) {
    __extends(HandlerList, _super);
    function HandlerList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HandlerList.prototype.register = function (handler) {
        return this.add(handler, handler.priority);
    };
    HandlerList.prototype.unregister = function (handler) {
        this.remove(handler);
    };
    HandlerList.prototype.handlesDocument = function (document) {
        try {
            for (var _a = __values(this), _b = _a.next(); !_b.done; _b = _a.next()) {
                var item = _b.value;
                var handler = item.item;
                if (handler.handlesDocument(document)) {
                    return handler;
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
        throw new Error("Can't find handler for document");
        var e_1, _c;
    };
    HandlerList.prototype.document = function (document, options) {
        if (options === void 0) { options = null; }
        return this.handlesDocument(document).create(document, options);
    };
    return HandlerList;
}(PrioritizedList_js_1.PrioritizedList));
exports.HandlerList = HandlerList;
//# sourceMappingURL=HandlerList.js.map