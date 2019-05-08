# Module `flamingo-carotene-smooth-scroll-to`

SmoothScrollTo is a small library, which allows the developer to scroll a page smoothly to a given Y coordinate or to a
given dom element.

## What it is for

Programmatically scrolling a page in a fancy, sparkling, smooth way

## How to use

```bash
npm i -D flamingo-carotene-smooth-scroll-to
```

Import the library
```js
import SmoothScrollTo from 'flamingo-carotene-smooth-scroll-to'
```

Scroll to a given domElement 
```js
const scrollToElement = document.getElementById('fooBar')
new SmoothScrollTo().scrollTo(scrollToElement)
```

or

Scrolling to 500 pixel
```js
new SmoothScrollTo().scrollTo(500)
```

## Setup

You can call different setters to change configuration

### Animation Duration

Use `setDuration()` to change the overall animation time (in ms) 
```js
new SmoothScrollTo().setDuration(1000).scrollTo(500)
```

### Scrolling Offset

Sometimes you dont want to respect the very top of the window (in case of sticky headers or similar).
In this case you can use `setOffset()` to set an offset

```js
new SmoothScrollTo().setOffset(50).scrollTo(500)
```
In this example the scrolling position will be at 450.

## Interrupt, stopping or restarting

You can easily stop the animation by using `stop()`
The current animation will be stopped automatically if you call `scrollTo()` while the animation is running.

Note: the FinishCallback will be fired at both situations.


## Autointerrupt on manual scrolling
By default, the scrolling animation is automatically stopped and canceled if the user (or other code) is scrolling in an opposite direction while the library is scrolling.
Use ```.setCancelAnimationOnUserScroll(false)``` to disable this feature. 

## Animation Callbacks

You can provide 2 callbacks:

* AnimationStepCallback
* FinishCallback

### AnimationStepCallback

The animationStepCallback is called after each animation frame. Inside of this frame you can adjust animation settings,
if you need to change the target or offset values while animating. (i.E. if you've got sticky headers, or elements which
change its size while scrolling)

Note: If you're scrolling to a domElement - you don't need to readjust the target if the position of the target has
changed while the animation runs. In this case the target position will be updated automatically.
You can access the actual target position with `getCurrentTargetY()` and set it by `setCurrentTargetY()`
```js
const sst = new SmoothScrollTo()
  .setOffset(50)
  .setAnimationStepCallback(function(sstInstance) {
    if (somethingHappend) {
      sstInstance.setOffset(100)
    }
  })
  .scrollTo(500)
```

### FinishCallback

As the name suggests - this callback will be fired, if the animation is completed, stopped or restarted
```js
const sst = new SmoothScrollTo()
  .setOffset(50)
  .setFinishCallback(function() {
    // do something here
  })
  .scrollTo(500)
```
