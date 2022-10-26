import { SVGWrapper } from '../Wrapper.js';
import { CommonMpadded } from '../../common/Wrappers/mpadded.js';
declare const SVGmpadded_base: (new (...args: any[]) => CommonMpadded) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmpadded<N, T, D> extends SVGmpadded_base {
    static kind: string;
    toSVG(parent: N): void;
}
