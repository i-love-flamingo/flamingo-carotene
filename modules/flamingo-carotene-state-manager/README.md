# Module `flamingo-carotene-state-manager`

The state-manager gives you the possibility to set and get states, and watch changes. Under the hood
[redux](https://github.com/reduxjs/redux) is used.

## How to initialize

```bash
npm i -D flamingo-carotene-state-manager
```

### Import state manager

```bash
import state from 'flamingo-carotene-state-manager'
```

Note: The state-manager is a singleton and already returns an instance but a class.

### Creating initial state

```js
const initialState = {
 {
  foo: true,
  bar: {
    foo: 'oof',
    baz: 'zab'
  }
  baz: {
    data: null
  }
}
```

### Initialize class with initial state

```js
state.init(initialState)
```

## How to use

### Getting a state

You can get a value of a state by using `get()`.
The first parameter is a `.`-notated path of the value inside the state object.
```js
state.get('bar.baz')
```

### Setting a state

By calling `set()` you'll set a new value for a key. You can even create new state values with set.

```js
state.set('baz.data', 'myNewValue')
```

To force dispatching the state use ```state.set('baz.data', 'myNewValue', true)``` 

### Watching a state

You can watch for a state change.
Just call `watch()` with a key you're like to watch, and the method will be called instantly, when a state change happens. 
The callback will get the new state as the first parameter.

```js
state.watch(`baz.data`, (newValue) => {
  console.log('State "baz.data" has changed to new value!', newValue) 
})
```

Note that the `newValue` is an immutable. So you can't change the state by changing `newValue` inside the watcher.
To change states, always call `set()`. 
