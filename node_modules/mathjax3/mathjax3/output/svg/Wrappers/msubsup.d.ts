import { SVGWrapper, Constructor } from '../Wrapper.js';
import { SVGscriptbase } from './scriptbase.js';
import { CommonMsub } from '../../common/Wrappers/msubsup.js';
import { CommonMsubsup } from '../../common/Wrappers/msubsup.js';
declare const SVGmsub_base: Constructor<CommonMsub<SVGWrapper<N, T, D>>> & Constructor<SVGscriptbase<N, T, D>>;
export declare class SVGmsub<N, T, D> extends SVGmsub_base {
    static kind: string;
    static useIC: boolean;
}
declare const SVGmsup_base: Constructor<CommonMsub<SVGWrapper<N, T, D>>> & Constructor<SVGscriptbase<N, T, D>>;
export declare class SVGmsup<N, T, D> extends SVGmsup_base {
    static kind: string;
    static useIC: boolean;
}
declare const SVGmsubsup_base: Constructor<CommonMsubsup<SVGWrapper<N, T, D>>> & Constructor<SVGscriptbase<N, T, D>>;
export declare class SVGmsubsup<N, T, D> extends SVGmsubsup_base {
    static kind: string;
    static useIC: boolean;
    toSVG(parent: N): void;
}
