import Sticky from '../../main';

function attrToObject(el, prefix) {
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

class Scrollmation extends Sticky {
/**
 * Create a scrollmation instance
 * param {String | HTMLElement} rootEl - Scrollmation container
 * param {Object} config
 * param {String | HTMLElement} config.target - The element to stick. Passed to `Sticky` constructor.
 * param {Number} config.offset - Passed to `Stiky`.
 * param {String | HTMLElement} config.image - The img element.
 * param {Array} config.assets - The image  path/url for scrollmation.
 * param {Number} config.interval - The distance allocated for each image being visible.
 */
	constructor(rootEl, config) {
		const imageAttr = 'data-o-scrollmation-target';
		const imageSetAttr = 'data-o-scrollmation-images';
		if (!rootEl) {
			return;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}

		super(rootEl, config);
		
		if (!config) {
			config = {};
		}

		const attrConfig = attrToObject(rootEl, 'data-o-scrollmation');

		config = Object.assign(attrConfig, config);

		if (!config.image) {
			console.log('Abort slide. Image element does not exist.');
			return;
		} else if (!(config.image instanceof HTMLElement)) {
			config.image = rootEl.querySelector(config.image);
		}

		this.imageEl = config.image;

		this.interval = (this.stickyRange === 0) ? 0 : this.stickyRange / this.assets.length;

		Object.assign(this, config);

		this.imageIndex = -1;

		this.updateImage();
// By using custom event we do not need to add another scroll on window.
		this.targetEl.addEventListener('updatePosition', () => {
			this.updateImage();
		});
	}

	setImage(index) {
		if (this.imageIndex !== index) {
			const asset = this.assets[index];	
			if (asset.src) {
				this.imageEl.src = asset.src;
			}
			if (asset.caption) {
				this.captionEl.innerHTML = asset.caption;
			}
			this.imageIndex = index;
		}
	}

	updateImage() {
		switch (this.state) {
			case 'fixed':
				this.setImage(Math.floor(Math.abs(this.displacement) / this.interval));
				break;

			case 'bottom':
				this.setImage(this.images.length - 1);
				break;

			default:
				this.setImage(0);
		}
	}
}

export default Scrollmation