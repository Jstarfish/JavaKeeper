import { CHTMLWrapper } from '../Wrapper.js';
import { CommonTeXAtom } from '../../common/Wrappers/TeXAtom.js';
declare const CHTMLTeXAtom_base: (new (...args: any[]) => CommonTeXAtom) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLTeXAtom<N, T, D> extends CHTMLTeXAtom_base {
    static kind: string;
    toCHTML(parent: N): void;
}
