import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlNode, AttributeList } from '../MmlNode.js';
export declare class MmlMroot extends AbstractMmlNode {
    static defaults: PropertyList;
    texClass: number;
    readonly kind: string;
    readonly arity: number;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
}
