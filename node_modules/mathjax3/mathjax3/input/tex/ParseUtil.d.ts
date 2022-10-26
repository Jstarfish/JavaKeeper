import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { EnvList } from './StackItem.js';
import { ArrayItem } from './base/BaseItems.js';
import ParseOptions from './ParseOptions.js';
import TexParser from './TexParser.js';
import '../../util/entities/n.js';
declare namespace ParseUtil {
    function matchDimen(dim: string, rest?: boolean): [string, string, number];
    function dimen2em(dim: string): number;
    function Em(m: number): string;
    function fenced(configuration: ParseOptions, open: string, mml: MmlNode, close: string): MmlNode;
    function fixedFence(configuration: ParseOptions, open: string, mml: MmlNode, close: string): MmlNode;
    function mathPalette(configuration: ParseOptions, fence: string, side: string): MmlNode;
    function fixInitialMO(configuration: ParseOptions, nodes: MmlNode[]): void;
    function mi2mo(parser: TexParser, mi: MmlNode): MmlNode;
    function internalMath(parser: TexParser, text: string, level?: number | string): MmlNode[];
    function trimSpaces(text: string): string;
    function setArrayAlign(array: ArrayItem, align: string): ArrayItem;
    function substituteArgs(parser: TexParser, args: string[], str: string): string;
    function addArgs(parser: TexParser, s1: string, s2: string): string;
    function checkEqnEnv(parser: TexParser): void;
    function MmlFilterAttribute(parser: TexParser, name: string, value: string): string;
    function getFontDef(parser: TexParser): EnvList;
    function splitPackageOptions(attrib: string, allowed?: {
        [key: string]: number;
    }): EnvList;
}
export default ParseUtil;
