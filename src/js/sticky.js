/* eslint-disable no-console */
class Sticky {
	/**
	* Create a sticky instance
	* param { String | HTMLElement } rootEl - The sticky element's container
	* param { Object } config
	* param { String | HTMLElement } config.target - The element to stick
	* param { Number } config.offset - Starting point in the viewport. Default 0.
	*/
	constructor(rootEl, config) {
		const targetAttr = 'data-o-sticky-target';

		if (!Sticky._stickies) {
			Sticky._stickies = [];
		}

		if (!rootEl) {
			return;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}
// If rootEl still doest not exist:
		if (!rootEl) {
			return ;
		}
// Avoid modify config.
		if (!config) {
			config = {};
		}

		this.rootEl = rootEl;

		this.targetEl = config.target ? config.target : (rootEl.hasAttribute(targetAttr) ? rootEl.getAttribute(targetAttr) : null);
		
		if (!this.targetEl) {
			console.log('Abort. Sticky target does not exist: ' + this.rootEl);
			return;
		} else if (!(this.targetEl instanceof HTMLElement)) {
			this.targetEl = rootEl.querySelector(this.targetEl);
		}

		this.offset = config.offset ? config.offset : 0;
		if (typeof this.offset === 'string') {
			this.offset = parseInt(this.offset);
		}		
		
// the difference between the height of rootEl and targetEl.
		this.stickyRange = this.getRange();

		console.log('root height', this.rootEl.offsetHeight);
		console.log('target height', this.targetEl.offsetHeight);
		console.log('range', this.stickyRange);

		this.displacement = this.getDisplacement();
		this.state = '';


		this.setTargetElWidth();
		this.updatePosition();
		this.rootEl.setAttribute('data-o-sticky--js', 'true');

		Sticky._stickies.push(this);
/*
 *{Boolean} _listenerAdded - Flag to prevent event added multiple time on window. 
 */
		if (!Sticky._listenerAdded) {
			console.log('Add scroll event on window');
			window.addEventListener('scroll', Sticky._winScroll);
			console.log('Add resize event on window');
			window.addEventListener('resize', Sticky._winResize);

			window.addEventListener('unload', function() {
				window.removeEventListener('scroll', Sticky._winScroll);
				window.removeEventListener('resize', Sticky._winResize);
			});	

			Sticky._listenerAdded = true;
		}		
	}
/*
 * @return {Number} - The vector distance from rootEl top to this.offset.
 */
	getDisplacement() {
// `getBoundingClientRect()` returns top, left, right, bottom coordinates which are relative to viewport. When you scrolled, their value changes.
		return this.rootEl.getBoundingClientRect().top - this.offset
	}

	setDisplacement() {
		this.displacement = this.getDisplacement();
	}

	getRange() {
		return this.rootEl.offsetHeight - this.targetEl.offsetHeight
	}

	setRange() {
		this.stickyRange = this.getRange();
	}
/**
 * @param { String } newState - `top`, `fixed` or `bottom`
 */
	setState(newState) {
		if (this.state !== newState) {
			this.state = newState;
			this.targetEl.setAttribute('aria-sticky', newState);
		}
	}

	setTargetElWidth() {
		this.targetEl.style.width = this.rootEl.offsetWidth + 'px';
	}

// Since updatePosition will be executed in scroll event, avoid calculation dynamically.
	updatePosition() {
// displacement changes on every scroll. Reset it every time.
		this.setDisplacement();
		if (this.displacement > 0) {
			this.setState('top');
		} else if (this.displacement < -this.stickyRange) {
			this.setState('bottom');
		} else {
			this.setState('fixed');
		}
	}

	static _winScroll() {
		var updateEvent = new CustomEvent('o.DOMRectUpdated', {
			detail: 'Update Position on Scroll'
		});

		Sticky._stickies.forEach((sticky) => {
			if (sticky.rootEl.hasAttribute('data-o-sticky--js')) {
				sticky.updatePosition();
				// Dispatch custom event so that related actions could be performed.
				sticky.targetEl.dispatchEvent(updateEvent);
			} else {
				console.log(sticky, ' is not initialized.');
			}
		});
	}

	static _winResize() {
		Sticky._stickies.forEach(function(sticky) {
			sticky.setTargetElWidth();
		});
	}

	static init(el, config) {
		if (!el) {
			el = document.body;
		} else if (!(el instanceof HTMLElement)) {
			el = document.querySelector(el);
		}

		const stickyEls = el.querySelectorAll('[data-o-component="o-sticky"]');
		const stickies = [];
		for (let stickyEl of stickyEls) {
			if (!stickyEl.hasAttribute('data-o-sticky--js')) {
// CAUTION! If you modify config in constructor, you cannot passed config directly here to Sticky. As config is of type object, only	the reference will be passed. Inside the constructor, config was altered, resulting to the fact that subsequent instance after the 1st one will use the altered config data!			
				stickies.push(new Sticky(stickyEl, config));
			}
		}

		return stickies;
	}
}

export default Sticky;