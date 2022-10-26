import { CHTMLWrapper } from '../Wrapper.js';
import { CommonScriptbase } from '../../common/Wrappers/scriptbase.js';
import { BBox } from '../BBox.js';
declare const CHTMLscriptbase_base: (new (...args: any[]) => CommonScriptbase<CHTMLWrapper<N, T, D>>) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLscriptbase<N, T, D> extends CHTMLscriptbase_base {
    static kind: string;
    static useIC: boolean;
    toCHTML(parent: N): void;
    protected setDeltaW(nodes: N[], dx: number[]): void;
    protected adjustOverDepth(over: N, overbox: BBox): void;
    protected adjustUnderDepth(under: N, underbox: BBox): void;
}
