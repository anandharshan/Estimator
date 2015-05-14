/*
 * VMWARE JavaScript Framework - Patterns Abstraction Functionality
 * Author : Tushar Roy
 * Last Modified : Mar 27, 2014
 * 
 * Dependency : vmf-core.js
 *
 * TODO: Refactor/split when/if required
 */


/* 
 * "dateRange" pattern
 * Uses jQuery calendar plugin (loaded as part of core vmf)
 * Parameters:
 * 	el: Mandatory. CSS selector where dateRange would be applied
 * 	param: Optional. Object with additional datepick settings
 */
;(function(vmf, document) {

	if(!vmf.patterns) {
		 return console.error("vmf Core not loaded");
	}

	vmf.patterns.dateRange = function(el, param) {
		try {
			return $(el).datepick( $.extend({
				  rangeSelect: true
			    , monthsToShow: 2
			}, param) );
		} catch (e) {
			vmf.error("Error loading vmf.patterns.dateRange", e);
		}
	};
})(window.vmf = window.vmf || {}, document);