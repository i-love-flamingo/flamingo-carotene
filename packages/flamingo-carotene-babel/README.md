# Module `flamingo-carotene-babel`

## Description

The babel module injects a babel loader into the webpack config of the flamingo-carotene module.

When you want to write ES code that needs to be transpiled to use it in the client, this tiny module helps injecting the corresponding loader.

## What it does
The loader will check if there is a babel config file (one of .babelrc, .babelrc.js, babel.config.js) in the root of your project. When found it will look for a rule with a test of `\.js$` (exact match only for now) and inject its loader config.

## How to use
Just ...
```
yarn add flamingo-carotene-babel -D
```
... and the module will do its job on the config command.
