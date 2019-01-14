# Module `flamingo-carotene-pug`
The pug module compiles the pug templates in a flamingo-carotene project. It takes all the files defined by a glob
pattern and saves the AST (abstract syntax tree) compilation to the configured dist folder.

The flamingo framework will then take care of rendering these AST files to HTML.

## How to use
```
yarn add flamingo-carotene-pug -D
```

The pug module will listen to the following commands: `buildTemplates`, `build`, `watchPug`.

## How it works
A child process will be opened to execute the compilation of the pug files and store the AST to the configured dist
location.



## Adjust configurations

The module comes with useful defaults, but you can of course adjust them in your theme:
```
  // Where are the pug pages
  config.paths.pug.src = path.join(config.paths.src, 'page')
  //where to put the result
  config.paths.pug.dist = path.join(config.paths.dist, 'template', 'page')
  //which pug files to include
  config.pug.filesPattern = '/{*,.,*/page/*}/{.,*,*/*.partial}/*.pug'
  //which assets should be copied (relative to "asset" folder!)
  config.pug.staticAssetPattern: '/*'
```
