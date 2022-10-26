import { TextNode, XMLNode } from './MmlNode.js';
import { MmlFactory } from './MmlFactory.js';
import { AbstractVisitor } from '../Tree/Visitor.js';
export declare class MmlVisitor extends AbstractVisitor {
    constructor(factory?: MmlFactory);
    visitTextNode(node: TextNode, ...args: any[]): any;
    visitXMLNode(node: XMLNode, ...args: any[]): any;
}
