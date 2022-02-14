# Module `flamingo-carotene-webpack`

This module abstracts [webpack](https://github.com/webpack/webpack) to have a quite good featured webpack config ready
to use with your project.

An initial webpack config will be provided by this module.

When triggered by a command, the module creates the webpack compiler and run the config that can be extended through
any other module and your own project config.

## How to use

```bash
npm i -D flamingo-carotene-webpack
```

Run the webpack compiler by e.g. executing `npx flamingo-carotene build`.

The webpack module will listen to the following commands: `build`, `buildWebpack`, `buildWebpackJs`, `buildWebpackCss`,
`watchWebpackJs`, `watchWebpackCss`.

This module will build the webpack config at the config commands priority 0 with the webpack config object available in
`config.webpack`. That means that the webpack config can be edited in two ways.

1. By a config command handler with a priority between 0 and 100, that overrides entries of the webpack modules
config. Every config made to `config.webpack` before priority 0 will be taken into account when creating the webpack
config.

2. By a config command handler with a priority lower than 0, that overrides entries of the webpack config. Every config
made to `config.webpackConfig` after priority 0 will be taken into account when running the webpack compiler by a
command.

Every webpack configuration that is supported by the used webpack version can be applied that way.

The entry point is the file `index.js` inside the `config.paths.webpack.src` folder.

## How to configure

This module exposes the following config
```js
config.paths.webpack = {
  src: config.paths.src,
  dist: config.paths.dist
}
```

`src` Path that this module uses as source path

`dist` Path that this module uses as dist path

```js
config.webpack = {
  dist: {
    jsFolderName: 'js',
    cssFolderName: 'css',
    fontFolderName: 'font',
    imageFolderName: 'image'
  },
  rulesInclude: null || [],
  buildCallback: null || function
}
```

`dist.jsFolderName` Additional path from the webpack dist to the js output files

`dist.cssFolderName` Additional path from the webpack dist to the css output files

`dist.fontFolderName` Additional path from the webpack dist to the font output files

`dist.imageFolderName`Additional path from the webpack dist to the image output files

`rulesInclude` Array of paths to use in the include property of module rules inside the webpack config

`buildCallback` The callback function to execute when the webpack compiler was finished

## Export Webpack Configuration

To get the webpack configuration simply call ```npx flamingo-carotene exportWebpackConfig```

## List of Flamingo Carotene webpack modules
- [flamingo-carotene-babel](../flamingo-carotene-babel)
- [flamingo-carotene-es-lint](../flamingo-carotene-es-lint)
- [flamingo-carotene-postcss](../flamingo-carotene-postcss)
- [flamingo-carotene-webpack-svg-sprite](../flamingo-carotene-webpack-svg-sprite)
