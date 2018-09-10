"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Behavior =
/*#__PURE__*/
function () {
  /**
   * @param listOfBehaviourClasses
      *
      * listOfBehaviourClasses is an array, which holds "default" classes of behaviors in it
      * 0: default: named function
      * 1: default: named function
      * ...
      *
   */
  function Behavior(listOfBehaviourClasses) {
    _classCallCheck(this, Behavior);

    this.behaviours = {};

    for (var behaviorClassObjectIndex in listOfBehaviourClasses) {
      var behaviorClassObject = listOfBehaviourClasses[behaviorClassObjectIndex];
      console.log('behaviorClassObject', behaviorClassObject);
      var behaviorClass = null; // Support for globbing: import behaviorModules from '...'

      if (behaviorClassObject.hasOwnProperty('__esModule') && behaviorClassObject.__esModule === true) {
        if (behaviorClassObject.hasOwnProperty('default')) {
          behaviorClass = behaviorClassObject.default;
        }
      } else {
        // Support for globbing: import * as behaviorModules from '...'
        behaviorClass = behaviorClassObject;
      }

      if (behaviorClass.hasOwnProperty('name')) {
        var className = behaviorClass.name;
        this.behaviours[className] = behaviorClass;
      }
    }

    console.info('Registered behaviors: ', this.behaviours);
  }
  /**
   * Attachs a Behavior to given domElement (and all children)
   * @param domElement|null
   */


  _createClass(Behavior, [{
    key: "attachBehaviors",
    value: function attachBehaviors(domElement) {
      domElement = domElement || document;
      var allElements = domElement.querySelectorAll('[data-behavior]');

      for (var behaviorElementIndex = 0; behaviorElementIndex < allElements.length; ++behaviorElementIndex) {
        var behaviorElement = allElements[behaviorElementIndex];
        this.attachBehaviorToElement(behaviorElement);
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

      for (var behaviorElementIndex = 0; behaviorElementIndex < allElements.length; ++behaviorElementIndex) {
        var behaviorElement = allElements[behaviorElementIndex];
        this.detachBehaviorsOfElement(behaviorElement);
      }
    }
    /**
     * Attachs a behavior to a given element
     * @param domElement
     */

  }, {
    key: "attachBehaviorToElement",
    value: function attachBehaviorToElement(domElement) {
      if (!domElement) {
        console.error('Behavior: attachBehaviorToElement: No valid domElement given', domElement);
        return;
      }

      var instance = domElement.flamingoBehaviorInstance;

      if (instance) {
        console.error('Behavior: attachBehaviorToElement: Element already initialized', instance);
        return;
      }

      var behaviorName = this.convertBehaviorNameStringToClass(domElement.dataset.behavior);

      if (!this.behaviours.hasOwnProperty(behaviorName)) {
        console.error('Behavior: attachBehaviorToElement: Behavior "' + behaviorName + '" should be attached, but not registered. Check your spelling.');
        return;
      }

      var behaviorClass = this.behaviours[behaviorName];
      console.info('Behavior: attachBehaviorToElement: Initialize behavior "' + behaviorName + '" on domElement', domElement);
      domElement.flamingoBehaviorInstance = new behaviorClass(domElement);
    }
    /**
     *
     * @param domElement
     */

  }, {
    key: "detachBehaviorsOfElement",
    value: function detachBehaviorsOfElement(domElement) {
      if (!domElement) {
        console.error('Behavior: detachBehaviors: No valid domElement given', domElement);
        return;
      }

      var instance = domElement.flamingoBehaviorInstance;

      if (!instance) {
        console.error('Behavior: detachBehaviors: Cant detach element, there is no behavior present.', instance);
        return;
      }

      var behaviorName = instance.name;

      if (typeof instance.destroy !== 'function') {
        console.error('Behavior: detachBehaviors: Cannot call destroy on "' + behaviorName + '" - destructor not found.', domElement);
        return;
      }

      console.info('Behavior: detachBehaviors: Destroy behavior "' + behaviorName + '" on domElement', domElement);
      instance.destroy();
      domElement.flamingoBehaviorInstance = null;
    }
    /**
     *
     * @param behaviorName
     * @returns {string}
     */

  }, {
    key: "convertBehaviorNameStringToClass",
    value: function convertBehaviorNameStringToClass(behaviorName) {
      return behaviorName.charAt(0).toUpperCase() + behaviorName.slice(1);
    }
  }]);

  return Behavior;
}();

module.exports = Behavior;
