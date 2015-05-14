jQuery.fn.extend({

	/* prop method, which is equivalent to attr method */
	prop: function( selector ){
		return this.attr(selector);
	},

	/* on method, which is similar to live/delegate methods */
	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		return this.live(types, selector, data, fn, /*INTERNAL*/ one);
	}
	
});