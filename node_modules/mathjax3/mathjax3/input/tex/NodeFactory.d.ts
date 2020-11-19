import { TextNode, MmlNode } from '../../core/MmlTree/MmlNode.js';
import { MmlFactory } from '../../core/MmlTree/MmlFactory.js';
import ParseOptions from './ParseOptions.js';
export declare type NodeFactoryMethod = (factory: NodeFactory, kind: string, ...rest: any[]) => MmlNode;
export declare class NodeFactory {
    configuration: ParseOptions;
    protected mmlFactory: MmlFactory;
    private factory;
    setMmlFactory(mmlFactory: MmlFactory): void;
    static createNode(factory: NodeFactory, kind: string, children?: MmlNode[], def?: any, text?: TextNode): MmlNode;
    static createToken(factory: NodeFactory, kind: string, def?: any, text?: string): MmlNode;
    static createText(factory: NodeFactory, text: string): TextNode;
    static createError(factory: NodeFactory, message: string): MmlNode;
    set(kind: string, func: NodeFactoryMethod): void;
    setCreators(maps: {
        [kind: string]: NodeFactoryMethod;
    }): void;
    create(kind: string, ...rest: any[]): MmlNode;
}
