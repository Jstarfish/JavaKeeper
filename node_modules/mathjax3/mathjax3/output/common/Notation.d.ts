import { AnyWrapper } from './Wrapper.js';
import { CommonMenclose } from './Wrappers/menclose.js';
export declare const ARROWX = 4, ARROWDX = 1, ARROWY = 2;
export declare const THICKNESS = 0.067;
export declare const PADDING = 0.2;
export declare const SOLID: string;
export declare type Menclose = CommonMenclose<any, any, any>;
export declare type Renderer<W extends AnyWrapper, N> = (node: W, child: N) => void;
export declare type BBoxExtender<W extends AnyWrapper> = (node: W) => number[];
export declare type BBoxBorder<W extends AnyWrapper> = (node: W) => number[];
export declare type Initializer<W extends AnyWrapper> = (node: W) => void;
export declare type NotationDef<W extends AnyWrapper, N> = {
    renderer: Renderer<W, N>;
    bbox: BBoxExtender<W>;
    border?: BBoxBorder<W>;
    renderChild?: boolean;
    init?: Initializer<W>;
    remove?: string;
};
export declare type DefPair<W extends AnyWrapper, N> = [string, NotationDef<W, N>];
export declare type DefList<W extends AnyWrapper, N> = Map<string, NotationDef<W, N>>;
export declare type List<W extends AnyWrapper, N> = {
    [notation: string]: NotationDef<W, N>;
};
export declare const sideIndex: {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare type Side = keyof typeof sideIndex;
export declare const sideNames: ("left" | "right" | "top" | "bottom")[];
export declare const fullBBox: BBoxExtender<CommonMenclose<any, any, any>>;
export declare const fullPadding: BBoxExtender<CommonMenclose<any, any, any>>;
export declare const fullBorder: BBoxBorder<CommonMenclose<any, any, any>>;
export declare const arrowHead: (node: CommonMenclose<any, any, any>) => number;
export declare const arrowBBoxHD: (node: CommonMenclose<any, any, any>, TRBL: number[]) => number[];
export declare const arrowBBoxW: (node: CommonMenclose<any, any, any>, TRBL: number[]) => number[];
export declare const arrowDef: {
    [name: string]: [number, boolean, boolean, string];
};
export declare const diagonalArrowDef: {
    [name: string]: [number, number, boolean, string];
};
export declare const arrowBBox: {
    [name: string]: BBoxExtender<CommonMenclose<any, any, any>>;
};
export declare const CommonBorder: <W extends CommonMenclose<any, any, any>, N>(render: Renderer<W, N>) => (side: "left" | "right" | "top" | "bottom") => [string, NotationDef<W, N>];
export declare const CommonBorder2: <W extends CommonMenclose<any, any, any>, N>(render: Renderer<W, N>) => (name: string, side1: "left" | "right" | "top" | "bottom", side2: "left" | "right" | "top" | "bottom") => [string, NotationDef<W, N>];
export declare const CommonDiagonalStrike: <W extends CommonMenclose<any, any, any>, N>(render: (sname: string) => Renderer<W, N>) => (name: string) => [string, NotationDef<W, N>];
export declare const CommonDiagonalArrow: <W extends CommonMenclose<any, any, any>, N>(render: Renderer<W, N>) => (name: string) => [string, NotationDef<W, N>];
export declare const CommonArrow: <W extends CommonMenclose<any, any, any>, N>(render: Renderer<W, N>) => (name: string) => [string, NotationDef<W, N>];
