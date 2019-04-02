# How to Flamingo Carotene Module
This is a guide to understand how the modules work and how you can develop and use your own ones.

## Modules for Tooling
A module that is used for your tooling process will typically go into the `devDependencies` of your project and with
that will not end up in the code you will serve to the client.

Flamingo Carotene is a collection of modules, which are "self-registered" - and can be combined by personal or project
needs.

There are basically 2 kinds of Flamingo Carotene modules:

* __Build and Build-Helper Modules__
  
  Which can handle some jobs in your build process.

  Examples:
  * flamingo-carotene-es-lint
  * flamingo-carotene-webpack
  
* __Client Modules__

  Which runs in the browser, and should be part of your project (if needed)

  Examples:
  * flamingo-carotene-behavior
  * flamingo-carotene-state-manager
  
You can easily add a module to your project with:
```bash
npm i [-D] [MODULE-NAME]
``` 
Example:
```bash
npm i -D flamingo-carotene-es-lint  
``` 

## How to create a new module

If you want to create a new module, the best way to start is to copy one module, which has the same scope.

You need to be sure, that following exists:
* `package.json` with 
  * `scripts`
    * `test`
    * `lint`
    * `build` (optional, for browser module)
* `flamingo-carotene-module.js` (this is where the magic happens)

### Create the flamingo-carotene-module.js - the M stands for Magic

It's simple and its easy!

#### Example Simple Module Skeleton

```js
class MyModuleClass {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()
          // add, change or manipulate some config values here
        }
      },
      {
        command: 'addBuildCommandTitleHere',
        handler: function (core) {
          // do some stuff here
        }
      },
      // ...
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = MyModuleClass 
```

#### Example Module with fileWatcher

```js
class MyModuleClass {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()
          // add, change or manipulate some config values here
          
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
      // ...
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

  getWatchers () {
    return this.watcher
  }
}

module.exports = MyModuleClass
```

## How to publish

Lint and Test your Stuff first!

### Lint all modules

Inside the root directory (flamingo-carotene, the directory where this MD exists) simply run
```bash
npm run lint
```
Lerna will take care of running the lint script in all modules (if available)

### Test all modules
If there are no linting errors you may call
```bash
npm t
```
Lerna will take care of running the test script in all modules (if available)

### Publish with lerna
You can only publish versions if: 
* Your stuff is lint-error-free!
* You've executed all tests (and there are no issues)
* `git-status` reports no dirty workspace

To bump the version of flamingo-carotene modules simply execute
```
npx lerna version
```
It will show you the current version and gives you the ability to select a new one.

So - as an example - if the current version is
`v6.0.1` you may want to select `Patch Version` to bump the version to `v6.0.2`.


After bumping the version of modules you should publish them to the registry.

To do this, execute
```
npx lerna publish
```
This will try to publish all modules.
