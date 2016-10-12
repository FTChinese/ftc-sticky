/* eslint-disable no-console */
const stickyRootSelector = '[data-ig-component~="ig-sticky"]';
const stickyTargetSelector = '.ig-sticky-target';

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
			config.target = rootEl.hasAttribute(targetAttr) ? rootEl.getAttribute(targetAttr) : null;
		}
		this.enabled = false;
		
		if (!config.targetEl) {
			console.log('Abort. Sticky target does not exist: ' + this.rootEl);
			return;
		} else if (!(config.target instanceof HTMLElement)) {
			config.target = rootEl.querySelector(config.target);
		}

		this.enabled = true;

		this.targetEl = config.target;
		this.rootEl = rootEl;
	
		const rootRect = rootEl.getBoundingClientRect();
		
// the difference between the height of rootEl and targetEl.
		const stickyRange = rootEl.offsetHeight - targetEl.offsetHeight;

		this.start = config.start ? config.start : 0;
		if (typeof this.start === 'string') {
			this.start = parseInt(this.start);
		}

		this.stickyRange = stickyRange;
		this.state = '';
		this.rootHeight = rootEl.offsetHeight;
		this.targetHeight = targetEl.offsetHeight;

		Sticky._stickies.push(this);

		if (!Sticky._scollListener) {
			window.addEventListener('scroll', function () {
				console.log('scroll event added on window.');
			});
			
			Sticky._scollListener = true;
		}

		this.setTargetElWidth();
		this.updatePosition();
	}

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
		const rectTop = this.rootEl.getBoundingClientRect().top;

		if (rectTop > this.start) {
			this.setState('top');
			
		} else if (rectTop <= this.start) {
			const movedDistance = Math.abs(rectTop - this.start);

			if (movedDistance < this.stickyRange) {
				this.setState('fixed');
			} else {
				this.setState('bottom');
			}
		}
	}

	static init(el) {
		const stickyInstances = [];
		if (!el) {
			el = document.body;
		} else if (!(el instanceof HTMLElement)) {
			el = document.querySelector(el);
		}

		const stickyElements = el.querySelectorAll(stickyRootSelector);
		for (let i = 0; i < stickyElements.length; i++) {
			stickyInstances.push(new Sticky(stickyElements[i]));
		}

		function handleScroll() {
			for (let i = 0, len = stickyInstances.length; i < len; i++) {
				if (stickyInstances[i].enabled) {
					stickyInstances[i].updatePosition();
				} else {
					console.log('Sticky for ', stickyInstances[i], ' is not enabled.');
				}
			}
		}

		function handleResize() {
			for (let i = 0, len = stickyInstances.length; i < len; i++) {
				stickyInstances[i].setTargetElWidth();
			}
		}

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);
		window.addEventListener('unload', function() {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		});

		return stickyInstances;
	}
}

export default Sticky;