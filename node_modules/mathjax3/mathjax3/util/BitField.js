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
var BitField = (function () {
    function BitField() {
        this.bits = 0;
    }
    BitField.allocate = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                if (this.has(name_1)) {
                    throw new Error('Bit already allocated for ' + name_1);
                }
                if (this.next === 0x80000000) {
                    throw new Error('Maximum number of bits already allocated');
                }
                this.names.set(name_1, this.next);
                this.next <<= 1;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
    BitField.has = function (name) {
        return this.names.has(name);
    };
    BitField.prototype.set = function (name) {
        this.bits |= this.getBit(name);
    };
    BitField.prototype.clear = function (name) {
        this.bits &= ~this.getBit(name);
    };
    BitField.prototype.isSet = function (name) {
        return !!(this.bits & this.getBit(name));
    };
    BitField.prototype.reset = function () {
        this.bits = 0;
    };
    BitField.prototype.getBit = function (name) {
        var bit = this.constructor.names.get(name);
        if (!bit) {
            throw new Error('Unknown bit-field name: ' + name);
        }
        return bit;
    };
    return BitField;
}());
BitField.next = 1;
BitField.names = new Map();
exports.BitField = BitField;
function BitFieldClass() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i] = arguments[_i];
    }
    var Bits = (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return class_1;
    }(BitField));
    Bits.allocate.apply(Bits, __spread(names));
    return Bits;
}
exports.BitFieldClass = BitFieldClass;
//# sourceMappingURL=BitField.js.map