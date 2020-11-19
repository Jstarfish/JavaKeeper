import { AnyWrapper, WrapperConstructor, Constructor, CommonWrapperClass } from '../Wrapper.js';
import * as Notation from '../Notation.js';
import { CommonMsqrt } from './msqrt.js';
export interface CommonMenclose<W extends AnyWrapper, S extends CommonMsqrt, N> extends AnyWrapper {
    notations: Notation.List<W, N>;
    renderChild: Notation.Renderer<W, N>;
    msqrt: S;
    padding: number;
    thickness: number;
    arrowhead: {
        x: number;
        y: number;
        dx: number;
    };
    getParameters(): void;
    getNotations(): void;
    removeRedundantNotations(): void;
    initializeNotations(): void;
    getBBoxExtenders(): number[];
    getPadding(): number[];
    maximizeEntries(X: number[], Y: number[]): void;
    getArgMod(w: number, h: number): number[];
    arrow(w: number, a: number, double?: boolean): N;
    arrowData(): {
        a: number;
        W: number;
        x: number;
        y: number;
    };
    createMsqrt(child: W): S;
    sqrtTRBL(): number[];
}
export interface CommonMencloseClass<W extends AnyWrapper, N> extends CommonWrapperClass<any, any, any> {
    notations: Notation.DefList<W, N>;
}
export declare type MencloseConstructor<W extends AnyWrapper, S extends CommonMsqrt, N> = Constructor<CommonMenclose<W, S, N>>;
export declare function CommonMencloseMixin<W extends AnyWrapper, S extends CommonMsqrt, N, T extends WrapperConstructor>(Base: T): MencloseConstructor<W, S, N> & T;
