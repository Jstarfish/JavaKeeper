import { zhHans, zhHant, en, ja, ko } from '../locales/index'

export default {
  computed: {
    $recoLocales () {
      const recoLocales = this.$themeLocaleConfig.recoLocales || {}

      if (/^zh\-(CN|SG)$/.test(this.$lang)) {
        return { ...zhHans, ...recoLocales }
      }
      if (/^zh\-(HK|MO|TW)$/.test(this.$lang)) {
        return { ...zhHant, ...recoLocales }
      }
      if (/^ja\-JP$/.test(this.$lang)) {
        return { ...ja, ...recoLocales }
      }
      if (/^ko\-KR$/.test(this.$lang)) {
        return { ...ko, ...recoLocales }
      }
      return { ...en, ...recoLocales }
    }
  }
}
