import { CHTMLWrapper, Constructor } from '../Wrapper.js';
import { CHTMLmsubsup, CHTMLmsub, CHTMLmsup } from './msubsup.js';
import { CommonMunder } from '../../common/Wrappers/munderover.js';
import { CommonMover } from '../../common/Wrappers/munderover.js';
import { CommonMunderover } from '../../common/Wrappers/munderover.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmunder_base: Constructor<CommonMunder<CHTMLWrapper<N, T, D>>> & Constructor<CHTMLmsub<N, T, D>>;
export declare class CHTMLmunder<N, T, D> extends CHTMLmunder_base {
    static kind: string;
    static useIC: boolean;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
declare const CHTMLmover_base: Constructor<CommonMover<CHTMLWrapper<N, T, D>>> & Constructor<CHTMLmsup<N, T, D>>;
export declare class CHTMLmover<N, T, D> extends CHTMLmover_base {
    static kind: string;
    static useIC: boolean;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
declare const CHTMLmunderover_base: Constructor<CommonMunderover<CHTMLWrapper<N, T, D>>> & Constructor<CHTMLmsubsup<N, T, D>>;
export declare class CHTMLmunderover<N, T, D> extends CHTMLmunderover_base {
    static kind: string;
    static useIC: boolean;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
