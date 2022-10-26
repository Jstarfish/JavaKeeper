import { CommonOutputJax } from './common/OutputJax.js';
import { Styles } from '../util/Styles.js';
import { OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { CHTMLWrapper } from './chtml/Wrapper.js';
import { CHTMLWrapperFactory } from './chtml/WrapperFactory.js';
import { TeXFont } from './chtml/fonts/tex.js';
export declare class CHTML<N, T, D> extends CommonOutputJax<N, T, D, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>> {
    static NAME: string;
    static OPTIONS: OptionList;
    factory: CHTMLWrapperFactory<N, T, D>;
    font: TeXFont;
    constructor(options?: OptionList);
    escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>): N;
    styleSheet(html: MathDocument<N, T, D>): N;
    protected addClassStyles(CLASS: typeof CHTMLWrapper): void;
    protected processMath(math: MmlNode, parent: N): void;
    unknownText(text: string, variant: string): N;
    measureTextNode(text: N): {
        w: number;
        h: number;
        d: number;
    };
    getFontData(styles: Styles): [string, boolean, boolean];
}
