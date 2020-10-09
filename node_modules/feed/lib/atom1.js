"use strict";
/// <reference path="types/index.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var xml = require("xml");
var config_1 = require("./config");
var DOCTYPE = '<?xml version="1.0" encoding="utf-8"?>\n';
exports.default = (function (ins) {
    var options = ins.options;
    var feed = [];
    feed.push({ _attr: { xmlns: "http://www.w3.org/2005/Atom" } });
    feed.push({ id: options.id });
    feed.push({ title: options.title });
    if (options.updated) {
        feed.push({ updated: options.updated.toISOString() });
    }
    else {
        feed.push({ updated: new Date().toISOString() });
    }
    feed.push({ generator: options.generator || config_1.generator });
    if (options.author) {
        feed.push({ author: formatAuthor(options.author) });
    }
    // link (rel="alternate")
    if (options.link) {
        feed.push({ link: { _attr: { rel: "alternate", href: options.link } } });
    }
    // link (rel="self")
    var atomLink = options.feed || (options.feedLinks && options.feedLinks.atom);
    if (atomLink) {
        feed.push({ link: { _attr: { rel: "self", href: atomLink } } });
    }
    // link (rel="hub")
    if (options.hub) {
        feed.push({ link: { _attr: { rel: "hub", href: options.hub } } });
    }
    /**************************************************************************
     * "feed" node: optional elements
     *************************************************************************/
    if (options.description) {
        feed.push({ subtitle: options.description });
    }
    if (options.image) {
        feed.push({ logo: options.image });
    }
    if (options.favicon) {
        feed.push({ icon: options.favicon });
    }
    if (options.copyright) {
        feed.push({ rights: options.copyright });
    }
    ins.categories.forEach(function (category) {
        feed.push({ category: [{ _attr: { term: category } }] });
    });
    ins.contributors.forEach(function (contributor) { return feed.push({ contributor: formatAuthor(contributor) }); });
    // icon
    /**************************************************************************
     * "entry" nodes
     *************************************************************************/
    ins.items.forEach(function (item) {
        //
        // entry: required elements
        //
        var entry = [
            { title: { _attr: { type: "html" }, _cdata: item.title } },
            { id: item.id || item.link },
            { link: [{ _attr: { href: item.link } }] },
            { updated: item.date.toISOString() }
        ];
        //
        // entry: recommended elements
        //
        if (item.description) {
            entry.push({
                summary: { _attr: { type: "html" }, _cdata: item.description }
            });
        }
        if (item.content) {
            entry.push({
                content: { _attr: { type: "html" }, _cdata: item.content }
            });
        }
        // entry author(s)
        if (Array.isArray(item.author)) {
            item.author.forEach(function (author) { return entry.push({ author: formatAuthor(author) }); });
        }
        // content
        // link - relative link to article
        //
        // entry: optional elements
        //
        // category
        // contributor
        if (item.contributor && Array.isArray(item.contributor)) {
            item.contributor.forEach(function (contributor) { return entry.push({ contributor: formatAuthor(contributor) }); });
        }
        // published
        if (item.published) {
            entry.push({ published: item.published.toISOString() });
        }
        // source
        // rights
        if (item.copyright) {
            entry.push({ rights: item.copyright });
        }
        feed.push({ entry: entry });
    });
    return DOCTYPE + xml([{ feed: feed }], true);
});
var formatAuthor = function (author) {
    var name = author.name, email = author.email, link = author.link;
    var contributor = [];
    if (name) {
        contributor.push({ name: name });
    }
    if (email) {
        contributor.push({ email: email });
    }
    if (link) {
        contributor.push({ uri: link });
    }
    return contributor;
};
//# sourceMappingURL=atom1.js.map