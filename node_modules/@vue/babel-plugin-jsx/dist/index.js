"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_syntax_jsx_1 = __importDefault(require("@babel/plugin-syntax-jsx"));
const t = __importStar(require("@babel/types"));
const transform_vue_jsx_1 = __importDefault(require("./transform-vue-jsx"));
const sugar_fragment_1 = __importDefault(require("./sugar-fragment"));
const utils_1 = require("./utils");
exports.default = () => ({
    name: 'babel-plugin-jsx',
    inherits: plugin_syntax_jsx_1.default,
    visitor: Object.assign(Object.assign({ Program: {
            exit(path, state) {
                const helpers = state.get(utils_1.JSX_HELPER_KEY);
                if (!helpers) {
                    return;
                }
                const body = path.get('body');
                const specifierNames = new Set();
                body
                    .filter((nodePath) => t.isImportDeclaration(nodePath.node)
                    && nodePath.node.source.value === 'vue')
                    .forEach((nodePath) => {
                    let shouldKeep = false;
                    const newSpecifiers = nodePath.node.specifiers
                        .filter((specifier) => {
                        if (t.isImportSpecifier(specifier)) {
                            const { imported, local } = specifier;
                            if (local.name === imported.name) {
                                specifierNames.add(imported.name);
                                return false;
                            }
                            return true;
                        }
                        if (t.isImportNamespaceSpecifier(specifier)) {
                            // should keep when `import * as Vue from 'vue'`
                            shouldKeep = true;
                        }
                        return false;
                    });
                    if (newSpecifiers.length) {
                        nodePath.replaceWith(t.importDeclaration(newSpecifiers, t.stringLiteral('vue')));
                    }
                    else if (!shouldKeep) {
                        nodePath.remove();
                    }
                });
                const importedHelperKeys = new Set([...specifierNames, ...helpers]);
                const specifiers = [...importedHelperKeys].map((imported) => t.importSpecifier(t.identifier(imported), t.identifier(imported)));
                const expression = t.importDeclaration(specifiers, t.stringLiteral('vue'));
                path.unshiftContainer('body', expression);
            },
        } }, transform_vue_jsx_1.default()), sugar_fragment_1.default()),
});
