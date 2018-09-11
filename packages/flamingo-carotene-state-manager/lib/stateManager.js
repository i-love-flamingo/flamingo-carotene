"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _objectPath = require("object-path");

var _reduxWatch = _interopRequireDefault(require("redux-watch"));

var _deepEqual = _interopRequireDefault(require("deep-equal"));

var _stateReducer = require("./stateReducer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Internal wrapper for deepEqual with strict option set
 * @param {Object} value1 First comparand
 * @param {Object} value2 Second comparand
 * @return {Boolean} Result of equality comparison
 */
function deepEqualStrict(value1, value2) {
  return (0, _deepEqual.default)(value1, value2, {
    strict: true
  });
}
/**
 * Application state manager. Can store application wide state information and publish changes.
 */


var State =
/*#__PURE__*/
function () {
  function State() {
    _classCallCheck(this, State);

    this.store = null;
  }
  /**
   * Initialize application state with js-object. To be called only once before usage of state instance.
   * @param {Object} initialState Object containing the initial application state
   * @return {void}
   */


  _createClass(State, [{
    key: "init",
    value: function init(initialState) {
      if (!this.store) {
        this.store = (0, _redux.createStore)(_stateReducer.rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
      } else {
        throw new Error('State: Store is already initialized');
      }
    }
    /**
     * Subscribe to changes in specific parts of the store.
     * @param {String} path String in object notation to store part of interest
     * @param {Function} callback Callback function for store changes
     * @return {Function} Function which can be used to unsubscribe callback
     */

  }, {
    key: "watch",
    value: function watch(path, callback) {
      // check if path param is used as callback without specific path (watch whole store)
      var callbackFunc = typeof path === 'function' ? path : callback;
      var pathStr = typeof path === 'string' ? path : ''; // create watcher and subscribe to store

      var watchFunc = (0, _reduxWatch.default)(this.store.getState, pathStr, deepEqualStrict);
      return this.store.subscribe(watchFunc(callbackFunc));
    }
    /**
     * Get state value by opject path string
     * @param {String} path String in object notation to store value or subtree
     * @return {Object} Value of given object path or undefined
     */

  }, {
    key: "get",
    value: function get() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return (0, _objectPath.get)(this.store.getState(), path);
    }
    /**
     * Set state value of object property defined by object path string
     * @param {String} path String in object notation to store value
     * @param {Object} value Value that should be set to specified path
     * @return {void}
     */

  }, {
    key: "set",
    value: function set(path, value) {
      var currentValue = this.get(path);
      var newValueEqualsCurrentValue = deepEqualStrict(currentValue, value); // Only dispatch action if change occurs

      if (!newValueEqualsCurrentValue) {
        this.store.dispatch({
          type: 'SET: ' + path,
          path: path,
          value: value
        });
      }
    }
  }]);

  return State;
}(); // Export singleton instance


var _default = new State();

exports.default = _default;
