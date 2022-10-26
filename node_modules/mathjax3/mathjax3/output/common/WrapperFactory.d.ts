import { CommonOutputJax } from './OutputJax.js';
import { AbstractWrapperFactory } from '../../core/Tree/WrapperFactory.js';
import { CommonWrapper, CommonWrapperClass } from './Wrapper.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
export declare class CommonWrapperFactory<J extends CommonOutputJax<any, any, any, W, CommonWrapperFactory<J, W, C>>, W extends CommonWrapper<J, W, C>, C extends CommonWrapperClass<J, W, C>> extends AbstractWrapperFactory<MmlNode, W, C> {
    static defaultNodes: {
        [kind: string]: CommonWrapperClass<any, any, any>;
    };
    jax: J;
    readonly Wrappers: {
        [kind: string]: (...args: any[]) => W;
    };
}
