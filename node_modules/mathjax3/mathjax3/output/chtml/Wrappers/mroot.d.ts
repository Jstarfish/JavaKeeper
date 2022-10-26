import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMroot } from '../../common/Wrappers/mroot.js';
import { BBox } from '../BBox.js';
declare const CHTMLmroot_base: new (...args: any[]) => CommonMroot;
export declare class CHTMLmroot<N, T, D> extends CHTMLmroot_base {
    static kind: string;
    protected addRoot(ROOT: N, root: CHTMLWrapper<N, T, D>, sbox: BBox): void;
}
