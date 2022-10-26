import { AbstractMathItem, Location } from '../../core/MathItem.js';
import { InputJax } from '../../core/InputJax.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { HTMLDocument } from './HTMLDocument.js';
export declare class HTMLMathItem<N, T, D> extends AbstractMathItem<N, T, D> {
    static STATE: {
        UNPROCESSED: number;
        COMPILED: number;
        TYPESET: number;
        INSERTED: number;
    };
    readonly adaptor: DOMAdaptor<N, T, D>;
    constructor(math: string, jax: InputJax<N, T, D>, display?: boolean, start?: Location<N, T>, end?: Location<N, T>);
    updateDocument(html: HTMLDocument<N, T, D>): void;
    removeFromDocument(restore?: boolean): void;
}
