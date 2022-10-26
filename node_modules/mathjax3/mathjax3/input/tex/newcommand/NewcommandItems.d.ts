import { CheckType, BaseItem, StackItem } from '../StackItem.js';
export declare class BeginEnvItem extends BaseItem {
    readonly kind: string;
    readonly isOpen: boolean;
    checkItem(item: StackItem): CheckType;
}
