vmf.ns.use("ice");
ice.eaSelector.impl={
	beforeEaSelectorChange:function(){
		//no implementation required
		ice.managelicense.updateFilterLabelDropDown('');
		ice.managelicense.eaLabelsFlag = false;
	},
	afterEaSelectorChange_success:function(){
		ice.managelicense.createFolderFlg = null;
		ice.managelicense.handleFolderTree();
	},
	afterEaSelectorChange_error:function(){
		alert(eaSelectorDropDownErrorMsg);
	}
};
