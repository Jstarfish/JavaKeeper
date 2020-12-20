<template>
  <div class="tags">
    <span
      v-for="(item, index) in tags"
      :key="index"
      :class="{'active': item.name == currentTag}"
      :style="{ 'backgroundColor': getOneColor() }"
      @click="tagClick(item)">{{item.name}}</span>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import { getOneColor } from '@theme/helpers/other'

export default defineComponent({
  props: {
    currentTag: {
      type: String,
      default: ''
    }
  },
  setup (props, ctx) {
    const { root: _this } = ctx
    const tags = computed(() => {
      return [{ name: _this.$recoLocales.tag.all, path: '/tag/' }, ..._this.$tags.list]
    })
    const tagClick = tag => {
      ctx.emit('getCurrentTag', tag)
    }

    return { tags, tagClick, getOneColor }
  }
})
</script>

<style lang="stylus" scoped>
.tags
  margin 30px 0
  span
    vertical-align: middle;
    margin: 4px 4px 10px;
    padding: 4px 8px;
    display: inline-block;
    cursor: pointer;
    border-radius: $borderRadius
    background: #fff;
    color: #fff;
    line-height 13px
    font-size: 13px;
    box-shadow var(--box-shadow)
    transition: all .5s
    &:hover
      transform scale(1.04)
    &.active
      transform scale(1.2)
</style>
