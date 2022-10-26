import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlBaseNode, AttributeList } from '../MmlNode.js';
export declare class MmlMfrac extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly arity: number;
    readonly linebreakContainer: boolean;
    setTeXclass(prev: MmlNode): this;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
}
