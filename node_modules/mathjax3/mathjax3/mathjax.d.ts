import { HandlerList } from './core/HandlerList.js';
import { OptionList } from './util/Options.js';
import { MathDocument } from './core/MathDocument.js';
export declare const MathJax: {
    version: string;
    handlers: HandlerList<any, any, any>;
    document: (document: any, options: OptionList) => MathDocument<any, any, any>;
    handleRetriesFor: (code: Function) => Promise<{}>;
    retryAfter: (promise: Promise<Object>) => void;
};
