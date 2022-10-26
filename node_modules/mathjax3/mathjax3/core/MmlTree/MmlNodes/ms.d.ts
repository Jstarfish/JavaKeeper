import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlTokenNode } from '../MmlNode.js';
export declare class MmlMs extends AbstractMmlTokenNode {
    static defaults: PropertyList;
    texClass: number;
    readonly kind: string;
}
