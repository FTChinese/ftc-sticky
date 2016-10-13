import Sticky from '../../main.js';

const stickyNav = new Sticky('.o-nav');

console.log(stickyNav);

const stickyAside = new Sticky('.secondary-column__inner', {
	start: 50
});
console.log(stickyAside)