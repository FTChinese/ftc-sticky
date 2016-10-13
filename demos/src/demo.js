import Sticky from '../../main.js';
import Scrollmation from './scrollmation';

const stickyNav = new Sticky('.o-nav');

console.log(stickyNav);

const scrollmation = new Scrollmation('.secondary-column__inner', {
	start: 50
});
console.log(scrollmation);
