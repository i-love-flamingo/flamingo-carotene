# Module `flamingo-carotene-pug-lint`
Flamingo carotene module for linting pug files. Based on official [pug-lint](https://github.com/pugjs/pug-lint) package.

## How to use
```
yarn add flamingo-carotene-pug-lint -D
```
The pug-lint module will listen to the following commands: `lint`, `build`, `watchPug`

## How it works
A child process will be opened to execute the linting of the pug files.

## Configure
You can put a `.pug-lintrc.js` into your project root.

[See list of available rules](https://github.com/pugjs/pug-lint/blob/master/docs/rules.md)
