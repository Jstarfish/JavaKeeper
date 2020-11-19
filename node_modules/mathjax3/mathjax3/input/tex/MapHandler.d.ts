import { SymbolMap } from './SymbolMap.js';
import { ParseInput, ParseResult, ParseMethod } from './Types.js';
import { Configuration } from './Configuration.js';
export declare type HandlerType = 'delimiter' | 'macro' | 'character' | 'environment';
export declare namespace MapHandler {
    let register: (map: SymbolMap) => void;
    let getMap: (name: string) => SymbolMap;
}
export declare type ExtensionMap = 'new-Macro' | 'new-Delimiter' | 'new-Command' | 'new-Environment';
export declare const ExtensionMaps: {
    [id: string]: ExtensionMap;
};
export declare class SubHandler {
    private _fallback;
    private _configuration;
    constructor(maps: string[], _fallback: ParseMethod);
    add(name: string): void;
    parse(input: ParseInput): ParseResult;
    lookup<T>(symbol: string): T;
    contains(symbol: string): boolean;
    toString(): string;
    applicable(symbol: string): SymbolMap;
    retrieve(name: string): SymbolMap;
    private warn(message);
}
export declare class SubHandlers {
    private map;
    constructor(config: Configuration);
    set(name: HandlerType, subHandler: SubHandler): void;
    get(name: HandlerType): SubHandler;
    retrieve(name: string): SymbolMap;
    keys(): IterableIterator<string>;
}
