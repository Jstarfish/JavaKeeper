"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncLoad(name) {
    if (name.charAt(0) === '.') {
        name = __dirname + name.replace(/^\.\.?/, '/..');
    }
    if (typeof (System) !== 'undefined') {
        return System.import(name);
    }
    return new Promise(function (ok, fail) {
        ok(require(name));
    });
}
exports.asyncLoad = asyncLoad;
//# sourceMappingURL=AsyncLoad.js.map