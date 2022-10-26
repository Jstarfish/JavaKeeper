import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMaction } from '../../common/Wrappers/maction.js';
import { EventHandler } from '../../common/Wrappers/maction.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmaction_base: (new (...args: any[]) => CommonMaction<CHTMLWrapper<N, T, D>>) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmaction<N, T, D> extends CHTMLmaction_base {
    static kind: string;
    static styles: StyleList;
    static actions: Map<string, [(node: CHTMLmaction<any, any, any>, data?: {
        [name: string]: any;
    }) => void, {
        [name: string]: any;
    }]>;
    toCHTML(parent: N): void;
    setEventHandler(type: string, handler: EventHandler): void;
}
