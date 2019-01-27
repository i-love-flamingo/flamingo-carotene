# Module `flamingo-carotene-static-asset`
This module provides a simple features to copy Assets from the configured 'src' to 'dist' folder.

## How to use
```
npm i -D flamingo-carotene-static-asset
```

The static asset module will listen to the following commands: `buildTemplates`, `build`, `watchAsset`

## How it works
The module copies all the files that are found by the configured glob pattern to the dist folder.

## How to configure
This module exposes the following config
```
config.staticAsset = {
  staticAssetPattern: '/*',
}
```
`staticAssetPattern` Glob pattern to find the files inside the src path
