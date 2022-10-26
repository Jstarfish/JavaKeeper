import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import StackItemFactory from '../StackItemFactory.js';
import { CheckType, BaseItem, StackItem, EnvList } from '../StackItem.js';
export declare class StartItem extends BaseItem {
    global: EnvList;
    constructor(factory: StackItemFactory, global: EnvList);
    readonly kind: string;
    readonly isOpen: boolean;
    checkItem(item: StackItem): CheckType;
}
export declare class StopItem extends BaseItem {
    readonly kind: string;
    readonly isClose: boolean;
}
export declare class OpenItem extends BaseItem {
    protected static errors: any;
    readonly kind: string;
    readonly isOpen: boolean;
    checkItem(item: StackItem): CheckType;
}
export declare class CloseItem extends BaseItem {
    readonly kind: string;
    readonly isClose: boolean;
}
export declare class PrimeItem extends BaseItem {
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
}
export declare class SubsupItem extends BaseItem {
    protected static errors: any;
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
}
export declare class OverItem extends BaseItem {
    constructor(factory: StackItemFactory);
    readonly kind: string;
    readonly isClose: boolean;
    checkItem(item: StackItem): CheckType;
    toString(): string;
}
export declare class LeftItem extends BaseItem {
    protected static errors: any;
    constructor(factory: StackItemFactory);
    readonly kind: string;
    readonly isOpen: boolean;
    checkItem(item: StackItem): CheckType;
}
export declare class RightItem extends BaseItem {
    constructor(factory: StackItemFactory);
    readonly kind: string;
    readonly isClose: boolean;
}
export declare class BeginItem extends BaseItem {
    readonly kind: string;
    readonly isOpen: boolean;
    checkItem(item: StackItem): CheckType;
}
export declare class EndItem extends BaseItem {
    readonly kind: string;
    readonly isClose: boolean;
}
export declare class StyleItem extends BaseItem {
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
}
export declare class PositionItem extends BaseItem {
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
}
export declare class CellItem extends BaseItem {
    readonly kind: string;
    readonly isClose: boolean;
}
export declare class MmlItem extends BaseItem {
    readonly isFinal: boolean;
    readonly kind: string;
}
export declare class FnItem extends BaseItem {
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
}
export declare class NotItem extends BaseItem {
    private remap;
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
}
export declare class DotsItem extends BaseItem {
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
}
export declare class ArrayItem extends BaseItem {
    table: MmlNode[];
    row: MmlNode[];
    frame: string[];
    hfill: number[];
    arraydef: {
        [key: string]: string | number | boolean;
    };
    dashed: boolean;
    readonly kind: string;
    readonly isOpen: boolean;
    checkItem(item: StackItem): CheckType;
    EndEntry(): void;
    EndRow(): void;
    EndTable(): void;
    checkLines(): void;
}
export declare class EqnArrayItem extends ArrayItem {
    constructor(factory: any, ...args: any[]);
    readonly kind: string;
    EndEntry(): void;
    EndRow(): void;
    EndTable(): void;
}
export declare class EquationItem extends BaseItem {
    constructor(factory: any, ...args: any[]);
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
}
