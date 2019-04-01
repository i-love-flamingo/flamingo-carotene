# Module `flamingo-carotene-pug-lint`

Flamingo Carotene module for linting pug files. Based on official [pug-lint](https://github.com/pugjs/pug-lint) package.

## How to use

```bash
npm i -D flamingo-carotene-pug-lint
```

The pug-lint module will listen to the following commands: `lint`, `lintPug`, `build`, `watchPug`

You can put a `.pug-lintrc.js` into your project root.

[See list of available rules](https://github.com/pugjs/pug-lint/blob/master/docs/rules.md)

## How it works

A child process will be opened to execute the linting of the pug files.

## How to configure

This module exposes the following config

```js
config.paths.pugLint = __dirname
```

`pugLint` The path to this module in your project

```js
config.pugLint = {
  filesPattern: '/**/*.pug',
  breakOnError: false
}
```

`filesPattern` Glob pattern to find the files inside the src path

`breakOnError` True to break the process when an error occurred, false to only write it to output. Will be set to true
for production build automatically.
