import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMpadded } from '../../common/Wrappers/mpadded.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmpadded_base: (new (...args: any[]) => CommonMpadded) & (new (...args: any[]) => CHTMLWrapper<N, T, D>);
export declare class CHTMLmpadded<N, T, D> extends CHTMLmpadded_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
