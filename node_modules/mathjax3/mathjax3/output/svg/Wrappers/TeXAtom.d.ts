import { SVGWrapper } from '../Wrapper.js';
import { CommonTeXAtom } from '../../common/Wrappers/TeXAtom.js';
declare const SVGTeXAtom_base: (new (...args: any[]) => CommonTeXAtom) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGTeXAtom<N, T, D> extends SVGTeXAtom_base {
    static kind: string;
    toSVG(parent: N): void;
}
