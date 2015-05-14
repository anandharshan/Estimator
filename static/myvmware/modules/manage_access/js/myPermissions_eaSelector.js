vmf.ns.use("ice");
ice.eaSelector.impl={
	beforeEaSelectorChange:function(){
		//no implementation required
	},
	afterEaSelectorChange_success:function(){
		ice.mypermission.createFolderFlg = null;
		ice.mypermission.handleFolderTree();
	},
	afterEaSelectorChange_error:function(){
		ice.mypermission.showExceptionMessages(eaSelectorDropDownErrorMsg);
	}
};
