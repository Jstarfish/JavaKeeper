import { SVGWrapper } from '../Wrapper.js';
import { CommonSemantics } from '../../common/Wrappers/semantics.js';
import { BBox } from '../BBox.js';
declare const SVGsemantics_base: (new (...args: any[]) => CommonSemantics) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGsemantics<N, T, D> extends SVGsemantics_base {
    static kind: string;
    toSVG(parent: N): void;
}
export declare class SVGannotation<N, T, D> extends SVGWrapper<N, T, D> {
    static kind: string;
    toSVG(parent: N): void;
    computeBBox(): BBox;
}
export declare class SVGannotationXML<N, T, D> extends SVGWrapper<N, T, D> {
    static kind: string;
}
export declare class SVGxml<N, T, D> extends SVGWrapper<N, T, D> {
    static kind: string;
    static autoStyle: boolean;
    toSVG(parent: N): void;
    computeBBox(): BBox;
    protected getStyles(): void;
    protected getScale(): void;
    protected getVariant(): void;
}
