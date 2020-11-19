import { AbstractNodeFactory } from '../Tree/NodeFactory.js';
import { MmlNode, MmlNodeClass } from './MmlNode.js';
export declare class MmlFactory extends AbstractNodeFactory<MmlNode, MmlNodeClass> {
    static defaultNodes: {
        [kind: string]: MmlNodeClass;
    };
    readonly MML: {
        [kind: string]: (...args: any[]) => MmlNode;
    };
}
