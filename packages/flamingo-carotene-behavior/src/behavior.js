class Behavior {

	/**
	 * @param listOfBehaviourClasses
     *
     * listOfBehaviourClasses is an array, which holds "default" classes of behaviors in it
     * 0: default: named function
     * 1: default: named function
     * ...
     *
	 */
	constructor (listOfBehaviourClasses) {

	    this.behaviours = {}
		for (let behaviorClassObjectIndex in listOfBehaviourClasses) {

	    	const behaviorClassObject = listOfBehaviourClasses[behaviorClassObjectIndex];
			console.log('behaviorClassObject', behaviorClassObject);

			let behaviorClass = null;

			// Support for globbing: import behaviorModules from '...'
		    if (behaviorClassObject.hasOwnProperty('__esModule') && behaviorClassObject.__esModule === true) {
		    	if (behaviorClassObject.hasOwnProperty('default')) {
					behaviorClass = behaviorClassObject.default
				}
            }
            else {
				// Support for globbing: import * as behaviorModules from '...'
				behaviorClass = behaviorClassObject
			}

			if (behaviorClass.hasOwnProperty('name')) {
				const className = behaviorClass.name
				this.behaviours[className] = behaviorClass;
			}



		}
        console.info('Registered behaviors: ', this.behaviours)
    }

	/**
	 * Attachs a Behavior to given domElement (and all children)
	 * @param domElement|null
	 */
	attachBehaviors (domElement) {
        domElement = domElement || document
        const allElements = domElement.querySelectorAll('[data-behavior]')
        for (let behaviorElementIndex = 0; behaviorElementIndex < allElements.length; ++behaviorElementIndex) {
            const behaviorElement = allElements[behaviorElementIndex]
            this.attachBehaviorToElement(behaviorElement)
        }
    }

	/**
	 * Detach all Behaviors to given domElement (and all children)
	 * @param domElement
	 */
	detachBehaviors (domElement) {
		domElement = domElement || document
		const allElements = domElement.querySelectorAll('[data-behavior]')
		for (let behaviorElementIndex = 0; behaviorElementIndex < allElements.length; ++behaviorElementIndex) {
			const behaviorElement = allElements[behaviorElementIndex]
			this.detachBehaviorsOfElement(behaviorElement)
		}
	}

	/**
	 * Attachs a behavior to a given element
	 * @param domElement
	 */
	attachBehaviorToElement (domElement) {
        if (!domElement) {
            console.error('Behavior: attachBehaviorToElement: No valid domElement given', domElement)
            return
        }

        let instance = domElement.flamingoBehaviorInstance
        if (instance) {
            console.error('Behavior: attachBehaviorToElement: Element already initialized', instance)
            return
        }

        let behaviorName = this.convertBehaviorNameStringToClass(domElement.dataset.behavior)
		if (!this.behaviours.hasOwnProperty(behaviorName)) {
        	console.error('Behavior: attachBehaviorToElement: Behavior "'+behaviorName+'" should be attached, but not registered. Check your spelling.');
        	return
		}
		const behaviorClass = this.behaviours[behaviorName]
		console.info('Behavior: attachBehaviorToElement: Initialize behavior "'+behaviorName+'" on domElement', domElement)
        domElement.flamingoBehaviorInstance = new behaviorClass(domElement)
    }

	/**
	 *
	 * @param domElement
	 */
	detachBehaviorsOfElement (domElement) {
		if (!domElement) {
			console.error('Behavior: detachBehaviors: No valid domElement given', domElement)
			return
		}

		let instance = domElement.flamingoBehaviorInstance
		if (!instance) {
			console.error('Behavior: detachBehaviors: Cant detach element, there is no behavior present.', instance)
			return
		}

		let behaviorName = instance.name

		if (typeof instance.destroy !== 'function') {
			console.error('Behavior: detachBehaviors: Cannot call destroy on "'+behaviorName+'" - destructor not found.', domElement)
			return
		}

		console.info('Behavior: detachBehaviors: Destroy behavior "'+behaviorName+'" on domElement', domElement)
		instance.destroy()
		domElement.flamingoBehaviorInstance = null
	}

	/**
	 *
	 * @param behaviorName
	 * @returns {string}
	 */
	convertBehaviorNameStringToClass(behaviorName) {
		return behaviorName.charAt(0).toUpperCase() + behaviorName.slice(1);
	}
}

module.exports = Behavior
