if (typeof (myvmware) == "undefined")
	myvmware = {};

myvmware.imagecarousel = {
	init : function() {

		var tt, nn;

		$("#promobox").innerfade({
			animationtype : "fade",
			speed : "slow",
			timeout : 6000,
			type : "sequence",
			containerheight : "auto"
		});
	}
};