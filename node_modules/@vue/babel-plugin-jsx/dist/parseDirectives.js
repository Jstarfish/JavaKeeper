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
Object.defineProperty(exports, "__esModule", { value: true });
const t = __importStar(require("@babel/types"));
const utils_1 = require("./utils");
/**
 * Get JSX element type
 *
 * @param path Path<JSXOpeningElement>
 */
const getType = (path) => {
    const typePath = path
        .get('attributes')
        .find((attribute) => {
        if (!t.isJSXAttribute(attribute)) {
            return false;
        }
        return t.isJSXIdentifier(attribute.get('name'))
            && attribute.get('name').node.name === 'type';
    });
    return typePath ? typePath.get('value').node : null;
};
const parseModifiers = (value) => {
    let modifiers = [];
    if (t.isArrayExpression(value)) {
        modifiers = value.elements
            .map((el) => (t.isStringLiteral(el) ? el.value : '')).filter(Boolean);
    }
    return modifiers;
};
const parseDirectives = (args) => {
    var _a;
    const { name, path, value, state, tag, isComponent, } = args;
    let modifiers = name.split('_');
    let arg;
    let val;
    const directiveName = ((_a = modifiers.shift()) === null || _a === void 0 ? void 0 : _a.replace(/^v/, '').replace(/^-/, '').replace(/^\S/, (s) => s.toLowerCase())) || '';
    if (directiveName === 'model' && !t.isJSXExpressionContainer(path.get('value'))) {
        throw new Error('You have to use JSX Expression inside your v-model');
    }
    const shouldResolve = !['html', 'text', 'model'].includes(directiveName)
        || (directiveName === 'model' && !isComponent);
    if (t.isArrayExpression(value)) {
        const { elements } = value;
        const [first, second, third] = elements;
        if (t.isStringLiteral(second)) {
            arg = second;
            modifiers = parseModifiers(third);
        }
        else if (second) {
            modifiers = parseModifiers(second);
        }
        val = first;
    }
    const modifiersSet = new Set(modifiers);
    return {
        directiveName,
        modifiers: modifiersSet,
        value: val || value,
        arg,
        directive: shouldResolve ? [
            resolveDirective(path, state, tag, directiveName),
            val || value,
            !!modifiersSet.size && t.unaryExpression('void', t.numericLiteral(0), true),
            !!modifiersSet.size && t.objectExpression([...modifiersSet].map((modifier) => t.objectProperty(t.identifier(modifier), t.booleanLiteral(true)))),
        ].filter(Boolean) : undefined,
    };
};
const resolveDirective = (path, state, tag, directiveName) => {
    var _a;
    if (directiveName === 'show') {
        return utils_1.createIdentifier(state, 'vShow');
    }
    if (directiveName === 'model') {
        let modelToUse;
        const type = getType(path.parentPath);
        switch (tag.value) {
            case 'select':
                modelToUse = utils_1.createIdentifier(state, 'vModelSelect');
                break;
            case 'textarea':
                modelToUse = utils_1.createIdentifier(state, 'vModelText');
                break;
            default:
                if (t.isStringLiteral(type) || !type) {
                    switch ((_a = type) === null || _a === void 0 ? void 0 : _a.value) {
                        case 'checkbox':
                            modelToUse = utils_1.createIdentifier(state, 'vModelCheckbox');
                            break;
                        case 'radio':
                            modelToUse = utils_1.createIdentifier(state, 'vModelRadio');
                            break;
                        default:
                            modelToUse = utils_1.createIdentifier(state, 'vModelText');
                    }
                }
                else {
                    modelToUse = utils_1.createIdentifier(state, 'vModelDynamic');
                }
        }
        return modelToUse;
    }
    return t.callExpression(utils_1.createIdentifier(state, 'resolveDirective'), [
        t.stringLiteral(directiveName),
    ]);
};
exports.default = parseDirectives;
