import { CHTMLWrapper } from '../Wrapper.js';
import { CommonTextNode } from '../../common/Wrappers/TextNode.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLTextNode_base: (new (...args: any[]) => CommonTextNode) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLTextNode<N, T, D> extends CHTMLTextNode_base {
    static kind: string;
    static autoStyle: boolean;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
