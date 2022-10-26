import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlNode, AbstractMmlBaseNode } from '../MmlNode.js';
export declare class MmlSemantics extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    readonly notParent: boolean;
}
export declare class MmlAnnotationXML extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly kind: string;
    protected setChildInheritedAttributes(): void;
}
export declare class MmlAnnotation extends MmlAnnotationXML {
    static defaults: {
        [key: string]: string | number | boolean;
    };
    properties: {
        isChars: boolean;
    };
    readonly kind: string;
}
