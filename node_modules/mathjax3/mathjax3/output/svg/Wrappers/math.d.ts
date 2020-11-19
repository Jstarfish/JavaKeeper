import { SVGWrapper } from '../Wrapper.js';
import { CommonMath } from '../../common/Wrappers/math.js';
import { StyleList } from '../../common/CssStyles.js';
declare const SVGmath_base: (new (...args: any[]) => CommonMath) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmath<N, T, D> extends SVGmath_base {
    static kind: string;
    static styles: StyleList;
    toSVG(parent: N): void;
    setChildPWidths(recompute: boolean, w?: number, clear?: boolean): boolean;
}
