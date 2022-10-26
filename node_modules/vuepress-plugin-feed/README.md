# VuePress Plugin Feed

> RSS, Atom, and JSON feeds generator plugin for VuePress 1.x

[![Build Status](https://img.shields.io/travis/webmasterish/vuepress-plugin-feed/master.svg?style=flat-square)](https://travis-ci.org/webmasterish/vuepress-plugin-feed)
[![npm version](https://img.shields.io/npm/v/vuepress-plugin-feed.svg?style=flat-square)](http://npm.im/vuepress-plugin-feed)
[![Greenkeeper badge](https://badges.greenkeeper.io/webmasterish/vuepress-plugin-feed.svg?style=flat-square)](https://greenkeeper.io/)
[![MIT License](https://img.shields.io/npm/l/express.svg?style=flat-square)](http://opensource.org/licenses/MIT)


## Install


```sh
$ npm install -D vuepress-plugin-feed

# or

$ yarn add -D vuepress-plugin-feed
```


## Usage

Add `vuepress-plugin-feed` in your site or theme config file.

> See [official docs on using a plugin](https://vuepress.vuejs.org/plugin/using-a-plugin.html)


```js
// .vuepress/config.js
// or
// .vuepress/theme/index.js

// set your global feed options - override in page frontmatter `feed`
const feed_options = {
  canonical_base: 'https://webmasterish.com',
};

module.exports = {
  plugins: [
    [ 'feed', feed_options ]
  ]
}
```


### Page `frontmatter`

Page `frontmatter.feed` is optional.  It can be used to override the defaults.

Check the [`Page class`](lib/Page.js) for more details.


```md
---

title: Page Title

feed:
  enable: true
  title: Title used in feed
  description: Description used in feed
  image: /public/image.png
  author:
    -
      name: Author
      email: author@doamin.tld
      link: http://doamin.tld
  contributor:
    -
      name: Contributor
      email: contributor@doamin.tld
      link: http://doamin.tld

---

```


## How pages are added as feed items

A page is auto added as a feed item if one the following conditions is met:

- `frontmatter.feed.enable === true`
- `frontmatter.type === 'post'`
- it resides in whatever the `posts_directories` are set to (the defaults are `blog` and `_posts`)

if you need to exclude a particular page that meets one of the conditions above,
you can use `frontmatter.feed.enable === false`.

Details on how pages are filtered can be found in [`PLUGIN.is_feed_page()`](index.js).

The `PLUGIN.is_feed_page()` function is the default way of filtering the pages,
you can override it using `is_feed_page` option (see [Options section](#options) below).


## Options

> See Plugin Option API [official docs](https://vuepress.vuejs.org/plugin/option-api.html)


### Default options

You can override default options in 2 ways:

1. Global plugin options set in `.vuepress/config.js` or `.vuepress/theme/index.js`
   as described in [Usage](#usage)
2. Individual page/post `frontmatter` as shown in [Page `frontmatter`](#page-frontmatter)


```js
const {
  title,
  description
} = context.getSiteData ? context.getSiteData() : context;

// -----------------------------------------------------------------------------

// Feed class options
// @see: https://github.com/jpmonette/feed#example

const feed_options = {

  title,
  description,
  generator: PLUGIN.homepage,

  // ---------------------------------------------------------------------------

  // the following are auto populated in PLUGIN.get_options()
  // if they are not set as options
  /*
  id,
  link,
  feedLinks,
  */

  // ---------------------------------------------------------------------------

  // ref:
  /*
  title: "Feed Title",
  description: "This is my personal feed!",
  id: "http://example.com/",
  link: "http://example.com/",
  image: "http://example.com/image.png",
  favicon: "http://example.com/favicon.ico",
  copyright: "All rights reserved 2013, John Doe",
  updated: new Date(2013, 6, 14), // optional, default = today
  generator: "awesome", // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: "https://example.com/json",
    atom: "https://example.com/atom"
  },
  author: {
    name: "John Doe",
    email: "johndoe@example.com",
    link: "https://example.com/johndoe"
  }
  */

};

// -----------------------------------------------------------------------------

const default_options = {

  // required; it can also be used as enable/disable

  canonical_base: '',

  // ---------------------------------------------------------------------------

  // Feed class options - @see: https://github.com/jpmonette/feed#example
  // optional - auto-populated based on context.getSiteData()

  feed_options,

  // ---------------------------------------------------------------------------

  // @notes:
  // property name is also the name of the jpmonette/feed package function

  feeds: {

    rss2: {
      enable    : true,
      file_name : 'rss.xml',
      head_link : {
        enable: true,
        type  : 'application/rss+xml',
        title : '%%site_title%% RSS Feed',
      }
    },

    // -------------------------------------------------------------------------

    atom1: {
      enable    : true,
      file_name : 'feed.atom',
      head_link : {
        enable: true,
        type  : 'application/atom+xml',
        title : '%%site_title%% Atom Feed',
      }
    },

    // -------------------------------------------------------------------------

    json1: {
      enable    : true,
      file_name : 'feed.json',
      head_link : {
        enable: true,
        type  : 'application/json',
        title : '%%site_title%% JSON Feed',
      }
    },

  },

  // ---------------------------------------------------------------------------

  // page/post description sources

  // order of what gets the highest priority:
  //
  // 1. frontmatter
  // 2. page excerpt
  // 3. content markdown paragraph
  // 4. content regular html <p>

  description_sources: [

    'frontmatter',
    'excerpt',

    // markdown paragraph regex
    // @todo: needs work
    //
    /^((?:(?!^#)(?!^\-|\+)(?!^[0-9]+\.)(?!^!\[.*?\]\((.*?)\))(?!^\[\[.*?\]\])(?!^\{\{.*?\}\})[^\n]|\n(?! *\n))+)(?:\n *)+\n/gim,
    //
    // this excludes blockquotes using `(?!^>)`
    ///^((?:(?!^#)(?!^\-|\+)(?!^[0-9]+\.)(?!^!\[.*?\]\((.*?)\))(?!^>)(?!^\[\[.*?\]\])(?!^\{\{.*?\}\})[^\n]|\n(?! *\n))+)(?:\n *)+\n/gim,

    // html paragraph regex
    /<p(?:.*?)>(.*?)<\/p>/i,

  ],

  // ---------------------------------------------------------------------------

  // page/post image sources

  // order of what gets the highest priority:
  //
  // 1. frontmatter
  // 2. content markdown image such as `![alt text](http://url)`
  // 3. content regular html img

  image_sources: [

    'frontmatter',

    /!\[.*?\]\((.*?)\)/i,         // markdown image regex
    /<img.*?src=['"](.*?)['"]/i,  // html image regex

  ],

  // ---------------------------------------------------------------------------

  // pages in current directories will be auto added as feed
  // unless they are disabled using their frontmatter
  // this option is used by the default is_feed_page function

  posts_directories: ['/blog/', '/_posts/'],

  // ---------------------------------------------------------------------------

  // function to check if the page is to be used in a feed item

  is_feed_page: PLUGIN.is_feed_page, // function

  // ---------------------------------------------------------------------------

  count: 20,

  // optional sorting function for the entries. 
  // Gets the array entries as the input, expects the sorted array
  // as its output.
  // e.g.:   sort:  entries => _.reverse( _.sortBy( entries, 'date' ) ),
  // Don't forget to do a `const _ = require('lodash');` to be able to use `_`!

  sort: entries => entries,

  // ---------------------------------------------------------------------------

  // supported - use in config as needed

  // category
  // contributor

};
```


## Reference

- VuePress official [plugin docs](https://vuepress.vuejs.org/plugin/)
- VuePress official [Front Matter](https://vuepress.vuejs.org/guide/frontmatter.html)
- [jpmonette/feed](https://github.com/jpmonette/feed)
- [RSS 2.0 specificatiion](https://validator.w3.org/feed/docs/rss2.html)
- [Atom feed](https://validator.w3.org/feed/docs/atom.html)
- [JSON feed](https://jsonfeed.org/)


## Related Plugins

- [VuePress Plugin Auto Meta](https://github.com/webmasterish/vuepress-plugin-autometa)
- [VuePress Plugin Auto Nav](https://github.com/webmasterish/vuepress-plugin-autonav)
- [VuePress Plugin Minimal Google Analytics](https://github.com/webmasterish/vuepress-plugin-minimal-analytics)

## License

MIT © [webmasterish](https://webmasterish.com)
