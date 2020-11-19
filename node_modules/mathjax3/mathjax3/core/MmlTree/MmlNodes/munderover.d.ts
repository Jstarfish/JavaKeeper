import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlBaseNode, AttributeList } from '../MmlNode.js';
export declare class MmlMunderover extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    protected static ACCENTS: string[];
    readonly kind: string;
    readonly arity: number;
    readonly base: number;
    readonly under: number;
    readonly over: number;
    readonly linebreakContainer: boolean;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    protected getScriptlevel(accent: string, force: boolean, level: number): number;
    protected setInheritedAccent(n: number, accent: string, display: boolean, level: number, prime: boolean, force: boolean): void;
}
export declare class MmlMunder extends MmlMunderover {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
}
export declare class MmlMover extends MmlMunderover {
    static defaults: PropertyList;
    protected static ACCENTS: string[];
    readonly kind: string;
    readonly arity: number;
    readonly over: number;
    readonly under: number;
}
