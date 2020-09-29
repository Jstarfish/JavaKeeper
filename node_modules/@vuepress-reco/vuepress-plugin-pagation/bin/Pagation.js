import pagationLocales from './locales'
import './pagation.styl'

export default {
  render (h) {
    return h('div', {
      class: { pagation: true },
      style: { display: this.show ? 'block' : 'none' }
    }, [
      h('div', {
        class: { 'pagation-list': true }
      }, [
        h('span', {
          class: { jump: true },
          style: { display: this.currentPage > 1 ? 'inline' : 'none' },
          on: { click: this.goPrev },
          attrs: { unselectable: 'on' },
          domProps: { innerHTML: this.pagationLocales.prev }
        }),
        h('span', {
          class: { efont: true },
          style: { display: this.efont ? 'inline-block' : 'none' },
          on: { click: this.jumpPage.bind(this, 1) },
          domProps: { innerHTML: 1 }
        }),
        h('span', {
          class: { efont: true },
          style: { display: this.efont ? 'inline-block' : 'none' },
          domProps: { innerHTML: '...' }
        }),
        ...this.indexs.map(num => {
          return h('span', {
            class: {
              jump: true,
              bgprimary: this.currentPage == num
            },
            on: { click: this.jumpPage.bind(this, num) },
            attrs: { key: num },
            domProps: { innerHTML: num }
          })
        }),
        h('span', {
          class: { ellipsis: true },
          style: { display: this.efont && this.currentPage < this.pages - 4 ? 'inline-block' : 'none' },
          domProps: { innerHTML: '...' }
        }),
        h('span', {
          class: { jump: true },
          style: { display: this.efont && this.currentPage < this.pages - 4 ? 'inline-block' : 'none' },
          domProps: { innerHTML: this.pages }
        }),
        h('span', {
          class: { jump: true },
          style: { display: this.currentPage < this.pages ? 'inline' : 'none' },
          domProps: { innerHTML: this.pagationLocales.next },
          on: { click: this.goNext }
        }),
        h('span', {
          class: { jumppoint: true },
          domProps: { innerHTML: this.pagationLocales.jump }
        }),
        h('span', {
          class: { jumpinp: true }
        }, [h('input', {
          attrs: { type: 'text' },
          domProps: { value: this.value },
          on: { input (event) { this.$emit(event.target.value) } }
        })]),
        h('span', {
          class: { jump: true, gobtn: true },
          on: { click: this.jumpPage.bind(this, this.changePage) },
          domProps: { innerHTML: this.pagationLocales.go }
        })
      ])
    ])
  },
  data () {
    return {
      changePage: '', // 跳转页
      /* eslint-disable no-undef */
      pageSize: PERPAGE
    }
  },
  props: {
    total: {
      type: Number,
      default: 10
    },
    perPage: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  computed: {
    pages () {
      const pageSize = this.pageSize || this.perPage
      return Math.ceil(this.total / pageSize)
    },
    show: function () {
      return this.pages && this.pages != 1
    },
    efont: function () {
      if (this.pages <= 7) return false
      return this.currentPage > 5
    },
    indexs: function () {
      var left = 1
      var right = this.pages
      var ar = []
      if (this.pages >= 7) {
        if (this.currentPage > 5 && this.currentPage < this.pages - 4) {
          left = Number(this.currentPage) - 3
          right = Number(this.currentPage) + 3
        } else {
          if (this.currentPage <= 5) {
            left = 1
            right = 7
          } else {
            right = this.pages

            left = this.pages - 6
          }
        }
      }
      while (left <= right) {
        ar.push(left)
        left++
      }
      return ar
    },
    pagationLocales () {
      return pagationLocales(this)
    }
  },
  methods: {
    goPrev () {
      let currentPage = this.currentPage
      if (this.currentPage > 1) {
        this.emit(--currentPage)
      }
    },
    goNext () {
      let currentPage = this.currentPage
      if (currentPage < this.pages) {
        this.emit(++currentPage)
      }
    },
    jumpPage: function (id) {
      const numId = parseInt(id)

      if (numId <= this.pages && numId > 0) {
        this.emit(numId)
        return
      }
      alert(`请输入大于0，并且小于${this.pages}的页码！`)
    },
    emit (id) {
      this.$emit('getCurrentPage', id)
    }
  }
}
