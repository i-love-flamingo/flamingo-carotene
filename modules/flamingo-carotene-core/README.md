# Module `flamingo-carotene-core`

This is the core module of the Flamingo Carotene library. It provides the "flamingo-carotene" command and the logic to
load all the other modules and dispatch commands.

## How to use

Run:
```bash
npm i -D flamingo-carotene-core
```

And you will be able to use the cli tool of Flamingo Carotene.
```text
npx flamingo-carotene {command} [option(s)]

    Commands:
        config
        build

    Options:
        -v        verbose output
```

## How to configure

This module exposes the following config
```js
module.exports = {
  paths: {
    flamingoCarotene: flamingoCarotenePath,
    project: projectPath,
    src: path.join(projectPath, 'src'),
    dist: path.join(projectPath, 'dist')
  }
}
```
Where `carotene` points to this very module in your project and `project` points to the root of your project.

These paths can be changed to your needs via the `config` command and used for other paths that you need inside your
project.

## How it works

The core provides the flamingo-carotene "binary". The binary allows you to execute the flamingo-carotene command via npx.

In general the binary does a couple of things.
1. It gathers all Flamingo Carotene modules used in your project.
1. It executes commands to which all the previously registered Flamingo Carotene modules can apply handlers to.

### Gathering Flamingo Carotene modules

To gather the modules, the binary runs trough your dependencies to find the Flamingo Carotene ones and registers all
modules that have a `flamingo-carotene-module.js`. Additional to that, you can place a `flamingo-carotene-module.js`
file in your project root to apply project logic, just like in any other module you are using.

### Execute Commands

When executing commands, the binary gathers all handlers from the registered modules, gets those for the specified
command, brings them into order and dispatches them.

The name of a command could be any string. As long as there is a handler that is configured to be executed by it, the
command can be dispatched.

For example there is a `build` command with the purpose of building client ready artifacts from your sources and
dependencies.
Therefore every module and your project itself can apply one or more handlers to this command. In these handlers you can
do whatever you like - in that case probably to write files to a dist folder.

And there is the `config` command. The config command is a command like any other. You can apply handlers to it and you
can execute it via the binary. The purpose of this command is to create a configuration object that can be used in any
other command. Every command other than the config command will trigger the config command before itself, so that the
command that is executed will always get the actual config available.

When a handler is executed it gets a core object provided as argument. The core object provides the following:
* `config` The config object that can be edited through the config command
* `cliTools` Some basic tooling for the ease of use of the terminal, such as logging
* `dispatcher` The dispatcher gives the possibility to dispatch a command. It executes every handler in the configured
order
* `modules` A collection of the actual used Flamingo Carotene modules

## Config

Every module can expose the config that it uses to e.g. build its artifacts, so that it can be edited by other modules,
or your project.
For example there is a path config provided by default with some defaults for e.g. the source and dist directories. If your
project structure does not match these paths you can register a handler to the config command to override these configs
to your needs.

```js
{
    command: 'config',
    handler: function (core) {
        const config = core.getConfig()
        config.paths.dist = path.join(config.paths.project, 'build')
    }
}
```
