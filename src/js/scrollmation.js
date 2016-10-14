import Sticky from './sticky';

function gatherConfig(el, prefix) {
	const config = {};
	Array.prototype.forEach.call(el.attributes, (attr) => {
		if (attr.name.indexOf(prefix) === 0) {
			const key = attr.name.replace(`${prefix}-`, '');
			try {
				config[key] = JSON.parse(attr.value.replace(/\'/g, '"'));
			} catch (e) {
				config[key] = attr.value;
			}
		}
	});
	return config;
}
/** Turn {'key':'value'} into [{src: 'key', text:'value'}]
 */
function objToArr (obj) {
	const keys = Object.keys(obj)
	return keys.map(key => {
		return {
			src: key,
			text: obj[key]
		}
	});
}

class Scrollmation extends Sticky {
/**
 * Create a scrollmation instance
 * param {String | HTMLElement} rootEl - Scrollmation container
 * param {Object} config
 * param {String | HTMLElement} config.target - The element to stick. Passed to `Sticky` constructor.
 * param {Number} config.offset - Passed to `Stiky`.
 * param {String | HTMLElement} config.image - The img element.
 * param {String | HTMLElement} config.caption - The caption element
 * param {Array} config.assets - The image  path/url for scrollmation.
 */
	constructor(rootEl, opts) {
		const imageAttr = 'data-o-scrollmation-target';
		const imageSetAttr = 'data-o-scrollmation-images';
		if (!rootEl) {
			return;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}

		super(rootEl, opts);
		
		if (!opts) {
			opts = {};
		}

		const config = gatherConfig(rootEl, 'data-o-scrollmation');
// Merge opts into config.
		Object.assign(config, opts);

		this.imageEl = config.image

		if (!this.imageEl) {
			console.log('Abort slide. Image element does not exist.');
			return;
		} else if (!(this.imageEl instanceof HTMLElement)) {
			this.imageEl = rootEl.querySelector(this.imageEl);
		}

		this.captionEl = config.caption;
		if (!(this.captionEl instanceof HTMLElement)) {
			this.captionEl = rootEl.querySelector(this.captionEl);
		}
		
		this.assets = objToArr(config.assets);
		this.interval = this.getInterval();

		this.imageIndex = -1;

		this.updateImage();
// after updateImage() executed, this.targetEl.offsetHeight may change caused by adding text into captionEl, thus you have to reset `this.stickyRange`, which in turn affects updatePosition()'s reference point.
		this.setRange();

// By using custom event we do not need to add another scroll on window.
		this.targetEl.addEventListener('o.DOMRectUpdated', () => {
			this.updateImage();
		});
		this.rootEl.setAttribute('data-o-scrollmation--js', 'true')
	}

	getInterval() {
		var interval = this.stickyRange / this.assets.length;
		if (interval < 4) {
			return 4;
		} else {
			return interval;
		}
	}

	setInterval() {
		this.interval = this.getInterval();
	}

	setImage(index) {
		const asset = this.assets[index];
		if (asset && this.imageIndex !== index) {
				
			if (asset.src) {
				this.imageEl.src = asset.src;
			}
			if (asset.text && this.captionEl) {
				this.captionEl.textContent = asset.text;
			}
			this.imageIndex = index;
		}
	}

	updateImage() {
		switch (this.state) {
			case 'fixed':
				const remainder = Math.floor(Math.abs(this.displacement) / this.interval);
				this.setImage(remainder);
				break;

			case 'bottom':
				this.setImage(this.assets.length - 1);
				break;

			default:
				this.setImage(0);
		}
	}

	static init(el, config) {
		if (!el) {
			el = document.body;
		} else if (!(el instanceof HTMLElement)) {
			if (typeof el === 'object') {
				config = el;
				el = document.body;
			} else {
				el = document.querySelector(el);
			}
		}

		const scrollEls = el.querySelectorAll('[data-o-component="o-scrollmation"]');
		const scrolls = [];
		for (let scrollEl of scrollEls) {
			if (!scrollEl.hasAttribute('data-o-scrollmation--js')) {
				scrolls.push(new Scrollmation(scrollEl, config));
			}	
		}
		return scrolls;
	}
}

export default Scrollmation