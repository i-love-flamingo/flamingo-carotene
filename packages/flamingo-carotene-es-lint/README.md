# Module `flamingo-carotene-es-lint`
This package makes usage of a Javascript linter to ensure a basic level of code quality and coding standards within a
project.

## How to use
```
yarn add flamingo-carotene-es-lint -D
```
The ESLint module knows of 2 types of working.
1. It integrates into the webpack config by adding a preloader for js files. That way it will break the webpack compiler
when the linting failes. That is the default.
2. It runs in a child process that will run in parallel to the webpack process. This one will not break the webpack
compile.

The ESLint module will listen to the following commands: `lint`, `build`, `watchWebpackJs`

## How it works

The ESLint module will provide the default `eslint-config-flamingo-carotene` ESLint config and a default .eslintignore
to let you start right away.

To let you customize the configs, the module searches for all the possibilities to provide config and if it finds one,
it goes with this.

For ESLint config, the following configs will be found:
- `eslintConfig` property inside the package.json
- files in the project root with these names: `.eslintrc`, `.eslintrc.js`, `.eslintrc.yaml`, `.eslintrc.yml`,
`.eslintrc.json`

For ESLint ignore config, the following configs will be found:
- `eslintIgnore` property inside the package.json
- a file in the project root with the name: `.eslintignore`
