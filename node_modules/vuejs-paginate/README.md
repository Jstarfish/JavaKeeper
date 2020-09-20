# vuejs-paginate
[![npm version](https://badge.fury.io/js/vuejs-paginate.svg)](https://badge.fury.io/js/vuejs-paginate) [![Build Status](https://travis-ci.org/lokyoung/vuejs-paginate.svg?branch=master)](https://travis-ci.org/lokyoung/vuejs-paginate) [![Code Climate](https://codeclimate.com/github/lokyoung/vuejs-paginate/badges/gpa.svg)](https://codeclimate.com/github/lokyoung/vuejs-paginate)

[![NPM](https://nodei.co/npm/vuejs-paginate.png)](https://nodei.co/npm/vuejs-paginate/)

A Vue.js(v2.x+) component to make pagination. Inspired by [react-paginate](https://github.com/AdeleD/react-paginate).

Easy to use by providing simple api. And you can customize the style of this component by css.

<img src="https://raw.githubusercontent.com/lokyoung/vuejs-paginate/master/img/pagination-show.gif" width="550" />

[Online demo](https://jsfiddle.net/lokyoung/u3u3nzns/)

## Installation

### NPM

Install the npm package.
```js
$ npm install vuejs-paginate --save
```

Register the component.
- ES5
```js
var Paginate = require('vuejs-paginate')
Vue.component('paginate', Paginate)
```

- ES6
```js
import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)
```

*Note*: For version <= 0.5.0, use `Vue.use(Paginate)` to register the component after import the package. But recommend to use the latest version now.

### CDN

Include the source file.
```html
<!-- use the latest release -->
<script src="https://unpkg.com/vuejs-paginate@latest"></script>
<!-- or use the specify version -->
<script src="https://unpkg.com/vuejs-paginate@0.9.0"></script>
```

Register the component.
```js
Vue.component('paginate', VuejsPaginate)
```

## Usage

### In Vue Template

**Basic Usage**
```html
<paginate
  :page-count="20"
  :click-handler="functionName"
  :prev-text="'Prev'"
  :next-text="'Next'"
  :container-class="'className'">
</paginate>
```

*Note*: In vue template, camelCase and kebab-case are both supported. For example, you can either use prop `page-count` or `pageCount`. They are leading to the same result.

So this is also avaliable
```html
<paginate
  :pageCount="20"
  :clickHandler="functionName"
  :prevText="'Prev'"
  :nextText="'Next'"
  :containerClass="'className'">
</paginate>
```

**Example**
```html
<template>
  <paginate
    :page-count="20"
    :page-range="3"
    :margin-pages="2"
    :click-handler="clickCallback"
    :prev-text="'Prev'"
    :next-text="'Next'"
    :container-class="'pagination'"
    :page-class="'page-item'">
  </paginate>
</template>

<script>
export default {
  methods: {
    clickCallback (pageNum) => {
      console.log(pageNum)
    }
  }
}
</script>

<style lang="css">
.pagination {
}
.page-item {
}
</style>
```

### Value Binding
Use `v-model` to set the selected page number. You can programmatically modify the current page by using this.

```html
<template>
  <paginate
    v-model="page"
    :page-count="20"
    :page-range="3"
    :margin-pages="2"
    :click-handler="clickCallback"
    :prev-text="'Prev'"
    :next-text="'Next'"
    :container-class="'pagination'"
    :page-class="'page-item'">
  </paginate>
</template>

<script>
export default {
  data() {
    return {
      page: 10
    }
  }
}
</script>
```

### In HTML
Must use kebab-case for props in pure HTML.

**Example**

JavaScript
```js
Vue.component('paginate', VuejsPaginate)

new Vue({
  el: '#app',
  methods: {
    clickCallback: function(pageNum) {
      console.log(pageNum)
    }
  }
})
```

HTML
```html
<div id="app">
  <paginate
    :page-count="10"
    :container-class="pagination"
    :prev-text="prev"
    :next-text="next"
    :click-handler="clickCallback">
  </paginate>
</div>
```

## Props

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type | Description |
| ----------------- | :--- | :--- |
| `page-count`      | `Number` | Total count of pages. **required** |
| `page-range`      | `Number` | Range of pages which displayed. **default: 3** <br> *(Note: It is recommended to use an odd number, so that the same number of pages are displayed before and after the active page. If using an even number, there will be one more page number before the active page than after the current page)* |
| `margin-pages`    | `Number` | The number of displayed pages for margins. **default: 1** |
| `prev-text`       | `String` | Text for the previous button. You can use HTML here. **default: Prev**  |
| `next-text`       | `String` | Text for the next button. You can use HTML here. **default: Next**  |
| `break-view-text` | `String` | Text for the break view indicator. **default: ...**  |
| `initial-page` <br> **Deprecated after v2.0.0** | `Number` | The index of initial page which selected. **default: 0** |
| `force-page`      | `Number` | The page number of overridden selected page. |
| `click-handler`   | `Function` | The method to call when page clicked. Use clicked page number as parameter. |
| `container-class` | `String` | CSS class name for the layout. |
| `page-class`      | `String` | CSS class name for tag `li` of each page element. |
| `page-link-class` | `String` | CSS class name for tag `a` of each page element. |
| `prev-class`      | `String` | CSS class name for tag `li` of `previous` element. |
| `prev-link-class` | `String` | CSS class name for tag `a` of `previous` element. |
| `next-class`      | `String` | CSS class name for tag `li` of `next` element. |
| `next-link-class` | `String` | CSS class name for tag `a` of `next` element. |
| `break-view-class` | `String` | CSS class name for tag `li` of `break view` element. |
| `break-view-link-class` | `String` | CSS class name for tag `a` of `break view` element. |
| `active-class` | `String` | CSS class name for active page element. **default: active** |
| `disabled-class` | `String` | CSS class name for disabled page element. **default: disabled** |
| `no-li-surround` | `Boolean` | Support no `li` tag surround `a` tag. **default: false** |
| `first-last-button` | `Boolean` | Support buttons to turn to the first and last page. **default: false** |
| `first-button-text` | `String` | Text for first button. (Not visible when `first-last-button` is false. You can use HTML here.) **default: 'First'** |
| `last-button-text` | `String` | Text for last button. (Not visible when `first-last-button` is false. You can use HTML here.) **default: 'Last'** |
| `hide-prev-next` | `Boolean` | Hide prev/next button when there is no previous or next page. **default: false** |

## Customize inner HTML (experimental)
You can customize the inner HTML of the previous button, next button, and break view indicator, with the `slot` tag.

**Slot names**

| Name | Description |
| --- | --- |
| `prevContent` | Previous button |
| `nextContent` | Next button |
| `breakViewContent` | Break view indicator |

**Note**
Slot of `prevContent` and `nextContent` are not supported after `v1.9.5`. You can directly set the HTML by `prev-text` and `next-text` props.
 
**Example**
```html
<paginate
  :page-count="10"
  :container-class="pagination"
  :prev-text="prev"
  :next-text="next"
  :click-handler="clickCallback">

  <span slot="prevContent">Changed previous button</span>
  <span slot="nextContent">Changed next button</span>
  <span slot="breakViewContent">
    <svg width="16" height="4" viewBox="0 0 16 4">
      <circle fill="#999999" cx="2" cy="2" r="2" />
      <circle fill="#999999" cx="8" cy="2" r="2" />
      <circle fill="#999999" cx="14" cy="2" r="2" />
    </svg>
  </span>

</paginate>
```


## Demo
You can see the demo for quickly understand how to use this package.

```sh
$ git clone git@github.com:lokyoung/vuejs-paginate.git
$ cd vuejs-paginate
$ npm install
$ npm run demo
```

Check the code from `./demo/index.html` and `./demo/App.vue`.
