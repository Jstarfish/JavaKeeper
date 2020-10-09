# vue-disqus
> Vue component to integrate Disqus comments in your application [Vue.js](http://vuejs.org/), with support for SPA and Vue 2.*


## Installation

##### Install package via NPM

```shell
$ npm install vue-disqus
```

#### Include via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/vue-disqus@3/dist/vue-disqus.js"></script>
```

#### Install in your vue app
```javascript
import Vue from 'vue'
import VueDisqus from 'vue-disqus'

Vue.use(VueDisqus)
...
```

Using in Vue file components
```vue
<template>
  <div class="comments">
    <vue-disqus shortname="your_shortname_disqus" :identifier="page_id" url="http://example.com/path"></vue-disqus>
  </div>
</template>
// ...
```

---

#### Install in Nuxt
Create plugin file `plugins/disqus.js`

```javascript
import Vue from 'vue'
import VueDisqus from 'vue-disqus'

Vue.use(VueDisqus)

```

In config file `nuxt.config.js`
```javascript
...
plugins: [
  '~/plugins/disqus'
]

```

Using in Vue file components
```vue
<template>
  <div class="comments">
    <vue-disqus shortname="your_shortname_disqus" :identifier="page_id" url="http://example.com/path"></vue-disqus>
  </div>
</template>
// ...
```

---

## Using with HTML files
##### Add the component to the base instance Vue

```html
<!-- Required Javascript -->
<script src="https://vuejs-cdn-link"></script>
<script src="https://unpkg.com/vue-disqus"></script>
```

```html
<!-- Assuming your view app is APP. -->
<div id="app">
  <div class="comments">
    <vue-disqus shortname="your_shortname_disqus"></vue-disqus>
  </div>
</div>
```

## Props

Prop            | Data Type  | required  | Description
--------------- | ---------- | --------- | -----------
`shortname`     | String     | true      | Your shortname disqus.
`title`         | String     | false     | Title to identify current page.
`identifier`    | String     | false     | Your unique identifier
`sso_config`    | Object     | false     | Single sign-on (SSO)
`api_key`       | String     | false     | Your API key disqus
`remote_auth_s3`| String     | false     | implementation with Laravel/PHP
`language`      | String     | false     | Language overrides


## Important
Don't use hash (`myurl.com/#/`) in urls, if you are using the vue-router always opt for HTML5 `history: mode`.


## Events

Event name    | Description
------------- | -----------
`ready`       | When Disqus is ready. This can be used to show a placeholder or loading indicator.
`new-comment` | When a new comment is posted. This can be used to update comment counters in real time.


See [Event Handling](https://vuejs.org/v2/guide/events.html).

## License

[MIT](https://github.com/ktquez/vue-disqus/blob/master/LICENSE)

## Contributing
- Check the open issues or open a new issue to start a discussion around your feature idea or the bug you found.
- Fork repository, make changes, add your name and link in the authors session CONTRIBUTING.md
- Send a pull request

If you want a faster communication, find me on [@ktquez](https://twitter.com/ktquez)

**Thank you**
