import { OptionList } from '../../util/Options.js';
import { CommonWrapper, CommonWrapperClass, Constructor } from '../common/Wrapper.js';
import { SVG } from '../svg.js';
import { SVGWrapperFactory } from './WrapperFactory.js';
import { SVGmo } from './Wrappers/mo.js';
import { StyleList } from '../common/CssStyles.js';
export { Constructor, StringMap } from '../common/Wrapper.js';
export declare type SVGConstructor<N, T, D> = Constructor<SVGWrapper<N, T, D>>;
export interface SVGWrapperClass<N, T, D> extends CommonWrapperClass<any, any, any> {
    kind: string;
    styles: StyleList;
}
export declare class SVGWrapper<N, T, D> extends CommonWrapper<SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperClass<N, T, D>> {
    static kind: string;
    static autoStyle: boolean;
    static styles: StyleList;
    protected factory: SVGWrapperFactory<N, T, D>;
    parent: SVGWrapper<N, T, D>;
    childNodes: SVGWrapper<N, T, D>[];
    element: N;
    toSVG(parent: N): void;
    addChildren(parent: N): void;
    protected standardSVGnode(parent: N): N;
    protected createSVGnode(parent: N): N;
    protected handleStyles(): void;
    protected handleScale(): void;
    protected handleColor(): void;
    protected handleAttributes(): void;
    place(x: number, y: number, element?: N): void;
    placeChar(n: number, x: number, y: number, parent: N, variant?: string): number;
    drawBBox(): void;
    html(type: string, def?: OptionList, content?: (N | T)[]): N;
    svg(type: string, def?: OptionList, content?: (N | T)[]): N;
    text(text: string): T;
    protected createMo(text: string): SVGmo<N, T, D>;
    coreMO(): SVGmo<N, T, D>;
    fixed(x: number, n?: number): string;
}
