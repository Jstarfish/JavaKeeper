import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMo } from '../../common/Wrappers/mo.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmo_base: (new (...args: any[]) => CommonMo) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmo<N, T, D> extends CHTMLmo_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
    protected stretchHTML(chtml: N, symmetric: boolean): void;
}
