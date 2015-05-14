vmf.ns.use("ice");
ice.eaSelector.impl={
	beforeEaSelectorChange:function(){
		//no implementation required
	},
	afterEaSelectorChange_success:function(){
		ice.manageaccess.clearUserList(null);
        ice.manageaccess.clearContractDetail(null);
        ice.manageaccess.getContractList();
	},
	afterEaSelectorChange_error:function(){
		//ice.ui.showExceptionMessages(eaSelectorDropDownErrorMsg);
        ice.manageaccess.toggleModalError(eaSelectorDropDownErrorMsg, true);
	}
};
