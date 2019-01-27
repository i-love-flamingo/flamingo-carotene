"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 *
 */
var Behavior =
/*#__PURE__*/
function () {
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
        var behaviorClass = null; // Support for globbing: import behaviorModules from '...'

        if (behaviorClassObject.hasOwnProperty('__esModule') && behaviorClassObject.__esModule === true) {
          if (behaviorClassObject.hasOwnProperty('default')) {
            behaviorClass = behaviorClassObject.default;
          }
        } else {
          // Support for globbing: import * as behaviorModules from '...'
          behaviorClass = behaviorClassObject;
        } // if class has got a name


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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = allElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var behaviorElement = _step.value;

          this._attachBehaviorToDom(behaviorElement);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = allElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var behaviorElement = _step2.value;

          this._detachBehaviorsToDom(behaviorElement);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
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

      var destroyed = false; // check if there is a destroy method

      if (typeof instance.behavior.destroy === 'function') {
        instance.behavior.destroy();
        destroyed = true;
      } // check if there is a dispose method


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
