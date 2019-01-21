# Module `flamingo-carotene-sass-lint`
This package makes usage of the [sass-lint](https://github.com/sasstools/sass-lint) package to ensure a basic level of
code quality and coding standards within a project.

## How to use
```
yarn add flamingo-carotene-sass-lint -D
```

The sass lint module will listen to the following commands: `lint`, `build`, `watchWebpackCss`.

## How it works
A child process will be opened to execute the linting of the sass files.

## How to configure
This module exposes the following config
```
config.paths.sassLint = __dirname
```
`sassLint` The path to this module in your project

```
config.sassLint = {
  breakOnError: false
}
```
`breakOnError` True to break the process when an error occurred, false to only write it to output. Will be set to true
for production build automatically.
