# Module `flamingo-carotene-es-lint`
This package makes use of the [ESLint](https://github.com/eslint/eslint) to ensure a basic level of code quality and
coding standards within a project.

## How to use
```
npm i -D flamingo-carotene-es-lint
```
The ESLint module knows of 2 types of working.
1. It integrates into the webpack config by adding the [eslint-loader](https://github.com/webpack-contrib/eslint-loader)
as a preloader for js files. By default this will not break the webpack compiler as it would normally do, even if
linting errors were found, unless you set the `breakOnError` config to true. That is the default.
2. It runs in a child process that will run in parallel to the webpack process. This one will not break the webpack
compile.

The ESLint module will listen to the following commands: `lint`, `build`, `watchWebpackJs`

## How it works
The ESLint module will provide the default [eslint-config-flamingo-carotene](../eslint-config-flamingo-carotene)
ESLint config and a default .eslintignore to let you start right away.

To let you customize the configs, the module searches for all the possibilities to provide config and if it finds one,
it goes with this.

For ESLint config, the following configs will be found:
- `eslintConfig` property inside the package.json
- files in the project root with these names: `.eslintrc`, `.eslintrc.js`, `.eslintrc.yaml`, `.eslintrc.yml`,
`.eslintrc.json`

For ESLint ignore config, the following configs will be found:
- `eslintIgnore` property inside the package.json
- a file in the project root with the name: `.eslintignore`

## How to configure
This module exposes the following config
```
config.paths.eslint = path/to/the/node/module
```
`eslint` The path to this module in your project

```
config.eslint = {
  useWebpackLoader: true,
  breakOnError: false,
  configFilePath: null when found in project || default from module,
  ignoreFilePath: null when found in project || default from module
}
```
`useWebpackLoader` True (default) to use the webpack loader, false to use it standalone

`breakOnError` True to exit the process with code 1 when an error was found and in case the webpack loader is in use,
 break the webpack compile. False to only write it to output. Will be set to true for production build automatically.

`configFilePath` Path to an ESLint config file. Does not have to be provided when using the standard config options
supported by ESLint (see 'How it works').

`ignoreFilePath` Path to an ESLint ignore file. Does not have to be provided when using the standard ignore options
supported by ESLint (see 'How it works').
