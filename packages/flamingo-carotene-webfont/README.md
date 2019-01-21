# Module `flamingo-carotene-webfont`
The webfont module is used to generate a webfont with the webpack compiler. That means, every time the webpack compiler
is running, a webfont is generated with the provided config.

## How to use
```
yarn add flamingo-carotene-webfont -D
```
Setup the webfont configuration as you see in the section below.

Run the webpack compiler by e.g. executing `yarn flamingo-carotene build`.

## How it works
The webfont module adds the [webfont-webpack-plugin](https://github.com/itgalaxy/webfont-webpack-plugin) to the
flamingo-carotene webpack config. With that done the webpack plugin is doing its job whenever the webpack compiler runs.
