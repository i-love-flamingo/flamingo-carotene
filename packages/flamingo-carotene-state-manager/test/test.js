import state from './../src/stateManager.js'

const initialState = {
	foo: true,
	bar: {
		foo: 1,
		bar: 2,
    baz: 3
	}
}

state.init(initialState)

test('state cant be initialized more than one time', () => {
  const t = () => {
    state.init({})
  }
  expect(t).toThrow(Error)
});

test('state has correct initial values', () => {
	expect(state.get('foo')).toBe(true);
  expect(state.get('bar.foo')).toBe(1);
  expect(state.get('bar.bar')).toBe(2);
});

test('state watch reports changes correctly', done => {
  const newValue = 15

	state.watch(`bar.foo`, (newState) => {
    expect(newState).toBe(newValue);
    expect(state.get('bar.foo')).toBe(newValue);
    done()
	})
	state.set('bar.foo', newValue)
});

test('unknown state returns undefined', () => {
  expect(state.get('blubber.blah')).toBe(undefined);
});

test('unknown state set triggers watcher', done => {
  const newValue = 'fooobar'

  state.watch(`blubber.blah`, (newState) => {
    expect(newState).toBe(newValue);
    expect(state.get('blubber.blah')).toBe(newValue);
    done()
  })
  state.set('blubber.blah', newValue)
});

