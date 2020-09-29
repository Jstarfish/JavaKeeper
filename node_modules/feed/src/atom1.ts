/// <reference path="types/index.ts" />

import * as xml from "xml";
import { generator } from "./config";

const DOCTYPE = '<?xml version="1.0" encoding="utf-8"?>\n';

export default (ins: Feed) => {
  const { options } = ins;

  let feed: any = [];

  feed.push({ _attr: { xmlns: "http://www.w3.org/2005/Atom" } });
  feed.push({ id: options.id });
  feed.push({ title: options.title });

  if (options.updated) {
    feed.push({ updated: options.updated.toISOString() });
  } else {
    feed.push({ updated: new Date().toISOString() });
  }

  feed.push({ generator: options.generator || generator });

  if (options.author) {
    feed.push({ author: formatAuthor(options.author) });
  }

  // link (rel="alternate")
  if (options.link) {
    feed.push({ link: { _attr: { rel: "alternate", href: options.link } } });
  }

  // link (rel="self")
  const atomLink = options.feed || (options.feedLinks && options.feedLinks.atom);

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

  ins.categories.forEach((category: string) => {
    feed.push({ category: [{ _attr: { term: category } }] });
  });

  ins.contributors.forEach((contributor: Author) => feed.push({ contributor: formatAuthor(contributor) }));

  // icon

  /**************************************************************************
   * "entry" nodes
   *************************************************************************/
  ins.items.forEach((item: Item) => {
    //
    // entry: required elements
    //

    let entry: any = [
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
      item.author.forEach((author: Author) => entry.push({ author: formatAuthor(author) }));
    }

    // content

    // link - relative link to article

    //
    // entry: optional elements
    //

    // category

    // contributor
    if (item.contributor && Array.isArray(item.contributor)) {
      item.contributor.forEach((contributor: Author) => entry.push({ contributor: formatAuthor(contributor) }));
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

    feed.push({ entry });
  });

  return DOCTYPE + xml([{ feed }], true);
};

const formatAuthor = (author: Author) => {
  const { name, email, link } = author;
  let contributor = [];

  if (name) {
    contributor.push({ name });
  }

  if (email) {
    contributor.push({ email });
  }

  if (link) {
    contributor.push({ uri: link });
  }

  return contributor;
};
