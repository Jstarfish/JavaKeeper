import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMi } from '../../common/Wrappers/mi.js';
declare const CHTMLmi_base: (new (...args: any[]) => CommonMi) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmi<N, T, D> extends CHTMLmi_base {
    static kind: string;
    toCHTML(parent: N): void;
}
