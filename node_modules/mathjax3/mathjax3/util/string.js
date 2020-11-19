"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sortLength(a, b) {
    return a.length !== b.length ? b.length - a.length : a === b ? 0 : a < b ? -1 : 1;
}
exports.sortLength = sortLength;
function quotePattern(text) {
    return text.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, '\\$1');
}
exports.quotePattern = quotePattern;
function unicodeChars(text) {
    var unicode = [];
    for (var i = 0, m = text.length; i < m; i++) {
        var n = text.charCodeAt(i);
        if (n >= 0xD800 && n < 0xDBFF) {
            n = (((n - 0xD800) << 10) + (text.charCodeAt(i++) - 0xDC00)) + 0x10000;
        }
        unicode.push(n);
    }
    return unicode;
}
exports.unicodeChars = unicodeChars;
function isPercent(x) {
    return !!x.match(/%\s*$/);
}
exports.isPercent = isPercent;
function split(x) {
    return x.trim().split(/\s+/);
}
exports.split = split;
//# sourceMappingURL=string.js.map