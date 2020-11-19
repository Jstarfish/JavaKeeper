import { SVGWrapper } from '../Wrapper.js';
import { CommonMenclose } from '../../common/Wrappers/menclose.js';
import { SVGmsqrt } from './msqrt.js';
import * as Notation from '../Notation.js';
declare const SVGmenclose_base: (new (...args: any[]) => CommonMenclose<SVGWrapper<N, T, D>, SVGmsqrt<N, T, D>, N>) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmenclose<N, T, D> extends SVGmenclose_base {
    static kind: string;
    static notations: Notation.DefList<SVGmenclose<any, any, any>, any>;
    toSVG(parent: N): void;
    arrow(W: number, a: number, double?: boolean): N;
    line(pq: [number, number, number, number]): N;
    box(w: number, h: number, d: number, r?: number): N;
    ellipse(w: number, h: number, d: number): N;
    path(join: string, ...P: (string | number)[]): N;
    fill(...P: (string | number)[]): N;
}
