import { SVGWrapper } from '../Wrapper.js';
import { CommonMspace } from '../../common/Wrappers/mspace.js';
declare const SVGmspace_base: (new (...args: any[]) => CommonMspace) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmspace<N, T, D> extends SVGmspace_base {
    static kind: string;
}
