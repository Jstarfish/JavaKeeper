import { SVGWrapper } from '../Wrapper.js';
import { CommonMglyph } from '../../common/Wrappers/mglyph.js';
declare const SVGmglyph_base: (new (...args: any[]) => CommonMglyph) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmglyph<N, T, D> extends SVGmglyph_base {
    static kind: string;
    toSVG(parent: N): void;
}
