import { SVGWrapper } from '../Wrapper.js';
import { CommonMfenced } from '../../common/Wrappers/mfenced.js';
import { SVGinferredMrow } from './mrow.js';
declare const SVGmfenced_base: (new (...args: any[]) => CommonMfenced) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmfenced<N, T, D> extends SVGmfenced_base {
    static kind: string;
    mrow: SVGinferredMrow<N, T, D>;
    toSVG(parent: N): void;
    setChildrenParent(parent: SVGWrapper<N, T, D>): void;
}
