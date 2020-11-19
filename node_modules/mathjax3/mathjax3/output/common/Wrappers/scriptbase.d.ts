import { AnyWrapper, WrapperConstructor, Constructor, CommonWrapperClass } from '../Wrapper.js';
import { BBox } from '../BBox.js';
export interface CommonScriptbase<W extends AnyWrapper> extends AnyWrapper {
    baseCore: W;
    readonly baseChild: W;
    readonly script: W;
    isCharBase(): boolean;
    coreIC(): number;
    getOffset(bbox: BBox, sbox: BBox): number[];
    getV(bbox: BBox, sbox: BBox): number;
    getU(bbox: BBox, sbox: BBox): number;
    hasMovableLimits(): boolean;
    getOverKU(basebox: BBox, overbox: BBox): number[];
    getUnderKV(basebox: BBox, underbox: BBox): number[];
    getDeltaW(boxes: BBox[], delta?: number[]): number[];
    getDelta(noskew?: boolean): number;
    stretchChildren(): void;
}
export interface CommonScriptbaseClass extends CommonWrapperClass<any, any, any> {
    useIC: boolean;
}
export declare type ScriptbaseConstructor<W extends AnyWrapper> = Constructor<CommonScriptbase<W>>;
export declare function CommonScriptbaseMixin<W extends AnyWrapper, T extends WrapperConstructor>(Base: T): ScriptbaseConstructor<W> & T;
