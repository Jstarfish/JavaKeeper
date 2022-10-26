import { LiteAdaptor } from './liteAdaptor.js';
import { HTMLAdaptor } from './HTMLAdaptor.js';
export declare const chooseAdaptor: (() => HTMLAdaptor<HTMLElement, Text, Document>) | ((options?: {
    [name: string]: any;
}) => LiteAdaptor);
