import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMs } from '../../common/Wrappers/ms.js';
declare const CHTMLms_base: (new (...args: any[]) => CommonMs) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLms<N, T, D> extends CHTMLms_base {
    static kind: string;
}
