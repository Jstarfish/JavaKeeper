import { SVGWrapper } from '../Wrapper.js';
import { CommonMn } from '../../common/Wrappers/mn.js';
declare const SVGmn_base: (new (...args: any[]) => CommonMn) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmn<N, T, D> extends SVGmn_base {
    static kind: string;
}
