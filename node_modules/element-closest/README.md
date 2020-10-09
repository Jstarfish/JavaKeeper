# closest [<img src="https://jonneal.dev/dom-logo.svg" alt="closest" width="90" height="90" align="right">][closest]

[<img alt="npm version" src="https://img.shields.io/npm/v/element-closest.svg" height="20">](https://www.npmjs.com/package/element-closest)
[<img alt="build status" src="https://img.shields.io/travis/jonathantneal/closest/master.svg" height="20">](https://travis-ci.org/jonathantneal/closest)
[<img alt="support chat" src="https://img.shields.io/badge/support-chat-blue.svg" height="20">](https://gitter.im/postcss/postcss)

[closest] is a polyfill for [`#Element.closest`].

```bash
npm install element-closest
```

The [`#Element.closest`] method returns the closest element that matches a selector. It returns the element itself, one of its ancestor, or `null` if there isn't any match.

```js
element.closest(selectorString) //=> Element or null
```

This is especially useful for delegating events.

```js
document.addEventListener('click', function (event) {
  // find nearest element up the tree that is an <a>
  var link = event.target.closest('a');

  if (link) {
    // do something with the <a>
    event.preventDefault();
  }
});
```

The script is approximately 428 bytes, or 257 bytes when gzipped.

## Usage

For immediate usage, add this script to your document:

```html
<script src="https://unpkg.com/element-closest"></script>
```

For usage in Node, including Browserify and Webpack, run [closest] with your `window` object:

```js
const elementClosest = require('element-closest');

elementClosest(window); // this is used to reference window.Element
```

## Browser compatibility

| Browser           | Native Support | Polyfill Support |
| ----------------- | -------------- | ---------------- |
| Android           | 53             | 2.2+             |
| Blackberry        | ✘              | 7+               |
| Chrome            | 41+            | 4 - 40           |
| Edge              | 15             | 12 - 14          |
| Firefox           | 35+            | 3.5 - 34         |
| Internet Explorer | ✘              | 8+               |
| Opera             | 28+            | 10 - 27          |
| Opera Mobile      | 37+            | 12+              |
| Safari (iOS)      | 9.2+           | 3.2 - 8.4        |
| Safari (MacOS)    | 9.1+           | 3.1 - 8          |

### Internet Explorer 8

`closest` is especially useful for delegating events, but remember that Internet Explorer 8 does not support [`#Element.addEventListener`].

## matches

This library also polyfills [`#Element.matches`], which is widely supported but often vendor-prefixed.

```js
element.matches(selectorString) //=> boolean
```

`matches` is especially useful for short-handing `hasAttribute` or `classList.contains` with selectors.

```js
const widget = document.querySelector('.custom-widget');

if (widget.matches('[data-active]') || widget.matches('.widget--active')) {
  // do something with the active widget
}
```

[`#Element.closest`]: https://dom.spec.whatwg.org/#dom-element-closest
[`#Element.matches`]: https://dom.spec.whatwg.org/#dom-element-matches
[`#Element.addEventListener`]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener#Browser_compatibility
[closest]: https://github.com/jonathantneal/closest
