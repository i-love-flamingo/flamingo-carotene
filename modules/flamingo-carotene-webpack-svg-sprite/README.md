# Module `flamingo-carotene-webpack-svg-sprite`
This module simplifies the setup, generating and using svg sprites for icons in the Flamingo Carotene environment.
During the build step of Flamingo Carotene we use
[external-svg-sprite-loader](https://github.com/Karify/external-svg-sprite-loader) webpack module to extract all
required svg files into an single svg sprite.

## How to setup

### 1. npm
```
npm i -D flamingo-carotene-webpack-svg-sprite
```

### 2. In your pug
In your base template file you'll need to include the svgIconSprite.pug from this module.
```
include ~flamingo-carotene-webpack-svg-sprite/dist/svgIconSprite
```

### 3. In your sass
If you would like to style your icons then you'll need to @import this in your main index.[sass|scss] file.
```
@import '~flamingo-carotene-webpack-svg-sprite/dist/svgIconSprite'
```

### 4. Register sprite behavior and require svg files
Create app/js/svgIconSprite.js file and import this in your index.js file:

```
import behavior from './behavior'
import svgIconSpriteBehavior from 'flamingo-carotene-webpack-svg-sprite/dist/svgIconSprite.behavior'

behavior.registerBehaviorClasses({
  svgIconSpriteBehavior: svgIconSpriteBehavior
})

import './svgIconSprite/*.svg'
```

The ```import './svgIconSprite/*.svg'``` is the setup for [external-svg-sprite-loader](https://github.com/Karify/external-svg-sprite-loader) webpack module, which collects all svg files in all js files in your project and extracts them into single svgIconSprite.svg file. All svg icons should live in ```frontend/src/app/js/svgIconSprite/*.js```

## How to use

### pug

| Parameter name | Description |
|:---------------|:------------|
|$iconName       | Here you should provide the file name of the svg icon you would like to use. |

For example if you have chevron.svg in your svg icons folder then you can use this icon like this in your pug:
```
+svgIcon('chevron')
```

You could use this as a normal pug mixin and pass any attribute you would like.

### sass
After correctly setting it up, this module provides a sass mixin called +svgSpriteIcon with following parameters:

| Parameter name | Default value | Description
|:---------------|:--------------|:-----------|
|$width          |false          | Width in px can be provided |
|$height         |false          | Height in px can be provided |
|$userRatio      |false          | Useful if you would like to have the icon scaled based on the ratio |            
For example this will style element with class name ```.myLogo```, with ```25px``` width and ```25px``` height and svg filled red:
```
.myLogo
  +svgSpriteIcon(25, 25)
    fill: red
```

#### What is $useRatio for?

If turned on, the wrapping element will get ```padding-top``` with percentage based ratio calculated from the provided width and height.
