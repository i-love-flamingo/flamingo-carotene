const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

import Behavior from './../src/behavior.js'
import * as behaviorModulesBabelGlob from './fixtures/behaviors/*.behavior.js'

// Simulating Webpack import-glob
// import behaviorModulesGlob from './fixtures/behaviors/*.behavior.js'
import behaviorModulesGlob1 from './fixtures/behaviors/test1.behavior.js'
import behaviorModulesGlob3 from './fixtures/behaviors/test3.behavior.js'
const behaviorModulesGlob = [behaviorModulesGlob1, behaviorModulesGlob3]


function loadTestDom(fixtureName) {
	const html = fs.readFileSync(__dirname + '/fixtures/' + fixtureName, 'utf8')
	const dom = new JSDOM(html);
	const document = dom.window.document;
	return dom.window.document;
}

test('behaviors are working with babel globbing', () => {
	let fixture = loadTestDom('fixture.html');

	let test1Content = fixture.getElementById('test1').textContent
	let test2Content = fixture.getElementById('test2').textContent
	let test3Content = fixture.getElementById('test3').textContent
	expect(test1Content).toBe('ORIGINALCONTENT1');
	expect(test2Content).toBe('ORIGINALCONTENT2');
	expect(test3Content).toBe('ORIGINALCONTENT3');

	const behavior = new Behavior(behaviorModulesBabelGlob)
	behavior.attachBehaviors(fixture)

	test1Content = fixture.getElementById('test1').textContent
	expect(test1Content).toBe('Text changed by Behavior (Test)');

	expect(test2Content).toBe('ORIGINALCONTENT2');

	test3Content = fixture.getElementById('test3').textContent
	expect(test3Content).toBe('Text changed by Behavior (Test3)');

});

test('behaviors are working with normal globbing', () => {
	let fixture = loadTestDom('fixture.html');

	let test1Content = fixture.getElementById('test1').textContent
	let test2Content = fixture.getElementById('test2').textContent
	let test3Content = fixture.getElementById('test3').textContent
	expect(test1Content).toBe('ORIGINALCONTENT1');
	expect(test2Content).toBe('ORIGINALCONTENT2');
	expect(test3Content).toBe('ORIGINALCONTENT3');

	const behavior = new Behavior(behaviorModulesGlob)
	behavior.attachBehaviors(fixture)

	test1Content = fixture.getElementById('test1').textContent
	expect(test1Content).toBe('Text changed by Behavior (Test)');

	expect(test2Content).toBe('ORIGINALCONTENT2');

	test3Content = fixture.getElementById('test3').textContent
	expect(test3Content).toBe('Text changed by Behavior (Test3)');

});


// console.log(li.getAttribute('style'))