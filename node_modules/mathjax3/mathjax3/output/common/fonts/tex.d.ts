import { FontData, CssFontMap } from '../FontData.js';
import { StyleList } from '../../common/CssStyles.js';
import { StringMap } from '../Wrapper.js';
export declare class CommonTeXFont extends FontData {
    protected static defaultVariants: string[][];
    protected static defaultCssFonts: CssFontMap;
    protected static defaultVariantClasses: StringMap;
    protected static defaultSizeVariants: string[];
    readonly styles: StyleList;
    protected em(n: number): string;
    protected em0(n: number): string;
    protected getDelimiterData(n: number): [number, number, number] | [number, number, number, {
        c?: string;
        f?: string;
        css?: number;
        ic?: number;
        sk?: number;
        p?: string;
        unknown?: boolean;
    }];
}
