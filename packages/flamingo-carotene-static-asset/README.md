# Module `flamingo-carotene-static-asset`
This module provides a simple features to copy Assets from the configured 'src' to 'dist' folder.

## How to use
```
yarn add flamingo-carotene-static-asset -D
```

The static asset module will listen to the following commands: `buildTemplates`, `build`, `watchAsset`

## How it works
The module copies all the files that are found by the configured glob pattern to the dist folder.

## Config
The module comes with useful defaults, but you can of course adjust them in your needs:
```
  //which assets should be copied (relative to "asset" folder!)
  config.staticAsset.staticAssetPattern: '/*'
```
