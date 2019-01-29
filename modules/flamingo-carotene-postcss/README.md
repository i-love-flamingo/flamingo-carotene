# Module `flamingo-carotene-postcss`
The [postcss](https://github.com/postcss/postcss) module injects the
[postcss-loader](https://github.com/postcss/postcss-loader) into the webpack config of the Flamingo Carotene module.

When you want to have your css automatically enriched with postcss, this tiny module helps injecting the corresponding
loader.

## How to use
```
npm i -D flamingo-carotene-postcss
```
The module will do its job on the config command.

## How it works
The module will check if there is a postcss config in the root of your project. When found it will look for a loader
rule with the test of `\.(sa|sc|c)ss$` (exact match only for now) and inject its loader config after the css-loader.

For PostCSS config, the following configs will be found:
- files in the project root with these names: `.postcssrc`, `.postcssrc.json`, `.postcssrc.yml`, `.postcssrc.js`,
`postcss.config.js`

When **no config** was found in your project, this module will use some minor defaults.
- The [autoprefixer](https://github.com/postcss/autoprefixer) plugin will be added. The plugin will respond to the
[browserslist](https://github.com/browserslist/browserslist) config.
- The source map generation will be turned on for production builds.
