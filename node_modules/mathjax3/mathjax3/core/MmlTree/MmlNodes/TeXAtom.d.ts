import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlBaseNode, MmlNode } from '../MmlNode.js';
export declare class TeXAtom extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    texClass: number;
    readonly kind: string;
    readonly arity: number;
    readonly notParent: boolean;
    setTeXclass(prev: MmlNode): MmlNode;
    adjustTeXclass(prev: MmlNode): MmlNode;
}
