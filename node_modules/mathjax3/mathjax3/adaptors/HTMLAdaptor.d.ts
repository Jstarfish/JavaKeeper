import { OptionList } from '../util/Options.js';
import { AttributeData, AbstractDOMAdaptor, DOMAdaptor } from '../core/DOMAdaptor.js';
export interface MinDocument<N, T> {
    documentElement: N;
    head: N;
    body: N;
    title: string;
    createElement(kind: string): N;
    createElementNS(ns: string, kind: string): N;
    createTextNode(text: string): T;
    querySelectorAll(selector: string): N[];
}
export interface MinHTMLElement<N, T> {
    nodeName: string;
    nodeValue: string;
    textContent: string;
    innerHTML: string;
    outerHTML: string;
    parentNode: N | Node;
    nextSibling: N | T | Node;
    previousSibling: N | T | Node;
    offsetWidth: number;
    offsetHeight: number;
    attributes: AttributeData[] | NamedNodeMap;
    classList: DOMTokenList;
    style: OptionList;
    childNodes: (N | T)[] | NodeList;
    firstChild: N | T | Node;
    lastChild: N | T | Node;
    getElementsByTagName(name: string): N[] | HTMLCollectionOf<Element>;
    getElementsByTagNameNS(ns: string, name: string): N[] | HTMLCollectionOf<Element>;
    appendChild(child: N | T): N | T | Node;
    removeChild(child: N | T): N | T | Node;
    replaceChild(nnode: N | T, onode: N | T): N | T | Node;
    insertBefore(nchild: N | T, ochild: N | T): void;
    cloneNode(deep: boolean): N | Node;
    setAttribute(name: string, value: string): void;
    getAttribute(name: string): string;
    removeAttribute(name: string): void;
    hasAttribute(name: string): boolean;
    getBoundingClientRect(): Object;
    getBBox?(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export interface MinText<N, T> {
    nodeName: string;
    nodeValue: string;
    parentNode: N | Node;
    nextSibling: N | T | Node;
    previousSibling: N | T | Node;
    splitText(n: number): T;
}
export interface MinDOMParser<D> {
    parseFromString(text: string, format?: string): D;
}
export interface MinWindow<N, D> {
    document: D;
    DOMParser: {
        new (): MinDOMParser<D>;
    };
    NodeList: any;
    HTMLCollection: any;
    HTMLElement: any;
    DocumentFragment: any;
    Document: any;
    getComputedStyle(node: N): any;
}
export interface MinHTMLAdaptor<N, T, D> extends DOMAdaptor<N, T, D> {
    window: MinWindow<N, D>;
}
export declare class HTMLAdaptor<N extends MinHTMLElement<N, T>, T extends MinText<N, T>, D extends MinDocument<N, T>> extends AbstractDOMAdaptor<N, T, D> implements MinHTMLAdaptor<N, T, D> {
    window: MinWindow<N, D>;
    parser: MinDOMParser<D>;
    constructor(window: MinWindow<N, D>);
    parse(text: string, format?: string): D;
    protected create(kind: string, ns?: string): N;
    text(text: string): T;
    head(doc: D): N;
    body(doc: D): N;
    root(doc: D): N;
    tags(node: N, name: string, ns?: string): N[];
    getElements(nodes: (string | N | N[])[], document: D): N[];
    parent(node: N | T): N;
    append(node: N, child: N | T): N | T;
    insert(nchild: N | T, ochild: N | T): void;
    remove(child: N | T): N | T;
    replace(nnode: N | T, onode: N | T): N | T;
    clone(node: N): N;
    split(node: T, n: number): T;
    next(node: N | T): N | T;
    previous(node: N | T): N | T;
    firstChild(node: N): N | T;
    lastChild(node: N): N | T;
    childNodes(node: N): (N | T)[];
    childNode(node: N, i: number): N | T;
    kind(node: N | T): string;
    value(node: N | T): string;
    textContent(node: N): string;
    innerHTML(node: N): string;
    outerHTML(node: N): string;
    setAttribute(node: N, name: string, value: string): void;
    getAttribute(node: N, name: string): string;
    removeAttribute(node: N, name: string): void;
    hasAttribute(node: N, name: string): boolean;
    allAttributes(node: N): AttributeData[];
    addClass(node: N, name: string): void;
    removeClass(node: N, name: string): void;
    hasClass(node: N, name: string): boolean;
    setStyle(node: N, name: string, value: string): void;
    getStyle(node: N, name: string): any;
    allStyles(node: N): any;
    fontSize(node: N): number;
    nodeSize(node: N, em?: number, local?: boolean): [number, number];
    nodeBBox(node: N): {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
}
