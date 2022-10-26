import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlNode, AttributeList } from '../MmlNode.js';
export declare class MmlMtr extends AbstractMmlNode {
    static defaults: PropertyList;
    readonly kind: string;
    readonly linebreakContainer: boolean;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    protected verifyChildren(options: PropertyList): void;
    setTeXclass(prev: MmlNode): this;
}
export declare class MmlMlabeledtr extends MmlMtr {
    readonly kind: string;
    readonly arity: number;
}
