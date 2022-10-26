import { PropertyList } from '../Tree/Node.js';
import { MmlVisitor } from './MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from './MmlNode.js';
export declare type MmlJSON = {
    kind: string;
    texClass: number;
    isEmbellished?: boolean;
    isSpacelike?: boolean;
    isInferred?: boolean;
    childNodes: MmlJSON[];
    attributes: PropertyList;
    inherited: PropertyList;
    properties: PropertyList;
};
export declare class JsonMmlVisitor extends MmlVisitor {
    visitTree(node: MmlNode): any;
    visitTextNode(node: TextNode): {
        kind: string;
        text: string;
    };
    visitXMLNode(node: XMLNode): {
        kind: string;
        xml: Object;
    };
    visitDefault(node: MmlNode): MmlJSON;
    getChildren(node: MmlNode): any[];
    getAttributes(node: MmlNode): PropertyList;
    getInherited(node: MmlNode): PropertyList;
    getProperties(node: MmlNode): PropertyList;
}
