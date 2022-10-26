import StackItemFactory from './StackItemFactory.js';
import { Tags } from './Tags.js';
import { SubHandlers } from './MapHandler.js';
import { NodeFactory } from './NodeFactory.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import TexParser from './TexParser.js';
import { OptionList } from '../../util/Options.js';
import { Configuration } from './Configuration.js';
export default class ParseOptions {
    handlers: SubHandlers;
    options: OptionList;
    itemFactory: StackItemFactory;
    nodeFactory: NodeFactory;
    tags: Tags;
    parsers: TexParser[];
    root: MmlNode;
    nodeLists: {
        [key: string]: MmlNode[];
    };
    error: boolean;
    constructor(configuration: Configuration, options?: OptionList[]);
    pushParser(parser: TexParser): void;
    popParser(): void;
    readonly parser: TexParser;
    clear(): void;
    addNode(property: string, node: MmlNode): void;
    getList(property: string): MmlNode[];
    private inTree(node);
}
