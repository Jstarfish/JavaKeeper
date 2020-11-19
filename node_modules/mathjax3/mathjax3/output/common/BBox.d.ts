export declare const BBoxStyleAdjust: (string | number)[][];
export declare type BBoxData = {
    w?: number;
    h?: number;
    d?: number;
};
export declare class BBox {
    static fullWidth: string;
    w: number;
    h: number;
    d: number;
    scale: number;
    rscale: number;
    L: number;
    R: number;
    pwidth: string;
    ic: number;
    sk: number;
    static zero(): BBox;
    static empty(): BBox;
    constructor(def?: BBoxData);
    empty(): this;
    clean(): void;
    rescale(scale: number): void;
    combine(cbox: BBox, x?: number, y?: number): void;
    append(cbox: BBox): void;
    updateFrom(cbox: BBox): void;
}
