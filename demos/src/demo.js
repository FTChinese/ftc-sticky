import Sticky, {Scrollmation} from '../../main.js';

const stickyNav = new Sticky('.o-nav');
console.log(stickyNav);

const scrollmation = Scrollmation.init(null, {
	offset: 50
});

console.log(scrollmation);
