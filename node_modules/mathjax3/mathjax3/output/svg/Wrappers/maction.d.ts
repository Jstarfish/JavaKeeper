import { SVGWrapper } from '../Wrapper.js';
import { CommonMaction } from '../../common/Wrappers/maction.js';
import { EventHandler } from '../../common/Wrappers/maction.js';
import { StyleList } from '../../common/CssStyles.js';
declare const SVGmaction_base: (new (...args: any[]) => CommonMaction<SVGWrapper<N, T, D>>) & (new (...args: any[]) => SVGWrapper<N, T, D>);
export declare class SVGmaction<N, T, D> extends SVGmaction_base {
    static kind: string;
    static styles: StyleList;
    static actions: Map<string, [(node: SVGmaction<any, any, any>, data?: {
        [name: string]: any;
    }) => void, {
        [name: string]: any;
    }]>;
    toSVG(parent: N): void;
    setEventHandler(type: string, handler: EventHandler): void;
}
