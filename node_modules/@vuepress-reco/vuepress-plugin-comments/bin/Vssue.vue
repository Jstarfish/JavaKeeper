<template>
  <VssueComponent
    class="vssue-wrapper"
    :key="key"
    :options="vssueOptions"
  />
</template>

<script>
import { VssueComponent } from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import GithubV4 from '@vssue/api-github-v4'
import GitlabV3 from '@vssue/api-gitlab-v4'
import BitbucketV2 from '@vssue/api-bitbucket-v2'
import GiteeV5 from '@vssue/api-gitee-v5'
import 'vssue/dist/vssue.css'

export default {
  name: 'Vssue',
  components: { VssueComponent },
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      key: 'key',
      platformOptions: {
        'github': GithubV3,
        'github-v4': GithubV4,
        'gitlab': GitlabV3,
        'bitbucket': BitbucketV2,
        'gitee': GiteeV5
      }
    }
  },
  computed: {
    vssueOptions () {
      const { platformOptions, options } = this
      const platform = platformOptions[options.platform]
      return { ...options, api: platform }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path !== from.path) {
        // 切换页面时刷新评论
        setTimeout(() => {
          this.key = `reco-${new Date().getTime()}`
        }, 300)
      }
    }
  }
}
</script>

<style lang="stylus">
$vssue-theme-color ?= $accentColor
$vssue-text-color ?= $textColor
$vssue-border-color ?= $borderColor
$vssue-breakpoint-mobile ?= $MQMobile

@import '~vssue/src/styles/index'
@import '~github-markdown-css/github-markdown.css'

.vssue-wrapper.vssue
  color: #2c3e50
  color: var(--text-color)
  .vssue-new-comment
    border-bottom: 1px solid #eaecef;
    border-bottom: 1px solid var(--border-color);
    .vssue-new-comment-input:disabled
      background-color: #fff;
      background-color: var(--background-color);
      border: 1px solid #eaecef;
      border: 1px solid var(--border-color);
    .vssue-new-comment-footer .vssue-current-user
      color: #2c3e50
      color: var(--text-color)
  .vssue-header
    border-bottom: 1px solid #eaecef;
    border-bottom: 1px solid var(--border-color);
  .vssue-comments
    .vssue-pagination
      .vssue-pagination-per-page
        .vssue-pagination-select
          color var(--text-color)
    .vssue-comment
      .vssue-comment-body
        .vssue-comment-header, .vssue-comment-main, .vssue-comment-footer
          border none
        .vssue-comment-main, .vssue-comment-footer
          background var(--code-color)
        .vssue-comment-footer
          border-top 2px solid var(--background-color)
      .vssue-comment-avatar img
        width 2.8rem
        height 2.8rem
        border-radius $borderRadius
  .markdown-body
    color var(--text-color)
</style>
