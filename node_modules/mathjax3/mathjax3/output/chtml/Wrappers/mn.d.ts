import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMn } from '../../common/Wrappers/mn.js';
declare const CHTMLmn_base: (new (...args: any[]) => CommonMn) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmn<N, T, D> extends CHTMLmn_base {
    static kind: string;
}
