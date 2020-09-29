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
exports.transformJSXElement = void 0;
const t = __importStar(require("@babel/types"));
const utils_1 = require("./utils");
const buildProps_1 = __importDefault(require("./buildProps"));
/**
 * Get children from Array of JSX children
 * @param paths Array<JSXText | JSXExpressionContainer  | JSXElement | JSXFragment>
 * @returns Array<Expression | SpreadElement>
 */
const getChildren = (paths, state) => paths
    .map((path) => {
    if (path.isJSXText()) {
        const transformedText = utils_1.transformJSXText(path);
        if (transformedText) {
            return t.callExpression(utils_1.createIdentifier(state, 'createTextVNode'), [transformedText]);
        }
        return transformedText;
    }
    if (path.isJSXExpressionContainer()) {
        const expression = utils_1.transformJSXExpressionContainer(path);
        if (t.isIdentifier(expression)) {
            const { name } = expression;
            const { referencePaths = [] } = path.scope.getBinding(name) || {};
            referencePaths.forEach((referencePath) => {
                utils_1.walksScope(referencePath, name, 2 /* DYNAMIC */);
            });
        }
        return expression;
    }
    if (t.isJSXSpreadChild(path)) {
        return utils_1.transformJSXSpreadChild(path);
    }
    if (path.isCallExpression()) {
        return path.node;
    }
    if (path.isJSXElement()) {
        return transformJSXElement(path, state);
    }
    throw new Error(`getChildren: ${path.type} is not supported`);
}).filter(((value) => (value !== undefined
    && value !== null
    && !t.isJSXEmptyExpression(value))));
const transformJSXElement = (path, state) => {
    const children = getChildren(path.get('children'), state);
    const { tag, props, isComponent, directives, patchFlag, dynamicPropNames, slots, } = buildProps_1.default(path, state);
    const { optimize = false } = state.opts;
    const slotFlag = path.getData('slotFlag') || 1 /* STABLE */;
    // @ts-ignore
    const createVNode = t.callExpression(utils_1.createIdentifier(state, 'createVNode'), [
        tag,
        props,
        (children.length || slots) ? (isComponent
            ? t.objectExpression([
                !!children.length && t.objectProperty(t.identifier('default'), t.arrowFunctionExpression([], t.arrayExpression(utils_1.buildIIFE(path, children)))),
                ...(slots ? (t.isObjectExpression(slots)
                    ? slots.properties
                    : [t.spreadElement(slots)]) : []),
                optimize && t.objectProperty(t.identifier('_'), t.numericLiteral(slotFlag)),
            ].filter(Boolean))
            : t.arrayExpression(children)) : t.nullLiteral(),
        !!patchFlag && optimize && t.numericLiteral(patchFlag),
        !!dynamicPropNames.size && optimize
            && t.arrayExpression([...dynamicPropNames.keys()].map((name) => t.stringLiteral(name))),
    ].filter(Boolean));
    if (!directives.length) {
        return createVNode;
    }
    return t.callExpression(utils_1.createIdentifier(state, 'withDirectives'), [
        createVNode,
        t.arrayExpression(directives),
    ]);
};
exports.transformJSXElement = transformJSXElement;
exports.default = () => ({
    JSXElement: {
        exit(path, state) {
            path.replaceWith(transformJSXElement(path, state));
        },
    },
});
