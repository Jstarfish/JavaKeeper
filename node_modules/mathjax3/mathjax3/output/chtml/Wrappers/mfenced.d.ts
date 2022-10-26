import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMfenced } from '../../common/Wrappers/mfenced.js';
declare const CHTMLmfenced_base: (new (...args: any[]) => CommonMfenced) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmfenced<N, T, D> extends CHTMLmfenced_base {
    static kind: string;
    toCHTML(parent: N): void;
}
