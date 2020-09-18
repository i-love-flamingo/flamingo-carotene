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
