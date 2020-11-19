import { AnyWrapper, WrapperConstructor, Constructor, CommonWrapperClass } from '../Wrapper.js';
export declare type ActionData = {
    [name: string]: any;
};
export declare type ActionHandler<W extends AnyWrapper> = (node: W, data?: ActionData) => void;
export declare type ActionPair<W extends AnyWrapper> = [ActionHandler<W>, ActionData];
export declare type ActionMap<W extends AnyWrapper> = Map<string, ActionPair<W>>;
export declare type ActionDef<W extends AnyWrapper> = [string, [ActionHandler<W>, ActionData]];
export declare type EventHandler = (event: Event) => void;
export declare const TooltipData: {
    dx: string;
    dy: string;
    postDelay: number;
    clearDelay: number;
    hoverTimer: number;
    clearTimer: number;
    stopTimers: (data: ActionData) => void;
};
export interface CommonMaction<W extends AnyWrapper> extends AnyWrapper {
    action: ActionHandler<W>;
    data: ActionData;
    dx: number;
    dy: number;
    readonly selected: W;
}
export interface CommonMactionClass<W extends AnyWrapper> extends CommonWrapperClass<any, any, any> {
    actions: ActionMap<W>;
}
export declare type MactionConstructor<W extends AnyWrapper> = Constructor<CommonMaction<W>>;
export declare function CommonMactionMixin<W extends AnyWrapper, T extends WrapperConstructor>(Base: T): MactionConstructor<W> & T;
