<template>
  <transition name="fade">
    <div v-show="visible" :style="customStyle" class="back-to-ceiling" @click="backToTop">
      <svg t="1574745035067" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5404"><path d="M526.60727968 10.90185116a27.675 27.675 0 0 0-29.21455937 0c-131.36607665 82.28402758-218.69155461 228.01873535-218.69155402 394.07834331a462.20625001 462.20625001 0 0 0 5.36959153 69.94390903c1.00431239 6.55289093-0.34802892 13.13561351-3.76865779 18.80351572-32.63518765 54.11355614-51.75690182 118.55860487-51.7569018 187.94566865a371.06718723 371.06718723 0 0 0 11.50484808 91.98906777c6.53300375 25.50556257 41.68394495 28.14064038 52.69160883 4.22606766 17.37162448-37.73630017 42.14135425-72.50938081 72.80769204-103.21549295 2.18761121 3.04276886 4.15646224 6.24463696 6.40373557 9.22774369a1871.4375 1871.4375 0 0 0 140.04691725 5.34970492 1866.36093723 1866.36093723 0 0 0 140.04691723-5.34970492c2.24727335-2.98310674 4.21612437-6.18497483 6.3937923-9.2178004 30.66633723 30.70611158 55.4360664 65.4791928 72.80769147 103.21549355 11.00766384 23.91457269 46.15860503 21.27949489 52.69160879-4.22606768a371.15156223 371.15156223 0 0 0 11.514792-91.99901164c0-69.36717486-19.13165746-133.82216804-51.75690182-187.92578088-3.42062944-5.66790279-4.76302748-12.26056868-3.76865837-18.80351632a462.20625001 462.20625001 0 0 0 5.36959269-69.943909c-0.00994388-166.08943902-87.32547796-311.81420293-218.6915546-394.09823051zM605.93803103 357.87693858a93.93749974 93.93749974 0 1 1-187.89594924 6.1e-7 93.93749974 93.93749974 0 0 1 187.89594924-6.1e-7z" p-id="5405"></path><path d="M429.50777625 765.63860547C429.50777625 803.39355007 466.44236686 1000.39046097 512.00932183 1000.39046097c45.56695499 0 82.4922232-197.00623328 82.5015456-234.7518555 0-37.75494459-36.9345906-68.35043303-82.4922232-68.34111062-45.57627738-0.00932239-82.52019037 30.59548842-82.51086798 68.34111062z" p-id="5406"></path></svg>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BackToTop',
  data () {
    return {
      visible: false,
      /* eslint-disable no-undef */
      customStyle: CUSTOM_STYLE,
      visibilityHeight: VISIBILITY_HEIGHT
    }
  },
  mounted () {
    window.addEventListener('scroll', this.throttle(this.handleScroll, 500))
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.throttle(this.handleScroll, 500))
  },
  methods: {
    handleScroll () {
      this.visible = window.pageYOffset > this.visibilityHeight
    },
    backToTop () {
      window.scrollTo(0, 0)
    },
    throttle (func, delay) {
      let timer = null
      let startTime = Date.now()

      return function () {
        const curTime = Date.now()
        const remaining = delay - (curTime - startTime)
        const context = this
        const args = arguments

        clearTimeout(timer)
        if (remaining <= 0) {
          func.apply(context, args)
          startTime = Date.now()
        } else {
          timer = setTimeout(func, remaining)
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.back-to-ceiling
  background-color: #fff
  background-color: var(--background-color)
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2)
  box-shadow: var(--box-shadow)
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  &::hover
    background: #d5dbe7;
  .icon
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    margin auto
    width 26px
    height 26px
    fill $accentColor
.fade-enter-active,
.fade-leave-active {
  transition: all .5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0
  transform translateY(120px)
}
</style>
