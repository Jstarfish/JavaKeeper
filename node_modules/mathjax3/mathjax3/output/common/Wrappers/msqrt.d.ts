import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { BBox } from '../BBox.js';
export interface CommonMsqrt extends AnyWrapper {
    readonly base: number;
    readonly surd: number;
    readonly root: number;
    surdH: number;
    combineRootBBox(bbox: BBox, sbox: BBox): void;
    getPQ(sbox: BBox): number[];
    getRootDimens(sbox: BBox): number[];
}
export declare type MsqrtConstructor = Constructor<CommonMsqrt>;
export declare function CommonMsqrtMixin<T extends WrapperConstructor>(Base: T): MsqrtConstructor & T;
