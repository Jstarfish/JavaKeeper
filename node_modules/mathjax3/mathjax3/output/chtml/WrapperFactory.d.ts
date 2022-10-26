import { CHTML } from '../chtml.js';
import { CommonWrapper } from '../common/Wrapper.js';
import { CommonWrapperFactory } from '../common/WrapperFactory.js';
import { CHTMLWrapper, CHTMLWrapperClass } from './Wrapper.js';
export declare class CHTMLWrapperFactory<N, T, D> extends CommonWrapperFactory<CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperClass<N, T, D>> {
    static defaultNodes: {
        [kind: string]: new (...args: any[]) => CommonWrapper<any, any, any>;
    };
    jax: CHTML<N, T, D>;
}
