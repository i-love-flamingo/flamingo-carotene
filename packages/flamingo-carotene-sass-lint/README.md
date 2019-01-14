# Module `flamingo-carotene-sass-lint`
This package makes usage of a sass linter to ensure a basic level of code quality and coding standards within a project.

## How to use
```
yarn add flamingo-carotene-sass-lint -D
```

The sass lint module will listen to the following commands: `lint`, `build`, `watchWebpackCss`.

## How it works
A child process will be opened to execute the linting of the sass files.
