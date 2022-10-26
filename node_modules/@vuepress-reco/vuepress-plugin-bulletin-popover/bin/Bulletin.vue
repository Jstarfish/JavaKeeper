<template>
  <transition name="fade">
    <div v-if="visible" class="bulletin-wrapper" :style="{ width }">
      <h4 class="bulletin-title">
        <reco-icon icon="reco-tongzhi" />
        <span>{{ title || bulletinLocales.title }}</span>
        <i class="btn-close" @click="closeNote">
          <svg t="1573745677073" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4448" width="22" height="22"><path d="M512 34.133333a486.4 486.4 0 1 0 486.4 486.4A486.4 486.4 0 0 0 512 34.133333z m209.4848 632.8064l-55.6032 55.466667-151.517867-151.125333-151.517866 151.1168-55.6032-55.466667 151.517866-151.108267L307.242667 364.714667l55.6032-55.466667 151.517866 151.125333 151.517867-151.1168 55.6032 55.466667-151.517867 151.099733z m0 0" p-id="4449"></path></svg>
        </i>
      </h4>
      <div class="bulletin-content" v-html="bodyNodes"></div>
      <hr>
      <div class="bulletin-footer" v-html="footerNodes"></div>
    </div>
  </transition>
</template>

<script>
import { RecoIcon } from '@vuepress-reco/core/lib/components'
import bulletinLocales from './locales'

export default {
  components: { RecoIcon },
  name: 'Bulletin',
  data () {
    return {
      visible: false,
      /* eslint-disable no-undef */
      title: TITLE,
      width: WIDTH,
      body: BODY,
      footer: FOOTER
    }
  },
  computed: {
    bodyNodes () {
      return this.handleNode(this.body).join('')
    },
    footerNodes () {
      return this.handleNode(this.footer).join('')
    },
    bulletinLocales () {
      return bulletinLocales(this)
    }
  },
  mounted () {
    const closeNote = sessionStorage.getItem('closeNote')
    this.visible = closeNote !== 'true'
  },
  methods: {
    closeNote () {
      this.visible = false
      sessionStorage.setItem('closeNote', 'true')
    },
    handleNode (nodes) {
      if (!Array.isArray(nodes)) {
        let type = nodes.type
        type = type.slice(0, 1).toUpperCase() + type.slice(1)
        return this[`handle${type}`](nodes)
      } else {
        return nodes.map(node => this.handleNode(node))
      }
    },
    handleImage (node) {
      return `<img style=\"${node.style || ''}\" src=\"${node.src}\" />`
    },
    handleText (node) {
      return `<p style=\"${node.style || ''}\">${node.content}</p>`
    },
    handleTitle (node) {
      return `<h5 style=\"${node.style || ''}\">${node.content}</h5>`
    },
    handleButton (node) {
      return `<a style=\"${node.style || ''}\" class=\"btn\" href=\"${node.link}\">${node.text}</a>`
    }
  }
}
</script>

<style lang="stylus" scoped>
.bulletin-wrapper
  position fixed
  top 80px
  right 20px
  z-index 19
  box-sizing border-box
  background #fff
  border 1px solid $accentColor
  border-radius .25rem
  background var(--background-color)
  box-shadow var(--box-shadow)
  .bulletin-title
    position relative
    box-sizing border-box
    padding 10px
    margin 0
    background $accentColor
    color #fff
    i
      color #fff
    .btn-close
      position absolute
      display inline-block
      width 22px
      height 22px
      right 10px
      top 0
      bottom 0
      margin auto
      cursor pointer
      svg
        fill #fff
  .bulletin-content
    box-sizing border-box
    padding 10px 15px 0
    ::v-deep h5
      margin .2rem 0
      text-align center
    ::v-deep img
      width 100%
  .bulletin-footer
    padding 16px
    text-align center
    ::v-deep .btn
      display inline-block
      width 3.4rem
      line-height 3.4rem
      text-align center
      background-color $accentColor
      border-radius 50%
      color #fff
      font-size 1rem
      box-shadow var(--box-shadow)
      cursor pointer
      &:not(:first-child)
        margin-left 10px
    ::v-deep h5
      margin .2rem 0
      text-align center
    ::v-deep img
      width 100%
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
