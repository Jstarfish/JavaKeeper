export declare type OptionList = {
    [name: string]: any;
};
export declare const APPEND: symbol;
export declare function makeArray(x: any): any[];
export declare function keys(def: OptionList): (string | symbol)[];
export declare function copy(def: OptionList): OptionList;
export declare function insert(dst: OptionList, src: OptionList, warn?: boolean): OptionList;
export declare function defaultOptions(options: OptionList, ...defs: OptionList[]): OptionList;
export declare function userOptions(options: OptionList, ...defs: OptionList[]): OptionList;
export declare function selectOptions(options: OptionList, ...keys: string[]): OptionList;
export declare function selectOptionsFromKeys(options: OptionList, object: OptionList): OptionList;
export declare function separateOptions(options: OptionList, ...objects: OptionList[]): OptionList[];
