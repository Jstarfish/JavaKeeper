import { SVGWrapper } from '../Wrapper.js';
import { CommonScriptbase } from '../../common/Wrappers/scriptbase.js';
declare const SVGscriptbase_base: (new (...args: any[]) => CommonScriptbase<SVGWrapper<N, T, D>>) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGscriptbase<N, T, D> extends SVGscriptbase_base {
    static kind: string;
    static useIC: boolean;
    toSVG(parent: N): void;
}
