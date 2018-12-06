# Module flamingo-carotene-pug

This module provides the basic build features for pug templates. It does:
* Build Pug: The result is stored as AST (abstract syntax tree) in the configured dist folder. Ast is understood by flamingo.
* Copy Assets

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
