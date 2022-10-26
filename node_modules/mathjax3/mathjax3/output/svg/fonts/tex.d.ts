import { FontData, DelimiterMap, CharMapMap } from '../FontData.js';
import { StyleList } from '../../common/CssStyles.js';
export declare class TeXFont extends FontData {
    protected static defaultVariants: string[][];
    protected static defaultDelimiters: DelimiterMap;
    protected static defaultSizeVariants: string[];
    protected static defaultChars: CharMapMap;
    readonly styles: StyleList;
}
