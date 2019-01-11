# Flamingo Carotene Introduction

## What is it ?
Flamingo-Carotene is an easy to use frontend (-tooling) for projects with the Flamingo framework.

It introduces a modular concept to provide reusable modules and comes with a collection of yarn/npm packages, that provide useful features for frontend development.

Flamingo-Carotene features pug based templating using [atomic design](atomic-design.md) as well as having the option to use webpack and sass for the frontend build.

The basic goals for flamingo-carotene are:

* Provide independent frontend development with productivity tools (pug, sass, ES6, …)
* Provide a standalone build of the frontend to build JS, CSS, Asset etc. This build logic is not depending on flamingo and can be developed independently from flamingo.
* We prefer a styleguide driven development approach, featuring atomic design and following concepts of progressive enhancement

The basic technical design targets of flamingo-carotene are:

1. Independent packages: Your are not forced to use "one default" for your project. Instead you can select which feature you want to use. The flamingo carotene packages are well split (having an individual purpose and following high cohasion low coupling principles).
2. No library lock in: By intention the flamingo-carotene does not force you to use some specific frontend framework (like jquery, vue, angular or react).
3. Freedom: As a result of 2. it is possible to use any javascript framework you might consider useful for your project.

## Getting started:

If you want to use Flamingo Carotene in a Flamingo project - please read  [Getting started with Flamingo Carotene](getting-started.md)


## Flamingo-Carotene and Flamingo
The generated frontend build artefacts plays well together with the flamingo `pugtemplating` flamingo module.

The following picture illustrates this:

![Overview](caroteneoverview.png)

## Flamingo Carotene Modules

Flamingo Carotene Modules are npm/yarn packages that can optionaly have a Flamingo Carotene specific Initialisation file.
They can be added like this:
```bash
yarn add [flamingo-carotene-module-name] [-D]
```

The modules generally differ into two types:

 1. modules responsible for the tooling - e.g. to do something in the build process, like webpack.
 2. modules used in the code you will deliver - e.g. to add some behavior to your website, like state manager.

Every module can come with useful exposed configurations, that allow you to configure it to your wishes.

To understand how modules work or if you want to develop and use your own modules read the [how to module](docs/carotene-modules.md).

### List of official modules
- [eslint-config-flamingo-carotene](../2. Flamingo Carotene Packages/eslint-config-flamingo-carotene.md)
- [flamingo-carotene-babel](../2. Flamingo Carotene Packages/flamingo-carotene-babel.md)
- [flamingo-carotene-behavior](../2. Flamingo Carotene Packages/flamingo-carotene-behavior.md)
- [flamingo-carotene-core](../2. Flamingo Carotene Packages/flamingo-carotene-core.md)
- [flamingo-carotene-dev-server](../2. Flamingo Carotene Packages/flamingo-carotene-dev-server.md)
- [flamingo-carotene-es-lint](../2. Flamingo Carotene Packages/flamingo-carotene-es-lint.md)
- [flamingo-carotene-module](../2. Flamingo Carotene Packages/flamingo-carotene-module.md)
- [flamingo-carotene-postcss](../2. Flamingo Carotene Packages/flamingo-carotene-postcss.md)
- [flamingo-carotene-pug](../2. Flamingo Carotene Packages/flamingo-carotene-pug.md)
- [flamingo-carotene-pug-lint](../2. Flamingo Carotene Packages/flamingo-carotene-pug-lint.md)
- [flamingo-carotene-sass-lint](../2. Flamingo Carotene Packages/flamingo-carotene-sass-lint.md)
- [flamingo-carotene-smooth-scroll-to](../2. Flamingo Carotene Packages/flamingo-carotene-smooth-scroll-to.md)
- [flamingo-carotene-static-asset](../2. Flamingo Carotene Packages/flamingo-carotene-static-asset.md)
- [flamingo-carotene-state-manager](../2. Flamingo Carotene Packages/flamingo-carotene-state-manager.md)
- [flamingo-carotene-webfont](../2. Flamingo Carotene Packages/flamingo-carotene-webfont.md)
- [flamingo-carotene-webpack](../2. Flamingo Carotene Packages/flamingo-carotene-webpack.md)
- [flamingo-carotene-webpack-svg-sprite](../2. Flamingo Carotene Packages/flamingo-carotene-webpack-svg-sprite.md)

