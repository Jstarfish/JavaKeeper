import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlNode, AttributeList } from '../MmlNode.js';
export declare class MmlMaligngroup extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly isSpacelike: boolean;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
}
