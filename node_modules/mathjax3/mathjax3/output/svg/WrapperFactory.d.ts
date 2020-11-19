import { SVG } from '../svg.js';
import { CommonWrapper } from '../common/Wrapper.js';
import { CommonWrapperFactory } from '../common/WrapperFactory.js';
import { SVGWrapper, SVGWrapperClass } from './Wrapper.js';
export declare class SVGWrapperFactory<N, T, D> extends CommonWrapperFactory<SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperClass<N, T, D>> {
    static defaultNodes: {
        [kind: string]: new (...args: any[]) => CommonWrapper<any, any, any>;
    };
    jax: SVG<N, T, D>;
}
