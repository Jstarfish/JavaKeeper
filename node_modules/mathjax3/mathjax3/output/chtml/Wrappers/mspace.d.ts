import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMspace } from '../../common/Wrappers/mspace.js';
declare const CHTMLmspace_base: (new (...args: any[]) => CommonMspace) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmspace<N, T, D> extends CHTMLmspace_base {
    static kind: string;
    toCHTML(parent: N): void;
}
