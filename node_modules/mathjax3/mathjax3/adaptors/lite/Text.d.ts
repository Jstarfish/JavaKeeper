import { LiteElement } from './Element.js';
export declare class LiteText {
    value: string;
    parent: LiteElement;
    readonly kind: string;
    constructor(text?: string);
}
export declare class LiteComment extends LiteText {
    readonly kind: string;
}
