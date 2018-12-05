# `flamingo-carotene`

## About Flamingo Carotene

Flamingo Carotene is a collection of yarn (npm) packages that provide features for building pug based frontend.
The packages are "self-registered" - and can be combined and used depending on the project needs.

Basic principles of flamingo carotene are:
1. Indepedent packages: Your are not forced to use "one default" for your project. Instead you can select which feature you want to use. The flamingo carotene packages are well split (having an individual purpose and following high cohasion low coupling principles).
2. No library lock in: By intention the flamingo-carotene does not force you to use some specific frontend framework (like jquery, vue, angular or react).
3. Freedom: As a result of 2. it is possible to use any javascript framework you might consider useful for your project.

There are basicly 2 kind of flamingo-carotene packages:

* __Builder and Build-Helper__
  
  Which can handle some jobs in you build process.

  Examples:
  * flamingo-carotene-es-lint
  * flamingo-carotene-webfont
  
* __Browser Modules__

  Which runs in the browser, and should be part of your project (if needed)

  Examples:
  * flamingo-carotene-behavior
  * flamingo-carotene-state-manager
  
You can easly add a package to your project with:
```
yarn add [PACKAGE-NAME]
``` 
Example:
```
yarn add flamingo-carotene-es-lint  
``` 


## Getting started

If you have an new flamingo project this are the steps to do, to use flamingo-carotene:

### Prepare the Frontend

```
mkdir -p frontend/src
cd frontend
yarn init

yarn add flamingo-carotene-core
yarn add flamingo-carotene-pug


```

This initializes your frontend project:
* flamingo-carotene-core - includes the basic commands and core logic
* flamingo-carotene-pug - includes the Build logi to work with pug


You now can add your first page template with pug:

```
cat frontend/src/page/index.pug
```

And with this command you can start building your frontend:

```
yarn flamingo-carotene build
```

The result is stored in the folder ```frontend/dist```


### Prepare the Flamingo project
You should have a running Flamingo project.

In order to use the generated templates in your flamingo project you need to add the pugtemplate module in your projects main go file:

```
...
import (
    ...
	"flamingo.me/flamingo/core/pugtemplate"
	...
)

...
    []dingo.Module{
        ...
        new(pugtemplate.Module),
        ...
    }

```

### Next Steps

After the first steps you can should continue with:

* [Read more about Atomic Design](/docs/atomic-design.md)
* Use the `flamingo-carotene-webpack` package to use webpack to build JS and CSS
* Use the `flamingo-carotene-dev-server` package to benefit from Hot reloading during development
* Use the `flamingo-carotene-behavior` package to add dynmic javascript for your design components
* Use the `flamingo-carotene-state-manager` package to use the page state pattern to communicate and manage state between design components.


#### Used tools

Read more about the tools used in flamingo carotene packages:

*PUG for templating*
- https://pugjs.org/api/getting-started.html

*Sass for CSS*
- http://sass-lang.com/

*Webpack for Build*
- http://andrewhfarmer.com/webpack-hmr-tutorial/


## How to create a new module

If you want to create a new package, the best way to start is to copy one module, which has the same scope.

You need to be sure, that following exists:
* `.npmrc`
* `package.json`
  with 
  * `publishConfig`
  * `scripts`
    * `test`
    * `build` (optional, for browser module)
* `caroteneModule.js` (this is where the magic happens)

### Create the caroteneModule.js - the M stands for Magic

It's simple and its easy!

#### Example Simple Module Skeleton

```
class MyModuleClass {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()
          // add, change or maniplulate some config values here
        }
      },
      {
        command: 'addBuildCommandTitleHere',
        handler: function (core) {
          // do some stuff here
        }
      },
      ...
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = MyModuleClass 
```

#### Example Module with fileWatcher

```
class MyModuleClass {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()
          // add, change or maniplulate some config values here
          
          config.myModule = {
            callback: null
          }
        }
      },
      {
        command: 'watchMyModule',
        handler: function (core) {
          // do some stuff here when a file has changed
        }
      },
      ...
    ]

    this.watcher = [
      {
        'watchId': 'myModule',
        'path': [
          path.join(config.paths.src, '**', '*.foo')
        ],
        'command': 'watchMyModule',
        'callbackKey': 'myModule'
      }
    ]
  }

  getListeners () {
    return this.listeners
  }

  getWatcherForDevServer () {
    return this.watcher
  }
}

module.exports = MyModuleClass
```

## How to publish

Lint and Test your Stuff 1st!

### Lint all Packages

Inside the main package (flamingo-carotene, the folder where this MD exists) simply run
```
yarn lint
```

### Test all Packages
If there are no linting errors you may call
```
yarn test
```
which iterates over all packages and executes the test script which is defined in the package.json of every package

### Publish with lerna
You can only publish versions if: 
* Your stuff is lint-error-free!
* You've executed all tests (and there are no issues)
* `git-status` reports no dirty workspace

To publish a new version of flamingo-carotene simply execute
```
yarn lerna version
```
It will show you the current version and gives you the ability to select a new one.
While we're in alpha mode, you need to select "Custom Version" - and type in the version number you want to publish. (without the "v" in front).

So - as an example - if the current version is
`v6.0.0-alpha.29` you may want to select `Custom Version` and type in `6.0.0-alpha.30`

The new Version tag will be pushed, and the CIGitlab /CD Pipeline will start
https://gitlab.aoe.com/shared/i-love-flamingo/flamingo-carotene/pipelines

If there are no errors while building, the package will be pushed in the artifactory and is ready to use as dependency in other projects
   






 


