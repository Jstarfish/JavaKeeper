import { CHTMLWrapper, Constructor } from '../Wrapper.js';
import { CHTMLmsubsup } from './msubsup.js';
import { CommonMmultiscripts } from '../../common/Wrappers/mmultiscripts.js';
import { BBox } from '../BBox.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmmultiscripts_base: Constructor<CommonMmultiscripts<CHTMLWrapper<N, T, D>>> & Constructor<CHTMLmsubsup<N, T, D>>;
export declare class CHTMLmmultiscripts<N, T, D> extends CHTMLmmultiscripts_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
    protected addScripts(u: number, v: number, isPre: boolean, sub: BBox, sup: BBox, i: number, n: number): void;
}
