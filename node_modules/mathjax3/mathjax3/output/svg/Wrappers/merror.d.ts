import { SVGWrapper } from '../Wrapper.js';
import { StyleList } from '../../common/CssStyles.js';
export declare class SVGmerror<N, T, D> extends SVGWrapper<N, T, D> {
    static kind: string;
    static styles: StyleList;
    toSVG(parent: N): void;
}
