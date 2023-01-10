"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 *
 */
var Behavior = /*#__PURE__*/function () {
  /**
   * @param listOfBehaviorClasses
   *
   * Webpack Globbing: import behaviorModules from '*.behavior.js'
   * behaviorClasses is an array, which holds esModules and a "default" class of behaviors in it
   * 0: default: named function
   * 1: default: named function
   * ...
   *
   * OR
   *
   * Babel Globbing: import * as behaviorModules from '*.behavior.js'
   * Object of Classes - result of babel globbing
   * {
   *   anyName: named function
   *   anotherName: named function
   *   ...
   * }
   */
  function Behavior(behaviorClasses) {
    _classCallCheck(this, Behavior);
    /**
     * List of all registered behaviors
     * @type {{}}
     */
    this.behaviors = {};

    /**
     * Internal Flag, which outputs console logs of behavior functionality
     * @type {boolean}
     */
    this.debug = false;
    this.registerBehaviorClasses(behaviorClasses);
  }

  /**
   * Add additional behavior implementations after the Behavior object was initialized
   *
   * @param behaviorClasses
   *
   * Webpack Globbing: import behaviorModules from '*.behavior.js'
   * behaviorClasses is an array, which holds esModules and a "default" class of behaviors in it
   * 0: default: named function
   * 1: default: named function
   * ...
   *
   * OR
   *
   * Babel Globbing: import * as behaviorModules from '*.behavior.js'
   * Object of Classes - result of babel globbing
   * {
   *   anyName: named function
   *   anotherName: named function
   *   ...
   * }
   */
  _createClass(Behavior, [{
    key: "registerBehaviorClasses",
    value: function registerBehaviorClasses(behaviorClasses) {
      for (var behaviorClassObjectIndex in behaviorClasses) {
        var behaviorClassObject = behaviorClasses[behaviorClassObjectIndex];
        var behaviorClass = null;

        // Support for globbing: import behaviorModules from '...'
        if (behaviorClassObject.hasOwnProperty('__esModule') && behaviorClassObject.__esModule === true) {
          if (behaviorClassObject.hasOwnProperty('default')) {
            behaviorClass = behaviorClassObject["default"];
          }
        } else {
          // Support for globbing: import * as behaviorModules from '...'
          behaviorClass = behaviorClassObject;
        }

        // if class has got a name
        if (behaviorClass.name) {
          var className = this._sanitizeName(behaviorClass.name);
          this.behaviors[className] = behaviorClass;
        }
      }
      if (this.debug) {
        console.info("Registered behaviors:", this.behaviors);
      }
    }

    /**
     * Attachs a Behavior to given domElement (and all children)
     * @param domElement|null
     */
  }, {
    key: "attachBehaviors",
    value: function attachBehaviors(domElement) {
      domElement = domElement || document;
      var allElements = domElement.querySelectorAll('[data-behavior]');
      var _iterator = _createForOfIteratorHelper(allElements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var behaviorElement = _step.value;
          this._attachBehaviorToDom(behaviorElement);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * Detach all Behaviors to given domElement (and all children)
     * @param domElement
     */
  }, {
    key: "detachBehaviors",
    value: function detachBehaviors(domElement) {
      domElement = domElement || document;
      var allElements = domElement.querySelectorAll('[data-behavior]');
      var _iterator2 = _createForOfIteratorHelper(allElements),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var behaviorElement = _step2.value;
          this._detachBehaviorsToDom(behaviorElement);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    /**
     * Returns a behavior instance from a dom Element
     * @param domElement
     * @returns {*}
     */
  }, {
    key: "getBehaviorFromElement",
    value: function getBehaviorFromElement(domElement) {
      var instance = null;
      if (domElement.hasOwnProperty('nodeType')) {
        if (this.debug) {
          console.error("Behavior: attachBehaviorToElement: No valid domElement given", domElement);
        }
      }
      if (domElement.hasOwnProperty('behaviorInstance')) {
        instance = domElement.behaviorInstance;
      }
      return instance;
    }

    /**
     * Attachs a behavior to a given dom element
     * @param domElement
     */
  }, {
    key: "_attachBehaviorToDom",
    value: function _attachBehaviorToDom(domElement) {
      var instance = this.getBehaviorFromElement(domElement);
      if (instance) {
        if (this.debug) {
          console.error('Behavior: attachBehaviorToElement: Element already initialized', instance);
        }
        return;
      }
      var behaviorName = this._sanitizeName(domElement.dataset.behavior);
      if (!this.behaviors.hasOwnProperty(behaviorName)) {
        if (this.debug) {
          console.error("Behavior: attachBehaviorToElement: Behavior \"".concat(behaviorName, "\" should be attached, but not registered. Check your spelling."));
        }
        return;
      }
      var BehaviorClass = this.behaviors[behaviorName];
      if (this.debug) {
        console.info("Behavior: attachBehaviorToElement: Initialize behavior \"".concat(behaviorName, "\" on domElement"), domElement);
      }
      domElement.behaviorInstance = {
        name: behaviorName,
        behavior: new BehaviorClass(domElement)
      };
    }

    /**
     * Detach a behavior from a given dom element
     * @param domElement
     */
  }, {
    key: "_detachBehaviorsToDom",
    value: function _detachBehaviorsToDom(domElement) {
      var instance = this.getBehaviorFromElement(domElement);
      if (!instance) {
        if (this.debug) {
          console.error("Behavior: detachBehaviors: Cant detach element, there is no behavior present.", instance);
        }
        return;
      }
      var behaviorName = this._sanitizeName(instance.name);
      if (this.debug) {
        console.info("Behavior: detachBehaviors: Destroy behavior \"".concat(behaviorName, "\" on domElement"), domElement);
      }
      var destroyed = false;

      // check if there is a destroy method
      if (typeof instance.behavior.destroy === 'function') {
        instance.behavior.destroy();
        destroyed = true;
      }

      // check if there is a dispose method
      if (typeof instance.behavior.dispose === 'function') {
        instance.behavior.dispose();
        destroyed = true;
      }
      if (!destroyed) {
        if (this.debug) {
          console.error("Behavior: detachBehaviors: Cannot call destroy/dispose on \"".concat(behaviorName, "\" - methods not found."), domElement);
        }
      }
      domElement.behaviorInstance = null;
    }

    /**
     * Sanatizing Name for Behavior ClassNames and Data Attributes
     * @param {string} behaviorName
     * @returns {string}
     */
  }, {
    key: "_sanitizeName",
    value: function _sanitizeName(behaviorName) {
      return behaviorName.toLowerCase();
    }

    /**
     * Enables Debug Mode
     * @param state {boolean}
     */
  }, {
    key: "setDebug",
    value: function setDebug(state) {
      this.debug = state;
    }
  }]);
  return Behavior;
}();
module.exports = Behavior;
