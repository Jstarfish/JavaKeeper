import { SVGWrapper } from '../Wrapper.js';
import { CommonMs } from '../../common/Wrappers/ms.js';
declare const SVGms_base: (new (...args: any[]) => CommonMs) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGms<N, T, D> extends SVGms_base {
    static kind: string;
}
