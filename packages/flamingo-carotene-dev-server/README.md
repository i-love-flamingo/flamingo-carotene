# Module `flamingo-carotene-dev-server`
The dev server module is there to make the development of a flamingo-carotene frontend easier.

It includes the functionality to register [chokidar](https://github.com/paulmillr/chokidar) file watchers and dispatch
commands when these noticed a change.

In addition to that a [socket.io](https://github.com/socketio/socket.io) socket will be opened and its client will be
injected into the webpack config (if available) to automatically reload the browser after a potential successful
rebuild.

The `NODE_ENV` is set to `development` when executing the dev servers command.

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
    path.join(config.paths.src, '**', '*.ext')
  ],
  'command': 'commandName',
  'callbackKey': 'configKey',
  'watcherConfig': {
    ignored: /(^|[/\\])\../ // dot files or folders
  },
  'unwatchConfig': path.join(config.paths.src, '**', 'special.ext')
}
```
`watchId` A unique id (at least in your project) to identify the file watcher.

`path` The glob paths that the file watcher should check for file changes.

`command` The command that will be dispatched when a file change was recognized.

`callbackKey` A key from the config where to find a buildCallback function. Only one level supported yet,
e.g. when your callback function is located here: config.myKey.buildCallback the callbackKey would be 'myKey'. This
function is also used to allow the rebuild functionality when changes are made during a running build.

`watcherConfig` (optional) A custom config object for this chokidar file watcher.

`unwatchConfig` (optional) string or array of strings of file-, folder-, or glob-paths

The watcher configurations will be automatically gathered by the dev server by calling the `getWatchers`
function, that must be provided by your module to expose your watcher configs.

## How to configure
This module exposes the following config
```
config.devServer = {
  port: 3000
}
```
`port` The port of the dev server is used for the socket connection to the client.

## How socket client injection works
The socket client will be injected into the webpack config's entries. If you have more that one entry for js, every
will get the ability to open its socket to the server on execution. When the dev command was dispatched and the last
build was no dev build - no socket client was injected - the js watcher command will be triggered right away to ensure
that the next page load will have the ability to communicate via the socket.
