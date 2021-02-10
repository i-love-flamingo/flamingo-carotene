import state from './../src/stateManager.js'

describe('State manager', () => {
  const initialState = {
    foo: true,
    bar: {
      foo: 1,
      bar: 2,
      baz: 3
    }
  }

  beforeEach(() => {
    state.init(initialState)
  })

  afterEach(() => {
    state.store = null
  })

  test(`can't be initialized more than one time`, () => {
    const t = () => {
      state.init({})
    }
    expect(t).toThrow(Error)
  })

  test('has correct initial values', () => {
    expect(state.get('foo')).toBe(true)
    expect(state.get('bar.foo')).toBe(1)
    expect(state.get('bar.bar')).toBe(2)
  })

  test('watch function reports changes correctly', done => {
    const newValue = 15
    state.watch(`bar.foo`, (newState) => {
      expect(newState).toBe(newValue)
      expect(state.get('bar.foo')).toBe(newValue)
      done()
    })
    state.set('bar.foo', newValue)
  })

  test('returns undefined when getting unknown state path', () => {
    expect(state.get('blubber.blah')).toBe(undefined)
  })

  test('triggers watcher when setting new unknown path', done => {
    const newValue = 'fooobar'
    state.watch(`blubber.blah`, (newState) => {
      expect(newState).toBe(newValue)
      expect(state.get('blubber.blah')).toBe(newValue)
      done()
    })
    state.set('blubber.blah', newValue)
  })

  test('should not report state change on equal state', () => {
    const mockFn = jest.fn()
    state.watch(`bar.foo`, mockFn)
    state.set('bar.foo', initialState.bar.foo)
    expect(mockFn).not.toHaveBeenCalled()
  })
})
