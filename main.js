function Sticky(fixedEl, startDistance, endDistance) {
	const oStikcy = this;
	var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60) }


	function init() {	
		oStikcy.lastPosition = -1;
		if (!startDistance) {
			startDistance = 0;
		}
		oStikcy.start = startDistance;
		oStikcy.end = endDistance;
		if (!(fixedEl instanceof HTMLElement)) {
			fixedEl = document.querySelector(fixedEl);
		}
		oStikcy.fixedEl = fixedEl;
	}

	function loop(){
	    // Avoid calculations if not needed
	    if (oStikcy.lastPosition == window.scrollY) {
	    	console.log(oStikcy.lastPosition);
	        rAF(loop);
	        return false;
	    } else {
	    	oStikcy.lastPosition = window.scrollY;
	    }

	    var withinRange = oStikcy.end ? ((oStikcy.lastPosition > oStikcy.start) && (oStikcy.lastPosition < oStikcy.end)) : (oStikcy.lastPosition > oStikcy.start);

	    if (withinRange) {
	    	oStikcy.fixedEl.setAttribute('aria-sticked', 'true');
	    } else {
	    	oStikcy.fixedEl.removeAttribute('aria-sticked', 'false');
	    }

	    rAF( loop );
	}
	init();
	loop();
}

module.exports = Sticky;