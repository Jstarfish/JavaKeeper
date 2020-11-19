import { CHTMLWrapper, Constructor } from '../Wrapper.js';
import { CommonMrow } from '../../common/Wrappers/mrow.js';
import { CommonInferredMrow } from '../../common/Wrappers/mrow.js';
declare const CHTMLmrow_base: Constructor<CommonMrow> & Constructor<CHTMLWrapper<N, T, D>>;
export declare class CHTMLmrow<N, T, D> extends CHTMLmrow_base {
    static kind: string;
    toCHTML(parent: N): void;
}
declare const CHTMLinferredMrow_base: Constructor<CommonInferredMrow> & Constructor<CHTMLmrow<N, T, D>>;
export declare class CHTMLinferredMrow<N, T, D> extends CHTMLinferredMrow_base {
    static kind: string;
}
