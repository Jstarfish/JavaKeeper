import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlTokenNode } from '../MmlNode.js';
export declare class MmlMglyph extends AbstractMmlTokenNode {
    static defaults: PropertyList;
    texClass: number;
    readonly kind: string;
}
