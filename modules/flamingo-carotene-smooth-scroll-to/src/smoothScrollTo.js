/**
 * Scroll the page to a given Y Coordinate or to a dom element
 * Animation is timebased, animation will skip frames, if client could not handle the speed
 * */
class SmoothScrollTo {

  constructor () {
    // animation duration
    this.duration = 500

    // Y Position offset to browsers top
    this.offset = 0

    // animation update interval
    this.updateInterval = 25

    // internal property - starttime of the animation
    this.animationStartTime = null

    // interval reference
    this.timer = null

    // internal property - when animation was started - target position
    this.currentTargetY = null

    // internal property - when animation was started - start position
    this.currentStartY = null

    // callback that is called when a animation step was done
    this.animationStepCallback = null

    // callback that is called when a animation is finished
    this.finishCallback = null

    // config switch - cancel scroll animation, if users manually scrolls while smooth scrolling is active
    this.cancelAnimationOnUserScroll = true

    // internal state - is a scrolling currently in progress
    this.scrollingInProgress = false

    // the last position to which scrolling happens
    this.lastScrollPosition = null

    // direction to which the current scrolling will take place
    this.scrollDirection = null
    window.onscroll = this.onScrollHandler.bind(this)
  }

  /**
   * Determines the Scroll Direction (up/down)
   *
   * @param fromY
   * @param toY
   * @returns {string}
   */
  getScrollDirection (fromY, toY) {
    if (fromY < toY) {
      return 'down'
    }
    else {
      return 'up'
    }
  }


  /**
   * Event Listener for "onscroll", to detect when user is scrolling...
   * @param event
   */
  onScrollHandler (event) {
    // if no scrolling is in progress by this function - get outta here
    if (!this.scrollingInProgress) {
      return
    }

    // if scrolling is not cancelable on manual scrolling - leave instantly
    if (!this.cancelAnimationOnUserScroll) {
      return
    }

    const currentY =  window.scrollY
    const direction = this.getScrollDirection(this.lastScrollPosition, currentY)
    // scrolling direction changed - stop automatic scrolling
    if (this.scrollDirection !== direction) {
      this.stop()
    }

    this.lastScrollPosition = currentY
  }

  /**
   * Change the overall animation duration
   *
   * @param {number} duration
   * @returns {SmoothScrollTo}
   */
  setDuration (duration) {
    this.duration = duration
    return this
  }

  /**
   * Sets the behaviour, that manually scrolling cancels automatic scrolling
   *
   * @param {boolean} state
   * @returns {SmoothScrollTo}
   */
  setCancelAnimationOnUserScroll (state) {
    this.cancelAnimationOnUserScroll = state
    return this
  }

  /**
   * Set Scrolling target Offset
   * @param {number} offset
   * @returns {SmoothScrollTo}
   */
  setOffset (offset) {
    this.offset = offset
    return this
  }

  /**
   * Set AnimationStep Callback
   * Function will be called with one parameter, which is the instance of this class -> callback(this)
   * @param {function} callback
   * @returns {SmoothScrollTo}
   */
  setAnimationStepCallback(callback) {
    this.animationStepCallback = callback
    return this
  }

  /**
   * Sets the currentTargetY
   * This function can be used inside AnimationStepCallback to correct the targetPosition while animation is running
   * @param {number} currentTargetY
   * @returns {SmoothScrollTo}
   */
  setCurrentTargetY (currentTargetY) {
    this.currentTargetY = currentTargetY
    return this
  }

  /**
   * Returns the current scroll Targetposition if animation is running
   * @returns {number}
   */
  getCurrentTargetY () {
    return this.currentTargetY
  }

  /**
   * Scrolls to a domNode or a position
   * @param {HTMLElement|number} target
   * @returns {SmoothScrollTo}
   */
  scrollTo(target) {
    if (target instanceof HTMLElement) {
      this.scrollToElement(target)
      return this
    }

    if (typeof target === 'number') {
      this.scrollToY(target)
      return this

    }

    return this
  }

  /**
   * Scrolls to position
   * @param {number} scrollY
   */
  scrollToY (scrollY) {
    this.currentStartY = window.pageYOffset
    this.currentTargetY = scrollY - this.offset
    this._startAnimation(this.animationStepCallback)
  }

  /**
   * Scrolls to a domNode
   * @param {HTMLElement} domElement
   */
  scrollToElement (domElement) {
    this.currentStartY = window.pageYOffset
    this.setCurrentTargetY(this._getElementY(domElement) - this.offset)

    this._startAnimation(function() {
      this.setCurrentTargetY(this._getElementY(domElement) - this.offset)
      if (typeof this.animationStepCallback == 'function') {
        this.animationStepCallback(this)
      }
    }.bind(this))
  }

  /**
   * Stops the current animation
   */
  stop () {
    this.lastScrollPosition = null
    this.scrollDirection = null
    this.scrollingInProgress = false
    if (this.timer !== null) {
      clearInterval(this.timer)
      if (typeof finishCallback === 'function') {
        this.finishCallback(this)
      }
    }
  }

  /**
   * Returns the Y-position (relative to page)
   * @param {HTMLElement} domElement
   * @returns {number}
   * @private
   */
  _getElementY (domElement) {
    const bounds = domElement.getBoundingClientRect()
    return (bounds.top + window.pageYOffset)
  }

  /**
   * Starts the Animation
   * @param {function} afterAnimationStepCallback
   * @private
   */
  _startAnimation (afterAnimationStepCallback) {
    // stopping running animation (if any)
    this.stop()

    // sets animation start time
    this.animationStartTime = new Date().getTime()

    const currentY = window.scrollY
    this.lastScrollPosition = currentY
    this.scrollingInProgress = true
    this.scrollDirection = this.getScrollDirection(currentY, this.currentTargetY)

    // start timer
    this.timer = setInterval(() => {

      const currentTime = new Date().getTime()
      const startTime = this.animationStartTime
      const endTime = this.animationStartTime + this.duration
      const scrollToX = window.pageXOffset
      let scrollToY = this.currentTargetY

      // animation time is up - jump directly to target
      if (currentTime > endTime) {
        window.scrollTo(scrollToX, scrollToY)
        this.stop(this.timer)
        return
      }

      // animation time is in bounds - calculate timing fraction
      const fraction = (currentTime - startTime) / this.duration
      // correct position fraction with easing (quintEaseOut)
      const easingPower = 5
      const easingFraction = 1 - Math.abs(Math.pow(fraction-1, easingPower))

      // calculate scrollToY by fraction
      scrollToY = this._lerp(this.currentStartY, this.currentTargetY, easingFraction)

      // scroll to
      window.scrollTo(scrollToX, scrollToY)
      if (typeof afterAnimationStepCallback === 'function') {
        afterAnimationStepCallback(this)
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
  _lerp (startY, targetY, fraction) {
    const diff = targetY - startY
    const pos = diff * fraction
    return startY + pos
  }
}

module.exports = SmoothScrollTo
