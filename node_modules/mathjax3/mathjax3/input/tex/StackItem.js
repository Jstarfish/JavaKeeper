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
var TexError_js_1 = require("./TexError.js");
var MmlStack = (function () {
    function MmlStack(_nodes) {
        this._nodes = _nodes;
    }
    Object.defineProperty(MmlStack.prototype, "nodes", {
        get: function () {
            return this._nodes;
        },
        enumerable: true,
        configurable: true
    });
    MmlStack.prototype.Push = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        (_a = this._nodes).push.apply(_a, __spread(nodes));
        var _a;
    };
    MmlStack.prototype.Pop = function () {
        return this._nodes.pop();
    };
    Object.defineProperty(MmlStack.prototype, "First", {
        get: function () {
            return this._nodes[this.Size() - 1];
        },
        set: function (node) {
            this._nodes[this.Size() - 1] = node;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MmlStack.prototype, "Last", {
        get: function () {
            return this._nodes[0];
        },
        set: function (node) {
            this._nodes[0] = node;
        },
        enumerable: true,
        configurable: true
    });
    MmlStack.prototype.Peek = function (n) {
        if (n == null) {
            n = 1;
        }
        return this._nodes.slice(this.Size() - n);
    };
    MmlStack.prototype.Size = function () {
        return this._nodes.length;
    };
    MmlStack.prototype.Clear = function () {
        this._nodes = [];
    };
    MmlStack.prototype.toMml = function (inferred, forceRow) {
        if (inferred === void 0) { inferred = true; }
        if (this._nodes.length === 1 && !forceRow) {
            return this.First;
        }
        return this.create('node', inferred ? 'inferredMrow' : 'mrow', this._nodes, {});
    };
    MmlStack.prototype.create = function (kind) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        return (_a = this.factory.configuration.nodeFactory).create.apply(_a, __spread([kind], rest));
        var _a;
    };
    return MmlStack;
}());
exports.MmlStack = MmlStack;
var BaseItem = (function (_super) {
    __extends(BaseItem, _super);
    function BaseItem(factory) {
        var nodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            nodes[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, nodes) || this;
        _this.factory = factory;
        _this.global = {};
        _this._properties = {};
        if (_this.isOpen) {
            _this._env = {};
        }
        return _this;
    }
    Object.defineProperty(BaseItem.prototype, "kind", {
        get: function () {
            return 'base';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseItem.prototype, "env", {
        get: function () {
            return this._env;
        },
        set: function (value) {
            this._env = value;
        },
        enumerable: true,
        configurable: true
    });
    BaseItem.prototype.getProperty = function (key) {
        return this._properties[key];
    };
    BaseItem.prototype.setProperty = function (key, value) {
        this._properties[key] = value;
        return this;
    };
    Object.defineProperty(BaseItem.prototype, "isOpen", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseItem.prototype, "isClose", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseItem.prototype, "isFinal", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    BaseItem.prototype.isKind = function (kind) {
        return kind === this.kind;
    };
    BaseItem.prototype.checkItem = function (item) {
        if (item.isKind('over') && this.isOpen) {
            item.setProperty('num', this.toMml(false));
            this.Clear();
        }
        if (item.isKind('cell') && this.isOpen) {
            if (item.getProperty('linebreak')) {
                return BaseItem.fail;
            }
            throw new TexError_js_1.default('Misplaced', 'Misplaced %1', item.getName());
        }
        if (item.isClose && this.getErrors(item.kind)) {
            var _a = __read(this.getErrors(item.kind), 2), id = _a[0], message = _a[1];
            throw new TexError_js_1.default(id, message, item.getName());
        }
        if (!item.isFinal) {
            return BaseItem.success;
        }
        this.Push(item.First);
        return BaseItem.fail;
    };
    BaseItem.prototype.clearEnv = function () {
        try {
            for (var _a = __values(Object.keys(this.env)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var id = _b.value;
                delete this.env[id];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _c;
    };
    BaseItem.prototype.setProperties = function (def) {
        Object.assign(this._properties, def);
        return this;
    };
    BaseItem.prototype.getName = function () {
        return this.getProperty('name');
    };
    BaseItem.prototype.toString = function () {
        return this.kind + '[' + this.nodes.join('; ') + ']';
    };
    BaseItem.prototype.getErrors = function (kind) {
        var CLASS = this.constructor;
        return (CLASS.errors || {})[kind] || BaseItem.errors[kind];
    };
    return BaseItem;
}(MmlStack));
BaseItem.fail = [null, false];
BaseItem.success = [null, true];
BaseItem.errors = {
    end: ['MissingBeginExtraEnd', 'Missing \\begin{%1} or extra \\end{%1}'],
    close: ['ExtraCloseMissingOpen', 'Extra close brace or missing open brace'],
    right: ['MissingLeftExtraRight', 'Missing \\left or extra \\right']
};
exports.BaseItem = BaseItem;
//# sourceMappingURL=StackItem.js.map