import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMtd } from '../../common/Wrappers/mtd.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmtd_base: (new (...args: any[]) => CommonMtd) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmtd<N, T, D> extends CHTMLmtd_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
