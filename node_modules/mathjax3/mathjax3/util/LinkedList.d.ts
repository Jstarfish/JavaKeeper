export declare type SortFn<DataClass> = (a: DataClass, b: DataClass) => boolean;
export declare class ListItem<DataClass> {
    data: DataClass | symbol;
    next: ListItem<DataClass>;
    prev: ListItem<DataClass>;
    constructor(data?: any);
}
export declare class LinkedList<DataClass> {
    protected list: ListItem<DataClass>;
    constructor(...args: DataClass[]);
    toArray(): DataClass[];
    isBefore(a: DataClass, b: DataClass): boolean;
    push(...args: DataClass[]): this;
    pop(): DataClass;
    unshift(...args: DataClass[]): this;
    shift(): DataClass;
    clear(): this;
    [Symbol.iterator](): Iterator<DataClass>;
    reversed(): {
        [Symbol.iterator](): Iterator<DataClass>;
        next(): IteratorResult<DataClass>;
        toArray(): DataClass[];
    };
    insert(data: DataClass, isBefore?: SortFn<DataClass>): this;
    sort(isBefore?: SortFn<DataClass>): this;
    merge(list: LinkedList<DataClass>, isBefore?: SortFn<DataClass>): this;
}
