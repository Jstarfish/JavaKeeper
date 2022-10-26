import { CHTMLWrapper, Constructor } from '../Wrapper.js';
import { CHTMLscriptbase } from './scriptbase.js';
import { CommonMsub } from '../../common/Wrappers/msubsup.js';
import { CommonMsubsup } from '../../common/Wrappers/msubsup.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmsub_base: Constructor<CommonMsub<CHTMLWrapper<N, T, D>>> & Constructor<CHTMLscriptbase<N, T, D>>;
export declare class CHTMLmsub<N, T, D> extends CHTMLmsub_base {
    static kind: string;
    static useIC: boolean;
}
declare const CHTMLmsup_base: Constructor<CommonMsub<CHTMLWrapper<N, T, D>>> & Constructor<CHTMLscriptbase<N, T, D>>;
export declare class CHTMLmsup<N, T, D> extends CHTMLmsup_base {
    static kind: string;
    static useIC: boolean;
}
declare const CHTMLmsubsup_base: Constructor<CommonMsubsup<CHTMLWrapper<N, T, D>>> & Constructor<CHTMLscriptbase<N, T, D>>;
export declare class CHTMLmsubsup<N, T, D> extends CHTMLmsubsup_base {
    static kind: string;
    static styles: StyleList;
    static useIC: boolean;
    toCHTML(parent: N): void;
}
