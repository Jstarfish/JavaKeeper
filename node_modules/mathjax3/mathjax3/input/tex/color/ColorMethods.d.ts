import { OptionList } from '../../../util/Options.js';
import { ParseMethod } from '../Types.js';
export declare type ColorModelProcessor = (parserOptions: OptionList, def: string) => string;
export declare type MethodsMap = Record<string, ColorModelProcessor>;
export declare const ColorModelProcessors: MethodsMap;
export declare function getColor(parserOptions: OptionList, model: string, def: string): string;
export declare const ColorMethods: Record<string, ParseMethod>;
