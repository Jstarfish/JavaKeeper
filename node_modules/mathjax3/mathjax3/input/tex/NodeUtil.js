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
var MmlNode_js_1 = require("../../core/MmlTree/MmlNode.js");
var mo_js_1 = require("../../core/MmlTree/MmlNodes/mo.js");
var NodeUtil;
(function (NodeUtil) {
    var attrs = new Map([
        ['autoOP', true],
        ['fnOP', true],
        ['movesupsub', true],
        ['subsupOK', true],
        ['texprimestyle', true],
        ['useHeight', true],
        ['variantForm', true],
        ['withDelims', true],
        ['open', true],
        ['close', true]
    ]);
    var methodOut = false;
    function createEntity(code) {
        return String.fromCharCode(parseInt(code, 16));
    }
    NodeUtil.createEntity = createEntity;
    ;
    function getChildren(node) {
        return node.childNodes;
    }
    NodeUtil.getChildren = getChildren;
    ;
    function getText(node) {
        return node.getText();
    }
    NodeUtil.getText = getText;
    ;
    function appendChildren(node, children) {
        try {
            for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                node.appendChild(child);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    }
    NodeUtil.appendChildren = appendChildren;
    ;
    function setAttribute(node, attribute, value) {
        node.attributes.set(attribute, value);
    }
    NodeUtil.setAttribute = setAttribute;
    ;
    function setProperty(node, property, value) {
        node.setProperty(property, value);
    }
    NodeUtil.setProperty = setProperty;
    ;
    function setProperties(node, properties) {
        try {
            for (var _a = __values(Object.keys(properties)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var name_1 = _b.value;
                var value = properties[name_1];
                if (name_1 === 'texClass') {
                    node.texClass = value;
                }
                else if (name_1 === 'movablelimits') {
                    node.setProperty('movablelimits', value);
                    if (node.isKind('mo') || node.isKind('mstyle')) {
                        node.attributes.set('movablelimits', value);
                    }
                }
                else if (name_1 === 'inferred') {
                }
                else if (attrs.has(name_1)) {
                    node.setProperty(name_1, value);
                }
                else {
                    node.attributes.set(name_1, value);
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
    }
    NodeUtil.setProperties = setProperties;
    ;
    function getProperty(node, property) {
        return node.getProperty(property);
    }
    NodeUtil.getProperty = getProperty;
    ;
    function getAttribute(node, attr) {
        return node.attributes.get(attr);
    }
    NodeUtil.getAttribute = getAttribute;
    function removeProperties(node) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        node.removeProperty.apply(node, __spread(properties));
    }
    NodeUtil.removeProperties = removeProperties;
    function getChildAt(node, position) {
        return node.childNodes[position];
    }
    NodeUtil.getChildAt = getChildAt;
    ;
    function setChild(node, position, child) {
        var children = node.childNodes;
        children[position] = child;
        if (child) {
            child.parent = node;
        }
    }
    NodeUtil.setChild = setChild;
    ;
    function copyChildren(oldNode, newNode) {
        var children = oldNode.childNodes;
        for (var i = 0; i < children.length; i++) {
            setChild(newNode, i, children[i]);
        }
    }
    NodeUtil.copyChildren = copyChildren;
    ;
    function copyAttributes(oldNode, newNode) {
        newNode.attributes = oldNode.attributes;
        setProperties(newNode, oldNode.getAllProperties());
    }
    NodeUtil.copyAttributes = copyAttributes;
    ;
    function isType(node, kind) {
        return node.isKind(kind);
    }
    NodeUtil.isType = isType;
    ;
    function isEmbellished(node) {
        return node.isEmbellished;
    }
    NodeUtil.isEmbellished = isEmbellished;
    ;
    function getTexClass(node) {
        return node.texClass;
    }
    NodeUtil.getTexClass = getTexClass;
    ;
    function getCoreMO(node) {
        return node.coreMO();
    }
    NodeUtil.getCoreMO = getCoreMO;
    ;
    function isNode(item) {
        return item instanceof MmlNode_js_1.AbstractMmlNode || item instanceof MmlNode_js_1.AbstractMmlEmptyNode;
    }
    NodeUtil.isNode = isNode;
    ;
    function isInferred(node) {
        return node.isInferred;
    }
    NodeUtil.isInferred = isInferred;
    ;
    function getForm(node) {
        if (!isType(node, 'mo')) {
            return null;
        }
        var mo = node;
        var forms = mo.getForms();
        try {
            for (var forms_1 = __values(forms), forms_1_1 = forms_1.next(); !forms_1_1.done; forms_1_1 = forms_1.next()) {
                var form = forms_1_1.value;
                var symbol = mo_js_1.MmlMo.OPTABLE[form][mo.getText()];
                if (symbol) {
                    return symbol;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (forms_1_1 && !forms_1_1.done && (_a = forms_1.return)) _a.call(forms_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return null;
        var e_3, _a;
    }
    NodeUtil.getForm = getForm;
    ;
})(NodeUtil || (NodeUtil = {}));
exports.default = NodeUtil;
//# sourceMappingURL=NodeUtil.js.map