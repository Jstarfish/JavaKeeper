import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlNode } from '../MmlNode.js';
export declare class MmlMalignmark extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    readonly isSpacelike: boolean;
}
