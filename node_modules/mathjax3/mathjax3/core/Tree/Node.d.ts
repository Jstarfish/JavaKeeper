import { NodeFactory } from './NodeFactory.js';
export declare type Property = string | number | boolean;
export declare type PropertyList = {
    [key: string]: Property;
};
export interface Node {
    readonly kind: string;
    parent: Node;
    childNodes: Node[];
    setProperty(name: string, value: Property): void;
    getProperty(name: string): Property;
    getPropertyNames(): string[];
    getAllProperties(): PropertyList;
    removeProperty(...names: string[]): void;
    isKind(kind: string): boolean;
    setChildren(children: Node[]): void;
    appendChild(child: Node): Node;
    replaceChild(newChild: Node, oldChild: Node): Node;
    childIndex(child: Node): number;
    findNodes(kind: string): Node[];
    walkTree(func: (node: Node, data?: any) => void, data?: any): void;
}
export interface NodeClass {
    new (factory: NodeFactory<Node, NodeClass>, properties?: PropertyList, children?: Node[]): Node;
}
export declare abstract class AbstractNode implements Node {
    parent: Node;
    protected properties: PropertyList;
    protected _factory: NodeFactory<Node, NodeClass>;
    childNodes: Node[];
    constructor(factory: NodeFactory<Node, NodeClass>, properties?: PropertyList, children?: Node[]);
    readonly factory: NodeFactory<Node, NodeClass>;
    readonly kind: string;
    setProperty(name: string, value: Property): void;
    getProperty(name: string): Property;
    getPropertyNames(): string[];
    getAllProperties(): PropertyList;
    removeProperty(...names: string[]): void;
    isKind(kind: string): boolean;
    setChildren(children: Node[]): void;
    appendChild(child: Node): Node;
    replaceChild(newChild: Node, oldChild: Node): Node;
    childIndex(node: Node): number;
    findNodes(kind: string): Node[];
    walkTree(func: (node: Node, data?: any) => void, data?: any): any;
    toString(): string;
}
export declare abstract class AbstractEmptyNode extends AbstractNode {
    setChildren(children: Node[]): void;
    appendChild(child: Node): Node;
    replaceChild(newChild: Node, oldChild: Node): Node;
    childIndex(node: Node): number;
    walkTree(func: (node: Node, data?: any) => void, data?: any): any;
    toString(): string;
}
