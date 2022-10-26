import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlNode, AttributeList } from '../MmlNode.js';
export declare class MmlMsqrt extends AbstractMmlNode {
    static defaults: PropertyList;
    texClass: number;
    readonly kind: string;
    readonly arity: number;
    readonly linebreakContainer: boolean;
    setTeXclass(prev: MmlNode): this;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
}
