import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlBaseNode, MmlNode } from '../MmlNode.js';
export declare class MmlMtd extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    readonly linebreakContainer: boolean;
    protected verifyChildren(options: PropertyList): void;
    setTeXclass(prev: MmlNode): this;
}
