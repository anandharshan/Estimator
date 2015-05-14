vmf.ns.use("ice");
ice.eaSelector.impl={
	beforeEaSelectorChange:function(){
		//no implementation required
	},
	afterEaSelectorChange_success:function(){
		ice.licensefolderview.createFolderFlg = null;
		ice.licensefolderview.handleFolderTree();
	},
	afterEaSelectorChange_error:function(){
		ice.licensefolderview.showExceptionMessages(eaSelectorDropDownErrorMsg);
	}
};
