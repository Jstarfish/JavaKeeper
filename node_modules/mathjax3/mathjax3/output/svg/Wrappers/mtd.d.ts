import { SVGWrapper } from '../Wrapper.js';
import { CommonMtd } from '../../common/Wrappers/mtd.js';
declare const SVGmtd_base: (new (...args: any[]) => CommonMtd) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmtd<N, T, D> extends SVGmtd_base {
    static kind: string;
    placeCell(x: number, y: number, W: number, H: number, D: number): number[];
    placeColor(x: number, y: number, W: number, H: number): void;
}
