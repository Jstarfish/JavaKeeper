import { ParseMethod } from './Types.js';
import { HandlerType } from './MapHandler.js';
import { StackItemClass } from './StackItem.js';
import { TagsClass } from './Tags.js';
import { OptionList } from '../../util/Options.js';
export declare type HandlerConfig = {
    [P in HandlerType]?: string[];
};
export declare type FallbackConfig = {
    [P in HandlerType]?: ParseMethod;
};
export declare type StackItemConfig = {
    [kind: string]: StackItemClass;
};
export declare type TagsConfig = {
    [kind: string]: TagsClass;
};
export declare type ProcessorList = (Function | [Function, number])[];
export declare class Configuration {
    readonly name: string;
    readonly handler: HandlerConfig;
    readonly fallback: FallbackConfig;
    readonly items: StackItemConfig;
    readonly tags: TagsConfig;
    readonly options: OptionList;
    readonly nodes: {
        [key: string]: any;
    };
    readonly preprocessors: ProcessorList;
    readonly postprocessors: ProcessorList;
    static create(name: string, config?: {
        handler?: HandlerConfig;
        fallback?: FallbackConfig;
        items?: StackItemConfig;
        tags?: TagsConfig;
        options?: OptionList;
        nodes?: {
            [key: string]: any;
        };
        preprocessors?: ProcessorList;
        postprocessors?: ProcessorList;
    }): Configuration;
    static empty(): Configuration;
    static extension(): Configuration;
    append(config: Configuration): void;
    private constructor(name, handler?, fallback?, items?, tags?, options?, nodes?, preprocessors?, postprocessors?);
}
export declare namespace ConfigurationHandler {
    let set: (name: string, map: Configuration) => void;
    let get: (name: string) => Configuration;
    let keys: () => IterableIterator<string>;
}
