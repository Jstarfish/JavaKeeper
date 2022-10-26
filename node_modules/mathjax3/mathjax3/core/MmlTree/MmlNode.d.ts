import { Attributes } from './Attributes.js';
import { Property, PropertyList, Node, AbstractNode, AbstractEmptyNode, NodeClass } from '../Tree/Node.js';
import { MmlFactory } from './MmlFactory.js';
export declare type AttributeList = {
    [attribute: string]: [string, Property];
};
export declare const TEXCLASS: {
    ORD: number;
    OP: number;
    BIN: number;
    REL: number;
    OPEN: number;
    CLOSE: number;
    PUNCT: number;
    INNER: number;
    VCENTER: number;
    NONE: number;
};
export declare const TEXCLASSNAMES: string[];
export declare const indentAttributes: string[];
export interface MmlNode extends Node {
    readonly isToken: boolean;
    readonly isEmbellished: boolean;
    readonly isSpacelike: boolean;
    readonly linebreakContainer: boolean;
    readonly hasNewLine: boolean;
    readonly arity: number;
    readonly isInferred: boolean;
    readonly Parent: MmlNode;
    readonly notParent: boolean;
    parent: MmlNode;
    texClass: number;
    prevClass: number;
    prevLevel: number;
    attributes: Attributes;
    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;
    childPosition(): number;
    setTeXclass(prev: MmlNode): MmlNode;
    texSpacing(): string;
    hasSpacingAttributes(): boolean;
    setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    inheritAttributesFrom(node: MmlNode): void;
    mError(message: string, options: PropertyList, short?: boolean): void;
    verifyTree(options?: PropertyList): void;
}
export interface MmlNodeClass extends NodeClass {
    defaults?: PropertyList;
    new (factory: MmlFactory, attributes?: PropertyList, children?: MmlNode[]): MmlNode;
}
export declare abstract class AbstractMmlNode extends AbstractNode implements MmlNode {
    static defaults: PropertyList;
    static noInherit: {
        [node1: string]: {
            [node2: string]: {
                [attribute: string]: boolean;
            };
        };
    };
    static verifyDefaults: PropertyList;
    texClass: number;
    prevClass: number;
    prevLevel: number;
    attributes: Attributes;
    childNodes: MmlNode[];
    parent: MmlNode;
    factory: MmlFactory;
    constructor(factory: MmlFactory, attributes?: PropertyList, children?: MmlNode[]);
    readonly isToken: boolean;
    readonly isEmbellished: boolean;
    readonly isSpacelike: boolean;
    readonly linebreakContainer: boolean;
    readonly hasNewLine: boolean;
    readonly arity: number;
    readonly isInferred: boolean;
    readonly Parent: MmlNode;
    readonly notParent: boolean;
    setChildren(children: MmlNode[]): void;
    appendChild(child: MmlNode): Node;
    replaceChild(newChild: MmlNode, oldChild: MmlNode): Node;
    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;
    childPosition(): number;
    setTeXclass(prev: MmlNode): MmlNode;
    protected updateTeXclass(core: MmlNode): void;
    protected getPrevClass(prev: MmlNode): void;
    texSpacing(): string;
    hasSpacingAttributes(): boolean;
    setInheritedAttributes(attributes?: AttributeList, display?: boolean, level?: number, prime?: boolean): void;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    protected addInheritedAttributes(current: AttributeList, attributes: PropertyList): AttributeList;
    inheritAttributesFrom(node: MmlNode): void;
    verifyTree(options?: PropertyList): void;
    protected verifyAttributes(options: PropertyList): void;
    protected verifyChildren(options: PropertyList): void;
    mError(message: string, options: PropertyList, short?: boolean): MmlNode;
}
export declare abstract class AbstractMmlTokenNode extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly isToken: boolean;
    getText(): string;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    walkTree(func: (node: Node, data?: any) => void, data?: any): any;
}
export declare abstract class AbstractMmlLayoutNode extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly isSpacelike: boolean;
    readonly isEmbellished: boolean;
    readonly arity: number;
    core(): MmlNode;
    coreMO(): MmlNode;
    setTeXclass(prev: MmlNode): MmlNode;
}
export declare abstract class AbstractMmlBaseNode extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly isEmbellished: boolean;
    core(): MmlNode;
    coreMO(): MmlNode;
    setTeXclass(prev: MmlNode): MmlNode;
}
export declare abstract class AbstractMmlEmptyNode extends AbstractEmptyNode implements MmlNode {
    readonly isToken: boolean;
    readonly isEmbellished: boolean;
    readonly isSpacelike: boolean;
    readonly linebreakContainer: boolean;
    readonly hasNewLine: boolean;
    readonly arity: number;
    readonly isInferred: boolean;
    readonly notParent: boolean;
    readonly Parent: MmlNode;
    readonly texClass: number;
    readonly prevClass: number;
    readonly prevLevel: number;
    hasSpacingAttributes(): boolean;
    readonly attributes: Attributes;
    parent: MmlNode;
    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;
    childPosition(): number;
    setTeXclass(prev: MmlNode): MmlNode;
    texSpacing(): string;
    setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    inheritAttributesFrom(node: MmlNode): void;
    verifyTree(options: PropertyList): void;
    mError(message: string, options: PropertyList, short?: boolean): void;
}
export declare class TextNode extends AbstractMmlEmptyNode {
    protected text: string;
    readonly kind: string;
    getText(): string;
    setText(text: string): this;
    toString(): string;
}
export declare class XMLNode extends AbstractMmlEmptyNode {
    protected xml: Object;
    readonly kind: string;
    getXML(): Object;
    setXML(xml: Object): this;
    toString(): string;
}
