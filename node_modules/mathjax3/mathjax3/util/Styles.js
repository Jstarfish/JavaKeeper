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
var TRBL = ['top', 'right', 'bottom', 'left'];
var WSC = ['width', 'style', 'color'];
function splitSpaces(text) {
    var parts = text.split(/((?:'[^']*'|"[^"]*"|,[\s\n]|[^\s\n])*)/g);
    var split = [];
    while (parts.length > 1) {
        parts.shift();
        split.push(parts.shift());
    }
    return split;
}
function splitTRBL(name) {
    var parts = splitSpaces(this.styles[name]);
    if (parts.length === 0) {
        parts.push('');
    }
    if (parts.length === 1) {
        parts.push(parts[0]);
    }
    if (parts.length === 2) {
        parts.push(parts[0]);
    }
    if (parts.length === 3) {
        parts.push(parts[1]);
    }
    try {
        for (var _a = __values(Styles.connect[name].children), _b = _a.next(); !_b.done; _b = _a.next()) {
            var child = _b.value;
            this.setStyle(this.childName(name, child), parts.shift());
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
}
function combineTRBL(name) {
    var children = Styles.connect[name].children;
    var parts = [];
    try {
        for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
            var child = children_1_1.value;
            var part = this.styles[name + '-' + child];
            if (!part) {
                delete this.styles[name];
                return;
            }
            parts.push(part);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (parts[3] === parts[1]) {
        parts.pop();
        if (parts[2] === parts[0]) {
            parts.pop();
            if (parts[1] === parts[0]) {
                parts.pop();
            }
        }
    }
    this.styles[name] = parts.join(' ');
    var e_2, _a;
}
function splitSame(name) {
    try {
        for (var _a = __values(Styles.connect[name].children), _b = _a.next(); !_b.done; _b = _a.next()) {
            var child = _b.value;
            this.setStyle(this.childName(name, child), this.styles[name]);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_3) throw e_3.error; }
    }
    var e_3, _c;
}
function combineSame(name) {
    var children = __spread(Styles.connect[name].children);
    var value = this.styles[this.childName(name, children.shift())];
    try {
        for (var children_2 = __values(children), children_2_1 = children_2.next(); !children_2_1.done; children_2_1 = children_2.next()) {
            var child = children_2_1.value;
            if (this.styles[this.childName(name, child)] !== value) {
                delete this.styles[name];
                return;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (children_2_1 && !children_2_1.done && (_a = children_2.return)) _a.call(children_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
    this.styles[name] = value;
    var e_4, _a;
}
var BORDER = {
    width: /^(?:[\d.]+(?:[a-z]+)|thin|medium|thick|inherit|initial|unset)$/,
    style: /^(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit|initial|unset)$/
};
function splitWSC(name) {
    var parts = { width: '', style: '', color: '' };
    try {
        for (var _a = __values(splitSpaces(this.styles[name])), _b = _a.next(); !_b.done; _b = _a.next()) {
            var part = _b.value;
            if (part.match(BORDER.width) && parts.width === '') {
                parts.width = part;
            }
            else if (part.match(BORDER.style) && parts.style === '') {
                parts.style = part;
            }
            else {
                parts.color = part;
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_5) throw e_5.error; }
    }
    try {
        for (var _d = __values(Styles.connect[name].children), _e = _d.next(); !_e.done; _e = _d.next()) {
            var child = _e.value;
            this.setStyle(this.childName(name, child), parts[child]);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
        }
        finally { if (e_6) throw e_6.error; }
    }
    var e_5, _c, e_6, _f;
}
function combineWSC(name) {
    var parts = [];
    try {
        for (var _a = __values(Styles.connect[name].children), _b = _a.next(); !_b.done; _b = _a.next()) {
            var child = _b.value;
            var value = this.styles[this.childName(name, child)];
            if (value) {
                parts.push(value);
            }
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_7) throw e_7.error; }
    }
    if (parts.length) {
        this.styles[name] = parts.join(' ');
    }
    else {
        delete this.styles[name];
    }
    var e_7, _c;
}
var FONT = {
    style: /^(?:normal|italic|oblique|inherit|initial|unset)$/,
    variant: new RegExp('^(?:' +
        ['normal|none',
            'inherit|initial|unset',
            'common-ligatures|no-common-ligatures',
            'discretionary-ligatures|no-discretionary-ligatures',
            'historical-ligatures|no-historical-ligatures',
            'contextual|no-contextual',
            '(?:stylistic|character-variant|swash|ornaments|annotation)\\([^)]*\\)',
            'small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps',
            'lining-nums|oldstyle-nums|proportional-nums|tabular-nums',
            'diagonal-fractions|stacked-fractions',
            'ordinal|slashed-zero',
            'jis78|jis83|jis90|jis04|simplified|traditional',
            'full-width|proportional-width',
            'ruby'].join('|') + ')$'),
    weight: /^(?:normal|bold|bolder|lighter|[1-9]00|inherit|initial|unset)$/,
    stretch: new RegExp('^(?:' +
        ['normal',
            '(?:(?:ultra|extra|semi)-)?condensed',
            '(?:(?:semi|extra|ulta)-)?expanded',
            'inherit|initial|unset'].join('|') + ')$'),
    size: new RegExp('^(?:' +
        ['xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller',
            '[\d.]+%|[\d.]+[a-z]+',
            'inherit|initial|unset'].join('|') + ')' +
        '(?:\/(?:normal|[\d.\+](?:%|[a-z]+)?))?$')
};
function splitFont(name) {
    var parts = splitSpaces(this.styles[name]);
    var value = {
        style: '', variant: [], weight: '', stretch: '',
        size: '', family: '', 'line-height': ''
    };
    try {
        for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
            var part = parts_1_1.value;
            value.family = part;
            try {
                for (var _a = __values(Object.keys(FONT)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var name_1 = _b.value;
                    if ((Array.isArray(value[name_1]) || value[name_1] === '') && part.match(FONT[name_1])) {
                        if (name_1 === 'size') {
                            var _c = __read(part.split(/\//), 2), size = _c[0], height = _c[1];
                            value[name_1] = size;
                            if (height) {
                                value['line-height'] = height;
                            }
                        }
                        else if (value.size === '') {
                            if (Array.isArray(value[name_1])) {
                                value[name_1].push(part);
                            }
                            else {
                                value[name_1] = part;
                            }
                        }
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (parts_1_1 && !parts_1_1.done && (_e = parts_1.return)) _e.call(parts_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    saveFontParts(name, value);
    delete this.styles[name];
    var e_9, _e, e_8, _d;
}
function saveFontParts(name, value) {
    try {
        for (var _a = __values(Styles.connect[name].children), _b = _a.next(); !_b.done; _b = _a.next()) {
            var child = _b.value;
            var cname = this.childName(name, child);
            if (Array.isArray(value[child])) {
                var values = value[child];
                if (values.length) {
                    this.styles[cname] = values.join(' ');
                }
            }
            else if (value[child] !== '') {
                this.styles[cname] = value[child];
            }
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_10) throw e_10.error; }
    }
    var e_10, _c;
}
function combineFont(name) { }
var Styles = (function () {
    function Styles(cssText) {
        if (cssText === void 0) { cssText = ''; }
        this.parse(cssText);
    }
    Object.defineProperty(Styles.prototype, "cssText", {
        get: function () {
            var styles = [];
            try {
                for (var _a = __values(Object.keys(this.styles)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var name_2 = _b.value;
                    var parent_1 = this.parentName(name_2);
                    if (!this.styles[parent_1]) {
                        styles.push(name_2 + ': ' + this.styles[name_2]);
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_11) throw e_11.error; }
            }
            return styles.join('; ');
            var e_11, _c;
        },
        enumerable: true,
        configurable: true
    });
    Styles.prototype.set = function (name, value) {
        name = this.normalizeName(name);
        this.setStyle(name, value);
        if (Styles.connect[name] && !Styles.connect[name].combine) {
            this.combineChildren(name);
            delete this.styles[name];
        }
        while (name.match(/-/)) {
            name = this.parentName(name);
            if (!Styles.connect[name])
                break;
            Styles.connect[name].combine.call(this, name);
        }
    };
    Styles.prototype.get = function (name) {
        name = this.normalizeName(name);
        return (this.styles.hasOwnProperty(name) ? this.styles[name] : '');
    };
    Styles.prototype.setStyle = function (name, value) {
        this.styles[name] = value;
        if (Styles.connect[name] && Styles.connect[name].children) {
            Styles.connect[name].split.call(this, name);
        }
        if (value === '') {
            delete this.styles[name];
        }
    };
    Styles.prototype.combineChildren = function (name) {
        var parent = this.parentName(name);
        try {
            for (var _a = __values(Styles.connect[name].children), _b = _a.next(); !_b.done; _b = _a.next()) {
                var child = _b.value;
                var cname = this.childName(parent, child);
                Styles.connect[cname].combine.call(this, cname);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_12) throw e_12.error; }
        }
        var e_12, _c;
    };
    Styles.prototype.parentName = function (name) {
        var parent = name.replace(/-[^-]*$/, '');
        return (name === parent ? '' : parent);
    };
    Styles.prototype.childName = function (name, child) {
        if (child.match(/-/)) {
            return child;
        }
        if (Styles.connect[name] && !Styles.connect[name].combine) {
            child += name.replace(/.*-/, '-');
            name = this.parentName(name);
        }
        return name + '-' + child;
    };
    Styles.prototype.normalizeName = function (name) {
        return name.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); });
    };
    Styles.prototype.parse = function (cssText) {
        if (cssText === void 0) { cssText = ''; }
        var PATTERN = this.constructor.pattern;
        this.styles = {};
        var parts = cssText.replace(PATTERN.comment, '').split(PATTERN.style);
        while (parts.length > 1) {
            var _a = __read(parts.splice(0, 3), 3), space = _a[0], name_3 = _a[1], value = _a[2];
            if (space.match(/[^\s\n]/))
                return;
            this.set(name_3, value);
        }
    };
    return Styles;
}());
Styles.pattern = {
    style: /([-a-z]+)[\s\n]*:[\s\n]*((?:'[^']*'|"[^"]*"|\n|.)*?)[\s\n]*(?:;|$)/g,
    comment: /\/\*[^]*?\*\//g
};
Styles.connect = {
    padding: {
        children: TRBL,
        split: splitTRBL,
        combine: combineTRBL
    },
    border: {
        children: TRBL,
        split: splitSame,
        combine: combineSame
    },
    'border-top': {
        children: WSC,
        split: splitWSC,
        combine: combineWSC
    },
    'border-right': {
        children: WSC,
        split: splitWSC,
        combine: combineWSC
    },
    'border-bottom': {
        children: WSC,
        split: splitWSC,
        combine: combineWSC
    },
    'border-left': {
        children: WSC,
        split: splitWSC,
        combine: combineWSC
    },
    'border-width': {
        children: TRBL,
        split: splitTRBL,
        combine: null
    },
    'border-style': {
        children: TRBL,
        split: splitTRBL,
        combine: null
    },
    'border-color': {
        children: TRBL,
        split: splitTRBL,
        combine: null
    },
    font: {
        children: ['style', 'variant', 'weight', 'stretch', 'line-height', 'size', 'family'],
        split: splitFont,
        combine: combineFont
    }
};
exports.Styles = Styles;
//# sourceMappingURL=Styles.js.map