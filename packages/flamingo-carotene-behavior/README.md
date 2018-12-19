# Module `flamingo-carotene-behavior`

## Description

The behavior Module is a "DOM-aware" component loader, which loads js-classes automatically and attaches them to dom-elements.

## What it is for

Given, you've got a DOM structure like this: 
```
<div>
    <h1>Click here to see the collapsible content</h1>
    <div class="content">Content of the collapsible</div>
</div>
```
    
And you want to add some javascript behavior to the headline element to toggle visibility of the content element.

Simply add "data-behavior"-attribute to the element group     
```
<div data-behavior="collapsible">
    <h1>Click here to change the collapsible content</h1>
    <div class="content">Content of the collapsible</div>
</div>
```

After that create an ES6 class with the name of the data-attribute (in that case "collapsible")

```
export default class Collapsible {

  constructor (element) {
    // your code here
  }

  dispose () {
    // your code here
  }
}
```
**Note:** The NAME of the class is important here!
The DOM element with the data-behavior attribute is passed to the constructor of your class.

## How to initialize
Initialisation is easy.

### Load the behavior module 

```
import Behavior from 'flamingo-carotene-behavior'
```

### Loading your behaviors

* Load all your behaviors with globbing (the babel-way)

```
import * as behaviorModules from './../../**/*.behavior.js'
```
  
* Load all your behaviors with globbing (the webpack-way)

```
import behaviorModules from './../../**/*.behavior.js'
```
  
* Load all your behaviors manually 

```
import myBehavior from './foo/bar/myBehavior.js'
import anotherBehavior from './xxx/yyy/anotherBehavior.js'
const behaviorModules = {
  'myBehavior': myBehavior,
  'anotherBehavior': anotherBehavior
}
```
  
### Create a behavior instance and pass your behaviors to the constructor

```
const behavior = new Behavior(behaviorModules)
behavior.attachBehaviors() 
```

Done! 

## Debugging

If you've got strange results or behaviors of the behavior module, it is worth to turn on debugging console messages.
Simply add
```
behavior.setDebug(true)
```
after creating the behavior instance.

