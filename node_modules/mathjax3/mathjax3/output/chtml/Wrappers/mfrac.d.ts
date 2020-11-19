import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMfrac } from '../../common/Wrappers/mfrac.js';
import { CHTMLmo } from './mo.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmfrac_base: (new (...args: any[]) => CommonMfrac) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmfrac<N, T, D> extends CHTMLmfrac_base {
    static kind: string;
    static styles: StyleList;
    bevel: CHTMLmo<N, T, D>;
    toCHTML(parent: N): void;
    protected makeFraction(display: boolean, t: number): void;
    protected makeAtop(display: boolean): void;
    protected makeBevelled(display: boolean): void;
}
