"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 *
 */
var SmoothScrollTo =
/*#__PURE__*/
function () {
  function SmoothScrollTo() {
    _classCallCheck(this, SmoothScrollTo);

    this.duration = 500;
    this.offset = 0;
    this.updateInterval = 25;
    this.animationStartTime = null;
    this.timer = null;
    this.currentTargetY = null;
    this.currentStartY = null;
    this.animationStepCallback = null;
  }

  _createClass(SmoothScrollTo, [{
    key: "setDuration",
    value: function setDuration(duration) {
      this.duration = duration;
      return this;
    }
  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      this.offset = offset;
      return this;
    }
  }, {
    key: "setAnimationStepCallback",
    value: function setAnimationStepCallback(callback) {
      this.animationStepCallback = callback;
      return this;
    }
  }, {
    key: "setCurrentTargetY",
    value: function setCurrentTargetY(currentTargetY) {
      this.currentTargetY = currentTargetY;
      return this;
    }
  }, {
    key: "getCurrentTargetY",
    value: function getCurrentTargetY() {
      return this.currentTargetY;
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(anything) {
      if (anything instanceof HTMLElement) {
        this.scrollToElement(anything);
        return this;
      }

      if (typeof anything === 'number') {
        this.scrollToY(anything);
        return this;
      }

      return this;
    }
  }, {
    key: "scrollToY",
    value: function scrollToY(scrollY) {
      this.currentStartY = window.pageYOffset;
      this.currentTargetY = scrollY - this.offset;

      this._startAnimation(this.animationStepCallback);
    }
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
  }, {
    key: "stop",
    value: function stop() {
      if (this.timer !== null) {
        clearInterval(this.timer);
      }
    }
  }, {
    key: "_getElementY",
    value: function _getElementY(domElement) {
      var bounds = domElement.getBoundingClientRect();
      return bounds.top + window.pageYOffset;
    }
  }, {
    key: "_startAnimation",
    value: function _startAnimation(afterAnimationStepCallback) {
      var _this = this;

      console.log('_startAnimation', this.currentStartY, this.currentTargetY); // stopping running animation (if any)

      this.stop();
      this.animationStartTime = new Date().getTime();
      this.timer = setInterval(function () {
        var currentTime = new Date().getTime();
        var startTime = _this.animationStartTime;
        var endTime = _this.animationStartTime + _this.duration;
        var scrollToX = window.pageXOffset;
        var scrollToY = _this.currentTargetY; // animation time is up - jump directly to target

        if (currentTime > endTime) {
          clearInterval(_this.timer);
          window.scrollTo(scrollToX, scrollToY);
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
