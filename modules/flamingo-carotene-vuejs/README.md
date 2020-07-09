# Module `flamingo-carotene-vuejs`

This module provides a wrapper to add VueJS dependencies to a Carotene project.

## How to install

```bash
npm i -D flamingo-carotene-vuejs
```

## How it works

The module wraps a WebPack configurations and VueJs modules to help set up a Carotene project including Vue.

Files with the extension ".vue" will be added to the WebPack watcher, and a new rule has been added to load them using [vue-loader](https://www.npmjs.com/package/vue-loader). The loader has also been added as a WebPack plugin. For more details about the vue-loader configuration see the [official documentation](https://vue-loader.vuejs.org/guide/)

Additionally, to allow for the use of Pug templating in VueJs components, another rule has been added for ".pug" files using the [pug-plain-loader](https://www.npmjs.com/package/pug-plain-loader).
 
### Internationalization
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
