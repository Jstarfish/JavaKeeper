import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlBaseNode, AttributeList } from '../MmlNode.js';
export declare class MmlMsubsup extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    readonly base: number;
    readonly sub: number;
    readonly sup: number;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
}
export declare class MmlMsub extends MmlMsubsup {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
}
export declare class MmlMsup extends MmlMsubsup {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    readonly sup: number;
    readonly sub: number;
}
