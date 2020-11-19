import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlTokenNode, MmlNode, AttributeList } from '../MmlNode.js';
import { OperatorList, RangeDef } from '../OperatorDictionary.js';
export declare class MmlMo extends AbstractMmlTokenNode {
    static defaults: PropertyList;
    static RANGES: [number, number, number, string][];
    static MMLSPACING: number[][];
    static OPTABLE: {
        [form: string]: OperatorList;
    };
    texClass: number;
    lspace: number;
    rspace: number;
    readonly kind: string;
    readonly isEmbellished: boolean;
    readonly hasNewLine: boolean;
    coreParent(): MmlNode;
    coreText(parent: MmlNode): string;
    hasSpacingAttributes(): boolean;
    readonly isAccent: boolean;
    setTeXclass(prev: MmlNode): MmlNode;
    adjustTeXclass(prev: MmlNode): MmlNode;
    setInheritedAttributes(attributes?: AttributeList, display?: boolean, level?: number, prime?: boolean): void;
    getForms(): string[];
    protected handleExplicitForm(forms: string[]): string[];
    protected getRange(mo: string): RangeDef;
}
