import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlNode } from '../MmlNode.js';
export declare class MmlMrow extends AbstractMmlNode {
    static defaults: PropertyList;
    protected _core: number;
    readonly kind: string;
    readonly isSpacelike: boolean;
    readonly isEmbellished: boolean;
    core(): MmlNode;
    coreMO(): MmlNode;
    nonSpaceLength(): number;
    firstNonSpace(): MmlNode;
    lastNonSpace(): MmlNode;
    setTeXclass(prev: MmlNode): MmlNode;
}
export declare class MmlInferredMrow extends MmlMrow {
    static defaults: PropertyList;
    readonly kind: string;
    readonly isInferred: boolean;
    readonly notParent: boolean;
    toString(): string;
}
