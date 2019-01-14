# Module `flamingo-carotene-webpack`
This module abstracts webpack to have a quite good featured webpack config ready to use with your project.

The initial webpack config will be provided by this module.

When triggered by a command the module creates the webpack compiler and run the config that most likely was extended
through other modules and your own project config.

## How to use
```
yarn add flamingo-carotene-webpack -D
```

Run the webpack compiler by e.g. executing `yarn flamingo-carotene build`.

The webpack module will listen to the following commands: `build`, `buildWebpack`, `buildWebpackJs`, `buildWebpackCss`,
`watchWebpackJs`, `watchWebpackCss`.

## How to configure


## List of flamingo-carotene webpack modules
- flamingo-carotene-babel
- flamingo-carotene-es-lint
- flamingo-carotene-postcss
- flamingo-carotene-webfont
- flamingo-carotene-webpack-svg-sprite
