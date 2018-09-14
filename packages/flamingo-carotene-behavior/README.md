# `flamingo-carotene-behavior`

## Description

The behavior Module is a "Dom-Aware-Component-Loader".

## What it is for

Given, you've got a DOM Structure like this: 
```
<div>
    <h1>Click here to see the collapsible content</h1>
    <div class="content">Content of the collapsible</div>
</div>
```
    
And you want to add some javascript behavior to the headline element, to toggle visibility of the content element.

Simply add "data-behavior"-attribute to the element group     
```
<div data-behavior="collapsible">
    <h1>Click here to change the collapsible content</h1>
    <div class="content">Content of the collapsible</div>
</div>
```

After that create an ES6 Class with the name of the data-attribute (in that case "collapsible")

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
Note: The NAME of the class is important here!
The Dom-Element with the data-behavior attribute is passed to the constructor of your class.

## How to initialize
Initialisation is easy.

* Load the Behavior Module 

```
import Behavior from 'flamingo-carotene-behavior'
```

* Load all your behaviors with globbing
  
  * The babel-way

```
import * as behaviorModules from './../../**/*.behavior.js'
```
  
  * The webpack-way

```
import behaviorModules from './../../**/*.behavior.js'
```
  
  * do it manually

```
import myBehavior from './foo/bar/myBehavior.js'
import anotherBehavior from './xxx/yyy/anotherBehavior.js'
const behaviorModules = {
  'myBehavior': myBehavior,
  'anotherBehavior': anotherBehavior
}
```
  
* Create a behavior Instance, and pass your behaviors to the constructor

```
const behavior = new Behavior(behaviorModules)
behavior.attachBehaviors() 
```

Done! 

## Debugging

If you've got strange results or behaviors of the Behavior Module it is worth to turn on debugging console messages.
Simply add
```
behavior.setDebug(true)
```
after createing the behavior instance.

