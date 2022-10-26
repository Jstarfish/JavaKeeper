import { SVGWrapper } from '../Wrapper.js';
import { CommonTextNode } from '../../common/Wrappers/TextNode.js';
import { StyleList } from '../../common/CssStyles.js';
declare const SVGTextNode_base: (new (...args: any[]) => CommonTextNode) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGTextNode<N, T, D> extends SVGTextNode_base {
    static kind: string;
    static styles: StyleList;
    toSVG(parent: N): void;
}
