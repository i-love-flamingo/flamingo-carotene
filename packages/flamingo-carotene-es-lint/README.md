# `flamingo-carotene-es-lint`

This package makes usage of a Javascript linter to ensure a basic level of code quality and coding standards within a project.

## Usage
1. Import the package via the package.json like this: `""flamingo-carotene-es-lint": "^6.0.0"`
2. The es linter will be executed via a `yarn build`, `yarn buildTemplate` or `yarn lint` command

## Configuration
The linter will use default config files if no config files can be found in the project folder. These two possibilities exist:
1. Define linter rules: `.eslintrc.js`
2. Define which files and folders should be ignored by the linter: `.eslintignore`