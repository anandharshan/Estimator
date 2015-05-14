if (typeof(myvmware) == "undefined")  
	myvmware = {};
	
myvmware.promo = {
	init: function() {
	   $('#promoSlides').css("display","block");
	   jQuery('#promoSlides').slides({
      	   preload: true,
      	   play: 5000,
      	   pause: 2500,
      	   hoverPause: true
    		});
	}
};	