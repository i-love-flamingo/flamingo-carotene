# Module `flamingo-carotene-static-asset`

This module provides a simple way to copy assets from the configured source to a destination folder.

## How to use

```bash
npm i -D flamingo-carotene-static-asset
```

The static asset module will listen to the following commands: `build`

## How it works

The module copies all the files and directories that are found inside the given source paths to the configured destinations.

## How to configure

This module exposes the following config
```js
config.staticAsset = {
   assetPaths: [
      {
        dest: '',
        src: ''
      },
      {
        dest: '',
        src: ''
      }
   ],
   basePaths: {
     dest: config.paths.dist,
     src: config.paths.src
   }
 }
```

`basePaths` Takes root paths for a source and a destination paths

`assetPaths` Lists all configured asset paths composed of source and destination paths
src can be a folder or a filename.
