# Module `flamingo-carotene-state-manager`

## Description

The state-manager gives you the possibility to set and get states, and watch changes.


## How to initialize
### Import state manager

```
import state from 'flamingo-carotene-state-manager'
```

Note: The state-manager is a singleton and already returns an instance but a class.


### Creating initial state
```
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

```
state.init(initialState)
```

## How to use

### Getting a state

You can get a value of a state by using "get()".
The first parameter is a '.'-notated path of the value inside the state object.
```
state.get('bar.baz')
```

### Setting a state
By calling "set()" you'll set a new value for a key. You can even create new state values with set.

```
state.set('baz.data', 'myNewValue')
```

### Watching a state
You can watch for a state change.
Just call watch() with a key you're like to watch, and the method will be called instantly, when a state change happens. 
The callback will get the newState as the first parameter.

```
state.watch(`baz.data`, (newValue) => {
  console.log('State "baz.data" has changed to new value!', newValue) 
})
```

Note that the newValue is an immutable. So you can't change the state by changing newValue inside the watcher.
To change states, always call "set()". 
