import { CharMap, CharOptions } from '../common/FontData.js';
export * from '../common/FontData.js';
export declare type CharOptionsMap = {
    [name: number]: CharOptions;
};
export declare type CssMap = {
    [name: number]: number;
};
export declare function AddCSS(font: CharMap, css: CssMap, options: CharOptionsMap): CharMap;
