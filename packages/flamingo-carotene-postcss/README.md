# Module `flamingo-carotene-postcss`

## Description

The postcss module injects a postcss loader into the webpack config of the flamingo-carotene module.

When you want to have your css automatically enriched with postcss, this tiny module helps injecting the corresponding
loader.

## What it does
The loader will check if there is a postcss config file (one of .postcssrc, .postcssrc.json, .postcssrc.yml,
.postcssrc.js, 'postcss.config.js) in the root of your project. When found it will look for a rule with a test of
`\.(sa|sc|c)ss$` (exact match only for now) and inject its loader config after the css-loader.

## How to use
Just ...
```
yarn add flamingo-carotene-postcss -D
```
... and the module will do its job on the config command.
