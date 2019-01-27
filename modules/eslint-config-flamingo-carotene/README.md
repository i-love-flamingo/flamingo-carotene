# Module `eslint-config-flamingo-carotene`
This package provides a Flamingo-Carotene [ESLint](https://github.com/eslint/eslint) config that can also be used and
extended inside your projects.

## How to use
```
npm i -D eslint-config-flamingo-carotene
```

To extend the config simply use the extend property of the ESLint config file.

```
module.exports = {
  extends: 'flamingo-carotene'
}
```

## How it works
It extends the [eslint-config-standard](https://github.com/standard/eslint-config-standard) and adds some few
configurations.
