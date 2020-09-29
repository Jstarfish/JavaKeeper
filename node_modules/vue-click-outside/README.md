# ClickOutside

Vue click outside directive.

## Installation

```
$ npm install vue-click-outside
```

## Example

```vue
<template>
  <div>
    <div v-click-outside="hide" @click="toggle">Toggle</div>
    <div v-show="opened">Popup item</div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  data () {
    return {
      opened: false
    }
  },

  methods: {
    toggle () {
      this.opened = true
    },

    hide () {
      this.opened = false
    }
  },

  mounted () {
    // prevent click outside event with popupItem.
    this.popupItem = this.$el
  },

  // do not forget this section
  directives: {
    ClickOutside
  }
}
</script>
```

## Badges

![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-stable-green.svg)

---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)
