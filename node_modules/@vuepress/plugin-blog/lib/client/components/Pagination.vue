<template>
  <component
    :is="comp"
    v-if="comp"
    :value="page"
    :page-count="$pagination.length"
    :click-handler="clickCallback"
    :prev-text="$pagination.prevText"
    :next-text="$pagination.nextText"
    :container-class="'pagination'"
    :page-class="'page-item'"
  >
  </component>
</template>

<script>
export default {
  data() {
    return {
      comp: null,
    };
  },

  computed: {
    page() {
      return this.$pagination.paginationIndex + 1;
    },
  },

  mounted() {
    import(/* webpackChunkName: "vuejs-paginate" */ 'vuejs-paginate').then(
      comp => {
        this.comp = comp.default;
      }
    );
  },

  methods: {
    clickCallback(pageNum) {
      const link = this.$pagination.getSpecificPageLink(pageNum - 1);
      this.$router.push(link);
    },
  },
};
</script>

<style lang="stylus">
.pagination
  display inline-block
  padding-left 0
  margin 20px 0
  border-radius 4px

.pagination > li
  display inline
  outline none

.pagination > li > a, .pagination > li > span
  transition color 0.2s, background-color 0.2s
  outline none
  position relative
  float left
  padding 6px 12px
  margin-left -1px
  line-height 1.42857143
  color $accentColor
  text-decoration none
  background-color #fff
  border 1px solid #ddd

.pagination > li:first-child > a, .pagination > li:first-child > span
  margin-left 0
  border-top-left-radius 4px
  border-bottom-left-radius 4px

.pagination > li:last-child > a, .pagination > li:last-child > span
  border-top-right-radius 4px
  border-bottom-right-radius 4px

.pagination > li > a:hover, .pagination > li > span:hover, .pagination > li > a:focus, .pagination > li > span:focus
  z-index 3
  color $accentColor
  background-color #eee
  border-color #ddd

.pagination > .active > a, .pagination > .active > span, .pagination > .active > a:hover, .pagination > .active > span:hover, .pagination > .active > a:focus, .pagination > .active > span:focus
  z-index 2
  color #fff
  cursor default
  background-color $accentColor
  border-color $accentColor

.pagination > .disabled > span, .pagination > .disabled > span:hover, .pagination > .disabled > span:focus, .pagination > .disabled > a, .pagination > .disabled > a:hover, .pagination > .disabled > a:focus
  color #ddd
  cursor not-allowed
  background-color #fff
  border-color #ddd

.pagination-lg > li > a, .pagination-lg > li > span
  padding 10px 16px
  font-size 18px
  line-height 1.3333333

.pagination-lg > li:first-child > a, .pagination-lg > li:first-child > span
  border-top-left-radius 6px
  border-bottom-left-radius 6px

.pagination-lg > li:last-child > a, .pagination-lg > li:last-child > span
  border-top-right-radius 6px
  border-bottom-right-radius 6px

.pagination-sm > li > a, .pagination-sm > li > span
  padding 5px 10px
  font-size 12px
  line-height 1.5

.pagination-sm > li:first-child > a, .pagination-sm > li:first-child > span
  border-top-left-radius 3px
  border-bottom-left-radius 3px

.pagination-sm > li:last-child > a, .pagination-sm > li:last-child > span
  border-top-right-radius 3px
  border-bottom-right-radius 3px
</style>
