import { SVGWrapper, Constructor } from '../Wrapper.js';
import { SVGmsubsup, SVGmsub, SVGmsup } from './msubsup.js';
import { CommonMunder } from '../../common/Wrappers/munderover.js';
import { CommonMover } from '../../common/Wrappers/munderover.js';
import { CommonMunderover } from '../../common/Wrappers/munderover.js';
declare const SVGmunder_base: Constructor<CommonMunder<SVGWrapper<N, T, D>>> & Constructor<SVGmsub<N, T, D>>;
export declare class SVGmunder<N, T, D> extends SVGmunder_base {
    static kind: string;
    static useIC: boolean;
    toSVG(parent: N): void;
}
declare const SVGmover_base: Constructor<CommonMover<SVGWrapper<N, T, D>>> & Constructor<SVGmsup<N, T, D>>;
export declare class SVGmover<N, T, D> extends SVGmover_base {
    static kind: string;
    static useIC: boolean;
    toSVG(parent: N): void;
}
declare const SVGmunderover_base: Constructor<CommonMunderover<SVGWrapper<N, T, D>>> & Constructor<SVGmsubsup<N, T, D>>;
export declare class SVGmunderover<N, T, D> extends SVGmunderover_base {
    static kind: string;
    static useIC: boolean;
    toSVG(parent: N): void;
}
