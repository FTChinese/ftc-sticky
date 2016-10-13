/* eslint-disable no-console */
class Sticky {
	/**
	* Create a sticky instance
	* param { String | HTMLElement } rootEl - The sticky element's container
	* param { Object } config
	* param { String | HTMLElement } config.target - The element to stick
	* param { Number } config.start - Starting point relative to `rootEl`. Default 0.
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

		if (rootEl.hasAttribute('data-o-sticky--js')) {
			return;
		}

		if (!config) {
			config = {};
		}

		config.target = config.target ? config.target : rootEl.getAttribute(targetAttr);
		
		if (!config.target) {
			console.log('Abort. Sticky target does not exist: ' + this.rootEl);
			return;
		} else if (!(config.target instanceof HTMLElement)) {
			config.target = rootEl.querySelector(config.target);
		}

		this.initialized = true;
		this.rootEl = rootEl;
		this.targetEl = config.target;
// `this.start` is relative to viewport - Sticky should certainly takes effect in the visible area.	
		this.start = config.start ? config.start : 0;
		if (typeof this.start === 'string') {
			this.start = parseInt(this.start);
		}		
	
		const rootRect = rootEl.getBoundingClientRect();
		
// the difference between the height of rootEl and targetEl.
		const stickyRange = this.rootEl.offsetHeight - this.targetEl.offsetHeight;

		this.stickyRange = stickyRange;
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
// `getBoundingClientRect()` returns top, left, right, bottom coordinates which are relative to viewport.
// When you scrolled, their value changes.
		const rectTop = this.rootEl.getBoundingClientRect().top;
// When rectTop > this.start, Sticky should not start.
		if (rectTop > this.start) {
			this.setState('top');
// Sticky starts			
		} else if (rectTop <= this.start) {
// @{ Number } movedDistance - The distance from `rectTop` to `this.start`
			const movedDistance = Math.abs(rectTop - this.start);
// If movedDistance is within the stickyRange, it should be fixed.
			if (movedDistance < this.stickyRange) {
				this.setState('fixed');
			} else {
				this.setState('bottom');
			}
		}
	}

	static _winScroll() {
		Sticky._stickies.forEach(function(sticky) {
			if (sticky.initialized) {
				sticky.updatePosition();
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