if (typeof ccp == "undefined") ccp = {};
ccp.common = { //Here comes common code.
	toggleButton: function($this, flag){
		if (flag) $this.removeClass("disabled").removeAttr("disabled");
		else $this.addClass("disabled").attr("disabled",true);
	}
};//end of common 