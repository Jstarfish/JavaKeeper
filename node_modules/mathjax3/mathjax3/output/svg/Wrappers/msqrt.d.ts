import { SVGWrapper } from '../Wrapper.js';
import { CommonMsqrt } from '../../common/Wrappers/msqrt.js';
import { BBox } from '../BBox.js';
declare const SVGmsqrt_base: (new (...args: any[]) => CommonMsqrt) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmsqrt<N, T, D> extends SVGmsqrt_base {
    static kind: string;
    dx: number;
    toSVG(parent: N): void;
    protected addRoot(ROOT: N, root: SVGWrapper<N, T, D>, sbox: BBox): void;
}
