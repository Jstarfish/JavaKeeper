import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlNode } from '../MmlNode.js';
export declare class MmlMaction extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    readonly selected: MmlNode;
    readonly isEmbellished: boolean;
    readonly isSpacelike: boolean;
    core(): MmlNode;
    coreMO(): MmlNode;
    protected verifyAttributes(options: PropertyList): void;
    setTeXclass(prev: MmlNode): MmlNode;
    nextToggleSelection(): void;
}
