import Sticky from '../../main.js';

const stickyNav = new Sticky('.o-nav');

console.log(stickyNav);

// const stickyAside = new Sticky('.secondary-column__inner', {
// 	start: 50
// });

// const range = stickyAside.stickyRange;
// const targetEl = stickyAside.targetEl;
// const imgEl = targetEl.querySelector('img');
// const imgUrls = imgEl.getAttribute('data-images').trim().split(',');
// console.log(imgUrls);
// const segment = range / imgUrls.length;
// console.log(segment);

// window.addEventListener('scroll', function() {
// 	console.log(stickyAside.state);
// });

class Slide extends Sticky {
	constructor(rootEl, config) {
		const imageAttr = 'data-o-slide-target';
		const imageSetAttr = 'data-images';
		if (!rootEl) {
			return;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}

		super(rootEl, config);
		
		if (!config) {
			config = {};
		}

		config.image = config.image ? config.image : rootEl.getAttribute(imageAttr);

		if (!config.image) {
			console.log('Abort slide. Image element does not exist.');
			return;
		} else if (!(config.image instanceof HTMLElement)) {
			config.image = rootEl.querySelector(config.image);
		}

		this.imageEl = config.image;
		this.images = this.imageEl.getAttribute(imageSetAttr).trim().split(',').map(function(image) {
			return image.trim();
		});

		this.interval = (this.stickyRange === 0) ? 0 : this.stickyRange / this.images.length;
		this.imageIndex = -1;

		this.updateImage();
// By using custom event we do not need to add another scroll on window.
		this.targetEl.addEventListener('updatePosition', () => {
			this.updateImage();
		});
	}

	setImage(index) {
		if (this.imageIndex !== index) {	
			if (this.images[index]) {
				this.imageEl.src = this.images[index];
				this.imageIndex = index;
			}
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

const slide = new Slide('.secondary-column__inner', {
	start: 50
});
console.log(slide);
