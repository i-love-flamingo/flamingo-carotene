# Module `flamingo-carotene-vuejs`

This module provides a wrapper to add VueJS dependencies to a Carotene project.

## How to install

```bash
npm i -D flamingo-carotene-vue-i18n
```
 
## Internationalization
The module also provides internationalization for VueJS. By passing a path to translated yaml files, it will build language based JS Object containing appropriate keys and values for translations.  
```config.paths.vueI18n``` is the source from which the module should find the translations.
```config.paths.generated``` is the location where the Vue translations should be built to.
The script will create a json file containing all the translations by languages. To be able to use this file the following script is needed in your project:
```javascript
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'generated/i18n/messages.json'

Vue.use(VueI18n)

export default new VueI18n({
  locale: your_locale,
  fallbackLocale: your_fallback,
  messages,
})
```

## To build Vue internationalisation
The build script always runs on carotene build. Another listener is open to run it, for this type `npx flamingo-carotene translate`.
