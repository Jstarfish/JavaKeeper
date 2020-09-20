/// <reference path="types/index.d.ts" />
export declare class Feed {
    options: FeedOptions;
    items: Item[];
    categories: string[];
    contributors: Author[];
    extensions: Extension[];
    constructor(options: FeedOptions);
    addItem: (item: Item) => number;
    addCategory: (category: string) => number;
    addContributor: (contributor: Author) => number;
    addExtension: (extension: Extension) => number;
    /**
     * Returns a Atom 1.0 feed
     */
    atom1: () => string;
    /**
     * Returns a RSS 2.0 feed
     */
    rss2: () => string;
    /**
     * Returns a JSON1 feed
     */
    json1: () => string;
}
