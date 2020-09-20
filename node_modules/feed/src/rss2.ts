/// <reference path="types/index.ts" />

import * as xml from "xml";

import { generator } from "./config";

const DOCTYPE = '<?xml version="1.0" encoding="utf-8"?>\n';

export default (ins: Feed) => {
  const { options } = ins;
  let isAtom = false;
  let isContent = false;

  const channel: any = [
    { title: options.title },
    { link: options.link },
    { description: options.description },
    {
      lastBuildDate: options.updated ? options.updated.toUTCString() : new Date().toUTCString()
    },
    { docs: "http://blogs.law.harvard.edu/tech/rss" },
    { generator: options.generator || generator }
  ];

  const rss: any[] = [{ _attr: { version: "2.0" } }, { channel }];

  /**
   * Channel language
   * https://validator.w3.org/feed/docs/rss2.html#ltimagegtSubelementOfLtchannelgt
   */
  if (options.language) {
    channel.push({
      language: options.language
    });
  }

  /**
   * Channel Image
   * http://cyber.law.harvard.edu/rss/rss.html#ltimagegtSubelementOfLtchannelgt
   */
  if (options.image) {
    channel.push({
      image: [{ title: options.title }, { url: options.image }, { link: options.link }]
    });
  }

  /**
   * Channel Copyright
   * http://cyber.law.harvard.edu/rss/rss.html#optionalChannelElements
   */
  if (options.copyright) {
    channel.push({ copyright: options.copyright });
  }

  /**
   * Channel Categories
   * http://cyber.law.harvard.edu/rss/rss.html#comments
   */
  ins.categories.forEach(category => {
    channel.push({ category });
  });

  /**
   * Feed URL
   * http://validator.w3.org/feed/docs/warning/MissingAtomSelfLink.html
   */
  const atomLink = options.feed || (options.feedLinks && options.feedLinks.atom);
  if (atomLink) {
    isAtom = true;

    channel.push({
      "atom:link": {
        _attr: {
          href: atomLink,
          rel: "self",
          type: "application/rss+xml"
        }
      }
    });
  }

  /**
   * Hub for PubSubHubbub
   * https://code.google.com/p/pubsubhubbub/
   */
  if (options.hub) {
    isAtom = true;
    channel.push({
      "atom:link": {
        _attr: {
          href: options.hub,
          rel: "hub"
        }
      }
    });
  }

  /**
   * Channel Categories
   * http://cyber.law.harvard.edu/rss/rss.html#hrelementsOfLtitemgt
   */
  ins.items.forEach((entry: Item) => {
    let item: any[] = [];

    if (entry.title) {
      item.push({ title: { _cdata: entry.title } });
    }

    if (entry.link) {
      item.push({ link: entry.link });
    }

    if (entry.guid) {
      item.push({ guid: entry.guid });
    } else if (entry.link) {
      item.push({ guid: entry.link });
    }

    if (entry.date) {
      item.push({ pubDate: entry.date.toUTCString() });
    }

    if (entry.description) {
      item.push({ description: { _cdata: entry.description } });
    }

    if (entry.content) {
      isContent = true;
      item.push({ "content:encoded": { _cdata: entry.content } });
    }
    /**
     * Item Author
     * http://cyber.law.harvard.edu/rss/rss.html#ltauthorgtSubelementOfLtitemgt
     */
    if (Array.isArray(entry.author)) {
      entry.author.map((author: Author) => {
        if (author.email && author.name) {
          item.push({ author: author.email + " (" + author.name + ")" });
        }
      });
    }

    if (entry.image) {
      item.push({ enclosure: [{ _attr: { url: entry.image } }] });
    }

    channel.push({ item });
  });

  if (isContent) {
    rss[0]._attr["xmlns:content"] = "http://purl.org/rss/1.0/modules/content/";
  }

  if (isAtom) {
    rss[0]._attr["xmlns:atom"] = "http://www.w3.org/2005/Atom";
  }

  return DOCTYPE + xml([{ rss }], true);
};
