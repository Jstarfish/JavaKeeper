<template>
  <div
    class="comments-wrapper"
    v-show="isShowComments">
    <ClientOnly>
      <component
        :is="componentName"
        :options="options" />
    </ClientOnly>
  </div>
</template>

<script>
import Valine from './Valine.vue'
import Vssue from './Vssue.vue'
export default {
  components: { Valine, Vssue },
  props: {
    isShowComments: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // eslint-disable-next-line no-undef
      commentsOptions: COMMENTS_OPTIONS
    }
  },
  computed: {
    solution () {
      const {
        commentsOptions: { solution: slt },
        $themeConfig: { valineConfig, vssueConfig },
        $themeLocaleConfig: { valineConfig: valineLocalConfig, vssueConfig: vssueLocalConfig }
      } = this

      let solution = ''
      if (slt !== undefined) {
        solution = slt
      } else if (valineLocalConfig !== undefined || valineConfig !== undefined) {
        solution = 'valine'
      } else if (vssueLocalConfig !== undefined || vssueConfig !== undefined) {
        solution = 'vssue'
      }
      return solution
    },
    options () {
      const {
        commentsOptions: { options: opt },
        $themeConfig: { valineConfig, vssueConfig },
        $themeLocaleConfig: { valineConfig: valineLocalConfig, vssueConfig: vssueLocalConfig }
      } = this

      if (opt !== undefined) {
        return opt
      } else if (valineLocalConfig !== undefined || valineConfig !== undefined) {
        return valineLocalConfig || valineConfig
      } else if (vssueLocalConfig !== undefined || vssueConfig !== undefined) {
        return vssueLocalConfig || vssueConfig
      }
      return null
    },
    componentName () {
      const solution = this.solution
      return solution === 'valine' ? 'Valine' : solution === 'vssue' ? 'Vssue' : ''
    }
  },
  mounted () {
    this.$themeConfig.commentsSolution = this.solution
  }
}
</script>
