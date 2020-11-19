import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlBaseNode, AttributeList } from '../MmlNode.js';
export declare class mathchoice extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    readonly notParent: boolean;
    setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
}
