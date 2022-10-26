import { SVGWrapper, Constructor } from '../Wrapper.js';
import { CommonMtr } from '../../common/Wrappers/mtr.js';
import { CommonMlabeledtr } from '../../common/Wrappers/mtr.js';
import { SVGmtable } from './mtable.js';
import { SVGmtd } from './mtd.js';
export declare type SizeData = {
    x: number;
    y: number;
    w: number;
    lSpace: number;
    rSpace: number;
    lLine: number;
    rLine: number;
};
declare const SVGmtr_base: Constructor<CommonMtr<SVGmtd<N, T, D>>> & Constructor<SVGWrapper<N, T, D>>;
export declare class SVGmtr<N, T, D> extends SVGmtr_base {
    static kind: string;
    parent: SVGmtable<N, T, D>;
    H: number;
    D: number;
    tSpace: number;
    bSpace: number;
    tLine: number;
    bLine: number;
    toSVG(parent: N): void;
    protected placeCells(svg: N): void;
    placeCell(cell: SVGmtd<N, T, D>, sizes: SizeData): number;
    protected placeColor(svg: N): void;
}
declare const SVGmlabeledtr_base: Constructor<CommonMlabeledtr<SVGmtd<N, T, D>>> & Constructor<SVGmtr<N, T, D>>;
export declare class SVGmlabeledtr<N, T, D> extends SVGmlabeledtr_base {
    static kind: string;
    toSVG(parent: N): void;
}
