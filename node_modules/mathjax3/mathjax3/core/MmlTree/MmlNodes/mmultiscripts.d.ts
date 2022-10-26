import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlNode, AttributeList } from '../MmlNode.js';
import { MmlMsubsup } from './msubsup.js';
export declare class MmlMmultiscripts extends MmlMsubsup {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    protected verifyChildren(options: PropertyList): void;
}
export declare class MmlMprescripts extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    verifyTree(options: PropertyList): void;
}
export declare class MmlNone extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    verifyTree(options: PropertyList): void;
}
