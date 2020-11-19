import { SVGWrapper } from '../Wrapper.js';
import { CommonMfrac } from '../../common/Wrappers/mfrac.js';
import { SVGmo } from './mo.js';
declare const SVGmfrac_base: (new (...args: any[]) => CommonMfrac) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmfrac<N, T, D> extends SVGmfrac_base {
    static kind: string;
    bevel: SVGmo<N, T, D>;
    toSVG(parent: N): void;
    protected makeFraction(display: boolean, t: number): void;
    protected makeAtop(display: boolean): void;
    protected makeBevelled(display: boolean): void;
}
