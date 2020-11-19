import TexParser from '../TexParser.js';
import { Symbol } from '../Symbol.js';
import { Args, Attributes, ParseMethod } from '../Types.js';
declare namespace NewcommandUtil {
    function disassembleSymbol(name: string, symbol: Symbol): Args[];
    function assembleSymbol(args: Args[]): Symbol;
    function GetCSname(parser: TexParser, cmd: string): string;
    function GetTemplate(parser: TexParser, cmd: string, cs: string): number | string[];
    function GetParameter(parser: TexParser, name: string, param: string): string;
    function MatchParam(parser: TexParser, param: string): 0 | 1;
    function addDelimiter(parser: TexParser, cs: string, char: string, attr: Attributes): void;
    function addMacro(parser: TexParser, cs: string, func: ParseMethod, attr: Args[], symbol?: string): void;
    function addEnvironment(parser: TexParser, env: string, func: ParseMethod, attr: Args[]): void;
}
export default NewcommandUtil;
