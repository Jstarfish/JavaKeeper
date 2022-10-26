import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlNode } from '../MmlNode.js';
export declare class MmlMenclose extends AbstractMmlNode {
    static defaults: PropertyList;
    texClass: number;
    readonly kind: string;
    readonly arity: number;
    readonly linebreakContininer: boolean;
    setTeXclass(prev: MmlNode): MmlNode;
}
