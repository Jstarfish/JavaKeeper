import { CharMap } from '../common/FontData.js';
export * from '../common/FontData.js';
export declare type CharStringMap = {
    [name: number]: string;
};
export declare function AddPaths(font: CharMap, paths: CharStringMap, content: CharStringMap): CharMap;
