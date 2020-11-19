import { SVGWrapper } from '../Wrapper.js';
import { CommonMi } from '../../common/Wrappers/mi.js';
declare const SVGmi_base: (new (...args: any[]) => CommonMi) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmi<N, T, D> extends SVGmi_base {
    static kind: string;
}
