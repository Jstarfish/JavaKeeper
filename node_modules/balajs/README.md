bala.js [![npm version](https://badge.fury.io/js/balajs.svg)](https://badge.fury.io/js/balajs)
============

### A function for elements selection in 251 ASCII chars (less than ¼ KB)!

**bala.js** is a function that allows you to select elements on a web page and get rid of jQuery in most of cases. Think of it as of `document.querySelectorAll` on steroids.

```js
const buttons = $('.button');
```

You can use it as a global variable

```html
<script>
$=((a,b,c)=>(c=(d,e,f=Object.create(c.fn))=>(d&&f.push(...(d.dispatchEvent?[d]:""+d===d?/</.test(d)?((e=a.createElement(e)).innerHTML=d,e.children):e?(e=c(e)[0])?e[b](d):f:a[b](d):d)),f),c.fn=[],c.one=(a,b)=>c(a,b)[0],c))(document,"querySelectorAll");
</script>
```


*If you don't want to use ``$`` variable just rename it.*
```js
foo=...
// instead of
$=...
```

And you can use it as a local variable in a script you make

```js
((win, $) => {
    // your code starts here
    const divs = $('div');
    console.log(divs);
    // your code ends here
})(window, ((a,b,c)=>(c=(d,e,f=Object.create(c.fn))=>(d&&f.push(...(d.dispatchEvent?[d]:""+d===d?/</.test(d)?((e=a.createElement(e)).innerHTML=d,e.children):e?(e=c(e)[0])?e[b](d):f:a[b](d):d)),f),c.fn=[],c.one=(a,b)=>c(a,b)[0],c))(document,"querySelectorAll"));
```

The function is also published on NPM

```
npm install balajs
```


**bala.js** is inherited from ``Array.prototype`` which means it has the same set of methods as the native array has.

<ul>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat" target="_blank">concat</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join" target="_blank">join</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop" target="_blank">pop</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push" target="_blank">push</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse" target="_blank">reverse</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift" target="_blank">shift</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice" target="_blank">slice</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort" target="_blank">sort</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice" target="_blank">splice</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString"  target="_blank">toString</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift" target="_blank">unshift</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every" target="_blank">every</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter" target="_blank">filter</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach" target="_blank">forEach</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf">indexOf</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf" target="_blank">lastIndexOf</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" target="_blank">map</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some" target="_blank">some</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin" target="_blank">copyWithin</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries" target="_blank">entries</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill" target="_blank">fill</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find" target="_blank">find</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex" target="_blank">findIndex</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes" target="_blank">includes</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys" target="_blank">keys</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values" target="_blank">values</a></li>
	<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/%40%40iterator" target="_blank">[Symbol.iterator]</a></li>
</ul>

## More features?

### Various types support

**bala** accepts many kinds of first argument and converts everything into **bala** instance

```js
$('.one, #two')
$(document.querySelectorAll('.selector'));
$(document.body);
$(element.children);
$(jQuery('.selector'));
$([document.querySelector('.one'), document.querySelector('.two')])
```

That means when you make your own library (VanillaJS "plugin") you can use **bala** in case if you don't know which arg type will be passed by a programmer.

```js
const myCoolLibrary = (el) => {
  el = $(el);
  // ...
};
```

### $.one

Getting zero-indexed element in DOM libraries is annoying. **bala** has one little static method called ``$.one`` which selects only one element.

```js
$.one('.button');
//vs
$('.button')[0];
```

This function is also created to get rid of extra variables (usually DOM libraries make two vars: ``$$`` and ``$``). It means you can import **bala** nicely via module system.

**AMD**
```js
require(['path/to/bala/umd/bala.umd.js'], ($) => {
	// ...
});
```

**CommonJS**
```js
const $ = require('path/to/bala/bala.umd.js');
```

**CommonJS + NPM**
```js
const $ = require('balajs');
```

**ECMAScript 2015**
```js
import $ from 'balajs';
```

### Find elements inside another element
```js
const elements = $('.my-selector', someParent);
// or
const element = $.one('.my-selector', someParent);
```


### Parse HTML
Simple parsing.
```js
const div = $('<div><span class="yeah"></span></div>');
```

### Contextual HTML parsing
In case if you need to parse HTML which contains contextual elements (``td``, ``tr``, ``option``) you can pass a context tag name as a second argument.
```js
const cells = $('<td>foo</td><td>bar</td>', 'tr')
```


## Plugins

You can extend **bala** as easily as you do it with jQuery or Zepto. Use ``fn`` property to define your own plugin.

```js
$.fn.toggle = function (boolean) {
    for(let node of this) {
        node.hidden = boolean;
    }
};

$('.button').toggle(false); // hides all buttons
```

## I need more examples!

### Add style
```js
for(let element of $('.my-selector')) {
    element.style.color = 'red';
}
```

In case if you need to set style only for one element you can use ``$.one``.

```js
$.one('.my-selector').style.color = 'red';
```

### Events delegation
```js
for(let element of $('.my-selector')) {
    element.addEventListener('click', function ({ target }) {
        if (this.contains(target.closest('.delegated-selector'))) {
            alert('yep!');
        }
    });
}
```
Or
```js
$.one('.my-selector').addEventListener('click', function ({ target }) {
    if (this.contains(target.closest('.delegated-selector'))) {
        alert('yep!');
    }
});
```

### Elements removal
```js
for(let element of $('.my-selector')) {
    element.remove();
}
```
Or
```js
$.one('.my-selector').remove();
```

### Animations
Use [element.animate](https://developers.google.com/web/updates/2014/05/Web-Animations-element.animate-is-now-in-Chrome-36) for smooth GPU-accelerated animations. You may need [polyfill for Web Animations API](https://github.com/web-animations/web-animations-js).
```js
$.one('.my-selector').animate({
    opacity: [0.5, 1],
    transform: ['scale(0.5)', 'scale(1)'],
}, {
    direction: 'alternate',
    duration: 500,
    iterations: Infinity,
});
```

Do you still need jQuery?
