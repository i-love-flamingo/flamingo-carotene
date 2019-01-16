# Module `flamingo-carotene-webpack`
This module abstracts webpack to have a quite good featured webpack config ready to use with your project.

An initial webpack config will be provided by this module.

When triggered by a command the module creates the webpack compiler and run the config that can be extended through
any other module and your own project config.

## How to use
```
yarn add flamingo-carotene-webpack -D
```

Run the webpack compiler by e.g. executing `yarn flamingo-carotene build`.

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

## How to configure


## List of flamingo-carotene webpack modules
- flamingo-carotene-babel
- flamingo-carotene-es-lint
- flamingo-carotene-postcss
- flamingo-carotene-webfont
- flamingo-carotene-webpack-svg-sprite
