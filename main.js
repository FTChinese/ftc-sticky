function Sticky(fixedEl, startDistance, endDistance) {
	const oSticky = this;
	var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60) }


	function init() {	
		oSticky.lastPosition = -1;
		if (!startDistance) {
			startDistance = 0;
		}
		oSticky.start = startDistance;
		oSticky.end = endDistance;
		if (!(fixedEl instanceof HTMLElement)) {
			fixedEl = document.querySelector(fixedEl);
		}
		oSticky.fixedEl = fixedEl;
	}

	function loop(){
	    // Avoid calculations if not needed
	    if (oSticky.lastPosition == window.scrollY) {
	    	console.log(oSticky.lastPosition);
	        rAF(loop);
	        return false;
	    } else {
	    	oSticky.lastPosition = window.scrollY;
	    }

	    var withinRange = oSticky.end ? ((oSticky.lastPosition > oSticky.start) && (oSticky.lastPosition < oSticky.end)) : (oSticky.lastPosition > oSticky.start);

	    if (withinRange) {
	    	oSticky.fixedEl.setAttribute('aria-sticked', 'true');
	    } else {
	    	oSticky.fixedEl.removeAttribute('aria-sticked', 'false');
	    }

	    rAF( loop );
	}
	init();
	loop();
}

module.exports = Sticky;