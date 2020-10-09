Balalaika.js
=========

[![Join the chat at https://gitter.im/finom/balalaika](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/finom/balalaika?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
## The tiny DOM library (986 bytes uncompressed and 603 bytes gzipped!)

Balalaika provides you tiny replacement for huge DOM libraries such as jQuery and Zepto. It contains few methods which should be sufficient for vanilla.js developers.

Too big? [Check this out](https://github.com/finom/bala).

### How can I use it?
First of all you can use it as common library on the web page. Just paste this code to the ``head`` tag:
```html
<script>
$=function(t,e,n,i,o,r,s,u,c,f,l,h){return h=function(t,e){return new h.i(t,e)},h.i=function(i,o){n.push.apply(this,i?i.nodeType||i==t?[i]:""+i===i?/</.test(i)?((u=e.createElement(o||"q")).innerHTML=i,u.children):(o&&h(o)[0]||e).querySelectorAll(i):/f/.test(typeof i)?/c/.test(e.readyState)?i():h(e).on("DOMContentLoaded",i):i:n)},h.i[l="prototype"]=(h.extend=function(t){for(f=arguments,u=1;u<f.length;u++)if(l=f[u])for(c in l)t[c]=l[c];return t})(h.fn=h[l]=n,{on:function(t,e){return t=t.split(i),this.map(function(n){(i[u=t[0]+(n.b$=n.b$||++o)]=i[u]||[]).push([e,t[1]]),n["add"+r](t[0],e)}),this},off:function(t,e){return t=t.split(i),l="remove"+r,this.map(function(n){if(f=i[t[0]+n.b$],u=f&&f.length)for(;c=f[--u];)e&&e!=c[0]||t[1]&&t[1]!=c[1]||(n[l](t[0],c[0]),f.splice(u,1));else!t[1]&&n[l](t[0],e)}),this},is:function(t){return u=this[0],(u.matches||u["webkit"+s]||u["moz"+s]||u["ms"+s]).call(u,t)}}),h}(window,document,[],/\.(.+)/,0,"EventListener","MatchesSelector");
</script>
```
(Looks like Google Analytics embed)

Then use it anywhere on the web page:
```html
<script>
	$(function() {
		$('.my-selector').on('click', function() {
			alert('I need my balalaika');
		});
	});
</script>
```

The second kind of use is using it inside single script as local variable:
```js
(function(win, $) {
	// your code starts here
	$(function() {
		$('.my-selector').on('click', function() {
			alert('I need my balalaika');
		});
	});
  // your code ends here
})(window, function(t,e,n,i,o,r,s,u,c,f,l,h){return h=function(t,e){return new h.i(t,e)},h.i=function(i,o){n.push.apply(this,i?i.nodeType||i==t?[i]:""+i===i?/</.test(i)?((u=e.createElement(o||"q")).innerHTML=i,u.children):(o&&h(o)[0]||e).querySelectorAll(i):/f/.test(typeof i)?/c/.test(e.readyState)?i():h(e).on("DOMContentLoaded",i):i:n)},h.i[l="prototype"]=(h.extend=function(t){for(f=arguments,u=1;u<f.length;u++)if(l=f[u])for(c in l)t[c]=l[c];return t})(h.fn=h[l]=n,{on:function(t,e){return t=t.split(i),this.map(function(n){(i[u=t[0]+(n.b$=n.b$||++o)]=i[u]||[]).push([e,t[1]]),n["add"+r](t[0],e)}),this},off:function(t,e){return t=t.split(i),l="remove"+r,this.map(function(n){if(f=i[t[0]+n.b$],u=f&&f.length)for(;c=f[--u];)e&&e!=c[0]||t[1]&&t[1]!=c[1]||(n[l](t[0],c[0]),f.splice(u,1));else!t[1]&&n[l](t[0],e)}),this},is:function(t){return u=this[0],(u.matches||u["webkit"+s]||u["moz"+s]||u["ms"+s]).call(u,t)}}),h}(window,document,[],/\.(.+)/,0,"EventListener","MatchesSelector"));
```

### Which methods are provided?
Balalaika extends ``Array.prototype``. It means Balalaika can use any method of native array.
```js
$('.my-selector').forEach(function(el) {
	console.log(el);
});
```

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
		</ul>

Besides, Balalaika has few additional methods such as:
#### ``on``
```js
$('.my-selector').on('click.namespace', function() {
	alert('I need my balalaika');
});
```
#### ``off``
```js
$('.my-selector').off('click.namespace');
```
#### ``is``
```js
$('.my-selector').on('click', function(evt) {
	if($(evt.target).is('.another-selector')) {
		alert('I need my balalaika');
	}
});
```
#### ``extend``
```js
var myObject = {a:1};
$.extend(myObject,{
	b: 2
});
```
#### DOM-ready feature
```js
$(function() {
	// Do something with DOM
});
```

### It provides very few functions, doesn't it?
Yep. The idea is if you need something, implement it! A lot of jQuery-like functions can be created easily. Use $.fn style to create additional methods:
```js
$.fn.hasClass = function( className ) {
	return !!this[ 0 ] && this[ 0 ].classList.contains( className );
};
```
```js
$.fn.addClass = function( className ) {
	this.forEach( function( item ) {
		var classList = item.classList;
		classList.add.apply( classList, className.split( /\s/ ) );
	});
	return this;
};
```
```js
$.fn.removeClass = function( className ) {
	this.forEach( function( item ) {
		var classList = item.classList;
		classList.remove.apply( classList, className.split( /\s/ ) );
	});
	return this;
};
```
```js
$.fn.toggleClass = function( className, b ) {
	this.forEach( function( item ) {
		var classList = item.classList;
		if( typeof b !== 'boolean' ) {
			b = !classList.contains( className );
		}
		classList[ b ? 'add' : 'remove' ].apply( classList, className.split( /\s/ ) );
	});
	return this;
};
```
And so on...

### More examples
#### Find elements inside another element
```js
var elements = $('.my-selector', el);
```

#### Parse HTML
```js
var elements = $('<div><span class="yeah"></span></div>');
```

#### Extended parsing function
Pay attention that example above doesn't parse contextual elements such as ``td``, ``tr``, etc. But function below does:
```js
$.parseHTML = function( html ) {
	var node = document.createElement( 'div' ),
		// wrapMap is taken from jQuery
		wrapMap = {
				option: [ 1, "<select multiple='multiple'>", "</select>" ],
				legend: [ 1, "<fieldset>", "</fieldset>" ],
				thead: [ 1, "<table>", "</table>" ],
				tr: [ 2, "<table><tbody>", "</tbody></table>" ],
				td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
				col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
				area: [ 1, "<map>", "</map>" ],
				_: [ 0, "", "" ]
		},
		wrapper,
		i;
		
	html = html.replace( /^\s+|\s+$/g, '' );
	
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	wrapper = wrapMap[ /<([\w:]+)/.exec( html )[ 1 ] ] || wrapMap._;
	
	node.innerHTML = wrapper[ 1 ] + html + wrapper[ 2 ];
	
	i = wrapper[ 0 ];
	
	while( i-- ) {
		node = node.children[ 0 ];
	}
	
	return $( node.children );
};

var myElements = $.parseHTML('<tr><td></td></tr>');
```

#### Adding styles for elements
```js
$('.my-selector').forEach(function(el) {
	$.extend( el.style, {
		width: '30px',
		backgroundColor: 'red'
	});
});
```
#### Delegated events
```js
$('.my-selector').on('click', function(evt) {
	var node = evt.target;
	while(node !== this) {
		if($(node).is('.delegated-selector')) {
			// Handle it!
			break;
		}
		node = node.parentNode;
	}
});
```
#### ``$.fn.parents`` plugin
```js
$.fn.parents = function(selector) {
	var collection = $();
	this.forEach(function(node) {
		var parent;
		while((node = node.parentNode) && (node !== document)) {
			if(selector) {
				if($(node).is(selector)) {
					parent = node;
				}
			} else {
				parent = node;
			}
			if(parent && !~collection.indexOf(parent)) {
				collection.push(parent);
			}
		}
	});
	
	return collection;
};
```
**Licensed under MIT License**
