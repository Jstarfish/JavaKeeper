import { MmlVisitor } from './MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from './MmlNode.js';
export declare class SerializedMmlVisitor extends MmlVisitor {
    visitTree(node: MmlNode): any;
    visitTextNode(node: TextNode, space: string): string;
    visitXMLNode(node: XMLNode, space: string): string;
    visitInferredMrowNode(node: MmlNode, space: string): string;
    visitTeXAtomNode(node: MmlNode, space: string): string;
    visitDefault(node: MmlNode, space: string): string;
    protected getAttributes(node: MmlNode): string;
    protected quoteHTML(value: string): string;
}
