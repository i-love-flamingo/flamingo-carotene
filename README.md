# `flamingo-carotene`

## Description
Flamingo Carotene is a collection of packages, which are "self-registered" - and can be combined by personal or project needs.

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
   






 


