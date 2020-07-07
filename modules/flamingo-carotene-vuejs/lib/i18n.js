import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'default', // we mostly use component based localization (see http://kazupon.github.io/vue-i18n/guide/component.html)
})
