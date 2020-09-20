export default ({ Vue }) => {
  Vue.mixin({
    computed: {
      set $mode (val) {
        return 'dark'
      }
    }
  })
}
