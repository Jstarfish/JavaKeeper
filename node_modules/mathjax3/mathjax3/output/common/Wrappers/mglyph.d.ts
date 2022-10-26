import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
export interface CommonMglyph extends AnyWrapper {
    width: number;
    height: number;
    voffset: number;
    getParameters(): void;
}
export declare type MglyphConstructor = Constructor<CommonMglyph>;
export declare function CommonMglyphMixin<T extends WrapperConstructor>(Base: T): MglyphConstructor & T;
