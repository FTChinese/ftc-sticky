/* eslint-disable no-console */
class Sticky {
	/**
	* Create a sticky instance
	* param { String | HTMLElement } rootEl - The sticky element's container
	* param { Object } config
	* param { String | HTMLElement } config.target - The element to stick
	* param { Number } config.start - Starting point in the viewport. Default 0.
	*/
	constructor(rootEl, config) {
		const targetAttr = 'data-o-sticky-target';
		this.initialized = false;

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

		if (!config) {
			config = {};
		}
// Find the targetEl. If failed, constructor should fail.
		config.target = config.target ? config.target : rootEl.getAttribute(targetAttr);
		
		if (!config.target) {
			console.log('Abort. Sticky target does not exist: ' + this.rootEl);
			return;
		} else if (!(config.target instanceof HTMLElement)) {
			config.target = rootEl.querySelector(config.target);
		}
// Flag to prevent inadvertently changeing data in scroll event.
		this.initialized = true;
		this.rootEl = rootEl;
		this.targetEl = config.target;
	
		this.start = config.start ? config.start : 0;
		if (typeof this.start === 'string') {
			this.start = parseInt(this.start);
		}		
		
// the difference between the height of rootEl and targetEl.
		this.stickyRange = this.rootEl.offsetHeight - this.targetEl.offsetHeight;

// When positive, it means the rootEl is below starting point. At this point this.state == 'top';
// When negative, it means the rootEl is above the starting point.
// -stickyRange < this.displacement < 0: this.state = 'fixed';
// -stickyRange > this.displacement: this.state = 'bottom'.
		this.displacement = this.getDisplacement();
		this.state = '';

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

		this.setTargetElWidth();
		this.updatePosition();
	}
/*
 * @return {Number} - The vector distance from rootEl top to this.start.
 */
	getDisplacement() {
// `getBoundingClientRect()` returns top, left, right, bottom coordinates which are relative to viewport.
// When you scrolled, their value changes.
// this.start does not change, therefore caculation is possible.		
		return this.rootEl.getBoundingClientRect().top - this.start
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

	updatePosition() {
		this.displacement = this.getDisplacement();
		if (this.displacement > 0) {
			this.setState('top');
		} else if (this.displacement < -this.stickyRange) {
			this.setState('bottom');
		} else {
			this.setState('fixed');
		}
	}

	static _winScroll() {
		var updateEvent = new CustomEvent('updatePosition', {
			detail: 'Update Position on Scroll'
		});

		Sticky._stickies.forEach(function(sticky) {
			if (sticky.initialized) {
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
				stickies.push(new Sticky(stickyEl, config));
			}
		}

		return stickies;
	}
}

export default Sticky;