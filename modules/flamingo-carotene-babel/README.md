# Module `flamingo-carotene-babel`
The [babel](https://github.com/babel/babel) module injects the [babel loader](https://github.com/babel/babel-loader)
into the webpack config of the Flamingo Carotene module.

When you want to write ES code that needs to be transpiled to use it in the client, this tiny module helps injecting the
corresponding loader.

## How to use
```
npm i -D flamingo-carotene-babel
```

The babel module will listen to the following commands: _none_.

Every config supported by the used babel version can be used with your custom babel config.

When there is no babel config available, this module provides the
[babel-preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env) as the default preset, so that
you can use it right away.

Babel will respond to the [browserslist](https://github.com/browserslist/browserslist) config.

## How it works
The module will check if there is a babel config available. When found it will look into the compiled webpack config for
a rule with a test of `\.js$` (exact match only for now) and inject its loader config.

As babel config, the following configs will be found:
- `babel` property inside the package.json
- files in the project root with these names: `.babelrc`, `.babelrc.js`, `babel.config.js`
