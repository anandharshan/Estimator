vmf.ns.use("ice");
ice.eaSelector.impl={
	beforeEaSelectorChange:function(){
		//no implementation required
	},
	afterEaSelectorChange_success:function(){   
		ice.orderhistory.loadOrderHistory();
	},
	afterEaSelectorChange_error:function(){
		alert(eaSelectorDropDownErrorMsg);
	}
};
