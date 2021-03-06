const assert = require('assert')
const { computePopupPosition, createPopup } = require('../src/popup')
const { JSDOM } = require("jsdom");

describe('computePopupPosition', () => {

	describe(`
 __________________________
|                          |
|       ___                |
|      |___|               |
|       _^_______          |
|      |         |         |
|      |         |         |
|      |_________|         |
|                          |
|__________________________|
		`,
		() => {
			let position
			const targetRect = { x: 50, y: 20, top: 20, right: 60, bottom: 25, left: 50 }
			const popupWidth = 70
			const scroll = { x: 0, y: 0 }
			const viewport = { width: 150, height: 100 }
			before(() => {
				position = computePopupPosition(targetRect, popupWidth,
					scroll.x, scroll.y, viewport.width, viewport.height)
			})
			it('is under the target', () => assert.equal(position.top, 25) )
			it('is left-aligned', () => assert.equal(position.left, 50) )
			it('does not specify right', () => assert.equal(position.right, ''))
			it('does not specify bottom', () => assert.equal(position.bottom, ''))
		}
	)

	describe(`
 __________________________
|                          |
|                   ___    |
|                  |___|   |
|            ________^_    |
|           |          |   |
|           |          |   |
|           |__________|   |
|                          |
|__________________________|
		`,
		() => {
			let position
			const targetRect = { x: 100, y: 20, top: 20, right: 110, bottom: 25, left: 100 }
			const popupWidth = 70
			const scroll = { x: 0, y: 0 }
			const viewport = { width: 150, height: 100 }
			before(() => {
				position = computePopupPosition(targetRect, popupWidth,
					scroll.x, scroll.y, viewport.width, viewport.height)
			})
			it('is under the target', () => assert.equal(position.top, 25) )
			it('is right-aligned', () => assert.equal(position.left, 40) )
			it('does not specify right', () => assert.equal(position.right, ''))
			it('does not specify bottom', () => assert.equal(position.bottom, ''))
		}
	)

	describe(`
 __________________________
|                          |
|       _________          |
|      |         |         |
|      |         |         |
|      |_________|         |
|       _v_                |
|      |___|               |
|                          |
|__________________________|
		`,
		() => {
			let position
			const targetRect = { x: 50, y: 80, top: 80, right: 60, bottom: 90, left: 50 }
			const popupWidth = 70
			const scroll = { x: 0, y: 0 }
			const viewport = { width: 150, height: 100 }
			before(() => {
				position = computePopupPosition(targetRect, popupWidth,
					scroll.x, scroll.y, viewport.width, viewport.height)
			})
			it('is over the target', () => assert.equal(position.bottom, 20) )
			it('is left-aligned', () => assert.equal(position.left, 50) )
			it('does not specify right', () => assert.equal(position.right, ''))
			it('does not specify top', () => assert.equal(position.top, ''))
		}
	)

	describe(`
 __________________________
|                          |
|            __________    |
|           |          |   |
|           |          |   |
|           |__________|   |
|                   _v_    |
|                  |___|   |
|                          |
|__________________________|
		`,
		() => {
			let position
			const targetRect = { x: 100, y: 80, top: 80, right: 110, bottom: 85, left: 100 }
			const popupWidth = 70
			const scroll = { x: 0, y: 0 }
			const viewport = { width: 150, height: 100 }
			before(() => {
				position = computePopupPosition(targetRect, popupWidth,
					scroll.x, scroll.y, viewport.width, viewport.height)
			})
			it('is over the target', () => assert.equal(position.bottom, 20) )
			it('is right-aligned', () => assert.equal(position.left, 40) )
			it('does not specify right', () => assert.equal(position.right, ''))
			it('does not specify top', () => assert.equal(position.top, ''))
		}
	)

	describe(`
 __________________________
|                          |
|       ___                |
|      |___|              ||
|       _^_______         || <- scrollbar
|      |         |        ||
|      |         |         |
|      |_________|         |
|                          |
|__________________________|
		`,
		() => {
			let position
			const targetRect = { x: 50, y: 20, top: 20, right: 60, bottom: 25, left: 50 }
			const popupWidth = 70
			const scroll = { x: 0, y: 10 }
			const viewport = { width: 150, height: 100 }
			before(() => {
				position = computePopupPosition(targetRect, popupWidth,
					scroll.x, scroll.y, viewport.width, viewport.height)
			})
			it('is under the target and includes a scroll offset', () => assert.equal(position.top, 35) )
			it('is left-aligned', () => assert.equal(position.left, 50) )
			it('does not specify right', () => assert.equal(position.right, ''))
			it('does not specify bottom', () => assert.equal(position.bottom, ''))
		}
	)

	describe(`
 __________________________
|                          |
|            __________    |
|           |          |   |
|           |          |   |
|           |__________|   |
|                   _v_    |
|                  |___|   |
|                          |
|__----____________________|
     ^
   scrollbar
		`,
		() => {
			let position
			const targetRect = { x: 100, y: 80, top: 80, right: 110, bottom: 85, left: 100 }
			const popupWidth = 70
			const scroll = { x: 10, y: 0 }
			const viewport = { width: 150, height: 100 }
			before(() => {
				position = computePopupPosition(targetRect, popupWidth,
					scroll.x, scroll.y, viewport.width, viewport.height)
			})
			it('is over the target', () => assert.equal(position.bottom, 20) )
			it('is right-aligned and includes a scroll offset', () => assert.equal(position.left, 50) )
			it('does not specify right', () => assert.equal(position.right, ''))
			it('does not specify top', () => assert.equal(position.top, ''))
		}
	)

})

describe('createPopup', () => {
	let dom,
		popup,
		popupElement

	before(() => {
		dom = new JSDOM(`
			<html>
				<body>
					<span class="target">Cat</span>
					<div class="popup-container" />
				</body>
			</html>
		`)
		const doc = dom.window.document
		popup = createPopup(doc.querySelector('.popup-container'), dom.window)
		popupElement = doc.querySelector('.wp-popup')
	})

	it('adds a hidden popup to the dom', () => {
		assert.equal(popupElement.style.visibility, 'hidden')
	})

	it('shows content next to a target', () => {
		const target = dom.window.document.querySelector('.target')
		popup.show('Hello World', target)
		assert.equal(popupElement.style.visibility, 'visible')
		assert.equal(popupElement.innerHTML, 'Hello World')
	})
})