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

        for (let behaviorClassIndex = 0; behaviorClassIndex < listOfBehaviourClasses.length; ++behaviorClassIndex) {
			const behaviorClassObject = listOfBehaviourClasses[behaviorClassIndex];
		    if (behaviorClassObject.hasOwnProperty('default')) {
				const behaviorClass = behaviorClassObject.default
		        const className = behaviorClass.name
				this.behaviours[className] = behaviorClass;
            }
		}
        console.info('Registered behaviors: ', this.behaviours)
    }

    attachBehaviors (domElement) {
        domElement = domElement || document
        const allElements = domElement.querySelectorAll('[data-behavior]')
        for (let behaviorElementIndex = 0; behaviorElementIndex < allElements.length; ++behaviorElementIndex) {
            const behaviorElement = allElements[behaviorElementIndex]
            this.attachBehaviorToElement(behaviorElement)
        }
    }

    attachBehaviorToElement (domElement) {
        console.log('attachBehaviorToElement', domElement)

        if (!domElement) {
            console.log('no valid dom element given', domElement)
            return
        }

        let instance = domElement.flamingoBehaviorInstance
        if (instance) {
            console.error('Element already initialized', instance)
            return
        }

        let behaviorName = domElement.dataset.behavior
		behaviorName = behaviorName.charAt(0).toUpperCase() + behaviorName.slice(1);

		if (!this.behaviours.hasOwnProperty(behaviorName)) {
        	console.error('Behavior "'+behaviorName+'" not registered');
        	return
		}
		const behaviorClass = this.behaviours[behaviorName]
		console.info('initialize behavior "'+behaviorName+'" on domElement', domElement)
        domElement.flamingoBehaviorInstance = new behaviorClass(domElement)
    }

    detachBehaviors (domElement) {

    }


}

module.exports = Behavior
