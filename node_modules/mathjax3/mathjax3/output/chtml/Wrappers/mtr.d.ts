import { CHTMLWrapper, Constructor } from '../Wrapper.js';
import { CommonMtr } from '../../common/Wrappers/mtr.js';
import { CommonMlabeledtr } from '../../common/Wrappers/mtr.js';
import { CHTMLmtd } from './mtd.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmtr_base: Constructor<CommonMtr<CHTMLmtd<N, T, D>>> & Constructor<CHTMLWrapper<N, T, D>>;
export declare class CHTMLmtr<N, T, D> extends CHTMLmtr_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
declare const CHTMLmlabeledtr_base: Constructor<CommonMlabeledtr<CHTMLmtd<N, T, D>>> & Constructor<CHTMLmtr<N, T, D>>;
export declare class CHTMLmlabeledtr<N, T, D> extends CHTMLmlabeledtr_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
