"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _redux = require("redux");
var _objectPath = require("object-path");
var _reduxWatch = _interopRequireDefault(require("redux-watch"));
var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
var _objectPathImmutable = require("object-path-immutable");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Generic reducer with the ability to set values in the state tree
 * @param state {Object} The current state object
 * @param action
 * @param action.type {String} Generic action type to set value. 'applicationStore.SET' ist the only available action type.
 * @param action.path {String} Path to the part of the state object that should be changed
 * @param action.value {Object} Value of the change
 * @return {Object} The new state object
 */
var rootReducer = function rootReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  if (action.type.startsWith('SET:') && action.path !== undefined) {
    return (0, _objectPathImmutable.wrap)(state).set(action.path, action.value).value();
  }
  return state;
};

/**
 * Application state manager. Can store application wide state information and publish changes.
 */
var State = /*#__PURE__*/function () {
  function State() {
    _classCallCheck(this, State);
    _defineProperty(this, "store", null);
  }
  _createClass(State, [{
    key: "init",
    value:
    /**
     * Initialize application state with js-object. To be called only once before usage of state instance.
     * @param {Object} initialState Object containing the initial application state
     * @return {void}
     */
    function init(initialState) {
      if (this.store) {
        throw new Error('State: Store is already initialized');
      }
      this.store = (0, _redux.createStore)(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
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
      var pathStr = typeof path === 'string' ? path : '';

      // create watcher and subscribe to store
      var watchFunc = (0, _reduxWatch["default"])(this.store.getState, pathStr, _fastDeepEqual["default"]);
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
     * @param {*} value Value that should be set to specified path
     * @return {void}
     */
  }, {
    key: "set",
    value: function set(path, value) {
      if (!(0, _fastDeepEqual["default"])(this.get(path), value)) {
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
exports["default"] = _default;
