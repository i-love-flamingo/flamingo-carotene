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

test('state has correct initial values', () => {
	expect(state.get('foo')).toBe(true);
  expect(state.get('bar.foo')).toBe(1);
  expect(state.get('bar.bar')).toBe(2);
});

test('state watch reports changes correctly', done => {
  state.watch(`bar.foo`, (newState) => {
    expect(newState).toBe(15);
    expect(state.get('bar.foo')).toBe(15);
    done()
	})
	state.set('bar.foo', 15)
});


