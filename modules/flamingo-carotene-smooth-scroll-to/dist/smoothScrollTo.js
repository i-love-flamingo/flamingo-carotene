"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Scroll the page to a given Y Coordinate or to a dom element
 * Animation is timebased, animation will skip frames, if client could not handle the speed
 * */
var SmoothScrollTo = /*#__PURE__*/function () {
  function SmoothScrollTo() {
    _classCallCheck(this, SmoothScrollTo);

    // animation duration
    this.duration = 500; // Y Position offset to browsers top

    this.offset = 0; // animation update interval

    this.updateInterval = 25; // internal property - starttime of the animation

    this.animationStartTime = null; // interval reference

    this.timer = null; // internal property - when animation was started - target position

    this.currentTargetY = null; // internal property - when animation was started - start position

    this.currentStartY = null; // callback that is called when a animation step was done

    this.animationStepCallback = null; // callback that is called when a animation is finished

    this.finishCallback = null; // config switch - cancel scroll animation, if users manually scrolls while smooth scrolling is active

    this.cancelAnimationOnUserScroll = true; // internal state - is a scrolling currently in progress

    this.scrollingInProgress = false; // the last position to which scrolling happens

    this.lastScrollPosition = null; // direction to which the current scrolling will take place

    this.scrollDirection = null;
    window.onscroll = this.onScrollHandler.bind(this);
  }
  /**
   * Determines the Scroll Direction (up/down)
   *
   * @param fromY
   * @param toY
   * @returns {string}
   */


  _createClass(SmoothScrollTo, [{
    key: "getScrollDirection",
    value: function getScrollDirection(fromY, toY) {
      if (fromY < toY) {
        return 'down';
      } else {
        return 'up';
      }
    }
    /**
     * Event Listener for "onscroll", to detect when user is scrolling...
     * @param event
     */

  }, {
    key: "onScrollHandler",
    value: function onScrollHandler(event) {
      // if no scrolling is in progress by this function - get outta here
      if (!this.scrollingInProgress) {
        return;
      } // if scrolling is not cancelable on manual scrolling - leave instantly


      if (!this.cancelAnimationOnUserScroll) {
        return;
      }

      var currentY = window.pageYOffset;
      var direction = this.getScrollDirection(this.lastScrollPosition, currentY); // scrolling direction changed - stop automatic scrolling

      if (this.scrollDirection !== direction) {
        this.stop();
      }

      this.lastScrollPosition = currentY;
    }
    /**
     * Change the overall animation duration
     *
     * @param {number} duration
     * @returns {SmoothScrollTo}
     */

  }, {
    key: "setDuration",
    value: function setDuration(duration) {
      this.duration = duration;
      return this;
    }
    /**
     * Sets the behaviour, that manually scrolling cancels automatic scrolling
     *
     * @param {boolean} state
     * @returns {SmoothScrollTo}
     */

  }, {
    key: "setCancelAnimationOnUserScroll",
    value: function setCancelAnimationOnUserScroll(state) {
      this.cancelAnimationOnUserScroll = state;
      return this;
    }
    /**
     * Set Scrolling target Offset
     * @param {number} offset
     * @returns {SmoothScrollTo}
     */

  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      this.offset = offset;
      return this;
    }
    /**
     * Set AnimationStep Callback
     * Function will be called with one parameter, which is the instance of this class -> callback(this)
     * @param {function} callback
     * @returns {SmoothScrollTo}
     */

  }, {
    key: "setAnimationStepCallback",
    value: function setAnimationStepCallback(callback) {
      this.animationStepCallback = callback;
      return this;
    }
    /**
     * Sets the currentTargetY
     * This function can be used inside AnimationStepCallback to correct the targetPosition while animation is running
     * @param {number} currentTargetY
     * @returns {SmoothScrollTo}
     */

  }, {
    key: "setCurrentTargetY",
    value: function setCurrentTargetY(currentTargetY) {
      this.currentTargetY = currentTargetY;
      return this;
    }
    /**
     * Returns the current scroll Targetposition if animation is running
     * @returns {number}
     */

  }, {
    key: "getCurrentTargetY",
    value: function getCurrentTargetY() {
      return this.currentTargetY;
    }
    /**
     * Scrolls to a domNode or a position
     * @param {HTMLElement|number} target
     * @returns {SmoothScrollTo}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(target) {
      if (target instanceof HTMLElement) {
        this.scrollToElement(target);
        return this;
      }

      if (typeof target === 'number') {
        this.scrollToY(target);
        return this;
      }

      return this;
    }
    /**
     * Scrolls to position
     * @param {number} scrollY
     */

  }, {
    key: "scrollToY",
    value: function scrollToY(scrollY) {
      this.currentStartY = window.pageYOffset;
      this.currentTargetY = scrollY - this.offset;

      this._startAnimation(this.animationStepCallback);
    }
    /**
     * Scrolls to a domNode
     * @param {HTMLElement} domElement
     */

  }, {
    key: "scrollToElement",
    value: function scrollToElement(domElement) {
      this.currentStartY = window.pageYOffset;
      this.setCurrentTargetY(this._getElementY(domElement) - this.offset);

      this._startAnimation(function () {
        this.setCurrentTargetY(this._getElementY(domElement) - this.offset);

        if (typeof this.animationStepCallback == 'function') {
          this.animationStepCallback(this);
        }
      }.bind(this));
    }
    /**
     * Stops the current animation
     */

  }, {
    key: "stop",
    value: function stop() {
      this.lastScrollPosition = null;
      this.scrollDirection = null;
      this.scrollingInProgress = false;

      if (this.timer !== null) {
        clearInterval(this.timer);

        if (typeof finishCallback === 'function') {
          this.finishCallback(this);
        }
      }
    }
    /**
     * Returns the Y-position (relative to page)
     * @param {HTMLElement} domElement
     * @returns {number}
     * @private
     */

  }, {
    key: "_getElementY",
    value: function _getElementY(domElement) {
      var bounds = domElement.getBoundingClientRect();
      return bounds.top + window.pageYOffset;
    }
    /**
     * Starts the Animation
     * @param {function} afterAnimationStepCallback
     * @private
     */

  }, {
    key: "_startAnimation",
    value: function _startAnimation(afterAnimationStepCallback) {
      var _this = this;

      // stopping running animation (if any)
      this.stop(); // sets animation start time

      this.animationStartTime = new Date().getTime();
      var currentY = window.pageYOffset;
      this.lastScrollPosition = currentY;
      this.scrollingInProgress = true;
      this.scrollDirection = this.getScrollDirection(currentY, this.currentTargetY); // start timer

      this.timer = setInterval(function () {
        var currentTime = new Date().getTime();
        var startTime = _this.animationStartTime;
        var endTime = _this.animationStartTime + _this.duration;
        var scrollToX = window.pageXOffset;
        var scrollToY = _this.currentTargetY; // animation time is up - jump directly to target

        if (currentTime > endTime) {
          window.scrollTo(scrollToX, scrollToY);

          _this.stop(_this.timer);

          return;
        } // animation time is in bounds - calculate timing fraction


        var fraction = (currentTime - startTime) / _this.duration; // correct position fraction with easing (quintEaseOut)

        var easingPower = 5;
        var easingFraction = 1 - Math.abs(Math.pow(fraction - 1, easingPower)); // calculate scrollToY by fraction

        scrollToY = _this._lerp(_this.currentStartY, _this.currentTargetY, easingFraction); // scroll to

        window.scrollTo(scrollToX, scrollToY);

        if (typeof afterAnimationStepCallback === 'function') {
          afterAnimationStepCallback(_this);
        }
      }, this.updateInterval);
    }
    /**
     * Calculates the position of the animation by time
     * @param {number} startY Start position
     * @param {number} targetY Target position
     * @param {number} fraction Position of the animation (value between 0-1) 0 is start, 1 is end
     * @returns {number}
     * @private
     */

  }, {
    key: "_lerp",
    value: function _lerp(startY, targetY, fraction) {
      var diff = targetY - startY;
      var pos = diff * fraction;
      return startY + pos;
    }
  }]);

  return SmoothScrollTo;
}();

module.exports = SmoothScrollTo;
