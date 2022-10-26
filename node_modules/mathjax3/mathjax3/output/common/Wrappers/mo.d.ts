import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { DelimiterData } from '../FontData.js';
export declare const DirectionVH: {
    [n: number]: string;
};
export interface CommonMo extends AnyWrapper {
    noIC: boolean;
    size: number;
    isAccent: boolean;
    getStretchedVariant(WH: number[], exact?: boolean): void;
    getSize(name: string, value: number): number;
    getWH(WH: number[]): number;
    getStretchBBox(WHD: number[], D: number, C: DelimiterData): void;
    getBaseline(WHD: number[], HD: number, C: DelimiterData): number[];
}
export declare type MoConstructor = Constructor<CommonMo>;
export declare function CommonMoMixin<T extends WrapperConstructor>(Base: T): MoConstructor & T;
