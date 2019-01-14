# Module `flamingo-carotene-dev-server`
The dev server module is there to make the development of a Flamingo-Carotene frontend easier.
It includes the functionality to register file watchers and dispatch commands when these noticed a change.
In addition to that a socket will be opened and its client will be injected into the webpack config (if available) to
automatically reload the browser after a potential successful rebuild.

## How to use
Get the module by running:
```
yarn add flamingo-carotene-dev-server -D
```

The dev server will listen to the `dev` command.

By executing:
```
yarn flamingo-carotene dev
```
the dev server will start gathering all configured watchers used inside your project and start separate file watchers.

## Setup File Watchers
To set up file watchers you can easily add a `watcher` config to your module definition with the following structure
```
{
    'watchId': 'myId',
    'path': [
      path.join(config.paths.src, '**', '*.myExt')
    ],
    'command': 'myCommand',
    'callbackKey': 'configKey'
}
```
`watchId` A unique id (at least in your project) to identify the file watcher.

`path` The glob paths that the file watcher should check for file changes

`command` The command that will be dispatched when a file change was recognized

`callbackKey` A key from the config where to find a buildCallback function. Only one level supported yet,
e.g. when your callback function is located here: config.myKey.buildCallback the callbackKey would be 'myKey'. This
function is also used to allow the rebuild functionality when changes are made during a running build.

The watcher configurations will be automatically gathered by the dev server by calling the `getWatcherForDevServer`
function, that must be provided by your module to expose your watcher configs.
