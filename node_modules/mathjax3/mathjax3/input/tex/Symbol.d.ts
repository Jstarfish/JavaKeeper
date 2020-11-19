import { Args, Attributes, ParseMethod } from './Types.js';
export declare class Symbol {
    private _symbol;
    private _char;
    private _attributes;
    constructor(_symbol: string, _char: string, _attributes: Attributes);
    readonly symbol: string;
    readonly char: string;
    readonly attributes: Attributes;
}
export declare class Macro {
    private _symbol;
    private _func;
    private _args;
    constructor(_symbol: string, _func: ParseMethod, _args?: Args[]);
    readonly symbol: string;
    readonly func: ParseMethod;
    readonly args: Args[];
}
