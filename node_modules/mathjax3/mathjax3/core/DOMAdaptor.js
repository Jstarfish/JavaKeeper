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
var AbstractDOMAdaptor = (function () {
    function AbstractDOMAdaptor(document) {
        if (document === void 0) { document = null; }
        this.document = document;
    }
    AbstractDOMAdaptor.prototype.node = function (kind, def, children, ns) {
        if (def === void 0) { def = {}; }
        if (children === void 0) { children = []; }
        var node = this.create(kind, ns);
        this.setAttributes(node, def);
        try {
            for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                this.append(node, child);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return node;
        var e_1, _a;
    };
    AbstractDOMAdaptor.prototype.setAttributes = function (node, def) {
        if (def.style && typeof (def.style) !== 'string') {
            try {
                for (var _a = __values(Object.keys(def.style)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    this.setStyle(node, key.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }), def.style[key]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (def.properties) {
            try {
                for (var _d = __values(Object.keys(def.properties)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var key = _e.value;
                    node[key] = def.properties[key];
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        try {
            for (var _g = __values(Object.keys(def)), _h = _g.next(); !_h.done; _h = _g.next()) {
                var key = _h.value;
                if ((key !== 'style' || typeof (def.style) === 'string') && key !== 'properties') {
                    this.setAttribute(node, key, def[key]);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_j = _g.return)) _j.call(_g);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var e_2, _c, e_3, _f, e_4, _j;
    };
    AbstractDOMAdaptor.prototype.replace = function (nnode, onode) {
        this.insert(nnode, onode);
        this.remove(onode);
        return onode;
    };
    AbstractDOMAdaptor.prototype.childNode = function (node, i) {
        return this.childNodes(node)[i];
    };
    AbstractDOMAdaptor.prototype.allClasses = function (node) {
        var classes = this.getAttribute(node, 'class');
        return (!classes ? [] :
            classes.replace(/  +/g, ' ').replace(/^ /, '').replace(/ $/, '').split(/ /));
    };
    return AbstractDOMAdaptor;
}());
exports.AbstractDOMAdaptor = AbstractDOMAdaptor;
//# sourceMappingURL=DOMAdaptor.js.map