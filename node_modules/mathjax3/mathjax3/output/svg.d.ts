import { CommonOutputJax } from './common/OutputJax.js';
import { OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { SVGWrapper } from './svg/Wrapper.js';
import { SVGWrapperFactory } from './svg/WrapperFactory.js';
import { TeXFont } from './svg/fonts/tex.js';
export declare const SVGNS = "http://www.w3.org/2000/svg";
export declare class SVG<N, T, D> extends CommonOutputJax<N, T, D, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>> {
    static NAME: string;
    static OPTIONS: OptionList;
    factory: SVGWrapperFactory<N, T, D>;
    font: TeXFont;
    shift: number;
    container: N;
    constructor(options?: OptionList);
    protected setScale(node: N): void;
    escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>): N;
    styleSheet(html: MathDocument<N, T, D>): N;
    protected addClassStyles(CLASS: typeof SVGWrapper): void;
    protected processMath(math: MmlNode, parent: N): void;
    protected setIndent(svg: N, align: string, shift: number): void;
    ex(m: number): string;
    svg(kind: string, properties?: OptionList, children?: (N | T)[]): N;
    unknownText(text: string, variant: string): N;
    measureTextNode(text: N): {
        w: number;
        h: number;
        d: number;
    };
}
