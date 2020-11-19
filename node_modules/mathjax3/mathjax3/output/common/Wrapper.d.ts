import { AbstractWrapper, WrapperClass } from '../../core/Tree/Wrapper.js';
import { PropertyList } from '../../core/Tree/Node.js';
import { MmlNode, TextNode } from '../../core/MmlTree/MmlNode.js';
import { Property } from '../../core/Tree/Node.js';
import { Styles } from '../../util/Styles.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { CommonOutputJax } from './OutputJax.js';
import { CommonWrapperFactory } from './WrapperFactory.js';
import { BBox } from './BBox.js';
import { FontData, DelimiterData, CharOptions, DIRECTION } from './FontData.js';
import { StyleList } from '../common/CssStyles.js';
export declare type StringMap = {
    [key: string]: string;
};
export declare type Constructor<T> = new (...args: any[]) => T;
export declare type AnyWrapper = CommonWrapper<any, any, any>;
export declare type WrapperConstructor = Constructor<AnyWrapper>;
export interface CommonWrapperClass<J extends CommonOutputJax<any, any, any, W, CommonWrapperFactory<J, W, C>>, W extends CommonWrapper<J, W, C>, C extends CommonWrapperClass<J, W, C>> extends WrapperClass<MmlNode, CommonWrapper<J, W, C>> {
    new (factory: CommonWrapperFactory<J, W, C>, node: MmlNode, ...args: any[]): W;
}
export declare class CommonWrapper<J extends CommonOutputJax<any, any, any, W, CommonWrapperFactory<J, W, C>>, W extends CommonWrapper<J, W, C>, C extends CommonWrapperClass<J, W, C>> extends AbstractWrapper<MmlNode, CommonWrapper<J, W, C>> {
    static kind: string;
    static styles: StyleList;
    static removeStyles: [string];
    static skipAttributes: {
        [name: string]: boolean;
    };
    static BOLDVARIANTS: {
        [name: string]: StringMap;
    };
    static ITALICVARIANTS: {
        [name: string]: StringMap;
    };
    protected factory: CommonWrapperFactory<J, W, C>;
    parent: W;
    childNodes: W[];
    protected removedStyles: StringMap;
    protected styles: Styles;
    variant: string;
    bbox: BBox;
    protected bboxComputed: boolean;
    stretch: DelimiterData;
    font: FontData;
    readonly jax: J;
    readonly adaptor: DOMAdaptor<any, any, any>;
    readonly metrics: {
        em: number;
        ex: number;
        containerWidth: number;
        lineWidth: number;
        scale: number;
    };
    readonly fixesPWidth: boolean;
    constructor(factory: CommonWrapperFactory<J, W, C>, node: MmlNode, parent?: W);
    wrap(node: MmlNode, parent?: W): W;
    getBBox(save?: boolean): BBox;
    protected computeBBox(bbox: BBox, recompute?: boolean): void;
    setChildPWidths(recompute: boolean, w?: (number | null), clear?: boolean): boolean;
    invalidateBBox(): void;
    protected copySkewIC(bbox: BBox): void;
    protected getStyles(): void;
    protected getVariant(): void;
    protected explicitVariant(fontFamily: string, fontWeight: string, fontStyle: string): string;
    protected getScale(): void;
    protected getSpace(): void;
    protected getMathMLSpacing(): void;
    protected getTeXSpacing(isTop: boolean, hasSpacing: boolean): void;
    protected isTopEmbellished(): boolean;
    core(): W;
    coreMO(): W;
    getText(): string;
    canStretch(direction: DIRECTION): boolean;
    protected getAlignShift(): [string, number];
    protected getAlignX(W: number, bbox: BBox, align: string): number;
    protected getAlignY(H: number, D: number, h: number, d: number, align: string): number;
    getWrapWidth(i: number): number;
    getChildAlign(i: number): string;
    protected percent(m: number): string;
    protected em(m: number): string;
    protected px(m: number, M?: number): string;
    protected length2em(length: Property, size?: number, scale?: number): number;
    protected unicodeChars(text: string): number[];
    protected char(n: number, escape?: boolean): string;
    remapChars(chars: number[]): number[];
    mmlText(text: string): TextNode;
    mmlNode(kind: string, properties?: PropertyList, children?: MmlNode[]): MmlNode;
    protected createMo(text: string): W;
    protected getVariantChar(variant: string, n: number): [number, number, number, CharOptions];
}
