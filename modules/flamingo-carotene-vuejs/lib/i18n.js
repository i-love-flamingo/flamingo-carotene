import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'generated/i18n/messages.json'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en-gb', // we mostly use component based localization (see http://kazupon.github.io/vue-i18n/guide/component.html)
  fallbackLocale: 'en-gb',
  messages,
})
