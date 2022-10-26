import { AbstractInputJax } from '../core/InputJax.js';
import { OptionList } from '../util/Options.js';
import { MathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { MmlFactory } from '../core/MmlTree/MmlFactory.js';
import { FindTeX } from './tex/FindTeX.js';
import TexError from './tex/TexError.js';
import ParseOptions from './tex/ParseOptions.js';
import { Configuration } from './tex/Configuration.js';
import './tex/base/BaseConfiguration.js';
export declare class TeX<N, T, D> extends AbstractInputJax<N, T, D> {
    static NAME: string;
    static OPTIONS: OptionList;
    protected findTeX: FindTeX<N, T, D>;
    protected configuration: Configuration;
    protected latex: string;
    protected mathNode: MmlNode;
    private _parseOptions;
    protected static configure(packages: string[]): Configuration;
    protected static tags(options: ParseOptions, configuration: Configuration): void;
    constructor(options?: OptionList);
    setMmlFactory(mmlFactory: MmlFactory): void;
    readonly parseOptions: ParseOptions;
    compile(math: MathItem<N, T, D>): MmlNode;
    findMath(strings: string[]): {
        math: string;
        start: {
            i?: number;
            n?: number;
            delim?: string;
            node?: N | T;
        };
        end: {
            i?: number;
            n?: number;
            delim?: string;
            node?: N | T;
        };
        open?: string;
        close?: string;
        n?: number;
        display: boolean;
    }[];
    protected formatError(err: TexError): MmlNode;
}
