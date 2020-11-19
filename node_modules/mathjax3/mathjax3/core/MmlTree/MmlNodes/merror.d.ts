import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlNode } from '../MmlNode.js';
export declare class MmlMerror extends AbstractMmlNode {
    static defaults: PropertyList;
    texClass: number;
    readonly kind: string;
    readonly arity: number;
    readonly linebreakContainer: boolean;
}
