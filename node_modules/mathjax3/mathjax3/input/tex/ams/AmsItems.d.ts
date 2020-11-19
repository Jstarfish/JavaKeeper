import { ArrayItem } from '../base/BaseItems.js';
export declare class MultlineItem extends ArrayItem {
    constructor(factory: any, ...args: any[]);
    readonly kind: string;
    EndEntry(): void;
    EndRow(): void;
    EndTable(): void;
}
