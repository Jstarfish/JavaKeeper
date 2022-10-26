export declare type StyleData = {
    [property: string]: string | number;
};
export declare type StyleList = {
    [selector: string]: StyleData;
};
export declare class CssStyles {
    protected styles: StyleList;
    readonly cssText: string;
    constructor(styles?: StyleList);
    addStyles(styles: StyleList): void;
    removeStyles(...selectors: string[]): void;
    getStyleString(): string;
    getStyleDefString(styles: StyleData): string;
}
