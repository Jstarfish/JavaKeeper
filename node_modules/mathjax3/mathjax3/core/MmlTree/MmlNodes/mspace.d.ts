import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlTokenNode } from '../MmlNode.js';
export declare class MmlMspace extends AbstractMmlTokenNode {
    static defaults: PropertyList;
    texClass: number;
    readonly kind: string;
    readonly arity: number;
    readonly isSpacelike: boolean;
    readonly hasNewline: boolean;
}
