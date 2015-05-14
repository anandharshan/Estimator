vmf.ns.use("ice");

ice.eaSelector.impl={

	beforeEaSelectorChange:function(){
        $.nofilter = 'nofilter';
		$("#warning-message").remove();
    },
	afterEaSelectorChange_success:function(){
        ice.supportentitlement.getSupportEntListJSON($.nofilter);
	},
	afterEaSelectorChange_error:function(){
        $.eaChangeFailed = 'Change of Entitlement Account has failed';
		ice.supportentitlement.logError($.eaChangeFailed);
	}
};