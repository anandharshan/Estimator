vmf.ns.use("ice");
ice.eaSelector.impl={
	beforeEaSelectorChange:function(){
		//no implementation required
	},
	afterEaSelectorChange_success:function(){
		ice.ui.createFolderFlg = null;
		ice.ui.loadUsers();
	},
	afterEaSelectorChange_error:function(){
		ice.ui.showExceptionMessages(eaSelectorDropDownErrorMsg);
	}
};
